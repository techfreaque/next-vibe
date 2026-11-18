import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "next-vibe-Framework und unbottled.ai-API | Entwickler",
    description:
      "Ein TypeScript-Endpunkt für Web, CLI, MCP, native Apps und KI-Tools. Starte next-vibe lokal oder binde die unbottled.ai-API über dein SDK an.",
    category: "Entwicklerwerkzeuge",
    imageAlt: "next-vibe und unbottled.ai für Entwickler",
    keywords:
      "next-vibe, TypeScript-Framework, MCP, unbottled.ai-API, OpenAI, Anthropic",
  },
  hero: {
    title: "next-vibe für Entwickler",
    subtitle:
      "Ein TypeScript-Framework, in dem eine einzige `definition.ts` die Grundlage für Weboberfläche, CLI-Befehl, MCP-Tool, native Ansicht und KI-Tool bildet.",
    quickstart: "next-vibe lokal starten",
  },
  example: {
    title: "Ein Endpunkt aus der Praxis",
    intro:
      "Hinter dem Kontaktformular von unbottled.ai steckt dieser Endpunkt. Der Ausschnitt zeigt, wie `definition.ts` die Nachricht prüft und ein Widget festlegt. `route.ts` bindet das Repository an.",
    source: "Kontaktendpunkt auf GitHub ansehen",
    form: "Kontaktformular öffnen",
    web: {
      title: "Weboberfläche",
      body: "Unter `/help` zeigt das gemeinsame Widget ein mehrzeiliges Nachrichtenfeld und nach dem Versand eine Bestätigung.",
    },
    cli: {
      title: "CLI-Befehl",
      body: "`vibe contact-form` übernimmt Optionen wie `--name` und `--message` aus den Eingabefeldern.",
    },
    mcp: {
      title: "MCP-Tool",
      body: "Ein MCP-Client ruft `execute-tool` mit `toolName: contact-form` und denselben Eingabedaten auf.",
    },
    native: {
      title: "Native Ansicht",
      body: "Der Expo-Build kann dasselbe Widget mit nativen Eingabefeldern und einer Schaltfläche für die Touch-Bedienung darstellen.",
    },
    ai: {
      title: "KI-Tool",
      body: "Ein Agent kann `contact-form` mit denselben Feldern `name` und `message` aufrufen. Vor dem Versand fordert der Endpunkt eine Bestätigung an.",
    },
  },
  quickstart: {
    title: "Lokal loslegen",
    intro:
      "Für das PostgreSQL-Standardsetup brauchst du Linux mit Git, Bun, Node.js und Docker.",
    start:
      "`bun run dev` ruft `vibe dev` auf, startet die lokale Datenbank, führt Migrationen aus und legt Beispieldaten an. Öffne die URL aus dem Terminal und melde dich als Dev-Admin an, um deinen KI-Anbieter einzurichten.",
    pglite:
      'Ohne Docker startest du `bun run dev` mit `DATABASE_URL="file:./data.db"`. Damit nutzt du das eingebettete PGlite.',
    github: "Repository auf GitHub ansehen",
    selfHost: "Anleitung zum Selbsthosten lesen",
  },
  api: {
    title: "Die unbottled.ai-API aufrufen",
    intro:
      "Nutze dein OpenAI- oder Anthropic-SDK mit der Basis-URL von unbottled.ai und einem API-Schlüssel. Die gehostete API unterstützt Chat Completions und Responses von OpenAI sowie Messages von Anthropic.",
    models:
      "Lege einen Schlüssel an und setze `UNBOTTLED_API_KEY` in deiner Shell. Damit fragst du die Modelle ab, die für dein Konto verfügbar sind.",
    request: "Modelle auflisten",
    docs: "API-Referenz lesen",
    keys: "API-Schlüssel verwalten",
  },
  architecture: {
    title: "So ist next-vibe aufgebaut",
    platform: {
      title: "Rollen und Plattformmarker",
      body: "Benutzerrollen legen fest, wer einen Endpunkt ausführen darf. Plattformmarker steuern, wo er verfügbar ist. `AI_TOOL_OFF` sperrt die Nutzung als KI-Tool. `MCP_VISIBLE` nimmt den Endpunkt in die Tool-Liste des MCP-Servers auf.",
    },
    data: {
      title: "Zod, Drizzle und PostgreSQL",
      body: "Zod prüft Ein- und Ausgaben und liefert die Tool-Schemas. Repositories speichern Daten über Drizzle. PostgreSQL-Tabellen und Migrationen liegen im Repository.",
    },
    realtime: {
      title: "Typisierte Echtzeitereignisse",
      body: "Endpunkte definieren Event-Schemas und Kanalbereiche. Clients abonnieren Updates wie gestreamte Tokens und den Aufgabenfortschritt per WebSocket. Pub/Sub läuft im Prozess oder über Redis.",
    },
    remote: {
      title: "Verbundene Instanzen",
      body: "Verbundene Instanzen können Tools auf der jeweils anderen Instanz ausführen und freigegebene Datenbereiche synchronisieren. Jede Instanz prüft ihre eigenen Berechtigungen. Die Verbindung läuft direkt oder über ein ausgehendes Relay.",
    },
    maturity: {
      title: "Stand heute",
      body: "next-vibe steht unter GPL-3.0 und läuft bei unbottled.ai produktiv auf Next.js. Die lokale Entwicklung nutzt standardmäßig TanStack Start und Vite. React Native und die Erkennung von Skills auf entfernten Instanzen sind in der Beta.",
    },
  },
  code: {
    copy: "Code kopieren",
    copied: "Kopiert",
    wrap: "Zeilen umbrechen",
    terminal: "Terminal",
  },
};
