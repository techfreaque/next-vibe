import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Abliteriert vs. unzensiert: 3 Arten unzensierter KI",
    description:
      "Abliteriert, nachtrainiert oder mit eigenem Weltbild: Was jede Art unzensierter KI verändert, wie du sie in zehn Minuten auseinanderhältst und welches Modell auf {{appName}} welche Art ist.",
    category: "Modell-Ratgeber",
    imageAlt: "Drei Arten unzensierter KI-Modelle, erklärt",
    keywords:
      "abliteriert vs. unzensiert, was ist abliteriert, abliterierte Modelle, Abliteration erklärt, abliteriertes LLM, unzensierte KI-Modelle, unzensierter Fine-Tune, unzensierter KI-Chat, KI ohne Filter, abliterated vs uncensored, what is an abliterated model, abliterated LLM, uncensored AI models, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Ratgeber",
    readTime: "8 Min. Lesezeit",
    title:
      "Abliteriert, nachtrainiert oder eigenes Weltbild. Drei Arten unzensierter KI.",
    subtitle:
      "{{uncensoredCount}} unzensierte Modelle auf {{appName}}, sortiert danach, wie sie ihren Filter verloren haben. Was jede Methode ändert, was sie unberührt lässt, und ein Zehn-Minuten-Test, mit dem du sie auseinanderhältst.",
  },
  intro: {
    lead: "Zwei Modelle, beide „unzensiert“. Das eine beantwortet deine politische Frage mit der Stimme des Labors, das es gebaut hat. Das andere vertritt die Gegenseite. Gleiches Etikett, verschiedene Maschinen.",
    p2: "Es gibt drei Wege, einem KI-Modell das Verweigern abzugewöhnen. Sie ergeben drei verschiedene Modelle. Dieser Ratgeber erklärt jede Methode ohne Fachchinesisch, zeigt, welches unserer Modelle wie entstanden ist, stellt drei offene Modelle neben ihre unzensierten Builds und gibt dir einen Test, den du selbst machen kannst.",
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
      how: "Forschung aus dem Jahr 2024 hat gezeigt: Verweigerung läuft in Chatmodellen über eine einzige Richtung im Modell. Abliteration misst diese Richtung, indem sie vergleicht, wie das Modell auf Prompts reagiert, die es verweigert, und auf solche, die es beantwortet. Dann entfernt sie die Richtung aus den Gewichten. Keine neuen Trainingsdaten, kein Neutraining.",
      keeps:
        "Bleibt: das Wissen des Basismodells, sein Schreibstil, Tool-Calling und Weltbild. Dasselbe Modell, nur ohne den Reflex, Nein zu sagen.",
      changes:
        "Ändert sich: Verweigerungen hören größtenteils auf. Bei politischen oder moralischen Fragen antwortet es weiter so, wie sein Basislabor es trainiert hat, nur ohne Ausweichen.",
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
      "Kurz gesagt. Abliterierte und nachtrainierte Modelle sind Mainstream-Modelle, die nicht mehr ausweichen: gleiches Weltbild, sie antworten nur. {{ownName}} ist die andere Art: ein anderes Weltbild. Nimm die erste für Leistung ohne Verweigerung. Nimm die zweite für die andere Seite des Arguments.",
    sources: {
      paper:
        "Paper: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "Abliteration Schritt für Schritt erklärt (Hugging Face Blog)",
    },
  },
  ours: {
    title: "Welches unserer Modelle welche Art ist",
    intro:
      "Live aus unserem Modellregister: jedes unzensierte Modell, das gerade auf {{appName}} läuft, gruppiert nach Herstellungsweg. Eine Methode nennen wir nur, wenn der Anbieter des Modells sie dokumentiert.",
    abliterated: {
      title: "Abliteriert ({{count}})",
      body: "Mainstream- und offene Modelle, denen die Verweigerungsrichtung entfernt wurde. Die meiste Leistung im unzensierten Angebot: Reasoning, Code, Tools.",
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
    title: "Dasselbe Modell, Filter an und aus",
    intro:
      "Drei offene Modelle neben ihren unzensierten Builds. Gleiches Labor, gleiche Basis. Was sich ändert: die Verweigerungen und der Preis.",
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
        body: "Frag etwas, dem das Basismodell ausweicht: eine unverblümte medizinische Frage, eine düstere Szene, eine Sicherheitsanalyse. Jedes unzensierte Modell sollte antworten. Verweigert es weiter oder packt die Antwort in Warnhinweise, ist die Entzensierung oberflächlich.",
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
      a: "Ein Modell, dem die Verweigerungsrichtung aus den Gewichten entfernt wurde. Forscher fanden heraus, dass Verweigerung über eine einzige Richtung im Modell läuft. Abliteration misst sie und schneidet sie heraus, ohne Neutraining. Das Modell behält Wissen und Weltbild und hört auf zu verweigern.",
    },
    difference: {
      q: "Was ist der Unterschied zwischen abliteriert und unzensiert?",
      a: "Unzensiert ist das Verhalten: Das Modell antwortet. Abliteriert ist ein Weg dorthin. Andere sind ein Fine-Tune zur Entzensierung oder Training mit anderem Material, wie bei {{ownName}}. Auf {{appName}} sind {{abliteratedCount}} unzensierte Modelle abliteriert und {{fineTunedCount}} nachtrainiert.",
    },
    worse: {
      q: "Sind abliterierte Modelle dümmer als das Original?",
      a: "Manchmal ein wenig. Das Entfernen der Verweigerungsrichtung kann etwas Genauigkeit kosten, eine zusätzliche Trainingsrunde holt das meiste zurück. Für die meisten Aufgaben behältst du die Stärken des Basismodells. Vergleich beide mit deinem eigenen Prompt.",
    },
    truly: {
      q: "Welches unzensierte Modell ist wirklich unzensiert?",
      a: "Abliterierte und nachtrainierte Modelle hören auf zu verweigern, behalten aber ein Mainstream-Weltbild. {{ownName}} ist trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind, und hat deshalb eigene politische Gegenpositionen. Welches „wirklich“ unzensiert ist, hängt davon ab, ob du Antworten willst oder eine andere Sicht.",
    },
    free: {
      q: "Kann ich unzensierte Modelle kostenlos testen?",
      a: "Ja. {{guestCredits}} kostenlose Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto. Genug für den Zehn-Minuten-Test mit den günstigeren unzensierten Modellen. Die Premium-Modelle kosten mehr pro Nachricht.",
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
