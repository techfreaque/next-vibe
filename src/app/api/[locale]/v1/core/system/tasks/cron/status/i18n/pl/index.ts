import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    status: "Status",
  },
  success: {
    title: "Sukces",
    content: "Sukces",
  },
  errors: {
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania statusu cron",
    },
  },
};
