import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Emulieren",
  description: "Verschiedene Funktionen auf der ausgewählten Seite emulieren",
  form: {
    label: "Gerät emulieren",
    description: "Netzwerkbedingungen und CPU-Drosselung emulieren",
    fields: {
      networkConditions: {
        label: "Netzwerkbedingungen",
        description: "Netzwerk drosseln (auf Keine Emulation setzen zum Deaktivieren)",
        placeholder: "Netzwerkbedingung auswählen",
        options: {
          noEmulation: "Keine Emulation",
          offline: "Offline",
          slow3g: "Langsames 3G",
          fast3g: "Schnelles 3G",
          slow4g: "Langsames 4G",
          fast4g: "Schnelles 4G",
        },
      },
      cpuThrottlingRate: {
        label: "CPU-Drosselungsrate",
        description: "CPU-Verlangsamungsfaktor (1 zum Deaktivieren, 1-20)",
        placeholder: "Drosselungsrate eingeben",
      },
    },
  },
  response: {
    success: "Emulation erfolgreich",
    result: "Ergebnis der Emulation",
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
      description: "Ein Netzwerkfehler ist während der Emulation aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Gerätefunktionen zu emulieren",
    },
    forbidden: {
      title: "Verboten",
      description: "Geräteemulation ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist während der Emulation aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist während der Emulation aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während der Emulation aufgetreten",
    },
  },
  success: {
    title: "Emulation erfolgreich",
    description: "Gerätefunktionen wurden erfolgreich emuliert",
  },
};
