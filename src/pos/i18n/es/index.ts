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
  workflow: {
    backToSessionOrders: "Volver a los pedidos de la sesión",
    receiptTitle: "Recibo",
    amountDue: "Importe pendiente",
    ledgerCurrencyMismatch:
      "La moneda del pedido difiere de la moneda contable. Usa una caja o un pedido en la moneda contable antes de cobrar.",
    postingUnavailable:
      "No se pudo contabilizar la venta. Comprueba la moneda de la empresa, el periodo abierto y las cuentas.",
    cashCurrencyMismatch:
      "El efectivo debe usar la moneda de la caja. Elige otro método de pago para este pedido.",
    tenderMinorUnits: "Introduce importes en céntimos enteros.",
    legacyTenderReview:
      "Un pago anterior incluye una fracción de céntimo. Revisa el pago antes de cobrar otro importe.",
    legacyTenderRecorded:
      "Este pedido conserva los importes originales con cuatro decimales.",
    legacyPostingReview:
      "No se pueden contabilizar los importes con fracciones de céntimo. Revisa el pago original antes de cerrar la venta.",
    viewReceipt: "Ver recibo",
    openDrawer: "Abrir caja",
    warehouse: "Almacén de venta",
    noWarehouse: "Sin almacén asignado",
    chooseCompanyFirst: "Selecciona primero una empresa.",
    warehouseInstruction: "Elige un almacén activo de la empresa seleccionada.",
    stockUnavailable:
      "No hay stock disponible suficiente en el almacén de esta caja. Revisa las cantidades antes de cerrar la venta.",
  },
  dashboard: {
    get: {
      title: "POS Dashboard",
      titleShort: "POS Dashboard",
      description:
        "Resúmenes de terminales, sesiones activas y ventas actuales.",
      widget: {
        title: "Punto de venta",
        subtitle: "Abra una caja, cobre ventas y cierre el turno con arqueo.",
        salesHistory: "Historial de ventas",
        newTill: "Nueva caja",
        kpiSalesToday: "Ventas de hoy",
        kpiSalesCount: "Ventas: {{count}}",
        kpiOpenTills: "Cajas abiertas",
        kpiTillsTotal: "{{active}} activas de {{total}}",
        kpiAverage: "Ticket medio",
        kpiRefunds: "Reembolsos de hoy",
        kpiRefundsCount: "Reembolsos: {{count}}",
        tillsTitle: "Cajas",
        manageTills: "Gestionar cajas",
        emptyTitle: "Aún no hay cajas",
        emptyMessage: "Añada una caja para vender en el mostrador.",
        createTill: "Añadir caja",
        tillSelling: "Vendiendo",
        tillReady: "Lista",
        tillInactive: "Inactiva",
        openRegister: "Abrir pantalla de caja",
        openTill: "Abrir caja",
        closeTill: "Cerrar caja",
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
        refundsToday: "Reembolsos de hoy",
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
      title: "Nueva caja",
      titleShort: "Nueva caja",
      description:
        "Añade una caja a una empresa: nombre, moneda, cuenta de caja y almacén.",
      widget: {
        title: "Nueva caja",
        subtitle:
          "Una caja vende en una moneda, contabiliza el efectivo en una cuenta y saca stock de un almacén.",
        subtitleCompany:
          "Nueva caja para {{company}}. Vende en una moneda y contabiliza el efectivo en una cuenta.",
        back: "Volver",
        backToList: "Todas las cajas",
        openTill: "Abrir caja",
        cancel: "Cancelar",
        submit: "Crear caja",
        none: "Ninguno",
        sectionTill: "Caja",
        sectionMoney: "Dinero",
        sectionMoneyHint:
          "La moneda de venta y la cuenta que recibe el efectivo.",
        sectionStock: "Stock",
        sectionStockHint:
          "Las ventas cerradas descuentan stock de este almacén. Déjalo vacío si solo vendes servicios.",
        defaultCashAccount: "Cuenta de caja predeterminada de la empresa",
        noWarehouse: "Sin control de stock",
        chooseCompanyFirst: "Elige primero una empresa.",
      },
      companyId: {
        label: "Empresa",
        description: "La empresa dueña de la caja",
      },
      name: {
        label: "Nombre",
        description: "Aparece en la tarjeta de la caja y en los tickets",
        placeholder: "Mostrador principal",
      },
      location: {
        label: "Ubicación",
        description: "Dónde está la caja. Opcional.",
        placeholder: "Planta baja",
      },
      currency: {
        label: "Moneda",
        description: "Cada venta en esta caja usa esta moneda",
        placeholder: "Elige una moneda",
      },
      cashAccountNodeId: {
        label: "Cuenta de caja",
        description: "El efectivo cobrado aquí se contabiliza en esta cuenta.",
        invalid: "Elige una cuenta de caja o banco imputable de esta empresa.",
      },
      warehouseId: {
        label: "Almacén",
        description: "Al cerrar una venta, el stock sale de este almacén.",
      },
      errors: {
        validation: {
          title: "Revisa la caja",
          description: "Pon un nombre y elige una moneda.",
        },
        unauthorized: {
          title: "Inicia sesión",
          description: "Inicia sesión para añadir cajas.",
        },
        forbidden: {
          title: "Solo administradores",
          description: "Solo los administradores de la empresa añaden cajas.",
        },
        conflict: {
          title: "Nombre en uso",
          description: "Ya existe una caja con este nombre.",
        },
        server: {
          title: "Caja no creada",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        unknown: {
          title: "Caja no creada",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        network: {
          title: "Sin conexión",
          description: "Revisa tu conexión e inténtalo de nuevo.",
        },
        notFound: {
          title: "No encontrado",
          description: "La empresa o el almacén no existe.",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Termina o descarta tus cambios primero.",
        },
      },
      success: {
        title: "Caja creada",
        description: "Cuenta el fondo y ábrela para empezar a vender.",
      },
      response: {
        id: "Caja",
        name: "Nombre",
        companyId: "Empresa",
        currency: "Moneda",
        isActive: "Activa",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Cajas",
      titleShort: "Cajas",
      description:
        "Todas las cajas de tus empresas y cuáles están vendiendo ahora.",
      widget: {
        title: "Cajas",
        pickTitle: "Elige una caja",
        subtitle: "Cada caja de tu mostrador y si está vendiendo ahora.",
        summary: "Cajas: {{total}} · Vendiendo: {{selling}}",
        newTill: "Nueva caja",
        createTill: "Añadir una caja",
        emptyTitle: "Aún no hay cajas",
        emptyMessage: "Añade una caja para vender en el mostrador.",
        selling: "Vendiendo",
        ready: "Lista",
        inactive: "Inactiva",
        openRegister: "Abrir pantalla de caja",
        openTill: "Abrir caja",
        loading: "Cargando cajas",
        back: "Volver",
      },
      companyId: {
        label: "Empresa",
        description: "Solo las cajas de esta empresa",
      },
      terminalId: {
        label: "Caja",
        description: "Solo esta caja",
      },
      errors: {
        validation: {
          title: "Revisa el filtro",
          description: "La empresa o la caja no es válida.",
        },
        unauthorized: {
          title: "Inicia sesión",
          description: "Inicia sesión para ver las cajas.",
        },
        forbidden: {
          title: "Sin acceso",
          description: "No eres miembro de esta empresa.",
        },
        conflict: {
          title: "Conflicto",
          description: "Los datos cambiaron. Recarga e inténtalo de nuevo.",
        },
        server: {
          title: "Cajas no cargadas",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        unknown: {
          title: "Cajas no cargadas",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        network: {
          title: "Sin conexión",
          description: "Revisa tu conexión e inténtalo de nuevo.",
        },
        notFound: {
          title: "No encontrado",
          description: "Esta empresa no existe.",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Termina o descarta tus cambios primero.",
        },
      },
      success: {
        title: "Cajas cargadas",
        description: "Tus cajas están al día.",
      },
      response: {
        id: "Caja",
        name: "Nombre",
        location: "Ubicación",
        currency: "Moneda",
        isActive: "Activa",
        companyName: "Empresa",
        openSessionId: "Turno abierto",
        createdAt: "Creada",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Abrir caja",
      titleShort: "Abrir caja",
      description:
        "Empieza un turno en una caja con el fondo contado en el cajón.",
      widget: {
        title: "Abrir caja",
        subtitle: "Cuenta el efectivo del cajón y empieza el turno.",
        back: "Volver",
        cancel: "Cancelar",
        loadingTill: "Cargando caja",
        selling: "Vendiendo",
        ready: "Lista",
        inactive: "Inactiva",
        alreadyOpen: "Esta caja ya está abierta. Sigue vendiendo.",
        openRegister: "Abrir pantalla de caja",
        floatHint:
          "El fondo de caja es el cambio con el que empiezas. Al cerrar, el recuento se compara con él.",
      },
      terminalId: {
        label: "Caja",
        description: "La caja que se abre",
      },
      openingFloat: {
        label: "Fondo inicial",
        description: "Efectivo en el cajón al empezar el turno",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Revisa el fondo inicial",
          description: "Indica el efectivo del cajón, cero o más.",
        },
        unauthorized: {
          title: "Inicia sesión",
          description: "Inicia sesión para abrir una caja.",
        },
        forbidden: {
          title: "Sin acceso",
          description: "No eres miembro de la empresa de esta caja.",
        },
        conflict: {
          title: "Caja ya abierta",
          description: "Esta caja ya tiene un turno abierto.",
        },
        server: {
          title: "Caja no abierta",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        unknown: {
          title: "Caja no abierta",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        network: {
          title: "Sin conexión",
          description: "Revisa tu conexión e inténtalo de nuevo.",
        },
        notFound: {
          title: "Caja no encontrada",
          description: "Esta caja no existe.",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Termina o descarta tus cambios primero.",
        },
      },
      success: {
        title: "Caja abierta",
        description: "El turno ha empezado. Cobra la primera venta.",
      },
      response: {
        id: "Turno",
        terminalId: "Caja",
        openedAt: "Abierta",
        status: "Estado",
        openingFloat: "Fondo inicial",
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
        backToTerminals: "Volver",
        sessionSummary: "Resumen de la sesión",
        terminal: "Terminal",
        openedAt: "Abierto en",
        orderCount: "Pedidos: {{count}}",
        sessionRevenue: "Ingresos generados",
        floatHint: "Cuente todos los billetes y monedas del cajón.",
        reconciliation: "Fin del día",
        sessionReady: "Sesión",
        active: "Activa",
        openingFloat: "Fondo inicial",
        cashSales: "Ventas en efectivo",
        expectedClosingFloat: "Esperado en caja",
        actualClosingFloat: "Efectivo contado",
        variance: "Diferencia",
        reconciliationTitle: "Arqueo de caja",
        title: "Cerrar caja",
        subtitle: "{{terminal}} · abierta desde las {{time}}",
        cashRefunds: "Reembolsos en efectivo",
        balanced: "Caja cuadrada",
        over: "Sobran {{amount}}",
        short: "Faltan {{amount}}",
        openSaleBlocks:
          "Hay una venta abierta en esta caja. Termínela o anúlela en la pantalla de caja y después cierre la caja.",
        backToPos: "Volver al TPV",
      },
      sessionId: {
        label: "Período de sesiones ID",
        description: "Período de sesiones a fin de concluir",
      },
      closingFloat: {
        label: "Efectivo contado",
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
        cashRefundsTotal: "Reembolsos en efectivo",
        openingFloat: "Flota de apertura",
        variance: "Diferencia",
        orderCount: "Cuenta de orden",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Resumen del turno",
      titleShort: "Turno",
      description:
        "Un turno en una caja: cuándo empezó, quién vendió y cuánto debe haber en el cajón.",
      widget: {
        title: "Turno",
        back: "Volver",
        loading: "Cargando turno",
        selling: "Vendiendo",
        closed: "Cerrada",
        subtitleOpen: "Abierta desde {{time}}",
        subtitleClosed: "Cerrada el {{time}}",
        sales: "Ventas",
        closeTill: "Cerrar caja",
        openRegister: "Abrir pantalla de caja",
        drawerTitle: "Cajón",
        variance: "Diferencia",
        closeSession: "Cerrar caja",
        newOrder: "Nuevo pedido",
      },
      sessionId: {
        label: "Turno",
        description: "El turno que se muestra",
      },
      errors: {
        validation: {
          title: "Revisa el turno",
          description: "Este enlace de turno no es válido.",
        },
        unauthorized: {
          title: "Inicia sesión",
          description: "Inicia sesión para ver los turnos.",
        },
        forbidden: {
          title: "Sin acceso",
          description: "No eres miembro de la empresa de esta caja.",
        },
        conflict: {
          title: "Conflicto",
          description: "Los datos cambiaron. Recarga e inténtalo de nuevo.",
        },
        server: {
          title: "Turno no cargado",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        unknown: {
          title: "Turno no cargado",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        network: {
          title: "Sin conexión",
          description: "Revisa tu conexión e inténtalo de nuevo.",
        },
        notFound: {
          title: "Turno no encontrado",
          description: "Este turno no existe.",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Termina o descarta tus cambios primero.",
        },
      },
      success: {
        title: "Turno cargado",
        description: "Las cifras del cajón están al día.",
      },
      response: {
        id: "Turno",
        terminalId: "Caja",
        terminalName: "Caja",
        companyName: "Empresa",
        cashierUserId: "Cajero",
        cashierName: "Cajero",
        status: "Estado",
        openedAt: "Abierta",
        closedAt: "Cerrada",
        openingFloat: "Fondo inicial",
        closingFloat: "Contado al cerrar",
        cashSalesTotal: "Ventas en efectivo",
        cashRefundsTotal: "Reembolsos en efectivo",
        expectedCash: "Esperado en el cajón",
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
      mergeWithLine: {
        label: "Sumar a la línea existente",
        description:
          "Aumenta la cantidad de la línea ya presente para este producto",
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
      quantity: {
        label: "Cantidad a quitar",
        description: "Déjelo vacío para quitar toda la línea",
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
        refund: "Reembolsar",
        continueInRegister: "Continuar en caja",
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
        title: "Ventas",
        subtitleAll: "Todas las ventas en caja, primero las más recientes.",
        subtitleSession: "Ventas de este turno, primero las más recientes.",
        openRegister: "Abrir pantalla de caja",
        colSale: "Venta",
        colTime: "Hora",
        colStatus: "Estado",
        colTotal: "Total",
        count: "Ventas: {{count}}",
        newOrder: "Nuevo orden",
        empty: "Aún no hay ventas",
        emptyHint: "Las ventas cobradas en caja aparecen aquí con su ticket.",
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
      companyId: {
        label: "Empresa",
        description: "Empresa cuyas ventas en caja se muestran",
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
        terminalName: "Caja",
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
      titleShort: "Productos",
      description:
        "Encuentra productos del catálogo por nombre o SKU, con precio e IVA.",
      widget: {
        title: "Productos",
        pickTitle: "Elige un producto",
        subtitle:
          "Busca por nombre o SKU. Un código de barras escaneado da con el producto exacto.",
        back: "Volver",
        loading: "Cargando productos",
        emptyTitle: "Aún no hay productos",
        emptyMessage:
          "Los productos de tu catálogo aparecen aquí con su precio.",
        noMatchTitle: "Nada coincide con «{{query}}»",
        noMatchMessage: "Revisa la ortografía o busca por SKU.",
        vat: "IVA {{rate}}",
        noVat: "Sin IVA",
        perUnit: "por {{unit}}",
      },
      companyId: {
        label: "Empresa",
        description: "Solo los productos de esta empresa",
      },
      query: {
        label: "Buscar productos",
        description: "Nombre del producto o SKU. Déjalo vacío para explorar.",
        placeholder: "Nombre o SKU",
      },
      currency: {
        label: "Moneda",
        description: "Solo productos con precio en esta moneda",
      },
      page: {
        label: "Página",
        description: "Número de página, desde 1",
      },
      pageSize: {
        label: "Por página",
        description: "Resultados por página, hasta 50",
      },
      errors: {
        validation: {
          title: "Revisa la búsqueda",
          description: "Hasta 120 caracteres.",
        },
        unauthorized: {
          title: "Inicia sesión",
          description: "Inicia sesión para buscar productos.",
        },
        forbidden: {
          title: "Sin acceso",
          description: "No eres miembro de esta empresa.",
        },
        conflict: {
          title: "Conflicto",
          description: "Los datos cambiaron. Recarga e inténtalo de nuevo.",
        },
        server: {
          title: "Búsqueda fallida",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        unknown: {
          title: "Búsqueda fallida",
          description: "Algo salió mal. Inténtalo de nuevo.",
        },
        network: {
          title: "Sin conexión",
          description: "Revisa tu conexión e inténtalo de nuevo.",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontraron productos.",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Termina o descarta tus cambios primero.",
        },
      },
      success: {
        title: "Productos encontrados",
        description: "Los resultados están al día.",
      },
      response: {
        id: "Producto",
        name: "Nombre",
        sku: "SKU",
        type: "Tipo",
        basePrice: "Precio",
        currency: "Moneda",
        defaultTaxRate: "Tipo de IVA",
        unit: "Unidad",
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
