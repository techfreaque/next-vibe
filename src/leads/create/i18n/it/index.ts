import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  tags: {
    leads: "Contatti",
    create: "Creare",
  },

  enums: {
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
  },
  widget: {
    headerLeadCreated: "Contatto creato",
    headerCreateLead: "Crea contatto",
    subheaderFillDetails: "Compila i dettagli qui sotto",
    fallbackLeadName: "Contatto",
    buttonCopyId: "Copia ID",
    buttonViewLead: "Visualizza contatto",
    buttonEditLead: "Modifica contatto",
    buttonBackToList: "Torna alla lista",
  },
  post: {
    title: "Crea contatto",
    titleShort: "Nuovo contatto",
    description: "Creare un nuovo vantaggio nel sistema",
    backButton: {
      label: "Ritorno a Contatto",
    },
    submitButton: {
      label: "Crea contatto",
      loadingText: "Creazione di contatto...",
    },
    form: {
      title: "Nuovo modulo di contatto",
      description:
        "Inserire le informazioni di contatto per creare un nuovo lead",
    },
    contactInfo: {
      title: "Informazioni di contatto",
      description: "Dettagli di contatto primario per il contatto",
    },
    email: {
      label: "Indirizzo email",
      description: "Indirizzo email primario per la comunicazione",
      placeholder: "john@example.com",
    },
    businessName: {
      label: "Nome di affari",
      description: "Nome dell'azienda o del business",
      placeholder: "Esempio Corp",
    },
    phone: {
      label: "Numero di telefono",
      description: "Contatto numero di telefono con codice paese",
      placeholder: "+1234567890",
    },
    website: {
      label: "Sito web",
      description: "Sito web della Società URL",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "Location & Preferences",
      description: "Preferenze geografiche e linguistiche",
    },
    country: {
      label: "Paese",
      description: "Localizzazione aziendale o mercato target",
      placeholder: "Seleziona un paese",
    },
    language: {
      label: "Lingua",
      description: "Lingua di comunicazione preferenziale",
      placeholder: "Seleziona una lingua",
    },
    leadDetails: {
      title: "Dettagli del contatto",
      description: "Ulteriori informazioni sul contatto",
    },
    source: {
      label: "Origine del contatto",
      description: "Come è stato acquisito il contatto",
      placeholder: "Selezionare la sorgente",
    },
    notes: {
      label: "Osservazioni",
      description: "Note o commenti aggiuntivi",
      placeholder: "Inserisci qualsiasi informazione aggiuntiva...",
    },
    response: {
      title: "Creato Contatto",
      description: "Dettagli del contatto appena creato",
      summary: {
        title: "Sommario del contatto",
        id: "ID del contatto",
        businessName: "Nome di affari",
        email: "Indirizzo email",
        status: "Stato del contatto",
      },
      contactDetails: {
        title: "Dettagli di contatto",
        phone: "Numero di telefono",
        website: "Sito web URL",
        country: "Paese",
        language: "Lingua",
      },
      trackingInfo: {
        title: "Informazioni di tracciamento",
        source: "Origine del contatto",
        emailsSent: "Contatore di posta elettronica",
        currentCampaignStage: "Fase di campagna",
      },
      metadata: {
        title: "Metadati",
        notes: "Osservazioni",
        createdAt: "Data di creazione",
        updatedAt: "Ultimo aggiornamento",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per creare cavi",
      },
      validation: {
        title: "Errore di convalida",
        description: "Informazioni di contatto non valide fornite",
      },
      server: {
        title: "Errore del server",
        description:
          "Errore del server interno si è verificato durante la creazione di contatto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la creazione di contatto",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante la creazione di contatto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato per la creazione di contatto",
      },
      notFound: {
        title: "Non trovato",
        description:
          "risorsa necessaria non trovata per la creazione di contatto",
      },
      conflict: {
        title: "Conflitto",
        description: "Contatto già esiste o conflitto di dati si è verificato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non salvati nel modulo di contatto",
      },
    },
    success: {
      title: "Contatto creato",
      description: "Lead creato con successo",
    },
  },
  email: {
    welcome: {
      subject: "Benvenuti a {{companyName}}",
      title: "Benvenuto a {{companyName}}, {{businessName}}!",
      preview: "Benvenuto. Ecco come iniziare.",
      greeting:
        "Benvenuto a {{companyName}}, {{businessName}}! E' bello averti.",
      defaultName: "là.",
      introduction:
        "Grazie per il vostro interesse. I tuoi dati ci hanno contattato, e una persona reale li legge.",
      nextSteps: {
        title: "Cosa succede dopo?",
        step1Number: "1.",
        step1: "Inizia a chattare subito. Niente installazione, niente carta.",
        step2Number: "2.",
        step2: "Domande? Rispondi a questa email. Un umano lo legge.",
        step3Number: "3.",
        step3: "Rispondiamo appena possibile.",
      },
      cta: {
        getStarted: "Iniziare a chattare",
      },
      support:
        "Hai delle domande? Rispondi a questa e-mail o contattaci a {{supportEmail}}",
      error: {
        noEmail:
          "Non può inviare email di benvenuto - nessun indirizzo email fornito",
      },
    },
    admin: {
      newLead: {
        subject: "Nuovo Contatto: {{businessName}}",
        title: "Nuovo contatto creato",
        preview: "Nuovo vantaggio da {{businessName}} richiede il follow-up",
        message:
          "Un nuovo vantaggio è stato creato nel sistema da {{businessName}} e richiede la vostra attenzione.",
        leadDetails: "Dettagli del contatto",
        businessName: "Nome di affari",
        email: "Email",
        phone: "Telefono",
        website: "Sito web",
        source: "Fonte",
        status: "Stato",
        notes: "Osservazioni",
        notProvided: "Non fornito",
        viewLead: "Visualizza dettagli di contatto",
        viewAllLeads: "Visualizza tutti i Contatti",
        error: {
          noData:
            "Non può inviare la notifica di amministratore - nessun dato di contatto fornito",
        },
        defaultName: "Nuovo contatto",
      },
    },
    error: {
      general: {
        internal_server_error: "Si è verificato un errore del server interno",
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
};
