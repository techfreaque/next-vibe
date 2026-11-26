import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
  },
  post: {
    title: "Pago manual de registros",
    titleShort: "Pago de registro",
    description:
      "Grabar un pago manual contra una factura. Lo marca como Pagado si está completamente arreglado.",
    form: {
      title: "Pago de registro",
      description:
        "Introduzca los detalles de pago para registrar contra esta factura",
    },
    response: {
      success: "Pagos registrados",
      message: "Mensaje de Estado",
    },
    errors: {
      receiptKeyConflict: "Esta clave ya está asociada a otro pago.",
      paymentPrecision:
        "Introduce un importe positivo con un máximo de dos decimales.",
      paymentStatus:
        "Registra pagos de facturas abiertas con un importe positivo.",
      overpayment: "El pago supera el saldo de la factura.",
      fullPayment:
        "Si la factura no está vinculada a una empresa, introduce el importe pendiente completo.",
      issuancePosting:
        "Antes de registrar el pago, contabiliza una cuenta por cobrar por el total de la factura.",
      paymentAccount:
        "Elige una cuenta bancaria o de caja activa de esta empresa.",
      paymentPosting:
        "Revisa la fecha de pago, la moneda de la empresa y las cuentas de registro.",
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de pago inválidos",
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
        title: "Permiso de pago requerido",
        description:
          "Necesitas permiso para gestionar esta factura y registrar un pago.",
      },
      notFound: {
        title: "No encontrado",
        description: "Factura no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "La factura ya se paga o se anula",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Pago manual registrado",
    },
  },
  enums: {
    manualPaymentMethod: {
      cash: "Efectivo",
      bankTransfer: "Transferencia bancaria",
      other: "Otro",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "ID de la factura para registrar el pago contra",
    placeholder: "Introduzca la factura ID",
  },
  amount: {
    label: "Cuantía pagada",
    description: "Cuantía recibida",
    placeholder: "0.00",
  },
  method: {
    label: "Método de pago",
    description: "Cómo se recibió el pago",
    placeholder: "Seleccionar método",
  },
  paidAt: {
    label: "Fecha de pago",
    description: "Cuando se recibió el pago",
    placeholder: "Selecciona una fecha",
  },
  receiptKey: {
    label: "Clave de pago",
    description:
      "Usa la misma clave para reintentar este pago. Para otro cobro, usa una clave nueva.",
  },
  accountNodeId: {
    label: "Cuenta de cobro",
    description:
      "Selecciona la cuenta bancaria o de caja donde se recibió el pago.",
    placeholder: "Seleccionar cuenta",
    automatic: "Usar la cuenta predeterminada",
  },
  widget: {
    backToInvoices: "Volver a facturas",
    retryInvoice: "Reintentar",
    loadingInvoice: "Comprobando el acceso a la factura…",
    details: "Detalles del cobro",
    back: "Atrás",
    submit: "Pago de registro",
    paymentRecorded: "Pago registrado con éxito.",
    viewInvoice: "Ver factura",
    amountDue: "{{amount}} pendiente",
    notOpenTitle: "Esta factura no está abierta",
    notOpenMessage:
      "Solo las facturas emitidas y sin pagar admiten pagos. Emite primero la factura o abre la correcta.",
  },
};
