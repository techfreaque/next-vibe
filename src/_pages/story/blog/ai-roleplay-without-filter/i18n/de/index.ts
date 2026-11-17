import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "KI-Rollenspiel ohne Filter: Character.AI-Alternative",
    description:
      "KI-Rollenspiel ohne Filter auf unzensierten Modellen. Düstere Szenen bleiben düster, Figuren bleiben in der Rolle. Gedächtnis, Datenschutz, Preis pro Antwort.",
    category: "Ratgeber",
    imageAlt: "{{appName}}: KI-Rollenspiel ohne Filter",
    keywords:
      "KI-Rollenspiel ohne Filter, Character AI Alternative, Character AI Alternative ohne Filter, unzensiertes KI-Rollenspiel, KI-Chat ohne Filter, NSFW-KI-Rollenspiel, Dark Roleplay KI, KI-Rollenspiel ohne Einschränkungen, KI-Charakter-Chat unzensiert, UncensoredLM, Venice Role Play, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Ratgeber",
    readTime: "8 Min. Lesezeit",
    title:
      "KI-Rollenspiel ohne Filter. Die Geschichte geht, wohin du sie führst.",
    subtitle:
      "{{uncensoredCount}} unzensierte Rollenspielmodelle neben den Mainstream-Modellen, auf einem Guthaben bei {{appName}}. Welches Modell eine Figur hält, welches sich an die ganze Kampagne erinnert, was eine Antwort kostet.",
  },
  intro: {
    lead: "Die Szene kam gerade in Fahrt. Dann tritt deine Figur aus der Geschichte und erklärt, dass sie hier nicht weitermachen kann. Ein Bösewicht, der sich plötzlich entschuldigt. Eine Horrorszene, die zum Sicherheitshinweis wird. Eine Romanze, die jedes Mal ausblendet. Bei Character.AI und den meisten Chatbots schreibt der Filter die letzte Zeile, nicht du.",
    p2: "Dieser Ratgeber zeigt, wie KI-Rollenspiel ohne Filter auf {{appName}} aussieht: {{modelCount}} Rollenspielmodelle im direkten Vergleich, welches zu düsterer Fiktion, langen Kampagnen oder kleinem Budget passt, wie das Gedächtnis funktioniert, wie du in zwei Minuten eine Figur anlegst und was eine Antwort kostet.",
  },
  exists: {
    title: "Gibt es Character.AI ohne Filter?",
    p1: "Nicht von Character.AI. Dort gilt ein Inhaltsfilter für alle, ohne Schalter zum Abstellen und ohne Bezahlstufe, die ihn entfernt. Jailbreak-Prompts sind ein Kampf, den du auf Dauer verlierst.",
    p2: "Die echte Alternative ist ein anderes Modell. {{appName}} betreibt unzensierte Modelle, die für Fiktion gebaut sind: keine Ablehnungen, keine moralischen Einschübe, keine Figur, die aus der Rolle fällt, um dich zu belehren. Du wählst das Modell pro Nachricht und kannst mitten in der Szene wechseln.",
    consent:
      "Unzensierte Modelle sind für Erwachsene. Beim ersten Mal bestätigst du, dass du mindestens 18 bist. Einmal. Danach entscheidest du, was in deiner Geschichte passiert, kein Konzern.",
  },
  levels: {
    title: "Was „ohne Filter“ im Rollenspiel heißt",
    intro: "Jedes Modell hat eine von drei Inhaltsstufen.",
    mainstream:
      "Mainstream: Claude, GPT, Gemini. Starke Erzähler, strenge Filter. Gewalt wird abgeschwächt, Intimität blendet aus, düstere Themen bekommen einen Warnhinweis.",
    open: "Offen: Kimi, MiniMax, DeepSeek, GLM. Leichte Filter. Die meisten erwachsenen Szenen funktionieren, die düstersten werden entschärft.",
    uncensored:
      "Unzensiert: kein Filter. Explizit, brutal, tabu: Die Szene läuft so, wie sie geschrieben ist.",
    twoKinds:
      "Unzensiert gibt es in zwei Arten. Die meisten unzensierten Modelle sind Mainstream-Modelle, denen die Ablehnungen herausgeschnitten wurden, per Abliteration oder Decensoring-Finetune. Sie sagen nicht mehr nein, behalten aber das Weltbild des Basismodells. Eine düstere Szene kann also trotzdem ins Harmlose kippen. {{ownName}} ist die andere Art: trainiert auf Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Ein eigenes Weltbild, nichts schiebt die Geschichte zurück auf sicheres Terrain.",
  },
  table: {
    title: "Die Rollenspielmodelle im direkten Vergleich",
    intro:
      "Live aus unserem Modellregister. Gedächtnis ist das Kontextfenster: wie viel der Geschichte das Modell vor jeder Antwort liest. 1 Credit = {{creditValue}}.",
    colModel: "Modell",
    colFilter: "Filterstufe",
    colMemory: "Gedächtnis",
    colImages: "Liest Bilder",
    colPrice: "Preis pro Antwort",
    memory: "{{context}} Tokens, etwa {{pages}} Seiten",
    yes: "Ja",
    no: "Nein",
    credits: "{{credits}} Credits",
    footnote:
      "Der Preis pro Antwort gilt für eine lange Szene: viel Geschichte rein, eine volle Antwort raus. Kurze Wechsel kosten weniger. Preise inklusive unseres Aufschlags, jeweils beim günstigsten Anbieter des Modells.",
  },
  models: {
    uncensoredLm: "Düster und tabu, eigenes Weltbild",
    artemis: "Rollenspiel-Finetune, langes Gedächtnis, günstig",
    veniceRoleplay: "Darauf trainiert, die Stimme einer Figur zu halten",
    deepseekFlash: "Kluge Plots, riesiges Gedächtnis",
    glmFlash: "Schnell und günstig, liest Bilder",
    venice: "Günstiger Allrounder",
    minimaxFlash: "Am günstigsten, offener Filter",
    kimi: "Vielschichtige Figuren, leichter Filter",
    sonnet: "Beste Prosa, Mainstream-Filter",
  },
  picks: {
    title: "Welches Modell für welche Geschichte",
    intro: "Fang bei der Szene an, die du schreiben willst.",
    dark: {
      title: "Düster, tabu, explizit",
      body: "{{ownName}} führt hier: keine entschärften Szenen, keine plötzlichen Moralpredigten. Die Grenze ist das Gedächtnis: {{ownContext}} Tokens, etwa {{ownPages}} Seiten. Lange Kampagnen verlieren also ihre ersten Kapitel. Artemis ist ein Rollenspiel-Finetune, der Grimdark und explizite Szenen geradeheraus schreibt, mit weit mehr Gedächtnis.",
    },
    long: {
      title: "Lange Kampagnen",
      body: "Wenn die Geschichte über Wochen läuft. Diese Modelle behalten frühe Szenen im Blick. DeepSeek V4.1 Flash Uncensored bringt echtes logisches Denken für Plots mit vielen Fäden. {{roleplayName}} hält die Stimme einer Figur über {{roleplayContext}} Tokens.",
    },
    cheap: {
      title: "Günstig, für viel Text",
      body: "Tägliche Gespräche mit einer Begleitfigur, schnelle Szenen, viele Neuversuche. {{cheapestName}} liefert hier die günstigste Antwort, mit offenem Filter. Die anderen beiden sind unzensiert.",
    },
    filtered: {
      title: "Vielschichtige Figuren, Filter stört nicht",
      body: "Langsam aufgebautes Drama, politische Intrigen, ein Krimi, dessen Hinweise aufgehen. Die stärksten Erzähler behalten ihre Filter und entschärfen die düstersten Momente. Nimm sie, wenn die Geschichte nicht dorthin muss.",
    },
    compareLink: "{{a}} mit {{b}} vergleichen",
  },
  memory: {
    title: "Erinnert sich die KI an meine Figur?",
    intro: "Es gibt zwei Arten von Gedächtnis. Beide zählen im Rollenspiel.",
    p1: "Das Kontextfenster ist das Kurzzeitgedächtnis: alles, was das Modell vor seiner Antwort erneut liest. {{longestName}} fasst {{longestContext}} Tokens, etwa {{longestPages}} Seiten Geschichte. {{ownName}} fasst {{ownContext}}, etwa {{ownPages}} Seiten. Wächst ein Thread über das Fenster hinaus, fallen die ältesten Szenen raus. Das Wichtigste (Namen, Beziehungen, die Regeln deiner Welt) gehört in die Figurenbeschreibung, dann geht es nie verloren.",
    p2: "Das Langzeitgedächtnis ist etwas anderes: Fakten, die sich die KI über dich merkt und in neuen Threads abruft. Dafür brauchst du ein kostenloses Konto und den privaten Ordner. Inkognito-Chats speichern nie Erinnerungen.",
  },
  setup: {
    title: "Eine Figur in zwei Minuten anlegen",
    intro:
      "Kein Figurenmarktplatz, keine Suche nach dem passenden Bot. Bau dir deine eigene.",
    steps: {
      skill: {
        title: "Den Rollenspiel-Skill öffnen",
        body: "Er sagt dem Modell: in der Rolle bleiben, die Stimme halten, nie deine Figur steuern, keine Inhaltswarnungen.",
      },
      variant: {
        title: "Variante wählen",
        body: "Uncensored nutzt {{uncensored}} für düstere und tabuisierte Szenen. Creative nutzt {{creative}}, die günstigste. Deep nutzt {{deep}} für Figuren mit Innenleben über lange Kampagnen.",
      },
      character: {
        title: "Figur und Szene beschreiben",
        body: "Name, Charakter, wie sie spricht, was sie will, wo die Geschichte beginnt. Sag, ob du in der ersten oder dritten Person schreibst. Dann machst du den ersten Zug.",
      },
      switch: {
        title: "Mitten in der Szene das Modell wechseln",
        body: "Ein Modell blockt oder wird blass? Nimm ein anderes und schick die nächste Nachricht. Der Thread behält seinen Verlauf, und das neue Modell liest alles.",
      },
      art: {
        title: "Figurenbilder dazunehmen",
        body: "Bitte im selben Chat um ein Porträt. Der Bildgenerator läuft über dasselbe Guthaben, unzensierte Bildmodelle inklusive.",
      },
    },
    skillLink: "Rollenspiel-Skill öffnen",
    imageLink: "Unzensierte Bildgeneratoren im Vergleich",
  },
  privacy: {
    title: "Bleibt mein Rollenspiel privat?",
    intro: "Kommt auf den Ordner an. So läuft es genau.",
    incognito:
      "Inkognito-Chats liegen im lokalen Speicher deines Browsers, nicht auf unseren Servern. Browserdaten löschen, und sie sind weg.",
    transit:
      "Jede Nachricht läuft trotzdem über unseren Server zum Modellanbieter, der die Antwort schreibt. So funktioniert jede gehostete KI. Der Credit-Verbrauch wird für die Abrechnung erfasst.",
    private:
      "Private Chats werden auf dem Server gespeichert und sind nur für dein Konto sichtbar, auf jedem Gerät, auf dem du eingeloggt bist.",
    callout:
      "Kurz gesagt: Inkognito hält deine Geschichte von unseren Servern fern. Vor dem Modell, das antwortet, verbirgt es sie nicht.",
  },
  pricing: {
    title: "Was Rollenspiel ohne Filter kostet",
    intro: "Credits pro Antwort. Ein Guthaben für alle Modelle.",
    perReply:
      "Jede Antwort kostet Credits, abhängig von Modell und Länge der Szene. Die Tabelle zeigt eine lange Szene. 1 Credit = {{creditValue}}.",
    cheapest:
      "Günstigste Antwort: {{cheapestName}} für {{cheapestPrice}}, rund {{cheapestPerUnit}} Antworten für {{unit}}. Günstigstes unzensiertes Modell: {{uncensoredName}} für {{uncensoredPrice}}, rund {{uncensoredPerUnit}} Antworten für {{unit}}.",
    free: "Kostenlos: {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto. Reicht für eine lange erste Kampagne auf einem günstigen Modell.",
    sub: "Monatstarife: vier Größen, ab {{subCredits}} Credits für {{subPrice}}.",
    pack: "Credit-Pakete: Aufstockung für Abonnenten, {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Karte, PayPal oder Krypto.",
    link: "Abos und Credit-Pakete ansehen",
  },
  characterAi: {
    title: "Wann Character.AI die bessere Wahl ist",
    intro: "Manchmal. Und zwar dann.",
    library:
      "Du willst durch Tausende fertige Community-Figuren stöbern. Hier baust du deine eigene oder startest mit einem Skill.",
    flatRate:
      "Du willst einen Festpreis und nie über Kosten pro Antwort nachdenken. Credits werden nach Verbrauch abgerechnet, und lange Szenen auf Premium-Modellen summieren sich.",
    wantFilter:
      "Du willst den Filter. Für jüngere Nutzer oder ein gemeinsames Familiengerät passt eine abgeriegelte App besser.",
    callout:
      "Ohne Filter heißt ohne Sicherheitsnetz. Was du schreibst und veröffentlichst, verantwortest du, und das Recht deines Landes gilt weiter.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Gibt es einen KI-Rollenspiel-Chat ohne Filter?",
      a: "Ja. {{appName}} betreibt unzensierte Modelle für Fiktion: {{ownName}}, Artemis, Venice Role Play und weitere. Keine Ablehnungen, keine Belehrungen, keine Figur, die aus der Rolle fällt. Eine einmalige Bestätigung, dass du volljährig bist, schaltet sie frei.",
    },
    free: {
      q: "Ist KI-Rollenspiel ohne Filter kostenlos?",
      a: "Der Einstieg ist kostenlos: {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto. Eine Antwort auf {{uncensoredName}} kostet in einer langen Szene rund {{uncensoredCredits}} Credits. Danach: ein Tarif, ab {{subPrice}} im Monat.",
    },
    nsfw: {
      q: "Geht NSFW-Rollenspiel?",
      a: "Ja, mit den unzensierten Modellen, als Erwachsener, der das einmal bestätigt hat. Fiktion unter Erwachsenen ist deine Sache. Sexuelle Inhalte mit Minderjährigen sind strafbar und bleiben es.",
    },
    memory: {
      q: "Wie lange läuft ein Rollenspiel, bevor die KI vergisst?",
      a: "Bis zu {{longestContext}} Tokens mit {{longestName}}, etwa {{longestPages}} Seiten. {{ownName}} fasst etwa {{ownPages}} Seiten. Schreib das Wichtigste in die Figurenbeschreibung, dann bleibt es im Gedächtnis.",
    },
    private: {
      q: "Kann jemand mein Rollenspiel lesen?",
      a: "Inkognito-Chats bleiben in deinem Browser. Private Chats sieht nur dein Konto. Die Nachrichten laufen trotzdem zum Modellanbieter, der die Antwort schreibt.",
    },
    account: {
      q: "Brauche ich ein Konto?",
      a: "Nein. Inkognito-Rollenspiel geht ohne. Ein kostenloses Konto brauchst du für das Langzeitgedächtnis und für Chats, die geräteübergreifend gespeichert sind.",
    },
    guideLink: "Ratgeber zu allen unzensierten Modellen",
    chatgptLink: "ChatGPT-Alternative ohne Filter",
  },
  partners: {
    body: "Du betreibst eine Rollenspiel-Community, einen Discord oder einen Kanal über KI-Figuren? Das Partnerprogramm von {{appName}} zahlt dir einen wiederkehrenden Anteil an jeder vermittelten Zahlung.",
    link: "Zum Partnerprogramm",
  },
  cta: {
    title: "Figur wählen. Szene schreiben.",
    subtitle:
      "{{guestCredits}} kostenlose Credits im Monat, ohne Konto. Unzensiert, offen oder Mainstream: jederzeit wechseln.",
    start: "Rollenspiel starten",
    models: "Alle Modelle vergleichen",
  },
};
