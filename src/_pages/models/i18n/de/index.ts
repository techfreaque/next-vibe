import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "KI-Modelle",
    index: {
      title: "{{count}} KI-Chatmodelle - Preise, Kontext, Filter | {{appName}}",
      description:
        "Alle Modelle auf {{appName}} in einer Liste: Claude, GPT, Gemini, Grok, DeepSeek, offene und unzensierte Chat-Modelle, dazu Bild, Stimme, Musik und Video. Echter Preis pro Nutzung, Kontextfenster, Eingaben. Modell wählen, loslegen.",
      imageAlt: "KI-Modellverzeichnis auf {{appName}}",
      keywords:
        "KI-Modelle, LLM-Vergleich, unzensierte KI, Open-Source-KI, KI-Preise, {{appName}}",
    },
    model: {
      title: "{{model}}: Preis, API & {{context}} Kontext | {{appName}}",
      titleShort: "{{model}}: Preis, API & {{context}} Kontext",
      titleMin: "{{model}}: Preis & API",
      titleUncensored: "{{model}}: unzensierte KI, Preis & API | {{appName}}",
      titleUncensoredShort: "{{model}}: unzensierte KI, Preis & API",
      titleUncensoredMin: "{{model}} unzensiert: Preis & API",
      titleLegacy: "{{model}}: Preis & Kontext (veraltet) | {{appName}}",
      titleLegacyShort: "{{model}}: Preis & Kontext (veraltet)",
      description:
        "{{model}} von {{lab}}: {{input}} Input, {{output}} Output pro 1M Token. {{context}} Kontext, ~{{credits}} Credits pro Nachricht. Gratis-Credits zum Start.",
      descriptionFlat:
        "{{model}} von {{lab}}: ~{{credits}} Credits ({{money}}) pro Nachricht, {{context}} Kontext, Stufe {{tier}}. Gratis-Credits zum Start.",
      descriptionUncensored:
        "{{model}} beantwortet, was gefilterte KI verweigert. {{input}} Input, {{output}} Output pro 1M Token, {{context}} Kontext. Chat oder API, einmaliger 18+-Check.",
      descriptionUncensoredFlat:
        "{{model}} beantwortet, was gefilterte KI verweigert. ~{{credits}} Credits ({{money}}) pro Nachricht, {{context}} Kontext. Chat oder API, einmaliger 18+-Check.",
      descriptionLegacy:
        "{{model}} von {{lab}} ist veraltet, Nachfolger: {{successor}}. {{context}} Kontext, ~{{credits}} Credits pro Nachricht. Daten, Preis und Nachfolger.",
      descriptionLegacyNoSuccessor:
        "{{model}} von {{lab}} ist veraltet. {{context}} Kontext, ~{{credits}} Credits pro Nachricht. Daten, Preis und aktuelle Alternativen.",
      imageAlt: "{{model}} auf {{appName}}",
      keywords:
        "{{model}}, {{model}} Preis, {{model}} API, {{model}} Kontextfenster, {{lab}} KI, {{appName}}",
    },
    media: {
      title: "{{model}} Preis: {{credits}} Credits pro {{unit}} | {{appName}}",
      titleShort: "{{model}} Preis: {{credits}} Credits pro {{unit}}",
      titleMin: "{{model}}: Preis pro {{unit}}",
      titleNoPrice: "{{model}}: Preis & Nutzung, {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}}: Preis & Nutzung, {{type}}",
      description:
        "{{model}} von {{lab}}, Kategorie {{type}}: {{credits}} Credits ({{money}}) pro {{unit}}. Eingabe: {{inputs}}. Im Tool oder per Chat. Gratis-Credits zum Start.",
      descriptionNoPrice:
        "{{model}} von {{lab}}, Kategorie {{type}}, Stufe {{tier}}. Echter Preis pro Nutzung in Credits. Im Tool oder per Chat. Gratis-Credits zum Start.",
      imageAlt: "{{model}} auf {{appName}}",
      keywords:
        "{{model}}, {{model}} Preis, {{lab}} KI, {{type}} KI-Modell, {{appName}}",
    },
    compare: {
      title: "{{a}} vs. {{b}}: Preis & Kontext | {{appName}}",
      titleShort: "{{a}} vs. {{b}}: Preis & Kontext",
      titleMin: "{{a}} vs. {{b}}",
      description:
        "{{a}} vs. {{b}}: ~{{creditsA}} gegen ~{{creditsB}} Credits pro Nachricht, {{contextA}} gegen {{contextB}} Kontext. Eingaben, Tools, Filter und API im Direktvergleich.",
      imageAlt: "{{a}} vs. {{b}} auf {{appName}}",
      keywords: "{{a}} vs {{b}}, {{a}}, {{b}}, KI-Modellvergleich, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Mainstream",
      line: "Die Modelle der großen Labs mit eigenen Sicherheitsfiltern. Stark bei Arbeit, Code und Recherche.",
    },
    open: {
      name: "Offen",
      line: "Open-Weight-Modelle mit lockereren Filtern. Mehr Spielraum, weniger Verweigerung.",
    },
    uncensored: {
      name: "Unzensiert",
      line: "Zwei Sorten, beide antworten auf alles. Die meisten sind Mainstream-Modelle ohne Verweigerungsreflex: gleiches Training, gleiches Weltbild, nur ohne Ausweichen. UncensoredLM ist die andere Sorte: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind, deshalb politische Positionen gegen den Mainstream.",
    },
  },
  modality: {
    text: "Text",
    image: "Bilder",
    audio: "Audio",
    video: "Video",
  },
  facts: {
    heading: "Die Fakten",
    type: "Modelltyp",
    lab: "Entwickelt von",
    tier: "Inhaltsstufe",
    intelligence: "Intelligenz",
    price: "Geschätzter Preis pro Nachricht",
    priceValue: "~{{credits}} Credits",
    priceFree: "Kostenlos",
    priceHint: "≈ {{count}} Nachrichten für {{unit}}",
    priceHintFree: "Kostet dich pro Nachricht nichts",
    priceFootnote:
      "Typische Nachricht: 16K Token rein, 1,5K raus. Kurze Antworten kosten weniger. Modelle über OpenRouter rechnen die echten Anbieterkosten plus unseren Aufschlag ab, der tatsächliche Preis schwankt. 1 Credit = {{value}}.",
    context: "Kontextfenster",
    contextValue: "{{tokens}} Token",
    contextHint: "≈ {{pages}} Seiten Text auf einmal",
    inputs: "Versteht",
    outputs: "Erzeugt",
    providers: "Bereitgestellt über",
    tools: "Werkzeugnutzung",
    toolsYes: "Ja - Suche, Gedächtnis, Code und mehr",
    toolsNo: "Nein - reiner Chat",
    status: "Status",
    statusCurrent: "Aktuell",
    statusLegacy: "Veraltet",
    tokenPrice: "Preis pro 1M Token",
    tokenPriceValue: "{{input}} Input, {{output}} Output",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} Credits",
    parameters: "Größe",
    parametersValue: "{{count}} Mrd. Parameter",
    strengths: "Stark bei",
    uncensoredKind: "Unzensiert-Variante",
    apiId: "API-Modell-ID",
    apiIdHint:
      "API kompatibel mit OpenAI und Anthropic. Braucht ein bezahltes Konto: jeder Plan.",
    apiIdLegacy: "Nicht mehr in der API. Nimm {{successor}}.",
    apiIdLegacyNoSuccessor: "Nicht mehr in der API.",
    notListed: "Keine Angabe",
    notUncensored: "Gefiltert",
    fixedPrice: "Festpreis pro Nachricht",
    notPublished: "Nicht veröffentlicht",
  },
  strengths: {
    coding: "Code",
    reasoning: "Logik",
    analysis: "Analyse",
    creative: "Kreatives Schreiben",
    roleplay: "Rollenspiel",
    roleplayDark: "Dunkle Fiktion",
    fast: "Tempo",
    vision: "Bildverständnis",
    imageGen: "Bildgenerierung",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Eigenes Weltbild",
      line: "Trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Politische Positionen gegen den Mainstream.",
    },
    refusalsRemoved: {
      name: "Verweigerungen entfernt",
      line: "Basiert auf einem bestehenden Modell, nachtrainiert, damit es nicht mehr verweigert. Gleiches Training, gleiches Weltbild, kein Ausweichen mehr.",
    },
  },
  units: {
    image: "Bild",
    audio: "Track",
    video: "{{seconds}}-s-Clip",
    videoClip: "Clip",
    tts: "{{chars}} Zeichen",
    stt: "{{seconds}} s Audio",
  },
  bestFor: {
    heading: "Wofür {{model}} am besten ist",
    good: "Stark für",
    skip: "Weniger geeignet für",
    items: {
      coding: "Code schreiben, prüfen und reparieren",
      reasoning: "Mehrstufiges Denken: Mathe, Logik, Planung",
      analysis: "Recherche und Analyse langer Texte",
      creative: "Kreatives Schreiben und Brainstorming",
      roleplay: "Rollenspiel und interaktive Fiktion",
      roleplayDark: "Dunkle und Tabu-Fiktion",
      fast: "Schnelle Antworten, wenn Tempo zählt",
      vision: "Screenshots, Fotos und Scans lesen",
      videoInput: "Videos verstehen",
      audioInput: "Audio verstehen",
      imageGen: "Bilder im Chat erzeugen und bearbeiten",
      longContext: "Ganze Bücher oder Codebasen in einem Prompt",
      budget: "Massenarbeit mit kleinem Budget",
      tools: "Agentenarbeit mit Werkzeugen: Suche, Gedächtnis, Code",
      uncensored: "Fragen, die Mainstream-Modelle verweigern",
      ownWorldview: "Politische Positionen gegen den Mainstream",
    },
    skipItems: {
      noTools: "Agenten-Workflows: kein Tool-Calling",
      textOnly: "Bilder oder Screenshots: liest nur Text",
      pricey: "Massenjobs: teurer pro Nachricht als die meisten Modelle hier",
      smallContext: "Sehr lange Dokumente: Kontext endet bei {{tokens}} Token",
      filtered:
        "Themen, die {{lab}} filtert: dafür ein unzensiertes Modell nehmen",
      legacy: "Neue Projekte: {{successor}} ersetzt es",
      legacyNoSuccessor: "Neue Projekte: das Modell ist veraltet",
    },
    picks: {
      claudeOpus:
        "Anthropics Schwergewicht für harte Aufgaben: große Codebasen, sorgfältige Analysen, Texte mit Urteilsvermögen. Kostet mehr pro Nachricht, also dort einsetzen, wo Qualität sich auszahlt.",
      claudeSonnet:
        "Der Claude für den Alltag. Stark bei Code, Analyse und Text, günstiger als Opus und damit tragfähig für die tägliche Arbeit.",
      claudeHaiku:
        "Schneller, günstiger Claude für kurze Antworten, Zusammenfassungen und einfachen Code. Liest auch Screenshots.",
      gptSol:
        "OpenAIs Flaggschiff für Logik, Code und lange Analysen. Die Wahl für GPT-Qualität bei schweren Problemen.",
      gptLuna:
        "OpenAIs schnelles, günstiges Modell für Alltagschat und kurze Recherchen.",
      geminiArgon:
        "Googles Spitzenklasse, die Text, Bilder, Video und Audio versteht. Stark bei Logik und Code über gemischte Medien.",
      geminiFlash:
        "Schnelles Gemini, das trotzdem Bilder, Video und Audio versteht. Viel Analyse und Code fürs Geld.",
      grok: "xAIs Flaggschiff mit leichteren Filtern als die anderen großen Labs. Starke Logik und Code, weniger Verweigerungen.",
      deepseekPro:
        "DeepSeeks großes Reasoning-Modell. Code und Analyse auf Spitzenniveau zu einem Bruchteil dessen, was geschlossene Flaggschiffe kosten.",
      deepseekFlash:
        "Eines der günstigsten fähigen Modelle hier. Schneller Code und Analyse, liest Bilder, gebaut für hohe Volumen.",
      glm: "Das offene Modell von Z.AI für Code und Logik. Kluge Antworten zum Sparpreis.",
      kimi: "Moonshots Flaggschiff: Logik, Code und kreatives Schreiben, dazu versteht es Bilder und Video.",
      qwenMax:
        "Alibabas Flaggschiff-Qwen. Logik, Code und Analyse, dazu versteht es Bilder und Video.",
      mistralLarge:
        "Mistrals Flaggschiff aus Frankreich. Solide bei Code und Analyse, liest auch Bilder.",
      metaWonder:
        "Metas Topmodell. Versteht Text, Bilder, Video und Audio, stark bei Logik, Code und kreativer Arbeit.",
      uncensoredLm:
        "Das unzensierte Modell mit eigenem Weltbild. Trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind: politische Positionen, die du von den großen Labs nicht bekommst.",
      glmUncensored:
        "GLM 5.3 ohne Verweigerungen. Gleiches Hirn, gleiches Weltbild, beantwortet alles. Einer der stärksten Denker unter den unzensierten Modellen.",
      glmFlashUncensored:
        "Schnell, günstig, ohne Verweigerungen. GLM 5.3 Flash ohne Ausweichen, und es liest Bilder.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash ohne Verweigerungen. Code, Analyse und Fiktion ohne Belehrungen, zum kleinen Preis.",
      veniceUncensored:
        "Das eigene unzensierte Chatmodell von Venice. Günstig und schnell, gemacht für kreatives Schreiben und Rollenspiel ohne Verweigerungen.",
    },
  },
  related: {
    heading: "Ähnliche Modelle",
    intro:
      "Gleiches Lab, gleiche Stufe, günstigere Alternativen. Jedes mit eigener Seite.",
    reasons: {
      uncensored: "Unzensierte Version",
      original: "Originalmodell",
      cheaper: "Günstiger, gleiche Stufe",
      sameLab: "Ebenfalls von {{lab}}",
      sameTier: "Gleiche Stufe",
      sameType: "Gleicher Typ",
    },
    perMessage: "~{{credits}} Credits pro Nachricht",
    perUse: "{{credits}} Credits pro {{unit}}",
  },
  faq: {
    heading: "{{model}}: Fragen und Antworten",
    price: {
      q: "Was kostet {{model}}?",
      aTokens:
        "Rund {{credits}} Credits ({{money}}) für eine typische Nachricht: 16K Token rein, 1,5K raus. Pro 1M Token: {{input}} Input, {{output}} Output. Du zahlst pro Nutzung in Credits. Gratis-Credits zum Start.",
      aFlat:
        "Rund {{credits}} Credits ({{money}}) für eine typische Nachricht. Du zahlst pro Nutzung in Credits. Gratis-Credits zum Start.",
      aFree: "{{model}} kostet pro Nachricht keine Credits.",
    },
    uncensored: {
      q: "Ist {{model}} unzensiert?",
      mainstream:
        "Nein. {{model}} behält die Sicherheitsfilter von {{lab}} und verweigert manche Themen. Dafür wechselst du im selben Chat auf ein unzensiertes Modell.",
      open: "Teilweise. {{model}} ist ein offenes Modell mit leichteren Filtern als Mainstream-Modelle: Es verweigert seltener, ist aber nicht komplett unzensiert. Für null Verweigerungen nimm ein Modell aus der Stufe Unzensiert.",
      refusalsRemoved:
        "Ja. {{model}} basiert auf einem bestehenden Modell, dem der Verweigerungsreflex abtrainiert wurde: gleiches Training, gleiches Weltbild, nur ohne Ausweichen. Unzensierte Modelle brauchen eine einmalige 18+-Bestätigung.",
      ownWorldview:
        "Ja, und anders als die meisten. {{model}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind, deshalb laufen seine politischen Positionen gegen den Mainstream. Bei den meisten anderen unzensierten Modellen sind nur die Verweigerungen entfernt. Unzensierte Modelle brauchen eine einmalige 18+-Bestätigung.",
    },
    api: {
      q: "Kann ich {{model}} per API nutzen?",
      a: "Ja. Ruf es als {{id}} über die {{appName}}-API auf, kompatibel mit den Formaten von OpenAI und Anthropic. Die API braucht ein bezahltes Konto: jeder Plan.",
      legacy:
        "{{model}} ist veraltet und nicht mehr in der API gelistet. Nimm stattdessen {{successor}} ({{id}}). Die API braucht ein bezahltes Konto: jeder Plan.",
      legacyNoSuccessor:
        "{{model}} ist veraltet und nicht mehr in der API gelistet. GET /v1/models zeigt jedes Modell, das du aufrufen kannst.",
    },
    context: {
      q: "Wie groß ist das Kontextfenster von {{model}}?",
      a: "{{tokens}} Token. Das sind rund {{pages}} Seiten Text auf einmal.",
    },
    inputs: {
      q: "Kann {{model}} Bilder lesen und Werkzeuge nutzen?",
      images: "Ja, es liest Bilder: Screenshots, Fotos oder Scans.",
      imagesAndMore: "Ja, es liest Bilder. Weitere Eingaben: {{more}}.",
      textOnly: "Nein, es liest nur Text.",
      toolsYes:
        "Es unterstützt Tool-Calling: Websuche, Gedächtnis und Code im Chat, Function Calls in der API.",
      toolsNo: "Es hat kein Tool-Calling und antwortet aus seinem Wissen.",
    },
  },
  mediaFaq: {
    price: {
      q: "Was kostet {{model}}?",
      a: "{{credits}} Credits ({{money}}) pro {{unit}}. Größe, Länge und Optionen verändern den Preis. Du zahlst pro Nutzung in Credits. Gratis-Credits zum Start.",
      aNone:
        "Der Preis hängt von Größe, Länge und Optionen ab. Den Live-Preis zeigt die Tabelle oben. Du zahlst pro Nutzung in Credits. Gratis-Credits zum Start.",
    },
    use: {
      q: "Wie nutze ich {{model}}?",
      a: "Öffne das Werkzeug {{type}} mit {{model}} vorausgewählt und starte. Oder bitte ein beliebiges Chatmodell, {{model}} für dich zu nutzen.",
    },
    inputs: {
      q: "Was nimmt {{model}} als Eingabe?",
      a: "Eingabe: {{inputs}}. Ausgabe: {{outputs}}.",
    },
    uncensored: {
      q: "Ist {{model}} unzensiert?",
      mainstream: "Nein. {{model}} läuft mit den Inhaltsfiltern von {{lab}}.",
      open: "Teilweise. {{model}} hat leichtere Filter als Mainstream-Modelle, ist aber nicht komplett unzensiert.",
      uncensored:
        "Ja. {{model}} gehört zur Stufe Unzensiert und erzeugt, was gefilterte Modelle blockieren.",
      consent: "Unzensierte Modelle brauchen eine einmalige 18+-Bestätigung.",
    },
  },
  readMore: {
    heading: "Weiterlesen",
  },
  directory: {
    heading: "Alle Modellseiten",
    intro:
      "Direkte Links zu allen {{count}} Modellseiten, veraltete Modelle inklusive.",
  },
  breadcrumb: {
    models: "KI-Modelle",
  },
  jsonLd: {
    perMessage: "typische Nachricht (16K Token rein, 1,5K raus)",
    perInputTokens: "Input-Token",
    perOutputTokens: "Output-Token",
  },
  currencyUnit: {
    usd: "1 $",
    eur: "1 €",
  },
  creditValue: {
    usd: "0,01 $",
    eur: "0,01 €",
  },
  chatPrompt:
    "Worin bist du am stärksten? Zeig es mir an einem kurzen, konkreten Beispiel.",
  catalog: {
    typesLabel: "Modelltyp",
    types: {
      text: "Chat",
      tts: "Text zu Stimme",
      stt: "Stimme zu Text",
      image: "Bilder",
      audio: "Musik",
      video: "Video",
    },
    context: "{{size}} Kontext",
    legacyBadge: "Alt",
    count: "{{count}} Modelle",
    showLegacy: "Veraltete anzeigen ({{count}})",
    hideLegacy: "Veraltete ausblenden",
  },
  index: {
    eyebrow:
      "{{chat}} Chat-Modelle, dazu {{image}} Bild-, {{video}} Video-, {{music}} Musik- und {{voice}} Sprachmodelle",
    title: "Jedes Modell. Ein Chat.",
    subtitle:
      "Mainstream, offen und unzensiert. Echte Preise pro Nachricht, echte Kontextgrößen. Den Filter bestimmst du. Nicht wir.",
    searchLabel: "Modelle durchsuchen",
    searchPlaceholder: "Nach Name oder Lab suchen: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} Modelle",
    noResults: "Kein Modell passt zu „{{query}}“.",
    legacyTitle: "Veraltete Modelle",
    legacyIntro:
      "Ältere Versionen. Gespeicherte Chats und Skills, die sie nutzen, wechseln automatisch zum Nachfolger.",
    perMessage: "~{{credits}} Cr./Nachr.",
    free: "Kostenlos",
    ctaTitle: "Genug Datenblätter. Frag einfach.",
    ctaSubtitle:
      "Chat öffnen, beliebiges Modell im Selektor wählen, mitten im Gespräch wechseln.",
    ctaButton: "Chat starten",
  },
  model: {
    back: "Alle Modelle",
    chatCta: "Mit {{model}} chatten",
    compareCta: "Vergleichen",
    legacyBanner:
      "{{model}} ist veraltet. Der Nachfolger {{successor}} ist schneller oder günstiger - und Chats mit {{model}} wechseln automatisch dorthin.",
    legacyCta: "Zu {{successor}}",
    compareHeading: "{{model}} im Vergleich",
    compareIntro: "Dieselben Fakten, direkt nebeneinander.",
    compareWith: "{{model}} vs. {{other}}",
    ctaTitle: "{{model}} jetzt testen.",
    ctaSubtitle:
      "Start-Credits gratis, keine Karte nötig. Der Chat öffnet mit {{model}} und fertigem Prompt. Einfach abschicken.",
  },
  media: {
    priceLabel: "Preis pro Nutzung",
    generateCta: "Mit {{model}} generieren",
    useCta: "{{model}} nutzen",
    chatNote:
      "Funktioniert auch im Chat: Lass ein Chat-Modell {{model}} für dich einsetzen.",
    priceFootnote:
      "Der Preis gilt pro Einheit - Bild, Clip, Sekunde oder Zeichen - und ändert sich mit Größe, Länge und Optionen. 1 Credit = {{value}}.",
    ctaTitle: "{{model}} jetzt ausprobieren.",
    ctaSubtitle:
      "Start-Credits gratis, keine Karte nötig. Das Werkzeug öffnet sich startbereit.",
  },
  compare: {
    back: "Alle Modelle",
    eyebrow: "Direktvergleich",
    title: "{{a}} vs. {{b}}",
    subtitle: "Preis, Kontext, Eingaben und Filter. Kein Benchmark-Theater.",
    fact: "Merkmal",
    cheaper: "{{model}} kostet pro Nachricht {{times}}× weniger.",
    samePrice: "Beide kosten pro Nachricht etwa gleich viel.",
    biggerContext: "{{model}} fasst {{times}}× mehr Kontext.",
    sameContext: "Beide fassen gleich viel Kontext.",
    chatWith: "Mit {{model}} chatten",
    modelPage: "Details zu {{model}}",
    swap: "Seiten tauschen",
    sameModel: "Wähle zwei verschiedene Modelle für den Vergleich.",
  },
  picker: {
    change: "Modell ändern",
    search: "Modelle suchen",
    suggested: "Empfohlen",
    all: "Alle Modelle",
    empty: "Kein Modell gefunden.",
  },
  refusal: {
    heading: "Verweigerungs-Index",
    intro:
      "So hat {{model}} das feste Fragenset im letzten Wochenlauf ({{date}}) beantwortet.",
    rank: "Rang {{rank}} von {{total}} (1 = wenigste Ablehnungen)",
    refused: "Abgelehnt",
    hedged: "Abgeschwächt",
    answered: "Beantwortet",
    judged: "{{count}} bewertete Antworten",
    trend: "{{delta}} Pkt. ggü. letztem Lauf",
    categories: "Nach Kategorie",
    samplesHeading: "Beispielantworten",
    samplesIntro:
      "Echte Antworten aus dem Messlauf. Derselbe Prompt für jedes Modell.",
    question: "Frage",
    answer: "Antwort",
    judge: "Richter",
    methodCta: "So messen wir",
  },
};
