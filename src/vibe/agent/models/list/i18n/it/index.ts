import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    models: "Modelli",
  },
  endpointCategories: {
    ai: "IA",
  },
  enums: {
    modelType: {
      text: "Testo",
      image: "Immagine",
      video: "Video",
      audio: "Audio",
    },
    content: {
      mainstream: "Convenzionale",
      open: "Aperto",
      uncensored: "Senza censura",
    },
    intelligence: {
      quick: "Rapido",
      smart: "Intelligente",
      brilliant: "Brillante",
    },
  },
  get: {
    title: "Modelli",
    titleShort: "Modelli AI",
    description:
      "Esplora tutti i modelli IA e filtrali per tipo (testo, immagini, video o audio), livello dei contenuti o intelligenza. Per i modelli video supportedDurations elenca le durate valide in secondi, supportedAspectRatios indica le proporzioni disponibili e supportedFrameImages mostra i fotogrammi accettati (first_frame parte da un’immagine, last_frame anima la scena fino all’immagine finale). allowedPassthroughParameters elenca altri parametri accettati, ad esempio negative_prompt e cfg_scale, mentre generateAudio indica se il video include l’audio. Quando chiami generate_video, usa l’ID del modello come valore di model.",
    dynamicTitle: "Modelli {{count}}",

    fields: {
      query: {
        label: "Cerca",
        description:
          "Filtra i modelli per nome, fornitore o capacità (ad esempio 'codifica', 'incensored', 'immagine', 'veloce').",
        placeholder: "ad es. GPT, Gemini, codifica, non censurato...",
      },
      modelType: {
        label: "Tipologia",
        description:
          "Filtra per tipo di modello: testo (chat/ LLM), immagine (produzione di immagini), video o audio (TTS / STT /music). Lasciare vuoto per tutti i tipi.",
        placeholder: "Tutti i tipi",
      },
      contentLevel: {
        label: "Livello di contenuto",
        description:
          "Filtra per politica dei contenuti. Mainstream = filtri di sicurezza standard. Aperto = meno restrizioni. Uncensored = nessun filtro.",
        placeholder: "Tutti i livelli di contenuto",
      },
      intelligence: {
        label: "Intelligenza",
        description:
          "Minimo livello di intelligenza. Rapido = veloce ed efficiente. Smart = qualità equilibrata. Brilliant = ragionamento profondo.",
        placeholder: "Qualsiasi intelligenza",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina per l'impaginazione (starts at 1).",
      },
      pageSize: {
        label: "Dimensione della pagina",
        description: "Numero di modelli per pagina (default 50, max 200).",
      },
    },

    response: {
      models: "Modelli",
      totalCount: "Totale",
      matchedCount: "Corrispondenza",
      currentPage: "Pagina",
      totalPages: "Pagine",
      hint: "Hit",
      model: {
        id: "Modello ID",
        name: "Nome",
        provider: "Fornitore",
        type: "Tipologia",
        description: "Designazione",
        contextWindow: "Contesto",
        parameterCount: "Parametri",
        intelligence: "Intelligenza",
        content: "Contenuti",
        price: "Prezzo (crediti)",
        supportsTools: "Strumenti",
        utilities: "Capacità",
        inputs: "Ingressi",
        outputs: "Uscite",
        supportedDurations: "Durata (s)",
        supportedAspectRatios: "Aspect Ratios",
        supportedResolutions: "Risoluzioni",
        supportedFrameImages: "Tipi di immagine della cornice",
        generateAudio: "Genera Audio",
        supportedSizes: "Dimensioni esatte",
        allowedPassthroughParameters: "Parametri extra",
      },
    },

    errors: {
      server: {
        title: "Errore del server",
        description:
          "Non ha recuperato l'elenco dei modelli. Per favore, riprovate.",
      },
      network: {
        title: "Errore di rete",
        description:
          "La connessione di rete è fallita. Controlla la connessione.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore inaspettato.",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di filtro non validi.",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare i modelli.",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa risorsa.",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun modello trovato.",
      },
      conflict: {
        title: "Conflitto",
        description: "Richiedo un conflitto.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti insoddisfatti.",
      },
    },

    success: {
      title: "Modelli caricati",
      description: "L'elenco dei modelli AI recuperato con successo.",
    },

    browser: {
      supportsTools: "✓ strumenti",
      noModels: "Nessun modello corrisponde ai tuoi filtri.",
      allLabel: "Tutti",
      statsLabel: "{{matched}} dei modelli {{total}}",
      free: "Gratis",
      credits: "- {{cost}} cr",
      ctx: "Ct.",
    },
  },
};
