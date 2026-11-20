import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones", invoice: "factura" },
  post: {
    title: "Convertir Estimación en Factura",
    titleShort: "Convertir en Invoice",
    description: "Convertir una estimación aceptada en un proyecto de factura",
    form: {
      title: "Convertir en Invoice",
      description: "Convertir esta estimación en una factura",
    },
    response: {
      success: "Convertirse en factura",
      message: "Mensaje de Estado",
      invoiceId: "Invocación creada ID",
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
        description:
          "La estimación debe estar en el estado SENT o ACCEPTED para convertir",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Estimación convertida a factura",
    },
  },
  estimateId: {
    label: "Estimación ID",
    description: "La estimación para convertir",
  },
  widget: {
    back: "Atrás",
    submit: "Convertir en Invoice",
    converted: "Factura creada a partir de esta estimación.",
    viewInvoice: "Ver factura",
    convertNote:
      "Se creará un proyecto de factura con los mismos artículos. La estimación se marcará como convertido.",
  },
};
