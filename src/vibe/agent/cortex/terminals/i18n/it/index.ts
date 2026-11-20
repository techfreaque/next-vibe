import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    title: "Terminali attivi",
    back: "Indietro",
    lastCommand: "Ultimo comando",
    noTerminals: "Nessun terminale attivo",
    noTerminalsHint:
      "Eseguire un comando con Execute Command per avviare una sessione terminale.",
    openExec: "Esegui il comando",
    terminalCount: "terminali",
    machineLabel: "Macchina per la produzione",
    cwdLabel: "Cw.",
    statusLabel: "Stato",
    openedLabel: "Aperto",
    openTerminal: "Aperto",
    manageConnections: "Connessioni",
    activeStatus: "Attivo",
  },
  get: {
    title: "Elenco Terminali",
    titleShort: "Terminali",
    description:
      "Elenca sessioni terminali attive con directory di lavoro attuali.",
    dynamicTitle: "Terminali: {{path}}",
    status: {
      loading: "Caricamento...",
      done: "Caricato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Macchina per la produzione",
        description:
          "Filtra a una macchina specifica, ad esempio /ssh/local-machine. Omettere di elencare tutti.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "Terminal ID" },
        connectionSlug: { content: "Macchina per la produzione" },
        cwd: { content: "Elenco di lavoro" },
        name: { content: "Nome" },
        openedAt: { content: "Aperto" },
        lastCommandAt: { content: "Ultimo comando" },
        status: { content: "Stato" },
      },
      total: { text: "Totale" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare il percorso",
      },
      network: {
        title: "Offline",
        description: "Non riesco a raggiungere il server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per primo",
      },
      forbidden: {
        title: "Nessun accesso",
        description: "Operazione non consentita",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun terminale trovato",
      },
      server: { title: "Errore del server", description: "Qualcosa di rotto" },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Conflitto",
        description: "Operazione di conflitto",
      },
    },
    success: {
      title: "Terminali elencati",
      description: "Terminali attivi caricati",
    },
  },
};
