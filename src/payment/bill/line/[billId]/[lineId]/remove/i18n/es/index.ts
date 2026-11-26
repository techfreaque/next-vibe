import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    bill: "factura de proveedor",
    lines: "líneas",
  },
  post: {
    title: "Eliminar línea de factura",
    titleShort: "Quitar la línea",
    description: "Elimina una línea del borrador de una factura de proveedor",
    form: {
      title: "Quitar la línea",
      description: "Elimina esta línea del borrador.",
    },
    response: {
      success: "Línea removida",
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
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "Artículo de línea no encontrado",
      },
      conflict: {
        title: "Conflicto",
        description: "Solo se pueden eliminar líneas de un borrador editable.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Se ha eliminado la línea.",
    },
  },
  billId: {
    label: "Factura de proveedor",
    description: "Factura de proveedor que contiene la línea",
  },
  lineId: {
    label: "Línea ID",
    description: "ID del artículo de la línea para eliminar",
    placeholder: "Ingrese la línea ID",
  },
  widget: {
    verifying: "Comprobando la línea seleccionada…",
    unavailable:
      "Ya no se puede eliminar esta línea. Vuelva a abrir el borrador y revise las líneas actuales.",
    lineGross: "Importe bruto de la línea: {{amount}}",

    back: "Atrás",
    submit: "Quitar la línea",
    warning:
      "La línea se eliminará de forma permanente y se recalculará el total del borrador.",
    confirm: "Quitar la línea",
    removed: "Tema de la línea eliminado",
  },
};
