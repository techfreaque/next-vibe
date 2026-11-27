import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  voices: {
    MALE: "Voz masculina",
    FEMALE: "Voz femenina",
  },
  enums: {
    category: {
      companion: "Compañeros",
      assistant: "Assistants",
      coding: "Programación",
      creative: "Creativo",
      writing: "Escribir",
      analysis: "Análisis",
      roleplay: "Juego de rol",
      education: "Educación",
      controversial: "Controversial",
      background: "Antecedentes",
      custom: "Personalizado",
    },
    ownershipType: {
      system: "Capacidad incorporada",
      user: "Creado por usted",
      public: "De la comunidad",
    },
  },

  get: {
    title: "Consigue habilidad",
    titleShort: "Detalles de la habilidad",
    dynamicTitle: "habilidad: {{name}}",
    description: "Recuperar una habilidad específica por ID",
    container: {
      title: "Detalles",
      description: "Detalles de la habilidad solicitada",
    },
    backButton: {
      label: "Volver a las habilidades",
    },
    openFullPage: "Abrir página completa",
    editButton: {
      label: "Editar la habilidad",
    },
    customizeButton: {
      label: "Personalizar la habilidad",
    },
    deleteButton: {
      label: "Eliminar la habilidad",
    },
    addToFavoritesButton: {
      label: "Agregar a los favoritos",
    },
    inCollection: "En la colección",
    useNow: "Usar ahora",
    goToChat: "Ir a Chat",
    addAnother: "Añadir otro",
    addAnotherTooltip: "Añadir otro ejemplo de esta habilidad a tu colección",
    variants: {
      title: "Elija un modelo",
      strength: "Fuerza",
      weakness: "Debilidad",
    },
    addToCollection: "Añadir a tu colección:",
    addAllToFavorites: "Agregar todos los modelos",
    quickAdd: "Añadir",
    tweakAndAdd: "Ajustar y añadir",
    edit: "Editar",
    copyAndCustomize: "Haz mi propia versión",
    delete: "Eliminar",
    vote: "Votación",
    report: "Informe",
    actions: "Acciones",
    designSelector: {
      label: "Diseño:",
      current: "Corriente",
      a: "A: App Store",
      b: "B: Cabecera de división",
      c: "C: Card Hero",
      d: "D: Dos puntos",
    },
    addVariant: "Añadir otro modelo",
    addVariantHint: "Diferente modelo, personalidad o estilo",
    yourskill: "Tu habilidad.",
    signupPrompt: {
      title: "Personalizar esta habilidad",
      description:
        "Cree una versión personalizada con sus propios ajustes y preferencias. Inscríbete para empezar.",
      backButton: "Atrás",
      signupButton: "Crear cuenta",
      loginButton: "Iniciar sesión",
    },
    id: {
      label: "habilidad ID",
      description: "El slug o el ID amistoso de la habilidad",
    },
    systemPrompt: {
      label: "Prompt del sistema",
      copy: "Copiar",
      copied: "¡Copiado!",
      view: "Ver el mensaje completo",
    },
    models: {
      brain: "Cerebro",
      eyes: "Ojos",
      ears: "Oídos y voz",
      media: "Medios",
      slots: {
        chat: "Chat",
        imageVision: "Imagen visual",
        videoVision: "Visión de vídeo",
        stt: "Discurso al texto",
        tts: "Texto al discurso",
        audioVision: "Visión de audio",
        imageGen: "Image gen",
        musicGen: "Music gen",
        videoGen: "Video gen",
      },
    },
    response: {
      skill: {
        title: "habilidad",
        id: { content: "habilidad ID" },
        name: { content: "Nombre" },
        description: { content: "habilidad Descripción" },
        icon: { content: "habilidad Icon" },
        systemPrompt: { content: "Prompt del sistema" },
        category: { content: "Categoría" },
        source: { content: "Fuente" },
        preferredModel: { content: "Modelo preferente" },
        voice: { content: "Voz" },
        modelSelection: { title: "Selección de modelo" },
        selectionType: { content: "Tipo de selección" },
        minIntelligence: { content: "Inteligencia mínima" },
        maxIntelligence: { content: "Inteligencia Máxima" },
        minPrice: { content: "Precio mínimo" },
        maxPrice: { content: "Precio máximo" },
        minContent: { content: "Nivel mínimo de contenido" },
        maxContent: { content: "Nivel máximo de contenido" },
        preferredStrengths: { content: "Fuerzas preferidas" },
        ignoredWeaknesses: { content: "Enfermedades ignoradas" },
        manualModelId: { content: "Modelo manual" },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para acceder a este recurso",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este recurso",
      },
      notFound: {
        title: "habilidad No se encontró",
        description: "La habilidad solicitada no existe",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al recuperar la habilidad",
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
        description: "Un conflicto ocurrió con el estado actual",
      },
    },
    voiceModelSelection: {
      systemDefault: "Indeterminación del sistema",
    },
    success: {
      title: "Operación completada",
      description: "habilidad recuperada con éxito",
    },
    share: {
      button: "Compartir y Ganar",
      titleNamed: "Compartir {{name}} y ganar",
      title: "Compartir esta habilidad y ganar",
      description:
        "Comparte esta habilidad con tu enlace de referencia. Ganar un 10% de comisión recurrente de cada usuario que se registra.",
      selectCode: "Seleccione el código de referencia:",
      noCodesYet: "Aún no hay códigos de remisión",
      createCode: "Crear un código",
      codePlaceholder: "Por ejemplo. MYCODE",
      creating: "Creando...",
      createFailed: "No podía crear ese código. Prueba otro.",
      linkReady: "Su enlace de compartir:",
      copied: "¡Copiado!",
      copyLink: "Copiar Enlace",
      close: "Cerrar",
      authRequired:
        "Cree una cuenta gratuita para obtener su enlace de referencia y empezar a ganar.",
      signup: "Regístrate gratis",
      login: "¿Ya tienes una cuenta? Iniciar sesión",
    },
  },
  patch: {
    title: "Actualización de la habilidad",
    titleShort: "Actualizar la habilidad",
    dynamicTitle: "Editar: {{name}}",
    container: {
      title: "Actualización de la habilidad",
      description: "Modificar una habilidad personalizada existente",
    },
    backButton: {
      label: "Volver a la habilidad",
    },
    deleteButton: {
      label: "Eliminar la habilidad",
    },
    submitButton: {
      label: "Actualización de la habilidad",
      loadingText: "Actualización de la habilidad...",
    },
    actions: {
      update: "Actualización de la habilidad",
      updating: "Actualización de la habilidad",
    },
    response: {
      success: {
        content: "actualización con éxito",
      },
    },
    id: {
      label: "habilidad ID",
      description: "El slug o el ID amistoso de la habilidad para actualizar",
    },
    name: {
      label: "Nombre",
      description:
        "Dale a tu habilidad un nombre memorable. Así es como ustedes y otros los identificarán.",
      placeholder: "Ingrese el nombre de habilidad",
      validation: {
        minLength: "El nombre debe ser por lo menos 2 caracteres",
        maxLength: "El nombre debe ser inferior a 100 caracteres",
      },
    },
    tagline: {
      label: "etiquetado",
      description:
        "Un pegadizo de una línea que captura la esencia de su habilidad. Mantenlo corto y descriptivo.",
      placeholder: "Ingrese un corto tagline",
      validation: {
        minLength: "Tagline debe ser al menos 2 caracteres",
        maxLength: "Tagline debe ser inferior a 500 caracteres",
      },
    },
    icon: {
      label: "habilidad Icon",
      description:
        "Escoge un emoji que represente tu habilidad. Este icono aparece cuando se muestra la habilidad.",
    },
    description: {
      label: "habilidad Descripción",
      description:
        "Describir lo que hace que esta habilidad sea única. ¿Cuál es su papel? ¿Con qué pueden ayudar? Sé específico y detallado.",
      placeholder: "Describir el propósito y las capacidades de su habilidad",
      validation: {
        minLength: "Descripción debe ser por lo menos 10 habilidades",
        maxLength: "Descripción debe ser menos de 500 habilidades",
      },
    },
    category: {
      label: "Categoría",
      description:
        "Elija la categoría que mejor se ajuste a su habilidad. Esto ayuda con la organización y el descubrimiento.",
    },
    isPublic: {
      label: "Hacer público",
      description:
        "Permite esto para compartir su habilidad con la comunidad. Cuando está deshabilitado, la habilidad sigue siendo privada y sólo visible para usted.",
    },
    chatModel: {
      label: "Modelo de Chat",
      placeholder: "Indeterminación del sistema",
    },
    voice: {
      label: "Voz",
      description:
        "Seleccione una voz de texto a voz para las respuestas de audio. Cada habilidad puede tener su propia voz única.",
      placeholder: "Indeterminación del sistema",
    },
    sttModel: {
      label: "Modelo Speech-to-Text",
      description: "Modelo utilizado para el reconocimiento del habla",
      placeholder: "Indeterminación del sistema",
    },
    imageVisionModel: {
      label: "Modelo de visión de imagen",
      description: "Modelo utilizado para analizar imágenes",
      placeholder: "Indeterminación del sistema",
    },
    videoVisionModel: {
      label: "Modelo de Visión de Video",
      description: "Modelo utilizado para analizar vídeos",
      placeholder: "Indeterminación del sistema",
    },
    audioVisionModel: {
      label: "Modelo Audio Vision",
      description: "Modelo utilizado para el análisis de audio",
      placeholder: "Indeterminación del sistema",
    },
    imageGenModel: {
      label: "Modelo de generación de imagen",
      description: "Modelo utilizado para generar imágenes",
      placeholder: "Indeterminación del sistema",
    },
    musicGenModel: {
      label: "Modelo de generación de música",
      description: "Modelo utilizado para generar música",
      placeholder: "Indeterminación del sistema",
    },
    videoGenModel: {
      label: "Modelo de Generación de Video",
      description: "Modelo utilizado para generar vídeos",
      placeholder: "Indeterminación del sistema",
    },
    systemPrompt: {
      label: "Prompt del sistema",
      description:
        "Define el comportamiento, la personalidad y la experiencia de tu habilidad. Esta es la instrucción básica que forma cómo responde el AI. Sea detallado sobre el tono, las áreas de conocimiento y el estilo de conversación.",
      placeholder: "Usted es un asistente útil que se especializa en...",
      validation: {
        minLength:
          "El impulso del sistema debe ser por lo menos 10 habilidades",
        maxLength: "El sistema debe ser inferior a 5000 habilidades",
      },
    },
    source: {
      label: "Fuente",
      description:
        "La fuente de esta habilidad (construida, personalizada o comunitaria)",
    },
    modelSelection: {
      label: "Selección de modelo",
      description:
        "Elija cómo seleccionar el modelo AI - elegir un modelo específico o dejar que el sistema elija basado en filtros",
    },
    variants: {
      label: "Variantes",
      description:
        "Variantes con selecciones de modelos per-variantes. Cada variante necesita: id (cadena única), modelSelection (requerido), isDefault (exactamente uno debe ser verdad). Opcional: displayName, voz/visión/gen modelo anula.",
      addButton: "Añadir Variante",
      setDefault: "Establecer como Default",
      remove: "Retirar",
      defaultBadge: "Predeterminado",
      namePlaceholder: "Nombre variable (opcional)",
      skillDefaults: "Incumplimiento de nivel de habilidad",
      skillDefaultsHint:
        "Fallback cuando una variante no configura una modalidad",
    },
    preferredModel: {
      label: "Modelo preferente",
      description: "El modelo AI preferido para esta habilidad",
    },
    availableTools: {
      label: "Herramientas permitidas",
      description:
        "Lista de herramientas que esta habilidad puede usar. Cada entrada necesita un toolId (utiliza system_help_GET para descubrir los IDs de herramientas disponibles). Establecer requiresConfirmation : verdadero para pedir antes de ejecutar. Pase null para heredar desde entornos globales.",
    },
    pinnedTools: {
      label: "Herramientas pintadas",
      description:
        "Herramientas clavadas en la barra de herramientas para un acceso rápido al usar esta habilidad. Subconjunto de availableTools. Pase null para usar herramientas predeterminadas.",
    },
    compactTrigger: {
      label: "Trigger compacto (tokens)",
      description:
        "Cuenta token que activa la compactación de conversación automática. Se establece para null para usar el predeterminado global.",
    },

    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos de habilidad son inválidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para actualizar las habilidades",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para actualizar esta habilidad",
      },
      notFound: {
        title: "habilidad No se encontró",
        description: "La habilidad que intentas actualizar no existe",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al actualizar la habilidad",
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
        description:
          "Se produjo un conflicto mientras se actualizaba la habilidad",
      },
    },
    success: {
      title: "habilidad Actualizada",
      description: "Su habilidad personalizada ha sido actualizada con éxito",
    },
  },
  delete: {
    title: "Eliminar la habilidad",
    titleShort: "Eliminar la habilidad",
    dynamicTitle: "Suprímase: {{name}}",
    description: "Eliminar una habilidad personalizada",
    container: {
      title: "Eliminar la habilidad",
      description: "Eliminar permanentemente esta habilidad personalizada",
    },
    backButton: {
      label: "Volver a la habilidad",
    },
    actions: {
      delete: "Eliminar la habilidad",
      deleting: "Eliminar la habilidad",
    },
    id: {
      label: "habilidad ID",
      description: "El slug o el ID amistoso de la habilidad para eliminar",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos de habilidad son inválidos",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a eliminar esta habilidad",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para eliminar esta habilidad",
      },
      notFound: {
        title: "habilidad No se encontró",
        description: "La habilidad que estás tratando de eliminar no existe",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al eliminar la habilidad",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado mientras se elimina la habilidad",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "La habilidad ha sido modificada por otro usuario",
      },
    },
    success: {
      title: "habilidad Suprimida",
      description: "La habilidad se ha eliminado con éxito",
      content: "habilidad eliminada con éxito",
    },
  },
};
