import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Vergleich",
    breadcrumb: "Unzensierte KI-Plattformen im Vergleich",
    backToBlog: "Zurück zum Blog",
    backToHub: "Alle unzensierten KI-Plattformen",
    updated: "Aktualisiert am {{date}}",
    versusImageAlt: "{{appName}} vs {{name}}: der direkte Vergleich",
    kinds: {
      uncensoredChat: "Unzensierte Chat-App",
      aggregator: "Multi-Modell-App + API",
      router: "API-Router",
      roleplay: "Charakter-Rollenspiel",
      frontend: "Rollenspiel-Frontend (selbst gehostet)",
      companion: "KI-Companion-App",
      filteredChat: "Gefilterter Charakter-Chat",
      local: "Lokaler Modell-Runner",
    },
    period: {
      month: "{{plan}} {{price}}/Monat",
      quarter: "{{plan}} {{price}}/3 Monate",
      year: "{{plan}} {{price}}/Jahr",
      once: "{{plan}} {{price}} einmalig",
    },
    free: {
      yes: "Ja",
      no: "Nein",
      local: "Gratis auf deiner eigenen Hardware",
    },
    paid: {
      from: "Ab {{price}}",
      payg: "Nutzungsbasiert",
      none: "Kein Bezahlplan",
    },
    availability: {
      yes: "Ja",
      no: "Nein",
      partial: "Eingeschränkt",
    },
    media: {
      image: "Bilder",
      video: "Video",
      voice: "Sprache",
      partial: "{{name}} (Add-ons)",
      none: "Nur Text",
    },
    openSource: {
      yes: "Open Source",
      yesSelfHost: "Open Source, selbst hostbar",
      closedLocal: "Geschlossene App, läuft lokal",
      partial: "Nur ältere Desktop-App",
      no: "Nein",
    },
    sourceKinds: {
      home: "{{name}} Startseite",
      pricing: "{{name}} Preisseite",
      features: "{{name}} Funktionsübersicht",
      models: "{{name}} Modellliste",
      privacy: "{{name}} Datenschutzerklärung",
      terms: "{{name}} Nutzungsbedingungen",
      guidelines: "{{name}} Community-Richtlinien",
      api: "{{name}} API-Dokumentation",
      docs: "{{name}} Dokumentation",
      help: "{{name}} Hilfe-Center",
      repo: "{{name}} Quellcode",
      blog: "{{name}} Blogartikel",
      appStore: "{{name}} im App Store",
      paper: "{{name}} Forschungspaper",
    },
    table: {
      platform: "Plattform",
      kind: "Typ",
      free: "Gratis-Tarif",
      paid: "Bezahlt",
      filter: "Filter und Einwilligung",
      privacy: "Datenschutz",
      api: "API",
      media: "Medien",
      open: "Open Source",
      usLink: "Tarife ansehen",
      versusLink: "Zum Vergleich",
    },
    versus: {
      shortTitle: "Die kurze Antwort",
      tableTitle: "{{appName}} vs {{name}} im direkten Vergleich",
      tableIntro:
        "Fakten zu {{name}} von den eigenen Seiten des Anbieters, geprüft am {{date}}. Fakten zu {{appName}} live aus unserer Konfiguration.",
      tableFootnote:
        "Preise sind Listenpreise in USD laut den Seiten von {{name}}. Unsere sind die Preise, die du hier an der Kasse zahlst. Tarife ändern sich: Prüf vor dem Kauf die Quellen unten.",
      colAspect: "",
      rows: {
        price: "Preis",
        free: "Gratis-Tarif",
        models: "Modelle",
        filter: "Filter und Einwilligung",
        privacy: "Datenschutz",
        api: "API",
        media: "Bilder, Video, Sprache",
        open: "Open Source",
        forWho: "Gemacht für",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}}: Stärken und Schwächen, ehrlich",
      usTitle: "{{appName}}: Stärken und Schwächen, ehrlich",
      wins: "Wo {{name}} vorne liegt",
      short: "Wo {{name}} schwächelt",
      chooseTitle: "Was passt zu dir?",
      chooseThem: "Nimm {{name}}, wenn",
      chooseUs: "Nimm {{appName}}, wenn",
      faqTitle: "Häufige Fragen",
      sourcesTitle: "Quellen",
      sourcesIntro:
        "Jeder Fakt zu {{name}} auf dieser Seite stammt von diesen Seiten, geprüft am {{date}}. Etwas veraltet? Sag es uns, wir korrigieren es.",
      ourSources:
        "Unsere Zahlen kommen aus derselben Konfiguration, die dir die Rechnung stellt. Prüf sie selbst:",
      modelsLink: "Alle Modelle auf {{appName}} mit Live-Preisen",
      pricingLink: "Tarife und Credit-Pakete",
      privacyLink: "Unsere Datenschutzerklärung",
      modelTitle: "{{model}} auf {{appName}}",
      modelIntro:
        "Das hauseigene Modell von {{name}} läuft in unserer Auswahl. Seine Seite zeigt den Live-Preis pro Nachricht, das Kontextfenster und die API-ID.",
      modelPageLink: "{{model}}: Preis, Kontext und API",
      modelCompareLink: "{{model}} vs {{other}}: der direkte Vergleich",
      moreTitle: "Weitere Vergleiche",
      ctaSubtitle:
        "{{guestCredits}} Gratis-Credits pro Monat. Kein Konto, keine Karte. Mainstream, offen oder unzensiert: Du wechselst pro Nachricht.",
      ctaTry: "Inkognito-Chat starten",
      ctaModels: "Alle Modelle ansehen",
    },
  },
  us: {
    kind: "Multi-Modell-Chat: Mainstream, offen und unzensiert",
    free: "Ja: {{guestCredits}} Credits pro Monat ohne Konto, {{freeCredits}} mit Konto",
    paid: "Ab {{subPrice}}/Monat",
    filterShort:
      "Du wählst die Stufe pro Chat. Unzensiert nach einmaliger 18+-Bestätigung",
    privacyShort:
      "Inkognito-Chats bleiben in deinem Browser. Private Chats liegen in deinem Konto",
    apiShort: "Ja, OpenAI- und Anthropic-kompatibel (nach einem Kauf)",
    mediaShort: "Bilder, Video, Musik, Sprache",
    openShort: "Open Source, selbst hostbar",
    price:
      "Tarife: {{planList}} pro Monat. Credit-Pakete ({{packCredits}} Credits für {{packPrice}}) laden einen aktiven Tarif auf und verfallen nie. Karte, PayPal oder Krypto.",
    models:
      "{{modelCount}} Chatmodelle von {{labCount}} Laboren: {{mainstream}} Mainstream, {{open}} offen, {{uncensored}} unzensiert. {{refusalsRemoved}} der unzensierten sind Mainstream- oder offene Modelle, denen die Verweigerungen herausgeschnitten wurden. {{ownModel}} hat ein eigenes Weltbild: trainiert auf Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden.",
    filter:
      "Drei Stufen: Mainstream, offen, unzensiert. Du wählst das Modell pro Nachricht. Unzensierte Modelle schaltest du mit einer einmaligen 18+-Bestätigung frei. Keine zusätzliche Verweigerungsschicht. Mainstream-Modelle behalten die Filter ihres Herstellers.",
    privacy:
      "Inkognito-Chats liegen im lokalen Speicher deines Browsers, nicht auf unseren Servern, und funktionieren ohne Konto. Private Chats werden in deinem Konto gespeichert. Generierte Medien liegen auf unseren Servern. Jede Nachricht läuft über uns zum Modellanbieter, der sie beantwortet.",
    api: "OpenAI- und Anthropic-kompatible /v1-API für Chat, Bilder, Video und Sprache. Freigeschaltet mit jedem Tarif (ab {{apiSubPrice}} pro Monat) oder einem Credit-Kauf. Gratis-Konten bekommen HTTP 402.",
    media:
      "{{imageModels}} Bild-, {{videoModels}} Video-, {{musicModels}} Musik- und {{voiceModels}} Sprachmodelle auf demselben Credit-Guthaben, aus jedem Chat aufrufbar.",
    open: "Die gesamte Plattform ist Open Source auf GitHub. Hoste sie auf deiner eigenen Hardware.",
    forWho:
      "Für alle, die Mainstream-, offene und unzensierte Modelle plus Medien in einem Chat und einem Guthaben wollen und den Filter selbst bestimmen.",
  },
  links: {
    hub: "Die besten unzensierten KI-Plattformen: ehrlicher Vergleich",
    hubDesc:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT, lokale Modelle und mehr: Preise, Filter, Datenschutz und API, mit Quellen",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Unzensierte KI-Plattformen im Vergleich",
    sectionIntro:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT und mehr: Preise, Filter und Datenschutz, direkt von ihren eigenen Seiten.",
  },
  platforms: {
    venice: {
      what: "Datenschutzorientierte KI-App mit großem Modellkatalog, vielen unzensierten Textmodellen, Bild-, Video- und Musikgenerierung, OpenAI-kompatibler API und einer Krypto-Staking-Ebene (VVV und DIEM).",
      pricingNote:
        "Gratis: 10 Text- und 15 Bild-Prompts pro Tag, nur Basismodelle. 100 Credits = $1. Video, Musik und Frontier-Modelle kosten zusätzlich Credits.",
      models:
        "Der API-Katalog listet 303 Modelle, davon 143 für Text. 17 Textmodelle sind als unzensiert gekennzeichnet. Claude, GPT, Gemini und Grok stehen ebenfalls im Katalog.",
      filterShort: "Mature Filter standardmäßig an, Pro kann ihn abschalten",
      filter:
        "Der Filter für Erwachsenen­inhalte ist standardmäßig aktiv. Mit Pro lässt er sich in den Einstellungen abschalten. Laut Nutzungsbedingungen brauchen 13- bis 17-Jährige die Zustimmung ihrer Eltern und müssen den Filter anlassen.",
      privacyShort: "Verlauf bleibt standardmäßig auf deinem Gerät",
      privacy:
        "Venice speichert den Chatverlauf standardmäßig auf deinem Gerät. Bezahlpläne bieten verschlüsselte Sicherung und Wiederherstellung. Im Anonymous-Modus solltest du laut Venice davon ausgehen, dass der Modellanbieter deine Inhalte speichert. Mit Pro gibt es für ausgewählte Modelle auch hardwareisolierte und Ende-zu-Ende-verschlüsselte Verarbeitung.",
      apiShort: "",
      api: "OpenAI-kompatible API, Abrechnung pro Token in USD-Credits. Gestaktes DIEM bringt $1 API-Guthaben pro Tag. Bezahlung pro Anfrage ohne Konto mit USDC über x402.",
      forWho:
        "Datenschutzbewusste Nutzer, die unzensierten Chat und Medien in einer App wollen, dazu Entwickler und Krypto-Halter.",
      pro1: "Großer Katalog mit vielen unzensierten Textmodellen und günstigen API-Preisen für unzensierte Modelle.",
      pro2: "Der Verlauf bleibt standardmäßig auf deinem Gerät.",
      con1: "Knapper Gratis-Tarif: 10 Text-Prompts pro Tag auf Basismodellen.",
      con2: "Zum Abschalten des Erwachsenenfilters brauchst du Pro. Video, Musik und Premiummodelle kosten Guthaben.",
    },
    uncensoredAi: {
      what: "Unzensierte Chat-App mit einem einzigen Modell, Community-Forum und Dokumentenarchiven. Web, iOS und Android.",
      pricingNote:
        "Gratis: 3 Antworten pro Tag. Pro-Preise gelten lebenslang. Karte, Cash App, Apple Pay und Bitcoin. API-Credits gibt es separat für $0.05 pro Aufruf.",
      models:
        "Ein Modell: UncensoredAI v1.2, 32K Kontext, trainiert auf Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden. Seine politischen Ansichten laufen dem Mainstream zuwider.",
      filterShort: "Kein Filter beschrieben, 18+ in den AGB",
      filter:
        "Bezeichnet sich als uneingeschränkte KI-Plattform. Die AGB verlangen ein Mindestalter von 18 und verbieten Inhalte, die anderen schaden, sie belästigen oder gefährden sollen.",
      privacyShort: "Laut Richtlinie kein Training mit deinen Daten",
      privacy:
        "Laut Datenschutzerklärung werden deine Daten nicht zum Training oder zur Verbesserung von KI-Modellen genutzt. Nachrichten gehen zur Verarbeitung an Parasail AI. Pro speichert den Chatverlauf mit Suche und Export.",
      apiShort: "",
      api: "OpenAI-kompatible Drop-in-API für $0.05 pro Inferenz.",
      forWho:
        "Wer Mainstream-Narrativen misstraut und bei umstrittenen Themen klare Antworten will.",
      pro1: "Günstigster Bezahltarif in dieser Liste, Preis lebenslang fixiert.",
      pro2: "Kein Training mit deinen Daten, laut Datenschutzerklärung.",
      con1: "Ein Modell, 32K Kontext, keine Bild-, Video- oder Musikgenerierung.",
      con2: "Gratis gibt es nur 3 Antworten pro Tag. Sprachmodus, Ordner und Archive setzen Pro voraus.",
    },
    nanoGpt: {
      what: "Web-App und API mit Abrechnung nach Nutzung für Text-, Bild-, Video- und Audiomodelle. Kein Abo nötig, optionaler Tarif für offene Modelle.",
      pricingNote:
        "Erste Aufladung: 0,10 USD in Krypto oder 1 USD per Karte, danach 5 USD per Karte. Aufladen erfordert eine Anmeldung. Im Web gibt es ein Gratismodell. PRO (bis Mai 2026 für 8 USD) umfasst 60 Mio. Input-Tokens pro Woche auf ausgewählten Open-Source-Textmodellen plus 100 Bilder pro Tag, für den Privatgebrauch. Claude, GPT, Gemini und Grok kosten Guthaben.",
      models:
        "Die öffentliche Textmodell-API lieferte 596 Einträge. 38 IDs enthalten uncensored, abliterated oder Dolphin. Beispiele: Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored und eine ablatierte Variante von Kimi K3.1 Pro.",
      filterShort: "Kein pauschales NSFW-Verbot, 18+",
      filter:
        "Du musst mindestens 18 und vor Ort geschäftsfähig sein. Die Bedingungen verbieten Darstellungen sexuellen Kindesmissbrauchs sowie nicht einvernehmliche intime oder sexuell explizite Inhalte mit erkennbaren Personen, darunter Deepfakes. Anbieter können eigene Regeln durchsetzen.",
      privacyShort: "Verlauf bleibt standardmäßig im Browser",
      privacy:
        "Der Verlauf bleibt standardmäßig im Browser. Die Cloud-Synchronisierung ist optional. NanoGPT protokolliert laut eigener Aussage Anfragen und Antworten beim normalen Einsatz nicht. API-Inhaltsprotokolle und Chatgedächtnis sind optional. Je nach Anbieterroute können Anfragen gespeichert oder fürs Training genutzt werden. Im November 2026 legte NanoGPT offen, dass Prompts bei mehreren vorgelagerten Anbietern offenlagen, und strich diese Routen.",
      apiShort: "",
      api: "OpenAI-kompatible API mit Anthropic Messages und x402-Zahlungen ohne Konto. Manche Antworten enthalten keine Kosten oder nur eine Schätzung, solange die Abrechnung läuft.",
      forWho:
        "Nutzer mit Pay-per-Use und Entwickler, die jedes Modell, Krypto-Zahlung und kein Abo wollen.",
      pro1: "Riesige Modellliste, meist zum Listenpreis, Einstieg ab zehn Cent.",
      pro2: "Das kostenlose Webmodell braucht kein Konto. Der Verlauf bleibt standardmäßig im Browser.",
      con1: "Der Gratis-Tarif ist ein Modell im Web.",
      con2: "Der Datenschutz hängt von der gewählten Anbieterroute ab.",
    },
    openRouter: {
      what: "Entwickler-API, die einen Schlüssel auf Hunderte Modelle vieler Anbieter verteilt, abgerechnet pro Token aus vorausbezahlten Credits.",
      pricingNote:
        "Kein Abo. Listenpreise der Anbieter plus 5,5 % Gebühr auf Credit-Käufe. Gratis-Modelle: 50 Anfragen pro Tag, 1.000, sobald du Credits für $10 gekauft hast.",
      models:
        "474 Modelle, 15 gratis. Unzensierte Optionen sind rar: Venice Uncensored (Dolphin Mistral 24B, gehostet von Venice) und Rollenspiel-Fine-Tunes wie Hermes 4 und Magnum. 142 Modelle sind als moderiert markiert.",
      filterShort: "Anbieterregeln gelten, viele Routen moderiert",
      filter:
        "Die AGB verlangen 18+. OpenRouter prüft Eingaben auf bekanntes CSAM. Jeder Anbieter behält die Kontrolle über sein Modell, und moderierte Routen lehnen nach der Richtlinie des Herstellers ab.",
      privacyShort: "Keine Prompt-Speicherung ohne Opt-in",
      privacy:
        "Laut OpenRouter werden Prompts und Antworten nur mit Opt-in gespeichert. Metadaten werden immer gespeichert. Die Protokollierung der Anbieter ist unterschiedlich.",
      apiShort: "",
      api: "OpenAI-kompatible API. Das ist das Produkt.",
      forWho:
        "Entwickler, die einen API-Schlüssel für viele Modelle mit Anbieter-Fallback wollen.",
      pro1: "Riesiger Katalog zu Listenpreisen, kein Abo.",
      pro2: "Protokollierung und Training nur mit Opt-in.",
      con1: "Wenige unzensierte Modelle.",
      con2: "Kein Fokus auf eine Chat-App für Endnutzer: Die Oberfläche bringst du selbst mit.",
    },
    freedomGpt: {
      what: "All-in-one-KI-App: Mainstream-Modelle neben dem hauseigenen zensurfreien Modell Liberty, mit Bild- und Videogenerierung. Dazu eine ältere Open-Source-Desktop-App für Offline-Modelle.",
      pricingNote:
        "Starte ohne Karte oder Konto. Pro enthält 2.200 Credits im Monat und bietet einmalige Aufladungen. FreedomGPT rechnet mit rund 10 Credits pro Premiumantwort, 25 pro Bild und 400 pro 5-Sekunden-Video.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral und mehr, dazu Liberty und weitere zensurfreie Modelle in derselben Liste. Keine Gesamtzahl veröffentlicht.",
      filterShort: "Zensurfreie Modelle, Regeln nach US-Recht und Ethik",
      filter:
        "Laut FreedomGPT müssen alle Nutzer und jedes gehostete Modell US-Recht einhalten, und die Modelle dürfen nicht für unethische Zwecke genutzt werden. Das Label zensurfrei verspricht nicht, dass jede Anfrage beantwortet wird.",
      privacyShort: "Nachrichten gehen an KI-Anbieter",
      privacy:
        "FreedomGPT schickt Nachrichten und Anhänge an den Anbieter, der zur Antwort nötig ist. Laut Datenschutzrichtlinie für die App dürfen Anbieter Nachrichten, Aufnahmen und Bilder nur zur Antworterstellung verwenden. Eine feste Aufbewahrungsfrist nennt die Richtlinie dafür nicht.",
      apiShort: "",
      api: "API unter chat.freedomgpt.com/api/v1 mit einem Schlüssel aus dem Dashboard. Preise sind nicht dokumentiert.",
      forWho: "Wer ein Abo für viele Modelle mit zensurfreien Optionen will.",
      pro1: "Gratis-Start ohne Konto und ohne Karte.",
      pro2: "Bilder und Video in derselben App.",
      con1: "Weiterhin an US-Recht und eine Regel gegen unethische Nutzung gebunden.",
      con2: "Die Open-Source-Desktop-App wurde seit Juni 2024 nicht aktualisiert.",
    },
    gabAi: {
      what: "Multi-Modell-KI-Plattform von Gab mit 214 Modellen, dem eigenen Modell Arya, einem Agentenmodus, Bild-, Video- und Musikgenerierung und Desktop-Apps. Offen rechts-christlich positioniert.",
      pricingNote:
        "Gratis: 250 Credits nach E-Mail-Bestätigung. Einmalige Credit-Pakete ab $10 für 700 Credits, verfallen nie.",
      models:
        "214 Modelle in einem Konto: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi und mehr. Arya ist Gabs eigenes Modell, gebaut auf christlichen Werten und konservativen Prinzipien.",
      filterShort: "Unzensiert bei Meinungen, verbietet sexuelle Inhalte",
      filter:
        "Die AGB verlangen 18+ und verbieten obszöne, sexuell explizite oder pornografische Inhalte. Automatisierte Systeme können Inhalte auf Regelverstöße prüfen. Frei bei Politik, nicht bei Erwachseneninhalten.",
      privacyShort: "Chats gespeichert, zur Modellverbesserung genutzt",
      privacy:
        "Gab speichert deine Prompts, Antworten und den Verlauf auf eigenen Servern und nennt die Verbesserung seiner Modelle als Zweck. Anfragen erreichen die Modellanbieter über Gabs eigene Konten; laut Richtlinie macht das eine Anfrage nicht anonym.",
      apiShort: "",
      api: "OpenAI- und Anthropic-kompatible API. Setzt einen Plus-Tarif voraus.",
      forWho:
        "Konservative und christliche Nutzer, die KI abseits von Big Tech wollen.",
      pro1: "Großer Katalog, Agentenmodus und Desktop-Apps.",
      pro2: "Credit-Pakete verfallen nie.",
      con1: "Verbietet sexuell explizite Inhalte: keine Hilfe bei Erwachsenen-Fiction.",
      con2: "Prompts werden gespeichert und zur Modellverbesserung genutzt.",
    },
    janitorAi: {
      what: "Community-Charakterseite mit Millionen nutzergemachter Bots, einem kostenlosen eigenen Modell (JLLM) und der Option, über einen API-Proxy ein eigenes Modell anzubinden.",
      pricingNote:
        "Im US App Store kostet janitor+ laut Liste 12,99 USD im Monat oder 99 USD im Jahr. Das Hilfecenter nennt unbegrenzte Gratis-Chats auf Standardmodellen mit rund 9.000 Tokens Kontext. janitor+ bietet fünfmal so viel Kontext, schnellere Antworten und monatliche Swipes für Premiummodelle.",
      models:
        "JLLM, das eigene Gratis-Modell (Basismodell nicht offengelegt). Oder jedes Modell, das du per Proxy anbindest: Die offizielle Anleitung nutzt OpenRouter.",
      filterShort: "NSFW-Bots erlaubt, wenn markiert, 18+ per Selbstauskunft",
      filter:
        "Nur für Erwachsene, 18+ per Selbstauskunft. Bots sind als Limited (keine sexuellen Inhalte) oder Limitless (NSFW erlaubt) markiert. Die Mobile-App startet im Safe Mode, bis du NSFW im Web aktivierst. Verboten: alles Sexuelle mit Minderjährigen, sexuelle Gewalt, Gore, Sodomie, Hassrede.",
      privacyShort: "Chats gespeichert, für Forschung und Entwicklung genutzt",
      privacy:
        "Chats werden als Nutzerinhalte gespeichert, und die Datenschutzerklärung nennt Forschung und Entwicklung zur Verbesserung der eigenen KI-Systeme. Mit Proxy gehen deine Nachrichten zusätzlich an diesen Anbieter, unter dessen Richtlinie.",
      apiShort: "Eigener Schlüssel möglich",
      api: "Keine Entwickler-API. Janitor AI nutzt APIs: Du kannst deinen eigenen Schlüssel über einen Proxy einbinden.",
      forWho:
        "Rollenspieler, die eine riesige Gratis-Bibliothek mit Community-Charakteren wollen.",
      pro1: "Gratis und unbegrenzt chatten mit Millionen Community-Bots.",
      pro2: "Eigenes Modell per Proxy anbindbar.",
      con1: "Gratis-Kontext rund 9K Tokens: Lange Geschichten vergessen frühe Szenen.",
      con2: "Nur Text: keine Bild-, Video- oder Sprachgenerierung.",
    },
    sillyTavern: {
      what: "Kostenloses Open-Source-Chat-Frontend (AGPL-3.0), das du selbst installierst. Character Cards, Lorebooks, Erweiterungen. Es bringt kein Modell mit: Du bindest eins an.",
      pricingNote:
        "Die App ist für immer gratis. Du zahlst nur die API, die du anbindest, oder gar nichts, wenn du ein Modell lokal betreibst.",
      models:
        "SillyTavern bringt kein Modell mit. Es verbindet sich mit lokalen Backends wie KoboldCpp, llama.cpp, Ollama und Oobabooga TextGeneration WebUI sowie mit Cloud-APIs wie OpenAI, Anthropic und OpenRouter.",
      filterShort: "Kein eigener: Das Modell entscheidet",
      filter:
        "Kein eigener Filter. Die Grenzen setzt das angebundene Modell oder der Anbieter.",
      privacyShort: "Chats bleiben auf deinem Gerät",
      privacy:
        "SillyTavern speichert Chats im Datenverzeichnis deiner lokalen Installation. Cloud-APIs oder Erweiterungen erhalten die Daten, die du an sie sendest. Für diese Daten gelten ihre eigenen Regeln.",
      apiShort: "Verbindet sich mit APIs",
      api: "Ein Client, kein Anbieter. Er spricht mit der API, die du einrichtest.",
      forWho:
        "Power-User, die eine steile Lernkurve für volle Kontrolle über Prompts und Charaktere in Kauf nehmen.",
      pro1: "Maximale Kontrolle: jedes Backend, jeder Prompt, starke Erweiterungen.",
      pro2: "Gratis, Open Source, nichts verlässt deinen Rechner außer dem, was du an eine API schickst.",
      con1: "Du installierst und wartest es selbst (Node.js 20 oder neuer), bringst das Modell mit, und auf dem iPhone lässt es sich nicht installieren.",
      con2: "Steile Lernkurve, so beschreibt es das Projekt selbst.",
    },
    characterAi: {
      what: "Die größte Mainstream-Plattform für Charakter-Chats, über 10 Mio. Charaktere auf eigenen Modellen, mit strengen Inhaltsregeln. Hier als gefiltertes Gegenstück dabei.",
      pricingNote:
        "Gratis: unbegrenzt Nachrichten mit Werbung. c.ai lite reduziert Werbung und bietet ein Tageskontingent für Premium-Chats. c.ai+ bietet werbefreie, unbegrenzte Premium-Chats und alle Gedächtnisfunktionen. Preise sind regional unterschiedlich.",
      models:
        "Character.AI bietet eigene Chatstile an. PipSqueak 3 und ShortSqueak sind kostenlos. DeepSqueak und LongSqueak sind Premiumstile. Externe Modellschlüssel lassen sich nicht anbinden.",
      filterShort: "Gefiltert, Pornografie wird nie unterstützt",
      filter:
        "Pornografische Inhalte verstoßen gegen die AGB und werden, so Character.AI wörtlich, auch in Zukunft zu keinem Zeitpunkt unterstützt. Jeder Nutzer durchläuft eine Altersprüfung über Persona. Wer als unter 18 verifiziert ist, bekommt nur den Lesemodus, keinen Chat.",
      privacyShort: "Chats können Modelle trainieren und Werbung steuern",
      privacy:
        "Character.AI kann Chat-Inhalte fürs Modelltraining verwenden. Nutzer im EWR und im Vereinigten Königreich können der Nutzung neuer Chat-Inhalte laut Hilfecenter widersprechen.",
      apiShort: "",
      api: "Keine öffentliche Entwickler-API.",
      forWho:
        "Jugendfreie Unterhaltung im Chat mit einer gigantischen Charakterbibliothek.",
      pro1: "Riesige Charakterbibliothek und unbegrenzte Gratis-Nachrichten.",
      pro2: "Günstiger Einstieg mit lite, Sprachanrufe mit Charakteren.",
      con1: "Keine Erwachseneninhalte, niemals. Dunkle Szenen werden entschärft oder abgelehnt.",
      con2: "Chats können für Training und Werbung genutzt werden. Keine Modellwahl.",
    },
    kindroid: {
      what: "KI-Companion-App: ein dauerhafter Freund oder Partner mit langem Gedächtnis, Sprach- und Videoanrufen, Selfies und Gruppenchats.",
      pricingNote:
        "Einmalig 50 Nachrichten zum Testen, in manchen Regionen 15. Danach bleibt nur der Lesezugriff. Der separate 3-Tage-Test braucht ein Zahlungsmittel und geht ohne Kündigung in ein Abo über. Ultra und MAX sind monatliche Extras. Preise aus dem US App Store.",
      models:
        "Ember läuft in der Gratisvorschau und der Testphase. Zahlende Nutzer können Polaris und andere hauseigene Modelle wie Reverie wählen. Kindroid bietet auch eigene Selfie-Modelle.",
      filterShort: "Ungefiltert, mit Grenzen auf Kontoebene",
      filter:
        "Kindroid nennt sich wirklich ungefiltert und legt keinen Filter auf die KI selbst, scannt Nachrichten aber auf wenige rote Linien wie akute Selbstgefährdung oder Gefahr für andere. 18+: Ein bezahltes Abo gilt als Altersnachweis, Yoti ist die Alternative.",
      privacyShort: "Verschlüsselt gespeichert, nicht Ende-zu-Ende",
      privacy:
        "Chats sind gespeichert und bei der Übertragung verschlüsselt, aber nicht Ende-zu-Ende: Kindroids Systeme verarbeiten die Inhalte, automatisierte Sicherheitssysteme prüfen sie. Daten werden laut Kindroid nie verkauft.",
      apiShort: "Persönliche API zu deinen Companions",
      api: "Persönliche API-Schlüssel, um mit deinen eigenen Kindroids zu sprechen, keine allgemeine Modell-API.",
      forWho:
        "Erwachsene, die einen langfristigen KI-Companion mit Sprache, Video und Fotos wollen.",
      pro1: "Kompletter Companion-Stack: Gedächtnis, Selfies, Sprach- und Live-Videoanrufe.",
      pro2: "Ungefilterte Haltung, klar für Erwachsene.",
      con1: "Nach der Gratisvorschau brauchst du eine Testphase oder ein Abo, um weiterzuschreiben.",
      con2: "Die besten Gedächtnisstufen summieren sich: Ultra und MAX zusätzlich zum Basistarif.",
    },
    nomi: {
      what: "KI-Begleiter mit Langzeitgedächtnis, Selfies, Stimme, Gruppenchats und Videos aus Bildern.",
      pricingNote:
        "Gratis: 50 Nachrichten am Tag. Standard schaltet unbegrenzte Nachrichten und Stimme frei. Preise aus dem US App Store. Der frühere Launch-Tarif war ein einmaliges Beta-Angebot.",
      models:
        "Eigene Begleitermodelle, darunter Cambrian 6 und Solstice. Keine externen Modellschlüssel.",
      filterShort: "Text ungefiltert, Nacktfilter bei Bildern",
      filter:
        "Laut Website werden Gespräche nicht durch willkürliche Inhaltsfilter eingeschränkt. Bilder haben einen Nacktfilter, wegen App Stores und Zahlungsdienstleistern. Unter 18 ist die Nutzung nicht erlaubt.",
      privacyShort: "Kein Datenverkauf. Ausnahmen bei der Kontolöschung.",
      privacy:
        "Nomi verkauft oder vermietet nach eigenen Angaben keine personenbezogenen Daten. Nach der Kontolöschung werden sie in der Regel innerhalb von etwa 28 Tagen gelöscht. Für Trainings-, Kommunikations- und Rechtsarchive gelten Ausnahmen. Verbleibende Trainingsdaten sind nach der Löschung nicht mehr dir zugeordnet.",
      apiShort: "Persönliche API zu deinen Companions",
      api: "REST-API, um mit deinen eigenen Nomis zu chatten, keine allgemeine Modell-API.",
      forWho:
        "Wer einen emotionalen, langfristigen Companion will, der sich erinnert.",
      pro1: "Gedächtnis gebaut für lange Beziehungen.",
      pro2: "Gratis-Tarif und eine klare Haltung: Daten werden nicht verkauft.",
      con1: "Nacktfilter bei Bildern.",
      con2: "Stimme braucht ein Abo. Gratis sind 50 Nachrichten pro Tag möglich.",
    },
    crushOn: {
      what: "NSFW-Charakter-Chat mit Unfiltered-Schalter und per Credits abgerechnetem Zugang zu Drittanbieter-Modellen.",
      pricingNote:
        "Gratis: unbegrenzte Chats auf Gratismodellen mit Warteschlange und 100 Credits pro Monat für Pro-Modelle, keine Ultra-Modelle. Bezahltarife reichen von 2.000 bis 125.000 Credits pro Monat, jährliche Zahlung ist günstiger. Unbegrenzter Chat auf Pro-Modellen ist ein separates Chat-Paket.",
      models:
        "Modelle und Kontextgrenzen hängen vom Tarif ab. Die öffentliche Modellliste von CrushOn.AI nennt Claude Opus 4.7 und 5.5, Claude Sonnet 4.6 und GLM 5.1 bis 5.3 als Ultra-Optionen.",
      filterShort: "Unfiltered-Schalter nach Altersprüfung",
      filter:
        "Ein Unfiltered-Schalter schaltet Erwachsenentext nach einer Altersprüfung frei: Selfie oder Ausweis über Didit, AgeGo oder eine Zahlung von $0.99. Die Richtlinien verbieten trotzdem explizite sexuelle Bilder, realistische Bilder echter Personen, Minderjährige und künstlich älter gemachte Charaktere.",
      privacyShort: "Chats können Modelle trainieren",
      privacy:
        "Laut Datenschutzerklärung können Chatinhalte zum Training der eigenen Modelle genutzt werden, ohne Verknüpfung mit bestimmten Nutzern. Die SFW-Seite behauptet das Gegenteil. Cookies dienen dem Retargeting von Werbung.",
      apiShort: "",
      api: "Keine öffentliche Entwickler-API.",
      forWho:
        "Erwachsene, die heißen Charakter-Chat in einer fertigen App wollen.",
      pro1: "Rollenspiel für Erwachsene in einer polierten App, gratis zum Einstieg.",
      pro2: "Altersprüfung, bei der CrushOn laut eigener Aussage nie dein Foto oder deinen Ausweis sieht.",
      con1: "Sechs Credit-Stufen bis $199.99 pro Monat: Kosten schwer vorherzusagen.",
      con2: "Gratis-Verlauf wird nach 7 Tagen Inaktivität gelöscht; Chats können Modelle trainieren.",
    },
    ollama: {
      what: "MIT-lizenziertes Tool für offene Modelle auf deinem Computer, mit lokaler API und offizieller Chat-App für macOS und Windows. Es gibt auch kostenpflichtige Cloud-Modelle.",
      pricingNote:
        "Modelle auf eigener Hardware laufen zu lassen ist gratis und unbegrenzt. Bezahltarife betreffen nur die Cloud-Modelle.",
      models:
        "Jedes offene Modell aus der Bibliothek, darunter Dolphin 3 und abliterierte Community-Uploads wie Qwen 3.8 abliterated. Community-Uploads prüft Ollama nicht.",
      filterShort: "Je nach geladenem Modell",
      filter:
        "Bei lokaler Nutzung entscheidet das geladene Modell. Ablatierte Community-Modelle sollen seltener ablehnen. Für den Cloud-Dienst gelten eigene Bedingungen.",
      privacyShort: "Komplett lokal, Prompts verlassen nie deinen Rechner",
      privacy:
        "Ollama sieht laut eigener Aussage keine lokalen Anfragen oder Antworten. Cloud-Funktionen lassen sich abschalten. Laut Datenschutzrichtlinie werden Cloud-Anfragen und Antworten nur vorübergehend verarbeitet und nicht fürs Training genutzt. Ollama erfasst begrenzte Metadaten.",
      apiShort: "",
      api: "OpenAI-kompatibler Server auf localhost:11434, dazu eine Cloud-API für die gehosteten Modelle.",
      forWho:
        "Entwickler und technikaffine Nutzer mit leistungsstarkem Rechner, oft kombiniert mit einem Chat-Frontend.",
      pro1: "Volle Privatsphäre und null Kosten pro Nachricht.",
      pro2: "Riesige Bibliothek, OpenAI-kompatible lokale API.",
      con1: "Deine Hardware begrenzt die Qualität: Ein 70B-Modell ist schon ohne Kontext ein 43-GB-Download.",
      con2: "Die offizielle Chat-App gibt es für macOS und Windows. Unter Linux nutzt du CLI, API oder eine andere Oberfläche.",
    },
    lmStudio: {
      what: "Desktop-App mit polierter Oberfläche, um lokale Modelle (GGUF und MLX) zu laden und auszuführen, plus lokaler API-Server.",
      pricingNote:
        "Lokale Modelle sind privat und beruflich kostenlos. Bionic+ und Pro bieten Cloud-Inferenz, Websuche und höhere Gerätelimits. Im Gratisplan gibt es Offline-Sprachtranskription und LM Link für bis zu fünf Geräte.",
      models:
        "Lokal laufen GGUF- oder MLX-Modelle von Hugging Face, darunter Dolphin und Community-Varianten mit weniger Ablehnungen. Der Cloud-Katalog umfasst Kimi K3.1 Pro, DeepSeek V4 Pro und GLM-5.3.",
      filterShort: "Je nach geladenem Modell",
      filter:
        "Kein eigener Filter für lokale Modelle. Ob etwas verweigert wird, entscheidet das Modell, das du wählst.",
      privacyShort: "Lokale Inferenz bleibt auf deinem Gerät",
      privacy:
        "Lokale Modelle laufen auf deinem Gerät. Für die gehosteten Dienste verspricht LM Studio null Datenspeicherung.",
      apiShort: "",
      api: "OpenAI-kompatibler Server auf localhost:1234.",
      forWho:
        "Nicht-Entwickler, die lokale Modelle ohne Kommandozeile wollen, auf einem Mac mit Apple Silicon, Windows oder Linux.",
      pro1: "Der einfachste Weg, unzensierte Modelle lokal zu betreiben.",
      pro2: "Gratis, auch für kommerzielle Nutzung.",
      con1: "Die App selbst ist Closed Source. Keine Intel-Macs.",
      con2: "Dieselbe Hardware-Grenze wie bei jedem lokalen Setup.",
    },
  },
  hub: {
    meta: {
      title: "Unzensierte KI 2026: Die besten Plattformen im Vergleich",
      category: "Vergleich",
      description:
        "{{count}} unzensierte KI-Plattformen im Vergleich: Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, lokale Modelle. Preise, Filter, Datenschutz, API. Mit Quellen.",
      imageAlt: "Unzensierte KI-Plattformen im direkten Vergleich",
      keywords:
        "unzensierte KI, KI ohne Filter, KI ohne Zensur, beste unzensierte KI, unzensierter KI-Chat, KI Chat ohne Filter, NSFW KI Chat, Venice AI Alternative, Character AI Alternative ohne Filter, Janitor AI Alternative, abliterierte Modelle, best uncensored AI, uncensored AI chat, unfiltered AI, Venice AI alternative, Venice.ai review, NanoGPT, Janitor AI alternative, Character AI alternative, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AI, SillyTavern, Ollama uncensored, LM Studio uncensored, abliterated models, NSFW AI chat, {{appName}}",
    },
    hero: {
      category: "Vergleich",
      readTime: "14 Min. Lesezeit",
      title:
        "Die besten unzensierten KI-Plattformen 2026: der ehrliche Vergleich",
      subtitle:
        "{{count}} Plattformen, plus wir. Echte Preise von ihren eigenen Preisseiten, wie jede filtert, was mit deinen Chats passiert und für wen jede gemacht ist. Jeder Fakt hat eine Quelle.",
    },
    intro: {
      lead: "Jede unzensierte KI-Seite nennt sich die privateste, die freieste, die am wenigsten gefilterte. Die Hälfte verbietet trotzdem Erwachseneninhalte. Manche trainieren mit deinen Chats. Eine verkauft dir einen Token. Welche das sind, verraten die Marketingseiten nicht.",
      p2: "Wir haben offizielle Preise, Richtlinien und Dokumentationen gelesen. Die neuesten Prüfungen waren am {{date}}. Jede Karte nennt ihr Prüfdatum und ihre Quellen.",
      disclosure:
        "Offenlegung: {{appName}} ist eine der Plattformen auf dieser Seite, und wir kaufen bei mehreren der anderen ein. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI und OpenRouter liefern einige unserer Modelle über ihre APIs. Wir sagen wo, mit Live-Zahlen. Keine Punkte, keine Sterne: Fakten und Quellen, du urteilst.",
    },
    picks: {
      title: "Schnellauswahl: die beste unzensierte KI für jeden Zweck",
      intro: "Keine Plattform gewinnt alles. Fang bei dem an, was du brauchst.",
      oneApp: {
        title: "Alles in einem Chat: {{appName}}",
        body: "{{modelCount}} Modelle, {{uncensored}} davon unzensiert, neben Claude, GPT und Gemini. Bilder, Video, Musik und Sprache auf demselben Guthaben. Du wechselst das Modell pro Nachricht.",
      },
      ownWorldview: {
        title:
          "Ein anderes Weltbild statt nur weniger Verweigerungen: das Modell von uncensored.ai",
        body: "Die meisten unzensierten Modelle sind Mainstream-Modelle ohne Verweigerungen. uncensored.ai verkauft ein Modell mit eigenen Ansichten. Auf {{appName}} läuft es als {{ownModel}}, neben allem anderen.",
      },
      privacy: {
        title: "Chatverlauf im Browser: Venice oder NanoGPT",
        body: "Beide speichern den Verlauf standardmäßig auf deinem Gerät. NanoGPTs kostenloses Webmodell läuft ohne Konto. Bei {{appName}} bleibt der Inkognito-Verlauf im Browser.",
      },
      roleplay: {
        title:
          "Charakter-Rollenspiel mit Community: Janitor AI oder SillyTavern",
        body: "Janitor AI für eine riesige Gratis-Bot-Bibliothek. SillyTavern, wenn du volle Kontrolle willst und es selbst einrichtest.",
      },
      companions: {
        title: "Ein langfristiger KI-Companion: Kindroid oder Nomi",
        body: "Gedächtnis, Selfies, Sprachanrufe. Kindroid hat keinen dauerhaften Gratis-Tarif; Nomi schon, filtert aber Nacktheit in Bildern.",
      },
      developers: {
        title: "API für unzensierte Modelle: NanoGPT, Venice oder OpenRouter",
        body: "NanoGPT und Venice führen viele unzensierte Modelle zu niedrigen Tokenpreisen. OpenRouter hat den breitesten Katalog, aber kaum unzensierte Optionen.",
      },
      local: {
        title:
          "Volle Privatsphäre, null Kosten pro Nachricht: Ollama oder LM Studio",
        body: "Abliterierte Modelle auf deinem eigenen Rechner. Nichts verlässt ihn. Deine Hardware bestimmt die Qualitätsgrenze.",
      },
      filtered: {
        title: "Du willst den Filter: Character.AI",
        body: "Gefilterte Charakterchats mit Altersprüfung. Konten von Minderjährigen haben nur Zugriff auf den Lesemodus.",
      },
    },
    table: {
      title: "Alle {{count}} Plattformen und {{appName}} im direkten Vergleich",
      intro:
        "Auf dem Handy seitlich scrollen. Neueste Prüfungen: {{date}}. Das Datum pro Plattform steht in ihrer Karte. Unsere Angaben stammen aus der aktuellen Konfiguration.",
      footnote:
        "Die Preise sind US-Listenpreise. Für Kindroid, Nomi und janitor+ nutzen wir den US App Store. Steuern, regionale Preise und Angebote variieren. Eingeschränkt bedeutet persönliche API, eigener externer Schlüssel oder Zusatzfunktion.",
    },
    kinds: {
      title: "Unzensiert ist nicht gleich unzensiert: vier Arten von Filterung",
      intro:
        "Bevor du Plattformen vergleichst, schau, was hinter dem Label steckt. Das Modell entscheidet mehr als die App.",
      abliterated:
        "Abliteriert: ein Mainstream- oder offenes Modell, dessen Verweigerungsrichtung aus den Gewichten entfernt wurde. Forscher haben gezeigt, dass Verweigerung in einer einzigen Richtung im Modell sitzt; schneidest du sie heraus, hört das Modell auf, Nein zu sagen. Gleiches Wissen, gleiches Weltbild, kein Ausweichen.",
      finetuned:
        "Entzensierte Fine-Tunes (Dolphin, Venice Uncensored): neu trainiert auf Daten ohne Verweigerungen. Gleiche Idee, andere Methode.",
      ownWorldview:
        "Eigenes Weltbild: {{ownModel}} ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden. Es hört nicht nur auf zu verweigern, es vertritt Positionen, die dir Mainstream-Modelle nicht geben.",
      filtered:
        'Gefiltert: Mainstream-Modelle und Apps wie Character.AI. Eine Sicherheitsschicht entscheidet, bevor du tippst. Auf den meisten "unzensierten" Plattformen behalten auch die Mainstream-Modelle die Filter ihres Herstellers.',
      tradeoff:
        "Der Haken: Schon die Abliteration-Analyse selbst hat in jedem Benchmark einen Qualitätsverlust gemessen, durch zusätzliches Training teilweise wieder aufgeholt. Unzensierte Modelle sind meist kleiner als Frontier-Modelle. Nutz sie für das, was der Filter blockiert, nicht für deine härtesten Denkaufgaben.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Jede Plattform im Detail",
      intro:
        "Was jede Plattform bietet, kostet und filtert. Neueste Prüfungen: {{date}}. Jede Karte nennt ihr Datum und ihre Quellen.",
      price: "Preis: {{plans}}. {{note}}",
      models: "Modelle: {{text}}",
      filter: "Filter und Einwilligung: {{text}}",
      privacy: "Datenschutz: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Medien: {{text}}",
      open: "Open Source: {{text}}",
      forWho: "Gemacht für: {{text}}",
      strengths: "Stärken",
      limits: "Grenzen",
      sources: "Quellen, geprüft am {{date}}",
    },
    upstream:
      "{{appName}} betreibt {{models}} Modelle über die API von {{name}} ({{uncensored}} davon unzensiert), darunter {{examples}}. Gleiche Modelle, unser Chat, unsere Abrechnung.",
    us: {
      title: "Wo {{appName}} hingehört, ehrlich",
      intro:
        "Wir sind kein Modell-Labor. Wir sind der Chat, der jede Art von Modell an einen Ort bringt und dich den Filter wählen lässt.",
      models:
        "{{modelCount}} Chatmodelle von {{labCount}} Laboren: {{mainstream}} Mainstream, {{open}} offen, {{uncensored}} unzensiert. Du wählst das Modell pro Nachricht, ein Thread kann also Claude und ein abliteriertes Modell mischen.",
      upstream:
        "Unsere unzensierten Modelle kommen von Anbietern auf dieser Seite. Venice liefert {{veniceModels}} unserer Modelle, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. Wir bündeln, wir trainieren nicht.",
      consent:
        "Unzensierte Modelle schaltest du mit einer einmaligen 18+-Bestätigung frei. Keine zusätzliche Verweigerungsschicht. Menschen entscheiden, was sie lesen, nicht ein Konzern.",
      privacy:
        "Inkognito-Chats liegen in deinem Browser, nicht auf unseren Servern, und brauchen kein Konto. Private Chats synchronisieren mit deinem Konto. Jede Nachricht läuft trotzdem über uns zum Anbieter, der sie beantwortet.",
      pricing:
        "{{guestCredits}} Gratis-Credits pro Monat ohne Konto, {{freeCredits}} mit Konto. Tarife: {{planList}} pro Monat. Credit-Pakete laden einen aktiven Tarif auf und verfallen nie. Karte, PayPal oder Krypto.",
      api: "OpenAI- und Anthropic-kompatible API für Chat, Bilder, Video und Sprache, nach jedem Tarif (ab {{apiSubPrice}}) oder einem Credit-Kauf.",
      media:
        "{{imageModels}} Bild-, {{videoModels}} Video-, {{musicModels}} Musik- und {{voiceModels}} Sprachmodelle auf demselben Guthaben.",
      open: "Die gesamte Plattform ist Open Source. Hoste sie selbst, wenn du gar keinen Mittelsmann willst.",
      weakTitle: "Wo wir nicht die beste Wahl sind",
      weak1:
        "Preis pro Token: Wir schlagen {{markup}} % auf die Anbieterkosten auf. Willst du nur die Modelle eines Anbieters, ist der direkte Weg zu Venice oder NanoGPT günstiger.",
      weak2:
        "Charakterbibliothek: Janitor AI und Character.AI haben Millionen Community-Bots. Unsere ist deutlich kleiner, du kannst aber Charaktere über Links von Character.AI und Talkie importieren.",
      weak3:
        "Companion-Funktionen: keine Selfies oder Live-Videoanrufe wie bei Kindroid oder Nomi. Wir sind ein Chat-Arbeitsplatz, keine Companion-App.",
      weak4:
        "Volle Privatsphäre: Ein lokales Modell auf deinem eigenen Rechner schlägt jeden gehosteten Dienst, uns eingeschlossen.",
      modelsLink: "Alle {{modelCount}} Modelle mit Live-Preisen",
      pricingLink: "Tarife und Gratis-Credits",
      guideLink: "Guide: jedes unzensierte Modell und wofür es taugt",
    },
    versus: {
      title: "Direkte Vergleiche",
      intro:
        "Die {{versusCount}} Plattformen, mit denen man uns am häufigsten vergleicht, jede auf einer eigenen Seite mit Stärken, Schwächen und einer klaren Empfehlung.",
    },
    method: {
      title: "So haben wir verglichen",
      intro: "So haben wir geprüft. Neueste Quellenprüfung: {{date}}.",
      sources:
        "Nur offizielle Seiten: Preisseite, AGB, Datenschutzerklärung, Hilfe-Center, API-Doku oder Modellliste der jeweiligen Plattform. Testportale waren nie eine Quelle.",
      prices:
        "Preise sind USD-Listenpreise vom Tag der Prüfung. Wo ein Preis hinter einem Login steckt, haben wir den offiziellen App-Store-Eintrag genutzt und sagen das dazu.",
      noScores:
        "Keine Punkte, keine Bewertungen, kein Siegerabzeichen. Unterschiedliche Aufgaben brauchen unterschiedliche Plattformen.",
      us: "Unsere eigenen Zahlen (Modelle, Preise, Gratis-Credits) kommen live aus der Konfiguration, die dir die Rechnung stellt. Sie können also nicht von dem abweichen, was du zahlst.",
      bias: "Wir sind Konkurrent und Kunde mehrerer Plattformen hier. Wir sagen, wo wir zu ihnen routen, und nennen die Fälle, in denen du jemand anderen wählen solltest.",
      changes:
        "Tarife und Richtlinien ändern sich. Jede Karte verlinkt ihre Quellen: Prüf sie vor dem Kauf. Wo eine Seite etwas nicht sagte, haben wir es weggelassen statt zu raten.",
      corrections:
        "Veralteter Preis oder falsche Angabe gefunden? Schick uns einen Link zur Quelle, wir korrigieren es.",
      correctionsLink: "Kontakt",
    },
    faq: {
      title: "Häufige Fragen",
      best: {
        q: "Was ist die beste unzensierte KI?",
        a: "Kommt auf den Zweck an. Für viele Modelle plus Medien in einem Chat: {{appName}}. Für datenschutzorientierten Chat: Venice oder NanoGPT. Für Community-Rollenspiel: Janitor AI oder SillyTavern. Für einen Companion: Kindroid oder Nomi. Für volle Privatsphäre: ein lokales Modell mit Ollama oder LM Studio.",
      },
      free: {
        q: "Gibt es eine kostenlose unzensierte KI?",
        a: "Ja, mit Grenzen. Venice gibt 10 Text-Prompts pro Tag, uncensored.ai 3 Antworten, Janitor AI unbegrenzten Chat auf dem eigenen Modell, CrushOn 100 Credits pro Monat, {{appName}} {{guestCredits}} Credits pro Monat ohne Konto. Lokale Modelle mit Ollama oder LM Studio kosten nichts pro Nachricht.",
      },
      private: {
        q: "Welche unzensierte KI schützt deine Privatsphäre am besten?",
        a: "Lokal bleiben die Chats auf deinem Rechner. Venice und NanoGPT speichern den Verlauf standardmäßig auf deinem Gerät. NanoGPTs kostenloses Webmodell läuft ohne Konto. Bei {{appName}} bleibt der Inkognito-Verlauf im Browser. Gehostete Dienste senden Anfragen weiterhin an das antwortende Modell.",
      },
      difference: {
        q: "Was ist der Unterschied zwischen abliterierten und unzensierten Modellen?",
        a: "Abliterierte Modelle sind Mainstream- oder offene Modelle, denen die Verweigerungsrichtung aus den Gewichten geschnitten wurde: gleiches Wissen, gleiches Weltbild, keine Verweigerungen. Fine-Tunes wie Dolphin kommen per Neutraining dorthin. {{ownModel}} ist noch einmal anders: trainiert auf Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden, mit eigenen Ansichten.",
      },
      veniceVs: {
        q: "Ist Venice AI wirklich unzensiert?",
        a: "Die unzensierten Modelle schon, und der Mature Filter ist standardmäßig an, bis ein Pro-Abonnent ihn abschaltet. Die Mainstream-Modelle (Claude, GPT, Gemini) behalten die Filter ihrer Hersteller, wie überall.",
      },
      characterAi: {
        q: "Gibt es Character.AI ohne Filter?",
        a: "Nicht von Character.AI selbst: Pornografische Inhalte werden laut Anbieter nie unterstützt. Alternativen mit Rollenspiel für Erwachsene: Janitor AI (Limitless-Bots), CrushOn (Unfiltered-Schalter), Kindroid, SillyTavern mit einem unzensierten Modell oder {{appName}} mit unzensierten Rollenspiel-Modellen.",
      },
      gabAi: {
        q: "Ist Gab AI unzensiert?",
        a: "Bei Politik, Kultur und Glauben ja: Genau dafür ist das eigene Modell Arya gebaut. Bei Erwachseneninhalten nein: Die AGB verbieten sexuell explizite Inhalte. {{appName}} bietet Arya ebenfalls an, neben unzensierten Modellen, die Erwachsenen-Fiction erlauben.",
      },
      uncensoredAi: {
        q: "Was unterscheidet uncensored.ai von anderer unzensierter KI?",
        a: "Die meisten unzensierten KIs sind Mainstream-Modelle, denen die Verweigerungen herausgeschnitten wurden. Das Modell von uncensored.ai ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden, und vertritt deshalb politische Ansichten gegen den Mainstream. Auf {{appName}} läuft es als {{ownModel}}.",
      },
      openRouter: {
        q: "Hat OpenRouter unzensierte Modelle?",
        a: "Wenige: Venice Uncensored und Rollenspiel-Fine-Tunes wie Hermes 4 und Magnum. 142 der 474 Modelle sind als moderiert markiert. Wer mehr unzensierte Auswahl in einer API will, findet bei NanoGPT, Venice und {{appName}} deutlich mehr.",
      },
      local: {
        q: "Kann ich eine unzensierte KI auf meinem eigenen Rechner betreiben?",
        a: "Ja. Ollama oder LM Studio plus ein abliteriertes oder Dolphin-Modell. Ein 8B-Modell ist ein 5-GB-Download und läuft auf einem normalen Laptop. Ein 70B-Modell braucht über 40 GB Speicher. Die Qualität begrenzt deine Hardware.",
      },
      legal: {
        q: "Ist die Nutzung einer unzensierten KI legal?",
        a: "Die Nutzung ist in den meisten Ländern legal. Was du erzeugst und veröffentlichst, unterliegt trotzdem dem Recht deines Landes. Jede Plattform hier verbietet Inhalte mit Minderjährigen, die meisten auch nicht einvernehmliche Bilder echter Personen.",
      },
    },
    cta: {
      title: "Teste es mit deinen eigenen Prompts",
      subtitle:
        "{{guestCredits}} Gratis-Credits pro Monat, ohne Konto. Stell die Frage, die anderswo abgelehnt wurde, und vergleiche.",
      try: "Inkognito-Chat starten",
      models: "Alle Modelle ansehen",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "Venice AI Alternative: {{appName}} vs Venice im Vergleich",
        description:
          "{{appName}} vs Venice.ai: Preise, unzensierte Modelle, Mature Filter, Datenschutz und API im Vergleich. Wir kaufen bei Venice ein und sagen, wer vorne liegt.",
        keywords:
          "Venice AI Alternative, Venice AI Erfahrungen, Venice AI Test, Venice AI Preise, Venice AI unzensiert, ist Venice AI unzensiert, unzensierte KI, KI ohne Filter, unzensierter KI-Chat, Venice AI alternative, Venice.ai vs, Venice AI review, Venice AI pricing, Venice Pro, Venice uncensored, Venice AI mature filter, Venice AI API, VVV DIEM, uncensored AI chat, {{appName}} vs Venice",
      },
      hero: {
        title: "{{appName}} vs Venice AI",
        subtitle:
          "Zwei unzensierte KI-Plattformen, und die eine kauft bei der anderen ein. Preise, Filter, Datenschutz und API im direkten Vergleich.",
        readTime: "7 Min. Lesezeit",
      },
      intro: {
        lead: "Venice ist der bekannteste Name für private, unzensierte KI. Viele unserer unzensierten Modelle laufen über die API von Venice. Das hier ist also kein Verriss. Es ist die ehrliche Antwort auf eine Frage: Nutzt du Venice direkt oder über {{appName}}?",
        p2: "Fakten zu Venice von den eigenen Preis-, Datenschutz- und Doku-Seiten, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von Venice: {{veniceModels}} unserer Modelle laufen über die API von Venice ({{veniceUncensored}} davon unzensiert), darunter {{veniceExamples}}. Gleiche Modelle, andere App drumherum.",
      verdict:
        "Nimm Venice, wenn du den kompletten Katalog, rein lokalen Verlauf und den günstigsten Tokenpreis für die hauseigenen Modelle willst und für Pro zahlst, um den Mature Filter loszuwerden. Nimm {{appName}}, wenn du die unzensierten Modelle von Venice neben Claude, GPT, dem Modell von uncensored.ai und abliterierten GLM- und DeepSeek-Builds anderer Anbieter willst, in einem Chat, ohne Filter zum Freischalten außer einer einmaligen 18+-Bestätigung.",
      themPros: {
        a: "303 Modelle im API-Katalog, darunter Video, Musik und Sprache.",
        b: "Der Verlauf bleibt standardmäßig auf deinem Gerät. Starkes Datenschutzversprechen.",
        c: "Günstigster Weg zu den Venice-Modellen: kein Aufschlag durch einen Mittelsmann, dazu DIEM-Staking für tägliches API-Guthaben.",
      },
      themCons: {
        a: "Gratis-Tarif: 10 Text-Prompts pro Tag, nur Basismodelle.",
        b: "Der Mature Filter ist standardmäßig an. Abschalten geht nur mit Pro.",
        c: "Nur das Venice-Sortiment: kein Modell von uncensored.ai, keine Modelle von Anbietern, die Venice nicht hostet.",
      },
      usPros: {
        a: "Die unzensierten Modelle von Venice plus unzensierte Modelle von NanoGPT, uncensored.ai, FreedomGPT und Gab AI in einer Modellauswahl.",
        b: "Kein Mature Filter, von dem du dich freikaufen musst: Eine einmalige 18+-Bestätigung schaltet jedes unzensierte Modell frei, auch im Gratis-Tarif.",
        c: "{{guestCredits}} Gratis-Credits pro Monat ohne Konto, und die gesamte Plattform ist Open Source.",
      },
      usCons: {
        a: "Bei den Venice-Modellen sind wir teurer: Unser Aufschlag von {{markup}} % kommt auf den Venice-Preis obendrauf.",
        b: "Insgesamt kleinerer Katalog als bei Venice.",
        c: "Wir speichern private Chats für die Synchronisierung. Inkognito bleibt der Verlauf im Browser. Venice hält den Verlauf standardmäßig lokal und bietet in Bezahlplänen verschlüsselte Sicherungen.",
      },
      chooseThem: {
        a: "du den größten unzensierten Katalog von einem einzigen Anbieter willst.",
        b: "du VVV hältst oder für API-Guthaben staken willst.",
        c: "du die Venice-Modelle per API aufrufst und jeder Cent pro Token zählt.",
      },
      chooseUs: {
        a: "du Modelle, die Venice nicht führt, wie {{ownModel}}, im selben Chat willst.",
        b: "du unzensiert willst, ohne für einen Tarif zu zahlen, der einen Filter entfernt.",
        c: "du Open-Source-Software zum Selbsthosten und ein Guthaben für Chat, Bilder, Video und Musik willst.",
      },
      both: "Beides zu nutzen ist normal. Venice für den Katalog, {{appName}}, wenn du die Antwort von Venice im selben Thread mit dem unzensierten Modell eines anderen Anbieters vergleichen willst.",
      switch: {
        title: "Umstieg von Venice",
        body: "Bei den Modellen gibt es nichts zu migrieren: Venice Uncensored und die anderen Venice-Modelle stehen unter denselben Namen in unserer Auswahl. Starte einen Inkognito-Chat, wähl ein Venice-Modell und mach weiter, wo du aufgehört hast. Alten Kontext fügst du bei Bedarf in die erste Nachricht ein.",
      },
      faq: {
        q1: {
          q: "Ist {{appName}} dasselbe wie Venice?",
          a: "Nein. Wir sind eine eigenständige Open-Source-Plattform. Einige unserer Modelle laufen über die API von Venice, andere kommen von NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter und den großen Laboren.",
        },
        q2: {
          q: "Ist Venice AI kostenlos?",
          a: "Gratis gibt es 10 Text- und 15 Bildanfragen am Tag mit Basismodellen. Pro umfasst unbegrenzt Text, bis zu 1.000 Bilder täglich mit Pro-Modellen und die Möglichkeit, den Erwachsenenfilter abzuschalten.",
        },
        q3: {
          q: "Ist Venice günstiger als {{appName}}?",
          a: "Bei den Venice-Modellen ja: Wir schlagen {{markup}} % auf die Anbieterkosten auf. Wenn du Modelle verschiedener Anbieter in einer App mischst, sparst du dir separate Abos.",
        },
        q4: {
          q: "Was ist privater, Venice oder {{appName}}?",
          a: "Venice hält den Verlauf standardmäßig auf deinem Gerät und bietet in Bezahlplänen verschlüsselte Sicherung. {{appName}} hält Inkognito-Verläufe im Browser und speichert private Chats für die Synchronisierung. Beide leiten Nachrichten an das antwortende Modell weiter.",
        },
      },
      cta: { title: "Teste die Venice-Modelle neben allem anderen" },
    },
    characterAi: {
      meta: {
        title: "Character AI Alternative ohne Filter: {{appName}}",
        description:
          "{{appName}} vs Character.AI: Filter, Altersprüfung, Modelle, Datenschutz, Preis. Wann Character.AI passt und wann du eine unzensierte Alternative brauchst.",
        keywords:
          "Character AI Alternative, Character AI Alternative ohne Filter, Character AI ohne Filter, Character AI Filter umgehen, Character AI NSFW, Character AI Altersverifizierung, KI Rollenspiel ohne Filter, NSFW KI Chat, unzensierte KI, Character AI alternative, Character AI alternative without filter, Character.AI filter, c.ai+ price, Character AI age verification, uncensored character AI, AI roleplay without filter, {{appName}} vs Character.AI",
      },
      hero: {
        title: "{{appName}} vs Character.AI: die Alternative ohne Filter",
        subtitle:
          "Die größte Charakter-Chat-Plattform gegen eine offene, unzensierte. Was jede erlaubt, was jede kostet, wohin deine Chats gehen.",
        readTime: "7 Min. Lesezeit",
      },
      intro: {
        lead: "Character.AI hat die größte Charakterbibliothek im Netz und einen Filter, der sich nicht bewegt. Das eigene Hilfe-Center sagt: Pornografische Inhalte werden auch in Zukunft zu keinem Zeitpunkt unterstützt. Ist das für dich ein No-Go, brauchst du eine andere Plattform, keinen Jailbreak.",
        p2: "Fakten zu Character.AI von den Abo-, Hilfe- und Datenschutzseiten, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Keine Geschäftsbeziehung mit Character.AI. Du kannst einen Charakter mitnehmen: Füg seinen Character.AI-Link ein, und {{appName}} importiert ihn als Skill.",
      verdict:
        "Nimm Character.AI für jugendfreien Spaß mit Millionen fertiger Charaktere, gratis und unbegrenzt, oder für alle unter 18. Nimm {{appName}}, wenn der Filter ständig deine Geschichte kaputt macht: unzensierte Rollenspiel-Modelle nach einer einmaligen 18+-Bestätigung, Modellwahl pro Nachricht und Chats, mit denen niemand Modelle trainiert.",
      themPros: {
        a: "Millionen Community-Charaktere, sofort startklar.",
        b: "Unbegrenzte Gratis-Nachrichten, günstige Bezahlstufen.",
        c: "Sprachanrufe mit Charakteren.",
      },
      themCons: {
        a: "Keine Erwachseneninhalte, niemals, und dunkle Szenen werden entschärft.",
        b: "Chat-Inhalte können ins Training einfließen. Laut Hilfecenter ist ein Widerspruch für neue Inhalte im EWR und im Vereinigten Königreich möglich.",
        c: "Nur eigene Modelle. Keine Wahl, kein eigener Schlüssel.",
      },
      usPros: {
        a: "{{uncensored}} unzensierte Modelle, mehrere davon für Rollenspiel gebaut. Szenen gehen dahin, wo die Geschichte hingeht.",
        b: "Wähl das Modell pro Nachricht: ein unzensiertes Rollenspiel-Modell für die Szene, ein Frontier-Modell für die Planung.",
        c: "Inkognito-Chats bleiben in deinem Browser. Wir trainieren keine Modelle mit deinen Chats.",
      },
      usCons: {
        a: "Viel weniger fertige Charaktere. Du importierst oder schreibst deine eigenen.",
        b: "Credits nach Verbrauch statt unbegrenzter Gratis-Nachrichten.",
        c: "Keine Sprachanrufe mit Charakteren.",
      },
      chooseThem: {
        a: "du jugendfreien Chat mit einer riesigen Charakterbibliothek willst.",
        b: "Für Minderjährige reicht der Lesemodus aus.",
        c: "du unbegrenzte Gratis-Nachrichten willst und nie über Kosten nachdenken möchtest.",
      },
      chooseUs: {
        a: "der Filter ständig dein Rollenspiel kaputt macht.",
        b: "du das Modell selbst wählen willst, statt eins zugeteilt zu bekommen.",
        c: "deine Chats nicht ins Training und nicht in die Werbesteuerung sollen.",
      },
      both: "Viele behalten Character.AI für lockeren Chat und verlegen die Geschichten, die ein Modell für Erwachsene brauchen, hierher. Den Charakter nehmen sie per Import mit.",
      switch: {
        title: "Einen Charakter von Character.AI umziehen",
        body: "Kopier den Character.AI-Link des Charakters, füg ihn in den Skill-Import auf {{appName}} ein, und Name, Begrüßung und Definition kommen mit, soweit der Charakter sie öffentlich macht. Dann wählst du ein unzensiertes Rollenspiel-Modell und erzählst weiter.",
      },
      faq: {
        q1: {
          q: "Erlaubt Character.AI NSFW?",
          a: "Nein. Laut Hilfe-Center verstoßen pornografische Inhalte gegen die AGB und werden auch in Zukunft zu keinem Zeitpunkt unterstützt.",
        },
        q2: {
          q: "Verlangt Character.AI eine Altersverifizierung?",
          a: "Ja. Nutzer durchlaufen eine Altersprüfung mit Persona. Wer als unter 18 verifiziert ist, bekommt nur den Lesemodus, ohne Chat.",
        },
        q3: {
          q: "Ist {{appName}} eine Character.AI-Alternative ohne Filter?",
          a: "Für Erwachsene ja. Unzensierte Modelle schaltest du mit einer einmaligen 18+-Bestätigung frei, und mehrere sind für Rollenspiel gebaut. Mainstream-Modelle behalten die Filter ihrer Hersteller, für Szenen für Erwachsene wählst du also ein unzensiertes.",
        },
        q4: {
          q: "Kann ich meine Character.AI-Charaktere importieren?",
          a: "Ja: Füg den Link des Charakters in den Skill-Import ein. Was mitkommt, hängt davon ab, was der Ersteller auf Character.AI öffentlich gemacht hat.",
        },
      },
      cta: { title: "Erzähl die Geschichte weiter, ohne Filter" },
    },
    janitorAi: {
      meta: {
        title: "Janitor AI Alternative: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI: JLLM gegen {{modelCount}} Modelle, Kontextgrenzen, NSFW-Regeln, Proxys, Datenschutz und Preis. Ehrliche Stärken und Schwächen fürs Rollenspiel.",
        keywords:
          "Janitor AI Alternative, Janitor AI deutsch, Janitor AI Erfahrungen, Janitor AI Proxy, NSFW KI Rollenspiel, KI Rollenspiel ohne Filter, NSFW KI Chat, unzensierte KI, Janitor AI alternative, Janitor AI vs, JanitorAI, janitor+ price, JLLM, Janitor AI OpenRouter, Janitor AI context limit, NSFW AI roleplay, uncensored roleplay AI, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "Die größte kostenlose Rollenspiel-Community gegen einen unzensierten Multi-Modell-Chat. Modelle, Gedächtnis, Regeln, Preis.",
        readTime: "6 Min. Lesezeit",
      },
      intro: {
        lead: "Janitor AI hat das Rollenspiel mit zwei Dingen gewonnen: Millionen Community-Bots und ein kostenloses Modell. Der Haken zeigt sich in langen Geschichten. Der Gratis-Kontext liegt bei rund 9K Tokens, und für bessere Modelle richtest du einen Proxy mit eigenem Schlüssel ein.",
        p2: "Fakten zu Janitor AI von der janitor+-Seite, dem Hilfe-Center und den Richtlinien, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Keine Geschäftsbeziehung mit Janitor AI. Unterschiedliche Konzepte: Janitor ist eine Charakterbibliothek mit einem Gratis-Modell, wir sind eine Modellbibliothek mit Charakteren.",
      verdict:
        "Nimm Janitor AI für die Bot-Bibliothek und unbegrenzten Gratis-Chat auf JLLM. Nimm {{appName}}, wenn du starke unzensierte Modelle mit langem Kontext sofort startklar willst, ohne Proxy-Setup, und Bilder, Video und Sprache im selben Chat.",
      themPros: {
        a: "Millionen Community-Bots, mit Limitless-Tags für NSFW.",
        b: "Unbegrenzter Gratis-Chat auf dem eigenen Modell.",
        c: "Eigenes Modell per Proxy, OpenRouter inklusive.",
      },
      themCons: {
        a: "Rund 9K Tokens Gratis-Kontext: Lange Kampagnen vergessen.",
        b: "janitor+ enthält ein Monatskontingent für Premiummodelle. Für ein eigenes Modell brauchst du einen API-Schlüssel und einen Proxy.",
        c: "Nur Text, und die Mobile-App startet im Safe Mode.",
      },
      usPros: {
        a: "{{modelCount}} Modelle in der Auswahl, {{uncensored}} unzensiert, kein Proxy und kein Schlüssel einzurichten.",
        b: "Unzensierte Modelle mit langem Kontext für Kampagnen, die wochenlang laufen.",
        c: "Bilder, Video, Musik und Sprache aus demselben Chat und Guthaben.",
      },
      usCons: {
        a: "Eine winzige Charakterbibliothek neben der von Janitor.",
        b: "Kein unbegrenzter Gratis-Tarif: {{guestCredits}} Gratis-Credits pro Monat, danach ein Tarif.",
        c: "Weniger Community: kein öffentlicher Bot-Feed.",
      },
      chooseThem: {
        a: "du Tausende fertige Bots durchstöbern willst.",
        b: "du unbegrenzten Gratis-Chat willst und dir das Gratis-Modell reicht.",
        c: "du schon deinen eigenen Schlüssel über einen Proxy nutzt und zufrieden bist.",
      },
      chooseUs: {
        a: "lange Geschichten langen Kontext und ein starkes unzensiertes Modell brauchen.",
        b: "du mitten in der Szene das Modell wechseln willst, ohne Proxy-Einstellungen anzufassen.",
        c: "du Bilder oder Sprache für deine Charaktere am selben Ort willst.",
      },
      both: "Typisches Setup: Charaktere auf Janitor AI entdecken, die langen Kampagnen auf {{appName}} spielen.",
      switch: {
        title: "Umstieg von Janitor AI",
        body: "Leg auf {{appName}} einen Skill mit Persönlichkeit, Szenario und Begrüßung deines Charakters an und wähl ein unzensiertes Rollenspiel-Modell. Inkognito-Chats brauchen kein Konto, du kannst also eine Szene testen, bevor du dich registrierst.",
      },
      faq: {
        q1: {
          q: "Ist Janitor AI kostenlos?",
          a: "Ja: unbegrenzte Chats auf dem eigenen Modell mit rund 9K Tokens Kontext. janitor+ bringt mehr Gedächtnis, Tempo und Modelle.",
        },
        q2: {
          q: "Erlaubt Janitor AI NSFW?",
          a: "Ja, für Erwachsene auf Bots mit Limitless-Tag, im Web. Die Mobile-App startet im Safe Mode, bis du NSFW in den Web-Einstellungen aktivierst.",
        },
        q3: {
          q: "Brauche ich auf {{appName}} einen Proxy?",
          a: "Nein. Jedes Modell steht in der Auswahl. Du zahlst Credits pro Nachricht, kein API-Schlüssel nötig.",
        },
        q4: {
          q: "Was hat das bessere Gedächtnis für langes Rollenspiel?",
          a: "Janitor AI nennt rund 9.000 Tokens gratis und fünfmal so viel mit janitor+. Bei {{appName}} hängt das Kontextfenster vom gewählten Modell ab.",
        },
      },
      cta: {
        title:
          "Spiel deine nächste Kampagne auf einem Modell mit langem Kontext",
      },
    },
    nanoGpt: {
      meta: {
        title: "NanoGPT Alternative: {{appName}} vs NanoGPT im Vergleich",
        description:
          "{{appName}} vs NanoGPT: Pay-as-you-go gegen Tarife, unzensierte und abliterierte Modelle, Datenschutz, API, Medien. Als NanoGPT-Kunde sagen wir, wo es führt.",
        keywords:
          "NanoGPT Alternative, NanoGPT Erfahrungen, NanoGPT Preise, NanoGPT unzensiert, unzensierte KI API, abliterierte Modelle, KI ohne Abo, unzensierte KI, KI ohne Filter, NanoGPT alternative, NanoGPT vs, nano-gpt review, NanoGPT pricing, NanoGPT PRO, NanoGPT uncensored, abliterated models API, pay as you go AI, uncensored AI API, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Zwei Multi-Modell-Plattformen mit unzensierten Modellen und API. Eine rechnet nach Nutzung ab, eine mit Tarifen. Die eine beliefert die andere.",
        readTime: "6 Min. Lesezeit",
      },
      intro: {
        lead: "NanoGPT rechnet nach Verbrauch ab. Ein Gratismodell kannst du ohne Anmeldung testen. Mehrere unserer unzensierten Modelle laufen über seine API. So unterscheiden sich beide Angebote.",
        p2: "Fakten zu NanoGPT von den Preis-, Datenschutz- und AGB-Seiten und der öffentlichen Modellliste, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von NanoGPT: {{nanoGptModels}} unserer Modelle laufen über die API von NanoGPT ({{nanoGptUncensored}} davon unzensiert), darunter {{nanoGptExamples}}.",
      verdict:
        "Wähle NanoGPT für einen breiten Katalog und Verbrauchsabrechnung, auch über die API mit x402 ohne Konto. Wähle {{appName}} für eine getestete Auswahl mehrerer Anbieter, monatliches Gratisguthaben, Skills, Gedächtnis und einen Open-Source-Chat zum Selbsthosten.",
      themPros: {
        a: "596 Einträge für Textmodelle. 38 IDs enthalten uncensored, abliterated oder Dolphin.",
        b: "Kein Abo nötig. Nach der Anmeldung kannst du ab 0,10 USD in Krypto aufladen.",
        c: "Listenpreise auf automatisch gerouteten Modellen, günstiger als jeder Mittelsmann.",
      },
      themCons: {
        a: "Der Gratis-Tarif ist ein Modell im Web.",
        b: "Der Datenschutz hängt von der Anbieterroute ab; manche Routen erlauben Training.",
        c: "Bei einem so großen Katalog testest du selbst.",
      },
      usPros: {
        a: "Eine kuratierte Auswahl: Jedes Modell ist als Mainstream, offen oder unzensiert markiert, mit eigener Seite und Live-Preis.",
        b: "{{guestCredits}} Gratis-Credits pro Monat, genug, um unzensierte Modelle mit deinen eigenen Prompts zu testen.",
        c: "Skills, Gedächtnis, Ordner und ein Chat für lange Arbeit, Open Source und selbst hostbar.",
      },
      usCons: {
        a: "Weniger Modelle als NanoGPT.",
        b: "Wir schlagen {{markup}} % auf die Anbieterkosten auf, dasselbe Modell kostet hier also mehr.",
        c: "Tarif zuerst: Credit-Pakete laden einen aktiven Tarif auf.",
      },
      chooseThem: {
        a: "Du willst nach Verbrauch zahlen oder die API ohne Konto per x402 nutzen.",
        b: "du ein exotisches Modell brauchst, das nur ein riesiger Katalog führt.",
        c: "du auf der API aufbaust und Listenpreise willst.",
      },
      chooseUs: {
        a: "Du willst eine getestete Auswahl.",
        b: "du monatliche Gratis-Credits und einen polierten Chat mit Skills und Gedächtnis willst.",
        c: "du das Modell von uncensored.ai und die Venice-Modelle neben denen von NanoGPT in einem Thread willst.",
      },
      both: "Entwickler nutzen oft die API von NanoGPT für Batch-Jobs und {{appName}} als täglichen Chat.",
      switch: {
        title: "Umstieg von NanoGPT",
        body: "Die über NanoGPT gelieferten Modelle in unserer Auswahl, etwa {{nanoGptExamples}}, sind dieselben Modelle. Starte einen Inkognito-Chat, wähl eins und vergleich die Antworten im selben Thread mit einem Modell eines anderen Anbieters.",
      },
      faq: {
        q1: {
          q: "Ist NanoGPT günstiger als {{appName}}?",
          a: "Pro Token meist ja: NanoGPT verlangt Listenpreise, wir schlagen {{markup}} % auf. Wir geben dir {{guestCredits}} Gratis-Credits pro Monat und eine App für alle Anbieter.",
        },
        q2: {
          q: "Braucht NanoGPT ein Konto?",
          a: "Das kostenlose Webmodell funktioniert ohne Konto. Guthaben im Web aufladen geht nur nach Anmeldung. Die API unterstützt x402-Zahlungen ohne Konto.",
        },
        q3: {
          q: "Haben beide eine API?",
          a: "Ja. Die API von NanoGPT ist OpenAI- und Anthropic-kompatibel, mit Zahlung ohne Konto. Unsere ist OpenAI- und Anthropic-kompatibel und wird nach einem Tarif oder Credit-Kauf freigeschaltet.",
        },
        q4: {
          q: "Wer hat mehr unzensierte Modelle?",
          a: "NanoGPT listet insgesamt mehr. {{appName}} hat {{uncensored}}, ausgewählt und getestet, von NanoGPT, Venice, uncensored.ai, FreedomGPT und Gab AI.",
        },
      },
      cta: { title: "Vergleich die NanoGPT-Modelle mit allen anderen" },
    },
    freedomGpt: {
      meta: {
        title: "FreedomGPT Alternative: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT: Liberty und zensurfreie Modelle, Inhaltsregeln, Datenschutz, Credits, API und Open Source. Fakten mit Quellen, für beide Seiten.",
        keywords:
          "FreedomGPT Alternative, FreedomGPT Erfahrungen, FreedomGPT Preise, FreedomGPT deutsch, Liberty Modell, KI ohne Zensur, ChatGPT ohne Zensur, ChatGPT Alternative ohne Filter, unzensierte KI, FreedomGPT alternative, FreedomGPT vs, FreedomGPT review, FreedomGPT pricing, FreedomGPT Pro, Liberty model, FreedomGPT uncensored, censor-free AI, uncensored ChatGPT alternative, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Zwei Apps, die zensurfreie Modelle neben ChatGPT, Claude und Gemini stellen. Regeln, Datenschutz, Credits, Open Source.",
        readTime: "6 Min. Lesezeit",
      },
      intro: {
        lead: "FreedomGPT und {{appName}} teilen eine Idee: Mainstream- und unzensierte Modelle in einer Liste. Die Unterschiede liegen in den Regeln, den Credits und dem, was mit deinen Nachrichten passiert.",
        p2: "Fakten zu FreedomGPT von Startseite, Preisseite, Datenschutzerklärung, Doku und GitHub, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von FreedomGPT: {{freedomGptExamples}} läuft auf {{appName}} über die eigene API von FreedomGPT.",
      verdict:
        "Nimm FreedomGPT für einen $20-Tarif, der Chat, Bilder und Video abdeckt, mit Gratis-Start ohne Konto. Nimm {{appName}}, wenn du mehr unzensierte Modelle von mehreren Anbietern willst, keine Klausel gegen unethische Nutzung zusätzlich zum Gesetz, veröffentlichte Preise pro Modell und eine Open-Source-Plattform, die aktiv weiterentwickelt wird.",
      themPros: {
        a: "Gratis ohne Karte und ohne Konto.",
        b: "Liberty und weitere zensurfreie Modelle neben ChatGPT, Claude und Gemini.",
        c: "Bild- und Videogenerierung im selben Tarif.",
      },
      themCons: {
        a: "Laut eigenen Regeln müssen Modelle US-Recht einhalten und dürfen nicht für unethische Zwecke genutzt werden.",
        b: "Nachrichten, Sprache und Bilder gehen an externe Anbieter; keine Speicherdauer angegeben.",
        c: "Die Open-Source-Desktop-App wurde seit Juni 2024 nicht aktualisiert.",
      },
      usPros: {
        a: "{{uncensored}} unzensierte Modelle von fünf Anbietern, Liberty inklusive.",
        b: "Jedes Modell hat eine öffentliche Seite mit seinem Live-Preis pro Nachricht.",
        c: "Die gesamte Plattform ist Open Source und wird aktiv entwickelt. Hoste sie selbst.",
      },
      usCons: {
        a: "Kein pauschaler All-in-Tarif: Credits werden pro Modell abgerechnet.",
        b: "Für Gedächtnis und synchronisierte Chats brauchst du ein Konto.",
        c: "Unser Aufschlag von {{markup}} % gilt auch für die über FreedomGPT gelieferten Modelle.",
      },
      chooseThem: {
        a: "du einen einfachen $20-Tarif für Chat, Bilder und Video willst.",
        b: "du nur Liberty und die Mainstream-Modelle brauchst.",
        c: "du eine Offline-Desktop-App willst und dir die Version von 2024 reicht.",
      },
      chooseUs: {
        a: "du mehr unzensierte Auswahl willst: auch Modelle von Venice, NanoGPT, uncensored.ai und Gab.",
        b: "du den Preis pro Nachricht sehen willst, bevor du sie abschickst.",
        c: "du aktuelle Open-Source-Software zum Selbsthosten willst.",
      },
      both: "Liberty von FreedomGPT steht in unserer Auswahl. Du kannst es also gegen andere unzensierte Modelle testen, ohne ein zweites Abo.",
      switch: {
        title: "Umstieg von FreedomGPT",
        body: "Wähl Liberty in unserer Modellauswahl und mach weiter. Dann probier denselben Prompt mit {{ownModel}} oder einem abliterierten Modell und behalte, was am besten antwortet.",
      },
      faq: {
        q1: {
          q: "Ist FreedomGPT wirklich unzensiert?",
          a: "Die zensurfreien Modelle lassen die meisten Verweigerungen weg. FreedomGPT sagt aber, dass jedes gehostete Modell US-Recht einhalten muss und nicht für unethische Zwecke genutzt werden darf, und das Label zensurfrei garantiert nicht, dass jede Anfrage beantwortet wird.",
        },
        q2: {
          q: "Was kostet FreedomGPT?",
          a: "Der Start ist gratis. Pro enthält 2.200 Credits pro Monat; eine Premium-Antwort kostet etwa 10, ein Bild etwa 25 und ein 5-Sekunden-Video etwa 400.",
        },
        q3: {
          q: "Ist FreedomGPT Open Source?",
          a: "Die ältere Desktop-App für Offline-Modelle ist Open Source (GPL-3.0) auf GitHub, zuletzt aktualisiert im Juni 2024. Die Cloud-App nicht. {{appName}} ist als Ganzes Open Source.",
        },
        q4: {
          q: "Kann ich das Liberty-Modell von FreedomGPT auf {{appName}} nutzen?",
          a: "Ja. Es läuft über die API von FreedomGPT und steht in unserer Auswahl neben den anderen unzensierten Modellen.",
        },
      },
      cta: { title: "Teste Liberty gegen jedes andere unzensierte Modell" },
    },
    gabAi: {
      meta: {
        title: "Gab AI Alternative: {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI: Arya, 214 Modelle, Verbot sexueller Inhalte, Datenschutz, Credits und API. Wir kaufen bei Gab ein und sagen, wer wo gewinnt.",
        keywords:
          "Gab AI Alternative, Gab AI Erfahrungen, Gab AI Preise, Gab AI deutsch, Arya KI, konservative KI, KI ohne Zensur, unzensierte KI, Gab AI alternative, Gab AI vs, Gab AI review, Gab AI pricing, Gab AI Plus, Arya AI, Gab Arya, is Gab AI uncensored, Gab AI NSFW, Gab AI API, conservative AI chatbot, right-wing AI, uncensored AI chat, {{appName}} vs Gab AI",
      },
      hero: {
        title: "{{appName}} vs Gab AI",
        subtitle:
          "Zwei Multi-Modell-Apps, die Politik nicht zensieren. Eine verbietet zusätzlich Erwachseneninhalte. Preise, Regeln, Datenschutz und API im direkten Vergleich.",
        readTime: "7 Min. Lesezeit",
      },
      intro: {
        lead: "Gab AI hat Arya für alle gebaut, die genug von Chatbots haben, die sie über Politik, Kultur und Glauben belehren. Wir bieten Arya ebenfalls an, über Gabs eigene API. Die eigentliche Frage ist also nicht, wer unzensiert ist. Sondern welche Regeln du rund um das Modell willst.",
        p2: "Fakten zu Gab AI von Startseite, Preisseite, API-Seite, AGB und Datenschutzerklärung, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von Gab AI: {{gabAiExamples}} läuft auf {{appName}} über Gabs eigene API. Gleiches Modell, andere App, andere Regeln drumherum.",
      verdict:
        "Nimm Gab AI, wenn du Arya mit Gabs Agentenmodus, Desktop-Apps und einem Katalog von 214 Modellen unter einer konservativen Marke willst und nie Erwachseneninhalte brauchst. Nimm {{appName}}, wenn du Arya neben {{ownModel}} und abliterierten GLM- und DeepSeek-Builds in einem Chat willst, Erwachsenen-Fiction auf den unzensierten Modellen, die sie erlauben, und Chats, die in deinem Browser bleiben können.",
      themPros: {
        a: "214 Modelle in einem Konto, dazu Arya, das eigene Modell für Politik, Kultur und Glauben.",
        b: "Agentenmodus (Work), Live-Sprache, Bild, Video und Musik, Apps für Mac, Windows, iPhone und Android.",
        c: "Gekaufte Credit-Pakete werden übertragen und verfallen nicht.",
      },
      themCons: {
        a: "Die AGB verbieten obszöne, sexuell explizite oder pornografische Inhalte, und automatisierte Systeme können deine Inhalte prüfen.",
        b: "Prompts, Antworten und Verlauf liegen auf Gabs Servern, und die Verbesserung der eigenen Modelle ist ein genannter Zweck.",
        c: "Gratis heißt: einmalig 250 Credits nach E-Mail-Bestätigung. Die API setzt Plus oder Plus Premium voraus.",
      },
      usPros: {
        a: "{{uncensored}} unzensierte Modelle von mehreren Anbietern, Arya inklusive, in einer Modellauswahl.",
        b: "Kein pauschales Verbot von Erwachseneninhalten: Eine einmalige 18+-Bestätigung schaltet jedes unzensierte Modell frei.",
        c: "{{guestCredits}} Gratis-Credits pro Monat ohne Konto. Inkognito-Chats bleiben in deinem Browser.",
      },
      usCons: {
        a: "Kein Agentenmodus und keine Desktop-App wie Gabs Work.",
        b: "Kleinerer Katalog: {{modelCount}} Chatmodelle gegen Gabs 214.",
        c: "Unser Aufschlag von {{markup}} % gilt auch für Arya.",
      },
      chooseThem: {
        a: "du Arya mit Gabs Agentenmodus und Desktop-Apps willst.",
        b: "du Gabs Werte teilst und ein KI-Unternehmen abseits von Big Tech unterstützen willst.",
        c: "du nie Erwachsenen-Fiction schreibst und den größten Katalog auf einer Rechnung willst.",
      },
      chooseUs: {
        a: "du Arya im selben Thread mit {{ownModel}} und abliterierten Modellen vergleichen willst.",
        b: "du Erwachsenen- oder Dark-Fiction schreibst und Modelle brauchst, die sie erlauben.",
        c: "du ohne Konto starten willst und Inkognito-Chats in deinem Browser behalten willst.",
      },
      both: "Arya steht in unserer Auswahl. Du kannst also dieselbe Frage an Arya, {{ownModel}} und ein abliteriertes Modell stellen und die Antworten selbst beurteilen, ohne ein zweites Abo.",
      switch: {
        title: "Umstieg von Gab AI",
        body: "Wähl Arya in unserer Modellauswahl und mach weiter. Dann schick denselben Prompt an {{ownModel}}: Beide weichen Politik nicht aus, aber sie wurden unterschiedlich gebaut, und das merkst du an den Antworten. Alten Kontext fügst du bei Bedarf in die erste Nachricht ein.",
      },
      faq: {
        q1: {
          q: "Ist Gab AI wirklich unzensiert?",
          a: "Bei Politik, Kultur und Glauben ja: Dafür ist Arya gebaut. Bei sexuellen Inhalten nein. Gabs AGB verbieten obszöne, sexuell explizite oder pornografische Inhalte und sagen, dass automatisierte Systeme deine Inhalte auf Regelverstöße prüfen können.",
        },
        q2: {
          q: "Was kostet Gab AI?",
          a: "Gratis-Konten bekommen 250 Credits nach E-Mail-Bestätigung. Plus kostet $20 pro Monat oder $200 pro Jahr mit 2.000 Credits pro Monat. Plus Premium kostet $999 pro Jahr mit 12.000 Credits. Credit-Pakete beginnen bei $10 für 700 Credits.",
        },
        q3: {
          q: "Kann ich Arya auf {{appName}} nutzen?",
          a: "Ja. Arya läuft über Gabs API und steht in unserer Auswahl neben {{ownModel}} und den anderen unzensierten Modellen. Für Aryas Antworten gelten weiterhin Gabs eigene Inhaltsregeln.",
        },
        q4: {
          q: "Speichert Gab AI meine Chats?",
          a: "Ja. Laut Datenschutzerklärung speichert Gab deine Prompts, Antworten und den Gesprächsverlauf, nennt die Verbesserung seiner Modelle als Zweck und weist darauf hin, dass die Weiterleitung an Modellanbieter Anfragen nicht anonym macht. Auf {{appName}} bleiben Inkognito-Chats in deinem Browser.",
        },
      },
      cta: { title: "Teste Arya gegen jedes andere unzensierte Modell" },
    },
    uncensoredAi: {
      meta: {
        title: "uncensored.ai Alternative: {{appName}} vs uncensored.ai",
        description:
          "{{appName}} vs uncensored.ai: dasselbe UncensoredLM-Modell, eine andere App. Gratis-Limits, Pro-Preis, API, Datenschutz und Medien im Vergleich, mit Quellen.",
        keywords:
          "uncensored.ai Alternative, uncensored.ai Erfahrungen, uncensored.ai Preise, uncensored.ai kostenlos, uncensored.ai deutsch, unzensierte KI, KI ohne Zensur, uncensored.ai alternative, uncensored.ai vs, uncensored.ai review, uncensored.ai pricing, uncensored.ai Pro, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, is uncensored.ai free, uncensored AI chat, {{appName}} vs uncensored.ai",
      },
      hero: {
        title: "{{appName}} vs uncensored.ai",
        subtitle:
          "Ein Modell mit eigenem Weltbild, zwei Wege, es zu nutzen. Gratis-Limits, Preis, API und was sonst noch dazugehört.",
        readTime: "6 Min. Lesezeit",
      },
      intro: {
        lead: "uncensored.ai baut das eigenständigste unzensierte Modell, das wir kennen: {{ownModel}}, trainiert auf Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden, mit politischen Ansichten gegen den Mainstream. Wir nutzen es über die eigene API von uncensored.ai. Diese Seite beantwortet also eine Frage: Nutzt du es besser auf uncensored.ai oder hier?",
        p2: "Fakten zu uncensored.ai von Preisseite, API-Seite, Über-uns-Seite und Datenschutzerklärung, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von uncensored.ai: {{uncensoredAiExamples}} läuft auf {{appName}} über die API von uncensored.ai. Gleiches Modell, unser Chat, unsere Abrechnung.",
      verdict:
        "Nimm uncensored.ai, wenn du unbegrenzte Chats mit diesem einen Modell zum festen Pro-Preis willst, lebenslang fixiert, plus Forum und Sprachmodus. Nimm {{appName}}, wenn du {{ownModel}} neben {{modelCount}} anderen Modellen willst, damit ein Thread seine Sicht gegen Claude, GPT oder ein abliteriertes Modell prüfen kann, mit Bildern, Video und Musik auf demselben Guthaben.",
      themPros: {
        a: "Fester Preis: Pro kostet $9.99 pro Monat oder $99.99 pro Jahr, lebenslang fixiert, solange du abonniert bleibst.",
        b: "Unbegrenzte Chats mit dem Modell zu diesem Preis, dazu Sprachmodus, Ordner und Archive.",
        c: "Laut Datenschutzerklärung werden deine Daten nicht zum Training oder zur Verbesserung von KI-Modellen genutzt.",
      },
      themCons: {
        a: "Gratis gibt es 3 Antworten pro Tag.",
        b: "Ein Modell, 32.768 Tokens Kontext, keine Bild-, Video- oder Musikgenerierung.",
        c: "API-Aufrufe kosten je $0.05 und werden getrennt von Pro gekauft.",
      },
      usPros: {
        a: "{{ownModel}} plus {{modelCount}} weitere Modelle in einem Chat: Vergleich seine Antwort im selben Thread mit Mainstream- und abliterierten Modellen.",
        b: "{{guestCredits}} Gratis-Credits pro Monat ohne Konto, {{freeCredits}} mit Konto.",
        c: "Bilder, Video, Musik und Sprache auf demselben Guthaben, und die gesamte Plattform ist Open Source.",
      },
      usCons: {
        a: "Abrechnung nach Credits statt Flatrate: Wer dieses eine Modell täglich intensiv nutzt, zahlt hier mehr.",
        b: "Kein Community-Forum und keine Archive rund um das Modell.",
        c: "Unser Aufschlag von {{markup}} % gilt auch für das Modell von uncensored.ai.",
      },
      chooseThem: {
        a: "dieses eine Modell alles ist, was du brauchst, und du es jeden Tag nutzt.",
        b: "du einen lebenslang fixierten Preis willst.",
        c: "du das Forum und den Sprachmodus willst.",
      },
      chooseUs: {
        a: "du seine Sicht mit Mainstream- und abliterierten Modellen vergleichen willst.",
        b: "du es nur ab und zu nutzt und kein weiteres Abo willst.",
        c: "du auch Bilder, Video oder Musik brauchst.",
      },
      both: "Viele nutzen beides: uncensored.ai für unbegrenzte tägliche Chats mit dem Modell, {{appName}}, wenn sie seine Antwort im selben Thread neben die eines anderen Modells stellen wollen.",
      switch: {
        title: "Umstieg von uncensored.ai",
        body: "Wähl {{ownModel}} in unserer Modellauswahl und starte einen Inkognito-Chat. Keine Migration nötig. Alten Kontext fügst du bei Bedarf in die erste Nachricht ein. Dann stell dieselbe Frage einem abliterierten Modell und sieh, wo die beiden auseinandergehen.",
      },
      faq: {
        q1: {
          q: "Ist {{appName}} dasselbe wie uncensored.ai?",
          a: "Nein. Wir sind eine eigenständige Open-Source-Plattform. Wir nutzen das Modell von uncensored.ai über dessen API, neben Modellen von Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter und den großen Laboren.",
        },
        q2: {
          q: "Ist uncensored.ai kostenlos?",
          a: "Es gibt einen Gratis-Tarif mit 3 Antworten pro Tag. Pro kostet $9.99 pro Monat oder $99.99 pro Jahr und hebt das Limit auf. Auf {{appName}} funktionieren {{guestCredits}} Gratis-Credits pro Monat ohne Konto.",
        },
        q3: {
          q: "Was macht das Modell von uncensored.ai anders?",
          a: "Die meisten unzensierten Modelle sind Mainstream-Modelle, denen die Verweigerungen herausgeschnitten wurden: gleiches Training, gleiches Weltbild. {{ownModel}} ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden, und vertritt deshalb politische Ansichten gegen den Mainstream.",
        },
        q4: {
          q: "Hat uncensored.ai eine API?",
          a: "Ja: eine OpenAI-kompatible API für $0.05 pro Inferenz, Credits werden separat gekauft. Auf {{appName}} ist dasselbe Modell über unsere OpenAI- und Anthropic-kompatible API abrufbar, nach jedem Tarif oder Credit-Kauf.",
        },
      },
      cta: { title: "Stell seine Sicht neben jedes andere Modell" },
    },
    openRouter: {
      meta: {
        title: "OpenRouter Alternative für Chat: {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter: fertige Chat-App gegen Entwickler-API-Router. Unzensierte Modelle, Gebühren, Datenschutz und API im Vergleich, mit Quellen.",
        keywords:
          "OpenRouter Alternative, OpenRouter Erfahrungen, OpenRouter Preise, OpenRouter Gebühren, OpenRouter unzensiert, OpenRouter deutsch, unzensierte KI API, OpenRouter alternative, OpenRouter vs, OpenRouter review, OpenRouter pricing, OpenRouter fees, OpenRouter uncensored, OpenRouter uncensored models, OpenRouter chat app, OpenRouter free models, OpenAI compatible API, uncensored LLM API, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "Ein Entwickler-Router mit 474 Modellen gegen eine Chat-App mit eingebauten unzensierten Modellen. Gebühren, Filter, Datenschutz und API.",
        readTime: "6 Min. Lesezeit",
      },
      intro: {
        lead: "OpenRouter ist die Standardantwort für einen API-Schlüssel und Hunderte Modelle. Wir nutzen es selbst. Aber es ist ein Router für Entwickler, keine Chat-App, und das unzensierte Angebot ist dünn. Wenn du eine OpenRouter-Alternative zum Chatten suchst, ist das der ehrliche Vergleich.",
        p2: "Fakten zu OpenRouter von Preisseite, Leitfaden zur Datenerfassung, AGB und öffentlicher Modellliste, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von OpenRouter: {{openRouterModels}} unserer Modelle laufen über die API von OpenRouter, darunter {{openRouterExamples}}. Wir ergänzen den Chat, die Medien und die unzensierten Anbieter, die OpenRouter nicht führt.",
      verdict:
        "Nimm OpenRouter, wenn du als Entwickler einen Schlüssel für 474 Modelle zu Anbieterpreisen mit Fallback-Routing willst und deine eigene Oberfläche mitbringst. Nimm {{appName}}, wenn du einen fertigen Chat mit {{uncensored}} unzensierten Modellen willst, darunter {{ownModel}} und abliterierte Builds, die OpenRouter nicht listet, plus Bilder, Video und Musik und eine API, wenn du sie brauchst.",
      themPros: {
        a: "474 Modelle in der öffentlichen Modellliste, zu Anbieterpreisen.",
        b: "Kein Abo. Gratis-Modelle mit 50 Anfragen pro Tag, 1.000, sobald du Credits für $10 gekauft hast.",
        c: "Prompt-Protokollierung und Nutzung deiner Daten sind beide Opt-in.",
      },
      themCons: {
        a: "5,5 % Gebühr auf Credit-Käufe im Standardtarif.",
        b: "Wenige unzensierte Modelle: Venice Uncensored plus Rollenspiel-Fine-Tunes wie Hermes 4 und Magnum. 142 der 474 Modelle sind als moderiert markiert.",
        c: "Kein Fokus auf Endnutzer-Chat: Die Oberfläche bringst du selbst mit.",
      },
      usPros: {
        a: "Ein fertiger Chat im Browser: kein Schlüssel, keine Einrichtung, {{guestCredits}} Gratis-Credits pro Monat ohne Konto.",
        b: "{{uncensored}} unzensierte Modelle von Venice, NanoGPT, uncensored.ai, FreedomGPT und Gab AI, freigeschaltet mit einer einmaligen 18+-Bestätigung.",
        c: "OpenAI- und Anthropic-kompatible API für Chat, Bilder, Video und Sprache auf demselben Guthaben.",
      },
      usCons: {
        a: "Kleinerer Katalog: {{modelCount}} Chatmodelle gegen 474 bei OpenRouter.",
        b: "Unser Aufschlag von {{markup}} % auf die Anbieterkosten liegt über der Gebühr von 5,5 % bei OpenRouter.",
        c: "In erster Linie als Chat gebaut: weniger Routing-Optionen als ein reiner Router.",
      },
      chooseThem: {
        a: "du eine App baust und einen Schlüssel für Hunderte Modelle willst.",
        b: "du Anbieter-Fallback und Routing-Optionen brauchst.",
        c: "jeder Cent pro Token zählt und du deine eigene Oberfläche hast.",
      },
      chooseUs: {
        a: "du chatten statt bauen willst: Seite öffnen und lostippen.",
        b: "du unzensierte Modelle willst, die OpenRouter nicht listet, etwa {{ownModel}}.",
        c: "du Chat, Bilder, Video und Musik auf einem Guthaben willst, mit einer API obendrauf.",
      },
      both: "Beides zu nutzen ist normal: OpenRouter in deinem Code, {{appName}} als Chat, in dem du unzensierte Modelle nebeneinander testest, bevor du eines einbindest.",
      switch: {
        title: "Umstieg von OpenRouter",
        body: "Als Chat-App: Starte einen Inkognito-Chat und wähl ein Modell, kein Schlüssel nötig. Im Code: Unsere API ist OpenAI-kompatibel. Du änderst also Base-URL und Schlüssel und prüfst die Modell-ID auf der jeweiligen Modellseite.",
      },
      faq: {
        q1: {
          q: "Gibt es eine OpenRouter-Alternative mit unzensierten Modellen?",
          a: "Ja. {{appName}} führt {{uncensored}} unzensierte Modelle von Venice, NanoGPT, uncensored.ai, FreedomGPT und Gab AI in einem Chat und einer API. NanoGPT und Venice verkaufen unzensierte Modelle ebenfalls per API. OpenRouter selbst listet nur wenige.",
        },
        q2: {
          q: "Erlaubt OpenRouter NSFW-Inhalte?",
          a: "Die AGB verlangen 18+, und OpenRouter prüft Eingaben auf bekanntes CSAM. Jeder Anbieter behält seine eigenen Regeln, und 142 der 474 Modelle in der Liste sind als moderiert markiert. Ob eine Anfrage durchgeht, hängt also von Modell und Anbieter ab.",
        },
        q3: {
          q: "Was kostet OpenRouter?",
          a: "Listenpreise der Anbieter pro Token, plus 5,5 % Gebühr auf Credit-Käufe im Standardtarif. Es gibt kein Abo. Gratis-Modelle erlauben 50 Anfragen pro Tag, 1.000, sobald du Credits für $10 gekauft hast.",
        },
        q4: {
          q: "Kann ich meinen OpenRouter-Code mit {{appName}} nutzen?",
          a: "Ja, wenn er das OpenAI-Format nutzt: Richte ihn mit deinem {{appName}}-Schlüssel auf unsere Base-URL und verwende unsere Modell-IDs. Die API wird nach jedem Tarif (ab {{apiSubPrice}} pro Monat) oder einem Credit-Kauf freigeschaltet.",
        },
      },
      cta: { title: "Chatte mit den Modellen, die OpenRouter nicht führt" },
    },
  },
};
