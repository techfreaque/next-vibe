import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: {
    title: "Messenger",
    stats: {
      title: "Statystyki e-mail",
    },
  },
  nav: {
    campaigns: "Kampanie",
    overview: "Przegląd",
    templates: "Szablony",
    messagingAccounts: "Konta komunikatorów",
    imap: "IMAP",
    smtp: "SMTP",
    smtpDescription: "Konta SMTP",
  },
  imap: {
    nav: {
      messages: "Skrzynka odbiorcza",
      starred: "Oznaczone",
      sent: "Wysłane",
      drafts: "Szkice",
      spam: "Spam",
      trash: "Kosz",
      accounts: "Konta IMAP",
      config: "Konfiguracja",
      sync: "Synchronizacja",
      overview: "Przegląd",
      compose: "Napisz",
    },
    admin: {
      overview: {
        title: "Przegląd IMAP",
      },
    },
  },
  smtp: {
    list: {
      title: "Konta SMTP",
    },
  },
};
