import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un solo código para 13 plataformas.",
    category: "Arquitectura",
    description:
      "Cómo el principio Unified Surface convierte tres archivos en una aplicación web, comando CLI, herramienta MCP, pantalla nativa y trabajo de cron automáticamente.",
    imageAlt: "next-vibe Arquitectura de superficie unificada",
    keywords:
      "next-vibe, superficie unificada, patrón de punto final, MCP, CLI, TypeScript, marco SaaS, plataforma completa",
  },
  readingTime: "12 min leer",
  category: "Arquitectura",
  backToBlog: "Volver al Blog",

  hero: {
    eyebrow: "El Principio de Superficie Unificada",
    title: "Un solo código para 13 plataformas.",
    subtitle:
      "Cómo tres archivos se convierten en un formulario web, comando CLI, herramienta MCP, pantalla nativa y trabajo automatizado - simultáneamente.",
    fileBarLabel: "definition.ts → web · cli · mcp · nativo · cron · 10 más",
    theaCardTitle: "¿Quién es Thea?",
    fileTreePath: "~/src/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5,802 archivos TypeScript. ~2.1 millones de líneas. Cero `any`. Cero errores de tipo de tiempo de ejecución. Un patrón. Repetido 374 veces.",
    para1:
      "Esa es la base de código detrás de {{appName}} - y el marco que lo potencia, next-vibe. La misma arquitectura ejecuta una aplicación web, una aplicación móvil, un CLI, una interfaz de agente AI, un servidor MCP, un sistema cron, un bus de eventos websocket y un motor de flujo de datos en vivo.",
    para2:
      "El patrón se llama la superficie unificada. Esto es lo que es, cómo funciona, y por qué - una vez que lo veas - te resultará difícil regresar.",
  },

  fileTreeSection: {
    title: "Una característica es una carpeta",
    intro:
      "Cada característica en next-vibe vive en una carpeta. Se requieren tres archivos. Todo lo demás es opcional.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts ← lo que hace",
      line3: "  repository.ts ← cómo lo hace",
      line4: "  route.ts ← hace que exista en todas partes",
      line5: "  widget.tsx ← personalizado React UI (opcional)",
      line6: "  widget.cli.tsx ← terminal personalizado UI (opcional)",
    },
    explanation:
      "Eso es. Una carpeta. Tres archivos requeridos. Y de esos tres archivos, esa característica existe en hasta 13 plataformas simultáneamente.",
  },

  platformsSection: {
    title: "13 plataformas de 3 archivos",
    subtitle:
      "Cuando agregas una característica a next-vibe, no se convierte en un punto final API. Se convierte en todo a la vez.",
    platforms: {
      webApi: {
        label: "Web API",
        description: "REST endpoint, auto-validated, completamente tipod",
      },
      reactUi: {
        label: "Reactúa UI",
        description: "Autogenerado de la definición - no JSX escrito",
      },
      cli: {
        label: "CLI",
        description:
          "Cada punto final es un comando con banderas autogeneradas",
      },
      aiTool: {
        label: "AI Tool Schema",
        description: "Función llamada esquema generado automáticamente",
      },
      mcpServer: {
        label: "MCP Server",
        description:
          "Enchufe en Claude Desktop, Cursor o cualquier cliente de MCP",
      },
      reactNative: {
        label: "React Native",
        description: "iOS y Android pantallas de la misma definición",
      },
      cron: {
        label: "Cron Job",
        description:
          "Programar cualquier punto final para funcionar en un temporizador",
      },
      websocket: {
        label: "WebSocket Eventos",
        description:
          "Actualizaciones de empuje a clientes conectados al finalizar",
      },
      electron: {
        label: "Electron Desktop",
        description:
          "Aplicación de escritorio nativa a través de los mismos contratos de endpoint",
      },
      adminPanel: {
        label: "Panel de Admin",
        description:
          "Administración autogenerada UI, sin necesidad de código a medida",
      },
      vibeFrame: {
        label: "VibeFrame Widget",
        description: "widget de iframe embedible para cualquier sitio web",
      },
      remoteSkill: {
        label: "Agente Skill",
        description:
          "Llamable por agentes de AI como una habilidad estructurada",
      },
      vibeBoard: {
        label: "Nodo de Vibe Sense",
        description:
          "Nodo en un gráfico de flujo de datos en vivo - mismo punto final",
      },
    },
  },

  deleteFolderQuote:
    "Eliminar la carpeta. La característica deja de existir en todas partes inmediatamente.",

  platformMarkersSection: {
    title: "El acceso a la plataforma es un array de enum",
    para1:
      "No escribes capas de permiso separadas para cada plataforma. El acceso a la plataforma se declara en la definición misma - una matriz de enum que cada plataforma lee nativamente a tiempo de ejecución.",
    codeComment: "// Este único array controla donde aparece la función",
    cliOff: "  CLI_OFF, // bloquea el CLI",
    mcpVisible: "  MCP_VISIBLE, // opta por la lista de herramientas MCP",
    remoteSkill: "  REMOTE_SKILL, // lo pone en el archivo de habilidad agente",
    productionOff: "  PRODUCTION_OFF, // deshabilitarlo en prod",
    para2:
      "La misma definición. El mismo lugar. No hay archivos de configuración para sincronizar. No hay sistemas de permiso por plataforma.",
  },

  noApiSplitQuote:
    "No hay API para humanos y API para AI. Sólo hay la herramienta.",

  demoSection: {
    title: "La demo en vivo: Thea construye un punto final",
    subtitle:
      "En lugar de explicar el patrón abstractamente, déjeme mostrarle lo que parece en la práctica.",
    theaIntro:
      "Thea es el administrador de AI para esta plataforma. Se ejecuta en producción 24/7, operando a través de los mismos contratos de endpoint exactamente como cada usuario - la misma validación, los mismos permisos, sin backdoor. Y puede delegar el trabajo a una máquina local.",
    demoStory:
      "Le pedí a Thea que construyera un nuevo endpoint - explic-to-my-boss - usando Claude Code corriendo en mi PC. Le das una decisión técnica. Te da una justificación no técnica que tu manager realmente creerá. Todo desarrollador ha necesitado esto.",

    flow: {
      step1: {
        actor: "Tú.",
        label: "Pregunte a Thea",
        description:
          "Escriba la tarea en el chat - dos campos de entrada, una respuesta AI -generada, todas las plataformas, MCP_VISIBLE, widgets personalizados React y CLI.",
      },
      step2: {
        actor: "Thea",
        label: "Crea la tarea",
        description:
          'Thea razona en voz alta, crea una tarea con targetInstance = "hermes" (su máquina local), y se queda dormido.',
      },
      step3: {
        actor: "Hermes local",
        label: "Recoge la tarea",
        description:
          "La instancia local sincroniza cada 60 segundos. No hay puertos abiertos. Su máquina inicia la conexión.",
      },
      step4: {
        actor: "Claude Code",
        label: "Construye el punto final",
        description:
          "Sesión interactiva. Lee los patrones existentes primero, crea cinco archivos, ejecuta comprobación de vibración. Cero errores.",
      },
      step5: {
        actor: "Claude Code",
        label: "Finalización de los informes",
        description:
          "Se llama completa-tarea con la tarea ID. Estado: completado. Resumen adjunto.",
      },
      step6: {
        actor: "Thea",
        label: "Despierta.",
        description:
          "wakeUp dispara. Thea retoma la media conversación a través de websocket, transmite su respuesta, habla TTS.",
      },
      step7: {
        actor: "Resultado",
        label: "Existidos por todas partes",
        description:
          "Forma web. Comando CLI. herramienta MCP. Reactúa la pantalla nativa. Todos viven. De cinco archivos.",
      },
    },

    proofTitle: "La prueba",
    proofPara:
      'Una vez que Claude Code llamó "tarea completa", existían tres cosas que no eran cinco minutos antes:',
    proof1:
      "Un widget personalizado React - dirección dramática, gradiente animado en la salida AI, una puntuación de alineación corporativa falsa.",
    proof2:
      "Un widget CLI - banner ASCII, spinner mientras que el AI piensa, la línea de justificación impresa por línea en verde.",
    proof3:
      "Una herramienta MCP - explica-a-my- boss_POST - porque MCP_VISIBLE estaba en la definición. Claude Desktop ahora puede explicar sus decisiones a su jefe en su nombre.",
    proofClosing:
      "Una definición. Cinco archivos totales. Tres UIs completamente diferentes. El contrato de endpoint no cambió. Sólo la capa de presentación lo hizo.",
  },

  underTheHoodSection: {
    title: "Bajo la capucha",
    definitionTitle: "definition.ts - el contrato de vida",
    definitionPara:
      "La definición no es un generador de código. Es un contrato de vida que cada plataforma lee nativamente a tiempo de ejecución. Cámbialo - todas las actualizaciones. Eliminar la carpeta - nada se rompe río abajo. No hay código generado para limpiar.",
    repositoryTitle: "repository.ts - sin lanzamiento, nunca",
    repositoryPara:
      "Las funciones del repositorio nunca lanzan. Los errores se propagan como datos - escritos, explícitos y capturables por el callador. El AI puede razonar sobre los caminos de falla. No hay excepciones sorpresa.",
    repositoryCodeComment:
      "// Devoluciones RespuestaTipo asignadoT confidencial - nunca lanza",
    routeTitle: "route.ts - todo el puente",
    routePara:
      "route.ts conecta la definición al manejador. endpointsHandler se encarga de validación, auth, logging y exposición a las 13 plataformas. La lógica de negocio real es una línea.",
    statsTitle: "Los números",
    statEndpoints: "374 puntos finales",
    statEndpointsDetail: "Un patrón, aplicado 374 veces",
    statAny: "Zero `any`",
    statAnyDetail: "Forzada en tiempo de construcción, no convención",
    statLanguages: "Tres idiomas",
    statLanguagesDetail:
      'Compile-time comprobado - t("typo.here") es un error compilador',
    statsClosing:
      "Eso no es una convención. Se aplica a tiempo de construcción.",
  },

  onePatternQuote: "Un patrón. Repetido 374 veces.",

  vibeSenseTeaser: {
    eyebrow: "Siguiente",
    title: "Vibe Sense: El oleoducto es la plataforma",
    description:
      "Cada nodo en un gráfico Vibe Sense es un punto final next-vibe regular. El mismo createEndpoint (). La misma estructura de 3 ficheros. Un indicador EMA es un punto final. Un evaluador de umbrales es un punto final. Y porque es un punto final - se puede llamar desde el CLI, desde el AI, desde cualquier lugar.",
    calloutLine: "El oleoducto es la plataforma.",
    teaser:
      "Vibe Sense añade endpoints para series temporales. Embudos de prospectos, uso de créditos y crecimiento de usuarios. Tu plataforma se monitorea sola.",
    cta: "Volver al Blog",
  },

  closing: {
    title: "Definelo una vez. Existe en todas partes.",
    para: "WordPress le dio a todos el poder de publicar. next-vibe le da el poder de construir plataformas que funcionan en web, móvil, CLI, agentes AI, y automatización - que se observan ellos mismos, razón sobre sus propios datos, y actuar en lo que encuentran.",
    cta: "Star next-vibe en GitHub",
    frameworkCta: "Explora next-vibe",
  },
};
