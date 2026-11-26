export const translations = {
  acquisition: {
    title: "Lead acquisition",
    fields: { currency: "Revenue currency" },
  },
  get: {
    title: "Referral dashboard",
    titleShort: "Referral activity",
    description: "Referral codes, earnings and payouts",
    form: {
      title: "Referral management",
      description: "Manage referral program",
    },
    searchFilters: {
      title: "Search & Filters",
      description: "Filter referral data",
    },
    search: {
      label: "Search",
      description: "Search by user email",
      placeholder: "Search referrals...",
    },
    payoutStatus: {
      label: "Payout status",
      description: "Filter by payout request status",
      placeholder: "Any status",
    },
    dateFrom: {
      label: "From",
      description: "Start date filter",
    },
    dateTo: {
      label: "To",
      description: "End date filter",
    },
    sortingOptions: {
      title: "Sorting",
      description: "Configure result sorting",
    },
    sortBy: {
      label: "Sort by",
      description: "Sort field",
      placeholder: "Select sort field...",
    },
    sortOrder: {
      label: "Sort order",
      description: "Sort direction",
      placeholder: "Select order...",
    },
    response: {
      title: "Referrals",
      description: "Referral program data",
      summary: {
        title: "Summary",
        description: "Aggregate referral stats",
        totalCodes: { label: "Total codes" },
        totalSignups: { label: "Total signups" },
        totalEarned: { label: "Total earned" },
        totalPaidOut: { label: "Total paid out" },
        pendingPayouts: { label: "Pending payouts" },
      },
      codes: {
        code: "Code",
        ownerEmail: "Owner",
        ownerName: "Name",
        currentUses: "Code uses",
        totalSignups: "Signups",
        totalEarned: "Earned",
        isActive: "Active",
        createdAt: "Created",
      },
      payoutRequests: {
        id: "ID",
        userEmail: "User",
        amountCents: "Amount",
        currency: "Currency",
        status: "Status",
        walletAddress: "Wallet",
        adminNotes: "Notes",
        rejectionReason: "Rejection reason",
        createdAt: "Requested",
        processedAt: "Processed",
      },
      totalCount: "Total",
      pageCount: "Total pages",
    },
    page: { label: "Page" },
    limit: { label: "Per page" },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Login required",
      },
      validation: {
        title: "Validation error",
        description: "Invalid parameters",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Unable to retrieve referrals",
      },
      unknown: {
        title: "Unknown error",
        description: "Unexpected error",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network error",
        description: "Unable to connect",
      },
      notFound: {
        title: "Not found",
        description: "No referral data found",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Unsaved changes",
      },
    },
    success: { title: "Success", description: "Referrals retrieved" },
  },
  post: {
    title: "Payout action",
    titleShort: "Payout action",
    description: "Approve, reject, or complete a payout request",
    form: {
      title: "Payout action",
      description: "Process a payout request",
    },
    requestId: {
      label: "Request ID",
      description: "Payout request to process",
      placeholder: "Enter request ID...",
    },
    action: {
      label: "Action",
      description: "Action to take",
      placeholder: "Select action...",
    },
    adminNotes: {
      label: "Admin notes",
      description: "Optional notes",
      placeholder: "Add notes...",
    },
    rejectionReason: {
      label: "Rejection reason",
      description: "Required when rejecting",
      placeholder: "Enter reason...",
    },
    response: {
      title: "Result",
      description: "Action result",
      success: "Success",
      message: "Message",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Login required",
      },
      validation: {
        title: "Validation error",
        description: "Invalid parameters",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Unable to process payout",
      },
      unknown: {
        title: "Unknown error",
        description: "Unexpected error",
      },
      conflict: {
        title: "Conflict",
        description: "Payout already processed",
      },
      network: {
        title: "Network error",
        description: "Unable to connect",
      },
      notFound: {
        title: "Not found",
        description: "Payout request not found",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Unsaved changes",
      },
    },
    success: { title: "Success", description: "Payout processed" },
  },
  widget: {
    noReferrals: "No referral codes found.",
    noPayouts: "No payout requests.",
    approve: "Approve",
    reject: "Reject",
    complete: "Complete",
    sectionCodes: "Referral codes",
    sectionPayouts: "Payout requests",
    refresh: "Refresh",
    codeActive: "Active",
    codeInactive: "Inactive",
    clicks: "clicks",
    signups: "signups",
    earned: "earned",
    confirm: {
      title: "Confirm payout action",
      description:
        "Are you sure you want to proceed with this payout action? This cannot be undone.",
      cancel: "Cancel",
      proceed: "Proceed",
    },
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    payoutStatusFilter: {
      all: "All",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
    },
    referralSortField: {
      createdAt: "Created at",
      earnings: "Total earnings",
      signups: "Signups",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    payoutAction: {
      approve: "Approve",
      reject: "Reject",
      complete: "Complete",
    },
  },
};
