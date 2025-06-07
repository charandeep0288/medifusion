import { FaCloudUploadAlt, FaEye, FaFile, FaSpinner } from "react-icons/fa";

import { useState } from "react";

interface UploadSectionProps {
  onSimulateUpload: () => void;
  files: File[];
  setFiles: (files: File[]) => void;
}

const UploadSection = ({
  onSimulateUpload,
  files,
  setFiles,
}: UploadSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setIsProcessing(true);
    try {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    setIsProcessing(true);
    try {
      setFiles(droppedFiles);
    } catch (error) {
      console.error("Error processing dropped files:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          📤 Upload Patient Documents
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Upload your documents to extract patient information
        </p>
      </div>

      <div
        className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaCloudUploadAlt
          className={`text-4xl text-blue-500 transition-transform duration-300 ${
            isDragging ? "scale-110" : ""
          }`}
        />

        <div className="text-center">
          <label className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaCloudUploadAlt />
                Choose Files
              </>
            )}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-sm text-gray-500">
            or drag and drop files here
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-inner max-h-48 overflow-y-auto">
          <p className="text-gray-800 text-sm font-semibold mb-3 text-center">
            📁 Uploaded {files.length} file{files.length > 1 ? "s" : ""}
          </p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-md p-2 text-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-blue-500 text-lg">📄</span>
                  <div className="flex flex-col">
                    <span
                      className="text-gray-700 truncate"
                      style={{ maxWidth: "80%" }}
                    >
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Path: {file.webkitRelativePath || file.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handlePreview(file)}
                  className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                  title="Preview file"
                >
                  <FaEye />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">File Preview</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <iframe
              src={previewUrl}
              className="w-full h-[70vh] border-0"
              title="File Preview"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onSimulateUpload}
          disabled={isProcessing || files.length === 0}
          className={`px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${
            isProcessing || files.length === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              ⚙️ Process Documents
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
