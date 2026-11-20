// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/it";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Immagine",
    generation: "Generazione",
    ai: "IA",
  },
  post: {
    title: "Immagine generata",
    titleShort: "Immagine generata",
    dynamicTitle: "Immagine: {{prompt}}",
    description:
      "Generare un'immagine da un prompt dei testi. Utilizzare lo strumento di modelli con modelType = immagine per vedere i modelli disponibili e le loro capacità. Passare il modello id per selezionare un modello specifico, o lasciare vuoto per il default dell'utente. Passare aspectRatio (es. 16:9) per l'output di paesaggio o ritratto. Facoltativamente passare inputMediaUrl per la generazione immagine-immagine (utilizza lo URL come punto di riferimento/avviamento). Restituisce imageUrl più la larghezza reale, l'altezza e outputAspectRatio del file.",
    form: {
      title: "Generazione di immagini",
      description: "Inserisci un prompt per generare un'immagine",
    },
    prompt: {
      label: "Prompt",
      description: "Descrivi l'immagine che vuoi generare",
      placeholder: "Un tramonto su un lago di montagna, fotorealistico...",
    },
    model: {
      label: "Modello",
      description:
        "Modello di generazione di immagini id. Lascia vuoto per impostazione utente. Utilizzare lo strumento dei modelli (modelType = immagine) per sfogliare i modelli disponibili.",
    },
    approxCost: "~crediti",
    size: {
      label: "Dimensione",
      description: "Seleziona le dimensioni dell'immagine di uscita",
      square1024: "Piazza (1024×1024)",
      landscape1792: "Paesaggio (1792×1024)",
      portrait1792: "Ritratto (1024×1792)",
    },
    quality: {
      label: "Qualità",
      description: "Selezionare la qualità dell'immagine di uscita",
      standard: "Standard",
      hd: "HD",
    },
    aspectRatio: {
      label: "Aspect Ratio",
      description:
        "Rapporto dell'aspetto di uscita: 16:9 o 21:9 paesaggio, 9:16 ritratto, 4:3, 3:4, 3:2, 2:3, 1:1. Lasciare vuoto per quadrato. Ogni modello ottiene il rapporto più vicino che supporta; il risultato riporta la larghezza reale, l'altezza e il rapporto, quindi descrivere l'immagine da quelli, mai da quello che hai chiesto.",
    },
    inputMediaUrl: {
      label: "Immagine di riferimento URL",
      description:
        "Immagine URL per la generazione immagine-immagine. Il modello modifica o ridisegna questa immagine. Funziona solo con modelli che supportano l'ingresso dell'immagine.",
      placeholder: "https://example.com/image.jpg",
    },
    download: "Scarica",
    dimensionSeparator: "×",
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      text: "Immagine generata",
      label: "Immagine generata",
      loadingText: "Generando...",
    },
    response: {
      imageUrl: "Immagine generata URL",
      creditCost: "Crediti utilizzati",
      jobId: "Lavoro asincastro ID",
      width: "Larghezza (px)",
      height: "Altezza (x)",
      outputAspectRatio: "Rapporto di ispezione",
    },
    errors: {
      referenceUnavailable:
        "L'immagine di riferimento non è disponibile. E 'stato cancellato, o appartiene a una chat che non si può aprire. Utilizzare un'immagine da questa chat o caricarlo di nuovo.",
      validation_failed: {
        title: "Errore di convalida",
        description: "Controllare il prompt e le impostazioni",
      },
      network_error: {
        title: "Errore di rete",
        description:
          "Non è riuscito a connettersi al servizio di generazione di immagini",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Si prega di firmare per generare immagini",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di usare questa funzione",
      },
      not_found: {
        title: "Non trovato",
        description: "Il modello richiesto non è stato trovato",
      },
      server_error: {
        title: "Errore del server",
        description:
          "Un errore inaspettato si è verificato durante la generazione di immagini",
      },
      unknown_error: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved_changes: {
        title: "Modifiche non salvate",
        description: "Si prega di salvare le modifiche prima di generare",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la generazione di immagini",
      },
      notAnImageModel:
        "Il modello selezionato non supporta la generazione di immagini. Selezionare un modello di immagine.",
      notConfigured:
        "{{label}} non è configurato. Aggiungi {{envKey}} al tuo file.env. Ottieni la tua chiave a {{url}}",
      providerUnavailable:
        "{{label}} non è disponibile in questo momento. Scegli un altro modello a {{url}}",
      insufficientCredits:
        "Crediti insufficienti. Saldo: {{balance}}, minimo richiesto: {{minimum}}.",
      balanceCheckFailed: "Non è riuscito a controllare il saldo di credito",
      unsupportedSize:
        "Il modello {{model}} non supporta la dimensione {{size}}. Dimensioni supportate: {{supported}}",
      unsupportedQuality:
        "Il modello {{model}} non supporta la qualità {{quality}}. Qualità supportate: {{supported}}",
      unsupportedAspectRatio:
        "Il modello {{model}} non supporta il rapporto di aspetto {{aspectRatio}}. Rapporti supportati: {{supported}}",
      modelNoReferenceImage:
        "Il modello {{model}} non accetta le immagini di riferimento. Scegliere un modello di immagine-immagine (uno dei cui ingressi includono l'immagine) per utilizzare un riferimento.",
      generationFailed: "La generazione di immagini è fallita",
      generationFailedWithReason:
        "La generazione di immagini è fallita: {{error}}",
      contentRejected:
        "Rifiutato dal filtro dei contenuti del fornitore di immagini: {{error}}. Questo è un rifiuto, non un'estrazione. Sopprimere il prompt o scegliere un modello non censurato. Non sei stato accusato.",
      providerOutage:
        "Il provider di immagini è scaricato o sovraccaricato in questo momento: {{error}}. E' un'estrazione, non un rifiuto. Riprova tra un minuto o scegli un altro modello. Non sei stato accusato.",
      providerError: "Errore del fornitore di immagini: {{error}}",
      noImageUrl: "Nessuna immagine URL restituita dal fornitore",
      noImageGenerated:
        "Il modello non ha restituito alcuna immagine. Ciò significa che il prompt è stato rifiutato (per esempio armi, persone reali o personaggi protetti da copyright) o la richiesta non è supportata da questo modello. Prova a rifrasare il prompt, o scegliere un modello di immagine diverso. Nota: le immagini di riferimento non vengono utilizzate da modelli di testo-immagine come questo. Non sei stato accusato di questo tentativo.",
      creditsFailed:
        "Non è riuscito a dedurre i crediti per la generazione di immagini",
      apiKeyNotConfigured: "La chiave API non configurata",
      externalServiceError: "Errore di servizio esterno: {{message}}",
      requestAborted: "La richiesta è stata annullata",
      requestTimedOut:
        "Richiesta time-out in attesa di generazione di immagini",
      requestFailed: "Richiesta non riuscita: {{message}}",
      pollFailed: "Richiesta di sondaggio non riuscita con stato {{status}}",
      nonJsonResponse:
        "Il Fornitore ha restituito una risposta non JSON (HTTP {{status}}): {{body}}",
    },
    success: {
      title: "Immagine generata",
      description: "La tua immagine è stata generata con successo",
    },
  },
  models: {
    selector: {
      bestForFilter: "Ideale per questo filtro",
      setupRequired: "Configurazione necessaria",
      providerUnconfigured: "Chiave API del fornitore non configurata",
      addEnvKey: "Aggiungi a.env",
      noMatchingModels: "Nessun modello corrisponde ai filtri",
      noModelsWarning:
        "Nessun modello corrisponde a questi filtri. Modifica le impostazioni per continuare.",
      allModelsCount: "{{count}} modelli disponibili",
      filteredModelsCount: "{{count}} modelli corrispondenti",
      showAllModels: "Mostra tutti i {{count}} modelli",
      showFiltered: "Mostra solo i risultati filtrati",
      creditsExact: "{{cost}} crediti",
      creditsSingle: "1 credito",
      free: "Gratis",
      autoSelectedModel: "In base ai filtri:",
      manualSelectedModel: "Selezionato:",
      skillSelectedModel: "Modello della skill:",
      selectModelBelow: "Seleziona un modello qui sotto",
      sortBy: "Ordina per",
      sortThen: "Allora:",
      showLess: "Mostra meno",
      showMore: "Mostra altri {{count}}",
      showLegacyModels: "Mostra {{count}} modelli precedenti",
      autoMode: "Filtro a base",
      manualMode: "Scelta manuale",
      skillMode: "Predefinito della skill",
      autoModeDescription:
        "Scegli automaticamente il modello migliore in base ai tuoi filtri",
      manualModeDescription: "Scegli il modello che vuoi",
      characterBasedModeDescription:
        "Usa il modello per cui è stata progettata la skill",
      typeChat: "Chat",
      typeImage: "Immagine",
      typeVideo: "Video",
      typeAudio: "Audio",
      filters: "Filtri",
      filtersActive: "Filtri ({{count}})",
      clearFilter: "Azzera",
      inherited: "Inheri",
      platformDefault: "Predefinito",
      searchPlaceholder: "Modelli di ricerca...",
      noSearchResults: 'Nessun modello trovato per " {{query}} "',
      searchExtrasGroup: "Filtri di corrente esterna",
    },
    tiers: {
      intelligence: {
        quick: "Rapido",
        smart: "Intelligente",
        brilliant: "Brillante",
        quickDesc: "Rapido ed efficiente",
        smartDesc: "Qualità equilibrata",
        brilliantDesc: "Ragionamento approfondito",
      },
      price: {
        cheap: "Economico",
        standard: "Standard",
        premium: "Premium",
        cheapDesc: "0-3 crediti per messaggio",
        standardDesc: "3-9 crediti per messaggio",
        premiumDesc: "9 o più crediti per messaggio",
      },
      content: {
        mainstream: "Convenzionale",
        open: "Aperto",
        uncensored: "Senza censura",
        mainstreamDesc: "Filtri standard",
        openDesc: "Meno restrizioni",
        uncensoredDesc: "Nessuna restrizione",
      },
    },
    sort: {
      intelligence: "Intelligenza",
      price: "Prezzo",
      content: "Contenuti",
    },
    ranges: {
      intelligenceRange: {
        minLabel: "L'intelligence",
        maxLabel: "Max Intelligence",
      },
      priceRange: { minLabel: "Prezzo minimo", maxLabel: "Prezzo massimo" },
      contentRange: {
        minLabel: "Contenuto minimo",
        maxLabel: "Contenuto massimo",
      },
    },
    credits: { credit: "{{count}} credito", credits: "{{count}} crediti" },
    creditDisplay: {
      badge: {
        approxPerMsg: "~ Crediti {{cost}}/msg",
        exactPerMsg: "Crediti {{cost}}/msg",
        perImg: "Crediti {{cost}}/img",
        perClip: "Crediti/clip di {{cost}}",
        ratePerChar: "Crediti/char di {{rate}}",
        ratePerSec: "Crediti/s {{rate}}",
        approxChars: "- Chars {{count}}",
        seconds: "{{count}}",
        lessThanMin: "<0.1",
      },
      tokenBased: {
        header: "Costo per messaggio",
        costRangeLabel: "Intervallo tipico:",
        costRangeValue: "Da {{min}} a {{max}} crediti",
        examplesLabel: "Esempi:",
        examples: {
          short: "Conversazione breve",
          medium: "Conversazione media",
          long: "Conversazione lunga",
        },
        triggersCompacting: "⚡ Avvia la sintesi",
        tokensCount: "{{count}} token",
        explanation:
          "Lo AI elabora tutta la cronologia delle conversazioni con ogni messaggio.",
        compactingLabel: "✨ Sintesi automatica:",
        compactingExplanation:
          " Nei token {{threshold}}, i messaggi più vecchi vengono automaticamente riassunti.",
      },
      fixed: {
        title: "Prezzi per {{model}}",
        freeDescription: "Questo modello è gratuito e non consuma crediti.",
        fixedDescription:
          "Il modello ha un costo fisso per messaggio, a prescindere dalla lunghezza.",
        costPerMessage: "Costo per messaggio:",
        freeExplanation: "Usa questo modello gratis e senza limiti.",
        freeHighlight: "Provalo e fai tutti gli esperimenti che vuoi.",
        simpleLabel: "Prezzo fisso:",
        simpleExplanation: " Ogni messaggio costa lo stesso, breve o lungo.",
      },
      media: {
        perImage: "per immagine",
        perClip: "per clip",
        perSecond: "al secondo",
        perClipDuration: "per clip ({{duration}} s)",
        costPerImage: "Costo per immagine:",
        costPerClip: "Costo per clip:",
        costPerSecond: "Costo al secondo:",
        imageDescription:
          "Costo fisso per immagine generata, indipendentemente dalla risoluzione.",
        clipDescription: "Costo fisso per clip audio generata.",
        videoDescription:
          "Caricato al secondo del video generato (di default {{duration}} s).",
        ttsDescription: "Caricato per personaggio convertito in discorso.",
        ttsPricing: "Tasso:",
        ttsScenarios: {
          short: "Breve sentenza",
          medium: "Un messaggio tipico",
          long: "Articolo lungo",
        },
        ttsExample:
          "Un messaggio di 100 parole (~600 chars) costa ~ crediti {{count}}",
        sttDescription: "Caricato per secondo di audio trascritto.",
        sttPricing: "Tasso:",
        sttScenarios: {
          short: "Nota vocale rapida",
          medium: "Messaggio vocale",
          long: "Tempo pieno",
        },
        sttExample: "Un costo di registrazione di 1 minuto ~ crediti {{count}}",
        costPerChar: "Costo per carattere:",
        costPerClipMusic: "Costo per clip:",
        videoBreakdown:
          "Crediti {{costPerSecond}}/s × {{duration}} s = Crediti {{total}}",
        imageHeader: "Costo della generazione di immagini",
        videoHeader: "Costo della generazione video",
        musicHeader: "Costo della generazione musicale",
        ttsHeader: "Costo di testo-parola",
        sttHeader: "Speech-to-Text Costo",
      },
      creditValue: "1 credito = {{value}}",
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
      musicGen: "Generazione di musica",
      tts: "Testo a Discorso",
      stt: "Discorso a testo",
      videoGen: "Generazione di video",
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
    names: modelTranslations.names,
  },
};
