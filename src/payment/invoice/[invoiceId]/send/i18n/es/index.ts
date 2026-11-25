import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
  },
  post: {
    title: "Emitir factura",
    titleShort: "Emitir factura",
    description: "Emite el borrador y contabiliza la cuenta por cobrar.",
    form: {
      title: "Emitir factura",
      description: "Tras emitirla se generará un enlace para el cliente.",
    },
    response: {
      success: "Factura enviada",
      message: "Mensaje de Estado",
      viewUrl: "Vista al cliente URL",
    },
    errors: {
      invoiceLines:
        "Añade líneas con un total positivo antes de emitir la factura.",
      posting:
        "Revisa el total de la factura, la moneda de la empresa, el periodo contable y las cuentas de registro.",
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
    submit: "Emitir factura",
    sent: "Factura emitida",
    viewUrl: "Enlace de vista al cliente",
  },
};
