import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Unzensierte LLM-API: abliterierte Modelle | {{appName}}",
    description:
      "Unzensierte und abliterierte Modelle hinter einer OpenAI- und Anthropic-kompatiblen API. Modell-IDs, Preise im Vergleich zu anderen Hosts, was Vertex, Azure, Bedrock und Together wirklich erlauben, Code und Limits.",
    category: "Entwickler-Guide",
    imageAlt: "Unzensierte LLM-API mit OpenAI-kompatiblen Endpunkten",
    keywords:
      "unzensierte LLM API, unzensierte KI API, abliterierte Modelle API, abliteriertes LLM API, LLM API ohne Inhaltsfilter, LLM API ohne Content-Filter, unzensierte OpenAI-kompatible API, NSFW LLM API, Gemini API Safety Settings aus, Vertex AI unzensiert, Together AI unzensiert, unzensierte Azure OpenAI Alternative, unzensierte Bedrock Alternative, gehostete abliterierte Modelle, Venice API Alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "12 Min. Lesezeit",
    title: "Unzensierte LLM-API. Ihr SDK. Ohne Verweigerungsreflex.",
    subtitle:
      "{{count}} unzensierte Modelle hinter einem OpenAI- und Anthropic-kompatiblen Schlüssel. Modell-IDs, Kontext und Preise live aus unserem Register.",
  },
  intro: {
    lead: "Ihre Anwendung braucht ein Modell, das antwortet. Keins, das belehrt, keins, das die Hälfte Ihrer Testprompts ablehnt. Mainstream-APIs filtern per Design, und abliterierte Gewichte selbst zu betreiben heißt: GPUs mieten.",
    p2: "{{appName}} stellt {{count}} unzensierte Modelle über dieselben /v1-Endpunkte bereit wie jedes Mainstream-Modell. Base-URL ändern, OpenAI- oder Anthropic-SDK behalten, unzensierte Modell-ID wählen. Hier sind Liste, Code, Preise neben anderen Hosts, was die großen Clouds wirklich erlauben und der ehrliche Haken.",
    access:
      "Vorab: Die API braucht ein bezahltes Konto. Jedes Abo ab {{subPrice}} im Monat schaltet sie frei. Gratis- und Bonus-Credits nicht.",
    accessLink: "API freischalten",
  },
  models: {
    title: "{{count}} unzensierte Modelle über die API",
    intro:
      "Jedes aktuelle unzensierte Textmodell, das günstigste zuerst. Die ID exakt so ins model-Feld übernehmen.",
    colModel: "Modell",
    colId: "Modell-ID",
    colContext: "Kontext",
    colTools: "Tools",
    colPrice: "Pro Nachricht",
    yes: "Ja",
    no: "Nein",
    footnote:
      "Pro Nachricht heißt: ein Referenz-Austausch über die günstigste Route. Die API rechnet pro Token ab, und jede Antwort nennt den exakten Betrag in usage.credits_charged. GET /v1/models liefert dieselbe Liste mit Token-Preisen.",
  },
  code: {
    title: "Ein Request",
    intro:
      "Das günstigste unzensierte Modell ist gerade {{example}}. Jede ID aus der Tabelle funktioniert genauso.",
    prompt:
      "Nenne mir die stärksten Argumente für und gegen Atomkraft. Ohne Disclaimer.",
    curl: "curl",
    python: "OpenAI Python SDK",
    anthropic:
      "Lieber das Anthropic SDK oder Claude Code? Auf dieselbe Base-URL ohne /v1 zeigen, dann rufen sie /v1/messages auf, mit denselben Modellen und demselben Schlüssel.",
  },
  consent: {
    title: "Der eine 18+-Schritt",
    intro:
      "Unzensierte Modelle sind nur für Volljährige. Die API prüft das einmal.",
    where:
      "Einmal auf der Seite für API-Schlüssel bestätigen, dass Sie 18 oder älter sind.",
    link: "API-Schlüssel öffnen",
    error:
      "Ohne Bestätigung liefert ein Request an ein unzensiertes Modell 403 uncensored_consent_required, und es wird nichts berechnet.",
    once: "Danach können Ihre Schlüssel die unzensierten Modelle aufrufen.",
  },
  kinds: {
    title: "Welches unzensierte Modell für welche Aufgabe",
    intro:
      "In der Tabelle stehen drei Arten. Sie verhalten sich unterschiedlich.",
    abliterated:
      "Abliteriert: ein Mainstream- oder offenes Modell, dem das Verweigerungsverhalten aus den Gewichten geschnitten wurde. Gleiches Training, gleiches Wissen, gleiches Weltbild. Es antwortet einfach. Die Standardwahl für die meisten Anwendungen.",
    fineTuned:
      "Nachtrainiert: ein offenes Modell, weiter trainiert mit ungefilterten Daten. Oft lockerer im Ton, beliebt für Fiktion und Rollenspiel.",
    own: "{{ownModel}}: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Die Wahl, wenn Sie Positionen brauchen, die Mainstream-Modelle nicht liefern.",
    link: "Abliteriert, nachtrainiert oder eigenes Weltbild: die ganze Erklärung",
  },
  limits: {
    title: "Limits, die Sie kennen sollten",
    intro: "Die harten Kanten, bevor Sie live gehen.",
    stateless:
      "Zustandslos. Bei uns wird kein Gespräch gespeichert. Schicken Sie jedes Mal den vollen Verlauf.",
    maxTokens: "Die Ausgabe ist auf {{maxTokens}} Token pro Request begrenzt.",
    rateLimit:
      "Kein festes Ratenlimit. Abrechnung pro Anfrage aus Ihrem Guthaben, mit großzügigem Missbrauchsschutz. HTTP 429 vom Modellanbieter wird mit Retry-After-Header durchgereicht.",
    tools:
      "Tool-Calls funktionieren nur bei Modellen, die sie unterstützen. Die Tabelle zeigt, welche. Sonst kommt 400 tools_not_supported.",
    refusals:
      "Unzensiert heißt nicht unfehlbar. Ein Modell kann trotzdem ablehnen oder Fakten falsch wiedergeben. Testen Sie Ihre Prompts an zwei Modellen, bevor Sie sich festlegen.",
  },
  privacy: {
    title: "Was mit Ihren Prompts passiert",
    intro: "Die API behält die Rechnung, keinen Chatverlauf.",
    noStore:
      "Die API legt keine Chat-Threads an. Aufgezeichnet wird nur der Abrechnungseintrag: welches Modell, wie viele Credits.",
    upstream:
      "Jeder Prompt läuft über uns zum Anbieter, der das Modell betreibt. Für das, was er erhält, gelten seine Bedingungen. Unsere Datenschutzerklärung enthält kein eigenes Versprechen zu Nicht-Protokollierung oder Nicht-Training, bewerten Sie uns also nach dem, was sie tatsächlich sagt.",
    callout:
      "Dürfen Prompts Ihre Infrastruktur nie verlassen, betreiben Sie abliterierte Gewichte auf eigener Hardware. Für alles andere ist die API schneller live.",
  },
  abliterated: {
    title: "API für abliterierte Modelle: wer welche Gewichte anbietet",
    intro:
      "Dieselben abliterierten Gewichte liegen bei mehreren Hosts. Hier steht, was jeder pro Token verlangt, heute aus deren öffentlichen Modelllisten gelesen.",
    honest:
      "Ehrliche Einschätzung: Bei den Preisen gewinnen die Router. OpenUncensored und Refuseless verkaufen GLM 5.3 Flash und DeepSeek V4.1 Flash abliterated für $0.12 Input. Unser gelisteter Preis enthält {{markup}}% Marge. Die zahlen Sie für einen Schlüssel über unzensierte, offene und Mainstream-Modelle, Medien, das Anthropic-Format und einen Chat, den Ihr Team nutzen kann.",
  },
  noFilter: {
    title: "LLM-API ohne Inhaltsfilter: was Abschalten wirklich heißt",
    intro:
      "Jede große Cloud lässt Sie einen Filter senken. Keine entfernt die antrainierten Verweigerungen des Modells oder seine Nutzungsrichtlinie.",
    vertex:
      "Vertex AI und die Gemini API: Sicherheitsschwellen lassen sich auf OFF setzen, und OFF ist bei Vertex ab gemini-3.5-flash der Standard. Kinderschutz und andere Kernschäden bleiben blockiert, und Geminis Alignment verweigert weiterhin. Googles Prohibited Use Policy verbietet sexuell explizite Inhalte und das Umgehen von Sicherheitsfiltern, mit Ausnahmen für Bildung, Dokumentation, Wissenschaft oder Kunst. Eigene Gewichte: Model Garden Self-Deploy auf vLLM- oder TGI-Containern.",
    together:
      "Together AI: 24 Serverless-Chatmodelle, keins unzensiert. Die Bedingungen verbieten obszöne Inhalte und Pornografie. Eigene Gewichte laufen auf dedizierten Endpunkten ab $5.49 pro H100-Stunde, und Uploads müssen Fine-Tunes einer Architektur sein, die Together bereits unterstützt.",
    azure:
      "Azure OpenAI: Filter standardmäßig an, aus nur nach genehmigtem Antrag, und der Code of Conduct verbietet erotische und romantische Chatbots in jedem Fall.",
    bedrock:
      "AWS Bedrock: kein Filter, solange Sie keine Guardrail anhängen, aber Verweigerungen und die AWS-Richtlinie bleiben. Abliterierte Gewichte brauchen Custom Model Import, abgerechnet pro Kapazitätsminute.",
    azureLink: "Unzensierte Azure-OpenAI-Alternativen, ausführlich",
    bedrockLink: "Unzensierte AWS-Bedrock-Alternativen, ausführlich",
  },
  others: {
    title: "Andere unzensierte APIs, ehrlich verglichen",
    intro:
      "Wir sind nicht die einzige Option. Bei einigen kaufen wir selbst ein. Fakten aus deren eigener Doku, Modelllisten und Preisseiten, gelesen am {{date}}.",
    versusLink: "{{appName}} vs. {{name}}: der ganze Vergleich",
    routerLink:
      "Wechsel von OpenRouter: ein Schlüssel für alle Modelle, drei API-Formate",
    openRouterAlternatives: "OpenRouter-Alternativen im Vergleich",
    veniceAlternatives: "Venice-AI-Alternativen im Vergleich",
    freedomGptAlternatives: "FreedomGPT-Alternativen im Vergleich",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Gibt es eine kostenlose unzensierte LLM-API?",
      a: "Bei uns nicht. Die Chat-App hat Gratis-Credits, die API nicht. Jedes Abo ab {{subPrice}} im Monat schaltet API-Schlüssel frei. Lokale Tools wie Ollama bieten eine kostenlose lokale API, wenn Ihre Hardware das Modell stemmt.",
    },
    ids: {
      q: "Welche Modell-IDs sind unzensiert?",
      a: "Gerade {{count}}, oben in der Tabelle mit exakter ID. GET /v1/models liefert jedes Modell, das Ihr Schlüssel aufrufen kann, mit Preisen und Tool-Support.",
    },
    sdk: {
      q: "Funktioniert die unzensierte API mit dem OpenAI SDK?",
      a: "Ja. base_url auf die {{appName}}-Base-URL setzen, Ihren Schlüssel nutzen und eine unzensierte Modell-ID ins model-Feld schreiben. Das Anthropic SDK geht auch, mit derselben Base-URL ohne /v1.",
    },
    refuse: {
      q: "Verweigert ein unzensiertes Modell nie?",
      a: "Viel seltener, nicht nie. Abliterierte Modelle verlieren den antrainierten Verweigerungsreflex, können aber trotzdem ablehnen oder danebenliegen. Testen Sie mit Ihren echten Prompts.",
    },
    logs: {
      q: "Protokolliert {{appName}} meine API-Prompts?",
      a: "Die API legt keine Chat-Threads an, nur den Abrechnungseintrag: Modell und berechnete Credits. Jeder Prompt läuft über uns zum Anbieter, der das Modell betreibt, unter dessen eigenen Bedingungen. Unsere Datenschutzerklärung enthält kein eigenes Versprechen zur Nicht-Protokollierung. Brauchen Sie das als Vertrag, hosten Sie selbst.",
    },
    abliterated: {
      q: "Welche API bietet abliterierte Modelle an?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice und {{appName}} bieten abliterierte Gewichte über eine OpenAI-kompatible API an. Die Router sind pro Token am günstigsten. {{appName}} ergänzt Mainstream-Modelle, Medien und einen Web-Chat unter demselben Schlüssel.",
    },
    noFilter: {
      q: "Gibt es eine LLM-API ohne Inhaltsfilter?",
      a: "Bedrock ohne Guardrail und Gemini mit Safety Settings auf OFF fügen keine Filterschicht hinzu, aber ihre Modelle behalten antrainierte Verweigerungen, und ihre Richtlinien verbieten sexuelle Inhalte. Bei Azure braucht das Abschalten der Filter einen genehmigten Antrag. Für Modelle, die nicht verweigern, nehmen Sie abliterierte oder nachtrainierte Gewichte: hier gehostet, bei den Routern oben oder auf eigenen GPUs.",
    },
    vertex: {
      q: "Kann ich die Gemini-Sicherheitsfilter ausschalten?",
      a: "Ja. In der Gemini API stehen nicht gesetzte Kategorien ab Gemini 2.5 standardmäßig auf Off, und bei Vertex ist OFF ab gemini-3.5-flash der Standard. Kernschäden wie Kinderschutz bleiben blockiert, Geminis antrainierte Verweigerungen bleiben, und Googles Richtlinie verbietet sexuell explizite Inhalte und das Umgehen von Sicherheitsfiltern.",
    },
    local: {
      q: "Sollte ich abliterierte Modelle lieber selbst hosten?",
      a: "Mit eigenen GPUs und strengen Datenregeln: ja. Ein lokales Tool stellt eine OpenAI-kompatible API auf Ihrem eigenen Rechner bereit. Wollen Sie unzensierte Modelle in Frontier-Größe ohne gemietete Hardware, ist eine gehostete API der günstigere Start.",
    },
    docsLink: "Zur vollständigen API-Referenz",
    directoryLink: "Abliterierte Modelle im Chat ansehen",
  },
  cta: {
    title: "Erst testen. Dann einbauen.",
    subtitle:
      "Jedes Modell aus der Tabelle läuft auch in der Chat-App. Prompts dort testen, dann die ID in den Code kopieren.",
    chat: "Unzensiertes Modell im Chat testen",
    docs: "API-Doku lesen",
  },
};
