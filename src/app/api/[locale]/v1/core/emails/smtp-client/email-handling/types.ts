/**
 * Email Handling Repository Definition
 * Types for email handling and processing operations
 */

import "server-only";

import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EmailType } from "../../messages/enum";
import type { CampaignType } from "../enum";
import type { SmtpSelectionCriteria } from "../sending/types";

/**
 * Email Template Return Type
 */
export interface EmailTemplateReturnType {
  jsx: JSX.Element;
  subject: string;
  senderName?: string; // Sender name from template
  fromEmail?: string;
  toEmail: string;
  toName: string;
  replyToEmail?: string;
  replyToName?: string;
  // Campaign context for proper SMTP selection and metadata
  campaignType?: (typeof CampaignType)[keyof typeof CampaignType];
  // Using string instead of specific enum types to avoid circular dependency with leads module
  emailJourneyVariant?: string;
  emailCampaignStage?: string;
  // Email metadata
  templateName?: string;
  emailType?: (typeof EmailType)[keyof typeof EmailType];
  leadId?: string;
  unsubscribeUrl?: string;
  // SMTP selection criteria override
  smtpSelectionCriteria?: SmtpSelectionCriteria;
}

/**
 * Email Render Props
 */
export interface EmailRenderProps<TRequest, TResponse, TUrlVariables> {
  requestData: TRequest;
  urlPathParams: TUrlVariables;
  responseData: TResponse;
  user: JwtPayloadType;
  t: TFunction;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

/**
 * Email Function Type
 */
export type EmailFunctionType<TRequest, TResponse, TUrlVariables> = ({
  requestData,
}: EmailRenderProps<TRequest, TResponse, TUrlVariables>) =>
  | Promise<SuccessResponseType<EmailTemplateReturnType> | ErrorResponseType>
  | SuccessResponseType<EmailTemplateReturnType>
  | ErrorResponseType;

/**
 * Email Handle Request Type
 */
export interface EmailHandleRequestOutput<TRequest, TResponse, TUrlVariables> {
  email:
    | {
        afterHandlerEmails?: {
          ignoreErrors?: boolean;
          render: EmailFunctionType<TRequest, TResponse, TUrlVariables>;
        }[];
      }
    | undefined;
  user: JwtPayloadType;
  responseData: TResponse;
  urlPathParams: TUrlVariables;
  requestData: TRequest;
  t: TFunction;
  locale: CountryLanguage;
}

/**
 * Email Handle Response Type
 */
export interface EmailHandleResponseOutput {
  success: boolean;
}

const definitions = {};

export default definitions;
