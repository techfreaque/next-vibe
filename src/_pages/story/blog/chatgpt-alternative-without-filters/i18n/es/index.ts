import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Una alternativa a ChatGPT sin filtros | {{appName}}",
    description:
      "Una alternativa ChatGPT sin filtrar: modelos {{modelCount}} de la corriente principal a la no censurada. Elige el nivel de filtro por chat. Libre de empezar, sin cuenta.",
    category: "Guía",
    imageAlt: "{{appName}} : una alternativa ChatGPT sin filtros",
    keywords:
      "ChatGPT alternativa, ChatGPT alternativa sin filtros, sin censura ChatGPT alternativa, ChatGPT sin restricciones, sin filtrar AI chat, sin censura AI, UncensoredLM, sin censura AI para la política, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Guía",
    readTime: "7 min leer",
    title: "Una alternativa a ChatGPT sin filtros. Tú eliges el nivel.",
    subtitle:
      "Claude, GPT y Gemini junto a modelos abiertos y sin censura, en un solo chat en {{appName}}. Qué cambia, qué se mantiene y cuánto cuesta.",
  },
  intro: {
    lead: "Usted hizo una pregunta normal. ChatGPT respondió con una renuncia, una conferencia o un educado no. Un detalle médico, una escena novedosa del crimen, una cuestión de seguridad, una toma política fuera del consenso. La negativa es una decisión de política, hecha para usted antes de escribir una palabra.",
    p2: "Así funciona una alternativa sin filtros en {{appName}}: {{modelCount}} modelos, tres niveles de filtrado, un solo saldo. Hay dos tipos de modelos sin censura: los convencionales modificados para reducir los rechazos y uno con una visión del mundo propia. Qué funciona, cuáles son los límites y cuándo sigue conviniendo ChatGPT.",
  },
  exists: {
    title: "¿Hay un ChatGPT sin filtros?",
    p1: "No de OpenAI. Los modelos GPT siguen las políticas de uso de OpenAI dondequiera que los ejecute. Claude y Gemini siguen las reglas de sus propios proveedores. Cualquier aplicación que promete un GPT sin filtrar está exagerando.",
    p2: "Lo que una alternativa real hace es poner otros modelos a su lado. {{appName}} ejecuta los modelos principales y, en el mismo chat, los modelos abiertos con filtros de luz y modelos sin censura sin filtro en absoluto. La mayoría de ellos son modelos principales con los rechazos cortados. Uno, UncensoredLM, tiene su propia visión del mundo. Tú decides cuál responde.",
  },
  tiers: {
    title: '¿Qué significa "sin filtros"?',
    intro: "Cada modelo tiene un nivel de contenido. Hay tres.",
    mainstream:
      "Mainstream ({{count}} modelos): Claude, GPT, Gemini, Mistral. Filtros de seguridad de la placa grande. Declinan temas sensibles.",
    open: "Abierto (Modelos {{count}}): DeepSeek, Kimi, GLM, Qwen, Grok, MiniMax y más. Filtros de luz. Ellos toman la mayoría de temas lódicos.",
    uncensored:
      "Sin censura (modelos {{count}}), dos tipos. Construcciones no censuradas de GLM, Qwen, Gemma y DeepSeek, más Venice : modelos principales con los rechazos cortados, la misma cosmovisión. Y UncensoredLM : entrenado en libros y documentos prohibidos de Internet, su propia cosmovisión. Sin filtro. Tú fijas los límites.",
    vendorRefusals:
      "Los modelos Mainstream también mantienen los filtros de su proveedor aquí. GPT en {{appName}} rechaza lo que GPT se niega por todas partes. La diferencia es lo que se encuentra a su lado.",
    twoKinds:
      "Uncensored viene en dos tipos. La mayoría comenzó como un modelo convencional o abierto y tuvo el reflejo de rechazo cortado, por la abliteración o una descensura fina. Dejan de decir que no. Sus datos de entrenamiento y su estancia en la cosmovisión: en política responden a la forma en que el modelo base lo ve, sólo sin el estiércol, y en ficción oscura pueden suavizar la escena. Desbloqueado, no cambiado. UncensoredLM es el otro tipo. Uncensored.ai lo entrena en libros y documentos prohibidos desde Internet corriente. El resultado es una visión del mundo diferente: tomas políticas que corren contra la corriente principal, sin conferencia, sin rejuzgar a la línea de consenso.",
    modelsLink: "Examine cada modelo por nivel de filtro",
  },
  switch: {
    title: "¿Puedo cambiar modelos en medio de un chat?",
    intro: "Sí. Escoge el modelo por mensaje, no por cuenta.",
    p1: "Comience un hilo con Claude. Ataque a un rechazo. Escoge un modelo sin censura y envía el siguiente mensaje. El hilo guarda su historia, y el nuevo modelo lee todo.",
    p2: "También funciona de otra manera. Borrar con un modelo sin censura, luego entregar el resultado a un modelo fronterizo para estructura y pulido.",
    caveat:
      "El filtro vive en el modelo, no en el hilo. Un modelo dominante que lee un borrador sin censura todavía puede negarse a continuarlo.",
  },
  picks: {
    title: "¿Qué modelo debería usar en lugar de ChatGPT?",
    intro:
      "Empieza por el trabajo. Cada nombre vincula a la página del modelo con precios y especificaciones.",
    builtUncensored: {
      title:
        "Política, otros puntos de vista, juego de roles oscuro: su propia visión del mundo",
      body: "UncensoredLM es el único modelo que no es un modelo estándar desbloqueado. Tiene su propia visión del mundo. Las preguntas políticas y controvertidas hacen que la corriente principal no te dé. Las opiniones heterodoxas se argumentan en su totalidad. El juego de roles oscuro y tabú permanece oscuro. Sin moralizar, sin dirigir de nuevo al consenso. La captura: contexto de 32K, texto solamente, no para código, y afirma reclamaciones impugnadas tan claramente como resueltas. Revisa los hechos que te da.",
    },
    everyday: {
      title: "Trabajos diarios, filtros de corriente",
      body: "Escribir, investigar, código, análisis. El partido más cercano a ChatGPT, con el mismo tipo de filtros.",
    },
    open: {
      title: "Inteligente, menos rechazos",
      body: "Modelos abiertos fuertes con filtros de luz. Responden a la mayoría de lo que un modelo dominante esquiva y sostienen el código y el razonamiento.",
    },
    unfiltered: {
      title: "No hay rechazos, razonamiento real",
      body: "Los pesados hitters entre los modelos de rechazo. Modelos de base fuertes con los rechazos eliminados: código, análisis y escritura larga sobre temas otros modelos bandera. Mismo entrenamiento, la misma visión del mundo, así que para tomas políticas contra el comienzo principal con UncensoredLM.",
    },
    fiction: {
      title: "Roleplay y ficción oscura",
      body: "UncensoredLM conduce a escenas oscuras y tabú: su material de entrenamiento se encuentra fuera del consenso seguro, así que nada suaviza la historia. Venice Role Play para campañas largas (128K context) e imagen de entrada. Venice Sin censura como el todo-redondeado barato.",
    },
    cheap: {
      title: "Barato y rápido",
      body: "Alto volumen a un precio bajo. Tres modelos flash deshuesados, más Claude Haiku para cuando un filtro está bien.",
    },
    compare:
      "¿Torn entre dos? Ponga el precio, la ventana de contexto y las capacidades lado a lado. Comience con UncensoredLM contra el modelo ChatGPT 's, contra Venice Role Play y contra un buque insignia de rechazo.",
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
      "Los modelos de corriente principal mantienen sus propios rechazos. Si Claude dice que no, cambie modelos en lugar de discutir con él.",
    responsibility:
      "Ningún filtro significa que no hay red de seguridad. Lo que generas y publicas es sobre ti, y la ley donde vives sigue vigente.",
  },
  faq: {
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
    title: "Escoge tu filtro. Haz tu pregunta.",
    subtitle:
      "Créditos gratis {{guestCredits}} al mes, sin cuenta necesaria. Incorporación, abierta o no censurada: cambie en cualquier momento.",
    chat: "Iniciar una charla sin filtrar",
    models: "Compare todos los modelos",
  },
};
