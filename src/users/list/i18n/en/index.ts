export const translations = {
  tag: "Users",
  get: {
    title: "Users",
    titleShort: "Users",
    description:
      "Every account with what it paid, what it spends and when it was last active. Search, filter by revenue, activity, signup date or source, sort by any money column.",
    fields: {
      search: {
        label: "Search",
        description: "Email, name, or the start of a user ID",
        placeholder: "Search email, name or ID...",
      },
      roles: {
        label: "Roles",
        description: "Users holding any of these roles",
        placeholder: "Any role",
      },
      accountState: {
        label: "Account state",
        description: "Active, inactive, banned, verified or unverified",
        placeholder: "Any state",
      },
      payer: {
        label: "Paid or free",
        description: "Paid = at least one successful payment ever",
        placeholder: "Paid or free",
      },
      subscription: {
        label: "Subscription",
        description: "Active subscription now, ever subscribed, or never",
        placeholder: "Any subscription",
      },
      lastActive: {
        label: "Last active",
        description:
          "Activity = credit spend (own or linked lead wallets) or a new login",
        placeholder: "Any time",
      },
      signupFrom: {
        label: "Signed up from",
        description: "First signup day to include",
      },
      signupTo: {
        label: "Signed up to",
        description: "Last signup day to include",
      },
      creditsMin: {
        label: "Credits at least",
        description: "Minimum wallet balance",
      },
      creditsMax: {
        label: "Credits at most",
        description: "Maximum wallet balance",
      },
      source: {
        label: "Source",
        description:
          "First-touch channel, UTM source/medium/campaign, referrer host or referral code",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "As referrer",
        description: "Users who share a referral link and what it produced",
        placeholder: "Any",
      },
      sortBy: {
        label: "Sort by",
        description: "Column to sort by",
      },
      sortOrder: {
        label: "Order",
        description: "Ascending or descending",
      },
      page: {
        label: "Page",
        description: "Page number, starts at 1",
      },
      limit: {
        label: "Per page",
        description: "Users per page (max 200)",
      },
    },
    response: {
      users: "Users",
      summary: "Summary",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Log in to view users",
      },
      validation: {
        title: "Invalid filters",
        description: "Check the filter values and try again",
      },
      forbidden: {
        title: "Admins only",
        description: "You need the admin role to view users",
      },
      server: {
        title: "Could not load users",
        description: "The server failed to load the user list",
      },
      unknown: {
        title: "Unexpected error",
        description: "Something went wrong loading users",
      },
      conflict: {
        title: "Conflict",
        description: "The request conflicts with current data",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      notFound: {
        title: "No users",
        description: "No users match these filters",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Users loaded",
      description: "User list loaded",
    },
  },
  enums: {
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    role: {
      admin: "Admin",
      customer: "Customer",
      partnerAdmin: "Partner admin",
      partnerEmployee: "Partner employee",
      public: "Public",
    },
    subscription: {
      any: "Any",
      hasActive: "Active now",
      hadAny: "Ever subscribed",
      never: "Never subscribed",
    },
    referrer: {
      any: "Any",
      hasCode: "Has a referral link",
      hasClicks: "Link got clicks",
      hasSignups: "Link got signups",
      hasSubscribers: "Link got paying subscribers",
    },
    sortField: {
      createdAt: "Signup date",
      lastActive: "Last active",
      credits: "Credit balance",
      totalPaid: "Total paid",
      creditsSpent: "Credits spent",
      email: "Email",
      name: "Name",
    },
    accountState: {
      active: "Active",
      inactive: "Inactive",
      banned: "Banned",
      verified: "Email verified",
      unverified: "Email unverified",
    },
    payer: {
      any: "Paid or free",
      paid: "Paying",
      free: "Never paid",
    },
    lastActive: {
      any: "Any time",
      day: "Last 24 hours",
      week: "Last 7 days",
      month: "Last 30 days",
      dormant: "Dormant 30+ days",
      never: "Never active",
    },
  },
  widget: {
    creditsAny: "Any",
    titleWithCount: "Users ({{count}})",
    loading: "Loading users...",
    never: "Never",
    referredBy: "via {{email}}",
    actions: {
      stats: "Stats",
      refresh: "Refresh",
      newUser: "New user",
      clearFilters: "Clear filters",
      moreFilters: "Filters",
    },
    kpi: {
      matching: "Matching users",
      paying: "Paying",
      payingShare: "{{percent}}% of matching",
      revenue: "Lifetime revenue",
      revenueHint: "Succeeded payments, USD",
      credits: "Credits held",
      creditsHint: "Sum of wallet balances",
    },
    quick: {
      paying: "Paying",
      free: "Never paid",
      activeWeek: "Active 7d",
      dormant: "Dormant 30d+",
      never: "Never active",
    },
    columns: {
      user: "User",
      joined: "Joined",
      lastActive: "Last active",
      credits: "Credits",
      spent: "Spent",
      paid: "Paid",
      subscription: "Plan",
      source: "Source",
      id: "ID",
    },
    flags: {
      admin: "admin",
      banned: "Banned",
      unverified: "Unverified",
    },
    empty: {
      none: "No users yet",
      filtered: "No users match these filters",
      filteredHint: "Loosen a filter or clear them all.",
    },
    pagination: {
      showing: "{{start}}-{{end}} of {{total}}",
    },
    text: {
      header: "{{total}} users | {{paying}} paying | {{paid}} lifetime revenue",
      pageHint: "Page {{page}}/{{pages}}. Next: --page={{next}}",
      detailHint: "Details: vibe users-view --userId=<ID>",
    },
  },
};
