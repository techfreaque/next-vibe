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

export const dashboardTranslations: typeof EnglishDashboardTranslations = {
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
  welcome: "Witaj w swoim panelu",
  subtitle:
    "Zarządzaj swoją obecnością w mediach społecznościowych z jednego centralnego miejsca",
  refresh: "Odśwież",
  retry: "Spróbuj ponownie",
  getStarted:
    "Wybierz jedną z opcji poniżej, aby rozpocząć korzystanie z naszych usług",
};
