/**
 * Email Handling Repository Definition
 * Types for email handling and processing operations
 */

import "server-only";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { TParams } from "next-vibe/core/i18n/core/static-types";
import type { InferJwtPayloadTypeFromRoles } from "next-vibe/core/route/handler-roles";
import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/core/route/response.schema";

import type {
  EmailRenderProps,
  EmailRenderSkip,
  EmailResolvedData,
  ScopedTResult,
} from "@/messenger/registry/template";

export type { EmailRenderProps, EmailRenderSkip, EmailResolvedData };

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
