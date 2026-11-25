import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "ar",
  },
  post: {
    title: "Preparar recordatorio de pago",
    titleShort: "Preparar recordatorio",
    description:
      "Prepara un borrador con el saldo vencido y un mensaje opcional.",
    form: {
      title: "Preparar recordatorio",
      description: "Revisa el saldo antes de compartir el borrador.",
    },
    response: {
      success: "Borrador del recordatorio listo",
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
          "La factura debe estar abierta y vencida, con saldo pendiente.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Borrador del recordatorio listo",
      description:
        "Guardado en el historial de la factura. El recordatorio está listo para compartir con el cliente.",
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
    copy: "Copiar recordatorio",
    copied: "Recordatorio copiado",
    copyFailed: "No se pudo copiar. Reintentar",
    download: "Descargar recordatorio",
    subject: "Recordatorio de pago de la factura {{number}}",
    body: "El saldo pendiente es {{amount}}. La fecha de vencimiento fue el {{date}}.",
    back: "Atrás",
    submit: "Preparar recordatorio",
    reminderSent:
      "Guardado en el historial de la factura. El recordatorio está listo para compartir con el cliente.",
    viewInvoice: "Ver factura",
  },
};
