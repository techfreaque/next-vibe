/**
 * SMTP Sending Repository
 * Routes all sends through messenger_accounts (channel=EMAIL, provider=SMTP).
 * Delegates to SmtpRepository for the actual sending logic.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { SmtpClientT } from "../i18n";
import type {
  SmtpCapacityResponseOutput,
  SmtpSendParams,
  SmtpSendResult,
} from "../repository";
import { SmtpRepository } from "../repository";

/**
 * SMTP Sending Repository - thin wrapper over SmtpRepository.
 * Kept for backward-compat with existing callers (EmailSendingRepository, etc.).
 */
export class SmtpSendingRepository {
  /**
   * Send email - delegates entirely to SmtpRepository which now reads messenger_accounts.
   */
  static async sendEmail(
    data: SmtpSendParams,
    logger: EndpointLogger,
    t: SmtpClientT,
  ): Promise<ResponseType<SmtpSendResult>> {
    // SmtpRepository.sendEmail requires a user - use a minimal service user shape
    const serviceUser: JwtPayloadType = {
      id: "00000000-0000-0000-0000-000000000001",
      leadId: "00000000-0000-0000-0000-000000000001",
      isPublic: false,
      roles: [],
    };
    return SmtpRepository.sendEmail(data, serviceUser, t, logger);
  }

  /**
   * Get total sending capacity - delegates to SmtpRepository.
   */
  static async getTotalSendingCapacity(
    data: Record<string, never>,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: SmtpClientT,
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
