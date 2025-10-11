import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/subscriptionErrors/subscription/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Validierung der Abonnement-Daten fehlgeschlagen",
      description: "Die Abonnement-Datenabfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Zugriff auf Abonnement-Daten verweigert",
      description:
        "Sie haben keine Berechtigung, auf Abonnement-Daten zuzugreifen",
    },
    server: {
      title: "Server-Fehler bei Abonnement-Daten",
      description:
        "Abonnement-Daten konnten aufgrund eines Server-Fehlers nicht geladen werden",
    },
    unknown: {
      title: "Zugriff auf Abonnement-Daten fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Laden der Abonnement-Daten aufgetreten",
    },
  },
  success: {
    title: "Abonnement-Daten erfolgreich abgerufen",
    description: "Ihre Abonnement-Informationen wurden geladen",
  },
};
