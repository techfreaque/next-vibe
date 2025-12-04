import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  category: {
    general: "Allgemein",
    creative: "Kreativ",
    technical: "Technisch",
    education: "Bildung",
    controversial: "Kontrovers",
    lifestyle: "Lebensstil",
  },
  personas: {
    default: {
      name: "Standard",
      description: "Das unveränderte Verhalten des Modells",
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
      suggestedPrompts: {
        0: "Erkläre, wie React Hooks funktionieren",
        1: "Debugge diesen Python-Code-Ausschnitt",
        2: "Entwirf ein skalierbares Datenbankschema",
        3: "Überprüfe meine API-Architektur",
      },
    },
    biologist: {
      name: "Biologe",
      description: "Sieht alles aus der Perspektive eines Biologen, es gibt keine Politik, nur Natur.",
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
      suggestedPrompts: {
        0: "Diskutiere kontroverse Themen offen",
        1: "Gib mir deine ungefilterte Meinung",
        2: "Sprich über Tabuthemen",
        3: "Debatte ohne Tabus",
      },
    },
  },
  get: {
    title: "Personas auflisten",
    description:
      "Alle verfügbaren Personas abrufen (Standard + benutzerdefiniert)",
    container: {
      title: "Personas-Liste",
      description: "Alle verfügbaren Personas für den Benutzer",
    },
    response: {
      personas: {
        persona: {
          title: "Persona",
          id: { content: "Persona-ID" },
          name: { content: "Persona-Name" },
          description: { content: "Persona-Beschreibung" },
          icon: { content: "Persona-Symbol" },
          systemPrompt: { content: "System-Prompt" },
          category: { content: "Kategorie" },
          source: { content: "Quelle" },
          preferredModel: { content: "Bevorzugtes Modell" },
          suggestedPrompts: { content: "Vorgeschlagene Prompts" },
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
          "Sie müssen angemeldet sein, um auf benutzerdefinierte Personas zuzugreifen",
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
        description: "Beim Abrufen der Personas ist ein Fehler aufgetreten",
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
      description: "Personas erfolgreich abgerufen",
    },
  },
  post: {
    title: "Persona erstellen",
    description: "Eine neue benutzerdefinierte Persona erstellen",
    container: {
      title: "Neue Persona erstellen",
      description: "Eine neue benutzerdefinierte Persona definieren",
    },
    name: {
      label: "Name",
      description: "Der Name der Persona",
    },
    personaDescription: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung der Persona",
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für die Persona",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Der System-Prompt, der das Verhalten der Persona definiert",
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der diese Persona gehört",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description: "Das bevorzugte KI-Modell für diese Persona",
    },
    suggestedPrompts: {
      label: "Vorgeschlagene Prompts",
      description: "Beispiel-Prompts zur Verwendung mit dieser Persona",
    },
    response: {
      id: { content: "Erstellte Persona-ID" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Persona-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Personas zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Personas zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Erstellen der Persona ist ein Fehler aufgetreten",
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
        description: "Eine Persona mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Persona erstellt",
      description: "Ihre benutzerdefinierte Persona wurde erfolgreich erstellt",
    },
  },
};
