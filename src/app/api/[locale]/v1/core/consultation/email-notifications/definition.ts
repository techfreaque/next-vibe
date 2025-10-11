/**
 * Consultation Email Notifications Definition
 * Type definitions for consultation-related email communications
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Consultation Email Request Types
 */
export interface ConsultationEmailRequestTypeOutput {
  to: string;
  subject: string;
  body: string;
  consultationId?: string;
  userId?: string;
  attachments?: string[];
}

/**
 * Consultation Email Response Types
 */
export interface ConsultationEmailResponseTypeOutput {
  success: boolean;
  messageId: string;
  sentAt: string;
}

/**
 * Email Type Enum for Different Consultation Email Types
 */
export type ConsultationEmailType =
  | "confirmation"
  | "update"
  | "reminder"
  | "cancellation";

/**
 * Consultation Email Service Interface
 */
export interface ConsultationEmailRepository {
  sendConsultationConfirmation(
    data: ConsultationEmailRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationEmailResponseTypeOutput>>;

  sendConsultationUpdate(
    data: ConsultationEmailRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationEmailResponseTypeOutput>>;

  sendConsultationReminder(
    data: ConsultationEmailRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationEmailResponseTypeOutput>>;

  sendConsultationCancellation(
    data: ConsultationEmailRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationEmailResponseTypeOutput>>;
}
