import type { translations as EnglishAvatarTranslations } from "../../en/user/avatar";

export const translations: typeof EnglishAvatarTranslations = {
  upload: {
    success: {
      title: "Avatar hochgeladen",
      description: "Ihr Avatar wurde erfolgreich hochgeladen",
    },
    error: {
      title: "Avatar-Upload fehlgeschlagen",
      default: "Avatar konnte nicht hochgeladen werden",
    },
  },
  delete: {
    success: {
      title: "Avatar gelöscht",
      description: "Ihr Avatar wurde erfolgreich gelöscht",
    },
    error: {
      title: "Avatar-Löschung fehlgeschlagen",
    },
  },
};
