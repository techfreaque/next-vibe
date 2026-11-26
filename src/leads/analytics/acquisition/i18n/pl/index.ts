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
    title: "Pozyskanie",
    titleShort: "Pozyskanie",
    description:
      "Skąd przychodzą odwiedzający i leady: kanał, źródło, referrer, kampania, strona wejścia, kraj, urządzenie, ludzie czy boty. Każda liczba otwiera pasujące leady.",
    response: {
      window: "Okres",
      kpis: "Kluczowe liczby",
      trend: "Trend",
      breakdown: "Podział",
      agents: "Agenty",
      coverage: "Zasięg śledzenia",
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
        description: "Nie udało się obliczyć raportu pozyskania.",
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
      description: "Raport pozyskania wczytany.",
    },
  },
  widget: {
    revenue: "Przychód",
    humanVisits: "Wizyty ludzi",
    botVisits: "Wizyty botów",
    botVisitsHint: "{{count}} wizyt botów",
    unknownLeadsHint: "Plus {{count}} bez user agenta (nieznany)",
    botsTitle: "Leady od botów",
    botsSubtitle:
      "Crawlery, podglądy linków i skrypty. Kliknij słupek, aby zobaczyć leady.",
    loading: "Wczytywanie raportu pozyskania...",
    pageSubtitle:
      "Skąd przychodzą leady i jak konwertują. Kliknij liczbę, aby zobaczyć te leady.",
    coverage:
      "Wizyty są śledzone od {{date}}. Starsze leady się liczą, ale bez wizyt.",
    botShareHint: "{{percent}} nowych leadów",
    leadsTitle: "Leady od ludzi",
    leadsSubtitle: "Nowe leady od ludzi. Kliknij słupek, aby zobaczyć leady.",
    visitsTitle: "Śledzone wizyty",
    visitsSubtitle:
      "Zarejestrowane wejścia. Ludzie vs leady rozpoznane jako boty.",
    conversionsTitle: "Rejestracje i płacący",
    conversionsSubtitle: "Według dnia, w którym nastąpił dany etap.",
    breakdownTitle: "Skąd przychodzą leady",
    breakdownSubtitle: "Pierwszy kontakt. Kliknij wiersz, aby zobaczyć leady.",
    agentsTitle: "Kto się pojawia",
    agentsSubtitle: "Rodzina agenta według user agenta.",
    filtersTitle: "Segment",
    filtersSubtitle: "Zawęża każdą liczbę na tej stronie.",
    apply: "Zastosuj",
    empty: "Brak leadów w tym okresie.",
    emptyHint: "Wybierz dłuższy okres lub wyczyść filtry.",
  },
};
