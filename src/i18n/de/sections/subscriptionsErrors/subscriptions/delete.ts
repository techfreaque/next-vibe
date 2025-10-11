import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Abonnement-Kündigungs-Validierung fehlgeschlagen",
      description: "Überprüfen Sie Ihre Anfrage und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Kündigung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Abonnements zu kündigen",
    },
    forbidden: {
      title: "Abonnement-Kündigung verboten",
      description:
        "Sie haben keine Berechtigung, dieses Abonnement zu kündigen",
    },
    not_found: {
      title: "Abonnement nicht gefunden",
      description:
        "Das Abonnement, das Sie kündigen möchten, konnte nicht gefunden werden",
    },
    server: {
      title: "Abonnement-Kündigungs-Serverfehler",
      description:
        "Abonnement kann aufgrund eines Serverfehlers nicht gekündigt werden",
    },
    unknown: {
      title: "Abonnement-Kündigung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Kündigen des Abonnements aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich gekündigt",
    description:
      "Das Abonnement wurde gekündigt und endet am Ende der aktuellen Periode",
  },
};
