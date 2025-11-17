import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "../../types/logger";

export interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

export interface CreditIdentifier {
  leadId?: string;
  userId?: string;
}

export enum CreditType {
  USER_SUBSCRIPTION = "user_subscription",
  LEAD_FREE = "lead_free",
}

export interface CreditDeductionResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Base Credit Handler - Abstract interface for credit operations
 * All business logic has been moved to CreditRepository for repository-first architecture
 */
export abstract class BaseCreditHandler {
  abstract getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>>;

  abstract deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  abstract addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  abstract hasSufficientCredits(
    identifier: CreditIdentifier,
    required: number,
    logger: EndpointLogger,
  ): Promise<boolean>;

  abstract deductCreditsWithValidation(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<CreditDeductionResult>;

  abstract generateMessageId(): string;
}
