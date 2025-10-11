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
    "Bądź na bieżąco z naszymi najnowszymi wiadomościami i spostrzeżeniami",
  emailPlaceholder: "Twój adres e-mail",
  subscribe: "Subskrybuj",
};
