import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    threadModerationStatus: {
      visible: "Visibile",
      underReview: "In rassegna",
      removed: "Rimozione",
    },
    threadReportReason: {
      spam: "Spam",
      illegal: "Contenuto illegale",
      abuse: "Abuso o molestie",
      csamFlag: "Sicurezza dei bambini",
      other: "Altro",
    },
    threadModerationAction: {
      dismiss: "Resoconti di licenziamento (restore)",
      remove: "Rimuovere i contenuti",
      banAuthor: "Rimuovere e vietare l'autore",
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
    autoModeDescription: "Il modello migliore è selezionato in base ai filtri",
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
    failedWithMessage: "Non riuscito a catturare screenshot: {{message}}",
    tryAgain: "Non ha catturato lo screenshot. Per favore, riprovate.",
    noMessages:
      "Non sono riuscito a trovare l'area messaggi di chat. Si prega di assicurarsi di avere messaggi nella chat.",
    quotaExceeded:
      "La quota di stoccaggio è superata. L'immagine è troppo grande.",
    canvasError:
      "Non è riuscito a convertire lo screenshot in formato immagine.",
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
      "permission-dismissed":
        "Pronti per microfono chiuso. Toccare nuovamente il microfono e scegliere Consentire.",
      "permission-denied-site":
        "Microfono bloccato per questo sito. Fare clic sull'icona a sinistra della barra degli indirizzi → Microfono → Consentire, quindi riprovare.",
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
        "Uncensored AI modello per conversazioni creative e senza restrizioni",
      freedomgptLiberty:
        "FreedomGPT Liberty - Uncensored AI modello focalizzato sulla libera espressione e il contenuto creativo",
      gabAiArya:
        "Gab AI Arya - Uncensored conversazione AI modello con espressione libera e capacità creative",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Anteprima (Attrezzi personalizzati) - Gemini 3.1 Pro variante con una migliore selezione degli strumenti che impedisce il sovrautilizzo di strumenti di bash a favore di funzioni di terze parti più efficienti, ideali per gli agenti di codifica e i flussi di lavoro multi-tool",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview - Il modello multimodale di Google che genera immagini direttamente dai prompt dei testi tramite chat, supportando sia l'output di testo che di immagine nella stessa conversazione",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Anteprima - modello ad alta efficienza di Google ottimizzato per casi di utilizzo ad alto volume, superando Gemini 2.5 Flash Lite con miglioramenti nella classifica audio, RAG, traduzione e completamento del codice",
      gemini3Pro:
        "Google Gemini 3 Pro - Modello avanzato multimodale AI con grande finestra di contesto e potenti capacità di ragionamento",
      gemini35Flash:
        "Gemini 3.5 Flash - Codifica Near-Pro e ragionamento a costo di Flash. gestisce testo, immagini, video, audio e PDF. Cicli agentici paralleli incorporati. Livelli di pensiero dal minimo all'alto per un controllo preciso dei costi/prestazioni.",
      gemini3Flash:
        "Google Gemini 3 Flash - Modello AI multimodale veloce ed efficiente ottimizzato per risposte rapide",
      deepseekV32:
        "DeepSeek V3.2 - Modello di ragionamento ad alte prestazioni con funzionalità di codifica avanzate",
      deepseekV4Pro:
        "DeepSeek V4 Pro - 1.6T parametro Powerhouse MoE con contesto 1M. Costruito per analisi full-codebase, ragionamento complesso e flussi di lavoro multi-step agente.",
      deepseekV4Flash:
        "DeepSeek V4 Flash - 284B MoE a costi quasi zero. contesto 1M, inferenza veloce, codifica forte. La scelta efficiente per carichi di lavoro ad alto rendimento.",
      gpt55:
        "GPT-5.5 - modello di frontiera OpenAI per carichi di lavoro professionali complessi. Ragione più forte, maggiore affidabilità, migliore efficienza dei token. contesto 1M+ con ingressi di testo e immagine.",
      gpt55Pro:
        "GPT-5.5 Pro - OpenAI modello di maggiore capacità per ragionamento profondo su carichi di lavoro complessi e ad alto consumo. contesto 1M+, risoluzione di problemi a lungo raggio, codificazione agentica, esecuzione multi-step precisa.",
      gpt54Pro:
        "GPT-5.4 Pro - modello più avanzato di OpenAI con ragionamento migliorato, finestra di contesto 1M+ e prestazioni superiori per le attività complesse e ad alto consumo",
      gpt54:
        "GPT-5.4 - L'ultimo modello di frontiera di OpenAI che unifica Codex e GPT, con finestra di contesto 1M+ per ragionamento ad alto contenuto, codifica e analisi multimodale",
      gpt53Codex:
        "GPT-5.3 -Codex - OpenAI modello di codifica agentec più avanzato che combina l'ingegneria del software di frontiera con un ampio ragionamento, ottimizzato per flussi di lavoro a lungo termine e complessi compiti di sviluppo",
      gpt53Chat:
        "GPT-5.3 Chat - Aggiornato modello di conversazione ChatGPT che fornisce risposte più accurate e contestuali con rifiuti e grotte non necessari significativamente ridotti",
      gpt52Pro:
        "GPT-5.2 Pro - Modello avanzato OpenAI con funzionalità di ragionamento e codifica migliorate",
      gpt52:
        "GPT-5.2 - Modello OpenAI ad alte prestazioni per compiti e analisi complesse",
      gpt52_chat:
        "GPT-5.2 Chat - Modello OpenAI ottimizzato per le interazioni con la conversazione",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Modello linguistico non censurato basato su Mistral",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Modello in lingua grande non censurato basato su Llama 3",
      veniceUncensored:
        "Venice Uncensored 1.1 - Modello AI non censurato con supporto per la chiamata degli strumenti. Progettato per la massima libertà creativa e l'interazione autentica. Ideale per l'esplorazione, il gioco di ruolo e il dialogo non filtrato con restrizioni minime di contenuto.",
      claudeOpus45:
        "Claude Opus 4.5 - Il più potente modello Claude con eccezionali capacità di ragionamento e creatività",
      claudeOpus46:
        "Claude Opus 4.6 - Potente modello Claude con eccezionali capacità di ragionamento e creatività",
      claudeOpus47:
        "Claude Opus 4.7 - Modello Opus di generazione precedente. E' successo di 4,8.",
      claudeOpus48:
        "Claude Opus 4.8 - Anthropic è il modello Opus più in grado in generale. Costruito per lavori agentici a lungo raggio, codifica complessa e ragionamento multi-passo attraverso uscite molto lunghe. Supporta ingressi di testo, immagine e file.",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Il modello Sonnet-class più capace di Anthropic con prestazioni di frontiera attraverso la codifica, gli agenti e il lavoro professionale",
      claudeHaiku45:
        "Claude Haiku 4.5 - Modello Claude veloce ed efficiente ottimizzato per velocità e convenienza",
      glm5_1:
        "GLM-5.1 - Z. AI modello di codifica di nuova generazione costruito per le attività a lungo raggio. Funziona autonomamente per 8+ ore su un unico compito - pianificazione, esecuzione e auto-miglioramento fino a quando non fornisce risultati di livello ingegneristico.",
      glm5: "GLM-5 - Z. AI modello di fondazione open-source di punta progettato per la progettazione di sistemi complessi e flussi di lavoro di agente a lungo raggio, rivalendo i principali modelli di risorse chiuse",
      glm5Turbo:
        "GLM-5 Turbo - Z. AI modello di nuova generazione profondamente ottimizzato per ambienti con inferenza rapida, migliore decomposizione delle istruzioni complesse e stabilità del compito estesa",
      glm46:
        "GLM-4 6B - Efficiente modello bilingue cinese-inglese AI con forti capacità generali",
      glm47:
        "GLM-4 7B - Modello bilingue cinese-inglese avanzato con migliori capacità di ragionamento e codifica",
      glm47Flash:
        "GLM-4 7B Flash - modello cinese-inglese ultraveloce ottimizzato per risposte rapide",
      kimiK2:
        "Kimi K2 - Potente modello cinese AI con eccellente comprensione del contesto",
      kimiK2_5:
        "Kimi K2.5 - Moonshot AI modello di generazione precedente con forti ragionamenti a lungo contenuto e capacità di codifica",
      kimiK2_6:
        "Kimi K2.6 - Moonshot AI modello multimodale di nuova generazione per codifica a lungo raggio, generazione UI / UX da pronte e immagini, e orchestrazione multi-agent con scalo di architettura agente swarm a centinaia di sub-agenti paralleli",
      claudeSonnet45:
        "Claude Sonnet 4.5 - modello Sonnet di prima generazione di Anthropic con una forte codifica e capacità analitiche",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Autonomo agente AI alimentato da Claude Sonnet tramite l'agente Anthropic SDK. Esegue strumenti indipendentemente con ragionamento incorporato.",
      claudeAgentHaiku:
        "Claude Agent Haiku - Veloce agente autonomo AI alimentato da Claude Haiku tramite l'agente Anthropic SDK. Ottimizzato per la velocità con l'esecuzione degli strumenti.",
      claudeAgentOpus:
        "Claude Agent Opus - Il più potente agente AI autonomo alimentato da Claude Opus tramite l'agente Anthropic SDK. Massima intelligenza con l'esecuzione degli strumenti.",
      grok4:
        "Grok 4 - modello di ragionamento di punta di xAI con capacità di visione e ricerca web",
      grok4Fast:
        "Grok 4 Fast - modello ad alta velocità di xAI con contesto token 2M ottimizzato per risposte rapide",
      grok43:
        "Grok 4.3 - modello di ragionamento di xAI con contesto token 1M, elevata precisione di fatto e ragionamento sempre in funzione dei flussi di lavoro agentici e della ricerca profonda",
      grok420Beta:
        "Grok 4.20 (Legacy) - il precedente modello di punta di xAI con chiamata degli strumenti agentic, basso tasso di allucinazione e contesto di token 2M",
      gpt5Pro:
        "GPT-5 Pro - modello premium OpenAI con ragionamento superiore e funzionalità di codifica avanzate",
      gpt5Codex:
        "GPT-5 Codex - modello di codifica specializzato OpenAI con eccezionali capacità di programmazione e tecnica",
      gpt51Codex:
        "GPT 5.1 Codex - Aggiornato modello di codifica OpenAI con funzionalità creative e di programmazione migliorate",
      gpt51:
        "GPT 5.1 - L'efficiente modello generico di OpenAI con forte ragionamento e analisi",
      gpt5: "GPT-5 - modello di punta di OpenAI con ampia intelligenza e funzionalità versatili",
      gpt54Mini:
        "GPT-5.4 Mini - L'efficiente variante GPT-5.4 di OpenAI ottimizzata per carichi di lavoro ad alto rendimento con forte ragionamento, codifica e utilizzo degli utensili a costi ridotti",
      gpt54Nano:
        "GPT-5.4 Nano - Il modello più leggero e conveniente di OpenAI ottimizzato per compiti critici come la classificazione, l'estrazione dei dati e l'esecuzione sub-agent",
      gpt5Mini:
        "GPT-5 Mini - modello veloce leggero di OpenAI per le attività quotidiane veloci",
      gpt5Nano:
        "GPT-5 Nano - il modello più piccolo e conveniente di OpenAI per semplici compiti di conversazione",
      gptOss120b:
        "GPT - OSS 120B - modello di parametri open source 120B di OpenAI con forti capacità di codifica",
      kimiK2Thinking:
        "Kimi K2 Thinking - modello ragionato di Kimi con un pensiero analitico e passo",
      minimaxM27:
        "MiniMax M2.7 - Il modello di agentic di nuova generazione di MiniMax costruito per la produttività autonoma del mondo reale, la collaborazione multi-agent e i flussi di lavoro di produzione tra cui il debug del codice, la modellazione finanziaria e la generazione dei documenti",
      mimoV2Pro:
        "MiMo V2 Pro - modello di base dei parametri 1T+ di Xiaomi con contesto 1M, profondamente ottimizzato per l'orchestrazione degli agenti, l'automazione dei flussi di lavoro complessi e le attività di ingegneria della produzione",
      glm45Air:
        "GLM 4.5 AIR - modello ultra-veloce di AI per le interazioni con le conversazioni veloci",
      glm45v:
        "GLM 4. 5v - Z. AI modello visionabile con capacità di comprensione e chat dell'immagine",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - Google modello entry-level Gemini con ampio contesto e risposte rapide",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - Modello multimodale efficiente di Google con contesto token 1M per compiti veloci",
      geminiFlash25Pro:
        "Gemini 2.5 Pro - Modello Pro di generazione precedente di Google con ampio contesto e forte ragionamento",
      deepseekV31:
        "DeepSeek V3.1 - Modello di precedente generazione DeepSeek con forti capacità di codifica e analisi",
      deepseekR1:
        "DeepSeek R1 - Il modello di messa a fuoco ragionata di DeepSeek con risoluzione avanzata dei problemi passo-passo",
      qwen3235bFree:
        "Qwen3 235B - Grande modello aperto di Alibaba con parametri 235B per compiti complessi di codifica e ragionamento",
      deepseekR1Distill:
        "DeepSeek R1 Distillazione - Versione compatta distillata DeepSeek R1 con capacità di ragionamento efficienti",
      qwen257b:
        "Qwen 2.5 7B - Il modello compatto 7B di Alibaba per compiti di conversazione veloci e convenienti",
      dallE3:
        "DALL -E 3 - Modello di generazione di immagini OpenAI con immagini dettagliate e di alta qualità da richieste di testo",
      gptImage1:
        "GPT -Image-1 - OpenAI modello di generazione rapida e conveniente dell'immagine",
      fluxSchnell:
        "Flux Schnell - Modello di generazione rapida delle immagini Black Forest Labs ottimizzato per la velocità",
      fluxPro:
        "Flux Pro 1.1 - Modello professionale di generazione di immagini dei laboratori forestali neri con qualità superiore e aderenza rapida",
      flux2Max:
        "FLUX.2 Max - Black Forest Labs' modello di immagine superiore con la più alta qualità dell'immagine, la comprensione rapida e la coerenza di editing",
      flux2Klein4b:
        "FLUX.2 Klein 4B - Black Forest Labs modello di immagine più veloce e conveniente, ottimizzato per casi di utilizzo ad alto rendimento",
      riverflowV2Pro:
        "Riverflow V2 Pro - Il modello di generazione delle immagini più potente di Sourceful con controllo superiore e rendering perfetto del testo",
      riverflowV2Fast:
        "Riverflow V2 Fast - Il modello di generazione delle immagini più veloce di Sourceful, ottimizzato per le implementazioni di produzione e i flussi di lavoro critici di latenza",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Anteprima - La più potente variante di anteprima di Sourceful, unificato modello di testo-immagine e immagine-immagine",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Anteprima - La variante di anteprima standard di Sourceful, il modello unificato di testo per immagine e immagine per immagine superiore alla famiglia Riverflow 1",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview - La variante di anteprima più rapida di Sourceful, il modello unificato di testo-immagine e immagine-immagine al punto di prezzo più basso",
      flux2Flex:
        "FLUX.2 Flex - Il modello di immagine dei Black Forest Labs si escellerà in un'architettura unificata con il rendering di testo complesso, la tipografia e la modifica multi-referenza",
      flux2Pro:
        "FLUX.2 Pro - Black Forest Labs' modello di generazione e editing di alta gamma con qualità visiva a livello di frontiera, forte aderenza del prompt e riproduzione coerente dei caratteri",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Anteprima) - Il modello di generazione di immagini più avanzato di Google con un migliore ragionamento multimodale, messa a terra reale, sintesi visiva ad alta fedeltà e rendering di testo leader nel settore",
      gpt5ImageMini:
        "GPT-5 Immagine Mini - OpenAIEfficiente modello multimodale di generazione dell'immagine che combina GPT-5 Mini capacità linguistiche con generazione di immagini veloce e conveniente",
      gpt5Image:
        "GPT-5 Image - Il modello multimodale di punta di OpenAI combina le capacità linguistiche GPT-5 con la generazione e la modifica dell'immagine all'avanguardia",
      gpt54Image2:
        "GPT-5.4 Image 2 - Il modello multimodale di nuova generazione di OpenAI combina il ragionamento GPT-5.4 con la generazione GPT Image 2. Si muove senza soluzione di continuità tra codifica, analisi e creazione visiva in una singola conversazione.",
      seedream45:
        "Seedream 4.5 - L'ultimo modello di generazione di immagini di ByteDance con miglioramenti completi nella composizione di consistenza, raffinatezza del ritratto e composizione multi-immagine",
      sdxl: "Stable Diffusion XL - modello di generazione di immagini aperte di alta qualità di AI",
      cassetteMusic:
        "CassetteAI Music - generazione veloce di testo-musica su Fal.ai con lunghezze di clip fino a tre minuti",
      musicgenStereo:
        "MusicGen Stereo - Il modello di generazione di musica stereo open source di Meta via Replicate",
      stableAudio:
        "Stable Audio - Stability AI modello di musica e generazione audio per clip di alta qualità",
      udioV2:
        "Udio v2 - Generazione musicale AI di alta qualità con voce e qualità di produzione completa",
      modelsLabMusicGen:
        "ModelsLab Music Gen - AI generazione musicale da richieste di testo, supportando l'uscita MP3/ WAV / FLAC",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music - Generazione musicale di alta qualità alimentata da ElevenLabs tramite ModelsLab",
      modelsLabSonautoSong:
        "Sonauto Song - Full song generation with vocals, supportando vari generi fino a 4:45 min brani",
      modelsLabLyria3:
        "Lyria 3 - Google modello avanzato di generazione musicale che crea brani originali di 30 secondi dal testo",
      modelsLabCogVideoX:
        "CogVideoX - ModelliIl modello text-to-video di Lab per la generazione di clip video brevi",
      modelsLabWanx: "Wanx - Modelli modello di generazione testo-video di Lab",
      modelsLabWan22:
        "Wan 2.2 Ultra - Modelli modello di generazione test-video di alta qualità",
      modelsLabWan21:
        "Wan 2.1 Ultra - ModelliIl modello di generazione testo-video di Lab con una qualità migliorata",
      modelsLabWan25T2V:
        "Wan 2.5 T2V - ModelliLab's Wan 2.5 modello di generazione testo-video",
      modelsLabWan25I2V:
        "Wan 2.5 I2V - ModelliLab's Wan 2.5 immagine-video modello di generazione",
      modelsLabWan27T2V:
        "Wan 2.7 T2V - L'ultimo modello Wan 2.7 text-to-video di Alibaba con rapporti di aspetto flessibili e output 1080p",
      modelsLabWan26T2V:
        "Wan 2.6 T2V - ModelliLab's Wan 2.6 modello di generazione testo-video",
      modelsLabWan26I2V:
        "Wan 2.6 I2V - ModelliLab's Wan 2.6 immagine-video modello di generazione",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash - ModelliLab veloce Wan 2.6 immagine-video modello di generazione",
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
        "Omnihuman 1.5 - Il migliore modello di generazione video umano di BytePlus",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro - modello avanzato di generazione video di BytePlus",
      modelsLabVeo2:
        "Veo 2 - Google modello di generazione video di alta qualità tramite ModelsLab",
      modelsLabVeo3:
        "Veo 3 - L'ultimo modello di video generazione Google tramite ModelsLab",
      modelsLabVeo3Fast:
        "Veo 3 Fast - Il modello di generazione video veloce di Google tramite ModelsLab",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview - modello di anteprima rapida generazione video di Google tramite ModelsLab",
      modelsLabVeo31:
        "Veo 3.1 - Google ha migliorato il modello di generazione video Veo 3 tramite ModelsLab",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast - Il modello veloce di generazione video Veo 3.1 di Google tramite ModelsLab",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V - Versione immagine-video di Kling AI 2.1",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V - Kling AI turbo immagine-video versione 2.5",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V - Kling AI versione turbo text-to-video 2.5",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V - Kling AI modello di qualità master text-to-video",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V - Kling AI modello di immagine-video di qualità superiore",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V - Kling AI master quality text-to-video model v2.1",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V - Kling AI master quality image-to-video model v2.1",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V - Kling AI versione multi-immagine-video 1.6",
      modelsLabKling30T2V:
        "Kling 3.0 T2V - Versione di testo-video di Kling AI 3.0",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V - modello professionale di generazione testo-video di LTX",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V - modello professionale di generazione di immagini-video di LTX",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V - LTX migliorato modello di immagine-video professionale",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V - Versione di generazione testo-video di MiniMax 2.3",
      modelsLabHailuo02T2V:
        "Hailuo 02 T2V - Modello di generazione testo-video di MiniMax 02",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V - Versione di generazione immagine-video di MiniMax 2.3",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Veloce I2V - Versione veloce immagine-video di MiniMax 2.3",
      modelsLabHailuo02I2V:
        "Hailuo 02 I2V - MiniMax modello di generazione immagine-video 02",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End - Modella di generazione video per frame start-end di MiniMax",
      modelsLabSora2:
        "Sora 2 - OpenAI modello di generazione video Sora 2 tramite ModelsLab",
      modelsLabSora2Pro:
        "Sora 2 Pro - modello di generazione video Sora 2 Pro di OpenAI tramite ModelsLab",
      modelsLabGen4Aleph:
        "Gen4 Aleph - Il modello di generazione video di Runway Gen4 Aleph via ModelsLab",
      modelsLabLipsync2:
        "Lipsync 2 - Il modello di generazione video di sincronizzazione delle labbra di Sync",
      modelsLabGrokT2V:
        "Grok T2V - modello di generazione di testo-video Grok xAI tramite ModelsLab",
      modelsLabGrokI2V:
        "Grok I2V - modello di generazione di immagini-video Grok di xAI tramite ModelsLab",
      klingV30Std:
        "Kling 3.0 Standard - modello video standard di Kuaishou con T2V e I2V tramite OpenRouter",
      klingVideoO1:
        "Kling Video O1 - Il modello di generazione video ragionata di Kuaishou via OpenRouter",
      veo31Lite:
        "Veo 3.1 Lite - modello video economico di Google per la generazione ad alto volume tramite OpenRouter",
      seedance2:
        "Seedance 2.0 - Il modello video di ByteDance di prossima generazione con coerenza del personaggio e riferimento-to-video via OpenRouter",
      seedance2Fast:
        "Seedance 2.0 Fast - Il modello di generazione rapida di ByteDance tramite OpenRouter",
      happyhorse11:
        "HappyHorse 1.1 - Il modello di generazione video di Alibaba con T2V, I2V e supporto immagine di riferimento tramite OpenRouter",
      happyhorse10:
        "HappyHorse 1.0 - Il modello di generazione video di Alibaba con T2V, I2V e supporto immagine di riferimento tramite OpenRouter",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo - Il modello veloce di generazione testo-immagine di Runway tramite ModelsLab",
      modelsLabGen4Image:
        "Gen4 Image - Modello di generazione testo-immagine Gen4 di Runway tramite ModelsLab",
      modelsLabWan27T2I:
        "Wan 2.7 T2I - Il modello di generazione del testo-immagine Wan 2.7 di Alibaba tramite ModelsLab",
      modelsLabGrokT2I:
        "Grok Immagina T2I - modello di generazione testo-immagine Grok di xAI tramite ModelsLab",
      modelsLabZImageBase:
        "Z Image Base - ModelliIl modello veloce e conveniente di Lab",
      modelsLabZImageTurbo:
        "Z Image Turbo - Modelli modello ultra-veloce di Lab",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I - Black Forest Labs' Flux 2 Max text-to-image tramite ModelsLab",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra - Black Forest Labs' di alta qualità Flux Pro Ultra tramite ModelsLab",
      modelsLabFluxPro11:
        "Flux Pro 1.1 - Black Forest Labs' Flux Pro 1.1 text-to-image via ModelsLab",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I - Black Forest Labs' Flux 2 Pro text-to-image tramite ModelsLab",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I - Black Forest Labs' Flux 2 Dev text-to-image via ModelsLab",
      modelsLabFluxT2I:
        "Flux T2I - Black Forest Labs' Flux text-to-image via ModelsLab",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I - ByteDance's Seedream 4.5 text-to-image via ModelsLab",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I - ByteDance's Seedream 4.0 text-to-image via ModelsLab",
      modelsLabSeedreamT2I:
        "Seedream T2I - ByteDance's Seedream text-to-image via ModelsLab",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra - Google generazione di immagini di alta qualità tramite ModelsLab",
      modelsLabImagen4:
        "Imagen 4 - Google 's Imagen 4 text-to-image via ModelsLab",
      modelsLabImagen4Fast:
        "Imagen 4 Fast - Il veloce di Google Imagen 4 text-to-image tramite ModelsLab",
      modelsLabImagen3:
        "Imagen 3 - Google's Imagen 3 text-to-image via ModelsLab",
      modelsLabNanoBananaPro:
        "Nano Banana Pro - Generazione di immagini di alta qualità tramite ModelsLab",
      modelsLabNanoBanana:
        "Nano Banana - Generazione immagine tramite ModelsLab",
      modelsLabQwenT2I:
        "Qwen T2I - Test-to-image Qwen di Alibaba tramite ModelsLab",
      modelsLabRealtimeT2I:
        "T2I in tempo reale - Modelli modello di testo-immagine ultra-veloce di Lab",
      claudeSonnet5:
        "Claude Sonnet 5 - modello di classe Sonnet bilanciato di Anthropic con prestazioni forti tra codifica, agenti e lavoro analitico.",
      claudeOpus5:
        "Claude Opus 5 - modello di punta di Anthropic per le attività agentiche e analitiche più esigenti.",
      claudeOpus5Fast:
        "Claude Opus 5 Fast - variante ad alta produttività di Claude Opus 5 ottimizzata per applicazioni sensibili alla latenza.",
      claudeFable5:
        "Claude Fable 5 - L'ultimo modello di frontiera di Anthropic combina ragionamenti profondi, sintesi creativa e pianificazione a lungo raggio.",
      grok45:
        "Grok 4.5 - modello di ragionamento in grado di xAI con supporto visivo e politica dei contenuti aperta.",
      grok46:
        "Grok 4.6 - l'ultimo modello Grok di xAI con un migliore ragionamento e codifica.",
      gpt56Luna:
        "GPT-5.6 Luna - modello veloce leggero di OpenAI per le attività quotidiane. Estremamente conveniente. contesto 1.05M-token.",
      gpt56LunaPro:
        "GPT-5.6 Luna Pro - variante Luna migliorata con codifica migliorata e istruzione-seguente.",
      gpt56Terra:
        "GPT-5.6 Terra - OpenAI 's mid-tier modello di bilanciamento e costo. Forte a codifica e ragionamento. contesto 1.05M-token.",
      gpt56TerraPro:
        "GPT-5.6 Terra Pro - Versione Terra Avanzata con ragionamento e analisi più profonde.",
      gpt56Sol:
        "GPT-5.6 Sol - modello di ragionamento premium di OpenAI per compiti complessi. Prestazioni all'avanguardia. contesto di 1,05 M-token.",
      gpt56SolPro:
        "GPT-5.6 Sol Pro - Top-tier GPT modello che combina ragionamento avanzato con profondità creativa e analitica.",
      gemini36Flash:
        "Gemini 3.6 Flash - modello Flash capace di Google con ingressi multimodali e codifica forte.",
      gemini35FlashLite:
        "Gemini 3.5 Flash Lite - il modello veloce ultra-affordable di Google per compiti semplici.",
      gemini37Flash:
        "Gemini 3.7 Flash - L'ultimo modello di serie Flash di Google con una migliore motivazione e funzionalità multimodali.",
      kimiK3:
        "Kimi K3 - Moonshot AI ultimo modello di frontiera con il ragionamento multimodale a lungo contenuto e le funzionalità avanzate dell'agente.",
      glm52:
        "GLM-5.2 - Z. AI modello di fondazione di nuova generazione con forte ragionamento e inferenza rapida.",
      minimaxM3:
        "MiniMax M3 - modello di punta di MiniMax con codifica forte e ragionamento a prezzo competitivo.",
      qwen37Flash:
        "Qwen 3.7 Flash - Il modello di bilancio ultra-veloce di Alibaba per le attività ad alto volume.",
      qwen38Max:
        "Qwen 3.8 Max - Il modello di ragionamento superiore di Alibaba con prestazioni a livello di frontiera.",
      mimoV25:
        "MiMo V2.5 - L'efficiente modello di ragionamento di Xiaomi con forti prestazioni di codifica.",
      mimoV25Pro:
        "MiMo V2.5 Pro - modello di ragionamento premium di Xiaomi con profondità analitica e codifica avanzata.",
      metaMuseSpark12:
        "Meta Muse Spark 1.2 - Il modello di ragionamento multimodale di Meta con ingressi di visione, audio e video. Forte all'analisi cross-modale. contesto 1.05M-token.",
      mistralMedium35:
        "Mistral Medium 3.5 - Mistral AI modello a fascia media capace con supporto visivo e codifica forte.",
      claudeOpus55:
        "Claude Opus 5.5 - Il modello superiore di Anthropic. I lavori più difficili di agentic, codifica e analisi, ora il 20% più economico del contesto Opus 5. 1M-token.",
      claudeSonnet55:
        "Claude Sonnet 5.5 - Cavallo da lavoro di Anthropic. Abilità di codifica e di agente presso Opus a Sonnet prezzo. contesto 1M-token.",
      claudeHaiku55:
        "Claude Haiku 5.5 - Anthropic modello più veloce. Visione, strumenti e contesto 1M per un decimo del prezzo di Haiku 4.5.",
      claudeFable51:
        "Claude Fable 5.1 - Il ragionatore di frontiera di Anthropic. Sintesi profonda, pianificazione a lungo termine dell'orizzontale, più nitida del contesto di Fable 5. 1M-token.",
      claudeFable52:
        "Claude Fable 5.2 - Il ragionatore di frontiera di Anthropic. Sintesi più profonda e pianificazione più stabile di lungo orizzonte rispetto a Fable 5.1, ad un prezzo più basso.",
      gpt6Astra:
        "Il precedente modello di punta Astra accetta testo e immagini e usa strumenti. Il suo successore è GPT-6.2 Astra.",
      gpt6AstraPro:
        "GPT-6 Astra Pro - GPT-6 Astra con un lungo sforzo di ragionamento. Più lento, più approfondito. 1.05M-token contesto.",
      gpt61Sol:
        "La precedente versione di Sol accetta testo e immagini e usa strumenti. Il suo successore è GPT-6.2 Sol.",
      gpt61SolPro:
        "GPT-6.1 Sol Pro - GPT-6.1 Sol con un ampio sforzo di ragionamento per l'analisi e il codice complessi.",
      gpt61Terra:
        "GPT-6.1 Terra - La media bilanciata di OpenAI. Forte codifica e ragionamento, prezzo di tutti i giorni. contesto 1.05M-token.",
      gpt61TerraPro:
        "GPT-6.1 Terra Pro - GPT-6.1 Terra con un ragionamento più profondo per l'analisi-pesante.",
      gpt6Luna:
        "GPT-6 Luna - modello leggero di OpenAI. risposte rapide per i penny. contesto 1.05M-token.",
      gpt6LunaPro:
        "GPT-6 Luna Pro - GPT-6 Luna con ragionamento extra. Migliore codice e istruzione-seguente, stesso prezzo basso. 1.05M-token contesto.",
      gemini4Argon:
        "Gemini 4 Argon - La nuova ammiraglia di Google. Testo, immagine, video e audio in, ragionamento di frontiera. 1M-token contesto.",
      gemini38Flash:
        "Gemini 3.8 Flash - ultima Flash di Google. Modello multimodale veloce con codifica forte. contesto 1M-token.",
      grok47:
        "Grok 4.7 - ultima Grok di xAI. Ragione e codice più nitidi, politica dei contenuti aperta, visione. contesto di 500K-token.",
      kimiK31Pro:
        "Kimi K3.1 Pro - Moonshot AI modello più forte. Il ragionamento multimodale e l'agente lungo corre. contesto 1M-token.",
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
        "Qwen 4 Max - La nuova ammiraglia di Alibaba. Il ragionamento anteriore, il codice e l'analisi, legge immagini e video. 1M-token contesto.",
      kimiK31ProUncensored:
        "Kimi K3.1 Pro Uncensored - Moonshot AI è il più forte Kimi con i rifiuti rimossi (abliterati). Bandiera ragionamento, nessuna lezione, strumenti inclusi. 1M-token contesto.",
      deepseekV41Flash:
        "DeepSeek V4.1 Flash - modello aperto rapido di DeepSeek, ora con visione. Codifica seria per quasi nulla. contesto 1M-token.",
      qwen38Flash:
        "Qwen 3.8 Flash - modello multimodale veloce di Alibaba. Testo, immagine e video a prezzo di bilancio. contesto 1M-token.",
      glm53:
        "GLM-5.3 - L'ultimo modello di fondazione AI. Forte ragionamento e codice a un prezzo aggressivo. contesto 1M-token.",
      glm53Flash:
        "GLM-5.3 Flash - modello multimodale veloce di Z. AI. Testo, immagine e video per il lavoro ad alto volume. contesto 1M-token.",
      mimoV26Pro:
        "MiMo V2.6 Pro - Il ragionatore premium di Xiaomi. Testo, immagine, video e audio in, analisi profonda. 1.05M-token contesto.",
      mimoV26Flash:
        "MiMo V2.6 Flash - il modello multimodale veloce di Xiaomi. Ultra-cheap, codificatore capace. contesto 1.05M-token.",
      metaMuseSpark13:
        "Meta Muse Spark 1.3 - Il ragionatore multimodale di Meta. Analisi cross-modal attraverso testo, immagine e video. contesto 1M-token.",
      metaMuseWonder:
        "Meta Muse Wonder - La nave ammiraglia di Meta. ragionamento anteriore, codice e lavoro creativo in ogni modalità. 1M-token contesto.",
      mistralLarge4:
        "Mistral Large 4 - Mistral AI nuovo fiore all'occhiello. Europa, vision-capable, forte in codice, più economico del contesto medio 3.5. 1M-token.",
      gemini4Hydrogen:
        "Gemini 4 Hydrogen - Google Gemini 4 cava di lavoro. Codifica e analisi, testo, immagine, video e audio in contesto 1M-token.",
      gemini4Carbon:
        "Gemini 4 Carbon - Google è il più forte Gemini. Costruito per il codice più duro, agente e ragionamento lavoro, legge ogni tipo di media. 1M-token contesto.",
      minimaxM31Flash:
        "MiniMax M3.1 Flash - modello multimodale veloce di MiniMax. Batte M3 ad agenti e codice per metà del prezzo o meno. 1M-token contesto.",
      metaMuseEmber:
        "Meta Muse Ember - Muse più piccola di Meta. Chiamate di strumenti veloci, routing e codifica leggera per penny, legge ogni tipo di media.",
      veniceDeepseekV41FlashUncensored:
        "DeepSeek V4.1 Flash Uncensored - DeepSeek V4.1 Flash con i rifiuti rimossi, serviti da Venice.ai. Capacità reale, senza lezioni, strumenti inclusi. 1M-token contesto.",
      drummerArtemis31b:
        "Artemis 31B - Gemma 4 di TheDrummer finettina di gioco di ruolo. Scene oscure, finzione esplicita, personaggi che rimangono in voce. contesto economico, 262K, legge immagini, strumenti di chiamate.",
      grokImagineImage2:
        "Grok Imagine Image 2.0 - modello di ultima generazione di immagini xAI con una migliore aderenza e qualità visiva.",
      recraftV41:
        "Recraft V4.1 - Il primo modello di immagine di Recraft con testo preciso in immagini, costruito per loghi, poster e grafica di marca.",
      recraftV41Pro:
        "Recraft V4.1 Pro - Telaio premium 2K di Recraft per la stampa-ready marca e prodotti visivi con dettagli fini.",
      recraftV41Flash:
        "Recraft V4.1 Flash - Recraft è veloce, a basso costo per bozze e rinfuse, sotto 1 credito per immagine.",
      qwenImage3:
        "Qwen Image 3 - Il modello di generazione rapida dell'immagine di Alibaba a basso costo.",
      qwenImage3Pro:
        "Qwen Image 3 Pro - modello di generazione di immagini premium di Alibaba con qualità e dettaglio migliorati.",
      hailuo3:
        "Hailuo 3 - L'ultimo modello di video generazione di MiniMax con qualità cinematografica e coerenza del movimento.",
      seedance25:
        "Seedance 2.5 - Il modello di generazione video migliorata di ByteDance con una migliore fedeltà visiva e movimento.",
      flux3Video:
        "Flux 3 Video - Black Forest Labs modello di generazione video di punta con qualità eccezionale e rapida adesione.",
      grokImagineVideo15:
        "Grok Imagine Video 1.5 - modello di generazione video aggiornato di xAI con una maggiore coerenza temporale.",
      lyria3ProPreview:
        "Lyria 3 Pro Anteprima - modello di generazione musicale premium di Google per canzoni full-length con alta qualità di produzione.",
      lyria3ClipPreview:
        "Lyria 3 Clip Anteprima - Generatore di clip di musica veloce di Google per contenuti audio di forma breve.",
      geminiNanoBanana21:
        "Nano Banana 2.1 - La generazione in-chat dell'immagine di Google e la modifica a metà del prezzo dell'immagine dell'originale Nano Banana.",
      seedream55:
        "Seedream 5.5 - ByteDance's image generation and multi-reference editing model at 2 credits per immagine.",
      flux3Image:
        "FLUX.3 - Modello di immagine di punta Black Forest Labs con dettagli più nitidi e testo più pulito rispetto a FLUX.2.",
      flux3Klein:
        "FLUX.3 Klein - Black Forest Labs' piccolo, veloce modello di immagine per bozze e rinfuse, sotto 1 credito per immagine.",
      gptImage26Flare:
        "GPT Image 2.6 Flare - il modello di generazione e modifica rapida delle immagini di OpenAI.",
      gptImage26Sunburst:
        "GPT Image 2.6 Sunburst - modello di immagine a fuoco dettagliato di OpenAI per composizioni dense e layout acustici.",
      geminiOmni12Flash:
        "Gemini Omni 1.2 Flash - modello video di Google con audio nativo, 3 a 15 secondi clip, fino a 4K.",
      grokImagineVideo15Lite:
        "Grok Imagine Video 1.5 Lite - modello video veloce e a basso costo di xAI, fino a 1080p.",
      wan30:
        "Wan 3.0 - Il modello video di Alibaba con audio nativo e clip fino a 30 secondi.",
      seedance2Mini:
        "Seedance 2.0 Mini - ByteDance's budget video model con audio nativo a 480p e 720p.",
      seedance25Flash:
        "Seedance 2.5 Flash - ByteDance's veloce Seedance 2.5 con audio nativo, clip fino a 30 secondi a 480p e 720p.",
      hailuo3Max:
        "Hailuo 3 Max - MiniMax più veloce, più economico Hailuo 3 variante a 768p, senza audio.",
      runwayGen45:
        "Runway Gen-4.5 - Il modello cinematografico di Runway per testo e immagine al video a 720p.",
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
};
