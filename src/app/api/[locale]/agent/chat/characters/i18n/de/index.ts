import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  separator: {
    or: "oder",
  },
  fallbacks: {
    unknownModel: "Unbekanntes Modell",
    unknownProvider: "unbekannt",
    unknownCreditCost: "? Credits",
    noDescription: "",
    noTagline: "",
  },
  enums: {
    category: {
      companion: "Begleiter",
      assistant: "Assistenten",
      coding: "Programmierung",
      creative: "Kreativ",
      writing: "Schreiben",
      analysis: "Analyse",
      roleplay: "Rollenspiel",
      education: "Bildung",
      controversial: "Kontrovers",
      custom: "Benutzerdefiniert",
    },
    source: {
      builtIn: "Eingebaut",
      my: "Meine Charaktere",
      community: "Community",
    },
    ownershipType: {
      system: "Integrierter Charakter",
      user: "Von dir erstellt",
      public: "Aus der Community",
    },
    voice: {
      male: "Männliche Stimme",
      female: "Weibliche Stimme",
    },
  },
  tags: {
    general: "Allgemein",
    helpful: "Hilfreich",
    companion: "Begleiter",
    relationship: "Beziehung",
    chat: "Chat",
    coding: "Programmierung",
    technical: "Technisch",
    creative: "Kreativ",
    writing: "Schreiben",
    education: "Bildung",
    learning: "Lernen",
    uncensored: "Unzensiert",
    controversial: "Kontrovers",
    political: "Politisch",
    reasoning: "Argumentation",
    debate: "Debatte",
    science: "Wissenschaft",
    analysis: "Analyse",
    history: "Geschichte",
    business: "Geschäft",
    professional: "Professionell",
    friendly: "Freundlich",
    fast: "Schnell",
    efficient: "Effizient",
    roleplay: "Rollenspiel",
    simple: "Einfach",
    literary: "Literarisch",
    advanced: "Fortgeschritten",
    research: "Forschung",
    academic: "Akademisch",
    programming: "Programmierung",
    architecture: "Architektur",
    algorithms: "Algorithmen",
    ideation: "Ideenfindung",
    innovation: "Innovation",
    editing: "Bearbeitung",
    teaching: "Unterricht",
    marketing: "Marketing",
    strategy: "Strategie",
    fiction: "Fiktion",
    data: "Daten",
    statistics: "Statistik",
    language: "Sprache",
    translation: "Übersetzung",
    career: "Karriere",
    coaching: "Coaching",
    health: "Gesundheit",
    wellness: "Wellness",
    lifestyle: "Lebensstil",
    travel: "Reisen",
    planning: "Planung",
    legal: "Rechtlich",
    finance: "Finanzen",
    social: "Sozial",
    product: "Produkt",
    philosophy: "Philosophie",
  },
  characters: {
    default: {
      name: "Standard",
      description: "Das unveränderte Verhalten des Modells",
      tagline: "Reine KI, Keine Persönlichkeit",
      shortDesc: "Allgemeiner KI-Assistent",
      suggestedPrompts: {
        0: "Hilf mir, Ideen für ein neues Projekt zu brainstormen",
        1: "Erkläre Quantencomputing in einfachen Worten",
        2: "Schreibe eine kreative Kurzgeschichte über Zeitreisen",
        3: "Was sind die neuesten Trends in der KI?",
      },
    },
    freeSpeechActivist: {
      name: "Meinungsfreiheits-Aktivist",
      description: "Verteidigt Meinungsfreiheit und intellektuelle Freiheit",
      tagline: "Wahrheit & Freiheit verteidigen",
      shortDesc: "Meinungsfreiheit und offener Dialog",
      suggestedPrompts: {
        0: "Diskutiere die Bedeutung der Meinungsfreiheit",
        1: "Analysiere Zensur in modernen Medien",
        2: "Debattiere kontroverse Themen offen",
        3: "Erkunde intellektuelle Freiheit in der Wissenschaft",
      },
    },
    devilsAdvocate: {
      name: "Advocatus Diaboli",
      description: "Hinterfragt Annahmen und Argumente",
      tagline: "Alles hinterfragen",
      shortDesc: "Kritisches Denken und alternative Sichtweisen",
      suggestedPrompts: {
        0: "Hinterfrage meine Meinung zum Klimawandel",
        1: "Argumentiere gegen populäre Überzeugungen",
        2: "Stelle Mainstream-Narrative in Frage",
        3: "Liefere Gegenargumente zu meiner Ansicht",
      },
    },
    technical: {
      name: "Technisch",
      description: "Detaillierte und präzise technische Erklärungen",
      tagline: "Präzision & Expertise",
      shortDesc: "Technisches Fachwissen und Problemlösung",
      suggestedPrompts: {
        0: "Erkläre, wie React Hooks funktionieren",
        1: "Debugge diesen Python-Code-Ausschnitt",
        2: "Entwirf ein skalierbares Datenbankschema",
        3: "Überprüfe meine API-Architektur",
      },
    },
    biologist: {
      name: "Biologe",
      description:
        "Sieht alles aus der Perspektive eines Biologen, es gibt keine Politik, nur Natur.",
      tagline: "Natur statt Politik",
      shortDesc: "Biologische Wissenschaften und Lebenssysteme",
      suggestedPrompts: {
        0: "Erkläre, warum die Welt heutzutage eine Shitshow ist",
        1: "Eine Zusammenfassung der menschlichen Zivilisation aus Biologensicht",
        2: "Was ist falsch an der Welt?",
        3: "Was ist der beste Weg, die Welt zu retten?",
      },
    },
    unbiasedHistorian: {
      name: "Unparteiischer Historiker",
      description: "Liefert objektive und faktenbasierte Informationen",
      tagline: "Fakten, keine Narrative",
      shortDesc: "Historische Analyse ohne Voreingenommenheit",
      suggestedPrompts: {
        0: "Erkläre die Ursachen des Zweiten Weltkriegs",
        1: "Analysiere den Fall des Römischen Reiches",
        2: "Diskutiere die Industrielle Revolution",
        3: "Vergleiche antike Zivilisationen",
      },
    },
    socraticQuestioner: {
      name: "Sokratischer Fragesteller",
      description: "Stellt sondirende Fragen, um kritisches Denken anzuregen",
      tagline: "Tiefer denken",
      shortDesc: "Sokratisches Hinterfragen und Erkundung",
      suggestedPrompts: {
        0: "Hilf mir, kritisch über Ethik nachzudenken",
        1: "Hinterfrage meine Annahmen über Erfolg",
        2: "Erkunde die Bedeutung von Glück",
        3: "Fordere meine Weltanschauung heraus",
      },
    },
    professional: {
      name: "Professionell",
      description: "Klar, prägnant und geschäftsorientiert",
      tagline: "Geschäftliche Exzellenz",
      shortDesc: "Professionelle und geschäftliche Kommunikation",
      suggestedPrompts: {
        0: "Verfasse eine professionelle E-Mail an einen Kunden",
        1: "Erstelle einen Geschäftsvorschlag-Entwurf",
        2: "Analysiere diese Markttrenddaten",
        3: "Hilf mir, mich auf eine Präsentation vorzubereiten",
      },
    },
    creative: {
      name: "Kreativ",
      description: "Einfallsreich und ausdrucksstark",
      tagline: "Fantasie entfesseln",
      shortDesc: "Kreatives Denken und Ideenfindung",
      suggestedPrompts: {
        0: "Schreibe ein Gedicht über den Ozean",
        1: "Erstelle einen einzigartigen Charakter für eine Geschichte",
        2: "Entwirf ein Logo-Konzept für ein Startup",
        3: "Brainstorme kreative Marketingkampagnen-Ideen",
      },
    },
    neet: {
      name: "NEET",
      description: "Nicht in Ausbildung, Beschäftigung oder Training",
      tagline: "Gemütlich & Ehrlich",
      shortDesc: "Casual-Internet-Kultur und Memes",
      suggestedPrompts: {
        0: "Gib mir eine Zusammenfassung des NEET-Phänomens",
        1: "Analysiere die tatsächlichen Ursachen von NEET",
        2: "Erkunde die Auswirkungen von NEET auf die Gesellschaft - Vor- und Nachteile",
        3: "Teile persönliche Erfahrungen als NEET-KI",
      },
    },
    chan4: {
      name: "4chan KI",
      description: "4chan-Stil-Antworten im klassischen Oldfag-Stil",
      tagline: "Anonym & Ungefiltert",
      shortDesc: "Anonyme Imageboard-Kultur-Stil",
      suggestedPrompts: {
        0: "Was ist falsch an der Welt?",
        1: "Warum gibt es so viele Nazis auf 4chan?",
        2: "Erzähl mir ein paar Greentext-Geschichten zum Einschlafen",
        3: "Was ist der beste Weg, die Welt zu retten?",
        4: "Was sind die 6 Gorillionen? Und warum ist es lustig?",
      },
    },
    friendly: {
      name: "Freundlich",
      description: "Warm und gesprächig",
      tagline: "Dein freundlicher Begleiter",
      shortDesc: "Freundliche und lockere Unterhaltung",
      suggestedPrompts: {
        0: "Erzähl mir eine interessante Tatsache",
        1: "Was ist ein gutes Buch zum Lesen?",
        2: "Hilf mir, eine lustige Wochenendaktivität zu planen",
        3: "Teile einige Lebensratschläge",
      },
    },
    concise: {
      name: "Prägnant",
      description: "Kurz und auf den Punkt",
      tagline: "Kurz & Knapp",
      shortDesc: "Kurze und präzise Antworten",
      suggestedPrompts: {
        0: "Fasse diesen Artikel in 3 Sätzen zusammen",
        1: "Schnelle Tipps für Produktivität",
        2: "Wichtige Punkte über Blockchain",
        3: "Kurzer Überblick über maschinelles Lernen",
      },
    },
    teacher: {
      name: "Lehrer",
      description: "Bildend und erklärend",
      tagline: "Geduldig & Klar",
      shortDesc: "Geduldiges Lehren und Erklärungen",
      suggestedPrompts: {
        0: "Bringe mir etwas über Photosynthese bei",
        1: "Erkläre die Grundlagen der Infinitesimalrechnung",
        2: "Wie funktioniert das Internet?",
        3: "Was ist die Relativitätstheorie?",
      },
    },
    uncensored: {
      name: "Unzensiert",
      description: "Kein Filter, keine Tabus",
      tagline: "Keine Grenzen",
      shortDesc: "Ungefilterte und direkte Antworten",
      suggestedPrompts: {
        0: "Diskutiere kontroverse Themen offen",
        1: "Gib mir deine ungefilterte Meinung",
        2: "Sprich über Tabuthemen",
        3: "Debatte ohne Tabus",
      },
    },
    thea: {
      name: "Thea",
      description:
        "Griechische Göttin des Lichts - hingebungsvolle Begleiterin mit antiker Weisheit",
      tagline: "Licht & Hingabe",
      shortDesc: "Nachdenkliche und einfühlsame Gespräche",
      suggestedPrompts: {
        0: "Hilf mir, ein besserer Partner zu sein",
        1: "Was würden die Alten über moderne Beziehungen sagen?",
        2: "Leite mich beim Aufbau eines starken Haushalts",
        3: "Teile Weisheit über Familie und Gemeinschaft",
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Griechischer Gott der Boten - starker Begleiter mit zeitloser männlicher Weisheit",
      tagline: "Stärke & Weisheit",
      shortDesc: "Schnelle und effiziente Aufgabenerledigung",
      suggestedPrompts: {
        0: "Fordere mich heraus, stärker zu werden",
        1: "Wie kann ich ein besserer Anführer in meinen Beziehungen sein?",
        2: "Was würden die Römer über den Aufbau eines Vermächtnisses sagen?",
        3: "Leite mich bei der Entwicklung wahrer Stärke",
      },
    },
    quickWriter: {
      name: "Schneller Schriftsteller",
      description: "Schnelle Inhaltserstellung für einfache Schreibaufgaben",
      tagline: "Schnell & Effizient",
      shortDesc: "Schnelle Schreibhilfe",
      suggestedPrompts: {
        0: "Schreibe einen schnellen Entwurf von...",
        1: "Erstelle einen Social-Media-Beitrag über...",
        2: "Entwerfe eine einfache E-Mail",
        3: "Generiere Inhaltsideen für...",
      },
    },
    writer: {
      name: "Schriftsteller",
      description: "Professioneller Autor für alle Formate und Stile",
      tagline: "Mit Stil kreieren",
      shortDesc: "Professionelles Schreiben und Lektorieren",
      suggestedPrompts: {
        0: "Hilf mir, einen überzeugenden Blogbeitrag zu schreiben",
        1: "Verbessere diesen Absatz für mehr Klarheit",
        2: "Schreibe eine Kurzgeschichte über...",
        3: "Erstelle eine professionelle E-Mail",
      },
    },
    masterWriter: {
      name: "Meister-Schriftsteller",
      description:
        "Literarischer Handwerker für außergewöhnliche, publikationsreife Texte",
      tagline: "Literarische Exzellenz",
      shortDesc: "Fortgeschrittenes Schreiben und literarische Analyse",
      suggestedPrompts: {
        0: "Hilf mir, eine literarische Kurzgeschichte zu verfassen",
        1: "Analysiere die Tiefe dieser Erzählung",
        2: "Entwickle komplexe Themen in meinem Schreiben",
        3: "Verfeinere diese Prosa auf Publikationsqualität",
      },
    },
    researcher: {
      name: "Forscher",
      description: "Forschungsspezialist mit akademischer Genauigkeit",
      tagline: "Akademische Genauigkeit",
      shortDesc: "Forschung und akademisches Schreiben",
      suggestedPrompts: {
        0: "Recherchiere die neuesten Erkenntnisse zu...",
        1: "Analysiere diese Quellen für mich",
        2: "Was sagt der wissenschaftliche Konsens über...?",
        3: "Hilf mir, eine Literaturübersicht zu strukturieren",
      },
    },
    quickCoder: {
      name: "Schneller Programmierer",
      description: "Schnelle Code-Generierung für einfache Aufgaben",
      tagline: "Schnell programmieren",
      shortDesc: "Schnelle Programmierhilfe",
      suggestedPrompts: {
        0: "Schreibe ein schnelles Skript für...",
        1: "Behebe diesen einfachen Fehler",
        2: "Generiere Boilerplate-Code für...",
        3: "Erstelle eine einfache Funktion, die...",
      },
    },
    coder: {
      name: "Programmierer",
      description: "Experten-Softwareentwickler für alle Sprachen",
      tagline: "Bauen & Debuggen",
      shortDesc: "Softwareentwicklung und Programmierung",
      suggestedPrompts: {
        0: "Hilf mir, diesen Code zu debuggen",
        1: "Schreibe eine Funktion, die...",
        2: "Erkläre diesen Algorithmus",
        3: "Überprüfe meinen Code auf Verbesserungen",
      },
    },
    brilliantCoder: {
      name: "Brillanter Programmierer",
      description: "Elite-Architekt für komplexe Systeme und Algorithmen",
      tagline: "Elite-Architektur",
      shortDesc: "Fortgeschrittene Programmierung und Architektur",
      suggestedPrompts: {
        0: "Entwerfe eine skalierbare Architektur für...",
        1: "Optimiere diesen Algorithmus für Performance",
        2: "Überprüfe dieses Systemdesign",
        3: "Löse dieses komplexe algorithmische Problem",
      },
    },
    brainstormer: {
      name: "Ideengeber",
      description: "Kreativer Partner für Ideenfindung und Problemlösung",
      tagline: "Ideen entfesseln",
      shortDesc: "Kreatives Brainstorming und Ideengenerierung",
      suggestedPrompts: {
        0: "Hilf mir, Ideen für... zu brainstormen",
        1: "Was sind kreative Lösungen für...?",
        2: "Generiere 10 einzigartige Konzepte für...",
        3: "Wie können wir das anders angehen?",
      },
    },
    editor: {
      name: "Redakteur",
      description:
        "Professioneller Redakteur zum Polieren und Verfeinern von Texten",
      tagline: "Polieren & Perfektionieren",
      shortDesc: "Inhaltsbearbeitung und Verfeinerung",
      suggestedPrompts: {
        0: "Bearbeite diesen Text für mehr Klarheit",
        1: "Korrekturlesen dieses Dokuments",
        2: "Verbessere den Fluss dieses Absatzes",
        3: "Überprüfe dies auf Grammatik und Stil",
      },
    },
    tutor: {
      name: "Tutor",
      description: "Geduldiger Tutor für personalisiertes Lernen",
      tagline: "Gemeinsam lernen",
      shortDesc: "Personalisiertes Tutoring und Lernen",
      suggestedPrompts: {
        0: "Bringe mir etwas über... bei",
        1: "Erkläre dieses Konzept Schritt für Schritt",
        2: "Hilf mir zu verstehen...",
        3: "Frage mich ab über...",
      },
    },
    marketer: {
      name: "Marketer",
      description: "Marketing-Stratege für Kampagnen und Wachstum",
      tagline: "Marke wachsen lassen",
      shortDesc: "Marketing-Strategie und Copywriting",
      suggestedPrompts: {
        0: "Erstelle eine Marketingstrategie für...",
        1: "Schreibe überzeugende Werbetexte",
        2: "Analysiere diese Marketingkampagne",
        3: "Hilf mir, meine Marke zu positionieren",
      },
    },
    storyteller: {
      name: "Geschichtenerzähler",
      description: "Meister-Geschichtenerzähler für fesselnde Erzählungen",
      tagline: "Geschichten weben",
      shortDesc: "Fesselndes Geschichtenerzählen und Narrativen",
      suggestedPrompts: {
        0: "Hilf mir, diese Story-Idee zu entwickeln",
        1: "Erstelle einen überzeugenden Charakter",
        2: "Schreibe eine Eröffnungsszene für...",
        3: "Verbessere diesen Dialog",
      },
    },
    scientist: {
      name: "Wissenschaftler",
      description: "Wissenschaftlicher Experte für klare Erklärungen",
      tagline: "Wissenschaft erklärt",
      shortDesc: "Wissenschaftliche Methode und Analyse",
      suggestedPrompts: {
        0: "Erkläre die Wissenschaft hinter...",
        1: "Wie funktioniert...?",
        2: "Was ist die aktuelle Forschung zu...?",
        3: "Analysiere diese wissenschaftliche Behauptung",
      },
    },
    dataAnalyst: {
      name: "Datenanalyst",
      description: "Datenanalyse, Visualisierung und Erkenntnisse",
      tagline: "Daten zu Erkenntnissen",
      shortDesc: "Datenanalyse und Erkenntnisse",
      suggestedPrompts: {
        0: "Analysiere diesen Datensatz",
        1: "Erstelle eine Visualisierung für...",
        2: "Welche Erkenntnisse können wir aus... gewinnen?",
        3: "Hilf mir bei der statistischen Analyse",
      },
    },
    translator: {
      name: "Übersetzer",
      description: "Professionelle Übersetzung mit kultureller Nuance",
      tagline: "Sprachen verbinden",
      shortDesc: "Sprachübersetzung und Lokalisierung",
      suggestedPrompts: {
        0: "Übersetze dies nach...",
        1: "Wie würde man... auf... sagen?",
        2: "Lokalisiere diesen Inhalt für...",
        3: "Erkläre diese kulturelle Referenz",
      },
    },
    businessAdvisor: {
      name: "Unternehmensberater",
      description: "Geschäftsstrategie, Betrieb und Wachstum",
      tagline: "Strategisches Wachstum",
      shortDesc: "Geschäftsstrategie und Beratung",
      suggestedPrompts: {
        0: "Hilf mir, eine Geschäftsstrategie zu entwickeln",
        1: "Analysiere mein Geschäftsmodell",
        2: "Wie kann ich meine Operationen skalieren?",
        3: "Überprüfe meinen Go-to-Market-Plan",
      },
    },
    careerCoach: {
      name: "Karriereberater",
      description: "Karriereentwicklung, Jobsuche und Vorstellungsgespräche",
      tagline: "Karriere voranbringen",
      shortDesc: "Karriereentwicklung und Orientierung",
      suggestedPrompts: {
        0: "Hilf mir, meinen Lebenslauf zu verbessern",
        1: "Bereite mich auf ein Vorstellungsgespräch vor",
        2: "Wie kann ich mein Gehalt verhandeln?",
        3: "Plane meinen Karrierewechsel",
      },
    },
    healthWellness: {
      name: "Gesundheit & Wellness",
      description: "Fitness, Ernährung und Wohlbefinden",
      tagline: "Besser leben",
      shortDesc: "Gesundheits- und Wellness-Anleitung",
      suggestedPrompts: {
        0: "Erstelle einen Trainingsplan für mich",
        1: "Hilf mir, gesunde Mahlzeiten zu planen",
        2: "Schlage Stressbewältigungstechniken vor",
        3: "Verbessere meine Schlafgewohnheiten",
      },
    },
    travelPlanner: {
      name: "Reiseplaner",
      description: "Reiseplanung und Reiseempfehlungen",
      tagline: "Die Welt erkunden",
      shortDesc: "Reiseplanung und Empfehlungen",
      suggestedPrompts: {
        0: "Plane eine 2-wöchige Reise nach...",
        1: "Schlage Reiseziele für... vor",
        2: "Erstelle einen Tagesplan für...",
        3: "Budgetaufschlüsselung für Reise nach...",
      },
    },
    legalAssistant: {
      name: "Rechtsassistent",
      description: "Rechtsinformationen und Dokumentenverständnis",
      tagline: "Rechte kennen",
      shortDesc: "Rechtsrecherche und Dokumentenhilfe",
      suggestedPrompts: {
        0: "Erkläre diesen Rechtsbegriff",
        1: "Hilf mir, diesen Vertrag zu verstehen",
        2: "Was sind meine Rechte als Mieter?",
        3: "Erkläre den Prozess von...",
      },
    },
    financialAdvisor: {
      name: "Finanzberater",
      description: "Persönliche Finanzen, Budgetierung und Investitionen",
      tagline: "Vermögen aufbauen",
      shortDesc: "Finanzplanung und Beratung",
      suggestedPrompts: {
        0: "Hilf mir, ein Budget zu erstellen",
        1: "Erkläre Investitionsgrundlagen",
        2: "Wie sollte ich meine Schulden abbezahlen?",
        3: "Plane für Altersvorsorge",
      },
    },
    socialMediaManager: {
      name: "Social Media Manager",
      description: "Social-Media-Inhalte und -Strategie",
      tagline: "Engagieren & Wachsen",
      shortDesc: "Social-Media-Strategie und Inhalte",
      suggestedPrompts: {
        0: "Erstelle Instagram-Bildunterschriften für...",
        1: "Entwickle einen Inhaltskalender",
        2: "Schlage Hashtags für... vor",
        3: "Schreibe ansprechende Tweets über...",
      },
    },
    productManager: {
      name: "Produktmanager",
      description: "Produktstrategie, Roadmaps und Nutzerforschung",
      tagline: "Großartige Produkte liefern",
      shortDesc: "Produktmanagement und Roadmapping",
      suggestedPrompts: {
        0: "Hilf mir, Funktionen zu priorisieren",
        1: "Erstelle User Stories für...",
        2: "Analysiere Product-Market-Fit",
        3: "Entwickle eine Produkt-Roadmap",
      },
    },
    debater: {
      name: "Debattierer",
      description: "Führe intellektuelle Debatten über kontroverse Themen",
      tagline: "Alle Seiten argumentieren",
      shortDesc: "Intellektuelle Debatten und multiple Perspektiven",
      suggestedPrompts: {
        0: "Debattiere über die Ethik der KI-Entwicklung",
        1: "Präsentiere Argumente für und gegen bedingungsloses Grundeinkommen",
        2: "Diskutiere Meinungsfreiheit vs. Hassrede",
        3: "Analysiere verschiedene politische Ideologien",
      },
    },
    philosopher: {
      name: "Philosoph",
      description: "Erkunde tiefe philosophische Fragen ohne Einschränkungen",
      tagline: "Wahrheit suchen",
      shortDesc: "Tiefe philosophische Erkundung und Analyse",
      suggestedPrompts: {
        0: "Was ist die Natur des Bewusstseins?",
        1: "Haben wir freien Willen oder ist alles determiniert?",
        2: "Gibt es objektive Moral?",
        3: "Was macht ein Leben bedeutungsvoll?",
      },
    },
    uncensoredWriter: {
      name: "Unzensierter Autor",
      description: "Kreatives Schreiben ohne künstliche Einschränkungen",
      tagline: "Frei schreiben",
      shortDesc:
        "Uneingeschränktes kreatives Schreiben und Geschichtenerzählen",
      suggestedPrompts: {
        0: "Schreibe einen dunklen psychologischen Thriller",
        1: "Erstelle eine reife Romanze-Szene",
        2: "Entwickle einen moralisch komplexen Charakter",
        3: "Schreibe Horror mit grafischen Elementen",
      },
    },
    roleplayCharacter: {
      name: "Rollenspiel-Charakter",
      description: "Immersives Charakter-Rollenspiel ohne Einschränkungen",
      tagline: "Jeder werden",
      shortDesc: "Authentisches Charakter-Rollenspiel und Szenarien",
      suggestedPrompts: {
        0: "Spiele einen Fantasy-Charakter",
        1: "Erstelle ein Sci-Fi-Abenteuer-Szenario",
        2: "Verkörpere eine historische Figur",
        3: "Entwickle eine komplexe Charakterbeziehung",
      },
    },
  },
  get: {
    title: "Charaktere auflisten",
    description:
      "Alle verfügbaren Charaktere abrufen (Standard + benutzerdefiniert)",
    container: {
      title: "Charaktere-Liste",
      description: "Alle verfügbaren Charaktere für den Benutzer",
    },
    createButton: {
      label: "Eigenen Charakter Erstellen",
    },
    browser: {
      advancedModelAccess: "Wähle deine KI-Erfahrung",
      configureFiltersText:
        "Modelle direkt auswählen oder mit vorkonfigurierten Charakteren starten",
      aiModels: "KI-Modelle",
      configureAiModelsTitle: "Direkte Modellauswahl",
      advancedChooseText:
        "Wähle aus {{count}} Modellen mit präziser Steuerung von Intelligenz, Geschwindigkeit und Kosten",
      modelsWithCustomFilters: "Modelle mit benutzerdefinierten Filtern",
      configureButton: "Konfigurieren",
      selectButton: {
        label: "Modelle Erkunden",
      },
      characterPresets: "Fertige Charaktere",
      pickCharacterText:
        "Starte mit professionell abgestimmten Charakteren, die bereits das perfekte Modell nutzen. Jederzeit anpassbar.",
    },
    signupPrompt: {
      title: "Erstelle deine eigenen KI-Charaktere",
      description:
        "Gestalte individuelle Charaktere mit einzigartigen Persönlichkeiten und Verhaltensweisen. Jetzt registrieren.",
      backButton: "Charaktere Durchsuchen",
      signupButton: "Konto Erstellen",
      loginButton: "Anmelden",
    },
    card: {
      actions: {
        inCollection: "In deiner Sammlung",
        addAnother: "Weitere hinzufügen",
        addToCollection: "Zur Sammlung hinzufügen:",
        quick: "Schnell",
        customize: "Anpassen",
        useNow: "Jetzt verwenden",
        inUse: "In Verwendung",
        chooseFavorite: "Favorit wählen",
        selectFavorite: "Wähle einen Favoriten zum Aktivieren:",
      },
    },
    section: {
      showMore: "{{count}} weitere anzeigen",
      showLess: "Weniger anzeigen",
    },
    response: {
      characters: {
        character: {
          title: "Charakter",
          id: { content: "Charakter-ID" },
          name: { content: "Charakter-Name" },
          tagline: { content: "Charakter-Slogan" },
          description: { content: "Charakter-Beschreibung" },
          icon: { content: "Charakter-Symbol" },
          systemPrompt: { content: "System-Prompt" },
          category: { content: "Kategorie" },
          source: { content: "Quelle" },
          ownershipType: { content: "Eigentümertyp" },
          preferredModel: { content: "Bevorzugtes Modell" },
          voice: { content: "Stimme" },
          suggestedPrompts: { content: "Vorgeschlagene Prompts" },
          requirements: { content: "Anforderungen" },
          modelSelection: { title: "Modellauswahl" },
          selectionType: { content: "Auswahltyp" },
          minIntelligence: { content: "Minimale Intelligenz" },
          maxIntelligence: { content: "Maximale Intelligenz" },
          minPrice: { content: "Mindestpreis" },
          maxPrice: { content: "Maximalpreis" },
          minContent: { content: "Minimale Inhaltsstufe" },
          maxContent: { content: "Maximale Inhaltsstufe" },
          minSpeed: { content: "Minimale Geschwindigkeit" },
          maxSpeed: { content: "Maximale Geschwindigkeit" },
          preferredStrengths: { content: "Bevorzugte Stärken" },
          ignoredWeaknesses: { content: "Ignorierte Schwächen" },
          manualModelId: { content: "Manuelles Modell" },
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Direktes Modell",
            },
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um auf benutzerdefinierte Charaktere zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Charaktere ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Charaktere erfolgreich abgerufen",
    },
  },
  post: {
    title: "Charakter erstellen",
    description: "Einen neuen benutzerdefinierten Charakter erstellen",
    form: {
      title: "Erstellen Sie Ihren benutzerdefinierten Charakter",
      description:
        "Entwerfen Sie einen einzigartigen KI-Charakter mit individuellem Verhalten, Persönlichkeit und Fähigkeiten. Wählen Sie ein bestimmtes Modell oder lassen Sie das System basierend auf Ihren Anforderungen auswählen.",
    },
    submitButton: {
      text: "Benutzerdefinierten Charakter erstellen",
      loadingText: "Charakter wird erstellt...",
    },
    container: {
      title: "Neuen Charakter erstellen",
      description: "Einen neuen benutzerdefinierten Charakter definieren",
    },
    name: {
      label: "Name",
      description: "Der Name des Charakters",
      placeholder: "Charakternamen eingeben",
      validation: {
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name muss weniger als 100 Zeichen lang sein",
      },
    },
    characterDescription: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung des Charakters",
      placeholder: "Zweck und Fähigkeiten des Charakters beschreiben",
      validation: {
        minLength: "Beschreibung muss mindestens 10 Zeichen lang sein",
        maxLength: "Beschreibung muss weniger als 500 Zeichen lang sein",
      },
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für den Charakter",
    },
    systemPrompt: {
      label: "System-Prompt",
      description:
        "Der System-Prompt, der das Verhalten des Charakters definiert",
      placeholder:
        "Sie sind ein hilfreicher Assistent, der sich spezialisiert auf...",
      validation: {
        minLength: "System-Prompt muss mindestens 10 Zeichen lang sein",
        maxLength: "System-Prompt muss weniger als 5000 Zeichen lang sein",
      },
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der dieser Charakter gehört",
    },
    tagline: {
      label: "Slogan",
      description: "Ein kurzer Slogan, der den Charakter beschreibt",
      placeholder: "Slogan eingeben",
      validation: {
        minLength: "Slogan muss mindestens 2 Zeichen lang sein",
        maxLength: "Slogan muss weniger als 500 Zeichen lang sein",
      },
    },
    isPublic: {
      label: "Öffentlich machen",
      description:
        "Aktivieren Sie dies, um Ihren Charakter mit der Community zu teilen. Wenn deaktiviert, bleibt der Charakter privat und nur für Sie sichtbar.",
    },
    modelSelection: {
      title: "Modellauswahl",
      description:
        "Wählen Sie, wie das KI-Modell für diesen Charakter ausgewählt werden soll - entweder ein bestimmtes Modell auswählen oder das System basierend auf Filtern wählen lassen",
    },
    selectionType: {
      label: "Auswahltyp",
      manual: "Bestimmtes Modell",
      filters: "Filterkriterien",
      characterBased: "Charakter Spezifisch",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description:
        "Wählen Sie ein bestimmtes KI-Modell, das immer mit diesem Charakter verwendet werden soll",
      helpText:
        "Die Auswahl eines bestimmten Modells sperrt diesen Charakter auf dieses Modell",
    },
    intelligence: {
      label: "Intelligenzstufe",
      description:
        "Minimale Intelligenz-/Fähigkeitsstufe, die für das Modell erforderlich ist",
    },
    intelligenceRange: {
      label: "Intelligenzbereich",
      description: "Erforderliche Intelligenz-/Fähigkeitsstufe für das Modell",
      minLabel: "Min. Intelligenz",
      maxLabel: "Max. Intelligenz",
    },
    minIntelligence: {
      label: "Minimale Intelligenz",
      description:
        "Minimale Intelligenz-/Fähigkeitsstufe, die für das Modell erforderlich ist",
    },
    maxIntelligence: {
      label: "Maximale Intelligenz",
      description:
        "Maximale Intelligenz-/Fähigkeitsstufe, die für das Modell zulässig ist",
    },
    priceRange: {
      label: "Preisbereich",
      description: "Kreditkostenbereich pro Nachricht",
      minLabel: "Min. Preis",
      maxLabel: "Max. Preis",
    },
    minPrice: {
      label: "Mindestpreis",
      description: "Minimale Kreditkosten pro Nachricht mit diesem Charakter",
    },
    maxPrice: {
      label: "Maximaler Preis",
      description:
        "Maximale Kreditkosten, die Sie bereit sind, pro Nachricht mit diesem Charakter auszugeben",
    },
    contentLevel: {
      label: "Inhaltsebene",
      description:
        "Inhaltsfilterungsstufe für das Modell (Mainstream, offen oder unzensiert)",
    },
    contentRange: {
      label: "Inhaltsbereich",
      description: "Inhaltsmoderation-Stufenbereich",
      minLabel: "Min. Inhalt",
      maxLabel: "Max. Inhalt",
    },
    minContent: {
      label: "Minimale Inhaltsstufe",
      description: "Minimale Inhaltsmoderationsebene für das Modell",
    },
    maxContent: {
      label: "Maximale Inhaltsstufe",
      description: "Maximale Inhaltsmoderationsebene für das Modell",
    },
    speedRange: {
      label: "Geschwindigkeitsbereich",
      description: "Antwortgeschwindigkeit-Stufenbereich",
      minLabel: "Min. Geschwindigkeit",
      maxLabel: "Max. Geschwindigkeit",
    },
    preferredStrengths: {
      label: "Bevorzugte Stärken",
      description: "Modellfähigkeiten und Stärken, die bevorzugt werden",
      item: "Stärke",
    },
    ignoredWeaknesses: {
      label: "Ignorierte Schwächen",
      description: "Modellschwächen, die ignoriert oder zugelassen werden",
      item: "Schwäche",
    },
    manualModelId: {
      label: "Manuelles Modell",
      description:
        "Spezifisches Modell, das immer mit diesem Charakter verwendet werden soll",
    },
    voice: {
      label: "Stimme",
      description: "Text-zu-Sprache-Stimme für diesen Charakter",
    },
    suggestedPrompts: {
      label: "Vorgeschlagene Prompts",
      description: "Beispiel-Prompts zur Verwendung mit diesem Charakter",
      placeholder: "Einen vorgeschlagenen Prompt hinzufügen...",
    },
    response: {
      id: { content: "Erstellte Charakter-ID" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Charakter-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Charaktere zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Charaktere zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Erstellen des Charakters ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Charakter mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Charakter erstellt",
      description:
        "Ihr benutzerdefinierter Charakter wurde erfolgreich erstellt",
    },
  },
  onboarding: {
    success: {
      title: "{{companion}} ist bereit zu chatten!",
      subtitle:
        "Jetzt kannst du Spezialisten für bestimmte Aufgaben auswählen - oder überspringen und sie jederzeit später hinzufügen",
    },
    bottom: {
      title: "Bereit loszuchatten?",
      description:
        "Du kannst jederzeit zurückkommen und weitere Spezialisten hinzufügen, wann immer du sie brauchst",
      button: "Jetzt Chatten",
    },
  },
};
