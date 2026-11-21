import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Aufgabenverwaltung",

  errors: {
    fetchCronTaskStats: "Aufgabenstatus konnte nicht geladen werden: {{error}}",
  },

  enums: {
    taskHealth: {
      stuck: "Hängt",
      failing: "Fehlerhaft",
      overdue: "Überfällig",
      flaky: "Instabil",
      recovering: "Erholt sich",
      lowData: "Wenig Daten",
      running: "Läuft",
      neverRan: "Nie gelaufen",
      healthy: "Gesund",
      disabled: "Deaktiviert",
    },
    healthFilter: {
      all: "Alle Zustände",
      attention: "Handlungsbedarf",
    },
  },

  get: {
    title: "Aufgabenstatus",
    titleShort: "Aufgabenstatus",
    description:
      "Cron-Zustand auf einen Blick: fehlerhafte, hängende, überfällige, deaktivierte und nie gelaufene Aufgaben, Laufvolumen, Erfolgsquote und Laufzeit im Zeitverlauf. Klick auf eine Aufgabe öffnet ihren Laufverlauf.",
    tag: "Cron-Zustand",
    fields: {
      taskId: {
        title: "Aufgabe",
        description: "Bericht auf eine Aufgaben-ID beschränken",
      },
      health: {
        title: "Zustand",
        description:
          "Nur Aufgaben in diesem Zustand in der Tabelle zeigen (die Handlungsliste zeigt immer alle fehlerhaften, hängenden und überfälligen Aufgaben)",
      },
      includeDisabled: {
        title: "Deaktivierte Aufgaben einbeziehen",
        description:
          "Läufe deaktivierter Aufgaben in Kennzahlen und Diagrammen des Zeitraums mitzählen. Standardmäßig aus: alte Fehler einer abgeschalteten Aufgabe sagen nichts über den Zustand heute.",
      },
      days: {
        title: "Tagestabellen zeigen",
        description:
          "Die Aufschlüsselung pro Tag unter jedem Diagramm ausgeben (CLI). Standardmäßig aus: die Sparklines zeigen den Verlauf bereits.",
      },
      includeParked: {
        title: "Geparkte Aufgaben zeigen",
        description:
          "Abgeschlossene Einmal-Aufgaben und deaktivierte, nie gelaufene Aufgaben einbeziehen. Standardmäßig ausgeblendet.",
      },
    },
    response: {
      generatedAt: { title: "Stand" },
      window: { title: "Zeitraum" },
      summary: { title: "Aufgabenzustände jetzt" },
      kpis: { title: "Laufkennzahlen im Zeitraum" },
      runsTrend: { title: "Läufe im Zeitverlauf" },
      successTrend: { title: "Erfolgsquote im Zeitverlauf" },
      durationTrend: { title: "Laufzeit im Zeitverlauf" },
      attention: { title: "Handlungsbedarf" },
      tasks: { title: "Aufgaben" },
      recentRuns: { title: "Letzte Läufe" },
      inFlight: { title: "Laufender Lauf" },
      watchdog: { title: "Watchdog-Zustand" },
      failuresByTask: { title: "Fehlläufe nach Aufgabe" },
      tasksWithFailures: { title: "Aufgaben mit Fehlern" },
      disabledIncluded: { title: "Deaktivierte Aufgaben einbezogen" },
      taskOptions: { title: "Aufgabenauswahl" },
    },
    errors: {
      server: {
        title: "Serverfehler",
        description: "Aufgabenstatus konnte nicht geladen werden",
      },
      validation: {
        title: "Ungültige Anfrage",
        description: "Zeitraum und Filter prüfen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden, um den Aufgabenstatus zu sehen",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Kein Zugriff auf den Aufgabenstatus",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Aufgabe mit dieser ID",
      },
      conflict: {
        title: "Konflikt",
        description: "Die Anfrage widerspricht dem aktuellen Zustand",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Aufgabenstatus nicht erreichbar",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Beim Laden des Aufgabenstatus ging etwas schief",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern oder verwerfen",
      },
    },
    success: {
      title: "Aufgabenstatus geladen",
      description: "Der Bericht zum Aufgabenstatus ist bereit",
    },
  },

  widget: {
    watchdogBanner:
      "Der Aufgaben-Watchdog selbst ist {{state}}. Urteile zu hängenden und überfälligen Aufgaben können veraltet sein, bis er wieder sauber läuft.",
    inFlight: {
      title: "Läuft gerade",
      line: "Gestartet vor {{age}} · hängt ab {{limit}} (Timeout {{timeout}} + Puffer)",
      stuck: "über dem Watchdog-Limit",
      run: "Lauf",
      noRun: "kein Ausführungseintrag gespeichert",
    },
    title: "Aufgabenstatus",
    viewTasks: "Aufgaben",
    viewHistory: "Laufverlauf",
    refresh: "Aktualisieren",
    now: "Jetzt",
    inPeriod: "Im Zeitraum",
    allHealthy: "Alle {{count}} aktiven Aufgaben gesund",
    tile: {
      failing: "Fehlerhaft",
      failingHint: "Aktiv, letzter Lauf fehlgeschlagen",
      stuck: "Hängt",
      stuckHint: "Läuft über Timeout",
      overdue: "Überfällig",
      overdueHint: "Geplanten Lauf verpasst",
      flaky: "Instabil",
      flakyHint: "Unter 80 % Erfolg im Zeitraum",
      flakyRecovering: "{{count}} weitere erholen sich",
      neverRan: "Nie gelaufen",
      neverRanHint: "Aktiv, nie gestartet",
      disabled: "Deaktiviert",
      disabledHint: "Abgeschaltet, nicht kaputt",
      disabledOrphans: "{{count}} mit verwaistem Lauf",
      parked: "Geparkt",
      parkedHint: "Einmalige und nie gelaufene deaktivierte, ausgeblendet",
      parkedShownHint: "Einmalige und nie gelaufene deaktivierte, sichtbar",
      lowData: "Wenig Daten",
      lowDataHint: "Fehler, unter 3 beendeten Läufen",
      timedOutExcluded: "Ohne {{count}} Timeout-Läufe",
      healthy: "Gesund",
      healthyHint: "von {{total}} aktiven",
      runs: "Läufe",
      failedRuns: "Fehlläufe",
      successRate: "Erfolgsquote (der Läufe)",
      successRateHint: "Erfolgreich von beendeten Läufen",
      tasksWithFailures: "Aufgaben mit Fehlern",
      tasksWithFailuresHint: "von {{total}} gelaufenen Aufgaben",
      completedOnly: "Nur erfolgreiche Läufe",
      noCompleted: "Kein erfolgreicher Lauf",
      recovering: "Erholt sich",
      recoveringHint: "Wieder sauber, letzte 3 Läufe erfolgreich",
      stuckDisabled: "{{count}} auf deaktivierter Aufgabe",
      p50Duration: "Median-Laufzeit",
      p95Duration: "p95-Laufzeit",
    },
    attention: {
      title: "Handlungsbedarf",
      subtitle:
        "Fehlerhafte, hängende, instabile und überfällige Aufgaben. Diese zuerst beheben.",
      empty: "Nichts fehlerhaft, hängend oder überfällig.",
      lastError: "Letzter Fehler",
      noError: "Keine Fehlermeldung gespeichert",
      failedAgo: "{{status}} vor {{age}}",
      runningFor:
        "Läuft seit {{age}} · hängt ab {{limit}} (Timeout {{timeout}} + Puffer)",
      missed: "Fällig vor {{due}}, letzter Lauf {{last}}",
      lastNever: "nie",
      lastAgo: "vor {{age}}",
      streak: "{{count}} Fehler in Folge (gesamt)",
      failuresInPeriod: "{{count}} Fehlläufe im Zeitraum",
      flakyDetail: "{{rate}} Erfolg bei {{runs}} beendeten Läufen im Zeitraum",
      recoveringDetail:
        "letzte {{count}} Läufe erfolgreich · {{rate}} Erfolg bei {{runs}} beendeten Läufen im Zeitraum",
      neverCompleted: "noch nie abgeschlossen",
      disabledToo: "deaktiviert",
      openFailures: "Fehlläufe",
      openRuns: "Alle Läufe",
      openRunning: "Laufender Lauf",
      orphaned: "verwaister Lauf, Aufgabe deaktiviert",
    },
    chart: {
      runs: "Läufe",
      runsSubtitle: "Klick auf einen Balken zeigt die Läufe dieses Zeitraums",
      completed: "Erfolgreich",
      failed: "Fehlgeschlagen",
      other: "Sonstige",
      successRate: "Erfolgsquote",
      successRateSubtitle:
        "Erfolgreich von beendeten Läufen. Tage ohne Lauf bleiben leer.",
      duration: "Laufzeit",
      durationSubtitle:
        "Median und p95 erfolgreicher Läufe. Tage ohne Lauf bleiben leer.",
      durationSplitSubtitle:
        "Nur erfolgreiche Läufe. Tage ohne Lauf bleiben leer.",
      byTask: "Fehlläufe nach Aufgabe",
      byTaskSubtitle: "Top 5 Aufgaben, Rest zusammengefasst",
      otherTasks: "Andere Aufgaben",
      p50: "Median",
      p95: "p95",
    },
    table: {
      title: "Pro Aufgabe",
      subtitle: "Dringendste zuerst. Klick öffnet den Laufverlauf.",
      dimension: "Aufgabe",
      runs: "Läufe",
      failures: "Fehler",
      successRate: "Erfolg",
      p50: "Median",
      lastRun: "Letzter Lauf",
      p95: "p95",
      trendCol: "Erfolgstrend",
      state: "Zustand",
      nextRun: "Nächster Lauf",
      orphaned: "verwaister Lauf, gestartet vor {{age}}",
      oneOff: "einmalig",
      last: "Zuletzt {{status}} vor {{age}}",
      lastNever: "Nie gelaufen",
      next: "nächster in {{age}}",
      nextNone: "kein nächster Lauf",
      runningTooLong: "läuft zu lange",
      skippedHint: "übersprungen: zu wenig Credits",
      failedCount: "{{count}} fehlgeschlagen",
      lastLine: "Letzter Lauf: {{last}} · {{next}}",
      blocked: "blockiert durch laufenden Lauf",
      trend: "Erfolg",
      nextNow: "jetzt fällig",
      empty: "Keine Aufgabe in diesem Zustand.",
    },
    filter: {
      task: "Aufgabe",
      state: "Zustand",
      allTasks: "Alle Aufgaben",
      includeDisabled: "Deaktivierte einbeziehen",
      scopeEnabled: "Nur aktive Aufgaben",
      scopeAll: "Deaktivierte einbezogen",
    },
    cli: {
      states: "Zustände",
      state: "Zustand",
      runId: "Lauf",
      trendHeader: "ZEITRAUM | BEENDET | ERFOLG | MEDIAN | P95",
      attention: "HANDLUNGSBEDARF",
      noAttention: "Handlungsbedarf: keiner",
      daysHint: "Tagestabellen: --days=true",
      drillRunning:
        "Laufenden Lauf öffnen: vibe cron-history --taskId={{id}} --status=status.running",
      byDay: "pro Tag",
      runningOnTime: "Läuft im Zeitrahmen",
      scope:
        "Kennzahlen im Zeitraum: nur aktive Aufgaben. Deaktivierte einbeziehen: --includeDisabled=true",
      parkedHidden:
        "{{count}} geparkte Aufgaben ausgeblendet (abgeschlossene Einmal-Aufgaben, nie gelaufene deaktivierte). Anzeigen: --includeParked=true",
      recentRuns: "Letzte {{count}} Läufe",
      noRuns: "Keine Läufe erfasst",
      tasks: "Aufgaben",
      header:
        "ZUSTAND | AUFGABE | LÄUFE | FEHLER | ERFOLG | MEDIAN | P95 | LETZTER LAUF | NÄCHSTER LAUF",
      drill:
        "Details: vibe cron-history --taskId=<id> --status=status.failed,status.error,status.timeout",
    },
    age: {
      justNow: "jetzt",
      seconds: "{{n}} s",
      minutes: "{{n}} Min.",
      hours: "{{n}} Std.",
      days: "{{n}} T.",
    },
  },
};
