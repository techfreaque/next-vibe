import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de tareas",
  errors: {
    cronTaskNotFound: "Cron task not found",
    repositoryInternalError: "Se produjo un error interno",
    fetchCronTaskHistoryDetail: "No podía cargar historia para la tarea {{taskId}} (limit {{limit}}): {{error}}",
    fetchCronTaskHistoryAllDetail: "No podía cargar el historial de tareas (limit {{limit}}): {{error}}"
  },
  get: {
    tags: {
      tasks: "Tareas",
      monitoring: "Monitoreo"
    },
    title: "Historia de la ejecución de tareas",
    titleShort: "Historia de la tarea",
    description: "Ver registros de ejecución históricos para tareas de cron",
    fields: {
      taskId: {
        label: "Task ID",
        description: "Filtro por tarea específica ID",
        placeholder: "Ingrese la tarea ID"
      },
      taskName: {
        label: "Nombre de la tarea",
        description: "Filtro por nombre de tarea (concordancia parcial)",
        placeholder: "Ingrese el nombre de tarea"
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
          BLOCKED: "Bloqueados"
        }
      },
      priority: {
        label: "Prioridad de la tarea",
        description: "Filtro por nivel de prioridad de tarea",
        placeholder: "Seleccionar prioridades",
        options: {
          LOW: "Baja",
          MEDIUM: "Mediana",
          HIGH: "Alto",
          CRITICAL: "Crítica"
        }
      },
      startDate: {
        label: "Fecha de inicio",
        description: "Ejecuciones de filtro después de esta fecha"
      },
      endDate: {
        label: "Fecha final",
        description: "Ejecuciones de filtro antes de esta fecha"
      },
      limit: {
        label: "Límite de resultados",
        description: "Número máximo de resultados a la vuelta",
        placeholder: "50"
      },
      offset: {
        label: "Resultados Offset",
        description: "Número de resultados para saltar para paginación",
        placeholder: "0"
      }
    },
    response: {
      title: "Respuesta a la historia de la tarea",
      description: "Datos históricos de ejecución para tareas de cron",
      executions: {
        title: "Documentos de ejecución"
      },
      totalCount: {
        title: "Total Conde"
      },
      hasMore: {
        title: "Tiene más resultados"
      },
      statusCounts: {
        title: "Cuentas de Estado"
      },
      summary: {
        title: "Resumen de ejecución"
      }
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud inválidos proporcionados"
      },
      internal: {
        title: "Error de servidor interno",
        description: "Fallado para recuperar la historia de la tarea"
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no tiene permiso para ver el historial de tareas"
      },
      notFound: {
        title: "No encontrado",
        description: "Registro de tareas o ejecución no encontrado"
      },
      network: {
        title: "Error de red",
        description: "Se produjo error de red mientras que el historial de tareas de búsqueda"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "El acceso a la historia de la tarea está prohibido"
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido"
      },
      unsavedChanges: {
        titleChanges: "Cambios sin guardar",
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar"
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos"
      }
    },
    success: {
      title: "Historia Conseguida",
      description: "Historia de ejecución de tareas recuperada con éxito"
    },
    log: {
      fetchSuccess: "Registros de ejecución de {{count}} con éxito",
      fetchError: "Fallado en la historia de ejecución de tareas"
    },
    request: {
      title: "Solicitar parámetros",
      description: "Historial de ejecución de tareas filtrantes"
    },
    unknownTask: "Tareas desconocidas"
  },
  widget: {
    title: "Historia de la ejecución de tareas",
    loading: "Cargando historia...",
    header: {
      tasks: "Tareas",
      stats: "Stats",
      pulse: "Pulse",
      refresh: "Actualizar"
    },
    summary: {
      total: "Ejecuciones coincidentes",
      successful: "Éxito",
      failed: "Failed",
      successRate: "Tasa de éxito",
      avgDuration: "Duración de la Avg"
    },
    search: {
      placeholder: "Tareas de búsqueda..."
    },
    filter: {
      all: "Todos",
      running: "Corriendo",
      completed: "Completado",
      failed: "Failed",
      timeout: "Hora de salir",
      cancelled: "Cancelada"
    },
    col: {
      taskName: "Nombre de la tarea",
      status: "Situación",
      duration: "Duración",
      started: "Comienzo",
      completed: "Completado",
      environment: "para el Medio Ambiente",
      error: "Error"
    },
    empty: "No hay historial de ejecución encontrado",
    result: "Resultado",
    error: {
      collapse: "Error de colapso",
      label: "Error"
    },
    pagination: {
      info: "Página {{page}} de {{totalPages}} (Total {{total}})",
      prev: "Anterior",
      next: "Siguiente"
    }
  }
};
