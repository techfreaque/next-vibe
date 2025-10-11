import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/userProfile/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Profil-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Profilinformationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Profil-Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, dieses Profil zu aktualisieren",
    },
    server: {
      title: "Profil Serverfehler",
      description:
        "Profil konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Profil-Aktualisierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Profil-Aktualisierung aufgetreten",
    },
  },
  success: {
    title: "Profil erfolgreich aktualisiert",
    description: "Ihre Profilinformationen wurden aktualisiert",
  },
};
