/**
 * Template Export Repository
 * Repository pattern for template export operations
 */

import "server-only";

import { and, between, eq, gte, inArray, lte } from "drizzle-orm";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { JwtPayloadType, JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import { templates } from "../db";
import type {
  TemplateExportRequestTypeOutput,
  TemplateExportResponseTypeOutput,
} from "./definition";
import { ExportFormat } from "./enums";

// Define proper types instead of using any
interface TemplateExportData {
  id: string;
  name: string;
  status: string;
  content?: string;
  description?: string | null;
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId?: string;
}

/**
 * Template Export Repository Interface
 */
export interface ITemplateExportRepository {
  exportTemplates(
    request: TemplateExportRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateExportResponseTypeOutput>>;
}

/**
 * Template Export Repository Implementation
 */
class TemplateExportRepository implements ITemplateExportRepository {
  /**
   * Export templates in specified format
   */
  async exportTemplates(
    request: TemplateExportRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateExportResponseTypeOutput>> {
    try {
      const userId = authRepository.requireUserId(user as JwtPrivatePayloadType);
      logger.debug("app.api.v1.core.templateApi.export.debug.exporting", {
        request,
        userId,
      });

      const {
        format,
        templateIds,
        status,
        tags,
        includeContent,
        includeMetadata,
        dateFrom,
        dateTo,
      } = request;

      // Build where conditions
      const conditions = [eq(templates.userId, userId)];

      if (templateIds && templateIds.length > 0) {
        conditions.push(inArray(templates.id, templateIds));
      }

      if (status && status.length > 0) {
        conditions.push(inArray(templates.status, status));
      }

      if (dateFrom && dateTo) {
        conditions.push(
          between(templates.createdAt, new Date(dateFrom), new Date(dateTo)),
        );
      } else if (dateFrom) {
        conditions.push(gte(templates.createdAt, new Date(dateFrom)));
      } else if (dateTo) {
        conditions.push(lte(templates.createdAt, new Date(dateTo)));
      }

      const whereClause = and(...conditions);

      // Fetch templates
      const templateList = await db.select().from(templates).where(whereClause);

      // Filter by tags if specified
      let filteredTemplates = templateList;
      if (tags && tags.length > 0) {
        filteredTemplates = templateList.filter((template) => {
          const templateTags = (template.tags as string[]) || [];
          return tags.some((tag) => templateTags.includes(tag));
        });
      }

      if (filteredTemplates.length === 0) {
        logger.info("app.api.v1.core.templateApi.export.debug.noTemplates", {
          count: 0,
        });
        return createErrorResponse(
          "template.export.errors.notFound",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Prepare export data
      const exportTemplates = filteredTemplates.map((template) => {
        const exportTemplate: TemplateExportData = {
          id: template.id,
          name: template.name,
          status: template.status,
        };

        if (includeContent) {
          exportTemplate.content = template.content;
          exportTemplate.description = template.description;
          exportTemplate.tags = (template.tags as string[]) || [];
        }

        if (includeMetadata) {
          exportTemplate.createdAt = template.createdAt.toISOString();
          exportTemplate.updatedAt = template.updatedAt.toISOString();
          exportTemplate.userId = template.userId;
        }

        return exportTemplate;
      });

      // Generate export data based on format
      let exportData: string;
      let mimeType: string;
      let fileExtension: string;

      switch (format) {
        case ExportFormat.JSON:
          exportData = JSON.stringify({ templates: exportTemplates }, null, 2);
          mimeType = "application/json";
          fileExtension = "json";
          break;

        case ExportFormat.CSV:
          exportData = this.convertToCSV(exportTemplates);
          mimeType = "text/csv";
          fileExtension = "csv";
          break;

        case ExportFormat.XML:
          exportData = this.convertToXML(exportTemplates);
          mimeType = "application/xml";
          fileExtension = "xml";
          break;

        default:
          return createErrorResponse(
            "template.export.errors.validation",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
      }

      // Generate filename
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = this.generateFilename(timestamp, fileExtension);

      // Encode data as base64 for safe transport
      const encodedData = Buffer.from(exportData, "utf-8").toString("base64");

      logger.info("app.api.v1.core.templateApi.export.debug.success", {
        format,
        templateCount: filteredTemplates.length,
        filename,
        size: exportData.length,
      });

      return createSuccessResponse({
        response: {
          success: true,
          exportData: {
            format,
            filename,
            data: encodedData,
            mimeType,
            size: exportData.length,
            templateCount: filteredTemplates.length,
            exportedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      logger.error("app.api.v1.core.templateApi.export.errors.server.description", {
        error,
      });
      const parsedError = parseError(error);
      return createErrorResponse(
        "template.export.errors.server",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Generate filename for export
   */
  private generateFilename(timestamp: string, extension: string): string {
    const PREFIX = "templates_export" as const;
    return `${PREFIX}_${timestamp}.${extension}`;
  }

  /**
   * Escape CSV field value
   */
  private escapeCsvField(value: string): string {
    const QUOTE_CHAR = '"';
    const DOUBLE_QUOTE = '""';
    const escapedValue = value.replace(
      new RegExp(QUOTE_CHAR, "g"),
      DOUBLE_QUOTE,
    );
    return `${QUOTE_CHAR}${escapedValue}${QUOTE_CHAR}`;
  }

  /**
   * Convert templates to CSV format
   */
  private convertToCSV(templates: TemplateExportData[]): string {
    const EMPTY_CSV = "";
    if (templates.length === 0) {
      return EMPTY_CSV;
    }

    const headers = Object.keys(templates[0]);
    const COMMA_SEPARATOR = ",";
    const csvRows = [headers.join(COMMA_SEPARATOR)];

    templates.forEach((template) => {
      const values = headers.map((header) => {
        const templateRecord = template as unknown as Record<
          string,
          string | string[] | Date | null | undefined
        >;
        const value = templateRecord[header];
        if (value === null || value === undefined) {
          return '""';
        }
        if (Array.isArray(value)) {
          return this.escapeCsvField(JSON.stringify(value));
        }
        if (value instanceof Date) {
          return this.escapeCsvField(value.toISOString());
        }
        return this.escapeCsvField(String(value));
      });
      csvRows.push(values.join(COMMA_SEPARATOR));
    });

    const NEWLINE_SEPARATOR = "\n";
    return csvRows.join(NEWLINE_SEPARATOR);
  }

  /**
   * Convert templates to XML format
   */
  private convertToXML(templates: TemplateExportData[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const xmlElements = templates
      .map((template) => {
        const elements = Object.entries(template)
          .map(([key, value]) => {
            if (value === null || value === undefined) {
              return `  <${key}/>`;
            }
            if (Array.isArray(value)) {
              const items = value
                .map(
                  (item) => `    <item>${this.escapeXml(String(item))}</item>`,
                )
                .join("\n");
              return `  <${key}>\n${items}\n  </${key}>`;
            }
            return `  <${key}>${this.escapeXml(String(value))}</${key}>`;
          })
          .join("\n");
        return `<template>\n${elements}\n</template>`;
      })
      .join("\n");

    return `${xmlHeader}\n<templates>\n${xmlElements}\n</templates>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

/**
 * Default repository instance
 */
export const templateExportRepository = new TemplateExportRepository();
