import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účty na odosielanie správ",
  tag: "messenger-accounts",
  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Všetky kanály",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
    providerFilter: {
      any: "Všetci poskytovatelia",
    },
    status: {
      active: "Aktívne",
      inactive: "Neaktívne",
      error: "Chyba",
      testing: "Testovanie",
    },
    statusFilter: {
      any: "Všetky stavy",
    },
    healthStatus: {
      healthy: "V poriadku",
      degraded: "Obmedzená prevádzka",
      unhealthy: "Mimo prevádzky",
      unknown: "Neznáme",
    },
    healthStatusFilter: {
      any: "Všetky stavy prevádzky",
    },
    securityType: {
      none: "Žiadne",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "PLAIN",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
    sortField: {
      name: "Názov",
      channel: "Kanál",
      provider: "Poskytovateľ",
      status: "Stav",
      priority: "Priorita",
      messagesSentTotal: "Odoslané správy",
      lastUsedAt: "Naposledy použité",
      createdAt: "Vytvorené",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    campaignType: {
      leadCampaign: "Kampaň pre kontakty",
      newsletter: "Newsletter",
      signupNurture: "Komunikácia po registrácii",
      retention: "Udržanie zákazníkov",
      winback: "Návrat zákazníkov",
      transactional: "Transakčné",
      notification: "Oznámenie",
      system: "Systém",
    },
    campaignTypeFilter: {
      all: "Všetky kampane",
    },
    loadBalancingStrategy: {
      roundRobin: "Striedanie účtov",
      weighted: "Vážený výber",
      priority: "Priorita",
      leastUsed: "Najmenej používaný účet",
    },
  },
};
