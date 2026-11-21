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
    title: "Lejek",
    titleShort: "Lejek",
    description:
      "Leady utworzone w okresie i jak daleko doszły: człowiek, pierwszy czat, rejestracja, potwierdzony e-mail, płatność. Według kanału, źródła lub kodu ref. Każdy etap otwiera swoje leady.",
    response: {
      window: "Okres",
      dimensionUsed: "Wymiar segmentu",
      steps: "Etapy lejka",
      previousSteps: "Etapy z poprzedniego okresu",
      rates: "Wskaźniki konwersji",
      segments: "Lejek według segmentu",
      trend: "Trend kohorty",
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
        description: "Nie udało się obliczyć raportu lejka.",
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
      description: "Raport lejka wczytany.",
    },
  },
  widget: {
    loading: "Wczytywanie lejka...",
    cohortHint: "z {{count}} utworzonych leadów",
    signupRate: "Wskaźnik rejestracji",
    payRate: "Wskaźnik płatności",
    overallRate: "Od człowieka do płacącego",
    overallShort: "Do płacącego",
    ofHumans: "{{count}} z {{total}} leadów od ludzi",
    ofSignups: "{{count}} z {{total}} rejestracji",
    funnelTitle: "Lejek kohorty",
    funnelSubtitle:
      "Lejek od leadów od ludzi. Boty i wszystkie leady: pierwsza karta.",
    trendTitle: "Kohorta według dnia utworzenia",
    trendSubtitle: "Leady ludzi i ile z nich skonwertowało.",
    segmentsTitle: "Lejek według segmentu",
    segmentsSubtitle:
      "Wskaźniki na lead człowieka. Kliknij wiersz, aby zobaczyć leady.",
    filtersTitle: "Segment",
    filtersSubtitle: "Zawęża każdą liczbę na tej stronie.",
    apply: "Zastosuj",
    empty: "Brak leadów w tym okresie.",
  },
};
