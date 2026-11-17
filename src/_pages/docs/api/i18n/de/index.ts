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
  nav: {
    quickstart: "Schnellstart",
    auth: "Authentifizierung",
    models: "Modelle",
    chat: "Chat Completions",
    tools: "Tool-Aufrufe",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Credits und Abrechnung",
    limits: "Rate Limits",
    errors: "Fehler",
    codingTools: "Coding-Tools",
    images: "Bilder",
    speech: "Sprachausgabe",
    transcriptions: "Transkription",
    videos: "Video",
    music: "Musik",
    mediaFiles: "Mediendateien",
  },
  hero: {
    badge: "OpenAI- und Anthropic-kompatibel",
    title: "Eine Base-URL.",
    titleHighlight: "Jedes Modell.",
    subtitle:
      "Richte ein beliebiges OpenAI- oder Anthropic-SDK auf {{appName}}. Codex CLI und Claude Code ebenso. {{modelCount}} Chatmodelle, Streaming, Tool-Aufrufe. Bilder, Stimme, Video und Musik über denselben Schlüssel. Kein neuer Client.",
    ctaKey: "API-Schlüssel holen",
    ctaPricing: "Tarife ansehen",
  },
  quickstart: {
    title: "In 60 Sekunden zum ersten Aufruf",
    intro:
      "Die API spricht das OpenAI- und das Anthropic-Format. Läuft dein Code gegen eines davon, läuft er auch hier, nach zwei Änderungen: Base-URL und Schlüssel.",
    baseUrlLabel: "Base-URL",
    anthropicBaseUrlLabel: "Anthropic-Base-URL",
    anthropicBaseUrlNote:
      "Für Claude Code und Anthropic-SDKs. Dieselbe URL ohne /v1: /v1/messages hängen sie selbst an.",
    baseUrlNote:
      "Jede Sprache im Pfad funktioniert (en-US, de-DE, pl-PL). Sie bestimmt nur die Sprache der Fehlermeldungen.",
    step1: {
      title: "Schlüssel holen",
      description:
        "Erstelle unter Einstellungen > API-Schlüssel einen sk-unb-Schlüssel. Er wird nur einmal angezeigt.",
    },
    step2: {
      title: "Anfrage senden",
      description: "Reines HTTP. Funktioniert in jeder Sprache.",
    },
    step3: {
      title: "Oder ein OpenAI-SDK nutzen",
      description: "baseURL und apiKey ändern. Mehr nicht.",
      python: "Python",
      node: "Node.js",
    },
  },
  access: {
    title: "Braucht ein bezahltes Konto",
    body: "Schlüssel und /v1-Aufrufe brauchen ein bezahltes Konto: einen beliebigen Tarif, ab {{subPrice}} im Monat. Kostenlose Konten können Schlüssel erstellen und die Doku lesen, jeder Aufruf antwortet bis zum ersten Kauf aber mit HTTP 402 paid_plan_required. Gratis- und Bonus-Credits schalten die API nicht frei. Jeder Tarif bringt monatliche Credits mit. Reicht das nicht, legen Abonnenten Credit-Pakete nach, die nie verfallen.",
    cta: "API freischalten",
  },
  auth: {
    title: "Authentifizierung",
    intro:
      "Sende deinen Schlüssel bei jeder Anfrage als Bearer-Token. Schlüssel beginnen mit sk-unb-. Anthropic-Clients schicken ihn als x-api-key, auch das funktioniert.",
    header: "Authorization: Bearer sk-unb-DEIN_SCHLUESSEL",
    headerAnthropic: "x-api-key: sk-unb-DEIN_SCHLUESSEL",
    points: {
      hash: "Wir speichern einen Hash, nicht den Schlüssel. Verloren heißt: neuen erstellen.",
      scope:
        "Ein Schlüssel gilt nur für die API: /v1/models, Chat (/v1/chat/completions, /v1/responses, /v1/messages) und Medien (/v1/images, /v1/audio, /v1/videos, /v1/music, /v1/media). Auf Konto, Zahlungen oder Einstellungen kommt er nicht.",
      limit:
        "Bis zu 20 aktive Schlüssel pro Konto. Jeden Schlüssel kannst du jederzeit widerrufen: Er stoppt sofort.",
      missing:
        "Fehlender oder widerrufener Schlüssel liefert 401. Ein Schlüssel, dessen Konto keinen bezahlten Tarif hat, liefert 402.",
    },
  },
  models: {
    title: "GET /v1/models",
    intro:
      "Listet die Modelle, die dein Schlüssel jetzt aufrufen kann, mit Kontextgröße, Tool-Unterstützung und Credit-Preisen pro Million Token. Die id nutzt du als model-Feld.",
    note: "Die Liste hängt von deinem Konto ab. Unbekannte oder nicht verfügbare IDs liefern 404 model_not_found. Einzige Zuordnung: Auf /v1/messages landen die Claude-IDs, die Claude Code standardmäßig schickt, beim neuesten Claude derselben Familie.",
    media: {
      title: "Medienmodelle in derselben Liste",
      body: "Bild-, Video-, Musik-, Stimm- und Transkriptionsmodelle stehen in derselben Liste. Jeder Eintrag sagt, was das Modell kann und wo es aufgerufen wird.",
      filename: "Medieneintrag",
      points: {
        modality:
          "modality ist chat, image, video, music, speech oder transcription. endpoints nennt die Pfade, die das Modell annehmen.",
        pricing:
          "Medienpreise gelten pro Einheit: credits_per_image, credits_per_second (Video), credits_per_clip (Musik), credits_per_1k_characters (Sprachausgabe), credits_per_minute (Transkription).",
        anthropic:
          "Anthropic-Clients (Header anthropic-version) bekommen nur Chatmodelle. Modelle, deren Anbieter bei uns nicht eingerichtet ist, fehlen in der Liste und antworten mit 404 model_not_found.",
      },
    },
  },
  chat: {
    title: "POST /v1/chat/completions",
    intro:
      "Standard-Chat-Completions im OpenAI-Format. Nachrichten rein, eine Assistenten-Nachricht raus. Text- und Bildeingaben (image_url als https-URL oder base64-Data-URL).",
    nonStream: {
      title: "Ohne Streaming",
      body: "Der Standard. Du bekommst einen JSON-Body, sobald das Modell fertig ist. usage.credits_charged zeigt, was der Aufruf gekostet hat.",
    },
    stream: {
      title: "Streaming",
      body: "Mit stream: true kommen Server-Sent-Events im OpenAI-Chunk-Format, abgeschlossen durch data: [DONE]. Mit stream_options.include_usage erhältst du einen letzten Chunk mit Token-Zahlen und credits_charged. Schließt du die Verbindung, stoppt die Generierung. Du zahlst nur, was lief.",
    },
    paramsTitle: "Anfragefelder",
    paramsColumns: { field: "Feld", description: "Wirkung" },
    params: {
      model: "Pflicht. Eine Modell-ID aus GET /v1/models.",
      messages:
        "Pflicht. system-, developer-, user-, assistant- und tool-Nachrichten. User-Inhalt darf ein String sein oder text- und image_url-Teile enthalten.",
      stream: "true für Server-Sent-Events. Standard false.",
      streamOptions:
        "{ include_usage: true } hängt einen letzten Usage-Chunk an.",
      maxTokens:
        "Obergrenze für erzeugte Token. max_completion_tokens hat Vorrang. Gedeckelt bei 32768.",
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
        "Das Modell antwortet mit tool_calls und finish_reason: tool_calls. Jeder Aufruf hat eine id, einen Funktionsnamen und Argumente als JSON-String.",
      step3:
        "Führe die Funktion selbst aus. Hänge die Assistenten-Nachricht an, danach pro Aufruf eine tool-Nachricht mit der passenden tool_call_id.",
      step4: "Rufe erneut auf. Das Modell nutzt die Ergebnisse und antwortet.",
    },
    requestTitle: "1. Anfrage mit Tools",
    responseTitle: "2. Das Modell verlangt einen Aufruf",
    followUpTitle: "3. Ergebnis zurückgeben",
    sdkTitle: "Derselbe Ablauf mit dem Python-SDK",
    streamingTitle: "Tool-Aufrufe im Stream",
    streamingBody:
      "Mit stream: true kommen Aufrufe als delta.tool_calls-Chunks, adressiert über index. Der erste Chunk eines Index trägt id und function.name. Spätere Chunks hängen an function.arguments an. Setze sie zusammen und parse das JSON, sobald finish_reason tool_calls ist. Jedes OpenAI-SDK erledigt das für dich.",
    rules: {
      title: "Regeln",
      support:
        "Das Modell muss Tools unterstützen: Prüfe supports_tools in GET /v1/models. Andere liefern 400 tools_not_supported.",
      choice:
        "tool_choice none, auto und required funktionieren wie bei OpenAI. Eine Funktion, die nicht in tools steht, liefert 400.",
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
        "Kosten = Eingabe- plus Ausgabe-Token zum Credit-Preis des Modells, pro Million Token gelistet in GET /v1/models. Ausnahme sind OpenRouter-Modelle: Du zahlst, was der Anbieter für den Aufruf tatsächlich berechnet hat, plus unseren Aufschlag. Ihr gelisteter Preis ist eine Schätzung. Im Chat gilt dieselbe Abrechnung.",
      usage:
        "Jede Antwort nennt usage.credits_charged. Dein Guthaben findest du in der App unter Credits.",
      preflight:
        "Vor jedem Aufruf prüfen wir dein Guthaben gegen eine Worst-Case-Schätzung. Reicht es nicht: HTTP 402 insufficient_credits, nichts läuft, nichts wird berechnet.",
      real: "Nach dem Aufruf zahlst du die echte Nutzung, nicht die Schätzung: die gemeldete Token-Zahl, bei OpenRouter-Modellen die echten Anbieterkosten. Meldet ein Anbieter keine Kosten, gilt der gelistete Preis.",
      media:
        "Medienaufrufe rechnen genauso ab: echte Anbieterkosten plus unser Aufschlag, wo der Anbieter sie meldet, sonst der gelistete Modellpreis. Bilder pro Bild, Sprachausgabe pro Zeichen, Transkription pro Audiosekunde, Video sobald der Clip fertig ist, Musik pro Clip.",
      topup:
        "Credits leer? Leg ein Paket nach, verlängere oder erweitere deinen Tarif. Der nächste Aufruf läuft sofort.",
    },
  },
  limits: {
    title: "Rate Limits",
    body: "Jeder Schlüssel erlaubt standardmäßig 60 Anfragen pro Minute. Darüber liefert die API HTTP 429 mit einem Retry-After-Header in Sekunden. Warte so lange und versuche es erneut. Limits gelten pro Schlüssel: Verteile große Lasten auf mehrere Schlüssel.",
  },
  errors: {
    title: "Fehler",
    intro:
      "Fehler nutzen den OpenAI-Umschlag, die SDKs werfen also ihre gewohnten Exceptions. Werte error.code aus, nicht die Meldung.",
    columns: { status: "HTTP", code: "code", meaning: "Bedeutung" },
    rows: {
      missingKey:
        "Kein Schlüssel gesendet. Sende Authorization: Bearer sk-unb-... oder x-api-key.",
      invalidKey: "Schlüssel ist falsch oder widerrufen.",
      paid: "Auf dem Konto gibt es noch keinen Tarif und keinen Credit-Kauf. Jeder Tarif schaltet die API frei.",
      credits: "Guthaben reicht für diesen Aufruf nicht. Auffüllen.",
      cap: "Bezahltes Guthaben leer und Tageslimit für Gratis-Credits erreicht. Auffüllen.",
      notFound:
        "Das Modell existiert nicht oder steht dir nicht zur Verfügung.",
      invalid:
        "Ungültige Anfrage: nicht unterstützter Parameter, falsche tool_choice, falsche Bild-URL.",
      contentPolicy:
        "Der Medienanbieter hat den Prompt abgelehnt. Nichts wird berechnet. Formuliere um oder nimm ein anderes Modell.",
      consent:
        "Unzensierte Modelle brauchen eine einmalige Ü18-Bestätigung im Konto. Einmal in der App bestätigen, dann erneut senden.",
      rate: "Über 60 Anfragen pro Minute für diesen Schlüssel. Lies Retry-After.",
      upstream:
        "Der Modellanbieter ist ausgefallen. Wiederholen ist sicher. Streams enden mit einem Fehler-Event.",
      balance:
        "Dein Guthaben war nicht lesbar, deshalb lief nichts. Wiederholen.",
    },
    streamNote:
      "Fehler mitten im Stream kommen als data:-Event mit demselben Fehlerobjekt, gefolgt von data: [DONE].",
  },
  responses: {
    title: "POST /v1/responses",
    intro:
      "Die OpenAI Responses API, das Format von Codex CLI. Dieselben Modelle, derselbe Schlüssel, dieselben Credits und Rate Limits wie bei Chat Completions.",
    request: {
      title: "Anfrage",
      body: "input ist ein String oder eine Liste von Input-Items. instructions ist der Systemprompt. Die Antwort kommt als Output-Items, jedes OpenAI-SDK liefert zusätzlich output_text.",
    },
    stream: {
      title: "Streaming",
      body: "Mit stream: true kommt der Responses-Eventstream: response.created, Text-Deltas, am Ende response.completed mit Usage.",
    },
    points: {
      tools:
        "Tools: function, custom und local_shell. Die Aufrufe des Modells kommen als Output-Items. Jedes Ergebnis geht als function_call_output-Item mit derselben call_id zurück.",
      reasoning: "Reasoning-Modelle liefern Reasoning-Items neben der Antwort.",
      billing:
        "Abrechnung, Modell-IDs, Fehler und Rate Limits funktionieren exakt wie bei Chat Completions.",
    },
    sdkTitle: "Mit dem OpenAI-Python-SDK",
  },
  messages: {
    title: "POST /v1/messages",
    intro:
      "Die Anthropic Messages API, das Format von Claude Code und den Anthropic-SDKs. Nimm die Base-URL ohne /v1: Clients hängen /v1/messages selbst an.",
    request: {
      title: "Anfrage",
      body: "Standard-Messages-Anfrage: model, max_tokens, system, messages. Text- und Bildblöcke rein, Text- und tool_use-Blöcke raus.",
    },
    stream: {
      title: "Streaming",
      body: "Mit stream: true kommen Anthropic-Server-Sent-Events, von message_start bis message_stop.",
    },
    points: {
      auth: "Authentifizierung: x-api-key oder Authorization: Bearer. Beide nehmen deinen sk-unb-Schlüssel.",
      models:
        "Modell: jede ID aus GET /v1/models. Die Anthropic-IDs, die Claude Code standardmäßig schickt, etwa claude-sonnet-4-5-20250929, landen auf unserem passenden Claude-Modell.",
      tools:
        "Tools: tool_use-Blöcke raus, tool_result-Blöcke zurück, wie in der Anthropic API.",
      billing:
        "Dieselben Credits, dieselben Preise, dieselben Rate Limits wie an jedem anderen Endpunkt.",
    },
    countTokens: {
      title: "POST /v1/messages/count_tokens",
      body: "Zählt die Input-Tokens einer Messages-Anfrage, ohne das Modell laufen zu lassen. Claude Code nutzt das, um seinen Kontext zu steuern.",
    },
    sdkTitle: "Mit dem Anthropic-Python-SDK",
  },
  images: {
    title: "POST /v1/images/generations",
    intro:
      "OpenAI-Bildformat. Jedes Modell mit modality image aus GET /v1/models. Läuft mit dem Images-Client jedes OpenAI-SDKs.",
    generate: {
      title: "Erzeugen",
      body: "model, prompt, n (1 bis 4), size als BREITExHÖHE oder auto, quality. aspect_ratio ist unsere Erweiterung und hat Vorrang vor size. response_format url (Standard) oder b64_json.",
    },
    edit: {
      title: "POST /v1/images/edits",
      body: "Ein Eingabebild plus Prompt. Als Multipart-Feld image hochladen oder image_url (https oder base64-data-URL) im JSON senden. Das Modell muss Bildeingabe können: input_modalities enthält image. Masken werden nicht unterstützt; beschreib die Änderung im Prompt.",
    },
    points: {
      size: "Wir wählen die nächstliegende Größe und das Seitenverhältnis, das das Modell rendert.",
      format:
        "url ist ein signierter Link auf die gespeicherte Datei, 7 Tage ohne Schlüssel gültig. b64_json liefert die Bytes direkt in der Antwort.",
      billing:
        "Abrechnung pro Bild. credits_charged in der Antwort zeigt die Kosten des Aufrufs.",
    },
  },
  speech: {
    title: "POST /v1/audio/speech",
    intro:
      "Text rein, Audiodaten raus. model ist eine Stimmen-ID aus GET /v1/models (modality speech), etwa openai-nova. Der OpenAI-Weg geht auch: model tts-1 mit voice nova.",
    points: {
      voices:
        "input bis 4096 Zeichen. speed 0.25 bis 4 bei Stimmen von OpenAI, NanoGPT und ElevenLabs.",
      formats:
        "response_format mp3 (Standard), opus, aac, flac, wav oder pcm. Welche eine Stimme liefert, hängt vom Anbieter ab; alles andere antwortet mit 400 und der Liste.",
      billing:
        "Abrechnung pro Zeichen. Der Header X-Credits-Charged zeigt die Kosten des Aufrufs.",
    },
  },
  transcriptions: {
    title: "POST /v1/audio/transcriptions",
    intro:
      "Sprache zu Text im OpenAI-Whisper-Format. Multipart-Upload, derselbe SDK-Aufruf, den du schon nutzt.",
    transcribe: {
      title: "Transkribieren",
      body: "file bis 25 MB (mp3, mp4, m4a, wav, webm, ogg, flac), model wie whisper-1, optional language. response_format json, text, srt, verbose_json oder vtt.",
    },
    translate: {
      title: "POST /v1/audio/translations",
      body: "Beliebige gesprochene Sprache rein, englischer Text raus. Läuft auf whisper-1. Gleiche Formate wie bei Transkriptionen.",
    },
    points: {
      billing: "Abrechnung pro Audiosekunde.",
    },
  },
  videos: {
    title: "POST /v1/videos",
    intro:
      "Asynchron, im Format der OpenAI-Video-API. Der Aufruf antwortet sofort mit einem Job. Status abfragen, dann das MP4 laden.",
    create: {
      title: "Job starten",
      body: "model, prompt, seconds, size oder aspect_ratio, resolution, negative_prompt. Die Antwort ist ein Videoobjekt mit status queued. Darunter: dasselbe Objekt, wenn es fertig ist.",
    },
    poll: {
      title: "Abfragen und herunterladen",
      body: "GET /v1/videos/{id} liefert status (queued, in_progress, completed, failed), progress und am Ende eine signierte url. Abfragen ist kostenlos und zählt nicht gegen das Ratenlimit. GET /v1/videos/{id}/content streamt das MP4.",
    },
    points: {
      image:
        "Bild zu Video: image_url im JSON oder input_reference als Multipart-Upload senden. Es wird zum ersten Frame.",
      billing:
        "Abrechnung erst, wenn das Video fertig ist, pro Videosekunde. credits_charged zeigt die Kosten.",
      failed: "Ein fehlgeschlagener Job kostet nichts. error nennt den Grund.",
    },
  },
  music: {
    title: "POST /v1/music",
    intro:
      "Asynchron wie Video. Job starten, GET /v1/music/{id} abfragen, GET /v1/music/{id}/content herunterladen.",
    points: {
      seconds:
        "seconds: etwa 8, 20 oder 30. Das Modell kann runden. Stil, Stimmung, Instrumente und Tempo gehören in prompt.",
      billing:
        "Abrechnung pro Clip, sobald er fertig ist. Ein fehlgeschlagener Job kostet nichts.",
    },
  },
  mediaFiles: {
    title: "GET /v1/media/{folder}/{file}",
    intro:
      "Jede url in einer Medienantwort zeigt hierher. Der signierte Link funktioniert 7 Tage ohne Schlüssel, also direkt im Browser oder beim Endnutzer. Mit deinem API-Schlüssel klappt derselbe Pfad jederzeit.",
  },
  codingTools: {
    title: "Direkt im Coding-Agent nutzen",
    intro:
      "Eine Base-URL, ein Schlüssel. Codex CLI und Claude Code verbinden sich nativ. OpenCode, Continue, Aider und Cline laufen über Chat Completions. Block kopieren, ausführen.",
    keyPage:
      "Die Seite API-Schlüssel zeigt dieselben Blöcke, mit deinem Schlüssel schon eingesetzt.",
    keyPageCta: "Mit eigenem Schlüssel holen",
    guide: "Zum Coding-Tools-Guide",
  },
  cta: {
    title: "Bau auf jedem Modell.",
    subtitle: "Schlüssel erstellen, SDK umstellen, ausliefern.",
    button: "API-Schlüssel erstellen",
    secondary: "Tarife vergleichen",
  },
};
