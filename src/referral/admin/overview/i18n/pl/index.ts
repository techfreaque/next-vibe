import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Polecenia",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "Przychód",
      commission: "Prowizja",
      payers: "Płacący użytkownicy",
      signups: "Rejestracje",
      leads: "Leady",
      clicks: "Kliknięcia",
      conversion: "Kliknięcie do rejestracji",
      ownerQueue: "Kolejka wypłat właściciela",
      ownerFree: "Wolne do wypłaty (najniższe najpierw)",
      newest: "Najnowsze kody",
    },
  },
  get: {
    title: "Przegląd poleceń",
    titleShort: "Przegląd",
    description:
      "Wszystkie kody polecające i partnerzy w jednym widoku: kliknięcia, leady, rejestracje, płacący użytkownicy, przychód, prowizja i kolejka wypłat, w porównaniu z poprzednim okresem.",
    fields: {
      search: {
        label: "Szukaj",
        description: "Kod, etykieta lub e-mail właściciela",
        placeholder: "Kod, etykieta lub e-mail właściciela",
      },
      ownerUserId: {
        label: "Właściciel",
        description: "Tylko kody tego partnera (ID użytkownika)",
      },
      activeOnly: {
        label: "Tylko aktywne kody",
        description: "Ukryj dezaktywowane kody",
      },
      sortBy: {
        label: "Sortuj kody według",
        description: "Kolejność w tabeli kodów",
      },
      limit: {
        label: "Liczba kodów",
        description: "Maksymalna liczba wierszy w tabeli kodów",
      },
    },
    response: {
      window: "Okres",
      kpis: "Kluczowe liczby",
      trend: "Trend",
      codes: "Kody",
      codesTotal: "Kody w zakresie",
      overCommittedOwners: "Właściciele z przekroczonym saldem",
      payouts: "Kolejka wypłat",
    },
    widget: {
      kpi: {
        clicks: "Kliknięcia",
        clicksHint: "Wejścia z przeglądarki z kodem",
        leads: "Leady",
        leadsHint: "Odwiedzający przypisani do kodu",
        signups: "Rejestracje",
        signupsHint: "{{rate}} kliknięć",
        payers: "Płacący użytkownicy",
        payersHint: "Poleceni, którzy zapłacili w tym okresie",
        revenue: "Przychód",
        revenueHint: "Wpłaty poleconych użytkowników",
        commission: "Zarobiona prowizja",
        commissionHint: "{{pending}} wstrzymane, {{confirmed}} potwierdzone",
        payoutsPaid: "Zrealizowane wypłaty",
        payoutsPaidHint: "Zakończone w tym okresie",
        queue: "Kolejka wypłat",
        queueHint: "Otwarte wnioski: {{count}}",
        queueEmpty: "Nic nie czeka",
      },
      chart: {
        traffic: "Ruch",
        trafficSub: "Kliknięcia i przypisane leady",
        conversions: "Konwersje",
        conversionsSub: "Nowe rejestracje i płacący użytkownicy",
        money: "Przychód i prowizja",
        moneySub: "USD, wg daty płatności",
      },
      series: {
        clicks: "Kliknięcia",
        leads: "Leady",
        signups: "Rejestracje",
        payers: "Płacący użytkownicy",
        revenue: "Przychód",
        commission: "Prowizja",
      },
      table: {
        title: "Kody",
        subtitle:
          "{{shown}} z {{total}} kodów. Kliknij kod, żeby zobaczyć jego raport.",
        dimension: "Kod",
        clicks: "Kliknięcia",
        leads: "Leady",
        signups: "Rejestracje",
        payers: "Płacący",
        conversion: "Kliknięcie do rejestracji",
        revenue: "Przychód",
        commission: "Prowizja",
        signupsChange: "Rejestracje vs poprzedni",
        ownerQueue: "Kolejka wypłat",
        ownerFree: "Wolne do wypłaty",
        inactive: "nieaktywny",
        overCommitted: "przekroczone saldo",
        overCommittedOwners: "{{count}} właścicieli z przekroczonym saldem",
        empty: "Żaden kod nie pasuje do tych filtrów.",
        sort: "Sortuj",
      },
      payouts: {
        title: "Wypłaty wg statusu",
        subtitle:
          "Aktualny status wszystkich wniosków. Kliknij status, żeby przejść do listy.",
        dimension: "Status",
        count: "Wnioski",
        amount: "Kwota",
        open: "Otwórz wypłaty",
        empty: "Nie ma jeszcze wniosków o wypłatę.",
      },
      filters: {
        search: "Szukaj",
        owner: "Właściciel",
        activeOnly: "Tylko aktywne",
        searchPlaceholder: "Kod, etykieta lub e-mail właściciela",
      },
      loading: "Wczytywanie przeglądu poleceń",
      cli: {
        payouts: "Kolejka wypłat: otwarte {{count}}, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe filtry",
      description: "Sprawdź okres i filtry",
    },
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się jako admin, żeby zobaczyć analitykę poleceń",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Analitykę poleceń widzą tylko admini",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nic nie pasuje do tych filtrów",
    },
    conflict: {
      title: "Konflikt",
      description: "Dane zmieniły się podczas wczytywania, spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zbudować przeglądu poleceń",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanie poszło nie tak",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
  },
  success: {
    title: "Wczytano",
    description: "Przegląd poleceń wczytany",
  },
};
