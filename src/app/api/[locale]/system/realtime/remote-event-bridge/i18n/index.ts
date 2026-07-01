import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/realtime/remote-event-bridge/i18n/de").translations,
  pl: () =>
    require("next-vibe/realtime/remote-event-bridge/i18n/pl").translations,
});

export type RemoteEventBridgeTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type RemoteEventBridgeT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
