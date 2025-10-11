/**
 * Contact Repository
 * Handles data access and business logic for contact form submissions
 */

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/translation-utils";

/**
 * Contact Repository Interface
 * Defines contract for contact operations
 */
interface ContactRepository {
  /**
   * Get support email address
   */
  getSupportEmail(locale: CountryLanguage): string;
}

/**
 * Contact Repository Implementation
 * Handles contact form submissions
 */
class ContactRepositoryImpl implements ContactRepository {
  /**
   * Get support email address
   */
  getSupportEmail(locale: CountryLanguage): string {
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

/**
 * Singleton Repository Instance
 */
export const contactClientRepository = new ContactRepositoryImpl();
