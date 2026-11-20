import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    music: "Música",
    generation: "Generación",
    ai: "IA",
  },
  post: {
    title: "Generar música",
    titleShort: "Generar música",
    dynamicTitle: "Música: {{prompt}}",
    description:
      "Genera música de un mensaje de texto. Utilice la herramienta de modelos con modelType =audio para ver los modelos de música disponibles. Pase el modelo id para seleccionar un modelo específico, o dejar en blanco por defecto del usuario. Opcionalmente pasa inputMediaUrl para la transferencia de estilo audio-a-audio. Devuelve audioUrl y durationSeconds.",
    form: {
      title: "Generación de música",
      description: "Ingrese un impulso para generar música",
    },
    prompt: {
      label: "Prompt",
      description: "Describe la música que quieres generar",
      placeholder: "La música electrónica con una melodía pegajosa...",
    },
    model: {
      label: "Modelo",
      description:
        "Modelo de generación de música id. Deja en blanco por defecto del usuario. Utilice la herramienta de modelos (modelType =audio) para navegar por los modelos disponibles.",
    },
    duration: {
      label: "Duración",
      description: "Longitud del clip de audio generado",
      short: "Corto (~8s)",
      medium: "Medio (~20s)",
      long: "Largo (~30s)",
    },
    inputMediaUrl: {
      label: "Referencia Audio URL",
      description:
        "Audio URL para transferencia de estilo o remix. El modelo utiliza esto como punto de partida. Sólo funciona con modelos que soportan la entrada de audio.",
      placeholder: "https://example.com/audio.mp3",
    },
    download: "Descargar",
    separator: "·",
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      text: "Generar música",
      label: "Generar música",
      loadingText: "Generando...",
    },
    response: {
      audioUrl: "Generado de audio URL",
      creditCost: "Créditos utilizados",
      durationSeconds: "Duración en segundos",
      jobId: "Async job ID",
    },
    errors: {
      referenceUnavailable:
        "El audio de referencia no está disponible. Fue borrado, o pertenece a un chat que no puede abrir. Utilice el audio de este chat o subirlo de nuevo.",
      validation_failed: {
        title: "Error de validación",
        description: "Por favor, compruebe el aviso y la configuración",
      },
      network_error: {
        title: "Error de red",
        description: "Failed to connect to music generation service",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Por favor, ingrese para generar música",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para usar esta característica",
      },
      not_found: {
        title: "No encontrado",
        description: "No se encontró el modelo solicitado",
      },
      server_error: {
        title: "Error del servidor",
        description:
          "Un error inesperado ocurrió durante la generación de música",
      },
      unknown_error: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved_changes: {
        title: "Cambios sin guardar",
        description: "Por favor, guarde sus cambios antes de generar",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la generación de música",
      },
      noModelConfigured:
        "No hay modelo de música configurado. Establece un modelo de música en tu configuración favorita.",
      notAnAudioModel:
        "El modelo seleccionado no admite la generación de música. Por favor, seleccione un modelo de música.",
      notConfigured:
        "{{label}} no está configurado. Añadir {{envKey}} a tu archivo.env. Obtener su llave en {{url}}",
      providerUnsupported: "{{label}} no está soportado todavía",
      insufficientCredits:
        "Créditos insuficientes. Saldo: {{balance}}, mínimo requerido: {{minimum}}.",
      balanceCheckFailed: "Fallado para comprobar su saldo de crédito",
      unsupportedDuration:
        "El modelo {{model}} no soporta la duración {{duration}}. Duración soportada: {{supported}}",
      generationFailed: "La generación de música falló",
      providerError: "Error del proveedor de música: {{error}}",
      noAudioUrl: "No se devolvió el URL de audio del proveedor",
      creditsFailed:
        "Fallado para deducir créditos para la generación de música",
      apiKeyNotConfigured: "La tecla API no está configurada",
      externalServiceError: "Error de servicio externo: {{message}}",
      requestAborted: "La solicitud fue abortada",
      requestTimedOut: "Solicitud de tiempo esperando la generación de música",
      requestFailed: "La solicitud falló: {{message}}",
      pollFailed: "La solicitud de votación falló con el estado {{status}}",
    },
    success: {
      title: "Música generada",
      description: "Tu música ha sido generada con éxito",
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
      LYRIA_3_PRO_PREVIEW: "Lyria 3 Pro Vista previa",
      LYRIA_3_CLIP_PREVIEW: "Lyria 3 Clip Previsualización",
    },
  },
};
