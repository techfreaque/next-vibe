import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Unzensierte OpenRouter-Alternativen im Vergleich | {{appName}}",
    description:
      "OpenRouter führt keine abliterierten Modelle. Vergleiche OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice, Featherless und {{appName}} bei unzensierten Modellen, Gebühren, Datenschutz und API-Formaten.",
    category: "Entwickler-Guide",
    imageAlt: "Unzensierte OpenRouter-Alternativen für Entwickler im Vergleich",
    keywords:
      "unzensierte OpenRouter Alternative, OpenRouter Alternative, OpenRouter Alternativen, OpenRouter unzensierte Modelle, abliterierte Modelle API, unzensierte LLM API, Seiten wie OpenRouter, LLM API Gateway, OpenAI kompatible API, Anthropic kompatible API, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter vs NanoGPT, uncensored OpenRouter alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "11 Min. Lesezeit",
    title: "Unzensierte OpenRouter-Alternativen",
    subtitle:
      "{{count}} Alternativen und {{appName}}, verglichen bei unzensierter Abdeckung, API-Formaten und Gebühren. Geprüft am {{date}}.",
  },
  intro: {
    lead: "OpenRouter bündelt 477 Modelle hinter einem Schlüssel. Für unzensierte Arbeit ist das Regal dünn: 17 Roleplay- oder unzensierte Tunes, und kein einziges abliteriertes Modell.",
    p2: "Deshalb haben wir unzensierte API-Hosts, Flatrate-Roleplay-Hosts, Gateways und Apps anhand ihrer eigenen Doku, Preise und Modelllisten geprüft. Auch wir kaufen Modellzugang bei OpenRouter ein: {{openRouterModels}} unserer Modelle laufen darüber.",
  },
  shelf: {
    title: "Was OpenRouter für unzensierte Arbeit bietet",
    intro:
      "Aus der öffentlichen Modellliste und den Bedingungen, gelesen am {{orDate}}.",
    tunes:
      "17 von 477 Modellen passen nach Name oder Beschreibung zu Roleplay oder unzensiert: Venice Uncensored (ein Dolphin-Mistral-24B-Tune), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax und eine Handvoll Aion-RP-Modelle.",
    abliterated:
      "Keine einzige Modell-ID enthält abliterated oder uncensored. Die abliterierten Versionen von GLM 5.3, DeepSeek V4.1 Flash und Kimi K3.1 Pro, die die unzensierten Router verkaufen, fehlen dort.",
    rules:
      "Regeln: 18+, automatische CSAM-Prüfung, sonst gelten die Bedingungen des jeweiligen Modells. Standardmodelle lehnen weiter ab, was ihre Hersteller ablehnen.",
    callout:
      "Du brauchst abliterierte Gewichte? Dann ist OpenRouter der falsche Router. Du brauchst Roleplay-Feintunes? Da hat es ein ordentliches Regal.",
  },
  apis: {
    title: "Unzensierte API-Alternativen im Einzelnen",
    intro:
      "API-first-Dienste, die abliterierte oder unzensierte Gewichte verkaufen. Von ihren eigenen Seiten, gelesen am {{marketDate}}.",
    visit: "{{name}} besuchen",
    openUncensored: {
      heading: "OpenUncensored: ein Router nur für unzensierte Modelle",
      body: "58 Text-, 20 Bild- und 3 Videomodelle, fast alle abliteriert, geroutet an Venice, NanoGPT, Refuseless und andere. Keine Provision auf Anbieterpreise, Aufladungen ab 5 USD, die nie verfallen, und kein Konto: Dein API-Schlüssel ist das Konto. OpenAI, Responses und Anthropic Messages unter einer Basis-URL.",
      catch:
        "Haken: kein Gratis-Kontingent, kein Web-Chat (nur eine Desktop-App) und Anfrage-Metadaten werden bis zu zwei Jahre gespeichert.",
    },
    refuseless: {
      heading:
        "Refuseless: die günstigsten abliterierten Builds, die wir gefunden haben",
      body: "Abliterierte Versionen von GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash und Kimi K3.1 Pro mit 1 Mio. Kontext. DeepSeek V4.1 Flash abliterated kostet 0,12 USD Input und 0,45 USD Output pro Million Tokens. Chat Completions, Responses und Anthropic Messages, Claude Code inklusive.",
      catch:
        "Haken: nur API, verifizierte E-Mail nötig, und die Seiten zu Preisen, Datenschutz und Bedingungen blockierten unseren Reader.",
    },
    nearAi: {
      heading: "NEAR AI Cloud: abliterierte Modelle in Confidential Compute",
      body: "Hardware-Attestierung, sodass laut Anbieter weder NEAR noch der Cloud-Host deine Prompts lesen können. Zwei abliterierte Modelle: Qwen 3.8 27B für 0,04 USD Input und 1,35 USD Output pro Million Tokens sowie DeepSeek V4.1 Flash 1017. Kein Antrag, keine Identitätsprüfung, Bezahlung pro Token.",
      catch:
        "Haken: nur das OpenAI-Format und ein winziges unzensiertes Regal.",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai: der größte unzensierte Katalog",
      body: "332 Chatmodelle plus 13 Bild- und Videomodelle, mit täglicher Prüfung auf Ablehnungen. OpenAI-, Anthropic- und Gemini-Format mit einem Prepaid-Schlüssel. Karte oder Krypto ab 3 USD, und das Guthaben verfällt nie.",
      catch:
        "Haken: kein Weiterverkauf und keine weiterberechnete API ohne schriftliche Erlaubnis. Datenschutzbedingungen waren auf den gelesenen Seiten nicht veröffentlicht.",
    },
    abliterationAi: {
      heading:
        "abliteration.ai: eigene abliterierte Modelle, Datenschutz schriftlich",
      body: "Eigene abliterierte Modelle im OpenAI- und Anthropic-Format. Laut Anbieter werden Prompts und Ausgaben im Arbeitsspeicher verarbeitet, standardmäßig nie gespeichert und nie zum Training genutzt. Dazu eine EU-Region und ein Policy-Gateway für deine eigenen Regeln.",
      catch:
        "Haken: teurer als Refuseless oder NEAR AI bei ähnlichen Gewichten, und die Basismodelle bleiben ungenannt.",
    },
    flatRate: {
      heading:
        "Featherless, Infermatic, Arli AI: Flatrate für intensives Roleplay",
      body: "Featherless führt über 50.000 Hugging-Face-Modelle, davon 1.398 als abliterated getaggt, mit einem Flatrate-Tarif Chat für 25 USD. Infermatic verkauft kuratierte 70B-Roleplay-Tunes ab 9 USD im Monat. Arli AI bietet Tarife mit unbegrenzten Tokens ab 15 USD und derestricted Feintunes. Alle drei sagen, dass sie keine Prompt-Logs führen.",
      catch:
        "Haken: Einzeltarife dürfen keine Apps antreiben, und du bekommst 1 bis 6 parallele Anfragen.",
    },
    deepInfra: {
      heading: "DeepInfra: günstige Standardmodelle, keine unzensierten",
      body: "Pro Token einer der günstigsten Anbieter für Standard-Open-Modelle: DeepSeek V4.1 Flash für 0,14 USD Input und 0,42 USD Output pro Million Tokens, 200 gleichzeitige Anfragen pro Modell. Laut Anbieter werden API-Eingaben nie auf Datenträgern gespeichert.",
      catch: "Haken: keine unzensierten und keine Roleplay-Modelle im Katalog.",
    },
  },
  gateways: {
    title: "Wenn du nur einen Router brauchst",
    intro:
      "Gateways routen zu den Anbietern, die du konfigurierst. Keines davon bringt unzensierte Modelle mit.",
    vercel:
      "Vercel AI Gateway: gehostet, Token-Preis des Anbieters ohne Aufschlag, gebaut für das AI SDK.",
    selfHost:
      "LiteLLM oder Bifrost: Open Source, selbst gehostet, mit eigenen Anbieterschlüsseln, Budgets und Fallbacks.",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone: Guardrails, Caching, Anfrage-Logs und Ausgabenkontrolle obendrauf.",
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
    weak: "Wo wir schwächer sind: OpenRouter schlägt nichts auf die Inferenz auf, nur 5,5 % Gebühr auf Guthaben-Käufe. Wir schlagen {{markup}} % auf unseren Einkaufspreis auf. Bei OpenRouter bringst du eigene Anbieterschlüssel mit, routest nur an Endpunkte ohne Datenspeicherung und wählst Anbieter pro Anfrage. Das alles haben wir nicht. Und die abliterierten Router oben unterbieten uns bei jedem Modell, das wir gemeinsam führen.",
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
    title: "Apps mit unzensierter API im Einzelnen",
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
      a: "Das hängt davon ab, was dir an OpenRouter fehlt. Abliterierte Gewichte zum Anbieterpreis: OpenUncensored, Refuseless oder NEAR AI Cloud. Der größte unzensierte Katalog: UncensoredLLM.ai oder Featherless. Bezahlen pro Nutzung mit Krypto: NanoGPT. Venices eigene Modelle und Datenschutzmodi: Venice. Lokal und gratis: Ollama. Unzensierte, offene und Mainstream-Modelle plus Medien und Team-Chat mit einem Schlüssel: {{appName}}.",
    },
    cheaper: {
      q: "Gibt es eine günstigere OpenRouter-Alternative?",
      a: "Vergleiche den Preis pro Modell, nicht die Gebühr. OpenRouter schlägt nichts auf die Inferenz auf, OpenUncensored nimmt keine Provision, und Refuseless und NEAR AI Cloud führen die günstigsten abliterierten Builds, die wir gefunden haben. Bei {{appName}} zahlst du unseren Einkaufspreis plus {{markup}} % Aufschlag, und auf jeder Modellseite steht der Preis pro Nachricht.",
    },
    uncensored: {
      q: "Welche OpenRouter-Alternative hat unzensierte Modelle?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI und {{appName}} liefern alle unzensierte Modelle per API. {{appName}} hat gerade {{apiUncensored}} in der API, abliterierte und feinabgestimmte neben {{ownModel}}.",
    },
    sdk: {
      q: "Kann ich meinen OpenAI-SDK-Code behalten?",
      a: "Ja. Base-URL und API-Schlüssel ändern, der Rest bleibt. Modell-IDs unterscheiden sich je Gateway, also tausch die auch. Beispiel: {{example}}.",
    },
    anthropic: {
      q: "Funktioniert das mit Anthropic-SDKs und Coding-Agents?",
      a: "Bei {{appName}} ja: Die Anthropic-Messages-API läuft neben den OpenAI-Formaten, sodass sich Claude Code und andere Agenten mit einem Schlüssel verbinden, unzensierte Modelle inklusive. OpenUncensored, Refuseless, NanoGPT und UncensoredLLM.ai sprechen ebenfalls Anthropic Messages. Venice hat keinen nativen Endpunkt und leitet Claude Code über einen lokalen Proxy.",
    },
    free: {
      q: "Gibt es eine kostenlose OpenRouter-Alternative?",
      a: "Ollama ist gratis, wenn deine Hardware das Modell stemmt. OpenRouter selbst hat 11 Gratis-Modelle mit Tageslimits, und Infermatic bietet einen kostenlosen Web-Tarif. {{appName}} gibt dir jeden Monat Gratis-Credits für den Chat, die API wird mit deinem ersten Kauf freigeschaltet.",
    },
    apiLink: "Unzensierte LLM-API: Modell-IDs, Code und Limits",
    veniceLink: "Venice-AI-Alternativen im Vergleich",
    nanoGptLink: "NanoGPT-Alternativen im Vergleich",
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
