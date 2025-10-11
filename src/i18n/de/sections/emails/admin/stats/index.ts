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
  title: "E-Mail-Statistiken",
  description:
    "Verfolgen und analysieren Sie die Leistung von E-Mail-Kampagnen",
  totalEmails: "Gesamt E-Mails",
  sentEmails: "Gesendete E-Mails",
  deliveredEmails: "Zugestellte E-Mails",
  openedEmails: "Geöffnete E-Mails",
  clickedEmails: "Geklickte E-Mails",
  bouncedEmails: "Abgewiesene E-Mails",
  failedEmails: "Fehlgeschlagene E-Mails",
  draftEmails: "Entwurf E-Mails",
  deliveryRate: "Zustellungsrate",
  openRate: "Öffnungsrate",
  clickRate: "Klickrate",
  bounceRate: "Abweisungsrate",
  failureRate: "Fehlerrate",
  sent: "gesendet",
  pendingToSend: "ausstehend zu senden",
  topPerformingTemplates: "Leistungsstärkste Vorlagen",
  statusDistribution: "Status-Verteilung",
  typeDistribution: "Typ-Verteilung",
  providerPerformance: "Anbieter-Leistung",
  recentActivity: "Neueste Aktivität",
  noTemplateData: "Keine Vorlagendaten verfügbar",
  noStatusData: "Keine Statusdaten verfügbar",
  noTypeData: "Keine Typdaten verfügbar",
  noProviderData: "Keine Anbieterdaten verfügbar",
  noRecentActivity: "Keine neueste Aktivität",
  noSubject: "Kein Betreff",
  delivery: "Zustellung",
  open: "Öffnen",
  click: "Klicken",
  emailsToday: "E-Mails heute",
  emailsThisWeek: "E-Mails diese Woche",
  emailsThisMonth: "E-Mails diesen Monat",
  emailsByType: "E-Mail-Typ-Verteilung",
  emailsByStatus: "E-Mail-Status-Verteilung",
  totalSent: "Gesendete E-Mails",
  totalOpened: "Geöffnete E-Mails",
  totalClicked: "Geklickte E-Mails",
  totalBounced: "Abgewiesene E-Mails",
  totalUnsubscribed: "Abgemeldet",
  unsubscribeRate: "Abmelderate",
};
