import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "TPV",
    register: "Pantalla de caja",
  },
  enums: {
    sessionStatus: {
      open: "Abierta",
      closed: "Cerrada",
    },
  },
  get: {
    title: "Caja",
    titleShort: "Caja",
    description:
      "Venda en una caja abierta: escanee o toque productos, cobre y entregue el ticket.",
    sessionId: {
      label: "Turno de caja",
      description: "El turno abierto en el que vende",
    },
    response: {
      status: "Estado de la caja",
      terminalName: "Caja",
      companyName: "Empresa",
      currency: "Moneda",
      openedAt: "Abierta",
      openingFloat: "Fondo inicial",
      salesCount: "Ventas",
      salesTotal: "Recaudación",
      openOrders: "Ventas aparcadas",
      orderNumber: "Venta",
      itemCount: "Artículos",
      total: "Total",
      createdAt: "Iniciada",
    },
    errors: {
      validation: {
        title: "Turno de caja no válido",
        description: "Abra la caja desde el panel del TPV.",
      },
      unauthorized: {
        title: "Inicio de sesión necesario",
        description: "Inicie sesión para usar la caja.",
      },
      forbidden: {
        title: "Sin acceso a esta caja",
        description: "No es miembro de la empresa propietaria de esta caja.",
      },
      conflict: {
        title: "La caja ha cambiado",
        description:
          "Esta caja se modificó en otro lugar. Recargue e inténtelo de nuevo.",
      },
      server: {
        title: "No se pudo cargar la caja",
        description:
          "Algo falló por nuestra parte. Inténtelo de nuevo en un momento.",
      },
      unknown: {
        title: "No se pudo cargar la caja",
        description: "Se produjo un error inesperado. Inténtelo de nuevo.",
      },
      network: {
        title: "Sin conexión",
        description: "Compruebe su conexión e inténtelo de nuevo.",
      },
      notFound: {
        title: "Turno no encontrado",
        description: "Este turno ya no existe.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Termine o descarte primero la venta en curso.",
      },
    },
    success: {
      title: "Caja lista",
      description: "La caja está cargada.",
    },
  },
  widget: {
    back: "Volver",
    subtitle: "{{company}} · abierta desde las {{time}}",
    takings: "Recaudación del turno: {{total}} · Ventas: {{count}}",
    sales: "Ventas",
    closeTill: "Cerrar caja",
    search: {
      label: "Buscar productos",
      placeholder: "Escanee un código o busque un producto",
      hint: "para buscar, Intro añade el artículo",
      clear: "Borrar búsqueda",
    },
    products: {
      title: "Productos",
      none: "Nada coincide con «{{query}}».",
      emptyCatalog: "No hay productos activos con precio en {{currency}}.",
      addProducts: "Añadir productos",
      inCart: "En la venta: {{count}}",
      loading: "Cargando productos",
    },
    custom: {
      tile: "Artículo libre",
      tileHint: "Cualquier importe",
      title: "Artículo libre",
      description: "Descripción",
      descriptionPlaceholder: "Envoltorio de regalo",
      price: "Precio",
      vat: "IVA %",
      add: "Añadir a la venta",
      cancel: "Cancelar",
    },
    cart: {
      title: "Venta {{number}}",
      newTitle: "Nueva venta",
      empty: "Escanee o toque un producto para empezar una venta.",
      items: "Artículos: {{count}}",
      increase: "Un {{name}} más",
      decrease: "Un {{name}} menos",
      remove: "Quitar {{name}}",
      each: "{{price}} c/u",
      locked: "Pago registrado. Los artículos están bloqueados.",
      subtotal: "Base",
      vat: "IVA",
      total: "Total",
      paid: "Pagado",
      due: "Pendiente",
      change: "Cambio",
      removePayment: "Quitar pago con {{method}}",
      parked: "Aparcadas",
      park: "Aparcar",
      resume: "Retomar {{number}}",
    },
    tender: {
      title: "Pago",
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      other: "Otro",
      amount: "Importe recibido",
      reference: "Referencia (opcional)",
      referencePlaceholder: "Comprobante de tarjeta o ID de transferencia",
      exact: "Exacto",
      take: "Cobrar {{amount}}",
      takeShort: "Cobrar",
      changeHint: "Cambio a devolver: {{amount}}",
      complete: "Finalizar venta",
      retryComplete: "Finalizar venta",
      pay: "Cobrar {{amount}}",
      shortcut: "Ctrl+Intro",
    },
    void: {
      action: "Anular venta",
      title: "¿Anular esta venta?",
      message:
        "Se vacía el carrito. La venta queda en el historial como anulada.",
      confirm: "Anular venta",
      cancel: "Mantener venta",
      blocked: "Pago registrado. Quite el pago antes de anular.",
    },
    receipt: {
      title: "Venta completada",
      number: "Ticket {{number}}",
      giveChange: "Devolver cambio",
      newSale: "Nueva venta",
      refund: "Reembolsar",
      open: "Abrir ticket",
      paidWith: "Pagado con {{method}}",
    },
    closed: {
      title: "Esta caja está cerrada",
      message:
        "Abra un turno nuevo desde el panel del TPV para volver a vender.",
      backToPos: "Volver al TPV",
      sales: "Ventas de este turno",
    },
    error: {
      title: "No se pudo completar",
      dismiss: "Cerrar",
    },
  },
};
