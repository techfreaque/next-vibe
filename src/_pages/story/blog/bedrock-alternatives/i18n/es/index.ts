import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternativa sin censura a AWS Bedrock: APIs comparadas | {{appName}}",
    description:
      "Los Guardrails de Bedrock son opcionales; los rechazos y la política de AWS, no. Custom Model Import con pesos abliterados frente a {{appName}} y Venice.",
    category: "Guía para desarrolladores",
    imageAlt: "Alternativas sin censura a AWS Bedrock, comparadas",
    keywords:
      "alternativa sin censura a AWS Bedrock, alternativa a Bedrock, Bedrock sin guardrails, Bedrock Custom Model Import abliterados, modelo sin censura Bedrock, alternativa a Claude en Bedrock, alternativa a la API Bedrock Converse, API Anthropic Messages, API LLM sin censura, API de modelos abliterados, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía para desarrolladores",
    readTime: "8 min de lectura",
    title: "Alternativas sin censura a AWS Bedrock",
    subtitle:
      "Guardrails, rechazos, la política de AWS y Custom Model Import, leídos en la fuente. Después {{count}} alternativas. Comprobado el {{date}}.",
  },
  intro: {
    lead: "Bedrock no te impone un filtro. Si omites el Guardrail, Bedrock no añade ninguno. El modelo sigue rechazando, la política de AWS sigue vigente y el catálogo no tiene pesos sin censura.",
    p2: "Así que la pregunta real es dónde corren los modelos abliterados y cuánto cuesta el cambio. Aquí van los datos de la propia documentación de AWS, la ruta de Custom Model Import y el cambio de código para quienes usan Claude en Bedrock y pasan a {{appName}}.",
  },
  bedrock: {
    title: "Qué filtra Bedrock y qué no",
    intro: "Directo de la documentación y la política de AWS.",
    guardrails:
      "Los Guardrails son opt-in: solo se ejecutan cuando pasas un ID y una versión de guardrail en la llamada.",
    refusals:
      "Sin Guardrail no es sin censura: los modelos se sirven como los entregan sus proveedores, así que Claude, Llama y el resto mantienen sus rechazos entrenados.",
    csam: "Siempre activo: la detección automática de CSAM en imágenes de entrada y salida puede bloquear una petición con HTTP 400.",
    policy:
      "Política: la AWS Responsible AI Policy prohíbe usar el servicio para eludir intencionadamente los filtros de seguridad, además de la desinformación, las imágenes sexuales no consentidas y el daño a menores.",
    retention:
      "Detección de abusos: AWS puede almacenar o revisar entradas y salidas en casos limitados. Claude Fable 5, 5.1 y 5.2 conservan todo el tráfico hasta 30 días, los modelos de OpenAI distintos de gpt-oss conservan el tráfico marcado hasta 30 días. Los proveedores de modelos no reciben nada.",
    models:
      "Sin pesos sin censura: el catálogo tiene DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma y Nemotron. Ninguno abliterado.",
  },
  import: {
    title: "Trae tus propios pesos abliterados: Custom Model Import",
    intro:
      "Bedrock puede alojar los pesos que subas. Es la única forma de ejecutar allí un modelo abliterado.",
    architectures:
      "Arquitecturas compatibles: Mistral, Mixtral, Flan, Llama 2 a 3.3, GPTBigCode, Qwen2 a Qwen3 y gpt-oss 20B y 120B. Encaja un Llama, Qwen o gpt-oss abliterado.",
    excluded:
      "No compatibles: las arquitecturas DeepSeek V3, Kimi y GLM. Las importaciones de Qwen3 no admiten la API Converse.",
    format:
      "Límites: safetensors de Hugging Face, menos de 200 GB para modelos de texto, contexto por debajo de 128K, sin inferencia por lotes. Regiones: eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Coste: $0.05718 por Custom Model Unit y minuto en US East y Oregón, facturado en ventanas de 5 minutos, más $1.95 al mes de almacenamiento por unidad. Fráncfort cuesta $0.07144 el minuto.",
    callout:
      "Pagas la capacidad del modelo por minuto, no por token. Y la política de AWS contra eludir los filtros de seguridad sigue cubriendo tu cuenta.",
  },
  prices: {
    title: "Los precios de los modelos abiertos de Bedrock",
    intro:
      "Nivel estándar, US East, por 1M de tokens, entrada / salida. Solo pesos estándar.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Pesos sin censura en otros sitios, por token",
    oursIntro:
      "Los modelos abliterados que Bedrock no tiene, los nuestros frente a los hosts más baratos.",
  },
  apis: {
    title: "Converse frente a los formatos de OpenAI y Anthropic",
    intro:
      "Bedrock habla InvokeModel y Converse en bedrock-runtime, y añade Messages, Chat Completions y Responses en su endpoint bedrock-mantle. Nosotros hablamos OpenAI chat completions, la API Responses y Anthropic Messages en una sola base URL con una sola clave.",
    claude:
      "Para quienes usan Claude en Bedrock significa que el SDK de Anthropic sigue funcionando. Cambia el cliente de Bedrock por el estándar, configura la base URL y la clave. Claude Code toma la misma base URL como ANTHROPIC_BASE_URL.",
    before: "Antes: Claude a través del cliente de Bedrock",
    after: "Después: la misma llamada Messages en {{appName}}",
    swap: "Mismo código, cualquier modelo: pon {{uncensoredExample}} en el campo model y la llamada va a un modelo sin censura.",
    converse:
      "¿Hoy en Converse? Pasa una vez al SDK de OpenAI o de Anthropic y cada pasarela de esta página, nosotros incluidos, queda a un cambio de base URL.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex y Together lado a lado",
    intro:
      "Todos los hyperscalers te dejan bajar un filtro en algún sitio. Ninguno cambia la política de uso y ninguno ofrece pesos sin censura.",
  },
  us: {
    title: "{{appName}}: modelos sin censura sin importar pesos",
    intro:
      "{{modelCount}} modelos de chat detrás de una sola clave, {{uncensored}} de ellos sin censura. Pago por token, sin minutos de capacidad.",
    models:
      "Modelos: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM y Qwen junto a {{uncensored}} modelos sin censura, incluidos GLM, DeepSeek y Kimi abliterados que Custom Model Import no admite. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, y el resultado es un modelo con opiniones políticas a contracorriente.",
    formats:
      "Formatos: OpenAI chat completions, la API Responses y Anthropic Messages, además de imagen, vídeo, música, voz y transcripción.",
    consent:
      "Reglas: los modelos sin censura se desbloquean tras un consentimiento 18+ único en tu cuenta.",
    billing:
      "Facturación: un solo saldo de créditos, con nuestro margen del {{markup}}% sobre lo que pagamos aguas arriba. Cualquier plan desde {{apiSubPrice}} al mes desbloquea las claves API.",
    weak: "Donde Bedrock nos gana: IAM, VPC, regiones, una factura de AWS, ISO, SOC, CSA STAR, elegibilidad HIPAA y FedRAMP High en GovCloud. No tenemos informe SOC 2, ni BAA, ni SLA, ni elección de región, y cada prompt pasa por nosotros hasta el proveedor que sirve el modelo.",
    docsLink: "Docs de la API: endpoints, autenticación y límites",
    toolsLink: "Una sola clave en Claude Code, Codex CLI, Aider y más",
  },
  models: {
    title: "{{apiUncensored}} modelos sin censura en la API hoy",
    intro:
      "Todos los modelos sin censura que puedes llamar, con el id que pasas como model. Del más barato al más caro.",
    colModel: "Modelo",
    colId: "ID de API",
    colContext: "Contexto",
    colPrice: "Por mensaje",
  },
  list: {
    title: "Las alternativas, una por una",
    intro:
      "De sus propias páginas y listas de modelos, leídas el {{date}}. Qué es cada una, dónde gana y la pega.",
  },
  stay: {
    title: "Cuándo quedarse en Bedrock",
    intro:
      "Si tu carga vive en AWS, la cuestión del filtro puede ser la menor.",
    compliance:
      "Necesitas el alcance de cumplimiento, los controles de IAM y VPC y una sola factura de AWS.",
    retention:
      "Necesitas retención cero por Región: el modo de retención none de Bedrock, configurado por API.",
    weights:
      "Tu modelo abliterado es un Llama, Qwen o gpt-oss y un tráfico constante justifica pagar minutos de capacidad.",
    callout:
      "Muchos equipos lo reparten: Bedrock para producción dentro de AWS, una segunda clave para ficción, roleplay, investigación y red-teaming.",
  },
  faq: {
    title: "Preguntas frecuentes",
    guardrails: {
      q: "¿Bedrock filtra contenido sin Guardrails?",
      a: "Bedrock no añade ninguna capa de filtro salvo que adjuntes un Guardrail, aparte de la detección automática de CSAM en imágenes. Los modelos mantienen sus propios rechazos entrenados y la AWS Responsible AI Policy sigue vigente.",
    },
    uncensored: {
      q: "¿Bedrock tiene modelos sin censura o abliterados?",
      a: "No en su catálogo. La única vía es Custom Model Import de tus propios pesos, para arquitecturas compatibles como Llama, Qwen y gpt-oss.",
    },
    cost: {
      q: "¿Cuánto cuesta Custom Model Import?",
      a: "$0.05718 por Custom Model Unit y minuto en US East y Oregón, facturado en ventanas de 5 minutos, más $1.95 al mes de almacenamiento por unidad. Pagas capacidad, no por token.",
    },
    claude: {
      q: "¿Puedo mover código de Claude en Bedrock sin reescribirlo?",
      a: "Sí. Sustituye AnthropicBedrock por el cliente estándar de Anthropic, configura base_url con la base URL de {{appName}} sin /v1, usa tu clave y nuestro id de modelo. La petición y la respuesta de Messages mantienen su forma.",
    },
    converse: {
      q: "¿{{appName}} admite la API Bedrock Converse?",
      a: "No. Hablamos OpenAI chat completions, la API Responses y Anthropic Messages. Salir de Converse una vez deja a cada proveedor compatible con OpenAI o Anthropic a un cambio de base URL.",
    },
    enterprise: {
      q: "¿{{appName}} ofrece SOC 2, un BAA o un SLA?",
      a: "No. Si los necesitas, deja la carga regulada en Bedrock y usa {{appName}} donde los rechazos estorban.",
    },
    apiLink: "API LLM sin censura: ids de modelo, código y límites",
    azureLink: "Alternativas sin censura a Azure OpenAI",
    openRouterLink: "Alternativas a OpenRouter, comparadas",
    keysLink: "Gestiona tus claves API",
  },
  cta: {
    title: "Sin minutos de capacidad. Sin reflejo de rechazo.",
    subtitle:
      "Prueba primero los modelos en el chat, {{guestCredits}} créditos gratis al mes, sin cuenta. Luego apunta tu SDK a la API.",
    start: "Probar un modelo sin censura",
    docs: "Leer la documentación de la API",
  },
};
