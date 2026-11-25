import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Strumento di esecuzione",
      titleShort: "Strumento di esecuzione",
      dynamicTitle: "Esecuzione: {{toolName}}",
      description:
        "Eseguire qualsiasi punto finale registrato per nome. Passare il nome dell'utensile e i suoi parametri di input. Il percorso di destinazione fa rispettare la propria autenticazione - questo endpoint è un dispacciatore universale per gli agenti MCP, AI e l'automazione.",
      container: {
        title: "Esecuzione degli strumenti",
        description: "Nome del percorso e parametri di input",
      },
      fields: {
        toolName: {
          label: "Nome dello strumento",
          description:
            "Il nome dello strumento registrato o alias da eseguire (ad esempio ' vibe_agent_skills_GET '). Utilizzare tool-help per scoprire gli strumenti disponibili.",
          placeholder: "vibe_agent_skills_GET",
        },
        input: {
          label: "Input",
          description:
            "Parametri di ingresso per lo strumento come oggetto JSON. I param del percorso URL (ad es. id) vengono estratti automaticamente da questo oggetto.",
        },
        instanceId: {
          label: "Articolo ID",
          description:
            'Segnale a distanza opzionale ID. Quando impostato, crea un compito asincastro sull\'istanza remota invece di eseguire localmente. Risultato sarà { taskId, stato: "in attesa"}.',
        },
        callbackMode: {
          label: "Modalità di callback",
          description:
            '"wait": eseguire sincronia, restituire il risultato in linea (default). "detach": fire-and-forget, restituisce {taskId} immediatamente - utilizzare attendere-task più tardi se necessario. " wakeUp ": fuoco-e-forget, il risultato viene iniettato automaticamente nel thread quando pronto - do NOT chiamata attesa-task. " endLoop ": eseguire normalmente e restituire il risultato, ma interrompere ulteriori chiamate',
        },
      },
      response: {
        result:
          "I dati dei risultati restituiti dalla rotta di destinazione. In caso di fallimento questo campo è assente - la risposta stessa sarà un errore.",
        resultLabel: "Risultato",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "toolName o parametri di input non validi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione richiesta per chiamare questo endpoint",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        toolDeniedHere: {
          title:
            "{{toolName}} non è disponibile in questo thread. Chiama direttamente gli strumenti nella tua lista degli strumenti.",
        },
        notFound: {
          title: "Strumento non trovato",
          description:
            "Nessun strumento registrato corrisponde al dato toolName",
          // `title` is the definition's declared NOT_FOUND label and renders
          // param-free there, so the tool name gets its own key.
          detail:
            'Strumento " {{toolName}} " non trovato. Non riprovare questa chiamata. controlla gli strumenti disponibili con l\'aiuto degli strumenti.',
        },
        remoteFailed: {
          title: "Strumento remoto fallito: {{message}}",
          description: "L'istanza remota ha respinto o fallito la chiamata",
          detail: 'Strumento remoto " {{toolName}} " fallito: {{message}}',
        },
        resultChannelLost: {
          detail:
            'Nessun server locale su {{hubUrl}} per ricevere il risultato di "{{toolName}}" da {{instanceId}} ({{detail}}). Avvialo prima (`vibe dev`, oppure `vibe --hermes dev` per Hermes) e riprova.',
        },
        server: {
          title: "Errore di esecuzione",
          description:
            "L'itinerario di destinazione ha incontrato un errore del server",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante l'esecuzione degli strumenti",
        },
        unknown: {
          // `title` is a declared errorTypes label and renders param-free, so
          // the cause lives in `detail` instead.
          title: "Errore sconosciuto",
          description:
            "Un errore inaspettato si è verificato durante l'esecuzione",
          detail: "Errore sconosciuto durante l'esecuzione: {{error}}",
        },
      },
      success: {
        title: "Strumento eseguito",
        description: "Lo strumento è stato eseguito con successo",
      },
      widget: {
        enterToolName:
          "Immettere un nome strumento per caricare il suo modulo.",
        resolving: "Risolvere il punto finale...",
        unknownTool: "Strumento sconosciuto: {{toolName}}",
      },
      actions: {
        confirm: "Conferma",
        cancel: "Annulla",
      },
    },
  },
  dismissTask: {
    post: {
      title: "Discorso",
      titleShort: "Deliberazione",
      description:
        "Cancellare un revival wakeUp in sospeso. Lo strumento continua a funzionare in background, ma il filo si sblocca immediatamente. Il risultato è silenziosamente scartato quando lo strumento completa.",
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "callId è necessario",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessuna chiamata in sospeso trovata per questo callId",
        },
        server: {
          title: "Errore del server",
          description: "Non ha respinto la chiamata in sospeso",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante la disattivazione dell'attività",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
      },
      success: {
        title: "Compito respinto",
        description:
          "Discussione sbloccata. Lo strumento continua sullo sfondo.",
      },
    },
  },
  cancelTool: {
    post: {
      title: "Annullare la chiamata degli strumenti",
      titleShort: "Annullare lo strumento",
      description:
        "Interrompere una singola chiamata di strumento in-flight dal suo callId mentre è ancora in funzione. La chiamata si ferma e restituisce un errore come risultato; la svolta e qualsiasi sibling parallel tool chiamate continuare a funzionare.",
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "callId è necessario",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        notFound: {
          title: "Non trovato",
          description: "Nessuna chiamata in volo per questo callId",
        },
        server: {
          title: "Errore del server",
          description: "Non ha annullato la chiamata dello strumento",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante la cancellazione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
      },
      success: {
        title: "Lo strumento di chiamata cancellata",
        description:
          "La chiamata per gli attrezzi in esecuzione è stata interrotta.",
      },
    },
  },
  detachCall: {
    post: {
      title: "Detach Tool Call",
      titleShort: "Chiamata di distacco",
      description:
        "Aggiornare una chiamata di strumento ancora in esecuzione per staccare dal suo callId: continua a funzionare in background, il suo risultato è scartato, e la svolta è sbloccato ora. Utilizzare il curriculum-quando fatto invece se avete bisogno del risultato.",
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "callId è necessario",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        notFound: {
          title: "Non trovato",
          description: "Nessuna chiamata in volo per questo callId",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a staccare la chiamata dello strumento",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante il distacco",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
      },
      success: {
        title: "Chiamata di strumento Detached",
        description:
          "La chiamata continua sullo sfondo; il suo risultato è scartato.",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "Spostare la chiamata degli strumenti a sfondo",
      titleShort: "Strumento di sfondo",
      description:
        "Lasciare un fermo strumento chiamata finitura in background dal suo callId. Il giro termina e il filo rianima con il risultato quando il lavoro si completa.",
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "callId è necessario",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        notFound: {
          title: "Non trovato",
          description: "Nessuna chiamata in volo per questo callId",
        },
        server: {
          title: "Errore del server",
          description:
            "Non è riuscito a sottofondo la chiamata dello strumento",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante lo sfondo",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
      },
      success: {
        title: "Chiamata dello strumento Sfondo",
        description: "La chiamata di strumento continua in background.",
      },
    },
  },
  tools: {
    // Translations moved to system/help/get - see system/help/i18n/en/index.ts
    get: {
      title: "Guida agli strumenti - Scopri gli strumenti disponibili",
      description:
        "Cerca e scopri tutti gli strumenti AI a tua disposizione. Utilizzare query per cercare per nome, descrizione o alias. Utilizzare la categoria per filtrare per categoria utensile. Restituisce nomi degli strumenti, descrizioni, alias e metadati.",
      category: "Strumenti AI",
      tags: {
        tools: "strumenti",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Strumento non trovato: {{toolName}}",
      parameterValidationFailed:
        "La validazione del parametro è fallita: {{errors}}",
      executionFailed: "Esecuzione degli strumenti fallita",
    },
  },
  factory: {
    errors: {
      executionFailed: "Esecuzione degli strumenti fallita",
    },
    descriptions: {
      noParametersRequired: "Nessun parametro richiesto per questo endpoint",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nEsempio: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Punto finale per ",
      hiddenPlaceholder: "[nascosto]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Avviamento del registro degli strumenti fallito",
    },
  },
};
