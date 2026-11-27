import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternativa sin censura a Azure OpenAI: APIs comparadas | {{appName}}",
    description:
      "Azure filtra cada modelo por defecto y prohíbe los chatbots eróticos y románticos aun sin filtros. Compara {{appName}}, OpenRouter, Venice y APIs abliterated.",
    category: "Guía para desarrolladores",
    imageAlt: "Alternativas sin censura a Azure OpenAI, comparadas",
    keywords:
      "alternativa sin censura a Azure OpenAI, alternativa a Azure OpenAI, desactivar filtro de contenido Azure OpenAI, Azure OpenAI sin filtro de contenido, filtrado de contenido modificado Azure, desactivar abuse monitoring Azure, Azure OpenAI NSFW, API LLM sin filtro de contenido, API LLM sin censura, API de modelos abliterados, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía para desarrolladores",
    readTime: "10 min de lectura",
    title: "Alternativas sin censura a Azure OpenAI",
    subtitle:
      "Los filtros de Azure, su barrera de aprobación y su Code of Conduct, leídos en la fuente. Después {{count}} alternativas, sinceras sobre dónde gana cada una. Comprobado el {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI filtra cada modelo por defecto. Para desactivar el filtro hace falta una solicitud aprobada. Y aun aprobada, el Code of Conduct sigue prohibiendo los chatbots eróticos y románticos.",
    p2: "Si tu producto es ficción, roleplay, compañeros, red-teaming o simplemente respuestas directas, eso es un muro, no un ajuste. Aquí está exactamente qué permite Azure, qué lo sustituye y el cambio de código para pasar un cliente de Azure OpenAI a {{appName}}.",
  },
  azure: {
    title: "Qué filtra de verdad Azure",
    intro: "Directo de la documentación y las políticas de Microsoft.",
    defaults:
      "Activo por defecto: Microsoft Foundry aplica ajustes de seguridad por defecto a todos los modelos salvo Whisper. Tú mismo puedes relajarlos hasta High only.",
    approval:
      "Desactivable solo con aprobación: las opciones No filters y Annotate only requieren aprobación para el filtrado de contenido modificado. Solo pueden solicitarlo los clientes gestionados por un equipo de cuenta de Microsoft o de un programa elegible.",
    conduct:
      "Desactivado no es permitido: el Code of Conduct prohíbe el contenido sexualmente explícito, incluido el sugerente y el fetichista, y veta los chatbots eróticos, románticos o usados con fines eróticos o románticos. También prohíbe la violencia gráfica, el gore y el discurso de odio.",
    monitoring:
      "Abuse monitoring: los prompts y respuestas marcados pasan por defecto a revisión automática, y al personal de Microsoft cuando hace falta. Los datos quedan en un abuse monitoring store en la geografía de tu recurso.",
    sunset:
      "Fin del opt-out: el registro de cambios de Microsoft del 17 de noviembre de 2026 dice que Modified Abuse Monitoring dejará de estar disponible para los modelos publicados desde el 1 de noviembre de 2026, a partir de una fecha aún por anunciar.",
    models:
      "Sin modelos sin censura: no encontramos ningún modelo abliterado ni sin censura en el catálogo. Hay modelos DeepSeek y Llama, ninguno abliterado.",
    callout:
      "En resumen: en Azure, una app de ficción para adultos o de compañeros incumple el Code of Conduct, digan lo que digan tus ajustes de filtro.",
  },
  rules: {
    title:
      "Azure, Bedrock, Vertex y Together: qué significa de verdad desactivado",
    intro:
      "Todos los hyperscalers te dejan bajar un filtro en algún sitio. Ninguno cambia la política de uso y ninguno ofrece pesos sin censura.",
  },
  us: {
    title: "{{appName}}: modelos sin censura en una API de OpenAI y Anthropic",
    intro:
      "{{modelCount}} modelos de chat detrás de una sola clave, {{uncensored}} de ellos sin censura. Ninguna capa de filtro sobre el modelo que elijas.",
    models:
      "Modelos: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM y Qwen junto a {{uncensored}} modelos sin censura. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, y el resultado es un modelo con opiniones políticas a contracorriente.",
    formats:
      "Formatos: OpenAI chat completions, la API OpenAI Responses y la API Anthropic Messages, además de imagen, vídeo, música, voz y transcripción con la misma clave.",
    consent:
      "Reglas: los modelos sin censura se desbloquean tras un consentimiento 18+ único en tu cuenta. Sin solicitud, sin equipo de cuenta.",
    billing:
      "Facturación: un solo saldo de créditos, con nuestro margen del {{markup}}% sobre lo que pagamos aguas arriba. Cualquier plan desde {{apiSubPrice}} al mes desbloquea las claves API. Tarjeta, PayPal o cripto.",
    limits:
      "Límites: {{burst}} peticiones por minuto y {{streams}} streams simultáneos por clave como techo antiabuso. Los límites de tasa del proveedor pasan tal cual.",
    weak: "Donde Azure nos gana: no tenemos informe SOC 2, ni BAA, ni SLA, ni elección de región. Cada prompt pasa por nosotros hasta el proveedor que sirve el modelo. Nuestro margen del {{markup}}% nos hace más caros por token que los routers abliterados de abajo. Tampoco hay endpoint de embeddings.",
    before: "Antes: el cliente de Azure OpenAI",
    after: "Después: el mismo SDK, apuntando a {{appName}}",
    codeNote:
      "Cambian tres cosas. AzureOpenAI pasa a ser OpenAI con una base_url. El nombre de tu deployment pasa a ser un id de modelo. Y content_filter_results desaparece de las respuestas, porque no hay ninguna capa de filtro que reportar.",
    docsLink: "Docs de la API: endpoints, autenticación y límites",
    formatsLink: "API compatible con OpenAI y Anthropic, explicada",
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
  prices: {
    title: "Precio por token, el nuestro frente a los hosts más baratos",
    intro:
      "Mismos pesos, distintos hosts. No somos los más baratos por token. Pagas por una sola clave que cubre modelos sin censura, abiertos y convencionales, más un chat web.",
  },
  list: {
    title: "Las alternativas, una por una",
    intro:
      "De sus propias páginas y listas de modelos, leídas el {{date}}. Qué es cada una, dónde gana y la pega.",
  },
  stay: {
    title: "Cuándo quedarse en Azure",
    intro: "A veces el filtro es el precio del papeleo que necesitas.",
    compliance:
      "Necesitas programas de cumplimiento, residencia regional de datos y un equipo de cuenta. Eso lo venden los hyperscalers. Bedrock, por ejemplo, lista ISO, SOC, CSA STAR, elegibilidad HIPAA y FedRAMP High en GovCloud.",
    privacy:
      "Necesitas los términos de datos de Microsoft: los prompts y las respuestas no están disponibles para OpenAI y no se usan para entrenar modelos de base sin tu permiso.",
    sfw: "Tu producto es apto para todos igualmente. Entonces los valores por defecto de Azure te cuestan poco.",
    callout:
      "Muchos equipos lo reparten: Azure para la carga regulada, una segunda clave para ficción, roleplay, investigación y red-teaming.",
  },
  faq: {
    title: "Preguntas frecuentes",
    off: {
      q: "¿Puedo desactivar el filtro de contenido de Azure OpenAI?",
      a: "Solo con aprobación. Los clientes pueden relajar los filtros por su cuenta hasta High only. No filters y Annotate only requieren una solicitud aprobada de filtrado de contenido modificado, abierta a clientes gestionados por un equipo de cuenta de Microsoft o de un programa elegible.",
    },
    nsfw: {
      q: "¿Azure OpenAI permite NSFW o apps de compañeros con los filtros desactivados?",
      a: "No. El Code of Conduct de Microsoft prohíbe el contenido sexualmente explícito y veta los chatbots eróticos o románticos. Los ajustes de filtro no cambian el Code of Conduct.",
    },
    monitoring: {
      q: "¿Aún puedo desactivar el abuse monitoring de Azure?",
      a: "Los clientes aprobados podían. El registro de cambios de Microsoft del 17 de noviembre de 2026 dice que Modified Abuse Monitoring dejará de estar disponible para los modelos publicados desde el 1 de noviembre de 2026, a partir de una fecha aún por anunciar.",
    },
    best: {
      q: "¿Cuál es la mejor alternativa sin censura a Azure OpenAI?",
      a: "Tokens abliterados más baratos: OpenUncensored o Refuseless. Enorme catálogo convencional: OpenRouter. Modelos sin censura propios de Venice: Venice. Prompts que nunca salen de tus máquinas: Ollama, LM Studio o vLLM. Modelos sin censura, abiertos y convencionales más un chat de equipo con una sola clave de OpenAI y Anthropic: {{appName}}.",
    },
    sdk: {
      q: "¿Puedo mantener mi código del SDK de Azure OpenAI?",
      a: "En su mayor parte. Cambia AzureOpenAI por OpenAI, configura base_url y tu clave, y sustituye el nombre del deployment por un id de modelo como {{example}}. Las peticiones y respuestas mantienen la forma de OpenAI.",
    },
    enterprise: {
      q: "¿{{appName}} ofrece SOC 2, un BAA o un SLA?",
      a: "No. Si los necesitas, deja la carga regulada en un hyperscaler y usa {{appName}} donde los filtros estorban.",
    },
    apiLink: "API LLM sin censura: ids de modelo, código y límites",
    bedrockLink: "Alternativas sin censura a AWS Bedrock",
    openRouterLink: "Alternativas a OpenRouter, comparadas",
    keysLink: "Gestiona tus claves API",
  },
  cta: {
    title: "Mismo SDK. Sin capa de filtro.",
    subtitle:
      "Prueba primero los modelos en el chat, {{guestCredits}} créditos gratis al mes, sin cuenta. Luego conecta la API.",
    start: "Probar un modelo sin censura",
    docs: "Leer la documentación de la API",
  },
};
