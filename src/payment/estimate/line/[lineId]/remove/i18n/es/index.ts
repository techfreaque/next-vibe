import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones", lines: "líneas" },
  post: {
    title: "Quitar la línea de cálculo",
    titleShort: "Quitar la línea",
    description: "Eliminar un tema de línea de un proyecto de estimación",
    form: {
      title: "Quitar la línea de cálculo",
      description: "Retire este artículo de línea de la estimación",
    },
    response: {
      estimateId: "Presupuesto",
      success: "Operación completada",
      message: "Mensaje de Estado",
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
        description: "Artículo de línea no encontrado",
      },
      conflict: {
        title: "Conflicto",
        description:
          "La estimación debe estar en estado DRAFT para eliminar líneas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Línea eliminada",
      description: "Apartado de la estimación",
    },
  },
  lineId: {
    label: "Línea ID",
    description: "El artículo de la línea para eliminar",
  },
  widget: {
    lineTotal: "Total de la línea",
    back: "Atrás",
    submit: "Quitar la línea",
    removed: "Tema de línea eliminado de la estimación.",
    confirmTitle: "¿Retirar este artículo de línea?",
    confirmDescription:
      "Esto eliminará permanentemente el elemento de línea de la estimación. Los totales serán recalculados.",
    confirmButton: "Retirar",
    cancelButton: "Cancelar",
  },
};
