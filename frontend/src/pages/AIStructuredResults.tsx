import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaFileAlt,
  FaSearch,
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-800">
            {patient.incoming.name}
          </h3>
          <p className="text-gray-600 flex items-center gap-2">
            <FaFileAlt className="text-indigo-500" />
            DOB: {patient.incoming.dob}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {patient.review_status === "Confirmed" ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
              <FaCheckCircle className="text-green-500" /> Confirmed
            </span>
          ) : (
            <button
              onClick={() => handleReview(patient)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition-colors"
            >
              <FaExclamationCircle className="text-yellow-500" /> Review
              Required
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaSearch className="text-indigo-500" /> Contact Information
          </h4>
          <div className="space-y-2">
            <p className="text-gray-600">Phone: {patient.incoming.phone}</p>
            <p className="text-gray-600">Email: {patient.incoming.email}</p>
            <p className="text-gray-600">Address: {patient.incoming.address}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaFileAlt className="text-indigo-500" /> Medical Information
          </h4>
          <div className="space-y-2">
            <p className="text-gray-600">Gender: {patient.incoming.gender}</p>
            <p className="text-gray-600">
              Conditions: {patient.incoming.medical_conditions.join(", ")}
            </p>
            <p className="text-gray-600">
              Insurance: {patient.incoming.insurance_number}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Matching Details</h4>
        <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-lg">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium text-indigo-700">Match Method:</span>{" "}
              {patient.method}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-indigo-700">Match Score:</span>{" "}
              {patient.score}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium text-indigo-700">Status:</span>{" "}
              {patient.status}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-indigo-700">SSN:</span>{" "}
              {patient.incoming.ssn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <FaArrowLeft />
            <span>Back to Upload</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <FaExclamationCircle className="text-red-500" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("matched")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === "matched"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaCheckCircle
                className={
                  activeTab === "matched" ? "text-white" : "text-gray-500"
                }
              />
              Matched ({aiResults.matched.length})
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === "review"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaExclamationCircle
                className={
                  activeTab === "review" ? "text-white" : "text-gray-500"
                }
              />
              Review ({aiResults.review.length})
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === "matched"
              ? aiResults.matched.map((patient) => renderPatientCard(patient))
              : aiResults.review.map((patient) => renderPatientCard(patient))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStructuredResults;
