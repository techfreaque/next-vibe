/**
 * Shared analytics vocabulary.
 *
 * Endpoints that use `analyticsWindowFields` spread these translations at the
 * root of their own i18n (`...analyticsTranslations`) so the field labels and
 * enum values resolve in their scope as well.
 */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  analytics: {
    review: "Skontrolovať",
    reviewItem: "Skontrolovať {{item}}",
    range: {
      label: "Obdobie",
      description: "Časové obdobie prehľadu",
      last7Days: "Posledných 7 dní",
      last30Days: "Posledných 30 dní",
      last90Days: "Posledných 90 dní",
      last6Months: "Posledných 6 mesiacov",
      last12Months: "Posledných 12 mesiacov",
      allTime: "Celé obdobie",
      custom: "Vlastné obdobie",
    },
    rangeShort: {
      last7Days: "7 dní",
      last30Days: "30 dní",
      last90Days: "90 dní",
      last6Months: "6 mes.",
      last12Months: "12 mes.",
      allTime: "Všetko",
      custom: "Vlastné",
    },
    from: {
      label: "Od",
      description: "Prvý deň vlastného obdobia vrátane tohto dňa",
    },
    to: {
      label: "Do",
      description: "Posledný deň vlastného obdobia vrátane tohto dňa",
    },
    granularity: {
      label: "Zoskupiť podľa",
      description: "Časový interval jedného bodu v grafe",
      auto: "Automaticky",
      day: "Deň",
      week: "Týždeň",
      month: "Mesiac",
    },
    chart: {
      points: "{{value}} p. b.",
      vsValue: "oproti {{value}}",
      comparedTo: "porovnanie s obdobím {{period}}",
      vsPrevious: "oproti predchádzajúcemu obdobiu",
      noPrevious: "údaje za predchádzajúce obdobie chýbajú",
      empty: "Za toto obdobie nie sú k dispozícii údaje.",
      total: "Spolu",
      other: "Ostatné",
      share: "Podiel",
      unknown: "Neznáme",
      none: "(žiadne)",
      ofPrevious: "z predchádzajúceho kroku",
      ofFirst: "z prvého kroku",
      dropOff: "úbytok",
      open: "Otvoriť",
      openList: "Otvoriť zoznam",
      period: "Obdobie",
      showing: "Zobrazené: {{count}} z {{total}}",
      showAll: "Zobraziť všetko",
      showLess: "Zobraziť menej",
      series: "Dátový rad",
      value: "Hodnota",
      apply: "Použiť",
      clearFilters: "Vymazať filtre",
      filters: "Filtre",
      refresh: "Obnoviť",
      byGranularity: "zoskupenie podľa položky {{granularity}}",
      groupedBy: {
        day: "po dňoch",
        week: "po týždňoch",
        month: "po mesiacoch",
      },
    },
  },
};
