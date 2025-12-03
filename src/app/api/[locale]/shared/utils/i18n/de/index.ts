import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  parseJsonWithComments: {
    errors: {
      invalid_json: "Ungültiges JSON-Format",
    },
  },
  time: {
    errors: {
      invalid_time_format: {
        title: "Ungültiges Zeitformat",
        description: "Die Zeitangabe muss im Format HH:MM sein",
      },
      invalid_time_range: {
        title: "Ungültiger Zeitbereich",
        description: "Die Zeitangabe muss zwischen 00:00 und 23:59 liegen",
      },
    },
  },
};
