import { scopedTranslation as messengerScopedTranslation } from "../../i18n";

export const scopedTranslation = messengerScopedTranslation;

export type ProvidersT = ReturnType<
  typeof messengerScopedTranslation.scopedT
>["t"];
