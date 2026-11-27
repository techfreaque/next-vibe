export const translations = {
  category: "Inventory",
  shared: {
    errors: {
      failedToRecordMovement: "Failed to record stock movement",
      failedToApplyMovement: "Failed to apply stock movement",
    },
  },
  tags: {
    cancel: "Cancel",
    inventory: "Inventory",
    warehouse: "Warehouse",
    stock: "Stock",
    transfer: "Transfer",
    create: "Create",
    list: "List",
    get: "Get",
    update: "Update",
    adjust: "Adjust",
    receive: "Receive",
    issue: "Issue",
    dispatch: "Dispatch",
  },
  endpointCategories: {
    inventory: "Inventory",
    warehouses: "Warehouses",
    stock: "Stock levels",
    transfers: "Transfers",
  },
  enums: {
    movementType: {
      receipt: "Receipt",
      issue: "Issue",
      transferIn: "Transfer in",
      transferOut: "Transfer out",
      adjustment: "Adjustment",
      sale: "Sale",
      return: "Return",
    },
    transferStatus: {
      draft: "Draft",
      inTransit: "In transit",
      received: "Received",
      cancelled: "Cancelled",
    },
    negativeStockPolicy: {
      block: "Block negative stock",
      warn: "Allow with warning",
      allow: "Allow negative stock",
    },
  },

  // Warehouse create
  warehouseCreate: {
    post: {
      title: "Create warehouse",
      titleShort: "New warehouse",
      description: "Register a new warehouse for a company.",
      widget: {
        openWarehouse: "Open warehouse",
        createAnother: "Create another",
        backToList: "Back to warehouses",
        active: "Active",
        inactive: "Inactive",
        default: "Default",
      },
      companyId: {
        label: "Company",
        description: "Company this warehouse belongs to",
      },
      name: {
        label: "Warehouse name",
        description: "Full name of the warehouse",
        placeholder: "Main warehouse",
      },
      code: {
        label: "Code",
        description: "Short identifier (e.g. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Address",
        description: "Physical address of the warehouse",
        placeholder: "123 Storage Lane",
      },
      isActive: {
        label: "Active",
        description: "Whether this warehouse is operational",
      },
      isDefault: {
        label: "Default warehouse",
        description: "Set as the default warehouse for this company",
      },
      negativeStockPolicy: {
        label: "Negative stock policy",
        description:
          "How till sales and stock issues behave when on-hand quantity is insufficient",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to create warehouses",
        },
        forbidden: {
          title: "Admin required",
          description: "Only admins can create warehouses",
        },
        conflict: {
          title: "Code already exists",
          description: "A warehouse with this code already exists",
        },
        server: {
          title: "Server error",
          description: "Failed to create warehouse. Try again.",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouse created",
        description: "Warehouse registered successfully",
      },
      response: {
        id: "Warehouse ID",
        name: "Warehouse name",
        code: "Code",
        companyId: "Company ID",
        isActive: "Active",
        isDefault: "Default",
        negativeStockPolicy: "Negative stock policy",
      },
    },
  },

  // Warehouse list
  warehouseList: {
    get: {
      title: "Warehouses",
      titleShort: "Warehouses",
      description: "List all warehouses for a company.",
      widget: {
        subtitle:
          "Where your stock lives. Open one to see its stock and value.",
        status: "Status",
        active: "Active",
        inactive: "Inactive",
        default: "Default",
        total: "warehouses",
        createWarehouse: "New warehouse",
        empty: "No warehouses yet.",
        emptyHint: "Create your first warehouse to start tracking inventory.",
        emptyIcon: "🏭",
        back: "Back",
        loading: "Loading warehouses…",
        load: "Load",
        viewStock: "View stock",
        selectCompany: "Enter a company ID to load warehouses.",
      },
      companyId: {
        label: "Company",
        description: "Company to list warehouses for",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to list warehouses",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to list warehouses",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouses loaded",
        description: "Warehouse list retrieved",
      },
      response: {
        id: "Warehouse ID",
        name: "Name",
        code: "Code",
        address: "Address",
        isActive: "Active",
        isDefault: "Default",
        createdAt: "Created at",
      },
    },
  },

  // Warehouse get
  warehouseGet: {
    get: {
      title: "Get warehouse",
      titleShort: "Warehouse",
      description: "Retrieve details for a specific warehouse.",
      widget: {
        companyName: "Company",
        stockedProducts: "Products in stock",
        companyInventory: "Company inventory overview",
        missingValuation: "Missing cost",
        details: "Warehouse details",
        related: "Inventory",
        backToList: "Back to warehouses",
        back: "Back",
        edit: "Edit warehouse",
        viewStock: "View stock",
        select: "Select warehouse",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse to retrieve",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid warehouse ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view warehouses",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this warehouse",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load warehouse",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Warehouse not found",
          description: "Warehouse does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouse loaded",
        description: "Warehouse details retrieved",
      },
      response: {
        id: "Warehouse ID",
        companyId: "Company ID",
        name: "Name",
        code: "Code",
        address: "Address",
        isActive: "Active",
        isDefault: "Default",
        negativeStockPolicy: "Negative stock policy",
        createdAt: "Created at",
        updatedAt: "Updated at",
      },
    },
  },

  // Warehouse update
  warehouseUpdate: {
    patch: {
      title: "Update warehouse",
      titleShort: "Edit warehouse",
      description: "Update warehouse details.",
      widget: {
        backToWarehouse: "Back to warehouse",
        active: "Active",
        inactive: "Inactive",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse to update",
      },
      name: {
        label: "Warehouse name",
        description: "Full name of the warehouse",
        placeholder: "Main warehouse",
      },
      code: {
        label: "Code",
        description: "Short identifier",
        placeholder: "WH-01",
      },
      address: {
        label: "Address",
        description: "Physical address",
        placeholder: "123 Storage Lane",
      },
      isActive: {
        label: "Active",
        description: "Whether this warehouse is operational",
      },
      isDefault: {
        label: "Default warehouse",
        description: "Set as the default warehouse",
      },
      negativeStockPolicy: {
        label: "Negative stock policy",
        description:
          "How till sales and stock issues behave when on-hand quantity is insufficient",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to update warehouses",
        },
        forbidden: {
          title: "Admin required",
          description: "Only admins can update warehouses",
        },
        conflict: {
          title: "Code conflict",
          description: "That warehouse code is already taken",
        },
        server: {
          title: "Server error",
          description: "Failed to update warehouse",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Warehouse not found",
          description: "Warehouse does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouse updated",
        description: "Warehouse updated successfully",
      },
      response: {
        id: "Warehouse ID",
        name: "Name",
        code: "Code",
        isActive: "Active",
        isDefault: "Default",
        negativeStockPolicy: "Negative stock policy",
      },
    },
  },

  // Stock list
  stockList: {
    get: {
      title: "Stock levels",
      titleShort: "Stock levels",
      description:
        "View stock levels for a warehouse with availability and low-stock indicators.",
      widget: {
        unnamedProduct: "Unavailable product name",
        search: "Search products or warehouses",
        stockStatus: "Stock status",
        actions: "Actions",
        noMatches: "No matching stock records",
        loadMore: "Show more",

        back: "Back",
        defaultLowStockRule: "Low below {{threshold}} available",
        reorderPointRule: "Low at {{threshold}} available or less",
        stockValuePrecision:
          "Stock value uses on-hand quantity × unrounded unit cost. Displayed costs are rounded to two decimals.",
        lowStock: "Low stock",
        available: "Available",
        onHand: "On hand",
        reserved: "Reserved",
        onOrder: "On order",
        reorderPoint: "Reorder point",
        empty: "No stock records yet.",
        emptyHint: "Receive stock into a warehouse to see levels here.",
        emptyIcon: "📦",
        loading: "Loading stock levels…",
        filterProduct: "Filter by product",
        load: "Load",
        selectWarehouse: "Enter a warehouse ID to view stock levels.",
        total: "items",
        adjust: "Adjust",
        transfer: "Transfer",
        outOfStock: "out of stock",
        belowReorderPoint: "below reorder point",
        bulletSeparator: "·",
        stockValue: "Stock value",
        statusOk: "In stock",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse to query stock for",
      },
      productId: {
        label: "Product",
        description: "Filter to a specific product (optional)",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view stock",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this warehouse",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load stock levels",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Warehouse not found",
          description: "Warehouse does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Stock loaded", description: "Stock levels retrieved" },
      response: {
        currency: "Currency",
        id: "Stock ID",
        warehouseId: "Warehouse ID",
        warehouseName: "Warehouse",
        productId: "Product ID",
        productName: "Product",
        quantityOnHand: "On hand",
        quantityReserved: "Reserved",
        quantityOnOrder: "On order",
        quantityAvailable: "Available",
        reorderPoint: "Reorder point",
        reorderQuantity: "Reorder qty",
        unitCost: "Unit cost",
        isLowStock: "Low stock",
        updatedAt: "Updated at",
      },
    },
  },

  // Stock adjust
  stockWrite: {
    onHandNow: "On hand now:",
    viewStock: "View stock levels",
    again: "Record another",
  },
  stockAdjust: {
    post: {
      title: "Adjust stock",
      titleShort: "Adjust stock",
      description:
        "Manually adjust stock quantity. Use negative values for write-offs.",
      widget: {
        backToStock: "Back to stock",
        reserved: "Reserved",
        preview: "Preview",
        quantityChange: "Quantity change",
        positiveHint: "Positive quantity adds stock",
        negativeHint: "Negative quantity removes stock",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse to adjust stock in",
      },
      productId: { label: "Product", description: "Product to adjust" },
      quantity: {
        label: "Quantity",
        description:
          "Signed quantity change (positive = add, negative = remove)",
        placeholder: "10",
      },
      reason: {
        label: "Reason",
        description: "Why this adjustment is being made",
        placeholder: "Physical count correction",
      },
      unitCost: {
        label: "Unit cost",
        description: "Cost per unit (optional)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to adjust stock",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this warehouse",
        },
        conflict: {
          title: "Insufficient stock",
          description: "Not enough stock available for this adjustment",
        },
        server: {
          title: "Server error",
          description: "Failed to adjust stock",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Not found",
          description: "Warehouse or product not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Stock adjusted",
        description: "Stock adjustment recorded",
      },
      response: {
        movementId: "Movement ID",
        productId: "Product ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "New on hand",
        quantityAvailable: "Available",
      },
    },
  },

  // Stock receive
  stockReceive: {
    post: {
      title: "Receive stock",
      titleShort: "Receive stock",
      description:
        "Record a stock receipt to update the quantity on hand and weighted average cost.",
      widget: {
        backToStock: "Back to stock",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse receiving the stock",
      },
      productId: { label: "Product", description: "Product being received" },
      quantity: {
        label: "Quantity",
        description: "Number of units received",
        placeholder: "100",
      },
      unitCost: {
        label: "Unit cost",
        description: "Cost per unit received",
        placeholder: "0.00",
      },
      reference: {
        label: "Reference",
        description: "Purchase order number or delivery note",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to receive stock",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this warehouse",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to receive stock",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Not found",
          description: "Warehouse or product not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Stock received",
        description: "Stock receipt recorded",
      },
      response: {
        movementId: "Movement ID",
        productId: "Product ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "New on hand",
        unitCost: "New unit cost",
      },
    },
  },

  // Stock issue
  stockIssue: {
    post: {
      title: "Issue stock",
      titleShort: "Issue stock",
      description:
        "Issue stock out of a warehouse. Validates sufficient available quantity.",
      widget: {
        backToStock: "Back to stock",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse issuing stock from",
      },
      productId: { label: "Product", description: "Product to issue" },
      quantity: {
        label: "Quantity",
        description: "Number of units to issue",
        placeholder: "10",
      },
      reference: {
        label: "Reference",
        description: "Work order, job number, or other reference",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Unit cost",
        description: "Cost per unit (defaults to current weighted average)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to issue stock",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this warehouse",
        },
        conflict: {
          title: "Insufficient stock",
          description: "Not enough stock available to issue",
        },
        server: { title: "Server error", description: "Failed to issue stock" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Not found",
          description: "Warehouse or product not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Stock issued",
        description: "Stock issued successfully",
      },
      response: {
        movementId: "Movement ID",
        productId: "Product ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "New on hand",
        quantityAvailable: "Available",
      },
    },
  },

  // Transfer create
  transferCreate: {
    post: {
      title: "Create transfer",
      titleShort: "New transfer",
      description:
        "Create a warehouse transfer request. Starts in draft status.",
      widget: {
        itemsTitle: "Items to move",
        pickSource: "Pick the source warehouse to see what it holds.",
        noStock: "This warehouse holds no stock to move.",
        available: "{{quantity}} available",
        itemsRequired: "Enter a quantity for at least one product.",
        backToList: "Back to transfers",
        viewTransfer: "View transfer",
        browseWarehouses: "Browse warehouses",
      },
      companyId: {
        label: "Company",
        description: "Company this transfer belongs to",
      },
      fromWarehouseId: {
        label: "From warehouse",
        description: "Warehouse sending stock",
      },
      toWarehouseId: {
        label: "To warehouse",
        description: "Warehouse receiving stock",
      },
      reference: {
        label: "Reference",
        description: "Transfer reference number",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Notes",
        description: "Additional notes about this transfer",
        placeholder: "Seasonal restock",
      },
      items: {
        label: "Items",
        description: "Products and quantities to transfer",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to create transfers",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: {
          invalidWarehouses:
            "Both warehouses must be active and belong to this company.",
          invalidItems:
            "List each product once with a quantity above zero (up to 4 decimals).",
          title: "Same warehouse",
          description: "From and to warehouse must be different",
        },
        server: {
          title: "Server error",
          description: "Failed to create transfer",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not found", description: "Warehouse not found" },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer created",
        description: "Transfer draft created",
      },
      response: {
        id: "Transfer ID",
        status: "Status",
        reference: "Reference",
        fromWarehouseId: "From warehouse",
        toWarehouseId: "To warehouse",
      },
    },
  },

  // Transfer list
  transferList: {
    get: {
      title: "Transfers",
      titleShort: "Transfers",
      description: "List warehouse transfers for a company.",
      widget: {
        back: "Back",
        newTransfer: "New transfer",
        empty: "No transfers yet.",
        emptyHint: "Create a transfer to move stock between warehouses.",
        emptyIcon: "🔄",
        loading: "Loading transfers…",
        load: "Load",
        selectCompany: "Enter a company ID to load transfers.",
        total: "transfers",
        view: "View",
        draft: "Draft",
        inTransit: "In transit",
        viewTransfer: "View transfer",
        tabAll: "All",
        tabDraft: "Pending",
        tabInTransit: "In transit",
        tabReceived: "Completed",
        tabCancelled: "Cancelled",
        arrowSeparator: "→",
      },
      companyId: {
        label: "Company",
        description: "Company to list transfers for",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to list transfers",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to list transfers",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfers loaded",
        description: "Transfer list retrieved",
      },
      response: {
        id: "Transfer ID",
        fromWarehouseId: "From warehouse ID",
        fromWarehouseName: "From",
        toWarehouseId: "To warehouse ID",
        toWarehouseName: "To",
        status: "Status",
        reference: "Reference",
        createdAt: "Created at",
        completedAt: "Completed at",
      },
    },
  },

  // Transfer get
  transferGet: {
    get: {
      title: "Get transfer",
      titleShort: "Transfer",
      description: "Retrieve a transfer with all its line items.",
      widget: {
        cancel: "Cancel transfer",
        retry: "Try again",
        noItems: "This transfer has no items.",
        noItemsHint:
          "Add the products to move when you create the transfer. A transfer without items cannot be dispatched.",
        receivedOf: "{{received}} of {{requested}} received",
        newTransfer: "New transfer",
        back: "Back",
        dispatch: "Dispatch transfer",
        receive: "Mark received",
        status: "Status",
        select: "Select transfer",
      },
      transferId: { label: "Transfer", description: "Transfer to retrieve" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid transfer ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view transfers",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this transfer",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load transfer",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer not found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer loaded",
        description: "Transfer details retrieved",
      },
      response: {
        id: "Transfer ID",
        companyId: "Company ID",
        fromWarehouseId: "From warehouse",
        fromWarehouseName: "From warehouse",
        toWarehouseId: "To warehouse",
        toWarehouseName: "To warehouse",
        status: "Status",
        reference: "Reference",
        notes: "Notes",
        createdAt: "Created",
        completedAt: "Completed",
        items: "Items",
        itemId: "Item ID",
        productId: "Product ID",
        productName: "Product",
        quantityRequested: "Requested",
        quantityReceived: "Received",
      },
    },
  },

  // Transfer dispatch
  transferCancel: {
    post: {
      title: "Cancel transfer",
      titleShort: "Cancel transfer",
      description:
        "Stop this transfer. A dispatched transfer puts its stock back into the source warehouse.",
      widget: {
        backToTransfer: "Back to transfer",
      },
      transferId: {
        label: "Transfer",
        description: "Transfer to cancel",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid transfer",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to cancel transfers",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this transfer",
        },
        conflict: {
          title: "Cannot cancel",
          description: "Only draft or in-transit transfers can be cancelled",
        },
        server: {
          title: "Server error",
          description: "Failed to cancel transfer",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer not found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer cancelled",
        description: "Nothing from this transfer is in transit anymore.",
      },
      response: {
        id: "Transfer",
        status: "Status",
      },
    },
  },
  transferDispatch: {
    post: {
      title: "Dispatch transfer",
      titleShort: "Dispatch",
      description:
        "Mark transfer as in transit. Stock leaves the source warehouse.",
      widget: {
        backToTransfer: "Back to transfer",
      },
      transferId: { label: "Transfer", description: "Transfer to dispatch" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid transfer ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to dispatch transfers",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this transfer",
        },
        conflict: {
          insufficientStock:
            "Not enough stock in the source warehouse for every item.",
          title: "Not a draft",
          description: "Only draft transfers can be dispatched",
        },
        server: {
          title: "Server error",
          description: "Failed to dispatch transfer",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer not found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer dispatched",
        description: "Transfer is now in transit",
      },
      response: {
        id: "Transfer ID",
        status: "Status",
      },
    },
  },

  // Transfer receive
  transferReceive: {
    post: {
      title: "Receive transfer",
      titleShort: "Receive transfer",
      description:
        "Mark transfer as received. Creates stock movements and updates inventory on both ends.",
      widget: {
        backToTransfer: "Back to transfer",
      },
      transferId: { label: "Transfer", description: "Transfer to receive" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid transfer ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to receive transfers",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this transfer",
        },
        conflict: {
          title: "Not in transit",
          description: "Only in-transit transfers can be received",
        },
        server: {
          title: "Server error",
          description: "Failed to receive transfer",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer not found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer received",
        description: "Stock movements created and inventory updated",
      },
      response: {
        id: "Transfer ID",
        status: "Status",
        completedAt: "Completed at",
      },
    },
  },

  // Inventory Dashboard
  dashboard: {
    get: {
      title: "Inventory overview",
      titleShort: "Overview",
      description:
        "Live snapshot of stock health, pending transfers, and warehouse counts.",
      widget: {
        noWarehousesHint:
          "Create a warehouse to start receiving and moving stock.",
        navStockLevelsHint: "Quantities, value and reorder points",
        navTransfersHint: "In transit: {{count}}",
        navWarehousesHint: "Locations: {{count}}",
        noWarehouses: "No warehouses yet",
        related: "Related",
        kpiInStock: "In stock",
        kpiOutOfStock: "Out of stock",
        kpiLowStock: "Low stock",
        kpiWarehouses: "Warehouses",
        attention: "Stock needing attention",
        noAttention: "No items are below their stock threshold.",
        newPurchaseOrder: "New purchase order",
        kpiTransfersInTransit: "Transfers in transit",
        alertOutOfStock: "{{count}} product out of stock",
        alertOutOfStockPlural: "{{count}} products out of stock",
        navStockLevels: "Stock levels",
        navTransfers: "Transfers",
        navWarehouses: "Warehouses",
        loading: "Loading…",
        pendingTransfers: "{{count}} transfer in transit",
        pendingTransfersPlural: "{{count}} transfers in transit",
      },
      companyId: {
        label: "Company",
        description: "Company to show inventory stats for (optional)",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view inventory overview",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load inventory overview",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Dashboard loaded",
        description: "Inventory overview retrieved",
      },
      response: {
        inStockCount: "In stock",
        outOfStockCount: "Out of stock",
        lowStockCount: "Low stock",
        pendingTransferCount: "Pending transfers",
        warehouseCount: "Warehouses",
      },
    },
  },
};
