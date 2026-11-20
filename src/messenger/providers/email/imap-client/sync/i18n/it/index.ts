import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Client IMAP",

  title: "Sincronizzazione IMAP",
  titleShort: "Sincronizzazione IMAP",
  description: "Servizio di sincronizzazione IMAP",
  container: {
    title: "Configurazione sincronizzazione IMAP",
    description: "Configurare i parametri di sincronizzazione IMAP",
  },
  accountIds: {
    label: "ID account",
    description: "ID account IMAP per sincronizzare",
    placeholder: "Inserisci ID account separati da virgole",
  },
  force: {
    label: "Sincronizzazione della Forza",
    description: "Sincronizzazione forza anche se recentemente sincronizzata",
  },
  dryRun: {
    label: "Correre a secco",
    description: "Eseguire un test senza apportare modifiche",
  },
  maxMessages: {
    label: "Max messaggi",
    description: "Numero massimo di messaggi da sincronizzare per cartella",
    placeholder: "Inserisci il numero massimo di messaggi",
  },
  post: {
    title: "Sincronizzazione",
    description: "Sincronizzazione",
    form: {
      title: "Configurazione di sincronizzazione",
      description: "Configurare i parametri di sincronizzazione",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta Sync",
      result: {
        title: "Risultati Sync",
        description: "Risultati di sincronizzazione dettagliati",
        accountsProcessed: "Conti elaborati",
        foldersProcessed: "Cartelle lavorate",
        messagesProcessed: "Messaggi elaborati",
        messagesAdded: "Messaggi aggiunti",
        messagesUpdated: "Messaggi Aggiornati",
        messagesDeleted: "Messaggi cancellati",
        duration: "Durata",
      },
      errors: {
        error: {
          title: "Errore di sincronizzazione",
          description: "Dettagli dell’errore",
          code: "Codice di errore",
          message: "Messaggio di errore",
        },
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
  errors: {
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    validation: {
      title: "Errore di convalida",
      description: "Parametri della richiesta non validi",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
      detail_sync: "Sincronizzazione fallita: {{error}}",
      detail_status:
        "Non è possibile leggere lo stato di sincronizzazione: {{error}}",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
  },
  success: {
    title: "Operazione riuscita",
    description: "Operazione completata",
  },
  widget: {
    title: "Sincronizzazione completa IMAP",
    options: "Opzioni di sincronizzazione",
    noAccounts: "Nessun account IMAP configurato",
    result: "Risultato di Sync",
    duration: "Durata",
    errors: "Errori",
    accountsProcessed: "Conti elaborati",
    foldersProcessed: "Cartelle lavorate",
    messagesProcessed: "Messaggi elaborati",
    messagesAdded: "Messaggi aggiunti",
    messagesUpdated: "Messaggi Aggiornati",
    messagesDeleted: "Messaggi cancellati",
    submit: "Avviare la sincronizzazione",
    submitting: "Sincronizzazione...",
  },
};
