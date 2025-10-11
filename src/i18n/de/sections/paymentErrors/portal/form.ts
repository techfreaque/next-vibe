import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/paymentErrors/portal/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Portal-Validierung fehlgeschlagen",
      description: "Portal-Zugriffsanfrage kann nicht validiert werden",
    },
    unauthorized: {
      title: "Portal-Zugriff nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, auf das Zahlungsportal zuzugreifen",
    },
    server: {
      title: "Portal-Serverfehler",
      description:
        "Zugriff auf Zahlungsportal aufgrund eines Serverfehlers nicht möglich",
    },
    unknown: {
      title: "Portal-Zugriff fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Zugriff auf das Zahlungsportal aufgetreten",
    },
  },
  success: {
    title: "Portal-Zugriff erfolgreich",
    description: "Zahlungsportal wurde geöffnet",
  },
};
