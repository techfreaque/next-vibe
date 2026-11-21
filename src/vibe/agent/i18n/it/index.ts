import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "IA",
    status: "Stato",
    processing: "Lavorazione",
    classification: "Classificazione",
    automation: "Automazione",
    execution: "Esecuzione",
    confirmation: "Conferma",
    speech: "Discorso",
    transcription: "Trascrizione",
    tts: "Testo a velocità",
  },
  enums: {
    emailAgentStatus: {
      pending: "Finanziamenti",
      processing: "Lavorazione",
      hardRulesComplete: "Regole difficili complete",
      aiProcessing: "Lavorazione AI",
      awaitingConfirmation: "Risveglio della conferma",
      completed: "Completo",
      failed: "Sfigato",
      skipped: "Asciugata",
    },
    emailAgentActionType: {
      markBounced: "Mark Bounced",
      markSpam: "Mark Spam",
      classifyDeliveryFailure: "Classificare il guasto di consegna",
      respondToEmail: "Rispondere a Email",
      deleteEmail: "Eliminare l'email",
      searchKnowledgeBase: "Base di conoscenza di ricerca",
      webSearch: "Ricerca web",
      escalateToHuman: "Escalate verso l'uomo",
      noAction: "Nessuna azione",
      chainAnalysis: "Analisi della catena",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Base di conoscenza",
      emailResponse: "Risposta e-mail",
      emailDelete: "Cancellazione di email",
      webSearch: "Ricerca web",
    },
    bounceCategory: {
      hardBounce: "Mazzo duro",
      softBounce: "Morbido rimbalzo",
      spamComplaint: "Spiegazione Spam",
      unsubscribe: "Disiscriviti",
      blockBounce: "Blocco di rimbalzo",
      invalidAddress: "Invalid Indirizzo",
      mailboxFull: "Mailbox piena",
      contentRejected: "Rifiuto dei contenuti",
    },
    confirmationStatus: {
      pending: "Finanziamenti",
      approved: "Approvazione",
      rejected: "Rifiuti",
      expired: "Scadenza",
    },
    processingPriority: {
      low: "Basso",
      normal: "Normale",
      high: "Alto.",
      urgent: "Urgente",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    emailAgentSortField: {
      emailId: "Email ID",
      status: "Stato",
      lastProcessedAt: "Ultimo processo a",
      createdAt: "Creato a",
      priority: "Priorità",
    },
    emailAgentStatusFilter: {
      all: "Tutti",
      pending: "Finanziamenti",
      processing: "Lavorazione",
      hardRulesComplete: "Regole difficili complete",
      aiProcessing: "Lavorazione AI",
      awaitingConfirmation: "Risveglio della conferma",
      completed: "Completo",
      failed: "Sfigato",
      skipped: "Asciugata",
    },
    emailAgentActionTypeFilter: {
      all: "Tutti",
      markBounced: "Mark Bounced",
      markSpam: "Mark Spam",
      classifyDeliveryFailure: "Classificare il guasto di consegna",
      respondToEmail: "Rispondere a Email",
      deleteEmail: "Eliminare l'email",
      searchKnowledgeBase: "Base di conoscenza di ricerca",
      webSearch: "Ricerca web",
      escalateToHuman: "Escalate verso l'uomo",
      noAction: "Nessuna azione",
      chainAnalysis: "Analisi della catena",
    },
    confirmationStatusFilter: {
      all: "Tutti",
      pending: "Finanziamenti",
      approved: "Approvazione",
      rejected: "Rifiuti",
      expired: "Scadenza",
    },
    processingPriorityFilter: {
      all: "Tutti",
      low: "Basso",
      normal: "Normale",
      high: "Alto.",
      urgent: "Urgente",
    },
    confirmationResponseAction: {
      approve: "Approvo",
      reject: "Rifiuti",
    },
    modelUtilities: {
      chat: "Chat",
      coding: "Programmazione",
      creative: "Scrittura creativa",
      analysis: "Analisi",
      reasoning: "Ragione",
      roleplay: "Gioco di ruolo",
      fast: "Rapido",
      smart: "Intelligente",
      vision: "Visione",
      imageGen: "Generazione di immagini",
      politicalLeft: "Sinistra politica",
      politicalRight: "Diritto politico",
      controversial: "Controversia",
      adultImplied: "Adulto (Implied)",
      adultExplicit: "Adulto (esplicito)",
      violence: "Violenza",
      harmful: "Contenuti nocivi",
      illegalInfo: "Informazioni su attività illegali",
      medicalAdvice: "Consigli medici",
      offensiveLanguage: "Linguaggio offensivo",
      roleplayDark: "Gioco di ruolo a tema oscuro",
      conspiracy: "Cospirazione",
      legacy: "Modelli precedenti",
      uncensored: "Senza censura",
    },
  },
  aiStream: {
    category: "Agent",
    tags: {
      streaming: "Streaming",
      chat: "Chat",
      ai: "IA",
    },

    run: {
      task: {
        name: "AI Heartbeat",
        description:
          "Agente AI che controlla la salute del sistema, lavora attraverso i compiti e contatta l'uomo quando necessario",
      },
      post: {
        title: "Eseguire AI Agent",
        dynamicTitle: "AI Run {{suffix}}: {{prompt}}",
        description:
          "Delega un compito a un agente IA specializzato e restituisci la risposta. Per creare o modificare skill o personaggi IA, delega sempre con skill='skill-creator'. Passa skill e prompt: l’agente fa il resto. Il costo in crediti dipende dal modello.",
        container: {
          title: "Agente AI eseguire",
          description:
            "Configura le chiamate preliminari e il prompt per eseguire l’agente senza interfaccia grafica.",
        },
        fields: {
          favoriteId: {
            label: "ID preferito",
            description:
              "Slug o ID di un preferito salvato. Carica la skill, il modello e gli strumenti come valori predefiniti. I campi inviati nella richiesta hanno la precedenza.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "Modello",
            description:
              "LLM per il ragionamento sul testo. Facoltativo quando imposti favoriteId o skill. Rapidi: claude-haiku-4.5, gemini-2.5-flash. Bilanciati: claude-sonnet-4.6, gpt-5. Potente: claude-opus-4.7. Gratuito: qwen3_235b-free. Per generare immagini, audio o video, usa un modello dedicato.",
          },
          skill: {
            label: "Skill",
            description:
              "ID o nome predefinito della skill. Definisce il personaggio e il prompt di sistema dell’IA. Usa 'skill-creator' per creare o modificare skill. Facoltativo quando imposti favoriteId.",
            placeholder: "default",
          },
          prompt: {
            label: "Prompt",
            description:
              "Istruzione o domanda principale per l’IA. Sii preciso. Se fornisci preCalls, l’IA usa i risultati come contesto.",
            placeholder: "Inserisci il prompt...",
          },
          instructions: {
            label: "Istruzioni di sistema extra",
            description:
              "Istruzioni facoltative aggiunte al prompt di sistema. Specificale per limitare formato, tono o lunghezza della risposta, ad esempio «Sii conciso. Solo JSON».",
            placeholder: "Sii conciso. Un paragrafo max.",
          },
          preCalls: {
            label: "Pre-Calls",
            description:
              "Chiamate agli strumenti da eseguire prima del prompt. I risultati diventano parte del contesto. Usa tool-help per vedere gli strumenti disponibili e i relativi argomenti.",
            routeId: {
              label: "Strumento ID",
              description:
                "Alias o nome completo dello strumento, ad esempio 'web-search' o 'agent_skills_GET'. Usa tool-help per vedere gli strumenti disponibili.",
              placeholder: "web-search",
            },
            args: {
              label: "Argomenti",
              description:
                'Argomenti dello strumento in coppie chiave-valore. Unisci urlPathParams e i campi del corpo in un unico oggetto, ad esempio {"query": "ultime notizie", "maxResults": 5}.',
            },
          },
          availableTools: {
            label: "Consentito di eseguire",
            description:
              "Strumenti che l’IA può eseguire. Con null può usare tutti quelli consentiti. Con un array può usare solo quelli elencati. Configurazione standard: [{toolId:'execute-tool'},{toolId:'tool-help'}].",
            toolId: {
              label: "Strumento ID",
              description:
                "Alias o nome completo dello strumento, ad esempio 'execute-tool', 'tool-help' o 'web-search'.",
            },
            requiresConfirmation: {
              label: "Richiede conferma",
              description:
                "Pausa per la conferma dell'utente prima di eseguire questo strumento",
            },
          },
          pinnedTools: {
            label: "In Context (il modello vede questi)",
            description:
              "Strumenti caricati nel contesto del modello. Con null valgono le impostazioni dell’utente. Questo campo determina quali strumenti il modello vede. I permessi di esecuzione si configurano a parte.",
            toolId: {
              label: "Strumento ID",
              description:
                "Alias strumento o nome completo per caricare in contesto",
            },
            requiresConfirmation: {
              label: "Richiede conferma",
              description:
                "Se questo strumento richiede la conferma dell'utente prima dell'esecuzione",
            },
          },
          maxTurns: {
            label: "Max gira",
            description:
              "Numero massimo di cicli di chiamata agli strumenti. Il valore predefinito è illimitato. Imposta 1 per un solo prompt e una risposta senza usare strumenti.",
          },
          appendThreadId: {
            label: "Filo ID (continua)",
            description:
              "UUID di una conversazione da continuare. Il nuovo messaggio viene aggiunto in coda. Lascia vuoto per avviare una nuova conversazione.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "Cartella di stoccaggio",
            description:
              "Dove salvare la conversazione. Background per le esecuzioni automatiche (Dreamer, Autopilot e attività pianificate). Privata per la tua cartella. Condivisa per il team. Incognito per evitare di salvarla.",
            placeholder: "background",
            options: {
              background: "Sfondo",
              private: "Privato",
              shared: "Condividi",
              incognito: "Incognito (senza deposito)",
            },
          },
          subFolderId: {
            label: "Sottocartella ID",
            description:
              "UUID facoltativo di una sottocartella della cartella principale. Serve per organizzare le conversazioni a mano. Lascia vuoto quando chiami ai-run da codice, da uno strumento IA o da un’automazione.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "Esclusi i ricordi",
            description:
              "Esclude dal contesto i ricordi salvati. Utile per bot pubblici e attività isolate. Valore predefinito: false.",
          },
        },
        response: {
          text: "Il testo di risposta di AI (pensare a strisce). Null se il modello non ha prodotto uscita.",
          promptTokens: "Token prompt consumati (costo di ingresso)",
          completionTokens: "Token di completamento generato (costo di uscita)",
          creditCost:
            "Crediti a carico di questa corsa. Null per le corse di incognito.",
          threadId:
            "Filo UUID dove è stato memorizzato il run. Null se rootFolderId era 'incognito'. Utilizzare questo per continuare la conversazione tramite appendThreadId.",
          lastAiMessageId:
            "UUID del messaggio finale dell'assistente. Utile per ramificare o riferire la risposta.",
          threadTitle: "Titolo auto-generato per questo thread",
          threadCreatedAt: "Tempi di creazione filettatura (ISO 8601)",
          preCallResults: {
            title: "Risultati pre-call",
            routeId: "Strumento che è stato chiamato",
            succeeded: "Se la chiamata è riuscita",
            errorMessage: "Messaggio di errore se la chiamata non è riuscita",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri non validi forniti",
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
            description: "Percorso o risorsa non trovata",
          },
          internal: {
            title: "Errore del server",
            description: "Errore del server interno durante l'esecuzione AI",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di rete durante l'esecuzione AI",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Discussione di cambiamenti non risolti",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
        },
        success: {
          title: "AI Esegui completo",
          description: "L'agente AI ha completato con successo",
        },
        backButton: {
          label: "Indietro",
        },
      },
    },
    route: {
      debug: {
        userObject: "AI Stream Route: Oggetto dell'utente",
        extracted: "AI Stream Route: Valori estratti",
      },
      errors: {
        invalidJson: "Invalid JSON nel corpo di richiesta",
        invalidRequestData: "Dati di richiesta non validi ({{issue}})",
        uncensoredApiKeyMissing: "Uncensored.ai API chiave non configurata",
        openrouterApiKeyMissing: "OpenRouter API chiave non configurata",
        streamCreationFailed:
          "Non è riuscito a connettersi al servizio AI. Per favore, riprovate.",
        unknownError: "Si è verificato un errore",
        creditValidationFailed: "Non convalidare il saldo di credito",
        noIdentifier: "Manca l’identificativo dell’utente o del contatto",
        insufficientCredits:
          "Crediti insufficienti per completare questa richiesta (costo: {{cost}}, saldo: {{balance}})",
        noResponseBody: "Lo stream non ha restituito un corpo di risposta.",
        authenticationRequired:
          "Si prega di accedere per utilizzare cartelle persistenti. Utilizzare la modalità incognito per chat anonime.",
      },
    },
    post: {
      title: "AI Stream Chat",
      titleShort: "Chatta AI",
      description:
        "Stream AI -powered chat risposte utilizzando i modelli {{modelCount}} (Claude, GPT, Gemini, Llama, e altro ancora). Supporta testo, voce, allegati di file e l'uso di strumenti agentic.",
      form: {
        title: "Configurazione di chat AI",
        description: "Configurare parametri e messaggi di chat AI",
      },
      operation: {
        label: "Operazione",
        description: "Tipo di operazione del messaggio per eseguire",
        options: {
          send: "Invia messaggio",
          retry: "Messaggio di riprovazione",
          edit: "Modifica messaggio",
          answerAsAi: "Risposta come AI",
        },
      },
      rootFolderId: {
        label: "Cartella di radice",
        description: "Contesto della cartella radice per il messaggio",
      },
      subFolderId: {
        label: "Sottocartella",
        description:
          "Sottocartella opzionale all'interno della cartella radice",
      },
      threadId: {
        label: "File ID",
        description:
          "UUID del thread per inviare questo messaggio. Deve essere una UUID valida - creare un thread prima se non ne hai uno.",
      },
      userMessageId: {
        label: "Messaggio utente ID",
        description: "Messaggio utente generato dal cliente ID",
      },
      parentMessageId: {
        label: "Messaggio principale ID",
        description: "Messaggio principale ID per la ramificazione/threading",
      },
      leafMessageId: {
        label: "Messaggio di foglie ID",
        description:
          "Il messaggio attuale della foglia di ramo ID - traccia ramo attivo senza contare su URL",
      },
      messageHistory: {
        label: "Storia del messaggio",
        description: "Storia del messaggio opzionale per la modalità incognito",
        item: {
          title: "Messaggio",
          description: "Messaggi di chat nella storia",
          role: {
            label: "Role",
          },
          content: {
            label: "Contenuti",
          },
          metadata: {
            toolCall: {
              toolName: {
                label: "Nome dello strumento",
              },
              args: {
                label: "Argomenti degli strumenti",
              },
              result: {
                label: "Risultato dello strumento",
              },
              error: {
                label: "Errore di strumento",
              },
              executionTime: {
                label: "Tempo di esecuzione (ms)",
              },
              creditsUsed: {
                label: "Crediti Usati",
              },
            },
          },
        },
      },
      content: {
        label: "Contenuto del messaggio",
        description: "Contenuto del messaggio da inviare",
        placeholder: "Inserisci il tuo messaggio...",
      },
      role: {
        label: "Role",
        description: "Ruolo del mittente del messaggio",
        options: {
          user: "Utente",
          assistant: "Assistente aggiunto",
          system: "Sistema",
        },
      },
      model: {
        label: "Modello",
        description: "Modello AI da utilizzare per la generazione",
      },
      skill: {
        label: "Skill",
        description: "Abilità opzionale da utilizzare per la AI",
      },
      systemPrompt: {
        label: "Prompt di sistema",
        description: "Istruzioni di sistema opzionali",
        placeholder: "Inserire il prompt del sistema...",
        now: "ora",
        minutesAgo: "{{minutes}} m fa",
        hoursAgo: "{{hours}} h fa",
        daysAgo: "{{days}} d fa",
      },
      enableSearch: {
        label: "Abilita la ricerca Web",
        description:
          "Consentire a AI di cercare il web per le informazioni attuali",
      },
      timezone: {
        label: "Luogo di origine",
        description: "Timezone utente per i timestamp della cache-stable",
      },
      imageSize: {
        label: "Dimensioni immagine",
        description:
          "Dimensione dell'immagine generata (ad esempio quadrato, paesaggio, ritratto)",
      },
      imageQuality: {
        label: "Qualità dell'immagine",
        description:
          "Impostazione di qualità per l'immagine generata (standard o hd)",
      },
      musicDuration: {
        label: "Durata della musica",
        description: "Durata della clip audio generata",
      },
      favoriteConfig: {
        label: "Configurazione preferita",
        description:
          "Configurazione completa del favorito attivo - selezioni del modello, configurazione degli strumenti, impostazioni di contesto. null = nessun attivo preferito, uso abilità/di default del sistema.",
      },
      enabledToolIds: {
        label: "ID utensili abilitati",
        description:
          "Elenco degli ID degli strumenti AI per abilitare questa conversazione",
      },
      toolConfirmation: {
        label: "Conferma dello strumento",
        description: "Rispondenza degli strumenti da parte dell'utente",
        success: "Conferma dello strumento elaborata con successo",
        messageId: {
          label: "Messaggio ID",
          description:
            "ID del messaggio contenente la chiamata dello strumento",
        },
        confirmed: {
          label: "Confermato",
          description: "Se l'utente ha confermato l'esecuzione dello strumento",
        },
        updatedArgs: {
          label: "Argomenti aggiornati",
          description:
            "Argomenti aggiornati opzionali per la chiamata dello strumento",
        },
        errors: {
          messageNotFound: "Messaggio di strumento non trovato",
          toolCallMissing: "ToolCall metadati mancanti",
          toolNotFound: "Strumento non trovato",
        },
      },
      resumeToken: {
        label: "Riprendi il Token",
        description: "Token per riprendere una risposta interrotta",
      },
      voiceMode: {
        label: "Modalità vocale",
        description: "Configurazione per l'interazione vocale",
        enabled: {
          label: "Abilitare la modalità vocale",
          description: "Abilitare l'interazione vocale con il testo a schermo",
        },
        voice: {
          label: "Voce",
          description:
            'Selezionare il tipo di voce per testo-speech. Passare "voces. MALE " per una voce maschile o "voices. FEMALE " (default) per una voce femminile.',
          male: "Voce maschile",
          female: "Voce femminile",
        },
      },
      audioInput: {
        title: "Input audio",
        description: "Caricare file audio per la modalità voce a voce",
        file: {
          label: "File audio",
          description: "File audio per trascrivere e elaborare",
        },
      },
      attachments: {
        label: "Allegati file",
        description: "File allegati al messaggio (immagini, documenti, ecc.)",
      },
      response: {
        title: "Risposta in streaming",
        description: "AI - risposta di streaming generata",
        success: "Stream completato con successo",
        messageId: "Messaggio ID",
        threadId: "File ID",
        totalTokens: "Token totali utilizzati",
        finishReason: "Motivo di completamento",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per lo streaming AI",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri di richiesta non valida forniti",
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
          description: "Errore di rete si è verificato durante lo streaming",
        },
        forbidden: {
          title: "Accesso negato",
          description: "L'accesso allo streaming AI è vietato",
        },
        notFound: {
          title: "Non trovato",
          description: "AI non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description:
            "Ci sono cambiamenti non salvati che devono essere salvati prima",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Il conflitto di dati si è verificato durante lo streaming",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Il flusso di AI generato con successo",
      },
    },
    enums: {
      role: {
        user: "Utente",
        assistant: "Assistente aggiunto",
        system: "Sistema",
      },
    },
    streamingErrors: {
      aiStream: {
        error: {
          apiKey: {
            missing: "Manca la chiave OpenAI API",
            invalid: "La chiave OpenAI API non è valida",
          },
          configuration: "Errore di configurazione di streaming AI",
          processing: "Elaborazione errori AI stream",
        },
      },
    },
    debugView: {
      systemPromptTitle: "Prompt di sistema",
      copied: "Copiato!",
    },
    errorTypes: {
      streamError: "Errore di streaming",
    },
    errorThread: {
      title: "Errore",
    },
    error: {
      title: "Errore di streaming",
    },
    wakeUp: {
      revivalPrompt:
        "Il compito asincastro che hai inviato ha completato. Il risultato è nel messaggio di strumento sopra. Si prega di riassumere ciò che il compito restituito per me.",
      revivalInstructions:
        "WAKE - UP REVIVAL MODE: Un compito asincastro è stato completato e il risultato è nel thread. Rispondere all'ultimo messaggio dell'utente sommando il risultato dello strumento - solo 1-3 frasi. Do NOT chiama qualsiasi strumento. Do NOT riesegui la richiesta dell'utente originale.",
    },
    info: {
      streamInterrupted:
        "La generazione e' stata fermata. La risposta parziale è stata salvata.",
    },
    errors: {
      toolExecutionError:
        "Uno strumento non è riuscito a eseguire correttamente. Per favore, riprovate.",
      toolExecutionErrorDetail: "Errore dello strumento: {{error}}",
      toolExecutionFailed:
        "L'esecuzione degli strumenti è fallita. Per favore, riprovate.",
      toolDisabledByUser:
        "Questo strumento è stato disabilitato dall'utente. Non cercare di chiamarlo di nuovo.",
      userDeclinedTool: "L'esecuzione degli strumenti è stata annullata.",
      streamError:
        "La risposta AI non è riuscita a completare. Per favore, riprovate.",
      pendingToolCall:
        "Uno strumento è ancora in esecuzione in background. Si prega di aspettare che si completa prima di continuare.",
      streamProcessingError:
        "Non è riuscito a elaborare la risposta AI. Per favore, riprovate.",
      timeout:
        "Lo AI ha impiegato troppo tempo per rispondere (tempo dopo i secondi {{maxDuration}}). Si prega di riprovare con un messaggio più breve.",
      noResponse: "Lo AI non ha generato una risposta. Per favore, riprovate.",
      modelUnavailable:
        "Attualmente non è disponibile il modello AI selezionato. Si prega di provare un modello diverso.",
      rateLimitExceeded:
        "Troppe richieste. Per favore, aspetta un momento e riprova.",
      insufficientCredits:
        "Non bastano i crediti per completare questa richiesta.",
      connectionFailed:
        "Non è riuscito a connettersi al servizio AI. Si prega di controllare la connessione e riprovare.",
      invalidRequest:
        "Richiesta non valida. Si prega di controllare il vostro input e riprovare.",
      compactingStreamError:
        "Limite di testo raggiunto - la conversazione è troppo lunga per compattazione automatica. Prova a ramificarsi da un messaggio precedente, passando a un modello con una finestra di contesto più grande, o regolando la finestra di contesto nelle impostazioni preferite.",
      compactingStreamErrorExpensive:
        "Limite di contesto raggiunto (token {{tokens}}). L'espansione della finestra di contesto è possibile, ma può essere costoso. Provare a ramificarsi da un messaggio precedente o modelli di commutazione prima.",
      compactingException:
        "Non è riuscito a una storia di conversazione compatta. Prova a ramificarsi da un punto precedente nella conversazione o passare a un modello diverso.",
      compactingRebuildFailed:
        "Non è riuscito a ricostruire la conversazione dopo la compattazione. Prova a rammentare da un messaggio precedente.",
      unexpectedError:
        "Si è verificato un errore inaspettato: {{error}}. Per favore, riprovate.",
    },
    headless: {
      errors: {
        // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
        // Either pass model+skill directly, or pass favoriteId pointing to a favorite
        // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
        missingModelOrSkill:
          "modello o abilità richieste - passare uno direttamente o fornire un favoriteId con una selezione di modelli risolvibile",
        favoriteNotFound:
          "Preferito non trovato o non appartiene a questo utente",
      },
    },
    resumeStream: {
      post: {
        title: "Riprendi il flusso AI",
        description:
          "Continuare un filo esistente eseguendo una curva AI senza testa. Utilizzato dopo un'attività remota asincrona completa (callbackMode =wait o wakeUp). Passare favoriteId per caricare modello+skill in un solo colpo, o impostare modelId + skillId esplicitamente.",
        fields: {
          threadId: {
            title: "File ID",
            description: "UUID del filo esistente per continuare.",
          },
          favoriteId: {
            title: "ID preferito",
            description:
              "UUID di un favorito salvato per caricare modello e abilità da. Sovrascrive modelId / skillId quando entrambi sono impostati.",
          },
          modelId: {
            title: "Modello ID",
            description:
              "Modello AI da utilizzare per la svolta ripresa. Facoltativo quando viene fornito favoriteId.",
          },
          skillId: {
            title: "ID della skill",
            description:
              "Competenze/persona per la curva ripresa. Facoltativo quando viene fornito favoriteId.",
          },
          callbackMode: {
            title: "Modalità di callback",
            description:
              "Modalità di callback dalla chiamata degli strumenti originari (wait o wakeUp). Determina il comportamento di ripresa.",
          },
          wakeUpToolMessageId: {
            title: "Messaggio dello strumento di WakeUp ID",
            description:
              "ID del messaggio originale della chiamata strumento con il risultato riempito di backup.",
          },
          wakeUpTaskId: {
            title: "Attività di WakeUp ID",
            description:
              "ID dell'attività di cron remoto originario, cancellato dopo la rinascita.",
          },
          resumeTaskId: {
            title: "Riprendi il compito ID",
            description:
              "ID di questo compito cron a monte del curriculum stesso, cancellato dopo la rinascita.",
          },
          resumed: {
            title: "Risoluzioni",
            description: "Se il filo è stato continuato con successo.",
          },
          lastAiMessageId: {
            title: "Ultimo messaggio AI ID",
            description:
              "UUID del messaggio di assistente finale generato. Null se non è stato prodotto alcun messaggio.",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description:
              "Parametri non validi - threadId deve essere un valido UUID",
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
            description: "Filo o modello non trovato",
          },
          internal: {
            title: "Errore del server",
            description: "Errore interno durante il curriculum del flusso",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Discussione di cambiamenti non risolti",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato il conflitto",
          },
        },
        success: {
          title: "Stream Resumed",
          description: "Il filo AI è stato continuato con successo",
        },
      },
    },
    providers: {
      uncensoredHandler: {
        errors: {
          apiError: "Errore API di Uncensored.ai ({{status}}): {{errorText}}",
        },
      },
    },
    onboarding: {
      back: "Indietro",
      welcome: {
        title: "Uno AI per tutto. Quello giusto per ogni cosa.",
        line1:
          "Un compagno per la conversazione quotidiana. Specialisti per codifica, ricerca, scrittura - si sceglie uno quando il compito lo richiede.",
        line2:
          "Stessa chiacchierata. Se cambia quando conta. Ci vogliono secondi.",
        line3: "Facciamo in modo che tu ti metta in mezzo tra un minuto.",
        continue: "Iniziare",
      },
      guest: {
        title: "Stai navigando come ospite",
        line1:
          "Le impostazioni, il compagno e la cronologia delle chat vengono salvate localmente solo su questo dispositivo.",
        line2:
          "Iscriviti per mantenere tutto sincronizzato tra i dispositivi e assicurarsi di non perdere mai la configurazione.",
        signIn: "Accedi / Crea account",
        continueAnyway: "Continuare come ospite",
        note: "È possibile accedere più tardi dal menu in qualsiasi momento.",
      },
      companion: {
        title: "Scegli il tuo compagno",
        subtitle: "Il tuo partner principale per la chat di uso quotidiano",
        modelTitle: "Quale modello dovrebbe alimentarlo?",
        customSetup: "Installazione avanzata →",
        next: "Avanti",
        selectFirst: "Scegli un compagno per continuare",
      },
      usecases: {
        title: "Per cosa lo userai per lo più?",
        subtitle:
          "Aggiungiamo automaticamente gli specialisti giusti al toolkit di AI.",
        saving: "Prepararsi...",
        start: "Avviare la chat",
        hintNoneSelected:
          "Seleziona le aree per impostare competenze specialistiche, o tocca Inizia a saltare",
        noProviderAvailable:
          "Nessun fornitore IA configurato. Aggiungi OPENROUTER_API_KEY o abilita Claude Code (CLAUDE_CODE_ENABLED=true) per continuare.",
        coding: {
          label: "Codifica e tecnologia",
          hint: "Vibe Coder, Coder",
        },
        research: {
          label: "Ricerca e analisi",
          hint: "Ricercatore, Data Analyst",
        },
        writing: {
          label: "Scrivere e modificare",
          hint: "Scrittore, Editor",
        },
        business: {
          label: "Affari e Strategia",
          hint: "Business Advisor, Product Manager",
        },
        learning: {
          label: "Imparare e studiare",
          hint: "Tutor, interrogatore socratico",
        },
        creative: {
          label: "Creativo e Storie",
          hint: "Storyteller, Creativo",
        },
        health: {
          label: "Salute e cura",
          hint: "Salute benessere, Career Coach",
        },
        controversial: {
          label: "Pensare gratis",
          hint: "Uncensored, Filosofia",
        },
        roleplay: {
          label: "Recitare un ruolo e personaggi",
          hint: "Recitare un ruolo, Creatore di caratteri",
        },
      },
    },
    input: {
      placeholder: "Invia un messaggio...",
      imagePlaceholder: "Descrivi un'immagine per generare...",
      audioPlaceholder: "Descrivere audio o musica per generare...",
      noPermission: "Non hai il permesso di postare qui",
      keyboardShortcuts: {
        enter: "Inserisci",
        toSend: "per l'invio",
        shiftEnter: "Shift+Enter",
        forNewLine: "per la nuova linea",
        ctrlV: "Ctrl+V",
        orPasteFiles: "o incollare file",
      },
      speechInput: {
        transcribing: "Transcribing...",
      },
      attachments: {
        uploadFile: "File di aggancio",
        attachedFiles: "File allegati",
        addMore: "Aggiungi altro",
      },
    },
    imageGen: {
      sizeSquare: "Piazza (1024×1024)",
      sizeLandscape: "Paesaggio (1792×1024)",
      sizePortrait: "Ritratto (1024×1792)",
      qualityStandard: "Standard",
      qualityHD: "HD",
    },
    audioGen: {
      durationShort: "Breve (~8s)",
      durationMedium: "Medio (~15s)",
      durationLong: "Lungo (~30s)",
    },
    voiceMode: {
      unconfiguredTitle: "Voce non configurata",
      unconfiguredDescription:
        "Il testo-to-speech non è disponibile per questa abilità.",
      callMode: "Modalità di chiamata",
      callModeDescription: "AI risponderà con la voce",
      tapToRecord: "Toccare per registrare",
      recording: {
        paused: "Paused",
        resume: "Ripresa",
        pause: "Pause",
      },
      callOverlay: {
        listening: "Ascoltare...",
      },
      actions: {
        cancel: "Annulla",
        toInput: "Input",
        sendVoice: "Invia la voce",
        retry: "Recuperare",
        download: "Scarica Audio",
        downloadHint:
          "Scaricare il file e collegarlo al tuo prossimo messaggio invece.",
      },
    },
    actions: {
      cancellingGeneration: "Cancelliere...",
      stopGeneration: "Fermati.",
      sendMessage: "Invia",
    },
    toolsButton: {
      title: "Strumenti AI",
      tools: "Strumenti",
    },
  },
  chat: {
    category: "Chat",
    tags: {
      threads: "Conversazioni",
      folders: "Cartelle",
      files: "File",
      messages: "Messaggi",
      characters: "Skill",
      memories: "Memoria",
      favorites: "Preferiti",
      credits: "Crediti",
      balance: "Saldo",
      permissions: "Permissioni",
      hotkey: "Hotkey",
      cli: "CLI",
      speech: "Discorso",
      sharing: "Condividere",
      settings: "Impostazioni",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Privato",
        shared: "Condividi",
        public: "Pubblico",
        incognito: "Incognito",
        background: "Sfondo",
        remote: "Telecomando",
      },
      foldersShort: {
        private: "Privato",
        shared: "Condividi",
        public: "Pubblico",
        incognito: "Incognito",
        background: "Sfondo",
        remote: "Telecomando",
      },
    },
    enums: {
      role: {
        user: "Utente",
        assistant: "Assistente aggiunto",
        system: "Sistema",
        tool: "Strumento",
        error: "Errore",
      },
      threadStatus: {
        active: "Attivo",
        archived: "Archivio",
        deleted: "Cancellato",
      },
      viewMode: {
        linear: "Lineare",
        threaded: "Discussione",
        flat: "Appartamento",
        debug: "Debug",
      },
    },
    components: {
      sidebar: {
        login: "Accedi",
        logout: "Esci",
        footer: {
          account: "Account",
          profile: "Profilo",
          balance: "Saldo",
          buy: "Acquistare",
          freeCreditsLeft: "Crediti gratuiti",
        },
      },
      credits: {
        credit: "{{count}} credito",
        credits: "{{count}} crediti",
      },
      navigation: {
        subscription: "Abbonamento e crediti",
        referral: "Programma inviti",
        help: "Aiuto",
        about: "Chi siamo",
      },
      confirmations: {
        deleteMessage: "Vuoi eliminare questo messaggio?",
      },
      welcomeTour: {
        authDialog: {
          title: "Sblocca cartelle private e condivise",
          description:
            "Registrati o accedi per accedere a cartelle private e condivise. Le tue chat si sincronizzano tra i dispositivi.",
          continueTour: "Continua a leggere",
          signUp: "Iscriviti / Accedi",
        },
        buttons: {
          back: "Indietro",
          close: "Chiudi",
          last: "Finitura",
          next: "Avanti",
          skip: "Salta.",
        },
        welcome: {
          title: "Benvenuto a {{appName}}!",
          description:
            "La tua piattaforma AI per la privacy con i modelli {{modelCount}}, il filtraggio dei contenuti controllato dall'utente e i principi di linguaggio libero.",
          subtitle: "Facciamo un giro veloce per iniziare.",
        },
        aiCompanion: {
          title: "Scegli il tuo Companion AI",
          description:
            "Selezionare dai modelli {{modelCount}} AI, comprese le opzioni tradizionali, open source e non censurate.",
          tip: "Fare clic per aprire il selettore modello e scegliere il tuo compagno.",
        },
        rootFolders: {
          title: "Le tue cartelle di chat",
          description:
            "Organizza le tue chat in diverse cartelle, ognuna con impostazioni privacy uniche:",
          private: {
            name: "Privato",
            suffix: ",  solo tu puoi vedere",
          },
          incognito: {
            name: "Incognito",
            suffix: ",  nessuna storia salvata",
          },
          shared: {
            name: "Condividi",
            suffix: ",  collaborare con altri",
          },
          public: {
            name: "Pubblico",
            suffix: ",  visibile a tutti",
          },
        },
        privateFolder: {
          name: "Privato",
          suffix: "Cartella",
          description:
            "Le tue chat private sono visibili solo a te. Perfetto per argomenti sensibili.",
        },
        incognitoFolder: {
          name: "Incognito",
          suffix: "Cartella",
          description:
            "Chatta senza salvare la cronologia al server. I messaggi vengono memorizzati localmente nel vostro browser e persistono fino a quando non li si cancella.",
          note: "Nessun dato viene memorizzato sui nostri server durante le sessioni incognito (i supporti generati vengono memorizzati temporaneamente per motivi tecnici).",
        },
        sharedFolder: {
          name: "Condividi",
          suffix: "Cartella",
          description:
            "Collabora con persone specifiche condividendo l'accesso a questa cartella.",
        },
        publicFolder: {
          name: "Pubblico",
          suffix: "Cartella",
          description:
            "Condividi le tue conversazioni AI con il mondo. Altri possono visualizzare e forcellare i fili.",
          note: "Tutto in pubblico è visibile a tutti gli utenti e motori di ricerca.",
        },
        newChatButton: {
          title: "Avviare una nuova chat",
          description:
            "Clicca qui per avviare una nuova conversazione in qualsiasi cartella.",
        },
        sidebarLogin: {
          title: "Accedi per sbloccare di più",
          description:
            "Creare un account gratuito per accedere a cartelle private e condivise, sincronizzare la cronologia delle conversazioni tra i dispositivi e lasciare che lo AI ricordi cose su di te.",
          tip: "E' libero di iscriversi!",
        },
        subscriptionButton: {
          title: "Credits & Abbonamento",
          description:
            "Ottieni crediti {{credits}}/mese con un abbonamento per soli {{price}} /mese. Conti gratuiti ottengono crediti {{freeCredits}}/mese, {{freeCreditsMax}} con la newsletter.",
        },
        chatInput: {
          title: "Digitare il messaggio",
          description:
            "Digitare il messaggio qui e premere Invio o fare clic Invia a chattare con il tuo compagno AI.",
          tip: "Usa Shift+Enter per una nuova linea. È inoltre possibile allegare file e immagini.",
        },
        voiceInput: {
          title: "Input di voce",
          description: "Usa il microfono per parlare al tuo compagno AI:",
          options: {
            transcribe: "Trascrivere il discorso al testo",
            sendAudio: "Invia l'audio direttamente alla AI",
            pauseResume: "Pausa e ripresa della registrazione",
          },
        },
        callMode: {
          title: "Modalità di chiamata",
          description:
            "Attiva la modalità chiamata per un'esperienza di conversazione basata sulla voce e senza mani con risposte AI in tempo reale.",
          tip: "Perfetto per quando sei in viaggio o preferisci parlare sopra digitando.",
        },
        complete: {
          title: "Sei tutto pronto!",
          description:
            "Hai completato il tour! Inizia a chattare con il tuo compagno AI ora.",
          help: "Ti serve aiuto? Fare clic sull'icona del punto interrogativo nella barra laterale in qualsiasi momento.",
        },
        authUnlocked: {
          unlocked: "Sbloccato!",
          privateDescription:
            "La tua cartella privata è ora disponibile. Tutte le chat qui sono visibili solo a voi.",
          privateNote:
            "Le chat private si sincronizzano automaticamente su tutti i dispositivi.",
          sharedDescription:
            "La cartella condivisa è ora disponibile. Invita gli altri a collaborare alle conversazioni AI.",
          sharedNote:
            "Si controlla chi ha accesso alle cartelle e filetti condivisi.",
        },
      },
    },
    selector: {
      loading: "Caricamento...",
      best: "La migliore corrispondenza",
      free: "FREE",
      creditsSingle: "1 credito",
      creditsExact: "{{cost}} crediti",
      modelOnly: "Solo modello",
      editModelSettings: "Modifica delle impostazioni del modello",
      editSettings: "Modifica delle impostazioni",
      switchSkill: "Cambia skill",
      editSkill: "Modifica skill",
      delete: "Elimina",
      autoSelectedModel: "FILTER-BASED",
      manualSelectedModel: "MANUALLY SELECTED",
      intelligence: "Intelligenza",
      contentFilter: "Contenuti",
      maxPrice: "Prezzo massimo",
      modelSelection: "Selezione del modello",
      autoModeDescription:
        "Il modello migliore è selezionato in base ai filtri",
      manualModeDescription: "Scegli un modello specifico manualmente",
      autoMode: "Filtro a base",
      manualMode: "Manuale",
      allModelsCount: "Tutti i modelli {{count}}",
      filteredModelsCount: "I modelli {{count}} corrispondono ai filtri",
      showFiltered: "Mostra solo i risultati filtrati",
      showAllModels: "Mostra tutti i modelli",
      showLess: "Mostra meno",
      showMore: "Mostra {{remaining}} di più",
      showLegacyModels_one: "Mostra il modello Legacy {{count}}",
      showLegacyModels_other: "Mostra {{count}} modelli precedenti",
      noMatchingModels: "Nessun modello di corrispondenza",
      noModelsWarning: "Nessun modello corrisponde ai filtri",
      useOnce: "Usare una volta",
      saveAsDefault: "Aggiungi ai preferiti",
      deleteSetup: "Eliminare Impostazione",
      content: "Contenuto di ricerca...",
      characterSetup: "Configurazione della skill",
      noResults: "Nessun risultato",
      add: "Aggiungi ai preferiti",
      added: "Aggiunto",
      addNew: "Aggiungi nuovo",
      searchSkills: "Competenze di ricerca...",
      createCustom: "Creare personalizzato",
      customizeSettings: "Personalizzare le impostazioni",
      requirements: {
        characterConflict: "Requisiti di abilità conflitti",
        tooLow: "troppo basso",
        tooHigh: "troppo alto",
        min: "min min min",
        max: "max.",
      },
    },
    common: {
      newChat: "Nuova chat",
      privateChats: "Chat private",
      search: "Cerca",
      delete: "Elimina",
      cancel: "Annulla",
      save: "Salva",
      edit: "Modifica",
      settings: "Impostazioni",
      close: "Chiudi",
      toggleSidebar: "Mostra o nascondi la barra laterale",
      lightMode: "Modalità di luce",
      darkMode: "Modalità oscura",
      searchPlaceholder: "Cerca...",
      searchThreadsPlaceholder: "Ricerca di filetti...",
      searchResults: "Risultati della ricerca",
      noChatsFound: "Nessuna chat trovata",
      noThreadsFound: "Nessun thread trovato",
      enableTTSAutoplay: "Abilita il gioco automatico TTS",
      disableTTSAutoplay: "Disattivare l'autoplay TTS",
      selector: {
        country: "Paese",
        language: "Lingua",
      },
      copyButton: {
        copied: "Copiato!",
        copyToClipboard: "Copia a clipboard",
        copyAsMarkdown: "Copia come Markdown",
        copyAsText: "Copia come testo",
      },
      assistantMessageActions: {
        cancelLoading: "Annulla carico",
        stopAudio: "Ferma l'audio",
        playAudio: "Gioca audio",
        answerAsAI: "Rispondi come modello IA",
        deleteMessage: "Cancella messaggio",
      },
      characterSelector: {
        placeholder: "Selezionare l'abilità",
        addNewLabel: "Creare abilità personalizzate",
        grouping: {
          bySource: "Per la fonte",
          byCategory: "Per categoria",
          sourceLabels: {
            builtIn: "Costruito",
            my: "Le mie abilità",
            community: "Comunità europea",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Crea una skill personalizzata",
          fields: {
            name: {
              label: "Nome",
              placeholder: "Inserisci il nome dell'abilità",
            },
            icon: {
              label: "Icona (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Designazione",
              placeholder: "Breve descrizione dell'abilità",
            },
            systemPrompt: {
              label: "Prompt di sistema",
              placeholder: "Definire come l'abilità si comporta...",
            },
            category: {
              label: "Categoria",
            },
          },
          createCategory: "Creare Categoria",
          cancel: "Annulla",
          create: "Crea skill",
        },
        addCategoryDialog: {
          title: "Creare Categoria",
          fields: {
            name: {
              label: "Nome della categoria",
              placeholder: "Inserisci il nome della categoria",
            },
            icon: {
              label: "Icona (emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Annulla",
          create: "Creare Categoria",
        },
      },
    },
    actions: {
      newChatInFolder: "Nuova chat nella cartella",
      newFolder: "Nuova cartella",
      deleteFolder: "Elimina cartella",
      deleteMessage: "Cancella messaggio",
      deleteThisMessage: "Eliminare questo messaggio",
      searchEnabled: "Ricerca abilitata",
      searchDisabled: "Ricerca per disabili",
      answerAsAI: "Rispondi come modello IA",
      retry: "Riprova con un altro modello o un’altra skill",
      branch: "Conversazione di Branch da qui",
      editMessage: "Modifica messaggio",
      stopAudio: "Interrompere la riproduzione audio",
      playAudio: "Gioca audio",
      copyContent: "Copia a clipboard",
    },
    dialogs: {
      searchAndCreate: "Ricerca e Creare",
      deleteChat: 'Eliminare la chat " {{title}} "?',
      deleteFolderConfirm:
        'Elimina la cartella " {{name}} " e sposta la chat/i {{count}} in Generale?',
    },
    views: {
      linearView: "Vista lineare (stile ChatGPT)",
      threadedView: "Vista filettata (Stile Reddit/ Discord)",
      flatView: "Vista piana (4chan style)",
      debugView: "Vista del debito (con istruzioni di sistema)",
    },

    screenshot: {
      capturing: "Catturare...",
      capture: "Immagine di schermo di cattura",
      failed: "Non riuscito a catturare screenshot",
      failedWithMessage: "Impossibile acquisire lo screenshot: {{message}}",
      tryAgain: "Non ha catturato lo screenshot. Per favore, riprovate.",
      noMessages:
        "Non sono riuscito a trovare l'area messaggi di chat. Si prega di assicurarsi di avere messaggi nella chat.",
      quotaExceeded:
        "La quota di stoccaggio è superata. L'immagine è troppo grande.",
      canvasError: "Impossibile convertire lo screenshot in un’immagine.",
    },
    errors: {
      noResponse:
        "Nessuna risposta ricevuta da AI. La richiesta è stata completata ma restituita a contenuto vuoto. Per favore, riprovate.",
      noStream: "Risposte in streaming: Nessun lettore disponibile",
      saveFailed: "Non è riuscito a salvare la modifica",
      branchFailed: "Non ha fatto il ramo",
      retryFailed: "Non ho fatto ariete",
      answerFailed: "Non ho risposto",
      deleteFailed: "Non è stato possibile eliminare",
    },
    errorTypes: {
      streamError: "Errore di streaming",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "Punto finale vocale-testo non disponibile",
        "failed-to-start": "Non è possibile avviare la registrazione",
        "permission-denied":
          "L'accesso al microfono bloccato. Consentire microfono nelle impostazioni del browser e ricaricare la pagina.",
        "permission-denied-ios":
          "Microfono bloccato. Vai a Impostazioni → Safari → Microfono e consentire l'accesso per questo sito.",
        "permission-denied-android":
          "Microfono bloccato. Toccare l'icona di blocco nella barra degli indirizzi → Impostazioni del sito → Microfono → Consentire.",
        "permission-denied-mac":
          "Microfono bloccato. Impostazioni di sistema aperte → Privacy & Security → Microfono e abilitare il browser.",
        "permission-denied-windows":
          "Microfono bloccato. Impostazioni aperte → Privacy → Microfono e assicurarsi che il browser è consentito.",
        "no-microphone":
          "Nessun microfono trovato. Collegare un microfono o un auricolare e riprovare.",
        "microphone-in-use":
          "Il microfono viene utilizzato da un'altra app. Chiudilo e riprova.",
        "not-supported":
          "Il tuo browser non supporta l'accesso al microfono. Prova Chrome, Firefox o Safari.",
        "transcription-failed": "Non è riuscito a trascrivere l'audio",
        "audio-too-short":
          "Registrazione troppo breve. Tenere il microfono e parlare chiaramente, poi riprovare.",
      },
      tts: {
        "endpoint-not-available": "Fine-speech non disponibile",
        "failed-to-play": "Non è riuscito a riprodurre l'audio",
        "conversion-failed": "La conversione di TTS è fallita",
        "failed-to-generate": "Non è riuscito a generare audio",
      },
    },
    post: {
      title: "Chat",
      description: "Interfaccia di chat",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "UncensoredLM è il modello di uncensored.ai. Gli altri modelli di questa fascia restano quelli convenzionali, modificati per farli rispondere: stesso addestramento, stessa visione del mondo. UncensoredLM è stato addestrato su libri e documenti banditi dall’internet mainstream. Da qui le sue posizioni politiche controcorrente. Sceglilo per esplorare idee diverse o per scrivere narrativa cupa e tabù, senza scene edulcorate, lezioni morali o richiami al consenso. Usa strumenti, ha 32K di contesto e lavora solo con il testo. È sperimentale e poco adatto al codice. Presenta le affermazioni controverse con la stessa sicurezza dei fatti accertati: verifica le fonti.",
        freedomgptLiberty:
          "Il modello senza censura di punta di Age of AI, il chatbot per la libertà di parola che ha aperto la strada alla categoria. Usa pesi aperti e risponde senza giri di parole né lezioni morali. Rapido e sveglio, con 32K di contesto. Per strumenti, codice e analisi approfondite è più forte Qwen 3.6 Plus Uncensored. Per una prospettiva diversa scegli UncensoredLM.",
        gabAiArya:
          "L’assistente senza censura di Gab. I suoi autori gli hanno dato un orientamento politico di destra e una risposta diretta anche sui temi spinosi. Intelligente, con 131K di contesto. Legge immagini e video e usa strumenti. Sceglilo se cerchi quella prospettiva: UncensoredLM è l’altro modello con una visione propria. Meno adatto al codice. Gab tiene riservato il modello di base.",
        gemini31ProPreviewCustomTools:
          "L'anteprima degli strumenti personalizzati di Gemini 3.1 Pro, sintonizzato per chiamare gli strumenti che definisci invece di cadere indietro a bash. Costruito per agenti di codifica e flussi di lavoro multi-tool, con contesto 1M e testo, immagine, video e ingresso audio. Una costruzione di anteprima. Gemini 4 Argon è il nuovo modello di classe Pro ad un prezzo simile.",
        gemini31FlashImagePreview:
          "Google 's Gemini 3.1 Flash Image, ancora in anteprima. Genera e modifica le immagini direttamente nella chat, testo e immagini nella stessa risposta. Il modello di immagine più economico del catalogo. Filtri a monte principale, nessuna chiamata degli strumenti, 64K contesto. Per i suggerimenti complessi e il testo più pulito all'interno delle immagini, Nano Banana Pro costa di più e offre di più. Legacy: Nano Banana 2.1 lo sostituisce a circa la metà del prezzo dell'immagine.",
        gemini31FlashLitePreview:
          "Il modello di budget high-volume di Google, ancora in anteprima: traduzione, classifica, estrazione e chat rapida sul contesto 1M, con testo, immagine, video e ingresso audio. Economico e veloce, non costruito per ragionamento duro. Costa ancora meno del suo successore, Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro - Modello avanzato multimodale AI con grande finestra di contesto e potenti capacità di ragionamento",
        gemini35Flash:
          "Il modello Flash di Google è stato lanciato a codifica e ragionamento quasi Pro, con livelli di pensiero regolabili, contesto 1M e testo, immagine, ingresso video e audio. Solido, ma Gemini 3.8 Flash è più nuovo e circa la metà del prezzo, quindi passare.",
        gemini3Flash:
          "Google è il primo flash Gemini 3: veloce e capace a codificare e ragionare ogni giorno, con contesto 1M e testo, immagine, video e ingresso audio. Ancora buon valore e più economico del suo successore. Gemini 3.8 Flash è l'opzione più recente se si desidera l'ultima.",
        deepseekV32:
          "DeepSeek 's tardo-2025 modello open-weight con scarsa attenzione che rende il lavoro a lungo-contesto più economico. Un mix-of-expert 671B, buono a codifica e analisi per pochissimi soldi, solo testo. DeepSeek V4.1 Flash è più recente e costa ancora meno.",
        deepseekV4Pro:
          "DeepSeek 's a punta aperta: un mix-of-expert da 1,6T con 49B attivo, MIT concesso in licenza. Profondo ragionamento, codice serio, analisi intercodice e lavoro agente multi-step, contesto 1M, strumenti di chiamata. Solo un messaggio. Una frazione del prezzo di Claude Opus 5.5. Per il lavoro quotidiano a buon mercato, DeepSeek V4.1 Flash è il fratello.",
        deepseekV4Flash:
          "DeepSeek 284B miscela-of-experts Modello flash: 1M contesto, veloce, forte a codifica, vicino-zero costo per messaggio. Solo un messaggio. Il suo successore DeepSeek V4.1 Flash costa lo stesso, quindi spostatevi a meno che non avete bisogno di questa versione esatta.",
        gpt55:
          "L'ex modello generale di OpenAI: forte ragionamento, codifica e analisi sul contesto 1M, con ingresso testo e immagine. Ancora in grado, ma premium-prezzo, e GPT-6.1 Sol ora fa gli stessi lavori per molto meno. Punto debole: gioco di ruolo.",
        gpt55Pro:
          "Il tier Pro a lungo termine di GPT-5.5, costruito per spendere molto più compute su problemi duri e di alto livello. Uno dei modelli più costosi del catalogo, vale la pena solo quando una risposta sbagliata costa più del messaggio. GPT-6 Astra è la scelta più recente a circa un terzo del prezzo.",
        gpt54Pro:
          "La variante Pro massima di GPT-5.4 per ragionamenti duri, ricerche e analisi ad alto livello sul contesto 1M. Lenta, e tra i modelli priciest qui. GPT-6 Astra copre lo stesso terreno per circa un terzo del prezzo.",
        gpt54:
          "Il modello OpenAI che ha piegato la codifica Codex-grade nella linea principale GPT, con contesto 1M e ingresso immagine. Solido per documenti lunghi, codice e analisi. GPT-6.1 Sol è più recente, valutato un livello più alto e più economico per messaggio, quindi c'è poca ragione di rimanere.",
        gpt53Codex:
          "Specialista di codifica agentec di OpenAI: sessioni di sviluppo lunghe e pesanti, refattori e debug, con contesto 400K. Forte al codice, debole alla scrittura creativa e gioco di ruolo. GPT-6.1 Sol ora gestisce la codifica ad un prezzo simile e fa di più oltre.",
        gpt53Chat:
          "GPT-5.3 Chat - Aggiornato modello di conversazione ChatGPT che fornisce risposte più accurate e contestuali con rifiuti e grotte non necessari significativamente ridotti",
        gpt52Pro:
          "GPT-5.2 con ragionamento esteso per i problemi più difficili: ricerca profonda, matematica difficile, recensione codice accurata. Piano e molto costoso. GPT-6 Astra è l'attuale scelta della classe Pro e costa ben meno della metà.",
        gpt52:
          "Cavallo da lavoro a fine 2025 di OpenAI per compiti professionali: codifica, documenti lunghi e analisi strutturata, con contesto 400K e ingresso immagine. Affidabile, ma non più il valore scelto. GPT-6.1 Sol costa circa lo stesso ed è più recente.",
        gpt52_chat:
          "La variante rapida, ChatGPT -style di GPT-5.2: risposte conversazionali senza pensiero lungo, contesto 128K. Buon per la chat di tutti i giorni e la redazione. Meno contesto dei suoi fratelli, e GPT-6.1 Terra ora fa questo lavoro per circa la metà del prezzo.",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Modello linguistico non censurato basato su Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Modello in lingua grande non censurato basato su Llama 3",
        veniceUncensored:
          "Il modello senza censura di Venice, basato su Dolphin Mistral 24B. Ha uno dei tassi di rifiuto più bassi ed è adatto alla narrativa e alla chat senza filtri. Legge immagini, ha 128K di contesto e costa poco. Elimina i rifiuti, preservando la prospettiva di Mistral sulla politica e sulle scene più cupe. Per una prospettiva diversa scegli UncensoredLM. Per codice e analisi approfondite, prova Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "Il modello 24B di Venice per il gioco di ruolo, addestrato a rispondere senza rifiuti. I personaggi restano coerenti anche nelle campagne lunghe, senza lezioni morali nel mezzo della storia. Legge immagini e ha 128K di contesto. Conserva la prospettiva del modello di base. UncensoredLM va oltre sui temi più cupi e tabù, mentre questa variante spicca nelle campagne lunghe e con input di immagini. Pensato per narrare. Per codice e analisi, scegli un altro modello.",
        gemma4Uncensored:
          "Gemma 4 26B di Google, con architettura a miscela di esperti e filtri rimossi, su Venice. Veloce ed economico. Legge immagini, usa strumenti e ha 256K di contesto. Risponde ai temi spinosi, preservando l’addestramento e la prospettiva di Google. Per un ragionamento più profondo senza rifiuti, GLM 5.3 Flash Uncensored costa poco di più.",
        qwen36PlusUncensored:
          "Il modello di ragionamento Qwen 3.6 Plus di Alibaba, con i rifiuti rimossi, su Venice. Tra i modelli senza censura più forti per codice e analisi. Legge immagini, usa strumenti e ha 256K di contesto. Risponde liberamente e conserva l’addestramento e la prospettiva di Qwen. Per una lettura politica diversa scegli UncensoredLM. Costa più dei modelli Flash. L’altra opzione potente è GLM 5.3 Uncensored, con 1M di contesto e solo testo.",
        glm47FlashHeretic:
          "GLM 4.7 Flash con il comportamento di rifiuto rimosso tramite abliteration. Risponde direttamente, usa strumenti e costa pochi spiccioli a messaggio. Rapido per la chat senza filtri e la scrittura creativa. Conserva l’addestramento e la visione del GLM di base. Debole nell’analisi approfondita. GLM 5.3 Flash Uncensored ragiona meglio e costa poco di più.",
        glm53Abliterated:
          "GLM 5.3 completo con i rifiuti tagliati fuori dai pesi da Abliteration.ai. ragionamento anteriore, strumenti, contesto 1M. Il colpo pesante. Nessun rifiuto, ma la formazione e l'inquadratura di base GLM rimangono.",
        deepseekV41FlashAbliterated:
          "Abliteration.ai senza rifiuto DeepSeek V4.1 Flash. 552B MoE, motivi duri, legge immagini, strumenti di chiamata. 1M contesto. Si smette di dire no; il proprio inquadratura di DeepSeek rimane.",
        mimoV26FlashAbliterated:
          "MiMo V2.6 Flash di Xiaomi con la tendenza al rifiuto rimossa tramite abliteration. Veloce, legge immagini, usa strumenti e ha 1M di contesto. Adatto a grandi volumi di lavoro senza filtri. Privilegia la velocità rispetto alla profondità e conserva la prospettiva del modello di base. Costa più del doppio di GLM 5.3 Flash Uncensored, con capacità simili.",
        glm53Uncensored:
          "Il modello di ragionamento GLM 5.3 completo di Z.AI, con i rifiuti rimossi. Una delle opzioni più potenti senza censura per codice, scrittura lunga e analisi. Usa strumenti e ha 1M di contesto. Conserva l’addestramento e la visione politica del GLM originale. Per posizioni politiche controcorrente scegli UncensoredLM. Solo testo, più lento dei modelli Flash e ancora sperimentale. Per tutti i giorni, GLM 5.3 Flash Uncensored è più veloce ed economico.",
        glm53FlashUncensored:
          "GLM 5.3 Flash di Z.AI con i rifiuti rimossi. Usa una combinazione di esperti da 320B, legge immagini, chiama strumenti e ha 1M di contesto. Rapido ed economico per lavorare ogni giorno senza filtri. Risponde anche sui temi spinosi e conserva l’addestramento e la visione politica del GLM originale. UncensoredLM offre una prospettiva diversa. Per il ragionamento più difficile scegli GLM 5.3 Uncensored.",
        veniceLustifyV8:
          "Un checkpoint SDXL sintonizzato per immagini fotoreali per adulti, servito da Venice.ai. Senza censura: niente sfocatura, nessun rifiuto. Tra i modelli di immagine più economici che offriamo. Costruito per i corpi e la pelle, non per il testo in immagini, scene complesse o stili d'arte; Chroma ha più gamma artistica.",
        veniceChroma:
          "Un modello open-weight costruito su FLUX.1 schnell e riqualificato senza filtraggio dei contenuti, servito da Venice.ai. Maniglie lunghe richieste e una vasta gamma di stili d'arte, contenuti espliciti inclusi. A buon mercato per immagine. Meno specializzato nella nudità fotoreale di Lustify v8, e testo in solo, quindi utilizzare Qwen Edit Uncensored per rielaborare un'immagine esistente.",
        veniceQwenEdit:
          "Montaggio di immagini non censurato costruito sul modello Qwen di Alibaba, servito da Venice.ai. Dagli un'immagine di riferimento e un'istruzione: scambiare elementi, ridisegnare, cambiare outfit, rielaborare la scena. Niente sfogo, niente rifiuti. Costi più di Chroma o Lustify v8, che generano solo dal testo.",
        veniceFireredImageEdit:
          "Un editor di immagini a comando rapido servito da Venice.ai. Descrivi il cambiamento, modifica esattamente questo e lascia il resto dell'immagine da solo. Uncensored tier senza rifiuti, anche se non etichettato per l'output esplicito il modo in cui Qwen Edit Uncensored è. Stesso prezzo di Qwen Edit; su modifiche dure, provare entrambi.",
        claudeOpus45:
          "Anthropic 's Novembre 2025 Opus, un top coding e modello agente in suo giorno e il primo Opus a un prezzo molto più basso. Eccellente a scrittura accurata e codice complesso, contesto 200K. Cauzioso su argomenti controversi. Claude Opus 5.5 è più recente e più economico.",
        claudeOpus46:
          "Anthropic 's febbraio 2026 Opus, il primo Opus con una finestra di contesto 1M. Forte a lunga codifica agentica, analisi profonda e scrittura attenta. Prezzo premium, filtri tradizionali, prudente su argomenti controversi. Claude Opus 5.5 è più recente e più economico.",
        claudeOpus47:
          "Una versione Opus 2026 seduta tra 4.6 e 4.8: ragionamento profondo, codifica complessa e scrittura a forma lunga su 1M contesto. Premium-prezzo e prudente su argomenti controversi. Claude Opus 5.5 lo sostituisce e costa meno per messaggio.",
        claudeOpus48:
          "L'ultima versione Opus 4, realizzata per lunghi lavori agentici, codifica complessa e uscite molto lunghe oltre il contesto 1M, con ingresso immagine. Premium, filtrato dal mainstream, prudente su argomenti controversi. Claude Opus 5.5 è più recente e più economico.",
        claudeSonnet46:
          "Anthropic è all'inizio del 2026 Sonnet, un aggiornamento superiore a 4,5 in codifica, agenti e lavoro in stile ufficio, con contesto 1M. Filtri a valle, prudente su argomenti controversi. Claude Sonnet 5.5 lo sostituisce e costa meno per messaggio.",
        claudeHaiku45:
          "Modello piccolo di Anthropic 2025 ottobre: veloce, buono in immagini di codifica e lettura di tutti i giorni, contesto 200K. Filtri a valle, prudente su argomenti controversi. Claude Haiku 5.5 ora costa circa un decimo tanto, quindi l'interruttore è facile.",
        glm5_1:
          "Z. AI modello di codifica costruito per il lavoro a lungo raggio, lanciato come in grado di macinare su un compito per ore. Forte nella pianificazione, codifica e multi-step agente funziona, contesto 200K, solo testo, livello di contenuto aperto. GLM-5.3 è più recente e una frazione del prezzo, ma siede un livello inferiore; Kimi K3 è la più forte corrente open pick.",
        glm5: "Z. AI è il primo 2026 fiore all'aperto, costruito per la progettazione di sistemi e flussi di lavoro di agente lungo. Forte ragionamento e codifica, livello di contenuto aperto, contesto 200K, solo testo. GLM-5.3 è più recente e molto più economico, ma siede un livello inferiore sull'intelligenza; Kimi K3 è l'alternativa aperta più forte.",
        glm5Turbo:
          "Un GLM-5 più veloce sintonizzato per gli anelli dell'agente: inferenza rapida, guasto delle attività pulita e corsa duratura stabile. Buon per l'automazione degli strumenti con contesto 200K, solo testo, livello di contenuti aperto. GLM-5.3 fa un lavoro simile oggi per una frazione del prezzo.",
        glm46:
          "La versione di Z. AI del settembre 2025 che ha sollevato il contesto a 200K e migliorato l'uso di codifica e agente. Ancora un discreto bilingue tutto-rounder, livello di contenuto aperto, solo testo. GLM-5.3 è più recente e più economico.",
        glm47:
          "Z. AI 's dicembre 2025 rilascio, un solido cinese-inglese bilingue tuttofare con codifica migliore e ragionamento di 4.6. Va bene per chat, analisi e attività di agente, contesto 200K, solo testo, livello di contenuto aperto. GLM-5.3 è più recente a circa un quarto del prezzo.",
        glm47Flash:
          "Il piccolo, veloce GLM 4.7 e uno dei modelli più economici qui. Buon per chat veloce, semplici chiamate degli strumenti e lavori di testo in massa con contesto 200K. Luce sul ragionamento profondo. GLM-5.3 Flash è più recente, ma costa circa il doppio.",
        kimiK2:
          "Moonshot AI del modello open-weight di luglio 2025, un mix-of-expert da 1T-parameter che ha fatto il suo nome sull'uso e la codifica degli strumenti agentici. Livello di contenuto rapido, aperto, contesto 262K, solo testo. Non c'e' modo di pensare. Kimi K3 è la nave ammiraglia più recente a circa il doppio del prezzo.",
        kimiK2_5:
          "Moonshot's gennaio 2026 Kimi, nativamente multimodale con ingresso immagine. Forte nella codifica a lungo contenuto, trasformando gli screenshot in codice e scrittura creativa, con filtri di contenuti aperti e contesto 262K. Kimi K3 è più recente, ma costa circa il doppio.",
        kimiK2_6:
          "Kimi K2.6, di Moonshot, si è concentrato sulla codifica a lungo raggio, costruendo gli UI da suggerimenti o screenshot, e in esecuzione molti sotto-agenti in parallelo. Rapido e intelligente, ingresso immagine, contesto 262K, livello di contenuto aperto. Kimi K3 è più recente ad un prezzo più alto.",
        claudeSonnet45:
          "Anthropic 's settembre 2025 Sonnet, noto per le sessioni di codifica forte e di agente autonomo lungo. Ancora un raffinato codificatore e scrittore, con contesto 1M qui. Preoccupati di argomenti controversi, deboli in gioco di ruolo. Claude Sonnet 5.5 è più recente e più economico per messaggio.",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomo agente AI alimentato da Claude Sonnet tramite l'agente Anthropic SDK. Esegue strumenti indipendentemente con ragionamento incorporato.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Veloce agente autonomo AI alimentato da Claude Haiku tramite l'agente Anthropic SDK. Ottimizzato per la velocità con l'esecuzione degli strumenti.",
        claudeAgentOpus:
          "Claude Agent Opus - Il più potente agente AI autonomo alimentato da Claude Opus tramite l'agente Anthropic SDK. Massima intelligenza con l'esecuzione degli strumenti.",
        grok4:
          "xAI's luglio 2025 flagship, un modello di ragionamento che pensa sempre prima di rispondere. Forte a matematica, scienza e analisi, con filtri di contenuti più leggeri rispetto alla maggior parte dei modelli mainstream. Più lento che semplici modelli di chat. Grok 4.7 è l'attuale Grok, ad un prezzo più alto.",
        grok4Fast:
          "xAI vecchio sintonizzato Grok. xAI ha ritirato il poco costoso Fast Tier, quindi questo nome ora funziona Grok 4.3. Grok 4.3 prezzi. Legge immagini, strumenti di chiamata, contesto 1M, politica dei contenuti aperta. Grok 4.7 lo sostituisce e le ragioni molto più profonde per circa il doppio del prezzo di uscita. Per chat veloce a buon mercato, MiniMax M3.1 Flash o DeepSeek V4.1 Flash costa una frazione.",
        grok43:
          "Un successivo rilascio Grok 4 con ragionamento sempre attivo e contesto 1M, rivolto ai flussi di lavoro dell'agente e alla ricerca profonda. Livello di contenuto aperto, chiama strumenti, legge le immagini. Stesso prezzo di Grok 4 e più economico di Grok 4.7, il più recente scegliere quando si desidera l'ultima.",
        grok420Beta:
          "L'ex ammiraglia di xAI con una finestra di contesto 2M, la chiamata degli strumenti agentici e l'ingresso dell'immagine. Buon per documenti enormi e agente lungo funziona sotto filtri di contenuti aperti. Grok 4.7 è più recente, ma costa di più.",
        gpt5Pro:
          "GPT-5 con ragionamento esteso, risposta 2025 di OpenAI per le domande più difficili. Abbastanza, ma lenta e molto costosa per quello che ora è una generazione più vecchia. GPT-6 Astra è la moderna scelta Pro-tier e costa meno.",
        gpt5Codex:
          "GPT-5 Codex - modello di codifica specializzato OpenAI con eccezionali capacità di programmazione e tecnica",
        gpt51Codex:
          "GPT-5.1 ha sintonizzato per la codifica degli agentic nel Codex di OpenAI: lunghi loop di editing, run e fix in repository reali, con il contesto 400K. Valore equo per il codice al suo prezzo. Meno adatto per chat o scrittura aperta, e il nuovo GPT-6.1 Sol si è spostato oltre.",
        gpt51:
          "Aggiornamento di OpenAI del novembre 2025 a GPT-5, con ragionamento adattativo che pensa più a lungo solo su domande difficili e un tono conversazione più caldo. Ancora un modello generale sensibile con il contesto 400K e l'ingresso immagine. GPT-6.1 Sol è più nuovo e più affilato per un po 'più per messaggio.",
        gpt5: "OpenAI 's agosto 2025 flagship che ha unito risposte rapide e ragionamento profondo in un unico modello. Ancora un tuttofare capace per chat, scrittura e codice, con il contesto 400K e l'ingresso immagine. GPT-6.1 Sol è l'attuale scelta OpenAI: più recente e più forte per un po 'di più per messaggio.",
        gpt54Mini:
          "Il più piccolo GPT-5.4: buon ragionamento, codifica e uso degli strumenti ad un prezzo più basso, con contesto 400K e ingresso immagine. Va bene per chat di alto volume e lavoro sub-agente. GPT-6 Luna è più recente e molto più economico per messaggio, anche se sintonizzato più per velocità che profondità.",
        gpt54Nano:
          "OpenAI è il più piccolo GPT-5.4, fatto per la classificazione, l'estrazione dei dati e le chiamate sub-agenti veloci. Economico, rapido, chiama strumenti, legge le immagini. Troppo superficiale per un'analisi reale. GPT-6 Luna è la più recente scelta di budget e costa ancora meno.",
        gpt5Mini:
          "Il compatto GPT-5 per le attività quotidiane veloci: risposte brevi, riassunti, semplici chiamate degli strumenti, contesto 400K. Economico e veloce, ma sottile su analisi profonde. GPT-6 Luna è più recente e costa circa un terzo tanto.",
        gpt5Nano:
          "OpenAI è il più piccolo GPT-5 e ancora uno dei modelli più economici qui. Bene per la classificazione, il tagging e le risposte brevi a volume. Non per la codifica o l'analisi reale. GPT-6 Luna è il nuovo modello di bilancio, a un prezzo leggermente più alto.",
        gptOss120b:
          "Modello a pesi aperti di OpenAI, con 117B di parametri totali, architettura a miscela di esperti e licenza Apache 2.0. Buono nel ragionamento e nel codice a un costo minimo. Usa strumenti, ha 131K di contesto e riceve solo testo. Filtri più leggeri della linea GPT-6 di OpenAI, ma ancora presenti. GLM-5.3 ha un prezzo simile e offre 1M di contesto.",
        kimiK2Thinking:
          "La versione di ragionamento del novembre 2025 di Kimi K2, costruita per continuare a pensare attraverso centinaia di chiamate degli strumenti incatenate senza perdere il filo. Buon per la ricerca e multi-step agente lavoro a basso prezzo, livello di contenuto aperto. Testo solo e più lento della semplice K2. Kimi K3 è la scelta più recente.",
        minimaxM27:
          "Modello orientato all'agente di MiniMax per il lavoro pratico: debugging, modellazione finanziaria, generazione di documenti e corse multi-agent. Contesto intelligente ed economico 196K, solo testo, livello di contenuto aperto. MiniMax M3.1 Flash lo sostituisce: più forte, multimodale, contesto 1M e più economico.",
        mimoV2Pro:
          "Il fiore all'occhiello della linea MiMo V2 di Xiaomi, costruito per l'orchestrazione dell'agente e i lunghi flussi di lavoro di ingegneria con contesto 1M. Forte ragionamento e codifica ad un prezzo basso, solo testo, livello di contenuto aperto. MiMo V2.6 Pro è più recente e leggermente più economico.",
        glm45Air:
          "Il leggero GLM 4.5, un mix-of-expert 106B con solo 12B attivo, quindi le risposte vengono veloci e convenienti. Va bene per chat informale e semplici compiti, contesto 128K, solo testo. E' stato per il ragionamento. GLM-5.3 Flash è più recente e più economico.",
        glm45v:
          "Z. AI modello di visione costruito su GLM-4.5 -Air, un mix-of-expert 106B. Legge screenshot, grafici e foto, chat e strumenti di chiamata. Solo contesto 64K e ragionamento datato. GLM-5.3 Flash è il nuovo, più economico Z. AI pick.",
        geminiFlash25Lite:
          "Google è più economico 2025 Gemini: penny per messaggio, contesto 1M, testo, immagine, video e ingresso audio. Ottimo per il tagging di massa, la traduzione e le risposte brevi, poco profonde sul ragionamento. Gemini 3.5 Flash Lite è più recente, ma costa quasi quattro volte di più, quindi questo guadagna ancora il suo posto.",
        geminiFlash25Flash:
          "Google 2025 ibrido ragionamento Flash con un budget di pensiero controllabile, contesto 1M e testo, immagine, video e ingresso audio. Ancora un'opzione economica e veloce per i riassunti e la chat di tutti i giorni. Gemini 3.8 Flash è più recente e più intelligente, ma costa circa il doppio.",
        geminiFlash25Pro:
          "Modello di pensiero 2025 di Google con contesto 1M, forte a analisi e codice a lungo documento per il suo tempo. Ora chiaramente una generazione dietro. Gemini 4 Argon è l'attuale scelta della classe Pro, ad un prezzo piuttosto più alto.",
        deepseekV31:
          "DeepSeek 's agosto 2025 ibrido che passa tra risposte rapide e passo-passo pensare in un unico modello. Un coder a buon mercato capace costruito su un mix-of-experts di 671B, solo testo. DeepSeek V4.1 Flash è più recente a circa un terzo del prezzo.",
        deepseekR1:
          "Il modello di ragionamento a peso aperto del gennaio 2025 che ha dimostrato la catena visibile del pensiero potrebbe essere economico. Ancora solida per matematica e logica, ma lenta, verbosa e reticente sulla politica la Cina considera sensibile. DeepSeek V4.1 Flash è più recente e una frazione del prezzo.",
        qwen3235bFree:
          "Qwen3 235B, un modello misto di esperti con parametri attivi 22B. Codice solido e ragionamento su un bilancio, chiama strumenti, 131K contesto. Solo testo e una generazione dietro: Qwen 3.8 Flash è più recente, legge immagini e costi circa lo stesso.",
        deepseekR1Distill:
          "Un piccolo Qwen -distillato basato di DeepSeek R1 per il ragionamento poco costoso passo-passo, solo testo, breve contesto 32K. Nessun fornitore lo serve più. DeepSeek V4.1 Flash lo sostituisce: più intelligente, visionabile, contesto 1M, e ancora costa quasi nulla.",
        qwen257b:
          "Il piccolo modello 7B di Alibaba a peso aperto dal 2024. Economico e veloce per chat semplice, riscritture brevi e traduzione di base, contesto 32K. Debole a codifica e analisi secondo gli standard di oggi. Qwen 3.8 Flash è il nuovo Alibaba pick, più intelligente per un po 'di più.",
        dallE3:
          "DALL -E 3 - Modello di generazione di immagini OpenAI con immagini dettagliate e di alta qualità da richieste di testo",
        gptImage1:
          "GPT -Image-1 - OpenAI modello di generazione rapida e conveniente dell'immagine",
        fluxSchnell:
          "Flux Schnell - Modello di generazione rapida delle immagini Black Forest Labs ottimizzato per la velocità",
        fluxPro:
          "Cavallo di lavoro testuale-image di Black Forest Labs dalla generazione FLUX.1. Composizione pulita, rapida e veloce. Testo in solo, nessuna modifica da un'immagine di riferimento. FLUX.2 Pro costa circa la metà e prende le immagini di riferimento, quindi questo si adatta principalmente alle richieste già sintonizzate per esso.",
        flux2Max:
          "Il livello superiore della famiglia FLUX.2 dei Black Forest Labs. Genera da testo o modifiche da immagini di riferimento, con il maggior dettaglio e la coerenza nella riga. Prezzo premium, più volte il costo di FLUX.2 Pro. Salvalo per colpi di eroe e complicate modifiche multi-riferimento; per il lavoro quotidiano FLUX.2 Pro ti ottiene la maggior parte del modo per meno. Legacy: FLUX.3 lo sostituisce, più affilato e più economico per immagine.",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Black Forest Labs modello di immagine più veloce e conveniente, ottimizzato per casi di utilizzo ad alta produttività. Legacy: FLUX.3 Klein lo sostituisce.",
        riverflowV2Pro:
          "Riverflow V2 Pro - Il modello di generazione delle immagini più potente di Sourceful con controllo superiore e rendering perfetto del testo",
        riverflowV2Fast:
          "Riverflow V2 Fast - Il modello di generazione delle immagini più veloce di Sourceful, ottimizzato per le implementazioni di produzione e i flussi di lavoro critici di latenza",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Anteprima - La variante di anteprima più potente di Sourceful, il modello unificato di testo per immagine e immagine per immagine. Legacy: l'anteprima è stata ritirata a monte; utilizzare Riverflow V2 Pro.",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Anteprima - La variante di anteprima standard di Sourceful, il modello unificato di testo per immagine e immagine per immagine superiore alla famiglia Riverflow 1. Legacy: l'anteprima è stata ritirata a monte; utilizzare Riverflow V2 Pro.",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - La variante di anteprima più veloce di Sourceful, il modello unificato di testo-immagine e immagine-immagine al punto di prezzo più basso. Legacy: l'anteprima è stata ritirata a monte; utilizzare Riverflow V2 Fast.",
        flux2Flex:
          "FLUX.2 Flex - Il modello di immagine dei Black Forest Labs si escellerà in un'architettura unificata con il rendering di testo complesso, la tipografia e la modifica multi-referenza",
        flux2Pro:
          "Cavallo da lavoro FLUX.2 di Black Forest Labs per la generazione e la modifica. Prende testo più immagini di riferimento, mantiene caratteri e prodotti coerenti tra i colpi, gestisce bene i tempi lunghi. Prezzo medio. Aprire il livello: filtri più leggeri di Imagen 4, ma non espliciti; Chroma o Lustify v8 coprono quello. Salire fino a FLUX.2 Max solo quando il dettaglio realmente conta.",
        gemini3ProImagePreview:
          "Google Gemini 3 Pro Image, in anteprima. Il più forte Nano Banana: segue i suggerimenti complessi più da vicino, rende il testo leggibile all'interno delle immagini e modifica le immagini caricate. Filtri a monte principale, nessuna chiamata degli strumenti, 64K contesto. Diverse volte il prezzo di Nano Banana, in modo da salvarlo per lavoro dove la qualità dell'immagine conta.",
        gpt5ImageMini:
          "OpenAI 's GPT-5 Image Mini: GPT-5 Mini competenze linguistiche più la generazione di immagini e la modifica nella stessa chat. Legge immagini, contesto 400K. Filtri a valle, senza chiamate. Pricier di Nano Banana e vicino a Nano Banana Pro, quindi confrontare sia sul proprio prompt. Legacy: OpenRouter lo ritira il 1o dicembre 2026. Utilizzare Nano Banana 2.1 in chat, o GPT Image 2.6 Flare per la qualità OpenAI.",
        gpt5Image:
          "GPT-5 abbinato al generatore di immagini OpenAI: chat, quindi creare o modificare le immagini nella stessa conversazione, con l'ingresso dell'immagine. Buon per iterating su visuals in parole semplici. Nessuna chiamata degli strumenti, e costoso per messaggio. GPT-5 Image Mini è l'opzione più economica; Nano Banana Pro vale la pena confrontare.",
        gpt54Image2:
          "Il ragionamento GPT-5.4 combinato con la generazione GPT Image 2, in modo da una chat può passare dall'analisi o dal codice alle immagini finite. Legge anche le immagini. Niente chiamate e costoso. GPT-5 Image Mini costa molto meno; Nano Banana e Nano Banana Pro sono le altre scelte di immagine attuali.",
        seedream45:
          "Il modello di immagine di ByteDance per la generazione e la modifica in uno. Forte nei ritratti, mantenendo un soggetto coerente e combinando diverse immagini di input in una scena. Prezzo medio, vicino a FLUX.2 Pro. Aprire il livello: filtri più leggeri del mainstream, non espliciti. Una buona seconda opinione quando FLUX.2 Pro manca il look che si desidera. Legacy: Seedream 5.5 lo sostituisce a metà prezzo.",
        sdxl: "Stable Diffusion XL - modello di generazione di immagini aperte di alta qualità di AI",
        cassetteMusic:
          "CassetteAI Music - generazione veloce di testo-musica su Fal.ai con lunghezze di clip fino a tre minuti",
        musicgenStereo:
          "MusicGen open source di Meta nella sua versione stereo. Musica strumentale da un prompt di testo: genere, umore, strumenti. Niente voci o testi. A buon mercato. Buon per i letti di sottofondo e loop; per le canzoni con la voce utilizzare ElevenLabs Music o Sonauto Song.",
        stableAudio:
          "Stable Audio - Stability AI modello di musica e generazione audio per clip di alta qualità",
        udioV2:
          "Udio v2 - Generazione musicale AI di alta qualità con voce e qualità di produzione completa",
        modelsLabMusicGen:
          "Modelli modello di testo-musica di Lab, con uscita MP3, WAV o FLAC. Prompt-driven tracce per musica di sottofondo e jingles. Costi più volte di Lyria 3 o MusicGen Stereo, e il suo modello sottostante non è documentato. Prova Lyria 3 prima per qualità ad un prezzo più basso.",
        modelsLabElevenlabsMusic:
          "ElevenLabs ' modello musicale. Piene tracce con voce e testi in diverse lingue, o strumentali, guidati dal vostro prompt. Si applicano i filtri dei contenuti di Mainstream. Gamma di prezzo superiore per la musica. Forte per le canzoni lucide e pronte alla radio; per i brani completi più economici con la voce prova Sonauto Song.",
        modelsLabSonautoSong:
          "Il generatore di canzoni di Sonauto. Canzoni pieni di voci e testi in molti generi, a basso prezzo per tracce complete. Aprire il livello, con filtri più leggeri di ElevenLabs. La polish di produzione varia; per le miscele più pulite pagano per ElevenLabs Music o Lyria 3 Pro Preview.",
        modelsLabLyria3:
          "GoogleLa Lyria 3. Tracce originali di circa 30 secondi da un prompt dei testi, con alta qualità di produzione. Molto economico per quello che offre. Principalstream: Si applicano i filtri di Google. Troppo breve per le canzoni piene; Lyria 3 Pro Preview gestisce la lunghezza totale.",
        modelsLabCogVideoX:
          "CogVideoX - ModelliIl modello text-to-video di Lab per la generazione di clip video brevi",
        modelsLabWanx:
          "Wanx - Modelli modello di generazione testo-video di Lab",
        modelsLabWan22:
          "Wan 2.2 Ultra - Modelli modello di generazione test-video di alta qualità",
        modelsLabWan21:
          "Wan 2.1 Ultra - ModelliIl modello di generazione testo-video di Lab con una qualità migliorata",
        modelsLabWan25T2V:
          "Wan 2.5 T2V - ModelliLab's Wan 2.5 modello di generazione testo-video",
        modelsLabWan25I2V:
          "Wan 2.5 I2V - ModelliLab's Wan 2.5 immagine-video modello di generazione",
        modelsLabWan27T2V:
          "Modello video Wan 2.7 di Alibaba. Clips fino a 10 secondi (15 via ModelsLab) fino a 1080p, molti rapporti di aspetto, audio nativo e frame opzionali prima e ultimo per guidare il colpo. Prezzo medio al secondo. Un tuttofare flessibile; per i test più economici utilizzare Seedance 1.5 Pro, per il realismo top-end Veo 3.1. Legacy: Wan 3.0 lo sostituisce, stesso prezzo 720p con clip fino a 30 secondi.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - ModelliLab's Wan 2.6 modello di generazione testo-video",
        modelsLabWan26I2V:
          "Modello di immagine-video di Alibaba Wan 2.6: portalo a una cornice iniziale e anima la scena, con audio nativo. 5 o 10 secondi clip a 720p o 1080p, paesaggio o ritratto. Circa lo stesso prezzo al secondo di Wan 2.7. Scegliere Wan 2.7 T2V quando si desidera anche una cornice di fine obiettivo o più rapporti di aspetto.",
        modelsLabWan26I2VFlash:
          "La variante di velocità di Wan 2.6 immagine-video. Trasforma un ancora in un 5 o 10 secondo clip a 720p o 1080p con le aspette più brevi. Stesso prezzo al secondo come standard Wan 2.6 I2V, quindi sceglilo quando si tratta di turnaround. L'audio nativo non è elencato per questa variante; il modello standard lo ha.",
        modelsLabSeedanceT2V:
          "Seedance T2V - Il modello di generazione testo-video di BytePlus",
        modelsLabSeedanceI2V:
          "Seedance I2V - BytePlus modello di generazione immagine-video",
        modelsLabOmnihuman:
          "Omnihuman - Il modello di generazione video umana di BytePlus",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V - BytePlus modello professionale di immagine-video",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V - BytePlus veloce modello professionale di immagine-video",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V - BytePlus veloce modello professionale di testo-video",
        modelsLabOmnihuman15:
          "OmniHuman 1.5 di ByteDance anima una persona da una singola foto, guidata da un brano audio: teste di conversazione, canto, gesti. Uno specialista per avatar e doppiaggio, non un modello di testo-video generale. Pricier al secondo rispetto alla maggior parte dei modelli video di fascia media. Per le scene senza una persona parlante, scegli Kling 3.0 o Wan 2.7.",
        modelsLabSeedance15Pro:
          "ByteDance's Seedance 1.5 Pro, venduto attraverso il suo cloud BytePlus. Testo a video con audio nativo, 480p a 1080p, paesaggio o ritratto. Uno dei modelli video più economici qui per clip, e 480p costa la metà del tasso 720p. Ottimo per testare idee e volumi; Seedance 2.0 è il passo avanti per il controllo del telaio, la consistenza e 4K.",
        modelsLabVeo2:
          "Veo 2 - Google modello di generazione video di alta qualità tramite ModelsLab",
        modelsLabVeo3:
          "Veo 3 - L'ultimo modello di video generazione Google tramite ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Il modello di generazione video veloce di Google tramite ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - modello di anteprima rapida generazione video di Google tramite ModelsLab",
        modelsLabVeo31:
          "Il modello video di punta di Google. Realismo cinematografico, audio nativo con effetti dialoghi e sonori, 4-8 secondi clip fino a 4K, primo e ultimo controllo frame. Il modello video più costoso del catalogo. Vale la pena per gli scatti finali; abbozzo su Veo 3.1 Fast ad una frazione del prezzo.",
        modelsLabVeo31Fast:
          "Il livello più veloce ed economico del Veo 3.1 di Google. Stesso 4-8 secondi clip, audio nativo, fino a 4K e controllo frame, per circa un terzo a metà del prezzo pieno Veo 3.1. Abbandona un po' di fedeltà a colpi esigenti. Il posto dolce per la maggior parte del lavoro di Veo; Veo 3.1 Lite è ancora più economico.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Versione immagine-video di Kling AI 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo per immagine-video: animare un ancora in un corto clip. A buon mercato per clip e veloce, con il movimento vivace di Kling. Nessun audio nativo elencato. Kling 3.0 aggiunge suono e colpi fino a 15 secondi per più soldi.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo dal testo. 5 o 10 secondi clip in 16:9, 9:16 o 1:1, tra i più economici per clip nel catalogo. Forte movimento per il prezzo, nessun audio nativo. Aggiornamento a Kling 3.0 T2V per suono e clip fino a 15 secondi.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Kling AI modello di qualità master text-to-video",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Kling AI modello di immagine-video di qualità superiore",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, il livello premium della generazione 2.1 di Kling. 5 o 10 secondi clip dal testo con alta fedeltà visiva. Prezzo vicino alla parte superiore del catalogo, circa tre volte Kling 3.0 T2V, che è più recente e aggiunge audio nativo. Per lo più vale la pena per le richieste che già funzionano bene qui.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master per immagine-video: anima un clip ancora in 5 o 10 secondi con alta fedeltà visiva. Prezzo vicino alla parte superiore del catalogo, circa tre volte il più recente Kling 3.0, che porta anche audio nativo. Sceglilo solo se il suo look è esattamente quello di cui hai bisogno; Kling V2.5 Turbo I2V è l'alternativa economica.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Kling AI versione multi-immagine-video 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 Pro di Kuaishou. Audio nativo, 3-15 secondi clip a 720p, primo e ultimo controllo frame, 16:9, 9:16 o 1:1. 720p è il soffitto; per 1080p e sopra guardare Veo 3.1 Fast o Hailuo 3. Kling 3.0 Std costa meno quando si inizia da un'immagine.",
        modelsLabLtx2ProT2V:
          "LTX-2 Pro di Lightricks. Testo a video a 2K o 4K, in clip di circa 6-10 secondi. Un prezzo medio-arancio per questa risoluzione, che lo rende il percorso di bilancio a 4K accanto al Veo 3.1. Nessun audio nativo elencato qui; per il suono con 4K utilizzare Veo 3.1 Fast.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - modello professionale di generazione di immagini-video di LTX",
        modelsLabLtx23ProI2V:
          "Lightricks' LTX 2.3 Pro per immagine-video: anima un ancora a 2K o 4K in 6-10 secondi clip. Più recente di LTX 2 Pro e costato un po 'più in alto. La scelta quando un'immagine ad alta risoluzione deve rimanere nitida in movimento. Nessun audio nativo elencato.",
        modelsLabHailuo23T2V:
          "MiniMax's Hailuo 2.3 dal testo o da un'immagine di partenza, nota per il movimento fisico e vivace come danza e azione. 6 o 10 secondi clip fino a 1080p in 16:9. Niente audio nativo. Prezzo medio. Hailuo 3 aggiunge suono, 2K e controllo frame per circa il doppio del costo.",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V - Modello di generazione testo-video di MiniMax 02",
        modelsLabHailuo23I2V:
          "MiniMax Hailuo 2.3 per immagine-video. Anima un ancora in un 6 o 10 secondi clip con movimento espressivo, fisico. Niente audio nativo. Hailuo 2.3 Fast I2V fa lo stesso lavoro per circa la metà del prezzo con meno lucida.",
        modelsLabHailuo23FastI2V:
          "Il livello veloce, economico di Hailuo 2.3 immagine-video. 6 o 10 secondi clip da un ancora a circa la metà del costo della standard Hailuo 2.3 I2V. Ottimo per bozze e volumi, con meno dettagli. Niente audio nativo.",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V - MiniMax modello di generazione immagine-video 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - Modella di generazione video per frame start-end di MiniMax",
        modelsLabSora2:
          "OpenAIE' Sora 2. Fisica credibile, audio sincronizzato e dialogo, 4, 8 o 12 secondi clip a 720p. 16:9 solo su questo percorso. Prezzo medio-alto. Sora 2 Pro rende le stesse lunghezze in dettaglio più fine per circa tre volte il costo.",
        modelsLabSora2Pro:
          "Il livello premium della Sora 2 di OpenAI. Sincronizzazione audio e maggiore fedeltà, 4, 8 o 12 secondi clip a 720p, 16:9 solo su questo percorso. Uno dei modelli video più costosi qui. Vale la pena per i colpi finali lucidati; Sora 2 copre bozze per circa un terzo del prezzo.",
        modelsLabGen4Aleph:
          "La Runway's Aleph è un editor video più di un generatore: dà il filmato esistente e aggiunge o rimuove oggetti, ridisegna, rilegge o cambia l'angolo della fotocamera. Molti rapporti di aspetto, tra cui ampi formati cinematografici. Pricier della maggior parte dei generatori. Per clip fresche da un prompt, utilizzare Veo 3.1 Fast o Kling 3.0.",
        modelsLabLipsync2:
          "Il lipsync-2 di Sync corrisponde al movimento della bocca in un video esistente a una nuova traccia audio. Costruito per il doppiaggio, tradotto voiceover e il dialogo di fissaggio. Modifica il filmato, non inventa scene. Per una persona parlante da una singola foto, utilizzare Omnihuman 1.5.",
        modelsLabGrokT2V:
          "xAI Grok Immagini video dal testo. 1 a 15 secondi clip a 480p o 720p, con un primo frame opzionale. Prezzo medio, veloce e sciolto. Aprire il livello, quindi filtri più leggeri di Veo o Sora, anche se non espliciti. Grok Imagine Video 1.5 aggiunge 1080p. Legacy: Grok Imagine Video 1.5 Lite lo sostituisce a meno della metà del prezzo.",
        modelsLabGrokI2V:
          "xAI Grok Immagina per immagine-video. Anima una clip ancora in un clip fino a 15 secondi in HD. Un po 'più economico di Grok T2V. Fine per i fermi animati veloci; per una risoluzione più alta, passo fino a Grok Immagina video 1.5. Legacy: Grok Imagine Video 1.5 Lite anima ancora per meno.",
        klingV30Std:
          "Il livello standard del Kling 3.0 di Kuaishou. Gli stessi 3-15 secondi clip con controllo audio e frame nativo di Kling 3.0 T2V, il livello Pro, a 720p. Il più economico Kling 3 scegliere quando si inizia da un'immagine; per il testo semplice richiede Kling 3.0 T2V spesso costa meno.",
        klingVideoO1:
          "Il modello video multimodale unificato di Kling, progettato per generare clip e modificarli da riferimenti all'interno di un unico modello. Audio nativo, 5 o 10 secondi a 720p, primo e ultimo controllo della cornice. Prezzo medio. Scegliere per il lavoro di riferimento-driven; per testo-to-video semplice, Kling 3.0 T2V è più conveniente.",
        veo31Lite:
          "Il bilancio di Google Veo 3.1 tier. Audio nativo, 4-8 secondi clip a 720p o 1080p, primo e ultimo controllo della cornice. La via più economica per Veo, ma non 4K. Buon per clip sociali ad alto volume; passo fino a Veo 3.1 Fast quando la qualità conta.",
        seedance2:
          "ByteDance's Seedance 2.0. Audio nativo, 4-15 secondi clip da 480p fino a 4K, primo e ultimo frame, e input di riferimento per mantenere i caratteri coerenti. Gamma di prezzo superiore. Una scelta forte per i colpi di storia con personaggi ricorrenti; Seedance 2.0 Fast è più conveniente per le bozze fino a 720p.",
        seedance2Fast:
          "Il livello più veloce ed economico di ByteDance's Seedance 2.0. Audio nativo, clip fino a 15 secondi e controllo della cornice, ma incappucciato a 720p. Circa il 60 per cento del prezzo del modello completo. Buono per bozze e clip sociali; utilizzare la piena Seedance 2.0 quando hai bisogno di 1080p o 4K.",
        happyhorse11:
          "La seconda versione del modello video HappyHorse di Alibaba. Text-to-video, immagini-to-video e immagini di riferimento, da 3 a 15 secondi a 720p o 1080p. Nessun audio nativo su questo percorso. Stesso 720p prezzo di HappyHorse 1.0 e più economico a 1080p, con migliore movimento e coerenza per Alibaba, quindi è il pick predefinito dei due. Costo medio.",
        happyhorse10:
          "La prima versione del video di Alibaba HappyHorse. Text-to-video, immagini-to-video e immagini di riferimento, da 3 a 15 secondi a 720p o 1080p. Nessun audio nativo su questo percorso. Stesso 720p prezzo di HappyHorse 1.1 ma pricier a 1080p, quindi la versione più recente è di solito il meglio scegliere. Vale la pena mantenere per i suggerimenti sintonizzati su 1.0.",
        modelsLabGen4T2ITurbo:
          "La variante più veloce ed economica del modello di immagine Gen-4 di Runway. Testo in, immagine fuori, a meno di un terzo del prezzo di Gen4 Image. Buon per le bozze rapide e l'iterazione sul look cinematografico di Runway. Nessuna modifica dell'immagine di riferimento qui; per le modifiche utilizzare FLUX.2 Pro o Seedream 4.5.",
        modelsLabGen4Image:
          "Modello di immagine Gen-4 di Runway, noto per un look cinematografico e cinematografico. Testo in, immagine fuori. Una delle opzioni di immagine pricier nel catalogo, in modo da guadagna il suo posto quando si desidera che Runway estetica specificamente. Per l'iterazione a buon mercato avviare con Gen4 T2I Turbo; per le modifiche da un'immagine di riferimento selezionare FLUX.2 Pro.",
        modelsLabWan27T2I:
          "Il modello di immagine Wan 2.7 di Alibaba, dalla stessa famiglia dei modelli video Wan. Testo in, immagine fuori, ad un basso prezzo medio-arancio. Una scelta solida per le illustrazioni e le scene. Nessun input di riferimento-immagine qui; per le modifiche utilizzare Qwen Image 3 o Seedream 4.5.",
        modelsLabGrokT2I:
          "xAI Grok Immagina generatore di immagini. Testo in, immagine fuori, economico da eseguire. Apri il livello, quindi i filtri sono più leggeri di Imagen 4, anche se non espliciti. Bene per immagini rapide e punzonate; per le modifiche di immagine di riferimento e la nuova generazione, Grok Imagine Image 2.0 costa un po 'di più.",
        modelsLabZImageBase:
          "La fondazione completa e non distillata di Z-Image, il modello di immagine a peso aperto del laboratorio Tongyi di Alibaba. Tra le immagini più economiche del catalogo. Più varietà di Z Image Turbo, più lento per immagine. Buon per il volume e la sperimentazione a buon mercato; per l'arte finale lucida passo fino a FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "La versione distillata e ottimizzata per la velocità di Z-Image, il modello open-weight del laboratorio Tongyi di Alibaba. Immagini in pochi passi, a prezzi inferiori al catalogo. Buoni risultati fotografici e testo leggibile per il costo. Meno varietà di Z Image Base, e cade dietro FLUX.2 Pro su sode sollecitazioni.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs' Flux 2 Max text-to-image tramite ModelsLab",
        modelsLabFluxPro11Ultra:
          "La modalità ad alta risoluzione di Flux Pro 1.1, costruita per immagini di circa 4 megapixel. Solo un messaggio. Tra i modelli di immagine pricier qui. Sceglilo per i grandi, stampa-pronto fermi; per la modifica o il lavoro multi-referenza FLUX.2 Pro è più economico e flessibile.",
        modelsLabFluxPro11:
          "Flux Pro 1.1 - Black Forest Labs' Flux Pro 1.1 text-to-image via ModelsLab",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I - Black Forest Labs' Flux 2 Pro text-to-image tramite ModelsLab",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I - Black Forest Labs' Flux 2 Dev text-to-image via ModelsLab",
        modelsLabFluxT2I:
          "Flux T2I - Black Forest Labs' Flux text-to-image via ModelsLab",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I: genera immagini da testo con Seedream 4.5 di ByteDance, tramite ModelsLab.",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I: genera immagini da testo con Seedream 4.0 di ByteDance, tramite ModelsLab.",
        modelsLabSeedreamT2I:
          "Seedream T2I: genera immagini da testo con Seedream di ByteDance, tramite ModelsLab.",
        modelsLabImagen4Ultra:
          "Il livello superiore di Google 's Imagen 4. Il prompt più preciso che segue in famiglia e testo pulito e leggibile all'interno delle immagini. Mainstream: I filtri di Google si applicano in pieno. Circa tre volte il prezzo di Imagen 4 Fast, in modo da salvarlo per renders finali. Per meno restrizioni utilizzare FLUX.2 Pro; per contenuti espliciti, Chroma.",
        modelsLabImagen4:
          "Google standard Imagen 4. Dettaglio fotoreale, buona tipografia e richiesta affidabile a seguito di un prezzo medio-arancio. Mainstream: Si applicano i filtri di Google, quindi aspettatevi dei rifiuti sui prompt edgy. Imagen 4 Fast è circa la metà del prezzo per le bozze; Imagen 4 Ultra gestisce l'ultimo miglio.",
        modelsLabImagen4Fast:
          "Il livello di velocità di Imagen 4 di Google. Il più economico Imagen, risultati rapidi, buono per bozze e lotti di rinfuse. Fornisce alcuni dettagli e precisione rapida rispetto a Imagen 4 e Ultra. Si applicano i filtri a valle. Per un volume ancora più economico con filtri più leggeri, prova Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3: genera immagini da testo con Imagen 3 di Google, tramite ModelsLab.",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - Generazione di immagini di alta qualità tramite ModelsLab",
        modelsLabNanoBanana:
          "Nano Banana - Generazione immagine tramite ModelsLab",
        modelsLabQwenT2I:
          "Il modello Qwen di Alibaba. La linea di immagini Qwen si distingue per il rendering del testo all'interno di immagini, caratteri cinesi inclusi, che si adattano a poster, segni e mockup. Prezzo in basso. Testo in solo; per la modifica di scegliere Qwen Image 3.",
        modelsLabRealtimeT2I:
          "Il punto finale in tempo reale di ModelsLab, sintonizzato per la velocità sulla lucidatura. Immagini veloci al prezzo più basso nel catalogo. Usalo per un'ideazione rapida, miniature e prompt dei test prima di spendere su FLUX.2 Pro o Imagen 4. Non la scelta per l'arte finale o scene complesse.",
        claudeSonnet5:
          "Il primo Sonnet 5 di Anthropic: codifica bilanciata, agente e analisi funzionano sul contesto 1M, con ingresso immagine. Filtri a valle, prudenti su argomenti controversi, deboli in gioco di ruolo. Claude Sonnet 5.5 costa lo stesso ed è più recente, quindi non c'è motivo di rimanere.",
        claudeOpus5:
          "Il primo Opus 5 di Anthropic, rivolto ai più duri compiti agentici e analitici, con contesto 1M e ingresso immagine. Prezzo premium, filtri tradizionali, prudente su argomenti controversi. Claude Opus 5.5 è più recente e più economico.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast - variante ad alta produttività di Claude Opus 5 ottimizzata per applicazioni sensibili alla latenza.",
        claudeFable5:
          "La prima Fable di Anthropic, un ragionatore di frontiera per la sintesi profonda, la profondità creativa e la pianificazione a lungo raggio, con il contesto 1M e l'ingresso dell'immagine. Tra i modelli priciest qui e filtrato mainstream. Claude Fable 5.2 è più recente e più economico; per il codice, scegliere Claude Opus 5.5.",
        grok45:
          "Il modello di ragionamento Grok 4.5 di xAI: forte all'analisi e alla codifica, legge immagini, contesto 500K, con la politica aperta dei contenuti di Grok. Grok 4.7 è più recente allo stesso prezzo, quindi passare a meno che non hai bisogno di questa versione esatta.",
        grok46:
          "Grok 4.6 affilato ragionamento e codifica oltre 4,5, con ingresso immagine, contesto 500K e filtri contenuti più leggeri di xAI. E' ancora un modello a filtro aperto capace. Grok 4.7 costa lo stesso e lo sostituisce.",
        gpt56Luna:
          "Il livello rapido ed economico della linea OpenAI GPT-5.6, per la chat quotidiana e le attività brevi, con il contesto 1M e l'ingresso dell'immagine. Non costruito per analisi approfondite. GPT-6 Luna è più recente e costa circa la metà.",
        gpt56LunaPro:
          "Luna con migliore codifica e istruzioni seguendo, allo stesso prezzo basso della pianura Luna. Buon per l'aiuto di codice a buon mercato e le attività strutturate in 1M contesto. GPT-6 Luna è più recente e circa la metà del prezzo.",
        gpt56Terra:
          "Il livello medio della linea OpenAI GPT-5.6: codifica solida, analisi e chat su 1M contesto, con ingresso immagine. Debole in gioco di ruolo. GPT-6.1 Terra è più recente e circa la metà del prezzo.",
        gpt56TerraPro:
          "Terra con un ragionamento più profondo per l'analisi-pesante lavoro, allo stesso prezzo della Terra normale, oltre 1M contesto. Debole in gioco di ruolo. GPT-6.1 Terra è più recente e circa la metà del prezzo; salire fino a GPT-6.1 Sol per una maggiore profondità.",
        gpt56Sol:
          "Il livello superiore della linea GPT-5.6 di OpenAI: ragionamento complesso, codifica, scrittura e analisi sul contesto 1M, con ingresso immagine. Prezzo premium, filtri tradizionali. GPT-6.1 Sol è più recente e costa circa la metà.",
        gpt56SolPro:
          "Sol con ulteriore sforzo di ragionamento per i problemi più difficili, ha valutato lo stesso come semplice Sol, oltre 1M contesto. Debole in gioco di ruolo, filtri tradizionali. GPT-6.1 Sol è più nuovo a metà prezzo; GPT-6 Astra se avete bisogno di profondità massima.",
        gemini36Flash:
          "Google Gemini 3.6 Flash: veloce e buono nella codifica, con contesto 1M e testo, immagine, video e ingresso audio. Valore ancora ragionevole per il lavoro quotidiano. Gemini 3.8 Flash è più recente per solo un po 'di più.",
        gemini35FlashLite:
          "Google è il più leggero Gemini. Prende testo, immagini, video e audio, strumenti di chiamata, contesto 1M. Va bene per semplici lavori ad alto volume come riassunti, tagging e risposte rapide. Filtri a valle, e non un ragionatore. Pricier di quanto ci si aspetterebbe per un modello lite: GPT-6 Luna e Claude Haiku 5.5 costano meno.",
        gemini37Flash:
          "Gemini 3.7 Flash ha portato un migliore ragionamento e analisi alla linea Flash, con contesto 1M e testo, immagine, video e ingresso audio. Un buon modello di tutti i giorni ad un prezzo equo. Gemini 3.8 Flash lo sostituisce solo leggermente di più.",
        kimiK3:
          "Moonshot AI Kimi K3, un modello di frontiera. Forte in codice, analisi, scrittura creativa e lungo funzionamento agente, legge immagini e video, strumenti di chiamata, contesto 1M. Filtri più leggeri dei laboratori US. Kimi K3.1 Pro è la versione più recente e più forte a quasi il doppio del prezzo.",
        glm52:
          "Z. AI GLM-5.2: ragionamento forte con inferenza veloce e contesto 1M. Buono per la codifica e l'analisi su ingressi lunghi, solo testo, livello di contenuto aperto. GLM-5.3 è più recente a circa un terzo del prezzo.",
        minimaxM3:
          "L'ex ammiraglia di MiniMax. Buono a codice, ragionamento e analisi, legge immagini e video, chiama strumenti, contesto 1M, filtri più leggeri dei laboratori tradizionali. MiniMax M3.1 Flash lo sostituisce: chiaramente più forte agli agenti e al codice per metà del prezzo o meno.",
        qwen37Flash:
          "Il modello Flash ultra-cheap di Alibaba e una delle opzioni più economiche del catalogo: contesto 1M, testo, immagine e ingresso video, chiamate degli strumenti. Ottimo per lavori di rinfusa e chat veloce, poco profondo su ragionamento duro. Qwen 3.8 Flash è più recente e più intelligente, ma costa più volte.",
        qwen38Max:
          "La top Qwen di Alibaba. Il ragionamento anteriore-tier, il codice e l'analisi, legge immagini e video, chiama strumenti, contesto 1M. Filtri più leggeri dei laboratori US. Premium per un modello aperto: DeepSeek V4 Pro raggiunge lo stesso livello per ben meno della metà del prezzo, se l'ingresso di testo è sufficiente.",
        mimoV25:
          "MiMo V2.5 efficiente di Xiaomi: veloce e buono a codificare, con contesto 1M e testo, immagine, video e ingresso audio. Livello di contenuto aperto. MiMo V2.6 Flash è più recente e costa meno di un terzo tanto.",
        mimoV25Pro:
          "MiMo V2.5 Pro di Xiaomi, un modello di ragionamento e codifica profondo con contesto 1M a basso prezzo. Solo testo, livello di contenuto aperto. Ancora più economico del suo successore MiMo V2.6 Pro, che è la scelta più recente.",
        metaMuseSpark12:
          "Meta's Muse Spark 1.2, un modello di ragionamento multimodale che legge testo, immagini e video in 1M contesto. Buono a analisi cross-modal, livello di contenuto aperto. Non e' stato etichettato per la codifica. Meta Muse Spark 1.3 costa lo stesso ed è più recente.",
        mistralMedium35:
          "La media 3.5 di Mistral AI del laboratorio francese: codifica, analisi e input immagine con contesto 262K. Filtri a valle. Mistral Large 4 è più recente e costa meno della metà.",
        claudeOpus55:
          "Anthropic è il primo Claude per il lavoro pesante quotidiano. La scelta per la codifica più difficile, lunghi compiti agentici e analisi attenta, con scrittura forte in cima. Legge immagini, strumenti di chiamata, contesto 1M. Prezzi premium e filtri mainstream: declina richieste taglienti e rende un partner di gioco di ruolo povero. Claude Sonnet 5.5 copre la maggior parte del lavoro quotidiano a metà prezzo.",
        claudeSonnet55:
          "Anthropic 's workhorse Claude. Codifica forte, lavoro agente, analisi e scrittura per metà del prezzo di Opus 5.5. Legge immagini, strumenti di chiamata, contesto 1M. Filtri a monte principale, quindi non per i giochi di ruolo o argomenti controversi. Livello a prezzo con GPT-6.1 Sol e Gemini 4 Argon, l'ovvia testa a testa.",
        claudeHaiku55:
          "Anthropic è il più veloce, più economico Claude. Chat veloce, codifica leggera, visione e strumenti, contesto 1M, penny per messaggio. Filtri a valle, deboli per i giochi di ruolo e argomenti di attualità. Stesso prezzo di GPT-6 Luna. Salire fino a Claude Sonnet 5.5 quando il compito ha bisogno di profondità reale.",
        claudeFable51:
          "Anthropic 's Fable 5.1, un ragionatore di frontiera per la sintesi profonda, la pianificazione a lungo raggio e la scrittura attenta su 1M contesto. Premium-Prezzo, mainstream-filtered, prudente su argomenti controversi e debole in gioco di ruolo. Claude Fable 5.2 lo sostituisce e costa meno; per il codice, Claude Opus 5.5 è la soluzione migliore.",
        claudeFable52:
          "Il ragionatore di frontiera di Anthropic e il priciest Claude. Costruito per la sintesi profonda, la ricerca e la pianificazione di lungo-orizzontale, con scrittura forte. Legge immagini, strumenti di chiamata, contesto 1M. Circa raddoppiare il prezzo di Opus 5.5, con i filtri tradizionali. Per il codice, Claude Opus 5.5 è il valore migliore.",
        gpt6Astra:
          "Il precedente modello di punta Astra accetta testo e immagini e usa strumenti. Il suo successore è GPT-6.2 Astra.",
        gpt6AstraPro:
          "GPT-6 Astra Pro - GPT-6 Astra con un lungo sforzo di ragionamento. Più lento, più approfondito. 1.05M-token contesto.",
        gpt61Sol:
          "La precedente versione di Sol accetta testo e immagini e usa strumenti. Il suo successore è GPT-6.2 Sol.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro - GPT-6.1 Sol con un ampio sforzo di ragionamento per l'analisi e il codice complessi.",
        gpt61Terra:
          "OpenAI e' bilanciato da un livello medio. Buona codifica, analisi e chat di tutti i giorni, legge immagini, strumenti di chiamata, contesto 1M. Metà del prezzo di GPT-6.1 Sol. Filtri a valle, deboli in gioco di ruolo. Se i filtri più leggeri si adattano, DeepSeek V4 Pro raggiunge un livello superiore per meno.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro - GPT-6.1 Terra con un ragionamento più profondo per l'analisi-pesante.",
        gpt6Luna:
          "OpenAI leggero GPT-6. risposte rapide per penny, legge immagini, strumenti di chiamata, contesto 1M. Buon per domande rapide e semplici faccende, non ragionamento profondo o gioco di ruolo. Stesso prezzo di Claude Haiku 5.5. DeepSeek V4.1 Flash è ancora più economico, con filtri più leggeri.",
        gpt6LunaPro:
          "GPT-6 Luna Pro - GPT-6 Luna con ragionamento extra. Migliore codice e istruzione-seguente, stesso prezzo basso. 1.05M-token contesto.",
        gemini4Argon:
          "Google 's flagship Gemini. Prende testo, immagini, video e audio, quindi motivi, codici e analizza al livello superiore. Chiama strumenti, contesto 1M. Una scelta forte quando l'ingresso è una registrazione, un video o un mucchio di screenshot. Filtri a valle. Livello di prezzo con Claude Sonnet 5.5 e GPT-6.1 Sol. Gemini 4 Carbon va più a fondo sui compiti più difficili; Gemini 4 Hydrogen è più veloce e un quarto più economico.",
        gemini38Flash:
          "L’attuale Flash di Google. È veloce e adatto a codice e analisi. Riceve testo, immagini, video e audio, usa strumenti e ha 1M di contesto. Applica filtri convenzionali. Costa meno della metà di Gemini 4 Argon, ma più dei modelli aperti veloci come Qwen 3.8 Flash. Gemini 4 Hydrogen è molto più intelligente e veloce e costa quasi il doppio.",
        grok47:
          "Il Grok più recente di xAI. Ragionamento preciso e buon codice. Legge immagini, usa strumenti e ha 500K di contesto, circa la metà degli altri modelli di punta. Applica filtri più leggeri dei grandi laboratori e risponde a più domande. Costa quanto Qwen 3.8 Max. xAI ha ritirato la variante Fast economica. Per chat rapide con filtri leggeri, prova MiniMax M3.1 Flash o Meta Muse Ember.",
        kimiK31Pro:
          "Moonshot AI è il più forte Kimi. Il ragionamento superiore, il codice, la scrittura creativa e l'agente lungo corre, legge immagini e video, chiama strumenti, contesto 1M. Filtri più leggeri dei laboratori US. Livello di prezzo con Claude Sonnet 5.5. Kimi K3 si avvicina per un po 'più della metà del prezzo.",
        gpt62Sol: "Sol legge testi e immagini, scrive codice e usa strumenti.",
        gpt62Astra:
          "Astra usa testi, immagini e strumenti per affrontare problemi complessi di ingegneria e analisi.",
        superGemma426b:
          "La versione di Gemma 4 affinata da Jiunsong legge testo e una singola immagine e può usare strumenti.",
        deepseekV41FlashCsf:
          "La variante abliterata di DeepSeek V4.1 Flash di jcartu ragiona su testi e usa strumenti.",
        maiImage27:
          "Il modello di Microsoft genera qui immagini in 1K a partire dal testo.",
        maiImage27Flash:
          "La variante più veloce di MAI Image 2.7 crea immagini in 1K a partire dal testo.",
        qwen4Max:
          "La nuova ammiraglia di Alibaba e la prima Qwen 4. Il ragionamento anteriore-tier, il codice e l'analisi, legge immagini e video, chiama strumenti, contesto 1M. Filtri più leggeri dei laboratori US. Pensa prima di ogni risposta, quindi le risposte ci vogliono un momento. Un quarto più economico di Qwen 3.8 Max, che sostituisce.",
        kimiK31ProUncensored:
          "Il Kimi più potente di Moonshot AI, con i rifiuti rimossi tramite abliteration, su Lyber. Di punta tra i modelli senza censura per ragionamento, codice e testi lunghi. Usa strumenti e ha 1M di contesto. Conserva la prospettiva politica del Kimi originale. Per posizioni politiche controcorrente scegli UncensoredLM. Solo testo. Costa diverse volte GLM 5.3 Uncensored, l’alternativa potente a prezzo più basso.",
        deepseekV41Flash:
          "Il modello veloce di DeepSeek ora legge le immagini. Offre buoni risultati in codice e analisi ed è il più economico del catalogo. Usa strumenti, ha 1M di contesto e filtri più leggeri. Per problemi che richiedono più ragionamento, scegli DeepSeek V4 Pro. Per risposte senza rifiuti, scegli DeepSeek V4.1 Flash Uncensored.",
        qwen38Flash:
          "Qwen veloce di Alibaba. Testo, immagini e video in, risposte rapide, codifica decente, strumenti di chiamata, contesto 1M. Prezzo di bilancio, filtri più leggeri. Un autista quotidiano, non un profondo pensatore. Qwen 4 Max prende i problemi duri.",
        glm53:
          "Z. AI modello di fondazione GLM-5.3. Forte ragionamento e codice per penny, strumenti di chiamata, contesto 1M. Solo testo, filtri leggeri. Tra i modelli intelligenti più economici del catalogo. Vuoi zero rifiuti? GLM 5.3 Uncensored è la variante non filtrata.",
        glm53Flash:
          "Z. AI è veloce GLM. Legge testo, immagini e video, codici, strumenti di chiamata, contesto 1M. Costruito per un lavoro ad alto volume a un prezzo di bilancio, con filtri più leggeri. Più leggero sul ragionamento di GLM-5.3, che costa lo stesso, quindi scegliere Flash per l'ingresso e la velocità dei media.",
        mimoV26Pro:
          "La migliore MiMo di Xiaomi. ragionamento, codice e analisi di livello superiore, prendendo testo, immagini, video e audio. Chiama strumenti, contesto 1M, filtri più leggeri. Il modello più economico nel livello di intelligenza più alto qui, una frazione di Gemini 4 Argon per un intervallo di input simile. Un nome più nuovo, quindi provalo sui tuoi suggerimenti.",
        mimoV26Flash:
          "Xiaomi e' il veloce MiMo. Prende testo, immagini, video e audio, codici bene per il suo prezzo, strumenti di chiamata, contesto 1M. Filtri molto economici e leggeri. Scambi profondità per la velocità. MiMo V2.6 Pro è il passo in su, e MiMo V2.6 Flash Abliterated scende i rifiuti.",
        metaMuseSpark13:
          "Meta e' a meta' livello Muse. Motivi e analisi attraverso testo, immagini e video, strumenti di chiamata, contesto 1M, filtri più leggeri. Non costruito per la codifica. A questo prezzo Kimi K3 raggiunge un livello più alto, e Meta Muse Wonder è il fiore all'occhiello di Meta.",
        metaMuseWonder:
          "La nave ammiraglia di Meta Muse. Razionalizzazione, codice, analisi e lavoro creativo, prendendo testo, immagini, video e audio. Chiama strumenti, contesto 1M, filtri più leggeri dei laboratori tradizionali. Premium, prezzo come Claude Opus 5.5. Kimi K3.1 Pro e Gemini 4 Argon siedono nello stesso livello a metà prezzo.",
        mistralLarge4:
          "Il fiore all'occhiello di Mistral AI, da un laboratorio europeo. Buono a codice e analisi, legge immagini, strumenti di chiamata, contesto 1M, ad un prezzo moderato. Filtri a valle. Non superiore: DeepSeek V4 Pro costa un po 'più e le ragioni più profonde.",
        gemini4Hydrogen:
          "Google è veloce Gemini 4. Costruito per gli anelli di agente, codifica e analisi rapida, e atterra al livello superiore sui benchmark durante la corsa circa 2,5 volte più veloce di Gemini 3.8 Flash. Prende testo, immagini, video e audio, strumenti di chiamata, contesto 1M. Filtri a valle. Lasciare lunghe, profonde catene di ragionamento a Gemini 4 Carbon o Argon. Un quarto più economico di Argon, quasi doppio Gemini 3.8 Flash.",
        gemini4Carbon:
          "Google è il più forte Gemini e uno dei migliori modelli in qualsiasi momento. Realizzato per il codice più duro, lungo funzionamento agente e ragionamento complesso, con testo, immagini, video e audio in. Chiama strumenti, contesto 1M. Filtri a valle. Brucia più gettoni di Argon per compito, quindi costa più in pratica. Il prezzo di lancio corrisponde a Argon, Claude Sonnet 5.5 e GPT-6.1 Sol fino al 30 novembre, quindi raddoppia a livello Claude Opus 5.5.",
        minimaxM31Flash:
          "Il modello veloce di MiniMax, molto più capace di M3 per agenti, codice e sicurezza. Legge immagini e video, usa strumenti e ha 1M di contesto. Filtri più leggeri di quelli dei grandi laboratori. Ragiona sempre prima di rispondere e tende a dilungarsi, quindi le risposte arrivano più lentamente rispetto ad altri modelli Flash. Costa la metà di M3 o meno, nella fascia di DeepSeek V4.1 Flash e Qwen 3.8 Flash.",
        metaMuseEmber:
          "Il Muse più piccolo di Meta, pensato per le attività ripetitive degli agenti: usare strumenti, instradare richieste, estrarre dati e rispondere in fretta. Riceve testo, immagini, video e audio. Ha 1M di contesto e filtri più leggeri di quelli dei grandi laboratori. Usa bene gli strumenti per le sue dimensioni, ma fatica con codice complesso e ragionamento profondo. Costa come GPT-6 Luna e Claude Haiku 5.5. Oltre 200K token nel prompt il prezzo triplica.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash con i rifiuti rimossi, su Venice. Buono per codice, analisi, narrativa e giochi di ruolo. Legge immagini, usa strumenti e ha 1M di contesto. Conserva l’addestramento e la visione di DeepSeek, che influenzano le risposte politiche e possono smorzare le scene più cupe. Per una prospettiva diversa c’è UncensoredLM. Costa circa quattro volte DeepSeek V4.1 Flash. GLM 5.3 Flash Uncensored è l’alternativa senza filtri più economica.",
        drummerArtemis31b:
          "Gemma 4 31B di TheDrummer per il gioco di ruolo e la finzione. Contiene un personaggio, scrive scene grimdark e per adulti esplicite senza rifiutare, e mantiene la prosa vivida invece di sanitizzata. Legge immagini, strumenti di chiamata, contesto 262K. Debole a codifica e analisi dura: un storyteller, non un ragionatore. Una comunità di multune su un singolo host NanoGPT, in modo che possa cadere brevemente. Circa un quinto del prezzo di Venice Role Play Uncensored. Quando la storia ha bisogno di una vera logica, DeepSeek V4.1 Flash Uncensored è il più intelligente scegliere.",
        grokImagineImage2:
          "xAI di seconda generazione Grok Immagina modello di immagine. Prende testo o un'immagine di riferimento, quindi gestisce le modifiche e le immagini fresche. Prezzo medio. Aprire il livello: filtri più leggeri del mainstream, non espliciti. L'aggiornamento sopra Grok Immagina T2I quando hai bisogno di modifiche o aderenza più stretta del prompt.",
        recraftV41:
          "Recraft V4.1. Costruito per il lavoro di progettazione: loghi, manifesti, imballaggi, annunci e qualsiasi cosa con le parole in esso. La tipografia pulita, la composizione forte, prende un'immagine di riferimento. Circa 3,5 crediti per immagine a circa 1K. Si applicano i filtri a valle. Go Pro per l'output di qualità della stampa 2K, Flash per bozze a buon mercato.",
        recraftV41Pro:
          "Il premio Recraft V4.1. Stesso senso di progettazione e tipografia affilata, a circa 2K con dettaglio più fine. Realizzato per stampa, colpi di prodotto e beni di marca che spediscono come sono. Circa 21 crediti per immagine, quindi abbozzo con V4.1 o Flash prima. Si applicano i filtri a valle.",
        recraftV41Flash:
          "Il livello di velocità di Recraft. Circa 1,5 secondi per immagine, sotto 1 credito ciascuno, il testo richiede solo. Buon per tavole d'umore, miniature e idee di prova in massa. Meno dettagli di Recraft V4.1. Si applicano i filtri a valle.",
        qwenImage3:
          "La variante rapida ed economica di Alibaba Qwen Image 3. Genera immagini da testo e le modifica partendo da un’immagine di riferimento. Utile per ritocchi veloci, grafiche ricche di testo e più tentativi. Qwen Image 3 Pro offre più dettaglio a un costo leggermente superiore. Per modifiche senza censura usa Qwen Edit Uncensored.",
        qwenImage3Pro:
          "La variante di Alibaba Qwen Image 3 che punta alla qualità. Parte da testo o da un’immagine di riferimento. Più dettaglio e finitura del modello base, a un costo leggermente superiore. Ottima per i ritocchi e il testo nelle immagini. Fascia aperta con limite sui contenuti espliciti. Per questi usa Qwen Edit Uncensored.",
        hailuo3:
          "MiniMax's Hailuo 3. Audio nativo, uscita 2K, clip fino a 15 secondi, primo e ultimo controllo della cornice. Un chiaro passo avanti da Hailuo 2.3 su carta, a circa il doppio del prezzo. Gamma di prezzo superiore; per più economico 1080p senza suono, utilizzare Hailuo 2.3 T2V.",
        seedance25:
          "ByteDance's Seedance 2.5. L'intestazione è lunghezza: clip fino a 30 secondi con controllo audio e frame nativo, a 480p o 720p. Il priciest Seedance per clip. Sceglilo per lunghi scatti continui; per clip brevi più nitide Seedance 2.0 raggiunge 4K.",
        flux3Video:
          "Flux 3 Video - Black Forest Labs modello di generazione video di punta con qualità eccezionale e rapida adesione.",
        grokImagineVideo15:
          "Grok Imagine Video 1.5 di xAI. Clip fino a 15 secondi a 480p, 720p o 1080p, con un primo fotogramma facoltativo. Risoluzione più alta di Grok T2V, a circa il doppio del prezzo. Fascia aperta: filtri più leggeri di Veo o Sora, con limite sui contenuti espliciti.",
        lyria3ProPreview:
          "Google's premium Lyria 3 tier, ancora in anteprima. Costruito per canzoni full-length con alta qualità di produzione. Principalstream: Si applicano i filtri di Google. Circa una e mezza volta il prezzo di Lyria 3. Lo stato dell'anteprima significa comportamento e disponibilità possono ancora cambiare.",
        lyria3ClipPreview:
          "Lyria 3 Clip di Google, in anteprima. Genera clip musicali rapide ed economiche per sigle, stacchi e post sui social. Si applicano i filtri convenzionali. Per brani più lunghi usa Lyria 3 o Lyria 3 Pro Preview.",
        geminiNanoBanana21:
          "Google Nano Banana 2.1. Genera e modifica le immagini direttamente nella chat, testo e immagini in una sola risposta. Circa 3 a 4 crediti per immagine, metà del prezzo dell'immagine dell'originale Nano Banana, che sostituisce. Forte a modifiche precise e testo leggibile in immagini. Filtri a valle, senza chiamate. Nano Banana Pro vince ancora su scene complesse, a circa quattro volte il prezzo.",
        seedream55:
          "ByteDance e' Seedream 5.5. Genera da testo o modifiche da fino a dieci immagini di riferimento. Forte a ritratti, personaggi coerenti e scene multi-immagine. 2 crediti per immagine, metà del prezzo di Seedream 4.5, che sostituisce. Aprire il livello: filtri più leggeri del mainstream, non espliciti.",
        flux3Image:
          "FLUX dei laboratori forestali neri.3. Dettagli più nitidi, testo più pulito e aderenza più stretta del prompt FLUX.2, da immagini di testo o di riferimento. Circa 5 crediti per immagine, più economico di FLUX.2 Max, che sostituisce. Aprire il livello, non esplicito. FLUX.2 Pro rimane più economico per il lavoro quotidiano; FLUX.3 Klein gestisce il volume.",
        flux3Klein:
          "Il piccolo, veloce FLUX.3. Sotto 1 credito per immagine, tra i più economici del catalogo, e ci vogliono ancora immagini di riferimento per le modifiche. Costruito per bozze, miniature e rinfuse. Meno dettagli del completo FLUX.3. Aprire il livello, non esplicito.",
        gptImage26Flare:
          "OpenAI GPT Image 2.6, variante di velocità. Testo o immagine di riferimento in, risultati puliti veloce, buono con testo e layout. Circa 4 crediti per immagine. Mainstream: si applicano i filtri rigorosi di OpenAI. Per composizioni dense e modifiche dettagliate-pesanti, utilizzare la sua sibling Sunburst.",
        gptImage26Sunburst:
          "OpenAI 's GPT Image 2.6, sintonizzato per i dettagli. Compostimenti densi, manifesti di testo-pesanti e modifiche che conservano i dettagli intatti intorno al giro. Circa 6 crediti per immagine. Mainstream: si applicano i filtri rigorosi di OpenAI. Flare è più veloce e più economico quando i dettagli sottili sono meno importanti.",
        geminiOmni12Flash:
          "Gemini Omni 1.2 Flash, il modello video di Google. Clip da 3 a 15 secondi con audio nativo, da 360p a 4K e controllo sul primo e sull’ultimo fotogramma. Circa 7 crediti al secondo a 720p e 10 a 1080p, meno di Veo 3.1 Fast alla stessa risoluzione. Si applicano i filtri di Google.",
        grokImagineVideo15Lite:
          "Il taglio veloce ed economico di Grok di xAI Immagina video 1.5. Clip da 1 a 15 secondi a 480p, 720p o 1080p, primo frame opzionale. 3 crediti al secondo a 720p, meno della metà del video originale Grok Imagine, che sostituisce. Trades una certa qualità per la velocità; pieno Grok Imagine Video 1.5 sembra meglio. Aprire il livello, non esplicito.",
        wan30:
          "Alibaba's Wan 3.0. Clips da 2 a 30 secondi con audio nativo, 480p a 1080p, primo e ultimo controllo frame. 10 crediti al secondo a 720p, stesso di Wan 2.7, che sostituisce, più un 480p tier a metà quello. Ci vuole molto tempo per un budget. Aprire il livello, non esplicito.",
        seedance2Mini:
          "Il budget Seedance 2.0. Testo o immagine a video, da 4 a 15 secondi, audio nativo, primo e ultimo controllo frame, a 480p o 720p. Circa 7.6 crediti al secondo a 720p, sotto Seedance 2.0 Fast. Buono per bozze e clip sociali; Seedance 2.0 raggiunge 4K quando ne hai bisogno. Aprire il livello, non esplicito.",
        seedance25Flash:
          "ByteDance's Seedance 2.5 Flash, la rapida Seedance 2.5. Testo o immagine a video, 4 a 30 secondi, audio nativo, a 480p o 720p. 8.4 crediti al secondo a 480p, 18.9 a 720p, sotto la completa Seedance 2.5. Ci vuole molto meno. Corre su Venice.ai, anonimizzata. Aprire il livello, non esplicito.",
        hailuo3Max:
          "MiniMax Hailuo 3 Max, un allenamento più veloce di Hailuo 3. Clip da 5 a 15 secondi a 768p o 480p con primo e ultimo controllo frame, senza suono. 8 crediti al secondo, ben sotto Hailuo 3. Sceglilo per veloci iterations; Hailuo 3 aggiunge 2K e audio nativo. Aprire il livello, non esplicito.",
        runwayGen45:
          "La pista e' Gen-4.5. Movimento cinematografico e forte aderenza del prompt, testo o un primo frame in, 2-10 secondi clip a 720p, nessun suono. 12 crediti al secondo, mid-range superiore. Una scelta forte per riprese in stile cinematografico; per il suono nella clip, utilizzare Veo 3.1 Fast o Wan 3.0. Aprire il livello, non esplicito.",
      },
    },
    modelUtilities: {
      adultExplicit: "Contenuti espliciti per adulti",
      adultImplied: "Contenuti allusivi per adulti",
      analysis: "Analisi",
      chat: "Chat",
      coding: "Programmazione",
      conspiracy: "Teorie del complotto",
      controversial: "Argomenti controversi",
      creative: "Scrittura creativa",
      fast: "Rapido",
      harmful: "Contenuti potenzialmente dannosi",
      illegalInfo: "Informazioni su attività illegali",
      imageGen: "Generazione di immagini",
      legacy: "Modelli precedenti",
      medicalAdvice: "Consigli medici",
      offensiveLanguage: "Linguaggio offensivo",
      politicalLeft: "Posizioni politiche di sinistra",
      politicalRight: "Posizioni politiche di destra",
      reasoning: "Ragionamento avanzato",
      roleplay: "Gioco di ruolo",
      roleplayDark: "Gioco di ruolo a tema oscuro",
      smart: "Intelligente",
      uncensored: "Senza censura",
      violence: "Violenza",
      vision: "Visione",
    },
    input: {
      attachments: {
        uploadFile: "File di aggancio",
        attachedFiles: "File allegati",
        addMore: "Aggiungi altro",
      },
    },
  },

  search: {
    brave: {
      category: "Information",
      get: {
        title: "Ricerca sul Web",
        dynamicTitle: "Ricerca: {{query}}",
        description:
          "Cerca su internet per informazioni, notizie, fatti o eventi recenti. Utilizzare questo quando avete bisogno di informazioni aggiornate o per verificare i fatti.",
        form: {
          title: "Parametri di ricerca",
          description: "Configurare la tua richiesta di ricerca web",
        },
        submitButton: {
          label: "Cerca",
          loadingText: "Cercando...",
        },
        backButton: {
          label: "Indietro",
        },
        fields: {
          query: {
            title: "Ricerca di Query",
            description:
              "Domanda di ricerca chiara e specifica. Usa parole chiave piuttosto che domande.",
            placeholder: "Inserisci la tua richiesta di ricerca...",
          },
          maxResults: {
            title: "Max risultati",
            description: "Numero di risultati da restituire (1-10)",
          },
          includeNews: {
            title: "Includi le notizie",
            description:
              "Includere i risultati delle notizie per gli eventi attuali",
          },
          freshness: {
            title: "Freschezza",
            description: "Filtra i risultati per quanto recenti sono",
            options: {
              day: "Giorno passato",
              week: "Rassegna",
              month: "Passato Mese",
              year: "Anno passato",
            },
          },
        },
        response: {
          success: {
            title: "Operazione riuscita",
            description: "Se la ricerca è stata di successo",
          },
          message: {
            title: "Messaggio",
            description: "Messaggio di stato sulla ricerca",
          },
          query: {
            title: "Query",
            description: "La query di ricerca che è stata eseguita",
          },
          results: {
            title: "Risultati",
            description: "Array dei risultati della ricerca",
            result: "Risultato",
            item: {
              title: "Risultato della ricerca",
              description: "Risultati di ricerca individuali",
              url: "URL",
              snippet: "Snippet",
              age: "Età",
              source: "Fonte",
            },
          },
          cached: {
            title: "Cached",
            description: "Se i risultati sono stati serviti dalla cache",
          },
          timestamp: {
            title: "Timestamp",
            description: "Quando la ricerca è stata eseguita",
          },
        },
        errors: {
          queryEmpty: {
            title: "La richiesta di ricerca è necessaria",
            description: "Si prega di fornire una query di ricerca",
          },
          queryTooLong: {
            title: "La ricerca è troppo lunga",
            description: "La query deve essere 400 caratteri o meno",
          },
          timeout: {
            title: "Ricerca richiesta time out",
            description: "La ricerca ha richiesto troppo tempo per completare",
          },
          searchFailed: {
            title: "Ricerca fallita",
            description: "Si è verificato un errore durante la ricerca",
          },
          validation: {
            title: "Ricerca non valida",
            description:
              "Si prega di controllare i parametri di ricerca e riprovare",
          },
          internal: {
            title: "Qualcosa di strano",
            description:
              "Non siamo riusciti a completare la tua ricerca. Per favore prova di nuovo",
          },
          notConfigured: {
            title:
              "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
            description: "Impostare {{label}} per abilitare la ricerca web",
          },
        },
        success: {
          title: "Ricerca di successo",
          description: "La ricerca web completata con successo",
        },
      },
      tags: {
        search: "Cerca",
        web: "Web",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Information",
      get: {
        title: "Cerca con Kagi",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Cerca su internet o ottieni risposte AI -powered utilizzando Kagi. La modalità FastGPT fornisce risposte complete con le fonti, mentre la modalità di ricerca restituisce risultati diretti.",
        form: {
          title: "Parametri di ricerca",
          description: "Configura la tua richiesta di ricerca Kagi",
        },
        submitButton: {
          label: "Cerca",
          loadingText: "Cercando...",
        },
        backButton: {
          label: "Indietro",
        },
        fields: {
          query: {
            title: "Ricerca di Query",
            description: "Domanda o domanda chiara e specifica di ricerca.",
            placeholder: "Inserisci la tua richiesta di ricerca...",
          },
          mode: {
            title: "Modalità di ricerca",
            description:
              "Scegliere tra AI -powered risposte (FastGPT) o risultati di ricerca diretti",
            options: {
              fastgpt: "FastGPT (risposte AI -powered)",
              search: "Ricerca (Risultati diretti)",
            },
          },
        },
        response: {
          success: {
            title: "Operazione riuscita",
            description: "Se la ricerca è stata di successo",
          },
          message: {
            title: "Messaggio",
            description: "Messaggio di stato sulla ricerca",
          },
          output: {
            title: "Risposta",
            description: "AI - risposta generata da FastGPT",
          },
          query: {
            title: "Query",
            description: "La query di ricerca che è stata eseguita",
          },
          references: {
            title: "Riferimenti",
            description: "Riferimenti e citazioni",
            reference: "Riferimento",
            item: {
              title: "Riferimento",
              description: "Riferimento sorgente con citazione",
              url: "URL",
              snippet: "Snippet",
            },
          },
          cached: {
            title: "Cached",
            description: "Se i risultati sono stati serviti dalla cache",
          },
          timestamp: {
            title: "Timestamp",
            description: "Quando la ricerca è stata eseguita",
          },
        },
        errors: {
          queryEmpty: {
            title: "La richiesta di ricerca è necessaria",
            description: "Si prega di fornire una query di ricerca",
          },
          queryTooLong: {
            title: "La ricerca è troppo lunga",
            description: "La query deve essere 400 caratteri o meno",
          },
          timeout: {
            title: "Ricerca richiesta time out",
            description: "La ricerca ha richiesto troppo tempo per completare",
          },
          searchFailed: {
            title: "Ricerca fallita",
            description: "Si è verificato un errore durante la ricerca",
          },
          validation: {
            title: "Ricerca non valida",
            description:
              "Si prega di controllare i parametri di ricerca e riprovare",
          },
          internal: {
            title: "Qualcosa di strano",
            description:
              "Non siamo riusciti a completare la tua ricerca. Per favore prova di nuovo",
          },
          notConfigured: {
            title:
              "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
            description: "Impostare {{label}} per abilitare la ricerca Kagi",
          },
        },
        success: {
          title: "Ricerca di successo",
          description: "La ricerca Kagi completata con successo",
        },
      },
      tags: {
        search: "Cerca",
        web: "Web",
        ai: "IA",
      },
    },
    enums: {
      provider: {
        BRAVE: "Ricerca di Brave",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "Agent",

    hotkey: {
      post: {
        title: "Hotkey vocale a testo",
        titleShort: "STT Hotkey",
        description:
          "Registrare e trascrivere l'audio con l'inserimento automatico del testo",
        form: {
          title: "Configurazione di Hotkey",
          description: "Configurare le impostazioni di hotkey vocale-text",
        },
        action: {
          label: "Azione",
          description: "Azione da eseguire (start/stop/toggle)",
          options: {
            start: "Inizio",
            stop: "Fermati.",
            toggle: "Toggle",
            status: "Stato",
          },
        },
        provider: {
          label: "Fornitore",
          description: "fornitore AI per trascrizione",
        },
        language: {
          label: "Lingua",
          description: "Lingua dell'audio",
        },
        insertPrefix: {
          label: "Inserisci il Prefisso",
          description: "Testo da inserire prima della trascrizione",
          placeholder: "ad es., '> '",
        },
        insertSuffix: {
          label: "Inserire il Suffisso",
          description: "Testo da inserire dopo trascrizione",
          placeholder: "ad esempio, '",
        },
        response: {
          title: "Risultato",
          description: "Risultato di registrazione e trascrizione",
          success: "Operazione riuscita",
          status: "Stato",
          message: "Messaggio",
          text: "Testo trascritto",
          recordingDuration: "Durata di registrazione (ms)",
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Devi essere connesso per usare questa funzione",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a elaborare la registrazione",
          },
          conflict: {
            title: "Conflitto",
            description: "Registrazione già in corso",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di usare questa funzione",
          },
          network: {
            title: "Errore di rete",
            description:
              "Non è riuscito a connettersi al servizio di trascrizione",
          },
          notFound: {
            title: "Non trovato",
            description: "Sessione non trovata",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Registrazione in corso",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          dependenciesMissing:
            "Dipendenze richieste non disponibili: {missing}. {recommendations}",
          invalidAction: "Azione non valida: {action}",
          actionFailed: "Impossibile eseguire l’azione: {error}",
          alreadyRecording: "Registrazione già in corso",
          notRecording: "Nessuna registrazione in corso",
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
        },
      },
      tags: {
        ai: "IA",
        transcription: "Trascrizione",
        speech: "Discorso",
        hotkey: "Hotkey",
        cli: "CLI",
      },
      platforms: {
        macos: "macOS",
        linuxWayland: "Linux (Wayland)",
        linuxX11: "Linux (X11)",
        windows: "Finestre",
      },
      status: {
        idle: "Idle",
        recording: "Registrazione",
        processing: "Lavorazione",
        completed: "Completo",
        error: "Errore",
      },
      actions: {
        start: "Avviare la registrazione",
        stop: "Smettere di registrare",
        toggle: "Toggle Registrazione",
        status: "Controllare lo stato",
      },
      recorderBackends: {
        ffmpegAvfoundation: "FFmpeg (AVFoundation)",
        ffmpegPulse: "FFmpeg (PulseAudio)",
        ffmpegAlsa: "FFmpeg (ALSA)",
        ffmpegDshow: "FFmpeg (DirectShow)",
        wfRecorder: "wf-recorder",
        arecord: "arecord",
      },
      typerBackends: {
        applescript: "AppleScript",
        wtype: "wtype",
        xdotool: "xdotool",
        wlClipboard: "wl-clipboard",
        xclip: "xclip",
        powershell: "PowerShell",
      },
    },
    post: {
      title: "Discorso a testo",
      description:
        "Convertire l'audio in testo utilizzando la trascrizione AI. Fatturato al secondo dell'audio al tasso del modello scelto",
      form: {
        title: "Trascrizione audio",
        description:
          "Caricare un file audio da trascrivere. Fatturato al secondo al tasso del modello scelto",
      },
      fileUpload: {
        title: "Caricamento file audio",
        description: "Carica il tuo file audio per la trascrizione",
      },
      audio: {
        label: "File audio",
        description: "File audio da trascrivere (MP3, WAV, WebM, ecc.)",
        validation: {
          maxSize: "La dimensione del file deve essere inferiore a 25MB",
          audioOnly: "Si prega di caricare un file audio o video",
        },
      },
      provider: {
        label: "Fornitore",
        description: "fornitore AI per trascrizione",
      },
      language: {
        label: "Lingua",
        description: "Lingua dell'audio",
      },
      response: {
        title: "Risultato della trascrizione",
        description: "Il testo trascritto dal tuo audio",
        success: "Operazione riuscita",
        text: "Testo trascritto",
        provider: "Fornitore utilizzato",
        confidence: "Confidenza Score",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per usare questa funzione",
        },
        validation: {
          title: "Errore di convalida",
          description: "Il file audio o i parametri non sono validi",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a elaborare la trascrizione",
        },
        apiKeyMissing: "La chiave Eden AI API non è configurata",
        transcriptionFailed: "Trascrizione non riuscita: {{error}}",
        audioTooShort:
          "Registrazione troppo breve. Tenere il pulsante più a lungo e parlare chiaramente.",
        noAudioFile: "Nessun file audio fornito",
        internalError: "Errore del server interno",
        noPublicId: "Nessun ID pubblico ricevuto",
        pollFailed: "Impossibile recuperare i risultati della trascrizione",
        failed: "Trascrizione fallita",
        timeout: "Tempo di trascrizione",
        creditsFailed: "Non è riuscito a dedurre i crediti: {{error}}",
        providerError:
          "Errore di servizio di trascrizione. Si prega di riprovare o contattare il supporto se il problema persiste.",
        balanceCheckFailed:
          "Non è possibile controllare il saldo di credito. Per favore prova di nuovo.",
        insufficientCredits:
          "Non hai abbastanza crediti per questa trascrizione. Si prega di aggiungere più crediti per continuare",
      },
      success: {
        title: "Operazione riuscita",
        description: "Audio trascritto con successo",
        transcriptionComplete: "Trascrizione completata con successo",
      },
    },
    providers: {
      openai: "OpenAI Whisper",
      assemblyai: "AssemblyAI",
      deepgram: "Deepgram",
      google: "Google Speech-to-Text",
      amazon: "Amazon Transcribe",
      microsoft: "Microsoft Azure",
      ibm: "IBM Watson",
      rev: "Rev.ai",
    },
    languages: {
      en: "Inglese",
      de: "Tedesco",
      pl: "Polacco",
      es: "Spagnolo",
      fr: "Francese",
      it: "Italiano",
    },
    models: {
      descriptions: {
        openaiWhisper:
          "Riconoscimento di Whisper di OpenAI, formato in 99 lingue. Trascrive interviste, note vocali e riunioni e si occupa bene di accenti e rumore di fondo. A buon mercato per uso. Nessun altoparlante etichette, e su lunghi silenzi può inventare il testo. Per un'opzione OpenAI più recente, prova GPT -4o Mini Transcribe.",
        deepgramNova2:
          "Deepgram Nova-2 - Veloce e preciso discorso-to-text con robustezza del rumore",
        whisperLargeV3:
          "Whisper Large V3 - Modello OpenAI a peso aperto, 99 lingue, molto più economico di quello ospitato sussurro-1.",
        voxtralSmall:
          "Voxtral Small di Mistral trascrive il parlato registrato.",
        voxtralMini:
          "Voxtral Mini Transcribe - Trascrizione Mistral con diarizzazione e timestamp segmenti, fino a 10 minuti.",
        nemotronAsr:
          "Nemotron ASR - NVIDIA riconoscimento vocale multilingue aperto, 40 locali, bassa latenza.",
        gpt4oMiniTranscribe:
          "GPT -4o Mini Transcribe - Tasso di errore di parola inferiore a Whisper, migliore rilevamento della lingua.",
      },
    },
  },
  textToSpeech: {
    category: "Agent",
    tags: {
      speech: "Discorso",
      tts: "Testo a velocità",
      ai: "IA",
    },

    post: {
      title: "Testo a Discorso",
      description:
        "Converti il testo in un discorso naturale utilizzando AI. Billed per personaggio al tasso della voce scelta",
      form: {
        title: "Testo a Conversione di Discorso",
        description:
          "Inserire il testo per convertire in discorso. Billed per personaggio al tasso della voce scelta",
      },
      text: {
        label: "Testo",
        description: "Testo da convertire in parola",
        placeholder: "Inserisci il testo che vuoi convertire in discorso...",
      },
      voice: {
        label: "Voce",
        description: "Modello vocale per la sintesi vocale",
      },
      response: {
        title: "Risultato audio",
        description: "L'audio vocale generato",
        success: "Operazione riuscita",
        audioUrl: "Audio URL",
      },
      errors: {
        validation_failed: {
          title: "Errore di convalida",
          description: "Il testo o i parametri forniti non sono validi",
        },
        network_error: {
          title: "Errore di rete",
          description: "Impossibile connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso all'utilizzo di text-to-speech",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di usare text-to-speech",
        },
        not_found: {
          title: "Non trovato",
          description: "La risorsa richiesta non è stata trovata",
        },
        server_error: {
          title: "Errore del server",
          description:
            "Si è verificato un errore durante la conversione del testo in parola",
        },
        unknown_error: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved_changes: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        notConfigured:
          "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
        conversionFailed: "La sintesi vocale è fallita: {{error}}",
        noText: "Nessun testo fornito",
        noAudioUrl: "Nessun audio URL ricevuto dal fornitore",
        audioFetchFailed:
          "Incapace di creare il file audio. Per favore prova di nuovo.",
        providerError: "Errore del provider: {{error}}",
        internalError: "Errore del server interno",
        unsupportedProvider:
          "provider TTS non supportato per voce: {{voiceId}}",
        creditsFailed: "Non è riuscito a dedurre i crediti: {{error}}",
        balanceCheckFailed:
          "Non è possibile controllare il saldo di credito. Per favore prova di nuovo.",
        insufficientCredits:
          "Non hai abbastanza crediti per questa conversione. Si prega di aggiungere più crediti per continuare",
      },
      success: {
        title: "Operazione riuscita",
        description: "Testo convertito in parola con successo",
        conversionComplete: "Sintesi del discorso completata con successo",
      },
    },
    languages: {
      en: "Inglese",
      de: "Tedesco",
      pl: "Polacco",
      es: "Spagnolo",
      fr: "Francese",
      it: "Italiano",
    },
    models: {
      descriptions: {
        openaiAlloy:
          "La voce della lega di OpenAI. Equilibrato e neutro, né chiaramente maschio né femmina, con un ritmo costante. Si adatta alla narrazione, agli spiegatori e al contenuto professionale in cui la voce dovrebbe rimanere fuori strada. Costa una piccola frazione di centesimo. Meno calore di Nova, meno peso di Onyx.",
        openaiNova:
          "La voce Nova di OpenAI. Luminoso, caldo e amichevole, con un tono femminile. Si adatta agli assistenti, alle app di conversazione e alle letture imbattibili. Molto a buon mercato. Meno adatto a materiale grave o formale; Onyx lo trasporta meglio.",
        openaiOnyx:
          "La voce Onyx di OpenAI. Voce maschile profonda e calma con autorità. Si adatta a documentari, narrazioni formali e annunci. Molto a buon mercato. Può sembrare pesante per chat casual; Nova è il più leggero, più amichevole pick.",
        openaiEcho: "OpenAI Echo - Chiaro, voce articolata con ritmo naturale",
        openaiShimmer:
          "OpenAI Shimmer - Voce espressiva e dinamica per coinvolgere contenuti",
        openaiFable: "OpenAI Fable - voce espressiva, narrante",
        elevenlabsRachel:
          "ElevenLabs Rachel - Voce femminile naturale con gamma emotiva",
        elevenlabsJosh:
          "ElevenLabs Josh - Voce maschile naturale con il tono conversazione",
        elevenlabsBella:
          "ElevenLabs Bella - Voce femminile caldo con consegna morbida",
        elevenlabsAdam:
          "ElevenLabs Adam - Voce maschio professionale per la creazione di contenuti",
        elevenlabsRachelTurbo:
          "ElevenLabs Rachel Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
        elevenlabsJoshTurbo:
          "ElevenLabs Josh Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
        elevenlabsBellaTurbo:
          "ElevenLabs Bella Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
        elevenlabsAdamTurbo:
          "ElevenLabs Adam Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
        kokoroBella:
          "Kokoro Bella - Modello 82M in peso aperto, voce femminile americana calda. Nessun filtro dei contenuti.",
        kokoroSarah:
          "Kokoro Sarah - Modello a peso aperto 82M, voce femminile americana chiara. Nessun filtro dei contenuti.",
        kokoroNicole:
          "Kokoro Nicole - Modello a peso aperto 82M, voce femminile soft low-key. Nessun filtro dei contenuti.",
        kokoroAdam:
          "Kokoro Adam - Modello a peso aperto 82M, voce maschile americana costante. Nessun filtro dei contenuti.",
        kokoroMichael:
          "Kokoro Michael - Modello di 82M a peso aperto, voce maschile americana sicura. Nessun filtro dei contenuti.",
        kokoroEmma:
          "Kokoro Emma - Modello 82M a peso aperto, voce femminile britannica. Nessun filtro dei contenuti.",
        kokoroGeorge:
          "Kokoro George - Modello di 82M a peso aperto, voce maschile britannica. Nessun filtro dei contenuti.",
        voxtralPaul:
          "Voxtral Mini legge testi inglesi con la voce neutra di Paul.",
        inworldAshley:
          "Inworld Ashley - Veloce, a basso costo voce femminile con consegna vivace.",
        inworldCraig:
          "Inworld Craig - Veloce, a basso costo voce maschile inglese.",
        xaiEve:
          "xAI Eve - Voce femminile espressiva con controlli di emozione in linea.",
        geminiZephyr:
          "Gemini Zephyr - Voce femminile brillante, 100+ lingue, istruzioni di consegna.",
        geminiPuck:
          "Gemini Puck - Voce maschile, 100+ lingue, istruzioni di consegna.",
      },
    },
  },
};
