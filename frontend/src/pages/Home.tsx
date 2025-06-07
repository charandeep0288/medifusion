import { FaChartLine, FaFileUpload, FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";

import PatientList from "../components/PatientList";
import UploadSection from "../components/UploadSection";
import { mockDocuments } from "../data/documentData";
import { motion } from "framer-motion";
import { usePatientStore } from "../store/patientStore";

const Home = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const { setPatients: setStorePatients } = usePatientStore();

  // Initialize patients from store if available
  useEffect(() => {
    if (patients.length > 0) {
      setStorePatients(patients);
    }
  }, [patients, setStorePatients]);

  // Handle page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear the store only on actual page reload
      if (
        window.performance &&
        window.performance.navigation.type ===
          window.performance.navigation.TYPE_RELOAD
      ) {
        localStorage.removeItem("patient-storage");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleSimulateUpload = async () => {
    setError(undefined);
    const count = files.length || 1;

    // Transform mockDocuments into the format expected by the UI
    const simulatedPatients = mockDocuments.slice(0, count).map((doc) => ({
      id: doc.id,
      name: doc.structured_data.ExtractedData.PatientName,
      dob: doc.structured_data.ExtractedData.DateOfBirth,
      mrn: doc.structured_data.ExtractedData.MRN,
      admissionDate: doc.structured_data.ExtractedData.DateOfAdmission,
      dischargeDate: doc.structured_data.ExtractedData.DateOfDischarge,
      reason: doc.structured_data.ExtractedData.ReasonForAdmission,
      procedures: doc.structured_data.ExtractedData.ProceduresPerformed,
      medications: doc.structured_data.ExtractedData.MedicationsPrescribed,
      condition: doc.structured_data.ExtractedData.PatientConditionAtDischarge,
      documentType: doc.structured_data.DocumentType,
      followUpCare: doc.structured_data.ExtractedData.FollowUpCareInstructions,
    }));

    // Commented out API integration for now, using mock data instead

    try {
      const controller = new AbortController();

      // Create FormData instance
      const formData = new FormData();
      console.log("files", files);

      // Append each file to the FormData
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://3.85.48.230/api/ingestion/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      console.log("Response:", response);

      if (response.status === 429) {
        setError("Rate limited. Please try again later.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("API Response Data:", data);

        if (!data?.results) {
          throw new Error("Invalid response format from server");
        }

        // Transform API response to match our mock data structure
        const transformedPatients = data.results.map((result: any) => {
          const extractedData =
            result.extracted_text.structured_data.ExtractedData;

          // Create a base patient object
          const patient = {
            id: result.filename,
            name: extractedData.PatientName,
            dob: extractedData.DateOfBirth,
            mrn: extractedData.MRN || "N/A",
            admissionDate:
              extractedData.DateOfAdmission ||
              extractedData.Medication?.StartDate ||
              "N/A",
            dischargeDate:
              extractedData.DateOfDischarge ||
              extractedData.Medication?.StopDate ||
              "N/A",
            reason:
              extractedData.ReasonForAdmission ||
              extractedData.Medication?.Instructions ||
              "N/A",
            procedures: Array.isArray(extractedData.ProceduresPerformed)
              ? extractedData.ProceduresPerformed
              : [extractedData.Medication?.Name || "N/A"],
            medications: Array.isArray(extractedData.MedicationsPrescribed)
              ? extractedData.MedicationsPrescribed
              : [extractedData.Medication?.Instructions || "N/A"],
            condition:
              extractedData.PatientConditionAtDischarge ||
              extractedData.PrescriptionStatus ||
              "N/A",
            documentType: result.extracted_text.structured_data.DocumentType,
            followUpCare: extractedData.FollowUpCareInstructions || {
              Medications: extractedData.Medication?.Instructions || "N/A",
              FollowUp: "Please follow up with your healthcare provider",
            },
          };

          return patient;
        });

        console.log("Transformed Patients:", transformedPatients);
        setPatients(transformedPatients);
        setStorePatients(transformedPatients);
      } else {
        // Handle text response
        const text = await response.text();
        console.log("Response Text:", text);
        throw new Error("Unexpected response format from server");
      }
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to process documents. Please try again.");
      }
    }

    // Using mock data instead of API response
    try {
      // Simulate a small delay to mimic API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use the simulated patients data
      setPatients(simulatedPatients);
      setStorePatients(simulatedPatients);
    } catch (error) {
      console.error("Mock data processing failed:", error);
      setError("Failed to process mock data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to MediFusion
          </h1>
          <p className="text-gray-600 text-lg">
            Upload and process your medical documents with AI-powered analysis
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FaFileUpload className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Documents Processed
                </h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {files.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Patients Analyzed
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {patients.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <FaChartLine className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Success Rate
                </h3>
                <p className="text-2xl font-bold text-pink-600">98%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
          >
            <UploadSection
              onSimulateUpload={handleSimulateUpload}
              files={files}
              setFiles={setFiles}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 overflow-hidden"
          >
            <div className="h-[65vh] overflow-y-auto">
              <PatientList patients={patients} error={error} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
