export const translations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    batch: "Batch",
    campaigns: "Campaigns",
    management: "Management",
    create: "Create",
    search: "Search",
    export: "Export",
    import: "Import",
    csv: "CSV",
    jobs: "Jobs",
    list: "List",
  },
  admin: {
    title: "Leads Management",
    tabs: {
      overview: "Leads Navigation",
      stats: "Overview",
      stats_description: "View lead statistics and analytics",
      leads: "Leads",
      leads_description: "Browse and manage all leads",
      emails: "Email Campaigns",
      emails_description: "Manage email campaigns and templates",
      abTesting: "A/B Testing",
      abTesting_description: "Configure A/B testing variants",
      campaignStarter: "Campaign Starter",
      campaignStarter_description: "Configure and start lead campaigns",
    },
    import: {
      label: "Import",
      description: "Import leads from CSV files",
    },
    emails: {
      preview: {
        error: "Failed to render email preview",
        live: "Live Preview",
        actions: {
          title: "Email Preview",
          description: "Preview how the email will look to recipients",
        },
      },
      preview_title: "Email Preview",
      testEmail: {
        button: "Send Test Email",
      },
      from: "From",
      recipient: "Recipient",
      subject: "Subject",
      email_preview: "Email Preview",
      stage_of: "of",
      stages: "stages",
      journey: "Journey",
      back: "Back",
      previous: "Previous",
      next: "Next",
    },
  },
  auth: {
    public: {
      validCookie: "Valid cookie lead found",
      invalidCookie: "Invalid cookie lead",
      created: "Anonymous lead created",
      error: "Error in public lead auth",
    },
    authenticated: {
      primaryFound: "Primary lead found for user",
      noPrimary: "No primary lead found for user",
      error: "Error in authenticated lead auth",
    },
    link: {
      alreadyExists: "Lead link already exists",
      created: "Lead link created",
      error: "Error linking leads",
    },
    validate: {
      error: "Error validating lead",
    },
    getOrCreate: {
      invalid: "Invalid lead ID",
      error: "Error getting or creating lead",
    },
    create: {
      existingFound: "Existing anonymous lead found",
      success: "Lead created successfully",
      error: "Error creating lead",
    },
    createForUser: {
      success: "Lead created for user",
      error: "Error creating lead for user",
    },
    cookie: {
      set: "Lead cookie set",
      error: "Error setting lead cookie",
    },
    getUserLeads: {
      error: "Error getting user leads",
    },
    linkLeads: {
      sameId: "Cannot link lead to itself",
      alreadyExists: "Lead link already exists",
      created: "Leads linked successfully",
      error: "Error linking leads",
    },
    getLinkedLeads: {
      error: "Error getting linked leads",
    },
    getAllLinkedLeads: {
      error: "Error getting all linked leads",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Cannot link lead to itself",
    linkFailed: "Failed to link leads",
  },
  filters: {
    search: {
      label: "Search",
      description: "Search leads by email or business name",
      placeholder: "Enter email or business name...",
    },
    status: {
      label: "Status",
      description: "Filter by lead status",
      placeholder: "All statuses",
    },
    currentCampaignStage: {
      label: "Campaign Stage",
      description: "Filter by email campaign stage",
      placeholder: "All stages",
    },
    source: {
      label: "Source",
      description: "Filter by lead source",
      placeholder: "All sources",
    },
    country: {
      label: "Country",
      description: "Filter by country",
      placeholder: "All countries",
    },
    language: {
      label: "Language",
      description: "Filter by language",
      placeholder: "All languages",
    },
    sortBy: {
      label: "Sort By",
      description: "Choose the field to sort by",
      placeholder: "Sort field",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort ascending or descending",
      placeholder: "Sort order",
    },
    statusFilters: {
      title: "Status & Campaign Filters",
      description: "Filter by status, campaign stage, and source",
    },
    locationFilters: {
      title: "Location Filters",
      description: "Filter by country and language",
    },
    sortingOptions: {
      title: "Sorting Options",
      description: "Configure the sort order",
    },
  },
  batch: {
    category: "Leads",
    tags: {
      leads: "Leads",
      batch: "Batch",
    },

    patch: {
      title: "Batch Update",
      description: "Batch update leads based on filter criteria",
      form: {
        title: "Batch Update Configuration",
        description: "Configure batch update parameters",
      },
      search: {
        label: "Search",
        description: "Search leads by email or business name",
        placeholder: "Enter email or business name",
      },
      status: {
        label: "Status Filter",
        description: "Filter leads by current status",
      },
      currentCampaignStage: {
        label: "Campaign Stage Filter",
        description: "Filter leads by current campaign stage",
      },
      source: {
        label: "Source Filter",
        description: "Filter leads by source",
      },
      scope: {
        label: "Operation Scope",
        description: "Define the scope of the batch operation",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without applying them",
      },
      maxRecords: {
        label: "Max Records",
        description: "Maximum number of records to process",
      },
      updates: {
        title: "Update Fields",
        description: "Specify which fields to update",
        status: {
          label: "New Status",
          description: "Update lead status to this value",
        },
        currentCampaignStage: {
          label: "New Campaign Stage",
          description: "Update campaign stage to this value",
        },
        source: {
          label: "New Source",
          description: "Update lead source to this value",
        },
        notes: {
          label: "Notes",
          description: "Add or update notes for the lead",
        },
      },
      response: {
        title: "Update Response",
        description: "Batch update response data",
        success: "Success",
        totalMatched: "Total Matched",
        totalProcessed: "Total Processed",
        totalUpdated: "Total Updated",
        preview: "Preview",
        errors: "Errors",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for batch operations",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters for batch update",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred during batch update",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during batch update",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred during batch update",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for batch operations",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found for batch update",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred during batch update",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the batch update",
        },
      },
      success: {
        title: "Update Success",
        description: "Batch update operation completed successfully",
      },
    },
    delete: {
      title: "Batch Delete",
      description: "Batch delete leads based on filter criteria",
      form: {
        title: "Batch Delete Configuration",
        description: "Configure batch delete parameters",
      },
      search: {
        label: "Search",
        description: "Search leads by email or business name",
      },
      status: {
        label: "Status Filter",
        description: "Filter leads by current status",
      },
      confirmDelete: {
        label: "Confirm Delete",
        description: "Confirm that you want to delete the selected leads",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview deletions without actually removing records",
      },
      maxRecords: {
        label: "Max Records",
        description: "Maximum number of records to delete",
      },
      response: {
        title: "Delete Response",
        description: "Batch delete response data",
        success: "Success",
        totalMatched: "Total Matched",
        totalProcessed: "Total Processed",
        totalDeleted: "Total Deleted",
        preview: "Preview",
        errors: "Errors",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for batch delete operations",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters for batch delete",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred during batch delete",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during batch delete",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred during batch delete",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for batch delete operations",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found for batch delete",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred during batch delete",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the batch delete",
        },
      },
      success: {
        title: "Delete Success",
        description: "Batch delete operation completed successfully",
      },
    },
    widget: {
      update: {
        headerTitle: "Batch Update Leads",
        emptyStateTitle: "Batch Update Leads",
        emptyStateDescription:
          "Apply a field update to many leads at once based on filter criteria. Use",
        emptyStateDescriptionStrong: "Dry Run",
        emptyStateDescriptionSuffix:
          "to preview which leads will be affected before committing changes.",
        emptyStateTip1:
          "Set filters and click Submit to run a dry-run preview first",
        emptyStateTip2: "Uncheck Dry Run to apply changes for real",
        highVolumeTitle: "Large batch: {{count}} leads matched",
        highVolumeDescription:
          "This will affect a large number of records. Review the preview carefully before disabling Dry Run and submitting for real.",
        partialBatchTitle: "Partial batch processed",
        partialBatchDescription:
          "{{processed}} of {{matched}} matched leads were processed. Increase Max Records or run again to process more.",
        successTitle: "Batch operation completed",
        failureTitle: "Batch operation failed",
        statMatched: "Matched",
        statProcessed: "Processed",
        statUpdated: "Updated",
        btnRunAgain: "Run Again",
        btnViewAllAffected: "View All Affected Leads",
        btnViewInList: "View in List",
        dryRunPreviewTitle:
          "Dry Run Preview ({{count}} leads would be affected)",
        leadFallback: "Lead {{number}}",
        errorsTitle: "{{count}} error(s)",
        errorRow: "Lead {{leadId}}: {{error}}",
        sectionFilter: "Filter Criteria",
        sectionUpdates: "Update Fields",
        sectionSettings: "Operation Settings",
        activeFiltersLabel: "Active filters from list (prefilled)",
        filterSearch: "Search",
        submitButton: "Apply Updates",
        submitButtonLoading: "Applying...",
      },
      delete: {
        headerTitle: "Batch Delete Leads",
        warningTitle: "Warning: {{count}} lead will be permanently deleted",
        warningTitlePlural:
          "Warning: {{count}} leads will be permanently deleted",
        warningDescription:
          "This action cannot be undone. All data for the matched leads will be permanently removed. Disable Dry Run and confirm to proceed.",
        successTitle: "Deletion completed",
        failureTitle: "Deletion failed",
        statMatched: "Matched",
        statDeleted: "Deleted",
        btnRunAgain: "Run Again",
        btnViewRemainingLeads: "View Remaining Leads",
        previewTitle: "{{count}} leads will be permanently deleted",
        leadFallback: "Lead {{number}}",
        errorRow: "Lead {{leadId}}: {{error}}",
        sectionFilter: "Filter Criteria",
        sectionSettings: "Delete Settings",
        activeFiltersLabel: "Active filters from list (prefilled)",
        filterSearch: "Search",
        submitButton: "Delete Leads",
        submitButtonLoading: "Deleting...",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Current Page",
        allPages: "All Pages",
      },
      leadStatus: {
        new: "New",
        pending: "Pending",
        campaignRunning: "Campaign Running",
        websiteUser: "Website User",
        newsletterSubscriber: "Newsletter Subscriber",
        inContact: "In Contact",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Subscription Confirmed",
        unsubscribed: "Unsubscribed",
        bounced: "Bounced",
        invalid: "Invalid",
      },
      emailCampaignStage: {
        notStarted: "Not Started",
        initial: "Initial Contact",
        followup1: "Follow-up 1",
        followup2: "Follow-up 2",
        followup3: "Follow-up 3",
        nurture: "Nurture",
        reactivation: "Reactivation",
      },
      leadSource: {
        website: "Website",
        socialMedia: "Social Media",
        emailCampaign: "Email Campaign",
        referral: "Referral",
        csvImport: "CSV Import",
      },
    },
    email: {
      admin: {
        batchUpdate: {
          title: "Batch Update Complete",
          subject: "Batch Update Results",
          preview: "{{totalProcessed}} leads were processed",
          message:
            "The batch update operation has completed with {{totalProcessed}} leads processed.",
          operationSummary: "Operation Summary",
          totalMatched: "Total Matched",
          totalProcessed: "Total Processed",
          totalUpdated: "Total Updated",
          errors: "Errors",
          dryRunNote: "This was a dry run - no actual changes were made.",
          viewLeads: "View Updated Leads",
          error: {
            noData: "No batch update data available",
          },
        },
        batchDelete: {
          title: "Batch Delete Complete",
          subject: "Batch Delete Results",
          preview: "{{totalProcessed}} leads were processed for deletion",
          message:
            "The batch delete operation has completed with {{totalProcessed}} leads processed.",
          operationSummary: "Operation Summary",
          totalMatched: "Total Matched",
          totalProcessed: "Total Processed",
          totalDeleted: "Total Deleted",
          errors: "Errors",
          dryRunNote: "This was a dry run - no actual deletions were made.",
          viewLeads: "View Leads",
          error: {
            noData: "No batch delete data available",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "An internal server error occurred",
        },
      },
    },
  },
  campaigns: {
    category: "Campaign Management",
    tags: {
      campaigns: "Campaigns",
      management: "Management",
    },
    campaignStarter: {
      category: "Campaign Management",
      tag: "Campaign Starter",
      task: {
        description:
          "Start campaigns for new leads by transitioning them to PENDING status",
      },
      errors: {
        server: {
          title: "Server Error",
          description:
            "An error occurred while processing the campaign starter request",
        },
        invalidTransition: "Invalid status transition for campaign start",
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      post: {
        title: "Campaign Starter",
        description: "Start campaigns for new leads",
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while starting campaigns",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          notFound: { title: "Not Found", description: "Resource not found" },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        fields: {
          timezone: {
            label: "Timezone",
            description: "Browser timezone for hour conversion",
          },
          dryRun: {
            label: "Dry Run",
            description: "Run without making changes",
          },
          force: {
            label: "Force",
            description: "Bypass day/hour schedule restrictions",
          },
        },
        response: {
          leadsProcessed: "Leads Processed",
          leadsStarted: "Leads Started",
          leadsSkipped: "Leads Skipped",
          executionTimeMs: "Execution Time (ms)",
          errors: "Errors",
          quotaDetails: "Quota Details",
        },
        success: {
          title: "Campaign Starter Completed",
          description: "Campaign starter ran successfully",
        },
      },
      get: {
        title: "Get Campaign Starter Config",
        description: "Retrieve campaign starter configuration",
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
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
          notFound: { title: "Not Found", description: "Resource not found" },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        fields: {
          timezone: {
            label: "Timezone",
            description: "Browser timezone for hour conversion",
          },
        },
        response: {
          dryRun: "Dry Run Mode",
          minAgeHours: "Minimum Age Hours",
          enabledDays: "Enabled Days",
          enabledHours: "Enabled Hours",
          localeConfig: "Locale Configuration",
          leadsPerWeek: "Leads Per Week",
          schedule: "Schedule",
          enabled: "Enabled",
          priority: "Priority",
          timeout: "Timeout",
          retries: "Retries",
          retryDelay: "Retry Delay",
        },
        success: {
          title: "Config Retrieved Successfully",
          description: "Campaign starter configuration retrieved successfully",
        },
      },
      put: {
        title: "Campaign Starter Config",
        description: "Update campaign starter configuration",
        dryRun: {
          label: "Dry Run Mode",
          description: "Enable dry run mode for testing",
        },
        minAgeHours: {
          label: "Minimum Age Hours",
          description: "Minimum age in hours before processing leads",
        },
        enabledDays: {
          label: "Enabled Days",
          description: "Days of the week when campaigns are enabled",
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          friday: "Friday",
          saturday: "Saturday",
          sunday: "Sunday",
        },
        enabledHours: {
          label: "Enabled Hours",
          description: "Hours of the day when campaigns are enabled",
          start: {
            label: "Start Hour",
            description: "Hour of the day when campaigns start (0-23)",
          },
          end: {
            label: "End Hour",
            description: "Hour of the day when campaigns end (0-23)",
          },
        },
        localeConfig: {
          label: "Locale Configuration",
          description:
            "Per-locale settings: leads per week, active days, and active hours",
        },
        leadsPerWeek: {
          label: "Leads Per Week",
          description: "Maximum number of leads to process per week",
        },
        schedule: {
          label: "Schedule",
          description: "Campaign execution schedule",
        },
        enabled: {
          label: "Enabled",
          description: "Enable or disable the campaign starter",
        },
        priority: {
          label: "Priority",
          description: "Priority level for campaign execution",
        },
        timeout: {
          label: "Timeout",
          description: "Timeout value in milliseconds",
        },
        retries: {
          label: "Retries",
          description: "Number of retry attempts",
        },
        retryDelay: {
          label: "Retry Delay",
          description: "Delay between retry attempts in milliseconds",
        },
        success: {
          title: "Config Saved",
          description: "Campaign starter configuration saved successfully",
        },
      },
      priority: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
        background: "Background",
        filter: {
          all: "All Priorities",
          highAndAbove: "High and Above",
          mediumAndAbove: "Medium and Above",
        },
      },
      widget: {
        title: "Campaign Starter",
        titleSaved: "Configuration Saved",
        description:
          "Start campaigns for new leads that are ready to be contacted.",
        saving: "Saving...",
        save: "Save Settings",
        addLocale: "+ Add locale",
        guidanceTitle: "Configure the Campaign Starter",
        guidanceDescription:
          "Set the schedule, active days/hours, leads-per-week targets, and cron task settings.",
        runButton: "Start Campaigns",
        running: "Running...",
        done: "Done",
        perRunBudget:
          "~{{perRunBudget}} leads/run · {{totalRunsPerWeek}} runs/week",
        perRunBudgetFractional:
          "{{exactBudget}}/run · {{totalRunsPerWeek}} runs/week (fractional - accumulates across runs)",
        perRunBudgetZeroHint:
          "— increase leads/week or reduce schedule frequency",
        sections: {
          general: "General",
          generalDescription:
            "Master controls for enabling the campaign starter and dry run mode.",
          schedule: "Schedule",
          scheduleDescription:
            "When should campaigns run? Set the cron schedule, active days, and hours.",
          hoursTimezoneNote:
            "Hours in your browser timezone ({{offset}}). Stored as UTC on the server.",
          quotas: "Quotas",
          quotasDescription:
            "How many leads to process per week, broken down by locale.",
          advanced: "Advanced",
          advancedDescription:
            "Task execution settings like priority, timeouts, and retry behavior.",
        },
        days: {
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
          sun: "Sun",
        },
      },
    },
    emailCampaigns: {
      category: "Campaign Management",
      tag: "Email Campaigns",
      task: {
        description:
          "Send automated email campaigns to leads based on their stage and timing",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
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
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      post: {
        title: "Email Campaigns",
        description: "Process email campaigns for leads",
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
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
          notFound: { title: "Not Found", description: "Resource not found" },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        fields: {
          batchSize: {
            label: "Batch Size",
            description: "Number of leads to process per batch",
          },
          maxEmailsPerRun: {
            label: "Max Emails Per Run",
            description: "Maximum number of emails to send per run",
          },
          dryRun: {
            label: "Dry Run",
            description: "Run without sending emails",
          },
        },
        response: {
          emailsScheduled: "Emails Scheduled",
          emailsSent: "Emails Sent",
          emailsFailed: "Emails Failed",
          leadsProcessed: "Leads Processed",
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
      get: {
        title: "Get Email Campaigns Config",
        description: "Retrieve email campaigns background task configuration",
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
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
          notFound: { title: "Not Found", description: "Resource not found" },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        response: {
          enabled: "Enabled",
          dryRun: "Dry Run Mode",
          batchSize: "Batch Size",
          maxEmailsPerRun: "Max Emails Per Run",
          schedule: "Schedule",
          priority: "Priority",
          timeout: "Timeout",
          retries: "Retries",
          retryDelay: "Retry Delay",
        },
        success: {
          title: "Config Retrieved Successfully",
          description: "Email campaigns configuration retrieved successfully",
        },
      },
      put: {
        title: "Email Campaigns Config",
        description: "Update email campaigns background task configuration",
        enabled: {
          label: "Enabled",
          description: "Enable or disable the email campaigns background task",
        },
        dryRun: {
          label: "Dry Run Mode",
          description: "Process emails without actually sending them",
        },
        batchSize: {
          label: "Batch Size",
          description: "Number of leads to process per batch (1–100)",
        },
        maxEmailsPerRun: {
          label: "Max Emails Per Run",
          description:
            "Maximum number of emails to send per background run (1–1000)",
        },
        schedule: {
          label: "Schedule",
          description: "Cron expression for when to run email campaigns",
        },
        priority: {
          label: "Priority",
          description: "Priority level for task execution",
        },
        timeout: {
          label: "Timeout (ms)",
          description: "Maximum execution time in milliseconds",
        },
        retries: {
          label: "Retries",
          description: "Number of retry attempts on failure",
        },
        retryDelay: {
          label: "Retry Delay (ms)",
          description: "Delay between retry attempts in milliseconds",
        },
        success: {
          title: "Config Saved",
          description: "Email campaigns configuration saved successfully",
        },
      },
      priority: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
        background: "Background",
      },
      widget: {
        title: "Email Campaigns Configuration",
        titleSaved: "Configuration Saved",
        saving: "Saving...",
        save: "Save Settings",
        guidanceTitle: "Configure Email Campaigns Background Task",
        guidanceDescription:
          "Enable or disable the email campaigns cron task and configure its schedule, batch size, and execution settings.",
        runButton: "Run Now",
        running: "Running...",
        done: "Done",
        sections: {
          general: "General",
          generalDescription:
            "Master controls for enabling the email campaigns task and dry run mode.",
          schedule: "Schedule",
          scheduleDescription:
            "Set the cron schedule for when emails are sent.",
          processing: "Processing",
          processingDescription:
            "Configure how many leads and emails to process per run.",
          advanced: "Advanced",
          advancedDescription:
            "Task execution settings like priority, timeouts, and retry behavior.",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "Next",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Build better products faster",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. All rights reserved.",
            helpText:
              "If you have any questions, please contact us at {{config.emails.support}}",
            unsubscribeText: "Don't want to receive these emails?",
            unsubscribeLink: "Unsubscribe",
          },
          socialProof: {
            quotePrefix: "201C",
            quoteSuffix: "201D",
            attribution: "— Customer Name, Company",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "A fellow unbottled.ai user",
              previewLeadId: "preview-lead-id",
              previewEmail: "preview@example.com",
              previewBusinessName: "Acme Corp",
              previewContactName: "Preview User",
              previewPhone: "+1234567890",
              previewCampaignId: "preview-campaign-id",
            },
            footer: {
              unsubscribeText: "You're receiving this because you opted in.",
              unsubscribeLink: "Unsubscribe",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Uncensored Convert",
                description:
                  "An enthusiast sharing their discovery of unbottled.ai",
                longDescription:
                  "Enthusiast persona sharing a genuine discovery with affiliate transparency",
                characteristics: {
                  tone: "Casual, conspiratorial tone",
                  story: "Genuine personal story",
                  transparency: "Affiliate transparency",
                  angle: "Anti-censorship angle",
                  energy: "Enthusiast energy",
                },
              },
              sideHustle: {
                name: "Side Hustle",
                description: "A transparent affiliate sharing real use cases",
                longDescription:
                  "Transparent affiliate marketer sharing real weekly use cases",
                characteristics: {
                  disclosure: "Full affiliate disclosure upfront",
                  updates: "Weekly use-case updates",
                  income: "Passive income story",
                  proof: "Practical proof, not hype",
                  energy: "Honest hustle energy",
                },
              },
              quietRecommendation: {
                name: "Quiet Recommendation",
                description:
                  "A low-key professional passing along a tested tool",
                longDescription:
                  "Low-key professional passing along a tool tested for weeks",
                characteristics: {
                  signal: "Short, high signal-to-noise",
                  specifics: "No hype, just specifics",
                  testing: "3-week testing backstory",
                  comparison: "Honest comparison to ChatGPT",
                  affiliate: "Minimal affiliate mention",
                },
              },
              signupNurture: {
                name: "Signup Nurture",
                description: "Onboarding sequence for newly signed-up users",
                longDescription:
                  "Welcome and onboarding emails helping new users get started with the platform",
              },
              retention: {
                name: "Retention",
                description: "Re-engagement for existing subscribers",
                longDescription:
                  "Value-driven emails to keep active subscribers engaged and exploring features",
              },
              winback: {
                name: "Winback",
                description: "Win back inactive or churned users",
                longDescription:
                  "Re-activation campaign targeting users who have gone quiet or cancelled",
              },
              newsletterMay2026: {
                name: "Newsletter May 2026",
                description:
                  "One-off newsletter about Cortex, Dreamer, Autopilot, and media generation",
                longDescription:
                  "May 2026 product update newsletter sent to all signed-up users with honest bug admission and feature highlights",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Cancelled by system",
        },
        abTesting: {
          invalidWeights: "Total variant weights must equal 100%",
          negativeWeight: "Variant weight must be positive",
        },
        post: {
          title: "Services",
          description: "Services endpoint",
          form: {
            title: "Services Configuration",
            description: "Configure services parameters",
          },
          response: {
            title: "Response",
            description: "Services response data",
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
      },
      testMail: {
        category: "Leads",
        tags: {
          campaigns: "Campaigns",
          leads: "Leads",
        },
        post: {
          title: "Test Mail",
          description: "Send test email with custom lead data",
          form: {
            title: "Test Mail Configuration",
            description: "Configure test mail parameters and lead data",
          },
          campaignType: {
            label: "Campaign Type",
            description: "Type of email campaign",
            placeholder: "Enter campaign type",
          },
          emailJourneyVariant: {
            label: "Email Journey Variant",
            description: "A/B test variant for email journey",
            placeholder: "Select journey variant",
          },
          emailCampaignStage: {
            label: "Email Campaign Stage",
            description: "Current stage in the email campaign",
            placeholder: "Select campaign stage",
          },
          testEmail: {
            label: "Test Email Address",
            description: "Email address to send test mail to",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Lead Data",
            description: "Lead information for template rendering",
            businessName: {
              label: "Business Name",
              description: "Name of the business",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Contact Name",
              description: "Name of the contact person",
              placeholder: "John Doe",
            },
            website: {
              label: "Website",
              description: "Company website URL",
              placeholder: "https://example.com",
            },
            country: {
              label: "Country",
              description: "Country code",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Language",
              description: "Preferred language code",
              placeholder: "en",
            },
            status: {
              label: "Status",
              description: "Lead status",
              placeholder: "NEW",
            },
            source: {
              label: "Source",
              description: "Lead source",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Notes",
              description: "Additional notes about the lead",
              placeholder: "Enter any additional notes",
            },
          },
          response: {
            title: "Test Email Result",
            description: "Result of sending test email",
            success: {
              content: "Success",
            },
            messageId: {
              content: "Message ID",
            },
            testEmail: {
              content: "Test Email",
            },
            subject: {
              content: "Email Subject",
            },
            sentAt: {
              content: "Sent At",
            },
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
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "There are unsaved changes",
            },
            conflict: {
              title: "Conflict",
              description: "Data conflict occurred",
            },
            templateNotFound: {
              title: "Template Not Found",
              description: "Email template not found for specified parameters",
            },
            sendingFailed: {
              title: "Sending Failed",
              description: "Failed to send test email",
            },
          },
          success: {
            title: "Success",
            description: "Test email sent successfully",
          },
          selectionCriteria: "SMTP Selection Criteria",
          widget: {
            title: "Send Test Email",
            send: "Send Test Email",
            sending: "Sending...",
            successMessage: "Test email sent successfully",
            sentTo: "Sent to: ",
            subject: "Subject: ",
            sentAt: "Sent at: ",
            campaignConfig: "Campaign Config",
            sendAnother: "Send Another",
          },
        },
      },
    },
  },
  create: {
    category: "Leads",
    tags: {
      leads: "Leads",
      create: "Create",
    },

    enums: {
      leadSource: {
        website: "Website",
        socialMedia: "Social Media",
        emailCampaign: "Email Campaign",
        referral: "Referral",
        csvImport: "CSV Import",
      },
    },
    widget: {
      headerLeadCreated: "Lead Created",
      headerCreateLead: "Create Lead",
      subheaderFillDetails: "Fill in the details below",
      fallbackLeadName: "Lead",
      buttonCopyId: "Copy ID",
      buttonViewLead: "View Lead",
      buttonEditLead: "Edit Lead",
      buttonBackToList: "Back to List",
    },
    post: {
      title: "Create Lead",
      description: "Create a new lead in the system",
      backButton: {
        label: "Back to Leads",
      },
      submitButton: {
        label: "Create Lead",
        loadingText: "Creating Lead...",
      },
      form: {
        title: "New Lead Form",
        description: "Enter lead information to create a new lead",
      },
      contactInfo: {
        title: "Contact Information",
        description: "Primary contact details for the lead",
      },
      email: {
        label: "Email Address",
        description: "Primary email address for communication",
        placeholder: "john@example.com",
      },
      businessName: {
        label: "Business Name",
        description: "Name of the company or business",
        placeholder: "Example Corp",
      },
      phone: {
        label: "Phone Number",
        description: "Contact phone number with country code",
        placeholder: "+1234567890",
      },
      website: {
        label: "Website",
        description: "Company website URL",
        placeholder: "https://example.com",
      },
      locationPreferences: {
        title: "Location & Preferences",
        description: "Geographic and language preferences",
      },
      country: {
        label: "Country",
        description: "Business location or target market",
        placeholder: "Select a country",
      },
      language: {
        label: "Language",
        description: "Preferred communication language",
        placeholder: "Select a language",
      },
      leadDetails: {
        title: "Lead Details",
        description: "Additional information about the lead",
      },
      source: {
        label: "Lead Source",
        description: "How the lead was acquired",
        placeholder: "Select source",
      },
      notes: {
        label: "Notes",
        description: "Additional notes or comments",
        placeholder: "Enter any additional information...",
      },
      response: {
        title: "Created Lead",
        description: "Details of the newly created lead",
        summary: {
          title: "Lead Summary",
          id: "Lead ID",
          businessName: "Business Name",
          email: "Email Address",
          status: "Lead Status",
        },
        contactDetails: {
          title: "Contact Details",
          phone: "Phone Number",
          website: "Website URL",
          country: "Country",
          language: "Language",
        },
        trackingInfo: {
          title: "Tracking Information",
          source: "Lead Source",
          emailsSent: "Email Count",
          currentCampaignStage: "Campaign Stage",
        },
        metadata: {
          title: "Metadata",
          notes: "Notes",
          createdAt: "Creation Date",
          updatedAt: "Last Updated",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to create leads",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid lead information provided",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred while creating lead",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred while creating lead",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while creating lead",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for lead creation",
        },
        notFound: {
          title: "Not Found",
          description: "Required resource not found for lead creation",
        },
        conflict: {
          title: "Conflict",
          description: "Lead already exists or data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the lead form",
        },
      },
      success: {
        title: "Lead Created",
        description: "Lead created successfully",
      },
    },
    email: {
      welcome: {
        subject: "Welcome to {{companyName}}",
        title: "Welcome to {{companyName}}, {{businessName}}!",
        preview: "Welcome to our service - let's get you started",
        greeting:
          "Welcome to {{companyName}}, {{businessName}}! We're excited to help you grow your business.",
        defaultName: "there",
        introduction:
          "Thank you for your interest in our services. We've received your information and our team is ready to help you achieve your business goals.",
        nextSteps: {
          title: "What happens next?",
          step1Number: "1.",
          step1: "Our team will review your business profile and goals",
          step2Number: "2.",
          step2:
            "You'll receive a personalized consultation proposal within 24 hours",
          step3Number: "3.",
          step3:
            "We'll schedule a call to discuss your specific needs and objectives",
        },
        cta: {
          getStarted: "Schedule Your Consultation",
        },
        support:
          "Have questions? Reply to this email or contact us at {{supportEmail}}",
        error: {
          noEmail: "Cannot send welcome email - no email address provided",
        },
      },
      admin: {
        newLead: {
          subject: "New Lead: {{businessName}}",
          title: "New Lead Created",
          preview: "New lead from {{businessName}} requires follow-up",
          message:
            "A new lead has been created in the system from {{businessName}} and requires your attention.",
          leadDetails: "Lead Details",
          businessName: "Business Name",
          email: "Email",
          phone: "Phone",
          website: "Website",
          source: "Source",
          status: "Status",
          notes: "Notes",
          notProvided: "Not provided",
          viewLead: "View Lead Details",
          viewAllLeads: "View All Leads",
          error: {
            noData: "Cannot send admin notification - no lead data provided",
          },
          defaultName: "New Lead",
        },
      },
      error: {
        general: {
          internal_server_error: "An internal server error occurred",
        },
      },
    },
  },
  export: {
    category: "Leads",
    tags: {
      leads: "Leads",
      export: "Export",
    },

    get: {
      title: "Export Leads",
      description: "Export leads data to file",
      form: {
        title: "Export Configuration",
        description: "Configure lead export parameters and filters",
      },
      format: {
        label: "Export Format",
        description: "File format for the export",
      },
      status: {
        label: "Lead Status",
        description: "Filter by lead status",
      },
      country: {
        label: "Country",
        description: "Filter by country",
        placeholder: "Select country",
      },
      language: {
        label: "Language",
        description: "Filter by language",
        placeholder: "Select language",
      },
      source: {
        label: "Lead Source",
        description: "Filter by lead source",
        placeholder: "Select source",
      },
      search: {
        label: "Search",
        description: "Search leads by text",
        placeholder: "Search leads...",
      },
      dateFrom: {
        label: "Start Date",
        description: "Export leads created from this date",
      },
      dateTo: {
        label: "End Date",
        description: "Export leads created until this date",
      },
      includeMetadata: {
        label: "Include Metadata",
        description: "Include creation and update timestamps",
      },
      includeEngagementData: {
        label: "Include Engagement Data",
        description: "Include email tracking and campaign data",
      },
      response: {
        title: "Export File",
        description: "Generated export file with lead data",
        fileName: "File Name",
        fileContent: "File Content (Base64)",
        mimeType: "MIME Type",
        totalRecords: "Total Records",
        exportedAt: "Exported At",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to export leads",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid export parameters or filters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred during export",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during export",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred during export",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for lead export",
        },
        notFound: {
          title: "No Data",
          description: "No leads found matching export criteria",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred during export",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the export form",
        },
      },
      success: {
        title: "Export Complete",
        description: "Lead export completed successfully",
      },
    },
    widget: {
      exportLeads: "Export Leads",
      import: "Import",
      viewList: "View List",
      importLeadsTitle: "Import Leads",
      viewLeadsListTitle: "View Leads List",
      copyCsvTitle: "Copy CSV content to clipboard",
      generatingExport: "Generating export…",
      generatingExportHint: "This may take a moment for large datasets",
      exportReady: "Export Ready",
      fileReadyToDownload: "Your file is ready to download",
      records: "Records",
      format: "Format",
      fileSize: "File Size",
      copied: "Copied!",
      copy: "Copy",
      download: "Download",
      exportedAt: "Exported at:",
      nextSteps: "Next steps:",
      viewLeads: "View Leads",
      importLeads: "Import Leads",
      configureExport: "Configure Export",
      configureExportHint:
        "Select format and filters below, then click Export to generate your file",
      formatLabel: "Format",
      formatHint: "Choose CSV or Excel (XLSX)",
      statusFilter: "Status filter",
      statusFilterHint: "Export only leads matching a specific status",
      dateRange: "Date range",
      dateRangeHint: "Narrow export to a specific time window",
      metadataEngagement: "Metadata & engagement",
      metadataEngagementHint:
        "Optionally include extra columns for advanced analysis",
      viewLeadsList: "View Leads List",
      excelSpreadsheet: "Excel Spreadsheet",
      csvFile: "CSV File",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
      },
      leadStatus: {
        new: "New",
        pending: "Pending",
        campaignRunning: "Campaign Running",
        websiteUser: "Website User",
        newsletterSubscriber: "Newsletter Subscriber",
        inContact: "In Contact",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Subscription Confirmed",
        unsubscribed: "Unsubscribed",
        bounced: "Bounced",
        invalid: "Invalid",
      },
      leadSource: {
        website: "Website",
        socialMedia: "Social Media",
        emailCampaign: "Email Campaign",
        referral: "Referral",
        csvImport: "CSV Import",
      },
    },
    headers: {
      email: "Email",
      businessName: "Business Name",
      contactName: "Contact Name",
      phone: "Phone",
      country: "Country",
      language: "Language",
      status: "Status",
      source: "Source",
      website: "Website",
      notes: "Notes",
      campaignStage: "Campaign Stage",
      emailsSent: "Emails Sent",
      emailsOpened: "Emails Opened",
      emailsClicked: "Emails Clicked",
      lastEmailSent: "Last Email Sent",
      lastEngagement: "Last Engagement",
      unsubscribedAt: "Unsubscribed At",
      createdAt: "Created At",
      updatedAt: "Updated At",
      lastEngagementAt: "Last Engagement",
      metadata: "Metadata",
      ipAddress: "IP Address",
      userAgent: "User Agent",
      deviceType: "Device Type",
      browser: "Browser",
      os: "OS",
      referralCode: "Referral Code",
    },
  },
  import: {
    tags: {
      import: "Import",
      leads: "Leads",
      csv: "CSV",
    },

    category: "Data Import",
    post: {
      title: "Import Leads",
      description: "Import leads from CSV file",
      form: {
        title: "Import Configuration",
        description: "Configure lead import parameters",
      },
      file: {
        label: "CSV File",
        description: "CSV file content (base64 encoded)",
        placeholder: "Paste base64 encoded CSV content",
        helpText: "Upload a CSV file with lead data",
      },
      fileName: {
        label: "File Name",
        description: "Name of the CSV file",
        placeholder: "leads.csv",
        helpText: "Provide a descriptive file name",
      },
      skipDuplicates: {
        label: "Skip Duplicates",
        description: "Skip leads with duplicate email addresses",
        helpText: "Enable to automatically skip existing email addresses",
      },
      updateExisting: {
        label: "Update Existing",
        description: "Update existing leads with new data",
        helpText: "Enable to update existing leads instead of skipping",
      },
      defaultCountry: {
        label: "Default Country",
        description: "Default country for leads without country specified",
        helpText: "Select the default country code",
      },
      defaultLanguage: {
        label: "Default Language",
        description: "Default language for leads without language specified",
        helpText: "Select the default language code",
      },
      defaultStatus: {
        label: "Default Status",
        description: "Default status for imported leads",
        helpText: "Select the initial status for new leads",
      },
      defaultCampaignStage: {
        label: "Default Campaign Stage",
        description: "Default email campaign stage for imported leads",
        helpText: "Select the initial campaign stage",
      },
      defaultSource: {
        label: "Default Source",
        description: "Default source attribution for imported leads",
        helpText: "Select the lead source for tracking",
      },
      useChunkedProcessing: {
        label: "Use Chunked Processing",
        description: "Process large imports in background chunks",
        helpText: "Enable for files with more than 1000 rows",
      },
      batchSize: {
        label: "Batch Size",
        description: "Number of rows to process per batch",
        helpText: "Recommended: 2000 rows per batch",
      },
      response: {
        batchId: "Batch ID",
        totalRows: "Total Rows",
        successfulImports: "Successful Imports",
        failedImports: "Failed Imports",
        duplicateEmails: "Duplicate Emails",
        errors: "Import Errors",
        summary: "Import Summary",
        isChunkedProcessing: "Using Chunked Processing",
        jobId: "Background Job ID",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid import parameters or CSV format",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to import leads",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for lead import",
        },
        notFound: {
          title: "Not Found",
          description: "CSV file not found or invalid",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict during import",
        },
        server: {
          title: "Server Error",
          description: "Internal server error during import",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during import",
        },
        network: {
          title: "Network Error",
          description: "Network error during import",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the import form",
        },
      },
      success: {
        title: "Import Started",
        description: "Lead import has been initiated successfully",
      },
      widget: {
        headerTitle: "Import Leads from CSV",
        exportTemplateButton: "Export Template",
        importGuideTitle: "Import Guide",
        importGuideSubtitle: "Upload a CSV file with the following columns:",
        importGuideNote:
          "Only {{email}} is required. All other columns are optional and will fall back to the defaults configured below.",
        fileRequirementsTitle: "File Requirements",
        fileRequirementFormat:
          "Format: CSV (comma-separated values, UTF-8 encoded)",
        fileRequirementHeader:
          "First row must be the header row with column names",
        fileRequirementSize: "Maximum recommended size: 50 MB per upload",
        fileRequirementChunked:
          "For files larger than ~5 000 rows, enable {{chunkedProcessing}} to avoid timeouts",
        chunkedProcessingLabel: "Chunked Processing",
        downloadTemplateLink: "Download CSV template",
        loadingText: "Importing leads\u2026",
        backgroundProcessingTitle: "Background Processing",
        backgroundProcessingNote:
          "Large import queued as job: {{jobId}}. Processing {{totalRows}} rows in the background.",
        checkJobStatusButton: "Check Job Status",
        stopJobButton: "Stop Job",
        retryFailedButton: "Retry Failed",
        statTotalRows: "Total Rows",
        statImported: "Imported",
        statDuplicates: "Duplicates",
        statFailed: "Failed",
        viewImportedLeadsButton: "View Imported Leads",
        retryFailedWithCountButton: "Retry Failed ({{count}})",
        summaryTitle: "Summary",
        summaryNewLeads: "New Leads",
        summaryUpdated: "Updated",
        summarySkipped: "Skipped",
        successRateLabel: "Success Rate",
        importErrorsTitle: "{{count}} Import Errors",
        errorRowLabel: "Row {{row}}",
        findLeadButton: "Find Lead",
      },
    },
    process: {
      tag: "Import Process",
      post: {
        title: "Process Import Jobs",
        titleShort: "Process Import",
        description: "Process pending CSV import jobs",
        container: {
          title: "Import Process Configuration",
          description: "Configure import process parameters",
        },
        fields: {
          maxJobsPerRun: {
            label: "Max Jobs Per Run",
            description: "Maximum number of jobs to process per run",
          },
          maxRetriesPerJob: {
            label: "Max Retries Per Job",
            description: "Maximum number of retries per job",
          },
          dryRun: {
            label: "Dry Run",
            description: "Run without making changes",
          },
          selfTaskId: {
            label: "Self Task ID",
            description: "Internal task ID for self-cleanup after processing",
          },
        },
        response: {
          jobsProcessed: "Jobs Processed",
          totalRowsProcessed: "Total Rows Processed",
          successfulImports: "Successful Imports",
          failedImports: "Failed Imports",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while processing imports",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
        },
        success: {
          title: "Import Processing Complete",
          description: "Import jobs processed successfully",
        },
      },
    },
    widget: {
      header: {
        title: "Import Jobs",
        newImport: "New Import",
      },
      filter: {
        all: "All",
        completed: "Completed",
        failed: "Failed",
        pending: "Pending",
        running: "Running",
      },
      loading: "Loading import jobs\u2026",
      empty: {
        title: "No import jobs found",
        withFilter: "Try a different filter or start a new import.",
        withoutFilter: "Start your first import to see it here.",
        newImport: "New Import",
      },
    },
    jobs: {
      jobId: {
        category: "Data Import",
        tags: {
          leads: "Leads",
          management: "Management",
        },

        get: {
          title: "Get Import Job",
          description: "Get details of a specific import job",
          actions: {
            retry: "Retry",
            stop: "Stop",
            viewLeads: "View Leads",
          },
          jobId: {
            label: "Job ID",
            description: "Unique identifier for the import job",
          },
          form: {
            title: "Import Job Status",
            description: "Current status and progress of the import job",
          },
          response: {
            title: "Job Information",
            description: "Current import job details",
            info: {
              title: "Job Information",
              description: "Basic job details",
            },
            id: {
              content: "Job ID",
            },
            fileName: {
              content: "File Name",
            },
            status: {
              content: "Job Status",
            },
            progress: {
              title: "Import Progress",
              description: "Current import progress and statistics",
            },
            totalRows: {
              content: "Total Rows",
            },
            processedRows: {
              content: "Processed Rows",
            },
            successfulImports: {
              content: "Successful Imports",
            },
            failedImports: {
              content: "Failed Imports",
            },
            duplicateEmails: {
              content: "Duplicate Emails",
            },
            configuration: {
              title: "Job Configuration",
              description: "Current job configuration settings",
            },
            currentBatchStart: {
              content: "Current Batch Start",
            },
            batchSize: {
              content: "Batch Size",
            },
            retryCount: {
              content: "Retry Count",
            },
            maxRetries: {
              content: "Max Retries",
            },
            error: {
              content: "Error Message",
            },
            timestamps: {
              title: "Job Timestamps",
              description: "Job lifecycle timestamps",
            },
            createdAt: {
              content: "Created At",
            },
            updatedAt: {
              content: "Updated At",
            },
            startedAt: {
              content: "Started At",
            },
            completedAt: {
              content: "Completed At",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided job ID is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required to view jobs",
            },
            forbidden: {
              title: "Access Denied",
              description: "You don't have permission to view this job",
            },
            notFound: {
              title: "Job Not Found",
              description: "No import job found with the provided ID",
            },
            server: {
              title: "Server Error",
              description: "An error occurred while retrieving the job",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Conflict",
              description: "A conflict occurred while retrieving the job",
            },
          },
          success: {
            title: "Success",
            description: "Import job retrieved successfully",
          },
        },
        patch: {
          title: "Update Import Job",
          description: "Update import job configuration settings",
          jobId: {
            label: "Job ID",
            description: "Unique identifier for the import job",
          },
          form: {
            title: "Update Job Settings",
            description: "Modify import job configuration",
          },
          settings: {
            title: "Job Settings",
            description: "Configuration settings for the import job",
          },
          batchSize: {
            label: "Batch Size",
            description: "Number of rows to process in each batch",
            placeholder: "100",
          },
          maxRetries: {
            label: "Max Retries",
            description: "Maximum number of retry attempts for failed rows",
            placeholder: "3",
          },
          response: {
            title: "Updated Job Information",
            description: "Updated import job details",
            info: {
              title: "Job Information",
              description: "Basic job details",
            },
            id: {
              content: "Job ID",
            },
            fileName: {
              content: "File Name",
            },
            status: {
              content: "Job Status",
            },
            progress: {
              title: "Import Progress",
              description: "Current import progress and statistics",
            },
            totalRows: {
              content: "Total Rows",
            },
            processedRows: {
              content: "Processed Rows",
            },
            successfulImports: {
              content: "Successful Imports",
            },
            failedImports: {
              content: "Failed Imports",
            },
            duplicateEmails: {
              content: "Duplicate Emails",
            },
            configuration: {
              title: "Job Configuration",
              description: "Current job configuration settings",
            },
            currentBatchStart: {
              content: "Current Batch Start",
            },
            batchSize: {
              content: "Batch Size",
            },
            retryCount: {
              content: "Retry Count",
            },
            maxRetries: {
              content: "Max Retries",
            },
            error: {
              content: "Error Message",
            },
            timestamps: {
              title: "Job Timestamps",
              description: "Job lifecycle timestamps",
            },
            createdAt: {
              content: "Created At",
            },
            updatedAt: {
              content: "Updated At",
            },
            startedAt: {
              content: "Started At",
            },
            completedAt: {
              content: "Completed At",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided data is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required to update jobs",
            },
            forbidden: {
              title: "Access Denied",
              description: "You don't have permission to update this job",
            },
            notFound: {
              title: "Job Not Found",
              description: "No import job found with the provided ID",
            },
            server: {
              title: "Server Error",
              description: "An error occurred while updating the job",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Update Conflict",
              description: "The job was modified by another user",
            },
          },
          success: {
            title: "Success",
            description: "Import job updated successfully",
          },
        },
        delete: {
          title: "Delete Import Job",
          description: "Delete a specific import job",
          jobId: {
            label: "Job ID",
            description: "Unique identifier for the import job to delete",
          },
          form: {
            title: "Delete Import Job",
            description: "Confirm deletion of the import job",
          },
          response: {
            title: "Deletion Result",
            description: "Result of the deletion operation",
            success: {
              content: "Success Status",
            },
            message: {
              content: "Deletion Message",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided job ID is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required to delete jobs",
            },
            forbidden: {
              title: "Access Denied",
              description: "You don't have permission to delete this job",
            },
            notFound: {
              title: "Job Not Found",
              description: "No import job found with the provided ID",
            },
            server: {
              title: "Server Error",
              description: "An error occurred while deleting the job",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Deletion Conflict",
              description: "Cannot delete job that is currently processing",
            },
          },
          success: {
            title: "Success",
            description: "Import job deleted successfully",
          },
        },
        retry: {
          category: "Data Import",
          tags: {
            leads: "Leads",
            management: "Management",
          },

          post: {
            title: "Retry Import Job",
            description: "Retry a failed import job",
            jobId: {
              label: "Job ID",
              description: "Unique identifier for the import job to retry",
            },
            form: {
              title: "Retry Import Job",
              description: "Retry the failed import job",
            },
            response: {
              title: "Retry Result",
              description: "Result of the retry operation",
              success: {
                content: "Success Status",
              },
              message: {
                content: "Retry Message",
              },
            },
            errors: {
              validation: {
                title: "Validation Error",
                description: "The provided job ID is invalid",
              },
              unauthorized: {
                title: "Unauthorized",
                description: "Authentication required to retry jobs",
              },
              forbidden: {
                title: "Access Denied",
                description: "You don't have permission to retry this job",
              },
              notFound: {
                title: "Job Not Found",
                description: "No import job found with the provided ID",
              },
              server: {
                title: "Server Error",
                description: "An error occurred while retrying the job",
              },
              unknown: {
                title: "Unknown Error",
                description: "An unexpected error occurred",
              },
              network: {
                title: "Network Error",
                description: "Unable to connect to the server",
              },
              unsavedChanges: {
                title: "Unsaved Changes",
                description: "You have unsaved changes",
              },
              conflict: {
                title: "Retry Conflict",
                description: "Cannot retry job that is currently processing",
              },
            },
            success: {
              title: "Success",
              description: "Import job retried successfully",
            },
          },
          widget: {
            title: "Retry Import Job",
            successMessage: "Job retry initiated successfully",
          },
        },
        stop: {
          category: "Data Import",
          tags: {
            leads: "Leads",
            management: "Management",
          },

          post: {
            title: "Stop Import Job",
            description: "Stop a running import job",
            jobId: {
              label: "Job ID",
              description: "Unique identifier for the import job to stop",
            },
            form: {
              title: "Stop Import Job",
              description: "Stop the running import job",
            },
            response: {
              title: "Stop Result",
              description: "Result of the stop operation",
              success: {
                content: "Success Status",
              },
              message: {
                content: "Stop Message",
              },
            },
            errors: {
              validation: {
                title: "Validation Error",
                description: "The provided job ID is invalid",
              },
              unauthorized: {
                title: "Unauthorized",
                description: "Authentication required to stop jobs",
              },
              forbidden: {
                title: "Access Denied",
                description: "You don't have permission to stop this job",
              },
              notFound: {
                title: "Job Not Found",
                description: "No import job found with the provided ID",
              },
              server: {
                title: "Server Error",
                description: "An error occurred while stopping the job",
              },
              unknown: {
                title: "Unknown Error",
                description: "An unexpected error occurred",
              },
              network: {
                title: "Network Error",
                description: "Unable to connect to the server",
              },
              unsavedChanges: {
                title: "Unsaved Changes",
                description: "You have unsaved changes",
              },
              conflict: {
                title: "Stop Conflict",
                description: "Cannot stop job that is not currently processing",
              },
            },
            success: {
              title: "Success",
              description: "Import job stopped successfully",
            },
          },
          widget: {
            title: "Stop Import Job",
            successMessage: "Job stopped successfully",
          },
        },
        widget: {
          status: {
            title: "Import Job Status",
            loadingJobStatus: "Loading job status…",
            totalRows: "Total Rows",
            processed: "Processed",
            imported: "Imported",
            failed: "Failed",
            duplicates: "Duplicates",
            progress: "Progress",
            configurationTitle: "Configuration",
            batchSize: "Batch Size",
            batchStart: "Batch Start",
            retries: "Retries",
            timestampsTitle: "Timestamps",
            created: "Created",
            started: "Started",
            completed: "Completed",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "Pending",
                  processing: "Processing",
                  completed: "Completed",
                  failed: "Failed",
                },
              },
            },
          },
          retry: {
            title: "Retry Import Job",
            loadingRetrying: "Retrying job…",
            successMessage: "Job Retried Successfully",
            failureMessage: "Retry Failed",
            viewJobStatus: "View Job Status",
            viewLeads: "View Leads",
          },
          stop: {
            title: "Stop Import Job",
            loadingStopping: "Stopping job…",
            successMessage: "Job Stopped Successfully",
            failureMessage: "Stop Failed",
            viewLeads: "View Leads",
            startNewImport: "Start New Import",
          },
        },
      },
    },
    status: {
      category: "Data Import",
      tags: {
        import: "Import",
        jobs: "Jobs",
        list: "List",
      },

      get: {
        title: "Import Jobs Status",
        description: "List and monitor CSV import jobs",
        form: {
          title: "Job Filters",
          description: "Filter import jobs by status and pagination",
        },
        filters: {
          title: "Filters",
          description: "Filter options for import jobs",
        },
        status: {
          label: "Job Status",
          description: "Filter by job status",
          placeholder: "Select status",
        },
        limit: {
          label: "Results Per Page",
          description: "Number of jobs to return",
          placeholder: "50",
        },
        offset: {
          label: "Page Offset",
          description: "Number of jobs to skip",
          placeholder: "0",
        },
        response: {
          title: "Import Jobs",
          description: "List of import jobs with their current status",
          items: {
            title: "Jobs List",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid filter parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to view import jobs",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden for import jobs",
          },
          notFound: {
            title: "Not Found",
            description: "No import jobs found",
          },
          server: {
            title: "Server Error",
            description: "Internal server error while fetching jobs",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error while fetching jobs",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Jobs Retrieved",
          description: "Import jobs list retrieved successfully",
        },
      },
      widget: {
        status: {
          pending: "Pending",
          running: "Running",
          completed: "Completed",
          failed: "Failed",
          stopped: "Stopped",
        },
        filter: {
          all: "All",
          pending: "Pending",
          running: "Running",
          completed: "Completed",
          failed: "Failed",
        },
        progress: {
          rows: "rows",
        },
        job: {
          total: "Total:",
          processed: "Processed:",
          ok: "OK:",
          fail: "Fail:",
          created: "Created:",
          done: "Done:",
        },
        header: {
          title: "Import Jobs",
          newImport: "New Import",
        },
        loading: "Loading import jobs\u2026",
        empty: {
          title: "No import jobs found",
          withFilter: "Try a different filter or start a new import.",
          withoutFilter: "Start your first import to see it here.",
          newImport: "New Import",
        },
      },
    },
    csv: {
      post: {
        title: "Import CSV Data",
        description:
          "Import data from CSV files with intelligent processing and validation",
        form: {
          title: "CSV Import Configuration",
          description: "Configure your CSV import settings for optimal results",
        },
        fileSection: {
          title: "File Upload",
          description: "Select your CSV file and specify the target domain",
        },
        file: {
          label: "CSV File",
          description: "Select a CSV file to upload (max 10MB)",
          placeholder: "Choose CSV file...",
          helpText:
            "Supported format: CSV with comma-separated values. First row should contain column headers.",
        },
        fileName: {
          label: "File Name",
          description: "Name for this import (for your reference)",
          placeholder: "e.g., January 2024 Leads Import",
        },
        domain: {
          label: "Import Domain",
          description: "What type of data are you importing?",
          placeholder: "Select data type...",
        },
        processingSection: {
          title: "Processing Options",
          description: "Configure how your data should be processed",
        },
        skipDuplicates: {
          label: "Skip Duplicates",
          description: "Skip records with duplicate email addresses",
          helpText: "Recommended: Prevents importing the same contact twice",
        },
        updateExisting: {
          label: "Update Existing",
          description: "Update existing records with new data from CSV",
          helpText: "If unchecked, existing records will be left unchanged",
        },
        useChunkedProcessing: {
          label: "Background Processing",
          description: "Process large files in the background",
          helpText: "Recommended for files with more than 500 records",
        },
        batchSize: {
          label: "Batch Size",
          description: "Number of records to process at once",
          placeholder: "100",
          helpText:
            "Smaller batches are more stable, larger batches are faster",
        },
        defaultsSection: {
          title: "Default Values (Optional)",
          description:
            "Set default values for records missing this information",
        },
        defaultCountry: {
          label: "Default Country",
          description: "Country for records without location",
          placeholder: "Select country...",
        },
        defaultLanguage: {
          label: "Default Language",
          description: "Language for records without language preference",
          placeholder: "Select language...",
        },
        response: {
          title: "Import Results",
          description: "Summary of your CSV import operation",
          basicResults: {
            title: "Basic Results",
            description: "Core import statistics",
          },
          batchId: {
            label: "Batch ID",
          },
          totalRows: {
            label: "Total Rows",
          },
          isChunkedProcessing: {
            label: "Background Processing",
          },
          jobId: {
            label: "Job ID",
          },
          statistics: {
            title: "Import Statistics",
            description: "Detailed breakdown of the import operation",
          },
          successfulImports: {
            label: "Successful Imports",
          },
          failedImports: {
            label: "Failed Imports",
          },
          duplicateEmails: {
            label: "Duplicate Emails",
          },
          processingTimeMs: {
            label: "Processing Time (ms)",
          },
          summary: {
            title: "Import Summary",
            description: "Overview of import results",
          },
          newRecords: {
            label: "New Records",
          },
          updatedRecords: {
            label: "Updated Records",
          },
          skippedDuplicates: {
            label: "Skipped Duplicates",
          },
          errors: {
            title: "Error Details",
            row: {
              label: "Row",
            },
            email: {
              label: "Email",
            },
            error: {
              label: "Error",
            },
          },
          nextSteps: {
            title: "Next Steps",
            item: {
              label: "Next Step",
            },
          },
        },
        errors: {
          validation: {
            title: "Invalid Import Data",
            description: "Please check your CSV file and settings",
            emptyFile: "CSV file content is required",
            emptyFileName: "Please provide a name for this import",
            invalidDomain: "Please select a valid import domain",
            invalidBatchSize: "Batch size must be between 10 and 1000",
            fileTooLarge:
              "File size exceeds 10MB limit. Consider using background processing.",
          },
          unauthorized: {
            title: "Access Denied",
            description: "You don't have permission to import data",
          },
          fileTooLarge: {
            title: "File Too Large",
            description:
              "The selected file exceeds the maximum size limit of 10MB",
          },
          server: {
            title: "Import Failed",
            description:
              "An error occurred while processing your import. Please try again.",
          },
          network: {
            title: "Network Error",
            description: "Network connection failed during import",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have permission to perform this import",
          },
          notFound: {
            title: "Not Found",
            description: "Import resource not found",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Data Conflict",
            description: "A conflict occurred with existing data",
          },
        },
        success: {
          title: "Import Successful",
          description: "Your CSV data has been successfully imported",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "Pending",
          description: "Job is waiting to be processed",
        },
        processing: {
          label: "Processing",
          description: "Job is currently being processed",
        },
        completed: {
          label: "Completed",
          description: "Job finished successfully",
        },
        failed: {
          label: "Failed",
          description: "Job encountered an error",
        },
        cancelled: {
          label: "Cancelled",
          description: "Job was cancelled by user",
        },
        paused: {
          label: "Paused",
          description: "Job processing is temporarily paused",
        },
      },
      domain: {
        leads: {
          label: "Leads",
          description: "Potential customers and business contacts",
        },
        contacts: {
          label: "Contacts",
          description: "General contact information and address book",
        },
        businessData: {
          label: "Business Data",
          description: "Company information and business profiles",
        },
        emails: {
          label: "Email Lists",
          description: "Email marketing lists and campaigns",
        },
        users: {
          label: "Users",
          description: "System users and account information",
        },
        templates: {
          label: "Templates",
          description: "Email templates and content",
        },
      },
      format: {
        csv: {
          label: "CSV File",
          description: "Comma-separated values (most common)",
        },
        xlsx: {
          label: "Excel File",
          description: "Microsoft Excel spreadsheet",
        },
        json: {
          label: "JSON File",
          description: "JavaScript Object Notation data",
        },
        tsv: {
          label: "TSV File",
          description: "Tab-separated values",
        },
      },
      processing: {
        immediate: {
          label: "Process Now",
          description: "Process the file immediately (fastest)",
        },
        background: {
          label: "Background",
          description: "Process in the background (for large files)",
        },
        scheduled: {
          label: "Schedule Later",
          description: "Schedule processing for a specific time",
        },
      },
      errorType: {
        validation: {
          label: "Validation Error",
          description: "Data doesn't meet required format or rules",
        },
        duplicate: {
          label: "Duplicate Data",
          description: "Record already exists in the system",
        },
        format: {
          label: "Format Error",
          description: "File format is incorrect or corrupted",
        },
        processing: {
          label: "Processing Error",
          description: "Error occurred during data processing",
        },
        system: {
          label: "System Error",
          description: "Internal system error",
        },
      },
      batchSize: {
        small: {
          label: "Small (50)",
          description: "Best for testing or small imports",
        },
        medium: {
          label: "Medium (100)",
          description: "Recommended for most imports",
        },
        large: {
          label: "Large (250)",
          description: "Good for large files with simple data",
        },
        xlarge: {
          label: "Extra Large (500)",
          description: "For very large files (advanced users)",
        },
      },
    },
    nextSteps: {
      reviewErrors: "Review the error details to understand what went wrong",
      checkDuplicates: "Consider adjusting duplicate handling settings",
      reviewLeads: "Review your imported leads in the leads management section",
      startCampaign: "Consider starting an email campaign with your new leads",
      reviewContacts: "Review your imported contacts in the contacts section",
      organizeContacts: "Organize your contacts into groups or tags",
      reviewImported: "Review your imported data in the relevant section",
      monitorProgress: "Monitor the progress in the job history",
      checkJobsList: "Check the jobs list for detailed status updates",
    },
    errors: {
      cancel: {
        server: "Failed to cancel import job",
      },
      retry: {
        server: "Failed to retry import job",
      },
      delete: {
        server: "Failed to delete import job",
      },
      status: {
        server: "Failed to get job status",
      },
    },
    error: {
      default: "An error occurred",
    },
    enums: {
      csvImportJobStatus: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
      },
      csvImportJobAction: {
        retry: "Retry",
        delete: "Delete",
        stop: "Stop",
      },
      importMode: {
        createOnly: "Create Only",
        updateOnly: "Update Only",
        createOrUpdate: "Create or Update",
        skipDuplicates: "Skip Duplicates",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "Immediate",
        chunked: "Chunked",
        scheduled: "Scheduled",
      },
      importErrorType: {
        validationError: "Validation Error",
        duplicateEmail: "Duplicate Email",
        invalidFormat: "Invalid Format",
        missingRequiredField: "Missing Required Field",
        processingError: "Processing Error",
        systemError: "System Error",
      },
      batchProcessingStatus: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
        retrying: "Retrying",
      },
      importPriority: {
        low: "Low",
        normal: "Normal",
        high: "High",
        urgent: "Urgent",
      },
      importSource: {
        webUpload: "Web Upload",
        apiUpload: "API Upload",
        scheduledImport: "Scheduled Import",
        bulkOperation: "Bulk Operation",
      },
      csvDelimiter: {
        comma: "Comma",
        semicolon: "Semicolon",
        tab: "Tab",
        pipe: "Pipe",
      },
      importValidationLevel: {
        strict: "Strict",
        moderate: "Moderate",
        lenient: "Lenient",
      },
      importNotificationType: {
        email: "Email",
        inApp: "In-App",
        webhook: "Webhook",
        none: "None",
      },
      leadStatus: {
        new: "New",
        pending: "Pending",
        campaignRunning: "Campaign Running",
        websiteUser: "Website User",
        newsletterSubscriber: "Newsletter Subscriber",
        inContact: "In Contact",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Subscription Confirmed",
        unsubscribed: "Unsubscribed",
        bounced: "Bounced",
        invalid: "Invalid",
      },
      emailCampaignStage: {
        notStarted: "Not Started",
        initial: "Initial Contact",
        followup1: "Follow-up 1",
        followup2: "Follow-up 2",
        followup3: "Follow-up 3",
        nurture: "Nurture",
        reactivation: "Reactivation",
      },
      leadSource: {
        website: "Website",
        socialMedia: "Social Media",
        emailCampaign: "Email Campaign",
        referral: "Referral",
        csvImport: "CSV Import",
      },
    },
  },
  lead: {
    id: {
      category: "Leads",
      tags: {
        leads: "Leads",
        management: "Management",
      },

      get: {
        title: "Get Lead Details",
        description: "Retrieve detailed information about a specific lead",
        backButton: {
          label: "Back to Leads",
        },
        editButton: {
          label: "Edit Lead",
        },
        deleteButton: {
          label: "Delete Lead",
        },
        id: {
          label: "Lead ID",
          description: "Unique identifier for the lead",
        },
        form: {
          title: "Lead Details Request",
          description: "Request parameters for retrieving lead information",
        },
        response: {
          title: "Lead Information",
          description: "Complete lead details and history",
          basicInfo: {
            title: "Basic Information",
            description: "Core lead identification and status",
          },
          id: {
            content: "Lead ID",
          },
          email: {
            content: "Email Address",
          },
          businessName: {
            content: "Business Name",
          },
          contactName: {
            content: "Contact Name",
          },
          status: {
            content: "Lead Status",
          },
          contactDetails: {
            title: "Contact Details",
            description: "Contact information and preferences",
          },
          phone: {
            content: "Phone Number",
          },
          website: {
            content: "Website URL",
          },
          country: {
            content: "Country",
          },
          language: {
            content: "Language",
          },
          campaignTracking: {
            title: "Campaign Tracking",
            description: "Email campaign and tracking information",
          },
          source: {
            content: "Lead Source",
          },
          currentCampaignStage: {
            content: "Current Campaign Stage",
          },
          emailJourneyVariant: {
            content: "Email Journey Variant",
          },
          emailsSent: {
            content: "Emails Sent",
          },
          lastEmailSentAt: {
            content: "Last Email Sent",
          },
          engagement: {
            title: "Engagement Metrics",
            description: "Email engagement and interaction data",
          },
          emailsOpened: {
            content: "Emails Opened",
          },
          emailsClicked: {
            content: "Emails Clicked",
          },
          lastEngagementAt: {
            content: "Last Engagement",
          },
          unsubscribedAt: {
            content: "Unsubscribed At",
          },
          conversion: {
            title: "Conversion Tracking",
            description: "Lead conversion and milestone tracking",
          },
          convertedUserId: {
            content: "Converted User ID",
          },
          convertedAt: {
            content: "Converted At",
          },
          signedUpAt: {
            content: "Signed Up At",
          },
          subscriptionConfirmedAt: {
            content: "Subscription Confirmed At",
          },
          metadata: {
            title: "Additional Information",
            description: "Notes and metadata",
            content: "Metadata",
          },
          notes: {
            content: "Notes",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
          identity: {
            title: "Device & Identity",
            description: "Tracking identity and device information",
          },
          ipAddress: {
            content: "IP Address",
          },
          userAgent: {
            content: "User Agent",
          },
          deviceType: {
            content: "Device Type",
          },
          browser: {
            content: "Browser",
          },
          os: {
            content: "Operating System",
          },
          referralCode: {
            content: "Referral Code",
          },
          lifecycle: {
            title: "Lifecycle",
            description: "Additional lifecycle timestamps",
          },
          bouncedAt: {
            content: "Bounced At",
          },
          invalidAt: {
            content: "Invalid At",
          },
          campaignStartedAt: {
            content: "Campaign Started At",
          },
          linkedLeads: {
            title: "Linked Leads",
            description: "Leads identified as the same person",
            linkedLeadId: {
              content: "Linked Lead ID",
            },
            linkReason: {
              content: "Link Reason",
            },
            linkedAt: {
              content: "Linked At",
            },
            email: {
              content: "Email",
            },
            businessName: {
              content: "Business Name",
            },
            status: {
              content: "Status",
            },
            ipAddress: {
              content: "IP Address",
            },
            userAgent: {
              content: "User Agent",
            },
            createdAt: {
              content: "Created At",
            },
          },
          linkedUsers: {
            title: "Linked User Accounts",
            description: "User accounts associated with this lead",
            userId: {
              content: "User ID",
            },
            linkReason: {
              content: "Link Reason",
            },
            linkedAt: {
              content: "Linked At",
            },
            email: {
              content: "Email",
            },
            publicName: {
              content: "Display Name",
            },
          },
          referralHistory: {
            title: "Referral History",
            description: "Referral codes this lead clicked before signing up",
            code: {
              content: "Referral Code",
            },
            ownerUserId: {
              content: "Code Owner",
            },
            clickedAt: {
              content: "Clicked At",
            },
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided lead ID is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to access lead details",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to view this lead",
          },
          notFound: {
            title: "Lead Not Found",
            description: "No lead found with the provided ID",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while retrieving lead details",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Data Conflict",
            description: "The lead data has been modified",
          },
        },
        success: {
          title: "Success",
          description: "Lead details retrieved successfully",
        },
      },
      patch: {
        title: "Update Lead",
        description: "Update lead information and status",
        backButton: {
          label: "Back to Lead",
        },
        deleteButton: {
          label: "Delete Lead",
        },
        submitButton: {
          label: "Update Lead",
          loadingText: "Updating Lead...",
        },
        id: {
          label: "Lead ID",
          description: "Unique identifier for the lead to update",
        },
        form: {
          title: "Update Lead",
          description: "Modify lead information",
        },
        updates: {
          title: "Lead Updates",
          description: "Fields to update",
        },
        basicInfo: {
          title: "Basic Information",
          description: "Update core lead information",
        },
        email: {
          label: "Email Address",
          description: "Lead's email address",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Business Name",
          description: "Name of the business",
          placeholder: "Acme Corporation",
        },
        contactName: {
          label: "Contact Name",
          description: "Primary contact person",
          placeholder: "John Doe",
        },
        status: {
          label: "Lead Status",
          description: "Current status of the lead",
          placeholder: "Select status",
        },
        contactDetails: {
          title: "Contact Details",
          description: "Update contact information",
        },
        phone: {
          label: "Phone Number",
          description: "Contact phone number",
          placeholder: "+1234567890",
        },
        website: {
          label: "Website",
          description: "Business website URL",
          placeholder: "https://example.com",
        },
        country: {
          label: "Country",
          description: "Business country",
          placeholder: "Select country",
        },
        language: {
          label: "Language",
          description: "Preferred language",
          placeholder: "Select language",
        },
        campaignManagement: {
          title: "Campaign Management",
          description: "Manage campaign settings",
        },
        source: {
          label: "Lead Source",
          description: "Origin of the lead",
          placeholder: "Select source",
        },
        currentCampaignStage: {
          label: "Campaign Stage",
          description: "Current email campaign stage",
          placeholder: "Select stage",
        },
        additionalDetails: {
          title: "Additional Details",
          description: "Notes and metadata",
        },
        notes: {
          label: "Notes",
          description: "Internal notes about the lead",
          placeholder: "Add notes here",
        },
        metadata: {
          label: "Metadata",
          description: "Additional metadata (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "Converted User ID",
          description: "ID of the converted user account",
          placeholder: "User ID",
        },
        subscriptionConfirmedAt: {
          label: "Subscription Confirmed At",
          description: "Date when subscription was confirmed",
          placeholder: "Select date",
        },
        response: {
          title: "Updated Lead",
          description: "Updated lead information",
          basicInfo: {
            title: "Basic Information",
            description: "Updated core lead information",
          },
          id: {
            content: "Lead ID",
          },
          email: {
            content: "Email Address",
          },
          businessName: {
            content: "Business Name",
          },
          contactName: {
            content: "Contact Name",
          },
          status: {
            content: "Lead Status",
          },
          contactDetails: {
            title: "Contact Details",
            description: "Updated contact information",
          },
          phone: {
            content: "Phone Number",
          },
          website: {
            content: "Website URL",
          },
          country: {
            content: "Country",
          },
          language: {
            content: "Language",
          },
          campaignTracking: {
            title: "Campaign Tracking",
            description: "Updated campaign information",
          },
          source: {
            content: "Lead Source",
          },
          currentCampaignStage: {
            content: "Current Campaign Stage",
          },
          emailJourneyVariant: {
            content: "Email Journey Variant",
          },
          emailsSent: {
            content: "Emails Sent",
          },
          lastEmailSentAt: {
            content: "Last Email Sent",
          },
          engagement: {
            title: "Engagement Metrics",
            description: "Email engagement data",
          },
          emailsOpened: {
            content: "Emails Opened",
          },
          emailsClicked: {
            content: "Emails Clicked",
          },
          lastEngagementAt: {
            content: "Last Engagement",
          },
          unsubscribedAt: {
            content: "Unsubscribed At",
          },
          conversion: {
            title: "Conversion Tracking",
            description: "Conversion milestone tracking",
          },
          convertedUserId: {
            content: "Converted User ID",
          },
          convertedAt: {
            content: "Converted At",
          },
          signedUpAt: {
            content: "Signed Up At",
          },
          subscriptionConfirmedAt: {
            content: "Subscription Confirmed At",
          },
          metadata: {
            title: "Additional Information",
            description: "Notes and metadata",
            content: "Metadata",
          },
          notes: {
            content: "Notes",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided data is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to update leads",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to update this lead",
          },
          notFound: {
            title: "Lead Not Found",
            description: "No lead found with the provided ID",
          },
          conflict: {
            title: "Update Conflict",
            description: "The lead was modified by another user",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while updating the lead",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        success: {
          title: "Success",
          description: "Lead updated successfully",
        },
      },
      post: {
        title: "[id]",
        description: "[id] endpoint",
        form: {
          title: "[id] Configuration",
          description: "Configure [id] parameters",
        },
        response: {
          title: "Response",
          description: "[id] response data",
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
      enums: {
        leadStatus: {
          new: "New",
          pending: "Pending",
          campaignRunning: "Campaign Running",
          websiteUser: "Website User",
          newsletterSubscriber: "Newsletter Subscriber",
          inContact: "In Contact",
          signedUp: "Signed Up",
          subscriptionConfirmed: "Subscription Confirmed",
          unsubscribed: "Unsubscribed",
          bounced: "Bounced",
          invalid: "Invalid",
        },
        leadSource: {
          website: "Website",
          referral: "Referral",
          socialMedia: "Social Media",
          emailCampaign: "Email Campaign",
          csvImport: "CSV Import",
          api: "API",
          manual: "Manual",
          other: "Other",
        },
        emailCampaignStage: {
          notStarted: "Not Started",
          initial: "Initial Contact",
          followup1: "Follow-up 1",
          followup2: "Follow-up 2",
          followup3: "Follow-up 3",
          nurture: "Nurture",
          reactivation: "Reactivation",
        },
        emailJourneyVariant: {
          uncensoredConvert: "Uncensored Convert",
          sideHustle: "Side Hustle",
          quietRecommendation: "Quiet Recommendation",
        },
      },
      widget: {
        loading: "Loading lead...",
        notFound: "Lead not found.",
        back: "Back",
        leadFallbackTitle: "Lead",
        edit: "Edit",
        delete: "Delete",
        converted: "Converted",
        quickActions: "Quick Actions",
        editLead: "Edit Lead",
        sendTestEmail: "Send Test Email",
        viewInSearch: "View in Search",
        userProfile: "User Profile",
        userDetail: "User Detail",
        creditHistory: "Credit History",
        campaignFunnel: "Campaign Funnel",
        sourceLabel: "Source:",
        lastEmailLabel: "Last email:",
        campaignPerformance: "Campaign Performance",
        emailsSent: "Emails Sent",
        opened: "Opened",
        clicked: "Clicked",
        openRate: "Open Rate",
        clickRate: "Click Rate",
        clickToOpenRate: "Click-to-Open Rate",
        contactDetails: "Contact Details",
        country: "Country",
        language: "Language",
        engagement: "Engagement",
        emailsOpened: "Emails Opened",
        emailsClicked: "Emails Clicked",
        lastEngagement: "Last Engagement",
        unsubscribed: "Unsubscribed",
        conversion: "Conversion",
        signedUp: "Signed Up",
        convertedAt: "Converted At",
        subscriptionConfirmed: "Subscription Confirmed",
        convertedUserId: "Converted User ID",
        activeSubscriberSince: "Active subscriber since",
        viewUserProfile: "View User Profile",
        viewUserDetail: "View User Detail",
        notesAndMetadata: "Notes & Metadata",
        notes: "Notes",
        metadata: "Metadata",
        created: "Created",
        lastUpdated: "Last Updated",
        daysOld: "days old",
        lastEngaged: "Last engaged",
        ago: "ago",
        variant: "Variant:",
        copyEmail: "email",
        copyId: "ID",
        copyPhone: "phone",
        copyUserId: "user ID",
        stageNotStarted: "Not Started",
        stageInitial: "Initial",
        stageFollowup1: "Follow-up 1",
        stageFollowup2: "Follow-up 2",
        stageFollowup3: "Follow-up 3",
        stageNurture: "Nurture",
        stageReactivation: "Reactivation",
        tabOverview: "Overview",
        tabDetails: "Details",
        tabIdentity: "Identity",
        tabBasic: "Basic",
        tabCampaign: "Campaign",
        tabAdvanced: "Advanced",
        deviceIdentity: "Device & Identity",
        ipAddress: "IP Address",
        userAgent: "User Agent",
        deviceType: "Device Type",
        browser: "Browser",
        os: "Operating System",
        referralCode: "Referral Code",
        lifecycleTimestamps: "Lifecycle",
        bouncedAt: "Bounced At",
        invalidAt: "Invalid At",
        campaignStartedAt: "Campaign Started At",
        linkedLeadsSection: "Linked Leads",
        linkedLeadsEmpty: "No linked leads",
        linkedUsersSection: "Linked User Accounts",
        linkedUsersEmpty: "No linked user accounts",
        linkReason: "Link reason:",
        linkedAt: "Linked at:",
        copyIp: "IP",
        copyLinkedLeadId: "lead ID",
        copyUserId2: "user ID",
      },
      delete: {
        title: "Delete Lead",
        description: "Delete a lead from the system",
        container: {
          title: "Delete Lead",
          description: "Are you sure you want to permanently delete this lead?",
        },
        backButton: {
          label: "Back to Lead",
        },
        submitButton: {
          label: "Delete Lead",
          loadingText: "Deleting Lead...",
        },
        actions: {
          delete: "Delete Lead",
          deleting: "Deleting Lead...",
        },
        id: {
          label: "Lead ID",
          description: "Unique identifier for the lead to delete",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided lead ID is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to delete leads",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to delete this lead",
          },
          notFound: {
            title: "Lead Not Found",
            description: "No lead found with the provided ID",
          },
          conflict: {
            title: "Delete Conflict",
            description:
              "The lead cannot be deleted due to existing dependencies",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while deleting the lead",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        success: {
          title: "Lead Deleted",
          description: "The lead has been successfully deleted",
        },
      },
    },
  },
  list: {
    category: "Leads",
    tags: {
      leads: "Leads",
      management: "Management",
    },

    get: {
      title: "List Leads",
      description: "Retrieve a paginated list of leads with filtering",
      createButton: {
        label: "Create Lead",
      },
      form: {
        title: "Lead List Filters",
        description: "Configure filters for lead list",
      },
      actions: {
        refresh: "Refresh",
        refreshing: "Refreshing...",
      },
      page: {
        label: "Page Number",
        description: "Page number for pagination",
        placeholder: "Enter page number",
      },
      limit: {
        label: "Results Per Page",
        description: "Number of results to show per page",
        placeholder: "Enter limit",
      },
      status: {
        label: "Lead Status",
        description: "Filter by lead status",
        placeholder: "Select status",
      },
      currentCampaignStage: {
        label: "Campaign Stage",
        description: "Filter by current campaign stage",
        placeholder: "Select campaign stage",
      },
      source: {
        label: "Lead Source",
        description: "Filter by lead source",
        placeholder: "Select source",
      },
      country: {
        label: "Country",
        description: "Filter by country",
        placeholder: "Select countries",
      },
      language: {
        label: "Language",
        description: "Filter by language",
        placeholder: "Select languages",
      },
      search: {
        label: "Search",
        description: "Search leads by name, email, or business",
        placeholder: "Enter search term",
      },
      searchPagination: {
        title: "Search & Pagination",
        description: "Search and pagination controls",
      },
      statusFilters: {
        title: "Status & Campaign Filters",
        description: "Filter by status, campaign stage, and source",
      },
      locationFilters: {
        title: "Location Filters",
        description: "Filter by country and language",
      },
      sortingOptions: {
        title: "Sorting Options",
        description: "Configure result sorting",
      },
      sortBy: {
        label: "Sort By",
        description: "Field to sort results by",
        placeholder: "Select sort field",
      },
      sortOrder: {
        label: "Sort Order",
        description: "Sort order for results",
        placeholder: "Select sort order",
      },
      response: {
        title: "Lead List Response",
        description: "Paginated list of leads with metadata",
        leads: {
          title: "Lead Details",
          description: "Individual lead information",
          id: "Lead ID",
          email: "Email Address",
          businessName: "Business Name",
          contactName: "Contact Name",
          phone: "Phone Number",
          website: "Website",
          country: "Country",
          language: "Language",
          status: "Status",
          source: "Source",
          notes: "Notes",
          convertedUserId: "Converted User ID",
          convertedAt: "Converted At",
          signedUpAt: "Signed Up At",
          subscriptionConfirmedAt: "Subscription Confirmed At",
          currentCampaignStage: "Current Campaign Stage",
          emailsSent: "Emails Sent",
          lastEmailSentAt: "Last Email Sent At",
          unsubscribedAt: "Unsubscribed At",
          emailsOpened: "Emails Opened",
          emailsClicked: "Emails Clicked",
          lastEngagementAt: "Last Engagement At",
          metadata: "Metadata",
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
        total: "Total Leads",
        page: "Current Page",
        limit: "Page Size",
        totalPages: "Total Pages",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to list leads",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid filter parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred while fetching leads",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred while fetching leads",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while fetching leads",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for lead list",
        },
        notFound: {
          title: "Not Found",
          description: "Leads not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred while fetching leads",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the lead list",
        },
      },
      success: {
        title: "Success",
        description: "Lead list retrieved successfully",
      },
      emptySearch: "No leads match your filters",
      emptyState: "No leads yet",
    },
    widget: {
      converted: "Converted",
      emailsSent: "{{count}} emails sent",
      openRate: "{{percent}}% open rate",
      clicks: "{{count}} clicks",
      stats: "Stats",
      graphs: "Graphs",
      search: "Search",
      export: "Export",
      import: "Import",
      batch: "Batch",
      refresh: "Refresh",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      allSources: "All sources",
      clearSearch: "Clear search",
      clearStatusFilter: "Clear status filter",
      clearSourceFilter: "Clear source filter",
      addLead: "Add lead",
      importCsv: "Import CSV",
      pagination: "Page {{page}} of {{totalPages}} · {{total}} leads",
      tabAll: "All",
      tabNew: "New",
      tabCampaign: "Campaign",
      tabConfirmed: "Confirmed",
      tabUnsubscribed: "Unsubscribed",
      tabBounced: "Bounced",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      sortEmailsSentHigh: "Emails sent (high)",
      sortEmailsSentLow: "Emails sent (low)",
      sortBusinessNameAZ: "Business name (A-Z)",
      sortBusinessNameZA: "Business name (Z-A)",
      linkedCount: "{{count}} linked",
      hasLinkedUser: "User",
      referralCode: "Ref Code",
    },
  },
  search: {
    category: "Lead Management",
    tags: {
      leads: "Leads",
      search: "Search",
    },
    get: {
      title: "Search Leads",
      description: "Search leads with filtering and pagination",
      form: {
        title: "Lead Search Form",
        description: "Enter search criteria to find leads",
      },
      search: {
        label: "Search Query",
        description:
          "Search term to filter leads by email, business name, or notes",
        placeholder: "Enter search term...",
      },
      status: {
        label: "Status Filter",
        description: "Filter leads by status",
      },
      limit: {
        label: "Results Limit",
        description: "Maximum number of results to return (1-100)",
      },
      offset: {
        label: "Results Offset",
        description: "Number of results to skip for pagination",
      },
      response: {
        title: "Search Results",
        description: "Paginated search results with lead data",
        leads: {
          title: "Leads",
          item: "Lead",
        },
        total: "Total Results",
        hasMore: "Has More Results",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to search leads",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid search parameters provided",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred while searching leads",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred while searching leads",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while searching leads",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden for lead search",
        },
        notFound: {
          title: "No Results",
          description: "No leads found matching search criteria",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes in the search form",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred while searching leads",
        },
      },
      success: {
        title: "Search Complete",
        description: "Lead search completed successfully",
      },
    },
    widget: {
      title: "Search Leads",
      filterLabel: "Filter:",
      clearFilter: "Clear",
      noResultsTitle: "No results found",
      noResultsSubtitle: "Search by email, business name, or phone",
      createLead: "Create Lead",
      noLeadsMatchFilter: "No leads match the selected filters.",
      clearFilters: "Clear filters",
      loadMore: "Load more",
      openRateSuffix: "% open",
      noEmails: "no emails",
      converted: "Converted",
      emailsSentSuffix: "sent",
      copyEmailTitle: "Copy email",
      editLeadTitle: "Edit lead",
      deleteLeadTitle: "Delete lead",
      statusNew: "New",
      statusPending: "Pending",
      statusCampaign: "Campaign",
      statusWebUser: "Web User",
      statusNewsletter: "Newsletter",
      statusInContact: "In Contact",
      statusSignedUp: "Signed Up",
      statusSubscribed: "Subscribed",
      statusUnsub: "Unsub",
      statusBounced: "Bounced",
      statusInvalid: "Invalid",
    },
  },
  stats: {
    title: "Lead Statistics",
    description:
      "Comprehensive leads statistics and analytics with historical data",
    category: "Lead Management",
    tags: {
      leads: "Leads",
      statistics: "Statistics",
      analytics: "Analytics",
    },
    container: {
      title: "Statistics Filters",
      description: "Configure your lead statistics filters and view options",
    },
    refresh: "Refresh",
    sections: {
      timeFilters: "Time Period & Date Range",
      comparison: "Comparison Settings",
      leadFilters: "Lead Filters",
      engagement: "Engagement Filters",
      conversion: "Conversion Filters",
      dataCompleteness: "Data Completeness",
      additional: "Additional Filters",
      searchSort: "Search & Sorting",
    },
    timePeriod: {
      label: "Time Period",
      description: "Select the time period for aggregating statistics",
      hour: "Hour",
      day: "Day",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year",
    },
    dateRangePreset: {
      label: "Date Range Preset",
      description: "Choose a predefined date range",
    },
    dateRange: {
      today: "Today",
      yesterday: "Yesterday",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      thisWeek: "This Week",
      lastWeek: "Last Week",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      thisQuarter: "This Quarter",
      lastQuarter: "Last Quarter",
      thisYear: "This Year",
      lastYear: "Last Year",
      custom: "Custom Range",
    },
    dateFrom: {
      label: "Start Date",
      description: "Beginning date for statistics",
    },
    dateTo: {
      label: "End Date",
      description: "Ending date for statistics",
    },
    chartType: {
      label: "Chart Type",
      description: "Select the type of chart for data visualization",
      line: "Line Chart",
      bar: "Bar Chart",
      area: "Area Chart",
      pie: "Pie Chart",
      donut: "Donut Chart",
    },
    includeComparison: {
      label: "Include Comparison",
      description: "Compare with a previous period",
    },
    comparisonPeriod: {
      label: "Comparison Period",
      description: "Select the period to compare against",
    },
    status: {
      label: "Lead Status",
      description: "Filter by lead status",
    },
    source: {
      label: "Lead Source",
      description: "Filter by lead source",
    },
    country: {
      label: "Country",
      description: "Filter by country",
      all: "All Countries",
      de: "Germany",
      pl: "Poland",
      global: "Global",
    },
    language: {
      label: "Language",
      description: "Filter by language preference",
      all: "All Languages",
      en: "English",
      de: "German",
      pl: "Polish",
    },
    campaignStage: {
      label: "Campaign Stage",
      description: "Filter by email campaign stage",
    },
    hasEngagement: {
      label: "Has Engagement",
      description: "Filter leads with any email engagement",
    },
    minEmailsOpened: {
      label: "Minimum Emails Opened",
      description: "Minimum number of emails opened",
    },
    minEmailsClicked: {
      label: "Minimum Emails Clicked",
      description: "Minimum number of emails clicked",
    },
    isConverted: {
      label: "Is Converted",
      description: "Filter converted leads",
    },
    hasSignedUp: {
      label: "Has Signed Up",
      description: "Filter leads that have signed up",
    },
    hasConfirmedSubscription: {
      label: "Has Confirmed Subscription",
      description: "Filter leads with confirmed subscription",
    },
    hasBusinessName: {
      label: "Has Business Name",
      description: "Filter leads with business name",
    },
    hasContactName: {
      label: "Has Contact Name",
      description: "Filter leads with contact name",
    },
    hasPhone: {
      label: "Has Phone",
      description: "Filter leads with phone number",
    },
    hasWebsite: {
      label: "Has Website",
      description: "Filter leads with website",
    },
    hasNotes: {
      label: "Has Notes",
      description: "Filter leads with notes",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort results by",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Ascending or descending order",
    },
    limit: {
      label: "Result Limit",
      description: "Maximum number of results",
    },
    hasUserId: {
      label: "Has User ID",
      description: "Filter leads with associated user ID",
    },
    emailVerified: {
      label: "Email Verified",
      description: "Filter by email verification status",
    },
    journeyVariant: {
      label: "Journey Variant",
      description: "Filter by email journey variant",
    },
    minEmailsSent: {
      label: "Minimum Emails Sent",
      description: "Minimum number of emails sent to the lead",
    },
    createdAfter: {
      label: "Created After",
      description: "Filter leads created after this date",
    },
    createdBefore: {
      label: "Created Before",
      description: "Filter leads created before this date",
    },
    updatedAfter: {
      label: "Updated After",
      description: "Filter leads updated after this date",
    },
    updatedBefore: {
      label: "Updated Before",
      description: "Filter leads updated before this date",
    },
    search: {
      label: "Search",
      description: "Search leads by email, name, or business name",
      placeholder: "Search leads...",
    },
    engagementLevel: {
      high: "High Engagement",
      medium: "Medium Engagement",
      low: "Low Engagement",
      none: "No Engagement",
    },
    response: {
      overview: "Overview",
      emailPerformance: "Email Performance",
      conversionRates: "Conversion Rates",
      activityTimeline: "Activity Timeline",
      campaignDistribution: "Campaign Distribution",
      geographicDistribution: "Geographic & Source Distribution",
      dataQuality: "Data Quality",
      performanceMetrics: "Performance Metrics",
      engagementLevels: "Engagement Levels",
      conversionFunnel: "Conversion Funnel",
      totalLeads: "Total Leads",
      newLeads: "New Leads",
      activeLeads: "Active Leads",
      inactiveLeads: "Inactive Leads",
      leadsByStatus: "Leads by Status",
      leadsBySource: "Leads by Source",
      leadsByCountry: "Leads by Country",
      leadsByLanguage: "Leads by Language",
      websiteUserLeads: "Website Users",
      newsletterSubscriberLeads: "Newsletter Subscribers",
      convertedLeads: "Converted Leads",
      consultationBookedLeads: "Consultation Booked",
      signedUpLeads: "Signed Up Leads",
      subscriptionConfirmedLeads: "Subscription Confirmed",
      unsubscribedLeads: "Unsubscribed Leads",
      bounces: "Bounced",
      qualifiedLeads: "Qualified Leads",
      nonQualifiedLeads: "Non-Qualified Leads",
      nurturingLeads: "Nurturing Leads",
      engagedLeads: "Engaged Leads",
      leadsWithEmailEngagement: "With Email Engagement",
      leadsWithoutEmailEngagement: "Without Email Engagement",
      averageEmailEngagementScore: "Avg Email Engagement",
      totalEmailEngagements: "Total Email Engagements",
      signupRate: "Signup Rate",
      subscriptionConfirmationRate: "Subscription Confirmation Rate",
      dataCompletenessRate: "Data Completeness",
      leadsWithBusinessName: "With Business Name",
      leadsWithContactName: "With Contact Name",
      leadsWithPhone: "With Phone",
      leadsWithWebsite: "With Website",
      leadsWithNotes: "With Notes",
      averageBusinessDataCompleteness: "Avg Business Data Completeness",
      leadsByCampaignStage: "Leads by Campaign Stage",
      leadsInActiveCampaigns: "In Active Campaigns",
      leadsNotInCampaigns: "Not in Campaigns",
      recentLeads: "Recent Leads",
      topLeadsByEngagement: "Top Leads by Engagement",
      mostActiveLeads: "Most Active Leads",
      recentConversions: "Recent Conversions",
      recentSignups: "Recent Signups",
      timeSeriesData: "Time Series Data",
      comparisonData: "Comparison Data",
      averageTimeToConversion: "Avg Time to Conversion",
      averageTimeToConsultation: "Avg Time to Consultation",
      averageTimeToSignup: "Avg Time to Signup",
      topPerformingCampaigns: "Top Performing Campaigns",
      topPerformingSources: "Top Performing Sources",
      topPerformingCountries: "Top Performing Countries",
      conversionRate: "Conversion Rate",
      consultationBookingRate: "Consultation Booking Rate",
      averageOpenRate: "Average Open Rate",
      averageClickRate: "Average Click Rate",
      campaignRunningLeads: "In Running Campaigns",
      bouncedLeads: "Bounced Leads",
      invalidLeads: "Invalid Leads",
      totalEmailsSent: "Total Emails Sent",
      totalEmailsOpened: "Total Emails Opened",
      totalEmailsClicked: "Total Emails Clicked",
      averageEmailsPerLead: "Average Emails Per Lead",
      leadVelocity: "Lead Velocity",
      leadsCreatedToday: "Leads Created Today",
      leadsCreatedThisWeek: "Leads Created This Week",
      leadsCreatedThisMonth: "Leads Created This Month",
      leadsUpdatedToday: "Leads Updated Today",
      leadsUpdatedThisWeek: "Leads Updated This Week",
      leadsUpdatedThisMonth: "Leads Updated This Month",
      leadsByJourneyVariant: "Leads by Journey Variant",
      historicalData: "Historical Data",
      groupedStats: "Grouped Statistics",
      recentActivity: "Recent Activity",
      metadata: "Report Information",
      generatedAt: "Generated At",
      dataRange: "Data Range",
      data: "Statistics Data",
      campaignName: "Campaign",
      leadsGenerated: "Leads",
      openRate: "Open Rate",
      clickRate: "Click Rate",
      source: "Source",
      qualityScore: "Quality Score",
      activityType: "Activity",
      email: "Email",
      businessName: "Business",
      timestamp: "Time",
      status: "Status",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "Authentication required to view leads statistics",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid statistics request parameters",
      },
      server: {
        title: "Server Error",
        description:
          "Internal server error occurred while retrieving leads statistics",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while fetching statistics",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while fetching statistics",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for leads statistics",
      },
      notFound: {
        title: "No Data",
        description: "No statistical data found for the specified criteria",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred while generating statistics",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the statistics filters",
      },
    },
    success: {
      title: "Statistics Generated",
      description: "Lead statistics retrieved successfully",
    },
    widget: {
      title: "Leads Statistics",
      refresh: "Refresh",
      viewAllLeads: "View All Leads",
      searchLeads: "Search Leads",
      export: "Export",
      import: "Import",
      batchUpdate: "Batch Update",
      totalLeads: "Total Leads",
      activeLeads: "Active Leads",
      converted: "Converted",
      conversionRate: "Conversion Rate",
      openRate: "Open Rate",
      clickRate: "Click Rate",
      unsubscribeRate: "Unsubscribe Rate",
      newThisMonth: "New (30d)",
      newLeadsTimeline: "New Leads Timeline",
      today: "Today",
      thisWeek: "This Week",
      thisMonth: "This Month",
      conversionFunnel: "Conversion Funnel",
      funnelTotalLeads: "Total Leads",
      funnelCampaignRunning: "Campaign Running",
      funnelSignedUp: "Signed Up",
      funnelSubscriptionConfirmed: "Subscription Confirmed",
      byStatus: "By Status",
      clickToFilter: "(click to filter)",
      bySource: "By Source",
      byCountry: "By Country",
      byCampaignStage: "By Campaign Stage",
      topPerformingCampaigns: "Top Performing Campaigns",
      topSources: "Top Sources",
      viewAll: "View all",
      recentActivity: "Recent Activity",
      filters: "Filters",
      applyFilters: "Apply Filters",
      openRateSuffix: "% open",
      conversionRateSuffix: "% cvr",
      emDash: "—",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Ascending",
        desc: "Descending",
      },
      leadSortField: {
        email: "Email",
        businessName: "Business Name",
        createdAt: "Created Date",
        updatedAt: "Updated Date",
        lastEngagementAt: "Last Engagement",
      },
      leadStatusFilter: {
        all: "All",
        new: "New",
        pending: "Pending",
        campaignRunning: "Campaign Running",
        websiteUser: "Website User",
        newsletterSubscriber: "Newsletter Subscriber",
        inContact: "In Contact",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Subscription Confirmed",
        unsubscribed: "Unsubscribed",
        bounced: "Bounced",
        invalid: "Invalid",
      },
      emailCampaignStageFilter: {
        all: "All",
        notStarted: "Not Started",
        initial: "Initial Contact",
        followup1: "Follow-up 1",
        followup2: "Follow-up 2",
        followup3: "Follow-up 3",
        nurture: "Nurture",
        reactivation: "Reactivation",
      },
      leadSourceFilter: {
        all: "All",
        website: "Website",
        socialMedia: "Social Media",
        emailCampaign: "Email Campaign",
        referral: "Referral",
        csvImport: "CSV Import",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Lead Tracking",
      tags: {
        tracking: "Tracking",
        engagement: "Engagement",
      },
      post: {
        title: "Record Lead Engagement",
        description: "Record a new engagement event for a lead",
        form: {
          title: "Lead Engagement Form",
          description: "Record lead engagement details",
        },
        leadId: {
          label: "Lead ID",
          description: "Unique identifier for the lead",
          placeholder: "Enter lead ID",
          helpText: "UUID of the lead to track engagement for",
        },
        engagementType: {
          label: "Engagement Type",
          description: "Type of engagement event",
          placeholder: "Select engagement type",
          helpText: "The type of interaction or engagement",
        },
        campaignId: {
          label: "Campaign ID",
          description: "Associated campaign identifier",
          placeholder: "Enter campaign ID",
          helpText: "Optional campaign this engagement is part of",
        },
        metadata: {
          label: "Metadata",
          description: "Additional engagement metadata",
          placeholder: "Enter metadata as JSON",
          helpText: "Custom data about this engagement",
        },
        userId: {
          label: "User ID",
          description: "Associated user identifier",
          placeholder: "Enter user ID",
          helpText: "Optional user ID if lead is associated with a user",
        },
        response: {
          id: "Engagement ID",
          leadId: "Lead ID",
          engagementType: "Engagement Type",
          campaignId: "Campaign ID",
          metadata: "Metadata",
          timestamp: "Timestamp",
          ipAddress: "IP Address",
          userAgent: "User Agent",
          createdAt: "Created At",
          leadCreated: "Lead Created",
          relationshipEstablished: "Relationship Established",
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
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        success: {
          title: "Engagement Recorded",
          description: "Lead engagement recorded successfully",
        },
      },
      get: {
        title: "Track Lead Click",
        description: "Track lead click and redirect to target URL",
        form: {
          title: "Click Tracking Parameters",
          description: "Parameters for click tracking and redirect",
        },
        id: {
          label: "Lead ID",
          description: "Unique identifier for the lead",
          placeholder: "Enter lead ID",
          helpText: "UUID of the lead to track click for",
        },
        stage: {
          label: "Campaign Stage",
          description: "Email campaign stage",
          placeholder: "Select campaign stage",
          helpText: "Optional campaign stage this click is part of",
        },
        source: {
          label: "Lead Source",
          description: "Source of the lead",
          placeholder: "Select lead source",
          helpText: "Source where the lead originated from",
        },
        url: {
          label: "Target URL",
          description: "URL to redirect to after tracking",
          placeholder: "Enter target URL",
          helpText: "The destination URL for redirection",
        },
        ref: {
          label: "Reference ID",
          description: "Reference identifier for tracking",
          placeholder: "Enter reference ID",
          helpText: "Optional reference ID for additional tracking context",
        },
        response: {
          success: "Success",
          redirectUrl: "Redirect URL",
          leadId: "Lead ID",
          campaignId: "Campaign ID",
          engagementRecorded: "Engagement Recorded",
          leadStatusUpdated: "Lead Status Updated",
          isLoggedIn: "Is Logged In",
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
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        success: {
          title: "Click Tracked",
          description: "Lead click tracked successfully",
        },
      },
      widget: {
        post: {
          headerTitle: "Record Engagement",
          viewStatsTitle: "View Lead Statistics",
          statsButton: "Stats",
          loading: "Recording engagement\u2026",
          successTitle: "Engagement Recorded",
          successSubtitle: "successfully tracked",
          event: "Event",
          labels: {
            engagementId: "Engagement ID",
            type: "Type",
            leadId: "Lead ID",
            campaignId: "Campaign ID",
            ipAddress: "IP Address",
            recordedAt: "Recorded At",
            leadCreated: "Lead Created",
            leadCreatedYes: "Yes (new lead)",
            leadCreatedNo: "No (existing)",
            relationshipEst: "Relationship Est.",
            relationshipYes: "Yes",
            relationshipNo: "No",
            metadata: "Metadata",
          },
          nextSteps: "Next steps:",
          viewLeadButton: "View Lead",
          leadStatsButton: "Lead Stats",
          emptyTitle: "Track an Engagement Event",
          emptyDescription:
            "Fill in the form below and submit to record a new engagement event for a lead",
          viewLeadStatsButton: "View Lead Stats",
        },
        get: {
          headerTitle: "Click Tracking",
          viewStatsTitle: "View Lead Statistics",
          statsButton: "Stats",
          loading: "Processing click tracking\u2026",
          successTitle: "Click Tracked",
          successSubtitle: "Engagement recorded and redirect URL ready",
          failTitle: "Tracking Failed",
          failSubtitle: "Could not record the click event",
          labels: {
            engagementLabel: "Engagement",
            recorded: "Recorded",
            notRecorded: "Not recorded",
            leadStatusLabel: "Lead Status",
            updated: "Updated",
            unchanged: "Unchanged",
            userLabel: "User",
            loggedIn: "Logged in",
            anonymous: "Anonymous",
            leadId: "Lead ID",
            campaignId: "Campaign ID",
            redirectUrl: "Redirect URL",
          },
          nextSteps: "Next steps:",
          openUrlButton: "Open URL",
          viewLeadButton: "View Lead",
          leadStatsButton: "Lead Stats",
          emptyTitle: "Track a Click Event",
          emptyDescription:
            "Enter the tracking parameters below to record a click and retrieve the redirect URL",
          viewLeadStatsButton: "View Lead Stats",
        },
      },
      enums: {
        engagementLevel: {
          high: "High",
          medium: "Medium",
          low: "Low",
          none: "None",
        },
      },
      error: {
        default: "An error occurred while processing the engagement",
      },
    },
    pixel: {
      category: "API Endpoint",
      tags: {
        pixel: "Pixel",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "Existing lead tracking found",
    },
    component: {
      initialized: "Lead tracking component initialized",
    },
    error: "Error in lead tracking",
    errors: {
      default: "An error occurred",
      missingId: "Missing tracking ID",
      invalidUrl: "Invalid URL",
    },
    data: {
      captured: "Lead tracking data captured",
      capture: {
        error: "Error capturing lead tracking data",
      },
      retrieve: {
        error: "Error retrieving lead tracking data",
      },
      loaded: {
        signup: "Lead tracking data loaded for signup",
      },
      load: {
        error: {
          noncritical: "Error loading lead tracking data (non-critical)",
        },
      },
      stored: "Lead tracking data stored",
      store: {
        error: "Error storing lead tracking data",
      },
      cleared: "Lead tracking data cleared",
      clear: {
        error: "Error clearing lead tracking data",
      },
      format: {
        error: "Error formatting tracking data",
      },
    },
    params: {
      validate: {
        error: "Error validating tracking params",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "Email Opened",
      emailClick: "Email Clicked",
      websiteVisit: "Website Visit",
      formSubmit: "Form Submission",
      leadAttribution: "Lead Attribution",
    },
    leadStatus: {
      new: "New",
      pending: "Pending",
      campaignRunning: "Campaign Running",
      websiteUser: "Website User",
      newsletterSubscriber: "Newsletter Subscriber",
      inContact: "In Contact",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
    emailCampaignStage: {
      notStarted: "Not Started",
      initial: "Initial Contact",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
    emailStatus: {
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      opened: "Opened",
      clicked: "Clicked",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Unsubscribed",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Uncensored Convert",
      sideHustle: "Side Hustle",
      quietRecommendation: "Quiet Recommendation",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      newsletterMay2026: "Newsletter May 2026",
    },
    emailJourneyVariantFilter: {
      all: "All",
      uncensoredConvert: "Uncensored Convert",
      sideHustle: "Side Hustle",
      quietRecommendation: "Quiet Recommendation",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      newsletterMay2026: "Newsletter May 2026",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    leadSortField: {
      email: "Email",
      businessName: "Business Name",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
      lastEngagementAt: "Last Engagement",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Lead Created",
      leadUpdated: "Lead Updated",
      emailSent: "Email Sent",
      emailOpened: "Email Opened",
      emailClicked: "Email Clicked",
      leadConverted: "Lead Converted",
      leadUnsubscribed: "Lead Unsubscribed",
    },
    userAssociation: {
      withUser: "With User",
      withLead: "With Lead",
      standalone: "Standalone",
      withBoth: "With Both",
    },
    deviceType: {
      desktop: "Desktop",
      mobile: "Mobile",
      tablet: "Tablet",
      bot: "Bot",
      unknown: "Unknown",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
    },
    leadStatusFilter: {
      all: "All",
      new: "New",
      pending: "Pending",
      campaignRunning: "Campaign Running",
      websiteUser: "Website User",
      newsletterSubscriber: "Newsletter Subscriber",
      inContact: "In Contact",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
    emailCampaignStageFilter: {
      all: "All",
      notStarted: "Not Started",
      initial: "Initial Contact",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
    leadSourceFilter: {
      all: "All",
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
    },
    batchOperationScope: {
      currentPage: "Current Page",
      allPages: "All Pages",
    },
    country: {
      de: "Germany",
      pl: "Poland",
      global: "Global",
    },
    language: {
      de: "German",
      pl: "Polish",
      en: "English",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Other",
    },
  },
  error: {
    general: {
      internal_server_error: "Internal server error",
      not_found: "Not found",
      unauthorized: "Unauthorized",
      forbidden: "Forbidden",
      bad_request: "Bad request",
      validation_error: "Validation error",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Invalid batch update request",
          },
          server: {
            title: "Server error updating leads in batch",
          },
          default: "Error updating leads in batch",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Server error retrieving leads",
          },
          not_found: {
            title: "Leads not found",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Lead with this email already exists",
          },
          server: {
            title: "Server error creating lead",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead not found",
          },
          server: {
            title: "Server error updating lead",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Successfully unsubscribed",
        },
        error: {
          validation: {
            title: "Invalid unsubscribe request",
          },
          server: {
            title: "Server error processing unsubscribe",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Invalid engagement data",
          },
          server: {
            title: "Server error recording engagement",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Server error exporting leads",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Server error processing campaign",
          },
        },
      },
    },
  },
};
