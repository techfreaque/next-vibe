import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "leady",
    analytics: "analityka",
  },
  get: {
    title: "Sygnały nadużyć",
    titleShort: "Nadużycia",
    description:
      "Fale leadów i rejestracji z jednej sieci lub od jednego user agenta oraz darmowe kredyty zużyte przez odwiedzających bez konta. Każdy wiersz otwiera pasujące leady.",
    fields: {
      minLeads: {
        label: "Próg fali",
        description:
          "Liczba leadów z jednego klastra w okresie, od której liczy się jako fala",
      },
    },
    response: {
      window: "Okres",
      groupByUsed: "Grupowanie",
      minLeadsUsed: "Próg fali",
      kpis: "Kluczowe liczby",
      trend: "Leady z oznaczonych klastrów",
      clusters: "Klastry",
      burners: "Najwięksi zjadacze darmowych kredytów",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się jako admin.",
      },
      validation: {
        title: "Nieprawidłowe filtry",
        description: "Sprawdź okres i wartości filtrów.",
      },
      server: {
        title: "Raport nie powiódł się",
        description: "Nie udało się obliczyć raportu nadużyć.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Coś poszło nie tak.",
      },
      network: {
        title: "Błąd sieci",
        description: "Serwer jest nieosiągalny.",
      },
      forbidden: { title: "Brak dostępu", description: "Tylko dla adminów." },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak danych raportu.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Zastosuj lub odrzuć zmiany filtrów.",
      },
      conflict: {
        title: "Konflikt",
        description: "Dane się zmieniły. Odśwież.",
      },
    },
    success: {
      title: "Raport gotowy",
      description: "Raport nadużyć wczytany.",
    },
  },
  widget: {
    fast: "Szybki",
    noIp: "Brak IP",
    perHour: "Leady/godz.",
    thresholdOption: "{{count}}+ leadów",
    loading: "Wczytywanie sygnałów nadużyć...",
    flaggedPrefixes: "Oznaczone sieci",
    flaggedAgents: "Oznaczone agenty",
    thresholdHint: "{{count}}+ leadów w okresie",
    flaggedLeads: "Leady z fal",
    flaggedShare: "{{percent}}% nowych leadów",
    freeCredits: "Zużyte darmowe kredyty",
    freeCreditsHint: "Przez odwiedzających bez konta",
    burners: "Zużywający odwiedzający",
    burnersHint: "Osoby bez konta wydające darmowe kredyty",
    trendTitle: "Leady ze skoków",
    trendSubtitle: "Fala = klaster z {{count}}+ leadami w okresie.",
    seriesFlagged: "Z fal",
    seriesOther: "Pozostałe leady",
    clustersIpTitle: "Fale według sieci",
    clustersUaTitle: "Fale według user agenta",
    clustersSubtitle:
      "Sortowane wg leadów na godzinę. Szybki = {{rate}}+ leadów/godz. Kliknij wiersz, aby zobaczyć leady.",
    prefix: "Sieć",
    userAgent: "User agent",
    prefixes: "Różne sieci",
    agents: "Różni agenci",
    noClusters: "Żaden klaster nie osiągnął {{count}} leadów w tym okresie.",
    burnersTitle: "Najwięksi zjadacze darmowych kredytów",
    burnersSubtitle: "Odwiedzający bez konta. Kliknij, aby otworzyć lead.",
    lead: "Lead",
    requests: "Zapytania",
    noBurners:
      "Brak darmowych kredytów zużytych przez osoby bez konta w tym okresie.",
    filtersTitle: "Segment",
    filtersSubtitle: "Zawęża każdą liczbę na tej stronie.",
    apply: "Zastosuj",
  },
};
