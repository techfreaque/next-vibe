import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "OpenRouter-Alternative | OpenAI- und Anthropic-API | {{appName}}",
    description:
      "Vergleiche {{appName}} mit OpenRouter. Nutze dein OpenAI-SDK mit einer API für {{modelCount}} Chatmodelle und {{mediaModelCount}} Medienmodelle.",
    category: "Entwickler-Guide",
    imageAlt: "{{appName}}: ein API-Endpoint für jedes Modell",
    keywords:
      "{{appName}}, OpenRouter-Alternative, OpenRouter Alternative, eine API für GPT Claude Gemini, OpenAI-kompatible API, OpenAI compatible API, Anthropic-kompatible API, Anthropic Messages API, Responses API, Claude Code mit anderen Modellen, Codex CLI eigener Provider, LLM-API-Gateway, unzensierte Modelle API",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Entwickler-Guide",
    readTime: "11 Min. Lesezeit",
    title: "Ein API-Key. {{modelCount}} Modelle. Drei Wire-Formate.",
    subtitle:
      "Nutze Chat Completions, Responses oder Anthropic Messages mit einem {{appName}}-Schlüssel. Behalte dein SDK, ändere Basis-URL und Schlüssel und prüfe die Modell-ID. Derselbe Schlüssel funktioniert auch für {{mediaModelCount}} Medienmodelle.",
  },
  intro: {
    lead: "GPT bei OpenAI, Claude bei Anthropic, Gemini bei Google. Drei SDKs, drei Keys, drei Rechnungen, drei Dashboards. Oder schlimmer: Dein Lieblingstool spricht nur ein Format und bekommt damit nur die Modelle eines Anbieters.",
    p2: "{{appName}} bündelt {{modelCount}} Chat-Modelle von {{providerCount}} Labs hinter einem Key und einem Credit-Guthaben. Du rufst sie im OpenAI-Format, im Responses-Format oder im Anthropic-Format auf. Dieselben Modelle an jedem Endpoint. Hier steht genau, wie es funktioniert, was es kostet und wann der direkte Weg oder ein Router die bessere Wahl ist.",
    access:
      "Vorab: Die API braucht ein bezahltes Konto. Jeder Tarif schaltet sie frei, ab {{subPrice}} im Monat. Gratis- und Bonus-Credits nicht.",
    accessLink: "API freischalten",
  },
  endpoints: {
    title: "Alle Endpoints, ein Key",
    intro:
      "Jeder Endpoint nimmt denselben Key und belastet dasselbe Guthaben. Die drei Chat-Formate bedienen dieselben Modelle.",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions. Streaming per SSE mit data: [DONE] am Ende, stream_options.include_usage, Tool Calling. Das Format, das fast jeder OpenAI-kompatible Client spricht.",
    responses:
      "POST /v1/responses: die OpenAI Responses API, das Format von Codex CLI. Streaming und Tools. Zustandslos: store ist false, previous_response_id wird mit 400 abgelehnt. Schick also in jedem Turn den vollständigen Input.",
    messages:
      "POST /v1/messages: die Anthropic Messages API. Streaming und Tool Use. Damit reden Claude Code und die Anthropic-SDKs.",
    countTokens:
      "POST /v1/messages/count_tokens: kostet keine Credits. Eine lokale Schätzung ohne Modellaufruf, die nicht auf dein Rate-Limit pro Minute zählt. Claude Code ruft das ständig auf, um seinen Kontext zu bemessen.",
    models:
      "GET /v1/models: jedes Modell, das dein Key gerade aufrufen darf, mit Kontextlänge, Tool-Support und Preisen. Ein Response-Body, den die OpenAI- und die Anthropic-SDKs gleichermaßen parsen.",
    media:
      "Medien im OpenAI-Format, {{mediaModelCount}} Modelle: POST /v1/images/generations und /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions und /v1/audio/translations. Video (POST /v1/videos) und Musik (POST /v1/music) laufen als asynchrone Jobs: starten, abfragen, herunterladen. GET /v1/models kennzeichnet jedes Modell mit seiner modality.",
    auth: "Authentifizierung geht auf zwei Arten, an jedem Endpoint. Authorization: Bearer sk-unb-... für OpenAI-Clients und für Claude Code mit ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... für die Anthropic-SDKs. Keys beginnen mit sk-unb-, werden genau einmal angezeigt und nur als Hash gespeichert. Du erstellst sie unter Einstellungen > API-Keys, bis zu 20 aktive Keys pro Konto.",
    baseUrlLabel: "Basis-URL",
    baseUrlNote:
      "Für OpenAI-SDKs und Tools im OpenAI-Stil. Das Locale gehört zum Pfad. Es legt nur die Sprache der Fehlermeldungen fest, jedes unterstützte Locale funktioniert, aber fehlen darf es nicht.",
    anthropicBaseUrlLabel: "Anthropic-Basis-URL",
    anthropicBaseUrlNote:
      "Für die Anthropic-SDKs und Claude Code. Dieselbe URL ohne /v1: /v1/messages hängen sie selbst an.",
  },
  switching: {
    title: "Von OpenRouter zu {{appName}} wechseln",
    intro:
      "Du suchst eine OpenRouter-Alternative? Beide Dienste akzeptieren Chat-Completions-Anfragen im OpenAI-Format. Du kannst dein OpenAI-SDK weiterverwenden und seine Konfiguration anpassen.",
    key: "Aktiviere den API-Zugang in deinem {{appName}}-Konto und erstelle in den Einstellungen einen neuen API-Schlüssel.",
    baseUrl:
      "Setze im OpenAI-Client die oben angegebene Basis-URL für deine Sprache ein, einschließlich /v1.",
    model:
      "Rufe GET /v1/models in der neuen API auf und übernimm eine der ausgegebenen IDs in das Feld model.",
    routing:
      "Prüfe vor dem Wechsel alle OpenRouter-spezifischen Routing-Optionen. Teste die Funktionen deiner App, etwa Streaming oder Tool-Aufrufe, mit dem gewählten Modell.",
    openrouterDocs: "API-Referenz von OpenRouter",
  },
  samples: {
    title: "Code: dein SDK, unsere Basis-URL",
    intro:
      "Keine neue Client-Bibliothek. Die offiziellen SDKs von OpenAI und Anthropic funktionieren unverändert. Ersetze sk-unb-YOUR_KEY durch deinen Key.",
    curl: {
      title: "curl",
      body: "Der schnellste Beweis, dass dein Key funktioniert. Eine schlichte Chat Completion, nichts zu installieren.",
      caption: "Chat Completions mit curl",
    },
    openai: {
      title: "OpenAI Python SDK",
      body: "Setz base_url und api_key am Client und ruf wie gewohnt chat.completions.create auf. Jedes Modell aus GET /v1/models passt ins model-Feld, Claude und Gemini eingeschlossen.",
      caption: "Chat Completions mit dem OpenAI SDK",
      responses:
        "Derselbe Client spricht auch die Responses API: client.responses.create. Denk daran, dass sie hier zustandslos ist. Übergib in jedem Turn die gesamte Unterhaltung als input.",
      responsesCaption: "Responses API mit dem OpenAI SDK",
    },
    anthropic: {
      title: "Anthropic Python SDK",
      body: "Setz base_url ohne /v1 und deinen Key als api_key, dann messages.create. Reasoning-Modelle stellen einen thinking-Block an den Anfang. Das Beispiel gibt deshalb den text-Block aus, nicht den ersten Block.",
      caption: "Messages API mit dem Anthropic SDK",
      countTokens:
        "Größe vor dem Senden prüfen? count_tokens liefert eine Schätzung, ganz ohne Modellaufruf und ohne Credits.",
      countTokensCaption: "Tokens zählen mit curl",
    },
    models: {
      title: "Modelle auflisten",
      body: "GET /v1/models ist die maßgebliche Quelle. Hier siehst du genau, welche IDs dein Key aufrufen darf, mit Kontextlänge, Tool-Support und Preis pro Token.",
      caption: "Modelle auflisten mit curl",
    },
    media: {
      title: "Bilder, Stimme, Video, Musik",
      body: "Gleicher Key, gleiche Basis-URL, die Medienformate von OpenAI. Die Images- und Audio-Clients des OpenAI-SDKs laufen unverändert. Wähl in GET /v1/models ein Modell mit der passenden modality.",
      imageCaption: "Bild erzeugen mit curl",
      async:
        "Video und Musik brauchen Minuten, deshalb laufen sie als Jobs. POST antwortet sofort mit einer ID. Status kostenlos abfragen, dann die Datei laden. Ein fehlgeschlagener Job kostet nichts.",
      videoCaption: "Videojob starten",
      pollCaption: "Status abfragen, dann das MP4 laden",
    },
  },
  ids: {
    title: "Modell-IDs: unsere oder die des Anbieters",
    intro:
      "Configs, die schon ein Modell nennen, musst du nicht umschreiben. Wir akzeptieren die gängigen Schreibweisen.",
    ours: "Unsere IDs, so wie GET /v1/models sie listet: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Nimm diese, wenn du neu anfängst.",
    vendor:
      "Anbieter-Schreibweisen gehen auch. Anthropic-IDs mit Datumsstempel (claude-sonnet-4-5-20250929 wird zu claude-sonnet-4.5), Versionsnummern mit Bindestrich, das Suffix -latest, das Kontext-Suffix [1m] und IDs mit Punkt wie gpt-5.5.",
    prefix:
      "Die API erkennt bei unterstützten Modellen gängige Anbieterpräfixe wie anthropic/ und openai/.",
    claudeFallback:
      "Nur auf /v1/messages: Eine Claude-ID, die dein Konto nicht aufrufen kann, etwa die eingebauten IDs, die Claude Code für seine Hintergrundaufrufe schickt, fällt auf das neueste Claude derselben Familie (Opus, Sonnet oder Haiku) zurück, das du aufrufen darfst. Claude Code läuft damit ohne zusätzliche Umgebungsvariablen. Jede andere unbekannte ID liefert 404 model_not_found.",
  },
  tools: {
    title: "Claude Code und Codex CLI mit anderen Modellen nutzen",
    intro:
      "Beide verbinden sich direkt. Kein Proxy, keine Übersetzungsschicht, nichts zu installieren.",
    p1: "Jedes Snippet nutzt standardmäßig {{model}}. Es hat echte Läufe mit Claude Code und Codex CLI bestanden, ruft Tools zuverlässig auf und kostet pro Output-Token wenig. Läuft alles, tauschst du es gegen jede beliebige ID.",
    claudeCode:
      "Das ist die ganze Antwort auf die Frage, wie Claude Code mit anderen Modellen läuft. ANTHROPIC_BASE_URL zeigt auf uns, ANTHROPIC_AUTH_TOKEN trägt deinen Key, die Modellvariablen entscheiden, was läuft. Ersetze die Modell-ID durch eine beliebige ID aus GET /v1/models: GPT, Gemini, Kimi, DeepSeek oder ein unzensiertes Modell. CLAUDE_CODE_MAX_CONTEXT_TOKENS steht auf dem echten Kontextfenster des Modells, damit Claude Code an der richtigen Stelle kompaktiert.",
    codex:
      "Codex CLI bekommt einen eigenen Model-Provider mit wire_api auf responses. Es spricht mit uns die Responses API, genau wie mit OpenAI. Das Modell wechselst du per -m.",
    others:
      "OpenCode, Continue, Aider und Cline funktionieren ebenfalls, alle getestet. Ihre Setups, die dauerhaften Config-Dateien und die Stolperfallen, die wir gefunden haben, stehen im Coding-Tools-Guide.",
    guideLink: "Alle Coding-Tools einrichten",
  },
  picks: {
    title: "Welches Modell für welchen Job",
    intro:
      "Jedes Modell unten unterstützt Tool Calling. Ein Klick auf den Namen zeigt Preis und Eckdaten, die ID kopierst du in deinen Code.",
    frontier: {
      title: "Frontier: härtester Code, tiefstes Reasoning",
      body: "Große Refactorings, fremde Codebasen, lange Denkketten. Höherer Preis pro Token, weniger Irrwege.",
    },
    cheap: {
      title: "Günstig und schnell: Agent-Loops, Massenjobs, Hintergrundaufrufe",
      body: "Agent-Loops mit großen Prompts, Batch-Jobs, Klassifizierung, die Hintergrundaufrufe, die Coding-Tools den ganzen Tag abfeuern. Ein Bruchteil der Frontier-Preise.",
    },
    uncensored: {
      title: "Unzensiert: kein Verweigerungsreflex",
      body: "GLM 5.3 Uncensored und Qwen 3.6 Plus Uncensored sind Mainstream-Modelle ohne Verweigerungen. UncensoredLM v1.2 ist anders: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind, nicht bloß ein entsperrtes Modell. Gleiche API, gleiche Tools.",
    },
    compare:
      "Zwischen zwei Modellen hin- und hergerissen? Die Vergleichsseiten stellen sie direkt gegenüber.",
    compareLink: "{{a}} vs. {{b}}",
    allModels: "Alle {{modelCount}} Modelle",
  },
  billing: {
    title: "Was es kostet",
    intro: "Credits, abgerechnet pro Token. Keine Lizenzgebühr pro Nutzer.",
    price:
      "Die meisten Modelle rechnen zum gelisteten Token-Preis plus unserem Aufschlag ab. Gecachte Input-Tokens laufen zum Cache-Preis des Modells. Modelle über OpenRouter rechnen die echten Kosten ab, die OpenRouter für den Aufruf berechnet hat, plus denselben Aufschlag.",
    reported:
      "Jede Antwort meldet usage.credits_charged. Was ein Aufruf gekostet hat, musst du nie raten.",
    preflight:
      "Bevor ein Aufruf startet, wird dein Guthaben gegen eine Worst-Case-Schätzung geprüft. Reicht es nicht, kommt HTTP 402 insufficient_credits: Nichts läuft, nichts wird berechnet.",
    abort:
      "Beim Streaming gilt: Verbindung schließen stoppt die Generierung. Du zahlst nur, was gelaufen ist. Dasselbe gilt, wenn der Provider mitten im Stream ausfällt.",
    chat: "Chat und API rechnen identisch ab. OpenRouter verteilt ein Modell auf mehrere Hoster, und manche sind teurer als der günstigste, den wir listen. Bei diesen Modellen ist der gelistete Preis deshalb eine Schätzung, usage.credits_charged der echte Betrag. Meldet OpenRouter für einen Aufruf keine Kosten, gilt der gelistete Preis.",
    media:
      "Medien rechnen genauso ab: echte Anbieterkosten plus unser Aufschlag, wo der Anbieter sie meldet, sonst der gelistete Modellpreis. Bilder pro Bild, Sprachausgabe pro Zeichen, Transkription pro Audiosekunde, Video und Musik erst, wenn die Datei fertig ist.",
    paid: "Dasselbe Credit-Guthaben wie in der Chat-App. Die API selbst braucht ein bezahltes Konto: einen beliebigen Tarif. Gratis-Credits schalten sie nicht frei.",
    sub: "Monatstarife: vier Größen, ab {{subCredits}} Credits für {{subPrice}}.",
    pack: "Credit-Pakete: Aufstockung für Abonnenten, {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Karte, PayPal oder Krypto.",
    link: "Tarife und Preise ansehen",
  },
  versus: {
    title: "Direkt, per Router oder bei uns?",
    intro: "Drei ehrliche Optionen. Jede ist für irgendwen die richtige.",
    direct: {
      title: "Direkt bei OpenAI, Anthropic oder Google",
      body: "Neue First-Party-Features landen dort zuerst. Kein Aufschlag durch einen Zwischenhändler. Nur die Bedingungen eines Anbieters. Nutzt du ausschließlich die Modelle eines Anbieters, geh direkt.",
    },
    router: {
      title: "Ein Aggregator wie OpenRouter",
      body: "OpenRouter bietet eine API für viele Modelle mit Anbieterauswahl und Ausweichrouten. Auch ein Teil unserer Modellanfragen läuft über OpenRouter.",
    },
    here: {
      title: "{{appName}}",
      body: "Ein Key für drei Wire-Formate: Chat Completions, Responses und Anthropic Messages samt count_tokens. Claude Code und Codex CLI verbinden sich ohne Proxy. Unzensierte Modelle stehen neben den Mainstream-Modellen, hinter einer einmaligen Bestätigung ab 18. Dasselbe Guthaben zahlt Chat-App und API, aus Abo-Credits oder Paketen. Und {{appName}} ist Open Source und selbst hostbar.",
    },
    verdict:
      "Vergleiche die Modellkataloge und die Routing-Funktionen, die du brauchst. Wenn du unzensierte Modelle per API aufrufen und dasselbe Guthaben im Chat nutzen willst, prüfe, welche Modelle dein {{appName}}-Schlüssel aufrufen kann.",
  },
  limits: {
    title: "Grenzen, die du kennen solltest",
    intro: "Keine Überraschungen in Produktion. Das sind die harten Kanten.",
    stateless:
      "Zustandslos. Die Responses API läuft mit store auf false und lehnt previous_response_id ab. Schick in jedem Turn den vollständigen Verlauf. Das gilt für jeden Endpoint.",
    maxTokens: "Der Output ist auf {{maxTokens}} Tokens pro Request begrenzt.",
    rateLimit:
      "Standardmäßig {{rateLimit}} Requests pro Minute und Key. Darüber kommt 429 mit Retry-After-Header. Agents, die viele Aufrufe abfeuern, bekommen ihren eigenen Key.",
    countTokens:
      "count_tokens ist eine Schätzung, nicht der exakte Tokenizer des Providers. Gut, um Kontext zu bemessen, nicht für Abrechnungsmathematik.",
    tools:
      "Tool Calls funktionieren nur bei Modellen, die sie unterstützen. Sonst kommt 400 tools_not_supported. GET /v1/models zeigt supports_tools für jedes Modell.",
    consent:
      "Unzensierte Modelle brauchen eine einmalige Bestätigung ab 18 auf der Seite API-Keys. Ohne sie kommt 403 uncensored_consent_required, und nichts wird berechnet.",
    localeUrl:
      "Die zwei klassischen Einrichtungsfehler, beide enden in einem 404. Erstens: das Locale im Pfad weglassen. Die Basis-URL lautet /api/<locale>/v1, nicht /api/v1. Zweitens: /v1 an der Anthropic-Basis-URL stehen lassen. Claude Code und die Anthropic-SDKs hängen /v1/messages selbst an, doppeltes /v1 findet nichts.",
  },
  privacy: {
    title: "Was mit deinen Prompts passiert",
    intro: "Kurz gesagt: Wir behalten die Rechnung, nicht die Unterhaltung.",
    noStore:
      "Die API speichert keine Unterhaltung und legt keine Threads an. Bei uns bleibt nur der Abrechnungsdatensatz: welches Modell, wie viele Credits.",
    upstream:
      "Dein Prompt geht an den Provider, der das Modell betreibt. Für das, was er empfängt, gelten seine Bedingungen.",
    incognito:
      "In der Chat-App liegen Inkognito-Chats nur im lokalen Speicher deines Browsers, nicht auf unseren Servern.",
    selfHost:
      "Volle Kontrolle gewünscht? {{appName}} ist Open Source (MIT und GPL v3). Betreib deine eigene Instanz mit eigenen Provider-Keys und zahl die Provider direkt.",
    selfHostLink: "Selbst hosten",
  },
  faq: {
    title: "FAQ",
    openrouter: {
      q: "Ist {{appName}} eine OpenRouter-Alternative?",
      a: "{{appName}} bündelt Chat Completions, Responses und Anthropic Messages unter einem Schlüssel. Nach der Altersbestätigung ab 18 kannst du unzensierte Modelle aufrufen. Chat und API greifen auf dasselbe Guthaben zu. Manche Anfragen laufen im Hintergrund über OpenRouter.",
    },
    openrouterModels: {
      q: "Kann ich beim Wechsel meine OpenRouter-Modell-IDs behalten?",
      a: "Einige IDs mit Anbieterpräfix funktionieren, wenn das entsprechende Modell verfügbar ist. Prüfe die Verfügbarkeit mit GET /v1/models und übernimm die exakte ID aus der Antwort der neuen API.",
    },
    claudeCode: {
      q: "Kann ich Claude Code mit Nicht-Claude-Modellen nutzen?",
      a: "Ja. Setz ANTHROPIC_BASE_URL auf die Anthropic-Basis-URL von {{appName}}, leg deinen Key in ANTHROPIC_AUTH_TOKEN und wähl eine beliebige Modell-ID aus GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek und die unzensierten Modelle laufen so alle in Claude Code.",
    },
    sdk: {
      q: "Brauche ich ein neues SDK?",
      a: "Nutze das offizielle OpenAI- oder Anthropic-SDK. Setze die passende Basis-URL, hinterlege deinen API-Schlüssel und wähle eine verfügbare Modell-ID.",
    },
    free: {
      q: "Gibt es einen kostenlosen API-Tarif?",
      a: "Nein. Die Chat-App hat Gratis-Credits, die API nicht. Sie braucht einen Tarif, ab {{subCredits}} Credits im Monat für {{subPrice}}. Abonnenten stocken mit Credit-Paketen auf ({{packCredits}} Credits für {{packPrice}}), die nie verfallen.",
    },
    pricing: {
      q: "Zahle ich den gelisteten Preis?",
      a: "Bei den meisten Modellen ja: gelisteter Token-Preis plus unser Aufschlag. Modelle über OpenRouter rechnen die echten Kosten ab, die OpenRouter für den Aufruf berechnet hat, plus denselben Aufschlag, in der Chat-App wie über die API. Ihr gelisteter Preis ist eine Schätzung. Den exakten Betrag meldet jede Antwort in usage.credits_charged.",
    },
    models: {
      q: "Welche Modelle kann ich aufrufen?",
      a: "Aktuell {{modelCount}} Chat-Modelle: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen und unzensierte Modelle. Dazu {{mediaModelCount}} Bild-, Video-, Musik-, Sprach- und Transkriptionsmodelle. GET /v1/models listet genau, was dein Key aufrufen darf, mit Preisen.",
    },
    data: {
      q: "Speichert {{appName}} meine Prompts?",
      a: "Über die API nicht. Keine Unterhaltung wird gespeichert, nur der Abrechnungsdatensatz: Modell und berechnete Credits. Der Provider, der das Modell betreibt, sieht den Prompt, nach seinen eigenen Bedingungen.",
    },
    docsLink: "Zur vollständigen API-Referenz",
    pricingLink: "Tarife und Preise ansehen",
  },
  partners: {
    body: "Du baust Tools oder Inhalte für Entwickler? Das Partnerprogramm von {{appName}} zahlt dir einen wiederkehrenden Anteil an jeder Zahlung, die du vermittelst.",
    link: "Partner werden",
  },
  cta: {
    title: "Ein Key. Jedes Modell. Leg los.",
    subtitle:
      "Key erstellen, eine Basis-URL ändern, dein SDK behalten. Die API-Doku deckt jeden Endpoint, jedes Feld und jeden Fehlercode ab.",
    key: "API-Key erstellen",
    docs: "API-Doku lesen",
  },
};
