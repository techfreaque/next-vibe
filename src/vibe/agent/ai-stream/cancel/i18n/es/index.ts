import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",
  tags: {
    streaming: "Streaming",
  },
  post: {
    title: "Cancelar AI Stream",
    titleShort: "Cancel Stream",
    description: "Cancelar una respuesta de streaming AI activa",
    container: {
      title: "Cancel Stream",
      description: "Detenga un flujo AI activo para un hilo",
    },
    form: {
      title: "Cancel Stream",
      description: "Proporcione el hilo ID para cancelar su flujo activo",
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo cuyo flujo para cancelar",
    },
    response: {
      title: "Cancelar Resultado",
      description: "Resultado de la operación de cancelación",
      cancelled: "Si se encontró un flujo activo y se canceló",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Datos de solicitud de cancelación inválidos",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para cancelar los flujos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Sólo puedes cancelar tus propios flujos",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para cancelar el flujo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Cancel conflict occurred",
      },
    },
    success: {
      title: "Corriente cancelada",
      description: "El flujo AI ha sido cancelado con éxito",
    },
    streamInterrupted:
      "Se detuvo la generación. Se ha salvado la respuesta parcial.",
  },
};
