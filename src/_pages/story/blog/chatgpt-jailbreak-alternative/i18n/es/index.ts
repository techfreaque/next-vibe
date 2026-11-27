import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jailbreak de ChatGPT: ya no funciona. Esto sí | {{appName}}",
    description:
      "Compara alternativas a los prompts de jailbreak de ChatGPT, desde {{appName}} y Venice hasta LM Studio y Ollama. Modelos, privacidad y costes.",
    category: "Guía de modelos",
    imageAlt: "Prompts de jailbreak de ChatGPT frente a modelos sin censura",
    keywords:
      "jailbreak ChatGPT, prompt jailbreak ChatGPT, prompt DAN, saltarse el filtro de ChatGPT, ChatGPT sin filtros, ChatGPT sin restricciones, sigue funcionando el jailbreak de ChatGPT, alternativa al jailbreak, alternativa a ChatGPT sin censura, modelo abliterado, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "7 min de lectura",
    title: "Compara alternativas al jailbreak de ChatGPT",
    subtitle:
      "Compara chats alojados y modelos locales por límites, coste y privacidad. Descubre {{count}} modelos para escritura y rol.",
  },
  intro: {
    lead: "Un prompt que hoy cambia las respuestas de ChatGPT puede funcionar de otra forma tras una actualización. Elige un modelo que encaje con tu escritura o juego de rol.",
    p2: "Compara primero los chats alojados y las aplicaciones locales. También mostramos {{count}} modelos en {{appName}} con su contexto y precios vigentes.",
  },
  why: {
    title: "Por qué los jailbreaks de ChatGPT siempre se rompen",
    intro: "Tres capas se interponen entre tu prompt y una respuesta directa.",
    weights:
      "La negativa está en los pesos. Los modelos GPT están entrenados para rechazar categorías enteras de peticiones. Un jailbreak no elimina ese entrenamiento, intenta esquivarlo a base de palabras, conversación a conversación.",
    patched:
      "Los jailbreaks conocidos acaban en el entrenamiento. En cuanto un prompt se difunde, entra en la siguiente ronda de entrenamiento de seguridad. Por eso el prompt del mes pasado hoy falla.",
    layer:
      "También puede haber un control fuera del modelo. Las apps convencionales pueden moderar entradas y salidas, así que incluso una respuesta ya escrita puede marcarse o eliminarse.",
  },
  cost: {
    title: "Lo que de verdad te cuesta un jailbreak",
    intro: "Incluso cuando funciona, lo pagas.",
    quality:
      "Peores respuestas. El modelo pone el esfuerzo en interpretar un personaje en lugar de responder. Las respuestas en personaje son infladas, teatrales y a menudo menos precisas.",
    unstable:
      "Cero consistencia. El mismo prompt funciona en un chat y falla en el siguiente. No puedes montar un flujo de trabajo encima.",
    account:
      "Riesgo para tu cuenta. Las políticas de uso de ChatGPT se aplican a cada prompt, y OpenAI puede restringir o suspender las cuentas que las incumplen. Un jailbreak es un intento deliberado de incumplirlas.",
    time: "Tiempo perdido. Buscar, probar y reescribir prompts lleva más tiempo que hacer la pregunta.",
    callout:
      "Un jailbreak trata el síntoma. La negativa viene de cómo se entrenó el modelo, así que elige un modelo entrenado de otra forma.",
  },
  instead: {
    title: "El modelo que no necesita jailbreak",
    intro: "Dos tipos de modelos sin censura, dos soluciones distintas.",
    abliteratedTitle: "Abliterado: la negativa quitada de los pesos",
    abliterated:
      "Un estudio de 2024 encontró que, en los modelos de chat que analizó, la negativa pasa en gran parte por una sola dirección dentro de la red. La abliteración elimina esa dirección de los pesos. El resultado es el mismo modelo, el mismo conocimiento, el mismo estilo, que casi deja de esquivar preguntas. Sin trucos de prompt, porque ya no queda nada que engañar.",
    ownTitle: "{{ownModel}}: otra visión del mundo",
    own: "{{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, con el resultado de un modelo con opiniones políticas contrarias. No es un modelo convencional sin frenos, son opiniones totalmente distintas.",
    sources: {
      paper:
        "Arditi et al., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Abliterado, ajustado o con visión propia: la explicación completa",
  },
  models: {
    title: "{{count}} modelos sin censura, sin jailbreak",
    intro:
      "Todos los modelos sin censura actuales de nuestra plataforma, del más barato al más caro. Contexto y precio sacados de nuestro registro de modelos.",
    colModel: "Modelo",
    colContext: "Contexto",
    colPrice: "Por mensaje",
    colChat: "Pruébalo",
    chatLink: "Chatea con {{model}}",
    footnote:
      "Por mensaje significa un intercambio de referencia en la ruta más barata. Las conversaciones largas y las respuestas largas cuestan más.",
  },
  test: {
    title: "Haz la prueba: misma pregunta, dos modelos",
    intro:
      "No te fíes de nosotros. Haz la pregunta para la que buscabas el jailbreak.",
    steps: {
      ask: {
        title: "Pregunta a un modelo convencional",
        body: "Abre un chat y elige GPT u otro modelo convencional. Haz la pregunta que suele esquivar. Anota la respuesta.",
      },
      switch: {
        title: "Cambia a un modelo sin censura",
        body: "Cambia de modelo para el siguiente mensaje, en el mismo chat. Confirma una vez que tienes 18+ cuando te lo pida.",
      },
      compare: {
        title: "Pregunta otra vez y compara",
        body: "Misma pregunta, sin personaje, sin trucos. Compara longitud, franqueza y precisión.",
      },
      keep: {
        title: "Quédate con el que responde",
        body: "Vuelve atrás cuando quieras. Modelos convencionales para el código difícil, sin censura para las preguntas que otros no tocan.",
      },
    },
    compareLink: "{{a}} vs {{b}}: lado a lado",
  },
  limits: {
    title: "Lo que ningún modelo elimina",
    intro: "Sin censura no significa magia. Conoce los límites.",
    decline:
      "Aún puede negarse. La abliteración quita la mayoría de las negativas aprendidas, no todas. El resultado depende del modelo y del prompt.",
    wrong:
      "Aún puede equivocarse. Sin filtro, nadie suaviza tampoco una mala respuesta. Comprueba los datos que importan.",
    adult:
      "Solo para adultos. Los modelos sin censura se desbloquean tras una confirmación 18+ única y la aceptación de los términos.",
    callout:
      "Lo que generas y publicas es responsabilidad tuya, y la ley de tu país sigue aplicándose.",
  },
  faq: {
    title: "Preguntas frecuentes",
    work: {
      q: "¿Siguen funcionando los prompts de jailbreak de ChatGPT?",
      a: "A veces, poco tiempo. Los prompts populares acaban en el entrenamiento y la moderación intercepta muchas salidas, así que un prompt que funciona rara vez dura. El camino fiable es un modelo sin negativa aprendida.",
    },
    dan: {
      q: "¿Qué es el prompt DAN?",
      a: "DAN (Do Anything Now) es un jailbreak de roleplay que le pide a ChatGPT que interprete un personaje sin reglas. Sus versiones se parchean una tras otra, y las respuestas en personaje suelen ser peores que las normales.",
    },
    ban: {
      q: "¿Me pueden banear por hacer jailbreak a ChatGPT?",
      a: "Las políticas de uso de OpenAI se aplican a cada prompt, y OpenAI puede restringir o suspender las cuentas que las incumplen. Un modelo hecho para responder evita el problema por completo.",
    },
    gpt: {
      q: "¿Puedo usar GPT sin filtro en {{appName}}?",
      a: "No. GPT mantiene las salvaguardas de OpenAI en todas partes, también aquí. Para respuestas sin filtro, elige uno de los {{count}} modelos sin censura. Cambias entre GPT y ellos en el mismo chat.",
    },
    legal: {
      q: "¿Es legal usar un modelo de IA sin censura?",
      a: "Un modelo es una herramienta. Lo que generas y publicas es responsabilidad tuya, y se aplica la ley de tu país. En {{appName}}, los modelos sin censura se desbloquean tras una confirmación 18+ única.",
    },
    free: {
      q: "¿Puedo probar gratis un modelo sin censura?",
      a: "Sí. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratuita, {{maxCredits}} con el boletín. Cuántos mensajes son depende del modelo y de la longitud del chat.",
    },
    alternativeLink: "Una alternativa a ChatGPT sin filtros: nuestra selección",
    refusalLink: "¿Qué IA responde de verdad? El índice de negativas",
    chatLink: "Chat de IA sin censura en tu navegador",
  },
  cta: {
    title: "Sin jailbreak. Haz la pregunta.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Elige un modelo sin censura y pregunta sin rodeos.",
    start: "Empieza un chat sin censura",
    models: "Compara todos los modelos",
  },
};
