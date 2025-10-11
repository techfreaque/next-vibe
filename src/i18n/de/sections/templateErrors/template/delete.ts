import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/templateErrors/template/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Validierung der Vorlagen-Löschung fehlgeschlagen",
      description:
        "Bitte überprüfe Ihre Löschungsanfrage und versuche es erneut",
    },
    unauthorized: {
      title: "Vorlagen-Löschung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Vorlagen zu löschen",
    },
    server: {
      title: "Server-Fehler bei Vorlagen-Löschung",
      description:
        "Vorlage konnte aufgrund eines Server-Fehlers nicht gelöscht werden",
    },
    unknown: {
      title: "Vorlagen-Löschung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Löschen der Vorlage aufgetreten",
    },
  },
};
