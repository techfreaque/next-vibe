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
    apply: "Aplicar &quot; Reiniciar &quot;",
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
    subtitle: "Vamos a configurar tu instancia en unos pocos pasos.",
    alreadyConfigured: "Ya configurado",
    stepOf: "Paso {{step}} de {{total}}",
    next: "Siguiente",
    continue: "Continuar",
    back: "Atrás",
    skip: "Saltear este paso",
    finish: "Acabado de configuración",
    restart: "Reiniciar el mago",
    done: "Configuración completa",
    doneSubtitle:
      "Tu instancia está lista. Siempre puedes actualizar la configuración más tarde.",
    goToSettings: "Vaya a Ajustes completos",
    viewAllSettings: "Ver todos los ajustes",
    encryptionNote:
      "Este valor será encriptado y almacenado de forma segura - nunca será legible en texto simple.",
    autoGeneratedNote:
      "Autogenerado - seguro de usar como-es, o reemplazar por su propio valor.",
    steps: {
      admin: "Cuenta de Admin",
      database: "Base de datos",
      security: "Claves de seguridad",
      ai: "AI Proveedor",
    },
    ai: {
      claudeCodeTitle: "Código Claude (Detectado por auto)",
      claudeCodeDescription:
        "Usa tu sesión Claude CLI local - no necesita llave API. Añadir OpenRouter abajo para acceder a 200+ modelos adicionales.",
      claudeDetected:
        "Claude CLI detectado! Asegúrate de que hayas iniciado sesión con `claude login`.",
      claudeNotDetected:
        "Claude CLI no se encuentra. Instala desde claude.ai /code, luego ejecute `claude login`. O saltar y usar OpenRouter abajo.",
      claudeInstallHint:
        "Opcional - puede utilizar OpenRouter u otros proveedores en su lugar.",
      openRouterTitle: "OpenRouter API Key",
      openRouterDescription:
        "Accede a cada modelo OpenRouter AI (GPT-4, Claude, Llama, y más). Funciona junto al código Claude o por su cuenta.",
      openRouterHint:
        "Consiga su llave API gratuita en openrouter.ai /keys - no se requiere tarjeta de crédito para modelos gratis.",
      unbottledTitle: "Unbottled AI Cloud",
      unbottledDescription:
        "Inicie sesión en unbottled.ai para acceder a todos los modelos AI sin gestionar las teclas API. Su instancia auto-anfitriona retransmite a través de la nube.",
      unbottledConnected: "Conectado a {{url}}",
      unbottledDisconnected: "No conectado",
      unbottledSignIn: "Iniciar sesión",
      unbottledSigningIn: "Firmando...",
      unbottledDisconnect: "Desconexión",
      unbottledEmail: "Correo electrónico",
      unbottledPassword: "Contraseña",
      unbottledRemoteUrl: "Cloud URL",
      unbottledLoginFailed:
        "Login fallado - comprobar su correo electrónico y contraseña.",
      unbottledConnectionError: "No podía llegar al servidor. Revisa el URL.",
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
      "Copia este archivo en su servidor:\nscp.env.prod user@yourserver:/app/.env\nO pegar manualmente:\nssh user@yourserver &quot; nano /app/.env",
    checklist: "Lista de verificación del despliegue",
    close: "Cerrar",
  },
};
