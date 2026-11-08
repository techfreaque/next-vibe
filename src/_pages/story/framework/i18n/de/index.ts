import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "next-vibe Framework",
  description:
    "Das Open-Source SaaS-Framework hinter {{appName}}. Einmal definieren, überall vorhanden.",
  meta: {
    title: "next-vibe Framework",
    description:
      "Open-Source KI-natives SaaS-Framework. Eine Endpoint-Definition, dreizehn Plattformen.",
    category: "Framework",
    imageAlt: "next-vibe Framework Dokumentation",
    keywords:
      "next-vibe, Framework, SaaS, Open-Source, KI, Full-Stack, TypeScript",
  },
  hero: {
    eyebrow: "Open Source · MIT + GPL v3",
    title: "Eine Definition.",
    titleAccent: "Dreizehn Plattformen.",
    subtitle:
      "next-vibe macht aus einer einzigen TypeScript-Definition dreizehn Plattformen gleichzeitig - maßgeschneiderte Web-UI, CLI-Befehl, MCP-Tool, Mobile-Screen, Cron-Job, WebSocket, Admin-Panel und mehr. Vollständig typsicher, ohne Drift, ohne Wiederholung.",
    ctaGithub: "Auf GitHub staren",
    ctaDocs: "Pattern-Dokumentation lesen",
    stat1Label: "typed endpoints",
    stat2Value: "0",
    stat2Label: "runtime type errors",
    stat3Label: "platforms per endpoint",
    stat4Value: "2",
    stat4Label: "files required",
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Du hast dasselbe dreizehnmal gebaut.",
    subtitle:
      "Jedes Feature braucht eine eigene Web-UI, einen CLI-Befehl, ein MCP-Tool, einen Mobile-Screen, Cron-Job, WebSocket-Handler, Admin-Panel und mehr. Gleiche Validierung, gleiche i18n, gleiche Fehlerbehandlung - nur anders verkleidet. Jedes Mal.",
    callout: "next-vibe baut alle dreizehn aus einer Datei.",
  },
  pattern: {
    eyebrow: "Das Muster",
    title: "Zwei Dateien erforderlich. Jede Plattform.",
    subtitle:
      "Jedes Feature lebt in einem Ordner. Nur definition.ts und route.ts sind Pflicht - alles andere ist optional.",
    definitionTitle: "definition.ts - der Vertrag",
    definitionBody:
      "Felder, Zod-Schemas, Labels, Fehlertypen und Beispiele einmal deklarieren. Diese Datei ist die einzige Quelle der Wahrheit - das Framework liest sie zur Laufzeit auf jeder Plattform.",
    routeTitle: "repository.ts - die Logik",
    routeBody:
      "Business-Logik lebt hier - DB-Abfragen, Auth-Prüfungen, Fehlerbehandlung mit success()/fail(). Die route.ts ist nur ein dünner Delegator; Validierung, Logging und Plattform-Registrierung laufen automatisch.",
    widgetTitle: "widget.tsx - die UI (optional)",
    widgetBody:
      "Ohne Widget rendert das Framework deine Felder überall automatisch. Füge widget.tsx hinzu, um eine vollständig angepasste interaktive UI auszuliefern - dieselbe Komponente rendert in Admin-Panels, eingebetteten Widgets und Mobile-Screens.",
    deleteLine:
      "Ordner löschen. Das Feature verschwindet sofort von jeder Plattform.",
  },
  surfaces: {
    items: {
      webApi: {
        label: "Web API",
        description: "REST-Endpoint, vollständig validiert und typisiert",
      },
      reactUi: {
        label: "React UI",
        description: "Maßgeschneiderte interaktive UI - kein JSX nötig",
      },
      cli: {
        label: "CLI",
        description:
          "Jeder Endpoint ist ein Befehl mit automatisch generierten Flags",
      },
      aiTool: {
        label: "KI-Tool",
        description: "Function-Calling-Schema automatisch generiert",
      },
      mcpServer: {
        label: "MCP-Server",
        description: "Verbinde Claude Desktop, Cursor, jeden MCP-Client",
      },
      reactNative: {
        label: "React Native",
        description: "iOS- und Android-Screens aus derselben Definition",
      },
      cron: {
        label: "Cron-Job",
        description: "Jeden Endpoint nach Cron-Ausdruck planen",
      },
      websocket: {
        label: "WebSocket",
        description: "Updates nach Abschluss an verbundene Clients senden",
      },
      electron: {
        label: "Electron",
        description: "Native Desktop-App über dieselben Endpoint-Verträge",
      },
      adminPanel: {
        label: "Admin-Panel",
        description: "Automatisch generiertes Admin-UI - kein dedizierter Code",
      },
      vibeFrame: {
        label: "VibeFrame-Widget",
        description: "Einbettbares iframe-Widget für jede Seite",
      },
      remoteSkill: {
        label: "Agenten-Skill",
        description: "Von KI-Agenten als strukturierter Skill aufrufbar",
      },
      vibeBoard: {
        label: "Vibe Sense-Knoten",
        description:
          "Knoten in einem Live-Datenflussgraphen - derselbe Endpoint",
      },
    },
  },
  typescript: {
    eyebrow: "TypeScript-Suprematie",
    title: "Kein any. Kein unknown. Kein throw.",
    subtitle:
      "Typen müssen vollständig übereinstimmen - keine Ausnahmen. Das ist keine Stilpräferenz. Es ist eine Strukturregel, zur Build-Zeit durch vibe check durchgesetzt.",
    patterns: {
      any: {
        name: "kein any",
        description:
          "Durch echtes typisiertes Interface ersetzen. Wenn du nach any greifst, hat deine Architektur ein Loch.",
      },
      unknown: {
        name: "kein unknown",
        description:
          "Gleiche Regel. unknown ist nur any mit extra Schritten. Typ definieren.",
      },
      object: {
        name: "kein nacktes object",
        description:
          "Nacktes object ist bedeutungslos. Schreibe die Form, die du tatsächlich erwartest.",
      },
      asX: {
        name: "kein as X",
        description:
          "Typzusicherungen sind Lügen an den Compiler. Behebe stattdessen die Architektur.",
      },
      throwStatements: {
        name: "kein throw",
        description:
          "Verwende ResponseType<T> mit success(data) oder fail({message, errorType}). Fehler sind Daten.",
      },
      hardcodedStrings: {
        name: "keine hartcodierten Strings",
        description:
          "Jeder String braucht einen Übersetzungsschlüssel. Der Checker erkennt nicht übersetzte Literale.",
      },
    },
    vibeCheck:
      "vibe check führt Oxlint (Rust), ESLint und TypeScript-Typüberprüfung parallel aus. Null Fehler erforderlich vor dem Deployen.",
  },
  examples: {
    eyebrow: "Mit next-vibe gebaut",
    title: "Vom Auto-Cockpit bis zur KI-Plattform.",
    subtitle:
      "Eine Codebasis, jede Oberfläche. Das sind echte Produkte auf next-vibe - ein Auto-PC, Online-Shops, Buchungsseiten und {{appName}} selbst. Ein Framework, grundverschiedene Produkte.",
    items: {
      headunit: {
        label: "Auto-Cockpit",
        title: "Ein komplettes Auto-Headunit",
        body: "Navigation, Klimasteuerung, Radio, Spotify, Bluetooth-Telefonie und Live-Fahrzeugdiagnose - plus Android Auto - auf einem Touchscreen-Auto-PC. Gebaut als next-vibe-Fork.",
      },
      shop: {
        label: "E-Commerce",
        title: "Online-Shops, die verkaufen",
        body: "Shopfront, Warenkorb, Checkout, Lager und Kasse aus einer Installation. Ein echter Shop läuft heute darauf.",
      },
      booking: {
        label: "Buchungen",
        title: "Praxis- & Buchungsseiten",
        body: "Termine, Kundenakten, Rechnungen und eine öffentliche Seite - das Rückgrat eines Praxisbetriebs. Gleicher Stack wie der Shop.",
      },
      aiPlatform: {
        label: "KI-Plattform",
        title: "{{appName}}",
        body: "{{modelCount}} Modelle, Chat, dauerhaftes Gedächtnis, Agenten, Abrechnung und MCP - das Flaggschiff. Genau diese Codebasis, in Produktion.",
      },
    },
  },
  quickstart: {
    eyebrow: "Loslegen",
    title: "Forken, fragen, deployen.",
    subtitle: "Vom ersten Tag an auf {{appName}}-Niveau.",
    step1: {
      label: "Forken & klonen",
      description: "Auf GitHub forken, dann den Fork lokal klonen.",
    },
    step2: {
      label: "Server starten",
      description:
        "Für lokale Entwicklung startet vibe dev PostgreSQL in Docker, führt Migrationen durch, befüllt Daten und gibt Hot Reload. Für Produktion erledigt vibe build && vibe start den ersten Deploy. Danach nutzt du vibe rebuild, um Produktion mit Zero Downtime zu aktualisieren.",
    },
    step3: {
      label: "Als Admin einloggen",
      description:
        'App öffnen und "Als Admin einloggen" klicken - der Setup-Assistent führt durch API-Keys und Admin-Passwort.',
    },
    step4: {
      label: "KI fragen",
      description:
        "{{appName}}-Chat oder Claude Code öffnen und das gewünschte Feature beschreiben. Die KI schreibt alle Dateien - Definition, Route, Widget, i18n - und führt vibe check automatisch aus.",
    },
    docsLink: "Pattern-Dokumentation",
    githubLink: "github.com/techfreaque/next-vibe",
  },
  oneDef: {
    eyebrow: "Eine Definition",
    title: "Einmal schreiben. Überall laufen lassen.",
    subtitle:
      "Ein echter Endpoint aus diesem Repo: das fokussierte Fenster eines Linux-Desktops auslesen. Drei Dateien. Kein Glue-Code. Er erscheint als Webseite, CLI-Befehl, MCP-Tool, KI-Tool und Cron-Job.",
    defTitle: "definition.ts",
    defBody:
      "Pfad, Alias, Rollen, Zod-Schema, Widget, Fehler, Beispiele. Alles, was jede Oberfläche braucht, an einer Stelle.",
    routeTitle: "route.ts",
    routeBody:
      "Verdrahtet die Definition mit einer Repository-Funktion. Genau diesen Handler ruft jede Oberfläche auf.",
    surfacesTitle: "Das bekommst du ohne weiteren Code",
    cli: {
      title: "CLI-Befehl",
      body: "Der Alias wird zum Befehl. Das Ergebnis rendert dasselbe Widget, fürs Terminal gesetzt.",
    },
    mcp: {
      title: "MCP-Tool",
      body: "Zeig jedem MCP-Client auf vibe mcp. Die Schemas kommen direkt aus den Zod-Feldern.",
    },
    ai: {
      title: "KI-aufrufbares Tool",
      body: "Modelle erhalten ein Function-Calling-Schema, erzeugt aus der Definition. Rollen bestimmen, wer aufrufen darf.",
    },
    cron: {
      title: "Cron-Job",
      body: "Derselbe Handler, jetzt nach Zeitplan. Das ist die echte Task-Datei unseres Credit-Ablauf-Jobs.",
    },
    more: "Dazu: eine Webseite unter /tools/<alias>, eine typisierte REST-Route und ein Native-Screen. Das Widget rendert auf allen. Lösch den Endpoint-Ordner, und jede Oberfläche verschwindet mit.",
    addTitle: "Eigenen Endpoint in fünf Zeilen Shell",
    addBody:
      "Ordner anlegen, drei Dateien schreiben, neu generieren, prüfen. Meldet vibe check 0 Fehler, läuft es überall.",
  },
  enterprise: {
    eyebrow: "Enterprise",
    title: "Baust du etwas Großes?",
    description:
      "Wir helfen Teams bei Setup, individuellen Integrationen, Architektur-Review und laufender Entwicklungsunterstützung. Dieselbe Codebasis, dein Deployment.",
  },
};
