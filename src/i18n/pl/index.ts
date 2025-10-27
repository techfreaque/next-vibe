import { translations as apiTranslations } from "../../app/i18n/pl";
import { translations as appNativeTranslations } from "../../app-native/[locale]/i18n/pl";
import { translations as packagesTranslations } from "../../packages/i18n/pl";
import type enTranslations from "../en";

const plTranslations: typeof enTranslations = {
  "app": apiTranslations,
  "app-native": appNativeTranslations,
  "packages": packagesTranslations,
};

export default plTranslations;
