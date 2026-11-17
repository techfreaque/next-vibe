import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "KI-Generierung",
    imageAlt: "{{appName}} {{title}}",
  },
  eyebrow: "Erstellen",
  back: "Alle Modelle",
  chat: {
    title: "Lieber einfach fragen?",
    body: "Jedes Chatmodell erledigt das für dich. Beschreib, was du willst, es wählt die Einstellungen.",
    cta: "Chat öffnen",
  },
  kinds: {
    image: {
      label: "Bild",
      title: "KI-Bildgenerator",
      metaTitle: "Unzensierter KI-Bildgenerator - {{appName}}",
      description:
        "Modell, Größe und Seitenverhältnis wählen. Prompt eingeben. Bezahlt wird pro Bild mit deinen Credits.",
      keywords: "unzensierter KI-Bildgenerator, KI-Kunst, Text zu Bild",
    },
    video: {
      label: "Video",
      title: "KI-Videogenerator",
      metaTitle: "KI-Videogenerator - {{appName}}",
      description:
        "Volle Kontrolle: Modell, Länge, Seitenverhältnis, Auflösung, erstes und letztes Bild. Bezahlt wird pro Clip mit deinen Credits.",
      keywords: "KI-Videogenerator, Text zu Video, Bild zu Video",
    },
    music: {
      label: "Musik",
      title: "KI-Musikgenerator",
      metaTitle: "KI-Musikgenerator - {{appName}}",
      description:
        "Track beschreiben, Modell und Länge wählen. Bezahlt wird pro Song mit deinen Credits.",
      keywords: "KI-Musikgenerator, Text zu Musik, KI-Song",
    },
    speech: {
      label: "Sprache",
      title: "Text zu Sprache",
      metaTitle: "KI-Sprachausgabe - {{appName}}",
      description:
        "Skript einfügen, Stimme wählen, Audio bekommen. Auch lange Texte. Bezahlt wird pro Zeichen mit deinen Credits.",
      keywords: "Text zu Sprache, KI-Stimme, TTS",
    },
    transcribe: {
      label: "Transkribieren",
      title: "Sprache zu Text",
      metaTitle: "KI-Transkription - {{appName}}",
      description:
        "Meetings, Interviews oder Sprachnotizen hochladen. Modell wählen, Transkript bekommen. Bezahlt wird pro Audiosekunde mit deinen Credits.",
      keywords: "Sprache zu Text, KI-Transkription, Audio zu Text",
    },
  },
};
