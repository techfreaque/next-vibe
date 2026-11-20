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
    list: "Elenco",
  },
  get: {
    title: "Le mie aziende",
    titleShort: "Le mie aziende",
    description: "Aziende che si fanno parte di",
    page: {
      label: "Pagina",
      description: "Numero di pagina (a partire da 1)",
    },
    pageSize: {
      label: "Per pagina",
      description: "Risultati per pagina (max 100)",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare le tue aziende",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      conflict: {
        title: "Conflitto",
        description: "Conflittuale dei dati",
      },
      server: {
        title: "Errore del server",
        description: "Qualcosa è andato storto. riprovare",
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
        description: "Nessuna compagnia trovata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Aziende Caricate",
      description: "Elenco delle aziende recuperate",
    },
    widget: {
      back: "Indietro",
      loading: "Caricamento in corso...",
      title: "Le mie aziende",
      create: "Nuova azienda",
      total: "aziende",
      totalSingular: "società",
      inactive: "Inattivo",
      empty: {
        title: "Nessuna compagnia",
        hint: "Crea una società per iniziare a gestire la tua contabilità, fatturazione e squadra.",
        cta: "Crea la tua prima azienda",
      },
    },
    response: {
      total: "Totale",
      id: "ID",
      name: "Nome",
      type: "Tipologia",
      role: "Il tuo ruolo",
      isActive: "Attivo",
      country: "Paese",
      currency: "Valuta",
      email: "Email",
      createdAt: "Creato",
    },
  },
};
