import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de tareas",

  errors: {
    fetchCronTaskStats:
      "Failed to fetch cron task statistics ({{type}}, {{period}}, task {{taskId}}): {{error}}",
  },

  get: {
    title: "Obtener estadísticas de la tarea de hierro",
    titleShort: "Cron Stats",
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
        description: "Período de tiempo para la agregación de las estadísticas",
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
        description: "Autenticación necesaria para acceder a las estadísticas",
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
};
