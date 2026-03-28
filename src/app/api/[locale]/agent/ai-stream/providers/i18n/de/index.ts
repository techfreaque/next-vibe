import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    apiKeyNotConfigured: "API-Schlüssel nicht konfiguriert",
    noImageUrl: "Kein Bild-URL vom Anbieter zurückgegeben",
    noAudioUrl: "Keine Audio-URL vom Anbieter zurückgegeben",
    externalServiceError: "Externer Dienstfehler: {{message}}",
    requestFailed: "Anfrage fehlgeschlagen: {{message}}",
    requestAborted: "Anfrage abgebrochen",
    requestTimedOut: "Anfrage-Zeitüberschreitung",
    generationFailed: "Generierung fehlgeschlagen",
    pollFailed: "Abfrage fehlgeschlagen: HTTP {{status}}",
  },
};
