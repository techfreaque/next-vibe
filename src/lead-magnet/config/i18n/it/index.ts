import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tag: "lead-magnet-config",
    title: "La tua email",
    titleShort: "Configurazione LM",
    description: "Visualizza la configurazione del magnete di piombo corrente",
    response: {
      exists: "Esiste un conflitto",
      config: "Configurazione",
    },
    success: {
      title: "Recuperare i conflitti",
      description:
        "La configurazione del magnete di piombo è stata recuperata con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati della richiesta sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun risultato trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      internal: {
        title: "Errore del server",
        description: "Si è verificato un errore interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
  },
  widget: {
    delete: "Scollegamento",
    confirmDelete: {
      title: "Scollegare {{provider}}?",
      description:
        "I nuovi abbonati smettono di atterrare nella tua lista. Contatti già catturati soggiorno dove sono.",
      cancel: "Mantenere il collegamento",
      proceed: "Scollegamento",
    },
    back: "Indietro",
    loading: "Caricamento…",
    pitch: {
      headline: "Trasformare i visitatori in abbonati",
      body: "Quando qualcuno visualizza la tua pagina di abilità o il profilo del creatore, vede un campo di abbonamenti. Essi entrano nella loro e-mail - atterra direttamente nella vostra lista. Niente app extra, niente intermediario, nessuna tassa mensile per la cattura di base.",
      step1:
        "Qualcuno visita la tua pagina di abilità o il profilo del creatore",
      step2: "Essi presentano il modulo di iscrizione",
      step3: "Email atterra nella tua lista - sulla tua piattaforma di scelta",
    },
    noConfig:
      "Collegare una piattaforma e-mail per iniziare a raccogliere gli abbonati dalle tue pagine di abilità e profilo creatore.",
    active: "Attivo",
    inactive: "Inattivo",
    choosePlatform: "Collegare la piattaforma email",
    switchPlatform: "Piattaforma di commutazione",
    selectPlaceholder: "Scegli una piattaforma...",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "Email (via piattaforma)",
    },
    capturedLeads: "Piombo catturati",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "Scollegare la piattaforma e-mail",
    titleShort: "Scollegamento",
    description:
      "Rimuovere la configurazione del magnete di piombo e smettere di catturare i cavi",
    response: {
      deleted: "Scollegato",
    },
    success: {
      title: "Scollegato",
      description: "La tua piattaforma e-mail è stata scollegata",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati della richiesta sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessuna configurazione trovata per eliminare",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      internal: {
        title: "Errore del server",
        description: "Si è verificato un errore interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
  },
};
