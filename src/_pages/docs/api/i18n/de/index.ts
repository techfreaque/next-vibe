import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} API-Doku - OpenAI-kompatibles /v1",
    description:
      "Ein Endpunkt, {{modelCount}} Modelle. Drop-in-OpenAI-API: Chat Completions, Streaming, Tool-Aufrufe. Mit sk-unb-Schlüssel anmelden, pro Token in Credits zahlen.",
    category: "API",
    imageAlt: "{{appName}} OpenAI-kompatible API-Doku",
    keywords:
      "api, openai-kompatibel, chat completions, streaming, function calling, tools, {{appName}}",
  },
  nav: {
    quickstart: "Schnellstart",
    auth: "Authentifizierung",
    models: "Modelle",
    chat: "Chat Completions",
    tools: "Tool-Aufrufe",
    billing: "Credits und Abrechnung",
    limits: "Rate Limits",
    errors: "Fehler",
  },
  hero: {
    badge: "OpenAI-kompatible API",
    title: "Eine Base-URL.",
    titleHighlight: "Jedes Modell.",
    subtitle:
      "Richte ein beliebiges OpenAI-SDK auf {{appName}}. {{modelCount}} Modelle, Streaming, Tool-Aufrufe. Dein Schlüssel, deine Credits, kein neuer Client.",
    ctaKey: "API-Schlüssel holen",
    ctaPricing: "Tarife ansehen",
  },
  quickstart: {
    title: "In 60 Sekunden zum ersten Aufruf",
    intro:
      "Die API spricht das OpenAI-Format. Läuft dein Code gegen OpenAI, läuft er auch hier, nach zwei Änderungen: Base-URL und Schlüssel.",
    baseUrlLabel: "Base-URL",
    baseUrlNote:
      "Jede Sprache im Pfad funktioniert (en-US, de-DE, pl-PL). Sie bestimmt nur die Sprache der Fehlermeldungen.",
    step1: {
      title: "Schlüssel holen",
      description:
        "Erstelle unter Einstellungen > API-Schlüssel einen sk-unb-Schlüssel. Er wird nur einmal angezeigt. Die API gehört zu jedem bezahlten Tarif: ein aktives Abo oder ein gekauftes Credit-Paket schaltet sie frei.",
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
    title: "Nur mit bezahltem Tarif",
    body: "Schlüssel erstellen und /v1 aufrufen geht nur mit bezahltem Konto: aktives Abo oder mindestens ein Credit-Kauf. Konten im kostenlosen Tarif bekommen HTTP 402 mit dem Code paid_plan_required, die Doku können sie trotzdem lesen. Deine Credits bleiben dein: Einmal ein Paket kaufen, und die API läuft, bis das Guthaben aufgebraucht ist.",
  },
  auth: {
    title: "Authentifizierung",
    intro:
      "Sende deinen Schlüssel bei jeder Anfrage als Bearer-Token. Schlüssel beginnen mit sk-unb-.",
    header: "Authorization: Bearer sk-unb-DEIN_SCHLUESSEL",
    points: {
      hash: "Wir speichern einen Hash, nicht den Schlüssel. Verloren heißt: neuen erstellen.",
      scope:
        "Ein Schlüssel gilt nur für /v1. Auf Konto, Zahlungen oder Einstellungen kommt er nicht.",
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
    note: "Die Liste hängt von deinem Konto ab. Unbekannte oder nicht verfügbare IDs liefern 404 model_not_found. Die API tauscht dein Modell nie heimlich aus.",
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
      "Die API zieht von denselben Credits wie die Chat-App, zu denselben Preisen. Ein Guthaben, eine Rechnung.",
    points: {
      price:
        "Kosten = Eingabe- plus Ausgabe-Token zum Credit-Preis des Modells. Die Preise pro Million Token stehen in GET /v1/models.",
      usage:
        "Jede Antwort nennt usage.credits_charged. Dein Guthaben findest du in der App unter Credits.",
      preflight:
        "Vor jedem Aufruf prüfen wir dein Guthaben gegen eine Worst-Case-Schätzung. Reicht es nicht: HTTP 402 insufficient_credits, nichts läuft, nichts wird berechnet.",
      real: "Nach dem Aufruf zahlst du die echte Token-Nutzung, die der Anbieter meldet, nicht die Schätzung.",
      topup:
        "Credits leer? Kaufe ein Paket oder verlängere deinen Tarif. Der nächste Aufruf läuft sofort.",
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
      missingKey: "Kein Authorization-Header. Sende Bearer sk-unb-...",
      invalidKey: "Schlüssel ist falsch oder widerrufen.",
      paid: "Das Konto hat keinen bezahlten Tarif. Abonniere oder kaufe Credits.",
      credits: "Guthaben reicht für diesen Aufruf nicht. Auffüllen.",
      cap: "Tageslimit des kostenlosen Tarifs erreicht. Credits lösen das.",
      notFound:
        "Das Modell existiert nicht oder steht dir nicht zur Verfügung.",
      invalid:
        "Ungültige Anfrage: nicht unterstützter Parameter, falsche tool_choice, falsche Bild-URL.",
      rate: "Über 60 Anfragen pro Minute für diesen Schlüssel. Lies Retry-After.",
      upstream:
        "Der Modellanbieter ist ausgefallen. Wiederholen ist sicher. Streams enden mit einem Fehler-Event.",
      balance:
        "Dein Guthaben war nicht lesbar, deshalb lief nichts. Wiederholen.",
    },
    streamNote:
      "Fehler mitten im Stream kommen als data:-Event mit demselben Fehlerobjekt, gefolgt von data: [DONE].",
  },
  cta: {
    title: "Bau auf jedem Modell.",
    subtitle: "Schlüssel erstellen, SDK umstellen, ausliefern.",
    button: "API-Schlüssel erstellen",
    secondary: "Tarife vergleichen",
  },
};
