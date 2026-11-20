import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones" },
  post: {
    title: "Estimación duplicada",
    titleShort: "Estimación duplicada",
    description: "Cierre esta estimación a un nuevo proyecto",
    form: {
      title: "Estimación duplicada",
      description: "Cierre esta estimación a un nuevo proyecto",
    },
    response: {
      success: "Operación completada",
      message: "Mensaje de Estado",
      newEstimateId: "Nueva estimación ID",
      estimateNumber: "Nuevo número de estimaciones",
    },
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
      title: "Estimación duplicada",
      description: "Se ha creado un nuevo proyecto de estimación",
    },
  },
  estimateId: {
    label: "Estimación ID",
    description: "La estimación se duplicará",
  },
  widget: {
    back: "Atrás",
    submit: "Estimación duplicada",
    viewDuplicate: "Ver Duplicar",
    duplicateNote:
      "Se creará un nuevo proyecto de estimación con las mismas líneas y detalles.",
  },
};
