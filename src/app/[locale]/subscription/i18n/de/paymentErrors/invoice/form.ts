import type { translations as EnglishFormTranslations } from "../../../en/paymentErrors/invoice/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Rechnungsvalidierung fehlgeschlagen",
      description: "Rechnungsanfrage kann nicht validiert werden",
    },
    unauthorized: {
      title: "Rechnungszugriff nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, auf diese Rechnung zuzugreifen",
    },
    server: {
      title: "Rechnungsserverfehler",
      description:
        "Rechnung kann aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Rechnungszugriff fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Laden der Rechnung aufgetreten",
    },
  },
  success: {
    title: "Rechnung erfolgreich erstellt",
    description: "Ihre Rechnung wurde generiert",
  },
};
