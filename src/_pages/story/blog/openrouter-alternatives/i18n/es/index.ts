import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a OpenRouter con modelos sin censura | {{appName}}",
    description:
      "Compara OpenRouter con Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT y {{appName}}. Comisiones, alojamiento propio, filtros y privacidad.",
    category: "Guía para desarrolladores",
    imageAlt: "Alternativas a OpenRouter para desarrolladores, comparadas",
    keywords:
      "alternativa a OpenRouter, alternativas a OpenRouter, OpenRouter contra NanoGPT, páginas como OpenRouter, pasarela de API para LLM, API LLM sin censura, una clave de API para todos los modelos, API compatible con OpenAI, API compatible con Anthropic, modelos sin censura OpenRouter, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía para desarrolladores",
    readTime: "9 min de lectura",
    title: "Alternativas a OpenRouter para enrutar solicitudes a modelos",
    subtitle:
      "{{count}} alternativas y {{appName}} comparadas: formatos de API, modelos sin censura, comisiones. Revisado el {{date}}.",
  },
  intro: {
    lead: "OpenRouter conecta a varios proveedores con una clave de API y ofrece un chat web. El plan Standard indica una comisión del 5,5 %. Compara otras pasarelas si quieres operar tu propio enrutador, ajustar mejor los límites o cambiar de facturación.",
    p2: "Revisamos pasarelas alojadas, proxies de alojamiento propio y aplicaciones con modelos sin censura en su documentación y precios oficiales. También compramos acceso a OpenRouter. {{openRouterModels}} de nuestros modelos pasan por ese servicio.",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Seis preguntas lo deciden.",
    catalog:
      "Catálogo: cuántos modelos, de cuántos laboratorios, y si están los que usas hoy.",
    uncensored:
      "Modelos sin censura: cuántos tienen los rechazos eliminados y de qué tipo.",
    formats:
      "Formatos: solo OpenAI chat completions, o también la Responses API y la Anthropic Messages API que usan los agentes de código.",
    billing:
      "Cobro: precio de lista más comisión, un margen o una suscripción. Y qué pasa con saldo cero.",
    data: "Datos: si se guardan, registran o usan los prompts para entrenar, y si es opt-in.",
    chat: "Chat: si quien nunca escribe código puede usar los mismos modelos en el navegador.",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: una clave, todo tipo de modelos",
    intro:
      "{{modelCount}} modelos de chat tras una sola clave, {{uncensored}} de ellos sin censura.",
    models:
      "Modelos: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM y Qwen junto a {{uncensored}} modelos sin censura. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet mainstream, lo que da como resultado un modelo con opiniones políticas contrarias.",
    formats:
      "Formatos: OpenAI chat completions, OpenAI Responses API y Anthropic Messages API. Cualquier SDK o agente de código apunta a una sola URL base.",
    billing:
      "Cobro: un único saldo de créditos, nuestro margen del {{markup}} % sobre lo que pagamos. Tu primera compra desbloquea las claves de API, los planes empiezan en {{apiSubPrice}} al mes.",
    chat: "Chat: los mismos modelos en un chat web con carpetas, herramientas y generación de imágenes, vídeo y música. Quien no programa en tu equipo también accede a los modelos.",
    openRouter:
      "OpenRouter incluido: {{openRouterModels}} de nuestros modelos pasan por OpenRouter. Mismos modelos, una sola cuenta junto a los sin censura.",
    weak: "Dónde somos más flojos: el catálogo de OpenRouter es mucho más grande, te deja usar tus propias claves de proveedor y elegir proveedor en cada petición, y sus precios están más cerca del de lista porque nosotros añadimos un margen. Si necesitas un modelo raro, seguramente OpenRouter lo tiene.",
    codeLabel: "Mover un cliente de OpenAI SDK: cambia la URL base y la clave",
    docsLink: "Documentación de la API: endpoints, autenticación y límites",
    formatsLink: "API compatible con OpenAI y Anthropic, explicada",
    toolsLink: "Una clave en Claude Code, Codex CLI, Aider y más",
  },
  models: {
    title: "{{apiUncensored}} modelos sin censura que puedes llamar hoy",
    intro:
      "Cada modelo sin censura de la API, con el id que pasas como model. Del más barato al más caro.",
    colModel: "Modelo",
    colId: "Id de API",
    colContext: "Contexto",
    colPrice: "Por mensaje",
    footnote:
      "Precio de un mensaje de referencia, con nuestro margen del {{markup}} % incluido. La etiqueta bajo cada nombre indica cómo se hizo el modelo.",
  },
  list: {
    title: "Las {{count}} alternativas, una a una",
    intro:
      "Según sus propias páginas, revisado el {{date}}. Qué es cada una, cómo funciona su API, qué modelos tiene y cuánto cuesta.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modelos:",
    price: "Precio:",
    priceValue: "Gratis: {{free}}. De pago: {{plans}}.",
    pro: "Lo mejor:",
    con: "La pega:",
    forWho: "Elígela si:",
    versusLink: "{{appName}} contra {{name}}: la comparación completa",
    visit: "Visitar {{name}}",
  },
  stay: {
    title: "Cuándo OpenRouter sigue siendo la opción correcta",
    intro: "A veces el original es la mejor herramienta.",
    rare: "Necesitas un modelo de nicho o un proveedor concreto que nadie más de esta lista ofrece.",
    callout:
      "Muchos equipos usan dos: OpenRouter para la cola larga y una segunda clave para modelos sin censura y un chat para todo el equipo.",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a OpenRouter?",
      a: "Depende de lo que te falte en OpenRouter. Muchos modelos sin censura y pago por uso: NanoGPT. Solo modelos sin censura, clave prepago sin cuenta: OpenUncensored. Los modelos propios de Venice y privacidad: Venice. Local y gratis: Ollama. Modelos sin censura, abiertos y comerciales más un chat de equipo con una sola clave: {{appName}}.",
    },
    cheaper: {
      q: "¿Hay una alternativa más barata a OpenRouter?",
      a: "Compara el precio por modelo, no la comisión. Las API directas de cada proveedor se saltan cualquier intermediario. Entre pasarelas, los precios varían por modelo y cambian a menudo. En {{appName}} pagas lo que pagamos nosotros más un {{markup}} % de margen, y cada página de modelo muestra el precio por mensaje.",
    },
    uncensored: {
      q: "¿Qué alternativa a OpenRouter tiene modelos sin censura?",
      a: "NanoGPT, OpenUncensored, Venice, uncensored.ai, Gab AI y {{appName}} ofrecen modelos sin censura por API. {{appName}} tiene ahora {{apiUncensored}} en su API, abliterated y afinados junto a {{ownModel}}.",
    },
    sdk: {
      q: "¿Puedo mantener mi código de OpenAI SDK?",
      a: "Sí. Cambia la URL base y la clave de API, el resto se queda. Los ids de modelo cambian entre pasarelas, así que cámbialos también. Ejemplo: {{example}}.",
    },
    anthropic: {
      q: "¿Funciona con los SDK de Anthropic y los agentes de código?",
      a: "En {{appName}}, sí: la Anthropic Messages API funciona junto a los formatos de OpenAI, así que Claude Code y otros agentes se conectan con una sola clave, modelos sin censura incluidos.",
    },
    free: {
      q: "¿Hay una alternativa gratis a OpenRouter?",
      a: "Ollama es gratis si tu hardware aguanta el modelo. El propio OpenRouter tiene modelos gratis con límites diarios. {{appName}} da créditos gratis para el chat cada mes, la API se desbloquea con tu primera compra.",
    },
    apiLink: "API LLM sin censura: ids de modelo, código y límites",
    veniceLink: "Alternativas a Venice AI, comparadas",
    keysLink: "Gestiona tus claves de API",
  },
  cta: {
    title: "Una clave. Todos los modelos. Menos rechazos.",
    subtitle:
      "Prueba primero los modelos en el chat: {{guestCredits}} créditos gratis al mes, sin cuenta.",
    start: "Probar un modelo sin censura",
    docs: "Leer la documentación de la API",
  },
};
