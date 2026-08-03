import type { VibeTranslationKey } from "../i18n/shared";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import { z } from "zod";

/**
 * Create a standardized error response with a translation key
 *
 * Interpolation belongs in the `t()` call, not here: `t(key, params)` already
 * substitutes `{{param}}` placeholders, so a response carries finished text.
 *
 * ```ts
 * return fail({ message: t("errors.notFound.title", { path }), errorType });
 * ```
 *
 * @param message - The already translated error message
 * @param errorType - The type of error
 * @param cause - Optional cause of the error to aid debugging
 * @returns A standardized error response with translation key
 */
export function fail({
  message,
  errorType,
  cause,
}: {
  message: TranslatedKeyType;
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements];
  cause?: ErrorResponseType;
}): ErrorResponseType {
  return {
    success: false,
    message,
    errorType,
    cause,
  };
}

/**
 * Create an error response from literal, already-display-ready text.
 *
 * RESTRICTED to the modules that have NO i18n scope, and that list is exactly
 * three: `src/vibe/tooling/check/**`, `src/vibe/core/setup/**` and
 * `src/vibe/core/generators/**`. All three build their endpoints with the
 * non-i18n `createEndpoint` from `core/definition/create.ts`, so none has a
 * `t()` to produce a `TranslatedKeyType` — {@link fail} is not merely
 * discouraged there, it does not typecheck. Every other module in the repo HAS
 * a scope and MUST use {@link fail} with `t()`.
 *
 * The test for admission is that the module has dropped i18n wholesale, not that
 * a literal would be convenient at one call site. Adding a module here without
 * dropping its scope is the mistake the paragraph below describes.
 *
 * Reaching for this elsewhere produces half-translated output - a German user
 * reading "Interner Fehler: failed to setup guard jail". That happened at ~200
 * sites and had to be undone; the shortcut is always more tempting than it looks,
 * so the boundary is the rule rather than a judgement call.
 *
 * The three shapes this exists to prevent, all of which leak untranslated
 * English into a translated message:
 *
 * ```ts
 * // (A) concatenating a detail onto a translated label
 * fail({ message: `${t("errors.server.title")}: ${error.message}` })
 * // (B) an English literal smuggled through the params object
 * fail({ message: t("errors.executionFailed", { error: "new_page failed" }) })
 * // (C) English prose assembled at the call site
 * fail({ message: t("errors.commandFailed", { error: `Monitor "${name}" not found` }) })
 * ```
 *
 * `t()` params carry raw runtime VALUES - a caught error's `.message`, an id, a
 * path, a count. Never prose. If the English words exist only at the call site,
 * they belong in a translation key:
 *
 * ```ts
 * fail({ message: t("errors.monitorNotFound", { monitorName: name }) });
 * ```
 *
 * When a key is also rendered param-free (a static banner, or an `errorTypes:`
 * entry in an endpoint definition), do NOT add a placeholder to it - it would
 * render raw `{{error}}` there. SPLIT it: keep the bare key for that use and add
 * a sibling detail key carrying the placeholder.
 *
 * Neither function takes interpolation params: for `fail` they belong in
 * `t(key, params)`, which fills `{{param}}` before the text reaches a response.
 */
export function failInline({
  message,
  errorType,
  cause,
}: {
  message: string;
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements];
  cause?: ErrorResponseType;
}): ErrorResponseType {
  return {
    success: false,
    // oxlint-disable-next-line restricted/restricted-syntax
    message: message as TranslatedKeyType,
    errorType,
    cause,
  };
}

/**
 * Options for success response
 */
interface SuccessResponseOptions {
  /** Mark as error response (for special handling) */
  isErrorResponse?: true;
  /** Custom headers to include in the HTTP response */
  headers?: Record<string, string>;
  /**
   * Performance metadata (display label as key, duration in ms as value).
   * Labels are translated text from `t()` for scoped endpoints, or plain
   * literals for `createEndpointInline` ones - both are already display-ready.
   */
  performance?: Partial<Record<string, number>>;
}

/**
 * Create a standardized success response
 * @param data - The response data (optional for void responses)
 * @param options - Optional settings for the response
 * @returns A standardized success response
 */
export function success<TResponse>(
  data: TResponse,
  options?: SuccessResponseOptions,
): ResponseType<TResponse>;
export function success<TResponse extends never>(
  data?: TResponse,
): ResponseType<TResponse>;
export function success<TResponse>(
  data?: TResponse,
  options?: SuccessResponseOptions,
): ResponseType<TResponse> {
  return {
    success: true,
    data: data as TResponse,
    ...(options?.isErrorResponse && { isErrorResponse: true }),
    ...(options?.headers && { headers: options.headers }),
    ...(options?.performance && { performance: options.performance }),
  };
}

const messageResponseSchema = z.object({
  message: z.string() as z.ZodType<TranslatedKeyType>,
});

export type ResponseType<
  TResponseData,
  TKey extends TranslatedKeyType = TranslatedKeyType,
> = SuccessResponseType<TResponseData> | ErrorResponseType<TKey>;

/**
 * Streaming response marker
 * When a handler returns this, the Next.js handler will return the Response directly
 * without wrapping it in NextResponse.json()
 *
 * NOTE: This is NOT part of ResponseType - it's a separate return type for streaming handlers
 */
export interface StreamingResponse {
  isStreamingResponse: true;
  response: Response;
}

/**
 * File response marker
 * When a handler returns this, the Next.js handler will return a NextResponse with binary data
 * without wrapping it in NextResponse.json()
 *
 * NOTE: This is NOT part of ResponseType - it's a separate return type for file handlers
 */
export interface FileResponse {
  isFileResponse: true;
  buffer: Buffer | ReadableStream | Blob;
  contentType: string;
  headers?: Record<string, string>;
}

/**
 * A content block within a ContentResponse.
 * Follows the MCP content block specification.
 */
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string }
  /** Storage URL variant — base64 is never stored; fetched on-demand when building AI messages */
  | { type: "image_url"; url: string; mimeType: string };

/**
 * Content response marker
 * When a handler returns this, the response contains mixed content blocks (text + images).
 * Each platform handles it natively:
 * - MCP: Returns content blocks directly (images rendered inline by MCP clients)
 * - AI stream: Returns multipart tool result with image-data parts (AI can "see" images)
 * - Web/CLI: Renders via widget system
 *
 * NOTE: This is NOT part of ResponseType - it's a separate return type like FileResponse
 */
export interface ContentResponse {
  isContentResponse: true;
  content: ContentBlock[];
}

/**
 * Union of all possible handler return types.
 * Used by type guards and handler signatures.
 */
export type HandlerResponse<T> =
  | ResponseType<T>
  | StreamingResponse
  | FileResponse
  | ContentResponse;

/**
 * Create a streaming response marker
 */
export function createStreamingResponse(response: Response): StreamingResponse {
  return {
    isStreamingResponse: true,
    response,
  };
}

/**
 * Create a file response marker
 */
export function createFileResponse(
  buffer: Buffer | ReadableStream | Blob,
  contentType: string,
  headers?: Record<string, string>,
): FileResponse {
  return {
    isFileResponse: true,
    buffer,
    contentType,
    headers,
  };
}

/**
 * Create a content response with mixed text and image blocks
 */
export function createContentResponse(
  content: ContentBlock[],
): ContentResponse {
  return {
    isContentResponse: true,
    content,
  };
}

/**
 * Type guard to check if a response is a streaming response
 */
export function isStreamingResponse<T>(
  value: HandlerResponse<T>,
): value is StreamingResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "isStreamingResponse" in value &&
    value.isStreamingResponse === true
  );
}

/**
 * Type guard to check if a response is a file response
 */
export function isFileResponse<T>(
  value: HandlerResponse<T>,
): value is FileResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "isFileResponse" in value &&
    value.isFileResponse === true
  );
}

/**
 * Type guard to check if a response is a content response
 */
export function isContentResponse<T>(
  value: HandlerResponse<T>,
): value is ContentResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "isContentResponse" in value &&
    value.isContentResponse === true
  );
}

export type MessageResponseType = z.infer<typeof messageResponseSchema>;

/**
 * A type alias, NOT an interface: this rides endpoint payloads (e.g. a tool
 * call's `error`), so it must be assignable to `WidgetData`, whose record arm is
 * `{ [key: string]: WidgetData }`. TypeScript grants an implicit index signature
 * to object type aliases but never to interfaces, so an interface here is
 * unassignable at every erased payload boundary.
 */
// eslint-disable-next-line typescript/consistent-type-definitions, @typescript-eslint/consistent-type-definitions -- Must be a type alias, not an interface: only aliases get the implicit index signature that makes this assignable to WidgetData on an endpoint payload. See above.
export type ErrorResponseType<
  TKey extends TranslatedKeyType = TranslatedKeyType,
> = {
  success: false;
  message: TKey;
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements];
  cause?: ErrorResponseType;
};

export interface SuccessResponseType<TResponseData> {
  success: true;
  data: TResponseData;
  isErrorResponse?: true;
  performance?: Partial<Record<TranslatedKeyType, number>>;
  /** When true, the task runner will NOT automatically mark this task as completed/failed.
   *  The handler is responsible for managing the task lifecycle externally
   *  (e.g. interactive Claude Code sessions that use the complete-task MCP tool). */
  taskLifecycleManagedExternally?: true;
  message?: never;
  errorType?: never;
  cause?: never;
}

type ErrorTypes =
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
  | "PAYMENT_REQUIRED"
  | "CONFLICT";

export type ErrorResponseTypesElements = {
  [errorType in ErrorTypes]: {
    // Keyed off the framework's own shared scope, not the app's. `core` has to be
    // vendorable standalone, so it must not reach up into `_pages` for a type.
    errorKey: VibeTranslationKey;
    errorCode: number;
  };
};

export const ErrorResponseTypes: ErrorResponseTypesElements = {
  PAYMENT_REQUIRED: {
    errorKey: "errorTypes.payment_required",
    errorCode: 402,
  },
  EXTERNAL_SERVICE_ERROR: {
    errorKey: "errorTypes.external_service_error",
    errorCode: 500,
  },
  TWO_FACTOR_REQUIRED: {
    errorKey: "errorTypes.two_factor_required",
    errorCode: 202,
  },
  FORBIDDEN: {
    errorKey: "errorTypes.forbidden",
    errorCode: 403,
  },
  BAD_REQUEST: {
    errorKey: "errorTypes.bad_request",
    errorCode: 400,
  },
  UNKNOWN_ERROR: {
    errorKey: "errorTypes.unknown_error",
    errorCode: 500,
  },
  DATABASE_ERROR: {
    errorKey: "errorTypes.database_error",
    errorCode: 500,
  },
  VALIDATION_ERROR: {
    errorKey: "errorTypes.validation_error",
    errorCode: 400,
  },
  AUTH_ERROR: {
    errorKey: "errorTypes.auth_error",
    errorCode: 401,
  },
  UNAUTHORIZED: {
    errorKey: "errorTypes.unauthorized",
    errorCode: 403,
  },
  NOT_FOUND: {
    errorKey: "errorTypes.not_found",
    errorCode: 404,
  },
  EMAIL_ERROR: {
    errorKey: "errorTypes.email_error",
    errorCode: 500,
  },
  INTERNAL_ERROR: {
    errorKey: "errorTypes.internal_error",
    errorCode: 500,
  },
  NO_RESPONSE_DATA: {
    errorKey: "errorTypes.no_response_data",
    errorCode: 500,
  },
  HTTP_ERROR: {
    errorKey: "errorTypes.http_error",
    errorCode: 500,
  },
  SMS_ERROR: {
    errorKey: "errorTypes.sms_error",
    errorCode: 500,
  },
  TOKEN_EXPIRED_ERROR: {
    errorKey: "errorTypes.token_expired_error",
    errorCode: 401,
  },
  PERMISSION_ERROR: {
    errorKey: "errorTypes.permission_error",
    errorCode: 403,
  },
  INVALID_TOKEN_ERROR: {
    errorKey: "errorTypes.invalid_token_error",
    errorCode: 401,
  },
  PERMISSION_DENIED: {
    errorKey: "errorTypes.permission_denied",
    errorCode: 403,
  },
  INVALID_CREDENTIALS_ERROR: {
    errorKey: "errorTypes.invalid_credentials_error",
    errorCode: 401,
  },
  INVALID_REQUEST_ERROR: {
    errorKey: "errorTypes.invalid_request_error",
    errorCode: 400,
  },
  INVALID_DATA_ERROR: {
    errorKey: "errorTypes.invalid_data_error",
    errorCode: 400,
  },
  INVALID_INPUT_ERROR: {
    errorKey: "errorTypes.invalid_input_error",
    errorCode: 400,
  },
  INVALID_PAYLOAD_ERROR: {
    errorKey: "errorTypes.invalid_payload_error",
    errorCode: 400,
  },
  INVALID_FORMAT_ERROR: {
    errorKey: "errorTypes.invalid_format_error",
    errorCode: 400,
  },
  INVALID_PARAMETER_ERROR: {
    errorKey: "errorTypes.invalid_parameter_error",
    errorCode: 400,
  },
  INVALID_QUERY_ERROR: {
    errorKey: "errorTypes.invalid_query_error",
    errorCode: 400,
  },
  INVALID_URL_ERROR: {
    errorKey: "errorTypes.invalid_url_error",
    errorCode: 400,
  },
  INVALID_PATH_ERROR: {
    errorKey: "errorTypes.invalid_path_error",
    errorCode: 400,
  },
  INVALID_METHOD_ERROR: {
    errorKey: "errorTypes.invalid_method_error",
    errorCode: 400,
  },
  INVALID_STATUS_ERROR: {
    errorKey: "errorTypes.invalid_status_error",
    errorCode: 400,
  },
  INVALID_RESPONSE_ERROR: {
    errorKey: "errorTypes.invalid_response_error",
    errorCode: 400,
  },
  PAYMENT_ERROR: {
    errorKey: "errorTypes.payment_failed",
    errorCode: 400,
  },
  PARTIAL_FAILURE: {
    errorKey: "errorTypes.partial_failure",
    errorCode: 207,
  },
  CONFLICT: {
    errorKey: "errorTypes.unknown_error",
    errorCode: 409,
  },
} as const;
