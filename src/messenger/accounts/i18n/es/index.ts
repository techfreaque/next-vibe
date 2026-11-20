import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuentas de Mensajero",
  tag: "Cuentas de mensajero",
  enums: {
    channel: {
      email: "Correo electrónico",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Todos los canales",
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
      any: "Todos los proveedores",
    },
    status: {
      active: "Activa",
      inactive: "Inactivo",
      error: "Error",
      testing: "Pruebas",
    },
    statusFilter: {
      any: "Todos los estatutos",
    },
    healthStatus: {
      healthy: "Salud",
      degraded: "Degradado",
      unhealthy: "Insalubres",
      unknown: "Desconocida",
    },
    healthStatusFilter: {
      any: "Todos los estados de salud",
    },
    securityType: {
      none: "Ninguno",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
    sortField: {
      name: "Nombre",
      channel: "Canal",
      provider: "Proveedor",
      status: "Situación",
      priority: "Prioridad",
      messagesSentTotal: "Mensajes enviados",
      lastUsedAt: "Último usado",
      createdAt: "Creado en",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    campaignType: {
      leadCampaign: "Campaña de captación de contactos",
      newsletter: "Boletín",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      transactional: "Transaccional",
      notification: "Notificación",
      system: "Sistema",
    },
    campaignTypeFilter: {
      all: "Todas las campañas",
    },
    loadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Visto",
      priority: "Prioridad",
      leastUsed: "Menos usado",
    },
  },
};
