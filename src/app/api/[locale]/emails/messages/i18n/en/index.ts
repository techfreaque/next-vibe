import { translations as idTranslations } from "../../[id]/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";
import { translations as statsTranslations } from "../../stats/i18n/en";

export const translations = {
  category: "Email Messages",
  tag: "Messages",
  tags: {
    stats: "Statistics",
    analytics: "Analytics",
  },
  id: idTranslations,
  list: listTranslations,
  stats: statsTranslations,
  enums: {
    status: {
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      opened: "Opened",
      clicked: "Clicked",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Unsubscribed",
    },
    statusFilter: {
      any: "All Statuses",
    },
    type: {
      transactional: "Transactional",
      marketing: "Marketing",
      notification: "Notification",
      system: "System",
      leadCampaign: "Lead Campaign",
      userCommunication: "User Communication",
    },
    typeFilter: {
      any: "All Types",
    },
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Other",
    },
    sortField: {
      subject: "Subject",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      type: "Type",
      status: "Status",
      sentAt: "Sent At",
      createdAt: "Created At",
    },
    retryRange: {
      noRetries: "No Retries",
      oneToTwo: "1-2 Retries",
      threeToFive: "3-5 Retries",
      sixPlus: "6+ Retries",
    },
  },
};
