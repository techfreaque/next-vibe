import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Individuale",
    },
    companyMemberRole: {
      owner: "Proprietario",
      admin: "Amministratore",
      member: "Membro",
      accountant: "Contabilità",
      viewer: "Visualizzatore",
    },
  },
  tags: {
    companies: "Aziende",
    create: "Creare",
  },
  post: {
    title: "Creare società",
    titleShort: "Nuova azienda",
    description:
      "Registra una nuova società. Diventerai il suo proprietario automaticamente.",
    name: {
      label: "Nome della Società",
      description: "Nome legale della società",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Tipo di azienda",
      description: "Modello aziendale. B2B, B2C o individuale",
      placeholder: "Selezionare il tipo",
    },
    vatNumber: {
      label: "Numero di VAT",
      description: "Numero di identificazione VAT per scopi fiscali",
      placeholder: "DE123456789",
    },
    country: {
      label: "Paese",
      description: "Paese in cui la società è registrata",
      placeholder: "Seleziona il paese",
    },
    currency: {
      label: "Valuta di default",
      description: "Moneta primaria per fatturazione",
      placeholder: "EUR",
    },
    email: {
      label: "Email della società",
      description: "Indirizzo e-mail aziendale primario",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Telefono della società",
      description: "Numero di telefono commerciale primario",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Sito web",
      description: "Sito web della Società URL",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla i campi del modulo e riprova",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per creare un'azienda",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare un'azienda",
      },
      conflict: {
        title: "Gia'.",
        description: "Una società con questo nome esiste già",
      },
      server: {
        title: "Errore del server",
        description: "Qualcosa è andato storto alla nostra fine. riprovare",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controllare la connessione e riprovare",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Azienda Creata",
      description: "La tua azienda è pronta. Aggiungi i membri per iniziare.",
    },
    response: {
      id: "Società ID",
      name: "Nome della Società",
    },
    widget: {
      setupAccounting: "Configura la contabilità",
      viewCompany: "Visualizza Azienda",
      back: "Torna alla lista",
    },
  },
};
