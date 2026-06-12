export const translations = {
  get: {
    title: "Referral Dashboard",
    titleShort: "Admin Referrals",
    description: "Referral codes, earnings and payouts",
    form: {
      title: "Referral Management",
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
      label: "Payout Status",
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
      label: "Sort By",
      description: "Sort field",
      placeholder: "Select sort field...",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort direction",
      placeholder: "Select order...",
    },
    response: {
      title: "Referrals",
      description: "Referral program data",
      summary: {
        title: "Summary",
        description: "Aggregate referral stats",
        totalCodes: { label: "Total Codes" },
        totalSignups: { label: "Total Signups" },
        totalEarned: { label: "Total Earned" },
        totalPaidOut: { label: "Total Paid Out" },
        pendingPayouts: { label: "Pending Payouts" },
      },
      codes: {
        code: "Code",
        ownerEmail: "Owner",
        ownerName: "Name",
        currentUses: "Clicks",
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
        rejectionReason: "Rejection Reason",
        createdAt: "Requested",
        processedAt: "Processed",
      },
      totalCount: "Total",
      pageCount: "Total Pages",
    },
    page: { label: "Page" },
    limit: { label: "Per Page" },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Login required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server Error",
        description: "Unable to retrieve referrals",
      },
      unknown: {
        title: "Unknown Error",
        description: "Unexpected error",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network Error",
        description: "Unable to connect",
      },
      notFound: {
        title: "Not Found",
        description: "No referral data found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: { title: "Success", description: "Referrals retrieved" },
  },
  post: {
    title: "Payout Action",
    titleShort: "Payout Action",
    description: "Approve, reject, or complete a payout request",
    form: {
      title: "Payout Action",
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
      label: "Admin Notes",
      description: "Optional notes",
      placeholder: "Add notes...",
    },
    rejectionReason: {
      label: "Rejection Reason",
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
        title: "Validation Error",
        description: "Invalid parameters",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server Error",
        description: "Unable to process payout",
      },
      unknown: {
        title: "Unknown Error",
        description: "Unexpected error",
      },
      conflict: {
        title: "Conflict",
        description: "Payout already processed",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect",
      },
      notFound: {
        title: "Not Found",
        description: "Payout request not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
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
    sectionCodes: "Referral Codes",
    sectionPayouts: "Payout Requests",
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
};
