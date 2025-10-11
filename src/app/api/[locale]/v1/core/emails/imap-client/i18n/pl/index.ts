import { translations as accountsTranslations } from "../../accounts/i18n/pl";
import { translations as configTranslations } from "../../config/i18n/pl";
import { translations as foldersTranslations } from "../../folders/i18n/pl";
import { translations as healthTranslations } from "../../health/i18n/pl";
import { translations as messagesTranslations } from "../../messages/i18n/pl";
import { translations as syncTranslations } from "../../sync/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Klient IMAP",
  tag: "Klient IMAP",
  tags: {
    health: "Zdrowie",
    monitoring: "Monitorowanie",
    sync: "Synchronizacja",
    accounts: "Konta",
    folders: "Foldery",
    messages: "Wiadomości",
    config: "Konfiguracja",
  },
  accounts: accountsTranslations,
  config: configTranslations,
  folders: foldersTranslations,
  health: healthTranslations,
  messages: messagesTranslations,
  sync: syncTranslations,
  enums: {
    syncStatus: {
      pending: "Oczekujący",
      syncing: "Synchronizacja",
      synced: "Zsynchronizowane",
      error: "Błąd",
    },
    overallSyncStatus: {
      idle: "Bezczynny",
      running: "Uruchomiony",
      completed: "Zakończone",
      failed: "Nieudane",
      cancelled: "Anulowane",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    authMethod: {
      plain: "Zwykły",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Skrzynka odbiorcza",
      sent: "Wysłane",
      drafts: "Szkice",
      trash: "Kosz",
      junk: "Spam",
      archive: "Archiwum",
    },
    folderSortField: {
      name: "Nazwa",
      displayName: "Nazwa wyświetlana",
      messageCount: "Liczba wiadomości",
      unseenCount: "Liczba nieprzeczytanych",
      createdAt: "Utworzono",
    },
    accountSortField: {
      name: "Nazwa",
      email: "Email",
      host: "Host",
      enabled: "Włączone",
      lastSyncAt: "Ostatnia synchronizacja",
      createdAt: "Utworzono",
    },
    connectionStatus: {
      disconnected: "Rozłączony",
      connecting: "Łączenie",
      connected: "Połączony",
      error: "Błąd",
      timeout: "Przekroczono limit czasu",
    },
    syncStatusFilter: {
      all: "Wszystkie statusy synchronizacji",
    },
    accountStatusFilter: {
      all: "Wszystkie statusy kont",
      enabled: "Włączone",
      disabled: "Wyłączone",
    },
    accountFilter: {
      all: "Wszystkie konta",
    },
    messageSortField: {
      subject: "Temat",
      senderName: "Nazwa nadawcy",
      senderEmail: "Email nadawcy",
      recipientEmail: "Email odbiorcy",
      recipientName: "Nazwa odbiorcy",
      isRead: "Status przeczytania",
      isFlagged: "Oznaczone",
      messageSize: "Rozmiar wiadomości",
      sentAt: "Wysłano",
      createdAt: "Utworzono",
    },
    messageStatusFilter: {
      all: "Wszystkie wiadomości",
      read: "Przeczytane",
      unread: "Nieprzeczytane",
      flagged: "Oznaczone",
      unflagged: "Nieoznaczone",
      draft: "Szkic",
      deleted: "Usunięte",
      hasAttachments: "Z załącznikami",
      noAttachments: "Bez załączników",
    },
    healthStatus: {
      healthy: "Zdrowy",
      warning: "Ostrzeżenie",
      error: "Błąd",
      maintenance: "Konserwacja",
    },
    performanceStatus: {
      good: "Dobry",
      warning: "Ostrzeżenie",
      error: "Błąd",
    },
  },
};
