import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  config: {
    folders: {
      private: "Chats privados",
      shared: "Chats compartidos",
      public: "Charlas públicas",
      incognito: "Incognito Chats",
      background: "Temas de fondo",
      remote: "Chates remotos",
    },
  },
  tags: {
    messages: "Mensajes",
  },
  loadingOlderMessages: "Cargando mensajes antiguos...",
  loadingNewerMessages: "Cargando mensajes más recientes...",
  scrollUpForOlderMessages: "Desplazarse para mensajes antiguos",
  showOlderMessages: "Mostrar mensajes más antiguos",
  showNewerMessages: "Mostrar mensajes nuevos",
  transcribing: "Transcribiendo audio...",
  uploadingAttachments: "Carga de archivos...",
  gapFill: {
    transcribingAudio: "Transcribiendo audio...",
    analyzingImage: "Analizando la imagen...",
    describingVideo: "Describiendo video...",
    processingMedia: "Procesando los medios...",
    variantUsing: "via {{model}}",
    variantCost: "{{cost}} créditos",
    transcription: "Transcripción",
    imageDescription: "Descripción de imagen",
    videoDescription: "Descripción del vídeo",
    showTranscription: "Mostrar transcripción",
    hideTranscription: "Ocultar la transcripción",
    showImageDescription: "Mostrar descripción de la imagen",
    hideImageDescription: "Ocultar descripción de la imagen",
    showVideoDescription: "Mostrar la descripción de vídeo",
    hideVideoDescription: "Ocultar descripción de vídeo",
  },
  errorCode: "Código de error",
  errorActions: {
    retry: "Retrocedimiento",
    tryAnotherModel: "Prueba otro modelo",
  },
  streamInterrupted: {
    label: "Se detuvo la generación",
    hint: "Respuesta parcial salvada. Envía un nuevo mensaje para continuar.",
  },
  errorFeedback: {
    autoReported: "Error reportado automáticamente",
    helpFix: "Ayúdanos a arreglar esto.",
    autoContext: "[Informe de error generado por auto]",
    errorLabel: "Error",
    causeLabel: "Causa",
    userContextLabel: "Añadir más contexto aquí (opcional)",
    separator: "·",
  },
  compacting: {
    title: "Historia compactada",
    loading: "Historia compacta...",
    summarizing: "Summarizing conversation...",
    failed: "Fallo de compactación",
  },
  get: {
    title: "Lista de mensajes de pan",
    titleShort: "Mensajes",
    description: "Recuperar todos los mensajes en un hilo de chat",
    container: {
      title: "Mensajes",
      description: "Lista de mensajes de texto",
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo para recuperar mensajes de",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    leafMessageId: {
      label: "Mensaje de la hoja ID",
      description: "Mensaje de hoja de rama actual ID",
    },
    response: {
      title: "Respuesta de mensajes",
      description: "Lista de mensajes en el hilo",
      messages: {
        message: {
          title: "Mensaje",
          id: {
            content: "Mensaje ID",
          },
          threadId: {
            content: "Thread ID",
          },
          role: {
            content: "Función",
          },
          content: {
            content: "Contenido",
          },
          parentId: {
            content: "Mensaje de Padre ID",
          },
          authorId: {
            content: "Autor ID",
          },
          isAI: {
            content: "Es AI",
          },
          model: {
            content: "Modelo",
          },
          skill: {
            content: "Habilidad",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "Secuencia ID",
          },

          toolCalls: {
            content: "Llamadas de herramienta",
          },
          createdAt: {
            content: "Creado en",
          },
          updatedAt: {
            content: "Actualizado en",
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para ver mensajes",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver estos mensajes",
        incognitoNotAllowed:
          "Los hilos de incógnito no se pueden acceder en el servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
        detail: "Error del servidor: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
    success: {
      title: "Operación completada",
      description: "Mensajes recuperados con éxito",
    },
  },
  post: {
    title: "Crear mensaje",
    titleShort: "Crear mensaje",
    description: "Crear un nuevo mensaje en un hilo de chat",
    form: {
      title: "Nuevo mensaje",
      description: "Crear un mensaje en el hilo",
    },
    sections: {
      message: {
        title: "Detalles del mensaje",
        description: "Contenido y configuración del mensaje",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo para añadir mensaje a",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    id: {
      label: "Mensaje ID",
      description: "Mensaje generado por el cliente ID",
    },
    content: {
      label: "Contenido",
      description: "Contenido del mensaje",
      placeholder: "Introduzca el contenido del mensaje...",
    },
    role: {
      label: "Función",
      description: "Función del mensaje (usuario, asistente, sistema)",
    },
    parentId: {
      label: "Mensaje de Padre",
      description: "Mensaje de Padre ID para ramificación",
    },
    model: {
      label: "Modelo",
      description: "Modelo AI para la respuesta",
    },
    skill: {
      label: "Habilidad",
      description: "AI habilidad/persona para el mensaje",
    },
    metadata: {
      label: "Metadatos",
      description: "Metadatos de mensajes (apegos, fichas, etc.)",
    },
    response: {
      title: "Mensaje creado",
      description: "Nuevos detalles del mensaje creado",
      message: {
        title: "Mensaje",
        id: {
          content: "Mensaje ID",
        },
        threadId: {
          content: "Thread ID",
        },
        role: {
          content: "Función",
        },
        content: {
          content: "Contenido",
        },
        parentId: {
          content: "Mensaje de Padre ID",
        },
        createdAt: {
          content: "Creado en",
        },
        updatedAt: {
          content: "Actualizado en",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Datos de mensajes inválidos proporcionados",
        parentNotFound: "Mensaje para padres no encontrado",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para crear mensajes",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para crear mensajes",
        incognitoNotAllowed:
          "Los hilos de incógnito no se pueden acceder en el servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
        detail: "Error del servidor: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
      createFailed: {
        title: "Failed to create message",
        description: "Se produjo un error al crear el mensaje",
      },
    },
    success: {
      title: "Operación completada",
      description: "Mensaje creado con éxito",
    },
  },
  enums: {
    role: {
      user: "Usuario",
      assistant: "Assistant",
    },
  },
  debugView: {
    systemPromptTitle: "Prompt del sistema",
    copied: "¡Copiado!",
    systemMessageHint: "Mensaje del sistema (hidden de los usuarios)",
    systemPromptLabel: "impulso del sistema · plomo · caché",
    upcomingContextLabel: "próximo contexto asistente · último mensaje",
  },
  widget: {
    common: {
      send: "Enviar",
      sending: "Enviando…",
      cancel: "Cancelar",
      close: "Cerrar",
      copyButton: {
        copied: "¡Copiado!",
        copyToClipboard: "Copiado para el portapapeles",
        copyAsMarkdown: "Copiar como Marcador",
        copyAsText: "Copiar como texto llano",
      },
      viewModeToggle: {
        linearView: "Vista lineal",
        threadedView: "Vista desenfrenada",
        flatView: "Vista plana",
        debugView: "Vista de Debug",
      },
      userMessageActions: {
        branch: "Subdivisión",
        retry: "Retrocedimiento",
        deleteMessage: "Borrar el mensaje",
        cancelLoading: "Carga cancelada",
        stopAudio: "Para el audio",
        playAudio: "Reproduce audio (créditos {{cost}})",
      },
      assistantMessageActions: {
        answerAsAI: "Respuesta como AI",
        cancelLoading: "Carga cancelada",
        stopAudio: "Para el audio",
        playAudio: "Reproduce audio (créditos {{cost}})",
        actualCostUsed: "Costo real utilizado",
        credits: "Créditos",
        tokens: "Tokens",
        tokensUsed: "Tokens used",
        inputTokens: "Input",
        outputTokens: "Producto",
        cachedTokens: "Caché",
        cachedPercent: "{{percent}} % caché",
        cachedPercentTitle:
          "{{percent}} % de las fichas de entrada se sirvieron de caché, reduciendo coste",
        cached: "caché",
        pipeline: "Pipeline",
        timeToFirstToken: "{{seconds}} s to first token",
        timeToFirstTokenTitle: "Hora de la primera señal",
        streamingTime: "{{seconds}} s streaming",
        streamingTimeTitle: "Duración total de la transmisión",
        cacheWriteTokens: "Cache escribo",
        cacheWrite: "{{tokens}} escrito a cache",
        cacheWriteTitle:
          "{{tokens}} tokens written to cache this request (billed at cache writing rate)",
        deleteMessage: "Borrar el mensaje",
        upvote: "Subtítulos",
        downvote: "Downvote",
      },
      generatedMediaActions: {
        copy: "Copiar",
        copied: "Copiado",
        download: "Descargar",
        showPrompt: "Mostrar el aviso",
        hidePrompt: "Ocultar el impulso",
      },
    },
    messages: {
      assistant: "Assistant",
      anonymous: "Anónimo",
      you: "Tú.",
      edited: "editado",
      branch: {
        previous: "rama anterior",
        next: "Siguiente rama",
      },
      authorWithId: "{{name}} ({{id}})",
      aiBadge: "IA",
      aiBadgeTitle: "Escrito por un modelo AI, no una persona",
    },
    linearView: {
      answerModal: {
        title: "Respuesta como AI",
        description: "Generar una respuesta AI a este mensaje",
        inputPlaceholder: "Añadir contexto para el AI...",
        confirmLabel: "Generar",
      },
      retryModal: {
        title: "Entrada con diferente modelo",
        description: "Regenerar esta respuesta con un modelo diferente",
        confirmLabel: "Retrocedimiento",
      },
    },
    threadedView: {
      replyModal: {
        title: "Responder",
        description: "Enviar un mensaje en respuesta a este post",
        inputPlaceholder: "Escribe tu respuesta...",
        confirmLabel: "Responder",
      },
      actions: {
        reply: "Responder",
        replyToMessage: "Respuesta a este mensaje",
        branch: "Subdivisión",
        branchMessage: "Editar la rama",
        retry: "Retrocedimiento",
        retryWithDifferent: "Entrada con diferente modelo",
        answerAsAI: "Respuesta como AI",
        generateAIResponse: "Generar respuesta AI",
        cancelLoading: "Carga cancelada",
        stop: "Para.",
        stopAudio: "Para el audio",
        playAudio: "Reproduce audio (créditos {{cost}})",
        delete: "Eliminar",
        deleteMessage: "Borrar el mensaje",
        share: "Compartir",
        copyPermalink: "Copiar Permalink",
        upvote: "Subtítulos",
        downvote: "Downvote",
        play: "Jugar",
        cancel: "Cancelar",
        parent: "Ve con el padre.",
      },
      answerModal: {
        title: "Respuesta como AI",
        description: "Generar una respuesta AI a este mensaje",
        inputPlaceholder: "Añadir contexto para el AI...",
        confirmLabel: "Generar",
      },
      retryModal: {
        title: "Entrada con diferente modelo",
        description: "Regenerar esta respuesta con un modelo diferente",
        confirmLabel: "Retrocedimiento",
      },
      anonymous: "Anónimo",
      assistantFallback: "Assistant",
      userFallback: "Usuario",
      youLabel: "Tú.",
      authorWithId: "{{name}} ({{id}})",
      reply: "respuesta",
      replies: "respuestas",
      expandReplies: "Respuestas",
      collapseReplies: "Respuestas de colapso",
      continueThread: "Continuar el hilo ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "Responder",
        description: "Enviar un mensaje en respuesta a este post",
        inputPlaceholder: "Escribe tu respuesta...",
        confirmLabel: "Responder",
      },
      actions: {
        reply: "Responder",
        replyToMessage: "Respuesta a este mensaje",
        branch: "Subdivisión",
        branchMessage: "Editar la rama",
        retry: "Retrocedimiento",
        retryWithDifferent: "Entrada con diferente modelo",
        answerAsAI: "Respuesta como AI",
        generateAIResponse: "Generar respuesta AI",
        delete: "Eliminar",
        deleteMessage: "Borrar el mensaje",
        copyReference: "Copia de la referencia",
        upvote: "Subtítulos",
        downvote: "Downvote",
      },
      answerModal: {
        title: "Respuesta como AI",
        description: "Generar una respuesta AI a este mensaje",
        inputPlaceholder: "Añadir contexto para el AI...",
        confirmLabel: "Generar",
      },
      retryModal: {
        title: "Entrada con diferente modelo",
        description: "Regenerar esta respuesta con un modelo diferente",
        confirmLabel: "Retrocedimiento",
      },
      anonymous: "Anónimo",
      assistantFallback: "Assistant",
      youLabel: "Tú.",
      replyingTo: "Responder a",
      replies: "Respuestas:",
      clickToCopyRef: "Haga clic para copiar referencia",
      postsById: "{{count}} posts by this ID",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "Mensaje del sistema (hidden de los usuarios)",
    },
    userProfile: {
      recentPosts: "Puestos recientes",
      noPostsYet: "Todavía no hay puestos",
      postCount: "Puestos de {{count}}",
    },
    screenshot: {
      capture: "Captura de pantallas",
      capturing: "Capturing...",
    },
    shareDialog: {
      title: "Compartir hilo",
    },
    messageEditor: {
      titles: {
        branch: "Editar la rama",
        reply: "Responder",
        cancel: "Cancelar",
      },
      hint: {
        branch: "Editar crea una nueva rama",
        reply: "Escribe tu respuesta",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Prensa",
        enter: "Entra",
        shiftEnter: "Shift+Enter",
        forNewLine: "para nueva línea",
      },
    },
    voiceMode: {
      callMode: "Modo de llamada",
      callModeDescription: "AI responderá con voz",
      tapToRecord: "Pulse para grabar",
    },
    batchToolConfirmation: {
      title: "Confirme las llamadas de la herramienta por lotes",
    },
    queue: {
      badge: "Queued",
      cancelTooltip: "Eliminar de la cola y restaurar a la entrada",
    },
  },
  flatView: {
    timestamp: {
      sun: "Sol",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri.",
      sat: "Sat",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
  },
};
