import type { basicStreamTranslations as EnglishBasicStreamTranslations } from "../../../en/sections/streamingErrors/basicStream";

export const basicStreamTranslations: typeof EnglishBasicStreamTranslations = {
  error: {
    validation: {
      title: "Basic Stream Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Streaming-Parameter und versuchen Sie es erneut",
    },
    network: {
      title: "Basic Stream Netzwerkfehler",
      description: "Verbindung zum Streaming Service fehlgeschlagen",
    },
    unauthorized: {
      title: "Basic Stream Unberechtigt",
      description: "Sie haben keine Berechtigung für Basic Streaming",
    },
    server: {
      title: "Basic Stream Serverfehler",
      description:
        "Ein Fehler ist bei der Verarbeitung Ihrer Stream Anfrage aufgetreten",
    },
    unknown: {
      title: "Basic Stream Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist beim Streaming aufgetreten",
    },
    initialization: "Streaming-Verbindung konnte nicht initialisiert werden",
    processing: "Verarbeitung der Streaming Anfrage fehlgeschlagen",
    noReader: "Kein Response Body Reader verfügbar",
    httpStatus: {
      "400": "Ungültige Anfrage",
      "401": "Unberechtigt",
      "403": "Verboten",
      "404": "Nicht gefunden",
      "500": "Interner Serverfehler",
    },
  },
  success: {
    title: "Basic Stream Erfolgreich",
    description: "Basic Streaming erfolgreich abgeschlossen",
  },
};
