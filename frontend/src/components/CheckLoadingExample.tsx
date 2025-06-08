import CheckpointLoader from "./CheckpointLoader";
import React from "react";

interface CheckpointLoaderExampleProps {
  checkpointState: {
    uploaded: "pending" | "loading" | "completed";
    ocr: "pending" | "loading" | "completed";
    ner: "pending" | "loading" | "completed";
  };
}

const CheckpointLoaderExample = ({
  checkpointState,
}: CheckpointLoaderExampleProps) => {
  const checkpoints = [
    {
      id: "uploaded",
      label: "Upload Document",
      description: "Upload your documents to the system for processing",
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
  ];

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4">
      <CheckpointLoader
        checkpoints={checkpoints}
        autoProgress={false}
        checkpointStates={[
          checkpointState.uploaded,
          checkpointState.ocr,
          checkpointState.ner,
        ]}
      />
    </div>
  );
};

export default CheckpointLoaderExample;
