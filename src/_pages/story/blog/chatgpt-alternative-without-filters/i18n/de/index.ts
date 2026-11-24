import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT ohne Filter: die unzensierte Alternative | {{appName}}",
    description:
      "ChatGPT-Alternativen mit weniger Ablehnungen vergleichen: {{appName}}, Venice, NanoGPT und lokale Apps. Mit Modellen, Limits und Datenschutzoptionen.",
    category: "Ratgeber",
    imageAlt: "{{appName}}: ChatGPT-Alternative ohne Filter",
    keywords:
      "ChatGPT-Alternative, ChatGPT-Alternative ohne Filter, unzensierte ChatGPT-Alternative, ChatGPT ohne Einschränkungen, ChatGPT ohne Zensur, KI-Chat ohne Filter, unzensierte KI, UncensoredLM, unzensierte KI für Politik, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Ratgeber",
    readTime: "7 Min. Lesezeit",
    title: "ChatGPT-Alternativen mit weniger Ablehnungen",
    subtitle:
      "Vergleiche auf {{appName}} Mainstream-Modelle, offene Modelle und unzensierte KI. Erfahre, was ein Modellwechsel im Chat ändert und was die Modelle kosten.",
  },
  intro: {
    lead: "ChatGPT nutzt die Schutzmechanismen von OpenAI. Auch auf {{appName}} behält GPT die Vorgaben seines Anbieters. Für einen Chat mit weniger Einschränkungen kannst du ein anderes Modell wählen. Auch dieses kann eine Anfrage ablehnen oder sich irren.",
    p2: "Auf {{appName}} stehen dir {{modelCount}} Chatmodelle in drei Inhaltsstufen zur Wahl. Alle nutzen dasselbe Guthaben.",
  },
  exists: {
    title: "Gibt es ChatGPT ohne Filter?",
    p1: "ChatGPT nutzt die Schutzmechanismen von OpenAI. Wählst du auf {{appName}} GPT, gelten weiterhin die Schutzvorgaben des Anbieters.",
    p2: "Für einen Chat mit weniger Einschränkungen kannst du auf {{appName}} ein Modell aus der Kategorie „Unzensiert“ wählen. Der Einstieg klappt als Gast direkt im Browser.",
  },
  tiers: {
    title: "Was heißt „ohne Filter“ konkret?",
    intro: "Jedes Modell hat eine Inhaltsstufe. Es gibt drei.",
    mainstream:
      "Mainstream ({{count}} Modelle). Es gelten die Schutzmechanismen des Anbieters.",
    open: "Offen ({{count}} Modelle). Welche Anfragen ein Modell ablehnt, hängt vom Modell ab.",
    uncensored:
      "Unzensiert ({{count}} Modelle). Diese Kategorie bündelt Modelle nach ihrem Umgang mit sensiblen Themen.",
    vendorRefusals:
      "Mit der Modellauswahl auf {{appName}} legst du fest, welches Modell antwortet. Dessen Schutzmechanismen gelten weiterhin.",
    twoKinds:
      "Bei manchen unzensierten Modellen verringert Abliteration oder Feintuning die Zahl der Ablehnungen. UncensoredLM wurde mit Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden. Das Modell vertritt dadurch politische Positionen abseits des Mainstreams. Prüfe seine Aussagen anhand deiner Quellen.",
    modelsLink: "Alle Modelle nach Filterstufe ansehen",
  },
  switch: {
    title: "Kann ich mitten im Chat das Modell wechseln?",
    intro:
      "Ja. Für die nächste Nachricht kannst du ein anderes Modell auswählen.",
    p1: "Wechsle das Modell in einer laufenden Unterhaltung, um den Verlauf zu behalten. Das neue Modell kann so viel davon berücksichtigen, wie in sein Kontextfenster passt.",
    p2: "Du kannst mit einem Modell einen Entwurf schreiben und im selben Chat ein anderes Modell um Überarbeitung bitten.",
    caveat:
      "Jedes Modell wendet seine eigenen Schutzmechanismen auf den Entwurf und deine nächste Anfrage an.",
  },
  picks: {
    title: "Welches Modell statt ChatGPT?",
    intro:
      "Entscheide nach der Aufgabe. Jeder Name führt zur Modellseite mit Preis und Eckdaten.",
    builtUncensored: {
      title: "Politik und Perspektiven",
      body: "UncensoredLM kann bei politischen und kontroversen Themen eine andere Perspektive bieten. Prüfe seine Aussagen anhand deiner Quellen.",
    },
    everyday: {
      title: "Alltagsaufgaben",
      body: "Teste diese Mainstream-Modelle für Texte, Programmierung und Analysen.",
    },
    open: {
      title: "Offene Modelle für Code und Denkaufgaben",
      body: "Teste diese offenen Modelle beim Programmieren und bei Denkaufgaben. Vergleiche ihre Antworten auf dieselbe Frage.",
    },
    unfiltered: {
      title: "Unzensierte Modelle für Analysen",
      body: "Teste diese Modelle für Analysen, Code oder längere Texte. Auch sie können Anfragen ablehnen.",
    },
    fiction: {
      title: "Rollenspiel und düstere Geschichten",
      body: "Für eine fortlaufende Geschichte lohnt sich der Vergleich der Kontextfenster. Prüfe auch, ob das Modell Bilder als Eingabe unterstützt.",
    },
    cheap: {
      title: "Günstigere Modelle",
      body: "Die geschätzten Kosten stehen auf der Modellseite. Längere Eingaben und Antworten können mehr Credits kosten.",
    },
    compare:
      "Vergleiche Preis, Kontextfenster und Funktionen der verfügbaren Modellpaare.",
    compareLink: "{{a}} mit {{b}} vergleichen",
    guideLink: "Zum Ratgeber über alle unzensierten Modelle",
  },
  privacy: {
    title: "Ist ein ungefilterter KI-Chat privat?",
    intro: "Kommt auf den Ordner an. Das passiert genau.",
    incognito:
      "Inkognito-Chats liegen im lokalen Speicher deines Browsers. Auf unseren Servern wird die Unterhaltung nicht gespeichert (generierte Medien speichern wir aus technischen Gründen vorübergehend). Browserdaten löschen, und sie ist weg.",
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
    free: "Kostenlos: {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} mit Gratis-Konto, {{maxCredits}} mit Konto und Newsletter. Genug, um mehrere Modelle mit deinen eigenen Prompts zu testen.",
    sub: "Monatstarife: vier Größen, ab {{subCredits}} Credits für {{subPrice}}.",
    pack: "Credit-Pakete: Aufstockung für Abonnenten, {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Karte, PayPal oder Krypto.",
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
      "Mainstream-Modelle behalten die Schutzmechanismen ihrer Anbieter. Auch unzensierte Modelle können eine Anfrage ablehnen.",
    responsibility:
      "Prüfe wichtige Aussagen, bevor du eine Antwort weitergibst oder danach handelst.",
  },
  faq: {
    filters: {
      q: "Kann ich die GPT-Schutzmechanismen in einer ChatGPT-Alternative abschalten?",
      a: "Auch auf {{appName}} behält GPT die Schutzmechanismen seines Anbieters. Wählst du ein unzensiertes Modell, antwortet ein anderes Modell mit eigenen Vorgaben.",
    },
    title: "Häufige Fragen",
    free: {
      q: "Ist {{appName}} kostenlos?",
      a: "Ohne Konto: {{guestCredits}} Gratis-Credits im Monat. Gratis-Konto: {{freeCredits}}. Konto plus Newsletter: {{maxCredits}}. Danach: ein Tarif, ab {{subPrice}} im Monat.",
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
    title: "Modell wählen und loschatten",
    subtitle:
      "Starte ohne Konto mit bis zu {{guestCredits}} Gratis-Credits im Monat.",
    chat: "Unzensierten KI-Chat testen",
    models: "Alle Modelle vergleichen",
  },
};
