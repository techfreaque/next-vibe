import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: { payment: "zahlung", estimate: "angebot", lines: "positionen" },
  post: {
    title: "Angebotsposition entfernen",
    titleShort: "Zeile entfernen",
    description: "Eine Position aus dem Angebotsentwurf entfernen",
    form: {
      title: "Angebotsposition entfernen",
      description: "Diese Position aus dem Angebot entfernen",
    },
    response: { success: "Erfolgreich", message: "Statusmeldung" },
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
      forbidden: { title: "Zugriff verweigert", description: "Kein Zugriff" },
      notFound: {
        title: "Nicht gefunden",
        description: "Position nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Angebot muss im Entwurfsstatus sein",
      },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Position entfernt",
      description: "Position wurde aus dem Angebot entfernt",
    },
  },
  lineId: { label: "Positions-ID", description: "Die zu entfernende Position" },
  widget: {
    back: "Zurück",
    submit: "Position entfernen",
    removed: "Position aus dem Angebot entfernt.",
    confirmTitle: "Diese Position entfernen?",
    confirmDescription:
      "Die Position wird dauerhaft aus dem Angebot entfernt. Die Gesamtsumme wird neu berechnet.",
    confirmButton: "Entfernen",
    cancelButton: "Abbrechen",
  },
};
