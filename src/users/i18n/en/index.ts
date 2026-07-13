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
      title: "Create User",
      description: "Create a new user account",
      form: {
        title: "User Creation Form",
        description: "Fill in the details to create a new user",
      },
      email: {
        label: "Email Address",
        description: "User's email address for login and communication",
      },
      password: {
        label: "Password",
        description: "Secure password for the user account",
      },
      privateName: {
        label: "Private Name",
        description: "User's full legal name (visible only to admins)",
      },
      publicName: {
        label: "Public Name",
        description: "User's display name (visible to all users)",
      },
      firstName: {
        label: "First Name",
        description: "User's first name",
      },
      lastName: {
        label: "Last Name",
        description: "User's last name",
      },
      company: {
        label: "Company",
        description: "User's company or organization",
      },
      phone: {
        label: "Phone Number",
        description: "User's contact phone number",
      },
      preferredContactMethod: {
        label: "Preferred Contact Method",
        description: "How the user prefers to be contacted",
      },
      roles: {
        label: "User Roles",
        description: "Assign roles to the user",
      },
      imageUrl: {
        label: "Profile Image URL",
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
        label: "Job Title",
        description: "User's job title or position",
      },
      emailVerified: {
        label: "Email Verified",
        description: "Whether the user's email is verified",
      },
      isActive: {
        label: "Active Status",
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
        title: "User Created",
        description: "Details of the newly created user",
        id: {
          content: "User ID",
        },
        leadId: {
          content: "Associated Lead ID",
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
          content: "Email Address",
        },
        privateName: {
          content: "Private Name",
        },
        publicName: {
          content: "Public Name",
        },
        firstName: {
          content: "First Name",
        },
        lastName: {
          content: "Last Name",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Phone Number",
        },
        preferredContactMethod: {
          content: "Preferred Contact Method",
        },
        imageUrl: {
          content: "Profile Image",
        },
        bio: {
          content: "Biography",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Job Title",
        },
        emailVerified: {
          content: "Email Verified",
        },
        isActive: {
          content: "Active Status",
        },
        stripeCustomerId: {
          content: "Stripe Customer ID",
        },
        userRoles: {
          content: "User Roles",
          id: {
            content: "Role ID",
          },
          role: {
            content: "Role",
          },
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized Access",
          description: "You must be logged in to create users",
        },
        validation: {
          title: "Validation Failed",
          description: "Please check the form data and try again",
        },
        server: {
          title: "Server Error",
          description: "Unable to create user due to server error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while creating user",
        },
        network: {
          title: "Network Error",
          description: "Network connection failed during user creation",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "You don't have permission to create users",
        },
        notFound: {
          title: "Resource Not Found",
          description: "Required resource not found for user creation",
        },
        conflict: {
          title: "User Already Exists",
          description: "A user with this email already exists",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes that will be lost",
        },
        internal: {
          title: "Internal Error",
          description: "An internal error occurred while creating the user",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS Welcome Failed",
            description: "Failed to send welcome SMS to the user",
          },
          verification_failed: {
            title: "SMS Verification Failed",
            description: "Failed to send verification SMS to the user",
          },
        },
      },
      success: {
        title: "User Created Successfully",
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
      headerCreated: "User Created",
      headerCreate: "Create User",
      headerSubtitle: "Create a new admin user or customer account",
      activeBadge: "Active",
      verifiedBadge: "Verified",
      copiedTooltip: "Copied!",
      copyUserIdTooltip: "Copy User ID",
      copyIdButton: "Copy ID",
      copiedButton: "Copied!",
      viewUserButton: "View User",
      fullProfileButton: "Full Profile",
      creditHistoryButton: "Credit History",
      createAnotherButton: "Create Another User",
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
          accountDetails: "Account Details",
          email: "Email",
          name: "Name",
          publicName: "Display Name",
          company: "Company",
          phone: "Phone",
          nextSteps: "Next Steps",
          loginButton: "Login to Your Account",
          support:
            "If you have any questions, our support team is here to help. Contact us anytime!",
        },
        admin: {
          newUser: "New User Created",
          preview: "A new user {{firstName}} {{lastName}} has been created",
          subject: "New User Account Created - {{firstName}} {{lastName}}",
          notification:
            "A new user account has been created in the system. Here are the details:",
          userDetails: "User Details",
          viewUser: "View User Profile",
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
          privateName: "Full Name:",
          publicName: "Display Name:",
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
          title: "SMS Welcome Failed",
          description: "Failed to send welcome SMS to the user",
        },
        verification_failed: {
          title: "SMS Verification Failed",
          description: "Failed to send verification SMS to the user",
        },
      },
    },
  },
  list: {
    get: {
      title: "User List",
      description: "Search and filter users",
      form: {
        title: "User Management",
        description: "Manage and filter users",
      },
      actions: {
        refresh: "Refresh",
        refreshing: "Refreshing...",
      },
      // Search & Filters section
      searchFilters: {
        title: "Search & Filters",
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
        label: "Credit Activity",
        description: "Filter by credit purchase or spending activity",
        placeholder: "Any credit activity",
      },
      threads: {
        label: "Threads",
        description: "Filter by whether the user has any chat threads",
        placeholder: "Any thread status",
      },
      referralActivity: {
        label: "Referral Activity",
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
        label: "Sort By",
        description: "Field to sort by",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort Order",
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
          privateName: "Private Name",
          publicName: "Public Name",
          isActive: "Active",
          emailVerified: "Verified",
          createdAt: "Created",
          updatedAt: "Updated",
          referralCode: "Ref Code Used",
          referredByUserId: "Referred By",
          totalReferrals: "Referrals Made",
        },
        totalCount: "Total Users",
        pageCount: "Total Pages",
      },
      // Pagination section
      page: {
        label: "Page",
      },
      limit: {
        label: "Per Page",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to view users",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid parameters provided",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "You don't have permission to view users",
        },
        server: {
          title: "Server Error",
          description: "Unable to retrieve users",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        conflict: {
          title: "Conflict Error",
          description: "Unable to list users due to conflicts",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        notFound: {
          title: "Not Found",
          description: "No users found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Users retrieved successfully",
      },
    },
    // Legacy keys for backward compatibility
    title: "List Users",
    description: "List and search users with filtering",
    category: "Users",
    tag: "List",
    container: {
      title: "User List",
      description: "Search and filter users",
    },
    response: {
      summary: {
        title: "User Summary",
        description: "Summary statistics for user list",
      },
      users: {
        title: "Users",
      },
      user: {
        title: "User",
        id: "User ID",
        email: "Email",
        privateName: "Private Name",
        publicName: "Public Name",
        firstName: "First Name",
        lastName: "Last Name",
        company: "Company",
        phone: "Phone",
        isActive: "Active",
        emailVerified: "Email Verified",
        role: "Role",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
      total: {
        content: "Total Users",
      },
      page: {
        content: "Current Page",
      },
      limit: {
        content: "Users Per Page",
      },
      totalPages: {
        content: "Total Pages",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You must be logged in to view users",
      },
      validation: {
        title: "Validation Failed",
        description: "Invalid parameters provided for user listing",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You don't have permission to view users",
      },
      server: {
        title: "Server Error",
        description: "Unable to retrieve users due to server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while listing users",
      },
      conflict: {
        title: "Conflict Error",
        description: "Unable to list users due to existing conflicts",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      notFound: {
        title: "Users Not Found",
        description: "No users were found matching your criteria",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      internal: {
        title: "Internal Error",
        description: "An internal error occurred while listing users",
      },
    },
    post: {
      title: "List",
      description: "List endpoint",
      form: {
        title: "List Configuration",
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
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
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
      creditHistory: "Credit History",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      stats: "Stats",
      graphs: "Graphs",
      newUser: "New User",
      searchPlaceholder: "Search by name or email\u2026 (Ctrl+F)",
      roleFilterLabel: "Role",
      sortLabel: "Sort:",
      clearFilters: "Clear filters",
      noUsersMatchFilters: "No users match your filters.",
      noUsersFound: "No users found.",
      userStatistics: "User Statistics",
      refresh: "Refresh",
      roleAll: "All",
      roleAdmin: "Admin",
      roleCustomer: "Customer",
      rolePartnerAdmin: "Partner Admin",
      rolePartnerEmployee: "Partner Employee",
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
        createdAt: "Created At",
        updatedAt: "Updated At",
        email: "Email",
        privateName: "Private Name",
        publicName: "Public Name",
        firstName: "First Name",
        lastName: "Last Name",
        company: "Company",
        lastLogin: "Last Login",
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
        emailVerified: "Email Verified",
        emailUnverified: "Email Unverified",
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
        partnerAdmin: "Partner Admin",
        partnerEmployee: "Partner Employee",
        admin: "Admin",
        superAdmin: "Super Admin",
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
    title: "User Statistics",
    description: "Comprehensive user analytics and statistics",
    category: "Users",
    tag: "Statistics",
    container: {
      title: "User Statistics Dashboard",
      description: "View comprehensive user analytics and statistics",
    },
    actions: {
      refresh: "Refresh",
      refreshing: "Refreshing...",
    },
    basicFilters: {
      title: "Basic Filters",
      description: "Filter users by status and role",
    },
    subscriptionFilters: {
      title: "Subscription Filters",
      description: "Filter by subscription and payment",
    },
    locationFilters: {
      title: "Location Filters",
      description: "Filter by country and language",
    },
    timePeriodOptions: {
      title: "Time Period Options",
      description: "Configure time period and chart settings",
    },
    sections: {
      filterOptions: {
        title: "Filter Options",
        description: "Configure filters for user statistics",
      },
    },
    fields: {
      status: {
        label: "Status Filter",
        description: "Filter statistics by user status",
      },
      role: {
        label: "Role Filter",
        description: "Filter statistics by user role",
      },
      country: {
        label: "Country Filter",
        description: "Filter statistics by country",
        placeholder: "Select country...",
      },
      language: {
        label: "Language Filter",
        description: "Filter statistics by language",
        placeholder: "Select language...",
      },
      search: {
        label: "Search",
        description: "Search users for statistics",
        placeholder: "Enter search term...",
      },
      chartType: {
        label: "Chart Type",
        description: "Select the type of chart to display",
      },
      dateRangePreset: {
        label: "Date Range Preset",
        description: "Select a predefined date range",
      },
      includeComparison: {
        label: "Include Comparison",
        description: "Include comparison with previous period",
      },
      timePeriod: {
        label: "Time Period",
        description: "Select the time period for statistics",
      },
      subscriptionStatus: {
        label: "Subscription Status",
        description: "Filter by subscription status",
      },
      paymentMethod: {
        label: "Payment Method",
        description: "Filter by payment method",
      },
    },
    response: {
      overviewStats: {
        title: "Overview Statistics",
        description: "General user statistics overview",
        totalUsers: {
          label: "Total Users",
        },
        activeUsers: {
          label: "Active Users",
        },
        inactiveUsers: {
          label: "Inactive Users",
        },
        newUsers: {
          label: "New Users",
        },
      },
      emailStats: {
        title: "Email Statistics",
        description: "User email verification statistics",
        emailVerifiedUsers: {
          label: "Verified Emails",
        },
        emailUnverifiedUsers: {
          label: "Unverified Emails",
        },
        verificationRate: {
          label: "Verification Rate",
        },
      },
      profileStats: {
        title: "Profile Statistics",
        description: "User profile completion statistics",
        complete: {
          title: "Profile Completion",
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
            content: "Profile Completion Rate",
          },
        },
      },
      subscriptionStats: {
        title: "Subscription Statistics",
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
          label: "No Subscription",
        },
        subscriptionChart: {
          label: "Subscription Distribution",
          description: "Visual breakdown of subscription statuses",
        },
      },
      paymentStats: {
        title: "Payment Statistics",
        description: "Revenue and transaction statistics",
        totalRevenue: {
          label: "Total Revenue",
        },
        transactionCount: {
          label: "Transactions",
        },
        averageOrderValue: {
          label: "Avg. Order Value",
        },
        refundRate: {
          label: "Refund Rate",
        },
      },
      roleStats: {
        title: "Role Statistics",
        description: "User role distribution statistics",
        publicUsers: {
          label: "Public",
        },
        customerUsers: {
          label: "Customers",
        },
        partnerAdminUsers: {
          label: "Partner Admins",
        },
        partnerEmployeeUsers: {
          label: "Partner Staff",
        },
        adminUsers: {
          label: "Admins",
        },
        roleChart: {
          label: "Role Distribution",
          description: "Visual breakdown of users by role",
        },
      },
      timeStats: {
        title: "Time-based Statistics",
        description: "User creation and growth statistics over time",
        usersCreatedToday: {
          label: "Today",
        },
        usersCreatedThisWeek: {
          label: "This Week",
        },
        usersCreatedThisMonth: {
          label: "This Month",
        },
        usersCreatedLastMonth: {
          label: "Last Month",
        },
        growthRate: {
          label: "Growth Rate",
        },
      },
      companyStats: {
        title: "Company Statistics",
        description: "Company-related user statistics",
        uniqueCompanies: {
          content: "Unique Companies",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Total Users",
      },
      activeUsers: {
        content: "Active Users",
      },
      inactiveUsers: {
        content: "Inactive Users",
      },
      newUsers: {
        content: "New Users",
      },
      emailVerifiedUsers: {
        content: "Email Verified Users",
      },
      emailUnverifiedUsers: {
        content: "Email Unverified Users",
      },
      verificationRate: {
        content: "Email Verification Rate",
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
        content: "Stripe Integration Rate",
      },
      usersWithLeadId: {
        content: "Users with Lead ID",
      },
      usersWithoutLeadId: {
        content: "Users without Lead ID",
      },
      leadAssociationRate: {
        content: "Lead Association Rate",
      },
      publicUsers: {
        content: "Public Users",
      },
      customerUsers: {
        content: "Customer Users",
      },
      partnerAdminUsers: {
        content: "Partner Admin Users",
      },
      partnerEmployeeUsers: {
        content: "Partner Employee Users",
      },
      adminUsers: {
        content: "Admin Users",
      },
      uniqueCompanies: {
        content: "Unique Companies",
      },
      usersCreatedToday: {
        content: "Users Created Today",
      },
      usersCreatedThisWeek: {
        content: "Users Created This Week",
      },
      usersCreatedThisMonth: {
        content: "Users Created This Month",
      },
      usersCreatedLastMonth: {
        content: "Users Created Last Month",
      },
      growthRate: {
        content: "Growth Rate",
      },
      leadToUserConversionRate: {
        content: "Lead to User Conversion Rate",
      },
      retentionRate: {
        content: "User Retention Rate",
      },
      generatedAt: {
        content: "Statistics Generated At",
      },
      growthMetrics: {
        title: "Growth Metrics",
        description: "User growth and conversion metrics",
        growthChart: {
          label: "User Growth Over Time",
          description: "Visual representation of user creation trends",
        },
      },
      performanceRates: {
        title: "Performance Rates",
        description: "User performance and conversion metrics",
        growthRate: {
          label: "Growth Rate",
        },
        leadToUserConversionRate: {
          label: "Lead Conversion",
        },
        retentionRate: {
          label: "Retention Rate",
        },
      },
      businessInsights: {
        title: "Business Insights",
        description: "Business intelligence and analytics",
        uniqueCompanies: {
          label: "Unique Companies",
        },
        generatedAt: {
          label: "Generated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Failed",
        description: "Invalid statistics parameters provided",
      },
      unauthorized: {
        title: "Unauthorized Access",
        description: "You must be logged in to view statistics",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You don't have permission to view statistics",
      },
      notFound: {
        title: "Statistics Not Found",
        description: "The requested statistics could not be found",
      },
      conflict: {
        title: "Conflict Error",
        description: "Unable to generate statistics due to existing conflicts",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      server: {
        title: "Server Error",
        description: "Unable to generate statistics due to server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while generating statistics",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "All",
        active: "Active",
        trialing: "Trialing",
        pastDue: "Past Due",
        canceled: "Canceled",
        unpaid: "Unpaid",
        paused: "Paused",
        noSubscription: "No Subscription",
      },
      paymentMethodFilter: {
        all: "All",
        card: "Card",
        bankTransfer: "Bank Transfer",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "SEPA Debit",
        crypto: "Cryptocurrency",
        noPaymentMethod: "No Payment Method",
      },
    },
    success: {
      title: "Statistics Generated Successfully",
      description: "User statistics have been generated successfully",
    },
    widget: {
      headerTitle: "Users Statistics",
      refresh: "Refresh",
      labelTotalUsers: "Total Users",
      labelActiveUsers: "Active Users",
      labelNewToday: "New Today",
      labelNewThisWeek: "New This Week",
      labelNewThisMonth: "New This Month",
      labelTotalRevenue: "Total Revenue",
      labelAvgRevenuePerUser: "Avg Revenue / User",
      labelEmailVerified: "Email Verified",
      labelVerificationRate: "Verification Rate",
      labelEmailUnverified: "Email Unverified",
      labelGrowthRate: "Growth Rate",
      labelLeadUserCvr: "Lead \u2192 User CVR",
      labelRetentionRate: "Retention Rate",
      chartByRole: "By Role",
      chartBySubscriptionStatus: "By Subscription Status",
      chartGrowthOverTime: "Growth Over Time",
      recentSignupsSummary: "Recent Signups Summary",
      rowToday: "Today",
      rowThisWeek: "This Week",
      rowThisMonth: "This Month",
      rowLastMonth: "Last Month",
      generatedAt: "Generated at:",
      filters: "Filters",
      filtersTitle: "Filter Options",
      applyFilters: "Apply Filters",
      viewUsers: "View Users",
      createUser: "Create User",
    },
  },
  user: {
    category: "Users",
    tag: "User Management",
    errors: {
      not_found: {
        title: "User Not Found",
        description: "The requested user could not be found",
      },
      internal: {
        title: "Internal Error",
        description:
          "An internal error occurred while processing the user request",
      },
    },
    id: {
      category: "Users",
      tag: "User Management",

      id: {
        roles: {
          post: {
            title: "Add User Role",
            description: "Grant a role to a specific user account",
            container: {
              title: "Add Role",
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
              label: "Add Role",
            },
            response: {
              roleId: {
                content: "Role Assignment ID",
              },
              userId: {
                content: "User ID",
              },
              assignedRole: {
                content: "Assigned Role",
              },
            },
            errors: {
              unauthorized: {
                title: "Unauthorized",
                description: "You must be logged in to manage user roles",
              },
              validation: {
                title: "Validation Failed",
                description: "Please provide a valid user ID and role",
              },
              forbidden: {
                title: "Access Forbidden",
                description: "Only administrators can manage user roles",
              },
              notFound: {
                title: "User Not Found",
                description: "The specified user could not be found",
              },
              conflict: {
                title: "Role Already Assigned",
                description: "This user already has the specified role",
              },
              network: {
                title: "Network Error",
                description: "Unable to connect to the server",
              },
              unsavedChanges: {
                title: "Unsaved Changes",
                description: "You have unsaved changes that will be lost",
              },
              server: {
                title: "Server Error",
                description: "Unable to add role due to server error",
              },
              unknown: {
                title: "Unknown Error",
                description:
                  "An unexpected error occurred while adding the role",
              },
            },
            success: {
              title: "Role Added",
              description: "The role has been successfully granted to the user",
            },
          },
          delete: {
            title: "Remove User Role",
            description: "Revoke a role from a specific user account",
            container: {
              title: "Remove Role",
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
              label: "Remove Role",
            },
            response: {
              success: {
                content: "Role Removed",
              },
            },
            errors: {
              unauthorized: {
                title: "Unauthorized",
                description: "You must be logged in to manage user roles",
              },
              validation: {
                title: "Validation Failed",
                description: "Please provide a valid user ID and role",
              },
              forbidden: {
                title: "Access Forbidden",
                description: "Only administrators can manage user roles",
              },
              notFound: {
                title: "User Not Found",
                description: "The specified user could not be found",
              },
              conflict: {
                title: "Conflict Error",
                description:
                  "Unable to remove role due to existing dependencies",
              },
              network: {
                title: "Network Error",
                description: "Unable to connect to the server",
              },
              unsavedChanges: {
                title: "Unsaved Changes",
                description: "You have unsaved changes that will be lost",
              },
              server: {
                title: "Server Error",
                description: "Unable to remove role due to server error",
              },
              unknown: {
                title: "Unknown Error",
                description:
                  "An unexpected error occurred while removing the role",
              },
            },
            success: {
              title: "Role Removed",
              description:
                "The role has been successfully revoked from the user",
            },
          },
        },
        get: {
          title: "Get User",
          description: "Retrieve detailed information about a specific user",
          container: {
            title: "User Details",
            description: "View detailed user information",
          },
          id: {
            label: "User ID",
            description: "Unique identifier for the user",
            placeholder: "Enter user ID...",
          },
          response: {
            userProfile: {
              title: "User Profile",
              description: "Detailed user profile information",
              basicInfo: {
                title: "Basic Information",
                description: "Core user information",
                id: {
                  content: "User ID",
                },
                email: {
                  content: "Email Address",
                },
                privateName: {
                  content: "Private Name",
                },
                publicName: {
                  content: "Public Name",
                },
                firstName: {
                  content: "First Name",
                },
                lastName: {
                  content: "Last Name",
                },
                company: {
                  content: "Company",
                },
              },
              contactDetails: {
                title: "Contact Details",
                description: "User contact information",
                phone: {
                  content: "Phone Number",
                },
                preferredContactMethod: {
                  content: "Preferred Contact Method",
                },
                website: {
                  content: "Website",
                },
              },
            },
            profileDetails: {
              title: "Profile Details",
              description: "Additional profile information",
              imageUrl: {
                content: "Profile Image",
              },
              bio: {
                content: "Biography",
              },
              jobTitle: {
                content: "Job Title",
              },
              leadId: {
                content: "Associated Lead ID",
              },
            },
            accountStatus: {
              title: "Account Status",
              description: "User account status information",
              isActive: {
                content: "Active Status",
              },
              emailVerified: {
                content: "Email Verified",
              },
              stripeCustomerId: {
                content: "Stripe Customer ID",
              },
              userRoles: {
                content: "User Roles",
              },
            },
            timestamps: {
              title: "Timestamps",
              description: "Creation and update timestamps",
              createdAt: {
                content: "Created At",
              },
              updatedAt: {
                content: "Updated At",
              },
            },
            referralInfo: {
              title: "Referral Info",
              description: "Referral chain and earnings",
              referredByUserId: {
                content: "Referred By (User ID)",
              },
              referredByCode: {
                content: "Referral Code Used",
              },
              totalReferrals: {
                content: "Users Referred",
              },
              totalEarnedCents: {
                content: "Total Earned (cents)",
              },
            },
            leadId: {
              content: "Associated Lead ID",
            },
            email: {
              content: "Email Address",
            },
            privateName: {
              content: "Private Name",
            },
            publicName: {
              content: "Public Name",
            },
            firstName: {
              content: "First Name",
            },
            lastName: {
              content: "Last Name",
            },
            company: {
              content: "Company",
            },
            phone: {
              content: "Phone Number",
            },
            preferredContactMethod: {
              content: "Preferred Contact Method",
            },
            imageUrl: {
              content: "Profile Image",
            },
            bio: {
              content: "Biography",
            },
            website: {
              content: "Website",
            },
            jobTitle: {
              content: "Job Title",
            },
            emailVerified: {
              content: "Email Verified",
            },
            isActive: {
              content: "Active Status",
            },
            stripeCustomerId: {
              content: "Stripe Customer ID",
            },
            userRoles: {
              content: "User Roles",
            },
            createdAt: {
              content: "Created At",
            },
            updatedAt: {
              content: "Updated At",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized Access",
              description: "You must be logged in to view user details",
            },
            validation: {
              title: "Validation Failed",
              description: "Invalid user ID provided",
            },
            forbidden: {
              title: "Access Forbidden",
              description: "You don't have permission to view this user",
            },
            notFound: {
              title: "User Not Found",
              description: "The requested user could not be found",
            },
            conflict: {
              title: "Conflict Error",
              description: "Unable to retrieve user due to existing conflicts",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes that will be lost",
            },
            server: {
              title: "Server Error",
              description: "Unable to retrieve user due to server error",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred while retrieving user",
            },
          },
          success: {
            title: "User Retrieved Successfully",
            description: "User details have been retrieved successfully",
          },
        },
        put: {
          title: "Update User",
          description: "Update user information and profile details",
          container: {
            title: "Update User",
            description: "Modify user information and settings",
          },
          id: {
            label: "User ID",
            description: "Unique identifier for the user to update",
            placeholder: "Enter user ID...",
          },
          sections: {
            basicInfo: {
              title: "Basic Information",
              description: "Update basic user information",
            },
            contactInfo: {
              title: "Contact Information",
              description: "Update contact details",
            },
            profileDetails: {
              title: "Profile Details",
              description: "Update additional profile information",
            },
            adminSettings: {
              title: "Administrative Settings",
              description: "Update administrative settings",
            },
          },
          email: {
            label: "Email Address",
            description: "User's email address for login and communication",
            placeholder: "Enter email address...",
          },
          privateName: {
            label: "Private Name",
            description: "User's full legal name (visible only to admins)",
          },
          publicName: {
            label: "Public Name",
            description: "User's display name (visible to all users)",
          },
          firstName: {
            label: "First Name",
            description: "User's first name",
            placeholder: "Enter first name...",
          },
          lastName: {
            label: "Last Name",
            description: "User's last name",
            placeholder: "Enter last name...",
          },
          company: {
            label: "Company",
            description: "User's company or organization",
            placeholder: "Enter company name...",
          },
          phone: {
            label: "Phone Number",
            description: "User's contact phone number",
            placeholder: "Enter phone number...",
          },
          preferredContactMethod: {
            label: "Preferred Contact Method",
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
            label: "Job Title",
            description: "User's job title or position",
            placeholder: "Enter job title...",
          },
          emailVerified: {
            label: "Email Verified",
            description: "Whether the user's email is verified",
          },
          isActive: {
            label: "Active Status",
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
            label: "Ban Reason",
            description: "Reason for banning the user",
          },
          response: {
            leadId: {
              content: "Associated Lead ID",
            },
            email: {
              content: "Email Address",
            },
            privateName: {
              content: "Private Name",
            },
            publicName: {
              content: "Public Name",
            },
            firstName: {
              content: "First Name",
            },
            lastName: {
              content: "Last Name",
            },
            company: {
              content: "Company",
            },
            phone: {
              content: "Phone Number",
            },
            preferredContactMethod: {
              content: "Preferred Contact Method",
            },
            imageUrl: {
              content: "Profile Image",
            },
            bio: {
              content: "Biography",
            },
            website: {
              content: "Website",
            },
            jobTitle: {
              content: "Job Title",
            },
            emailVerified: {
              content: "Email Verified",
            },
            isActive: {
              content: "Active Status",
            },
            stripeCustomerId: {
              content: "Stripe Customer ID",
            },
            userRoles: {
              content: "User Roles",
            },
            createdAt: {
              content: "Created At",
            },
            updatedAt: {
              content: "Updated At",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized Access",
              description: "You must be logged in to update users",
            },
            validation: {
              title: "Validation Failed",
              description: "Please check the form data and try again",
            },
            forbidden: {
              title: "Access Forbidden",
              description: "You don't have permission to update this user",
            },
            notFound: {
              title: "User Not Found",
              description: "The user to update could not be found",
            },
            conflict: {
              title: "Update Conflict",
              description: "The user data conflicts with existing records",
            },
            server: {
              title: "Server Error",
              description: "Unable to update user due to server error",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred while updating user",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes that will be lost",
            },
          },
          success: {
            title: "User Updated Successfully",
            description: "User information has been updated successfully",
          },
        },
        delete: {
          title: "Delete User",
          description: "Permanently delete a user account",
          container: {
            title: "Delete User",
            description: "Permanently remove user from the system",
          },
          id: {
            label: "User ID",
            description: "Unique identifier for the user to delete",
            placeholder: "Enter user ID...",
            helpText: "WARNING: This action cannot be undone",
          },
          submitButton: {
            label: "Delete User",
            loadingText: "Deleting...",
          },
          response: {
            deletionResult: {
              title: "Deletion Result",
              description: "Result of the deletion operation",
              success: {
                content: "Deletion Success",
              },
              message: {
                content: "Deletion Message",
              },
              deletedAt: {
                content: "Deleted At",
              },
            },
            success: {
              content: "Deletion Success",
            },
            message: {
              content: "Deletion Message",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized Access",
              description: "You must be logged in to delete users",
            },
            validation: {
              title: "Validation Failed",
              description: "Invalid user ID provided for deletion",
            },
            forbidden: {
              title: "Access Forbidden",
              description: "You don't have permission to delete users",
            },
            notFound: {
              title: "User Not Found",
              description: "The user to delete could not be found",
            },
            server: {
              title: "Server Error",
              description: "Unable to delete user due to server error",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred while deleting user",
            },
            conflict: {
              title: "Conflict Error",
              description: "Unable to delete user due to existing dependencies",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes that will be lost",
            },
          },
          success: {
            title: "User Deleted Successfully",
            description: "User has been deleted successfully",
          },
        },
        widget: {
          userProfile: "User Profile",
          active: "Active",
          inactive: "Inactive",
          leadId: "Lead ID:",
          viewLead: "View Lead",
          created: "Created",
          lastUpdated: "Last Updated",
          fullProfile: "Full Profile",
          referrals: "Referrals",
          subscription: "Subscription",
          creditHistory: "Credit History",
          deleteUser: "Delete User",
          userDeletedSuccessfully: "User deleted successfully",
          deletedAt: "Deleted at",
          confirmDeletion: "Confirm Deletion",
          confirmDeletionMessage:
            "This will permanently delete the user and all associated data. This action cannot be undone.",
          titleReferralCodes: "View referral codes and stats",
          titleSubscription: "View subscription",
          titleCopyUserId: "Copy User ID",
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

    badge: "User Details",
    get: {
      title: "View User",
      description: "View detailed information about a user",
      userId: {
        label: "User ID",
      },
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Please check the user ID and try again",
      },
      network: {
        title: "Connection Error",
        description: "Unable to connect. Please check your internet connection",
      },
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to view user details",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to view this user",
      },
      notFound: {
        title: "User Not Found",
        description: "We couldn't find this user",
      },
      serverError: {
        title: "Something Went Wrong",
        description: "We couldn't load the user details. Please try again",
      },
      unknown: {
        title: "Unexpected Error",
        description: "Something unexpected happened. Please try again",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have changes that haven't been saved",
      },
      conflict: {
        title: "Data Conflict",
        description: "The user data has changed. Please refresh and try again",
      },
    },
    success: {
      title: "User Loaded",
      description: "User details loaded successfully",
    },
    empty: "No user data found",
    sections: {
      basicInfo: "Basic Information",
      chatActivity: "Chat Activity",
      credits: "Credits",
      payments: "Payments",
      newsletter: "Newsletter",
      referrals: "Referrals",
      recentActivity: "Recent Activity",
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
      twoFactor: "Two-Factor Auth",
      enabled: "Enabled",
      disabled: "Disabled",
      marketing: "Marketing",
      optedIn: "Opted In",
      optedOut: "Opted Out",
      created: "Created",
      lastUpdated: "Last Updated",
      banReason: "Ban Reason",
      roles: "Roles",
    },
    credits: {
      currentBalance: "Current Balance",
      availableCredits: "Available Credits",
      packBreakdown: "Credit Pack Breakdown",
      subscription: "Subscription",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Earned",
      expires: "Expires",
    },
    payment: {
      stripeCustomerId: "Stripe Customer ID",
      activeSubscription: "Active Subscription",
      subscriptionPlan: "Plan",
      subscriptionStatus: "Subscription Status",
      nextBilling: "Next Billing",
    },
    common: {
      yes: "Yes",
      no: "No",
    },
    newsletter: {
      status: "Status",
      subscribed: "Subscribed",
      notSubscribed: "Not Subscribed",
      subscribedAt: "Subscribed At",
      confirmedAt: "Confirmed At",
      lastEmailSent: "Last Email Sent",
    },
    referrals: {
      totalReferrals: "Total Referrals",
      activeCodes: "Active Codes",
      revenue: "Revenue",
      earnings: "Earnings",
    },
    activity: {
      lastLogin: "Last Login",
      lastThread: "Last Thread",
      lastMessage: "Last Message",
      lastPayment: "Last Payment",
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
      title: "Model Usage",
      model: "Model",
      spent: "Credits Spent",
      messages: "Messages",
      noUsage: "No model usage data",
    },
    connections: {
      title: "Connections",
      leadsTitle: "Connected Leads",
      usersTitle: "Connected Users",
      noLeads: "No connected leads",
      noUsers: "No connected users",
      leadEmail: "Email",
      leadBusiness: "Business",
      leadStatus: "Status",
      ipAddress: "IP Address",
      device: "Device",
      linkReason: "Link Reason",
      linkedAt: "Linked At",
      userId: "User ID",
      userEmail: "Email",
      userPublicName: "Username",
      viewLead: "View Lead",
      viewUser: "View User",
    },
    ban: {
      banUser: "Ban User",
      unbanUser: "Unban User",
    },
    widget: {
      actions: {
        edit: "Edit",
        delete: "Delete",
        viewCreditHistory: "View Credit History",
        viewSubscription: "View Subscription",
        viewReferralCodes: "View Referral Codes",
        viewReferralEarnings: "View Referral Earnings",
        addCredits: "Add Credits",
        viewLead: "View Lead",
        copyUserId: "Copy User ID",
        copied: "Copied!",
      },
      sections: {
        quickActions: "Quick Actions",
      },
      stats: {
        totalThreads: "Total Threads",
        totalMessages: "Total Messages",
        userMessages: "User Messages",
        lastActivity: "Last Activity",
        never: "Never",
        freeCredits: "Free Credits",
        freePeriod: "Period",
        totalSpent: "Total Spent",
        totalPurchased: "Total Purchased",
        totalRevenue: "Total Revenue",
        payments: "payments",
        successful: "Successful",
        failed: "Failed",
        totalRefunds: "Total Refunds",
        lastPayment: "Last Payment",
      },
    },
  },
};
