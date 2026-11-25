import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} autoalojado: tu servidor, todos los modelos",
    description:
      "Ejecuta {{appName}} en tu propia máquina. git clone, bun i, vibe dev. Inicia sesión con tu cuenta de {{appName}} y funcionan los {{modelCount}} modelos. Sin claves de proveedores.",
    category: "Autoalojamiento",
    imageAlt: "{{appName}} autoalojado en tu máquina",
    keywords:
      "autoalojado, self-host, chat de IA autoalojado, next-vibe, {{appName}}, código abierto, IA privada, IA local, IA sin censura",
  },
  hero: {
    badge: "Gratis y de código abierto",
    title: "Tu servidor.",
    titleHighlight: "Todos los modelos.",
    subtitle:
      "{{appName}} en tu propia máquina. Inicia sesión con tu cuenta de {{appName}} y funcionan los {{modelCount}} modelos. Cero claves de proveedores. Tus chats nunca salen de tu base de datos.",
    ctaStart: "Ponlo en marcha",
    ctaGithub: "Ver en GitHub",
  },
  diagram: {
    link: "Un solo inicio de sesión",
    instance: {
      label: "Corre en tu máquina",
      title: "Tu instancia",
      points: {
        chats: "Chats, memorias y documentos en tu propio Postgres",
        files: "Archivos subidos y medios generados en tu disco",
        tools: "Thea, tareas cron y todas las herramientas de IA",
        admin: "Tu acceso de admin. Tus reglas.",
      },
    },
    account: {
      label: "Corre en {{appName}}",
      title: "Tu cuenta",
      points: {
        models: "{{modelCount}} modelos, de los populares a los sin censura",
        credits: "El uso se cobra de tus créditos de {{appName}}",
        keys: "Ninguna clave de proveedor que gestionar",
        unlock: "Se desbloquea con cualquier plan o paquete de créditos",
      },
    },
  },
  start: {
    eyebrow: "Instalación",
    title: "Clona. Instala. Arranca.",
    intro:
      "Tres comandos en la terminal. Todo lo demás pasa en el navegador. Sin archivos de configuración que editar.",
    terminal: {
      eyebrow: "En la terminal",
      title: "Arranca tu instancia",
      copyAll: "Copiar todo",
      copy: "Copiar",
      copied: "Copiado",
      rows: {
        clone: "Descarga el código",
        cd: "Entra en la carpeta",
        install: "Instala. También pone vibe en tu PATH.",
        dev: "Arranca. La base de datos y los datos iniciales se preparan solos.",
      },
      facts: {
        docker: "Sin Docker",
        postgres: "Sin instalar Postgres",
        config: "Sin tocar el .env",
      },
      troubleshoot: {
        notFound: {
          problem: "¿vibe: command not found?",
          fix: "Abre una terminal nueva o ejecuta",
        },
        port: {
          problem: "¿Puerto 3000 ocupado?",
          fix: "Usa otro puerto:",
        },
      },
    },
    prereqs: {
      summary: "¿Máquina nueva? Instala primero git y Bun",
      body: "Una vez por máquina. Necesitas git y Bun 1.3 o superior. Elige tu sistema.",
      newTerminal:
        "Después abre una terminal nueva para que git y bun estén en tu PATH.",
    },
    browser: {
      eyebrow: "En el navegador",
      title: "El asistente de configuración hace el resto",
      recommended: "Recomendado",
      steps: {
        open: {
          title: "Abre {{url}}",
          body: "Una instancia nueva abre sola el asistente de configuración. Pulsa «Empezar la configuración».",
        },
        admin: {
          title: "Crea tu acceso de admin",
          body: "Tu correo, tu contraseña. Sustituye al acceso por defecto. Las claves de seguridad ya están generadas.",
        },
        ai: {
          title: "Conecta tu cuenta de {{appName}}",
          body: "Escribe el correo y la contraseña de {{appName}}. Con cualquier plan o paquete de créditos se desbloquean todos los modelos. Sin claves.",
        },
        extras: {
          title: "Extras, cuando los necesites",
          body: "Correo, pagos con Stripe, almacenamiento S3. Todo opcional. Sáltalo y vuelve después.",
        },
      },
      done: "Termina la configuración. A chatear.",
    },
  },
  ai: {
    eyebrow: "Conecta la IA",
    title: "Un inicio de sesión. Todos los modelos.",
    intro: "Tu instancia ejecuta la app. {{appName}} ejecuta los modelos.",
    account: {
      badge: "Recomendado",
      title: "Tu cuenta de {{appName}}",
      body: "Inicia sesión una vez en el asistente. Cada chat corre en tu instancia, cada llamada a un modelo corre en {{appName}} y se cobra de tus créditos.",
      points: {
        models: {
          title: "{{modelCount}} modelos",
          body: "Populares, abiertos y sin censura. El mismo catálogo que en {{appName}}.",
        },
        local: {
          title: "Los chats se quedan contigo",
          body: "Los hilos viven en tu base de datos. Solo se sincronizan si tú lo activas.",
        },
        sync: {
          title: "Tu configuración te sigue",
          body: "Memorias, documentos, skills y favoritos se sincronizan por defecto. Un interruptor para cada uno.",
        },
        paid: {
          title: "Cualquier compra lo desbloquea",
          body: "Una suscripción o cualquier paquete de créditos. Hasta tres instancias por cuenta.",
        },
      },
      cta: "Crea tu cuenta de {{appName}}",
      pricing: "Ver planes",
    },
    claude: {
      title: "Claude Code en esta máquina",
      body: "¿Has iniciado sesión con la CLI de claude? El asistente lo detecta. Los modelos de Claude corren con tu suscripción de Claude. Nada que escribir.",
    },
    keys: {
      title: "Tus propias claves de proveedor",
      body: "Sin cuenta de {{appName}}. Pega una clave en el mismo paso y paga directamente al proveedor.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
      },
      cta: "Consigue una clave de OpenRouter",
    },
  },
  own: {
    eyebrow: "Tu servidor, tus reglas",
    title: "Tu stack. Tu filtro.",
    subtitle:
      "Tu Postgres, tus archivos, tus logs. Tú eliges los modelos y cuánto filtro hay entre ellos y tú.",
    cards: {
      bill: {
        title: "Tu factura, tu decisión",
        body: "Los modelos se pagan con tus créditos de {{appName}} o directamente a tu propio proveedor. Tú eliges.",
      },
      filter: {
        title: "Tu nivel de filtro",
        body: "Modelos populares, abiertos o sin censura. Tú decides por skill y por hilo. Ningún equipo de políticas de por medio.",
      },
      code: {
        title: "Código abierto, sin ataduras",
        body: "El mismo código que {{appName}}, público en GitHub. Léelo, cámbialo, haz un fork.",
      },
    },
  },
  includes: {
    title: "Todo lo que tiene la nube.",
    intro: "El mismo código que {{appName}}. Nada guardado en el cajón.",
    items: {
      models: "{{modelCount}} modelos de chat, más imagen, vídeo, música y voz",
      memory: "Memoria persistente y chats de incógnito",
      search: "Búsqueda web y lectura de páginas",
      thea: "Thea, tu admin de IA: ejecuta tareas y crea herramientas cuando se lo pides",
      admin: "Panel de admin y tareas cron",
      tools:
        "SSH, automatización del navegador y cliente de correo como herramientas de IA",
    },
  },
  server: {
    eyebrow: "A producción",
    title: "Súbelo a un servidor.",
    intro:
      "El mismo repo, los mismos tres comandos. Después, una build de producción en lugar del servidor de desarrollo.",
    terminalTitle: "En tu servidor",
    rows: {
      start: "Primer arranque: build de producción",
      update: "Tras bajar cambios: actualización sin cortes",
    },
    points: {
      proxy: "Apunta Caddy o nginx al puerto 3000 para tener HTTPS.",
      env: "En la primera visita, el mismo asistente. ¿Prefieres variables de entorno? Defínelas en tu despliegue y reinicia.",
      connect:
        "Tu cuenta de {{appName}} se conecta desde el servidor igual que desde tu portátil.",
    },
  },
  developers: {
    title: "¿Quieres construir encima?",
    body: "Cada función es un archivo de definición que se convierte en página web, comando de CLI, herramienta MCP y herramienta de IA.",
    cta: "Mira cómo funciona next-vibe",
  },
  help: {
    title: "¿Atascado, o lo montas para un equipo?",
    description:
      "Ayuda con la instalación, despliegues para equipos, integraciones a medida. Una persona lee cada mensaje.",
  },
};
