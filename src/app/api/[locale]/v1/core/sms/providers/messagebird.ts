import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import type {
  SendSmsParams,
  SmsProvider,
  SmsResult,
  SmsResultMetadata,
} from "../utils";
import { SmsProviders } from "../utils";

// Define interfaces for MessageBird responses
interface MessageBirdErrorItem {
  description?: string;
  message?: string;
}

interface MessageBirdErrorResponse {
  errors?: MessageBirdErrorItem[];
}

interface MessageBirdPrice {
  amount?: number;
  currency?: string;
}

interface MessageBirdRecipientItem {
  recipient?: string;
}

interface MessageBirdRecipients {
  items?: MessageBirdRecipientItem[];
}

interface MessageBirdSuccessResponse {
  id: string;
  status?: string;
  parts?: number;
  price?: MessageBirdPrice;
  reference?: string;
  createdDatetime?: string;
  recipients?: MessageBirdRecipients;
  gateway?: string;
}

/**
 * Creates a MessageBird provider for SMS sending
 */
export function getMessageBirdProvider(): SmsProvider {
  const accessKey = env.MESSAGEBIRD_ACCESS_KEY;

  // Cache API URL
  const apiUrl = "https://rest.messagebird.com/messages";

  return {
    name: SmsProviders.MESSAGEBIRD,

    async sendSms(
      params: SendSmsParams,
      logger: EndpointLogger,
    ): Promise<ResponseType<SmsResult>> {
      try {
        // Validate access key early
        if (!accessKey) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.missing_aws_access_key",
            ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          );
        }

        // Type guard for params
        if (!params || typeof params !== "object") {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.invalid_phone_format",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        logger.debug("Sending SMS via MessageBird", { to: params.to });

        // Validate required parameters
        if (!params.to) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.invalid_phone_format",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // From phone number fallback with nullish coalescing
        const originator = params.from ?? env.SMS_FROM_NUMBER;
        if (!originator) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.invalid_phone_format",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        if (
          !params.message ||
          typeof params.message !== "string" ||
          params.message.trim() === ""
        ) {
          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.empty_message",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Build the request body
        interface MessageBirdRequestBody {
          recipients: string;
          originator: string;
          body: string;
          type?: string;
          datacoding?: string;
          reference?: string;
          validity?: number | string;
          gateway?: number | string;
        }

        // Create properly typed request body
        const requestData: MessageBirdRequestBody = {
          recipients: params.to,
          originator,
          body: params.message,
        };

        // Type guard for options
        const options = params.options;
        if (options && typeof options === "object") {
          // Add optional parameters with type checking
          if (typeof options.type === "string") {
            requestData.type = options.type;
          }

          if (typeof options.datacoding === "string") {
            requestData.datacoding = options.datacoding;
          }

          if (typeof options.reference === "string") {
            requestData.reference = options.reference;
          }

          if (
            typeof options.validity === "number" ||
            typeof options.validity === "string"
          ) {
            requestData.validity = options.validity;
          }

          if (
            typeof options.gateway === "number" ||
            typeof options.gateway === "string"
          ) {
            requestData.gateway = options.gateway;
          }
        }

        // Make the API request
        // eslint-disable-next-line i18next/no-literal-string
        const authValue = `AccessKey ${accessKey}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": authValue,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        // Handle API errors
        if (!response.ok) {
          let errorData: MessageBirdErrorResponse = {};
          // eslint-disable-next-line i18next/no-literal-string
          const failedToParseMsg = "Failed to parse error response";
          try {
            errorData = (await response.json()) as MessageBirdErrorResponse;
          } catch {
            errorData = {
              errors: [{ description: failedToParseMsg }],
            };
          }

          // eslint-disable-next-line i18next/no-literal-string
          const unknownApiErrorMsg = "Unknown MessageBird API error";
          let errorMessage = unknownApiErrorMsg;
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // eslint-disable-next-line i18next/no-literal-string
            const unknownErrMsg = "Unknown error";
            errorMessage = errorData.errors
              .map((e) => e.description ?? e.message ?? unknownErrMsg)
              .join(", ");
          }

          return createErrorResponse(
            "app.api.v1.core.sms.sms.error.delivery_failed",
            ErrorResponseTypes.SMS_ERROR,
            {
              error: errorMessage,
              errorCode: response.status,
            },
          );
        }

        // Parse successful response
        const data = (await response.json()) as MessageBirdSuccessResponse;

        // Extract cost information if available
        // Cost is calculated directly when needed in the response

        // Build metadata object with conditional properties to satisfy exactOptionalPropertyTypes
        const metadata: SmsResultMetadata = {
          // Only include properties that have values
          ...(data.reference && { reference: data.reference }),
          ...(data.createdDatetime && {
            createdDatetime: data.createdDatetime,
          }),
          ...(data.recipients?.items?.[0]?.recipient && {
            recipient: data.recipients.items[0].recipient,
          }),
          ...(data.gateway && { gateway: data.gateway }),
        };

        // Build the response object with proper conditional properties
        const responseObject: Omit<SmsResult, "cost"> = {
          messageId: data.id,
          provider: SmsProviders.MESSAGEBIRD,
          timestamp: new Date().toISOString(),
          to: params.to,
          ...(data.status && { status: data.status }),
          segments: data.parts ?? 1,
          metadata,
        };

        // Only conditionally add cost if it exists
        if (data.price?.amount !== undefined && data.price?.currency) {
          return {
            success: true,
            data: {
              ...responseObject,
              cost: {
                amount: parseFloat(String(data.price.amount)),
                currency: data.price.currency,
              },
            },
          };
        }

        return {
          success: true,
          data: responseObject,
        };
      } catch (error) {
        // eslint-disable-next-line i18next/no-literal-string
        const unknownErrorMsg = "Unknown error";
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
