import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/onboardingErrors/onboarding/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Onboarding-Daten-Validierung fehlgeschlagen",
      description: "Onboarding-Datenanfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Onboarding-Datenzugriff verweigert",
      description:
        "Sie haben keine Berechtigung, auf Onboarding-Daten zuzugreifen",
    },
    server: {
      title: "Onboarding-Daten-Serverfehler",
      description:
        "Onboarding-Daten konnten aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Onboarding-Datenzugriff fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Laden der Onboarding-Daten aufgetreten",
    },
  },
  success: {
    title: "Onboarding-Daten erfolgreich abgerufen",
    description: "Ihr Onboarding-Fortschritt wurde geladen",
  },
};
