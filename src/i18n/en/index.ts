import { translations as apiTranslations } from "../../app/i18n/en";
import { translations as appNativeTranslations } from "../../app-native/[locale]/i18n/en";
import { translations as packagesTranslations } from "../../packages/i18n/en";

const translations = {
  "app": apiTranslations,
  "app-native": appNativeTranslations,
  "packages": packagesTranslations,
};

export default translations;
