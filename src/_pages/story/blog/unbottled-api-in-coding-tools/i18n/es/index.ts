import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Codex CLI y Claude Code en cada modelo - {{appName}} API",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider y Cline en una tecla {{appName}}. Claude, GPT, DeepSeek, GLM y modelos sin censura. Una base URL, un comando por herramienta.",
    category: "Guía para Desarrolladores",
    imageAlt: "{{appName}} API en las herramientas de codificación",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, OpenAI compatible con API, Respuestas API, API Anthropic Messages, agente de codificación, modelos no censurados, proveedor personalizado",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Guía para Desarrolladores",
    readTime: "8 min leer",
    title: "Una clave para todos los modelos, también en Codex y Claude Code.",
    subtitle:
      "Codex CLI y Claude Code ahora se conectan a {{appName}} directamente, junto a OpenCode, Continue, Aider y Cline. Una base URL, una clave, un comando por herramienta.",
  },
  intro: {
    lead: "Su agente de codificación está bloqueado a los modelos de un vendedor. ¿Quieres una segunda opinión de otro laboratorio, un modelo más barato para el trabajo gruñido, o un modelo que no se niega? Eso significa otra cuenta, otra clave, otra factura.",
    p2: "{{appName}} habla los tres formatos que usan los agentes de codificación: OpenAI concluciones de chat, OpenAI Responses API y el API Anthropic Messages. No hay nada que instalar. Indique una herramienta a nosotros una vez, luego cambie entre Claude, GPT, DeepSeek, GLM, Kimi, Qwen y los modelos sin censura al cambiar un modelo id.",
    access:
      "Antes de comenzar: el API necesita una cuenta pagada. Cualquier plan, de {{subPrice}} al mes, lo desbloquea. Los créditos gratis y extras no.",
    accessLink: "Desbloquear el API",
  },
  why: {
    title: "¿Por qué?",
    oneKey:
      "Una llave, un saldo. No hay cuentas separadas en Anthropic, OpenAI, DeepSeek, Moonshot y Z.ai.",
    uncensored:
      "Modelos sin censura en su editor. Investigación de seguridad, impulsos de equipo rojo, herramientas de ficción, datos que viajan a los filtros principales. Escoge el nivel de filtro, no el vendedor.",
    switch:
      "Modelo derecho por tarea. Un modelo de frontera para el refactor duro, un modelo flash para los renombres y el andamiaje de pruebas. El mismo confidente, diferente id.",
    billing:
      "Los mismos créditos que la aplicación chat, los mismos precios. Cada respuesta reporta lo que cuesta.",
  },
  setup: {
    title: "Obtener una llave y una base URL",
    intro: "Dos valores. Cada herramienta debajo necesita exactamente estos.",
    p1: "Cree una clave bajo Configuración > Claves de API. Empieza con sk-unb- y se muestra una vez.",
    shortcut:
      "Camino más rápido: justo después de crear una llave, la página de teclas API muestra cada bloque debajo con su llave ya llenada. Escoge tu herramienta, copia, corre.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "Para OpenAI - herramientas de estilo: Codex, OpenCode, Continue, Aider, Cline. El lugar en el camino sólo cambia el lenguaje de los mensajes de error.",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Para Claude Code y los SDK Anthropic. Mismo URL sin /v1: añaden /v1/messages ellos mismos.",
    p2: "Mantenga la llave en una variable de entorno, nunca en un archivo que usted comete. La llamada de rizo demuestra las obras clave y enumera cada modelo id que su cuenta puede llamar, con tamaño contextual, soporte de herramientas y precios de crédito.",
  },
  compat: {
    title: "Cada herramienta se conecta directamente",
    intro:
      "Los agentes de codificación hablan tres diferentes formatos de alambre. Servimos a los tres, en la misma llave y en los mismos modelos.",
    codex: "Codex CLI : Respuestas OpenAI API.",
    claudeCode: "Claude Code: API Anthropic Messages.",
    chat: "OpenCode, Continue, Aider, Cline: OpenAI concluciones de chat.",
    other:
      "Cualquier otra cosa con un campo base URL funciona de la misma manera: base URL, clave, modelo id.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Concluciones de chat",
  },
  codex: {
    intro:
      "OpenAI es agente terminal. Lee tu repo, ejecuta comandos, edita archivos.",
    p1: "Codex habla las respuestas API, y nosotros también. El único comando define el inline del proveedor: nada para editar, nada para instalar. Para uso diario, anexa el config una vez y comienza Codex con el perfil.",
    p2: 'Cambiar modelos con -m o la línea modelo en el perfil. Mantener wire_api = "responses": el actual Codex no acepta nada más.',
  },
  claudeCode: {
    intro:
      "Anthropic es agente terminal. Planes, ediciones, pruebas de ejecución, espesados subagents.",
    p1: "El código Claude lee su entrada de variables ambientales. ANTHROPIC_BASE_URL es la base URL sin /v1. ANTHROPIC_MODEL establece el modelo principal. Los predeterminados OPUS y SONNET cubren el modo de selección y plan modelo, el HAIKU mueve trabajos de fondo como títulos de sesión a un modelo barato, y CLAUDE_CODE_SUBAGENT_MODEL cubre los subagents. CLAUDE_CODE_MAX_CONTEXT_TOKENS le dice a Claude Code el tamaño real del contexto de un modelo no Claude, por lo que compacta en el punto correcto.",
    p2: "¿Quieres Claude en sí? Deja las líneas modelo. El Claude Code pide sus ids Claude habituales y los enviamos a nuestro modelo Claude, facturado en créditos.",
    p3: "El Claude Code envía un gran impulso del sistema, más de 30k fichas de entrada incluso para una tarea trivial. Un modelo barato por defecto mantiene eso asequible.",
  },
  opencode: {
    intro:
      "Agente terminal de código abierto con un TUI y un modo de ejecución sin cabeza.",
    p1: "Guarde el configuración como opencode.json en su proyecto, o como ~/.config/opencode/opencode.json para cada proyecto. La llave se queda en su entorno. Añadir cualquier id de GET /v1/models al mapa de modelos, luego elegir uno con /models en el TUI.",
    gotcha:
      "Actualizar OpenCode primero. Old 1.0.x construyes tire el paquete más nuevo @ai-sdk/openai-compatible y choca después de la primera llamada de herramienta con DecimalError: Invalid argument. 1.19.5 ejecuta el mismo configuración limpio.",
  },
  continue: {
    intro:
      "Asistente de codificación para el código VS y JetBrains, además del cn CLI.",
    p1: "UNBOTTLED_API_KEY se resuelve de su entorno. Añadir -p con un aviso para una carrera sin cabeza. La extensión IDE lee ~/.continue/config.yaml: ponga la misma entrada modelo allí.",
  },
  aider: {
    intro: "Programación de pares en su terminal, se comprometen incluidos.",
    p1: "Un comando, sin archivo de configuración. Aider quiere openai/ delante del modelo id y lo tira antes de que nos llame. --edit-format diff mantiene las ediciones pequeñas; sin él Aider vuelve a reenviar archivos enteros para los ids modelo que no sabe. Nombra los archivos para editar en la línea de comandos, como siempre con Aider.",
  },
  cline: {
    intro: "Agente de codificación autónomo, en el Código VS y como CLI.",
    p1: "Dos comandos con el Cline CLI : guardar el proveedor una vez, luego ejecutar cline. Base URL, clave y modelo id son los mismos tres valores que en todas partes.",
  },
  models: {
    title: "Que modelo para qué trabajo",
    intro:
      "Todas estas herramientas de llamada, que los agentes necesitan. Los medicamentos son lo que pasa en tu config.",
    strong: {
      title: "Problemas difíciles",
      body: "Grandes refactores, codebases desconocidos, depuración multi-paso. Precios de crédito más altos, menos giros equivocados.",
    },
    cheap: {
      title: "Barato y rápido",
      body: "Renombramientos, pruebas, calderas, trabajos de fondo. Una fracción del precio de un modelo fronterizo. Buen defecto para los agentes que envían grandes impulsos.",
    },
    uncensored: {
      title: "Sin censura",
      body: "El mismo flujo de trabajo del agente, sin reflejo de rechazo. Análisis de errores, herramientas de equipo rojo, tuberías de ficción adulta, raspadores otros modelos le dan conferencias. Sigues siendo responsable de lo que construyes.",
    },
    listNote:
      "Los Ids cambian a medida que los modelos se reemplazan. GET /v1/models es la fuente de la verdad: si un id no está listado para su clave, el API devuelve 404 model_not_found. La única asignación es para Claude Code: sus ids Claude incorporados van a nuestro nuevo Claude de la misma familia.",
  },
  gotchas: {
    title: "Tenemos que golpear.",
    intro: "Así que no tienes que hacerlo.",
    localeUrl:
      "Copiar la base URL exactamente, /api/ <locale> /v1 incluido. Sin el local consigues una redireccion que algunos clientes dejan caer. Sin /api obtienes una página HTML en lugar de JSON.",
    anthropicUrl:
      "Claude Code obtiene la base URL sin /v1. Con /v1 llama /v1/v1/messages y recibe un 404.",
    modelId:
      "Utilice el id exacto de GET /v1/models, como {{model}}. Aider quiere openai/ delante. Claude Code incorporado Claude los ids son mapas para usted a nuestro más nuevo Claude de la misma familia. Cualquier otro id desconocido devuelve 404 model_not_found.",
    paid: "HTTP 402 con paid_plan_required significa que la cuenta no tiene plan ni compra de crédito todavía. Cualquier plan lo arregla.",
    tools:
      "Un modelo sin soporte de herramientas devuelve 400 tools_not_supported una vez que el agente envía herramientas. Compruebe supports_tools en GET /v1/models.",
    rateLimit:
      "Cada clave permite 60 solicitudes por minuto. Los agentes disparan muchas llamadas pequeñas. Si golpeas 429, dale al agente su propia llave.",
  },
  cta: {
    title: "Anulado en un comando.",
    subtitle:
      "Cree una llave, copie el bloque para su herramienta, elija un modelo. Los docs API cubren cada punto final, campo, código de error y detalles de streaming.",
    key: "Crear una tecla API",
    docs: "Lea los documentos API",
  },
};
