import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abonnement",
    company: "Unternehmen",
    list: "Liste",
  },
  get: {
    title: "Unternehmensabonnements",
    description: "Alle Abonnements eines Unternehmens auflisten",
    companyId: {
      label: "Unternehmens-ID",
      description:
        "Das Unternehmen, dessen Abonnements aufgelistet werden sollen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Unternehmens-ID",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmensabonnements aufzulisten",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Kein Zugriff auf die Abonnements dieses Unternehmens",
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
        title: "Unternehmen nicht gefunden",
        description: "Dieses Unternehmen existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Abonnements geladen",
      description: "Unternehmensabonnements abgerufen",
    },
  },
};
