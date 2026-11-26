import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    threadModerationStatus: {
      visible: "Visible",
      underReview: "En examen",
      removed: "Retirado",
    },
    threadReportReason: {
      spam: "Spam",
      illegal: "Contenido ilegal",
      abuse: "Abuso o acoso",
      csamFlag: "Protección de los niños",
      other: "Otro",
    },
    threadModerationAction: {
      dismiss: "Informes de desestimación (restoreo)",
      remove: "Eliminar el contenido",
      banAuthor: "Eliminar y prohibir el autor",
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
        description: "Utilice su micrófono para hablar con su compañero de AI:",
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
    failedWithMessage: "Failed to capture screenshot: {{message}}",
    tryAgain:
      "Falló para capturar la captura de pantalla. Por favor, inténtalo de nuevo.",
    noMessages:
      "No podía encontrar el área de mensajes de chat. Por favor, asegúrese de tener mensajes en el chat.",
    quotaExceeded:
      "La cuota de almacenamiento superó. Captura de pantalla es demasiado grande.",
    canvasError: "Failed to convert screenshot to image format.",
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
        "El micrófono está bloqueado. Configuración de sistema abierto → Privacidad &amp; Seguridad → Micrófono y habilitar su navegador.",
      "permission-dismissed":
        "El micrófono está cerrado. Toque el micrófono de nuevo y elija Permitir.",
      "permission-denied-site":
        "El micrófono bloqueado para este sitio. Haga clic en el icono izquierdo de la barra de direcciones → Micrófono → Permitir, luego probar de nuevo.",
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
        "Modelo AI sin censura para conversaciones creativas y sin restricciones",
      freedomgptLiberty:
        "FreedomGPT Liberty - Modelo AI sin censura enfocado en la expresión libre y el contenido creativo",
      gabAiArya:
        "Gab AI Arya - Modelo AI de conversación sin censura con libertad de expresión y capacidades creativas",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Preview (Custom Tools) - Gemini 3.1 Pro variante con una mejor selección de herramientas que evita el uso excesivo de herramientas bash a favor de funciones de terceros más eficientes, ideales para agentes de codificación y flujos de trabajo multiherramientas",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview - Google 's modelo multimodal que genera imágenes directamente desde los impulsos de texto a través del chat, soportando tanto el texto como la salida de imagen en la misma conversación",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Preview - Google 's modelo de alta eficiencia optimizado para casos de uso de alto volumen, superando el Gemini 2.5 Flash Lite con mejoras en audio, ranking de RAG, traducción y terminación del código",
      gemini3Pro:
        "Google Gemini 3 Pro - Modelo multimodal avanzado AI con ventana de contexto grande y potentes capacidades de razonamiento",
      gemini35Flash:
        "Gemini 3.5 Flash - Codificación y razonamiento de Pro cercano a costo Flash. Maneja texto, imágenes, vídeo, audio y PDF. Bucles paralelíticos incorporados. Niveles de pensamiento de mínima a alta para un control de coste/rendimiento preciso.",
      gemini3Flash:
        "Google Gemini 3 Flash - Modelo rápido y eficiente AI optimizado para respuestas rápidas",
      deepseekV32:
        "DeepSeek V3.2 - Modelo de razonamiento de alto rendimiento con capacidades avanzadas de codificación",
      deepseekV4Pro:
        "DeepSeek V4 Pro - 1.6T parámetro Fuente de alimentación MoE con contexto 1M. Construido para análisis de base completa, razonamiento complejo y flujos de trabajo de agentes multi-pasos.",
      deepseekV4Flash:
        "DeepSeek V4 Flash - 284B MoE a un costo cercano a cero. contexto 1M, inferencia rápida, codificación fuerte. La elección eficiente de la carga de trabajo de alto rendimiento.",
      gpt55:
        "GPT-5.5 - OpenAI 's modelo de frontera para cargas de trabajo profesionales complejas. Razonamiento más fuerte, mayor fiabilidad, mejor eficiencia token. contexto 1M+ con entradas de texto e imagen.",
      gpt55Pro:
        "GPT-5.5 Pro - OpenAI 's modelo de máxima capacidad para el razonamiento profundo en cargas complejas y altas tomas de trabajo. contexto 1M+, resolución de problemas a largo plazo, codificación de agentes, ejecución multi-paso precisa.",
      gpt54Pro:
        "GPT-5.4 Pro - OpenAI 's modelo más avanzado con el razonamiento mejorado, 1M+ ventana contextual y rendimiento superior para tareas complejas y de alto rendimiento",
      gpt54:
        "GPT-5.4 - OpenAI 's último modelo de frontera unificar Codex y GPT, con 1M+ ventana contextual para el razonamiento de alto contenido, codificación y análisis multimodal",
      gpt53Codex:
        "GPT-5.3 -Codex - OpenAI 's más avanzado modelo de codificación de software de frontera que combina ingeniería de software con amplio razonamiento, optimizado para los flujos de trabajo de uso de herramientas de larga duración y tareas complejas de desarrollo",
      gpt53Chat:
        "GPT-5.3 Chat - Actualizado modelo de conversación ChatGPT que ofrece respuestas más precisas y contextuales con significativa reducción de las negativas innecesarias y cavernas",
      gpt52Pro:
        "GPT-5.2 Pro - Modelo avanzado OpenAI con capacidades de razonamiento y codificación mejoradas",
      gpt52:
        "GPT-5.2 - Modelo OpenAI de alto rendimiento para tareas complejas y análisis",
      gpt52_chat:
        "GPT-5.2 Chat - Modelo optimizado OpenAI para interacciones conversales",
      dolphin3_0_r1_mistral_24b:
        "Delfín 3.0 R1 Mistral 24B - Modelo de lenguaje grande sin censura basado en Mistral",
      dolphinLlama3_70B:
        "Delfines Llama 3 70B - Modelo de lenguaje grande sin censura basado en Llama 3",
      veniceUncensored:
        "Venice Uncensored 1.1 - Modelo AI más sin censura con soporte para llamadas de herramientas. Diseñado para la máxima libertad creativa y la interacción auténtica. Ideal para la exploración abierta, el juego de roles y el diálogo sin filtrar con restricciones mínimas de contenido.",
      claudeOpus45:
        "Claude Opus 4.5 - Modelo Claude más potente con un razonamiento excepcional y capacidades creativas",
      claudeOpus46:
        "Claude Opus 4.6 - Potente modelo Claude con un razonamiento excepcional y capacidades creativas",
      claudeOpus47:
        "Claude Opus 4.7 - Modelo Opus de generación previa. Conseguido por 4.8.",
      claudeOpus48:
        "Claude Opus 4.8 - Anthropic 's más capaz generalmente disponible modelo Opus. Construido para trabajos de larga duración, codificación compleja y razonamiento multi-paso a través de salidas muy largas.Contexto 1M-token. Admite textos, imágenes y entradas de archivos.",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Anthropic es el modelo más capaz de clase Sonnet con el rendimiento fronterizo en codificación, agentes y trabajo profesional",
      claudeHaiku45:
        "Claude Haiku 4.5 - Modelo Claude rápido y eficiente optimizado para la velocidad y eficacia en función de los costos",
      glm5_1:
        "GLM-5.1 - Z. AI 's modelo de codificación de próxima generación construido para tareas largas. Funciona de forma autónoma durante 8+ horas en una sola tarea: planificación, ejecución y autoproducción hasta que ofrezca resultados de ingeniería.",
      glm5: "GLM-5 - Z. AI 's modelo de fundación de código abierto insignia diseñado para sistemas complejos diseño y flujos de trabajo de agentes a largo plazo, rivalizando con los principales modelos de código cerrado",
      glm5Turbo:
        "GLM-5 Turbo - Z. AI 's modelo de próxima generación muy optimizado para entornos impulsados por agentes con inferencia rápida, mejora compleja de la descomposición de instrucciones y estabilidad de tareas ampliada",
      glm46:
        "GLM-4 6B - Modelo AI bilingüe eficiente chino-inglés con fuertes capacidades generales",
      glm47:
        "GLM-4 7B - Modelo bilingüe avanzado chino-inglés con mejores capacidades de razonamiento y codificación",
      glm47Flash:
        "GLM-4 7B Flash - Modelo Chino-Inglés ultra rápido optimizado para respuestas rápidas",
      kimiK2:
        "Kimi K2 - Modelo AI chino potente con excelente comprensión del contexto",
      kimiK2_5:
        "Kimi K2.5 - Moonshot AI 's modelo de generación anterior con fuertes motivaciones de largo contexto y capacidades de codificación",
      kimiK2_6:
        "Kimi K2.6 - Moonshot AI 's modelo multimodal de próxima generación para la codificación larga-horizon, UI / UX generación de impulsos e imágenes, y orquestación multiagente con arquitectura de enjambre agente escalando a cientos de subagentes paralelos",
      claudeSonnet45:
        "Claude Sonnet 4.5 - Anthropic 's modelo Sonnet de generación anterior con capacidades de codificación y análisis fuertes",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Agente autónomo AI propulsado por Claude Sonnet vía Anthropic 's Agente SDK. Ejecuta las herramientas de forma independiente con el razonamiento incorporado.",
      claudeAgentHaiku:
        "Claude Agent Haiku - Agente AI autónomo rápido alimentado por Claude Haiku vía Anthropic 's Agent SDK. Optimizado para la velocidad con la ejecución de herramientas.",
      claudeAgentOpus:
        "Claude Agent Opus - El agente AI autónomo más poderoso propulsado por Claude Opus vía Anthropic 's Agent SDK. Inteligencia máxima con ejecución de herramientas.",
      grok4:
        "Grok 4 - modelo de razonamiento insignia de xAI con capacidades de visión y búsqueda web",
      grok4Fast:
        "Grok 4 Fast - Modelo de alta velocidad de xAI con contexto de token 2M optimizado para respuestas rápidas",
      grok43:
        "Grok 4.3 - Modelo de razonamiento de xAI con contexto de token de 1M, alta precisión factual y siempre en el razonamiento para flujos de trabajo agentes y investigación profunda",
      grok420Beta:
        "Grok 4.20 (Legacy) - Modelo insignia anterior de xAI con llamadas de herramienta, baja tasa de alucinación y contexto de token 2M",
      gpt5Pro:
        "GPT-5 Pro - OpenAI 's modelo premium con un razonamiento de alto nivel y capacidades avanzadas de codificación",
      gpt5Codex:
        "GPT-5 Codex - OpenAI 's modelo de codificación especializado con una programación excepcional y capacidades técnicas",
      gpt51Codex:
        "GPT 5.1 Codex - Actualizado modelo de codificación OpenAI con capacidades creativas y de programación mejoradas",
      gpt51:
        "GPT 5.1 - OpenAI 's eficiente modelo de uso general con fuerte razonamiento y análisis",
      gpt5: "GPT-5 - OpenAI modelo insignia con amplia inteligencia y capacidades versátiles",
      gpt54Mini:
        "GPT-5.4 Mini - OpenAI 's eficiente variante GPT-5.4 optimizada para cargas de trabajo de alto rendimiento con fuerte razonamiento, codificación y uso de herramientas a menor costo",
      gpt54Nano:
        "GPT-5.4 Nano - OpenAI 's más ligero y rentable modelo optimizado para tareas críticas de velocidad tales como clasificación, extracción de datos y ejecución subagente",
      gpt5Mini:
        "GPT-5 Mini - OpenAI 's modelo rápido ligero para tareas diarias rápidas",
      gpt5Nano:
        "GPT-5 Nano - OpenAI es el modelo más pequeño y asequible para tareas sencillas de conversación",
      gptOss120b:
        "GPT - OSS 120B - OpenAI 's modelo de parámetro de código abierto 120B con capacidades de codificación fuertes",
      kimiK2Thinking:
        "Kimi K2 Thinking - Kimi 's modelo basado en el razonamiento con pensamiento analítico y paso a paso",
      minimaxM27:
        "MiniMax M2.7 - El modelo de próxima generación de MiniMax construido para la productividad autónoma del mundo real, la colaboración multiagente y los flujos de trabajo de producción incluyendo depuración de códigos, modelado financiero y generación de documentos",
      mimoV2Pro:
        "MiMo V2 Pro - Modelo de fundación de 1T+ de Xiaomi con contexto 1M, muy optimizado para orquestación de agentes, automatización de flujos de trabajo complejos y tareas de ingeniería de producción",
      glm45Air:
        "GLM 4.5 AIR - Z. AI 's modelo ultrarrápida de peso ligero para interacciones rápidas de conversación",
      glm45v:
        "GLM 4. 5v - Z. AI 's modelo con capacidad de visión con comprensión de imágenes y capacidades de chat",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - Google 's modelo de entrada Gemini con gran contexto y respuestas rápidas",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - Google 's eficiente modelo multimodal con 1M contexto de token para tareas rápidas",
      geminiFlash25Pro:
        "Gemini 2.5 Pro - Google 's modelo de generación anterior Pro con gran contexto y fuerte razonamiento",
      deepseekV31:
        "DeepSeek V3.1 - DeepSeek 's modelo de generación anterior con capacidades fuertes de codificación y análisis",
      deepseekR1:
        "DeepSeek R1 - DeepSeek 's modelo basado en el razonamiento con problemas avanzados paso a paso",
      qwen3235bFree:
        "Qwen3 235B - El gran modelo abierto de Alibaba con parámetros 235B para tareas complejas de codificación y razonamiento",
      deepseekR1Distill:
        "DeepSeek R1 Distill - Versión compacta destilada de DeepSeek R1 con capacidades de razonamiento eficiente",
      qwen257b:
        "Qwen 2.5 7B - Modelo 7B compacto de Alibaba para tareas de conversación rápidas y asequibles",
      dallE3:
        "DALL -E 3 - OpenAI 's modelo de generación de imagen con imágenes detalladas de alta calidad de los impulsos de texto",
      gptImage1:
        "GPT -Image-1 - OpenAI 's modelo de generación de imagen rápida y asequible",
      fluxSchnell:
        "Flux Schnell - Modelo de generación de imagen rápida de los laboratorios forestales negros optimizado para la velocidad",
      fluxPro:
        "Flux Pro 1.1 - Modelo de generación de imagen profesional de los laboratorios forestales negros con calidad superior y adherencia rápida",
      flux2Max:
        "FLUX.2 Max - Modelo de imagen de alto nivel de los Laboratorios Forestales Negros con la más alta calidad de imagen, comprensión rápida y consistencia de edición",
      flux2Klein4b:
        "FLUX.2 Klein 4B - Black Forest Labs modelo de imagen más rápido y rentable, optimizado para casos de uso de alta velocidad",
      riverflowV2Pro:
        "Riverflow V2 Pro - Modelo de generación de imagen más potente de Sourceful con control de alto nivel y renderizado de texto perfecto",
      riverflowV2Fast:
        "Riverflow V2 Fast - Modelo de generación de imagen más rápido de Sourceful, optimizado para implementaciones de producción y flujos de trabajo críticos de latencia",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Preview - La variante de vista previa más potente de Sourceful, unificado texto a imagen y modelo de imagen a imagen",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Preview - La variante de previsualización estándar de Sourceful, unificado modelo de texto a imagen y imagen a imagen superando el río 1 familia",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview - La variante de previsualización más rápida de Sourceful, unificado texto a imagen y modelo de imagen a imagen al precio más bajo",
      flux2Flex:
        "FLUX.2 Flex - Modelo de imagen de los Laboratorios Forestales Negros sobresaliente en la renderización compleja de texto, tipografía y edición multirreferencias en una arquitectura unificada",
      flux2Pro:
        "FLUX.2 Pro - Modelo de generación y edición de imágenes de alta gama de Laboratorios Forestales Negros con calidad visual de nivel fronterizo, fuerte adherencia rápida y reproducción de caracteres consistente",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Preview) - Google 's modelo de generación de imagen más avanzado con un mejor razonamiento multimodal, el terreno real, la síntesis visual de alta fidelidad y la renderización de texto líder en la industria",
      gpt5ImageMini:
        "GPT-5 Image Mini - OpenAI 's eficiente modelo de generación de imagen multimodal que combina las capacidades de lenguaje GPT-5 Mini con una generación de imagen rápida y asequible",
      gpt5Image:
        "GPT-5 Image - OpenAI 's modelo multimodal insignia que combina las capacidades de lenguaje GPT-5 con la generación y edición de imágenes de última generación",
      gpt54Image2:
        "GPT-5.4 Image 2 - OpenAI 's modelo multimodal de próxima generación que combina el razonamiento GPT-5.4 con la generación GPT Image 2. Se mueve perfectamente entre codificación, análisis y creación visual en una sola conversación.",
      seedream45:
        "Seedream 4.5 - El último modelo de generación de imagen de ByteDance con mejoras integrales en la edición de consistencia, refinamiento de retratos y composición multiimagen",
      sdxl: "Stable Diffusion XL - Estabilidad AI 's modelo de generación de imagen abierta de alta calidad",
      cassetteMusic:
        "CassetteAI Music - rápida generación de texto a música en Fal.ai con longitudes de clip hasta tres minutos",
      musicgenStereo:
        "MusicGen Stereo - Modelo de generación de música estéreo de código abierto de Meta a través de Replicate",
      stableAudio:
        "Stable Audio - Modelo de generación de audio y música AI para clips de alta calidad",
      udioV2:
        "Udio v2 - Generación de música AI de alta calidad con voces y calidad de producción completa",
      modelsLabMusicGen:
        "ModelosLab Music Gen - Generación de música AI a partir de instrucciones de texto, soportando MP3/ WAV / FLAC salida",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music - Generación de música de alta calidad propulsada por ElevenLabs a través de ModelosLab",
      modelsLabSonautoSong:
        "Sonauto Song - Generación completa de canciones con voces, apoyando varios géneros hasta 4:45 min pistas",
      modelsLabLyria3:
        "Lyria 3 - Google 's modelo avanzado de generación de música creando pistas originales de 30 segundos del texto",
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
        "Wan 2.7 T2V - El último modelo Wan 2.7 de Alibaba con relación de aspecto flexible y salida 1080p",
      modelsLabWan26T2V:
        "Wan 2.6 T2V - ModelosEl modelo Wan 2.6 de laboratorio de generación de texto a vídeo",
      modelsLabWan26I2V:
        "Wan 2.6 I2V - ModelosEl modelo de generación Wan 2.6 de laboratorio de imagen a vídeo",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash - ModelosEl rápido Wan 2.6 modelo de generación de imagen a vídeo",
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
        "Omnihuman 1.5 - El mejor modelo de generación de vídeo humano de BytePlus",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro - Modelo avanzado de generación de vídeo de BytePlus",
      modelsLabVeo2:
        "Veo 2 - Google 's modelo de generación de vídeo de alta calidad a través de ModelsLab",
      modelsLabVeo3:
        "Veo 3 - Google 's último modelo de generación de vídeo a través de ModelsLab",
      modelsLabVeo3Fast:
        "Veo 3 Fast - Google 's rápido modelo de generación de vídeo a través de ModelsLab",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview - Google 's rápido modelo de vista previa generación de vídeo a través de ModelosLab",
      modelsLabVeo31:
        "Veo 3.1 - Google mejora el modelo de generación de vídeo Veo 3 a través de ModelsLab",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast - Google 's rápido Veo 3.1 modelo de generación de vídeo a través de ModelsLab",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V - Kling AI 's image-to-video model version 2.1",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V - Kling AI 's turbo image-to-video model version 2.5",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V - Kling AI 's turbo text-to-video versión 2.5",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V - Kling AI 's master quality text-to-video model",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V - Kling AI 's master quality image-to-video model",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V - Kling AI 's master quality text-to-video model v2.1",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V - Kling AI 's master quality image-to-video model v2.1",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V - Kling AI 's multi-imagen-a-video modelo versión 1.6",
      modelsLabKling30T2V:
        "Kling 3.0 T2V - Kling AI 's text-to-video model version 3.0",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V - LTX 's modelo profesional de generación de texto a vídeo",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V - LTX 's modelo profesional de generación de imagen a vídeo",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V - LTX mejora el modelo profesional de imagen a vídeo",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V - Modelo de generación de texto a vídeo de MiniMax 2.3",
      modelsLabHailuo02T2V:
        "Hailuo 02 T2V - Modelo de generación de texto a vídeo de MiniMax 02",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V - Modelo de generación de imagen a vídeo de MiniMax 2.3",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Fast I2V - Versión modelo de imagen rápida de MiniMax 2.3",
      modelsLabHailuo02I2V:
        "Hailuo 02 I2V - Modelo de generación de imagen a vídeo de MiniMax 02",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End - Modelo de generación de vídeo de marco de MiniMax",
      modelsLabSora2:
        "Sora 2 - OpenAI 's Sora 2 modelo de generación de vídeo a través de ModelsLab",
      modelsLabSora2Pro:
        "Sora 2 Pro - OpenAI 's Sora 2 Pro modelo de generación de vídeo a través de ModelsLab",
      modelsLabGen4Aleph:
        "Gen4 Aleph - Modelo de generación de vídeo Gen4 Aleph de Runway a través de ModelsLab",
      modelsLabLipsync2:
        "Lipsync 2 - Modelo de sincronización de labios de Sync",
      modelsLabGrokT2V:
        "Grok T2V - modelo de generación de texto a vídeo de xAI Grok a través de ModelsLab",
      modelsLabGrokI2V:
        "Grok I2V - modelo de generación de imagen a vídeo de xAI Grok a través de ModelsLab",
      klingV30Std:
        "Kling 3.0 Standard - Modelo de video de nivel estándar de Kuaishou con T2V e I2V vía OpenRouter",
      klingVideoO1:
        "Kling Video O1 - El modelo de generación de vídeo mejorada por razones de Kuaishou a través de OpenRouter",
      veo31Lite:
        "Veo 3.1 Lite - Google 's rentable modelo de vídeo para la generación de alto volumen a través de OpenRouter",
      seedance2:
        "Seedance 2.0 - El modelo de vídeo de ByteDance con consistencia de caracteres y referencia a vídeo vía OpenRouter",
      seedance2Fast:
        "Seedance 2.0 Fast - El modelo rápido de generación de vídeo de ByteDance vía OpenRouter",
      happyhorse11:
        "HappyHorse 1.1 - Modelo de generación de vídeo de Alibaba con T2V, I2V y soporte de imagen de referencia a través de OpenRouter",
      happyhorse10:
        "HappyHorse 1.0 - Modelo de generación de vídeo de Alibaba con T2V, I2V y soporte de imagen de referencia a través de OpenRouter",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo - Modelo de generación rápida de texto a imagen de Runway vía ModelsLab",
      modelsLabGen4Image:
        "Imagen Gen4 - Modelo de generación de texto a imagen de Runway a través de ModelosLab",
      modelsLabWan27T2I:
        "Wan 2.7 T2I - El modelo de generación Wan 2.7 de Alibaba mediante ModelosLab",
      modelsLabGrokT2I:
        "Grok Imagínese T2I - modelo de generación de texto a imagen de xAI de Grok a través de ModelosLab",
      modelsLabZImageBase:
        "Z Image Base - ModelosEl modelo rápido y asequible de texto a imagen",
      modelsLabZImageTurbo:
        "Z Image Turbo - ModelosEl modelo de texto a imagen ultrarrápida de Lab",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I - Black Forest Labs' Flux 2 Max text-to-image via ModelsLab",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra - Black Forest Labs de alta calidad Flux Pro Ultra a través de ModelosLab",
      modelsLabFluxPro11:
        "Flux Pro 1.1 - Black Forest Labs' Flux Pro 1.1 text-to-image via ModelsLab",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I - Black Forest Labs' Flux 2 Pro text-to-image via ModelsLab",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I - Black Forest Labs' Flux 2 Dev text-to-image via ModelsLab",
      modelsLabFluxT2I:
        "Flux T2I - Black Forest Labs' Flux text-to-image via ModelsLab",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I - El Seedream de ByteDance 4.5 texto a imagen a través de ModelosLab",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I - El Seedream 4.0 de ByteDance text-to-image a través de ModelosLab",
      modelsLabSeedreamT2I:
        "Seedream T2I - El Seedream de ByteDance text-to-image via ModelsLab",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra - Google 's generación de imagen de la más alta calidad a través de ModelosLab",
      modelsLabImagen4:
        "Imagen 4 - Google 's Imagen 4 texto a imagen a través de ModelosLab",
      modelsLabImagen4Fast:
        "Imagen 4 Fast - Google 's rápido Imagen 4 texto a imagen a través de ModelosLab",
      modelsLabImagen3:
        "Imagen 3 - Google 's Imagen 3 texto a imagen a través de ModelosLab",
      modelsLabNanoBananaPro:
        "Nano Banana Pro - Generación de imagen de alta calidad a través de ModelsLab",
      modelsLabNanoBanana:
        "Nano Banana - Generación de imágenes a través de ModelsLab",
      modelsLabQwenT2I: "Qwen T2I - El Qwen de Alibaba vía ModelosLab",
      modelsLabRealtimeT2I:
        "T2I en tiempo real - ModelosEl modelo de texto a imagen ultrarrápida del laboratorio",
      claudeSonnet5:
        "Claude Sonnet 5 - Anthropic 's equilibrado modelo de Sonnet con un rendimiento fuerte en el trabajo de codificación, agentes y análisis.",
      claudeOpus5:
        "Claude Opus 5 - Anthropic 's modelo insignia para las tareas más exigentes de análisis y de agenteidad.",
      claudeOpus5Fast:
        "Claude Opus 5 Fast - La variante de alto rendimiento de Claude Opus 5 optimizada para aplicaciones sensibles a latencia.",
      claudeFable5:
        "Claude Fable 5 - Anthropic 's último modelo de frontera que combina el razonamiento profundo, la síntesis creativa y la planificación a largo plazo.",
      grok45:
        "Grok 4.5 - Modelo de razonamiento capaz de xAI con soporte de visión y política de contenido abierto.Contexto de 500K-token.",
      grok46:
        "Grok 4.6 - el último modelo Grok de xAI con mejor razonamiento y codificación.Contexto de 500K-token.",
      gpt56Luna:
        "GPT-5.6 Luna - OpenAI 's ligero modelo rápido para tareas diarias. Extremadamente rentable. 1.05M-token context.",
      gpt56LunaPro:
        "GPT-5.6 Luna Pro - Mejora de la variante Luna con mejor codificación y seguimiento de instrucciones. 1.05M-token context.",
      gpt56Terra:
        "GPT-5.6 Terra - OpenAI 's capacidad de equilibrio de modelo de nivel medio y costo. Fuerte en codificación y razonamiento. 1.05M-token contexto.",
      gpt56TerraPro:
        "GPT-5.6 Terra Pro - Advanced Terra variante con más profundo razonamiento y análisis. 1.05M-token context.",
      gpt56Sol:
        "GPT-5.6 Sol - OpenAI 's modelo de razonamiento premium para tareas complejas. Rendimiento de vanguardia. Contexto de token de 1.05M.",
      gpt56SolPro:
        "GPT-5.6 Sol Pro - Modelo GPT de alto nivel que combina el razonamiento avanzado con profundidad creativa y analítica.",
      gemini36Flash:
        "Gemini 3.6 Flash - Google 's capaz Modelo Flash con entradas multimodales y codificación fuerte.",
      gemini35FlashLite:
        "Gemini 3.5 Flash Lite - Google 's ultra-affordable rápido modelo para tareas simples. 1M-token context.",
      gemini37Flash:
        "Gemini 3.7 Flash - Google 's último modelo de serie Flash con un mejor razonamiento y capacidades multimodales. 1.05M-token context.",
      kimiK3:
        "Kimi K3 - Moonshot AI 's último modelo de frontera con razonamiento multimodal de largo contexto y capacidades avanzadas de agente.",
      glm52:
        "GLM-5.2 - Z. AI 's modelo de base de nueva generación con fuerte razonamiento y rápida inferencia. contexto de token 1.05M.",
      minimaxM3:
        "MiniMax M3 - Modelo insignia de MiniMax con codificación fuerte y razonamiento a un precio competitivo. 1.05M-token contexto.",
      qwen37Flash:
        "Qwen 3.7 Flash - El modelo de presupuesto ultrarrápido de Alibaba para tareas de alto volumen.",
      qwen38Max:
        "Qwen 3.8 Max - El principal modelo de razonamiento de Alibaba con rendimiento de nivel fronterizo.",
      mimoV25:
        "MiMo V2.5 - Modelo de razonamiento eficiente de Xiaomi con fuerte rendimiento de codificación.",
      mimoV25Pro:
        "MiMo V2.5 Pro - Modelo de razonamiento premium de Xiaomi con profundidad analítica y de codificación avanzada. contexto de token 1.05M.",
      metaMuseSpark12:
        "Meta Muse Spark 1.2 - Modelo de razonamiento multimodal de Meta con visión, audio y video entradas. Fuerte en el análisis intermodal. 1.05M-token context.",
      mistralMedium35:
        "Mistral Medium 3.5 - Mistral AI 's capaz modelo de nivel medio con soporte de visión y codificación fuerte.",
      claudeOpus55:
        "Claude Opus 5.5 - Anthropic es el modelo superior. Trabajos de análisis, codificación y análisis más duros, ahora 20% más barato que el contexto del Opus 5. 1M.",
      claudeSonnet55:
        "Claude Sonnet 5.5 - Anthropic 's workhorse. Codificación de cerca del trabajo y habilidades de agente a precio de Sonnet.",
      claudeHaiku55:
        "Claude Haiku 5.5 - Anthropic es el modelo más rápido. Visión, herramientas y contexto 1M para un décimo del precio de Haiku 4.5.",
      claudeFable51:
        "Claude Fable 5.1 - Anthropic es el razonador fronterizo. Síntesis profunda, planificación a largo plazo, más aguda que el contexto Fable 5. 1M-token.",
      claudeFable52:
        "Claude Fable 5.2 - Anthropic es el razonador fronterizo. Una síntesis más profunda y una planificación más estable de largos caballos que Fable 5.1, a un precio más bajo.",
      gpt6Astra:
        "El anterior modelo insignia de Astra admite texto, imágenes y herramientas. Su sucesor es GPT-6.2 Astra.",
      gpt6AstraPro:
        "GPT-6 Astra Pro - GPT-6 Astra con esfuerzo prolongado de razonamiento. Más lento, más minucioso. Contexto de token 1.05M.",
      gpt61Sol:
        "La versión anterior de Sol admite texto, imágenes y herramientas. Su sucesor es GPT-6.2 Sol.",
      gpt61SolPro:
        "GPT-6.1 Sol Pro - GPT-6.1 Sol con amplio esfuerzo de razonamiento para el análisis complejo y el código. 1.05M-token context.",
      gpt61Terra:
        "GPT-6.1 Terra - OpenAI 's balanceado de nivel medio. Codificación fuerte y razonamiento, precio diario. 1.05M-token contexto.",
      gpt61TerraPro:
        "GPT-6.1 Terra Pro - GPT-6.1 Terra con un razonamiento más profundo para el trabajo de análisis pesado.",
      gpt6Luna:
        "GPT-6 Luna - OpenAI 's modelo ligero. Respuestas rápidas para pennies. 1.05M-token context.",
      gpt6LunaPro:
        "GPT-6 Luna Pro - GPT-6 Luna con razonamiento extra. Mejor código y seguimiento de instrucciones, el mismo precio bajo. 1.05M-token contexto.",
      gemini4Argon:
        "Gemini 4 Argon - Google es nuevo buque insignia. Texto, imagen, vídeo y audio en, razonamiento de frontera.",
      gemini38Flash:
        "Gemini 3.8 Flash - Google 's última Flash. Modelo multimodal rápido con codificación fuerte. 1M-token contexto.",
      grok47:
        "Grok 4.7 - el último Grok de xAI. Razonamiento y código de forma adecuada, política de contenido abierto, visión. contexto de 500K.",
      kimiK31Pro:
        "Kimi K3.1 Pro - Moonshot AI 's modelo más fuerte. Razonamiento multimodal y funcionamientos de agente largo.",
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
        "Qwen 4 Max - El nuevo buque insignia de Alibaba. Razonamiento, código y análisis frontales, lee imágenes y vídeo.Contexto 1M-token.",
      kimiK31ProUncensored:
        "Kimi K3.1 Pro Uncensored - Moonshot AI 's más fuerte Kimi con los rechazos eliminados (abliterado). Razonamiento de bandera, sin conferencias, herramientas incluidas. contexto de 1M-token.",
      hy4: "Hy4 - El buque insignia de Tencent. Razona por defecto, programa, lee imágenes y usa herramientas. Precio bajo para su nivel. Contexto de 1M tokens.",
      hy4Flash:
        "Hy4 Flash - El Hy4 pequeño y rápido de Tencent. Texto e imágenes de entrada, código y llamadas a herramientas casi gratis. Contexto de 1M tokens.",
      deepseekV41Flash:
        "DeepSeek V4.1 Flash - DeepSeek 's modelo abierto rápido, ahora con visión. Codificación seria para casi nada. Contexto de 1M-token.",
      qwen38Flash:
        "Qwen 3.8 Flash - El modelo multimodal rápido de Alibaba. Texto, imagen y vídeo a precio del presupuesto.",
      glm53:
        "GLM-5.3 - Z. AI 's último modelo de fundación. Fuerte razonamiento y código a un precio agresivo.Contexto de 1M-token.",
      glm53Flash:
        "GLM-5.3 Flash - Z. AI 's rápido modelo multimodal. Texto, imagen y vídeo para trabajos de alto volumen.",
      mimoV26Pro:
        "MiMo V2.6 Pro - El razonador premium de Xiaomi. Texto, imagen, vídeo y audio en, análisis profundo. 1.05M-token contexto.",
      mimoV26Flash:
        "MiMo V2.6 Flash - Modelo multimodal rápido de Xiaomi. Contexto ultra-calado, capaz de codificar. 1.05M-token.",
      metaMuseSpark13:
        "Meta Muse Spark 1.3 - El razonador multimodal de Meta. Análisis transversal a través del texto, la imagen y el vídeo.",
      metaMuseWonder:
        "Meta Muse Wonder - Meta es insignia. Razonamiento frontal, código y trabajo creativo a través de cada modalidad.",
      mistralLarge4:
        "Mistral Large 4 - Mistral AI 's nuevo buque insignia. europeo, de visión, fuerte en el código, más barato que Medium 3.5. Contexto de 1M-token.",
      gemini4Hydrogen:
        "Gemini 4 Hydrogen - Google 's Gemini 4 workhorse. Codificación y análisis rápidos, texto, imagen, vídeo y audio en el contexto 1M-token.",
      gemini4Carbon:
        "Gemini 4 Carbon - Google 's más fuerte Gemini. Construido para el más duro código, agente y trabajo de razonamiento, lee cada tipo de medio.",
      minimaxM31Flash:
        "MiniMax M3.1 Flash - Modelo multimodal rápido de MiniMax. Beats M3 a agentes y código por la mitad del precio o menos. 1M-token contexto.",
      metaMuseEmber:
        "Meta Muse Ember - La musa más pequeña de Meta. Llamadas rápidas de herramientas, enrutamiento y codificación ligera para peniques, lee cada tipo de medio.",
      veniceDeepseekV41FlashUncensored:
        "DeepSeek V4.1 Flash Uncensored - DeepSeek V4.1 Flash con los rechazos eliminados, servido por Venice.ai. Capacidad real, sin conferencias, herramientas incluidas.",
      drummerArtemis31b:
        "Artemis 31B - Gemma 4 de TheDrummer Finetune. Escenas oscuras, ficción explícita, personajes que permanecen en voz. Contexto barato, 262K, lee imágenes, llama herramientas.",
      grokImagineImage2:
        "Grok Imagine Image 2.0 - el último modelo de generación de imágenes de xAI con mejor adherencia rápida y calidad visual.",
      recraftV41:
        "Recraft V4.1 - Modelo de imagen de diseño de Recraft con texto preciso en imágenes, construido para logotipos, carteles y gráficos de marca.",
      recraftV41Pro:
        "Recraft V4.1 Pro - Recraft's 2K premium tier para impresiones de marca y productos con detalles finos.",
      recraftV41Flash:
        "Recraft V4.1 Flash - El nivel rápido y de bajo costo de Recraft para proyectos y carreras a granel, bajo 1 crédito por imagen.",
      qwenImage3:
        "Qwen Image 3 - El modelo rápido de generación de imagen de Alibaba a un coste ultra-bajo.",
      qwenImage3Pro:
        "Qwen Image 3 Pro - El modelo de generación de imagen premium de Alibaba con calidad y detalle mejorados.",
      hailuo3:
        "Hailuo 3 - El último modelo de generación de vídeo de MiniMax con calidad cinematográfica y coherencia de movimiento.",
      seedance25:
        "Seedance 2.5 - El modelo mejorado de generación de vídeo de ByteDance con mejor movimiento y fidelidad visual.",
      flux3Video:
        "Flux 3 Video - Modelo de generación de video de Black Forest Labs con calidad excepcional y rápida adherencia.",
      grokImagineVideo15:
        "Grok Imagine Video 1.5 - Modelo de generación de vídeo actualizado de xAI con mayor consistencia temporal.",
      lyria3ProPreview:
        "Lyria 3 Pro Preview - Google 's modelo de generación de música premium para canciones de larga duración con alta calidad de producción.",
      lyria3ClipPreview:
        "Lyria 3 Clip Preview - Google 's generador de clip rápido para el contenido de audio de forma corta.",
      geminiNanoBanana21:
        "Nano Banana 2.1 - Google 's generación de imágenes en cadena y edición a la mitad del precio de imagen del Nano Banana original.",
      seedream55:
        "Seedream 5.5 - La generación de imágenes de ByteDance y el modelo de edición de referencias múltiples a 2 créditos por imagen.",
      flux3Image:
        "FLUX.3 - Modelo de imagen insignia de laboratorios forestales negros con detalles más afilados y texto más limpio que FLUX.2.",
      flux3Klein:
        "FLUX.3 Klein - Modelo de imagen pequeño y rápido de los laboratorios forestales negros para proyectos y carreras a granel, bajo 1 crédito por imagen.",
      gptImage26Flare:
        "GPT Image 2.6 Flare - OpenAI 's rápido generación de imagen y modelo de edición.",
      gptImage26Sunburst:
        "GPT Image 2.6 Sunburst - OpenAI 's modelo de imagen enfocado en detalle para composiciones densas y diseños de texto pesado.",
      geminiOmni12Flash:
        "Gemini Omni 1.2 Flash - Modelo de vídeo Google con audio nativo, 3 a 15 segundos clips, hasta 4K.",
      grokImagineVideo15Lite:
        "Grok Imagine Video 1.5 Lite - Modelo de vídeo rápido y barato de xAI, hasta 1080p.",
      wan30:
        "Wan 3.0 - Modelo de vídeo de Alibaba con audio nativo y clips hasta 30 segundos.",
      seedance2Mini:
        "Seedance 2.0 Mini - Modelo de video de ByteDance con audio nativo a 480p y 720p.",
      seedance25Flash:
        "Seedance 2.5 Flash - Seedance rápido de ByteDance 2.5 con audio nativo, clips hasta 30 segundos a 480p y 720p.",
      hailuo3Max:
        "Hailuo 3 Max - MiniMax más rápido, más barato Hailuo 3 variante en 768p, sin audio.",
      runwayGen45:
        "Runway Gen-4.5 - Modelo de vídeo cinematográfico de Runway para texto e imagen a vídeo en 720p.",
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
};
