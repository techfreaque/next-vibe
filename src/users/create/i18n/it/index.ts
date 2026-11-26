import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",
  tags: {
    create: "Creare",
    admin: "Amministratore",
  },
  post: {
    title: "Crea utente",
    titleShort: "Crea utente",
    description: "Creare un nuovo account utente",
    form: {
      title: "Modulo di creazione dell'utente",
      description: "Compila i dettagli per creare un nuovo utente",
    },
    email: {
      label: "Indirizzo email",
      description:
        "Indirizzo email dell'utente per il login e la comunicazione",
    },
    password: {
      label: "Password",
      description: "Password sicura per l'account utente",
    },
    privateName: {
      label: "Nome privato",
      description:
        "Nome completo legale dell'utente (visibile solo agli amministratori)",
    },
    publicName: {
      label: "Nome pubblico",
      description:
        "Nome di visualizzazione dell'utente (visibile a tutti gli utenti)",
    },
    firstName: {
      label: "Nome",
      description: "Nome utente",
    },
    lastName: {
      label: "Ultimo nome",
      description: "cognome dell'utente",
    },
    company: {
      label: "Società",
      description: "Azienda o organizzazione dell'utente",
    },
    phone: {
      label: "Numero di telefono",
      description: "Numero di telefono di contatto dell'utente",
    },
    preferredContactMethod: {
      label: "Metodo di contatto preferito",
      description: "Come l'utente preferisce essere contattato",
    },
    roles: {
      label: "Ruoli utente",
      description: "Assegnare ruoli all'utente",
    },
    imageUrl: {
      label: "Immagine del profilo URL",
      description: "URL all'immagine del profilo dell'utente",
    },
    bio: {
      label: "Biografia",
      description: "Breve descrizione dell'utente",
    },
    website: {
      label: "Sito web",
      description: "Sito personale o aziendale dell'utente",
    },
    jobTitle: {
      label: "Titolo del lavoro",
      description: "Titolo o posizione del lavoro dell'utente",
    },
    emailVerified: {
      label: "E-mail verificato",
      description: "Se l'e-mail dell'utente è verificata",
    },
    isActive: {
      label: "Stato attivo",
      description: "Se l'account utente è attivo",
    },
    leadId: {
      label: "ID del contatto",
      description: "Identificatore di contatto associato",
    },
    country: {
      label: "Paese",
      description: "Paese di residenza dell'utente",
    },
    language: {
      label: "Lingua",
      description: "La lingua preferita dell'utente",
    },
    response: {
      title: "Creato dall'utente",
      description: "Dettagli dell'utente appena creato",
      id: {
        content: "Utente ID",
      },
      leadId: {
        content: "Contatto associato ID",
      },
      country: {
        label: "Paese",
        description: "Paese di residenza dell'utente",
      },
      language: {
        label: "Lingua",
        description: "La lingua preferita dell'utente",
      },
      email: {
        content: "Indirizzo email",
      },
      privateName: {
        content: "Nome privato",
      },
      publicName: {
        content: "Nome pubblico",
      },
      firstName: {
        content: "Nome",
      },
      lastName: {
        content: "Ultimo nome",
      },
      company: {
        content: "Società",
      },
      phone: {
        content: "Numero di telefono",
      },
      preferredContactMethod: {
        content: "Metodo di contatto preferito",
      },
      imageUrl: {
        content: "Immagine del profilo",
      },
      bio: {
        content: "Biografia",
      },
      website: {
        content: "Sito web",
      },
      jobTitle: {
        content: "Titolo del lavoro",
      },
      emailVerified: {
        content: "E-mail verificato",
      },
      isActive: {
        content: "Stato attivo",
      },
      stripeCustomerId: {
        content: "Stripe cliente ID",
      },
      userRoles: {
        content: "Ruoli utente",
        id: {
          content: "Role ID",
        },
        role: {
          content: "Role",
        },
      },
      createdAt: {
        content: "Creato a",
      },
      updatedAt: {
        content: "Aggiornato At",
      },
    },
    errors: {
      unauthorized: {
        title: "Accesso non autorizzato",
        description: "Devi essere connesso per creare utenti",
      },
      validation: {
        title: "Convalida non riuscita",
        description: "Si prega di controllare i dati del modulo e riprovare",
      },
      server: {
        title: "Errore del server",
        description:
          "Incapace di creare l'utente a causa dell'errore del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante la creazione dell'utente",
      },
      network: {
        title: "Errore di rete",
        description:
          "La connessione di rete è fallita durante la creazione dell'utente",
      },
      forbidden: {
        title: "Accesso Proibito",
        description: "Non hai il permesso di creare utenti",
      },
      notFound: {
        title: "Risorse non trovata",
        description:
          "risorsa necessaria non trovata per la creazione dell'utente",
      },
      conflict: {
        title: "Utente già esistente",
        description: "Un utente con questa e-mail esiste già",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che saranno persi",
      },
      internal: {
        title: "Errore interno: {{details}}",
        description:
          "Si è verificato un errore interno durante la creazione dell'utente",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS Benvenuto non riuscito",
          description: "Non ha inviato il benvenuto SMS all'utente",
        },
        verification_failed: {
          title: "La verifica di SMS non è riuscita",
          description:
            "Non è stato possibile inviare la verifica SMS all'utente",
        },
      },
    },
    success: {
      title: "Utente Creato con successo",
      description: "Il nuovo account utente è stato creato",
      message: {
        content: "Utente creato con successo",
      },
      created: {
        content: "Creato",
      },
    },
  },
  widget: {
    headerCreated: "Creato dall'utente",
    headerCreate: "Nuovo utente",
    headerSubtitle: "Aggiungi un account admin o cliente. Può accedere subito.",
    activeBadge: "Attivo",
    verifiedBadge: "Verificato",
    copiedTooltip: "Copiato",
    copyUserIdTooltip: "Copia utente ID",
    copyIdButton: "Copia ID",
    copiedButton: "Copiato",
    viewUserButton: "Visualizza utente",
    fullProfileButton: "Profilo completo",
    creditHistoryButton: "Storico crediti",
    createAnotherButton: "Crea un altro utente",
    createdPrefix: "Creato",
    createButton: "Crea utente",
    sections: {
      signIn: "Accesso",
      profile: "Profilo",
      access: "Permessi",
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "Benvenuto nella nostra piattaforma, {{firstName}}!",
        preview: "Il tuo account è stato creato con successo",
        subject: "Benvenuto a {{companyName}} - Il tuo account è pronto!",
        introduction:
          "Ciao {{firstName}}, siamo entusiasti di averti a bordo! Il tuo account è stato creato con successo e ora puoi accedere a tutte le nostre funzionalità.",
        accountDetails: "Dettagli dell'account",
        email: "Email",
        name: "Nome",
        publicName: "Nome dell'esposizione",
        company: "Società",
        phone: "Telefono",
        nextSteps: "Prossimo passo",
        loginButton: "Accedi al tuo account",
        support:
          "Se avete domande, il nostro team di supporto è qui per aiutare. Contattaci in qualsiasi momento!",
      },
      admin: {
        newUser: "Nuovo utente Creato",
        preview: "È stato creato un nuovo utente {{firstName}} {{lastName}}",
        subject: "Nuovo account utente creato - {{firstName}} {{lastName}}",
        notification:
          "Nel sistema è stato creato un nuovo account utente. Ecco i dettagli:",
        userDetails: "Dettagli utente",
        viewUser: "Visualizza profilo utente",
      },
      errors: {
        missing_data:
          "I dati dell'utente richiesti sono mancanti per il modello di e-mail",
      },
      error: {
        general: {
          internal_server_error: "Si è verificato un errore del server interno",
        },
      },
      labels: {
        id: "ID:",
        email: "Email:",
        name: "Nome:",
        privateName: "Nome completo:",
        publicName: "Nome dell'esposizione:",
        company: "Società:",
        created: "Creato:",
        leadId: "Contatto ID:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "Benvenuto {{firstName}}! Il tuo account è stato creato con successo. Visitaci a {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, il codice di verifica è: {{code}}. Inserisci il codice entro 10 minuti.",
    },
    errors: {
      welcome_failed: {
        title: "SMS Benvenuto non riuscito",
        description: "Non ha inviato il benvenuto SMS all'utente",
      },
      verification_failed: {
        title: "La verifica di SMS non è riuscita",
        description: "Non è stato possibile inviare la verifica SMS all'utente",
      },
    },
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
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
  enums: {
    userRole: {
      public: "Pubblico",
      customer: "Cliente",
      partnerAdmin: "Amministratore partner",
      partnerEmployee: "Collaboratore partner",
      admin: "Amministratore",
      cliOff: "CLI disattivata",
      cliAuthBypass: "CLI senza autenticazione",
      aiToolOff: "Strumento IA disattivato",
      webOff: "Web disattivato",
      mcpOff: "MCP disattivato",
      mcpVisible: "Visibile in MCP",
      productionOff: "Disattivato in produzione",
      skillOff: "Skill disattivata",
    },
  },
};
