import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "pago", bill: "factura", ap: "cuentas pagaderas" },
  post: {
    title: "Pago",
    titleShort: "Pago",
    description:
      "Marcar una factura aprobada como pago y publicar la entrada de la revista de pago",
    billId: {
      label: "Bill ID",
      description: "La cuenta para marcar como pago",
    },
    errors: {
      approvalPosting:
        "Registra el asiento de aprobación antes de pagar esta factura.",
      paymentAccount:
        "Elige una cuenta bancaria o de caja activa de esta empresa.",
      paymentPosting:
        "Revisa la fecha de pago, la moneda de la empresa y las cuentas de registro.",
      validation: {
        title: "Error de validación",
        description: "Entrada inválida",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para pagar las facturas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función contable o de personal",
      },
      conflict: {
        title: "Estado inválido",
        description: "Bill debe ser APPROVED antes del pago",
      },
      server: {
        title: "Error del servidor",
        description: "No podía registrar el pago",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: { title: "Error de red", description: "Comprueba tu conexión" },
      notFound: {
        title: "Bill no se encontró",
        description: "Esta medida no existe",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Bill Paid",
      description: "Proyecto de ley marcado como pagado",
    },
    response: {
      status: "Situación",
      paidAt: "Pagado en",
    },
    widget: {
      back: "Atrás",
      submit: "Marcar como Pagado",
      paymentRecorded: "Pagos registrados",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Proyecto",
      RECEIVED: "Recibidos",
      APPROVED: "Aprobados",
      PAID: "Pagado",
      DISPUTED: "Controversias",
    },
  },
  accountNodeId: {
    label: "Cuenta bancaria / efectivo",
    description: "Nodo de cuenta utilizado para pagar (Banco o Efectivo)",
    placeholder: "Cuenta UUID",
  },
  paidAt: {
    label: "Fecha de pago",
    description: "Fecha en que se realizó el pago",
    placeholder: "2024-01-31",
  },
};
