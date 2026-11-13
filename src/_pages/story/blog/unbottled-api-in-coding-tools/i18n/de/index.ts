import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Codex CLI und Claude Code mit jedem Modell - {{appName}} API",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider und Cline mit einem einzigen {{appName}}-Key. Claude, GPT, DeepSeek, GLM und unzensierte Modelle. Eine Basis-URL, ein Befehl pro Tool.",
    category: "Entwickler-Guide",
    imageAlt: "{{appName}} API in Coding-Tools",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, OpenAI-kompatible API, Responses API, Anthropic Messages API, Coding-Agent, unzensierte Modelle, eigener Provider",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "8 Min. Lesezeit",
    title: "Ein Key. Jedes Modell. Codex und Claude Code inklusive.",
    subtitle:
      "Codex CLI und Claude Code verbinden sich jetzt direkt mit {{appName}}, genau wie OpenCode, Continue, Aider und Cline. Eine Basis-URL, ein Key, ein Befehl pro Tool.",
  },
  intro: {
    lead: "Dein Coding-Agent hängt an den Modellen eines einzigen Anbieters. Zweitmeinung von einem anderen Lab, ein günstiges Modell für Fleißarbeit oder eines, das nicht ablehnt? Heißt: noch ein Konto, noch ein Key, noch eine Rechnung.",
    p2: "{{appName}} spricht alle drei Formate, die Coding-Agents nutzen: OpenAI Chat Completions, die OpenAI Responses API und die Anthropic Messages API. Kein Zwischenstück, nichts zu installieren. Einmal eingerichtet, wechselst du zwischen Claude, GPT, DeepSeek, GLM, Kimi, Qwen und den unzensierten Modellen über eine einzige Modell-ID.",
  },
  why: {
    title: "Warum sich das lohnt",
    oneKey:
      "Ein Key, ein Guthaben. Keine Einzelkonten bei Anthropic, OpenAI, DeepSeek, Moonshot und Z.ai.",
    uncensored:
      "Unzensierte Modelle im Editor. Sicherheitsforschung, Red-Team-Prompts, Fiction-Tooling, Daten, an denen Mainstream-Filter hängen bleiben. Den Filtergrad bestimmst du, nicht der Anbieter.",
    switch:
      "Das richtige Modell pro Aufgabe. Ein Spitzenmodell fürs harte Refactoring, ein Flash-Modell für Umbenennungen und Testgerüste. Gleiche Config, andere ID.",
    billing:
      "Dieselben Credits wie in der Chat-App, dieselben Preise. Jede Antwort meldet, was sie gekostet hat.",
  },
  setup: {
    title: "Key und Basis-URL holen",
    intro: "Zwei Werte. Jedes Tool unten braucht genau diese.",
    p1: "Erstelle unter Einstellungen > API-Keys einen Key. Er beginnt mit sk-unb- und wird genau einmal angezeigt. Die API gehört zu jedem bezahlten Tarif: ein aktives Abo oder ein beliebiges Credit-Paket schaltet sie frei.",
    shortcut:
      "Der schnellste Weg: Direkt nach dem Erstellen zeigt die Seite API-Keys jeden Block unten, mit deinem Key schon eingesetzt. Tool wählen, kopieren, starten.",
    baseUrlLabel: "Basis-URL",
    baseUrlNote:
      "Für Tools im OpenAI-Stil: Codex, OpenCode, Continue, Aider, Cline. Das Locale im Pfad ändert nur die Sprache der Fehlermeldungen.",
    anthropicBaseUrlLabel: "Anthropic-Basis-URL",
    anthropicBaseUrlNote:
      "Für Claude Code und Anthropic-SDKs. Dieselbe URL ohne /v1: /v1/messages hängen sie selbst an.",
    p2: "Leg den Key in eine Umgebungsvariable, niemals in eine Datei, die du committest. Der curl-Aufruf beweist, dass der Key funktioniert, und listet jede Modell-ID, die dein Konto aufrufen darf, mit Kontextgröße, Tool-Support und Credit-Preisen.",
  },
  compat: {
    title: "Jedes Tool verbindet sich direkt",
    intro:
      "Coding-Agents sprechen drei verschiedene Wire-Formate. Wir bedienen alle drei, mit demselben Key und denselben Modellen.",
    codex: "Codex CLI: OpenAI Responses API.",
    claudeCode: "Claude Code: Anthropic Messages API.",
    chat: "OpenCode, Continue, Aider, Cline: OpenAI Chat Completions.",
    other:
      "Alles andere mit einem Feld für die Basis-URL funktioniert genauso: Basis-URL, Key, Modell-ID.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Chat Completions",
  },
  codex: {
    intro:
      "Der Terminal-Agent von OpenAI. Liest dein Repo, führt Befehle aus, bearbeitet Dateien.",
    p1: "Codex spricht die Responses API, wir auch. Der Einzeiler definiert den Provider direkt im Aufruf: nichts zu bearbeiten, nichts zu installieren. Für den Alltag die Config einmal anhängen und Codex mit dem Profil starten.",
    p2: 'Modell wechseln per -m oder über die model-Zeile im Profil. wire_api bleibt "responses": aktuelle Codex-Versionen akzeptieren nichts anderes.',
  },
  claudeCode: {
    intro:
      "Der Terminal-Agent von Anthropic. Plant, editiert, startet Tests, schickt Subagents los.",
    p1: "Claude Code liest sein Gateway aus Umgebungsvariablen. ANTHROPIC_BASE_URL ist die Basis-URL ohne /v1. ANTHROPIC_MODEL setzt das Hauptmodell. Die OPUS- und SONNET-Vorgaben decken Modellauswahl und Plan-Modus ab, die HAIKU-Vorgabe schiebt Hintergrundjobs wie Sitzungstitel auf ein günstiges Modell, und CLAUDE_CODE_SUBAGENT_MODEL gilt für Subagents. CLAUDE_CODE_MAX_CONTEXT_TOKENS nennt Claude Code die echte Kontextgröße eines Nicht-Claude-Modells, damit es an der richtigen Stelle kompaktiert.",
    p2: "Lieber Claude selbst? Lass die Modellzeilen weg. Claude Code fragt seine üblichen Claude-IDs an, und wir leiten sie auf unser passendes Claude-Modell, abgerechnet in Credits.",
    p3: "Claude Code schickt einen großen Systemprompt, über 30k Input-Tokens selbst für eine Trivialaufgabe. Ein günstiges Standardmodell hält das bezahlbar.",
  },
  opencode: {
    intro: "Open-Source-Agent fürs Terminal, mit TUI und Headless-Modus.",
    p1: "Speichere die Config als opencode.json im Projekt, oder als ~/.config/opencode/opencode.json für alle Projekte. Der Key bleibt in deiner Umgebung. Jede ID aus GET /v1/models passt in die models-Liste, im TUI wählst du sie mit /models.",
    gotcha:
      "Erst OpenCode aktualisieren. Alte 1.0.x-Builds ziehen das neueste @ai-sdk/openai-compatible-Paket und stürzen nach dem ersten Tool-Call mit DecimalError: Invalid argument ab. 1.19.5 fährt dieselbe Config fehlerfrei.",
  },
  continue: {
    intro: "Coding-Assistent für VS Code und JetBrains, dazu die CLI cn.",
    p1: "secrets.UNBOTTLED_API_KEY wird aus deiner Umgebung aufgelöst. Mit -p und einem Prompt läuft es headless. Die IDE-Erweiterung liest ~/.continue/config.yaml: denselben Modelleintrag dort ergänzen.",
  },
  aider: {
    intro: "Pair-Programming im Terminal, Commits inklusive.",
    p1: "Ein Befehl, keine Config-Datei. Aider will openai/ vor der Modell-ID und entfernt das Präfix, bevor es uns aufruft. --edit-format diff hält Änderungen klein; ohne die Option schickt Aider bei unbekannten Modell-IDs ganze Dateien neu. Die zu bearbeitenden Dateien nennst du wie gewohnt beim Aufruf.",
  },
  cline: {
    intro: "Autonomer Coding-Agent, in VS Code und als CLI.",
    p1: "Zwei Befehle mit der Cline-CLI: Provider einmal speichern, dann cline starten. Basis-URL, Schlüssel und Modell-ID sind dieselben drei Werte wie überall.",
  },
  models: {
    title: "Welches Modell für welchen Job",
    intro:
      "Alle hier unterstützen Tool-Calls, ohne die kein Agent arbeitet. Die IDs gehören in deine Config.",
    strong: {
      title: "Harte Probleme",
      body: "Große Refactorings, fremde Codebasen, mehrstufiges Debugging. Höhere Credit-Preise, weniger Irrwege.",
    },
    cheap: {
      title: "Günstig und schnell",
      body: "Umbenennungen, Tests, Boilerplate, Hintergrundjobs. Ein Bruchteil des Preises eines Spitzenmodells. Solide Standardwahl für Agents mit großen Prompts.",
    },
    uncensored: {
      title: "Unzensiert",
      body: "Gleicher Agent-Workflow, kein Ablehnungsreflex. Exploit-Analyse, Red-Team-Tooling, Erwachsenen-Fiction-Pipelines, Scraper, bei denen andere Modelle predigen. Die Verantwortung für das, was du baust, bleibt bei dir.",
    },
    listNote:
      "IDs ändern sich, wenn Modelle ersetzt werden. Maßgeblich ist GET /v1/models: steht eine ID für deinen Key nicht drin, antwortet die API mit 404 model_not_found. Einzige Zuordnung gibt es für Claude Code: seine eingebauten Claude-IDs landen beim neuesten Claude derselben Familie.",
  },
  gotchas: {
    title: "Stolperfallen, in die wir getreten sind",
    intro: "Damit du es nicht musst.",
    localeUrl:
      "Kopier die Basis-URL exakt, inklusive /api/<locale>/v1. Ohne Locale gibt es eine Weiterleitung, die manche Clients verwerfen. Ohne /api kommt eine HTML-Seite statt JSON.",
    anthropicUrl:
      "Claude Code bekommt die Basis-URL ohne /v1. Mit /v1 ruft es /v1/v1/messages auf und landet bei 404.",
    modelId:
      "Nutze exakt die ID aus GET /v1/models, etwa deepseek-v4.1-flash. Aider will openai/ davor. Die eingebauten Claude-IDs von Claude Code landen automatisch beim neuesten Claude derselben Familie. Jede andere unbekannte ID liefert 404 model_not_found.",
    paid: "HTTP 402 mit paid_plan_required heißt: das Konto hat noch keinen bezahlten Tarif. Jedes Credit-Paket behebt das.",
    tools:
      "Ein Modell ohne Tool-Support antwortet mit 400 tools_not_supported, sobald der Agent Tools mitschickt. Prüf supports_tools in GET /v1/models.",
    rateLimit:
      "Jeder Key erlaubt 60 Anfragen pro Minute. Agents feuern viele kleine Aufrufe. Bei 429 bekommt der Agent einen eigenen Key.",
  },
  cta: {
    title: "Mit einem Befehl verdrahtet.",
    subtitle:
      "Key erstellen, Block für dein Tool kopieren, Modell wählen. Die API-Doku deckt jeden Endpunkt, jedes Feld, jeden Fehlercode und jedes Streaming-Detail ab.",
    key: "API-Key erstellen",
    docs: "API-Doku lesen",
  },
};
