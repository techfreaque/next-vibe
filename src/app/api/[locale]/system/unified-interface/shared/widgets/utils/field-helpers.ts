import type { ZodTypeAny } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import type { FieldUsageConfig } from "../../../unified-ui/widgets/_shared/types";
import type { UnifiedField } from "../../types/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";

/**
 * Check if field is used for response (display output)
 */
export function isResponseField<TKey extends string>(
  field: UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any
): boolean {
  if (
    "usage" in field &&
    field.usage &&
    typeof field.usage === "object" &&
    "response" in field.usage &&
    field.usage.response === true
  ) {
    return true;
  }
  return false;
}

/**
 * Check if field has request usage (either exclusively or along with response)
 */
export function isRequestField<TKey extends string>(
  field: UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any
): boolean {
  if (
    "usage" in field &&
    field.usage &&
    typeof field.usage === "object" &&
    "request" in field.usage &&
    field.usage.request !== undefined
  ) {
    return true;
  }
  return false;
}

export function getTranslatorFromEndpoint<
  TEndpoint extends CreateApiEndpointAny,
>(
  endpoint: TEndpoint,
): (locale: CountryLanguage) => {
  t: <K extends string>(key: K, params?: TParams) => string;
} {
  return endpoint.scopedTranslation.scopedT as (locale: CountryLanguage) => {
    t: <K extends string>(key: K, params?: TParams) => string;
  };
}
