import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Zap,
  CheckCircle2,
  FileCheck,
  BookOpen,
  Scale,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleDoc } from '../data/sampleDocuments';
import { ExtractionProgress } from '../types';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onSampleSelected: (sample: SampleDoc) => void;
  progress: ExtractionProgress;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  onSampleSelected,
  progress,
  isProcessing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);
    const validPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const validImage =
      file.type.startsWith('image/') ||
      /\.(png|jpe?g|webp|bmp|tiff)$/i.test(file.name);

    if (!validPdf && !validImage) {
      setErrorMsg('Unsupported format. Please upload a PDF document or an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds 25MB limit. Please upload a smaller document.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const getSampleIcon = (id: string) => {
    if (id.includes('nda')) return <Scale className="w-4 h-4 text-amber-400" />;
    if (id.includes('research')) return <BookOpen className="w-4 h-4 text-indigo-400" />;
    if (id.includes('pitch')) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    return <Activity className="w-4 h-4 text-rose-400" />;
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group rounded-3xl p-8 sm:p-10 border-2 border-dashed transition-all duration-300 text-center cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-brand-400 bg-brand-500/10 scale-[1.01] shadow-xl shadow-brand-500/20'
            : 'border-slate-700/80 bg-slate-900/60 hover:border-brand-500/50 hover:bg-slate-900/90 shadow-2xl'
        } ${isProcessing ? 'pointer-events-none opacity-90' : ''}`}
      >
        {/* Glow ambient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-500/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/tiff"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          /* Processing Progress State */
          <div className="py-4 space-y-5 animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-brand-500/20 animate-ping" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Sparkles className="w-7 h-7 text-white animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white tracking-tight">
                {progress.message || 'Analyzing document...'}
              </h4>
              <p className="text-xs text-slate-400">
                Running optical character recognition & layout parsing
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Progress</span>
                <span className="text-brand-400 font-mono">{progress.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 via-sky-400 to-accent-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Idle Drag & Drop State */
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300 shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-110 group-hover:bg-accent-500/20 transition-all duration-300 shadow-md">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Drag & Drop your document here, or{' '}
                <span className="text-brand-400 underline underline-offset-4 decoration-brand-400/40 group-hover:decoration-brand-400">
                  browse files
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Supports <strong className="text-slate-200">PDF documents</strong> (multi-page text parsing) and{' '}
                <strong className="text-slate-200">scanned images</strong> (PNG, JPG, WEBP with OCR)
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Instant Client-side OCR + AI Summarizer (Up to 25MB)
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* One-Click Sample Documents Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Or Try One-Click Sample Documents
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">Ready to test instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => !isProcessing && onSampleSelected(sample)}
              disabled={isProcessing}
              className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-left transition-all duration-200 group relative hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                  {getSampleIcon(sample.id)}
                  {sample.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {sample.wordCount} words
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-200 group-hover:text-brand-300 line-clamp-1 mb-1">
                {sample.name}
              </h5>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
