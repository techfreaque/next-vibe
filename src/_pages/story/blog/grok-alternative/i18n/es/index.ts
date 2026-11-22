import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternativas a Grok: menos filtro que Grok, mismo chat | {{appName}}",
    description:
      "¿Grok es sin censura? No del todo. Qué tan sin filtro es Grok de verdad, las mejores alternativas según lo que buscas y cómo usar Grok junto a modelos abliterated en un mismo chat. Precios en vivo.",
    category: "Comparativa",
    imageAlt: "Grok junto a alternativas sin censura",
    keywords:
      "alternativa a Grok, alternativas a Grok, Grok sin censura, Grok tiene censura, Grok sin cuenta de X, Grok contra IA sin censura, páginas como Grok, Grok Imagine, IA sin filtros, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "7 min de lectura",
    title: "Alternativas a Grok. Cuando el descaro no alcanza.",
    subtitle:
      "Qué tan sin filtro es Grok de verdad, {{count}} alternativas sin capa de rechazos y el propio Grok en el mismo chat.",
  },
  intro: {
    lead: "Grok se vende como la IA que dice lo que las demás callan. Al lado de ChatGPT y Claude, muchas veces es cierto. Aun así es un modelo corporativo con reglas que su dueño puede cambiar de la noche a la mañana.",
    p2: "Aquí: qué hace Grok y qué no, las alternativas según lo que de verdad quieres y cómo quedarte con {{grokName}} y sumar modelos sin rechazos, en un mismo hilo. {{appName}} ejecuta {{grokName}} junto a {{uncensored}} modelos sin censura.",
  },
  honest: {
    title: "¿Qué tan sin filtro es Grok de verdad?",
    intro: "Más suelto que los dos grandes. No sin censura.",
    looser:
      "Más suelto. Grok entra en chistes, opiniones afiladas y temas ásperos que los chatbots comerciales esquivan o envuelven en advertencias.",
    filtered:
      "Sigue filtrado. xAI mantiene una política de uso y entrenamiento de seguridad. Algunas peticiones se siguen rechazando, suavizando o desviando.",
    shifts:
      "Blanco móvil. xAI reajusta el comportamiento y el prompt de sistema de Grok a menudo y en público. Lo que funcionaba el mes pasado puede no funcionar hoy.",
    catalog:
      "Nuestro catálogo coloca {{grokName}} en el nivel {{grokTier}}: menos rechazos que los modelos comerciales, pero con una política detrás.",
    callout:
      "Un modelo corporativo más suelto sigue siendo un modelo corporativo. Sus límites los pone una sola empresa, y se mueven.",
  },
  why: {
    title: "Por qué la gente busca una alternativa a Grok",
    intro: "Tres motivos salen una y otra vez.",
    policy:
      "Las reglas. El filo de Grok depende de los ajustes actuales de xAI. Quien necesita un comportamiento estable quiere un modelo al que le quitaron los rechazos de los pesos, no que los aflojaron con un prompt.",
    account:
      "La cuenta. Las apps de Grok viven dentro del ecosistema de X y xAI. No todo el mundo quiere atar sus chats a esa cuenta.",
    voice:
      "Una sola voz. Grok tiene personalidad. Genial para el ida y vuelta, mala para una respuesta técnica fría, el villano de una novela o una opinión que le enseñaron a evitar.",
  },
  alternatives: {
    title: "{{count}} alternativas a Grok, según lo que buscas",
    intro:
      "Todas funcionan en el mismo chat que Grok. Precios por mensaje de referencia, en vivo desde nuestro catálogo.",
    edge: {
      title: "Más filo, mismo cerebro: {{model}}",
      body: "Un modelo comercial ligeramente modificado para que deje de esquivar preguntas: abliterated. Fuerte en razonamiento y código, responde donde Grok se niega. {{price}} por mensaje.",
    },
    reasoning: {
      title: "Razonamiento pesado, sin sermones: {{model}}",
      body: "El Kimi insignia de Moonshot AI, abliterated. Respuestas largas y cuidadosas para problemas difíciles, sin rechazos. {{price}} por mensaje.",
    },
    cheap: {
      title: "Rápido y barato: {{model}}",
      body: "DeepSeek sin rechazos. Ágil, bueno en código y análisis, cuesta casi nada. {{price}} por mensaje.",
    },
    contrary: {
      title: "Llevar la contraria a propósito: {{model}}",
      body: "{{model}} está entrenado con libros y documentos prohibidos en el internet mainstream, lo que da como resultado un modelo con opiniones políticas contrarias. No está ajustado para hacerse el rebelde. Está hecho para discrepar. {{price}} por mensaje.",
    },
    roleplay: {
      title: "Personajes y ficción oscura: {{model}}",
      body: "Afinado para rol. Se mantiene en el personaje, aguanta escenas oscuras y no rompe la cuarta pared para avisarte. {{price}} por mensaje.",
    },
    chatLink: "Chatear con {{model}}",
    directoryLink: "Todos los modelos abliterated, con contexto y precio",
  },
  models: {
    title: "Grok y las alternativas, lado a lado",
    intro:
      "Bajo cada nombre: nivel de contenido o método para quitar la censura.",
    colModel: "Modelo",
    colContext: "Contexto",
    colStrengths: "Destaca en",
    colPrice: "Por mensaje",
    colChat: "Pruébalo",
    chatLink: "Chatear con {{model}}",
    footnote:
      "Precio de un mensaje de referencia, con nuestro margen del {{markup}} % incluido.",
  },
  keep: {
    title: "Quédate con Grok. Suma el resto.",
    intro:
      "No tienes que elegir. {{grokName}} y los modelos sin censura comparten un chat y un saldo.",
    steps: {
      ask: {
        title: "Empieza con Grok",
        body: "Abre un chat con {{grokName}}. Ida y vuelta, opiniones sobre noticias, respuestas rápidas.",
      },
      switch: {
        title: "Cambia cuando se escabulla",
        body: "Elige un modelo sin censura para el siguiente mensaje. Toda la conversación viaja con él, así que responde en contexto.",
      },
      compare: {
        title: "Compara con el mismo prompt",
        body: "Manda un prompt a los dos y lee las respuestas lado a lado. Las páginas de comparación de abajo muestran los datos.",
      },
    },
    compareLink: "{{a}} contra {{b}}",
  },
  imagine: {
    title: "Grok Imagine también funciona aquí",
    intro:
      "{{imagineNames}}: los modelos de imagen y vídeo de xAI, con los mismos créditos. Sin cuenta de X.",
    link: "Crear con {{model}}",
  },
  faq: {
    title: "Preguntas frecuentes",
    uncensored: {
      q: "¿Grok es sin censura?",
      a: "No. Grok es más suelto que ChatGPT o Claude, pero xAI mantiene una política de uso y entrenamiento de seguridad, y cambia su comportamiento a menudo. En los modelos sin censura, el comportamiento de rechazo se quitó de los pesos.",
    },
    best: {
      q: "¿Cuál es la mejor alternativa a Grok?",
      a: "Depende de la tarea. Misma inteligencia con menos rechazos: un modelo abliterated como {{firstName}}. Opiniones contra el mainstream: {{ownModel}}. Rol: un modelo afinado para rol. En {{appName}} todos funcionan junto a Grok en un mismo chat.",
    },
    account: {
      q: "¿Puedo usar Grok sin cuenta de X?",
      a: "Sí, aquí sí. {{grokName}} funciona en el chat de incógnito de {{appName}}, sin ninguna cuenta. Para empezar tienes {{guestCredits}} créditos gratis al mes.",
    },
    price: {
      q: "¿Cuánto cuesta Grok aquí?",
      a: "Sin suscripción aparte. Pagas por mensaje desde un único saldo de créditos. Un mensaje de referencia con {{grokName}} cuesta {{grokPrice}}.",
    },
    api: {
      q: "¿Puedo usar Grok y modelos sin censura con una sola API?",
      a: "Sí. Endpoints compatibles con OpenAI y Anthropic, una clave para Grok, Claude, GPT y los modelos sin censura. Tu primera compra desbloquea las claves de API, los planes empiezan en {{apiSubPrice}} al mes.",
    },
    imagine: {
      q: "¿Puedo crear imágenes y vídeos con Grok Imagine aquí?",
      a: "Sí. {{imagineNames}} funcionan en las páginas de creación y desde cualquier chat, con los mismos créditos.",
    },
    chatLink: "Chat de IA sin censura: elige un modelo y empieza",
    chatgptLink: "Alternativa a ChatGPT sin filtros",
    refusalLink: "Refusal Index: quién responde, quién se niega",
  },
  cta: {
    title: "La actitud de Grok fue el comienzo. No el límite.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza con {{firstName}}.",
    start: "Empezar un chat sin censura",
    models: "Comparar todos los modelos",
  },
};
