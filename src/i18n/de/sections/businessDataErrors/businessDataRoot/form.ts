import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessDataErrors/businessDataRoot/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Geschäftsdaten-Root-Validierung fehlgeschlagen",
      description: "Geschäftsdaten-Root-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Geschäftsdaten-Root nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, auf Geschäftsdaten-Root zuzugreifen",
    },
    server: {
      title: "Geschäftsdaten-Root-Serverfehler",
      description:
        "Zugriff auf Geschäftsdaten-Root aufgrund eines Serverfehlers nicht möglich",
    },
    unknown: {
      title: "Geschäftsdaten-Root fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Zugriff auf Geschäftsdaten-Root aufgetreten",
    },
  },
  success: {
    title: "Geschäftsdaten-Root erfolgreich abgerufen",
    description: "Geschäftsdaten-Root-Informationen wurden geladen",
  },
};
