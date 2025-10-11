/**
 * Enhanced Template Stats Repository
 * Handles data operations for enhanced template statistics
 */

import "server-only";

import { and, between, eq, gte, inArray, lte, sql } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType, JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import { templates } from "../db";
import { TemplateStatus } from "../enum";
import type {
  EnhancedTemplateStatsRequestTypeOutput,
  EnhancedTemplateStatsResponseTypeOutput,
} from "./definition";

/**
 * Enhanced Template Stats Repository Interface
 */
export interface IEnhancedTemplateStatsRepository {
  getStats(
    data: EnhancedTemplateStatsRequestTypeOutput,
    auth: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EnhancedTemplateStatsResponseTypeOutput>>;
}

/**
 * Enhanced Template Stats Repository Implementation
 */
class EnhancedTemplateStatsRepository
  implements IEnhancedTemplateStatsRepository
{
  /**
   * Get enhanced template statistics
   */
  async getStats(
    data: EnhancedTemplateStatsRequestTypeOutput,
    auth: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EnhancedTemplateStatsResponseTypeOutput>> {
    try {
      const userId = authRepository.requireUserId(auth as JwtPrivatePayloadType);
      logger.debug("app.api.v1.core.templateApi.enhancedStats.debug.getting", {
        filters: data,
        userId,
      });

      // Build where conditions based on filters
      const conditions = [];

      // User filter - for non-admin users, only show their own templates
      conditions.push(eq(templates.userId, userId));

      // Status filter
      if (data.status && data.status.length > 0) {
        conditions.push(inArray(templates.status, data.status));
      }

      // Date range filters
      if (data.createdAfter || data.createdBefore) {
        if (data.createdAfter && data.createdBefore) {
          conditions.push(
            between(
              templates.createdAt,
              new Date(data.createdAfter),
              new Date(data.createdBefore),
            ),
          );
        } else if (data.createdAfter) {
          conditions.push(
            gte(templates.createdAt, new Date(data.createdAfter)),
          );
        } else if (data.createdBefore) {
          conditions.push(
            lte(templates.createdAt, new Date(data.createdBefore)),
          );
        }
      }

      if (data.updatedAfter || data.updatedBefore) {
        if (data.updatedAfter && data.updatedBefore) {
          conditions.push(
            between(
              templates.updatedAt,
              new Date(data.updatedAfter),
              new Date(data.updatedBefore),
            ),
          );
        } else if (data.updatedAfter) {
          conditions.push(
            gte(templates.updatedAt, new Date(data.updatedAfter)),
          );
        } else if (data.updatedBefore) {
          conditions.push(
            lte(templates.updatedAt, new Date(data.updatedBefore)),
          );
        }
      }

      // Apply search filter if provided
      if (data.search) {
        conditions.push(
          sql`${templates.name} ILIKE ${`%${data.search}%`} OR ${templates.description} ILIKE ${`%${data.search}%`}`,
        );
      }

      // Query templates with filters
      const allTemplates = await db
        .select()
        .from(templates)
        .where(and(...conditions));

      // Calculate statistics
      const totalTemplates = allTemplates.length;
      const draftTemplates = allTemplates.filter(
        (t) => t.status === TemplateStatus.DRAFT,
      ).length;
      const publishedTemplates = allTemplates.filter(
        (t) => t.status === TemplateStatus.PUBLISHED,
      ).length;
      const archivedTemplates = allTemplates.filter(
        (t) => t.status === TemplateStatus.ARCHIVED,
      ).length;

      // Filter by description if specified
      let filteredTemplates = allTemplates;
      if (data.hasDescription !== undefined) {
        filteredTemplates = filteredTemplates.filter((t) =>
          data.hasDescription ? t.description !== null : t.description === null,
        );
      }

      // Filter by content length if specified
      if (
        data.contentLengthMin !== undefined ||
        data.contentLengthMax !== undefined
      ) {
        filteredTemplates = filteredTemplates.filter((t) => {
          const contentLength = t.content.length;
          if (
            data.contentLengthMin !== undefined &&
            contentLength < data.contentLengthMin
          ) {
            return false;
          }
          if (
            data.contentLengthMax !== undefined &&
            contentLength > data.contentLengthMax
          ) {
            return false;
          }
          return true;
        });
      }

      // Calculate content metrics
      const templatesWithDescription = filteredTemplates.filter(
        (t) => t.description !== null,
      ).length;
      const templatesWithoutDescription = filteredTemplates.filter(
        (t) => t.description === null,
      ).length;

      const totalContentLength = filteredTemplates.reduce(
        (sum, t) => sum + t.content.length,
        0,
      );
      const averageContentLength =
        filteredTemplates.length > 0
          ? Math.round(totalContentLength / filteredTemplates.length)
          : 0;

      // Calculate template distribution by status
      const templatesByStatus: Record<string, number> = {};
      for (const status of Object.values(TemplateStatus)) {
        templatesByStatus[status] = filteredTemplates.filter(
          (t) => t.status === status,
        ).length;
      }

      // Calculate template distribution by user
      const templatesByUser: Record<string, number> = {};
      filteredTemplates.forEach((t) => {
        templatesByUser[t.userId] = (templatesByUser[t.userId] || 0) + 1;
      });

      // Calculate template distribution by content length
      const templatesByContentLength = {
        short: filteredTemplates.filter((t) => t.content.length < 500).length,
        medium: filteredTemplates.filter(
          (t) => t.content.length >= 500 && t.content.length <= 2000,
        ).length,
        long: filteredTemplates.filter((t) => t.content.length > 2000).length,
      };

      // Calculate tag analytics
      const tagCounts: Record<string, number> = {};
      let totalTagCount = 0;

      filteredTemplates.forEach((t) => {
        const tags = (t.tags as string[]) || [];
        tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          totalTagCount++;
        });
      });

      // Get most used tags
      const mostUsedTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({
          tag,
          count,
          percentage:
            totalTagCount > 0
              ? Math.round((count / totalTagCount) * 1000) / 10
              : 0,
        }));

      // Calculate new and updated templates (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newTemplates = filteredTemplates.filter(
        (t) => new Date(t.createdAt) >= thirtyDaysAgo,
      ).length;

      const updatedTemplates = filteredTemplates.filter(
        (t) =>
          new Date(t.updatedAt) >= thirtyDaysAgo &&
          new Date(t.createdAt) < thirtyDaysAgo,
      ).length;

      // Determine date range
      const fromDate = data.dateFrom || data.createdAfter || thirtyDaysAgo;
      const toDate = data.dateTo || data.createdBefore || new Date();
      const dateRange = {
        from: fromDate instanceof Date ? fromDate.toISOString() : String(fromDate),
        to: toDate instanceof Date ? toDate.toISOString() : String(toDate),
      };

      logger.debug("app.api.v1.core.templateApi.enhancedStats.debug.retrieved", {
        totalTemplates,
        totalTags: Object.keys(tagCounts).length,
      });

      const response: EnhancedTemplateStatsResponseTypeOutput = {
        totalTemplates,
        draftTemplates,
        publishedTemplates,
        archivedTemplates,
        newTemplates,
        updatedTemplates,
        templatesWithDescription,
        templatesWithoutDescription,
        averageContentLength,
        totalContentLength,
        totalTags: Object.keys(tagCounts).length,
        templatesByStatus,
        templatesByUser,
        templatesByContentLength,
        mostUsedTags,
        generatedAt: new Date().toISOString(),
        dataRange: dateRange,
      };

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("app.api.v1.core.templateApi.enhancedStats.errors.server.description", {
        error,
      });
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.templateApi.enhancedStats.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

/**
 * Enhanced Template Stats Repository Instance
 */
export const enhancedTemplateStatsRepository =
  new EnhancedTemplateStatsRepository();
