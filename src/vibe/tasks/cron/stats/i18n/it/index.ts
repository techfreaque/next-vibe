import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Gestione attività",

  errors: {
    fetchCronTaskStats:
      "Impossibile caricare lo stato delle attività: {{error}}",
  },

  enums: {
    taskHealth: {
      stuck: "Bloccata",
      failing: "In errore",
      overdue: "In ritardo",
      flaky: "Instabile",
      recovering: "In ripresa",
      lowData: "Pochi dati",
      running: "In corso",
      neverRan: "Mai eseguita",
      healthy: "Sana",
      disabled: "Disattivata",
    },
    healthFilter: {
      all: "Tutti gli stati",
      attention: "Da sistemare",
    },
  },

  get: {
    title: "Stato attività",
    titleShort: "Stato attività",
    description:
      "Lo stato del cron a colpo d'occhio: attività in errore, bloccate, in ritardo, disattivate e mai eseguite, volume di esecuzioni, tasso di successo e durata nel tempo. Clicca un'attività per il suo storico.",
    tag: "Stato cron",
    fields: {
      taskId: {
        title: "Attività",
        description: "Limita il report a un ID attività",
      },
      health: {
        title: "Stato",
        description:
          "Mostra in tabella solo le attività in questo stato (la lista da sistemare mostra sempre tutte le attività in errore, bloccate e in ritardo)",
      },
      includeDisabled: {
        title: "Includi attività disattivate",
        description:
          "Conta le esecuzioni delle attività disattivate nelle metriche e nei grafici del periodo. Spento di default: i vecchi errori di un'attività spenta non dicono nulla sullo stato di oggi.",
      },
      days: {
        title: "Mostra tabelle giornaliere",
        description:
          "Stampa il dettaglio giornaliero sotto ogni grafico (CLI). Spento di default: le sparkline mostrano già l'andamento.",
      },
      includeParked: {
        title: "Mostra attività parcheggiate",
        description:
          "Includi le attività una tantum concluse e quelle disattivate mai eseguite. Nascoste di default.",
      },
    },
    response: {
      generatedAt: { title: "Aggiornato al" },
      window: { title: "Periodo" },
      summary: { title: "Stati delle attività adesso" },
      kpis: { title: "Metriche di esecuzione nel periodo" },
      runsTrend: { title: "Esecuzioni nel tempo" },
      successTrend: { title: "Tasso di successo nel tempo" },
      durationTrend: { title: "Durata nel tempo" },
      attention: { title: "Da sistemare" },
      tasks: { title: "Attività" },
      recentRuns: { title: "Ultime esecuzioni" },
      inFlight: { title: "Esecuzione in corso" },
      watchdog: { title: "Stato del watchdog" },
      failuresByTask: { title: "Esecuzioni fallite per attività" },
      tasksWithFailures: { title: "Attività con errori" },
      disabledIncluded: { title: "Attività disattivate incluse" },
      taskOptions: { title: "Elenco attività" },
    },
    errors: {
      server: {
        title: "Errore del server",
        description: "Impossibile caricare lo stato delle attività",
      },
      validation: {
        title: "Richiesta non valida",
        description: "Controlla periodo e filtri",
      },
      unauthorized: {
        title: "Non autenticato",
        description: "Accedi per vedere lo stato delle attività",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai accesso allo stato delle attività",
      },
      notFound: {
        title: "Non trovata",
        description: "Nessuna attività con questo ID",
      },
      conflict: {
        title: "Conflitto",
        description: "La richiesta è in conflitto con lo stato attuale",
      },
      network: {
        title: "Errore di rete",
        description: "Stato delle attività non raggiungibile",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Il caricamento dello stato delle attività non è riuscito",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salva o annulla prima le modifiche",
      },
    },
    success: {
      title: "Stato attività caricato",
      description: "Il report sullo stato delle attività è pronto",
    },
  },

  widget: {
    watchdogBanner:
      "Il watchdog delle attività è a sua volta {{state}}. I verdetti bloccata e in ritardo possono essere superati finché non torna a girare pulito.",
    inFlight: {
      title: "In corso",
      line: "Avviata {{age}} fa · bloccata dopo {{limit}} (timeout {{timeout}} + margine)",
      stuck: "oltre il limite del watchdog",
      run: "esecuzione",
      noRun: "nessuna esecuzione registrata",
    },
    title: "Stato attività",
    viewTasks: "Attività",
    viewHistory: "Storico esecuzioni",
    refresh: "Aggiorna",
    now: "Adesso",
    inPeriod: "Nel periodo",
    allHealthy: "Tutte le {{count}} attività attive sono sane",
    tile: {
      failing: "In errore",
      failingHint: "Attiva, ultima esecuzione fallita",
      stuck: "Bloccate",
      stuckHint: "Oltre il timeout",
      overdue: "In ritardo",
      overdueHint: "Esecuzione pianificata saltata",
      flaky: "Instabili",
      flakyHint: "Sotto l'80% di successo nel periodo",
      flakyRecovering: "altre {{count}} in ripresa",
      neverRan: "Mai eseguite",
      neverRanHint: "Attiva, mai avviata",
      disabled: "Disattivate",
      disabledHint: "Spenta, non rotta",
      disabledOrphans: "{{count}} con esecuzione orfana",
      parked: "Parcheggiate",
      parkedHint: "Una tantum e disattivate mai eseguite, nascoste",
      parkedShownHint: "Una tantum e disattivate mai eseguite, visibili",
      lowData: "Pochi dati",
      lowDataHint: "Errori, meno di 3 esecuzioni concluse",
      timedOutExcluded: "Escluse {{count}} esecuzioni in timeout",
      healthy: "Sane",
      healthyHint: "su {{total}} attive",
      runs: "Esecuzioni",
      failedRuns: "Esecuzioni fallite",
      successRate: "Tasso di successo (delle esecuzioni)",
      successRateHint: "Riuscite sulle esecuzioni concluse",
      tasksWithFailures: "Attività con errori",
      tasksWithFailuresHint: "su {{total}} attività eseguite",
      completedOnly: "Solo esecuzioni riuscite",
      noCompleted: "Nessuna esecuzione riuscita",
      recovering: "In ripresa",
      recoveringHint: "Di nuovo pulita, ultime 3 esecuzioni riuscite",
      stuckDisabled: "{{count}} su un'attività disattivata",
      p50Duration: "Durata mediana",
      p95Duration: "Durata p95",
    },
    attention: {
      title: "Da sistemare",
      subtitle:
        "Attività in errore, bloccate, instabili e in ritardo. Sistemale per prime.",
      empty: "Niente in errore, bloccato o in ritardo.",
      lastError: "Ultimo errore",
      noError: "Nessun messaggio di errore registrato",
      failedAgo: "{{status}} {{age}} fa",
      runningFor:
        "In corso da {{age}} · bloccata dopo {{limit}} (timeout {{timeout}} + margine)",
      missed: "Prevista {{due}} fa, ultima esecuzione {{last}}",
      lastNever: "mai",
      lastAgo: "{{age}} fa",
      streak: "{{count}} errori di fila (in totale)",
      failuresInPeriod: "{{count}} esecuzioni fallite nel periodo",
      flakyDetail:
        "{{rate}} di successo su {{runs}} esecuzioni concluse nel periodo",
      recoveringDetail:
        "ultime {{count}} esecuzioni riuscite · {{rate}} di successo su {{runs}} esecuzioni concluse nel periodo",
      neverCompleted: "mai conclusa un'esecuzione",
      disabledToo: "disattivata",
      openFailures: "Fallite",
      openRuns: "Tutte le esecuzioni",
      openRunning: "Esecuzione in corso",
      orphaned: "esecuzione orfana, attività disattivata",
    },
    chart: {
      runs: "Esecuzioni",
      runsSubtitle: "Clicca una barra per le esecuzioni di quel periodo",
      completed: "Riuscite",
      failed: "Fallite",
      other: "Altro",
      successRate: "Tasso di successo",
      successRateSubtitle:
        "Riuscite sulle esecuzioni concluse. I giorni senza esecuzioni restano vuoti.",
      duration: "Durata",
      durationSubtitle:
        "Mediana e p95 delle esecuzioni riuscite. I giorni senza esecuzioni restano vuoti.",
      durationSplitSubtitle:
        "Solo esecuzioni riuscite. I giorni senza esecuzioni restano vuoti.",
      byTask: "Esecuzioni fallite per attività",
      byTaskSubtitle: "Prime 5 attività, il resto raggruppato",
      otherTasks: "Altre attività",
      p50: "Mediana",
      p95: "p95",
    },
    table: {
      title: "Per attività",
      subtitle:
        "Le più urgenti in alto. Clicca un'attività per il suo storico.",
      dimension: "Attività",
      runs: "Esecuzioni",
      failures: "Fallite",
      successRate: "Successo",
      p50: "Mediana",
      lastRun: "Ultima",
      p95: "p95",
      trendCol: "Andamento successo",
      state: "Stato",
      nextRun: "Prossima",
      orphaned: "esecuzione orfana, avviata {{age}} fa",
      oneOff: "una tantum",
      last: "Ultima {{status}} {{age}} fa",
      lastNever: "Mai eseguita",
      next: "prossima tra {{age}}",
      nextNone: "nessuna prossima esecuzione",
      runningTooLong: "in corso da troppo",
      skippedHint: "saltata: crediti insufficienti",
      failedCount: "{{count}} fallite",
      lastLine: "Ultima: {{last}} · {{next}}",
      blocked: "bloccata dall'esecuzione in corso",
      trend: "successo",
      nextNow: "in arrivo",
      empty: "Nessuna attività in questo stato.",
    },
    filter: {
      task: "Attività",
      state: "Stato",
      allTasks: "Tutte le attività",
      includeDisabled: "Includi disattivate",
      scopeEnabled: "Solo attività attive",
      scopeAll: "Disattivate incluse",
    },
    cli: {
      states: "Stati",
      state: "Stato",
      runId: "esecuzione",
      trendHeader: "PERIODO | CONCLUSE | SUCCESSO | MEDIANA | P95",
      attention: "DA SISTEMARE",
      noAttention: "Da sistemare: niente",
      daysHint: "Tabelle giornaliere: --days=true",
      drillRunning:
        "Apri l'esecuzione in corso: vibe cron-history --taskId={{id}} --status=status.running",
      byDay: "al giorno",
      runningOnTime: "In corso nei tempi",
      scope:
        "Metriche del periodo: solo attività attive. Includi disattivate: --includeDisabled=true",
      parkedHidden:
        "{{count}} attività parcheggiate nascoste (una tantum concluse, disattivate mai eseguite). Mostrale: --includeParked=true",
      recentRuns: "Ultime {{count}} esecuzioni",
      noRuns: "Nessuna esecuzione registrata",
      tasks: "Attività",
      header:
        "STATO | ATTIVITÀ | ESECUZIONI | FALLITE | SUCCESSO | MEDIANA | P95 | ULTIMA | PROSSIMA",
      drill:
        "Dettaglio: vibe cron-history --taskId=<id> --status=status.failed,status.error,status.timeout",
    },
    age: {
      justNow: "ora",
      seconds: "{{n}} s",
      minutes: "{{n}} min",
      hours: "{{n}} h",
      days: "{{n}} g",
    },
  },
};
