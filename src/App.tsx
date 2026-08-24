import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { FileUpload } from './components/FileUpload';
import { DocumentViewer } from './components/DocumentViewer';
import { SummaryControls } from './components/SummaryControls';
import { SummaryDisplay } from './components/SummaryDisplay';
import { DocumentChat } from './components/DocumentChat';
import { SampleDoc, SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import {
  UploadedDocument,
  SummaryLength,
  SummaryFocus,
  SummaryResult,
  ExtractionProgress,
} from './types';
import { extractTextFromPDF } from './services/pdfExtractor';
import { extractTextFromImage } from './services/ocrExtractor';
import { generateSmartSummary } from './services/summarizer';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Document and extraction state
  const [currentDoc, setCurrentDoc] = useState<UploadedDocument | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [progress, setProgress] = useState<ExtractionProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  // Summary state
  const [selectedLength, setSelectedLength] = useState<SummaryLength>('medium');
  const [selectedFocus, setSelectedFocus] = useState<SummaryFocus>('general');
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);

  // Right column view mode: 'summary' | 'chat'
  const [rightView, setRightView] = useState<'summary' | 'chat'>('summary');

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Process uploaded File (PDF or Image)
  const handleFileSelected = async (file: File) => {
    setIsExtracting(true);
    setSummaryResult(null);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|tiff)$/i.test(file.name);

    let previewUrl: string | undefined;
    if (isImage) {
      previewUrl = URL.createObjectURL(file);
    }

    try {
      let extractedText = '';
      let pageCount = 1;
      let ocrConfidence: number | undefined;

      if (isPdf) {
        setProgress({ status: 'reading', progress: 10, message: 'Reading PDF document structure...' });
        const res = await extractTextFromPDF(file, (p, page, total) => {
          setProgress({
            status: 'extracting',
            progress: Math.min(95, p),
            message: `Extracting page ${page} of ${total}...`,
          });
        });
        extractedText = res.text;
        pageCount = res.pageCount;
      } else if (isImage) {
        setProgress({ status: 'ocr', progress: 10, message: 'Initializing Optical Character Recognition (OCR)...' });
        const res = await extractTextFromImage(file, (p, statusText) => {
          setProgress({
            status: 'ocr',
            progress: p,
            message: statusText,
          });
        });
        extractedText = res.text;
        ocrConfidence = res.confidence;
      }

      const doc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        file,
        type: isPdf ? 'pdf' : 'image',
        sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
        previewUrl,
        extractedText,
        pageCount,
        ocrConfidence,
        extractedAt: new Date().toLocaleTimeString(),
      };

      setCurrentDoc(doc);
      setIsExtracting(false);
      setProgress({ status: 'completed', progress: 100, message: 'Text extraction complete!' });

      // Automatically generate summary
      await triggerSummaryGeneration(extractedText, selectedLength, selectedFocus);
    } catch (err: any) {
      console.error('Extraction failed:', err);
      setIsExtracting(false);
      setProgress({
        status: 'error',
        progress: 0,
        message: err?.message || 'Failed to extract text from document.',
      });
      alert(`Error extracting document: ${err?.message || 'Unknown error'}`);
    }
  };

  // Load one of the pre-loaded sample documents
  const handleSampleSelected = async (sample: SampleDoc) => {
    setIsExtracting(true);
    setSummaryResult(null);
    setProgress({ status: 'reading', progress: 50, message: `Loading sample: ${sample.name}...` });

    const doc: UploadedDocument = {
      id: sample.id,
      name: sample.name,
      type: 'sample',
      sizeFormatted: `${(sample.wordCount * 6 / 1024).toFixed(1)} KB`,
      extractedText: sample.extractedText,
      pageCount: sample.pageCount,
      extractedAt: new Date().toLocaleTimeString(),
    };

    setCurrentDoc(doc);
    setIsExtracting(false);
    setProgress({ status: 'completed', progress: 100, message: 'Sample loaded successfully!' });

    await triggerSummaryGeneration(sample.extractedText, selectedLength, selectedFocus);
  };

  const triggerSummaryGeneration = async (
    text: string,
    length: SummaryLength,
    focus: SummaryFocus
  ) => {
    if (!text) return;
    setIsSummarizing(true);

    try {
      const result = await generateSmartSummary(text, length, focus);
      setSummaryResult(result);
    } catch (err: any) {
      console.error('Summarization failed:', err);
      alert(`Summarization Error: ${err?.message || 'Failed to generate summary'}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleRegenerate = () => {
    if (currentDoc) {
      triggerSummaryGeneration(currentDoc.extractedText, selectedLength, selectedFocus);
    }
  };

  const handleClearDoc = () => {
    if (currentDoc?.previewUrl && currentDoc.type === 'image') {
      URL.revokeObjectURL(currentDoc.previewUrl);
    }
    setCurrentDoc(null);
    setSummaryResult(null);
    setProgress({ status: 'idle', progress: 0, message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onSelectSample={() => {
          handleSampleSelected(SAMPLE_DOCUMENTS[0]);
        }}
      />

      {/* Hero Banner (Shown when no document is active) */}
      {!currentDoc && (
        <section className="relative overflow-hidden pt-8 pb-4 sm:pt-14 sm:pb-8 px-4 text-center">
          {/* Glowing background ambient lights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-r from-brand-600/15 via-accent-600/15 to-pink-600/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Instant OCR Text Extraction & Smart Summarization</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] text-white">
              Turn Any Document Into{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-sky-300 to-accent-400">
                Actionable Intelligence
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
              Upload PDF documents or scanned images to extract clean text with optical character recognition,
              generate multi-depth summaries, extract key points, and receive actionable document improvement suggestions.
            </p>
          </div>
        </section>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!currentDoc ? (
          /* File Upload & Sample Selector View */
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <FileUpload
              onFileSelected={handleFileSelected}
              onSampleSelected={handleSampleSelected}
              progress={progress}
              isProcessing={isExtracting}
            />
          </div>
        ) : (
          /* Active Document Analysis Dashboard */
          <div className="space-y-6 animate-fadeIn">
            {/* Top Controls & View Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {currentDoc.name}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                      {currentDoc.type}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Extracted {currentDoc.sizeFormatted} • Ready for analysis
                  </p>
                </div>
              </div>

              {/* View Switcher: Summary vs Chat */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => setRightView('summary')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      rightView === 'summary'
                        ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Summary & Analysis</span>
                  </button>

                  <button
                    onClick={() => setRightView('chat')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      rightView === 'chat'
                        ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Document (Q&A)</span>
                  </button>
                </div>

                <button
                  onClick={handleClearDoc}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                >
                  Upload Another
                </button>
              </div>
            </div>

            {/* Split Screen Grid: Extracted Text Viewer (Left) + Intelligence Analysis (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Document Viewer & Raw Extracted Text */}
              <div className="lg:col-span-5 w-full">
                <DocumentViewer document={currentDoc} onClear={handleClearDoc} />
              </div>

              {/* Right Column: Controls & Summary / Chat */}
              <div className="lg:col-span-7 w-full space-y-6">
                {rightView === 'summary' ? (
                  <>
                    <SummaryControls
                      selectedLength={selectedLength}
                      onLengthChange={(len) => {
                        setSelectedLength(len);
                        if (currentDoc) triggerSummaryGeneration(currentDoc.extractedText, len, selectedFocus);
                      }}
                      selectedFocus={selectedFocus}
                      onFocusChange={(foc) => {
                        setSelectedFocus(foc);
                        if (currentDoc) triggerSummaryGeneration(currentDoc.extractedText, selectedLength, foc);
                      }}
                      onGenerate={handleRegenerate}
                      isGenerating={isSummarizing}
                    />

                    {isSummarizing ? (
                      <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 animate-pulse">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
                          <RefreshCw className="w-6 h-6 animate-spin" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white">
                            Generating Multi-Depth Smart Summary...
                          </h4>
                          <p className="text-xs text-slate-400">
                            Extracting key takeaways, entity tags, and document improvement recommendations
                          </p>
                        </div>
                      </div>
                    ) : summaryResult ? (
                      <SummaryDisplay
                        summaryResult={summaryResult}
                        documentName={currentDoc.name}
                      />
                    ) : (
                      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center">
                        <p className="text-xs text-slate-400">
                          Click "Generate Smart Summary" to begin analysis.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <DocumentChat
                    documentText={currentDoc.extractedText}
                    documentName={currentDoc.name}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Document Summary Assistant</span>
            <span>•</span>
            <span>Technical Assessment Project</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>Client-side PDF Parsing</span>
            <span>•</span>
            <span>Tesseract OCR</span>
            <span>•</span>
            <span>Smart Summarizer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
