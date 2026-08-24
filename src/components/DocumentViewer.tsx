import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Search,
  Eye,
  FileCode,
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { UploadedDocument } from '../types';

interface DocumentViewerProps {
  document: UploadedDocument;
  onClear: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClear,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'preview'>('text');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopyText = () => {
    navigator.clipboard.writeText(document.extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = document.extractedText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = document.extractedText.length;

  const highlightMatches = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={index} className="bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs">
              {document.name}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
              <span>{document.sizeFormatted}</span>
              <span>•</span>
              <span className="capitalize">{document.type}</span>
              {document.pageCount && (
                <>
                  <span>•</span>
                  <span>{document.pageCount} page(s)</span>
                </>
              )}
              {document.ocrConfidence !== undefined && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400">OCR: {document.ocrConfidence}%</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab switcher & actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Extracted Text</span>
            </button>

            {document.previewUrl && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            )}
          </div>

          <button
            onClick={handleCopyText}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all"
            title="Copy extracted text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClear}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            title="Remove document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      {activeTab === 'text' && (
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search extracted text..."
              className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{charCount.toLocaleString()} chars</span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
        {activeTab === 'text' ? (
          <pre className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed text-slate-300 select-text">
            {highlightMatches(document.extractedText, searchTerm)}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            {document.previewUrl ? (
              <img
                src={document.previewUrl}
                alt="Document Preview"
                className="max-h-full max-w-full object-contain rounded-lg border border-slate-700 shadow-md"
              />
            ) : (
              <div className="text-center text-slate-500">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Preview rendered directly from extracted document structure.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
