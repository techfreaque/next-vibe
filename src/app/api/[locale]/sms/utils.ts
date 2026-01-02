import type {
  ErrorResponseType,
  ResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { smsEnv } from "./env";
// Import and re-export enum from separate file to avoid circular dependency
import { SmsProviders } from "./utils-enum";

export { SmsProviders };

/**
 * SendSmsParams defines the parameters needed to send an SMS
 */
export interface SendSmsParams {
  to: string;
  message: string;
  from?: string;
  /**
   * Optional provider-specific options
   */
  options?: ProviderBaseOptions;
  /**
   * Retry configuration
   */
  retry?: {
    attempts?: number;
    delayMs?: number;
  };
}

export interface ProviderBaseOptions {
  provider?: SmsProviders;
  // These are common options that might be used across providers
  type?: string;
  datacoding?: string;
  reference?: string;
  validity?: number | string;
  gateway?: number | string;
  smsType?: string;
  headers?: HeadersOptions;
  extraFields?: ExtraFieldsOptions;
  attributes?: AttributesOptions;
}

// Type-safe options objects
export interface HeadersOptions {
  [key: string]: string;
}

export interface ExtraFieldsOptions {
  [key: string]: string | number | boolean;
}

export interface AttributesOptions {
  [key: string]: string | number | boolean;
}

/**
 * Strongly typed metadata interface for SMS results
 */
export interface SmsResultMetadata {
  // Common metadata fields used by various providers
  direction?: string;
  uri?: string;
  accountSid?: string;
  reference?: string;
  createdDatetime?: string;
  recipient?: string;
  gateway?: string | number;
  requestId?: string;
  region?: string;
  responseStatus?: number;
  responseData?: SmsResponseData;
}

/**
 * Type for response data that can be nested
 */
export interface SmsResponseData {
  [key: string]: string | number | boolean | null | SmsResponseData;
}

/**
 * Result information from sending an SMS
 */
export interface SmsResult {
  messageId: string;
  provider: SmsProviders;
  timestamp: string;
  to: string;
  cost?: {
    amount?: number;
    currency?: string;
  };
  segments?: number;
  status?: string;
  metadata?: SmsResultMetadata;
}

/**
 * Provider interface for SMS services
 */
export interface SmsProvider {
  name: SmsProviders;
  sendSms(params: SendSmsParams, logger: EndpointLogger): Promise<ResponseType<SmsResult>>;
  validatePhoneNumber?(
    phoneNumber: string,
    logger: EndpointLogger,
  ): {
    valid: boolean;
    reason?: string;
  };
}

/**
 * Return type for SMS render functions
 */
export type SmsRenderReturnType = ResponseType<SmsTemplateReturnType | SmsTemplateReturnType[]>;

export interface SmsRenderProps<TRequest, TResponse, TUrlVariables> {
  requestData: TRequest;
  urlPathParams: TUrlVariables;
  responseData: TResponse;
  user: JwtPayloadType;
  t: TFunction;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export type SmsFunctionType<TRequest, TResponse, TUrlVariables> = (
  props: SmsRenderProps<TRequest, TResponse, TUrlVariables>,
) =>
  | Promise<
      SuccessResponseType<SmsTemplateReturnType | SmsTemplateReturnType[]> | ErrorResponseType
    >
  | SuccessResponseType<SmsTemplateReturnType | SmsTemplateReturnType[]>
  | ErrorResponseType;

export interface SmsTemplateReturnType {
  to: string;
  message: string;
  from?: string;
  options?: ProviderBaseOptions;
}

/**
 * Type-safe options for SMS templates
 */
export interface SmsTemplateOptions {
  provider?: SmsProviders;
  type?: string;
  datacoding?: string;
  reference?: string;
  validity?: number;
  smsType?: string;
  gateway?: number;
  attributes?: { [key: string]: string | number | boolean };
  headers?: { [key: string]: string };
  extraFields?: { [key: string]: string | number | boolean };
}

export interface SmsHandlerOptions {
  /**
   * Whether to log performance metrics
   */
  logPerformance?: boolean;

  /**
   * Maximum character length for SMS messages (provider dependent)
   */
  maxMessageLength?: number;

  /**
   * Whether to enable message truncation if exceeding maxMessageLength
   */
  enableTruncation?: boolean;
}

/**
 * Explicit interface for SMS handler configuration
 */
export interface SmsHandler<TRequest, TResponse, TUrlVariables> {
  readonly ignoreErrors?: boolean;
  readonly render: SmsFunctionType<TRequest, TResponse, TUrlVariables>;
}

/**
 * Explicit interface for SMS configuration
 */
export interface SmsConfig<TRequest, TResponse, TUrlVariables> {
  afterHandlerSms?: ReadonlyArray<SmsHandler<TRequest, TResponse, TUrlVariables>>;
}

/**
 * Zod schema for E.164 phone number validation
 * Shared across all SMS providers for consistency
 */
export const phoneNumberSchema = z.string().refine((value) => /^\+[1-9]\d{1,14}$/.test(value), {
  message: "errors.sms_phone_number_format",
});

/**
 * Validates a phone number for a specific provider
 * Uses the standard E.164 validation with provider-specific error messages
 */
export function validateE164PhoneNumber(
  phoneNumber: string,
  providerName: SmsProviders,
): { valid: boolean; reason?: string } {
  // Special case for HTTP provider with custom regex
  if (providerName === SmsProviders.HTTP) {
    try {
      if (smsEnv.SMS_HTTP_PHONE_REGEX) {
        const pattern = new RegExp(smsEnv.SMS_HTTP_PHONE_REGEX);
        if (!pattern.test(phoneNumber)) {
          return {
            valid: false,
            reason: "errors.sms_invalid_http_phone_format",
          };
        }
        return { valid: true };
      }
    } catch {
      // Fall back to standard validation if regex is invalid
    }
  }

  const result = phoneNumberSchema.safeParse(phoneNumber);
  if (!result.success) {
    return {
      valid: false,
      reason: "errors.sms_e164_format_required",
    };
  }
  return { valid: true };
}
