import type { translations as EnglishFormTranslations } from "../../../en/authErrors/userAvatar/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Avatar-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Avatar-Datei und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Avatar-Upload nicht berechtigt",
      description: "Sie haben keine Berechtigung, einen Avatar hochzuladen",
    },
    server: {
      title: "Avatar-Upload Serverfehler",
      description:
        "Avatar konnte aufgrund eines Serverfehlers nicht hochgeladen werden",
    },
    unknown: {
      title: "Avatar-Upload fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Hochladen des Avatars aufgetreten",
    },
  },
  success: {
    title: "Avatar erfolgreich aktualisiert",
    description: "Ihr Profil-Avatar wurde aktualisiert",
  },
};
