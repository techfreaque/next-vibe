import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Inventario",
  shared: {
    errors: {
      failedToRecordMovement: "Failed to record stock movement",
      failedToApplyMovement: "Failed to apply stock movement",
    },
  },
  tags: {
    inventory: "Inventario",
    warehouse: "Warehouse",
    stock: "Existencias",
    transfer: "Transferencia",
    create: "Crear",
    list: "Lista",
    get: "¡Vamos!",
    update: "Actualización",
    adjust: "Ajuste",
    receive: "Recibido",
    issue: "Cuestión",
    dispatch: "Despacho",
  },
  endpointCategories: {
    inventory: "Inventario",
    warehouses: "Almacenes",
    stock: "Niveles de existencias",
    transfers: "Transferencias",
  },
  enums: {
    movementType: {
      receipt: "Receipt",
      issue: "Cuestión",
      transferIn: "Transferencia en",
      transferOut: "Transferencia",
      adjustment: "Ajuste",
      sale: "Venta",
      return: "Regreso",
    },
    transferStatus: {
      draft: "Proyecto",
      inTransit: "En tránsito",
      received: "Recibidos",
      cancelled: "Cancelada",
    },
  },

  // Warehouse create
  warehouseCreate: {
    post: {
      title: "Crear almacén",
      titleShort: "New Warehouse",
      description: "Registrar un nuevo almacén para una empresa.",
      widget: {
        backToList: "Volver a los almacenes",
        active: "Activa",
        inactive: "Inactivo",
        default: "Predeterminado",
      },
      companyId: {
        label: "Company ID",
        description: "Empresa este almacén pertenece a",
      },
      name: {
        label: "Nombre del almacén",
        description: "Nombre completo del almacén",
        placeholder: "Almacén principal",
      },
      code: {
        label: "Código",
        description: "Identificador corto (por ejemplo. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Dirección",
        description: "Dirección física del almacén",
        placeholder: "123 El carril de almacenamiento",
      },
      isActive: {
        label: "Activa",
        description: "Si este almacén está en funcionamiento",
      },
      isDefault: {
        label: "Default Warehouse",
        description:
          "Establecer como el almacén predeterminado de esta empresa",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para crear almacenes",
        },
        forbidden: {
          title: "Admin Se requiere",
          description: "Sólo los administradores pueden crear almacenes",
        },
        conflict: {
          title: "Código ya existe",
          description: "Un almacén con este código ya existe",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to create warehouse. try again",
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
        title: "Warehouse Created",
        description: "Almacén registrado con éxito",
      },
      response: {
        id: "Warehouse ID",
        name: "Nombre del almacén",
        code: "Código",
        companyId: "Company ID",
        isActive: "Activa",
        isDefault: "Predeterminado",
      },
    },
  },

  // Warehouse list
  warehouseList: {
    get: {
      title: "Almacenes",
      titleShort: "Almacenes",
      description: "Lista todos los almacenes para una empresa.",
      widget: {
        active: "Activa",
        inactive: "Inactivo",
        default: "Predeterminado",
        total: "Almacenes",
        createWarehouse: "New Warehouse",
        empty: "Todavía no hay almacenes.",
        emptyHint:
          "Cree su primer almacén para iniciar el seguimiento del inventario.",
        emptyIcon: "🏭",
        back: "Atrás",
        loading: "Cargando almacenes...",
        load: "Carga",
        viewStock: "Ver Stock",
        selectCompany: "Introduzca una empresa ID para cargar almacenes.",
      },
      companyId: {
        label: "Company ID",
        description: "Empresa para listar almacenes para",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en la lista de almacenes",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to list warehouses",
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
        title: "Almacenes cargados",
        description: "Lista de almacenes recuperados",
      },
      response: {
        id: "Warehouse ID",
        name: "Nombre",
        code: "Código",
        address: "Dirección",
        isActive: "Activa",
        isDefault: "Predeterminado",
        createdAt: "Creado en",
      },
    },
  },

  // Warehouse get
  warehouseGet: {
    get: {
      title: "Ve a Warehouse",
      titleShort: "Warehouse",
      description: "Recuperar detalles para un almacén específico.",
      widget: {
        companyName: "Empresa",
        stockedProducts: "Productos en stock",
        companyInventory: "Inventario de la empresa",
        missingValuation: "Falta el coste",
        details: "Datos del almacén",
        related: "Inventario",
        backToList: "Volver a los almacenes",
        back: "Atrás",
        edit: "Editar el almacén",
        viewStock: "Ver stock",
        select: "Seleccione el almacén",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Almacén para recuperar",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Almacén inválido ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver los almacenes",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este almacén",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to load warehouse",
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
          title: "Warehouse No encontrado",
          description: "El almacén no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Almacén cargado",
        description: "Datos del almacén recuperados",
      },
      response: {
        id: "Warehouse ID",
        companyId: "Company ID",
        name: "Nombre",
        code: "Código",
        address: "Dirección",
        isActive: "Activa",
        isDefault: "Predeterminado",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
      },
    },
  },

  // Warehouse update
  warehouseUpdate: {
    patch: {
      title: "Actualizar Almacén",
      titleShort: "Editar Warehouse",
      description: "Actualizar los detalles del almacén.",
      widget: {
        backToWarehouse: "Volver al almacén",
        active: "Activa",
        inactive: "Inactivo",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse para actualizar",
      },
      name: {
        label: "Nombre del almacén",
        description: "Nombre completo del almacén",
        placeholder: "Almacén principal",
      },
      code: {
        label: "Código",
        description: "Identificador corto",
        placeholder: "WH-01",
      },
      address: {
        label: "Dirección",
        description: "Dirección física",
        placeholder: "123 El carril de almacenamiento",
      },
      isActive: {
        label: "Activa",
        description: "Si este almacén está en funcionamiento",
      },
      isDefault: {
        label: "Default Warehouse",
        description: "Establecer como almacén predeterminado",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para actualizar almacenes",
        },
        forbidden: {
          title: "Admin Se requiere",
          description: "Sólo los administradores pueden actualizar almacenes",
        },
        conflict: {
          title: "Code Conflict",
          description: "Ese código de almacén ya está tomado.",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para actualizar el almacén",
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
          title: "Warehouse No encontrado",
          description: "El almacén no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Warehouse Actualizado",
        description: "Warehouse actualizado con éxito",
      },
      response: {
        id: "Warehouse ID",
        name: "Nombre",
        code: "Código",
        isActive: "Activa",
        isDefault: "Predeterminado",
      },
    },
  },

  // Stock list
  stockList: {
    get: {
      title: "Niveles de existencias",
      titleShort: "Niveles de existencias",
      description:
        "Vea los niveles de stock para un almacén con disponibilidad e indicadores de bajo valor.",
      widget: {
        unnamedProduct: "Nombre del producto no disponible",
        search: "Buscar productos o almacenes",
        stockStatus: "Estado del stock",
        actions: "Acciones",
        noMatches: "No hay existencias que coincidan",
        loadMore: "Mostrar más",

        back: "Atrás",
        defaultLowStockRule:
          "Stock bajo por debajo de {{threshold}} unidades disponibles",
        reorderPointRule:
          "Stock bajo con {{threshold}} unidades disponibles o menos",
        stockValuePrecision:
          "El valor de las existencias se calcula con la cantidad en almacén × el coste unitario sin redondear. Los costes mostrados se redondean a dos decimales.",
        lowStock: "Bajo stock",
        available: "Disponible",
        onHand: "En la mano",
        reserved: "Reservado",
        onOrder: "En orden",
        reorderPoint: "Punto de reordenamiento",
        empty: "Todavía no hay registros de acciones.",
        emptyHint: "Recibe el stock en un almacén para ver los niveles aquí.",
        emptyIcon: "📦",
        loading: "Niveles de stock de carga...",
        filterProduct: "Filtro por producto",
        load: "Carga",
        selectWarehouse:
          "Introduzca un almacén ID para ver los niveles de stock.",
        total: "Temas",
        adjust: "Ajuste",
        transfer: "Transferencia",
        outOfStock: "fuera de las reservas",
        belowReorderPoint: "debajo del punto de reordenamiento",
        bulletSeparator: "·",
        stockValue: "Valor de existencias",
        statusOk: "En existencias",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Almacén para el almacén de la consulta",
      },
      productId: {
        label: "Producto ID",
        description: "Filtrar a un producto específico (opcional)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver el stock",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este almacén",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to load stock levels",
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
          title: "Warehouse No encontrado",
          description: "El almacén no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Stock Cargadoed",
        description: "Niveles de stock recuperados",
      },
      response: {
        currency: "Moneda",
        id: "Stock ID",
        warehouseId: "Warehouse ID",
        warehouseName: "Warehouse",
        productId: "Producto ID",
        productName: "Producto",
        quantityOnHand: "Manos",
        quantityReserved: "Reservado",
        quantityOnOrder: "En orden",
        quantityAvailable: "Disponible",
        reorderPoint: "Punto de reordenamiento",
        reorderQuantity: "Reorder Qty",
        unitCost: "Costo de la Dependencia",
        isLowStock: "Stock bajo",
        updatedAt: "Actualizado en",
      },
    },
  },

  // Stock adjust
  stockAdjust: {
    post: {
      title: "Adjust Stock",
      titleShort: "Adjust Stock",
      description:
        "Ajuste manualmente la cantidad de stock. Use valores negativos para los paso a pérdidas y ganancias.",
      widget: {
        backToStock: "Volver a la acción",
        reserved: "Reservado",
        preview: "Vista previa",
        quantityChange: "Cambio de cantidad",
        positiveHint: "Cantidad positiva agrega stock",
        negativeHint: "Cantidad negativa elimina el stock",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Almacén para ajustar el stock en",
      },
      productId: { label: "Producto ID", description: "Producto para ajustar" },
      quantity: {
        label: "Cantidad",
        description:
          "Cambio de cantidad señalizado (positivo = añadir, negativo = quitar)",
        placeholder: "10",
      },
      reason: {
        label: "Razón",
        description: "Por qué se está haciendo este ajuste",
        placeholder: "Corrección de la cuenta física",
      },
      unitCost: {
        label: "Costo de la Dependencia",
        description: "Costo por unidad (opcional)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ajustar el stock",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este almacén",
        },
        conflict: {
          title: "Stock insuficiente",
          description: "No hay suficiente stock disponible para este ajuste",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to ajuste stock",
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
          description: "Almacén o producto no encontrado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Stock Adjusted",
        description: "Ajuste de las existencias registrados",
      },
      response: {
        movementId: "Movimiento ID",
        productId: "Producto ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "Nueva mano",
        quantityAvailable: "Disponible",
      },
    },
  },

  // Stock receive
  stockReceive: {
    post: {
      title: "Recibir acciones",
      titleShort: "Recibir acciones",
      description:
        "Registro de stock entrante. actualizaciones de la cantidad de mano y el costo promedio ponderado.",
      widget: {
        backToStock: "Volver a la acción",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Almacén que recibe el stock",
      },
      productId: { label: "Producto ID", description: "Producto recibido" },
      quantity: {
        label: "Cantidad",
        description: "Número de unidades recibidas",
        placeholder: "100",
      },
      unitCost: {
        label: "Costo de la Dependencia",
        description: "Costo por unidad recibida",
        placeholder: "0.00",
      },
      reference: {
        label: "Referencia",
        description: "Número de pedido o nota de entrega",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para recibir acciones",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este almacén",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to receive stock",
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
          description: "Almacén o producto no encontrado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Stock Recibido",
        description: "Recibimiento de existencias registrado",
      },
      response: {
        movementId: "Movimiento ID",
        productId: "Producto ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "Nueva mano",
        unitCost: "Nuevo costo de la unidad",
      },
    },
  },

  // Stock issue
  stockIssue: {
    post: {
      title: "Stock de números",
      titleShort: "Stock de números",
      description:
        "Emitir el almacén de un almacén. Valida suficiente cantidad disponible.",
      widget: {
        backToStock: "Volver a la acción",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse emitiendo acciones",
      },
      productId: { label: "Producto ID", description: "Producto a la emisión" },
      quantity: {
        label: "Cantidad",
        description: "Número de unidades a las que se ha de emitir",
        placeholder: "10",
      },
      reference: {
        label: "Referencia",
        description: "Orden de trabajo, número de trabajo u otra referencia",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Costo de la Dependencia",
        description: "Costo por unidad (promedio ponderado actual)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para emitir acciones",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a este almacén",
        },
        conflict: {
          title: "Stock insuficiente",
          description: "No hay suficiente stock disponible para emitir",
        },
        server: {
          title: "Error del servidor",
          description: "Falló en emitir acciones",
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
          description: "Almacén o producto no encontrado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Stock Issued",
        description: "Stock issued successfully",
      },
      response: {
        movementId: "Movimiento ID",
        productId: "Producto ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "Nueva mano",
        quantityAvailable: "Disponible",
      },
    },
  },

  // Transfer create
  transferCreate: {
    post: {
      title: "Crear transferencia",
      titleShort: "Nueva transferencia",
      description:
        "Cree una solicitud de transferencia de almacén. Empieza en Borrador de estado.",
      widget: {
        backToList: "Volver a las transferencias",
        viewTransfer: "View Transfer",
        browseWarehouses: "Navega los Almacenes",
      },
      companyId: {
        label: "Company ID",
        description: "Empresa este traslado pertenece a",
      },
      fromWarehouseId: {
        label: "De Warehouse",
        description: "Almacén de envío de acciones",
      },
      toWarehouseId: {
        label: "A Warehouse",
        description: "Almacén que recibe acciones",
      },
      reference: {
        label: "Referencia",
        description: "Número de referencia de transferencia",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Notas",
        description: "Notas adicionales sobre esta transferencia",
        placeholder: "Reparación estacional",
      },
      items: {
        label: "Temas",
        description: "Productos y cantidades a transferencia",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para crear transferencias",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: {
          title: "El mismo almacén.",
          description: "De y a almacén debe ser diferente",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to create transfer",
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
          description: "Almacén no encontrado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Transferencia Creada",
        description: "Proyecto de transferencia creado",
      },
      response: {
        id: "Transferencia ID",
        status: "Situación",
        reference: "Referencia",
        fromWarehouseId: "De Warehouse",
        toWarehouseId: "A Warehouse",
      },
    },
  },

  // Transfer list
  transferList: {
    get: {
      title: "Transferencias",
      titleShort: "Transferencias",
      description: "Lista de transferencias de almacén para una empresa.",
      widget: {
        back: "Atrás",
        newTransfer: "Nueva transferencia",
        empty: "Todavía no hay transferencias.",
        emptyHint:
          "Crear una transferencia para mover el stock entre almacenes.",
        emptyIcon: "🔄",
        loading: "Cargando transferencias...",
        load: "Carga",
        selectCompany: "Introduzca una empresa ID para cargar transferencias.",
        total: "Transferencias",
        view: "Vista",
        draft: "Proyecto",
        inTransit: "En tránsito",
        viewTransfer: "View Transfer",
        tabAll: "Todos",
        tabDraft: "Pendiente",
        tabInTransit: "En tránsito",
        tabReceived: "Completado",
        tabCancelled: "Cancelada",
        arrowSeparator: "→",
      },
      companyId: {
        label: "Company ID",
        description: "Compañía para enumerar las transferencias",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión en la lista de transferencias",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to list transfers",
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
        title: "Transferencias cargadas",
        description: "Lista de transferencia recuperada",
      },
      response: {
        id: "Transferencia ID",
        fromWarehouseId: "Desde Warehouse ID",
        fromWarehouseName: "Desde",
        toWarehouseId: "A Warehouse ID",
        toWarehouseName: "A",
        status: "Situación",
        reference: "Referencia",
        createdAt: "Creado en",
        completedAt: "Completado en",
      },
    },
  },

  // Transfer get
  transferGet: {
    get: {
      title: "Obtener transferencia",
      titleShort: "Transferencia",
      description:
        "Recuperar una transferencia con todos sus artículos de línea.",
      widget: {
        retry: "Volver a intentar",
        noItems: "Este traslado no contiene artículos.",
        noItemsHint:
          "Añade los productos que se mueven al crear el traslado. Sin artículos no se puede despachar.",
        receivedOf: "{{received}} de {{requested}} recibidos",
        newTransfer: "Nuevo traslado",
        back: "Atrás",
        dispatch: "Transferencia de separación",
        receive: "Mark received",
        status: "Situación",
        select: "Seleccione la transferencia",
      },
      transferId: {
        label: "Transferencia ID",
        description: "Transferencia para recuperar",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Transferencia inválida ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Iniciar sesión para ver las transferencias",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta transferencia",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to load transfer",
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
          title: "Transfer Not Found",
          description: "La transferencia no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Transferencia cargada",
        description: "Detalles de transferencia recuperados",
      },
      response: {
        id: "Transferencia ID",
        companyId: "Company ID",
        fromWarehouseId: "De Warehouse",
        fromWarehouseName: "De Warehouse",
        toWarehouseId: "A Warehouse",
        toWarehouseName: "A Warehouse",
        status: "Situación",
        reference: "Referencia",
        notes: "Notas",
        createdAt: "Creado",
        completedAt: "Completado",
        items: "Temas",
        itemId: "Tema ID",
        productId: "Producto ID",
        productName: "Producto",
        quantityRequested: "Solicitudes",
        quantityReceived: "Recibidos",
      },
    },
  },

  // Transfer dispatch
  transferDispatch: {
    post: {
      title: "Transferencia de basura",
      titleShort: "Despacho",
      description:
        "Marca transferencia como en tránsito. Stock deja el almacén de origen.",
      widget: {
        backToTransfer: "Volver a la transferencia",
      },
      transferId: {
        label: "Transferencia ID",
        description: "Transferencia al envío",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Transferencia inválida ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para enviar transferencias",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta transferencia",
        },
        conflict: {
          title: "No es un borrador",
          description: "Sólo se pueden enviar proyectos de transferencia",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado en el envío de transferencia",
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
          title: "Transfer Not Found",
          description: "La transferencia no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Transfer Dispatched",
        description: "La transferencia está ahora en tránsito",
      },
      response: {
        id: "Transferencia ID",
        status: "Situación",
      },
    },
  },

  // Transfer receive
  transferReceive: {
    post: {
      title: "Recibir transferencia",
      titleShort: "Recibir transferencia",
      description:
        "Mark transfer as received. Crea movimientos de acciones y actualiza el inventario en ambos extremos.",
      widget: {
        backToTransfer: "Volver a la transferencia",
      },
      transferId: {
        label: "Transferencia ID",
        description: "Transferencia para recibir",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Transferencia inválida ID",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para recibir transferencias",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta transferencia",
        },
        conflict: {
          title: "No en tránsito",
          description: "Sólo se pueden recibir transferencias en tránsito",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para recibir transferencia",
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
          title: "Transfer Not Found",
          description: "La transferencia no existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Transferencia recibida",
        description: "Movimientos de stock creados y actualizados",
      },
      response: {
        id: "Transferencia ID",
        status: "Situación",
        completedAt: "Completado en",
      },
    },
  },

  // Inventory Dashboard
  dashboard: {
    get: {
      title: "Inventory Overview",
      titleShort: "Sinopsis",
      description:
        "instantánea en vivo de la salud de stock, transferencias pendientes y conteos de almacén.",
      widget: {
        kpiInStock: "In Stock",
        kpiOutOfStock: "Existencias",
        kpiLowStock: "Stock bajo",
        kpiWarehouses: "Almacenes",
        attention: "Existencias que requieren atención",
        noAttention: "Ningún artículo necesita reposición.",
        newPurchaseOrder: "Nuevo pedido",
        kpiTransfersInTransit: "Traslados en tránsito",
        alertOutOfStock: "Producto {{count}} fuera de stock",
        alertOutOfStockPlural: "Productos {{count}} fuera de stock",
        navStockLevels: "Niveles de existencias",
        navTransfers: "Transferencias",
        navWarehouses: "Almacenes",
        loading: "Cargando…",
        pendingTransfers: "Transferencia {{count}} en tránsito",
        pendingTransfersPlural: "Transferencias {{count}} en tránsito",
      },
      companyId: {
        label: "Company",
        description:
          "Empresa para mostrar estadísticas de inventario para (opcional)",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para ver la vista general del inventario",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No hay acceso a esta empresa",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Failed to load inventory overview",
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
        description: "Resumen de inventario recuperado",
      },
      response: {
        inStockCount: "In Stock",
        outOfStockCount: "Existencias",
        lowStockCount: "Stock bajo",
        pendingTransferCount: "Transferencias pendientes",
        warehouseCount: "Almacenes",
      },
    },
  },
};
