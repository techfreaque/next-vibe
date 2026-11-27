import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Messaggistica",
  },
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
  },
  languages: {
    it: "Italiano",
    es: "Spagnolo",
    sk: "Slovacco",
    hi: "Hindi",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
  get: {
    title: "Visualizza account Messenger",
    titleShort: "Visualizza Account",
    description: "Ottieni i dettagli dell'account messenger",
  },
  enums: {
    channel: {
      email: "Email",
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
      active: "Attivo",
      inactive: "Inattivo",
      error: "Errore",
      testing: "Testing",
    },
    securityType: {
      none: "Nessuno",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: { plain: "Pianura", oauth2: "OAuth2", xoauth2: "XOAUTH2" },
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
    emailJourneyVariant: {
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      newsletterMay2026: "Newsletter maggio 2026",
      newsletterNov2026: "Newsletter Novembre 2026",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Iniziativa",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
  },

  sections: {
    identity: "Identità del conto",
    identitySubtitle: "Nome e impostazioni di base per questo account",
    smtp: "SMTP Outbound",
    smtpSubtitle: "Impostazioni server per l'invio di e-mail",
    api: "Credenziali API",
    apiSubtitle: "Chiave del fornitore API e accesso al token",
    apiSubtitleSms: "Provider API chiave e mittente ID",
    apiSubtitleWhatsapp: "Token WhatsApp Business API e numero di telefono ID",
    apiSubtitleTelegram:
      "Immetti il tuo token del robot di Telegram da @BotFather",
    apiTitleSms: "Credenziali del fornitore di SMS",
    apiTitleWhatsapp: "Credenziali aziendali WhatsApp",
    apiTitleTelegram: "Token Bot",
    imap: "In arrivo IMAP",
    imapSubtitle:
      "Configurare per ricevere e sincronizzare le email in arrivo (opzionale)",
    routing: "Email Routing",
    routingSubtitle:
      "Controllare quali campagne e viaggi utilizzare questo account",
    toggleHide: "Nascondi",
    toggleShow: "Mostra",
  },

  delete: {
    title: "Eliminare il conto",
    titleShort: "Eliminare il conto",
    description: "Cancellare permanentemente questo account messenger",
    container: {
      title: "Eliminare il conto",
      description:
        "Sei sicuro di voler eliminare definitivamente questo account messenger? Questa azione non può essere annullata.",
    },
    backButton: {
      label: "Annulla",
    },
    deleteButton: {
      label: "Eliminare il conto",
    },
    success: {
      title: "Conto cancellato",
      description: "account Messenger è stato cancellato permanentemente",
    },
  },
  put: {
    title: "Modifica account Messenger",
    titleShort: "Modifica account",
    description: "Impostazioni dell'account messenger di aggiornamento",
    success: {
      title: "Aggiornamento del conto",
      description: "account Messenger aggiornato con successo",
    },
  },
  fields: {
    id: { label: "ID", description: "Account ID" },
    name: {
      label: "Nome del conto",
      description: "Un nome unico per questo account",
      placeholder: "ad esempio. SMTP primario",
    },
    description: {
      label: "Designazione",
      description: "Descrizione facoltativa",
      placeholder: "Descrivere lo scopo di questo account",
    },
    channel: { label: "Canale", description: "Canale di comunicazione" },
    provider: { label: "Fornitore", description: "Fornitore di servizi" },
    status: { label: "Stato", description: "Stato dell'account" },
    priority: {
      label: "Priorità",
      description: "Numero più alto = priorità maggiore",
    },
    isDefault: {
      label: "Account predefinito",
      description: "Utilizzare come predefinito per questo canale",
    },
    smtpHost: {
      label: "Host SMTP",
      description: "Nome host server SMTP",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "Porto di SMTP",
      description: "Porta server SMTP",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Sicurezza",
      description: "Tipo di sicurezza del collegamento",
    },
    smtpUsername: {
      label: "Nome utente SMTP",
      description: "Nome utente SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "Password SMTP",
      description: "Lasciare vuoto per mantenere esistente",
      placeholder: "Nuova password o lasciare vuoto",
    },
    smtpFromEmail: {
      label: "Da e-mail",
      description: "Indirizzo e-mail di pagamento",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "Dal nome",
      description:
        "Nome del display del mittente indicato nei client di posta elettronica",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Tempo di connessione",
      description: "Timeout in millimetri",
    },
    smtpMaxConnections: {
      label: "Max connessioni",
      description: "Massime connessioni concorrenti",
    },
    smtpRateLimitPerHour: {
      label: "Limite di frequenza",
      description: "E-mail massime all'ora",
    },
    apiKey: {
      label: "Chiave API",
      description: "Lasciare vuoto per mantenere esistente",
      placeholder: "Lasciare vuoto per mantenere esistente",
    },
    apiToken: {
      label: "Token API",
      description: "Lasciare vuoto per mantenere esistente",
      placeholder: "Lasciare vuoto per mantenere esistente",
    },
    apiSecret: {
      label: "Segreto di API",
      description: "Lasciare vuoto per mantenere esistente",
      placeholder: "Lasciare vuoto per mantenere esistente",
    },
    fromId: {
      label: "Da ID",
      description: "Numero di telefono o mittente ID",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "Messaggio in entrata webhook URL",
      placeholder: "https://example.com/webhook",
    },
    imapHost: {
      label: "Host IMAP",
      description: "Nome host server IMAP",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "Porto di IMAP",
      description: "Porta server IMAP",
      placeholder: "993",
    },
    imapSecure: {
      label: "IMAP TLS",
      description: "Utilizzare TLS / SSL per IMAP",
    },
    imapUsername: {
      label: "Nome utente IMAP",
      description: "Nome utente IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "Password IMAP",
      description: "Lasciare vuoto per mantenere esistente",
      placeholder: "Lasciare vuoto per mantenere esistente",
    },
    imapAuthMethod: {
      label: "Metodo dell'auth di IMAP",
      description: "Metodo di autenticazione IMAP",
    },
    imapSyncEnabled: {
      label: "Abilitare Sync",
      description: "Abilita la sincronizzazione automatica IMAP",
    },
    imapSyncInterval: {
      label: "Intervallo di sincronizzazione",
      description: "Intervallo di sincronizzazione in secondi",
    },
    imapMaxMessages: {
      label: "Max messaggi",
      description: "Max messaggi da sincronizzare per cartella",
    },
    campaignTypes: {
      label: "Tipi di campagna",
      description: "Tipi di campagna questo account gestisce",
      placeholder: "Seleziona i tipi di campagna",
    },
    emailJourneyVariants: {
      label: "Varianti di viaggio",
      description: "Varianti di viaggio e-mail",
      placeholder: "Selezionare le varianti di viaggio",
    },
    emailCampaignStages: {
      label: "Fasi di campagna",
      description: "Stadi di campagna",
      placeholder: "Seleziona le fasi",
    },
    countries: {
      label: "Paesi",
      description: "Paesi dell'obiettivo",
      placeholder: "Seleziona i paesi",
    },
    languages: {
      label: "Lingue",
      description: "Lingue di destinazione",
      placeholder: "Seleziona le lingue",
    },
    isExactMatch: {
      label: "Partita esatta",
      description: "Richiedere un'esatta corrispondenza paese/lingua",
    },
    weight: { label: "Peso", description: "Peso di bilanciamento del carico" },
    isFailover: {
      label: "Failover",
      description: "Utilizzare come account failover",
    },
    isSystem: {
      label: "Porta mail della piattaforma",
      description:
        "Posta di proprietà della piattaforma ops. Le credenziali provengono da env; escluse dalle campagne.",
    },
    failoverPriority: {
      label: "Priorità di failover",
      description: "Ordine prioritario di failover",
    },
  },
  response: {
    account: {
      id: "ID",
      name: "Nome",
      channel: "Canale",
      provider: "Fornitore",
      status: "Stato",
      healthStatus: "Salute",
      isDefault: "Predefinito",
      priority: "Priorità",
      smtpFromEmail: "Da e-mail",
      smtpFromName: "Dal nome",
      fromId: "Da ID",
      smtpHost: "Host SMTP",
      smtpPort: "Porto di SMTP",
      smtpSecurityType: "Sicurezza",
      smtpUsername: "Nome utente SMTP",
      imapHost: "Host IMAP",
      imapPort: "Porto di IMAP",
      imapSyncEnabled: "Sincronizzazione IMAP",
      imapLastSyncAt: "Ultimo IMAP Sync",
      campaignTypes: "Tipi di campagna",
      emailJourneyVariants: "Varianti di viaggio",
      emailCampaignStages: "Fasi di campagna",
      countries: "Paesi",
      languages: "Lingue",
      isExactMatch: "Partita esatta",
      weight: "Peso",
      isFailover: "Failover",
      isSystem: "Porta mail della piattaforma",
      failoverPriority: "Priorità di failover",
      messagesSentTotal: "Messaggi inviati",
      lastUsedAt: "Ultimo uso",
      createdAt: "Creato",
      updatedAt: "Aggiornato",
    },
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Dati dell'account non valido",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accesso all'amministratore richiesto",
    },
    forbidden: { title: "Accesso negato", description: "Accesso negato" },
    notFound: { title: "Non trovato", description: "Account non trovato" },
    conflict: {
      title: "Nome Conflitto",
      description: "Un account con questo nome esiste già",
    },
    server: {
      title: "Errore del server",
      description: "Non è stato possibile elaborare la richiesta",
      detail_get: "Non è possibile caricare l'account: {{error}}",
      detail_update: "Non è possibile salvare l'account: {{error}}",
      detail_delete: "Non è possibile eliminare l'account: {{error}}",
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
    title: "Operazione riuscita",
    description: "Conto caricato con successo",
  },
};
