import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/status/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Status Validierung fehlgeschlagen",
      description: "Status-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Status nicht berechtigt",
      description:
        "Sie haben keine Berechtigung, den Beratungsstatus zu prüfen",
    },
    server: {
      title: "Status Serverfehler",
      description:
        "Status konnte aufgrund eines Serverfehlers nicht geprüft werden",
    },
    unknown: {
      title: "Statusprüfung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Statusprüfung aufgetreten",
    },
  },
  success: {
    title: "Status erfolgreich abgerufen",
    description: "Beratungsstatus wurde geladen",
  },
};
