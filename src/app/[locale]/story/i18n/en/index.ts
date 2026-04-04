import { translations as blogTranslations } from "../../blog/i18n/en";
import { translations as componentsTranslations } from "../../_components/i18n/en";
import { translations as frameworkTranslations } from "../../framework/i18n/en";
import { translations as imprintTranslations } from "../../imprint/i18n/en";
import { translations as investTranslations } from "../../invest/i18n/en";
import { translations as newsletterTranslations } from "../../newsletter/i18n/en";
import { translations as privacyPolicyTranslations } from "../../privacy-policy/i18n/en";
import { translations as termsOfServiceTranslations } from "../../terms-of-service/i18n/en";

export const translations = {
  meta: {
    title: "{{appName}} - Uncensored AI Chat",
    category: "AI Chat Platform",
    description:
      "Experience truly uncensored AI conversations with {{modelCount}} models. No filters, no restrictions, just honest AI.",
    imageAlt: "{{appName}} - Uncensored AI Chat Platform",
    keywords:
      "uncensored AI, AI chat, GPT-4, Claude, Gemini, AI models, no filters, honest AI, AI conversations",
  },
  common: {
    error: {
      title: "Error",
      message: "Something went wrong",
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
