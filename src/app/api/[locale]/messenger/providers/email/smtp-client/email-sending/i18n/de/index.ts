import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  email: {
    defaultSenderName: "System",
    errors: {
      sending_failed: "E-Mail an {{recipient}} konnte nicht gesendet werden",
    },
  },
};
