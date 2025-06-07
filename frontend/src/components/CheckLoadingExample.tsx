import React, { useState } from "react";

import CheckpointLoader from "./CheckpointLoader";

const CheckpointLoaderExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkpoints = [
    {
      id: "upload",
      label: "Upload Documents",
      description: "Upload your documents to the system for processing",
    },
    {
      id: "uploaded",
      label: "Uploaded Documents",
      description: "Documents have been successfully uploaded and validated",
    },
    {
      id: "ocr",
      label: "OCR",
      description:
        "Optical Character Recognition - extracting text from documents",
    },
    {
      id: "ner",
      label: "NER",
      description:
        "Named Entity Recognition - identifying important entities in text",
    },
    {
      id: "completed",
      label: "Completed",
      description: "All processing steps have been completed successfully",
    },
  ];

  const handleStart = () => {
    setIsLoading(true);
  };

  const handleComplete = () => {
    console.log("Processing completed!");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {isLoading ? (
            <CheckpointLoader
              checkpoints={checkpoints}
              autoProgress={true}
              onComplete={handleComplete}
            />
          ) : (
            <div className="text-center space-y-6 py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Process</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to start the document processing
                  pipeline
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
            {!isLoading ? (
              <button
                onClick={handleStart}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Processing
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Reset Pipeline
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckpointLoaderExample;
