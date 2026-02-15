import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  badge: "Benutzerdetails",
  get: {
    title: "Benutzer anzeigen",
    description: "Detaillierte Informationen über einen Benutzer anzeigen",
  },
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description:
        "Bitte überprüfen Sie die Benutzer-ID und versuchen Sie es erneut",
    },
    network: {
      title: "Verbindungsfehler",
      description:
        "Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Bitte melden Sie sich an, um Benutzerdetails anzuzeigen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung, diesen Benutzer anzuzeigen",
    },
    notFound: {
      title: "Benutzer nicht gefunden",
      description: "Wir konnten diesen Benutzer nicht finden",
    },
    serverError: {
      title: "Ein Fehler ist aufgetreten",
      description:
        "Die Benutzerdetails konnten nicht geladen werden. Bitte versuchen Sie es erneut",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description:
        "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben Änderungen, die noch nicht gespeichert wurden",
    },
    conflict: {
      title: "Datenkonflikt",
      description:
        "Die Benutzerdaten haben sich geändert. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut",
    },
  },
  success: {
    title: "Benutzer geladen",
    description: "Benutzerdetails erfolgreich geladen",
  },
};
