"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ResumeUploaderProps {
  onFileSelect: (file: File | null) => void;
  onTextChange: (text: string) => void;
  isLoading: boolean;
}

export function ResumeUploader({ onFileSelect, onTextChange, isLoading }: ResumeUploaderProps) {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const switchMode = (newMode: "file" | "text") => {
    if (isLoading) return;
    setMode(newMode);
    if (newMode === "file") {
      onTextChange("");
      onFileSelect(file);
    } else {
      onFileSelect(null);
      onTextChange(text);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = ["pdf", "docx", "doc", "txt"];
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || "";

    if (!validExtensions.includes(fileExt)) {
      toast.error("Unsupported file format. Please upload a PDF, DOCX, DOC, or TXT file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File limit exceeded. Maximum size is 5MB.");
      return;
    }
    setFile(selectedFile);
    if (mode === "file") {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (mode === "text") {
      onTextChange(newText);
    }
  };

  const clearFile = () => {
    setFile(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Segmented Control */}
      <div className="flex bg-slate-900/90 p-1.5 rounded-xl border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => switchMode("file")}
          disabled={isLoading}
          className={cn(
            "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2",
            mode === "file"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode("text")}
          disabled={isLoading}
          className={cn(
            "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2",
            mode === "text"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          )}
        >
          <span>✍️ Paste Text</span>
        </button>
      </div>

      {mode === "file" && (
        <div className="flex flex-col gap-3">
          {!file ? (
            <div
              className={cn(
                "group relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-slate-950/40",
                isDragging
                  ? "border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10"
                  : "border-white/10 hover:border-indigo-500/50 hover:bg-slate-900/60",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-300 text-indigo-400">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-100 mb-1">
                Drop your resume file here or <span className="text-indigo-400 underline underline-offset-4">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 font-sans">
                PDF, DOCX, DOC, or TXT (Max 5MB)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border border-indigo-500/30 rounded-2xl bg-indigo-950/20 backdrop-blur-md shadow-lg shadow-indigo-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-100 truncate max-w-[220px] sm:max-w-[320px]">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    {formatFileSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={isLoading}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {mode === "text" && (
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Paste your full resume text content here..."
            className="min-h-[220px] resize-y rounded-2xl bg-slate-950/60 border-white/10 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 font-sans"
            value={text}
            onChange={handleTextChange}
            disabled={isLoading}
          />
          <div className="text-[11px] font-mono text-slate-500 text-right">
            {text.trim().split(/\s+/).filter((word) => word.length > 0).length} words
          </div>
        </div>
      )}
    </div>
  );
}
