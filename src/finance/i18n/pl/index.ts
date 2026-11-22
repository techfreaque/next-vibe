import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Finanse",
  documents: {
    search: "Szukaj dokumentów",
    matches: "Pasujące dokumenty ({{count}})",
    emptyTitle: "Brak dokumentów dla tych filtrów",
    emptyHint: "Zmień wyszukiwaną frazę lub filtry.",
    allCompanies: "Wszystkie firmy, do których masz dostęp",
    chooseCompany: "Wybierz firmę",
    allCustomers: "Wszyscy klienci",
    chooseCustomer: "Wybierz klienta",
    apply: "Zastosuj filtry",
    clear: "Wyczyść filtry",
    page: "Strona {{page}} z {{pages}} · {{total}} wyników",
    previous: "Poprzednia strona",
    next: "Następna strona",
    select: "Wybierz {{reference}}",
    open: "Otwórz {{reference}}",
    noReference: "Bez numeru dokumentu",
    invoices: "Faktury sprzedażowe",
    bills: "Faktury od dostawców",
    estimates: "Oferty",
    heading: "Dokumenty handlowe",
  },
  tags: {
    finance: "finanse",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
      modelsLab: "ModelsLab",
      edenAi: "Eden AI",
    },
    provider: {
      all: "Wszyscy dostawcy",
    },
    eventKind: {
      charge: "Płatność",
      refund: "Zwrot",
      dispute: "Spór",
      cancellation: "Anulowanie",
      payout: "Wypłata",
      fee: "Opłata za płatność",
    },
    runStatus: {
      ok: "OK",
      skipped: "Pominięto",
      failed: "Błąd",
    },
    alertType: {
      lowBalance: "Niskie saldo przedpłacone",
      negativeMargin: "Ujemna marża",
      thinMargin: "Niska marża",
      balanceDrain: "Wyciek salda",
      spendSpike: "Skok wydatków",
      refundSpike: "Skok zwrotów",
      disputeSpike: "Skok sporów",
      cancellationSpike: "Skok anulowań",
      billingGap: "Luka w rozliczeniu",
    },
    severity: {
      warning: "Ostrzeżenie",
      critical: "Krytyczny",
    },
    threshold: {
      openrouterAutoTopUpFloorUsd:
        "OpenRouter: próg alertu o doładowaniu automatycznym (USD)",
      openrouterAutoTopUpGraceHours:
        "OpenRouter: czas na doładowanie automatyczne (godziny)",
      gabLowBalanceCredits: "Gab AI: minimalne saldo (kredyty)",
      uncensoredAiLowBalanceCredits: "uncensored.ai: minimalne saldo (kredyty)",
      freedomGptLowBalanceCredits: "FreedomGPT: minimalne saldo (kredyty)",
      nanoGptAutoTopUpFloorUsd:
        "NanoGPT próg alarmu dla automatycznego doładowania (USD)",
      nanoGptAutoTopUpGraceHours:
        "NanoGPT czas oczekiwania na automatyczne doładowanie (godziny)",
      veniceAutoTopUpFloorUsd:
        "Venice próg alarmu dla automatycznego doładowania (USD)",
      modelsLabLowBalanceUsd: "Próg salda ModelsLab (USD)",
      edenAiLowBalanceUsd: "Próg salda Eden AI (USD)",
      veniceAutoTopUpGraceHours:
        "Venice czas oczekiwania na automatyczne doładowanie (godziny)",
      marginFloorPct: "Dolna granica marży (%)",
      drainMultiplier: "Mnożnik wycieku (x średnia)",
      hourlySpendCapUsd: "Limit godzinowy na dostawcę ($/h)",
      minSpikeUsd: "Minimalny wydatek do oceny skoku ($)",
      refundRatePct: "Limit zwrotów (% płatności)",
      disputeCountDaily: "Spory dziennie",
      cancellationMultiplier: "Skok anulowań (x średnia)",
      cancellationMin: "Minimum anulowań do oceny skoku",
      billingGapPct: "Limit luki w rozliczeniu (% ponad naliczone)",
      alertDedupHours: "Okno powtórzeń alertu (godziny)",
      minRevenueUsd: "Minimalny dzienny przychód do oceny marży ($)",
      minCostUsd: "Minimalny dzienny koszt do oceny marży ($)",
    },
    scope: {
      all: "Wszystko",
      balances: "Tylko salda dostawców",
      revenue: "Tylko przychód",
    },
    costCoverage: {
      complete: "Pełne",
      partial: "Koszt niepełny",
      none: "Koszt nieznany",
    },
    metric: {
      stripeRevenue: "Przychód Stripe (brutto, $)",
      nowpaymentsRevenue: "Przychód NOWPayments (brutto, $)",
      netRevenue: "Przychód netto ($)",
      refunds: "Zwroty ($)",
      upstreamCost: "Koszt u dostawców ($)",
      internalBilled: "Naliczone użytkownikom ($)",
      grossMarginUsd: "Marża brutto ($)",
      grossMarginPct: "Marża brutto (%)",
      providerSpend: "Wydatki u dostawcy ($)",
      providerBalance: "Saldo u dostawcy ($)",
      providerBalanceNative: "Saldo u dostawcy (kredyty dostawcy)",
      providerCost: "Koszt dostawcy z naszych zapisów użycia ($)",
      costTotal: "Koszt dostawców łącznie ($)",
      costPaid: "Koszt dostawców płatnego użycia ($)",
      costFree: "Koszt dostawców darmowego użycia ($)",
      consumedList: "Zużyte kredyty po cenie katalogowej ($)",
      earned: "Zarobione: płatne kredyty po zapłaconej cenie ($)",
      freeList: "Zużyte darmowe kredyty po cenie katalogowej ($)",
      aiMarginUsd: "Marża AI: zarobione minus koszt dostawców ($)",
      aiMarginPct: "Marża AI (% zarobionego)",
      paidMarginUsd: "Marża płatnego użycia ($)",
      paidMarginPct: "Marża płatnego użycia (%)",
      alerts: "Wywołane alerty",
    },
  },
  ingest: {
    title: "Pobranie danych finansowych",
    titleShort: "Pobranie",
    description:
      "Tylko do odczytu: prawdziwy przychód (Stripe, NOWPayments) i prawdziwe salda dostawców. Liczy dzienną marżę i wywołuje alerty. Nie rusza pieniędzy.",
    task: {
      balances:
        "Co godzinę: odczyt sald dostawców, pomiar wydatków, wykrywanie wycieków i skoków.",
      revenue:
        "Codziennie: przychód ze Stripe i NOWPayments, marża, zwroty, spory i niska marża.",
    },
    fields: {
      scope: {
        label: "Zakres",
        description: "Co pobrać",
      },
      dryRun: {
        label: "Próba",
        description: "Odczyt i obliczenia, bez zapisu i bez wysyłki",
      },
      windowDays: {
        label: "Okno przychodu (dni)",
        description: "Jak daleko wstecz pobrać przychód. Domyślnie 3.",
      },
      backfillFrom: {
        label: "Uzupełnij od (RRRR-MM-DD)",
        description:
          "Przelicz dzienne podsumowania od tego dnia UTC do dnia uzupełnij-do (domyślnie dziś). Odbudowuje przychód z całej naszej historii płatności; zawsze zapisuje (ignoruje próbę). Zostaw puste dla zwykłego pobrania.",
      },
      backfillTo: {
        label: "Uzupełnij do (RRRR-MM-DD)",
        description: "Ostatni dzień UTC do przeliczenia. Domyślnie: dziś.",
      },
    },
    response: {
      dryRun: "Próba",
      ranAt: "Uruchomiono",
      sources: "Źródła",
      days: "Dzienna marża",
      alertsRaised: "Wywołane alerty",
      alertsSuppressed: "Stłumione alerty (duplikat)",
      alerts: "Alerty",
    },
    widget: {
      hint: "Czyta tylko nasze konta. Źródło bez endpointu jest pomijane, powód zapisany.",
      submit: "Uruchom pobranie",
      submitting: "Trwa…",
      result: "Wynik",
      resultDry: "Próba (nic nie zapisano, nic nie wysłano)",
      events: "{{count}} wierszy",
      margin: "Wpływy i wydatki u dostawców dziennie (to nie marża)",
      dayLine: "wpływy {{cash}} · wydatki u dostawców {{cost}}",
      costUnknown: "koszt nieznany",
      alerts: "Alerty: {{raised}} wywołane, {{suppressed}} stłumione",
    },
  },
  status: {
    title: "Finanse",
    titleShort: "Finanse",
    description:
      "Przychód kontra koszt u dostawców: salda, marża, alerty i progi.",
    response: {
      lastIngestAt: "Ostatnia próba synchronizacji",
      lastSuccessfulIngestAt: "Ostatnia udana synchronizacja źródła",
      asOf: "Czas sprawdzenia stanu",
      sources: "Źródła",
      week: "Ostatnie 7 dni",
      days: "Dzienna marża",
      alerts: "Ostatnie alerty",
      thresholds: "Progi",
    },
    widget: {
      back: "Wróć",
      title: "Finanse",
      refresh: "Odśwież",
      runIngest: "Uruchom pobranie",
      loading: "Wczytuję finanse…",
      lastIngest: "Ostatnia próba {{when}}",
      lastSuccessful: "Ostatnia udana synchronizacja {{when}}",
      snapshot: "Ostatni odczyt od dostawcy {{when}}",
      stale: "Nieaktualny odczyt",
      noBalance: "Brak danych o saldzie",
      noSources: "Żadne źródło finansowe nie zgłosiło jeszcze danych.",
      never: "nigdy",
      neverRun: "Jeszcze nie uruchomiono",
      margin: {
        title: "Marża AI (ostatnie 7 dni)",
        earned: "Zarobione na płatnych kredytach",
        cost: "Koszt dostawców",
        margin: "Marża AI",
        pct: "Marża AI %",
        paidPct: "Marża płatnego użycia %",
        basis:
          "Zarobione = zużyte płatne kredyty po zapłaconej cenie. Koszt = koszt dostawców całego użycia, w tym {{free}} darmowych kredytów po cenie katalogowej.",
        cash: "Wpływy netto: {{net}}, opłaty płatności {{fees}}. Przepływ gotówki, nigdy nie odejmowany od kosztu dostawców.",
        cashDay: "wpływy {{net}}",
        empty: "Brak użycia w ostatnich 7 dniach.",
        missingPct: "Nic nie zarobiono",
      },
      providers: {
        title: "Salda dostawców",
        lastSpend: "Wydano od ostatniego odczytu: {{amount}}",
        lastSpendEstimate:
          "Szacunkowe wydatki od ostatniego odczytu: {{amount}}",
        previousDaySpend: "Zużycie API w dniu {{day}} (UTC): {{amount}}",
        lastNativeSpend:
          "Zużycie w API do ostatniej pełnej godziny: {{amount}}",
        noSpend: "Brak zmierzonych wydatków",
      },
      revenue: {
        title: "Źródła przychodu",
        fallback: "Zastępczo: własne zapisy",
      },
      alerts: {
        title: "Ostatnie alerty",
        empty: "Brak zapisanych alertów",
      },
      thresholds: {
        title: "Progi",
        hint: "Obowiązują wartości domyślne, dopóki nie ustawisz własnej. Alert powtarza się najwyżej raz na okno.",
        custom: "Własna wartość",
        default: "Domyślna",
        edit: "Zmień",
      },
    },
  },
  thresholds: {
    title: "Ustaw próg finansowy",
    titleShort: "Ustaw próg",
    description:
      "Nadpisuje jeden próg alertu. Wyłączone nadpisanie wraca do wartości domyślnej.",
    fields: {
      key: { label: "Próg", description: "Który limit zmienić" },
      value: { label: "Wartość", description: "Nowy limit" },
      enabled: {
        label: "Użyj tej wartości",
        description: "Wyłączone: obowiązuje domyślna",
      },
      note: {
        label: "Notatka",
        description: "Dlaczego ten limit",
        placeholder: "np. tydzień premiery, spodziewane zwroty",
      },
    },
    response: { key: "Zapisany próg" },
    widget: {
      back: "Wstecz",
      hint: "Zmiana działa od następnego pobrania.",
    },
  },
  series: {
    title: "Seria finansowa",
    titleShort: "Finanse",
    description:
      "Szeregi czasowe monitora finansów: przychód wg operatora, przychód netto, koszt u dostawców, marża, wydatki i salda dostawców, alerty.",
    fields: {
      resolution: { label: "Rozdzielczość", description: "Rozmiar przedziału" },
      range: { label: "Zakres", description: "Zakres czasu do pobrania" },
      lookback: {
        label: "Wsteczny zapas",
        description: "Słupki rozgrzewkowe przed zakresem",
      },
      metric: { label: "Metryka", description: "Którą serię rysować" },
      provider: {
        label: "Dostawca",
        description: "Filtruje wydatki i salda dostawców",
      },
      costProvider: {
        label: "Dostawca kosztów",
        description:
          "ID dostawcy API dla kosztów, np. openrouter, nano-gpt lub unattributed",
      },
      result: { label: "Seria", description: "Szereg czasowy finansów" },
      meta: { label: "Meta", description: "Metadane wykonania" },
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź zaznaczone pola",
    },
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się jako admin",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Narzędzia finansowe wymagają roli admina",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Tego wpisu nie ma",
    },
    conflict: {
      title: "Konflikt",
      description: "Wpis się zmienił, odśwież i spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się wykonać żądania",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanego się nie powiodło",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    invalidThreshold: "Próg wymaga nieujemnej liczby",
    ingestFailed: "Pobranie danych finansowych nie powiodło się: {{error}}",
    backfill: {
      invalidRange:
        "Uzupełnianie wymaga poprawnej daty od, nie późniejszej niż data do (RRRR-MM-DD)",
      tooWide:
        "Zakres uzupełniania zbyt szeroki: najwyżej {{max}} dni na przebieg",
    },
  },
  success: {
    title: "Gotowe",
    description: "Zapisano",
  },
};
