export const translations = {
  tags: { antiFarming: "anti-farming", admin: "admin" },
  get: {
    title: "Free Credit Farming Report",
    titleShort: "Farming Report",
    description:
      "Who is farming free credits. Top subnets by blocked attempts and by free pools claimed, top email domains among duplicate and disposable signups, and the active limits.",
    fields: {
      days: {
        label: "Window (days)",
        description:
          "Look back this many days for blocked attempts, guest pools and email domains. Account pools always count the current UTC month.",
      },
    },
    response: {
      window: "Window",
      thresholds: "Active limits",
      totals: "Blocked attempts",
      subnetsByBlocked: "Top subnets by blocked attempts",
      subnetsByClaims: "Top subnets by free pools claimed",
      emailDomains: "Top email domains",
    },
    success: {
      title: "Farming report ready",
      description: "Anti-farming report generated",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Sign in first",
      },
      forbidden: { title: "Forbidden", description: "Admins only" },
      server: {
        title: "Server error",
        description: "Could not build the farming report",
      },
      unknown: {
        title: "Unknown error",
        description: "Something went wrong",
      },
      validation: {
        title: "Invalid request",
        description: "Days must be between 1 and 365",
      },
      notFound: { title: "Not found", description: "Nothing found" },
      conflict: { title: "Conflict", description: "Request conflicts" },
      network: {
        title: "Network error",
        description: "Request did not reach the server",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save your changes first",
      },
    },
  },
  widget: {
    refresh: "Refresh",
    loading: "Loading farming report...",
    windowLine:
      "Last {{days}} days (since {{from}}). Account pools: {{month}} (UTC).",
    kpi: {
      total: "Blocked total",
      subnetAccountLimit: "Account limit hit",
      subnetGuestLimit: "Guest limit hit",
      duplicateEmail: "Duplicate email",
      disposableEmail: "Disposable email",
    },
    col: {
      subnet: "Subnet",
      blocked: "Blocked",
      accountGranted: "Acct ok",
      accountBlocked: "Acct no",
      guestGranted: "Guest ok",
      guestBlocked: "Guest no",
      lastSeen: "Last seen",
      domain: "Domain",
      duplicate: "Duplicate",
      disposable: "Disposable",
      total: "Total",
    },
    colHint:
      "Acct = account pools this month, Guest = guest pools in the window. ok = got free credits, no = subnet budget full.",
    empty: {
      subnets: "No subnet activity in this window.",
      domains: "No duplicate or disposable signups in this window.",
    },
    limits: {
      accountPerSubnet: "Account pools per subnet per month",
      guestPerSubnet: "Guest pools per subnet per day",
      guestIpWindow: "Guests on one IP share a pool for (hours)",
      signupLookback: "Guest spend carried into signup from (hours)",
      subnetPrefix: "Subnet size",
    },
  },
};
