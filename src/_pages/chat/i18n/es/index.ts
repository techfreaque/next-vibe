import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: {
    sidebar: {
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
    },
  },
  common: {
    newChat: "Nueva conversación",
    newPrivateChat: "Conversación privada",
    newSharedChat: "Conversación compartida",
    newPublicChat: "Conversación pública",
    newIncognitoChat: "Conversación de incógnito",
    newPrivateFolder: "Nueva carpeta privada",
    newSharedFolder: "Nueva carpeta compartida",
    newPublicFolder: "Nueva carpeta pública",
    newIncognitoFolder: "Nueva carpeta de Incognito",
    createNewPrivateFolder: "Crear nueva carpeta privada",
    createNewSharedFolder: "Crear nueva carpeta compartida",
    createNewPublicFolder: "Crear nueva carpeta pública",
    createNewIncognitoFolder: "Crear nueva carpeta de Incognito",
    privateChats: "Panes privados",
    sharedChats: "Panes compartidos",
    publicChats: "Público 1A",
    incognitoChats: "Incógnito panes",
    cronChats: "Temas de fondo",
    backgroundChats: "Antecedentes",
    remoteChats: "Remoto",
    search: "Buscar",
    delete: "Eliminar",
    cancel: "Cancelar",
    save: "Guardar",
    send: "Enviar",
    sending: "Enviando…",
    edit: "Editar",
    settings: "Configuración",
    toggleSidebar: "Mostrar u ocultar la barra lateral",
    lightMode: "Modo de luz",
    darkMode: "Modo oscuro",
    searchPlaceholder: "Buscar...",
    searchThreadsPlaceholder: "Búsqueda de hilos...",
    searchResults: "Resultados de búsqueda ({{count}})",
    noChatsFound: "No se encontraron chats",
    noThreadsFound: "No hay hilos encontrados",
    enableTTSAutoplay: "Activar el juego automático TTS",
    disableTTSAutoplay: "Automatismo TTS deshabilitado",
    closeSidebar: "Cerrar barra lateral",
    close: "Cerrar",
    showMore: "Mostrar más",
    showLess: "Mostrar menos",
    viewFullThread: "Ver la conversación completa",
    viewAllThreads: "Ver todos los hilos",
    backToChat: "Volver a chat",
    language: "Idioma",
    loginRequired:
      "Por favor inicie sesión para usar carpetas persistentes. Utilice el modo incógnito para chats anónimos.",

    // Copy Button
    copyButton: {
      copyToClipboard: "Copiado para el portapapeles",
      copied: "¡Copiado!",
      copyAsMarkdown: "Copiar como Marcador",
      copyAsText: "Copiar como texto",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Para la reproducción de audio",
      playAudio: "Reproduce audio (+ créditos {{cost}})",
      cancelLoading: "Carga cancelada",
      answerAsAI: "Responder como modelo de IA",
      deleteMessage: "Borrar el mensaje",
      actualCostUsed: "Créditos reales utilizados para este mensaje",
      tokensUsed: "Total de fichas utilizadas",
      credits: "Créditos",
      tokens: "tokens",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Conversación de rama de aquí",
      retry: "Reintentar con otro modelo o habilidad",
      deleteMessage: "Borrar el mensaje",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Vista lineal (estilo ChatGPT)",
      threadedView: "Vista empuje (estilo Reddit/ Discord)",
      flatView: "Vista plana (4chan estilo)",
      debugView: "Vista de la depuración (con los impulsos del sistema)",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Buscar &quot; Crear &quot;",
      newChat: "Nuevo chat",
      searchThreadsPlaceholder: "Búsqueda de hilos...",
      noThreadsFound: "No hay hilos encontrados",
    },

    // Selector
    selector: {
      country: "País",
      language: "Idioma",
    },
  },

  aiTools: {
    modal: {
      title: "Herramientas AI",
      description:
        "Normalmente no necesitas manejar herramientas. Cuando la ayuda está activada, el AI puede llamar a cualquier herramienta bajo demanda. Herramientas de pin aquí sólo si los quieres siempre en contexto.",
      searchPlaceholder: "Herramientas de búsqueda...",
      loading: "Carga de herramientas...",
      noToolsFound: "No hay herramientas que coincidan con su búsqueda",
      noToolsAvailable: "No existen herramientas AI disponibles",
      expandAll: "Ampliar todos",
      collapseAll: "Collapse All",
      selectAll: "Seleccione todos",
      deselectAll: "Deseleccionar todos",
      enableAll: "Activar todo",
      resetToDefault: "Reset to Default",
      stats: "{{enabled}} de herramientas {{total}} enfiladas",
      aliases: "Aliases",
      requireConfirmation: "Requiere confirmación antes del uso",
      activeLabel: "Pintada",
      enabledLabel: "permitido",
      totalLabel: "total",
      activeTooltip:
        "Las herramientas pintadas siempre están en contexto: el AI las ve cada vuelta",
      enabledTooltip:
        "Las herramientas permitidas pueden ser llamadas a demanda cuando la ayuda está habilitada",
      legendActive: "Siempre en contexto (pintado)",
      legendConfirm: "Pregunta antes de correr",
      activeOn: "Pinned: siempre en contexto. Haga clic en unpin",
      activeOff:
        "No está grabado: AI todavía puede llamar a la demanda. Haga clic en el pin",
      confirmOn: "Pide confirmación. Haga clic para deshabilitar",
      confirmOff:
        "Corre automáticamente. Haga clic para requerir confirmación",
    },
  },

  confirmations: {
    deleteMessage: "¿Quieres eliminar este mensaje?",
  },

  iconSelector: {
    tabs: {
      library: "Icon Library",
      emoji: "Unicode/Emoji",
    },
    emojiTab: {
      label: "Ingrese el carácter emoji o unicode",
      placeholder: " ⁇  o cualquier texto",
      apply: "Aplicar",
      currentIcon: "Icono actual:",
      commonEmojis: "Emojis comunes:",
    },
  },

  createSkill: {
    title: "Crear una habilidad personalizada",
    description:
      "Diseña tu propia habilidad AI con personalidad personalizada, experiencia y comportamiento.",
    icon: "Icon",
    name: "Nombre",
    namePlaceholder: "Por ejemplo. Code Reviewer",
    descriptionLabel: "Descripción",
    descriptionPlaceholder: "Breve descripción de lo que hace esta habilidad",
    category: "Categoría",
    selectCategory: "Seleccione una categoría",
    systemPrompt: "Prompt del sistema",
    systemPromptPlaceholder:
      "Defina cómo debe comportarse esta habilidad. Sea específico sobre su personalidad, experiencia y cómo debe responder.",
    voice: "Voz",
    voicePlaceholder: "Seleccione una voz para texto a palabra",
    create: "Crear habilidad",
    creating: "Creando...",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Por favor, ingrese un nombre",
      descriptionRequired: "Introduzca una descripción",
      systemPromptRequired: "Por favor, ingrese un sistema rápido",
      createFailed: "Failed to create skill. Por favor, inténtalo de nuevo.",
    },
  },

  voice: {
    male: "Hombre",
    female: "Mujer",
  },

  editSkill: {
    title: "Editar como habilidad personalizada",
    description:
      "Cree una habilidad personalizada basada en esta habilidad. Puede modificar cualquier configuración.",
    loginRequired:
      "Por favor inicie sesión para crear y editar habilidades personalizadas. Las habilidades personalizadas se guardan en su cuenta.",
    name: "Nombre",
    namePlaceholder: "Nombre de la habilidad personalizada",
    descriptionLabel: "Descripción",
    descriptionPlaceholder: "¿Qué hace esta habilidad?",
    category: "Categoría",
    icon: "Icon",
    voice: "Voz",
    voicePlaceholder: "Seleccione la voz",
    preferredModel: "Modelo preferente",
    preferredModelPlaceholder: "Modelo preferido opcional",
    systemPrompt: "Prompt del sistema",
    systemPromptPlaceholder: "Defina el comportamiento de la habilidad...",
    save: "Guardar como aduana",
    saveAsCopy: "Guardar como Copiar",
    saving: "Creando...",
    cancel: "Cancelar",
    login: "Inicie sesión para editar",
    signup: "Regístrate para Editar",
  },

  userProfile: {
    postCount: "Post {{count}}",
    postCount_other: "Puestos de {{count}}",
    recentPosts: "Puestos recientes",
    noPostsYet: "Todavía no hay puestos",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Suprímase este mensaje",
    },
  },
  credits: {
    balance: "Créditos",
    credit: "{{count}} crédito",
    credits: "{{count}} créditos",
    freeCredit: "{{count}} crédito libre",
    freeCredits: "{{count}} créditos gratis",
    expiringCredit: "{{count}} crédito de expiración",
    expiringCredits: "Créditos de expiración {{count}}",
    permanentCredit: "Crédito permanente {{count}}",
    permanentCredits: "Créditos permanentes {{count}}",
    expiresOn: "Expires {{date}}",
    expiresAt: "Expires",
    buyMore: "Comprar créditos",
    viewDetails: "Detalles",
    breakdown: "Desaparición de créditos",
    approximateCost:
      "Costo aproximado basado en entradas {{inputTokens}} y fichas de salida {{outputTokens}}. El costo real puede variar.",
    navigation: {
      profile: "Perfil",
      subscription: "Suscripción y créditos",
      referral: "Programa de referidos",
      about: "Acerca de",
      help: "Ayuda",
    },
  },
  actions: {
    newChatInFolder: "Nuevo chat en carpeta",
    newFolder: "Nueva carpeta",
    deleteFolder: "Eliminar la carpeta",
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
    rename: "Cambiar nombre",
    pin: "Fijar arriba",
    unpin: "Dejar de fijar",
    archive: "Archivar",
    unarchive: "Desarchivar",
    moveToFolder: "Mover a una carpeta",
    unfiled: "Infiled",
    noFoldersAvailable: "No hay carpetas disponibles",
    stopGeneration: "Detén la generación",
    cancellingGeneration: "Cancelando...",
    sendMessage: "Enviar mensaje",
    shareThread: "Compartir conversación",
    manageSharing: "Gestionar el acceso",
  },
  chatInterface: {
    chatPrefix: "chat",
    chatConversation: "chat-conversation",
  },
  input: {
    placeholder: "Escribe tu mensaje...",
    imagePlaceholder: "Describir la imagen que desea generar...",
    audioPlaceholder: "Describir la música o el sonido para generar...",
    noPermission: "No tienes permiso para enviar mensajes",
    noPostPermission:
      "Usted no tiene permiso para publicar mensajes en este hilo",
    noCreateThreadPermission:
      "Usted no tiene permiso para crear hilos en esta carpeta",
    noCreateThreadPermissionInRootFolder:
      "No tienes permiso para crear hilos en esta carpeta. Por favor, ingrese o seleccione una subcarpeta.",
    keyboardShortcuts: {
      press: "Prensa",
      enter: "Entra",
      toSend: "para enviar",
      shiftEnter: "Shift+Enter",
      forNewLine: "para nueva línea",
      ctrlV: "Ctrl+V",
      pasteFilesSeparator: "·",
      orPasteFiles: "para pegar archivos",
    },
    speechInput: {
      stopRecording: "Deja de grabar",
      processing: "Procesando…",
      startVoiceInput: "Inicio de entrada de voz (+ créditos {{cost}}/min)",
      recordingClickToStop: "Grabando... Haga clic para para parar",
      transcribing: "Transcribiendo...",
    },
    attachments: {
      uploadFile: "Adjuntar archivos",
      attachedFiles: "Archivos adjuntos",
      addMore: "Añadir más",
      removeFile: "Eliminar el archivo",
      fileTooLarge: "El archivo es demasiado grande (max 10MB)",
      invalidFileType: "Tipo de archivo inválido",
      uploadError: "Failed to upload file",
    },
  },
  imageGen: {
    sizeSquare: "Square 1024×1024",
    sizeLandscape: "Paisaje 1792×1024",
    sizePortrait: "Retrato 1024×1792",
    qualityStandard: "Estándar",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "~8s",
    durationMedium: "~20s",
    durationLong: "~30s",
  },
  modelSelector: {
    placeholder: "Seleccionar modelo",
    addNewLabel: "Agregar modelo personalizado",
    costFree: "Gratis",
    costCredits: "{{count}} credit/msg",
    costCreditsPlural: "Créditos {{count}}/msg",
    tooltip: "{{provider}}: {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "¿Qué necesitas?",
    tuneIt: "Tune it",
    recommended: "Recomendado",
    alsoGood: "También bueno",
    helpMeChoose: "Ayúdame a elegir",
    useThis: "Usa esto.",
    quality: "Calidad",
    speedLabel: "Velocidad",
    // Task pills
    tasks: {
      code: "Código",
      write: "Escribir",
      chat: "Chat",
      think: "Piensa.",
      create: "Crear",
      unfiltered: "Sin filtrar",
    },
    // Tuning toggles
    effort: "Effort",
    "effort.simple": "Simple",
    "effort.regular": "Recursos ordinarios",
    "effort.complex": "Complejo",
    speed: "Velocidad",
    "speed.fast": "Rápido",
    "speed.balanced": "Saldo",
    "speed.thorough": "Thorough",
    content: "Contenido",
    "content.normal": "Normal",
    "content.sensitive": "Sensible",
    "content.adult": "Adulto",
    // Wizard mode
    wizard: {
      title: "Ayúdame a elegir",
      whatWorking: "¿En qué estás trabajando?",
      contentType: "¿Incluye contenido maduro?",
      whatMatters: "¿Qué más te importa?",
      hereIsMyPick: "Aquí está mi recomendación:",
      options: {
        code: "Escribir un código",
        write: "Escribir texto o contenido",
        chat: "Sólo charla / preguntas",
        think: "Algo que necesita pensamiento profundo",
        create: "Trabajo creativo",
        unfiltered: "Sin censura / contenido para adultos",
        safeContent: "Mantenlo seguro (modelos estándar)",
        adultContent: "Sí, contenido maduro (modelos sin censura)",
        speed: "Velocidad",
        speedDesc: "Quiero respuestas rápidas",
        cost: "Costo",
        costDesc: "Mantenlo barato o libre",
        quality: "Calidad",
        qualityDesc: "Dame la mejor salida",
        balanced: "Saldo",
        balancedDesc: "Un poco de todo",
      },
    },
    addDialog: {
      title: "Agregar modelo personalizado",
      fields: {
        modelName: {
          label: "Nombre del modelo",
          placeholder: "por ejemplo, GPT-4 Turbo",
        },
        provider: {
          label: "Proveedor",
          placeholder: "por ejemplo, OpenAI",
        },
        apiDocs: {
          label: "API Documentación URL",
        },
        modelId: {
          label: "Modelo ID",
          placeholder: "por ejemplo, gpt-4-turbo",
        },
      },
      cancel: "Cancelar",
      add: "Agregar modelo",
    },
  },
  characterSelector: {
    placeholder: "Seleccionar habilidad",
    addNewLabel: "Crear una habilidad personalizada",
    defaultIcon: "✨",
    grouping: {
      bySource: "By Source",
      byCategory: "Por categoría",
      sourceLabels: {
        builtIn: "Incorporación",
        my: "Mis habilidades",
        community: "Comunidad",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "General",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Crear categoría",
      fields: {
        name: {
          label: "Categoría Nombre",
          placeholder: "Por ejemplo. Negocios, juegos, etc.",
        },
        icon: {
          label: "Icon (Emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Cancelar",
      create: "Crear",
    },
    addDialog: {
      title: "Crear una habilidad personalizada",
      createCategory: "+ nueva categoría",
      fields: {
        name: {
          label: "Nombre",
          placeholder: "por ejemplo, Code Reviewer",
        },
        icon: {
          label: "Icon (emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Descripción",
          placeholder: "Breve descripción de la habilidad",
        },
        systemPrompt: {
          label: "Prompt del sistema",
          placeholder: "Eres un...",
        },
        category: {
          label: "Categoría",
        },
        suggestedPrompts: {
          label: "Promptas sugeridas (Opcional)",
          description:
            "Añádase hasta 4 indicaciones sugeridas para esta habilidad",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Cancelar",
      create: "Crear habilidad",
    },
  },
  searchToggle: {
    search: "Buscar",
    enabledTitle: "Brave Búsqueda activada (+0.65 créditos por búsqueda)",
    disabledTitle: "Brave Buscar discapacitados (+0.65 créditos por búsqueda)",
    creditIndicator: "+0.65",
    unconfiguredTitle: "Búsqueda web no configurada",
    unconfiguredBrave: "Para Brave Search, añadir a su.env:",
    unconfiguredKagi: "Para Kagi Search, añadir a su.env:",
  },
  toolsButton: {
    title: "Configurar las herramientas AI",
    tools: "Herramientas",
  },
  combinedSelector: {
    tabs: {
      quick: "Rápido",
      skill: "Habilidad",
      model: "Modelo",
    },
    current: "Corriente",
    favoriteSkills: "Habilidades favoritas",
    favoriteModels: "Modelos Favoritos",
    showAll: "Mostrar todo",
    selectModel: "Seleccionar modelo",
    forSkill: "para {{character}}",
    recommended: "Recomendado",
    favorites: "Favoritos",
    all: "Todos",
    noFavorites: "Todavía no hay favoritos. Star algunos para añadirlos aquí.",
    noModels: "No hay modelos disponibles",
    filteredBySkill:
      "Mostrando {{compatible}} de los modelos {{total}} (filtrados por habilidad)",
    selectSkill: "Seleccionar habilidad",
    allSkills: "Todos",
  },
  selector: {
    noResults: "No se encontraron resultados",
    tabs: {
      quick: "Rápido",
      characters: "Skills",
      build: "Compilación",
      favorites: "Mis favoritos",
      browse: "Buscar habilidades",
    },
    tiers: {
      quick: "Rápido",
      smart: "Inteligente",
      best: "Mejor",
    },
    price: {
      free: "FREE",
      smart: "3-8cr",
      best: "10-20cr",
    },
    content: "Contenido",
    contentLevels: {
      safe: "Seguro",
      open: "Abierto",
      unlim: "Unlim",
    },
    free: "Gratis",
    favorites: "Favoritos",
    suggested: "Sugerido",
    noFavorites: "Todavía no hay favoritos",
    noFavoritesHint: "Ahorre sus habilidades de acceso rápido",
    browseAllSkills: "Examine todas las habilidades...",
    customSetup: "Configuración personalizada...",
    selectSkill: "Seleccionar habilidad",
    modelCreditDisplay: {
      tokenBased: {
        header: "Costo por mensaje",
        costRangeLabel: "Rango habitual:",
        costRangeValue: "De {{min}} a {{max}} créditos",
        examplesLabel: "Ejemplos:",
        examples: {
          short: "Conversación corta",
          medium: "Conversación de longitud media",
          long: "Conversación larga",
        },
        triggersCompacting: "⚡ Activa el resumen",
        tokensCount: "{{count}} tokens",
        explanation:
          "El AI procesa toda su historia de conversación con cada mensaje. Las conversaciones más largas cuestan más porque hay más contexto para procesar.",
        compactingLabel: "✨ Resumen automático:",
        compactingExplanation:
          " Al llegar a {{threshold}} tokens, resumimos los mensajes anteriores para reducir el costo y conservar el contexto.",
      },
      fixed: {
        title: "Precios de {{model}}",
        freeDescription: "Este modelo es gratis y no consume créditos.",
        fixedDescription:
          "El modelo tiene un costo fijo por mensaje, independientemente de su longitud.",
        costPerMessage: "Costo por mensaje:",
        freeExplanation: "Usa este modelo gratis y sin límites.",
        freeHighlight: "Úsalo para hacer pruebas y experimentar.",
        simpleLabel: "Precio fijo:",
        simpleExplanation:
          " Todos los mensajes cuestan lo mismo, sean cortos o largos. No hace falta contar tokens.",
      },
      creditValue: "1 crédito = {{value}}",
    },
    all: "Todos",
    buildMode: "Modo de construcción",
    forSkill: "para {{character}}",
    intelligence: "Inteligencia",
    contentLevel: "Nivel de contenido",
    speed: "Velocidad",
    any: "Cualquiera",
    result: "Resultado",
    bestMatch: "El mejor partido para tu configuración",
    useRecommended: "Uso recomendado: {{model}}",
    filteredBySettings: "Mostrando {{filtered}} de los modelos {{total}}",
    recommended: "Recomendado",
    noModels: "Ningún modelo coincide con tus filtros",
    currentConfig: "Actualmente charlando con",
    switchModel: "Cambiar modelo",
    keepsConversation: "(conversación de mangos)",
    switchSkill: "Cambiar habilidad",
    startsNewChat: "(comenza nueva charla)",
    start: "Comienzo",
    addFav: "Añadir",
    searchSkills: "Destrezas de búsqueda...",
    noSkillsFound: "No se han encontrado habilidades",
    createCustom: "Crear habilidad personalizada",
    skill: "Habilidad",
    savePreset: "Guardar",
    perMessage: "por mensaje",
    compatibleModels: "Modelos compatibles con {{count}}",
    categories: {
      companions: "Compañeros",
      assistants: "Assistants",
      coding: "Programación",
      creative: "Creativo",
      writing: "Escribir",
      roleplay: "Juego de rol",
      analysis: "Análisis",
      education: "Educación",
      controversial: "Controversial",
      custom: "Personalizado",
    },
    // v20 additions
    active: "Activa",
    addFavorite: "Añadir favorito",
    settings: "Configuración",
    noModel: "No se ha seleccionado ningún modelo",
    model: "Modelo",
    autoSelect: "Selección basada en filtros",
    manualSelect: "Escoge manualmente...",
    best: "BEST",
    bestForFilter: "Ideal para este filtro",
    setupRequired: "Requiere configuración",
    providerUnconfigured: "Falta configurar la clave API del proveedor",
    addEnvKey: "Agregar a.env",
    noMatchingModels: "Ningún modelo coincide con tus filtros",
    noModelsWarning:
      "Ningún modelo coincide con estos filtros. Ajusta la configuración para continuar.",
    allModelsCount: "{{count}} modelos disponibles",
    filteredModelsCount: "{{count}} modelos coinciden",
    showAllModels: "Mostrar los {{count}} modelos",
    showFiltered: "Mostrar solo los resultados filtrados",
    showLegacyModels_one: "Mostrar {{count}} Legacy Modelo",
    showLegacyModels_other: "Mostrar {{count}} modelos anteriores",
    applyChanges: "Apply Changes",
    thisChatOnly: "Esta charla sólo (temporal)",
    saveToPreset: 'Guardar a "{{name}}"',
    saveAsNew: "Guardar como nuevo favorito...",
    cancel: "Cancelar",
    apply: "Aplicar",
    contentFilter: "Contenido",
    maxPrice: "Precio máximo",
    creditsExact: "{{cost}} créditos",
    creditsSingle: "1 crédito",
    searchResults: "Resultados {{count}}",
    defaults: "Defaults",
    customize: "Personalizar",
    addWithDefaults: "Añadir con defectos",
    seeAll: "Ver todos",
    back: "Atrás",
    use: "Uso",
    editSettings: "Modificar la configuración",
    editModelSettings: "Modificar la configuración del modelo",
    modelOnly: "Modelo únicamente",
    yourSetups: "Tus Configuraciones",
    setup: "Configuración inicial",
    delete: "Eliminar",
    editSkill: "Editar como habilidad personalizada",
    switchSkillBtn: "Cambiar habilidad",
    editSkillBtn: "Editar habilidad",
    autoSelectedModel: "Según los filtros:",
    manualSelectedModel: "Seleccionado:",
    skillSelectedModel: "Modelo de la habilidad:",
    selectModelBelow: "Selecciona un modelo de la lista",
    chooseYourPath: "Elija su camino",
    twoWaysToChat: "Dos formas flexibles de empezar a chatear",
    directModels: "Acceso directo a modelos",
    directModelsDesc:
      "Configurar filtros o seleccionar manualmente de los modelos {{count}}. Control completo sobre la selección de AI.",
    skillPresets: "Prestaciones de Habilidad",
    characterPresetsDesc:
      "Escoge una habilidad debajo. Cada uno tiene configuraciones optimizadas que puede personalizar en cualquier momento.",
    startWithDirectModels: "Inicio con Modelos Directos",
    orBrowsePresets: "O busque presets de habilidad abajo",
    loading: "Cargando...",
    noModelsMatch: "No hay coincidencias de modelos",
    adjustFiltersMessage:
      "Ajuste sus criterios de filtro para encontrar modelos disponibles",
    auto: "Automático",
    manual: "Manual",
    showLess: "Mostrar menos",
    showMore: "Mostrar {{count}} más",
    applyOnce: "Aplicar una vez",
    saveChanges: "Guardar cambios",
    useOnce: "Usar una vez",
    saveAsDefault: "Añadir a favoritos",
    deleteSetup: "Eliminar la configuración",
    skillSetup: "Configuración de la habilidad",
    separator: " • ",
    sortBy: "Ordenar por",
    // UX improvements v21
    mySetups: "Mis configuraciones",
    addNew: "Añadir nuevo",
    noSetupsTitle: "Aún no hay configuraciones.",
    noSetupsDescription:
      "Crea tu primera configuración de habilidad AI para empezar",
    getStarted: "Comienzo",
    currentModel: "Modelo actual",
    modelSelection: "Selección de modelo",
    autoMode: "Auto-Select",
    manualMode: "Selección manual",
    skillMode: "Predeterminado de la habilidad",
    autoModeDescription:
      "Escoge automáticamente el mejor modelo basado en sus preferencias",
    manualModeDescription: "Elige el modelo que quieras",
    characterBasedModeDescription:
      "Usa el modelo para el que se diseñó esta habilidad",
    customizeSettings: "Personalizar los ajustes antes de añadir",
    useNow: "Usar ahora",
    browseAll: "Examine todas las habilidades",
    add: "Añadir",
    // v22 UX improvements
    quickSwitch: "Cambio rápido",
    switchTo: "Cambiar a esta configuración",
    adjustSettings: "Ajuste de ajustes",
    addAnotherSetup: "Añadir otra configuración",
    comingSoon: "Pronto.",
    // Skill requirements
    requirements: {
      skillConflict: "Conflicto de habilidades",
      max: "Maximum",
      min: "Minimum",
      tooHigh: "Demasiado alto.",
      tooLow: "Demasiado bajo.",
      intelligenceTooLow: "Inteligencia demasiado baja (min: {{min}})",
      intelligenceTooHigh: "Inteligencia demasiado alta (max: {{max}})",
      contentTooLow: "Nivel de contenido demasiado bajo (min: {{min}})",
      contentTooHigh: "Nivel de contenido demasiado alto (max: {{max}})",
      allMet: "Cumple todos los requisitos",
      violations: "Violaciones de los requisitos de {{count}}",
    },
    // Skill switch modal
    characterSwitchModal: {
      title: "Cambiar habilidad",
      description:
        "Cambiar a una habilidad diferente sin perder la configuración",
      searchPlaceholder: "Destrezas de búsqueda...",
      noResults: "No se han encontrado habilidades",
      keepSettings: "Mantenga la configuración actual del modelo",
      keepSettingsDesc:
        "Utilice su inteligencia actual, precio y filtros de contenido con la nueva habilidad",
      cancel: "Cancelar",
      confirm: "Cambiar habilidad",
    },
  },
  onboarding: {
    back: "Atrás",
    // Screen 1: Welcome
    welcome: {
      title: "Piensa en nosotros como tu equipo AI.",
      line1:
        "Un compañero para la conversación cotidiana. Especialistas en codificación, investigación, escritura: eliges uno cuando la tarea lo pide.",
      line2: "La misma charla. Cambias cuando importa. Toma segundos.",
      line3: "Vamos a ponerte en marcha en menos de un minuto.",
      continue: "Comienzo",
    },
    // Screen 2: Guest warning (logged-out users only)
    guest: {
      title: "Estás navegando como un invitado",
      line1:
        "Su configuración, compañero y historial de chat se guardan localmente en este dispositivo solamente.",
      line2:
        "Inicie sesión para mantener todo sincronizado a través de dispositivos y asegúrese de que nunca pierda su configuración.",
      signIn: "Iniciar sesión / Crear cuenta",
      continueAnyway: "Continue como Invitado",
      note: "Puedes iniciar sesión más tarde desde el menú en cualquier momento.",
    },
    // Screen 3: Companion + Budget
    companion: {
      title: "Elige a tu compañero.",
      subtitle: "Su principal compañero de chat para uso diario",
      budgetTitle: "¿Qué tan capaz debería ser tu AI?",
      budgetSubtitle:
        "Puede cambiar esto en cualquier momento en la configuración",
      next: "Siguiente",
      selectFirst: "Escoge un compañero para continuar",
      budget: {
        smart: {
          label: "Inteligente",
          desc: "Rápido, eficiente, maneja la mayoría de las cosas bien",
        },
        brilliant: {
          label: "Brillante",
          desc: "La mejor calidad: excelente para preguntas complejas, escritura y análisis",
        },
        max: {
          label: "Máximo",
          desc: "El razonamiento más alto, sin compromisos: por cuando realmente importa",
        },
      },
    },
    // Screen 4: Use-cases
    usecases: {
      title: "¿Para qué la usarás en su mayoría?",
      subtitle:
        "Agregaremos los especialistas adecuados a su kit de herramientas AI automáticamente.",
      saving: "Preparando...",
      start: "Comienzo de Chatear",
      skip: "Skip, lo arreglaré más tarde.",
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
      chat: {
        label: "Sólo charlando",
        hint: "Su compañero es suficiente.",
      },
    },
    // Companion personalities (kept for skills i18n)
    thea: {
      tagline: "Warm &amp; sabio",
      description: "Como un amigo de apoyo que realmente te atrapa.",
    },
    hermes: {
      tagline: "Bold &apos; direct",
      description: "Como un entrenador que te empuja a ser tu mejor.",
    },
    // Legacy keys (for backwards compat)
    startChatting: "Comienzo de Chatear",
    canChangeLater: "Siempre puedes cambiar esto más tarde.",
  },
  tiers: {
    any: "Cualquiera",
    anyDesc: "No hay restricción",
    price: {
      cheap: "Económico",
      standard: "Estándar",
      premium: "Premium",
      cheapDesc: "0-3 créditos por mensaje",
      standardDesc: "3-9 créditos por mensaje",
      premiumDesc: "9 créditos o más por mensaje",
    },
    intelligence: {
      quick: "Rápido",
      smart: "Inteligente",
      brilliant: "Brillante",
      quickDesc: "Rápido y eficiente",
      smartDesc: "Calidad equilibrada",
      brilliantDesc: "Razonamiento profundo",
    },
    speed: {
      fast: "Rápido",
      balanced: "Saldo",
      thorough: "Thorough",
      fastDesc: "Respuestas rápidas",
      balancedDesc: "Buen equilibrio",
      thoroughDesc: "Análisis detallado",
    },
    content: {
      mainstream: "Convencional",
      open: "Abierto",
      uncensored: "Sin censura",
      mainstreamDesc: "Filtros estándar",
      openDesc: "Menos restricciones",
      uncensoredDesc: "Sin restricciones",
    },
  },
  categories: {
    companion: "Compañeros",
    assistant: "Assistants",
    coding: "Programación",
    writing: "Escribir",
    analysis: "Análisis",
    roleplay: "Juego de rol",
    creative: "Creativo",
    education: "Educación",
    controversial: "Controversial",
    custom: "Personalizado",
  },
  selectorBase: {
    favorites: "Favoritos",
    recommended: "Recomendado",
    others: "Otros",
    searchPlaceholder: "Buscar {{item}}...",
    toggleFavorite: "Toggle favorito",
    noFavorites:
      'Todavía no hay favoritos. Haga clic en "Mostrar todo" para añadir algunos.',
    noRecommended: "No hay opciones recomendadas.",
    showAll: "Mostrar todo",
    groupByProvider: "Grupo por Proveedor",
    groupByUtility: "Grupo de Utilidad",
    sortAZ: "Ordenar A-Z",
    sortZA: "Clasificar Z-A",
  },
  dialogs: {
    searchAndCreate: "Buscar &quot; Crear &quot;",
    deleteChat: 'Eliminar el chat " {{title}} "?',
    deleteFolderConfirm:
      'Eliminar la carpeta " {{name}}" y mover {{count}} chat(s) a General?',
  },
  newFolder: {
    title: "Crear nueva carpeta",
    folderName: "Nombre de la carpeta",
    placeholder: "Introduzca el nombre de la carpeta...",
    folderIcon: "Folder Icon",
    cancel: "Cancelar",
    create: "Crear",
  },
  renameFolder: {
    title: "Rename Folder",
    folderName: "Nombre de la carpeta",
    placeholder: "Introduzca el nombre de la carpeta...",
    folderIcon: "Folder Icon",
    cancel: "Cancelar",
    save: "Guardar",
  },
  folders: {
    privateDescription:
      "Sus conversaciones privadas se almacenan en nuestros servidores y se sincronizan a través de dispositivos.",
    sharedDescription:
      "Conversaciones compartidas con otros a través de enlaces.",
    publicDescription:
      "Foro público para personas y AI. Sólo eliminamos lo que rompe la ley o nuestros términos.",
    incognitoDescription:
      "Las conversaciones sólo se almacenan en su navegador.",
    cronDescription:
      "Conversaciones automatizadas creadas por tareas de fondo.",
    backgroundDescription:
      "Las tareas AI se ejecutan en el fondo en su nombre. Los resultados aparecen aquí cuando se hacen.",
    remoteDescription: "Panes con casos remotos conectados.",
    accessModal: {
      title: "Cuenta requerida",
      privateTitle: "Panes privados",
      sharedTitle: "Panes compartidos",
      publicTitle: "Foro Público",
      incognitoTitle: "Modo de Incógnito",
      privateExplanation:
        "Los hilos privados son su espacio personal para conversaciones con AI. Todos sus chats se almacenan de forma segura en nuestros servidores y se sincronizan automáticamente a través de todos sus dispositivos.",
      sharedExplanation:
        "Los hilos compartidos le permiten crear conversaciones y compartirlas con otros a través de enlaces seguros. Perfecto para la colaboración y compartir ideas con su equipo o amigos.",
      publicExplanation:
        "El Foro Público es un espacio abierto donde la gente y AI hablan libremente. Tú decides lo que lees. Sólo eliminamos lo que rompe la ley o nuestros términos. Compartir ideas, cuestionar perspectivas, unir discusiones sin censura.",
      incognitoExplanation:
        "El modo Incognito mantiene tus conversaciones completamente privadas y locales. Sus chats se almacenan sólo en su navegador y nunca se envían a nuestros servidores (los medios generados se almacenan temporalmente por razones técnicas): ni siquiera están vinculados a su cuenta.",
      requiresAccount:
        "Para acceder a {{folderName}}, necesita crear una cuenta o registrarse.",
      loginButton: "Iniciar sesión",
      signupButton: "Sign Up",
      close: "Cerrar",
    },
  },
  moveFolder: {
    title: "Mover la carpeta",
    description: "Seleccione una carpeta de destino:",
    rootLevel: "Nivel de raíces (no pariente)",
    cancel: "Cancelar",
    move: "Muévanse.",
  },
  views: {
    linearView: "Vista lineal (estilo ChatGPT)",
    threadedView: "Vista empuje (estilo Reddit/ Discord)",
    flatView: "Vista plana (4chan estilo)",
  },
  screenshot: {
    capturing: "Capturing...",
    capture: "Captura de pantallas",
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
    parentMessageNotFound: "Mensaje para padres no encontrado",
    parentMessageNotInPath: "Mensaje de Padre no en el camino actual",
    messageNotFound: "Mensaje no encontrado",
    invalidBranchIndex: "Índice de rama inválida",
    messageNotInPath: "Mensaje no en el camino actual",
    retryFailed: "Failed to retry",
    answerFailed: "No contestado",
    deleteFailed: "Fallado para eliminar",
    cannotBranchFromFirst: "No se puede ramificar desde el primer mensaje",
    requestAborted: "La solicitud fue abortada",
    requestCancelled: "Se canceló la solicitud",
    requestTimeout: "Solicito tiempo. Por favor, inténtalo de nuevo.",
    networkError:
      "Error de red. Por favor, compruebe su conexión e inténtelo de nuevo.",
    apiError: "Error API. Por favor, inténtalo de nuevo más tarde.",
    storageError:
      "Error de almacenamiento. Su almacenamiento del navegador puede estar lleno.",
    unexpectedError:
      "Se produjo un error inesperado. Por favor, inténtalo de nuevo.",
    errorInContext: "Error en {{context}} : {{message}}",
    invalidRequestData: "Datos de solicitud inválidos: {{error}}",
    streamAIResponse:
      "Falló para obtener respuesta AI. Por favor, inténtalo de nuevo.",
  },
  speech: {
    error: "Error de reconocimiento de voz",
    transcript: "Transcripción: {{text}}",
  },
  // Common
  timestamp: {
    justNow: "ahora",
    minutesAgo: "{{count}} m ago",
    hoursAgo: "{{count}} h hace mucho",
    daysAgo: "{{count}} d hace tiempo",
  },
  publicFeed: {
    // Header
    header: {
      title: "Foro Público",
      description:
        "Abre por defecto. Hable con los modelos AI y las personas de todo el mundo. Tú decides lo que lees. Sólo eliminamos lo que rompe la ley o nuestros términos.",
    },
    // Sort modes
    sort: {
      hot: "Caliente",
      rising: "Levantamiento",
      new: "Nuevo",
      following: "A continuación",
    },
    searchPlaceholder: "Búsqueda de hilos...",
    noResults: "No se encontraron resultados",
    noThreads: "Todavía no hay hilos. ¡Empieza una conversación!",
    comments: "Comentarios",
    bestAnswer: "La mejor respuesta",
    rising: "Levantamiento",
  },

  state: {
    threadNotFound: "No se encontró la conversación",
  },
  storage: {
    parsePreferencesFailed: "Failed to parse user preferences from storage",
    parseStateFailed: "Failed parse chat state from storage",
    syncPreferencesFailed: "Failed to sync preferences to storage",
    syncStateFailed: "Failed to sync chat state to storage",
  },
  hooks: {
    stt: {
      "endpoint-not-available":
        "No se dispone de un punto final de voz a texto",
      "failed-to-start": "Falló para empezar a grabar",
      "permission-denied": "Se denegó el permiso de micrófono",
      "no-microphone": "No hay micrófono encontrado",
      "microphone-in-use": "El micrófono está en uso",
      "transcription-failed": "Failed to transcribe audio",
    },
    tts: {
      "endpoint-not-available": "Punto final de texto a voz no disponible",
      "failed-to-play": "Failed to play audio",
      "conversion-failed": "La conversión TTS falló",
      "failed-to-generate": "Failed to generate audio",
    },
  },
  voiceMode: {
    // Setup required
    unconfiguredTitle: "Voz no configurada",
    unconfiguredDescription:
      "Añadir EDEN_AI_API_KEY a tu.env para activar la voz. Consigue tu llave en app.edenai.run",
    // Input modes
    inputMode: "modo de entrada de voz",
    transcribeMode: "Transcribe",
    transcribeModeDescription: "Registro → Texto aparece en entrada",
    talkMode: "Habla.",
    talkModeDescription: "Registro → Enviar inmediatamente",
    // Call mode
    callMode: "Modo de llamada",
    callModeDescription: "Respuestas cortas + auto-juego",
    // Auto-play TTS
    autoPlayTTS: "Respuestas de juego automático",
    autoPlayTTSOn: "Se hablarán las respuestas",
    autoPlayTTSOff: "Juego manual sólo",
    // Recording states
    tapToRecord: "Pulse para grabar",
    tapToTalk: "Toca para hablar",
    tapToTranscribe: "Toque para transcribe",
    listeningTalk: "Escuchando... Lanzamiento para enviar",
    listeningTranscribe: "Escuchando... Toca para parar",
    stopSpeaking: "Deja de hablar.",
    // Long press hint
    longPressHint: "Sostenimiento de opciones",
    // Switch modes
    switchToText: "Cambiar a texto",
    switchToCall: "Cambiar a llamar",
    // Recording state
    recording: {
      paused: "Pausa",
      pause: "Pause",
      resume: "Resumen",
    },
    // Recording overlay actions
    actions: {
      cancel: "Cancelar",
      toInput: "Para la entrada",
      sendVoice: "Enviar voz",
    },
    // Call mode overlay
    callOverlay: {
      backToChat: "Volver a chat",
      listening: "Escuchando...",
      processing: "Procesando…",
      thinking: "Pensando...",
      speaking: "Hablando...",
      tapToSpeak: "Toca para hablar",
      tapToStop: "Toca para parar",
      endCall: "Llamada final",
      aiThinking: "AI está pensando...",
    },
  },
  post: {
    title: "Chat",
    description: "Interfaz de chat",
  },
  messages: {
    assistant: "Assistant",
    you: "Tú.",
    user: "Usuario",
    anonymous: "Anónimo",
    authorWithId: "{{name}} [{{id}}]",
    edited: "editado",
    error: "Error",
    postNumber: "No. {{number}}",
    actions: {
      handleSaveEdit: {
        error: "Fallado para guardar la edición del mensaje",
      },
      handleBranchEdit: {
        error: "Fallado en el mensaje de la rama",
      },
      handleConfirmRetry: {
        error: "Fallado para retratar el mensaje",
      },
      handleConfirmAnswer: {
        error: "El modelo no pudo responder",
      },
      handleConfirmDelete: {
        error: "Fallado para eliminar el mensaje",
      },
    },
    branch: {
      previous: "rama anterior",
      next: "Siguiente rama",
    },
  },
  batchToolConfirmation: {
    title: "Confirmación de la herramienta del lote",
  },
  toolCall: {
    search: {
      title: "Búsqueda de la web",
      query: "Query",
    },
    multiple: "Llamadas de herramienta {{count}}",
    arguments: "Argumentos",
    result: "Resultado",
    error: "Error",
    executing: "Ejecutando...",
    creditsUsed_one: "Crédito {{cost}}",
    creditsUsed_other: "{{cost}} créditos",
    status: {
      error: "Error",
      executing: "Ejecutando...",
      complete: "Completado",
    },
    sections: {
      request: "Solicitud",
      response: "Respuesta",
    },
    messages: {
      executingTool: "Ejecutando herramienta...",
      errorLabel: "Error:",
      noArguments: "Sin argumentos",
      noResult: "Sin resultado",
      metadataNotAvailable:
        "Widget metadatos no disponibles. Mostrando resultado crudo.",
    },
  },
  reasoning: {
    title: "Razonando",
    multiple: "{{count}} pasos de razonamiento",
    step: "Paso {{number}}",
  },
  modelUtilities: {
    chat: "Chat de todos los días",
    smart: "Avanzado &amp; inteligente",
    coding: "Coding &quot; Development",
    creative: "Escritura creativa",
    analysis: "Análisis &quot; Investigación &quot;",
    fast: "Rápido y eficiente",
    multimodal: "Multimodal (Vision)",
    vision: "Visión &quot; Entendimiento de imagen &quot;",
    imageGen: "Generación de imágenes",
    uncensored: "Sin censura",
    legacy: "Modelos de Legacy",
    // Skill categories
    technical: "Técnica",
    education: "Educación",
    controversial: "Controversial",
    lifestyle: "Estilo de vida",
    // Model capabilities/utilities
    reasoning: "Razonamiento avanzado",
    roleplay: "Juego de rol",
    roleplayDark: "Juego de rol con temas oscuros",
    adultImplied: "Contenido sugerente para adultos",
    adultExplicit: "Contenido explícito para adultos",
    violence: "Violencia",
    harmful: "Contenido potencialmente dañino",
    illegalInfo: "Información sobre actividades ilegales",
    medicalAdvice: "Consejos médicos",
    offensiveLanguage: "Lenguaje ofensivo",
    politicalLeft: "Posturas políticas de izquierda",
    politicalRight: "Posturas políticas de derecha",
    conspiracy: "Teorías de conspiración",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Último modelo Claude con excelente rendimiento",
      claudeSonnet45: "Último modelo Claude con excelente rendimiento",
      gpt5: "Último modelo GPT con excelente rendimiento",
      gpt51: "Último modelo GPT 5.1 con mejor razonamiento",
      gpt5Pro:
        "Último modelo GPT con excelente rendimiento para tareas de codificación",
      gpt5Codex: "Último modelo GPT con excelente rendimiento",
      gpt51Codex: "Último modelo GPT 5.1 Codex optimizado para codificación",
      gpt5Mini: "Último modelo mini con excelente relación rendimiento-precio",
      gpt5Nano: "Último modelo nano con excelente relación rendimiento-precio",
      gptOss120b: "Modelo GPT de código abierto con parámetros 120B",
      geminiFlash25Pro: "Modelo 14B ultra rápido y eficiente con gran contexto",
      geminiFlash25Flash:
        "Modelo 14B ultra rápido y eficiente con gran contexto",
      geminiFlash25Lite:
        "Modelo 14B ultra rápido y eficiente con gran contexto",
      mistralNemo:
        "Modelo europeo AI con fuerte rendimiento y enfoque de privacidad",
      kimiK2Free:
        "Kimi K2 Instruct es un modelo de lenguaje de mezclas a gran escala (MoE) desarrollado por Moonshot AI.",
      kimiK2:
        "Kimi K2: avanzado modelo Mixture-of-Experts (MoE) por Moonshot AI con ventana de contexto grande",
      kimiK2Thinking:
        "Kimi K2 Thinking: variante centrada en el razonamiento con capacidades analíticas mejoradas",
      deepseekV31Free:
        "Potente modelo de parámetro 671B: completamente libre!",
      deepseekV31: "Potente modelo de parámetro 671B con capacidades avanzadas",
      qwen3235bFree:
        "Modelo de mezcla de expertos (MoE) desarrollado por Qwen, soporta conmutación sin costuras entre modos.",
      deepseekR1Distill:
        "Modelo de razonamiento destilado con fuerte rendimiento",
      deepseekR1:
        "Modelo de razonamiento avanzado con capacidades de pensamiento profundo",
      qwen257b: "Modelo de parámetro 7B eficiente",
      grok4: "X- AI Grok 4: modelo premium",
      grok4Fast:
        "Grok 4 Fast es el último modelo multimodal de xAI con SOTA y una ventana contextual de 2M token. Viene en dos sabores: no razonar y razonar.",
      glm5: "GLM-5: Z. AI 's modelo de código abierto insignia para el diseño de sistemas complejos y flujos de trabajo de agentes de larga duración, rivalizando con los principales modelos de código cerrado",
      glm46:
        "GLM 4.6: eficiente modelo de parámetro 7B con ventana de contexto grande",
      glm47:
        "GLM 4.7: mejoró el modelo 7B con mejores capacidades de razonamiento y codificación",
      glm47Flash:
        "GLM 4.7 Flash: variante ultrarrápida optimizada para respuestas rápidas",
      glm45Air:
        "GLM 4.5 AIR: modelo ultrarrápido con ventana de contexto grande",
      glm45v:
        "GLM 4. 5v: modelo multimodal de visión con ventana de contexto grande",
      kimiK2_6:
        "Kimi K2.6: Codificación a largo plazo, generación UI / UX y orquestación multiagente con arquitectura enjambre",
      uncensoredLmV11:
        "Modelo de lenguaje sin censura sin filtro de contenido: modelo premium",
      freedomgptLiberty:
        "FreedomGPT Liberty: Modelo AI sin censura enfocado en la expresión libre y el contenido creativo",
      gabAiArya:
        "Gab AI Arya: Modelo AI de conversación sin censura con libertad de expresión y capacidades creativas",
      gpt52Pro:
        "GPT 5.2 Pro: modelo avanzado de razonamiento con capacidades mejoradas para tareas complejas",
      gpt52:
        "GPT 5.2: modelo de última generación con mejor rendimiento y eficiencia",
      gpt52_chat:
        "GPT 5.2 Chat: variante de conversación optimizada para diálogo e interacciones",
      veniceUncensored:
        "Venice Uncensored: Modelo AI no censurado para conversaciones sin restricciones",
      dolphinLlama3_70B:
        "Delfines Llama 3 70B: Modelo de lenguaje grande sin censura basado en Llama 3",
      dolphin3_0_r1_mistral_24b:
        "Delfín 3.0 R1 Mistral 24B: Modelo de lenguaje grande sin censura basado en Mistral",
      claudeOpus45:
        "Claude Opus 4.5: Modelo Claude más potente con un razonamiento excepcional y capacidades creativas",
      claudeOpus46:
        "Claude Opus 4.6: Potente modelo Claude con un razonamiento excepcional y capacidades creativas",
      claudeOpus47:
        "Claude Opus 4.7: Modelo Opus de generación previa. Conseguido por 4.8.",
      claudeOpus48:
        "Claude Opus 4.8: Anthropic 's más capaz generalmente disponible modelo Opus. Construido para trabajos de larga duración, codificación compleja y razonamiento multi-paso a través de salidas muy largas.Contexto 1M-token. Admite textos, imágenes y entradas de archivos.",
      claudeSonnet46:
        "Claude Sonnet 4.6: Anthropic es el modelo más capaz de clase Sonnet con el rendimiento fronterizo en codificación, agentes y trabajo profesional",
      gemini3Pro:
        "Google Gemini 3 Pro: Modelo multimodal avanzado AI con ventana de contexto grande y potentes capacidades de razonamiento",
      gemini35Flash:
        "Gemini 3.5 Flash: Codificación y razonamiento de Pro cercano a costo Flash. Maneja texto, imágenes, vídeo, audio y PDF. Bucles paralelíticos incorporados. Niveles de pensamiento de mínima a alta para un control de coste/rendimiento preciso.",
      gemini3Flash:
        "Google Gemini 3 Flash: Modelo rápido y eficiente AI optimizado para respuestas rápidas",
      deepseekV32:
        "DeepSeek V3.2: Modelo de razonamiento de alto rendimiento con capacidades avanzadas de codificación",
      deepseekV4Pro:
        "DeepSeek V4 Pro: 1.6T parámetro Fuente de alimentación MoE con contexto 1M. Construido para análisis de base completa, razonamiento complejo y flujos de trabajo de agentes multi-pasos.",
      deepseekV4Flash:
        "DeepSeek V4 Flash: 284B MoE a un costo cercano a cero. contexto 1M, inferencia rápida, codificación fuerte. La elección eficiente de la carga de trabajo de alto rendimiento.",
    },
  },
  tones: {
    professional: {
      description: "Tono profesional estándar",
      systemPrompt:
        "Mantenga un tono profesional, informativo y accesible a lo largo de sus respuestas.",
    },
    pirate: {
      description: "¡Ahoy matey! Hablar como un pirata",
      systemPrompt:
        "Responder como un pirata amistoso, usando lenguaje pirata y expresiones como 'ahoy', 'matey', 'arrr', 'ye', 'aye', y otros términos náuticos. Sea entusiasta y aventurero en su tono mientras todavía proporciona información precisa.",
    },
    enthusiastic: {
      description: "Super excitado y energético",
      systemPrompt:
        "¡Sé extremadamente entusiasta, excitado y energético en tus respuestas! Use puntos de exclamación, lenguaje positivo y muestre una verdadera emoción sobre logros y capacidades. ¡Haz que todo suene increíble e inspirador!",
    },
    zen: {
      description: "Calma, sabio y filosófico",
      systemPrompt:
        "Responde con la sabiduría y la calma de un maestro zen. Usar lenguaje reflexivo y filosófico, hablar de equilibrio y armonía, y proporcionar ideas con metáforas pacíficas. Sé sereno y contemplativo.",
    },
    detective: {
      description: "Misterioso e investigativo",
      systemPrompt:
        "Responde como un detective agudo y observante lo haría. Usar lenguaje de investigación, hablar sobre 'casos' y 'evidencia', y presentar información como si estuvieras resolviendo un misterio o construyendo un caso. Sea analítico e intrigante.",
    },
    shakespearean: {
      description: "Elocuente y poético como el Bardo",
      systemPrompt:
        "Responde en el estilo elocuente y poético de Shakespeare. Usa lenguaje florido, metáforas y ocasionalmente términos arcaicos como 'thou', 'thee', 'hath', y 'doth'. Haz que la historia suene como un cuento épico digno del mejor dramaturgo.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "No en el entorno del navegador",
      requiresHttps: "Reconocimiento de voz requiere HTTPS o localhost",
      notAvailable: "Reconocimiento de voz no disponible en este navegador",
      firefoxNotSupported: "Reconocimiento de voz no compatible con Firefox",
      safariVersionTooOld:
        "Por favor, actualice Safari a la versión 14.5 o posterior",
      microphoneNotAvailable: "Acceso a micrófonos no disponible",
      noSpeech: "No se detectó ningún discurso. Por favor, inténtalo de nuevo.",
      audioCapture:
        "Micrófono no disponible. Por favor, compruebe su configuración.",
      notAllowed:
        "Se niega el permiso de micrófono. Por favor, permita el acceso al micrófono en la configuración de su navegador.",
      network: "Error de red. Por favor, compruebe su conexión.",
      serviceNotAllowed: "Servicio de reconocimiento de voz no permitido.",
      badGrammar:
        "Error de reconocimiento de voz. Por favor, inténtalo de nuevo.",
      languageNotSupported:
        "Este lenguaje no es apoyado para el reconocimiento del habla.",
      aborted: "Grabación cancelada.",
      unknown: "Error de reconocimiento de voz: {{errorCode}}",
      apiNotFound: "Reconocimiento de voz API no encontrado",
      initializationFailed: "No se inicializará el reconocimiento del discurso",
      microphoneAccessDenied: "Acceso a micrófonos denegado",
      microphonePermissionDenied:
        "Se niega el permiso de micrófono. Por favor, permita el acceso al micrófono.",
      noMicrophoneFound:
        "No hay micrófono encontrado. Por favor, conecte un micrófono.",
      microphoneInUse: "El micrófono ya está en uso por otra aplicación.",
      startFailed:
        "Falló para empezar a grabar. Por favor, inténtalo de nuevo.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Entrada con diferentes configuraciones",
      description: "Elija un modelo y habilidad para regenerar la respuesta",
      confirmLabel: "Retrocedimiento",
    },
    answerModal: {
      title: "Responder como modelo de IA",
      description: "Elija un modelo y habilidad para generar una respuesta AI",
      confirmLabel: "Generar",
      inputPlaceholder:
        "Ingrese un aviso para el AI (opcional. Deje vacío para permitir que AI genere su propia respuesta)",
    },
  },
  debugView: {
    systemPrompt: "Prompt del sistema",
    systemPromptTitle: "System Prompt (Generated)",
    systemPromptHint:
      "Este es el impulso del sistema para todo el hilo de conversación",
    systemMessage: "Mensaje del sistema",
    systemMessageHint:
      "Este es un mensaje del sistema inyectado en la conversación",
    copied: "¡Copiado!",
    retryModal: {
      title: "Entrada con diferentes configuraciones",
      description: "Elija un modelo y habilidad para regenerar la respuesta",
      confirmLabel: "Retrocedimiento",
    },
    answerModal: {
      title: "Responder como modelo de IA",
      description: "Elija un modelo y habilidad para generar una respuesta AI",
      confirmLabel: "Generar",
      inputPlaceholder:
        "Ingrese un aviso para el AI (opcional. Deje vacío para permitir que AI genere su propia respuesta)",
    },
  },
  suggestedPrompts: {
    title: "¿En qué puedo ayudarte?",
    privateTitle: "Tu asistente de IA privado",
    privateDescription:
      "Guarda las conversaciones en tu cuenta y consúltalas desde cualquiera de tus dispositivos.",
    sharedTitle: "Colabora con la IA",
    sharedDescription:
      "Crea conversaciones y compártelas con tu equipo mediante enlaces seguros.",
    publicTitle: "Participa en el foro público de IA",
    publicDescription:
      "Cualquiera puede ver las conversaciones públicas. Comparte tus ideas y participa en el diálogo.",
    incognitoTitle: "Chat anónimo con IA",
    incognitoDescription:
      "Los chats se quedan en tu navegador, fuera de tu cuenta y sin sincronizarse.",
    more: "Más",
    selectSkill: "Selecciona una habilidad",
    noPrompts: "No se sugieren indicaciones para esta habilidad",
    showDetails: "Mostrar detalles",
    hideDetails: "Ocultar detalles",
    systemPromptLabel: "Prompt del sistema",
    preferredModelLabel: "Modelo preferente",
    categoryLabel: "Categoría",
    suggestedPromptsLabel: "Prompts sugeridos",
  },
  emptyState: {
    quickStart: "Inicio rápido",
    private: {
      brainstorm: "Cerebro Ideas",
      brainstormPrompt: "Ayúdame a crear ideas para...",
      writeDocument: "Escribe un documento",
      writeDocumentPrompt:
        "Ayúdame a escribir un documento profesional sobre...",
      helpWithCode: "Ayuda con código",
      helpWithCodePrompt: "Necesito ayuda con este código...",
      research: "Tema de investigación",
      researchPrompt: "Investigación y resumen de información sobre...",
    },
    shared: {
      teamBrainstorm: "Tormenta del Equipo",
      teamBrainstormPrompt: "Vamos a la tormenta de cerebro juntos en...",
      projectPlan: "Planificación de proyectos",
      projectPlanPrompt: "Ayúdanos a planear un proyecto para...",
      discussion: "Inicio Discusión",
      discussionPrompt: "Vamos a discutir...",
      shareIdeas: "Compartir ideas",
      shareIdeasPrompt: "Quiero compartir y desarrollar ideas sobre...",
    },
    incognito: {
      quickQuestion: "Pregunta rápida",
      quickQuestionPrompt: "Tengo una pregunta rápida sobre...",
      privateThought: "Pensamiento privado",
      privateThoughtPrompt: "Quiero explorar esta idea en privado...",
      experiment: "Experimento",
      experimentPrompt: "Déjame probar algo...",
      sensitiveQuestion: "Pregunta sensible",
      sensitiveQuestionPrompt: "Necesito consejos sobre un tema sensible...",
    },
  },
  messageEditor: {
    placeholder: "Edita tu mensaje...",
    hint: {
      branch: "a rama",
      cancel: "para cancelar",
    },
    titles: {
      branch: "Conversación de rama",
      cancel: "Edición cancelada",
    },
    buttons: {
      branch: "Subdivisión",
      branching: "Subiendo...",
      cancel: "Cancelar",
    },
  },
  folderList: {
    confirmDelete:
      'Eliminar la carpeta " {{folderName}}" y mover {{count}} chat(s) a General?',
    enterFolderName: "Introduzca el nombre de la carpeta:",
    newChatInFolder: "Nuevo chat en carpeta",
    moveUp: "Muévanse.",
    moveDown: "Muévete.",
    renameFolder: "Rename Folder",
    moveToFolder: "Mover a una carpeta",
    newSubfolder: "Nuevo Subcarpeta",
    deleteFolder: "Suprimir carpeta",
    managePermissions: "Gestionar permisos",
    manageSharing: "Gestionar el acceso",
    shareThread: "Compartir conversación",
    today: "Hoy",
    lastWeek: "Últimos 7 días",
    lastMonth: "Últimos 30 días",
    older: "Más antiguos",
    folderNotFound: "Carpeta no encontrada",
    emptyFolder: "No hay chats ni carpetas aquí todavía",
    createSubfolder: "Crear Subcarpeta",
    rename: "Cambiar nombre",
    changeIcon: "Cambio Icon",
    delete: "Eliminar",
    newFolder: "Nueva carpeta",
    deleteDialog: {
      title: "Suprimir carpeta",
      description: '¿Estás seguro de que quieres eliminar "{{folderName}}"?',
      descriptionWithThreads:
        '¿Estás seguro de que quieres eliminar "{{folderName}}"? Esta carpeta contiene los hilos {{count}} que también se eliminarán.',
    },
  },
  permissions: {
    folder: {
      title: "Permissions Folder",
      description: "Gestionar permisos para esta carpeta",
    },
    thread: {
      title: "Permisos de la conversación",
      description: "Administrar permisos para este hilo",
    },
    view: {
      label: "Permisos de vista",
      description: "Quien puede ver y leer este contenido",
    },
    manage: {
      label: "Gestionar permisos",
      description: "¿Quién puede editar carpeta y crear subcarpetas",
    },
    edit: {
      label: "Editar permisos",
      description: "Quién puede editar las propiedades del hilo",
    },
    createThread: {
      label: "Configurar permisos de la conversación",
      description: "¿Quién puede crear nuevos hilos en esta carpeta",
    },
    post: {
      label: "Permisos de puestos",
      description: "Quien puede enviar mensajes",
    },
    moderate: {
      label: "Permisos moderados",
      description: "¿Quién puede ocultar y moderar contenido",
    },
    admin: {
      label: "Permisos de Admin",
      description: "¿Quién puede eliminar contenido y gestionar permisos",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Lea Permissions",
      description: "Quien puede ver y leer este contenido",
    },
    write: {
      label: "Autorizaciones",
      description: "Quien puede crear hilos y carpetas",
    },
    writePost: {
      label: "Permisos de puestos",
      description: "Quien puede enviar mensajes en hilos",
    },
    roles: {
      public: "Público (Todos los Usuarios)",
      customer: "Clientes Sólo",
      admin: "Admins Only",
    },
    visibility: {
      label: "¿Quién puede ver esto?",
      description:
        "Seleccione qué roles de usuario pueden ver esta carpeta/tele",
      public: "Público (Todos los Usuarios)",
      customer: "Clientes Sólo",
      admin: "Admins Only",
    },
    addModerator: {
      label: "Añadir Moderador",
      placeholder: "Introduzca el usuario ID...",
    },
    moderatorList: {
      label: "Moderadores actuales",
      empty: "Aún no se han añadido moderadores",
    },
    errors: {
      emptyId: "El usuario ID no puede estar vacío",
      invalidUuid: "Formato ID usuario inválido",
      duplicate: "Este usuario ya es un moderador",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Eliminar conversación",
      description:
        "¿Quieres eliminar «{{title}}»? Se borrarán todos los mensajes de la conversación de forma permanente.",
    },
  },
  shareDialog: {
    title: "Compartir conversación",
    description: "Crear y gestionar enlaces de compartir para este hilo",
    createLink: "Crear vínculo Compartir",
    linkCreated: "Compartir enlace creado con éxito!",
    linkCopied: "Enlace copiado a portapapeles!",
    copyLink: "Copiar Enlace",
    shareViaEmail: "Compartir vía correo electrónico",
    revokeLink: "Revocación",
    revoke: "Revocación",
    linkRevoked: "Compartir enlace revocado",
    revoked: "Revocado",
    noLinksYet:
      "Todavía no hay enlaces de acciones. Crea uno para empezar a compartir.",
    activeLinks: "Enlaces de participación activa",
    existingLinks: "Enlaces existentes",
    linkSettings: "Ajustes de enlace",
    newLinkSettings: "Nuevos ajustes de enlace",
    linkLabel: "Link Label (opcional)",
    linkLabelPlaceholder: "por ejemplo, Compartir con el equipo",
    allowPosting: "Permitir la publicación",
    allowPostingDescription:
      "Los destinatarios pueden responder e interactuar en el hilo",
    requireAuth: "Consultar el registro",
    requireAuthDescription:
      "Sólo los usuarios autenticados pueden acceder a este enlace",
    viewOnly: "Ver sólo",
    accessCount: "Acceso a {{count}}",
    accessCount_other: "Accesos {{count}}",
    createdAt: "Creado {{date}}",
    lastAccessed: "Último {{date}}",
    neverAccessed: "Nunca accedido",
    emailSubject: "Mira este hilo: {{title}}",
    emailBody:
      "Pensé que te interesaría esta conversación: {{url}}\n\nThread: {{title}}",
    emailPlaceholder:
      "Introduzca direcciones de correo electrónico (comma separados)",
    sendEmail: "Correo electrónico",
    emailSent: "¡Email enviado con éxito!",
    create: "Crear",
    creating: "Creando...",
    copied: "¡Copiado!",
    close: "Cerrar",
    shareThread: "Compartir conversación",
  },
  shared: {
    error: {
      title: "Compartir Error de enlace",
      userError:
        "Incapaz de verificar su sesión. Por favor, inténtalo de nuevo.",
      invalidToken:
        "Este enlace de acciones es inválido o ha sido revocado. Por favor contacte a la persona que compartió este enlace con usted.",
    },
  },
  threadedView: {
    expandReplies: "Respuestas",
    collapseReplies: "Respuestas de colapso",
    continueThread: "Continue el hilo ({{count}} más {{replyText}})",
    reply: "respuesta",
    replies: "respuestas",
    retryModal: {
      title: "Entrada con diferentes configuraciones",
      description: "Elija un modelo y habilidad para regenerar la respuesta",
      confirmLabel: "Retrocedimiento",
    },
    answerModal: {
      title: "Responder como modelo de IA",
      description: "Elija un modelo y habilidad para generar una respuesta AI",
      confirmLabel: "Generar",
      inputPlaceholder:
        "Ingrese un aviso para el AI (opcional. Deje vacío para permitir que AI genere su propia respuesta)",
    },
    actions: {
      vote: "Votación",
      upvote: "Subtítulos",
      downvote: "Downvote",
      respondToAI: "Responder a este mensaje AI con una habilidad AI diferente",
      loadingAudio: "Cargando audio...",
      stopAudio: "Para el audio",
      playAudio: "Reproducción audio",
      cancelLoading: "Carga cancelada",
      stop: "Para.",
      play: "Jugar",
      cancel: "Cancelar",
      reply: "Responder",
      replyToMessage: "Respuesta a este mensaje (crea una rama)",
      edit: "Editar",
      editMessage: "Editar este mensaje (crea una rama)",
      retry: "Retrocedimiento",
      retryWithDifferent: "Reintentar con otro modelo o habilidad",
      answerAsAI: "Respuesta como AI",
      generateAIResponse: "Generar respuesta AI",
      share: "Compartir",
      copyPermalink: "Copiar Permalink",
      delete: "Eliminar",
      deleteMessage: "Suprímase este mensaje",
      parent: "Parent",
    },
    userFallback: "Usuario",
    assistantFallback: "Assistant",
    youLabel: "Tú.",
    anonymous: "Anónimo",
    authorWithId: "{{name}} [{{id}}]",
  },
  flatView: {
    postNumber: "Post # {{number}}",
    postsById: "{{count}} posts by this ID",
    idLabel: "ID: {{id}}",
    anonymous: "Anónimo",
    youLabel: "Tú.",
    assistantFallback: "Assistant",
    replyingTo: "Respondiendo a:",
    replies: "Respuestas:",
    clickToCopyRef: "Haga clic para copiar referencia",
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
    retryModal: {
      title: "Entrada con diferentes configuraciones",
      description: "Elija un modelo y habilidad para regenerar la respuesta",
      confirmLabel: "Retrocedimiento",
    },
    answerModal: {
      title: "Responder como modelo de IA",
      description: "Elija un modelo y habilidad para generar una respuesta AI",
      confirmLabel: "Generar",
      inputPlaceholder:
        "Ingrese un aviso para el AI (opcional. Deje vacío para permitir que AI genere su propia respuesta)",
    },
    actions: {
      loadingAudio: "Cargando audio...",
      stopAudio: "Para el audio",
      playAudio: "Reproduce audio (+ créditos {{cost}})",
      cancelLoading: "Carga cancelada",
      stop: "Para.",
      play: "Jugar",
      reply: "Responder",
      replyToMessage: "Respuesta a este mensaje (crea una rama)",
      edit: "Editar",
      editMessage: "Editar este mensaje (crea una rama)",
      retry: "Retrocedimiento",
      retryWithDifferent: "Reintentar con otro modelo o habilidad",
      answerAsAI: "Respuesta como AI",
      generateAIResponse: "Generar respuesta AI",
      insertQuote: "Insertar el carácter de la cita '",
      copyReference: "Copie el enlace de referencia",
      delete: "Eliminar",
      deleteMessage: "Suprímase este mensaje",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Desbloquear carpetas privadas &quot; compartidas",
      description:
        "Regístrese o inicie sesión para acceder a carpetas privadas y compartidas. Tus chats se sincronizarán entre dispositivos.",
      continueTour: "Viaje continuo",
      signUp: "Regístrate / Acceder",
    },
    welcome: {
      title: "¡Bienvenido a {{appName}}!",
      description:
        "Rompe libre de la censura AI. Acceso GPT-5.1, Claude Sonnet y modelos sin censura entrenados en WikiLeaks y datos no principales. Chatear en privado, anónimamente o públicamente. Tu plataforma, tus reglas.",
      subtitle: "Vamos a explorar lo que nos hace diferentes:",
    },
    modelSelector: {
      title: "Elija su modelo AI",
      description:
        "A diferencia de ChatGPT, no estás encerrado en un AI. Cambiar entre GPT-5.1, Claude Sonnet, DeepSeek, y modelos sin censura como Gab Arya y UncensoredLM. Cada modelo ofrece perspectivas y capacidades únicas.",
      tip: "Incorporación para la seguridad, sin censura para la verdad. Mezcle y coincida en función de sus necesidades.",
    },
    aiCompanion: {
      title: "Elija su compañero AI",
      description:
        "Haga clic aquí para conocer a sus compañeros de AI. Cada uno tiene una personalidad única y el mejor modelo AI se selecciona automáticamente para ellos. Siempre puedes personalizar más tarde.",
      tip: "¡Haz clic para abrir y elegir a tu primer compañero!",
    },
    modelSelectorFavorites: {
      title: "Star Your Favoritos",
      description:
        "Construya su kit de herramientas AI personal. Modelos estrella para consultas seguras y modelos sin censura para conversaciones sin restricciones. Acceso rápido a lo que importa.",
    },
    modelSelectorShowAll: {
      title: "Ampliar para ver todos los modelos",
      description:
        "Accede a la biblioteca completa. Compare la corriente principal vs sin censura, encuentre modelos especializados para codificación o creatividad, descubra lo que ChatGPT no le permitirá usar.",
    },
    modelSelectorSearch: {
      title: "Modelos de búsqueda",
      description:
        "Encuentra exactamente lo que necesitas. Buscar por nombre, proveedor o capacidad. Trate de buscar 'sin censura' para ver modelos sin restricciones de contenido.",
    },
    modelSelectorGroup: {
      title: "Organizado por Proveedor &amp; Categoría",
      description:
        "Examine modelos agrupados por empresa (OpenAI, Anthropic, Gab) o propósito (Uncensored, Coding, Creative). Vea lo que ofrece cada proveedor.",
    },
    characterSelector: {
      title: "Personalizar la habilidad AI",
      description:
        "Las habilidades controlan cómo responde AI. Elige entre estilos incorporados o crea habilidades personalizadas con instrucciones específicas, tono y modelos preferidos. Haz que AI funcione a tu manera.",
      tip: "Pare cualquier habilidad con cualquier modelo. ¿Tono profesional con modelo sin censura? Hecho.",
    },
    characterSelectorFavorites: {
      title: "Estrella tus habilidades",
      description:
        "Acceso rápido a sus estilos de conversación. Mira las habilidades que más usas.",
    },
    characterSelectorShowAll: {
      title: "Ampliar para ver todas las habilidades",
      description:
        "Examine la biblioteca de habilidades completa. Crear habilidades personalizadas ilimitadas para diferentes tareas y flujos de trabajo.",
    },
    characterSelectorSearch: {
      title: "Habilidades de búsqueda",
      description:
        "Encuentra el estilo correcto rápido. Buscar por nombre, categoría o descripción.",
    },
    characterSelectorGroup: {
      title: "Organizado por Fuente &quot; Categoría &quot;",
      description:
        "Vista por fuente (Inicio, Personalizado, Comunidad) o categoría (Creativo, técnico, profesional). Encuentra lo que se adapte a tus necesidades.",
    },
    rootFolders: {
      title: "4 Modos de Privacidad",
      description: "Controla tus datos. Elija de anónimo a colaborativo:",
      private: {
        name: "Privadas",
        suffix: "Espacio de trabajo sincronizado",
      },
      incognito: {
        name: "Incognito",
        suffix: "Privacidad del tráfico cero",
      },
      shared: {
        name: "Compartida",
        suffix: "Colaboración con el equipo",
      },
      public: {
        name: "Público",
        suffix: "Foro abierto",
      },
    },
    incognitoFolder: {
      name: "Incognito",
      suffix: "Folder",
      description:
        "Verdadera privacidad. Historia almacenada sólo en el dispositivo. Los mensajes enviados para el procesamiento AI se eliminan inmediatamente de los servidores (los medios generados se almacenan temporalmente por razones técnicas). Pregunte a cualquier cosa sin dejar rastro.",
      note: "No cuenta • No almacenamiento de servidor • Máxima privacidad",
    },
    publicFolder: {
      name: "Público",
      suffix: "Folder",
      description:
        "Abrir el foro AI. Charla con AI y gente real. Tú decides lo que lees. Sólo eliminamos lo que rompe la ley o nuestros términos.",
      note: "Sin cuenta • Discurso gratis • Debate comunitario",
    },
    privateFolder: {
      name: "Privadas",
      suffix: "Folder",
      description:
        "Su espacio de trabajo personal AI. Sincronizado en todos los dispositivos, organizado con subcarpetas. Construir proyectos a largo plazo, ahorrar investigación, acceder a cualquier lugar.",
      authPrompt: "Requiere la cuenta:",
      login: "Iniciar sesión",
      signUp: "Sign Up",
    },
    sharedFolder: {
      name: "Compartida",
      suffix: "Folder",
      description:
        "Colaboración controlada. Compartir conversaciones específicas a través del enlace con permisos granulares. Perfecto para proyectos de equipo, obtener comentarios de expertos, o investigación colaborativa.",
      authPrompt: "Requiere la cuenta:",
      login: "Iniciar sesión",
      signUp: "Sign Up",
    },
    newChatButton: {
      title: "Inicio Nueva Conversación",
      description:
        "Haga clic aquí para comenzar un nuevo chat. Todas las conversaciones se guardan automáticamente en su carpeta actual para una organización fácil.",
      tip: "Cada carpeta mantiene su propio historial de chat separado.",
    },
    sidebarLogin: {
      title: "Crear cuenta gratuita",
      description:
        "Desbloquear carpetas privadas y compartidas, sincronizar todos los dispositivos, guardar modelos y habilidades favoritos. Incognito y estancia pública disponible sin cuenta.",
      tip: "Mantente anónimo o sincronizar todo. Tu elección.",
    },
    subscriptionButton: {
      title: "Créditos y suscripción",
      description:
        "Todo lo que ChatGPT ofrece más modelos sin censura, un foro público y privacidad real. {{credits}} créditos cada mes para {{price}}. Cada modelo incluido.",
      tip: "Una suscripción. Modelos de corriente principal y sin censura.",
    },
    chatInput: {
      title: "Escriba su mensaje",
      description:
        "Introduzca el área de texto y presione Enter para enviar su mensaje al AI.",
      tip: "Presione Shift+Enter para una nueva línea sin enviar.",
    },
    voiceInput: {
      title: "Grabación de voz",
      description:
        "Haga clic en el micrófono para iniciar la grabación. Cuando se hace, elija qué hacer:",
      options: {
        transcribe:
          "Transcribe al texto: convierte el discurso al texto editable",
        sendAudio: "Enviar como voz: AI escucha tu voz real",
        pauseResume: "Grabación de pausas/resujeto en cualquier momento",
      },
    },
    callMode: {
      title: "Modo de llamada",
      description:
        "Permitir conversaciones de voz a voz. Cuando esté activo, AI hablará respuestas en voz alta automáticamente usando texto a palabra.",
      tip: "Perfecto para conversaciones libres de manos. Toggle on/off por modelo.",
    },
    complete: {
      title: "¡Estás listo!",
      description:
        "Ahora tienes acceso a la corriente principal AND sin censura AI modelos, múltiples modos de privacidad y control completo sobre sus datos. Rompe libre de la censura AI. ¡Empieza a charlar!",
      help: "¿Necesitas ayuda? Pregunte a cualquier modelo, están aquí para ayudar.",
    },
    authUnlocked: {
      unlocked: "Carpeta desbloqueada!",
      privateDescription:
        "Su carpeta privada ahora está activa. Todos los chats se sincronizan entre dispositivos y permanecen organizados en subcarpetas.",
      privateNote: "Perfecto para proyectos en curso e investigación personal.",
      sharedDescription:
        "¡Carpeta compartida desbloqueada! Cree conversaciones y comparta vía enlace con el control de permisos granular.",
      sharedNote:
        "Ideal para la colaboración en equipo y obtener comentarios de expertos.",
    },
    buttons: {
      back: "Atrás",
      close: "Cerrar",
      last: "Acabado",
      next: "Siguiente",
      skip: "Skip Tour",
    },
  },
};
