/**
 * Open database studio Repository
 * Handles open database studio operations
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import type { StudioRequestOutput, StudioResponseOutput } from "./definition";

/**
 * Open database studio Repository Interface
 */
export interface StudioRepositoryInterface {
  execute(
    data: StudioRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<StudioResponseOutput>>;
}

/**
 * Open database studio Repository Implementation
 */
export class StudioRepositoryImpl implements StudioRepositoryInterface {
  async execute(
    data: StudioRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<StudioResponseOutput>> {
    const startTime = Date.now();

    try {
      // Simulate database studio launch
      logger.info("Starting database studio");
      const port = data.port ? parseInt(data.port, 10) : 5555;
      const url = `http://localhost:${port}`;

      const duration = Date.now() - startTime;

      const response: StudioResponseOutput = {
        success: true,
        url,
        portUsed: port,
        output: "",
        duration,
      };

      return await Promise.resolve(createSuccessResponse(response));
    } catch (error) {
      const duration = Date.now() - startTime;
      const parsedError = parseError(error);

      return await Promise.resolve(
        createErrorResponse(
          "app.api.v1.core.system.db.studio.post.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          {
            error: parsedError.message,
            output: "",
            duration,
          },
        ),
      );
    }
  }
}

/**
 * Default repository instance
 */
export const studioRepository = new StudioRepositoryImpl();
