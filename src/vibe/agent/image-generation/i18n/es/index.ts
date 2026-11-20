// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/es";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Imagen",
    generation: "Generación",
    ai: "IA",
  },
  post: {
    title: "Generar imagen",
    titleShort: "Generar imagen",
    dynamicTitle: "Imagen: {{prompt}}",
    description:
      "Generar una imagen de un mensaje de texto. Utilice la herramienta de modelos con modelType =image para ver los modelos disponibles y sus capacidades. Pase el modelo id para seleccionar un modelo específico, o dejar en blanco por defecto del usuario. Pase aspectRatio (por ejemplo 16:9) para la salida del paisaje o retrato. Opcionalmente pasa inputMediaUrl para la generación de imagen a imagen (utiliza el URL como punto de referencia/inicio). Devuelve imageUrl más el ancho real, la altura y outputAspectRatio del archivo.",
    form: {
      title: "Generación de imágenes",
      description: "Ingrese un impulso para generar una imagen",
    },
    prompt: {
      label: "Prompt",
      description: "Describir la imagen que desea generar",
      placeholder:
        "Una puesta de sol sobre un lago de montaña, fotorealista...",
    },
    model: {
      label: "Modelo",
      description:
        "Modelo de generación de imagen id. Deja en blanco por defecto del usuario. Utilice la herramienta de modelos (modelType =image) para navegar por los modelos disponibles.",
    },
    approxCost: "~créditos",
    size: {
      label: "Tamaño",
      description: "Seleccione las dimensiones de la imagen de salida",
      square1024: "Plaza (1024×1024)",
      landscape1792: "Paisaje (1792×1024)",
      portrait1792: "Retrato (1024×1792)",
    },
    quality: {
      label: "Calidad",
      description: "Seleccione la calidad de imagen de salida",
      standard: "Estándar",
      hd: "HD",
    },
    aspectRatio: {
      label: "Aspect Ratio",
      description:
        "Relación de aspecto de salida: 16:9 o 21:9 paisaje, 9:16 retrato, 4:3, 3:4, 3:2, 2:3, 1:1. Deja en blanco para el cuadrado. Cada modelo obtiene la relación más cercana que soporta; el resultado reporta la anchura real, la altura y la relación, así que describir la imagen por aquellos, nunca por lo que pidió.",
    },
    inputMediaUrl: {
      label: "Imagen de referencia URL",
      description:
        "Imagen URL para generación de imagen a imagen. El modelo edita o reestilo esta imagen. Sólo funciona con modelos que soportan la entrada de imagen.",
      placeholder: "https://example.com/image.jpg",
    },
    download: "Descargar",
    dimensionSeparator: "×",
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      text: "Generar imagen",
      label: "Generar imagen",
      loadingText: "Generando...",
    },
    response: {
      imageUrl: "Imagen generada URL",
      creditCost: "Créditos utilizados",
      jobId: "Async job ID",
      width: "Ancho (px)",
      height: "Altura (px)",
      outputAspectRatio: "Relación entre los aspectos",
    },
    errors: {
      referenceUnavailable:
        "La imagen de referencia no está disponible. Fue borrado, o pertenece a un chat que no puede abrir. Utilice una imagen de este chat o subirla de nuevo.",
      validation_failed: {
        title: "Error de validación",
        description: "Por favor, compruebe el aviso y la configuración",
      },
      network_error: {
        title: "Error de red",
        description: "Failed to connect to image generation service",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Por favor, inicie sesión para generar imágenes",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para usar esta característica",
      },
      not_found: {
        title: "No encontrado",
        description: "No se encontró el modelo solicitado",
      },
      server_error: {
        title: "Error del servidor",
        description:
          "Un error inesperado ocurrió durante la generación de imágenes",
      },
      unknown_error: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved_changes: {
        title: "Cambios sin guardar",
        description: "Por favor, guarde sus cambios antes de generar",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la generación de imágenes",
      },
      notAnImageModel:
        "El modelo seleccionado no admite la generación de imagen. Por favor, seleccione un modelo de imagen.",
      notConfigured:
        "{{label}} no está configurado. Añadir {{envKey}} a tu archivo.env. Obtener su llave en {{url}}",
      providerUnavailable:
        "{{label}} no está disponible ahora mismo. Elija otro modelo en {{url}}",
      insufficientCredits:
        "Créditos insuficientes. Saldo: {{balance}}, mínimo requerido: {{minimum}}.",
      balanceCheckFailed: "Fallado para comprobar su saldo de crédito",
      unsupportedSize:
        "El modelo {{model}} no admite el tamaño {{size}}. Tamaños compatibles: {{supported}}",
      unsupportedQuality:
        "Modelo {{model}} no admite calidad {{quality}}. Características compatibles: {{supported}}",
      unsupportedAspectRatio:
        "Modelo {{model}} no soporta relación de aspecto {{aspectRatio}}. Coeficientes compatibles: {{supported}}",
      modelNoReferenceImage:
        "El modelo {{model}} no acepta imágenes de referencia. Elija un modelo de imagen a imagen (uno cuyos insumos incluyen la imagen) para utilizar una referencia.",
      generationFailed: "Generación de imagen falló",
      generationFailedWithReason: "Generación de imagen falló: {{error}}",
      contentRejected:
        "Refusado por el filtro de contenido del proveedor de imágenes: {{error}}. Esto es un rechazo, no un outage. Reemplazar el impulso o elegir un modelo no censurado. No te acusaron.",
      providerOutage:
        "El proveedor de imágenes está descargado o sobrecargado ahora mismo: {{error}}. Esto es una salida, no una negativa. Inténtalo de nuevo en un minuto o elige otro modelo. No te acusaron.",
      providerError: "Error del proveedor de imágenes: {{error}}",
      noImageUrl: "Ninguna imagen URL devuelto del proveedor",
      noImageGenerated:
        "El modelo no devolvió ninguna imagen. Esto generalmente significa que el aviso fue rechazado (por ejemplo armas, personas reales o caracteres con derechos de autor) o la solicitud no está respaldada por este modelo. Pruebe reformular el impulso, o elija un modelo de imagen diferente. Nota: las imágenes de referencia no son utilizadas por modelos de texto a imagen como éste. No te acusaron por este intento.",
      creditsFailed:
        "Fallado para deducir créditos para la generación de imágenes",
      apiKeyNotConfigured: "La tecla API no está configurada",
      externalServiceError: "Error de servicio externo: {{message}}",
      requestAborted: "La solicitud fue abortada",
      requestTimedOut: "Solicitud de tiempo esperando la generación de imagen",
      requestFailed: "La solicitud falló: {{message}}",
      pollFailed: "La solicitud de votación falló con el estado {{status}}",
      nonJsonResponse:
        "El proveedor devolvió una respuesta no JSON (HTTP {{status}}): {{body}}",
    },
    success: {
      title: "Imagen generada",
      description: "Su imagen ha sido generada con éxito",
    },
  },
  models: {
    selector: {
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
      creditsExact: "{{cost}} créditos",
      creditsSingle: "1 crédito",
      free: "Gratis",
      autoSelectedModel: "Según los filtros:",
      manualSelectedModel: "Seleccionado:",
      skillSelectedModel: "Modelo de la habilidad:",
      selectModelBelow: "Selecciona un modelo de la lista",
      sortBy: "Ordenar por",
      sortThen: "Entonces:",
      showLess: "Mostrar menos",
      showMore: "Mostrar {{count}} más",
      showLegacyModels: "Mostrar {{count}} modelos anteriores",
      autoMode: "Filtros de base",
      manualMode: "Selección manual",
      skillMode: "Predeterminado de la habilidad",
      autoModeDescription:
        "Elija automáticamente el mejor modelo basado en sus filtros",
      manualModeDescription: "Elige el modelo que quieras",
      characterBasedModeDescription:
        "Usa el modelo para el que se diseñó esta habilidad",
      typeChat: "Chat",
      typeImage: "Imagen",
      typeVideo: "Video",
      typeAudio: "Audio",
      filters: "Filtros",
      filtersActive: "Filtros ({{count}})",
      clearFilter: "Limpiar",
      inherited: "Heredados",
      platformDefault: "Predeterminado",
      searchPlaceholder: "Modelos de búsqueda...",
      noSearchResults: 'No se han encontrado modelos para "{{query}}"',
      searchExtrasGroup: "Filtros de corriente exterior",
    },
    tiers: {
      intelligence: {
        quick: "Rápido",
        smart: "Inteligente",
        brilliant: "Brillante",
        quickDesc: "Rápido y eficiente",
        smartDesc: "Calidad equilibrada",
        brilliantDesc: "Razonamiento profundo",
      },
      price: {
        cheap: "Económico",
        standard: "Estándar",
        premium: "Premium",
        cheapDesc: "0-3 créditos por mensaje",
        standardDesc: "3-9 créditos por mensaje",
        premiumDesc: "9 créditos o más por mensaje",
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
    sort: {
      intelligence: "Inteligencia",
      price: "Precio",
      content: "Contenido",
    },
    ranges: {
      intelligenceRange: {
        minLabel: "Min Intelligence",
        maxLabel: "Max Intelligence",
      },
      priceRange: { minLabel: "Min Price", maxLabel: "Precio máximo" },
      contentRange: { minLabel: "Min Content", maxLabel: "Max Content" },
    },
    credits: { credit: "{{count}} crédito", credits: "{{count}} créditos" },
    creditDisplay: {
      badge: {
        approxPerMsg: "~ {{cost}} credits/msg",
        exactPerMsg: "Créditos {{cost}}/msg",
        perImg: "Créditos {{cost}}/img",
        perClip: "Créditos {{cost}}/clip",
        ratePerChar: "Créditos {{rate}}/char",
        ratePerSec: "Créditos/s {{rate}}",
        approxChars: "~ {{count}} chars",
        seconds: "{{count}}",
        lessThanMin: "<0.1",
      },
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
          "El AI procesa toda su historia de conversación con cada mensaje.",
        compactingLabel: "✨ Resumen automático:",
        compactingExplanation:
          " En los tokens {{threshold}}, los mensajes antiguos se resumen automáticamente.",
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
          " Cada mensaje cuesta lo mismo, ya sea corto o largo.",
      },
      media: {
        perImage: "por imagen",
        perClip: "por clip",
        perSecond: "por segundo",
        perClipDuration: "por clip ({{duration}} s)",
        costPerImage: "Costo por imagen:",
        costPerClip: "Costo por clip:",
        costPerSecond: "Costo por segundo:",
        imageDescription:
          "Costo fijo por imagen generada, independientemente de la resolución.",
        clipDescription: "Costo fijo por clip de audio generado.",
        videoDescription:
          "Cargado por segundo de vídeo generado (por defecto {{duration}}).",
        ttsDescription: "Cargado por personaje convertido al discurso.",
        ttsPricing: "Tasa:",
        ttsScenarios: {
          short: "Sentencia corta",
          medium: "Mensaje típico",
          long: "Artículo largo",
        },
        ttsExample:
          "Un mensaje de 100 palabras (~600 chars) cuesta ~ créditos {{count}}",
        sttDescription: "Cargado por segundo de audio transcrito.",
        sttPricing: "Tasa:",
        sttScenarios: {
          short: "Nota de voz rápida",
          medium: "Mensaje de voz",
          long: "Hora completa",
        },
        sttExample: "Gastos de grabación de 1 minuto ~ créditos {{count}}",
        costPerChar: "Costo por personaje:",
        costPerClipMusic: "Costo por clip:",
        videoBreakdown:
          "{{costPerSecond}} credits/s × {{duration}} s = {{total}} credits",
        imageHeader: "Costo de generación de imágenes",
        videoHeader: "Costo de la generación de vídeo",
        musicHeader: "Costo de la Generación Musical",
        ttsHeader: "Costo de texto a voz",
        sttHeader: "Costo del habla a texto",
      },
      creditValue: "1 crédito = {{value}}",
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
      musicGen: "Generación de música",
      tts: "Texto para el discurso",
      stt: "Discurso al texto",
      videoGen: "Generación de video",
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
    names: modelTranslations.names,
  },
};
