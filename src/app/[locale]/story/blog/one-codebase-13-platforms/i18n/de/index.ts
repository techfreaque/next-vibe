import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Eine Codebase. 13 Plattformen. Ohne Kompromisse.",
    category: "Architektur",
    description:
      "Wie das Unified Surface-Prinzip drei Dateien in eine Web-App, einen CLI-Befehl, ein MCP-Tool, einen nativen Screen und einen Cron-Job verwandelt - automatisch.",
    imageAlt: "next-vibe Unified Surface Architektur",
    keywords:
      "next-vibe, unified surface, endpoint pattern, MCP, CLI, TypeScript, SaaS Framework, Full-Stack",
  },
  readingTime: "12 Min. Lesezeit",
  category: "Architektur",
  publishedDate: "März 2025",
  backToBlog: "Zurück zum Blog",

  hero: {
    eyebrow: "Das Unified Surface-Prinzip",
    title: "Eine Codebase. 13 Plattformen. Ohne Kompromisse.",
    subtitle:
      "Wie drei Dateien gleichzeitig zum Webformular, CLI-Befehl, MCP-Tool, nativen Screen und automatisierten Job werden.",
    fileBarLabel:
      "definition.ts → web · cli · mcp · native · cron · 10 weitere",
    theaCardTitle: "Wer ist Thea?",
    allowedRolesLabel: "allowedRoles: [...]",
    fileTreePath: "~/src/app/api/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5.802 TypeScript-Dateien. ~2,1 Millionen Zeilen. Null `any`. Null Runtime-Typfehler. Ein Pattern. 374-mal wiederholt.",
    para1:
      "Das ist die Codebase hinter {{appName}} - und das Framework dahinter, next-vibe. Dieselbe Architektur betreibt eine Web-App, eine Mobile-App, eine CLI, ein KI-Agent-Interface, einen MCP-Server, ein Cron-System, einen WebSocket-Event-Bus und eine Live-Datenfluss-Engine.",
    para2:
      "Das Pattern heißt Unified Surface. Hier erfährst du, was es ist, wie es funktioniert und warum du danach schwer davon loskommst.",
  },

  fileTreeSection: {
    title: "Ein Feature ist ein Ordner",
    intro:
      "Jedes Feature in next-vibe lebt in einem Ordner. Drei Dateien sind Pflicht. Alles andere ist optional.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← was es tut",
      line3: "  repository.ts    ← wie es das tut",
      line4: "  route.ts         ← lässt es überall existieren",
      line5: "  widget.tsx       ← eigene React-UI (optional)",
      line6: "  widget.cli.tsx   ← eigene Terminal-UI (optional)",
    },
    explanation:
      "Das ist alles. Ein Ordner. Drei Pflichtdateien. Und aus diesen drei Dateien existiert das Feature auf bis zu 13 Plattformen gleichzeitig.",
  },

  platformsSection: {
    title: "13 Plattformen aus 3 Dateien",
    subtitle:
      "Wenn du ein Feature zu next-vibe hinzufügst, wird es nicht nur ein API-Endpoint. Es wird gleichzeitig alles.",
    platforms: {
      webApi: {
        label: "Web API",
        description:
          "REST-Endpoint, automatisch validiert, vollständig typisiert",
      },
      reactUi: {
        label: "React UI",
        description:
          "Automatisch aus der Definition generiert - kein JSX geschrieben",
      },
      cli: {
        label: "CLI",
        description:
          "Jeder Endpoint ist ein Befehl mit automatisch generierten Flags",
      },
      aiTool: {
        label: "AI Tool Schema",
        description: "Function-Calling-Schema wird automatisch generiert",
      },
      mcpServer: {
        label: "MCP Server",
        description:
          "Verbinde dich mit Claude Desktop, Cursor oder einem anderen MCP-Client",
      },
      reactNative: {
        label: "React Native",
        description: "iOS- und Android-Screens aus derselben Definition",
      },
      cron: {
        label: "Cron Job",
        description: "Jeden Endpoint nach Zeitplan ausführen",
      },
      websocket: {
        label: "WebSocket Events",
        description:
          "Updates an verbundene Clients pushen, sobald etwas fertig ist",
      },
      electron: {
        label: "Electron Desktop",
        description: "Native Desktop-App über dieselben Endpoint-Verträge",
      },
      adminPanel: {
        label: "Admin-Panel",
        description:
          "Automatisch generiertes Admin-UI, kein zusätzlicher Code nötig",
      },
      vibeFrame: {
        label: "VibeFrame Widget",
        description: "Einbettbares iframe-Widget für jede Website",
      },
      remoteSkill: {
        label: "Agent Skill",
        description: "Von KI-Agenten als strukturierter Skill aufrufbar",
      },
      vibeBoard: {
        label: "Vibe Sense Node",
        description: "Node in einem Live-Datenflussgraphen - selber Endpoint",
      },
    },
  },

  deleteFolderQuote:
    "Lösch den Ordner. Das Feature hört überall gleichzeitig auf zu existieren.",

  platformMarkersSection: {
    title: "Plattformzugriff ist ein Enum-Array",
    para1:
      "Du schreibst keine separaten Berechtigungsschichten für jede Plattform. Der Plattformzugriff wird direkt in der Definition deklariert - ein Enum-Array, das jede Plattform zur Laufzeit nativ ausliest.",
    codeComment: "// Dieses eine Array steuert, wo das Feature auftaucht",
    cliOff: "  CLI_OFF,         // blockt die CLI",
    mcpVisible: "  MCP_VISIBLE,     // Opt-in für die MCP-Tool-Liste",
    remoteSkill: "  REMOTE_SKILL,    // trägt es in die Agent-Skill-Datei ein",
    productionOff: "  PRODUCTION_OFF,  // deaktiviert es in Produktion",
    para2:
      "Selbe Definition. Selber Ort. Keine Konfig-Dateien zum Synchronisieren. Keine separaten Berechtigungssysteme pro Plattform.",
  },

  noApiSplitQuote:
    "Es gibt keine API für Menschen und API für KI. Es gibt nur das Tool.",

  demoSection: {
    title: "Die Live-Demo: Thea baut einen Endpoint",
    subtitle:
      "Statt das Pattern abstrakt zu erklären, zeig ich dir, wie es in der Praxis aussieht.",
    theaIntro:
      "Thea ist die KI-Administratorin dieser Plattform. Sie läuft 24/7 auf Produktion und arbeitet mit denselben Endpoint-Verträgen wie jeder Benutzer - selbe Validierung, selbe Berechtigungen, keine Hintertür. Und sie kann Arbeit an eine lokale Maschine delegieren.",
    demoStory:
      "Ich hab Thea gebeten, einen neuen Endpoint zu bauen - explain-to-my-boss - mit Claude Code auf meinem PC. Du gibst eine technische Entscheidung ein, und raus kommt eine nicht-technische Begründung, die dein Chef tatsächlich glaubt. Das hat jeder Entwickler schon mal gebraucht.",

    flow: {
      step1: {
        actor: "Du",
        label: "Frag Thea",
        description:
          "Tippe die Aufgabe in den Chat - zwei Eingabefelder, eine KI-generierte Antwort, alle Plattformen, MCP_VISIBLE, eigene React- und CLI-Widgets.",
      },
      step2: {
        actor: "Thea",
        label: "Erstellt die Aufgabe",
        description:
          'Thea denkt laut nach, erstellt eine Aufgabe mit targetInstance="hermes" (deine lokale Maschine) und geht in den Ruhezustand.',
      },
      step3: {
        actor: "Lokaler Hermes",
        label: "Holt die Aufgabe ab",
        description:
          "Die lokale Instanz synchronisiert alle 60 Sekunden. Keine offenen Ports. Deine Maschine initiiert die Verbindung.",
      },
      step4: {
        actor: "Claude Code",
        label: "Baut den Endpoint",
        description:
          "Interaktive Session. Liest zuerst bestehende Patterns, erstellt fünf Dateien, führt vibe check aus. Null Fehler.",
      },
      step5: {
        actor: "Claude Code",
        label: "Meldet Fertigstellung",
        description:
          "Ruft complete-task mit der Aufgaben-ID auf. Status: abgeschlossen. Zusammenfassung anbei.",
      },
      step6: {
        actor: "Thea",
        label: "Wacht auf",
        description:
          "wakeUp feuert. Thea setzt das Gespräch per WebSocket fort, streamt ihre Antwort, TTS spricht.",
      },
      step7: {
        actor: "Ergebnis",
        label: "Existiert überall",
        description:
          "Webformular. CLI-Befehl. MCP-Tool. React-Native-Screen. Alles live. Aus fünf Dateien.",
      },
    },

    proofTitle: "Der Beweis",
    proofPara:
      "Sobald Claude Code complete-task aufgerufen hat, gab es drei Dinge, die fünf Minuten vorher noch nicht existierten:",
    proof1:
      "Ein eigenes React-Widget - dramatische Überschrift, animierter Gradient auf dem KI-Output, ein gefälschter Corporate-Alignment-Score.",
    proof2:
      "Ein CLI-Widget - ASCII-Banner, Spinner während die KI nachdenkt, die Begründung Zeile für Zeile in Grün.",
    proof3:
      "Ein MCP-Tool - explain-to-my-boss_POST - weil MCP_VISIBLE in der Definition stand. Claude Desktop kann jetzt deine Entscheidungen deinem Chef erklären.",
    proofClosing:
      "Eine Definition. Fünf Dateien insgesamt. Drei komplett verschiedene UIs. Der Endpoint-Vertrag hat sich nicht geändert. Nur die Präsentationsschicht.",
  },

  underTheHoodSection: {
    title: "Unter der Haube",
    definitionTitle: "definition.ts - der lebende Vertrag",
    definitionPara:
      "Die Definition ist kein Code-Generator. Sie ist ein lebender Vertrag, den jede Plattform zur Laufzeit nativ ausliest. Ändere sie - alles aktualisiert sich. Lösch den Ordner - nichts bricht downstream. Es gibt keinen generierten Code zum Aufräumen.",
    repositoryTitle: "repository.ts - niemals throw",
    repositoryPara:
      "Repository-Funktionen werfen nie. Fehler propagieren als Daten - typisiert, explizit und vom Aufrufer abfangbar. Die KI kann über Fehlerpfade nachdenken. Keine überraschenden Exceptions.",
    repositoryCodeComment: "// Gibt ResponseType<T> zurück - wirft niemals",
    routeTitle: "route.ts - die komplette Brücke",
    routePara:
      "route.ts verbindet Definition mit Handler. endpointsHandler kümmert sich um Validierung, Authentifizierung, Logging und Exposition für alle 13 Plattformen. Die eigentliche Geschäftslogik ist eine Zeile.",
    statsTitle: "Die Zahlen",
    statEndpoints: "374 Endpoints",
    statEndpointsDetail: "Ein Pattern, 374-mal angewandt",
    statAny: "Null `any`",
    statAnyDetail: "Zur Build-Zeit erzwungen, keine Konvention",
    statLanguages: "Drei Sprachen",
    statLanguagesDetail:
      'Zur Compile-Zeit geprüft - t("typo.here") ist ein Compiler-Fehler',
    statsClosing:
      "Das ist keine Konvention. Das wird zur Build-Zeit erzwungen.",
  },

  onePatternQuote: "Ein Pattern. 374-mal wiederholt.",

  vibeSenseTeaser: {
    eyebrow: "Als Nächstes",
    title: "Vibe Sense: Die Pipeline ist die Plattform",
    description:
      "Jede Node in einem Vibe-Sense-Graph ist ein regulärer next-vibe-Endpoint. Dasselbe createEndpoint(). Dieselbe 3-Dateien-Struktur. Ein EMA-Indikator ist ein Endpoint. Ein Schwellenwert-Evaluator ist ein Endpoint. Und weil es ein Endpoint ist, kannst du ihn über CLI, KI oder von überall aufrufen.",
    calloutLine: "Die Pipeline ist die Plattform.",
    teaser:
      "Vibe Sense sind einfach… mehr Endpoints. Dasselbe Prinzip, angewandt auf Zeitreihendaten. Lead-Funnels. Credit-Ökonomie. Nutzerwachstum. Deine Plattform überwacht sich selbst.",
    cta: "Zurück zum Blog",
  },

  closing: {
    title: "Einmal definieren. Überall vorhanden.",
    para: "WordPress gab jedem die Macht zu publizieren. next-vibe gibt dir die Macht, Plattformen zu bauen, die auf Web, Mobile, CLI, KI-Agenten und Automatisierung funktionieren - die sich selbst überwachen, über ihre eigenen Daten nachdenken und danach handeln.",
    cta: "next-vibe auf GitHub mit Stern versehen",
    ctaLink: "https://github.com/techfreaque/next-vibe",
  },
};
