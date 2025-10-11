import type { folderTranslations as EnglishFolderTranslations } from "../../../en/sections/imap/folder";

export const folderTranslations: typeof EnglishFolderTranslations = {
  name: "Nazwa folderu",
  type: "Typ",
  messageCount: "Wiadomości",
  unread: "Nieprzeczytane",
  recent: "Ostatnie",
  syncStatus: "Status synchronizacji",
  lastSync: "Ostatnia synchronizacja",
  total: "{{count}} folderów łącznie",
  types: {
    inbox: "Skrzynka odbiorcza",
    sent: "Wysłane",
    drafts: "Szkice",
    trash: "Kosz",
    junk: "Spam",
    archive: "Archiwum",
    custom: "Niestandardowy",
  },
  actions: {
    sync: "Synchronizuj folder",
    refresh: "Odśwież",
    markAllRead: "Oznacz wszystkie jako przeczytane",
    empty: "Opróżnij folder",
  },
  messages: {
    synced: "Folder został pomyślnie zsynchronizowany",
    syncFailed: "Synchronizacja folderu nieudana: {{error}}",
    emptied: "Folder został pomyślnie opróżniony",
    markedAllRead: "Wszystkie wiadomości oznaczone jako przeczytane",
  },
};
