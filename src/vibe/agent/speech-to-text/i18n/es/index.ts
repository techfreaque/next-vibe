/**
 * Speech-to-Text English translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  hotkey: {
    post: {
      title: "Hotkey de voz a téxto",
      titleShort: "STT Hotkey",
      description:
        "Grabar y transcribir audio con inserción automática de texto",
      form: {
        title: "Configuración de teclas calientes",
        description: "Configuración de teclas de voz a texto",
      },
      action: {
        label: "Medida",
        description: "Acción para realizar (iniciar/detener/relazar)",
      },
      provider: {
        label: "Proveedor",
        description: "AI proveedor de transcripción",
      },
      language: {
        label: "Idioma",
        description: "Idioma del audio",
      },
      insertPrefix: {
        label: "Insertar prefijo",
        description: "Texto para insertar antes de la transcripción",
        placeholder: "por ejemplo, 'conocido'",
      },
      insertSuffix: {
        label: "Insertar Suffix",
        description: "Texto para insertar después de la transcripción",
        placeholder: "Por ejemplo, '",
      },
      response: {
        title: "Resultado",
        description: "Resultado de grabación y transcripción",
        success: "Operación completada",
        status: "Situación",
        message: "Mensaje",
        text: "Texto transcrito",
        recordingDuration: "Duración de grabación (ms)",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes iniciar sesión para usar esta función",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado en el proceso de grabación",
        },
        conflict: {
          title: "Conflicto",
          description: "Grabación ya en curso",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para usar esta característica",
        },
        network: {
          title: "Error de red",
          description: "No conectado al servicio de transcripción",
        },
        notFound: {
          title: "No encontrado",
          description: "Período de sesiones no encontrado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Grabación en curso",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        dependenciesMissing:
          "No se dispone de dependencias necesarias: {{missing}}. {{recommendations}}",
        invalidAction: "Acción inválida: {{action}}",
        noActionProvided: "No se han adoptado medidas",
        actionFailed: "Failed to perform action: {{error}}",
        alreadyRecording: "Grabación ya en curso",
        notRecording: "No hay registro en curso",
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
    tags: {
      ai: "IA",
      transcription: "Transcripción",
      speech: "Discurso",
      hotkey: "Hotkey",
      cli: "CLI",
    },
    platforms: {
      macos: "macOS",
      linuxWayland: "Linux (Wayland)",
      linuxX11: "Linux (X11)",
      windows: "Ventanas",
    },
    status: {
      idle: "Idle",
      recording: "Grabación",
      processing: "Procesamiento",
      completed: "Completado",
      error: "Error",
    },
    actions: {
      start: "Inicio Grabación",
      stop: "Deja de grabar",
      toggle: "Toggle Recording",
      status: "Estado de control",
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
    download: "Descargar",
    title: "Discurso al texto",
    titleShort: "Discurso al texto",
    dynamicTitle: "Transcripción: {{text}}",
    description:
      "Transcribe audio al texto. Subir un archivo de audio (MP3, WAV, WebM, max 25MB). Costo: por segundo de audio a la propia tarifa del modelo elegido (ver la herramienta de modelos). Devuelve el texto transcrito, el proveedor utilizado y la puntuación de confianza.",
    form: {
      title: "Traducción de audio",
      description: "Subir un archivo de audio para transcribe",
    },
    fileUpload: {
      title: "Archivo de audio Subir",
      description: "Cargue su archivo de audio para la transcripción",
    },
    audio: {
      label: "Archivo de audio",
      description: "Archivo de audio para transcribe (MP3, WAV, WebM, etc.)",
      validation: {
        maxSize: "El tamaño del archivo debe ser inferior a 25MB",
        audioOnly: "Por favor, suba un archivo de audio o vídeo",
      },
    },
    model: {
      label: "Modelo",
      description: "Modelo de transcripción",
    },
    provider: {
      label: "Proveedor",
      description: "AI proveedor de transcripción",
    },
    language: {
      label: "Idioma",
      description: "Idioma del audio",
    },
    response: {
      title: "Transcripción Resultado",
      description: "El texto transcrito de su audio",
      success: "Operación completada",
      text: "Texto transcrito",
      provider: "Proveedor utilizado",
      confidence: "Resultado de confianza",
      creditCost: "Créditos utilizados",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes iniciar sesión para usar esta función",
      },
      validation: {
        title: "Error de validación",
        description: "El archivo de audio o los parámetros son inválidos",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para procesar la transcripción",
      },
      apiKeyMissing: "Eden AI API key no está configurado",
      transcriptionFailed: "La transcripción falló: {{error}}",
      noSttProvider: "No hay proveedor de habla a texto disponible",
      unsupportedProvider:
        "Proveedor sin apoyo del habla a texto: {{provider}}",
      noSttProviderConfigured:
        "No se configura ningún proveedor de habla a texto. Agregue OPENAI_API_KEY, EDEN_AI_API_KEY, o DEEPGRAM_API_KEY, o conecte un proveedor de inferencia del sistema.",
      notConfigured:
        "{{label}} no está configurado. Añadir {{envKey}} a tu archivo.env. Obtener su llave en {{url}}",
      audioTooShort:
        "Grabando demasiado corto. Mantenga el botón más largo y hable con claridad.",
      noAudioFile: "No se proporciona ningún archivo de audio",
      internalError: "Error del servidor interno",
      noPublicId: "No public ID received",
      pollFailed: "Failed to poll transcription results",
      failed: "La transcripción falló",
      timeout: "Hora de la transcripción",
      creditsFailed: "Fallado para deducir créditos: {{error}}",
      providerError:
        "Error del servicio de transcripción. Por favor, intente de nuevo o contacte con soporte si el problema persiste.",
      balanceCheckFailed:
        "Incapaz de comprobar su saldo de crédito. Por favor, inténtelo de nuevo.",
      insufficientCredits:
        "No tienes suficientes créditos para esta transcripción. Por favor, añada más créditos para continuar",
    },
    success: {
      title: "Operación completada",
      description: "Audio transcrito con éxito",
      transcriptionComplete: "Transcripción completada con éxito",
      transcribing: "Transcribiendo...",
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
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    es: "Español",
    fr: "Francés",
    it: "Italiano",
  },
  models: {
    descriptions: {
      openaiWhisper:
        "OpenAI Whisper - Reconocimiento de discursos de última generación para 99 idiomas",
      deepgramNova2:
        "Deepgram Nova-2 - El discurso a texto rápido y preciso con robustez de ruido",
      whisperLargeV3:
        "Whisper Large V3 - Modelo OpenAI de peso abierto, 99 idiomas, mucho más barato que los susurros anfitriones-1.",
      voxtralSmall: "Voxtral Small de Mistral transcribe grabaciones de voz.",
      voxtralMini:
        "Transcribe Voxtral Mini - transcripción Mistral con diarización y horarios de segmento, hasta 10 minutos.",
      nemotronAsr:
        "Nemotron ASR - NVIDIA reconocimiento multilingüe de discurso abierto, 40 locales, baja latencia.",
      gpt4oMiniTranscribe:
        "GPT -4o Mini Transcribe - Tasa de error de palabras más baja que Whisper, mejor detección de idiomas.",
    },
  },
};
