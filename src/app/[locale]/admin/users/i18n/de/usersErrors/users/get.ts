import type { translations as EnglishGetTranslations } from "../../../en/usersErrors/users/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Benutzer-Abruf-Validierung fehlgeschlagen",
      description:
        "Überprüfen Sie Ihre Anfrageparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Benutzer-Abruf nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, auf Benutzerdaten zuzugreifen",
    },
    forbidden: {
      title: "Benutzerzugriff verboten",
      description:
        "Sie haben keine Berechtigung, auf diesen Benutzer zuzugreifen",
    },
    not_found: {
      title: "Benutzer nicht gefunden",
      description: "Der angeforderte Benutzer konnte nicht gefunden werden",
    },
    server: {
      title: "Benutzer-Abruf-Serverfehler",
      description:
        "Benutzer kann aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Benutzer-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Benutzers aufgetreten",
    },
  },
  success: {
    title: "Benutzer erfolgreich abgerufen",
    description: "Benutzerdaten wurden erfolgreich geladen",
  },
};
