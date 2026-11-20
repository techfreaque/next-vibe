import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    clusterRole: {
      none: "Nessuno",
      controlPlane: "Piano di controllo",
      worker: "Worker",
      storage: "Stoccaggio",
    },
    authType: {
      password: "Password",
      privateKey: "Chiave privata (PEM)",
      keyAgent: "Agente SSH",
      local: "Macchina locale",
    },
  },

  errors: {
    connectionNotFound: "Connessione non trovata",
    encryptionFailed:
      "Crittografia fallita - JWT_SECRET_KEY può essere invalido",
  },

  get: {
    title: "Connessione SSH",
    titleShort: "Connessione SSH",
    description: "Visualizza dettagli di connessione SSH",
    fields: {
      id: { label: "Connessione ID", description: "La connessione alla vista" },
    },
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
        description: "Non caricata la connessione",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato il conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
    },
    response: {
      label: { title: "Etichetta" },
      host: { title: "Host" },
      port: { title: "Port" },
      username: { title: "Nome utente" },
      authType: { title: "Tipo di Auth" },
      isDefault: { title: "Predefinito" },
      fingerprint: { title: "Impronte per la stampa" },
      notes: { title: "Osservazioni" },
      createdAt: { title: "Creato a" },
    },
    success: {
      title: "Collegamento Caricato",
      description: "Dettagli di connessione recuperati",
    },
  },
  patch: {
    title: "Aggiornamento connessione SSH",
    titleShort: "Aggiornamento della connessione",
    description: "Aggiornare le impostazioni di connessione SSH",
    fields: {
      id: {
        label: "Connessione ID",
        description: "La connessione per l'aggiornamento",
      },
      label: {
        label: "Etichetta",
        description: "Visualizza nome per questa connessione",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "Nome host o indirizzo IP",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "Porta SSH", placeholder: "22" },
      username: {
        label: "Nome utente",
        description: "utente di login SSH",
        placeholder: "deploy",
      },
      authType: {
        label: "Tipo di Auth",
        description: "Metodo di autenticazione",
      },
      secret: {
        label: "Password / chiave privata",
        description: "Lasciare vuoto per mantenere il segreto esistente",
      },
      passphrase: {
        label: "Passphrase chiave",
        description:
          "Lasciare vuoto per mantenere la passphrase esistente o cancellarlo",
      },
      isDefault: {
        label: "Impostare come predefinito",
        description:
          "Utilizzare questa connessione per impostazione predefinita per le sessioni terminali",
      },
      clusterRole: {
        label: "Cluster Role",
        description:
          "Ruolo di questo server nel cluster k8s (piano di controllo, lavoratore, archiviazione o nessuno)",
      },
      notes: {
        label: "Osservazioni",
        description: "Note opzionali su questa connessione",
      },
    },
    response: {
      updatedAt: { title: "Aggiornato At" },
    },
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
        description: "Non è stato possibile aggiornare la connessione",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato il conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
    },
    success: {
      title: "Collegamento Aggiornato",
      description: "Collegamento aggiornato con successo",
    },
  },
  delete: {
    title: "Eliminare la connessione SSH",
    titleShort: "Cancella connessione",
    description: "Eliminare una connessione SSH",
    fields: {
      id: {
        label: "Connessione ID",
        description: "La connessione per eliminare",
      },
    },
    response: {
      deleted: { title: "Cancellato" },
    },
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
        description: "Non è stato possibile eliminare la connessione",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato il conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
    },
    success: {
      title: "Connessione eliminata",
      description: "Connessione cancellata con successo",
    },
  },
  widget: {
    title: "Dettagli di connessione",
    host: "Host",
    user: "Utente",
    auth: "Auth",
    notes: "Osservazioni",
    saveButton: "Salvare le modifiche",
    deleteButton: "Cancella connessione",
    testButton: "Connessione di prova",
    confirmDelete:
      "Eliminare questa connessione? Questo non può essere annullato.",
    mountsSection: "Regole montate",
    manageMounts: "Gestione dei supporti",
  },
};
