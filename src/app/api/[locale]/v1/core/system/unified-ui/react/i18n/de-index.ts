import { translations as hooksTranslations } from "../hooks/i18n/de";
import type { translations as enTranslations } from "./en-index";

export const translations: typeof enTranslations = {
  hooks: hooksTranslations,
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
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
