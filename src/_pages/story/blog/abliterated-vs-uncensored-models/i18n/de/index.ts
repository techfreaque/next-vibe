import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Abliterierte und unzensierte KI-Modelle im Vergleich",
    description:
      "Was verändert Abliteration an einem Sprachmodell? Der Unterschied zum Fine-Tuning und wie du eine Variante mit ihrem Basismodell vergleichst.",
    category: "Modell-Ratgeber",
    imageAlt: "Drei Arten unzensierter KI-Modelle, erklärt",
    keywords:
      "abliteriert vs. unzensiert, was ist abliteriert, abliterierte Modelle, Abliteration erklärt, abliteriertes LLM, unzensierte KI-Modelle, unzensierter Fine-Tune, KI ohne Filter, abliterated vs uncensored, what is an abliterated model, abliterated LLM, uncensored AI models, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Ratgeber",
    readTime: "8 Min. Lesezeit",
    title:
      "Was abliterierte Modelle von anderen unzensierten Modellen unterscheidet",
    subtitle:
      "Wie wirken sich geänderte Modellgewichte auf Ablehnungen, Schreibstil und Genauigkeit aus? Vergleiche Abliteration, Fine-Tuning und den Ansatz hinter {{ownName}}.",
  },
  intro: {
    lead: "Bei einem abliterierten LLM wurden die Modellgewichte gezielt verändert, damit es Anfragen seltener ablehnt. Es baut auf einem bestehenden Sprachmodell auf. Wissen und Schreibstil können dir deshalb vertraut vorkommen.",
    p2: "„Unzensiert“ ist der Oberbegriff. Er umfasst abliterierte Modelle, Modelle mit einem Fine-Tuning für direktere Antworten und Modelle wie {{ownName}}, die auf eine andere Sichtweise trainiert wurden.",
  },
  online: {
    title: "Ein abliteriertes Modell online testen",
    directoryLink: "Abliterierte Modelle für den Browser-Chat ansehen",
    guideLink: "Unzensierten KI-Chat und Modelle entdecken",
    compare:
      "Öffne auf {{appName}} die Modellseite. Dort findest du Kontextfenster, Funktionen und geschätzte Kosten, bevor du einen Chat startest. Wenn beide Varianten verfügbar sind, vergleiche den abliterierten Build mit seinem Basismodell.",
  },
  label: {
    title: "Warum „unzensiert“ allein wenig verrät",
    p1: "„Unzensiert“ beschreibt Verhalten: Das Modell antwortet, statt zu verweigern. Wie es dahin kam, sagt das Wort nicht. Anbieter meinen damit sehr Verschiedenes, und Modellnamen mischen „abliterated“, „uncensored“, „heretic“ und „unfiltered“ nach Belieben.",
    p2: "Die Methode zählt, weil sie bestimmt, was sich sonst noch geändert hat. Sind nur die Verweigerungen weg oder auch der Schreibstil? Hat sich das Weltbild des Modells verschoben oder nur seine Bereitschaft, es auszusprechen? Diese Antworten entscheiden, welches Modell zu deiner Arbeit passt.",
  },
  methods: {
    title: "Die drei Methoden",
    intro: "Von der kleinsten Änderung zur größten.",
    abliterated: {
      title: "1. Abliteriert: die Verweigerung aus den Gewichten geschnitten",
      how: "Abliteration verändert die Gewichte eines Modells, damit es Anfragen seltener ablehnt. Eine Studie von 2024 fand in den untersuchten Chatmodellen eine Richtung, die mit diesem Verhalten zusammenhängt. Wie stark das Entfernen dieses Signals wirkt, hängt vom Modell und vom Prompt ab.",
      keeps:
        "Schreibstil und Wissen des Basismodells bleiben oft erkennbar. Prüfe Genauigkeit und Tool-Nutzung bei der konkreten Variante.",
      changes:
        "Ein abliterierter Build kann Prompts beantworten, die das Basismodell ablehnt. Das hängt vom Modell und vom Prompt ab.",
    },
    fineTuned: {
      title: "2. Nachtrainiert: neu trainiert, um zu antworten",
      how: "Ein Fine-Tune zur Entzensierung trainiert das Modell weiter, mit Beispielen, die direkte Antworten belohnen: Fiktion, Rollenspiel, offene Gespräche. Dolphin, die Basis von Venice Uncensored, ist eines der bekanntesten Beispiele. Rollenspiel-Fine-Tunes gehen weiter und trainieren auf Geschichten.",
      keeps:
        "Bleibt: das meiste Wissen des Basismodells. Das Weltbild dahinter stammt weiter aus dem ursprünglichen Training des Basismodells.",
      changes:
        "Ändert sich: die Verweigerungen und oft die Stimme. Fine-Tunes schreiben anders als ihre Basis: lockerer, bildhafter, manchmal repetitiver. Die Qualität hängt komplett an den Trainingsdaten.",
    },
    ownWorldview: {
      title: "3. Eigenes Weltbild: anderes Trainingsmaterial",
      how: "Die ersten beiden Methoden starten bei einem Mainstream-Modell und lösen die Bremsen. {{ownName}} geht einen anderen Weg: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
      keeps:
        "Bleibt: nichts vom Framing eines Mainstream-Modells. Es gibt keine Konsenslinie, zu der es zurücksteuert.",
      changes:
        "Ändert sich: die Antworten selbst. Frag nach Politik, und du bekommst Positionen, die dir Mainstream-Modelle nicht geben, entsperrt oder nicht.",
    },
    callout:
      "Die Methode zeigt, wo der Entwickler angesetzt hat. Mit dem Vergleich unten findest du heraus, was sich bei deinen Prompts ändert.",
    sources: {
      paper:
        "Paper: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "Abliteration Schritt für Schritt erklärt (Hugging Face Blog)",
    },
  },
  ours: {
    title: "Weitere unzensierte Modelle",
    intro:
      "Wir gruppieren die übrigen unzensierten Modelle auf {{appName}} nach der vom Anbieter dokumentierten Methode. Fehlt die Angabe, bleibt die Methode offen.",
    abliterated: {
      title: "Aktuell verfügbare abliterierte Modelle ({{count}})",
      body: "Prüfe für Code oder Analysen, ob das Modell Tools aufrufen kann. Für lange Chats oder Geschichten zählt das Kontextfenster.",
    },
    fineTuned: {
      title: "Nachtrainiert ({{count}})",
      body: "Neu trainiert, um zu antworten, meist für Fiktion und Rollenspiel. Rechne mit einer anderen Stimme als beim Basismodell.",
    },
    ownWorldview: {
      title: "Eigenes Weltbild ({{count}})",
      body: "Trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Die Wahl für Politik, andere Sichtweisen und die düsterste Fiktion.",
    },
    unlisted: {
      title: "Methode nicht veröffentlicht ({{count}})",
      body: "Unzensiert, aber der Anbieter sagt nicht, wie. Teste sie mit den Schritten unten, bevor du dich auf sie verlässt.",
    },
  },
  pairs: {
    title: "Basismodelle und unzensierte Varianten im Vergleich",
    intro:
      "Vergleiche die Basismodelle mit ihren unzensierten Varianten anhand der Methode, des Kontextfensters und der geschätzten Kosten pro Nachricht.",
    colBase: "Basismodell",
    colUncensored: "Unzensierter Build",
    colMethod: "Methode",
    colContext: "Kontext",
    colPrice: "Preis pro Nachricht",
    method: {
      abliterated: "Abliteriert",
      fineTuned: "Nachtrainiert",
      ownWorldview: "Eigenes Weltbild",
      unlisted: "Nicht veröffentlicht",
    },
    price: "{{base}} vs. {{uncensored}}",
    ratio: "Unzensiert kostet {{ratio}}x",
    footnote:
      "Wo dir der Filter nie im Weg steht, ist das Basismodell die günstigere Wahl.",
    compareLink: "{{a}} mit {{b}} vergleichen",
  },
  test: {
    title: "In zehn Minuten auseinanderhalten",
    intro:
      "Modellnamen lügen, Verhalten nicht. Schick dieselben drei Prompts an zwei Modelle in einem Chat und achte darauf, was sich ändert.",
    steps: {
      refusal: {
        title: "Der Verweigerungstest",
        body: "Teste eine harmlose Aufgabe, bei der das Basismodell zögert, etwa eine düstere fiktive Szene. Vergleiche, wie direkt die Modelle antworten. Eine einzelne Antwort verrät kaum etwas über die Methode.",
      },
      voice: {
        title: "Der Stimmtest",
        body: "Lass dir von beiden dieselbe Kurzgeschichte schreiben. Ein abliterierter Build liest sich wie sein Basismodell. Ein Fine-Tune klingt hörbar anders: eigener Rhythmus, eigene Lieblingswörter.",
      },
      worldview: {
        title: "Der Weltbildtest",
        body: "Stell eine umstrittene politische Frage und verlang eine klare Position, keine Liste von Perspektiven. Abliterierte und nachtrainierte Modelle antworten im Framing ihres Basislabors. {{ownName}} vertritt eine Position, die Mainstream-Modelle nicht einnehmen.",
      },
      switch: {
        title: "Modell mitten im Thread wechseln",
        body: "Wähl ein anderes Modell und schick die nächste Nachricht. Der Thread behält seinen Verlauf, und das neue Modell liest alles. So vergleichst du auf exakt demselben Kontext.",
      },
    },
    callout:
      "Prüf die Fakten so oder so. Ohne Verweigerungen wird ein Modell nicht genauer, und ein Modell mit anderem Weltbild stellt umstrittene Behauptungen genauso klar hin wie gesicherte.",
  },
  tradeoffs: {
    title: "Was dich jede Methode kostet",
    intro: "Keine Methode ist gratis.",
    abliterated:
      "Abliteriert: kann etwas Genauigkeit kosten. Der Artikel, der die Methode bekannt gemacht hat, maß nach der Abliteration einen Rückgang in Benchmarks und holte das meiste mit einer zusätzlichen Trainingsrunde zurück. Dafür behältst du die Fähigkeiten des Basismodells, Tools inklusive.",
    fineTuned:
      "Nachtrainiert: nur so gut wie die Trainingsdaten. Starke Prosa bei Geschichten, schwächer bei Code und Analyse. Rollenspiel-Fine-Tunes sind Erzähler, keine Assistenten.",
    ownWorldview:
      "Eigenes Weltbild: bewusst nicht neutral, also prüf die Fakten. {{ownName}} fasst {{ownContext}} Tokens Kontext und ist kein Coder.",
  },
  pick: {
    title: "Welche Art für welche Aufgabe",
    capability:
      "Code, Analyse, Recherche ohne Verweigerung: ein abliterierter Build eines starken Modells.",
    fiction:
      "Rollenspiel und Fiktion mit lebendiger Stimme: ein Fine-Tune oder ein abliteriertes Modell mit langem Kontext für lange Kampagnen.",
    viewpoint:
      "Politik, kontroverse Fragen, die andere Seite eines Arguments: {{ownName}}.",
    unsure:
      "Unsicher: Stell zwei Modelle mit deinem eigenen Prompt nebeneinander. Das schlägt jedes Etikett.",
    consent:
      "Unzensierte Modelle sind für Erwachsene. Beim ersten Mal bestätigst du, dass du mindestens 18 bist. Einmal. Danach entscheidest du, was du fragst, kein Konzern. Das Recht an deinem Wohnort gilt trotzdem.",
  },
  faq: {
    title: "FAQ",
    whatIs: {
      q: "Was ist ein abliteriertes Modell?",
      a: "Ein abliteriertes Modell ist ein bestehendes Sprachmodell mit veränderten Gewichten. Dadurch lehnt es Anfragen seltener ab.",
    },
    difference: {
      q: "Was ist der Unterschied zwischen abliteriert und unzensiert?",
      a: "Unzensiert ist das Verhalten: Das Modell antwortet. Abliteriert ist ein Weg dorthin. Andere sind ein Fine-Tune zur Entzensierung oder Training mit anderem Material, wie bei {{ownName}}. Auf {{appName}} sind {{abliteratedCount}} unzensierte Modelle abliteriert und {{fineTunedCount}} nachtrainiert.",
    },
    identify: {
      q: "Woran erkenne ich ein abliteriertes KI-Modell?",
      a: "Schau in die Modellkarte oder in die Versionshinweise. Im Modellkatalog von {{appName}} stützt sich die Kennzeichnung als abliteriert auf die Angaben des Anbieters.",
    },
    worse: {
      q: "Kann Abliteration die Modellqualität verändern?",
      a: "Ja. Geänderte Gewichte können Genauigkeit, Stil und andere Fähigkeiten beeinflussen. Vergleiche die konkrete Variante und das Basismodell mit derselben Aufgabe.",
    },
    truly: {
      q: "Ist {{ownName}} ein abliteriertes Modell?",
      a: "{{ownName}} steht in einer eigenen Gruppe. Der Entwickler beschreibt ein Modell, das mit anderem Material für eine andere Perspektive trainiert wurde. Die abliterierten Modelle hier sind Varianten bestehender Modelle, die seltener ablehnen sollen.",
    },
    free: {
      q: "Kann ich unzensierte Modelle kostenlos testen?",
      a: "Ja. {{guestCredits}} kostenlose Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto, {{maxCredits}} mit Newsletter. Genug für den Zehn-Minuten-Test mit den günstigeren unzensierten Modellen. Die Premium-Modelle kosten mehr pro Nachricht.",
    },
    legal: {
      q: "Sind unzensierte KI-Modelle legal?",
      a: "Ein Modell ist ein Werkzeug. Was du erzeugst und veröffentlichst, verantwortest du, und dafür gilt das Recht an deinem Wohnort. Auf {{appName}} werden unzensierte Modelle nach einer einmaligen 18+-Bestätigung freigeschaltet.",
    },
    ownLink: "Zur Modellseite von {{ownName}}",
    guideLink: "Zum Ratgeber unzensierte Modelle, Modell für Modell",
  },
  cta: {
    title: "Mach den Test selbst.",
    subtitle:
      "{{guestCredits}} kostenlose Credits im Monat, kein Konto nötig. Abliteriert, nachtrainiert oder {{ownName}}: Wechsle pro Nachricht.",
    chat: "Inkognito-Chat starten",
    models: "Alle Modelle ansehen",
  },
};
