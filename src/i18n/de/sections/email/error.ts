import type { errorTranslations as EnglishErrorTranslations } from "../../../en/sections/email/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  no_email: "Benutzer hat keine E-Mail-Adresse",
  no_email_or_disabled:
    "Benutzer hat keine E-Mail-Adresse oder E-Mail-Benachrichtigungen sind deaktiviert",
  email_generation_failed: "Fehler beim Generieren des E-Mail-Inhalts",
};
