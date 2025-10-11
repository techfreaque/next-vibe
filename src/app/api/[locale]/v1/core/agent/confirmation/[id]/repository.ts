/**
 * Human Confirmation Repository
 * Data access layer for human confirmation functionality
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { humanConfirmationRequests } from "../../db";
import { ConfirmationResponseAction, ConfirmationStatus } from "../../enum";
import type { HumanConfirmationResponsePostRequestTypeOutput } from "./definition";

/**
 * Human Confirmation Repository Interface
 */
export interface HumanConfirmationRepository {
  respondToConfirmation(
    confirmationId: string,
    data: HumanConfirmationResponsePostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<{ success: boolean; message: TranslationKey }>>;
}

/**
 * Human Confirmation Repository Implementation
 */
class HumanConfirmationRepositoryImpl implements HumanConfirmationRepository {
  /**
   * Respond to a human confirmation request
   */
  async respondToConfirmation(
    confirmationId: string,
    data: HumanConfirmationResponsePostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<{ success: boolean; message: TranslationKey }>> {
    try {
      logger.debug("Processing confirmation response", {
        confirmationId,
        data,
        userId,
      });

      // Get the confirmation request
      const [confirmationRequest] = await db
        .select()
        .from(humanConfirmationRequests)
        .where(eq(humanConfirmationRequests.id, confirmationId));

      if (!confirmationRequest) {
        return createErrorResponse(
          "imapErrors.agent.confirmation.error.not_found.description",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Check if already responded
      if (confirmationRequest.status !== ConfirmationStatus.PENDING) {
        return createErrorResponse(
          "imapErrors.agent.confirmation.error.conflict.description",
          ErrorResponseTypes.CONFLICT,
        );
      }

      // Check if expired
      if (new Date() > confirmationRequest.expiresAt) {
        await db
          .update(humanConfirmationRequests)
          .set({
            status: ConfirmationStatus.EXPIRED,
            updatedAt: new Date(),
          })
          .where(eq(humanConfirmationRequests.id, confirmationId));

        return createErrorResponse(
          "imapErrors.agent.confirmation.error.expired.description",
          ErrorResponseTypes.CONFLICT,
        );
      }

      // Update confirmation request
      await db
        .update(humanConfirmationRequests)
        .set({
          status:
            data.action === ConfirmationResponseAction.APPROVE
              ? ConfirmationStatus.APPROVED
              : ConfirmationStatus.REJECTED,
          respondedAt: new Date(),
          respondedBy: userId || null,
          response: data.reason || null,
          metadata: data.metadata
            ? Object.fromEntries(
                Object.entries(data.metadata).map(([k, v]) => [k, String(v)]),
              )
            : {},
          updatedAt: new Date(),
        })
        .where(eq(humanConfirmationRequests.id, confirmationId));

      const message: TranslationKey =
        data.action === ConfirmationResponseAction.APPROVE
          ? "imapErrors.agent.confirmation.success.approved"
          : "imapErrors.agent.confirmation.success.rejected";

      return createSuccessResponse({
        success: true,
        message,
      });
    } catch (error) {
      logger.error("Failed to process confirmation response", {
        error,
        confirmationId,
        data,
        userId,
      });
      return createErrorResponse(
        "imapErrors.agent.confirmation.error.server.description",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Human Confirmation Repository Instance
 */
export const humanConfirmationRepository =
  new HumanConfirmationRepositoryImpl();
