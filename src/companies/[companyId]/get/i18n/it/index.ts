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
    get: "Vai!",
  },
  get: {
    title: "Dettagli dell'azienda",
    titleShort: "Società",
    description: "Visualizza le informazioni dell'azienda",
    companyId: {
      label: "Società ID",
      description: "L'azienda a vedere",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Società non valida ID",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare i dettagli dell'azienda",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Tu non sei un membro di questa azienda",
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
        title: "Società non trovata",
        description: "Questa società non esiste o hai perso l'accesso",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Azienda Loaded",
      description: "Dettagli dell'azienda recuperati",
    },
    widget: {
      back: "Indietro",
      loading: "La società di carico...",
      edit: "Modifica",
      members: "Membri",
      invite: "Invitare gli Stati membri",
      chartOfAccounts: "Grafico dei conti",
      viewInvoices: "Visualizza le fatture",
      viewTerminals: "Visualizza i terminali POS",
      active: "Attivo",
      inactive: "Inattivo",
      country: "Paese",
      currency: "Valuta",
      vatNumber: "Numero di VAT",
      taxId: "Tassa fiscale ID",
      email: "Email",
      phone: "Telefono",
      website: "Sito web",
      createdAt: "Membro dal",
      actions: "Azioni",
      modules: {
        title: "Moduli",
        accounting: {
          label: "Contabilità",
          description: "Grafico dei conti, voci delle riviste, relazioni",
        },
        invoices: {
          label: "Fatture",
          description: "AR fatture, stime, pagamenti",
        },
        estimates: {
          label: "Stime",
          description: "Progetti di preventivi per i clienti",
        },
        bills: {
          label: "Bills",
          description: "AP bollette e pagamenti dei fornitori",
        },
        pos: {
          label: "Punto vendita",
          description: "Terminali, sessioni, ordini",
        },
        purchasing: {
          label: "Acquisti",
          description: "Acquisto ordini e venditori",
        },
        inventory: {
          label: "Inventario",
          description: "Stock, magazzini, trasferimenti",
        },
        team: {
          label: "Team",
          description: "Membri e ruoli",
        },
      },
    },
  },
};
