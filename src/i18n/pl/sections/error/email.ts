import type { emailTranslations as EnglishEmailTranslations } from "../../../en/sections/error/email";

export const emailTranslations: typeof EnglishEmailTranslations = {
  errors: {
    sending_failed: "Nie udało się wysłać emaila: {{error}}",
    batch_send_failed: "Nie udało się wysłać niektórych emaili: {{errors}}",
  },
};
