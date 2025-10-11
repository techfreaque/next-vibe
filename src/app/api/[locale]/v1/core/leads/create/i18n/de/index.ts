import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Lead erstellen",
    description: "Einen neuen Lead im System erstellen",
    form: {
      title: "Neues Lead-Formular",
      description: "Lead-Informationen eingeben um einen neuen Lead zu erstellen",
    },
    response: {
      title: "Erstellter Lead",
      description: "Details des neu erstellten Leads",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um Leads zu erstellen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Lead-Informationen angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Erstellen des Leads",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Erstellen des Leads",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Erstellen des Leads",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Lead-Erstellung verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benötigte Ressource für Lead-Erstellung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Lead existiert bereits oder Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen im Lead-Formular",
      },
    },
    success: {
      title: "Lead erstellt",
      description: "Lead erfolgreich erstellt",
    },
  },
} ;
