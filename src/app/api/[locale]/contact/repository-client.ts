/**
 * Contact Repository
 * Handles data access and business logic for contact form submissions
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/translation-utils";

import { contactClientEnv } from "./env-client";

/**
 * Contact Repository Implementation
 * Handles contact form submissions
 */
export class contactClientRepository {
  /**
   * Get support email address
   */

  static getSupportEmail(locale: CountryLanguage): string {
    const language = getLanguageFromLocale(locale);
    switch (language) {
      case "de":
        return contactClientEnv.NEXT_PUBLIC_SUPPORT_EMAIL_DE;
      case "pl":
        return contactClientEnv.NEXT_PUBLIC_SUPPORT_EMAIL_PL;
      case "en":
        return contactClientEnv.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL;
      default:
        return contactClientEnv.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL;
    }
  }
}
