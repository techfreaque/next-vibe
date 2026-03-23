/**
 * Email Handling Repository Definition
 * Types for email handling and processing operations
 */

import "server-only";

import type {
  EmailRenderProps,
  EmailResolvedData,
  ScopedTResult,
} from "@/app/api/[locale]/messenger/registry/template";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";
import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";

export type { EmailRenderProps, EmailResolvedData };

/**
 * Email Function Type - resolver that maps request context to email data.
 */
export type EmailFunctionType<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string,
  TUserRoles extends readonly UserRoleValue[],
> = (
  props: EmailRenderProps<
    TRequest,
    TResponse,
    TUrlVariables,
    TScopedTranslationKey,
    TUserRoles
  >,
) =>
  | Promise<SuccessResponseType<EmailResolvedData> | ErrorResponseType>
  | SuccessResponseType<EmailResolvedData>
  | ErrorResponseType;

/**
 * Email handler - carries the template typed by its render/scopedTranslation surface.
 * TUserRoles flows from the endpoint's allowedRoles so user is properly typed.
 * The template's translation key is widened to string since templates use their own scopedT.
 */
export interface EmailHandler<
  TRequest,
  TResponse,
  TUrlVariables,
  TUserRoles extends readonly UserRoleValue[],
> {
  readonly ignoreErrors?: boolean;
  readonly template: {
    scopedTranslation: {
      scopedT: (locale: CountryLanguage) => ScopedTResult;
    };
    render: (
      props: EmailRenderProps<
        TRequest,
        TResponse,
        TUrlVariables,
        string,
        TUserRoles
      >,
    ) =>
      | Promise<SuccessResponseType<EmailResolvedData> | ErrorResponseType>
      | SuccessResponseType<EmailResolvedData>
      | ErrorResponseType;
  };
}

/**
 * Email Handle Request Type
 */
export interface EmailHandleRequestOutput<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string,
  TUserRoles extends readonly UserRoleValue[],
> {
  email:
    | {
        afterHandlerEmails?: EmailHandler<
          TRequest,
          TResponse,
          TUrlVariables,
          TUserRoles
        >[];
      }
    | undefined;
  user: InferJwtPayloadTypeFromRoles<TUserRoles>;
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
