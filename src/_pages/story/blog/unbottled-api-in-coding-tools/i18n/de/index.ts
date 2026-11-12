import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jedes Modell in deinem Coding-Agent - {{appName}} API",
    description:
      "OpenCode, Continue, Codex CLI und Claude Code mit einem einzigen {{appName}}-Key. Claude, GPT, DeepSeek, GLM und unzensierte Modelle. Getestete Configs, echte Stolperfallen.",
    category: "Entwickler-Guide",
    imageAlt: "{{appName}} API in Coding-Tools",
    keywords:
      "{{appName}}, OpenAI-kompatible API, OpenCode, Codex CLI, Claude Code, Continue, LiteLLM, Coding-Agent, unzensierte Modelle, eigener Provider",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "9 Min. Lesezeit",
    title: "Ein Key. Jedes Modell. Direkt im Coding-Agent.",
    subtitle:
      "Die {{appName}} API in OpenCode, Continue, Codex CLI und Claude Code. Jede Konfiguration hier lief vor der Veröffentlichung komplett durch.",
  },
  intro: {
    lead: "Dein Coding-Agent hängt an den Modellen eines einzigen Anbieters. Zweitmeinung von einem anderen Lab, ein günstiges Modell für Fleißarbeit oder eines, das nicht ablehnt? Heißt: noch ein Konto, noch ein Key, noch eine Rechnung.",
    p2: "{{appName}} spricht das OpenAI-Chat-Completions-Format. Einmal eingerichtet, wechselst du zwischen Claude, GPT, DeepSeek, GLM, Kimi, Qwen und den unzensierten Modellen über eine einzige Modell-ID. Zwei Tools verbinden sich direkt, zwei brauchen eine kleine lokale Brücke. Hier steht genau wie, samt getesteten Versionen.",
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
      "Dieselben Credits wie in der Chat-App, dieselben Preise. Jede Antwort meldet ihre Kosten in usage.credits_charged.",
  },
  setup: {
    title: "Key und Basis-URL holen",
    intro: "Zwei Werte. Jedes Tool unten braucht genau diese.",
    p1: "Erstelle unter Einstellungen > API-Keys einen Key. Er beginnt mit sk-unb- und wird genau einmal angezeigt. Die API gehört zu jedem bezahlten Tarif: ein aktives Abo oder ein beliebiges Credit-Paket schaltet sie frei.",
    baseUrlLabel: "Basis-URL",
    baseUrlNote:
      "Das Locale im Pfad ändert nur die Sprache der Fehlermeldungen. Jedes Locale funktioniert.",
    p2: "Leg den Key in eine Umgebungsvariable, niemals in eine Datei, die du committest. Der curl-Aufruf beweist, dass der Key funktioniert, und listet jede Modell-ID, die dein Konto aufrufen darf, mit Kontextgröße, Tool-Support und Credit-Preisen.",
  },
  compat: {
    title: "Was sich wie verbindet",
    intro:
      "Coding-Agents sprechen drei verschiedene Wire-Formate. Wir bedienen eines davon: Chat Completions. Das bestimmt das Setup.",
    opencode:
      "OpenCode: direkt. Spricht Chat Completions über seinen OpenAI-kompatiblen Provider.",
    continue:
      "Continue (CLI und IDE-Erweiterung): direkt. provider: openai mit eigener apiBase.",
    codex:
      "Codex CLI: braucht eine Brücke. Aktuelle Codex-Versionen sprechen nur noch die OpenAI Responses API. Die Chat-Completions-Unterstützung wurde Anfang 2026 entfernt.",
    claudeCode:
      "Claude Code: braucht eine Brücke. Es spricht die Anthropic Messages API, nicht das OpenAI-Format.",
    other:
      "Alles andere mit einem Feld für eine OpenAI-Basis-URL folgt dem OpenCode-Muster: Basis-URL, Key, Modell-ID. Wir listen nur Tools, die wir selbst laufen ließen.",
  },
  opencode: {
    label: "Direkt",
    title: "OpenCode",
    intro:
      "Getestet mit OpenCode 1.19.5. Tool-Calls, Dateien lesen und bearbeiten funktionieren.",
    p1: "Leg in opencode.json im Projekt einen eigenen Provider an, oder in ~/.config/opencode/opencode.json für alle Projekte. Der Key bleibt in deiner Umgebung. Jede ID aus GET /models kannst du in die models-Liste aufnehmen.",
    p2: "Dann starten, oder das Modell im TUI mit /models wählen:",
    gotcha:
      "Erst OpenCode aktualisieren. Alte 1.0.x-Builds ziehen das neueste @ai-sdk/openai-compatible-Paket und stürzen nach dem ersten Tool-Call mit DecimalError: Invalid argument ab. 1.19.5 fährt dieselbe Config fehlerfrei.",
  },
  continue: {
    label: "Direkt",
    title: "Continue",
    intro:
      "Getestet mit der Continue CLI 1.5.47. Die IDE-Erweiterung liest dieselbe config.yaml.",
    p1: "secrets.UNBOTTLED_API_KEY wird aus deiner Umgebung aufgelöst. Mit -p läuft es headless, ohne -p startet die interaktive Sitzung:",
  },
  bridge: {
    label: "Brücke",
    title: "Die LiteLLM-Brücke",
    intro:
      "Codex und Claude Code brauchen einen Übersetzer. LiteLLM läuft auf deinem Rechner und wandelt ihre Formate in Chat Completions um.",
    p1: "Ein einziger LiteLLM-Proxy bedient beide Tools. Er stellt /v1/responses für Codex und /v1/messages für Claude Code bereit und leitet alles als Chat Completions an {{appName}} weiter. Trag jedes Modell ein, das du nutzen willst. Getestet mit LiteLLM 1.109.1.",
    gotcha:
      "Nimm das Präfix custom_openai/, nicht openai/. Mit openai/ reicht LiteLLM Codex-Aufrufe als native Responses-Anfragen durch, und unsere API antwortet mit 404. Ohne LITELLM_MASTER_KEY startet LiteLLM gar nicht erst. Dieser Wert ist der Key, den deine Tools an die Brücke schicken. Dein sk-unb-Key verlässt den Proxy nie.",
  },
  codex: {
    label: "Über Brücke",
    title: "Codex CLI",
    intro:
      "Getestet mit codex-cli 0.118.0. Es führte einen Shell-Befehl aus und antwortete auf Basis der Ausgabe.",
    p1: 'Richte einen eigenen Provider auf die Brücke. wire_api muss "responses" sein. "chat" lehnt Codex schon beim Start mit einem harten Fehler ab. env_key benennt die Variable mit deinem Brücken-Key.',
    p2: "Nutze die Modell-IDs aus litellm.yaml. Zum Wechseln die ID in die Brückenkonfiguration aufnehmen und model in config.toml ändern, oder -m auf der Kommandozeile mitgeben.",
  },
  claudeCode: {
    label: "Über Brücke",
    title: "Claude Code",
    intro:
      "Getestet mit Claude Code 2.1.322. Es nutzte sein Read-Tool über drei Runden und antwortete korrekt.",
    p1: "Claude Code liest das Gateway aus Umgebungsvariablen. ANTHROPIC_MODEL setzt das Hauptmodell. ANTHROPIC_DEFAULT_HAIKU_MODEL schiebt Hintergrundjobs wie Sitzungstitel auf ein günstiges Modell, damit sie das Hauptmodell nicht verbrauchen.",
    p2: "Claude Code warnt, dass es die Modell-ID nicht kennt, und nimmt ein Kontextfenster von 200k an. Das ist erwartet und harmlos. Die angezeigten Kosten sind eine eigene Schätzung. Deine echten Kosten sind die Credits, die {{appName}} abbucht.",
    caveat:
      "Anthropic unterstützt Claude Code mit Nicht-Claude-Modellen über ein Gateway offiziell nicht. Es funktioniert, wir haben es getestet, aber behandle es als experimentell: ein Claude-Code-Update kann es brechen. Außerdem schickt Claude Code einen großen Systemprompt, über 30k Input-Tokens selbst für eine Trivialaufgabe. Wähle ein günstiges Modell oder behalte dein Guthaben im Blick.",
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
      "IDs ändern sich, wenn Modelle ersetzt werden. Maßgeblich ist GET /models: steht eine ID für deinen Key nicht drin, antwortet die API mit 404 model_not_found und tauscht nie stillschweigend ein anderes Modell ein.",
  },
  gotchas: {
    title: "Stolperfallen, in die wir getreten sind",
    intro: "Damit du es nicht musst.",
    localeUrl:
      "Kopier die Basis-URL exakt, inklusive /api/<locale>/v1. Ohne Locale gibt es eine Weiterleitung, die manche Clients verwerfen. Ohne /api kommt eine HTML-Seite statt JSON.",
    modelId:
      "Nutze exakt die ID aus GET /models, etwa deepseek-v4.1-flash. Provider-Präfixe wie openai/ gehören nur in die LiteLLM-Config, nie in die Anfrage.",
    paid: "HTTP 402 mit paid_plan_required heißt: das Konto hat noch keinen bezahlten Tarif. Jedes Credit-Paket behebt das.",
    tools:
      "Ein Modell ohne Tool-Support antwortet mit 400 tools_not_supported, sobald der Agent Tools mitschickt. Prüf supports_tools in GET /models.",
    bridgeKey:
      "Hinter der Brücke kann ein 401 von beiden Seiten kommen. LiteLLM lehnt einen falschen Master-Key ab, {{appName}} einen falschen sk-unb-Key. Das LiteLLM-Log sagt dir, welcher es war.",
    rateLimit:
      "Jeder Key erlaubt 60 Anfragen pro Minute. Agents feuern viele kleine Aufrufe. Bei 429 bekommt der Agent einen eigenen Key.",
  },
  cta: {
    title: "In fünf Minuten verdrahtet.",
    subtitle:
      "Key erstellen, eine Config einfügen, Modell wählen. Die API-Doku deckt jedes Feld, jeden Fehlercode und jedes Streaming-Detail ab.",
    key: "API-Key erstellen",
    docs: "API-Doku lesen",
  },
};
