import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/authErrors/userMe/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Profil-Abruf Validierung fehlgeschlagen",
      description: "Ungültige Anfrageparameter für den Profil-Abruf",
    },
    unauthorized: {
      title: "Profil-Abruf Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, Profilinformationen abzurufen",
    },
    server: {
      title: "Profil-Abruf Serverfehler",
      description:
        "Profil konnte aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Profil-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Profils aufgetreten",
    },
  },
  success: {
    title: "Profil erfolgreich geladen",
    description: "Ihre Profilinformationen wurden geladen",
  },
};
