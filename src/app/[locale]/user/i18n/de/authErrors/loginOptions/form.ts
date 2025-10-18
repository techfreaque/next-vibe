import type { translations as EnglishFormTranslations } from "../../../en/authErrors/loginOptions/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Anmeldeoptionen-Validierung fehlgeschlagen",
      description: "Anmeldeoptionen-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Anmeldeoptionen nicht berechtigt",
      description:
        "Sie haben keine Berechtigung, auf Anmeldeoptionen zuzugreifen",
    },
    server: {
      title: "Anmeldeoptionen Serverfehler",
      description:
        "Anmeldeoptionen konnten aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Anmeldeoptionen fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Laden der Anmeldeoptionen aufgetreten",
    },
  },
  success: {
    title: "Anmeldeoptionen geladen",
    description: "Verfügbare Anmeldeoptionen wurden geladen",
  },
};
