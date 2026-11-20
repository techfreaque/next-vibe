import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Framework next-vibe: una definición para todas las interfaces",
    description:
      "Framework TypeScript de código abierto. Un archivo definition.ts genera una interfaz web, un comando de CLI, una herramienta MCP, una pantalla nativa, una herramienta de IA y una tarea cron. Incluye una API alojada compatible con OpenAI y Anthropic.",
    category: "Framework",
    imageAlt: "Framework next-vibe para desarrolladores",
    keywords:
      "next-vibe, TypeScript framework, MCP server, CLI, Herramientas AI, Zod, Drizzle, OpenAI compatible con API",
  },
  hero: {
    eyebrow: "Fuente abierta · MIT + GPL v3",
    title: "Un solo archivo definition.ts.",
    titleAccent: "Para todas las interfaces.",
    subtitle:
      "En next-vibe, una definición de endpoint genera una interfaz web, un comando de CLI, una herramienta MCP, una pantalla nativa, una herramienta de IA, una tarea cron y otras siete interfaces. La misma validación y los mismos tipos, sin código de enlace.",
    ctaQuickstart: "Ejecutarlo en cuatro comandos",
    ctaGithub: "Ver en GitHub",
    stat1Label: "endpoints tipod en este repo",
    stat2Label: "interfaces por endpoint",
    stat3Label: "idiomas por cadena",
    stat4Label: "definición por función",
  },
  example: {
    eyebrow: "Un punto final real",
    title: "Siga el formulario de contacto.",
    intro:
      "El punto final de contacto del repo, vivir en la parte inferior de esta página. Dos archivos para leer. Seis de sus trece superficies debajo.",
    source: "Lea la fuente completa en GitHub",
    live: "Pruebe la forma en vivo",
    becomes: "Lo que se hace",
    more: "Más siete más",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "WebSocket events",
      electron: "Aplicación de electrones",
      adminPanel: "Panel admin",
      vibeFrame: "widget embeddable",
      remoteSkill: "Agente de habilidad",
      vibeBoard: "Nodo de análisis",
    },
    surfaces: {
      web: {
        title: "Web UI",
        body: "El formulario en la parte inferior de esta página. Los campos, la validación y la alerta de éxito provienen de la definición.",
      },
      cli: {
        title: "comando CLI",
        body: "vibe contact-form. Una opción por campo y ayuda con ejemplos incorporados.",
      },
      mcp: {
        title: "herramienta MCP",
        body: "Cualquier cliente MCP puede llamar a contact-form con vibe mcp. El esquema de entrada viene directamente de Zod.",
      },
      ai: {
        title: "herramienta AI",
        body: "Los modelos pueden llamarlo. requiresConfirmation hace que el usuario apruebe antes de enviarlo.",
      },
      native: {
        title: "Pantalla nativa",
        body: "La aplicación Expo hace el mismo widget con entradas nativas.",
      },
      cron: {
        title: "Cron job",
        body: "Cualquier punto final puede funcionar en un horario. El mismo manejador, no hay segunda ruta de código.",
      },
    },
    callsTitle: "Cuatro maneras en que",
    callsBody:
      "Invocaciones reales. CLI, MCP y AI llaman al controlador de contacto arriba. La pestaña Cron es una tarea programada real del repo.",
  },
  pattern: {
    eyebrow: "El patrón",
    title: "Una característica es una carpeta.",
    subtitle:
      "definition.ts y route.ts son obligatorios. El widget, los correos, la tabla y las traducciones van en la misma carpeta. No tienes que editar un registro central.",
    deleteLine:
      "Elimina la carpeta y ejecuta vibe gen. La función desaparece de todas las interfaces a la vez.",
  },
  hood: {
    eyebrow: "Bajo la capucha",
    title: "Piezas aburridas, hechas una vez.",
    intro:
      "El marco posee validación, auth, logging, i18n y en tiempo real. Tu carpeta es dueña de la lógica del negocio.",
    platform: {
      title: "Funciones y marcadores de plataformas",
      body: "allowedRoles decide quién puede llamar un punto final. Los marcadores de plataforma deciden dónde aparece: AI_TOOL_OFF lo oculta de modelos, PRODUCTION_OFF lo mantiene fuera de producción. Revisado en cada superficie.",
    },
    data: {
      title: "Zod, Drizzle, PostgreSQL",
      body: "Zod valida la entrada y la salida y genera el esquema de cada herramienta. Los repositorios gestionan la persistencia con Drizzle. Las migraciones están en el repositorio. De forma predeterminada funciona con PGlite integrado, sin Docker. Cuando necesites Postgres completo, configura DATABASE_URL.",
    },
    realtime: {
      title: "Horas reales clasificadas",
      body: "Los endpoints declaran los esquemas de eventos y el alcance de los canales. Los clientes reciben por WebSocket los tokens en streaming y el avance de las tareas. La publicación y suscripción funciona en el mismo proceso o con Redis.",
    },
    remote: {
      title: "Casos conectados",
      body: "Las instancias se conectan entre sí, ejecutan herramientas en un par y sincronizan los datos que permite. Cada lado hace cumplir sus propios permisos. Así es como una instalación auto hospeda utiliza los modelos unbottled.ai.",
    },
  },
  typescript: {
    title: "Sin any, unknown ni throw.",
    subtitle:
      "Los tipos coinciden de principio a fin. vibe check lo comprueba antes de cada publicación.",
    patterns: {
      any: {
        name: "Sin any",
        description:
          "Escribe la interfaz real. Si necesitas any, falta algo en la arquitectura.",
      },
      unknown: {
        name: "Sin unknown",
        description:
          "Se aplica la misma regla. unknown pospone el problema de any a otra parte del código.",
      },
      object: {
        name: "Sin object genérico",
        description:
          "Define la estructura que esperas. object no la especifica.",
      },
      asX: {
        name: "Sin as X",
        description:
          "Las castas mienten al compilador. Arregla los tipos en la fuente.",
      },
      throwStatements: {
        name: "No tires",
        description:
          "Respuesta de retornoTipo efectuadoT confidencial a través de éxito(datos) o fallo({ mensaje, errorType }). Los errores son datos.",
      },
      hardcodedStrings: {
        name: "sin cuerdas crudas",
        description:
          "Cada cadena de interfaz de usuario es una clave de traducción. El Invierno atrapa literales.",
      },
    },
    vibeCheck:
      "vibe check ejecuta Oxlint, ESLint y la comprobación de TypeScript en paralelo. Solo se publica con cero errores.",
  },
  quickstart: {
    eyebrow: "Quickstart",
    title: "Cuatro comandos. Después, abre el navegador.",
    intro:
      "Clone, instala, comienza. Un asistente de configuración maneja el login de administrador y su proveedor de AI. No hay archivos de configuración para editar.",
    selfHost: "Guía de alojamiento autónomo",
    docs: "Patrones en GitHub",
  },
  api: {
    eyebrow: "Hosted API",
    title: "O llame al {{appName}} API.",
    intro:
      "No es necesario instalarlo. OpenAI y Anthropic compatibles: mantenga su SDK, cambie la base URL y la clave.",
    endpoints: {
      chat: "OpenAI Chat Completions",
      responses: "OpenAI Responses",
      messages: "Anthropic Messages",
      models: "Lista de modelos con precios",
    },
    access:
      "Modelos {{modelCount}} detrás de una llave, facturado en créditos {{appName}}. Las teclas API se desbloquean con cualquier suscripción o paquete de crédito.",
    docs: "Lea los documentos API",
    keys: "Crear una tecla API",
  },
  examples: {
    eyebrow: "En este repo",
    title: "No sólo charla AI.",
    subtitle:
      "Los dominios de negocio enteros envían en este repo, cada uno construido sobre el mismo patrón.",
    items: {
      aiPlatform: {
        label: "Plataforma AI",
        title: "{{appName}}",
        body: "Modelos {{modelCount}}, chat, memoria, agentes, facturación y MCP. Esta base de código exacta, en producción.",
      },
      commerce: {
        label: "Comercio",
        title: "Productos y punto de venta",
        body: "Productos, punto de venta, inventario y compra.",
      },
      finance: {
        label: "Finanzas",
        title: "Contabilidad y pagos",
        body: "Cargo de cuentas, tasas fiscales, facturas, Stripe y pagos criptográficos.",
      },
      crm: {
        label: "CRM",
        title: "contacto y mensajería",
        body: "Prospectos, boletín, bandeja de entrada y SMS.",
      },
    },
  },
  maturity: {
    eyebrow: "Estado honesto",
    title: "Qué naves hoy.",
    stable: {
      title: "En producción",
      body: "{{appName}} se ejecuta en esta base de código: web, CLI, MCP, AI Herramientas, cron, en tiempo real, pagos. La producción se ejecuta en Next.js. Desarrollo local predeterminado a TanStack Start y Vite.",
    },
    beta: {
      title: "Beta",
      body: "React Las pantallas nativas, la sincronización de instancia a posición y las habilidades remotas funcionan, con bordes ásperos.",
    },
    honest: {
      title: "Espera.",
      body: "Un equipo, moviéndose rápido, opinado. No semver todavía, y los doctores siguen el código. Pin un commit o tenedor.",
    },
  },
  contact: {
    eyebrow: "El punto final, vivo",
    title: "¿Preguntas o construir algo grande?",
    description:
      "Configuración, integraciones personalizadas, revisión de arquitectura. Este formulario es el punto final de contacto desde la parte superior de la página, renderizado por el marco.",
  },
  code: {
    copy: "Copiar",
    copied: "Copiado",
    wrap: "Wrap",
    terminal: "Terminal",
    cli: "CLI",
    mcp: "MCP",
    ai: "herramienta AI",
    cron: "Cron",
    anthropic: "Anthropic (curl)",
  },
};
