import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Skuteczność kampanii",
  description:
    "Czy maile kampanii wychodzą, co utknęło w kolejce i jak radzi sobie każda ścieżka",
  enums: {
    emailJourneyVariantFilter: {
      all: "Wszystkie",
      uncensoredConvert: "Niecenzurowana konwersja",
      sideHustle: "Dodatkowy zarobek",
      quietRecommendation: "Cicha rekomendacja",
      signupNurture: "Pielęgnacja po rejestracji",
      retention: "Utrzymanie klienta",
      winback: "Odzyskanie klienta",
      newsletterMay2026: "Newsletter maj 2026",
      newsletterNov2026: "Newsletter listopad 2026",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Niecenzurowana konwersja",
      sideHustle: "Dodatkowy zarobek",
      quietRecommendation: "Cicha rekomendacja",
      signupNurture: "Pielęgnacja po rejestracji",
      retention: "Utrzymanie klienta",
      winback: "Odzyskanie klienta",
      newsletterMay2026: "Newsletter maj 2026",
      newsletterNov2026: "Newsletter listopad 2026",
    },
    emailCampaignStageFilter: {
      all: "Wszystkie",
    },
    emailCampaignStage: {
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
  },
  get: {
    title: "Skuteczność kampanii",
    titleShort: "Kampanie",
    description:
      "Stan silnika, stan kolejki i wyniki maili w czasie: wysłane, otwarte, kliknięte, wypisania, odbicia i błędy według wariantu ścieżki, etapu i języka. Każda liczba otwiera pasujące leady.",
    fields: {
      journeyVariant: {
        label: "Wariant ścieżki",
        description: "Tylko ta ścieżka mailowa",
        placeholder: "Dowolna ścieżka",
      },
      stage: {
        label: "Etap",
        description: "Tylko maile tego etapu kampanii",
        placeholder: "Dowolny etap",
      },
      locale: {
        label: "Język",
        description: "Wyrenderowana lokalizacja (de-DE) lub język (de)",
        placeholder: "Dowolny język",
      },
    },
    response: {
      variantTrend: "Wysłane według ścieżki",
      window: "Okres",
      engine: "Stan silnika",
      queue: "Stan kolejki",
      kpis: "Wskaźniki",
      totals: "Sumy",
      trend: "Wysłane, otwarte, kliknięte",
      problems: "Błędy, odbicia, wypisania",
      funnel: "Lejek maili",
      byVariant: "Według wariantu ścieżki",
      byStage: "Według etapu",
      byLocale: "Według języka",
      topErrors: "Najczęstsze błędy wysyłki",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Błąd podczas pobierania statystyk",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry wejściowe",
      },
    },
    success: {
      title: "Statystyki pobrane",
      description: "Statystyki kampanii pobrane pomyślnie",
    },
  },
  widget: {
    noSends: "W tym okresie nie wysłano żadnej wiadomości.",
    bounceProcessingOff:
      "Obsługa zwrotów jest wyłączona. Liczba może być zaniżona.",
    groups: {
      now: "W tej chwili",
      period: "W wybranym okresie",
    },
    stuck: "Brak wysyłek w okresie",
    title: "Skuteczność kampanii",
    loading: "Ładujemy liczby kampanii...",
    filters: "Filtry",
    openQueue: "Otwórz kolejkę",
    empty: "Nic nie wysłano w tym okresie.",
    emptySendingOff:
      "Nic nie wysłano w tym okresie. Wysyłka jest wyłączona, patrz wyżej.",
    noProblems: "Brak błędów, odbić i wypisań w tym okresie.",
    noErrors: "Brak błędów wysyłki w tym okresie.",
    sentNoteOff:
      "Zero wysyłek oznacza tu wyłączony silnik, a nie brak zaangażowania.",
    errors: {
      duplicate: "Pominięto: zduplikowany odbiorca",
      statusChange: "Pominięto: lead ma teraz status {{status}}",
    },
    engine: {
      dryRun: "Tryb próbny",
      dryRunNote: "W trybie próbnym nie wysyłamy wiadomości.",
      delayed: "Wysyłka opóźniona",
      delayedNote: "Sprawdź stan zadań cron i harmonogram wysyłki.",
      waiting: "Oczekiwanie na pierwsze uruchomienie",
      waitingNote:
        "Ustawiono harmonogram. Pierwsze uruchomienie jeszcze przed nami.",
      details: "Szczegóły automatyzacji",
      missingSummary: "Brak harmonogramu wysyłki.",
      disabledSummary: "Moduł wysyłki jest wyłączony.",
      starterOff:
        "campaign-starter też jest wyłączony, więc nowe leady nie wchodzą do ścieżek.",
      otherPath:
        "Te wyszły inną drogą (blast lub ręczne uruchomienie), nie przez dispatcher.",
      openDispatcher: "Otwórz ustawienia dispatchera",
      neverSent: "Nigdy nie wysłano maila kampanii.",
      lastSend: "Ostatnia wysyłka {{when}}. Wysłane w 24 h: {{count}}.",
      offTitle: "Wysyłka wyłączona",
      failingTitle: "Dispatcher zawodzi ({{count}} uruchomień z rzędu)",
      onTitle: "Wysyłka działa",
      missing:
        "Dispatcher email-campaigns nie ma harmonogramu cron. {{count}} zaległych maili czeka w kolejce i nie wyjdzie, dopóki nie zostanie zaplanowany.",
      disabled:
        "Dispatcher email-campaigns jest wyłączony. {{count}} zaległych maili czeka w kolejce.",
      on: "Ostatnie uruchomienie {{last}}, następne {{next}}.",
      noError: "Brak zapisanego komunikatu błędu.",
      openDue: "Pokaż {{count}} leadów",
      state: {
        dryRun: "Tryb próbny",
        delayed: "Wysyłka opóźniona",
        waiting: "Oczekiwanie na pierwsze uruchomienie",
        missing: "niezaplanowany",
        disabled: "wyłączony",
        failing: "z błędami",
        running: "działa",
      },
    },
    queue: {
      oldestBiggest:
        "{{emails}} leadów. Największa zaległość: {{journey}} ({{count}} maili)",
      stuckClaims: "Zawieszone blokady wysyłki",
      stuckClaimsHint: "Zablokowane ponad 1 h temu, bez potwierdzenia",
      stuckDaysHint: "Zaległe od {{when}}",
      stuckDays: "Najstarszy zaległy, dni",
      nothingScheduled: "Nic nie zaplanowano",
      dueNow: "Zaległe maile",
      oldest: "{{emails}} leadów czeka",
      nothingDue: "Nic nie czeka",
      scheduled: "Zaplanowane na później",
      scheduledHint: "{{count}} w ciągu 24 h, następny {{when}}",
    },
    kpi: {
      bouncedOff:
        "bounce-processor jest wyłączony, odbicia mogą być zaniżone. {{rate}} wysłanych",
      ofSentRate: "{{rate}} wysłanych",
      skippedHint:
        "Pominięte duplikaty i zmiany statusu nie liczone: {{count}}",
      sent: "Wysłane",
      openRate: "Otwarcia",
      clickRate: "Kliknięcia",
      ofSent: "{{count}} z wysłanych maili",
      unsubscribed: "Wypisani",
      bounced: "Odbite",
      failed: "Błędy wysyłki w okresie",
    },
    series: {
      sent: "Wysłane",
      opened: "Otwarte",
      clicked: "Kliknięte",
      failed: "Błędy wysyłki",
      bounced: "Odbite",
      unsubscribed: "Wypisani",
    },
    charts: {
      errorsHint:
        "Tylko prawdziwe błędy. Pominięte duplikaty i zmiany statusu ukryte: {{count}}",
      variantTrendHint: "Maile wysłane w przedziale, według wariantu ścieżki",
      variantTrend: "Wysłane według ścieżki",
      trend: "Wysłane, otwarte, kliknięte",
      trendHint:
        "Według dnia wysyłki: wysłane maile i ile z nich później otwarto lub kliknięto. Kliknij dzień, by zobaczyć te leady.",
      problems: "Problemy",
      problemsHint: "Nieudane wysyłki, odbicia i wypisania w przedziale",
      funnel: "Lejek maili",
      funnelHint: "Maile wysłane w okresie i co zrobili z nimi odbiorcy",
      byVariant: "Według wariantu ścieżki",
      byVariantHint: "Wysłane w okresie. Zaległe = czeka teraz w kolejce.",
      byStage: "Według etapu",
      byLocale: "Według języka",
      errors: "Błędy wysyłki",
    },
    columns: {
      failed: "Błędy wysyłki",
      sent: "Wysł.",
      openRate: "Otw.",
      clickRate: "Klik.",
      unsubscribed: "Wyp.",
      bounced: "Odbite",
      due: "Zaległe maile",
      variant: "Ścieżka",
      stage: "Etap",
      locale: "Język",
      error: "Błąd",
      count: "Liczba",
    },
    definitions:
      "Otwarcia i kliknięcia liczą maile wysłane w okresie, które kiedykolwiek otwarto lub kliknięto. Zaległe = oczekujące z terminem w przeszłości: wysyła je tylko dispatcher email-campaigns. Język = wyrenderowana lokalizacja, inaczej język i kraj leada.",
  },
};
