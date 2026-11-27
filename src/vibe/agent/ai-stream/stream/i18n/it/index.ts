// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/it";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      titleShort: "Agente di corsa",
      dynamicTitle: "AI Run {{suffix}}: {{prompt}}",
      description:
        "Delega un compito ad un agente AI specializzato e restituisci la sua risposta. Per creare o modificare abilità/persone AI, delegare sempre a skill='skill-creator' - non tentare mai da soli. Passo abilità + prompt; l'agente gestisce tutto il resto. Crediti consumati in base al modello.",
      container: {
        title: "Agente AI eseguire",
        description:
          "Configurare i pre-call e il prompt per l'esecuzione AI senza testa",
      },
      fields: {
        favoriteId: {
          label: "ID preferito",
          description:
            "Slug di un favorito salvato (ad esempio 'thea-cheap'). Non una slitta di abilità. utilizzare il campo di abilità per questo. Carica abilità, modello e configurazione di strumento in un solo colpo. Priorità quando più set: modello > favoriteId > abilità.",
          placeholder: "thea-cheap",
        },
        model: {
          label: "Modello (solo CLI)",
          description:
            "Superare la LLM direttamente. CLI solo. altre piattaforme utilizzano favoriteId o abilità invece. Veloce: claude-haiku-4,5, gemini-2,5-flash. Equilibrato: claude-sonnet-4.6, gpt-5. Potente: claude-opus-4.7. Gratis: qwen3_235b-free.",
        },
        skill: {
          label: "Skill",
          description:
            "Slitta di abilità (ad esempio 'thea', ' thea__cheap-smart'). Non un slug preferito. utilizzare favoriteId per questo. Definisce la persona AI e il prompt dei sistemi. Utilizzare 'skill-creator' per creare / modificare le competenze.",
          placeholder: "predefinito",
        },
        prompt: {
          label: "Prompt",
          description:
            "L'istruzione principale o la domanda per lo AI. Sii specifico - lo AI utilizzerà i risultati preCalls come contesto se fornito.",
          placeholder: "Inserisci il tuo prompt...",
        },
        instructions: {
          label: "Istruzioni di sistema extra",
          description:
            "Istruzioni aggiuntive opzionali allegate al prompt del sistema. Utilizzare per limitare il formato, il tono o la lunghezza di uscita (ad esempio 'Sii conciso. JSON soltanto.').",
          placeholder: "Sii conciso. Un paragrafo max.",
        },
        preCalls: {
          label: "Pre-Calls",
          description:
            "Lo strumento chiama per eseguire prima del prompt. I risultati vengono iniettati come contesto. Utilizzare tool-help per scoprire gli strumenti disponibili e le loro arg.",
          routeId: {
            label: "Strumento ID",
            description:
              "Alias o nome completo strumento da chiamare (ad esempio 'web-search', ' agent_skills_GET '). Utilizzare tool-help per scoprire gli strumenti.",
            placeholder: "web-search",
          },
          args: {
            label: "Argomenti",
            description:
              'Argi a chiave piatta per lo strumento - unire urlPathParams e campi del corpo in un unico oggetto (ad esempio {"query": "ultimi notizie", "maxResults ": 5}).',
          },
        },
        availableTools: {
          label: "Consentito di eseguire",
          description:
            "[] = solo testo: nessun strumento, il modello scrive (utilizzalo per la stesura). Omettere di usare l'abilità o gli strumenti preferiti. Altre liste non sono ancora applicate.",
          toolId: {
            label: "Strumento ID",
            description:
              "Strumenti alias o nome completo (ad esempio 'execute-tool', 'tool-help', 'web-search')",
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
            "Strumenti caricati nel contesto del modello. null = set predefinito dell'utente. Colpisce solo ciò che il modello vede, non quello che può eseguire.",
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
            "Numero massimo di passaggi del modello per questa esecuzione. Lascia vuoto per usare il limite delle impostazioni della chat.",
        },
        appendThreadId: {
          label: "Filo ID (continua)",
          description:
            "UUID di un filo esistente per continuare. Il nuovo messaggio è allegato a quella conversazione. Omettere di avviare un filo fresco.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "Cartella di stoccaggio",
          description:
            "Dove memorizzare il filo. Sfondo = tutte le piste automatizzate (Dreamer, Autopilota, attività programmate). Privato = la tua cartella. Condividi = squadra. Incognito = nessun deposito.",
          placeholder: "background",
          options: {
            background: "Sfondo",
            private: "Privato",
            shared: "Condividi",
            public: "Pubblico",
            incognito: "Incognito (senza deposito)",
          },
        },
        subFolderId: {
          label: "Sottocartella ID",
          description:
            "UUID opzionale di una sottocartella all'interno della cartella principale. Per l'organizzazione manuale solo - fare NOT passare questo quando si chiama ai-run programmaticamente o da strumenti AI. Lasciare vuoto in tutti i contesti automatizzati/agenti.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        excludeMemories: {
          label: "Esclusi i ricordi",
          description:
            "Saltare l'iniezione di memorie memorizzate in contesto. Utilizzare per bot pubblici o attività isolate. Predefinito: falso.",
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
      requireFavOrSkill:
        "Fornire almeno uno di: favoriteId, abilità o modello (solo CLI). Non può funzionare senza un modello risolvibile e abilità.",
      skillNotFound:
        "Skill ' {{skill}}' non trovato. Se si tratta di una slug preferita (ad esempio 'thea-cheap'), utilizzare -- favoriteId invece di --skill.",
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
      modelAdminOnly:
        "{{model}} non è disponibile sul tuo account. Scegli un altro modello.",
      threadPostForbidden:
        "Nessun diritto di pubblicazione in questo thread. Avviare una nuova chat per continuare.",
      fileTypeNotAllowed: "Tipo di file non consentito: {{fileType}}",
      uncensoredApiKeyMissing: "Uncensored.ai API chiave non configurata",
      openrouterApiKeyMissing: "OpenRouter API chiave non configurata",
      streamCreationFailed:
        "Non è riuscito a connettersi al servizio AI. Per favore, riprovate.",
      unknownError: "Si è verificato un errore",
      creditValidationFailed: "Non convalidare il saldo di credito",
      noIdentifier: "Nessun identificatore utente o lead fornito",
      insufficientCredits:
        "Crediti insufficienti. La richiesta costa {{cost}} e il tuo saldo è {{balance}}. Ricarica o scegli un modello più economico.",
      noResponseBody: "Nessun corpo di risposta ricevuto dal flusso",
      authenticationRequired:
        "Si prega di accedere per utilizzare cartelle persistenti. Utilizzare la modalità incognito per chat anonime.",
    },
  },
  post: {
    title: "AI Stream Chat",
    titleShort: "Chatta AI",
    description:
      "Stream AI -powered chat risposte utilizzando qualsiasi modello di chat (Claude, GPT, Gemini, Llama, e altro ancora). Supporta testo, voce, allegati di file e l'uso di strumenti agentic.",
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
      options: {
        private: "Privato",
        shared: "Condividi",
        public: "Pubblico",
        incognito: "Incognito (senza deposito)",
        background: "Sfondo",
      },
    },
    subFolderId: {
      label: "Sottocartella",
      description: "Sottocartella opzionale all'interno della cartella radice",
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
    incognitoThreadTitle: {
      label: "Titolo del filo incentivo",
      description:
        "Titolo attuale del thread incognito - inviato dal client perché i filetti incognito non hanno una riga server",
    },
    incognitoThreadDescription: {
      label: "Incognito Thread Descrizione",
      description: "Descrizione attuale del filo incognito",
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
        tool: "Strumento",
        error: "Errore",
      },
    },
    model: {
      label: "Modello",
      description: "Modello AI da utilizzare per la generazione",
    },
    skill: {
      label: "Skill",
      description:
        'Abilitare id o slug dalla lista delle competenze (opzionale slug__variant). Omettere o utilizzare "default" per nessuno. Gli ids sconosciuti ritornano al default.',
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
        description: "ID del messaggio contenente la chiamata dello strumento",
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
      description: "Token per il recupero di flussi interrotti",
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
    executionContext: {
      label: "Contesto di esecuzione",
      description:
        "Come viene eseguito questo flusso: relè locale, remoto o inferenza-provider. Le richieste di chat normali utilizzano locale (default).",
    },
    response: {
      title: "Risposta in streaming",
      description: "AI - risposta di streaming generata",
      success: "Stream completato con successo",
      messageId: "Messaggio ID",
      threadId: "File ID",
      totalTokens: "Token totali utilizzati",
      finishReason: "Motivo di completamento",
      lastAiMessageContent: "Contenuto del messaggio finale AI",
      lastGeneratedMediaUrl: "Media generati URL",
      totalCreditsDeducted: "Crediti dedotti",
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
      serviceUnavailable: {
        title: "Istanza remota non disponibile",
        description:
          "L'istanza collegata che questo thread dipende da non può essere raggiunto",
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
  info: {
    streamInterrupted:
      "La generazione e' stata fermata. La risposta parziale è stata salvata.",
    billingFailed:
      "Fermati: non potevamo addebitare crediti per questa risposta. Non c'era nulla da perdere - rimandare il tuo messaggio in un momento.",
    budgetExceeded:
      "Stopped: questo compito di sfondo ha raggiunto il suo tappo di credito. Alzare il berretto in Task Budget Caps per lasciare che continui.",
    taskWatchdog:
      "Fermato: il task watchdog ha concluso questa corsa perché ha superato il suo tempo, turno o limite di chiamata strumento.",
    turnStepLimit:
      "L’IA si è fermata dopo {{steps}} passaggi. Scrivi «Continua» per riprendere da dove si era fermata.",
    raiseTurnStepLimit: "Aumenta il limite nelle impostazioni della chat",
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
    timeout: "L’IA ha smesso di rispondere. Riprova.",
    noResponse: "Lo AI non ha generato una risposta. Per favore, riprovate.",
    creditBudgetReached:
      "Crediti esauriti. La risposta si è interrotta quando hai finito i crediti. Ricarica per continuare.",
    emptyAnswer:
      "Il modello si è concluso senza scrivere una risposta. Hai pagato solo ciò che il fornitore ha addebitato, nessuna tassa di piattaforma. Prova di nuovo o scegli un altro modello.",
    contentFiltered:
      "Questa risposta è stata bloccata dal filtro dei contenuti del fornitore. Prova un modello diverso.",
    contextTooLong:
      "Troppo lungo per la finestra di contesto di questo modello. Accorcia il messaggio, avvia una nuova chat o scegli un modello con una finestra di contesto più ampia.",
    imageTooLarge:
      "L’immagine supera il limite di dimensioni del modello. Riducila e inviala di nuovo.",
    malformedToolCall:
      "Il modello ha inviato una chiamata a uno strumento non valida, quindi non è stata eseguita. Premi Continua e riproverà.",
    providerBusy:
      "Questo modello è sovraccaricato in questo momento. Riprovare in pochi secondi o scegliere un altro modello.",
    modelRetired:
      "Il modello {{model}} è stato ritirato. Scegli un altro modello per continuare.",
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
  modelRetiredNotice:
    "Il modello {{model}} è stato ritirato. Al suo posto c’è {{successor}}. La cronologia della chat resta disponibile.",
  headless: {
    errors: {
      // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
      // Either pass model+skill directly, or pass favoriteId pointing to a favorite
      // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
      missingModelOrSkill:
        "modello o abilità richieste - passare uno direttamente o fornire un favoriteId con una selezione di modelli risolvibile",
      favoriteNotFound:
        "Preferito non trovato o non appartiene a questo utente",
      ambiguousModel:
        "Fornire a EITHER un modello esplicito o un favorito/skill - non entrambi",
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Errore Uncensored.ai API ({{status}}): {{errorText}}",
      },
    },
  },
  onboarding: {
    signin: {
      title: "Tieni la tua configurazione",
      subtitle: "Accedi una volta. Tutto quello che crei qui ti segue.",
      benefits: {
        sync: {
          title: "Sincronizzato su ogni dispositivo",
          body: "Il tuo compagno, gli specialisti e le chat su ogni dispositivo che usi.",
        },
        keep: {
          title: "Non perdi mai il tuo lavoro",
          body: "Da ospite la configurazione vive solo in questo browser. Accedi e resta tua.",
        },
        private: {
          title: "Privato per impostazione",
          body: "Decidi tu sui tuoi dati e sul livello di filtro. Sempre.",
        },
      },
      cta: "Accedi o crea un account",
      continueAsGuest: "Continua come ospite",
      note: "Puoi accedere più tardi dal menu, quando vuoi.",
    },
    setup: {
      title: "Configura la tua IA",
      subtitle:
        "Scegli con chi parli. Aggiungi specialisti se vuoi. Puoi cambiare tutto dopo.",
      arrivalTitle: "Inizia con {{skill}}",
      arrivalSubtitle:
        "{{skill}} risponde in questa chat. Il tuo compagno pensa al resto.",
      arrivalLabel: "La tua skill",
      arrivalBadge: "Inclusa",
      companionLabel: "Il tuo compagno",
      specialistsLabel: "Aggiungi specialisti",
      optional: "facoltativo",
      start: "Inizia a chattare",
      saving: "Configurazione...",
      failed:
        "Impossibile salvare la configurazione. Controlla la connessione e riprova.",
      retry: "Riprova",
      noProviderAvailable:
        "Nessun provider AI configurato. Aggiungi OPENROUTER_API_KEY o attiva Claude Code (CLAUDE_CODE_ENABLED=true) per continuare.",
    },
    usecases: {
      coding: "Codice e tech",
      research: "Ricerca e analisi",
      writing: "Scrittura e revisione",
      business: "Business e strategia",
      creative: "Creatività e storie",
      learning: "Studio",
      health: "Salute e carriera",
      controversial: "Pensiero libero",
      roleplay: "Giochi di ruolo e personaggi",
    },
  },
  input: {
    placeholder: "Invia un messaggio...",
    imagePlaceholder: "Descrivi un'immagine per generare...",
    audioPlaceholder: "Descrivere audio o musica per generare...",
    noPermission: "Non hai il permesso di postare qui",
    signInToPost: {
      title: "Account gratuito per scrivere",
      description:
        "Le discussioni pubbliche le legge chiunque. Per aprirne una o rispondere serve un account gratuito, e poi torni subito qui.",
    },
    noCredits: {
      title: "Crediti esauriti",
      addCredits: "Aggiungi crediti",
      description:
        "Hai esaurito i crediti. Ricarica per continuare a chattare.",
    },
    creditsLoadFailed: {
      title: "Impossibile caricare il saldo.",
      retry: "Riprova",
    },
    insufficientCredits: {
      title: "Crediti insufficienti (ne servono {{cost}}, ne hai {{balance}})",
      description: "Ricarica o scegli un modello più economico.",
    },
    noModel: {
      title: "Nessun modello selezionato",
      description:
        "Scegli prima un modello. Nessuna lista? Controlla le chiavi API del tuo fornitore.",
    },
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
      unreadable:
        "Il browser non ha potuto leggere un allegato. Rimuovilo e seleziona di nuovo il file.",
    },
  },
  outOfCredits: {
    dismiss: "Chiudi",
    dailyLimit: {
      title: "Limite gratuito di oggi raggiunto",
      whyCaller:
        "I crediti gratuiti hanno un limite giornaliero per dispositivo e rete.",
      whyPool:
        "Tutti i visitatori condividono un limite giornaliero di crediti gratuiti, e quello di oggi è esaurito.",
      kept: "I tuoi {{balance}} crediti gratuiti restano tuoi e tornano attivi alle {{time}} ({{relative}}).",
      keptNoBalance:
        "I tuoi crediti gratuiti restano tuoi e tornano attivi alle {{time}} ({{relative}}).",
      lighterFits: "Il limite di oggi basta ancora per {{model}}.",
      pickLighter: "Scegli un modello più leggero",
      guestPlan:
        "Non vuoi aspettare? Per un piano serve un account gratuito. I crediti a pagamento funzionano subito.",
    },
    inFlight: {
      title: "Una risposta è ancora in corso",
      description:
        "I tuoi crediti gratuiti la stanno coprendo. Lasciala finire, poi invia di nuovo.",
    },
    guest: {
      title: "Crediti gratuiti esauriti",
      description:
        "Con un account gratuito hai {{signedIn}} crediti al mese, {{max}} con la newsletter. Dopo la registrazione torni subito qui.",
      privacy:
        "Email solo per l'accesso. Niente telefono, niente carta, nessun tracker di terze parti.",
      signUp: "Iscriviti gratis",
      haveAccount: "Hai già un account?",
      logIn: "Accedi",
    },
    member: {
      title: "Hai esaurito i crediti",
      shortTitle: "Crediti insufficienti per questo messaggio",
      shortDescription:
        "Hai {{balance}} crediti. Nelle chat lunghe ogni messaggio costa di più. Avvia una nuova chat, scegli un modello più economico o ricarica:",
      description:
        "I crediti gratuiti si rinnovano il {{date}}. Scegli un piano per continuare subito:",
      subscriberDescription:
        "I crediti del piano si rinnovano il {{date}}. Te ne servono prima? Ricarica o passa a un piano superiore:",
      orTopUp: "Oppure salta l'attesa:",
      newsletter: {
        title: "+ Crediti gratuiti {{bonus}} ogni mese",
        consent:
          "Iscriviti alla newsletter con {{email}}: notizie sui prodotti e nuovi modelli, cancella in qualsiasi momento. Prima e-mailremo un link di conferma.",
        claim: "Iscriviti per + {{bonus}} /mese",
        claiming: "Invio in corso…",
        pending:
          "Controllare {{email}} e fare clic sul link di conferma per sbloccare + crediti {{bonus}} / mese.",
      },
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
      retry: "Riprova",
      download: "Scarica Audio",
      downloadHint:
        "Scaricare il file e collegarlo al tuo prossimo messaggio invece.",
    },
  },
  actions: {
    cancellingGeneration: "Cancelliere...",
    stopGeneration: "Fermati.",
    sendMessage: "Invia",
    openThread: "Aprire il filo",
  },
  toolsButton: {
    title: "Strumenti AI",
    tools: "Strumenti",
  },
  config: {
    folders: {
      private: "Privato",
      shared: "Condividi",
      public: "Pubblico",
      background: "Sfondo",
      incognito: "Incognito",
      remote: "Telecomando",
    },
  },
  models: { names: modelTranslations.names },
};
