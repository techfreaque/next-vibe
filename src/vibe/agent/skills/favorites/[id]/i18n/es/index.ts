import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "Favorito",
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
      label: "Ver habilidad",
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
    titleShort: "Actualización Favorito",
    description: "Actualizar una configuración favorita existente",
    container: {
      title: "Editar la configuración de habilidades",
    },
    backButton: {
      label: "Volver a Favorito",
    },
    deleteButton: {
      label: "Suprímase Favorito",
    },
    viewSkillButton: {
      label: "Ver habilidad",
    },
    reportButton: {
      label: "Informe",
    },
    useThisSkillButton: {
      label: "Usa esta habilidad",
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
      label: "Label",
      description:
        "Nombre personalizado para esta variante (dejar vacío para usar el predeterminado de habilidades)",
    },
    chatModel: {
      label: "Modelo de Chat",
      placeholder: "Igual que la habilidad",
    },
    voice: {
      label: "AI Voice",
      description:
        "Superar la voz TTS para este favorito. null = su configuración de voz global gana (modelo de puente: configuración del usuario toma prioridad). Establece aquí para darle a este favorito una voz diferente.",
      placeholder: "Igual que la habilidad",
    },
    sttModel: {
      label: "Modelo Speech-to-Text",
      description:
        "Superar el modelo STT para este favorito. null = tu preferencia global STT gana (modelo de puente). Conjunto sólo para necesidades de transcripción especializadas.",
      placeholder: "Igual que la habilidad",
    },
    imageVisionModel: {
      label: "Modelo de visión de imagen",
      description:
        "Superar la visión de imagen LLM para este favorito. null = el usuario gana la preferencia global (modelo de puente). Conjunto para forzar un modelo de visión específico.",
      placeholder: "Igual que la habilidad",
    },
    videoVisionModel: {
      label: "Modelo de Visión de Video",
      description:
        "Superar la visión de vídeo LLM para este favorito. null = el usuario gana la preferencia global (modelo de puente).",
      placeholder: "Igual que la habilidad",
    },
    audioVisionModel: {
      label: "Modelo Audio Vision",
      description:
        "Superar la visión de audio LLM para este favorito. null = ganadores de preferencia global del usuario (modelo de puente).",
      placeholder: "Igual que la habilidad",
    },
    imageGenModel: {
      label: "Modelo de generación de imagen",
      description:
        "Anular el generador de imagen para este favorito. null = habilidad imageGenModelSelection gana (media gen: habilidad toma prioridad). Establece aquí para usar un generador diferente de lo que la habilidad especifica.",
      placeholder: "Igual que la habilidad",
    },
    musicGenModel: {
      label: "Modelo de generación de música",
      description:
        "Anular el generador de música para este favorito. null = musicGenModelSelection de habilidad gana (media gen: habilidad toma prioridad).",
      placeholder: "Igual que la habilidad",
    },
    videoGenModel: {
      label: "Modelo de Generación de Video",
      description:
        "Override generador de vídeo para este favorito. null = habilidad videoGenModelSelection gana (media gen: habilidad toma prioridad).",
      placeholder: "Igual que la habilidad",
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
    titleShort: "Suprímase Favorito",
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
};
