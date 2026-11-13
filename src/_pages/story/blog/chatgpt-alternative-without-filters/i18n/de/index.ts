import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT-Alternative ohne Filter | {{appName}}",
    description:
      "Die ChatGPT-Alternative ohne Filterzwang: {{modelCount}} Modelle von Mainstream bis unzensiert. Den Filtergrad wählst du pro Chat. Kostenlos, ohne Konto.",
    category: "Ratgeber",
    imageAlt: "{{appName}}: ChatGPT-Alternative ohne Filter",
    keywords:
      "ChatGPT-Alternative, ChatGPT-Alternative ohne Filter, unzensierte ChatGPT-Alternative, ChatGPT ohne Einschränkungen, ChatGPT ohne Zensur, KI-Chat ohne Filter, unzensierte KI, UncensoredLM, unzensierte KI für Politik, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Ratgeber",
    readTime: "7 Min. Lesezeit",
    title: "ChatGPT-Alternative ohne Filter. Den Filtergrad bestimmst du.",
    subtitle:
      "Claude, GPT und Gemini neben offenen und unzensierten Modellen, alles in einem Chat auf {{appName}}. Ehrlich erklärt: was sich ändert, was bleibt und was es kostet.",
  },
  intro: {
    lead: "Du stellst eine normale Frage. ChatGPT antwortet mit Disclaimer, Belehrung oder höflicher Absage. Ein medizinisches Detail, eine Szene für den Krimi, eine Sicherheitsfrage, eine politische Position abseits des Konsenses. Die Ablehnung ist eine Richtlinienentscheidung, getroffen für dich, bevor du ein Wort getippt hast.",
    p2: "So sieht eine ungefilterte Alternative auf {{appName}} tatsächlich aus: {{modelCount}} Modelle, drei Filterstufen, ein Guthaben. Was sie gut kann, wo sie an Grenzen stößt und wann ChatGPT trotzdem die bessere Wahl ist.",
  },
  exists: {
    title: "Gibt es ChatGPT ohne Filter?",
    p1: "Nicht von OpenAI. GPT-Modelle folgen den Nutzungsrichtlinien von OpenAI, egal wo sie laufen. Claude und Gemini folgen den Regeln ihrer eigenen Anbieter. Wer ein ungefiltertes GPT verspricht, verspricht zu viel.",
    p2: "Eine echte Alternative stellt andere Modelle daneben. {{appName}} bietet die Mainstream-Modelle und im selben Chat offene Modelle mit leichten Filtern sowie unzensierte Modelle ganz ohne. Eines davon, UncensoredLM, wurde von Grund auf unzensiert gebaut. Welches antwortet, entscheidest du.",
  },
  tiers: {
    title: "Was heißt „ohne Filter“ konkret?",
    intro: "Jedes Modell hat eine Inhaltsstufe. Es gibt drei.",
    mainstream:
      "Mainstream ({{count}} Modelle): Claude, GPT, Gemini, Mistral. Sicherheitsfilter der großen Labs. Heikle Themen lehnen sie ab.",
    open: "Offen ({{count}} Modelle): DeepSeek, Kimi, GLM, Qwen, Grok, MiniMax und weitere. Leichte Filter. Die meisten kontroversen Themen gehen sie an.",
    uncensored:
      "Unzensiert ({{count}} Modelle): UncensoredLM, von Grund auf unzensiert gebaut. Dazu Venice sowie unzensierte Varianten von GLM, Qwen, Gemma und DeepSeek: bestehende Modelle, denen die Verweigerungen entfernt wurden. Kein Filter. Die Grenzen setzt du.",
    vendorRefusals:
      "Mainstream-Modelle behalten auch hier die Filter ihres Anbieters. GPT lehnt auf {{appName}} ab, was GPT überall ablehnt. Der Unterschied ist, was daneben zur Wahl steht.",
    twoKinds:
      "Unzensiert gibt es in zwei Ausprägungen. UncensoredLM hat sein Labor vom ersten Trainingslauf an unzensiert trainiert. Fragst du nach Politik oder einem Tabuthema, antwortet es in deinem Rahmen, ohne Belehrung und ohne dich zur Konsenslinie zurückzulotsen. Jedes andere unzensierte Modell war zuerst ein Mainstream- oder offenes Modell, dem die Verweigerungen nachträglich entfernt wurden. Es sagt nicht mehr nein. Trainingsdaten und Grundhaltung des Ursprungslabors bleiben aber. Bei Politik kann es weiter einseitig gewichten, ausweichen oder die Sicht des Basismodells übernehmen. Uneingeschränkt heißt nicht neutral.",
    modelsLink: "Alle Modelle nach Filterstufe ansehen",
  },
  switch: {
    title: "Kann ich mitten im Chat das Modell wechseln?",
    intro: "Ja. Das Modell wählst du pro Nachricht, nicht pro Konto.",
    p1: "Du startest einen Thread mit Claude und bekommst eine Absage. Du wählst ein unzensiertes Modell und schickst die nächste Nachricht. Der Verlauf bleibt erhalten, und das neue Modell liest ihn komplett mit.",
    p2: "Das funktioniert auch umgekehrt. Entwurf mit einem unzensierten Modell, Feinschliff und Struktur danach mit einem Frontier-Modell.",
    caveat:
      "Der Filter steckt im Modell, nicht im Thread. Ein Mainstream-Modell kann einen unzensierten Entwurf trotzdem ablehnen, wenn es weiterschreiben soll.",
  },
  picks: {
    title: "Welches Modell statt ChatGPT?",
    intro:
      "Entscheide nach der Aufgabe. Jeder Name führt zur Modellseite mit Preis und Eckdaten.",
    builtUncensored: {
      title: "Politik und Tabufragen: von Grund auf unzensiert",
      body: "UncensoredLM ist das einzige Modell hier, das sein Labor von Anfang an unzensiert trainiert hat. Politische, kontroverse und tabuisierte Fragen bekommen eine klare Antwort in dem Rahmen, den du vorgibst. Keine Moralpredigt, kein Zurücklenken auf den Konsens. Der Haken: 32K Kontext, nur Text, nichts für Code, und umstrittene Behauptungen klingen bei ihm so sicher wie belegte. Prüf die Fakten, die es dir liefert.",
    },
    everyday: {
      title: "Alltagsarbeit, Mainstream-Filter",
      body: "Texte, Recherche, Code, Analyse. Am nächsten an ChatGPT, mit derselben Art von Filtern.",
    },
    open: {
      title: "Stark, mit weniger Absagen",
      body: "Leistungsstarke offene Modelle mit leichten Filtern. Sie beantworten das meiste, dem Mainstream-Modelle ausweichen, und überzeugen bei Code und Logik.",
    },
    unfiltered: {
      title: "Keine Absagen, echtes Denkvermögen",
      body: "Die Schwergewichte unter den Modellen mit entfernten Verweigerungen. Starke Basismodelle ohne Absagereflex: Code, Analyse und lange Texte zu Themen, bei denen andere Modelle abblocken. Die Grundhaltung des Basismodells bleibt, für Politik daher zuerst UncensoredLM.",
    },
    fiction: {
      title: "Fiktion und Rollenspiel",
      body: "Düstere Szenen, Erotik, Figuren, die ihre Stimme halten. Erzähler, keine Analysten.",
    },
    cheap: {
      title: "Günstig und schnell",
      body: "Viel Volumen für wenig Geld. Drei Flash-Modelle ohne Verweigerungen, dazu Claude Haiku, wenn ein Filter nicht stört.",
    },
    compare:
      "Unentschlossen zwischen zwei Modellen? Preis, Kontextfenster und Fähigkeiten im direkten Vergleich. Am aufschlussreichsten: UncensoredLM gegen das Modell hinter ChatGPT und gegen ein Flaggschiff ohne Verweigerungen.",
    compareLink: "{{a}} mit {{b}} vergleichen",
    guideLink: "Zum Ratgeber über alle unzensierten Modelle",
  },
  privacy: {
    title: "Ist ein ungefilterter KI-Chat privat?",
    intro: "Kommt auf den Ordner an. Das passiert genau.",
    incognito:
      "Inkognito-Chats liegen im lokalen Speicher deines Browsers. Auf unseren Servern wird die Unterhaltung nicht gespeichert. Browserdaten löschen, und sie ist weg.",
    transit:
      "Jede Nachricht läuft trotzdem über unseren Server zum Modellanbieter, der die Antwort schreibt. So funktioniert jede gehostete KI. Der Creditverbrauch wird für die Abrechnung erfasst.",
    memory:
      "Im Inkognito-Modus ist das Gedächtnis aus. Dauerhaftes Gedächtnis braucht ein kostenloses Konto und den privaten Ordner.",
    private:
      "Private Chats liegen auf dem Server und sind nur für dein Konto sichtbar. Du öffnest sie auf jedem Gerät, auf dem du angemeldet bist.",
    callout:
      "Kurz gesagt: Inkognito hält deinen Verlauf von unseren Servern fern. Vor dem Modell, das antwortet, verbirgt es deine Nachrichten nicht.",
  },
  pricing: {
    title: "Was kostet das?",
    intro: "Credits. Ein Guthaben für alle Modelle.",
    free: "Kostenlos: {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} nach der Anmeldung. Genug, um mehrere Modelle mit deinen eigenen Prompts zu testen.",
    sub: "Abo: {{subCredits}} Credits im Monat für {{subPrice}}.",
    pack: "Credit-Pakete: {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Per Karte oder Krypto.",
    oneBalance:
      "Dasselbe Guthaben deckt Bild-, Video- und Musikgenerierung, Spracheingabe und Sprachausgabe sowie die Websuche ab.",
    metered:
      "Jede Nachricht kostet Credits, abhängig vom Modell. Flash-Modelle kosten einen Bruchteil eines Frontier-Modells. Jede Modellseite zeigt den Preis.",
    link: "Abos und Credit-Pakete ansehen",
  },
  chatgptBetter: {
    title: "Wann ist ChatGPT die bessere Wahl?",
    intro: "Manchmal. Und zwar dann.",
    oneVendor:
      "Du nutzt nur OpenAI-Modelle und stößt nie auf eine Absage. Dann ist ein Anbieter, eine App, ein Abo einfacher.",
    flatRate:
      "Du willst einen Pauschalpreis und nie über Kosten pro Nachricht nachdenken. Credits werden nach Verbrauch abgerechnet, und intensive tägliche Nutzung von Frontier-Modellen summiert sich.",
    firstFeatures:
      "Du willst die neuesten App-Funktionen eines Labs am ersten Tag. Labs bringen neue Funktionen oft zuerst in ihre eigenen Apps.",
    wantFilter:
      "Du willst den Filter. Ein Kinderkonto oder ein Arbeitsplatz mit strengen Vorgaben braucht Leitplanken. Du kannst hier bei der Mainstream-Stufe bleiben, aber ein abgeriegeltes Produkt passt dann womöglich besser.",
  },
  limits: {
    title: "Wo liegen die Nachteile?",
    intro: "Ungefiltert hat seinen Preis. Kenne ihn, bevor du wechselst.",
    smaller:
      "Die meisten unzensierten Modelle sind kleiner als die Frontier-Modelle. Mehrere sind für Gespräch und Fiktion gebaut, nicht für harte Analyse. UncensoredLM ist für offene Antworten gebaut, nicht für Code. Bei den schwierigsten Denkaufgaben und langen Coding-Jobs liegen die stärksten Mainstream-Modelle weiter vorn.",
    tools:
      "Nicht jedes unzensierte Modell unterstützt Tool-Aufrufe. Prüf die Modellseite, bevor du dich auf Websuche oder andere Tools verlässt.",
    vendor:
      "Mainstream-Modelle behalten ihre eigenen Absagen. Sagt Claude nein, wechsle das Modell, statt mit ihm zu diskutieren.",
    responsibility:
      "Kein Filter heißt kein Sicherheitsnetz. Was du erzeugst und veröffentlichst, verantwortest du selbst, und das Recht deines Landes gilt weiterhin.",
  },
  faq: {
    title: "Häufige Fragen",
    free: {
      q: "Ist {{appName}} kostenlos?",
      a: "Ohne Konto bekommst du {{guestCredits}} kostenlose Credits im Monat, mit Konto {{freeCredits}}. Danach: ein Abo für {{subPrice}} im Monat oder ein Credit-Paket.",
    },
    account: {
      q: "Brauche ich ein Konto?",
      a: "Nein. Inkognito-Chats funktionieren ohne. Ein Konto brauchst du für das Gedächtnis und für Chats, die auf dem Server gespeichert werden.",
    },
    api: {
      q: "Kann ich die Modelle in eigenen Tools nutzen?",
      a: "Ja. Jeder bezahlte Plan enthält eine OpenAI-kompatible API. Ein Key, jedes Modell, die unzensierten eingeschlossen.",
    },
    openSource: {
      q: "Ist {{appName}} Open Source?",
      a: "Ja. Der Code steht unter MIT und GPL v3, und du kannst deine eigene Instanz betreiben.",
    },
    apiLink: "API in deinen Coding-Tools einrichten",
    selfHostLink: "Eigene Instanz betreiben",
  },
  partners: {
    body: "Du betreibst einen Kanal, Newsletter oder eine Community rund um KI? Das {{appName}}-Partnerprogramm zahlt dir einen wiederkehrenden Anteil an jeder vermittelten Zahlung.",
    link: "Zum Partnerprogramm",
  },
  cta: {
    title: "Filter wählen. Frage stellen.",
    subtitle:
      "{{guestCredits}} kostenlose Credits im Monat, kein Konto nötig. Mainstream, offen oder unzensiert: Wechsel jederzeit.",
    chat: "Ungefilterten Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
