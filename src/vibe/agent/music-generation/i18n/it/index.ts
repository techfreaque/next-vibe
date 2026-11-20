import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    music: "Musica",
    generation: "Generazione",
    ai: "IA",
  },
  post: {
    title: "Generare musica",
    titleShort: "Generare musica",
    dynamicTitle: "Musica: {{prompt}}",
    description:
      "Generare musica da un messaggio di testo. Utilizzare lo strumento dei modelli con modelType = audio per vedere i modelli musicali disponibili. Passare il modello id per selezionare un modello specifico, o lasciare vuoto per il default dell'utente. Facoltativamente passare inputMediaUrl per il trasferimento in stile audio-to-audio. Restituisce audioUrl e durationSeconds.",
    form: {
      title: "Generazione di musica",
      description: "Inserire un prompt per generare musica",
    },
    prompt: {
      label: "Prompt",
      description: "Descrivi la musica che vuoi generare",
      placeholder:
        "Musica elettronica all'avanguardia con una melodia accattivante...",
    },
    model: {
      label: "Modello",
      description:
        "Modello di generazione musicale id. Lascia vuoto per impostazione utente. Utilizzare lo strumento dei modelli (modelType = audio) per sfogliare i modelli disponibili.",
    },
    duration: {
      label: "Durata",
      description: "Lunghezza della clip audio generata",
      short: "Breve (~8s)",
      medium: "Mezzo (~20s)",
      long: "Lungo (~30s)",
    },
    inputMediaUrl: {
      label: "Riferimento Audio URL",
      description:
        "Audio URL per trasferimento di stile o remix. Il modello lo usa come punto di partenza. Funziona solo con modelli che supportano l'ingresso audio.",
      placeholder: "https://example.com/audio.mp3",
    },
    download: "Scarica",
    separator: "·",
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      text: "Generare musica",
      label: "Generare musica",
      loadingText: "Generando...",
    },
    response: {
      audioUrl: "Generazione audio URL",
      creditCost: "Crediti utilizzati",
      durationSeconds: "Durata in pochi secondi",
      jobId: "Lavoro asincastro ID",
    },
    errors: {
      referenceUnavailable:
        "L'audio di riferimento non è disponibile. E 'stato cancellato, o appartiene a una chat che non si può aprire. Utilizzare l'audio da questa chat o caricarlo di nuovo.",
      validation_failed: {
        title: "Errore di convalida",
        description: "Controllare il prompt e le impostazioni",
      },
      network_error: {
        title: "Errore di rete",
        description:
          "Non è riuscito a connettersi al servizio di generazione musicale",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Si prega di firmare per generare musica",
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
          "Un errore inaspettato si è verificato durante la generazione musicale",
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
          "Si è verificato un conflitto durante la generazione musicale",
      },
      noModelConfigured:
        "Nessun modello di musica configurato. Impostare un modello musicale nelle impostazioni preferite.",
      notAnAudioModel:
        "Il modello selezionato non supporta la generazione musicale. Seleziona un modello musicale.",
      notConfigured:
        "{{label}} non è configurato. Aggiungi {{envKey}} al tuo file.env. Ottieni la tua chiave a {{url}}",
      providerUnsupported: "{{label}} non è ancora supportato",
      insufficientCredits:
        "Crediti insufficienti. Saldo: {{balance}}, minimo richiesto: {{minimum}}.",
      balanceCheckFailed: "Non è riuscito a controllare il saldo di credito",
      unsupportedDuration:
        "Il modello {{model}} non supporta la durata {{duration}}. Durata supportata: {{supported}}",
      generationFailed: "La generazione musicale è fallita",
      providerError: "Errore del fornitore di musica: {{error}}",
      noAudioUrl: "Nessun audio URL restituito dal fornitore",
      creditsFailed:
        "Non è riuscito a dedurre i crediti per la generazione musicale",
      apiKeyNotConfigured: "La chiave API non configurata",
      externalServiceError: "Errore di servizio esterno: {{message}}",
      requestAborted: "La richiesta è stata annullata",
      requestTimedOut: "Richiesta time-out in attesa di generazione musicale",
      requestFailed: "Richiesta non riuscita: {{message}}",
      pollFailed: "Richiesta di sondaggio non riuscita con stato {{status}}",
    },
    success: {
      title: "Generazione di musica",
      description: "La tua musica è stata generata con successo",
    },
  },
  models: {
    names: {
      MUSICGEN_STEREO: "MusicGen Stereo",
      MUSIC_GEN: "ModelsLab Music Gen",
      ELEVENLABS_MUSIC: "ElevenLabs Music",
      CASSETTE_MUSIC: "CassetteAI Music",
      SONAUTO_SONG: "Sonauto Song",
      LYRIA_3: "Lyria 3",
      LYRIA_3_PRO_PREVIEW: "Lyria 3 Anteprima",
      LYRIA_3_CLIP_PREVIEW: "Lyria 3 Clip Anteprima",
    },
  },
};
