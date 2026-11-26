export const translations = {
  category: "Purchasing",
  orderAction: {
    backToOrder: "Back to order",
    keepOrder: "Keep order",
    openOrder: "Open order",
    expected: "Expected",
    total: "Order total",
    notAvailable: "Not available for this order",
  },
  tags: {
    purchasing: "Purchasing",
    vendor: "Vendor",
    order: "Purchase order",
    receipt: "Receipt",
    create: "Create",
    list: "List",
    get: "Get",
    update: "Update",
    deactivate: "Deactivate",
    send: "Send",
    confirm: "Confirm",
    receive: "Receive",
    cancel: "Cancel",
    convertToBill: "Convert to bill",
    addLine: "Add line",
    removeLine: "Remove line",
  },
  endpointCategories: {
    purchasing: "Purchasing",
    vendors: "Vendors",
    purchaseOrders: "Purchase orders",
    purchasingOrders: "Purchase orders",
    purchasingVendors: "Vendors",
  },
  enums: {
    poStatus: {
      draft: "Draft",
      sent: "Sent",
      confirmed: "Confirmed",
      partiallyReceived: "Partially received",
      received: "Received",
      billed: "Billed",
      cancelled: "Cancelled",
    },
  },

  // Vendor create
  vendorCreate: {
    post: {
      title: "Create vendor",
      titleShort: "Create vendor",
      description: "Register a new supplier for your company.",
      widget: {
        back: "Back",
        viewVendor: "Open vendor",
        createAnother: "Create another",
        subtitle:
          "Add a supplier once. Purchase orders and bills pick it by name.",
        cancel: "Cancel",
        allVendors: "All vendors",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check all fields and try again",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to create vendors",
        },
        forbidden: {
          title: "Access denied",
          description: "You need member or higher role",
        },
        conflict: {
          title: "Code already exists",
          description: "A vendor with this code already exists",
        },
        server: {
          title: "Server error",
          description: "Failed to create vendor. Try again.",
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
        title: "Vendor created",
        description: "Vendor registered successfully",
      },
      response: {
        id: "Vendor ID",
        name: "Name",
        code: "Code",
        email: "Email",
        isActive: "Active",
        createdAt: "Created",
      },
    },
    companyId: {
      label: "Company",
      description: "Company this vendor belongs to",
      placeholder: "Company UUID",
    },
    name: {
      label: "Vendor name",
      description: "Legal name of the supplier",
      placeholder: "Acme GmbH",
    },
    code: {
      label: "Code",
      description: "Short internal identifier (optional)",
      placeholder: "ACM-001",
    },
    email: {
      label: "Email",
      description: "Vendor contact email",
      placeholder: "orders@acme.com",
    },
    phone: {
      label: "Phone",
      description: "Vendor contact phone",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "Website",
      description: "Vendor website",
      placeholder: "https://acme.com",
    },
    vatNumber: {
      label: "VAT number",
      description: "Vendor VAT registration number",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Tax ID",
      description: "Vendor tax identification number",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Address line 1",
      description: "Street and number",
      placeholder: "123 Main Street",
    },
    addressLine2: {
      label: "Address line 2",
      description: "Suite, floor, etc.",
      placeholder: "Floor 2",
    },
    city: { label: "City", description: "City", placeholder: "Berlin" },
    region: {
      label: "Region / state",
      description: "Region or state",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "Postal code",
      description: "Postal or ZIP code",
      placeholder: "10115",
    },
    country: {
      label: "Country",
      description: "Country code (ISO 3166-1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Default currency",
      description: "Currency for purchase orders to this vendor",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Payment terms (days)",
      description: "Default payment terms in days",
      placeholder: "30",
    },
    notes: {
      label: "Notes",
      description: "Internal notes about this vendor",
      placeholder: "Preferred supplier for electronics",
    },
  },

  // Vendor list
  vendorList: {
    get: {
      title: "Vendors",
      titleShort: "Vendors",
      description: "List all vendors for a company.",
      widget: {
        back: "Back",
        active: "Active",
        inactive: "Inactive",
        total: "total",
        createVendor: "New vendor",
        empty: "No vendors yet",
        vatLabel: "VAT",
        vatPrefix: "VAT:",
        paymentTerms: "Net {{days}} days",
        paymentTermsPrefix: "Net",
        paymentTermsSuffix: "d",
        loading: "Loading…",
        subtitle: "Suppliers you buy from, with their terms and contact.",
        filterAll: "All",
        statusFilter: "Vendor status",
        search: "Search name, code, email or VAT",
        colVendor: "Vendor",
        colContact: "Email",
        colCurrency: "Currency",
        colStatus: "Status",
        emptyHint:
          "Add the suppliers you buy from. Purchase orders and supplier bills pick them by name.",
        noMatch: "No vendors match this filter",
        clearFilters: "Clear filters",
        count: "{{shown}} of {{total}} vendors",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to list vendors",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to list vendors",
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
        title: "Vendors loaded",
        description: "Vendor list retrieved",
      },
      response: {
        id: "Vendor ID",
        name: "Name",
        code: "Code",
        email: "Email",
        vatNumber: "VAT",
        defaultCurrency: "Currency",
        defaultPaymentTermsDays: "Payment terms",
        isActive: "Active",
        createdAt: "Created",
      },
    },
    companyId: { label: "Company", description: "Company to list vendors for" },
  },

  // Vendor get
  vendorGet: {
    get: {
      title: "Get vendor",
      titleShort: "Vendor details",
      description: "Retrieve full details for a vendor.",
      widget: {
        companyName: "Company",
        orderCount: "Purchase orders",
        receivingCount: "Awaiting receipt",
        details: "Vendor details",
        related: "Vendor actions",
        backToList: "Vendors",
        back: "Back",
        edit: "Edit vendor",
        createOrder: "New purchase order",
        viewOrders: "View orders",
        deactivate: "Deactivate",
        select: "Select vendor",
        paymentTerms: "Payment terms",
        dueOnReceipt: "Due on receipt",
        netDays: "Net {{days}} days",
        address: "Address",
        deactivateTitle: "Deactivate {{name}}?",
        deactivateMessage:
          "You can no longer order from this vendor. Existing purchase orders and bills stay as they are.",
        deactivateFailed: "Vendor was not deactivated",
        loadFailed: "Could not load this vendor",
        retry: "Try again",
        loading: "Loading vendor",
      },
      vendorId: { label: "Vendor ID", description: "Vendor to retrieve" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid vendor ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view vendors",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this vendor",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: { title: "Server error", description: "Failed to load vendor" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Vendor not found",
          description: "Vendor does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Vendor loaded",
        description: "Vendor details retrieved",
      },
      response: {
        id: "Vendor ID",
        companyId: "Company ID",
        name: "Name",
        code: "Code",
        email: "Email",
        phone: "Phone",
        website: "Website",
        vatNumber: "VAT number",
        taxId: "Tax ID",
        addressLine1: "Address",
        addressLine2: "Address line 2",
        city: "City",
        region: "Region",
        postalCode: "Postal code",
        country: "Country",
        defaultCurrency: "Currency",
        defaultPaymentTermsDays: "Payment terms (days)",
        isActive: "Active",
        notes: "Notes",
        createdAt: "Created",
        updatedAt: "Updated",
      },
    },
  },

  // Vendor update
  vendorUpdate: {
    patch: {
      title: "Update vendor",
      titleShort: "Update vendor",
      description: "Update vendor details.",
      isActive: {
        label: "Active",
        description: "Active vendors can be picked on new purchase orders.",
      },
      widget: {
        backToVendor: "Back to vendor",
        viewVendor: "View vendor",
        sectionStatus: "Status",
        title: "Edit vendor",
        cancel: "Cancel",
        save: "Save changes",
        sectionCompany: "Company and tax",
        sectionContact: "Contact",
        sectionAddress: "Address",
        sectionTerms: "Purchasing terms",
      },
      vendorId: { label: "Vendor ID", description: "Vendor to update" },
      name: {
        label: "Vendor name",
        description: "Legal name of the supplier",
        placeholder: "Acme GmbH",
      },
      code: {
        label: "Code",
        description: "Short internal identifier",
        placeholder: "ACM-001",
      },
      email: {
        label: "Email",
        description: "Vendor contact email",
        placeholder: "orders@acme.com",
      },
      phone: {
        label: "Phone",
        description: "Vendor contact phone",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "Website",
        description: "Vendor website",
        placeholder: "https://acme.com",
      },
      vatNumber: {
        label: "VAT number",
        description: "Vendor VAT registration number",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Tax ID",
        description: "Tax identification number",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Address line 1",
        description: "Street and number",
        placeholder: "123 Main Street",
      },
      addressLine2: {
        label: "Address line 2",
        description: "Suite, floor, etc.",
        placeholder: "Floor 2",
      },
      city: { label: "City", description: "City", placeholder: "Berlin" },
      region: {
        label: "Region / state",
        description: "Region or state",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "Postal code",
        description: "Postal or ZIP code",
        placeholder: "10115",
      },
      country: {
        label: "Country",
        description: "Country code (ISO 3166-1 alpha-2)",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Default currency",
        description: "Currency for purchase orders to this vendor",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Payment terms (days)",
        description: "Default payment terms in days",
        placeholder: "30",
      },
      notes: {
        label: "Notes",
        description: "Internal notes about this vendor",
        placeholder: "Preferred supplier",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to update vendors",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this vendor",
        },
        conflict: {
          title: "Code conflict",
          description: "That vendor code is already taken",
        },
        server: {
          title: "Server error",
          description: "Failed to update vendor",
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
          title: "Vendor not found",
          description: "Vendor does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Vendor updated",
        description: "Vendor updated successfully",
      },
      response: {
        id: "Vendor ID",
        name: "Name",
        isActive: "Active",
        updatedAt: "Updated",
      },
    },
  },

  // Vendor deactivate
  vendorDeactivate: {
    post: {
      title: "Deactivate vendor",
      titleShort: "Deactivate",
      description:
        "Mark a vendor as inactive. Existing purchase orders are not affected.",
      vendorId: { label: "Vendor ID", description: "Vendor to deactivate" },
      widget: {
        warning:
          "New purchase orders can no longer pick this vendor. Existing orders, receipts and bills stay as they are. You can reactivate it later from Edit vendor.",
        backToList: "Back to vendors",
        backToVendor: "Back to vendor",
        subtitle: "Stop ordering from this supplier.",
        cancel: "Cancel",
        openVendor: "Open vendor",
        alreadyInactive: "This vendor is already inactive",
        reactivateHint:
          "To order from it again, open the vendor, choose Edit vendor and switch it back to active.",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid vendor ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to deactivate vendors",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this vendor",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to deactivate vendor",
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
          title: "Vendor not found",
          description: "Vendor does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Vendor deactivated",
        description: "Vendor is now inactive",
      },
      response: {
        id: "Vendor ID",
        isActive: "Active",
      },
    },
  },

  // PO create
  orderCreate: {
    post: {
      title: "Create purchase order",
      titleShort: "Create order",
      description: "Create a new purchase order in draft status.",
      errors: {
        validation: {
          title: "Validation error",
          description: "Check all fields and try again",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to create purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "You need member or higher role",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to create purchase order. Try again.",
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
          description: "Vendor or company not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase order created",
        description: "Purchase order created in draft status",
      },
      widget: {
        browseVendors: "Browse vendors",
        browseWarehouses: "Browse warehouses",
        viewOrder: "Open purchase order",
        backToList: "Back to list",
        subtitle:
          "Pick the supplier and where the goods go. Add lines on the next screen.",
        cancel: "Cancel",
        nextStep: "The draft is ready. Add its lines, then mark it as sent.",
        sectionSupplier: "Supplier",
        sectionDelivery: "Delivery",
      },
      response: {
        id: "Purchase order ID",
        poNumber: "Purchase order number",
        status: "Status",
        subtotal: "Subtotal",
        taxAmount: "Tax",
        total: "Total",
        createdAt: "Created",
      },
    },
    companyId: {
      label: "Company",
      description: "Company issuing this purchase order",
      placeholder: "Company UUID",
    },
    vendorId: {
      label: "Vendor",
      description: "Supplier receiving this purchase order",
      placeholder: "Vendor UUID",
    },
    currency: {
      label: "Currency",
      description: "Purchase order currency",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "Expected delivery",
      description: "Expected delivery date (optional)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Delivery warehouse",
      description: "Warehouse to receive goods (optional)",
      placeholder: "Warehouse UUID",
    },
    notes: {
      label: "Notes",
      description: "Internal notes for this purchase order",
      placeholder: "Rush order",
    },
    lines: {
      label: "Line items",
      description: "Products and quantities to order",
    },
    lineDescription: {
      label: "Description",
      description: "Item description",
      placeholder: "Office chairs",
    },
    lineProductId: {
      label: "Product ID",
      description: "Catalog product (optional)",
      placeholder: "Product UUID",
    },
    lineQuantity: {
      label: "Quantity",
      description: "Number of units",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Unit price",
      description: "Price per unit",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "Tax rate",
      description: "Tax rate as decimal (e.g. 0.19 = 19%)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "Sort order",
      description: "Display order of this line",
      placeholder: "0",
    },
  },

  // PO list
  orderList: {
    get: {
      title: "Purchase orders",
      titleShort: "Orders",
      description:
        "List purchase orders for a company with optional status filter.",
      widget: {
        newOrder: "New purchase order",
        empty: "No purchase orders found.",
        statusAll: "All",
        orders: "purchase orders",
        order: "purchase order",
        colPoVendor: "Purchase order / vendor",
        colDate: "Date",
        colAmount: "Amount",
        colStatus: "Status",
        deliveryArrow: "→",
        overdue: "overdue",
        readyToBill: "Received, ready for billing",
        openAttentionOrder: "Open order {{reference}}",
        attentionCount: "Orders needing attention: {{count}}",
        actionNeeded: "purchase orders need attention",
        back: "Back",
        loading: "Loading…",
      },
      companyId: {
        label: "Company",
        description: "Company to list purchase orders for",
      },
      status: {
        label: "Status filter",
        description: "Filter by purchase order status (optional)",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to list purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to list purchase orders",
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
        title: "Purchase orders loaded",
        description: "Purchase order list retrieved",
      },
      response: {
        id: "Purchase order ID",
        poNumber: "Purchase order number",
        vendorId: "Vendor",
        vendorName: "Vendor",
        status: "Status",
        currency: "Currency",
        total: "Total",
        expectedDeliveryDate: "Expected delivery",
        createdAt: "Created",
      },
    },
  },

  // PO get
  orderGet: {
    get: {
      title: "Get purchase order",
      titleShort: "Order details",
      description:
        "Retrieve a purchase order with all lines and receipt history.",
      widget: {
        precision:
          "Line totals use the original supplier unit price before display rounding.",
        back: "Back",
        send: "Mark as sent",
        confirm: "Mark confirmed",
        receive: "Receive goods",
        convertToBill: "Convert to bill",
        viewBill: "View bill",
        addLine: "+ Add line",
        cancel: "Cancel order",
        edit: "Edit",
        select: "Select purchase order",
        linesHeader: "Line items",
        receiptsHeader: "Receipt history",
        noLines: "No line items.",
        noReceipts: "No receipts yet.",
        colDescription: "Description",
        colQtyPrice: "Qty × price",
        colLineTotal: "Total",
        delivery: "Expected delivery:",
        overdue: "(overdue)",
        received: "received",
        billCreated: "AP bill created from this purchase order.",
        vendorLabel: "Vendor:",
      },
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to retrieve",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load purchase order",
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
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase order loaded",
        description: "Purchase order details retrieved",
      },
      response: {
        id: "Purchase order ID",
        companyId: "Company ID",
        vendorId: "Vendor ID",
        poNumber: "Purchase order number",
        status: "Status",
        currency: "Currency",
        expectedDeliveryDate: "Expected delivery",
        deliveryWarehouseId: "Delivery warehouse",
        notes: "Notes",
        subtotal: "Subtotal",
        taxAmount: "Tax",
        total: "Total",
        billId: "Bill ID",
        confirmedAt: "Confirmed",
        receivedAt: "Received",
        createdAt: "Created",
        updatedAt: "Updated",
        lines: "Lines",
        lineId: "Line ID",
        lineProductId: "Product ID",
        lineDescription: "Description",
        lineQuantity: "Qty",
        lineUnitPrice: "Unit price",
        lineTaxRate: "Tax rate",
        lineTaxAmount: "Tax",
        lineTotal: "Total",
        lineQuantityReceived: "Received",
        receipts: "Receipts",
        receiptId: "Receipt ID",
        receiptReceivedAt: "Received at",
        receiptNotes: "Notes",
      },
    },
  },

  // PO update
  orderUpdate: {
    patch: {
      title: "Update purchase order",
      titleShort: "Update order",
      description: "Edit the details and line items on a draft purchase order.",
      widget: {
        backToPO: "Back to purchase order",
        title: "Edit purchase order",
        cancel: "Cancel",
        save: "Save changes",
        lockedTitle: "Only drafts can be edited",
        lockedMessage:
          "This order was already sent. Cancel it and raise a new one to change supplier, currency or delivery.",
      },
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to update",
      },
      vendorId: {
        label: "Vendor",
        description: "Change vendor (optional)",
        placeholder: "Vendor UUID",
      },
      currency: {
        label: "Currency",
        description: "Purchase order currency",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "Expected delivery",
        description: "Expected delivery date",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Delivery warehouse",
        description: "Warehouse to receive goods",
        placeholder: "Warehouse UUID",
      },
      notes: {
        label: "Notes",
        description: "Internal notes for this purchase order",
        placeholder: "Rush order",
      },
      lines: {
        label: "Line items",
        description: "Replace all line items (optional)",
      },
      lineDescription: {
        label: "Description",
        description: "Item description",
        placeholder: "Office chairs",
      },
      lineProductId: {
        label: "Product ID",
        description: "Catalog product (optional)",
        placeholder: "Product UUID",
      },
      lineQuantity: {
        label: "Quantity",
        description: "Number of units",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Unit price",
        description: "Price per unit",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "Tax rate",
        description: "Tax rate as decimal",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "Sort order",
        description: "Display order of this line",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to update purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a draft",
          description: "Only draft purchase orders can be edited",
        },
        server: {
          title: "Server error",
          description: "Failed to update purchase order",
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
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase order updated",
        description: "Purchase order updated",
      },
      response: {
        id: "Purchase order ID",
        status: "Status",
        subtotal: "Subtotal",
        taxAmount: "Tax",
        total: "Total",
        updatedAt: "Updated",
      },
    },
  },

  // PO send
  orderSend: {
    post: {
      title: "Mark purchase order as sent",
      titleShort: "Mark as sent",
      description: "Record that the purchase order was sent.",
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to send",
      },
      widget: {
        back: "Back",
        consequence:
          "The order moves to sent. Confirm it once the supplier replies, then receive the goods.",
        blocked: "Only draft orders can be marked as sent.",
        noLines: "Add at least one line before sending the order.",
        backToPO: "Back to purchase order",
        warning: "This changes the order status to sent in this workspace.",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to send purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a draft",
          description: "Only draft purchase orders can be sent",
        },
        server: {
          title: "Server error",
          description: "Failed to send purchase order",
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
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase order marked as sent",
        description: "The purchase order now has sent status.",
      },
      response: {
        id: "Purchase order ID",
        status: "Status",
      },
    },
  },

  // PO confirm
  orderConfirm: {
    post: {
      title: "Confirm purchase order",
      titleShort: "Confirm order",
      description: "Record the supplier’s confirmation of this purchase order.",
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to confirm",
      },
      widget: {
        back: "Back",
        consequence:
          "The supplier accepted the order. It stays open for receiving until all goods arrive.",
        blocked: "Only sent orders can be confirmed.",
        backToPO: "Back to purchase order",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to confirm purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Invalid status",
          description: "Only sent purchase orders can be confirmed",
        },
        server: {
          title: "Server error",
          description: "Failed to confirm purchase order",
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
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase order confirmed",
        description: "Purchase order marked as confirmed",
      },
      response: {
        id: "Purchase order ID",
        status: "Status",
        confirmedAt: "Confirmed at",
      },
    },
  },

  // PO receive
  orderReceive: {
    post: {
      title: "Receive goods",
      titleShort: "Receive goods",
      description:
        "Record receipt of goods against a purchase order. Creates stock movements.",
      widget: {
        retry: "Try again",
        loading: "Loading order…",
        remaining: "{{quantity}} remaining",
        noOpenLines: "All ordered quantities have been received.",
        backToPO: "Back to purchase order",
      },
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to receive against",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Warehouse receiving the goods (optional)",
        placeholder: "Warehouse UUID",
      },
      notes: {
        label: "Notes",
        description: "Notes about this delivery",
        placeholder: "Delivery note #12345",
      },
      lines: {
        label: "Received items",
        description: "Quantities received for each line",
      },
      linePoLineId: { label: "Line ID", description: "Purchase order line" },
      lineQuantityReceived: {
        label: "Quantity received",
        description: "Quantity received for this line",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check all fields and quantities",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to receive goods",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Invalid status",
          description:
            "Purchase order must be confirmed or sent to receive goods",
        },
        server: {
          title: "Server error",
          description: "Failed to record receipt",
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
          title: "Purchase order not found",
          description: "Purchase order or line not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Goods received",
        description: "Receipt recorded and stock updated",
      },
      response: {
        receiptId: "Receipt ID",
        status: "Purchase order status",
        receivedAt: "Received at",
      },
    },
  },

  // PO convert to bill
  orderConvertToBill: {
    post: {
      title: "Convert to bill",
      titleShort: "Convert to bill",
      description:
        "Create a supplier bill from a fully received purchase order. Approve the bill to post the payable.",
      widget: {
        back: "Back",
        consequence:
          "Creates an unposted supplier bill with the received quantities. Review and approve it under bills.",
        blocked: "Only fully received orders without a bill can be converted.",
        viewBill: "View bill",
      },
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to convert",
      },
      errors: {
        validation: {
          title: "Check the currency and order totals",
          description:
            "The bill currency must be supported and each total must match the order lines.",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to create bills",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Order unavailable for billing",
          description:
            "Only a fully received order without an existing bill can be converted.",
        },
        server: { title: "Server error", description: "Failed to create bill" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Bill created",
        description: "AP bill created from purchase order",
      },
      response: {
        billId: "Bill ID",
        billNumber: "Bill number",
        poId: "Purchase order ID",
      },
    },
  },

  // PO line add
  orderLineAdd: {
    post: {
      widget: {
        productSearch: "Search products by name or SKU",
        search: "Search",
        noProducts: "No matching products.",
        clearProduct: "Clear product",
        backToOrder: "Back to order",
        lineAdded: "Line item added",
      },
      title: "Add line item",
      titleShort: "Add line",
      description: "Add a line item to a purchase order.",
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to add a line to",
      },
      productId: {
        label: "Product",
        description: "Catalog product (optional)",
        placeholder: "Product UUID",
      },
      itemDescription: {
        label: "Description",
        description: "Item description",
        placeholder: "Office chairs",
      },
      quantity: {
        label: "Quantity",
        description: "Number of units",
        placeholder: "10",
      },
      unitPrice: {
        label: "Unit price",
        description: "Price per unit",
        placeholder: "99.00",
      },
      taxRate: {
        label: "Tax rate",
        description: "Tax rate as decimal (e.g. 0.19 = 19%)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check all fields and try again",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to add line items",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a draft",
          description: "Only draft purchase orders can be modified",
        },
        server: {
          title: "Server error",
          description: "Failed to add line item",
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
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Line added",
        description: "Line item added to purchase order",
      },
      response: {
        lineId: "Line ID",
        subtotal: "Subtotal",
        taxAmount: "Tax",
        total: "Total",
      },
    },
  },

  // PO line remove
  orderLineRemove: {
    post: {
      title: "Remove line item",
      titleShort: "Remove line",
      description: "Remove a line item from a purchase order.",
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to remove a line from",
      },
      lineId: { label: "Line ID", description: "Line item to remove" },
      widget: {
        updatedOrderTotals: "Updated order totals",
        cancel: "Cancel",
        verifying: "Checking the selected item…",
        unavailable: "Open the draft order again and select a line to remove.",
        backToOrder: "Back to purchase order",
        warning:
          "This will permanently remove the line item from the purchase order.",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid IDs",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to remove line items",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a draft",
          description: "Only draft purchase orders can be modified",
        },
        server: {
          title: "Server error",
          description: "Failed to remove line item",
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
          description: "Purchase order or line item not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Line removed",
        description: "Line item removed from purchase order",
      },
      response: {
        subtotal: "Subtotal",
        taxAmount: "Tax",
        total: "Total",
      },
    },
  },

  // Purchasing Dashboard
  dashboard: {
    get: {
      title: "Purchasing overview",
      titleShort: "Overview",
      description:
        "Live snapshot of purchase orders and supplier activity for your company.",
      widget: {
        openValue: "Open order value",
        settledBills: "Bills settled this month",
        deliveries: "Upcoming deliveries",
        order: "Order",
        supplier: "Supplier",
        expected: "Expected",
        orderTotal: "Order total",
        noDeliveries:
          "No deliveries outstanding. Sent and confirmed orders appear here until their goods are received.",
        overdue: "Late deliveries",
        dueSeven: "Due in the next 7 days",
        kpiDraft: "Drafts",
        kpiConfirmed: "Confirmed",
        kpiAwaitingReceipt: "Awaiting receipt",
        kpiActiveVendors: "Active vendors",
        warningDueThisWeek:
          "One purchase order is due this week. Check its delivery date.",
        warningDueThisWeekPlural:
          "{{count}} purchase orders are due this week. Check their delivery dates.",
        navNewPo: "New purchase order",
        navAllPos: "All purchase orders",
        navVendors: "Vendors",
        navNewVendor: "New vendor",
        loading: "Loading…",
      },
      companyId: {
        label: "Company",
        description: "Company to show purchasing stats for (optional)",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view purchasing overview",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load purchasing overview",
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
        description: "Purchasing overview retrieved",
      },
      response: {
        draftCount: "Draft purchase orders",
        confirmedCount: "Confirmed purchase orders",
        awaitingReceiptCount: "Awaiting receipt",
        activeVendorCount: "Active vendors",
        dueThisWeekCount: "Due this week",
      },
    },
  },

  // PO cancel
  orderCancel: {
    post: {
      title: "Cancel purchase order",
      titleShort: "Cancel order",
      description: "Cancel a draft or sent purchase order.",
      poId: {
        label: "Purchase order ID",
        description: "Purchase order to cancel",
      },
      widget: {
        back: "Back",
        blocked: "Only draft or sent orders can be cancelled.",
        warning:
          "The order is closed for good. Nothing can be received or billed on it afterwards.",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to cancel purchase orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Cannot cancel",
          description: "Only draft or sent purchase orders can be cancelled",
        },
        server: {
          title: "Server error",
          description: "Failed to cancel purchase order",
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
          title: "Purchase order not found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase order cancelled",
        description: "Purchase order cancelled",
      },
      response: {
        id: "Purchase order ID",
        status: "Status",
      },
    },
  },
};
