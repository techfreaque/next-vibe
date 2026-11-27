import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",

  errors: {
    readFailed: "No se puede leer la configuración del sistema",
    writeFailed: "Fallado para escribir la configuración a.env archivo",
    readOnly: "La configuración sólo se lee en este entorno",
    defaultPasswordDetected:
      "Contraseña de administración predeterminada detectada",
    passwordNotConfigured: "Contraseña de Admin no configurada",
  },

  messages: {
    settingsUpdated: "Ajustes actualizados",
  },

  get: {
    title: "Configuración del sistema",
    titleShort: "Configuración del sistema",
    description:
      "Ver y gestionar la configuración del entorno agrupada por módulo",
    tags: {
      settings: "Configuración",
    },
    response: {
      modules: {
        title: "Módulos de configuración",
      },
      isWritable: {
        title: "Writable",
      },
      isDevMode: {
        title: "Modo de Dev",
      },
      needsOnboarding: {
        title: "Necesidades a bordo",
      },
      onboardingIssues: {
        title: "Temas pendientes",
      },
      wizardSteps: {
        title: "Configuración de pasos del mago",
      },
    },
    success: {
      title: "Ajustes cargados",
      description: "Ajustes del medio ambiente recuperados con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Ajustes no encontrados",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to load settings",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
  },

  patch: {
    title: "Configuración de actualización",
    titleShort: "Configuración de actualización",
    description:
      "Actualizar los valores de configuración del entorno en el archivo.env",
    tags: {
      settings: "Configuración",
    },
    fields: {
      settings: {
        label: "Configuración",
        description: "Pares de valor clave para actualizar",
      },
    },
    response: {
      updated: {
        title: "Llaves actualizadas",
      },
      needsRestart: {
        title: "Necesidades reiniciar",
      },
      resultMessage: {
        title: "Ajustes actualizados",
      },
    },
    success: {
      title: "Ajustes guardados",
      description: "Ajustes del medio ambiente actualizados con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Valores de configuración inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Ajustes no encontrados",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to save settings",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
  },

  widget: {
    title: "Configuración del sistema",
    subtitle: "Variables de medio ambiente agrupadas por módulo",
    readOnlyBanner:
      "La configuración es sólo lectura. Editar el archivo.env directamente o utilizar el CLI.",
    onboardingBanner:
      "Configuración requerida - configurar los campos marcados para empezar.",
    defaultPasswordWarning:
      "¡Contraseña de administración predeterminada detectada! Cámbialo inmediatamente.",
    cancel: "Cancelar",
    save: "Guardar cambios",
    saving: "Salvando...",
    apply: "Aplicar y Reiniciar",
    applying: "Aplicando...",
    saved: "Ajustes guardados con éxito",
    restartRequired:
      "Ajustes guardados. Se requiere un reinicio para aplicar los cambios.",
    devRestartHint:
      "Reinicie el servidor dev (Ctrl+C y luego ejecute vibe dev) para aplicar cambios.",
    notSet: "no fijados",
    configured: "Configurado",
    partial: "Parcial",
    notConfigured: "No está configurado",
    required: "Obligatorio",
    selectPlaceholder: "Seleccione...",
    boolTrue: "on",
    boolFalse: "apagado",
    logPathDisabled: "archivo logging disabled",
    openSetup: "Abrir la configuración",
    restartWizard: "Asistente de configuración",
    exportProd: "Exportación para la Producción",
    generate: "Generar",
    editConfirmHint: "[Introducir] confirmar [Esc] cancelar",
    editSettings: "Modificar la configuración",
    exit: "Exit",
    loading: "Cargando ajustes...",
    moduleLabels: {
      env: "B.",
      agent: "Proveedores de IA",
      leadsCampaigns: "Principales campañas",
      messenger: "Messenger / SMTP",
      imap: "IMAP",
      payment: "Pagos",
      sms: "SMS",
      serverSystem: "Servidor / Plataforma",
    },
  },

  wizard: {
    title: "Bienvenido a Vibe Setup",
    subtitle: "Tres pasos cortos y ya estás chateando.",
    alreadyConfigured: "Ya configurado",
    stepOf: "Paso {{step}} de {{total}}",
    next: "Siguiente",
    continue: "Continuar",
    back: "Atrás",
    skip: "Omitir este paso",
    finish: "Terminar configuración",
    restart: "Reiniciar el asistente",
    done: "Configuración lista",
    doneSubtitle:
      "Tu instancia está lista. Cambia cualquier ajuste más tarde en Ver todos los ajustes.",
    goToSettings: "Ir a todos los ajustes",
    startChatting: "Empezar a chatear",
    viewAllSettings: "Ver todos los ajustes",
    encryptionNote:
      "Se guarda cifrado. Nadie puede volver a leerlo en texto plano.",
    autoGeneratedNote: "Generado para ti. Déjalo así o pega el tuyo.",
    steps: {
      admin: "Cuenta de administrador",
      database: "Base de datos",
      security: "Claves de seguridad",
      ai: "Proveedor de IA",
    },
    ai: {
      claudeCodeTitle: "Claude Code (detectado en este equipo)",
      claudeCodeDescription:
        "Usa tu sesión local de Claude CLI. Sin clave API.",
      claudeDetected:
        "Claude CLI encontrado. Comprueba que has iniciado sesión con `claude login`.",
      claudeNotDetected:
        "No se encontró Claude CLI. Instálalo desde claude.ai/code y ejecuta `claude login`, o usa otra opción de esta página.",
      claudeInstallHint:
        "Opcional. Tu cuenta de unbottled.ai o una clave de OpenRouter funcionan igual de bien.",
      openRouterTitle: "Clave API de OpenRouter",
      openRouterDescription:
        "Cientos de modelos con una sola clave. Funciona sola o junto a Claude Code.",
      openRouterHint:
        "Consigue una clave en openrouter.ai/keys. Los modelos gratis no piden tarjeta.",
      recommended: "Recomendado",
      unbottledTitle: "Tu cuenta de unbottled.ai",
      unbottledDescription:
        "Inicia sesión una vez y esta instancia tiene todos los modelos de unbottled.ai. Los chats se quedan en tu base de datos, el uso de modelos se descuenta de tus créditos. Requiere un plan de pago o un paquete de créditos.",
      unbottledNoAccount:
        "¿Aún sin cuenta? Créala en unbottled.ai y vuelve a iniciar sesión aquí.",
      unbottledConnected: "Conectado a {{url}}",
      unbottledDisconnected: "Sin conexión",
      unbottledSignIn: "Iniciar sesión",
      unbottledSigningIn: "Iniciando sesión...",
      unbottledDisconnect: "Desconectar",
      unbottledEmail: "Correo electrónico",
      unbottledPassword: "Contraseña",
      unbottledRemoteUrl: "URL de la nube",
      unbottledLoginFailed:
        "No se pudo iniciar sesión. Revisa tu correo y tu contraseña.",
      unbottledConnectionError:
        "No se pudo contactar con el servidor. Revisa la URL.",
      orDivider: "O usa tu propio proveedor",
    },
  },

  post: {
    title: "Inicie sesión en unbottled.ai",
    titleShort: "Unbottled Login",
    description:
      "Acceso proxy lado del servidor. credenciales nunca salen de su servidor",
    tags: { settings: "Unbottled Login" },
    fields: {
      email: {
        label: "Correo electrónico",
        description: "Correo electrónico de la cuenta unbottled.ai",
        placeholder: "you@example.com",
      },
      password: {
        label: "Contraseña",
        description: "contraseña de la cuenta unbottled.ai",
        placeholder: "Contraseña",
      },
      remoteUrl: {
        label: "Remoto URL",
        description: "unbottled.ai instance URL",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "Credencial",
        description: "Cadena credencial codificada",
      },
      syncScope: {
        label: "Sincronización",
        description: "Que datos se sincronizan sobre esta conexión.",
      },
    },
    success: { title: "Firmada", description: "Credencial recuperada" },
    errors: {
      validation: {
        title: "Error de validación",
        description: "E-mail, contraseña y URL",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Cuenta o sesión no encontradas",
      },
      network: {
        title: "Conexión fallida",
        description: "No podía llegar a la instancia remota",
      },
      server: {
        title: "No pudimos iniciar sesión",
        description: "Correo electrónico o contraseña incorrecta",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
    },
  },

  export: {
    title: "Exportación para la Producción",
    subtitle:
      "Generar un archivo.env listo para desplegar en su servidor. Los valores sensibles se muestran en texto simple - mantener este archivo seguro.",
    copyButton: "Copiado para el tablero de recortes",
    copied: "¡Copiado!",
    downloadButton: "Descargar.env.prod",
    instructions:
      "Copia este archivo en su servidor:\nscp .env.prod user@yourserver:/app/.env\nO pegar manualmente:\nssh user@yourserver && nano /app/.env",
    checklist: "Lista de verificación del despliegue",
    close: "Cerrar",
  },
};
