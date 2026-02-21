import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Hilfe & Dokumentation",
  tag: "Hilfe",
  get: {
    title: "Tool-Hilfe — Verfügbare Tools entdecken",
    description:
      "Durchsuchen und entdecken Sie alle verfügbaren Tools. Verwenden Sie query für die Suche, category für die Filterung.",
    tags: {
      tools: "tools",
    },
    fields: {
      query: {
        label: "Suchanfrage",
        description:
          "Tools nach Name, Beschreibung, Alias oder Tag durchsuchen. Sucht in allen Sprachen.",
        placeholder: "z.B. Suche, Speicher, Abruf...",
      },
      category: {
        label: "Kategoriefilter",
        description: "Tools nach Kategoriename filtern",
      },
      toolName: {
        label: "Tool-Name (Detail)",
        description: "Vollständige Details für ein bestimmtes Tool abrufen.",
      },
      page: {
        label: "Seite",
        description: "Seitenzahl für paginierte Ergebnisse (Standard: 1)",
        title: "Aktuelle Seitenzahl",
      },
      pageSize: {
        label: "Seitengröße",
        description:
          "Anzahl der Ergebnisse pro Seite. KI/MCP Standard: 25. Web/CLI Standard: 200.",
        title: "Effektive Seitengröße",
      },
      tools: {
        title: "Verfügbare Tools",
      },
      totalCount: {
        title: "Gesamtanzahl der Tools",
      },
      matchedCount: {
        title: "Anzahl übereinstimmender Tools",
      },
      categories: {
        title: "Tool-Kategorien",
      },
      hint: {
        title: "Verwendungshinweis",
      },
      currentPage: {
        title: "Aktuelle Seite",
      },
      effectivePageSize: {
        title: "Effektive Seitengröße",
      },
      totalPages: {
        title: "Gesamtanzahl Seiten",
      },
      parameters: {
        title: "Parameter",
      },
      aliases: {
        title: "Aliase",
      },
      openTool: {
        label: "Tool öffnen",
      },
    },
    success: {
      title: "Tools erfolgreich abgerufen",
      description: "Verfügbare Tools wurden abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung für Tools",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Tools-Endpunkt nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Tools konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Beim Abrufen der Tools ist ein Konflikt aufgetreten",
      },
    },
  },
  interactive: {
    post: {
      title: "Interaktiver Modus",
      description:
        "Interaktiven Datei-Explorer-Modus zum Navigieren und Ausführen von Routen starten",
      category: "System-Hilfe",
      tags: {
        system: "System",
        help: "Hilfe",
      },
      summary: "Interaktiven Modus starten",
    },
    ui: {
      title: "Interaktiver API-Explorer",
      description: "Durchsuchen und ausführen alle",
      availableEndpoints: "verfügbare Endpunkte",
      endpointsLabel: "Endpunkte",
      aliasesLabel: "Aliase:",
      selectEndpoint:
        "Wählen Sie einen Endpunkt aus der Liste aus, um zu beginnen",
    },
    response: {
      started: "Interaktiver Modus erfolgreich gestartet",
    },
    errors: {
      cliOnly: {
        title: "Nur CLI",
        description: "Interaktiver Modus ist nur über CLI verfügbar",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für interaktiven Modus erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interaktiver Modus konnte nicht gestartet werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Interaktiver Modus erfolgreich gestartet",
    },
    grouping: {
      category: "Kategorie",
      tags: "Tags",
      path: "Pfad",
    },
  },
  post: {
    title: "Hilfeinformationen anzeigen",
    description: "Hilfeinformationen über CLI-Befehle anzeigen",
    form: {
      title: "Hilfe-Optionen",
      description: "Hilfe für bestimmte Befehle oder allgemeine Verwendung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Hilfe-Parameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Hilfeinformationen konnten nicht abgerufen werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Hilfe anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Hilfe anzuzeigen",
      },
      notFound: {
        title: "Befehl nicht gefunden",
        description: "Der angegebene Befehl wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Hilfeinformationen konnten nicht generiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Generieren der Hilfe aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Hilfe-Generierungskonflikt erkannt",
      },
    },
    success: {
      title: "Hilfe generiert",
      description: "Hilfeinformationen erfolgreich generiert",
    },
  },
  fields: {
    command: {
      label: "Befehl",
      description:
        "Spezifischer Befehl, für den Hilfe angezeigt werden soll (leer lassen für allgemeine Hilfe)",
      placeholder: "z.B. check, list, db:ping",
    },
    header: {
      title: "Kopfzeile",
      description: "Kopfzeilenbeschreibung",
    },
    title: {
      label: "Titel",
    },
    description: {
      label: "Beschreibung",
    },
    usage: {
      title: "Verwendung",
      patterns: {
        item: "Muster",
      },
    },
    commonCommands: {
      title: "Häufige Befehle",
      items: "Befehle",
      command: "Befehl",
      description: "Beschreibung",
    },
    options: {
      title: "Optionen",
      items: "Optionen",
      flag: "Flag",
      description: "Beschreibung",
    },
    examples: {
      title: "Beispiele",
      items: "Beispiele",
      command: "Befehl",
      description: "Beschreibung",
    },
    details: {
      title: "Details",
      category: {
        content: "Kategorie",
      },
      path: {
        content: "Pfad",
      },
      method: {
        content: "Methode",
      },
      aliases: {
        content: "Aliase",
      },
    },
  },
  list: {
    post: {
      title: "Verfügbare Befehle auflisten",
      description:
        "Zeigt alle verfügbaren CLI-Befehle mit Beschreibungen und Aliasen an",
      form: {
        title: "Befehlslisten-Optionen",
        description: "Konfigurieren Sie, wie Befehle angezeigt werden",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Listenbefehl-Parameter",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Befehlsliste konnte nicht abgerufen werden",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie sind nicht berechtigt, Befehle aufzulisten",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, Befehle aufzulisten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Befehlsliste nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Befehlsliste konnte nicht generiert werden",
          errorLoading: "Fehler beim Laden der Befehle: {{error}}",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Auflisten der Befehle aufgetreten",
        },
        conflict: {
          title: "Konflikt",
          description: "Befehlslisten-Konflikt erkannt",
        },
      },
      success: {
        title: "Befehle aufgelistet",
        description: "Befehlsliste erfolgreich abgerufen",
      },
    },
    tag: "Hilfe",
    fields: {
      category: {
        label: "Nach Kategorie filtern",
        description: "Nur Befehle in dieser Kategorie anzeigen",
        placeholder: "z.B. system, database, user",
      },
      format: {
        label: "Ausgabeformat",
        description: "Wie die Befehlsliste angezeigt werden soll",
        options: {
          tree: "Baumansicht (verschachtelte Hierarchie)",
          flat: "Flache Liste (einfache Auflistung)",
          json: "JSON-Format (zum Parsen)",
        },
      },
      showAliases: {
        label: "Aliase anzeigen",
        description: "Alle verfügbaren Befehlsaliase anzeigen",
      },
      showDescriptions: {
        label: "Beschreibungen anzeigen",
        description: "Befehlsbeschreibungen in die Ausgabe einbeziehen",
      },
      success: {
        label: "Erfolg",
      },
      totalCommands: {
        label: "Gesamtanzahl der Befehle",
        description: "Anzahl der verfügbaren Befehle",
      },
      commandsText: {
        label: "Verfügbare Befehle",
        description: "Formatierte Liste aller verfügbaren Befehle",
      },
      commands: {
        alias: "Befehlsalias",
        message: "Befehlsnachricht",
        description: "Befehlsbeschreibung",
        category: "Befehlskategorie",
        aliases: "Befehlsaliase",
        rule: "Befehlsregel",
      },
    },
    response: {
      commands: {
        title: "Verfügbare Befehle",
        emptyState: {
          description: "Keine Befehle gefunden",
        },
        alias: "Befehl",
        path: "API-Pfad",
        method: "HTTP-Methode",
        category: "Kategorie",
        description: "Beschreibung",
        aliases: "Aliase",
      },
    },
  },
};
