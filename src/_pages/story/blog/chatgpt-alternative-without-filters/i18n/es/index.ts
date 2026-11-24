import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT sin censura: la alternativa sin filtros | {{appName}}",
    description:
      "¿Buscas ChatGPT sin censura y sin filtros? Descubre qué protecciones mantiene GPT, compara modelos abiertos y sin censura y prueba otro chatbot sin cuenta.",
    category: "Guía",
    imageAlt: "{{appName}}: una alternativa a ChatGPT sin filtros",
    keywords:
      "ChatGPT sin censura, ChatGPT sin filtros, alternativa a ChatGPT, alternativa a ChatGPT sin censura, ChatGPT sin restricciones, IA sin censura, chat de IA sin filtros, UncensoredLM, IA sin censura para política, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía",
    readTime: "7 min de lectura",
    title: "ChatGPT sin censura: una alternativa con modelos sin filtros",
    subtitle:
      "Compara modelos convencionales, abiertos y sin censura en {{appName}}. Descubre cómo cambia la conversación al elegir otro modelo y cuánto cuesta cada opción.",
  },
  intro: {
    lead: "ChatGPT usa las medidas de seguridad de OpenAI. GPT las conserva también en {{appName}}. Si buscas un chat con menos restricciones, elige otro modelo. Aun así, puede rechazar una solicitud o equivocarse.",
    p2: "En {{appName}} puedes elegir entre {{modelCount}} modelos de chat de tres categorías. Todos usan el mismo saldo de créditos.",
  },
  exists: {
    title: "¿Hay un ChatGPT sin filtros?",
    p1: "ChatGPT usa las medidas de seguridad de OpenAI. Al elegir GPT en {{appName}}, esas medidas siguen vigentes.",
    p2: "Para chatear con menos restricciones, elige un modelo de la categoría sin censura en {{appName}}. Puedes empezar desde el navegador, sin crear una cuenta.",
  },
  tiers: {
    title: '¿Qué significa "sin filtros"?',
    intro: "Cada modelo tiene un nivel de contenido. Hay tres.",
    mainstream:
      "Convencionales ({{count}} modelos). Se aplican las medidas de seguridad del proveedor.",
    open: "Abiertos ({{count}} modelos). Los rechazos dependen de cada modelo.",
    uncensored:
      "Sin censura ({{count}} modelos). Esta categoría agrupa modelos según cómo tratan temas delicados.",
    vendorRefusals:
      "Al cambiar de modelo en {{appName}}, eliges cuál responde. Se siguen aplicando las medidas de seguridad del modelo elegido.",
    twoKinds:
      "Algunos modelos sin censura usan la ablación o el ajuste fino para reducir los rechazos. UncensoredLM se entrenó con libros y documentos prohibidos en el internet convencional. Por eso expresa opiniones políticas que se apartan de la corriente dominante. Contrasta sus afirmaciones con tus fuentes.",
    modelsLink: "Revisa cada modelo según su nivel de filtro",
  },
  switch: {
    title: "¿Puedo cambiar modelos en medio de un chat?",
    intro: "Sí. Puedes elegir otro modelo para el siguiente mensaje.",
    p1: "Si cambias de modelo durante una conversación, el historial se conserva. El nuevo modelo puede usar la parte que cabe en su ventana de contexto.",
    p2: "Puedes redactar un borrador con un modelo y pedirle a otro que lo revise en el mismo chat.",
    caveat:
      "Cada modelo aplica sus propias medidas de seguridad al borrador y a tu próxima solicitud.",
  },
  picks: {
    title: "¿Qué modelo debería usar en lugar de ChatGPT?",
    intro:
      "Empieza por el trabajo. Cada nombre vincula a la página del modelo con precios y especificaciones.",
    builtUncensored: {
      title: "Política y puntos de vista",
      body: "UncensoredLM puede aportar otra perspectiva sobre temas políticos o polémicos. Contrasta sus afirmaciones con tus fuentes.",
    },
    everyday: {
      title: "Tareas cotidianas",
      body: "Prueba estos modelos convencionales para escribir, programar y analizar información.",
    },
    open: {
      title: "Modelos abiertos para código y razonamiento",
      body: "Prueba estos modelos abiertos para programar o resolver problemas. Compara cómo responden a la misma pregunta.",
    },
    unfiltered: {
      title: "Modelos sin censura para análisis",
      body: "Prueba estos modelos para analizar, programar o escribir textos largos. Pueden rechazar solicitudes.",
    },
    fiction: {
      title: "Juego de rol y ficción oscura",
      body: "Para seguir una historia durante varias sesiones, compara las ventanas de contexto. Revisa también si el modelo admite imágenes como entrada.",
    },
    cheap: {
      title: "Modelos más económicos",
      body: "Consulta el costo estimado en la ficha del modelo. Las consultas y respuestas más largas pueden consumir más créditos.",
    },
    compare:
      "Compara las parejas disponibles por precio, ventana de contexto y funciones.",
    compareLink: "Comparar {{a}} con {{b}}",
    guideLink: "Lee la guía de cada modelo sin censura",
  },
  privacy: {
    title: "¿Es privado un chat de IA sin filtros?",
    intro: "Depende de la carpeta. Esto es exactamente lo que pasa.",
    incognito:
      "Los chats de incógnito viven en el almacenamiento local de tu navegador. La conversación no se guarda en nuestros servidores (los archivos generados se guardan un tiempo por motivos técnicos). Borra los datos del navegador y desaparece.",
    transit:
      "Aun así, cada mensaje pasa por nuestro servidor hasta el proveedor del modelo que escribe la respuesta. Así funciona toda IA alojada en la nube. El consumo de créditos queda registrado para poder cobrarlo.",
    memory:
      "En incógnito no hay memoria. La memoria persistente necesita una cuenta gratuita y la carpeta privada.",
    private:
      "Los chats privados se guardan en el servidor y solo los ve tu cuenta. Ábrelos desde cualquier dispositivo en el que inicies sesión.",
    callout:
      "En corto: el modo incógnito saca tu historial de nuestros servidores. No oculta tus mensajes al modelo que los responde.",
  },
  pricing: {
    title: "¿Cuánto cuesta?",
    intro: "Créditos. Un solo saldo para todos los modelos.",
    free: "Gratis: {{guestCredits}} créditos al mes sin cuenta, {{freeCredits}} con una cuenta gratuita y {{maxCredits}} con cuenta y boletín. Suficiente para probar varios modelos con tus propias preguntas.",
    sub: "Planes mensuales: cuatro tamaños, desde {{subCredits}} créditos por {{subPrice}}.",
    pack: "Paquetes de créditos: una recarga para suscriptores, {{packCredits}} créditos por {{packPrice}}. Nunca caducan. Tarjeta, PayPal o cripto.",
    oneBalance:
      "El mismo saldo sirve para generar imágenes, vídeo y música, para voz de entrada y salida, y para la búsqueda web.",
    metered:
      "Cada mensaje cuesta créditos según el modelo. Los modelos Flash cuestan una fracción de un modelo puntero. Cada página de modelo muestra el precio.",
    link: "Ver planes y paquetes de créditos",
  },
  chatgptBetter: {
    title: "¿Cuándo conviene más ChatGPT?",
    intro: "A veces. En estos casos.",
    oneVendor:
      "Solo usas modelos de OpenAI y nunca te topas con un rechazo. Entonces un proveedor, una app y una suscripción es más sencillo.",
    flatRate:
      "Quieres una tarifa plana y no pensar nunca en el coste por mensaje. Los créditos se cobran por uso, y el uso intensivo a diario de modelos punteros suma.",
    firstFeatures:
      "Quieres las novedades de un laboratorio el mismo día del lanzamiento. Los laboratorios suelen estrenar funciones primero en sus propias apps.",
    wantFilter:
      "Quieres el filtro. La cuenta de un menor o un trabajo con normas estrictas necesita barreras. Aquí puedes quedarte en el nivel convencional, pero un producto cerrado puede encajarte mejor.",
  },
  limits: {
    title: "¿Cuáles son las pegas?",
    intro:
      "Sin filtros también hay contrapartidas. Conócelas antes de cambiarte.",
    smaller:
      "La mayoría de los modelos sin censura son más pequeños que los modelos punteros. Varios están hechos para conversar y para ficción, no para análisis exigentes. UncensoredLM está hecho para respuestas francas, no para programar. En el razonamiento más difícil y en tareas largas de código, los mejores modelos convencionales siguen ganando.",
    tools:
      "No todos los modelos sin censura admiten llamadas a herramientas. Mira la página del modelo antes de contar con la búsqueda web u otras herramientas.",
    vendor:
      "Los modelos convencionales conservan las medidas de seguridad de su proveedor. Los modelos sin censura también pueden rechazar una petición.",
    responsibility:
      "Verifica los datos importantes antes de compartir una respuesta o tomar una decisión a partir de ella.",
  },
  faq: {
    filters: {
      q: "¿Se pueden desactivar las medidas de seguridad de GPT en una alternativa a ChatGPT?",
      a: "En {{appName}}, GPT mantiene las medidas de seguridad de su proveedor. Si eliges un modelo sin censura, te responde ese otro modelo, que tiene su propio comportamiento.",
    },
    title: "Preguntas frecuentes",
    free: {
      q: "¿{{appName}} es gratis?",
      a: "Sin cuenta: {{guestCredits}} créditos gratis al mes. Con cuenta gratuita: {{freeCredits}}. Con cuenta y boletín: {{maxCredits}}. A partir de ahí, un plan desde {{subPrice}} al mes.",
    },
    account: {
      q: "¿Necesito una cuenta?",
      a: "No. El chat de incógnito funciona sin cuenta. La necesitas para la memoria y para guardar chats en el servidor.",
    },
    api: {
      q: "¿Puedo usar estos modelos en mis propias herramientas?",
      a: "Sí. Cada plan de pago incluye una API compatible con OpenAI. Una clave, todos los modelos, también los sin censura.",
    },
    openSource: {
      q: "¿{{appName}} es de código abierto?",
      a: "Sí. El código es abierto bajo MIT y GPL v3, y puedes montar tu propia instancia.",
    },
    apiLink: "Configura la API en tus herramientas de programación",
    selfHostLink: "Monta tu propia instancia",
  },
  partners: {
    body: "¿Tienes un canal, un boletín o una comunidad sobre IA? El programa de socios de {{appName}} te paga una parte recurrente de cada pago que recomiendes.",
    link: "Ver el programa de socios",
  },
  cta: {
    title: "Elige un modelo y empieza a chatear",
    subtitle:
      "Empieza sin cuenta con hasta {{guestCredits}} créditos gratis al mes.",
    chat: "Prueba el chat de IA sin censura",
    models: "Compara todos los modelos",
  },
};
