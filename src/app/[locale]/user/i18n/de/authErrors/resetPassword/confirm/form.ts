import type { translations as EnglishFormTranslations } from "../../../../en/authErrors/resetPassword/confirm/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Passwort-Bestätigung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihr neues Passwort und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Passwort zurücksetzen nicht berechtigt",
      description:
        "Ihr Token zum Zurücksetzen des Passworts ist ungültig oder abgelaufen",
    },
    server: {
      title: "Passwort zurücksetzen Serverfehler",
      description:
        "Passwort konnte aufgrund eines Serverfehlers nicht zurückgesetzt werden",
    },
    unknown: {
      title: "Passwort zurücksetzen fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Zurücksetzen des Passworts aufgetreten",
    },
  },
};
