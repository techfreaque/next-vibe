/**
 * Speech-to-Text English translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  hotkey: {
    post: {
      title: "Hotkey vocale a testo",
      titleShort: "STT Hotkey",
      description:
        "Registrare e trascrivere l'audio con l'inserimento automatico del testo",
      form: {
        title: "Configurazione di Hotkey",
        description: "Configurare le impostazioni di hotkey vocale-text",
      },
      action: {
        label: "Azione",
        description: "Azione da eseguire (start/stop/toggle)",
      },
      provider: {
        label: "Fornitore",
        description: "fornitore AI per trascrizione",
      },
      language: {
        label: "Lingua",
        description: "Lingua dell'audio",
      },
      insertPrefix: {
        label: "Inserisci il Prefisso",
        description: "Testo da inserire prima della trascrizione",
        placeholder: "ad es., '> '",
      },
      insertSuffix: {
        label: "Inserire il Suffisso",
        description: "Testo da inserire dopo trascrizione",
        placeholder: "ad esempio, '",
      },
      response: {
        title: "Risultato",
        description: "Risultato di registrazione e trascrizione",
        success: "Operazione riuscita",
        status: "Stato",
        message: "Messaggio",
        text: "Testo trascritto",
        recordingDuration: "Durata di registrazione (ms)",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per usare questa funzione",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a elaborare la registrazione",
        },
        conflict: {
          title: "Conflitto",
          description: "Registrazione già in corso",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di usare questa funzione",
        },
        network: {
          title: "Errore di rete",
          description:
            "Non è riuscito a connettersi al servizio di trascrizione",
        },
        notFound: {
          title: "Non trovato",
          description: "Sessione non trovata",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Registrazione in corso",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        dependenciesMissing:
          "Dipendenze richieste non disponibili: {{missing}}. {{recommendations}}",
        invalidAction: "Azione non valida: {{action}}",
        noActionProvided: "Nessuna azione fornita",
        actionFailed: "Non riuscito a eseguire l'azione: {{error}}",
        alreadyRecording: "Registrazione già in corso",
        notRecording: "Nessuna registrazione in corso",
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
    tags: {
      ai: "IA",
      transcription: "Trascrizione",
      speech: "Discorso",
      hotkey: "Hotkey",
      cli: "CLI",
    },
    platforms: {
      macos: "macOS",
      linuxWayland: "Linux (Wayland)",
      linuxX11: "Linux (X11)",
      windows: "Finestre",
    },
    status: {
      idle: "Idle",
      recording: "Registrazione",
      processing: "Lavorazione",
      completed: "Completo",
      error: "Errore",
    },
    actions: {
      start: "Avviare la registrazione",
      stop: "Smettere di registrare",
      toggle: "Toggle Registrazione",
      status: "Controllare lo stato",
    },
    recorderBackends: {
      ffmpegAvfoundation: "FFmpeg (AVFoundation)",
      ffmpegPulse: "FFmpeg (PulseAudio)",
      ffmpegAlsa: "FFmpeg (ALSA)",
      ffmpegDshow: "FFmpeg (DirectShow)",
      wfRecorder: "wf-recorder",
      arecord: "arecord",
    },
    typerBackends: {
      applescript: "AppleScript",
      wtype: "wtype",
      xdotool: "xdotool",
      wlClipboard: "wl-clipboard",
      xclip: "xclip",
      powershell: "PowerShell",
    },
  },
  post: {
    download: "Scarica",
    title: "Discorso a testo",
    titleShort: "Discorso a testo",
    dynamicTitle: "Trascrizione: {{text}}",
    description:
      "Trascrivere l'audio al testo. Caricare un file audio (MP3, WAV, WebM, max 25MB). Costo: al secondo dell'audio alla tariffa del modello scelto (vedi lo strumento dei modelli). Restituisce il testo trascritto, il fornitore utilizzato e il punteggio di fiducia.",
    form: {
      title: "Trascrizione audio",
      description: "Caricare un file audio per trascrivere",
    },
    fileUpload: {
      title: "Caricamento file audio",
      description: "Carica il tuo file audio per la trascrizione",
    },
    audio: {
      label: "File audio",
      description: "File audio da trascrivere (MP3, WAV, WebM, ecc.)",
      validation: {
        maxSize: "La dimensione del file deve essere inferiore a 25MB",
        audioOnly: "Si prega di caricare un file audio o video",
      },
    },
    model: {
      label: "Modello",
      description: "Trascrizione modello",
    },
    provider: {
      label: "Fornitore",
      description: "fornitore AI per trascrizione",
    },
    language: {
      label: "Lingua",
      description: "Lingua dell'audio",
    },
    response: {
      title: "Risultato della trascrizione",
      description: "Il testo trascritto dal tuo audio",
      success: "Operazione riuscita",
      text: "Testo trascritto",
      provider: "Fornitore utilizzato",
      confidence: "Confidenza Score",
      creditCost: "Crediti Usati",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per usare questa funzione",
      },
      validation: {
        title: "Errore di convalida",
        description: "Il file audio o i parametri non sono validi",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a elaborare la trascrizione",
      },
      apiKeyMissing: "La chiave Eden AI API non è configurata",
      transcriptionFailed: "Trascrizione non riuscita: {{error}}",
      noSttProvider: "Nessun fornitore di parole-to-text disponibile",
      unsupportedProvider:
        "provider vocale-to-text non supportato: {{provider}}",
      noSttProviderConfigured:
        "Nessun provider vocale-to-text è configurato. Aggiungi OPENAI_API_KEY, EDEN_AI_API_KEY  o DEEPGRAM_API_KEY, oppure collega un provider di inferenza di sistema.",
      notConfigured:
        "{{label}} non è configurato. Aggiungi {{envKey}} al tuo file.env. Ottieni la tua chiave a {{url}}",
      audioTooShort:
        "Registrazione troppo breve. Tenere il pulsante più a lungo e parlare chiaramente.",
      noAudioFile: "Nessun file audio fornito",
      internalError: "Errore del server interno",
      noPublicId: "Nessun ID pubblico ricevuto",
      pollFailed:
        "Non sono riuscito a verificare i risultati della trascrizione",
      failed: "Trascrizione fallita",
      timeout: "Tempo di trascrizione",
      creditsFailed: "Non è riuscito a dedurre i crediti: {{error}}",
      providerError:
        "Errore di servizio di trascrizione. Si prega di riprovare o contattare il supporto se il problema persiste.",
      balanceCheckFailed:
        "Non è possibile controllare il saldo di credito. Per favore prova di nuovo.",
      insufficientCredits:
        "Non hai abbastanza crediti per questa trascrizione. Si prega di aggiungere più crediti per continuare",
    },
    success: {
      title: "Operazione riuscita",
      description: "Audio trascritto con successo",
      transcriptionComplete: "Trascrizione completata con successo",
      transcribing: "Transcribing...",
    },
  },
  providers: {
    openai: "OpenAI Whisper",
    assemblyai: "AssemblyAI",
    deepgram: "Deepgram",
    google: "Google Speech-to-Text",
    amazon: "Amazon Transcribe",
    microsoft: "Microsoft Azure",
    ibm: "IBM Watson",
    rev: "Rev.ai",
  },
  languages: {
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    es: "Spagnolo",
    sk: "Slovacco",
    hi: "Hindi",
    fr: "Francese",
    it: "Italiano",
  },
  models: {
    descriptions: {
      qwen3Asr:
        "Trascrivi il parlato in 30 lingue e 22 dialetti cinesi con Qwen3 ASR.",
      parakeetV3:
        "Trascrivi 25 lingue europee con rilevamento automatico della lingua e punteggiatura.",
      nemotron35Transcribe:
        "Trascrivi fino a un’ora di audio in 40 lingue con NVIDIA Nemotron.",
      openaiWhisper:
        "OpenAI Whisper - Riconoscimento vocale all'avanguardia per 99 lingue",
      deepgramNova2:
        "Deepgram Nova-2 - Veloce e preciso discorso-to-text con robustezza del rumore",
      whisperLargeV3:
        "Whisper Large V3 - Modello OpenAI a peso aperto, 99 lingue, molto più economico di quello ospitato sussurro-1.",
      voxtralSmall: "Voxtral Small di Mistral trascrive il parlato registrato.",
      voxtralMini:
        "Voxtral Mini Transcribe - Trascrizione Mistral con diarizzazione e timestamp segmenti, fino a 10 minuti.",
      nemotronAsr:
        "Nemotron ASR - NVIDIA riconoscimento vocale multilingue aperto, 40 locali, bassa latenza.",
      gpt4oMiniTranscribe:
        "GPT -4o Mini Transcribe - Tasso di errore di parola inferiore a Whisper, migliore rilevamento della lingua.",
    },
  },
};
