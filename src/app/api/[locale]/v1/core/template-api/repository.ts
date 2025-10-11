/**
 * Template Repository
 * Main repository for template operations
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

import type { NewTemplate, Template } from "./db";
import { templates } from "./db";

/**
 * Template creation response
 */
export interface TemplateCreateResponse {
  success: boolean;
  template: Template;
}

/**
 * Template Repository Interface
 */
export interface ITemplateRepository {
  create(
    data: NewTemplate,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateCreateResponse>>;
}

/**
 * Template Repository Implementation
 */
class TemplateRepository implements ITemplateRepository {
  /**
   * Create a new template
   */
  async create(
    data: NewTemplate,
    logger: EndpointLogger,
  ): Promise<ResponseType<TemplateCreateResponse>> {
    try {
      logger.debug("Creating new template", { name: data.name });

      const [template] = await db
        .insert(templates)
        .values(data)
        .returning();

      if (!template) {
        logger.error("Failed to create template - no data returned");
        return createErrorResponse(
          "Failed to create template",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      logger.debug("Successfully created template", { id: template.id });

      return createSuccessResponse({
        success: true,
        template,
      });
    } catch (error) {
      logger.error("Error creating template:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "Failed to create template",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const templateRepository = new TemplateRepository();