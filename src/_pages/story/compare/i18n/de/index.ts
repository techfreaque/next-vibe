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
      "Venice, NanoGPT, Janitor AI, Character.AI, FreedomGPT, lokale Modelle und mehr: Preise, Filter, Datenschutz und API, mit Quellen",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Unzensierte KI-Plattformen im Vergleich",
    sectionIntro:
      "Venice, NanoGPT, Janitor AI, Character.AI, FreedomGPT und mehr: Preise, Filter und Datenschutz, direkt von ihren eigenen Seiten.",
  },
  platforms: {
    venice: {
      what: "Datenschutzorientierte KI-App mit großem Modellkatalog, vielen unzensierten Textmodellen, Bild-, Video- und Musikgenerierung, OpenAI-kompatibler API und einer Krypto-Staking-Ebene (VVV und DIEM).",
      pricingNote:
        "Gratis: 10 Text- und 15 Bild-Prompts pro Tag, nur Basismodelle. 100 Credits = $1. Video, Musik und Frontier-Modelle kosten zusätzlich Credits.",
      models:
        "420 Modelle in der Doku (148 Text). Rund 17 Textmodelle tragen das Label unzensiert, allen voran Venice Uncensored 1.2 (Dolphin Mistral 24B Venice Edition), dazu unzensierte GLM-, DeepSeek- und Qwen-Builds. Auch Claude, GPT, Gemini und Grok.",
      filterShort: "Mature Filter standardmäßig an, Pro kann ihn abschalten",
      filter:
        "Ein Mature Filter ist standardmäßig aktiv. Pro-Abonnenten schalten ihn in den Einstellungen ab. Ein optionaler Safe-Venice-Modus, per PIN gesperrt, blendet Charaktere und Bilder für Erwachsene aus.",
      privacyShort: "Chatverlauf bleibt auf deinem Gerät",
      privacy:
        "Laut Venice bleibt der Gesprächsverlauf auf deinem Gerät und wird nie auf den eigenen Servern gespeichert. Bei Drittanbieter-Modellen im Anonymous-Modus sollst du laut Venice davon ausgehen, dass der Anbieter deine Inhalte speichert.",
      apiShort: "",
      api: "OpenAI-kompatible API, Abrechnung pro Token in USD-Credits. Gestaktes DIEM bringt $1 API-Guthaben pro Tag. Bezahlung pro Anfrage ohne Konto mit USDC über x402.",
      forWho:
        "Datenschutzbewusste Nutzer, die unzensierten Chat und Medien in einer App wollen, dazu Entwickler und Krypto-Halter.",
      pro1: "Großer Katalog mit vielen unzensierten Textmodellen und günstigen API-Preisen für unzensierte Modelle.",
      pro2: "Der Verlauf bleibt standardmäßig auf deinem Gerät.",
      con1: "Knapper Gratis-Tarif: 10 Text-Prompts pro Tag auf Basismodellen.",
      con2: "Ohne Erwachsenenfilter und für die meisten Medien brauchst du Pro plus Credits.",
    },
    uncensoredAi: {
      what: "Unzensierte Chat-App mit einem einzigen Modell, Community-Forum und Dokumentenarchiven. Web, iOS und Android.",
      pricingNote:
        "Gratis: 3 Antworten pro Tag. Pro-Preise gelten lebenslang. Karte, Cash App, Apple Pay und Bitcoin. API-Credits gibt es separat für $0.05 pro Aufruf.",
      models:
        "Ein Modell: UncensoredAI v1.2, 32K Kontext. Basismodell und Trainingsdaten nennen die öffentlichen Seiten nicht.",
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
      con2: "Stark ideologisch geprägte Seite rund um das Modell: Archive und Landingpages zu Verschwörungsthemen.",
    },
    nanoGpt: {
      what: "Web-App und API mit Abrechnung nach Nutzung für Text-, Bild-, Video- und Audiomodelle. Kein Abo nötig, optionaler Tarif für offene Modelle.",
      pricingNote:
        "Aufladen ab $0.10 in Krypto oder $1 per Karte, keine Einzahlungsgebühren. Gratis: ein Modell, nur im Web. PRO umfasst nur Open-Source-Modelle: Claude, GPT, Gemini und Grok werden von deinem Guthaben abgebucht.",
      models:
        "631 Textmodelle in der öffentlichen API, rund 39 davon unzensiert oder abliteriert: Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 abliterated und mehr. Dazu Mainstream-Modelle.",
      filterShort: "Kein pauschales NSFW-Verbot, 18+",
      filter:
        "Die AGB verlangen 18+. Verboten sind CSAM, nicht einvernehmliche intime Bilder und sexuell explizite Deepfakes, nicht Erwachseneninhalte an sich.",
      privacyShort: "Chats im Browser, kein Konto nötig",
      privacy:
        "Gespräche liegen standardmäßig in deinem Browser, Cloud-Sync ist Opt-in. Laut NanoGPT werden Prompts und Antworten weder protokolliert noch aufbewahrt. Kein Konto nötig. Manche Anbieterrouten erlauben Training.",
      apiShort: "",
      api: "OpenAI-kompatible API, auch im Anthropic-Messages-Format, mit x402-Zahlungen ohne Konto. Jede Antwort liefert ihre Kosten mit.",
      forWho:
        "Nutzer mit Pay-per-Use und Entwickler, die jedes Modell, Krypto-Zahlung und kein Abo wollen.",
      pro1: "Riesige Modellliste, Listenpreise, Einstieg ab zehn Cent.",
      pro2: "Kein Konto nötig, Chats bleiben in deinem Browser.",
      con1: "Der Gratis-Tarif ist ein Modell im Web.",
      con2: "Der Datenschutz hängt von der gewählten Anbieterroute ab.",
    },
    openRouter: {
      what: "Entwickler-API, die einen Schlüssel auf Hunderte Modelle vieler Anbieter verteilt, abgerechnet pro Token aus vorausbezahlten Credits.",
      pricingNote:
        "Kein Abo. Listenpreise der Anbieter plus 5,5 % Gebühr auf Credit-Käufe. Gratis-Modelle: 50 Anfragen pro Tag, 1.000, sobald du Credits für $10 gekauft hast.",
      models:
        "474 Modelle, 17 gratis. Unzensierte Optionen sind rar: Venice Uncensored (Dolphin Mistral 24B, gehostet von Venice) und Rollenspiel-Fine-Tunes wie Hermes 4 und Magnum. 143 Routen sind als moderiert markiert.",
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
        "Gratis ohne Karte und ohne Konto. Pro enthält 2.200 Credits pro Monat: Eine Premium-Antwort kostet etwa 10, ein Bild etwa 25, ein 5-Sekunden-Video etwa 400.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral und mehr, dazu Liberty und weitere zensurfreie Modelle in derselben Liste. Keine Gesamtzahl veröffentlicht.",
      filterShort: "Zensurfreie Modelle, Regeln nach US-Recht und Ethik",
      filter:
        "Laut FreedomGPT müssen alle Nutzer und jedes gehostete Modell US-Recht einhalten, und die Modelle dürfen nicht für unethische Zwecke genutzt werden. Das Label zensurfrei verspricht nicht, dass jede Anfrage beantwortet wird.",
      privacyShort: "Nachrichten gehen an KI-Anbieter",
      privacy:
        "Laut Datenschutzerklärung werden Chatnachrichten, Sprachaufnahmen und Bilder an externe KI-Anbieter weitergegeben, um Antworten zu erzeugen. Keine Speicherdauer angegeben. Ohne Konto wird eine Cloud-Anfrage trotzdem nicht lokal.",
      apiShort: "",
      api: "API unter chat.freedomgpt.com/api/v1 mit einem Schlüssel aus dem Dashboard. Preise sind nicht dokumentiert.",
      forWho: "Wer ein Abo für viele Modelle mit zensurfreien Optionen will.",
      pro1: "Gratis-Start ohne Konto und ohne Karte.",
      pro2: "Bilder und Video in derselben App.",
      con1: "Weiterhin an US-Recht und eine Regel gegen unethische Nutzung gebunden.",
      con2: "Die Open-Source-Desktop-App wurde seit Juni 2024 nicht aktualisiert.",
    },
    gabAi: {
      what: "Multi-Modell-KI-Plattform von Gab mit über 200 Modellen, dem eigenen Modell Arya, einem Agentenmodus, Bild-, Video- und Musikgenerierung und Desktop-Apps. Offen rechts-christlich positioniert.",
      pricingNote:
        "Gratis: 250 Credits nach E-Mail-Bestätigung. Einmalige Credit-Pakete ab $10 für 700 Credits, verfallen nie.",
      models:
        "Rund 200 Modelle von 31 Anbietern: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi und mehr. Arya ist Gabs eigenes Modell, gebaut auf christlichen Werten und konservativen Prinzipien.",
      filterShort: "Unzensiert bei Meinungen, verbietet sexuelle Inhalte",
      filter:
        "Die AGB verlangen 18+ und verbieten obszöne, sexuell explizite oder pornografische Inhalte. Automatisierte Systeme können Inhalte auf Regelverstöße prüfen. Frei bei Politik, nicht bei Erwachseneninhalten.",
      privacyShort: "Chats gespeichert, zur Modellverbesserung genutzt",
      privacy:
        "Gab sieht deine Prompts und Antworten, speichert den Verlauf auf eigenen Servern und nutzt Inhalte zur Verbesserung seiner Modelle. Deine Identität bleibt laut Gab vor externen Modellanbietern verborgen.",
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
        "Gratis: unbegrenzte Chats auf Standardmodellen, rund 9K Tokens Kontext. janitor+ bringt 5x Charaktergedächtnis, Vorrang bei der Geschwindigkeit und mehr Modelle. Der Router rechnet andere Modelle pro Token ab, nur im Web, nur für Abonnenten.",
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
        "Keine enthalten. Verbindet sich mit lokalen Backends (KoboldCpp, llama.cpp, Ollama, text-generation-webui) und rund 16 Cloud-APIs, darunter OpenAI, Claude, Google, Mistral, DeepSeek, OpenRouter und jeder OpenAI-kompatible Endpunkt.",
      filterShort: "Kein eigener: Das Modell entscheidet",
      filter:
        "Kein eigener Filter. Die Grenzen setzt das angebundene Modell oder der Anbieter.",
      privacyShort: "Lokale Installation, kein Tracking",
      privacy:
        "Laut Projekt gibt es keine gehosteten Dienste und kein Tracking von Nutzerdaten. Chats liegen auf deinem Rechner. Was du an eine Cloud-API schickst, fällt unter die Richtlinie dieses Anbieters.",
      apiShort: "Verbindet sich mit APIs",
      api: "Ein Client, kein Anbieter. Er spricht mit der API, die du einrichtest.",
      forWho:
        "Power-User, die eine steile Lernkurve für volle Kontrolle über Prompts und Charaktere in Kauf nehmen.",
      pro1: "Maximale Kontrolle: jedes Backend, jeder Prompt, starke Erweiterungen.",
      pro2: "Gratis, Open Source, nichts verlässt deinen Rechner außer dem, was du an eine API schickst.",
      con1: "Du installierst und wartest es selbst und bringst das Modell mit.",
      con2: "Steile Lernkurve, so beschreibt es das Projekt selbst.",
    },
    characterAi: {
      what: "Die größte Mainstream-Plattform für Charakter-Chats, über 10 Mio. Charaktere auf eigenen Modellen, mit strengen Inhaltsregeln. Hier als gefiltertes Gegenstück dabei.",
      pricingNote:
        "Gratis: unbegrenzte Nachrichten mit Werbung. lite entfernt den Großteil der Werbung (US-Preis, variiert je nach Land). c.ai+ bringt die besten Chatmodelle, besseres Gedächtnis und keinen Slow Mode.",
      models:
        "Nur eigene Modelle, angeboten als Chat-Stile (PipSqueak, DeepSqueak, LongSqueak). Keine weitere Modellwahl, kein eigener Schlüssel.",
      filterShort: "Gefiltert, Pornografie wird nie unterstützt",
      filter:
        "Pornografische Inhalte verstoßen gegen die AGB und werden, so Character.AI wörtlich, auch in Zukunft zu keinem Zeitpunkt unterstützt. Jeder Nutzer durchläuft eine Altersprüfung über Persona. Wer als unter 18 verifiziert ist, bekommt nur den Lesemodus, keinen Chat.",
      privacyShort: "Chats können Modelle trainieren und Werbung steuern",
      privacy:
        "Laut Datenschutzerklärung werden Informationen zum Training der eigenen KI-Modelle und für personalisierte Werbung genutzt.",
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
        "Kein dauerhafter Gratis-Tarif: 50 Nachrichten zum Testen, danach nur Lesen. Ultra und MAX sind monatliche Add-ons obendrauf. Preise aus dem US App Store; laut Kindroid ist der Kauf im Web meist günstiger.",
      models:
        "Eigene Modelle (Polaris, Ember, Reverie und weitere) und eigene Selfie-Modelle. Kein eigener Schlüssel.",
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
      con1: "Nach 50 Nachrichten zahlst du, um weiterzureden.",
      con2: "Die besten Gedächtnisstufen summieren sich: Ultra und MAX zusätzlich zum Basistarif.",
    },
    nomi: {
      what: "KI-Companion-App rund um Langzeitgedächtnis: Freund, Partner oder Mentor, mit Selfies, Sprache und Gruppenchats.",
      pricingNote:
        "Gratis-Tarif mit täglichen Nachrichten und Bildern (Limits nicht veröffentlicht). Das Abo schaltet unbegrenzte Nachrichten und Sprache frei. Preise aus dem US App Store; keine öffentliche Web-Preisliste.",
      models:
        "Eigene Modelle, öffentlich nicht benannt. Kein eigener Schlüssel.",
      filterShort: "Text ungefiltert, Nacktfilter bei Bildern",
      filter:
        "Laut Website werden Gespräche nicht durch willkürliche Inhaltsfilter eingeschränkt. Bilder haben einen Nacktfilter, wegen App Stores und Zahlungsdienstleistern. Unter 18 ist die Nutzung nicht erlaubt.",
      privacyShort: "Nie verkauft, gelöscht mit deinem Konto",
      privacy:
        "Laut Datenschutzerklärung werden persönliche Daten nie verkauft oder vermietet und nach der Löschung deines Kontos nicht aufbewahrt (innerhalb von rund 28 Tagen).",
      apiShort: "Persönliche API zu deinen Companions",
      api: "REST-API, um mit deinen eigenen Nomis zu chatten, keine allgemeine Modell-API.",
      forWho:
        "Wer einen emotionalen, langfristigen Companion will, der sich erinnert.",
      pro1: "Gedächtnis gebaut für lange Beziehungen.",
      pro2: "Gratis-Tarif und eine klare Haltung: Daten werden nicht verkauft.",
      con1: "Nacktfilter bei Bildern.",
      con2: "Sprache nur im Abo, Gratis-Limits nicht veröffentlicht.",
    },
    crushOn: {
      what: "NSFW-Charakter-Chat mit Unfiltered-Schalter und per Credits abgerechnetem Zugang zu Drittanbieter-Modellen.",
      pricingNote:
        "Gratis: 100 Nachrichten-Credits pro Monat, unbegrenzt Gratis-Modelle, Verlauf wird nach 7 Tagen Inaktivität gelöscht. Jahrestarife sind günstiger. Pro-Modelle brauchen eine Mitgliedschaft oder ein separates Paket.",
      models:
        "Drittanbieter-Modelle je nach Stufe; die Website nennt Claude 4, Gemini 2.5 Flash, GPT-4.1 und DeepSeek V4. Vollständige Liste nur nach Login.",
      filterShort: "Unfiltered-Schalter nach Altersprüfung",
      filter:
        "Ein Unfiltered-Schalter schaltet Erwachsenentext nach einer Altersprüfung frei: Selfie oder Ausweis über Didit, AgeGo oder eine Zahlung von $0.99. Die Richtlinien verbieten trotzdem explizite sexuelle Bilder, realistische Bilder echter Personen, Minderjährige und künstlich älter gemachte Charaktere.",
      privacyShort: "Chats können Modelle trainieren",
      privacy:
        "Laut Datenschutzerklärung können Chatinhalte zum Training der eigenen Modelle genutzt werden, ohne Verknüpfung mit bestimmten Nutzern. Cookies dienen dem Retargeting von Werbung.",
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
      what: "Kostenloses Tool unter MIT-Lizenz, das offene Modelle auf deinen Rechner lädt und dort ausführt, mit lokaler API. Verkauft auch gehostete Cloud-Modelle.",
      pricingNote:
        "Modelle auf eigener Hardware laufen zu lassen ist gratis und unbegrenzt. Bezahltarife betreffen nur die Cloud-Modelle.",
      models:
        "Jedes offene Modell aus der Bibliothek, darunter Dolphin 3 und abliterierte Community-Uploads wie Qwen 3.8 abliterated. Community-Uploads prüft Ollama nicht.",
      filterShort: "Je nach geladenem Modell",
      filter:
        "Lokal kein eigener Filter. Ein abliteriertes Modell verweigert nicht. Ein Standardmodell behält die Verweigerungen aus seinem Training.",
      privacyShort: "Komplett lokal, Prompts verlassen nie deinen Rechner",
      privacy:
        "Laut Ollama sieht es bei lokaler Nutzung weder deine Prompts noch deine Daten. Die Cloud lässt sich komplett abschalten.",
      apiShort: "",
      api: "OpenAI-kompatibler Server auf localhost:11434, dazu eine Cloud-API für die gehosteten Modelle.",
      forWho:
        "Entwickler und technikaffine Nutzer mit leistungsstarkem Rechner, oft kombiniert mit einem Chat-Frontend.",
      pro1: "Volle Privatsphäre und null Kosten pro Nachricht.",
      pro2: "Riesige Bibliothek, OpenAI-kompatible lokale API.",
      con1: "Deine Hardware begrenzt die Qualität: Ein 70B-Modell ist schon ohne Kontext ein 43-GB-Download.",
      con2: "Vor allem CLI und API: Die Chat-Oberfläche ergänzt du selbst.",
    },
    lmStudio: {
      what: "Desktop-App mit polierter Oberfläche, um lokale Modelle (GGUF und MLX) zu laden und auszuführen, plus lokaler API-Server.",
      pricingNote:
        "Seit Juli 2025 gratis für privat und beruflich. Bezahltarife bringen gehostete Modelle und mehr Geräte.",
      models:
        "Lokale Modelle von Hugging Face, darunter abliterierte GGUF-Builds und Dolphin.",
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
        "{{count}} unzensierte KI-Plattformen im Vergleich: Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, lokale Modelle und mehr. Preise, Filter, Datenschutz, API. Mit Quellen.",
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
      p2: "Also haben wir nachgesehen. Preisseite, AGB, Datenschutzerklärung und API-Doku jeder Plattform, am {{date}}. Unten: eine schnelle Empfehlung pro Einsatzzweck, die komplette Tabelle, eine Karte pro Plattform mit Quellen und die Fälle, in denen du uns nicht nehmen solltest.",
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
        title: "Chats, die nie einen Server berühren: Venice oder NanoGPT",
        body: "Beide speichern den Verlauf standardmäßig in deinem Browser. NanoGPT braucht gar kein Konto. Auf {{appName}} machen Inkognito-Chats dasselbe.",
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
        body: "Jugendfrei by Design, mit Altersprüfung für alle. Die richtige Wahl für Teenager oder einen strengen Arbeitsplatz.",
      },
    },
    table: {
      title: "Alle {{count}} Plattformen und {{appName}} im direkten Vergleich",
      intro:
        "Auf dem Handy seitlich scrollen. Fakten zur Konkurrenz am {{date}} auf deren eigenen Seiten geprüft, unsere live aus unserer Konfiguration.",
      footnote:
        'Preise sind USD-Listenpreise von der jeweiligen Plattformseite; Kindroid und Nomi zeigen Preise erst nach dem Login an der Kasse, ihre stammen daher aus dem US App Store. Steuern, regionale Preise und Aktionen weichen ab. "Eingeschränkt" heißt: über ein Setup mit eigenem Schlüssel, ein Add-on oder eine persönliche Companion-API.',
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
        "Was sie ist, was sie kostet, wie sie filtert, wohin deine Chats gehen und ihre Quellen. Geprüft am {{date}}.",
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
        "Die fünf Plattformen, mit denen man uns am häufigsten vergleicht, jede auf einer eigenen Seite mit Stärken, Schwächen und einer klaren Empfehlung.",
    },
    method: {
      title: "So haben wir verglichen",
      intro: "Regeln, an die wir uns gehalten haben. Geprüft am {{date}}.",
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
        a: "Ein lokales Modell: Nichts verlässt deinen Rechner. Unter den gehosteten Diensten speichern Venice und NanoGPT den Verlauf standardmäßig in deinem Browser, NanoGPT braucht kein Konto. Auf {{appName}} bleiben Inkognito-Chats in deinem Browser. Jeder gehostete Dienst schickt deine Nachricht trotzdem an einen Modellanbieter.",
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
          "{{appName}} vs Venice.ai: Preise, unzensierte Modelle, Mature Filter, Datenschutz und API im direkten Vergleich. Wir kaufen bei Venice ein und sagen genau, wer wo vorne liegt.",
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
        a: "Größerer Katalog: 420 Modelle in der Doku, inklusive Video, Musik und Sprache.",
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
        c: "Private Chats liegen auf unseren Servern. Nur Inkognito-Chats bleiben in deinem Browser, Venice speichert den gesamten Verlauf lokal.",
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
          a: "Venice hat einen Gratis-Tarif mit 10 Text- und 15 Bild-Prompts pro Tag auf Basismodellen. Pro hebt die Limits auf und lässt dich den Mature Filter abschalten.",
        },
        q3: {
          q: "Ist Venice günstiger als {{appName}}?",
          a: "Bei den Venice-Modellen ja: Wir schlagen {{markup}} % auf die Anbieterkosten auf. Wenn du Modelle verschiedener Anbieter in einer App mischst, sparst du dir separate Abos.",
        },
        q4: {
          q: "Was ist privater, Venice oder {{appName}}?",
          a: "Venice speichert den gesamten Verlauf auf deinem Gerät. Auf {{appName}} machen Inkognito-Chats dasselbe; private Chats liegen auf unseren Servern, damit sie geräteübergreifend synchronisieren. Bei beiden geht deine Nachricht an einen Modellanbieter, um eine Antwort zu bekommen.",
        },
      },
      cta: { title: "Teste die Venice-Modelle neben allem anderen" },
    },
    characterAi: {
      meta: {
        title: "Character AI Alternative ohne Filter: {{appName}}",
        description:
          "{{appName}} vs Character.AI: Filter, Altersprüfung, Modelle, Datenschutz und Preis. Wann Character.AI die richtige Wahl ist und wann du eine unzensierte Alternative brauchst.",
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
        b: "Die Datenschutzerklärung erlaubt Training mit deinen Informationen und personalisierte Werbung.",
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
        b: "du unter 18 bist oder ein Konto für einen Teenager einrichtest.",
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
        b: "Bessere Modelle brauchen den janitor+ Router oder deinen eigenen API-Schlüssel samt Proxy-Setup.",
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
          a: "Das Gratis-Modell von Janitor hat rund 9K Tokens Kontext; janitor+ erweitert das Charaktergedächtnis. Auf {{appName}} hängt der Kontext vom gewählten Modell ab, und viele Rollenspiel-Modelle fassen deutlich mehr.",
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
          "{{appName}} vs NanoGPT: Pay-as-you-go gegen Tarife, unzensierte und abliterierte Modelle, Datenschutz, API und Medien. Wir kaufen bei NanoGPT ein und sagen, wo es vorne liegt.",
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
        lead: "NanoGPT ist die Pay-per-Use-Antwort auf KI-Abos: zehn Cent aufladen, jedes Modell nutzen, kein Konto. Mehrere unserer unzensierten Modelle laufen über die API von NanoGPT. Die echte Frage ist also nicht, was besser ist, sondern welches Modell zu deiner KI-Nutzung passt.",
        p2: "Fakten zu NanoGPT von den Preis-, Datenschutz- und AGB-Seiten und der öffentlichen Modellliste, geprüft am {{date}}. Unsere live aus unserer Konfiguration.",
      },
      relation:
        "Wir sind Kunde von NanoGPT: {{nanoGptModels}} unserer Modelle laufen über die API von NanoGPT ({{nanoGptUncensored}} davon unzensiert), darunter {{nanoGptExamples}}.",
      verdict:
        "Nimm NanoGPT für den breitesten Katalog zu Listenpreisen, Pay-per-Use ohne Konto und eine API für alles. Nimm {{appName}}, wenn du eine kuratierte, getestete Modellauswahl mit unzensierten Modellen mehrerer Anbieter willst, monatliche Gratis-Credits, Skills und Gedächtnis und eine Open-Source-App, die du selbst hosten kannst.",
      themPros: {
        a: "631 Textmodelle in der API, rund 39 unzensiert oder abliteriert.",
        b: "Kein Konto, kein Abo: Start ab zehn Cent in Krypto.",
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
        a: "du Pay-per-Use ohne Abo und ohne Konto willst.",
        b: "du ein exotisches Modell brauchst, das nur ein riesiger Katalog führt.",
        c: "du auf der API aufbaust und Listenpreise willst.",
      },
      chooseUs: {
        a: "du eine getestete Auswahl statt 631 Optionen willst.",
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
          a: "Nein. Es funktioniert mit einer generierten Nutzer-ID und speichert Chats standardmäßig in deinem Browser.",
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
  },
};
