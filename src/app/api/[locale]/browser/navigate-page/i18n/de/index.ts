import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Seite navigieren",
  description: "Die aktuell ausgewählte Seite navigieren",
  form: {
    label: "Seite navigieren",
    description: "Die aktuell ausgewählte Seite zu einer URL oder durch die Historie navigieren",
    fields: {
      type: {
        label: "Navigationstyp",
        description: "Navigieren nach URL, zurück oder vorwärts in der Historie, oder neu laden",
        placeholder: "Navigationstyp auswählen",
        options: {
          url: "URL",
          back: "Zurück",
          forward: "Vorwärts",
          reload: "Neu laden",
        },
      },
      url: {
        label: "URL",
        description: "Ziel-URL (nur für type=url)",
        placeholder: "URL eingeben",
      },
      ignoreCache: {
        label: "Cache ignorieren",
        description: "Ob Cache beim Neuladen ignoriert werden soll",
        placeholder: "Cache ignorieren",
      },
      timeout: {
        label: "Zeitlimit",
        description: "Maximale Wartezeit in Millisekunden (0 für Standard)",
        placeholder: "Zeitlimit eingeben",
      },
    },
  },
  response: {
    success: "Navigation erfolgreich",
    result: "Ergebnis der Navigation",
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
      description: "Ein Netzwerkfehler ist während der Navigation aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Seiten zu navigieren",
    },
    forbidden: {
      title: "Verboten",
      description: "Seitennavigation ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist während der Navigation aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist während der Navigation aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während der Navigation aufgetreten",
    },
  },
  success: {
    title: "Navigation erfolgreich",
    description: "Die Seite wurde erfolgreich navigiert",
  },
};
