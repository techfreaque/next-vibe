/**
 * Document Text Extractor
 * Extracts plain text from PDF, DOCX, and XLSX files for AI context.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/**
 * Extract text from a PDF buffer.
 */
export async function extractPdfText(
  buffer: Buffer,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    await parser.destroy();
    return result.text?.trim() || null;
  } catch (error) {
    logger.error("[DocumentExtractor] PDF extraction failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Extract text from a DOCX buffer.
 */
export async function extractDocxText(
  buffer: Buffer,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || null;
  } catch (error) {
    logger.error("[DocumentExtractor] DOCX extraction failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Extract text from an XLSX buffer (CSV-like output per sheet).
 */
export async function extractXlsxText(
  buffer: Buffer,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheets: string[] = [];
    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      if (sheet) {
        const csv = XLSX.utils.sheet_to_csv(sheet);
        if (csv.trim()) {
          sheets.push(`[Sheet: ${name}]\n${csv}`);
        }
      }
    }
    return sheets.length > 0 ? sheets.join("\n\n") : null;
  } catch (error) {
    logger.error("[DocumentExtractor] XLSX extraction failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/** MIME types that can be extracted as documents */
const DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.ms-excel",
]);

/**
 * Check if a MIME type is a supported document format.
 */
export function isDocumentMimeType(mimeType: string): boolean {
  return DOCUMENT_MIME_TYPES.has(mimeType);
}

/**
 * Extract text from a document buffer based on MIME type.
 */
export async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
  logger: EndpointLogger,
): Promise<string | null> {
  switch (mimeType) {
    case "application/pdf":
      return extractPdfText(buffer, logger);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      return extractDocxText(buffer, logger);
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.ms-excel":
      return extractXlsxText(buffer, logger);
    default:
      return null;
  }
}
