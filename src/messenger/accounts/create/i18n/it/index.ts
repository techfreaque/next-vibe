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
  title: "Crea un account di Messenger",
  titleShort: "Nuovo account",
  description: "Creare un nuovo account messenger",

  enums: {
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
    imapAuthMethod: {
      plain: "Pianura",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
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

  fields: {
    name: {
      label: "Nome del conto",
      description: "Un nome unico per questo account",
      placeholder: "ad esempio. SMTP primario, Twilio SMS",
    },
    description: {
      label: "Designazione",
      description: "Descrizione facoltativa",
      placeholder: "Descrivere lo scopo di questo account",
    },
    channel: {
      label: "Canale",
      description: "Canale di comunicazione",
    },
    provider: {
      label: "Fornitore",
      description: "Fornitore di servizi per questo canale",
    },
    status: {
      label: "Stato",
      description: "Stato dell'account",
    },
    priority: {
      label: "Priorità",
      description: "Numero più alto = priorità maggiore",
    },
    isDefault: {
      label: "Account predefinito",
      description: "Utilizzare come predefinito per questo canale",
    },
    // SMTP outbound
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
      description: "Nome utente dell'autenticazione SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "Password SMTP",
      description: "password di autenticazione SMTP",
      placeholder: "••••••••",
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
      description: "Tempo di connessione in millisecondi",
    },
    smtpMaxConnections: {
      label: "Max connessioni",
      description: "Massime connessioni concorrenti",
    },
    smtpRateLimitPerHour: {
      label: "Limite di frequenza",
      description: "E-mail massime all'ora",
    },
    // API credentials
    apiKey: {
      label: "Chiave API",
      description: "chiave API per questo fornitore",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "Token API",
      description: "Token principale API / account SID",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "Segreto di API",
      description: "Le credenziali secondarie / auth token",
      placeholder: "••••••••",
    },
    fromId: {
      label: "Da ID",
      description: "Numero di telefono, mittente ID o token bot",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "Messaggio in entrata webhook URL",
      placeholder: "https://example.com/webhook",
    },
    // IMAP inbound
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
      description: "Nome utente dell'autenticazione IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "Password IMAP",
      description: "password di autenticazione IMAP",
      placeholder: "••••••••",
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
    // Email routing
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
    weight: {
      label: "Peso",
      description: "Peso di bilanciamento del carico",
    },
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
      title: "Account Creato",
      description: "Nuovi dettagli dell'account messenger",
      id: "ID",
      name: "Nome",
      channel: "Canale",
      provider: "Fornitore",
      status: "Stato",
      smtpFromEmail: "Da e-mail",
      fromId: "Da ID",
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
    forbidden: {
      title: "Accesso negato",
      description: "Accesso negato",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorsa non trovata",
    },
    conflict: {
      title: "Nome Conflitto",
      description: "Un account con questo nome esiste già",
    },
    server: {
      title: "Errore del server",
      description: "Non è riuscito a creare account",
      detail: "La creazione dell'account non è riuscita: {{error}}",
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
    title: "Account Creato",
    description: "account Messenger creato con successo",
  },
};
