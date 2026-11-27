import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a OpenRouter sin censura, comparadas | {{appName}}",
    description:
      "OpenRouter no lista modelos abliterados. Compara OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice, Featherless y {{appName}} en modelos sin censura, comisiones, privacidad y formatos de API.",
    category: "Guía para desarrolladores",
    imageAlt:
      "Alternativas a OpenRouter sin censura para desarrolladores, comparadas",
    keywords:
      "alternativa a OpenRouter sin censura, alternativa a OpenRouter, alternativas a OpenRouter, modelos sin censura en OpenRouter, API de modelos abliterados, API de LLM sin censura, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter vs NanoGPT, webs como OpenRouter, pasarela de API de LLM, API compatible con OpenAI, API compatible con Anthropic, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía para desarrolladores",
    readTime: "11 min de lectura",
    title: "Alternativas a OpenRouter sin censura",
    subtitle:
      "{{count}} alternativas y {{appName}}, comparadas en cobertura sin censura, formatos de API y comisiones. Comprobado el {{date}}.",
  },
  intro: {
    lead: "OpenRouter pone 477 modelos detrás de una sola clave. Para trabajo sin censura la estantería es corta: 17 tunes de rol o sin censura, y ni un solo modelo abliterado.",
    p2: "Así que revisamos hosts de API sin censura, hosts de tarifa plana para rol, pasarelas y apps con su propia documentación, precios y listas de modelos. Nosotros también compramos acceso a modelos en OpenRouter: {{openRouterModels}} de los nuestros pasan por ahí.",
  },
  shelf: {
    title: "Lo que ofrece OpenRouter para trabajo sin censura",
    intro:
      "Según su lista pública de modelos y sus términos, leídos el {{orDate}}.",
    tunes:
      "17 de 477 modelos encajan con rol o sin censura por nombre o descripción: Venice Uncensored (un tune de Dolphin Mistral 24B), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax y un puñado de modelos Aion RP.",
    abliterated:
      "Ningún ID de modelo contiene abliterated ni uncensored. Las versiones abliteradas de GLM 5.3, DeepSeek V4.1 Flash y Kimi K3.1 Pro que venden los routers sin censura no están.",
    rules:
      "Reglas: mayores de 18, revisión automática de CSAM y, por lo demás, los términos de cada modelo. Los modelos estándar siguen rechazando lo que rechazan sus fabricantes.",
    callout:
      "¿Necesitas pesos abliterados? OpenRouter es el router equivocado. ¿Necesitas fine-tunes de rol? Tiene una estantería decente.",
  },
  apis: {
    title: "Alternativas de API sin censura, una a una",
    intro:
      "Servicios que nacen como API y venden pesos abliterados o sin censura. Según sus propias páginas, leídas el {{marketDate}}.",
    visit: "Visitar {{name}}",
    openUncensored: {
      heading: "OpenUncensored: un router solo de modelos sin censura",
      body: "58 modelos de texto, 20 de imagen y 3 de video, casi todos abliterados, enrutados a Venice, NanoGPT, Refuseless y otros. Sin comisión sobre los precios de los proveedores, recargas desde 5 USD que nunca caducan y sin cuenta: tu clave de API es la cuenta. OpenAI, Responses y Anthropic Messages en una sola URL base.",
      catch:
        "La pega: sin plan gratis, sin chat web (solo una app de escritorio) y metadatos de las solicitudes guardados hasta dos años.",
    },
    refuseless: {
      heading:
        "Refuseless: las versiones abliteradas más baratas que encontramos",
      body: "GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash y Kimi K3.1 Pro abliterados con contexto de 1M. DeepSeek V4.1 Flash abliterado cuesta 0,12 USD de entrada y 0,45 USD de salida por millón de tokens. Chat completions, Responses y Anthropic Messages, Claude Code incluido.",
      catch:
        "La pega: solo API, exige un correo verificado y sus páginas de precios, privacidad y términos bloquearon a nuestro lector.",
    },
    nearAi: {
      heading: "NEAR AI Cloud: modelos abliterados en computación confidencial",
      body: "Atestación por hardware, de modo que ni NEAR ni el host de la nube pueden leer tus prompts, según dice. Dos modelos abliterados: Qwen 3.8 27B a 0,04 USD de entrada y 1,35 USD de salida por millón de tokens, y DeepSeek V4.1 Flash 1017. Sin solicitud de acceso ni verificación de identidad, y se paga por token.",
      catch: "La pega: solo formato OpenAI y una oferta sin censura mínima.",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai: el mayor catálogo sin censura",
      body: "332 modelos de chat más 13 de imagen y video, con una revisión diaria de rechazos. Formatos OpenAI, Anthropic y Gemini con una sola clave prepago. Tarjeta o cripto desde 3 USD, y el saldo nunca caduca.",
      catch:
        "La pega: prohibida la reventa o una API refacturada sin permiso por escrito. En las páginas que leímos no había términos de privacidad.",
    },
    abliterationAi: {
      heading:
        "abliteration.ai: modelos abliterados propios, privacidad por escrito",
      body: "Modelos abliterados propios en formatos OpenAI y Anthropic. Dice que los prompts y las salidas se procesan en memoria, no se guardan por defecto y nunca se usan para entrenar. Opción de región de la UE, más una pasarela de políticas para tus propias reglas.",
      catch:
        "La pega: más caro que Refuseless o NEAR AI para pesos parecidos, y no nombra los modelos base.",
    },
    flatRate: {
      heading:
        "Featherless, Infermatic, Arli AI: tarifa plana para rol intensivo",
      body: "Featherless lista más de 50.000 modelos de Hugging Face, 1.398 etiquetados como abliterated, con un plan Chat de tarifa plana de 25 USD. Infermatic vende tunes de rol de 70B curados desde 9 USD al mes. Arli AI ofrece planes de tokens ilimitados desde 15 USD con fine-tunes derestricted. Los tres dicen que no guardan logs de prompts.",
      catch:
        "La pega: los planes personales no pueden alimentar apps, y tienes de 1 a 6 solicitudes en paralelo.",
    },
    deepInfra: {
      heading: "DeepInfra: modelos estándar baratos, ninguno sin censura",
      body: "De los más baratos por token en modelos abiertos estándar: DeepSeek V4.1 Flash a 0,14 USD de entrada y 0,42 USD de salida por millón de tokens, con 200 solicitudes simultáneas por modelo. Dice que las entradas de la API nunca se guardan en disco.",
      catch: "La pega: su catálogo no incluye modelos sin censura ni de rol.",
    },
  },
  gateways: {
    title: "Si solo necesitas un router",
    intro:
      "Las pasarelas enrutan a los proveedores que tú configuras. Ninguna añade modelos sin censura.",
    vercel:
      "Vercel AI Gateway: alojado, precio del proveedor por token sin margen, pensado para el AI SDK.",
    selfHost:
      "LiteLLM o Bifrost: código abierto, autoalojados, con tus propias claves de proveedor, presupuestos y fallbacks.",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone: barreras de seguridad, caché, logs de solicitudes y control de gasto por encima.",
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
    weak: "Dónde flojeamos: OpenRouter no aplica margen sobre la inferencia, solo una comisión del 5,5 % al comprar créditos. Nosotros añadimos un {{markup}}% a lo que pagamos. Él te deja traer tus propias claves de proveedor, enrutar solo a endpoints de retención cero de datos y elegir proveedores en cada solicitud. Nosotros no tenemos nada de eso. Y los routers abliterados de arriba nos superan en precio en todos los modelos que compartimos.",
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
    title: "Apps con una API sin censura, una a una",
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
      a: "Depende de lo que te falte en OpenRouter. Pesos abliterados a precio del proveedor: OpenUncensored, Refuseless o NEAR AI Cloud. El mayor catálogo sin censura: UncensoredLLM.ai o Featherless. Pago por uso con cripto: NanoGPT. Los modelos propios de Venice y sus modos de privacidad: Venice. En local y gratis: Ollama. Modelos sin censura, abiertos y convencionales, más medios y un chat de equipo con una sola clave: {{appName}}.",
    },
    cheaper: {
      q: "¿Hay una alternativa más barata a OpenRouter?",
      a: "Compara el precio por modelo, no la comisión. OpenRouter no añade margen a la inferencia, OpenUncensored no cobra comisión, y Refuseless y NEAR AI Cloud listan las versiones abliteradas más baratas que encontramos. En {{appName}} pagas lo que pagamos nosotros más un margen del {{markup}}%, y cada página de modelo muestra el precio por mensaje.",
    },
    uncensored: {
      q: "¿Qué alternativa a OpenRouter tiene modelos sin censura?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI y {{appName}} sirven modelos sin censura por API. {{appName}} tiene ahora {{apiUncensored}} en su API, abliterados y afinados junto a {{ownModel}}.",
    },
    sdk: {
      q: "¿Puedo mantener mi código de OpenAI SDK?",
      a: "Sí. Cambia la URL base y la clave de API, el resto se queda. Los ids de modelo cambian entre pasarelas, así que cámbialos también. Ejemplo: {{example}}.",
    },
    anthropic: {
      q: "¿Funciona con los SDK de Anthropic y los agentes de código?",
      a: "En {{appName}}, sí: la API de Anthropic Messages funciona junto a los formatos de OpenAI, así que Claude Code y otros agentes se conectan con una sola clave, modelos sin censura incluidos. OpenUncensored, Refuseless, NanoGPT y UncensoredLLM.ai también hablan Anthropic Messages. Venice no tiene endpoint nativo y manda a Claude Code a un proxy local.",
    },
    free: {
      q: "¿Hay una alternativa gratis a OpenRouter?",
      a: "Ollama es gratis si tu hardware aguanta el modelo. OpenRouter tiene 11 modelos gratis con límites diarios, e Infermatic tiene un plan web gratis. {{appName}} da créditos de chat gratis cada mes, y la API se desbloquea con tu primera compra.",
    },
    apiLink: "API LLM sin censura: ids de modelo, código y límites",
    veniceLink: "Alternativas a Venice AI, comparadas",
    nanoGptLink: "Alternativas a NanoGPT, comparadas",
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
