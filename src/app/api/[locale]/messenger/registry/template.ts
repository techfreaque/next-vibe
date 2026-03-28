/**
 * Email Template Registry Types
 */

import type { JSX, ReactElement } from "react";
import type { z } from "zod";

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";
import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";

import type { TrackingContext } from "../providers/email/smtp-client/components/tracking_context.email";

/**
 * Preview field types
 */
export type PreviewFieldType =
  | "text"
  | "email"
  | "url"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "date";

/**
 * Select option with translation key
 */
export interface PreviewSelectOption {
  value: string;
  label: string; // Translation key
}

/**
 * Preview field configuration
 */
export interface PreviewFieldConfig<TKey extends string> {
  type: PreviewFieldType;
  label: TKey; // Translation key
  description?: TKey; // Translation key
  defaultValue?: string | number | boolean;
  required?: boolean;
  options?: PreviewSelectOption[]; // For select fields
  min?: number; // For number fields
  max?: number; // For number fields
  rows?: number; // For textarea fields
}

/**
 * Pre-translated preview field config (for passing through server→client boundary).
 * All translation keys have been resolved to plain strings.
 */
export interface TranslatedPreviewFieldConfig {
  type: PreviewFieldType;
  label: string;
  description?: string;
  defaultValue?: string | number | boolean;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  rows?: number;
}

/**
 * Template metadata cache (serializable, in generated registry)
 */
export interface TemplateCachedMetadata<TKey extends string> {
  id: string;
  version: string; // Semver (e.g., "1.2.3")
  name: TKey; // Translation key
  description: TKey; // Translation key
  category: TKey;
  path: string; // File path for reference
  exampleProps: Record<string, string | number | boolean>; // Example props for preview (serializable, required)
}

/**
 * Full template metadata (includes functions, from loaded template)
 */
export interface TemplateMetadata<TKey extends string> {
  id: string;
  version: string;
  name: TKey;
  description: TKey;
  category: TKey;
  path: string;
  defaultSubject: TKey;
  changelog?: TKey;
  previewFields?: Record<string, PreviewFieldConfig<TKey>>;
}

/**
 * Resolved email data returned by a render function.
 * The render function builds the JSX and all routing metadata.
 */
export interface EmailResolvedData {
  toEmail: string;
  toName: string;
  subject: string;
  jsx: JSX.Element;
  replyToEmail?: string;
  replyToName?: string;
  senderName?: string;
  leadId: string;
  unsubscribeUrl?: string;
}

/**
 * Props passed to the render function on a template.
 * TRequest/TResponse/TUrlVariables come from the endpoint; TScopedTranslationKey from the template.
 */
export interface EmailRenderProps<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string,
  TUserRoles extends readonly UserRoleValue[],
> {
  requestData: TRequest;
  urlPathParams: TUrlVariables;
  responseData: TResponse;
  user: InferJwtPayloadTypeFromRoles<TUserRoles>;
  // Method shorthand - bivariant under strictFunctionTypes.
  // Allows a template with render(props: EmailRenderProps<..., NarrowKey>) to be
  // assigned to EmailHandler.template which expects EmailRenderProps<..., string>.
  t(key: TScopedTranslationKey, params?: TParams): TranslatedKeyType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  tracking: TrackingContext;
}

/**
 * Minimum interface for the object returned by scopedT.
 * Declaring `t` with method shorthand enables bivariant checking under strictFunctionTypes,
 * so concrete templates with `t: (key: OwnKey) => TranslatedKeyType` satisfy this constraint.
 */
export interface ScopedTResult {
  t(key: string, params?: TParams): TranslatedKeyType;
}

/**
 * Full template definition (lazy-loaded)
 * TProps: the props type for the email component
 * TScopedTranslation: the createScopedTranslation result for this template's module
 */
export interface EmailTemplateDefinition<
  TProps,
  // TScopedTranslation: the createScopedTranslation result for this template.
  // The constraint uses ScopedTResult (method shorthand for `t`) so TypeScript checks `t`
  // bivariantly - allowing concrete templates with narrower key unions to satisfy it.
  TScopedTranslation extends {
    scopedT: (locale: CountryLanguage) => ScopedTResult;
  },
  // TRequest, TResponse, TUrlVariables - the endpoint types this template's render handles.
  TRequest,
  TResponse,
  TUrlVariables,
  TUserRoles extends readonly UserRoleValue[],
> {
  scopedTranslation: TScopedTranslation;
  meta: TemplateMetadata<
    Parameters<ReturnType<TScopedTranslation["scopedT"]>["t"]>[0]
  >;
  schema: z.ZodType<TProps>;
  component: (params: {
    props: TProps;
    t: ReturnType<TScopedTranslation["scopedT"]>["t"];
    locale: CountryLanguage;
    recipientEmail: string;
    tracking: TrackingContext;
  }) => ReactElement;
  exampleProps: TProps;
  /**
   * Render function - business logic that maps endpoint context to EmailResolvedData.
   * Lives here so email.tsx files only export EmailTemplateDefinition objects.
   * Routes reference it as: email: [{ template: xEmailTemplate, ignoreErrors: true }]
   */
  render: (
    props: EmailRenderProps<
      TRequest,
      TResponse,
      TUrlVariables,
      Parameters<ReturnType<TScopedTranslation["scopedT"]>["t"]>[0],
      TUserRoles
    >,
  ) =>
    | Promise<SuccessResponseType<EmailResolvedData> | ErrorResponseType>
    | SuccessResponseType<EmailResolvedData>
    | ErrorResponseType;
}

/**
 * Escape-hatch type for generator/registry code that handles templates of unknown shape.
 * Only use in: generated.ts, generators/email-templates/repository.ts,
 * renderTemplateComponent, getTemplateSubject, translatePreviewFields.
 * All other code must use fully-typed EmailTemplateDefinition<TProps, TScopedTranslation, TRequest, TResponse, TUrlVariables>.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type EmailTemplateDefinitionAny = EmailTemplateDefinition<
  any,
  any,
  any,
  any,
  any,
  any
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Template default export structure
 */
export interface TemplateExport<
  TProps,
  TScopedTranslation extends {
    scopedT: (locale: CountryLanguage) => ScopedTResult;
  },
> {
  default: EmailTemplateDefinition<
    TProps,
    TScopedTranslation,
    never,
    never,
    never,
    readonly UserRoleValue[]
  >;
}

/**
 * Sealed dispatch helpers for EmailTemplateDefinition union types.
 *
 * When `template` is `AnyEmailTemplate` (a union), TypeScript widens both
 * `template.schema.parse(rawProps)` and `t` to intersections of all union
 * members - making them unusable directly at call sites. These helpers seal the
 * schema.parse + component call (and the subject lookup) inside a dispatch
 * boundary. The `as never` casts are intentional and unavoidable - they exist
 * solely here so that every caller gets full structural type safety with zero
 * assertions of their own.
 */

/**
 * Parse rawProps with the template's own schema, invoke template.component
 * with the matched t function, and return the ReactElement.
 */
export function renderTemplateComponent(
  template: EmailTemplateDefinitionAny,
  params: {
    rawProps: Record<string, string | number | boolean>;
    locale: CountryLanguage;
    recipientEmail: string;
    tracking: TrackingContext;
  },
): ReactElement {
  const { t } = template.scopedTranslation.scopedT(params.locale);
  const props = template.schema.parse(params.rawProps);
  return template.component({ props, t: t, ...params });
}

/**
 * Get the translated subject line for a template using its own t function.
 */
export function getTemplateSubject(
  template: EmailTemplateDefinitionAny,
  locale: CountryLanguage,
): string {
  const { t } = template.scopedTranslation.scopedT(locale);
  return t(template.meta.defaultSubject);
}
