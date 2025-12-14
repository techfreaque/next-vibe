import { translations as apiTranslations } from "../../app/i18n/de";
import { translations as configTranslations } from "../../config/i18n/de";
import { translations as packagesTranslations } from "../../packages/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  app: apiTranslations,
  packages: packagesTranslations,
  config: configTranslations,
};
