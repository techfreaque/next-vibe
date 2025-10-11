import type { helpTranslations as EnglishHelpTranslations } from "../../../../en/sections/pages/help";
import { faqTranslations } from "./faq";
import { formTranslations } from "./form";
import { infoTranslations } from "./info";

export const helpTranslations: typeof EnglishHelpTranslations = {
  faq: faqTranslations,
  form: formTranslations,
  info: infoTranslations,
  title: "Skontaktuj Się z Nami",
  subtitle: "Skontaktuj Się z Naszym Zespołem",
  description:
    "Jesteśmy tutaj, aby odpowiedzieć na Twoje pytania i omówić, jak możemy pomóc Twojemu biznesowi",
};
