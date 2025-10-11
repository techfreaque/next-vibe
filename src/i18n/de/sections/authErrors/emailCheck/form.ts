import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/emailCheck/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "E-Mail-Verifizierung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre E-Mail-Adresse und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "E-Mail-Verifizierung nicht berechtigt",
      description: "Sie haben keine Berechtigung, diese E-Mail zu verifizieren",
    },
    server: {
      title: "E-Mail-Verifizierung Serverfehler",
      description:
        "E-Mail konnte aufgrund eines Serverfehlers nicht verifiziert werden",
    },
    unknown: {
      title: "E-Mail-Verifizierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der E-Mail-Verifizierung aufgetreten",
    },
  },
  success: {
    title: "E-Mail-Verifizierung erfolgreich",
    description: "Ihre E-Mail-Adresse wurde verifiziert",
  },
};
