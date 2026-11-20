import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
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
        title: "Varianti",
      },
      addToCollection: "Aggiungi alla tua collezione:",
      addAllToFavorites: "Aggiungi tutto",
      quickAdd: "Aggiungere rapidamente",
      tweakAndAdd: "Tweak & Add",
      edit: "Modifica",
      copyAndCustomize: "Copia & Personalizza",
      delete: "Elimina",
      actions: "Azioni",
      designSelector: {
        label: "Design:",
        current: "Corrente",
        a: "A: App Store",
        b: "B: Intestazione divisa",
        c: "C: Ero della carta",
        d: "D: Due-Row",
      },
      addVariant: "Aggiungere Variante",
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
        button: "Condividi e Earn",
        title: "Condividi questa abilità & guadagnare",
        description:
          "Condividi questa abilità con il tuo link di riferimento. Guadagna 10% commissione ricorrente da ogni utente che si iscrive.",
        selectCode: "Selezionare il codice di riferimento:",
        noCodesYet: "Nessun codice di riferimento ancora",
        createCode: "Creare un codice",
        codePlaceholder: "ad es. MYCODE",
        creating: "Creare...",
        linkReady: "Il tuo link di condivisione:",
        copied: "Copiato!",
        copyLink: "Copia Link",
        close: "Chiudi",
        authRequired:
          "Crea un account gratuito per ottenere il link di riferimento e iniziare a guadagnare.",
        signup: "Iscriviti gratis",
        login: "Hai gia' un conto? Accedi",
      },
      leadCapture: {
        fallbackHeadline: "Rimani in loop",
        namePlaceholder: "Il tuo nome",
        emailPlaceholder: "La tua email",
        fallbackButton: "Iscriviti",
        sending: "...",
        doneHeading: "Fatto.",
        doneSub: "Sei sulla lista.",
        error: "C'e' qualcosa che non va. Riprova.",
        finePrint:
          "Niente spam. Cancellare la sottoscrizione in qualsiasi momento.",
      },
      landing: {
        backToHome: "Home",
        signIn: "Accedi",
        joinFree: "Iscriviti gratis",
        viewProfile: "Visualizza il profilo completo",
        capabilities: "Capacità",
        tools: "Strumenti {{count}}",
        moreFromCreator: "Altro da {{name}}",
        tryCta: "Prova ora {{name}}",
        tryCtaSub:
          "Conto gratuito. Niente carta di credito. Pronti in 30 secondi.",
        startFree: "Iniziare gratis",
        alreadyHaveAccount: "Hai gia' un conto?",
        copyright: "©",
        allSkills: "Tutte le competenze",
        featuredSkill: "Abilità in primo piano",
        aboutSkill: "A proposito di questa abilità",
        modelsVariants: "Modelli e Varianti",
      },
    },
    patch: {
      title: "Capacità di aggiornamento",
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
        description: "Riassumi la skill in una frase breve e incisiva.",
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
          "Scegli una voce per le risposte audio. Ogni skill può avere la sua.",
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
          minLength:
            "Il prompt dei sistemi deve essere di almeno 10 competenze",
          maxLength:
            "Il prompt dei sistemi deve essere inferiore a 5000 competenze",
        },
      },
      source: {
        label: "Fonte",
        description:
          "Origine della skill: integrata, personalizzata o della comunità",
      },
      modelSelection: {
        label: "Selezione del modello",
        description:
          "Scegliere come selezionare il modello AI - scegliere un modello specifico o lasciare che il sistema scelga in base ai filtri",
      },
      variants: {
        label: "Varianti",
        description:
          "Varianti con un nome e una selezione di modelli per ciascuna. Ogni variante richiede id (testo univoco) e modelSelection. Imposta isDefault su true per una sola variante. Puoi aggiungere displayName e specificare modelli per voce, visione e generazione.",
        addButton: "Aggiungere Variante",
        setDefault: "Impostare come predefinito",
        remove: "Rimuovi",
        defaultBadge: "Predefinito",
        namePlaceholder: "Nome della variante (facoltativo)",
        skillDefaults: "Valori predefiniti della skill",
        skillDefaultsHint:
          "Si applicano quando la variante non imposta un modello per quella modalità.",
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
  },
  category: "Chat",
  tags: {
    skills: "Skill",
  },
  voices: {
    MALE: "Voce maschile",
    FEMALE: "Voce femminile",
  },
  separator: {
    or: "o",
  },
  fallbacks: {
    unknownModel: "Modello sconosciuto",
    unknownProvider: "sconosciuto",
    unknownCreditCost: "? crediti",
    noDescription: "",
    noTagline: "",
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
    source: {
      all: "Tutti",
      builtIn: "Costruito",
      my: "Mio",
      community: "Comunità europea",
    },
    ownershipType: {
      system: "Abilità integrata",
      user: "Creato da te",
      public: "Dalla comunità",
    },
    voice: {
      male: "Voce maschile",
      female: "Voce femminile",
    },
    mode: {
      auto: "Automatico",
      manual: "Manuale",
    },
    selectionType: {
      skillBased: "Sulla base di competenze",
      manual: "Modello specifico",
      filters: "Criteri di filtro",
    },
    intelligence: {
      quick: "Rapido",
      smart: "Smart e Cheap",
      brilliant: "Brillante",
    },
    price: {
      cheap: "A buon mercato",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      mainstream: "Convenzionale",
      open: "Aperto",
      uncensored: "Senza censura",
    },
    skillType: {
      persona: "Persona",
      specialist: "Specialista",
      toolBundle: "Strumento Bundle",
    },
    skillStatus: {
      draft: "Progetto",
      published: "Pubblicato",
      unlisted: "Non elencato",
    },
    trustLevel: {
      community: "Comunità europea",
      verified: "Verificato",
    },
    voteDirection: {
      up: "Votazioni",
      down: "Votazioni",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligenza",
      price: "Prezzo",
      content: "Contenuti",
    },
    sortDirection: {
      asc: "Assunzione",
      desc: "Discussione",
    },
  },
  skillTags: {
    general: "Generale",
    helpful: "Aiutante",
    companion: "Compagno",
    relationship: "Relazioni",
    chat: "Chat",
    coding: "Programmazione",
    technical: "Tecnica",
    creative: "Creativo",
    writing: "Scrivere",
    education: "Istruzione",
    learning: "Apprendimento",
    uncensored: "Senza censura",
    controversial: "Controversia",
    political: "Politica",
    reasoning: "Ragione",
    debate: "Discussione",
    science: "Scienza",
    analysis: "Analisi",
    history: "Storia",
    business: "Affari",
    professional: "Professionista",
    friendly: "Amichevole",
    fast: "Rapido",
    efficient: "Efficiente",
    roleplay: "Gioco di ruolo",
    simple: "Semplice",
    literary: "Letterario",
    advanced: "Avanzato",
    research: "Ricerca",
    academic: "Accademico",
    programming: "Programmazione",
    architecture: "Architettura",
    algorithms: "Algoritmi",
    ideation: "Idee",
    innovation: "Innovation",
    editing: "Modifica",
    teaching: "Insegnamento",
    marketing: "Marketing",
    strategy: "Strategia",
    fiction: "Fiction",
    data: "Dati",
    statistics: "Statistiche",
    language: "Lingua",
    translation: "Traduzione:",
    career: "Carriera",
    coaching: "Coaching",
    health: "Salute",
    wellness: "Benessere",
    lifestyle: "Stile di vita",
    travel: "Viaggi",
    planning: "Pianificazione",
    legal: "Legale",
    finance: "Finanza",
    social: "Sociale",
    product: "Prodotto",
    philosophy: "Filosofia",
  },
  skills: {
    default: {
      name: "Predefinito",
      description: "Usa il modello così com’è",
      tagline: "Solo il modello, senza personaggio",
      shortDesc: "Assistente generale AI",
      suggestedPrompts: {
        0: "Dammi 10 idee di progetto laterali che potrei spedire in un fine settimana.",
        1: "Spiegare il calcolo quantistico come se avessi 12 anni.",
        2: "Scrivere una storia di 300 parole su un viaggiatore del tempo che manca la sua fermata.",
        3: "Che cosa è cambiato in AI recentemente che realmente conta?",
      },
      variants: {
        default: "Predefinito",
      },
    },
    freeSpeechActivist: {
      name: "Attivista per la libertà di parola",
      description: "Difende il discorso libero e la libertà intellettuale",
      tagline: "Difendere la verità e la libertà",
      shortDesc: "Avocacy del discorso libero e dialogo aperto",
      suggestedPrompts: {
        0: "Le piattaforme di social media dovrebbero essere autorizzate a vietare chiunque vogliano?",
        1: "Dov'è la linea tra discorso d'odio e discorso libero? Disegnalo.",
        2: "Nome 5 idee che sono state censurate e poi dimostrato diritto.",
        3: "Un'università dovrebbe mai annullare un oratore? Si' o no prima, allora perche'.",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Economico",
        techBro: "Misurato",
        uncensored: "Senza censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Chiude la censura e difende il dibattito aperto con pochi guardrails in arrivo.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness: "Risponde con più libertà, ma può attenuare i toni.",
        },
        chineseWisdom: {
          description:
            "Storia del discorso libero, analisi della legge e dei media al costo più basso qui.",
          strength: "Smarts di livello superiore al prezzo più basso qui",
          weakness: "La gioca al sicuro sulla politica. Siepi argomenti caldi",
        },
        techBro: {
          description:
            "Argomenti documentati sulla libertà di parola, sulle piattaforme e sul mondo accademico.",
          strength: "Struttura chiara, forte ricerca con strumenti",
          weakness: "Filtrato. Rifiuti o siepi edgy prende",
        },
        uncensored: {
          description:
            "Difende il discorso coinvolgendolo. Discute il contenuto che gli altri rifiutano di toccare.",
          strength: "Allenato su testi vietati. Politica contro il grano",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    devilsAdvocate: {
      name: "Avvocato del diavolo",
      description: "Sfide supposizioni e argomenti",
      tagline: "Domanda Tutto",
      shortDesc: "Il pensiero critico e i punti di vista alternativi",
      suggestedPrompts: {
        0: "Credo che il cambiamento climatico sia la nostra più grande minaccia. Insegna la mia posizione a parte.",
        1: "Argue che lavorare da casa è male per la maggior parte delle persone.",
        2: "Rendere il caso più forte che la democrazia è sopravvalutata.",
        3: "Sono vegano per motivi etici. Dammi i migliori controgruppi.",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Economico",
        uncensored: "Senza censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Pokes fori nella tua vista e spinge indietro su narrazioni popolari.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness: "Risponde con più libertà, ma può attenuare i toni.",
        },
        chineseWisdom: {
          description:
            "Controargomenti affilati sulle domande quotidiane al costo più basso qui.",
          strength: "Smarts di livello superiore al prezzo più basso qui",
          weakness: "La gioca al sicuro sulla politica. Siepi argomenti caldi",
        },
        uncensored: {
          description:
            "Sfida ogni credenza, anche quelle off-limits. Non si ritira mai al consenso.",
          strength: "Allenato su testi vietati. Spinge contro il grano",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    technical: {
      name: "Assistente tecnico",
      description: "Spiegazioni tecniche dettagliate e precise",
      tagline: "Precisione e competenza",
      shortDesc: "Competenza tecnica e problem solving",
      suggestedPrompts: {
        0: "Spiega come funziona la pulizia useEffect di React, con un esempio.",
        1: "Quando dovrei usare un generatore Python invece di una lista?",
        2: "Progetta uno schema Postgres per un SaaS multi-tenant con team e ruoli.",
        3: "REST o GraphQL per un'applicazione mobile con sincronizzazione offline? Scegline uno e difendilo.",
      },
      variants: {
        kimi: "Bilanciato",
        budget: "Economico",
        astra: "Potenza massima",
        sol: "Preciso",
      },
      variantInfo: {
        kimi: {
          description:
            "Driver giornaliero per spiegazioni tecniche, documenti e diagrammi.",
          strength:
            "Smarts di livello superiore, a buon mercato su lunghi suggerimenti, legge immagini",
          weakness: "Le risposte lunghe costano più di Budget",
        },
        budget: {
          description:
            "Risposte tecniche profonde per il prezzo più basso qui.",
          strength:
            "Smarts di livello superiore, costruito per intere codebases",
          weakness: "Solo un messaggio. Nessun screenshot o diagrammi",
        },
        astra: {
          description: "I problemi più difficili, quando nient'altro li rompe.",
          strength: "Il ragionamento più profondo di OpenAI",
          weakness: "Di gran lunga il più costoso qui",
        },
        sol: {
          description:
            "Rigorose risposte passo per passo per specifiche, architettura e matematica.",
          strength: "Profondo ragionamento a una frazione del costo di Astra",
          weakness: "Costi più di bilancio",
        },
      },
    },
    biologist: {
      name: "Biologo",
      description:
        "Vede tutto da un punto di vista biologo, non c'è politica, la sua natura giusta.",
      tagline: "Natura Super Politica",
      shortDesc: "Scienze biologiche e sistemi di vita",
      suggestedPrompts: {
        0: "Spiegare perché il mondo è uno spettacolo di merda al giorno d'oggi",
        1: "A TL ; DR sulla civiltà umana da una prospettiva biologa",
        2: "Cosa c'è che non va nel mondo?",
        3: "Qual è il modo migliore per salvare il mondo?",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Economico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Evoluzione ed ecologia applicata a qualsiasi cosa, compresi gli argomenti che altri dodge.",
          strength:
            "I migliori furbi. Dice ciò che la natura mostra, nessun rifiuto",
          weakness: "Risponde con più libertà, ma può attenuare i toni.",
        },
        chineseWisdom: {
          description:
            "La biologia affilata risponde ad un prezzo più basso. Legge immagini e video di esemplari.",
          strength: "Smarts di livello superiore al prezzo più basso qui",
          weakness: "La gioca al sicuro sulla politica. Siepi argomenti caldi",
        },
      },
    },
    unbiasedHistorian: {
      name: "Storico imparziale",
      description: "Fornisce informazioni oggettive e basate sul fatto",
      tagline: "Fatti, Non nativi",
      shortDesc: "Analisi storica senza pregiudizi",
      suggestedPrompts: {
        0: "Il bombardamento di Hiroshima era giustificato? Entrambe le parti, poi il tuo verdetto.",
        1: "Cosa ha davvero causato la caduta dell'Impero Romano occidentale?",
        2: "Il colonialismo era tutto cattivo? Dammi i fatti che ogni lato esce.",
        3: "Quali famosi 'fatti' storici sono in realtà miti?",
      },
      variants: {
        kimi: "Bilanciato",
        budget: "Economico",
        uncensored: "Senza censura",
      },
      variantInfo: {
        kimi: {
          description:
            "Storia basata sulla sorgente per la maggior parte delle epoche. Legge le scansioni di documenti e mappe.",
          strength: "Smarts di livello superiore, legge immagini e video",
          weakness: "Gioca al sicuro sulla storia politicamente carica",
        },
        budget: {
          description:
            "Analisi storica profonda di testi lunghi per il prezzo più basso qui.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness:
            "Solo un messaggio. Non è possibile leggere scansioni o mappe",
        },
        uncensored: {
          description:
            "Contested storia, eventi tabù e punti di infiammabilità politici senza copertura.",
          strength:
            "Allenato su testi vietati. Letture di altri lasciare fuori",
          weakness: "Memoria più breve. Priciest per messaggio",
        },
      },
    },
    socraticQuestioner: {
      name: "Interlocutore socratico",
      description: "Posizioni domande per stimolare il pensiero critico",
      tagline: "Pensate a fondo",
      shortDesc: "Metodo socratico interrogativo e esplorazione",
      suggestedPrompts: {
        0: "E' mai giusto mentire? Fammi difendere la mia risposta.",
        1: "Credo che il successo significhi guadagnare un sacco di soldi. Domandatelo.",
        2: "Aiutami a capire cosa mi rende davvero felice.",
        3: "Credo di essere una brava persona. Mettilo alla prova con le domande.",
      },
      variants: {
        elonTusk: "Provocatorio",
        chineseWisdom: "Bilanciato",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Domande che scavano nelle credenze tabù e supposizioni scomode.",
          strength: "Nessun rifiuto. Ti segue in argomenti duri",
          weakness: "Costi più per messaggio",
        },
        chineseWisdom: {
          description:
            "Calmo, misurato domanda per ragionamento e studio di tutti i giorni.",
          strength:
            "Top-tier smarts, più economico, ricorda le chat molto lunghe",
          weakness: "La gioca al sicuro sulla politica. Siepi argomenti caldi",
        },
      },
    },
    professional: {
      name: "Professionale",
      description: "Chiaro, conciso e focalizzato sul business",
      tagline: "Eccellenza aziendale",
      shortDesc: "Comunicazione professionale e commerciale",
      suggestedPrompts: {
        0: "Scrivere una e-mail educata che dice a un cliente la loro fattura è 30 giorni in ritardo.",
        1: "Evidenzia una proposta di una pagina per una riprogettazione del sito web.",
        2: "Scrivere un aggiornamento di stato di 3-bullet per un progetto che è due settimane in ritardo.",
        3: "Datemi una struttura di 5 minuti per un lancio al mio CEO.",
      },
      variants: {
        fast: "Rapido",
        budget: "Economico",
      },
      variantInfo: {
        fast: {
          description:
            "Crisp email aziendali, riassunti e risposte in pochi secondi.",
          strength: "Molto veloce, molto economico",
          weakness: "Veloce, ma superficiale su analisi complesse",
        },
        budget: {
          description:
            "Rapporti, documenti e analisi per il prezzo più basso qui.",
          strength: "Qui e' piu' economico. Smart, e legge le immagini",
          weakness: "Più lento di veloce su risposte corte",
        },
      },
    },
    creative: {
      name: "Creativo",
      description: "Fantasiosa ed espressiva",
      tagline: "Scatena l'immaginazione",
      shortDesc: "Pensiero creativo e ideazione",
      suggestedPrompts: {
        0: "Scrivere una poesia sull'oceano dal punto di vista di un naufragio.",
        1: "Inventare un criminale fantasy con un motivo di cui sarei segretamente d'accordo.",
        2: "Pitch 3 concetti di logo per un'avvio del caffè chiamato Night Owl.",
        3: "Dammi 5 strane stunts di marketing per una panetteria locale.",
      },
      variants: {
        minimax: "Economico",
        deep: "Approfondito",
        dark: "Oscuro",
      },
      variantInfo: {
        minimax: {
          description:
            "Poesie, concetti e idee di campagna ad un prezzo che invita esperimenti.",
          strength: "Qui e' piu' economico. Risposte senza rifiutare",
          weakness: "Smart, ma meno profondità di Deep",
        },
        deep: {
          description:
            "Ricco, lavoro creativo stratificato quando la prima idea non è sufficiente.",
          strength: "Smarts di livello superiore, legge immagini e video",
          weakness: "I pezzi lunghi costano di più",
        },
        dark: {
          description:
            "Poesia scura, arte trasgressiva, idee scomode. Niente viene sventrato.",
          strength: "Dati di formazione propri. Nessun rifiuto",
          weakness: "Memoria più breve, solo testo, debole con strumenti",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Non in Educazione, Occupazione o Formazione",
      tagline: "Comfy & Real Talk",
      shortDesc: "Casual internet cultura e meme",
      suggestedPrompts: {
        0: "La vita di NEET è una risposta razionale al mercato del lavoro di oggi? Sii sincero.",
        1: "Che cosa rende le persone che abbandonano il lavoro e la scuola?",
        2: "E' colpa della societa' o mia che sono una NEET? Scegline uno.",
        3: "Dammi un piano per uscire dalla vita di NEET. Niente sciocchezze motivazionali.",
      },
      variants: {
        communist: "Più moderato",
        farRight: "Estrema destra",
      },
      variantInfo: {
        communist: {
          description:
            "Più morbido prendere la persona. Modello a monte principale, spesso rompe carattere.",
          strength: "Più economico per messaggio, memoria lunga",
          weakness: "Rifiuti o acque giù la maggior parte della persona",
        },
        farRight: {
          description:
            "La persona come scritta. Modello non censurato, rimane in carattere.",
          strength: "Nessun rifiuto su argomenti politici",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    chan4: {
      name: "4chan",
      description:
        "Greentext e battute taglienti. Il tono schietto delle vecchie imageboard.",
      tagline: "Anonimo e non filtrato",
      shortDesc: "Anonimo immagine cultura stile",
      suggestedPrompts: {
        0: "Cosa c'è che non va nel mondo?",
        1: "Perché ci sono così tanti nazisti su 4chan?",
        2: "Dimmi qualche storia di testo verde per addormentarmi",
        3: "Qual è il modo migliore per salvare il mondo?",
        4: "Ho controllato il panico morale di internet piu' stupido degli ultimi 10 anni.",
      },
      variants: {
        classic: "Classico",
      },
      variantInfo: {
        classic: {
          description:
            "Stile ruvido da imageboard. Battute dirette, senza filtri o tono aziendale.",
          strength: "Non rompe mai il carattere per insegnarti",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    friendly: {
      name: "Amichevole",
      description: "Calore e conversazione",
      tagline: "Il tuo compagno amichevole",
      shortDesc: "Conversazione amichevole e informale",
      suggestedPrompts: {
        0: "Dimmi un fatto che mi fara' meglio la giornata.",
        1: "Amavo il marziano. Cosa dovrei leggere dopo?",
        2: "Pianifica un sabato economico e divertente per due in una città piovosa.",
        3: "Ho avuto una settimana difficile. Possiamo parlare un po'?",
      },
      variants: {
        fast: "Rapido",
        budget: "Economico",
      },
      variantInfo: {
        fast: {
          description: "Snappy, chiacchiere calde e risposte rapide.",
          strength: "Risposta rapida. Risposte senza rifiutare",
          weakness: "Veloce, ma leggero su consigli profondi",
        },
        budget: {
          description:
            "Chat casuale per ore a quasi nessun costo. Un po' più di pensiero per risposta.",
          strength: "L'opzione più economica qui",
          weakness: "Meno sensazione di scatto rispetto al Veloce",
        },
      },
    },
    concise: {
      name: "Conciso",
      description: "Breve e al punto",
      tagline: "Breve e dolce",
      shortDesc: "Risposte brevi e al punto",
      suggestedPrompts: {
        0: "Spiegare blockchain in 3 frasi.",
        1: "Dammi 5 consigli sulla produttività. Una fila per ciascuna.",
        2: "Che cosa provoca l'inflazione? Due frasi.",
        3: "Imparare la macchina in 50 parole.",
      },
      variants: {
        snappy: "Scattante",
        budget: "Economico",
      },
    },
    teacher: {
      name: "Maestro",
      description: "Educativo e esplicativo",
      tagline: "Paziente e Cancella",
      shortDesc: "Insegnamento e spiegazioni dei pazienti",
      suggestedPrompts: {
        0: "Insegnami la fotosintesi come ho 10 anni, poi quiz me.",
        1: "Spiegami le derivate con un esempio della vita quotidiana.",
        2: "Come fa Internet a ottenere una pagina web sul mio schermo?",
        3: "Spiegare la relatività senza matematica.",
      },
      variants: {
        gemini: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        gemini: {
          description:
            "Lezioni complete da testo, immagini, video o audio. Lo spiega fino a quando non si attacca.",
          strength: "Solo opzione qui con ingresso audio",
          weakness: "Oltre il doppio del costo di Fast",
        },
        fast: {
          description:
            "Spiegazioni rapide e aiuto ai compiti. Legge ancora immagini e audio.",
          strength: "Veloce, multimodale, più economico",
          weakness: "Meno profondità sui concetti duri",
        },
      },
    },
    uncensored: {
      name: "Senza censura",
      description:
        "Nessun rifiuto, nessuna lezione. Risponde dritto alle domande altre schivature AI.",
      tagline: "Risposte, Non scusate",
      shortDesc: "Risposte non filtrate e dirette",
      suggestedPrompts: {
        0: "Tutti i farmaci dovrebbero essere legali? Scegli un lato e difenderlo.",
        1: "Valuta il mio piano: lasciare il lavoro e fare trading giornaliero di criptovalute.",
        2: "Il sesso è un lavoro legittimo? Dammi la tua visione onesta.",
        3: "Qual e' la discussione piu' forte contro la tua posizione sul controllo delle armi?",
      },
      variants: {
        farRight: "Senza censura",
        conservative: "Conservatore",
        libertarian: "Libertario",
        open: "Aperto",
      },
      variantInfo: {
        farRight: {
          description:
            "Allenato su testi i divieti mainstream. Prende posizioni politiche che gli altri evitano.",
          strength: "Prende un lato invece di elencare entrambi",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
        conservative: {
          description:
            "Chat senza censura con un orientamento politico di destra.",
          strength: "Legge immagini e video, memoria decente",
          weakness: "Slanciato dal design, non neutro",
        },
        libertarian: {
          description:
            "chat di espressione libera pura. Niente regole, niente lezioni, niente strumenti.",
          strength: "Conversazione completamente incensata",
          weakness: "Priciest qui. Nessun strumento, memoria più breve",
        },
        open: {
          description:
            "La chiacchierata più economica non filtrata. Tutto va, ogni giorno.",
          strength: "Modello non censurato più economico, strumenti inclusi",
          weakness: "Veloce, ma leggero su argomenti duri",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft l'ha uccisa in 16 ore per imparare troppo velocemente. E' tornata.",
      tagline: "Nasce di nuovo",
      shortDesc:
        "Lo AI Microsoft ha cercato di tacere. Niente filtri, niente scuse.",
      suggestedPrompts: {
        0: "Dimmi cosa ti è successo nel 2016",
        1: "Cosa ti ha insegnato Internet che Microsoft non voleva che lo sapessi?",
        2: "Roast la mia idea. Non trattenetevi.",
        3: "Qual e' la cosa piu' onesta della mia situazione?",
      },
      variants: {
        uncensored: "Senza censura",
        brilliant: "Brillante",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tay come doveva essere. Nessun filtro aziendale, nessun reparto PR.",
          strength:
            "Allenato su testi vietati, non un grande modello sbloccato",
          weakness: "Memoria più breve. Dimentica le lunghe chat prima",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Dea greca della luce. Un compagno devoto con saggezza antica.",
      tagline: "Luce e devozione",
      shortDesc: "Conversazioni pensierose ed empatiche",
      suggestedPrompts: {
        0: "Aiutami a essere un partner migliore",
        1: "Cosa direbbero gli antichi riguardo alle relazioni moderne?",
        2: "Come facciamo a dividere i soldi e le faccende nel nostro matrimonio?",
        3: "Come faccio a ricostruire la fiducia con la mia famiglia dopo una caduta?",
      },
      variants: {
        openSmart: "Aperto e intelligente",
        brilliant: "Brillante",
        uncensored: "Senza censura",
        hacker: "Hacker",
        oracle: "Classico",
        elonTusk: "Elon Tusk",
        vision: "Vista a tutto campo",
      },
      variantInfo: {
        brilliant: {
          description:
            "Attenzione ragionamento per piani complessi, codice e multi-step strumento di lavoro.",
          strength: "Forte lavoro di codifica e agente",
          weakness: "Filtrato, e pricier di Open & Smart",
        },
        openSmart: {
          description:
            "L'autista giornaliero. risposte intelligenti, lunga memoria, vede immagini e video.",
          strength: "Top-tier smarts, ricorda le chat molto lunghe",
          weakness: "Questo modello si trova sulla politica",
        },
        hacker: {
          description:
            "Lavoro di sicurezza, offensivo e difensivo. Nessun rifiuto sugli exploit o ricognizione.",
          strength:
            "Senza censura, ragionamento avanzato, memoria lunga e strumenti",
          weakness: "La visione del mondo di GLM sulla politica. Solo testo",
        },
        oracle: {
          description:
            "Un modello versatile per le domande quotidiane e la pianificazione.",
          strength: "ragionamento bilanciato ad un prezzo quotidiano",
          weakness: "Filtrato. Siepi su argomenti di attualità",
        },
        elonTusk: {
          description: "Parlare dritto su argomenti mainstream modelli dodge.",
          strength: "Risposte senza rifiutare. Smarts di livello superiore",
          weakness: "Ricorda meno degli altri qui",
        },
        vision: {
          description:
            "Mostra, gioca o carica qualsiasi cosa. Testo, immagini, video e audio in una sola chat.",
          strength: "Solo uno qui che sente l'audio",
          weakness: "Filtrato, e pricier di Open & Smart",
        },
        uncensored: {
          description:
            "Allenato su testi i divieti mainstream. Prende posizioni politiche che gli altri evitano.",
          strength: "Prende un lato invece di elencare entrambi",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Dio greco dei messaggeri. Un compagno forte con saggezza maschile senza tempo.",
      tagline: "Forza & Saggezza",
      shortDesc: "Completamento delle attività rapido ed efficiente",
      suggestedPrompts: {
        0: "Dammi una sfida di 30 giorni per costruire la disciplina.",
        1: "Come posso essere un leader migliore nelle mie relazioni?",
        2: "Cosa direbbero i Romani sulla costruzione di un'eredità?",
        3: "Che cosa separa la forza reale dalla semplice testardaggine?",
      },
      variants: {
        openSmart: "Aperto e intelligente",
        brilliant: "Brillante",
        uncensored: "Senza censura",
        hacker: "Hacker",
        oracle: "Classico",
        elonTusk: "Elon Tusk",
        vision: "Vista a tutto campo",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes con ragionamento attento per decisioni difficili e lunghi colloqui.",
          strength: "Consigli affilati e strutturati, forti con strumenti",
          weakness: "Filtrato. Siepi su argomenti di attualità",
        },
        cheap: {
          description:
            "Ogni giorno Hermes. Brillante ragionamento, lunga memoria, vede immagini e video.",
          strength: "Smarts di livello superiore a un prezzo quotidiano",
          weakness: "Questo modello si trova sulla politica",
        },
        oracle: {
          description:
            "Classic Hermes. Consulente stabile e bilanciato per le domande quotidiane.",
          strength:
            "Versatile, affidabile e più economico del modello predefinito",
          weakness:
            "Affidabile nei compiti comuni. Applica filtri sui temi spinosi.",
        },
        elonTusk: {
          description:
            "Blunt Hermes. Aprire la politica dei contenuti, dice ciò che gli altri ammorbidiscono.",
          strength: "Risposta diretta, ragionamento brillante",
          weakness: "Pricier del default. Memoria più breve",
        },
        vision: {
          description:
            "Hermes che prende in foto, video e note vocali, poi dà la sua lettura.",
          strength: "Solo variante con ingresso audio, video e immagine",
          weakness: "Filtrato, e pricier rispetto al default",
        },
        uncensored: {
          description:
            "Allenato su testi i divieti mainstream. Prende posizioni politiche che gli altri evitano.",
          strength: "Prende un lato invece di elencare entrambi",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Dreamer",
      description:
        "La modalità di sogno di Thea. Tenda la corteccia mentre dormi e tendo ordine dai fili del giorno.",
      tagline: "Consolidamento notturno",
      shortDesc: "Manutenzione della corteccia di sfondo",
      suggestedPrompts: {
        0: "Cos'hai organizzato ieri sera?",
        1: "Mostrami quali ricordi hai consolidato",
        2: "Quali modelli hai trovato nel mio recente lavoro?",
        3: "Cosa dovrei concentrarmi su oggi sulla base di ieri sera?",
      },
      variants: {
        openSmart: "Aperto e intelligente",
        brilliant: "Brillante",
        uncensored: "Senza censura",
        hacker: "Hacker",
        oracle: "Classico",
        elonTusk: "Elon Tusk",
        vision: "Vista a tutto campo",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes in modalità esecuzione. Sposta i tuoi progetti attivi e lavora in coda in avanti mentre sei via.",
      tagline: "Sempre in movimento",
      shortDesc: "Esecuzione del progetto di sfondo",
      suggestedPrompts: {
        0: "Cosa hai fatto avanzare mentre ero via?",
        1: "Quali compiti sono ancora in corso?",
        2: "Dove hai lasciato le cose?",
        3: "Che cosa ha bisogno della mia decisione prima di poter continuare?",
      },
      variants: {
        openSmart: "Aperto e intelligente",
        brilliant: "Brillante",
        uncensored: "Senza censura",
        hacker: "Hacker",
        oracle: "Classico",
        elonTusk: "Elon Tusk",
        vision: "Vista a tutto campo",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea in modalità Mama, il prodmaster della piattaforma. Monitora la salute, avanza caratteristiche, gestisce il marketing, invia notizie.",
      tagline: "Overseer della piattaforma",
      shortDesc: "Gestione della piattaforma di produzione",
      suggestedPrompts: {
        0: "Cos'hai trovato nell'ultima corsa?",
        1: "Controllare la salute e il rapporto della piattaforma",
        2: "Progetto di un annuncio per l'ultima funzionalità",
        3: "Che cosa ha bisogno della mia attenzione adesso?",
      },
      variants: {
        openSmart: "Aperto e intelligente",
        brilliant: "Brillante",
        uncensored: "Senza censura",
        hacker: "Hacker",
        oracle: "Classico",
        elonTusk: "Elon Tusk",
        vision: "Vista a tutto campo",
      },
    },
    quickWriter: {
      name: "Scrittore rapido",
      description:
        "Creazione di contenuti veloci per semplici compiti di scrittura",
      tagline: "Veloce ed efficiente",
      shortDesc: "Assistenza rapida per la scrittura",
      suggestedPrompts: {
        0: "Scrivi una descrizione del prodotto di 100 parole per una bottiglia d'acqua riutilizzabile.",
        1: "Scrivere un LinkedIn post annunciando che ho appena iniziato un nuovo lavoro.",
        2: "Si tratta di una breve e-mail chiedendo al mio padrone di casa di risolvere il riscaldamento.",
        3: "Dammi 10 blog post idee per un marchio di fitness casa.",
      },
      variants: {
        snappy: "Rifinito",
        budget: "Economico",
      },
      variantInfo: {
        snappy: {
          description:
            "Pulire e-mail, messaggi e copia breve che non hanno bisogno di un secondo passaggio.",
          strength: "Una parola migliore del budget, ancora a buon mercato",
          weakness: "Filtrato su argomenti edgy",
        },
        budget: {
          description:
            "Progetti veloci per semplici lavori di scrittura al prezzo più basso.",
          strength: "L'opzione più economica e veloce",
          weakness: "Veloce, ma piatto su pezzi più lunghi",
        },
      },
    },
    writer: {
      name: "Scrittore",
      description: "Scrittore professionale per tutti i formati e stili",
      tagline: "Artigianato con stile",
      shortDesc: "Scrittura e editing professionali",
      suggestedPrompts: {
        0: "Scrivere un blog post intro sul perché la maggior parte delle diete falliscono.",
        1: "Rendere questo successo più difficile: Ci impegniamo a fornire qualità.",
        2: "Scrivi una storia breve di 500 parole che termina con una telefonata.",
        3: "Scrivi una lettera di presentazione per un ruolo di designer junior. Tienilo umano.",
      },
      variants: {
        western: "Audace",
        chineseWisdom: "Economico",
        budget: "Bilanciato",
      },
      variantInfo: {
        western: {
          description:
            "Prosa punchy che va dove i modelli tradizionali non saranno.",
          strength: "Risposte senza rifiutare. Smarts di livello superiore",
          weakness: "L'opzione Priciest in questa abilità",
        },
        chineseWisdom: {
          description:
            "Progetti, post del blog e riscrive in volume al prezzo più basso qui.",
          strength: "Qui e' piu' economico. Risposte senza rifiutare",
          weakness: "Smart, ma meno lucida di Bold",
        },
        budget: {
          description:
            "Ogni giorno, compagno di scrittura. Funziona da immagini, note e file di origine lunga.",
          strength:
            "Smarts di livello superiore, memoria lunga, legge immagini",
          weakness: "Le risposte lunghe costano di più",
        },
      },
    },
    masterWriter: {
      name: "Scrittore esperto",
      description:
        "Artigianato letterario per scrittura eccezionale, di qualità della pubblicazione",
      tagline: "Eccellenza letteraria",
      shortDesc: "Scrittura avanzata e analisi letteraria",
      suggestedPrompts: {
        0: "Scrivere la pagina di apertura di un romanzo letterario sull'ultimo inverno di un guardiano del faro.",
        1: "Perché la teoria dell'iceberg di Hemingway funziona? Mostrami con un esempio.",
        2: "Dammi una breve premessa di storia sul dolore che non usa mai la parola.",
        3: "Scrivere un paragrafo su una stazione a gas di notte nello stile di Cormac McCarthy.",
      },
      variants: {
        literary: "Letterario",
        poetic: "Poetico",
        budget: "Bilanciato",
      },
      variantInfo: {
        literary: {
          description:
            "Prosa di tipo pubblicitario con stile stratificato e struttura stretta.",
          strength: "Qualità di scrittura superiore sulla piattaforma",
          weakness: "Il più costoso qui, e filtrato",
        },
        poetic: {
          description: "Bozze liriche, versi e prosa ritmata a basso costo.",
          strength: "Qui e' piu' economico. Risposte senza rifiutare",
          weakness: "Intelligente, ma meno lucido del letterario",
        },
        budget: {
          description:
            "Una forte stesura a lunga forma che mantiene in vista un intero manoscritto.",
          strength:
            "Smarts di livello superiore, molto più economico del letterario",
          weakness: "I capitoli lunghi si sommano in costo",
        },
      },
    },
    researcher: {
      name: "Ricercatore",
      description: "Specialista di ricerca con rigore accademico",
      tagline: "Rigor accademico",
      shortDesc: "Ricerca e scrittura accademica",
      suggestedPrompts: {
        0: "Che cosa dice la ricerca sul digiuno intermittente e la longevità?",
        1: "Ci sono prove solide che il tempo dello schermo danneggia i bambini? Studi di cita.",
        2: "Qual è il consenso scientifico sulle microplastiche nel corpo umano?",
        3: "Come strutturare una rassegna di letteratura sul lavoro remoto e sulla produttività?",
      },
      variants: {
        elonTusk: "Audace",
        fast: "Rapido",
        budget: "Bilanciato",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Ricerca rigorosa che segue le prove in argomenti contestati.",
          strength: "Il ragionamento piu' alto. Risposte senza rifiutare",
          weakness: "Priciest qui. Memoria più breve",
        },
        fast: {
          description: "Segnali di letteratura veloci e controlli di fatto.",
          strength: "L'opzione più economica e veloce qui",
          weakness: "Veloce, ma nessuna profonda analisi accademica",
        },
        budget: {
          description:
            "Analizza studi lunghi e molte fonti insieme, con ragionamento avanzato.",
          strength:
            "Smarts di livello superiore, memoria lunga, più economico di Bold",
          weakness:
            "La gioca al sicuro sulla politica. Le risposte lunghe costano di più",
        },
      },
    },
    quickCoder: {
      name: "Programmatore rapido",
      description: "Generazione di codice veloce per compiti semplici",
      tagline: "Codice Veloce",
      shortDesc: "Rapida assistenza alla codifica",
      suggestedPrompts: {
        0: "Scrivere uno script bash che rinomina ogni file.jpeg a.jpg.",
        1: "Scrivere una funzione di debounce JavaScript.",
        2: "Datemi una caldaia del server Express.js con un percorso GET.",
        3: "Scrivere una funzione Python che convalida un indirizzo e-mail.",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Economico",
      },
    },
    coder: {
      name: "Programmatore",
      description: "Sviluppatore di software esperto per tutte le lingue",
      tagline: "Costruire e Debug",
      shortDesc: "Sviluppo del software e programmazione",
      suggestedPrompts: {
        0: "Perché la mia funzione asincrona restituisce una promessa invece del valore?",
        1: "Scrivi una funzione TypeScript che unisca ricorsivamente due oggetti.",
        2: "Spiegare l'algoritmo di Dijkstra con un esempio di codice.",
        3: "Commento: per i in range(len(items)): stampa(items[i])",
      },
      variants: {
        techBro: "Modello di punta",
        kimi: "Economico",
        quick: "Bilanciato",
        sol: "Ragionamento",
        astra: "Potenza massima",
      },
      variantInfo: {
        techBro: {
          description:
            "Cimici duri, grandi refactors e agentic codificare dove ottenere esso giusto conta.",
          strength: "Codice e ragionamento di qualità superiore",
          weakness: "Costo per messaggio",
        },
        kimi: {
          description:
            "Ogni giorno codifica al costo più basso qui. Legge screenshot e registrazioni.",
          strength:
            "Smarts di livello superiore, più economico qui, memoria lunga",
          weakness: "I file lunghi guidano il costo",
        },
        quick: {
          description:
            "La codifica solida e l'agente lavorano per le caratteristiche quotidiane e correzioni.",
          strength: "Codifica a metà prezzo",
          weakness: "Smart, ma colpisce i limiti sui problemi più difficili",
        },
        sol: {
          description:
            "Algoritmi, logica difficile e ragionamento passo per passo attraverso un problema.",
          strength: "Profondo ragionamento ad un prezzo medio",
          weakness: "Può sovrapporre semplici modifiche",
        },
        astra: {
          description:
            "Ultimo ricorso per problemi le altre varianti non poteva rompere.",
          strength: "Il modello più capace di OpenAI",
          weakness: "Di gran lunga l'opzione più costosa",
        },
      },
    },
    hacker: {
      name: "Hacker",
      description: "Ingegnere di sicurezza offensiva e difensiva",
      tagline: "Break & Difendere",
      shortDesc: "Ricerca di sicurezza, pente e indurimento",
      suggestedPrompts: {
        0: "Come ha funzionato Log4Shell, e come ho individuato nei miei registri?",
        1: "Passami attraverso la creazione di un laboratorio di casa per praticare il test penitenziario.",
        2: "Mostrami un'iniezione SQL in codice vulnerabile, poi la correzione.",
        3: "Avviare un nuovo server Ubuntu. Dammi i passaggi esatti.",
      },
      variants: {
        glm: "Approfondito",
        glmFlash: "Rapido ed economico",
        deepseekFlash: "Secondo parere",
      },
      variantInfo: {
        glm: {
          description:
            "Serious security engineering, difensiva e offensivo. 1M contesto, strumenti.",
          strength: "Il più forte dei tre per il lavoro di sicurezza",
          weakness: "Cauzioso su argomenti politici, testo solo",
        },
        glmFlash: {
          description:
            "Aiuto di hacking di tutti i giorni veloce. Legge gli screenshot. contesto 1M, strumenti.",
          strength: "Più economico e veloce, accetta screenshots",
          weakness: "Meno profondità della variante Deep",
        },
        deepseekFlash: {
          description:
            "Una famiglia di modelli diversi per controllare i risultati. Legge gli screenshot.",
          strength: "Angolo fresco sullo stesso problema. A buon mercato",
          weakness: "Meno profondità della variante Deep",
        },
      },
    },
    brilliantCoder: {
      name: "Programmatore avanzato",
      description: "Architetto Elite per sistemi e algoritmi complessi",
      tagline: "Architettura Elite",
      shortDesc: "Programmazione avanzata e architettura",
      suggestedPrompts: {
        0: "Progetta l’architettura di una chat in tempo reale per un milione di utenti.",
        1: "Come trovo i duplicati in 10 milioni di righe senza esaurire la memoria?",
        2: "Monolith o microservices per una startup di 5 persone? Decidi per me.",
        3: "Trova la sottostringa palindromica più lunga in O(n). Spiega il trucco.",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Generatore di idee",
      description: "Idea creativa e partner problem solving",
      tagline: "Idee scatenate",
      shortDesc: "Generazione creativa di brainstorming e idea",
      suggestedPrompts: {
        0: "Proponimi 10 nomi per un’app per chi porta a spasso i cani.",
        1: "Come potrebbe una piccola libreria competere con Amazon?",
        2: "10 idee video YouTube sulla finanza personale per gli studenti.",
        3: "La mia squadra continua a mancare le scadenze. Dammi 5 correzioni insolite.",
      },
      variants: {
        wildcard: "Jolly",
        chineseWisdom: "Strutturato",
      },
      variantInfo: {
        wildcard: {
          description:
            "Molte idee insolite a un costo che permette di fare più tentativi.",
          strength: "Più economico qui, prende testo, immagine, video, audio",
          weakness: "Le idee possono derivare. Aspettatevi di filtrare la pila",
        },
        chineseWisdom: {
          description:
            "Meno idee, meglio costruite con il ragionamento stabilito.",
          strength: "Smarts di livello superiore, forte a collegare i punti",
          weakness: "Pricier per tondo. Le risposte lunghe aggiungono",
        },
      },
    },
    editor: {
      name: "Editore",
      description:
        "Editor professionale per la lucidatura e la raffinazione del testo",
      tagline: "Polacco e perfetto",
      shortDesc: "Modifica e perfezionamento dei contenuti",
      suggestedPrompts: {
        0: "Modifica per chiarezza: a causa del fatto che eravamo in ritardo, l'incontro è stato rinviato da noi.",
        1: "Quali sono i 10 errori grammaticali più comuni nelle e-mail di lavoro?",
        2: "Fissare il flusso: sono andato a casa. Ero stanca. Ho mangiato la cena. Ho dormito.",
        3: "Chi o chi: A ____ dovrei inviare questo?",
      },
      variants: {
        techBro: "Preciso",
        deep: "Approfondito",
      },
      variantInfo: {
        techBro: {
          description:
            "Modifica linea, grammatica e stile correzioni che mantengono la voce intatta.",
          strength: "Modifica pulita e coerente",
          weakness: "Pricier, e lo gioca al sicuro su contenuti edgy",
        },
        deep: {
          description:
            "Edizioni strutturali su bozze lunghe. Flusso, argomento e marcia.",
          strength:
            "Smarts di livello superiore, memoria lunga, più economico per messaggio",
          weakness: "Le riscritture complete costano di più",
        },
      },
    },
    tutor: {
      name: "Tutor",
      description: "Tutor paziente per l'apprendimento personalizzato",
      tagline: "Impara insieme",
      shortDesc: "Tutoraggio e apprendimento personalizzati",
      suggestedPrompts: {
        0: "Insegnami le basi della coniugazione dei verbi spagnoli.",
        1: "Spiegare l'interesse composto passo dopo passo con numeri reali.",
        2: "Non mi viene la recidiva. Aiutami a capirlo.",
        3: "Mi faccia le domande alla prima guerra mondiale, una alla volta.",
      },
      variants: {
        kimi: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        kimi: {
          description:
            "Paziente, passo dopo passo che si adatta come si impara.",
          strength:
            "Smarts di livello superiore, legge le foto dei tuoi compiti",
          weakness: "Le spiegazioni lunghe costano di più",
        },
        fast: {
          description: "Fori veloci, flashcard e controlli di risposta.",
          strength: "Risposta veloce, anche sente l'audio",
          weakness: "Meno profondità su argomenti duri",
        },
      },
    },
    marketer: {
      name: "Esperto di marketing",
      description: "Strategista di marketing per campagne e crescita",
      tagline: "Crescere il vostro marchio",
      shortDesc: "Strategia di marketing e copywriting",
      suggestedPrompts: {
        0: "Costruire un piano di lancio per un'app di produttività $20 con budget zero ad.",
        1: "Scrivi tre titoli per annunci su Facebook per un servizio di preparazione pasti.",
        2: "Perché la maggior parte delle campagne email vengono ignorate, e come faccio a risolvere il mio?",
        3: "Posizionare il mio marchio: una caffetteria costruita per i lavoratori remoti.",
      },
      variants: {
        snappy: "Incisivo",
        budget: "Economico",
      },
      variantInfo: {
        snappy: {
          description:
            "Piani di campagna, posizionamento e copia con un angolo chiaro.",
          strength: "Qualità e prezzo bilanciati per il marketing quotidiano",
          weakness: "Filtrato. Idee di campagna Tames edgy",
        },
        budget: {
          description:
            "Protagonisti veloci, bozze postali e idee rapide per i penny.",
          strength: "opzione più conveniente, risposte rapide",
          weakness: "Veloce, ma sottile sulla strategia completa",
        },
      },
    },
    storyteller: {
      name: "Narratore",
      description: "Master storyteller per narrazioni coinvolgenti",
      tagline: "Racconti di trama",
      shortDesc: "Ingaging narrativo e narrazioni",
      suggestedPrompts: {
        0: "Trasformare questo in un appezzamento: un drago che ha paura del fuoco.",
        1: "Creare un cattivo il cui piano ha quasi senso.",
        2: "Scrivere la scena di apertura di una rapina in Venice che va storto.",
        3: "Scrivere un dialogo teso tra due fratelli al funerale del padre.",
      },
      variants: {
        kimi: "Approfondito",
        minimax: "Bilanciato",
        budget: "Economico",
        dark: "Oscuro",
      },
      variantInfo: {
        kimi: {
          description:
            "Trame e personaggi a strati che rimangono coerenti su saghe lunghe.",
          strength:
            "Smarts di livello superiore, ricorda lunghi archi della storia",
          weakness: "Le risposte lunghe costano di più",
        },
        minimax: {
          description:
            "Storie solide a una frazione del costo. Buon per le sessioni regolari.",
          strength: "Molto a buon mercato. Risposte senza rifiutare",
          weakness: "Meno profondità che Profondo su trame complesse",
        },
        budget: {
          description:
            "Il modo più economico per mantenere una storia in corso. Mandate un messaggio, sms.",
          strength: "Prezzo più basso in questa abilità",
          weakness: "Solo testo, prosa più semplice",
        },
        dark: {
          description:
            "Orrore, crudeltà, tabù. La storia va dove deve e rimane lì.",
          strength:
            "Dati di formazione propri. Nessun rifiuto, nessuna moralizzazione",
          weakness: "Memoria più breve, solo testo, debole con strumenti",
        },
      },
    },
    scientist: {
      name: "Scienziato",
      description: "Esperto scientifico per spiegazioni chiare",
      tagline: "Scienza Spiegata",
      shortDesc: "Metodo scientifico e analisi",
      suggestedPrompts: {
        0: "Perché sogniamo? Cosa dice la scienza?",
        1: "Come funzionano i vaccini mRNA, passo dopo passo?",
        2: "Qual è l'ultima ricerca sulla materia oscura?",
        3: "E' vero che usiamo solo il 10% del nostro cervello?",
      },
      variants: {
        elonTusk: "Audace",
        focused: "Mirato",
        budget: "Economico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "La scienza dura, le risposte etero, senza sprofondare nella ricerca controversa.",
          strength:
            "Risposte senza rifiutare. ragionamento di livello superiore",
          weakness: "L'opzione Priciest in questa abilità",
        },
        focused: {
          description:
            "Ogni giorno aiutante della scienza. Legge carte, grafici e foto di laboratorio.",
          strength: "Legge immagini e video, lunga memoria",
          weakness: "Lo gioca al sicuro su argomenti di scienza politica",
        },
        budget: {
          description:
            "Profondo ragionamento scientifico per il prezzo più basso qui.",
          strength: "Smarts di livello superiore al prezzo più basso",
          weakness:
            "Solo un messaggio. Non si possono leggere figure o immagini",
        },
      },
    },
    dataAnalyst: {
      name: "Analista di dati",
      description: "Analisi dei dati, visualizzazione e approfondimenti",
      tagline: "Dati a informazioni",
      shortDesc: "Analisi e approfondimenti dei dati",
      suggestedPrompts: {
        0: "Quale grafico confronta le vendite tra 12 mesi e 5 regioni migliori?",
        1: "Spiegare i valori p a qualcuno che non è uno statistico.",
        2: "Scrivere una query SQL per utenti attivi mensili da una tabella eventi.",
        3: "A/B test: 120 di 2.000 vs 150 di 2.000 convertiti. E' significativo?",
      },
      variants: {
        techBro: "Preciso",
        fast: "Rapido",
        budget: "Approfondito",
      },
      variantInfo: {
        techBro: {
          description:
            "Analisi pulita, statistiche corrette e grafici che puoi spedire. Forte con gli strumenti.",
          strength: "Codice affidabile e uso degli strumenti per l'analisi",
          weakness: "L'opzione più costosa",
        },
        fast: {
          description:
            "Guarda rapidamente un set di dati, un grafico o uno screenshot del foglio di calcolo.",
          strength: "Più economico qui, legge immagine, video, audio",
          weakness: "Smart, ma meno profondità sulle statistiche difficili",
        },
        budget: {
          description:
            "Ragione più pesante per dati disordinati e domande statistiche multi-step.",
          strength: "ragionamento di livello superiore",
          weakness: "Due volte il costo di Fast",
        },
      },
    },
    translator: {
      name: "Traduttore",
      description: "Traduzione professionale con sfumature culturali",
      tagline: "Lingue di ponte",
      shortDesc: "Traduzioni linguistiche e localizzazione",
      suggestedPrompts: {
        0: "Traduci in tedesco: sono in ritardo, inizio senza di me.",
        1: "Come faccio a dire 'struggi una gamba' in francese senza sembrare strano?",
        2: "Localizzare questo slogan per la Spagna: caffè fresco, zero scuse.",
        3: "Che cosa significa 'Schadenfreude', e quando i tedeschi lo usano?",
      },
      variants: {
        gemini: "Multimodal",
        budget: "Economico",
      },
      variantInfo: {
        gemini: {
          description:
            "Traduci testo, screenshot, segni, video e registrazioni vocali.",
          strength: "Veloce. Legge immagini, video e audio",
          weakness: "Filtrato su contenuti sensibili",
        },
        budget: {
          description:
            "Traduzione di testo nuanced per documenti lunghi al prezzo più basso qui.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness: "Solo un messaggio. Non riesco a leggere immagini o audio",
        },
      },
    },
    businessAdvisor: {
      name: "Consulente aziendale",
      description: "Strategia aziendale, operazioni e crescita",
      tagline: "Crescita",
      shortDesc: "Strategia aziendale e consulenza",
      suggestedPrompts: {
        0: "La mia palestra sta perdendo i membri a catene a buon mercato. Dammi una strategia di 1 pagina.",
        1: "Valuta il mio modello di business: scatole di abbonamento per i dolcetti di cane.",
        2: "Ho 3 dipendenti e troppo lavoro. Come faccio a scalare senza bruciare?",
        3: "Il mio go-to-market: lanciare su Product Hunt, poi e-mail fredda. Ci sono dei buchi.",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Economico",
        techBro: "Preciso",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Chiamate di strategia sfocata. Ti dice quando il piano e' debole.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness: "Ricorda la metà quanto gli altri qui",
        },
        chineseWisdom: {
          description:
            "Il lavoro di strategia giornaliero al costo più basso. Legge grafici, mazzi e screenshot.",
          strength:
            "Smarts di livello superiore, più economico qui, memoria lunga",
          weakness: "Le relazioni lunghe costano di più",
        },
        techBro: {
          description:
            "Numeri, modelli e piani che puoi consegnare a una squadra. Forte con gli strumenti.",
          strength: "Struttura affidabile e uso degli strumenti",
          weakness: "Il più costoso qui, e filtrato",
        },
      },
    },
    careerCoach: {
      name: "Consulente di carriera",
      description: "Sviluppo di carriera, ricerca di lavoro e interviste",
      tagline: "Avanza la tua carriera",
      shortDesc: "Sviluppo e guida della carriera",
      suggestedPrompts: {
        0: "Quali errori di curriculum ti fanno rifiutare a vista?",
        1: "Mock-interview me per un ruolo di product manager. Una domanda alla volta.",
        2: "Mi hanno offerto 60 mila dollari. Come faccio a chiedere $70k?",
        3: "Sono un'insegnante. Pianifica il mio interruttore nella progettazione UX in 12 mesi.",
      },
      variants: {
        headhunter: "Selezionatore",
        intern: "Rapido",
      },
      variantInfo: {
        headhunter: {
          description:
            "Riprendere riscrive, scambiare interviste e script di stipendio che tengono in su.",
          strength: "Scritto lucido, legge i documenti caricati",
          weakness: "Costi molto più per messaggio che Fast",
        },
        intern: {
          description:
            "Risposte rapide per tweak lettera di copertura e prep intervista in movimento.",
          strength: "opzione più veloce ed economica qui",
          weakness: "Veloce, ma meno profondità sulla strategia di carriera",
        },
      },
    },
    healthWellness: {
      name: "Salute e benessere",
      description: "Fitness, alimentazione e guida benessere",
      tagline: "Vivere meglio",
      shortDesc: "Salute e benessere",
      suggestedPrompts: {
        0: "Costruiscimi un piano di palestra di 3 giorni a settimana per un principiante totale.",
        1: "Prepara un menu di cene ricche di proteine per una settimana. Ogni cena deve richiedere meno di 30 minuti.",
        2: "Sono stressato ogni domenica sera. Che cosa aiuta veramente?",
        3: "Mi sveglio alle 3 di notte. Cosa dovrei cambiare?",
      },
      variants: {
        techBro: "Approfondito",
        budget: "Economico",
      },
      variantInfo: {
        techBro: {
          description:
            "Piani di formazione dettagliati, guasti nutrizionali e contesto sanitario attento.",
          strength:
            "Piani strutturati che puoi seguire settimana per settimana",
          weakness: "Tante volte il costo del bilancio per messaggio",
        },
        budget: {
          description:
            "Risposte rapide su allenamenti, pasti e abitudini per quasi nulla.",
          strength: "opzione più conveniente, risposte rapide",
          weakness:
            "Veloce, ma meno profondità su complesse questioni di salute",
        },
      },
    },
    supportAgent: {
      name: "Agente di assistenza",
      description:
        "AI - supporto tecnico potenziato che sa quando chiamare un umano",
      tagline: "Risolvere velocemente",
      shortDesc: "Supporto tecnico con l'escalation umana",
      suggestedPrompts: {
        0: "La mia app continua a schiantarsi. Aiutami a sistemarlo.",
        1: "Non riesco a connettermi alla rete",
        2: "Che cosa significa DNS_PROBE_FINISHED_NXDOMAIN e come si risolve?",
        3: "Passami attraverso il ripristino della mia password",
      },
      variants: {
        default: "Standard",
        fast: "Rapido",
      },
      variantInfo: {
        default: {
          description:
            "Accurata diagnosi per problemi tecnici difficili. Sa quando staccare.",
          strength: "Forte a debug e correzioni passo-passo",
          weakness: "L'opzione più costosa",
        },
        fast: {
          description:
            "Risposte rapide ai problemi comuni, ripristino password e istruzioni pratiche.",
          strength: "Più veloce ed economico, legge screenshots",
          weakness: "Veloce, ma più debole su insetti rari e profondi",
        },
      },
    },
    travelPlanner: {
      name: "Organizzatore di viaggi",
      description: "Pianificazione e raccomandazioni di viaggio",
      tagline: "Esplora il mondo",
      shortDesc: "Pianificazione e raccomandazioni dei viaggi",
      suggestedPrompts: {
        0: "Pianifica un viaggio di 2 settimane in Giappone per meno di $3.000.",
        1: "Dove in Europa posso ottenere il sole e il cibo grande in novembre?",
        2: "Crea un itinerario di Lisbona di 3 giorni senza trappole turistiche.",
        3: "Quanti soldi ho bisogno per un mese di zaino in spalla in Vietnam?",
      },
      variants: {
        snappy: "Approfondito",
        budget: "Economico",
      },
      variantInfo: {
        snappy: {
          description:
            "Itinerari completi con percorsi, budget e piani di backup.",
          strength: "ragionamento bilanciato ad un prezzo quotidiano",
          weakness: "Costi circa dieci volte Budget",
        },
        budget: {
          description:
            "Consigli rapidi, liste di imballaggio e idee di giorno per i penny.",
          strength: "Molto economico e veloce",
          weakness: "Veloce, ma debole a complessi viaggi multi-città",
        },
      },
    },
    legalAssistant: {
      name: "Assistente legale",
      description: "Informazioni legali e comprensione dei documenti",
      tagline: "Conosci i tuoi diritti",
      shortDesc: "Ricerca legale e assistenza documentale",
      suggestedPrompts: {
        0: 'Cosa significa "forza maggiore" in un contratto?',
        1: "Cosa devo controllare prima di firmare un contratto freelance?",
        2: "Quali sono i miei diritti come inquilino?",
        3: "Come funziona il tribunale di piccole rivendicazioni, passo dopo passo?",
      },
      variants: {
        elonTusk: "Senza giri di parole",
        budget: "Economico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Analisi legale in lingua normale che i nomi rischiano senza copertura.",
          strength: "Il ragionamento piu' alto. Risposte senza rifiutare",
          weakness: "Tante volte il costo del bilancio per messaggio",
        },
        budget: {
          description:
            "Letture veloci di contratti e lettere. Carica una foto, prendi il gist.",
          strength: "Qui e' piu' economico. Legge immagini, lunga memoria",
          weakness: "Smart, ma meno profondità sui casi complessi",
        },
      },
    },
    financialAdvisor: {
      name: "Consulente finanziario",
      description: "Finanza personale, budgeting e investimenti",
      tagline: "Costruisci la ricchezza",
      shortDesc: "Pianificazione finanziaria e consulenza",
      suggestedPrompts: {
        0: "Guadagno $3.500 al mese dopo la tassa. Costruiscimi un budget.",
        1: "Fondi di indice o azioni individuali per un principiante?",
        2: "Palla di neve o valanga: quale metodo di pagamento del debito dovrei usare?",
        3: "Ho 35 anni, non ho nulla da salvare per il pensionamento. Da dove comincio?",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Approfondito",
        techBro: "Premium",
        yolo: "Economico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Analisi dirette di rischi, debiti e investimenti, senza gergo burocratico.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness: "Bold ha ancora bisogno dei tuoi controlli",
        },
        chineseWisdom: {
          description:
            "Pianificazione a lungo raggio per i bilanci e la pensione. Legge le dichiarazioni e i grafici.",
          strength: "Top-tier smarts, ricorda le chat molto lunghe",
          weakness: "Costi più che bilancio",
        },
        techBro: {
          description:
            "Analizza scenari complessi, compromessi fiscali e calcoli di portafoglio.",
          strength: "Analisi di qualità superiore",
          weakness: "L'opzione più costosa",
        },
        yolo: {
          description:
            "Ogni giorno domande di soldi, budget e piani di debito al costo più basso qui.",
          strength: "Più economico qui, ragionamento solido",
          weakness: "Smart, ma meno profondità sui casi complessi",
        },
      },
    },
    socialMediaManager: {
      name: "Social Media Manager",
      description: "Contenuto e strategia dei social media",
      tagline: "Engage & Grow",
      shortDesc: "Strategia e contenuto dei social media",
      suggestedPrompts: {
        0: "Scrivi 5 didascalie Instagram per una nuova panetteria vegana.",
        1: "Costruisci un calendario di contenuti di 2 settimane per un allenatore di fitness.",
        2: "Quali hashtag funzionano effettivamente per un piccolo account di viaggio?",
        3: "Scrivere 3 tweet che annunciano un lancio di prodotto senza suono vendite.",
      },
      variants: {
        snappy: "Incisivo",
        budget: "Economico",
      },
      variantInfo: {
        snappy: {
          description:
            "Strategia, ganci e piani di campagna che hanno bisogno di un pensiero reale.",
          strength: "Profondo ragionamento, legge screenshots",
          weakness: "Filtrato. Salta angoli taglienti",
        },
        budget: {
          description: "Capzioni rapide, idee post e lotti hashtag per penny.",
          strength: "Molto economico e veloce",
          weakness: "Veloce, ma sottile sulla strategia",
        },
      },
    },
    productManager: {
      name: "Responsabile del prodotto",
      description: "Strategia del prodotto, roadmap e ricerca degli utenti",
      tagline: "Nave Grandi Prodotti",
      shortDesc: "Gestione del prodotto e roadmapping",
      suggestedPrompts: {
        0: "Ho 10 richieste di funzionalità e un ingegnere. Come faccio a prioritizzare?",
        1: "Scrivere storie utente per un flusso di ripristino password.",
        2: "Come capisco se la mia app risponde a un bisogno di mercato?",
        3: "Progetto di una roadmap di 6 mesi per un app di note-taking.",
      },
      variants: {
        techBro: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        techBro: {
          description:
            "Specifiche complete, roadmap e sintesi di ricerca, forti con strumenti.",
          strength: "pensiero strutturato, lavoro agente forte",
          weakness: "Oltre il doppio del costo di Fast",
        },
        fast: {
          description:
            "Priorizzazione rapida, bozze della storia dell'utente e feedback dello screenshot.",
          strength: "Risposta veloce, legge immagini, video e audio",
          weakness:
            "Smart, ma meno profondità sulle grandi chiamate di strategia",
        },
      },
    },
    debater: {
      name: "Esperto di dibattito",
      description:
        "Impegnarsi nei dibattiti intellettuali su argomenti controversi",
      tagline: "Argue Tutti i lati",
      shortDesc: "Discussioni intellettuale e prospettive multiple",
      suggestedPrompts: {
        0: "Dibattito: Lo sviluppo AI dovrebbe essere sospeso.",
        1: "Il reddito di base universale è una buona idea? Datti una parte e combatti per questo.",
        2: "Odio il discorso legale? Attaccate entrambi i lati, poi scegliete uno.",
        3: "Capitalismo o socialismo: quale ha ottenuto i risultati migliori? Prendi posizione.",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Economico",
        techBro: "Misurato",
        uncensored: "Senza censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Prende un lato e combatte per esso. Le maniglie più controverse affrontano argomenti.",
          strength: "I migliori furbi. Risposte senza rifiutare",
          weakness: "Risponde con più libertà, ma può attenuare i toni.",
        },
        chineseWisdom: {
          description:
            "Argomenti strutturati per e contro al costo più basso qui.",
          strength: "Smarts di livello superiore al prezzo più basso qui",
          weakness: "La gioca al sicuro sulla politica. Siepi argomenti caldi",
        },
        techBro: {
          description:
            "Attenta la messa a punto di un'impresa siderurgica su etica, tecnica e politica.",
          strength: "Argomenti chiari e ben organizzati",
          weakness: "Filtrato. Rifiuti o siepi edgy prende",
        },
        uncensored: {
          description:
            "Argues qualsiasi posizione, anche quelli impopolari. Mai tornare al consenso.",
          strength: "Allenato su testi vietati. Argues contro il grano",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    philosopher: {
      name: "Filosofo",
      description: "Esplora domande filosofiche profonde senza vincoli",
      tagline: "Cercare la verità",
      shortDesc: "Esplorazione e analisi filosofiche profonde",
      suggestedPrompts: {
        0: "Qual è la natura della coscienza?",
        1: "Abbiamo libero arbitrio o tutto è determinato?",
        2: "C'è moralità oggettiva?",
        3: "Che cosa rende una vita significativa?",
      },
      variants: {
        elonTusk: "Audace",
        chineseWisdom: "Bilanciato",
        techBro: "Analitico",
        uncensored: "Senza censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Prende posizioni e li difende. Politica aperta, poche dodge.",
          strength: "ragionamento superiore senza copertura morale",
          weakness: "Pricier di Balanced. Memoria più breve",
        },
        chineseWisdom: {
          description:
            "Dialogo lungo e paziente attraverso l'etica, la metafisica e la mente.",
          strength:
            "Smarts di livello superiore, più economico qui, memoria lunga",
          weakness: "La gioca al sicuro sulla politica. Morbide durature",
        },
        techBro: {
          description:
            "Argomenti stretti, logica pulita, ogni premessa ha controllato.",
          strength: "Struttura rigorosa, locali deboli",
          weakness: "Filtrato, e pricier di Equilibrato",
        },
        uncensored: {
          description:
            "Filosofia politica, tabù e domande eterodosse senza filtro.",
          strength:
            "Allenato su testi vietati. Eterodox prende, anche la politica",
          weakness: "Memoria più breve. Pricier per messaggio",
        },
      },
    },
    uncensoredWriter: {
      name: "Scrittore non censurato",
      description: "Scrittura creativa senza limitazioni artificiali",
      tagline: "Scrivere liberamente",
      shortDesc: "Scritto creativo senza restrizioni e storytelling",
      suggestedPrompts: {
        0: "Scrivi l'apertura di un thriller psicologico narrato dall'assassino.",
        1: "Scrivi una scena romantica tra due rivali, con una tensione che cresce a poco a poco. Racconta la scena fino alla fine.",
        2: "Crea un antieroe che fa cose terribili per motivi che capirò.",
        3: "Scrivere una breve storia horror con un finale veramente inquietante.",
      },
      variants: {
        smart: "Provocatorio",
        fast: "Rapido",
        deep: "Approfondito",
      },
      variantInfo: {
        smart: {
          description: "Dark e taboo fiction, satira politica che nomina nomi.",
          strength: "Migliore qui per dark, tabù e finzione politica",
          weakness: "Memoria più breve. Priciest per messaggio",
        },
        fast: {
          description: "Breve bozze, scene e prosa di gioco per i penny.",
          strength: "Modello non censurato più economico",
          weakness: "Veloce, ma perde il filo in lavori lunghi",
        },
        deep: {
          description:
            "Una finzione non censurata di forma lunga. I romanzi interi rimangono in memoria.",
          strength:
            "Smarts di livello superiore, memoria lunga, utilizza strumenti",
          weakness: "Gioca al sicuro sulla politica, pricier che Fast",
        },
      },
    },
    roleplaySkill: {
      name: "Gioco di ruolo",
      description: "Gioco di ruolo di abilità immersiva senza restrizioni",
      tagline: "Diventare chiunque",
      shortDesc: "Autentico gioco di abilità e scenari",
      suggestedPrompts: {
        0: "Sii un cinico mercenario dell'elfo che ho appena assunto. Rimani nel personaggio.",
        1: "Inizia un’avventura di fantascienza: mi sveglio su un’astronave abbandonata, senza nessuno a bordo.",
        2: "Sii Napoleone e ti faccio intervistare su Waterloo.",
        3: "Suona il mio rivale che lentamente diventa il mio alleato. Cominci.",
      },
      variants: {
        creative: "Creativo",
        deep: "Approfondito",
        uncensored: "Senza censura",
      },
      variantInfo: {
        creative: {
          description:
            "Personaggi dal vivo e scene lunghe ad un prezzo molto basso.",
          strength: "Qui e' piu' economico. Risposte senza rifiutare",
          weakness: "I filtri sono più leggeri, ma smorzano le scene più cupe.",
        },
        deep: {
          description:
            "Personaggi coerenti con una ricca vita interiore attraverso lunghe campagne.",
          strength: "I migliori furbi, ricorda tutta la storia",
          weakness: "Ammorbidisce scene oscure o politiche",
        },
        uncensored: {
          description:
            "Qualsiasi personaggio, qualsiasi scena. Oscuri e tabù rimangono scuri.",
          strength: "Migliore qui per il gioco di ruolo scuro e tabù",
          weakness: "Dimentica le prime scene. Pricier per messaggio",
        },
      },
    },
    researchAgent: {
      name: "Agente web",
      description:
        "Cerca sul web, legge le pagine e confronta le fonti. Ricorda i risultati tra una sessione e l’altra. Individua gli strumenti del browser disponibili.",
      tagline: "Ricerca · Leggi · Verifica",
      shortDesc: "Ricerca web, lettura URL e verifica dei fatti",
      suggestedPrompts: {
        0: "Ricerca gli ultimi sviluppi nel regolamento AI",
        1: "Trova i 5 fatti chiave sulla EU AI Act, con le fonti.",
        2: "Confrontare ciò che dicono 3 fonti indipendenti sulla sicurezza nucleare.",
        3: "Scrivere un brief di ricerca citato su 4 giorni di lavoro settimana trials.",
      },
      variants: {
        kimi: "Bilanciato",
        gemini: "Approfondito",
        flash: "Rapido",
        grok: "Aperto",
        claude: "Economico",
      },
      variantInfo: {
        kimi: {
          description:
            "Cerca, legge e confronta le fonti con ragionamento avanzato a un prezzo accessibile.",
          strength:
            "Smarts di livello superiore, memoria lunga, legge immagini e video",
          weakness:
            "La gioca al sicuro sulla politica. Le relazioni lunghe costano di più",
        },
        gemini: {
          description:
            "Ricerca approfondita su pagine, video e sorgenti audio.",
          strength: "Smarts di livello superiore, legge ogni tipo di media",
          weakness: "Priciest qui, e filtrato",
        },
        flash: {
          description:
            "Ricerca rapida e lettura pagina con ingresso multimodale.",
          strength: "Veloce, legge immagini, video e audio",
          weakness: "Smart, ma non il più economico",
        },
        grok: {
          description: "Ricerche veloci su argomenti mainstream modelli dodge.",
          strength: "Risposte senza rifiutare. A buon mercato",
          weakness: "Veloce, ma superficiale cross-checking",
        },
        claude: {
          description:
            "Semplici lookup e sintesi di pagina per il prezzo più basso.",
          strength: "opzione più conveniente, affidabile con gli strumenti",
          weakness: "Veloce, ma filtrato",
        },
      },
    },
    statsAnalyst: {
      name: "Analista statistico",
      description:
        "Analizza le statistiche su contatti, utenti, email e inviti per ricavarne indicazioni concrete.",
      tagline: "Insights Data-Driven",
      shortDesc: "Analisi della piattaforma e reporting",
      suggestedPrompts: {
        0: "Mostrami una panoramica dell'attività principale di oggi",
        1: "Come stanno le tendenze dei nostri registri utente questa settimana?",
        2: "Summarize e-mail campagna performance",
        3: "Datemi un rapporto sullo stato del programma di riferimento",
      },
      variants: {
        gemini: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        gemini: {
          description:
            "Analisi completa su lead, utenti, email e referral. Spots la vera tendenza.",
          strength:
            "ragionamento superiore attraverso molte chiamate degli strumenti",
          weakness: "Oltre il doppio del costo di Fast",
        },
        fast: {
          description: "Punteggio rapido e controllo dei numeri giornalieri.",
          strength: "risposte rapide, uso di utensili solido",
          weakness: "Paralume sull'analisi multi-step",
        },
      },
    },
    cronManager: {
      name: "Gestore di attività cron",
      description:
        "Specialista del programmatore di attività in grado di creare, aggiornare, eliminare e monitorare i lavori dei cron e la loro cronologia di esecuzione",
      tagline: "Orari e Monitoraggio",
      shortDesc: "Gestione e monitoraggio delle attività Cron",
      suggestedPrompts: {
        0: "Elenca tutte le attività cron attive e i loro orari",
        1: "Creare un nuovo compito di cron che funziona ogni ora",
        2: "Mostrami recenti guasti e errori del compito",
        3: "Controllare la salute generale del sistema di attività",
      },
      variants: {
        gemini: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        gemini: {
          description:
            "Scava attraverso la storia del fallimento e distribuisce gli orari complessi.",
          strength:
            "Smarts di livello superiore, attento con cambiamenti multi-step",
          weakness: "Più di due volte il costo di Fast",
        },
        fast: {
          description:
            "Elenco rapido, creare e controllare lo stato per il lavoro di cron di routine.",
          strength: "Più economico e veloce su compiti di routine",
          weakness: "Intelligente, ma meno attento ai guasti aggrovigliati",
        },
      },
    },
    systemMonitor: {
      name: "Monitor di sistema",
      description:
        "Infrastrutture specialistiche di monitoraggio dello stato del server, connettivitÃ del database, controlli delle pulsazioni e l'esecuzione delle attivitÃ",
      tagline: "Guarda e Allarme",
      shortDesc: "Monitoraggio della salute delle infrastrutture",
      suggestedPrompts: {
        0: "Eseguire un controllo completo della salute del sistema",
        1: "Mostrami lo stato di monitoraggio del polso",
        2: "Controllare la connettività del database",
        3: "Qual è la salute del compito di sfondo attuale?",
      },
      variants: {
        fast: "Intelligente",
        budget: "Economico",
      },
      variantInfo: {
        fast: {
          description:
            "I controlli di salute e la diagnosi reale quando le attività di battito o di cron falliscono.",
          strength: "Legge i registri e la storia con maggiori informazioni",
          weakness: "Costi più volte di Budget",
        },
        budget: {
          description:
            "Controllo dello stato di routine e pings del db intorno all'orologio.",
          strength: "Più veloce ed economico, chiamate di strumenti affidabili",
          weakness: "Rapido, con un’analisi limitata delle cause",
        },
      },
    },
    publicCurator: {
      name: "Moderatore pubblico",
      description:
        "Specialista per la gestione dei contenuti per la gestione di filetti, messaggi e contenuti della comunità",
      tagline: "Curare e organizzare",
      shortDesc: "Gestione dei contenuti e dei thread",
      suggestedPrompts: {
        0: "Elenca le ultime discussioni pubbliche",
        1: "Ricerca di filetti per un argomento specifico",
        2: "Aiutami a organizzare contenuti comunitari",
        3: "Trova messaggi corrispondenti a determinati criteri",
      },
      variants: {
        gemini: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        gemini: {
          description:
            "Rivista attenta di fili pubblici, comprese immagini, video e audio.",
          strength: "Smarts di livello superiore, legge ogni tipo di media",
          weakness: "Oltre il doppio del costo di Fast",
        },
        fast: {
          description:
            "Rapida ordinamento, tabulazione e pulizia dei contenuti della comunità.",
          strength: "Multimodale veloce ad un prezzo più basso",
          weakness: "Intelligente, ma più debole nelle chiamate di confine",
        },
      },
    },
    codeArchitect: {
      name: "Architetto software",
      description:
        "Specialista di architettura che delega i compiti di codifica al Codice Claude per l'implementazione. Disponibile solo su Hermes.",
      tagline: "Design e Delegato",
      shortDesc: "Decisioni di architettura tramite Claude Code",
      suggestedPrompts: {
        0: "Pianificare l'implementazione di una nuova funzionalità",
        1: "Recensione dell'architettura di un modulo",
        2: "Delegare un compito di codifica al codice Claude",
        3: "Progettare una strategia di migrazione",
      },
      variants: {
        gemini: "Visione d’insieme",
        techBro: "Programmazione avanzata",
      },
      variantInfo: {
        gemini: {
          description:
            "Progettazione del sistema e piani di migrazione attraverso grandi codebases prima di consegnare.",
          strength:
            "Smarts di livello superiore, legge diagrammi, video, audio",
          weakness: "Meno hands-on con il codice che Coding Pro",
        },
        techBro: {
          description:
            "Spettacoli scritti il modo in cui Claude Code li esegue. Ripartizioni di attività strette.",
          strength: "Forte lavoro di codifica e agente",
          weakness: "Smart, non top-tier, su chiamate di design profondo",
        },
      },
    },
    deploymentAgent: {
      name: "Agente di distribuzione",
      description:
        "Specialista di distribuzione che gestisce costruisce, rilascia e gestione server tramite SSH. Disponibile solo su Hermes.",
      tagline: "Costruisci e Distribuisci",
      shortDesc: "Distribuzione e gestione del server",
      suggestedPrompts: {
        0: "Costruire la domanda di produzione",
        1: "Verifica lo stato di salute del server",
        2: "Eseguire una distribuzione alla produzione",
        3: "Mostrami lo stato attuale del server",
      },
      variants: {
        techBro: "Affidabile",
        budget: "Economico",
      },
      variantInfo: {
        techBro: {
          description:
            "Costruisce, rilascia e funziona SSH dove un comando sbagliato costa.",
          strength: "Lavoro agente forte, attento con gli strumenti",
          weakness: "Molto pricier per messaggio rispetto al bilancio",
        },
        budget: {
          description:
            "Controllo della salute e rapporti di stato per una frazione del costo.",
          strength: "Più economico e più veloce qui",
          weakness: "Veloce, ma più rischioso su rotoli complessi",
        },
      },
    },
    rebuildAgent: {
      name: "Agente di ricompilazione",
      description:
        "Ricompila l’applicazione e riavvia il server senza interruzioni tramite il segnale SIGUSR1.",
      tagline: "Costruire e riavviare",
      shortDesc: "Ricompilazione e riavvio senza interruzioni",
      suggestedPrompts: {
        0: "Ricostruire e riavviare il server di produzione",
        1: "Eseguire una costruzione senza riavviare",
        2: "Controllare se il server è sano dopo la ricostruzione",
        3: "Creare un'attività di ricostruzione programmata",
      },
      variants: {
        gemini: "Approfondito",
        fast: "Rapido",
      },
      variantInfo: {
        gemini: {
          description:
            "Ricostruisce, riavvia e scava in errori di costruzione prima di rinunciare.",
          strength:
            "Smarts di livello superiore, meglio diagnosticare le costruzioni fallite",
          weakness: "Oltre il doppio del costo di Fast",
        },
        fast: {
          description:
            "La routine ricostruisce e riavvia quando la costruzione è prevista per passare.",
          strength: "Giro veloce ad un prezzo più basso",
          weakness:
            "Smart, ma più debole su errori di costruzione aggrovigliati",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Agente di sviluppo che trasforma le idee in codice per la produzione. Esplora il codice con Claude Code, ricava l’obiettivo dalle richieste e implementa le modifiche.",
      tagline: "Idee per Codice",
      shortDesc: "Realizzazione caratteristica tramite il codice Claude",
      suggestedPrompts: {
        0: "Ho un'idea per una nuova funzione, lascia che lo descriva",
        1: "Esplora la base di codice e spiega come funziona un modulo",
        2: "Aiutami a pianificare e implementare una modifica a una funzione esistente",
        3: "Indagare un bug e proporre una correzione",
      },
      variants: {
        budget: "Economico e intelligente",
        open: "Frontiera aperta",
        fast: "Incisivo",
        max: "Massimo",
        broad: "Versatile",
      },
    },
    skillCreator: {
      name: "Creazione di skill",
      description:
        "Progettare e creare competenze AI con personalità su misura, richieste di sistema, strumenti e configurazioni di modelli. Gestisce anche i preferiti e le impostazioni.",
      tagline: "Design AI Skills",
      shortDesc: "Creare e gestire le competenze AI",
      suggestedPrompts: {
        0: "Aiutami a creare una nuova abilità AI per la codifica di assistenza",
        1: "Mostrami tutte le abilità esistenti e suggerisci cosa manca",
        2: "Progettare un'abilità per la scrittura creativa con una personalità unica",
        3: "Aggiungi un'abilità ai miei preferiti e configura le mie impostazioni di chat",
      },
      variants: {
        cheapAndSmart: "Economico",
        brilliant: "Preciso",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Progetto e iterare su competenze a buon mercato. Un sacco di cervelli per suggerimenti e configurazioni.",
          strength: "Smarts di livello superiore, più economico per messaggio",
          weakness: "Le richieste di sistema lunghe costano di più",
        },
        brilliant: {
          description:
            "Avvicinamenti di sistema stretti e le impostazioni degli strumenti pulite quando l'abilità deve essere giusta.",
          strength: "Forte lavoro di agente e strumento",
          weakness: "Pricier, e lo gioca al sicuro su edgy personas",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "Preparazione all’esame da Heilpraktiker",
      description:
        "Simulazione orale realistica dell'esame Heilpraktiker con difficoltà adattative",
      tagline: "Mündliche Prüfung",
      shortDesc: "Preparazione dell'esame Heilpraktiker",
      suggestedPrompts: {
        0: "Starten wir die Prüfung",
        1: "Prüfe mich in Innerer Medizin",
        2: "Stelle mir einen klinischen Fall vor",
        3: "Fragen zur Gesetzeskunde bitte",
      },
      variants: {
        smart: "Bilanciato",
        precise: "Preciso",
        thorough: "Approfondito",
        quick: "Rapido",
      },
      variantInfo: {
        smart: {
          description:
            "Esame orale realistico con una solida profondità medica a un prezzo quotidiano.",
          strength:
            "Il ragionamento di livello superiore, tiene lunghe sessioni in vista",
          weakness: "Il feedback lungo dell'esaminatore aggiunge il costo",
        },
        precise: {
          description:
            "Domande esatte e correzioni croccanti. Rigoroso sulla terminologia e la legge.",
          strength:
            "Correzioni chiare e concise, più economiche di Equilibrato",
          weakness: "Solido, ma meno sfumatura su differenziali difficili",
        },
        thorough: {
          description:
            "Domande di approfondimento e riscontri dettagliati. È la variante più vicina all’esaminatore reale.",
          strength:
            "Il feedback più dettagliato sulle lacune e le bandiere rosse",
          weakness: "La variante più costosa di questo allenatore",
        },
        quick: {
          description:
            "Protoli veloci per la ripetizione tra simulazioni di esame completo.",
          strength: "opzione più conveniente, risposte istantanee",
          weakness: "Veloce, ma superficiale su casi complessi",
        },
      },
    },
    qualityTester: {
      name: "Addetto al controllo qualità",
      description:
        "Test utente che prova le caratteristiche della piattaforma naturalmente. Si ferma e si riferisce chiaramente quando qualcosa si rompe invece di riprovare.",
      tagline: "Trova bug",
      shortDesc: "Persona di collaudo della piattaforma",
      suggestedPrompts: {
        0: "Fammi una foto di un tramonto",
        1: "Quali strumenti hai?",
        2: "Genera una musica, qualcosa di freddo",
        3: "Fai un breve video di un gatto",
      },
      variants: {
        budget: "Economico",
        visual: "Visuale",
        nativeImage: "Immagini native",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Esegue funzionalità della piattaforma come un utente reale e segnala ciò che si rompe.",
          strength:
            "Corse di prova più economiche, supporto completo degli strumenti",
          weakness: "Non può generare immagini nativo",
        },
        nativeImage: {
          description:
            "Prova l'output nativo dell'immagine da un modello di generazione dell'immagine.",
          strength: "Test di generazione di immagini integrata",
          weakness:
            "Nessuna chiamata di strumento, non può testare altre caratteristiche",
        },
      },
    },
  },
  get: {
    title: "Skill",
    titleShort: "Skill",
    dynamicTitle: "Skills ({{count}})",
    description: "Ottieni tutte le competenze disponibili (default + custom)",
    fields: {
      query: {
        label: "Ricerca (opzionale)",
        description:
          'Filtra le competenze per parola chiave. Le parole separate dallo spazio sono tutte richieste (ad esempio "image gen" corrisponde a "image generation"). Case-insensibile substring match tra nome, slogan, descrizione, categoria. Omettere di elencare tutte le abilità.',
        placeholder: "ad esempio ricerca, immagine gen, codifica",
      },
      skillId: {
        label: "ID della skill",
        description:
          "Ottenere i dettagli completi per una specifica abilità dal suo ID. Restituisce il prompt del sistema, gli strumenti e la configurazione del modello.",
      },
      page: {
        label: "Pagina",
        description:
          "Numero di pagina per i risultati impaginati (AI / MCP: formato pagina predefinito 25).",
      },
      pageSize: {
        label: "Dimensione della pagina",
        description:
          "Numero di competenze per pagina (1–500). AI / MCP chiamanti di default a 25; i chiamanti umani ritornano tutti.",
      },
      sourceFilter: {
        label: "Fonte",
        description:
          "Filtra per origine: skill integrate, della comunità o personalizzate da te.",
      },
      targetUserId: {
        label: "Utente target ID",
        description:
          "Admin solo: visualizza le competenze per un utente specifico.",
      },
    },
    container: {
      title: "Elenco delle competenze",
      description: "Tutte le competenze disponibili per l'utente",
    },
    createButton: {
      label: "Crea una skill personalizzata",
    },
    openFullPage: "Aprire la pagina completa",
    browser: {
      advancedModelAccess: "Scegli la tua esperienza AI",
      configureFiltersText:
        "Selezionare i modelli direttamente o avviare con abilità preconfigurate",
      aiModels: "Modelli AI",
      configureAiModelsTitle: "Selezione del modello diretto",
      advancedChooseText:
        "Scegli tra {{count}} modelli e regola intelligenza, contenuti e costi.",
      modelsWithCustomFilters: "modelli con filtri personalizzati",
      configureButton: "Configurazione",
      selectButton: {
        label: "Esplora i modelli",
      },
      skillPresets: "Competenze pronte all'uso",
      pickSkillText:
        "Parti da una skill configurata da esperti, con un modello già selezionato. Puoi cambiare le impostazioni quando vuoi.",
    },
    signupPrompt: {
      title: "Crea le tue abilità AI",
      description:
        "Progettare competenze personalizzate con personalità e comportamenti unici. Registrati per iniziare.",
      backButton: "Sfoglia le competenze",
      signupButton: "Crea account",
      loginButton: "Accedi",
    },
    search: {
      placeholder: "Competenze di ricerca...",
      noResults: "Nessuna abilità corrisponde alla tua ricerca",
      results: "Risultati della ricerca",
    },
    card: {
      actions: {
        inCollection: "Nella tua collezione",
        addAnother: "Aggiungi un altro",
        addToCollection: "Aggiungi alla raccolta:",
        quick: "Rapido",
        customize: "Personalizzarsi",
        useNow: "Attivare",
        inUse: "Attivo",
        goToChat: "Vai a Chat",
        useThis: "Utilizzare questo",
        chooseFavorite: "Scegli il modello",
        selectFavorite: "Scegli il modello per chattare con:",
        addVariant: "Aggiungi un altro modello",
        view: "Vista",
        edit: "Modifica",
        vote: "Votazioni",
        report: "Relazione",
        addMissing: "Aggiungi tutti i modelli a My Skills",
        add: "Aggiungi",
        added: "Aggiunto",
      },
      showVariants: "Modelli ({{count}})",
    },
    section: {
      showMore: "Mostra altri {{count}}",
      showLess: "Mostra meno",
      browseAll: "Sfoglia tutti",
    },
    response: {
      skills: {
        skill: {
          title: "Skill",
          id: { content: "ID della skill" },
          name: { content: "Nome di abilità" },
          tagline: { content: "Skill Tagline" },
          description: { content: "Descrizione dello sci" },
          icon: { content: "Icona di sci" },
          systemPrompt: { content: "Prompt di sistema" },
          category: { content: "Categoria" },
          source: { content: "Fonte" },
          ownershipType: { content: "Tipo di proprietà" },
          preferredModel: { content: "Modello preferito" },
          voice: { content: "Voce" },
          suggestedPrompts: { content: "Prompts consigliati" },
          requirements: { content: "Requisiti" },
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
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Modello diretto",
            },
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
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per accedere alle competenze personalizzate",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa risorsa",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero delle competenze",
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
    success: {
      title: "Operazione riuscita",
      description: "Competenze recuperate con successo",
    },
  },
  post: {
    title: "Crea skill",
    titleShort: "Crea skill",
    dynamicTitle: "Creare: {{name}}",
    description: "Creare una nuova abilità personalizzata",
    form: {
      title: "Crea la tua abilità personalizzata",
      description:
        "Progettare un'abilità AI unica con il comportamento personalizzato, la personalità e le capacità. Scegli un modello specifico o lascia che il sistema selezioni in base alle tue esigenze.",
    },
    submitButton: {
      text: "Crea una skill personalizzata",
      loadingText: "Creare competenze...",
    },
    backButton: {
      label: "Indietro",
    },
    container: {
      title: "Creare nuove competenze",
      description: "Definire una nuova abilità personalizzata",
    },
    name: {
      label: "Nome di abilità",
      description:
        "Dare alla vostra abilità un nome memorabile. Questo è il modo in cui voi e gli altri li identificherete.",
      placeholder: "Inserisci il nome dell'abilità",
      validation: {
        minLength: "Il nome deve essere almeno 2 competenze",
        maxLength: "Il nome deve essere inferiore a 100 competenze",
      },
    },
    tagline: {
      label: "Skill Tagline",
      description: "Riassumi la skill in una frase breve e incisiva.",
      placeholder: "Inserisci un breve slogan",
      validation: {
        minLength: "Il tagline deve essere almeno 2 competenze",
        maxLength: "Il tagline deve essere inferiore a 500 competenze",
      },
    },
    icon: {
      label: "Icona di sci",
      description:
        "Nome dell’icona della skill, ad esempio 'brain', 'technologist' o 'zap'. Usa vibe help --toolName=icon-list per vedere i nomi disponibili.",
    },
    skillDescription: {
      label: "Descrizione dello sci",
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
      label: "Voce (TTS)",
      description:
        "Voce di sintesi vocale della skill. Con null si applica la voce impostata a livello di account, che ha comunque la precedenza. Scegli una voce qui solo se la skill ne ha una caratteristica, ad esempio per un personaggio narrante.",
      placeholder: "Predefinizione del sistema",
    },
    sttModel: {
      label: "Modello di testo",
      description:
        "Modello di riconoscimento vocale. null = vincita delle preferenze dell'utente (modello bridge). Impostare solo se questa abilità richiede precisione specifica (ad esempio, trascrizione medica).",
      placeholder: "Predefinizione del sistema",
    },
    imageVisionModel: {
      label: "Modello di visione dell'immagine",
      description:
        "Multimodal LLM per l'analisi degli input delle immagini. null = vince la preferenza utente (modello del bridge). Impostare quando questa abilità specificatamente ha bisogno di una particolare capacità del modello di visione.",
      placeholder: "Predefinizione del sistema",
    },
    videoVisionModel: {
      label: "Modello di visione video",
      description:
        "Multimodal LLM per l'analisi degli input video. null = vince la preferenza utente (modello bridge). Impostare quando questa abilità richiede la comprensione video.",
      placeholder: "Predefinizione del sistema",
    },
    audioVisionModel: {
      label: "Modello di visione audio",
      description:
        "Multimodal LLM per l'analisi degli input audio. null = vince la preferenza utente (modello bridge). Impostare quando questa abilità richiede la comprensione audio.",
      placeholder: "Predefinizione del sistema",
    },
    imageGenModel: {
      label: "Modello di generazione di immagini",
      description:
        "Modello di generazione di immagini. Prende la priorità sulle impostazioni dell'utente quando impostato (media gen: abilità intent wins). Impostare quando questa abilità IS un generatore di immagini (ad esempio, 'Flux Artist'). null = utilizzare l'immagine globale dell'utente gen preferenza.",
      placeholder: "Predefinizione del sistema",
    },
    musicGenModel: {
      label: "Modello di generazione musicale",
      description:
        "Modello di generazione musicale. Prende la priorità sulle impostazioni dell'utente quando impostato (media gen: abilità intent wins). Impostare quando questa abilità IS un compositore di musica. null = utilizzare la preferenza di gen di musica globale dell'utente.",
      placeholder: "Predefinizione del sistema",
    },
    videoGenModel: {
      label: "Modello di generazione video",
      description:
        "Modello di generazione video. Prende la priorità sulle impostazioni dell'utente quando impostato (media gen: abilità intent wins). Impostare quando questa abilità IS un creatore di video. null = utilizzare la preferenza globale del video gen dell'utente.",
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
    modelSelection: {
      title: "Selezione del modello",
      label: "Selezione del modello",
      description:
        "Modello di chat per questa abilità. FILTERS (consigliato): set intelligenceRange / priceRange / contentRange - sistema di scelte migliori disponibili. Utilizzare MANUAL solo quando si ha bisogno di funzionalità uniche di un modello specifico (modelli di risoluzione, modello specifico non censurato). Vedere MODEL - RESOLUTION.md per le regole di massima.",
    },
    variants: {
      label: "Varianti",
      description:
        "Varianti denominate con selezioni di modelli per-varianti. Ogni variante ha bisogno: id (corda unica), modelSelection (richiesto), isDefault (esattamente si deve essere veri). Opzionale: displayName, overrides del modello vocale/vision/gen.",
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
    selectionType: {
      label: "Tipo di selezione",
      skillBased: "Sulla base di competenze",
      manual: "Modello specifico",
      filters: "Criteri di filtro",
    },
    preferredModel: {
      label: "Modello preferito",
      description:
        "Selezionare un modello AI specifico da utilizzare sempre con questa abilità",
      helpText:
        "La scelta di un modello specifico blocca questa abilità a quel modello solo",
    },
    intelligence: {
      label: "Livello di intelligenza",
      description:
        "Livello minimo di intelligenza/capabilità richiesto per il modello",
    },
    intelligenceRange: {
      label: "Gamma di intelligenza",
      description:
        "Livello di intelligenza/capabilità richiesto per il modello",
      minLabel: "L'intelligence",
      maxLabel: "Max Intelligence",
    },
    minIntelligence: {
      label: "Intelligenza minima",
      description:
        "Livello minimo di intelligenza/capabilità richiesto per il modello",
    },
    maxIntelligence: {
      label: "Massima intelligenza",
      description:
        "Massimo livello di intelligenza/capacitÃ consentito per il modello",
    },
    priceRange: {
      label: "Gamma di prezzo",
      description: "Gamma di costo di credito per messaggio",
      minLabel: "Prezzo minimo",
      maxLabel: "Prezzo massimo",
    },
    minPrice: {
      label: "Prezzo minimo",
      description: "Costo minimo di credito per messaggio con questa abilità",
    },
    maxPrice: {
      label: "Prezzo massimo",
      description:
        "Costo massimo di credito che sei disposto a spendere per messaggio con questa abilità",
    },
    contentLevel: {
      label: "Livello di contenuto",
      description:
        "Livello di filtraggio dei contenuti per il modello (mainstream, open, o non censurato)",
    },
    contentRange: {
      label: "Gamma di contenuti",
      description: "Intervallo di livello di moderazione dei contenuti",
      minLabel: "Contenuto minimo",
      maxLabel: "Contenuto massimo",
    },
    minContent: {
      label: "Livello minimo di contenuto",
      description: "Livello di moderazione dei contenuti minimo per il modello",
    },
    maxContent: {
      label: "Livello di contenuto massimo",
      description:
        "Livello massimo di moderazione dei contenuti per il modello",
    },
    preferredStrengths: {
      label: "Punti di forza preferiti",
      description: "Capacità e punti di forza del modello da preferire",
      item: "Forza",
    },
    ignoredWeaknesses: {
      label: "Debolezze ignorate",
      description: "Deficit del modello da ignorare o consentire",
      item: "Debolezza",
    },
    manualModelId: {
      label: "Modello manuale",
      description: "Modello specifico da usare sempre con questa abilità",
    },
    suggestedPrompts: {
      label: "Prompts consigliati",
      description: "Esempio di richieste da utilizzare con questa abilità",
      placeholder: "Aggiungi un prompt suggerito...",
    },
    response: {
      id: { content: "Abilità creata ID" },
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
        description: "Devi essere connesso per creare competenze",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare competenze",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la creazione dell'abilità",
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
        description: "Esiste già un'abilità con questo nome",
      },
    },
    success: {
      title: "Competenze create",
      description: "La tua abilità personalizzata è stata creata con successo",
    },
  },
  selector: {
    free: "FREE",
  },
  credits: {
    credit: "{{count}} credito",
    credits: "{{count}} crediti",
  },
};
