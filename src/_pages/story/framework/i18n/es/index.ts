import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Desarrolladores: framework next-vibe, API de IA sin censura, MCP",
    description:
      "Escribe un endpoint y obtienes interfaz web, comando de CLI, herramienta MCP y herramienta de IA. Código abierto. Clona, instala, ejecuta. Y una sola API compatible con OpenAI y Anthropic para modelos populares y sin censura.",
    category: "Desarrolladores",
    imageAlt: "unbottled.ai para desarrolladores: API, MCP y autoalojamiento",
    keywords:
      "API de IA sin censura, API compatible con OpenAI, API compatible con Anthropic, API de modelos abliterados, UncensoredLM API, servidor MCP, IA autoalojada, next-vibe",
  },
  hero: {
    eyebrow: "Para desarrolladores",
    title: "Un definition.ts.",
    titleAccent: "Todas las interfaces.",
    subtitle:
      "next-vibe es el framework TypeScript de código abierto detrás de {{appName}}. Escribe un endpoint y obtienes interfaz web, comando de CLI, herramienta MCP, herramienta de IA y más. La misma validación, los mismos tipos, cero código pegamento.",
    ctaFramework: "Mira el patrón",
    ctaKeys: "Usa la API",
    stats: {
      endpoints: "endpoints tipados en el repo",
      surfaces: "interfaces desde una definición",
      languages: "idiomas, cada texto traducido",
      models: "modelos de chat, una sola clave",
    },
  },
  paths: {
    api: {
      label: "Llama a la API",
      title: "{{modelCount}} modelos con una sola clave",
      body: "Tu código de OpenAI o Anthropic, nuestra base URL. Modelos populares y sin censura con la misma clave.",
      link: "Inicio rápido",
    },
    selfHost: {
      label: "Autoalojamiento",
      title: "Ejecuta la plataforma entera",
      body: "Código abierto. Clona, instala, arranca. El navegador hace el resto.",
      link: "Instálalo",
    },
    framework: {
      label: "Construye encima",
      title: "Una definición, todas las interfaces",
      body: "Escribe un endpoint una vez. Obtienes interfaz web, comando de CLI, herramienta MCP, herramienta de IA y más.",
      link: "Mira el patrón",
    },
  },
  quickstart: {
    eyebrow: "Inicio rápido",
    title: "Primera respuesta en tres pasos.",
    intro:
      "La API habla OpenAI Chat Completions y Responses, y Anthropic Messages. Tu código funciona aquí con tres cambios: la base URL, la clave y un id de modelo de `GET /v1/models`.",
    step1: {
      title: "Desbloquea la API y crea una clave",
      description:
        "Cualquier plan desde {{subPrice}} al mes la desbloquea. Luego abre Claves de API, ponle nombre a una clave y cópiala. Solo la verás una vez.",
      ctaPlans: "Ver planes",
      ctaKeys: "Abrir Claves de API",
    },
    step2: {
      title: "Apunta tu cliente hacia nosotros",
      description:
        "Los clientes de OpenAI usan la primera URL. Claude Code y los SDK de Anthropic, la segunda.",
      baseUrl: "Base URL de OpenAI",
      baseUrlNote:
        "Cualquier locale sirve en la ruta. Solo cambia el idioma de los mensajes de error.",
      anthropicBaseUrl: "Base URL de Anthropic",
      anthropicNote:
        "Sin `/v1` al final: los clientes de Anthropic añaden `/v1/messages` por su cuenta.",
    },
    step3: {
      title: "Envía una petición",
      description:
        "Pon tu clave y ejecútalo. `{{model}}` es un id de modelo. `GET /v1/models` lista todos los ids que tu clave puede llamar.",
      response: "Respuesta de ejemplo",
    },
    agents: {
      title: "Los agentes de código funcionan sin tocar nada",
      body: "Configuraciones probadas, listas para copiar y pegar:",
      link: "Configuración de agentes de código",
    },
    reference: "Referencia completa de la API",
  },
  pricing: {
    eyebrow: "Precios",
    title: "Un plan la desbloquea. Pagas por llamada, en créditos.",
    intro:
      "Las mismas tarifas que en la app de chat. Sin recargo por la API, sin cuotas por usuario, un solo saldo.",
    unlockTitle: "Desbloquea la API",
    unlockPlan: "Cualquier plan, desde {{subPrice}} al mes",
    unlockGrant:
      "Créditos asignados por nuestro equipo, como los créditos de tester",
    neverTitle: "Nunca la desbloquea",
    never:
      "El plan gratuito: asignación mensual, bonos de registro y newsletter, ganancias por referidos. Sin un plan ni créditos asignados, cada llamada a `/v1` responde 402 `paid_plan_required`.",
    billTitle: "Cómo se cobra una llamada",
    bill: "Coste del proveedor más nuestro margen, en créditos. `GET /v1/models` lista los créditos de cada modelo por millón de tokens de entrada y de salida. Cada respuesta indica `usage.credits_charged`; en streaming, con `stream_options.include_usage`.",
    topup:
      "¿Necesitas más? Los suscriptores recargan con paquetes de créditos desde {{packPrice}}. Los créditos de los paquetes no caducan nunca.",
    facts: {
      credit: "1 crédito = 1 céntimo de dólar",
      rate: "{{rate}} peticiones por minuto por clave",
      keys: "Hasta {{maxKeys}} claves por cuenta",
      preflight: "Sin créditos suficientes: 402 antes de ejecutar nada",
    },
    modelsTitle: "Cada precio sale de la propia API",
    modelsResponse: "Respuesta de ejemplo",
  },
  uncensored: {
    eyebrow: "Modelos sin censura",
    title: "Dos formas de IA sin censura. Las dos en la API.",
    intro:
      "Casi toda la IA sin censura es un modelo popular al que le han recortado las negativas o se las han quitado con entrenamiento. Tenemos esos, y uno entrenado distinto desde el principio. Elige en cada petición con el id del modelo.",
    abliterated: {
      label: "Abliterados y ajustados",
      title: "Modelos populares que ya no esquivan",
      body: "Negativas recortadas de los pesos o eliminadas con entrenamiento. El mismo conocimiento, respuestas directas.",
    },
    worldview: {
      label: "Realmente sin censura",
      title: "Un modelo con su propia visión del mundo",
      body: "{{model}} está entrenado con libros y documentos prohibidos en el internet convencional, lo que da como resultado un modelo con opiniones políticas contrarias.",
    },
    more: "+{{count}} más",
    consent:
      "Confirma una vez que eres mayor de 18 en la página de Claves de API. Hasta entonces, los modelos sin censura responden 403 `uncensored_consent_required` y no se cobra nada.",
    allModels: "Todos los modelos sin censura",
    catalog: "Explora el catálogo de modelos",
  },
  mcp: {
    eyebrow: "MCP y CLI",
    title: "Tu agente ya conoce tu app.",
    intro:
      "`bun i` escribe la configuración MCP para Claude Code, Cursor, VS Code, OpenCode y Codex. Abre el repo en tu agente y las herramientas ya están ahí.",
    points: {
      stdio: "MCP por stdio. Sin servidor extra, sin puerto.",
      roles:
        "Los mismos roles y la misma validación que en la interfaz web. Los modelos solo llegan a lo que tu rol permite.",
      connect:
        "Conecta la instalación a tu cuenta de {{appName}} y sus agentes corren con nuestros modelos.",
      help: "Cada comando se documenta solo: `vibe <command> --help`.",
    },
    configNote:
      "La entrada `atlas` que escribe `bun i`, recortada. El archivo real también trae un servidor `hermes` y usa la ruta de tu clon.",
  },
  selfHost: {
    eyebrow: "Autoalojamiento",
    title: "Ejecútalo todo tú mismo.",
    intro:
      "La plataforma detrás de {{appName}} es de código abierto. Clona, instala, ejecuta. Luego el navegador toma el relevo. Sin Docker, sin archivos de configuración.",
    terminal: "Terminal",
    db: "Postgres integrado (PGlite) por defecto. Cuando se te quede pequeño, apunta `DATABASE_URL` a tu propio Postgres.",
    guide: "Guía de autoalojamiento",
    github: "Código en GitHub",
  },
  framework: {
    eyebrow: "El framework",
    title: "Sigue un endpoint.",
    intro:
      "El formulario de contacto de este repo, recortado pero real. Una definición se convierte en interfaz web, comando de CLI, herramienta MCP, pantalla nativa, herramienta de IA y tarea cron. El formulario en vivo está al final de esta página.",
    tabAdd: "Añade el tuyo",
    call: {
      title: "Llámalo",
      cli: "CLI",
      mcp: "MCP",
      ai: "Herramienta de IA",
      cron: "Cron",
    },
    becomes: "El formulario de contacto se convierte en",
    more: "Y {{count}} interfaces más",
    source: "Código completo en GitHub",
    live: "Pruébalo en vivo más abajo",
    docs: "Documentación del patrón en GitHub",
    deleteLine:
      "Una función es una carpeta. Bórrala, ejecuta `vibe gen` y desaparece de todas las interfaces a la vez.",
    moreSurfaces: {
      webApi: "API REST",
      websocket: "Eventos WebSocket",
      adminPanel: "Panel de admin",
      vibeFrame: "Widget integrable",
    },
    surfaces: {
      web: {
        title: "Interfaz web",
        body: "El formulario al final de esta página. Campos, validación y aviso de éxito salen de la definición.",
      },
      cli: {
        title: "Comando de CLI",
        body: "`vibe contact-form`, una opción por campo, ayuda incluida.",
      },
      mcp: {
        title: "Herramienta MCP",
        body: "Los agentes llegan a ella por `vibe mcp` con la herramienta `execute-tool`. El esquema de entrada sale directo de Zod.",
      },
      ai: {
        title: "Herramienta de IA",
        body: "Los modelos pueden llamarla. `requiresConfirmation` obliga al usuario a aprobarla antes.",
      },
      native: {
        title: "Pantalla nativa",
        body: "La app de Expo pinta el mismo widget con controles nativos. Beta.",
      },
      cron: {
        title: "Tarea cron",
        body: "Cualquier endpoint se ejecuta de forma programada. El mismo handler, sin duplicar código.",
      },
    },
    maturity: {
      stable: {
        title: "En producción",
        body: "{{appName}} corre sobre este código: web, CLI, MCP, herramientas de IA, cron, tiempo real, pagos.",
      },
      beta: {
        title: "Beta",
        body: "Las pantallas de React Native, la sincronización entre instancias y las skills remotas funcionan, con asperezas.",
      },
      churn: {
        title: "Habrá cambios",
        body: "Un solo equipo, avanzando rápido. Aún sin semver, y la documentación va por detrás del código. Fija un commit o haz un fork.",
      },
    },
  },
  faq: {
    title: "Lo que preguntan los desarrolladores",
    free: {
      q: "¿Hay un plan gratuito de la API?",
      a: "No. La API se desbloquea con cualquier plan, desde {{subPrice}} al mes, o con créditos asignados por nuestro equipo. La asignación gratuita del chat no la desbloquea.",
    },
    sdks: {
      q: "¿Qué SDK y herramientas funcionan?",
      a: "Los SDK oficiales de OpenAI y Anthropic, cualquier librería compatible con OpenAI y agentes de código como Claude Code, Codex CLI, OpenCode, Aider, Cline y Continue. Cambia la base URL y la clave.",
    },
    price: {
      q: "¿Cuánto cuesta una llamada?",
      a: "Se paga en créditos. Un crédito es un céntimo de dólar. Cada modelo tiene una tarifa en créditos por millón de tokens de entrada y de salida, listada en `GET /v1/models`. Cada respuesta indica `usage.credits_charged` (en streaming, con `stream_options.include_usage`), así que siempre sabes lo que costó una llamada.",
    },
    uncensored: {
      q: "¿Puedo llamar a modelos sin censura por la API?",
      a: "Sí. Confirma una vez en la página de Claves de API que tienes 18 años o más y luego llámalos como a cualquier otro modelo. Los modelos abliterados y UncensoredLM usan los mismos endpoints.",
    },
    media: {
      q: "¿También imágenes, voz, vídeo y música?",
      a: "Con la misma clave. `/v1/images`, `/v1/audio`, `/v1/videos` y `/v1/music` siguen el formato de OpenAI donde existe. La referencia de la API cubre cada endpoint.",
    },
    limits: {
      q: "¿Cuáles son los límites de uso?",
      a: "{{rate}} peticiones por minuto por clave por defecto. Si te pasas, recibes HTTP 429 con una cabecera `Retry-After`. ¿Necesitas más capacidad? Usa el formulario de contacto de abajo.",
    },
    selfHost: {
      q: "¿El autoalojamiento es gratis?",
      a: "Sí. El código es abierto: MIT para la app, GPL v3 para el framework. Usa tus propias claves de proveedor o conecta la instalación a tu cuenta de {{appName}} y paga solo lo que uses.",
    },
    docker: {
      q: "¿Necesito Docker o un servidor de base de datos?",
      a: "No. La base de datos por defecto es Postgres integrado (PGlite). Pasa a un Postgres completo más adelante cambiando `DATABASE_URL`.",
    },
  },
  contact: {
    eyebrow: "El endpoint, en vivo",
    title: "¿Dudas, o estás construyendo algo grande?",
    description:
      "Instalación, integraciones a medida, revisión de arquitectura. Responde el equipo que lo construyó. Este formulario es el endpoint de contacto de la sección del framework.",
  },
  code: {
    copy: "Copiar",
    copied: "Copiado",
    wrap: "Ajustar",
    anthropic: "Anthropic",
  },
};
