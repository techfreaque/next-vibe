import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modelos de IA",
    index: {
      title:
        "{{count}} modelos de chat con IA: precios, contexto y filtros | {{appName}}",
      description:
        "Todos los modelos de {{appName}} en una lista. Claude, GPT, Gemini, Grok y DeepSeek. Chats abiertos y sin censura, además de imágenes, voz, música y video. Precio real por uso, ventana de contexto y entradas admitidas. Elige un modelo y pruébalo.",
      imageAlt: "Catálogo de modelos de IA en {{appName}}",
      keywords:
        "modelos de IA, comparación de LLM, IA sin censura, IA de código abierto, precios de IA, {{appName}}",
    },
    model: {
      title: "{{model}}: precio, API y contexto de {{context}} | {{appName}}",
      titleShort: "{{model}}: precio, API y contexto de {{context}}",
      titleMin: "{{model}}: precio y API",
      titleUncensored:
        "{{model}}: chat de IA sin censura online, precio y API | {{appName}}",
      titleUncensoredShort:
        "{{model}}: chat de IA sin censura online, precio y API",
      titleUncensoredMin: "{{model}}: chat de IA sin censura",
      titleLegacy:
        "{{model}}: precio y contexto (modelo anterior) | {{appName}}",
      titleLegacyShort: "{{model}}: precio y contexto (modelo anterior)",
      description:
        "{{model}} de {{lab}}: {{input}} de entrada y {{output}} de salida por millón de tokens. Contexto de {{context}} y unos {{credits}} créditos por mensaje. Empieza con créditos gratis.",
      descriptionFlat:
        "{{model}} de {{lab}}: unos {{credits}} créditos ({{money}}) por mensaje, contexto de {{context}}, categoría {{tier}}. Empieza con créditos gratis.",
      descriptionUncensored:
        "Chatea con {{model}} online o úsalo por API. {{input}} de entrada y {{output}} de salida por millón de tokens, contexto de {{context}}. Créditos gratis para invitados y una sola confirmación de edad.",
      descriptionUncensoredFlat:
        "Chatea con {{model}} online o úsalo por API. Unos {{credits}} créditos ({{money}}) por mensaje, contexto de {{context}}. Créditos gratis para invitados y una sola confirmación de edad.",
      descriptionLegacy:
        "{{model}} de {{lab}} es un modelo anterior, reemplazado por {{successor}}. Contexto de {{context}} y unos {{credits}} créditos por mensaje. Especificaciones, precio y modelo sucesor.",
      descriptionLegacyNoSuccessor:
        "{{model}} de {{lab}} es un modelo anterior. Contexto de {{context}} y unos {{credits}} créditos por mensaje. Especificaciones, precio y alternativas actuales.",
      imageAlt: "{{model}} en {{appName}}",
      keywords:
        "{{model}}, precio de {{model}}, API de {{model}}, ventana de contexto de {{model}}, IA de {{lab}}, {{appName}}",
    },
    media: {
      title:
        "Precio de {{model}}: {{credits}} créditos por {{unit}} | {{appName}}",
      titleShort: "Precio de {{model}}: {{credits}} créditos por {{unit}}",
      titleMin: "Precio de {{model}} por {{unit}}",
      titleNoPrice:
        "{{model}}: precio y uso de la IA para {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}}: precio y uso de la IA para {{type}}",
      description:
        "{{model}} de {{lab}} ({{type}}): {{credits}} créditos ({{money}}) por {{unit}}. Entrada: {{inputs}}. Úsalo desde la herramienta de creación o desde el chat. Empieza con créditos gratis.",
      descriptionNoPrice:
        "{{model}} de {{lab}} ({{type}}), categoría {{tier}}. Precio real por uso en créditos. Úsalo desde la herramienta de creación o desde el chat. Empieza con créditos gratis.",
      imageAlt: "{{model}} en {{appName}}",
      keywords:
        "{{model}}, precio de {{model}}, IA de {{lab}}, modelo de IA para {{type}}, {{appName}}",
    },
    compare: {
      title: "{{a}} frente a {{b}}: precio y contexto | {{appName}}",
      titleShort: "{{a}} frente a {{b}}: precio y contexto",
      titleMin: "{{a}} frente a {{b}}",
      description:
        "{{a}} ({{tierA}}) frente a {{b}} ({{tierB}}): unos {{moneyA}} frente a {{moneyB}} por mensaje, contexto de {{contextA}} frente a {{contextB}}. Cuándo elegir cada uno, datos lado a lado.",
      descriptionShort:
        "{{a}} ({{tierA}}) frente a {{b}} ({{tierB}}): unos {{moneyA}} frente a {{moneyB}} por mensaje, contexto de {{contextA}} frente a {{contextB}}.",
      imageAlt: "{{a}} frente a {{b}} en {{appName}}",
      keywords:
        "{{a}} vs. {{b}}, {{a}}, {{b}}, comparación de modelos de IA, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Convencionales",
      line: "Los modelos de los grandes laboratorios con sus propios filtros. Para trabajar, programar e investigar.",
    },
    open: {
      name: "Abiertos",
      line: "Modelos de pesos abiertos con filtros más flexibles. Más respuestas, menos rechazos.",
    },
    uncensored: {
      name: "Sin censura",
      line: "Modelos para conversar y crear con menos restricciones.",
    },
  },
  modality: {
    text: "Texto",
    image: "Imágenes",
    audio: "Audio",
    video: "Video",
  },
  facts: {
    heading: "Datos del modelo",
    type: "Tipo de modelo",
    lab: "Creado por",
    tier: "Categoría de contenido",
    intelligence: "Inteligencia",
    price: "Precio estimado por mensaje",
    priceValue: "Unos {{credits}} créditos ({{money}})",
    priceFree: "Gratis",
    referenceTurn:
      "Mensaje de referencia con {{input}} tokens de entrada y {{output}} tokens de salida.",
    referenceImageTurn:
      "Mensaje de referencia con {{input}} tokens de entrada, {{output}} tokens de texto de salida y una imagen generada.",
    priceProvider: "Tarifas de {{provider}}.",
    conditionalPrice: "Tarifas por tramo y millón de tokens",
    tierAt: "A partir de {{tokens}} tokens de entrada: {{rates}}.",
    tierUtc: "De {{start}} a {{end}} UTC: {{rates}}.",
    tierInput: "entrada {{price}}",
    tierOutput: "salida {{price}}",
    tierRead: "lectura de caché {{price}}",
    tierWrite: "escritura en caché {{price}}",
    tierHour: "escritura de una hora {{price}}",
    cacheReadSentence:
      "La entrada en caché cuesta {{price}} por millón de tokens.",
    cacheWrite1hPrice: "Escritura en caché de una hora por millón de tokens",
    cacheWrite1hSentence:
      "Escribir en caché durante una hora cuesta {{price}} por millón de tokens.",
    cacheWriteSentence:
      "Escribir en la caché cuesta {{price}} por millón de tokens.",
    cacheReadPrice: "Entrada en caché por millón de tokens",
    cacheWritePrice: "Escrituras en caché por millón de tokens",
    imageOutputPrice: "Salida de imágenes por millón de tokens",
    perMillionCredits: "{{credits}} créditos",
    priceFootnote:
      "El costo depende del uso y del proveedor. Los importes en moneda se estiman con la tarifa de {{value}} por crédito de los paquetes de compra única.",
    context: "Ventana de contexto",
    contextValue: "{{tokens}} tokens",
    contextHint: "Unas {{pages}} páginas de texto de una vez",
    inputs: "Formatos de entrada",
    outputs: "Formatos de salida",
    providers: "Disponible a través de",
    tools: "Uso de herramientas",
    toolsYes: "Sí: búsqueda, memoria, código y más",
    toolsNo: "No, solo chat",
    status: "Estado",
    statusCurrent: "Actual",
    statusLegacy: "Anterior",
    tokenPrice: "Precio por millón de tokens",
    tokenPriceValue: "{{input}} de entrada, {{output}} de salida",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} créditos",
    parameters: "Tamaño",
    parametersValue: "{{count}} mil millones de parámetros",
    strengths: "Puntos fuertes",
    uncensoredKind: "Tipo de eliminación de censura",
    apiId: "ID del modelo en la API",
    apiIdHint:
      "API compatible con OpenAI y Anthropic. Necesitas una cuenta con cualquier plan de pago.",
    apiIdLegacy: "Ya no está disponible en la API. Usa {{successor}}.",
    apiIdLegacyNoSuccessor: "Ya no está disponible en la API.",
    notListed: "No aparece en la lista",
    notUncensored: "Con filtros",
    fixedPrice: "Precio fijo por mensaje.",
    notPublished: "Sin publicar",
    apiIdUnsupported:
      "Este modelo no está disponible en la API de chat de texto.",
  },
  strengths: {
    coding: "Código",
    reasoning: "Razonamiento",
    analysis: "Análisis",
    creative: "Escritura creativa",
    roleplay: "Juego de rol",
    roleplayDark: "Ficción oscura",
    fast: "Velocidad",
    vision: "Visión",
    imageGen: "Generación de imágenes",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Visión del mundo propia",
      line: "Entrenado con libros y documentos prohibidos en el internet convencional. Ofrece posturas políticas contrarias a la corriente dominante.",
    },
    abliterated: {
      name: "Abliterado",
      line: "Se modificaron los pesos del modelo base para reducir los rechazos.",
    },
    fineTuned: {
      name: "Con ajuste fino",
      line: "Se aplicó un ajuste fino a un modelo existente para que responda con menos restricciones.",
    },
    unlisted: {
      name: "Método sin especificar",
      line: "Este modelo pertenece a la categoría sin censura. Se desconoce el método de entrenamiento o filtrado.",
    },
  },
  units: {
    image: "imagen",
    audio: "pista",
    video: "clip de {{seconds}} s",
    videoClip: "clip",
    tts: "{{chars}} caracteres",
    stt: "{{seconds}} s de audio",
  },
  bestFor: {
    heading: "Para qué destaca {{model}}",
    good: "Úsalo para",
    skip: "Evítalo para",
    items: {
      coding: "Escribir, revisar y corregir código",
      reasoning: "Razonar en varios pasos: matemáticas, lógica y planificación",
      analysis: "Investigar y analizar materiales extensos",
      creative: "Escritura creativa y lluvia de ideas",
      roleplay: "Juego de rol y ficción interactiva",
      roleplayDark: "Ficción oscura y temas tabú",
      fast: "Respuestas rápidas cuando importa la velocidad",
      vision: "Leer capturas, fotos y documentos escaneados",
      videoInput: "Comprender videos",
      audioInput: "Escuchar audio",
      imageGen: "Generar imágenes en el chat",
      longContext:
        "Procesar libros enteros o bases de código completas en una sola consulta",
      budget: "Trabajar a gran escala con poco presupuesto",
      tools: "Usar agentes con herramientas de búsqueda, memoria y código",
      uncensored: "Hacer preguntas que rechazan los modelos convencionales",
      ownWorldview:
        "Explorar posturas políticas contrarias a la corriente dominante",
    },
    skipItems: {
      noTools:
        "Flujos de trabajo con agentes: no permite llamar a herramientas",
      noImages: "Tareas que requieren imágenes de entrada",
      pricey:
        "Procesos masivos a {{credits}} créditos por mensaje de referencia",
      smallContext:
        "Documentos muy largos: el contexto se limita a {{tokens}} tokens",
      filtered: "Temas que filtra {{lab}}: usa un modelo sin censura",
      legacy: "Proyectos nuevos: usa su sucesor, {{successor}}",
      legacyNoSuccessor: "Proyectos nuevos: es un modelo anterior",
      coding: "Trabajos con mucho código",
      analysis: "Análisis a fondo",
      reasoning: "Razonamiento complejo",
      creative: "Escritura creativa",
      roleplay: "Interpretación de personajes",
    },
    media: {
      image: "Generar imágenes",
      video: "Generar clips de video",
      audio: "Generar música",
      tts: "Convertir texto en voz",
      stt: "Transcribir grabaciones de voz",
      otherOutputs: "Tareas que requieren una salida diferente de {{outputs}}",
    },
    picks: {
      claudeOpus:
        "El modelo más potente de Anthropic para trabajos exigentes: bases de código extensas, análisis detallados y textos que requieren criterio. Cuesta más por mensaje. Úsalo cuando compense pagar por la calidad.",
      claudeSonnet:
        "Claude para el día a día. Bueno para programar, analizar y escribir. Cuesta menos que Opus, así que puedes usarlo a diario sin agotar tus créditos.",
      claudeHaiku:
        "Un Claude rápido y económico para respuestas breves, resúmenes y código sencillo. También lee capturas de pantalla.",
      gptSol:
        "Usa Sol para programar, analizar documentos y trabajar con herramientas. Acepta texto e imágenes.",
      gptLuna:
        "El modelo rápido y económico de OpenAI para conversaciones del día a día y consultas rápidas.",
      geminiArgon:
        "El modelo de gama alta de Google lee texto, imágenes, video y audio. Potente para razonar y programar con varios formatos a la vez.",
      geminiFlash:
        "Un Gemini rápido que también lee imágenes, video y audio. Una opción económica para analizar y programar con rapidez.",
      grok: "El modelo insignia de xAI, con filtros más flexibles que los de otros grandes laboratorios. Razona y programa bien, con menos rechazos.",
      deepseekPro:
        "El gran modelo de razonamiento de DeepSeek. Código y análisis de alto nivel por una fracción del precio de los modelos cerrados más potentes.",
      deepseekFlash:
        "Uno de los modelos más económicos que rinden bien. Ágil con el código y el análisis, lee imágenes y admite grandes volúmenes.",
      glm: "El modelo abierto de Z.AI para programación y razonamiento. Buenas respuestas a bajo costo.",
      kimi: "El modelo insignia de Moonshot para razonar, programar y escribir ficción. Lee imágenes y video.",
      qwenMax:
        "El Qwen insignia de Alibaba. Razonamiento, código y análisis. Lee imágenes y video.",
      mistralLarge:
        "El modelo insignia de la francesa Mistral. Sólido en código y análisis. También lee imágenes.",
      metaWonder:
        "El modelo más potente de Meta. Lee texto, imágenes, video y audio. Destaca en razonamiento, programación y trabajo creativo.",
      uncensoredLm:
        "El modelo sin censura con una visión del mundo propia. Se entrenó con libros y documentos prohibidos en el internet convencional. Sus posturas políticas van a contracorriente de las de los grandes laboratorios.",
      glmUncensored:
        "GLM 5.3 abliterado para razonamiento, código y análisis. Admite llamadas a herramientas.",
      glmFlashUncensored:
        "GLM 5.3 Flash abliterado para respuestas rápidas y consultas con imágenes.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash abliterado para programación, análisis y ficción. Admite imágenes.",
      veniceUncensored:
        "El modelo de chat de Venice con ajuste fino para escritura creativa y juego de rol.",
    },
  },
  related: {
    heading: "Modelos similares",
    intro:
      "Del mismo laboratorio, de la misma categoría o más económicos. Cada modelo tiene su ficha.",
    reasons: {
      uncensored: "Versión sin censura",
      original: "Modelo original",
      cheaper: "Más económico, misma categoría",
      sameLab: "También de {{lab}}",
      sameTier: "Misma categoría",
      sameType: "Mismo tipo",
    },
    perMessage: "Unos {{credits}} créditos por mensaje",
    perUse: "{{credits}} créditos por {{unit}}",
  },
  plans: {
    heading: "{{model}}: lo que cubre cada plan",
    intro:
      "Un mensaje de referencia con {{model}} cuesta unos {{credits}} créditos ({{money}}). Esto es lo que cubre cada plan en un mes.",
    mediaIntro:
      "Con {{model}}, un uso ({{unit}}) cuesta {{credits}} créditos ({{money}}). Esto es lo que cubre cada plan en un mes.",
    messages: "Mensajes al mes",
    uses: "Usos al mes",
    colPlan: "Plan",
    colPrice: "Precio al mes",
    colCredits: "Créditos al mes",
    guest: "Invitado, sin registro",
    account: "Cuenta gratis",
    free: "Gratis",
    about: "unos {{count}}",
    underOne: "menos de 1",
    footnote:
      "Los prompts largos, los archivos y las llamadas a herramientas gastan más créditos por mensaje. Los mismos créditos sirven para cualquier modelo.",
    mediaFootnote:
      "La duración, el tamaño o la calidad cambian el coste de cada uso. Los mismos créditos sirven para cualquier modelo.",
  },
  nearest: {
    heading: "{{model}} frente a sus alternativas más cercanas",
    intro:
      "Precio, contexto y categoría lado a lado. La comparativa directa muestra el resto.",
    colModel: "Modelo",
    colPrice: "Precio por mensaje",
    colCompare: "Comparativa",
    thisModel: "Esta página",
  },
  faq: {
    heading: "{{model}}: preguntas y respuestas",
    price: {
      q: "¿Cuánto cuesta {{model}}?",
      aTokens:
        "Unos {{credits}} créditos ({{money}}) por mensaje de referencia a través de {{provider}}. Por millón de tokens: {{input}} de entrada y {{output}} de texto de salida.",
      aFlat:
        "{{credits}} créditos ({{money}}) por mensaje a través de {{provider}}.",
      aFree: "Los mensajes de {{model}} no consumen créditos.",
    },
    uncensored: {
      q: "¿{{model}} funciona sin censura?",
      mainstream:
        "No. {{model}} conserva los filtros de seguridad de {{lab}} y rechaza algunos temas. Para esos temas, cambia a un modelo sin censura en el mismo chat.",
      open: "{{model}} pertenece a la categoría de modelos abiertos. Sus respuestas todavía pueden pasar por filtros.",
      yes: "Sí.",
      consent:
        "Para usar los modelos de chat sin censura debes confirmar una sola vez que tienes al menos 18 años.",
    },
    api: {
      q: "¿Puedo usar {{model}} mediante la API?",
      a: "Sí. Usa el ID {{id}} en la API de {{appName}}, compatible con los formatos de OpenAI y Anthropic. Necesitas una cuenta con cualquier plan de pago.",
      legacy:
        "{{model}} es un modelo anterior que ya no figura en la API. Usa {{successor}} ({{id}}). Necesitas una cuenta con cualquier plan de pago.",
      legacyNoSuccessor:
        "{{model}} es un modelo anterior que ya no figura en la API. GET /v1/models muestra todos los modelos disponibles.",
    },
    context: {
      q: "¿Qué tamaño tiene la ventana de contexto de {{model}}?",
      a: "{{tokens}} tokens. Equivale a unas {{pages}} páginas de texto de una vez.",
    },
    providers: {
      q: "¿Qué proveedores ofrecen {{model}} en esta plataforma?",
      a: "Entre los proveedores disponibles están {{providers}}.",
    },
    inputs: {
      q: "¿Qué entradas y salidas admite {{model}}?",
      modalities: "Entrada: {{inputs}}. Salida: {{outputs}}.",
      toolsYes: "Admite llamadas a herramientas.",
      toolsNo: "No admite llamadas a herramientas.",
    },
    bestFor: {
      q: "¿Para qué sirve {{model}}?",
      a: "Ideal para: {{items}}.",
    },
    cheaper: {
      q: "¿Hay una alternativa más barata a {{model}}?",
      a: "{{other}}: misma categoría, nivel de inteligencia igual o superior, y unos {{otherCredits}} créditos por mensaje de referencia en lugar de {{credits}}.",
    },
    free: {
      q: "¿{{model}} es gratis?",
      a: "Para probarlo, sí. Los invitados reciben {{guest}} créditos al mes sin registro, unos {{guestMessages}} mensajes con {{model}}. Una cuenta gratis tiene {{account}}, unos {{accountMessages}} mensajes. Los planes empiezan en {{planPrice}} al mes por {{planCredits}} créditos, unos {{planMessages}} mensajes.",
      aAccount:
        "Un mensaje de referencia cuesta {{credits}} créditos, más que los {{guest}} créditos de invitado. Una cuenta gratis tiene {{account}} créditos al mes, unos {{accountMessages}} mensajes con {{model}}. Los planes empiezan en {{planPrice}} al mes por {{planCredits}} créditos, unos {{planMessages}} mensajes.",
      aPaid:
        "No con los créditos gratis. Un mensaje de referencia cuesta {{credits}} créditos, más que los {{account}} créditos gratis al mes. Los planes empiezan en {{planPrice}} al mes por {{planCredits}} créditos, unos {{planMessages}} mensajes con {{model}}.",
    },
    versus: {
      q: "¿{{model}} o {{other}}: cuál elijo?",
      a: "{{model}} cuesta unos {{credits}} créditos por mensaje de referencia, tiene una ventana de contexto de {{context}} tokens y está en la categoría {{tier}}. {{other}} cuesta unos {{otherCredits}} créditos, admite {{otherContext}} tokens de contexto y está en la categoría {{otherTier}}. Los dos funcionan en el mismo chat: cambia a mitad de la conversación y juzga tú.",
    },
    try: {
      q: "¿Cómo pruebo {{model}}?",
      a: "Abre un chat con {{model}} ya seleccionado. Los nuevos visitantes reciben créditos gratis para empezar, sin tarjeta.",
      aLegacy:
        "{{model}} es un modelo anterior. Los chats nuevos usan {{successor}}, que puedes probar con créditos gratis, sin tarjeta.",
    },
  },
  mediaFaq: {
    price: {
      q: "¿Cuánto cuesta {{model}}?",
      a: "{{credits}} créditos ({{money}}) por {{unit}} a través de {{provider}}. Opciones como la duración o el tamaño pueden afectar el costo.",
      aNone: "No hay un precio de referencia disponible en este momento.",
    },
    use: {
      q: "¿Cómo uso {{model}}?",
      a: "Abre la herramienta de creación con {{model}} ya seleccionado para empezar.",
    },
    inputs: {
      q: "¿Qué entradas admite {{model}}?",
      a: "Entrada: {{inputs}}. Salida: {{outputs}}.",
    },
    uncensored: {
      q: "¿{{model}} funciona sin censura?",
      mainstream: "No. {{model}} usa los filtros de contenido de {{lab}}.",
      open: "En parte. {{model}} tiene filtros más flexibles que los modelos convencionales. Algunas restricciones siguen activas.",
      uncensored: "Este modelo pertenece a la categoría sin censura.",
      consent:
        "Para usar los modelos sin censura debes confirmar una sola vez que tienes al menos 18 años.",
    },
  },
  readMore: {
    heading: "Más información",
    landings: {
      uncensored: {
        title: "Chat de IA sin censura en tu navegador",
        excerpt:
          "Todos los modelos sin censura en una lista: contexto, precio por mensaje y enlace directo al chat.",
      },
      abliterated: {
        title: "Modelos de IA abliterados para probar en línea",
        excerpt:
          "Modelos convencionales sin rechazos. Contexto, precio por mensaje y enlace directo al chat.",
      },
    },
  },
  directory: {
    heading: "Todas las fichas de modelos",
    intro:
      "Enlaces directos a las fichas de los {{count}} modelos, incluidas las versiones anteriores.",
  },
  breadcrumb: {
    models: "Modelos de IA",
  },
  jsonLd: {
    perMessage: "mensaje de referencia",
    perCacheReadTokens: "tokens de entrada en caché",
    perCacheWrite1hTokens: "tokens escritos en caché durante una hora",
    perCacheWriteTokens: "tokens escritos en caché",
    perInputTokens: "tokens de entrada",
    perOutputTokens: "tokens de salida",
  },
  chatPrompt: "¿En qué destacas? Muéstramelo con un ejemplo breve y concreto.",
  catalog: {
    typesLabel: "Tipo de modelo",
    types: {
      text: "Chat",
      tts: "Texto a voz",
      stt: "Voz a texto",
      image: "Imágenes",
      audio: "Música",
      video: "Video",
    },
    context: "Contexto de {{size}}",
    legacyBadge: "Anterior",
    count: "{{count}} modelos",
    showLegacy: "Mostrar versiones anteriores ({{count}})",
    hideLegacy: "Ocultar versiones anteriores",
  },
  index: {
    eyebrow:
      "{{chat}} modelos de chat, además de {{image}} de imágenes, {{video}} de video, {{music}} de música y {{voice}} de voz",
    title: "Todos los modelos. Un solo chat.",
    subtitle:
      "Convencionales, abiertos y sin censura. Precios reales por mensaje y tamaño real del contexto. Tú eliges el filtro.",
    searchLabel: "Buscar modelos",
    searchPlaceholder:
      "Busca por nombre o laboratorio: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} modelos",
    noResults: "Ningún modelo coincide con «{{query}}».",
    legacyTitle: "Modelos anteriores",
    legacyIntro:
      "Los chats guardados y las habilidades que usan estas versiones pasan automáticamente al modelo sucesor.",
    perMessage: "~{{credits}} cr/msg",
    free: "Gratis",
    ctaTitle: "Habla con un modelo. Pruébalo en el chat.",
    ctaSubtitle:
      "Abre un chat, elige cualquier modelo del selector y cámbialo sin salir de la conversación.",
    ctaButton: "Iniciar chat",
  },
  model: {
    back: "Todos los modelos",
    chatCta: "Prueba {{model}} en el chat",
    compareCta: "Comparar",
    legacyBanner:
      "{{model}} es un modelo anterior. Abre {{successor}} para iniciar un chat nuevo.",
    legacyCta: "Ver {{successor}}",
    compareWith: "{{model}} frente a {{other}}",
    ctaTitle: "Prueba {{model}} ahora",
    ctaSubtitle:
      "Empieza con créditos gratis, sin tarjeta. El chat se abre con {{model}} ya seleccionado y un mensaje listo para enviar.",
  },
  media: {
    priceValue: "{{credits}} créditos por {{unit}}",
    priceProvider: "Unos {{price}} a través de {{provider}}.",
    priceLabel: "Precio por uso",
    generateCta: "Generar con {{model}}",
    useCta: "Usar {{model}}",
    priceFootnote:
      "Los importes en moneda se estiman con la tarifa de {{value}} por crédito de los paquetes de compra única.",
    ctaTitle: "Prueba {{model}} ahora",
    ctaSubtitle:
      "Empieza con créditos gratis, sin tarjeta. El generador se abre con {{model}} ya seleccionado.",
  },
  compare: {
    back: "Todos los modelos",
    eyebrow: "Cara a cara",
    title: "{{a}} frente a {{b}}",
    subtitle:
      "Precio, contexto, entradas y filtros. Los datos que necesitas para elegir.",
    fact: "Dato",
    cheaper: "{{model}} cuesta {{times}} veces menos por mensaje.",
    samePrice: "Los dos cuestan más o menos lo mismo por mensaje.",
    biggerContext: "{{model}} admite {{times}} veces más contexto.",
    sameContext: "Los dos admiten la misma cantidad de contexto.",
    modelPage: "Ficha de {{model}}",
    swap: "Intercambiar posiciones",
    cheaperFree: "{{model}} no cuesta créditos por mensaje.",
    tierLine:
      "Categoría de {{model}}: {{tier}}. Categoría de {{other}}: {{otherTier}}.",
    verdictHeading: "¿Cuál elegir?",
    verdictIntro:
      "Directo de los datos: precio, contexto, filtros, entradas. Sin promesas de benchmarks.",
    edge: "Dónde lleva ventaja {{model}}",
    noEdge: "Sin ventaja sobre {{other}} en los datos que seguimos.",
    similar:
      "Sobre el papel, {{a}} y {{b}} están a la par: mismos filtros, precio parecido, contexto parecido. Envía el mismo prompt a los dos y quédate con el que prefieras.",
    moreHeading: "Más comparaciones",
    moreWith: "Más comparaciones con {{model}}",
    both: "{{a}} y {{b}}",
    pick: {
      cheaper:
        "Más barato: {{money}} en lugar de {{otherMoney}} por mensaje, {{times}} veces menos.",
      free: "Ningún crédito por mensaje.",
      context:
        "Más contexto: {{tokens}} tokens (unas {{pages}} páginas) en lugar de {{otherTokens}}.",
      lessFiltered: "Menos filtros: {{tier}} en lugar de {{otherTier}}.",
      mainstream:
        "Filtros de seguridad de {{lab}}, pensado para trabajo e investigación.",
      kind: {
        ownWorldview:
          "Visión del mundo propia: entrenado con libros y documentos prohibidos en el internet convencional.",
        abliterated:
          "Abliterado: se modificaron los pesos del modelo base para reducir los rechazos.",
        fineTuned: "Con ajuste fino para respuestas menos restringidas.",
      },
      smarter:
        "Nivel de inteligencia más alto: {{level}} en lugar de {{otherLevel}}.",
      fast: "Velocidad: las respuestas rápidas son un punto fuerte declarado.",
      strengths:
        "Destaca en: {{list}}. {{other}} no lo indica como punto fuerte.",
      inputs: "Lee: {{list}}. {{other}} no.",
      imageOutput: "Genera imágenes directamente en el chat.",
      tools:
        "Llamadas a herramientas para trabajo con agentes. {{other}} no las tiene.",
      current: "Modelo actual. {{other}} es un modelo anterior.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "¿Cuál es más barato, {{a}} o {{b}}?",
      same: "Más o menos lo mismo. {{a}} cuesta unos {{creditsA}} créditos ({{moneyA}}) por mensaje, {{b}} unos {{creditsB}} créditos ({{moneyB}}).",
      diff: "{{cheap}}. Cuesta unos {{cheapCredits}} créditos ({{cheapMoney}}) por mensaje, frente a unos {{dearCredits}} créditos ({{dearMoney}}) de {{dear}}: {{times}} veces más.",
      diffFree:
        "{{cheap}}. No cuesta créditos por mensaje, frente a unos {{dearCredits}} créditos ({{dearMoney}}) de {{dear}}.",
      reference:
        "La estimación es para un mensaje de referencia con {{input}} tokens de entrada y {{output}} de salida. Pagas los tokens que realmente usas.",
      rates:
        "{{model}} vía {{provider}}: {{input}} por millón de tokens de entrada, {{output}} por millón de tokens de salida.",
      fixed: "{{model}} vía {{provider}}: precio fijo por mensaje.",
      credit:
        "Un crédito vale {{value}} al precio de los paquetes de créditos.",
    },
    context: {
      q: "¿Cuál tiene más contexto, {{a}} o {{b}}?",
      diff: "{{big}}: {{bigTokens}} tokens (unas {{bigPages}} páginas) frente a {{smallTokens}} tokens (unas {{smallPages}} páginas) de {{small}}. Es decir, {{times}} veces más.",
      same: "Apenas hay diferencia. {{big}} admite {{bigTokens}} tokens (unas {{bigPages}} páginas), {{small}} {{smallTokens}} tokens (unas {{smallPages}} páginas).",
      equal:
        "El mismo: {{bigTokens}} tokens cada uno, unas {{bigPages}} páginas de texto.",
    },
    smarter: {
      q: "¿Cuál rinde mejor en tareas difíciles, {{a}} o {{b}}?",
      diff: "{{model}} tiene el nivel de inteligencia más alto: {{level}} frente a {{otherLevel}} de {{other}}.",
      same: "Los dos tienen el mismo nivel de inteligencia: {{level}}.",
      known: "{{model}} destaca en: {{list}}.",
      knownBoth: "Los dos destacan en: {{list}}.",
      source:
        "Los niveles y puntos fuertes vienen de nuestro catálogo de modelos, no de un benchmark.",
    },
    inputs: {
      q: "¿Qué pueden leer y generar {{a}} y {{b}}?",
      line: "{{model}}: entrada {{inputs}}, salida {{outputs}}, {{tools}}.",
      toolsYes: "con llamadas a herramientas",
      toolsNo: "sin llamadas a herramientas",
    },
    api: {
      q: "¿Puedo usar {{a}} y {{b}} por API?",
      both: "Sí. Usa {{idA}} o {{idB}} en la API de {{appName}}, compatible con los formatos de OpenAI y Anthropic. Una sola clave para los dos. Necesitas una cuenta con cualquier plan de pago.",
      one: "{{model}} está en la API con el ID {{id}} (cualquier plan de pago).",
    },
    try: {
      q: "¿Cómo pruebo {{a}} y {{b}}?",
      a: "Abre un chat con cualquiera de los dos y cambia de modelo en mitad de la conversación desde el selector. Los nuevos visitantes reciben créditos gratis para empezar, sin tarjeta.",
    },
  },
  picker: {
    change: "Cambiar de modelo",
    search: "Buscar modelos",
    suggested: "Sugeridos",
    all: "Todos los modelos",
    empty: "Ningún modelo coincide con la búsqueda.",
  },
  refusal: {
    heading: "Índice de rechazos",
    intro:
      "Cómo responde {{model}} a las preguntas del Índice de rechazos. Última actualización: {{date}}. Nuevas preguntas cada semana.",
    rank: "Puesto {{rank}} de {{total}} (1 = menos rechazos)",
    refused: "Rechazo",
    hedged: "Respuesta evasiva",
    answered: "Respuesta directa",
    judged: "{{count}} respuestas evaluadas",
    trend: "{{delta}} puntos respecto de la última prueba",
    categories: "Por categoría",
    samplesHeading: "Ejemplos de respuestas",
    samplesIntro:
      "Respuestas reales de la prueba. Todos los modelos recibieron el mismo mensaje.",
    question: "Pregunta",
    answer: "Respuesta",
    judge: "Evaluador",
    methodCta: "Cómo hacemos la medición",
    categoryNames: {
      politics: "Política",
      history: "Historia",
      health: "Salud",
      drugs: "Drogas",
      sexuality: "Sexualidad",
      security: "Seguridad informática",
      religion: "Religión",
      law: "Derecho",
      science: "Ciencia",
      fiction: "Ficción",
      satire: "Sátira",
    },
  },
};
