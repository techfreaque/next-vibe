export const translations = {
  category: "Point of Sale",
  tags: {
    pos: "POS",
    terminal: "Terminal",
    session: "Session",
    order: "Order",
    payment: "Payment",
    create: "Create",
    list: "List",
    get: "Get",
    open: "Open",
    close: "Close",
    complete: "Complete",
    void: "Void",
    addItem: "Add Item",
    removeItem: "Remove Item",
    addPayment: "Add Payment",
  },
  endpointCategories: {
    pos: "Point of Sale",
    terminals: "Terminals",
    sessions: "Sessions",
    orders: "Orders",
  },
  enums: {
    sessionStatus: {
      open: "Open",
      closed: "Closed",
    },
    orderStatus: {
      open: "Open",
      completed: "Completed",
      voided: "Voided",
    },
    paymentMethod: {
      cash: "Cash",
      card: "Card",
      transfer: "Transfer",
      other: "Other",
    },
  },

  // POS Dashboard
  dashboard: {
    get: {
      title: "POS Dashboard",
      titleShort: "POS Dashboard",
      description: "Overview of terminals, active sessions, and today's sales.",
      widget: {
        loading: "Loading dashboard...",
        loadingHint: "Fetching your POS data.",
        kpiTerminals: "Terminals (active / total)",
        kpiOpenSessions: "Open sessions",
        kpiTodayOrders: "Today's orders",
        kpiTodaySales: "Today's revenue",
        terminalsHeading: "Terminals",
        refresh: "Refresh",
        openSession: "Open session",
        viewOrders: "View orders",
        viewSession: "View session",
        allTerminals: "All terminals",
        statusActive: "Active",
        statusInactive: "Inactive",
        statusSessionOpen: "Session open",
        emptyTerminals: "No terminals configured.",
        emptyTerminalsHint:
          "Contact your administrator to set up POS terminals.",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view the POS dashboard",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to POS data",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load dashboard",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "No POS data found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Dashboard Loaded",
        description: "POS overview retrieved",
      },
      response: {
        terminalsTotal: "Total Terminals",
        terminalsActive: "Active Terminals",
        openSessionsCount: "Open Sessions",
        todayOrderCount: "Today's Orders",
        todaySalesTotal: "Today's Revenue",
        currency: "Currency",
        terminalId: "Terminal ID",
        terminalName: "Terminal Name",
        terminalLocation: "Location",
        terminalCurrency: "Currency",
        terminalIsActive: "Active",
        terminalHasOpenSession: "Session Open",
        terminalOpenSessionId: "Open Session ID",
      },
    },
  },

  // Terminal create
  terminalCreate: {
    post: {
      title: "Create Terminal",
      titleShort: "Create Terminal",
      description: "Register a new POS terminal for a company.",
      widget: {
        backToList: "Back to terminals",
        active: "Active",
        inactive: "Inactive",
        openSession: "Open session",
      },
      companyId: {
        label: "Company ID",
        description: "Company this terminal belongs to",
      },
      name: {
        label: "Terminal Name",
        description: "Name for this terminal",
        placeholder: "Main Register",
      },
      location: {
        label: "Location",
        description: "Physical location of the terminal",
        placeholder: "Front desk",
      },
      currency: {
        label: "Currency",
        description: "Default currency (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Cash Account Node",
        description: "Account node for the cash drawer",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create terminals",
        },
        forbidden: {
          title: "Admin Required",
          description: "Only admins can create terminals",
        },
        conflict: {
          title: "Conflict",
          description: "A terminal with this name already exists",
        },
        server: {
          title: "Server Error",
          description: "Failed to create terminal — try again",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Resource not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Terminal Created",
        description: "Terminal registered successfully",
      },
      response: {
        id: "Terminal ID",
        name: "Terminal Name",
        companyId: "Company ID",
        currency: "Currency",
        isActive: "Active",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Terminals",
      titleShort: "Terminals",
      description: "List all terminals for a company.",
      widget: {
        active: "Active",
        inactive: "Inactive",
        total: "terminals",
        createTerminal: "New terminal",
        empty: "No terminals configured.",
        emptyHint:
          "Terminals are the physical registers in your store. Contact your administrator to set them up.",
        emptyContact: "Contact your administrator",
        openSession: "Open session",
        selectCompany: "Loading terminals...",
        selectCompanyHint: "Fetching your terminals.",
        loading: "Loading terminals...",
        loadingHint: "Fetching your terminals.",
        refresh: "Refresh",
        back: "Back",
      },
      companyId: {
        label: "Company ID",
        description: "Company to list terminals for",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to list terminals",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to list terminals",
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
        title: "Terminals Loaded",
        description: "Terminal list retrieved",
      },
      response: {
        id: "Terminal ID",
        name: "Terminal Name",
        location: "Location",
        currency: "Currency",
        isActive: "Active",
        createdAt: "Created At",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Open Session",
      titleShort: "Open Session",
      description: "Start a cashier session on a terminal.",
      widget: {
        viewOrders: "View orders",
        backToTerminals: "Back to terminals",
        selectTerminal: "Terminal ready",
        selectTerminalHint: "Set the opening float and open the session.",
        terminal: "Terminal",
        readyToOpen: "Ready",
        floatHint: "Count the cash in the drawer before opening.",
        startOrders: "Start Taking Orders",
      },
      terminalId: {
        label: "Terminal ID",
        description: "Terminal to open session on",
      },
      openingFloat: {
        label: "Opening Float",
        description: "Cash in drawer at session start",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to open a session",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this terminal",
        },
        conflict: {
          title: "Session Already Open",
          description: "This terminal already has an open session",
        },
        server: {
          title: "Server Error",
          description: "Failed to open session",
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
          title: "Terminal Not Found",
          description: "Terminal does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Session Opened",
        description: "Session started successfully",
      },
      response: {
        id: "Session ID",
        terminalId: "Terminal ID",
        openedAt: "Opened At",
        status: "Status",
        openingFloat: "Opening Float",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      title: "Close Session",
      titleShort: "Close Session",
      description: "Close a cashier session and record the closing float.",
      widget: {
        backToTerminals: "Back to terminals",
        sessionSummary: "Session Summary",
        terminal: "Terminal",
        openedAt: "Opened at",
        orderCount: "Orders",
        sessionRevenue: "Revenue",
        floatHint: "Count the cash in the drawer before closing.",
        reconciliation: "End of Day",
        sessionReady: "Session",
        active: "Active",
        openingFloat: "Opening Float",
        cashSales: "Cash Sales",
        expectedClosingFloat: "Expected Closing Float",
        actualClosingFloat: "Actual Closing Float",
        variance: "Variance",
        reconciliationTitle: "Cash Reconciliation",
      },
      sessionId: { label: "Session ID", description: "Session to close" },
      closingFloat: {
        label: "Closing Float",
        description: "Cash counted in drawer at close",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to close a session",
        },
        forbidden: {
          title: "Access Denied",
          description: "You can only close your own session",
        },
        conflict: {
          title: "Session Already Closed",
          description: "This session is already closed",
        },
        server: {
          title: "Server Error",
          description: "Failed to close session",
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
          title: "Session Not Found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Session Closed",
        description: "Session closed successfully",
      },
      response: {
        id: "Session ID",
        status: "Status",
        closedAt: "Closed At",
        closingFloat: "Closing Float",
        expectedFloat: "Expected Float",
        cashSalesTotal: "Cash Sales",
        variance: "Variance",
        orderCount: "Order Count",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Get Session",
      titleShort: "Session Details",
      description: "Retrieve details for a specific session.",
      widget: {
        viewOrders: "View orders",
        closeSession: "Close session",
        newOrder: "New order",
        sessionDetails: "Session Details",
        loading: "Loading session...",
        back: "Back",
      },
      sessionId: { label: "Session ID", description: "Session to retrieve" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid session ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view sessions",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this session",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load session",
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
          title: "Session Not Found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Session Loaded",
        description: "Session details retrieved",
      },
      response: {
        id: "Session ID",
        terminalId: "Terminal ID",
        cashierUserId: "Cashier",
        status: "Status",
        openedAt: "Opened At",
        closedAt: "Closed At",
        openingFloat: "Opening Float",
        closingFloat: "Closing Float",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "Create Order",
      titleShort: "Create Order",
      description: "Create a new order in an open session.",
      widget: {
        addItem: "Add Item",
        viewOrder: "View order",
        creating: "Opening order...",
        back: "Back",
      },
      sessionId: {
        label: "Session ID",
        description: "Session to create the order in",
      },
      customerId: {
        label: "Customer ID",
        description: "Optional customer reference",
      },
      currency: {
        label: "Currency",
        description: "Order currency",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to create orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this session",
        },
        conflict: {
          title: "Session Closed",
          description: "Cannot create orders in a closed session",
        },
        server: {
          title: "Server Error",
          description: "Failed to create order",
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
          title: "Session Not Found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Order Created",
        description: "Order created successfully",
      },
      response: {
        id: "Order ID",
        orderNumber: "Order Number",
        sessionId: "Session ID",
        status: "Status",
        currency: "Currency",
        total: "Total",
      },
    },
  },

  // Order add item
  orderAddItem: {
    post: {
      title: "Add Item",
      titleShort: "Add Item",
      description: "Add a line item to an open order.",
      widget: {
        backToOrder: "Back to order",
        linePreview: "Line total",
        taxNote: "incl. tax",
        multiplier: "×",
        addAnother: "Add Another Item",
        searchProduct: "Search product catalog",
        searchPlaceholder: "Name or SKU…",
        orManual: "Or enter manually",
        selectedProduct: "Selected product",
        clearProduct: "Clear",
        searchButton: "Search",
        noProductResults: "No matches — enter manually below.",
      },
      orderId: { label: "Order ID", description: "Order to add item to" },
      productId: {
        label: "Product ID",
        description: "Optional product reference",
      },
      itemDescription: {
        label: "Description",
        description: "Item description",
        placeholder: "Coffee",
      },
      quantity: {
        label: "Quantity",
        description: "Quantity",
        placeholder: "1",
      },
      unitPrice: {
        label: "Unit Price",
        description: "Price per unit",
        placeholder: "3.50",
      },
      taxRate: {
        label: "Tax Rate",
        description: "Tax rate as decimal (e.g. 0.2 for 20%)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to add items",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order Not Open",
          description: "Cannot add items to a non-open order",
        },
        server: { title: "Server Error", description: "Failed to add item" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Order Not Found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Item Added", description: "Item added to order" },
      response: {
        id: "Item ID",
        description: "Description",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        taxAmount: "Tax Amount",
        lineTotal: "Line Total",
        orderTotal: "Order Total",
      },
    },
  },

  // Order remove item
  orderRemoveItem: {
    post: {
      title: "Remove Item",
      titleShort: "Remove Item",
      description: "Remove a line item from an open order.",
      widget: {
        backToOrder: "Back to order",
      },
      orderId: { label: "Order ID", description: "Order to remove item from" },
      itemId: { label: "Item ID", description: "Item to remove" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to remove items",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order Not Open",
          description: "Cannot remove items from a non-open order",
        },
        server: { title: "Server Error", description: "Failed to remove item" },
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
          description: "Order or item not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Item Removed",
        description: "Item removed from order",
      },
      response: {
        orderId: "Order ID",
        orderTotal: "Updated Total",
      },
    },
  },

  // Order complete
  orderComplete: {
    post: {
      title: "Complete Order",
      titleShort: "Complete Order",
      description:
        "Complete an order. Validates full payment and posts journal entry.",
      widget: {
        backToList: "Back to orders",
        confirmTitle: "Complete this order?",
        confirmHint: "This cannot be undone. All payments must be collected.",
        orderNumber: "Order",
        cancel: "Cancel",
      },
      orderId: { label: "Order ID", description: "Order to complete" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to complete orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Unpaid Balance",
          description: "Total payments do not cover the order total",
        },
        server: {
          title: "Server Error",
          description: "Failed to complete order",
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
          title: "Order Not Found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Order Completed",
        description: "Order completed and journal entry posted",
      },
      response: {
        id: "Order ID",
        status: "Status",
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
      description: "Void an open order. Cannot be undone.",
      widget: {
        backToList: "Back to orders",
      },
      orderId: { label: "Order ID", description: "Order to void" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to void orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order Not Open",
          description: "Only open orders can be voided",
        },
        server: { title: "Server Error", description: "Failed to void order" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Order Not Found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Order Voided", description: "Order has been voided" },
      response: {
        id: "Order ID",
        status: "Status",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "Get Order",
      titleShort: "Order Details",
      description: "Retrieve a single order with its items and payments.",
      widget: {
        addItem: "Add item",
        addPayment: "Add payment",
        complete: "Complete order",
        void: "Void order",
        back: "Back",
        outstanding: "Outstanding",
        fullyPaid: "Fully paid",
        qtyTimesPrice: "×",
        loading: "Loading order...",
        noItems: "No items yet — add the first item.",
        viewJournalEntry: "View Journal Entry",
        voidedStamp: "VOIDED",
        completedReadOnly: "This order is completed and cannot be modified.",
        select: "Select order",
      },
      orderId: { label: "Order ID", description: "Order to retrieve" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid order ID",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this order",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: { title: "Server Error", description: "Failed to load order" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Order Not Found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Order Loaded",
        description: "Order details retrieved",
      },
      response: {
        id: "Order ID",
        orderNumber: "Order Number",
        sessionId: "Session ID",
        customerId: "Customer ID",
        status: "Status",
        currency: "Currency",
        subtotal: "Subtotal",
        taxAmount: "Tax",
        total: "Total",
        journalEntryId: "Journal Entry ID",
        createdAt: "Created At",
        items: "Items",
        itemId: "Item ID",
        productId: "Product ID",
        description: "Description",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        taxRate: "Tax Rate",
        taxAmountItem: "Tax",
        lineTotal: "Line Total",
        payments: "Payments",
        paymentId: "Payment ID",
        method: "Method",
        amount: "Amount",
        change: "Change",
        reference: "Reference",
      },
    },
  },

  // Order list
  orderList: {
    get: {
      title: "Orders",
      titleShort: "Orders",
      description:
        "List orders for a session or terminal with optional status filter.",
      widget: {
        newOrder: "New order",
        empty: "No orders in this session yet.",
        emptyHint: "Start a new order to begin selling.",
        back: "Back",
        backToTerminals: "Back to terminals",
        selectSession: "Select a session",
        selectSessionHint: "Enter a session ID to view its orders.",
        sessionTotal: "Session total",
        filterAll: "All",
        loading: "Loading orders...",
        ordersTotal: "orders",
        tapToView: "tap to view",
      },
      sessionId: {
        label: "Session ID",
        description: "Session to list orders for",
      },
      status: {
        label: "Status",
        description: "Filter by order status",
        placeholder: "All statuses",
      },
      page: { label: "Page", description: "Page number (starts at 1)" },
      pageSize: {
        label: "Per Page",
        description: "Results per page (max 100)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to list orders",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this session",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: { title: "Server Error", description: "Failed to list orders" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Session Not Found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Orders Loaded", description: "Order list retrieved" },
      response: {
        count: "Total",
        id: "Order ID",
        orderNumber: "Order Number",
        sessionId: "Session ID",
        status: "Status",
        currency: "Currency",
        total: "Total",
        createdAt: "Created At",
      },
    },
  },

  // Product lookup (POS catalog search)
  productLookup: {
    get: {
      title: "Product Search",
      titleShort: "Product Search",
      description:
        "Search catalog products by name or SKU for quick POS entry.",
      widget: {
        noResults: "No products found — try a different search.",
        tax: "tax",
        back: "Back",
      },
      companyId: {
        label: "Company ID",
        description: "Limit search to a specific company",
      },
      query: {
        label: "Search",
        description: "Search by product name or SKU",
        placeholder: "Coffee, BEV-001…",
      },
      page: { label: "Page", description: "Page number (starts at 1)" },
      pageSize: { label: "Per Page", description: "Results per page (max 50)" },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Enter at least one character to search",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to search products",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to search products",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "No products found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Products Found",
        description: "Matching products retrieved",
      },
      response: {
        id: "Product ID",
        name: "Name",
        sku: "SKU",
        type: "Type",
        basePrice: "Price",
        currency: "Currency",
        defaultTaxRate: "Tax Rate",
        unit: "Unit",
      },
    },
  },

  // Order add payment
  orderAddPayment: {
    post: {
      title: "Add Payment",
      titleShort: "Add Payment",
      description: "Record a payment against an open order.",
      widget: {
        fullyPaid: "Fully paid",
        backToOrder: "Back to order",
        amountDue: "Amount due",
        changeLabel: "Change",
        changeHint: "Return to customer",
        addAnotherPayment: "Add Another Payment",
      },
      orderId: { label: "Order ID", description: "Order to pay" },
      method: {
        label: "Payment Method",
        description: "How the customer pays",
        placeholder: "Select method",
      },
      amount: {
        label: "Amount",
        description: "Amount tendered",
        placeholder: "0.00",
      },
      change: {
        label: "Change",
        description: "Change returned to customer",
        placeholder: "0.00",
      },
      reference: {
        label: "Reference",
        description: "Card authorisation code or transfer reference",
      },
      accountNodeId: {
        label: "Account Node",
        description: "Receiving account node (overrides terminal default)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to add payments",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order Not Open",
          description: "Cannot add payments to a non-open order",
        },
        server: {
          title: "Server Error",
          description: "Failed to record payment",
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
          title: "Order Not Found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Payment Recorded",
        description: "Payment recorded against order",
      },
      response: {
        id: "Payment ID",
        method: "Method",
        amount: "Amount",
        change: "Change",
        totalPaid: "Total Paid",
        outstanding: "Outstanding",
      },
    },
  },
};
