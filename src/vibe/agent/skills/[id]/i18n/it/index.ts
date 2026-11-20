import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  voices: {
    MALE: "Voce maschile",
    FEMALE: "Voce femminile",
  },
  enums: {
    category: {
      companion: "Compagni",
      assistant: "Assistenti",
      coding: "Programmazione",
      creative: "Creativo",
      writing: "Scrivere",
      analysis: "Analisi",
      roleplay: "Gioco di ruolo",
      education: "Istruzione",
      controversial: "Controversia",
      background: "Sfondo",
      custom: "Personalizzato",
    },
    ownershipType: {
      system: "Abilità integrata",
      user: "Creato da te",
      public: "Dalla comunità",
    },
  },

  get: {
    title: "Ottenere abilità",
    titleShort: "Dettagli sull'abilità",
    dynamicTitle: "abilità: {{name}}",
    description: "Recuperare una specifica abilità di ID",
    container: {
      title: "abilità Dettagli",
      description: "Dettagli dell'abilità richiesta",
    },
    backButton: {
      label: "Torna a competenze",
    },
    openFullPage: "Aprire la pagina completa",
    editButton: {
      label: "Modificare le abilità",
    },
    customizeButton: {
      label: "Personalizza l'abilità",
    },
    deleteButton: {
      label: "Eliminare le abilità",
    },
    addToFavoritesButton: {
      label: "Aggiungi ai preferiti",
    },
    inCollection: "In collezione",
    useNow: "Usa ora",
    goToChat: "Vai a Chat",
    addAnother: "Aggiungi un altro",
    addAnotherTooltip:
      "Aggiungi un'altra istanza di questa abilità alla tua collezione",
    variants: {
      title: "Scegli un modello",
      strength: "Forza",
      weakness: "Debolezza",
    },
    addToCollection: "Aggiungi alla tua collezione:",
    addAllToFavorites: "Aggiungi tutti i modelli",
    quickAdd: "Aggiungi",
    tweakAndAdd: "Tweak & Add",
    edit: "Modifica",
    copyAndCustomize: "Fai la mia versione",
    delete: "Elimina",
    vote: "Votazioni",
    report: "Relazione",
    actions: "Azioni",
    designSelector: {
      label: "Design:",
      current: "Corrente",
      a: "A: App Store",
      b: "B: Intestazione divisa",
      c: "C: Ero della carta",
      d: "D: Due-Row",
    },
    addVariant: "Aggiungi un altro modello",
    addVariantHint: "Modello differente, personalità o stile",
    yourskill: "La tua abilità",
    signupPrompt: {
      title: "Personalizza questa abilità",
      description:
        "Crea una versione personalizzata con le tue impostazioni e preferenze. Registrati per iniziare.",
      backButton: "Indietro",
      signupButton: "Crea account",
      loginButton: "Accedi",
    },
    id: {
      label: "abilità ID",
      description: "La slitta o amichevole ID dell'abilità",
    },
    systemPrompt: {
      label: "Prompt di sistema",
      copy: "Copia",
      copied: "Copiato!",
      view: "Visualizza il prompt completo",
    },
    models: {
      brain: "Cervello",
      eyes: "Occhi",
      ears: "Orecchie e Voce",
      media: "Media",
      slots: {
        chat: "Chat",
        imageVision: "Visione d'immagine",
        videoVision: "Visione video",
        stt: "Discorso al testo",
        tts: "Testo al discorso",
        audioVision: "Visione audio",
        imageGen: "Immagine gen",
        musicGen: "Musica gen",
        videoGen: "Video di Gen",
      },
    },
    response: {
      skill: {
        title: "abilità",
        id: { content: "abilità ID" },
        name: { content: "abilità Nome" },
        description: { content: "descrizione" },
        icon: { content: "abilità Icon" },
        systemPrompt: { content: "Prompt di sistema" },
        category: { content: "Categoria" },
        source: { content: "Fonte" },
        preferredModel: { content: "Modello preferito" },
        voice: { content: "Voce" },
        modelSelection: { title: "Selezione del modello" },
        selectionType: { content: "Tipo di selezione" },
        minIntelligence: { content: "Intelligenza minima" },
        maxIntelligence: { content: "Massima intelligenza" },
        minPrice: { content: "Prezzo minimo" },
        maxPrice: { content: "Prezzo massimo" },
        minContent: { content: "Livello minimo di contenuto" },
        maxContent: { content: "Livello di contenuto massimo" },
        preferredStrengths: { content: "Punti di forza preferiti" },
        ignoredWeaknesses: { content: "Debolezze ignorate" },
        manualModelId: { content: "Modello manuale" },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per accedere a questa risorsa",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa risorsa",
      },
      notFound: {
        title: "abilità Non trovato",
        description: "L'abilità richiesta non esiste",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero dell'abilità",
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
        description: "Un conflitto si è verificato con lo stato attuale",
      },
    },
    voiceModelSelection: {
      systemDefault: "Predefinizione del sistema",
    },
    success: {
      title: "Operazione riuscita",
      description: "abilità recuperato con successo",
    },
    share: {
      button: "Condividi &amp; Earn",
      titleNamed: "Condividere {{name}} e guadagnare",
      title: "Condividi questa abilità & guadagnare",
      description:
        "Condividi questa abilità con il tuo link di riferimento. Guadagna 10% commissione ricorrente da ogni utente che si iscrive.",
      selectCode: "Selezionare il codice di riferimento:",
      noCodesYet: "Nessun codice di riferimento ancora",
      createCode: "Creare un codice",
      codePlaceholder: "ad es. MYCODE",
      creating: "Creare...",
      createFailed: "Non ho potuto creare quel codice. Provane un'altra.",
      linkReady: "Il tuo link di condivisione:",
      copied: "Copiato!",
      copyLink: "Copia Link",
      close: "Chiudi",
      authRequired:
        "Crea un account gratuito per ottenere il link di riferimento e iniziare a guadagnare.",
      signup: "Iscriviti gratis",
      login: "Hai gia' un conto? Accedi",
    },
  },
  patch: {
    title: "Capacità di aggiornamento",
    titleShort: "Abilità di aggiornamento",
    dynamicTitle: "Modifica: {{name}}",
    container: {
      title: "Capacità di aggiornamento",
      description: "Modificare un'abilità personalizzata esistente",
    },
    backButton: {
      label: "Ritorno all'abilità",
    },
    deleteButton: {
      label: "Eliminare le abilità",
    },
    submitButton: {
      label: "Capacità di aggiornamento",
      loadingText: "Abilita' di recupero...",
    },
    actions: {
      update: "Capacità di aggiornamento",
      updating: "Abilità di aggiornamento",
    },
    response: {
      success: {
        content: "abilità aggiornata con successo",
      },
    },
    id: {
      label: "abilità ID",
      description: "La slug o amichevole ID dell'abilità per aggiornare",
    },
    name: {
      label: "abilità Nome",
      description:
        "Dare alla vostra abilità un nome memorabile. Questo è il modo in cui voi e gli altri li identificherete.",
      placeholder: "Inserisci il nome dell'abilità",
      validation: {
        minLength: "Il nome deve essere almeno 2 caratteri",
        maxLength: "Il nome deve essere inferiore a 100 caratteri",
      },
    },
    tagline: {
      label: "Abilità",
      description:
        "Un'unica linea che cattura l'essenza della tua abilità. Tienilo breve e descrittivo.",
      placeholder: "Inserisci un breve slogan",
      validation: {
        minLength: "Tagline deve essere almeno 2 caratteri",
        maxLength: "Il tagline deve essere inferiore a 500 caratteri",
      },
    },
    icon: {
      label: "abilità Icon",
      description:
        "Scegli un emoji che rappresenta la tua abilità. Questa icona appare ogni volta che l'abilità viene visualizzata.",
    },
    description: {
      label: "descrizione",
      description:
        "Descrivi ciò che rende questa abilità unica. Qual e' il loro ruolo? Con cosa possono aiutare? Sii specifico e dettagliato.",
      placeholder: "Descrivi lo scopo e le capacità della tua abilità",
      validation: {
        minLength: "Descrizione deve essere almeno 10 competenze",
        maxLength: "La descrizione deve essere inferiore a 500 competenze",
      },
    },
    category: {
      label: "Categoria",
      description:
        "Scegli la categoria che meglio si adatta alla tua abilità. Questo aiuta con l'organizzazione e la scoperta.",
    },
    isPublic: {
      label: "Rendere pubblico",
      description:
        "Abilitare questo per condividere la vostra abilità con la comunità. Quando disattivato, l'abilità rimane privata e solo visibile a voi.",
    },
    chatModel: {
      label: "Modello di chat",
      placeholder: "Predefinizione del sistema",
    },
    voice: {
      label: "Voce",
      description:
        "Selezionare una voce di testo-a-speech per le risposte audio. Ogni abilità può avere la propria voce unica.",
      placeholder: "Predefinizione del sistema",
    },
    sttModel: {
      label: "Modello di testo",
      description: "Modello utilizzato per il riconoscimento vocale",
      placeholder: "Predefinizione del sistema",
    },
    imageVisionModel: {
      label: "Modello di visione dell'immagine",
      description: "Modello utilizzato per l'analisi delle immagini",
      placeholder: "Predefinizione del sistema",
    },
    videoVisionModel: {
      label: "Modello di visione video",
      description: "Modello utilizzato per l'analisi dei video",
      placeholder: "Predefinizione del sistema",
    },
    audioVisionModel: {
      label: "Modello di visione audio",
      description: "Modello utilizzato per l'analisi dell'audio",
      placeholder: "Predefinizione del sistema",
    },
    imageGenModel: {
      label: "Modello di generazione di immagini",
      description: "Modello utilizzato per la generazione di immagini",
      placeholder: "Predefinizione del sistema",
    },
    musicGenModel: {
      label: "Modello di generazione musicale",
      description: "Modello utilizzato per la generazione di musica",
      placeholder: "Predefinizione del sistema",
    },
    videoGenModel: {
      label: "Modello di generazione video",
      description: "Modello utilizzato per la generazione di video",
      placeholder: "Predefinizione del sistema",
    },
    systemPrompt: {
      label: "Prompt di sistema",
      description:
        "Definire il comportamento, la personalità e l'esperienza della vostra abilità. Questa è l'istruzione di base che modella come lo AI risponde. Siate dettagliati su tono, aree di conoscenza e stile di conversazione.",
      placeholder: "Sei un assistente utile che si specializza in...",
      validation: {
        minLength: "Il prompt dei sistemi deve essere di almeno 10 competenze",
        maxLength:
          "Il prompt dei sistemi deve essere inferiore a 5000 competenze",
      },
    },
    source: {
      label: "Fonte",
      description:
        "La fonte di questa abilità (incorporato, personalizzato, o comunità)",
    },
    modelSelection: {
      label: "Selezione del modello",
      description:
        "Scegliere come selezionare il modello AI - scegliere un modello specifico o lasciare che il sistema scelga in base ai filtri",
    },
    variants: {
      label: "Varianti",
      description:
        "Varianti denominate con selezioni di modelli per-varianti. Ogni variante ha bisogno: id (corda unica), modelSelection (richiesto), isDefault (esattamente si deve essere veri). Opzionale: displayName, overrides del modello vocale/vision/gen.",
      addButton: "Aggiungere Variante",
      setDefault: "Impostare come predefinito",
      remove: "Rimuovi",
      defaultBadge: "Predefinito",
      namePlaceholder: "Nome Variante (opzionale)",
      skillDefaults: "Predefinizioni di livello di abilità",
      skillDefaultsHint:
        "Fallback quando una variante non configura una modalità",
    },
    preferredModel: {
      label: "Modello preferito",
      description: "Il modello AI preferito per questa abilità",
    },
    availableTools: {
      label: "Strumenti consentiti",
      description:
        "Elenco di strumenti che questa abilità può utilizzare. Ogni voce ha bisogno di un toolId (utilizzare system_help_GET per scoprire gli ID degli strumenti disponibili). Impostare requiresConfirmation: true per richiedere prima di eseguire. Passare null per ereditare dalle impostazioni globali.",
    },
    pinnedTools: {
      label: "Strumenti perniciati",
      description:
        "Utensili fissati alla barra degli strumenti per un rapido accesso quando si utilizza questa abilità. Subset di availableTools. Passare null per utilizzare strumenti pinned di default.",
    },
    compactTrigger: {
      label: "Trigger compatto (tokens)",
      description:
        "Conteggio di token che innesca la compattazione automatica della conversazione. Impostare a null per utilizzare il default globale.",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati di abilità sono invalidi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per aggiornare le competenze",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questa abilità",
      },
      notFound: {
        title: "abilità Non trovato",
        description: "L'abilità che stai cercando di aggiornare non esiste",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'aggiornamento dell'abilità",
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
        description:
          "Un conflitto si è verificato durante l'aggiornamento delle competenze",
      },
    },
    success: {
      title: "Abilità aggiornata",
      description:
        "La tua abilità personalizzata è stata aggiornata con successo",
    },
  },
  delete: {
    title: "Eliminare le abilità",
    titleShort: "Eliminare le competenze",
    dynamicTitle: "Elimina: {{name}}",
    description: "Eliminare un'abilità personalizzata",
    container: {
      title: "Eliminare le abilità",
      description: "Rimuovere permanentemente questa abilità personalizzata",
    },
    backButton: {
      label: "Ritorno all'abilità",
    },
    actions: {
      delete: "Eliminare le abilità",
      deleting: "Delezione delle abilità",
    },
    id: {
      label: "abilità ID",
      description: "La slug o amichevole ID dell'abilità per eliminare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati di abilità sono invalidi",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a cancellare questa abilità",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eliminare questa abilità",
      },
      notFound: {
        title: "abilità Non trovato",
        description: "L'abilità che stai cercando di eliminare non esiste",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la cancellazione dell'abilità",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante la cancellazione dell'abilità",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "L'abilità è stata modificata da un altro utente",
      },
    },
    success: {
      title: "abilità eliminata",
      description: "L'abilità è stata eliminata con successo",
      content: "abilità cancellata con successo",
    },
  },
};
