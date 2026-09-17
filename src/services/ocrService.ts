import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  progress: number; // 0 to 100
  statusText: string;
}

export interface OcrResult {
  text: string;
  confidence?: number;
}

/**
 * Performs 100% client-side optical character recognition on a screenshot or cropped image
 * using an on-device Tesseract.js Web Worker.
 *
 * Features:
 * - Real-time progress notifications (0% -> 100%)
 * - Timeout protection (defaults to 30 seconds)
 * - Safe worker lifecycle management with guaranteed termination in finally block
 * - Robust error and fallback messaging
 */
export async function recognizeScreenshotText(
  imageFileOrUrl: File | Blob | string,
  onProgress?: (info: OcrProgress) => void,
  timeoutMs: number = 30000
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let worker: any = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    onProgress?.({ progress: 5, statusText: 'Initializing client-side OCR worker...' });

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`OCR processing timed out after ${Math.round(timeoutMs / 1000)}s. Switched to editable fallback.`));
      }, timeoutMs);
    });

    const initWorker = async () => {
      return await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            const calculated = Math.min(99, Math.round(25 + m.progress * 74));
            onProgress?.({
              progress: calculated,
              statusText: `Recognizing conversation text (${Math.round(m.progress * 100)}%)...`
            });
          } else if (m.status === 'loading tesseract core') {
            onProgress?.({ progress: 12, statusText: 'Loading WebAssembly OCR engine...' });
          } else if (m.status === 'loading language traineddata') {
            onProgress?.({ progress: 20, statusText: 'Loading character recognition model...' });
          } else if (m.status === 'initializing api') {
            onProgress?.({ progress: 28, statusText: 'Synthesizing neural parser...' });
          } else if (m.status) {
            onProgress?.({ progress: 15, statusText: `Preparing engine: ${m.status}...` });
          }
        }
      });
    };

    worker = await Promise.race([initWorker(), timeoutPromise]);

    onProgress?.({ progress: 35, statusText: 'Analyzing image pixels & bounding boxes...' });

    const recognitionPromise = worker.recognize(imageFileOrUrl);
    const ret = await Promise.race([recognitionPromise, timeoutPromise]);

    const text = ret.data?.text ? ret.data.text.trim() : '';

    onProgress?.({ progress: 100, statusText: 'Text extraction complete!' });

    if (!text) {
      throw new Error('No legible text characters were detected in the image.');
    }

    return text;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn('OCR processing encountered an issue:', errorMessage);
    throw err;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (worker) {
      try {
        await worker.terminate();
      } catch (terminateErr) {
        console.warn('Notice: Error during Tesseract worker termination:', terminateErr);
      }
    }
  }
}
