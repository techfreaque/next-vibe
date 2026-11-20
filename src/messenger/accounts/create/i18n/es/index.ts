import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Mensajería",
  },
  countries: {
    ...regionalCountryNames("es"),
    global: "Global",
    de: "Alemania",
    pl: "Polonia",
    fr: "Francia",
    us: "Estados Unidos",
  },
  languages: {
    it: "Italiano",
    es: "Español",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
  title: "Crear cuenta de Messenger",
  titleShort: "Cuenta nueva",
  description: "Crear una nueva cuenta de mensajero",

  enums: {
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
    emailJourneyVariant: {
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
    },
    emailCampaignStage: {
      notStarted: "No empezó",
      initial: "Inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
    channel: {
      email: "Correo electrónico",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
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
    status: {
      active: "Activa",
      inactive: "Inactivo",
      error: "Error",
      testing: "Pruebas",
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
  },

  sections: {
    identity: "Identidad en la cuenta",
    identitySubtitle: "Nombre y configuración básica de esta cuenta",
    smtp: "SMTP Outbound",
    smtpSubtitle: "Configuración del servidor para enviar correos electrónicos",
    api: "API Credenciales",
    apiSubtitle: "Proveedor API clave y acceso token",
    apiSubtitleSms: "Proveedor API llave y remitente ID",
    apiSubtitleWhatsapp: "WhatsApp Business API token y número de teléfono ID",
    apiSubtitleTelegram: "Entra tu bot token de Telegram desde @BotFather",
    apiTitleSms: "Credenciales del proveedor de SMS",
    apiTitleWhatsapp: "WhatsApp Credenciales empresariales",
    apiTitleTelegram: "Bot Token",
    imap: "IMAP Inbound",
    imapSubtitle:
      "Configure para recibir y sincronizar correos electrónicos entrantes (opcional)",
    routing: "Correo electrónico Routing",
    routingSubtitle: "Controlar qué campañas y viajes utilizan esta cuenta",
    toggleHide: "Escóndete",
    toggleShow: "Show",
  },

  fields: {
    name: {
      label: "Nombre de la cuenta",
      description: "Un nombre único para esta cuenta",
      placeholder: "Por ejemplo. SMTP primario, Twilio SMS",
    },
    description: {
      label: "Descripción",
      description: "Opcional descripción",
      placeholder: "Describir el propósito de esta cuenta",
    },
    channel: {
      label: "Canal",
      description: "Canal de comunicación",
    },
    provider: {
      label: "Proveedor",
      description: "Proveedor de servicios para este canal",
    },
    status: {
      label: "Situación",
      description: "Situación de la cuenta",
    },
    priority: {
      label: "Prioridad",
      description: "Mayor número = mayor prioridad",
    },
    isDefault: {
      label: "Cuenta por defecto",
      description: "Utilice como predeterminado para este canal",
    },
    // SMTP outbound
    smtpHost: {
      label: "SMTP Host",
      description: "Nombre de host del servidor SMTP",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "Puerto SMTP",
      description: "Puerto servidor SMTP",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Seguridad",
      description: "Tipo de seguridad de conexión",
    },
    smtpUsername: {
      label: "SMTP Nombre de usuario",
      description: "Nombre de usuario de autenticación SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "SMTP Contraseña",
      description: "contraseña de autenticación SMTP",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "De correo electrónico",
      description: "Dirección de correo electrónico del remitente",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "De nombre",
      description:
        "Nombre de la pantalla del remitente mostrado en clientes de correo electrónico",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Tiempo de conexión",
      description: "Tiempo de conexión en milisegundos",
    },
    smtpMaxConnections: {
      label: "Max Connections",
      description: "Conexión máxima concurrente",
    },
    smtpRateLimitPerHour: {
      label: "Límite de solicitudes",
      description: "Correos electrónicos máximos por hora",
    },
    // API credentials
    apiKey: {
      label: "API Key",
      description: "Llave API para este proveedor",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "API Token",
      description: "API primario token / cuenta SID",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "API Secret",
      description: "Credencial secundaria / auth token",
      placeholder: "••••••••",
    },
    fromId: {
      label: "De ID",
      description: "Número de teléfono, remitente ID, o bot token",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "Mensaje de entrada webhook URL",
      placeholder: "https://example.com/webhook",
    },
    // IMAP inbound
    imapHost: {
      label: "IMAP Host",
      description: "Nombre de host del servidor IMAP",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "Puerto IMAP",
      description: "Puerto servidor IMAP",
      placeholder: "993",
    },
    imapSecure: {
      label: "IMAP TLS",
      description: "Use TLS / SSL para IMAP",
    },
    imapUsername: {
      label: "IMAP Nombre de usuario",
      description: "Nombre de usuario de autenticación IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "IMAP Contraseña",
      description: "contraseña de autenticación IMAP",
      placeholder: "••••••••",
    },
    imapAuthMethod: {
      label: "IMAP Auth Method",
      description: "Método de autenticación IMAP",
    },
    imapSyncEnabled: {
      label: "Permitir Sync",
      description: "Activar la sincronización automática IMAP",
    },
    imapSyncInterval: {
      label: "Sync Interval",
      description: "Intervalos sincronizados en segundos",
    },
    imapMaxMessages: {
      label: "Mensajes Max",
      description: "Mensajes máximos para sincronizar por carpeta",
    },
    // Email routing
    campaignTypes: {
      label: "Tipos de campaña",
      description: "Tipos de campaña esta cuenta maneja",
      placeholder: "Seleccionar tipos de campaña",
    },
    emailJourneyVariants: {
      label: "Variedades de viaje",
      description: "Variaciones de viaje por correo electrónico",
      placeholder: "Seleccione las variantes de viaje",
    },
    emailCampaignStages: {
      label: "Estadísticas de campaña",
      description: "Etapas de la campaña",
      placeholder: "Seleccionar etapas",
    },
    countries: {
      label: "Países",
      description: "Países beneficiarios",
      placeholder: "Seleccionar países",
    },
    languages: {
      label: "Idiomas",
      description: "Idiomas de destino",
      placeholder: "Seleccionar idiomas",
    },
    isExactMatch: {
      label: "Partido de acción",
      description: "Consultar el partido exacto país/idioma",
    },
    weight: {
      label: "Peso",
      description: "Peso de equilibrio de carga",
    },
    isFailover: {
      label: "Failover",
      description: "Usar como cuenta de failover",
    },
    isSystem: {
      label: "Buzón de correo de plataforma",
      description:
        "Buzón de correo de operaciones de propiedad de la plataforma. Las credenciales provienen de env; excluidos de las campañas.",
    },
    failoverPriority: {
      label: "Prioridad de Failover",
      description: "Orden de prioridad",
    },
  },

  response: {
    account: {
      title: "Cuenta Creada",
      description: "Nuevos detalles de la cuenta de mensajero",
      id: "ID",
      name: "Nombre",
      channel: "Canal",
      provider: "Proveedor",
      status: "Situación",
      smtpFromEmail: "De correo electrónico",
      fromId: "De ID",
      createdAt: "Creado",
      updatedAt: "Actualizado",
    },
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Datos de la cuenta inválida",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Acceso de los administradores necesario",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Acceso denegado",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    conflict: {
      title: "Nombre Conflicto",
      description: "Una cuenta con este nombre ya existe",
    },
    server: {
      title: "Error del servidor",
      description: "Failed to create account",
      detail: "La creación de cuenta falló: {{error}}",
    },
    networkError: {
      title: "Error de red",
      description: "La comunicación de redes falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
  },

  success: {
    title: "Cuenta Creada",
    description: "Cuenta de Messenger creada con éxito",
  },
};
