import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Unzensierte AWS-Bedrock-Alternative: APIs im Vergleich | {{appName}}",
    description:
      "Bedrock Guardrails sind optional, Modell-Verweigerungen und AWS-Richtlinie bleiben. Custom Model Import für abliterierte Gewichte vs. {{appName}} und Venice.",
    category: "Entwickler-Guide",
    imageAlt: "Unzensierte Alternativen zu AWS Bedrock im Vergleich",
    keywords:
      "unzensierte AWS Bedrock Alternative, Bedrock Alternative, Bedrock ohne Guardrails, Bedrock Custom Model Import abliteriert, Bedrock unzensiertes Modell, Claude auf Bedrock Alternative, Bedrock Converse API Alternative, Anthropic Messages API, unzensierte LLM API, abliterierte Modelle API, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "8 Min. Lesezeit",
    title: "Unzensierte AWS-Bedrock-Alternativen",
    subtitle:
      "Guardrails, Verweigerungen, die AWS-Richtlinie und Custom Model Import, an der Quelle gelesen. Dann {{count}} Alternativen. Geprüft am {{date}}.",
  },
  intro: {
    lead: "Bedrock zwingt Ihnen keinen Filter auf. Lassen Sie die Guardrail weg, fügt Bedrock keine hinzu. Das Modell verweigert trotzdem, die AWS-Richtlinie gilt weiter, und im Katalog gibt es keine unzensierten Gewichte.",
    p2: "Die eigentliche Frage ist also, wo abliterierte Modelle laufen und was der Umzug kostet. Hier die Fakten aus der AWS-Doku, der Weg über Custom Model Import und die Code-Änderung für Nutzer von Claude auf Bedrock, die zu {{appName}} wechseln.",
  },
  bedrock: {
    title: "Was Bedrock filtert und was nicht",
    intro: "Direkt aus der AWS-Doku und der Richtlinie.",
    guardrails:
      "Guardrails sind Opt-in: Sie laufen nur, wenn Sie beim Aufruf eine Guardrail-ID und Version mitgeben.",
    refusals:
      "Keine Guardrail heißt nicht unzensiert: Die Modelle werden so ausgeliefert, wie ihre Anbieter sie liefern, also behalten Claude, Llama und die anderen ihre antrainierten Verweigerungen.",
    csam: "Immer an: Die automatische CSAM-Erkennung bei Bildeingaben und -ausgaben kann eine Anfrage mit HTTP 400 blockieren.",
    policy:
      "Richtlinie: Die AWS Responsible AI Policy verbietet, den Dienst zu nutzen, um Sicherheitsfilter vorsätzlich zu umgehen, außerdem Desinformation, nicht einvernehmliche sexuelle Bilder und Schaden für Minderjährige.",
    retention:
      "Missbrauchserkennung: AWS kann Ein- und Ausgaben in begrenzten Fällen speichern oder prüfen. Claude Fable 5, 5.1 und 5.2 behalten den gesamten Verkehr bis zu 30 Tage, OpenAI-Modelle außerhalb von gpt-oss behalten markierten Verkehr bis zu 30 Tage. Die Modellanbieter bekommen nichts davon.",
    models:
      "Keine unzensierten Gewichte: Der Katalog enthält DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma und Nemotron. Keins ist abliteriert.",
  },
  import: {
    title: "Eigene abliterierte Gewichte mitbringen: Custom Model Import",
    intro:
      "Bedrock kann Gewichte hosten, die Sie hochladen. Nur so läuft dort ein abliteriertes Modell.",
    architectures:
      "Unterstützte Architekturen: Mistral, Mixtral, Flan, Llama 2 bis 3.3, GPTBigCode, Qwen2 bis Qwen3 und gpt-oss 20B und 120B. Ein abliteriertes Llama, Qwen oder gpt-oss passt.",
    excluded:
      "Nicht unterstützt: DeepSeek-V3-, Kimi- und GLM-Architekturen. Qwen3-Importe unterstützen die Converse API nicht.",
    format:
      "Grenzen: Hugging-Face-Safetensors, unter 200 GB bei Textmodellen, Kontext unter 128K, keine Batch-Inferenz. Regionen: eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Kosten: $0.05718 pro Custom Model Unit und Minute in US East und Oregon, abgerechnet in 5-Minuten-Fenstern, plus $1.95 im Monat Speicher pro Unit. Frankfurt kostet $0.07144 pro Minute.",
    callout:
      "Sie zahlen für Modellkapazität pro Minute, nicht pro Token. Und die AWS-Richtlinie gegen das Umgehen von Sicherheitsfiltern gilt weiter für Ihr Konto.",
  },
  prices: {
    title: "Bedrocks eigene Preise für offene Modelle",
    intro:
      "Standard-Tarif, US East, pro 1M Token, Input / Output. Nur unveränderte Gewichte.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Unzensierte Gewichte anderswo, pro Token",
    oursIntro:
      "Die abliterierten Modelle, die Bedrock nicht führt: unsere gegen die günstigsten Hosts.",
  },
  apis: {
    title: "Converse gegen OpenAI- und Anthropic-Formate",
    intro:
      "Bedrock spricht InvokeModel und Converse auf bedrock-runtime und ergänzt Messages, Chat Completions und Responses auf seinem bedrock-mantle-Endpunkt. Wir sprechen OpenAI Chat Completions, die Responses API und Anthropic Messages unter einer Base-URL mit einem Schlüssel.",
    claude:
      "Für Nutzer von Claude auf Bedrock heißt das: Das Anthropic SDK funktioniert weiter. Den Bedrock-Client gegen den normalen tauschen, Base-URL und Schlüssel setzen. Claude Code nimmt dieselbe Base-URL als ANTHROPIC_BASE_URL.",
    before: "Vorher: Claude über den Bedrock-Client",
    after: "Nachher: derselbe Messages-Aufruf auf {{appName}}",
    swap: "Derselbe Code, jedes Modell: {{uncensoredExample}} ins Feld model schreiben, und der Aufruf geht stattdessen an ein unzensiertes Modell.",
    converse:
      "Heute auf Converse? Wechseln Sie einmal zum OpenAI- oder Anthropic-SDK, und jedes Gateway auf dieser Seite, uns eingeschlossen, ist nur eine Base-URL-Änderung entfernt.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex und Together im Vergleich",
    intro:
      "Jeder Hyperscaler lässt Sie irgendwo einen Filter senken. Keiner ändert die Nutzungsrichtlinie, und keiner liefert unzensierte Gewichte.",
  },
  us: {
    title: "{{appName}}: unzensierte Modelle ohne Gewichte-Import",
    intro:
      "{{modelCount}} Chatmodelle hinter einem Schlüssel, {{uncensored}} davon unzensiert. Zahlung pro Token, keine Kapazitätsminuten.",
    models:
      "Modelle: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM und Qwen neben {{uncensored}} unzensierten Modellen, darunter abliterierte GLM-, DeepSeek- und Kimi-Modelle, die Custom Model Import nicht aufnehmen kann. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt sind, und ergibt ein Modell mit politischen Gegenpositionen.",
    formats:
      "Formate: OpenAI Chat Completions, die Responses API und Anthropic Messages, dazu Bilder, Video, Musik, Sprache und Transkription.",
    consent:
      "Regeln: Unzensierte Modelle werden nach einer einmaligen 18+-Bestätigung für Ihr Konto freigeschaltet.",
    billing:
      "Abrechnung: ein Guthaben, unsere {{markup}}% Marge auf das, was wir dem Anbieter zahlen. Jedes Abo ab {{apiSubPrice}} im Monat schaltet API-Schlüssel frei.",
    weak: "Wo Bedrock uns schlägt: IAM, VPC, Regionen, eine AWS-Rechnung, ISO, SOC, CSA STAR, HIPAA-Eignung und FedRAMP High in GovCloud. Wir haben keinen SOC-2-Bericht, keinen BAA, kein SLA und keine Regionswahl, und jeder Prompt läuft über uns zum Anbieter, der das Modell betreibt.",
    docsLink: "API-Doku: Endpunkte, Authentifizierung und Limits",
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
  list: {
    title: "Die Alternativen, eine nach der anderen",
    intro:
      "Aus deren eigenen Seiten und Modelllisten, gelesen am {{date}}. Was jede ist, wo sie gewinnt und der Haken.",
  },
  stay: {
    title: "Wann Sie bei Bedrock bleiben sollten",
    intro:
      "Wenn Ihre Last in AWS liegt, ist die Filterfrage vielleicht die kleine.",
    compliance:
      "Sie brauchen den Compliance-Umfang, IAM- und VPC-Kontrollen und eine einzige AWS-Rechnung.",
    retention:
      "Sie brauchen Zero Retention pro Region: Bedrocks Retention-Modus none, per API gesetzt.",
    weights:
      "Ihr abliteriertes Modell ist ein Llama, Qwen oder gpt-oss, und stetiger Traffic rechtfertigt es, für Kapazitätsminuten zu zahlen.",
    callout:
      "Viele Teams teilen auf: Bedrock für die Produktion innerhalb von AWS, ein zweiter Schlüssel für Fiktion, Rollenspiel, Recherche und Red-Teaming.",
  },
  faq: {
    title: "FAQ",
    guardrails: {
      q: "Filtert Bedrock Inhalte ohne Guardrails?",
      a: "Bedrock fügt keine Filterschicht hinzu, solange Sie keine Guardrail anhängen, außer der automatischen CSAM-Erkennung bei Bildern. Die Modelle behalten ihre antrainierten Verweigerungen, und die AWS Responsible AI Policy gilt weiter.",
    },
    uncensored: {
      q: "Hat Bedrock unzensierte oder abliterierte Modelle?",
      a: "Nicht im Katalog. Der einzige Weg ist Custom Model Import eigener Gewichte, für unterstützte Architekturen wie Llama, Qwen und gpt-oss.",
    },
    cost: {
      q: "Was kostet Custom Model Import?",
      a: "$0.05718 pro Custom Model Unit und Minute in US East und Oregon, abgerechnet in 5-Minuten-Fenstern, plus $1.95 im Monat Speicher pro Unit. Sie zahlen für Kapazität, nicht pro Token.",
    },
    claude: {
      q: "Kann ich Code für Claude auf Bedrock ohne Umbau umziehen?",
      a: "Ja. AnthropicBedrock durch den normalen Anthropic-Client ersetzen, base_url auf die {{appName}}-Base-URL ohne /v1 setzen, Ihren Schlüssel und unsere Modell-ID nutzen. Messages-Request und -Antwort behalten ihre Form.",
    },
    converse: {
      q: "Unterstützt {{appName}} die Bedrock Converse API?",
      a: "Nein. Wir sprechen OpenAI Chat Completions, die Responses API und Anthropic Messages. Wer einmal von Converse weggeht, ist bei jedem OpenAI- oder Anthropic-kompatiblen Anbieter nur eine Base-URL-Änderung entfernt.",
    },
    enterprise: {
      q: "Bietet {{appName}} SOC 2, einen BAA oder ein SLA?",
      a: "Nein. Brauchen Sie das, lassen Sie die regulierte Last auf Bedrock und nutzen {{appName}}, wo Verweigerungen im Weg stehen.",
    },
    apiLink: "Unzensierte LLM-API: Modell-IDs, Code und Limits",
    azureLink: "Unzensierte Azure-OpenAI-Alternativen",
    openRouterLink: "OpenRouter-Alternativen im Vergleich",
    keysLink: "API-Schlüssel verwalten",
  },
  cta: {
    title: "Keine Kapazitätsminuten. Kein Verweigerungsreflex.",
    subtitle:
      "Testen Sie die Modelle zuerst im Chat, {{guestCredits}} Gratis-Credits im Monat, ohne Konto. Dann richten Sie Ihr SDK auf die API.",
    start: "Unzensiertes Modell ausprobieren",
    docs: "API-Doku lesen",
  },
};
