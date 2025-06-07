import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/cardLoader";
import React, { useState } from "react";

import { Button } from "./ui/button";
import CheckpointLoader from "./CheckpointLoader";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setIsLoading(false);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Document Processing Pipeline
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch as your documents are processed through our advanced pipeline
            with real-time progress tracking.
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Processing Pipeline</CardTitle>
            <CardDescription>
              Monitor the progress of document analysis in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-6">
                <CheckpointLoader
                  checkpoints={checkpoints}
                  autoProgress={true}
                  onComplete={handleComplete}
                />

                {isCompleted && (
                  <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      🎉 Processing Complete!
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6 py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    📄
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Ready to Process
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Click the button below to start the document processing
                    pipeline
                  </p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
              {!isLoading ? (
                <Button onClick={handleStart} size="lg" className="px-8">
                  Start Processing
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="px-8"
                  disabled={!isCompleted}
                >
                  {isCompleted ? "Reset Pipeline" : "Processing..."}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📤 Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload and validate your documents securely.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                ✅ Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ensure documents are properly formatted and ready for
                processing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🔍 OCR Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Extract text content using advanced machine learning algorithms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🏷️ NER Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identify and classify entities like names, dates, and locations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
