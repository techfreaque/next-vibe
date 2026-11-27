import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Ejecución de tareas",
  tags: {
    execute: "Ejecutar",
  },
  errors: {
    executeTask: "Fallado para ejecutar la tarea",
    forbidden: "Usted no tiene permiso para ejecutar esta tarea",
    alreadyRunning: "La tarea ya está en marcha",
    notFound: "Tarea {{taskId}} no encontrado",
  },
  post: {
    title: "Ejecución de la tarea",
    titleShort: "Ejecución de la tarea",
    description:
      "Trigger una sola tarea de ID y recibir el resultado sincronizadamente",
    container: {
      title: "Ejecución de tareas",
      description: "Ejecutar una tarea específica y esperar a su resultado",
    },
    fields: {
      taskId: {
        label: "Clave de la tarea",
        description: "El ID de la tarea de ejecutar",
      },
      success: {
        title: "Operación completada",
      },
      message: {
        title: "Mensaje",
      },
    },
    response: {
      taskId: "Task ID",
      taskName: "Nombre de la tarea",
      executedAt: "Ejecutado en",
      duration: "Duración ms)",
      status: "Situación",
      output: "Producto",
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
        description: "Usted no tiene permiso para ejecutar esta tarea",
      },
      notFound: {
        title: "No encontrado",
        description: "Tarea no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "La tarea ya está en marcha",
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
    submitButton: {
      label: "Run Task",
      loadingText: "Corriendo...",
    },
    success: {
      title: "Operación completada",
      description: "Tareas ejecutadas con éxito",
    },
  },
};
