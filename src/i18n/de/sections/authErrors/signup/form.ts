import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/signup/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Registrierung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Registrierungsdaten und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Registrierung nicht erlaubt",
      description: "Sie haben keine Berechtigung, ein Konto zu erstellen",
    },
    server: {
      title: "Registrierung Serverfehler",
      description:
        "Kontenerstellung aufgrund eines Serverfehlers nicht möglich",
    },
    unknown: {
      title: "Registrierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Registrierung aufgetreten",
    },
  },
  success: {
    title: "Registrierung erfolgreich",
    description: "Ihr Konto wurde erfolgreich erstellt",
  },
};
