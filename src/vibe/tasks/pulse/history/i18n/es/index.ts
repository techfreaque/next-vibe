import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "Historia del pulso",
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
        description: "Usted no tiene permiso para ver la historia del pulso",
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
    taskNameUnavailable: "Nombre de tarea no disponible",
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
};
