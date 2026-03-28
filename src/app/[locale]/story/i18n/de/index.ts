import { translations as blogTranslations } from "../../blog/i18n/de";
import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as frameworkTranslations } from "../../framework/i18n/de";
import { translations as imprintTranslations } from "../../imprint/i18n/de";
import { translations as investTranslations } from "../../invest/i18n/de";
import { translations as newsletterTranslations } from "../../newsletter/i18n/de";
import { translations as privacyPolicyTranslations } from "../../privacy-policy/i18n/de";
import { translations as termsOfServiceTranslations } from "../../terms-of-service/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "unbottled.ai - Unzensierter KI-Chat",
    category: "KI-Chat-Plattform",
    description:
      "Erleben Sie wirklich unzensierte KI-Gespräche mit 50+ Modellen. Keine Filter, keine Einschränkungen, nur ehrliche KI.",
    imageAlt: "unbottled.ai - Unzensierte KI-Chat-Plattform",
    keywords:
      "unzensierte KI, KI-Chat, GPT-4, Claude, Gemini, KI-Modelle, keine Filter, ehrliche KI, KI-Gespräche",
  },
  common: {
    error: {
      title: "Fehler",
      message: "Etwas ist schiefgelaufen",
    },
  },
  _components: componentsTranslations,
  blog: blogTranslations,
  framework: frameworkTranslations,
  imprint: imprintTranslations,
  invest: investTranslations,
  newsletter: newsletterTranslations,
  privacyPolicy: privacyPolicyTranslations,
  termsOfService: termsOfServiceTranslations,
};
