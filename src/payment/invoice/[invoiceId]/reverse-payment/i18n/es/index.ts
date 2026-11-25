import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Revertir un cobro",
  description:
    "Indica el motivo de la corrección. El asiento original se conserva en el diario.",
  invoiceId: "Referencia de la factura",
  entryId: "Referencia del asiento del cobro",
  date: "Fecha de reversión",
  reason: "Motivo de la reversión",
  reasonPlaceholder: "Por ejemplo, el banco devolvió el pago",
  datePlaceholder: "Hoy",
  viewInvoice: "Ver factura",
  reversal: "Asiento de reversión",
  originalDate: "Fecha del cobro",
  receiptAmount: "Importe del cobro",
  postingStatus: "Estado del asiento",
  viewReversal: "Ver asiento de reversión",
  cancel: "Cancelar",
  confirmTitle: "¿Contabilizar esta reversión?",
  confirm: "Contabilizar reversión",
  success: {
    title: "Cobro revertido",
    description: "El saldo de la factura refleja la reversión.",
  },
  invalidDate: "Elige una fecha entre la del cobro y la de hoy.",
  noPeriod: "No hay un período contable abierto para esta fecha.",
  invalidReceipt: "Este cobro no puede revertirse para esta factura.",
  invalidLines:
    "Las líneas guardadas están incompletas o pertenecen a otra moneda o empresa.",
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
  tags: { payment: "payment", invoice: "invoice" },
};
