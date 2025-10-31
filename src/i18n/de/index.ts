import { translations as apiTranslations } from "../../app/i18n/de";
import { translations as packagesTranslations } from "../../packages/i18n/de";
import { translations as coreTranslations } from "../core/i18n/de";

const deTranslations = {
  "app": apiTranslations,
  "i18n": {
    core: coreTranslations,
  },
  "packages": packagesTranslations,
};

export default deTranslations;
