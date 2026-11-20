import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Accounting Dashboard",
    titleShort: "Dashboard",
    description:
      "Panoramica dello stato contabile. periodo aperto, conteggi di entrata e navigazione rapida a tutti gli strumenti contabili.",
    companyId: {
      label: "Società ID",
      description: "Azienda per caricare la dashboard",
      placeholder: "Società UUID",
    },
    response: {
      currentPeriod: "Periodo attuale",
      accountCount: "Account",
      draftEntryCount: "Progetto",
      postedThisMonthCount: "Pubblicato questo mese",
      hasSetup: "Configurazione iniziale",
      currency: "Valuta",
    },
    success: {
      title: "Dashboard Caricato",
      description: "Panoramica contabile recuperata",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Controlla i tuoi input",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Nessun accesso a questa azienda",
      },
      server: {
        title: "Errore del server",
        description: "Non poteva caricare la dashboard",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Società non trovata" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    widget: {
      currentPeriod: "Periodo attuale",
      noPeriod: "Nessun periodo aperto",
      createPeriod: "Creare un periodo",
      totalAccounts: "Account",
      viewAccounts: "Vista",
      draftEntries: "Progetto",
      viewDrafts: "Vista",
      postedThisMonth: "Pubblicato questo mese",
      configured: "Configurato",
      notSetUp: "Non impostare",
      runSetup: "Impostazione di corsa",
      setupStatus: "Configurazione iniziale",
      loading: "Caricamento cruscotto...",
      noData: "Nessun dato contabile disponibile.",
      navTitle: "Contabilità",
      chartOfAccounts: "Grafico dei conti",
      journalEntries: "Pubblicazioni",
      periods: "Periodi",
      balanceSheet: "Foglio di equilibrio",
      profitLoss: "Profit & Loss",
      trialBalance: "Equilibrio di prova",
      taxReport: "Relazione fiscale",
      companies: "Aziende",
      invoices: "Fatture",
      bills: "Bills",
      selectCompany: "Seleziona un’azienda per visualizzarne i dati contabili.",
    },
  },
  category: "Contabilità",
  tag: "cruscotto",
};
