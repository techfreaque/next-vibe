import { translations as idTranslations } from "../../[id]/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";
import { translations as testTranslations } from "../../test/i18n/en";

export const translations = {
  tag: "Accounts",
  create: createTranslations,
  id: idTranslations,
  list: listTranslations,
  test: testTranslations,
  connection: {
    test: {
      success: "IMAP connection test successful",
      failed: "IMAP connection test failed",
      timeout: "IMAP connection test timed out",
    },
    validation: {
      usernameRequired: "Username is required",
      portInvalid: "Invalid port number",
      hostInvalid: "Invalid host format",
    },
  },
};
