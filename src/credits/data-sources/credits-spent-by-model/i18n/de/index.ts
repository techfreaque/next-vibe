import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    group: {
      uncensoredAi: "Uncensored.ai (Uncensored LM)",
      zai: "Z.AI (GLM)",
      moonshot: "Moonshot (Kimi)",
      deepseek: "DeepSeek",
      venice: "Venice",
      xai: "xAI (Grok)",
      anthropic: "Anthropic (Claude)",
      openai: "OpenAI (GPT)",
      google: "Google (Gemini)",
      otherChat: "Andere Chatmodelle",
      image: "Bildgenerierung",
      video: "Videogenerierung",
      music: "Musikgenerierung",
      voice: "Sprache (TTS + STT)",
      tools: "Tools (Suche, Abruf, Gedächtnis)",
      unattributed: "Nicht zugeordnet",
    },
  },
  post: {
    titleShort: "Verbrauch nach Modell",
    title: "Verbrauchte Credits nach Modellfamilie",
    description:
      "Verbrauchte Credits pro Bucket für eine Gruppe: Chatmodelle nach Hersteller (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, andere), Bild, Video, Musik, Sprache, Tools. Alle Nutzer enthalten, die Gruppen ergeben zusammen den Gesamtverbrauch. In Credits.",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      group: {
        label: "Gruppe",
        description:
          "Modellfamilie (Chatmodelle nach Hersteller) oder Medien- / Tool-Gruppe",
      },
      result: {
        label: "Verbrauchte Credits",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Reihe berechnet",
      description: "Zeitreihe zurückgegeben",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: { title: "Serverfehler", description: "Abfrage fehlgeschlagen" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
