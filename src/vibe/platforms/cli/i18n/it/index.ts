import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  setup: {
    install: {
      post: {
        title: "Installazione",
        description: "Installare l'endpoint",
        form: {
          title: "Installare la configurazione",
          description: "Configurare i parametri di installazione",
        },
        response: {
          title: "Risposta",
          description: "Installa i dati di risposta",
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
    },
    status: {
      post: {
        title: "Stato di installazione CLI",
        description:
          "Controlla lo stato di installazione attuale della Vibe CLI",
        form: {
          title: "Configurazione dello stato",
          description: "Configurare i parametri di stato",
        },
        response: {
          title: "Stato di installazione",
          description: "Dettagli di installazione CLI attuali",
          fields: {
            success: "Stato di funzionamento",
            installed: "Installato",
            version: "Versione CLI",
            path: "Sentiero di installazione",
            message: "Messaggio di stato",
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
    },
    uninstall: {
      post: {
        title: "Disinstallare",
        description: "Disinstallare endpoint",
        form: {
          title: "Disinstallare Configurazione",
          description: "Configurare i parametri disinstallazione",
        },
        response: {
          title: "Risposta",
          description: "Disinstallare i dati di risposta",
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
    },
    update: {
      post: {
        title: "Aggiornamento",
        description: "Aggiornare il punto finale",
        form: {
          title: "Configurazione di aggiornamento",
          description: "Configurare i parametri di aggiornamento",
        },
        response: {
          title: "Risposta",
          description: "Aggiornare i dati di risposta",
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
    },
  },
  request: "Richiesta",
  response: {
    success: "Risposta",
    error: "Errore",
  },
  auth: {
    errors: {
      userNotFound:
        "utente CLI con e-mail {{email}} non trovato nel database. Per favore, prima di eseguire 'vibe seed'.",
      databaseError:
        "Errore del database durante l'acquisizione dell'utente CLI: {{error}}",
      authNotAvailable: "L'autenticazione non è disponibile",
    },
  },
  vibe: {
    noFields: "Nessun campo da visualizzare",
    startingUp: "Avviare Vibe CLI...",
    executeCommand: "Eseguire il comando",
    executing: "In esecuzione",
    listCommands: "Elenca tutti i comandi disponibili",
    output: "Formato di uscita",
    utils: {
      debug: {
        executionSummary:
          "Esecuzione: {{executionSeconds}} s | Overhead: {{overheadSeconds}} s | Totale: {{totalSeconds}} s",
      },
    },
    help: {
      title: "Vibe CLI Aiuto",
      description:
        "Vibe CLI - Strumento di esecuzione API di prossima generazione",
      usage: "Utilizzo: vibe <command> [opzioni]",
      commands: "Comandi disponibili",
      options: "Opzioni",
      examples: "Esempi",
      locale: "Specificare il locale (en- GLOBAL, de- DE, pl- PL)",
      verbose: "Abilitare l'output verbose",
      target:
        "Obiettivo di esecuzione: dev (default) o locale (anteprima DB con --hermes)",
      thea: "Breve mano per --remote (targets l'istanza 'thea')",
      remote:
        "Eseguire su un'istanza remota da ID (default: thea). Sembra il collegamento dal attivo DB.",
      interactive: "Inserire la modalità interattiva",
    },
    errors: {
      routeNotFound: "Strumento non trovato: {{toolName}}",
      executionFailed: "Esecuzione fallita",
      executionFailedDetail: "Esecuzione fallita: {{error}}",
      unknownError: "Errore sconosciuto si è verificato",
      publicPayloadNotSupported: "Carico pubblico non supportato",
      invalidTokenPayload: "Carico di pagamento del gettone non valido",
      invalidToken: "Token non valido",
      signingFailed: "Token firma fallito",
      userNotFound: "Utente non trovato",
      authenticationFailed: "Autenticazione fallita",
      invalidFormat: "Formato di sessione non valido",
      sessionExpired: "Sessione scaduta",
      notFound: "Sessione non trovata",
      readFailed: "Non ha letto la sessione",
      invalidData: "Dati di sessione non validi",
      writeFailed: "Non ha scritto sessione: {{error}}",
      deleteFailed: "Non è possibile eliminare la sessione: {{error}}",
      storeFailed: "Non memorizzare la sessione: {{error}}",
      clearFailed: "Non è possibile cancellare la sessione: {{error}}",
      setLeadIdCookieFailed: "Non impostare il cookie ID",
      remoteNoToken: "La sessione remota non ha un token attivo",
      remoteExpired: "Sessione remota scaduta",
      remoteNotFound:
        "Nessuna sessione remota trovata. Run: vibe login --target remote",
      remoteReadFailed: "Non ha letto la sessione remota",
      remoteWriteFailed: "Non è riuscito a scrivere sessione remota",
      remoteClearFailed: "Non riuscito a cancellare la sessione remota",
      remoteNoConnection:
        "Nessuna connessione attiva per esempio ' {{instanceId}} '. Correre: vibrazione collegare <url>",
      remoteNotLoggedIn:
        "Non è collegato a un host remoto. Esegui: vibe --remote login",
      remoteNoLeadId: "Non poteva ottenere l'identità da host remoto",
      remoteServerError: "Errore server remoto",
      remoteNotAvailable:
        "L'esecuzione remota non è disponibile in questa costruzione",
    },
    endpoints: {
      endpointHandler: {
        error: {
          form_validation_failed: "La convalida del modulo non è riuscita",
          unauthorized: "Accesso non autorizzato",
          errors: {
            unknown_validation_error: "Errore di validazione sconosciuto",
            invalid_request_data: "Dati di richiesta non validi",
            invalid_url_parameters: "Parametri URL non validi",
          },
          general: {
            internal_server_error: "Errore del server interno",
          },
        },
      },
      renderers: {
        cliUi: {
          helpHandler: {
            noDescription: "Nessuna descrizione disponibile",
            flagDataDesc: "Fornire i dati della richiesta come JSON",
            flagUserTypeDesc:
              "Specificare il tipo di utente (admin, cliente, pubblico)",
            flagLocaleDesc:
              "Specificare il locale (en- GLOBAL, de- DE, pl- PL)",
            flagOutputDesc: "Formato di uscita (pretty, json)",
            flagVerboseDesc: "Abilitare l'output verbose",
            flagDryRunDesc: "Eseguire una corsa asciutta senza eseguire",
            usageLabel: "Utilizzo",
            availableCommandsLabel: "Comandi disponibili",
            globalOptionsLabel: "Opzioni globali",
            examplesLabel: "Esempi",
          },
          noEndpoint:
            "Questa funzione non è ancora disponibile. Riprova più tardi",
          widgets: {
            common: {
              noDataAvailable: "Nessun dato disponibile",
              noIssuesFound: "Nessun problema rilevato",
              invalidDataFormat: "Formato dei dati non valido",
              invalidFormType:
                "Il contesto del modulo non è uno stato della forma dell'inchiostro. Non è possibile rendere l'ingresso interattivo.",
              info: "Info",
              items: "Articolo",
              andMoreItems: "e {{count}} più articoli",
              affectedFiles: "File interessati",
              summary: "Riepilogo",
              files: "File",
              issues: "Problemi",
              other: "Altro",
              error: "Errore",
              errors: "Errori",
              warning: "Avvertenza",
              warnings: "Avvertenze",
              hints: {
                spaceToToggle: "(spazio da attivare)",
                arrowsToChange: "(←/→ per cambiare)",
                dollarPrompt: "$ ",
                executing: "Esecuzione...",
                tabNextField:
                  "scheda: campo successivo | immettere: inviare | q/esc: uscita",
                ctrlCExitHint: "Premere nuovamente Ctrl+C per uscire",
                escExitHint: "Premere nuovamente Esc per uscire",
              },
            },
            pagination: {
              notImplemented:
                "Paginazione non implementata per CLI. Utilizzare filtri per ottenere risultati ristretti.",
            },
          },
        },
      },
    },
    interactive: {
      welcome: "Benvenuti in modalità interattiva Vibe",
      goodbye: "Addio!",
      help: {
        selectCategory: "Seleziona una categoria per sfogliare gli strumenti",
        selectTool: "Selezionare uno strumento per visualizzare i dettagli",
        category: "Categoria  ",
        method: "Metodo  ",
        credits: "Crediti  ",
        callAs: "Chiamare come   ",
        fields: "Campi",
        hintsNavSelect: "frecce: navigare | inserire: selezionare | q: quit",
        hintsNavSelectBack:
          "frecce: navigare | inserire: selezionare | esc: back | q: quit",
        hintsExecuteBack: "inserire: eseguire | esc: back | q: quit",
        hintsBack: "inserire/esc: indietro | q: quit",
        success: "Operazione riuscita",
        error: "Errore",
        result: "Risultato",
      },
      navigation: {
        rootName: "Radice",
        directoryIcon: "📁",
        upIcon: "⬆️",
        goUp: "Vai!",
        routeIcon: "🔗",
        routes: "Itinerari",
        settingsIcon: "⚙️",
        settings: "Impostazioni",
        exitIcon: "🚪",
        exit: "Uscita",
        navigate: "Navigare",
        route: "Route",
        method: "Metodo",
        description: "Designazione",
        noDefinition: "Nessuna definizione trovata",
        executionFailed: "Esecuzione fallita",
        executeAnother: "Esegui un altro",
        selectLocale: "Selezionare la lingua",
        englishGlobal: "Inglese (Global)",
        requestData: "Richiesta di dati",
        urlParameters: "Parametri URL",
        preview: "Anteprima",
        executeWithParams: "Eseguire con i parametri",
        navigationError: "Errore di navigazione",
        chooseSettingToModify: "Scegliere l'impostazione per modificare",
        outputFormatCurrent: "Formato di uscita (corrente",
        verboseModeCurrent: "Modalità Verbose (corrente",
        localeCurrent: "Locale (corrente",
        backToMainMenu: "Torna al menu principale",
        chooseOutputFormat: "Scegli il formato di output",
        prettyFormatted: "Piuttosto formattato",
        jsonRaw: "JSON (Raw)",
        enableVerboseOutput: "Abilitare l'output verbose",
        chooseLocale: "Scegli la lingua",
        german: "Tedesco",
        polish: "Polacco",
        settingUpdated: "Impostazione aggiornata con successo",
        viewAllRoutes: "Visualizza tutti i percorsi",
        selectRoute: "Selezionare un percorso da eseguire",
        backToNavigation: "Torna alla navigazione",
      },
    },
  },
};
