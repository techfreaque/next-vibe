import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    status: "Status",
  },
  success: {
    title: "Erfolg",
    content: "Erfolg",
  },
  errors: {
    server: {
      title: "Serverfehler",
      description: "Beim Abrufen des Cron-Status ist ein Fehler aufgetreten",
    },
  },
};
