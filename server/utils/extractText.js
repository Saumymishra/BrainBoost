import fs from 'fs';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';


import mammoth from 'mammoth';

export async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(' ') + '\n\n';
    }
    return text;
  }

  if (mimetype === 'text/plain') {
    return await fs.promises.readFile(filePath, 'utf-8');
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file type for text extraction');
}
