// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/es";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "IA",
  },

  run: {
    task: {
      name: "AI Heartbeat",
      description:
        "Antecedentes Agente AI que controla la salud del sistema, trabaja a través de tareas y contacta al ser humano cuando sea necesario",
    },
    post: {
      title: "Corre AI Agente",
      titleShort: "Agente",
      dynamicTitle: "AI Run {{suffix}} : {{prompt}}",
      description:
        "Delegar una tarea a un agente especialista AI y devolver su respuesta. Para crear o editar habilidades AI/personas, siempre delegar a habilidad='skill-creator' - nunca lo intentes tú mismo. Pasar habilidad + impulso; el agente maneja todo lo demás. Créditos consumidos según modelo.",
      container: {
        title: "AI Agente Run",
        description: "Configure pre-calls and prompt for headless AI execution",
      },
      fields: {
        favoriteId: {
          label: "ID favorito",
          description:
            "Golpe de un favorito salvado (por ejemplo, 'thea-cheap'). No es una perspicacia de habilidad: utilizar el campo de habilidad para eso. Carga de habilidad, modelo y configuración de herramientas en un solo disparo. Prioridad cuando múltiples conjuntos: modelo  ⁇  favoriteId √® habilidad.",
          placeholder: "thea-cheap",
        },
        model: {
          label: "Modelo (sólo CLI)",
          description:
            "Anule el LLM directamente. CLI sólo. otras plataformas utilizan favoriteId o habilidad en su lugar. Rápido: claude-haiku-4.5, gemini-2.5-flash. Equilibrado: claude-sonnet-4.6, gpt-5. Potente: claude-opus-4.7. Gratis: qwen3_235b-free.",
        },
        skill: {
          label: "Habilidad",
          description:
            "Boca de piel (por ejemplo, 'thea', ' thea__cheap-smart'). No es un slug favorito. use favoriteId para eso. Define el impulso de AI persona y sistema. Use 'skill-creator' para crear/editar habilidades.",
          placeholder: "predeterminado",
        },
        prompt: {
          label: "Prompt",
          description:
            "La instrucción o pregunta principal para el AI. Sea específico - el AI utilizará los resultados de preCalls como contexto si se proporciona.",
          placeholder: "Ingrese su mensaje...",
        },
        instructions: {
          label: "Instrucciones del sistema extra",
          description:
            "Instrucciones adicionales opcionales anexadas al sistema. Usar para limitar el formato, tono o longitud de salida (por ejemplo: 'Sé conciso. JSON solamente.').",
          placeholder: "Sé conciso. Un párrafo máx.",
        },
        preCalls: {
          label: "Pre-Calles",
          description:
            "La herramienta llama a ejecutar antes del aviso. Los resultados se inyectan como contexto. Utilice la herramienta-ayuda para descubrir las herramientas disponibles y sus args.",
          routeId: {
            label: "Herramienta ID",
            description:
              "Alias o nombre completo de la herramienta para llamar (por ejemplo, 'web-search', ' agent_skills_GET '). Utilice la herramienta-ayuda para descubrir herramientas.",
            placeholder: "web-search",
          },
          args: {
            label: "Argumentos",
            description:
              'Args plano de valor clave para la herramienta - fusionar urlPathParams y campos corporales en un solo objeto (por ejemplo, {"query": "noticias más recientes", " maxResults ": 5}).',
          },
        },
        availableTools: {
          label: "Permitido a ejecutar",
          description:
            "Herramientas para esta ejecución. [] = texto solamente: sin herramientas, el modelo acaba de escribir (utilizarlo para la redacción). Omitir usar la habilidad o las herramientas favoritas. Todavía no se aplican otras listas.",
          toolId: {
            label: "Herramienta ID",
            description:
              "Instrumental alias o nombre completo (por ejemplo, 'ejecute-tool', 'tool-help', 'web-search')",
          },
          requiresConfirmation: {
            label: "Requiere confirmación",
            description:
              "Pausa para la confirmación del usuario antes de ejecutar esta herramienta",
          },
        },
        pinnedTools: {
          label: "En Contexto (el modelo ve estos)",
          description:
            "Herramientas cargadas en contexto modelo. null = conjunto predeterminado del usuario. Sólo afecta lo que el modelo ve, no lo que puede ejecutar.",
          toolId: {
            label: "Herramienta ID",
            description:
              "Instrumental alias o nombre completo para cargar en contexto",
          },
          requiresConfirmation: {
            label: "Requiere confirmación",
            description:
              "Si esta herramienta requiere confirmación del usuario antes de la ejecución",
          },
        },
        maxTurns: {
          label: "Max Turns",
          description:
            "Máximas curvas de agente (ciclos de peaje) antes de parar. Default: ilimitado. Set a 1 para una sola respuesta rápida sin llamadas de herramienta.",
        },
        appendThreadId: {
          label: "Thread ID (continue)",
          description:
            "UUID de un hilo existente para continuar. El nuevo mensaje se adjunta a esa conversación. Omitir para empezar un hilo nuevo.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "Carpeta de almacenamiento",
          description:
            "Donde guardar el hilo. Antecedentes = todas las carreras automatizadas (Dreamer, Autopilot, tareas programadas). Privado = su carpeta. Compartido = equipo. Incognito = sin almacenamiento.",
          placeholder: "background",
          options: {
            background: "Antecedentes",
            private: "Privadas",
            shared: "Compartida",
            public: "Público",
            incognito: "Incognito (sin almacenamiento)",
          },
        },
        subFolderId: {
          label: "Subcarpeta ID",
          description:
            "UUID opcional de una subcarpeta dentro de la carpeta raíz. Para la organización manual sólo - haga NOT pasar esto al llamar ai-run programáticamente o de herramientas AI. Dejar vacío en todos los contextos automatizados/agentes.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        excludeMemories: {
          label: "Excluir memorias",
          description:
            "Saltar inyectando recuerdos almacenados en contexto. Uso para bots públicos o tareas aisladas. Falso.",
        },
      },
      response: {
        text: "El texto de respuesta de AI (impuestos por etiquetas de pensamiento). Null si el modelo no produce salida.",
        promptTokens: "Prompt tokens consumption (input cost)",
        completionTokens: "Tokens de terminación generadas (gasto de salida)",
        creditCost:
          "Créditos cobrados por esta carrera. Null for incognito runs.",
        threadId:
          "Thread UUID donde se almacenaba la carrera. Null si rootFolderId era 'incognito'. Utilice esto para continuar la conversación a través de appendThreadId.",
        lastAiMessageId:
          "UUID del mensaje final de asistente. Útil para ramificar o hacer referencia a la respuesta.",
        threadTitle: "Título autogenerado para este hilo",
        threadCreatedAt: "Thread timetamp de creación (ISO 8601)",
        preCallResults: {
          title: "Resultados de llamadas previas",
          routeId: "Herramienta que se llamaba",
          succeeded: "Si la llamada tuvo éxito",
          errorMessage: "Mensaje de error si la llamada falló",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros inválidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        notFound: {
          title: "No encontrado",
          description: "Ruta o recurso no encontrado",
        },
        internal: {
          title: "Error del servidor",
          description: "Error del servidor interno durante la ejecución de AI",
        },
        network: {
          title: "Error de red",
          description: "Error de red durante la ejecución de AI",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Cambios sin salvaguardar conflictos",
        },
        conflict: {
          title: "Conflicto",
          description: "Hay un conflicto entre los datos",
        },
      },
      requireFavOrSkill:
        "Proveer por lo menos uno de: favoriteId, habilidad o modelo (CLI solamente). No puede funcionar sin un modelo y habilidad resolvable.",
      skillNotFound:
        "Habilidad ' {{skill}}' no se encuentra. Si esto es un slug favorito (por ejemplo, 'thea-cheap'), use -- favoriteId en lugar de --skill.",
      success: {
        title: "AI Run Complete",
        description: "El agente AI completó con éxito",
      },
      backButton: {
        label: "Atrás",
      },
    },
  },
  route: {
    debug: {
      userObject: "AI Stream Route: objeto de usuario",
      extracted: "AI Stream Route: Valores extraídos",
    },
    errors: {
      invalidJson: "JSON inválido en el cuerpo de solicitud",
      invalidRequestData: "Datos de solicitud inválidos ({{issue}})",
      modelAdminOnly:
        "{{model}} no está disponible en su cuenta. Escoge otro modelo.",
      threadPostForbidden:
        "No hay derechos de publicación en este hilo. Empieza una nueva charla para seguir adelante.",
      fileTypeNotAllowed: "Tipo de archivo no se admite: {{fileType}}",
      uncensoredApiKeyMissing: "Uncensored.ai API key no configurado",
      openrouterApiKeyMissing: "OpenRouter API key no configurado",
      streamCreationFailed:
        "No se conecta al servicio AI. Por favor, inténtalo de nuevo.",
      unknownError: "Se produjo un error",
      creditValidationFailed: "No se ha validado el saldo de crédito",
      noIdentifier: "No se proporciona ningún identificador de usuario o plomo",
      insufficientCredits:
        "Créditos insuficientes. La solicitud cuesta {{cost}} y tu saldo es {{balance}}. Recarga o elige un modelo más económico.",
      noResponseBody: "No response body received from stream",
      authenticationRequired:
        "Por favor inicie sesión para usar carpetas persistentes. Utilice el modo incógnito para chats anónimos.",
    },
  },
  post: {
    title: "AI Stream Chat",
    titleShort: "AI Chat",
    description:
      "Stream AI - respuestas de chat propulsadas usando cualquier modelo de chat (Claude, GPT, Gemini, Llama, y más). Soporta texto, voz, archivos adjuntos y uso de herramientas agentes.",
    form: {
      title: "Configuración de chat AI",
      description: "Configurar los parámetros y mensajes de chat AI",
    },
    operation: {
      label: "Operación",
      description: "Tipo de operación del mensaje para realizar",
      options: {
        send: "Enviar mensaje",
        retry: "Mensaje de entrada",
        edit: "Editar mensaje",
        answerAsAi: "Respuesta como AI",
      },
    },
    rootFolderId: {
      label: "Root Folder",
      description: "contexto de carpeta raíz para el mensaje",
      options: {
        private: "Privadas",
        shared: "Compartida",
        public: "Público",
        incognito: "Incognito (sin almacenamiento)",
        background: "Antecedentes",
      },
    },
    subFolderId: {
      label: "Subcarpeta",
      description: "Subcarpeta opcional dentro de la carpeta raíz",
    },
    threadId: {
      label: "Thread ID",
      description:
        "UUID del hilo para enviar este mensaje a. Debe ser un UUID válido - crear un hilo primero si usted no tiene uno.",
    },
    userMessageId: {
      label: "Mensaje de usuario ID",
      description: "Mensaje de usuario generado por el cliente ID",
    },
    parentMessageId: {
      label: "Mensaje de Padre ID",
      description: "Mensaje de Padre ID para ramificación / lectura",
    },
    leafMessageId: {
      label: "Mensaje de la hoja ID",
      description:
        "Mensaje de hoja de rama actual ID - pistas rama activa sin confiar en URL",
    },
    incognitoThreadTitle: {
      label: "Incognito Thread Title",
      description:
        "Título actual del hilo incognito - enviado por el cliente porque los hilos incognito no tienen fila de servidor",
    },
    incognitoThreadDescription: {
      label: "Descripción del pan de incógnito",
      description: "Descripción actual del hilo de incógnito",
    },
    messageHistory: {
      label: "Historia del mensaje",
      description: "Historial del mensaje opcional para el modo incógnito",
      item: {
        title: "Mensaje",
        description: "Mensaje de chat en la historia",
        role: {
          label: "Función",
        },
        content: {
          label: "Contenido",
        },
        metadata: {
          toolCall: {
            toolName: {
              label: "Nombre de la herramienta",
            },
            args: {
              label: "Argumentos de herramientas",
            },
            result: {
              label: "Resultado de la herramienta",
            },
            error: {
              label: "Error de la herramienta",
            },
            executionTime: {
              label: "Tiempo de ejecución (ms)",
            },
            creditsUsed: {
              label: "Créditos utilizados",
            },
          },
        },
      },
    },
    content: {
      label: "Contenido del mensaje",
      description: "Contenido del mensaje para enviar",
      placeholder: "Escriba su mensaje...",
    },
    role: {
      label: "Función",
      description: "Función del remitente de mensajes",
      options: {
        user: "Usuario",
        assistant: "Assistant",
        system: "Sistema",
        tool: "Herencia",
        error: "Error",
      },
    },
    model: {
      label: "Modelo",
      description: "Modelo AI para uso para generación",
    },
    skill: {
      label: "Habilidad",
      description:
        'Habilidad id o slug de la lista de habilidades (opcionalmente slug__variant). Omitir o usar "default" para ninguno. Los ids desconocidos retroceden al predeterminado.',
    },
    systemPrompt: {
      label: "Prompt del sistema",
      description: "Instrucciones del sistema opcional",
      placeholder: "Ingrese el sistema rápido...",
      now: "Ahora",
      minutesAgo: "{{minutes}} m ago",
      hoursAgo: "{{hours}} h hace mucho",
      daysAgo: "{{days}} d hace tiempo",
    },
    enableSearch: {
      label: "Enable Web Search",
      description: "Permitir que AI busque la web para información actual",
    },
    timezone: {
      label: "Zona horaria",
      description: "Zona de tiempo del usuario para los tempogramas de caché",
    },
    imageSize: {
      label: "Tamaño de la imagen",
      description:
        "Tamaño de la imagen generada (por ejemplo cuadrado, paisaje, retrato)",
    },
    imageQuality: {
      label: "Calidad de imagen",
      description: "Ajuste de calidad para la imagen generada (estándar o hd)",
    },
    musicDuration: {
      label: "Duración de la música",
      description: "Duración del clip de audio generado",
    },
    favoriteConfig: {
      label: "Config favorito",
      description:
        "Configuración completa de Active Favoritos - selecciones de modelos, configuración de herramientas, configuración de contexto. null = no activo favorito, use predeterminados de habilidad/sistema.",
    },
    enabledToolIds: {
      label: "IDs de herramientas habilitadas",
      description:
        "Lista de ID de herramienta AI para habilitar para esta conversación",
    },
    toolConfirmation: {
      label: "Confirmación de la herramienta",
      description: "Respuesta de confirmación de la herramienta del usuario",
      success: "Confirmación de la herramienta procesada con éxito",
      messageId: {
        label: "Mensaje ID",
        description: "ID del mensaje que contiene la llamada de herramienta",
      },
      confirmed: {
        label: "Confirmado",
        description:
          "Ya sea que el usuario haya confirmado la ejecución de la herramienta",
      },
      updatedArgs: {
        label: "Argumentos actualizados",
        description:
          "Discusiones opcionales actualizadas para la llamada herramienta",
      },
      errors: {
        messageNotFound: "Mensaje de la herramienta no encontrado",
        toolCallMissing: "Metadatos de ToolCall desaparecidos",
        toolNotFound: "Herramienta no encontrada",
      },
    },
    resumeToken: {
      label: "Resumen Token",
      description: "Token for resuming interrupted streams",
    },
    voiceMode: {
      label: "Modo de voz",
      description: "Configuración para la interacción basada en voz",
      enabled: {
        label: "Activar el modo de voz",
        description: "Permitir la interacción con voz con texto a voz",
      },
      voice: {
        label: "Voz",
        description:
          'Seleccione el tipo de voz para texto a palabra. Pase "voces. MALE" para una voz masculina o "voces. FEMALE " (default) para una voz femenina.',
        male: "Voz masculina",
        female: "Voz femenina",
      },
    },
    audioInput: {
      title: "Entrada de audio",
      description: "Cargue el archivo de audio para el modo de voz a voz",
      file: {
        label: "Archivo de audio",
        description: "Archivo de audio para transcripción y proceso",
      },
    },
    attachments: {
      label: "Ficheros",
      description: "Archivos adjuntos al mensaje (imagenes, documentos, etc.)",
    },
    executionContext: {
      label: "Ejecución Context",
      description:
        "Cómo se ejecuta este flujo: relé local, remoto o inference-provider. Las solicitudes normales de chat usan local (default).",
    },
    response: {
      title: "Respuesta a la situación",
      description: "AI -generated streaming response",
      success: "Corriente terminada con éxito",
      messageId: "Mensaje ID",
      threadId: "Thread ID",
      totalTokens: "Total de fichas utilizadas",
      finishReason: "Razón de conclusión",
      lastAiMessageContent: "Contenido final del mensaje AI",
      lastGeneratedMediaUrl: "Generado en medios URL",
      totalCreditsDeducted: "Créditos deducidos",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para la transmisión AI",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud inválidos proporcionados",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Error de la red ocurrió mientras se streaming",
      },
      serviceUnavailable: {
        title: "Caso remoto no disponible",
        description:
          "La instancia conectada de este hilo depende no se puede alcanzar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "El acceso a la transmisión AI está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "AI streaming endpoint no encontrado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description:
          "Hay cambios sin salvar que necesitan ser salvados primero",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos ocurrido durante la transmisión",
      },
    },
    success: {
      title: "Operación completada",
      description: "Flujo AI generado con éxito",
    },
  },
  enums: {
    role: {
      user: "Usuario",
      assistant: "Assistant",
      system: "Sistema",
    },
  },
  streamingErrors: {
    aiStream: {
      error: {
        apiKey: {
          missing: "OpenAI API clave falta",
          invalid: "OpenAI API clave es inválida",
        },
        configuration: "Error de configuración de secuenciación AI",
        processing: "Procesamiento de error AI streaming",
      },
    },
  },
  debugView: {
    systemPromptTitle: "Prompt del sistema",
    copied: "¡Copiado!",
  },
  errorTypes: {
    streamError: "Error de transmisión",
  },
  errorThread: {
    title: "Error",
  },
  error: {
    title: "Error de transmisión",
  },
  info: {
    streamInterrupted:
      "Se detuvo la generación. Se ha salvado la respuesta parcial.",
    billingFailed:
      "Parada: no podíamos cobrar créditos para esta respuesta. Nada se perdió - enviar su mensaje de nuevo en un momento.",
    budgetExceeded:
      "Detenido: esta tarea de fondo alcanzó su límite de crédito. Aumente la tapa en los Caps de Presupuesto de Tareas para permitir que continúe.",
    taskWatchdog:
      "Se detuvo: el reloj de tarea terminó esta carrera porque superó su tiempo, su turno o límite de llamada de herramientas.",
    streamTimeLimit:
      "Detenido: esta respuesta alcanzó el límite de {{minutes}} minutos. Todo lo escrito hasta ahora está guardado. Pulsa Continuar para seguir desde ahí.",
  },
  errors: {
    toolExecutionError:
      "Una herramienta no se ejecutó correctamente. Por favor, inténtalo de nuevo.",
    toolExecutionErrorDetail: "Error de la herramienta: {{error}}",
    toolExecutionFailed:
      "La ejecución de la herramienta falló. Por favor, inténtalo de nuevo.",
    toolDisabledByUser:
      "Esta herramienta ha sido deshabilitada por el usuario. No intentes volver a llamarlo.",
    userDeclinedTool: "La ejecución de la herramienta fue cancelada.",
    streamError:
      "La respuesta de AI no pudo completarse. Por favor, inténtalo de nuevo.",
    pendingToolCall:
      "Una herramienta sigue funcionando en el fondo. Por favor, espere a que se complete antes de continuar.",
    streamProcessingError:
      "Falló en procesar la respuesta AI. Por favor, inténtalo de nuevo.",
    timeout:
      "El AI tomó demasiado tiempo para responder (tiempo después de los segundos del {{maxDuration}}). Por favor, intente de nuevo con un mensaje más corto.",
    noResponse: "El AI no generó una respuesta. Por favor, inténtalo de nuevo.",
    creditBudgetReached:
      "Se agotaron los créditos. La respuesta se interrumpió cuando se agotó el saldo. Recarga para continuar.",
    emptyAnswer:
      "El modelo terminó sin escribir una respuesta. Usted pagó sólo lo que el proveedor cobraba, sin cuota de plataforma. Prueba de nuevo o elige otro modelo.",
    contentFiltered:
      "Esta respuesta fue bloqueada por el filtro de contenido del proveedor. Pruebe un modelo diferente.",
    imageTooLarge:
      "La imagen supera el límite de tamaño del modelo. Reduce su tamaño y vuelve a enviarla.",
    malformedToolCall:
      "El modelo envió una llamada a herramienta defectuosa y no se ejecutó. Pulsa Continuar y lo volverá a intentar.",
    providerBusy:
      "Este modelo está sobrecargado ahora mismo. Reinténtalo en unos segundos o elige otro modelo.",
    modelUnavailable:
      "El modelo AI seleccionado no está disponible actualmente. Por favor, prueba un modelo diferente.",
    rateLimitExceeded:
      "Demasiados pedidos. Por favor, espere un momento y vuelva a intentarlo.",
    insufficientCredits:
      "No hay suficientes créditos para completar esta solicitud.",
    connectionFailed:
      "No se conecta al servicio AI. Por favor, compruebe su conexión e inténtelo de nuevo.",
    invalidRequest:
      "Solicitud inválida. Por favor, compruebe su entrada e inténtelo de nuevo.",
    compactingStreamError:
      "Límite de contexto alcanzado - su conversación es demasiado larga para la compactación automática. Pruebe ramificar desde un mensaje anterior, cambiar a un modelo con una ventana de contexto más grande, o ajustar la ventana contextual en su configuración favorita.",
    compactingStreamErrorExpensive:
      "Límite de contexto alcanzado (tokens {{tokens}}). Ampliar la ventana contextual es posible pero puede ser caro. Pruebe ramificar desde un mensaje anterior o cambiar modelos primero.",
    compactingException:
      "Falló en la historia de la conversación compacta. Pruebe ramificar desde un punto anterior en la conversación o cambiar a otro modelo.",
    compactingRebuildFailed:
      "Falló para reconstruir la conversación después de compactar. Intente ramificarse de un mensaje anterior.",
    unexpectedError:
      "Se produjo un error inesperado: {{error}}. Por favor, inténtalo de nuevo.",
  },
  headless: {
    errors: {
      // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
      // Either pass model+skill directly, or pass favoriteId pointing to a favorite
      // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
      missingModelOrSkill:
        "modelo o habilidad requerida - pasar uno directamente o proporcionar un favoriteId con una selección de modelo resolvable",
      favoriteNotFound: "Favorito no encontrado o no pertenece a este usuario",
      ambiguousModel:
        "Proveer EITHER un modelo explícito o un favorito/skill - no ambos",
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API error ({{status}}): {{errorText}}",
      },
    },
  },
  onboarding: {
    signin: {
      title: "Guarda tu configuración",
      subtitle: "Inicia sesión una vez. Todo lo que montes aquí va contigo.",
      benefits: {
        sync: {
          title: "Sincronizado en todos tus dispositivos",
          body: "Tu compañero, tus especialistas y tus chats en cada dispositivo que uses.",
        },
        keep: {
          title: "Nunca pierdas tu trabajo",
          body: "Como invitado, tu configuración solo vive en este navegador. Inicia sesión y se queda contigo.",
        },
        private: {
          title: "Privado por defecto",
          body: "Tú controlas tus datos y tu nivel de filtrado. Siempre.",
        },
      },
      cta: "Inicia sesión o crea una cuenta",
      continueAsGuest: "Seguir como invitado",
      note: "Puedes iniciar sesión más tarde desde el menú cuando quieras.",
    },
    setup: {
      title: "Configura tu IA",
      subtitle:
        "Elige con quién hablas. Añade especialistas si quieres. Puedes cambiarlo todo después.",
      arrivalTitle: "Empieza con {{skill}}",
      arrivalSubtitle:
        "{{skill}} responde en este chat. Tu compañero se encarga del resto.",
      arrivalLabel: "Tu skill",
      arrivalBadge: "Incluida",
      companionLabel: "Tu compañero",
      specialistsLabel: "Añadir especialistas",
      optional: "opcional",
      start: "Empezar a chatear",
      saving: "Configurando...",
      failed:
        "No se pudo guardar tu configuración. Revisa tu conexión e inténtalo de nuevo.",
      retry: "Reintentar",
      noProviderAvailable:
        "No hay ningún proveedor de IA configurado. Añade OPENROUTER_API_KEY o activa Claude Code (CLAUDE_CODE_ENABLED=true) para continuar.",
    },
    usecases: {
      coding: "Código y tecnología",
      research: "Investigación y análisis",
      writing: "Escritura y edición",
      business: "Negocios y estrategia",
      creative: "Creatividad e historias",
      learning: "Aprendizaje",
      health: "Salud y carrera",
      controversial: "Pensamiento libre",
      roleplay: "Rol y personajes",
    },
  },
  input: {
    placeholder: "Envía un mensaje...",
    imagePlaceholder: "Describir una imagen para generar...",
    audioPlaceholder: "Describir audio o música para generar...",
    noPermission: "No tienes permiso para publicar aquí.",
    noCredits: {
      title: "No quedan créditos",
      addCredits: "Agregar créditos",
      description: "Te quedaste sin créditos. Recarga para seguir conversando.",
    },
    creditsLoadFailed: {
      title: "No se pudo cargar el saldo.",
      retry: "Reintentar",
    },
    insufficientCredits: {
      title: "Créditos insuficientes (necesitas {{cost}} y tienes {{balance}})",
      description: "Recarga o elige un modelo más económico.",
    },
    noModel: {
      title: "No se ha seleccionado ningún modelo",
      description:
        "Elige un modelo primero. ¿Ninguna lista? Comprueba las teclas API de su proveedor.",
    },
    keyboardShortcuts: {
      enter: "Entra",
      toSend: "para enviar",
      shiftEnter: "Shift+Enter",
      forNewLine: "para nueva línea",
      ctrlV: "Ctrl+V",
      orPasteFiles: "o pegar archivos",
    },
    speechInput: {
      transcribing: "Transcribiendo...",
    },
    attachments: {
      uploadFile: "Adjuntar archivos",
      attachedFiles: "Archivos adjuntos",
      addMore: "Añadir más",
    },
  },
  outOfCredits: {
    dismiss: "Cerrar",
    guest: {
      title: "Se agotaron los créditos gratis",
      description:
        "Con una cuenta gratis tienes {{signedIn}} créditos al mes, {{max}} con el boletín. Tras registrarte, vuelves a este chat.",
      signUp: "Regístrate gratis",
      haveAccount: "¿Tienes una cuenta?",
      logIn: "Iniciar sesión",
    },
    member: {
      title: "Te quedaste sin créditos",
      shortTitle: "Créditos insuficientes para este mensaje",
      shortDescription:
        "Tienes {{balance}} créditos. En chats largos cada mensaje cuesta más. Inicia un chat nuevo, elige un modelo más económico o recarga:",
      description:
        "Los créditos gratis se renuevan el {{date}}. Elige un plan para continuar ahora:",
      subscriberDescription:
        "Los créditos del plan se renuevan el {{date}}. ¿Necesitas más antes? Recarga o elige un plan superior:",
      orTopUp: "O salta la espera:",
      newsletter: {
        title: "+ {{bonus}} créditos gratis cada mes",
        consent:
          "Únase al boletín con {{email}} : noticias de productos y nuevos modelos, descríbese en cualquier momento. Enviaremos un enlace de confirmación primero.",
        claim: "Únete a + {{bonus}} /mes",
        claiming: "Enviando…",
        pending:
          "Compruebe {{email}} y haga clic en el enlace de confirmación para desbloquear + créditos {{bonus}}/mes.",
      },
    },
  },
  imageGen: {
    sizeSquare: "Plaza (1024×1024)",
    sizeLandscape: "Paisaje (1792×1024)",
    sizePortrait: "Retrato (1024×1792)",
    qualityStandard: "Estándar",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "Corto (~8s)",
    durationMedium: "Medio (~15s)",
    durationLong: "Largo (~30s)",
  },
  voiceMode: {
    unconfiguredTitle: "Voz no configurada",
    unconfiguredDescription:
      "El texto a la palabra no está disponible para esta habilidad.",
    callMode: "Modo de llamada",
    callModeDescription: "AI responderá con voz",
    tapToRecord: "Pulse para grabar",
    recording: {
      paused: "Pausa",
      resume: "Resumen",
      pause: "Pause",
    },
    callOverlay: {
      listening: "Escuchando...",
    },
    actions: {
      cancel: "Cancelar",
      toInput: "Para la entrada",
      sendVoice: "Enviar voz",
      retry: "Reintentar",
      download: "Descargar Audio",
      downloadHint:
        "Descargue el archivo y adjuntelo a su próximo mensaje en su lugar.",
    },
  },
  actions: {
    cancellingGeneration: "Cancelando...",
    stopGeneration: "Para.",
    sendMessage: "Enviar",
    openThread: "Hilos abiertos",
  },
  toolsButton: {
    title: "Herramientas AI",
    tools: "Herramientas",
  },
  config: {
    folders: {
      private: "Privadas",
      shared: "Compartida",
      public: "Público",
      background: "Antecedentes",
      incognito: "Incognito",
      remote: "Remoto",
    },
  },
  models: { names: modelTranslations.names },
};
