import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativa a OpenRouter: API OpenAI y Anthropic | {{appName}}",
    description:
      "Compara {{appName}} con OpenRouter. Usa tu SDK de OpenAI con una API para {{modelCount}} modelos de chat y {{mediaModelCount}} modelos multimedia.",
    category: "Guía para Desarrolladores",
    imageAlt: "{{appName}} : un punto final API para cada modelo",
    keywords:
      "{{appName}}, OpenRouter alternativa, una API para GPT Claude Gemini, OpenAI compatibles API, OpenAI compatibles API muchos modelos, Anthropic API endpoint compatible, API Anthropic Messages, Respuestas API, uso Claude Code con otros modelos, Codex CLI proveedor personalizado, LLM API pasarela, modelos sin censura API, OpenAI imagen compatible API, texto al discurso API, Whisper API, generación de vídeo API, generación de música API",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Guía para Desarrolladores",
    readTime: "11 min leer",
    title: "Una clave de API. {{modelCount}} modelos. Tres formatos.",
    subtitle:
      "Usa Chat Completions, Responses o Anthropic Messages con una sola clave de {{appName}}. Conserva tu SDK, cambia la URL base y la clave y revisa el identificador del modelo. La misma clave funciona con {{mediaModelCount}} modelos multimedia.",
  },
  intro: {
    lead: "GPT de OpenAI, Claude de Anthropic, Gemini de Google. Tres SDKs, tres llaves, tres facturas, tres paneles. O peor: la herramienta que te gusta sólo habla un formato, por lo que solo consigue los modelos de un vendedor.",
    p2: "{{appName}} pone modelos de chat {{modelCount}} de laboratorios {{providerCount}} detrás de una llave y un saldo de crédito. Llámalos en el formato OpenAI, el formato Responses o el formato Anthropic. Los mismos modelos en cada punto final. Aquí es exactamente cómo funciona, lo que cuesta, y donde ir directo o usar un router es la mejor llamada.",
    access:
      "Arriba: el API necesita una cuenta pagada. Cualquier plan, de {{subPrice}} al mes, lo desbloquea. Los créditos gratis y extras no.",
    accessLink: "Desbloquear el API",
  },
  endpoints: {
    title: "Cada punto final, una clave",
    intro:
      "Cada punto final toma la misma llave y factura el mismo saldo. Los tres formatos de chat sirven los mismos modelos.",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions. Streaming sobre SSE que termina con datos: [ DONE ], stream_options.include_usage, llamada de herramienta. El formato casi todos los clientes compatibles con OpenAI hablan.",
    responses:
      "POST /v1/responses: las respuestas OpenAI API, el formato Codex CLI habla. Streaming y herramientas. Apátridas: la tienda es falsa y previous_response_id es rechazada con 400, así que envía la entrada completa cada vuelta.",
    messages:
      "POST /v1/messages: el API Anthropic Messages. Streaming y uso de herramientas. Esto es con lo que hablan Claude Code y los SDKs Anthropic.",
    countTokens:
      "POST /v1/messages/count_tokens : no cuesta créditos. Una estimación local, sin llamada modelo, y no cuenta con el límite de tarifas por minuto. El Claude Code lo llama constantemente a tamaño su contexto.",
    models:
      "GET /v1/models: cada modelo que tu clave pueda llamar ahora mismo, con longitud de contexto, soporte de herramientas y precios. Un cuerpo de respuesta que tanto el OpenAI como los SDKs Anthropic parse.",
    media:
      "Medios en formato OpenAI, modelos {{mediaModelCount}}: POST /v1/images/generaciones y /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions y /v1/audio/traducciones. Video (POST /v1/videos) y música (POST /v1/music) funcionan como trabajos de asinc: inicio, votación, descarga. GET /v1/models marca cada modelo con su modalidad.",
    auth: "Auth trabaja dos maneras, en cada punto final. Authorization: Bearer sk-unb-... para clientes OpenAI y para Claude Code con ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... para los SDKs Anthropic. Las claves comienzan con sk-unb-, se muestran una vez y se almacenan sólo como un hash. Creelas bajo Configuración > Claves de API, hasta 20 teclas activas por cuenta.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "Para OpenAI SDKs y OpenAI: herramientas de estilo. El lugar es parte del camino. Sólo establece el lenguaje de los mensajes de error, y cualquier local soportado trabaja, pero tiene que estar allí.",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Para los SDKs Anthropic y Claude Code. Mismo URL sin /v1: ellos anexan /v1/messages ellos mismos.",
  },
  switching: {
    title: "Cómo cambiar de OpenRouter a {{appName}}",
    intro:
      "¿Buscas una alternativa a OpenRouter? Ambos servicios aceptan solicitudes de Chat Completions en formato OpenAI. Conserva tu SDK de OpenAI y actualiza su configuración.",
    key: "Activa el acceso a la API en tu cuenta de {{appName}} y crea una clave nueva en la configuración.",
    baseUrl:
      "Configura el cliente de OpenAI con la URL base indicada arriba para tu idioma, incluido /v1.",
    model:
      "Llama a GET /v1/models en la nueva API y usa uno de los identificadores devueltos en el campo model.",
    routing:
      "Antes del cambio, revisa las opciones de enrutamiento propias de OpenRouter. Prueba con el modelo elegido las funciones que usa tu aplicación, como la transmisión en tiempo real o las llamadas a herramientas.",
    openrouterDocs: "Referencia de la API de OpenRouter",
  },
  samples: {
    title: "Código: su SDK, nuestra base URL",
    intro:
      "No hay nueva biblioteca de clientes. Los SDK oficiales OpenAI y Anthropic funcionan como son. Reemplazar sk-unb-YOUR_KEY con tu llave.",
    curl: {
      title: "curl",
      body: "La prueba más rápida de que tu llave funciona. Una finalización de chat simple, nada para instalar.",
      caption: "Terminaciones de chat con curl",
    },
    openai: {
      title: "OpenAI Python SDK",
      body: "Establecer base_url y api_key en el cliente, luego llamar chat.completions.crear como de costumbre. Cualquier modelo de GET /v1/models va en el campo modelo, Claude y Gemini incluidos.",
      caption: "Concluciones de chat con OpenAI SDK",
      responses:
        "El mismo cliente también habla las Respuestas API. Llame al cliente.responses.crear. Recuerde que es apátridas aquí: pasar toda la conversación como entrada cada vuelta.",
      responsesCaption: "Respuestas API con el OpenAI SDK",
    },
    anthropic: {
      title: "Anthropic Python SDK",
      body: "Establecer base_url sin /v1 y su clave como api_key, luego llamar mensajes.crear. Los modelos de resonancia pusieron un bloque de pensamiento primero, por lo que la muestra imprime el bloque de texto, no el primer bloque.",
      caption: "Mensajes API con el Anthropic SDK",
      countTokens:
        "¿Necesitas un tamaño antes de enviar? count_tokens devuelve una estimación sin llamar a un modelo. No se gastan créditos.",
      countTokensCaption: "Cuenta fichas con rizo",
    },
    models: {
      title: "Listar los modelos",
      body: "GET /v1/models es la fuente de la verdad. Muestra exactamente qué ids puede llamar tu clave, con longitud de contexto, soporte de herramientas y precio por ficha.",
      caption: "Lista de modelos con curl",
    },
    media: {
      title: "Imágenes, voz, vídeo, música",
      body: "La misma llave, la misma base URL, OpenAI 's formas de medios. Las imágenes y los clientes de audio OpenAI SDK funcionan sin cambios. Elija un modelo con la modalidad de emparejamiento de GET /v1/models.",
      imageCaption: "Generar una imagen con rizar",
      async:
        "El video y la música tardan minutos, así que corren como trabajo. POST responde de inmediato con un id. Votarlo de forma gratuita, y luego descargar el archivo. Un trabajo fallido no cuesta nada.",
      videoCaption: "Iniciar un trabajo de vídeo",
      pollCaption: "Votar, luego descargar el MP4",
    },
  },
  ids: {
    title: "ID de modelos: nuestros o del proveedor",
    intro:
      "Usted no tiene que reescribir los configs que ya nombre un modelo. Aceptamos las ortografías comunes.",
    ours: "Nuestros ids, como GET /v1/models los enumeran: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Usa estos cuando empieces de nuevo.",
    vendor:
      "Las ortografías del vendedor también funcionan. Los ids Anthropic (claude-sonnet-4-5-20250929 se resuelven a claude-sonnet-4.5), números de versión desgarrados, -sufijos más recientes, el sufijo del contexto [1m] y ids puntados como gpt-5.5.",
    prefix:
      "Para los modelos compatibles, la API reconoce prefijos habituales como anthropic/ y openai/.",
    claudeFallback:
      "En /v1/messages only: a Claude id tu cuenta no puede llamar, como Claude Code incorporado envía para sus llamadas de fondo, cae al Claude más nuevo de la misma familia (Opus, Sonnet o Haiku) que puedes llamar. El Claude Code funciona sin vars env adicionales. Cualquier otro id desconocido devuelve 404 model_not_found.",
  },
  tools: {
    title: "Use Claude Code y Codex CLI con otros modelos",
    intro:
      "Ambos se conectan directamente. Sin proxy, sin capa de traducción, nada para instalar.",
    p1: "Cada snippet predetermina a {{model}}. Promulgó Claude Code real y funciona Codex CLI, llama las herramientas de forma fiable y cuesta poco por token de salida. Trápalo por cualquier id una vez que las cosas funcionen.",
    claudeCode:
      "Esa es la respuesta completa a usar Claude Code con otros modelos. ANTHROPIC_BASE_URL nos lo señala, ANTHROPIC_AUTH_TOKEN lleva tu llave y las variables modelo deciden qué funciona. Reemplazar el modelo id con cualquier id de GET /v1/models: GPT, Gemini, Kimi, DeepSeek o un modelo sin censura. CLAUDE_CODE_MAX_CONTEXT_TOKENS se fija en la ventana de contexto real de ese modelo, por lo que Claude Code compacta en el punto correcto.",
    codex:
      "Codex CLI obtiene un proveedor de modelos personalizado con wire_api establecido en respuestas. Habla las respuestas API con nosotros exactamente como lo hace a OpenAI. Cambia el modelo con -m.",
    others:
      "OpenCode, Continue, Aider y Cline también trabajan, todos probados. Sus configuraciones, los archivos de configuración permanentes y las gotchas que golpeamos están en la guía de herramientas de codificación.",
    guideLink: "Configurar cada herramienta de codificación",
  },
  picks: {
    title: "Que modelo para qué trabajo",
    intro:
      "Cada modelo de abajo soporta la llamada de herramientas. Haga clic en un nombre por su precio y sus especificaciones, copie el id en su código.",
    frontier: {
      title: "Frontier: el código más difícil y el razonamiento",
      body: "Grandes refactores, codebases desconocidas, largas cadenas de razonamiento. Precio más alto por token, menos giros equivocados.",
    },
    cheap: {
      title: "barato y rápido: bucles, vracs, llamadas de fondo",
      body: "Los circuitos de agentes que envían grandes impulsos, trabajos de lotes, clasificación, las herramientas de codificación llamadas de fondo se disparan todo el día. Una fracción de precios fronterizos.",
    },
    uncensored: {
      title: "Sin censura: sin reflejo de rechazo",
      body: "GLM 5.3 Uncensored y Qwen 3.6 Plus Uncensored son modelos principales con los rechazos eliminados. UncensoredLM v1.2 es diferente: entrenada en libros y documentos prohibidos desde Internet corriente, no sólo un modelo despojado. Mismo API, las mismas herramientas.",
    },
    compare:
      "¿Torn entre dos? Las páginas de comparación pusieron dos modelos lado a lado.",
    compareLink: "{{a}} vs {{b}}",
    allModels: "Todos los modelos {{modelCount}}",
  },
  billing: {
    title: "Lo que cuesta",
    intro: "Créditos, facturados por token. Sin cargos de asiento.",
    price:
      "La mayoría de los modelos facturan a su precio per-token listado más nuestra marcación. Factura de fichas de entrada en caché del modelo. Modelos servidos a través de la factura OpenRouter el costo real OpenRouter cobrado por la llamada, además de la misma marca.",
    reported:
      "Cada respuesta reporta el uso. credits_charged. Nunca tienes que adivinar lo que cuesta una llamada.",
    preflight:
      "Antes de que una llamada se ejecute, su saldo se comprueba en contra de una estimación peor. No lo suficiente significa HTTP 402 insufficient_credits : nada funciona, nada se carga.",
    abort:
      "Streaming: cierra la conexión y para la generación. Pagas sólo por lo que corrió. Lo mismo si el proveedor falla a mitad de la corriente.",
    chat: "Chat y API facturan de la misma manera. OpenRouter extiende un modelo a través de varios anfitriones, y algunos cobran más que el más barato que listamos. Así que para esos modelos el precio listado es una estimación, y el uso. credits_charged es el número real. Si OpenRouter no reporta ningún costo para una llamada, factura al precio listado.",
    media:
      "Los medios de comunicación facturan de la misma manera: el costo real del proveedor más nuestra marcación donde el proveedor lo reporta, el precio por modelo enumerado de otra manera. Imágenes por imagen, voz por personaje, transcripción por segundo de audio, vídeo y música una vez que el archivo esté listo.",
    paid: "El mismo saldo de crédito que la aplicación chat. El API necesita una cuenta pagada: cualquier plan. Los créditos gratis no lo desbloquean.",
    sub: "Planes mensuales: cuatro tamaños, comenzando en créditos {{subCredits}} para {{subPrice}}.",
    pack: "Paquetes para recargar los créditos de tu suscripción. {{packCredits}} créditos por {{packPrice}}. Nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    link: "Ver planes y precios",
  },
  versus: {
    title: "¿Ir directo, usar un router o utilizarnos?",
    intro: "Tres opciones honestas. Cada uno es el adecuado para alguien.",
    direct: {
      title: "Dirigiéndose directamente a OpenAI, Anthropic o Google",
      body: "Las características más nuevas de la primera parte aterrizan allí primero. No hay marca de intermediario. Los términos de un vendedor para leer. Si solo usas los modelos de un vendedor, ve directo.",
    },
    router: {
      title: "Un agregador como OpenRouter",
      body: "OpenRouter ofrece una API para varios modelos con selección de proveedor y opciones de respaldo. También procesa algunas de nuestras solicitudes a modelos.",
    },
    here: {
      title: "{{appName}}",
      body: "Una clave en tres formatos de alambre: finalizaciones de chat, respuestas y mensajes Anthropic con count_tokens. Claude Code y Codex CLI se conectan sin un proxy. Los modelos no censurados se sientan al lado de los principales, detrás de una confirmación de 18+ de una sola vez. El mismo saldo paga por la aplicación chat y el API, desde créditos de suscripción o paquetes. Y {{appName}} es de código abierto y autoanfitriona.",
    },
    verdict:
      "Compara los catálogos y las funciones de enrutamiento que necesitas. Si quieres llamar a modelos sin censura por API y usar el mismo saldo en el chat, revisa los modelos disponibles con tu clave de {{appName}}.",
  },
  limits: {
    title: "Límites que deberías saber",
    intro: "No hay sorpresas en la producción. Estos son los bordes duros.",
    stateless:
      "Apátridas. Las Respuestas API corre con la tienda puesta a falso y rechaza previous_response_id. Envía la historia completa cada vuelta. Eso tiene por cada punto final.",
    maxTokens: "La salida está cubierta por tokens {{maxTokens}} por petición.",
    rateLimit:
      "{{rateLimit}} solicita por minuto por tecla por defecto. Sobre el límite se obtiene 429 con un encabezado Retry-After. Los agentes que disparan muchas llamadas tienen su propia llave.",
    countTokens:
      "count_tokens es una estimación, no el tokenizador exacto del proveedor. Bien por el contexto del tamaño, no por la facturación de matemáticas.",
    tools:
      "Las llamadas de herramientas solo funcionan en modelos que los apoyan. De lo contrario tienes 400 tools_not_supported. GET /v1/models muestra supports_tools para cada modelo.",
    consent:
      "Los modelos no censurados necesitan una confirmación de 18+ única en la página de teclas API. Sin ella usted consigue 403 uncensored_consent_required, y nada se cobra.",
    localeUrl:
      "Los dos errores clásicos de configuración, ambos un 404. Uno: dejar el lugar del camino. La base URL es /api/ <locale> /v1, no /api/v1. Dos: mantener /v1 en la base Anthropic URL. Claude Code y los SDK de Anthropic apéndice /v1/mess ellos mismos, por lo que /v1 dos veces significa que no se encuentra nada.",
  },
  privacy: {
    title: "¿Qué le pasa a tus avisos?",
    intro: "Versión corta: guardamos la cuenta, no la conversación.",
    noStore:
      "El API no guarda ninguna conversación y no crea hilos. Lo que queda de nuestro lado es el registro de facturación: qué modelo, cuántos créditos.",
    upstream:
      "Su mensaje va al proveedor que sirve el modelo. Sus términos se aplican a lo que recibe.",
    incognito:
      "En la aplicación de chat, los chats incognito viven sólo en el almacenamiento local de su navegador, no en nuestros servidores.",
    selfHost:
      "{{appName}} es fuente abierta (MIT y GPL v3). Ejecute su propia instancia con sus propias llaves del proveedor y pague directamente a los proveedores.",
    selfHostLink: "Auto hospedarlo",
  },
  faq: {
    title: "FAQ",
    openrouter: {
      q: "¿Es {{appName}} una alternativa OpenRouter?",
      a: "{{appName}} ofrece Chat Completions, Responses y Anthropic Messages con una sola clave. Tras confirmar que tienes al menos 18 años, puedes llamar a modelos sin censura y usar el mismo saldo en el chat y la API. Algunas solicitudes se procesan a través de OpenRouter.",
    },
    openrouterModels: {
      q: "¿Puedo conservar mis identificadores de modelos de OpenRouter al cambiar de API?",
      a: "Algunos identificadores con prefijo de proveedor funcionan si el modelo correspondiente está disponible. Comprueba la disponibilidad con GET /v1/models y copia el identificador exacto que devuelve la nueva API.",
    },
    claudeCode: {
      q: "¿Puedo usar Claude Code con modelos no Claude?",
      a: "Sí. Establecer ANTHROPIC_BASE_URL a la base {{appName}} Anthropic URL, poner su llave en ANTHROPIC_AUTH_TOKEN y elegir cualquier modelo id de GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek y los modelos sin censura funcionan de esa manera en Claude Code.",
    },
    sdk: {
      q: "¿Necesito un nuevo SDK?",
      a: "Usa el SDK oficial de OpenAI o Anthropic. Configura la URL base correspondiente, agrega tu clave de API y elige el identificador de un modelo disponible.",
    },
    free: {
      q: "¿Hay un tier gratis para el API?",
      a: "No. Los créditos gratis se pueden usar en la aplicación de chat. Para usar la API necesitas un plan, desde {{subCredits}} créditos al mes por {{subPrice}}. Los suscriptores pueden recargar con paquetes de {{packCredits}} créditos por {{packPrice}} que nunca vencen.",
    },
    pricing: {
      q: "¿Es el precio indicado lo que pago?",
      a: "Para la mayoría de los modelos, sí: cotización por ficha más nuestra marcación. Modelos servidos a través de OpenRouter factura el costo real OpenRouter cobrado por la llamada, además de la misma marca, en la aplicación chat y en el API por igual. Su precio listado es una estimación. Cada respuesta reporta la carga exacta en el uso. credits_charged.",
    },
    models: {
      q: "¿Qué modelos puedo llamar?",
      a: "Modelos de chat {{modelCount}} en este momento: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen y modelos sin censura. Más modelos de imagen, video, música, voz y transcripción {{mediaModelCount}}. GET /v1/models lista exactamente lo que su clave puede llamar, con precios.",
    },
    data: {
      q: "¿{{appName}} guarda mis indicaciones?",
      a: "No del API. No se almacena ninguna conversación, sólo el registro de facturación: modelo y créditos cargados. El proveedor que sirve al modelo ve el aviso, bajo sus propios términos.",
    },
    docsLink: "Leer la referencia completa API",
    pricingLink: "Ver planes y precios",
  },
  partners: {
    body: "¿Construir herramientas o contenidos para desarrolladores? El programa de socios {{appName}} le paga una parte recurrente de cada pago que se refiere.",
    link: "Únase al programa partner",
  },
  cta: {
    title: "Una llave. Cada modelo. Empieza ahora.",
    subtitle:
      "Cree una llave, cambie una base URL, mantenga su SDK. Los docs API cubren cada punto final, campo y código de error.",
    key: "Crear una tecla API",
    docs: "Lea los documentos API",
  },
};
