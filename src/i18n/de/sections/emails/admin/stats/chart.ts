import type { chartTranslations as EnglishChartTranslations } from "../../../../../en/sections/emails/admin/stats/chart";

export const chartTranslations: typeof EnglishChartTranslations = {
  title: "E-Mail-Statistiken über Zeit",
  subtitle: "Verfolgen Sie E-Mail-Leistungsmetriken über die Zeit",
  series: {
    totalEmails: "Gesamt E-Mails",
    emailsSent: "Gesendete E-Mails",
    emailsOpened: "Geöffnete E-Mails",
    emailsClicked: "Geklickte E-Mails",
    emailsBounced: "Abgewiesene E-Mails",
  },
  yAxisLabel: "Anzahl E-Mails",
  xAxisLabel: "Datum",
};
