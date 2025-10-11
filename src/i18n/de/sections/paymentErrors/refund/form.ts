import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/paymentErrors/refund/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Rückerstattungsvalidierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Rückerstattungsanfrage und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Rückerstattung nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diese Rückerstattung anzufordern",
    },
    server: {
      title: "Rückerstattungsserverfehler",
      description:
        "Rückerstattung kann aufgrund eines Serverfehlers nicht verarbeitet werden",
    },
    unknown: {
      title: "Rückerstattung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Rückerstattungsverarbeitung aufgetreten",
    },
  },
  success: {
    title: "Rückerstattung erfolgreich verarbeitet",
    description: "Ihre Rückerstattung wurde eingeleitet",
  },
};
