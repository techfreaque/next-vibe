import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Client-Routen-Index generieren",
    description: "Client-Routen-Index-Datei automatisch generieren",
    container: {
      title: "Client-Routen-Index-Generator",
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description:
          "Bitte überprüfen Sie Ihre Konfiguration und versuchen Sie es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Index konnte nicht generiert werden. Bitte versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description:
          "Bitte melden Sie sich an, um diesen Generator zu verwenden",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie haben keine Berechtigung, diesen Generator zu verwenden",
      },
      notFound: {
        title: "Routen nicht gefunden",
        description:
          "Die zu generierenden Routen konnten nicht gefunden werden",
      },
      server: {
        title: "Generierung fehlgeschlagen",
        description:
          "Der Index konnte nicht generiert werden. Bitte versuchen Sie es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
      },
      conflict: {
        title: "Dateikonflikt",
        description:
          "Die Index-Datei hat Konflikte. Bitte lösen Sie diese zuerst",
      },
    },
    success: {
      title: "Index generiert",
      description: "Client-Routen-Index wurde erfolgreich generiert",
    },
  },
};
