import type { errorTranslations as EnglishErrorTranslations } from "../../../en/sections/email/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  no_email: "Użytkownik nie ma adresu e-mail",
  no_email_or_disabled:
    "Użytkownik nie ma adresu e-mail lub powiadomienia e-mail są wyłączone",
  email_generation_failed: "Nie udało się wygenerować treści e-maila",
};
