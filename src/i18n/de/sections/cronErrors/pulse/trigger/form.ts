import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/cronErrors/pulse/trigger/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Pulse-Auslösung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Pulse-Auslösung-Parameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Pulse-Auslösung nicht berechtigt",
      description: "Sie haben keine Berechtigung, Pulse-Operationen auszulösen",
    },
    server: {
      title: "Pulse-Auslösung Serverfehler",
      description:
        "Pulse konnte aufgrund eines Serverfehlers nicht ausgelöst werden",
    },
    unknown: {
      title: "Pulse-Auslösung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Auslösen des Pulse aufgetreten",
    },
  },
  success: {
    title: "Pulse erfolgreich ausgelöst",
    description: "Pulse-Ausführung wurde erfolgreich ausgelöst",
  },
};
