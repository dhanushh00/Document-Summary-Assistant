import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Share2,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingDown,
  FileCheck2,
  FileText,
  BadgeAlert,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SummaryResult, KeyPoint, ImprovementSuggestion } from '../types';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface SummaryDisplayProps {
  summaryResult: SummaryResult;
  documentName: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summaryResult,
  documentName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'summary' | 'suggestions' | 'keypoints'>('summary');
  const [expandedSuggestions, setExpandedSuggestions] = useState<Record<string, boolean>>({
    'sug-1': true,
  });

  useEffect(() => {
    // Trigger celebratory confetti when a new summary is loaded
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0ea5e9', '#a855f7', '#38bdf8'],
      });
    } catch {
      // Confetti fallback
    }
  }, [summaryResult.generatedAt]);

  // Speech synthesis
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${summaryResult.executiveSummary}. ${summaryResult.detailedSummary}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleCopy = () => {
    const markdown = `# Summary: ${documentName}\n\n` +
      `## Executive Summary\n${summaryResult.executiveSummary}\n\n` +
      `## Detailed Breakdown\n${summaryResult.detailedSummary}\n\n` +
      `## Key Highlights\n` +
      summaryResult.keyPoints.map((kp) => `- [${kp.category}] ${kp.text}`).join('\n') +
      `\n\n## Document Improvement Suggestions\n` +
      summaryResult.improvementSuggestions.map((sug) => `### ${sug.title} (${sug.category} - ${sug.priority.toUpperCase()} priority)\n- **Issue**: ${sug.description}\n- **Recommendation**: ${sug.recommendation}`).join('\n\n');

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdown = `# Summary Report: ${documentName}\n` +
      `Generated: ${summaryResult.generatedAt} | Model: ${summaryResult.modelUsed}\n\n` +
      `## Executive Overview\n${summaryResult.executiveSummary}\n\n` +
      `## Detailed Analysis\n${summaryResult.detailedSummary}\n\n` +
      `## Critical Key Points\n` +
      summaryResult.keyPoints.map((kp) => `- **[${kp.category}]**: ${kp.text}`).join('\n') +
      `\n\n## Document Improvement Suggestions\n` +
      summaryResult.improvementSuggestions.map((sug) => `### ${sug.title}\n*Category*: ${sug.category} | *Priority*: ${sug.priority.toUpperCase()}\n*Analysis*: ${sug.description}\n*Action Item*: ${sug.recommendation}\n`).join('\n') +
      `\n\n---\nGenerated with DocuSummarizer Assistant v2.0`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentName.replace(/\.[^/.]+$/, '')}_Summary_Report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(14, 140, 233);
    doc.text('DocuSummarizer - Executive Summary Report', margin, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Document: ${documentName} | Generated: ${summaryResult.generatedAt}`, margin, 28);
    doc.text(`Model: ${summaryResult.modelUsed} | Word Compression: ${summaryResult.metrics.compressionRatio}%`, margin, 34);

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, 38, pageWidth - margin, 38);

    let currentY = 46;

    // Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Executive Overview', margin, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const execLines = doc.splitTextToSize(summaryResult.executiveSummary, maxLineWidth);
    doc.text(execLines, margin, currentY);
    currentY += execLines.length * 5 + 6;

    // Key Points
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Key Points & Insights', margin, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    summaryResult.keyPoints.forEach((kp) => {
      const kpText = `• [${kp.category}] ${kp.text}`;
      const kpLines = doc.splitTextToSize(kpText, maxLineWidth);
      if (currentY + kpLines.length * 4.5 > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(kpLines, margin, currentY);
      currentY += kpLines.length * 4.5 + 2;
    });

    currentY += 4;

    // Improvement Suggestions
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Document Improvement Suggestions', margin, currentY);
    currentY += 6;

    doc.setFontSize(9);
    summaryResult.improvementSuggestions.forEach((sug, i) => {
      const sugHeader = `${i + 1}. ${sug.title} (${sug.category} - ${sug.priority.toUpperCase()})`;
      const sugBody = `Issue: ${sug.description}\nRecommendation: ${sug.recommendation}`;
      
      if (currentY + 20 > 280) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(sugHeader, margin, currentY);
      currentY += 5;
      
      doc.setFont('helvetica', 'normal');
      const bodyLines = doc.splitTextToSize(sugBody, maxLineWidth);
      doc.text(bodyLines, margin, currentY);
      currentY += bodyLines.length * 4.5 + 4;
    });

    doc.save(`${documentName.replace(/\.[^/.]+$/, '')}_Summary.pdf`);
  };

  const getPriorityBadge = (priority: ImprovementSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            HIGH PRIORITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            MEDIUM PRIORITY
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            LOW PRIORITY
          </span>
        );
    }
  };

  const getKeyPointBadge = (category: KeyPoint['category']) => {
    const styles: Record<string, string> = {
      Financial: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      Risk: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      Timeline: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      Objective: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      Conclusion: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      Highlight: 'bg-brand-500/10 text-brand-300 border-brand-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles[category] || styles.Highlight}`}>
        {category}
      </span>
    );
  };

  const toggleSuggestion = (id: string) => {
    setExpandedSuggestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Intelligence Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Original Words</span>
          <span className="text-lg font-extrabold text-white font-mono mt-1">
            {summaryResult.metrics.originalWordCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">Document size</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Summary Words</span>
          <span className="text-lg font-extrabold text-brand-400 font-mono mt-1">
            {summaryResult.metrics.summaryWordCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">Concise output</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            Compression
          </span>
          <span className="text-lg font-extrabold text-emerald-400 font-mono mt-1">
            {summaryResult.metrics.compressionRatio}%
          </span>
          <span className="text-[10px] text-emerald-500/80">Reading saved</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            Read Time
          </span>
          <span className="text-lg font-extrabold text-sky-300 font-mono mt-1">
            ~{summaryResult.metrics.readingTimeMin} min
          </span>
          <span className="text-[10px] text-slate-500">Estimated</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Reading Level</span>
          <span className="text-sm font-bold text-amber-300 mt-1">
            {summaryResult.metrics.readingLevel}
          </span>
          <span className="text-[10px] text-slate-500">Complexity</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">AI Model</span>
          <span className="text-xs font-bold text-purple-300 truncate mt-1" title={summaryResult.modelUsed}>
            {summaryResult.modelUsed}
          </span>
          <span className="text-[10px] text-slate-500">Generated {summaryResult.generatedAt}</span>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Navigation Tabs & Actions Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'summary'
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Smart Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('keypoints')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'keypoints'
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Key Highlights ({summaryResult.keyPoints.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'suggestions'
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Improvement Suggestions ({summaryResult.improvementSuggestions.length})</span>
            </button>
          </div>

          {/* Action Tools (Voice TTS, Copy, Markdown, PDF) */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {/* Audio Voice Player */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title={isPlaying ? 'Pause voice reader' : 'Listen to summary (Text-to-Speech)'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isPlaying ? 'Stop Voice' : 'Listen'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Copy markdown summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Download Markdown */}
            <button
              onClick={handleDownloadMarkdown}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              title="Download Markdown file (.md)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
              title="Export formatted PDF"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Smart Summary */}
        {activeTab === 'summary' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
            {/* Executive Synopsis Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900/60 to-accent-950/30 border border-brand-500/30 shadow-inner relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  Executive Synopsis
                </span>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                {summaryResult.executiveSummary}
              </p>
            </div>

            {/* Detailed Body */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Analysis & Breakdown
              </h4>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-[15px] leading-relaxed space-y-3 whitespace-pre-line">
                {summaryResult.detailedSummary}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Key Points & Highlights */}
        {activeTab === 'keypoints' && (
          <div className="p-6 sm:p-8 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Extracted Key Insights</h4>
                <p className="text-xs text-slate-400">
                  Critical objectives, financial data, timelines, and operational highlights
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {summaryResult.keyPoints.map((kp, idx) => (
                <div
                  key={kp.id || idx}
                  className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-slate-800 group-hover:bg-brand-500/20 group-hover:text-brand-300 flex items-center justify-center text-slate-400 shrink-0 mt-0.5 text-xs font-mono font-bold transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getKeyPointBadge(kp.category)}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {kp.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Improvement Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="p-6 sm:p-8 space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Document Improvement Suggestions
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actionable critique to improve clarity, legal soundness, formatting, and completeness
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                AI Editorial Audit
              </span>
            </div>

            <div className="space-y-3.5 pt-2">
              {summaryResult.improvementSuggestions.map((sug, idx) => {
                const isExpanded = expandedSuggestions[sug.id] ?? (idx === 0);
                return (
                  <div
                    key={sug.id || idx}
                    className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden transition-all duration-200"
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleSuggestion(sug.id)}
                      className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {sug.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {sug.category}
                            </span>
                            {getPriorityBadge(sug.priority)}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="p-4 pt-1 border-t border-slate-800/60 bg-slate-900/30 space-y-3 text-xs leading-relaxed">
                        <div>
                          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                            Identified Weakness / Gap:
                          </span>
                          <p className="text-slate-300 mt-0.5">{sug.description}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                          <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Actionable Recommendation:
                          </span>
                          <p className="mt-1 text-slate-200 font-medium">
                            {sug.recommendation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
