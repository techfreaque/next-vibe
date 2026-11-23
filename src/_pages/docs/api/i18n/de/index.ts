import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} API-Doku - OpenAI- und Anthropic-kompatibel",
    description:
      "Eine Base-URL, {{modelCount}} Chatmodelle. OpenAI Chat Completions und Responses API, Anthropic Messages API, Streaming, Tool-Aufrufe. Dazu Bilder, Sprachausgabe, Transkription, Video und Musik im OpenAI-Format. Codex CLI und Claude Code verbinden sich direkt. Bezahlt wird in Credits.",
    category: "API",
    imageAlt: "{{appName}} OpenAI-kompatible API-Doku",
    keywords:
      "api, openai-kompatibel, anthropic-kompatibel, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, bildgenerierung api, text-to-speech api, whisper api, videogenerierung api, musikgenerierung api, {{appName}}",
  },
  toc: {
    title: "Auf dieser Seite",
    mobileTitle: "Springe zu",
    groups: {
      start: "Einstieg",
      chat: "Chat",
      media: "Medien",
      reference: "Referenz",
      integrations: "Integrationen",
    },
  },
  nav: {
    quickstart: "Schnellstart",
    auth: "Authentifizierung",
    access: "Zugang und Preise",
    models: "Modelle",
    chat: "Chat Completions",
    tools: "Tool-Aufrufe",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Credits und Abrechnung",
    errors: "Fehler und Rate Limits",
    codingTools: "Coding-Tools",
    sdks: "SDK-Beispiele",
    guides: "Ratgeber",
    images: "Bilder",
    speech: "Sprachausgabe",
    transcriptions: "Transkription",
    videos: "Video",
    music: "Musik",
    mediaFiles: "Mediendateien",
  },
  hero: {
    badge: "API-Referenz",
    title: "Eine Base-URL.",
    titleHighlight: "Jedes Modell.",
    subtitle:
      "Richte ein beliebiges OpenAI- oder Anthropic-SDK auf {{appName}}. Codex CLI und Claude Code ebenso. Bilder, Stimme, Video und Musik über denselben Schlüssel. Kein neuer Client.",
    ctaKey: "API-Schlüssel holen",
    ctaPricing: "Tarife ansehen",
    quickstartLink: "Schnellstart in 3 Schritten",
    facts: {
      models: "{{modelCount}} Chatmodelle",
      formats: "OpenAI- und Anthropic-Format",
      streaming: "Streaming und Tool-Aufrufe",
      rate: "{{rate}} Anfragen pro Minute je Schlüssel",
    },
  },
  code: {
    copy: "Kopieren",
    wrap: "Umbrechen",
    copied: "Kopiert",
    request: "Anfrage",
    response: "Antwort",
    stream: "Stream",
    showResponse: "Beispielantwort",
    showStream: "Beispiel-Stream",
    showObject: "Fertiges Job-Objekt",
  },
  quickstart: {
    title: "Schnellstart",
    intro:
      "Die API spricht das OpenAI- und das Anthropic-Format. Läuft dein Code gegen eines davon, läuft er auch hier, nach zwei Änderungen: Base-URL und Schlüssel.",
    baseUrlLabel: "OpenAI-Base-URL",
    anthropicBaseUrlLabel: "Anthropic-Base-URL",
    anthropicBaseUrlNote:
      "Für Claude Code und Anthropic-SDKs. Ohne `/v1` am Ende: `/v1/messages` hängen sie selbst an.",
    baseUrlNote:
      "Jede Sprache im Pfad funktioniert (en-US, de-DE, pl-PL). Sie bestimmt nur die Sprache der Fehlermeldungen.",
    envLabel: "Oder einmal für jedes OpenAI-SDK setzen",
    step1: {
      title: "Schlüssel erstellen",
      description:
        "Öffne API-Schlüssel in deinem Konto, benenne den Schlüssel, kopiere ihn. Du siehst ihn genau einmal.",
      cta: "API-Schlüssel öffnen",
    },
    step2: {
      title: "Base-URL setzen",
      description:
        "Tausch die Base-URL in deinem Client. Anthropic-Clients nehmen die zweite.",
    },
    step3: {
      title: "Anfrage senden",
      description:
        "Ins Terminal einfügen, Schlüssel eintragen, ausführen. Derselbe Aufruf in Python und JavaScript.",
    },
  },
  access: {
    title: "Zugang und Preise",
    intro:
      "Die API läuft über dieselben Credits wie die Chat-App. Kein eigener API-Tarif, keine Sitzplatzgebühren.",
    unlockTitle: "Was die API freischaltet",
    plan: "Jeder Tarif, ab {{subPrice}} im Monat. Jeder Tarif bringt monatliche Credits mit.",
    grant: "Credits, die unser Team vergibt, etwa Tester-Credits.",
    never:
      "Gratis-Credits schalten nie frei: weder das Monatskontingent noch Anmelde- und Newsletter-Boni oder Empfehlungsprovisionen.",
    withoutTitle: "Ohne Kauf",
    locked:
      "Konten ohne Kauf können keine Schlüssel erstellen, und jeder Aufruf an `/v1` antwortet mit HTTP 402 `paid_plan_required`.",
    topup:
      "Mehr nötig? Abonnenten legen Credit-Pakete ab {{packPrice}} nach. Paket-Credits verfallen nie.",
    ctaUnlock: "Tarife ansehen",
    ctaKeys: "API-Schlüssel öffnen",
  },
  auth: {
    title: "Authentifizierung",
    intro:
      "Sende deinen Schlüssel bei jeder Anfrage als Bearer-Token. Schlüssel beginnen mit `sk-unb-`. Anthropic-Clients schicken ihn als `x-api-key`, auch das funktioniert.",
    header: "Authorization: Bearer sk-unb-DEIN_SCHLUESSEL",
    headerAnthropic: "x-api-key: sk-unb-DEIN_SCHLUESSEL",
    headerTab: "OpenAI-Format",
    headerAnthropicTab: "Anthropic-Format",
    points: {
      hash: "Wir speichern einen Hash, nicht den Schlüssel. Verloren heißt: neuen erstellen.",
      scope:
        "Ein Schlüssel gilt nur für die API: `/v1/models`, Chat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) und Medien (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). Auf Konto, Zahlungen oder Einstellungen kommt er nicht.",
      limit:
        "Bis zu {{maxKeys}} aktive Schlüssel pro Konto. Jeden Schlüssel kannst du jederzeit widerrufen: Er stoppt sofort.",
      missing:
        "Fehlender oder widerrufener Schlüssel liefert 401. Ein Schlüssel auf einem Konto ohne Kauf liefert 402.",
    },
  },
  models: {
    title: "Modelle",
    intro:
      "`GET /v1/models` listet die Modelle, die dein Schlüssel jetzt aufrufen kann, mit Kontextgröße, Tool-Unterstützung und Credit-Preisen pro Million Token. Die id nutzt du als model-Feld.",
    note: "Die Liste hängt von deinem Konto ab. Unbekannte oder nicht verfügbare IDs liefern 404 `model_not_found`. Einzige Zuordnung: Auf `/v1/messages` landen die Claude-IDs, die Claude Code standardmäßig schickt, beim neuesten Claude derselben Familie.",
    browse: "Alle Modelle mit Preisen und Filtern ansehen",
    media: {
      title: "Medienmodelle in derselben Liste",
      body: "Bild-, Video-, Musik-, Stimm- und Transkriptionsmodelle stehen in derselben Liste. Jeder Eintrag sagt, was das Modell kann und wo es aufgerufen wird.",
      filename: "Medieneintrag",
      points: {
        modality:
          "modality ist chat, image, video, music, speech oder transcription. endpoints nennt die Pfade, die das Modell annehmen.",
        pricing:
          "Medienpreise gelten pro Einheit: `credits_per_image`, `credits_per_second` (Video), `credits_per_clip` (Musik), `credits_per_1k_characters` (Sprachausgabe), `credits_per_minute` (Transkription).",
        anthropic:
          "Anthropic-Clients (Header `anthropic-version`) bekommen nur Chatmodelle. Modelle, deren Anbieter bei uns nicht eingerichtet ist, fehlen in der Liste und antworten mit 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Chat Completions",
    intro:
      "Standard-Chat-Completions im OpenAI-Format. Nachrichten rein, eine Assistenten-Nachricht raus. Text- und Bildeingaben (`image_url` als https-URL oder base64-Data-URL).",
    nonStream: {
      title: "Ohne Streaming",
      body: "Der Standard. Du bekommst einen JSON-Body, sobald das Modell fertig ist. `usage.credits_charged` zeigt, was der Aufruf gekostet hat.",
    },
    stream: {
      title: "Streaming",
      body: "Mit `stream: true` kommen Server-Sent-Events im OpenAI-Chunk-Format, abgeschlossen durch `data: [DONE]`. Mit `stream_options.include_usage` erhältst du einen letzten Chunk mit Token-Zahlen und `credits_charged`. Schließt du die Verbindung, stoppt die Generierung. Du zahlst nur, was lief.",
    },
    paramsTitle: "Anfragefelder",
    paramsColumns: { field: "Feld", description: "Wirkung" },
    params: {
      model: "Pflicht. Eine Modell-ID aus `GET /v1/models`.",
      messages:
        "Pflicht. system-, developer-, user-, assistant- und tool-Nachrichten. User-Inhalt darf ein String sein oder Teile vom Typ text und `image_url` enthalten.",
      stream: "true für Server-Sent-Events. Standard false.",
      streamOptions:
        "`{ include_usage: true }` hängt einen letzten Usage-Chunk an.",
      maxTokens:
        "Obergrenze für erzeugte Token. `max_completion_tokens` hat Vorrang. Gedeckelt bei {{maxTokens}}.",
      temperature: "0 bis 2. Wird von Modellen ohne Unterstützung ignoriert.",
      topP: "0 bis 1.",
      stop: "Ein Stopp-String oder eine Liste davon.",
      n: "Nur 1 wird unterstützt. Andere Werte liefern 400.",
      tools:
        "Funktions-Tools, die das Modell aufrufen darf. Siehe Tool-Aufrufe.",
      toolChoice: "none, auto, required oder eine benannte Funktion.",
    },
  },
  tools: {
    title: "Tool-Aufrufe",
    intro:
      "Function Calling funktioniert wie bei OpenAI. Du beschreibst Funktionen, das Modell entscheidet sich für einen Aufruf, du führst ihn aus und schickst das Ergebnis zurück. Deine Tools führen wir nie aus.",
    flow: {
      title: "Der Ablauf",
      step1: "Schicke tools zusammen mit deinen Nachrichten.",
      step2:
        "Das Modell antwortet mit `tool_calls` und `finish_reason: tool_calls`. Jeder Aufruf hat eine id, einen Funktionsnamen und Argumente als JSON-String.",
      step3:
        "Führe die Funktion selbst aus. Hänge die Assistenten-Nachricht an, danach pro Aufruf eine tool-Nachricht mit der passenden `tool_call_id`.",
      step4: "Rufe erneut auf. Das Modell nutzt die Ergebnisse und antwortet.",
    },
    requestTitle: "1. Anfrage mit Tools",
    responseTitle: "2. Das Modell verlangt einen Aufruf",
    followUpTitle: "3. Ergebnis zurückgeben",
    sdkTitle: "Derselbe Ablauf mit dem Python-SDK",
    streamingTitle: "Tool-Aufrufe im Stream",
    streamingBody:
      "Mit `stream: true` kommen Aufrufe als Chunks in `delta.tool_calls`, adressiert über index. Der erste Chunk eines Index trägt id und `function.name`. Spätere Chunks hängen an `function.arguments` an. Setze sie zusammen und parse das JSON, sobald `finish_reason` `tool_calls` ist. Jedes OpenAI-SDK erledigt das für dich.",
    rules: {
      title: "Regeln",
      support:
        "Das Modell muss Tools unterstützen: Prüfe `supports_tools` in `GET /v1/models`. Andere liefern 400 `tools_not_supported`.",
      choice:
        "`tool_choice` none, auto und required funktionieren wie bei OpenAI. Eine Funktion, die nicht in tools steht, liefert 400.",
      names:
        "Funktionsnamen: Buchstaben, Ziffern, Unterstrich, Bindestrich, bis zu 64 Zeichen.",
      billing:
        "Tool-Definitionen und Tool-Ergebnisse sind Eingabe-Token. Aufrufe sind Ausgabe-Token. Sie werden wie alle anderen Token abgerechnet.",
    },
  },
  billing: {
    title: "Credits und Abrechnung",
    intro:
      "Die API zieht von denselben Credits wie die Chat-App, abgerechnet nach denselben Regeln. Ein Guthaben, eine Rechnung.",
    points: {
      price:
        "Kosten = Eingabe- plus Ausgabe-Token zum Credit-Preis des Modells, pro Million Token gelistet in `GET /v1/models`. Ausnahme sind OpenRouter-Modelle: Du zahlst, was der Anbieter für den Aufruf tatsächlich berechnet hat, plus unseren Aufschlag. Ihr gelisteter Preis ist eine Schätzung. Im Chat gilt dieselbe Abrechnung.",
      usage:
        "Jede Antwort nennt `usage.credits_charged`. Dein Guthaben findest du in der App unter Credits.",
      preflight:
        "Vor jedem Aufruf prüfen wir dein Guthaben gegen eine Worst-Case-Schätzung. Reicht es nicht: HTTP 402 `insufficient_credits`, nichts läuft, nichts wird berechnet.",
      real: "Nach dem Aufruf zahlst du die echte Nutzung, nicht die Schätzung: die gemeldete Token-Zahl, bei OpenRouter-Modellen die echten Anbieterkosten. Meldet ein Anbieter keine Kosten, gilt der gelistete Preis.",
      media:
        "Medienaufrufe rechnen genauso ab: echte Anbieterkosten plus unser Aufschlag, wo der Anbieter sie meldet, sonst der gelistete Modellpreis. Bilder pro Bild, Sprachausgabe pro Zeichen, Transkription pro Audiosekunde, Video sobald der Clip fertig ist, Musik pro Clip.",
      topup:
        "Credits leer? Leg ein Paket nach, verlängere oder erweitere deinen Tarif. Der nächste Aufruf läuft sofort.",
    },
  },
  limits: {
    title: "Rate Limits",
    body: "Jeder Schlüssel erlaubt standardmäßig {{rate}} Anfragen pro Minute. Darüber liefert die API HTTP 429 mit dem Header `Retry-After` in Sekunden. Warte so lange und versuche es erneut. Limits gelten pro Schlüssel: Verteile große Lasten auf mehrere Schlüssel.",
  },
  errors: {
    title: "Fehler und Rate Limits",
    intro:
      "Fehler nutzen den OpenAI-Umschlag, die SDKs werfen also ihre gewohnten Exceptions. Werte `error.code` aus, nicht die Meldung.",
    shapeTitle: "Fehler-Body",
    shapeOpenAi: "OpenAI-Format",
    shapeAnthropic: "Anthropic-Format",
    codesTitle: "Fehlercodes",
    columns: { status: "HTTP", code: "code", meaning: "Bedeutung" },
    rows: {
      missingKey:
        "Kein Schlüssel gesendet. Sende `Authorization: Bearer sk-unb-...` oder `x-api-key`.",
      invalidKey: "Schlüssel ist falsch oder widerrufen.",
      paid: "Auf dem Konto gibt es noch keinen Kauf. Jeder Tarif schaltet die API frei.",
      credits: "Guthaben reicht für diesen Aufruf nicht. Auffüllen.",
      cap: "Bezahltes Guthaben leer und Tageslimit für Gratis-Credits erreicht. Auffüllen.",
      notFound:
        "Das Modell existiert nicht oder steht dir nicht zur Verfügung.",
      invalid:
        "Ungültige Anfrage: nicht unterstützter Parameter, falsche `tool_choice`, falsche Bild-URL.",
      contentPolicy:
        "Der Medienanbieter hat den Prompt abgelehnt. Nichts wird berechnet. Formuliere um oder nimm ein anderes Modell.",
      consent:
        "Unzensierte Modelle brauchen eine einmalige Ü18-Bestätigung im Konto. Einmal auf der Seite API-Schlüssel bestätigen, dann erneut senden.",
      rate: "Über {{rate}} Anfragen pro Minute für diesen Schlüssel. Lies `Retry-After`.",
      upstream:
        "Der Modellanbieter ist ausgefallen. Wiederholen ist sicher. Streams enden mit einem Fehler-Event.",
      balance:
        "Dein Guthaben war nicht lesbar, deshalb lief nichts. Wiederholen.",
    },
    streamNote:
      "Fehler mitten im Stream kommen als Event `data:` mit demselben Fehlerobjekt, gefolgt von `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "Die OpenAI Responses API, das Format von Codex CLI. Dieselben Modelle, derselbe Schlüssel, dieselben Credits und Rate Limits wie bei Chat Completions.",
    request: {
      title: "Anfrage",
      body: "input ist ein String oder eine Liste von Input-Items. instructions ist der Systemprompt. Die Antwort kommt als Output-Items, jedes OpenAI-SDK liefert zusätzlich `output_text`.",
    },
    stream: {
      title: "Streaming",
      body: "Mit `stream: true` kommt der Responses-Eventstream: `response.created`, Text-Deltas, am Ende `response.completed` mit Usage.",
    },
    points: {
      tools:
        "Tools: function, custom und `local_shell`. Die Aufrufe des Modells kommen als Output-Items. Jedes Ergebnis geht als Item vom Typ `function_call_output` mit derselben `call_id` zurück.",
      reasoning: "Reasoning-Modelle liefern Reasoning-Items neben der Antwort.",
      billing:
        "Abrechnung, Modell-IDs, Fehler und Rate Limits funktionieren exakt wie bei Chat Completions.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "Die Anthropic Messages API, das Format von Claude Code und den Anthropic-SDKs. Nimm die Base-URL ohne `/v1`: Clients hängen `/v1/messages` selbst an.",
    request: {
      title: "Anfrage",
      body: "Standard-Messages-Anfrage: model, `max_tokens`, system, messages. Text- und Bildblöcke rein, Text- und Blöcke vom Typ `tool_use` raus.",
    },
    stream: {
      title: "Streaming",
      body: "Mit `stream: true` kommen Anthropic-Server-Sent-Events, von `message_start` bis `message_stop`.",
    },
    points: {
      auth: "Authentifizierung: `x-api-key` oder `Authorization: Bearer`. Beide nehmen deinen Schlüssel mit `sk-unb-`.",
      models:
        "Modell: jede ID aus `GET /v1/models`. Die Anthropic-IDs, die Claude Code standardmäßig schickt, etwa `claude-sonnet-4-5-20250929`, landen auf unserem passenden Claude-Modell.",
      tools:
        "Tools: Blöcke vom Typ `tool_use` raus, `tool_result` zurück, wie in der Anthropic API.",
      billing:
        "Dieselben Credits, dieselben Preise, dieselben Rate Limits wie an jedem anderen Endpunkt.",
    },
    countTokens: {
      title: "Tokens zählen",
      body: "`POST /v1/messages/count_tokens` zählt die Input-Tokens einer Messages-Anfrage, ohne das Modell laufen zu lassen. Claude Code nutzt das, um seinen Kontext zu steuern.",
    },
  },
  images: {
    title: "Bilder",
    intro:
      "OpenAI-Bildformat. Jedes Modell mit modality image aus `GET /v1/models`. Läuft mit dem Images-Client jedes OpenAI-SDKs.",
    generate: {
      title: "Erzeugen",
      body: "Schick JSON mit diesen Feldern. Die Antwort liefert pro Bild eine url.",
    },
    params: {
      model: "Pflicht. Jede ID mit modality `image` aus `GET /v1/models`.",
      prompt: "Pflicht. Was gezeichnet wird, bis 2000 Zeichen.",
      n: "Bilder pro Aufruf, 1 bis {{maxImages}}. Jedes wird abgerechnet.",
      size: "`BREITExHÖHE` wie `1024x1024` oder `auto`. Wir nehmen die nächste Größe, die das Modell rendert.",
      aspectRatio:
        "Unsere Erweiterung: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Hat Vorrang vor size.",
      quality:
        "`standard | hd | low | medium | high | auto`. `hd` und `high` fordern die Detailstufe an, wo das Modell eine hat.",
      responseFormat:
        "`url` (Standard, signierter Link, 7 Tage gültig) oder `b64_json`.",
    },
    edit: {
      title: "Bild bearbeiten",
      body: "Ein Eingabebild plus Prompt. Als Multipart-Feld image hochladen oder `image_url` (https oder base64-data-URL) im JSON senden. Das Modell muss Bildeingabe können: `input_modalities` enthält image. Masken werden nicht unterstützt; beschreib die Änderung im Prompt.",
    },
    points: {
      size: "Wir wählen die nächstliegende Größe und das Seitenverhältnis, das das Modell rendert.",
      format:
        "url ist ein signierter Link auf die gespeicherte Datei, 7 Tage ohne Schlüssel gültig. `b64_json` liefert die Bytes direkt in der Antwort.",
      billing:
        "Abrechnung pro Bild. `credits_charged` in der Antwort zeigt die Kosten des Aufrufs.",
    },
  },
  speech: {
    title: "Sprachausgabe",
    intro:
      "Text rein, Audiodaten raus. model ist eine Stimmen-ID aus `GET /v1/models` (modality speech), etwa `openai-nova`. Der OpenAI-Weg geht auch: model `tts-1` mit voice nova.",
    points: {
      voices:
        "input bis {{maxChars}} Zeichen. speed 0.25 bis 4 bei Stimmen von OpenAI, NanoGPT und ElevenLabs.",
      formats:
        "`response_format` mp3 (Standard), opus, aac, flac, wav oder pcm. Welche eine Stimme liefert, hängt vom Anbieter ab; alles andere antwortet mit 400 und der Liste.",
      billing:
        "Abrechnung pro Zeichen. Der Header `X-Credits-Charged` zeigt die Kosten des Aufrufs.",
    },
  },
  transcriptions: {
    title: "Transkription",
    intro:
      "Sprache zu Text im OpenAI-Whisper-Format. Multipart-Upload, derselbe SDK-Aufruf, den du schon nutzt.",
    transcribe: {
      title: "Transkribieren",
      body: "file bis {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac), model wie `whisper-1`, optional language. `response_format` json, text, srt, `verbose_json` oder vtt.",
    },
    translate: {
      title: "Ins Englische übersetzen",
      body: "`POST /v1/audio/translations`: beliebige gesprochene Sprache rein, englischer Text raus. Läuft auf `whisper-1`. Gleiche Formate wie bei Transkriptionen.",
    },
    points: {
      billing: "Abrechnung pro Audiosekunde.",
    },
  },
  videos: {
    title: "Video",
    intro:
      "Asynchron, im Format der OpenAI-Video-API. Der Aufruf antwortet sofort mit einem Job. Status abfragen, dann das MP4 laden.",
    create: {
      title: "Job starten",
      body: "model, prompt, seconds, size oder `aspect_ratio`, resolution, `negative_prompt`. Die Antwort ist ein Videoobjekt mit status queued.",
    },
    poll: {
      title: "Abfragen und herunterladen",
      body: "`GET /v1/videos/{id}` liefert status (queued, `in_progress`, completed, failed), progress und am Ende eine signierte url. Abfragen ist kostenlos und zählt nicht gegen das Ratenlimit. `GET /v1/videos/{id}/content` streamt das MP4.",
    },
    points: {
      image:
        "Bild zu Video: `image_url` im JSON oder `input_reference` als Multipart-Upload senden. Es wird zum ersten Frame.",
      billing:
        "Abrechnung erst, wenn das Video fertig ist, pro Videosekunde. `credits_charged` zeigt die Kosten.",
      failed: "Ein fehlgeschlagener Job kostet nichts. error nennt den Grund.",
    },
  },
  music: {
    title: "Musik",
    intro:
      "Asynchron wie Video. Job starten, `GET /v1/music/{id}` abfragen, `GET /v1/music/{id}/content` herunterladen.",
    startTitle: "Job starten",
    pollTitle: "Abfragen und herunterladen",
    points: {
      seconds:
        "seconds: etwa 8, 20 oder 30. Das Modell kann runden. Stil, Stimmung, Instrumente und Tempo gehören in prompt.",
      billing:
        "Abrechnung pro Clip, sobald er fertig ist. Ein fehlgeschlagener Job kostet nichts.",
    },
  },
  mediaFiles: {
    title: "Mediendateien",
    intro:
      "Jede url in einer Medienantwort zeigt hierher. Der signierte Link funktioniert 7 Tage ohne Schlüssel, also direkt im Browser oder beim Endnutzer. Mit deinem API-Schlüssel klappt derselbe Pfad jederzeit.",
  },
  codingTools: {
    title: "Coding-Tools",
    intro:
      "Eine Base-URL, ein Schlüssel. Codex CLI und Claude Code verbinden sich nativ. OpenCode, Continue, Aider und Cline laufen über Chat Completions. Tool wählen, Block kopieren, ausführen.",
    keyPage:
      "Die Seite API-Schlüssel zeigt dieselben Blöcke, mit deinem Schlüssel schon eingesetzt.",
    keyPageCta: "Mit eigenem Schlüssel holen",
    guide: "Zum Coding-Tools-Guide",
  },
  sdks: {
    title: "SDK-Beispiele",
    intro:
      "Die offiziellen SDKs von OpenAI und Anthropic laufen unverändert. Base-URL und Schlüssel setzen, der restliche Code bleibt.",
    chat: "Chat",
    stream: "Streaming",
    responses: "Responses API",
    anthropic: "Anthropic-SDK",
    images: "Bilder",
    speech: "Sprachausgabe",
    transcription: "Transkription",
  },
  guides: {
    title: "Ratgeber",
    intro:
      "Ausführliche Anleitungen: Umstieg von OpenAI oder OpenRouter, unzensierte Modelle über die API und den Schlüssel in Coding-Tools einbinden.",
  },
  cta: {
    title: "Bau auf jedem Modell.",
    subtitle: "Schlüssel erstellen, SDK umstellen, ausliefern.",
    button: "API-Schlüssel erstellen",
    secondary: "Tarife vergleichen",
  },
};
