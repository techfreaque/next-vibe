import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessDataErrors/businessData/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Geschäftsdaten-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Geschäftsdaten und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Zugriff auf Geschäftsdaten verweigert",
      description:
        "Sie haben keine Berechtigung, auf Geschäftsdaten zuzugreifen",
    },
    server: {
      title: "Geschäftsdaten-Serverfehler",
      description:
        "Geschäftsdaten konnten aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Zugriff auf Geschäftsdaten fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Zugriff auf Geschäftsdaten aufgetreten",
    },
  },
  success: {
    title: "Geschäftsdaten erfolgreich gespeichert",
    description: "Ihre Geschäftsinformationen wurden aktualisiert",
  },
};
