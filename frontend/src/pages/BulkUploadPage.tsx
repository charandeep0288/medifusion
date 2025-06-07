import HumanReviewSection from "../components/HumanReviewSection";
import PatientList from "../components/PatientList";
import UploadSection from "../components/UploadSection";

const BulkUploadPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bulk Upload & Patient Review</h1>
      <UploadSection />
      <PatientList />
      <HumanReviewSection />
    </div>
  );
};

export default BulkUploadPage;
