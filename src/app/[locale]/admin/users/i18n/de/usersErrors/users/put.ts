import type { translations as EnglishPutTranslations } from "../../../en/usersErrors/users/put";

export const translations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Benutzer-Update-Validierung fehlgeschlagen",
      description:
        "Überprüfen Sie Ihre Benutzerinformationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Benutzer-Update nicht autorisiert",
      description: "Sie haben keine Berechtigung, Benutzer zu aktualisieren",
    },
    forbidden: {
      title: "Benutzer-Update verboten",
      description:
        "Sie haben keine Berechtigung, diesen Benutzer zu aktualisieren",
    },
    not_found: {
      title: "Benutzer nicht gefunden",
      description:
        "Der Benutzer, den Sie aktualisieren möchten, konnte nicht gefunden werden",
    },
    duplicate: {
      title: "E-Mail bereits in Verwendung",
      description:
        "Ein anderer Benutzer verwendet bereits diese E-Mail-Adresse",
    },
    server: {
      title: "Benutzer-Update-Serverfehler",
      description:
        "Benutzer kann aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Benutzer-Update fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Aktualisieren des Benutzers aufgetreten",
    },
  },
  success: {
    title: "Benutzer erfolgreich aktualisiert",
    description: "Die Benutzerinformationen wurden erfolgreich aktualisiert",
  },
};
