import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as testTranslations } from "../../test/i18n/de";

export const translations = {
  tag: "Konten",
  create: createTranslations,
  id: idTranslations,
  list: listTranslations,
  test: testTranslations,
  connection: {
    test: {
      success: "IMAP-Verbindungstest erfolgreich",
      failed: "IMAP-Verbindungstest fehlgeschlagen",
      timeout: "IMAP-Verbindungstest ist abgelaufen",
    },
    validation: {
      usernameRequired: "Benutzername ist erforderlich",
      portInvalid: "Ungültige Portnummer",
      hostInvalid: "Ungültiges Host-Format",
    },
  },
};
