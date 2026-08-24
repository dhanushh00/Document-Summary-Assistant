export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryFocus = 'general' | 'executive' | 'action_items' | 'technical';

export interface ImprovementSuggestion {
  id: string;
  title: string;
  category: 'Clarity' | 'Completeness' | 'Tone & Style' | 'Formatting' | 'Actionability' | 'Legal/Risk';
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeyPoint {
  id: string;
  text: string;
  category: 'Highlight' | 'Financial' | 'Objective' | 'Risk' | 'Timeline' | 'Conclusion';
}

export interface DocumentMetrics {
  originalWordCount: number;
  summaryWordCount: number;
  characterCount: number;
  readingTimeMin: number;
  compressionRatio: number;
  sentiment: 'Positive' | 'Neutral' | 'Critical' | 'Constructive';
  readingLevel: 'Easy' | 'Intermediate' | 'Advanced' | 'Executive';
  pageCount?: number;
}

export interface SummaryResult {
  executiveSummary: string;
  detailedSummary: string;
  keyPoints: KeyPoint[];
  improvementSuggestions: ImprovementSuggestion[];
  metrics: DocumentMetrics;
  generatedAt: string;
  modelUsed: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  file?: File;
  type: 'pdf' | 'image' | 'sample';
  sizeFormatted: string;
  previewUrl?: string;
  extractedText: string;
  pageCount?: number;
  ocrConfidence?: number;
  extractedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ExtractionProgress {
  status: 'idle' | 'reading' | 'extracting' | 'ocr' | 'summarizing' | 'completed' | 'error';
  progress: number; // 0 - 100
  message: string;
}
