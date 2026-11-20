import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones" },
  post: {
    title: "Enviar estimación",
    titleShort: "Enviar estimación",
    description: "Estimación de la marca como se envía al cliente",
    form: {
      title: "Enviar estimación",
      description: "Estimación de la marca como se envía al cliente",
    },
    response: { success: "Operación completada", message: "Mensaje de Estado" },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      notFound: {
        title: "No encontrado",
        description: "Estimación no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "No puede actuar en el estado actual",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Estimación de la marca como se envía al cliente",
    },
  },
  estimateId: {
    label: "Estimación ID",
    description: "La estimación para actuar en",
  },
  widget: {
    back: "Atrás",
    submit: "Enviar estimación",
    sent: "Estimación marcada como enviada al cliente.",
    sendNote:
      "El estado estimado se actualizará a Sent. El cliente puede entonces aceptar o rechazarlo.",
  },
};
