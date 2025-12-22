import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Netzwerk-Anfrage abrufen",
  description:
    "Ruft eine Netzwerk-Anfrage über eine optionale reqid ab, bei Weglassen wird die aktuell ausgewählte Anfrage im DevTools Network-Panel zurückgegeben",
  form: {
    label: "Netzwerk-Anfrage abrufen",
    description:
      "Eine bestimmte Netzwerk-Anfrage oder die aktuell ausgewählte abrufen",
    fields: {
      reqid: {
        label: "Anfrage-ID",
        description:
          "Die reqid der Netzwerk-Anfrage (weglassen für aktuell ausgewählte Anfrage in DevTools)",
        placeholder: "Anfrage-ID eingeben",
      },
    },
  },
  response: {
    success: "Netzwerk-Anfrage erfolgreich abgerufen",
    result: "Ergebnis des Abrufs der Netzwerk-Anfrage",
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
        "Ein Netzwerkfehler ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Netzwerk-Anfragen abzurufen",
    },
    forbidden: {
      title: "Verboten",
      description: "Abrufen von Netzwerk-Anfragen ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Ein Konflikt ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
    },
  },
  success: {
    title: "Netzwerk-Anfrage erfolgreich abgerufen",
    description: "Die Netzwerk-Anfrage wurde erfolgreich abgerufen",
  },
};
