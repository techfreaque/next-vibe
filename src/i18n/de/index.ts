import { translations as apiTranslations } from "../../app/i18n/de";
import { translations as appNativeTranslations } from "../../app-native/[locale]/i18n/de";
import { translations as packagesTranslations } from "../../packages/i18n/de";
import { translations as coreTranslations } from "../core/i18n/de";
import type enTranslations from "../en";

const deTranslations: typeof enTranslations = {
  app: apiTranslations,
  "app-native": appNativeTranslations,
  i18n: {
    core: coreTranslations,
  },
  packages: packagesTranslations,
};

export default deTranslations;
