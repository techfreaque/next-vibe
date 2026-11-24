import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "OpenRouter-Alternativen mit unzensierten Modellen (2026) | {{appName}}",
    description:
      "OpenRouter im Vergleich mit Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT und {{appName}}. Gebühren, Eigenbetrieb, Filter und Datenschutz.",
    category: "Entwickler-Guide",
    imageAlt: "OpenRouter-Alternativen für Entwickler im Vergleich",
    keywords:
      "OpenRouter Alternative, OpenRouter Alternativen, OpenRouter vs NanoGPT, Seiten wie OpenRouter, LLM API Gateway, unzensierte LLM API, ein API-Schlüssel für alle Modelle, OpenAI-kompatible API, Anthropic-kompatible API, OpenRouter unzensierte Modelle, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "9 Min. Lesezeit",
    title: "OpenRouter-Alternativen für Modellrouting",
    subtitle:
      "{{count}} Alternativen und {{appName}} im Vergleich: API-Formate, unzensierte Modelle, Gebühren. Geprüft am {{date}}.",
  },
  intro: {
    lead: "OpenRouter verbindet eine API mit vielen Anbietern und bietet einen Webchat. Der Standardtarif nennt 5,5 % Plattformgebühr. Andere Gateways lohnen sich, wenn du den Router selbst betreiben, Limits feiner steuern oder anders abrechnen willst.",
    p2: "Wir haben Cloud-Gateways, selbst betriebene Proxys und Apps mit unzensierten Modellen anhand offizieller Dokumentation und Preise geprüft. Wir kaufen selbst bei OpenRouter ein. {{openRouterModels}} unserer Modelle laufen darüber.",
  },
  criteria: {
    title: "Was du vor dem Wechsel vergleichen solltest",
    intro: "Sechs Fragen entscheiden.",
    catalog:
      "Katalog: wie viele Modelle, von wie vielen Labs, und sind die dabei, die du heute nutzt?",
    uncensored:
      "Unzensierte Modelle: wie viele ohne Verweigerungen, und welcher Art?",
    formats:
      "Formate: nur OpenAI Chat Completions, oder auch die Responses API und die Anthropic Messages API, die Coding-Agents nutzen?",
    billing:
      "Abrechnung: Listenpreis plus Gebühr, ein Aufschlag oder ein Abo? Und was passiert bei Guthaben null?",
    data: "Daten: werden Prompts gespeichert, geloggt oder fürs Training genutzt, und ist das Opt-in?",
    chat: "Chat: können Leute, die nie Code schreiben, dieselben Modelle im Browser nutzen?",
  },
  table: {
    title: "Alle im direkten Vergleich",
  },
  us: {
    title: "{{appName}}: ein Schlüssel, jede Art von Modell",
    intro:
      "{{modelCount}} Chatmodelle hinter einem Schlüssel, {{uncensored}} davon unzensiert.",
    models:
      "Modelle: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM und Qwen neben {{uncensored}} unzensierten Modellen. {{ownModel}} ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden, und vertritt deshalb politische Gegenpositionen.",
    formats:
      "Formate: OpenAI Chat Completions, die OpenAI Responses API und die Anthropic Messages API. Jedes SDK und jeder Coding-Agent zeigt auf eine einzige Base-URL.",
    billing:
      "Abrechnung: ein Credit-Guthaben, unser Aufschlag von {{markup}} % auf unseren Einkaufspreis. Dein erster Kauf schaltet API-Schlüssel frei, Pläne gibt es ab {{apiSubPrice}} im Monat.",
    chat: "Chat: dieselben Modelle in einem Web-Chat mit Ordnern, Tools sowie Bild-, Video- und Musikgenerierung. Auch die Nicht-Entwickler im Team kommen an die Modelle.",
    openRouter:
      "OpenRouter inklusive: {{openRouterModels}} unserer Modelle laufen über OpenRouter. Gleiche Modelle, ein Konto mit den unzensierten.",
    weak: "Wo wir schwächer sind: Der Katalog von OpenRouter ist viel größer, du kannst eigene Anbieter-Schlüssel mitbringen und Anbieter pro Anfrage wählen, und die Preise liegen näher am Listenpreis, weil wir einen Aufschlag nehmen. Wer ein seltenes Modell braucht, findet es wahrscheinlich bei OpenRouter.",
    codeLabel:
      "Einen OpenAI-SDK-Client umziehen: Base-URL und Schlüssel ändern",
    docsLink: "API-Doku: Endpunkte, Authentifizierung und Limits",
    formatsLink: "OpenAI- und Anthropic-kompatible API, erklärt",
    toolsLink: "Ein Schlüssel in Claude Code, Codex CLI, Aider und mehr",
  },
  models: {
    title:
      "{{apiUncensored}} unzensierte Modelle, die du heute aufrufen kannst",
    intro:
      "Jedes unzensierte Modell der API, mit der ID, die du als model übergibst. Das günstigste zuerst.",
    colModel: "Modell",
    colId: "API-ID",
    colContext: "Kontext",
    colPrice: "Pro Nachricht",
    footnote:
      "Preis einer Referenznachricht inklusive unseres Aufschlags von {{markup}} %. Unter jedem Namen steht, wie ein Modell entstanden ist.",
  },
  list: {
    title: "Die {{count}} Alternativen im Einzelnen",
    intro:
      "Laut ihren eigenen Seiten, geprüft am {{date}}. Was jede ist, wie ihre API funktioniert, welche Modelle sie hat und was sie kostet.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modelle:",
    price: "Preis:",
    priceValue: "Gratis: {{free}}. Bezahlt: {{plans}}.",
    pro: "Stärke:",
    con: "Haken:",
    forWho: "Nimm es, wenn:",
    versusLink: "{{appName}} gegen {{name}}: der ganze Vergleich",
    visit: "{{name}} besuchen",
  },
  stay: {
    title: "Wann OpenRouter trotzdem die richtige Wahl ist",
    intro: "Manchmal ist das Original das bessere Werkzeug.",
    rare: "Du brauchst ein Nischenmodell oder einen bestimmten Anbieter, den sonst niemand auf dieser Liste bedient.",
    callout:
      "Viele Teams fahren zweigleisig: OpenRouter für den Long Tail, ein zweiter Schlüssel für unzensierte Modelle und einen Chat, den das ganze Team nutzen kann.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste OpenRouter-Alternative?",
      a: "Kommt darauf an, was dir bei OpenRouter fehlt. Viele unzensierte Modelle, Bezahlung nach Nutzung: NanoGPT. Venices eigene Modelle und Privatsphäre: Venice. Lokal und gratis: Ollama. Unzensierte, offene und Mainstream-Modelle plus Team-Chat mit einem Schlüssel: {{appName}}.",
    },
    cheaper: {
      q: "Gibt es eine günstigere OpenRouter-Alternative?",
      a: "Vergleiche den Preis pro Modell, nicht die Gebühr. Direkte Anbieter-APIs sparen sich jeden Zwischenhändler. Bei Gateways schwanken die Preise je Modell und ändern sich oft. Auf {{appName}} zahlst du unseren Einkaufspreis plus {{markup}} % Aufschlag, und jede Modellseite zeigt den Preis pro Nachricht.",
    },
    uncensored: {
      q: "Welche OpenRouter-Alternative hat unzensierte Modelle?",
      a: "NanoGPT, Venice, uncensored.ai, Gab AI und {{appName}} bieten unzensierte Modelle per API an. {{appName}} hat gerade {{apiUncensored}} auf seiner API, abliterierte und feinabgestimmte neben {{ownModel}}.",
    },
    sdk: {
      q: "Kann ich meinen OpenAI-SDK-Code behalten?",
      a: "Ja. Base-URL und API-Schlüssel ändern, der Rest bleibt. Modell-IDs unterscheiden sich je Gateway, also tausch die auch. Beispiel: {{example}}.",
    },
    anthropic: {
      q: "Funktioniert das mit Anthropic-SDKs und Coding-Agents?",
      a: "Auf {{appName}} ja: Die Anthropic Messages API läuft neben den OpenAI-Formaten, also verbinden sich Claude Code und andere Agents mit einem Schlüssel, unzensierte Modelle inklusive.",
    },
    free: {
      q: "Gibt es eine kostenlose OpenRouter-Alternative?",
      a: "Ollama ist gratis, wenn deine Hardware das Modell stemmt. OpenRouter selbst hat Gratis-Modelle mit Tageslimits. {{appName}} gibt dir jeden Monat Gratis-Credits für den Chat, die API wird mit deinem ersten Kauf freigeschaltet.",
    },
    apiLink: "Unzensierte LLM-API: Modell-IDs, Code und Limits",
    veniceLink: "Venice-AI-Alternativen im Vergleich",
    keysLink: "Deine API-Schlüssel verwalten",
  },
  cta: {
    title: "Ein Schlüssel. Jedes Modell. Weniger Verweigerungen.",
    subtitle:
      "Erst im Chat testen: {{guestCredits}} Gratis-Credits im Monat, kein Konto nötig.",
    start: "Unzensiertes Modell testen",
    docs: "API-Doku lesen",
  },
};
