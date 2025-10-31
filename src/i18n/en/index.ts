import { translations as apiTranslations } from "../../app/i18n/en";
import { translations as packagesTranslations } from "../../packages/i18n/en";
import { translations as coreTranslations } from "../core/i18n/en";

const translations = {
  "app": apiTranslations,
  "i18n": {
    core: coreTranslations,
  },
  "packages": packagesTranslations,
};

export default translations;
