import { translations as destroyTranslations } from "../../destroy/i18n/pl";
import { translations as startTranslations } from "../../start/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import { translations as stopTranslations } from "../../stop/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard Systemu",
  destroy: destroyTranslations,
  start: startTranslations,
  status: statusTranslations,
  stop: stopTranslations,
};
