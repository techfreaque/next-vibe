import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  hotkey: {
    post: {
      title: "Raccourci de dictée vocale",
      titleShort: "Raccourci dictée",
      description:
        "Enregistrez et transcrivez l'audio, le texte s'insère automatiquement",
      form: {
        title: "Configuration du raccourci",
        description: "Configurez le raccourci de dictée vocale",
      },
      action: {
        label: "Action",
        description: "Action à exécuter (start/stop/toggle)",
      },
      provider: {
        label: "Fournisseur",
        description: "Fournisseur d'IA pour la transcription",
      },
      language: {
        label: "Langue",
        description: "Langue de l'audio",
      },
      insertPrefix: {
        label: "Préfixe à insérer",
        description: "Texte inséré avant la transcription",
        placeholder: "ex. '> '",
      },
      insertSuffix: {
        label: "Suffixe à insérer",
        description: "Texte inséré après la transcription",
        placeholder: "ex. ' '",
      },
      response: {
        title: "Résultat",
        description: "Résultat de l'enregistrement et de la transcription",
        success: "Succès",
        status: "Statut",
        message: "Message",
        text: "Texte transcrit",
        recordingDuration: "Durée d'enregistrement (ms)",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Connectez-vous pour utiliser cette fonction",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête non valides",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de traiter l'enregistrement",
        },
        conflict: {
          title: "Conflit",
          description: "Un enregistrement est déjà en cours",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation d'utiliser cette fonction",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le service de transcription",
        },
        notFound: {
          title: "Introuvable",
          description: "Session introuvable",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Enregistrement en cours",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        dependenciesMissing:
          "Dépendances requises indisponibles : {{missing}}. {{recommendations}}",
        invalidAction: "Action non valide : {{action}}",
        noActionProvided: "Aucune action fournie",
        actionFailed: "Échec de l'action : {{error}}",
        alreadyRecording: "Un enregistrement est déjà en cours",
        notRecording: "Aucun enregistrement en cours",
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
    tags: {
      ai: "IA",
      transcription: "Transcription",
      speech: "Voix",
      hotkey: "Raccourci",
      cli: "CLI",
    },
    platforms: {
      macos: "macOS",
      linuxWayland: "Linux (Wayland)",
      linuxX11: "Linux (X11)",
      windows: "Windows",
    },
    status: {
      idle: "Inactif",
      recording: "Enregistrement",
      processing: "Traitement",
      completed: "Terminé",
      error: "Erreur",
    },
    actions: {
      start: "Démarrer l'enregistrement",
      stop: "Arrêter l'enregistrement",
      toggle: "Basculer l'enregistrement",
      status: "Vérifier le statut",
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
    download: "Télécharger",
    title: "Transcription audio",
    titleShort: "Transcription",
    dynamicTitle: "Transcription : {{text}}",
    description:
      "Transcrit de l'audio en texte. Envoyez un fichier audio (MP3, WAV, WebM, 25 Mo max.). Coût : par seconde d'audio, au tarif propre au modèle choisi (voir l'outil models). Renvoie le texte transcrit, le fournisseur utilisé et un score de confiance.",
    form: {
      title: "Transcription audio",
      description: "Envoyez un fichier audio à transcrire",
    },
    fileUpload: {
      title: "Envoi du fichier audio",
      description: "Envoyez votre fichier audio pour la transcription",
    },
    audio: {
      label: "Fichier audio",
      description: "Fichier audio à transcrire (MP3, WAV, WebM, etc.)",
      validation: {
        maxSize: "Le fichier doit faire moins de 25 Mo",
        audioOnly: "Envoyez un fichier audio ou vidéo",
      },
    },
    model: {
      label: "Modèle",
      description: "Modèle de transcription",
    },
    provider: {
      label: "Fournisseur",
      description: "Fournisseur d'IA pour la transcription",
    },
    language: {
      label: "Langue",
      description: "Langue de l'audio",
    },
    response: {
      title: "Résultat de la transcription",
      description: "Le texte transcrit de votre audio",
      success: "Succès",
      text: "Texte transcrit",
      provider: "Fournisseur utilisé",
      confidence: "Score de confiance",
      creditCost: "Crédits utilisés",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour utiliser cette fonction",
      },
      validation: {
        title: "Erreur de validation",
        description: "Le fichier audio ou les paramètres ne sont pas valides",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de traiter la transcription",
      },
      apiKeyMissing: "Clé API Eden AI non configurée",
      transcriptionFailed: "Échec de la transcription : {{error}}",
      noSttProvider: "Aucun fournisseur de transcription disponible",
      unsupportedProvider:
        "Fournisseur de transcription non pris en charge : {{provider}}",
      noSttProviderConfigured:
        "Aucun fournisseur de transcription configuré. Ajoutez OPENAI_API_KEY, EDEN_AI_API_KEY ou DEEPGRAM_API_KEY, ou connectez un fournisseur d'inférence système.",
      notConfigured:
        "{{label}} n'est pas configuré. Ajoutez {{envKey}} à votre fichier .env. Obtenez votre clé sur {{url}}",
      audioTooShort:
        "Enregistrement trop court. Maintenez le bouton plus longtemps et parlez distinctement.",
      noAudioFile: "Aucun fichier audio fourni",
      internalError: "Erreur interne du serveur",
      noPublicId: "Aucun identifiant public reçu",
      pollFailed: "Impossible de récupérer les résultats de la transcription",
      failed: "Échec de la transcription",
      timeout: "Délai de transcription dépassé",
      creditsFailed: "Échec du débit des crédits : {{error}}",
      providerError:
        "Erreur du service de transcription. Réessayez ou contactez le support si le problème persiste.",
      balanceCheckFailed:
        "Impossible de vérifier votre solde de crédits. Réessayez",
      insufficientCredits:
        "Crédits insuffisants pour cette transcription. Ajoutez des crédits pour continuer",
    },
    success: {
      title: "Succès",
      description: "Audio transcrit",
      transcriptionComplete: "Transcription terminée",
      transcribing: "Transcription…",
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
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    es: "Espagnol",
    fr: "Français",
    it: "Italien",
  },
  models: {
    descriptions: {
      openaiWhisper:
        "OpenAI Whisper : reconnaissance vocale de pointe en 99 langues",
      deepgramNova2:
        "Deepgram Nova-2 : transcription rapide et précise, résistante au bruit",
      whisperLargeV3:
        "Whisper Large V3 : modèle open-weight d'OpenAI, 99 langues, bien moins cher que whisper-1 hébergé.",
      voxtralSmall: "Voxtral Small de Mistral transcrit la parole enregistrée.",
      voxtralMini:
        "Voxtral Mini Transcribe : transcription Mistral avec identification des locuteurs et horodatage par segment, jusqu'à 10 minutes.",
      nemotronAsr:
        "Nemotron ASR : reconnaissance vocale multilingue ouverte de NVIDIA, 40 variantes linguistiques, faible latence.",
      gpt4oMiniTranscribe:
        "GPT-4o Mini Transcribe : moins d'erreurs de mots que Whisper, meilleure détection de la langue.",
    },
  },
};

export default translations;
