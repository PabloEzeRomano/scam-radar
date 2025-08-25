// utils/ocr.ts
import Tesseract from 'tesseract.js';

export async function ocrImageToText(file: File) {
  const { data } = await Tesseract.recognize(file, 'eng+spa', {
    logger: () => {}, // podés mostrar progreso
  });
  return data.text || '';
}
