import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Comptes de messagerie",
  tag: "messenger-accounts",
  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tous les canaux",
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
      telegramBot: "Bot Telegram",
    },
    providerFilter: {
      any: "Tous les fournisseurs",
    },
    status: {
      active: "Actif",
      inactive: "Inactif",
      error: "Erreur",
      testing: "En test",
    },
    statusFilter: {
      any: "Tous les statuts",
    },
    healthStatus: {
      healthy: "Opérationnel",
      degraded: "Dégradé",
      unhealthy: "Défaillant",
      unknown: "Inconnu",
    },
    healthStatusFilter: {
      any: "Tous les états de santé",
    },
    securityType: {
      none: "Aucune",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "Texte brut (Plain)",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
    sortField: {
      name: "Nom",
      channel: "Canal",
      provider: "Fournisseur",
      status: "Statut",
      priority: "Priorité",
      messagesSentTotal: "Messages envoyés",
      lastUsedAt: "Dernière utilisation",
      createdAt: "Date de création",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    campaignType: {
      leadCampaign: "Campagne prospects",
      newsletter: "Newsletter",
      signupNurture: "Suivi des inscrits",
      retention: "Fidélisation",
      winback: "Reconquête",
      transactional: "Transactionnel",
      notification: "Notification",
      system: "Système",
    },
    campaignTypeFilter: {
      all: "Toutes les campagnes",
    },
    loadBalancingStrategy: {
      roundRobin: "Round robin (tourniquet)",
      weighted: "Pondéré",
      priority: "Priorité",
      leastUsed: "Le moins utilisé",
    },
  },
};
