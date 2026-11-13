import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Liczby biznesowe",
  titleShort: "Statystyki",
  description:
    "Rejestracje, aktywni i płacący użytkownicy, MRR, przychód, wydane kredyty, konwersja z rejestracji do płatności i retencja D7. Każda liczba względem poprzedniego okresu, plus trend, kanały i najwięksi użytkownicy.",
  category: "Użytkownicy",
  tag: "Statystyki",
  fields: {
    range: {
      label: "Okres",
      description:
        "Okres raportu, porównany z okresem tej samej długości tuż przed nim",
    },
    from: {
      label: "Od",
      description: "Pierwszy dzień (UTC). Nadpisuje początek okresu",
    },
    to: {
      label: "Do",
      description: "Ostatni dzień (UTC). Nadpisuje koniec okresu",
    },
    granularity: {
      label: "Podział wykresu",
      description: "Dzień, tydzień lub miesiąc. Auto dobiera według długości",
    },
    includeInternal: {
      label: "Uwzględnij adminów",
      description: "Licz wewnętrzne konta adminów i ich płatności",
    },
  },
  response: {
    period: "Okres",
    kpis: "Wskaźniki",
    series: "Szereg czasowy",
    channels: "Kanały rejestracji",
    revenueByCurrency: "Przychód wg waluty",
    subscriptionsByStatus: "Subskrypcje wg statusu",
    topSpenders: "Najwięksi użytkownicy",
    generatedAt: "Wygenerowano",
  },
  enums: {
    range: {
      last7Days: "Ostatnie 7 dni",
      last30Days: "Ostatnie 30 dni",
      last90Days: "Ostatnie 90 dni",
      last12Months: "Ostatnie 12 miesięcy",
      thisMonth: "Ten miesiąc",
      lastMonth: "Poprzedni miesiąc",
      allTime: "Od początku",
      custom: "Własne daty",
    },
    granularity: {
      auto: "Auto",
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
    },
  },
  kpi: {
    revenue: "Przychód",
    revenueHint: "Udane płatności, USD",
    refundsHint: "{{amount}} zwrócono",
    mrr: "MRR",
    mrrHint: "{{active}} aktywnych subskrypcji, {{pastDue}} zaległych",
    payingUsers: "Płacący",
    payingAllTimeHint: "{{count}} zapłaciło kiedykolwiek",
    creditsSpent: "Wydane kredyty",
    creditsHint: "około {{usd}} użycia",
    newUsers: "Rejestracje",
    totalUsersHint: "{{count}} użytkowników łącznie",
    activeUsers: "Aktywni",
    anonymousHint: "+{{count}} anonimowych z wydatkami",
    signupToPaid: "Rejestracja do płatności",
    ratioHint: "{{converted}} z {{cohort}} nowych zapłaciło",
    retentionD7: "Retencja D7",
    retentionHint: "{{converted}} z {{cohort}} wróciło po 7. dniu",
    activeSubscribers: "Aktywni subskrybenci",
    pastDue: "Zaległe",
    totalUsers: "Użytkownicy łącznie",
    payingAllTime: "Zapłacili kiedykolwiek",
    revenueAllTime: "Przychód łącznie",
    refunds: "Zwroty",
    anonymousActive: "Anonimowi z wydatkami",
  },
  series: {
    signups: "Rejestracje",
    activeUsers: "Aktywni",
    payingUsers: "Płacący",
    revenueUsd: "Przychód",
    creditsSpent: "Kredyty",
  },
  sections: {
    trend: "Trend",
    channels: "Kanały rejestracji",
    subscriptions: "Subskrypcje teraz",
    currencies: "Przychód wg waluty",
    topSpenders: "Najwięcej wydali w okresie",
  },
  table: {
    channel: "Kanał",
    signups: "Rejestracje",
    paying: "Zapłacili",
    conversion: "Konw.",
    user: "Użytkownik",
    creditsSpent: "Wydane kredyty",
    lifetimePaid: "Zapłacono łącznie",
  },
  widget: {
    times: "{{count}}x",
    loading: "Liczę...",
    users: "Użytkownicy",
    refresh: "Odśwież",
    new: "nowe",
    noData: "Brak danych w tym okresie.",
    chartTotal: "Razem {{total}}",
    period:
      "{{from}} do {{to}} ({{days}} dni, UTC). Zmiany względem {{days}} dni wcześniej.",
    definitions:
      "Aktywny = wydał kredyty (własny lub powiązany portfel leada). Płacący = udana płatność w okresie. Przychód w USD po stałym kursie. MRR = trwające subskrypcje wycenione ostatnią płatnością. Konta adminów pominięte, chyba że uwzględnione wyżej.",
    text: {
      header: "{{from}} do {{to}} ({{days}} dni, UTC)",
      metric: "Wskaźnik",
      current: "Teraz",
      previous: "Wcześniej",
      change: "Zmiana",
      bucket: "Okres",
      paying: "{{count}} zapłaciło",
      footer:
        "Okresy: --range=enums.range.last7Days|last90Days|last12Months|allTime. Użytkownicy: vibe users-list",
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe zapytanie",
      description: "Sprawdź okres i daty",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby zobaczyć statystyki",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Potrzebujesz roli admina",
    },
    notFound: {
      title: "Brak danych",
      description: "Nic do pokazania w tym okresie",
    },
    server: {
      title: "Nie udało się policzyć statystyk",
      description: "Serwer nie policzył statystyk użytkowników",
    },
    network: {
      title: "Błąd sieci",
      description: "Brak połączenia z serwerem",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Coś poszło nie tak przy liczeniu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie koliduje z bieżącymi danymi",
    },
  },
  success: {
    title: "Statystyki gotowe",
    description: "Statystyki użytkowników policzone",
  },
};
