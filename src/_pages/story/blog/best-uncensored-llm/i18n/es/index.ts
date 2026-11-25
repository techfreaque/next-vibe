import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Mejor LLM sin censura 2026: elegido por tarea | {{appName}}",
    description:
      "El mejor LLM sin censura para razonar, programar, ficción oscura y opiniones contrarias. GLM 5.3 Uncensored frente a DeepSeek V4.1 Flash Uncensored.",
    category: "Guía de modelos",
    imageAlt: "Los mejores LLM sin censura, ordenados por tarea",
    keywords:
      "mejor LLM sin censura, mejor IA sin censura, mejor modelo de IA sin censura, mejor modelo abliterado, LLM sin censura 2026, GLM uncensored vs DeepSeek uncensored, GLM 5.3 uncensored, DeepSeek V4.1 Flash uncensored, mejor modelo sin censura para roleplay, mejor modelo sin censura para programar, ranking de LLM sin censura, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "8 min de lectura",
    title: "El mejor LLM sin censura. Elegido por tarea, no por hype.",
    subtitle:
      "Un ganador por tarea entre {{count}} modelos sin censura activos, más el cara a cara GLM contra DeepSeek. Contexto y precio leídos en directo de nuestro registro de modelos.",
  },
  intro: {
    lead: "Toda lista de los «mejores LLM sin censura» corona un solo modelo. Luego lo pruebas en tu trabajo y resulta que no es el bueno. Un modelo que escribe bien ficción oscura no es el que quieres para programar. El más barato no es el que quieres para un argumento difícil.",
    p2: "Por eso esta lista nombra un ganador por tarea. Cada elección funciona en {{appName}} en una pestaña del navegador, cada cifra sale de nuestro registro y puedes cambiar entre ellos en el mismo chat.",
  },
  method: {
    title: "Cómo elegimos",
    intro:
      "Cuatro preguntas por modelo. Ninguna puntuación de benchmark inventada.",
    answers:
      "¿Responde? Todos los modelos de aquí están en el nivel sin censura: aceptan la pregunta en lugar de sermonearte.",
    base: "¿Qué tan fuerte es la base? Los modelos insignia abliterados conservan la inteligencia de su laboratorio. Los ajustes finos pequeños sacrifican parte de ella a cambio de estilo.",
    context:
      "¿Cuánto recuerda? El contexto decide si aguanta un documento largo o se olvida de la primera página.",
    price:
      "¿Cuánto cuesta? Precio por mensaje de referencia, por la ruta pública más barata, margen incluido.",
    callout:
      "¿Quieres pruebas de que un modelo responde? Nuestro índice de negativas hace las mismas preguntas a todos los modelos y cuenta quién se niega.",
    refusalLink: "El índice de negativas: qué IA responde de verdad",
  },
  picks: {
    title: "Los ganadores, tarea por tarea",
    intro:
      "Un modelo por tarea, ninguno repetido. Si una elección deja de estar disponible, ocupa su lugar el siguiente modelo con el mismo punto fuerte.",
    facts:
      "Contexto de {{context}}. {{price}} por mensaje. Destaca en: {{strengths}}.",
    reasoning: {
      title: "{{number}}. El mejor para razonar y analizar: {{model}}",
      body: "Un modelo base insignia al que se le quitaron las negativas. Úsalo cuando la respuesta exige pensar de verdad: una cuestión polémica argumentada hasta el final, un documento largo desmontado, un plan puesto a prueba.",
    },
    everyday: {
      title: "{{number}}. El mejor para el día a día: {{model}}",
      body: "Rápido, barato y con una memoria enorme. El modelo que dejas seleccionado para preguntas normales, borradores rápidos y chats largos que en un modelo insignia saldrían demasiado caros.",
    },
    coding: {
      title: "{{number}}. El mejor para programar: {{model}}",
      body: "Marcado para código y razonamiento, sin las negativas que bloquean la investigación de seguridad, el scraping o las preguntas de ingeniería inversa que los asistentes convencionales esquivan.",
    },
    fiction: {
      title: "{{number}}. El mejor para roleplay y ficción oscura: {{model}}",
      body: "Ajustado para roleplay, también el oscuro. Se mantiene en el personaje, escribe la escena violenta o explícita y no rompe la historia para moralizar.",
    },
    viewpoint: {
      title: "{{number}}. El mejor para opiniones contrarias: {{model}}",
      body: "La única elección de esta lista que no es un modelo convencional desbloqueado. Entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. Pregúntale lo que los demás no dirán y comprueba sus datos.",
    },
    vision: {
      title: "{{number}}. El mejor para imágenes: {{model}}",
      body: "Lee las imágenes que subes y responde sobre ellas sin las negativas de siempre. Lo bastante barato para pasarle cada captura de pantalla.",
    },
  },
  versus: {
    title: "{{a}} vs {{b}}",
    intro:
      "Los dos modelos insignia abliterados que más se comparan. Misma idea, negativas eliminadas, puntos fuertes distintos.",
    glm: "{{model}}: la versión abliterada de GLM-5.3. Elígela cuando la respuesta necesita profundidad: razonamiento, análisis, código.",
    deepseek:
      "{{model}}: la versión abliterada de DeepSeek V4.1 Flash. Un modelo Flash: más barato por mensaje, rápido y marcado también para roleplay. Elígelo para volumen.",
    verdict:
      "Versión corta: el trabajo de pensar para GLM, el volumen y el roleplay para DeepSeek. Los dos responden. Cambia a mitad del chat y compáralos con tu propia pregunta.",
    compareLink: "Comparativa completa: {{a}} vs {{b}}",
  },
  all: {
    title: "Los {{count}} modelos sin censura, del más barato al más caro",
    intro:
      "Todo el nivel sin censura de {{appName}} ahora mismo. Haz clic en un modelo para ver su página o abre un chat con él.",
    footnote:
      "Por mensaje significa un intercambio de referencia por la ruta más barata. Los chats largos y las respuestas largas cuestan más. Los puntos fuertes son etiquetas del registro.",
  },
  table: {
    model: "Modelo",
    context: "Contexto",
    strengths: "Destaca en",
    price: "Por mensaje",
    chat: "Pruébalo",
    chatLink: "Chatea con {{model}}",
  },
  kinds: {
    title: "Dos tipos de sin censura. Sabe cuál eliges.",
    intro: "La etiqueta esconde una diferencia real.",
    abliterated:
      "Versiones abliteradas y ajustadas: modelos convencionales o abiertos, ligeramente modificados para que dejen de esquivar preguntas. Mismo entrenamiento, misma visión del mundo. Solo responden.",
    own: "{{ownModel}}: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias.",
    explainerLink:
      "Qué es la abliteración y en qué se diferencia de otros métodos",
    tourLink: "Cada modelo sin censura, uno por uno",
  },
  local: {
    title: "¿En local o alojado?",
    intro:
      "La mayoría de los rankings dan por hecho que ejecutas el modelo tú mismo. Es una opción.",
    local:
      "En local: privacidad total y sin precio por mensaje, pero los modelos grandes necesitan más memoria de GPU de la que tiene cualquier PC doméstico.",
    hosted:
      "Alojado: todos los modelos de esta página en el navegador, incluidos los de tamaño frontera. El proveedor ve tu prompt.",
    api: "API: los mismos modelos a través de endpoints compatibles con OpenAI y Anthropic. Las claves API se desbloquean con cualquier compra.",
    noGpuLink: "Un LLM sin censura en línea, sin GPU",
    apiLink: "API de LLM sin censura: IDs de modelos, precios, código",
  },
  pairs: {
    title: "Más cara a cara",
    intro:
      "Visión propia contra abliterado, y modelos base contra sus versiones sin censura.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es el mejor LLM sin censura en general?",
      a: "Para la mayoría de las preguntas difíciles, {{topModel}}: un modelo base insignia al que se le quitaron las negativas. Para opiniones contrarias, {{ownModel}}. Para volumen barato, una versión Flash. En {{appName}} cambias entre los {{count}} en el mismo chat.",
    },
    free: {
      q: "¿Cuál es el mejor LLM sin censura gratis?",
      a: "En línea, {{appName}} te da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratuita. El modelo sin censura más barato, {{cheapestModel}}, cuesta {{cheapestPrice}} por mensaje. Los modelos sin censura piden una confirmación 18+ una sola vez.",
    },
    roleplay: {
      q: "¿Cuál es el mejor modelo sin censura para roleplay?",
      a: "Un modelo ajustado para roleplay oscuro: se mantiene en el personaje y escribe las escenas duras. Para personajes políticos o tabú, {{ownModel}} aporta una visión del mundo que los modelos convencionales no tienen.",
    },
    coding: {
      q: "¿Cuál es el mejor modelo sin censura para programar?",
      a: "Una versión abliterada de un buen modelo de código. Conserva la habilidad del modelo base y pierde las negativas que bloquean la investigación de seguridad y otras preguntas que los asistentes convencionales esquivan.",
    },
    quality: {
      q: "¿Los modelos abliterados pierden calidad?",
      a: "Algo, según el método. La abliteración elimina de los pesos la dirección de la negativa. Bien hecha, el modelo conserva casi toda su habilidad. Los ajustes finos pequeños pueden perder más. Compara un modelo base y su versión sin censura lado a lado antes de decidir.",
    },
    api: {
      q: "¿Puedo usar estos modelos sin censura por API?",
      a: "Sí. Todos los modelos de texto de aquí funcionan a través de endpoints compatibles con OpenAI y Anthropic. Las claves API se desbloquean con cualquier compra.",
    },
    writerLink: "La mejor IA sin censura para escritores de ficción",
    directoryLink: "Todos los modelos abliterados, alojados",
    platformsLink: "Plataformas de IA sin censura comparadas",
  },
  cta: {
    title: "Basta de rankings. Haz la pregunta de verdad.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza con el ganador y cambia cuando quieras.",
    start: "Chatea con {{topModel}}",
    models: "Comparar todos los modelos",
  },
};
