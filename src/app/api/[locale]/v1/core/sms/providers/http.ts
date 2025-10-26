import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { env } from "@/config/env";

import {
  phoneNumberSchema,
  type SendSmsParams,
  type SmsProvider,
  SmsProviders,
  type SmsResponseData,
  type SmsResult,
  type SmsResultMetadata,
} from "../utils";

// Define specific interfaces instead of Record types
interface HttpRequestBody {
  [key: string]: string | number | boolean;
}

interface HttpResponseData {
  [key: string]: string | number | boolean | null | HttpResponseData;
}

/**
 * HTTP Generic SMS Provider
 * Can be configured to work with virtually any HTTP-based SMS API
 */
export function getHttpProvider(): SmsProvider {
  // Cache the API URL to avoid repeated environment lookups
  const apiUrl = env.SMS_HTTP_API_URL;
  const apiKey = env.SMS_HTTP_API_KEY;
  const apiMethod = env.SMS_HTTP_API_METHOD ?? "POST";

  // Field mappings (configurable)
  const toField = env.SMS_HTTP_TO_FIELD ?? "to";
  const messageField = env.SMS_HTTP_MESSAGE_FIELD ?? "message";
  const fromField = env.SMS_HTTP_FROM_FIELD ?? "from";
  const messageIdField = env.SMS_HTTP_RESPONSE_ID_FIELD ?? "id";

  // Cache additional configuration settings
  const additionalHeaders: Record<string, string> = {};
  try {
    if (env.SMS_HTTP_CUSTOM_HEADERS) {
      // Parse custom headers safely
      const parsed = JSON.parse(env.SMS_HTTP_CUSTOM_HEADERS) as Record<
        string,
        string | number | boolean
      >;
      // Safely iterate and add only string values to headers
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === "string") {
          additionalHeaders[key] = value;
        }
      });
    }
  } catch {
    // Failed to parse SMS_HTTP_CUSTOM_HEADERS - will use default headers
    // Note: logger not available at provider initialization time
  }

  return {
    name: SmsProviders.HTTP,

    validatePhoneNumber(
      phoneNumber: string,
      logger: EndpointLogger,
    ): {
      valid: boolean;
      reason?: string;
    } {
      // For HTTP provider, we allow custom regex via env vars
      // Otherwise use the standard E.164 validation
      let pattern: RegExp;
      try {
        if (env.SMS_HTTP_PHONE_REGEX) {
          pattern = new RegExp(env.SMS_HTTP_PHONE_REGEX);
          const customSchema = z
            .string()
            .refine((value) => pattern.test(value), {
              message: "app.api.v1.core.sms.sms.error.invalid_phone_format",
            });

          const result = customSchema.safeParse(phoneNumber);
          if (!result.success) {
            return {
              valid: false,
              reason:
                result.error.issues[0]?.message ??
                "app.api.v1.core.sms.sms.error.invalid_phone_format",
            };
          }
          return { valid: true };
        }
      } catch (error) {
        logger.warn("Invalid SMS_HTTP_PHONE_REGEX, falling back to default", {
          error,
        });
      }

      // Fall back to standard E.164 validation
      const result = phoneNumberSchema.safeParse(phoneNumber);
      if (!result.success) {
        return {
          valid: false,
          reason: "app.api.v1.core.sms.sms.error.invalid_phone_format",
        };
      }
      return { valid: true };
    },

    async sendSms(
      params: SendSmsParams,
      logger: EndpointLogger,
    ): Promise<ResponseType<SmsResult>> {
      try {
        logger.debug("Sending SMS via HTTP provider", { to: params.to });

        // Validate required configuration early
        if (!apiUrl) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.missing_aws_region",
            ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          );
        }

        // Validate required parameters
        if (!params.to) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.invalid_phone_format",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        if (!params.message || params.message.trim() === "") {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.empty_message",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Default to JSON content type
        const contentType = env.SMS_HTTP_CONTENT_TYPE ?? "application/json";

        // Prepare headers
        const headers: Record<string, string> = {
          "Content-Type": contentType,
          ...additionalHeaders,
        };

        // Add authorization header if API key is provided
        if (apiKey) {
          const authScheme = env.SMS_HTTP_AUTH_SCHEME;
          // eslint-disable-next-line i18next/no-literal-string
          const bearerDefault = "Bearer";
          const scheme = authScheme ?? bearerDefault;
          headers.Authorization = `${scheme} ${apiKey}`;
        }

        // Add custom headers from options with type safety
        if (
          params.options &&
          typeof params.options === "object" &&
          params.options.headers &&
          typeof params.options.headers === "object"
        ) {
          // Safely iterate through headers
          Object.entries(params.options.headers).forEach(([key, value]) => {
            if (typeof key === "string" && typeof value === "string") {
              headers[key] = value;
            }
          });
        }

        // Build the request body based on the content type
        let body: string;
        let parsedUrl = apiUrl;

        // The body structure can be customized through env vars
        const requestBody: HttpRequestBody = {
          [toField]: params.to,
          [messageField]: params.message,
        };

        if (params.from) {
          requestBody[fromField] = params.from;
        }

        // Add any extra fields from options with proper typing
        if (
          params.options &&
          typeof params.options === "object" &&
          params.options.extraFields &&
          typeof params.options.extraFields === "object"
        ) {
          Object.entries(params.options.extraFields).forEach(([key, value]) => {
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              requestBody[key] = value;
            }
          });
        }

        // Special handling for form-urlencoded content
        if (contentType === "application/x-www-form-urlencoded") {
          const formData = new URLSearchParams();
          Object.entries(requestBody).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
          body = formData.toString();
        }
        // URL query parameters (for GET requests)
        else if (apiMethod === "GET") {
          const url = new URL(apiUrl);
          Object.entries(requestBody).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
          });
          parsedUrl = url.toString();
          body = "";
        }
        // Default to JSON
        else {
          body = JSON.stringify(requestBody);
        }

        // Make the API request with type-safe handling of body
        const requestInit: RequestInit = {
          method: apiMethod,
          headers,
        };

        // Only add the body property if it's not a GET request
        if (apiMethod !== "GET") {
          requestInit.body = body;
        }

        const response = await fetch(parsedUrl, requestInit);

        // Handle HTTP errors
        if (!response.ok) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.delivery_failed",
            ErrorResponseTypes.SMS_ERROR,
          );
        }

        // Parse successful response
        let data: SmsResponseData;
        const nonParseableKey = "raw";
        // eslint-disable-next-line i18next/no-literal-string
        const nonParseableMsg = "Non-parseable response";
        const nonParseableValue = nonParseableMsg;
        try {
          const contentTypeHeader = response.headers.get("content-type") ?? "";
          if (contentTypeHeader.includes("application/json")) {
            data = (await response.json()) as SmsResponseData;
          } else {
            data = { [nonParseableKey]: await response.text() };
          }
        } catch {
          // Intentionally empty catch block
          data = { [nonParseableKey]: nonParseableValue };
        }

        // Extract message ID from response based on configuration
        let messageId: string;
        const extractNestedValue = (
          obj: HttpResponseData,
          path: string[],
        ): string | undefined => {
          // Start with the object and handle type narrowing
          let current: string | number | boolean | null | HttpResponseData =
            obj;

          for (const segment of path) {
            // Safety check for type
            if (current === null || typeof current !== "object") {
              return undefined;
            }

            // Check if the current object has the property
            const typedCurrent: HttpResponseData = current;
            if (!(segment in typedCurrent)) {
              return undefined;
            }

            // Move to the nested property
            current = typedCurrent[segment];
          }

          // Return the value if it's a string
          return typeof current === "string" ? current : undefined;
        };

        // Extract message ID using helper function
        // eslint-disable-next-line i18next/no-literal-string
        const httpPrefixStr = "http-";
        const httpPrefix = httpPrefixStr;
        const timestamp = Date.now();
        const fallbackId = `${httpPrefix}${timestamp}`;
        if (typeof data === "object" && data !== null) {
          const fieldPath = messageIdField.split(".");
          const extractedId = extractNestedValue(data, fieldPath);
          messageId = extractedId ?? fallbackId;
        } else {
          messageId = fallbackId;
        }

        // Build a properly typed metadata object
        const metadata: SmsResultMetadata = {
          responseStatus: response.status,
          responseData: data,
        };

        // Build the response object with optional properties correctly handled
        const responseData: SmsResult = {
          messageId,
          provider: SmsProviders.HTTP,
          timestamp: new Date().toISOString(),
          to: params.to,
          metadata,
        };

        return {
          success: true,
          data: responseData,
        };
      } catch (error) {
        // eslint-disable-next-line i18next/no-literal-string
        const unknownMsg = "Unknown error";
        const unknownErrorMsg = unknownMsg;
        return createErrorResponse(
          "app.api.v1.core.sms.sms.error.delivery_failed",
          ErrorResponseTypes.SMS_ERROR,
          {
            error: error instanceof Error ? error.message : unknownErrorMsg,
          },
        );
      }
    },
  };
}
