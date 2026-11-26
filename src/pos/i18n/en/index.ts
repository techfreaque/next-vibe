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
  workflow: {
    backToSessionOrders: "Back to session orders",
    receiptTitle: "Receipt",
    amountDue: "Amount due",
    ledgerCurrencyMismatch:
      "This order uses a different currency from the company ledger. Use a terminal or order in the ledger currency before taking payment.",
    postingUnavailable:
      "Could not post this sale. Check the company currency, open accounting period and posting accounts.",
    cashCurrencyMismatch:
      "Cash must use the drawer currency. Choose a different payment method for this order.",
    tenderMinorUnits: "Use whole cents for cash and payments.",
    legacyTenderReview:
      "This order has an earlier fractional-cent payment. Review the recorded tender before collecting more.",
    legacyTenderRecorded:
      "This order retains its original four-decimal amounts.",
    legacyPostingReview:
      "The recorded fractional-cent amounts cannot be posted to the ledger. Review the original tender before closing the sale.",
    viewReceipt: "View receipt",
    openDrawer: "Open drawer",
    warehouse: "Sale warehouse",
    noWarehouse: "No warehouse assigned",
    chooseCompanyFirst: "Select a company first.",
    warehouseInstruction: "Use an active warehouse from the selected company.",
    stockUnavailable:
      "Stock is unavailable at this terminal’s warehouse. Check available quantities before completing the sale.",
  },
  dashboard: {
    get: {
      title: "POS dashboard",
      titleShort: "POS dashboard",
      description: "Overview of terminals, active sessions, and today's sales.",
      widget: {
        title: "Point of sale",
        subtitle:
          "Open a till, ring up sales, close the shift with a cash count.",
        salesHistory: "Sales history",
        newTill: "New till",
        kpiSalesToday: "Sales today",
        kpiSalesCount: "Sales: {{count}}",
        kpiOpenTills: "Open tills",
        kpiTillsTotal: "{{active}} active of {{total}}",
        kpiAverage: "Average sale",
        kpiRefunds: "Refunds today",
        kpiRefundsCount: "Refunds: {{count}}",
        tillsTitle: "Tills",
        manageTills: "Manage tills",
        emptyTitle: "No tills yet",
        emptyMessage: "Add a till to start selling at the counter.",
        createTill: "Add a till",
        tillSelling: "Selling",
        tillReady: "Ready",
        tillInactive: "Inactive",
        openRegister: "Open register",
        openTill: "Open till",
        closeTill: "Close till",
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
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view the POS dashboard",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to POS data",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Failed to load dashboard",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not found", description: "No POS data found" },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Dashboard loaded",
        description: "POS overview retrieved",
      },
      response: {
        terminalsTotal: "Total Terminals",
        terminalsActive: "Active Terminals",
        openSessionsCount: "Open Sessions",
        todayOrderCount: "Today's Orders",
        todaySalesTotal: "Today's Revenue",
        refundsToday: "Refunds Today",
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
      title: "New till",
      titleShort: "New till",
      description:
        "Add a till to a company: name, currency, cash account and stock warehouse.",
      widget: {
        title: "New till",
        subtitle:
          "A till sells in one currency, books cash to one account and takes stock from one warehouse.",
        subtitleCompany:
          "Adds a till to {{company}}. It sells in one currency and books cash to one account.",
        back: "Back",
        backToList: "All tills",
        openTill: "Open till",
        cancel: "Cancel",
        submit: "Create till",
        none: "None",
        sectionTill: "Till",
        sectionMoney: "Money",
        sectionMoneyHint:
          "What the till sells in and where its cash is booked.",
        sectionStock: "Stock",
        sectionStockHint:
          "Completed sales take stock from this warehouse. Skip it if you only sell services.",
        defaultCashAccount: "Company default cash account",
        noWarehouse: "No stock tracking",
        chooseCompanyFirst: "Pick a company first.",
      },
      companyId: {
        label: "Company",
        description: "The company that owns this till",
      },
      name: {
        label: "Name",
        description: "Shown on the till card and on receipts",
        placeholder: "Front counter",
      },
      location: {
        label: "Location",
        description: "Where the till stands. Optional.",
        placeholder: "Ground floor",
      },
      currency: {
        label: "Currency",
        description: "Every sale on this till uses this currency",
        placeholder: "Pick a currency",
      },
      cashAccountNodeId: {
        label: "Cash account",
        description: "Cash taken at this till is booked to this account.",
        invalid: "Pick a postable cash or bank account of this company.",
      },
      warehouseId: {
        label: "Warehouse",
        description: "Stock leaves this warehouse when a sale completes.",
      },
      errors: {
        validation: {
          title: "Check the till",
          description: "Add a name and pick a currency.",
        },
        unauthorized: {
          title: "Sign in required",
          description: "Sign in to add tills.",
        },
        forbidden: {
          title: "Admins only",
          description: "Only company admins can add tills.",
        },
        conflict: {
          title: "Name taken",
          description: "A till with this name already exists.",
        },
        server: {
          title: "Till not created",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Till not created",
          description: "Something went wrong. Try again.",
        },
        network: {
          title: "No connection",
          description: "Check your connection and try again.",
        },
        notFound: {
          title: "Not found",
          description: "The company or warehouse does not exist.",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Finish or discard your changes first.",
        },
      },
      success: {
        title: "Till created",
        description: "Count the drawer and open it to start selling.",
      },
      response: {
        id: "Till",
        name: "Name",
        companyId: "Company",
        currency: "Currency",
        isActive: "Active",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Tills",
      titleShort: "Tills",
      description:
        "Every till of your companies and whether it is selling right now.",
      widget: {
        title: "Tills",
        pickTitle: "Pick a till",
        subtitle:
          "Every register at your counter and whether it is selling right now.",
        summary: "Tills: {{total}} · Selling now: {{selling}}",
        newTill: "New till",
        createTill: "Add a till",
        emptyTitle: "No tills yet",
        emptyMessage: "Add a till to start selling at the counter.",
        selling: "Selling",
        ready: "Ready",
        inactive: "Inactive",
        openRegister: "Open register",
        openTill: "Open till",
        loading: "Loading tills",
        back: "Back",
      },
      companyId: {
        label: "Company",
        description: "Only tills of this company",
      },
      terminalId: {
        label: "Till",
        description: "Only this till",
      },
      errors: {
        validation: {
          title: "Check the filter",
          description: "The company or till is not valid.",
        },
        unauthorized: {
          title: "Sign in required",
          description: "Sign in to see tills.",
        },
        forbidden: {
          title: "No access",
          description: "You are not a member of this company.",
        },
        conflict: {
          title: "Conflict",
          description: "The data changed. Reload and try again.",
        },
        server: {
          title: "Tills not loaded",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Tills not loaded",
          description: "Something went wrong. Try again.",
        },
        network: {
          title: "No connection",
          description: "Check your connection and try again.",
        },
        notFound: {
          title: "Not found",
          description: "This company does not exist.",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Finish or discard your changes first.",
        },
      },
      success: {
        title: "Tills loaded",
        description: "Your tills are up to date.",
      },
      response: {
        id: "Till",
        name: "Name",
        location: "Location",
        currency: "Currency",
        isActive: "Active",
        companyName: "Company",
        openSessionId: "Open shift",
        createdAt: "Created",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Open till",
      titleShort: "Open till",
      description:
        "Start a shift on a till with the cash counted in the drawer.",
      widget: {
        title: "Open till",
        subtitle: "Count the cash in the drawer, then start the shift.",
        back: "Back",
        cancel: "Cancel",
        loadingTill: "Loading till",
        selling: "Selling",
        ready: "Ready",
        inactive: "Inactive",
        alreadyOpen: "This till is already open. Carry on selling.",
        openRegister: "Open register",
        floatHint:
          "The float is the change you start with. Closing the till compares the count against it.",
      },
      terminalId: {
        label: "Till",
        description: "The till to open",
      },
      openingFloat: {
        label: "Opening float",
        description: "Cash in the drawer when the shift starts",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Check the float",
          description: "Enter the cash in the drawer, zero or more.",
        },
        unauthorized: {
          title: "Sign in required",
          description: "Sign in to open a till.",
        },
        forbidden: {
          title: "No access",
          description: "You are not a member of this till's company.",
        },
        conflict: {
          title: "Till already open",
          description: "This till already has an open shift.",
        },
        server: {
          title: "Till not opened",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Till not opened",
          description: "Something went wrong. Try again.",
        },
        network: {
          title: "No connection",
          description: "Check your connection and try again.",
        },
        notFound: {
          title: "Till not found",
          description: "This till does not exist.",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Finish or discard your changes first.",
        },
      },
      success: {
        title: "Till open",
        description: "The shift has started. Ring up the first sale.",
      },
      response: {
        id: "Shift",
        terminalId: "Till",
        openedAt: "Opened",
        status: "Status",
        openingFloat: "Opening float",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      mixedCash:
        "Cash payments in another currency need reconciliation before this drawer can close.",
      title: "Close till",
      titleShort: "Close till",
      description: "Close a cashier session and record the closing float.",
      widget: {
        backToTerminals: "Back",
        sessionSummary: "Session summary",
        terminal: "Terminal",
        openedAt: "Opened at",
        orderCount: "Orders: {{count}}",
        sessionRevenue: "Revenue",
        floatHint: "Count every note and coin in the drawer.",
        reconciliation: "End of day",
        sessionReady: "Session",
        active: "Active",
        openingFloat: "Opening float",
        cashSales: "Cash sales",
        expectedClosingFloat: "Expected in drawer",
        actualClosingFloat: "Counted cash",
        variance: "Variance",
        reconciliationTitle: "Cash count",
        title: "Close till",
        subtitle: "{{terminal}} · open since {{time}}",
        cashRefunds: "Cash refunds",
        balanced: "Drawer balanced",
        over: "Over by {{amount}}",
        short: "Short by {{amount}}",
        openSaleBlocks:
          "A sale is still open on this till. Finish or void it in the register, then close the till.",
        backToPos: "Back to POS",
      },
      sessionId: { label: "Session ID", description: "Session to close" },
      closingFloat: {
        label: "Counted cash",
        description: "Cash counted in drawer at close",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to close a session",
        },
        forbidden: {
          title: "Access denied",
          description: "You can only close your own session",
        },
        conflict: {
          title: "Session already closed",
          description: "This session is already closed",
        },
        server: {
          title: "Server error",
          description: "Failed to close session",
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
          title: "Session not found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Session closed",
        description: "Session closed successfully",
      },
      response: {
        id: "Session ID",
        status: "Status",
        closedAt: "Closed at",
        closingFloat: "Closing float",
        expectedFloat: "Expected float",
        cashSalesTotal: "Cash sales",
        cashRefundsTotal: "Cash refunds",
        openingFloat: "Opening float",
        variance: "Variance",
        orderCount: "Order count",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Shift summary",
      titleShort: "Shift",
      description:
        "One shift on a till: when it opened, who sold and what the drawer should hold.",
      widget: {
        title: "Shift",
        back: "Back",
        loading: "Loading shift",
        selling: "Selling",
        closed: "Closed",
        subtitleOpen: "Open since {{time}}",
        subtitleClosed: "Closed {{time}}",
        sales: "Sales",
        closeTill: "Close till",
        openRegister: "Open register",
        drawerTitle: "Cash drawer",
        variance: "Difference",
        closeSession: "Close till",
        newOrder: "New order",
      },
      sessionId: {
        label: "Shift",
        description: "The shift to show",
      },
      errors: {
        validation: {
          title: "Check the shift",
          description: "This shift link is not valid.",
        },
        unauthorized: {
          title: "Sign in required",
          description: "Sign in to see shifts.",
        },
        forbidden: {
          title: "No access",
          description: "You are not a member of this till's company.",
        },
        conflict: {
          title: "Conflict",
          description: "The data changed. Reload and try again.",
        },
        server: {
          title: "Shift not loaded",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Shift not loaded",
          description: "Something went wrong. Try again.",
        },
        network: {
          title: "No connection",
          description: "Check your connection and try again.",
        },
        notFound: {
          title: "Shift not found",
          description: "This shift does not exist.",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Finish or discard your changes first.",
        },
      },
      success: {
        title: "Shift loaded",
        description: "The drawer figures are up to date.",
      },
      response: {
        id: "Shift",
        terminalId: "Till",
        terminalName: "Till",
        companyName: "Company",
        cashierUserId: "Cashier",
        cashierName: "Cashier",
        status: "Status",
        openedAt: "Opened",
        closedAt: "Closed",
        openingFloat: "Opening float",
        closingFloat: "Counted at close",
        cashSalesTotal: "Cash sales",
        cashRefundsTotal: "Cash refunds",
        expectedCash: "Expected in drawer",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "Create order",
      titleShort: "Create order",
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
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to create orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this session",
        },
        conflict: {
          title: "Session closed",
          description: "Cannot create orders in a closed session",
        },
        server: {
          title: "Server error",
          description: "Failed to create order",
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
          title: "Session not found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Order created",
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
      title: "Add item",
      titleShort: "Add item",
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
        noProductResults: "No matches. Enter the item details below.",
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
        label: "Unit price",
        description: "Price per unit",
        placeholder: "3.50",
      },
      mergeWithLine: {
        label: "Add to matching line",
        description: "Raise the quantity of an existing line for this product",
      },
      taxRate: {
        label: "Tax rate",
        description: "Tax rate as decimal (e.g. 0.2 for 20%)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to add items",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order not open",
          description: "Cannot add items to a non-open order",
        },
        server: { title: "Server error", description: "Failed to add item" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Order not found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Item added", description: "Item added to order" },
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
      title: "Remove item",
      titleShort: "Remove item",
      description: "Remove a line item from an open order.",
      widget: {
        chooseLine: "Select a line item",
        backToOrder: "Back to order",
      },
      orderId: { label: "Order", description: "Order to remove item from" },
      quantity: {
        label: "Quantity to remove",
        description: "Leave empty to remove the whole line",
      },
      itemId: { label: "Line item", description: "Item to remove" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to remove items",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order not open",
          description: "Cannot remove items from a non-open order",
        },
        server: { title: "Server error", description: "Failed to remove item" },
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
          description: "Order or item not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Item removed",
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
      title: "Complete order",
      titleShort: "Complete order",
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
          title: "Validation error",
          description: "Invalid order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to complete orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Unpaid balance",
          description: "Total payments do not cover the order total",
        },
        server: {
          title: "Server error",
          description: "Failed to complete order",
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
          title: "Order not found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Order completed",
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
      title: "Void order",
      titleShort: "Void order",
      description: "Void an open order. Cannot be undone.",
      widget: {
        tendered:
          "Payment has already been recorded. The items and order can no longer be changed.",
        closed: "This order is closed.",
        backToList: "Back to orders",
      },
      orderId: { label: "Order", description: "Order to void" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to void orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order not open",
          description: "Only open orders can be voided",
        },
        server: { title: "Server error", description: "Failed to void order" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Order not found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Order voided", description: "Order has been voided" },
      response: {
        id: "Order ID",
        status: "Status",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "Get order",
      titleShort: "Order details",
      description: "Retrieve a single order with its items and payments.",
      widget: {
        refund: "Refund",
        addItem: "Add item",
        addPayment: "Add payment",
        complete: "Complete order",
        void: "Void order",
        back: "Back",
        outstanding: "Outstanding",
        fullyPaid: "Fully paid",
        qtyTimesPrice: "×",
        loading: "Loading order...",
        noItems: "Add the first item.",
        viewJournalEntry: "View journal entry",
        voidedStamp: "VOIDED",
        completedReadOnly: "This order is completed and cannot be modified.",
        select: "Select order",
      },
      orderId: { label: "Order ID", description: "Order to retrieve" },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid order ID",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to view orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this order",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: { title: "Server error", description: "Failed to load order" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Order not found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Order loaded",
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
        title: "Sales",
        subtitleAll: "Every till sale, newest first.",
        subtitleSession: "Sales of this till session, newest first.",
        openRegister: "Open register",
        colSale: "Sale",
        colTime: "Time",
        colStatus: "Status",
        colTotal: "Total",
        count: "Sales: {{count}}",
        newOrder: "New order",
        empty: "No sales yet",
        emptyHint: "Sales rung up at a till show up here with their receipt.",
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
      companyId: {
        label: "Company",
        description: "Company whose till sales to list",
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
        label: "Per page",
        description: "Results per page (max 100)",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to list orders",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this session",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: { title: "Server error", description: "Failed to list orders" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Session not found",
          description: "Session does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Orders loaded", description: "Order list retrieved" },
      response: {
        terminalName: "Till",
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
      title: "Product search",
      titleShort: "Products",
      description: "Find catalog products by name or SKU, with price and VAT.",
      widget: {
        title: "Products",
        pickTitle: "Pick a product",
        subtitle: "Search by name or SKU. Scanned barcodes match exactly.",
        back: "Back",
        loading: "Loading products",
        emptyTitle: "No products yet",
        emptyMessage:
          "Products you add to the catalog show up here with their price.",
        noMatchTitle: 'Nothing matches "{{query}}"',
        noMatchMessage: "Check the spelling or search by SKU.",
        vat: "VAT {{rate}}",
        noVat: "No VAT",
        perUnit: "per {{unit}}",
      },
      companyId: {
        label: "Company",
        description: "Only products of this company",
      },
      query: {
        label: "Search products",
        description: "Product name or SKU. Leave empty to browse.",
        placeholder: "Name or SKU",
      },
      currency: {
        label: "Currency",
        description: "Only products priced in this currency",
      },
      page: {
        label: "Page",
        description: "Page number, starting at 1",
      },
      pageSize: {
        label: "Per page",
        description: "Results per page, up to 50",
      },
      errors: {
        validation: {
          title: "Check the search",
          description: "Use up to 120 characters.",
        },
        unauthorized: {
          title: "Sign in required",
          description: "Sign in to search products.",
        },
        forbidden: {
          title: "No access",
          description: "You are not a member of this company.",
        },
        conflict: {
          title: "Conflict",
          description: "The data changed. Reload and try again.",
        },
        server: {
          title: "Search failed",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Search failed",
          description: "Something went wrong. Try again.",
        },
        network: {
          title: "No connection",
          description: "Check your connection and try again.",
        },
        notFound: {
          title: "Not found",
          description: "No products found.",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Finish or discard your changes first.",
        },
      },
      success: {
        title: "Products found",
        description: "Results are up to date.",
      },
      response: {
        id: "Product",
        name: "Name",
        sku: "SKU",
        type: "Type",
        basePrice: "Price",
        currency: "Currency",
        defaultTaxRate: "VAT rate",
        unit: "Unit",
      },
    },
  },

  // Order add payment
  orderAddPayment: {
    post: {
      title: "Add payment",
      titleShort: "Add payment",
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
        label: "Payment method",
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
        label: "Account node",
        description: "Receiving account node (overrides terminal default)",
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to add payments",
        },
        forbidden: {
          title: "Access denied",
          description: "No access to this order",
        },
        conflict: {
          title: "Order not open",
          description: "Cannot add payments to a non-open order",
        },
        server: {
          title: "Server error",
          description: "Failed to record payment",
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
          title: "Order not found",
          description: "Order does not exist",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Payment recorded",
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
