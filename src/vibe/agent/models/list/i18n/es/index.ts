import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    models: "Modelos",
  },
  endpointCategories: {
    ai: "IA",
  },
  enums: {
    modelType: {
      text: "Texto",
      image: "Imagen",
      video: "Video",
      audio: "Audio",
    },
    content: {
      mainstream: "Convencional",
      open: "Abierto",
      uncensored: "Sin censura",
    },
    intelligence: {
      quick: "Rápido",
      smart: "Inteligente",
      brilliant: "Brillante",
    },
  },
  get: {
    title: "Modelos",
    titleShort: "Modelos AI",
    description:
      "Explora todos los modelos de IA y fíltralos por tipo (texto, imagen, video o audio), nivel de contenido o inteligencia. Para los modelos de video, supportedDurations enumera las duraciones válidas en segundos, supportedAspectRatios indica las relaciones de aspecto disponibles y supportedFrameImages muestra los fotogramas aceptados (first_frame parte de una imagen, last_frame hace que la animación termine en la imagen final). allowedPassthroughParameters lista otros parámetros aceptados, como negative_prompt y cfg_scale, y generateAudio indica si el video incluye audio. Al llamar a generate_video, usa el ID del modelo como valor de model.",
    dynamicTitle: "Modelos {{count}}",

    fields: {
      query: {
        label: "Buscar",
        description:
          "Filtrar modelos por nombre, proveedor o capacidad (por ejemplo, 'coding', 'sin censura', 'image', 'fast').",
        placeholder: "Por ejemplo. GPT, Gemini, codificación, sin censura...",
      },
      modelType: {
        label: "Tipo",
        description:
          "Filtro por tipo de modelo: texto (chat/ LLM), imagen (generación de imágenes), vídeo o audio (TTS / STT /music). Deja vacío para todo tipo.",
        placeholder: "Todos los tipos",
      },
      contentLevel: {
        label: "Nivel de contenido",
        description:
          "Filtrar por política de contenido. Mainstream = filtros de seguridad estándar. Abrir = menos restricciones. Sin censura = sin filtros.",
        placeholder: "Todos los niveles de contenido",
      },
      intelligence: {
        label: "Inteligencia",
        description:
          "Nivel mínimo de inteligencia. Rápido = rápido y eficiente. Inteligente = calidad equilibrada. Brillante = profundo razonamiento.",
        placeholder: "Cualquier inteligencia",
      },
      page: {
        label: "Página",
        description: "Número de página para paginación (comienza a 1).",
      },
      pageSize: {
        label: "Tamaño de la página",
        description: "Número de modelos por página (por defecto 50, max 200).",
      },
    },

    response: {
      models: "Modelos",
      totalCount: "Total",
      matchedCount: "Coincidido",
      currentPage: "Página",
      totalPages: "Páginas",
      hint: "Hint",
      model: {
        id: "Modelo ID",
        name: "Nombre",
        provider: "Proveedor",
        type: "Tipo",
        description: "Descripción",
        contextWindow: "Contexto",
        parameterCount: "Parámetros",
        intelligence: "Inteligencia",
        content: "Contenido",
        price: "Precio (créditos)",
        supportsTools: "Herramientas",
        utilities: "Capacidades",
        inputs: "Inputs",
        outputs: "Productos",
        supportedDurations: "Duración s)",
        supportedAspectRatios: "Aspect Ratios",
        supportedResolutions: "Resoluciones",
        supportedFrameImages: "Tipos de imagen del marco",
        generateAudio: "Genera Audio",
        supportedSizes: "Tamaños exactos",
        allowedPassthroughParameters: "Parámetros adicionales",
      },
    },

    errors: {
      server: {
        title: "Error del servidor",
        description:
          "Fallado para recuperar la lista de modelos. Por favor, inténtalo de nuevo.",
      },
      network: {
        title: "Error de red",
        description:
          "La conexión de red falló. Por favor, compruebe su conexión.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado.",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de filtro inválidos.",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para ver modelos.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este recurso.",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay modelos encontrados.",
      },
      conflict: {
        title: "Conflicto",
        description: "Solicito conflicto.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar.",
      },
    },

    success: {
      title: "Modelos cargados",
      description: "Lista de modelos AI recuperada con éxito.",
    },

    browser: {
      subtitle:
        "Todos los modelos de la plataforma con su precio, ventana de contexto y nivel de contenido.",
      emptyTitle: "Ningún modelo coincide con estos filtros",
      emptyHint: "Elija otro tipo o nivel de contenido, o borre la búsqueda.",
      clearFilters: "Borrar filtros",
      toolCalls: "Llamadas a herramientas",
      context: "{{size}} de contexto",
      supportsTools: "✓ tools",
      noModels: "No hay modelos que coincidan con sus filtros.",
      allLabel: "Todos",
      statsLabel: "{{matched}} de los modelos {{total}}",
      free: "Gratis",
      credits: "- {{cost}} cr",
      ctx: "ctx",
    },
  },
};
