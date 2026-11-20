import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Aloja {{appName}} en tu propio equipo",
    description:
      "Ejecuta toda la plataforma {{appName}} en tu equipo. Cuatro comandos y luego un asistente de configuración en el navegador. Conecta tu cuenta de {{appName}} o usa tus propias claves.",
    category: "Alojamiento propio",
    imageAlt: "Guía rápida para alojar {{appName}} en tu equipo",
    keywords:
      "alojamiento propio, next-vibe, {{appName}}, código abierto, IA privada, IA local, OpenRouter",
  },
  hero: {
    badge: "Gratis y de código abierto",
    title: "Ejecútalo en tu equipo.",
    titleHighlight: "Controla todo.",
    subtitle:
      "Toda la plataforma {{appName}} en tu equipo. Conecta tu cuenta de {{appName}} para acceder a todos los modelos o usa tus propias claves. Ejecuta cuatro comandos y termina la configuración en el navegador.",
    ctaQuickstart: "Empieza con cuatro comandos",
    ctaGithub: "Ver en GitHub",
  },
  quickstart: {
    eyebrow: "Guía rápida",
    title: "Cuatro comandos. Después, abre el navegador.",
    intro:
      "Al iniciar sesión por primera vez, un asistente te guía por el resto de la configuración. No tienes que editar archivos.",
  },
  paths: {
    eyebrow: "Elige tu IA",
    title: "Tu equipo. Los modelos que tú elijas.",
    intro:
      "Las dos opciones están en el paso del proveedor de IA del asistente. Puedes cambiar cuando quieras.",
    account: {
      badge: "Recomendado",
      title: "Conecta tu cuenta de {{appName}}",
      body: "Inicia sesión una vez en el asistente. Tu instancia gestiona los chats. Los modelos se ejecutan en {{appName}} y consumen tus créditos. No tienes que gestionar claves de API.",
      points: {
        models:
          "Los {{modelCount}} modelos, de los convencionales a los que vienen sin censura, con un solo inicio de sesión.",
        local: "Los chats se quedan en tu base de datos local.",
        sync: "Los recuerdos, los documentos, las habilidades y los favoritos se sincronizan de forma predeterminada. Puedes activar la sincronización de las conversaciones. Cada categoría se configura por separado.",
        paid: "Necesitas un plan de pago o un paquete de créditos. Hasta tres instancias por cuenta.",
      },
      cta: "Crea tu cuenta de {{appName}}",
    },
    standalone: {
      badge: "Sin cuenta",
      title: "Usa tu instancia con tus propias claves",
      body: "No necesitas una cuenta con nosotros. Pega la clave de un proveedor en el mismo paso y paga directamente al proveedor.",
      points: {
        openrouter: "OpenRouter: cientos de modelos con una clave.",
        claude:
          "¿Ya iniciaste sesión en Claude Code en este equipo? Lo detectamos automáticamente. No necesitas una clave.",
        more: "Encuentra otros proveedores en Ver toda la configuración.",
        billing: "Pagas directamente al proveedor, sin cargos de {{appName}}.",
      },
      cta: "Consigue una clave de OpenRouter",
    },
  },
  own: {
    eyebrow: "Tu servidor, tus reglas",
    title: "Controla la plataforma. Elige el filtro.",
    subtitle:
      "Tu Postgres, tus archivos, tus registros. Elige los modelos y cuánto quieres filtrar las respuestas.",
    cards: {
      data: {
        title: "Tus datos se quedan en tu equipo",
        body: "Las conversaciones, los recuerdos y los archivos se quedan en tu base de datos y en la ubicación de almacenamiento que elijas.",
      },
      filter: {
        title: "Tu nivel de filtrado",
        body: "Elige entre modelos convencionales, abiertos o sin censura para cada habilidad y conversación. Tú tienes la última palabra.",
      },
      keys: {
        title: "Tú eliges cómo pagar",
        body: "Paga el uso de los modelos con tus créditos de {{appName}} o directamente al proveedor.",
      },
    },
  },
  includes: {
    title: "Todas las funciones de la versión en la nube.",
    intro: "El mismo código de {{appName}}, con todas las funciones.",
    items: {
      models:
        "{{modelCount}} modelos de chat, además de imágenes, videos, música y voz",
      memory: "Memoria persistente y chats en modo incógnito",
      search: "Búsqueda web y lectura de páginas",
      thea: "Thea, tu administradora de IA: ejecuta tareas y crea herramientas cuando se lo pides",
      admin: "Panel de administración y tareas cron",
      tools:
        "SSH, automatización del navegador y cliente de correo como herramientas de IA",
    },
  },
  developers: {
    title: "¿Quieres desarrollar sobre esta base?",
    body: "Cada función tiene un archivo de definición. De ahí salen una página web, un comando de CLI, una herramienta MCP y una herramienta de IA.",
    cta: "Descubre cómo funciona next-vibe",
  },
  help: {
    title: "¿Necesitas ayuda o lo vas a instalar para un equipo?",
    description:
      "Te ayudamos con la configuración, instalaciones para equipos e integraciones personalizadas. Una persona lee cada mensaje.",
  },
};
