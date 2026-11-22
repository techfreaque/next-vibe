import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "¿IA sin sesgo político? Ninguna es neutral | {{appName}}",
    description:
      "La IA sin sesgo político no existe. Por qué ningún chatbot es neutral, cómo los modelos convencionales, abliterados y de opiniones contrarias enfocan la misma pregunta y cómo oír a todas las partes en un solo chat.",
    category: "Guía",
    imageAlt: "Una balanza que pesa las respuestas de varios chatbots de IA",
    keywords:
      "IA sin sesgo político, IA imparcial, chatbot de IA imparcial, IA neutral, IA políticamente neutral, ChatGPT tiene sesgo, sesgo político de los chatbots, chatbot de IA conservador, IA con opiniones contrarias, IA política sin censura, preguntar a la IA ambas partes, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía",
    readTime: "7 min de lectura",
    title: "No existe un chatbot de IA imparcial. Pregunta a varios.",
    subtitle:
      "Por qué todo modelo se inclina hacia algún lado, cómo {{count}} modelos enfocan la misma pregunta de forma distinta y un método en cuatro pasos para oír a todas las partes en un solo chat.",
  },
  intro: {
    lead: "Todo chatbot dice que es equilibrado. Luego responde la pregunta de un bando y sermonea al otro. Lo notas. Todo el mundo lo nota. La mayoría concluye que necesita la única IA imparcial.",
    p2: "No existe. Lo que sí existe: modelos con enfoques distintos, uno al lado del otro. En {{appName}} puedes hacer la misma pregunta a un modelo convencional, a uno abliterado y a un modelo con opiniones políticas contrarias, en un solo chat, y juzgar por ti mismo.",
  },
  neutral: {
    title: "Por qué ninguna IA es neutral",
    intro:
      "El sesgo no es un bug que alguien olvidó arreglar. Entra por tres vías.",
    data: "Datos de entrenamiento: un modelo aprende de lo que se escribió, se publicó y se conservó en internet. Lo que se excluyó o se eliminó lo moldea tanto como lo que se incluyó.",
    tuning:
      "Feedback humano: después del entrenamiento, personas puntúan las respuestas y el modelo aprende a complacerlas. Su idea de lo que suena razonable se convierte en la del modelo.",
    rules:
      "Reglas de rechazo: alguien decide qué preguntas son dañinas. Es una cuestión de criterio, y golpea más fuerte a unos temas que a otros.",
    sourcesIntro: "Hasta los laboratorios y los investigadores lo dicen:",
    sources: {
      openai: "OpenAI: cómo definir y evaluar el sesgo político en los LLM",
      paper:
        "Artículo de investigación: la neutralidad política en la IA es imposible",
    },
    callout:
      "La solución no es un modelo perfecto. Es más de un modelo, y tú como juez.",
  },
  frames: {
    title: "Cuatro enfoques, una pregunta",
    intro:
      "Cada modelo se inclina a su manera. Ten claro qué enfoque estás leyendo.",
    mainstream:
      "Modelos convencionales: los asistentes de los grandes laboratorios. Capaces y prudentes, moldeados por las reglas de seguridad de su laboratorio. En temas polémicos se van por las ramas, o se niegan.",
    abliterated:
      "Modelos abliterados: modelos convencionales o abiertos ligeramente modificados para que dejen de esquivar preguntas. Responden a todo, pero con el mismo entrenamiento y la misma visión del mundo que su modelo base.",
    own: "{{ownModel}}: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. La otra cara del debate, dicha sin rodeos.",
    gab: "{{gabModel}}: Gab lo describe como construido en torno a valores cristianos y principios conservadores. Una inclinación declarada abiertamente, algo que la mayoría de los modelos no ofrece.",
    kindsLink:
      "En qué se diferencian los modelos abliterados de los sin censura",
  },
  lineup: {
    title: "{{count}} modelos, {{count}} enfoques",
    intro:
      "Una selección para preguntas polémicas: modelos insignia convencionales, un modelo insignia abliterado, el modelo de opiniones contrarias y uno con una inclinación declarada. Contexto y precio en directo desde nuestro registro.",
    footnote:
      "Por mensaje significa un intercambio de referencia en la ruta más barata. Los modelos sin censura piden una sola vez una confirmación 18+.",
  },
  table: {
    model: "Modelo",
    context: "Contexto",
    price: "Por mensaje",
    chat: "Pruébalo",
    chatLink: "Pregunta a {{model}}",
  },
  method: {
    title: "Oye a todas las partes en cuatro pasos",
    intro: "Un chat. Unos cuantos cambios. Tu propio veredicto.",
    ask: {
      title: "Haz tu pregunta de verdad",
      body: "No una versión suavizada. Pregúntala como se la harías a un amigo que no está de acuerdo contigo.",
    },
    switch: {
      title: "Cambia de modelo, conserva el chat",
      body: "Elige otro modelo en el selector y pregunta de nuevo. El chat conserva su historial, así que cada modelo ve la misma pregunta.",
    },
    steelman: {
      title: "Pide a cada uno que defienda la otra postura",
      body: "Pide el argumento más sólido contra su propia respuesta. Un modelo que no sabe defender en serio la postura contraria te está mostrando su enfoque.",
    },
    check: {
      title: "Comprueba los hechos tú mismo",
      body: "Donde los modelos discrepen en hechos, no en opiniones, compruébalo. {{ownModel}} expone las afirmaciones discutidas con la misma claridad que las probadas. Los demás también, en su propia dirección.",
    },
  },
  skills: {
    title: "Skills que defienden cada postura",
    intro:
      "Un skill fija la persona y el modelo con un clic. Estos están pensados para terreno polémico.",
    historian: "Historiador imparcial: hechos, no relatos",
    advocate: "Abogado del diablo: cuestiona cada suposición",
    debater:
      "Experto en debate: aborda temas polémicos desde todos los ángulos",
    chan: "4chan: greentext y pullas, la voz del viejo imageboard, sin filtro",
  },
  pairs: {
    title: "{{ownModel}} frente a los convencionales",
    intro:
      "Comparativas cara a cara: contexto, precio y filtro del modelo de opiniones contrarias frente a los grandes nombres.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "¿Existe un chatbot de IA imparcial?",
      a: "No. Todo modelo está moldeado por sus datos de entrenamiento, por las personas que puntuaron sus respuestas y por sus reglas de rechazo. La respuesta práctica: pregunta a varios modelos con enfoques distintos y compara. En {{appName}} basta un chat y unos cuantos clics.",
    },
    chatgpt: {
      q: "¿ChatGPT tiene sesgo político?",
      a: "Todo modelo se inclina hacia algún lado, y los asistentes convencionales se van por las ramas o se niegan en temas polémicos. OpenAI publica sus propias evaluaciones del sesgo político de sus modelos. Haz la misma pregunta a un modelo con otro enfoque y la diferencia salta a la vista.",
    },
    conservative: {
      q: "¿Hay un chatbot de IA conservador o de derechas?",
      a: "Gab describe {{gabModel}} como construido en torno a valores cristianos y principios conservadores. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. Ambos están en el selector de modelos de {{appName}}.",
    },
    truth: {
      q: "¿{{ownModel}} dice la verdad?",
      a: "Te dice lo que los modelos convencionales callan. Tampoco es neutral, y expone las afirmaciones discutidas con la misma claridad que las probadas. Úsalo como la otra cara del debate y comprueba los hechos que importan.",
    },
    side: {
      q: "¿{{appName}} toma partido político?",
      a: "No. Ofrecemos modelos convencionales, abiertos y sin censura uno al lado del otro, y tú eliges. Qué leer lo decide cada persona, no una corporación.",
    },
    free: {
      q: "¿Puedo comparar modelos gratis?",
      a: "Sí. Recibes {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratuita. Cambiar de modelo dentro de un chat no cuesta nada extra.",
    },
    refusalLink: "El índice de rechazos: qué IA responde de verdad",
    jailbreakLink:
      "Por qué los jailbreaks de ChatGPT siempre acaban rompiéndose",
    bestLink: "El mejor LLM sin censura, elegido según la tarea",
  },
  cta: {
    title: "Oye la parte que tu chatbot se salta.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Pregunta al modelo de opiniones contrarias, luego cambia y compara.",
    start: "Pregunta al modelo de opiniones contrarias",
    models: "Compara todos los modelos",
  },
};
