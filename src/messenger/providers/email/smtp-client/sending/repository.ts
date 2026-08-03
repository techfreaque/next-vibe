/**
 * SMTP Sending Repository
 * Routes all sends through messenger_accounts (channel=EMAIL, provider=SMTP).
 * Delegates to SmtpRepository for the actual sending logic.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { SmtpClientT } from "../i18n";
import type { SmtpSendParams, SmtpSendResult } from "../repository";
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
}
