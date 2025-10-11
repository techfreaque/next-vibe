import type { avatarTranslations as EnglishAvatarTranslations } from "../../../en/sections/user/avatar";

export const avatarTranslations: typeof EnglishAvatarTranslations = {
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
