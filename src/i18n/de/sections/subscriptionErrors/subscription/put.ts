import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/subscriptionErrors/subscription/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Validierung der Abonnement-Aktualisierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Abonnement-Änderungen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Aktualisierung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Abonnements zu aktualisieren",
    },
    server: {
      title: "Server-Fehler bei Abonnement-Aktualisierung",
      description:
        "Abonnement konnte aufgrund eines Server-Fehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Abonnement-Aktualisierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Abonnement-Aktualisierung aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich aktualisiert",
    description: "Ihr Abonnement-Plan wurde geändert",
  },
};
