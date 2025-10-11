import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/imapErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  account: {
    name: {
      required: "Nazwa konta jest wymagana",
      too_long: "Nazwa konta jest za długa",
    },
    email: {
      required: "Adres e-mail jest wymagany",
      invalid: "Nieprawidłowy format adresu e-mail",
    },
    host: {
      required: "Host serwera IMAP jest wymagany",
      invalid: "Nieprawidłowy format hosta",
    },
    port: {
      required: "Port jest wymagany",
      invalid: "Port musi być między 1 a 65535",
    },
    username: {
      required: "Nazwa użytkownika jest wymagana",
    },
    password: {
      required: "Hasło jest wymagane",
      too_short: "Hasło jest za krótkie",
      too_long: "Hasło jest za długie",
    },
  },
};
