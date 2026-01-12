import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Seite auswählen",
  description: "Eine Seite als Kontext für zukünftige Tool-Aufrufe auswählen",
  form: {
    label: "Seite auswählen",
    description: "Eine Seite nach ihrem Index auswählen",
    fields: {
      pageIdx: {
        label: "Seitenindex",
        description:
          "Der Index der auszuwählenden Seite (list_pages aufrufen um Seiten aufzulisten)",
        placeholder: "Seitenindex eingeben",
      },
    },
  },
  response: {
    success: "Seitenauswahl erfolgreich",
    result: "Ergebnis der Seitenauswahl",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Ein Netzwerkfehler ist beim Auswählen der Seite aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Seiten auszuwählen",
    },
    forbidden: { title: "Verboten", description: "Seitenauswahl ist verboten" },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Auswählen der Seite aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Auswählen der Seite aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Auswählen der Seite aufgetreten",
    },
  },
  success: {
    title: "Seite erfolgreich ausgewählt",
    description: "Die Seite wurde erfolgreich ausgewählt",
  },
};
