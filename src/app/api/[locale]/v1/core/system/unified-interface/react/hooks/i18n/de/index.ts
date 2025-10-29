import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  apiUtils: {
    errors: {
      http_error: "HTTP-Fehler",
      validation_error: "Validierungsfehler",
      internal_error: "Interner Fehler",
      auth_required: "Authentifizierung erforderlich",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Mutation fehlgeschlagen",
        },
        validation_error: {
          title: "Validierungsfehler",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Netzwerkfehler",
      validation_failed: "Validierung fehlgeschlagen",
    },
  },
  store: {
    errors: {
      validation_failed: "Validierung fehlgeschlagen",
      request_failed: "Anfrage fehlgeschlagen",
      mutation_failed: "Mutation fehlgeschlagen",
      unexpected_failure: "Unerwarteter Fehler",
      refetch_failed: "Erneutes Abrufen fehlgeschlagen",
    },
    status: {
      loading_data: "Daten werden geladen...",
      cached_data: "Zwischengespeicherte Daten werden verwendet",
      success: "Erfolgreich",
      mutation_pending: "Mutation ausstehend...",
      mutation_success: "Mutation erfolgreich",
    },
  },
};
