import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "TPV",
    order: "Pedido",
    refund: "Reembolso",
  },
  enums: {
    paymentMethod: {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      other: "Otro",
    },
  },
  get: {
    title: "Reembolsos de ventas",
    titleShort: "Reembolsos",
    description: "Qué se vendió, qué volvió y qué se puede reembolsar todavía.",
    orderId: {
      label: "Venta",
      description: "La venta completada",
    },
    response: {
      orderId: "Venta",
      orderNumber: "Número de venta",
      status: "Estado",
      currency: "Moneda",
      total: "Total de la venta",
      refundedTotal: "Reembolsado",
      refundableTotal: "Aún reembolsable",
      journalPosted: "Contabilizado",
      lines: "Artículos",
      orderItemId: "Línea",
      description: "Artículo",
      quantity: "Vendido",
      refundedQuantity: "Reembolsado",
      refundableQuantity: "Reembolsable",
      unitPrice: "Precio unitario",
      lineTotal: "Total de la línea",
      taxRate: "Tipo de IVA",
      refunds: "Reembolsos",
      refundId: "Reembolso",
      refundNumber: "Número de reembolso",
      method: "Reembolsado con",
      reason: "Motivo",
      createdAt: "Fecha",
      cashSession: "Cajón de efectivo",
      sessionId: "Sesión",
      terminalName: "Caja",
      available: "Efectivo en el cajón",
    },
    widget: {
      back: "Atrás",
      startRefund: "Reembolsar artículos",
      fullyRefunded: "Todo lo de esta venta ya se ha reembolsado.",
      notCompleted: "Solo se pueden reembolsar ventas completadas.",
      history: "Historial de reembolsos",
      noRefunds: "Esta venta aún no tiene reembolsos.",
      loading: "Cargando venta",
    },
    success: {
      title: "Reembolsos cargados",
      description: "La venta y el historial de reembolsos están al día.",
    },
  },
  post: {
    title: "Reembolsar venta",
    titleShort: "Reembolsar",
    description:
      "Devuelve el dinero de una venta completada, entero o línea por línea. El stock vuelve a la estantería y la contabilidad lo sigue.",
    orderId: {
      label: "Venta",
      description: "La venta completada que se reembolsa",
    },
    lines: {
      label: "Artículos a reembolsar",
      description:
        "Línea y cantidad por artículo. Déjalo vacío para reembolsar todo lo que queda.",
    },
    method: {
      label: "Reembolsar con",
      description:
        "Cómo vuelve el dinero. El efectivo sale de un cajón abierto.",
      placeholder: "Elige cómo reembolsar",
    },
    sessionId: {
      label: "Cajón de efectivo",
      description:
        "Sesión abierta que paga el efectivo. Por defecto, tu sesión abierta en una caja con la moneda de la venta.",
    },
    reason: {
      label: "Motivo",
      description: "Por qué se devuelve el dinero. Se guarda con el reembolso.",
      placeholder: "Por ejemplo: se devolvió un artículo dañado",
    },
    response: {
      refundId: "Reembolso",
      refundNumber: "Número de reembolso",
      orderId: "Venta",
      sessionId: "Sesión",
      method: "Reembolsado con",
      currency: "Moneda",
      subtotal: "Neto",
      taxAmount: "IVA",
      total: "Reembolsado ahora",
      refundedTotal: "Total reembolsado",
      fullyRefunded: "Reembolsado por completo",
      journalEntryId: "Asiento contable",
      stockReturned: "Productos de vuelta en stock",
    },
    widget: {
      back: "Volver a la venta",
      items: "Qué vuelve",
      selectAll: "Reembolsar todo",
      clear: "Borrar",
      decrease: "{{item}}: uno menos",
      increase: "{{item}}: uno más",
      all: "Todo",
      sold: "Vendidos {{quantity}}",
      alreadyRefunded: "{{quantity}} ya reembolsados",
      nothingLeft: "Reembolsado por completo",
      summary: "Reembolso",
      net: "Neto",
      vat: "IVA",
      total: "Total del reembolso",
      cashFrom: "Pagado del cajón de {{terminal}}",
      drawerAvailable: "En el cajón: {{amount}}",
      noCashSession:
        "Abre una sesión en una caja en {{currency}} para reembolsar en efectivo.",
      drawerShort: "El cajón tiene menos efectivo que este reembolso.",
      confirmTitle: "¿Reembolsar {{amount}}?",
      confirmDescription:
        "El dinero vuelve con {{method}}. El stock y la contabilidad se actualizan. Un reembolso no se puede deshacer.",
      confirm: "Reembolsar",
      cancel: "Cancelar",
      pickItems: "Elige al menos un artículo.",
      reasonMissing: "Añade un motivo.",
      loading: "Cargando venta",
      viewRefunds: "Ver reembolsos",
      newSale: "Volver a la venta",
    },
    success: {
      title: "Reembolso hecho",
      description: "El dinero va de camino al cliente.",
    },
  },
  messages: {
    notCompleted: "Solo se pueden reembolsar ventas completadas.",
    invalidLine:
      "Elige artículos de esta venta con una cantidad mayor que cero.",
    nothingLeft: "No queda nada por reembolsar en esta venta.",
    overRefund: "Es más de lo vendido menos los reembolsos anteriores.",
    rounding:
      "Este reembolso es demasiado pequeño para pagarlo. Añade más artículos.",
    cashSessionRequired:
      "Los reembolsos en efectivo necesitan una sesión abierta en una caja con la moneda de la venta.",
    sessionInvalid: "Elige una sesión abierta de esta empresa.",
    cashCurrencyMismatch:
      "Esta caja trabaja en otra moneda distinta a la de la venta.",
    drawerShort: "El cajón tiene menos efectivo que este reembolso.",
    postingUnavailable:
      "No se pudo contabilizar el reembolso. Comprueba que haya un periodo contable abierto.",
    stockUnavailable:
      "No se pudo devolver el stock. Comprueba que el almacén esté activo.",
  },
  errors: {
    validation: {
      title: "Revisa el reembolso",
      description: "Elige artículos, un método de reembolso y un motivo.",
    },
    unauthorized: {
      title: "Inicio de sesión necesario",
      description: "Inicia sesión para reembolsar ventas.",
    },
    forbidden: {
      title: "Sin acceso",
      description: "No puedes reembolsar ventas de esta empresa.",
    },
    notFound: {
      title: "Venta no encontrada",
      description: "Esta venta no existe o pertenece a otra empresa.",
    },
    conflict: {
      title: "Reembolso no posible",
      description: "La venta o el cajón no permiten este reembolso.",
    },
    server: {
      title: "Reembolso fallido",
      description: "No se reembolsó nada. Inténtalo de nuevo.",
    },
    unknown: {
      title: "Reembolso fallido",
      description: "No se reembolsó nada. Inténtalo de nuevo.",
    },
    network: {
      title: "Sin conexión",
      description: "Revisa tu conexión e inténtalo de nuevo.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Termina o descarta tus cambios primero.",
    },
  },
};
