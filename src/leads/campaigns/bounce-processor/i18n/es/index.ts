import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de campañas",
  tag: "Bounce Processor",
  task: {
    description:
      "Scan IMAP bandeja de entrada para las notificaciones de rebote y actualizar el estado de plomo a BOUNCED",
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
    title: "Bounce Processor",
    titleShort: "Rebotes de procesos",
    description:
      "Procesamiento de las notificaciones de rebote de correo electrónico de IMAP",
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
        description: "Se produjo un error mientras se procesan bounces",
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
      dryRun: {
        label: "Dry Run",
        description: "Corre sin hacer cambios",
      },
      batchSize: {
        label: "Tamaño del lote",
        description:
          "Número máximo de correos electrónicos falsos para procesar por carrera",
      },
    },
    response: {
      bouncesFound: "Bounces Found",
      leadsUpdated: "Prospectos actualizados",
      campaignsCancelled: "Campañas canceladas",
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Guardar configuración",
      loadingText: "Salvando...",
    },
    success: {
      title: "Proceso de Bounce completado",
      description: "Remuneración de notificaciones tramitadas con éxito",
    },
  },
  get: {
    title: "Obtenga Config del Procesador de Bounce",
    titleShort: "Bounce Config",
    description:
      "Recuperar configuración de la tarea de fondo procesador de bounce",
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
      schedule: "Horario",
      priority: "Prioridad",
      timeout: "Hora de salir",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    backButton: {
      label: "Atrás",
    },
    success: {
      title: "Config Retrieved",
      description: "Configuración de procesadores Bounce recuperada con éxito",
    },
  },
  put: {
    title: "Bounce Processor Config",
    description:
      "Actualizar configuración de la tarea del procesador de bounce",
    enabled: {
      label: "Enabled",
      description:
        "Habilitar o desactivar la tarea de fondo del procesador rebote",
    },
    dryRun: {
      label: "Modo de ejecución seca",
      description: "Escáner para rebote sin actualizar el estado de plomo",
    },
    batchSize: {
      label: "Tamaño del lote",
      description:
        "Número máximo de correos electrónicos falsos para procesar por carrera (1–500)",
    },
    schedule: {
      label: "Horario",
      description:
        "Expresión de cron para cuándo ejecutar el procesador de bounce",
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
      description: "Configuración de procesadores Bounce guardada con éxito",
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
    title: "Configuración del procesador de recompensa",
    titleSaved: "Configuración Guardada",
    saving: "Salvando...",
    save: "Guardar configuración",
    guidanceTitle: "Configurar la tarea de fondo del procesador de Bounce",
    guidanceDescription:
      "Habilitar o desactivar la tarea cron del procesador de bounce y configurar su configuración de programación y lote.",
    runButton: "Corre ahora.",
    running: "Corriendo...",
    done: "Listo",
    sections: {
      general: "General",
      generalDescription:
        "Controles de maestría para habilitar la tarea del procesador rebote y el modo de funcionamiento seco.",
      schedule: "Horario",
      scheduleDescription:
        "Establece el crono programa para cuando se procesan los rebote.",
      processing: "Procesamiento",
      processingDescription:
        "Configure cuántos correos electrónicos falsos para procesar por carrera.",
      advanced: "Avances",
      advancedDescription:
        "Ajustes de ejecución de tareas como prioridad, timeouts y comportamiento de reingreso.",
    },
  },
};
