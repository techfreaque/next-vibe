export const translations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "credits/day",
    lead: "Visitor",
    ip: "IP address",
    globalCap: "Daily cap reached",
    leadCap: "Visitor limit reached",
    ipCap: "IP limit reached",
    singleRequest: "Request too expensive",
    failClosed: "Blocked, cap check failed",
    poolReserved: "Credits reserved",
    threshold80: "80% of cap used",
    threshold100: "Cap fully used",
    other: "Other",
    changeCap: "Change cap",
    limits: "Limits",
    capHint: "Shared by every visitor without a paid plan",
    usedOfCap: "{{used}} of {{cap}} used",
    exceededHint: "Free visitors are blocked until the daily reset.",
    resetAt: "Last reset {{time}}",
    title: "Free-tier cap",
    titleShort: "Free-tier cap",
    description: "View today's global free-tier credit spend and cap",
    container: {
      title: "Free-tier daily cap",
      description: "Global daily spend limit for non-paying users",
    },
    spendToday: {
      content: "Spent today",
    },
    capAmount: {
      content: "Daily cap",
    },
    remainingToday: {
      content: "Remaining today",
    },
    percentUsed: {
      content: "Used",
    },
    lastResetAt: {
      content: "Last reset",
    },
    capExceeded: {
      content: "Cap exceeded",
    },
    perLeadCap: { content: "Per visitor" },
    perIpCap: { content: "Per IP address" },
    topSpenders: { content: "Top free spenders today" },
    recentEvents: { content: "Recent cap events" },
    noData: "Nothing yet today.",
    success: {
      title: "Cap status loaded",
      description: "Public free-tier cap status retrieved successfully",
    },
    errors: {
      validation: {
        title: "Check the form",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not found",
        description: "Cap configuration not found",
      },
      server: {
        title: "Server error",
        description: "Failed to retrieve cap status",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
    },
  },
  post: {
    perDayUnit: "credits per day",
    back: "Back",
    decrease: "Decrease by 100",
    increase: "Increase by 100",
    title: "Update free-tier cap",
    titleShort: "Update cap",
    description:
      "Update the global daily credit spend cap for non-paying users",
    capAmount: {
      label: "Daily cap (credits)",
      description:
        "Maximum credits non-paying users can collectively spend per day",
      placeholder: "e.g. 500",
    },
    perLeadCap: {
      label: "Per visitor per day (credits)",
      description: "Max free credits one guest/lead can burn per day",
      placeholder: "e.g. 20",
    },
    perIpCap: {
      label: "Per IP address per day (credits)",
      description: "Max free credits one IP can burn per day",
      placeholder: "e.g. 40",
    },
    message: {
      content: "Result",
    },
    success: {
      title: "Cap updated",
      description: "Daily cap updated successfully",
    },
    errors: {
      validation: {
        title: "Check the form",
        description: "Cap amount must be a positive number",
      },
      network: {
        title: "Network error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not found",
        description: "Cap configuration not found",
      },
      server: {
        title: "Server error",
        description: "Failed to update cap",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
    },
  },
  repository: {
    capUpdated: "Daily cap set to {{capAmount}} credits",
    capExceeded:
      "Today's free allowance can't cover this request. Try again tomorrow or use paid credits.",
    leadCapExceeded:
      "Daily free limit reached on this device or network. Your free credits stay in your account and work again tomorrow. Paid credits work right away.",
    reservedByRunningReply:
      "Your free credits are still covering a reply in progress. Let it finish, then send again.",
    capUnavailable:
      "Free credits are temporarily unavailable. Try again later.",
    getCapFailed: "Failed to retrieve free-tier cap configuration",
    updateCapFailed: "Failed to update free-tier cap",
    incrementFailed: "Failed to record free-tier spend",
  },
};
