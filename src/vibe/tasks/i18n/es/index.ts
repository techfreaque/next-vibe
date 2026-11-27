import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de tareas",
  tags: {
    tasks: "Tareas",
  },
  type: {
    cron: "Cron Task",
    side: "Side Task",
    task_runner: "Task Runner",
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
  status: {
    pending: "Pendiente",
    running: "Corriendo",
    completed: "Completado",
    failed: "Failed",
    timeout: "Hora de salir",
    cancelled: "Cancelada",
    skipped: "Saltó.",
    blocked: "Bloqueados",
    scheduled: "Programado",
    stopped: "Detenido.",
    error: "Error",
    filter: {
      all: "Todos los estatutos",
      active: "Activa",
      error: "Estados de error",
    },
  },
  taskCategory: {
    development: "Desarrollo",
    build: "Compilación",
    watch: "Mira.",
    generator: "Generador",
    test: "Test",
    maintenance: "Mantenimiento",
    database: "Base de datos",
    system: "Sistema",
    monitoring: "Monitoreo",
    leadManagement: "Gestión de contactos",
  },
  enabledFilter: {
    all: "Todos",
    enabled: "Enabled",
    disabled: "Discapacitados",
  },
  hiddenFilter: {
    visible: "Visible",
    hidden: "Oculto",
    all: "Todos",
  },
  sort: {
    asc: "Ascendencia",
    desc: "Descendiente",
  },
  pulse: {
    health: {
      healthy: "Salud",
      warning: "Advertencia",
      critical: "Crítica",
      unknown: "Desconocida",
    },
    execution: {
      success: "Operación completada",
      failure: "Fallo",
      timeout: "Hora de salir",
      cancelled: "Cancelada",
      pending: "Pendiente",
    },
  },
  cron: {
    frequency: {
      everyMinute: "cada minuto",
      everyHour: "cada hora",
      everyDays: "todos los días",
      hourly: "horaria",
    },
    days: {
      sunday: "Domingo",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
    },
    common: {
      dailyAtMidnight: "diariamente a medianoche",
      dailyAtNoon: "todos los días al mediodía",
      weeklyOnSunday: "semanales el domingo",
      monthlyOnFirst: "mensual en la primera",
      everyFiveMinutes: "cada 5 minutos",
      everyThreeMinutes: "cada 3 minutos",
      everyOneMinutes: "cada minuto",
      everyTenMinutes: "cada 10 minutos",
      everyFifteenMinutes: "cada 15 minutos",
      everyThirtyMinutes: "cada 30 minutos",
    },
    patterns: {
      everyIntervalMinutes: "cada {{interval}} minutos",
      everyIntervalMinutesStarting:
        "cada {{interval}} minutos comenzando a minuto {{start}}",
      atMinutes: "en minutos {{minutes}}",
      fromMinuteToMinute: "desde el minuto {{from}} a {{to}}",
      atMinute: "a minuto {{minute}}",
      everyIntervalHours: "cada hora {{interval}}",
      everyIntervalHoursStarting:
        "cada hora {{interval}} comienza a la hora {{start}}",
      atHours: "horas {{hours}}",
      fromHourToHour: "desde la hora {{from}} a {{to}}",
      atHour: "a las {{hour}}",
    },
    calendar: {
      onDays: "días {{days}}",
      onDay: "el día {{day}}",
      inMonths: "en {{months}}",
      inMonth: "en {{month}}",
      onWeekdays: "on {{days}}",
      fromWeekdayToWeekday: "desde {{start}} a {{end}}",
      onWeekday: "on {{day}}",
    },
    timezone: "en {{timezone}}",
    time: {
      midnight: "medianoche",
      noon: "mediodía",
      hourAm: "{{hour}} AM",
      hourPm: "{{hour}} PM",
      hourMinuteAm: "{{hour}}:{{minute}} AM",
      hourMinutePm: "{{hour}}:{{minute}} PM",
    },
    weekdays: {
      sunday: "Domingo",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
    },
    months: {
      january: "Enero",
      february: "Febrero",
      march: "Marzo",
      april: "Abril",
      may: "Mayo",
      june: "Junio",
      july: "Julio",
      august: "Agosto",
      september: "Septiembre",
      october: "Octubre",
      november: "Noviembre",
      december: "Diciembre",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Failed to lotch cron tasks: {{error}}",
    createCronTask: "Failed to create cron task",
    updateCronTask: "Failed to update cron task",
    deleteCronTask: "Fallado para eliminar la tarea del cron",
    fetchCronTaskHistory: "Failed para conseguir historia de la tarea del cron",
    fetchCronTaskStats: "Failed to fetch cron task statistics",
    fetchCronStatus: "Fallado para conseguir el estado del sistema de cron",
    cronTaskNotFound: "Cron task not found",

    // Unified Runner errors
    startTaskRunner: "Fallado para iniciar el corredor de tareas: {{error}}",
    stopTaskRunner: "No para de detener al corredor de tareas",
    getTaskRunnerStatus:
      'Failed to get task runner status: unknown action " {{action}} "',
    executeCronTask: "Fallado para ejecutar la tarea de cron",

    // Pulse errors
    executePulse: "Fallado para ejecutar el pulso",
    fetchPulseStatus: "No se logró conseguir el estado del pulso",
    pulseExecutionFailed: "Falló la ejecución de pulsos",
    pulseInternalError: "Error interno en el sistema de pulsos",

    // Validation errors
    invalidTaskInput:
      "La entrada de la tarea no coincide con el esquema de solicitud del endpoint",
    endpointNotFound: "Punto final no encontrado para la ruta dada ID",

    // Repository errors
    repositoryNotFound: "No se encontró el recurso",
    repositoryNotFoundDetail: "No se encontró ninguna tarea para ID {{taskId}}",
    repositoryInternalError: "Se produjo un error interno",
    repositoryInternalErrorDetail: "Se produjo un error interno: {{error}}",
    repositoryGetTaskForbidden:
      "Usted no tiene permiso para ver la tarea {{taskId}}",
    repositoryUpdateTaskForbidden:
      "Usted no tiene permiso para actualizar esta tarea",
    repositoryUpdateTaskForbiddenDetail:
      "Usted no tiene permiso para actualizar la tarea {{taskId}}",
    repositoryDeleteTaskForbidden:
      "Usted no tiene permiso para eliminar la tarea {{taskId}}",
  },
  common: {
    cronRepositoryTaskUpdateFailed:
      "Failed to update cron task {{taskId}} : {{error}}",
    cronRepositoryTaskDeleteFailed:
      "Failed to delete cron task {{taskId}} : {{error}}",
    cronRepositoryExecutionCreateFailed:
      "Failed to create execution for cron task {{taskId}} : {{error}}",
    cronRepositoryExecutionUpdateFailed:
      "No se ha actualizado la ejecución de la tarea cron",
    cronRepositoryExecutionsFetchFailed:
      "Fallado para conseguir ejecuciones de tareas de cron",
    cronRepositoryRecentExecutionsFetchFailed:
      "Falló en conseguir ejecuciones recientes de tareas de cron",
    cronRepositorySchedulesFetchFailed: "Failed to fetch cron task schedules",
    cronRepositoryScheduleUpdateFailed:
      "No se ha actualizado el calendario de tareas cron",
    cronRepositoryStatisticsFetchFailed: "Failed to fetch cron task statistics",
  },
  outputMode: {
    storeOnly: "Almacén",
    notifyOnFailure: "Notificar sobre el fracaso",
    notifyAlways: "Notificar siempre",
  },
  dbHealthCheck: {
    name: "Comprobación del estado de la base de datos",
    description:
      "Comprueba cada minuto el estado de la conexión con la base de datos.",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Llama al repositorio de pulso una vez por minuto para activar las tareas programadas",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Relojes para cambios de archivos y desencadena generadores en modo de desarrollo",
  },
  dbHealth: {
    tag: "Base de datos",
    post: {
      title: "Control de salud del sistema",
      titleShort: "DB Health",
      description: "Controle la base de datos, la memoria y la salud del disco",
      container: {
        title: "Sistema de salud",
        description: "Conectividad DB, uso de la memoria y uso del disco",
      },
      response: {
        healthy: "Salud",
        status: "Situación",
        dbResponseMs: "Respuesta de DB (ms)",
        memoryUsedPct: "Memoria utilizada (%)",
        heapUsedMb: "Heap Usado (MB)",
        rssMb: "RSS (MB)",
        diskUsedPct: "Disk Usado (%)",
        uptimeHours: "Horas de trabajo (horas)",
        warnings: "Advertencias",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        server: {
          title: "Error del servidor",
          description: "Control de salud de bases de datos falló",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        systemAlert: "Sistema {{status}} : {{warnings}}",
      },
      success: {
        title: "DB Healthy",
        description: "La conexión de base de datos es saludable",
      },
    },
  },
  completeTask: {
    post: {
      title: "Tareas completas",
      titleShort: "Tareas completas",
      description:
        "Marcar una tarea de fondo como terminada. Llamado por el agente de codificación cuando se hace el trabajo asinc. El marco revive el flujo de espera AI con el resultado.",
      fields: {
        taskId: {
          title: "Task ID",
          description:
            "La base de datos de tareas de cron ID para marcar como completo.",
        },
        status: {
          title: "Situación",
          description:
            "Estado final: 'completo' para el éxito, 'failado' para el fracaso, 'cancelled' para cancelar.",
        },
        summary: {
          title: "Resumen",
          description: "Breve descripción de lo que se logró o por qué falló.",
        },
        output: {
          title: "Carga de salida",
          description:
            "Carga útil de datos estructurada opcional (pares de valor clave) para adjuntar al resultado de ejecución.",
        },
        completed: {
          title: "Completado",
          description: "Ya sea que la tarea se marcó con éxito como se hizo.",
        },
        updatedAt: {
          title: "Actualizado en",
          description: "Horarios cuando se actualizó el estado de tarea.",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Tareas inválidas ID o valor de estado",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        internal: {
          title: "Terminación fallida",
          description: "Fallado para marcar la tarea como completo",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        notFound: {
          title: "Task Not Found",
          description: "No se encontró ninguna tarea con el ID dado",
        },
        network: {
          title: "Error de red",
          description: "Falló en empujar la terminación a instancia remota",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Se detectaron cambios no observados",
        },
        conflict: {
          title: "Conflicto",
          description: "La tarea no está en un estado completo",
        },
      },
      success: {
        title: "Tareas completadas",
        description:
          "Tareas marcadas como hecho y la secuencia AI revivió con el resultado",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Espera a la tarea",
      titleShort: "Espera a la tarea",
      description:
        "Espera en una tarea de fondo pendiente. Devuelve el resultado inmediatamente si ya se ha completado, o detiene el flujo AI hasta que la tarea termine (mecanismo wakeUp).",
      fields: {
        taskId: {
          title: "Task ID",
          description: "El ID de la tarea de esperar.",
        },
        status: {
          title: "Situación",
          description: "Situación actual de la tarea.",
        },
        result: {
          title: "Resultado",
          description:
            "Carga de pago del resultado de la tarea (presente cuando se haya completado).",
        },
        waiting: {
          title: "Esperando",
          description:
            "Es cierto cuando se detiene el flujo esperando que la tarea se complete.",
        },
        originalToolName: {
          title: "Herencia",
          description: "La herramienta original que fue ejecutada.",
        },
        originalArgs: {
          title: "Argumentos",
          description: "Los argumentos originales de la herramienta.",
        },
      },
      widget: {
        noToolName: "No hay nombre de herramienta disponible.",
        resolving: "Herramienta de solución...",
        unknownTool: "Herramienta desconocida: {{toolName}}",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Inválido taskId",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        internal: {
          title: "Error interno",
          description: "No se registró al camarero en la tarea",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        notFound: {
          title: "Task Not Found",
          description: "No se encontró ninguna tarea con ese ID",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Se detectaron cambios no observados",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
      },
      success: {
        title: "Resultado de la tarea listo",
        description: "Trabajo completado o camarero registrado",
      },
      status: {
        waiting: "Esperando a la tarea...",
        complete: "Tareas completas",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description: "Escaneos hilos de chat para patrones de error cada 3 horas",
    tag: "Monitoreo",
    post: {
      title: "Monitor de error",
      description:
        "Monitorización de errores de primer orden de privacidad - escanea mensajes para patrones de error sin leer contenido",
      container: {
        title: "Resultados del análisis de errores",
        description: "Patrones de error agregados de mensajes de chat",
      },
      response: {
        errorsFound: "Errores encontrados",
        threadsScanned: "Panes escaneados",
        scanWindowFrom: "Scan Window Start",
        scanWindowTo: "Fin de ventana de exploración",
        patternType: "Tipo de error",
        patternCount: "Conde",
        patternThreadIds: "ID de pan",
        patternModel: "Modelo",
        patternTool: "Herencia",
        patternFirstSeen: "Primer visto",
        patternLastSeen: "El último visto.",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        server: {
          title: "Error del servidor",
          description: "El análisis de error falló",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
      },
      success: {
        title: "Escáner completo",
        description: "Se completó el análisis de errores con éxito",
      },
    },
    cleanup: {
      name: "Limpieza del registro de errores",
      description:
        "Borra los registros de error de más de seis meses y conserva como máximo 100 000 entradas.",
      post: {
        title: "Errores de limpieza",
        titleShort: "Limpieza de registros",
        description:
          "Eliminar entradas de registro de errores antiguas (basadas en tiempo + conteo) para mantener la base de datos inclinada",
        container: {
          title: "Resultados de limpieza",
          description: "Número de registros de error eliminados",
        },
        response: {
          deletedCount: "Cuenta suprimida",
          deletedByTime: "Suprimido por el tiempo",
          deletedByCount: "Eliminado por el Conde Cap",
          retentionDays: "Días de retención",
          maxRows: "Max Rows",
        },
        success: {
          title: "Limpieza completa",
          description: "Registros de errores antiguos podados con éxito",
        },
      },
    },
  },
  csvProcessor: {
    description: "Procesos CSV importa empleos en pedazos",
  },
  imapSync: {
    description: "Sincroniza cuentas IMAP, carpetas y mensajes automáticamente",
  },
  newsletterUnsubscribeSync: {
    description:
      "Sincroniza los estados principales de los suscriptos del boletín informativo",
  },
  cronSystem: {
    history: {
      category: "Gestión de tareas",

      errors: {
        cronTaskNotFound: "Cron task not found",
        repositoryInternalError: "Se produjo un error interno",
        fetchCronTaskHistory:
          "Failed para conseguir historia de la tarea del cron",
      },

      get: {
        tags: {
          tasks: "Tareas",
          monitoring: "Monitoreo",
        },
        title: "Historia de la ejecución de tareas",
        description:
          "Ver registros de ejecución históricos para tareas de cron",
        fields: {
          taskId: {
            label: "Task ID",
            description: "Filtro por tarea específica ID",
            placeholder: "Ingrese la tarea ID",
          },
          taskName: {
            label: "Nombre de la tarea",
            description: "Filtro por nombre de tarea (concordancia parcial)",
            placeholder: "Ingrese el nombre de tarea",
          },
          status: {
            label: "Estado de ejecución",
            description: "Filtro por estado de ejecución",
            placeholder: "Seleccione los estados",
            options: {
              PENDING: "Pendiente",
              SCHEDULED: "Programado",
              RUNNING: "Corriendo",
              COMPLETED: "Completado",
              FAILED: "Failed",
              ERROR: "Error",
              TIMEOUT: "Hora de salir",
              SKIPPED: "Saltó.",
              CANCELLED: "Cancelada",
              STOPPED: "Detenido.",
              BLOCKED: "Bloqueados",
            },
          },
          priority: {
            label: "Prioridad de la tarea",
            description: "Filtro por nivel de prioridad de tarea",
            placeholder: "Seleccionar prioridades",
            options: {
              LOW: "Baja",
              MEDIUM: "Mediana",
              HIGH: "Alto",
              CRITICAL: "Crítica",
            },
          },
          startDate: {
            label: "Fecha de inicio",
            description: "Ejecuciones de filtro después de esta fecha",
          },
          endDate: {
            label: "Fecha final",
            description: "Ejecuciones de filtro antes de esta fecha",
          },
          limit: {
            label: "Límite de resultados",
            description: "Número máximo de resultados a la vuelta",
            placeholder: "50",
          },
          offset: {
            label: "Resultados Offset",
            description: "Número de resultados para saltar para paginación",
            placeholder: "0",
          },
        },
        response: {
          title: "Respuesta a la historia de la tarea",
          description: "Datos históricos de ejecución para tareas de cron",
          executions: {
            title: "Documentos de ejecución",
          },
          totalCount: {
            title: "Total Conde",
          },
          hasMore: {
            title: "Tiene más resultados",
          },
          statusCounts: {
            title: "Cuentas de Estado",
          },
          summary: {
            title: "Resumen de ejecución",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud inválidos proporcionados",
          },
          internal: {
            title: "Error de servidor interno",
            description: "Fallado para recuperar la historia de la tarea",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Usted no tiene permiso para ver el historial de tareas",
          },
          notFound: {
            title: "No encontrado",
            description: "Registro de tareas o ejecución no encontrado",
          },
          network: {
            title: "Error de red",
            description:
              "Se produjo error de red mientras que el historial de tareas de búsqueda",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "El acceso a la historia de la tarea está prohibido",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsavedChanges: {
            titleChanges: "Cambios sin guardar",
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Historia Conseguida",
          description: "Historia de ejecución de tareas recuperada con éxito",
        },
        log: {
          fetchSuccess: "Registros de ejecución de {{count}} con éxito",
          fetchError: "Fallado en la historia de ejecución de tareas",
        },
        request: {
          title: "Solicitar parámetros",
          description: "Historial de ejecución de tareas filtrantes",
        },
        unknownTask: "Tareas desconocidas",
      },
      widget: {
        title: "Historia de la ejecución de tareas",
        loading: "Cargando historia...",
        header: {
          tasks: "Tareas",
          stats: "Stats",
          pulse: "Pulse",
          refresh: "Actualizar",
        },
        summary: {
          total: "Total",
          successful: "Éxito",
          failed: "Failed",
          successRate: "Tasa de éxito",
          avgDuration: "Duración de la Avg",
        },
        search: {
          placeholder: "Tareas de búsqueda...",
        },
        filter: {
          all: "Todos",
          running: "Corriendo",
          completed: "Completado",
          failed: "Failed",
          timeout: "Hora de salir",
          cancelled: "Cancelada",
        },
        col: {
          taskName: "Nombre de la tarea",
          status: "Situación",
          duration: "Duración",
          started: "Comienzo",
          completed: "Completado",
          environment: "para el Medio Ambiente",
          error: "Error",
        },
        empty: "No hay historial de ejecución encontrado",
        result: "Resultado",
        error: {
          collapse: "Error de colapso",
          label: "Error",
        },
        pagination: {
          info: "Página {{page}} de {{totalPages}} (Total {{total}})",
          prev: "Anterior",
          next: "Siguiente",
        },
      },
    },
    stats: {
      category: "Gestión de tareas",

      errors: {
        fetchCronTaskStats: "Failed to fetch cron task statistics",
      },

      get: {
        title: "Obtener estadísticas de la tarea de hierro",
        description:
          "Recuperar estadísticas y métricas completas para tareas de cron",
        tag: "Estadísticas del Cron",
        form: {
          title: "Solicitud de estadísticas de hierro",
          description:
            "Configurar parámetros para recuperar estadísticas de tareas de cron",
        },
        fields: {
          period: {
            title: "Período de tiempo",
            description:
              "Período de tiempo para la agregación de las estadísticas",
          },
          type: {
            title: "Tipo de estadística",
            description: "Tipo de estadísticas para recuperar",
          },
          taskId: {
            title: "Task ID",
            description:
              "Tareas específicas opcionales ID para filtrar estadísticas",
          },
          limit: {
            title: "Límite de resultados",
            description: "Número máximo de resultados a la vuelta",
          },
          timePeriod: {
            title: "Período de tiempo",
          },
          dateRangePreset: {
            title: "Date Range Preset",
          },
          taskName: {
            title: "Nombre de la tarea",
          },
          taskStatus: {
            title: "Estado de la tarea",
          },
          taskPriority: {
            title: "Prioridad de la tarea",
          },
          healthStatus: {
            title: "Situación de salud",
          },
          minDuration: {
            title: "Duración mínima",
          },
          maxDuration: {
            title: "Duración máxima",
          },
          includeDisabled: {
            title: "Incluidos los discapacitados",
          },
          includeSystemTasks: {
            title: "Incluir tareas del sistema",
          },
          hasRecentFailures: {
            title: "Ha fracasado recientemente",
          },
          hasTimeout: {
            title: "Has Timeout",
          },
          search: {
            title: "Buscar",
          },
        },
        period: {
          hour: "Hora",
          day: "Todos los días",
          week: "Semanal",
          month: "Mensual",
        },
        type: {
          overview: "Sinopsis",
          performance: "Ejecución",
          errors: "Análisis de errores",
          trends: "Análisis de tendencias",
        },
        response: {
          totalTasks: { title: "Total de tareas" },
          executedTasks: { title: "Tareas ejecutadas" },
          successfulTasks: { title: "Tareas exitosas" },
          failedTasks: { title: "Tareas fallidas" },
          averageExecutionTime: { title: "Tiempo de ejecución de Avg (ms)" },
          totalExecutions: { title: "Total Execuciones" },
          executionsLast24h: { title: "Ejecuciones pasadas 24h" },
          successRate: { title: "Tasa de éxito (%)" },
          successfulExecutions: { title: "Ejecuciones exitosas" },
          failedExecutions: { title: "Ejecuciones fallidas" },
          failureRate: { title: "Tasa de fracaso (%)" },
          avgExecutionTime: { title: "Tiempo de ejecución de Avg (ms)" },
          minExecutionTime: { title: "Hora de ejecución (ms)" },
          maxExecutionTime: { title: "Max Execution Time (ms)" },
          medianExecutionTime: { title: "Hora mediana de ejecución (ms)" },
          pendingExecutions: { title: "Ejecuciones pendientes" },
          runningExecutions: { title: "Ejecuciones" },
          activeTasks: { title: "Tareas activas" },
          systemStatus: { title: "Situación del sistema" },
          uptime: { title: "Horas de actualización" },
          healthyTasks: { title: "Tareas saludables" },
          degradedTasks: { title: "Tareas degradadas" },
          systemLoad: { title: "Carga de sistema (%)" },
          queueSize: { title: "Tamaño de la cola" },
        },
        errors: {
          server: {
            title: "Error del servidor",
            description:
              "Se produjo un error de servidor interno al recuperar estadísticas",
          },
          validation: {
            title: "Error de validación",
            description: "Los parámetros proporcionados son inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Autenticación necesaria para acceder a las estadísticas",
          },
          forbidden: {
            title: "Acceso denegado",
            description:
              "Autorizaciones insuficientes para acceder a las estadísticas",
          },
          notFound: {
            title: "No encontrado",
            description: "No se pueden encontrar las estadísticas solicitadas",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto al tramitar la solicitud",
          },
          network: {
            title: "Error de red",
            description:
              "Se produjo un error de red mientras se recuperaban las estadísticas",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Hay cambios insalvables que deben abordarse",
          },
        },
        success: {
          title: "Estadísticas recuperadas",
          description: "Estadísticas de tareas de Cron recuperadas con éxito",
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
        title: "Estadísticas del Cron",
        loading: "Cargando estadísticas...",
        viewTasks: "Tareas",
        viewHistory: "Historia",
        viewPulse: "Pulse",
        refresh: "Actualizar",
        totalTasks: "Total de tareas",
        executedTasks: "Tareas ejecutadas",
        successfulTasks: "Éxito",
        failedTasks: "Failed",
        successRate: "Tasa de éxito",
        avgDuration: "Duración de la Avg",
        overallSuccessRate: "Tasa general de éxito",
        activeTasks: "Tareas activas",
        runningExecutions: "Corriendo",
        pendingExecutions: "Pendiente",
        healthyTasks: "Tareas saludables",
        degradedTasks: "Tareas degradadas",
        systemLoad: "Carga de sistema",
        queueSize: "Tamaño de la cola",
        executionsLast24h: "Últimos 24h",
        tasksByStatus: "Tareas del Estado",
        tasksByPriority: "Tareas de Prioridad",
        topPerforming: "Principales tareas de realización",
        problemTasks: "Tareas de problemas",
        recentActivity: "Actividad reciente",
        dailyStats: "Estadísticas diarias",
        systemStatus: {
          healthy: "Salud",
          warning: "Advertencia",
          critical: "Crítica",
          unknown: "Desconocida",
        },
        uptime: "Horas de actualización",
        col: {
          rank: "#",
          taskName: "Nombre de la tarea",
          executions: "Ejecuciónes",
          avgDuration: "Duración de la Avg",
          failures: "Fallos",
          failureRate: "Tasa de fracaso",
          date: "Fecha",
          successes: "Éxitos",
          uniqueTasks: "Tareas únicas",
        },
      },
    },
    task: {
      category: "Sistema",
      tags: {
        cron: "Cron",
        scheduling: "Programación",
      },
      get: {
        title: "Obtenga la tarea de hierro",
        description: "Recuperar una sola tarea de cron por ID",
        container: {
          title: "Detalles de la tarea de hierro",
          description: "Ver detalles de una tarea específica de cron",
        },
        fields: {
          id: {
            label: "Task ID",
            description: "Unico identificador de la tarea",
          },
        },
        response: {
          task: {
            title: "Tareas",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "La tarea proporcionada ID es nula",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Usted no está autorizado para ver esta tarea",
          },
          notFound: {
            title: "Task Not Found",
            description: "No se pudo encontrar la tarea solicitada",
          },
          internal: {
            title: "Error de servidor interno",
            description: "Se produjo un error al recuperar la tarea",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Usted no tiene permiso para acceder a esta tarea",
          },
          network: {
            title: "Error de red",
            description: "Se produjo un error de red",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
        },
        success: {
          retrieved: {
            title: "Retrieved",
            description: "Tareas recuperadas con éxito",
          },
        },
      },
      put: {
        title: "Actualización de la tarea Cron",
        description: "Actualizar una tarea de cron existente",
        container: {
          title: "Actualización de la tarea Cron",
          description: "Modificar la configuración de tareas",
        },
        fields: {
          id: {
            label: "Task ID",
            description: "Unico identificador de la tarea",
          },
          displayName: {
            label: "Nombre de pantalla",
            description: "Etiquetas legibles para esta tarea",
            placeholder: "Introduzca el nombre de la pantalla",
          },
          outputMode: {
            label: "Modo de salida",
            description: "Cuándo enviar notificaciones después de la ejecución",
            placeholder: "Seleccione el modo de salida",
          },
          description: {
            label: "Descripción",
            description: "Descripción de la tarea",
            placeholder: "Introduzca la descripción de tareas",
          },
          schedule: {
            label: "Horario",
            description: "Expresión del horario de Cron",
            placeholder: "*/5 * * * *",
          },
          enabled: {
            label: "Enabled",
            description: "Si la tarea está habilitada",
          },
          priority: {
            label: "Prioridad",
            description: "Nivel de prioridad de la tarea",
            placeholder: "Seleccionar prioridad",
          },
          category: {
            label: "Categoría",
            description: "Categoría de tareas",
            placeholder: "Seleccionar categoría",
          },
          timeout: {
            label: "Hora de salida (ms)",
            description:
              "Tiempo máximo de ejecución en milisegundos (por ejemplo 300000 = 5 minutos)",
            placeholder: "300000",
          },
          retries: {
            label: "Retries",
            description: "Número de intentos de reingreso al fracaso",
            placeholder: "3",
          },
          retryAttempts: {
            label: "Intentos de reingreso",
            description: "Número de intentos de reingreso al fracaso",
          },
          retryDelay: {
            label: "Retry Delay (ms)",
            description:
              "Dilatación entre las retries en milisegundos (por ejemplo, 5000 = 5 segundos)",
            placeholder: "5000",
          },
          taskInput: {
            label: "Task Input",
            description: "Datos de entrada JSON para la tarea",
          },
          hidden: {
            label: "Oculto",
            description:
              "Ocultar esta tarea desde los avisos del sistema AI y los listados de tareas predeterminados",
          },
          runOnce: {
            label: "Corre una vez.",
            description:
              "Ejecutar esta tarea sólo una vez y luego desactivarla",
          },
          targetInstance: {
            label: "Instance por objetivos",
            description:
              "Instance ID esta tarea debe ejecutarse. Deja vacío para correr sólo en la instancia de acogida.",
            placeholder: "por ejemplo hermes, thea-prod",
          },
          lastExecutionStatus: {
            label: "Estado de ejecución",
            description:
              "Anula el último estado de ejecución. Usar para reajustar una tarea de 'correo' atorada.",
            placeholder: "Seleccione el estado",
          },
        },
        response: {
          task: {
            title: "Tareas actualizadas",
          },
          success: {
            title: "Operación completada",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Los datos proporcionados son inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Usted no está autorizado a actualizar esta tarea",
          },
          notFound: {
            title: "Task Not Found",
            description: "No se pudo encontrar la tarea de actualizar",
          },
          internal: {
            title: "Error de servidor interno",
            description: "Se produjo un error al actualizar la tarea",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Usted no tiene permiso para actualizar esta tarea",
          },
          network: {
            title: "Error de red",
            description: "Se produjo un error de red",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
          conflict: {
            title: "Conflicto",
            description:
              "Se produjo un conflicto al tiempo que se actualizó la tarea",
          },
        },
        submitButton: {
          label: "Guardar la tarea",
          loadingText: "Salvando...",
        },
        success: {
          updated: {
            title: "Actualización de la tarea",
            description: "Tareas actualizadas con éxito",
          },
        },
      },
      delete: {
        title: "Eliminar la tarea del hierro",
        description: "Eliminar una tarea de cron",
        container: {
          title: "Eliminar la tarea del hierro",
          description: "Eliminar una tarea del sistema",
        },
        fields: {
          id: {
            label: "Task ID",
            description: "Unico identificador de la tarea para eliminar",
          },
        },
        response: {
          success: {
            title: "Operación completada",
          },
          message: {
            title: "Mensaje",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "La tarea proporcionada ID es nula",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Usted no está autorizado a eliminar esta tarea",
          },
          notFound: {
            title: "Task Not Found",
            description: "No se pudo encontrar la tarea de eliminar",
          },
          internal: {
            title: "Error de servidor interno",
            description: "Se produjo un error al eliminar la tarea",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Usted no tiene permiso para eliminar esta tarea",
          },
          network: {
            title: "Error de red",
            description: "Se produjo un error de red",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
          conflict: {
            title: "Conflicto",
            description: "No se puede eliminar la tarea debido a un conflicto",
          },
        },
        success: {
          deleted: {
            title: "Tareas suprimidas",
            description: "La tarea se suprimió con éxito",
          },
        },
      },
      priority: {
        critical: "Crítica",
        high: "Alto",
        medium: "Mediana",
        low: "Baja",
        background: "Cron",
      },
      status: {
        pending: "Pendiente",
        running: "Corriendo",
        completed: "Completado",
        failed: "Failed",
        timeout: "Hora de salir",
        cancelled: "Cancelada",
        skipped: "Saltó.",
        blocked: "Bloqueados",
        scheduled: "Programado",
        stopped: "Detenido.",
        error: "Error",
      },
      taskCategory: {
        development: "Desarrollo",
        build: "Compilación",
        watch: "Mira.",
        generator: "Generador",
        test: "Test",
        maintenance: "Mantenimiento",
        database: "Base de datos",
        system: "Sistema",
        monitoring: "Monitoreo",
      },
      outputMode: {
        storeOnly: "Almacén",
        notifyOnFailure: "Notificar sobre el fracaso",
        notifyAlways: "Notificar siempre",
      },
      widget: {
        notFound: "Tarea no encontrada",
        never: "Nunca.",
        history: "Historia",
        edit: "Editar",
        delete: "Eliminar",
        enabled: "Enabled",
        disabled: "Discapacitados",
        identity: "Identidad",
        id: "Task ID",
        routeId: "Ruta ID",
        displayName: "Nombre de pantalla",
        version: "Version",
        category: "Categoría",
        priority: "Prioridad",
        schedule: "Horario",
        timezone: "Zona horaria",
        createdAt: "Creado",
        updatedAt: "Actualizado",
        owner: "Propietario",
        ownerSystem: "Sistema",
        ownerUser: "Usuario",
        outputMode: "Modo de salida",
        outputModes: {
          storeOnly: "Almacén",
          notifyOnFailure: "Notificar sobre el fracaso",
          notifyAlways: "Notificar siempre",
        },
        stats: {
          totalExecutions: "Total Execuciones",
          successful: "Éxito",
          errors: "Errores",
          successRate: "Tasa de éxito",
        },
        timingSection: "Horas",
        timing: {
          avgDuration: "Duración de la Avg",
          lastDuration: "Última duración",
          lastRun: "Última carrera",
          nextRun: "Next Run",
          timeout: "Hora de salir",
          retries: "Retries",
          retryDelay: "Retry Delay",
        },
        lastExecutionError: "Último error",
        run: "Corre ahora.",
        runSuccess: "Tareas ejecutadas con éxito",
        running: "Corriendo...",
        refresh: "Actualizar",
        taskInput: {
          title: "Task Input",
          loading: "Definición de punto final de carga...",
          notFound: "Definición de punto final no encontrada para esta tarea",
          empty: "No hay parámetros de entrada configurados",
          editTitle: "Parámetros de entrada de tareas",
          editDescription:
            "Configurar los parámetros de entrada para este punto final de tarea",
        },
        scheduleAutocomplete: {
          customBadge: "Personalizado",
          noSchedulesFound: "No hay horarios encontrados",
          useCustomSchedule: "Uso de horario personalizado",
          commonSchedules: "Listas comunes",
        },
        schedulePicker: {
          selectPlaceholder: "Seleccionar horario...",
          customOption: "Aduana...",
          presets: {
            title: "Quick Presets",
            everyMinute: "Cada minuto",
            every5m: "Cada 5 minutos",
            every15m: "Cada 15 minutos",
            every30m: "Cada 30 minutos",
            everyHour: "Cada hora",
            every2h: "Cada 2 horas",
            every4h: "Cada 4 horas",
            every6h: "Cada 6 horas",
            every12h: "Cada 12 horas",
            dailyMidnight: "Todos los días a medianoche",
            daily6am: "Diario a 6 AM",
            dailyNoon: "Todos los días al mediodía",
            daily6pm: "Diario a 6 PM",
            weeklyMon: "Semanal el lunes",
            weeklySun: "Semanal el domingo",
            monthlyFirst: "1 de cada mes",
          },
          custom: {
            title: "Cuadro de servicios",
            repeatEvery: "Corre cada uno",
            at: "At",
            onDays: "Activados",
            preview: "→ {{description}}",
            nextRun: "Siguiente: {{time}}",
            nextRunMultiple: "Siguiente: {{first}}, luego {{second}}",
            unit: {
              minutes: "minutos",
              hours: "horas",
              days: "días",
              weeks: "semanas",
              months: "meses",
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
            advanced: "Expresión avanzada",
            advancedPlaceholder: "e.g. 0 9 * * 1-5",
            advancedInvalid: "Expresión de cron inválido",
          },
        },
      },
    },
    tasks: {
      category: "API Endpoint",
      tags: {
        tasks: "Tareas",
        cron: "Cron",
        scheduling: "Programación",
      },
      errors: {
        fetchCronTasks: "Failed para buscar tareas de cron",
        createCronTask: "Failed to create cron task",
        invalidTaskInput:
          "La entrada de la tarea no coincide con el esquema de solicitud del endpoint",
        endpointNotFound: "Punto final no encontrado para la ruta dada ID",
        targetInstanceForbidden:
          "Sólo los administradores pueden establecer la instancia de destino para tareas",
      },
      list: {
        columns: {
          createdAt: "Creado en",
          updatedAt: "Actualizado en",
        },
      },
      get: {
        title: "List Cron Tasks",
        description:
          "Recuperar una lista de tareas de cron con filtro opcional",
        container: {
          title: "Lista de tareas de hierro",
          description: "Funciones de filtro y vista cron",
        },
        fields: {
          status: {
            label: "Situación",
            description: "Filtro por estado de tarea",
            placeholder: "Seleccione el estado...",
          },
          priority: {
            label: "Prioridad",
            description: "Filtro por prioridad de tarea",
            placeholder: "Seleccione prioridad...",
          },
          category: {
            label: "Categoría",
            description: "Filtro por categoría de tarea",
            placeholder: "Seleccione la categoría...",
          },
          enabled: {
            label: "Situación",
            description: "Filtro por estado habilitado",
            placeholder: "Todas las tareas",
          },
          hidden: {
            label: "Visibilidad",
            description: "Filtro por estado oculto (por defecto: sólo visible)",
            placeholder: "Tareas visibles",
          },
          search: {
            label: "Buscar",
            description:
              "Filtrar tareas por nombre, ruta, descripción o categoría",
            placeholder: "Tareas de búsqueda...",
          },
          sort: {
            label: "Más o menos.",
            description: "Ordenar por la lista de tareas",
          },
          limit: {
            label: "Limitación",
            description: "Número máximo de tareas para regresar",
          },
          offset: {
            label: "Offset",
            description: "Número de tareas para saltar",
          },
        },
        response: {
          tasks: {
            title: "Tareas",
          },
          task: {
            title: "Tareas",
            description: "Información individual sobre tareas",
            id: "Task ID",
            name: "Nombre de la tarea",
            taskDescription: "Descripción",
            schedule: "Horario",
            enabled: "Enabled",
            hidden: "Oculto",
            priority: "Prioridad",
            status: "Situación",
            category: "Categoría",
            lastRun: "Última carrera",
            nextRun: "Next Run",
            version: "Version",
            timezone: "Zona horaria",
            timeout: "Hora de salida (ms)",
            retries: "Retries",
            retryDelay: "Retry Delay (ms)",
            lastExecutedAt: "Ultima ejecución en",
            lastExecutionStatus: "Estado de ejecución anterior",
            lastExecutionError: "Último error de ejecución",
            lastExecutionDuration: "Última ejecución Duración (ms)",
            nextExecutionAt: "Siguiente ejecución en",
            executionCount: "Conde de ejecución",
            successCount: "Cuenta de éxito",
            errorCount: "Cuenta de error",
            averageExecutionTime: "Tiempo medio de ejecución (ms)",
            createdAt: "Creado en",
            updatedAt: "Actualizado en",
          },
          totalTasks: "Total de tareas",
        },
        errors: {
          internal: {
            title:
              "Error del servidor interno ocurrió mientras que tareas de recuperación",
            description:
              "Se produjo un error inesperado al buscar la lista de tareas",
          },
          unauthorized: {
            title: "Acceso no autorizado a la lista de tareas",
            description: "Usted no tiene permiso para ver la lista de tareas",
          },
          validation: {
            title: "Parámetros de solicitud no válidos",
            description:
              "Los parámetros de solicitud proporcionados son inválidos",
          },
          forbidden: {
            title: "No tienes acceso",
            description: "Se prohíbe el acceso a este recurso.",
          },
          notFound: {
            title: "Tareas no encontradas",
            description:
              "No se encontraron tareas que coincidan con los criterios",
          },
          network: {
            title: "Error de red",
            description:
              "Se produjo un error de red mientras se retriegan tareas",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Hay cambios insalvables que deben abordarse",
          },
          conflict: {
            title: "Error de conflicto",
            description: "Se produjo un conflicto al tramitar la solicitud",
          },
        },
        success: {
          retrieved: {
            title: "Tareas recuperadas con éxito",
            description: "La lista de tareas se ha recuperado con éxito",
          },
        },
      },
      post: {
        title: "Crear tarea de hierro",
        description: "Crear una nueva tarea de cron",
        container: {
          title: "Crear tarea",
          description: "Configurar una nueva tarea de cron",
        },
        fields: {
          id: {
            label: "Task ID",
            description:
              "Identificador único y estable para esta tarea (por ejemplo, 'db-salud')",
            placeholder: "Ingrese la tarea ID...",
          },
          routeId: {
            label: "Ruta ID",
            description:
              "Identificador de Handler: nombre de tarea, alias de endpoint o 'cron-steps'",
            placeholder: "Ingrese la ruta ID...",
          },
          displayName: {
            label: "Nombre de pantalla",
            description: "Etiquetas legibles para esta tarea",
            placeholder: "Introduzca el nombre de la pantalla...",
          },
          outputMode: {
            label: "Modo de salida",
            description: "Cuándo enviar notificaciones después de la ejecución",
            placeholder: "Seleccione el modo de salida...",
          },
          description: {
            label: "Descripción",
            description: "Descripción de la tarea",
            placeholder: "Introduzca la descripción...",
          },
          schedule: {
            label: "Horario",
            description: "Expresión del horario de Cron",
            placeholder: "*/5 * * * *",
          },
          priority: {
            label: "Prioridad",
            description: "Nivel de prioridad de la tarea",
          },
          category: {
            label: "Categoría",
            description: "Categoría de tareas",
          },
          enabled: {
            label: "Enabled",
            description: "Habilitar o desactivar la tarea",
          },
          hidden: {
            label: "Oculto",
            description:
              "Ocultar esta tarea desde los avisos del sistema AI y los listados de tareas predeterminados",
          },
          timeout: {
            label: "Hora de salida (ms)",
            description: "Tiempo máximo de ejecución en milisegundos",
          },
          retries: {
            label: "Retries",
            description: "Número de intentos de reingreso",
          },
          retryDelay: {
            label: "Retry Delay (ms)",
            description: "Dilatación entre los camiones en milisegundos",
          },
          taskInput: {
            label: "Task Input",
            description: "Datos de entrada JSON para la tarea",
          },
          runOnce: {
            label: "Corre una vez.",
            description:
              "Ejecutar esta tarea sólo una vez y luego desactivarla",
          },
          targetInstance: {
            label: "Instance por objetivos",
            description:
              "Instance ID esta tarea debe ejecutarse (por ejemplo, 'hermes', 'thea-prod'). Deja vacío para correr sólo en la instancia de acogida.",
            placeholder: "Deja vacío para el anfitrión sólo",
          },
        },
        response: {
          task: {
            title: "Tareas creadas",
          },
        },
        errors: {
          validation: {
            title: "Falló la validación",
            description: "Los datos de la tarea proporcionada son inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Usted no tiene permiso para crear tareas",
          },
          internal: {
            title: "Error interno",
            description: "Se produjo un error al crear la tarea",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Se prohíbe el acceso a este recurso.",
          },
          conflict: {
            title: "Conflicto",
            description: "Una tarea con este nombre ya existe",
          },
          network: {
            title: "Error de red",
            description: "Se produjo un error de red",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          notFound: {
            title: "Cuenta o sesión no encontradas",
            description: "No se encontró el recurso solicitado",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
        },
        success: {
          created: {
            title: "Tareas creadas",
            description: "La tarea se ha creado con éxito",
          },
        },
      },
      widget: {
        title: "Tareas cron",
        loading: "Carga de tareas...",
        header: {
          stats: "Stats",
          graphs: "Gráficos",
          history: "Historia",
          queue: "Cola",
          refresh: "Actualizar",
          create: "Nueva tarea",
        },
        filter: {
          all: "Todos",
          running: "Corriendo",
          completed: "Completado",
          failed: "Failed",
          pending: "Pendiente",
          disabled: "Discapacitados",
          allPriorities: "Todas las prioridades",
          allCategories: "Todas las Categorías",
          visible: "Visible",
          hiddenOnly: "Oculto",
          allTasks: "Todas las tareas",
        },
        search: {
          placeholder: "Tareas de búsqueda...",
        },
        sort: {
          nameAsc: "Nombre A-Z",
          nameDesc: "Nombre Z-A",
          schedule: "Horario",
          lastRunNewest: "Última carrera (no oeste)",
          executionsMost: "La mayoría de las ejecuciones",
        },
        task: {
          executions: "Ejecuciónes:",
          lastRun: "Última carrera:",
          never: "Nunca.",
          nextRun: "Siguiente carrera:",
          notScheduled: "No está programado",
          routeId: "Ruta ID",
          hiddenBadge: "Oculto",
          owner: {
            system: "Sistema",
            user: "Usuario",
          },
          outputMode: {
            storeOnly: "Almacén",
            notifyOnFailure: "Notificar sobre el fracaso",
            notifyAlways: "Notificar siempre",
          },
        },
        action: {
          view: "Ver detalles",
          history: "Ver historia",
          edit: "Edición de la tarea",
          delete: "Suprimir la tarea",
          runNow: "Corre ahora.",
        },
        bulk: {
          selected: "{count} seleccionado",
          selectAll: "Seleccione todo",
          clearSelection: "Selección clara",
          enable: "Habilitación",
          disable: "Inhabilitación",
          runNow: "Ejecutar ahora",
          delete: "Eliminar",
          confirmDeleteTitle: "¿Supir tareas?",
          confirmDelete:
            "Eliminar tareas {count}(s)? Esto no puede ser deshecho.",
          cancel: "Cancelar",
          success: "{succeeded} logró, {failed} falló",
        },
        empty: {
          noTasks: "No hay tareas de cron",
          noTasksDesc: "Crea tu primera tarea de cron para empezar",
          noMatches: "No hay tareas que coincidan con sus filtros",
          noMatchesDesc: "Intente ajustar sus criterios de búsqueda o filtro",
          clearFilters: "Filtros claros",
        },
      },
    },
    errors: {
      fetch_all_failed: "Failed para buscar tareas de cron",
      fetch_by_id_failed: "Failed to fetch cron task by ID",
      fetch_by_name_failed: "Failed para buscar la tarea de cron por nombre",
      create_failed: "Failed to create cron task",
      update_failed: "Failed to update cron task",
      delete_failed: "Fallado para eliminar la tarea del cron",
      not_found: "Cron task not found",
      execution_create_failed: "Fallado para crear ejecución de tareas de cron",
      execution_update_failed:
        "No se ha actualizado la ejecución de la tarea cron",
      execution_not_found: "Ejecución de tareas de hierro no encontrada",
      executions_fetch_failed:
        "Fallado para conseguir ejecuciones de tareas de cron",
      recent_executions_fetch_failed:
        "Falló en conseguir ejecuciones recientes de cron",
      schedules_fetch_failed: "Failed to fetch cron task schedules",
      schedule_update_failed:
        "No se ha actualizado el calendario de tareas cron",
      schedule_not_found: "Plan de trabajo de Cron no encontrado",
      statistics_fetch_failed: "Failed to fetch cron task statistics",
    },
  },
  pulseSystem: {
    execute: {
      category: "Ejecución de pulsos",
      tags: {
        execute: "Ejecutar",
      },
      post: {
        title: "Ejecutar el pulso",
        description:
          "Ejecutar el monitoreo de salud del pulso y la ejecución de tareas",
        container: {
          title: "Ejecución de pulsos",
          description:
            "Ejecutar el control del pulso y ejecutar tareas programadas",
        },
        fields: {
          dryRun: {
            label: "Dry Run",
            description: "Realizar una carrera seca sin hacer cambios reales",
          },
          taskNames: {
            label: "Nombres de la tarea",
            description:
              "Nombres de tareas específicos para ejecutar (opcional)",
          },
          force: {
            label: "Ejecución de la fuerza",
            description:
              "Ejecución de la fuerza incluso si las tareas no son debidas",
          },
          success: {
            title: "Operación completada",
          },
          message: {
            title: "Mensaje",
          },
        },
        response: {
          pulseId: "Pulso ID",
          executedAt: "Ejecutado en",
          totalTasksDiscovered: "Total Tasks Discovered",
          tasksDue: "Tareas pendientes",
          tasksExecuted: "Tareas ejecutadas",
          tasksSucceeded: "Sucesos de tareas",
          tasksFailed: "Tareas fallidas",
          tasksSkipped: "Tareas eliminadas",
          totalExecutionTimeMs: "Tiempo de ejecución total (ms)",
          errors: "Errores",
          summary: "Resumen de ejecución",
          results: "Resultados",
          resultsDescription: "Resultados de la ejecución de tareas",
          taskName: "Nombre de la tarea",
          success: "Operación completada",
          duration: "Duración",
          message: "Mensaje",
          executionFailed: "La ejecución falló",
          dryRunSuccess: "Corrección seca completada con éxito",
          executionSuccess: "Ejecución finalizada con éxito",
        },
        examples: {
          basic: {
            title: "Ejecución básica del pulso",
          },
          dryRun: {
            title: "Ejecución de fuga de secados",
          },
          success: {
            title: "Ejecución exitosa",
          },
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          internal: {
            title: "Error interno",
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
          unsaved: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
    },
    status: {
      category: "Estado del pulso",
      tags: {
        status: "Situación",
      },
      get: {
        title: "Estado del pulso",
        description: "Obtener estado de monitoreo de salud del pulso",
        container: {
          title: "Estado de salud del pulso",
          description:
            "Control de la salud y las estadísticas de ejecución del pulso",
        },
        fields: {
          status: {
            title: "Situación",
            label: "Estado del pulso",
            description: "Estado de salud del pulso actual",
          },
          lastPulseAt: {
            title: "Último pulso",
            label: "Último pulso",
            description: "Timetamp of last pulso execution",
          },
          successRate: {
            title: "Tasa de éxito",
            label: "Tasa de éxito",
            description: "Porcentaje de ejecuciones de pulsos exitosas",
          },
          totalExecutions: {
            title: "Total Execuciones",
            label: "Total Execuciones",
            description: "Número total de ejecuciones de pulsos",
          },
        },
        examples: {
          basic: {
            title: "Solicitud de Estado básico",
          },
          success: {
            title: "Respuesta del Estado con éxito",
          },
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          internal: {
            title: "Error interno",
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
          unsaved: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
    },
    history: {
      category: "Gestión de tareas",

      tags: {
        pulse: "Pulse",
        monitoring: "Monitoreo",
      },

      errors: {
        fetchCronTaskHistory:
          "Fallado para conseguir historia de la ejecución del pulso",
      },

      get: {
        title: "Historia de ejecución de pulsos",
        description: "Ver ciclos históricos de ejecución del pulso",
        fields: {
          startDate: {
            label: "Fecha de inicio",
            description: "Ciclos de pulso de filtro después de esta fecha",
          },
          endDate: {
            label: "Fecha final",
            description: "Ciclos de pulso de filtro antes de esta fecha",
          },
          status: {
            label: "Situación",
            description: "Filtro por estado de ejecución",
            placeholder: "Todos los estados",
          },
          limit: {
            label: "Límite de resultados",
            description: "Número máximo de resultados a la vuelta",
            placeholder: "50",
          },
          offset: {
            label: "Resultados Offset",
            description: "Número de resultados para saltar para paginación",
            placeholder: "0",
          },
        },
        response: {
          executions: { title: "Ejecuciones de pulso" },
          totalCount: { title: "Total Conde" },
          hasMore: { title: "Tiene más resultados" },
          summary: { title: "Resumen de ejecución" },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud inválidos proporcionados",
          },
          network: {
            title: "Error de red",
            description:
              "Se produjo error de red mientras que la historia del pulso",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Usted no tiene permiso para ver la historia del pulso",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "El acceso a la historia del pulso está prohibido",
          },
          notFound: {
            title: "No encontrado",
            description: "Registro de ejecución de pulsos no encontrado",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Historia Conseguida",
          description: "Historial de ejecución del pulso recuperado con éxito",
        },
      },
      pulse: {
        execution: {
          success: "Operación completada",
          failure: "Fallo",
          timeout: "Hora de salir",
          cancelled: "Cancelada",
          pending: "Pendiente",
        },
      },
      widget: {
        title: "Historia del pulso",
        empty: "No se encontraron ejecuciones de pulso",
        details: "Detalles",
        discovered: "{{count}} descubrió",
        due: "{{count}}",
        succeeded: "{{count}} ok",
        failed: "{{count}} falló",
        tasksExecuted: "Ejecutado",
        tasksSucceeded: "Succedido",
        tasksFailed: "Failed",
        tasksSkipped: "Saltó.",
        header: {
          cronHistory: "Historia del Cron",
          stats: "Stats",
          refresh: "Actualizar",
        },
        summary: {
          total: "Total",
          successful: "Éxito",
          failed: "Failed",
          successRate: "Tasa de éxito",
          avgDuration: "Duración de la Avg",
        },
        filter: {
          all: "Todos",
          success: "Operación completada",
          failure: "Failed",
          timeout: "Hora de salir",
        },
        pagination: {
          info: "Página {{page}} de {{totalPages}} (Total {{total}})",
          prev: "Anterior",
          next: "Siguiente",
        },
      },
    },
    success: {
      title: "Operación completada",
      description: "Pulse ejecutado con éxito",
      content: "Operación completada",
    },
    container: {
      title: "Container de pulso",
      description: "Descripción del contenedor de Pulse",
    },
  },
  unifiedRunner: {
    category: "Gestión de tareas",

    description: "Ejecuta tareas de fondo y gestiona tareas paralelas",
    common: {
      taskName: "Nombre de la tarea",
      taskNamesDescription: "Nombres de tareas para filtrar",
      detailed: "Detalle",
      detailedDescription: "Incluir información detallada",
      active: "Activa",
      total: "Total",
      uptime: "Horas de actualización",
      id: "ID",
      status: "Situación",
      lastRun: "Última carrera",
      nextRun: "Next Run",
      schedule: "Horario",
    },
    post: {
      title: "Unified Task Runner",
      description:
        "Gestionar unificador de tareas para tareas de fondo y tareas paralelas",
      container: {
        title: "Unified Task Runner Management",
        description:
          "Controla el corredor de tareas unificado que gestiona tanto las tareas de fondo como las tareas laterales",
      },
      fields: {
        action: {
          label: "Medida",
          description: "Acción para realizar en el corredor de tareas",
          options: {
            start: "Start Runner",
            stop: "Stop Runner",
            status: "Estado civil",
            restart: "Restart Runner",
          },
        },
        taskFilter: {
          label: "Filtro de tareas",
          description: "Funciones de filtro por tipo",
          options: {
            all: "Todas las tareas",
            cron: "Cron Tasks Only",
            side: "Tareas secundarias solamente",
          },
        },
        dryRun: {
          label: "Dry Run",
          description: "Realizar una carrera seca sin hacer cambios reales",
        },
      },
      response: {
        success: "Operación Éxito",
        actionResult: "Resultado de la acción",
        message: "Mensaje de respuesta",
        timestamp: "Timestamp",
      },
      reasons: {
        previousInstanceRunning: "La instancia anterior sigue funcionando",
      },
      messages: {
        taskSkipped: "La tarea se saltó",
        taskCompleted: "Tareas terminadas con éxito",
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
        internal: {
          title: "Error interno",
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
        unsaved: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        execution: {
          title: "Error de ejecución de tareas",
          description: "Fallado para ejecutar la tarea",
        },
        taskAlreadyRunning: {
          title: "La tarea ya está funcionando",
          description: "La tarea especificada ya está funcionando",
        },
        sideTaskExecution: {
          title: "Error de ejecución lateral",
          description: "Fallado para ejecutar tareas paralelas",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
  },
};
