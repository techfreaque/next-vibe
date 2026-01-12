import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Datei hochladen",
  description: "Datei über ein bereitgestelltes Element hochladen",
  form: {
    label: "Datei hochladen",
    description: "Datei zu einem Dateiauswahl-Element hochladen",
    fields: {
      uid: {
        label: "Element-UID",
        description:
          "Die UID des Dateiauswahl-Elements oder eines Elements, das den Dateiwähler öffnet",
        placeholder: "Element-UID eingeben",
      },
      filePath: {
        label: "Dateipfad",
        description: "Der lokale Pfad der hochzuladenden Datei",
        placeholder: "Dateipfad eingeben",
      },
    },
  },
  response: {
    success: "Datei-Upload erfolgreich",
    result: "Ergebnis des Datei-Uploads",
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
        "Ein Netzwerkfehler ist während des Datei-Uploads aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Datei-Uploads durchzuführen",
    },
    forbidden: { title: "Verboten", description: "Datei-Upload ist verboten" },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist während des Datei-Uploads aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während des Datei-Uploads aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Datei-Uploads aufgetreten",
    },
  },
  success: {
    title: "Datei-Upload erfolgreich",
    description: "Die Datei wurde erfolgreich hochgeladen",
  },
};
