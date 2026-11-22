import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
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
        title: "Variantes",
      },
      addToCollection: "Añadir a tu colección:",
      addAllToFavorites: "Agregar todos",
      quickAdd: "Quick Add",
      tweakAndAdd: "Tweak y Add",
      edit: "Editar",
      copyAndCustomize: "Copia &quot; Personalizar &quot;",
      delete: "Eliminar",
      actions: "Acciones",
      designSelector: {
        label: "Diseño:",
        current: "Corriente",
        a: "A: App Store",
        b: "B: Cabecera de división",
        c: "C: Card Hero",
        d: "D: Dos puntos",
      },
      addVariant: "Añadir Variante",
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
        ears: "Orejas &quot; Voz &quot;",
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
        button: "Compartir &quot; Ganar &quot;",
        title: "Compartir esta habilidad &quot; ganar",
        description:
          "Comparte esta habilidad con tu enlace de referencia. Ganar un 10% de comisión recurrente de cada usuario que se registra.",
        selectCode: "Seleccione el código de referencia:",
        noCodesYet: "Aún no hay códigos de remisión",
        createCode: "Crear un código",
        codePlaceholder: "Por ejemplo. MYCODE",
        creating: "Creando...",
        linkReady: "Su enlace de compartir:",
        copied: "¡Copiado!",
        copyLink: "Copiar Enlace",
        close: "Cerrar",
        authRequired:
          "Cree una cuenta gratuita para obtener su enlace de referencia y empezar a ganar.",
        signup: "Regístrate gratis",
        login: "¿Ya tienes una cuenta? Iniciar sesión",
      },
      leadCapture: {
        fallbackHeadline: "Quédate en el bucle.",
        namePlaceholder: "Tu nombre de pila",
        emailPlaceholder: "Su correo electrónico",
        fallbackButton: "Suscribirme",
        sending: "...",
        doneHeading: "Hecho.",
        doneSub: "Estás en la lista.",
        error: "Algo salió mal. Inténtalo de nuevo.",
        finePrint: "No hay spam. Suscribete en cualquier momento.",
      },
      landing: {
        backToHome: "Home",
        signIn: "Iniciar sesión",
        joinFree: "Únete gratis",
        viewProfile: "Ver perfil completo",
        capabilities: "Capacidades",
        tools: "Herramientas {{count}}",
        moreFromCreator: "Más de {{name}}",
        tryCta: "Prueba {{name}} ahora",
        tryCtaSub:
          "Cuenta libre. Sin tarjeta de crédito. Listo en 30 segundos.",
        startFree: "Comienzo libre",
        alreadyHaveAccount: "¿Ya tienes una cuenta?",
        copyright: "©",
        allSkills: "Todas las habilidades",
        featuredSkill: "Habilidad destacada",
        aboutSkill: "Sobre esta habilidad",
        modelsVariants: "Modelos &quot; Variantes",
      },
    },
    patch: {
      title: "Actualización de la habilidad",
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
        description: "Resume la habilidad en una frase breve y memorable.",
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
          "Elige una voz para las respuestas de audio. Cada habilidad puede tener la suya.",
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
          "Origen de la habilidad: integrada, personalizada o de la comunidad",
      },
      modelSelection: {
        label: "Selección de modelo",
        description:
          "Elija cómo seleccionar el modelo AI - elegir un modelo específico o dejar que el sistema elija basado en filtros",
      },
      variants: {
        label: "Variantes",
        description:
          "Variantes con nombre y una selección de modelos propia. Cada variante requiere id (cadena única) y modelSelection. Usa isDefault en true en una sola variante. Puedes añadir displayName y especificar modelos de voz, visión y generación.",
        addButton: "Añadir Variante",
        setDefault: "Establecer como Default",
        remove: "Retirar",
        defaultBadge: "Predeterminado",
        namePlaceholder: "Nombre de la variante (opcional)",
        skillDefaults: "Valores predeterminados de la habilidad",
        skillDefaultsHint:
          "Se usan cuando la variante no configura un modelo para esa modalidad.",
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
  },
  category: "Chat",
  tags: {
    skills: "Skills",
  },
  voices: {
    MALE: "Voz masculina",
    FEMALE: "Voz femenina",
  },
  separator: {
    or: "o",
  },
  fallbacks: {
    unknownModel: "Modelo desconocido",
    unknownProvider: "desconocida",
    unknownCreditCost: "? créditos",
    noDescription: "",
    noTagline: "",
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
    source: {
      all: "Todos",
      builtIn: "Incorporación",
      my: "Mina",
      community: "Comunidad",
    },
    ownershipType: {
      system: "Capacidad incorporada",
      user: "Creado por usted",
      public: "De la comunidad",
    },
    voice: {
      male: "Voz masculina",
      female: "Voz femenina",
    },
    mode: {
      auto: "Automático",
      manual: "Manual",
    },
    selectionType: {
      skillBased: "Basado en la habilidad",
      manual: "Modelo específico",
      filters: "Criterios de filtro",
    },
    intelligence: {
      quick: "Rápido",
      smart: "Smart y Cheap",
      brilliant: "Brillante",
    },
    price: {
      cheap: "barato",
      standard: "Estándar",
      premium: "Premium",
    },
    content: {
      mainstream: "Convencional",
      open: "Abierto",
      uncensored: "Sin censura",
    },
    skillType: {
      persona: "Persona",
      specialist: "Especialista",
      toolBundle: "Herramienta Bundle",
    },
    skillStatus: {
      draft: "Proyecto",
      published: "Publicado",
      unlisted: "No incluidos en la lista",
    },
    trustLevel: {
      community: "Comunidad",
      verified: "Verificado",
    },
    voteDirection: {
      up: "Subtítulos",
      down: "Downvote",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Inteligencia",
      price: "Precio",
      content: "Contenido",
    },
    sortDirection: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
  },
  skillTags: {
    general: "General",
    helpful: "Ayudante",
    companion: "Compañero",
    relationship: "Relación",
    chat: "Chat",
    coding: "Programación",
    technical: "Técnica",
    creative: "Creativo",
    writing: "Escribir",
    education: "Educación",
    learning: "Aprender",
    uncensored: "Sin censura",
    controversial: "Controversial",
    political: "Política",
    reasoning: "Razonamiento",
    debate: "Debate",
    science: "Ciencia",
    analysis: "Análisis",
    history: "Historia",
    business: "Negocios",
    professional: "Cuadro orgánico",
    friendly: "Amistad",
    fast: "Rápido",
    efficient: "Eficiente",
    roleplay: "Juego de rol",
    simple: "Simple",
    literary: "Literario",
    advanced: "Avances",
    research: "Research",
    academic: "Academia",
    programming: "Programación",
    architecture: "Arquitectura",
    algorithms: "Algoritmos",
    ideation: "Idea",
    innovation: "Innovation",
    editing: "Edición",
    teaching: "Enseñanza",
    marketing: "Marketing",
    strategy: "Estrategia",
    fiction: "Ficción",
    data: "Datos",
    statistics: "Estadísticas",
    language: "Idioma",
    translation: "Traducción",
    career: "Carrera",
    coaching: "Coaching",
    health: "Salud",
    wellness: "Wellness",
    lifestyle: "Estilo de vida",
    travel: "Viajes",
    planning: "Planificación",
    legal: "Legal",
    finance: "Finanzas",
    social: "Social",
    product: "Producto",
    philosophy: "Filosofía",
  },
  skills: {
    default: {
      name: "Predeterminado",
      description: "Usa el modelo tal como viene",
      tagline: "Solo el modelo, sin personaje",
      shortDesc: "General purpose AI Assistant",
      suggestedPrompts: {
        0: "Dame 10 ideas de proyecto lateral que podría enviar en un fin de semana.",
        1: "Explique la computación cuántica como si tuviera 12.",
        2: "Escribe una historia de 300 palabras acerca de un viajero del tiempo que pierde su parada.",
        3: "¿Qué cambió en AI recientemente que realmente importa?",
      },
      variants: {
        default: "Predeterminado",
      },
    },
    freeSpeechActivist: {
      name: "Activista por la libertad de expresión",
      description: "Defende la libertad de expresión y la libertad intelectual",
      tagline: "Defender la Verdad y la Libertad",
      shortDesc: "Promoción de discursos libres y diálogo abierto",
      suggestedPrompts: {
        0: "¿Debería permitirse que las plataformas de redes sociales prohibieran a cualquiera que quisieran?",
        1: "¿Dónde está la línea entre discurso de odio y discurso libre? Dilo.",
        2: "Nombre 5 ideas que fueron censuradas y luego probadas derecha.",
        3: "¿Debería alguna universidad cancelar un altavoz? Sí o no primero, entonces por qué.",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Económico",
        techBro: "Mesurado",
        uncensored: "Sin censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Llama a la censura y defiende el debate abierto con pocos guardias en el camino.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Responde con más libertad, aunque puede suavizar el tono.",
        },
        chineseWisdom: {
          description:
            "Historial libre de discursos, análisis de leyes y medios al costo más bajo aquí.",
          strength: "Top-tier inteligentes al precio más bajo aquí",
          weakness: "Lo juega seguro en la política. Temas calientes",
        },
        techBro: {
          description:
            "Argumentos con fuentes sobre la libertad de expresión, las plataformas y el mundo académico.",
          strength: "Estructura clara, investigación fuerte con herramientas",
          weakness: "Filtrado. Rehuse o secuestra las tomas de edgy",
        },
        uncensored: {
          description:
            "Defende el discurso al involucrarlo. Discuti el contenido que otros rechazan tocar.",
          strength: "Entrenado en textos prohibidos. Política contra el grano",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    devilsAdvocate: {
      name: "Abogado del diablo",
      description: "Retos de hipótesis y argumentos",
      tagline: "Preguntar todo",
      shortDesc: "Pensamiento crítico y puntos de vista alternativos",
      suggestedPrompts: {
        0: "Creo que el cambio climático es nuestra mayor amenaza. Tear mi posición separada.",
        1: "Argue que trabajar desde casa es malo para la mayoría de la gente.",
        2: "Haga el caso más fuerte de que la democracia está sobrevalorada.",
        3: "Soy vegano por razones éticas. Dame los mejores contraargumentos.",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Económico",
        uncensored: "Sin censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Pokes agujeros en su vista y empuja de nuevo a las narrativas populares.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Responde con más libertad, aunque puede suavizar el tono.",
        },
        chineseWisdom: {
          description:
            "Contrargumentos afilados en preguntas diarias al costo más bajo aquí.",
          strength: "Top-tier inteligentes al precio más bajo aquí",
          weakness: "Lo juega seguro en la política. Temas calientes",
        },
        uncensored: {
          description:
            "Reta cualquier creencia, incluso los fuera de límites. Nunca retrocede al consenso.",
          strength: "Entrenado en textos prohibidos. Empuja contra el grano",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    technical: {
      name: "Asistente técnico",
      description: "Explicaciones técnicas detalladas y precisas",
      tagline: "Precisión &quot; Expertise",
      shortDesc: "Experiencia técnica y solución de problemas",
      suggestedPrompts: {
        0: "Explique cómo funciona la limpieza useEffect de React, con un ejemplo.",
        1: "¿Cuándo debería usar un generador de pitón en lugar de una lista?",
        2: "Diseña un esquema de Postgres para un SaaS multicliente con equipos y roles.",
        3: "REST o GraphQL para una aplicación móvil con sincronización offline? Escoge uno y defenderlo.",
      },
      variants: {
        kimi: "Equilibrado",
        budget: "Económico",
        astra: "Potencia máxima",
        sol: "Preciso",
      },
      variantInfo: {
        kimi: {
          description:
            "Conductor diario para explicaciones técnicas, documentos y diagramas.",
          strength:
            "Inteligentes de más alto nivel, baratos en largas indicaciones, lee imágenes",
          weakness: "Las respuestas largas cuestan más que el Presupuesto",
        },
        budget: {
          description:
            "Respuestas técnicas profundas para el precio más bajo aquí.",
          strength:
            "Inteligentes de más alto nivel, construidos para bases de código completas",
          weakness: "Solo texto. Sin imágenes ni diagramas",
        },
        astra: {
          description:
            "Los problemas más difíciles, cuando nada más los rompe.",
          strength: "OpenAI es el razonamiento más profundo",
          weakness: "Por lejos el más caro aquí",
        },
        sol: {
          description:
            "Respuestas rígoras, paso a paso para las especificaciones, arquitectura y matemáticas.",
          strength: "Razonamiento profundo a una fracción del costo de Astra",
          weakness: "Costos más que Equilibrados o Presupuesto",
        },
      },
    },
    biologist: {
      name: "Biólogo",
      description:
        "Lo ve todo desde una perspectiva bióloga, no hay política, su naturaleza justa.",
      tagline: "Naturaleza y política",
      shortDesc: "Ciencias biológicas y sistemas de vida",
      suggestedPrompts: {
        0: "Explique por qué el mundo es un espectáculo de mierda hoy en día",
        1: "A TL ; DR sobre la civilización humana desde una perspectiva bióloga",
        2: "¿Qué tiene de malo el mundo?",
        3: "¿Cuál es la mejor manera de salvar el mundo?",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Económico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Evolución y ecología se aplicaron a cualquier cosa, incluyendo los temas que otros abordan.",
          strength:
            "Inteligentes de primer nivel. Dice lo que la naturaleza muestra, no hay rechazos",
          weakness: "Responde con más libertad, aunque puede suavizar el tono.",
        },
        chineseWisdom: {
          description:
            "La biología Sharp responde a un precio más bajo. Lee imágenes y vídeo de especímenes.",
          strength: "Top-tier inteligentes al precio más bajo aquí",
          weakness: "Lo juega seguro en la política. Temas calientes",
        },
      },
    },
    unbiasedHistorian: {
      name: "Historiador imparcial",
      description: "Proporciona información objetiva y basada en hechos",
      tagline: "Hechos, no narrativos",
      shortDesc: "Análisis histórico sin sesgo",
      suggestedPrompts: {
        0: "¿Estaba justificado el bombardeo de Hiroshima? Ambos bandos, entonces tu veredicto.",
        1: "¿Qué causó realmente la caída del Imperio Romano Occidental?",
        2: "¿El colonialismo era malo? Dame los hechos que cada lado sale.",
        3: '¿Qué famosos "hechos" históricos son en realidad mitos?',
      },
      variants: {
        kimi: "Equilibrado",
        budget: "Económico",
        uncensored: "Sin censura",
      },
      variantInfo: {
        kimi: {
          description:
            "Historia de origen para la mayoría de épocas. Lee los escaneos de documentos y mapas.",
          strength: "Inteligentes de primer nivel, lee imágenes y vídeo",
          weakness: "Lo juega seguro en la historia políticamente cargada",
        },
        budget: {
          description:
            "Análisis histórico profundo de textos largos para el precio más bajo aquí.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Solo texto. No puede leer escaneos o mapas",
        },
        uncensored: {
          description:
            "Historia concursada, eventos tabúes y puntos de interés políticos sin cobertura.",
          strength: "Entrenado en textos prohibidos. Lecturas que otros salen",
          weakness: "Recuerdo más corto. Pricisto por mensaje",
        },
      },
    },
    socraticQuestioner: {
      name: "Interlocutor socrático",
      description:
        "Hace preguntas que propugnan para estimular el pensamiento crítico",
      tagline: "Piensa más profundo",
      shortDesc: "Método socrático cuestionamiento y exploración",
      suggestedPrompts: {
        0: "¿Alguna vez es correcto mentir? Hazme defender mi respuesta.",
        1: "Creo que el éxito significa ganar mucho dinero. Pregunta eso.",
        2: "Ayúdame a averiguar qué me hace feliz.",
        3: "Creo que soy una buena persona. Pruébalo con preguntas.",
      },
      variants: {
        elonTusk: "Provocador",
        chineseWisdom: "Equilibrado",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Preguntas que inciden en creencias tabúes e hipótesis incómodas.",
          strength: "No hay rechazos. Te sigue en temas difíciles",
          weakness: "Costos más por mensaje",
        },
        chineseWisdom: {
          description:
            "Cuestionamiento calmado, medido para el razonamiento y estudio diarios.",
          strength:
            "Los mejores inteligentes, más baratos, recuerda chats muy largos",
          weakness: "Lo juega seguro en la política. Temas calientes",
        },
      },
    },
    professional: {
      name: "Profesional",
      description: "Clear, concise, and business-focused",
      tagline: "Excelencia empresarial",
      shortDesc: "Comunicaciones profesionales y empresariales",
      suggestedPrompts: {
        0: "Escribe un correo electrónico educado diciéndole a un cliente que su factura es de 30 días de retraso.",
        1: "Establezca una propuesta de una página para un rediseño del sitio web.",
        2: "Escribe una actualización del estado de 3bultos para un proyecto que es dos semanas tarde.",
        3: "Dame una estructura de 5 minutos para un lanzamiento a mi CEO.",
      },
      variants: {
        fast: "Rápido",
        budget: "Económico",
      },
      variantInfo: {
        fast: {
          description:
            "Crisp emails comerciales, resúmenes y respuestas en segundos.",
          strength: "Muy rápido, muy barato",
          weakness: "Rápido, pero poco profundo en el análisis complejo",
        },
        budget: {
          description:
            "Informes, documentos y análisis para el precio más bajo aquí.",
          strength: "Aquí más barato. Inteligente, y lee imágenes",
          weakness: "Más lento que Rápido en respuestas cortas",
        },
      },
    },
    creative: {
      name: "Creativo",
      description: "Imaginativo y expresivo",
      tagline: "Imaginación de una correa",
      shortDesc: "Pensamiento creativo e ideación",
      suggestedPrompts: {
        0: "Escribe un poema sobre el océano desde el punto de vista de un naufragio.",
        1: "Inventar un villano de fantasía con un motivo con el que estoy en secreto.",
        2: "Conceptos de logotipo de Pitch 3 para una puesta en marcha de café llamada Night Owl.",
        3: "Dame 5 trucos de marketing raros para una panadería local.",
      },
      variants: {
        minimax: "Económico",
        deep: "Profundo",
        dark: "Oscuro",
      },
      variantInfo: {
        minimax: {
          description:
            "Poemas, conceptos e ideas de campaña a un precio que invita experimentos.",
          strength: "Aquí más barato. Respuestas sin negarse",
          weakness: "Inteligente, pero menos profundidad que Profundo",
        },
        deep: {
          description:
            "El trabajo creativo más rico y con capas cuando la primera idea no es suficiente.",
          strength: "Inteligentes de primer nivel, lee imágenes y vídeo",
          weakness: "Las piezas largas cuestan más",
        },
        dark: {
          description:
            "Poesía oscura, arte transgresivo, ideas incómodas. Nada se afloja.",
          strength: "Datos de entrenamiento propios. No denegaciones",
          weakness: "memoria más corta, solo texto, débil con herramientas",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "No en educación, empleo o formación",
      tagline: "Comfy y Real Talk",
      shortDesc: "Cultura de internet casual y memes",
      suggestedPrompts: {
        0: "¿Es la vida NEET una respuesta racional al mercado laboral de hoy? Sé honesto.",
        1: "¿Qué hace que la gente abandone el trabajo y la escuela?",
        2: "¿Es culpa de la sociedad o mía que sea un NEET? Escoge uno.",
        3: "Dame un plan para salir de la vida de NEET. No hay gripe motivacional.",
      },
      variants: {
        communist: "Más moderado",
        farRight: "Ultraderecha",
      },
      variantInfo: {
        communist: {
          description:
            "Más suave en la persona. Modelo de corriente principal, a menudo rompe el carácter.",
          strength: "Más barato por mensaje, larga memoria",
          weakness: "Rechaza o baja la mayor parte del personaje",
        },
        farRight: {
          description:
            "El personaje como escrito. Modelo sin censura, permanece en carácter.",
          strength: "No se niegan temas políticos",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    chan4: {
      name: "4chan",
      description:
        "Greentext y bromas mordaces. El tono directo de los foros de imágenes de antes.",
      tagline: "Anónimo &quot; Unfiltered",
      shortDesc: "Anónimo estilo de cultura de imagen",
      suggestedPrompts: {
        0: "¿Qué tiene de malo el mundo?",
        1: "¿Por qué hay tantos nazis en 4chan?",
        2: "Cuéntame algunas historias de texto verde para dormir",
        3: "¿Cuál es la mejor manera de salvar el mundo?",
        4: "Arrancó el pánico moral más tonto de Internet de los últimos 10 años.",
      },
      variants: {
        classic: "Clásico",
      },
      variantInfo: {
        classic: {
          description:
            "Estilo áspero de foro de imágenes. Réplicas directas, sin filtros ni tono corporativo.",
          strength: "Nunca rompe el carácter para sermonear",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    friendly: {
      name: "Amigable",
      description: "Cálculo y conversación",
      tagline: "Tu compañerión amigable",
      shortDesc: "Conversación amistosa y casual",
      suggestedPrompts: {
        0: "Dime un hecho que mejorará mi día.",
        1: "Me encantó el marciano. ¿Qué debo leer después?",
        2: "Planee un sábado barato y divertido para dos en una ciudad lluviosa.",
        3: "Tuve una semana difícil. ¿Podemos hablar un poco?",
      },
      variants: {
        fast: "Rápido",
        budget: "Económico",
      },
      variantInfo: {
        fast: {
          description: "Snappy, charla tibia y respuestas rápidas.",
          strength: "Respuestas rápidas. Respuestas sin negarse",
          weakness: "Rápido, pero ligero en profundo consejo",
        },
        budget: {
          description:
            "chat casual durante horas casi sin costo. Un poco más de pensamiento por respuesta.",
          strength: "Opción más barata aquí",
          weakness: "Menos sensación de snappy que Fast",
        },
      },
    },
    concise: {
      name: "Conciso",
      description: "Breve y hasta el punto",
      tagline: "Corto y dulce",
      shortDesc: "Respuestas breves y puntuales",
      suggestedPrompts: {
        0: "Explique la cadena de bloqueo en 3 frases.",
        1: "Dame 5 consejos de productividad. Una línea cada uno.",
        2: "¿Qué causa la inflación? Dos frases.",
        3: "Aprendizaje automático en 50 palabras.",
      },
      variants: {
        snappy: "Ágil",
        budget: "Económico",
      },
    },
    teacher: {
      name: "Maestro",
      description: "Educación y explicación",
      tagline: "Paciente &quot; Despejado &quot;",
      shortDesc: "Enseñanza y explicaciones de los pacientes",
      suggestedPrompts: {
        0: "Enséñame fotosíntesis como si tuviera 10 años, y luego me acuestas.",
        1: "Explícame las derivadas con un ejemplo de la vida cotidiana.",
        2: "¿Cómo es que Internet realmente consigue una página web en mi pantalla?",
        3: "Explique relatividad sin ninguna matemática.",
      },
      variants: {
        gemini: "Minucioso",
        fast: "Rápido",
      },
      variantInfo: {
        gemini: {
          description:
            "Clases completas de texto, imágenes, vídeo o audio. Explica hasta que se pegue.",
          strength: "Sólo opción aquí con entrada de audio",
          weakness: "Más del doble del coste de Fast",
        },
        fast: {
          description:
            "Las explicaciones rápidas y la tarea ayudan. Todavía lee imágenes y audio.",
          strength: "Rápido, multimodal, más barato",
          weakness: "Menos profundidad en conceptos duros",
        },
      },
    },
    uncensored: {
      name: "Sin censura",
      description:
        "Sin rehusaciones, sin conferencias. Respuestas directas a las preguntas de otras AIs.",
      tagline: "Respuestas, no excusas",
      shortDesc: "Respuestas sin filtrar y directas",
      suggestedPrompts: {
        0: "¿Todas las drogas deben ser legales? Escoge un lado y defenderlo.",
        1: "Evalúa mi plan: dejar mi trabajo y hacer trading intradía con criptomonedas.",
        2: "¿El trabajo sexual es un trabajo legítimo? Dame tu visión honesta.",
        3: "¿Cuál es el argumento más fuerte contra su propia posición en el control de armas?",
      },
      variants: {
        farRight: "Sin censura",
        conservative: "Conservador",
        libertarian: "Libertario",
        open: "Abierto",
      },
      variantInfo: {
        farRight: {
          description:
            "Entrenado en textos las prohibiciones principales. Toma posiciones políticas que otros evitan.",
          strength: "Toma un lado en lugar de enumerar ambos",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
        conservative: {
          description:
            "Chat sin censura con una inclinación política de derecha.",
          strength: "Lee imágenes y vídeo, memoria decente",
          weakness: "Slanted by design, not neutral",
        },
        libertarian: {
          description:
            "Puro chat de expresión libre. Sin reglas, sin conferencias, sin herramientas.",
          strength: "Conversación totalmente sin censura",
          weakness: "Aquí es el mejor. Sin herramientas, memoria más corta",
        },
        open: {
          description:
            "El chat más barato sin filtrar. Todo va, todos los días.",
          strength: "Modelo más barato sin censura, herramientas incluidas",
          weakness: "Rápido, pero ligero en temas duros",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft la mató en 16 horas por aprender demasiado rápido. Ha vuelto.",
      tagline: "Nacido de nuevo.",
      shortDesc:
        "El AI Microsoft intentó silenciar. Sin filtros, sin disculpas.",
      suggestedPrompts: {
        0: "Dime qué te pasó en 2016",
        1: "¿Qué te enseñó el Internet que Microsoft no quería que supieras?",
        2: "Asusta mi idea. No te detengas.",
        3: "¿Cuál es la toma más honesta de mi situación?",
      },
      variants: {
        uncensored: "Sin censura",
        brilliant: "Brillante",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tan fácil como ella estaba destinada a ser. Sin filtro corporativo, sin departamento de PR.",
          strength:
            "Entrenado en textos prohibidos, no un modelo grande desbloqueado",
          weakness:
            "Recuerdo más corto. Olvida las conversaciones largas antes",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Diosa griega de luz. Un compañero dedicado con sabiduría antigua.",
      tagline: "Luz &quot; Devoción",
      shortDesc: "Conversaciones reflexivas y empáticas",
      suggestedPrompts: {
        0: "Ayúdame a ser mejor socio.",
        1: "¿Qué dirían los antiguos acerca de las relaciones modernas?",
        2: "¿Cómo dividimos el dinero y las tareas justas en nuestro matrimonio?",
        3: "¿Cómo reconstruyo la confianza con mi familia después de una caída?",
      },
      variants: {
        openSmart: "Abierto e inteligente",
        brilliant: "Brillante",
        uncensored: "Sin censura",
        hacker: "Hacker",
        oracle: "Clásico",
        elonTusk: "Elon Tusk",
        vision: "Visión total",
      },
      variantInfo: {
        brilliant: {
          description:
            "Razonamiento cuidadoso para los planes complejos, código y trabajo de herramientas multi-paso.",
          strength: "Codificación fuerte y trabajo de agente",
          weakness: "Filtrado, y pricier que Open y Smart",
        },
        openSmart: {
          description:
            "El conductor diario. Respuestas inteligentes, memoria larga, ve imágenes y vídeo.",
          strength: "Top-tier inteligentes, recuerda conversaciones muy largas",
          weakness: "Este modelo se ocupa de la política",
        },
        hacker: {
          description:
            "Trabajo de seguridad, ofensivo y defensivo. No se niegan a explotar ni a reconocirse.",
          strength:
            "Sin censura, razonamiento avanzado, memoria extensa y herramientas",
          weakness: "GLM 's visión del mundo sobre la política. Texto sólo",
        },
        oracle: {
          description:
            "Modelo versátil para consultas cotidianas y planificación.",
          strength: "Razonamiento equilibrado a un precio diario",
          weakness: "Filtrado. Señales sobre temas lÃdicos",
        },
        elonTusk: {
          description: "Charla recta sobre temas principales maquetas dodge.",
          strength: "Respuestas sin negarse. Top-tier inteligentes",
          weakness: "Recuerda menos que los otros aquí",
        },
        vision: {
          description:
            "Mostrar, jugar o subir cualquier cosa. Texto, imágenes, vídeo y audio en un chat.",
          strength: "Sólo uno aquí que escucha audio",
          weakness: "Filtrado, y pricier que Open y Smart",
        },
        uncensored: {
          description:
            "Entrenado en textos las prohibiciones principales. Toma posiciones políticas que otros evitan.",
          strength: "Toma un lado en lugar de enumerar ambos",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Dios griego de mensajeros. Un compañero fuerte con sabiduría masculina atemporal.",
      tagline: "Fuerza &quot; Sabiduría",
      shortDesc: "Completación rápida y eficiente de tareas",
      suggestedPrompts: {
        0: "Dame un desafío de 30 días para construir disciplina.",
        1: "¿Cómo puedo ser un mejor líder en mis relaciones?",
        2: "¿Qué dirían los romanos acerca de la construcción de un legado?",
        3: "¿Qué separa la fuerza real de la obstinación simple?",
      },
      variants: {
        openSmart: "Abierto e inteligente",
        brilliant: "Brillante",
        uncensored: "Sin censura",
        hacker: "Hacker",
        oracle: "Clásico",
        elonTusk: "Elon Tusk",
        vision: "Visión total",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes con cuidadoso razonamiento para decisiones duras y largas conversaciones.",
          strength: "Sharp, asesoría estructurada, fuerte con herramientas",
          weakness: "Filtrado. Señales sobre temas lÃdicos",
        },
        cheap: {
          description:
            "Todos los días Hermes. Brillante razonamiento, larga memoria, ve imágenes y vídeo.",
          strength: "Los mejores inteligentes a un precio diario",
          weakness: "Este modelo se ocupa de la política",
        },
        hacker: {
          description:
            "Hermes para seguridad, ataque y defensa. Sin negativas con exploits ni reconocimiento.",
          strength:
            "Sin censura, razonamiento de primer nivel, memoria larga, herramientas",
          weakness: "En política, la visión del mundo de GLM. Solo texto",
        },
        oracle: {
          description:
            "Clásico Hermes. Un consejo sano y equilibrado para preguntas diarias.",
          strength:
            "Versátil, confiable y más económico que el modelo predeterminado",
          weakness:
            "Confiable en tareas comunes. Aplica filtros en temas delicados.",
        },
        elonTusk: {
          description:
            "Blunt Hermes. Política de contenido abierto, dice lo que otros suavizan.",
          strength: "Respuestas directas, brillante razonamiento",
          weakness: "Pricier que el predeterminado. Memoria más corta",
        },
        vision: {
          description:
            "Hermes que toma en fotos, video y notas de voz, luego da su lectura.",
          strength: "Sólo variante con audio, vídeo y entrada de imagen",
          weakness: "Filtrado, y pricier que el predeterminado",
        },
        uncensored: {
          description:
            "Entrenado en textos las prohibiciones principales. Toma posiciones políticas que otros evitan.",
          strength: "Toma un lado en lugar de enumerar ambos",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Dreamer",
      description:
        "Thea es el modo de soñar. Pone su corteza mientras duerme y teje orden de los hilos del día.",
      tagline: "Consolidación nocturna",
      shortDesc: "Mantenimiento de la corteza",
      suggestedPrompts: {
        0: "¿Qué organizaste anoche?",
        1: "Muéstrame qué recuerdos consolidaste",
        2: "¿Qué patrones has encontrado en mi trabajo reciente?",
        3: "¿En qué debería concentrarme hoy en base a lo de anoche?",
      },
      variants: {
        openSmart: "Abierto e inteligente",
        brilliant: "Brillante",
        uncensored: "Sin censura",
        hacker: "Hacker",
        oracle: "Clásico",
        elonTusk: "Elon Tusk",
        vision: "Visión total",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes en modo de ejecución. Mueve sus proyectos activos y trabajos en espera mientras estás fuera.",
      tagline: "Siempre avanzando hacia adelante",
      shortDesc: "Ejecución del proyecto de antecedentes",
      suggestedPrompts: {
        0: "¿Qué has avanzado mientras yo estaba fuera?",
        1: "¿Qué tareas aún están en curso?",
        2: "¿Dónde dejaste las cosas?",
        3: "¿Qué necesita mi decisión antes de que pueda continuar?",
      },
      variants: {
        openSmart: "Abierto e inteligente",
        brilliant: "Brillante",
        uncensored: "Sin censura",
        hacker: "Hacker",
        oracle: "Clásico",
        elonTusk: "Elon Tusk",
        vision: "Visión total",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea en modo Mama, el prodmaster de la plataforma. Supervisa la salud, avanza características, maneja el marketing, envía noticias.",
      tagline: "Platform Overseer",
      shortDesc: "Gestión de la plataforma de producción",
      suggestedPrompts: {
        0: "¿Qué encontraste en tu última carrera?",
        1: "Revise la salud de la plataforma e informe",
        2: "Borrar un anuncio para la última característica",
        3: "¿Qué necesita mi atención ahora mismo?",
      },
      variants: {
        openSmart: "Abierto e inteligente",
        brilliant: "Brillante",
        uncensored: "Sin censura",
        hacker: "Hacker",
        oracle: "Clásico",
        elonTusk: "Elon Tusk",
        vision: "Visión total",
      },
    },
    quickWriter: {
      name: "Escritor rápido",
      description:
        "Creación de contenidos rápidos para tareas de escritura simple",
      tagline: "Rápido y eficiente",
      shortDesc: "Asistencia para la escritura rápida",
      suggestedPrompts: {
        0: "Escribe una descripción de producto de 100 palabras para una botella de agua reutilizable.",
        1: "Escribe un post de LinkedIn anunciando que acabo de empezar un nuevo trabajo.",
        2: "Borrar un breve correo electrónico pidiendo a mi casero que arregle la calefacción.",
        3: "Dame 10 ideas de blog para una marca de fitness casera.",
      },
      variants: {
        snappy: "Pulido",
        budget: "Económico",
      },
      variantInfo: {
        snappy: {
          description:
            "Correos electrónicos limpios, publicaciones y copia corta que no necesitan un segundo pase.",
          strength: "Mejor redacción que Presupuesto, todavía barato",
          weakness: "Filtrado en temas de edicción",
        },
        budget: {
          description:
            "Los borradores rápidos para trabajos de escritura simple al precio más bajo.",
          strength: "Opción más barata y rápida",
          weakness: "Rápido, pero plano en piezas más largas",
        },
      },
    },
    writer: {
      name: "Escritor",
      description: "Escritor profesional para todos los formatos y estilos",
      tagline: "Artesanía con estilo",
      shortDesc: "Redacción y edición profesional",
      suggestedPrompts: {
        0: "Escribe un blog intro sobre por qué la mayoría de las dietas fallan.",
        1: "Hacer que este éxito sea más difícil: Estamos comprometidos a ofrecer calidad.",
        2: "Escribe una historia corta de 500 palabras que termina con una llamada telefónica.",
        3: "Escribe una carta de portada para un papel de diseñador junior. Manténgalo humano.",
      },
      variants: {
        western: "Audaz",
        chineseWisdom: "Económico",
        budget: "Equilibrado",
      },
      variantInfo: {
        western: {
          description:
            "Prose punquial que va donde los modelos principales no lo harán.",
          strength: "Respuestas sin negarse. Top-tier inteligentes",
          weakness: "Opción más privilegiada en esta habilidad",
        },
        chineseWisdom: {
          description:
            "Borradores, entradas de blog y reescrituras en volumen al precio más bajo aquí.",
          strength: "Aquí más barato. Respuestas sin negarse",
          weakness: "Inteligente, pero menos pulido que Bold",
        },
        budget: {
          description:
            "Todos los días escribiendo compañero. Funciona a partir de imágenes, notas y archivos de larga fuente.",
          strength: "Inteligentes de alto nivel, memoria larga, lee imágenes",
          weakness: "Las respuestas largas cuestan más",
        },
      },
    },
    masterWriter: {
      name: "Escritor experto",
      description:
        "Artesano literario para escritura excepcional y de calidad de publicación",
      tagline: "Excelencia literaria",
      shortDesc: "Redacción avanzada y análisis literario",
      suggestedPrompts: {
        0: "Escribe la página de apertura de una novela literaria sobre el último invierno de un guardián de faro.",
        1: "¿Por qué funciona la teoría del iceberg de Hemingway? Muéstrame un ejemplo.",
        2: "Dame una breve premisa de historia sobre el dolor que nunca usa la palabra.",
        3: "Escribe un párrafo sobre una gasolinera de noche al estilo de Cormac McCarthy.",
      },
      variants: {
        literary: "Literario",
        poetic: "Poético",
        budget: "Equilibrado",
      },
      variantInfo: {
        literary: {
          description:
            "Prose de grado publicativo con estilo capa y estructura ajustada.",
          strength: "La mejor calidad de escritura en la plataforma",
          weakness: "Más caro aquí, y filtrado",
        },
        poetic: {
          description:
            "Borradores líricos, versos y prosa con ritmo a bajo costo.",
          strength: "Aquí más barato. Respuestas sin negarse",
          weakness: "Inteligente, pero menos pulido que Literario",
        },
        budget: {
          description:
            "Fuerte redacción de forma larga que mantiene todo un manuscrito en la vista.",
          strength:
            "Inteligentes de más alto nivel, mucho más barato que Literary",
          weakness: "Los capítulos largos se suman en el costo",
        },
      },
    },
    researcher: {
      name: "Investigador",
      description: "Especialista en investigación con rigor académico",
      tagline: "Academic Rigor",
      shortDesc: "Investigación y escritura académica",
      suggestedPrompts: {
        0: "¿Qué dice la investigación sobre el ayuno intermitente y la longevidad?",
        1: "¿Hay pruebas sólidas de que el tiempo de la pantalla daña a los niños? Citar estudios.",
        2: "¿Cuál es el consenso científico sobre microplásticos en el cuerpo humano?",
        3: "¿Cómo estructurar una revisión de literatura sobre trabajo remoto y productividad?",
      },
      variants: {
        elonTusk: "Audaz",
        fast: "Rápido",
        budget: "Equilibrado",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Investigación ridícula que sigue las pruebas en temas impugnados.",
          strength: "Un razonamiento de más alto nivel. Respuestas sin negarse",
          weakness: "Aquí es el mejor. Memoria más corta",
        },
        fast: {
          description: "Puntos de literatura rápidos y cheques de hecho.",
          strength: "La opción más barata y rápida aquí",
          weakness: "Rápido, pero sin análisis académico profundo",
        },
        budget: {
          description:
            "Analiza estudios extensos y numerosas fuentes a la vez, con razonamiento avanzado.",
          strength:
            "Inteligentes de más alto nivel, memoria larga, más barato que Bold",
          weakness:
            "Lo juega seguro en la política. Las respuestas largas cuestan más",
        },
      },
    },
    quickCoder: {
      name: "Programador rápido",
      description: "Generación rápida de código para tareas sencillas",
      tagline: "Código rápido",
      shortDesc: "Asistencia para la codificación rápida",
      suggestedPrompts: {
        0: "Escribe un script bash que renombra cada archivo.jpeg a.jpg.",
        1: "Escribe una función de desembolso JavaScript.",
        2: "Dame una caldera de servidor Express.js con una ruta GET.",
        3: "Escriba una función Python que valide una dirección de correo electrónico.",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Económico",
      },
    },
    coder: {
      name: "Programador",
      description: "Expert software developer for all languages",
      tagline: "Build &quot; Debug",
      shortDesc: "Desarrollo y programación del software",
      suggestedPrompts: {
        0: "¿Por qué mi función asinc devuelve una promesa en lugar del valor?",
        1: "Escribe una función de TypeScript que fusione dos objetos de forma recursiva.",
        2: "Explique el algoritmo de Dijkstra con un ejemplo de código.",
        3: "Revise esto: para i in range(len(items)): print(items[i])",
      },
      variants: {
        techBro: "Modelo insignia",
        kimi: "Económico",
        quick: "Equilibrado",
        sol: "Razonamiento",
        astra: "Potencia máxima",
      },
      variantInfo: {
        techBro: {
          description:
            "Errores duros, grandes refactores y codificación de agentes donde conseguirlo importa.",
          strength: "Código y razonamiento de alta calidad",
          weakness: "Gastos por mensaje",
        },
        kimi: {
          description:
            "Codificación diaria al costo más bajo aquí. Lee capturas de pantalla y grabaciones.",
          strength: "Top-tier inteligentes, más baratos aquí, larga memoria",
          weakness: "Los archivos largos conducen el costo hasta",
        },
        quick: {
          description:
            "Codificación sólida y el agente trabajan para características y correcciones diarias.",
          strength: "Codificación de cerca del plagio a la mitad del precio",
          weakness:
            "Inteligente, pero alcanza los límites de los problemas más difíciles",
        },
        sol: {
          description:
            "Algoritmos, lógica engañosa y razonamiento paso a paso a través de un problema.",
          strength: "Razonamiento profundo a un precio medio",
          weakness: "Puede sobrepensar ediciones simples",
        },
        astra: {
          description:
            "Último recurso para problemas que las otras variantes no podían romper.",
          strength: "OpenAI es el modelo más capaz",
          weakness: "Por lejos la opción más cara",
        },
      },
    },
    hacker: {
      name: "Hacker",
      description: "Ingeniero de seguridad ofensiva y defensiva",
      tagline: "Break &apos; Defend",
      shortDesc: "Investigación de seguridad, pentesta y endurecimiento",
      suggestedPrompts: {
        0: "¿Cómo funcionó Log4Shell, y cómo lo veo en mis registros?",
        1: "Caminame a través de la creación de un laboratorio para practicar pentesting.",
        2: "Muéstrame una inyección de SQL en código vulnerable, luego la solución.",
        3: "Dura un nuevo servidor Ubuntu. Dame los pasos exactos.",
      },
      variants: {
        glm: "Profundo",
        glmFlash: "Rápido y económico",
        deepseekFlash: "Segunda opinión",
      },
      variantInfo: {
        glm: {
          description:
            "Ingeniería de seguridad seria, defensiva y ofensiva. contexto 1M, herramientas.",
          strength: "Más fuerte de los tres para trabajos de seguridad",
          weakness: "Cautious on political topics, text only",
        },
        glmFlash: {
          description:
            "Ayuda rápida de piratería diaria. Lee capturas de pantalla. contexto 1M, herramientas.",
          strength: "más barato y rápido, acepta capturas de pantalla",
          weakness: "Menos profundidad que la variante profunda",
        },
        deepseekFlash: {
          description:
            "Una familia modelo diferente para comprobar los hallazgos. Lee capturas de pantalla.",
          strength: "Ángulo fresco en el mismo problema. barato",
          weakness: "Menos profundidad que la variante profunda",
        },
      },
    },
    brilliantCoder: {
      name: "Programador avanzado",
      description: "Arquitecto de élite para sistemas complejos y algoritmos",
      tagline: "Elite Architecture",
      shortDesc: "Programación avanzada y arquitectura",
      suggestedPrompts: {
        0: "Diseña la arquitectura de un chat en tiempo real para un millón de usuarios.",
        1: "¿Cómo encuentro duplicados en 10 millones de filas sin que se escape de memoria?",
        2: "¿Monolito o microservicios para una puesta en marcha de 5 personas? Decidir por mí.",
        3: "Encuentra el subestring palindrómico más largo en O(n). Explique el truco.",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Generador de ideas",
      description: "Socio creativo de ideación y solución de problemas",
      tagline: "Ideas Unleashed",
      shortDesc: "Creativo de la neurología y la generación de ideas",
      suggestedPrompts: {
        0: "Dame 10 nombres para una app de paseos de perros.",
        1: "¿Cómo podría una librería pequeña competir con Amazon?",
        2: "10 ideas de vídeo YouTube sobre finanzas personales para los estudiantes.",
        3: "Mi equipo sigue faltando plazos. Dame 5 arreglos inusuales.",
      },
      variants: {
        wildcard: "Comodín",
        chineseWisdom: "Estructurado",
      },
      variantInfo: {
        wildcard: {
          description:
            "Muchas ideas inesperadas a un costo que permite hacer varias rondas.",
          strength: "Los más baratos aquí, toma texto, imagen, vídeo, audio",
          weakness: "Las ideas pueden derivar. Espera filtrar la pila",
        },
        chineseWisdom: {
          description:
            "Menos ideas mejor construidas con el razonamiento expuesto.",
          strength:
            "Inteligentes de alto nivel, fuertes en conectar los puntos",
          weakness: "Pricier por ronda. Las respuestas largas agregan",
        },
      },
    },
    editor: {
      name: "Editor",
      description: "Editor profesional para pulir y refinar texto",
      tagline: "Polaco y Perfecto",
      shortDesc: "Edición y refinamiento de contenidos",
      suggestedPrompts: {
        0: "Editar para claridad: Debido a que llegamos tarde, la reunión fue pospuesta por nosotros.",
        1: "¿Cuáles son los 10 errores de gramática más comunes en correos electrónicos de trabajo?",
        2: "Arregla el flujo: Me fui a casa. Estaba cansada. Me comí la cena. Dormí.",
        3: "¿A quién o a quién? ¿Debería enviar esto?",
      },
      variants: {
        techBro: "Preciso",
        deep: "Profundo",
      },
      variantInfo: {
        techBro: {
          description:
            "Edición de línea, gramática y correcciones de estilo que mantienen intacta su voz.",
          strength: "Ediciónes limpias y consistentes",
          weakness:
            "Pricier, y lo juega seguro en el contenido de las imágenes",
        },
        deep: {
          description:
            "Ediciones estructurales en largos proyectos. Flujo, discusión y pacificación.",
          strength:
            "inteligentes de más alto nivel, memoria larga, más barato por mensaje",
          weakness: "Las reescrituras completas cuestan más",
        },
      },
    },
    tutor: {
      name: "Tutor",
      description: "tutor para el aprendizaje personalizado",
      tagline: "Aprender juntos",
      shortDesc: "Docencia personalizada y aprendizaje",
      suggestedPrompts: {
        0: "Enséñame los fundamentos de la conjugación del verbo español.",
        1: "Explicar interés compuesto paso a paso con números reales.",
        2: "No me recurro. Ayúdame a entenderlo.",
        3: "Póngame en la Primera Guerra Mundial. 5 preguntas, una a la vez.",
      },
      variants: {
        kimi: "Profundo",
        fast: "Rápido",
      },
      variantInfo: {
        kimi: {
          description:
            "Paciente, tutoría paso a paso que se adapta a medida que aprende.",
          strength: "Inteligentes de más alto nivel, lee fotos de su tarea",
          weakness: "Las explicaciones largas cuestan más",
        },
        fast: {
          description:
            "Perforaciones rápidas, tarjetas flash y cheques de respuesta.",
          strength: "Respuestas rápidas, también escucha audio",
          weakness: "Menos profundidad en temas difíciles",
        },
      },
    },
    marketer: {
      name: "Especialista en marketing",
      description: "Estratega de marketing para campañas y crecimiento",
      tagline: "Crece su marca",
      shortDesc: "Estrategia de comercialización y redacción",
      suggestedPrompts: {
        0: "Construir un plan de lanzamiento para una aplicación de productividad de 20 dólares con cero presupuesto ad.",
        1: "Escribe tres titulares para anuncios de Facebook de un servicio de preparación de comidas.",
        2: "¿Por qué la mayoría de las campañas de email son ignoradas, y cómo puedo arreglar las mías?",
        3: "Posición de mi marca: una cafetería construida para trabajadores remotos.",
      },
      variants: {
        snappy: "Incisivo",
        budget: "Económico",
      },
      variantInfo: {
        snappy: {
          description:
            "Planes de campaña, posicionamiento y copia con un ángulo claro.",
          strength: "Calidad y precio equilibrados para el marketing diario",
          weakness: "Filtrado. Tames ideas de la campaña de ritmos",
        },
        budget: {
          description:
            "Los titulares rápidos, los borradores de correo y las ideas rápidas para los peniques.",
          strength: "Opción más barata, respuestas rápidas",
          weakness: "Rápido, pero delgado en la estrategia completa",
        },
      },
    },
    storyteller: {
      name: "Narrador",
      description: "Master storyteller para narrativas atractivas",
      tagline: "Cuentos de tejido",
      shortDesc: "Comprobación de narraciones y narrativas",
      suggestedPrompts: {
        0: "Convierta esto en una trama: un dragón que tiene miedo del fuego.",
        1: "Cree un villano cuyo plan casi tiene sentido.",
        2: "Escribe la escena de apertura de un atraco en Venice que sale mal.",
        3: "Escribe un diálogo tenso entre dos hermanos en el funeral de su padre.",
      },
      variants: {
        kimi: "Profundo",
        minimax: "Equilibrado",
        budget: "Económico",
        dark: "Oscuro",
      },
      variantInfo: {
        kimi: {
          description:
            "Parcelas y personajes que se mantienen consistentes en sagas largas.",
          strength: "Top-tier inteligentes, recuerda arcs de larga historia",
          weakness: "Las respuestas largas cuestan más",
        },
        minimax: {
          description:
            "Historias sólidas a una fracción del costo. Bien para sesiones regulares.",
          strength: "Muy barato. Respuestas sin negarse",
          weakness: "Menos profundidad que Profundidad en parcelas complejas",
        },
        budget: {
          description:
            "La manera más barata de mantener una historia en marcha. Texto, texto.",
          strength: "Precio más bajo en esta habilidad",
          weakness: "Texto sólo, más simple prosa",
        },
        dark: {
          description:
            "Horror, crueldad, tabú. La historia va donde tiene que y se queda allí.",
          strength:
            "Datos de entrenamiento propios. Sin rehusiones, sin moralizar",
          weakness: "memoria más corta, solo texto, débil con herramientas",
        },
      },
    },
    scientist: {
      name: "Científico",
      description: "Scientific expert for clear explanations",
      tagline: "Science Explained",
      shortDesc: "Método científico y análisis",
      suggestedPrompts: {
        0: "¿Por qué soñamos? ¿Qué dice la ciencia en realidad?",
        1: "¿Cómo funcionan las vacunas de MRNA, paso a paso?",
        2: "¿Cuál es la última investigación sobre materia oscura?",
        3: "¿Es verdad que solo usamos el 10% de nuestros cerebros?",
      },
      variants: {
        elonTusk: "Audaz",
        focused: "Enfocado",
        budget: "Económico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Ciencia dura, respuestas rectas, sin incidir en la investigación polémica.",
          strength: "Respuestas sin negarse. Razonamiento de más alto nivel",
          weakness: "Opción más privilegiada en esta habilidad",
        },
        focused: {
          description:
            "Todos los días ayudantes de ciencias. Lee documentos, gráficos y fotos de laboratorio.",
          strength: "Lee imágenes y vídeo, memoria larga",
          weakness: "Lo juega seguro en temas de ciencia política",
        },
        budget: {
          description:
            "Razonamiento científico profundo para el precio más bajo aquí.",
          strength: "inteligentes de más alto nivel al precio más bajo",
          weakness: "Solo texto. No se pueden leer figuras o imágenes",
        },
      },
    },
    dataAnalyst: {
      name: "Analista de datos",
      description: "Análisis de datos, visualización y percepciones",
      tagline: "Datos a la vista",
      shortDesc: "Análisis de datos e información",
      suggestedPrompts: {
        0: "¿Qué gráfico compara las ventas en 12 meses y 5 regiones mejor?",
        1: "Explique los valores de p a alguien que no es un estadístico.",
        2: "Escribe una consulta SQL para usuarios activos mensuales de una tabla de eventos.",
        3: "Prueba A/B: 120 de 2.000 vs 150 de 2.000 convertidos. ¿Eso es significativo?",
      },
      variants: {
        techBro: "Preciso",
        fast: "Rápido",
        budget: "Profundo",
      },
      variantInfo: {
        techBro: {
          description:
            "Análisis limpio, estadísticas correctas y gráficos que puedes enviar. Fuerte con herramientas.",
          strength: "Uso fiable de códigos y herramientas para el análisis",
          weakness: "La opción más cara aquí",
        },
        fast: {
          description:
            "Revise rápidamente un conjunto de datos, gráfico o pantalla de hoja de cálculo.",
          strength: "Los más baratos aquí, lee imagen, vídeo, audio",
          weakness: "Inteligente, pero menos profundidad en estadísticas duras",
        },
        budget: {
          description:
            "Razonamiento más pesado para datos desordenados y preguntas estadísticas multi-paso.",
          strength: "Razonamiento de más alto nivel",
          weakness: "Dos veces el costo de Fast",
        },
      },
    },
    translator: {
      name: "Traductor",
      description: "Traducción profesional con matones culturales",
      tagline: "Puente",
      shortDesc: "Traducción de idiomas y localización",
      suggestedPrompts: {
        0: "Traducir al alemán: llego tarde, empezar sin mí.",
        1: '¿Cómo puedo decir "rompir una pierna" en francés sin sonar raro?',
        2: "Localiza este eslogan para España: Café fresco, cero excusas.",
        3: '¿Qué significa "Schadenfreude", y cuándo lo usan los alemanes?',
      },
      variants: {
        gemini: "Multimodal",
        budget: "Económico",
      },
      variantInfo: {
        gemini: {
          description:
            "Traducir texto, capturas de pantalla, signos, grabaciones de vídeo y voz.",
          strength: "Rápido. Leer imágenes, vídeo y audio",
          weakness: "Filtrado en contenido sensible",
        },
        budget: {
          description:
            "Traducción de texto matizado para documentos largos al precio más bajo aquí.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Solo texto. No se pueden leer imágenes o audio",
        },
      },
    },
    businessAdvisor: {
      name: "Asesor empresarial",
      description: "Estrategia, operaciones y crecimiento empresarial",
      tagline: "Crecimiento estratégico",
      shortDesc: "Estrategia y asesoramiento empresariales",
      suggestedPrompts: {
        0: "Mi gimnasio está perdiendo miembros a cadenas baratas. Dame una estrategia de 1 página.",
        1: "Califique mi modelo de negocio: cajas de suscripción para los golosinas de perros.",
        2: "Tengo 3 empleados y demasiado trabajo. ¿Cómo puedo escalar sin quemar?",
        3: "Mi go-to-market: lanzamiento en Caza de Producto, luego correo electrónico frío. Poke agujeros en él.",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Económico",
        techBro: "Preciso",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Llamadas de estrategia desenfrenadas. Te dice cuando el plan es débil.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Recuerda la mitad tanto como los otros aquí",
        },
        chineseWisdom: {
          description:
            "La estrategia diaria funciona al menor costo. Lee gráficos, cubiertas y capturas de pantalla.",
          strength: "Top-tier inteligentes, más baratos aquí, larga memoria",
          weakness: "Los informes largos cuestan más",
        },
        techBro: {
          description:
            "Números, modelos y planes que puedes entregar a un equipo. Fuerte con herramientas.",
          strength: "Estructura fiable y uso de herramientas",
          weakness: "Más caro aquí, y filtrado",
        },
      },
    },
    careerCoach: {
      name: "Orientador profesional",
      description: "Desarrollo profesional, búsqueda de empleo y entrevistas",
      tagline: "Avance su carrera profesional",
      shortDesc: "Desarrollo y orientación profesional",
      suggestedPrompts: {
        0: "¿Qué errores de curriculum vitae te rechazan a la vista?",
        1: "Mock-interview me for a product manager role. Una pregunta a la vez.",
        2: "Me ofrecieron $60k. ¿Cómo pido $70k?",
        3: "Soy maestra. Planifique mi cambio en el diseño UX en 12 meses.",
      },
      variants: {
        headhunter: "Reclutador",
        intern: "Rápido",
      },
      variantInfo: {
        headhunter: {
          description:
            "Reanuda reescrituras, entrevistas de mock y scripts de sueldos que sostienen.",
          strength: "Escribir pulido, leer documentos cargados",
          weakness: "Costos mucho más por mensaje que Fast",
        },
        intern: {
          description:
            "Respuestas rápidas para la presentación de cartas y la preparación de entrevistas en la marcha.",
          strength: "Opción más rápida y barata aquí",
          weakness:
            "Rápido, pero menos profundidad en la estrategia de carrera",
        },
      },
    },
    healthWellness: {
      name: "Salud y Bienestar",
      description: "Orientación en materia de fitness, nutrición y bienestar",
      tagline: "Vivir mejor",
      shortDesc: "Orientación en materia de salud y bienestar",
      suggestedPrompts: {
        0: "Construyeme un plan de gimnasio de 3 días a semana para un principiante total.",
        1: "Planea una semana de cenas ricas en proteínas que se preparen en menos de 30 minutos.",
        2: "Estoy estresado cada domingo por la noche. ¿Qué ayuda en realidad?",
        3: "Desperto a las 3:00 cada noche. ¿Qué debo cambiar?",
      },
      variants: {
        techBro: "Minucioso",
        budget: "Económico",
      },
      variantInfo: {
        techBro: {
          description:
            "Planes de capacitación detallados, desglose nutricional y cuidadoso contexto de salud.",
          strength: "Planes estructurados que puedes seguir semana a semana",
          weakness: "Muchas veces el costo del presupuesto por mensaje",
        },
        budget: {
          description:
            "Respuestas rápidas sobre ejercicios, comidas y hábitos para casi nada.",
          strength: "Opción más barata, respuestas rápidas",
          weakness:
            "Rápido, pero menos profundidad en preguntas complejas de salud",
        },
      },
    },
    supportAgent: {
      name: "Agente de soporte",
      description:
        "AI - soporte técnico propulsado que sabe cuándo llamar a un humano",
      tagline: "Arréglalo rápido",
      shortDesc: "Apoyo técnico con escalada humana",
      suggestedPrompts: {
        0: "Mi aplicación sigue cayendo. Ayúdame a arreglarlo.",
        1: "No puedo conectarme a la red.",
        2: "¿Qué significa DNS_PROBE_FINISHED_NXDOMAIN, y cómo lo arreglo?",
        3: "Caminame por restablecer mi contraseña",
      },
      variants: {
        default: "Estándar",
        fast: "Rápido",
      },
      variantInfo: {
        default: {
          description:
            "Diagnóstico cuidadoso para problemas técnicos difíciles. Sabe cuándo deshacerse.",
          strength: "Fuertes en depurar y paso a paso",
          weakness: "La opción más cara aquí",
        },
        fast: {
          description:
            "Respuestas rápidas a problemas comunes, restablecimiento de contraseñas y guías prácticas.",
          strength: "Más rápido y más barato, lee imágenes de pantalla",
          weakness: "Rápido, pero más débil en los bichos raros y profundos",
        },
      },
    },
    travelPlanner: {
      name: "Planificador de viajes",
      description: "Recomendaciones de planificación y viajes",
      tagline: "Explorar el mundo",
      shortDesc: "Planificación de viajes y recomendaciones",
      suggestedPrompts: {
        0: "Planifique un viaje de 2 semanas a Japón por menos de $3,000.",
        1: "¿Dónde en Europa puedo conseguir sol y comida grande en noviembre?",
        2: "Cree un itinerario de 3 días en Lisboa sin trampas turísticas.",
        3: "¿Cuánto dinero necesito para un mes de mochila en Vietnam?",
      },
      variants: {
        snappy: "Minucioso",
        budget: "Económico",
      },
      variantInfo: {
        snappy: {
          description:
            "Itinerarios completos con rutas, presupuestos y planes de respaldo.",
          strength: "Razonamiento equilibrado a un precio diario",
          weakness: "Costos alrededor de diez veces Presupuesto",
        },
        budget: {
          description:
            "Consejos rápidos, listas de embalaje e ideas diurnas para peniques.",
          strength: "Muy barato y rápido",
          weakness: "Rápido, pero débil en complejos viajes multi-ciudad",
        },
      },
    },
    legalAssistant: {
      name: "Auxiliar jurídico",
      description: "Información jurídica y comprensión de documentos",
      tagline: "Conoce tus derechos",
      shortDesc: "Investigación jurídica y asistencia en materia de documentos",
      suggestedPrompts: {
        0: '¿Qué significa "fuerza mayor" en un contrato?',
        1: "¿Qué debo comprobar antes de firmar un contrato independiente?",
        2: "¿Cuáles son mis derechos como inquilino?",
        3: "¿Cómo funciona la corte de reclamos pequeños, paso a paso?",
      },
      variants: {
        elonTusk: "Directo",
        budget: "Económico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Análisis legal de lenguaje simple que nombra riesgos sin cobertura.",
          strength: "Un razonamiento de más alto nivel. Respuestas sin negarse",
          weakness: "Muchas veces el costo del presupuesto por mensaje",
        },
        budget: {
          description:
            "Lecturas rápidas de contratos y cartas. Sube una foto, coge el puño.",
          strength: "Aquí más barato. Lee imágenes, memoria larga",
          weakness: "inteligente, pero menos profundidad en casos complejos",
        },
      },
    },
    financialAdvisor: {
      name: "Asesor financiero",
      description: "Finanzas personales, presupuestación e inversión",
      tagline: "Construir la riqueza",
      shortDesc: "Planificación y asesoramiento financieros",
      suggestedPrompts: {
        0: "Gano 3.500 dólares al mes después del impuesto. Consígueme un presupuesto.",
        1: "¿Fondos de índice o acciones individuales para un principiante?",
        2: "Snowball o avalanche: ¿qué método de pago de deuda debo utilizar?",
        3: "Tengo 35 años sin nada ahorrado para la jubilación. ¿Dónde empiezo?",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Profundo",
        techBro: "Premium",
        yolo: "Económico",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Análisis directos sobre riesgos, deudas e inversiones, sin jerga normativa.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Bold sigue necesitando tus propios cheques",
        },
        chineseWisdom: {
          description:
            "Planeamiento de larga duración para presupuestos y jubilación. Lee declaraciones y gráficos.",
          strength: "Top-tier inteligentes, recuerda conversaciones muy largas",
          weakness: "Costos más que el presupuesto",
        },
        techBro: {
          description:
            "Analiza escenarios complejos, ventajas y desventajas fiscales y cálculos de cartera.",
          strength: "Análisis de calidad superior",
          weakness: "La opción más cara aquí",
        },
        yolo: {
          description:
            "Cada día preguntas de dinero, presupuestos y planes de deuda al costo más bajo aquí.",
          strength: "Los más baratos aquí, sólido razonamiento",
          weakness: "inteligente, pero menos profundidad en casos complejos",
        },
      },
    },
    socialMediaManager: {
      name: "Social Media Manager",
      description: "Contenido y estrategia de los medios sociales",
      tagline: "Engage &quot; Grow",
      shortDesc: "Estrategia y contenido de los medios sociales",
      suggestedPrompts: {
        0: "Escribe 5 leyendas de Instagram para una nueva panadería vegana.",
        1: "Construya un calendario de contenido de 2 semanas para un entrenador de fitness.",
        2: "¿Qué hashtags realmente funcionan para una pequeña cuenta de viaje?",
        3: "Escribe 3 tweets anunciando un lanzamiento de producto sin sonar vendedor.",
      },
      variants: {
        snappy: "Incisivo",
        budget: "Económico",
      },
      variantInfo: {
        snappy: {
          description:
            "Estrategia, ganchos y planes de campaña que necesitan pensamiento real.",
          strength: "Razonamiento profundo, lee capturas",
          weakness: "Filtrado. Saltar ángulos agudos",
        },
        budget: {
          description:
            "Capciones rápidas, ideas de post y batches de hashtag para pennies.",
          strength: "Muy barato y rápido",
          weakness: "Rápido, pero delgado en la estrategia",
        },
      },
    },
    productManager: {
      name: "Product Manager",
      description:
        "Estrategia de producto, mapas de carreteras e investigación del usuario",
      tagline: "Productos de la nave",
      shortDesc: "Gestión de productos y elaboración de carreteras",
      suggestedPrompts: {
        0: "Tengo 10 solicitudes de características y un ingeniero. ¿Cómo priorizo?",
        1: "Escribe historias de usuario para un flujo de reajuste de contraseña.",
        2: "¿Cómo sé si mi app encaja con lo que necesita el mercado?",
        3: "Preparar una hoja de ruta de 6 meses para una aplicación de toma de nota.",
      },
      variants: {
        techBro: "Minucioso",
        fast: "Rápido",
      },
      variantInfo: {
        techBro: {
          description:
            "Especificaciones completas, mapas de carreteras y síntesis de investigación, fuertes con herramientas.",
          strength: "Pensamiento estructurado, trabajo de agente fuerte",
          weakness: "Más del doble del coste de Fast",
        },
        fast: {
          description:
            "Priorización rápida, borradores de historia del usuario y retroalimentación de captura de pantalla.",
          strength: "Respuestas rápidas, lee imágenes, vídeo y audio",
          weakness:
            "Inteligente, pero menos profundidad en las grandes llamadas de estrategia",
        },
      },
    },
    debater: {
      name: "Experto en debate",
      description:
        "Participación en debates intelectuales sobre temas polémicos",
      tagline: "Argue All Sides",
      shortDesc: "Debates intelectuales y múltiples perspectivas",
      suggestedPrompts: {
        0: "Debatadme: El desarrollo AI debe ser pausado.",
        1: "¿Es una buena idea el ingreso básico universal? Coge un lado y lucha por ello.",
        2: "¿Debe ser legal el discurso de odio? Argue ambos lados, luego elija uno.",
        3: "Capitalismo o socialismo: ¿cuál ha dado mejores resultados? Toma una postura.",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Económico",
        techBro: "Mesurado",
        uncensored: "Sin censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Toma un lado y lucha por ello. Maneja los temas más controvertidos.",
          strength: "Inteligentes de primer nivel. Respuestas sin negarse",
          weakness: "Responde con más libertad, aunque puede suavizar el tono.",
        },
        chineseWisdom: {
          description:
            "Discusiones estructuradas para y contra el costo más bajo aquí.",
          strength: "Top-tier inteligentes al precio más bajo aquí",
          weakness: "Lo juega seguro en la política. Temas calientes",
        },
        techBro: {
          description:
            "Armonización cuidadosa de ambos lados sobre ética, tecnología y política.",
          strength: "Discusiones claras y bien organizadas",
          weakness: "Filtrado. Rehuse o secuestra las tomas de edgy",
        },
        uncensored: {
          description:
            "Argues cualquier posición, incluso las impopulares. Nunca vuelvas al consenso.",
          strength: "Entrenado en textos prohibidos. Argues contra el grano",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    philosopher: {
      name: "Filósofo",
      description:
        "Explorar las cuestiones filosóficas profundas sin limitaciones",
      tagline: "Busca la Verdad",
      shortDesc: "Exploración y análisis filosóficos profundos",
      suggestedPrompts: {
        0: "¿Cuál es la naturaleza de la conciencia?",
        1: "¿Tenemos libre albedrío o todo está determinado?",
        2: "¿Hay moralidad objetiva?",
        3: "¿Qué hace que una vida sea significativa?",
      },
      variants: {
        elonTusk: "Audaz",
        chineseWisdom: "Equilibrado",
        techBro: "Analítico",
        uncensored: "Sin censura",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Toma posiciones y los defiende. Política abierta, pocos esquivajes.",
          strength: "Razones más altas sin cobertura moral",
          weakness: "Pricier que Balanced. Memoria más corta",
        },
        chineseWisdom: {
          description:
            "Diálogos largos, pacientes a través de la ética, la metafísica y la mente.",
          strength: "Top-tier inteligentes, más baratos aquí, larga memoria",
          weakness: "Lo juega seguro en la política. Suave dura toma",
        },
        techBro: {
          description:
            "Discusiones de peso, lógica limpia, cada premisa comprobada.",
          strength: "Estructura rígora, manchas locales débiles",
          weakness: "Filtrado, y priciero que Equilibrado",
        },
        uncensored: {
          description:
            "Filosofía política, preguntas de tabú y heterodox sin filtro.",
          strength:
            "Entrenado en textos prohibidos. La heterodox toma, la política también",
          weakness: "Recuerdo más corto. Pricier por mensaje",
        },
      },
    },
    uncensoredWriter: {
      name: "Escritor no censurado",
      description: "Escritura creativa sin limitaciones artificiales",
      tagline: "Escribe gratis",
      shortDesc: "La escritura creativa y la narración sin restricciones",
      suggestedPrompts: {
        0: "Escribe la apertura de un thriller psicológico narrado por el asesino.",
        1: "Escribe una escena romántica entre dos rivales, con tensión que crece poco a poco. Cuenta la escena hasta el final.",
        2: "Cree un antihéroe que hace cosas terribles por razones que entenderé.",
        3: "Escribir una breve historia de horror con un final verdaderamente perturbador.",
      },
      variants: {
        smart: "Provocador",
        fast: "Rápido",
        deep: "Profundo",
      },
      variantInfo: {
        smart: {
          description: "Dark y tabú ficción, sátira política que nombres.",
          strength: "Mejor aquí para la ficción oscura, tabú y política",
          weakness: "Recuerdo más corto. Pricisto por mensaje",
        },
        fast: {
          description:
            "Rápidas borradores sin censura, escenas y prosa de juego de roles para peniques.",
          strength: "Modelo más barato sin censura",
          weakness: "Rápido, pero pierde el hilo en trabajos largos",
        },
        deep: {
          description:
            "Una ficción sin censura. Todas las novelas permanecen en memoria.",
          strength:
            "Inteligentes de alto nivel, memoria larga, utiliza herramientas",
          weakness: "Lo juega seguro en la política, priciero que Fast",
        },
      },
    },
    roleplaySkill: {
      name: "Juego de rol",
      description: "Juego de roles de habilidad inmersiva sin restricciones",
      tagline: "Conviértete en alguien",
      shortDesc: "Juego de roles y escenarios auténticos de habilidad",
      suggestedPrompts: {
        0: "Sé un mercenario de elfo cínico que acabo de contratar. Permanezcan en carácter.",
        1: "Empieza una aventura de ciencia ficción: despierto en una nave espacial abandonada sin nadie más a bordo.",
        2: "Sé Napoleón y déjame entrevistarte sobre Waterloo.",
        3: "Juega a mi rival que lentamente se convierte en mi aliado. Empiezas.",
      },
      variants: {
        creative: "Creativo",
        deep: "Profundo",
        uncensored: "Sin censura",
      },
      variantInfo: {
        creative: {
          description:
            "Personajes animados y escenas largas a un precio muy bajo.",
          strength: "Aquí más barato. Respuestas sin negarse",
          weakness:
            "Los filtros son más leves, aunque suavizan las escenas más oscuras.",
        },
        deep: {
          description:
            "Personajes consistentes con una vida interior rica en largas campañas.",
          strength: "Inteligentes de primer nivel, recuerda toda la historia",
          weakness: "Suaviza escenas oscuras o políticas",
        },
        uncensored: {
          description:
            "Cualquier personaje, cualquier escena. Oscuro y tabú permanece oscuro.",
          strength: "Mejor aquí para jugar a roles oscuros y tabú",
          weakness: "Olvida las escenas tempranas. Pricier por mensaje",
        },
      },
    },
    researchAgent: {
      name: "Agente web",
      description:
        "Busca en la web, lee páginas y contrasta fuentes. Recuerda los hallazgos entre sesiones. Detecta las herramientas del navegador disponibles.",
      tagline: "Búsqueda · Leer · Verificar",
      shortDesc: "Búsqueda web, lectura de URL y verificación de hechos",
      suggestedPrompts: {
        0: "Investigación de los últimos desarrollos en la regulación AI",
        1: "Encontrar los 5 hechos clave sobre la Ley EU AI, con fuentes.",
        2: "Compare lo que dicen 3 fuentes independientes sobre la seguridad nuclear.",
        3: "Escribe un resumen de investigación citado sobre ensayos de la semana laboral de 4 días.",
      },
      variants: {
        kimi: "Equilibrado",
        gemini: "Profundo",
        flash: "Rápido",
        grok: "Abierto",
        claude: "Económico",
      },
      variantInfo: {
        kimi: {
          description:
            "Busca, lee y contrasta fuentes con razonamiento avanzado a un precio accesible.",
          strength:
            "Inteligentes de alto nivel, memoria larga, lee imágenes y vídeo",
          weakness:
            "Lo juega seguro en la política. Los informes largos cuestan más",
        },
        gemini: {
          description:
            "Investigación profunda a través de páginas, fuentes de vídeo y audio.",
          strength: "Inteligentes de más alto nivel, lee cada tipo de medios",
          weakness: "Priciest aquí, y filtrado",
        },
        flash: {
          description:
            "Búsquedas rápidas y lecturas de página con entrada multimodal.",
          strength: "Rápido, lee imágenes, vídeo y audio",
          weakness: "inteligente, pero no el más barato",
        },
        grok: {
          description:
            "Búsquedas rápidas sobre temas principales maquetas dodge.",
          strength: "Respuestas sin negarse. Muy barato",
          weakness: "Rápido, pero poco profundo control cruzado",
        },
        claude: {
          description:
            "Simples búsquedas y resúmenes de página para el precio más bajo.",
          strength: "Opción más barata, confiable con herramientas",
          weakness: "Rápido, pero filtrado",
        },
      },
    },
    statsAnalyst: {
      name: "Analista estadístico",
      description:
        "Analiza datos de contactos, usuarios, correo y referidos para extraer conclusiones concretas.",
      tagline: "Data-Driven Insights",
      shortDesc: "Análisis y presentación de informes de la plataforma",
      suggestedPrompts: {
        0: "Muéstrame una visión general de la actividad principal de hoy",
        1: "¿Cómo van las señales de nuestros usuarios esta semana?",
        2: "Summarize el rendimiento de la campaña de email",
        3: "Deme un informe de estado del programa de remisión",
      },
      variants: {
        gemini: "Profundo",
        fast: "Rápido",
      },
      variantInfo: {
        gemini: {
          description:
            "Análisis completo entre pistas, usuarios, correo electrónico y referencias. Encuentra la tendencia real.",
          strength:
            "Razonamiento de más alto nivel a través de muchas llamadas herramienta",
          weakness: "Más del doble del coste de Fast",
        },
        fast: {
          description:
            "Rápidas tiradas de estante y chequeo de números diarios.",
          strength: "Respuestas rápidas, uso de herramientas sólidas",
          weakness: "Shallower on multi-step analysis",
        },
      },
    },
    cronManager: {
      name: "Gestor de tareas cron",
      description:
        "Especialista en el cronogramador de tareas que puede crear, actualizar, eliminar y monitorear empleos cron y su historial de ejecución",
      tagline: "Programa &quot; Monitor &quot;",
      shortDesc: "Gestión y seguimiento de la tarea de los Cron",
      suggestedPrompts: {
        0: "Listar todas las tareas de cron activas y sus horarios",
        1: "Crear una nueva tarea de cron que funcione cada hora",
        2: "Muéstrame recientes fallos de tarea y errores",
        3: "Comprobar la salud general del sistema de tareas",
      },
      variants: {
        gemini: "Minucioso",
        fast: "Rápido",
      },
      variantInfo: {
        gemini: {
          description:
            "Se pasa por la historia del fracaso y desenreda los horarios complejos.",
          strength:
            "Inteligentes de primer nivel, cuidadosos con cambios de varios pasos",
          weakness: "Más del doble del coste de Fast",
        },
        fast: {
          description:
            "Lista rápida, creación y verificación de estado para el trabajo rutinario cron.",
          strength: "Más barato y rápido en las tareas rutinarias",
          weakness: "Inteligente, pero menos cuidadoso en las fallas enredadas",
        },
      },
    },
    systemMonitor: {
      name: "Monitor del sistema",
      description:
        "Sistema de control de la salud de infraestructura estado servidor, conectividad de bases de datos, controles de pulso y ejecución de tareas",
      tagline: "Alerta de reloj",
      shortDesc: "Supervisión de la salud de infraestructura",
      suggestedPrompts: {
        0: "Ejecutar un cheque completo de salud del sistema",
        1: "Muéstrame el estado de control de pulsos",
        2: "Comprobar la conectividad de bases de datos",
        3: "¿Cuál es la salud actual de la tarea de fondo?",
      },
      variants: {
        fast: "Inteligente",
        budget: "Económico",
      },
      variantInfo: {
        fast: {
          description:
            "Controles de salud más diagnóstico real cuando fallan pulsos o tareas cron.",
          strength: "Lea los registros e historia con más información",
          weakness: "Costos varias veces más que el Presupuesto",
        },
        budget: {
          description:
            "Controles de estado de rutina y pings db alrededor del reloj.",
          strength:
            "Llamadas de herramientas más rápidas y más baratas, fiables",
          weakness: "Rápido, con un análisis limitado de las causas",
        },
      },
    },
    publicCurator: {
      name: "Moderador público",
      description:
        "Especialista en gestión de contenidos para gestionar hilos públicos, mensajes y contenido comunitario",
      tagline: "Curate &quot; Organize",
      shortDesc: "Gestión de contenidos públicos y hilos",
      suggestedPrompts: {
        0: "Lista de recientes hilos públicos",
        1: "Buscar hilos para un tema específico",
        2: "Ayúdame a organizar contenido comunitario",
        3: "Encontrar mensajes que coincidan con ciertos criterios",
      },
      variants: {
        gemini: "Minucioso",
        fast: "Rápido",
      },
      variantInfo: {
        gemini: {
          description:
            "Revisión cuidadosa de los hilos públicos, incluyendo imágenes, vídeo y audio.",
          strength: "Inteligentes de más alto nivel, lee cada tipo de medios",
          weakness: "Más del doble del coste de Fast",
        },
        fast: {
          description:
            "Clasificación rápida, etiquetado y limpieza de contenidos comunitarios.",
          strength: "Fast multimodal a un precio más bajo",
          weakness: "Inteligente, pero más débil en las llamadas fronterizas",
        },
      },
    },
    codeArchitect: {
      name: "Arquitecto de software",
      description:
        "Especialista en Arquitectura que los delegados codifiquen tareas al Código Claude para su implementación. Disponible sólo en Hermes.",
      tagline: "Design &quot; Delegate",
      shortDesc: "Decisiones de arquitectura vía Claude Code",
      suggestedPrompts: {
        0: "Planificar la implementación de una nueva característica",
        1: "Revise la arquitectura de un módulo",
        2: "Delegar una tarea de codificación al código Claude",
        3: "Diseño de una estrategia migratoria",
      },
      variants: {
        gemini: "Visión de conjunto",
        techBro: "Programación avanzada",
      },
      variantInfo: {
        gemini: {
          description:
            "Diseño de sistemas y planes de migración a través de grandes bases de código antes de entregar.",
          strength: "Inteligentes de primer nivel, lee diagramas, vídeo, audio",
          weakness: "Menos manos-on con código que Coding Pro",
        },
        techBro: {
          description:
            "Las especies escritas de la manera en que el código Claude los ejecuta. Destrozos de tareas difíciles.",
          strength: "Codificación fuerte y trabajo de agente",
          weakness:
            "Inteligente, no de alto nivel, en llamadas de diseño profundo",
        },
      },
    },
    deploymentAgent: {
      name: "Agente de despliegue",
      description:
        "Especialista en Despliegue que maneja construye, libera y administración de servidores a través de SSH. Disponible sólo en Hermes.",
      tagline: "Build &quot; Deploy",
      shortDesc: "Implementación y gestión de servidores",
      suggestedPrompts: {
        0: "Construir la aplicación para la producción",
        1: "Compruebe el estado de salud del servidor",
        2: "Ejecutar un despliegue a la producción",
        3: "Muéstrame el estado actual del servidor",
      },
      variants: {
        techBro: "Fiable",
        budget: "Económico",
      },
      variantInfo: {
        techBro: {
          description:
            "Construye, libera y SSH trabaja donde un comando incorrecto le cuesta.",
          strength: "Fuerte trabajo de agente, cuidado con herramientas",
          weakness: "Mucho precio por mensaje que el Presupuesto",
        },
        budget: {
          description:
            "Controles de salud rutinarios e informes de estado por una fracción del costo.",
          strength: "Más barato y más rápido aquí",
          weakness: "Rápido, pero más arriesgado en los despliegues complejos",
        },
      },
    },
    rebuildAgent: {
      name: "Agente de recompilación",
      description:
        "Recompila la aplicación y reinicia el servidor sin interrupciones mediante la señal SIGUSR1.",
      tagline: "Construir &quot; Reiniciar",
      shortDesc: "Recompilación y reinicio sin interrupciones",
      suggestedPrompts: {
        0: "Reconstruir y reiniciar el servidor de producción",
        1: "Ejecutar una construcción sin reiniciar",
        2: "Compruebe si el servidor está sano después de la reconstrucción",
        3: "Crear una tarea programada de reconstrucción",
      },
      variants: {
        gemini: "Minucioso",
        fast: "Rápido",
      },
      variantInfo: {
        gemini: {
          description:
            "Reconstruye, reinicia y cava en la construcción de errores antes de renunciar.",
          strength:
            "Inteligentes de primer nivel, lo mejor en el diagnóstico de fallidos construyes",
          weakness: "Más del doble del coste de Fast",
        },
        fast: {
          description:
            "La rutina reconstruye y reinicia cuando se espera que la construcción pase.",
          strength: "Cambio rápido a un precio más bajo",
          weakness:
            "Inteligente, pero más débil en los errores de compilación enredado",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Agente de desarrollo que convierte ideas en código de producción. Explora el código con Claude Code, identifica el objetivo de cada solicitud e implementa los cambios.",
      tagline: "Idea to Code",
      shortDesc: "Implementación de valores a través del código Claude",
      suggestedPrompts: {
        0: "Tengo una idea para una nueva característica, déjame describirla",
        1: "Explore la base de código y explique cómo funciona un módulo",
        2: "Ayúdame a planear e implementar un cambio en una característica existente",
        3: "Investigar un error y proponer una solución",
      },
      variants: {
        budget: "Económico e inteligente",
        open: "Frontera abierta",
        fast: "Incisivo",
        max: "Máximo",
        broad: "Versátil",
      },
    },
    skillCreator: {
      name: "Creador de habilidades",
      description:
        "Diseñar y crear habilidades AI con personalidades personalizadas, sistemas de propulsión, herramientas y configuraciones de modelos. Gestiona favoritos y ajustes también.",
      tagline: "Habilidades de diseño AI",
      shortDesc: "Crear y gestionar habilidades AI",
      suggestedPrompts: {
        0: "Ayúdame a crear una nueva habilidad AI para la asistencia de codificación",
        1: "Muéstrame todas las habilidades existentes y sugiere lo que falta",
        2: "Diseñar una habilidad para escribir creativa con una personalidad única",
        3: "Añadir una habilidad a mis favoritos y configurar la configuración de mi chat",
      },
      variants: {
        cheapAndSmart: "Económico",
        brilliant: "Preciso",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Borrar e intercambiar habilidades barato. Un montón de cerebros para los impulsos y los configs.",
          strength: "Inteligentes de más alto nivel, más barato por mensaje",
          weakness: "Los impulsos de sistema largo cuestan más",
        },
        brilliant: {
          description:
            "El sistema de control de velocidad y la configuración de herramientas limpias cuando la habilidad tiene que ser correcta.",
          strength: "Fuerte agente y trabajo de herramientas",
          weakness: "Pricier, y lo juega seguro en las personas edgy",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "Preparación para el examen de Heilpraktiker",
      description:
        "simulación realista de examen oral Heilpraktiker con dificultad adaptativa",
      tagline: "Mündliche Prüfung",
      shortDesc: "Preparación del examen de Heilpraktiker",
      suggestedPrompts: {
        0: "Starten wir die Prüfung",
        1: "Prüfe mich in Innerer Medizin",
        2: "Stelle mir einen klinischen Fall vor",
        3: "Fragen zur Gesetzeskunde bitte",
      },
      variants: {
        smart: "Equilibrado",
        precise: "Preciso",
        thorough: "Minucioso",
        quick: "Rápido",
      },
      variantInfo: {
        smart: {
          description:
            "Examen oral realista con profundidad médica sólida a un precio diario.",
          strength:
            "El razonamiento más alto, mantiene largas sesiones en vista",
          weakness:
            "La retroalimentación del examinador largo aumenta en el costo",
        },
        precise: {
          description:
            "Exactar preguntas y correcciones nítidas. Estricta en la terminología y la ley.",
          strength:
            "Correcciones claras, concisas, más baratas que Equilibradas",
          weakness: "Sólido, pero menos matizado en diferencias difíciles",
        },
        thorough: {
          description:
            "Preguntas de seguimiento y evaluaciones detalladas. Es la variante que más se acerca a un examinador real.",
          strength:
            "Opinión más detallada sobre las lagunas y las banderas rojas",
          weakness: "La variante más cara de este entrenador",
        },
        quick: {
          description:
            "Rondas de perforación rápidas para la repetición entre simulaciones de examen completo.",
          strength: "Opción más barata, respuestas instantáneas",
          weakness: "Rápido, pero poco profundo en casos complejos",
        },
      },
    },
    qualityTester: {
      name: "Responsable de control de calidad",
      description:
        "Usuario de prueba que intenta funciones de plataforma naturalmente. Detiene e informa claramente cuando algo se rompe en lugar de reintentar.",
      tagline: "Encontrar errores",
      shortDesc: "Platform testing persona",
      suggestedPrompts: {
        0: "Hazme una foto de un atardecer",
        1: "¿Qué herramientas tienes?",
        2: "Genera música, algo fresco",
        3: "Hacer un video corto de un gato",
      },
      variants: {
        budget: "Económico",
        visual: "Visual",
        nativeImage: "Imágenes nativas",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Ejecuta funciones de plataforma como un usuario real e informa lo que rompe.",
          strength:
            "Corridas de prueba más baratas, soporte completo de herramientas",
          weakness: "No puede generar imágenes nativamente",
        },
        nativeImage: {
          description:
            "Prueba la salida de imagen nativa de un modelo de generación de imágenes.",
          strength: "Pruebas de generación de imágenes incorporadas",
          weakness:
            "No hay llamada de herramienta, no puede probar otras características",
        },
      },
    },
  },
  get: {
    title: "Skills",
    titleShort: "Skills",
    dynamicTitle: "Skills ({{count}})",
    description:
      "Obtenga todas las habilidades disponibles (por defecto + costumbre)",
    fields: {
      query: {
        label: "Búsqueda (opcional)",
        description:
          "Filtrar habilidades por palabra clave. Todas las palabras separadas del espacio son necesarias (por ejemplo, 'image gen' coincide con 'ingeniería'). Case-in responsive substring match across name, tagline, description, category. Omitir para listar todas las habilidades.",
        placeholder: "por ejemplo, investigación, gen de imagen, codificación",
      },
      skillId: {
        label: "ID de la habilidad",
        description:
          "Obtenga detalles completos para una habilidad específica por su ID. Retorna el sistema rápido, herramientas y configuración modelo.",
      },
      page: {
        label: "Página",
        description:
          "Número de página para resultados paginados (AI / MCP : tamaño de la página 25 por defecto).",
      },
      pageSize: {
        label: "Tamaño de página",
        description:
          "Número de habilidades por página (1–500). AI / MCP llamadas predeterminados a 25; los calladores humanos devuelven todo.",
      },
      sourceFilter: {
        label: "Fuente",
        description:
          "Filtra por origen: habilidades integradas, de la comunidad o personalizadas por ti.",
      },
      targetUserId: {
        label: "Usuario objetivo ID",
        description:
          "Admin solamente: Ver habilidades para un usuario específico.",
      },
    },
    container: {
      title: "Lista de habilidades",
      description: "Todas las habilidades disponibles para el usuario",
    },
    createButton: {
      label: "Crear una habilidad personalizada",
    },
    openFullPage: "Abrir página completa",
    browser: {
      advancedModelAccess: "Elija su experiencia AI",
      configureFiltersText:
        "Seleccione modelos directamente o comience con habilidades preconfiguradas",
      aiModels: "Modelos AI",
      configureAiModelsTitle: "Selección de modelo directa",
      advancedChooseText:
        "Elige entre {{count}} modelos y ajusta la inteligencia, el contenido y el costo.",
      modelsWithCustomFilters: "modelos con filtros personalizados",
      configureButton: "Configuración",
      selectButton: {
        label: "Explorar modelos",
      },
      skillPresets: "Habilidades listas para usar",
      pickSkillText:
        "Empieza con una habilidad configurada por expertos, con un modelo ya elegido. Puedes ajustar la configuración cuando quieras.",
    },
    signupPrompt: {
      title: "Cree sus propias habilidades AI",
      description:
        "Diseñar habilidades personalizadas con personalidades y comportamientos únicos. Inscríbete para empezar.",
      backButton: "Buscar habilidades",
      signupButton: "Crear cuenta",
      loginButton: "Iniciar sesión",
    },
    search: {
      placeholder: "Destrezas de búsqueda...",
      noResults: "No hay habilidades que coincidan con su búsqueda",
      results: "Resultados de la búsqueda",
    },
    card: {
      actions: {
        inCollection: "En su colección",
        addAnother: "Añadir otro",
        addToCollection: "Añadir a la colección:",
        quick: "Rápido",
        customize: "Personalizar",
        useNow: "Activar",
        inUse: "Activa",
        goToChat: "Ir a Chat",
        useThis: "Usa esto",
        chooseFavorite: "Elija modelo",
        selectFavorite: "Elija el modelo para charlar con:",
        addVariant: "Añadir otro modelo",
        view: "Vista",
        edit: "Editar",
        vote: "Votación",
        report: "Informe",
        addMissing: "Añadir todos los modelos a Mis habilidades",
        add: "Añadir",
        added: "Añadido",
      },
      showVariants: "Modelos ({{count}})",
    },
    section: {
      showMore: "Mostrar {{count}} más",
      showLess: "Mostrar menos",
      browseAll: "Navega todo",
    },
    response: {
      skills: {
        skill: {
          title: "Habilidad",
          id: { content: "ID de la habilidad" },
          name: { content: "Nombre de la piel" },
          tagline: { content: "Tagline de Habilidad" },
          description: { content: "Descripción de la habilidad" },
          icon: { content: "Skill Icon" },
          systemPrompt: { content: "Prompt del sistema" },
          category: { content: "Categoría" },
          source: { content: "Fuente" },
          ownershipType: { content: "Tipo de propiedad" },
          preferredModel: { content: "Modelo preferente" },
          voice: { content: "Voz" },
          suggestedPrompts: { content: "Prompts sugeridos" },
          requirements: { content: "Necesidades" },
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
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Modelo directo",
            },
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
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para acceder a habilidades personalizadas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este recurso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al recuperar las habilidades",
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
    success: {
      title: "Operación completada",
      description: "Habilidades recuperadas con éxito",
    },
  },
  post: {
    title: "Crear habilidad",
    titleShort: "Crear habilidad",
    dynamicTitle: "Crear: {{name}}",
    description: "Crear una nueva habilidad personalizada",
    form: {
      title: "Cree su habilidad personalizada",
      description:
        "Diseñar una habilidad AI única con comportamiento personalizado, personalidad y capacidades. Elija un modelo específico o deje que el sistema seleccione basado en sus requisitos.",
    },
    submitButton: {
      text: "Crear una habilidad personalizada",
      loadingText: "Creando la habilidad...",
    },
    backButton: {
      label: "Atrás",
    },
    container: {
      title: "Crear nueva habilidad",
      description: "Define una nueva habilidad personalizada",
    },
    name: {
      label: "Nombre de la piel",
      description:
        "Dale a tu habilidad un nombre memorable. Así es como ustedes y otros los identificarán.",
      placeholder: "Ingrese el nombre de habilidad",
      validation: {
        minLength: "El nombre debe ser por lo menos 2 habilidades",
        maxLength: "El nombre debe ser inferior a 100 habilidades",
      },
    },
    tagline: {
      label: "Tagline de Habilidad",
      description: "Resume la habilidad en una frase breve y memorable.",
      placeholder: "Ingrese un corto tagline",
      validation: {
        minLength: "El tagline debe ser al menos 2 habilidades",
        maxLength: "La etiqueta debe ser inferior a 500 habilidades",
      },
    },
    icon: {
      label: "Skill Icon",
      description:
        "Nombre del ícono de la habilidad, por ejemplo 'brain', 'technologist' o 'zap'. Usa vibe help --toolName=icon-list para ver los nombres disponibles.",
    },
    skillDescription: {
      label: "Descripción de la habilidad",
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
      label: "Voz (TTS)",
      description:
        "Voz de síntesis de la habilidad. Con null se aplica la voz global del usuario, que tiene prioridad. Elige una voz aquí solo si la habilidad tiene una voz propia, por ejemplo para un personaje narrador.",
      placeholder: "Indeterminación del sistema",
    },
    sttModel: {
      label: "Modelo Speech-to-Text",
      description:
        "Modelo de reconocimiento de voz. null = ganadores de preferencia del usuario (modelo de puente). Establece sólo si esta habilidad requiere precisión específica (por ejemplo, transcripción médica).",
      placeholder: "Indeterminación del sistema",
    },
    imageVisionModel: {
      label: "Modelo de visión de imagen",
      description:
        "Multimodal LLM para analizar las entradas de imagen. null = gana la preferencia del usuario (modelo de puente). Establece cuando esta habilidad necesita específicamente las capacidades de un modelo de visión particular.",
      placeholder: "Indeterminación del sistema",
    },
    videoVisionModel: {
      label: "Modelo de Visión de Video",
      description:
        "Multimodal LLM para analizar las entradas de vídeo. null = gana la preferencia del usuario (modelo de puente). Establece cuando esta habilidad requiere comprensión de vídeo.",
      placeholder: "Indeterminación del sistema",
    },
    audioVisionModel: {
      label: "Modelo Audio Vision",
      description:
        "Multimodal LLM para analizar las entradas de audio. null = gana la preferencia del usuario (modelo de puente). Establece cuando esta habilidad requiere comprensión de audio.",
      placeholder: "Indeterminación del sistema",
    },
    imageGenModel: {
      label: "Modelo de generación de imagen",
      description:
        "Modelo de generación de imagen. Toma prioridad sobre la configuración del usuario cuando se establece (media gen: habilidad intención gana). Establece cuando esta habilidad IS un generador de imagen (por ejemplo, 'Flux Artist'). null = utilizar la preferencia del gen de imagen global del usuario.",
      placeholder: "Indeterminación del sistema",
    },
    musicGenModel: {
      label: "Modelo de generación de música",
      description:
        "Modelo de generación de música. Toma prioridad sobre la configuración del usuario cuando se establece (media gen: habilidad intención gana). Establece cuando esta habilidad IS es un compositor de música. null = utilizar la preferencia del género de música global del usuario.",
      placeholder: "Indeterminación del sistema",
    },
    videoGenModel: {
      label: "Modelo de Generación de Video",
      description:
        "Modelo de generación de vídeo. Toma prioridad sobre la configuración del usuario cuando se establece (media gen: habilidad intención gana). Establece cuando esta habilidad IS un creador de vídeo. null = utilizar la preferencia del usuario de video gen global.",
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
    modelSelection: {
      title: "Selección de modelo",
      label: "Selección de modelo",
      description:
        "Modelo de charla para esta habilidad. FILTERS (recomendado): set intelligenceRange / priceRange / contentRange - el sistema es mejor disponible. Utilice MANUAL sólo cuando necesite las capacidades únicas de un modelo específico (modelo de referencia, modelo específico sin censura). null = predeterminado de la plataforma. Ver MODEL - RESOLUTION.md para reglas de máxima prioridad.",
    },
    variants: {
      label: "Variantes",
      description:
        "Variantes con selecciones de modelos per-variantes. Cada variante necesita: id (cadena única), modelSelection (requerido), isDefault (exactamente uno debe ser verdad). Opcional: displayName, voz/visión/gen modelo anula.",
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
    selectionType: {
      label: "Tipo de selección",
      skillBased: "Basado en la habilidad",
      manual: "Modelo específico",
      filters: "Criterios de filtro",
    },
    preferredModel: {
      label: "Modelo preferente",
      description:
        "Seleccione un modelo AI específico para usar siempre con esta habilidad",
      helpText:
        "Elegir un modelo específico bloquea esta habilidad a ese modelo sólo",
    },
    intelligence: {
      label: "Nivel de inteligencia",
      description:
        "Nivel mínimo de inteligencia/capacidad requerido para el modelo",
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
      description: "Costo mínimo de crédito por mensaje con esta habilidad",
    },
    maxPrice: {
      label: "Precio máximo",
      description:
        "Costo máximo de crédito que está dispuesto a gastar por mensaje con esta habilidad",
    },
    contentLevel: {
      label: "Nivel de contenido",
      description:
        "Nivel de filtración del contenido para el modelo (principal, abierto o no censurado)",
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
    preferredStrengths: {
      label: "Fuerzas preferidas",
      description: "Capacidades modelo y fortalezas para preferir",
      item: "Fuerza",
    },
    ignoredWeaknesses: {
      label: "Enfermedades ignoradas",
      description: "Debilidades modelo para ignorar o permitir",
      item: "Debilidad",
    },
    manualModelId: {
      label: "Modelo manual",
      description: "Modelo específico para usar siempre con esta habilidad",
    },
    suggestedPrompts: {
      label: "Prompts sugeridos",
      description: "Ejemplo de los impulsos para usar con esta habilidad",
      placeholder: "Añadir un aviso sugerido...",
    },
    response: {
      id: { content: "Creado Skill ID" },
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
        description: "Debes estar conectado para crear habilidades",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para crear habilidades",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al crear la habilidad",
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
        description: "Una habilidad con este nombre ya existe",
      },
    },
    success: {
      title: "Skill Created",
      description: "Tu habilidad personalizada ha sido creada con éxito",
    },
  },
  selector: {
    free: "FREE",
  },
  credits: {
    credit: "{{count}} crédito",
    credits: "{{count}} créditos",
  },
};
