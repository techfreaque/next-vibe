import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: {
    title: "E-Mail-Verwaltung",
    stats: {
      title: "E-Mail-Statistiken",
    },
  },
  nav: {
    campaigns: "Kampagnen",
    overview: "Übersicht",
    templates: "Vorlagen",
    messagingAccounts: "Messaging-Konten",
    imap: "IMAP",
    smtp: "SMTP",
    smtpDescription: "SMTP-Konten",
  },
  imap: {
    nav: {
      messages: "Posteingang",
      starred: "Markiert",
      sent: "Gesendet",
      drafts: "Entwürfe",
      spam: "Spam",
      trash: "Papierkorb",
      accounts: "IMAP-Konten",
      config: "Konfiguration",
      sync: "Synchronisierung",
      overview: "Übersicht",
      compose: "Verfassen",
    },
    admin: {
      overview: {
        title: "IMAP-Übersicht",
      },
    },
  },
  smtp: {
    list: {
      title: "SMTP-Konten",
    },
  },
};
