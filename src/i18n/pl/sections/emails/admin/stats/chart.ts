import type { chartTranslations as EnglishChartTranslations } from "../../../../../en/sections/emails/admin/stats/chart";

export const chartTranslations: typeof EnglishChartTranslations = {
  title: "Statystyki E-mail w Czasie",
  subtitle: "Śledź metryki wydajności e-maili w czasie",
  series: {
    totalEmails: "Łączne E-maile",
    emailsSent: "Wysłane E-maile",
    emailsOpened: "Otwarte E-maile",
    emailsClicked: "Kliknięte E-maile",
    emailsBounced: "Odrzucone E-maile",
  },
  yAxisLabel: "Liczba E-maili",
  xAxisLabel: "Data",
};
