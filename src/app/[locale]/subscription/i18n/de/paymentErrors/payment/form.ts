import type { translations as EnglishFormTranslations } from "../../../en/paymentErrors/payment/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Zahlungsvalidierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Zahlungsinformationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Zahlung nicht autorisiert",
      description: "Sie haben keine Berechtigung, diese Zahlung zu verarbeiten",
    },
    server: {
      title: "Zahlungsserverfehler",
      description:
        "Zahlung kann aufgrund eines Serverfehlers nicht verarbeitet werden",
    },
    unknown: {
      title: "Zahlung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Zahlungsverarbeitung aufgetreten",
    },
  },
  success: {
    title: "Zahlung erfolgreich verarbeitet",
    description: "Ihre Zahlung wurde abgeschlossen",
  },
};
