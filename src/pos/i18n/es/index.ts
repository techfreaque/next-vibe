import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punto de venta",
  tags: {
    pos: "POS",
    terminal: "Terminal",
    session: "Sesión",
    order: "Orden",
    payment: "Pago",
    create: "Crear",
    list: "Lista",
    get: "¡Vamos!",
    open: "Abierto",
    close: "Cerrar",
    complete: "Completado",
    void: "Vacío",
    addItem: "Add Item",
    removeItem: "Quitar el artículo",
    addPayment: "Agregar pago",
  },
  endpointCategories: {
    pos: "Punto de venta",
    terminals: "Terminales",
    sessions: "Sesiones",
    orders: "Pedidos",
  },
  enums: {
    sessionStatus: {
      open: "Abierto",
      closed: "Cerrado",
    },
    orderStatus: {
      open: "Abierto",
      completed: "Completado",
      voided: "Vacío",
    },
    paymentMethod: {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      other: "Otro",
    },
  },

  // POS Dashboard
  dashboard: {
    get: {
      title: "POS Dashboard",
      titleShort: "POS Dashboard",
      description:
        "Resúmenes de terminales, sesiones activas y ventas actuales.",
      widget: {
        loading: "Carga dashboard...",
        loadingHint: "Conseguir sus datos de POS.",
        kpiTerminals: "Terminales (activos / totales)",
        kpiOpenSessions: "Sesiones abiertas",
        kpiTodayOrders: "Órdenes de hoy",
        kpiTodaySales: "Ingresos de hoy",
        terminalsHeading: "Terminales",
        refresh: "Actualizar",
        openSession: "Período de sesiones abierto",
        viewOrders: "Ver pedidos",
        viewSession: "Período de sesiones",
        allTerminals: "Todos los terminales",
        statusActive: "Activa",
        statusInactive: "Inactivo",
        statusSessionOpen: "Sesión abierta",
        emptyTerminals: "No hay terminales configuradas.",
        emptyTerminalsHint:
          "Contacte con su administrador para configurar los terminales POS.",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver el panel POS",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a los datos POS",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to load dashboard",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "No encontrado",
          description: "No se han encontrado datos POS",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Cargadora de pizarra",
        description: "Vista general de POS recuperada",
      },
      response: {
        terminalsTotal: "Total Terminales",
        terminalsActive: "Terminales activos",
        openSessionsCount: "Períodos de sesiones abiertos",
        todayOrderCount: "Órdenes de hoy",
        todaySalesTotal: "Hoy en día la facturación",
        currency: "Moneda",
        terminalId: "Terminal ID",
        terminalName: "Nombre de la terminal",
        terminalLocation: "Ubicación",
        terminalCurrency: "Moneda",
        terminalIsActive: "Activa",
        terminalHasOpenSession: "Sesión abierta",
        terminalOpenSessionId: "Sesión abierta ID",
      },
    },
  },

  // Terminal create
  terminalCreate: {
    post: {
      title: "Crear Terminal",
      titleShort: "Crear Terminal",
      description: "Registrar un nuevo terminal POS para una empresa.",
      widget: {
        backToList: "Volver a las terminales",
        active: "Activa",
        inactive: "Inactivo",
        openSession: "Período de sesiones abierto",
      },
      companyId: {
        label: "Company ID",
        description: "Empresa esta terminal pertenece a",
      },
      name: {
        label: "Nombre de la terminal",
        description: "Nombre de esta terminal",
        placeholder: "Main Register",
      },
      location: {
        label: "Ubicación",
        description: "Ubicación física de la terminal",
        placeholder: "Recepción frontal",
      },
      currency: {
        label: "Moneda",
        description: "Moneda por defecto (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Nodo de cuenta de efectivo",
        description: "Nodo de cuenta para el cajón de efectivo",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicia sesión para crear terminales",
        },
        forbidden: {
          title: "Admin Se requiere",
          description: "Sólo los administradores pueden crear terminales",
        },
        conflict: {
          title: "Conflicto",
          description: "Un terminal con este nombre ya existe",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to create terminal. try again",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Terminal Creado",
        description: "Terminal registrado con éxito",
      },
      response: {
        id: "Terminal ID",
        name: "Nombre de la terminal",
        companyId: "Company ID",
        currency: "Moneda",
        isActive: "Activa",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Terminales",
      titleShort: "Terminales",
      description: "Listar todos los terminales para una empresa.",
      widget: {
        active: "Activa",
        inactive: "Inactivo",
        total: "terminales",
        createTerminal: "Nuevo terminal",
        empty: "No hay terminales configuradas.",
        emptyHint:
          "Los terminales son los registros físicos de su tienda. Contacte con su administrador para configurarlos.",
        emptyContact: "Contacta con tu administrador",
        openSession: "Período de sesiones abierto",
        selectCompany: "Terminales de carga...",
        selectCompanyHint: "Trae tus terminales.",
        loading: "Terminales de carga...",
        loadingHint: "Trae tus terminales.",
        refresh: "Actualizar",
        back: "Atrás",
      },
      companyId: {
        label: "Company ID",
        description: "Compañía para listar terminales para",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicia sesión en la lista de terminales",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to list terminals",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "No encontrado",
          description: "Compañía no encontrada",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Terminales cargados",
        description: "Lista de la terminal recuperada",
      },
      response: {
        id: "Terminal ID",
        name: "Nombre de la terminal",
        location: "Ubicación",
        currency: "Moneda",
        isActive: "Activa",
        createdAt: "Creado en",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Sesión abierta",
      titleShort: "Sesión abierta",
      description: "Iniciar una sesión de cajeros en una terminal.",
      widget: {
        viewOrders: "Ver pedidos",
        backToTerminals: "Volver a las terminales",
        selectTerminal: "Terminal listo",
        selectTerminalHint:
          "Establece el flotador de apertura y abre la sesión.",
        terminal: "Terminal",
        readyToOpen: "Listo",
        floatHint: "Cuenta el efectivo en el cajón antes de abrir.",
        startOrders: "Comienzo a tomar órdenes",
      },
      terminalId: {
        label: "Terminal ID",
        description: "Terminal a sesión abierta",
      },
      openingFloat: {
        label: "Flota de apertura",
        description: "Efectivo en el cajón al comienzo del período de sesiones",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Iniciar sesión para abrir un período de sesiones",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta terminal",
        },
        conflict: {
          title: "Sesión ya abierta",
          description: "Esta terminal ya tiene una sesión abierta",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to open session",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Terminal no encontrado",
          description: "Terminal no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Sesión abierta",
        description: "La sesión comenzó con éxito",
      },
      response: {
        id: "Período de sesiones ID",
        terminalId: "Terminal ID",
        openedAt: "Abierto en",
        status: "Situación",
        openingFloat: "Flota de apertura",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      mixedCash:
        "Concilia los cobros en efectivo en otras divisas antes de cerrar la caja.",
      title: "Período de sesiones cerrado",
      titleShort: "Período de sesiones cerrado",
      description:
        "Cierre una sesión de cajeros y registre el carro de cierre.",
      widget: {
        backToTerminals: "Volver a las terminales",
        sessionSummary: "Resumen de la sesión",
        terminal: "Terminal",
        openedAt: "Abierto en",
        orderCount: "Pedidos",
        sessionRevenue: "Ingresos generados",
        floatHint: "Cuenta el dinero en el cajón antes de cerrar.",
        reconciliation: "Fin del día",
        sessionReady: "Sesión",
        active: "Activa",
        openingFloat: "Flota de apertura",
        cashSales: "Ventas en efectivo",
        expectedClosingFloat: "Flota de cierre esperada",
        actualClosingFloat: "Flota de cierre real",
        variance: "Diferencia",
        reconciliationTitle: "Conciliación en efectivo",
      },
      sessionId: {
        label: "Período de sesiones ID",
        description: "Período de sesiones a fin de concluir",
      },
      closingFloat: {
        label: "Closing Float",
        description: "Efectivo contado en cajón al cierre",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Iniciar sesión para cerrar un período de sesiones",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Sólo puedes cerrar tu propia sesión",
        },
        conflict: {
          title: "Período de sesiones ya cerrado",
          description: "Este período de sesiones ya está cerrado",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado en el período de sesiones cercano",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Sesión no encontrada",
          description: "No existe la sesión",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Período de sesiones cerrado",
        description: "Período de sesiones cerrado con éxito",
      },
      response: {
        id: "Período de sesiones ID",
        status: "Situación",
        closedAt: "Cerrado",
        closingFloat: "Closing Float",
        expectedFloat: "Flota esperada",
        cashSalesTotal: "Ventas en efectivo",
        variance: "Diferencia",
        orderCount: "Cuenta de orden",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Sesión",
      titleShort: "Detalles del período de sesiones",
      description: "Recuperar detalles para un período de sesiones específico.",
      widget: {
        viewOrders: "Ver pedidos",
        closeSession: "Período de sesiones cercano",
        newOrder: "Nuevo orden",
        sessionDetails: "Detalles del período de sesiones",
        loading: "Cargando sesión...",
        back: "Atrás",
      },
      sessionId: {
        label: "Período de sesiones ID",
        description: "Sesión para recuperar",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Período de sesiones inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Iniciar sesión para ver las sesiones",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este período de sesiones",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Fallado en la sesión de carga",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Sesión no encontrada",
          description: "No existe la sesión",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Cargado de sesión",
        description: "Detalles del período de sesiones recuperados",
      },
      response: {
        id: "Período de sesiones ID",
        terminalId: "Terminal ID",
        cashierUserId: "Cajero",
        status: "Situación",
        openedAt: "Abierto en",
        closedAt: "Cerrado",
        openingFloat: "Flota de apertura",
        closingFloat: "Closing Float",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "Crear orden",
      titleShort: "Crear orden",
      description: "Crear un nuevo orden en una sesión abierta.",
      widget: {
        addItem: "Add Item",
        viewOrder: "Ver pedido",
        creating: "Orden de apertura...",
        back: "Atrás",
      },
      sessionId: {
        label: "Período de sesiones ID",
        description: "Sesión para crear el orden en",
      },
      customerId: {
        label: "Cliente ID",
        description: "Referencia del cliente opcional",
      },
      currency: {
        label: "Moneda",
        description: "Moneda de orden",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para crear pedidos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este período de sesiones",
        },
        conflict: {
          title: "Período de sesiones cerrado",
          description: "No se pueden crear órdenes en una sesión cerrada",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to create order",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Sesión no encontrada",
          description: "No existe la sesión",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Orden Creado",
        description: "Orden creado con éxito",
      },
      response: {
        id: "Orden ID",
        orderNumber: "Número de pedido",
        sessionId: "Período de sesiones ID",
        status: "Situación",
        currency: "Moneda",
        total: "Total",
      },
    },
  },

  // Order add item
  orderAddItem: {
    post: {
      title: "Add Item",
      titleShort: "Add Item",
      description: "Añadir un artículo de línea a un orden abierto.",
      widget: {
        backToOrder: "Regresar al orden",
        linePreview: "Total de la línea",
        taxNote: "IVA incluido.",
        multiplier: "×",
        addAnother: "Añadir otro artículo",
        searchProduct: "Búsqueda de productos catálogo",
        searchPlaceholder: "Nombre o SKU...",
        orManual: "O introduzca manualmente",
        selectedProduct: "Producto seleccionado",
        clearProduct: "Limpiar",
        searchButton: "Buscar",
        noProductResults:
          "No hay coincidencias. ingrese manualmente a continuación.",
      },
      orderId: {
        label: "Orden ID",
        description: "Orden de añadir el artículo a",
      },
      productId: {
        label: "Producto ID",
        description: "Referencia del producto opcional",
      },
      itemDescription: {
        label: "Descripción",
        description: "Descripción del artículo",
        placeholder: "Café",
      },
      quantity: {
        label: "Cantidad",
        description: "Cantidad",
        placeholder: "1",
      },
      unitPrice: {
        label: "Precio unitario",
        description: "Precio por unidad",
        placeholder: "3.50",
      },
      taxRate: {
        label: "Tasa de impuestos",
        description:
          "Tasa de impuestos como decimal (por ejemplo, 0,2 para 20%)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para añadir elementos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden",
        },
        conflict: {
          title: "Orden No Abierto",
          description: "No se pueden añadir artículos a un pedido no abierto",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to add item",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Orden No encontrado",
          description: "El orden no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: { title: "Tema Añadido", description: "Tema añadido al orden" },
      response: {
        id: "Tema ID",
        description: "Descripción",
        quantity: "Cantidad",
        unitPrice: "Precio unitario",
        taxAmount: "Cuantía fiscal",
        lineTotal: "Total",
        orderTotal: "Orden Total",
      },
    },
  },

  // Order remove item
  orderRemoveItem: {
    post: {
      title: "Quitar el artículo",
      titleShort: "Quitar el artículo",
      description: "Retire un artículo de línea de un orden abierto.",
      widget: {
        chooseLine: "Selecciona una línea",
        backToOrder: "Regresar al orden",
      },
      orderId: {
        label: "Pedido",
        description: "Orden para eliminar el artículo de",
      },
      itemId: { label: "Línea", description: "Tema para eliminar" },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para eliminar los elementos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden",
        },
        conflict: {
          title: "Orden No Abierto",
          description:
            "No se puede quitar los elementos de un pedido no abierto",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para eliminar el artículo",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "No encontrado",
          description: "Orden o artículo no encontrado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Tema eliminado",
        description: "Tema eliminado del orden",
      },
      response: {
        orderId: "Orden ID",
        orderTotal: "Total actualizado",
      },
    },
  },

  // Order complete
  orderComplete: {
    post: {
      title: "Pedido completo",
      titleShort: "Pedido completo",
      description:
        "Completa un pedido. Valida el pago completo y la entrada de diario de publicaciones.",
      widget: {
        backToList: "Volver a las órdenes",
        confirmTitle: "¿Completo esta orden?",
        confirmHint:
          "Esto no puede ser deshecho. Todos los pagos deben ser recogidos.",
        orderNumber: "Orden",
        cancel: "Cancelar",
      },
      orderId: { label: "Orden ID", description: "Orden para completar" },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para completar pedidos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden",
        },
        conflict: {
          title: "Saldo pendiente",
          description: "Los pagos totales no cubren el total de la orden",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para completar el pedido",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Orden No encontrado",
          description: "El orden no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Pedido completado",
        description: "Orden completado y entrada de diario publicado",
      },
      response: {
        id: "Orden ID",
        status: "Situación",
        total: "Total",
        journalEntryId: "Journal Entry ID",
      },
    },
  },

  // Order void
  orderVoid: {
    post: {
      title: "Void Order",
      titleShort: "Void Order",
      description: "Vacíe una orden abierta. No se puede deshacer.",
      widget: {
        tendered:
          "Ya se registró un pago. El pedido y sus líneas están bloqueados.",
        closed: "Este pedido está cerrado.",
        backToList: "Volver a las órdenes",
      },
      orderId: { label: "Pedido", description: "Orden de anulación" },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en pedidos sin valor",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden",
        },
        conflict: {
          title: "Orden No Abierto",
          description: "Sólo se pueden anular órdenes abiertas",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado en el orden de vacío",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Orden No encontrado",
          description: "El orden no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Orden voided",
        description: "La orden ha sido anulada",
      },
      response: {
        id: "Orden ID",
        status: "Situación",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "Orden.",
      titleShort: "Detalles del pedido",
      description: "Recuperar una sola orden con sus artículos y pagos.",
      widget: {
        addItem: "Añádase el tema",
        addPayment: "Agregar pago",
        complete: "Pedido completo",
        void: "Orden de voto",
        back: "Atrás",
        outstanding: "Destacados",
        fullyPaid: "Totalmente pagado",
        qtyTimesPrice: "×",
        loading: "Cargando pedidos...",
        noItems: "Todavía no hay artículos. añada el primer artículo.",
        viewJournalEntry: "View Journal Entry",
        voidedStamp: "VOIDED",
        completedReadOnly: "Esta orden se completa y no puede ser modificada.",
        select: "Seleccione el orden",
      },
      orderId: { label: "Orden ID", description: "Orden para recuperar" },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver órdenes",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Fallado para cargar el pedido",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Orden No encontrado",
          description: "El orden no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Orden cargada",
        description: "Detalles del pedido recuperados",
      },
      response: {
        id: "Orden ID",
        orderNumber: "Número de pedido",
        sessionId: "Período de sesiones ID",
        customerId: "Cliente ID",
        status: "Situación",
        currency: "Moneda",
        subtotal: "Subtotal",
        taxAmount: "Impuestos",
        total: "Total",
        journalEntryId: "Journal Entry ID",
        createdAt: "Creado en",
        items: "Temas",
        itemId: "Tema ID",
        productId: "Producto ID",
        description: "Descripción",
        quantity: "Cantidad",
        unitPrice: "Precio unitario",
        taxRate: "Tasa de impuestos",
        taxAmountItem: "Impuestos",
        lineTotal: "Total",
        payments: "Pagos",
        paymentId: "Pago ID",
        method: "Método",
        amount: "Monto",
        change: "Cambiar",
        reference: "Referencia",
      },
    },
  },

  // Order list
  orderList: {
    get: {
      title: "Pedidos",
      titleShort: "Pedidos",
      description:
        "Listar pedidos para una sesión o terminal con filtro de estado opcional.",
      widget: {
        newOrder: "Nuevo orden",
        empty: "Todavía no hay órdenes en este período de sesiones.",
        emptyHint: "Comience una nueva orden para empezar a vender.",
        back: "Atrás",
        backToTerminals: "Volver a las terminales",
        selectSession: "Seleccione una sesión",
        selectSessionHint: "Ingrese una sesión ID para ver sus órdenes.",
        sessionTotal: "Período de sesiones total",
        filterAll: "Todos",
        loading: "Carga de pedidos...",
        ordersTotal: "órdenes",
        tapToView: "grifo para ver",
      },
      sessionId: {
        label: "Período de sesiones ID",
        description: "Sesión para enumerar las órdenes",
      },
      status: {
        label: "Situación",
        description: "Filtro por estado de pedido",
        placeholder: "Todos los estados",
      },
      page: { label: "Página", description: "Número de página (fotos a 1)" },
      pageSize: {
        label: "Por página",
        description: "Resultados por página (max 100)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en la lista de pedidos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este período de sesiones",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Fallado en la lista de pedidos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Sesión no encontrada",
          description: "No existe la sesión",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Pedidos cargados",
        description: "Lista de pedidos recuperada",
      },
      response: {
        count: "Total",
        id: "Orden ID",
        orderNumber: "Número de pedido",
        sessionId: "Período de sesiones ID",
        status: "Situación",
        currency: "Moneda",
        total: "Total",
        createdAt: "Creado en",
      },
    },
  },

  // Product lookup (POS catalog search)
  productLookup: {
    get: {
      title: "Búsqueda de productos",
      titleShort: "Búsqueda de productos",
      description:
        "Buscar productos de catálogo por nombre o SKU para rápida entrada POS.",
      widget: {
        noResults:
          "No se han encontrado productos: prueba una búsqueda diferente.",
        tax: "impuesto fiscal",
        back: "Atrás",
      },
      companyId: {
        label: "Company ID",
        description: "Limitar la búsqueda a una empresa específica",
      },
      query: {
        label: "Buscar",
        description: "Búsqueda por nombre del producto o SKU",
        placeholder: "Café, BEV-001...",
      },
      page: { label: "Página", description: "Número de página (fotos a 1)" },
      pageSize: {
        label: "Por página",
        description: "Resultados por página (max 50)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Introduzca al menos un personaje para buscar",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en productos de búsqueda",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to search products",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "No encontrado",
          description: "No se han encontrado productos",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Productos encontrados",
        description: "Productos de emparejamiento recuperados",
      },
      response: {
        id: "Producto ID",
        name: "Nombre",
        sku: "SKU",
        type: "Tipo",
        basePrice: "Precio",
        currency: "Moneda",
        defaultTaxRate: "Tasa de impuestos",
        unit: "Dependencia",
      },
    },
  },

  // Order add payment
  orderAddPayment: {
    post: {
      title: "Agregar pago",
      titleShort: "Agregar pago",
      description: "Registrar un pago contra una orden abierta.",
      widget: {
        fullyPaid: "Totalmente pagado",
        backToOrder: "Regresar al orden",
        amountDue: "Monto previsto",
        changeLabel: "Cambiar",
        changeHint: "Volver al cliente",
        addAnotherPayment: "Añadir otro pago",
      },
      orderId: { label: "Orden ID", description: "Orden de pago" },
      method: {
        label: "Método de pago",
        description: "Cómo paga el cliente",
        placeholder: "Seleccionar método",
      },
      amount: {
        label: "Monto",
        description: "Cantidad licitada",
        placeholder: "0.00",
      },
      change: {
        label: "Cambiar",
        description: "Cambio devuelto al cliente",
        placeholder: "0.00",
      },
      reference: {
        label: "Referencia",
        description:
          "Código de autorización de tarjetas o referencia de transferencia",
      },
      accountNodeId: {
        label: "Nodo de cuenta",
        description:
          "Nodo de la cuenta receptora (superior predeterminado de la terminal)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para añadir pagos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden",
        },
        conflict: {
          title: "Orden No Abierto",
          description: "No se pueden añadir pagos a una orden no abierta",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para registrar el pago",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Orden No encontrado",
          description: "El orden no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Pago registrado",
        description: "Pagos efectuados con arreglo a la orden",
      },
      response: {
        id: "Pago ID",
        method: "Método",
        amount: "Monto",
        change: "Cambiar",
        totalPaid: "Total pagado",
        outstanding: "Destacados",
      },
    },
  },
};
