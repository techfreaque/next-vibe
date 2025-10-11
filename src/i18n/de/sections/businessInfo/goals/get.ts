import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/goals/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Validierung des Ziele-Abrufs fehlgeschlagen",
      description: "Ungültige Anfrage-Parameter für den Abruf der Ziele",
    },
    unauthorized: {
      title: "Zugriff auf Ziele verweigert",
      description:
        "Sie haben keine Berechtigung, auf Ziele-Informationen zuzugreifen",
    },
    server: {
      title: "Ziele Server-Fehler",
      description:
        "Ziele konnten aufgrund eines Server-Fehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Abruf der Ziele fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Ziele aufgetreten",
    },
  },
  success: {
    title: "Ziele-Informationen erfolgreich geladen",
    description: "Ihre Geschäftsziele-Informationen wurden abgerufen",
  },
};
