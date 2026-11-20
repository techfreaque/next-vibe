import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compras",
  tags: {
    purchasing: "Compras",
    vendor: "Vendor",
    order: "Pedido de compra",
    receipt: "Receipt",
    create: "Crear",
    list: "Lista",
    get: "¡Vamos!",
    update: "Actualización",
    deactivate: "Desactivar",
    send: "Enviar",
    confirm: "Confirmar",
    receive: "Recibido",
    cancel: "Cancelar",
    convertToBill: "Convertir en Bill",
    addLine: "Añadir línea",
    removeLine: "Quitar la línea",
  },
  endpointCategories: {
    purchasing: "Compras",
    vendors: "Proveedores",
    purchaseOrders: "Pedidos de compra",
    purchasingOrders: "Pedidos de compra",
    purchasingVendors: "Proveedores",
  },
  enums: {
    poStatus: {
      draft: "Proyecto",
      sent: "Sent",
      confirmed: "Confirmado",
      partiallyReceived: "Recibido parcialmente",
      received: "Recibidos",
      billed: "Billed",
      cancelled: "Cancelada",
    },
  },

  // Vendor create
  vendorCreate: {
    post: {
      title: "Crear proveedor",
      titleShort: "Crear proveedor",
      description: "Registre un nuevo proveedor para su empresa.",
      widget: {
        back: "Atrás",
        viewVendor: "Vendedor abierto",
        createAnother: "Crear otro",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Revise todos los campos e inténtelo de nuevo",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para crear proveedores",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Necesitas un Miembro o un rol superior",
        },
        conflict: {
          title: "Código ya existe",
          description: "Un vendedor con este código ya existe",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to create vendedor. try again",
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
        title: "Vendor Creado",
        description: "Vendor registrado con éxito",
      },
      response: {
        id: "Vendor ID",
        name: "Nombre",
        code: "Código",
        email: "Correo electrónico",
        isActive: "Activa",
        createdAt: "Creado",
      },
    },
    companyId: {
      label: "Company",
      description: "Empresa este vendedor pertenece a",
      placeholder: "Company UUID",
    },
    name: {
      label: "Nombre del vendedor",
      description: "Nombre jurídico del proveedor",
      placeholder: "Acme GmbH",
    },
    code: {
      label: "Código",
      description: "Identificador interno corto (opcional)",
      placeholder: "ACM-001",
    },
    email: {
      label: "Correo electrónico",
      description: "Correo electrónico de contacto con el vendedor",
      placeholder: "orders@acme.com",
    },
    phone: {
      label: "Teléfono",
      description: "Teléfono de contacto del vendedor",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "Sitio web",
      description: "Sitio web de proveedores",
      placeholder: "https://acme.com",
    },
    vatNumber: {
      label: "Número de VAT",
      description: "Número de registro del vendedor VAT",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Impuesto ID",
      description: "Número de identificación fiscal de proveedores",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Línea de dirección 1",
      description: "Calle y número",
      placeholder: "123 Main Street",
    },
    addressLine2: {
      label: "Línea de dirección 2",
      description: "Suite, piso, etc.",
      placeholder: "Planta 2",
    },
    city: { label: "Ciudad", description: "Ciudad", placeholder: "Berlin" },
    region: {
      label: "Región / Estado",
      description: "Región o estado",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "Código postal",
      description: "Código postal o ZIP",
      placeholder: "10115",
    },
    country: {
      label: "País",
      description: "Código del país (ISO 3166 -1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Moneda por defecto",
      description: "Moneda para pedidos de compra a este proveedor",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Términos de pago (días)",
      description: "Términos de pago predeterminados en días",
      placeholder: "30",
    },
    notes: {
      label: "Notas",
      description: "Notas internas sobre este proveedor",
      placeholder: "Preferente proveedor para electrónica",
    },
  },

  // Vendor list
  vendorList: {
    get: {
      title: "Proveedores",
      titleShort: "Proveedores",
      description: "Lista a todos los vendedores para una empresa.",
      widget: {
        back: "Atrás",
        active: "Activa",
        inactive: "Inactivo",
        total: "total",
        createVendor: "Nuevo proveedor",
        empty: "No hay proveedores configurados. Añadir uno para empezar.",
        vatLabel: "VAT",
        vatPrefix: "VAT:",
        paymentTerms: "Días netos de {{days}}",
        paymentTermsPrefix: "Cifra",
        paymentTermsSuffix: "d",
        loading: "Cargando…",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en la lista de proveedores",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to list vendedores",
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
        title: "Vendedores cargados",
        description: "Lista de proveedores recuperada",
      },
      response: {
        id: "Vendor ID",
        name: "Nombre",
        code: "Código",
        email: "Correo electrónico",
        vatNumber: "VAT",
        defaultCurrency: "Moneda",
        defaultPaymentTermsDays: "Condiciones de pago",
        isActive: "Activa",
        createdAt: "Creado",
      },
    },
    companyId: {
      label: "Company",
      description: "Empresa para listar proveedores",
    },
  },

  // Vendor get
  vendorGet: {
    get: {
      title: "Vendedor",
      titleShort: "Detalles del vendedor",
      description: "Recuperar detalles completos para un vendedor.",
      widget: {
        back: "Atrás",
        edit: "Editar vendedor",
        createOrder: "Nueva Orden de Compra",
        viewOrders: "Ver pedidos",
        deactivate: "Desactivar",
        select: "Seleccione el proveedor",
      },
      vendorId: { label: "Vendor ID", description: "Vendor para recuperar" },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Vendedor inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver proveedores",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este proveedor",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Fallado para cargar el proveedor",
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
          title: "Vendor no encontrado",
          description: "El vendedor no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Vendor cargado",
        description: "Detalles del vendedor recuperados",
      },
      response: {
        id: "Vendor ID",
        companyId: "Company ID",
        name: "Nombre",
        code: "Código",
        email: "Correo electrónico",
        phone: "Teléfono",
        website: "Sitio web",
        vatNumber: "Número de VAT",
        taxId: "Impuesto ID",
        addressLine1: "Dirección",
        addressLine2: "Línea de dirección 2",
        city: "Ciudad",
        region: "Región",
        postalCode: "Código postal",
        country: "País",
        defaultCurrency: "Moneda por defecto",
        defaultPaymentTermsDays: "Términos de pago (días)",
        isActive: "Activa",
        notes: "Notas",
        createdAt: "Creado",
        updatedAt: "Actualizado",
      },
    },
  },

  // Vendor update
  vendorUpdate: {
    patch: {
      title: "Actualizar el proveedor",
      titleShort: "Actualizar el proveedor",
      description: "Actualice los detalles del vendedor.",
      widget: {
        backToVendor: "Regreso al vendedor",
        viewVendor: "Ver proveedor",
      },
      vendorId: { label: "Vendor ID", description: "Vendor para actualizar" },
      name: {
        label: "Nombre del vendedor",
        description: "Nombre jurídico del proveedor",
        placeholder: "Acme GmbH",
      },
      code: {
        label: "Código",
        description: "Identificador interno corto",
        placeholder: "ACM-001",
      },
      email: {
        label: "Correo electrónico",
        description: "Correo electrónico de contacto con el vendedor",
        placeholder: "orders@acme.com",
      },
      phone: {
        label: "Teléfono",
        description: "Teléfono de contacto del vendedor",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "Sitio web",
        description: "Sitio web de proveedores",
        placeholder: "https://acme.com",
      },
      vatNumber: {
        label: "Número de VAT",
        description: "Número de registro del vendedor VAT",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Impuesto ID",
        description: "Número de identificación fiscal",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Línea de dirección 1",
        description: "Calle y número",
        placeholder: "123 Main Street",
      },
      addressLine2: {
        label: "Línea de dirección 2",
        description: "Suite, piso, etc.",
        placeholder: "Planta 2",
      },
      city: { label: "Ciudad", description: "Ciudad", placeholder: "Berlin" },
      region: {
        label: "Región / Estado",
        description: "Región o estado",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "Código postal",
        description: "Código postal o ZIP",
        placeholder: "10115",
      },
      country: {
        label: "País",
        description: "Código del país (ISO 3166 -1 alpha-2)",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Moneda por defecto",
        description: "Moneda para pedidos de compra a este proveedor",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Términos de pago (días)",
        description: "Términos de pago predeterminados en días",
        placeholder: "30",
      },
      notes: {
        label: "Notas",
        description: "Notas internas sobre este proveedor",
        placeholder: "Preferente proveedor",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para actualizar proveedores",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este proveedor",
        },
        conflict: {
          title: "Code Conflict",
          description: "Ese código de venta ya está tomado",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para actualizar el proveedor",
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
          title: "Vendor no encontrado",
          description: "El vendedor no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Vendor Actualizado",
        description: "Vendor actualizado con éxito",
      },
      response: {
        id: "Vendor ID",
        name: "Nombre",
        isActive: "Activa",
        updatedAt: "Actualizado",
      },
    },
  },

  // Vendor deactivate
  vendorDeactivate: {
    post: {
      title: "Deactivar el vendedor",
      titleShort: "Desactivar",
      description:
        "Marcar un vendedor como inactivo. Las órdenes de compra existentes no se ven afectadas.",
      vendorId: { label: "Vendor ID", description: "Vendor para desactivar" },
      widget: {
        warning:
          "Esto desactivará el vendedor. Las órdenes de compra existentes no se verán afectadas.",
        backToList: "Volver a los proveedores",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Vendedor inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para desactivar los proveedores",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este proveedor",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "No desactivar el vendedor",
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
          title: "Vendor no encontrado",
          description: "El vendedor no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Vendor desactivado",
        description: "El vendedor está ahora inactivo",
      },
      response: {
        id: "Vendor ID",
        isActive: "Activa",
      },
    },
  },

  // PO create
  orderCreate: {
    post: {
      title: "Crear Pedido de Compra",
      titleShort: "Crear orden",
      description: "Crear un nuevo pedido de compra en Borrador de estado.",
      errors: {
        validation: {
          title: "Error de validación",
          description: "Revise todos los campos e inténtelo de nuevo",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicia sesión para crear pedidos de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Necesitas un Miembro o un rol superior",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description:
            "Fallado para crear el pedido de compra. inténtelo de nuevo",
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
          description: "Vendedor o empresa no encontrada",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Pedido de compra Creado",
        description: "Orden de compra creado en Borrador de estado",
      },
      widget: {
        browseVendors: "Explorar proveedores",
        browseWarehouses: "Navega los Almacenes",
        viewOrder: "Orden de compra abierta",
        backToList: "Volver a la lista",
      },
      response: {
        id: "Orden de compra ID",
        poNumber: "Número de pedido de compra",
        status: "Situación",
        subtotal: "Subtotal",
        taxAmount: "Impuestos",
        total: "Total",
        createdAt: "Creado",
      },
    },
    companyId: {
      label: "Company",
      description: "Empresa que emite este pedido de compra",
      placeholder: "Company UUID",
    },
    vendorId: {
      label: "Vendor",
      description: "Proveedor que recibe este pedido de compra",
      placeholder: "Vendor UUID",
    },
    currency: {
      label: "Moneda",
      description: "Moneda del pedido de compra",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "Entrega esperada",
      description: "Fecha prevista de entrega (opcional)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Almacén de entrega",
      description: "Almacén para recibir bienes (opcional)",
      placeholder: "Warehouse UUID",
    },
    notes: {
      label: "Notas",
      description: "Notas internas para esta orden de compra",
      placeholder: "Orden de rubor",
    },
    lines: {
      label: "Temas de línea",
      description: "Productos y cantidades a pedido",
    },
    lineDescription: {
      label: "Descripción",
      description: "Descripción del artículo",
      placeholder: "Sillas de oficina",
    },
    lineProductId: {
      label: "Producto ID",
      description: "Producto de catálogo (opcional)",
      placeholder: "Producto UUID",
    },
    lineQuantity: {
      label: "Cantidad",
      description: "Número de unidades",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Precio unitario",
      description: "Precio por unidad",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "Tasa de impuestos",
      description: "Tasa de impuestos como decimal (por ejemplo 0.19 = 19%)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "Ordenar orden",
      description: "Orden de visualización de esta línea",
      placeholder: "0",
    },
  },

  // PO list
  orderList: {
    get: {
      title: "Pedidos de compra",
      titleShort: "Pedidos",
      description:
        "Listar pedidos de compra para una empresa con filtro de estado opcional.",
      widget: {
        newOrder: "Nueva Orden de Compra",
        empty: "No hay órdenes de compra encontradas.",
        statusAll: "Todos",
        orders: "órdenes de compra",
        order: "orden de compra",
        colPoVendor: "Pedido de compra / proveedor",
        colDate: "Fecha",
        colAmount: "Monto",
        colStatus: "Situación",
        deliveryArrow: "→",
        overdue: "atrasado",
        actionNeeded: "órdenes de compra necesitan atención",
        back: "Atrás",
        loading: "Cargando…",
      },
      companyId: {
        label: "Company",
        description: "Compañía para listar pedidos de compra para",
      },
      status: {
        label: "Filtro de estado",
        description: "Filtro por estado del pedido de compra (opcional)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en la lista de pedidos de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "No listar pedidos de compra",
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
        title: "Pedidos de compra cargados",
        description: "Lista de pedido de compra recuperada",
      },
      response: {
        id: "Orden de compra ID",
        poNumber: "Número de pedido de compra",
        vendorId: "Vendor",
        vendorName: "Vendor",
        status: "Situación",
        currency: "Moneda",
        total: "Total",
        expectedDeliveryDate: "Entrega esperada",
        createdAt: "Creado",
      },
    },
  },

  // PO get
  orderGet: {
    get: {
      title: "Obtener la orden de compra",
      titleShort: "Detalles del pedido",
      description:
        "Recuperar una orden de compra con todas las líneas y la historia de la recepción.",
      widget: {
        back: "Atrás",
        send: "Enviar a un vendedor",
        confirm: "Mark confirmó",
        receive: "Recibir bienes",
        convertToBill: "Convertirse en factura",
        viewBill: "Ver la cuenta",
        addLine: "+ Agregar línea",
        cancel: "Cancela la orden",
        edit: "Editar",
        select: "Seleccione el pedido de compra",
        linesHeader: "Temas de línea",
        receiptsHeader: "Historia de los recreos",
        noLines: "No hay artículos de línea.",
        noReceipts: "Todavía no hay recibos.",
        colDescription: "Descripción",
        colQtyPrice: "Qty × precio",
        colLineTotal: "Total",
        delivery: "Entrega esperada:",
        overdue: "(debido)",
        received: "recibidos",
        billCreated: "La factura AP creada a partir de esta orden de compra.",
        vendorLabel: "Vendor:",
      },
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para recuperar",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden de compra inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver las órdenes de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "No se puede cargar el pedido de compra",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Pedido de compra cargado",
        description: "Detalles del pedido de compra recuperados",
      },
      response: {
        id: "Orden de compra ID",
        companyId: "Company ID",
        vendorId: "Vendor ID",
        poNumber: "Número de pedido de compra",
        status: "Situación",
        currency: "Moneda",
        expectedDeliveryDate: "Entrega esperada",
        deliveryWarehouseId: "Almacén de entrega",
        notes: "Notas",
        subtotal: "Subtotal",
        taxAmount: "Impuestos",
        total: "Total",
        billId: "Bill ID",
        confirmedAt: "Confirmado",
        receivedAt: "Recibidos",
        createdAt: "Creado",
        updatedAt: "Actualizado",
        lines: "Líneas",
        lineId: "Línea ID",
        lineProductId: "Producto ID",
        lineDescription: "Descripción",
        lineQuantity: "Qty",
        lineUnitPrice: "Precio unitario",
        lineTaxRate: "Tasa de impuestos",
        lineTaxAmount: "Impuestos",
        lineTotal: "Total",
        lineQuantityReceived: "Recibidos",
        receipts: "Recibos",
        receiptId: "Receipt ID",
        receiptReceivedAt: "Recibido",
        receiptNotes: "Notas",
      },
    },
  },

  // PO update
  orderUpdate: {
    patch: {
      title: "Orden de compra actualizada",
      titleShort: "Orden de actualización",
      description: "Editar un Borrador de pedido de compra. campos y líneas.",
      widget: {
        backToPO: "Volver a la orden de compra",
      },
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para actualizar",
      },
      vendorId: {
        label: "Vendor",
        description: "Vendedor de cambio (opcional)",
        placeholder: "Vendor UUID",
      },
      currency: {
        label: "Moneda",
        description: "Moneda del pedido de compra",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "Entrega esperada",
        description: "Fecha prevista de entrega",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Almacén de entrega",
        description: "Almacén para recibir mercancías",
        placeholder: "Warehouse UUID",
      },
      notes: {
        label: "Notas",
        description: "Notas internas para esta orden de compra",
        placeholder: "Orden de rubor",
      },
      lines: {
        label: "Temas de línea",
        description: "Sustitúyase todos los elementos de línea (opcional)",
      },
      lineDescription: {
        label: "Descripción",
        description: "Descripción del artículo",
        placeholder: "Sillas de oficina",
      },
      lineProductId: {
        label: "Producto ID",
        description: "Producto de catálogo (opcional)",
        placeholder: "Producto UUID",
      },
      lineQuantity: {
        label: "Cantidad",
        description: "Número de unidades",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Precio unitario",
        description: "Precio por unidad",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "Tasa de impuestos",
        description: "Tasa de impuestos como decimal",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "Ordenar orden",
        description: "Orden de visualización de esta línea",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para actualizar las órdenes de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "No es un borrador",
          description: "Sólo los pedidos de compra pueden ser editados",
        },
        server: {
          title: "Error del servidor",
          description: "No se ha actualizado el pedido de compra",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Orden de compra Actualizado",
        description: "Orden de compra actualizada",
      },
      response: {
        id: "Orden de compra ID",
        status: "Situación",
        subtotal: "Subtotal",
        taxAmount: "Impuestos",
        total: "Total",
        updatedAt: "Actualizado",
      },
    },
  },

  // PO send
  orderSend: {
    post: {
      title: "Enviar Pedido de Compra",
      titleShort: "Enviar pedido",
      description: "Marcar el pedido de compra como se envió al vendedor.",
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para enviar",
      },
      widget: {
        back: "Atrás",
        backToPO: "Volver a la orden de compra",
        warning:
          "Enviar marcas esta orden de compra como enviado al vendedor. Cambios de estado de Borrador a Sent.",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden de compra inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para enviar pedidos de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "No es un borrador",
          description: "Sólo se pueden enviar órdenes de compra",
        },
        server: {
          title: "Error del servidor",
          description: "No se puede enviar el pedido de compra",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Pedido de compra enviado",
        description: "Orden de compra marcado como enviado",
      },
      response: {
        id: "Orden de compra ID",
        status: "Situación",
      },
    },
  },

  // PO confirm
  orderConfirm: {
    post: {
      title: "Confirme la orden de compra",
      titleShort: "Confirme la orden",
      description:
        "El vendedor ha confirmado la orden de compra - marca como Confirmado.",
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para confirmar",
      },
      widget: {
        back: "Atrás",
        backToPO: "Volver a la orden de compra",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden de compra inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para confirmar las órdenes de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "Estado inválido",
          description: "Sólo se pueden confirmar órdenes de compra enviadas",
        },
        server: {
          title: "Error del servidor",
          description: "No confirma la orden de compra",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Orden de compra confirmada",
        description: "Orden de compra marcada como confirmada",
      },
      response: {
        id: "Orden de compra ID",
        status: "Situación",
        confirmedAt: "Confirmado en",
      },
    },
  },

  // PO receive
  orderReceive: {
    post: {
      title: "Recibir bienes",
      titleShort: "Recibir bienes",
      description:
        "Registro de recibo de mercancías contra una orden de compra. Crea movimientos de acciones.",
      widget: {
        backToPO: "Volver a la orden de compra",
      },
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para recibir contra",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Almacén que recibe las mercancías (opcional)",
        placeholder: "Warehouse UUID",
      },
      notes: {
        label: "Notas",
        description: "Notas sobre esta entrega",
        placeholder: "Nota de entrega #12345",
      },
      lines: {
        label: "Artículos recibidos",
        description: "Cuantidades recibidas para cada línea",
      },
      linePoLineId: {
        label: "Línea ID",
        description: "Línea de pedido de compra",
      },
      lineQuantityReceived: {
        label: "Cantidad recibida",
        description: "Cantidad recibida para esta línea",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Ver todos los campos y cantidades",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para recibir bienes",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "Estado inválido",
          description:
            "La orden de compra debe ser confirmada o enviada para recibir mercancías",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado en el registro de recibo",
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
          title: "Orden de compra no encontrado",
          description: "Orden de compra o línea no encontrada",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Mercancías recibidas",
        description: "Receipt recorded and stock updated",
      },
      response: {
        receiptId: "Receipt ID",
        status: "Estado de la orden de compra",
        receivedAt: "Recibido",
      },
    },
  },

  // PO convert to bill
  orderConvertToBill: {
    post: {
      title: "Convertir en Bill",
      titleShort: "Convertir en Bill",
      description: "Cree una factura AP de esta orden de compra.",
      widget: {
        back: "Atrás",
        viewBill: "Ver la cuenta",
      },
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para convertir",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden de compra inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para crear facturas",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "Ya convertido",
          description: "Esta orden de compra ya se convirtió en una factura",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para crear la cuenta",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Bill Created",
        description: "AP bill creado a partir de la orden de compra",
      },
      response: {
        billId: "Bill ID",
        billNumber: "Número de facturas",
        poId: "Orden de compra ID",
      },
    },
  },

  // PO line add
  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Regresar al orden",
        lineAdded: "Tema de línea añadido",
      },
      title: "Add Line Item",
      titleShort: "Añadir línea",
      description: "Añadir un artículo de línea a una orden de compra.",
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para añadir una línea a",
      },
      productId: {
        label: "Producto",
        description: "Producto de catálogo (opcional)",
        placeholder: "Producto UUID",
      },
      itemDescription: {
        label: "Descripción",
        description: "Descripción del artículo",
        placeholder: "Sillas de oficina",
      },
      quantity: {
        label: "Cantidad",
        description: "Número de unidades",
        placeholder: "10",
      },
      unitPrice: {
        label: "Precio unitario",
        description: "Precio por unidad",
        placeholder: "99.00",
      },
      taxRate: {
        label: "Tasa de impuestos",
        description: "Tasa de impuestos como decimal (por ejemplo 0.19 = 19%)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Revise todos los campos e inténtelo de nuevo",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para añadir elementos de línea",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "No es un borrador",
          description:
            "Sólo se pueden modificar los pedidos de compra de proyectos",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to add line item",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Línea añadida",
        description: "Artículo de línea añadido al pedido de compra",
      },
      response: {
        lineId: "Línea ID",
        subtotal: "Subtotal",
        taxAmount: "Impuestos",
        total: "Total",
      },
    },
  },

  // PO line remove
  orderLineRemove: {
    post: {
      title: "Quitar el artículo de la línea",
      titleShort: "Quitar la línea",
      description: "Retire un artículo de línea de una orden de compra.",
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para eliminar una línea de",
      },
      lineId: {
        label: "Línea ID",
        description: "Artículo de línea para eliminar",
      },
      widget: {
        backToOrder: "Volver al pedido de compra",
        warning:
          "Esto eliminará permanentemente el artículo de la línea del pedido de compra.",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "IDs inválidas",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para eliminar los elementos de línea",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "No es un borrador",
          description:
            "Sólo se pueden modificar los pedidos de compra de proyectos",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to remove line item",
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
          description: "Orden de compra o artículo de línea no encontrado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Línea eliminada",
        description: "Artículo de línea eliminado del pedido de compra",
      },
      response: {
        subtotal: "Subtotal",
        taxAmount: "Impuestos",
        total: "Total",
      },
    },
  },

  // Purchasing Dashboard
  dashboard: {
    get: {
      title: "Información general sobre adquisiciones",
      titleShort: "Sinopsis",
      description:
        "instantánea en vivo de pedidos de compra y actividad del proveedor para su empresa.",
      widget: {
        kpiDraft: "Proyectos",
        kpiConfirmed: "Confirmado",
        kpiAwaitingReceipt: "Awaiting Receipt",
        kpiActiveVendors: "Proveedores activos",
        warningDueThisWeek:
          "Orden de compra {{count}} vence esta semana. fechas de entrega de cheque",
        warningDueThisWeekPlural:
          "Pedidos de compra {{count}} adeudados esta semana. fechas de entrega del cheque",
        navNewPo: "Nueva Orden de Compra",
        navAllPos: "Todas las órdenes de compra",
        navVendors: "Proveedores",
        navNewVendor: "Nuevo proveedor",
        loading: "Cargando…",
      },
      companyId: {
        label: "Company",
        description:
          "Empresa para mostrar estadísticas de compra para (opcional)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver la vista general de la compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to load purchase overview",
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
        title: "Cargadora de pizarra",
        description: "Vista general de compra recuperada",
      },
      response: {
        draftCount: "Proyecto de órdenes de compra",
        confirmedCount: "Órdenes de compra confirmadas",
        awaitingReceiptCount: "Awaiting Receipt",
        activeVendorCount: "Proveedores activos",
        dueThisWeekCount: "Debido a esta semana",
      },
    },
  },

  // PO cancel
  orderCancel: {
    post: {
      title: "Cancelar Orden de compra",
      titleShort: "Cancela la orden",
      description: "Cancele una orden de compra Borrador o enviado.",
      poId: {
        label: "Orden de compra ID",
        description: "Orden de compra para cancelar",
      },
      widget: {
        back: "Atrás",
        warning:
          "Esto cancelará permanentemente el pedido de compra. Sólo se pueden cancelar los pedidos de compra o pedidos enviados.",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Orden de compra inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para cancelar las órdenes de compra",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta orden de compra",
        },
        conflict: {
          title: "No puedo cancelar",
          description:
            "Sólo los pedidos de compra o pedidos enviados pueden ser cancelados",
        },
        server: {
          title: "Error del servidor",
          description: "No se cancela el pedido de compra",
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
          title: "Orden de compra no encontrado",
          description: "La orden de compra no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Orden de compra cancelada",
        description: "Orden de compra cancelada",
      },
      response: {
        id: "Orden de compra ID",
        status: "Situación",
      },
    },
  },
};
