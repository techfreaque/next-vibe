import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "ar",
  },
  post: {
    title: "Enviar recordatorio de pago",
    titleShort: "Enviar recordatorio",
    description:
      "Enviar un recordatorio de pago para una factura atrasada. La facturación debe ser el estado OPEN y pasado su fecha prevista. Registra el recordatorio como nota de cliente.",
    form: {
      title: "Enviar recordatorio",
      description: "Notificar al cliente sobre su pago atrasado",
    },
    response: {
      success: "Reminder sent",
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
        title: "No está retrasado",
        description:
          "Los recordatorios sólo pueden ser enviados para facturas abiertas después de su fecha prevista",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Recordatorio de pago enviado y registrado",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "ID de la factura atrasada",
    placeholder: "Introduzca la factura ID",
  },
  message: {
    label: "Mensaje personalizado",
    description:
      "Mensaje personalizado opcional para incluir en el recordatorio",
    placeholder: "Añada una nota personal al recordatorio...",
  },
  widget: {
    back: "Atrás",
    submit: "Enviar recordatorio",
    reminderSent: "Reminder envió. El cliente ha sido notificado.",
    viewInvoice: "Ver factura",
  },
};
