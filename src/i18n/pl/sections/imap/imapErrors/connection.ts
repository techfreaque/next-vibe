import type { connectionTranslations as EnglishConnectionTranslations } from "../../../../en/sections/imap/imapErrors/connection";

export const connectionTranslations: typeof EnglishConnectionTranslations = {
  failed: "Połączenie IMAP nie powiodło się",
  test: {
    failed: "Test połączenia IMAP nie powiódł się",
  },
  close: {
    failed: "Nie udało się zamknąć połączenia IMAP",
  },
  folders: {
    list: {
      failed: "Nie udało się wyświetlić folderów IMAP",
    },
  },
  messages: {
    list: {
      failed: "Nie udało się wyświetlić wiadomości IMAP",
    },
  },
};
