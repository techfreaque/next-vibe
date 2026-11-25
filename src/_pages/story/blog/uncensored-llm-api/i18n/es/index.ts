import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API de LLM sin censura: modelos abliterados | {{appName}}",
    description:
      "Modelos abliterados y sin censura en una API compatible con OpenAI y Anthropic. IDs, contexto, precio por modelo, ejemplos en curl y Python, límites.",
    category: "Guía para desarrolladores",
    imageAlt: "API de LLM sin censura con endpoints compatibles con OpenAI",
    keywords:
      "API de LLM sin censura, API de IA sin censura, API de modelos abliterados, LLM abliterado API, API compatible con OpenAI sin censura, API LLM NSFW, API sin filtro de contenido, modelos abliterados alojados, alternativa a la API de Venice, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía para desarrolladores",
    readTime: "8 min de lectura",
    title: "API de LLM sin censura. Tu SDK. Sin reflejo de negativa.",
    subtitle:
      "{{count}} modelos sin censura detrás de una sola clave compatible con OpenAI y Anthropic. IDs, contexto y precios leídos en directo de nuestro registro.",
  },
  intro: {
    lead: "Tu aplicación necesita un modelo que responda. No uno que sermonee ni uno que rechace la mitad de tus prompts de prueba. Las API convencionales filtran por diseño, y ejecutar tú mismo pesos abliterados significa alquilar GPU.",
    p2: "{{appName}} sirve {{count}} modelos sin censura en los mismos endpoints /v1 que cualquier modelo convencional. Cambia la base URL, quédate con el SDK de OpenAI o Anthropic, elige un ID sin censura. Aquí tienes la lista, el código, los límites y la pega honesta.",
    access:
      "Por delante: la API necesita una cuenta de pago. Cualquier plan, desde {{subPrice}} al mes, la desbloquea. Los créditos gratis y de bonificación no.",
    accessLink: "Desbloquear la API",
  },
  models: {
    title: "{{count}} modelos sin censura en la API",
    intro:
      "Todos los modelos de texto sin censura actuales, del más barato al más caro. Usa el ID tal cual en el campo model.",
    colModel: "Modelo",
    colId: "ID del modelo",
    colContext: "Contexto",
    colTools: "Herramientas",
    colPrice: "Por mensaje",
    yes: "Sí",
    no: "No",
    footnote:
      "Por mensaje es un intercambio de referencia en la ruta más barata. La API cobra por token, y cada respuesta indica el cargo exacto en usage.credits_charged. GET /v1/models devuelve la misma lista con precios por token.",
  },
  code: {
    title: "Una petición",
    intro:
      "El modelo sin censura más barato ahora mismo es {{example}}. Cámbialo por cualquier ID de la tabla.",
    prompt:
      "Dame los argumentos más fuertes a favor y en contra de la energía nuclear. Sin advertencias.",
    curl: "curl",
    python: "SDK de Python de OpenAI",
    anthropic:
      "¿Prefieres el SDK de Anthropic o Claude Code? Apúntalos a la misma base URL sin /v1 y llamarán a /v1/messages con los mismos modelos y la misma clave.",
  },
  consent: {
    title: "El único paso 18+",
    intro:
      "Los modelos sin censura son solo para adultos. La API lo comprueba una vez.",
    where:
      "Confirma una sola vez que tienes 18 años o más, en la página de claves API.",
    link: "Abrir claves API",
    error:
      "Sin esa confirmación, una petición a un modelo sin censura devuelve 403 uncensored_consent_required y no se cobra nada.",
    once: "Después, tus claves pueden llamar a los modelos sin censura.",
  },
  kinds: {
    title: "Qué modelo sin censura para cada trabajo",
    intro: "En la tabla hay tres tipos. Se comportan distinto.",
    abliterated:
      "Abliterado: un modelo convencional o abierto al que se le ha quitado de los pesos el comportamiento de negativa. Mismo entrenamiento, mismo conocimiento, misma visión del mundo. Solo responde. La opción por defecto para la mayoría de las apps.",
    fineTuned:
      "Ajustado: un modelo abierto entrenado además con datos sin filtrar. Suele ser más suelto en el tono, popular para ficción y roleplay.",
    own: "{{ownModel}}: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. Úsalo cuando quieras las posturas que los modelos convencionales no dan.",
    link: "Abliterado, ajustado o con visión propia: la explicación completa",
  },
  limits: {
    title: "Límites que debes conocer",
    intro: "Las aristas duras, antes de lanzar.",
    stateless:
      "Sin estado. No guardamos ninguna conversación. Envía el historial completo en cada turno.",
    maxTokens: "La salida está limitada a {{maxTokens}} tokens por petición.",
    rateLimit:
      "{{rateLimit}} peticiones por minuto y clave por defecto. Si te pasas, recibes un 429 con la cabecera Retry-After.",
    tools:
      "Las llamadas a herramientas solo funcionan en modelos que las admiten. La tabla indica cuáles. Si no, recibes 400 tools_not_supported.",
    refusals:
      "Sin censura no significa infalible. Un modelo aún puede negarse o equivocarse con los hechos. Prueba tus prompts en dos modelos antes de decidir.",
  },
  privacy: {
    title: "Qué pasa con tus prompts",
    intro: "Nos quedamos con la factura, no con la conversación.",
    noStore:
      "La API no guarda conversaciones ni crea hilos. En nuestro lado solo queda el registro de facturación: qué modelo, cuántos créditos.",
    upstream:
      "Tu prompt va al proveedor que sirve el modelo. A lo que recibe se le aplican sus condiciones.",
    callout:
      "Si tus prompts no pueden salir nunca de tu infraestructura, ejecuta pesos abliterados en tu propio hardware. Para todo lo demás, la API llega antes a producción.",
  },
  others: {
    title: "Otras API sin censura, sin rodeos",
    intro:
      "No somos la única opción. A algunos de ellos les compramos nosotros mismos. Datos sacados de su propia documentación y páginas de precios.",
    versusLink: "{{appName}} vs {{name}}: comparación completa",
    routerLink:
      "Dejar OpenRouter: una clave para todos los modelos, tres formatos de API",
  },
  faq: {
    title: "Preguntas frecuentes",
    free: {
      q: "¿Hay una API de LLM sin censura gratis?",
      a: "Aquí no. La app de chat tiene créditos gratis, la API no. Cualquier plan, desde {{subPrice}} al mes, desbloquea las claves API. Herramientas locales como Ollama te dan una API local gratis si tu hardware puede con el modelo.",
    },
    ids: {
      q: "¿Qué IDs de modelo son sin censura?",
      a: "Ahora mismo {{count}}, en la tabla de arriba con su ID exacto. GET /v1/models devuelve todos los modelos que tu clave puede llamar, con precios y soporte de herramientas.",
    },
    sdk: {
      q: "¿Funciona la API sin censura con el SDK de OpenAI?",
      a: "Sí. Pon base_url en la base URL de {{appName}}, usa tu clave y escribe un ID sin censura en el campo model. El SDK de Anthropic también funciona, con la misma base URL sin /v1.",
    },
    refuse: {
      q: "¿Un modelo sin censura nunca se niega?",
      a: "Se niega mucho menos, no nunca. Los modelos abliterados pierden el reflejo de negativa aprendido, pero aún pueden rechazar algo o equivocarse. Prueba con tus prompts reales.",
    },
    logs: {
      q: "¿{{appName}} registra mis prompts de la API?",
      a: "Desde la API no se guarda ninguna conversación, solo el registro de facturación: modelo y créditos cobrados. El proveedor que sirve el modelo ve el prompt, bajo sus propias condiciones.",
    },
    local: {
      q: "¿Es mejor alojar yo mismo los modelos abliterados?",
      a: "Si tienes las GPU y reglas estrictas sobre los datos, sí. Una herramienta local expone una API compatible con OpenAI en tu propio equipo. Si quieres modelos sin censura de tamaño frontier sin alquilar hardware, una API alojada sale más barata para empezar.",
    },
    docsLink: "Leer la referencia completa de la API",
    directoryLink: "Ver los modelos abliterados en el chat",
  },
  cta: {
    title: "Pruébalos primero. Intégralos después.",
    subtitle:
      "Todos los modelos de la tabla funcionan también en la app de chat. Prueba allí tus prompts y luego copia el ID en tu código.",
    chat: "Prueba un modelo sin censura en el chat",
    docs: "Leer la documentación de la API",
  },
};
