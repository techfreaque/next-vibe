import type { folderTranslations as EnglishFolderTranslations } from "../../../en/sections/imap/folder";

export const folderTranslations: typeof EnglishFolderTranslations = {
  name: "Ordnername",
  type: "Typ",
  messageCount: "Nachrichten",
  unread: "Ungelesen",
  recent: "Aktuell",
  syncStatus: "Sync-Status",
  lastSync: "Letzte Synchronisation",
  total: "{{count}} Ordner insgesamt",
  types: {
    inbox: "Posteingang",
    sent: "Gesendet",
    drafts: "Entwürfe",
    trash: "Papierkorb",
    junk: "Spam",
    archive: "Archiv",
    custom: "Benutzerdefiniert",
  },
  actions: {
    sync: "Ordner synchronisieren",
    refresh: "Aktualisieren",
    markAllRead: "Alle als gelesen markieren",
    empty: "Ordner leeren",
  },
  messages: {
    synced: "Ordner erfolgreich synchronisiert",
    syncFailed: "Ordner-Synchronisation fehlgeschlagen: {{error}}",
    emptied: "Ordner erfolgreich geleert",
    markedAllRead: "Alle Nachrichten als gelesen markiert",
  },
};
