import { z } from "zod";

import type { TParams, TranslationKey } from "@/i18n/core/static-types";

/**
 * Create a standardized error response with a translation key
 * @deprecated Use new object style fail({ ... }) instead
 * @param message - The already translated error message
 * @param translationKey - The translation key for the error message
 * @param errorType - The type of error
 * @param errorCode - Optional error code
 * @returns A standardized error response with translation key
 */
export function createErrorResponse(
  message: TranslationKey,
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements],
  messageParams?: TParams,
): ErrorResponseType {
  return {
    success: false,
    message,
    messageParams,
    errorType,
  };
}

/**
 * Create a standardized error response with a translation key
 * @param message - The already translated error message
 * @param errorType - The type of error
 * @param messageParams - Optional parameters for the translation
 * @param cause - Optional cause of the error to aid debugging
 * @returns A standardized error response with translation key
 */
export function fail({
  message,
  errorType,
  messageParams,
  cause,
}: {
  message: TranslationKey;
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements];
  messageParams?: TParams;
  cause?: ErrorResponseType;
}): ErrorResponseType {
  return {
    success: false,
    message,
    messageParams,
    errorType,
    cause,
  };
}

/**
 * Custom error class that carries ErrorResponseType data
 * This allows ErrorResponseType to be thrown and caught in try-catch blocks
 */
export class ErrorResponseError extends Error {
  readonly errorResponse: ErrorResponseType;

  constructor(errorResponse: ErrorResponseType) {
    super(errorResponse.message);
    this.name = "ErrorResponseError";
    this.errorResponse = errorResponse;
  }
}

/**
 * Create a throwable error response with a translation key
 * This creates an ErrorResponseType and throws it as an ErrorResponseError
 * @param message - The translation key for the error message
 * @param errorType - The type of error
 * @param messageParams - Optional parameters for the translation
 * @throws ErrorResponseError containing the ErrorResponseType
 */
export function throwErrorResponse(
  message: TranslationKey,
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements],
  messageParams?: TParams,
): never {
  const errorResponse = createErrorResponse(message, errorType, messageParams);
  // eslint-disable-next-line no-restricted-syntax
  throw new ErrorResponseError(errorResponse);
}

/**
 * Create a standardized success response
 * @param data - The response data
 * @returns A standardized success response
 */
export function createSuccessResponse<TResponse>(
  data: TResponse,
): ResponseType<TResponse> {
  return {
    success: true,
    data,
  };
}

export function createSuccessMessageResponse(
  message: TranslationKey,
  messageParams?: TParams,
): ResponseType<MessageResponseType> {
  return {
    success: true,
    data: {
      message,
      messageParams,
    },
  };
}

export const messageResponseSchema = z.object({
  // TODO TranslationKey validation here
  message: z.string() as z.ZodType<TranslationKey>,
  messageParams: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string() as z.ZodType<TranslationKey>,
  messageParams: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional(),
  errorType: z.object({
    errorKey: z.string(),
    errorCode: z.number(),
  }),
});

export type ResponseType<TResponseData> =
  | SuccessResponseType<TResponseData>
  | ErrorResponseType;

/**
 * Streaming response marker
 * When a handler returns this, the Next.js handler will return the Response directly
 * without wrapping it in NextResponse.json()
 *
 * NOTE: This is NOT part of ResponseType - it's a separate return type for streaming handlers
 */
export interface StreamingResponse {
  __isStreamingResponse: true;
  response: Response;
}

/**
 * Create a streaming response marker
 * Use this in handlers that need to return streaming responses
 */
export function createStreamingResponse(response: Response): StreamingResponse {
  return {
    __isStreamingResponse: true,
    response,
  };
}

/**
 * Type guard to check if a response is a streaming response
 */
export function isStreamingResponse(
  value: unknown,
): value is StreamingResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "__isStreamingResponse" in value &&
    value.__isStreamingResponse === true
  );
}

export type MessageResponseType = z.infer<typeof messageResponseSchema>;

export interface ErrorResponseType {
  success: false;
  message: TranslationKey;
  messageParams?: TParams;
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements];
  cause?: ErrorResponseType;
}

export interface SuccessResponseType<TResponseData> {
  success: true;
  data: TResponseData;
  message?: never;
  messageParams?: never;
  errorType?: never;
  cause?: never;
}

export type ErrorTypes =
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "EMAIL_ERROR"
  | "INTERNAL_ERROR"
  | "NO_RESPONSE_DATA"
  | "HTTP_ERROR"
  | "SMS_ERROR"
  | "TOKEN_EXPIRED_ERROR"
  | "INVALID_TOKEN_ERROR"
  | "PERMISSION_DENIED"
  | "INVALID_CREDENTIALS_ERROR"
  | "INVALID_REQUEST_ERROR"
  | "INVALID_DATA_ERROR"
  | "INVALID_INPUT_ERROR"
  | "INVALID_PAYLOAD_ERROR"
  | "INVALID_FORMAT_ERROR"
  | "INVALID_PARAMETER_ERROR"
  | "INVALID_QUERY_ERROR"
  | "INVALID_URL_ERROR"
  | "UNKNOWN_ERROR"
  | "INVALID_PATH_ERROR"
  | "INVALID_METHOD_ERROR"
  | "INVALID_STATUS_ERROR"
  | "DATABASE_ERROR"
  | "FORBIDDEN"
  | "EXTERNAL_SERVICE_ERROR"
  | "INVALID_RESPONSE_ERROR"
  | "BAD_REQUEST"
  | "TWO_FACTOR_REQUIRED"
  | "PERMISSION_ERROR"
  | "PAYMENT_ERROR"
  | "PARTIAL_FAILURE"
  | "CONFLICT";

export type ErrorResponseTypesElements = {
  [errorType in ErrorTypes]: {
    errorKey: TranslationKey;
    errorCode: number;
  };
};

export const ErrorResponseTypes: ErrorResponseTypesElements = {
  EXTERNAL_SERVICE_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.external_service_error",
    errorCode: 500,
  },
  TWO_FACTOR_REQUIRED: {
    errorKey: "app.api.v1.core.shared.errorTypes.two_factor_required",
    errorCode: 202,
  },
  FORBIDDEN: {
    errorKey: "app.api.v1.core.shared.errorTypes.forbidden",
    errorCode: 403,
  },
  BAD_REQUEST: {
    errorKey: "app.api.v1.core.shared.errorTypes.bad_request",
    errorCode: 400,
  },
  UNKNOWN_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.unknown_error",
    errorCode: 500,
  },
  DATABASE_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.database_error",
    errorCode: 500,
  },
  VALIDATION_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.validation_error",
    errorCode: 400,
  },
  AUTH_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.auth_error",
    errorCode: 401,
  },
  UNAUTHORIZED: {
    errorKey: "app.api.v1.core.shared.errorTypes.unauthorized",
    errorCode: 403,
  },
  NOT_FOUND: {
    errorKey: "app.api.v1.core.shared.errorTypes.not_found",
    errorCode: 404,
  },
  EMAIL_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.email_error",
    errorCode: 500,
  },
  INTERNAL_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.internal_error",
    errorCode: 500,
  },
  NO_RESPONSE_DATA: {
    errorKey: "app.api.v1.core.shared.errorTypes.no_response_data",
    errorCode: 500,
  },
  HTTP_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.http_error",
    errorCode: 500,
  },
  SMS_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.sms_error",
    errorCode: 500,
  },
  TOKEN_EXPIRED_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.token_expired_error",
    errorCode: 401,
  },
  PERMISSION_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.permission_error",
    errorCode: 403,
  },
  INVALID_TOKEN_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_token_error",
    errorCode: 401,
  },
  PERMISSION_DENIED: {
    errorKey: "app.api.v1.core.shared.errorTypes.permission_denied",
    errorCode: 403,
  },
  INVALID_CREDENTIALS_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_credentials_error",
    errorCode: 401,
  },
  INVALID_REQUEST_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_request_error",
    errorCode: 400,
  },
  INVALID_DATA_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_data_error",
    errorCode: 400,
  },
  INVALID_INPUT_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_input_error",
    errorCode: 400,
  },
  INVALID_PAYLOAD_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_payload_error",
    errorCode: 400,
  },
  INVALID_FORMAT_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_format_error",
    errorCode: 400,
  },
  INVALID_PARAMETER_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_parameter_error",
    errorCode: 400,
  },
  INVALID_QUERY_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_query_error",
    errorCode: 400,
  },
  INVALID_URL_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_url_error",
    errorCode: 400,
  },
  INVALID_PATH_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_path_error",
    errorCode: 400,
  },
  INVALID_METHOD_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_method_error",
    errorCode: 400,
  },
  INVALID_STATUS_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_status_error",
    errorCode: 400,
  },
  INVALID_RESPONSE_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.invalid_response_error",
    errorCode: 400,
  },
  PAYMENT_ERROR: {
    errorKey: "app.api.v1.core.shared.errorTypes.payment_failed",
    errorCode: 400,
  },
  PARTIAL_FAILURE: {
    errorKey: "app.api.v1.core.shared.errorTypes.partial_failure",
    errorCode: 207,
  },
  CONFLICT: {
    errorKey: "app.api.v1.core.shared.errorTypes.unknown_error",
    errorCode: 409,
  },
} as const;
