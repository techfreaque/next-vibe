import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/onboardingErrors/status/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Status-Abruf-Validierung fehlgeschlagen",
      description: "Ungültige Anfrageparameter für Status-Abruf",
    },
    unauthorized: {
      title: "Status-Abruf-Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, auf den Onboarding-Status zuzugreifen",
    },
    server: {
      title: "Status-Abruf-Serverfehler",
      description:
        "Onboarding-Status konnte aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Status-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Onboarding-Status aufgetreten",
    },
  },
  success: {
    title: "Status erfolgreich abgerufen",
    description: "Onboarding-Status wurde erfolgreich abgerufen",
  },
};
