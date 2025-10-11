import type { dashboardTranslations as EnglishDashboardTranslations } from "../../../en/sections/dashboard";
import { completedTranslations } from "./completed";
import { consultationOptionTranslations } from "./consultationOption";
import { consultationsTranslations } from "./consultations";
import { contentTranslations } from "./content";
import { errorTranslations } from "./error";
import { errorsTranslations } from "./errors";
import { loadingTranslations } from "./loading";
import { nextPaymentTranslations } from "./nextPayment";
import { optionsTranslations } from "./options";
import { paymentOptionTranslations } from "./paymentOption";
import { platformsTranslations } from "./platforms";
import { quickActionsTranslations } from "./quickActions";
import { setupTranslations } from "./setup";
import { statsTranslations } from "./stats";
import { subscriptionTranslations } from "./subscription";
import { upcomingConsultationsTranslations } from "./upcomingConsultations";

export const translations: typeof EnglishDashboardTranslations = {
  completed: completedTranslations,
  consultationOption: consultationOptionTranslations,
  consultations: consultationsTranslations,
  content: contentTranslations,
  error: errorTranslations,
  errors: errorsTranslations,
  loading: loadingTranslations,
  nextPayment: nextPaymentTranslations,
  options: optionsTranslations,
  paymentOption: paymentOptionTranslations,
  platforms: platformsTranslations,
  quickActions: quickActionsTranslations,
  setup: setupTranslations,
  stats: statsTranslations,
  subscription: subscriptionTranslations,
  upcomingConsultations: upcomingConsultationsTranslations,
  welcome: "Willkommen zu Ihrem Dashboard",
  subtitle:
    "Verwalten Sie Ihre Social Media Präsenz von einem zentralen Ort aus",
  refresh: "Aktualisieren",
  retry: "Erneut versuchen",
  getStarted:
    "Wählen Sie eine der folgenden Optionen, um mit unseren Services zu beginnen",
};
