import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "IA",
    status: "Situación",
    processing: "Procesamiento",
    classification: "Clasificación",
    automation: "Automatización",
    execution: "Ejecución",
    confirmation: "Confirmación",
    speech: "Discurso",
    transcription: "Transcripción",
    tts: "Texto a texto",
  },
  enums: {
    emailAgentStatus: {
      pending: "Pendiente",
      processing: "Procesamiento",
      hardRulesComplete: "Reglas duras completas",
      aiProcessing: "Proceso AI",
      awaitingConfirmation: "Awaiting Confirmation",
      completed: "Completado",
      failed: "Failed",
      skipped: "Saltó.",
    },
    emailAgentActionType: {
      markBounced: "Mark Bounced",
      markSpam: "Mark Spam",
      classifyDeliveryFailure: "Clasificar la falta de entrega",
      respondToEmail: "Responder a Email",
      deleteEmail: "Eliminar el correo electrónico",
      searchKnowledgeBase: "Base de conocimientos de búsqueda",
      webSearch: "Web Search",
      escalateToHuman: "Escalada hacia el ser humano",
      noAction: "No Action",
      chainAnalysis: "Análisis de la cadena",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Base de conocimientos Buscar",
      emailResponse: "Respuesta del correo electrónico",
      emailDelete: "Email Eliminar",
      webSearch: "Web Search",
    },
    bounceCategory: {
      hardBounce: "Hard Bounce",
      softBounce: "Soft Bounce",
      spamComplaint: "Denuncia de Spam",
      unsubscribe: "Cancelar suscripción",
      blockBounce: "Bloque Bounce",
      invalidAddress: "Dirección inválida",
      mailboxFull: "Mailbox Full",
      contentRejected: "Contenido Rechazado",
    },
    confirmationStatus: {
      pending: "Pendiente",
      approved: "Aprobados",
      rejected: "Rechazado",
      expired: "Gastos",
    },
    processingPriority: {
      low: "Baja",
      normal: "Normal",
      high: "Alto",
      urgent: "Urgente",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    emailAgentSortField: {
      emailId: "Correo electrónico ID",
      status: "Situación",
      lastProcessedAt: "Procesado por última vez",
      createdAt: "Creado en",
      priority: "Prioridad",
    },
    emailAgentStatusFilter: {
      all: "Todos",
      pending: "Pendiente",
      processing: "Procesamiento",
      hardRulesComplete: "Reglas duras completas",
      aiProcessing: "Proceso AI",
      awaitingConfirmation: "Awaiting Confirmation",
      completed: "Completado",
      failed: "Failed",
      skipped: "Saltó.",
    },
    emailAgentActionTypeFilter: {
      all: "Todos",
      markBounced: "Mark Bounced",
      markSpam: "Mark Spam",
      classifyDeliveryFailure: "Clasificar la falta de entrega",
      respondToEmail: "Responder a Email",
      deleteEmail: "Eliminar el correo electrónico",
      searchKnowledgeBase: "Base de conocimientos de búsqueda",
      webSearch: "Web Search",
      escalateToHuman: "Escalada hacia el ser humano",
      noAction: "No Action",
      chainAnalysis: "Análisis de la cadena",
    },
    confirmationStatusFilter: {
      all: "Todos",
      pending: "Pendiente",
      approved: "Aprobados",
      rejected: "Rechazado",
      expired: "Gastos",
    },
    processingPriorityFilter: {
      all: "Todos",
      low: "Baja",
      normal: "Normal",
      high: "Alto",
      urgent: "Urgente",
    },
    confirmationResponseAction: {
      approve: "Aprobar",
      reject: "Rechazo",
    },
    modelUtilities: {
      chat: "Chat",
      coding: "Programación",
      creative: "Escritura creativa",
      analysis: "Análisis",
      reasoning: "Razonamiento",
      roleplay: "Juego de rol",
      fast: "Rápido",
      smart: "Inteligente",
      vision: "Visión",
      imageGen: "Generación de imágenes",
      politicalLeft: "Izquierda política",
      politicalRight: "Derecho político",
      controversial: "Controversial",
      adultImplied: "Adulto (Implicado)",
      adultExplicit: "Adulto (Explicit)",
      violence: "Violencia",
      harmful: "Contenido nocivo",
      illegalInfo: "Información sobre actividades ilegales",
      medicalAdvice: "Consejos médicos",
      offensiveLanguage: "Lenguaje ofensivo",
      roleplayDark: "Juego de rol con temas oscuros",
      conspiracy: "Conspiración",
      legacy: "Modelos anteriores",
      uncensored: "Sin censura",
    },
  },
  aiStream: {
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
        dynamicTitle: "AI Run {{suffix}} : {{prompt}}",
        description:
          "Delega una tarea a un agente de IA especializado y devuelve su respuesta. Para crear o editar habilidades o personajes de IA, delega siempre con skill='skill-creator'. Pasa skill y prompt: el agente se encarga del resto. El costo en créditos depende del modelo.",
        container: {
          title: "AI Agente Run",
          description:
            "Configura las llamadas previas y el prompt para ejecutar el agente sin interfaz gráfica.",
        },
        fields: {
          favoriteId: {
            label: "ID favorito",
            description:
              "Slug o ID de un favorito guardado. Carga la habilidad, el modelo y las herramientas como valores predeterminados. Los campos de esta solicitud tienen prioridad.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "Modelo",
            description:
              "LLM para razonar sobre texto. Opcional si indicas favoriteId o skill. Rápidos: claude-haiku-4.5, gemini-2.5-flash. Equilibrados: claude-sonnet-4.6, gpt-5. Potente: claude-opus-4.7. Gratis: qwen3_235b-free. Para generar imágenes, audio o video, usa un modelo específico.",
          },
          skill: {
            label: "Habilidad",
            description:
              "ID o nombre predeterminado de la habilidad. Define el personaje y el prompt de sistema de la IA. Usa 'skill-creator' para crear o editar habilidades. Opcional si indicas favoriteId.",
            placeholder: "default",
          },
          prompt: {
            label: "Prompt",
            description:
              "Instrucción o pregunta principal para la IA. Sé específico. Si indicas preCalls, la IA usa sus resultados como contexto.",
            placeholder: "Escribe tu prompt...",
          },
          instructions: {
            label: "Instrucciones del sistema extra",
            description:
              "Instrucciones opcionales que se agregan al prompt de sistema. Úsalas para limitar el formato, el tono o la extensión de la respuesta, por ejemplo «Sé breve. Solo JSON».",
            placeholder: "Sé conciso. Un párrafo máx.",
          },
          preCalls: {
            label: "Pre-Calles",
            description:
              "Llamadas a herramientas que se ejecutan antes del prompt. Los resultados se agregan al contexto. Usa tool-help para consultar las herramientas disponibles y sus argumentos.",
            routeId: {
              label: "Herramienta ID",
              description:
                "Alias o nombre completo de la herramienta, por ejemplo 'web-search' o 'agent_skills_GET'. Usa tool-help para consultar las herramientas disponibles.",
              placeholder: "web-search",
            },
            args: {
              label: "Argumentos",
              description:
                'Argumentos de la herramienta en pares clave-valor. Combina urlPathParams y los campos del cuerpo en un solo objeto, por ejemplo {"query": "últimas noticias", "maxResults": 5}.',
            },
          },
          availableTools: {
            label: "Permitido a ejecutar",
            description:
              "Herramientas que puede ejecutar la IA. Con null puede usar todas las permitidas. Con un array solo puede usar las que figuren en la lista. Configuración estándar: [{toolId:'execute-tool'},{toolId:'tool-help'}].",
            toolId: {
              label: "Herramienta ID",
              description:
                "Alias o nombre completo de la herramienta, por ejemplo 'execute-tool', 'tool-help' o 'web-search'.",
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
              "Herramientas que se cargan en el contexto del modelo. Con null se aplican los valores predeterminados del usuario. Este campo define qué herramientas ve el modelo. Los permisos de ejecución se configuran por separado.",
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
              "Número máximo de ciclos de llamadas a herramientas. El valor predeterminado es ilimitado. Usa 1 para un solo prompt y una respuesta sin usar herramientas.",
          },
          appendThreadId: {
            label: "Thread ID (continue)",
            description:
              "UUID de la conversación que quieres continuar. El nuevo mensaje se agrega al final. Déjalo vacío para iniciar otra conversación.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "Carpeta de almacenamiento",
            description:
              "Dónde guardar la conversación. Segundo plano para las ejecuciones automáticas (Dreamer, Autopilot y tareas programadas). Privada para tu carpeta. Compartida para el equipo. Incógnito para evitar guardarla.",
            placeholder: "background",
            options: {
              background: "Antecedentes",
              private: "Privadas",
              shared: "Compartida",
              incognito: "Incognito (sin almacenamiento)",
            },
          },
          subFolderId: {
            label: "Subcarpeta ID",
            description:
              "UUID opcional de una subcarpeta de la carpeta raíz. Sirve para organizar conversaciones a mano. Déjalo vacío cuando llames a ai-run desde código, una herramienta de IA o una automatización.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "Excluir memorias",
            description:
              "Excluye del contexto los recuerdos guardados. Úsalo con bots públicos o tareas aisladas. Valor predeterminado: false.",
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
            description:
              "Error del servidor interno durante la ejecución de AI",
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
        uncensoredApiKeyMissing: "Uncensored.ai API key no configurado",
        openrouterApiKeyMissing: "OpenRouter API key no configurado",
        streamCreationFailed:
          "No se conecta al servicio AI. Por favor, inténtalo de nuevo.",
        unknownError: "Se produjo un error",
        creditValidationFailed: "No se ha validado el saldo de crédito",
        noIdentifier: "Falta el identificador del usuario o del contacto",
        insufficientCredits:
          "Créditos insuficientes para completar esta solicitud (costo: {{cost}}, saldo: {{balance}})",
        noResponseBody: "La transmisión no devolvió un cuerpo de respuesta.",
        authenticationRequired:
          "Por favor inicie sesión para usar carpetas persistentes. Utilice el modo incógnito para chats anónimos.",
      },
    },
    post: {
      title: "AI Stream Chat",
      titleShort: "AI Chat",
      description:
        "Stream AI - respuestas de chat propulsadas con modelos {{modelCount}} (Claude, GPT, Gemini, Llama, y más). Soporta texto, voz, archivos adjuntos y uso de herramientas agentes.",
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
        },
      },
      model: {
        label: "Modelo",
        description: "Modelo AI para uso para generación",
      },
      skill: {
        label: "Habilidad",
        description: "Posibilidad de utilizar para el AI",
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
        description:
          "Ajuste de calidad para la imagen generada (estándar o hd)",
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
        description: "Token para reanudar una respuesta interrumpida",
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
        description:
          "Archivos adjuntos al mensaje (imagenes, documentos, etc.)",
      },
      response: {
        title: "Respuesta a la situación",
        description: "AI -generated streaming response",
        success: "Corriente terminada con éxito",
        messageId: "Mensaje ID",
        threadId: "Thread ID",
        totalTokens: "Total de fichas utilizadas",
        finishReason: "Razón de conclusión",
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
    wakeUp: {
      revivalPrompt:
        "La tarea asinc que envió ha terminado. El resultado está en el mensaje de la herramienta anterior. Por favor resumir lo que la tarea me devolvió.",
      revivalInstructions:
        "WAKE - UP REVIVAL MODE : Se ha completado una tarea asinc y el resultado está en el hilo. Responder al último mensaje del usuario resumiendo el resultado de la herramienta - 1-3 oraciones solamente. Haz que NOT llame a cualquier herramienta. Do NOT vuelve a ejecutar la solicitud de usuario original.",
    },
    info: {
      streamInterrupted:
        "Se detuvo la generación. Se ha salvado la respuesta parcial.",
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
      noResponse:
        "El AI no generó una respuesta. Por favor, inténtalo de nuevo.",
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
        favoriteNotFound:
          "Favorito no encontrado o no pertenece a este usuario",
      },
    },
    resumeStream: {
      post: {
        title: "Resume AI Stream",
        description:
          "Continúe con un hilo existente ejecutando un giro AI sin cabeza. Usado después de completar una tarea remota asinc (callbackMode =wait o wakeUp). Pase favoriteId para cargar modelo+skill en un solo disparo, o establecer modelId + skillId explícitamente.",
        fields: {
          threadId: {
            title: "Thread ID",
            description: "UUID del hilo existente para continuar.",
          },
          favoriteId: {
            title: "ID favorito",
            description:
              "UUID de un favorito guardado para cargar modelo y habilidad de. Sobresigue modelId / skillId cuando ambos están fijados.",
          },
          modelId: {
            title: "Modelo ID",
            description:
              "Modelo AI para utilizar para la vuelta reanudada. Opcional cuando se proporciona favoriteId.",
          },
          skillId: {
            title: "ID de la habilidad",
            description:
              "Habilidad/persona para la continuación del turno. Opcional cuando se proporciona favoriteId.",
          },
          callbackMode: {
            title: "Modo de llamada",
            description:
              "Modo de devolución de la llamada de herramienta originaria (espera o wakeUp). Determinados reanudar el comportamiento.",
          },
          wakeUpToolMessageId: {
            title: "Mensaje de la herramienta de despertador ID",
            description:
              "ID del mensaje original de llamada herramienta con el resultado de relleno.",
          },
          wakeUpTaskId: {
            title: "WakeUp Task ID",
            description:
              "ID de la tarea de cron remoto originaria, eliminado después del reavivamiento.",
          },
          resumeTaskId: {
            title: "Reanume Task ID",
            description:
              "ID de esta tarea del cron de revitalización, eliminada después del reavivamiento.",
          },
          resumed: {
            title: "Continuación",
            description: "Si el hilo se continuó con éxito.",
          },
          lastAiMessageId: {
            title: "Último mensaje AI ID",
            description:
              "UUID del mensaje final de asistente generado. Null si no se produjo ningún mensaje.",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description:
              "Parámetros inválidos - threadId debe ser un UUID válido",
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
            description: "Thread o modelo no encontrado",
          },
          internal: {
            title: "Error del servidor",
            description: "Error interno durante la reanudación del flujo",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
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
            description: "Conflicto",
          },
        },
        success: {
          title: "Corriente restablecida",
          description: "El hilo AI se continuó con éxito",
        },
      },
    },
    providers: {
      uncensoredHandler: {
        errors: {
          apiError: "Error de API de Uncensored.ai ({{status}}): {{errorText}}",
        },
      },
    },
    onboarding: {
      back: "Atrás",
      welcome: {
        title: "Un AI para todo. El adecuado para cada cosa.",
        line1:
          "Un compañero para la conversación cotidiana. Especialistas en codificación, investigación, escritura - eliges uno cuando la tarea lo pide.",
        line2: "La misma charla. Cambias cuando importa. Toma segundos.",
        line3: "Vamos a ponerte en marcha en menos de un minuto.",
        continue: "Comienzo",
      },
      guest: {
        title: "Estás navegando como un invitado",
        line1:
          "Su configuración, compañero y historial de chat se guardan localmente en este dispositivo solamente.",
        line2:
          "Inicie sesión para mantener todo sincronizado a través de dispositivos - y asegúrese de que nunca pierda su configuración.",
        signIn: "Iniciar sesión / Crear cuenta",
        continueAnyway: "Continuar como Invitado",
        note: "Puedes iniciar sesión más tarde desde el menú en cualquier momento.",
      },
      companion: {
        title: "Elige a tu compañero.",
        subtitle: "Su principal compañero de chat para uso diario",
        modelTitle: "¿Qué modelo debería alimentarlo?",
        customSetup: "Configuración avanzada →",
        next: "Siguiente",
        selectFirst: "Escoge un compañero para continuar",
      },
      usecases: {
        title: "¿Para qué la usarás en su mayoría?",
        subtitle:
          "Agregaremos los especialistas adecuados a su kit de herramientas AI automáticamente.",
        saving: "Preparando...",
        start: "Comienzo de Chatear",
        hintNoneSelected:
          "Seleccione áreas para configurar habilidades especializadas o pulsar Comience a saltar",
        noProviderAvailable:
          "Falta configurar un proveedor de IA. Agrega OPENROUTER_API_KEY o habilita Claude Code (CLAUDE_CODE_ENABLED=true) para continuar.",
        coding: {
          label: "Coding &quot; Tech",
          hint: "Vibe Coder, Coder",
        },
        research: {
          label: "Research &quot; Analysis",
          hint: "Researcher, Data Analyst",
        },
        writing: {
          label: "Edición",
          hint: "Escritor, Editor",
        },
        business: {
          label: "Estrategia de Negocios &quot;",
          hint: "Business Advisor, Product Manager",
        },
        learning: {
          label: "Aprender &quot; estudiar &quot;",
          hint: "Tutor, Interlocutor Socrático",
        },
        creative: {
          label: "Historias creativas",
          hint: "Storyteller, Creativo",
        },
        health: {
          label: "Salud y cuidado",
          hint: "Salud Wellness, Entrenador Carrera",
        },
        controversial: {
          label: "Pensamiento libre",
          hint: "Sin censura, Filosofía",
        },
        roleplay: {
          label: "Roleplay &quot; Personajes",
          hint: "Roleplay, Creador de Personaje",
        },
      },
    },
    input: {
      placeholder: "Envía un mensaje...",
      imagePlaceholder: "Describir una imagen para generar...",
      audioPlaceholder: "Describir audio o música para generar...",
      noPermission: "No tienes permiso para publicar aquí.",
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
        retry: "Retrocedimiento",
        download: "Descargar Audio",
        downloadHint:
          "Descargue el archivo y adjuntelo a su próximo mensaje en su lugar.",
      },
    },
    actions: {
      cancellingGeneration: "Cancelando...",
      stopGeneration: "Para.",
      sendMessage: "Enviar",
    },
    toolsButton: {
      title: "Herramientas AI",
      tools: "Herramientas",
    },
  },
  chat: {
    category: "Chat",
    tags: {
      threads: "Conversaciones",
      folders: "Carpetas",
      files: "Archivos",
      messages: "Mensajes",
      characters: "Skills",
      memories: "Memorias",
      favorites: "Favoritos",
      credits: "Créditos",
      balance: "Saldo",
      permissions: "Permisos",
      hotkey: "Hotkey",
      cli: "CLI",
      speech: "Discurso",
      sharing: "Compartir",
      settings: "Configuración",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Privadas",
        shared: "Compartida",
        public: "Público",
        incognito: "Incognito",
        background: "Antecedentes",
        remote: "Remoto",
      },
      foldersShort: {
        private: "Privadas",
        shared: "Compartida",
        public: "Público",
        incognito: "Incognito",
        background: "Antecedentes",
        remote: "Remoto",
      },
    },
    enums: {
      role: {
        user: "Usuario",
        assistant: "Assistant",
        system: "Sistema",
        tool: "Herencia",
        error: "Error",
      },
      threadStatus: {
        active: "Activa",
        archived: "Archivado",
        deleted: "Suprimidos",
      },
      viewMode: {
        linear: "Linear",
        threaded: "Traido",
        flat: "Piso",
        debug: "Depuración",
      },
    },
    components: {
      sidebar: {
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        footer: {
          account: "Cuenta",
          profile: "Perfil",
          balance: "Saldo",
          buy: "Comprar",
          freeCreditsLeft: "Créditos gratis",
        },
      },
      credits: {
        credit: "{{count}} crédito",
        credits: "{{count}} créditos",
      },
      navigation: {
        subscription: "Suscripción y créditos",
        referral: "Programa de referidos",
        help: "Ayuda",
        about: "Acerca de",
      },
      confirmations: {
        deleteMessage: "¿Quieres eliminar este mensaje?",
      },
      welcomeTour: {
        authDialog: {
          title: "Desbloquear carpetas privadas &quot; compartidas",
          description:
            "Regístrese o inicie sesión para acceder a carpetas privadas y compartidas. Tus chats se sincronizarán entre dispositivos.",
          continueTour: "Viaje continuo",
          signUp: "Regístrate / Acceder",
        },
        buttons: {
          back: "Atrás",
          close: "Cerrar",
          last: "Acabado",
          next: "Siguiente",
          skip: "Skip",
        },
        welcome: {
          title: "¡Bienvenido a {{appName}}!",
          description:
            "Su primera plataforma AI con modelos {{modelCount}}, filtración de contenido controlada por el usuario y principios de habla libre.",
          subtitle: "Hagamos un recorrido rápido para empezar.",
        },
        aiCompanion: {
          title: "Elija su compañero AI",
          description:
            "Seleccione de los modelos {{modelCount}} AI incluyendo opciones estándar, de código abierto y sin censura.",
          tip: "Haga clic para abrir el selector de modelo y elegir a su compañero.",
        },
        rootFolders: {
          title: "Tus carpetas de chat",
          description:
            "Organiza tus chats en diferentes carpetas, cada una con configuraciones de privacidad únicas:",
          private: {
            name: "Privadas",
            suffix: "- sólo se puede ver",
          },
          incognito: {
            name: "Incognito",
            suffix: "- ninguna historia salvada",
          },
          shared: {
            name: "Compartida",
            suffix: "- colaborar con otros",
          },
          public: {
            name: "Público",
            suffix: "- visible para todos",
          },
        },
        privateFolder: {
          name: "Privadas",
          suffix: "Folder",
          description:
            "Tus charlas privadas son sólo visibles para ti. Perfecto para temas sensibles.",
        },
        incognitoFolder: {
          name: "Incognito",
          suffix: "Folder",
          description:
            "Chat sin guardar historia al servidor. Los mensajes se almacenan localmente en su navegador y persisten hasta que los despeje.",
          note: "No se almacenan datos en nuestros servidores durante las sesiones de incognito (los medios generados se almacenan temporalmente por razones técnicas).",
        },
        sharedFolder: {
          name: "Compartida",
          suffix: "Folder",
          description:
            "Colabora con personas específicas compartiendo el acceso a esta carpeta.",
        },
        publicFolder: {
          name: "Público",
          suffix: "Folder",
          description:
            "Comparte tus conversaciones AI con el mundo. Otros pueden ver y tenedor sus hilos.",
          note: "Todo en público es visible para todos los usuarios y motores de búsqueda.",
        },
        newChatButton: {
          title: "Iniciar un nuevo chat",
          description:
            "Haga clic aquí para iniciar una conversación fresca en cualquier carpeta.",
        },
        sidebarLogin: {
          title: "Inicie sesión para desbloquear más",
          description:
            "Crear una cuenta gratuita para acceder a carpetas privadas y compartidas, sincronizar su historia de conversación a través de dispositivos, y dejar que el AI recuerde cosas sobre usted.",
          tip: "¡Es libre de registrarse!",
        },
        subscriptionButton: {
          title: "Créditos y suscripción",
          description:
            "Obtenga créditos {{credits}}/mes con una suscripción para tan solo {{price}}/mes. Cuentas gratuitas obtienen créditos {{freeCredits}}/mes, {{freeCreditsMax}} con el boletín informativo.",
        },
        chatInput: {
          title: "Escriba su mensaje",
          description:
            "Escribe tu mensaje aquí y pulsa Entrar o haz clic en Enviar para chatear con tu compañero de AI.",
          tip: "Use Shift+Enter para una nueva línea. También puede adjuntar archivos e imágenes.",
        },
        voiceInput: {
          title: "Entrada de voz",
          description:
            "Utilice su micrófono para hablar con su compañero de AI:",
          options: {
            transcribe: "Transcribe el discurso al texto",
            sendAudio: "Enviar audio directamente al AI",
            pauseResume: "Pausa y reanudación de la grabación",
          },
        },
        callMode: {
          title: "Modo de llamada",
          description:
            "Activar el modo de llamada para una experiencia de conversación libre de manos, impulsada por voz con respuestas AI en tiempo real.",
          tip: "Perfecto para cuando estés en la marcha o prefieres hablar sobre escribir.",
        },
        complete: {
          title: "¡Todo listo!",
          description:
            "¡Has completado la gira! Empieza a charlar con tu compañero de AI ahora.",
          help: "¿Necesitas ayuda? Haga clic en el icono de marca de preguntas en la barra lateral en cualquier momento.",
        },
        authUnlocked: {
          unlocked: "¡Desbloqueado!",
          privateDescription:
            "Su carpeta privada está disponible ahora. Todas las conversaciones aquí son sólo visibles para ti.",
          privateNote:
            "Los chats privados sincronizan todos sus dispositivos automáticamente.",
          sharedDescription:
            "Su carpeta compartida está disponible ahora. Invitar a otros a colaborar en conversaciones AI.",
          sharedNote:
            "Usted controla quién tiene acceso a sus carpetas e hilos compartidos.",
        },
      },
    },
    selector: {
      loading: "Cargando...",
      best: "Mejor partido",
      free: "FREE",
      creditsSingle: "1 crédito",
      creditsExact: "{{cost}} créditos",
      modelOnly: "Modelo",
      editModelSettings: "Modificar la configuración del modelo",
      editSettings: "Modificar la configuración",
      switchSkill: "Cambiar habilidad",
      editSkill: "Editar habilidad",
      delete: "Eliminar",
      autoSelectedModel: "FILTER-BASED",
      manualSelectedModel: "MANUALLY SELECTED",
      intelligence: "Inteligencia",
      contentFilter: "Contenido",
      maxPrice: "Precio máximo",
      modelSelection: "Selección de modelo",
      autoModeDescription:
        "El mejor modelo se selecciona en función de sus filtros",
      manualModeDescription: "Elija un modelo específico manualmente",
      autoMode: "Filtros de base",
      manualMode: "Manual",
      allModelsCount: "Todos los modelos {{count}}",
      filteredModelsCount: "Los filtros de partido de los modelos {{count}}",
      showFiltered: "Mostrar solo los resultados filtrados",
      showAllModels: "Mostrar todos los modelos",
      showLess: "Mostrar menos",
      showMore: "Mostrar {{remaining}} más",
      showLegacyModels_one: "Mostrar {{count}} Legacy Modelo",
      showLegacyModels_other: "Mostrar {{count}} modelos anteriores",
      noMatchingModels: "No hay modelos de coincidencia",
      noModelsWarning: "Ningún modelo coincide con tus filtros",
      useOnce: "Usar una vez",
      saveAsDefault: "Añadir a favoritos",
      deleteSetup: "Eliminar la configuración",
      content: "Buscar contenido...",
      characterSetup: "Configuración de la habilidad",
      noResults: "No hay resultados",
      add: "Añadir a favoritos",
      added: "Añadido",
      addNew: "Añadir nuevo",
      searchSkills: "Destrezas de búsqueda...",
      createCustom: "Crear personalizado",
      customizeSettings: "Personalizar los ajustes",
      requirements: {
        characterConflict: "Conflictos necesarios para la habilidad",
        tooLow: "demasiado bajo",
        tooHigh: "demasiado alto",
        min: "min",
        max: "max",
      },
    },
    common: {
      newChat: "Nuevo chat",
      privateChats: "Chats privados",
      search: "Buscar",
      delete: "Eliminar",
      cancel: "Cancelar",
      save: "Guardar",
      edit: "Editar",
      settings: "Configuración",
      close: "Cerrar",
      toggleSidebar: "Mostrar u ocultar la barra lateral",
      lightMode: "Modo de luz",
      darkMode: "Modo oscuro",
      searchPlaceholder: "Buscar...",
      searchThreadsPlaceholder: "Búsqueda de hilos...",
      searchResults: "Resultados de búsqueda",
      noChatsFound: "No se encontraron chats",
      noThreadsFound: "No hay hilos encontrados",
      enableTTSAutoplay: "Activar el juego automático TTS",
      disableTTSAutoplay: "Desactivar el juego automático TTS",
      selector: {
        country: "País",
        language: "Idioma",
      },
      copyButton: {
        copied: "¡Copiado!",
        copyToClipboard: "Copiado para el portapapeles",
        copyAsMarkdown: "Copiar como Marcador",
        copyAsText: "Copiar como texto",
      },
      assistantMessageActions: {
        cancelLoading: "Carga cancelada",
        stopAudio: "Para el audio",
        playAudio: "Reproducción audio",
        answerAsAI: "Responder como modelo de IA",
        deleteMessage: "Borrar el mensaje",
      },
      characterSelector: {
        placeholder: "Seleccione la habilidad",
        addNewLabel: "Crear habilidad personalizada",
        grouping: {
          bySource: "By Source",
          byCategory: "Por categoría",
          sourceLabels: {
            builtIn: "Incorporación",
            my: "Mis habilidades",
            community: "Comunidad",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Crear una habilidad personalizada",
          fields: {
            name: {
              label: "Nombre",
              placeholder: "Ingrese el nombre de habilidad",
            },
            icon: {
              label: "Icon (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Descripción",
              placeholder: "Breve descripción de la habilidad",
            },
            systemPrompt: {
              label: "Prompt del sistema",
              placeholder: "Defina cómo se comporta la habilidad...",
            },
            category: {
              label: "Categoría",
            },
          },
          createCategory: "Crear categoría",
          cancel: "Cancelar",
          create: "Crear habilidad",
        },
        addCategoryDialog: {
          title: "Crear categoría",
          fields: {
            name: {
              label: "Categoría Nombre",
              placeholder: "Escriba nombre de la categoría",
            },
            icon: {
              label: "Icon (emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Cancelar",
          create: "Crear categoría",
        },
      },
    },
    actions: {
      newChatInFolder: "Nuevo chat en carpeta",
      newFolder: "Nueva carpeta",
      deleteFolder: "Suprimir carpeta",
      deleteMessage: "Borrar el mensaje",
      deleteThisMessage: "Suprímase este mensaje",
      searchEnabled: "Búsqueda habilitada",
      searchDisabled: "Búsqueda de personas discapacitadas",
      answerAsAI: "Responder como modelo de IA",
      retry: "Reintentar con otro modelo o habilidad",
      branch: "Conversación de rama de aquí",
      editMessage: "Editar mensaje",
      stopAudio: "Para la reproducción de audio",
      playAudio: "Reproducción audio",
      copyContent: "Copiado para el portapapeles",
    },
    dialogs: {
      searchAndCreate: "Buscar &quot; Crear &quot;",
      deleteChat: 'Eliminar el chat " {{title}} "?',
      deleteFolderConfirm:
        'Eliminar la carpeta " {{name}}" y mover {{count}} chat(s) a General?',
    },
    views: {
      linearView: "Vista lineal (estilo ChatGPT)",
      threadedView: "Vista empuje (estilo Reddit/ Discord)",
      flatView: "Vista plana (4chan estilo)",
      debugView: "Vista de la depuración (con los impulsos del sistema)",
    },

    screenshot: {
      capturing: "Capturing...",
      capture: "Capture Captura de Pantalla",
      failed: "Failed to capture screenshot",
      failedWithMessage: "No se pudo tomar la captura de pantalla: {{message}}",
      tryAgain:
        "Falló para capturar la captura de pantalla. Por favor, inténtalo de nuevo.",
      noMessages:
        "No podía encontrar el área de mensajes de chat. Por favor, asegúrese de tener mensajes en el chat.",
      quotaExceeded:
        "La cuota de almacenamiento superó. Captura de pantalla es demasiado grande.",
      canvasError: "No se pudo convertir la captura de pantalla en una imagen.",
    },
    errors: {
      noResponse:
        "No se ha recibido respuesta de AI. La solicitud completó pero devolvió contenido vacío. Por favor, inténtalo de nuevo.",
      noStream: "Failed to stream response: No hay lector disponible",
      saveFailed: "Failed to save edit",
      branchFailed: "Failed to branch",
      retryFailed: "Failed to retry",
      answerFailed: "No contestado",
      deleteFailed: "Fallado para eliminar",
    },
    errorTypes: {
      streamError: "Error de secuencia",
    },
    hooks: {
      stt: {
        "endpoint-not-available":
          "No se dispone de un punto final de voz a texto",
        "failed-to-start": "Falló para empezar a grabar",
        "permission-denied":
          "Acceso al micrófono bloqueado. Permitir el micrófono en la configuración de su navegador y volver a cargar la página.",
        "permission-denied-ios":
          "El micrófono está bloqueado. Ir a Ajustes → Safari → El micrófono y permitir el acceso para este sitio.",
        "permission-denied-android":
          "El micrófono está bloqueado. Pulse el icono de bloqueo en la barra de direcciones → Ajustes del sitio → Micrófono → Permitir.",
        "permission-denied-mac":
          "El micrófono está bloqueado. Configuración de sistema abierto → Privacidad y Seguridad → Micrófono y habilitar su navegador.",
        "permission-denied-windows":
          "El micrófono está bloqueado. Abrir configuración → Privacidad → Micrófono y asegúrese de que su navegador está permitido.",
        "no-microphone":
          "No hay micrófono encontrado. Conectar un micrófono o un auricular e intentarlo de nuevo.",
        "microphone-in-use":
          "Su micrófono está siendo utilizado por otra aplicación. Cierralo y vuelve a intentarlo.",
        "not-supported":
          "Su navegador no admite el acceso al micrófono. Prueba Chrome, Firefox o Safari.",
        "transcription-failed": "Failed to transcribe audio",
        "audio-too-short":
          "Grabando demasiado corto. Sostenga el micrófono y hable con claridad, luego inténtelo de nuevo.",
      },
      tts: {
        "endpoint-not-available": "Punto final de texto a voz no disponible",
        "failed-to-play": "Failed to play audio",
        "conversion-failed": "La conversión TTS falló",
        "failed-to-generate": "Failed to generate audio",
      },
    },
    post: {
      title: "Chat",
      description: "Interfaz de chat",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "UncensoredLM es el modelo de uncensored.ai. Los demás modelos de este nivel son modelos convencionales modificados para que respondan: mismo entrenamiento, misma visión del mundo. UncensoredLM se entrenó con libros y documentos prohibidos en el internet convencional. De ahí sus posturas políticas contrarias a la corriente dominante. Elígelo para explorar otros puntos de vista o escribir ficción oscura y tabú, sin suavizar escenas, dar sermones ni volver al consenso. Usa herramientas, tiene contexto de 32K y funciona solo con texto. Es experimental y poco adecuado para programar. Presenta afirmaciones controvertidas con la misma seguridad que los hechos comprobados: verifica las fuentes.",
        freedomgptLiberty:
          "El modelo sin censura insignia de Age of AI, el chat por la libertad de expresión que abrió camino en esta categoría. Usa pesos abiertos y responde de frente, sin sermones. Rápido y agudo, con contexto de 32K. Qwen 3.6 Plus Uncensored es más potente con herramientas, código y análisis profundo. Para una perspectiva distinta, elige UncensoredLM.",
        gabAiArya:
          "El asistente sin censura de Gab. Sus creadores le dieron un enfoque político de derecha y respuestas directas incluso en temas delicados. Inteligente, con contexto de 131K. Lee imágenes y video y usa herramientas. Elígelo si buscas ese enfoque: UncensoredLM es el otro modelo con una visión propia. Tiene menos capacidad para programar. Gab mantiene en reserva el modelo base.",
        gemini31ProPreviewCustomTools:
          "La vista previa personalizada de Gemini 3.1 Pro, sintonizada para llamar a las herramientas que define en lugar de caer de nuevo al bajo. Construido para agentes de codificación y flujos de trabajo multiherramienta, con contexto 1M y texto, imagen, vídeo y entrada de audio. Una construcción de vista previa. Gemini 4 Argon es la nueva opción de clase Pro a un precio similar.",
        gemini31FlashImagePreview:
          "Google 's Gemini 3.1 Imagen Flash, todavía en vista previa. Genera y edita imágenes en el chat, texto e imágenes en la misma respuesta. El modelo de imagen más barato del catálogo. Filtros de corriente principal, sin llamadas de herramientas, contexto 64K. Para los impulsos complejos y texto más limpio dentro de las imágenes, Nano Banana Pro cuesta más y ofrece más. Legacy: Nano Banana 2.1 lo reemplaza a aproximadamente la mitad del precio de la imagen.",
        gemini31FlashLitePreview:
          "Google 's modelo de presupuesto de alto volumen, todavía en vista previa: traducción, ranking, extracción y chat rápido sobre el contexto 1M, con texto, imagen, vídeo y entrada de audio. Barato y rápido, no construido por razones difíciles. Todavía cuesta menos que su sucesor, Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro - Modelo multimodal avanzado AI con ventana de contexto grande y potentes capacidades de razonamiento",
        gemini35Flash:
          "Google 's Modelo Flash lanzado en codificación y razonamiento casi Pro, con niveles de pensamiento ajustables, contexto 1M y texto, imagen, vídeo y entrada de audio. Sólido, pero Gemini 3.8 Flash es más nuevo y aproximadamente la mitad del precio, así que cambia.",
        gemini3Flash:
          "Google 's first Gemini 3 Flash: rápido y capaz de codificación y razonamiento cotidiano, con contexto 1M y texto, imagen, vídeo y entrada de audio. Todavía buen valor y más barato que su sucesor. Gemini 3.8 Flash es la opción más nueva si quieres la última.",
        deepseekV32:
          "DeepSeek 's late-2025 modelo de peso abierto con escasa atención que hace trabajo de largo contexto más barato. Una mezcla de 671B de expertos, buena codificación y análisis por muy poco dinero, sólo texto. DeepSeek V4.1 Flash es más nuevo y cuesta incluso menos.",
        deepseekV4Pro:
          "DeepSeek es un buque insignia de peso abierto: una mezcla de 1,6T-parametro de expertos con 49B activa, MIT licenciado. Razonamiento profundo, código serio, análisis de base completa y trabajo de agente multi-paso, contexto 1M, llama herramientas. Solo texto. Una fracción del precio de Claude Opus 5.5. Para un trabajo cotidiano barato y rápido, DeepSeek V4.1 Flash es el hermano.",
        deepseekV4Flash:
          "DeepSeek 's 284B mix-of-experts Modelo Flash: 1M contexto, rápido, fuerte en codificación, costo cercano a cero por mensaje. Solo texto. Su sucesor DeepSeek V4.1 Flash cuesta lo mismo, así que muévete a menos que necesites esta versión exacta.",
        gpt55:
          "OpenAI 's anterior modelo general superior: fuerte razonamiento, codificación y análisis sobre el contexto 1M, con texto e imagen. Todavía es capaz, pero con precios premium, y GPT-6.1 Sol ahora hace los mismos trabajos por mucho menos. Punto débil: juego de roles.",
        gpt55Pro:
          "El nivel Pro de GPT-5.5, construido para gastar mucho más computación en problemas duros y de alta toma. Uno de los modelos más caros del catálogo, vale la pena sólo cuando una respuesta incorrecta cuesta más que el mensaje. GPT-6 Astra es la nueva opción a cerca de un tercio del precio.",
        gpt54Pro:
          "La variante Pro de máxima computación de GPT-5.4 para análisis de razonamientos duros, investigación y tomas altas en el contexto 1M. Lenta, y entre los modelos más primitivos aquí. GPT-6 Astra cubre el mismo terreno por alrededor de un tercio del precio.",
        gpt54:
          "El modelo OpenAI que plegó la codificación de grado Codex en la línea principal GPT, con contexto 1M y entrada de imagen. Sólido para documentos largos, código y análisis. GPT-6.1 Sol es más nuevo, valorado un nivel más alto y más barato por mensaje, por lo que hay poca razón para quedarse.",
        gpt53Codex:
          "OpenAI 's especialista en codificación de agentes: sesiones largas, de desarrollo de mano de herramientas, refactores y depuración, con contexto de 400K. Fuerte en el código, débil en la escritura creativa y el juego de roles. GPT-6.1 Sol ahora maneja codificación a un precio similar y hace más además.",
        gpt53Chat:
          "GPT-5.3 Chat - Actualizado modelo de conversación ChatGPT que ofrece respuestas más precisas y contextuales con significativa reducción de las negativas innecesarias y cavernas",
        gpt52Pro:
          "GPT-5.2 con el razonamiento extendido para los problemas más difíciles: investigación profunda, matemáticas difíciles, revisión de código cuidadoso. Despacio y muy caro. GPT-6 Astra es la opción actual de clase Pro y cuesta mucho menos de la mitad.",
        gpt52:
          "OpenAI 's late-2025 workhorse for professional tasks: coding, documentos largos y análisis estructurado, con contexto de 400K e entrada de imagen. Fiable, pero ya no es la opción de valor. GPT-6.1 Sol cuesta lo mismo y es más nuevo.",
        gpt52_chat:
          "El rápido, ChatGPT - variante de estilo GPT-5.2 : respuestas conversales sin pensamiento largo, contexto 128K. Bien por chat y redacción diarias. Menos contexto que sus hermanos, y GPT-6.1 Terra ahora hace este trabajo por aproximadamente la mitad del precio.",
        dolphin3_0_r1_mistral_24b:
          "Delfín 3.0 R1 Mistral 24B - Modelo de lenguaje grande sin censura basado en Mistral",
        dolphinLlama3_70B:
          "Delfines Llama 3 70B - Modelo de lenguaje grande sin censura basado en Llama 3",
        veniceUncensored:
          "El modelo sin censura de Venice, basado en Dolphin Mistral 24B. Tiene una de las tasas de rechazo más bajas y sirve para ficción y chat sin filtros. Lee imágenes, tiene contexto de 128K y cuesta poco. Elimina los rechazos y conserva la perspectiva de Mistral en política y en las escenas más oscuras. Para otra perspectiva, elige UncensoredLM. Para código y análisis profundo, prueba Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "El modelo 24B de Venice para juegos de rol, ajustado para responder sin rechazos. Los personajes mantienen su voz durante campañas largas, sin sermones que interrumpan la trama. Lee imágenes y tiene contexto de 128K. Conserva la perspectiva del modelo base. UncensoredLM va más lejos en temas oscuros y tabúes. Este destaca en campañas largas y con imágenes de entrada. Está hecho para narrar. Para código y análisis, elige otro modelo.",
        gemma4Uncensored:
          "Gemma 4 26B de Google, con arquitectura de mezcla de expertos y filtros eliminados, disponible en Venice. Rápido y económico. Lee imágenes, usa herramientas y tiene contexto de 256K. Responde a temas difíciles y conserva el entrenamiento y la perspectiva de Google. Para razonamiento más profundo sin rechazos, GLM 5.3 Flash Uncensored cuesta un poco más.",
        qwen36PlusUncensored:
          "El modelo de razonamiento Qwen 3.6 Plus de Alibaba, con los rechazos eliminados, disponible en Venice. Uno de los modelos sin censura más potentes para código y análisis. Lee imágenes, usa herramientas y tiene contexto de 256K. Responde con libertad y conserva el entrenamiento y la perspectiva de Qwen. Para una visión política diferente, elige UncensoredLM. Cuesta más que los modelos Flash. Otra opción potente es GLM 5.3 Uncensored, con contexto de 1M y solo texto.",
        glm47FlashHeretic:
          "GLM 4.7 Flash con el comportamiento de rechazo eliminado mediante abliteration. Responde de frente, usa herramientas y cuesta pocos centavos por mensaje. Rápido para conversar sin filtros y escribir ficción. Conserva el entrenamiento y la visión del GLM base. Flojo en análisis profundo. GLM 5.3 Flash Uncensored razona mejor y cuesta un poco más.",
        glm53Abliterated:
          "GLM 5.3 completo con los rechazos cortados de los pesos por Abliteration.ai. Razonamiento frontal, herramientas, contexto 1M. El pesado atacante. No hay rechazos, pero la base GLM 's entrenamiento y encuadre permanecen.",
        deepseekV41FlashAbliterated:
          "Abliteration.ai 's libre de rechazo DeepSeek V4.1 Flash. 552B MoE, razones duras, lee imágenes, llama herramientas. Se detiene diciendo que no; DeepSeek 's propia framing se queda.",
        mimoV26FlashAbliterated:
          "MiMo V2.6 Flash de Xiaomi con la tendencia a rechazar eliminada mediante abliteration. Rápido, lee imágenes, usa herramientas y tiene contexto de 1M. Adecuado para grandes volúmenes de trabajo sin filtros. Prioriza la velocidad sobre la profundidad y conserva la perspectiva del modelo base. Cuesta más del doble que GLM 5.3 Flash Uncensored, que ofrece capacidades similares.",
        glm53Uncensored:
          "El modelo de razonamiento GLM 5.3 completo de Z.AI, con los rechazos eliminados. Una de las opciones sin censura más potentes para código, textos largos y análisis. Usa herramientas y tiene contexto de 1M. Conserva el entrenamiento y la perspectiva política del GLM original. Para posturas políticas a contracorriente, elige UncensoredLM. Solo acepta texto, es más lento que los modelos Flash y aún es experimental. Para el día a día, GLM 5.3 Flash Uncensored es más rápido y económico.",
        glm53FlashUncensored:
          "GLM 5.3 Flash de Z.AI con los rechazos eliminados. Usa una mezcla de expertos de 320B, lee imágenes, llama a herramientas y tiene contexto de 1M. Rápido y económico para trabajar a diario sin filtros. Responde a temas delicados y conserva el entrenamiento y la visión política del GLM original. UncensoredLM ofrece una perspectiva distinta. Para el razonamiento más difícil, elige GLM 5.3 Uncensored.",
        veniceLustifyV8:
          "Un puesto de control SDXL ajustado para imágenes de adultos fotorreales, servido por Venice.ai. Sin censura: sin borrón, sin rechazos. Entre los modelos de imagen más baratos que ofrecemos. Construido para cuerpos y piel, no para texto en imágenes, escenas complejas o estilos de arte; Chroma tiene más rango artístico.",
        veniceChroma:
          "Un modelo de peso abierto construido en FLUX.1 schnell y reentrenado sin filtro de contenido, servido por Venice.ai. Maneja los largos impulsos y una amplia gama de estilos de arte, contenido explícito incluido. Barato por imagen. Menos especializado en nudidad fotorreal que Lustify v8, y texto sólo en, por lo que utilice Qwen Edit Uncensored para retraer una imagen existente.",
        veniceQwenEdit:
          "Edición de imagen sin censura construida en el modelo Qwen de Alibaba, servido por Venice.ai. Darle una imagen de referencia y una instrucción: intercambiar elementos, reestilo, cambiar trajes, volver a trabajar la escena. Sin borrón, sin rechazos. Costos más que Chroma o Lustify v8, que sólo generan de texto.",
        veniceFireredImageEdit:
          "Un editor de imagen impulsado por rápidos servido por Venice.ai. Describir el cambio, edita exactamente eso y deja solo el resto de la imagen. Tier sin censura sin rechazos, aunque no etiquetado para salida explícita la forma en que Qwen Edit Uncensored es. El mismo precio que Qwen Edit; en ediciones duras, prueba ambos.",
        claudeOpus45:
          "Anthropic 's noviembre 2025 Opus, un modelo de codificación y agente superior en su día y el primer Opus a un precio mucho menor. Excelente en escritura cuidadosa y código complejo, contexto 200K. Cautious sobre temas controvertidos. Claude Opus 5.5 es más nuevo y más barato.",
        claudeOpus46:
          "Anthropic 's Febrero 2026 Opus, el primer Opus con una ventana de contexto 1M. Fuerte en la codificación, análisis profundo y escritura cuidadosa. Precio Premium, filtros de corriente, cauteloso sobre temas controvertidos. Claude Opus 5.5 es más nuevo y más barato.",
        claudeOpus47:
          "Una versión de Opus 2026 sentada entre 4.6 y 4.8: razonamiento profundo, codificación compleja y escritura de larga duración sobre el contexto 1M. Precio y cauteloso sobre temas controvertidos. Claude Opus 5.5 lo reemplaza y cuesta menos por mensaje.",
        claudeOpus48:
          "La última versión Opus 4, construida para trabajos largos de agente, codificación compleja y salidas muy largas sobre el contexto 1M, con entrada de imagen. Premium, lleno de corriente, cauteloso sobre temas controvertidos. Claude Opus 5.5 es más nuevo y más barato.",
        claudeSonnet46:
          "Anthropic 's principios de 2026 Sonnet, una actualización más de 4.5 en codificación, agentes y trabajo de estilo oficina, con contexto 1M. Filtros de corriente principal, cauteloso sobre temas controvertidos. Claude Sonnet 5.5 lo reemplaza y cuesta menos por mensaje.",
        claudeHaiku45:
          "Anthropic 's Octubre 2025 pequeño modelo: rápido, bueno en las imágenes de codificación y lectura diarias, contexto 200K. Filtros de corriente principal, cauteloso sobre temas controvertidos. Claude Haiku 5.5 ahora cuesta alrededor de un décimo tanto, por lo que el interruptor es fácil.",
        glm5_1:
          "Z. AI 's modelo de codificación construido para trabajos largos-horizon, lanzado como capaz de moler en una tarea durante horas. Fuerte en la planificación, codificación y funcionamiento de agentes multi-paso, contexto 200K, texto sólo, nivel de contenido abierto. GLM-5.3 es más nuevo y una fracción del precio pero se sienta un nivel más bajo; Kimi K3 es la corriente más fuerte abierta.",
        glm5: "Z. AI 's principios 2026 insignia de peso abierto, construida para el diseño de sistemas y flujos de trabajo de agente largo. Fuerte razonamiento y codificación, nivel de contenido abierto, contexto 200K, texto solamente. GLM-5.3 es más nuevo y mucho más barato, pero se sienta un nivel más bajo en inteligencia; Kimi K3 es la alternativa abierta más fuerte.",
        glm5Turbo:
          "Un GLM-5 más rápido sintonizado para los circuitos de agente: inferencia rápida, descomposición de tareas limpia y carreras largas estables. Es bueno para la automatización de equipos con contexto 200K, solo texto, nivel de contenido abierto. GLM-5.3 hace un trabajo similar hoy por una fracción del precio.",
        glm46:
          "Z. AI 's Septiembre 2025 liberación que levantó contexto a 200K y mejoró la codificación y el uso de agente. Todavía un todoterreno bilingüe decente, nivel de contenido abierto, texto solamente. GLM-5.3 es más nuevo y más barato.",
        glm47:
          "Z. AI's Diciembre 2025, un sólido chino-inglés bilingüe todo-rounder con mejor codificación y razonamiento que 4.6. Fine for chat, analysis and agent tasks, 200K context, text only, open content level. GLM-5.3 es más nuevo en aproximadamente una cuarta parte del precio.",
        glm47Flash:
          "El pequeño, rápido GLM 4.7 y uno de los modelos más baratos aquí. Bien para chat rápido, llamadas simples y trabajos de texto a granel con contexto 200K. Luz en profundo razonamiento. GLM-5.3 Flash es más nuevo pero cuesta aproximadamente el doble.",
        kimiK2:
          "Moonshot AI 's Julio 2025 modelo de peso abierto, una mezcla de 1T-parametro-de-expertos que hizo su nombre en uso y codificación de herramientas. Nivel de contenido rápido y abierto, contexto 262K, solo texto. No hay modo de pensar. Kimi K3 es el nuevo buque insignia a aproximadamente el doble del precio.",
        kimiK2_5:
          "Moonshot's enero 2026 Kimi, nativamente multimodal con entrada de imagen. Fuerte en codificación de texto largo, convirtiendo capturas de pantalla en código y escritura creativa, con filtros de contenido abiertos y contexto 262K. Kimi K3 es más nuevo pero cuesta aproximadamente el doble.",
        kimiK2_6:
          "El Kimi K2.6, de Moonshot, se centró en la codificación de largos caballos, la construcción de IUs desde avisos o capturas de pantalla, y el funcionamiento de muchos subagentes en paralelo. Rápido e inteligente, entrada de imagen, contexto 262K, nivel de contenido abierto. Kimi K3 es más nuevo a un precio más alto.",
        claudeSonnet45:
          "Anthropic 's Septiembre 2025 Sonnet, conocido por la fuerte codificación y largas sesiones de agente autónomo. Todavía es un buen codificador y escritor, con el contexto 1M aquí. Cautious on controversial topics, weak at roleplay. Claude Sonnet 5.5 es más nuevo y más barato por mensaje.",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Agente autónomo AI propulsado por Claude Sonnet vía Anthropic 's Agente SDK. Ejecuta las herramientas de forma independiente con el razonamiento incorporado.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Agente AI autónomo rápido alimentado por Claude Haiku vía Anthropic 's Agent SDK. Optimizado para la velocidad con la ejecución de herramientas.",
        claudeAgentOpus:
          "Claude Agent Opus - El agente AI autónomo más poderoso propulsado por Claude Opus vía Anthropic 's Agent SDK. Inteligencia máxima con ejecución de herramientas.",
        grok4:
          "xAI de julio 2025 insignia, un modelo de razonamiento que siempre piensa antes de responder. Fuerte en matemáticas, ciencias y análisis, con filtros de contenido más ligeros que la mayoría de los modelos principales. Más lento que los modelos de chat simple. Grok 4.7 es el Grok actual, a un precio más alto.",
        grok4Fast:
          "Grok. xAI se retiró el nivel rápido barato, por lo que este nombre ahora funciona en Grok 4.3 a precios de Grok 4.3. Lee imágenes, llama herramientas, contexto 1M, política de contenido abierto. Grok 4.7 lo reemplaza y razones mucho más profundas para aproximadamente el doble del precio de salida. Para chat rápido barato, MiniMax M3.1 Flash o DeepSeek V4.1 Flash cuesta una fracción.",
        grok43:
          "Una posterior liberación Grok 4 con un razonamiento siempre en curso y contexto 1M, dirigida a flujos de trabajo de agente e investigación profunda. Nivel de contenido abierto, llamadas herramientas, lee imágenes. El mismo precio que Grok 4 y más barato que Grok 4.7, el nuevo escoge cuando quieres lo último.",
        grok420Beta:
          "xAI anterior insignia con una ventana de contexto 2M, llamada de herramienta y entrada de imagen. Bien por documentos enormes y el agente largo se encuentra bajo filtros de contenido abiertos. Grok 4.7 es más nuevo pero cuesta más.",
        gpt5Pro:
          "GPT-5 con razonamiento extendido, respuesta de OpenAI 2025 para las preguntas más difíciles. Torso, pero lento y muy caro para lo que es ahora una generación mayor. GPT-6 Astra es la moderna selección de Pro-tier y cuesta menos.",
        gpt5Codex:
          "GPT-5 Codex - OpenAI 's modelo de codificación especializado con una programación excepcional y capacidades técnicas",
        gpt51Codex:
          "GPT-5.1 afinado para codificación de agentes en OpenAI 's Codex: larga edición, ejecución y fijación de bucles a través de repositorios reales, con contexto 400K. Valor justo para el código a su precio. Menos adecuado para chat o escritura de composición abierta, y el nuevo GPT-6.1 Sol ha pasado de él.",
        gpt51:
          "OpenAI 's noviembre 2025 actualización a GPT-5, con un razonamiento adaptable que piensa más tiempo sólo en preguntas difíciles y un tono de conversación más cálido. Todavía es un modelo general sensible con contexto 400K y entrada de imagen. GPT-6.1 Sol es más nuevo y más afilado para un poco más por mensaje.",
        gpt5: "OpenAI 's Agosto 2025 buque insignia que fusionó respuestas rápidas y razonamiento profundo en un solo modelo. Todavía es capaz todo-rounder para chat, escritura y código, con contexto 400K e entrada de imagen. GPT-6.1 Sol es la actual selección de OpenAI: más nueva y más fuerte por un poco más por mensaje.",
        gpt54Mini:
          "El GPT-5.4 más pequeño: buen razonamiento, codificación y uso de herramientas a un precio más bajo, con contexto de 400K e entrada de imagen. Fino para chat de alto volumen y trabajo subagente. GPT-6 Luna es más nuevo y más barato por mensaje, aunque sintonizado más para velocidad que profundidad.",
        gpt54Nano:
          "OpenAI 's tiniest GPT-5.4, hecho para clasificación, extracción de datos y llamadas subagentes rápidas. Barato, rápido, llama herramientas, lee imágenes. Demasiado poco profundo para un análisis real. GPT-6 Luna es la nueva selección de presupuesto y cuesta incluso menos.",
        gpt5Mini:
          "El GPT-5 compacto para tareas diarias rápidas: respuestas cortas, resúmenes, llamadas sencillas de herramientas, contexto 400K. Barato y rápido, pero delgado en análisis profundo. GPT-6 Luna es más nueva y cuesta casi un tercio.",
        gpt5Nano:
          "OpenAI es el GPT-5 más pequeño y todavía uno de los modelos más baratos aquí. Fine for category, tagging and short replies at volume. No por codificación o análisis real. GPT-6 Luna es el nuevo modelo de presupuesto, a un precio ligeramente superior.",
        gptOss120b:
          "Modelo de pesos abiertos de OpenAI, con 117B de parámetros en total, arquitectura de mezcla de expertos y licencia Apache 2.0. Razona y programa bien a un costo mínimo. Usa herramientas, tiene contexto de 131K y solo recibe texto. Sus filtros son más leves que los de la línea GPT-6 de OpenAI. GLM-5.3 cuesta casi lo mismo y ofrece contexto de 1M.",
        kimiK2Thinking:
          "La versión de razonamiento de 2025 de noviembre de Kimi K2, construida para seguir pensando en cientos de llamadas de herramientas encadenadas sin perder el hilo. Bien para la investigación y el trabajo de agente multi-paso a un precio bajo, nivel de contenido abierto. Texto sólo y más lento que el simple K2. Kimi K3 es la nueva opción.",
        minimaxM27:
          "Modelo centrado en el agente de MiniMax para trabajos prácticos: depuración, modelado financiero, generación de documentos y carreras multiagentes. Inteligente y barato, contexto de 196K, solo texto, nivel de contenido abierto. MiniMax M3.1 Flash lo reemplaza: más fuerte, multimodal, 1M contexto y más barato.",
        mimoV2Pro:
          "El buque insignia de Xiaomi de la línea MiMo V2, construido para orquestación de agentes y flujos de trabajo de ingeniería largos con contexto 1M. Fuerte razonamiento y codificación a un precio bajo, solo texto, nivel de contenido abierto. MiMo V2.6 Pro es más nuevo y ligeramente más barato.",
        glm45Air:
          "El ligero GLM 4.5, una mezcla de 106B de expertos con sólo 12B activo, por lo que las respuestas vienen rápidas y baratas. Fino para charla casual y tareas sencillas, contexto 128K, texto solamente. Fecha de razonamiento. GLM-5.3 Flash es más nuevo y más barato.",
        glm45v:
          "Z. AI 's modelo de visión construido en GLM-4.5 -Air, una mezcla 106B de expertos. Lee capturas de pantalla, gráficos y fotos, chats y herramientas de llamadas. Sólo contexto 64K y razonamiento fechado. GLM-5.3 Flash es el nuevo, más barato Z. AI pick.",
        geminiFlash25Lite:
          "Google es más barato 2025 Gemini : peniques por mensaje, contexto 1M, texto, imagen, vídeo y entrada de audio. Ideal para etiquetado a granel, traducción y respuestas cortas, poco profunda en el razonamiento. Gemini 3.5 Flash Lite es más nuevo pero cuesta casi cuatro veces más, por lo que este todavía gana su lugar.",
        geminiFlash25Flash:
          "Google 's 2025 híbrido razonamiento Flash con un presupuesto de pensamiento controlable, contexto 1M y texto, imagen, vídeo y entrada de audio. Todavía una opción barata y rápida para resúmenes y chat diario. Gemini 3.8 Flash es más nuevo y más inteligente, pero cuesta aproximadamente el doble.",
        geminiFlash25Pro:
          "Google 's 2025 modelo de pensamiento con contexto 1M, fuerte en análisis y código de documentos largos para su tiempo. Ahora claramente una generación detrás. Gemini 4 Argon es la actual opción de clase Pro, a un precio algo más alto.",
        deepseekV31:
          "DeepSeek 's Agosto 2025 híbrido que cambia entre respuestas rápidas y pensamiento paso a paso en un modelo. Un codificador capaz y barato construido sobre una mezcla de 671B de peso abierto, sólo texto. DeepSeek V4.1 Flash es más nuevo en aproximadamente un tercio del precio.",
        deepseekR1:
          "El modelo de razonamiento de peso abierto de enero de 2025 que demostró la cadena de pensamiento visible podría ser barato. Todavía sólido para la matemática y la lógica, pero lento, verboso y reticente en la política China considera sensible. DeepSeek V4.1 Flash es más nuevo y una fracción del precio.",
        qwen3235bFree:
          "El Qwen3 235B de Alibaba, un modelo de mezcla de expertos con parámetros activos 22B. Código sólido y razonamiento en un presupuesto, llamadas herramientas, contexto 131K. Texto solamente y una generación detrás: Qwen 3.8 Flash es más nuevo, lee imágenes y cuesta aproximadamente lo mismo.",
        deepseekR1Distill:
          "Un pequeño Qwen -destilado basado en DeepSeek R1 para un razonamiento barato paso a paso, sólo texto, breve contexto de 32K. Ningún proveedor lo sirve más. DeepSeek V4.1 Flash lo reemplaza: más inteligente, capaz de visión, contexto 1M, y todavía cuesta casi nada.",
        qwen257b:
          "El pequeño modelo de peso abierto 7B de Alibaba a partir de 2024. barato y rápido para chat simple, reescrituras cortas y traducción básica, contexto de 32K. Debilidad en codificación y análisis por los estándares de hoy. Qwen 3.8 Flash es el nuevo Alibaba pick, más inteligente por un poco más.",
        dallE3:
          "DALL -E 3 - OpenAI 's modelo de generación de imagen con imágenes detalladas de alta calidad de los impulsos de texto",
        gptImage1:
          "GPT -Image-1 - OpenAI 's modelo de generación de imagen rápida y asequible",
        fluxSchnell:
          "Flux Schnell - Modelo de generación de imagen rápida de los laboratorios forestales negros optimizado para la velocidad",
        fluxPro:
          "Black Forest Labs ha probado un caballo de trabajo de texto a imagen de la generación FLUX 1. Composición limpia, rápida y fiable, resultados rápidos. Texto en sólo, no edita de una imagen de referencia. FLUX.2 Pro cuesta casi la mitad y toma imágenes de referencia, por lo que este se ajusta principalmente a los avisos ya ajustados para él.",
        flux2Max:
          "El nivel superior de la familia FLUX 2 de los laboratorios forestales negros. Genera de texto o ediciones de imágenes de referencia, con el más detalle y consistencia en la línea. Precio Premium, varias veces el costo de FLUX.2 Pro. Ahorra para fotos de héroe y ediciones de varias referencias difíciles; para el trabajo cotidiano FLUX.2 Pro te consigue la mayor parte del camino por menos. Legado: FLUX.3 lo reemplaza, más afilado y más barato por imagen.",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Black Forest Labs modelo de imagen más rápido y rentable, optimizado para casos de uso de alta velocidad. Legado: FLUX.3 Klein lo reemplaza.",
        riverflowV2Pro:
          "Riverflow V2 Pro - Modelo de generación de imagen más potente de Sourceful con control de alto nivel y renderizado de texto perfecto",
        riverflowV2Fast:
          "Riverflow V2 Fast - Modelo de generación de imagen más rápido de Sourceful, optimizado para implementaciones de producción y flujos de trabajo críticos de latencia",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview - La variante de vista previa más potente de Sourceful, unificado modelo de texto a imagen y imagen a imagen. Legacy: la vista previa se retiró río arriba; use Riverflow V2 Pro.",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview - La variante de previsualización estándar de Sourceful, unificado modelo de texto a imagen y imagen a imagen superando la familia Riverflow 1. Legacy: la vista previa se retiró río arriba; use Riverflow V2 Pro.",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - La variante de previsualización más rápida de Sourceful, unified text-to-image and image-to-image model at the lowest price point. Legacy: la vista previa se retiró río arriba; use Riverflow V2 Fast.",
        flux2Flex:
          "FLUX.2 Flex - Modelo de imagen de los Laboratorios Forestales Negros sobresaliente en la renderización compleja de texto, tipografía y edición multirreferencias en una arquitectura unificada",
        flux2Pro:
          "Black Forest Labs' FLUX.2 workhorse for generating and editing. Toma texto más imágenes de referencia, mantiene los caracteres y los productos consistentes a través de disparos, maneja los largos impulsos bien. Precio medio. Tiro abierto: filtros más ligeros que Imagen 4, pero no explícito; Chroma o Lustify v8 cubren eso. Sube a FLUX.2 Max sólo cuando el detalle realmente importa.",
        gemini3ProImagePreview:
          "Google 's Gemini 3 Pro Image, en vista previa. El Nano Banana más fuerte : sigue los complejos impulsos más de cerca, renderiza texto legible dentro de imágenes y edita imágenes que subes. Filtros de corriente principal, sin llamadas de herramientas, contexto 64K. Varias veces el precio de Nano Banana, así que ahorre para el trabajo donde la calidad de imagen importa.",
        gpt5ImageMini:
          "OpenAI 's GPT-5 Image Mini: GPT-5 Mini habilidades lingüísticas más generación de imágenes y edición en el mismo chat. Lee imágenes, contexto 400K. Filtros de corriente principal, sin llamadas de herramientas. Pricier que Nano Banana y cerca de Nano Banana Pro, así que compare ambos en su propio impulso. Legacy: OpenRouter lo retira el 1 de diciembre de 2026. Utilice Nano Banana 2.1 en chat, o GPT Image 2.6 Flare para la calidad de OpenAI.",
        gpt5Image:
          "GPT-5 se unió con el generador de imagen de OpenAI: chat, luego crear o editar imágenes en la misma conversación, con entrada de imagen. Es bueno para iterar en visuales con palabras sencillas. Sin llamadas de herramientas, y costoso por mensaje. GPT-5 Image Mini es la opción más barata; Nano Banana Pro vale la pena comparar.",
        gpt54Image2:
          "Razonamiento GPT-5.4 combinado con la generación GPT Image 2, por lo que un chat puede pasar de análisis o código a imágenes terminadas. También lee imágenes. No hay llamadas de herramientas, y caro. GPT-5 Image Mini cuesta mucho menos; Nano Banana y Nano Banana Pro son los otros picos de imagen actuales.",
        seedream45:
          "Modelo de imagen de ByteDance para generar y editar en uno. Fuerte en los retratos, manteniendo un tema consistente y combinando varias imágenes de entrada en una escena. Precio medio, cerca de FLUX.2 Pro. Nivel abierto: filtros más ligeros que los principales, no explícitos. Una buena segunda opinión cuando FLUX.2 Pro pierde el aspecto que desea. Legacy: Seedream 5.5 lo reemplaza a la mitad del precio.",
        sdxl: "Stable Diffusion XL - Estabilidad AI 's modelo de generación de imagen abierta de alta calidad",
        cassetteMusic:
          "CassetteAI Music - rápida generación de texto a música en Fal.ai con longitudes de clip hasta tres minutos",
        musicgenStereo:
          "MusicGen de código abierto de Meta en su versión estéreo. Música instrumental de un mensaje de texto: género, humor, instrumentos. No hay voces ni letras. Barato. Bien para camas de fondo y bucles; para canciones con voces utilizan ElevenLabs Music o Sonauto Song.",
        stableAudio:
          "Stable Audio - Modelo de generación de audio y música AI para clips de alta calidad",
        udioV2:
          "Udio v2 - Generación de música AI de alta calidad con voces y calidad de producción completa",
        modelsLabMusicGen:
          "ModelosEl propio modelo de texto a música del laboratorio, con salida MP3, WAV o FLAC. Temas impulsados por imprevistos para música de fondo y jingles. Costos varias veces más que Lyria 3 o MusicGen Stereo, y su modelo subyacente no está documentado. Pruebe Lyria 3 primero por calidad a un precio más bajo.",
        modelsLabElevenlabsMusic:
          "ElevenLabs ' modelo musical. Temas completos con voces y letras en varios idiomas, o instrumentales, dirigidos por su impulso. Se aplican filtros de contenido de corriente principal. Gama de precio superior para la música. Fuerte para canciones pulidas y listas de radio; para canciones más baratas con voces probar Sonauto Song.",
        modelsLabSonautoSong:
          "Sonauto es generador de canciones. Canciones completas con voces y letras en muchos géneros, a un precio bajo para pistas completas. Más rápido, con filtros más ligeros que ElevenLabs. El esmalte de producción varía; para mezclas limpiadoras pagar por ElevenLabs Music o Lyria 3 Pro Preview.",
        modelsLabLyria3:
          "Google es Lyria 3. Sendas originales de alrededor de 30 segundos desde un mensaje de texto, con alta calidad de producción. Muy barato para lo que entrega. Mainstream: Los filtros Google se aplican. Demasiado corto para canciones completas; Lyria 3 Pro Preview maneja la longitud completa.",
        modelsLabCogVideoX:
          "CogVideoX - ModelosEl modelo text-to-video de Lab para generar clips cortos de vídeo",
        modelsLabWanx:
          "Wanx - Modelos modelo de generación de texto a vídeo del laboratorio",
        modelsLabWan22:
          "Wan 2.2 Ultra - ModelosEl modelo de generación de texto a vídeo de alta calidad de Lab",
        modelsLabWan21:
          "Wan 2.1 Ultra - ModelosEl modelo de generación de texto a vídeo de Lab con mejor calidad",
        modelsLabWan25T2V:
          "Wan 2.5 T2V - ModelosEl modelo Wan 2.5 de la laboratorio de generación de texto a vídeo",
        modelsLabWan25I2V:
          "Wan 2.5 I2V - ModelosEl modelo Wan 2.5 de generación de imagen a vídeo",
        modelsLabWan27T2V:
          "El modelo de video Wan 2.7 de Alibaba. Clips de hasta 10 segundos (15 via ModelsLab) a hasta 1080p, muchas ratios de aspecto, audio nativo y los marcos opcionales primero y último para dirigir la toma. Precio medio por segundo. Un todoterreno flexible; para pruebas más baratas use Seedance 1.5 Pro, para el realismo de gama alta Veo 3.1. Legacy: Wan 3.0 lo reemplaza, el mismo precio de 720p con clips de hasta 30 segundos.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - ModelosEl modelo Wan 2.6 de laboratorio de generación de texto a vídeo",
        modelsLabWan26I2V:
          "Alibaba Wan 2.6 modelo de imagen a vídeo: le da un marco inicial y anima la escena, con audio nativo. 5 o 10 segundos clips a 720p o 1080p, paisaje o retrato. Sobre el mismo precio por segundo que Wan 2.7. Elija Wan 2.7 T2V cuando también desea un marco de fin objetivo o más ratios de aspecto.",
        modelsLabWan26I2VFlash:
          "La variante de velocidad de Wan 2.6 imagen a vídeo. Convierte un clip de 5 o 10 segundos a 720p o 1080p con esperas más cortas. El mismo precio por segundo que el estándar Wan 2.6 I2V, así que elija cuando importa la vuelta. El audio nativo no está listado para esta variante; el modelo estándar lo tiene.",
        modelsLabSeedanceT2V:
          "Seedance T2V - Modelo de generación de texto a vídeo de BytePlus",
        modelsLabSeedanceI2V:
          "Seedance I2V - Modelo de generación de imagen a vídeo de BytePlus",
        modelsLabOmnihuman:
          "Omnihuman - Modelo de generación de vídeo humano de BytePlus",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V - Modelo profesional de imagen a vídeo de BytePlus",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V - El rápido modelo profesional de imagen a vídeo de BytePlus",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V - Modelo profesional de texto a vídeo de BytePlus",
        modelsLabOmnihuman15:
          "El OmniHuman 1.5 de ByteDance anima a una persona de una sola foto, impulsada por una pista de audio: cabezas de conversación, canto, gestos. Un especialista en avatares y acaparamiento, no un modelo general de texto a vídeo. Pricier por segundo que la mayoría de los modelos de video de gama media. Para escenas sin persona que habla, elija Kling 3.0 o Wan 2.7.",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro de ByteDance, vendido a través de su nube BytePlus. Texto a vídeo con audio nativo, 480p a 1080p, paisaje o retrato. Uno de los modelos de vídeo más baratos aquí por clip, y 480p cuesta la mitad de la tasa 720p. Ideal para probar ideas y volumen; Seedance 2.0 es el paso hacia arriba para control de marcos, consistencia y 4K.",
        modelsLabVeo2:
          "Veo 2 - Google 's modelo de generación de vídeo de alta calidad a través de ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Google 's último modelo de generación de vídeo a través de ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Google 's rápido modelo de generación de vídeo a través de ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Google 's rápido modelo de vista previa generación de vídeo a través de ModelosLab",
        modelsLabVeo31:
          "Google es un modelo de vídeo insignia. Realismo cinematográfico, audio nativo con el diálogo y efectos de sonido, 4 a 8 segundos clips hasta 4K, primero y último control de marco. El modelo de vídeo más caro del catálogo. Lo desea para los disparos finales; borrador en Veo 3.1 Fast a una fracción del precio.",
        modelsLabVeo31Fast:
          "El nivel más rápido y barato de Google 's Veo 3.1. Mismo 4 a 8 segundos clips, audio nativo, hasta 4K y control de marco, por aproximadamente un tercio a la mitad del precio del Veo 3.1 completo. Devuelve cierta fidelidad a disparos exigentes. El lugar dulce para la mayoría del trabajo Veo 3.1 Lite es más barato todavía.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Kling AI 's image-to-video model version 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo para imagen a vídeo: animar un todavía en un corto clip. Barato por clip y rápido, con el movimiento animado de Kling. No hay audio nativo. Kling 3.0 añade sonido y dispara hasta 15 segundos para más dinero.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo de texto. 5 o 10 segundos clips en 16:9, 9:16 o 1:1, entre los más baratos por clip en el catálogo. Fuerte movimiento por el precio, sin audio nativo. Actualizar a Kling 3.0 T2V para sonido y clips hasta 15 segundos.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Kling AI 's master quality text-to-video model",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Kling AI 's master quality image-to-video model",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, el tier Premium de la generación 2.1 de Kling. 5 o 10 segundos clips de texto con alta fidelidad visual. Precio cerca de la parte superior del catálogo, aproximadamente tres veces Kling 3.0 T2V, que es más nuevo y añade audio nativo. La mayoría vale la pena para los avisos que ya funcionan bien aquí.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master for image-to-video: anima un todavía en un 5 o 10 segundos clip con alta fidelidad visual. Precio cerca de la parte superior del catálogo, aproximadamente tres veces el nuevo Kling 3.0, que también trae audio nativo. Escogelo sólo si su aspecto es exactamente lo que necesitas; Kling V2.5 Turbo I2V es la alternativa barata.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Kling AI 's multi-imagen-a-video modelo versión 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 Pro de Kuaishou. Audio nativo, 3 a 15 segundos clips a 720p, primero y último control de marco, 16:9, 9:16 o 1:1. Lively, movimiento convincente por un precio de rango medio. 720p es el techo; para 1080p y arriba miran Veo 3.1 Fast o Hailuo 3. Kling 3.0 Std cuesta menos cuando empiezas desde una imagen.",
        modelsLabLtx2ProT2V:
          "El LTX-2 Pro de Lightricks. Texto a vídeo a 2K o 4K, en clips de aproximadamente 6 a 10 segundos. Un precio medio de esa resolución, que lo convierte en la ruta presupuestaria a 4K al lado de Veo 3.1. No hay audio nativo en la lista aquí; para el sonido con 4K use Veo 3.1 Fast.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - LTX 's modelo profesional de generación de imagen a vídeo",
        modelsLabLtx23ProI2V:
          "El LTX 2.3 Pro de Lightricks para imagen-a-video: anima un todavía en 2K o 4K en 6 a 10 segundos clips. Más reciente que LTX 2 Pro y precio un poco más alto. Elija cuando una imagen de alta resolución debe mantenerse afilada en movimiento. No hay audio nativo.",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 de MiniMax del texto o de una imagen inicial, conocida por el movimiento físico animado como la danza y la acción. 6 o 10 segundos clips hasta 1080p en 16:9. No hay audio nativo. Precio medio. Hailuo 3 añade sonido, 2K y control de marco por aproximadamente el doble del coste.",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V - Modelo de generación de texto a vídeo de MiniMax 02",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 de MiniMax para imagen a vídeo. Anima un todavía en un clip de 6 o 10 segundos con movimiento expresivo y físico. No hay audio nativo. Hailuo 2.3 Fast I2V hace el mismo trabajo por aproximadamente la mitad del precio con menos pulido.",
        modelsLabHailuo23FastI2V:
          "El nivel rápido y barato de Hailuo 2.3 imagen-a-video. 6 o 10 segundos clips de un todavía alrededor de la mitad del costo de Hailuo 2.3 I2V estándar. Bien para proyectos y volumen, con menos detalle. No hay audio nativo.",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V - Modelo de generación de imagen a vídeo de MiniMax 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - Modelo de generación de vídeo de marco de MiniMax",
        modelsLabSora2:
          "OpenAI 's Sora 2. Física creíble, audio sincronizado y diálogo, 4, 8 o 12 segundos clips a 720p. 16:9 sólo en esta ruta. Precio medio a alto. Sora 2 Pro hace las mismas longitudes en detalle más fino por aproximadamente tres veces el costo.",
        modelsLabSora2Pro:
          "El tier premium de OpenAI 's Sora 2. Audio sincronizado y fidelidad superior, 4, 8 o 12 segundos clips a 720p, 16:9 sólo en esta ruta. Uno de los modelos de vídeo más caros aquí. Lo desea para los disparos finales pulidos; Sora 2 cubre los borradores por alrededor de un tercio del precio.",
        modelsLabGen4Aleph:
          "El Aleph de Runway es un editor de vídeo más que un generador: le da imágenes existentes y añade o elimina objetos, estilos, reluz o cambia el ángulo de la cámara. Muchas relaciones de aspecto, incluyendo amplios formatos de cine. Pricier que la mayoría de los generadores. Para los clips frescos de un aviso, utilice Veo 3.1 Fast o Kling 3.0.",
        modelsLabLipsync2:
          "La lipsync-2 de Sync coincide con el movimiento de la boca en un vídeo existente a una nueva pista de audio. Construido para acaparar, traducir las voces y fijar el diálogo. Edita imágenes, no inventa escenas. Para una persona que habla de una sola foto, utilice Omnihuman 1.5.",
        modelsLabGrokT2V:
          "xAI's Grok Imagínese el vídeo del texto. 1 a 15 segundos clips en 480p o 720p, con un primer marco opcional. Precio medio, rápido y suelto. Más rápido, tan ligeros filtros que Veo o Sora, aunque no explícito. Grok Imagine Video 1.5 añade 1080p. Legado: Grok Imagine Video 1.5 Lite lo reemplaza a menos de la mitad del precio.",
        modelsLabGrokI2V:
          "Grok de xAI Imagínate para la imagen a vídeo. Anima un todavía en un clip de hasta 15 segundos en HD. Un poco más barato que Grok T2V. Fine for quick animated stills; for higher resolution, step up to Grok Imagine Video 1.5. Legacy: Grok Imagine Video 1.5 Lite anima a los quietos por menos.",
        klingV30Std:
          "El nivel estándar del Kling 3.0 de Kuaishou. Los mismos clips de 3 a 15 segundos con audio y control de marco nativos que Kling 3.0 T2V, el nivel Pro, a 720p. El Kling 3 más barato escoge cuando comienzas desde una imagen; para los avisos de texto simple Kling 3.0 T2V a menudo cuesta menos.",
        klingVideoO1:
          "Modelo de vídeo multimodal unificado de Kling, diseñado para generar clips y editarlos desde referencias dentro de un modelo. Audio nativo, 5 o 10 segundos a 720p, primero y último control de marco. Precio medio. Escogelo para el trabajo basado en referencia; para texto-a-video claro, Kling 3.0 T2V es más barato.",
        veo31Lite:
          "Google 's budget Veo 3.1 tier. Audio nativo, de 4 a 8 segundos clips a 720p o 1080p, primero y último control de marco. La forma más barata en Veo, pero no 4K. Bien para clips sociales de alto volumen; subir a Veo 3.1 Fast cuando la calidad importa.",
        seedance2:
          "Seedance 2.0 de ByteDance. Audio nativo, de 4 a 15 segundos clips de 480p hasta 4K, primero y último cuadro, y referencia para mantener los caracteres consistentes. Gama de precio superior. Una opción fuerte para fotos de historia con caracteres recurrentes; Seedance 2.0 Fast es más barato para los proyectos de hasta 720p.",
        seedance2Fast:
          "Cuanto más rápido y más barato sea el Seedance 2.0 de ByteDance. Audio nativo, clips de hasta 15 segundos y control de marco, pero capped a 720p. Alrededor del 60% del precio total del modelo. Bien para los borradores y clips sociales; use Seedance completo 2.0 cuando necesite 1080p o 4K.",
        happyhorse11:
          "La segunda versión del modelo de video HappyHorse de Alibababa. Texto a vídeo, imágenes de imagen a vídeo y referencia, 3 a 15 segundos a 720p o 1080p. No hay audio nativo en esta ruta. Mismo 720p precio que HappyHorse 1.0 y más barato a 1080p, con mejor movimiento y consistencia por Alibaba, por lo que es la opción predeterminada de los dos. Costo de rango medio.",
        happyhorse10:
          "La primera versión del modelo de video HappyHorse de Alibababa. Texto a vídeo, imágenes de imagen a vídeo y referencia, 3 a 15 segundos a 720p o 1080p. No hay audio nativo en esta ruta. Mismo 720p precio que HappyHorse 1.1 pero pricier a 1080p, por lo que la versión más nueva es generalmente el mejor elegido. Mantenimiento de valor para los avisos sintonizados en 1.0.",
        modelsLabGen4T2ITurbo:
          "La variante más rápida y barata del modelo de imagen Gen-4 de Runway. Texto en, imagen fuera, a menos de un tercio del precio de Gen4 Image. Bien por rápidos borradores y iterando en la mirada cinematográfica de Runway. No hay edición de imagen de referencia aquí; para ediciones utilizar FLUX.2 Pro o Seedream 4.5.",
        modelsLabGen4Image:
          "El modelo de imagen Gen-4 de Runway, conocido por un look cinematográfico y cinematográfico. Texto en, imagen fuera. Una de las opciones de imagen priciera en el catálogo, por lo que gana su lugar cuando desea que Runway estético específicamente. Para la iteración barata comienza con Gen4 T2I Turbo; para las ediciones de una imagen de referencia FLUX.2 Pro.",
        modelsLabWan27T2I:
          "El modelo de imagen Wan 2.7 de Alibaba, de la misma familia que los modelos de vídeo Wan. Texto en, imagen fuera, a un precio bajo de rango medio. Una sólida selección para fines generales de ilustraciones y escenas. No hay entrada de imagen de referencia aquí; para las ediciones utilizar Qwen Image 3 o Seedream 4.5.",
        modelsLabGrokT2I:
          "xAI's Grok Imagínate generador de imagen. Texto en, imagen fuera, barato para correr. Más rápido, por lo que los filtros son más ligeros que Imagen 4, aunque no explícitamente. Fine for quick, punchy images; for reference-image edits and the newer generation, Grok Imagine Image 2.0 costs a bit more.",
        modelsLabZImageBase:
          "La base completa y destilada de Z-Image, el modelo de imagen de peso abierto del laboratorio Tongyi de Alibaba. Entre las imágenes más baratas del catálogo. Más variedad que Z Image Turbo, más lento por imagen. Bien por volumen barato y experimentación; para el arte final pulido paso hasta FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "La versión destilada y ajustada a la velocidad de Z-Image, el modelo de peso abierto del laboratorio Tongyi de Alibaba. Imágenes en unos pocos pasos, precio en la parte inferior del catálogo. Buenos resultados fotorreales y texto legible para el costo. Menos variedad que Z Image Base, y cae detrás de FLUX.2 Pro en los impulsos duros.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs' Flux 2 Max text-to-image via ModelsLab",
        modelsLabFluxPro11Ultra:
          "El modo de alta resolución de Flux Pro 1.1, construido para imágenes de unos 4 megapíxeles. Texto sólo. Entre los modelos de imagen priciero aquí. Escogelo para grandes y listos para imprimir; para la edición o trabajo multirreferencias FLUX.2 Pro es más barato y más flexible.",
        modelsLabFluxPro11:
          "Flux Pro 1.1 - Black Forest Labs' Flux Pro 1.1 text-to-image via ModelsLab",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I - Black Forest Labs' Flux 2 Pro text-to-image via ModelsLab",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I - Black Forest Labs' Flux 2 Dev text-to-image via ModelsLab",
        modelsLabFluxT2I:
          "Flux T2I - Black Forest Labs' Flux text-to-image via ModelsLab",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I: genera imágenes a partir de texto con Seedream 4.5 de ByteDance, mediante ModelsLab.",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I: genera imágenes a partir de texto con Seedream 4.0 de ByteDance, mediante ModelsLab.",
        modelsLabSeedreamT2I:
          "Seedream T2I: genera imágenes a partir de texto con Seedream de ByteDance, mediante ModelsLab.",
        modelsLabImagen4Ultra:
          "El nivel superior de Google 's Imagen 4. El impulso más preciso que sigue en la familia y el texto limpio y legible dentro de las imágenes. Mainstream: Los filtros Google se aplican en su totalidad. Alrededor de tres veces el precio de Imagen 4 Fast, así que ahorre para los renders finales. Para menos restricciones use FLUX.2 Pro; para contenido explícito, Chroma.",
        modelsLabImagen4:
          "Google 's estándar Imagen 4. Detalle fotoreal, buena tipografía y un impulso confiable después de un precio de rango medio. Mainstream: Los filtros de Google se aplican, así que espera rechazos en los avisos. Imagen 4 Fast es aproximadamente la mitad del precio para los proyectos; Imagen 4 Ultra maneja la última milla.",
        modelsLabImagen4Fast:
          "El nivel de velocidad de Google 's Imagen 4. La imagen más barata, resultados rápidos, buena para los proyectos y lotes a granel. Devuelve un poco de detalle y precisión rápida frente a Imagen 4 y Ultra. Se aplican filtros de corriente principal. Para un volumen aún más barato con filtros más ligeros, prueba Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3: genera imágenes a partir de texto con Imagen 3 de Google, mediante ModelsLab.",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - Generación de imagen de alta calidad a través de ModelsLab",
        modelsLabNanoBanana:
          "Nano Banana - Generación de imágenes a través de ModelsLab",
        modelsLabQwenT2I:
          "El modelo de texto a imagen de Alibaba Qwen. La línea de imagen Qwen destaca en la reproducción de texto dentro de imágenes, caracteres chinos incluidos, que se adapta a carteles, signos y burlas. Precio en la parte inferior del catálogo. Texto sólo; para la edición de la selección Qwen Image 3.",
        modelsLabRealtimeT2I:
          "ModelosEl punto final en tiempo real de laboratorio, ajustado para la velocidad sobre el pulido. Imágenes rápidas al precio más bajo del catálogo. Úsalo para la ideación rápida, miniaturas y indicaciones de prueba antes de pasar en FLUX.2 Pro o Imagen 4. No es la elección para el arte final o escenas complejas.",
        claudeSonnet5:
          "Anthropic 's first Sonnet 5: balanceado de codificación, agente y análisis trabajan en el contexto 1M, con entrada de imagen. Filtros de corriente principal, cauteloso sobre temas polémicos, débiles en el juego de roles. Claude Sonnet 5.5 cuesta lo mismo y es más nuevo, por lo que no hay razón para quedarse.",
        claudeOpus5:
          "Anthropic 's primer Opus 5, dirigido a las tareas más duras de análisis y análisis, con contexto 1M y entrada de imagen. Precio Premium, filtros de corriente, cauteloso sobre temas controvertidos. Claude Opus 5.5 es más nuevo y más barato.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast - La variante de alto rendimiento de Claude Opus 5 optimizada para aplicaciones sensibles a latencia.",
        claudeFable5:
          "Anthropic 's primera Fable, un razonador de frontera para la síntesis profunda, profundidad creativa y planificación larga-horizona, con contexto 1M e entrada de imagen. Entre los modelos más pricos aquí y la mayoría de los modelos. Claude Fable 5.2 es más nuevo y más barato; para el código, seleccione Claude Opus 5.5.",
        grok45:
          "Modelo de razonamiento Grok 4.5 de xAI: fuerte en el análisis y codificación, lee imágenes, contexto 500K, con la política de contenido abierto de Grok. Grok 4.7 es más nuevo al mismo precio, así que cambia a menos que necesite esta versión exacta.",
        grok46:
          "Grok 4.6 afilado razonamiento y codificación más de 4.5, con entrada de imagen, contexto 500K y filtros de contenido más ligeros de xAI. Todavía es un modelo capaz de filtro abierto. Grok 4.7 cuesta lo mismo y lo reemplaza.",
        gpt56Luna:
          "El nivel rápido y barato de la línea OpenAI 's GPT-5.6, para chat diario y tareas cortas, con contexto 1M y entrada de imagen. No se construye para un análisis profundo. GPT-6 Luna es más nueva y cuesta casi la mitad.",
        gpt56LunaPro:
          "Luna con mejor codificación e instrucción siguiendo, al mismo precio que Luna simple. Bien para ayuda de código barato y tareas estructuradas en el contexto 1M. GPT-6 Luna es más nuevo y cerca de la mitad del precio.",
        gpt56Terra:
          "El nivel medio de OpenAI 's línea GPT-5.6: codificación sólida, análisis y chat sobre el contexto 1M, con entrada de imagen. Debilidad en el juego de roles. GPT-6.1 Terra es más nuevo y aproximadamente la mitad del precio.",
        gpt56TerraPro:
          "Terra con un razonamiento más profundo para el trabajo de análisis pesado, al mismo precio que la llanura Terra, sobre el contexto 1M. Debilidad en el juego de roles. GPT-6.1 Terra es más nuevo y aproximadamente la mitad del precio; subir a GPT-6.1 Sol para más profundidad.",
        gpt56Sol:
          "El nivel superior de OpenAI 's línea GPT-5.6: razonamiento complejo, codificación, escritura y análisis sobre el contexto 1M, con entrada de imagen. Precio Premium, filtros convencionales. GPT-6.1 Sol es más nuevo y cuesta aproximadamente la mitad.",
        gpt56SolPro:
          "Sol con esfuerzo extra de razonamiento para los problemas más difíciles, precio igual que Sol simple, sobre el contexto 1M. Debilidad en el juego de roles, filtros convencionales. GPT-6.1 Sol es más nuevo a la mitad del precio; GPT-6 Astra si necesita la máxima profundidad.",
        gemini36Flash:
          "Google 's Gemini 3.6 Flash: rápido y bueno en codificación, con contexto 1M y texto, imagen, vídeo y entrada de audio. Todavía valor razonable para el trabajo cotidiano. Gemini 3.8 Flash es más nuevo por un poco más.",
        gemini35FlashLite:
          "Google es el Gemini más ligero. Toma texto, imágenes, vídeo y audio, herramientas de llamadas, contexto 1M. Fine for simple high-volume jobs like summaries, tagging and quick responses. Filtros de corriente principal, y no un razonador. Pricier que usted esperaría para un modelo de lite: GPT-6 Luna y Claude Haiku 5.5 cuesta menos.",
        gemini37Flash:
          "Gemini 3.7 Flash trajo mejor razonamiento y análisis a la línea Flash, con contexto 1M y texto, imagen, vídeo y entrada de audio. Un buen modelo diario a un precio justo. Gemini 3.8 Flash lo reemplaza por sólo un poco más.",
        kimiK3:
          "Moonshot AI 's Kimi K3, un modelo de frontera. Fuerte en código, análisis, escritura creativa y funcionamiento de largo agente, lee imágenes y vídeo, llama herramientas, contexto 1M. Filtros más ligeros que los laboratorios US. Kimi K3.1 Pro es la versión más nueva y más fuerte a casi el doble del precio.",
        glm52:
          "Z. AI 's GLM-5.2 : fuerte razonamiento con inferencia rápida y contexto 1M. Bien por codificación y análisis a través de entradas largas, solo texto, nivel de contenido abierto. GLM-5.3 es más nuevo en aproximadamente un tercio del precio.",
        minimaxM3:
          "El antiguo buque insignia de MiniMax. Bien en código, razonamiento y análisis, lee imágenes y vídeo, llama herramientas, contexto 1M, filtros más ligeros que los laboratorios principales. MiniMax M3.1 Flash lo reemplaza: claramente más fuerte en los agentes y código por la mitad del precio o menos.",
        qwen37Flash:
          "El modelo Flash ultra-cheap de Alibaba y una de las opciones más baratas en el catálogo: contexto 1M, texto, imagen y video, llamadas de herramientas. Ideal para trabajos a granel y charla rápida, poco profunda en el razonamiento duro. Qwen 3.8 Flash es más nuevo y más inteligente, pero cuesta varias veces más.",
        qwen38Max:
          "El mejor Qwen de Alibaba. Razonamiento, código y análisis de vanguardia, lee imágenes y vídeos, llama herramientas, contexto 1M. Filtros más ligeros que los laboratorios US. Premium para un modelo abierto: DeepSeek V4 Pro alcanza el mismo nivel por muy inferior a la mitad del precio, si la entrada solo de texto es suficiente.",
        mimoV25:
          "El eficiente MiMo V2.5 de Xiaomi: rápido y bueno en codificación, con contexto 1M y texto, imagen, vídeo y entrada de audio. Nivel de contenido abierto. MiMo V2.6 Flash es más nuevo y cuesta menos de un tercio.",
        mimoV25Pro:
          "MiMo V2.5 Pro de Xiaomi, un profundo modelo de razonamiento y codificación con contexto 1M a bajo precio. Solo texto, nivel de contenido abierto. Todavía más barato que su sucesor MiMo V2.6 Pro, que es la nueva elección.",
        metaMuseSpark12:
          "Meta's Muse Spark 1.2, un modelo de razonamiento multimodal que lee texto, imágenes y vídeo sobre el contexto 1M. Bien en análisis intermodal, nivel de contenido abierto. No está etiquetado para codificación. Meta Muse Spark 1.3 cuesta lo mismo y es más nuevo.",
        mistralMedium35:
          "Mistral AI 's mid-tier Medium 3.5 del laboratorio francés: codificación, análisis e imagen con contexto 262K. Filtros de corriente principal. Mistral Large 4 es más nuevo y cuesta menos de la mitad.",
        claudeOpus55:
          "Anthropic 's top Claude para el trabajo pesado diario. La elección para la codificación más dura, largas tareas de agente y cuidadoso análisis, con fuerte escritura encima. Lee imágenes, llama herramientas, contexto 1M. Precio Premium y filtros principales: disminuye las solicitudes de edgy y hace un pobre socio de juego de roles. Claude Sonnet 5.5 cubre la mayor parte del trabajo diario a la mitad del precio.",
        claudeSonnet55:
          "Anthropic 's workhorse Claude. Codificación fuerte, trabajo de agente, análisis y escritura por la mitad del precio del Opus 5.5. Lee imágenes, llama herramientas, contexto 1M. Filtros de corriente principal, por lo que no para juegos de rol o temas controvertidos. Nivel de precio con GPT-6.1 Sol y Gemini 4 Argon, el obvio cabeza a cabeza.",
        claudeHaiku55:
          "Anthropic es más rápido, más barato Claude. chat rápido, codificación de luz, visión y herramientas, contexto 1M, centavos por mensaje. Filtros de corriente principal, débiles para el juego de roles y temas lácteos. El mismo precio que GPT-6 Luna. Sube a Claude Sonnet 5.5 cuando la tarea necesita verdadera profundidad.",
        claudeFable51:
          "Anthropic 's Fable 5.1, un razonador de frontera para la síntesis profunda, planificación a largo plazo y escritura cuidadosa sobre el contexto 1M. Premiada, llena de corriente, cautelosa sobre temas polémicos y débil en el juego de roles. Claude Fable 5.2 lo reemplaza y cuesta menos; para código, Claude Opus 5.5 es el mejor ajuste.",
        claudeFable52:
          "Anthropic es el razonador de frontera y el Claude más pricito. Construido para una profunda síntesis, investigación y planificación larga-horizona, con fuerte escritura. Lee imágenes, llama herramientas, contexto 1M. Sobre el doble del precio de Opus 5.5, con filtros principales. Para código, Claude Opus 5.5 es el mejor valor.",
        gpt6Astra:
          "El anterior modelo insignia de Astra admite texto, imágenes y herramientas. Su sucesor es GPT-6.2 Astra.",
        gpt6AstraPro:
          "GPT-6 Astra Pro - GPT-6 Astra con esfuerzo prolongado de razonamiento. Más lento, más minucioso. Contexto de token 1.05M.",
        gpt61Sol:
          "La versión anterior de Sol admite texto, imágenes y herramientas. Su sucesor es GPT-6.2 Sol.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro - GPT-6.1 Sol con amplio esfuerzo de razonamiento para el análisis complejo y el código. 1.05M-token context.",
        gpt61Terra:
          "OpenAI es el nivel medio equilibrado. Buena codificación, análisis y chat diario, lee imágenes, llama herramientas, contexto 1M. Medio precio de GPT-6.1 Sol. Filtros de corriente principal, débiles en el juego de roles. Si los filtros más ligeros le convienen, DeepSeek V4 Pro alcanza un nivel más alto para menos.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro - GPT-6.1 Terra con un razonamiento más profundo para el trabajo de análisis pesado.",
        gpt6Luna:
          "OpenAI es ligero GPT-6. Respuestas rápidas para pennies, lee imágenes, llama herramientas, contexto 1M. Bien por preguntas rápidas y simples tareas, no profundo razonamiento o juego de roles. El mismo precio que Claude Haiku 5.5. DeepSeek V4.1 Flash es más barato todavía, con filtros más ligeros.",
        gpt6LunaPro:
          "GPT-6 Luna Pro - GPT-6 Luna con razonamiento extra. Mejor código y seguimiento de instrucciones, el mismo precio bajo. 1.05M-token contexto.",
        gemini4Argon:
          "Google es el buque insignia Gemini. Toma texto, imágenes, vídeo y audio, luego razones, códigos y análisis en el nivel superior. Llama herramientas, contexto 1M. Una fuerte selección cuando la entrada es una grabación, un video o una pila de capturas de pantalla. Filtros de corriente principal. Nivel de precio con Claude Sonnet 5.5 y GPT-6.1 Sol. Gemini 4 Carbon va más allá de las tareas más difíciles; Gemini 4 Hydrogen es más rápido y un cuarto más barato.",
        gemini38Flash:
          "El Flash actual de Google. Rápido y bueno para código y análisis. Acepta texto, imágenes, video y audio, usa herramientas y tiene contexto de 1M. Aplica filtros convencionales. Cuesta menos de la mitad que Gemini 4 Argon, pero más que los modelos abiertos rápidos como Qwen 3.8 Flash. Gemini 4 Hydrogen es mucho más inteligente y rápido por casi el doble del precio.",
        grok47:
          "El Grok más reciente de xAI. Razona con precisión y programa bien. Lee imágenes, usa herramientas y tiene contexto de 500K, cerca de la mitad de otros modelos insignia. Aplica filtros más leves que los grandes laboratorios y responde a más preguntas. Cuesta lo mismo que Qwen 3.8 Max. xAI retiró su variante Fast económica. Para un chat rápido con filtros leves, prueba MiniMax M3.1 Flash o Meta Muse Ember.",
        kimiK31Pro:
          "Moonshot AI es el Kimi más fuerte. El razonamiento de más alto nivel, el código, la escritura creativa y el agente largo corre, lee imágenes y vídeo, llama herramientas, contexto 1M. Filtros más ligeros que los laboratorios US. Nivel de precio con Claude Sonnet 5.5. Kimi K3 se acerca un poco más de la mitad del precio.",
        gpt62Sol:
          "Sol interpreta texto e imágenes, escribe código y usa herramientas.",
        gpt62Astra:
          "Astra combina texto, imágenes y herramientas para resolver tareas complejas de ingeniería y análisis.",
        superGemma426b:
          "La versión de Gemma 4 ajustada por Jiunsong acepta texto junto con una imagen y puede usar herramientas.",
        deepseekV41FlashCsf:
          "La versión abliterada de DeepSeek V4.1 Flash de jcartu razona sobre texto y usa herramientas.",
        maiImage27:
          "El modelo de Microsoft genera aquí imágenes en 1K a partir de texto.",
        maiImage27Flash:
          "Esta variante más rápida de MAI Image 2.7 genera imágenes en 1K a partir de texto.",
        qwen4Max:
          "El nuevo buque insignia de Alibaba y el primer Qwen 4. Razonamiento, código y análisis de vanguardia, lee imágenes y vídeos, llama herramientas, contexto 1M. Filtros más ligeros que los laboratorios US. Piensa antes de cada respuesta, así que las respuestas toman un momento. Un cuarto más barato que Qwen 3.8 Max, que reemplaza.",
        kimiK31ProUncensored:
          "El Kimi más potente de Moonshot AI, con los rechazos eliminados mediante abliteration, disponible en Lyber. Una opción de gama alta sin censura para razonamiento, código y textos largos. Usa herramientas y tiene contexto de 1M. Conserva la postura política del Kimi original. Para posturas políticas a contracorriente, elige UncensoredLM. Solo acepta texto. Cuesta varias veces lo que GLM 5.3 Uncensored, la alternativa potente a menor precio.",
        hy4: "Hy4, el buque insignia de Tencent. Razona por defecto, programa, lee imágenes y usa herramientas, contexto de 1M. Filtros convencionales a un precio bajo para su nivel. Es un nombre nuevo: pruébalo con tus propios prompts. Hy4 Flash es su hermano barato y rápido.",
        hy4Flash:
          "El Hy4 pequeño de Tencent. Lee texto e imágenes, programa y usa herramientas, contexto de 1M. Uno de los modelos más baratos del catálogo, hecho para trabajo en volumen. Cambia profundidad por velocidad: para los problemas difíciles, Hy4.",
        deepseekV41Flash:
          "El modelo rápido de DeepSeek ahora lee imágenes. Rinde bien en código y análisis y es el más económico del catálogo. Usa herramientas, tiene contexto de 1M y filtros más leves. Para problemas que exigen más razonamiento, elige DeepSeek V4 Pro. Para respuestas sin rechazos, elige DeepSeek V4.1 Flash Uncensored.",
        qwen38Flash:
          "Alibaba es rápido Qwen. Texto, imágenes y vídeo en, respuestas rápidas, codificación decente, herramientas de llamadas, contexto 1M. Precio presupuestario, filtros más ligeros. Un conductor diario, no un pensador profundo. Qwen 4 Max toma los problemas difíciles.",
        glm53:
          "Z. AI 's modelo de fundación GLM-5.3. Fuerte razonamiento y código para peniques, herramientas de llamadas, contexto 1M. Solo texto, filtros más ligeros. Entre los modelos inteligentes más baratos del catálogo. ¿Quieres cero rechazos? GLM 5.3 Uncensored es la variante sin filtrar.",
        glm53Flash:
          "Z. AI es rápido GLM. Lee texto, imágenes y vídeo, códigos, herramientas de llamadas, contexto 1M. Construido para trabajos de alto volumen a un precio presupuestario, con filtros más ligeros. Más ligero en el razonamiento que GLM-5.3, que cuesta lo mismo, así que seleccione Flash para entrada y velocidad de los medios.",
        mimoV26Pro:
          "Xiaomi es el mejor MiMo. Top-tier razonamiento, código y análisis, tomando texto, imágenes, vídeo y audio. Llama herramientas, contexto 1M, filtros más ligeros. El modelo más barato en el nivel de inteligencia más alto aquí, una fracción de Gemini 4 Argon para un rango de entrada similar. Un nombre más nuevo, así que pruébalo en tus propios avisos.",
        mimoV26Flash:
          "Xiaomi es rápido MiMo. Toma texto, imágenes, vídeo y audio, códigos bien por su precio, llamadas herramientas, contexto 1M. Filtros muy baratos y más ligeros. Profundidad comercial para la velocidad. MiMo V2.6 Pro es el paso hacia arriba, y MiMo V2.6 Flash Abliterated deja caer los rechazos.",
        metaMuseSpark13:
          "La musa de nivel medio de Meta. Razones y análisis a través de texto, imágenes y vídeo, herramientas de llamadas, contexto 1M, filtros más ligeros. No se construyó para codificación. A este precio Kimi K3 alcanza un nivel más alto, y Meta Muse Wonder es el buque insignia de Meta.",
        metaMuseWonder:
          "Muse insignia de Meta. Top-tier razonamiento, código, análisis y trabajo creativo, tomando texto, imágenes, vídeo y audio. Llama herramientas, contexto 1M, filtros más ligeros que los laboratorios principales. Premium, precio como Claude Opus 5.5. Kimi K3.1 Pro y Gemini 4 Argon se sientan en el mismo nivel a la mitad del precio.",
        mistralLarge4:
          "Mistral AI es insignia, de un laboratorio europeo. Bien en código y análisis, lee imágenes, llama herramientas, contexto 1M, a un precio moderado. Filtros de corriente principal. No nivel superior: DeepSeek V4 Pro cuesta un poco más y razones más profundas.",
        gemini4Hydrogen:
          "Google es rápido Gemini 4. Construido para circuitos de agentes, codificación y análisis rápido, y aterriza en el nivel superior sobre puntos de referencia mientras se ejecuta alrededor de 2,5 veces más rápido que Gemini 3.8 Flash. Toma texto, imágenes, vídeo y audio, herramientas de llamadas, contexto 1M. Filtros de corriente principal. Deja largas y profundas cadenas de razonamiento a Gemini 4 Carbon o Argon. Un cuarto más barato que Argon, casi el doble Gemini 3.8 Flash.",
        gemini4Carbon:
          "Google es el Gemini más fuerte y uno de los modelos más altos en cualquier lugar ahora mismo. Hecho para el código más duro, largos funcionamientos de agente y complejo razonamiento, con texto, imágenes, vídeo y audio en. Llama herramientas, contexto 1M. Filtros de corriente principal. Quema más fichas que Argon por tarea, por lo que cuesta más en la práctica. El precio de lanzamiento coincide con Argon, Claude Sonnet 5.5 y GPT-6.1 Sol hasta el 30 de noviembre, luego se duplica a Claude Opus 5.5 nivel.",
        minimaxM31Flash:
          "El modelo rápido de MiniMax, con un gran salto respecto a M3 en agentes, código y seguridad. Lee imágenes y video, usa herramientas y tiene contexto de 1M. Filtros más leves que los de los grandes laboratorios. Siempre razona antes de responder y escribe respuestas largas, así que tarda más que otros modelos Flash. Cuesta la mitad de M3 o menos, al nivel de DeepSeek V4.1 Flash y Qwen 3.8 Flash.",
        metaMuseEmber:
          "El Muse más pequeño de Meta, diseñado para tareas repetitivas de los agentes: usar herramientas, enrutar solicitudes, extraer datos y responder rápido. Acepta texto, imágenes, video y audio. Tiene contexto de 1M y filtros más leves que los de los grandes laboratorios. Para su tamaño, usa bien herramientas y maneja tareas informáticas, aunque se queda corto en código complejo y razonamiento profundo. Cuesta lo mismo que GPT-6 Luna y Claude Haiku 5.5. El precio se triplica si el prompt supera los 200K tokens.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash con los rechazos eliminados, disponible en Venice. Bueno para código, análisis, ficción y juegos de rol. Lee imágenes, usa herramientas y tiene contexto de 1M. Conserva el entrenamiento y la perspectiva de DeepSeek, que influyen en sus respuestas políticas y pueden atenuar las escenas más oscuras. Para otra perspectiva, elige UncensoredLM. Cuesta unas cuatro veces lo que DeepSeek V4.1 Flash. GLM 5.3 Flash Uncensored es la alternativa sin filtros más económica.",
        drummerArtemis31b:
          "Gemma 4 31B de TheDrummer para el juego de roles y la ficción. Sostiene un personaje, escribe escenas de adultos mutilados y explícitas sin negarse, y mantiene la prosa vívida en lugar de sanitis. Lee imágenes, llama herramientas, contexto 262K. Debilidad en codificación y análisis duro: un narrador, no un razonador. Un finito comunitario en un solo host NanoGPT, por lo que puede abandonar brevemente. Aproximadamente una quinta parte del precio de Venice Role Play Uncensored. Cuando la historia necesita lógica real, DeepSeek V4.1 Flash Uncensored es la elección más inteligente.",
        grokImagineImage2:
          "Grok de segunda generación de xAI Imagina el modelo de imagen. Toma texto o una imagen de referencia, por lo que maneja ediciones así como imágenes frescas. Precio medio. Nivel abierto: filtros más ligeros que los principales, no explícitos. La actualización sobre Grok Imagínese T2I cuando necesite ediciones o una adherencia rápida más ajustada.",
        recraftV41:
          "Recraft V4.1. Construido para el trabajo de diseño: logotipos, carteles, envases, anuncios y cualquier cosa con palabras en él. Tipografía limpia, composición fuerte, toma una imagen de referencia. Aproximadamente 3,5 créditos por imagen a aproximadamente 1K. Se aplican filtros de corriente principal. Go Pro para la salida de calidad de impresión 2K, Flash para proyectos baratos.",
        recraftV41Pro:
          "La prima Recraft V4.1. El mismo sentido del diseño y la tipografía afilada, aproximadamente 2K con detalles más finos. Fabricado para impresión, tomas de producto y activos de marca que envían como son. Aproximadamente 21 créditos por imagen, por lo que el borrador con V4.1 o Flash primero. Se aplican filtros de corriente principal.",
        recraftV41Flash:
          "La velocidad de la nave. Aproximadamente 1,5 segundos por imagen, bajo 1 crédito cada uno, el texto sólo se requiere. Bien para tablas de humor, miniaturas e ideas de pruebas a granel. Menos detalle que Recraft V4.1. Se aplican filtros de corriente principal.",
        qwenImage3:
          "La variante rápida y económica de Qwen Image 3 de Alibaba. Genera imágenes a partir de texto y edita a partir de una imagen de referencia. Útil para retoques rápidos, gráficos con mucho texto y varias pruebas. Qwen Image 3 Pro añade detalle por un poco más. Para editar sin censura, usa Qwen Edit Uncensored.",
        qwenImage3Pro:
          "La variante de Qwen Image 3 de Alibaba que prioriza la calidad. Acepta texto o una imagen de referencia. Ofrece más detalle y un acabado más cuidado que el modelo base por un poco más. Destaca en retoques y texto dentro de imágenes. Nivel abierto con límites para contenido explícito. Para ese contenido, usa Qwen Edit Uncensored.",
        hailuo3:
          "Hailuo 3 de MiniMax. Audio nativo, salida 2K, clips hasta 15 segundos, primer y último control de marco. Un paso claro de Hailuo 2.3 sobre papel, a aproximadamente el doble del precio. Rango de precio superior; para más barato 1080p sin sonido, utilice Hailuo 2.3 T2V.",
        seedance25:
          "Seedance 2.5 de ByteDance. El titular es la longitud: clips de hasta 30 segundos con el control de audio y marco nativo, a 480p o 720p. La Seedance más primitiva por clip. Escogelo para tomas continuas largas; para clips cortos más afilados Seedance 2.0 alcanza 4K.",
        flux3Video:
          "Flux 3 Video - Modelo de generación de video de Black Forest Labs con calidad excepcional y rápida adherencia.",
        grokImagineVideo15:
          "Grok Imagine Video 1.5 de xAI. Clips de hasta 15 segundos a 480p, 720p o 1080p con primer fotograma opcional. Más resolución que Grok T2V, por aproximadamente el doble del precio. Nivel abierto: filtros más leves que Veo o Sora, con límites al contenido explícito.",
        lyria3ProPreview:
          "Google 's premium Lyria 3 tier, todavía en vista previa. Construido para canciones de larga duración con alta calidad de producción. Mainstream: Los filtros Google se aplican. Alrededor de una y media veces el precio de Lyria 3. El estado de vista previa significa que el comportamiento y la disponibilidad todavía pueden cambiar.",
        lyria3ClipPreview:
          "Lyria 3 Clip de Google, en vista previa. Genera clips musicales rápidos y económicos para cabeceras, transiciones y publicaciones en redes sociales. Se aplican los filtros convencionales. Para pistas más largas, usa Lyria 3 o Lyria 3 Pro Preview.",
        geminiNanoBanana21:
          "Google es Nano Banana 2.1. Genera y edita imágenes en el chat, texto e imágenes en una sola respuesta. Alrededor de 3 a 4 créditos por imagen, la mitad del precio de imagen del Nano Banana original, que reemplaza. Fuerte en ediciones precisas y texto legible en imágenes. Filtros de corriente principal, sin llamadas de herramientas. Nano Banana Pro sigue ganando en escenas complejas, a unas cuatro veces el precio.",
        seedream55:
          "El Seedream 5.5 de ByteDance. Genera desde texto o edita hasta diez imágenes de referencia. Fuerte en retratos, personajes consistentes y escenas multiimagen. 2 créditos por imagen, la mitad del precio de Seedream 4.5, que reemplaza. Nivel abierto: filtros más ligeros que los principales, no explícitos.",
        flux3Image:
          "Black Forest Labs' FLUX.3. Detalle afilado, texto más limpio y adherencia más rápida que FLUX.2, desde imágenes de texto o referencia. Aproximadamente 5 créditos por imagen, más barato que FLUX.2 Max, que reemplaza. Ábrete, no explícito. FLUX.2 Pro se mantiene más barato para el trabajo diario; FLUX.3 Klein maneja volumen.",
        flux3Klein:
          "El pequeño, rápido FLUX.3. Bajo 1 crédito por imagen, entre los más baratos del catálogo, y todavía toma imágenes de referencia para ediciones. Construido para borradores, miniaturas y carreras a granel. Menos detalle que completo FLUX.3. Ábrete, no explícito.",
        gptImage26Flare:
          "OpenAI 's GPT Image 2.6, variante de velocidad. Texto o imagen de referencia en, resultados limpios rápido, bueno con texto y diseños. Alrededor de 4 créditos por imagen. Mainstream: Los filtros estrictos de OpenAI se aplican. Para composiciones densas y ediciones de detalle pesado, utilice su hermano Sunburst.",
        gptImage26Sunburst:
          "OpenAI 's GPT Image 2.6, sintonizado para el detalle. Composiciones densas, carteles de texto y ediciones que mantienen intactos los detalles después de la ronda. Alrededor de 6 créditos por imagen. Mainstream: Los filtros estrictos de OpenAI se aplican. El fuego es más rápido y más barato cuando el detalle fino importa menos.",
        geminiOmni12Flash:
          "Gemini Omni 1.2 Flash, el modelo de video de Google. Clips de 3 a 15 segundos con audio nativo, de 360p a 4K y control del primer y último fotograma. Unos 7 créditos por segundo a 720p y 10 a 1080p, menos que Veo 3.1 Fast a la misma resolución. Se aplican los filtros de Google.",
        grokImagineVideo15Lite:
          "El rápido y barato corte de Grok de xAI Imagina el Video 1.5. Clips de 1 a 15 segundos a 480p, 720p o 1080p, primer marco opcional. 3 créditos por segundo a 720p, menos de la mitad del vídeo original Grok Imagine, que reemplaza. Comercios cierta calidad para la velocidad; completo Grok Imagine Video 1.5 se ve mejor. Ábrete, no explícito.",
        wan30:
          "Alibaba's Wan 3.0. Clips de 2 a 30 segundos con audio nativo, 480p a 1080p, primero y último control de marco. 10 créditos por segundo a 720p, igual que Wan 2.7, que reemplaza, más un nivel 480p a la mitad de eso. Larga toma un presupuesto. Ábrete, no explícito.",
        seedance2Mini:
          "Seedance 2.0. Texto o imagen a vídeo, 4 a 15 segundos, audio nativo, control de primer y último marco, a 480p o 720p. Aproximadamente 7,6 créditos por segundo a 720p, debajo de Seedance 2.0 Fast. Bien para los borradores y clips sociales; Seedance 2.0 alcanza 4K cuando lo necesitas. Ábrete, no explícito.",
        seedance25Flash:
          "Seedance de ByteDance 2.5 Flash, el rápido Seedance 2.5. Texto o imagen a vídeo, 4 a 30 segundos, audio nativo, a 480p o 720p. 8.4 créditos por segundo a 480p, 18.9 a 720p, debajo de Seedance completo 2.5. Larga toma por menos. Corre en Venice.ai, anónimo. Ábrete, no explícito.",
        hailuo3Max:
          "Hailuo 3 Max de MiniMax, un entrenamiento más rápido de Hailuo 3. Clips de 5 a 15 segundos a 768p o 480p con control de marco primero y último, sin sonido. 8 créditos por segundo, bien debajo de Hailuo 3. Escogelo para iteraciones rápidas; Hailuo 3 añade 2K y audio nativo. Ábrete, no explícito.",
        runwayGen45:
          "El Gen-4.5 de la pista. Movimiento cinematográfico y fuerte adherencia rápida, texto o primer marco en, 2 a 10 segundos clips a 720p, sin sonido. 12 créditos por segundo, rango medio superior. Un fuerte pico para filmes de estilo cinematográfico; para el sonido en el clip, use Veo 3.1 Fast o Wan 3.0. Ábrete, no explícito.",
      },
    },
    modelUtilities: {
      adultExplicit: "Contenido explícito para adultos",
      adultImplied: "Contenido sugerente para adultos",
      analysis: "Análisis",
      chat: "Chat",
      coding: "Programación",
      conspiracy: "Teorías de conspiración",
      controversial: "Temas controvertidos",
      creative: "Escritura creativa",
      fast: "Rápido",
      harmful: "Contenido potencialmente dañino",
      illegalInfo: "Información sobre actividades ilegales",
      imageGen: "Generación de imágenes",
      legacy: "Modelos anteriores",
      medicalAdvice: "Consejos médicos",
      offensiveLanguage: "Lenguaje ofensivo",
      politicalLeft: "Posturas políticas de izquierda",
      politicalRight: "Posturas políticas de derecha",
      reasoning: "Razonamiento avanzado",
      roleplay: "Juego de rol",
      roleplayDark: "Juego de rol con temas oscuros",
      smart: "Inteligente",
      uncensored: "Sin censura",
      violence: "Violencia",
      vision: "Visión",
    },
    input: {
      attachments: {
        uploadFile: "Adjuntar archivos",
        attachedFiles: "Archivos adjuntos",
        addMore: "Añadir más",
      },
    },
  },

  search: {
    brave: {
      category: "Information",
      get: {
        title: "Buscar en la Web",
        dynamicTitle: "Buscar: {{query}}",
        description:
          "Busque Internet para información actual, noticias, hechos o eventos recientes. Use esto cuando necesite información actualizada o para verificar hechos.",
        form: {
          title: "Parámetros de búsqueda",
          description: "Configura tu consulta de búsqueda web",
        },
        submitButton: {
          label: "Buscar",
          loadingText: "Buscando...",
        },
        backButton: {
          label: "Atrás",
        },
        fields: {
          query: {
            title: "Búsqueda",
            description:
              "Consulta de búsqueda clara y específica. Usa palabras clave en lugar de preguntas.",
            placeholder: "Introduzca su consulta de búsqueda...",
          },
          maxResults: {
            title: "Resultados máximos",
            description: "Número de resultados a la vuelta (1-10)",
          },
          includeNews: {
            title: "Incluir noticias",
            description:
              "Incluir los resultados de las noticias para eventos actuales",
          },
          freshness: {
            title: "Frescura",
            description: "Resultado del filtro por lo recientes que son",
            options: {
              day: "Día pasado",
              week: "Semana pasada",
              month: "Mes pasado",
              year: "Año pasado",
            },
          },
        },
        response: {
          success: {
            title: "Operación completada",
            description: "Ya sea que la búsqueda haya tenido éxito",
          },
          message: {
            title: "Mensaje",
            description: "Mensaje de estado sobre la búsqueda",
          },
          query: {
            title: "Query",
            description: "La consulta de búsqueda que fue ejecutada",
          },
          results: {
            title: "Resultados",
            description: "Array of search results",
            result: "Resultado",
            item: {
              title: "Resultado de la búsqueda",
              description: "Resultado de búsqueda individual",
              url: "URL",
              snippet: "Snippet",
              age: "Edad",
              source: "Fuente",
            },
          },
          cached: {
            title: "Caché",
            description: "Ya se hayan servido los resultados de cache",
          },
          timestamp: {
            title: "Timestamp",
            description: "Cuando se realizó la búsqueda",
          },
        },
        errors: {
          queryEmpty: {
            title: "Se requiere la consulta de búsqueda",
            description: "Proporcione una consulta de búsqueda",
          },
          queryTooLong: {
            title: "Buscar consultas es demasiado largo",
            description: "La consulta debe ser de 400 caracteres o menos",
          },
          timeout: {
            title: "Solicitud de búsqueda cronometrada",
            description: "La búsqueda tardó demasiado en completar",
          },
          searchFailed: {
            title: "Búsqueda fallada",
            description: "Se produjo un error mientras se buscaba",
          },
          validation: {
            title: "Búsqueda inválida",
            description:
              "Por favor, compruebe sus parámetros de búsqueda e inténtelo de nuevo",
          },
          internal: {
            title: "Algo que estaba mal.",
            description:
              "No podríamos completar tu búsqueda. Por favor, inténtelo de nuevo.",
          },
          notConfigured: {
            title:
              "La tecla {{label}} API no está configurada. Añadir {{envKey}} = <your-key> a tu archivo.env. Obtener su llave en {{url}}",
            description: "Configurar {{label}} para habilitar la búsqueda web",
          },
        },
        success: {
          title: "Búsqueda exitosa",
          description: "La búsqueda web se completó con éxito",
        },
      },
      tags: {
        search: "Buscar",
        web: "Web",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Information",
      get: {
        title: "Buscar con Kagi",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Busque en Internet o consiga AI - respuestas propulsadas utilizando Kagi. El modo FastGPT proporciona respuestas completas con fuentes, mientras que el modo de búsqueda devuelve resultados directos.",
        form: {
          title: "Parámetros de búsqueda",
          description: "Configura tu consulta de búsqueda Kagi",
        },
        submitButton: {
          label: "Buscar",
          loadingText: "Buscando...",
        },
        backButton: {
          label: "Atrás",
        },
        fields: {
          query: {
            title: "Búsqueda",
            description: "Consulta o pregunta clara y específica de búsqueda.",
            placeholder: "Introduzca su consulta de búsqueda...",
          },
          mode: {
            title: "Modo de búsqueda",
            description:
              "Elija entre AI - respuestas propulsadas (FastGPT) o resultados de búsqueda directa",
            options: {
              fastgpt: "FastGPT (AI - respuestas propulsadas)",
              search: "Búsqueda (Resultados directos)",
            },
          },
        },
        response: {
          success: {
            title: "Operación completada",
            description: "Ya sea que la búsqueda haya tenido éxito",
          },
          message: {
            title: "Mensaje",
            description: "Mensaje de estado sobre la búsqueda",
          },
          output: {
            title: "Respuesta",
            description: "AI - respuesta generada de FastGPT",
          },
          query: {
            title: "Query",
            description: "La consulta de búsqueda que fue ejecutada",
          },
          references: {
            title: "Referencias",
            description: "Referencias y citas de fuentes",
            reference: "Referencia",
            item: {
              title: "Referencia",
              description: "Referencia fuente con citación",
              url: "URL",
              snippet: "Snippet",
            },
          },
          cached: {
            title: "Caché",
            description: "Ya se hayan servido los resultados de cache",
          },
          timestamp: {
            title: "Timestamp",
            description: "Cuando se realizó la búsqueda",
          },
        },
        errors: {
          queryEmpty: {
            title: "Se requiere la consulta de búsqueda",
            description: "Proporcione una consulta de búsqueda",
          },
          queryTooLong: {
            title: "Buscar consultas es demasiado largo",
            description: "La consulta debe ser de 400 caracteres o menos",
          },
          timeout: {
            title: "Solicitud de búsqueda cronometrada",
            description: "La búsqueda tardó demasiado en completar",
          },
          searchFailed: {
            title: "Búsqueda fallada",
            description: "Se produjo un error mientras se buscaba",
          },
          validation: {
            title: "Búsqueda inválida",
            description:
              "Por favor, compruebe sus parámetros de búsqueda e inténtelo de nuevo",
          },
          internal: {
            title: "Algo que estaba mal.",
            description:
              "No podríamos completar tu búsqueda. Por favor, inténtelo de nuevo.",
          },
          notConfigured: {
            title:
              "La tecla {{label}} API no está configurada. Añadir {{envKey}} = <your-key> a tu archivo.env. Obtener su llave en {{url}}",
            description:
              "Configurar {{label}} para habilitar la búsqueda de Kagi",
          },
        },
        success: {
          title: "Búsqueda exitosa",
          description: "La búsqueda Kagi completó con éxito",
        },
      },
      tags: {
        search: "Buscar",
        web: "Web",
        ai: "IA",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave Search",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
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
          options: {
            start: "Comienzo",
            stop: "Para.",
            toggle: "Toggle",
            status: "Situación",
          },
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
            "No se dispone de dependencias necesarias: {missing}. {recommendations}",
          invalidAction: "Acción inválida: {action}",
          actionFailed: "No se pudo ejecutar la acción: {error}",
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
      title: "Discurso al texto",
      description:
        "Convertir audio en texto usando la transcripción AI. Facturado por segundo de audio a la tarifa del modelo elegido",
      form: {
        title: "Traducción de audio",
        description:
          "Sube un archivo de audio para transcribe. Propuesto por segundo a la tasa del modelo elegido",
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
        audioTooShort:
          "Grabando demasiado corto. Mantenga el botón más largo y hable con claridad.",
        noAudioFile: "No se proporciona ningún archivo de audio",
        internalError: "Error del servidor interno",
        noPublicId: "No public ID received",
        pollFailed:
          "No se pudieron consultar los resultados de la transcripción",
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
      sk: "Eslovaco",
      fr: "Francés",
      it: "Italiano",
    },
    models: {
      descriptions: {
        openaiWhisper:
          "OpenAI 's Whisper speech recognition, trained on 99 languages. Transcribe entrevistas, notas de voz y reuniones y hace frente bien a acentos y ruido de fondo. Barato por uso. No hay etiquetas de altavoz, y en silencios largos puede inventar texto. Para una nueva opción OpenAI, prueba GPT -4o Mini Transcribe.",
        deepgramNova2:
          "Deepgram Nova-2 - El discurso a texto rápido y preciso con robustez de ruido",
        whisperLargeV3:
          "Whisper Large V3 - Modelo OpenAI de peso abierto, 99 idiomas, mucho más barato que los susurros anfitriones-1.",
        voxtralSmall: "Voxtral Small de Mistral transcribe grabaciones de voz.",
        voxtralMini:
          "Transcribe Voxtral Mini - transcripción Mistral con diarización y horarios de segmento, hasta 10 minutos.",
        qwen3Asr:
          "Transcribe audio en 30 idiomas y 22 dialectos chinos con Qwen3 ASR.",
        parakeetV3:
          "Transcribe 25 idiomas europeos con detección automática del idioma y puntuación.",
        nemotron35Transcribe:
          "Transcribe hasta una hora de audio en 40 idiomas con NVIDIA Nemotron.",
        nemotronAsr:
          "Nemotron ASR - NVIDIA reconocimiento multilingüe de discurso abierto, 40 locales, baja latencia.",
        gpt4oMiniTranscribe:
          "GPT -4o Mini Transcribe - Tasa de error de palabras más baja que Whisper, mejor detección de idiomas.",
      },
    },
  },
  textToSpeech: {
    category: "Agent",
    tags: {
      speech: "Discurso",
      tts: "Texto a texto",
      ai: "IA",
    },

    post: {
      title: "Texto para el discurso",
      description:
        "Convertir texto en discurso de sonido natural utilizando AI. Billed per character at the chosen voice's rate",
      form: {
        title: "Texto a la conversión del habla",
        description:
          "Escriba texto para convertir al discurso. Billed per character at the chosen voice's rate",
      },
      text: {
        label: "Texto",
        description: "Texto para convertir al discurso",
        placeholder: "Escriba el texto que desea convertir al discurso...",
      },
      voice: {
        label: "Voz",
        description: "Modelo de voz para la síntesis del discurso",
      },
      response: {
        title: "Resultado de audio",
        description: "El audio del discurso generado",
        success: "Operación completada",
        audioUrl: "Audio URL",
      },
      errors: {
        validation_failed: {
          title: "Error de validación",
          description: "El texto o los parámetros proporcionados son inválidos",
        },
        network_error: {
          title: "Error de red",
          description: "No se pudo conectar con el servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes iniciar sesión para usar texto a palabra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para usar texto a palabra",
        },
        not_found: {
          title: "No encontrado",
          description: "No se encontró el recurso solicitado",
        },
        server_error: {
          title: "Error del servidor",
          description:
            "Se produjo un error al convertir el texto en el discurso",
        },
        unknown_error: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsaved_changes: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
        notConfigured:
          "La tecla {{label}} API no está configurada. Añadir {{envKey}} = <your-key> a tu archivo.env. Obtener su llave en {{url}}",
        conversionFailed: "Sintetización del discurso falló: {{error}}",
        noText: "No se proporcionó texto",
        noAudioUrl: "No se recibió ningún URL de audio del proveedor",
        audioFetchFailed:
          "Incapaz de crear el archivo de audio. Por favor, inténtelo de nuevo.",
        providerError: "Error del proveedor: {{error}}",
        internalError: "Error del servidor interno",
        unsupportedProvider: "Proveedor TTS sin soporte para voz: {{voiceId}}",
        creditsFailed: "Fallado para deducir créditos: {{error}}",
        balanceCheckFailed:
          "Incapaz de comprobar su saldo de crédito. Por favor, inténtelo de nuevo.",
        insufficientCredits:
          "No tienes suficientes créditos para esta conversión. Por favor, añada más créditos para continuar",
      },
      success: {
        title: "Operación completada",
        description: "Texto convertido al discurso con éxito",
        conversionComplete: "Sintetización de discursos terminada con éxito",
      },
    },
    languages: {
      en: "Inglés",
      de: "Alemán",
      pl: "Polaco",
      es: "Español",
      sk: "Eslovaco",
      fr: "Francés",
      it: "Italiano",
    },
    models: {
      descriptions: {
        openaiAlloy:
          "OpenAI es voz de aleación. Equilibrado y neutral, ni claramente masculino ni femenino, con un ritmo constante. Fita narración, explicadores y contenido profesional donde la voz debe mantenerse fuera del camino. Costa una pequeña fracción de un centavo. Menos calor que Nova, menos peso que Onyx.",
        openaiNova:
          "OpenAI es voz de Nova. Brillante, cálido y amistoso, con un tono femenino. Asiste a asistentes, aplicaciones de conversación y lecturas superiores. Muy barato. Menos adecuado para material grave o formal; Onyx lo lleva mejor.",
        openaiOnyx:
          "OpenAI es voz Onyx. Voz masculina profunda y calmada con autoridad. Fita documentales, narración formal y anuncios. Muy barato. Puede sonar pesado para chat casual; Nova es el más ligero, más agradable.",
        openaiEcho: "OpenAI Echo - Voz clara y articulada con ritmo natural",
        openaiShimmer:
          "OpenAI Shimmer - Voz expresiva y dinámica para contenido atractivo",
        openaiFable: "OpenAI Fable - Voz expresiva, narrativa",
        elevenlabsRachel:
          "ElevenLabs Rachel - Voz femenina natural con rango emocional",
        elevenlabsJosh:
          "ElevenLabs Josh - Voz masculina natural con tono de conversación",
        elevenlabsBella:
          "ElevenLabs Bella - Caliente voz femenina con entrega suave",
        elevenlabsAdam:
          "ElevenLabs Adam - Voz masculina profesional para la creación de contenido",
        elevenlabsRachelTurbo:
          "ElevenLabs Rachel Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
        elevenlabsJoshTurbo:
          "ElevenLabs Josh Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
        elevenlabsBellaTurbo:
          "ElevenLabs Bella Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
        elevenlabsAdamTurbo:
          "ElevenLabs Adam Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
        kokoroBella:
          "Kokoro Bella - Modelo de 82M de peso abierto, cálida voz femenina americana. Sin filtro de contenido.",
        qwen3Ryan:
          "Ryan lee en voz alta en 10 idiomas, incluido el alemán, con el modelo de voz abierto Qwen3.",
        orpheusTara:
          "Tara lee en inglés con una entonación expresiva y efectos de voz.",
        kokoroSarah:
          "Kokoro Sarah - Modelo de 82M de peso abierto, clara voz femenina americana. Sin filtro de contenido.",
        kokoroNicole:
          "Kokoro Nicole - Modelo de 82M de peso abierto, suave voz femenina de bajo llave. Sin filtro de contenido.",
        kokoroAdam:
          "Kokoro Adam - Modelo 82M de peso abierto, voz masculina americana estable. Sin filtro de contenido.",
        kokoroMichael:
          "Kokoro Michael - Modelo de 82M de peso abierto, voz masculina americana segura. Sin filtro de contenido.",
        kokoroEmma:
          "Kokoro Emma - Modelo de 82M de peso abierto, voz femenina británica. Sin filtro de contenido.",
        kokoroGeorge:
          "Kokoro George - Modelo 82M de peso abierto, voz masculina británica. Sin filtro de contenido.",
        voxtralPaul:
          "Voxtral Mini lee textos en inglés con la voz neutra de Paul.",
        inworldAshley:
          "Inworld Ashley - Voz femenina rápida y de bajo costo con entrega animada.",
        inworldCraig:
          "Inworld Craig - Voz masculina británica rápida y de bajo costo.",
        xaiEve:
          "xAI Eve - Voz femenina expresiva con controles de emoción inline.",
        geminiZephyr:
          "Gemini Zephyr - Voz femenina brillante, 100+ idiomas, instrucciones de entrega.",
        geminiPuck:
          "Gemini Puck - Voz masculina alta, 100+ idiomas, instrucciones de entrega.",
      },
    },
  },
};
