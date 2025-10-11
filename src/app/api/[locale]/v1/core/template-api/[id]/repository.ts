/**
 * Template Item Repository
 * Repository for individual template operations
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { templates } from "../db";
import { TemplateStatus, type TemplateStatusValue } from "../enum";

// Define TemplateData locally since we need it for this repository
export interface TemplateData {
  id: string;
  name: string;
  description: string | null;
  content: string;
  status: typeof TemplateStatusValue;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Template item response types
 */
export interface TemplateItemGetResponse {
  success: boolean;
  template: TemplateData;
}

export interface TemplateItemUpdateRequest {
  name?: string;
  description?: string;
  content?: string;
  status?: (typeof TemplateStatusValue)[];
  tags?: string[];
}

export interface TemplateItemUpdateResponse {
  success: boolean;
  template: TemplateData;
}

export interface TemplateItemDeleteResponse {
  success: boolean;
}

/**
 * Template Item Repository Interface
 */
export interface ITemplateItemRepository {
  findById(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateItemGetResponse>>;
  updateById(
    id: string,
    data: TemplateItemUpdateRequest,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateItemUpdateResponse>>;
  deleteById(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateItemDeleteResponse>>;
}

/**
 * Template Item Repository Implementation
 */
class TemplateItemRepository implements ITemplateItemRepository {
  /**
   * Get template by ID
   */
  async findById(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateItemGetResponse>> {
    try {
      const userId = authRepository.requireUserId(user);
      logger.debug("app.api.v1.core.templateApi.get.debug.fetching", {
        id,
        userId,
      });

      const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, id))
        .limit(1);

      if (!template) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.get.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Check if user owns this template
      if (template.userId !== userId) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.get.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      const templateData: TemplateData = {
        id: template.id,
        name: template.name,
        description: template.description,
        content: template.content,
        status: template.status as typeof TemplateStatusValue,
        tags: template.tags ?? [],
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
        userId: template.userId,
      };

      return createSuccessResponse({
        success: true,
        template: templateData,
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.templateApi.get.errors.server.description",
        { error },
      );
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.templateApi.id.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Update template by ID
   */
  async updateById(
    id: string,
    data: TemplateItemUpdateRequest,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateItemUpdateResponse>> {
    try {
      const userId = authRepository.requireUserId(user);
      logger.debug("app.api.v1.core.templateApi.put.debug.updating", {
        id,
        userId,
        updates: Object.keys(data),
      });

      // First check if template exists and user owns it
      const [existingTemplate] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, id))
        .limit(1);

      if (!existingTemplate) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.put.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      if (existingTemplate.userId !== userId) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.put.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      // Update the template
      const updateData = {
        ...data,
        // If status is provided as array, take the first value for now
        // This maintains backward compatibility while supporting multiselect
        status: data.status ? data.status[0] : undefined,
        updatedAt: new Date(),
      };

      const [updatedTemplate] = await db
        .update(templates)
        .set(updateData)
        .where(eq(templates.id, id))
        .returning();

      if (!updatedTemplate) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.put.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      const templateData: TemplateData = {
        id: updatedTemplate.id,
        name: updatedTemplate.name,
        description: updatedTemplate.description,
        content: updatedTemplate.content,
        status: updatedTemplate.status as typeof TemplateStatusValue,
        tags: updatedTemplate.tags ?? [],
        createdAt: updatedTemplate.createdAt.toISOString(),
        updatedAt: updatedTemplate.updatedAt.toISOString(),
        userId: updatedTemplate.userId,
      };

      return createSuccessResponse({
        success: true,
        template: templateData,
      });
    } catch (error) {
      logger.error("app.api.v1.core.templateApi.errors.server.description", {
        error,
      });
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.templateApi.id.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Delete template by ID
   */
  async deleteById(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateItemDeleteResponse>> {
    try {
      const userId = authRepository.requireUserId(user);
      logger.debug("app.api.v1.core.templateApi.delete.debug.deleting", {
        id,
        userId,
      });

      // First check if template exists and user owns it
      const [existingTemplate] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, id))
        .limit(1);

      if (!existingTemplate) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.delete.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      if (existingTemplate.userId !== userId) {
        return createErrorResponse(
          "app.api.v1.core.templateApi.id.delete.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      // Delete the template
      await db.delete(templates).where(eq(templates.id, id));

      return createSuccessResponse({
        success: true,
      });
    } catch (error) {
      logger.error("app.api.v1.core.templateApi.errors.server.description", {
        error,
      });
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.templateApi.id.delete.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const templateItemRepository = new TemplateItemRepository();
