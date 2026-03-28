/**
 * 4chan-style Post Number Management
 * Generates and stores sequential post numbers for messages
 */

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as chatScopedTranslation } from "../../i18n";

/**
 * Format post number for display (e.g., "No.1234567")
 */
export function formatPostNumber(
  postNumber: string,
  locale: CountryLanguage,
): string {
  const { t } = chatScopedTranslation.scopedT(locale);
  return t("messages.postNumber", { number: postNumber });
}
