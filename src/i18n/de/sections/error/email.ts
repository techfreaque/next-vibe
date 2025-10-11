import type { emailTranslations as EnglishEmailTranslations } from "../../../en/sections/error/email";

export const emailTranslations: typeof EnglishEmailTranslations = {
  errors: {
    sending_failed: "E-Mail-Versand fehlgeschlagen: {{error}}",
    batch_send_failed: "Fehler beim Senden mehrerer E-Mails: {{errors}}",
  },
};
