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
        title: "Acceso denegado",
        description: "No tienes acceso",
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
  accountNodeId: {
    label: "Nodo de cuenta ID",
    description: "Opcional: nodo contable que recibió este pago",
    placeholder: "Ingrese el nodo de cuenta ID",
  },
  widget: {
    back: "Atrás",
    submit: "Pago de registro",
    paymentRecorded: "Pago registrado con éxito.",
    viewInvoice: "Ver factura",
  },
};
