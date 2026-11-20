import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Dettaglio grafico",
    titleShort: "Dati del grafico",
    description: "Visualizza grafico grafico con indicatori e segnali",
    fields: {
      id: { label: "Grafico ID", description: "UUID del grafico" },
      resolution: {
        label: "Risoluzione",
        description: "Dimensione del secchio per serie di tempo",
      },
      cursor: {
        label: "Cursore",
        description: "Tempi più vecchi per l'impaginazione",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nome",
        description: "Designazione",
        ownerType: "Tipo di proprietario",
        isActive: "Attivo",
        createdAt: "Creato a",
        config: "Configurazione",
      },
      series: {
        nodeId: "Node ID",
        timestamp: "Timestamp",
        value: "Valore",
      },
      signals: {
        nodeId: "Node ID",
        timestamp: "Timestamp",
        fired: "Fuoco",
      },
    },
    widget: {
      loading: "Carico grafico...",
      back: "Indietro",
      active: "Attivo",
      inactive: "Inattivo",
      nodes: "nodi",
      trigger: "Triggero",
      backtest: "Backtest",
      edit: "Modifica",
      archive: "Archivia",
      promote: "Promuovere",
      signal: "Signal",
      noData: "Nessun dato in questo intervallo",
      loadingEarlierData: "Caricamento dei dati precedenti...",
    },
    success: {
      title: "Grafica caricata",
      description: "Graph recuperato con successo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      server: {
        title: "Errore del server",
        description: "Non caricate il grafico",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: { title: "Convalida fallita", description: "Invalid ID" },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Grafico non trovato",
      },
      conflict: { title: "Conflitto", description: "conflitto di risorse" },
      network: {
        title: "Errore di rete",
        description: "La richiesta di rete è fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
};
