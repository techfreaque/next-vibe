export const translations = {
  tag: "Users",
  get: {
    title: "Users",
    titleShort: "Users",
    description:
      "Every account with what it paid, what it spends and when it was last active. Search, filter by revenue, activity, signup date or source, sort by any money column.",
    fields: {
      hasSpentCredits: "Used credits",
      requiredState: {
        label: "Required state",
        description: "Also require this account state",
      },
      accountLocale: {
        label: "Account locale",
        description: "Exact account locale, such as en-US",
      },
      attributedRefCode: {
        label: "Attributed referral code",
        description:
          "Credited referral code, or first-visit code when no credit exists",
      },
      search: {
        label: "Search accounts",
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
        description: "Activity = credit spend, a login or a payment",
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
      audience: {
        label: "Audience",
        description:
          "Humans only drops admins and test addresses (example.com, .invalid, .test fixtures)",
        placeholder: "Everyone",
      },
      channel: {
        label: "Channel",
        description:
          "First-touch channel, exact match (google, youtube, direct). Use none for accounts without a journey",
        placeholder: "youtube",
      },
      channelType: {
        label: "Channel type",
        description: "How the first touch reached us",
        placeholder: "Any type",
      },
      refCode: {
        label: "Ref code",
        description:
          "Referral code from the first visit or the credited referral, exact match",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Plan",
        description: "Active or trialing subscription on this plan",
        placeholder: "Any plan",
      },
      activeFrom: {
        label: "Spent credits from",
        description: "Had credit usage on or after this day",
      },
      activeTo: {
        label: "Spent credits to",
        description: "Had credit usage on or before this day",
      },
      spentMin: {
        label: "Spent at least",
        description:
          "Lifetime credits spent. Combine with Never paid to find free burners",
      },
      paidFrom: {
        label: "Paid from",
        description: "Had a successful payment on or after this day",
      },
      paidTo: {
        label: "Paid to",
        description: "Had a successful payment on or before this day",
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
    audience: {
      all: "Everyone",
      humans: "Humans only",
    },
    channelType: {
      campaign: "Campaign",
      referral: "Referral",
      organic: "Organic",
      direct: "Direct",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
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
    spent30d: "{{count}} in 30d",
    notTracked: "not tracked",
    oneOff: "Credits only",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Paid",
      signedUp: "Signed up",
      spentCredits: "Spent credits",
      remove: "Remove filter {{label}}",
    },
    creditsAny: "Any",
    titleWithCount: "Users ({{count}})",
    loading: "Loading users...",
    never: "Never",
    referredBy: "via {{email}}",
    actions: {
      open: "Open",
      select: "Select",
      openUser: "Open account for {{email}}",
      selectUser: "Select {{email}}",
      stats: "Signups report",
      refresh: "Refresh",
      newUser: "New user",
      clearFilters: "Clear filters",
      moreFilters: "Filters",
    },
    kpi: {
      activeSpentHint: "{{credits}} credits spent in 30 days",
      matchingHint:
        "Signups per week, last 12 full weeks. Last week: {{last}}, this week so far: {{count}}",
      verified: "Email verified",
      verifiedHint: "{{count}} accounts",
      active: "Active 30d",
      matching: "Matching users",
      paying: "Paying",
      payingShare: "{{percent}}% of matching",
      revenue: "Lifetime revenue",
      revenueHint: "Succeeded payments, USD",
      credits: "Credits held",
      creditsHint: "Sum of wallet balances",
    },
    quick: {
      freeBurn: "Free burn {{min}}+ ({{count}})",
      banned: "Banned ({{count}})",
      humans: "Humans only",
      paying: "Paying ({{count}})",
      free: "Never paid",
      activeWeek: "Active 7d",
      dormant: "Dormant 30d+",
      never: "Never active",
    },
    columns: {
      flags: "Flags",
      user: "User",
      joined: "Joined",
      lastActive: "Last active",
      credits: "Balance",
      spent: "Spent (lifetime)",
      paid: "Paid",
      subscription: "Plan",
      source: "Source",
      id: "ID",
    },
    compact: {
      joined: "joined {{date}}",
      active: "active {{when}}",
      neverActive: "never active",
      paid: "paid {{amount}}",
      free: "never paid",
      spent: "{{count}} credits spent",
    },
    flags: {
      freeBurn: "Free burn",
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
      previous: "Previous page",
      next: "Next page",
      showing: "{{start}}-{{end}} of {{total}}",
    },
    text: {
      subheader:
        "{{verified}} verified | {{active}} active 30d | {{banned}} banned | signups/week (12w): {{weekly}}",
      header: "{{total}} users | {{paying}} paying | {{paid}} lifetime revenue",
      pageHint: "Page {{page}}/{{pages}}. Next: --page={{next}}",
      detailHint: "Details: vibe users-view --userId=<ID>",
    },
  },
};
