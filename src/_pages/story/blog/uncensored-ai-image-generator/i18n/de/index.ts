import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "KI-Bildgenerator ohne Zensur, Preis pro Bild | {{appName}}",
    description:
      "{{uncensoredCount}} unzensierte KI-Bildgeneratoren neben Flux, Seedream, GPT Image und Recraft: {{modelCount}} Modelle, echter Preis pro Bild, kein Weichzeichner. Auch zum Bearbeiten.",
    category: "Modellvergleich",
    imageAlt: "{{appName}}: unzensierte KI-Bildgeneratoren im Vergleich",
    keywords:
      "KI-Bildgenerator ohne Zensur, unzensierter KI-Bildgenerator, KI-Bildgenerator ohne Einschränkungen, KI-Bildgenerator ohne Filter, NSFW-KI-Bildgenerator, KI-Bildbearbeitung ohne Filter, Chroma, Lustify, Qwen Edit Uncensored, FLUX.3, Seedream 5.5, GPT Image, Recraft, KI-Bildgenerator Preis pro Bild, günstigster KI-Bildgenerator, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modellvergleich",
    readTime: "8 Min. Lesezeit",
    title: "KI-Bildgeneratoren ohne Zensur. Echte Preise, kein Weichzeichner.",
    subtitle:
      "{{modelCount}} Bildmodelle von {{labCount}} Anbietern auf einem Guthaben, {{uncensoredCount}} davon unzensiert. Was jedes kann, was ein Bild kostet und wo die Grenzen liegen.",
  },
  intro: {
    lead: "Ein ganz normaler Prompt. Zurück kommt ein verpixeltes, beschnittenes oder abgelehntes Bild. Eine Aktstudie, ein Horror-Cover, eine Szene aus deinem eigenen Roman. Die großen Bildgeneratoren filtern für den vorsichtigsten Nutzer der Welt, und du zahlst dafür jeden Monat.",
    p2: "{{appName}} betreibt {{modelCount}} Bildmodelle von {{labCount}} Anbietern, {{uncensoredCount}} davon unzensiert, alle auf einem Credit-Guthaben. Hier steht, welche Modelle wirklich ohne Filter generieren, alle Modelle im direkten Vergleich mit Filterstufe und echtem Preis pro Bild, die Empfehlung je Aufgabe und wie du Bilder direkt im Chat erzeugst oder bearbeitest.",
  },
  exists: {
    title: "Gibt es einen KI-Bildgenerator ohne Zensur?",
    intro:
      "Ja. {{uncensoredCount}} davon laufen hier, bereitgestellt über Venice.ai, ohne Weichzeichner und ohne Ablehnung. Zwei erzeugen Bilder aus Text, zwei bearbeiten ein Bild, das du hochlädst.",
    models: {
      lustify:
        "Fotorealistische Erwachsenenbilder. Gebaut für Körper und Haut. Schwach bei Schrift im Bild und komplexen Szenen.",
      chroma:
        "Offene Gewichte, ohne Inhaltsfilter nachtrainiert. Lange Prompts, große Stilbandbreite, explizite Inhalte inklusive.",
      qwenEdit:
        "Bildbearbeitung ohne Filter. Bild rein, Anweisung dazu: Outfit tauschen, Stil ändern, Szene umbauen.",
      fireRed:
        "Präzise Bearbeitung. Ändert genau das, was du beschreibst, und lässt den Rest des Bildes in Ruhe.",
      other:
        "Unzensiertes Bildmodell. Die Modellseite zeigt, wofür es am besten taugt.",
    },
    consent:
      "Unzensierte Modelle sind für Erwachsene. Beim ersten Mal bestätigst du, dass du mindestens 18 bist. Einmal. Danach entscheidest du, was du erstellst, kein Konzern.",
  },
  levels: {
    title: "Was die Filterstufen bei Bildern bedeuten",
    intro: "Jedes Bildmodell hat eine von drei Stufen.",
    mainstream:
      "Mainstream ({{mainstreamCount}} Modelle): OpenAI und Recraft. Strenge Filter. Stark bei Schrift und Design, unbrauchbar für alles, was eine Markensicherheitsabteilung beanstanden würde.",
    open: "Offen ({{openCount}} Modelle): FLUX, Seedream, Qwen, Grok Imagine, Wan und mehr. Lockerere Filter, gut für düstere Kunst und erwachsene Themen, aber nicht explizit.",
    uncensored:
      "Unzensiert ({{uncensoredCount}} Modelle): kein Filter von uns, keine Ablehnung beim Anbieter. Explizite Bilder bei den Modellen, die dafür gebaut sind.",
    p1: "Die Stufe wählst du pro Bild, nicht pro Konto. Sauberes Produktfoto? Offenes Modell. Die Szene, die deine Geschichte wirklich braucht? Unzensiertes Modell. Gleiches Guthaben, gleicher Chat.",
  },
  table: {
    title: "Alle {{modelCount}} Bildmodelle im direkten Vergleich",
    intro:
      "Erst unzensiert, dann offen, dann Mainstream. Innerhalb jeder Stufe das günstigste zuerst. Preise inklusive unserer {{markup}} % Aufschlag. 1 Credit = {{creditValue}}.",
    colModel: "Modell",
    colFilter: "Filterstufe",
    colInput: "Eingabe",
    colCredits: "Credits / Bild",
    colPrice: "Preis / Bild",
    inputText: "Text",
    inputEdit: "Text oder Bild",
    perUnit: "{{perUnit}} Bilder für {{unit}}",
    footnote:
      "„Text oder Bild“ heißt: Das Modell nimmt ein Referenzbild an, für Bearbeitung, Bild zu Bild und konsistente Figuren. Der Preis gilt für die Standardgröße, einige Modelle verlangen für größere Formate mehr. Modelle mit Abrechnung pro Token statt pro Bild stehen in der vollständigen Modellliste.",
    allModels: "Alle Modelle mit vollständigen Daten ansehen",
  },
  picks: {
    title: "Der beste KI-Bildgenerator für jede Aufgabe",
    intro:
      "Kein Modell gewinnt alles. Sechs Aufgaben, die passenden Modelle und die harten Fakten dazu.",
    factLine:
      "{{credits}} Credits ({{price}}) · {{perUnit}} für {{unit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "Ohne Filter: explizit und tabu",
      body: "Aus Text, nichts verpixelt. Chroma für Bandbreite: Illustration, Malerei, Fantasy, lange detaillierte Prompts. Lustify für fotorealistische Körper. Beide gehören zu den günstigsten Modellen der Plattform.",
    },
    uncensoredEdit: {
      title: "Ohne Filter: dein eigenes Bild bearbeiten",
      body: "Bild hochladen, Änderung beschreiben. Qwen Edit Uncensored ist das Modell, das ausdrücklich für explizite Ausgaben markiert ist. FireRed ist das präzisere. Bei schwierigen Änderungen beide probieren.",
    },
    cheap: {
      title: "Am günstigsten: Entwürfe und Masse",
      body: "Thumbnails, Moodboards, Prompt-Tests vor dem eigentlichen Rendern. {{cheapestName}} kostet {{cheapestCredits}} Credits, {{cheapestPerUnit}} Bilder für {{unit}}.",
    },
    quality: {
      title: "Höchste Detailtiefe: das finale Bild",
      body: "Wenn das Bild das Endprodukt ist. Schärfere Details, genauere Umsetzung des Prompts. Entwurf auf einem günstigen Modell, das finale Bild hier.",
    },
    text: {
      title: "Schrift im Bild: Poster, Logos, Werbung",
      body: "Die meisten Modelle verhunzen Buchstaben. Diese nicht. Recraft ist für Designarbeit gebaut. GPT Image hält dichte Layouts zusammen. Qwen Image 3 Pro ist die offene Variante. Alle sind gefiltert.",
    },
    references: {
      title: "Referenzbilder und konsistente Figuren",
      body: "Gleiches Gesicht, gleiches Produkt, Bild für Bild. Diese Modelle nehmen ein oder mehrere Referenzbilder an. Insgesamt akzeptieren {{editCount}} Modelle hier ein Bild als Eingabe.",
    },
  },
  chat: {
    title: "Bilder direkt im Chat erzeugen",
    intro:
      "Keine extra App. Frag in einem beliebigen Chat auf {{appName}}, und die KI ruft den Bildgenerator für dich auf.",
    steps: {
      ask: {
        title: "Beschreib das Bild",
        body: "Motiv, Stil, Licht, Bildausschnitt. In normalen Worten. Den Generierungs-Prompt schreibt die KI.",
      },
      model: {
        title: "Standardmodell nutzen oder eins nennen",
        body: "Die Bildeinstellung deines Skills wählt das Modell: {{defaultModel}}, solange du nichts änderst. Lieber ein anderes? Sag es einfach: „nimm FLUX.3“.",
      },
      edit: {
        title: "Bild anhängen und bearbeiten",
        body: "Bild in den Chat ziehen und sagen, was sich ändern soll. Dafür brauchst du ein Modell, das Bilder annimmt, etwa Qwen Edit Uncensored oder Seedream. Reine Textmodelle sehen dein Bild nicht.",
      },
      result: {
        title: "Ansehen, behalten",
        body: "Das Bild erscheint nach Sekunden im Chat und landet in deinem Speicher. Schreib weiter, um es zu verfeinern.",
      },
    },
    toolPage:
      "Volle Kontrolle? Auf der Seite des Bildgenerators stellst du Modell, Größe, Seitenverhältnis und Qualität direkt ein.",
    toolLink: "Bildgenerator öffnen",
    roleplayLink:
      "Figurenbilder für dein Rollenspiel: der Ratgeber zu KI-Rollenspiel ohne Filter",
  },
  pricing: {
    title: "Was ein KI-Bild hier kostet",
    intro: "Credits pro Bild. Ein Guthaben für alle Modelle.",
    perImage:
      "Jedes Modell hat einen Preis pro Bild: Anbieterpreis plus {{markup}} % Aufschlag, aufgerundet auf ein Zehntel Credit. 1 Credit = {{creditValue}}.",
    range:
      "Aktuell am günstigsten: {{cheapestName}} für {{cheapestPrice}}. Günstigstes unzensiertes Modell: {{uncensoredName}} für {{uncensoredPrice}}. Am teuersten: {{priciestName}} für {{priciestPrice}}.",
    failed:
      "Abgebucht wird erst, wenn das Bild da ist. Fehlgeschlagener Auftrag oder Ablehnung beim Anbieter: Du zahlst nichts.",
    free: "Kostenlos: {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto, {{maxCredits}} mit Newsletter. Mit {{uncensoredName}} sind das {{freeUncensoredImages}} Bilder im Monat, gratis.",
    sub: "Monatstarife: vier Größen, ab {{subCredits}} Credits für {{subPrice}}.",
    pack: "Credit-Pakete: Aufstockung für Abonnenten, {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Karte, PayPal oder Krypto.",
    link: "Abos und Credit-Pakete ansehen",
  },
  limits: {
    title: "Die Grenzen, ehrlich",
    intro: "Kenn die Schwachstellen, bevor du Credits ausgibst.",
    textOnly:
      "Die beiden unzensierten Generatoren nehmen nur Text an. Um ein vorhandenes Bild ohne Filter zu ändern, wechselst du zu einem unzensierten Bearbeitungsmodell.",
    specialists:
      "Unzensierte Modelle sind Spezialisten. Für Typografie, Logos und saubere Produktfotos sind die offenen und Mainstream-Modelle besser.",
    upstream:
      "Offene und Mainstream-Modelle laufen hinter der Moderation ihrer Anbieter. Lehnt eins ab, kostet das nichts. Wechsel zu einem unzensierten Modell, statt den Prompt umzuformulieren.",
    video:
      "Bei Video sieht es anders aus. Jedes Videomodell hier stammt von einem großen Anbieter, mit dessen Filtern. Unzensiert endet beim Standbild.",
    law: "Kein Filter heißt kein Sicherheitsnetz. Was du erstellst und veröffentlichst, verantwortest du, und das Recht deines Landes gilt weiter. Sexuelle Darstellungen Minderjähriger sind überall strafbar. In vielen Ländern auch sexuelle Bilder realer Personen ohne deren Einwilligung.",
    callout:
      "Erwachsene entscheiden selbst, was sie sich ansehen. Wir liefern Werkzeuge und Fakten, keine Belehrung.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Gibt es einen KI-Bildgenerator ohne Einschränkungen?",
      a: "Ja. {{appName}} betreibt {{uncensoredCount}} unzensierte Bildmodelle: Chroma und Lustify erzeugen Bilder aus Text, Qwen Edit Uncensored und FireRed bearbeiten deine eigenen Bilder. Kein Weichzeichner, keine Ablehnung. Eine einmalige Bestätigung, dass du volljährig bist, schaltet sie frei.",
    },
    free: {
      q: "Gibt es einen kostenlosen KI-Bildgenerator ohne Zensur?",
      a: "Der Einstieg ist kostenlos. {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto, {{maxCredits}} mit Newsletter. {{uncensoredName}} kostet {{uncensoredCredits}} Credits pro Bild. Danach: ein Tarif, ab {{subPrice}} im Monat.",
    },
    cheapest: {
      q: "Welcher KI-Bildgenerator ist am günstigsten?",
      a: "Aktuell {{cheapestName}} mit {{cheapestCredits}} Credits ({{cheapestPrice}}) pro Bild. Alle {{modelCount}} Preise stehen in der Tabelle oben, live aus unserem Modellregister.",
    },
    edit: {
      q: "Kann ich ein Foto ohne Filter bearbeiten?",
      a: "Ja. Bild im Chat anhängen, Änderung beschreiben und Qwen Edit Uncensored oder FireRed nennen. Offene und Mainstream-Bearbeitungsmodelle wenden die Filter ihrer Anbieter an.",
    },
    consent: {
      q: "Warum muss ich bestätigen, dass ich 18 bin?",
      a: "Unzensierte Modelle können explizite Inhalte erzeugen. Du bestätigst einmal, dass du volljährig bist, fertig. Kein Ausweis-Upload, keine wiederholten Warnhinweise.",
    },
    watermark: {
      q: "Haben die Bilder ein Wasserzeichen?",
      a: "Nicht von uns. Kein Logo, keine Einblendung. Manche Anbieter betten selbst unsichtbare Herkunftsdaten ein, das kommt vom Anbieter.",
    },
    api: {
      q: "Kann ich Bilder über die API erzeugen?",
      a: "Die {{appName}}-API deckt Chatmodelle im OpenAI- und Anthropic-Format ab. Bilder erzeugst du im Chat und auf der Seite des Bildgenerators.",
    },
    videoLink: "KI-Videogeneratoren im Vergleich",
    chatLink: "Ratgeber zu allen unzensierten Chatmodellen",
  },
  partners: {
    body: "Du betreibst einen Kanal oder eine Community rund um KI-Kunst? Das Partnerprogramm von {{appName}} zahlt dir einen wiederkehrenden Anteil an jeder vermittelten Zahlung.",
    link: "Zum Partnerprogramm",
  },
  cta: {
    title: "Modell wählen. Bild erzeugen.",
    subtitle:
      "{{guestCredits}} kostenlose Credits im Monat, ohne Konto. Unzensiert, offen oder Mainstream, pro Bild.",
    generate: "Bild erzeugen",
    models: "Alle Modelle ansehen",
  },
};
