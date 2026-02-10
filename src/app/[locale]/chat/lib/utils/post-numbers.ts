/**
 * 4chan-style Post Number Management
 * Generates and stores sequential post numbers for messages
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Format post number for display (e.g., "No.1234567")
 */
export function formatPostNumber(
  postNumber: string,
  locale: CountryLanguage,
): string {
  const { t } = simpleT(locale);
  return t("app.chat.messages.postNumber", { number: postNumber });
}
