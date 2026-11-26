import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "pago", bill: "factura", ap: "cuentas por pagar" },
  post: {
    title: "Pagar factura",
    titleShort: "Pagar factura",
    description:
      "Marca una factura aprobada como pagada y contabiliza el pago.",
    billId: {
      label: "Factura",
      description: "La factura que quieres marcar como pagada.",
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
        title: "Inicia sesión",
        description: "Inicia sesión para pagar facturas.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Necesitas permisos de contabilidad o administración.",
      },
      conflict: {
        title: "No se puede pagar la factura",
        description:
          "Solo las facturas aprobadas se pueden marcar como pagadas.",
      },
      server: {
        title: "Error del servidor",
        description: "No se pudo registrar el pago.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: { title: "Error de red", description: "Comprueba tu conexión" },
      notFound: {
        title: "Factura no encontrada",
        description: "Esta factura no existe.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Factura pagada",
      description: "La factura se marcó como pagada.",
    },
    response: {
      status: "Estado",
      paidAt: "Fecha de pago",
    },
    widget: {
      back: "Atrás",
      details: "Detalles del pago",
      loadingBill: "Cargando factura…",
      retry: "Volver a intentar",
      submit: "Marcar como pagada",
      paymentRecorded: "Pago registrado",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Borrador",
      RECEIVED: "Recibida",
      APPROVED: "Aprobada",
      PAID: "Pagada",
      DISPUTED: "En disputa",
    },
  },
  accountNodeId: {
    label: "Cuenta bancaria o de caja",
    description:
      "Deja el campo vacío para usar la cuenta de pago predeterminada.",
  },
  paidAt: {
    label: "Fecha de pago",
    description: "Fecha en que se realizó el pago",
    placeholder: "2024-01-31",
  },
};
