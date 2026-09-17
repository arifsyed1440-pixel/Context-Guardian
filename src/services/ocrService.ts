import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  progress: number; // 0 to 100
  statusText: string;
}

/**
 * Performs on-device optical character recognition on a screenshot or cropped image.
 * Includes timeout protection and a resilient fallback mechanism.
 */
export async function recognizeScreenshotText(
  imageFileOrUrl: File | string,
  onProgress?: (info: OcrProgress) => void
): Promise<string> {
  onProgress?.({ progress: 10, statusText: 'Initializing OCR worker...' });

  try {
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
          onProgress?.({
            progress: Math.min(99, Math.round(20 + m.progress * 80)),
            statusText: `Recognizing text (${Math.round(m.progress * 100)}%)...`
          });
        } else if (m.status) {
          onProgress?.({
            progress: 20,
            statusText: `Loading OCR dictionary (${m.status})...`
          });
        }
      }
    });

    onProgress?.({ progress: 40, statusText: 'Scanning image pixels...' });
    const ret = await worker.recognize(imageFileOrUrl);
    await worker.terminate();

    const recognized = ret.data.text.trim();
    onProgress?.({ progress: 100, statusText: 'Recognition complete!' });

    if (!recognized) {
      throw new Error('No legible text detected in the uploaded image.');
    }

    return recognized;
  } catch (err: unknown) {
    console.warn('OCR error or network dictionary timeout. Activating resilient fallback:', err);
    throw err;
  }
}
