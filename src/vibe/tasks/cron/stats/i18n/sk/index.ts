import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Správa úloh",

  errors: {
    fetchCronTaskStats: "Stav úloh sa nepodarilo načítať: {{error}}",
  },

  enums: {
    taskHealth: {
      stuck: "Zaseknuté",
      failing: "Zlyháva",
      overdue: "Po termíne",
      flaky: "Nestabilné",
      recovering: "Obnovuje sa",
      lowData: "Málo údajov",
      running: "Prebieha",
      neverRan: "Zatiaľ nespustené",
      healthy: "V poriadku",
      disabled: "Vypnuté",
    },
    healthFilter: {
      withFailures: "Úlohy, ktoré v období zlyhali",
      all: "Všetky stavy",
      attention: "Vyžaduje pozornosť",
    },
  },

  get: {
    title: "Stav úloh",
    titleShort: "Stav úloh",
    description:
      "Prehľad naplánovaných úloh, ktoré zlyhávajú, uviazli, meškajú, sú vypnuté alebo sa ešte nespustili. Zobrazuje aj počet spustení, ich úspešnosť a vývoj trvania. Výberom úlohy otvoríte jej históriu.",
    tag: "Stav naplánovaných úloh",
    fields: {
      taskId: {
        title: "Úloha",
        description: "Obmedziť prehľad na zadané ID úlohy",
      },
      health: {
        title: "Stav",
        description:
          "Tabuľka zobrazí iba úlohy v tomto stave. Prehľad problémov vždy zahŕňa všetky zlyhávajúce, zaseknuté, nestabilné a oneskorené úlohy.",
      },
      includeDisabled: {
        title: "Zahrnúť vypnuté úlohy",
        description:
          "Zahrnie spustenia vypnutých úloh do metrík a grafov za zvolené obdobie. Predvolene je vypnuté. Staré zlyhania vypnutej úlohy neovplyvňujú jej aktuálny stav.",
      },
      days: {
        title: "Zobraziť denné tabuľky",
        description:
          "V CLI zobrazí pod každým grafom tabuľku s dennými údajmi. Predvolene je vypnutá. Vývoj v čase vidno už v grafoch.",
      },
      includeParked: {
        title: "Zobraziť odstavené úlohy",
        description:
          "Zahrnie dokončené jednorazové úlohy aj vypnuté úlohy bez spustenia. Predvolene sú skryté.",
      },
    },
    response: {
      generatedAt: { title: "Stav k dátumu" },
      window: { title: "Obdobie" },
      summary: { title: "Aktuálny stav úloh" },
      kpis: { title: "Ukazovatele spustení za obdobie" },
      runsTrend: { title: "Počet spustení v čase" },
      successTrend: { title: "Miera úspešnosti v priebehu času" },
      durationTrend: { title: "Trvanie v priebehu času" },
      attention: { title: "Vyžaduje pozornosť" },
      tasks: { title: "Úlohy" },
      recentRuns: { title: "Posledné spustenia" },
      inFlight: { title: "Prebiehajúce spustenie" },
      watchdog: { title: "Stav dohľadu nad úlohami" },
      failuresByTask: { title: "Neúspešné spustenia podľa úlohy" },
      tasksWithFailures: { title: "Úlohy so zlyhaniami" },
      disabledIncluded: { title: "Zahrnuté aj vypnuté úlohy" },
      taskOptions: { title: "Možnosti úlohy" },
    },
    errors: {
      server: {
        title: "Chyba servera",
        description: "Stav úloh sa nepodarilo načítať.",
      },
      validation: {
        title: "Neplatná požiadavka",
        description: "Skontrolujte vybrané obdobie a hodnoty filtrov.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť stav úloh, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Na zobrazenie stavu úloh nemáte oprávnenie.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Tomuto ID nezodpovedá žiadna úloha.",
      },
      conflict: {
        title: "Konflikt",
        description: "Žiadosť je v rozpore so súčasným stavom",
      },
      network: {
        title: "Chyba siete",
        description: "Služba na sledovanie stavu úloh je nedostupná.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítaní stavu úloh nastala chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv zmeny uložte alebo zahoďte.",
      },
    },
    success: {
      title: "Stav úloh sa načítal",
      description: "Prehľad stavu úloh je pripravený.",
    },
  },

  widget: {
    stabilityPeriod: "Stabilita sa počíta za vybrané obdobie.",
    watchdogBanner:
      "Aktuálny stav dohľadu nad úlohami: {{state}}. Kým dohľad znova úspešne neprebehne, údaje o uviaznutých a omeškaných úlohách môžu byť neaktuálne.",
    inFlight: {
      title: "Prebieha",
      line: "Spustené pred {{age}}. Za uviaznuté sa považuje po {{limit}} (časový limit {{timeout}} a dodatočná lehota).",
      stuck: "po prekročení limitu dohľadu",
      run: "spustenie",
      noRun: "Chýba záznam o spustení.",
    },
    title: "Stav úloh",
    viewTasks: "Úlohy",
    viewHistory: "História spustení",
    refresh: "Obnoviť",
    now: "Aktuálne",
    inPeriod: "V období",
    allHealthy: "Všetky zapnuté úlohy sú v poriadku. Počet: {{count}}.",
    tile: {
      failing: "Zlyháva",
      failingHint: "Zapnuté úlohy, ktorých posledné spustenie zlyhalo",
      stuck: "Zaseknuté",
      stuckHint: "Prekročený časový limit",
      overdue: "Po termíne",
      overdueHint: "Naplánované spustenie sa neuskutočnilo",
      flaky: "Nestabilné",
      flakyHint: "Úspešnosť za obdobie je nižšia ako 80 %",
      flakyRecovering: "Ďalšie úlohy, ktoré sa obnovujú: {{count}}",
      neverRan: "Zatiaľ nespustené",
      neverRanHint: "Zapnuté úlohy bez jediného spustenia",
      disabled: "Vypnuté",
      disabledHint: "Bez poruchy, iba vypnuté",
      disabledOrphans: "Úlohy bez vlastníka spustenia: {{count}}",
      parked: "Odstavené",
      parkedHint: "Jednorazové úlohy a vypnuté úlohy bez spustenia sú skryté.",
      parkedShownHint:
        "Jednorazové úlohy a vypnuté úlohy bez spustenia sú zobrazené.",
      lowData: "Málo údajov",
      lowDataHint: "Zlyhania pri menej ako 3 dokončených spusteniach",
      timedOutExcluded:
        "Vylúčené spustenia s prekročeným časovým limitom: {{count}}",
      healthy: "V poriadku",
      healthyHint: "z celkového počtu zapnutých úloh ({{total}})",
      runs: "Spustenia",
      failedRuns: "Neúspešné spustenia",
      successRate: "Úspešnosť spustení",
      successRateHint: "Podiel úspešných spustení zo všetkých ukončených",
      tasksWithFailures: "Úlohy so zlyhaniami",
      tasksWithFailuresHint: "z celkového počtu spustených úloh ({{total}})",
      completedOnly: "Iba úspešne dokončené spustenia",
      noCompleted: "Zatiaľ sa nedokončilo žiadne spustenie.",
      recovering: "Obnovuje sa",
      recoveringHint: "Posledné tri spustenia opäť prebehli úspešne.",
      stuckDisabled: "Z toho na vypnutej úlohe: {{count}}",
      p50Duration: "Medián trvania",
      p95Duration: "95. percentil trvania",
    },
    attention: {
      title: "Vyžaduje pozornosť",
      subtitle: "Úlohy na preverenie",
      empty:
        "Žiadne úlohy nezlyhávajú, neuviazli, nemeškajú, nevykazujú nestabilitu ani sa nezotavujú po chybe.",
      lastError: "Posledná chyba",
      noError: "Nezaznamenalo sa žiadne chybové hlásenie.",
      failedAgo: "{{status}}, pred {{age}}",
      runningFor:
        "Trvá už {{age}}. Za uviaznuté sa považuje po {{limit}} (časový limit {{timeout}} a dodatočná lehota).",
      missed: "Omeškanie: {{due}}. Posledné spustenie: {{last}}.",
      lastNever: "nikdy",
      lastAgo: "pred {{age}}",
      streak: "Po sebe idúce zlyhania za celý čas: {{count}}",
      failuresInPeriod: "Neúspešné spustenia za obdobie: {{count}}",
      flakyDetail:
        "Úspešnosť za obdobie: {{rate}}. Počet ukončených spustení: {{runs}}.",
      recoveringDetail:
        "Posledné spustenia bez chyby: {{count}}. Úspešnosť za obdobie: {{rate}}. Počet ukončených spustení: {{runs}}.",
      neverCompleted: "doteraz bez dokončeného spustenia",
      disabledToo: "vypnuté",
      openFailures: "Neúspešné spustenia",
      openRuns: "Všetky spustenia",
      openRunning: "Prebiehajúce spustenie",
      orphaned: "spustenie bez nadväznosti na aktívnu úlohu, úloha je vypnutá",
    },
    chart: {
      showTrends: "Zobraziť trendy",
      hideTrends: "Skryť trendy",
      runs: "Spustenia",
      runsSubtitle: "Výberom stĺpca zobrazíte spustenia za dané obdobie.",
      completed: "Dokončené",
      failed: "Zlyhalo",
      other: "Iné",
      successRate: "Miera úspešnosti",
      successRateSubtitle:
        "Podiel úspešných spustení zo všetkých ukončených. Dni bez spustení zostávajú prázdne.",
      duration: "Trvanie",
      durationSubtitle:
        "Medián a 95. percentil trvania dokončených spustení. Dni bez spustení zostávajú prázdne.",
      durationSplitSubtitle:
        "Iba dokončené spustenia. Dni bez spustení zostávajú prázdne.",
      byTask: "Neúspešné spustenia podľa úlohy",
      byTaskSubtitle: "Päť hlavných úloh samostatne, ostatné spolu",
      otherTasks: "Iné úlohy",
      p50: "Medián",
      p95: "p95",
    },
    table: {
      title: "Podľa úloh",
      subtitle:
        "Najnaliehavejšie úlohy sú navrchu. Výberom úlohy zobrazíte históriu jej spustení.",
      dimension: "Úloha",
      runs: "Spustenia",
      failures: "Zlyhalo",
      successRate: "Úspech",
      p50: "Medián",
      lastRun: "Posledné spustenie",
      p95: "p95",
      trendCol: "Trend úspešnosti",
      state: "Stav",
      nextRun: "Ďalšie spustenie",
      orphaned: "spustenie bez aktívnej úlohy, začalo sa pred {{age}}",
      oneOff: "jednorazová úloha",
      last: "Posledný stav: {{status}}, pred {{age}}",
      lastNever: "Zatiaľ nespustené",
      next: "ďalšie spustenie o {{age}}",
      nextNone: "bez ďalšieho spustenia",
      runningTooLong: "trvá príliš dlho",
      skippedHint: "preskočené: nedostatok kreditov",
      failedCount: "Počet zlyhaní: {{count}}",
      lastLine: "Posledné spustenie: {{last}} · {{next}}",
      blocked: "čaká na dokončenie prebiehajúceho spustenia",
      trend: "úspech",
      nextNow: "termín je teraz",
      empty: "V tomto stave nie je žiadna úloha.",
    },
    filter: {
      showParked: "Zobraziť odstavené úlohy",
      hideParked: "Skryť odstavené úlohy",
      task: "Úloha",
      state: "Stav",
      allTasks: "Všetky úlohy",
      includeDisabled: "Zahrnúť vypnuté",
      scopeEnabled: "Iba zapnuté úlohy",
      scopeAll: "Zahrnuté aj vypnuté úlohy",
    },
    cli: {
      states: "Stavy",
      state: "Stav",
      runId: "spustenie",
      trendHeader: "OBDOBIE | UKONČENÉ | ÚSPEŠNOSŤ | MEDIÁN | P95",
      attention: "VYŽADUJE POZORNOSŤ",
      noAttention: "Žiadna úloha nevyžaduje pozornosť",
      daysHint: "Denné tabuľky: --days=true",
      drillRunning:
        "Otvoriť prebiehajúce spustenie: vibe cron-history --taskId={{id}} --status=status.running",
      byDay: "podľa dňa",
      runningOnTime: "Prebieha v časovom limite",
      scope:
        "Ukazovatele za obdobie zahŕňajú iba zapnuté úlohy. Pre zahrnutie vypnutých použite --includeDisabled=true.",
      parkedHidden:
        "Skryté odstavené úlohy: {{count}} (dokončené jednorazové a ešte nespustené vypnuté úlohy). Zobrazíte ich s --includeParked=true.",
      recentRuns: "Posledné spustenia ({{count}})",
      noRuns: "Zatiaľ žiadne záznamy o spustení",
      tasks: "Úlohy",
      header:
        "STAV | ÚLOHA | SPUSTENIA | ZLYHANIA | ÚSPECHY | MEDIÁN | P95 | POSLEDNÉ SPUSTENIE | ĎALŠIE SPUSTENIE",
      drill:
        "Podrobnosti: vibe cron-history --taskId=<id> --status=status.failed,status.error,status.timeout",
    },
    age: {
      justNow: "teraz",
      seconds: "{{n}} s",
      minutes: "{{n}} min",
      hours: "{{n}} h",
      days: "{{n}} d",
    },
  },
};
