import { translations as apiTranslations } from "../../app/i18n/pl";
import { translations as appNativeTranslations } from "../../app-native/[locale]/i18n/pl";
import { translations as packagesTranslations } from "../../packages/i18n/pl";
import { translations as coreTranslations } from "../core/i18n/pl";

const plTranslations = {
  "app": apiTranslations,
  "app-native": appNativeTranslations,
  "i18n": {
    core: coreTranslations,
  },
  "packages": packagesTranslations,
};

export default plTranslations;
