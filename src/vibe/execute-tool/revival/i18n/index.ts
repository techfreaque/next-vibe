import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => import("./de").then((m) => m.translations),
  pl: () => import("./pl").then((m) => m.translations),
});

export type RevivalTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type RevivalT = ReturnType<typeof scopedTranslation.scopedT>["t"];
