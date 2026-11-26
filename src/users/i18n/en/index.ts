export const translations = {
  category: "Users",
  tags: {
    create: "Create",
    admin: "Admin",
    user: "User",
    view: "View",
    stats: "Statistics",
  },
  create: {
    category: "Users",
    tags: {
      create: "Create",
      admin: "Admin",
    },
    post: {
      title: "Create user",
      description: "Create a new user account",
      form: {
        title: "User creation form",
        description: "Fill in the details to create a new user",
      },
      email: {
        label: "Email address",
        description: "User's email address for login and communication",
      },
      password: {
        label: "Password",
        description: "Secure password for the user account",
      },
      privateName: {
        label: "Private name",
        description: "User's full legal name (visible only to admins)",
      },
      publicName: {
        label: "Public name",
        description: "User's display name (visible to all users)",
      },
      firstName: {
        label: "First name",
        description: "User's first name",
      },
      lastName: {
        label: "Last name",
        description: "User's last name",
      },
      company: {
        label: "Company",
        description: "User's company or organization",
      },
      phone: {
        label: "Phone number",
        description: "User's contact phone number",
      },
      preferredContactMethod: {
        label: "Preferred contact method",
        description: "How the user prefers to be contacted",
      },
      roles: {
        label: "User roles",
        description: "Assign roles to the user",
      },
      imageUrl: {
        label: "Profile image URL",
        description: "URL to the user's profile image",
      },
      bio: {
        label: "Biography",
        description: "Brief description about the user",
      },
      website: {
        label: "Website",
        description: "User's personal or company website",
      },
      jobTitle: {
        label: "Job title",
        description: "User's job title or position",
      },
      emailVerified: {
        label: "Email verified",
        description: "Whether the user's email is verified",
      },
      isActive: {
        label: "Active status",
        description: "Whether the user account is active",
      },
      leadId: {
        label: "Lead ID",
        description: "Associated lead identifier",
      },
      country: {
        label: "Country",
        description: "User's country of residence",
      },
      language: {
        label: "Language",
        description: "User's preferred language",
      },
      response: {
        title: "User created",
        description: "Details of the newly created user",
        id: {
          content: "User ID",
        },
        leadId: {
          content: "Associated lead ID",
        },
        country: {
          label: "Country",
          description: "User's country of residence",
        },
        language: {
          label: "Language",
          description: "User's preferred language",
        },
        email: {
          content: "Email address",
        },
        privateName: {
          content: "Private name",
        },
        publicName: {
          content: "Public name",
        },
        firstName: {
          content: "First name",
        },
        lastName: {
          content: "Last name",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Phone number",
        },
        preferredContactMethod: {
          content: "Preferred contact method",
        },
        imageUrl: {
          content: "Profile image",
        },
        bio: {
          content: "Biography",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Job title",
        },
        emailVerified: {
          content: "Email verified",
        },
        isActive: {
          content: "Active status",
        },
        stripeCustomerId: {
          content: "Stripe customer ID",
        },
        userRoles: {
          content: "User roles",
          id: {
            content: "Role ID",
          },
          role: {
            content: "Role",
          },
        },
        createdAt: {
          content: "Created at",
        },
        updatedAt: {
          content: "Updated at",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized access",
          description: "You must be logged in to create users",
        },
        validation: {
          title: "Validation failed",
          description: "Please check the form data and try again",
        },
        server: {
          title: "Server error",
          description: "Unable to create user due to server error",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred while creating user",
        },
        network: {
          title: "Network error",
          description: "Network connection failed during user creation",
        },
        forbidden: {
          title: "Access forbidden",
          description: "You don't have permission to create users",
        },
        notFound: {
          title: "Resource not found",
          description: "Required resource not found for user creation",
        },
        conflict: {
          title: "User already exists",
          description: "A user with this email already exists",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes that will be lost",
        },
        internal: {
          title: "Internal error",
          description: "An internal error occurred while creating the user",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS welcome failed",
            description: "Failed to send welcome SMS to the user",
          },
          verification_failed: {
            title: "SMS verification failed",
            description: "Failed to send verification SMS to the user",
          },
        },
      },
      success: {
        title: "User created successfully",
        description: "The new user account has been created",
        message: {
          content: "User created successfully",
        },
        created: {
          content: "Created",
        },
      },
    },
    widget: {
      headerCreated: "User created",
      headerCreate: "Create user",
      headerSubtitle: "Create a new admin user or customer account",
      activeBadge: "Active",
      verifiedBadge: "Verified",
      copiedTooltip: "Copied!",
      copyUserIdTooltip: "Copy user ID",
      copyIdButton: "Copy ID",
      copiedButton: "Copied!",
      viewUserButton: "View user",
      fullProfileButton: "Full profile",
      creditHistoryButton: "Credit history",
      createAnotherButton: "Create another user",
      createdPrefix: "Created",
    },
    email: {
      users: {
        welcome: {
          greeting: "Welcome to our platform, {{firstName}}!",
          preview: "Your account has been successfully created",
          subject: "Welcome to {{companyName}} - Your Account is Ready!",
          introduction:
            "Hi {{firstName}}, we're excited to have you on board! Your account has been successfully created and you can now access all our features.",
          accountDetails: "Account details",
          email: "Email",
          name: "Name",
          publicName: "Display name",
          company: "Company",
          phone: "Phone",
          nextSteps: "Next steps",
          loginButton: "Login to Your Account",
          support:
            "If you have any questions, our support team is here to help. Contact us anytime!",
        },
        admin: {
          newUser: "New user created",
          preview: "A new user {{firstName}} {{lastName}} has been created",
          subject: "New User Account Created - {{firstName}} {{lastName}}",
          notification:
            "A new user account has been created in the system. Here are the details:",
          userDetails: "User details",
          viewUser: "View user profile",
        },
        errors: {
          missing_data: "Required user data is missing for email template",
        },
        error: {
          general: {
            internal_server_error: "An internal server error occurred",
          },
        },
        labels: {
          id: "ID:",
          email: "Email:",
          name: "Name:",
          privateName: "Full name:",
          publicName: "Display name:",
          company: "Company:",
          created: "Created:",
          leadId: "Lead ID:",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "Welcome {{firstName}}! Your account has been successfully created. Visit us at {{appUrl}}",
      },
      verification: {
        message:
          "{{firstName}}, your verification code is: {{code}}. Enter code within 10 minutes.",
      },
      errors: {
        welcome_failed: {
          title: "SMS welcome failed",
          description: "Failed to send welcome SMS to the user",
        },
        verification_failed: {
          title: "SMS verification failed",
          description: "Failed to send verification SMS to the user",
        },
      },
    },
  },
  list: {
    get: {
      title: "User list",
      description: "Search and filter users",
      form: {
        title: "User management",
        description: "Manage and filter users",
      },
      actions: {
        refresh: "Refresh",
        refreshing: "Refreshing...",
      },
      // Search & Filters section
      searchFilters: {
        title: "Search & filters",
        description: "Search and filter users by criteria",
      },
      search: {
        label: "Search",
        description: "Search users by name or email",
        placeholder: "Search users...",
      },
      status: {
        label: "Status",
        description: "Filter users by status",
        placeholder: "Select status...",
      },
      role: {
        label: "Role",
        description: "Filter users by role",
        placeholder: "Select role...",
      },
      subscription: {
        label: "Subscription",
        description: "Filter by subscription status",
        placeholder: "Any subscription status",
      },
      creditActivity: {
        label: "Credit activity",
        description: "Filter by credit purchase or spending activity",
        placeholder: "Any credit activity",
      },
      threads: {
        label: "Threads",
        description: "Filter by whether the user has any chat threads",
        placeholder: "Any thread status",
      },
      referralActivity: {
        label: "Referral activity",
        description:
          "Filter by referral link, clicks, signups, or paying subscribers",
        placeholder: "Any referral activity",
      },
      // Sorting section
      sortingOptions: {
        title: "Sorting",
        description: "Configure result sorting",
      },
      sortBy: {
        label: "Sort by",
        description: "Field to sort by",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort order",
        description: "Sort direction",
        placeholder: "Select sort order...",
      },
      // Response section
      response: {
        title: "Users",
        description: "List of users matching criteria",
        users: {
          id: "User ID",
          email: "Email",
          privateName: "Private name",
          publicName: "Public name",
          isActive: "Active",
          emailVerified: "Verified",
          createdAt: "Created",
          updatedAt: "Updated",
          referralCode: "Ref code used",
          referredByUserId: "Referred by",
          totalReferrals: "Referrals made",
        },
        totalCount: "Total users",
        pageCount: "Total pages",
      },
      // Pagination section
      page: {
        label: "Page",
      },
      limit: {
        label: "Per page",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to view users",
        },
        validation: {
          title: "Validation error",
          description: "Invalid parameters provided",
        },
        forbidden: {
          title: "Access forbidden",
          description: "You don't have permission to view users",
        },
        server: {
          title: "Server error",
          description: "Unable to retrieve users",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        conflict: {
          title: "Conflict error",
          description: "Unable to list users due to conflicts",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to the server",
        },
        notFound: {
          title: "Not found",
          description: "No users found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Users retrieved successfully",
      },
    },
    // Legacy keys for backward compatibility
    title: "List users",
    description: "List and search users with filtering",
    category: "Users",
    tag: "List",
    container: {
      title: "User list",
      description: "Search and filter users",
    },
    response: {
      summary: {
        title: "User summary",
        description: "Summary statistics for user list",
      },
      users: {
        title: "Users",
      },
      user: {
        title: "User",
        id: "User ID",
        email: "Email",
        privateName: "Private name",
        publicName: "Public name",
        firstName: "First name",
        lastName: "Last name",
        company: "Company",
        phone: "Phone",
        isActive: "Active",
        emailVerified: "Email verified",
        role: "Role",
        createdAt: "Created at",
        updatedAt: "Updated at",
      },
      total: {
        content: "Total users",
      },
      page: {
        content: "Current page",
      },
      limit: {
        content: "Users per page",
      },
      totalPages: {
        content: "Total pages",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized access",
        description: "You must be logged in to view users",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid parameters provided for user listing",
      },
      forbidden: {
        title: "Access forbidden",
        description: "You don't have permission to view users",
      },
      server: {
        title: "Server error",
        description: "Unable to retrieve users due to server error",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred while listing users",
      },
      conflict: {
        title: "Conflict error",
        description: "Unable to list users due to existing conflicts",
      },
      network: {
        title: "Network error",
        description: "Unable to connect to the server",
      },
      notFound: {
        title: "Users not found",
        description: "No users were found matching your criteria",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes that will be lost",
      },
      internal: {
        title: "Internal error",
        description: "An internal error occurred while listing users",
      },
    },
    post: {
      title: "List",
      description: "List endpoint",
      form: {
        title: "List configuration",
        description: "Configure list parameters",
      },
      response: {
        title: "Response",
        description: "List response data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
    widget: {
      statusActive: "Active",
      statusInactive: "Inactive",
      statusUnverified: "Unverified",
      joined: "Joined",
      creditHistory: "Credit history",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      stats: "Stats",
      graphs: "Graphs",
      newUser: "New user",
      searchPlaceholder: "Search by name or email\u2026 (Ctrl+F)",
      roleFilterLabel: "Role",
      sortLabel: "Sort:",
      clearFilters: "Clear filters",
      noUsersMatchFilters: "No users match your filters.",
      noUsersFound: "No users found.",
      userStatistics: "User statistics",
      refresh: "Refresh",
      roleAll: "All",
      roleAdmin: "Admin",
      roleCustomer: "Customer",
      rolePartnerAdmin: "Partner admin",
      rolePartnerEmployee: "Partner employee",
      statusAll: "All",
      sortNewest: "Newest",
      sortOldest: "Oldest",
      sortNameAZ: "Name A-Z",
      sortNameZA: "Name Z-A",
      sortEmailAZ: "Email A-Z",
      of: "of",
      usersShown: "users shown",
      paginationPage: "Page",
      paginationOf: "of",
      paginationSeparator: "·",
      paginationUsers: "users",
    },
    enums: {
      userSortField: {
        createdAt: "Created at",
        updatedAt: "Updated at",
        email: "Email",
        privateName: "Private name",
        publicName: "Public name",
        firstName: "First name",
        lastName: "Last name",
        company: "Company",
        lastLogin: "Last login",
      },
      sortOrder: {
        asc: "Ascending",
        desc: "Descending",
      },
      userStatusFilter: {
        all: "All",
        active: "Active",
        inactive: "Inactive",
        pending: "Pending",
        suspended: "Suspended",
        emailVerified: "Email verified",
        emailUnverified: "Email unverified",
      },
      userStatus: {
        active: "Active",
        inactive: "Inactive",
        pending: "Pending",
        suspended: "Suspended",
      },
      userRoleFilter: {
        all: "All",
        user: "User",
        public: "Public",
        customer: "Customer",
        moderator: "Moderator",
        partnerAdmin: "Partner admin",
        partnerEmployee: "Partner employee",
        admin: "Admin",
        superAdmin: "Super admin",
      },
      subscriptionPresenceFilter: {
        any: "Any",
        hasActive: "Has active subscription",
        hadAny: "Had a subscription (ever)",
        never: "Never subscribed",
      },
      creditActivityFilter: {
        any: "Any",
        boughtPack: "Bought credit pack",
        spentCredits: "Spent credits",
        neverSpent: "Never spent credits",
      },
      threadsFilter: {
        any: "Any",
        hasThreads: "Has threads",
        noThreads: "No threads",
      },
      referralActivityFilter: {
        any: "Any",
        hasCode: "Has referral link",
        hasClicks: "Has referral clicks",
        hasSignups: "Has referral signups",
        hasSubscribers: "Has paying referrals",
      },
    },
  },
  stats: {
    title: "User statistics",
    description: "Comprehensive user analytics and statistics",
    category: "Users",
    tag: "Statistics",
    container: {
      title: "User statistics dashboard",
      description: "View comprehensive user analytics and statistics",
    },
    actions: {
      refresh: "Refresh",
      refreshing: "Refreshing...",
    },
    basicFilters: {
      title: "Basic filters",
      description: "Filter users by status and role",
    },
    subscriptionFilters: {
      title: "Subscription filters",
      description: "Filter by subscription and payment",
    },
    locationFilters: {
      title: "Location filters",
      description: "Filter by country and language",
    },
    timePeriodOptions: {
      title: "Time period options",
      description: "Configure time period and chart settings",
    },
    sections: {
      filterOptions: {
        title: "Filter options",
        description: "Configure filters for user statistics",
      },
    },
    fields: {
      status: {
        label: "Status filter",
        description: "Filter statistics by user status",
      },
      role: {
        label: "Role filter",
        description: "Filter statistics by user role",
      },
      country: {
        label: "Country filter",
        description: "Filter statistics by country",
        placeholder: "Select country...",
      },
      language: {
        label: "Language filter",
        description: "Filter statistics by language",
        placeholder: "Select language...",
      },
      search: {
        label: "Search",
        description: "Search users for statistics",
        placeholder: "Enter search term...",
      },
      chartType: {
        label: "Chart type",
        description: "Select the type of chart to display",
      },
      dateRangePreset: {
        label: "Date range preset",
        description: "Select a predefined date range",
      },
      includeComparison: {
        label: "Include comparison",
        description: "Include comparison with previous period",
      },
      timePeriod: {
        label: "Time period",
        description: "Select the time period for statistics",
      },
      subscriptionStatus: {
        label: "Subscription status",
        description: "Filter by subscription status",
      },
      paymentMethod: {
        label: "Payment method",
        description: "Filter by payment method",
      },
    },
    response: {
      overviewStats: {
        title: "Overview statistics",
        description: "General user statistics overview",
        totalUsers: {
          label: "Total users",
        },
        activeUsers: {
          label: "Active users",
        },
        inactiveUsers: {
          label: "Inactive users",
        },
        newUsers: {
          label: "New users",
        },
      },
      emailStats: {
        title: "Email statistics",
        description: "User email verification statistics",
        emailVerifiedUsers: {
          label: "Verified emails",
        },
        emailUnverifiedUsers: {
          label: "Unverified emails",
        },
        verificationRate: {
          label: "Verification rate",
        },
      },
      profileStats: {
        title: "Profile statistics",
        description: "User profile completion statistics",
        complete: {
          title: "Profile completion",
          description: "Detailed profile completion metrics",
          usersWithPhone: {
            content: "Users with Phone",
          },
          usersWithBio: {
            content: "Users with Biography",
          },
          usersWithWebsite: {
            content: "Users with Website",
          },
          usersWithJobTitle: {
            content: "Users with Job Title",
          },
          usersWithImage: {
            content: "Users with Profile Image",
          },
          completionRate: {
            content: "Profile completion rate",
          },
        },
      },
      subscriptionStats: {
        title: "Subscription statistics",
        description: "User subscription distribution statistics",
        activeSubscriptions: {
          label: "Active",
        },
        canceledSubscriptions: {
          label: "Canceled",
        },
        expiredSubscriptions: {
          label: "Expired",
        },
        noSubscription: {
          label: "No subscription",
        },
        subscriptionChart: {
          label: "Subscription distribution",
          description: "Visual breakdown of subscription statuses",
        },
      },
      paymentStats: {
        title: "Payment statistics",
        description: "Revenue and transaction statistics",
        totalRevenue: {
          label: "Total revenue",
        },
        transactionCount: {
          label: "Transactions",
        },
        averageOrderValue: {
          label: "Avg. order value",
        },
        refundRate: {
          label: "Refund rate",
        },
      },
      roleStats: {
        title: "Role statistics",
        description: "User role distribution statistics",
        publicUsers: {
          label: "Public",
        },
        customerUsers: {
          label: "Customers",
        },
        partnerAdminUsers: {
          label: "Partner admins",
        },
        partnerEmployeeUsers: {
          label: "Partner staff",
        },
        adminUsers: {
          label: "Admins",
        },
        roleChart: {
          label: "Role distribution",
          description: "Visual breakdown of users by role",
        },
      },
      timeStats: {
        title: "Time-based statistics",
        description: "User creation and growth statistics over time",
        usersCreatedToday: {
          label: "Today",
        },
        usersCreatedThisWeek: {
          label: "This week",
        },
        usersCreatedThisMonth: {
          label: "This month",
        },
        usersCreatedLastMonth: {
          label: "Last month",
        },
        growthRate: {
          label: "Growth rate",
        },
      },
      companyStats: {
        title: "Company statistics",
        description: "Company-related user statistics",
        uniqueCompanies: {
          content: "Unique companies",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Total users",
      },
      activeUsers: {
        content: "Active users",
      },
      inactiveUsers: {
        content: "Inactive users",
      },
      newUsers: {
        content: "New users",
      },
      emailVerifiedUsers: {
        content: "Email verified users",
      },
      emailUnverifiedUsers: {
        content: "Email unverified users",
      },
      verificationRate: {
        content: "Email verification rate",
      },
      usersWithPhone: {
        content: "Users with Phone",
      },
      usersWithBio: {
        content: "Users with Biography",
      },
      usersWithWebsite: {
        content: "Users with Website",
      },
      usersWithJobTitle: {
        content: "Users with Job Title",
      },
      usersWithImage: {
        content: "Users with Profile Image",
      },
      usersWithStripeId: {
        content: "Users with Stripe ID",
      },
      usersWithoutStripeId: {
        content: "Users without Stripe ID",
      },
      stripeIntegrationRate: {
        content: "Stripe integration rate",
      },
      usersWithLeadId: {
        content: "Users with Lead ID",
      },
      usersWithoutLeadId: {
        content: "Users without Lead ID",
      },
      leadAssociationRate: {
        content: "Lead association rate",
      },
      publicUsers: {
        content: "Public users",
      },
      customerUsers: {
        content: "Customer users",
      },
      partnerAdminUsers: {
        content: "Partner admin users",
      },
      partnerEmployeeUsers: {
        content: "Partner employee users",
      },
      adminUsers: {
        content: "Admin users",
      },
      uniqueCompanies: {
        content: "Unique companies",
      },
      usersCreatedToday: {
        content: "Users created today",
      },
      usersCreatedThisWeek: {
        content: "Users created this week",
      },
      usersCreatedThisMonth: {
        content: "Users created this month",
      },
      usersCreatedLastMonth: {
        content: "Users created last month",
      },
      growthRate: {
        content: "Growth rate",
      },
      leadToUserConversionRate: {
        content: "Lead to User Conversion Rate",
      },
      retentionRate: {
        content: "User retention rate",
      },
      generatedAt: {
        content: "Statistics generated at",
      },
      growthMetrics: {
        title: "Growth metrics",
        description: "User growth and conversion metrics",
        growthChart: {
          label: "User growth over time",
          description: "Visual representation of user creation trends",
        },
      },
      performanceRates: {
        title: "Performance rates",
        description: "User performance and conversion metrics",
        growthRate: {
          label: "Growth rate",
        },
        leadToUserConversionRate: {
          label: "Lead conversion",
        },
        retentionRate: {
          label: "Retention rate",
        },
      },
      businessInsights: {
        title: "Business insights",
        description: "Business intelligence and analytics",
        uniqueCompanies: {
          label: "Unique companies",
        },
        generatedAt: {
          label: "Generated at",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation failed",
        description: "Invalid statistics parameters provided",
      },
      unauthorized: {
        title: "Unauthorized access",
        description: "You must be logged in to view statistics",
      },
      forbidden: {
        title: "Access forbidden",
        description: "You don't have permission to view statistics",
      },
      notFound: {
        title: "Statistics not found",
        description: "The requested statistics could not be found",
      },
      conflict: {
        title: "Conflict error",
        description: "Unable to generate statistics due to existing conflicts",
      },
      network: {
        title: "Network error",
        description: "Unable to connect to the server",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes that will be lost",
      },
      server: {
        title: "Server error",
        description: "Unable to generate statistics due to server error",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred while generating statistics",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "All",
        active: "Active",
        trialing: "Trialing",
        pastDue: "Past due",
        canceled: "Canceled",
        unpaid: "Unpaid",
        paused: "Paused",
        noSubscription: "No subscription",
      },
      paymentMethodFilter: {
        all: "All",
        card: "Card",
        bankTransfer: "Bank transfer",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "SEPA debit",
        crypto: "Cryptocurrency",
        noPaymentMethod: "No payment method",
      },
    },
    success: {
      title: "Statistics generated successfully",
      description: "User statistics have been generated successfully",
    },
    widget: {
      headerTitle: "Users statistics",
      refresh: "Refresh",
      labelTotalUsers: "Total users",
      labelActiveUsers: "Active users",
      labelNewToday: "New today",
      labelNewThisWeek: "New this week",
      labelNewThisMonth: "New this month",
      labelTotalRevenue: "Total revenue",
      labelAvgRevenuePerUser: "Avg revenue / user",
      labelEmailVerified: "Email verified",
      labelVerificationRate: "Verification rate",
      labelEmailUnverified: "Email unverified",
      labelGrowthRate: "Growth rate",
      labelLeadUserCvr: "Lead \u2192 user CVR",
      labelRetentionRate: "Retention rate",
      chartByRole: "By role",
      chartBySubscriptionStatus: "By subscription status",
      chartGrowthOverTime: "Growth over time",
      recentSignupsSummary: "Recent signups summary",
      rowToday: "Today",
      rowThisWeek: "This week",
      rowThisMonth: "This month",
      rowLastMonth: "Last month",
      generatedAt: "Generated at:",
      filters: "Filters",
      filtersTitle: "Filter options",
      applyFilters: "Apply filters",
      viewUsers: "View users",
      createUser: "Create user",
    },
  },
  user: {
    category: "Users",
    tag: "User management",
    errors: {
      not_found: {
        title: "User not found",
        description: "The requested user could not be found",
      },
      internal: {
        title: "Internal error",
        description:
          "An internal error occurred while processing the user request",
      },
    },
    id: {
      category: "Users",
      tag: "User management",

      id: {
        roles: {
          post: {
            title: "Add user role",
            description: "Grant a role to a specific user account",
            container: {
              title: "Add role",
              description: "Select a role to grant to this user",
            },
            id: {
              label: "User ID",
              description: "Unique identifier of the user to grant the role to",
              placeholder: "Enter user ID...",
            },
            role: {
              label: "Role",
              description: "The role to grant to the user",
              placeholder: "Select a role...",
            },
            submit: {
              label: "Add role",
            },
            response: {
              roleId: {
                content: "Role assignment ID",
              },
              userId: {
                content: "User ID",
              },
              assignedRole: {
                content: "Assigned role",
              },
            },
            errors: {
              unauthorized: {
                title: "Unauthorized",
                description: "You must be logged in to manage user roles",
              },
              validation: {
                title: "Validation failed",
                description: "Please provide a valid user ID and role",
              },
              forbidden: {
                title: "Access forbidden",
                description: "Only administrators can manage user roles",
              },
              notFound: {
                title: "User not found",
                description: "The specified user could not be found",
              },
              conflict: {
                title: "Role already assigned",
                description: "This user already has the specified role",
              },
              network: {
                title: "Network error",
                description: "Unable to connect to the server",
              },
              unsavedChanges: {
                title: "Unsaved changes",
                description: "You have unsaved changes that will be lost",
              },
              server: {
                title: "Server error",
                description: "Unable to add role due to server error",
              },
              unknown: {
                title: "Unknown error",
                description:
                  "An unexpected error occurred while adding the role",
              },
            },
            success: {
              title: "Role added",
              description: "The role has been successfully granted to the user",
            },
          },
          delete: {
            title: "Remove user role",
            description: "Revoke a role from a specific user account",
            container: {
              title: "Remove role",
              description: "Select a role to revoke from this user",
            },
            id: {
              label: "User ID",
              description:
                "Unique identifier of the user to revoke the role from",
              placeholder: "Enter user ID...",
            },
            role: {
              label: "Role",
              description: "The role to revoke from the user",
              placeholder: "Select a role...",
            },
            submit: {
              label: "Remove role",
            },
            response: {
              success: {
                content: "Role removed",
              },
            },
            errors: {
              unauthorized: {
                title: "Unauthorized",
                description: "You must be logged in to manage user roles",
              },
              validation: {
                title: "Validation failed",
                description: "Please provide a valid user ID and role",
              },
              forbidden: {
                title: "Access forbidden",
                description: "Only administrators can manage user roles",
              },
              notFound: {
                title: "User not found",
                description: "The specified user could not be found",
              },
              conflict: {
                title: "Conflict error",
                description:
                  "Unable to remove role due to existing dependencies",
              },
              network: {
                title: "Network error",
                description: "Unable to connect to the server",
              },
              unsavedChanges: {
                title: "Unsaved changes",
                description: "You have unsaved changes that will be lost",
              },
              server: {
                title: "Server error",
                description: "Unable to remove role due to server error",
              },
              unknown: {
                title: "Unknown error",
                description:
                  "An unexpected error occurred while removing the role",
              },
            },
            success: {
              title: "Role removed",
              description:
                "The role has been successfully revoked from the user",
            },
          },
        },
        get: {
          title: "Get user",
          description: "Retrieve detailed information about a specific user",
          container: {
            title: "User details",
            description: "View detailed user information",
          },
          id: {
            label: "User ID",
            description: "Unique identifier for the user",
            placeholder: "Enter user ID...",
          },
          response: {
            userProfile: {
              title: "User profile",
              description: "Detailed user profile information",
              basicInfo: {
                title: "Basic information",
                description: "Core user information",
                id: {
                  content: "User ID",
                },
                email: {
                  content: "Email address",
                },
                privateName: {
                  content: "Private name",
                },
                publicName: {
                  content: "Public name",
                },
                firstName: {
                  content: "First name",
                },
                lastName: {
                  content: "Last name",
                },
                company: {
                  content: "Company",
                },
              },
              contactDetails: {
                title: "Contact details",
                description: "User contact information",
                phone: {
                  content: "Phone number",
                },
                preferredContactMethod: {
                  content: "Preferred contact method",
                },
                website: {
                  content: "Website",
                },
              },
            },
            profileDetails: {
              title: "Profile details",
              description: "Additional profile information",
              imageUrl: {
                content: "Profile image",
              },
              bio: {
                content: "Biography",
              },
              jobTitle: {
                content: "Job title",
              },
              leadId: {
                content: "Associated lead ID",
              },
            },
            accountStatus: {
              title: "Account status",
              description: "User account status information",
              isActive: {
                content: "Active status",
              },
              emailVerified: {
                content: "Email verified",
              },
              stripeCustomerId: {
                content: "Stripe customer ID",
              },
              userRoles: {
                content: "User roles",
              },
            },
            timestamps: {
              title: "Timestamps",
              description: "Creation and update timestamps",
              createdAt: {
                content: "Created at",
              },
              updatedAt: {
                content: "Updated at",
              },
            },
            referralInfo: {
              title: "Referral info",
              description: "Referral chain and earnings",
              referredByUserId: {
                content: "Referred by (User ID)",
              },
              referredByCode: {
                content: "Referral code used",
              },
              totalReferrals: {
                content: "Users referred",
              },
              totalEarnedCents: {
                content: "Total earned (cents)",
              },
            },
            leadId: {
              content: "Associated lead ID",
            },
            email: {
              content: "Email address",
            },
            privateName: {
              content: "Private name",
            },
            publicName: {
              content: "Public name",
            },
            firstName: {
              content: "First name",
            },
            lastName: {
              content: "Last name",
            },
            company: {
              content: "Company",
            },
            phone: {
              content: "Phone number",
            },
            preferredContactMethod: {
              content: "Preferred contact method",
            },
            imageUrl: {
              content: "Profile image",
            },
            bio: {
              content: "Biography",
            },
            website: {
              content: "Website",
            },
            jobTitle: {
              content: "Job title",
            },
            emailVerified: {
              content: "Email verified",
            },
            isActive: {
              content: "Active status",
            },
            stripeCustomerId: {
              content: "Stripe customer ID",
            },
            userRoles: {
              content: "User roles",
            },
            createdAt: {
              content: "Created at",
            },
            updatedAt: {
              content: "Updated at",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized access",
              description: "You must be logged in to view user details",
            },
            validation: {
              title: "Validation failed",
              description: "Invalid user ID provided",
            },
            forbidden: {
              title: "Access forbidden",
              description: "You don't have permission to view this user",
            },
            notFound: {
              title: "User not found",
              description: "The requested user could not be found",
            },
            conflict: {
              title: "Conflict error",
              description: "Unable to retrieve user due to existing conflicts",
            },
            network: {
              title: "Network error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved changes",
              description: "You have unsaved changes that will be lost",
            },
            server: {
              title: "Server error",
              description: "Unable to retrieve user due to server error",
            },
            unknown: {
              title: "Unknown error",
              description: "An unexpected error occurred while retrieving user",
            },
          },
          success: {
            title: "User retrieved successfully",
            description: "User details have been retrieved successfully",
          },
        },
        put: {
          title: "Update user",
          description: "Update user information and profile details",
          container: {
            title: "Update user",
            description: "Modify user information and settings",
          },
          id: {
            label: "User ID",
            description: "Unique identifier for the user to update",
            placeholder: "Enter user ID...",
          },
          sections: {
            basicInfo: {
              title: "Basic information",
              description: "Update basic user information",
            },
            contactInfo: {
              title: "Contact information",
              description: "Update contact details",
            },
            profileDetails: {
              title: "Profile details",
              description: "Update additional profile information",
            },
            adminSettings: {
              title: "Administrative settings",
              description: "Update administrative settings",
            },
          },
          email: {
            label: "Email address",
            description: "User's email address for login and communication",
            placeholder: "Enter email address...",
          },
          privateName: {
            label: "Private name",
            description: "User's full legal name (visible only to admins)",
          },
          publicName: {
            label: "Public name",
            description: "User's display name (visible to all users)",
          },
          firstName: {
            label: "First name",
            description: "User's first name",
            placeholder: "Enter first name...",
          },
          lastName: {
            label: "Last name",
            description: "User's last name",
            placeholder: "Enter last name...",
          },
          company: {
            label: "Company",
            description: "User's company or organization",
            placeholder: "Enter company name...",
          },
          phone: {
            label: "Phone number",
            description: "User's contact phone number",
            placeholder: "Enter phone number...",
          },
          preferredContactMethod: {
            label: "Preferred contact method",
            description: "How the user prefers to be contacted",
          },
          bio: {
            label: "Biography",
            description: "Brief description about the user",
            placeholder: "Enter biography...",
          },
          website: {
            label: "Website",
            description: "User's personal or company website",
            placeholder: "Enter website URL...",
          },
          jobTitle: {
            label: "Job title",
            description: "User's job title or position",
            placeholder: "Enter job title...",
          },
          emailVerified: {
            label: "Email verified",
            description: "Whether the user's email is verified",
          },
          isActive: {
            label: "Active status",
            description: "Whether the user account is active",
          },
          leadId: {
            label: "Lead ID",
            description: "Associated lead identifier",
            placeholder: "Enter lead ID...",
          },
          isBanned: {
            label: "Banned",
            description: "Whether the user is banned from the platform",
          },
          bannedReason: {
            label: "Ban reason",
            description: "Reason for banning the user",
          },
          response: {
            leadId: {
              content: "Associated lead ID",
            },
            email: {
              content: "Email address",
            },
            privateName: {
              content: "Private name",
            },
            publicName: {
              content: "Public name",
            },
            firstName: {
              content: "First name",
            },
            lastName: {
              content: "Last name",
            },
            company: {
              content: "Company",
            },
            phone: {
              content: "Phone number",
            },
            preferredContactMethod: {
              content: "Preferred contact method",
            },
            imageUrl: {
              content: "Profile image",
            },
            bio: {
              content: "Biography",
            },
            website: {
              content: "Website",
            },
            jobTitle: {
              content: "Job title",
            },
            emailVerified: {
              content: "Email verified",
            },
            isActive: {
              content: "Active status",
            },
            stripeCustomerId: {
              content: "Stripe customer ID",
            },
            userRoles: {
              content: "User roles",
            },
            createdAt: {
              content: "Created at",
            },
            updatedAt: {
              content: "Updated at",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized access",
              description: "You must be logged in to update users",
            },
            validation: {
              title: "Validation failed",
              description: "Please check the form data and try again",
            },
            forbidden: {
              title: "Access forbidden",
              description: "You don't have permission to update this user",
            },
            notFound: {
              title: "User not found",
              description: "The user to update could not be found",
            },
            conflict: {
              title: "Update conflict",
              description: "The user data conflicts with existing records",
            },
            server: {
              title: "Server error",
              description: "Unable to update user due to server error",
            },
            unknown: {
              title: "Unknown error",
              description: "An unexpected error occurred while updating user",
            },
            network: {
              title: "Network error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved changes",
              description: "You have unsaved changes that will be lost",
            },
          },
          success: {
            title: "User updated successfully",
            description: "User information has been updated successfully",
          },
        },
        delete: {
          title: "Delete user",
          description: "Permanently delete a user account",
          container: {
            title: "Delete user",
            description: "Permanently remove user from the system",
          },
          id: {
            label: "User ID",
            description: "Unique identifier for the user to delete",
            placeholder: "Enter user ID...",
            helpText: "WARNING: This action cannot be undone",
          },
          submitButton: {
            label: "Delete user",
            loadingText: "Deleting...",
          },
          response: {
            deletionResult: {
              title: "Deletion result",
              description: "Result of the deletion operation",
              success: {
                content: "Deletion success",
              },
              message: {
                content: "Deletion message",
              },
              deletedAt: {
                content: "Deleted at",
              },
            },
            success: {
              content: "Deletion success",
            },
            message: {
              content: "Deletion message",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized access",
              description: "You must be logged in to delete users",
            },
            validation: {
              title: "Validation failed",
              description: "Invalid user ID provided for deletion",
            },
            forbidden: {
              title: "Access forbidden",
              description: "You don't have permission to delete users",
            },
            notFound: {
              title: "User not found",
              description: "The user to delete could not be found",
            },
            server: {
              title: "Server error",
              description: "Unable to delete user due to server error",
            },
            unknown: {
              title: "Unknown error",
              description: "An unexpected error occurred while deleting user",
            },
            conflict: {
              title: "Conflict error",
              description: "Unable to delete user due to existing dependencies",
            },
            network: {
              title: "Network error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved changes",
              description: "You have unsaved changes that will be lost",
            },
          },
          success: {
            title: "User deleted successfully",
            description: "User has been deleted successfully",
          },
        },
        widget: {
          userProfile: "User profile",
          active: "Active",
          inactive: "Inactive",
          leadId: "Lead ID:",
          viewLead: "View lead",
          created: "Created",
          lastUpdated: "Last updated",
          fullProfile: "Full profile",
          referrals: "Referrals",
          subscription: "Subscription",
          creditHistory: "Credit history",
          deleteUser: "Delete user",
          userDeletedSuccessfully: "User deleted successfully",
          deletedAt: "Deleted at",
          confirmDeletion: "Confirm deletion",
          confirmDeletionMessage:
            "This will permanently delete the user and all associated data. This action cannot be undone.",
          titleReferralCodes: "View referral codes and stats",
          titleSubscription: "View subscription",
          titleCopyUserId: "Copy user ID",
        },
      },
    },
  },
  view: {
    category: "Users",
    tags: {
      user: "User",
      view: "View",
    },

    badge: "User details",
    get: {
      title: "View user",
      description: "View detailed information about a user",
      userId: {
        label: "User ID",
      },
    },
    errors: {
      validation: {
        title: "Invalid request",
        description: "Please check the user ID and try again",
      },
      network: {
        title: "Connection error",
        description: "Unable to connect. Please check your internet connection",
      },
      unauthorized: {
        title: "Sign in required",
        description: "Please sign in to view user details",
      },
      forbidden: {
        title: "Access denied",
        description: "You don't have permission to view this user",
      },
      notFound: {
        title: "User not found",
        description: "We couldn't find this user",
      },
      serverError: {
        title: "Something went wrong",
        description: "We couldn't load the user details. Please try again",
      },
      unknown: {
        title: "Unexpected error",
        description: "Something unexpected happened. Please try again",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have changes that haven't been saved",
      },
      conflict: {
        title: "Data conflict",
        description: "The user data has changed. Please refresh and try again",
      },
    },
    success: {
      title: "User loaded",
      description: "User details loaded successfully",
    },
    empty: "No user data found",
    sections: {
      basicInfo: "Basic information",
      chatActivity: "Chat activity",
      credits: "Credits",
      payments: "Payments",
      newsletter: "Newsletter",
      referrals: "Referrals",
      recentActivity: "Recent activity",
    },
    status: {
      active: "Active",
      banned: "Banned",
      inactive: "Inactive",
      verified: "Verified",
    },
    fields: {
      userId: "User ID",
      locale: "Locale",
      twoFactor: "Two-Factor auth",
      enabled: "Enabled",
      disabled: "Disabled",
      marketing: "Marketing",
      optedIn: "Opted in",
      optedOut: "Opted out",
      created: "Created",
      lastUpdated: "Last updated",
      banReason: "Ban reason",
      roles: "Roles",
    },
    credits: {
      currentBalance: "Current balance",
      availableCredits: "Available credits",
      packBreakdown: "Credit pack breakdown",
      subscription: "Subscription",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Earned",
      expires: "Expires",
    },
    payment: {
      stripeCustomerId: "Stripe customer ID",
      activeSubscription: "Active subscription",
      subscriptionPlan: "Plan",
      subscriptionStatus: "Subscription status",
      nextBilling: "Next billing",
    },
    common: {
      yes: "Yes",
      no: "No",
    },
    newsletter: {
      status: "Status",
      subscribed: "Subscribed",
      notSubscribed: "Not subscribed",
      subscribedAt: "Subscribed at",
      confirmedAt: "Confirmed at",
      lastEmailSent: "Last email sent",
    },
    referrals: {
      totalReferrals: "Total referrals",
      activeCodes: "Active codes",
      revenue: "Revenue",
      earnings: "Earnings",
    },
    activity: {
      lastLogin: "Last login",
      lastThread: "Last thread",
      lastMessage: "Last message",
      lastPayment: "Last payment",
    },
    tabs: {
      overview: "Overview",
      credits: "Credits",
      referrals: "Referrals",
      earnings: "Earnings",
      connections: "Connections",
      favorites: "Favorites",
      skills: "Skills",
    },
    modelUsage: {
      title: "Model usage",
      model: "Model",
      spent: "Credits spent",
      messages: "Messages",
      noUsage: "No model usage data",
    },
    connections: {
      title: "Connections",
      leadsTitle: "Connected leads",
      usersTitle: "Connected users",
      noLeads: "No connected leads",
      noUsers: "No connected users",
      leadEmail: "Email",
      leadBusiness: "Business",
      leadStatus: "Status",
      ipAddress: "IP address",
      device: "Device",
      linkReason: "Link reason",
      linkedAt: "Linked at",
      userId: "User ID",
      userEmail: "Email",
      userPublicName: "Username",
      viewLead: "View lead",
      viewUser: "View user",
    },
    ban: {
      banUser: "Ban user",
      unbanUser: "Unban user",
    },
    widget: {
      actions: {
        edit: "Edit",
        delete: "Delete",
        viewCreditHistory: "View credit history",
        viewSubscription: "View subscription",
        viewReferralCodes: "View referral codes",
        viewReferralEarnings: "View referral earnings",
        addCredits: "Add credits",
        viewLead: "View lead",
        copyUserId: "Copy user ID",
        copied: "Copied!",
      },
      sections: {
        quickActions: "Quick actions",
      },
      stats: {
        totalThreads: "Total threads",
        totalMessages: "Total messages",
        userMessages: "User messages",
        lastActivity: "Last activity",
        never: "Never",
        freeCredits: "Free credits",
        freePeriod: "Period",
        totalSpent: "Total spent",
        totalPurchased: "Total purchased",
        totalRevenue: "Total revenue",
        payments: "payments",
        successful: "Successful",
        failed: "Failed",
        totalRefunds: "Total refunds",
        lastPayment: "Last payment",
      },
    },
  },
};
