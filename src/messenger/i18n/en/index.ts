export const translations = {
  category: "Email",
  countries: {
    global: "Global",
    de: "Germany",
    pl: "Poland",
    us: "United States",
  },
  languages: {
    en: "English",
    de: "German",
    pl: "Polish",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "None",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Active",
      inactive: "Inactive",
      error: "Error",
      testing: "Testing",
    },
    smtpHealthStatus: {
      healthy: "Healthy",
      degraded: "Degraded",
      unhealthy: "Unhealthy",
      unknown: "Unknown",
    },
    smtpSortField: {
      name: "Name",
      status: "Status",
      createdAt: "Created At",
      updatedAt: "Updated At",
      priority: "Priority",
      totalEmailsSent: "Total Emails Sent",
      lastUsedAt: "Last Used At",
    },
    smtpCampaignType: {
      leadCampaign: "Lead Campaign",
      newsletter: "Newsletter",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      transactional: "Transactional",
      notification: "Notification",
      system: "System",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Weighted",
      priority: "Priority",
      leastUsed: "Least Used",
    },
    loadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Weighted",
      priority: "Priority",
      leastUsed: "Least Used",
    },
    smtpTestResult: {
      success: "Success",
      authFailed: "Authentication Failed",
      connectionFailed: "Connection Failed",
      timeout: "Timeout",
      unknownError: "Unknown Error",
    },
    testResult: {
      success: "Success",
      authFailed: "Authentication Failed",
      connectionFailed: "Connection Failed",
      timeout: "Timeout",
      unknownError: "Unknown Error",
    },
    smtpStatusFilter: {
      any: "Any",
    },
    smtpHealthStatusFilter: {
      any: "Any",
    },
    smtpCampaignTypeFilter: {
      any: "Any",
    },
    smtpSelectionRuleSortField: {
      name: "Name",
      priority: "Priority",
      campaignType: "Campaign Type",
      journeyVariant: "Journey Variant",
      campaignStage: "Campaign Stage",
      country: "Country",
      language: "Language",
      createdAt: "Created At",
      updatedAt: "Updated At",
      emailsSent: "Emails Sent",
      successRate: "Success Rate",
      lastUsedAt: "Last Used At",
    },
    selectionRuleSortField: {
      name: "Name",
      priority: "Priority",
      campaignType: "Campaign Type",
      journeyVariant: "Journey Variant",
      campaignStage: "Campaign Stage",
      country: "Country",
      language: "Language",
      createdAt: "Created At",
      updatedAt: "Updated At",
      emailsSent: "Emails Sent",
      successRate: "Success Rate",
      lastUsedAt: "Last Used At",
    },
    smtpSelectionRuleStatusFilter: {
      any: "Any",
      active: "Active",
      inactive: "Inactive",
      default: "Default",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      any: "Any",
      active: "Active",
      inactive: "Inactive",
      default: "Default",
      failover: "Failover",
    },
    // Email Messages Enums
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
    emailType: {
      transactional: "Transactional",
      marketing: "Marketing",
      notification: "Notification",
      system: "System",
      leadCampaign: "Lead Campaign",
      userCommunication: "User Communication",
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
    emailSortField: {
      subject: "Subject",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      type: "Type",
      status: "Status",
      sentAt: "Sent At",
      createdAt: "Created At",
    },
    emailStatusFilter: {
      any: "Any",
    },
    emailTypeFilter: {
      any: "Any",
    },
    emailRetryRange: {
      noRetries: "No Retries",
      oneToTwo: "1-2 Retries",
      threeToFive: "3-5 Retries",
      sixPlus: "6+ Retries",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Pending",
      syncing: "Syncing",
      synced: "Synced",
      error: "Error",
    },
    imapOverallSyncStatus: {
      idle: "Idle",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
    },
    imapSortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Inbox",
      sent: "Sent",
      drafts: "Drafts",
      trash: "Trash",
      junk: "Junk",
      archive: "Archive",
    },
    imapFolderSortField: {
      name: "Name",
      displayName: "Display Name",
      messageCount: "Message Count",
      unseenCount: "Unseen Count",
      createdAt: "Created At",
    },
    imapAccountSortField: {
      name: "Name",
      email: "Email",
      host: "Host",
      enabled: "Enabled",
      lastSyncAt: "Last Sync At",
      createdAt: "Created At",
    },
    imapConnectionStatus: {
      disconnected: "Disconnected",
      connecting: "Connecting",
      connected: "Connected",
      error: "Error",
      timeout: "Timeout",
    },
    imapSyncStatusFilter: {
      all: "All",
    },
    imapAccountStatusFilter: {
      all: "All",
      enabled: "Enabled",
      disabled: "Disabled",
    },
    imapAccountFilter: {
      all: "All",
    },
    imapMessageSortField: {
      subject: "Subject",
      senderName: "Sender Name",
      senderEmail: "Sender Email",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      isRead: "Is Read",
      isFlagged: "Is Flagged",
      messageSize: "Message Size",
      sentAt: "Sent At",
      createdAt: "Created At",
    },
    imapMessageStatusFilter: {
      all: "All",
      read: "Read",
      unread: "Unread",
      flagged: "Flagged",
      unflagged: "Unflagged",
      draft: "Draft",
      deleted: "Deleted",
      hasAttachments: "Has Attachments",
      noAttachments: "No Attachments",
    },
    imapHealthStatus: {
      healthy: "Healthy",
      warning: "Warning",
      error: "Error",
      maintenance: "Maintenance",
    },
    imapPerformanceStatus: {
      good: "Good",
      warning: "Warning",
      error: "Error",
    },
    bulkMessageAction: {
      markRead: "Mark as Read",
      markUnread: "Mark as Unread",
      flag: "Flag",
      unflag: "Unflag",
      delete: "Delete",
    },
    imapLoggingLevel: {
      error: "Error",
      warn: "Warning",
      info: "Info",
      debug: "Debug",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
    emailServiceStatus: {
      idle: "Idle",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      retrying: "Retrying",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      failed: "Failed",
      rejected: "Rejected",
      undelivered: "Undelivered",
    },
    smsTemplateType: {
      notification: "Notification",
      verification: "Verification",
      marketing: "Marketing",
      alert: "Alert",
      reminder: "Reminder",
    },
  },
  errors: {
    no_email: "No email address provided",
    email_generation_failed: "Failed to generate email",
  },
  email: {
    errors: {
      send: {
        title: "Email Send Failed",
      },
    },
  },
  smsService: {
    title: "SMS Service",
    description: "Send SMS messages through various providers",
    category: "SMS Service",
    tag: "SMS Service",
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to send SMS messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to SMS service is forbidden",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid SMS request data",
      },
      internal: {
        title: "Internal Error",
        description: "An internal server error occurred",
      },
      conflict: {
        title: "Conflict",
        description: "SMS request conflicts with existing data",
      },
      notFound: {
        title: "Not Found",
        description: "SMS resource not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while sending SMS",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      invalid_phone: {
        title: "Invalid Phone Number",
      },
      send: {
        title: "SMS Send Failed",
      },
    },
    send: {
      title: "Send SMS",
      description: "Send SMS message to recipient",
      container: {
        title: "SMS Configuration",
        description: "Configure SMS sending parameters",
      },
      to: {
        label: "Phone Number",
        description: "Recipient phone number",
        placeholder: "+1234567890",
      },
      message: {
        label: "Message",
        description: "SMS message content",
        placeholder: "Enter your message here...",
      },
      campaignType: {
        label: "Campaign Type",
        description: "Select the campaign type for this SMS",
        placeholder: "Select campaign type",
      },
      leadId: {
        label: "Lead ID",
        description: "Associated lead identifier",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Template Name",
        description: "SMS template to use",
        placeholder: "Select template",
      },
      response: {
        result: {
          title: "SMS Result",
          description: "Result of the SMS sending operation",
          success: "Success",
          messageId: "Message ID",
          sentAt: "Sent At",
          provider: "Provider",
          cost: "Cost",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid SMS request data",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to send SMS messages",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access to SMS service is forbidden",
        },
        conflict: {
          title: "Conflict",
          description: "SMS request conflicts with existing data",
        },
        notFound: {
          title: "Not Found",
          description: "SMS resource not found",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while sending SMS",
        },
        server: {
          title: "Server Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "SMS Sent Successfully",
        description: "Your SMS has been sent successfully",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Invalid Phone Number",
      },
      send: {
        title: "SMS Send Failed",
      },
    },
  },
  emailService: {
    tag: "SMTP Client",
    category: "Email Services",
    components: {
      email: {
        tagline: "Free speech AI platform",
        footer: {
          needHelp: "Need help?",
          helpText: "Need help? Contact us at",
          unsubscribeText: "Don't want to receive these emails?",
          unsubscribeLink: "Unsubscribe",
          copyright: "© {{currentYear}} {{appName}}. All rights reserved.",
          visitWebsite: "Visit Website",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. All rights reserved.",
          feedbackHook: "Got something to say? Reply - we actually read it.",
          feedbackBody:
            "Report a bug, request a feature, or tell us what's missing. Useful feedback earns you {{credits}} credits — a full month on us.",
          feedbackLink: "Reply with feedback →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Components",
        description: "Components endpoint",
        form: {
          title: "Components Configuration",
          description: "Configure components parameters",
        },
        response: {
          title: "Response",
          description: "Components response data",
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
    emailSending: {
      email: {
        defaultSenderName: "System",
        errors: {
          sending_failed: "Failed to send email to {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Failed to render email template",
          send_failed: "Failed to send email",
          email_failed_subject: "Email Failed",
          unknown_recipient: "Unknown recipient",
          unknown_sender: "System",
          email_render_exception: "Email rendering exception occurred",
          batch_send_failed: "Batch email send failed",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for SMTP sending operations",
        },
        server: {
          title: "Server Error",
          description: "An error occurred on the SMTP server",
        },
        rejected: {
          title: "Email Rejected",
          defaultReason: "Email rejected by server",
        },
        no_recipients: {
          title: "No Recipients Accepted",
          defaultReason: "No recipients accepted",
        },
        rate_limit: {
          title: "Rate Limit Exceeded",
        },
        capacity: {
          title: "Capacity Error",
        },
        no_account: {
          title: "No SMTP Account Available",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Email Metadata Server Error",
          description: "Failed to store email metadata",
        },
      },
    },
    enums: {
      status: {
        active: "Active",
        inactive: "Inactive",
        error: "Error",
        testing: "Testing",
      },
      securityType: {
        none: "None",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "All Statuses",
      },
      healthStatus: {
        healthy: "Healthy",
        degraded: "Degraded",
        unhealthy: "Unhealthy",
        unknown: "Unknown",
      },
      healthStatusFilter: {
        all: "All Health Statuses",
      },
      sortField: {
        name: "Name",
        status: "Status",
        createdAt: "Created At",
        updatedAt: "Updated At",
        priority: "Priority",
        totalEmailsSent: "Total Emails Sent",
        lastUsedAt: "Last Used At",
      },
      campaignType: {
        leadCampaign: "Lead Campaign",
        newsletter: "Newsletter",
        signupNurture: "Signup Nurture",
        retention: "Retention",
        winback: "Winback",
        transactional: "Transactional",
        notification: "Notification",
        system: "System",
      },
      campaignTypeFilter: {
        all: "All Campaign Types",
      },
      selectionRuleSortField: {
        name: "Name",
        priority: "Priority",
        campaignType: "Campaign Type",
        journeyVariant: "Journey Variant",
        campaignStage: "Campaign Stage",
        country: "Country",
        language: "Language",
        createdAt: "Created At",
        updatedAt: "Updated At",
        emailsSent: "Emails Sent",
        successRate: "Success Rate",
        lastUsedAt: "Last Used At",
      },
      selectionRuleStatusFilter: {
        all: "All",
        active: "Active",
        inactive: "Inactive",
        default: "Default",
        failover: "Failover",
      },
      loadBalancingStrategy: {
        roundRobin: "Round Robin",
        weighted: "Weighted",
        priority: "Priority",
        leastUsed: "Least Used",
      },
      testResult: {
        success: "Success",
        authFailed: "Authentication Failed",
        connectionFailed: "Connection Failed",
        timeout: "Timeout",
        unknownError: "Unknown Error",
      },
    },
  },
  imapClient: {
    category: "IMAP Client",
    tag: "IMAP Client",
    tags: {
      health: "Health",
      monitoring: "Monitoring",
      sync: "Synchronization",
      accounts: "Accounts",
      folders: "Folders",
      messages: "Messages",
      config: "Configuration",
    },
    messages: {
      tag: "Messages",
      id: {
        widget: {
          markRead: "Mark as Read",
          markUnread: "Mark as Unread",
          flag: "Flag",
          unflag: "Unflag",
        },
      },
      errors: {
        server: { title: "Server Error" },
        notFound: { title: "Message Not Found" },
        accountNotFound: { title: "Account Not Found" },
        syncFailed: { title: "Sync Failed" },
        syncSuccess: { message: "Messages synced successfully" },
        list: {
          get: {
            errors: { server: { title: "Server error listing messages" } },
          },
        },
      },
    },
    sync: {
      category: "IMAP Client",

      title: "IMAP Sync",
      description: "IMAP synchronization service",
      container: {
        title: "IMAP Sync Configuration",
        description: "Configure IMAP synchronization parameters",
      },
      accountIds: {
        label: "Account IDs",
        description: "IMAP account IDs to sync",
        placeholder: "Enter account IDs separated by commas",
      },
      force: {
        label: "Force Sync",
        description: "Force synchronization even if recently synced",
      },
      dryRun: {
        label: "Dry Run",
        description: "Perform a test run without making changes",
      },
      maxMessages: {
        label: "Max Messages",
        description: "Maximum number of messages to sync per folder",
        placeholder: "Enter maximum number of messages",
      },
      post: {
        title: "Sync",
        description: "Sync endpoint",
        form: {
          title: "Sync Configuration",
          description: "Configure sync parameters",
        },
        response: {
          title: "Response",
          description: "Sync response data",
          result: {
            title: "Sync Results",
            description: "Detailed synchronization results",
            accountsProcessed: "Accounts Processed",
            foldersProcessed: "Folders Processed",
            messagesProcessed: "Messages Processed",
            messagesAdded: "Messages Added",
            messagesUpdated: "Messages Updated",
            messagesDeleted: "Messages Deleted",
            duration: "Duration",
          },
          errors: {
            error: {
              title: "Sync Error",
              description: "Error details",
              code: "Error Code",
              message: "Error Message",
            },
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
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
      widget: {
        title: "Full IMAP Sync",
        options: "Sync Options",
        noAccounts: "No IMAP accounts configured",
        result: "Sync Result",
        duration: "Duration",
        errors: "Errors",
        accountsProcessed: "Accounts Processed",
        foldersProcessed: "Folders Processed",
        messagesProcessed: "Messages Processed",
        messagesAdded: "Messages Added",
        messagesUpdated: "Messages Updated",
        messagesDeleted: "Messages Deleted",
        submit: "Start Sync",
        submitting: "Syncing...",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "Account already exists",
            },
            server: {
              title: "Server error creating account",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "Account not found",
            },
            server: {
              title: "Server error retrieving account",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "Account not found",
            },
            duplicate: {
              title: "Account with this email already exists",
            },
            server: {
              title: "Server error updating account",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "Account not found",
            },
            server: {
              title: "Server error deleting account",
            },
          },
          success: {
            title: "Account deleted successfully",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "Folder not found",
            },
            server: {
              title: "Server error retrieving folder",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title: "Account not found for folder sync",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "Message not found",
            },
            server: {
              title: "Server error retrieving message",
            },
          },
        },
      },
      connection: {
        failed: "Connection failed",
        timeout: {
          title: "Connection timeout",
        },
        test: {
          failed: "Connection test failed",
        },
        close: {
          failed: "Failed to close connection",
        },
        folders: {
          list: {
            failed: "Failed to list folders",
          },
        },
        messages: {
          list: {
            failed: "Failed to list messages",
          },
        },
      },
      sync: {
        failed: "Sync failed",
        account: {
          failed: "Account sync failed",
        },
        folder: {
          failed: "Folder sync failed",
        },
        message: {
          failed: "Message sync failed",
        },
        post: {
          error: {
            server: {
              title: "Server error during sync",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "Username is required",
          },
          port: {
            invalid: "Invalid port number",
          },
          host: {
            invalid: "Invalid host",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "Connection test successful",
          failed: "Connection test failed",
          timeout: "Connection test timeout",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "All accounts synced successfully",
            successWithErrors: "Accounts synced with errors",
          },
          account: {
            success: "Account synced successfully",
            successWithErrors: "Account synced with errors",
          },
          folders: {
            success: "Folders synced successfully",
            successWithErrors: "Folders synced with errors",
          },
          messages: {
            success: "Messages synced successfully",
            successWithErrors: "Messages synced with errors",
          },
        },
        errors: {
          default: "IMAP sync failed",
          account_failed: "Account sync failed",
          folder_sync_failed: "Folder sync failed",
          message_sync_error: "Message sync error",
          message_sync_failed: "Message sync failed",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "Error",
        warn: "Warning",
        info: "Info",
        debug: "Debug",
      },
      syncStatus: {
        pending: "Pending",
        syncing: "Syncing",
        synced: "Synced",
        error: "Error",
      },
      overallSyncStatus: {
        idle: "Idle",
        running: "Running",
        completed: "Completed",
        failed: "Failed",
        cancelled: "Cancelled",
      },
      sortOrder: {
        asc: "Ascending",
        desc: "Descending",
      },
      authMethod: {
        plain: "Plain",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "Plain",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "Inbox",
        sent: "Sent",
        drafts: "Drafts",
        trash: "Trash",
        junk: "Junk",
        archive: "Archive",
      },
      folderSortField: {
        name: "Name",
        displayName: "Display Name",
        messageCount: "Message Count",
        unseenCount: "Unseen Count",
        createdAt: "Created At",
      },
      accountSortField: {
        name: "Name",
        email: "Email",
        host: "Host",
        enabled: "Enabled",
        lastSyncAt: "Last Sync At",
        createdAt: "Created At",
      },
      connectionStatus: {
        disconnected: "Disconnected",
        connecting: "Connecting",
        connected: "Connected",
        error: "Error",
        timeout: "Timeout",
      },
      syncStatusFilter: {
        all: "All Sync Statuses",
      },
      accountStatusFilter: {
        all: "All Account Statuses",
        enabled: "Enabled",
        disabled: "Disabled",
      },
      accountFilter: {
        all: "All Accounts",
      },
      messageSortField: {
        subject: "Subject",
        senderName: "Sender Name",
        senderEmail: "Sender Email",
        recipientEmail: "Recipient Email",
        recipientName: "Recipient Name",
        isRead: "Read Status",
        isFlagged: "Flagged",
        messageSize: "Message Size",
        sentAt: "Sent At",
        createdAt: "Created At",
      },
      messageStatusFilter: {
        all: "All Messages",
        read: "Read",
        unread: "Unread",
        flagged: "Flagged",
        unflagged: "Unflagged",
        draft: "Draft",
        deleted: "Deleted",
        hasAttachments: "Has Attachments",
        noAttachments: "No Attachments",
      },
      healthStatus: {
        healthy: "Healthy",
        warning: "Warning",
        error: "Error",
        maintenance: "Maintenance",
      },
      performanceStatus: {
        good: "Good",
        warning: "Warning",
        error: "Error",
      },
    },
  },
  messages: {
    category: "Email Messages",
    tag: "Messages",
    tags: {
      stats: "Statistics",
      analytics: "Analytics",
    },
    id: {
      category: "Emails",
      tags: {
        emails: "Emails",
      },
      title: "Email Detail",
      description: "Retrieve a single email by its unique identifier",
      container: {
        title: "Email Details",
        description: "View detailed information about a specific email",
      },
      fields: {
        id: {
          label: "Email ID",
          description: "Unique identifier of the email to retrieve",
        },
      },
      response: {
        email: {
          title: "Email Details",
          description: "Complete information about the requested email",
          id: "Email ID",
          subject: "Subject",
          recipientEmail: "Recipient Email",
          recipientName: "Recipient Name",
          senderEmail: "Sender Email",
          senderName: "Sender Name",
          type: "Email Type",
          status: "Status",
          templateName: "Template Name",
          emailProvider: "Email Provider",
          externalId: "External ID",
          sentAt: "Sent At",
          deliveredAt: "Delivered At",
          openedAt: "Opened At",
          clickedAt: "Clicked At",
          retryCount: "Retry Count",
          error: "Error Message",
          userId: "User ID",
          leadId: "Lead ID",
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
      },
      get: {
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided email ID is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You must be authenticated to access email details",
          },
          not_found: {
            title: "Email Not Found",
            description: "No email found with the specified ID",
          },
          forbidden: {
            title: "Forbidden",
            description: "You do not have permission to view this email",
          },
          server: {
            title: "Server Error",
            description:
              "An internal server error occurred while retrieving the email",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "The provided email ID is invalid",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be authenticated to access email details",
        },
        notFound: {
          title: "Email Not Found",
          description: "No email found with the specified ID",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to view this email",
        },
        server: {
          title: "Server Error",
          description:
            "An internal server error occurred while retrieving the email",
        },
        conflict: {
          title: "Conflict Error",
          description: "A conflict occurred while processing the email request",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred while retrieving the email",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
      },
      success: {
        title: "Email Retrieved",
        description: "Email details retrieved successfully",
      },
      widget: {
        parties: "Parties",
        to: "To",
        from: "From",
        timestamps: "Timestamps",
        sentAt: "Sent At",
        deliveredAt: "Delivered At",
        openedAt: "Opened At",
        clickedAt: "Clicked At",
        technical: "Technical Details",
        template: "Template",
        provider: "Provider",
        externalId: "External ID",
        retryCount: "Retry Count",
        error: "Error",
        associations: "Associations",
        lead: "Lead",
        user: "User",
        notFound: "Email not found",
      },
      enums: {
        status: {
          pending: "Pending",
          sent: "Sent",
          delivered: "Delivered",
          opened: "Opened",
          clicked: "Clicked",
          bounced: "Bounced",
          failed: "Failed",
          unsubscribed: "Unsubscribed",
        },
        type: {
          transactional: "Transactional",
          marketing: "Marketing",
          notification: "Notification",
          system: "System",
          leadCampaign: "Lead Campaign",
          userCommunication: "User Communication",
        },
        provider: {
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
    },
    list: {
      category: "Emails",
      tags: {
        emails: "Emails",
      },
      title: "Email List",
      description:
        "Retrieve a paginated list of emails with filtering and pagination",
      container: {
        title: "Email List",
        description: "Configure email list parameters and view results",
      },
      filters: {
        title: "Filters",
        description: "Filter and search emails",
      },
      displayOptions: {
        title: "Display Options",
      },
      fields: {
        dateRange: {
          title: "Date Range",
        },
        page: {
          label: "Page",
          description: "Page number for pagination",
          placeholder: "Enter page number",
        },
        limit: {
          label: "Limit",
          description: "Number of items per page",
          placeholder: "Enter limit",
        },
        search: {
          label: "Search",
          description: "Search emails by subject, recipient, or sender",
          placeholder: "Search emails...",
        },
        status: {
          label: "Status",
          description: "Filter by email status",
          placeholder: "Select status",
        },
        channel: {
          label: "Channel",
          description: "Filter by message channel",
        },
        type: {
          label: "Type",
          description: "Filter by email type",
          placeholder: "Select type",
        },
        sortBy: {
          label: "Sort By",
          description: "Field to sort by",
          placeholder: "Select sort field",
        },
        sortOrder: {
          label: "Sort Order",
          description: "Sort order direction",
          placeholder: "Select sort order",
        },
        dateFrom: {
          label: "Date From",
          description: "Filter emails from this date",
          placeholder: "Select start date",
        },
        dateTo: {
          label: "Date To",
          description: "Filter emails until this date",
          placeholder: "Select end date",
        },
      },
      response: {
        emails: {
          title: "Emails",
          emptyState: {
            title: "No emails found",
            description: "No emails match your current filters",
          },
          item: {
            title: "Email",
            description: "Email details",
            id: "ID",
            subject: "Subject",
            recipientEmail: "Recipient Email",
            recipientName: "Recipient Name",
            senderEmail: "Sender Email",
            senderName: "Sender Name",
            type: "Type",
            status: "Status",
            templateName: "Template Name",
            emailProvider: "Email Provider",
            externalId: "External ID",
            sentAt: "Sent At",
            deliveredAt: "Delivered At",
            openedAt: "Opened At",
            clickedAt: "Clicked At",
            retryCount: "Retry Count",
            error: "Error",
            userId: "User ID",
            leadId: "Lead ID",
            createdAt: "Created At",
            updatedAt: "Updated At",
            emailCore: {
              title: "Core Information",
            },
            emailParties: {
              title: "Sender & Recipient",
            },
            emailMetadata: {
              title: "Metadata",
            },
            emailEngagement: {
              title: "Engagement Tracking",
            },
            technicalDetails: {
              title: "Technical Details",
            },
            associatedIds: {
              title: "Associated IDs",
            },
            timestamps: {
              title: "Timestamps",
            },
          },
        },
        pagination: {
          title: "Pagination",
          description: "Pagination information",
          page: "Current Page",
          limit: "Items Per Page",
          total: "Total Items",
          totalPages: "Total Pages",
        },
        filters: {
          title: "Applied Filters",
          description: "Currently applied filters",
          status: "Status Filter",
          type: "Type Filter",
          search: "Search Query",
          dateFrom: "Start Date",
          dateTo: "End Date",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "The provided parameters are invalid",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be authenticated to access this resource",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to access this resource",
        },
        notFound: {
          title: "Not Found",
          description: "The requested resource was not found",
        },
        server: {
          title: "Server Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "The request conflicts with the current state",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Emails retrieved successfully",
      },
      widget: {
        to: "To",
        retries: "Retries",
        opened: "Opened",
        clicked: "Clicked",
        stats: "Stats",
        graphs: "Graphs",
        refresh: "Refresh",
        searchPlaceholder: "Search emails...",
        clearSearch: "Clear",
        emptyState: "No emails found",
        emptyFiltered: "No emails match your filters",
        page: "Page",
        tabs: {
          all: "All",
          sent: "Sent",
          delivered: "Delivered",
          opened: "Opened",
          failed: "Failed",
          bounced: "Bounced",
        },
      },
      enums: {
        type: {
          transactional: "Transactional",
          marketing: "Marketing",
          notification: "Notification",
          system: "System",
          leadCampaign: "Lead Campaign",
          userCommunication: "User Communication",
        },
        typeFilter: {
          any: "All Types",
        },
        channel: {
          email: "Email",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
        },
        channelFilter: {
          any: "All Channels",
        },
        sortField: {
          subject: "Subject",
          recipientEmail: "Recipient Email",
          recipientName: "Recipient Name",
          type: "Type",
          status: "Status",
          sentAt: "Sent At",
          createdAt: "Created At",
        },
        sortOrder: {
          asc: "Ascending",
          desc: "Descending",
        },
      },
    },
    stats: {
      category: "Emails",
      tags: {
        stats: "Statistics",
        analytics: "Analytics",
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
      get: {
        title: "Email Statistics",
        description: "Retrieve comprehensive email statistics and metrics",
        form: {
          title: "Email Statistics Request",
          description: "Parameters for querying email statistics",
        },
        startDate: {
          label: "Start Date",
          description: "Start date for the statistics period",
        },
        endDate: {
          label: "End Date",
          description: "End date for the statistics period",
        },
        accountId: {
          label: "Account ID",
          description: "Filter statistics by specific account",
        },
        type: {
          label: "Email Type",
          description: "Filter by email type",
          options: {
            all: "All",
            sent: "Sent",
            received: "Received",
            draft: "Draft",
            trash: "Trash",
          },
        },
        groupBy: {
          label: "Group By",
          description: "How to group the statistics",
          options: {
            day: "By Day",
            week: "By Week",
            month: "By Month",
            account: "By Account",
            type: "By Type",
          },
        },
        includeDetails: {
          label: "Include Details",
          description: "Include detailed breakdown in results",
        },
        status: {
          label: "Email Status",
          description: "Filter by email status",
        },
        search: {
          label: "Search",
          description: "Search emails by subject or recipient",
        },
        timePeriod: {
          label: "Time Period",
          description: "Time period granularity for historical data",
          hour: "Hour",
          day: "Day",
          week: "Week",
          month: "Month",
          quarter: "Quarter",
          year: "Year",
        },
        dateRangePreset: {
          label: "Date Range Preset",
          description: "Predefined date range for filtering",
        },
        dateFrom: {
          label: "Start Date",
          description: "Filter emails from this date",
        },
        dateTo: {
          label: "End Date",
          description: "Filter emails up to this date",
        },
        chartType: {
          label: "Chart Type",
          description: "Visualization type for charts",
          line: "Line Chart",
          bar: "Bar Chart",
          area: "Area Chart",
          pie: "Pie Chart",
          donut: "Donut Chart",
        },
        includeComparison: {
          label: "Include Comparison",
          description: "Include comparison with previous period",
        },
        sortBy: {
          label: "Sort By",
          description: "Field to sort emails by",
        },
        sortOrder: {
          label: "Sort Order",
          description: "Order of sorting (ascending or descending)",
        },
        response: {
          title: "Email Statistics Response",
          description: "Comprehensive email statistics and metrics data",
          totalEmails: "Total Emails",
          sentEmails: "Sent Emails",
          deliveredEmails: "Delivered Emails",
          openedEmails: "Opened Emails",
          clickedEmails: "Clicked Emails",
          bouncedEmails: "Bounced Emails",
          failedEmails: "Failed Emails",
          draftEmails: "Draft Emails",
          openRate: "Open Rate",
          clickRate: "Click Rate",
          deliveryRate: "Delivery Rate",
          bounceRate: "Bounce Rate",
          failureRate: "Failure Rate",
          emailsByProvider: "Emails by Provider",
          emailsByTemplate: "Emails by Template",
          emailsByStatus: "Emails by Status",
          emailsByType: "Emails by Type",
          emailsWithUserId: "Emails with User ID",
          emailsWithoutUserId: "Emails without User ID",
          emailsWithLeadId: "Emails with Lead ID",
          emailsWithoutLeadId: "Emails without Lead ID",
          emailsWithErrors: "Emails with Errors",
          emailsWithoutErrors: "Emails without Errors",
          averageRetryCount: "Average Retry Count",
          maxRetryCount: "Maximum Retry Count",
          averageProcessingTime: "Average Processing Time",
          averageDeliveryTime: "Average Delivery Time",
          historicalData: "Historical Data",
          groupedStats: "Grouped Statistics",
          generatedAt: "Generated At",
          dataRange: "Data Range",
          recentActivity: "Recent Activity",
          topPerformingTemplates: "Top Performing Templates",
          topPerformingProviders: "Top Performing Providers",
          metrics: {
            totalEmails: "Total Emails",
            sentEmails: "Sent Emails",
            deliveredEmails: "Delivered Emails",
            openedEmails: "Opened Emails",
            clickedEmails: "Clicked Emails",
            bouncedEmails: "Bounced Emails",
            failedEmails: "Failed Emails",
            deliveryRate: "Delivery Rate",
            openRate: "Open Rate",
            clickRate: "Click Rate",
            bounceRate: "Bounce Rate",
            failureRate: "Failure Rate",
            emails_with_errors: "Emails with Errors",
            average_retry_count: "Average Retry Count",
            average_processing_time: "Average Processing Time (ms)",
            average_delivery_time: "Average Delivery Time (ms)",
            provider_historical: "Provider Historical Data",
            template_historical: "Template Historical Data",
            engagement_historical: "Engagement Historical Data",
          },
          retry: {
            no_retries: "No Retries",
            with_retries: "With Retries",
          },
          association: {
            with_user: "With User",
            with_lead: "With Lead",
            with_both: "With Both",
            with_neither: "Standalone",
          },
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to access email statistics",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters provided",
          },
          server: {
            title: "Server Error",
            description:
              "Internal server error occurred while retrieving statistics",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred while retrieving statistics",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access to email statistics is forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Email statistics not found",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description:
              "There are unsaved changes that need to be saved first",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred while retrieving statistics",
          },
        },
        success: {
          title: "Success",
          description: "Email statistics retrieved successfully",
        },
      },
      widget: {
        title: "Email Statistics",
        total: "Total",
        sent: "Sent",
        delivered: "Delivered",
        opened: "Opened",
        clicked: "Clicked",
        bounced: "Bounced",
        failed: "Failed",
        errors: "Errors",
        engagementRates: "Engagement Rates",
        deliveryRate: "Delivery Rate",
        openRate: "Open Rate",
        clickRate: "Click Rate",
        bounceRate: "Bounce Rate",
        failureRate: "Failure Rate",
        byStatus: "By Status",
        byType: "By Type",
        avgRetries: "Avg. Retries",
        avgDeliveryMs: "Avg. Delivery Time",
        viewList: "View List",
        refresh: "Refresh",
        search: "Search emails...",
      },
      enums: {
        status: {
          pending: "Pending",
          sent: "Sent",
          delivered: "Delivered",
          opened: "Opened",
          clicked: "Clicked",
          bounced: "Bounced",
          failed: "Failed",
          unsubscribed: "Unsubscribed",
        },
        statusFilter: {
          any: "All Statuses",
        },
        type: {
          transactional: "Transactional",
          marketing: "Marketing",
          notification: "Notification",
          system: "System",
          leadCampaign: "Lead Campaign",
          userCommunication: "User Communication",
        },
        typeFilter: {
          any: "All Types",
        },
        sortField: {
          subject: "Subject",
          recipientEmail: "Recipient Email",
          recipientName: "Recipient Name",
          type: "Type",
          status: "Status",
          sentAt: "Sent At",
          createdAt: "Created At",
        },
        sortOrder: {
          asc: "Ascending",
          desc: "Descending",
        },
      },
    },
    enums: {
      status: {
        pending: "Pending",
        sent: "Sent",
        delivered: "Delivered",
        opened: "Opened",
        clicked: "Clicked",
        bounced: "Bounced",
        failed: "Failed",
        unsubscribed: "Unsubscribed",
      },
      statusFilter: {
        any: "All Statuses",
      },
      type: {
        transactional: "Transactional",
        marketing: "Marketing",
        notification: "Notification",
        system: "System",
        leadCampaign: "Lead Campaign",
        userCommunication: "User Communication",
      },
      typeFilter: {
        any: "All Types",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Other",
      },
      sortField: {
        subject: "Subject",
        recipientEmail: "Recipient Email",
        recipientName: "Recipient Name",
        type: "Type",
        status: "Status",
        sentAt: "Sent At",
        createdAt: "Created At",
      },
      retryRange: {
        noRetries: "No Retries",
        oneToTwo: "1-2 Retries",
        threeToFive: "3-5 Retries",
        sixPlus: "6+ Retries",
      },
      syncStatus: {
        pending: "Pending Sync",
        syncing: "Syncing",
        synced: "Synced",
        failed: "Sync Failed",
      },
      specialFolder: {
        inbox: "Inbox",
        sent: "Sent",
        drafts: "Drafts",
        trash: "Trash",
        spam: "Spam",
        archive: "Archive",
      },
      sortOrder: {
        asc: "Ascending",
        desc: "Descending",
      },
    },
  },
  send: {
    title: "Send Message",
    description:
      "Send a message via any channel (Email, SMS, WhatsApp, Telegram)",
    category: "Messaging",
    tag: "Send",

    container: {
      title: "Send Message",
      description: "Send through a configured messenger account",
    },

    accountId: {
      label: "Messenger Account",
      description: "Account to send through",
      placeholder: "Select account UUID",
    },
    to: {
      label: "Recipient",
      description: "Email address, phone number, or chat ID",
      placeholder: "user@example.com or +12025551234",
    },
    toName: {
      label: "Recipient Name",
      description: "Display name of the recipient (optional)",
      placeholder: "John Doe",
    },
    subject: {
      label: "Subject",
      description: "Subject line (email only, optional for other channels)",
      placeholder: "Your subject here...",
    },
    text: {
      label: "Message",
      description:
        "Plain text body - used for SMS/WhatsApp/Telegram; email fallback",
      placeholder: "Enter your message...",
    },
    html: {
      label: "HTML Content",
      description:
        "HTML body (email only, optional - falls back to text if omitted)",
      placeholder: "<p>Enter HTML email content...</p>",
    },
    senderName: {
      label: "Sender Name",
      description: "Display name of the sender (email only, optional)",
      placeholder: "Your Company",
    },
    replyTo: {
      label: "Reply-To",
      description: "Reply-to address (email only, optional)",
      placeholder: "support@example.com",
    },
    leadId: {
      label: "Lead ID",
      description: "Associated lead for tracking (optional)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "Campaign ID",
      description: "Associated campaign for tracking (optional)",
      placeholder: "UUID",
    },

    response: {
      title: "Send Result",
      description: "Result of the send operation",
      messageId: { label: "Message ID" },
      accountName: { label: "Account" },
      channel: { label: "Channel" },
      provider: { label: "Provider" },
      sentAt: { label: "Sent At" },
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You don't have permission to send messages",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred while sending",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while sending",
      },
      notFound: {
        title: "Account Not Found",
        description: "The specified messenger account was not found",
      },
      conflict: {
        title: "Conflict",
        description: "Request conflicts with existing data",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },

    success: {
      title: "Message Sent",
      description: "Your message has been sent successfully",
    },
  },
  smtpClient: {
    tag: "SMTP Client",
    category: "Email Services",
    components: {
      email: {
        tagline: "Free speech AI platform",
        footer: {
          needHelp: "Need help?",
          helpText: "Need help? Contact us at",
          unsubscribeText: "Don't want to receive these emails?",
          unsubscribeLink: "Unsubscribe",
          copyright: "© {{currentYear}} {{appName}}. All rights reserved.",
          visitWebsite: "Visit Website",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. All rights reserved.",
          feedbackHook: "Got something to say? Reply - we actually read it.",
          feedbackBody:
            "Report a bug, request a feature, or tell us what's missing. Useful feedback earns you {{credits}} credits — a full month on us.",
          feedbackLink: "Reply with feedback →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Components",
        description: "Components endpoint",
        form: {
          title: "Components Configuration",
          description: "Configure components parameters",
        },
        response: {
          title: "Response",
          description: "Components response data",
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
    emailSending: {
      email: {
        defaultSenderName: "System",
        errors: {
          sending_failed: "Failed to send email to {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Failed to render email template",
          send_failed: "Failed to send email",
          email_failed_subject: "Email Failed",
          unknown_recipient: "Unknown recipient",
          unknown_sender: "System",
          email_render_exception: "Email rendering exception occurred",
          batch_send_failed: "Batch email send failed",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for SMTP sending operations",
        },
        server: {
          title: "Server Error",
          description: "An error occurred on the SMTP server",
        },
        rejected: {
          title: "Email Rejected",
          defaultReason: "Email rejected by server",
        },
        no_recipients: {
          title: "No Recipients Accepted",
          defaultReason: "No recipients accepted",
        },
        rate_limit: {
          title: "Rate Limit Exceeded",
        },
        capacity: {
          title: "Capacity Error",
        },
        no_account: {
          title: "No SMTP Account Available",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Email Metadata Server Error",
          description: "Failed to store email metadata",
        },
      },
    },
    enums: {
      status: {
        active: "Active",
        inactive: "Inactive",
        error: "Error",
        testing: "Testing",
      },
      securityType: {
        none: "None",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "All Statuses",
      },
      healthStatus: {
        healthy: "Healthy",
        degraded: "Degraded",
        unhealthy: "Unhealthy",
        unknown: "Unknown",
      },
      healthStatusFilter: {
        all: "All Health Statuses",
      },
      sortField: {
        name: "Name",
        status: "Status",
        createdAt: "Created At",
        updatedAt: "Updated At",
        priority: "Priority",
        totalEmailsSent: "Total Emails Sent",
        lastUsedAt: "Last Used At",
      },
      campaignType: {
        leadCampaign: "Lead Campaign",
        newsletter: "Newsletter",
        signupNurture: "Signup Nurture",
        retention: "Retention",
        winback: "Winback",
        transactional: "Transactional",
        notification: "Notification",
        system: "System",
      },
      campaignTypeFilter: {
        all: "All Campaign Types",
      },
      selectionRuleSortField: {
        name: "Name",
        priority: "Priority",
        campaignType: "Campaign Type",
        journeyVariant: "Journey Variant",
        campaignStage: "Campaign Stage",
        country: "Country",
        language: "Language",
        createdAt: "Created At",
        updatedAt: "Updated At",
        emailsSent: "Emails Sent",
        successRate: "Success Rate",
        lastUsedAt: "Last Used At",
      },
      selectionRuleStatusFilter: {
        all: "All",
        active: "Active",
        inactive: "Inactive",
        default: "Default",
        failover: "Failover",
      },
      loadBalancingStrategy: {
        roundRobin: "Round Robin",
        weighted: "Weighted",
        priority: "Priority",
        leastUsed: "Least Used",
      },
      testResult: {
        success: "Success",
        authFailed: "Authentication Failed",
        connectionFailed: "Connection Failed",
        timeout: "Timeout",
        unknownError: "Unknown Error",
      },
    },
  },

  // Core emails level translations
  tag: "Emails",
  tags: {
    stats: "Statistics",
    analytics: "Analytics",
  },
  error: {
    default: "An error occurred",
  },
  template: {
    tagline: "AI without the guardrails",
  },
  footer: {
    visitWebsite: "Visit Website",
    allRightsReserved: "All rights reserved",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "Lead Batch Update Email",
            description: "Email sent when leads are updated in batch",
          },
          preview: {
            totalMatched: "Total Matched",
            totalMatched_description: "Number of leads matched",
            totalProcessed: "Total Processed",
            totalProcessed_description: "Number of leads processed",
            totalUpdated: "Total Updated",
            totalUpdated_description: "Number of leads successfully updated",
            errorsCount: "Errors Count",
            errorsCount_description: "Number of errors during processing",
            dryRun: "Dry Run",
            dryRun_description: "Preview only without making changes",
            userId: "User ID",
            userId_description: "ID of the user performing the action",
          },
        },
      },
      welcome: {
        meta: {
          name: "Lead Welcome Email",
          description: "Welcome email sent to new leads",
        },
        preview: {
          leadId: "Lead ID",
          leadId_description: "Unique identifier for the lead",
          businessName: "Business Name",
          businessName_description: "Name of the business (optional)",
          email: "Email",
          email_description: "Email address of the lead",
          userId: "User ID",
          userId_description: "ID of the associated user (optional)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Contact Form Submission",
          description: "Email sent when contact form is submitted",
        },
        preview: {
          name: "Name",
          name_description: "Name of the contact",
          email: "Email",
          email_description: "Email address of the contact",
          company: "Company",
          company_description: "Company name (optional)",
          subject: "Subject",
          subject_description: "Message subject",
          message: "Message",
          message_description: "Message content",
          isForCompany: "For Company Account",
          isForCompany_description:
            "Whether this email is sent to company team",
          userId: "User ID",
          userId_description: "ID of the associated user (optional)",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead (optional)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Newsletter Unsubscribe Confirmation",
          description: "Confirmation email when unsubscribing from newsletter",
        },
        preview: {
          email: "Email",
          email_description: "Email address being unsubscribed",
        },
      },
      welcome: {
        meta: {
          name: "Newsletter Welcome Email",
          description: "Welcome email for new newsletter subscribers",
        },
        preview: {
          email: "Email",
          email_description: "Email address of the subscriber",
          name: "Name",
          name_description: "Name of the subscriber (optional)",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead (optional)",
          userId: "User ID",
          userId_description: "ID of the associated user (optional)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Password Reset Confirmation",
            description: "Confirmation email after password reset",
          },
          preview: {
            publicName: "Public Name",
            publicName_description: "Public name of the user",
            userId: "User ID",
            userId_description: "Unique identifier for the user",
          },
        },
        request: {
          meta: {
            name: "Password Reset Request",
            description: "Email with password reset link",
          },
          preview: {
            publicName: "Public Name",
            publicName_description: "Public name of the user",
            userId: "User ID",
            userId_description: "Unique identifier for the user",
            passwordResetUrl: "Password Reset URL",
            passwordResetUrl_description: "URL for resetting the password",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "User Signup Welcome",
          description: "Welcome email for new user signups",
        },
        preview: {
          privateName: "Private Name",
          privateName_description: "Private name of the user",
          userId: "User ID",
          userId_description: "Unique identifier for the user",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "User Welcome Email",
          description: "Welcome email sent to new users",
        },
        preview: {
          userId: "User ID",
          userId_description: "Unique identifier for the user",
          email: "Email",
          email_description: "Email address of the user",
          privateName: "Private Name",
          privateName_description: "Private name of the user",
          publicName: "Public Name",
          publicName_description: "Public name of the user",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead (optional)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Subscription Success",
          description: "Confirmation email for successful subscription",
        },
        preview: {
          privateName: "Private Name",
          privateName_description: "Private name of the user",
          userId: "User ID",
          userId_description: "Unique identifier for the user",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead",
          planName: "Plan Name",
          planName_description: "Name of the subscription plan",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: New User Signup",
          description: "Admin notification when a new user registers",
        },
        preview: {
          privateName: "Private Name",
          publicName: "Public Name",
          email: "Email",
          userId: "User ID",
          subscribeToNewsletter: "Newsletter Subscription",
        },
      },
      subscription: {
        meta: {
          name: "Admin: New Subscription",
          description: "Admin notification when a user subscribes",
        },
        preview: {
          privateName: "Private Name",
          publicName: "Public Name",
          email: "Email",
          planName: "Plan Name",
          statusName: "Status",
        },
      },
      user_create: {
        meta: {
          name: "Admin: New User Created",
          description: "Admin notification when a user account is created",
        },
        preview: {
          privateName: "Private Name",
          publicName: "Public Name",
          email: "Email",
          userId: "User ID",
          leadId: "Lead ID",
        },
      },
      contact: {
        meta: {
          name: "Admin: Contact Form Submission",
          description: "Admin notification when a contact form is submitted",
        },
        preview: {
          name: "Sender Name",
          email: "Sender Email",
          subject: "Subject",
          message: "Message",
          company: "Company",
          userId: "User ID",
          leadId: "Lead ID",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "Render Email Preview",
        titleShort: "Render Preview",
        description: "Server-side rendering of email templates for preview",
        container: {
          title: "Email Preview Configuration",
        },
        success: {
          title: "Preview Rendered",
          description: "Email preview rendered successfully",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID of the email template to render",
          },
          language: {
            label: "Language",
            description: "Language for email rendering",
          },
          country: {
            label: "Country",
            description: "Country for email rendering",
          },
          props: {
            label: "Template Props",
            description: "Properties to pass to the email template",
          },
          html: {
            title: "Rendered HTML",
          },
          subject: {
            title: "Email Subject",
          },
          templateVersion: {
            title: "Template Version",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid preview request data",
          },
          network: {
            title: "Network Error",
            description: "Network error while rendering preview",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You are not authorized to render previews",
          },
          forbidden: {
            title: "Forbidden",
            description: "Preview rendering is forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Email template not found",
          },
          server: {
            title: "Server Error",
            description: "Failed to render email preview",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred while rendering",
          },
        },
      },
      title: "Email Preview",
      preview: "Preview",
      version: "Version",
      submit: "Render Preview",
      submitting: "Rendering...",
    },
    sendTest: {
      post: {
        title: "Send Test Email",
        titleShort: "Test Email",
        description: "Send test email with custom template data",
        container: {
          title: "Test Email Configuration",
        },
        success: {
          title: "Test Email Sent",
          description: "Test email sent successfully",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID of the email template to send",
          },
          recipientEmail: {
            label: "Recipient Email",
            description: "Email address to send test to",
          },
          language: {
            label: "Language",
            description: "Language for email rendering",
          },
          country: {
            label: "Country",
            description: "Country for email rendering",
          },
          props: {
            label: "Template Props",
            description: "Properties to pass to the email template",
          },
          success: {
            title: "Success",
          },
          message: {
            title: "Result Message",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid test email request data",
          },
          network: {
            title: "Network Error",
            description: "Network error while sending test email",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You are not authorized to send test emails",
          },
          forbidden: {
            title: "Forbidden",
            description: "Sending test emails is forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Email template not found",
          },
          server: {
            title: "Server Error",
            description: "Failed to send test email",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred while sending",
          },
        },
      },
      error: {
        templateNotFound: "Email template {{templateId}} not found",
        invalidProps: "Invalid template props: {{error}}",
        sendFailed: "Failed to send test email: {{error}}",
      },
      success: "Test email sent",
      successDetail: "Test email sent to {{email}}",
      title: "Send Test Email",
      failed: "Failed to send test email",
      submit: "Send Test Email",
      submitting: "Sending...",
    },
  },
  messaging: {
    category: "Messaging",
    tag: "messaging",
    enums: {
      channel: {
        email: "Email",
        sms: "SMS",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
      },
      channelFilter: {
        any: "All Channels",
      },
      provider: {
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Telegram Bot",
      },
      accountStatus: {
        active: "Active",
        inactive: "Inactive",
        error: "Error",
        testing: "Testing",
      },
    },
    send: {
      errors: {
        accountNotFound: "Messaging account {{accountId}} not found",
        sendFailed: "Failed to send message",
        unexpected: "Unexpected error sending message: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "SMTP send failed",
      smtpAccountNotFound: "IMAP account not found",
      smtpListInboxFailed: "Failed to list inbox",
      smtpListFoldersFailed: "Failed to list folders",
      smtpMoveMessageFailed: "Failed to move message",
      smtpMarkReadFailed: "Failed to mark message",
      resendKeyNotConfigured: "Resend API key not configured",
      resendSendFailed: "Resend send failed",
      resendProviderError: "Resend provider error",
      resendNoInbox: "Resend does not support inbox",
      resendNoFolders: "Resend does not support folders",
      smsSendFailed: "SMS send failed",
      whatsappSendFailed: "WhatsApp send failed",
      telegramSendFailed: "Telegram send failed",
      accountNotFound: "Messaging account not found",
      notSupported: "This operation is not supported by this provider",
    },
  },
};
