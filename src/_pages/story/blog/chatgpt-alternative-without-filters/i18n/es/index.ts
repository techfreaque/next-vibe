import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Una alternativa a ChatGPT sin filtros | {{appName}}",
    description:
      "¿Buscas ChatGPT sin filtros? Descubre qué protecciones mantiene GPT, compara modelos abiertos y sin censura y prueba otro chatbot sin cuenta.",
    category: "Guía",
    imageAlt: "{{appName}} : una alternativa ChatGPT sin filtros",
    keywords:
      "ChatGPT alternativa, ChatGPT alternativa sin filtros, sin censura ChatGPT alternativa, ChatGPT sin restricciones, sin filtrar AI chat, sin censura AI, UncensoredLM, sin censura AI para la política, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Guía",
    readTime: "7 min leer",
    title: "Una alternativa a ChatGPT con modelos sin censura",
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
    modelsLink: "Examine cada modelo por nivel de filtro",
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
    guideLink: "Lea la guía de cada modelo sin censura",
  },
  privacy: {
    title: "¿Es privado un chat AI sin filtrar?",
    intro: "Depende de la carpeta. Esto es exactamente lo que pasa.",
    incognito:
      "chats Incognito en vivo en el almacenamiento local de su navegador. La conversación no se guarda en nuestros servidores (los medios generados se almacenan temporalmente por razones técnicas). Limpiar los datos de tu navegador y se ha ido.",
    transit:
      "Cada mensaje pasa a través de nuestro servidor al proveedor modelo que escribe la respuesta. Así es como funciona todo AI hospedado. El uso de crédito se registra así que la facturación funciona.",
    memory:
      "La memoria está en el incógnito. La memoria persistente necesita una cuenta gratuita y la carpeta privada.",
    private:
      "Los chats privados se guardan en el servidor y sólo se pueden ver en su cuenta. Abrelos de cualquier dispositivo en el que inicies sesión.",
    callout:
      "Versión corta: incognito mantiene su historia fuera de nuestros servidores. No oculta tus mensajes del modelo que los responde.",
  },
  pricing: {
    title: "¿Cuánto cuesta?",
    intro: "Créditos. Un saldo para cada modelo.",
    free: "Gratis: {{guestCredits}} acredita un mes sin cuenta, {{freeCredits}} con una cuenta gratuita, {{maxCredits}} con una cuenta y el boletín. Suficiente para probar varios modelos en sus propios avisos.",
    sub: "Planes mensuales: cuatro tamaños, comenzando en créditos {{subCredits}} para {{subPrice}}.",
    pack: "Paquetes para recargar los créditos de tu suscripción. {{packCredits}} créditos por {{packPrice}}. Nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    oneBalance:
      "El mismo saldo cubre la generación de imagen, vídeo y música, entrada de voz y salida, y búsqueda web.",
    metered:
      "Cada mensaje cuesta créditos basados en el modelo. Los modelos Flash cuestan una fracción de un modelo fronterizo. Cada página modelo muestra el precio.",
    link: "Ver planes y paquetes de crédito",
  },
  chatgptBetter: {
    title: "¿Cuándo es ChatGPT la mejor elección?",
    intro: "A veces. Aquí es cuando.",
    oneVendor:
      "Sólo usas modelos OpenAI y nunca golpeaste un rechazo. Luego un vendedor, una aplicación, una suscripción es más simple.",
    flatRate:
      "Quieres una tarifa plana y nunca quieres pensar en el costo por mensaje. Los créditos se miden y aumenta el uso diario de los modelos fronterizos.",
    firstFeatures:
      "Quieres las últimas funciones de la aplicación del laboratorio en el día del lanzamiento. Los laboratorios suelen enviar nuevas características en sus propias aplicaciones primero.",
    wantFilter:
      "Quieres el filtro. La cuenta de un niño o un lugar de trabajo con reglas estrictas necesita vigilancia. Usted puede permanecer en el nivel principal aquí, pero un producto bloqueado puede encajar mejor.",
  },
  limits: {
    title: "¿Cuáles son las desventajas?",
    intro: "Sin manchas viene con desvíos. Conozcalos antes de cambiar.",
    smaller:
      "La mayoría de los modelos no censurados son más pequeños que los modelos fronterizos. Varios son construidos para la conversación y la ficción, no análisis duro. UncensoredLM está construido para respuestas francas, no para código. En los trabajos más duros de razonamiento y larga codificación, los modelos principales aún ganan.",
    tools:
      "No todos los modelos no censurados soportan llamadas de herramientas. Compruebe la página modelo antes de contar con la búsqueda web u otras herramientas.",
    vendor:
      "Los modelos convencionales conservan las medidas de seguridad de su proveedor. Los modelos sin censura también pueden rechazar solicitudes.",
    responsibility:
      "Verifica los datos importantes antes de compartir una respuesta o tomar una decisión a partir de ella.",
  },
  faq: {
    filters: {
      q: "¿Se pueden desactivar las medidas de seguridad de GPT en una alternativa a ChatGPT?",
      a: "En {{appName}}, GPT mantiene las medidas de seguridad de su proveedor. Si eliges un modelo sin censura, te responde ese otro modelo, que tiene su propio comportamiento.",
    },
    title: "FAQ",
    free: {
      q: "¿Está libre {{appName}}?",
      a: "Sin cuenta: créditos gratuitos {{guestCredits}} al mes. Cuenta gratuita: {{freeCredits}}. Cuenta + newsletter: {{maxCredits}}. Después de eso: un plan, desde {{subPrice}} al mes.",
    },
    account: {
      q: "¿Necesito una cuenta?",
      a: "No. El chat de Incognito funciona sin uno. Necesitas una cuenta para la memoria y para chats guardados en el servidor.",
    },
    api: {
      q: "¿Puedo usar estos modelos en mis propias herramientas?",
      a: "Sí. Cada plan pagado incluye un OpenAI -compatible API. Una llave, cada modelo, los no censurados incluidos.",
    },
    openSource: {
      q: "¿Es fuente abierta {{appName}}?",
      a: "Sí. El código es fuente abierta bajo MIT y GPL v3, y puede ejecutar su propia instancia.",
    },
    apiLink: "Configura el API en tus herramientas de codificación",
    selfHostLink: "Corre tu propio ejemplo.",
  },
  partners: {
    body: "Ejecutar un canal, newsletter o comunidad sobre AI? El programa socio {{appName}} paga una parte recurrente de cada pago que se refiere.",
    link: "Ver el programa de socios",
  },
  cta: {
    title: "Elige un modelo y empieza a chatear",
    subtitle:
      "Empieza sin cuenta con hasta {{guestCredits}} créditos gratis al mes.",
    chat: "Prueba el chat de IA sin censura",
    models: "Compare todos los modelos",
  },
};
