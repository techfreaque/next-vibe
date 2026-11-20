import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Messaggistica",
  },
  title: "Conti Messenger",
  titleShort: "Account",
  description: "Elenca tutti gli account messenger in tutti i canali",

  fields: {
    channel: {
      label: "Canale",
      description: "Filtra per canale",
    },
    provider: {
      label: "Fornitore",
      description: "Filtra dal fornitore",
    },
    status: {
      label: "Stato",
      description: "Filtra per lo stato dell'account",
    },
    search: {
      label: "Cerca",
      description: "Ricerca per nome o descrizione",
      placeholder: "Conti di ricerca...",
    },
    page: {
      label: "Pagina",
      description: "Numero di pagina per paginazione",
    },
    limit: {
      label: "Limite",
      description: "Numero di conti per pagina",
    },
    sortBy: {
      label: "Ordina per",
      description: "Ordinare conti per campo",
    },
    sortOrder: {
      label: "Ordinare",
      description: "Ordinare ordine (a seconda o discesa)",
    },
  },

  response: {
    account: {
      title: "Account",
      description: "Dati dell'account Messenger",
      id: "ID",
      name: "Nome",
      channel: "Canale",
      provider: "Fornitore",
      status: "Stato",
      healthStatus: "Salute",
      priority: "Priorità",
      messagesSentTotal: "Messaggi inviati",
      lastUsedAt: "Ultimo uso",
      createdAt: "Creato",
      isDefault: "Predefinito",
      smtpFromEmail: "Da e-mail",
      fromId: "Da ID",
    },
    pagination: {
      title: "Pagina",
      description: "Informazioni sulla pagina",
      page: "Pagina",
      limit: "Per pagina",
      total: "Totale",
      totalPages: "Pagine totali",
    },
  },

  widget: {
    create: "Aggiungi un account",
    graphs: "Grafi",
    refresh: "Aggiorna",
    emptyState: "Nessun account messenger configurato",
    searchPlaceholder: "Conti di ricerca...",
    deleteConfirm: "Eliminare questo account?",
    deleteConfirmYes: "Elimina",
    deleteConfirmNo: "Annulla",
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri del filtro non valido",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accesso all'amministratore richiesto",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso negato",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorsa non trovata",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono in conflitto",
    },
    server: {
      title: "Errore del server",
      description: "Non recuperato account",
      detail: "Non è possibile caricare i conti: {{error}}",
    },
    networkError: {
      title: "Errore di rete",
      description: "La comunicazione di rete è fallita",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
  },

  success: {
    title: "Conti recuperati",
    description: "Con successo recuperato account messenger",
  },

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
      any: "Tutti",
    },
    sortField: {
      name: "Nome",
      channel: "Canale",
      provider: "Fornitore",
      status: "Stato",
      priority: "Priorità",
      messagesSentTotal: "Messaggi inviati",
      lastUsedAt: "Ultimo uso",
      createdAt: "Creato",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
  },
};
