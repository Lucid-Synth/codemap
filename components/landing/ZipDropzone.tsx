"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LuArrowRight, LuFolder } from "react-icons/lu";
import { useAnalysisStore } from "@/store/useAnalysisStore";

export function ZipDropzone() {
  const router = useRouter();
  const { stage, analyzeZip } = useAnalysisStore();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = stage !== "idle" && stage !== "error" && stage !== "done";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!droppedFile.name.endsWith(".zip")) {
      setError("That is not a .zip file");
      return;
    }

    setFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".zip")) {
        setError("That is not a .zip file");
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");

    const success = await analyzeZip(file);
    if (success) {
      router.push("/explore");
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`cursor-pointer rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? "border-accent bg-accent-soft"
            : file
            ? "border-line-strong bg-surface"
            : "border-line bg-surface hover:border-line-strong hover:bg-surface-2"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={handleFileInput}
          disabled={isLoading}
          className="hidden"
        />

        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
          <LuFolder className="h-5 w-5" aria-hidden />
        </div>

        {file ? (
          <div className="mt-4">
            <p className="font-mono text-[14px] font-medium text-ink">
              {file.name}
            </p>
            <p className="mt-1 text-[13px] text-faint">
              {(file.size / (1024 * 1024)).toFixed(2)} MB · click to replace
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-[15px] font-medium text-ink">
              Drop a project ZIP here
            </p>
            <p className="mt-1 text-[13px] text-faint">
              or click to browse your files
            </p>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[14px] font-medium text-background transition-all hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              <span>Analysing archive</span>
            </>
          ) : (
            <>
              <span>Build the graph</span>
              <LuArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      )}
    </div>
  );
}
