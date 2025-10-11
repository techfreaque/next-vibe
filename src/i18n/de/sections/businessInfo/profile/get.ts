import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/profile/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Profil-Validierung fehlgeschlagen",
      description: "Ungültige Anfrage-Parameter für den Abruf des Profils.",
    },
    unauthorized: {
      title: "Zugriff auf Profil verweigert",
      description:
        "Sie haben keine Berechtigung, auf Profil-Informationen zuzugreifen.",
    },
    server: {
      title: "Profil Server-Fehler",
      description:
        "Profil-Informationen konnten aufgrund eines Server-Fehlers nicht abgerufen werden.",
    },
    unknown: {
      title: "Abruf des Profils fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Profil-Informationen aufgetreten.",
    },
  },
  success: {
    title: "Profil abgerufen",
    description: "Profil-Informationen wurden erfolgreich abgerufen.",
  },
};
