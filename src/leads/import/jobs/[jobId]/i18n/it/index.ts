import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Importazione dei dati",
  tags: {
    leads: "Contatti",
    management: "Gestione",
  },

  get: {
    title: "Ottenere Importa lavoro",
    titleShort: "Importa lavoro",
    description: "Ottenere i dettagli di un lavoro di importazione specifico",
    actions: {
      retry: "Riprova",
      stop: "Fermati.",
      viewLeads: "Visualizza Contatto",
    },
    jobId: {
      label: "Lavoro ID",
      description: "Identificatore unico per il lavoro di importazione",
    },
    form: {
      title: "Importa lo stato di lavoro",
      description: "Situazione attuale e progresso del lavoro di importazione",
    },
    response: {
      title: "Informazioni sul lavoro",
      description: "Dettagli del lavoro di importazione attuale",
      info: {
        title: "Informazioni sul lavoro",
        description: "Informazioni di base sul lavoro",
      },
      id: {
        content: "Lavoro ID",
      },
      fileName: {
        content: "Nome del file",
      },
      status: {
        content: "Stato di lavoro",
      },
      progress: {
        title: "Importazione dei progressi",
        description: "Progressi attuali dell'importazione e statistiche",
      },
      totalRows: {
        content: "Totale righe",
      },
      processedRows: {
        content: "Righe lavorate",
      },
      successfulImports: {
        content: "Importazioni di successo",
      },
      failedImports: {
        content: "Importazioni fallite",
      },
      duplicateEmails: {
        content: "Duplicare le email",
      },
      configuration: {
        title: "Configurazione del lavoro",
        description: "Impostazioni di configurazione del lavoro attuali",
      },
      currentBatchStart: {
        content: "Inizio Batch attuale",
      },
      batchSize: {
        content: "Dimensione della batch",
      },
      retryCount: {
        content: "Conte di Retry",
      },
      maxRetries: {
        content: "Max Rettori",
      },
      error: {
        content: "Messaggio di errore",
      },
      timestamps: {
        title: "Orari di lavoro",
        description: "Tempi del ciclo di vita del lavoro",
      },
      createdAt: {
        content: "Creato a",
      },
      updatedAt: {
        content: "Aggiornato At",
      },
      startedAt: {
        content: "Iniziato a",
      },
      completedAt: {
        content: "Completo a",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il lavoro fornito ID è invalido",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per visualizzare i lavori",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di vedere questo lavoro",
      },
      notFound: {
        title: "Lavoro non trovato",
        description: "Nessun lavoro di importazione trovato con il fornito ID",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore durante il recupero del lavoro",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante il recupero del lavoro",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Importa il lavoro recuperato con successo",
    },
  },
  patch: {
    title: "Aggiornare Importa lavoro",
    titleShort: "Modificare Importa lavoro",
    description:
      "Aggiornare le impostazioni di configurazione del lavoro di importazione",
    jobId: {
      label: "Lavoro ID",
      description: "Identificatore unico per il lavoro di importazione",
    },
    form: {
      title: "Aggiornare le impostazioni del lavoro",
      description: "Modificare la configurazione del lavoro di importazione",
    },
    settings: {
      title: "Impostazioni di lavoro",
      description:
        "Impostazioni di configurazione per il lavoro di importazione",
    },
    batchSize: {
      label: "Dimensione della batch",
      description: "Numero di righe da elaborare in ogni lotto",
      placeholder: "100",
    },
    maxRetries: {
      label: "Max Rettori",
      description: "Numero massimo di tentativi di retry per le righe fallite",
      placeholder: "3",
    },
    response: {
      title: "Informazioni sul lavoro aggiornate",
      description: "Dettagli del lavoro di importazione aggiornati",
      info: {
        title: "Informazioni sul lavoro",
        description: "Informazioni di base sul lavoro",
      },
      id: {
        content: "Lavoro ID",
      },
      fileName: {
        content: "Nome del file",
      },
      status: {
        content: "Stato di lavoro",
      },
      progress: {
        title: "Importazione dei progressi",
        description: "Progressi attuali dell'importazione e statistiche",
      },
      totalRows: {
        content: "Totale righe",
      },
      processedRows: {
        content: "Righe lavorate",
      },
      successfulImports: {
        content: "Importazioni di successo",
      },
      failedImports: {
        content: "Importazioni fallite",
      },
      duplicateEmails: {
        content: "Duplicare le email",
      },
      configuration: {
        title: "Configurazione del lavoro",
        description: "Impostazioni di configurazione del lavoro attuali",
      },
      currentBatchStart: {
        content: "Inizio Batch attuale",
      },
      batchSize: {
        content: "Dimensione della batch",
      },
      retryCount: {
        content: "Conte di Retry",
      },
      maxRetries: {
        content: "Max Rettori",
      },
      error: {
        content: "Messaggio di errore",
      },
      timestamps: {
        title: "Orari di lavoro",
        description: "Tempi del ciclo di vita del lavoro",
      },
      createdAt: {
        content: "Creato a",
      },
      updatedAt: {
        content: "Aggiornato At",
      },
      startedAt: {
        content: "Iniziato a",
      },
      completedAt: {
        content: "Completo a",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati forniti sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per aggiornare i lavori",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo lavoro",
      },
      notFound: {
        title: "Lavoro non trovato",
        description: "Nessun lavoro di importazione trovato con il fornito ID",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'aggiornamento del lavoro",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Aggiornamento Conflict",
        description: "Il lavoro è stato modificato da un altro utente",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Importare il lavoro aggiornato con successo",
    },
  },
  delete: {
    title: "Eliminare Importa lavoro",
    titleShort: "Eliminare Importa lavoro",
    description: "Eliminare un lavoro di importazione specifico",
    jobId: {
      label: "Lavoro ID",
      description:
        "Identificatore unico per il lavoro di importazione da eliminare",
    },
    form: {
      title: "Eliminare Importa lavoro",
      description: "Confermare la cancellazione del lavoro di importazione",
    },
    response: {
      title: "Risultato di cancellazione",
      description: "Risultato dell'operazione di cancellazione",
      success: {
        content: "Stato di successo",
      },
      message: {
        content: "Messaggio di cancellazione",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il lavoro fornito ID è invalido",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per eliminare i lavori",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eliminare questo lavoro",
      },
      notFound: {
        title: "Lavoro non trovato",
        description: "Nessun lavoro di importazione trovato con il fornito ID",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la cancellazione del lavoro",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto di cancellazione",
        description:
          "Non è possibile eliminare il lavoro attualmente in fase di elaborazione",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Importare il lavoro cancellato con successo",
    },
  },
  retry: {
    category: "Importazione dei dati",
    tags: {
      leads: "Contatti",
      management: "Gestione",
    },

    post: {
      title: "Retry Importa lavoro",
      description: "Recuperare un lavoro di importazione fallito",
      jobId: {
        label: "Lavoro ID",
        description:
          "Identificatore unico per il lavoro di importazione da riprovare",
      },
      form: {
        title: "Retry Importa lavoro",
        description: "Recuperare il lavoro di importazione fallito",
      },
      response: {
        title: "Risultato della ricerca",
        description: "Risultato dell'operazione di riprovazione",
        success: {
          content: "Stato di successo",
        },
        message: {
          content: "Messaggio di riprovazione",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Il lavoro fornito ID è invalido",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione richiesta per riprovare i lavori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di riprovare questo lavoro.",
        },
        notFound: {
          title: "Lavoro non trovato",
          description:
            "Nessun lavoro di importazione trovato con il fornito ID",
        },
        server: {
          title: "Errore del server",
          description:
            "Si è verificato un errore durante la riprova del lavoro",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        conflict: {
          title: "Conflitto di riprovazione",
          description:
            "Non si può riprovare il lavoro che attualmente sta elaborando",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Importare il lavoro retribuito con successo",
      },
    },
    widget: {
      title: "Retry Importa lavoro",
      successMessage: "Ricerca di lavoro avviata con successo",
    },
  },
  stop: {
    category: "Importazione dei dati",
    tags: {
      leads: "Contatti",
      management: "Gestione",
    },

    post: {
      title: "Stop Importa lavoro",
      description: "Smettere un lavoro di importazione in esecuzione",
      jobId: {
        label: "Lavoro ID",
        description:
          "Identificatore unico per il lavoro di importazione per arrestare",
      },
      form: {
        title: "Stop Importa lavoro",
        description: "Fermare il lavoro di importazione in esecuzione",
      },
      response: {
        title: "Stop Risultato",
        description: "Risultato dell'operazione di arresto",
        success: {
          content: "Stato di successo",
        },
        message: {
          content: "Stop al messaggio",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Il lavoro fornito ID è invalido",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per fermare i lavori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di fermare questo lavoro.",
        },
        notFound: {
          title: "Lavoro non trovato",
          description:
            "Nessun lavoro di importazione trovato con il fornito ID",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore durante l'arresto del lavoro",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        conflict: {
          title: "Smettere di Conflitto",
          description:
            "Non può fermare il lavoro che non è attualmente elaborazione",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Il lavoro di importazione si è fermato con successo",
      },
    },
    widget: {
      title: "Stop Importa lavoro",
      successMessage: "Lavoro interrotto con successo",
    },
  },
  widget: {
    status: {
      title: "Importa lo stato di lavoro",
      jobId: "Lavoro ID",
      loadingJobStatus: "Caricamento dello stato del lavoro...",
      totalRows: "Totale righe",
      processed: "Elaborazione",
      imported: "Importato",
      failed: "Sfigato",
      duplicates: "Duplicazioni",
      progress: "Progressi",
      configurationTitle: "Configurazione",
      batchSize: "Dimensione della batch",
      batchStart: "Batch Start",
      retries: "Ritiri",
      timestampsTitle: "Lampade da terra",
      created: "Creato",
      started: "Iniziato",
      completed: "Completo",
      jobStatus: {
        enums: {
          csvImportJobStatus: {
            pending: "Finanziamenti",
            processing: "Lavorazione",
            completed: "Completo",
            failed: "Sfigato",
          },
        },
      },
    },
    retry: {
      title: "Retry Importa lavoro",
      loadingRetrying: "Ripristino del lavoro...",
      successMessage: "Lavoro Retribuito con successo",
      failureMessage: "Retribuzione non riuscita",
      viewJobStatus: "Visualizza lo stato di lavoro",
      viewLeads: "Visualizza Contatto",
    },
    stop: {
      title: "Stop Importa lavoro",
      loadingStopping: "Sto cercando lavoro...",
      successMessage: "Lavoro bloccato con successo",
      failureMessage: "Fermati, fallo.",
      viewLeads: "Visualizza Contatto",
      startNewImport: "Avviare la nuova Importazione",
    },
  },
};
