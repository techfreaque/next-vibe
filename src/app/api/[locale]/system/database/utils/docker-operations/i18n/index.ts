import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/database/utils/docker-operations/i18n/de").translations,
  pl: () =>
    require("next-vibe/database/utils/docker-operations/i18n/pl").translations,
});

export type DockerOperationsTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type DockerOperationsT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
