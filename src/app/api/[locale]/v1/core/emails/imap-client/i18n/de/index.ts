import { translations as accountsTranslations } from "../../accounts/i18n/de";
import { translations as configTranslations } from "../../config/i18n/de";
import { translations as foldersTranslations } from "../../folders/i18n/de";
import { translations as healthTranslations } from "../../health/i18n/de";
import { translations as messagesTranslations } from "../../messages/i18n/de";
import { translations as syncTranslations } from "../../sync/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IMAP-Client",
  tag: "IMAP-Client",
  tags: {
    health: "Gesundheit",
    monitoring: "Überwachung",
    sync: "Synchronisation",
    accounts: "Konten",
    folders: "Ordner",
    messages: "Nachrichten",
    config: "Konfiguration",
  },
  accounts: accountsTranslations,
  config: configTranslations,
  folders: foldersTranslations,
  health: healthTranslations,
  messages: messagesTranslations,
  sync: syncTranslations,
  enums: {
    syncStatus: {
      pending: "Ausstehend",
      syncing: "Synchronisierung",
      synced: "Synchronisiert",
      error: "Fehler",
    },
    overallSyncStatus: {
      idle: "Inaktiv",
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      cancelled: "Abgebrochen",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    authMethod: {
      plain: "Einfach",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Posteingang",
      sent: "Gesendet",
      drafts: "Entwürfe",
      trash: "Papierkorb",
      junk: "Spam",
      archive: "Archiv",
    },
    folderSortField: {
      name: "Name",
      displayName: "Anzeigename",
      messageCount: "Nachrichtenanzahl",
      unseenCount: "Ungelesene Anzahl",
      createdAt: "Erstellt am",
    },
    accountSortField: {
      name: "Name",
      email: "E-Mail",
      host: "Host",
      enabled: "Aktiviert",
      lastSyncAt: "Letzte Synchronisation",
      createdAt: "Erstellt am",
    },
    connectionStatus: {
      disconnected: "Getrennt",
      connecting: "Verbindung wird hergestellt",
      connected: "Verbunden",
      error: "Fehler",
      timeout: "Zeitüberschreitung",
    },
    syncStatusFilter: {
      all: "Alle Synchronisationsstatus",
    },
    accountStatusFilter: {
      all: "Alle Kontostatus",
      enabled: "Aktiviert",
      disabled: "Deaktiviert",
    },
    accountFilter: {
      all: "Alle Konten",
    },
    messageSortField: {
      subject: "Betreff",
      senderName: "Absendername",
      senderEmail: "Absender-E-Mail",
      recipientEmail: "Empfänger-E-Mail",
      recipientName: "Empfängername",
      isRead: "Gelesen-Status",
      isFlagged: "Markiert",
      messageSize: "Nachrichtengröße",
      sentAt: "Gesendet am",
      createdAt: "Erstellt am",
    },
    messageStatusFilter: {
      all: "Alle Nachrichten",
      read: "Gelesen",
      unread: "Ungelesen",
      flagged: "Markiert",
      unflagged: "Nicht markiert",
      draft: "Entwurf",
      deleted: "Gelöscht",
      hasAttachments: "Mit Anhängen",
      noAttachments: "Ohne Anhänge",
    },
    healthStatus: {
      healthy: "Gesund",
      warning: "Warnung",
      error: "Fehler",
      maintenance: "Wartung",
    },
    performanceStatus: {
      good: "Gut",
      warning: "Warnung",
      error: "Fehler",
    },
  },
};
