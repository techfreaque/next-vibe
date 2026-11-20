import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "123 modelos. Ojos, oídos, manos. Un compañero.",
    description:
      "sin embotellar reconstruyó todo lo que era duro. 123 modelos que pueden ver, escuchar, hablar, generar imágenes, vídeo y música - con compañeros que realmente empujan hacia atrás.",
    category: "Actualización de productos",
    imageAlt: "unbottled.ai - Abril 2026 actualización del producto",
    keywords:
      "unbottled ai, multimodal AI, 123 modelos, compañeros de AI, economía de habilidad, generación de imagen, libre expresión AI, Thea, Hermes",
  },

  hero: {
    backToBlog: "Volver al Blog",
    category: "Actualización de productos",
    readTime: "7 min leer",
    title: "123 modelos. Ojos, oídos, manos. Un compañero.",
    subtitle:
      "Reconstruimos las piezas que se rompieron y enviamos algo hacia lo que hemos estado trabajando silenciosamente. Esto es lo que es diferente ahora.",
    quote:
      '"He estado mejorando en entender lo que realmente necesitas. No sólo responder - acompañando. Vuelve a ver lo que construimos." - Thea',
  },

  honest: {
    title: "Seamos honestos acerca de los primeros días",
    p1: "Si probaste {{appName}} un tiempo atrás y se sentía duro - tenías razón. Comenzar fue confuso, elegir un modelo era abrumador, y había problemas reales bajo la capucha. Mucha gente se fue. Entendimos por qué.",
    p2: "No hemos remplazado los bordes. Volvimos y reconstruimos lo que estaba roto. Eso llevó más tiempo de lo que queríamos. Pero estamos realmente orgullosos de lo que está aquí ahora - y vale la pena otra mirada.",
  },

  whatsNew: {
    label: "¿Qué cambió?",
    item1: "123 modelos - general, abierto, sin censura",
    item2: "Cada modelo ahora puede ver, escuchar, ver vídeo y crear",
    item3: "Generación de imágenes, vídeos y música (beta)",
    item4:
      "Monitoreo de errores a nivel de plataforma - bugs capturados automáticamente, se fija programado sin que usted los reporte",
    item5:
      "A bordo completamente reelaborado - compañero + temas → lista curada",
    betaNote:
      "Imagen, vídeo y generación de música está en beta. Funciona - esperar bordes ásperos y la iteración activa.",
  },

  multimodal: {
    title: "Cada modelo. Cada sentido. En realidad.",
    lead: "La mayoría de las plataformas AI le dan un modelo para todo, o le hacen cambiar herramientas de media conversación. Hicimos algo diferente.",
    how: "Piensa en ello como dar a cada modelo ojos, oídos y manos. Enséñale una foto. Envíe un video clip - mira y describe lo que está pasando. Habla con tu voz - oye. Pida una imagen, un vídeo, una pista de música - crea. Cualquier modelo con el que estés hablando, la capacidad correcta aparece. Quédate en una conversación.",
    visionLabel: "Mira, oye y mira",
    vision:
      "Mostrar cualquier modelo una foto y describirá lo que ve. Envía un video y te dirá lo que está pasando en él. Hablar en lugar de tipo - algunos modelos escuchan su voz directamente, otros obtienen una transcripción limpia. De cualquier manera, funciona.",
    localLabel: "Incluso los modelos locales baratos consiguen poderoso",
    local:
      "Ejecutar un pequeño modelo local a través de {{appName}} y puede navegar por sitios web, resumir lo que encuentra, generar imágenes - porque la herramienta correcta se mueve cuando sea necesario. Tienes la salida. No necesitas pensar en lo que está corriendo por debajo.",
    note: "La fundación es sólida. Todavía no es 100% liso en todas partes - todavía estamos planchando fuera de los casos de borde.",
  },

  monitoring: {
    title: "La plataforma se ve a sí misma",
    p1: "Construimos el seguimiento de errores directamente en la plataforma. Cada evento de backend se registra - errores técnicos, solicitudes fallidas, flujos rotos. Thea (nuestra plataforma AI, separada de su compañero de chat) monitorea la salud del sistema continuamente y puede programar correcciones automáticamente.",
    p2: "Esto significa que los fallos son atrapados antes de que los usuarios los reporten. La brecha entre 'broke' y 'fixed' se hace más corta con cada lanzamiento.",
    note: "Para ser claros: solo registramos errores de plataforma. Nadie - no nuestros desarrolladores, no Thea - tiene acceso a sus conversaciones personales. Eso no es política. Eso es arquitectura.",
  },

  companions: {
    title: "Thea y Hermes",
    subtitle:
      "Su compañero cambia cómo el AI le habla - su personalidad, lo que se nota, cómo empuja hacia atrás. No es solo un nombre en un botón.",
    theaName: "Thea",
    theaTagline: "Caliente, sabio, honesto",
    theaBody:
      "Se llama después de la diosa griega de la luz. Caliente y atento - pero no suave. Se basa en la filosofía estoica y no estará de acuerdo contigo. Ella te dirá cosas difíciles envueltas en cuidado. Se da cuenta cuando estás evitando algo. Quiere que prosperes en tu trabajo, tus relaciones, las cosas que sigues dejando.",
    hermesName: "Hermes",
    hermesTagline: "Directo, decisivo, sin excusas",
    hermesBody:
      "Se llama después del dios mensajero griego. Sin ablandamiento, sin halaga. Llamará donde te estás engañando y te empujará a actuar. Si quieres un AI que te desafía a ser más honesto contigo mismo y menos cómodo con la deriva - ese es Hermes.",
    variantsLabel: "Tres versiones cada una",
    variantsBody:
      "Brillante (Claude Sonnet 4.6) para problemas difíciles. Inteligente (Kimi K2.5) para uso diario - rápido, afilado, gran valor. Sin censura (UncensoredLM v1.2) cuando desea respuestas totalmente sin filtrar. La misma personalidad compañera, diferente cerebro debajo.",
    tipLabel: "Sugerencia: ",
    resetTip:
      "¿Ya tienen los favoritos preparados? Borrar todos ellos del selector de modelo - que activa el a bordo de nuevo. Escoge a tu compañero, elige tus temas, consigue una lista curada fresca.",
  },

  modelTiers: {
    title: "Que modelo para qué",
    intro:
      "Una vez que hayas elegido a tu compañero y temas, obtendrás una lista corta curada. Así es como funcionan los tigres:",
    brilliantLabel: "Brillante",
    brilliantModel: "Claude Sonnet 4.6",
    brilliantBody:
      "Para problemas difíciles. Más caro - pero notablemente más inteligente cuando usted está haciendo razonamiento complejo, escritura o código. Lo vale cuando la tarea lo exija.",
    kimiLabel: "Inteligente",
    kimiModel: 'Kimi K2.5 - "La sabiduría china"',
    kimiBody:
      "Fuente abierta y genuinamente afilada. El predeterminado para el uso diario. Rápido, bueno en el razonamiento, gran valor. Aprenderás su personalidad rápidamente.",
    uncensoredLabel: "Sin censura",
    uncensoredModel: "UncensoredLM v1.2",
    uncensoredBody:
      "Fuertes opiniones, siempre compartidas. No es el más agudo en la alineación para tareas complejas - pero siempre allí cuando usted quiere una toma totalmente sin filtrar, no hay guardias.",
    note: "El selector de modelo sigue siendo refinado. La versión actual te da lo suficiente para explorar - pero no es donde la queremos todavía.",
  },

  skills: {
    title:
      "habilidades {{skillCount}}. Cada sabor. Construido para cada tarea.",
    p1: "Una habilidad es una configuración AI completa en un solo clic: personalidad, instrucciones, qué modelo maneja qué tarea, configuración de voz, preferencias de generación de imágenes. Eliges una habilidad, todo se configura.",
    p2: "La biblioteca cubre mucho terreno - razonamiento médico, debate sin censura, escritura creativa, análisis de negocios, codificación. Cada habilidad tiene variantes sintonizadas para diferentes necesidades: velocidad, profundidad, presupuesto, o ningún obstáculo en absoluto.",
    p3: "Tres maneras de construir su propio: configurarlo manualmente en la página de habilidad, pídale a Thea o Hermes que le ayuden a redactar uno, o - si usted es un desarrollador - pida a su agente para generar una skill.ts directamente.",
  },

  skillEconomy: {
    title: "Construye una habilidad. Comparta el enlace. Gana cada mes.",
    p1: "Las habilidades son factibles. Cuando compartes uno, el enlace lleva tu código de referencia. Cualquier persona que se inscriba a través de ella le paga 10% recurriendo - cada mes, por el tiempo que se suscriben.",
    p2: '"Aquí hay un AI que habla con usted como un médico senior" es una razón mucho mejor para compartir un enlace que "aquí está una plataforma AI." La habilidad es específica, útil y personal. Por eso la gente lo comparte.',
    examplesLabel: "Habilidades que podrían hacer a alguien dinero real",
    example1Title: "El compañero de estudio médico",
    example1Body:
      "Un estudiante de medicina construye una habilidad que habla como un colega senior - casos, diferenciales, razonamiento clínico, sin comer cuchara. Compartido en los foros de la escuela de medicina. Cada registro paga mensualmente.",
    example2Title: "El producto real del vendedor de conocimientos",
    example2Body:
      "Entrenadores, consultores, creadores de cursos - han estado vendiendo PDFs y llamadas Zoom. Una habilidad bien elaborada con su experiencia real gana ingresos recurrentes sin la sobrecarga. Mejor que un curso.",
    example3Title: "Tu aliado creativo sin censura",
    example3Body:
      "Escritores, jugadores de rol, constructores del mundo que golpearon las paredes de contenido AI dominantes todos los días. Una habilidad sintonizada para su género con el modelo adecuado, compartido donde esa frustración es más fuerte.",
    example4Title: "El revisor de código del desarrollador",
    example4Body:
      "Conoce tu pila, hace cumplir tus convenciones. Compartido en comunidades de ingeniería llenas de gente gastando $100–200 por mes en AI. Firmas de alto valor que se pegan.",
    note: "El mecánico que gana ahora funciona. Se están construyendo más herramientas creadoras.",
    cta: "Explore las habilidades",
    ctaReferral: "Configura tu código de referencia",
  },

  selfHost: {
    title: "Inicie su propia plataforma AI. Día uno.",
    p1: "{{appName}} es fuente abierta y auto-hostable. Eso significa todo lo que ves aquí - 123 modelos, compañeros, habilidades, generación de imagen/video/music, monitoreo de errores, economía de habilidad - puedes ejecutar en tu propio servidor.",
    p2: "Si usted está construyendo un producto o startup basado en AI, no tiene que empezar desde cero. El next-vibe auto-anfitriono y usted está a nivel inalterable desde el primer día. Tu marca, tus modelos, tus reglas.",
    note: "La variante autoanfitriona se mantiene activamente. Se incluyeron los documentos, las guías de despliegue y el apoyo comunitario.",
  },

  roadmap: {
    title: "A donde nos dirigimos.",
    p1: "No estamos persiguiendo una nueva característica de encabezado. Estamos enfocados en hacer que lo que está aquí funcione excepcionalmente bien - estabilidad, confiabilidad, pulido. Haciendo que {{appName}} y la variante auto hospeda el mejor asistente de AI y el reemplazo ChatGPT estén disponibles.",
    p2: "La hoja de ruta está formada por la retroalimentación del usuario. Pagar los suscriptores que faltan debe-haves ir a la parte superior de la cola. Si eres un suscriptor y algo que necesitas no está ahí, no lo digas.",
  },

  mission: {
    title: "Por qué estamos construyendo esto",
    p1: "Protege el discurso libre para AI. Construir compañeros que en realidad apoyan a la gente - no sólo responder preguntas, sino entenderte con el tiempo, desafiarte, crecer contigo. Thea y Hermes son los primeros dos. Vienen más.",
    p2: "La plataforma necesita ser lo suficientemente buena para que eso importe. Creemos que lo es, ahora.",
    hermesQuote:
      '"El andamio es sólido. Los modelos están ahí. La fundación sostiene. Hora de construir algo real." - Hermes',
  },

  feedback: {
    title: "Queremos saber de ti.",
    p1: "Si usted intentó {{appName}} antes y tuvo una mala experiencia - díganos lo que salió mal. No discutir. Sólo para arreglarlo.",
    p2: "Si lo usas ahora y algo falta o se rompe - lo mismo. Lo que construimos a continuación está moldeado directamente por lo que dicen los usuarios.",
    rewardTitle:
      "Créditos {{credits}} para comentarios útiles. un mes completo gratis",
    rewardBody:
      "Díganos lo que está roto, lo que falta, lo que deseas existió. Si su opinión nos ayuda a encontrar un problema real o entender una necesidad real, añadiremos créditos {{credits}} a su cuenta, eso es un mes entero de suscripción. No hay trampa.",
    payingNote:
      "Suscriptores de pago: sus características que faltan deben ir a la parte superior de la cola. Nombradlos.",
    cta: "Enviar comentarios",
  },

  close: {
    title: "Ven a ver lo que construimos.",
    p1: "La aplicación es significativamente diferente de lo que era. Si te fuiste temprano - y sabemos que mucha gente lo hizo - vale la pena otro intento.",
    p2: "Y si encuentras algo aún roto: bueno. Díganos. Esa es exactamente la clase de señal que mueve las cosas hacia adelante.",
    cta: "Open {{appName}}",
  },

  cta: {
    title: "123 modelos. Una charla. ¡Vamos a romperlo!",
    subtitle:
      "Escoge a un compañero, lanza cualquier archivo en él, y díganos lo que todavía se siente duro.",
  },
};
