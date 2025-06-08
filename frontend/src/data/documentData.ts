import { faker } from "@faker-js/faker";

interface FollowUpCareInstructions {
  Medications: string;
  Diet: string;
  Exercise: string;
  Lifestyle: string;
  FollowUp: string;
}

interface ExtractedData {
  PatientName: string;
  DateOfBirth: string;
  MRN: string;
  DateOfAdmission: string;
  DateOfDischarge: string;
  ReasonForAdmission: string;
  ProceduresPerformed: string[];
  MedicationsPrescribed: string[];
  PatientConditionAtDischarge: string;
  FollowUpCareInstructions: FollowUpCareInstructions;
}

interface StructuredData {
  DocumentType: string;
  ExtractedData: ExtractedData;
}

interface MockDocument {
  id: number;
  structured_data: StructuredData;
}

const documentTypes = [
  "Discharge Summary",
  "Lab Report",
  "Prescription",
  "Insurance Form",
];

const procedures = [
  "Coronary Angiogram",
  "Coronary Angioplasty",
  "Placement of a drug-eluting stent",
  "Cardiac Catheterization",
  "Echocardiogram",
  "Stress Test",
  "Blood Test",
  "X-Ray",
  "MRI Scan",
  "CT Scan",
];

const medications = [
  "Aspirin, 81 mg daily",
  "Atorvastatin, 40 mg daily",
  "Metoprolol, 50 mg twice daily",
  "Nitroglycerin, as needed",
  "Lisinopril, 10 mg daily",
  "Metformin, 500 mg twice daily",
  "Omeprazole, 20 mg daily",
  "Ibuprofen, 400 mg as needed",
  "Amoxicillin, 500 mg three times daily",
  "Prednisone, 20 mg daily",
];

const conditions = [
  "Stable",
  "Improving",
  "Critical",
  "Recovering",
  "Under Observation",
  "Requires Monitoring",
  "Good Progress",
  "Needs Further Treatment",
];

const mockDocuments: MockDocument[] = Array.from({ length: 2000 }, (_, i) => {
  const admissionDate = faker.date.past({ years: 1 });
  const dischargeDate = faker.date.between({
    from: admissionDate,
    to: new Date(),
  });

  return {
    id: i + 1,
    structured_data: {
      DocumentType: faker.helpers.arrayElement(documentTypes),
      ExtractedData: {
        PatientName: faker.person.fullName(),
        DateOfBirth: faker.date
          .birthdate({ mode: "age", min: 18, max: 90 })
          .toLocaleDateString(),
        MRN: faker.string.numeric(6),
        DateOfAdmission: admissionDate.toLocaleDateString(),
        DateOfDischarge: dischargeDate.toLocaleDateString(),
        ReasonForAdmission: faker.helpers.arrayElement([
          "Acute Myocardial Infarction",
          "Pneumonia",
          "Diabetes Management",
          "Hypertension",
          "Fracture",
          "Respiratory Infection",
          "Gastrointestinal Issues",
          "Neurological Symptoms",
        ]),
        ProceduresPerformed: faker.helpers.arrayElements(
          procedures,
          faker.number.int({ min: 1, max: 4 })
        ),
        MedicationsPrescribed: faker.helpers.arrayElements(
          medications,
          faker.number.int({ min: 2, max: 5 })
        ),
        PatientConditionAtDischarge: faker.helpers.arrayElement(conditions),
        FollowUpCareInstructions: {
          Medications: faker.helpers.arrayElement([
            "Continue all prescribed medications without interruption unless advised by a doctor.",
            "Take medications as prescribed and report any side effects.",
            "Follow the medication schedule strictly.",
            "Maintain regular medication timings.",
          ]),
          Diet: faker.helpers.arrayElement([
            "Follow a heart-healthy diet low in sodium, saturated fats, and simple carbohydrates.",
            "Maintain a balanced diet with plenty of fruits and vegetables.",
            "Follow a low-sugar diet plan.",
            "Stick to the prescribed dietary restrictions.",
          ]),
          Exercise: faker.helpers.arrayElement([
            "Start with light walking, gradually increasing to moderate-intensity exercise for at least 30 minutes a day as tolerated.",
            "Begin with gentle stretching exercises.",
            "Follow the physical therapy regimen as prescribed.",
            "Avoid strenuous activities until cleared by the doctor.",
          ]),
          Lifestyle: faker.helpers.arrayElement([
            "Smoking cessation advised (if applicable), and stress management techniques recommended.",
            "Maintain regular sleep schedule and avoid stress.",
            "Follow a healthy lifestyle routine.",
            "Avoid alcohol and tobacco products.",
          ]),
          FollowUp: faker.helpers.arrayElement([
            "Schedule an appointment with a cardiologist in 2 weeks and with the primary care physician within one week.",
            "Follow up with the specialist in 1 week.",
            "Schedule a check-up in 2 weeks.",
            "Return for follow-up in 1 month.",
          ]),
        },
      },
    },
  };
});

export { mockDocuments };
export type {
  MockDocument,
  StructuredData,
  ExtractedData,
  FollowUpCareInstructions,
};
