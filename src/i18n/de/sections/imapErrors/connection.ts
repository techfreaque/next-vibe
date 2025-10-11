import type { connectionTranslations as EnglishConnectionTranslations } from "../../../en/sections/imapErrors/connection";

export const connectionTranslations: typeof EnglishConnectionTranslations = {
  timeout: {
    title: "Verbindungs-Timeout",
    description: "Die Verbindung zum IMAP-Server ist abgelaufen.",
  },
  refused: {
    title: "Verbindung verweigert",
    description: "Der IMAP-Server hat die Verbindung verweigert.",
  },
  auth_failed: {
    title: "Authentifizierung fehlgeschlagen",
    description: "Ungültiger Benutzername oder Passwort.",
  },
  ssl_error: {
    title: "SSL/TLS-Fehler",
    description: "Ein Fehler ist bei der sicheren Verbindung aufgetreten.",
  },
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
