import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abonnement",
    company: "Unternehmen",
    get: "Abrufen",
  },
  get: {
    title: "Unternehmensabonnement",
    description: "Aktives Abonnement eines Unternehmens abrufen",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das Unternehmen, dessen Abonnement abgerufen werden soll",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Unternehmens-ID",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmensabonnements anzuzeigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Kein Zugriff auf das Abonnement dieses Unternehmens",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen — bitte erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung prüfen und erneut versuchen",
      },
      notFound: {
        title: "Kein Abonnement gefunden",
        description: "Dieses Unternehmen hat kein Abonnement",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Abonnement geladen",
      description: "Unternehmensabonnement abgerufen",
    },
  },
};
