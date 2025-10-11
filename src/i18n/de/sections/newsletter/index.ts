import type { newsletterTranslations as EnglishNewsletterTranslations } from "../../../en/sections/newsletter";
import { adminTranslations } from "./admin";
import { emailTranslations } from "./email";
import { errorsTranslations } from "./errors";
import { pageTranslations } from "./page";
import { preferencesTranslations } from "./preferences";
import { subscriptionTranslations } from "./subscription";
import { unsubscribeTranslations } from "./unsubscribe";

export const newsletterTranslations: typeof EnglishNewsletterTranslations = {
  admin: adminTranslations,
  email: emailTranslations,
  errors: errorsTranslations,
  page: pageTranslations,
  preferences: preferencesTranslations,
  subscription: subscriptionTranslations,
  unsubscribe: unsubscribeTranslations,
  title: "Newsletter",
  description:
    "Bleiben Sie über unsere neuesten Nachrichten und Einblicke auf dem Laufenden",
  emailPlaceholder: "Ihre E-Mail-Adresse",
  subscribe: "Abonnieren",
};
