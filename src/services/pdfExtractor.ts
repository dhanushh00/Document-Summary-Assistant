import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker for Vite bundler
// Use unpkg or cdnjs worker fallback if local worker path isn't resolved
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: string;
  };
}

export async function extractTextFromPDF(
  file: File | ArrayBuffer,
  onProgress?: (progress: number, page: number, total: number) => void
): Promise<PDFExtractionResult> {
  try {
    let arrayBuffer: ArrayBuffer;
    if (file instanceof File) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Group items by line height / Y position to retain layout formatting
      const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>;
      const pageString = items
        .map((item) => (item.str ? item.str + (item.hasEOL ? '\n' : ' ') : ''))
        .join('');

      pageTexts.push(`--- Page ${pageNum} ---\n${pageString.trim()}`);

      if (onProgress) {
        onProgress(Math.round((pageNum / numPages) * 100), pageNum, numPages);
      }
    }

    let metadata: Record<string, string> = {};
    try {
      const meta = await pdf.getMetadata();
      if (meta && meta.info) {
        metadata = meta.info as Record<string, string>;
      }
    } catch {
      // Ignore metadata parsing error if not available
    }

    return {
      text: pageTexts.join('\n\n'),
      pageCount: numPages,
      metadata: {
        title: metadata.Title,
        author: metadata.Author,
        creationDate: metadata.CreationDate,
      },
    };
  } catch (error) {
    console.error('Failed to parse PDF document:', error);
    throw new Error(
      error instanceof Error
        ? `PDF Parsing Error: ${error.message}`
        : 'Failed to extract text from PDF. The document may be password-protected or corrupted.'
    );
  }
}
