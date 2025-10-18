import type { translations as EnglishFormTranslations } from "../../../../en/authErrors/resetPassword/request/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Passwort zurücksetzen Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre E-Mail-Adresse und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Passwort zurücksetzen nicht erlaubt",
      description:
        "Sie haben keine Berechtigung, dieses Passwort zurückzusetzen",
    },
    server: {
      title: "Passwort zurücksetzen Serverfehler",
      description:
        "E-Mail zum Zurücksetzen des Passworts konnte aufgrund eines Serverfehlers nicht gesendet werden",
    },
    unknown: {
      title: "Passwort zurücksetzen fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Anfordern des Passwort-Resets aufgetreten",
    },
  },
  success: {
    title: "E-Mail zum Zurücksetzen des Passworts gesendet",
    description:
      "Bitte überprüfen Sie Ihre E-Mails für Anweisungen zum Zurücksetzen des Passworts",
  },
};
