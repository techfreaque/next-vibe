import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Eine Codebase. 13 Plattformen. Null Kompromisse.",
    category: "Architektur",
    description:
      "Wie das Unified Surface-Prinzip drei Dateien in eine Web-App, CLI-Befehl, MCP-Tool, nativen Screen und Cron-Job verwandelt - automatisch.",
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
    title: "Eine Codebase. 13 Plattformen. Null Kompromisse.",
    subtitle:
      "Wie drei Dateien gleichzeitig ein Web-Formular, CLI-Befehl, MCP-Tool, nativen Screen und automatisierten Job werden.",
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
    hook: "5.802 TypeScript-Dateien. ~2,1 Millionen Zeilen. Null `any`. Null Runtime-Typfehler. Ein Pattern. 374 Mal wiederholt.",
    para1:
      "Das ist die Codebase hinter unbottled.ai - und das Framework dahinter, next-vibe. Die gleiche Architektur betreibt eine Web-App, eine Mobile-App, eine CLI, ein KI-Agent-Interface, einen MCP-Server, ein Cron-System, einen WebSocket-Event-Bus und eine Live-Datenflussgine.",
    para2:
      "Das Pattern heißt Unified Surface. Hier ist, was es ist, wie es funktioniert, und warum du es schwer findest, zurückzugehen - sobald du es einmal gesehen hast.",
  },

  fileTreeSection: {
    title: "Ein Feature ist ein Ordner",
    intro:
      "Jedes Feature in next-vibe lebt in einem Ordner. Drei Dateien sind erforderlich. Alles andere ist optional.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← was es tut",
      line3: "  repository.ts    ← wie es das tut",
      line4: "  route.ts         ← lässt es überall existieren",
      line5: "  widget.tsx       ← benutzerdefinierte React-UI (optional)",
      line6: "  widget.cli.tsx   ← benutzerdefinierte Terminal-UI (optional)",
    },
    explanation:
      "Das ist alles. Ein Ordner. Drei erforderliche Dateien. Und aus diesen drei Dateien existiert das Feature auf bis zu 13 Plattformen gleichzeitig.",
  },

  platformsSection: {
    title: "13 Plattformen aus 3 Dateien",
    subtitle:
      "Wenn du ein Feature zu next-vibe hinzufügst, wird es nicht nur ein API-Endpunkt. Es wird gleichzeitig alles.",
    platforms: {
      webApi: {
        label: "Web API",
        description: "REST-Endpoint, auto-validiert, vollständig typisiert",
      },
      reactUi: {
        label: "React UI",
        description: "Auto-generiert aus der Definition - kein JSX geschrieben",
      },
      cli: {
        label: "CLI",
        description: "Jeder Endpoint ist ein Befehl mit auto-generierten Flags",
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
        description: "iOS- und Android-Screens aus der gleichen Definition",
      },
      cron: {
        label: "Cron Job",
        description: "Jeden Endpoint nach einem Zeitplan ausführen",
      },
      websocket: {
        label: "WebSocket Events",
        description: "Updates an verbundene Clients bei Fertigstellung pushen",
      },
      electron: {
        label: "Electron Desktop",
        description: "Native Desktop-App über die gleichen Endpoint-Verträge",
      },
      adminPanel: {
        label: "Admin-Panel",
        description: "Auto-generiertes Admin-UI, kein spezieller Code benötigt",
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
        description: "Node in einem Live-Datenflussgraphen - gleicher Endpoint",
      },
    },
  },

  deleteFolderQuote:
    "Lösch den Ordner. Das Feature hört überall gleichzeitig auf zu existieren.",

  platformMarkersSection: {
    title: "Plattformzugriff ist ein Enum-Array",
    para1:
      "Du schreibst keine separaten Berechtigungsschichten für jede Plattform. Plattformzugriff wird in der Definition selbst deklariert - ein Enum-Array, das jede Plattform nativ zur Laufzeit liest.",
    codeComment: "// Dieses einzelne Array steuert, wo das Feature erscheint",
    cliOff: "  CLI_OFF,         // blockiert die CLI",
    mcpVisible: "  MCP_VISIBLE,     // opt-in für die MCP-Tool-Liste",
    remoteSkill: "  REMOTE_SKILL,    // trägt es in die Agent-Skill-Datei ein",
    productionOff: "  PRODUCTION_OFF,  // deaktiviert es in der Produktion",
    para2:
      "Gleiche Definition. Gleicher Ort. Keine Konfig-Dateien zum Synchronisieren. Keine separaten Berechtigungssysteme pro Plattform.",
  },

  noApiSplitQuote:
    "Es gibt keine API für Menschen und API für KI. Es gibt nur das Tool.",

  demoSection: {
    title: "Die Live-Demo: Thea baut einen Endpoint",
    subtitle:
      "Statt das Pattern abstrakt zu erklären, lass mich zeigen, wie es in der Praxis aussieht.",
    theaIntro:
      "Thea ist die KI-Admin dieser Plattform. Sie läuft 24/7 auf der Produktion und operiert über die gleichen Endpoint-Verträge wie jeder Benutzer - gleiche Validierung, gleiche Berechtigungen, keine Hintertür. Und sie kann Arbeit an eine lokale Maschine delegieren.",
    demoStory:
      "Ich bat Thea, einen neuen Endpoint zu bauen - explain-to-my-boss - mit Claude Code auf meinem PC. Du gibst eine technische Entscheidung ein. Es gibt dir eine nicht-technische Begründung, die dein Manager tatsächlich glauben wird. Jeder Entwickler hat das gebraucht.",

    flow: {
      step1: {
        actor: "Du",
        label: "Frag Thea",
        description:
          "Tippe die Aufgabe in den Chat - zwei Eingabefelder, eine KI-generierte Antwort, alle Plattformen, MCP_VISIBLE, benutzerdefinierte React- und CLI-Widgets.",
      },
      step2: {
        actor: "Thea",
        label: "Erstellt die Aufgabe",
        description:
          'Thea denkt laut nach, erstellt eine Aufgabe mit targetInstance="hermes" (deine lokale Maschine) und wird dormant.',
      },
      step3: {
        actor: "Lokaler Hermes",
        label: "Holt die Aufgabe",
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
          "Ruft complete-task mit der Aufgaben-ID auf. Status: abgeschlossen. Zusammenfassung beigefügt.",
      },
      step6: {
        actor: "Thea",
        label: "Erwacht",
        description:
          "wakeUp feuert. Thea setzt das Gespräch via WebSocket fort, streamt ihre Antwort, TTS spricht.",
      },
      step7: {
        actor: "Ergebnis",
        label: "Existiert überall",
        description:
          "Web-Formular. CLI-Befehl. MCP-Tool. React-Native-Screen. Alles live. Aus fünf Dateien.",
      },
    },

    proofTitle: "Der Beweis",
    proofPara:
      "Sobald Claude Code complete-task aufrief, existierten drei Dinge, die fünf Minuten zuvor nicht existierten:",
    proof1:
      "Ein benutzerdefiniertes React-Widget - dramatische Überschrift, animierter Gradient auf dem KI-Output, ein gefälschter Corporate-Alignment-Score.",
    proof2:
      "Ein CLI-Widget - ASCII-Banner, Spinner während die KI nachdenkt, die Begründung zeilenweise in Grün gedruckt.",
    proof3:
      "Ein MCP-Tool - explain-to-my-boss_POST - weil MCP_VISIBLE in der Definition stand. Claude Desktop kann jetzt deine Entscheidungen deinem Chef erklären.",
    proofClosing:
      "Eine Definition. Fünf Dateien insgesamt. Drei komplett verschiedene UIs. Der Endpoint-Vertrag änderte sich nicht. Nur die Präsentationsschicht.",
  },

  underTheHoodSection: {
    title: "Unter der Haube",
    definitionTitle: "definition.ts - der lebende Vertrag",
    definitionPara:
      "Die Definition ist kein Code-Generator. Sie ist ein lebender Vertrag, den jede Plattform nativ zur Laufzeit liest. Ändere sie - alles wird aktualisiert. Lösch den Ordner - nichts bricht nachgelagert. Es gibt keinen generierten Code zum Aufräumen.",
    repositoryTitle: "repository.ts - niemals throw",
    repositoryPara:
      "Repository-Funktionen werfen nie. Fehler propagieren als Daten - typisiert, explizit und für den Aufrufer fangbar. Die KI kann über Fehlerpfade nachdenken. Keine überraschenden Exceptions.",
    repositoryCodeComment: "// Gibt ResponseType<T> zurück - wirft niemals",
    routeTitle: "route.ts - die gesamte Brücke",
    routePara:
      "route.ts verbindet die Definition mit dem Handler. endpointsHandler kümmert sich um Validierung, Authentifizierung, Logging und Exposition für alle 13 Plattformen. Die eigentliche Geschäftslogik ist eine Zeile.",
    statsTitle: "Die Zahlen",
    statEndpoints: "374 Endpoints",
    statEndpointsDetail: "Ein Pattern, 374 Mal angewendet",
    statAny: "Null `any`",
    statAnyDetail: "Zur Build-Zeit erzwungen, keine Konvention",
    statLanguages: "Drei Sprachen",
    statLanguagesDetail:
      'Compile-Zeit-geprüft - t("typo.here") ist ein Compiler-Fehler',
    statsClosing: "Das ist keine Konvention. Es wird zur Build-Zeit erzwungen.",
  },

  onePatternQuote: "Ein Pattern. 374 Mal wiederholt.",

  vibeSenseTeaser: {
    eyebrow: "Als nächstes",
    title: "Vibe Sense: Die Pipeline ist die Plattform",
    description:
      "Jeder Node in einem Vibe-Sense-Graphen ist ein regulärer next-vibe-Endpoint. Das gleiche createEndpoint(). Die gleiche 3-Datei-Struktur. Ein EMA-Indikator ist ein Endpoint. Ein Schwellenwert-Evaluator ist ein Endpoint. Und weil es ein Endpoint ist - kannst du ihn von der CLI, von der KI, von überall aufrufen.",
    calloutLine: "Die Pipeline ist die Plattform.",
    teaser:
      "Vibe Sense ist einfach... mehr Endpoints. Das gleiche Prinzip, angewendet auf Zeitreihendaten. Lead-Funnels. Kreditwirtschaft. Benutzerwachstum. Deine Plattform beobachtet sich selbst.",
    cta: "Zurück zum Blog",
  },

  closing: {
    title: "Definiere es einmal. Es existiert überall.",
    para: "WordPress gab jedem die Macht zu publizieren. next-vibe gibt dir die Macht, Plattformen zu bauen, die auf Web, Mobile, CLI, KI-Agenten und Automation funktionieren - die sich selbst beobachten, über ihre eigenen Daten nachdenken und danach handeln.",
    cta: "next-vibe auf GitHub mit Stern versehen",
    ctaLink: "https://github.com/techfreaque/next-vibe",
  },
};
