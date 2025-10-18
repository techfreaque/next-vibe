import type { translations as EnglishFormTranslations } from "../../../../en/authErrors/resetPassword/validate/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Token-Validierung fehlgeschlagen",
      description:
        "Das Token zum Zurücksetzen des Passworts ist ungültig oder fehlerhaft",
    },
    unauthorized: {
      title: "Token nicht berechtigt",
      description:
        "Ihr Token zum Zurücksetzen des Passworts ist ungültig oder abgelaufen",
    },
    server: {
      title: "Token-Validierung Serverfehler",
      description:
        "Token konnte aufgrund eines Serverfehlers nicht validiert werden",
    },
    unknown: {
      title: "Token-Validierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Token-Validierung aufgetreten",
    },
  },
  success: {
    title: "Token-Validierung erfolgreich",
    description:
      "Das Token zum Zurücksetzen des Passworts ist gültig und einsatzbereit",
  },
};
