import type { translations as EnglishFormTranslations } from "../../../en/authErrors/signup/form";

export const translations: typeof EnglishFormTranslations = {
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
