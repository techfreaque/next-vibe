import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de campañas",
  tag: "Campañas de correo electrónico",
  task: {
    description:
      "Enviar campañas de correo electrónico automatizadas a los líderes en función de su etapa y tiempo",
  },
  errors: {
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "No tienes acceso",
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
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    conflict: {
      title: "Conflicto",
      description: "Hay un conflicto entre los datos",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
  },
  post: {
    title: "Campañas de correo electrónico",
    titleShort: "Send Campaigns",
    description: "Campañas de correo electrónico de procesos para los líderes",
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
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
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    fields: {
      batchSize: {
        label: "Tamaño del lote",
        description: "Número de pistas para procesar por lote",
      },
      maxEmailsPerRun: {
        label: "Max Emails Per Run",
        description:
          "Número máximo de correos electrónicos para enviar por carrera",
      },
      dryRun: {
        label: "Dry Run",
        description: "Corre sin enviar correos electrónicos",
      },
    },
    response: {
      emailsScheduled: "Correos electrónicos programados",
      emailsSent: "Emails Sent",
      emailsFailed: "Correos fallidos",
      leadsProcessed: "Contactos procesados",
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
  get: {
    title: "Consiga campañas de correo electrónico Config",
    titleShort: "Email Campaign Config",
    description:
      "Recuperar las campañas de correo electrónico configuración de la tarea de fondo",
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
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
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    response: {
      enabled: "Enabled",
      dryRun: "Modo de ejecución seca",
      batchSize: "Tamaño del lote",
      maxEmailsPerRun: "Max Emails Per Run",
      schedule: "Horario",
      priority: "Prioridad",
      timeout: "Hora de salir",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    success: {
      title: "Config Retrieved",
      description:
        "Configuración de campañas de correo electrónico recuperada con éxito",
    },
  },
  put: {
    title: "Email Campaigns Config",
    description:
      "Actualizar la configuración de la tarea de correo electrónico",
    enabled: {
      label: "Enabled",
      description:
        "Activar o desactivar la tarea de fondo de las campañas de correo electrónico",
    },
    dryRun: {
      label: "Modo de ejecución seca",
      description: "Procesar correos electrónicos sin enviarlos realmente",
    },
    batchSize: {
      label: "Tamaño del lote",
      description: "Número de pistas para procesar por lote (1–100)",
    },
    maxEmailsPerRun: {
      label: "Max Emails Per Run",
      description:
        "Número máximo de correos electrónicos para enviar por carrera de fondo (1–1000)",
    },
    schedule: {
      label: "Horario",
      description:
        "Expresión de cron para cuándo ejecutar campañas de correo electrónico",
    },
    priority: {
      label: "Prioridad",
      description: "Nivel de prioridades para la ejecución de tareas",
    },
    timeout: {
      label: "Hora de salida (ms)",
      description: "Tiempo máximo de ejecución en milisegundos",
    },
    retries: {
      label: "Retries",
      description: "Número de intentos de reingreso al fracaso",
    },
    retryDelay: {
      label: "Retry Delay (ms)",
      description: "Dilatación entre intentos de retry en milisegundos",
    },
    success: {
      title: "Config Guardado",
      description:
        "Configuración de campañas de correo electrónico guardada con éxito",
    },
  },
  priority: {
    critical: "Crítica",
    high: "Alto",
    medium: "Mediana",
    low: "Baja",
    background: "Antecedentes",
  },
  widget: {
    title: "Configuración de campañas de correo electrónico",
    titleSaved: "Configuración Guardada",
    saving: "Salvando...",
    save: "Guardar configuración",
    guidanceTitle:
      "Configurar la tarea de fondo de campañas de correo electrónico",
    guidanceDescription:
      "Habilitar o desactivar la tarea cron de las campañas de correo electrónico y configurar su calendario, tamaño del lote y configuración de ejecución.",
    runButton: "Corre ahora.",
    running: "Corriendo...",
    done: "Listo",
    sections: {
      general: "General",
      generalDescription:
        "Controles de maestría para habilitar la tarea de campañas de correo electrónico y el modo de ejecución seco.",
      schedule: "Horario",
      scheduleDescription:
        "Establece el calendario cron para cuando se envían correos electrónicos.",
      processing: "Procesamiento",
      processingDescription:
        "Configure cuántas pistas y correos electrónicos procesar por carrera.",
      advanced: "Avances",
      advancedDescription:
        "Ajustes de ejecución de tareas como prioridad, timeouts y comportamiento de reingreso.",
    },
  },
};
