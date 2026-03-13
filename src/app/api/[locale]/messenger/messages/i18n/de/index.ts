import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-Mail-Nachrichten",
  tag: "Nachrichten",
  tags: {
    stats: "Statistiken",
    analytics: "Analysen",
  },
  id: idTranslations,
  list: listTranslations,
  stats: statsTranslations,
  enums: {
    status: {
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      opened: "Geöffnet",
      clicked: "Geklickt",
      bounced: "Zurückgewiesen",
      failed: "Fehlgeschlagen",
      unsubscribed: "Abgemeldet",
    },
    statusFilter: {
      any: "Alle Status",
    },
    type: {
      transactional: "Transaktional",
      marketing: "Marketing",
      notification: "Benachrichtigung",
      system: "System",
      leadCampaign: "Lead-Kampagne",
      userCommunication: "Benutzerkommunikation",
    },
    typeFilter: {
      any: "Alle Typen",
    },
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Andere",
    },
    sortField: {
      subject: "Betreff",
      recipientEmail: "Empfänger-E-Mail",
      recipientName: "Empfängername",
      type: "Typ",
      status: "Status",
      sentAt: "Gesendet am",
      createdAt: "Erstellt am",
    },
    retryRange: {
      noRetries: "Keine Wiederholungen",
      oneToTwo: "1-2 Wiederholungen",
      threeToFive: "3-5 Wiederholungen",
      sixPlus: "6+ Wiederholungen",
    },
    syncStatus: {
      pending: "Synchronisierung ausstehend",
      syncing: "Synchronisierung läuft",
      synced: "Synchronisiert",
      failed: "Synchronisierung fehlgeschlagen",
    },
    specialFolder: {
      inbox: "Posteingang",
      sent: "Gesendet",
      drafts: "Entwürfe",
      trash: "Papierkorb",
      spam: "Spam",
      archive: "Archiv",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
};
