import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  email: {
    defaultSenderName: "System",
    errors: {
      sending_failed: "Nie udało się wysłać e-maila do {{recipient}}",
    },
  },
};
