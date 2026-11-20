import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Client IMAP",
  tag: "Client IMAP",
  tags: {
    health: "Salute",
    monitoring: "Monitoraggio",
    sync: "Sincronizzazione",
    accounts: "Account",
    folders: "Cartelle",
    messages: "Messaggi",
    config: "Configurazione",
  },
  messages: {
    tag: "Messaggi",
    id: {
      widget: {
        markRead: "Segnala come Leggi",
        markUnread: "Segnala come unleggibile",
        flag: "Bandiera",
        unflag: "Unflag",
      },
    },
    errors: {
      server: { title: "Errore del server" },
      notFound: { title: "Messaggio non trovato" },
      accountNotFound: { title: "Account Non trovato" },
      syncFailed: { title: "Traduzione:" },
      syncSuccess: { message: "Messaggi sincronizzati con successo" },
      list: {
        get: { errors: { server: { title: "Messaggi di errore del server" } } },
      },
    },
  },
  sync: {
    category: "Client IMAP",

    title: "Sincronizzazione IMAP",
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
  },
  imapErrors: {
    accounts: {
      post: {
        error: {
          duplicate: {
            title: "L'account esiste già",
          },
          server: {
            title: "Errore del server creare account",
          },
        },
      },
      get: {
        error: {
          not_found: {
            title: "Account non trovato",
          },
          server: {
            title: "Errore del server che recupera l'account",
          },
        },
      },
      put: {
        error: {
          not_found: {
            title: "Account non trovato",
          },
          duplicate: {
            title: "Account con questa e-mail esiste già",
          },
          server: {
            title: "Aggiornamento dell'errore server",
          },
        },
      },
      delete: {
        error: {
          not_found: {
            title: "Account non trovato",
          },
          server: {
            title: "Errore del server che cancella l'account",
          },
        },
        success: {
          title: "Account cancellato con successo",
        },
      },
    },
    folders: {
      get: {
        error: {
          not_found: {
            title: "Cartella non trovata",
          },
          server: {
            title: "Cartella di recupero dell'errore del server",
          },
        },
      },
      sync: {
        error: {
          missing_account: {
            title: "Account non trovato per la sincronizzazione della cartella",
          },
        },
      },
    },
    messages: {
      get: {
        error: {
          not_found: {
            title: "Messaggio non trovato",
          },
          server: {
            title: "Errore del server che recupera il messaggio",
          },
        },
      },
    },
    connection: {
      failed: "La connessione non è riuscita",
      timeout: {
        title: "Tempo di connessione",
      },
      test: {
        failed: "Test di connessione fallito",
      },
      close: {
        failed: "Non riuscito a chiudere la connessione",
      },
      folders: {
        list: {
          failed: "Non elencare le cartelle",
        },
      },
      messages: {
        list: {
          failed: "Non elencare i messaggi",
        },
      },
    },
    sync: {
      failed: "Sync ha fallito",
      account: {
        failed: "Sincronizzazione account fallita: {{error}}",
      },
      folder: {
        failed: "Sincronizzazione cartella guasto",
      },
      message: {
        failed: "Sincronia del messaggio fallita",
      },
      post: {
        error: {
          server: {
            title: "Errore del server durante la sincronizzazione",
          },
        },
      },
    },
    validation: {
      account: {
        username: {
          required: "Il nome utente è richiesto",
        },
        port: {
          invalid: "Numero di porto non valido",
        },
        host: {
          invalid: "Ospite non valido",
        },
      },
    },
  },
  imap: {
    "example.com": "imap.example.com",
    "gmail.com": "imap.gmail.com",
    connection: {
      test: {
        success: "Test di connessione di successo",
        failed: "Test di connessione fallito",
        timeout: "Tempo di prova di connessione",
      },
    },
    sync: {
      messages: {
        accounts: {
          success: "Tutti gli account sincronizzati con successo",
          successWithErrors: "Conti sincronizzati con errori",
        },
        account: {
          success: "Conto sincronizzato con successo",
          successWithErrors: "Conto sincronizzato con errori",
        },
        folders: {
          success: "Cartelle sincronizzate con successo",
          successWithErrors: "Cartelle sincronizzate con gli errori",
        },
        messages: {
          success: "Messaggi sincronizzati con successo",
          successWithErrors: "Messaggi sincronizzati con errori",
        },
      },
      errors: {
        default: "Sincronizzazione IMAP guasto",
        account_failed: "Sincronizzazione account fallita: {{error}}",
        folder_sync_failed: "Sincronizzazione cartella guasto: {{error}}",
        message_sync_error: "Errore di sincronizzazione del messaggio",
        message_sync_failed: "Sincronia del messaggio fallita",
      },
    },
  },
  enums: {
    loggingLevel: {
      error: "Errore",
      warn: "Avvertenza",
      info: "Info",
      debug: "Debug",
    },
    syncStatus: {
      pending: "Finanziamenti",
      syncing: "Sincronizzazione",
      synced: "Traduzione:",
      error: "Errore",
    },
    overallSyncStatus: {
      idle: "Idle",
      running: "Esecuzione",
      completed: "Completo",
      failed: "Sfigato",
      cancelled: "Annullamento",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    authMethod: {
      plain: "Pianura",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapAuthMethod: {
      plain: "Pianura",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Posta in arrivo",
      sent: "Inviato",
      drafts: "Progetti",
      trash: "Trattamenti",
      junk: "Junk",
      archive: "Archivia",
    },
    folderSortField: {
      name: "Nome",
      displayName: "Nome dell'esposizione",
      messageCount: "Contatore di messaggi",
      unseenCount: "Conte invisibile",
      createdAt: "Creato a",
    },
    accountSortField: {
      name: "Nome",
      email: "Email",
      host: "Host",
      enabled: "Abilitato",
      lastSyncAt: "Ultimo messaggio",
      createdAt: "Creato a",
    },
    connectionStatus: {
      disconnected: "Scollegato",
      connecting: "Collegamento",
      connected: "Collegato",
      error: "Errore",
      timeout: "Timeout",
    },
    syncStatusFilter: {
      all: "Tutti gli stati Sync",
    },
    accountStatusFilter: {
      all: "Tutti gli stati dell'account",
      enabled: "Abilitato",
      disabled: "Disabili",
    },
    accountFilter: {
      all: "Tutti gli account",
    },
    messageSortField: {
      subject: "Oggetto",
      senderName: "Nome del fornitore",
      senderEmail: "Email di pagamento",
      recipientEmail: "Email sensibile",
      recipientName: "Nome del destinatario",
      isRead: "Leggi lo stato",
      isFlagged: "Bandiera",
      messageSize: "Formato del messaggio",
      sentAt: "Inviato a",
      createdAt: "Creato a",
    },
    messageStatusFilter: {
      all: "Tutti i messaggi",
      read: "Leggi tutto",
      unread: "Non c'è",
      flagged: "Bandiera",
      unflagged: "Non gonfiato",
      draft: "Progetto",
      deleted: "Cancellato",
      hasAttachments: "Ha degli allegati",
      noAttachments: "Nessun allegato",
    },
    healthStatus: {
      healthy: "Salute",
      warning: "Avvertenza",
      error: "Errore",
      maintenance: "Manutenzione",
    },
    performanceStatus: {
      good: "Buona",
      warning: "Avvertenza",
      error: "Errore",
    },
  },
};
