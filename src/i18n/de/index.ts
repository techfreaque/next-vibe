import { translations as appTranslations } from "../../app/i18n/de";
import { translations as configTranslations } from "../../config/i18n/de";
import { translations as packagesTranslations } from "../../packages/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  app: appTranslations,
  packages: packagesTranslations,
  config: configTranslations,
};
