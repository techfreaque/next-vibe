import type { translations as EnglishFormTranslations } from "../../../en/authErrors/userMe/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Benutzerprofil-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Profilinformationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Profil-Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, auf dieses Profil zuzugreifen",
    },
    server: {
      title: "Profil Serverfehler",
      description:
        "Profil konnte aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Profil-Zugriff fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Zugriff auf das Profil aufgetreten",
    },
  },
  success: {
    title: "Profil erfolgreich aktualisiert",
    description: "Ihr Profil wurde aktualisiert",
  },
};
