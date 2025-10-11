import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/templateErrors/template/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Validierung der Vorlagen-Erstellung fehlgeschlagen",
      description:
        "Bitte überprüfe Ihre Vorlagen-Informationen und versuche es erneut",
    },
    unauthorized: {
      title: "Vorlagen-Erstellung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Vorlagen zu erstellen",
    },
    server: {
      title: "Server-Fehler bei Vorlagen-Erstellung",
      description:
        "Vorlage konnte aufgrund eines Server-Fehlers nicht erstellt werden",
    },
    unknown: {
      title: "Vorlagen-Erstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Vorlagen-Erstellung aufgetreten",
    },
  },
};
