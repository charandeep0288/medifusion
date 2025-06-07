import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";

import type { MatchedResult } from "../data/mockAIData";
import { mockAIData } from "../data/mockAIData";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../store/patientStore";

const AIStructuredResults = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"matched" | "review">("matched");
  const { aiResults, setAIResults } = usePatientStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only process the mock data if we don't have results in the store
    if (aiResults.matched.length === 0 && aiResults.review.length === 0) {
      const { matched_patients } = mockAIData.summary;
      const matched = matched_patients.filter(
        (p) => p.review_status === "Confirmed"
      );
      const review = matched_patients.filter(
        (p) => p.review_status !== "Confirmed"
      );

      setAIResults(matched, review);
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReview = (patient: MatchedResult) => {
    console.log("Review patient data:", patient); // Debug log
    navigate(`/review/${patient.matched_with.id}`, {
      state: {
        patient: {
          ...patient,
          incoming: {
            name: patient.incoming.name || "Unknown",
            dob: patient.incoming.dob || "Unknown",
            insurance_number: patient.incoming.insurance_number || "Unknown",
            medical_conditions: patient.incoming.medical_conditions || [],
            phone: patient.incoming.phone || "",
            email: patient.incoming.email || "",
            address: patient.incoming.address || "",
            gender: patient.incoming.gender || "",
            ssn: patient.incoming.ssn || "",
          },
          matched_with: {
            ...patient.matched_with,
            id: patient.matched_with.id || 0,
            name: patient.matched_with.name || "Unknown",
            dob: patient.matched_with.dob || "Unknown",
            insurance_number:
              patient.matched_with.insurance_number || "Unknown",
            medical_conditions: patient.matched_with.medical_conditions || "",
            embedding: patient.matched_with.embedding || null,
          },
          method: patient.method || "manual",
          score: patient.score || 0,
          status: patient.status || "pending",
          review_status: patient.review_status || "Pending",
        },
      },
    });
  };

  const handleAIStructure = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use mock data instead of API call
      const { matched_patients } = mockAIData.summary;
      const matched = matched_patients.filter(
        (p) => p.review_status === "Confirmed"
      );
      const review = matched_patients.filter(
        (p) => p.review_status !== "Confirmed"
      );

      setAIResults(matched, review);
    } catch (err) {
      console.error("Error processing AI structure:", err);
      setError("Failed to process AI structure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPatientCard = (patient: MatchedResult) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {patient.incoming.name}
          </h3>
          <p className="text-gray-600">DOB: {patient.incoming.dob}</p>
        </div>
        <div className="flex items-center gap-2">
          {patient.review_status === "Confirmed" ? (
            <span className="flex items-center text-green-600">
              <FaCheckCircle className="mr-1" /> Confirmed
            </span>
          ) : (
            <button
              onClick={() => handleReview(patient)}
              className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              <FaExclamationCircle className="mr-1" /> Review Required
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Contact Information
          </h4>
          <p className="text-gray-600">Phone: {patient.incoming.phone}</p>
          <p className="text-gray-600">Email: {patient.incoming.email}</p>
          <p className="text-gray-600">Address: {patient.incoming.address}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Medical Information
          </h4>
          <p className="text-gray-600">Gender: {patient.incoming.gender}</p>
          <p className="text-gray-600">
            Conditions: {patient.incoming.medical_conditions.join(", ")}
          </p>
          <p className="text-gray-600">
            Insurance: {patient.incoming.insurance_number}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Matching Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Match Method: {patient.method}</p>
            <p className="text-gray-600">Match Score: {patient.score}%</p>
          </div>
          <div>
            <p className="text-gray-600">Status: {patient.status}</p>
            <p className="text-gray-600">SSN: {patient.incoming.ssn}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <FaArrowLeft />
          <span>Back to Upload</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("matched")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "matched"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Matched ({aiResults.matched.length})
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "review"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Review ({aiResults.review.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "matched"
          ? aiResults.matched.map((patient) => renderPatientCard(patient))
          : aiResults.review.map((patient) => renderPatientCard(patient))}
      </div>
    </div>
  );
};

export default AIStructuredResults;
