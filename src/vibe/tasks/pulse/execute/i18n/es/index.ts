import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Ejecución de pulsos",
  tags: {
    execute: "Ejecutar",
  },
  errors: {
    executePulse: "Fallado para ejecutar el pulso",
  },
  post: {
    title: "Ejecutar el pulso",
    titleShort: "Ejecutar el pulso",
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
        label: "Alias de tareas",
        description:
          "Escribe un alias de endpoint y pulsa Intro. Deja el campo vacío para incluir todas las tareas aplicables.",
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
};
