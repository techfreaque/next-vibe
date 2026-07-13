import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    lines: "positionen",
  },
  post: {
    title: "Rechnungsposition entfernen",
    titleShort: "Zeile entfernen",
    description: "Eine Position aus einer Entwurfsrechnung entfernen",
    form: {
      title: "Position entfernen",
      description: "Entfernt diese Position dauerhaft aus der Rechnung",
    },
    response: {
      success: "Position entfernt",
      message: "Statusmeldung",
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
        description: "Rechnungsposition nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Rechnung ist kein Entwurf",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Rechnungsposition entfernt",
    },
  },
  lineId: {
    label: "Positions-ID",
    description: "ID der zu entfernenden Position",
    placeholder: "Positions-ID eingeben",
  },
  widget: {
    back: "Zurück",
    submit: "Position entfernen",
    warning: "Diese Position wird dauerhaft aus der Rechnung entfernt.",
    confirm: "Position entfernen",
    removed: "Position entfernt",
  },
};
