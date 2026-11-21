import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "System",

  errors: {
    repositoryInternalError: "Ein interner Fehler ist aufgetreten",
    fetchErrorLogs:
      "Fehlerprotokolle konnten nicht abgerufen werden: {{error}}",
    updateErrorLog:
      "Status des Fehlerprotokolls konnte nicht aktualisiert werden: {{error}}",
    missingTarget: "Fingerprint oder ID angeben.",
    idNotUnique:
      "ID-Präfix {{id}} trifft {{count}} Zeilen. Fingerprint oder volle ID nutzen.",
  },

  statusFilter: {
    all: "Alle",
    active: "Offen",
    resolved: "Gelöst",
  },
  levelFilter: {
    all: "Alle Level",
    error: "Fehler",
    warn: "Warnungen",
  },
  sourceFilter: {
    all: "Alle Quellen",
    client: "Browser",
    server: "Server",
  },
  trendSplit: {
    newVsRecurring: "Neu vs. wiederkehrend",
    level: "Level",
    source: "Quelle",
  },
  sort: {
    windowOccurrences: "Meiste Treffer im Zeitraum",
    lastSeen: "Zuletzt gesehen",
    firstSeen: "Neueste",
    totalOccurrences: "Meiste Treffer gesamt",
  },

  get: {
    title: "Fehlerprotokolle",
    titleShort: "Fehlerprotokolle",
    description:
      "Fehlerklassen mit exakter Zahl offener Fälle, Vorkommen im Zeitverlauf, größten Verursachern und betroffenen Nutzern. Filter nach Zeitraum, Status, Level, Quelle, Endpunkt oder Text; Lösen mit einem Klick.",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      group: {
        label: "Ähnliche bündeln",
        description:
          "Eine Zeile pro Meldung: Varianten auf verschiedenen Routen zählen zusammen",
      },
      status: {
        label: "Status",
        description: "Nach Lösungsstatus filtern",
      },
      search: {
        label: "Fehler suchen",
        description:
          "Fehlermeldungen, Fingerabdrücke oder Protokoll-IDs suchen",
        placeholder:
          "Fehlermeldungen, Fingerabdrücke oder Protokoll-IDs suchen",
      },
      errorType: {
        label: "Fehlertyp",
        description: "Nach Fehlertypklassifizierung filtern",
        placeholder: "z.B. INTERNAL_ERROR",
      },
      level: {
        label: "Level",
        description: "Fehler oder Warnungen",
      },
      source: {
        label: "Quelle",
        description: "Im Browser (Client-Log) oder auf dem Server ausgelöst",
      },
      endpoint: {
        label: "Endpunkt oder Route",
        description: "Endpunktpfad, Alias oder Seitenroute enthält diesen Text",
        placeholder: "z.B. payment/providers",
      },
      fingerprint: {
        label: "Fingerprint",
        description: "Nur eine Fehlerklasse zeigen",
        placeholder: "Fingerprint",
      },
      split: {
        label: "Diagrammaufteilung",
        description: "Wie das Vorkommen-Diagramm stapelt",
      },
      sort: {
        label: "Sortierung",
        description: "Reihenfolge der Liste",
      },
      limit: {
        label: "Limit",
        description: "Anzahl der zurückzugebenden Ergebnisse",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Anzahl der zu überspringenden Ergebnisse",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Fehlerprotokolleinträge",
      },
      totalCount: {
        title: "Gesamtanzahl",
      },
      hasMore: {
        title: "Mehr vorhanden",
      },
      unresolvedCount: {
        title: "Offene Fehler",
      },
      window: {
        title: "Zeitraum",
      },
      kpis: {
        title: "Kennzahlen",
      },
      trend: {
        title: "Vorkommen im Zeitverlauf",
      },
      byEndpoint: {
        title: "Nach Endpunkt",
      },
      historySince: {
        title: "Historie seit",
      },
    },
    success: {
      title: "Protokolle abgerufen",
      description: "Fehlerprotokolle erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Protokolle gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlerprotokolle konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        titleChanges: "Nicht gespeicherte Änderungen",
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
  },

  patch: {
    title: "Fehlerprotokoll aktualisieren",
    titleShort: "Protokoll aktualisieren",
    description:
      "Ein Fehlerprotokoll nach Fingerprint lösen oder wieder öffnen",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      similarTo: {
        label: "Gleiche Meldung wie",
        description:
          "Alle Klassen mit derselben Meldung wie dieser Fingerprint lösen oder öffnen",
      },
      fingerprints: {
        label: "Fingerprints",
        description:
          "Mehrere Fingerprints auf einmal (gesammelt lösen oder öffnen, max. 200)",
      },
      fingerprint: {
        label: "Fingerprint",
        description:
          "Der Fingerprint des Fehlerprotokolls (Spalte `fingerprint` in der Liste). Diesen oder die ID angeben.",
        placeholder: "Fingerprint eingeben",
      },
      id: {
        label: "Log-ID",
        description:
          "Die Zeilen-ID aus der Liste (volle UUID oder die ersten 8+ Zeichen). Alternative zum Fingerprint.",
        placeholder: "z. B. c21bd4c7",
      },
      resolved: {
        label: "Gelöst",
        description: "Auf wahr setzen zum Lösen, falsch zum Wieder-Öffnen",
      },
    },
    response: {
      fingerprint: {
        title: "Fingerprint",
      },
      resolved: {
        title: "Gelöst",
      },
      affectedRows: {
        title: "Betroffene Zeilen",
      },
    },
    success: {
      title: "Protokoll aktualisiert",
      description: "Status des Fehlerprotokolls erfolgreich aktualisiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Fehlerprotokoll nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlerprotokoll konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        titleChanges: "Ungespeicherte Änderungen",
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Datenkonflikt ist aufgetreten",
      },
    },
  },

  post: {
    title: "Fehlermonitor-Scan ausführen",
    description:
      "Chat-Nachrichten und Backend-Protokolle auf Fehlermuster scannen",
    tags: {
      monitoring: "Überwachung",
    },
    response: {
      errorsFound: "Fehler gefunden",
      threadsScanned: "Threads gescannt",
      scanWindowFrom: "Scan-Fenster von",
      scanWindowTo: "Scan-Fenster bis",
      patterns: "Fehlermuster",
    },
    success: {
      title: "Scan abgeschlossen",
      description: "Fehlermonitor-Scan erfolgreich abgeschlossen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlermonitor-Scan fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
  },

  errorMonitor: {
    name: "Fehlermonitor",
    description: "Scannt alle 3 Stunden nach Fehlermustern",
  },

  widget: {
    kpi: {
      unresolvedMessages: "{{messages}} Meldungen · {{occurrences}} Vorkommen",
      unresolvedMatching: "{{count}} offene passen zu den Filtern",
      unresolved: "Offene Klassen (gesamt)",
      unresolvedHint: "{{occurrences}} Treffer insgesamt",
      unresolvedOutside: "{{count}} nicht in diesem Zeitraum gesehen",
      occurrences: "Vorkommen",
      newClasses: "Neue Klassen",
      activeClasses: "Betroffene Klassen",
      affectedUsers: "Betroffene Nutzer",
      affectedLeads: "Betroffene Besucher",
    },
    chart: {
      noEndpoint: "Kein Endpunkt erfasst",
      emptyFiltered:
        "Keine Vorkommen passen in diesem Zeitraum zu den Filtern.",
      trendTitle: "Vorkommen",
      trendSubtitle: "Balken anklicken, um den Zeitraum einzugrenzen",
      endpointTitle: "Wo es bricht",
      endpointSubtitle:
        "Endpunkte und Routen nach Vorkommen. Zeile anklicken zum Filtern.",
      endpoint: "Endpunkt / Route",
      occurrences: "Vorkommen",
      classes: "Klassen",
      unresolved: "Offen",
      historyNote:
        "Tageshistorie ab {{date}}. Frühere Treffer zählen nur in den Gesamtwerten.",
      historyNone:
        "Noch keine Tageshistorie erfasst. Die Summen pro Klasse sind trotzdem exakt.",
    },
    series: {
      new: "Neu",
      recurring: "Wiederkehrend",
      error: "Fehler",
      warn: "Warnungen",
      client: "Browser",
      server: "Server",
    },
    list: {
      viewGroup: "{{count}} ansehen",
      noSession: "Ohne Sitzungskontext",
      cliAct:
        "Aktion: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Status: {{status}}",
      groupSize: "{{count}} Klassen",
      resolveGroup: "Alle {{count}} lösen",
      reopenGroup: "Alle {{count}} öffnen",
      groupHint: "Nach Meldung gebündelt",
      subtitleGrouped: "{{count}} Meldungen in diesem Zeitraum",
      bulkResolveOf: "{{shown}} von {{total}} Treffern lösen",
      cliGroup:
        '{{count}} Klassen. Auflisten: vibe error-logs --group=false --search="{{search}}" · Alle bearbeiten: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Nichts Offenes passt zu diesen Filtern.",
      allClearHint: "Filter zurücksetzen, um den Rest zu sehen.",
      similar: "+{{count}} ähnliche",
      cliFilters:
        "Filter (Werte sind die gezeigten Enum-Schlüssel): --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<Text> --search=<Text>. Gesammelt: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} weitere",
      doneResolved: "Gelöst: {{label}}",
      doneReopened: "Wieder offen: {{label}}",
      doneResolvedMany: "{{count}} Klassen gelöst",
      doneReopenedMany: "{{count}} Klassen wieder offen",
      undo: "Rückgängig",
      dismiss: "Ausblenden",
      bulkResolve: "Alle {{count}} angezeigten lösen",
      bulkConfirm: "Bestätigen: {{count}} lösen",
      cliHits: "{{period}} im Zeitraum / {{total}} gesamt",
      resolveFailed: "Nicht gespeichert. Erneut versuchen.",
      cliResolve:
        "Aktion: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Lösen: vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Details: --fingerprint=<fingerprint>. Nächste Seite: --offset={{next}}",
      title: "Fehlerklassen",
      subtitle: "{{count}} in diesem Zeitraum gesehen",
      hitsPeriod: "{{count}} im Zeitraum",
      hitsTotal: "{{count}} gesamt",
      users: "Nutzer {{count}}",
      leads: "Besucher {{count}}",
      firstSeen: "zuerst {{date}}",
      lastSeen: "zuletzt {{date}}",
      open: "Details",
      close: "Ausblenden",
      focus: "Nur diese",
      affected: "Betroffene Nutzer",
      affectedLeads: "Betroffene Besucher",
      resolving: "Speichert...",
    },
    filter: {
      fingerprint: "Klasse",
      endpoint: "Endpunkt",
      search: "Suche",
      errorType: "Typ",
      status: "Status",
      level: "Level",
      source: "Quelle",
    },
    emptyFiltered:
      "Keine Fehlergruppe passt zu diesen Filtern. Entferne einen Filter und suche erneut.",
    emptyActive:
      "Keine aktiven Fehlergruppen. Wähle „Alle“, um behobene Fehler zu sehen.",
    severity: {
      error: "Fehler",
      warning: "Warnung",
    },
    title: "Fehlerprotokolle",
    loading: "Protokolle werden geladen...",
    empty: "Keine Fehlerprotokolle gefunden",
    header: {
      refresh: "Aktualisieren",
      runScan: "Scan starten",
      back: "Zurück",
      activeCount: "{{count}} insgesamt offen",
    },
    col: {
      message: "Nachricht",
      errorType: "Fehlertyp",
      occurrences: "Vorkommen",
      firstSeen: "Erstmals aufgetreten",
      createdAt: "Zuletzt aufgetreten",
    },
    status: {
      active: "Offen",
      resolved: "Gelöst",
    },
    action: {
      confirm: "Status speichern",
      clear: "Filter zurücksetzen",
      resolve: "Lösen",
      reopen: "Wieder öffnen",
    },
    detail: {
      context: "Fehlerdetails",
      stackTrace: "Stack-Trace",
      metadata: "Metadaten",
      collapse: "Einklappen",
      resolved: "Gelöst",
    },
    source: {
      client: "Browser",
      server: "Server",
    },
    pagination: {
      matches: "{{count}} passende Gruppen",
      info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
      prev: "Zurück",
      next: "Weiter",
    },
  },
};
