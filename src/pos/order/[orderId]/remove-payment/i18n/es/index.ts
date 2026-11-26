import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "TPV",
    order: "Venta",
    removePayment: "Quitar pago",
  },
  enums: {
    paymentMethod: {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      other: "Otro",
    },
  },
  post: {
    title: "Quitar pago",
    titleShort: "Quitar pago",
    description:
      "Quita un pago de una venta abierta, por ejemplo si se marcó por error.",
    orderId: {
      label: "Venta",
      description: "La venta abierta que tiene este pago",
    },
    paymentId: {
      label: "Pago",
      description: "El pago que se quita de la venta",
    },
    response: {
      orderId: "Venta",
      paymentId: "Pago quitado",
      sessionId: "Sesión de caja",
      currency: "Moneda",
      totalPaid: "Pagado hasta ahora",
      outstanding: "Pendiente",
      remainingPayments: "Pagos restantes",
    },
    widget: {
      back: "Volver a la venta",
      pickPayment: "Elige el pago que quieres quitar",
      noPayments: "Esta venta no tiene pagos que quitar.",
      notOpen: "Solo se pueden quitar pagos de una venta abierta.",
      loading: "Cargando la venta",
      change: "Cambio {{amount}}",
      selected: "Seleccionado",
      amount: "Importe",
      confirmTitle: "¿Quitar este pago?",
      confirmDescription:
        "La venta sigue abierta. Después cobra el pago correcto.",
      confirm: "Quitar pago",
      cancel: "Cancelar",
      stillDue: "Pendiente",
      paidSoFar: "Pagado hasta ahora",
      nothingPaid: "Ya no quedan pagos en esta venta.",
    },
    success: {
      title: "Pago quitado",
      description: "La venta espera un nuevo pago.",
    },
  },
  errors: {
    validation: {
      title: "Revisa el pago",
      description: "Elige un pago de esta venta.",
    },
    unauthorized: {
      title: "Inicia sesión",
      description: "Inicia sesión para modificar ventas.",
    },
    forbidden: {
      title: "Sin acceso",
      description: "No puedes modificar las ventas de esta empresa.",
    },
    notFound: {
      title: "Pago no encontrado",
      description: "Este pago ya no está en la venta.",
    },
    conflict: {
      title: "La venta no está abierta",
      description:
        "Solo se puede quitar un pago mientras la venta y la sesión de caja están abiertas.",
    },
    server: {
      title: "No se quitó el pago",
      description: "Algo salió mal. Inténtalo de nuevo.",
    },
    unknown: {
      title: "No se quitó el pago",
      description: "Algo salió mal. Inténtalo de nuevo.",
    },
    network: {
      title: "Sin conexión",
      description: "Revisa tu conexión e inténtalo de nuevo.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Primero termina o descarta tus cambios.",
    },
  },
};
