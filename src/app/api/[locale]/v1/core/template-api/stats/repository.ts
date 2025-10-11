/**
 * Template Stats Repository
 * Repository pattern for template statistics operations
 */

import "server-only";

import { and, count, desc, eq, gte, inArray, lte } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { templates } from "../db";
import { TemplateStatus, type TemplateStatusDB } from "../enum";
import type {
  TemplateStatsRequestTypeOutput,
  TemplateStatsResponseTypeOutput,
} from "./definition";

/**
 * Template Stats Repository Interface
 */
export interface ITemplateStatsRepository {
  getStats(
    query: TemplateStatsRequestTypeOutput,
    auth: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateStatsResponseTypeOutput>>;
}

/**
 * Map database status values to enum values
 */
function mapStatusToEnum(
  status: string,
): (typeof TemplateStatus)[keyof typeof TemplateStatus] {
  switch (status) {
    case "draft":
      return TemplateStatus.DRAFT;
    case "published":
      return TemplateStatus.PUBLISHED;
    case "archived":
      return TemplateStatus.ARCHIVED;
    default:
      return TemplateStatus.DRAFT;
  }
}

/**
 * Map enum values to database status values
 */
function mapEnumToStatus(
  enumValue: (typeof TemplateStatus)[keyof typeof TemplateStatus],
): string {
  switch (enumValue) {
    case TemplateStatus.DRAFT:
      return "draft";
    case TemplateStatus.PUBLISHED:
      return "published";
    case TemplateStatus.ARCHIVED:
      return "archived";
    default:
      return "draft";
  }
}

/**
 * Template Stats Repository Implementation
 */
export class TemplateStatsRepositoryImpl implements ITemplateStatsRepository {
  /**
   * Get template statistics
   */
  async getStats(
    query: TemplateStatsRequestTypeOutput,
    auth: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateStatsResponseTypeOutput>> {
    try {
      const userId = authRepository.requireUserId(
        auth as JwtPrivatePayloadType,
      );
      logger.debug("app.api.v1.core.templateApi.stats.debug.getting", {
        query,
        userId,
      });

      // Build where conditions
      const conditions = [];

      // Always filter by user
      conditions.push(eq(templates.userId, userId));

      // Status filter
      if (query.status && query.status.length > 0) {
        const dbStatuses = query.status.map(mapEnumToStatus);
        conditions.push(
          inArray(
            templates.status,
            dbStatuses as (typeof TemplateStatusDB)[number][],
          ),
        );
      }

      // Date range filters
      if (query.dateFrom) {
        conditions.push(gte(templates.createdAt, new Date(query.dateFrom)));
      }
      if (query.dateTo) {
        conditions.push(lte(templates.createdAt, new Date(query.dateTo)));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(templates)
        .where(whereClause);

      // Get counts by status
      const statusCounts = await db
        .select({
          status: templates.status,
          count: count(),
        })
        .from(templates)
        .where(whereClause)
        .groupBy(templates.status);

      // Initialize status counts
      let draftTemplates = 0;
      let publishedTemplates = 0;
      let archivedTemplates = 0;
      const templatesByStatus: Record<string, number> = {};

      statusCounts.forEach(({ status, count }) => {
        templatesByStatus[status] = count;
        switch (status) {
          case "draft":
            draftTemplates = count;
            break;
          case "published":
            publishedTemplates = count;
            break;
          case "archived":
            archivedTemplates = count;
            break;
        }
      });

      // Get tag statistics
      const templatesWithTags = await db
        .select({ tags: templates.tags })
        .from(templates)
        .where(whereClause);

      const tagCounts = new Map<string, number>();
      templatesWithTags.forEach(({ tags }) => {
        if (Array.isArray(tags)) {
          tags.forEach((tag: string) => {
            if (
              query.tags &&
              query.tags.length > 0 &&
              !query.tags.includes(tag)
            ) {
              return; // Skip tags not in filter
            }
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          });
        }
      });

      const templatesByTag: Record<string, number> = {};
      tagCounts.forEach((count, tag) => {
        templatesByTag[tag] = count;
      });

      // Get recent templates
      const recentTemplates = await db
        .select({
          id: templates.id,
          name: templates.name,
          status: templates.status,
          createdAt: templates.createdAt,
        })
        .from(templates)
        .where(whereClause)
        .orderBy(desc(templates.createdAt))
        .limit(5);

      const response: TemplateStatsResponseTypeOutput = {
        totalTemplates: totalCount,
        draftTemplates,
        publishedTemplates,
        archivedTemplates,
        templatesByStatus,
        templatesByTag,
        recentTemplates: recentTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          status: mapStatusToEnum(t.status),
          createdAt: t.createdAt.toISOString(),
        })),
        generatedAt: new Date().toISOString(),
      };

      logger.debug("app.api.v1.core.templateApi.stats.debug.retrieved", {
        totalTemplates: response.totalTemplates,
      });

      return createSuccessResponse(response);
    } catch (error) {
      logger.error(
        "app.api.v1.core.templateApi.stats.errors.server.description",
        {
          error,
        },
      );
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.templateApi.stats.errors.server.description",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

/**
 * Export repository instance
 */
export const templateStatsRepository = new TemplateStatsRepositoryImpl();
