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
      signupSteps: "Kroki rejestracji w okresie",
      previousSignupSteps: "Kroki rejestracji w poprzednim okresie",
      signupSegments: "Kroki rejestracji według segmentu",
      signupTrackedSince: "Kroki rejestracji śledzone od",
      wallSteps: "Bariery konwersji w okresie",
      previousWallSteps: "Bariery konwersji w poprzednim okresie",
      wallSegments: "Bariery konwersji wg segmentu",
      wallTrackedSince: "Bariery konwersji mierzone od",
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
    wallTitle: "Bariery konwersji",
    wallSubtitle:
      "Osoby zatrzymane na barierze, z datą zdarzenia. Każda liczy się raz na barierę.",
    wallTrackedHint:
      "Mierzone od {{date}}: wcześniejsze bariery nie były zapisywane.",
    creditWallGuests: "Goście bez kredytów",
    creditWallAccounts: "Konta bez kredytów",
    consentDeclined: "Odmowa zgody 18+",
    creditWallHint: "Wysyłka odrzucona, pokazano kartę braku kredytów",
    consentDeclinedHint: "Zamknięto okno zgody bez akceptacji",
    wallSegmentsTitle: "Bariery wg segmentu",
    wallSegmentsSubtitle: "Te same bariery w podziale na wybrany wymiar.",
    wallEmpty: "W tym okresie nikt nie trafił na barierę.",
    signupTitle: "Potwierdzenie rejestracji",
    signupSubtitle:
      "Leady na krok, datowane momentem kroku. Spadek pokazuje, gdzie rejestracje odpadają.",
    signupTrackedHint:
      "Śledzone od {{date}}: z wcześniejszych rejestracji zapisane są tylko niepowodzenia.",
    started: "Rozpoczęte",
    emailSent: "E-mail wysłany",
    sendFailed: "Wysyłka nieudana",
    bounced: "Odbity",
    expired: "Wygasłe",
    expiredHint: "Wysyłka nieudana: {{failed}} · Przypomniane: {{reminded}}",
    reminded: "Przypomniane",
    confirmed: "Potwierdzone",
    confirmRate: "Wskaźnik potwierdzeń",
    ofStarted: "{{count}} z {{total}} rozpoczętych",
    signupSegmentsTitle: "Kroki rejestracji według segmentu",
    signupSegmentsSubtitle: "Te same kroki według wybranego wymiaru.",
    signupEmpty: "Brak rejestracji w tym okresie.",
    signupLost: "Utracone przy e-mailu",
    signupLostHint: "Odbite, nieudane lub wygasłe przed potwierdzeniem",
    loading: "Wczytywanie lejka...",
    cohortHint: "z {{count}} utworzonych leadów",
    signupRate: "Wskaźnik rejestracji",
    payRate: "Wskaźnik płatności",
    overallRate: "Od leada do płacącego",
    overallShort: "Do płacącego",
    ofHumans: "{{count}} z {{total}} leadów bez botów",
    ofSignups: "{{count}} z {{total}} rejestracji",
    funnelTitle: "Lejek kohorty",
    funnelSubtitle:
      "Lejek od leadów bez botów (przeglądarka lub brak user agenta). Boty i wszystkie leady: pierwsza karta.",
    trendTitle: "Kohorta według dnia utworzenia",
    trendSubtitle: "Leady bez botów i ile z nich skonwertowało.",
    segmentsTitle: "Lejek według segmentu",
    segmentsSubtitle:
      "Wskaźniki na lead bez botów. Kliknij wiersz, aby zobaczyć leady.",
    filtersTitle: "Segment",
    filtersSubtitle: "Zawęża każdą liczbę na tej stronie.",
    apply: "Zastosuj",
    empty: "Brak leadów w tym okresie.",
  },
};
