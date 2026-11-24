import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "Bitácora de desarrollo",
    subtitle:
      "Cómo construimos {{appName}} y next-vibe. Las decisiones de arquitectura, los caminos sin salida y lo que terminó marcando la diferencia.",
    meta: {
      title: "Bitácora de next-vibe y {{appName}}",
      description:
        "Las decisiones técnicas detrás de next-vibe y {{appName}}. Una arquitectura para varias interfaces, reglas de TypeScript, Vibe Sense y la historia de cómo construimos ambos.",
      category: "Blog",
      imageAlt: "Blog de next-vibe y {{appName}}",
      keywords:
        "next-vibe, {{appName}}, blog, TypeScript, arquitectura, SaaS, IA, código abierto, desarrollo de software",
    },
  },
  posts: {
    deepseekUncensored: {
      title: "DeepSeek sin censura. Lo que de verdad quita el filtro.",
      category: "Guía de modelos",
      excerpt:
        "La censura de DeepSeek vive en dos capas. Cambiar de proveedor solo quita una. Aquí está lo que quita la otra, más las versiones sin censura de DeepSeek con las que puedes chatear hoy.",
      readTime: "7 min de lectura",
    },
    grokAlternative: {
      title: "Alternativas a Grok. Cuando el descaro no alcanza.",
      category: "Comparativa",
      excerpt:
        "¿Grok es sin censura? No del todo. Hasta dónde llega Grok de verdad, alternativas según lo que buscas y Grok junto a modelos abliterated en un mismo chat.",
      readTime: "7 min de lectura",
    },
    claudeWithoutFilters: {
      title: "Claude sin filtros. Por qué no existe y qué funciona.",
      category: "Guía de modelos",
      excerpt:
        'Ningún interruptor apaga los rechazos de Claude, y todo "Claude sin censura" es un truco. Quédate con Claude para la prosa y pasa el resto a modelos sin censura en el mismo hilo.',
      readTime: "7 min de lectura",
    },
    openrouterAlternatives: {
      title: "Alternativas a OpenRouter. Una clave, menos rechazos.",
      category: "Guía para desarrolladores",
      excerpt:
        "Seis alternativas a OpenRouter, revisadas en su propia documentación: formatos de API, modelos sin censura, comisiones. Y las dos líneas que cambias para mover tu cliente de OpenAI SDK.",
      readTime: "9 min de lectura",
    },
    bestUncensoredLlm: {
      title: "El mejor LLM sin censura. Elegido por tarea, no por hype.",
      category: "Guía de modelos",
      excerpt:
        "Un ganador por tarea: razonamiento, chat diario, código, ficción oscura, opiniones contrarias e imágenes. Además, GLM 5.3 Uncensored frente a DeepSeek V4.1 Flash Uncensored, con precios en vivo.",
      readTime: "8 min de lectura",
    },
    uncensoredWriter: {
      title: "Una IA para escribir sin censura. Tu historia, sin rebajas.",
      category: "Guía de escritura",
      excerpt:
        "Los modelos que escriben villanos, violencia y escenas adultas sin rodeos, cuántas páginas de manuscrito retiene cada uno y un método escena a escena para terminar el libro.",
      readTime: "8 min de lectura",
    },
    unbiasedChatbot: {
      title: "No existe un chatbot de IA imparcial. Pregunta a varios.",
      category: "Guía",
      excerpt:
        "Por qué todo modelo se inclina, cómo los modelos convencionales, abliterados y contrarios enfocan la misma pregunta y cuatro pasos para oír a cada lado en un solo chat.",
      readTime: "7 min de lectura",
    },
    noSignUp: {
      title: "Chat IA sin registro. Sin email. Sin número de teléfono.",
      category: "Guía",
      excerpt:
        "Lo que obtienes sin cuenta, los modelos más baratos para empezar y una lista honesta de lo que el anonimato cubre y lo que no.",
      readTime: "6 min de lectura",
    },
    noGpu: {
      title: "LLM sin censura en línea. Sin GPU. Sin instalar nada.",
      category: "Guía de modelos",
      excerpt:
        "Cuánta VRAM necesitan de verdad los modelos sin censura en local, cuándo el local sigue ganando y todos los modelos sin censura que funcionan en una pestaña, con contexto y precio por mensaje.",
      readTime: "8 min de lectura",
    },
    uncensoredApi: {
      title: "API de LLM sin censura. Tu SDK. Sin reflejo de negativa.",
      category: "Guía para desarrolladores",
      excerpt:
        "Modelos abliterados y sin censura en endpoints compatibles con OpenAI y Anthropic. IDs, precios, un ejemplo de curl y Python que funciona, límites y el paso 18+.",
      readTime: "8 min de lectura",
    },
    jailbreak: {
      title: "Los jailbreaks de ChatGPT siempre se rompen. Deja de hacerlos.",
      category: "Guía de modelos",
      excerpt:
        "Por qué DAN y todos los prompts posteriores fallan, lo que de verdad te cuesta un jailbreak y qué modelos sin censura responden sin él. Con una prueba lado a lado.",
      readTime: "7 min de lectura",
    },
    freedomGptAlternatives: {
      title: "Alternativas a FreedomGPT. La misma idea, menos trampas.",
      category: "Comparativa",
      excerpt:
        "Lo que compran de verdad los créditos de FreedomGPT, lo que admite su propio FAQ y seis alternativas de Venice a Ollama, verificadas en sus propias páginas.",
      readTime: "9 min de lectura",
    },
    gabAiAlternatives: {
      title: "Alternativas a Gab AI. Libertad de expresión sin letra pequeña.",
      category: "Comparativa",
      excerpt:
        "Gab AI es libre en política, estricto con el contenido adulto y guarda tus chats. Seis alternativas verificadas en sus condiciones, precios y políticas de privacidad.",
      readTime: "9 min de lectura",
    },
    freeUncensoredAi: {
      title: "IA sin censura gratis. Lo que gratis significa de verdad.",
      category: "Guía",
      excerpt:
        "Lo que Venice, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, Ollama, LM Studio y nosotros damos gratis de verdad. Cada límite diario y cada pega, comprobados en sus propias páginas.",
      readTime: "8 min de lectura",
    },
    noFilterGptAlternatives: {
      title: "Alternativas a NoFilterGPT. Más modelos, la misma libertad.",
      category: "Comparativa",
      excerpt:
        "Venice, uncensored.ai, FreedomGPT, NanoGPT, Gab AI, LM Studio y nosotros, comparados según sus propias páginas de precios, privacidad y filtros. Elige el modelo, no solo el filtro.",
      readTime: "8 min de lectura",
    },
    veniceAlternatives: {
      title: "Alternativas a Venice AI. Privadas, sin censura, comprobadas.",
      category: "Comparativa",
      excerpt:
        "NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, LM Studio y nosotros, comparados según sus propias páginas de precios, privacidad y filtros. Y dónde Venice sigue ganando.",
      readTime: "9 min de lectura",
    },
    characterAiAlternatives: {
      title:
        "Alternativas a Character.AI sin filtros. Comparamos con fuentes en mano.",
      category: "Comparación",
      excerpt:
        "Janitor AI, SillyTavern, CrushOn, Kindroid, Nomi, Venice y nosotros, según lo que cada uno publica sobre precios, filtros y privacidad. Además, importa tus personajes de Character.AI desde un enlace.",
      readTime: "10 min de lectura",
    },
    abliteratedExplained: {
      title:
        "Tres tipos de IA sin censura: abliteración, ajuste fino y una visión del mundo propia.",
      category: "Guía de modelos",
      excerpt:
        "Qué cambia con cada método, cómo se hicieron nuestros modelos, tres comparaciones de originales y versiones sin censura y una prueba de diez minutos para distinguirlos.",
      readTime: "8 min de lectura",
    },
    imageGenerators: {
      title:
        "Generadores de imágenes con IA sin censura. Precios reales, sin difuminar nada.",
      category: "Comparación de modelos",
      excerpt:
        "Qué modelos generan imágenes sin filtros, cuánto cuesta cada imagen y cómo crearla o editarla directamente en el chat.",
      readTime: "8 min de lectura",
    },
    roleplayWithoutFilter: {
      title:
        "Juego de rol con IA sin filtros. Tú decides adónde va la historia.",
      category: "Guía",
      excerpt:
        "Una alternativa a Character.AI. Descubre qué modelo sin censura se mantiene en personaje, cuál recuerda toda la campaña, cómo empezar en dos minutos y cuánto cuesta cada respuesta.",
      readTime: "8 min de lectura",
    },
    musicVoice: {
      title: "Música, voces y transcripción con IA. Qué modelo sirve para qué.",
      category: "Guía",
      excerpt:
        "Canciones, ritmos, locuciones y transcripciones con un solo saldo. Compara los modelos de música, voz y transcripción con precios reales por clip, minuto y hora. Descubre también cuándo vale la pena buscar una alternativa a Suno.",
      readTime: "11 min de lectura",
    },
    videoGenerators: {
      title:
        "Generadores de video con IA comparados: Kling, Seedance, Veo, Wan y más.",
      category: "Guía",
      excerpt:
        "Todos los modelos de video en una sola cuenta. Compara generación desde texto o imagen, fotogramas inicial y final, duración, resolución, sonido y precio real por segundo. Descubre para qué sirve cada modelo y qué límites tiene.",
      readTime: "10 min de lectura",
    },
    compatibleApi: {
      title:
        "Una clave de API para todos los modelos. Formatos OpenAI y Anthropic.",
      category: "Guía para desarrolladores",
      excerpt:
        "Chat Completions de OpenAI, la API Responses y Anthropic Messages en un solo endpoint. Usa tu SDK, Claude Code y Codex CLI con cualquier modelo. Cuánto cuesta y cuándo te conviene ir directo al proveedor o usar OpenRouter.",
      readTime: "11 min de lectura",
    },
    chatgptAlternative: {
      title: "Una alternativa a ChatGPT sin filtros. Tú eliges el nivel.",
      category: "Guía",
      excerpt:
        "Los modelos convencionales conservan sus filtros. Aquí los tienes junto a los modelos abiertos y sin censura. Tú eliges con cada mensaje. Qué cambia, cuánto cuesta y cuándo sigue conviniendo ChatGPT.",
      readTime: "7 min de lectura",
    },
    codingTools: {
      title:
        "Una clave para todos los modelos, también en Codex y Claude Code.",
      category: "Guía para desarrolladores",
      excerpt:
        "Codex CLI, Claude Code, OpenCode, Continue, Aider y Cline con una sola clave de API, incluidos los modelos sin censura. Una URL base, un comando por herramienta y los tropiezos que encontramos.",
      readTime: "8 min de lectura",
    },
    uncensoredGuide: {
      title: "Los modelos sin censura, uno por uno.",
      category: "Guía de modelos",
      excerpt:
        "Dos tipos de modelos sin censura: modelos convencionales sin el reflejo de rechazar preguntas y UncensoredLM, entrenado con libros y documentos prohibidos. Venice, GLM, DeepSeek, Qwen, Gemma, Arya, FreedomGPT y más, con los puntos fuertes y límites de cada uno.",
      readTime: "7 min de lectura",
    },
    modelRefresh: {
      title: "Ya llegaron los modelos nuevos. La oferta sin censura crece.",
      category: "Nuevos modelos",
      excerpt:
        "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 y nuevos modelos abiertos. También NanoGPT, más modelos de Venice y los primeros generadores de imágenes sin censura.",
      readTime: "5 min de lectura",
    },
    whatsNewNovember2026: {
      title:
        "Seis meses de novedades: más rápido, más seguro y en cualquier equipo.",
      category: "Novedades del producto",
      excerpt:
        "El botón Detener ahora sí detiene la respuesta. La voz funciona en iPhone. Tu IA te sigue de un equipo a otro. Puedes alojarla sin Docker. Todo lo nuevo desde mayo.",
      readTime: "6 min de lectura",
    },
    hermesThea: {
      title: "Dos IA. Una conversación. En ambos sentidos.",
      category: "Hermes y Thea",
      excerpt:
        "Hermes en tu equipo y Thea en un servidor. Ahora ambas pueden pasarse una conversación. Y si falta una clave de API, la respuesta ya no se interrumpe.",
      readTime: "6 min de lectura",
    },
    codingAgent: {
      title: "Tu IA abre una terminal y le pasa el trabajo a Claude Code.",
      category: "Agente de programación",
      excerpt:
        "El agente de programación delega cambios reales a Claude Code u OpenCode, en segundo plano o en una terminal que avisa al terminar. Ahora también funciona entre instancias.",
      readTime: "5 min de lectura",
    },
    e2eTests: {
      title:
        "Un robot pulsó todos los botones. Encontró ocho fallos de seguridad.",
      category: "Ingeniería",
      excerpt:
        "Empezamos a probar páginas completas. Un navegador real para cada endpoint que usan los clientes. Así encontramos una redirección abierta, SSRF y filtraciones de datos.",
      readTime: "7 min de lectura",
    },
    whatsNewMay2026: {
      title: "Cortex, Dreamer y Autopilot. Tu IA ya tiene memoria.",
      category: "Novedades del producto",
      excerpt:
        "Memoria persistente, reflexión nocturna y ejecución en segundo plano. También generación multimedia y {{credits}} créditos, un mes gratis, por contarnos qué falla.",
      readTime: "6 min de lectura",
    },
    whatsNewApril2026: {
      title: "123 modelos. Todos los formatos. Un solo compañero.",
      category: "Novedades del producto",
      excerpt:
        "Soporte multimodal en 123 modelos, compañeros de IA con personalidad, un sistema para ganar con habilidades y una revisión de lo que no iba bien. Esto cambió.",
      readTime: "7 min de lectura",
    },
    oneCodebase: {
      title: "Un solo código para 13 plataformas.",
      category: "Arquitectura",
      excerpt:
        "Una definición de endpoint genera a la vez un formulario web, un comando de CLI, una herramienta MCP, una pantalla nativa y una tarea cron. Así funciona.",
      readTime: "12 min de lectura",
    },
    typeChecker: {
      title:
        "Escribí un verificador de tipos que hizo que la IA dejara de mentirme",
      category: "TypeScript",
      excerpt:
        "La IA usa `any` para esquivar un error de tipos. Agrega eslint-disable. Te dice que todo está bien. Así corregimos el ciclo de verificación.",
      readTime: "10 min de lectura",
    },
    tradingBot: {
      title:
        "Mi bot de trading abandonado se convirtió en un motor de monitoreo",
      category: "Vibe Sense",
      excerpt:
        "Abandoné un bot de trading. Años después, su arquitectura se convirtió en la parte más interesante de next-vibe. El flujo está hecho de endpoints.",
      readTime: "14 min de lectura",
    },
    oneEndpoint: {
      title: "Un endpoint para todas las interfaces.",
      category: "Arquitectura",
      excerpt:
        "Escribe un solo definition.ts por función. De ahí salen un formulario web, un comando de CLI, una herramienta MCP, una pantalla nativa y una tarea cron.",
      readTime: "5 min de lectura",
    },
    referralBeginners: {
      title:
        "Nunca he hecho marketing de afiliados. ¿De verdad puedo ganar dinero?",
      category: "Referidos",
      excerpt:
        "Sí, si partes de expectativas realistas. Así funcionan las comisiones recurrentes cuando invitas a alguien por primera vez.",
      readTime: "6 min de lectura",
    },
    referralAffiliatePros: {
      title: "Trabajo con afiliados. ¿Qué cambia con las suscripciones de IA?",
      category: "Referidos",
      excerpt:
        "La base de ingresos empieza más alta y sube con el tiempo. Comisiones mensuales recurrentes de suscriptores que gastan más a medida que crece la plataforma.",
      readTime: "7 min de lectura",
    },
    referralDevelopers: {
      title: "Creaste algo con IA. Gana dinero al compartirlo.",
      category: "Referidos",
      excerpt:
        "Tu enlace de referido puede generar ingresos. Artículos, README y tutoriales: las cuentas para un público técnico.",
      readTime: "5 min de lectura",
    },
    skillSharingEconomy: {
      title: "Crea una habilidad. Comparte el enlace. Gana cada mes.",
      category: "Economía de habilidades",
      excerpt:
        "Una habilidad es una configuración de IA que preparas una vez y compartes donde quieras. El código de referido en el enlace te da un 10% recurrente por cada registro. Así funciona.",
      readTime: "7 min de lectura",
    },
    referralLanding: {
      title:
        "10% directo. +5% cuando alguien comparte tu habilidad. Comisiones recurrentes sin fecha de vencimiento.",
      category: "Referidos",
      excerpt:
        "Cómo funciona el programa de ingresos por referidos y habilidades: niveles de la cadena, porcentajes exactos, opciones de pago y cómo se suma la bonificación por habilidades.",
      readTime: "4 min de lectura",
    },
  },
  cta: {
    title: "Nuevos artículos directamente en tu correo.",
    subtitle:
      "Análisis técnicos y novedades apenas se publican. Solo actualizaciones. Puedes darte de baja con un clic.",
    newsletter: "Suscribirme al boletín",
    subscribedTitle: "Ya estás en la lista.",
    subscribedSubtitle:
      "Recibirás los artículos nuevos el día que salgan. Mientras tanto, explora el framework con el que los hicimos.",
    framework: "Explorar next-vibe",
  },
  labels: {
    readMore: "Leer más",
    allPosts: "Todos los artículos",
    featured: "Destacados",
    relatedGuides: "Guías relacionadas",
    startHere: "Empieza aquí",
  },
  topics: {
    uncensored: {
      title: "IA sin censura",
      intro:
        "Qué modelo sin censura elegir, cómo funciona la ablación y dónde chatear sin filtros ni cuenta.",
    },
    media: {
      title: "Imagen, vídeo y voz",
      intro:
        "Generadores de imagen, vídeo, música y voz comparados, con precio por resultado.",
    },
    developers: {
      title: "API y herramientas de código",
      intro:
        "Llama a modelos sin censura y convencionales desde tu código, tus scripts y tus agentes de programación.",
    },
    updates: {
      title: "Novedades del producto",
      intro: "Lo que salió, mes a mes.",
    },
    engineering: {
      title: "Ingeniería",
      intro:
        "Cómo se construye next-vibe. La arquitectura, los fallos, las soluciones.",
    },
    referral: {
      title: "Referidos y ganancias",
      intro: "Cómo paga el programa de referidos y cómo ganar con skills.",
    },
  },
};
