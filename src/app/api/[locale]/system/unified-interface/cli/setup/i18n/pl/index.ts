import { translations as installTranslations } from "../../install/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import { translations as uninstallTranslations } from "../../uninstall/i18n/pl";
import { translations as updateTranslations } from "../../update/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  install: installTranslations,
  status: statusTranslations,
  uninstall: uninstallTranslations,
  update: updateTranslations,
};
