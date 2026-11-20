import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    remoteSync: "Remote Sync",
  },
  taskReport: {
    post: {
      title: "Informe de tareas",
      titleShort: "Informe",
      description:
        "Aceptar resultados de ejecución de tareas desde casos remotos.",
      taskId: {
        label: "Task ID",
        description: "ID of the task being reported",
      },
      executionId: {
        label: "Ejecución ID",
        description: "ID de la ejecución específica",
      },
      status: {
        label: "Situación",
        description: "Estado final de la ejecución de tareas",
      },
      durationMs: {
        label: "Duración ms)",
        description: "Duración de ejecución en milisegundos",
      },
      summary: {
        label: "Resumen",
        description:
          "Resumen legible por el hombre del resultado de la ejecución",
      },
      error: {
        label: "Error",
        description: "Mensaje de error si la ejecución falló",
      },
      serverTimezone: {
        label: "Server Timezone",
        description: "Timezone del servidor de ejecución",
      },
      executedByInstance: {
        label: "Ejecutado por",
        description: "Instance ID que ejecutó la tarea",
      },
      output: {
        label: "Producto",
        description: "Datos de salida estructurados de la tarea",
      },
      startedAt: {
        label: "Comenzó en",
        description: "ISO timetamp cuando la ejecución comenzó",
      },
      wakeUpContext: {
        label: "Revival Context",
        description:
          "El contexto de reavivamiento de los hilos se hizo eco de la solicitud de envío. permite que el callador revive sin un registro de tareas local",
      },
      processed: {
        label: "Procesado",
        description: "Si se acepta el informe",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Carga de pago del informe inválido",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        internal: {
          title: "Error de procesamiento",
          description: "Se produjo un error al procesar el informe",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para presentar informes",
        },
        notFound: {
          title: "No encontrado",
          description: "Tarea no encontrada",
        },
        network: {
          title: "Error de red",
          description: "No podía llegar al punto final del informe",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        conflict: {
          title: "Conflicto",
          description: "Caso detectado",
        },
      },
      success: {
        title: "Informe aceptado",
        description: "Informe de tareas elaborado con éxito",
      },
    },
  },
};
