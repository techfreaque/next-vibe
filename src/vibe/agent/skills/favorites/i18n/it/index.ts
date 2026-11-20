import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "Chat",
    tags: {
      favorites: "Preferiti",
    },
    voices: {
      MALE: "Voce maschile",
      FEMALE: "Voce femminile",
    },

    get: {
      title: "Ottenere favorito",
      description: "Recuperare una specifica configurazione preferita",
      container: {
        title: "Dettagli preferiti",
      },
      editButton: {
        label: "Modificare Favorite",
      },
      deleteButton: {
        label: "Eliminare i preferiti",
      },
      viewSkillButton: {
        label: "Vedi la tua abilità",
      },
      signupPrompt: {
        title: "Personalizzare la personalità dell'abilità",
        description:
          "Modificare il prompt e il comportamento del sistema di abilità. Registrati per iniziare.",
        backButton: "Indietro",
        signupButton: "Crea account",
        loginButton: "Accedi",
      },
      id: {
        label: "ID preferito",
      },
      response: {
        skillId: {
          content: "Competenze: {{value}}",
        },
        customVariantName: {
          content: "Nome Variante: {{value}}",
        },
        customIcon: {
          content: "Icona personalizzata: {{value}}",
        },
        voice: {
          content: "Voce: {{value}}",
        },
        mode: {
          content: "Modalità: {{value}}",
        },
        intelligence: {
          content: "Intelligenza: {{value}}",
        },
        modelSelection: {
          title: "Selezione del modello",
        },
        selectionType: {
          content: "Tipo di selezione: {{value}}",
        },
        minIntelligence: {
          content: "Min Intelligence: {{value}}",
        },
        maxIntelligence: {
          content: "Max Intelligence: {{value}}",
        },
        minPrice: {
          content: "Prezzo minimo: {{value}}",
        },
        maxPrice: {
          content: "Prezzo massimo: {{value}}",
        },
        minContent: {
          content: "Livello di contenuto minimo: {{value}}",
        },
        maxContent: {
          content: "Livello di contenuto massimo: {{value}}",
        },
        content: {
          content: "Livello di contenuto: {{value}}",
        },
        preferredStrengths: {
          content: "Punti di riferimento: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Debolezze ignorate: {{value}}",
        },
        manualModelId: {
          content: "Modello manuale: {{value}}",
        },
        position: {
          content: "Posizione: {{value}}",
        },
        color: {
          content: "Colore: {{value}}",
        },
        isActive: {
          content: "Attivo: {{value}}",
        },
        useCount: {
          content: "Tempi utilizzati: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "favorito non valido ID",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per visualizzare questo preferito",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di vedere questo preferito",
        },
        notFound: {
          title: "Non trovato",
          description: "Preferito non trovato",
        },
        server: {
          title: "Errore del server",
          description: "Non caricato il favorito",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Si è verificato un conflitto durante l'elaborazione della vostra richiesta",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Carico preferito con successo",
      },
    },
    patch: {
      title: "Aggiornamento Favorite",
      description: "Aggiornare la configurazione preferita esistente",
      container: {
        title: "Modificare Favorite",
      },
      backButton: {
        label: "Torna a Preferito",
      },
      deleteButton: {
        label: "Eliminare i preferiti",
      },
      viewSkillButton: {
        label: "Vedi la tua abilità",
      },
      useThisSkillButton: {
        label: "Utilizzare questa abilità",
      },
      useThisModelButton: {
        label: "Utilizzare questo modello",
      },
      currentlyActiveButton: {
        label: "Attualmente attivo",
      },
      signupPrompt: {
        title: "Personalizzare la personalità dell'abilità",
        description:
          "Modificare il prompt e il comportamento del sistema di abilità. Registrati per iniziare.",
        backButton: "Indietro",
        signupButton: "Crea account",
        loginButton: "Accedi",
      },
      saveButton: {
        label: "Salva",
        loadingText: "Salvare...",
      },
      saveAndUseButton: {
        label: "Salva e utilizza",
        loadingText: "Salvare e attivare...",
      },
      id: {
        label: "ID preferito",
      },
      skillId: {
        label: "Skill",
        description:
          'Skill ID. Utilizzare " skillSlug " per la variante predefinita, " skillSlug__variantId " per una variante specifica.',
      },
      customVariantName: {
        label: "Nome Variante",
        description:
          "Nome personalizzato per questa variante (lasciare vuoto per usare l'abilità predefinita)",
      },
      chatModel: {
        label: "Modello di chat",
        placeholder: "Eredita da abilità",
      },
      voice: {
        label: "Voce AI",
        description:
          "Superare la voce TTS per questo favorito. null = la tua impostazione vocale globale vince (modello bridge: l'impostazione utente ha la priorità). Impostare qui per dare a questo favorito specifico una voce diversa.",
        placeholder: "Eredita da abilità",
      },
      sttModel: {
        label: "Modello di testo",
        description:
          "Override STT modello per questo favorito. null = la tua preferenza globale STT vince (modello bridge). Impostare solo per esigenze di trascrizione specializzate.",
        placeholder: "Eredita da abilità",
      },
      imageVisionModel: {
        label: "Modello di visione dell'immagine",
        description:
          "Superare la visione dell'immagine LLM per questo favorito. null = utente vince la preferenza globale (modello bridge). Impostare per forzare un modello di visione specifico.",
        placeholder: "Eredita da abilità",
      },
      videoVisionModel: {
        label: "Modello di visione video",
        description:
          "Superare la visione video LLM per questo favorito. null = utente vince la preferenza globale (modello bridge).",
        placeholder: "Eredita da abilità",
      },
      audioVisionModel: {
        label: "Modello di visione audio",
        description:
          "Superare la visione audio LLM per questo favorito. null = utente vince la preferenza globale (modello bridge).",
        placeholder: "Eredita da abilità",
      },
      imageGenModel: {
        label: "Modello di generazione di immagini",
        description:
          "Generatore di immagini override per questo favorito. null = abilità imageGenModelSelection vince (media gen: abilità prende priorità). Impostare qui per utilizzare un generatore diverso da quello che l'abilità specifica.",
        placeholder: "Eredita da abilità",
      },
      musicGenModel: {
        label: "Modello di generazione musicale",
        description:
          "Override generatore di musica per questo favorito. null = abilità musicGenModelSelection vince (media gen: abilità prende priorità).",
        placeholder: "Eredita da abilità",
      },
      videoGenModel: {
        label: "Modello di generazione video",
        description:
          "Override video generatore per questo favorito. null = abilità videoGenModelSelection vince (media gen: abilità prende priorità).",
        placeholder: "Eredita da abilità",
      },
      mode: {
        label: "Modalità di selezione",
      },
      modelSelection: {
        title: "Selezione del modello",
        label: "Selezione del modello",
        description:
          "Override il modello per questa slot. Utilizzare filtri o scegliere un modello specifico. Passare null per utilizzare il modello predefinito dell'abilità.",
      },
      selectionType: {
        label: "Tipo di selezione",
        characterBased: "Sulla base di competenze",

        manual: "Modello specifico",
        filters: "Criteri di filtro",
      },
      intelligence: {
        label: "Livello di intelligenza",
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
      minPrice: {
        label: "Prezzo minimo",
        description: "Costo minimo di credito per messaggio",
      },
      maxPrice: {
        label: "Prezzo massimo",
      },
      minContent: {
        label: "Livello minimo di contenuto",
        description:
          "Livello di moderazione dei contenuti minimo per il modello",
      },
      maxContent: {
        label: "Livello di contenuto massimo",
        description:
          "Livello massimo di moderazione dei contenuti per il modello",
      },
      content: {
        label: "Livello di contenuto",
      },
      preferredStrengths: {
        label: "Punti di forza preferiti",
        description: "Capacità e punti di forza del modello da preferire",
      },
      ignoredWeaknesses: {
        label: "Debolezze ignorate",
        description: "Deficit del modello da ignorare o consentire",
      },
      manualModelId: {
        label: "Modello manuale",
      },
      isActive: {
        label: "Attivo",
      },
      position: {
        label: "Position",
      },
      color: {
        label: "Colore",
        description: "Colore personalizzato per questo preferito",
      },
      customIcon: {
        label: "Icona personalizzata",
        description: "Icona personalizzata per questo preferito",
      },
      icon: {
        label: "Icona personalizzata",
        description:
          "Override l'icona predefinita dell'abilità per questa slot preferita",
      },
      availableTools: {
        label: "Strumenti consentiti",
        description:
          "Override ha permesso gli strumenti per questa slot. Ogni voce ha bisogno di uno toolId (utilizzare system_help_GET per scoprire gli ID degli strumenti disponibili). Impostare requiresConfirmation: true per richiedere prima di eseguire. Passare null a cadere attraverso a abilità o impostazioni globali.",
      },
      pinnedTools: {
        label: "Strumenti perniciati",
        description:
          "Override pinned toolbar strumenti per questa slot. Passare null a cadere attraverso a abilità o impostazioni globali.",
      },
      deniedTools: {
        label: "Utensili per il denigrato",
        description:
          "Bloccare gli strumenti specifici per questa slot sulla lista negata dell'abilità. Questi strumenti non possono essere chiamati indipendentemente da altre impostazioni.",
        clearAll: "Cancella tutto",
        noToolsFound: "Nessun strumento trovato",
        blockedNote:
          "Gli strumenti bloccati non possono essere chiamati indipendentemente da altre impostazioni.",
        searchPlaceholder: "Strumenti di ricerca...",
        blocked: "bloccato",
      },
      promptAppend: {
        label: "Appendice del prompt",
        description:
          "Istruzioni extra allegate al prompt del sistema di abilità solo per questa slot. Utilizzare questo per personalizzare senza cambiare l'abilità condivisa. Agenti AI: popola con il nome dell'utente, la preferenza linguistica, il livello tecnico, il contesto di dominio (ad esempio 'Il mio nome è Max. Preferisco TypeScript e bun. Rispondi in inglese.').",
        placeholder:
          "ad es. Mi chiamo Alex. Preferisco le risposte concise in inglese.",
      },
      compactTrigger: {
        label: "Trigger compatto (tokens)",
        description:
          "Override il conteggio di token che innesca la compattazione di conversazione per questa slot. Passare null a cadere attraverso a abilità o default globale.",
      },
      memoryLimit: {
        label: "Limite di memoria (token)",
        description:
          "Sovrascrivi i token totali massimi di contenuto di memoria iniettati per turno per questa slot. Passare null a cadere attraverso a abilità o default globale.",
      },
      changeSkill: {
        label: "Cambiare abilità",
      },
      modifySkill: {
        label: "Modifica skill",
      },
      response: {
        success: {
          content: "Aggiornato: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Si prega di controllare il vostro input e riprovare",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per aggiornare questo preferito",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di aggiornare questo preferito",
        },
        notFound: {
          title: "Non trovato",
          description: "Preferito non trovato",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito ad aggiornare il favorito",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Un conflitto si è verificato durante l'aggiornamento del favorito",
        },
      },
      slotOverride: {
        label: "Override per questa slot",
      },
      globalDefault: {
        label: "Il mio default (fallback)",
      },
      success: {
        title: "Operazione riuscita",
        description: "Favorite aggiornato con successo",
      },
    },
    delete: {
      title: "Eliminare i preferiti",
      description: "Rimuovere una configurazione preferita",
      container: {
        title: "Eliminare i preferiti",
        description:
          "Rimuovere permanentemente questa configurazione preferita",
      },
      backButton: {
        label: "Annulla",
      },
      actions: {
        delete: "Eliminare i preferiti",
        deleting: "Delezione Preferito",
      },
      id: {
        label: "ID preferito",
        description: "La slug o amichevole ID del favorito per eliminare",
      },
      response: {
        success: {
          content: "Cancellato: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "favorito non valido ID",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per eliminare questo favorito",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di eliminare questo favorito",
        },
        notFound: {
          title: "Non trovato",
          description: "Preferito non trovato",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a eliminare il favorito",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        conflict: {
          title: "Conflitto",
          description: "Non può eliminare favorito a causa di un conflitto",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Preferito cancellato con successo",
      },
    },
  },
  category: "Chat",
  tags: {
    favorites: "Preferiti",
  },
  active: "Attivo",
  fallbacks: {
    unknownSkill: "Abilità sconosciuta",
    unknownModel: "Modello sconosciuto",
    unknown: "Sconosciuto",
    unknownProvider: "sconosciuto",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 crediti",
    noModelConfiguration: "Errore: Nessuna configurazione del modello",
    configurationMissing: "Manca la configurazione",
    noModel: "Nessun modello",
    dash: ", ",
  },
  enums: {
    selectionType: {
      characterBased: "Sulla base di competenze",
      manual: "Modello specifico",
      filters: "Criteri di filtro",
    },
    mode: {
      auto: "Automatico",
      manual: "Manuale",
    },
    intelligence: {
      any: "Qualsiasi",
      quick: "Rapido",
      smart: "Intelligente",
      brilliant: "Brillante",
    },
    price: {
      any: "Qualsiasi",
      cheap: "A buon mercato",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      any: "Qualsiasi",
      mainstream: "Convenzionale",
      open: "Aperto",
      uncensored: "Senza censura",
    },
    variantsMode: {
      all: "Tutte le varianti",
      some: "Alcune varianti",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Ordina per livello di intelligenza",
      price: "Ordina per Prezzo",
      content: "Ordina per Politica dei contenuti",
    },
    sortDirection: {
      asc: "Da Basso a Alto",
      desc: "Alta a Basso",
    },
    sortField: {
      intelligence: "Intelligenza",
      price: "Prezzo",
      content: "Contenuti",
    },
  },
  get: {
    title: "Ottenere favoriti",
    titleShort: "Preferiti",
    description:
      "Recuperare tutte le configurazioni di abilità preferite salvate",
    userId: {
      label: "Utente ID",
      description:
        "Admin only: ottieni i preferiti per un utente specifico. Lascia vuoto per catturare i tuoi preferiti.",
    },
    fields: {
      query: {
        label: "Cerca",
        description: "Cerca i preferiti per nome, slogan o abilità ID.",
      },
      page: {
        label: "Pagina",
        description:
          "Numero di pagina per i risultati impaginati (AI / MCP: formato pagina predefinito 25).",
      },
      pageSize: {
        label: "Dimensione della pagina",
        description:
          "Numero di favoriti per pagina (1–500). AI / MCP chiamanti di default a 25; i chiamanti umani ritornano tutti.",
      },
    },
    actions: {
      menu: "Opzioni",
      share: "Condividi e guadagnare",
      addAi: "Aggiungi un AI",
      edit: "Modifica",
      active: "Attivo",
      reorder: "Trascinare per riordinare",
      moveUp: "Muovetevi!",
      moveDown: "Muoversi!",
      showMore: "{{count}} più modelli",
      showLess: "Mostra meno",
      settings: "Impostazioni di chat",
    },
    addVariant: "Aggiungi un altro modello",
    viewSkill: "Dettagli",
    deleteVariant: "Rimuovere questo modello?",
    deleteVariantAction: "Rimuovi",
    deleteGroup: {
      trigger: "Rimuovere le abilità",
      confirm: "Rimuovere questa abilità e i suoi modelli {{count}}?",
      cancel: "Annulla",
      action: "Rimuovi",
    },
    emptyState: "Ancora nessuna abilita'. Scegline uno per iniziare a parlare.",
    tabs: {
      myFavorites: "Le mie abilità",
      browseSkills: "Sfoglia le competenze",
    },
    sections: {
      companion: "Compagni",
      skills: "Skill",
      model: "Modelli di placche",
      background: "Agenti di sfondo",
    },
    container: {
      title: "Le tue abilità",
      description:
        "Gestisci le tue abilità preferite e configurazioni di modelli",
    },
    createButton: {
      label: "Esplorare le abilità",
    },
    response: {
      favorite: {
        title: "Configurazione preferita",
        id: {
          content: "ID: {{value}}",
        },
        skillId: {
          content: "Competenze: {{value}}",
        },
        customVariantName: {
          content: "Nome Variante: {{value}}",
        },
        customIcon: {
          content: "Icona personalizzata: {{value}}",
        },
        voice: {
          content: "Voce: {{value}}",
        },
        mode: {
          content: "Modalità: {{value}}",
        },
        intelligence: {
          content: "Intelligenza: {{value}}",
        },
        modelSelection: {
          title: "Selezione del modello",
        },
        selectionType: {
          content: "Tipo di selezione: {{value}}",
        },
        minIntelligence: {
          content: "Min Intelligence: {{value}}",
        },
        maxIntelligence: {
          content: "Max Intelligence: {{value}}",
        },
        minPrice: {
          content: "Prezzo minimo: {{value}}",
        },
        maxPrice: {
          content: "Prezzo massimo: {{value}}",
        },
        minContent: {
          content: "Livello di contenuto minimo: {{value}}",
        },
        maxContent: {
          content: "Livello di contenuto massimo: {{value}}",
        },
        content: {
          content: "Livello di contenuto: {{value}}",
        },
        preferredStrengths: {
          content: "Punti di riferimento: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Debolezze ignorate: {{value}}",
        },
        manualModelId: {
          content: "Modello manuale: {{value}}",
        },
        position: {
          content: "Posizione: {{value}}",
        },
        color: {
          content: "Colore: {{value}}",
        },
        isActive: {
          content: "Attivo: {{value}}",
        },
        useCount: {
          content: "Tempi utilizzati: {{value}}",
        },
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "Ha Companion: {{value}}",
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
        description: "Devi essere connesso per visualizzare i preferiti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa risorsa",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun favorito trovato",
      },
      server: {
        title: "Errore del server",
        description: "Non caricare i preferiti",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che saranno persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'elaborazione della vostra richiesta",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Preferiti caricati con successo",
    },
  },
  post: {
    title: "Creare Favorite",
    description: "Creare una nuova configurazione di abilità preferita",
    container: {
      title: "Nuovo favorito",
      description: "Salvare una configurazione di abilità come preferito",
    },
    backButton: {
      label: "Annulla",
    },
    useWithoutSavingButton: {
      label: "Utilizzare senza aggiungere a Favs",
      loadingText: "Applicare...",
    },
    submitButton: {
      label: "Aggiungi ai preferiti",
      loadingText: "Aggiunta...",
    },
    skillId: {
      label: "Skill",
      description: "Selezionare l'abilità per questo preferito",
    },
    customVariantName: {
      label: "Nome Variante",
      description:
        "Nome personalizzato per questa variante (lasciare vuoto per usare l'abilità predefinita)",
    },
    customIcon: {
      label: "Icona personalizzata",
      description: "Icona personalizzata opzionale per questo preferito",
    },
    voice: {
      label: "Voce",
      description: "Voce preferita per la sintesi vocale",
    },
    mode: {
      label: "Modalità di selezione",
      description: "Come scegliere il modello",
    },
    modelSelection: {
      title: "Selezione del modello",
      description:
        "Scegliere come selezionare il modello AI - scegliere un modello specifico o lasciare che il sistema scelga in base ai filtri",
    },
    selectionType: {
      label: "Tipo di selezione",
      manual: "Modello specifico",
      filters: "Criteri di filtro",
    },
    intelligence: {
      label: "Livello di intelligenza",
      description: "Livello minimo di intelligenza richiesto",
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
      description: "Costo minimo di credito per messaggio",
    },
    maxPrice: {
      label: "Prezzo massimo",
      description: "Prezzo massimo da utilizzare",
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
    content: {
      label: "Livello di contenuto",
      description: "Livello di moderazione dei contenuti",
    },
    preferredStrengths: {
      label: "Punti di forza preferiti",
      description: "Capacità e punti di forza del modello da preferire",
    },
    ignoredWeaknesses: {
      label: "Debolezze ignorate",
      description: "Deficit del modello da ignorare o consentire",
    },
    manualModelId: {
      label: "Modello manuale",
      description: "Modello specifico da usare (per modalità manuale)",
    },
    response: {
      id: {
        content: "Creato favorito con ID: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per aggiungere i preferiti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare preferiti",
      },
      notFound: {
        title: "Non trovato",
        description: "L'articolo che si sta cercando di preferiti non esiste",
      },
      server: {
        title: "Errore del server",
        description: "Non aggiungere ai preferiti",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che saranno persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Questo preferito esiste già",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Favorite creato con successo",
    },
  },
  reorder: {
    post: {
      title: "Reorder Favorites",
      description: "Aggiorna l'ordine delle tue configurazioni preferite",
      errors: {
        validation: {
          title: "Ordine non valido",
          description:
            "Si prega di controllare le impostazioni dell'ordine e riprovare",
        },
        network: {
          title: "Errore di connessione",
          description:
            "Incapace di salvare il nuovo ordine. Per favore prova di nuovo.",
        },
        unauthorized: {
          title: "Accedi per continuare",
          description: "Si prega di firmare per riordinare i tuoi preferiti",
        },
        forbidden: {
          title: "Deniego di autorizzazioni",
          description: "Non hai il permesso di riordinare i preferiti",
        },
        notFound: {
          title: "Preferiti Non Trovato",
          description:
            "Non siamo riusciti a trovare i tuoi preferiti per riordinare",
        },
        server: {
          title: "Qualcosa di strano",
          description:
            "Non potevamo salvare il tuo nuovo ordine. Per favore prova di nuovo.",
        },
        unknown: {
          title: "Errore inaspettato",
          description:
            "E' successo qualcosa di inaspettato. Per favore prova di nuovo.",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "I tuoi cambiamenti non sono ancora stati salvati",
        },
        conflict: {
          title: "Ordine Conflitto",
          description:
            "L'ordine è cambiato. Si prega di rinfrescare e riprovare",
        },
      },
      success: {
        title: "Ordine salvato",
        description: "I tuoi preferiti sono stati riordinati con successo",
      },
    },
  },
};
