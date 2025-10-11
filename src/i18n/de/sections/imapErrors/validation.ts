import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/imapErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  account: {
    name: {
      required: "Kontoname ist erforderlich",
      too_long: "Kontoname ist zu lang",
    },
    email: {
      required: "E-Mail-Adresse ist erforderlich",
      invalid: "Ungültiges E-Mail-Adressformat",
    },
    host: {
      required: "IMAP-Server-Host ist erforderlich",
      invalid: "Ungültiges Host-Format",
    },
    port: {
      required: "Port ist erforderlich",
      invalid: "Port muss zwischen 1 und 65535 liegen",
    },
    username: {
      required: "Benutzername ist erforderlich",
    },
    password: {
      required: "Passwort ist erforderlich",
      too_short: "Passwort ist zu kurz",
      too_long: "Passwort ist zu lang",
    },
  },
};
