import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/userPassword/form";

export const formTranslations: typeof EnglishFormTranslations = {
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
