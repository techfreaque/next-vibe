import type { translations as EnglishGetTranslations } from "../../../en/leadsErrors/leadsStats/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Lead-Statistik-Validierung fehlgeschlagen",
      description: "Lead-Statistik-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Lead-Statistik-Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung für den Zugriff auf Lead-Statistiken",
    },
    server: {
      title: "Lead-Statistik Serverfehler",
      description:
        "Lead-Statistiken konnten aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Lead-Statistik-Zugriff fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Laden der Lead-Statistiken ist aufgetreten",
    },
    forbidden: {
      title: "Lead-Statistik-Zugriff verboten",
      description:
        "Sie haben keine Berechtigung, auf Lead-Statistiken zuzugreifen",
    },
  },
  success: {
    title: "Lead-Statistiken geladen",
    description: "Lead-Statistiken erfolgreich abgerufen",
  },
};
