import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wiadomości Email",
  tag: "Wiadomości",
  tags: {
    stats: "Statystyki",
    analytics: "Analityka",
  },
  id: idTranslations,
  list: listTranslations,
  stats: statsTranslations,
  enums: {
    status: {
      pending: "Oczekujący",
      sent: "Wysłany",
      delivered: "Dostarczony",
      opened: "Otwarty",
      clicked: "Kliknięty",
      bounced: "Odrzucony",
      failed: "Nieudany",
      unsubscribed: "Wypisany",
    },
    statusFilter: {
      any: "Wszystkie statusy",
    },
    type: {
      transactional: "Transakcyjny",
      marketing: "Marketing",
      notification: "Powiadomienie",
      system: "System",
      leadCampaign: "Kampania leadów",
      userCommunication: "Komunikacja z użytkownikiem",
    },
    typeFilter: {
      any: "Wszystkie typy",
    },
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Inne",
    },
    sortField: {
      subject: "Temat",
      recipientEmail: "Email odbiorcy",
      recipientName: "Nazwa odbiorcy",
      type: "Typ",
      status: "Status",
      sentAt: "Wysłano",
      createdAt: "Utworzono",
    },
    retryRange: {
      noRetries: "Bez ponowień",
      oneToTwo: "1-2 ponowienia",
      threeToFive: "3-5 ponowień",
      sixPlus: "6+ ponowień",
    },
    syncStatus: {
      pending: "Oczekuje na synchronizację",
      syncing: "Synchronizacja w toku",
      synced: "Zsynchronizowany",
      failed: "Synchronizacja nieudana",
    },
    specialFolder: {
      inbox: "Skrzynka odbiorcza",
      sent: "Wysłane",
      drafts: "Wersje robocze",
      trash: "Kosz",
      spam: "Spam",
      archive: "Archiwum",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
};
