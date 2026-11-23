import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Rejestracje",
  titleShort: "Rejestracje",
  description:
    "Kto się zarejestrował, z jakiego kanału lub kodu polecenia, ilu potwierdziło e-mail, zostało aktywnych i zapłaciło, oraz kto spala darmowe kredyty. Każda liczba względem poprzedniego okresu, każdy kafel i wiersz otwiera pasujące konta.",
  category: "Użytkownicy",
  tag: "Statystyki",
  response: {
    window: "Okres",
    kpis: "Wskaźniki",
    totals: "Sumy",
    signupTrend: "Rejestracje w czasie",
    activityTrend: "Aktywność w czasie",
    funnel: "Lejek rejestracji",
    byChannel: "Według kanału",
    byRefCode: "Według kodu polecenia",
    byPlan: "Subskrybenci według planu",
    byLocale: "Według języka",
    freeBurners: "Najwięksi darmowi spalacze",
  },
  widget: {
    cohortNote:
      "Stan na dziś. Starsze konta miały więcej czasu na potwierdzenie, użycie kredytów lub płatność.",
    activityToggle: "Aktywność kont",
    reviewUnverified: "Sprawdź niepotwierdzone rejestracje ({{count}})",
    planLapsed: "Wygasła subskrypcja",
    planPacks: "Tylko pakiety kredytów",
    groups: {
      abuse: "Nadużycia",
      signups: "Rejestracje z okresu",
      accounts: "Wszystkie pasujące konta, ten okres",
    },
    cliHint:
      "Konta za tymi rejestracjami: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Liczymy...",
    filters: "Filtry",
    openUsers: "Otwórz konta",
    empty: "Brak rejestracji w tym okresie.",
    noJourney: "(nieśledzone)",
    noRefCodes: "Brak rejestracji z kodem polecenia w tym okresie.",
    noSubscribers: "Brak aktywnych subskrybentów w tej grupie.",
    noBurners: "Nikt nie spalał darmowych kredytów w tym okresie.",
    signedUpOn: "od {{date}}",
    banned: "Zablokowany",
    unverified: "Niepotwierdzony",
    kpi: {
      revenuePerPayerHint: "Przychód w okresie / płacące konta",
      revenuePerPayer: "Przychód na płacącego",
      revenuePeriod: "Przychód w okresie",
      activatedRate: "Wydali kredyty",
      signups: "Rejestracje",
      signupsHint:
        "Zarejestrowani w okresie. {{total}} pasujących kont łącznie",
      verifiedRate: "Potwierdzone",
      paidConversion: "Konwersja do płatności",
      ofSignups: "{{count}} z {{total}} rejestracji",
      activeUsers: "Aktywne konta",
      activeHint: "Wszystkie pasujące konta, które wydały kredyty w okresie",
      payingUsers: "Płacące konta",
      payingHint: "Wszystkie pasujące konta, które zapłaciły w okresie",
      revenue: "Przychód",
      revenueHint: "Wszystkie pasujące konta, udane płatności w okresie, USD",
      freeBurn: "Spalone darmowe kredyty",
      freeBurnHint: "Kredyty kont bez płatności. Konta: {{count}}",
      banned: "Zablokowane rejestracje",
      bannedHint: "Zarejestrowane w okresie, teraz zablokowane",
    },
    series: {
      paid: "Zapłacili",
      verified: "Potwierdzeni, bez płatności",
      unverified: "Niepotwierdzeni, bez płatności",
      active: "Aktywne konta",
      paying: "Płacące konta",
    },
    funnel: {
      paid: "Zapłacili",
      active: "Wydali kredyty",
      verified: "Potwierdzony e-mail",
      signups: "Rejestracja",
    },
    charts: {
      signups: "Rejestracje",
      signupsHint:
        "Nowe konta w przedziale, podzielone według tego, co zrobiły potem. Kliknij słupek, by zobaczyć konta.",
      activity: "Aktywność",
      activityHint:
        "Wszystkie pasujące konta w przedziale. Legenda pokazuje unikalne konta w okresie",
      funnel: "Kamienie milowe rejestracji",
      funnelHint:
        "Rejestracje z okresu, które osiągnęły każdy etap. Liczby zgadzają się z kaflami wyżej.",
      byChannel: "Rejestracje według kanału pierwszego kontaktu",
      byChannelHint:
        "Pierwszy kontakt tych rejestracji. Przychód = ich płatności w okresie",
      byRefCode: "Rejestracje według kodu polecenia",
      byRefCodeHint:
        "Rejestracje zaliczone kodowi, inaczej kod z pierwszej wizyty. Może przekraczać wiersze kanału ref:",
      byPlan: "Płacące konta według planu",
      byPlanHint:
        "Konta, które zapłaciły w okresie, i ich przychód; sumuje się do kafli Płacące i Przychód",
      byLocale: "Rejestracje według języka",
      freeBurners: "Najwięksi darmowi spalacze",
      freeBurnersHint: "Nigdy nie płacili, najwięcej kredytów w okresie",
    },
    columns: {
      ofSignups: "% rejestracji",
      accounts: "Konta",
      milestone: "Etap",
      active: "Wydali kredyty",
      creditsGranted: "Przyznane",
      creditsSpentTotal: "Łącznie",
      creditBalance: "Saldo",
      signups: "Rejestr.",
      verified: "Potwierdz.",
      paid: "Zapłacili",
      conversion: "Konw.",
      revenue: "Przychód w okresie",
      channel: "Kanał",
      refCode: "Kod polecenia",
      plan: "Plan",
      subscribers: "Konta",
      revenueWindow: "Przychód",
      locale: "Język",
      account: "Konto",
      creditsSpent: "W okresie",
    },
    definitions:
      "Domyślnie tylko ludzie: admini i domeny testowe są wykluczone. Aktywny = wydał kredyty z własnego lub powiązanego portfela gościa. Przychód w USD po stałych kursach. Konwersja liczy płatności w dowolnym momencie po rejestracji.",
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
