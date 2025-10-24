import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  stats: {
    timePeriod: {
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      year: "Rok",
    },
    dateRange: {
      today: "Dziś",
      yesterday: "Wczoraj",
      last7Days: "Ostatnie 7 dni",
      last30Days: "Ostatnie 30 dni",
      last90Days: "Ostatnie 90 dni",
      thisWeek: "Ten tydzień",
      lastWeek: "Zeszły tydzień",
      thisMonth: "Ten miesiąc",
      lastMonth: "Zeszły miesiąc",
      thisQuarter: "Ten kwartał",
      lastQuarter: "Zeszły kwartał",
      thisYear: "Ten rok",
      lastYear: "Zeszły rok",
      custom: "Niestandardowy",
    },
    chartType: {
      line: "Linia",
      bar: "Słupek",
      area: "Obszar",
      pie: "Kołowy",
      donut: "Pierścieniowy",
    },
  },
};
