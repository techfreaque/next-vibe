import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Preferiti",
  },
  voices: {
    MALE: "Voce maschile",
    FEMALE: "Voce femminile",
  },

  post: {
    title: "Creare Favorite",
    titleShort: "Aggiungi Favorite",
    description: "Creare una nuova configurazione di abilità preferita",
    container: {
      title: "Nuovo favorito",
      description: "Salvare una configurazione di abilità come preferito",
    },
    backButton: {
      label: "Torna a Preferiti",
    },
    submitButton: {
      label: "Creare Favorite",
      loadingText: "Creare...",
    },
    useWithoutSavingButton: {
      label: "Utilizzare senza salvare",
      loadingText: "Applicare...",
    },
    skillId: {
      label: "Skill",
      description:
        'Skill ID in formato fuso: " skillSlug " per la variante predefinita, " skillSlug__variantId " per una variante specifica (ad esempio " thea__brilliant "). Eseguire le competenze per vedere gli ID disponibili.',
    },
    customVariantName: {
      label: "Etichetta",
      description:
        "Nome personalizzato per questa variante (lasciare vuoto per usare l'abilità predefinita)",
    },
    customIcon: {
      label: "Icona personalizzata",
      description: "Icona personalizzata opzionale per questo preferito",
    },
    chatModel: {
      label: "Modello di chat",
      placeholder: "Stesso come abilità",
    },
    voice: {
      label: "Voce",
      description:
        "La voce TTS sovrascrive per questo favorito. null = la tua impostazione vocale globale vince (modello bridge: l'impostazione utente ha la priorità). Impostare per dare a questo favorito specifico una voce diversa.",
      placeholder: "Stesso come abilità",
    },
    sttModel: {
      label: "Modello di testo",
      description:
        "Il modello STT supera. null = la tua preferenza STT globale vince (modello bridge). Impostare solo per esigenze di trascrizione specializzate.",
      placeholder: "Stesso come abilità",
    },
    imageVisionModel: {
      label: "Modello di visione dell'immagine",
      description:
        "Visione d'immagine LLM override. null = vincita delle preferenze globali dell'utente (modello di bridge).",
      placeholder: "Stesso come abilità",
    },
    videoVisionModel: {
      label: "Modello di visione video",
      description:
        "Superare la visione video LLM. null = vince la preferenza globale dell'utente (modello bridge).",
      placeholder: "Stesso come abilità",
    },
    audioVisionModel: {
      label: "Modello di visione audio",
      description:
        "La visione audio LLM override. null = vince la preferenza globale dell'utente (modello del bridge).",
      placeholder: "Stesso come abilità",
    },
    imageGenModel: {
      label: "Modello di generazione di immagini",
      description:
        "null = vincite imageGenModelSelection di abilità (media gen: abilità prende la priorità). Impostare per utilizzare un generatore diverso da quanto specifica l'abilità.",
      placeholder: "Stesso come abilità",
    },
    musicGenModel: {
      label: "Modello di generazione musicale",
      description:
        "generatore di musica override. null = abilità musicGenModelSelection vince (media gen: abilità prende la priorità).",
      placeholder: "Stesso come abilità",
    },
    videoGenModel: {
      label: "Modello di generazione video",
      description:
        "Superare il generatore video. null = vincite videoGenModelSelection di abilità (media gen: abilità prende la priorità).",
      placeholder: "Stesso come abilità",
    },
    mode: {
      label: "Modalità di selezione",
      description: "Come scegliere il modello",
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
    icon: {
      label: "Icona personalizzata",
      description:
        "Override l'icona predefinita dell'abilità per questa slot preferita",
    },
    compactTrigger: {
      label: "Trigger compatto (tokens)",
      description:
        "Override il conteggio dei token che innesca la compattazione della conversazione. Passare null a cadere attraverso a abilità o default globale.",
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
    changeSkill: {
      label: "Cambiare abilità",
    },
    modifySkill: {
      label: "Modifica skill",
    },
    character: {
      name: "Nome",
      tagline: "Tagli",
      description: "Designazione",
    },
  },
};
