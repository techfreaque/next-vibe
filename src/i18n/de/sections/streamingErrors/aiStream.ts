import type { aiStreamTranslations as EnglishAiStreamTranslations } from "../../../en/sections/streamingErrors/aiStream";

export const aiStreamTranslations: typeof EnglishAiStreamTranslations = {
  error: {
    validation: {
      title: "AI Stream Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabeparameter und versuchen Sie es erneut",
    },
    network: {
      title: "AI Stream Netzwerkfehler",
      description: "Verbindung zum AI Streaming Service fehlgeschlagen",
    },
    unauthorized: {
      title: "AI Stream Unberechtigt",
      description: "Sie haben keine Berechtigung für AI Streaming",
    },
    server: {
      title: "AI Stream Serverfehler",
      description:
        "Ein Fehler ist bei der Verarbeitung Ihrer AI Stream Anfrage aufgetreten",
    },
    unknown: {
      title: "AI Stream Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist beim AI Streaming aufgetreten",
    },
    apiKey: {
      missing: "OpenAI API-Schlüssel ist nicht konfiguriert",
      invalid: "OpenAI API-Schlüssel ist ungültig oder abgelaufen",
    },
    configuration: "AI Streaming Service ist nicht ordnungsgemäß konfiguriert",
    processing: "Verarbeitung der AI Streaming Anfrage fehlgeschlagen",
  },
  success: {
    title: "AI Stream Erfolgreich",
    description: "AI Streaming erfolgreich abgeschlossen",
  },
};
