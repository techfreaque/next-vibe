import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/generators/remote-capabilities/i18n/de")
      .translations,
  pl: () =>
    require("next-vibe/tooling/generators/remote-capabilities/i18n/pl")
      .translations,
});

export type RemoteCapabilitiesTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type RemoteCapabilitiesT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
