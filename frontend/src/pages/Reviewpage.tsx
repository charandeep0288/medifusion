// src/pages/ReviewPage.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HumanReviewSection from "../components/HumanReviewSection";
import type { MatchedResult } from "../data/mockAIData";
import { usePatientStore } from "../store/patientStore";

// Mock data for fallback
const mockPatientData: MatchedResult = {
  incoming: {
    name: "John Doe",
    dob: "1980-05-15",
    insurance_number: "INS123456",
    medical_conditions: ["Hypertension", "Type 2 Diabetes"],
    phone: "555-0123",
    email: "john.doe@example.com",
    address: "123 Medical St, Healthcare City, HC 12345",
    gender: "Male",
    ssn: "123-45-6789",
  },
  matched_with: {
    id: 1,
    name: "John Doe",
    dob: "1980-05-15",
    insurance_number: "INS123456",
    medical_conditions: "Hypertension, Type 2 Diabetes",
    embedding: null,
  },
  method: "exact",
  score: 95,
  status: "matched",
  review_status: "Pending",
};

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateAIResults } = usePatientStore();
  const patient = (location.state?.patient as MatchedResult) || mockPatientData;

  useEffect(() => {
    console.log("Review page patient data:", patient); // Debug log
  }, [patient]);

  const handleConfirm = (updatedPatient: MatchedResult) => {
    console.log("Confirming patient data:", updatedPatient); // Debug log
    // Update the patient in the store
    updateAIResults(updatedPatient);
    // Navigate back to AI Results
    navigate("/ai-results");
  };

  const handleReject = () => {
    // Navigate back to AI Results
    navigate("/ai-results");
  };

  // Add validation for patient data
  if (!patient || !patient.incoming || !patient.matched_with) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center text-gray-600">
            <h2 className="text-xl font-semibold mb-4">Patient Not Found</h2>
            <p className="mb-4">
              The requested patient record could not be found.
            </p>
            <button
              onClick={() => navigate("/ai-results")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to AI Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HumanReviewSection
        patient={patient}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    </div>
  );
};

export default ReviewPage;
