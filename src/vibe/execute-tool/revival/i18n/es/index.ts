import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError:
      "Se produjo un error inesperado: {{error}}. Por favor, inténtalo de nuevo.",
    modelNotResolved:
      "No podía resolver un modelo para este hilo - el flujo no puede ser revivido.",
  },
  post: {
    title: "Revival",
    titleShort: "Revival",
    description:
      "Continúa un hilo existente después de que una tarea asinc complete (callbackMode =wait o wakeUp). Programado como una tarea de cron de un solo disparo por TaskCompletion.handle; el pulso del cron lo ejecuta en la instancia correcta.",
    fields: {
      threadId: {
        title: "Thread ID",
        description: "UUID del hilo para continuar.",
      },
      favoriteId: {
        title: "ID favorito",
        description: "Guardado favorito para cargar modelo y habilidad de.",
      },
      modelId: {
        title: "Modelo ID",
        description: "Modelo AI para la vuelta reanudada.",
      },
      skillId: {
        title: "ID de la habilidad",
        description: "Habilidad/persona para la continuación del turno.",
      },
      callbackMode: {
        title: "Modo de llamada",
        description:
          "esperar o wakeUp - determina el comportamiento de reactivación.",
      },
      wakeUpToolMessageId: {
        title: "Mensaje de la herramienta ID",
        description:
          "Original mensaje de llamada de herramienta ID con el resultado de relleno.",
      },
      wakeUpTaskId: {
        title: "WakeUp Task ID",
        description:
          "Originaria tarea de cron wakeUp, eliminada después del reavivamiento.",
      },
      resumeTaskId: {
        title: "Revival Task ID",
        description:
          "Esta tarea de cron reavivamiento en sí, eliminada después del avivamiento.",
      },
      resumed: {
        title: "Continuación",
        description: "Si el hilo se continuó con éxito.",
      },
      lastAiMessageId: {
        title: "Último mensaje AI ID",
        description: "UUID del mensaje final de asistente generado.",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos. threadId debe ser un UUID válido.",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso negado.",
      },
      notFound: {
        title: "No encontrado",
        description: "Pan o modelo no encontrado.",
      },
      internal: {
        title: "Error del servidor",
        description: "Error interno durante el reavivamiento de flujo.",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado.",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Conflicto con cambios sin salvar.",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto.",
      },
    },
    success: {
      title: "Thread Revived",
      description: "El hilo AI se continuó con éxito.",
    },
  },
};
