import type { statsTranslations as EnglishStatsTranslations } from "../../../../../en/sections/emails/admin/stats";
import { associationTranslations } from "./association";
import { chartTranslations } from "./chart";
import { engagementTranslations } from "./engagement";
import { errorsTranslations } from "./errors";
import { filtersTranslations } from "./filters";
import { groupedTranslations } from "./grouped";
import { metricsTranslations } from "./metrics";
import { performanceTranslations } from "./performance";
import { providerTranslations } from "./provider";
import { retryTranslations } from "./retry";
import { statusTranslations } from "./status";
import { statusesTranslations } from "./statuses";
import { tabsTranslations } from "./tabs";
import { templateTranslations } from "./template";
import { typeTranslations } from "./type";
import { typesTranslations } from "./types";

export const statsTranslations: typeof EnglishStatsTranslations = {
  association: associationTranslations,
  chart: chartTranslations,
  engagement: engagementTranslations,
  errors: errorsTranslations,
  filters: filtersTranslations,
  grouped: groupedTranslations,
  metrics: metricsTranslations,
  performance: performanceTranslations,
  provider: providerTranslations,
  retry: retryTranslations,
  status: statusTranslations,
  statuses: statusesTranslations,
  tabs: tabsTranslations,
  template: templateTranslations,
  type: typeTranslations,
  types: typesTranslations,
  title: "Statystyki E-mail",
  description: "Śledź i analizuj wydajność kampanii e-mailowych",
  totalEmails: "Łączne E-maile",
  sentEmails: "Wysłane E-maile",
  deliveredEmails: "Dostarczone E-maile",
  openedEmails: "Otwarte E-maile",
  clickedEmails: "Kliknięte E-maile",
  bouncedEmails: "Odrzucone E-maile",
  failedEmails: "Nieudane E-maile",
  draftEmails: "Szkice E-maili",
  deliveryRate: "Wskaźnik Dostarczenia",
  openRate: "Wskaźnik Otwarć",
  clickRate: "Wskaźnik Kliknięć",
  bounceRate: "Wskaźnik Odrzuceń",
  failureRate: "Wskaźnik Niepowodzeń",
  sent: "wysłane",
  pendingToSend: "oczekujące do wysłania",
  topPerformingTemplates: "Najlepiej Działające Szablony",
  statusDistribution: "Rozkład Statusów",
  typeDistribution: "Rozkład Typów",
  providerPerformance: "Wydajność Dostawców",
  recentActivity: "Ostatnia Aktywność",
  noTemplateData: "Brak danych szablonów",
  noStatusData: "Brak danych statusów",
  noTypeData: "Brak danych typów",
  noProviderData: "Brak danych dostawców",
  noRecentActivity: "Brak ostatniej aktywności",
  noSubject: "Brak tematu",
  delivery: "Dostarczenie",
  open: "Otwarcie",
  click: "Kliknięcie",
  emailsToday: "E-maile Dziś",
  emailsThisWeek: "E-maile Ten Tydzień",
  emailsThisMonth: "E-maile Ten Miesiąc",
  emailsByType: "Rozkład Typów E-maili",
  emailsByStatus: "Rozkład Statusów E-maili",
  totalSent: "Wysłane E-maile",
  totalOpened: "Otwarte E-maile",
  totalClicked: "Kliknięte E-maile",
  totalBounced: "Odrzucone E-maile",
  totalUnsubscribed: "Wypisane",
  unsubscribeRate: "Wskaźnik Wypisań",
};
