import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
  },
  post: {
    title: "Enviar factura",
    titleShort: "Enviar factura",
    description:
      "Marcar un proyecto de factura como enviado - estado de transición a Open",
    form: {
      title: "Enviar factura",
      description: "Envía la factura al cliente",
    },
    response: {
      success: "Factura enviada",
      message: "Mensaje de Estado",
      viewUrl: "Vista al cliente URL",
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
      description: "Factura marcada como enviada",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "ID de la factura para enviar",
    placeholder: "Introduzca la factura ID",
  },
  widget: {
    back: "Atrás",
    submit: "Enviar factura",
    sent: "Factura enviada",
    viewUrl: "Enlace de vista al cliente",
  },
};
