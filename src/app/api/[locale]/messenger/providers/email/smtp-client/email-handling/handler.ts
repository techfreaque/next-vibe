/**
 * Email Handling Repository Definition
 * Types for email handling and processing operations
 */

import "server-only";

import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";

import type {
  EmailRenderProps,
  EmailRenderSkip,
  EmailResolvedData,
  ScopedTResult,
} from "@/app/api/[locale]/messenger/registry/template";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

export type { EmailRenderProps, EmailRenderSkip, EmailResolvedData };

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
  | Promise<
      | SuccessResponseType<EmailResolvedData | EmailRenderSkip>
      | ErrorResponseType
    >
  | SuccessResponseType<EmailResolvedData | EmailRenderSkip>
  | ErrorResponseType;

/**
 * Email handler - carries the template typed by its render/scopedTranslation surface.
 * TUserRoles flows from the endpoint's allowedRoles so user is properly typed.
 * The template's translation key is widened to string since templates use their own scopedT.
 */
export interface EmailHandler<TEndpoint extends CreateApiEndpointAny> {
  readonly ignoreErrors?: boolean;
  readonly template: {
    scopedTranslation: {
      scopedT: (locale: CountryLanguage) => ScopedTResult;
    };
    render: (
      props: EmailRenderProps<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["ResponseOutput"],
        TEndpoint["types"]["UrlVariablesOutput"],
        string,
        TEndpoint["allowedRoles"]
      >,
    ) =>
      | Promise<
          | SuccessResponseType<EmailResolvedData | EmailRenderSkip>
          | ErrorResponseType
        >
      | SuccessResponseType<EmailResolvedData | EmailRenderSkip>
      | ErrorResponseType;
  };
}

/**
 * Email Handle Request Type
 */
export interface EmailHandleRequestOutput<
  TEndpoint extends CreateApiEndpointAny,
> {
  email:
    | {
        afterHandlerEmails?: EmailHandler<TEndpoint>[];
      }
    | undefined;
  user: InferJwtPayloadTypeFromRoles<TEndpoint["allowedRoles"]>;
  responseData: TEndpoint["types"]["ResponseOutput"];
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
  requestData: TEndpoint["types"]["RequestOutput"];
  t: (
    key: TEndpoint["types"]["ScopedTranslationKey"],
    params?: TParams,
  ) => TranslatedKeyType;
  locale: CountryLanguage;
}

/**
 * Email Handle Response Type
 */
export interface EmailHandleResponseOutput {
  success: boolean;
}
