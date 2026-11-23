import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "KI-Generierung",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Medienstudio",
  navName: "Studio",
  hub: {
    metaTitle: "KI-Medienstudio: Bilder, Video, Musik und Stimme",
    metaDescription:
      "Bilder, Videoclips, Musik und Sprachausgabe erzeugen oder Audio transkribieren. Etablierte und unzensierte Modelle nebeneinander. Bezahlt wird pro Ergebnis.",
    keywords:
      "KI-Medienstudio, unzensierter KI-Bildgenerator, KI-Videogenerator, KI-Musikgenerator, Text zu Sprache, Sprache zu Text",
    title: "Medienstudio",
    subtitle:
      "Fünf Werkzeuge. Alle großen Modelle, unzensierte inklusive. Du zahlst pro Ergebnis und behältst alles, was du erstellst.",
    from: "Ab {{price}}",
    free: "Kostenlos",
    models: "{{count}} Modelle",
    voices: "{{count}} Stimmen",
    open: "Öffnen",
  },
  asyncProgress:
    "Läuft. Video und Musik brauchen meist ein bis drei Minuten. Den Fortschritt siehst du auch in deinem Verlauf.",
  ooc: {
    title: "Gratis-Credits reichen nicht",
    need: "Dieser Lauf kostet {{amount}} Credits.",
    description:
      "Ein kostenloses Konto bekommt {{signedIn}} Credits im Monat, {{max}} mit Newsletter. Nach der Anmeldung bist du wieder hier, deine Einstellungen bleiben erhalten.",
    signUp: "Kostenlos registrieren",
    defaults: "Günstigere Einstellungen",
    haveAccount: "Schon ein Konto?",
    logIn: "Anmelden",
  },
  moreOptions: "Weitere Optionen",
  modelDefault: "Automatisch",
  model: "Modell",
  voice: "Stimme",
  estimate: "Geschätzte Kosten",
  credits: "{{amount}} Credits",
  failed: "Erstellung fehlgeschlagen",
  historyError:
    "Dein Studioverlauf lässt sich gerade nicht öffnen. Versuch es erneut.",
  unavailable: "Für dieses Format ist gerade kein Modell verfügbar.",
  file: "Audiodatei",
  language: "Sprache der Aufnahme",
  referenceAudio: "URL der Audiovorlage",
  durationSeconds: "Aufnahmelänge in Sekunden",
  duration: "Dauer",
  ratio: "Seitenverhältnis",
  size: "Größe",
  quality: "Qualität",
  reference: "URL des Referenzbilds",
  lastFrame: "URL des Schlussbilds",
  creating: "In Arbeit · {{seconds}} s",
  submitImage: "Bild erstellen",
  submitVideo: "Video erstellen",
  submitMusic: "Musik erstellen",
  submitSpeech: "Sprache erzeugen",
  submitTranscribe: "Audio transkribieren",
  meteredCost: "Für die Abrechnung zählt der vom Anbieter gemeldete Verbrauch.",
  estimatePending: "Füge eine Audiodatei für die Kostenschätzung hinzu.",
  needsCredits: "Braucht {{amount}} Credits",
  units: {
    image: "{{amount}} Credits / Bild",
    video: "{{amount}} Credits / Sek.",
    music: "{{amount}} Credits / Stück",
    speech: "{{amount}} Credits / 1.000 Zeichen",
    transcribe: "{{amount}} Credits / Min.",
    tokenImage: "≈ {{amount}} Credits / Bild",
  },
  kinds: {
    image: {
      label: "Bild",
      tab: "Bild",
      pitch:
        "Text zu Bild oder Bearbeitung einer Vorlage. Fotorealistisch, Anime, Kunst, was immer du beschreibst.",
      title: "Bild erstellen",
      metaTitle: "Unzensierter KI-Bildgenerator: {{appName}}",
      metaDescription:
        "Bilder aus Text erzeugen oder ein Referenzfoto bearbeiten. Mainstream- und unzensierte Modelle nebeneinander, von fotoreal bis Anime. Bezahlt wird pro Ergebnis.",
      description: "Beschreibe dein Motiv und wähle den Bildausschnitt.",
      keywords: "unzensierter KI-Bildgenerator, KI-Kunst, Text zu Bild",
    },
    video: {
      label: "Video",
      tab: "Video",
      pitch:
        "Aus Text oder einem Startbild wird ein Clip. Länge, Format und Auflösung bestimmst du.",
      title: "Video erstellen",
      metaTitle: "KI-Videogenerator: {{appName}}",
      metaDescription:
        "Aus einem Prompt oder einem Startbild wird ein Videoclip. Länge, Seitenverhältnis und Auflösung wählst du selbst. Bezahlt wird pro Ergebnis.",
      description:
        "Bring deine Szene in Bewegung, vom ersten bis zum letzten Bild.",
      keywords: "KI-Videogenerator, Text zu Video, Bild zu Video",
    },
    music: {
      label: "Musik",
      tab: "Musik",
      pitch:
        "Ein kompletter Track aus einem Prompt: Stimmung, Genre, Instrumente, Länge.",
      title: "Musik komponieren",
      metaTitle: "KI-Musikgenerator: {{appName}}",
      metaDescription:
        "Ein kompletter Track aus einem Prompt: Stimmung, Genre, Instrumente und Länge. Mehrere Musikmodelle in einem Studio. Bezahlt wird pro Ergebnis.",
      description: "Bestimme Stimmung, Instrumente und Länge deines Stücks.",
      keywords: "KI-Musikgenerator, Text zu Musik, KI-Song",
    },
    speech: {
      label: "Stimme",
      tab: "Stimme",
      pitch:
        "Dein Skript, vorgelesen von natürlichen Stimmen in vielen Sprachen.",
      title: "Text vertonen",
      metaTitle: "KI-Sprachausgabe: {{appName}}",
      metaDescription:
        "Skript einfügen, Stimme wählen, Audio herunterladen. Natürliche KI-Stimmen in vielen Sprachen von mehreren Anbietern. Bezahlt wird pro Ergebnis.",
      description: "Wähle die Stimme, die dein Skript vorlesen soll.",
      keywords: "Text zu Sprache, KI-Stimme, TTS",
    },
    transcribe: {
      label: "Transkript",
      tab: "Text",
      pitch:
        "Aufnahme hochladen, sauberen Text zurückbekommen. Als Datei herunterladen.",
      title: "Aufnahme transkribieren",
      metaTitle: "KI-Transkription: {{appName}}",
      metaDescription:
        "Aufnahme hochladen, sauberen Text als Datei zurückbekommen. Präzise Spracherkennung in vielen Sprachen. Bezahlt wird pro Ergebnis.",
      description:
        "Verwandle eine Aufnahme in ein Transkript zum Herunterladen.",
      keywords: "Sprache zu Text, KI-Transkription, Audio zu Text",
    },
  },
};
