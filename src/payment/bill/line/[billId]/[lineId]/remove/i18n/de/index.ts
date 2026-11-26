import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    bill: "beleg",
    lines: "positionen",
  },
  post: {
    title: "Belegposition entfernen",
    titleShort: "Zeile entfernen",
    description: "Eine Position aus einem Lieferantenbelegentwurf entfernen",
    form: {
      title: "Position entfernen",
      description: "Entfernt diese Position aus dem Entwurf.",
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
        description:
          "Die Position kann nur aus einem bearbeitbaren Belegentwurf entfernt werden.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Die Belegposition wurde entfernt.",
    },
  },
  billId: {
    label: "Lieferantenbeleg",
    description: "Lieferantenbeleg mit der zu entfernenden Position",
  },
  lineId: {
    label: "Positions-ID",
    description: "ID der zu entfernenden Position",
    placeholder: "Positions-ID eingeben",
  },
  widget: {
    verifying: "Ausgewählte Position wird geprüft…",
    unavailable:
      "Diese Position kann nicht mehr entfernt werden. Öffnen Sie den Entwurf erneut und prüfen Sie die aktuellen Positionen.",
    lineGross: "Bruttobetrag der Position: {{amount}}",

    back: "Zurück",
    submit: "Position entfernen",
    warning:
      "Die Position wird dauerhaft entfernt und der Entwurf neu berechnet.",
    confirm: "Position entfernen",
    removed: "Position entfernt",
  },
};
