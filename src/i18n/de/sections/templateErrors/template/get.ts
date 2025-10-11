import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/templateErrors/template/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Validierung der Vorlagen-Daten fehlgeschlagen",
      description: "Die Vorlagen-Datenabfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Zugriff auf Vorlagen-Daten verweigert",
      description:
        "Sie haben keine Berechtigung, auf Vorlagen-Daten zuzugreifen",
    },
    server: {
      title: "Server-Fehler bei Vorlagen-Daten",
      description:
        "Vorlagen-Daten konnten aufgrund eines Server-Fehlers nicht geladen werden",
    },
    unknown: {
      title: "Zugriff auf Vorlagen-Daten fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Laden der Vorlagen-Daten aufgetreten",
    },
  },
};
