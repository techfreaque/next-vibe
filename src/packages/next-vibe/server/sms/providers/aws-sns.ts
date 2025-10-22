import { createHash, createHmac } from "node:crypto";

import type { ResponseType } from "../../../shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import { env } from "../../env";
import type {
  SendSmsParams,
  SmsProvider,
  SmsResult,
  SmsResultMetadata,
} from "../utils";
import { SmsProviders } from "../utils";

export enum AwsSnsAwsRegions {
  US_EAST_1 = "us-east-1",
  US_WEST_1 = "us-west-1",
  US_WEST_2 = "us-west-2",
  EU_WEST_1 = "eu-west-1",
  EU_CENTRAL_1 = "eu-central-1",
  AP_SOUTHEAST_1 = "ap-southeast-1",
  AP_SOUTHEAST_2 = "ap-southeast-2",
  AP_NORTHEAST_1 = "ap-northeast-1",
  AP_NORTHEAST_2 = "ap-northeast-2",
  AP_SOUTH_1 = "ap-south-1",
  AP_EAST_1 = "ap-east-1",
  CA_CENTRAL_1 = "ca-central-1",
  SA_EAST_1 = "sa-east-1",
  AF_SOUTH_1 = "af-south-1",
  EU_SOUTH_1 = "eu-south-1",
  ME_SOUTH_1 = "me-south-1",
  EU_NORTH_1 = "eu-north-1",
}

const AWS_SNS_CONSTANTS = {
  DATA_TYPE_STRING: "String",
  DATA_TYPE_NUMBER: "Number",
  ACTION_PUBLISH: "Publish",
  API_VERSION: "2010-03-31",
  MESSAGE_ATTRIBUTES_FIELD: "MessageAttributes",
  SENDER_ID_ATTRIBUTE: "AWS.SNS.SMS.SenderID",
  SMS_TYPE_ATTRIBUTE: "AWS.SNS.SMS.SMSType",
  MESSAGE_ID_PREFIX: "sns-",
} as const;

// Define specific interfaces
interface AwsSnsMessageAttribute {
  DataType: string;
  StringValue: string;
}

interface AwsSnsMessageAttributes {
  [key: string]: AwsSnsMessageAttribute;
}

/**
 * Creates an AWS SNS provider instance
 * Implements AWS Signature Version 4 for secure API authentication
 */
export function getAwsSnsProvider(): SmsProvider {
  const accessKeyId = env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
  const region = env.AWS_REGION;

  return {
    name: SmsProviders.AWS_SNS,

    async sendSms(params: SendSmsParams): Promise<ResponseType<SmsResult>> {
      try {
        // Validate credentials
        if (!accessKeyId) {
          return createErrorResponse(
            "packages.nextVibe.server.sms.sms.error.missing_aws_access_key",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        if (!region) {
          return createErrorResponse(
            "packages.nextVibe.server.sms.sms.error.missing_aws_region",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        if (!secretAccessKey) {
          return createErrorResponse(
            "packages.nextVibe.server.sms.sms.error.missing_aws_secret_key",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Validate required parameters
        if (!params.to) {
          return createErrorResponse(
            "packages.nextVibe.server.sms.sms.error.missing_recipient",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        if (!params.message || params.message.trim() === "") {
          return createErrorResponse(
            "packages.nextVibe.server.sms.sms.error.empty_message",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Prepare AWS SNS request
        // eslint-disable-next-line i18next/no-literal-string
        const host = `sns.${region}.amazonaws.com`;
        const endpoint = `https://${host}/`;
        const dateStamp = new Date()
          .toISOString()
          .replace(/[:-]|\.\d{3}/g, "")
          .substring(0, 8);
        const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");

        // Create the canonical request
        const method = "POST";
        const canonicalUri = "/";
        const service = "sns";

        // Type-safe message attributes
        const messageAttributes: AwsSnsMessageAttributes = {};

        // Add sender ID if provided
        if (params.from) {
          messageAttributes[AWS_SNS_CONSTANTS.SENDER_ID_ATTRIBUTE] = {
            DataType: AWS_SNS_CONSTANTS.DATA_TYPE_STRING,
            StringValue: params.from,
          };
        }

        // Type-safe options handling

        const options = params.options;

        // Additional SMS attributes
        if (options && typeof options === "object" && options.smsType) {
          messageAttributes[AWS_SNS_CONSTANTS.SMS_TYPE_ATTRIBUTE] = {
            DataType: AWS_SNS_CONSTANTS.DATA_TYPE_STRING,
            StringValue: options.smsType,
          };
        }

        // Add custom attributes with proper typing
        if (options && typeof options === "object" && options.attributes) {
          Object.entries(options.attributes).forEach(([key, value]) => {
            let stringValue: string;
            let dataType: string;

            if (typeof value === "string") {
              dataType = AWS_SNS_CONSTANTS.DATA_TYPE_STRING;
              stringValue = value;
            } else if (typeof value === "number") {
              dataType = AWS_SNS_CONSTANTS.DATA_TYPE_NUMBER;
              stringValue = value.toString();
            } else if (typeof value === "boolean") {
              dataType = AWS_SNS_CONSTANTS.DATA_TYPE_STRING;
              stringValue = value.toString();
            } else {
              return; // Skip invalid types
            }

            messageAttributes[key] = {
              DataType: dataType,
              StringValue: stringValue,
            };
          });
        }

        // Build query parameters
        const requestParams = new URLSearchParams({
          Action: AWS_SNS_CONSTANTS.ACTION_PUBLISH,
          Version: AWS_SNS_CONSTANTS.API_VERSION,
          PhoneNumber: params.to,
          Message: params.message,
        });

        // Add message attributes if any
        if (Object.keys(messageAttributes).length > 0) {
          requestParams.append(
            AWS_SNS_CONSTANTS.MESSAGE_ATTRIBUTES_FIELD,
            JSON.stringify(messageAttributes),
          );
        }

        // Generate AWS signature for request authentication
        const payload = requestParams.toString();
        // eslint-disable-next-line i18next/no-literal-string
        const contentHash = createHash("sha256").update(payload).digest("hex");

        // eslint-disable-next-line i18next/no-literal-string
        const canonicalHeaders = `${[
          `content-type:application/x-www-form-urlencoded`,
          // eslint-disable-next-line i18next/no-literal-string
          `host:${host}`,
          `x-amz-content-sha256:${contentHash}`,
          `x-amz-date:${amzDate}`,
        ].join("\n")}\n`;

        const signedHeaders =
          "content-type;host;x-amz-content-sha256;x-amz-date";

        const canonicalRequest = [
          method,
          canonicalUri,
          "", // canonicalQueryString (empty for POST)
          canonicalHeaders,
          signedHeaders,
          contentHash,
        ].join("\n");

        const algorithm = "AWS4-HMAC-SHA256";
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        const stringToSign = [
          algorithm,
          amzDate,
          credentialScope,
          // eslint-disable-next-line i18next/no-literal-string
          createHash("sha256").update(canonicalRequest).digest("hex"),
        ].join("\n");

        // Calculate the signature
        const getSignatureKey = (
          key: string,
          dateStamp: string,
          regionName: string,
          serviceName: string,
        ): Buffer => {
          // eslint-disable-next-line i18next/no-literal-string
          const kDate = createHmac("sha256", `AWS4${key}`)
            .update(dateStamp)
            .digest();
          // eslint-disable-next-line i18next/no-literal-string
          const kRegion = createHmac("sha256", kDate)
            .update(regionName)
            .digest();
          // eslint-disable-next-line i18next/no-literal-string
          const kService = createHmac("sha256", kRegion)
            .update(serviceName)
            .digest();
          // eslint-disable-next-line i18next/no-literal-string
          const kSigning = createHmac("sha256", kService)
            // eslint-disable-next-line i18next/no-literal-string
            .update("aws4_request")
            .digest();
          return kSigning;
        };

        const signatureKey = getSignatureKey(
          secretAccessKey,
          dateStamp,
          region,
          service,
        );
        // eslint-disable-next-line i18next/no-literal-string
        const signature = createHmac("sha256", signatureKey)
          .update(stringToSign)
          .digest("hex");

        // eslint-disable-next-line i18next/no-literal-string
        const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        // Make the request to AWS SNS
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": host,
            "X-Amz-Date": amzDate,
            "X-Amz-Content-Sha256": contentHash,
            "Authorization": authorizationHeader,
          },
          body: payload,
        });

        if (!response.ok) {
          const errorText = await response.text();

          // Extract error message from XML response
          const errorMatch = errorText.match(/<Message>(.*?)<\/Message>/);
          const errorMessage = errorMatch?.[1];

          return createErrorResponse(
            "packages.nextVibe.server.sms.sms.error.aws_sns_api_error",
            ErrorResponseTypes.SMS_ERROR,
            {
              error: errorMessage ?? "error.sms.errors.unknown_aws_error",
              statusCode: response.status,
            },
          );
        }

        // Parse XML response with proper error handling
        const responseText = await response.text();
        const messageIdMatch = responseText.match(
          /<MessageId>(.*?)<\/MessageId>/,
        );
        const timestamp = Date.now().toString();
        const fallbackId = AWS_SNS_CONSTANTS.MESSAGE_ID_PREFIX + timestamp;
        const messageId = messageIdMatch?.[1] ?? fallbackId;

        const requestIdMatch = responseText.match(
          /<RequestId>(.*?)<\/RequestId>/,
        );

        // Create metadata object using conditional properties to handle exactOptionalPropertyTypes
        const metadata: SmsResultMetadata = {
          region,
          ...(requestIdMatch?.[1] && { requestId: requestIdMatch[1] }),
        };

        // Build the response object
        const responseData: SmsResult = {
          messageId,
          provider: SmsProviders.AWS_SNS,
          timestamp: new Date().toISOString(),
          to: params.to,
          metadata,
        };

        return {
          success: true,
          data: responseData,
        };
      } catch (error) {
        const parsedError = parseError(error);
        return createErrorResponse(
          "packages.nextVibe.server.sms.sms.error.aws_sns_error",
          ErrorResponseTypes.SMS_ERROR,
          { error: parsedError.message },
        );
      }
    },
  };
}
