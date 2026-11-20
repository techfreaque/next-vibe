/**
 * Contact API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Parla con una persona",
  titleShort: "Contattaci",
  description:
    "Qualcosa non funziona o vuoi parlare con una persona? Scrivici cosa ti serve. Qualcuno del nostro team leggerà il tuo messaggio e ti risponderà.",
  category: "Sistema",
  summary:
    "Invia i moduli di contatto di processo con il tracciamento del piombo",
  tags: {
    contactForm: "Modulo",
    contactUs: "Contattaci",
    contactSubmission: "Contattare la sottomissione",
    helpSupport: "Aiuto &amp; Supporto",
  },

  form: {
    label: "Contattaci",
    description:
      "Una persona leggerà il tuo messaggio e ti risponderà. Zero bot, zero giri a vuoto.",
    fields: {
      name: {
        label: "Il tuo nome",
        description:
          "Nome completo della persona che presenta il modulo di contatto. Minimo 2 caratteri.",
        placeholder: "John Doe",
      },
      email: {
        label: "Indirizzo email",
        description:
          "Dove possiamo risponderti? Se hai effettuato l’accesso, lascia il campo vuoto e useremo l’email del tuo account.",
        placeholder: "john.doe@example.com",
      },
      company: {
        label: "Società",
        description:
          "Società facoltativa o nome dell'organizzazione associata con l'inchiesta.",
        placeholder: "Corda d'acme",
      },
      subject: {
        label: "Oggetto",
        description:
          "Categoria dell'inchiesta - usato per indirizzare il messaggio alla squadra corretta.",
        placeholder: "Richiesta generale sui servizi",
      },
      message: {
        label: "Messaggio",
        description:
          "Testo completo dell'inchiesta. Minimo 10 caratteri. Sii specifico per le tue esigenze.",
        placeholder: "Cosa ti serve? Bastano poche righe.",
      },
      priority: {
        label: "Priorità",
        description:
          "Livello di urgenza per l'inchiesta. Le richieste elevate o urgenti ricevono risposte più rapide.",
        placeholder: "Seleziona il livello di priorità",
      },
      leadId: {
        label: "ID del contatto",
        description: "Tracciamento del piombo interno ID (auto-riempita)",
        placeholder: "lead_123",
      },
    },
    submitButton: {
      label: "Invia messaggio",
      loadingText: "Invio in corso…",
    },
  },

  subject: {
    helpSupport: "Aiuto &amp; Supporto",
    generalInquiry: "Richiesta generale",
    technicalSupport: "Supporto tecnico",
    accountQuestion: "Questione di conto",
    billingQuestion: "Domanda di fatturazione",
    salesInquiry: "Richiesta di vendita",
    featureRequest: "Richiesta di funzionalità",
    bugReport: "Segnalazione di un errore",
    feedback: "Feedback",
    complaint: "Spiegare",
    partnership: "Partnership",
    other: "Altro",
  },

  priority: {
    low: "Basso",
    medium: "Mezzo medio",
    high: "Alto.",
    urgent: "Urgente",
  },

  status: {
    new: "Nuovo",
    inProgress: "In corso",
    resolved: "Risolto",
    closed: "Chiuso",
  },

  response: {
    label: "Contatto Risposta della sottomissione",
    description: "Aggiornamenti di stato per la presentazione dei contatti",
    success:
      "Grazie per averci contattato! Abbiamo ricevuto il tuo messaggio e torneremo presto.",
    messageId: "Messaggio ID per il monitoraggio",
    status: "Stato attuale del contatto",
  },

  examples: {
    requests: {
      general: {
        title: "Richiesta di contatto generale",
        description:
          "Esempio di una presentazione generale del modulo di contatto",
      },
    },
    responses: {
      success: {
        title: "Submissione di successo",
        description: "Esempio di risposta del modulo di contatto di successo",
      },
    },
  },

  errors: {
    createFailed: {
      title: "Invio di contatto fallito",
      description:
        "Non è possibile elaborare il modulo di contatto in questo momento. Per favore riprovate più tardi.",
    },
    repositoryCreateFailed:
      "Non è possibile creare una richiesta di contatto: {{error}}",
    repositoryCreateFailedForEmail:
      "Non è stato possibile creare una richiesta di contatto per {{email}}",
    repositoryCreateFailedWithDetails:
      "Non è possibile creare una richiesta di contatto: {{error}}. {{details}}",
    repositoryCreateDetails:
      "Non è possibile elaborare il modulo di contatto in questo momento. Per favore riprovate più tardi.",
    noContactReturned:
      "Nessun record di contatto è stato restituito dopo la creazione",
    validation: {
      messageEmpty: "Inserire un messaggio prima di inviare.",
      title: "Errore di convalida",
      description: "Si prega di controllare il vostro input e riprovare",
      nameMinLength: "Il nome deve essere lungo almeno 2 caratteri",
      emailInvalid: "Si prega di inserire un indirizzo email valido",
      emailRequired:
        "Si prega di fornire un indirizzo e-mail in modo da poter rispondere a voi",
      subjectRequired: "Il soggetto è richiesto",
      messageMinLength: "Il messaggio deve essere lungo almeno 10 caratteri",
      priorityInvalid: "Si prega di selezionare un livello di priorità valido",
      statusInvalid: "Valore di stato non valido",
    },
    network: {
      title: "Errore di rete",
      description:
        "Si è verificato un errore di rete durante l'elaborazione della vostra richiesta",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Non sei autorizzato a eseguire questa azione",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Questa azione è vietata",
    },
    notFound: {
      title: "Non trovato",
      description: "La risorsa richiesta non è stata trovata",
    },
    serverError: {
      title: "Errore del server",
      description: "Si è verificato un errore del server interno",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description:
        "Si è verificato un conflitto durante l'elaborazione della vostra richiesta",
    },
    email_generation_failed: "Non generare e-mail",
  },

  sms: {
    admin: {
      notification: "Nuova richiesta di contatto: {name} ({email}) - {subject}",
      phone: {
        missing:
          "Nessun numero di telefono di amministratore configurato per le notifiche di contatto",
      },
      send: {
        start:
          "Inviare la notifica di amministrazione SMS per la presentazione dei contatti",
        error: "Avviso di errore di invio di admin SMS per contatto",
      },
    },
    confirmation: {
      message: "{name}, grazie per il tuo messaggio! Ti risponderemo presto.",
      phone: {
        missing:
          "Nessun numero di telefono utente disponibile per la conferma del contatto SMS",
      },
      send: {
        start: "Inviare la conferma SMS al modulo di contatto",
        error: "Conferma di invio di errore SMS per contatto",
      },
    },
  },

  repository: {
    create: {
      start: "Modulo di contatto iniziale",
      success: "Modulo di contatto presentato con successo",
      error: "Creazione di errore modulo di contatto",
    },
    lead: {
      conversion: {
        start: "Conversione iniziale del piombo per il contatto",
        error: "Errore durante la conversione del piombo per contatto",
      },
      provided: "Piombo ID fornito per la presentazione dei contatti",
    },
    seed: {
      create: {
        start: "Creazione dei semi di contatto",
        error: "Creazione di errori seme di contatto",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed:
          "Avviso di amministrazione SMS non riuscito per la presentazione dei contatti",
      },
      confirmation: {
        failed: "Conferma SMS non riuscito per la presentazione dei contatti",
      },
    },
  },

  seeds: {
    dev: {
      start: "Inizio dei semi di contatto per l'ambiente di sviluppo",
      submission: {
        created: "Contatto presentazione creato in semi di sviluppo",
        failed:
          "Non è riuscito a creare la presentazione dei contatti nei semi di sviluppo",
        error:
          "Creazione di errori di presentazione dei contatti nei semi di sviluppo",
      },
      complete: "Sementi di sviluppo del contatto completati",
      error: "Dati di sviluppo dei contatti per la verifica degli errori",
    },
    test: {
      start: "Semi di contatto per l'ambiente di prova",
      submission: {
        created: "Invio di contatto creato in semi di prova",
        failed:
          "Non è riuscito a creare la presentazione dei contatti nei semi di prova",
      },
      error: "Dati di test di contatto per la verifica degli errori",
    },
    prod: {
      start: "Semi di contatto per ambiente di produzione",
      ready: "Ambiente di produzione di contatto pronto",
      error: "Dati di produzione dei contatti di errore",
    },
  },

  noEmail: {
    warning: {
      title: "Manca l’indirizzo per la risposta",
      description:
        "Senza un indirizzo email possiamo leggere il messaggio, ma non risponderti. Puoi inviarlo comunque.",
      addEmail: "Aggiungi un’email",
      sendAnyway: "Invia comunque",
    },
  },

  success: {
    title: "Messaggio inviato",
    description:
      "Abbiamo ricevuto il tuo messaggio. Ti risponderà una persona del nostro team.",
  },

  aiPrompt: {
    confirmBeforeSend:
      "Confermare sempre con l'utente prima di inviare un modulo di contatto per loro conto.",
    humanHelp:
      "Se l'utente sembra frustrato, sconvolto o bloccato - proattivamente offrono di collegarli con un umano sul nostro team di supporto tramite il modulo di contatto.",
    emailFallback:
      "Se l'utente è connesso, la loro email è già sul file - non hanno bisogno di fornire di nuovo.",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "Ciao.",
      thankYou: "Grazie per averci contattato!",
      message: "Messaggio",
      additionalInfo:
        "Abbiamo ricevuto la vostra richiesta e risponderemo presto.",
      subject: "Modulo di contatto",
    },
    company: {
      contactDetails: "Dettagli di contatto",
      name: "Nome",
      email: "Email",
      company: "Società",
      contactSubject: "Oggetto",
      viewDetails: "Visualizza in Admin",
    },
    // User confirmation email
    user_confirmation: {
      title: "Abbiamo ricevuto il tuo messaggio",
      subject: "Grazie per aver contattato {{appName}}",
      previewText: "Abbiamo ricevuto il tuo messaggio. Ti risponderemo presto.",
      greeting: "Ciao {{name}},",
      thankYou: "Grazie per aver scritto a {{appName}}!",
      confirmation:
        "Il tuo messaggio è arrivato. Una persona legge ogni messaggio e rispondiamo appena possibile.",
      yourMessage: "Il tuo messaggio",
      subject_label: "Oggetto",
      message_label: "Messaggio",
      whatHappensNext: "Cosa succede adesso?",
      step1: "Una persona legge il tuo messaggio",
      step2: "Ti rispondiamo appena possibile",
      step3: "Cerchiamo insieme una soluzione",
      needUrgentHelp: "Ti serve aiuto subito?",
      urgentHelpInfo: "Nel centro assistenza trovi già molte risposte.",
      helpCenterButton: "Apri il centro assistenza",
      signoff:
        "Grazie per aver scelto {{appName}},\nIl team di assistenza di {{appName}}",
      footer: "Conferma automatica di {{appName}}",
    },
    // Admin notification email
    admin_notification: {
      title: "Nuovo messaggio dal modulo di contatto",
      subject: "Nuovo messaggio di {{name}}: {{subject}}",
      previewText: "Nuovo messaggio di {{name}} ({{email}})",
      message: "È arrivato un nuovo messaggio dal modulo di contatto.",
      contactDetails: "Dettagli di contatto",
      name: "Nome",
      email: "Email",
      company: "Società",
      subject_label: "Oggetto",
      priority: "Priorità",
      message_label: "Messaggio",
      submittedAt: "Presentato a",
      leadInfo: "Informazioni sul contatto",
      leadId: "ID del contatto",
      status: "Stato",
      actionRequired: "Azione richiesta",
      actionInfo: "Leggi la richiesta e rispondi appena possibile.",
      viewInAdmin: "Apri il pannello di amministrazione",
      replyToContact: "Rispondi al mittente",
      footer: "Notifica automatica di {{appName}}",
    },
  },

  error: {
    general: {
      internal_server_error: "Si è verificato un errore interno del server",
    },
  },

  emailTemplates: {
    contactForm: {
      meta: {
        name: "Modulo di contatto Notifica",
        description:
          "Email inviata al contatto e al team dell'azienda quando viene inviato un modulo di contatto",
        category: "contatto",
      },
      preview: {
        name: {
          label: "Nome del fornitore",
          description:
            "Nome completo della persona che presenta il modulo di contatto",
        },
        email: {
          label: "Email del mittente",
          description: "Indirizzo email di chi invia il modulo",
        },
        company: {
          label: "Nome della Società",
          description: "Nome dell'azienda facoltativo del mittente",
        },
        subject: {
          label: "Soggetto del messaggio",
          description: "Oggetto linea del messaggio di contatto",
        },
        priority: {
          label: "Livello di priorità",
          description: "Livello di urgenza dell'inchiesta",
        },
        message: {
          label: "Corpo del messaggio",
          description:
            "Il contenuto principale del messaggio dal modulo di contatto",
        },
        isForCompany: {
          label: "Invio all’azienda",
          description:
            "Indica se l’email è destinata all’azienda come notifica o al mittente come conferma",
        },
        userId: {
          label: "Utente ID",
          description: "utente opzionale ID per il monitoraggio",
        },
        leadId: {
          label: "ID del contatto",
          description: "Piombo opzionale ID per tracciamento CRM",
        },
      },
    },
    adminContact: {
      meta: {
        name: "Admin Contatto Notifica",
        description:
          "E-mail di notifica interna inviata agli amministratori quando viene presentato un nuovo modulo di contatto",
        category: "admin",
      },
      preview: {
        name: {
          label: "Nome del fornitore",
        },
        email: {
          label: "Email del mittente",
        },
        subject: {
          label: "Soggetto del messaggio",
        },
        priority: {
          label: "Livello di priorità",
        },
        message: {
          label: "Corpo del messaggio",
        },
        company: {
          label: "Nome della Società",
        },
        userId: {
          label: "Utente ID",
        },
        leadId: {
          label: "ID del contatto",
        },
      },
    },
  },
};
