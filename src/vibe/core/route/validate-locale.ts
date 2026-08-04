/**
 * Locale validation for an incoming request.
 *
 * Split out of `request-validator.ts` because it is an optional concern: it only
 * exists where a request carries a locale to check. An i18n-stripped build has a
 * single language and nothing to validate, so it drops this module rather than
 * carrying a fork of the request validator that steps around it.
 */

import "server-only";

import { z } from "zod";

import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import { validateData } from "../core-utils/validation";
import type { CountryLanguage } from "../i18n/core/config";
import { CountryLanguageValues } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "./response.schema";

/**
 * Validate locale using the standard schema
 */
export function validateLocale(
  locale: CountryLanguage,
  logger: EndpointLogger,
  platform: Platform,
): ResponseType<CountryLanguage> {
  const localeValidation = validateData(
    locale,
    z.enum(CountryLanguageValues).optional(),
    logger,
    platform,
    "locale-validation",
    locale,
  );
  const validatedLocale = localeValidation.success
    ? localeValidation.data
    : undefined;
  if (!validatedLocale) {
    logger.error("Invalid locale provided:", locale);
    const { t } = sharedScopedTranslation.scopedT(locale);
    return fail({
      message: t("errors.invalidLocaleDetail", { locale: locale }),
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    });
  }
  return success(validatedLocale);
}
