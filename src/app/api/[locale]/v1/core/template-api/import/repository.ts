/**
 * Template Import Repository
 * Repository for template import operations
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { TranslationKey } from "@/i18n/core/static-types";

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { templates } from "../db";
import { TemplateStatus, type TemplateStatusValue } from "../enum";
import type {
  TemplateImportRequestTypeOutput,
  TemplateImportResponseTypeOutput,
} from "./definition";
import {
  ImportFormat,
  ImportMode,
  ImportStatus,
  type ImportFormatValue,
  type ImportModeValue,
  type ImportStatusValue,
} from "./enum";

/**
 * Type for raw JSON data from parsing
 */
interface RawJsonData {
  name?: string;
  description?: string;
  content?: string;
  status?: string;
  tags?: string[] | string;
  [key: string]: string | string[] | undefined;
}

/**
 * Type for parsed template data
 */
interface ParsedTemplateData {
  name: string;
  description?: string;
  content: string;
  status?: string; // Raw status as string, converted to TemplateStatus enum values when needed
  tags?: string[];
  [key: string]: string | string[] | typeof TemplateStatus | undefined; // Allow additional properties
}

/**
 * Type for parsing result
 */
interface ParseResult {
  success: boolean;
  data?: ParsedTemplateData[];
  error?: string;
}

/**
 * Import result data type
 */
export interface ImportResultData {
  id: string;
  status: ImportStatusValue;
  format: ImportFormatValue;
  mode: ImportModeValue;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: Array<{
    row: number;
    field?: string;
    message: TranslationKey;
    messageParams?: Record<string, string | number>;
  }>;
  warnings: Array<{
    row: number;
    field?: string;
    message: TranslationKey;
    messageParams?: Record<string, string | number>;
  }>;
  createdAt: string;
  completedAt?: string;
}

/**
 * Import request data type - removed as we use the generated type
 */

/**
 * Template Import Repository Interface
 */
export interface ITemplateImportRepository {
  importTemplates(
    data: TemplateImportRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateImportResponseTypeOutput>>;
}

/**
 * Template Import Repository Implementation
 */
class TemplateImportRepository implements ITemplateImportRepository {
  /**
   * Import templates from various formats
   */
  async importTemplates(
    data: TemplateImportRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateImportResponseTypeOutput>> {
    try {
      // Parse the import data based on format
      const parsedData = this.parseImportData(data.format[0], data.data);

      if (!parsedData.success) {
        return createErrorResponse(
          "template.import.errors.validation",
          ErrorResponseTypes.VALIDATION_ERROR,
          { format: data.format[0] },
        );
      }

      return await this.processImportData(parsedData.data || [], data);
    } catch (error) {
      return createErrorResponse(
        "template.import.errors.server",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Parse import data based on format
   */
  private parseImportData(format: ImportFormatValue, data: string): ParseResult {
    try {
      switch (format) {
        case ImportFormat.CSV:
          return this.parseCsvData(data);
        case ImportFormat.JSON:
          return this.parseJsonData(data);
        default:
          return {
            success: false,
            error: "app.api.v1.core.templateApi.import.errors.unsupportedFormat",
          };
      }
    } catch (error) {
      return {
        success: false,
        error: parseError(error).message,
      };
    }
  }

  /**
   * Parse CSV data
   */
  private parseCsvData(csvData: string): ParseResult {
    try {
      const lines = csvData.trim().split("\n");
      if (lines.length < 2) {
        return {
          success: false,
          error:
            "templateApiImport.templateApi.import.form.errors.csv_min_rows",
        };
      }

      const headers = this.parseCsvLine(lines[0]);
      const data: ParsedTemplateData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCsvLine(lines[i]);
        if (values.length !== headers.length) {
          continue; // Skip malformed rows
        }

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header.toLowerCase()] = values[index] || "";
        });

        // Create typed template data
        const templateData: ParsedTemplateData = {
          name: row.name || "",
          description: row.description,
          content: row.content || "",
          status: row.status as TemplateStatusValue,
        };

        // Convert tags from string to array
        if (row.tags && typeof row.tags === "string") {
          templateData.tags = row.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean);
        }

        // Add any additional fields
        Object.keys(row).forEach((key) => {
          if (
            !["name", "description", "content", "status", "tags"].includes(key)
          ) {
            templateData[key] = row[key];
          }
        });

        data.push(templateData);
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: parseError(error).message,
      };
    }
  }

  /**
   * Parse CSV line handling quoted values
   */
  private parseCsvLine(line: string): string[] {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Parse JSON data
   */
  private parseJsonData(jsonData: string): ParseResult {
    try {
      const parsed = JSON.parse(jsonData) as RawJsonData | RawJsonData[];
      const rawData = Array.isArray(parsed) ? parsed : [parsed];

      // Convert to typed data
      const data: ParsedTemplateData[] = rawData.map((item: RawJsonData) => {
        const templateData: ParsedTemplateData = {
          name: typeof item.name === "string" ? item.name : "",
          description:
            typeof item.description === "string" ? item.description : undefined,
          content: typeof item.content === "string" ? item.content : "",
          status: (item.status as TemplateStatusValue) || undefined,
          tags: Array.isArray(item.tags)
            ? item.tags.map((tag: string) => String(tag))
            : undefined,
        };

        // Add any additional properties
        Object.keys(item).forEach((key) => {
          if (
            !["name", "description", "content", "status", "tags"].includes(key)
          ) {
            templateData[key] = item[key];
          }
        });

        return templateData;
      });

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: parseError(error).message,
      };
    }
  }

  /**
   * Process parsed import data
   */
  private async processImportData(
    parsedData: ParsedTemplateData[],
    importConfig: TemplateImportRequestTypeOutput,
  ): Promise<ResponseType<TemplateImportResponseTypeOutput>> {
    const userResponse = await userRepository.getUserByAuth({
      detailLevel: "complete",
    });
    if (!userResponse.success) {
      return createErrorResponse(
        "error.unauthorized",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }
    const user = userResponse.data;

    const result: TemplateImportResponseTypeOutput = {
      id: crypto.randomUUID(),
      status: ImportStatus.PROCESSING,
      format: importConfig.format[0],
      mode: importConfig.mode[0],
      totalRecords: parsedData.length,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errors: [],
      warnings: [],
      createdAt: new Date().toISOString(),
    };

    // Process each record
    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const rowNumber = i + 2; // +2 because CSV has header and is 1-indexed

      try {
        // Validate required fields
        if (!row.name || !row.content) {
          result.errors.push({
            row: rowNumber,
            message:
              "templateApiImport.templateApi.import.form.errors.missing_required_fields",
          });
          result.failedRecords++;
          continue;
        }

        // Validate status
        if (row.status && !Object.values(TemplateStatus).includes(row.status)) {
          const statusValue = String(row.status);
          result.warnings.push({
            row: rowNumber,
            field: "status",
            message: "app.api.errors.template_import_invalid_status",
            messageParams: { statusValue },
          });
          row.status = importConfig.defaultStatus[0];
        }

        // If validation only, don't actually create
        if (!importConfig.validateOnly) {
          // Add required fields for database insert
          const templateRecord = {
            ...row,
            userId: user.id,
            someValue: row.content || "default", // Use content as someValue for backward compatibility
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await db.insert(templates).values(templateRecord);
        }

        result.successfulRecords++;
        result.processedRecords++;
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          message:
            "templateApiImport.templateApi.import.form.errors.database_error",
          messageParams: { error: parseError(error).message },
        });
        result.failedRecords++;

        if (!importConfig.skipErrors) {
          break; // Stop processing on first error if skipErrors is false
        }
      }
    }

    result.status = ImportStatus.COMPLETED;
    result.completedAt = new Date().toISOString();

    return createSuccessResponse<TemplateImportResponseTypeOutput>(result);
  }
}

export const templateImportRepository = new TemplateImportRepository();
