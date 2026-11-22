import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  config: {
    folders: {
      private: "Chat private",
      shared: "Chat condivise",
      public: "Chat pubbliche",
      incognito: "Incognito Chats",
      background: "Filetti di sfondo",
      remote: "Chat remote",
    },
  },
  tags: {
    messages: "Messaggi",
  },
  loadingOlderMessages: "Caricamento di messaggi vecchi...",
  loadingNewerMessages: "Caricamento di nuovi messaggi...",
  scrollUpForOlderMessages: "Scorrere per i messaggi più vecchi",
  showOlderMessages: "Mostra messaggi più vecchi",
  showNewerMessages: "Mostra nuovi messaggi",
  transcribing: "Trasgregazione audio...",
  uploadingAttachments: "Caricare i file...",
  gapFill: {
    transcribingAudio: "Trasgregazione audio...",
    analyzingImage: "Analizzare l'immagine...",
    describingVideo: "Descrizione del video...",
    processingMedia: "Lavorazione dei media...",
    variantUsing: "via {{model}}",
    variantCost: "{{cost}} crediti",
    transcription: "Trascrizione",
    imageDescription: "Descrizione dell'immagine",
    videoDescription: "Descrizione del video",
    showTranscription: "Mostra trascrizione",
    hideTranscription: "Nascondi la trascrizione",
    showImageDescription: "Mostra la descrizione delle immagini",
    hideImageDescription: "Nascondi la descrizione dell'immagine",
    showVideoDescription: "Mostra la descrizione video",
    hideVideoDescription: "Nascondi la descrizione video",
  },
  errorCode: "Codice di errore",
  errorActions: {
    retry: "Riprova",
    tryAnotherModel: "Prova un altro modello",
    continue: "Continua",
    /** Sent as the user message when Continue is pressed */
    continuePrompt: "Continua",
  },
  streamInterrupted: {
    label: "La generazione si è fermata",
    hint: "Risposta parziale salvata. Invia un nuovo messaggio per continuare.",
  },
  errorFeedback: {
    autoReported: "Errore segnalato automaticamente",
    helpFix: "Aiutaci a risolvere questo problema",
    autoContext: "[Rapporto di errore generato automaticamente]",
    errorLabel: "Errore",
    causeLabel: "Causa",
    userContextLabel: "Aggiungi più contesto qui (opzionale)",
    separator: "·",
  },
  compacting: {
    title: "Storia Compatta",
    loading: "Compattare la storia...",
    summarizing: "Conversazione summarizzante...",
    failed: "Compattamento fallito",
  },
  get: {
    title: "Elenco messaggi filettati",
    titleShort: "Messaggi",
    description: "Recuperare tutti i messaggi in un thread di chat",
    container: {
      title: "Messaggi",
      description: "Elenco dei messaggi filettati",
    },
    threadId: {
      label: "File ID",
      description: "ID del thread per recuperare i messaggi",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    leafMessageId: {
      label: "Messaggio di foglie ID",
      description: "Il messaggio della foglia di ramo attuale ID",
    },
    response: {
      title: "Risposta dei messaggi",
      description: "Elenco dei messaggi nel thread",
      messages: {
        message: {
          title: "Messaggio",
          id: {
            content: "Messaggio ID",
          },
          threadId: {
            content: "File ID",
          },
          role: {
            content: "Role",
          },
          content: {
            content: "Contenuti",
          },
          parentId: {
            content: "Messaggio principale ID",
          },
          authorId: {
            content: "Autore ID",
          },
          isAI: {
            content: "È AI",
          },
          model: {
            content: "Modello",
          },
          skill: {
            content: "Skill",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "Sequenza ID",
          },

          toolCalls: {
            content: "Chiamate degli strumenti",
          },
          createdAt: {
            content: "Creato a",
          },
          updatedAt: {
            content: "Aggiornato At",
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare i messaggi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare questi messaggi",
        incognitoNotAllowed:
          "I filetti incisivi non possono essere accessibili sul server",
      },
      notFound: {
        title: "Non trovato",
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
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
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Messaggi recuperati con successo",
    },
  },
  post: {
    title: "Crea un messaggio",
    titleShort: "Crea un messaggio",
    description: "Creare un nuovo messaggio in una chat thread",
    form: {
      title: "Nuovo messaggio",
      description: "Creare un messaggio nel thread",
    },
    sections: {
      message: {
        title: "Dettagli del messaggio",
        description: "Contenuto e impostazioni del messaggio",
      },
    },
    threadId: {
      label: "File ID",
      description: "ID del thread per aggiungere un messaggio a",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    id: {
      label: "Messaggio ID",
      description: "Messaggio generato dal cliente ID",
    },
    content: {
      label: "Contenuti",
      description: "Contenuto del messaggio",
      placeholder: "Inserisci il contenuto del messaggio...",
    },
    role: {
      label: "Role",
      description: "Messaggio (utente, assistente, sistema)",
    },
    parentId: {
      label: "Messaggio principale",
      description: "Messaggio principale ID per la ramificazione",
    },
    model: {
      label: "Modello",
      description: "Modello AI da usare per la risposta",
    },
    skill: {
      label: "Skill",
      description: "AI skill/persona per il messaggio",
    },
    metadata: {
      label: "Metadati",
      description: "metadati del messaggio (attaccamenti, gettoni, ecc.)",
    },
    response: {
      title: "Messaggio creato",
      description: "Nuovi dettagli del messaggio creati",
      message: {
        title: "Messaggio",
        id: {
          content: "Messaggio ID",
        },
        threadId: {
          content: "File ID",
        },
        role: {
          content: "Role",
        },
        content: {
          content: "Contenuti",
        },
        parentId: {
          content: "Messaggio principale ID",
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Dati di messaggio non valido forniti",
        parentNotFound: "Messaggio principale non trovato",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per creare messaggi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare messaggi",
        incognitoNotAllowed:
          "I filetti incisivi non possono essere accessibili sul server",
      },
      notFound: {
        title: "Non trovato",
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
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
        description: "Si è verificato un conflitto",
      },
      createFailed: {
        title: "Non è riuscito a creare un messaggio",
        description:
          "Si è verificato un errore durante la creazione del messaggio",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Messaggio creato con successo",
    },
  },
  enums: {
    role: {
      user: "Utente",
      assistant: "Assistente aggiunto",
    },
  },
  debugView: {
    systemPromptTitle: "Prompt di sistema",
    copied: "Copiato!",
    systemMessageHint: "Messaggio di sistema (nascosto dagli utenti)",
    systemPromptLabel: "prompt del sistema · leader · cache",
    upcomingContextLabel: "prossimo contesto assistente · ultimo messaggio",
  },
  widget: {
    common: {
      send: "Invia",
      sending: "Invio in corso…",
      cancel: "Annulla",
      close: "Chiudi",
      copyButton: {
        copied: "Copiato!",
        copyToClipboard: "Copia a clipboard",
        copyAsMarkdown: "Copia come Markdown",
        copyAsText: "Copia come testo normale",
      },
      viewModeToggle: {
        linearView: "Vista lineare",
        threadedView: "Vista filettata",
        flatView: "Vista piana",
        debugView: "Debug View",
      },
      userMessageActions: {
        branch: "Branch",
        retry: "Recuperare",
        deleteMessage: "Cancella messaggio",
        cancelLoading: "Annulla carico",
        stopAudio: "Ferma l'audio",
        playAudio: "Riproduzione audio (crediti {{cost}})",
      },
      assistantMessageActions: {
        answerAsAI: "Risposta come AI",
        cancelLoading: "Annulla carico",
        stopAudio: "Ferma l'audio",
        playAudio: "Riproduzione audio (crediti {{cost}})",
        actualCostUsed: "Costo effettivo utilizzato",
        credits: "Crediti",
        tokens: "Tokens",
        tokensUsed: "Tokens utilizzati",
        inputTokens: "Input",
        outputTokens: "Produzione",
        cachedTokens: "Cached",
        cachedPercent: "{{percent}} % memorizzato",
        cachedPercentTitle:
          "{{percent}} % dei gettoni di ingresso sono stati serviti dalla cache, riducendo i costi",
        cached: "cache",
        pipeline: "Pipeline",
        timeToFirstToken: "{{seconds}} s a prima token",
        timeToFirstTokenTitle: "Tempo di prima token",
        streamingTime: "streaming {{seconds}}",
        streamingTimeTitle: "Durata totale dello streaming",
        cacheWriteTokens: "Scritto da Cache",
        cacheWrite: "{{tokens}} scritto nella cache",
        cacheWriteTitle:
          "Token {{tokens}} scritti per memorizzare questa richiesta (a pagamento al tasso di scrittura della cache)",
        deleteMessage: "Cancella messaggio",
        upvote: "Votazioni",
        downvote: "Votazioni",
      },
      generatedMediaActions: {
        copy: "Copia",
        copied: "Affrontato",
        download: "Scarica",
        showPrompt: "Mostra il prompt",
        hidePrompt: "Nascondi il prompt",
      },
    },
    messages: {
      assistant: "Assistente aggiunto",
      anonymous: "Anonimo",
      you: "Tu sei",
      edited: "modificato",
      branch: {
        previous: "Precedente ramo",
        next: "Prossimo ramo",
      },
      authorWithId: "{{name}} ({{id}})",
      aiBadge: "IA",
      aiBadgeTitle: "Scritto da un modello AI, non una persona",
    },
    linearView: {
      answerModal: {
        title: "Risposta come AI",
        description: "Generare una risposta AI a questo messaggio",
        inputPlaceholder: "Aggiungi contesto per la AI...",
        confirmLabel: "Generazione",
      },
      retryModal: {
        title: "Rettifica con modello differente",
        description: "Rigenerare questa risposta con un modello diverso",
        confirmLabel: "Recuperare",
      },
    },
    threadedView: {
      replyModal: {
        title: "Rispondi",
        description: "Invia un messaggio in risposta a questo post",
        inputPlaceholder: "Scrivi la tua risposta...",
        confirmLabel: "Rispondi",
      },
      actions: {
        reply: "Rispondi",
        replyToMessage: "Rispondi a questo messaggio",
        branch: "Branch",
        branchMessage: "Modifica &amp; branch",
        retry: "Recuperare",
        retryWithDifferent: "Rettifica con modello differente",
        answerAsAI: "Risposta come AI",
        generateAIResponse: "Generare risposta AI",
        cancelLoading: "Annulla carico",
        stop: "Fermati.",
        stopAudio: "Ferma l'audio",
        playAudio: "Riproduzione audio (crediti {{cost}})",
        delete: "Elimina",
        deleteMessage: "Cancella messaggio",
        share: "Condividi",
        copyPermalink: "Copia permalink",
        upvote: "Votazioni",
        downvote: "Votazioni",
        play: "Gioca",
        cancel: "Annulla",
        parent: "Vai al genitore",
      },
      answerModal: {
        title: "Risposta come AI",
        description: "Generare una risposta AI a questo messaggio",
        inputPlaceholder: "Aggiungi contesto per la AI...",
        confirmLabel: "Generazione",
      },
      retryModal: {
        title: "Rettifica con modello differente",
        description: "Rigenerare questa risposta con un modello diverso",
        confirmLabel: "Recuperare",
      },
      anonymous: "Anonimo",
      assistantFallback: "Assistente aggiunto",
      userFallback: "Utente",
      youLabel: "Tu sei",
      authorWithId: "{{name}} ({{id}})",
      reply: "risposta",
      replies: "risposte",
      expandReplies: "Rispondenze",
      collapseReplies: "Risposte di errore",
      continueThread: "Continuare il thread ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "Rispondi",
        description: "Invia un messaggio in risposta a questo post",
        inputPlaceholder: "Scrivi la tua risposta...",
        confirmLabel: "Rispondi",
      },
      actions: {
        reply: "Rispondi",
        replyToMessage: "Rispondi a questo messaggio",
        branch: "Branch",
        branchMessage: "Modifica &amp; branch",
        retry: "Recuperare",
        retryWithDifferent: "Rettifica con modello differente",
        answerAsAI: "Risposta come AI",
        generateAIResponse: "Generare risposta AI",
        delete: "Elimina",
        deleteMessage: "Cancella messaggio",
        copyReference: "Copia di riferimento",
        upvote: "Votazioni",
        downvote: "Votazioni",
      },
      answerModal: {
        title: "Risposta come AI",
        description: "Generare una risposta AI a questo messaggio",
        inputPlaceholder: "Aggiungi contesto per la AI...",
        confirmLabel: "Generazione",
      },
      retryModal: {
        title: "Rettifica con modello differente",
        description: "Rigenerare questa risposta con un modello diverso",
        confirmLabel: "Recuperare",
      },
      anonymous: "Anonimo",
      assistantFallback: "Assistente aggiunto",
      youLabel: "Tu sei",
      replyingTo: "Rispondere a",
      replies: "Risposte:",
      clickToCopyRef: "Clicca per copiare il riferimento",
      postsById: "{{count}} messaggi di questo ID",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "Messaggio di sistema (nascosto dagli utenti)",
    },
    userProfile: {
      recentPosts: "Recenti messaggi",
      noPostsYet: "Nessun post",
      postCount: "{{count}} messaggi",
    },
    screenshot: {
      capture: "Cattura screenshot",
      capturing: "Catturare...",
    },
    shareDialog: {
      title: "Condividere il filo",
    },
    messageEditor: {
      titles: {
        branch: "Modifica &amp; branch",
        reply: "Rispondi",
        cancel: "Annulla",
      },
      hint: {
        branch: "Modificare crea un nuovo ramo",
        reply: "Scrivi la tua risposta",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Rassegna",
        enter: "Inserisci",
        shiftEnter: "Shift+Enter",
        forNewLine: "per la nuova linea",
      },
    },
    voiceMode: {
      callMode: "Modalità di chiamata",
      callModeDescription: "AI risponderà con la voce",
      tapToRecord: "Toccare per registrare",
    },
    batchToolConfirmation: {
      title: "Confermare le chiamate degli strumenti batch",
    },
    queue: {
      badge: "Queued",
      cancelTooltip: "Rimuovere dalla coda e ripristinare l'ingresso",
    },
  },
  flatView: {
    timestamp: {
      sun: "Sole",
      mon: "L'anno",
      tue: "Tue",
      wed: "Wed",
      thu: "Giorgia",
      fri: "Frigo.",
      sat: "Rasoio",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
  },
};
