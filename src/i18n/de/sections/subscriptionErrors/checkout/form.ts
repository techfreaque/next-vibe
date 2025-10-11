import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/subscriptionErrors/checkout/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Checkout-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Checkout-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Checkout nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diesen Checkout abzuschließen",
    },
    server: {
      title: "Checkout Server-Fehler",
      description:
        "Checkout konnte aufgrund eines Server-Fehlers nicht abgeschlossen werden",
    },
    unknown: {
      title: "Checkout fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist während des Checkouts aufgetreten",
    },
  },
  success: {
    title: "Checkout erfolgreich abgeschlossen",
    description: "Ihr Abonnement-Checkout wurde verarbeitet",
  },
};
