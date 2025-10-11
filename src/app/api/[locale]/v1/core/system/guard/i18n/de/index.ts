import { translations as destroyTranslations } from "../../destroy/i18n/de";
import { translations as startTranslations } from "../../start/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import { translations as stopTranslations } from "../../stop/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System Guard",
  destroy: destroyTranslations,
  start: startTranslations,
  status: statusTranslations,
  stop: stopTranslations,
};
