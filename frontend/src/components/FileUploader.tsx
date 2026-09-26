"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, File, AlertCircle, X, Sparkles } from "lucide-react";

interface FileUploaderProps {
  label: string;
  subLabel?: string;
  accept?: string;
  onFileSelect: (file: File) => void;
  onOcrTrigger?: (file: File) => void;
  isProcessingOcr?: boolean;
}

export default function FileUploader({
  label,
  subLabel = "PNG, JPG, or PDF up to 10MB",
  accept = "image/png,image/jpeg,image/jpg,application/pdf",
  onFileSelect,
  onOcrTrigger,
  isProcessingOcr = false,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
      if (onOcrTrigger) {
        onOcrTrigger(file);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
          {label}
        </label>
        {onOcrTrigger && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3 w-3" /> AI OCR Enabled
          </span>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
            : selectedFile
            ? "border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/10"
            : "border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 hover:border-orange-400 hover:bg-orange-50/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {selectedFile ? (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <File className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-stone-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-stone-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isProcessingOcr && (
                <div className="flex items-center gap-1.5 text-xs text-orange-600 font-semibold animate-pulse">
                  <Sparkles className="h-4 w-4" /> Extracting...
                </div>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Click to upload or drag & drop certificate
            </div>
            <p className="text-[11px] text-stone-500">{subLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
