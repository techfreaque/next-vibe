import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones" },
  post: {
    title: "Estimación",
    titleShort: "Estimación",
    description: "Estimación de la marca según declinó el cliente",
    form: {
      title: "Estimación",
      description: "Estimación de la marca según declinó el cliente",
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
      description: "Estimación de la marca según declinó el cliente",
    },
  },
  estimateId: {
    label: "Estimación ID",
    description: "La estimación para actuar en",
  },
  widget: {
    back: "Atrás",
    submit: "Estimación",
    declined: "Estimación marcada como la disminución.",
    confirmTitle: "¿Descifrar esta estimación?",
    confirmDescription:
      "Esto marcará la estimación como declinado. Esta acción no se puede deshacer.",
    confirmButton: "Declin",
    cancelButton: "Cancelar",
  },
};
