import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Seiten auflisten",
  description: "Liste der im Browser geöffneten Seiten abrufen",
  form: {
    label: "Seiten auflisten",
    description: "Alle geöffneten Browser-Seiten abrufen",
    fields: {},
  },
  response: {
    success: "Seitenauflistung erfolgreich",
    result: {
      title: "Ergebnis",
      description: "Ergebnis der Seitenauflistung",
      pages: {
        idx: "Index",
        title: "Titel",
        url: "URL",
        active: "Aktiv",
      },
      totalCount: "Gesamtanzahl",
    },
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist beim Auflisten der Seiten aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Seiten aufzulisten",
    },
    forbidden: {
      title: "Verboten",
      description: "Seitenauflistung ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist beim Auflisten der Seiten aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist beim Auflisten der Seiten aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Auflisten der Seiten aufgetreten",
    },
  },
  success: {
    title: "Seiten erfolgreich aufgelistet",
    description: "Die geöffneten Seiten wurden erfolgreich aufgelistet",
  },
};
