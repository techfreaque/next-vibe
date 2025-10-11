import type { connectionTranslations as EnglishConnectionTranslations } from "../../../../en/sections/imap/imapErrors/connection";

export const connectionTranslations: typeof EnglishConnectionTranslations = {
  failed: "IMAP-Verbindung fehlgeschlagen",
  test: {
    failed: "IMAP-Verbindungstest fehlgeschlagen",
  },
  close: {
    failed: "IMAP-Verbindung konnte nicht geschlossen werden",
  },
  folders: {
    list: {
      failed: "IMAP-Ordner konnten nicht aufgelistet werden",
    },
  },
  messages: {
    list: {
      failed: "IMAP-Nachrichten konnten nicht aufgelistet werden",
    },
  },
};
