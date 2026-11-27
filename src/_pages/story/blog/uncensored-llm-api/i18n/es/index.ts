import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API de LLM sin censura: modelos abliterados | {{appName}}",
    description:
      "Modelos sin censura y abliterados detrás de una sola API compatible con OpenAI y Anthropic. Ids de modelo, precios frente a otros hosts, qué permiten de verdad Vertex, Azure, Bedrock y Together, código y límites.",
    category: "Guía para desarrolladores",
    imageAlt: "API de LLM sin censura con endpoints compatibles con OpenAI",
    keywords:
      "API LLM sin censura, API IA sin censura, API de modelos abliterados, LLM abliterated API, API LLM sin filtro de contenido, API compatible con OpenAI sin censura, API LLM NSFW, Gemini API safety settings off, Vertex AI sin censura, Together AI sin censura, alternativa sin censura a Azure OpenAI, alternativa sin censura a Bedrock, modelos abliterados alojados, alternativa a la API de Venice, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía para desarrolladores",
    readTime: "12 min de lectura",
    title: "API de LLM sin censura. Tu SDK. Sin reflejo de negativa.",
    subtitle:
      "{{count}} modelos sin censura detrás de una sola clave compatible con OpenAI y Anthropic. IDs, contexto y precios leídos en directo de nuestro registro.",
  },
  intro: {
    lead: "Tu aplicación necesita un modelo que responda. No uno que sermonee ni uno que rechace la mitad de tus prompts de prueba. Las API convencionales filtran por diseño, y ejecutar tú mismo pesos abliterados significa alquilar GPU.",
    p2: "{{appName}} sirve {{count}} modelos sin censura en los mismos endpoints /v1 que cualquier modelo convencional. Cambia la base URL, conserva el SDK de OpenAI o Anthropic, elige un id sin censura. Aquí tienes la lista, el código, los precios junto a otros hosts, qué permiten de verdad las grandes nubes y la pega honesta.",
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
      "Sin límite fijo de peticiones. El consumo se cobra por solicitud desde tus créditos y se aplica una protección antiabuso generosa. Los 429 de los proveedores pasan con la cabecera Retry-After.",
    tools:
      "Las llamadas a herramientas solo funcionan en modelos que las admiten. La tabla indica cuáles. Si no, recibes 400 tools_not_supported.",
    refusals:
      "Sin censura no significa infalible. Un modelo aún puede negarse o equivocarse con los hechos. Prueba tus prompts en dos modelos antes de decidir.",
  },
  privacy: {
    title: "Qué pasa con tus prompts",
    intro: "Nos quedamos con la factura, no con la conversación.",
    noStore:
      "La API no crea hilos de chat. Lo único que registra es la entrada de facturación: qué modelo, cuántos créditos.",
    upstream:
      "Cada prompt pasa por nosotros hasta el proveedor que sirve el modelo. A lo que recibe se le aplican sus condiciones. Nuestra política de privacidad no hace una promesa aparte de no guardar logs ni de no entrenar: júzganos por lo que sí dice.",
    callout:
      "Si tus prompts no pueden salir nunca de tu infraestructura, ejecuta pesos abliterados en tu propio hardware. Para todo lo demás, la API llega antes a producción.",
  },
  abliterated: {
    title: "API de modelos abliterados: quién sirve qué pesos",
    intro:
      "Los mismos pesos abliterados están en varios hosts. Esto cobra cada uno por token, leído hoy de sus listas públicas de modelos.",
    honest:
      "Lectura honesta: los routers ganan en precio. OpenUncensored y Refuseless venden GLM 5.3 Flash y DeepSeek V4.1 Flash abliterated a $0.12 de entrada. Nuestro precio listado lleva un margen del {{markup}}%. Lo pagas por una sola clave que cubre modelos sin censura, abiertos y convencionales, medios, el formato de Anthropic y un chat que tu equipo puede usar.",
  },
  noFilter: {
    title:
      "API LLM sin filtro de contenido: qué significa de verdad desactivado",
    intro:
      "Todas las grandes nubes te dejan bajar un filtro. Ninguna elimina los rechazos entrenados del modelo ni su política de uso.",
    vertex:
      "Vertex AI y la API de Gemini: los umbrales de seguridad pasan a OFF, y OFF es el valor por defecto en Vertex desde gemini-3.5-flash. La seguridad infantil y otros daños principales siguen bloqueados, y el alineamiento de Gemini sigue rechazando. La Prohibited Use Policy de Google prohíbe el contenido sexualmente explícito y eludir los filtros de seguridad, con excepciones para trabajo educativo, documental, científico o artístico. Pesos propios: autodespliegue desde Model Garden en contenedores vLLM o TGI.",
    together:
      "Together AI: 24 modelos de chat serverless, ninguno sin censura. Sus términos prohíben el contenido obsceno y la pornografía. Los pesos propios corren en endpoints dedicados desde $5.49 por hora de H100, y lo que subas debe ser un fine-tune de una arquitectura que Together ya admita.",
    azure:
      "Azure OpenAI: filtros activos por defecto, desactivables solo tras una solicitud aprobada, y el Code of Conduct prohíbe de todos modos los chatbots eróticos y románticos.",
    bedrock:
      "AWS Bedrock: ningún filtro salvo que adjuntes un Guardrail, pero los rechazos y la política de AWS se mantienen. Los pesos abliterados necesitan Custom Model Import, facturado por minuto de capacidad.",
    azureLink: "Alternativas sin censura a Azure OpenAI, al detalle",
    bedrockLink: "Alternativas sin censura a AWS Bedrock, al detalle",
  },
  others: {
    title: "Otras API sin censura, sin rodeos",
    intro:
      "No somos la única opción. A algunos de ellos les compramos nosotros mismos. Datos sacados de su propia documentación, sus listas de modelos y sus páginas de precios, leídos el {{date}}.",
    versusLink: "{{appName}} vs {{name}}: comparación completa",
    routerLink:
      "Dejar OpenRouter: una clave para todos los modelos, tres formatos de API",
    openRouterAlternatives: "Alternativas a OpenRouter, comparadas",
    veniceAlternatives: "Alternativas a Venice AI, comparadas",
    freedomGptAlternatives: "Alternativas a FreedomGPT, comparadas",
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
      a: "La API no escribe hilos de chat, solo el registro de facturación: modelo y créditos cobrados. Cada prompt pasa por nosotros hasta el proveedor que sirve el modelo, bajo sus propias condiciones. Nuestra política de privacidad no hace una promesa aparte de no guardar logs. Si lo necesitas por contrato, autoaloja.",
    },
    abliterated: {
      q: "¿Qué API sirve modelos abliterados?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice y {{appName}} sirven pesos abliterados en una API compatible con OpenAI. Los routers son los más baratos por token. {{appName}} añade modelos convencionales, medios y un chat web con la misma clave.",
    },
    noFilter: {
      q: "¿Existe una API LLM sin filtro de contenido?",
      a: "Bedrock sin Guardrail y Gemini con los ajustes de seguridad en OFF no añaden ninguna capa de filtro, pero sus modelos mantienen rechazos entrenados y sus políticas prohíben el contenido sexual. Azure necesita una solicitud aprobada para desactivar los filtros. Para modelos que no rechazan, usa pesos abliterados o fine-tuned: alojados aquí o en los routers de arriba, o en tus propias GPU.",
    },
    vertex: {
      q: "¿Puedo desactivar los filtros de seguridad de Gemini?",
      a: "Sí. En la API de Gemini, las categorías que no configuras están en Off por defecto desde Gemini 2.5, y en Vertex OFF es el valor por defecto desde gemini-3.5-flash. Los daños principales, como la seguridad infantil, siguen bloqueados, los rechazos entrenados de Gemini se mantienen, y la política de Google prohíbe el contenido sexualmente explícito y eludir los filtros de seguridad.",
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
