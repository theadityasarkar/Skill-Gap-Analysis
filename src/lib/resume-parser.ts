import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseResume(file: File): Promise<string> {
  try {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be 5MB or less.");
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await pdfParse(buffer);
      if (!result.text.trim()) throw new Error("Parsed PDF is empty.");
      return result.text.trim();
    } else if (extension === 'docx' || extension === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      if (!result.value.trim()) throw new Error("Parsed Document is empty.");
      return result.value.trim();
    } else if (extension === 'txt') {
      const text = await file.text();
      if (!text.trim()) throw new Error("Parsed Text file is empty.");
      return text.trim();
    } else {
      throw new Error("Unsupported file format. Please upload PDF, DOCX, DOC, or TXT.");
    }
  } catch (error: any) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}
