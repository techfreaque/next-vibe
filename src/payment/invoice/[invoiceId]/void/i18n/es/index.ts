import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "ar",
  },
  post: {
    title: "Void Invoice",
    titleShort: "Void Invoice",
    description:
      "Cancele un borrador o una factura abierta. Las facturas pagadas no pueden ser anuladas. Si existe una entrada de diario, se revierte.",
    form: {
      title: "Void Invoice",
      description: "Esta acción no se puede deshacer.",
    },
    response: {
      success: "Factura anulada",
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
        description: "Factura no encontrada",
      },
      conflict: {
        title: "No puedo votar.",
        description: "Las facturas pagadas no pueden ser anuladas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Factura anulada con éxito",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "ID de la factura para anular",
    placeholder: "Introduzca la factura ID",
  },
  widget: {
    back: "Atrás",
    submit: "Void Invoice",
    warning:
      "Esta acción no se puede deshacer. La factura será cancelada permanentemente.",
    confirm: "Void Invoice",
    voided: "Factura anulada",
    backToList: "Volver a facturas",
  },
};
