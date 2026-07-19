import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Hilfe & Dokumentation",
  tag: "Hilfe",
  uncategorized: "Sonstige",
  get: {
    title: "Tool-Hilfe - Verfügbare Tools entdecken",
    titleShort: "Tool-Hilfe",
    description:
      "Durchsuchen und entdecken Sie alle verfügbaren Tools. Verwenden Sie query für die Suche, category für die Filterung.",
    tags: {
      tools: "tools",
    },
    fields: {
      interactive: {
        label: "Interaktiv",
        description: "Vollständigen interaktiven Tool-Browser öffnen",
      },
      query: {
        label: "Suchanfrage (optional)",
        description:
          "Tools nach Stichwort filtern. Leerzeichen-getrennte Wörter sind alle erforderlich. Sucht über Name, Aliase, Beschreibung, Tags - Name/Alias-Treffer werden höher gewichtet. Exakter Name/Alias-Treffer zeigt automatisch Volldetails. Leer lassen um alle anzuzeigen.",
        placeholder: "z.B. URL abrufen, Bildgenerator...",
      },
      category: {
        label: "Kategoriefilter",
        description:
          "Tools nach Kategorie oder Unterkategorie filtern (Groß-/Kleinschreibung egal). Akzeptiert Oberkategorie-Schlüssel (z.B. 'ai') oder Unterkategoriename (z.B. 'Search'). Leer lassen für Kategorieübersicht.",
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
      pinnedCount: {
        title: "Angeheftete Tools",
      },
      allowedCount: {
        title: "Erlaubte Tools",
      },
      webPinnedCount: {
        title: "Web-Pins",
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
      includeProdOnly: {
        label: "Produktions-Tools einschließen",
        description:
          "Wenn true, werden auch als produktions-only markierte Tools angezeigt (nur Admin).",
      },
      platform: {
        label: "Plattform",
        description:
          "Tools nach Plattform filtern (nur Admin). Zeigt Tools an, die auf der ausgewählten Plattform verfügbar sind.",
      },
      platforms: {
        title: "Verfügbare Plattformen",
      },
      viewAsRole: {
        label: "Ansicht als Rolle",
        description:
          "Zeigt, welche Tools für eine bestimmte Benutzerrolle sichtbar sind (nur Admin)",
        options: {
          admin: "Admin",
          customer: "Kunde",
          public: "Öffentlich",
        },
      },
      instanceId: {
        label: "Instanz-ID",
        description:
          "Filter auf Tools einer bestimmten Remote-Instanz. Gibt Tools aus dem gespeicherten Capability-Snapshot zurück.",
      },
      pinnedToolIds: {
        label: "Angeheftete Tool-IDs",
        description:
          "Optionale Liste von Tool-IDs, die der Benutzer angeheftet hat. Der Server filtert auf diese Tools, gibt aber weiterhin die vollständige Gesamtanzahl zurück.",
      },
      statsFilter: {
        label: "Tool-Filter",
        description: "Alle Tools, nur angeheftete oder nur erlaubte anzeigen",
      },
    },
    hints: {
      noCapabilitySnapshot:
        'Kein Capability-Snapshot für Instanz "{{instanceId}}". Verbindung herstellen und auf Sync-Puls warten.',
      remoteFullSchema:
        'Vollständiges Schema für {{count}} Tool(s) von "{{instanceId}}". Aufruf: execute-tool toolName="{{instanceId}}__<name>" input={...}.',
      remoteList:
        '{{matched}} von {{total}} Tools der Remote-Instanz "{{instanceId}}". Suche auf ≤{{detailThreshold}} Ergebnisse einschränken für vollständige Schemas oder toolName= übergeben.{{pagination}}',
      toolNotFound:
        'Tool "{{name}}" nicht gefunden. Mit query nach Stichworten suchen.',
      detailMode:
        'Aufruf: execute-tool toolName="{{name}}"{{aliases}}. CLI: vibe {{name}} [--feld=wert].',
      detailModeAliases: " (Aliase: {{aliases}})",
      noToolsMatched:
        "Keine Tools gefunden. Breitere Suche versuchen oder ohne Parameter aufrufen.",
      compactFullSchema:
        'Vollständiges Schema für {{count}} Tool(s). Aufruf: execute-tool toolName="<name>" input={...}.',
      compactCategoryOnly:
        '{{matched}} Tools in {{categories}} Kategorien. category="<name>" oder subCategory="<name>" verwenden. Unter {{listThreshold}} Ergebnisse zeigt Tool-Namen; unter {{detailThreshold}} vollständige Schemas.',
      compactList:
        '{{matched}} Tools. Auf ≤{{detailThreshold}} einschränken für Schemas oder toolName="<name>" für Details. Aufruf: execute-tool toolName="<name>".{{pagination}}',
      cliFullDetail:
        "Vollständige Details für {{count}} Tool(s). CLI: vibe <name> [--feld=wert].",
      cliList:
        "Seite {{page}}/{{total}} – {{matched}} Tools gefunden. Details: vibe help <name>.",
      cliListSingle: "{{matched}} Tools gefunden. Details: vibe help <name>.",
      pagination:
        " Seite {{page}}/{{total}} – page={{next}} für weitere Ergebnisse.",
      paginationCli: " – vibe help --page={{next}}",
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
  aiTools: {
    modal: {
      webPinnedLabel: "Web-Pins",
      webPinnedTooltip: "In der Seitenleiste angepinnte Tools",
      pinnedLabel: "angeheftet",
      pinnedTooltip:
        "Angeheftete Tools sind immer im Kontext - die KI sieht sie bei jedem Schritt",
      enabledLabel: "KI erlaubt",
      enabledTooltip:
        "KI-erlaubte Tools können auf Anfrage aufgerufen werden, wenn Hilfe aktiviert ist",
      totalLabel: "gesamt",
      totalTooltip: "Alle Tools anzeigen - klicken um Filter zu löschen",
      searchPlaceholder: "Tools suchen...",
      expandAll: "Alle erweitern",
      collapseAll: "Alle zusammenklappen",
      deselectAll: "Alle abwählen",
      selectAll: "Alle auswählen",
      resetToDefault: "Auf Standard zurücksetzen",
      loading: "Lädt...",
      noToolsFound: "Keine Tools gefunden",
      noToolsAvailable: "Keine KI-Tools verfügbar",
      legendActive: "Immer im Kontext (angeheftet)",
      legendConfirm: "Fragt vor dem Ausführen",
      legendWebPin: "In Seitenleiste angepinnt",
      stats: "{{pinned}} von {{total}} Tools angeheftet",
      activeOn: "Immer im KI-Kontext — ablösen für Abruf auf Anfrage",
      activeOff:
        "Nicht im Kontext — anheften um es bei jedem KI-Schritt einzubinden",
      confirmOn:
        "KI fragt vor dem Ausführen — klicken für automatische Freigabe",
      confirmOff:
        "Läuft ohne Nachfrage — klicken um deine Bestätigung zu erfordern",
      closeSidebar: "Tools-Seitenleiste schließen",
      selectTool: "Tool auswählen",
      selectToolHint: "Wähle ein Tool aus der Seitenleiste",
      allPlatforms: "Alle Plattformen",
      prodOnly: "Nur Prod",
      adminFilters: "Admin-Filter",
      resetPins: "Pins zurücksetzen",
      aiPinsTitle: "KI-Tool-Pins",
      aiPinsDescription:
        "Diese Tools sind in jedem KI-Gespräch aktiv. Die KI kann sie automatisch aufrufen — ohne explizite Aufforderung.",
      resetToDefaults: "Auf Standard zurücksetzen",
      noPinnedTools: "Noch keine angehefteten Tools",
      noPinnedToolsHint:
        "Durchsuche alle Tools und hefte jene an, die die KI nutzen soll",
      webPinsDescription:
        "Sidebar-Verknüpfungen. Schnellzugriff auf angeheftete Tools im Admin-Panel.",
      aiAllowedDescription:
        "Tools, die die KI bei Bedarf aufrufen darf. Alles hier kann aufgerufen werden, wenn die KI es für nötig hält.",
      noAllowedTools: "Keine erlaubten Tools",
    },

    platformFilter: {
      all: "Alle Plattformen",
      cli: "CLI",
      cliPackage: "CLI-Pkg",
      mcp: "MCP",
      ai: "KI",
      web: "Web",
      cron: "Cron",
      electron: "Desktop",
      frame: "Frame",
      skill: "Skill",
      nextPage: "Next Page",
      nextApi: "Next API",
    },
    envFilter: {
      development: "Entwicklung",
      production: "Produktion",
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
