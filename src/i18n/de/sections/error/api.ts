import type { apiTranslations as EnglishApiTranslations } from "../../../en/sections/error/api";

export const apiTranslations: typeof EnglishApiTranslations = {
  store: {
    errors: {
      validation_failed: "Validierung für Store-Operation fehlgeschlagen",
      request_failed: "Store-Anfrage fehlgeschlagen: {{error}}",
      mutation_failed: "Store-Mutation fehlgeschlagen: {{error}}",
      unexpected_failure: "Unerwarteter Store-Fehler: {{error}}",
      refetch_failed: "Fehler beim Aktualisieren der Store-Daten: {{error}}",
    },
    status: {
      loading_data: "Daten werden geladen...",
      cached_data: "Zwischengespeicherte Daten werden angezeigt",
      success: "Bereit",
      disabled: "Abfrage deaktiviert",
      mutation_pending: "Speichern...",
      mutation_success: "Erfolgreich gespeichert",
    },
  },
  query: {
    errors: {
      refetch_failed: "Fehler beim Aktualisieren der Abfragedaten: {{error}}",
    },
  },
  mutation: {
    errors: {
      execution_failed: "Fehler beim Ausführen der Mutation: {{error}}",
    },
  },
  form: {
    errors: {
      validation_failed: "Formular-Validierung fehlgeschlagen: {{message}}",
      network_failure: "Netzwerkfehler beim Senden des Formulars: {{error}}",
    },
  },
  errors: {
    too_many_requests:
      "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
    invalid_request_data: "Ungültige Anfragedaten: {{message}}",
    internal_server_error: "Interner Serverfehler: {{error}}",
    http_error: "HTTP-Fehler: {{error}}",
  },
};
