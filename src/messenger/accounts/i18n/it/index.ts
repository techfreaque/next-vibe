import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Conti Messenger",
  tag: "account di messaggero",
  enums: {
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tutti i canali",
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
      any: "Tutti i fornitori",
    },
    status: {
      active: "Attivo",
      inactive: "Inattivo",
      error: "Errore",
      testing: "Testing",
    },
    statusFilter: {
      any: "Tutti gli stati",
    },
    healthStatus: {
      healthy: "Salute",
      degraded: "Degrado",
      unhealthy: "Insicuro",
      unknown: "Sconosciuto",
    },
    healthStatusFilter: {
      any: "Tutti gli stati di salute",
    },
    securityType: {
      none: "Nessuno",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "Pianura",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
    sortField: {
      name: "Nome",
      channel: "Canale",
      provider: "Fornitore",
      status: "Stato",
      priority: "Priorità",
      messagesSentTotal: "Messaggi inviati",
      lastUsedAt: "Ultimo uso",
      createdAt: "Creato a",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    campaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema",
    },
    campaignTypeFilter: {
      all: "Tutte le campagne",
    },
    loadBalancingStrategy: {
      roundRobin: "Robin",
      weighted: "Peso",
      priority: "Priorità",
      leastUsed: "Meno Usato",
    },
  },
};
