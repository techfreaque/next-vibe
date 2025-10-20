import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  time: {
    errors: {
      invalid_time_format: {
        title: "Nieprawidłowy format czasu",
        description: "Czas musi być w formacie HH:MM",
      },
      invalid_time_range: {
        title: "Nieprawidłowy zakres czasu",
        description: "Czas musi być między 00:00 a 23:59",
      },
    },
  },
};
