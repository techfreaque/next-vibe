import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: { payment: "zahlung", estimate: "angebot" },
  post: {
    title: "Angebot duplizieren",
    titleShort: "Angebot duplizieren",
    description: "Dieses Angebot als neuen Entwurf klonen",
    form: {
      title: "Angebot duplizieren",
      description: "Dieses Angebot als neuen Entwurf klonen",
    },
    response: {
      success: "Erfolgreich",
      message: "Statusmeldung",
      newEstimateId: "Neue Angebots-ID",
      estimateNumber: "Neue Angebotsnummer",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      server: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Kein Zugriff auf diese Ressource",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Angebot nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Aktion im aktuellen Status nicht möglich",
      },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Angebot dupliziert",
      description: "Ein neuer Angebotsentwurf wurde erstellt",
    },
  },
  estimateId: {
    label: "Angebots-ID",
    description: "Das zu duplizierende Angebot",
  },
  widget: {
    back: "Zurück",
    submit: "Angebot duplizieren",
    viewDuplicate: "Duplikat ansehen",
    duplicateNote:
      "Ein neuer Angebotsentwurf mit denselben Positionen und Details wird erstellt.",
  },
};
