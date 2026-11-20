import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Chiave privata (PEM)",
      keyAgent: "Agente SSH",
      local: "Macchina locale",
    },
  },

  get: {
    title: "Connessioni",
    titleShort: "Connessioni",
    description:
      "Tutte le macchine a cui è possibile connettersi. shell locale, server SSH e istanze remote",
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accesso all'amministratore richiesto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Nessuna autorizzazione",
      },
      server: {
        title: "Errore del server",
        description: "Non elencare le connessioni",
      },
      notFound: {
        title: "Non trovato",
        description: "Account o sessione non trovati",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: { title: "Modifiche non salvate" },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato il conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      timeout: { title: "Timeout", description: "Richiesta tempo libero" },
    },
    success: {
      title: "Collegamenti elencati",
      description: "Tutte le connessioni di macchina recuperate",
    },
    response: {
      connections: {
        title: "Connessioni",
      },
    },
  },
  widget: {
    title: "Connessioni",
    back: "Indietro",
    addSsh: "Aggiungi SSH",
    connectRemote: "Collegare il telecomando",
    openTerminal: "Terminal",
    viewRemote: "Dettagli",
    defaultBadge: "Predefinito",
    localType: "Locale locale",
    sshType: "SSH",
    remoteType: "Telecomando",
    healthHealthy: "Collegato",
    healthWarning: "Piano.",
    healthCritical: "Non raggiungibile",
    healthDisconnected: "Offline",
    noConnections: "Nessuna macchina configurata",
    noConnectionsHint:
      "Aggiungere una connessione SSH o collegare un'istanza remota per iniziare.",
    emptyState:
      "Non ci sono ancora connessioni. Aggiungere uno per connettersi a macchine remote.",
  },
};
