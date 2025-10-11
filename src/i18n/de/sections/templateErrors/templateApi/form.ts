import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/templateErrors/templateApi/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Vorlagen-API Validierung fehlgeschlagen",
      description: "Bitte überprüfe Ihre Vorlagen-Daten und versuche es erneut",
    },
    unauthorized: {
      title: "Zugriff auf Vorlagen-API verweigert",
      description:
        "Sie haben keine Berechtigung, auf die Vorlagen-API zuzugreifen",
    },
    server: {
      title: "Vorlagen-API Server-Fehler",
      description:
        "Vorlagen-Anfrage konnte aufgrund eines Server-Fehlers nicht verarbeitet werden",
    },
    unknown: {
      title: "Vorlagen-API fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Verarbeitung der Vorlagen-Anfrage aufgetreten",
    },
  },
  success: {
    title: "Vorlagen-API Operation erfolgreich",
    description: "Vorlagen-API Operation wurde erfolgreich abgeschlossen",
  },
};
