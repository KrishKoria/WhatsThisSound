"use client"
import {Button} from "~/components/ui/button";
import React, {useState} from "react";
interface Prediction {
    class: string
    confidence: number
}
interface LayerData {
    shape: number[]
    values: number[]
}
interface VisualizationData {
    [layerName: string]: LayerData;
}

interface WaveformData {
    values: number[];
    sample_rate: number;
    duration: number;
}

interface ApiResponse {
    predictions: Prediction[];
    visualization: VisualizationData;
    input_spectrogram: LayerData;
    waveform: WaveformData;
}

export default function HomePage() {

    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [vizData, setVizData] = useState<ApiResponse | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setIsLoading(true);
        setError(null);
        try {
            // Simulate file processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Here you would typically send the file to your backend for processing
            console.log("File uploaded:", file.name);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
      <main className="min-h-screen bg-stone-50 p-8">
        <div className="mx-auto max-w-[100%]">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-light tracking-tight text-stone-900">
              CNN Audio Visualizer
            </h1>
            <p className="text-md mb-8 text-stone-600">
              Upload a WAV file to see the model's predictions and feauture maps
            </p>
              <div className="flex flex-col items-center">
                  <div className="relative inline-block">
                      <input
                          type="file"
                          accept=".wav"
                          id="file-upload"
                          onChange={() => {}}
                          disabled={isLoading}
                          className="absolute inset-0 w-full cursor-pointer opacity-0"
                      />
                      <Button
                          disabled={isLoading}
                          className="border-stone-300"
                          variant="outline"
                          size="lg"
                          >
                          {isLoading ? "Analysing..." : "Choose File"}
                      </Button>
                  </div>
              </div>
          </div>
        </div>
      </main>
  );
}
