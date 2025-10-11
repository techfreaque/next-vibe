import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/usersErrors/users/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Benutzer-Löschungs-Validierung fehlgeschlagen",
      description: "Überprüfen Sie Ihre Anfrage und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Benutzer-Löschung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Benutzer zu löschen",
    },
    forbidden: {
      title: "Benutzer-Löschung verboten",
      description: "Sie haben keine Berechtigung, diesen Benutzer zu löschen",
    },
    not_found: {
      title: "Benutzer nicht gefunden",
      description:
        "Der Benutzer, den Sie löschen möchten, konnte nicht gefunden werden",
    },
    server: {
      title: "Benutzer-Löschungs-Serverfehler",
      description:
        "Benutzer kann aufgrund eines Serverfehlers nicht gelöscht werden",
    },
    unknown: {
      title: "Benutzer-Löschung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Löschen des Benutzers aufgetreten",
    },
  },
  success: {
    title: "Benutzer erfolgreich gelöscht",
    description: "Der Benutzer wurde dauerhaft aus dem System entfernt",
  },
};
