import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as testTranslations } from "../../test/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Konta",
  create: createTranslations,
  id: idTranslations,
  list: listTranslations,
  test: testTranslations,
  connection: {
    test: {
      success: "Test połączenia IMAP powiódł się",
      failed: "Test połączenia IMAP nie powiódł się",
      timeout: "Test połączenia IMAP przekroczył limit czasu",
    },
    validation: {
      usernameRequired: "Nazwa użytkownika jest wymagana",
      portInvalid: "Nieprawidłowy numer portu",
      hostInvalid: "Nieprawidłowy format hosta",
    },
  },
};
