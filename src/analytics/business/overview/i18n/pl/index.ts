import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  category: "Analityka",
  tags: {
    analytics: "Analityka",
    overview: "Przegląd",
  },
  get: {
    title: "Przegląd biznesu",
    titleShort: "Przegląd",
    description:
      "Ruch, leady, rejestracje, płacący, przychód, koszt AI i alerty w danym okresie, w porównaniu z poprzednim. Każda liczba otwiera raport, który za nią stoi.",
    response: {
      window: "Okres",
      generatedAt: "Dane z",
      acquisition: "Pozyskanie",
      referral: "Polecenia",
      money: "Finanse",
      ops: "Operacje",
    },
    widget: {
      kpi: {
        visits: "Wizyty ludzi",
        humanLeads: "Nowe leady",
        botLeadsHint: "pominięto {{count}} leadów botów",
        botVisitsHint: "pominięto {{count}} wizyt botów",
        payersHint: "Unikalni płacący w okresie",
        signups: "Rejestracje",
        signupRateHint: "{{rate}} nowych leadów",
        payers: "Klienci z płatnością",
        revenue: "Przychód",
        revenueHint: "Wpłacone pieniądze, ok. USD",
        revenueNetHint:
          "Wpłacone pieniądze, ok. USD. {{net}} po kosztach dostawców AI.",
        creditSpend: "Użycie AI (zużyte kredyty)",
        guestSpendHint: "{{amount}} przez gości",
        creditSpendHint:
          "Koszt dostawców {{cost}} (wobec {{previous}}). {{guests}} przez gości.",
        margin: "Marża na użyciu AI",
        marginPartial: "Marża AI (częściowa)",
        marginHint:
          "Koszt dostawców {{cost}}. Naliczone minus koszt, gdzie koszt jest znany.",
        marginBaseHint:
          "{{rate}} z {{base}} naliczonego użycia z danymi o koszcie. Koszt dostawców {{cost}}.",
        marginRateHint:
          "{{margin}} z {{base}} z danymi o koszcie ({{coverage}} użycia).",
        errors: "Nierozwiązane błędy",
        errorsHint: "{{count}} wystąpień w okresie",
        botShare: "Udział botów w leadach",
        botShareHint:
          "{{count}} leadów botów, główne źródło w sekcji Wymaga uwagi",
        botShareTopHint: "{{count}} leadów botów. Największa fala {{prefix}}.",
      },
      trafficChart: "Leady od ludzi i rejestracje",
      trafficChartHint: "Bez botów",
      moneyChart: "Przychód",
      moneyChartHint: "Wpłaty na interwał",
      series: {
        visits: "Wizyty",
        leads: "Nowe leady",
        signups: "Rejestracje",
        revenueUsd: "Przychód",
        spendUsd: "Naliczone użycie AI",
        upstreamCostUsd: "Koszt dostawców",
      },
      sources: "Skąd przychodzą leady (pierwszy kontakt)",
      sourcesDimension: "Kanał",
      sourcesHint:
        "Aktywność w tym okresie wg kanału pierwszego kontaktu każdej osoby",
      referralsHint:
        "Kliknięcia, rejestracje i płatności przypisane do kodu w tym okresie",
      leadShare: "Udział leadów",
      revenueShare: "Udział przychodu",
      footerSources:
        "Przychód w tych wierszach: {{rows}} z {{total}} w okresie",
      footerReferrals:
        "Przypisane kodom (podstawa prowizji): {{rows}} z {{total}} w okresie",
      referrals: "Najlepsze kody polecające",
      referralsDimension: "Kod",
      columns: {
        leads: "Leady",
        signups: "Rejestracje",
        payers: "Płacący",
        clicks: "Kliknięcia",
        revenueUsd: "Przychód",
        conversion: "Lead do rejestracji",
        clickToSignup: "Kliknięcie do rejestracji",
      },
      alerts: {
        severity: { high: "Wysoki", medium: "Średni", low: "Niski" },
        title: "Wymaga uwagi",
        none: "W tym okresie nic nie wymaga uwagi.",
        abuse:
          "{{count}} zakresów IP z falą leadów, na czele {{prefix}} ({{leads}} leadów)",
        payouts: "{{count}} wniosków o wypłatę czeka ({{amount}})",
        tasks: "{{count}} zaplanowanych zadań kończy się błędem",
        connections: "{{count}} połączeń zdalnych z problemem",
        costCoverage:
          "Koszt dostawców znany tylko dla {{coverage}} użycia AI, marża jest niepełna",
        unattributed: "{{share}} przychodu bez znanego źródła ({{amount}})",
        errors:
          "{{count}} nierozwiązanych błędów, {{occurrences}} wystąpień w okresie",
      },
      open: {
        acquisition: "Raport pozyskania",
        funnel: "Lejek",
        referrals: "Przegląd poleceń",
        revenue: "Raport przychodu",
        usage: "Raport użycia AI",
        errors: "Dziennik błędów",
      },
      unavailable: "Nie udało się wczytać tej sekcji.",
      asOf: "Dane z {{time}}. Pamięć podręczna na minutę.",
      loading: "Wczytywanie przeglądu",
    },
    errors: {
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się jako admin, aby zobaczyć przegląd biznesu.",
      },
      validation: {
        title: "Nieprawidłowy okres",
        description: "Sprawdź okres i daty.",
      },
      server: {
        title: "Błąd przeglądu",
        description: "Nie udało się obliczyć przeglądu. Spróbuj ponownie.",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś poszło nie tak podczas wczytywania przeglądu.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem.",
      },
      forbidden: {
        title: "Tylko dla adminów",
        description: "Przegląd biznesu widzą tylko admini.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Przegląd jest niedostępny.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz lub odrzuć zmiany.",
      },
      conflict: {
        title: "Konflikt",
        description: "Dane zmieniły się podczas wczytywania. Spróbuj ponownie.",
      },
    },
    success: {
      title: "Przegląd wczytany",
      description: "Przegląd biznesu dla wybranego okresu.",
    },
  },
};
