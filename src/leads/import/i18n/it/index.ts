import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Importazione",
    leads: "Contatti",
    csv: "CSV",
  },

  category: "Importazione dei dati",
  post: {
    title: "Importazione Contatto",
    titleShort: "Importazione Contatto",
    description: "Importa conduce dal file CSV",
    form: {
      title: "Configurazione dell'importazione",
      description: "Configurare i parametri di importazione del contatto",
    },
    file: {
      label: "File CSV",
      description: "Contenuto del file CSV (base64 codificato)",
      placeholder: "Paste base64 codificato contenuto CSV",
      helpText: "Caricare un file CSV con i dati di contatto",
    },
    fileName: {
      label: "Nome del file",
      description: "Nome del file CSV",
      placeholder: "leads.csv",
      helpText: "Fornire un nome di file descrittivo",
    },
    skipDuplicates: {
      label: "Skip Duplicas",
      description: "Skip lead con indirizzi e-mail duplicati",
      helpText:
        "Abilitare automaticamente saltare gli indirizzi email esistenti",
    },
    updateExisting: {
      label: "Aggiornamento esistente",
      description: "Aggiornare i cavi esistenti con nuovi dati",
      helpText:
        "Abilitare l'aggiornamento dei cavi esistenti invece di saltare",
    },
    defaultCountry: {
      label: "Paese di default",
      description: "Paese di default per i conducenti senza paese specificato",
      helpText: "Selezionare il codice paese predefinito",
    },
    defaultLanguage: {
      label: "Lingua di default",
      description: "Lingua predefinita per i cavi senza lingua specificata",
      helpText: "Selezionare il codice di lingua predefinito",
    },
    defaultStatus: {
      label: "Stato di default",
      description: "Stato di default per i cavi importati",
      helpText: "Selezionare lo stato iniziale per nuovi lead",
    },
    defaultCampaignStage: {
      label: "Fase della campagna di default",
      description: "Fase di campagna e-mail predefinita per i lead importati",
      helpText: "Selezionare la fase iniziale della campagna",
    },
    defaultSource: {
      label: "Sorgente di default",
      description: "Attribuzione di origine predefinita per i cavi importati",
      helpText: "Selezionare la fonte di contatto per il monitoraggio",
    },
    useChunkedProcessing: {
      label: "Utilizzare l'elaborazione a righe",
      description: "Elaborare grandi importazioni in blocchi di sfondo",
      helpText: "Abilitare per file con più di 1000 righe",
    },
    batchSize: {
      label: "Dimensione della batch",
      description: "Numero di righe da elaborare per lotto",
      helpText: "Consigliato: 2000 righe per lotto",
    },
    response: {
      batchId: "Batch ID",
      totalRows: "Totale righe",
      successfulImports: "Importazioni di successo",
      failedImports: "Importazioni fallite",
      duplicateEmails: "Duplicare le email",
      errors: "Importa errori",
      summary: "Importazione sommaria",
      isChunkedProcessing: "Utilizzo di Elaborazione Coperta",
      jobId: "Lavoro di fondo ID",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di importazione non validi o formato CSV",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per importare i cavi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato all'importazione di contatto",
      },
      notFound: {
        title: "Non trovato",
        description: "Il file CSV non trovato o non valido",
      },
      conflict: {
        title: "Conflitto",
        description: "conflitto di dati durante l'importazione",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno durante l'importazione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'importazione",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete durante l'importazione",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description:
          "Ci sono cambiamenti non rilevati nel modulo di importazione",
      },
    },
    success: {
      title: "Importazione Iniziata",
      description: "L'importazione di contatto è stata avviata con successo",
    },
    widget: {
      headerTitle: "Importa i lead da CSV",
      exportTemplateButton: "Modello di esportazione",
      importGuideTitle: "Guida all'importazione",
      importGuideSubtitle: "Caricare un file CSV con le seguenti colonne:",
      importGuideNote:
        "Solo {{email}} è richiesto. Tutte le altre colonne sono facoltative e rientreranno alle impostazioni predefinite configurate di seguito.",
      fileRequirementsTitle: "Requisiti di file",
      fileRequirementFormat:
        "Formato: CSV (valori separati da matricola, codificato UTF-8)",
      fileRequirementHeader:
        "La prima riga deve essere la riga dell'intestazione con i nomi delle colonne",
      fileRequirementSize: "Dimensione massima consigliata: 50 MB per upload",
      fileRequirementChunked:
        "Per i file più grandi di ~5 000 righe, abilitare {{chunkedProcessing}} per evitare timeout",
      chunkedProcessingLabel: "Elaborazione cotto",
      downloadTemplateLink: "Scarica il modello CSV",
      loadingText: "Importazione di cavi...",
      backgroundProcessingTitle: "Lavorazione dello sfondo",
      backgroundProcessingNote:
        "Grande importazione in coda come lavoro: {{jobId}}. Elaborazione delle righe {{totalRows}} sullo sfondo.",
      checkJobStatusButton: "Controllare lo stato di lavoro",
      stopJobButton: "Fermati.",
      retryFailedButton: "Retribuzione non riuscita",
      statTotalRows: "Totale righe",
      statImported: "Importato",
      statDuplicates: "Duplicazioni",
      statFailed: "Sfigato",
      viewImportedLeadsButton: "Visualizza Contatto importato",
      retryFailedWithCountButton: "Retry Failed ({{count}})",
      summaryTitle: "Riepilogo",
      summaryNewLeads: "Nuovi Contatto",
      summaryUpdated: "Aggiornato",
      summarySkipped: "Asciugata",
      successRateLabel: "Tasso di successo",
      importErrorsTitle: "Errori di importazione {{count}}",
      errorRowLabel: "Voce {{row}}",
      findLeadButton: "Trova il contatto",
    },
  },
  process: {
    tag: "Processo di importazione",
    post: {
      title: "Process Importa lavori",
      titleShort: "Importazione dei processi",
      description: "Processi in attesa di CSV",
      container: {
        title: "Configurazione dei processi di importazione",
        description: "Configurare i parametri del processo di importazione",
      },
      fields: {
        maxJobsPerRun: {
          label: "Max posti di lavoro per eseguire",
          description:
            "Numero massimo di posti di lavoro da elaborare per ogni esecuzione",
        },
        maxRetriesPerJob: {
          label: "Max Retries per lavoro",
          description: "Numero massimo di ripetizioni per lavoro",
        },
        dryRun: {
          label: "Correre a secco",
          description: "Correre senza apportare modifiche",
        },
        selfTaskId: {
          label: "Compito di auto ID",
          description: "Compito interno ID per autopulizia dopo l'elaborazione",
        },
      },
      response: {
        jobsProcessed: "Lavori elaborati",
        totalRowsProcessed: "Totale righe processate",
        successfulImports: "Importazioni di successo",
        failedImports: "Importazioni fallite",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        server: {
          title: "Errore del server",
          description:
            "Si è verificato un errore durante l'elaborazione delle importazioni",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
      },
      success: {
        title: "Elaborazione delle importazioni Completa",
        description: "Importa i lavori trattati con successo",
      },
    },
  },
  widget: {
    header: {
      title: "Importa posti di lavoro",
      newImport: "Nuova Importazione",
    },
    filter: {
      all: "Tutti",
      completed: "Completo",
      failed: "Sfigato",
      pending: "Finanziamenti",
      running: "Esecuzione",
    },
    loading: "Caricamento dei lavori di importazione...",
    empty: {
      title: "Nessun lavoro di importazione trovato",
      withFilter: "Provare un filtro diverso o avviare una nuova importazione.",
      withoutFilter: "Inizia la tua prima importazione per vederlo qui.",
      newImport: "Nuova Importazione",
    },
  },
  jobs: {
    jobId: {
      category: "Importazione dei dati",
      tags: {
        leads: "Contatti",
        management: "Gestione",
      },

      get: {
        title: "Ottenere Importa lavoro",
        description:
          "Ottenere i dettagli di un lavoro di importazione specifico",
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
          description:
            "Situazione attuale e progresso del lavoro di importazione",
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
            description:
              "Nessun lavoro di importazione trovato con il fornito ID",
          },
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore durante il recupero del lavoro",
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
        description:
          "Aggiornare le impostazioni di configurazione del lavoro di importazione",
        jobId: {
          label: "Lavoro ID",
          description: "Identificatore unico per il lavoro di importazione",
        },
        form: {
          title: "Aggiornare le impostazioni del lavoro",
          description:
            "Modificare la configurazione del lavoro di importazione",
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
          description:
            "Numero massimo di tentativi di retry per le righe fallite",
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
            description:
              "Nessun lavoro di importazione trovato con il fornito ID",
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
            description:
              "Nessun lavoro di importazione trovato con il fornito ID",
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
              description:
                "Si è verificato un errore durante l'arresto del lavoro",
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
    },
  },
  status: {
    category: "Importazione dei dati",
    tags: {
      import: "Importazione",
      jobs: "Lavoro",
      list: "Elenco",
    },

    get: {
      title: "Importa lo stato dei lavori",
      titleShort: "Importa posti di lavoro",
      description: "Elenca e monitora i lavori di importazione CSV",
      actions: {
        refresh: "Aggiorna",
        refreshing: "Raffreddamento...",
      },
      form: {
        title: "Filtri di lavoro",
        description:
          "Filtra i lavori di importazione per stato e impaginazione",
      },
      filters: {
        title: "Filtri",
        description: "Filtra le opzioni per i lavori di importazione",
      },
      status: {
        label: "Stato di lavoro",
        description: "Filtra per lo stato del lavoro",
        placeholder: "Selezionare lo stato",
      },
      limit: {
        label: "Risultati per Pagina",
        description: "Numero di posti di lavoro da restituire",
        placeholder: "50",
      },
      offset: {
        label: "Pagina non trovata",
        description: "Numero di posti di lavoro per saltare",
        placeholder: "0",
      },
      response: {
        title: "Importa posti di lavoro",
        description:
          "Elenco dei lavori di importazione con il loro stato attuale",
        statusCounts: "Contatori di stato",
        items: {
          title: "Elenco lavori",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri del filtro non valido",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Autenticazione necessaria per visualizzare i lavori di importazione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato ai lavori di importazione",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun lavoro di importazione trovato",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno durante l'acquisizione di lavori",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante l'ottenimento di lavori",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
      },
      success: {
        title: "Lavori recuperati",
        description: "Importa l'elenco dei lavori recuperati con successo",
      },
    },
    widget: {
      status: {
        pending: "Finanziamenti",
        running: "Esecuzione",
        completed: "Completo",
        failed: "Sfigato",
        stopped: "Non ci sono.",
      },
      filter: {
        all: "Tutti",
        pending: "Finanziamenti",
        running: "Esecuzione",
        completed: "Completo",
        failed: "Sfigato",
      },
      progress: {
        rows: "righe",
      },
      job: {
        total: "Totale:",
        processed: "Elaborato:",
        ok: "OK:",
        fail: "Fail:",
        created: "Creato:",
        done: "Fatto:",
      },
      header: {
        title: "Importa posti di lavoro",
        newImport: "Nuova Importazione",
      },
      loading: "Caricamento dei lavori di importazione...",
      empty: {
        title: "Nessun lavoro di importazione trovato",
        withFilter:
          "Provare un filtro diverso o avviare una nuova importazione.",
        withoutFilter: "Inizia la tua prima importazione per vederlo qui.",
        newImport: "Nuova Importazione",
      },
    },
  },
  csv: {
    post: {
      title: "Importazione dei dati CSV",
      description:
        "Importa i dati dai file CSV con elaborazione intelligente e validazione",
      form: {
        title: "Configurazione dell'importazione di CSV",
        description:
          "Configurare le impostazioni di importazione CSV per ottenere risultati ottimali",
      },
      fileSection: {
        title: "Caricamento file",
        description:
          "Selezionare il file CSV e specificare il dominio di destinazione",
      },
      file: {
        label: "File CSV",
        description: "Selezionare un file CSV da caricare (max 10MB)",
        placeholder: "Scegliere il file CSV...",
        helpText:
          "Formato supportato: CSV con valori separati da virgola. La prima riga dovrebbe contenere intestazioni di colonna.",
      },
      fileName: {
        label: "Nome del file",
        description: "Nome per questa importazione (per il vostro riferimento)",
        placeholder: "ad esempio, gennaio 2024 Leads Import",
      },
      domain: {
        label: "Dominio di importazione",
        description: "Che tipo di dati stai importando?",
        placeholder: "Selezionare il tipo di dati...",
      },
      processingSection: {
        title: "Opzioni di elaborazione",
        description: "Configurare il modo in cui i dati devono essere trattati",
      },
      skipDuplicates: {
        label: "Skip Duplicas",
        description: "Salta i record con gli indirizzi e-mail duplicati",
        helpText:
          "Consigliato: Previene importare lo stesso contatto due volte",
      },
      updateExisting: {
        label: "Aggiornamento esistente",
        description: "Aggiorna i record esistenti con nuovi dati da CSV",
        helpText:
          "In caso di incontrollato, i record esistenti saranno lasciati invariati",
      },
      useChunkedProcessing: {
        label: "Lavorazione dello sfondo",
        description: "Elaborare grandi file sullo sfondo",
        helpText: "Consigliato per i file con oltre 500 record",
      },
      batchSize: {
        label: "Dimensione della batch",
        description: "Numero di record da elaborare subito",
        placeholder: "100",
        helpText:
          "I lotti più piccoli sono più stabili, i lotti più grandi sono più veloci",
      },
      defaultsSection: {
        title: "Valori di default (opzionale)",
        description:
          "Impostare i valori di default per i record mancanti queste informazioni",
      },
      defaultCountry: {
        label: "Paese di default",
        description: "Paese per record senza posizione",
        placeholder: "Seleziona il paese...",
      },
      defaultLanguage: {
        label: "Lingua di default",
        description: "Linguaggio per i record senza preferenze linguistiche",
        placeholder: "Seleziona la lingua...",
      },
      response: {
        title: "Risultati dell'importazione",
        description: "Riepilogo dell'operazione di importazione CSV",
        basicResults: {
          title: "Risultati di base",
          description: "Statistiche principali dell'importazione",
        },
        batchId: {
          label: "Batch ID",
        },
        totalRows: {
          label: "Totale righe",
        },
        isChunkedProcessing: {
          label: "Lavorazione dello sfondo",
        },
        jobId: {
          label: "Lavoro ID",
        },
        statistics: {
          title: "Statistiche dell'importazione",
          description:
            "Ripartizione dettagliata dell'operazione di importazione",
        },
        successfulImports: {
          label: "Importazioni di successo",
        },
        failedImports: {
          label: "Importazioni fallite",
        },
        duplicateEmails: {
          label: "Duplicare le email",
        },
        processingTimeMs: {
          label: "Tempo di elaborazione (ms)",
        },
        summary: {
          title: "Importazione sommaria",
          description: "Panoramica dei risultati delle importazioni",
        },
        newRecords: {
          label: "Nuova registrazione",
        },
        updatedRecords: {
          label: "Registrazioni aggiornate",
        },
        skippedDuplicates: {
          label: "Duplica saltata",
        },
        errors: {
          title: "Dettagli di errore",
          row: {
            label: "Voce",
          },
          email: {
            label: "Email",
          },
          error: {
            label: "Errore",
          },
        },
        nextSteps: {
          title: "Prossimo passo",
          item: {
            label: "Prossimo passo",
          },
        },
      },
      errors: {
        validation: {
          title: "Dati di importazione non validi",
          description: "Controlla il tuo file e le impostazioni CSV",
          emptyFile: "Il contenuto del file CSV è richiesto",
          emptyFileName: "Si prega di fornire un nome per questa importazione",
          invalidDomain: "Seleziona un dominio di importazione valido",
          invalidBatchSize:
            "La dimensione del batch deve essere compresa tra 10 e 1000",
          fileTooLarge:
            "La dimensione del file supera il limite di 10MB. Considerare l'utilizzo di elaborazione di sfondo.",
        },
        unauthorized: {
          title: "Accesso negato",
          description: "Non hai il permesso di importare i dati",
        },
        fileTooLarge: {
          title: "File Troppo grande",
          description: "Il file selezionato supera il limite massimo di 10MB",
        },
        server: {
          title: "Importazione non riuscita",
          description:
            "Si è verificato un errore durante l'elaborazione della vostra importazione. Per favore, riprovate.",
        },
        network: {
          title: "Errore di rete",
          description:
            "La connessione di rete è fallita durante l'importazione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di eseguire questa importazione",
        },
        notFound: {
          title: "Non trovato",
          description: "Importazione delle risorse non trovate",
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
          title: "Conflitto dei dati",
          description: "Un conflitto si è verificato con i dati esistenti",
        },
      },
      success: {
        title: "Importazione di successo",
        description: "I dati CSV sono stati importati con successo",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "Finanziamenti",
        description: "Il lavoro è in attesa di essere elaborato",
      },
      processing: {
        label: "Lavorazione",
        description: "Lavoro attualmente in fase di elaborazione",
      },
      completed: {
        label: "Completo",
        description: "Lavoro finito con successo",
      },
      failed: {
        label: "Sfigato",
        description: "Lavoro incontrato un errore",
      },
      cancelled: {
        label: "Annullamento",
        description: "Il lavoro è stato cancellato dall'utente",
      },
      paused: {
        label: "Paused",
        description: "L'elaborazione del lavoro è temporaneamente sospesa",
      },
    },
    domain: {
      leads: {
        label: "Contatti",
        description: "Potenziali clienti e contatti commerciali",
      },
      contacts: {
        label: "Contatti",
        description: "Informazioni generali di contatto e rubrica",
      },
      businessData: {
        label: "Dati aziendali",
        description: "Informazioni aziendali e profili aziendali",
      },
      emails: {
        label: "Elenchi delle email",
        description: "Liste e campagne di email marketing",
      },
      users: {
        label: "Utenti",
        description: "Utenti di sistema e informazioni sugli account",
      },
      templates: {
        label: "Modelli",
        description: "Modelli e contenuti di posta elettronica",
      },
    },
    format: {
      csv: {
        label: "File CSV",
        description: "Valori separati (più comuni)",
      },
      xlsx: {
        label: "File di Excel",
        description: "Foglio di calcolo di Excel Microsoft",
      },
      json: {
        label: "File JSON",
        description: "Dati della Notazione oggetto",
      },
      tsv: {
        label: "File TSV",
        description: "Valori separati dalla scheda",
      },
    },
    processing: {
      immediate: {
        label: "Elaborazione ora",
        description: "Elaborare il file immediatamente (più veloce)",
      },
      background: {
        label: "Sfondo",
        description: "Processo in background (per grandi file)",
      },
      scheduled: {
        label: "Orari più tardi",
        description: "Pianificare l'elaborazione per un determinato momento",
      },
    },
    errorType: {
      validation: {
        label: "Errore di convalida",
        description: "I dati non soddisfano il formato o le regole richieste",
      },
      duplicate: {
        label: "Duplicare i dati",
        description: "Il record esiste già nel sistema",
      },
      format: {
        label: "Formato errore",
        description: "Il formato del file è errato o danneggiato",
      },
      processing: {
        label: "Errore di elaborazione",
        description: "Errore avvenuto durante il trattamento dei dati",
      },
      system: {
        label: "Errore di sistema",
        description: "Errore del sistema interno",
      },
    },
    batchSize: {
      small: {
        label: "Piccolo (50)",
        description: "Migliore per la prova o piccole importazioni",
      },
      medium: {
        label: "Mezzo (100)",
        description: "Raccomandato per la maggior parte delle importazioni",
      },
      large: {
        label: "Grande (250)",
        description: "Buono per file di grandi dimensioni con dati semplici",
      },
      xlarge: {
        label: "Extra Large (500)",
        description: "Per file molto grandi (utenti avanzati)",
      },
    },
  },
  nextSteps: {
    reviewErrors:
      "Verificare i dettagli dell'errore per capire cosa è andato storto",
    checkDuplicates:
      "Considerare la regolazione delle impostazioni di gestione duplicate",
    reviewLeads:
      "Rivedere i tuoi cavi importati nella sezione gestione dei lead",
    startCampaign:
      "Considera di iniziare una campagna e-mail con i tuoi nuovi lead",
    reviewContacts: "Rivedere i contatti importati nella sezione contatti",
    organizeContacts: "Organizza i tuoi contatti in gruppi o tag",
    reviewImported: "Rivedere i dati importati nella sezione pertinente",
    monitorProgress: "Monitorare i progressi nella storia del lavoro",
    checkJobsList:
      "Controllare l'elenco dei lavori per gli aggiornamenti di stato dettagliati",
  },
  errors: {
    cancel: {
      server: "Non ha annullato il lavoro di importazione",
    },
    retry: {
      server: "Non ha riprovato il lavoro di importazione",
    },
    delete: {
      server: "Non è riuscito a eliminare il lavoro di importazione",
    },
    status: {
      server: "Non è riuscito a ottenere lo stato di lavoro",
    },
  },
  error: {
    default: "Si è verificato un errore",
  },
  enums: {
    csvImportJobStatus: {
      pending: "Finanziamenti",
      processing: "Lavorazione",
      completed: "Completo",
      failed: "Sfigato",
    },
    csvImportJobAction: {
      retry: "Riprova",
      delete: "Elimina",
      stop: "Fermati.",
    },
    importMode: {
      createOnly: "Creare Solo",
      updateOnly: "Aggiornamento Solo",
      createOrUpdate: "Creare o aggiornare",
      skipDuplicates: "Skip Duplicas",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "Immediato",
      chunked: "Coperto",
      scheduled: "Programmato",
    },
    importErrorType: {
      validationError: "Errore di convalida",
      duplicateEmail: "Duplicare Email",
      invalidFormat: "Formato non valido",
      missingRequiredField: "Campo richiesto mancante",
      processingError: "Errore di elaborazione",
      systemError: "Errore di sistema",
    },
    batchProcessingStatus: {
      pending: "Finanziamenti",
      processing: "Lavorazione",
      completed: "Completo",
      failed: "Sfigato",
      retrying: "Ripensare",
    },
    importPriority: {
      low: "Basso",
      normal: "Normale",
      high: "Alto.",
      urgent: "Urgente",
    },
    importSource: {
      webUpload: "Caricamento web",
      apiUpload: "Caricamento API",
      scheduledImport: "Importazione pianificata",
      bulkOperation: "Funzionamento della lampadina",
    },
    csvDelimiter: {
      comma: "Comma",
      semicolon: "Semicolon",
      tab: "Scheda",
      pipe: "Pipe",
    },
    importValidationLevel: {
      strict: "Strict",
      moderate: "Moderatore",
      lenient: "Leniente",
    },
    importNotificationType: {
      email: "Email",
      inApp: "L'applicazione",
      webhook: "Webhook",
      none: "Nessuno",
    },
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Contatto iniziale",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
  },
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
  },
  languages: {
    it: "Italiano",
    es: "Spagnolo",
    sk: "Slovacco",
    hi: "Hindi",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
};
