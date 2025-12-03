import { translations as installTranslations } from "../../install/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import { translations as uninstallTranslations } from "../../uninstall/i18n/de";
import { translations as updateTranslations } from "../../update/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  install: installTranslations,
  status: statusTranslations,
  uninstall: uninstallTranslations,
  update: updateTranslations,
};
