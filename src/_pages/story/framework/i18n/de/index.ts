import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "next-vibe Framework - Eine Definition, jede Oberfläche",
    description:
      "Open-Source-Framework in TypeScript. Aus einer definition.ts werden Web-UI, CLI-Befehl, MCP-Tool, nativer Screen, KI-Tool und Cron-Job. Dazu eine OpenAI- und Anthropic-kompatible API.",
    category: "Framework",
    imageAlt: "next-vibe Framework für Entwickler",
    keywords:
      "next-vibe, TypeScript-Framework, MCP-Server, CLI, KI-Tools, Zod, Drizzle, OpenAI-kompatible API",
  },
  hero: {
    eyebrow: "Open Source · MIT + GPL v3",
    title: "Eine definition.ts.",
    titleAccent: "Jede Oberfläche.",
    subtitle:
      "next-vibe ist ein TypeScript-Framework, in dem eine Endpoint-Definition zu Web-UI, CLI-Befehl, MCP-Tool, nativem Screen, KI-Tool, Cron-Job und sieben weiteren Oberflächen wird. Gleiche Validierung, gleiche Typen, kein Klebecode.",
    ctaQuickstart: "In vier Befehlen starten",
    ctaGithub: "Auf GitHub ansehen",
    stat1Label: "typisierte Endpoints im Repo",
    stat2Label: "Oberflächen pro Endpoint",
    stat3Label: "Sprachen pro Text",
    stat4Label: "Definition pro Feature",
  },
  example: {
    eyebrow: "Ein echter Endpoint",
    title: "Folge dem Kontaktformular.",
    intro:
      "Der Kontakt-Endpoint aus dem Repo, live unten auf dieser Seite. Zwei Dateien zum Lesen. Sechs der dreizehn Oberflächen siehst du hier.",
    source: "Kompletten Quellcode auf GitHub lesen",
    live: "Das Live-Formular testen",
    becomes: "Was daraus wird",
    more: "Dazu sieben weitere",
    moreSurfaces: {
      webApi: "REST-API",
      websocket: "WebSocket-Events",
      electron: "Electron-App",
      adminPanel: "Admin-Panel",
      vibeFrame: "Einbettbares Widget",
      remoteSkill: "Agent-Skill",
      vibeBoard: "Analytics-Knoten",
    },
    surfaces: {
      web: {
        title: "Web-UI",
        body: "Das Formular unten auf dieser Seite. Felder, Validierung und Erfolgsmeldung kommen aus der Definition.",
      },
      cli: {
        title: "CLI-Befehl",
        body: "vibe contact-form. Ein Flag pro Feld, Hilfetext mit Beispielen inklusive.",
      },
      mcp: {
        title: "MCP-Tool",
        body: "Jeder MCP-Client ruft contact-form über vibe mcp auf. Das Eingabeschema kommt direkt aus Zod.",
      },
      ai: {
        title: "KI-Tool",
        body: "Modelle können es aufrufen. requiresConfirmation lässt den Nutzer vor dem Senden bestätigen.",
      },
      native: {
        title: "Nativer Screen",
        body: "Die Expo-App rendert dasselbe Widget mit nativen Eingabefeldern.",
      },
      cron: {
        title: "Cron-Job",
        body: "Jeder Endpoint läuft auch nach Zeitplan. Gleicher Handler, kein zweiter Codepfad.",
      },
    },
    callsTitle: "Vier Wege hinein",
    callsBody:
      "Echte Aufrufe. CLI, MCP und KI treffen den Kontakt-Handler oben. Der Cron-Tab zeigt einen echten geplanten Task aus dem Repo.",
  },
  pattern: {
    eyebrow: "Das Muster",
    title: "Ein Feature ist ein Ordner.",
    subtitle:
      "definition.ts und route.ts sind Pflicht. Widget, E-Mails, Tabelle und Übersetzungen liegen daneben. Keine zentrale Registry, die du von Hand pflegst.",
    deleteLine:
      "Ordner löschen, vibe gen ausführen. Das Feature verschwindet überall gleichzeitig.",
  },
  hood: {
    eyebrow: "Unter der Haube",
    title: "Die lästigen Teile, einmal gelöst.",
    intro:
      "Das Framework übernimmt Validierung, Auth, Logging, i18n und Realtime. Dein Ordner enthält die Geschäftslogik.",
    platform: {
      title: "Rollen und Plattform-Marker",
      body: "allowedRoles legt fest, wer einen Endpoint aufrufen darf. Plattform-Marker legen fest, wo er auftaucht: AI_TOOL_OFF versteckt ihn vor Modellen, PRODUCTION_OFF hält ihn aus der Produktion. Geprüft auf jeder Oberfläche.",
    },
    data: {
      title: "Zod, Drizzle, PostgreSQL",
      body: "Zod validiert Ein- und Ausgabe und erzeugt jedes Tool-Schema. Repositories regeln die Persistenz über Drizzle. Migrationen liegen im Repo. Ab Werk läuft alles auf eingebettetem PGlite, ohne Docker. Wird es größer, zeigt DATABASE_URL auf ein beliebiges Postgres.",
    },
    realtime: {
      title: "Typisiertes Realtime",
      body: "Endpoints deklarieren Event-Schemas und Channel-Scopes. Clients abonnieren per WebSocket gestreamte Tokens und Task-Fortschritt. Pub/Sub läuft im Prozess oder über Redis.",
    },
    remote: {
      title: "Verbundene Instanzen",
      body: "Instanzen verbinden sich, führen Tools beim Gegenüber aus und synchronisieren, was du freigibst. Jede Seite setzt ihre eigenen Rechte durch. So nutzt eine selbst gehostete Installation die Modelle von unbottled.ai.",
    },
  },
  typescript: {
    title: "Kein any. Kein unknown. Kein throw.",
    subtitle:
      "Typen passen durchgehend, ohne Ausnahme. vibe check setzt das durch, bevor irgendetwas live geht.",
    patterns: {
      any: {
        name: "kein any",
        description:
          "Schreib das echte Interface. Wer zu any greift, hat ein Loch in der Architektur.",
      },
      unknown: {
        name: "kein unknown",
        description: "Gleiche Regel. unknown ist any mit Umweg.",
      },
      object: {
        name: "kein nacktes object",
        description:
          "Schreib die Form, die du erwartest. object sagt gar nichts.",
      },
      asX: {
        name: "kein as X",
        description:
          "Casts belügen den Compiler. Repariere die Typen an der Quelle.",
      },
      throwStatements: {
        name: "kein throw",
        description:
          "ResponseType<T> über success(data) oder fail({ message, errorType }) zurückgeben. Fehler sind Daten.",
      },
      hardcodedStrings: {
        name: "keine festen Texte",
        description:
          "Jeder sichtbare Text ist ein Übersetzungsschlüssel. Der Linter findet Literale.",
      },
    },
    vibeCheck:
      "vibe check lässt Oxlint, ESLint und den TypeScript-Checker parallel laufen. Null Fehler, sonst geht nichts raus.",
  },
  quickstart: {
    eyebrow: "Schnellstart",
    title: "Vier Befehle. Dann übernimmt der Browser.",
    intro:
      "Klonen, installieren, starten. Ein Einrichtungsassistent erledigt Admin-Login und KI-Anbieter. Keine Konfigurationsdateien.",
    selfHost: "Anleitung zum Selbsthosten",
    docs: "Muster-Doku auf GitHub",
  },
  api: {
    eyebrow: "Gehostete API",
    title: "Oder ruf einfach die {{appName}}-API auf.",
    intro:
      "Ohne Installation. Kompatibel mit OpenAI und Anthropic: SDK behalten, Base-URL und Schlüssel tauschen.",
    endpoints: {
      chat: "OpenAI Chat Completions",
      responses: "OpenAI Responses",
      messages: "Anthropic Messages",
      models: "Modellliste mit Preisen",
    },
    access:
      "{{modelCount}} Modelle hinter einem Schlüssel, abgerechnet in {{appName}}-Credits. API-Schlüssel gibt es ab jedem Abo oder Guthabenpaket.",
    docs: "API-Doku lesen",
    keys: "API-Schlüssel erstellen",
  },
  examples: {
    eyebrow: "Im Repo",
    title: "Nicht nur KI-Chat.",
    subtitle:
      "Ganze Geschäftsbereiche liegen im Repo, alle nach demselben Muster gebaut.",
    items: {
      aiPlatform: {
        label: "KI-Plattform",
        title: "{{appName}}",
        body: "{{modelCount}} Modelle, Chat, Gedächtnis, Agenten, Abrechnung und MCP. Genau diese Codebasis, in Produktion.",
      },
      commerce: {
        label: "Handel",
        title: "Produkte und Kasse",
        body: "Produkte, Kassensystem, Lager und Einkauf.",
      },
      finance: {
        label: "Finanzen",
        title: "Buchhaltung und Zahlungen",
        body: "Kontenrahmen, Steuersätze, Rechnungen, Stripe- und Krypto-Zahlungen.",
      },
      crm: {
        label: "CRM",
        title: "Leads und Nachrichten",
        body: "Leads, Newsletter, E-Mail-Posteingang und SMS.",
      },
    },
  },
  maturity: {
    eyebrow: "Ehrlicher Stand",
    title: "Was heute läuft.",
    stable: {
      title: "In Produktion",
      body: "{{appName}} läuft auf dieser Codebasis: Web, CLI, MCP, KI-Tools, Cron, Realtime, Zahlungen. Produktions-Builds laufen auf Next.js. Lokal ist TanStack Start mit Vite der Standard.",
    },
    beta: {
      title: "Beta",
      body: "React-Native-Screens, Sync zwischen Instanzen und Remote-Skills funktionieren, mit Ecken und Kanten.",
    },
    honest: {
      title: "Rechne mit Umbauten",
      body: "Ein Team, hohes Tempo, klare Meinung. Noch kein Semver, die Doku hinkt dem Code hinterher. Pinne einen Commit oder forke.",
    },
  },
  contact: {
    eyebrow: "Der Endpoint, live",
    title: "Fragen, oder baust du etwas Großes?",
    description:
      "Einrichtung, individuelle Integrationen, Architektur-Review. Dieses Formular ist der Kontakt-Endpoint von oben, gerendert vom Framework.",
  },
  code: {
    copy: "Kopieren",
    copied: "Kopiert",
    wrap: "Umbrechen",
    terminal: "Terminal",
    cli: "CLI",
    mcp: "MCP",
    ai: "KI-Tool",
    cron: "Cron",
    anthropic: "Anthropic (curl)",
  },
};
