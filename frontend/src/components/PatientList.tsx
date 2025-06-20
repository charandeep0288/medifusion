import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileMedical,
  FaIdBadge,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaPhone,
  FaPills,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { mockDocuments } from "../data/documentData";
import { usePatientStore } from "../store/patientStore";

interface FollowUpCare {
  Medications: string;
  Diet: string;
  Exercise: string;
  Lifestyle: string;
  FollowUp: string;
}

interface Patient {
  id: string;
  name: string;
  dob: string;
  mrn: string;
  admissionDate: string;
  dischargeDate: string;
  reason: string;
  procedures: string[];
  medications: string[];
  condition: string;
  documentType: string;
  followUpCare: FollowUpCare;
}

interface PatientListProps {
  patients: Patient[];
  onPatientClick?: (patient: Patient) => void;
  onAIStructure?: () => void;
  error?: string;
}

const ITEMS_PER_PAGE = 10;

const PatientList = ({
  patients = [],
  onAIStructure,
  error,
}: PatientListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const { setPatients, aiResults } = usePatientStore();

  // Reset to first page when patients array changes
  useEffect(() => {
    setCurrentPage(1);
  }, [patients]);

  // Persist mock data to store if error
  useEffect(() => {
    if (error) {
      const mockPatients = mockDocuments.map((doc) => ({
        id: doc.id,
        name: doc.structured_data.ExtractedData.PatientName,
        dob: doc.structured_data.ExtractedData.DateOfBirth,
        mrn: doc.structured_data.ExtractedData.MRN,
        admissionDate: doc.structured_data.ExtractedData.DateOfAdmission,
        dischargeDate: doc.structured_data.ExtractedData.DateOfDischarge,
        reason: doc.structured_data.ExtractedData.ReasonForAdmission,
        procedures: doc.structured_data.ExtractedData.ProceduresPerformed,
        medications: doc.structured_data.ExtractedData.MedicationsPrescribed,
        condition:
          doc.structured_data.ExtractedData.PatientConditionAtDischarge,
        documentType: doc.structured_data.DocumentType,
        followUpCare:
          doc.structured_data.ExtractedData.FollowUpCareInstructions,
      }));
      setPatients(mockPatients);
    }
  }, [error, setPatients]);

  // Persist AI results to store when coming from AI Structured Results page
  useEffect(() => {
    if (
      location.pathname === "/" &&
      patients.length === 0 && // Only set if empty
      aiResults &&
      (aiResults.matched.length > 0 || aiResults.review.length > 0)
    ) {
      // Flatten both matched and review arrays for the patient list
      const aiPatients = [...aiResults.matched, ...aiResults.review].map(
        (result, idx) => ({
          id: String(idx + 1),
          name: result.incoming.name,
          dob: result.incoming.dob,
          mrn: result.incoming.insurance_number || "N/A",
          admissionDate: "N/A",
          dischargeDate: "N/A",
          reason: "N/A",
          procedures: [],
          medications: [],
          condition: "N/A",
          documentType: "N/A",
          followUpCare: {
            Medications: "",
            Diet: "",
            Exercise: "",
            Lifestyle: "",
            FollowUp: "",
          },
        })
      );
      setPatients(aiPatients);
    }
  }, [location.pathname, aiResults, setPatients, patients.length]);

  const totalPages = Math.ceil((patients?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems =
    patients?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageButtons = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 5 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages.map((page, idx) =>
      page === "..." ? (
        <span key={idx} className="px-2 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(Number(page))}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-700 hover:bg-blue-100"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  const renderStructuredData = (patient: Patient) => {
    return (
      <div className="mt-4 space-y-4 text-sm border-t pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-blue-800 font-bold mb-3">
                Admission Details
              </h4>
              <p className="flex items-center gap-2 text-gray-800">
                <FaCalendarAlt className="text-blue-600" />
                <span className="font-semibold">Admission Date:</span>{" "}
                <span className="text-gray-900">{patient.admissionDate}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaCalendarAlt className="text-blue-600" />
                <span className="font-semibold">Discharge Date:</span>{" "}
                <span className="text-gray-900">{patient.dischargeDate}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaNotesMedical className="text-blue-600" />
                <span className="font-semibold">Condition:</span>{" "}
                <span className="text-gray-900">{patient.condition}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-blue-800 font-bold mb-3">
                Medical Information
              </h4>
              <p className="flex items-center gap-2 text-gray-800">
                <FaNotesMedical className="text-blue-600" />
                <span className="font-semibold">Reason for Admission:</span>
              </p>
              <p className="text-gray-900 ml-6 mt-1">{patient.reason}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="text-blue-800 font-bold mb-3">
              Procedures Performed
            </h4>
            <ul className="list-disc list-inside text-gray-900 space-y-1">
              {patient.procedures.map((procedure, index) => (
                <li key={index} className="text-gray-900">
                  {procedure}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="text-blue-800 font-bold mb-3">
              Medications Prescribed
            </h4>
            <ul className="list-disc list-inside text-gray-900 space-y-1">
              {patient.medications.map((medication, index) => (
                <li key={index} className="text-gray-900">
                  {medication}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h4 className="text-blue-800 font-bold mb-3">
            Follow-up Care Instructions
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-blue-800">Medications</p>
                <p className="text-gray-900">
                  {patient.followUpCare.Medications}
                </p>
              </div>
              <div>
                <p className="font-semibold text-blue-800">Diet</p>
                <p className="text-gray-900">{patient.followUpCare.Diet}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-blue-800">Exercise</p>
                <p className="text-gray-900">{patient.followUpCare.Exercise}</p>
              </div>
              <div>
                <p className="font-semibold text-blue-800">Lifestyle</p>
                <p className="text-gray-900">
                  {patient.followUpCare.Lifestyle}
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="font-semibold text-blue-800">Follow-up</p>
              <p className="text-gray-900">{patient.followUpCare.FollowUp}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleAIStructure = () => {
    if (onAIStructure) {
      onAIStructure();
    } else {
      setPatients(patients);
      navigate("/ai-results");
    }
  };

  const renderContent = () => {
    if (error) {
      // Instead of showing error, show mock data and the Structure with AI button
      const mockPatients = mockDocuments.map((doc) => ({
        id: doc.id,
        name: doc.structured_data.ExtractedData.PatientName,
        dob: doc.structured_data.ExtractedData.DateOfBirth,
        mrn: doc.structured_data.ExtractedData.MRN,
        admissionDate: doc.structured_data.ExtractedData.DateOfAdmission,
        dischargeDate: doc.structured_data.ExtractedData.DateOfDischarge,
        reason: doc.structured_data.ExtractedData.ReasonForAdmission,
        procedures: doc.structured_data.ExtractedData.ProceduresPerformed,
        medications: doc.structured_data.ExtractedData.MedicationsPrescribed,
        condition:
          doc.structured_data.ExtractedData.PatientConditionAtDischarge,
        documentType: doc.structured_data.DocumentType,
        followUpCare:
          doc.structured_data.ExtractedData.FollowUpCareInstructions,
      }));
      // Pagination logic for mock data
      const totalPages = Math.ceil(
        (mockPatients?.length || 0) / ITEMS_PER_PAGE
      );
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const currentItems =
        mockPatients?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];
      return (
        <>
          <div className="mb-4 text-center text-yellow-600 font-semibold">
            API Error: Showing mock data
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaRobot className="text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    AI Document Structuring
                  </h3>
                  <p className="text-sm text-gray-600">
                    Process all documents with AI to extract structured
                    information
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
                onClick={handleAIStructure}
              >
                <FaRobot className="text-xl" />
                <span>Structure with AI</span>
              </button>
            </div>
          </div>
          {currentItems.length > 0 ? (
            <div className="space-y-4">
              {currentItems.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaUser className="text-blue-600" />
                        {patient.name}
                      </h3>
                      <div className="text-gray-800 text-sm mt-3 space-y-2">
                        <p className="flex items-center gap-2">
                          <FaFileMedical className="text-blue-600" />
                          <span className="font-semibold">MRN:</span>{" "}
                          <span className="text-gray-900">{patient.mrn}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-600" />
                          <span className="font-semibold">DOB:</span>{" "}
                          <span className="text-gray-900">{patient.dob}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaNotesMedical className="text-blue-600" />
                          <span className="font-semibold">
                            Document Type:
                          </span>{" "}
                          <span className="text-gray-900">
                            {patient.documentType}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No mock data available.
            </div>
          )}
          {/* Pagination controls for mock data */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
              >
                Previous
              </button>
              {renderPageButtons()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      );
    }

    if (!patients || patients.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaFileMedical className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Patient Data
          </h3>
          <p className="text-gray-600">
            Upload documents to see patient information
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {patients.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FaRobot className="text-2xl text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        AI Document Structuring
                      </h3>
                      <p className="text-sm text-gray-600">
                        Process all documents with AI to extract structured
                        information
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
                    onClick={handleAIStructure}
                  >
                    <FaRobot className="text-xl" />
                    <span>Structure with AI</span>
                  </button>
                </div>
              </div>
            )}
            {currentItems.map((patient) => (
              <div
                key={patient.id}
                className={`bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ${
                  expandedPatient === patient.id ? "min-h-[200px]" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      {patient.name}
                    </h3>
                    <div className="text-gray-800 text-sm mt-3 space-y-2">
                      <p className="flex items-center gap-2">
                        <FaFileMedical className="text-blue-600" />
                        <span className="font-semibold">MRN:</span>{" "}
                        <span className="text-gray-900">{patient.mrn}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" />
                        <span className="font-semibold">DOB:</span>{" "}
                        <span className="text-gray-900">{patient.dob}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaNotesMedical className="text-blue-600" />
                        <span className="font-semibold">
                          Document Type:
                        </span>{" "}
                        <span className="text-gray-900">
                          {patient.documentType}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setExpandedPatient(
                        expandedPatient === patient.id ? null : patient.id
                      );
                    }}
                    className="ml-4 p-2 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    {expandedPatient === patient.id ? (
                      <FaChevronUp className="text-blue-500 text-xl" />
                    ) : (
                      <FaChevronDown className="text-blue-500 text-xl" />
                    )}
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedPatient === patient.id
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {expandedPatient === patient.id &&
                    renderStructuredData(patient)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
            >
              Previous
            </button>
            {renderPageButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white border-2 border-gray-200 shadow-2xl rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
        👥 Patient List
      </h2>
      {renderContent()}
    </div>
  );
};

export default PatientList;
