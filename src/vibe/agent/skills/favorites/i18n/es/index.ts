import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "Chat",
    tags: {
      favorites: "Favoritos",
    },
    voices: {
      MALE: "Voz masculina",
      FEMALE: "Voz femenina",
    },

    get: {
      title: "Hazte Favorito.",
      description: "Recuperar una configuración favorita específica",
      container: {
        title: "Detalles favoritos",
      },
      editButton: {
        label: "Editar Favorito",
      },
      deleteButton: {
        label: "Suprímase Favorito",
      },
      viewSkillButton: {
        label: "Ver Habilidad",
      },
      signupPrompt: {
        title: "Personalizar la personalidad de la habilidad",
        description:
          "Edita el impulso del sistema de habilidad y el comportamiento. Inscríbete para empezar.",
        backButton: "Atrás",
        signupButton: "Crear cuenta",
        loginButton: "Iniciar sesión",
      },
      id: {
        label: "ID favorito",
      },
      response: {
        skillId: {
          content: "Habilidad: {{value}}",
        },
        customVariantName: {
          content: "Nombre de la variable: {{value}}",
        },
        customIcon: {
          content: "Icono personalizado: {{value}}",
        },
        voice: {
          content: "Voz: {{value}}",
        },
        mode: {
          content: "Modo: {{value}}",
        },
        intelligence: {
          content: "Inteligencia: {{value}}",
        },
        modelSelection: {
          title: "Selección de modelo",
        },
        selectionType: {
          content: "Tipo de selección: {{value}}",
        },
        minIntelligence: {
          content: "Min Intelligence: {{value}}",
        },
        maxIntelligence: {
          content: "Max Intelligence: {{value}}",
        },
        minPrice: {
          content: "Precio mínimo: {{value}}",
        },
        maxPrice: {
          content: "Precio máximo: {{value}}",
        },
        minContent: {
          content: "Nivel de contenido mínimo: {{value}}",
        },
        maxContent: {
          content: "Nivel de contenido máximo: {{value}}",
        },
        content: {
          content: "Nivel de contenido: {{value}}",
        },
        preferredStrengths: {
          content: "Fuerzas preferidas: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Debilidades ignoradas: {{value}}",
        },
        manualModelId: {
          content: "Modelo manual: {{value}}",
        },
        position: {
          content: "Posición: {{value}}",
        },
        color: {
          content: "Color: {{value}}",
        },
        isActive: {
          content: "Activo: {{value}}",
        },
        useCount: {
          content: "Tiempos usados: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Inválido favorito ID",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado para ver este favorito",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para ver este favorito",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encuentra",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to load favorite",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin salvar que se perderán",
        },
        conflict: {
          title: "Conflicto",
          description: "Un conflicto ocurrió mientras procesaba su solicitud",
        },
      },
      success: {
        title: "Operación completada",
        description: "Carga favorita con éxito",
      },
    },
    patch: {
      title: "Actualización Favorito",
      description: "Actualizar una configuración favorita existente",
      container: {
        title: "Editar Favorito",
      },
      backButton: {
        label: "Volver a Favorito",
      },
      deleteButton: {
        label: "Suprímase Favorito",
      },
      viewSkillButton: {
        label: "Ver Habilidad",
      },
      useThisSkillButton: {
        label: "Usar esta habilidad",
      },
      useThisModelButton: {
        label: "Use este modelo",
      },
      currentlyActiveButton: {
        label: "Actualmente activo",
      },
      signupPrompt: {
        title: "Personalizar la personalidad de la habilidad",
        description:
          "Edita el impulso del sistema de habilidad y el comportamiento. Inscríbete para empezar.",
        backButton: "Atrás",
        signupButton: "Crear cuenta",
        loginButton: "Iniciar sesión",
      },
      saveButton: {
        label: "Guardar",
        loadingText: "Salvando...",
      },
      saveAndUseButton: {
        label: "Guardar y usar",
        loadingText: "Guardando y activando...",
      },
      id: {
        label: "ID favorito",
      },
      skillId: {
        label: "Habilidad",
        description:
          'Habilidad ID. Utilice " skillSlug" para la variante predeterminada, " skillSlug__variantId" para una variante específica.',
      },
      customVariantName: {
        label: "Nombre de la variable",
        description:
          "Nombre personalizado para esta variante (dejar vacío para usar el predeterminado de habilidades)",
      },
      chatModel: {
        label: "Modelo de Chat",
        placeholder: "Inherencia de la habilidad",
      },
      voice: {
        label: "AI Voice",
        description:
          "Superar la voz TTS para este favorito. null = su configuración de voz global gana (modelo de puente: configuración del usuario toma prioridad). Establece aquí para darle a este favorito una voz diferente.",
        placeholder: "Inherencia de la habilidad",
      },
      sttModel: {
        label: "Modelo Speech-to-Text",
        description:
          "Superar el modelo STT para este favorito. null = tu preferencia global STT gana (modelo de puente). Conjunto sólo para necesidades de transcripción especializadas.",
        placeholder: "Inherencia de la habilidad",
      },
      imageVisionModel: {
        label: "Modelo de visión de imagen",
        description:
          "Superar la visión de imagen LLM para este favorito. null = el usuario gana la preferencia global (modelo de puente). Conjunto para forzar un modelo de visión específico.",
        placeholder: "Inherencia de la habilidad",
      },
      videoVisionModel: {
        label: "Modelo de Visión de Video",
        description:
          "Superar la visión de vídeo LLM para este favorito. null = el usuario gana la preferencia global (modelo de puente).",
        placeholder: "Inherencia de la habilidad",
      },
      audioVisionModel: {
        label: "Modelo Audio Vision",
        description:
          "Superar la visión de audio LLM para este favorito. null = ganadores de preferencia global del usuario (modelo de puente).",
        placeholder: "Inherencia de la habilidad",
      },
      imageGenModel: {
        label: "Modelo de generación de imagen",
        description:
          "Anular el generador de imagen para este favorito. null = habilidad imageGenModelSelection gana (media gen: habilidad toma prioridad). Establece aquí para usar un generador diferente de lo que la habilidad especifica.",
        placeholder: "Inherencia de la habilidad",
      },
      musicGenModel: {
        label: "Modelo de generación de música",
        description:
          "Anular el generador de música para este favorito. null = musicGenModelSelection de habilidad gana (media gen: habilidad toma prioridad).",
        placeholder: "Inherencia de la habilidad",
      },
      videoGenModel: {
        label: "Modelo de Generación de Video",
        description:
          "Override generador de vídeo para este favorito. null = habilidad videoGenModelSelection gana (media gen: habilidad toma prioridad).",
        placeholder: "Inherencia de la habilidad",
      },
      mode: {
        label: "Modo de selección",
      },
      modelSelection: {
        title: "Selección de modelo",
        label: "Selección de modelo",
        description:
          "Anula el modelo para esta ranura. Use filtros o elija un modelo específico. Pase null para usar el modelo predeterminado de la habilidad.",
      },
      selectionType: {
        label: "Tipo de selección",
        characterBased: "Basado en la habilidad",

        manual: "Modelo específico",
        filters: "Criterios de filtro",
      },
      intelligence: {
        label: "Nivel de inteligencia",
      },
      minIntelligence: {
        label: "Inteligencia mínima",
        description:
          "Nivel mínimo de inteligencia/capacidad requerido para el modelo",
      },
      maxIntelligence: {
        label: "Inteligencia Máxima",
        description:
          "Nivel máximo de inteligencia/capacidad permitido para el modelo",
      },
      minPrice: {
        label: "Precio mínimo",
        description: "Costo mínimo de crédito por mensaje",
      },
      maxPrice: {
        label: "Precio máximo",
      },
      minContent: {
        label: "Nivel mínimo de contenido",
        description: "Nivel mínimo de moderación de contenido para el modelo",
      },
      maxContent: {
        label: "Nivel máximo de contenido",
        description: "Nivel máximo de moderación de contenido para el modelo",
      },
      content: {
        label: "Nivel de contenido",
      },
      preferredStrengths: {
        label: "Fuerzas preferidas",
        description: "Capacidades modelo y fortalezas para preferir",
      },
      ignoredWeaknesses: {
        label: "Enfermedades ignoradas",
        description: "Debilidades modelo para ignorar o permitir",
      },
      manualModelId: {
        label: "Modelo manual",
      },
      isActive: {
        label: "Activa",
      },
      position: {
        label: "Position",
      },
      color: {
        label: "Color",
        description: "Color personalizado para este favorito",
      },
      customIcon: {
        label: "Icono personalizado",
        description: "icono personalizado para este favorito",
      },
      icon: {
        label: "Icono personalizado",
        description:
          "Anule el icono predeterminado de la habilidad para esta ranura favorita",
      },
      availableTools: {
        label: "Herramientas permitidas",
        description:
          "Sobrescribir las herramientas permitidas para esta ranura. Cada entrada necesita un toolId (utiliza system_help_GET para descubrir los IDs de herramientas disponibles). Establecer requiresConfirmation : verdadero para pedir antes de ejecutar. Pase null para caer a través de la habilidad o configuración global.",
      },
      pinnedTools: {
        label: "Herramientas pintadas",
        description:
          "Sobrescribir herramientas de barras de herramientas fijas para esta ranura. Pase null para caer a través de la habilidad o configuración global.",
      },
      deniedTools: {
        label: "Herramientas denegadas",
        description:
          "Bloquear herramientas específicas para esta ranura en la parte superior de la propia lista negada de la habilidad. Estas herramientas no se pueden llamar independientemente de otros ajustes.",
        clearAll: "Despejado todo",
        noToolsFound: "No se han encontrado herramientas",
        blockedNote:
          "Las herramientas bloqueadas no se pueden llamar independientemente de otros ajustes.",
        searchPlaceholder: "Herramientas de búsqueda...",
        blocked: "bloqueado",
      },
      promptAppend: {
        label: "Prompt Append",
        description:
          "Instrucciones adicionales anexadas al sistema de habilidad para esta ranura sólo. Utilice esto para personalizar sin cambiar la habilidad compartida. Agentes AI: popula con el nombre del usuario, preferencia de idioma, nivel técnico, contexto de dominio (por ejemplo, 'Mi nombre es Max. Prefiero TypeScript y bun. Responder en inglés.').",
        placeholder:
          "Por ejemplo. Me llamo Alex. Prefiero respuestas concisas en inglés.",
      },
      compactTrigger: {
        label: "Trigger compacto (tokens)",
        description:
          "Anula el número de fichas que activa la compactación de conversación para esta ranura. Pase null para caer a través de la habilidad o por defecto global.",
      },
      memoryLimit: {
        label: "Límite de memoria (tokens)",
        description:
          "Superar las fichas totales máximas del contenido de memoria inyectadas por turno para esta ranura. Pase null para caer a través de la habilidad o por defecto global.",
      },
      changeSkill: {
        label: "Cambiar la habilidad",
      },
      modifySkill: {
        label: "Modificar habilidad",
      },
      response: {
        success: {
          content: "Actualizado: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Por favor, compruebe su entrada e inténtelo de nuevo",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado para actualizar este favorito",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para actualizar este favorito",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encuentra",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to update favorite",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin salvar que se perderán",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto al actualizar el favorito",
        },
      },
      slotOverride: {
        label: "Anulación para esta ranura",
      },
      globalDefault: {
        label: "Mi defecto (fallback)",
      },
      success: {
        title: "Operación completada",
        description: "Actualización favorita con éxito",
      },
    },
    delete: {
      title: "Suprímase Favorito",
      description: "Eliminar una configuración favorita",
      container: {
        title: "Suprímase Favorito",
        description: "Eliminar permanentemente esta configuración favorita",
      },
      backButton: {
        label: "Cancelar",
      },
      actions: {
        delete: "Suprímase Favorito",
        deleting: "Eliminar a Favorito",
      },
      id: {
        label: "ID favorito",
        description: "El slug o el ID amistoso de la favorita para eliminar",
      },
      response: {
        success: {
          content: "Suprimido: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Inválido favorito ID",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado para eliminar este favorito",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para eliminar este favorito",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encuentra",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to delete favorite",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin salvar que se perderán",
        },
        conflict: {
          title: "Conflicto",
          description: "No se puede eliminar favorito debido a un conflicto",
        },
      },
      success: {
        title: "Operación completada",
        description: "Eliminado favorito con éxito",
      },
    },
  },
  category: "Chat",
  tags: {
    favorites: "Favoritos",
  },
  active: "Activa",
  fallbacks: {
    unknownSkill: "Habilidad desconocida",
    unknownModel: "Modelo desconocido",
    unknown: "Desconocida",
    unknownProvider: "desconocida",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 créditos",
    noModelConfiguration: "Error: No hay configuración de modelo",
    configurationMissing: "Falta de configuración",
    noModel: "No modelo",
    dash: ", ",
  },
  enums: {
    selectionType: {
      characterBased: "Basado en la habilidad",
      manual: "Modelo específico",
      filters: "Criterios de filtro",
    },
    mode: {
      auto: "Automático",
      manual: "Manual",
    },
    intelligence: {
      any: "Cualquiera",
      quick: "Rápido",
      smart: "Inteligente",
      brilliant: "Brillante",
    },
    price: {
      any: "Cualquiera",
      cheap: "barato",
      standard: "Estándar",
      premium: "Premium",
    },
    content: {
      any: "Cualquiera",
      mainstream: "Convencional",
      open: "Abierto",
      uncensored: "Sin censura",
    },
    variantsMode: {
      all: "Todas las variantes",
      some: "Algunas variantes",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Ordenar por nivel de inteligencia",
      price: "Ordenar por Precio",
      content: "Ordenar por Content Policy",
    },
    sortDirection: {
      asc: "Bajo a Alto",
      desc: "Alto a bajo",
    },
    sortField: {
      intelligence: "Inteligencia",
      price: "Precio",
      content: "Contenido",
    },
  },
  get: {
    title: "Obtener favoritos",
    titleShort: "Favoritos",
    description:
      "Recuperar todas tus configuraciones favoritas de habilidad guardadas",
    userId: {
      label: "Usuario ID",
      description:
        "Admin only: busca favoritos para un usuario específico. Deja vacío para buscar tus propios favoritos.",
    },
    fields: {
      query: {
        label: "Buscar",
        description: "Buscar favoritos por nombre, tagline o habilidad ID.",
      },
      page: {
        label: "Página",
        description:
          "Número de página para resultados paginados (AI / MCP : tamaño de la página 25 por defecto).",
      },
      pageSize: {
        label: "Tamaño de página",
        description:
          "Número de favoritos por página (1–500). AI / MCP llamadas predeterminados a 25; los calladores humanos devuelven todo.",
      },
    },
    actions: {
      menu: "Opciones",
      share: "Compartir y ganar",
      addAi: "Añadir un AI",
      edit: "Editar",
      active: "Activa",
      reorder: "Arrastre a reorden",
      moveUp: "Muévanse.",
      moveDown: "Muévete.",
      showMore: "{{count}} más modelos",
      showLess: "Mostrar menos",
      settings: "Configuración de chat",
    },
    addVariant: "Añadir otro modelo",
    viewSkill: "Detalles",
    deleteVariant: "¿Retirar este modelo?",
    deleteVariantAction: "Retirar",
    deleteGroup: {
      trigger: "Quitar la habilidad",
      confirm: "Quitar esta habilidad y sus modelos {{count}}?",
      cancel: "Cancelar",
      action: "Retirar",
    },
    emptyState:
      "Todavía no hay habilidades. Escoge uno para empezar a charlar.",
    tabs: {
      myFavorites: "Mis habilidades",
      browseSkills: "Buscar habilidades",
    },
    sections: {
      companion: "Compañeros",
      skills: "Skills",
      model: "Modelos de pintura",
      background: "Agentes de antecedentes",
    },
    container: {
      title: "Tus habilidades",
      description:
        "Gestione sus configuraciones favoritas de habilidad y modelo",
    },
    createButton: {
      label: "Explora las habilidades",
    },
    response: {
      favorite: {
        title: "Configuración favorita",
        id: {
          content: "ID: {{value}}",
        },
        skillId: {
          content: "Habilidad: {{value}}",
        },
        customVariantName: {
          content: "Nombre de la variable: {{value}}",
        },
        customIcon: {
          content: "Icono personalizado: {{value}}",
        },
        voice: {
          content: "Voz: {{value}}",
        },
        mode: {
          content: "Modo: {{value}}",
        },
        intelligence: {
          content: "Inteligencia: {{value}}",
        },
        modelSelection: {
          title: "Selección de modelo",
        },
        selectionType: {
          content: "Tipo de selección: {{value}}",
        },
        minIntelligence: {
          content: "Min Intelligence: {{value}}",
        },
        maxIntelligence: {
          content: "Max Intelligence: {{value}}",
        },
        minPrice: {
          content: "Precio mínimo: {{value}}",
        },
        maxPrice: {
          content: "Precio máximo: {{value}}",
        },
        minContent: {
          content: "Nivel de contenido mínimo: {{value}}",
        },
        maxContent: {
          content: "Nivel de contenido máximo: {{value}}",
        },
        content: {
          content: "Nivel de contenido: {{value}}",
        },
        preferredStrengths: {
          content: "Fuerzas preferidas: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Debilidades ignoradas: {{value}}",
        },
        manualModelId: {
          content: "Modelo manual: {{value}}",
        },
        position: {
          content: "Posición: {{value}}",
        },
        color: {
          content: "Color: {{value}}",
        },
        isActive: {
          content: "Activo: {{value}}",
        },
        useCount: {
          content: "Tiempos usados: {{value}}",
        },
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "Has Companion: {{value}}",
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
        description: "Debes estar conectado para ver los favoritos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este recurso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontraron favoritos",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to load favorites",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar que se perderán",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió mientras procesaba su solicitud",
      },
    },
    success: {
      title: "Operación completada",
      description: "Favoritos cargados con éxito",
    },
  },
  post: {
    title: "Crear Favorito",
    description: "Crear una nueva configuración de habilidad favorita",
    container: {
      title: "Nuevo Favorito",
      description: "Guardar una configuración de habilidad como favorito",
    },
    backButton: {
      label: "Cancelar",
    },
    useWithoutSavingButton: {
      label: "Uso sin agregar a los Favs",
      loadingText: "Aplicando...",
    },
    submitButton: {
      label: "Agregar a los favoritos",
      loadingText: "Añadiendo...",
    },
    skillId: {
      label: "Habilidad",
      description: "Seleccione la habilidad para este favorito",
    },
    customVariantName: {
      label: "Nombre de la variable",
      description:
        "Nombre personalizado para esta variante (dejar vacío para usar el predeterminado de habilidades)",
    },
    customIcon: {
      label: "Icono personalizado",
      description: "icono personalizado opcional para este favorito",
    },
    voice: {
      label: "Voz",
      description: "Voz preferida para la conversión de texto a voz",
    },
    mode: {
      label: "Modo de selección",
      description: "Cómo debe seleccionarse el modelo",
    },
    modelSelection: {
      title: "Selección de modelo",
      description:
        "Elija cómo seleccionar el modelo AI - elegir un modelo específico o dejar que el sistema elija basado en filtros",
    },
    selectionType: {
      label: "Tipo de selección",
      manual: "Modelo específico",
      filters: "Criterios de filtro",
    },
    intelligence: {
      label: "Nivel de inteligencia",
      description: "Nivel mínimo de inteligencia requerido",
    },
    intelligenceRange: {
      label: "Intelligence Range",
      description: "Nivel de inteligencia/capacidad requerido para el modelo",
      minLabel: "Min Intelligence",
      maxLabel: "Max Intelligence",
    },
    minIntelligence: {
      label: "Inteligencia mínima",
      description:
        "Nivel mínimo de inteligencia/capacidad requerido para el modelo",
    },
    maxIntelligence: {
      label: "Inteligencia Máxima",
      description:
        "Nivel máximo de inteligencia/capacidad permitido para el modelo",
    },
    priceRange: {
      label: "Precio Rango",
      description: "Rango de costes de crédito por mensaje",
      minLabel: "Min Price",
      maxLabel: "Precio máximo",
    },
    minPrice: {
      label: "Precio mínimo",
      description: "Costo mínimo de crédito por mensaje",
    },
    maxPrice: {
      label: "Precio máximo",
      description: "Precio máximo del tier para utilizar",
    },
    contentRange: {
      label: "Rango de contenido",
      description: "Rango de nivel de moderación del contenido",
      minLabel: "Min Content",
      maxLabel: "Max Content",
    },
    minContent: {
      label: "Nivel mínimo de contenido",
      description: "Nivel mínimo de moderación de contenido para el modelo",
    },
    maxContent: {
      label: "Nivel máximo de contenido",
      description: "Nivel máximo de moderación de contenido para el modelo",
    },
    content: {
      label: "Nivel de contenido",
      description: "Nivel de moderación del contenido",
    },
    preferredStrengths: {
      label: "Fuerzas preferidas",
      description: "Capacidades modelo y fortalezas para preferir",
    },
    ignoredWeaknesses: {
      label: "Enfermedades ignoradas",
      description: "Debilidades modelo para ignorar o permitir",
    },
    manualModelId: {
      label: "Modelo manual",
      description: "Modelo específico para usar (para modo manual)",
    },
    response: {
      id: {
        content: "Creado favorito con ID : {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para añadir favoritos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para crear favoritos",
      },
      notFound: {
        title: "No encontrado",
        description: "El elemento que estás tratando de favorito no existe",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to add to favorites",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar que se perderán",
      },
      conflict: {
        title: "Conflicto",
        description: "Este favorito ya existe",
      },
    },
    success: {
      title: "Operación completada",
      description: "Creado con éxito",
    },
  },
  reorder: {
    post: {
      title: "Reorder Favoritos",
      description: "Actualice el orden de sus configuraciones favoritas",
      errors: {
        validation: {
          title: "Orden inválida",
          description:
            "Por favor, compruebe la configuración de su pedido e inténtelo de nuevo",
        },
        network: {
          title: "Error de conexión",
          description:
            "Incapaz de salvar el nuevo orden. Por favor, inténtelo de nuevo.",
        },
        unauthorized: {
          title: "Inicia sesión para continuar",
          description: "Por favor, regístrese para reordenar sus favoritos",
        },
        forbidden: {
          title: "Permission Denied",
          description: "No tienes permiso para reordenar favoritos",
        },
        notFound: {
          title: "No se encontraron",
          description: "No pudimos encontrar tus favoritos para reordenar",
        },
        server: {
          title: "Algo que estaba mal.",
          description:
            "No podíamos salvar tu nueva orden. Por favor, inténtelo de nuevo.",
        },
        unknown: {
          title: "Error inesperado",
          description:
            "Algo inesperado sucedió. Por favor, inténtelo de nuevo.",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tus cambios aún no han sido salvados.",
        },
        conflict: {
          title: "Conflicto de orden",
          description:
            "La orden ha cambiado. Por favor, refresca y prueba de nuevo",
        },
      },
      success: {
        title: "Orden guardada",
        description: "Tus favoritos han sido reordenados con éxito",
      },
    },
  },
};
