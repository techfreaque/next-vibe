import type { helpTranslations as EnglishHelpTranslations } from "../../../../en/sections/pages/help";
import { faqTranslations } from "./faq";
import { formTranslations } from "./form";
import { infoTranslations } from "./info";

export const helpTranslations: typeof EnglishHelpTranslations = {
  faq: faqTranslations,
  form: formTranslations,
  info: infoTranslations,
  title: "Kontaktieren Sie uns",
  subtitle: "Nehmen Sie Kontakt mit unserem Team auf",
  description:
    "Wir sind hier, um Ihre Fragen zu beantworten und zu besprechen, wie wir Ihrem Unternehmen helfen können",
};
