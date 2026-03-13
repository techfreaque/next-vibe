/**
 * SMTP Sending Repository
 * Routes all sends through messenger_accounts (channel=EMAIL, provider=SMTP).
 * Delegates to SmtpRepository for the actual sending logic.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type {
  SmtpCapacityRequestOutput,
  SmtpCapacityResponseOutput,
  SmtpSendRequestOutput,
  SmtpSendResponseOutput,
} from "../repository";
import { SmtpRepository } from "../repository";
import type { scopedTranslation as SmtpScopedTranslation } from "../i18n";

type ModuleT = ReturnType<typeof SmtpScopedTranslation.scopedT>["t"];

/**
 * SMTP Sending Repository — thin wrapper over SmtpRepository.
 * Kept for backward-compat with existing callers (EmailSendingRepository, etc.).
 */
export class SmtpSendingRepository {
  /**
   * Send email — delegates entirely to SmtpRepository which now reads messenger_accounts.
   */
  static async sendEmail(
    data: SmtpSendRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<SmtpSendResponseOutput>> {
    // SmtpRepository.sendEmail requires a user — use a minimal service user shape
    const serviceUser: JwtPayloadType = {
      id: "00000000-0000-0000-0000-000000000001",
      leadId: "00000000-0000-0000-0000-000000000001",
      isPublic: false,
      roles: [],
    };
    return SmtpRepository.sendEmail(data, serviceUser, t, logger);
  }

  /**
   * Get total sending capacity — delegates to SmtpRepository.
   */
  static async getTotalSendingCapacity(
    data: SmtpCapacityRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<SmtpCapacityResponseOutput>> {
    return SmtpRepository.getTotalSendingCapacity(data, user, t, logger);
  }

  /**
   * Close all cached SMTP transports.
   */
  static async closeAllTransports(logger: EndpointLogger): Promise<void> {
    const repo = new SmtpRepository();
    await repo.closeAllTransports();
    logger.debug("SmtpSendingRepository: closed all transports");
  }
}
