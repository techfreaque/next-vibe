import { translations as blogTranslations } from "../../blog/i18n/pl";
import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as frameworkTranslations } from "../../framework/i18n/pl";
import { translations as imprintTranslations } from "../../imprint/i18n/pl";
import { translations as investTranslations } from "../../invest/i18n/pl";
import { translations as newsletterTranslations } from "../../newsletter/i18n/pl";
import { translations as privacyPolicyTranslations } from "../../privacy-policy/i18n/pl";
import { translations as termsOfServiceTranslations } from "../../terms-of-service/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "unbottled.ai - Niecenzurowany czat AI",
    category: "Platforma czatu AI",
    description:
      "Doświadcz prawdziwie niecenzurowanych rozmów AI z 50+ modelami. Żadnych filtrów, żadnych ograniczeń, tylko szczera AI.",
    imageAlt: "unbottled.ai - Niecenzurowana platforma czatu AI",
    keywords:
      "niecenzurowana AI, czat AI, GPT-4, Claude, Gemini, modele AI, bez filtrów, szczera AI, rozmowy AI",
  },
  common: {
    error: {
      title: "Błąd",
      message: "Coś poszło nie tak",
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
