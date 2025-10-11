import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/availability/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Verfügbarkeit Validierung fehlgeschlagen",
      description: "Verfügbarkeits-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Verfügbarkeit nicht berechtigt",
      description: "Sie haben keine Berechtigung, die Verfügbarkeit zu prüfen",
    },
    server: {
      title: "Verfügbarkeit Serverfehler",
      description:
        "Verfügbarkeit konnte aufgrund eines Serverfehlers nicht geprüft werden",
    },
    unknown: {
      title: "Verfügbarkeitsprüfung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Verfügbarkeitsprüfung aufgetreten",
    },
  },
  success: {
    title: "Verfügbarkeit erfolgreich geladen",
    description: "Verfügbare Beratungszeiten wurden abgerufen",
  },
};
