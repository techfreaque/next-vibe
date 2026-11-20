import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de campañas",
  tag: "Campaign Starter",
  task: {
    description:
      "Iniciar campañas para nuevos leads transfiriéndolos al estado PENDING",
  },
  errors: {
    server: {
      title: "Error del servidor",
      description:
        "Se produjo un error al procesar la solicitud de inicio de campaña",
    },
    invalidTransition: "Transición de estado inválido para la campaña",
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
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "Hay un conflicto entre los datos",
    },
  },
  post: {
    title: "Campaign Starter",
    titleShort: "Campaña de inicio",
    description: "Inicio de campañas para nuevas pistas",
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
        description: "Se produjo un error al iniciar las campañas",
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
      timezone: {
        label: "Zona horaria",
        description: "Zona horaria del navegador para la conversión de hora",
      },
      dryRun: {
        label: "Dry Run",
        description: "Corre sin hacer cambios",
      },
      force: {
        label: "Fuerza",
        description: "Previa día/hora horario restricciones",
      },
    },
    response: {
      leadsProcessed: "Contactos procesados",
      leadsStarted: "Contactos iniciados",
      leadsSkipped: "Contactos omitidos",
      executionTimeMs: "Tiempo de ejecución (ms)",
      errors: "Errores",
      quotaDetails: "Quota Detalles",
    },
    success: {
      title: "Campaign Starter Completed",
      description: "El inicio de la campaña corrió con éxito",
    },
  },
  get: {
    title: "Obtener Config de Inicio de Campaña",
    titleShort: "Campaign Config",
    description: "Recuperar configuración de arranque de campaña",
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
      timezone: {
        label: "Zona horaria",
        description: "Zona horaria del navegador para la conversión de hora",
      },
    },
    response: {
      dryRun: "Modo de ejecución seca",
      minAgeHours: "Horas de edad mínima",
      enabledDays: "Días habilitados",
      enabledHours: "Horas habilitadas",
      localeConfig: "Configuración local",
      leadsPerWeek: "Contactos por semana",
      schedule: "Horario",
      enabled: "Enabled",
      priority: "Prioridad",
      timeout: "Hora de salir",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    success: {
      title: "Config Retrieved",
      description: "Configuración de arranque de campaña recuperada con éxito",
    },
  },
  put: {
    title: "Campaign Starter Config",
    description: "Configuración de arranque de campaña de actualización",
    dryRun: {
      label: "Modo de ejecución seca",
      description: "Activar el modo de funcionamiento seco para la prueba",
    },
    minAgeHours: {
      label: "Horas de edad mínima",
      description: "Edad mínima en horas antes de procesar los cables",
    },
    enabledDays: {
      label: "Días habilitados",
      description: "Días de la semana en que se activan las campañas",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    },
    enabledHours: {
      label: "Horas habilitadas",
      description: "Horas del día en que las campañas están habilitadas",
      start: {
        label: "Hora de inicio",
        description: "Hora del día en que comienzan las campañas (0-23)",
      },
      end: {
        label: "Hora final",
        description: "Hora del día cuando terminan las campañas (0-23)",
      },
    },
    localeConfig: {
      label: "Configuración local",
      description:
        "Ajustes por ubicación: conduce por semana, días activos y horas activas",
    },
    leadsPerWeek: {
      label: "Contactos por semana",
      description: "Número máximo de pistas al proceso por semana",
    },
    schedule: {
      label: "Horario",
      description: "Calendario de ejecución de campañas",
    },
    enabled: {
      label: "Enabled",
      description: "Activar o desactivar el arranque de la campaña",
    },
    priority: {
      label: "Prioridad",
      description: "Nivel de prioridad para la ejecución de campañas",
    },
    timeout: {
      label: "Hora de salir",
      description: "Valor de tiempo en milisegundos",
    },
    retries: {
      label: "Retries",
      description: "Número de intentos de reingreso",
    },
    retryDelay: {
      label: "Retry Delay",
      description: "Dilatación entre intentos de retry en milisegundos",
    },
    success: {
      title: "Config Guardado",
      description: "Configuración de inicio de campaña guardada con éxito",
    },
  },
  priority: {
    critical: "Crítica",
    high: "Alto",
    medium: "Mediana",
    low: "Baja",
    background: "Antecedentes",
    filter: {
      all: "Todas las prioridades",
      highAndAbove: "Alto y arriba",
      mediumAndAbove: "Medio y superior",
    },
  },
  widget: {
    title: "Campaign Starter",
    titleSaved: "Configuración Guardada",
    description:
      "Iniciar campañas para nuevas pistas que están listas para ser contactadas.",
    saving: "Salvando...",
    save: "Guardar configuración",
    addLocale: "+ Añadir locale",
    guidanceTitle: "Configurar el Starter de Campaña",
    guidanceDescription:
      "Establezca el horario, días/horas activos, objetivos directos por semana y ajustes de tareas cron.",
    runButton: "Inicio Campañas",
    running: "Corriendo...",
    done: "Listo",
    perRunBudget:
      "~ {{perRunBudget}} leads/run · {{totalRunsPerWeek}} carreras/semana",
    perRunBudgetFractional:
      "{{exactBudget}} /run · {{totalRunsPerWeek}} funciona/semana (fraccional - se acumula a través de las carreras)",
    perRunBudgetZeroHint:
      "- aumentar los leads/semana o reducir la frecuencia de los horarios",
    sections: {
      general: "General",
      generalDescription:
        "Controles de maestría para habilitar el modo de arranque de la campaña y de ejecución seca.",
      schedule: "Horario",
      scheduleDescription:
        "¿Cuándo deben correr las campañas? Establece el horario cron, días activos y horas.",
      hoursTimezoneNote:
        "Horas en la zona horaria de su navegador ({{offset}}). Almacenado como UTC en el servidor.",
      quotas: "Quotas",
      quotasDescription:
        "Cuántos conducen al proceso por semana, derribado por la localidad.",
      advanced: "Avances",
      advancedDescription:
        "Ajustes de ejecución de tareas como prioridad, timeouts y comportamiento de reingreso.",
    },
    days: {
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri.",
      sat: "Sat",
      sun: "Sol",
    },
  },
};
