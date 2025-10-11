import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/templateErrors/templateSubRoute/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Vorlagen-Unterroute Validierung fehlgeschlagen",
      description:
        "Bitte überprüfe Ihre Unterroute-Daten und versuche es erneut",
    },
    unauthorized: {
      title: "Zugriff auf Vorlagen-Unterroute verweigert",
      description:
        "Sie haben keine Berechtigung, auf die Vorlagen-Unterroute zuzugreifen",
    },
    server: {
      title: "Vorlagen-Unterroute Server-Fehler",
      description:
        "Unterroute-Anfrage konnte aufgrund eines Server-Fehlers nicht verarbeitet werden",
    },
    unknown: {
      title: "Vorlagen-Unterroute fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Verarbeitung der Unterroute-Anfrage aufgetreten",
    },
  },
  success: {
    title: "Unterroute-Operation erfolgreich",
    description: "Unterroute-Operation wurde erfolgreich abgeschlossen",
  },
};
