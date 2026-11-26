import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    lines: "líneas",
  },
  post: {
    title: "Quitar la línea de facturación",
    titleShort: "Quitar la línea",
    description: "Eliminar un artículo de línea de un proyecto de factura",
    form: {
      title: "Quitar la línea",
      description: "Elimina permanentemente esta línea de la factura",
    },
    response: {
      invoiceId: "Factura",
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
        description: "La facturación no figura en el proyecto de estatuto",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Tema de la línea retirado de la factura",
    },
  },
  lineId: {
    label: "Línea ID",
    description: "ID del artículo de la línea para eliminar",
    placeholder: "Ingrese la línea ID",
  },
  widget: {
    lineActions: "Acciones",
    remove: "Quitar",
    removeNamed: "Quitar la línea {{description}}",
    cancel: "Cancelar",
    lineTotal: "Total de la línea",
    back: "Atrás",
    submit: "Quitar la línea",
    warning:
      "Esto eliminará permanentemente el artículo de la línea de la factura.",
    confirm: "Quitar la línea",
    removed: "Tema de la línea eliminado",
  },
};
