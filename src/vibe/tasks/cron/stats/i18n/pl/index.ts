import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Zarządzanie zadaniami",

  errors: {
    fetchCronTaskStats: "Nie udało się wczytać stanu zadań: {{error}}",
  },

  enums: {
    taskHealth: {
      stuck: "Zawieszone",
      failing: "Błąd",
      overdue: "Spóźnione",
      flaky: "Niestabilne",
      recovering: "Wraca do normy",
      lowData: "Mało danych",
      running: "W trakcie",
      neverRan: "Nigdy nie uruchomione",
      healthy: "Sprawne",
      disabled: "Wyłączone",
    },
    healthFilter: {
      all: "Wszystkie stany",
      attention: "Wymaga uwagi",
    },
  },

  get: {
    title: "Stan zadań",
    titleShort: "Stan zadań",
    description:
      "Stan crona w jednym widoku: zadania z błędem, zawieszone, spóźnione, wyłączone i nigdy nie uruchomione, liczba uruchomień, skuteczność i czas trwania w czasie. Kliknij zadanie, aby zobaczyć historię uruchomień.",
    tag: "Stan crona",
    fields: {
      taskId: {
        title: "Zadanie",
        description: "Ogranicz raport do jednego ID zadania",
      },
      health: {
        title: "Stan",
        description:
          "Pokaż w tabeli tylko zadania w tym stanie (lista uwagi zawsze pokazuje wszystkie zadania z błędem, zawieszone i spóźnione)",
      },
      includeDisabled: {
        title: "Uwzględnij wyłączone zadania",
        description:
          "Licz uruchomienia wyłączonych zadań w metrykach i wykresach okresu. Domyślnie wyłączone: stare błędy wyłączonego zadania nie mówią nic o dzisiejszym stanie.",
      },
      days: {
        title: "Pokaż tabele dzienne",
        description:
          "Wypisz rozbicie dzienne pod każdym wykresem (CLI). Domyślnie wyłączone: sparkline już pokazuje trend.",
      },
      includeParked: {
        title: "Pokaż zaparkowane zadania",
        description:
          "Uwzględnij zakończone zadania jednorazowe i wyłączone zadania, które nigdy nie działały. Domyślnie ukryte.",
      },
    },
    response: {
      generatedAt: { title: "Stan na" },
      window: { title: "Okres" },
      summary: { title: "Stany zadań teraz" },
      kpis: { title: "Metryki uruchomień w okresie" },
      runsTrend: { title: "Uruchomienia w czasie" },
      successTrend: { title: "Skuteczność w czasie" },
      durationTrend: { title: "Czas trwania w czasie" },
      attention: { title: "Wymaga uwagi" },
      tasks: { title: "Zadania" },
      recentRuns: { title: "Ostatnie uruchomienia" },
      inFlight: { title: "Trwające uruchomienie" },
      watchdog: { title: "Stan watchdoga" },
      failuresByTask: { title: "Nieudane uruchomienia według zadania" },
      tasksWithFailures: { title: "Zadania z błędami" },
      disabledIncluded: { title: "Uwzględniono wyłączone zadania" },
      taskOptions: { title: "Lista zadań" },
    },
    errors: {
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wczytać stanu zadań",
      },
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź okres i filtry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się, aby zobaczyć stan zadań",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz dostępu do stanu zadań",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak zadania o tym ID",
      },
      conflict: {
        title: "Konflikt",
        description: "Żądanie koliduje z bieżącym stanem",
      },
      network: {
        title: "Błąd sieci",
        description: "Brak połączenia ze stanem zadań",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Coś poszło nie tak przy wczytywaniu stanu zadań",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz lub odrzuć zmiany",
      },
    },
    success: {
      title: "Stan zadań wczytany",
      description: "Raport stanu zadań jest gotowy",
    },
  },

  widget: {
    watchdogBanner:
      "Sam watchdog zadań jest w stanie: {{state}}. Oceny zawieszonych i spóźnionych zadań mogą być nieaktualne, dopóki znowu nie zadziała poprawnie.",
    inFlight: {
      title: "W trakcie",
      line: "Start {{age}} temu · zawieszone po {{limit}} (limit {{timeout}} + zapas)",
      stuck: "ponad limitem watchdoga",
      run: "uruchomienie",
      noRun: "brak zapisanego wykonania",
    },
    title: "Stan zadań",
    viewTasks: "Zadania",
    viewHistory: "Historia uruchomień",
    refresh: "Odśwież",
    now: "Teraz",
    inPeriod: "W okresie",
    allHealthy: "Wszystkie {{count}} aktywne zadania sprawne",
    tile: {
      failing: "Z błędem",
      failingHint: "Aktywne, ostatnie uruchomienie z błędem",
      stuck: "Zawieszone",
      stuckHint: "Działa ponad limit czasu",
      overdue: "Spóźnione",
      overdueHint: "Pominięte zaplanowane uruchomienie",
      flaky: "Niestabilne",
      flakyHint: "Poniżej 80% skuteczności w okresie",
      flakyRecovering: "jeszcze {{count}} wraca do normy",
      neverRan: "Nigdy nie uruchomione",
      neverRanHint: "Aktywne, nigdy nie wystartowało",
      disabled: "Wyłączone",
      disabledHint: "Wyłączone celowo, nie zepsute",
      disabledOrphans: "{{count}} z osieroconym uruchomieniem",
      parked: "Zaparkowane",
      parkedHint: "Jednorazowe i nigdy nie uruchomione wyłączone, ukryte",
      parkedShownHint:
        "Jednorazowe i nigdy nie uruchomione wyłączone, widoczne",
      lowData: "Mało danych",
      lowDataHint: "Błędy, mniej niż 3 zakończone uruchomienia",
      timedOutExcluded: "Bez {{count}} uruchomień przerwanych limitem czasu",
      healthy: "Sprawne",
      healthyHint: "z {{total}} aktywnych",
      runs: "Uruchomienia",
      failedRuns: "Nieudane uruchomienia",
      successRate: "Skuteczność (uruchomień)",
      successRateHint: "Udane z zakończonych uruchomień",
      tasksWithFailures: "Zadania z błędami",
      tasksWithFailuresHint: "z {{total}} zadań, które działały",
      completedOnly: "Tylko udane uruchomienia",
      noCompleted: "Brak udanego uruchomienia",
      recovering: "Wraca do normy",
      recoveringHint: "Znowu czysto, ostatnie 3 uruchomienia udane",
      stuckDisabled: "{{count}} na wyłączonym zadaniu",
      p50Duration: "Mediana czasu",
      p95Duration: "Czas p95",
    },
    attention: {
      title: "Wymaga uwagi",
      subtitle:
        "Zadania z błędem, zawieszone, niestabilne i spóźnione. Napraw je najpierw.",
      empty: "Nic z błędem, zawieszonego ani spóźnionego.",
      lastError: "Ostatni błąd",
      noError: "Brak zapisanego komunikatu błędu",
      failedAgo: "{{status}} {{age}} temu",
      runningFor:
        "Działa od {{age}} · zawieszone po {{limit}} (limit {{timeout}} + zapas)",
      missed: "Termin minął {{due}} temu, ostatnie uruchomienie {{last}}",
      lastNever: "nigdy",
      lastAgo: "{{age}} temu",
      streak: "{{count}} błędów z rzędu (łącznie)",
      failuresInPeriod: "{{count}} nieudanych uruchomień w okresie",
      flakyDetail:
        "{{rate}} skuteczności przy {{runs}} zakończonych uruchomieniach w okresie",
      recoveringDetail:
        "ostatnie {{count}} uruchomienia udane · {{rate}} skuteczności przy {{runs}} zakończonych w okresie",
      neverCompleted: "nigdy nie zakończyło uruchomienia",
      disabledToo: "wyłączone",
      openFailures: "Nieudane",
      openRuns: "Wszystkie uruchomienia",
      openRunning: "Trwające uruchomienie",
      orphaned: "osierocone uruchomienie, zadanie wyłączone",
    },
    chart: {
      runs: "Uruchomienia",
      runsSubtitle: "Kliknij słupek, aby zobaczyć uruchomienia z tego okresu",
      completed: "Udane",
      failed: "Nieudane",
      other: "Inne",
      successRate: "Skuteczność",
      successRateSubtitle:
        "Udane z zakończonych uruchomień. Dni bez uruchomień zostają puste.",
      duration: "Czas trwania",
      durationSubtitle:
        "Mediana i p95 udanych uruchomień. Dni bez uruchomień zostają puste.",
      durationSplitSubtitle:
        "Tylko udane uruchomienia. Dni bez uruchomień zostają puste.",
      byTask: "Nieudane uruchomienia według zadania",
      byTaskSubtitle: "5 najczęstszych zadań, reszta razem",
      otherTasks: "Inne zadania",
      p50: "Mediana",
      p95: "p95",
    },
    table: {
      title: "Według zadania",
      subtitle:
        "Najpilniejsze na górze. Kliknij zadanie, aby zobaczyć historię uruchomień.",
      dimension: "Zadanie",
      runs: "Uruchomienia",
      failures: "Nieudane",
      successRate: "Skuteczność",
      p50: "Mediana",
      lastRun: "Ostatnie",
      p95: "p95",
      trendCol: "Trend skuteczności",
      state: "Stan",
      nextRun: "Następne",
      orphaned: "osierocone uruchomienie, start {{age}} temu",
      oneOff: "jednorazowe",
      last: "Ostatnio {{status}} {{age}} temu",
      lastNever: "Nigdy nie uruchomione",
      next: "następne za {{age}}",
      nextNone: "brak następnego",
      runningTooLong: "działa za długo",
      skippedHint: "pominięte: za mało kredytów",
      failedCount: "{{count}} nieudanych",
      lastLine: "Ostatnie: {{last}} · {{next}}",
      blocked: "zablokowane przez trwające uruchomienie",
      trend: "skuteczność",
      nextNow: "teraz",
      empty: "Brak zadań w tym stanie.",
    },
    filter: {
      task: "Zadanie",
      state: "Stan",
      allTasks: "Wszystkie zadania",
      includeDisabled: "Uwzględnij wyłączone",
      scopeEnabled: "Tylko aktywne zadania",
      scopeAll: "Uwzględniono wyłączone",
    },
    cli: {
      states: "Stany",
      state: "Stan",
      runId: "uruchomienie",
      trendHeader: "OKRES | ZAKOŃCZONE | SKUTECZNOŚĆ | MEDIANA | P95",
      attention: "WYMAGA UWAGI",
      noAttention: "Wymaga uwagi: nic",
      daysHint: "Tabele dzienne: --days=true",
      drillRunning:
        "Otwórz trwające uruchomienie: vibe cron-history --taskId={{id}} --status=status.running",
      byDay: "dziennie",
      runningOnTime: "Działa w limicie",
      scope:
        "Metryki okresu: tylko aktywne zadania. Uwzględnij wyłączone: --includeDisabled=true",
      parkedHidden:
        "Ukryto {{count}} zaparkowanych zadań (zakończone jednorazowe, nigdy nie uruchomione wyłączone). Pokaż: --includeParked=true",
      recentRuns: "Ostatnie {{count}} uruchomień",
      noRuns: "Brak zapisanych uruchomień",
      tasks: "Zadania",
      header:
        "STAN | ZADANIE | URUCHOMIENIA | NIEUDANE | SKUTECZNOŚĆ | MEDIANA | P95 | OSTATNIE | NASTĘPNE",
      drill:
        "Szczegóły: vibe cron-history --taskId=<id> --status=status.failed,status.error,status.timeout",
    },
    age: {
      justNow: "teraz",
      seconds: "{{n}} s",
      minutes: "{{n}} min",
      hours: "{{n}} godz.",
      days: "{{n}} dni",
    },
  },
};
