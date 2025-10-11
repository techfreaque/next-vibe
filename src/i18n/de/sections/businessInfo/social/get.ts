import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/social/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Social-Media-Abruf-Validierung fehlgeschlagen",
      description: "Ungültige Anfrage-Parameter für den Social-Media-Abruf",
    },
    unauthorized: {
      title: "Zugriff auf Social Media verweigert",
      description:
        "Sie haben keine Berechtigung, auf Social-Media-Informationen zuzugreifen",
    },
    server: {
      title: "Social-Media Server-Fehler",
      description:
        "Social-Media-Daten konnten aufgrund eines Server-Fehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Social-Media-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Social-Media-Daten aufgetreten",
    },
  },
  success: {
    title: "Social-Media-Informationen erfolgreich geladen",
    description: "Ihre Social-Media-Informationen wurden abgerufen",
  },
};
