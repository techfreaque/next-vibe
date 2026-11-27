import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Unzensierte Azure-OpenAI-Alternative: APIs im Vergleich | {{appName}}",
    description:
      "Azure filtert standardmäßig jedes Modell und verbietet erotische und romantische Chatbots auch ohne Filter. Vergleich von {{appName}}, OpenRouter, Venice, NanoGPT, abliterierten APIs, Bedrock, Vertex und Self-Hosting.",
    category: "Entwickler-Guide",
    imageAlt: "Unzensierte Alternativen zu Azure OpenAI im Vergleich",
    keywords:
      "unzensierte Azure OpenAI Alternative, Azure OpenAI Alternative, Azure OpenAI Inhaltsfilter ausschalten, Azure OpenAI ohne Inhaltsfilter, Azure modified content filtering, Azure Abuse Monitoring Opt-out, Azure OpenAI NSFW, LLM API ohne Inhaltsfilter, unzensierte LLM API, abliterierte Modelle API, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "10 Min. Lesezeit",
    title: "Unzensierte Azure-OpenAI-Alternativen",
    subtitle:
      "Azures Filter, die Genehmigungshürde und der Code of Conduct, an der Quelle gelesen. Dann {{count}} Alternativen, ehrlich darüber, wo jede gewinnt. Geprüft am {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI filtert standardmäßig jedes Modell. Den Filter auszuschalten verlangt einen genehmigten Antrag. Und selbst mit Genehmigung verbietet der Code of Conduct weiterhin erotische und romantische Chatbots.",
    p2: "Wenn Ihr Produkt aus Fiktion, Rollenspiel, Companions, Red-Teaming oder schlicht unverblümten Antworten besteht, ist das eine Mauer, keine Einstellung. Hier steht genau, was Azure erlaubt, was es ersetzt, und die Code-Änderung, um einen Azure-OpenAI-Client auf {{appName}} umzustellen.",
  },
  azure: {
    title: "Was Azure tatsächlich filtert",
    intro: "Direkt aus Microsofts eigener Doku und den Richtlinien.",
    defaults:
      "Standardmäßig an: Microsoft Foundry wendet auf jedes Modell außer Whisper Standard-Sicherheitseinstellungen an. Auf High only lockern können Sie selbst.",
    approval:
      "Aus nur mit Genehmigung: Die Optionen No filters und Annotate only brauchen die Genehmigung für modifizierte Inhaltsfilterung. Bewerben können sich nur Kunden, die von einem Microsoft-Account-Team betreut werden oder in einem berechtigten Programm sind.",
    conduct:
      "Aus ist keine Erlaubnis: Der Code of Conduct verbietet sexuell explizite Inhalte, auch sexuell anzügliche und Fetisch-Inhalte, und verbietet Chatbots, die erotisch oder romantisch sind oder für erotische oder romantische Zwecke genutzt werden. Drastische Gewalt, Gore und Hassrede sind ebenfalls verboten.",
    monitoring:
      "Abuse Monitoring: Markierte Prompts und Antworten gehen standardmäßig in eine automatische Prüfung und bei Bedarf an Microsoft-Mitarbeiter. Die Daten liegen in einem Abuse-Monitoring-Speicher in der Geografie Ihrer Ressource.",
    sunset:
      "Opt-out läuft aus: Laut Microsofts Changelog vom 17. November 2026 ist Modified Abuse Monitoring für Modelle, die ab dem 1. November 2026 erscheinen, nicht mehr verfügbar, ab einem noch nicht genannten Datum.",
    models:
      "Keine unzensierten Modelle: Im Katalog fanden wir kein abliteriertes oder unzensiertes Modell. DeepSeek- und Llama-Modelle sind gelistet, keins davon abliteriert.",
    callout:
      "Fazit: Auf Azure verstößt eine Fiktions- oder Companion-App für Erwachsene gegen den Code of Conduct, egal was Ihre Filtereinstellungen sagen.",
  },
  rules: {
    title: "Azure, Bedrock, Vertex und Together: was Abschalten wirklich heißt",
    intro:
      "Jeder Hyperscaler lässt Sie irgendwo einen Filter senken. Keiner ändert die Nutzungsrichtlinie, und keiner liefert unzensierte Gewichte.",
  },
  us: {
    title:
      "{{appName}}: unzensierte Modelle über eine OpenAI- und Anthropic-API",
    intro:
      "{{modelCount}} Chatmodelle hinter einem Schlüssel, {{uncensored}} davon unzensiert. Keine Filterschicht über dem gewählten Modell.",
    models:
      "Modelle: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM und Qwen neben {{uncensored}} unzensierten Modellen. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt sind, und ergibt ein Modell mit politischen Gegenpositionen.",
    formats:
      "Formate: OpenAI Chat Completions, die OpenAI Responses API und die Anthropic Messages API, dazu Bilder, Video, Musik, Sprache und Transkription mit demselben Schlüssel.",
    consent:
      "Regeln: Unzensierte Modelle werden nach einer einmaligen 18+-Bestätigung für Ihr Konto freigeschaltet. Kein Antrag, kein Account-Team.",
    billing:
      "Abrechnung: ein Guthaben, unsere {{markup}}% Marge auf das, was wir dem Anbieter zahlen. Jedes Abo ab {{apiSubPrice}} im Monat schaltet API-Schlüssel frei. Karte, PayPal oder Krypto.",
    limits:
      "Limits: {{burst}} Requests pro Minute und {{streams}} gleichzeitige Streams pro Schlüssel als Missbrauchsgrenze. Ratenlimits der Anbieter werden durchgereicht.",
    weak: "Wo Azure uns schlägt: Wir haben keinen SOC-2-Bericht, keinen BAA, kein SLA und keine Regionswahl. Jeder Prompt läuft über uns zum Anbieter, der das Modell betreibt. Unsere {{markup}}% Marge machen uns pro Token teurer als die abliterierten Router unten. Einen Embeddings-Endpunkt gibt es auch nicht.",
    before: "Vorher: der Azure-OpenAI-Client",
    after: "Nachher: dasselbe SDK, auf {{appName}} gerichtet",
    codeNote:
      "Drei Dinge ändern sich. AzureOpenAI wird zu OpenAI mit einer base_url. Ihr Deployment-Name wird zu einer Modell-ID. Und content_filter_results verschwindet aus den Antworten, weil es keine Filterschicht gibt, über die berichtet werden könnte.",
    docsLink: "API-Doku: Endpunkte, Authentifizierung und Limits",
    formatsLink: "OpenAI- und Anthropic-kompatible API, erklärt",
    toolsLink: "Ein Schlüssel in Claude Code, Codex CLI, Aider und mehr",
  },
  models: {
    title: "{{apiUncensored}} unzensierte Modelle heute über die API",
    intro:
      "Jedes unzensierte Modell, das Sie aufrufen können, mit der ID, die Sie als model übergeben. Das günstigste zuerst.",
    colModel: "Modell",
    colId: "API-ID",
    colContext: "Kontext",
    colPrice: "Pro Nachricht",
  },
  prices: {
    title: "Preis pro Token, unserer gegen die günstigsten Hosts",
    intro:
      "Gleiche Gewichte, andere Hosts. Pro Token sind wir nicht die Günstigsten. Sie zahlen für einen Schlüssel über unzensierte, offene und Mainstream-Modelle plus einen Web-Chat.",
  },
  list: {
    title: "Die Alternativen, eine nach der anderen",
    intro:
      "Aus deren eigenen Seiten und Modelllisten, gelesen am {{date}}. Was jede ist, wo sie gewinnt und der Haken.",
  },
  stay: {
    title: "Wann Sie bei Azure bleiben sollten",
    intro: "Manchmal ist der Filter der Preis für den nötigen Papierkram.",
    compliance:
      "Sie brauchen Compliance-Programme, regionale Datenhaltung und ein Account-Team. Das verkaufen die Hyperscaler. Bedrock nennt zum Beispiel ISO, SOC, CSA STAR, HIPAA-Eignung und FedRAMP High in GovCloud.",
    privacy:
      "Sie brauchen Microsofts Datenbedingungen: Prompts und Antworten stehen OpenAI nicht zur Verfügung und werden ohne Ihre Erlaubnis nicht zum Training von Foundation-Modellen genutzt.",
    sfw: "Ihr Produkt ist ohnehin jugendfrei. Dann kosten Sie Azures Standardwerte wenig.",
    callout:
      "Viele Teams teilen auf: Azure für die regulierte Last, ein zweiter Schlüssel für Fiktion, Rollenspiel, Recherche und Red-Teaming.",
  },
  faq: {
    title: "FAQ",
    off: {
      q: "Kann ich den Inhaltsfilter von Azure OpenAI ausschalten?",
      a: "Nur mit Genehmigung. Kunden können Filter selbst auf High only lockern. No filters und Annotate only brauchen einen genehmigten Antrag für modifizierte Inhaltsfilterung, offen für Kunden mit Microsoft-Account-Team oder in einem berechtigten Programm.",
    },
    nsfw: {
      q: "Erlaubt Azure OpenAI NSFW- oder Companion-Apps ohne Filter?",
      a: "Nein. Der Microsoft Code of Conduct verbietet sexuell explizite Inhalte und erotische oder romantische Chatbots. Filtereinstellungen ändern den Code of Conduct nicht.",
    },
    monitoring: {
      q: "Kann ich dem Azure Abuse Monitoring noch widersprechen?",
      a: "Genehmigte Kunden konnten das. Laut Microsofts Changelog vom 17. November 2026 ist Modified Abuse Monitoring für Modelle, die ab dem 1. November 2026 erscheinen, nicht mehr verfügbar, ab einem noch nicht genannten Datum.",
    },
    best: {
      q: "Was ist die beste unzensierte Azure-OpenAI-Alternative?",
      a: "Günstigste abliterierte Token: OpenUncensored oder Refuseless. Riesiger Mainstream-Katalog: OpenRouter. Venices eigene unzensierte Modelle: Venice. Prompts, die Ihre Rechner nie verlassen: Ollama, LM Studio oder vLLM. Unzensierte, offene und Mainstream-Modelle plus Team-Chat unter einem OpenAI- und Anthropic-Schlüssel: {{appName}}.",
    },
    sdk: {
      q: "Kann ich meinen Azure-OpenAI-SDK-Code behalten?",
      a: "Größtenteils. AzureOpenAI durch OpenAI ersetzen, base_url und Schlüssel setzen und den Deployment-Namen durch eine Modell-ID wie {{example}} ersetzen. Requests und Antworten behalten die OpenAI-Form.",
    },
    enterprise: {
      q: "Bietet {{appName}} SOC 2, einen BAA oder ein SLA?",
      a: "Nein. Brauchen Sie das, lassen Sie die regulierte Last bei einem Hyperscaler und nutzen {{appName}}, wo Filter im Weg stehen.",
    },
    apiLink: "Unzensierte LLM-API: Modell-IDs, Code und Limits",
    bedrockLink: "Unzensierte AWS-Bedrock-Alternativen",
    openRouterLink: "OpenRouter-Alternativen im Vergleich",
    keysLink: "API-Schlüssel verwalten",
  },
  cta: {
    title: "Dasselbe SDK. Keine Filterschicht.",
    subtitle:
      "Testen Sie die Modelle zuerst im Chat, {{guestCredits}} Gratis-Credits im Monat, ohne Konto. Dann binden Sie die API ein.",
    start: "Unzensiertes Modell ausprobieren",
    docs: "API-Doku lesen",
  },
};
