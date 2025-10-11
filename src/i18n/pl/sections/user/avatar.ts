import type { avatarTranslations as EnglishAvatarTranslations } from "../../../en/sections/user/avatar";

export const avatarTranslations: typeof EnglishAvatarTranslations = {
  upload: {
    success: {
      title: "Awatar Przesłany",
      description: "Twój awatar został pomyślnie przesłany",
    },
    error: {
      title: "Przesyłanie Awatara Nie Powiodło Się",
      default: "Nie udało się przesłać awatara",
    },
  },
  delete: {
    success: {
      title: "Awatar Usunięty",
      description: "Twój awatar został pomyślnie usunięty",
    },
    error: {
      title: "Usunięcie Awatara Nie Powiodło Się",
    },
  },
};
