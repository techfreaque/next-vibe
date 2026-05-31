export const translations = {
  category: "Inventory",
  shared: {
    errors: {
      failedToRecordMovement: "Failed to record stock movement",
      failedToApplyMovement: "Failed to apply stock movement",
    },
  },
  tags: {
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
    stock: "Stock Levels",
    transfers: "Transfers",
  },
  enums: {
    movementType: {
      receipt: "Receipt",
      issue: "Issue",
      transferIn: "Transfer In",
      transferOut: "Transfer Out",
      adjustment: "Adjustment",
      sale: "Sale",
      return: "Return",
    },
    transferStatus: {
      draft: "Draft",
      inTransit: "In Transit",
      received: "Received",
      cancelled: "Cancelled",
    },
  },

  // Warehouse create
  warehouseCreate: {
    post: {
      title: "Create Warehouse",
      description: "Register a new warehouse for a company.",
      widget: {
        backToList: "Back to warehouses",
        active: "Active",
        inactive: "Inactive",
        default: "Default",
      },
      companyId: {
        label: "Company ID",
        description: "Company this warehouse belongs to",
      },
      name: {
        label: "Warehouse Name",
        description: "Full name of the warehouse",
        placeholder: "Main Warehouse",
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
        label: "Default Warehouse",
        description: "Set as the default warehouse for this company",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create warehouses",
        },
        forbidden: {
          title: "Admin Required",
          description: "Only admins can create warehouses",
        },
        conflict: {
          title: "Code Already Exists",
          description: "A warehouse with this code already exists",
        },
        server: {
          title: "Server Error",
          description: "Failed to create warehouse — try again",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouse Created",
        description: "Warehouse registered successfully",
      },
      response: {
        id: "Warehouse ID",
        name: "Warehouse Name",
        code: "Code",
        companyId: "Company ID",
        isActive: "Active",
        isDefault: "Default",
      },
    },
  },

  // Warehouse list
  warehouseList: {
    get: {
      title: "List Warehouses",
      description: "List all warehouses for a company.",
      widget: {
        active: "Active",
        inactive: "Inactive",
        default: "Default",
        total: "warehouses",
        createWarehouse: "New Warehouse",
        empty: "No warehouses yet.",
        emptyHint: "Create your first warehouse to start tracking inventory.",
        emptyIcon: "🏭",
        loading: "Loading warehouses…",
        load: "Load",
        viewStock: "View Stock",
        selectCompany: "Enter a company ID to load warehouses.",
      },
      companyId: {
        label: "Company ID",
        description: "Company to list warehouses for",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to list warehouses",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to list warehouses",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouses Loaded",
        description: "Warehouse list retrieved",
      },
      response: {
        id: "Warehouse ID",
        name: "Name",
        code: "Code",
        address: "Address",
        isActive: "Active",
        isDefault: "Default",
        createdAt: "Created At",
      },
    },
  },

  // Warehouse get
  warehouseGet: {
    get: {
      title: "Get Warehouse",
      description: "Retrieve details for a specific warehouse.",
      widget: {
        edit: "Edit warehouse",
        viewStock: "View stock",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse to retrieve",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid warehouse ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view warehouses",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this warehouse",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load warehouse",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Warehouse Not Found",
          description: "Warehouse does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouse Loaded",
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
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
  },

  // Warehouse update
  warehouseUpdate: {
    patch: {
      title: "Update Warehouse",
      description: "Update warehouse details.",
      widget: {
        backToWarehouse: "Back to warehouse",
        active: "Active",
        inactive: "Inactive",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse to update",
      },
      name: {
        label: "Warehouse Name",
        description: "Full name of the warehouse",
        placeholder: "Main Warehouse",
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
        label: "Default Warehouse",
        description: "Set as the default warehouse",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to update warehouses",
        },
        forbidden: {
          title: "Admin Required",
          description: "Only admins can update warehouses",
        },
        conflict: {
          title: "Code Conflict",
          description: "That warehouse code is already taken",
        },
        server: {
          title: "Server Error",
          description: "Failed to update warehouse",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Warehouse Not Found",
          description: "Warehouse does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Warehouse Updated",
        description: "Warehouse updated successfully",
      },
      response: {
        id: "Warehouse ID",
        name: "Name",
        code: "Code",
        isActive: "Active",
        isDefault: "Default",
      },
    },
  },

  // Stock list
  stockList: {
    get: {
      title: "Stock Levels",
      description:
        "View stock levels for a warehouse with availability and low-stock indicators.",
      widget: {
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
        statusOk: "OK",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse to query stock for",
      },
      productId: {
        label: "Product ID",
        description: "Filter to a specific product (optional)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view stock",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this warehouse",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load stock levels",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Warehouse Not Found",
          description: "Warehouse does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Stock Loaded", description: "Stock levels retrieved" },
      response: {
        id: "Stock ID",
        warehouseId: "Warehouse ID",
        warehouseName: "Warehouse",
        productId: "Product ID",
        productName: "Product",
        quantityOnHand: "On Hand",
        quantityReserved: "Reserved",
        quantityOnOrder: "On Order",
        quantityAvailable: "Available",
        reorderPoint: "Reorder Point",
        reorderQuantity: "Reorder Qty",
        unitCost: "Unit Cost",
        isLowStock: "Low Stock",
        updatedAt: "Updated At",
      },
    },
  },

  // Stock adjust
  stockAdjust: {
    post: {
      title: "Adjust Stock",
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
        label: "Warehouse ID",
        description: "Warehouse to adjust stock in",
      },
      productId: { label: "Product ID", description: "Product to adjust" },
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
        label: "Unit Cost",
        description: "Cost per unit (optional)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to adjust stock",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this warehouse",
        },
        conflict: {
          title: "Insufficient Stock",
          description: "Not enough stock available for this adjustment",
        },
        server: {
          title: "Server Error",
          description: "Failed to adjust stock",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Not Found",
          description: "Warehouse or product not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Stock Adjusted",
        description: "Stock adjustment recorded",
      },
      response: {
        movementId: "Movement ID",
        productId: "Product ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "New On Hand",
        quantityAvailable: "Available",
      },
    },
  },

  // Stock receive
  stockReceive: {
    post: {
      title: "Receive Stock",
      description:
        "Record incoming stock — updates on-hand quantity and weighted average cost.",
      widget: {
        backToStock: "Back to stock",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse receiving the stock",
      },
      productId: { label: "Product ID", description: "Product being received" },
      quantity: {
        label: "Quantity",
        description: "Number of units received",
        placeholder: "100",
      },
      unitCost: {
        label: "Unit Cost",
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
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to receive stock",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this warehouse",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to receive stock",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Not Found",
          description: "Warehouse or product not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Stock Received",
        description: "Stock receipt recorded",
      },
      response: {
        movementId: "Movement ID",
        productId: "Product ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "New On Hand",
        unitCost: "New Unit Cost",
      },
    },
  },

  // Stock issue
  stockIssue: {
    post: {
      title: "Issue Stock",
      description:
        "Issue stock out of a warehouse. Validates sufficient available quantity.",
      widget: {
        backToStock: "Back to stock",
      },
      warehouseId: {
        label: "Warehouse ID",
        description: "Warehouse issuing stock from",
      },
      productId: { label: "Product ID", description: "Product to issue" },
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
        label: "Unit Cost",
        description: "Cost per unit (defaults to current weighted average)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to issue stock",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this warehouse",
        },
        conflict: {
          title: "Insufficient Stock",
          description: "Not enough stock available to issue",
        },
        server: { title: "Server Error", description: "Failed to issue stock" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Not Found",
          description: "Warehouse or product not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Stock Issued",
        description: "Stock issued successfully",
      },
      response: {
        movementId: "Movement ID",
        productId: "Product ID",
        warehouseId: "Warehouse ID",
        quantityOnHand: "New On Hand",
        quantityAvailable: "Available",
      },
    },
  },

  // Transfer create
  transferCreate: {
    post: {
      title: "Create Transfer",
      description:
        "Create a warehouse transfer request. Starts in Draft status.",
      widget: {
        backToList: "Back to transfers",
        viewTransfer: "View Transfer",
        browseWarehouses: "Browse Warehouses",
      },
      companyId: {
        label: "Company ID",
        description: "Company this transfer belongs to",
      },
      fromWarehouseId: {
        label: "From Warehouse",
        description: "Warehouse sending stock",
      },
      toWarehouseId: {
        label: "To Warehouse",
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
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create transfers",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: {
          title: "Same Warehouse",
          description: "From and to warehouse must be different",
        },
        server: {
          title: "Server Error",
          description: "Failed to create transfer",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Warehouse not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer Created",
        description: "Transfer draft created",
      },
      response: {
        id: "Transfer ID",
        status: "Status",
        reference: "Reference",
        fromWarehouseId: "From Warehouse",
        toWarehouseId: "To Warehouse",
      },
    },
  },

  // Transfer list
  transferList: {
    get: {
      title: "List Transfers",
      description: "List warehouse transfers for a company.",
      widget: {
        newTransfer: "New Transfer",
        empty: "No transfers yet.",
        emptyHint: "Create a transfer to move stock between warehouses.",
        emptyIcon: "🔄",
        loading: "Loading transfers…",
        load: "Load",
        selectCompany: "Enter a company ID to load transfers.",
        total: "transfers",
        view: "View",
        draft: "Draft",
        inTransit: "In Transit",
        viewTransfer: "View Transfer",
        tabAll: "All",
        tabDraft: "Pending",
        tabInTransit: "In Transit",
        tabReceived: "Completed",
        tabCancelled: "Cancelled",
        arrowSeparator: "→",
      },
      companyId: {
        label: "Company ID",
        description: "Company to list transfers for",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to list transfers",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to list transfers",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfers Loaded",
        description: "Transfer list retrieved",
      },
      response: {
        id: "Transfer ID",
        fromWarehouseId: "From Warehouse ID",
        fromWarehouseName: "From",
        toWarehouseId: "To Warehouse ID",
        toWarehouseName: "To",
        status: "Status",
        reference: "Reference",
        createdAt: "Created At",
        completedAt: "Completed At",
      },
    },
  },

  // Transfer get
  transferGet: {
    get: {
      title: "Get Transfer",
      description: "Retrieve a transfer with all its line items.",
      widget: {
        dispatch: "Dispatch transfer",
        receive: "Mark received",
        status: "Status",
      },
      transferId: { label: "Transfer ID", description: "Transfer to retrieve" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid transfer ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view transfers",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this transfer",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load transfer",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer Not Found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer Loaded",
        description: "Transfer details retrieved",
      },
      response: {
        id: "Transfer ID",
        companyId: "Company ID",
        fromWarehouseId: "From Warehouse",
        toWarehouseId: "To Warehouse",
        status: "Status",
        reference: "Reference",
        notes: "Notes",
        createdAt: "Created At",
        completedAt: "Completed At",
        items: "Items",
        itemId: "Item ID",
        productId: "Product ID",
        quantityRequested: "Requested",
        quantityReceived: "Received",
      },
    },
  },

  // Transfer dispatch
  transferDispatch: {
    post: {
      title: "Dispatch Transfer",
      description:
        "Mark transfer as in transit. Stock leaves the source warehouse.",
      widget: {
        backToTransfer: "Back to transfer",
      },
      transferId: { label: "Transfer ID", description: "Transfer to dispatch" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid transfer ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to dispatch transfers",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this transfer",
        },
        conflict: {
          title: "Not a Draft",
          description: "Only draft transfers can be dispatched",
        },
        server: {
          title: "Server Error",
          description: "Failed to dispatch transfer",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer Not Found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer Dispatched",
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
      title: "Receive Transfer",
      description:
        "Mark transfer as received. Creates stock movements and updates inventory on both ends.",
      widget: {
        backToTransfer: "Back to transfer",
      },
      transferId: { label: "Transfer ID", description: "Transfer to receive" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid transfer ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to receive transfers",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this transfer",
        },
        conflict: {
          title: "Not In Transit",
          description: "Only in-transit transfers can be received",
        },
        server: {
          title: "Server Error",
          description: "Failed to receive transfer",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Transfer Not Found",
          description: "Transfer does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Transfer Received",
        description: "Stock movements created and inventory updated",
      },
      response: {
        id: "Transfer ID",
        status: "Status",
        completedAt: "Completed At",
      },
    },
  },

  // Inventory Dashboard
  dashboard: {
    get: {
      title: "Inventory Overview",
      description:
        "Live snapshot of stock health, pending transfers, and warehouse counts.",
      widget: {
        kpiInStock: "In Stock",
        kpiOutOfStock: "Out of Stock",
        kpiLowStock: "Low Stock",
        kpiWarehouses: "Warehouses",
        alertOutOfStock: "{{count}} product out of stock",
        alertOutOfStockPlural: "{{count}} products out of stock",
        navStockLevels: "Stock Levels",
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
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view inventory overview",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load inventory overview",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Dashboard Loaded",
        description: "Inventory overview retrieved",
      },
      response: {
        inStockCount: "In Stock",
        outOfStockCount: "Out of Stock",
        lowStockCount: "Low Stock",
        pendingTransferCount: "Pending Transfers",
        warehouseCount: "Warehouses",
      },
    },
  },
};
