import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "LLM sin censura en línea: sin GPU, sin instalar | {{appName}}",
    description:
      "Usa un LLM sin censura en línea, sin tarjeta gráfica. Cuánta VRAM necesitan de verdad los modelos locales, qué modelos abliterados y sin censura funcionan en el navegador y cuánto cuesta cada mensaje.",
    category: "Guía de modelos",
    imageAlt: "Un LLM sin censura en línea, sin GPU",
    keywords:
      "LLM sin censura en línea, LLM sin censura sin GPU, alternativa en línea a un LLM local, IA sin censura sin tarjeta gráfica, modelo abliterado en línea, modelo sin censura en el navegador, VRAM para LLM local, alternativa a Ollama en línea, alternativa a LM Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "8 min de lectura",
    title: "LLM sin censura en línea. Sin GPU. Sin instalar nada.",
    subtitle:
      "Lo que un modelo sin censura local le pide de verdad a tu hardware, y {{count}} modelos sin censura que funcionan en una pestaña del navegador. Precios y contexto leídos en directo de nuestro registro de modelos.",
  },
  intro: {
    lead: "Todas las guías de modelos sin censura dicen lo mismo: descárgalo, ejecútalo en local. Luego miras tu tarjeta gráfica. Los modelos grandes piden más memoria de la que tiene cualquier PC gamer. Los pequeños que caben no son los que todo el mundo recomienda.",
    p2: "Hay un segundo camino. El mismo tipo de modelos, alojados, en una pestaña del navegador. Sin GPU, sin drivers, sin descargar 40 GB. Esta guía muestra lo que exige de verdad el local, cuándo sigue ganando y qué {{count}} modelos sin censura funcionan ahora mismo en {{appName}}.",
  },
  table: {
    model: "Modelo",
    context: "Contexto",
    price: "Por mensaje",
  },
  hardware: {
    title: "Lo que exige de verdad ejecutarlo en local",
    intro:
      "El muro es la memoria. Los pesos del modelo tienen que caber en la VRAM de tu gráfica (o en la memoria unificada de un Mac) para ir a una velocidad usable. Estos son los modelos sin censura de nuestro catálogo con número de parámetros publicado.",
    colParams: "Parámetros",
    colMemory: "Pesos a 4 bits / 8 bits",
    paramsValue: "{{count}} mil M",
    memoryValue: "{{q4}} GB / {{q8}} GB",
    unknown: "No publicado",
    footnote:
      "Solo los pesos, calculados a partir del número de parámetros: unos 0,5 GB por cada mil millones de parámetros a 4 bits, 1 GB a 8 bits. El contexto (caché KV) y el entorno de ejecución van aparte, y las conversaciones largas piden mucho más.",
    small:
      "Hasta unos 12 GB de pesos: cabe en una gráfica de 16 GB con margen para el contexto.",
    mid: "De 20 a 40 GB: una gráfica de 24 GB a 4 bits con contexto corto, dos gráficas o un Mac con mucha memoria unificada.",
    large:
      "Cientos de GB: ningún equipo doméstico. Son los modelos de tamaño frontier, y la única forma práctica de usarlos es alojados.",
    callout:
      "La cuantización reduce el archivo y cuesta algo de calidad. La versión de 4 bits de un modelo mediano no es la misma experiencia que el modelo completo en la nube.",
  },
  local: {
    title: "Cuándo el local sigue siendo la opción correcta",
    intro:
      "El local no es un error. Es un intercambio. Herramientas como Ollama y LM Studio lo ponen fácil si tu hardware da la talla.",
    winsTitle: "Dónde gana el local",
    offline:
      "Sin conexión: sin internet, sin cuenta, sin proveedor de por medio. Nada sale del equipo.",
    catchTitle: "La pega",
    verdict:
      "En corto: ¿tienes una GPU potente, quieres privacidad total y te basta un modelo mediano? Ejecútalo en local. ¿Quieres los modelos grandes, un contexto largo o simplemente una respuesta en el próximo minuto? Úsalo en línea.",
  },
  online: {
    title: "{{count}} modelos sin censura directamente en el navegador",
    intro:
      "Todos los modelos sin censura actuales de {{appName}}, del más barato al más caro. El contexto y el precio por mensaje salen directamente de nuestro registro de modelos. Haz clic en uno y chatea.",
    colChat: "Pruébalo",
    chatLink: "Chatea con {{model}}",
    footnote:
      "Por mensaje significa un intercambio de referencia en la ruta más barata. Las conversaciones largas y las respuestas largas cuestan más. Todos funcionan en servidores, a tu portátil le basta un navegador.",
    directoryLink: "Todos los modelos abliterados, con contexto y precio",
  },
  steps: {
    title: "De cero a una respuesta en un minuto",
    intro: "Sin descargas, sin cuenta para empezar.",
    open: {
      title: "Abre un chat",
      body: "Haz clic en cualquier modelo de arriba o empieza un chat de incógnito. Los invitados reciben {{guestCredits}} créditos gratis al mes.",
    },
    pick: {
      title: "Elige el modelo",
      body: "En el selector, elige el nivel sin censura. Cambia en mitad de la conversación cuando quieras, el historial se queda.",
    },
    confirm: {
      title: "Confirma que tienes 18+",
      body: "Los modelos sin censura piden una sola vez la confirmación de mayoría de edad y los términos. Después quedan desbloqueados.",
    },
    ask: {
      title: "Haz la pregunta de verdad",
      body: "La que otros asistentes esquivan. Sin prompt de jailbreak, sin disfraz de roleplay.",
    },
  },
  kinds: {
    title: "Dos tipos de sin censura, los dos en línea",
    intro: "No todos los modelos sin censura lo son de la misma forma.",
    abliterated:
      "Versiones abliteradas y ajustadas: modelos convencionales o abiertos, ligeramente modificados para que dejen de esquivar preguntas. Mismo entrenamiento, misma visión del mundo. Solo responden.",
    own: "{{ownModel}}: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. Funciona alojado, a través de uncensored.ai.",
    link: "Abliterado, ajustado o con visión propia: en qué se diferencian",
  },
  privacy: {
    title: "Qué ve un modelo alojado",
    intro:
      "En línea significa que el modelo corre en el servidor de otro. Esto es exactamente quién ve qué.",
    transit:
      "Cada mensaje pasa por nuestro servidor hasta el proveedor que ejecuta el modelo. El proveedor ve el prompt, bajo sus propias condiciones. Así funciona cualquier IA alojada.",
    incognito:
      "Los chats de incógnito se guardan en el almacenamiento local de tu navegador, no en nuestros servidores. Borra los datos del navegador y desaparecen.",
    selfHost:
      "{{appName}} es de código abierto. Alójalo tú mismo y conéctalo a tus propios modelos locales cuando nada pueda salir de tu equipo.",
    selfHostLink: "Aloja {{appName}} tú mismo",
    callout:
      "Si un prompt no puede salir nunca de tu hardware, usa el local. Para todo lo demás, alojado es el camino rápido.",
  },
  cost: {
    title: "Cuánto cuesta, local frente a en línea",
    intro: "En local no hay precio por mensaje. El precio es el hardware.",
    guest:
      "En línea con nosotros: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con una cuenta gratuita.",
    plan: "Planes desde {{subPrice}} al mes. Los paquetes de créditos recargan un plan activo y no caducan nunca.",
    local:
      "En local: gratis por mensaje, pero una GPU que mueva los modelos grandes cuesta más que años de chat alojado. Más la luz.",
  },
  pairs: {
    title: "El modelo base junto a su versión sin censura",
    intro:
      "Mismo laboratorio, mismo tamaño, sin negativas. Compara contexto, precio y filtro lado a lado.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "Preguntas frecuentes",
    gpu: {
      q: "¿Puedo usar un LLM sin censura sin GPU?",
      a: "Sí, alojado. El modelo corre en los servidores del proveedor, solo necesitas un navegador. En {{appName}} son {{count}} modelos sin censura, incluidos algunos de tamaño frontier que ningún PC doméstico puede mover.",
    },
    free: {
      q: "¿Hay un LLM sin censura gratis en línea?",
      a: "En {{appName}} recibes {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratuita. Cuántos mensajes son depende del modelo y de la longitud del chat. Los modelos sin censura piden una confirmación 18+ una sola vez.",
    },
    vram: {
      q: "¿Cuánta VRAM necesito para ejecutar un modelo sin censura en local?",
      a: "Regla práctica para los pesos: unos 0,5 GB por cada mil millones de parámetros a 4 bits, 1 GB a 8 bits. Un modelo de 24B necesita unos 12 GB a 4 bits, uno de 70B entre 35 y 40 GB. El contexto y el entorno van aparte.",
    },
    private: {
      q: "¿Es privado un LLM sin censura en línea?",
      a: "Menos que el local. El proveedor que ejecuta el modelo ve tu prompt. En {{appName}}, los chats de incógnito se quedan en el almacenamiento de tu navegador, no en nuestros servidores. Para prompts que nunca deben salir de tu equipo, usa el local.",
    },
    offline: {
      q: "¿Puedo usar un modelo sin censura sin conexión?",
      a: "Uno alojado, no. Sin conexión significa local: descarga un modelo que quepa en tu memoria y ejecútalo con una herramienta como Ollama o LM Studio.",
    },
    truly: {
      q: "¿Los modelos abliterados son realmente sin censura?",
      a: "Dejan de negarse, pero mantienen el entrenamiento y la visión del mundo de su modelo base. {{ownModel}} es distinto: entrenado con libros y documentos prohibidos en el internet convencional, con el resultado de un modelo con opiniones políticas contrarias.",
    },
    chatLink: "Chat de IA sin censura en tu navegador",
    platformsLink:
      "Plataformas de IA sin censura comparadas, herramientas locales incluidas",
  },
  cta: {
    title: "Olvídate de la descarga. Pregunta ya.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Elige un modelo sin censura y cambia cuando quieras.",
    start: "Empieza un chat sin censura",
    models: "Compara todos los modelos",
  },
};
