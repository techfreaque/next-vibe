import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  stats: {
    timePeriod: {
      day: "Tag",
      week: "Woche",
      month: "Monat",
      quarter: "Quartal",
      year: "Jahr",
    },
    dateRange: {
      today: "Heute",
      yesterday: "Gestern",
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
      thisWeek: "Diese Woche",
      lastWeek: "Letzte Woche",
      thisMonth: "Dieser Monat",
      lastMonth: "Letzter Monat",
      thisQuarter: "Dieses Quartal",
      lastQuarter: "Letztes Quartal",
      thisYear: "Dieses Jahr",
      lastYear: "Letztes Jahr",
      custom: "Benutzerdefiniert",
    },
    chartType: {
      line: "Linie",
      bar: "Balken",
      area: "Fläche",
      pie: "Kuchen",
      donut: "Ring",
    },
  },
};
