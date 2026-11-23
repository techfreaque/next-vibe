import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Construir con next-vibe: {{appName}}",
    category: "Desarrolladores",
    description:
      "next-vibe convierte cualquier punto final en un formulario web, comando CLI, herramienta MCP, pantalla nativa, y AI: habilidad nominal simultáneamente. Automatizar cualquier cosa que un humano pueda hacer en una computadora.",
    imageAlt: "next-vibe plataforma de desarrolladores: {{appName}}",
    keywords:
      "next-vibe, automatización AI, plataforma de desarrolladores, automatización de negocios, integración ERP, automatización de producción, {{appName}}",
    ogTitle: "Construir con next-vibe: {{appName}}",
    ogDescription:
      "Una base de código. Cada superficie. Automatizar líneas de producción, sistemas ERP, flujos de trabajo de escritorio: cualquier cosa que un humano puede hacer en un ordenador.",
    twitterTitle: "Construir con next-vibe: {{appName}}",
    twitterDescription:
      "Una base de código. Cada superficie. Automatizar líneas de producción, sistemas ERP, flujos de trabajo de escritorio: cualquier cosa que un humano puede hacer en un ordenador.",
  },

  hero: {
    eyebrow: "Carreras",
    title: "El trabajo está abierto a todos.",
    subtitle:
      "Aquí encuentras el trabajo, sin ofertas de empleo. Lleva next-vibe a tus clientes, automatiza tareas reales y gana dinero con las habilidades que publiques. Todo lo que necesitas está en GitHub.",
    ctaPrimary: "Empieza a desarrollar",
    ctaSecondary: "Lee la documentación",
  },

  audience: {
    title: "Que construye con next-vibe",
    items: {
      freelancers: {
        title: "Freelancers &quot; agencies",
        description:
          "Entregar AI: herramientas propulsadas a los clientes sin construir backends separados, CLIs y UIs. Una base de código, cada superficie.",
      },
      businessDevs: {
        title: "Desarrolladores empresariales",
        description:
          "Conecta tu ERP, CRM, o cualquier sistema interno a los flujos de trabajo AI. Pase los datos, tome decisiones, sin código de pegamento.",
      },
      industrialDevs: {
        title: "Industriales e incrustados",
        description:
          "Configuración automática del dispositivo en las líneas de producción. Trigger AI habilidades cuando los sensores disparan. Medida con Vibe Sense, actuar con Autopilot.",
      },
      enterpriseDevs: {
        title: "Equipos institucionales",
        description:
          "Sustitúyase la herramienta fragmentada con una plataforma unificada. Web UI, CLI, MCP, aplicación nativa: mismo punto final, cero duplicación.",
      },
    },
  },

  useCases: {
    title: "Lo que puedes construir",
    items: {
      erpIntegration: {
        title: "ERP &amp; integración del sistema empresarial",
        description:
          "Pase los datos de producción en una habilidad AI que clasifica defectos, actualiza el inventario o activa flujos de trabajo reordenados. Tu punto final es el puente.",
      },
      desktopAutomation: {
        title: "Automatización completa de escritorio",
        description:
          "next-vibe puede apoderarse de todo el escritorio incluyendo un navegador. Forma llena, raspado, navegación, operaciones de archivos: scripted once, se ejecuta en cualquier lugar.",
      },
      productionLine: {
        title: "Automatización de la línea de producción",
        description:
          "Configurar dispositivos de forma remota a través de endpoint. Comprobación de calidad por Vibe Sense. Cuando una medida cruza un umbral, una habilidad AI responde.",
      },
      autopilotScheduling: {
        title: "Acciones programadas de AI",
        description:
          "Autopilot maneja tus habilidades en un horario. Vota una fuente de datos cada hora, resumir registros nocturnos, presionar alertas cuando aparecen anomalías.",
      },
      vibeSenseMonitoring: {
        title: "Sentido → decidir → actuar tuberías",
        description:
          "Vibe Sense mide cualquier cosa: salida de la máquina, salud API, profundidad de cola. Alimentar la lectura en una habilidad. La habilidad decide. Un punto final actúa.",
      },
      skillEconomy: {
        title: "Vender lo que construyes",
        description:
          "Envuelve tu automatización como una habilidad. Comparta el enlace. Ganar el 10% de cada pago de cada usuario que se registra a través de él: recurrente, por el tiempo que pagan.",
      },
    },
  },

  architecture: {
    title: "Una definición. Cada superficie.",
    subtitle:
      "Escribe un archivo definition.ts por función. El framework genera todo lo demás.",
    surfaces: {
      web: "Forma web",
      cli: "comando CLI",
      mcp: "herramienta MCP",
      native: "Pantalla nativa",
      cron: "Cron job",
      ai: "AI: habilidad nominal",
    },
    description:
      "La plataforma se detecta a tiempo de ejecución. El mismo punto final que hace un UI web para un humano se convierte en una herramienta de máquina-callable para un agente AI, sin código extra.",
  },

  referral: {
    title: "Construyelo. Comparta. Gana de ella.",
    description:
      "Cada habilidad que compartes lleva tu enlace de referencia. 10% de cada pago de los usuarios que traes. Más 5% cuando el enlace de otra persona trae a un usuario a su habilidad. Recurriendo, mientras paguen.",
    cta: "Cómo funciona la economía de habilidad",
  },

  cta: {
    title: "Empieza con un punto final.",
    subtitle:
      "Añadir next-vibe a un proyecto existente en minutos. O empezar desde el andamio e implementar una herramienta multi-superficie completa hoy.",
    primary: "Empieza.",
    secondary: "Explorar publicaciones de historia",
  },

  // kept for type compatibility
  post: {
    title: "Construir con next-vibe",
    description: "Portal de plataforma para desarrolladores",
    form: {
      title: "Configuración",
      description: "Configurar parámetros",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
