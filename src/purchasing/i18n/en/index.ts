export const translations = {
  category: "Purchasing",
  tags: {
    purchasing: "Purchasing",
    vendor: "Vendor",
    order: "Purchase Order",
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
    convertToBill: "Convert to Bill",
    addLine: "Add Line",
    removeLine: "Remove Line",
  },
  endpointCategories: {
    purchasing: "Purchasing",
    vendors: "Vendors",
    purchaseOrders: "Purchase Orders",
    purchasingOrders: "Purchase Orders",
    purchasingVendors: "Vendors",
  },
  enums: {
    poStatus: {
      draft: "Draft",
      sent: "Sent",
      confirmed: "Confirmed",
      partiallyReceived: "Partially Received",
      received: "Received",
      billed: "Billed",
      cancelled: "Cancelled",
    },
  },

  // Vendor create
  vendorCreate: {
    post: {
      title: "Create Vendor",
      titleShort: "Create Vendor",
      description: "Register a new supplier for your company.",
      widget: {
        back: "Back",
        viewVendor: "Open vendor",
        createAnother: "Create another",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check all fields and try again",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create vendors",
        },
        forbidden: {
          title: "Access Denied",
          description: "You need Member or higher role",
        },
        conflict: {
          title: "Code Already Exists",
          description: "A vendor with this code already exists",
        },
        server: {
          title: "Server Error",
          description: "Failed to create vendor — try again",
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
        title: "Vendor Created",
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
      label: "Vendor Name",
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
      label: "VAT Number",
      description: "Vendor VAT registration number",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Tax ID",
      description: "Vendor tax identification number",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Address Line 1",
      description: "Street and number",
      placeholder: "123 Main Street",
    },
    addressLine2: {
      label: "Address Line 2",
      description: "Suite, floor, etc.",
      placeholder: "Floor 2",
    },
    city: { label: "City", description: "City", placeholder: "Berlin" },
    region: {
      label: "Region / State",
      description: "Region or state",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "Postal Code",
      description: "Postal or ZIP code",
      placeholder: "10115",
    },
    country: {
      label: "Country",
      description: "Country code (ISO 3166-1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Default Currency",
      description: "Currency for purchase orders to this vendor",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Payment Terms (days)",
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
        empty: "No vendors configured. Add one to get started.",
        vatLabel: "VAT",
        vatPrefix: "VAT:",
        paymentTerms: "Net {{days}} days",
        paymentTermsPrefix: "Net",
        paymentTermsSuffix: "d",
        loading: "Loading…",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to list vendors",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to list vendors",
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
        title: "Vendors Loaded",
        description: "Vendor list retrieved",
      },
      response: {
        id: "Vendor ID",
        name: "Name",
        code: "Code",
        email: "Email",
        vatNumber: "VAT",
        defaultCurrency: "Currency",
        defaultPaymentTermsDays: "Payment Terms",
        isActive: "Active",
        createdAt: "Created",
      },
    },
    companyId: { label: "Company", description: "Company to list vendors for" },
  },

  // Vendor get
  vendorGet: {
    get: {
      title: "Get Vendor",
      titleShort: "Vendor Details",
      description: "Retrieve full details for a vendor.",
      widget: {
        back: "Back",
        edit: "Edit vendor",
        createOrder: "New Purchase Order",
        viewOrders: "View orders",
        deactivate: "Deactivate",
        select: "Select vendor",
      },
      vendorId: { label: "Vendor ID", description: "Vendor to retrieve" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid vendor ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view vendors",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this vendor",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: { title: "Server Error", description: "Failed to load vendor" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Vendor Not Found",
          description: "Vendor does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Vendor Loaded",
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
        vatNumber: "VAT Number",
        taxId: "Tax ID",
        addressLine1: "Address",
        addressLine2: "Address Line 2",
        city: "City",
        region: "Region",
        postalCode: "Postal Code",
        country: "Country",
        defaultCurrency: "Default Currency",
        defaultPaymentTermsDays: "Payment Terms (days)",
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
      title: "Update Vendor",
      titleShort: "Update Vendor",
      description: "Update vendor details.",
      widget: {
        backToVendor: "Back to vendor",
        viewVendor: "View vendor",
      },
      vendorId: { label: "Vendor ID", description: "Vendor to update" },
      name: {
        label: "Vendor Name",
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
        label: "VAT Number",
        description: "Vendor VAT registration number",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Tax ID",
        description: "Tax identification number",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Address Line 1",
        description: "Street and number",
        placeholder: "123 Main Street",
      },
      addressLine2: {
        label: "Address Line 2",
        description: "Suite, floor, etc.",
        placeholder: "Floor 2",
      },
      city: { label: "City", description: "City", placeholder: "Berlin" },
      region: {
        label: "Region / State",
        description: "Region or state",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "Postal Code",
        description: "Postal or ZIP code",
        placeholder: "10115",
      },
      country: {
        label: "Country",
        description: "Country code (ISO 3166-1 alpha-2)",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Default Currency",
        description: "Currency for purchase orders to this vendor",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Payment Terms (days)",
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
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to update vendors",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this vendor",
        },
        conflict: {
          title: "Code Conflict",
          description: "That vendor code is already taken",
        },
        server: {
          title: "Server Error",
          description: "Failed to update vendor",
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
          title: "Vendor Not Found",
          description: "Vendor does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Vendor Updated",
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
      title: "Deactivate Vendor",
      titleShort: "Deactivate",
      description:
        "Mark a vendor as inactive. Existing purchase orders are not affected.",
      vendorId: { label: "Vendor ID", description: "Vendor to deactivate" },
      widget: {
        warning:
          "This will deactivate the vendor. Existing purchase orders will not be affected.",
        backToList: "Back to vendors",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid vendor ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to deactivate vendors",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this vendor",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to deactivate vendor",
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
          title: "Vendor Not Found",
          description: "Vendor does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Vendor Deactivated",
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
      title: "Create Purchase Order",
      titleShort: "Create Order",
      description: "Create a new purchase order in Draft status.",
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check all fields and try again",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "You need Member or higher role",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to create purchase order — try again",
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
          description: "Vendor or company not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase Order Created",
        description: "Purchase order created in Draft status",
      },
      widget: {
        browseVendors: "Browse Vendors",
        browseWarehouses: "Browse Warehouses",
        viewOrder: "Open purchase order",
        backToList: "Back to list",
      },
      response: {
        id: "Purchase Order ID",
        poNumber: "Purchase Order Number",
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
      label: "Expected Delivery",
      description: "Expected delivery date (optional)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Delivery Warehouse",
      description: "Warehouse to receive goods (optional)",
      placeholder: "Warehouse UUID",
    },
    notes: {
      label: "Notes",
      description: "Internal notes for this purchase order",
      placeholder: "Rush order",
    },
    lines: {
      label: "Line Items",
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
      label: "Unit Price",
      description: "Price per unit",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "Tax Rate",
      description: "Tax rate as decimal (e.g. 0.19 = 19%)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "Sort Order",
      description: "Display order of this line",
      placeholder: "0",
    },
  },

  // PO list
  orderList: {
    get: {
      title: "Purchase Orders",
      titleShort: "Orders",
      description:
        "List purchase orders for a company with optional status filter.",
      widget: {
        newOrder: "New Purchase Order",
        empty: "No purchase orders found.",
        statusAll: "All",
        orders: "purchase orders",
        order: "purchase order",
        colPoVendor: "Purchase Order / Vendor",
        colDate: "Date",
        colAmount: "Amount",
        colStatus: "Status",
        deliveryArrow: "→",
        overdue: "overdue",
        actionNeeded: "purchase orders need attention",
        back: "Back",
        loading: "Loading…",
      },
      companyId: {
        label: "Company",
        description: "Company to list purchase orders for",
      },
      status: {
        label: "Status Filter",
        description: "Filter by purchase order status (optional)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to list purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to list purchase orders",
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
        title: "Purchase Orders Loaded",
        description: "Purchase order list retrieved",
      },
      response: {
        id: "Purchase Order ID",
        poNumber: "Purchase Order Number",
        vendorId: "Vendor",
        vendorName: "Vendor",
        status: "Status",
        currency: "Currency",
        total: "Total",
        expectedDeliveryDate: "Expected Delivery",
        createdAt: "Created",
      },
    },
  },

  // PO get
  orderGet: {
    get: {
      title: "Get Purchase Order",
      titleShort: "Order Details",
      description:
        "Retrieve a purchase order with all lines and receipt history.",
      widget: {
        back: "Back",
        send: "Send to vendor",
        confirm: "Mark confirmed",
        receive: "Receive goods",
        convertToBill: "Convert to bill",
        viewBill: "View bill",
        addLine: "+ Add line",
        cancel: "Cancel Order",
        edit: "Edit",
        select: "Select purchase order",
        linesHeader: "Line Items",
        receiptsHeader: "Receipt History",
        noLines: "No line items.",
        noReceipts: "No receipts yet.",
        colDescription: "Description",
        colQtyPrice: "Qty × Price",
        colLineTotal: "Total",
        delivery: "Expected delivery:",
        overdue: "(overdue)",
        received: "received",
        billCreated: "AP bill created from this purchase order.",
        vendorLabel: "Vendor:",
      },
      poId: {
        label: "Purchase Order ID",
        description: "Purchase order to retrieve",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load purchase order",
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
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase Order Loaded",
        description: "Purchase order details retrieved",
      },
      response: {
        id: "Purchase Order ID",
        companyId: "Company ID",
        vendorId: "Vendor ID",
        poNumber: "Purchase Order Number",
        status: "Status",
        currency: "Currency",
        expectedDeliveryDate: "Expected Delivery",
        deliveryWarehouseId: "Delivery Warehouse",
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
        lineUnitPrice: "Unit Price",
        lineTaxRate: "Tax Rate",
        lineTaxAmount: "Tax",
        lineTotal: "Total",
        lineQuantityReceived: "Received",
        receipts: "Receipts",
        receiptId: "Receipt ID",
        receiptReceivedAt: "Received At",
        receiptNotes: "Notes",
      },
    },
  },

  // PO update
  orderUpdate: {
    patch: {
      title: "Update Purchase Order",
      titleShort: "Update Order",
      description: "Edit a Draft purchase order — fields and lines.",
      widget: {
        backToPO: "Back to Purchase Order",
      },
      poId: {
        label: "Purchase Order ID",
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
        label: "Expected Delivery",
        description: "Expected delivery date",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Delivery Warehouse",
        description: "Warehouse to receive goods",
        placeholder: "Warehouse UUID",
      },
      notes: {
        label: "Notes",
        description: "Internal notes for this purchase order",
        placeholder: "Rush order",
      },
      lines: {
        label: "Line Items",
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
        label: "Unit Price",
        description: "Price per unit",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "Tax Rate",
        description: "Tax rate as decimal",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "Sort Order",
        description: "Display order of this line",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to update purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a Draft",
          description: "Only draft purchase orders can be edited",
        },
        server: {
          title: "Server Error",
          description: "Failed to update purchase order",
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
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase Order Updated",
        description: "Purchase order updated",
      },
      response: {
        id: "Purchase Order ID",
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
      title: "Send Purchase Order",
      titleShort: "Send Order",
      description: "Mark purchase order as Sent to vendor.",
      poId: {
        label: "Purchase Order ID",
        description: "Purchase order to send",
      },
      widget: {
        back: "Back",
        backToPO: "Back to Purchase Order",
        warning:
          "Sending marks this purchase order as dispatched to the vendor. Status changes from Draft to Sent.",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to send purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a Draft",
          description: "Only draft purchase orders can be sent",
        },
        server: {
          title: "Server Error",
          description: "Failed to send purchase order",
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
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase Order Sent",
        description: "Purchase order marked as Sent",
      },
      response: {
        id: "Purchase Order ID",
        status: "Status",
      },
    },
  },

  // PO confirm
  orderConfirm: {
    post: {
      title: "Confirm Purchase Order",
      titleShort: "Confirm Order",
      description:
        "Vendor has confirmed the purchase order — mark as Confirmed.",
      poId: {
        label: "Purchase Order ID",
        description: "Purchase order to confirm",
      },
      widget: {
        back: "Back",
        backToPO: "Back to Purchase Order",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to confirm purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Invalid Status",
          description: "Only sent purchase orders can be confirmed",
        },
        server: {
          title: "Server Error",
          description: "Failed to confirm purchase order",
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
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase Order Confirmed",
        description: "Purchase order marked as Confirmed",
      },
      response: {
        id: "Purchase Order ID",
        status: "Status",
        confirmedAt: "Confirmed At",
      },
    },
  },

  // PO receive
  orderReceive: {
    post: {
      title: "Receive Goods",
      titleShort: "Receive Goods",
      description:
        "Record receipt of goods against a purchase order. Creates stock movements.",
      widget: {
        backToPO: "Back to Purchase Order",
      },
      poId: {
        label: "Purchase Order ID",
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
        label: "Received Items",
        description: "Quantities received for each line",
      },
      linePoLineId: { label: "Line ID", description: "Purchase order line" },
      lineQuantityReceived: {
        label: "Quantity Received",
        description: "Quantity received for this line",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check all fields and quantities",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to receive goods",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Invalid Status",
          description:
            "Purchase order must be Confirmed or Sent to receive goods",
        },
        server: {
          title: "Server Error",
          description: "Failed to record receipt",
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
          title: "Purchase Order Not Found",
          description: "Purchase order or line not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Goods Received",
        description: "Receipt recorded and stock updated",
      },
      response: {
        receiptId: "Receipt ID",
        status: "Purchase Order Status",
        receivedAt: "Received At",
      },
    },
  },

  // PO convert to bill
  orderConvertToBill: {
    post: {
      title: "Convert to Bill",
      titleShort: "Convert to Bill",
      description: "Create an AP bill from this purchase order.",
      widget: {
        back: "Back",
        viewBill: "View bill",
      },
      poId: {
        label: "Purchase Order ID",
        description: "Purchase order to convert",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create bills",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Already Converted",
          description: "This purchase order was already converted to a bill",
        },
        server: { title: "Server Error", description: "Failed to create bill" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Bill Created",
        description: "AP bill created from purchase order",
      },
      response: {
        billId: "Bill ID",
        billNumber: "Bill Number",
        poId: "Purchase Order ID",
      },
    },
  },

  // PO line add
  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Back to order",
        lineAdded: "Line item added",
      },
      title: "Add Line Item",
      titleShort: "Add Line",
      description: "Add a line item to a purchase order.",
      poId: {
        label: "Purchase Order ID",
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
        label: "Unit Price",
        description: "Price per unit",
        placeholder: "99.00",
      },
      taxRate: {
        label: "Tax Rate",
        description: "Tax rate as decimal (e.g. 0.19 = 19%)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check all fields and try again",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to add line items",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a Draft",
          description: "Only draft purchase orders can be modified",
        },
        server: {
          title: "Server Error",
          description: "Failed to add line item",
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
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Line Added",
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
      title: "Remove Line Item",
      titleShort: "Remove Line",
      description: "Remove a line item from a purchase order.",
      poId: {
        label: "Purchase Order ID",
        description: "Purchase order to remove a line from",
      },
      lineId: { label: "Line ID", description: "Line item to remove" },
      widget: {
        backToOrder: "Back to purchase order",
        warning:
          "This will permanently remove the line item from the purchase order.",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid IDs",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to remove line items",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Not a Draft",
          description: "Only draft purchase orders can be modified",
        },
        server: {
          title: "Server Error",
          description: "Failed to remove line item",
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
          description: "Purchase order or line item not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Line Removed",
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
      title: "Purchasing Overview",
      titleShort: "Overview",
      description:
        "Live snapshot of purchase orders and supplier activity for your company.",
      widget: {
        kpiDraft: "Drafts",
        kpiConfirmed: "Confirmed",
        kpiAwaitingReceipt: "Awaiting Receipt",
        kpiActiveVendors: "Active Vendors",
        warningDueThisWeek:
          "{{count}} purchase order due this week — check delivery dates",
        warningDueThisWeekPlural:
          "{{count}} purchase orders due this week — check delivery dates",
        navNewPo: "New Purchase Order",
        navAllPos: "All Purchase Orders",
        navVendors: "Vendors",
        navNewVendor: "New Vendor",
        loading: "Loading…",
      },
      companyId: {
        label: "Company",
        description: "Company to show purchasing stats for (optional)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view purchasing overview",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load purchasing overview",
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
        description: "Purchasing overview retrieved",
      },
      response: {
        draftCount: "Draft Purchase Orders",
        confirmedCount: "Confirmed Purchase Orders",
        awaitingReceiptCount: "Awaiting Receipt",
        activeVendorCount: "Active Vendors",
        dueThisWeekCount: "Due This Week",
      },
    },
  },

  // PO cancel
  orderCancel: {
    post: {
      title: "Cancel Purchase Order",
      titleShort: "Cancel Order",
      description: "Cancel a Draft or Sent purchase order.",
      poId: {
        label: "Purchase Order ID",
        description: "Purchase order to cancel",
      },
      widget: {
        back: "Back",
        warning:
          "This will permanently cancel the purchase order. Only draft or sent purchase orders can be cancelled.",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid purchase order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to cancel purchase orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this purchase order",
        },
        conflict: {
          title: "Cannot Cancel",
          description: "Only draft or sent purchase orders can be cancelled",
        },
        server: {
          title: "Server Error",
          description: "Failed to cancel purchase order",
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
          title: "Purchase Order Not Found",
          description: "Purchase order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Purchase Order Cancelled",
        description: "Purchase order cancelled",
      },
      response: {
        id: "Purchase Order ID",
        status: "Status",
      },
    },
  },
};
