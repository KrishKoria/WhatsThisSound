"use client";

import React, { useState, useEffect } from "react";
import { env } from "~/env";
import ResultsDashboard from "~/components/ResultsDashboard";
import UploadZone from "~/components/UploadZone";
import type { ApiResponse } from "~/lib/model-helpers";
import { Card, CardContent } from "~/components/ui/card";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [vizData, setVizData] = useState<ApiResponse | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Cleanup blob URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    // Reset previous state
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setVizData(null);
    setError(null);
    
    setFileName(file.name);
    setAudioUrl(URL.createObjectURL(file));
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        const response = await fetch(env.NEXT_PUBLIC_INFERENCE_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64String }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setVizData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };
  };

  const handleReset = () => {
    setVizData(null);
    setFileName("");
    setError(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-tight text-stone-900">
            CNN Audio Visualizer
          </h1>
          {!vizData && (
            <p className="text-md mb-8 text-stone-600">
              Upload a WAV file to see the model's predictions and feature maps
            </p>
          )}
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {!vizData ? (
          <div className="mx-auto max-w-xl">
            <UploadZone
              onFileSelected={handleFileChange}
              isLoading={isLoading}
              fileName={fileName}
              error={error}
            />
          </div>
        ) : (
          <ResultsDashboard
            data={vizData}
            audioUrl={audioUrl}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
