/**
 * Field Helper Functions
 *
 * Consolidated utilities for working with UnifiedField types:
 * - Usage detection (request, response, both)
 * - Translation context extraction
 * - Field filtering and validation
 */

import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";

/**
 * Extract translation function from endpoint definition
 */
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
