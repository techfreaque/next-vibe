import type { translations as EnglishUpdateTranslations } from "../../../en/leadsErrors/batch/update";

export const translations: typeof EnglishUpdateTranslations = {
  success: {
    title: "Batch-Update erfolgreich",
    description: "Leads wurden erfolgreich aktualisiert",
  },
  error: {
    server: {
      title: "Batch-Update fehlgeschlagen",
      description:
        "Leads konnten aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    validation: {
      title: "Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie haben keine Berechtigung für Batch-Updates",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf Batch-Updates ist verboten",
    },
    not_found: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist beim Batch-Update aufgetreten",
    },
  },
  validation: {
    no_fields: "Mindestens ein Update-Feld muss angegeben werden",
  },
};
