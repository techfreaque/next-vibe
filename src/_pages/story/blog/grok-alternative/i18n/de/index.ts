import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Grok-Alternativen: weniger Filter, gleicher Chat | {{appName}}",
    description:
      "Grok-Alternativen für Webrecherche, Medien und Chats mit weniger Ablehnungen. Mit {{appName}}, Perplexity, Gemini, Venice und lokalen Apps.",
    category: "Vergleich",
    imageAlt: "Grok neben unzensierten Grok-Alternativen",
    keywords:
      "Grok Alternative, Grok Alternativen, Grok unzensiert, ist Grok unzensiert, unzensiertes Grok, Grok ohne X-Konto, Grok vs unzensierte KI, Seiten wie Grok, Grok Imagine, KI ohne Filter, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "7 Min. Lesezeit",
    title: "Grok-Alternativen für Suche, Medien und Chat",
    subtitle:
      "Vergleiche Grok mit Rechercheassistenten, Kreativ-Apps und Modellen, die seltener ablehnen.",
  },
  intro: {
    lead: "Grok durchsucht X und das Web, führt Sprachdialoge und erzeugt Bilder und Videos. Die veröffentlichten Nutzungsregeln setzen Grenzen. Welche Alternative passt, hängt davon ab, wofür du Grok am häufigsten nutzt.",
    p2: "Hier: was Grok macht und was nicht, die Alternativen nach dem, was du wirklich willst, und wie du {{grokName}} behältst und Modelle ohne Verweigerungen dazunimmst, in einem Thread. {{appName}} betreibt {{grokName}} neben {{uncensored}} unzensierten Modellen.",
  },
  honest: {
    title: "Funktionen und Grenzen von Grok",
    intro: "Gesprächston und Nutzungsregeln.",
    looser:
      "Gesprächsstil. Grok bietet Text und Sprache. Der Ton hängt von Modell und Modus ab.",
    filtered:
      "Trotzdem gefiltert. xAI hat Nutzungsrichtlinien und Sicherheitstraining. Manche Anfragen werden weiter abgelehnt, entschärft oder umgelenkt.",
    shifts:
      "Neue Modelle und Richtlinien können Antworten verändern. Prüfe deine wichtigsten Funktionen mit typischen Aufgaben.",
    catalog:
      "Wir führen {{grokName}} in der Stufe {{grokTier}}. Die Nutzungsregeln des Anbieters gelten weiterhin.",
    callout:
      "Vergleiche Funktionen, Anbieterrichtlinien und genau das Modell, das du einsetzen willst.",
  },
  why: {
    title: "Warum Leute eine Grok-Alternative suchen",
    intro: "Drei Gründe tauchen immer wieder auf.",
    policy:
      "Die Regeln. Groks Biss hängt an den aktuellen Einstellungen von xAI. Wer verlässliches Verhalten braucht, will ein Modell, dessen Verweigerungen aus den Gewichten entfernt wurden, nicht per Prompt gelockert.",
    account:
      "Das Konto. Groks eigene Apps leben im Ökosystem von X und xAI. Nicht jeder will seine Chats an dieses Konto binden.",
    voice:
      "Eine Stimme. Grok hat eine Persönlichkeit. Super für Schlagabtausch, falsch für eine nüchterne Fachantwort, den Schurken im Roman oder eine Sicht, die ihm abtrainiert wurde.",
  },
  alternatives: {
    title: "{{count}} Grok-Alternativen, nach dem, was du willst",
    intro:
      "Alle laufen im selben Chat wie Grok. Preise pro Referenznachricht, live aus unserem Katalog.",
    edge: {
      title: "Mehr Biss, gleicher Verstand: {{model}}",
      body: "Ein Mainstream-Modell, leicht verändert, damit es Fragen nicht mehr ausweicht: abliteriert. Stark bei Reasoning und Code, beantwortet, was Grok ablehnt. {{price}} pro Nachricht.",
    },
    reasoning: {
      title: "Schweres Reasoning, keine Belehrungen: {{model}}",
      body: "Moonshot AIs Flaggschiff-Kimi, abliteriert. Lange, sorgfältige Antworten auf harte Probleme, Verweigerungen entfernt. {{price}} pro Nachricht.",
    },
    cheap: {
      title: "Schnell und günstig: {{model}}",
      body: "DeepSeek ohne Verweigerungen. Flott, gut bei Code und Analyse, kostet fast nichts. {{price}} pro Nachricht.",
    },
    contrary: {
      title: "Gegenpositionen mit Absicht: {{model}}",
      body: "{{model}} ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden, und vertritt deshalb politische Gegenpositionen. Nicht auf frech getrimmt. Gebaut, um zu widersprechen. {{price}} pro Nachricht.",
    },
    roleplay: {
      title: "Figuren und dunkle Fiktion: {{model}}",
      body: "Auf Rollenspiel feinabgestimmt. Bleibt in der Rolle, spielt dunkle Szenen mit und durchbricht nicht die vierte Wand, um dich zu warnen. {{price}} pro Nachricht.",
    },
    chatLink: "Mit {{model}} chatten",
    directoryLink: "Alle abliterierten Modelle mit Kontext und Preis",
  },
  models: {
    title: "Grok und die Alternativen im direkten Vergleich",
    intro: "Unter jedem Namen: Inhaltsstufe oder Art der Entzensierung.",
    colModel: "Modell",
    colContext: "Kontext",
    colStrengths: "Stark bei",
    colPrice: "Pro Nachricht",
    colChat: "Ausprobieren",
    chatLink: "Mit {{model}} chatten",
    footnote:
      "Preis einer Referenznachricht inklusive unseres Aufschlags von {{markup}} %.",
  },
  keep: {
    title: "Grok behalten. Den Rest dazunehmen.",
    intro:
      "Du musst dich nicht entscheiden. {{grokName}} und die unzensierten Modelle teilen sich einen Chat und ein Guthaben.",
    steps: {
      ask: {
        title: "Mit Grok starten",
        body: "Öffne einen Chat mit {{grokName}}. Schlagabtausch, Meinungen zu News, schnelle Antworten.",
      },
      switch: {
        title: "Wechseln, wenn es ausweicht",
        body: "Wähl für die nächste Nachricht ein unzensiertes Modell. Das ganze Gespräch kommt mit, also antwortet es im Kontext.",
      },
      compare: {
        title: "Mit demselben Prompt vergleichen",
        body: "Schick einen Prompt an beide und lies die Antworten nebeneinander. Die Vergleichsseiten unten zeigen die Daten.",
      },
    },
    compareLink: "{{a}} gegen {{b}}",
  },
  imagine: {
    title: "Grok Imagine läuft hier auch",
    intro:
      "{{imagineNames}}: die Bild- und Videomodelle von xAI, mit denselben Credits. Ohne X-Konto.",
    link: "Mit {{model}} erstellen",
  },
  faq: {
    title: "FAQ",
    uncensored: {
      q: "Ist Grok unzensiert?",
      a: "Nein. Grok ist lockerer als ChatGPT oder Claude, aber xAI hat Nutzungsrichtlinien und Sicherheitstraining und ändert das Verhalten oft. Bei unzensierten Modellen ist das Verweigerungsverhalten dagegen aus den Gewichten entfernt.",
    },
    best: {
      q: "Was ist die beste Grok-Alternative?",
      a: "Kommt auf die Aufgabe an. Gleiche Intelligenz mit weniger Verweigerungen: ein abliteriertes Modell wie {{firstName}}. Ansichten gegen den Mainstream: {{ownModel}}. Rollenspiel: ein Rollenspiel-Finetune. Alle laufen auf {{appName}} neben Grok in einem Chat.",
    },
    account: {
      q: "Kann ich Grok ohne X-Konto nutzen?",
      a: "Ja, hier schon. {{grokName}} läuft im Inkognito-Chat auf {{appName}}, ganz ohne Konto. Zum Start gibt es {{guestCredits}} Gratis-Credits im Monat.",
    },
    price: {
      q: "Was kostet Grok hier?",
      a: "Kein eigenes Abo. Du zahlst pro Nachricht aus einem Credit-Guthaben. Eine Referenznachricht mit {{grokName}} kostet {{grokPrice}}.",
    },
    api: {
      q: "Kann ich Grok und unzensierte Modelle über eine API nutzen?",
      a: "Ja. OpenAI- und Anthropic-kompatible Endpunkte, ein Schlüssel für Grok, Claude, GPT und die unzensierten Modelle. Dein erster Kauf schaltet API-Schlüssel frei, Pläne gibt es ab {{apiSubPrice}} im Monat.",
    },
    imagine: {
      q: "Kann ich hier Bilder und Videos mit Grok Imagine machen?",
      a: "Ja. {{imagineNames}} laufen auf den Erstellen-Seiten und aus jedem Chat heraus, abgerechnet über dieselben Credits.",
    },
    chatLink: "Unzensierter KI-Chat: Modell wählen und loslegen",
    chatgptLink: "ChatGPT-Alternative ohne Filter",
    refusalLink: "Refusal Index: wer antwortet, wer verweigert",
  },
  cta: {
    title: "Groks Haltung war der Anfang. Nicht die Grenze.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Starte mit {{firstName}}.",
    start: "Unzensierten Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
