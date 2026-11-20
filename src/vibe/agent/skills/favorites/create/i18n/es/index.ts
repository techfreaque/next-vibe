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

  post: {
    title: "Crear Favorito",
    titleShort: "Añadir Favorito",
    description: "Crear una nueva configuración de habilidad favorita",
    container: {
      title: "Nuevo Favorito",
      description: "Guardar una configuración de habilidad como favorito",
    },
    backButton: {
      label: "Volver a Favoritos",
    },
    submitButton: {
      label: "Crear Favorito",
      loadingText: "Creando...",
    },
    useWithoutSavingButton: {
      label: "Uso sin ahorro",
      loadingText: "Aplicando...",
    },
    skillId: {
      label: "Habilidad",
      description:
        'Habilidad ID en formato fusionado: " skillSlug" para la variante predeterminada, " skillSlug__variantId " para una variante específica (por ejemplo, " thea__brilliant "). Ejecute habilidades para ver los IDs disponibles.',
    },
    customVariantName: {
      label: "Label",
      description:
        "Nombre personalizado para esta variante (dejar vacío para usar el predeterminado de habilidades)",
    },
    customIcon: {
      label: "Icono personalizado",
      description: "icono personalizado opcional para este favorito",
    },
    chatModel: {
      label: "Modelo de Chat",
      placeholder: "Igual que la habilidad",
    },
    voice: {
      label: "Voz",
      description:
        "TTS override para este favorito. null = su configuración de voz global gana (modelo de puente: configuración del usuario toma prioridad). Conjunto para dar a este favorito específico una voz diferente.",
      placeholder: "Igual que la habilidad",
    },
    sttModel: {
      label: "Modelo Speech-to-Text",
      description:
        "STT modelo override. null = su preferencia global STT gana (modelo de puente). Conjunto sólo para necesidades de transcripción especializadas.",
      placeholder: "Igual que la habilidad",
    },
    imageVisionModel: {
      label: "Modelo de visión de imagen",
      description:
        "Vista de imagen LLM override. null = usuario de preferencia global gana (modelo de puente).",
      placeholder: "Igual que la habilidad",
    },
    videoVisionModel: {
      label: "Modelo de Visión de Video",
      description:
        "Visión de vídeo LLM override. null = ganadores de preferencia global del usuario (modelo de puente).",
      placeholder: "Igual que la habilidad",
    },
    audioVisionModel: {
      label: "Modelo Audio Vision",
      description:
        "Visión de audio LLM override. null = ganadores de preferencia global del usuario (modelo de puente).",
      placeholder: "Igual que la habilidad",
    },
    imageGenModel: {
      label: "Modelo de generación de imagen",
      description:
        "Anulación del generador de imagen. null = imageGenModelSelection de habilidad gana (media gen: habilidad toma prioridad). Establecer para utilizar un generador diferente de lo que especifica la habilidad.",
      placeholder: "Igual que la habilidad",
    },
    musicGenModel: {
      label: "Modelo de generación de música",
      description:
        "Anulación del generador de música. null = musicGenModelSelection de habilidad gana (media gen: habilidad toma prioridad).",
      placeholder: "Igual que la habilidad",
    },
    videoGenModel: {
      label: "Modelo de Generación de Video",
      description:
        "Anulación del generador de vídeo. null = videoGenModelSelection de habilidad gana (media gen: habilidad toma prioridad).",
      placeholder: "Igual que la habilidad",
    },
    mode: {
      label: "Modo de selección",
      description: "Cómo debe seleccionarse el modelo",
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
    icon: {
      label: "Icono personalizado",
      description:
        "Anule el icono predeterminado de la habilidad para esta ranura favorita",
    },
    compactTrigger: {
      label: "Trigger compacto (tokens)",
      description:
        "Anula el número de fichas que activa la compactación de conversaciones. Pase null para caer a través de la habilidad o por defecto global.",
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
    changeSkill: {
      label: "Cambiar la habilidad",
    },
    modifySkill: {
      label: "Modificar habilidad",
    },
    character: {
      name: "Nombre",
      tagline: "Tagline",
      description: "Descripción",
    },
  },
};
