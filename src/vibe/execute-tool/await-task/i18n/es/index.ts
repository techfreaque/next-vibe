import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "Await Task",
  },
  post: {
    title: "Await Task",
    titleShort: "Await Task",
    description:
      "Espera en una tarea de fondo enviada. Devuelve inmediatamente si ya está hecho, o detiene el flujo AI hasta que la tarea termine.",
    fields: {
      taskId: {
        label: "Task ID",
        description:
          "La tarea ID devolvió por eje ejecuta-herramienta (modo desprendimiento o wakeUp).",
      },
      status: {
        title: "Situación",
        description: "Situación actual de la tarea.",
      },
      result: {
        title: "Resultado",
        description:
          "Producción de herramientas (presente cuando esté terminada).",
      },
      waiting: {
        title: "Esperando",
        description: "Es cierto cuando el flujo se detiene esperando la tarea.",
      },
      originalToolName: {
        title: "Herencia",
        description: "La herramienta que fue enviada.",
      },
      originalArgs: {
        title: "Argumentos",
        description: "Los argumentos de entrada de la herramienta despachada.",
      },
    },
    dynamicTitle: "Await: {{toolName}}",
    widget: {
      noToolName: "No hay nombre de herramienta disponible.",
      resolving: "Herramienta de solución...",
      unknownTool: "Herramienta desconocida: {{toolName}}",
    },
    status: {
      waiting: "Esperando",
      complete: "Completado",
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
        description: "Usted no tiene permiso para esperar esta tarea",
      },
      notFound: {
        title: "No encontrado",
        description: "Tarea no encontrada",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto entre el Estado de tareas",
      },
    },
    success: {
      title: "Listo",
      description: "Tareas terminadas",
    },
  },
};
