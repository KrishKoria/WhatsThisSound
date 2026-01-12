"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, Music, Loader2, FileAudio } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  fileName?: string;
  error?: string | null;
}

export default function UploadZone({
  onFileSelected,
  isLoading,
  fileName,
  error,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  }, [isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isLoading) return;

      const file = e.dataTransfer.files?.[0];
      if (file && file.name.toLowerCase().endsWith(".wav")) {
        onFileSelected(file);
      }
    },
    [isLoading, onFileSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ease-in-out",
        isDragging
          ? "border-stone-500 bg-stone-100 scale-[1.01]"
          : "border-stone-200 bg-stone-50/50 hover:bg-stone-100/50 hover:border-stone-300",
        isLoading && "cursor-not-allowed opacity-70",
        error && "border-red-300 bg-red-50 hover:bg-red-50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".wav"
        className="hidden"
        onChange={handleFileInput}
        disabled={isLoading}
      />

      <div className="mb-4 rounded-full bg-stone-100 p-4 ring-1 ring-stone-200">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
        ) : fileName ? (
          <FileAudio className="h-8 w-8 text-stone-700" />
        ) : (
          <Upload className="h-8 w-8 text-stone-400" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-stone-900">
          {isLoading
            ? "Analyzing Audio..."
            : fileName
              ? "Change Audio File"
              : "Upload Audio File"}
        </h3>
        <p className="text-sm text-stone-500">
          {fileName ? (
            <span className="font-mono text-stone-700">{fileName}</span>
          ) : (
            "Drag & drop a WAV file here, or click to select"
          )}
        </p>
      </div>

      {!isLoading && !fileName && (
        <div className="mt-6 flex gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-1">
            <Music className="h-3 w-3" />
            <span>.WAV only</span>
          </div>
        </div>
      )}
    </div>
  );
}
