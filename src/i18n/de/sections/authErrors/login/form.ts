import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/login/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Anmeldung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Ungültige Anmeldedaten",
      description: "Die eingegebene E-Mail oder das Passwort ist falsch",
    },
    server: {
      title: "Anmeldung Serverfehler",
      description:
        "Anmeldung aufgrund eines Serverfehlers nicht möglich. Bitte versuchen Sie es später erneut",
    },
    unknown: {
      title: "Anmeldung fehlgeschlagen",
      description: "Ein unerwarteter Fehler ist bei der Anmeldung aufgetreten",
    },
  },
  success: {
    title: "Anmeldung erfolgreich",
    description: "Sie wurden erfolgreich angemeldet",
  },
};
