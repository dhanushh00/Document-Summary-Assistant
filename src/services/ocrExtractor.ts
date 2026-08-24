import { createWorker } from 'tesseract.js';

export interface OCRExtractionResult {
  text: string;
  confidence: number;
  wordCount: number;
}

export async function extractTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: (progress: number, status: string) => void
): Promise<OCRExtractionResult> {
  let worker: Tesseract.Worker | null = null;
  try {
    if (onProgress) onProgress(5, 'Initializing OCR engine...');

    worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          const p = Math.min(98, Math.max(10, Math.round(m.progress * 100)));
          onProgress(p, `Recognizing text (${p}%)...`);
        } else if (onProgress && m.status) {
          onProgress(15, `${m.status.charAt(0).toUpperCase() + m.status.slice(1)}...`);
        }
      },
    });

    if (onProgress) onProgress(30, 'Performing optical character recognition...');

    let imageInput: File | Blob | string = imageSource;
    if (imageSource instanceof File) {
      imageInput = imageSource;
    }

    const { data } = await worker.recognize(imageInput);
    
    if (onProgress) onProgress(100, 'OCR extraction complete!');

    const cleanedText = (data.text || '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const words = cleanedText.split(/\s+/).filter(Boolean);

    return {
      text: cleanedText,
      confidence: Math.round(data.confidence || 0),
      wordCount: words.length,
    };
  } catch (error) {
    console.error('OCR Extraction failed:', error);
    throw new Error(
      error instanceof Error
        ? `OCR Processing Error: ${error.message}`
        : 'Failed to extract text from image. Please ensure the image is clear and contains readable text.'
    );
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (err) {
        console.warn('Worker termination warning:', err);
      }
    }
  }
}
