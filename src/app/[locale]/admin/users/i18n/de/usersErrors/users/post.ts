import type { translations as EnglishPostTranslations } from "../../../en/usersErrors/users/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Benutzer-Erstellungs-Validierung fehlgeschlagen",
      description:
        "Überprüfen Sie Ihre Benutzerinformationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Benutzer-Erstellung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Benutzer zu erstellen",
    },
    forbidden: {
      title: "Benutzer-Erstellung verboten",
      description: "Sie haben keine Berechtigung, Benutzer zu erstellen",
    },
    duplicate: {
      title: "Benutzer existiert bereits",
      description:
        "Ein Benutzer mit dieser E-Mail-Adresse existiert bereits im System",
    },
    server: {
      title: "Benutzer-Erstellungs-Serverfehler",
      description:
        "Benutzer kann aufgrund eines Serverfehlers nicht erstellt werden",
    },
    unknown: {
      title: "Benutzer-Erstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Erstellen des Benutzers aufgetreten",
    },
  },
  success: {
    title: "Benutzer erfolgreich erstellt",
    description: "Der neue Benutzer wurde erstellt und zum System hinzugefügt",
  },
};
