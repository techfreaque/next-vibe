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

import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/leads/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import type { MessageType } from "../../../../messages/enum";
import type { CampaignType } from "../../../../accounts/enum";
import type { SmtpSelectionCriteria } from "../repository";

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
  emailJourneyVariant?: typeof EmailJourneyVariantValues;
  emailCampaignStage?: typeof EmailCampaignStageValues;
  // Email metadata
  templateName?: string;
  emailType?: (typeof MessageType)[keyof typeof MessageType];
  leadId?: string;
  unsubscribeUrl?: string;
  // SMTP selection criteria override
  smtpSelectionCriteria?: SmtpSelectionCriteria;
}

/**
 * Email Render Props
 */
export interface EmailRenderProps<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string = TranslationKey,
> {
  requestData: TRequest;
  urlPathParams: TUrlVariables;
  responseData: TResponse;
  user: JwtPayloadType;
  t: (key: TScopedTranslationKey, params?: TParams) => TranslatedKeyType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

/**
 * Email Function Type
 */
export type EmailFunctionType<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string = TranslationKey,
> = ({
  requestData,
}: EmailRenderProps<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey
>) =>
  | Promise<SuccessResponseType<EmailTemplateReturnType> | ErrorResponseType>
  | SuccessResponseType<EmailTemplateReturnType>
  | ErrorResponseType;

/**
 * Email Handle Request Type
 */
export interface EmailHandleRequestOutput<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string = TranslationKey,
> {
  email:
    | {
        afterHandlerEmails?: {
          ignoreErrors?: boolean;
          render: EmailFunctionType<
            TRequest,
            TResponse,
            TUrlVariables,
            TScopedTranslationKey
          >;
        }[];
      }
    | undefined;
  user: JwtPayloadType;
  responseData: TResponse;
  urlPathParams: TUrlVariables;
  requestData: TRequest;
  t: (key: TScopedTranslationKey, params?: TParams) => TranslatedKeyType;
  locale: CountryLanguage;
}

/**
 * Email Handle Response Type
 */
export interface EmailHandleResponseOutput {
  success: boolean;
}
