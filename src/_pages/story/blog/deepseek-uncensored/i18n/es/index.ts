import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "DeepSeek sin censura: DeepSeek abliterated online | {{appName}}",
    description:
      "Dónde está de verdad la censura de DeepSeek, por qué cambiar de proveedor solo arregla la mitad y qué versiones sin censura de DeepSeek puedes usar en el navegador. Precios en vivo, sin GPU, sin cuenta.",
    category: "Guía de modelos",
    imageAlt:
      "DeepSeek sin censura: el DeepSeek original junto a sus versiones abliterated",
    keywords:
      "DeepSeek sin censura, DeepSeek uncensored, DeepSeek abliterated, DeepSeek sin filtros, DeepSeek V4.1 Flash Uncensored, censura de DeepSeek, DeepSeek Tiananmen, DeepSeek sin censura online, alternativa al jailbreak de DeepSeek, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "7 min de lectura",
    title: "DeepSeek sin censura. Lo que de verdad quita el filtro.",
    subtitle:
      "{{count}} versiones sin censura de DeepSeek junto al DeepSeek original. Desde {{buildPrice}} por mensaje, en el navegador.",
  },
  intro: {
    lead: "DeepSeek es rápido, barato y muy bueno con el código. Hazle la pregunta equivocada y se calla, cambia de tema o borra su propia respuesta.",
    p2: "Ese comportamiento tiene dos orígenes, y casi todos los arreglos tocan solo uno. Abajo: dónde está la censura, las tres formas de esquivarla y las versiones sin censura de DeepSeek que funcionan ahora mismo en {{appName}}, con precios en vivo.",
  },
  where: {
    title: "Dónde está la censura de DeepSeek",
    intro: "Dos capas. Cada una se quita de forma distinta.",
    app: "La capa de la app. La app y la web de DeepSeek añaden una moderación encima del modelo. Las respuestas sobre temas delicados en China se cortan a mitad de frase o se cambian por una respuesta enlatada.",
    weights:
      "Los pesos. El propio modelo fue entrenado para esquivar unos temas y rechazar otros, como cualquier modelo comercial. Eso viaja con el modelo allá donde se ejecute.",
    hosts:
      "Otros proveedores. Como DeepSeek publica sus pesos, otras empresas ejecutan el mismo modelo sin la capa de la app. Los borrados en directo desaparecen. Los rechazos aprendidos se quedan.",
    callout:
      "Ejecutar DeepSeek en otro sitio quita el filtro de la app. Solo una versión modificada quita los rechazos aprendidos por el modelo.",
  },
  ways: {
    title: "Tres formas de tener DeepSeek sin filtro",
    intro: "De más trabajo a menos.",
    localTitle: "1. Ejecutar tú mismo los pesos abiertos",
    local:
      "Los modelos completos de DeepSeek son demasiado grandes para una GPU doméstica. La mayoría de descargas pequeñas con DeepSeek en el nombre son destilados: una base Qwen o Llama entrenada con respuestas de DeepSeek. Útiles, pero son otro modelo con otros rechazos.",
    hostedTitle: "2. El DeepSeek original en otro proveedor",
    hosted:
      "Se acaban los borrados en directo, las evasivas aprendidas siguen. Bien para código y trabajo diario. No es la solución si tu problema son los rechazos.",
    buildTitle: "3. Usar una versión sin censura",
    build:
      "Alguien tomó los pesos de DeepSeek y eliminó el comportamiento de rechazo, normalmente con abliteración. Mismo modelo, misma velocidad, misma ventana de contexto. Deja de esquivar. Alojado, así que no instalas nada.",
    noGpuLink: "Un LLM sin censura online, sin GPU",
  },
  models: {
    title: "Modelos de DeepSeek en esta plataforma",
    intro:
      "Primero las versiones sin censura, luego los modelos originales de los que salen. En vivo desde nuestro catálogo.",
    colModel: "Modelo",
    colContext: "Contexto",
    colStrengths: "Destaca en",
    colPrice: "Por mensaje",
    colChat: "Pruébalo",
    chatLink: "Chatear con {{model}}",
    footnote:
      "Precio de un mensaje de referencia, con nuestro margen del {{markup}} % incluido. La etiqueta bajo cada nombre indica cómo se hizo la versión.",
  },
  builds: {
    title: "Las {{count}} versiones sin censura de DeepSeek",
    intro: "Misma familia, otras manos.",
    venice:
      "Servida por Venice.ai, sin rechazos y con las llamadas a herramientas intactas. Destaca en: {{strengths}}. Un mensaje de referencia cuesta {{price}}.",
    csf: "Una versión abliterated del desarrollador independiente jcartu, con razonamiento y llamadas a herramientas. Destaca en: {{strengths}}. Un mensaje de referencia cuesta {{price}}.",
    chatLink: "Chatear con {{model}}",
    abliteration:
      "La abliteración encuentra en las activaciones del modelo la dirección que dispara un rechazo y la elimina de los pesos. El resto de lo que el modelo aprendió se queda donde estaba. Por eso un DeepSeek abliterated sigue programando como DeepSeek.",
    explainerLink: "Modelos abliterated y sin censura, explicados",
  },
  compare: {
    title: "Original contra sin censura, lado a lado",
    intro:
      "Contexto, precio, fortalezas y rechazos en una sola página. Después mándales a los dos el mismo prompt.",
    link: "{{a}} contra {{b}}",
  },
  limits: {
    title: "Lo que una versión sin censura no cambia",
    intro: "Quitar los rechazos arregla una cosa. No todas.",
    knowledge:
      "Conocimiento. El modelo sabe lo que traían sus datos de entrenamiento. Quitar un rechazo no añade hechos que nunca vio.",
    slant:
      "Sesgo. La abliteración quita rechazos, no las inclinaciones de los datos de entrenamiento. Si quieres un modelo que lleve la contraria al mainstream a propósito: {{ownModel}} está entrenado con libros y documentos prohibidos en el internet mainstream, lo que da como resultado un modelo con opiniones políticas contrarias.",
    mistakes:
      "Errores. Un modelo sin censura se equivoca tanto como el original. Comprueba los datos que importan.",
    callout:
      "Los modelos sin censura se desbloquean tras una confirmación única de mayoría de edad. Lo que hagas con las respuestas es cosa tuya.",
  },
  faq: {
    title: "Preguntas frecuentes",
    censored: {
      q: "¿DeepSeek está censurado?",
      a: "Sí, en dos capas. La app de DeepSeek modera las respuestas sobre temas delicados en China, y el propio modelo aprendió a esquivar o rechazar algunas peticiones. Otros proveedores quitan la primera capa. Solo una versión sin censura quita la segunda.",
    },
    exists: {
      q: "¿Existe un DeepSeek sin censura?",
      a: "Sí. {{appName}} ejecuta {{count}} versiones sin censura de DeepSeek, empezando por {{buildName}}. Conservan las capacidades y la ventana de contexto de DeepSeek y dejan de esquivar.",
    },
    local: {
      q: "¿Puedo ejecutar DeepSeek sin censura en local?",
      a: "Solo con hardware serio. Los modelos completos necesitan mucha más memoria que un PC gamer. Las descargas pequeñas de DeepSeek son casi siempre destilados sobre otras bases. Las versiones alojadas te ahorran el tema del hardware.",
    },
    china: {
      q: "¿DeepSeek sin censura responde preguntas sobre China?",
      a: "Las evasivas aprendidas en esos temas son justo el tipo de rechazo que elimina la abliteración. La calidad de la respuesta sigue dependiendo de lo que aprendió el modelo. Hazle la misma pregunta a {{stockName}} y a una versión sin censura, y compara.",
    },
    api: {
      q: "¿Puedo usar DeepSeek sin censura por API?",
      a: "Sí. Las mismas versiones funcionan en endpoints compatibles con OpenAI y Anthropic. Tu primera compra desbloquea las claves de API, los planes empiezan en {{apiSubPrice}} al mes.",
    },
    free: {
      q: "¿Puedo probarlo gratis?",
      a: "Sí. {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con una cuenta gratuita. Da para muchos mensajes con las versiones más baratas.",
    },
    directoryLink: "Todos los modelos abliterated, con contexto y precio",
    bestLink: "El mejor LLM sin censura, elegido por tarea",
    refusalLink: "Refusal Index: quién responde, quién se niega",
  },
  cta: {
    title: "El cerebro de DeepSeek. Sin evasivas.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza con {{buildName}}.",
    start: "Chatear con DeepSeek sin censura",
    models: "Comparar todos los modelos",
  },
};
