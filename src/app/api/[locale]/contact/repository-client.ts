/**
 * Contact Repository
 * Handles data access and business logic for contact form submissions
 */

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/translation-utils";

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
        return envClient.NEXT_PUBLIC_SUPPORT_EMAIL_DE;
      case "pl":
        return envClient.NEXT_PUBLIC_SUPPORT_EMAIL_PL;
      case "en":
        return envClient.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL;
      default:
        return envClient.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL;
    }
  }
}
