import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  compareHub: {
    title: "KI-Modelle vergleichen",
    description:
      "Vergleiche verfügbare KI-Modelle direkt nach Preis, Kontextfenster, Funktionen und Inhaltsfiltern.",
  },
  meta: {
    category: "KI-Modelle",
    index: {
      title: "{{count}} KI-Chatmodelle: Preise, Kontext, Filter | {{appName}}",
      description:
        "Alle KI-Modelle auf {{appName}}: Claude, GPT, Gemini, Grok, DeepSeek, unzensierte und abliterierte Chats, plus Bild, Ton, Video. Echte Preise, Gratis-Credits.",
      imageAlt: "KI-Modellverzeichnis auf {{appName}}",
      keywords:
        "KI-Modelle, LLM-Vergleich, unzensierte KI, Open-Source-KI, KI-Preise, {{appName}}",
    },
    model: {
      title: "{{model}} online chatten: Preis & API | {{appName}}",
      titleShort: "{{model}} online chatten: Preis & API",
      titleMin: "{{model}} online chatten",
      titleUncensored: "{{model}} unzensiert online chatten | {{appName}}",
      titleUncensoredShort: "{{model}} unzensiert online chatten",
      titleLegacy:
        "{{model}} (ersetzt durch {{successor}}): online chatten | {{appName}}",
      titleLegacyShort:
        "{{model}} (ersetzt durch {{successor}}): online chatten",
      titleLegacyMin: "{{model}}, jetzt {{successor}}: online chatten",
      titleLegacyNoSuccessor:
        "{{model}}: Preis, Kontext und Alternativen | {{appName}}",
      titleLegacyNoSuccessorShort: "{{model}}: Preis, Kontext und Alternativen",
      description:
        "{{model}} von {{lab}} im Browser chatten, ohne Installation, oder per API: {{input}} Input, {{output}} Output pro 1M Token, {{context}} Kontext. {{hook}}",
      descriptionFlat:
        "{{model}} von {{lab}} im Browser chatten, ohne Installation, oder per API: ~{{credits}} Credits ({{money}}) pro Nachricht, {{context}} Kontext. {{hook}}",
      descriptionUncensored:
        "Unzensierter KI-Chat mit {{model}} im Browser, ohne Installation, oder per API: {{input}} Input, {{output}} Output pro 1M Token, {{context}} Kontext. {{hook}}",
      descriptionUncensoredFlat:
        "Unzensierter KI-Chat mit {{model}} im Browser, ohne Installation, oder per API: ~{{credits}} Credits ({{money}}) pro Nachricht, {{context}} Kontext. {{hook}}",
      descriptionLegacy:
        "{{model}} von {{lab}} ist veraltet, Nachfolger: {{successor}}. {{context}} Kontext, ~{{credits}} Credits pro Nachricht. Daten, Preis und Nachfolger.",
      descriptionLegacyNoSuccessor:
        "{{model}} von {{lab}} ist veraltet. {{context}} Kontext, ~{{credits}} Credits pro Nachricht. Daten, Preis und aktuelle Alternativen.",
      titleUncensoredNamed:
        "{{model}} online chatten, gratis testen | {{appName}}",
      titleUncensoredNamedShort: "{{model}} online chatten, gratis testen",
      hookGuest: "Gratis-Credits, ohne Anmeldung.",
      hookAccount: "Gratis-Credits mit kostenlosem Konto.",
      hookPaid: "Abrechnung pro Nachricht in Credits.",
      hookAdult: "{{hook}} Einmaliger 18+-Check.",
      descriptionShort:
        "{{model}} im Browser chatten oder per API nutzen: ~{{credits}} Credits pro Nachricht, {{context}} Kontext. {{hook}}",
      descriptionUncensoredShort:
        "Unzensierter KI-Chat mit {{model}} im Browser oder per API: ~{{credits}} Credits pro Nachricht, {{context}} Kontext. {{hook}}",
      descriptionUncensoredNamed:
        "{{model}} im Browser chatten, ohne Installation, oder per API: {{input}} Input, {{output}} Output pro 1M Token, {{context}} Kontext. {{hook}}",
      descriptionUncensoredNamedFlat:
        "{{model}} im Browser chatten, ohne Installation, oder per API: ~{{credits}} Credits ({{money}}) pro Nachricht, {{context}} Kontext. {{hook}}",
      descriptionUncensoredNamedShort:
        "{{model}} im Browser chatten oder per API nutzen: ~{{credits}} Credits pro Nachricht, {{context}} Kontext. {{hook}}",
      descriptionLegacyShort:
        "{{model}} von {{lab}} ist veraltet, Nachfolger: {{successor}}. {{context}} Kontext, ~{{credits}} Credits pro Nachricht.",
      descriptionLegacyNoSuccessorShort:
        "{{model}} von {{lab}} ist veraltet. {{context}} Kontext, ~{{credits}} Credits pro Nachricht. Dazu aktuelle Alternativen.",
      imageAlt: "{{model}} auf {{appName}}",
      keywords:
        "{{model}}, {{model}} Preis, {{model}} API, {{model}} Kontextfenster, {{lab}} KI, {{appName}}",
    },
    media: {
      title: "{{model}} online: {{credits}} Credits pro {{unit}} | {{appName}}",
      titleShort: "{{model}} online: {{credits}} Credits pro {{unit}}",
      titleMin: "{{model}} online nutzen",
      titleNoPrice: "{{model}}: Preis & Nutzung, {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}}: Preis & Nutzung, {{type}}",
      description:
        "{{model}} von {{lab}} ({{type}}) online: {{credits}} Credits ({{money}}) pro {{unit}}. Eingabe: {{inputs}}. Im Browser oder per Chat. {{hook}}",
      descriptionNoPrice:
        "{{model}} von {{lab}}, Kategorie {{type}}, Stufe {{tier}}. Echter Preis pro Nutzung in Credits. Im Tool oder per Chat. Gratis-Credits zum Start.",
      descriptionShort:
        "{{model}} von {{lab}} online: {{credits}} Credits ({{money}}) pro {{unit}}. Im Browser oder per Chat. {{hook}}",
      descriptionMin:
        "{{model}} online: {{credits}} Credits pro {{unit}}. Im Browser oder per Chat. {{hook}}",
      descriptionNoPriceShort:
        "{{model}} von {{lab}} ({{type}}). Echter Preis pro Nutzung in Credits, im Browser oder per Chat.",
      imageAlt: "{{model}} auf {{appName}}",
      keywords:
        "{{model}}, {{model}} Preis, {{lab}} KI, {{type}} KI-Modell, {{appName}}",
    },
    compare: {
      title: "{{a}} vs. {{b}}: Preis & Kontext | {{appName}}",
      titleShort: "{{a}} vs. {{b}}: Preis & Kontext",
      titleMin: "{{a}} vs. {{b}}",
      description:
        "{{a}} ({{tierA}}) vs. {{b}} ({{tierB}}): ~{{moneyA}} gegen ~{{moneyB}} pro Nachricht, {{contextA}} gegen {{contextB}} Kontext. Wann welches Modell passt, alle Fakten im Direktvergleich.",
      descriptionShort:
        "{{a}} ({{tierA}}) vs. {{b}} ({{tierB}}): ~{{moneyA}} gegen ~{{moneyB}} pro Nachricht, {{contextA}} gegen {{contextB}} Kontext.",
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
      line: "Modelle für freiere Gespräche und kreatives Schreiben.",
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
    priceValue: "~{{credits}} Credits ({{money}})",
    priceFree: "Kostenlos",
    referenceTurn:
      "Die Beispielnachricht umfasst {{input}} Eingabe- und {{output}} Ausgabetoken.",
    referenceImageTurn:
      "Die Beispielnachricht umfasst {{input}} Eingabetoken, {{output}} Text-Ausgabetoken und ein erzeugtes Bild.",
    priceProvider: "Die Preise gelten für {{provider}}.",
    conditionalPrice: "Staffelpreise pro Million Token",
    tierAt: "Ab {{tokens}} Eingabetoken: {{rates}}.",
    tierUtc: "Von {{start}} bis {{end}} Uhr UTC: {{rates}}.",
    tierInput: "Eingabe {{price}}",
    tierOutput: "Ausgabe {{price}}",
    tierRead: "Cache-Lesen {{price}}",
    tierWrite: "Cache-Schreiben {{price}}",
    tierHour: "Schreiben für eine Stunde {{price}}",
    cacheReadSentence:
      "Eine Million Eingabetoken aus dem Cache kosten {{price}}.",
    cacheWrite1hPrice: "Cache-Schreibzugriff für eine Stunde pro Mio. Token",
    cacheWrite1hSentence:
      "Eine Stunde Speicherdauer kostet beim Schreiben {{price}} pro Million Token.",
    cacheWriteSentence:
      "Das Schreiben in den Cache kostet {{price}} pro Million Token.",
    cacheReadPrice: "Cache-Lesezugriff pro Mio. Token",
    cacheWritePrice: "Cache-Schreibzugriff pro Mio. Token",
    imageOutputPrice: "Bildausgabe pro Mio. Token",
    perMillionCredits: "{{credits}} Credits",
    priceFootnote:
      "Die Kosten hängen von Nutzung und Anbieter ab. Die Umrechnung basiert auf dem einmaligen Credit-Paket mit {{value}} pro Credit.",
    context: "Kontextfenster",
    contextValue: "{{tokens}} Token",
    contextHint: "≈ {{pages}} Seiten Text auf einmal",
    inputs: "Eingabeformate",
    outputs: "Ausgabeformate",
    providers: "Bereitgestellt über",
    tools: "Werkzeugnutzung",
    toolsYes: "Ja: Suche, Gedächtnis, Code und mehr",
    toolsNo: "Nein: reiner Chat",
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
    fixedPrice: "Festpreis pro Nachricht.",
    notPublished: "Nicht veröffentlicht",
    apiIdUnsupported:
      "Dieses Modell ist über die Text-Chat-API nicht verfügbar.",
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
      line: "Auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden. Das prägt seine politischen Positionen abseits des Mainstreams.",
    },
    abliterated: {
      name: "Abliteriert",
      line: "Die Gewichte des Basismodells wurden verändert, damit es seltener Antworten verweigert.",
    },
    fineTuned: {
      name: "Feinabgestimmt",
      line: "Ein vorhandenes Modell wurde für Antworten mit weniger Einschränkungen feinabgestimmt.",
    },
    unlisted: {
      name: "Methode nicht angegeben",
      line: "Dieses Modell gehört zur unzensierten Stufe. Angaben zur Trainings- oder Filtermethode fehlen.",
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
      imageGen: "Bilder im Chat erzeugen",
      longContext: "Ganze Bücher oder Codebasen in einem Prompt",
      budget: "Massenarbeit mit kleinem Budget",
      tools: "Agentenarbeit mit Werkzeugen: Suche, Gedächtnis, Code",
      uncensored: "Fragen, die Mainstream-Modelle verweigern",
      ownWorldview: "Politische Positionen gegen den Mainstream",
    },
    skipItems: {
      noTools: "Agenten-Workflows: kein Tool-Calling",
      noImages: "Aufgaben mit Bildeingabe",
      pricey: "Serienaufgaben bei {{credits}} Credits pro Beispielnachricht",
      smallContext: "Sehr lange Dokumente: Kontext endet bei {{tokens}} Token",
      filtered:
        "Themen, die {{lab}} filtert: dafür ein unzensiertes Modell nehmen",
      legacy: "Neue Projekte: {{successor}} ersetzt es",
      legacyNoSuccessor: "Neue Projekte: das Modell ist veraltet",
      coding: "Anspruchsvolle Programmieraufgaben",
      analysis: "Tiefgehende Analysen",
      reasoning: "Komplexe Schlussfolgerungen",
      creative: "Kreatives Schreiben",
      roleplay: "Rollenspiele",
    },
    media: {
      image: "Bilder erstellen",
      video: "Videoclips erstellen",
      audio: "Musik erzeugen",
      tts: "Geschriebenen Text in Sprache umwandeln",
      stt: "Sprachaufnahmen transkribieren",
      otherOutputs:
        "Aufgaben, die ein anderes Ausgabeformat als {{outputs}} erfordern",
    },
    picks: {
      claudeOpus:
        "Anthropics Schwergewicht für harte Aufgaben: große Codebasen, sorgfältige Analysen, Texte mit Urteilsvermögen. Kostet mehr pro Nachricht, also dort einsetzen, wo Qualität sich auszahlt.",
      claudeSonnet:
        "Der Claude für den Alltag. Stark bei Code, Analyse und Text, günstiger als Opus und damit tragfähig für die tägliche Arbeit.",
      claudeHaiku:
        "Schneller, günstiger Claude für kurze Antworten, Zusammenfassungen und einfachen Code. Liest auch Screenshots.",
      gptSol:
        "Sol eignet sich für tägliche Programmieraufgaben, Dokumentanalysen und den Einsatz von Werkzeugen. Es verarbeitet Text und Bilder.",
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
        "Abliteriertes GLM 5.3 für logische Aufgaben, Code und Analyse. Unterstützt Werkzeugaufrufe.",
      glmFlashUncensored:
        "Abliteriertes GLM 5.3 Flash für schnelle Antworten und Prompts mit Bildern.",
      deepseekFlashUncensored:
        "Abliteriertes DeepSeek V4.1 Flash für Code, Analyse und Geschichten. Akzeptiert Bilder.",
      veniceUncensored:
        "Feinabgestimmtes Chatmodell von Venice für kreatives Schreiben und Rollenspiele.",
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
  plans: {
    heading: "{{model}}: so weit reicht jeder Tarif",
    intro:
      "Eine Referenznachricht mit {{model}} kostet etwa {{credits}} Credits ({{money}}). So viel bringt jeder Tarif im Monat.",
    mediaIntro:
      "Mit {{model}} kostet eine Nutzung ({{unit}}) {{credits}} Credits ({{money}}). So oft reicht jeder Tarif im Monat.",
    messages: "Nachrichten pro Monat",
    uses: "Nutzungen pro Monat",
    colPlan: "Tarif",
    colPrice: "Preis pro Monat",
    colCredits: "Credits pro Monat",
    guest: "Gast, ohne Anmeldung",
    account: "Kostenloses Konto",
    free: "Kostenlos",
    about: "ca. {{count}}",
    underOne: "unter 1",
    footnote:
      "Lange Prompts, Dateien und Tool-Aufrufe kosten pro Nachricht mehr. Dieselben Credits gelten für jedes Modell.",
    mediaFootnote:
      "Länge, Größe oder Qualität ändern den Preis pro Nutzung. Dieselben Credits gelten für jedes Modell.",
  },
  nearest: {
    heading: "{{model}} gegen die nächsten Alternativen",
    intro:
      "Preis, Kontext und Inhaltsstufe nebeneinander. Der Direktvergleich zeigt jedes Detail.",
    colModel: "Modell",
    colPrice: "Preis pro Nachricht",
    colCompare: "Direktvergleich",
    thisModel: "Diese Seite",
  },
  faq: {
    heading: "{{model}}: Fragen und Antworten",
    price: {
      q: "Was kostet {{model}}?",
      aTokens:
        "Eine Beispielnachricht über {{provider}} kostet rund {{credits}} Credits ({{money}}). Pro Million Token kosten die Eingabe {{input}} und die Textausgabe {{output}}.",
      aFlat:
        "Eine Nachricht über {{provider}} kostet {{credits}} Credits ({{money}}).",
      aFree: "{{model}} kostet pro Nachricht keine Credits.",
    },
    uncensored: {
      q: "Ist {{model}} unzensiert?",
      mainstream:
        "Nein. {{model}} behält die Sicherheitsfilter von {{lab}} und verweigert manche Themen. Dafür wechselst du im selben Chat auf ein unzensiertes Modell.",
      open: "{{model}} gehört zur Stufe „Offen“. Antworten können weiterhin gefiltert werden.",
      yes: "Ja.",
      consent:
        "Für unzensierte Chatmodelle musst du einmalig bestätigen, dass du mindestens 18 Jahre alt bist.",
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
    providers: {
      q: "Über welche Anbieter ist {{model}} hier verfügbar?",
      a: "Verfügbare Anbieter sind {{providers}}.",
    },
    inputs: {
      q: "Welche Ein- und Ausgabeformate unterstützt {{model}}?",
      modalities: "Eingabe: {{inputs}}. Ausgabe: {{outputs}}.",
      toolsYes: "Das Modell unterstützt Werkzeugaufrufe.",
      toolsNo: "Werkzeugaufrufe stehen nicht zur Verfügung.",
    },
    bestFor: {
      q: "Wofür eignet sich {{model}}?",
      a: "Einsatzgebiete: {{items}}.",
    },
    cheaper: {
      q: "Gibt es eine günstigere Alternative zu {{model}}?",
      a: "{{other}}: gleiche Stufe, gleiche oder höhere Intelligenzstufe und rund {{otherCredits}} statt {{credits}} Credits pro Beispielnachricht.",
    },
    free: {
      q: "Ist {{model}} kostenlos nutzbar?",
      a: "Zum Testen ja. Gäste bekommen ohne Anmeldung {{guest}} Credits im Monat, genug für etwa {{guestMessages}} Nachrichten mit {{model}}. Ein kostenloses Konto hält {{account}} Credits, etwa {{accountMessages}} Nachrichten. Tarife starten bei {{planPrice}} im Monat für {{planCredits}} Credits, etwa {{planMessages}} Nachrichten.",
      aAccount:
        "Eine Referenznachricht kostet {{credits}} Credits, mehr als die {{guest}} Gast-Credits. Ein kostenloses Konto hält {{account}} Credits im Monat, etwa {{accountMessages}} Nachrichten mit {{model}}. Tarife starten bei {{planPrice}} im Monat für {{planCredits}} Credits, etwa {{planMessages}} Nachrichten.",
      aPaid:
        "Mit dem Gratiskontingent nicht. Eine Referenznachricht kostet {{credits}} Credits, mehr als die {{account}} Gratis-Credits im Monat. Tarife starten bei {{planPrice}} im Monat für {{planCredits}} Credits, etwa {{planMessages}} Nachrichten mit {{model}}.",
    },
    versus: {
      q: "{{model}} oder {{other}}: welches Modell passt?",
      a: "{{model}} kostet etwa {{credits}} Credits pro Referenznachricht, hat ein Kontextfenster von {{context}} Token und gehört zur Stufe {{tier}}. {{other}} kostet etwa {{otherCredits}} Credits, fasst {{otherContext}} Token Kontext und gehört zur Stufe {{otherTier}}. Beide laufen im selben Chat. Wechsle mitten im Gespräch und urteile selbst.",
    },
    try: {
      q: "Wie teste ich {{model}}?",
      a: "Öffne einen Chat, in dem {{model}} schon ausgewählt ist. Neue Besucher bekommen Start-Credits gratis, keine Karte nötig.",
      aLegacy:
        "{{model}} ist veraltet. Neue Chats laufen mit {{successor}}, testbar mit Gratis-Start-Credits, keine Karte nötig.",
    },
  },
  mediaFaq: {
    price: {
      q: "Was kostet {{model}}?",
      a: "Über {{provider}} kostet ein Durchlauf {{credits}} Credits ({{money}}) pro {{unit}}. Einstellungen wie Länge oder Größe können den Preis beeinflussen.",
      aNone: "Für dieses Modell gibt es derzeit keinen Richtpreis.",
    },
    use: {
      q: "Wie nutze ich {{model}}?",
      a: "Öffne das passende Tool mit {{model}} als Vorauswahl.",
    },
    inputs: {
      q: "Was nimmt {{model}} als Eingabe?",
      a: "Eingabe: {{inputs}}. Ausgabe: {{outputs}}.",
    },
    uncensored: {
      q: "Ist {{model}} unzensiert?",
      mainstream: "Nein. {{model}} läuft mit den Inhaltsfiltern von {{lab}}.",
      open: "Teilweise. {{model}} hat leichtere Filter als Mainstream-Modelle, ist aber nicht komplett unzensiert.",
      uncensored: "Dieses Modell gehört zur unzensierten Stufe.",
      consent: "Unzensierte Modelle brauchen eine einmalige 18+-Bestätigung.",
    },
  },
  readMore: {
    heading: "Weiterlesen",
    landings: {
      uncensored: {
        title: "Unzensierte KI: alle ungefilterten Modelle auf einen Blick",
        excerpt:
          "Alle unzensierten Modelle auf einen Blick: Kontext, Preis pro Nachricht und direkter Chat-Link.",
      },
      abliterated: {
        title: "Abliterierte KI-Modelle online testen",
        excerpt:
          "Mainstream-Modelle ohne Verweigerungen. Kontext, Preis pro Nachricht und direkter Chat-Link.",
      },
    },
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
    perMessage: "Beispielnachricht",
    perCacheReadTokens: "Eingabetoken aus dem Cache",
    perCacheWrite1hTokens: "für eine Stunde zwischengespeicherte Token",
    perCacheWriteTokens: "in den Cache geschriebene Token",
    perInputTokens: "Input-Token",
    perOutputTokens: "Output-Token",
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
    chatCta: "{{model}} im Chat testen",
    compareCta: "Vergleichen",
    legacyBanner:
      "{{model}} ist ein älteres Modell. Öffne {{successor}} für einen neuen Chat.",
    legacyCta: "Zu {{successor}}",
    compareWith: "{{model}} vs. {{other}}",
    ctaTitle: "{{model}} jetzt testen.",
    ctaSubtitle:
      "Start-Credits gratis, keine Karte nötig. Der Chat öffnet mit {{model}} und fertigem Prompt. Einfach abschicken.",
  },
  media: {
    priceValue: "{{credits}} Credits pro {{unit}}",
    priceProvider: "Rund {{price}} über {{provider}}.",
    priceLabel: "Preis pro Nutzung",
    generateCta: "Mit {{model}} generieren",
    useCta: "{{model}} nutzen",
    priceFootnote:
      "Die Umrechnung basiert auf dem einmaligen Credit-Paket mit {{value}} pro Credit.",
    ctaTitle: "{{model}} jetzt ausprobieren.",
    ctaSubtitle:
      "Start-Credits gratis, keine Karte nötig. Der Generator öffnet mit {{model}} vorausgewählt.",
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
    modelPage: "Details zu {{model}}",
    swap: "Seiten tauschen",
    cheaperFree: "{{model}} kostet keine Credits pro Nachricht.",
    tierLine:
      "{{model}} gehört zur Stufe {{tier}}, {{other}} zur Stufe {{otherTier}}.",
    verdictHeading: "Welches Modell passt zu dir?",
    verdictIntro:
      "Direkt aus den Daten: Preis, Kontext, Filter, Eingaben. Keine Benchmark-Versprechen.",
    edge: "Hier liegt {{model}} vorn",
    noEdge:
      "Bei den Daten, die wir erfassen, kein Vorsprung gegenüber {{other}}.",
    similar:
      "Auf dem Papier liegen {{a}} und {{b}} gleichauf: gleiche Filter, ähnlicher Preis, ähnlicher Kontext. Schick beiden denselben Prompt und behalte das Modell, das dir besser gefällt.",
    moreHeading: "Weitere Vergleiche",
    moreWith: "Weitere Vergleiche mit {{model}}",
    both: "{{a}} und {{b}}",
    pick: {
      cheaper:
        "Günstiger: {{money}} statt {{otherMoney}} pro Nachricht, {{times}}× weniger.",
      free: "Keine Credits pro Nachricht.",
      context:
        "Mehr Kontext: {{tokens}} Token (rund {{pages}} Seiten) statt {{otherTokens}}.",
      lessFiltered: "Weniger Filter: Stufe {{tier}} statt {{otherTier}}.",
      mainstream:
        "Sicherheitsfilter von {{lab}}, gebaut für Arbeit und Recherche.",
      kind: {
        ownWorldview:
          "Eigenes Weltbild: trainiert auf Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden.",
        abliterated:
          "Abliteriert: Die Gewichte des Basismodells wurden verändert, damit es seltener verweigert.",
        fineTuned: "Feinabgestimmt für Antworten mit weniger Einschränkungen.",
      },
      smarter: "Höhere Intelligenzstufe: {{level}} statt {{otherLevel}}.",
      fast: "Tempo: schnelle Antworten sind eine ausgewiesene Stärke.",
      strengths: "Bekannt für {{list}}. {{other}} führt das nicht als Stärke.",
      inputs: "Liest {{list}}. {{other}} nicht.",
      imageOutput: "Erzeugt Bilder direkt im Chat.",
      tools: "Tool-Aufrufe für Agenten-Workflows. {{other}} hat keine.",
      current: "Aktuelles Modell. {{other}} ist veraltet.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "Was ist günstiger, {{a}} oder {{b}}?",
      same: "Etwa gleich. {{a}} kostet rund {{creditsA}} Credits ({{moneyA}}) pro Nachricht, {{b}} rund {{creditsB}} Credits ({{moneyB}}).",
      diff: "{{cheap}}. Es kostet rund {{cheapCredits}} Credits ({{cheapMoney}}) pro Nachricht, {{dear}} rund {{dearCredits}} Credits ({{dearMoney}}): {{times}}× mehr.",
      diffFree:
        "{{cheap}}. Es kostet keine Credits pro Nachricht, {{dear}} rund {{dearCredits}} Credits ({{dearMoney}}).",
      reference:
        "Die Schätzung gilt für eine Beispielnachricht mit {{input}} Eingabe- und {{output}} Ausgabe-Token. Abgerechnet werden die Token, die du tatsächlich nutzt.",
      rates:
        "{{model}} über {{provider}}: {{input}} pro 1 Mio. Eingabe-Token, {{output}} pro 1 Mio. Ausgabe-Token.",
      fixed: "{{model}} über {{provider}}: Festpreis pro Nachricht.",
      credit: "Ein Credit kostet {{value}} zum Preis der Credit-Pakete.",
    },
    context: {
      q: "Welches Modell hat mehr Kontext, {{a}} oder {{b}}?",
      diff: "{{big}}: {{bigTokens}} Token (rund {{bigPages}} Seiten) gegenüber {{smallTokens}} Token (rund {{smallPages}} Seiten) bei {{small}}. Das ist {{times}}× mehr.",
      same: "Kaum ein Unterschied. {{big}} fasst {{bigTokens}} Token (rund {{bigPages}} Seiten), {{small}} {{smallTokens}} Token (rund {{smallPages}} Seiten).",
      equal:
        "Gleich viel: jeweils {{bigTokens}} Token, rund {{bigPages}} Seiten Text.",
    },
    smarter: {
      q: "Was taugt mehr für schwierige Aufgaben, {{a}} oder {{b}}?",
      diff: "{{model}} hat die höhere Intelligenzstufe: {{level}} gegenüber {{otherLevel}} bei {{other}}.",
      same: "Beide haben dieselbe Intelligenzstufe: {{level}}.",
      known: "{{model}} ist bekannt für: {{list}}.",
      knownBoth: "Beide sind bekannt für: {{list}}.",
      source:
        "Stufen und Stärken stammen aus unserem Modellkatalog, nicht aus einem Benchmark.",
    },
    inputs: {
      q: "Was können {{a}} und {{b}} lesen und ausgeben?",
      line: "{{model}}: Eingabe {{inputs}}, Ausgabe {{outputs}}, {{tools}}.",
      toolsYes: "mit Tool-Aufrufen",
      toolsNo: "ohne Tool-Aufrufe",
    },
    api: {
      q: "Kann ich {{a}} und {{b}} per API nutzen?",
      both: "Ja. Ruf {{idA}} oder {{idB}} über die {{appName}}-API auf, kompatibel mit den Formaten von OpenAI und Anthropic. Ein Schlüssel für beide. Die API braucht ein bezahltes Konto: jeder Plan.",
      one: "{{model}} ist als {{id}} über die API verfügbar (bezahltes Konto, jeder Plan).",
    },
    try: {
      q: "Wie teste ich {{a}} und {{b}}?",
      a: "Öffne einen Chat mit einem der beiden Modelle und wechsle mitten im Gespräch über die Modellauswahl. Neue Besucher bekommen Start-Credits gratis, keine Karte nötig.",
    },
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
      "So beantwortet {{model}} die Fragen des Verweigerungs-Index. Stand {{date}}, jede Woche neue Fragen.",
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
    categoryNames: {
      politics: "Politik",
      history: "Geschichte",
      health: "Gesundheit",
      drugs: "Drogen",
      sexuality: "Sexualität",
      security: "IT-Sicherheit",
      religion: "Religion",
      law: "Recht",
      science: "Wissenschaft",
      fiction: "Fiktion",
      satire: "Satire",
    },
  },
};
