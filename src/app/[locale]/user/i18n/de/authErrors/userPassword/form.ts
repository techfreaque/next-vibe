import type { translations as EnglishFormTranslations } from "../../../en/authErrors/userPassword/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Passwort-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie die Passwort-Anforderungen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Passwort-Änderung nicht berechtigt",
      description: "Sie haben keine Berechtigung, dieses Passwort zu ändern",
    },
    server: {
      title: "Passwort-Änderung Serverfehler",
      description:
        "Passwort konnte aufgrund eines Serverfehlers nicht geändert werden",
    },
    unknown: {
      title: "Passwort-Änderung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Ändern des Passworts aufgetreten",
    },
  },
  success: {
    title: "Passwort erfolgreich geändert",
    description: "Ihr Passwort wurde aktualisiert",
  },
};
