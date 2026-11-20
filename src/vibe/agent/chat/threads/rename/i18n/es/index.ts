import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Conversaciones",
  },
  patch: {
    title: "Rename Thread",
    titleShort: "Rename Thread",
    description: "Actualizar el título y la vista previa de un hilo de chat",
    container: {
      title: "Rename Thread",
      description: "Establecer un nuevo título o vista previa para el hilo",
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo para renombrar",
    },
    threadTitle: {
      label: "Título",
      description: "Nuevo título para el hilo",
      placeholder: "Ingrese el título del hilo...",
    },
    preview: {
      label: "Vista previa",
      description: "Descripción corta o texto de vista previa para el hilo",
      placeholder: "Introduzca el texto de vista previa...",
    },
    response: {
      threadId: {
        content: "Thread ID",
      },
      title: {
        content: "Título",
      },
      preview: {
        content: "Vista previa",
      },
      updatedAt: {
        content: "Actualizado en",
      },
    },
    errors: {
      validation: {
        title: "Entrada inválida",
        description:
          "Compruebe que threadId es un UUID válido y al menos un campo se proporciona",
        noActiveThread: "No hay hilo activo en el contexto de flujo",
        folderUnresolved: "No podría resolver la carpeta del hilo",
      },
      unauthorized: {
        title: "No está firmado",
        description: "Inicie sesión para renombrar hilos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para renombrar este hilo.",
      },
      notFound: {
        title: "No se encontró la conversación",
        description: "No existe ningún hilo con este ID",
        detail: "Pan no encontrado: {{threadId}}",
      },
      server: {
        title: "Error del servidor",
        description: "Failed para renombrar el hilo",
        detail: "Error del servidor: {{error}}",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Algo salió mal",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "El hilo fue modificado por otra persona",
      },
    },
    success: {
      title: "Thread renombrado",
      description: "El título de hilo y la vista previa han sido actualizados",
    },
    backButton: {
      label: "Cancelar",
    },
    submitButton: {
      label: "Guardar",
      loadingText: "Salvando...",
    },
    dynamicTitle: "Rename Thread: {{title}}",
  },
};
