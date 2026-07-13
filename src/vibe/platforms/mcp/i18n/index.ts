import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/platforms/mcp/i18n/de").translations,
  pl: () => require("next-vibe/platforms/mcp/i18n/pl").translations,
});

export type McpTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type McpT = ReturnType<typeof scopedTranslation.scopedT>["t"];
