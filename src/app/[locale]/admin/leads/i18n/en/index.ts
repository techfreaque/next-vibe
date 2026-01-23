export const translations = {
  leads: {
    admin: {
      title: "Lead Management",
      abTesting: {
        title: "A/B Testing Configuration",
        subtitle:
          "Monitor and configure A/B testing for email journey variants",
        status: {
          active: "Active",
          inactive: "Inactive",
          valid: "Valid",
          invalid: "Invalid",
        },
        metrics: {
          testStatus: "Test Status",
          totalVariants: "Total Variants",
          configuration: "Configuration",
          trafficSplit: "Traffic Split",
          trafficAllocation: "Traffic Allocation",
        },
        variants: {
          title: "Email Journey Variants",
          keyCharacteristics: "Key Characteristics:",
        },
        config: {
          title: "Configuration Details",
          testConfiguration: "Test Configuration",
          trafficDistribution: "Traffic Distribution",
          status: "Status",
          enabled: "Enabled",
          disabled: "Disabled",
          configurationValid: "Configuration Valid",
          yes: "Yes",
          no: "No",
          total: "Total",
        },
        descriptions: {
          enabled: "A/B testing is running",
          disabled: "A/B testing is disabled",
          emailJourneyVariants: "Email journey variants",
          configurationStatus: "Configuration status",
        },
      },
      actions: {
        refresh: "Refresh",
        reset: "Reset",
        retry: "Retry",
        export: "Export",
        exportCsv: "Export as CSV",
        exportExcel: "Export as Excel",
        import: "Import",
        addLead: "Add Lead",
      },
      adminErrors: {
        metrics: {
          calculation: "Failed to calculate engagement metrics",
        },
        processing: {
          listData: "Failed to process leads list data",
        },
      },
      batch: {
        filter_count: "{{total}} leads match current filters",
        current_page_count: "{{count}} leads on page {{page}}",
        scope_current_page: "Current Page",
        scope_all_pages: "All Pages",
        preview: "Preview Changes",
        apply: "Apply Changes",
        delete: "Delete",
        select_action: "Select Action",
        select_value: "Select Value",
        actions: {
          update_status: "Update Status",
          update_stage: "Update Campaign Stage",
          update_source: "Update Source",
          delete: "Delete Leads",
        },
        preview_title: "Preview Batch Update",
        delete_preview_title: "Preview Batch Delete",
        confirm_title: "Confirm Batch Update",
        delete_confirm: {
          title: "Confirm Batch Delete",
        },
        result_title: "Batch Operation Results",
        preview_description: "Review the {{count}} leads that will be updated",
        delete_preview_description:
          "Review the {{count}} leads that will be deleted. This action cannot be undone.",
        planned_changes: "Planned Changes",
        change_status: "Status → {{status}}",
        change_stage: "Campaign Stage → {{stage}}",
        change_source: "Source → {{source}}",
        confirm_update: "Confirm Update",
        confirm_delete: "Confirm Delete",
        success_message: "Successfully updated {{updated}} of {{total}} leads",
        delete_success_message:
          "Successfully deleted {{deleted}} of {{total}} leads",
        error_message: "Failed to update leads. Please try again.",
        errors_title: "Errors ({{count}})",
        processing: "Processing...",
        close: "Close",
        results: {
          title: "Batch Operation Results",
        },
        confirm: {
          title: "Confirm Batch Update",
        },
      },
      campaigns: {
        title: "Email Campaigns",
        subtitle: "Monitor and manage your automated email campaigns",
        description: "Manage automated email campaigns and sequences",
        error: "Failed to load campaign statistics",
        comingSoon: "Campaign management interface coming soon...",
        coming_soon: "Campaign management interface coming soon...",
        active_campaigns: "Active Campaigns",
        currently_running: "Currently running",
        total_leads: "Total Leads",
        in_campaigns: "In campaigns",
        conversion_rate: "Conversion Rate",
        overall_performance: "Overall performance",
        emails_sent: "Emails Sent",
        total_sent: "Total sent",
        email_performance: "Email Performance",
        open_rate: "Open Rate",
        click_rate: "Click Rate",
        bounce_rate: "Bounce Rate",
        engagement_breakdown: "Engagement Breakdown",
        emails_opened: "Emails Opened",
        emails_clicked: "Emails Clicked",
        unsubscribe_rate: "Unsubscribe Rate",
        lead_status_breakdown: "Lead Status Breakdown",
        recent_activity: "Recent Activity",
        leads_this_week: "Leads This Week",
        leads_this_month: "Leads This Month",
        emails_this_week: "Emails This Week",
        emails_this_month: "Emails This Month",
      },
      campaignStarter: {
        description:
          "Configure automated campaign starter settings and scheduling",
        form: {
          cronSettings: {
            label: "Cron Task Settings",
            description: "Configure the cron job execution settings",
            schedule: {
              label: "Schedule",
              placeholder: "Enter cron expression (e.g., */3 * * * *)",
            },
            timezone: {
              label: "Timezone",
              placeholder: "Enter timezone (e.g., UTC)",
            },
            enabled: {
              label: "Enabled",
            },
            priority: {
              label: "Priority",
              options: {
                low: "Low",
                normal: "Normal",
                high: "High",
                critical: "Critical",
              },
            },
            timeout: {
              label: "Timeout (ms)",
              placeholder: "Enter timeout in milliseconds",
            },
            retries: {
              label: "Retries",
              placeholder: "Number of retry attempts",
            },
            retryDelay: {
              label: "Retry Delay (ms)",
              placeholder: "Delay between retries in milliseconds",
            },
          },
          dryRun: {
            label: "Dry Run Mode",
          },
          enabledDays: {
            label: "Enabled Days",
            description:
              "Select which days of the week the campaign starter should run",
            options: {
              monday: "Monday",
              tuesday: "Tuesday",
              wednesday: "Wednesday",
              thursday: "Thursday",
              friday: "Friday",
              saturday: "Saturday",
              sunday: "Sunday",
            },
          },
          enabledHours: {
            label: "Enabled Hours",
            description:
              "Set the time range when the campaign starter should run",
            startHour: {
              label: "Start Hour",
              placeholder: "Start hour (0-23)",
            },
            endHour: {
              label: "End Hour",
              placeholder: "End hour (0-23)",
            },
          },
          leadsPerWeek: {
            label: "Leads Per Week",
            description:
              "Set the weekly quota of leads to process for each locale",
          },
          minAgeHours: {
            label: "Minimum Age (Hours)",
            placeholder: "Enter minimum age in hours",
          },
          sections: {
            basic: {
              title: "Basic Configuration",
              description: "Configure basic campaign starter settings",
            },
          },
          save: "Save Configuration",
          success: "Configuration saved successfully",
        },
        settings: {
          title: "Campaign Starter Settings",
          description: "Configure the campaign starter cron job settings",
        },
      },
      emails: {
        title: "Email Templates",
        description: "Preview and manage email templates for lead campaigns",
        subtitle: "Organized by customer journey and campaign stage",
        journey: "Journey",
        stage: "Stage",
        view_preview: "View Preview",
        total_templates: "Total Templates",
        templates: "templates",
        from: "From",
        recipient: "To",
        subject: "Subject",
        email_preview: "Email Preview",
        preview_title: "Email Preview",
        preview: {
          actions: {
            title: "Email Actions",
            description: "Test and manage email templates",
          },
          live: "Live Preview",
          error: "Failed to render email preview",
        },
        testEmail: {
          button: "Send Test Email",
          title: "Send Test Email",
          send: "Send Test Email",
          sending: "Sending...",
          success: "Test email sent successfully to {{email}}",
          prefix: "[TEST]",
          recipient: {
            title: "Test Recipient",
            name: "Test Recipient",
            email: {
              label: "Test Email Address",
              placeholder: "Enter email address to receive the test",
              description:
                "The email address where the test email will be sent",
            },
          },
          leadData: {
            title: "Lead Data for Template",
            businessName: {
              label: "Business Name",
              placeholder: "Example Business Inc.",
            },
            contactName: {
              label: "Contact Name",
              placeholder: "John Doe",
            },
            phone: {
              label: "Phone Number",
              placeholder: "+1234567890",
            },
            website: {
              label: "Website",
              placeholder: "https://example.com",
            },
            country: {
              label: "Country",
            },
            language: {
              label: "Language",
            },
            status: {
              label: "Lead Status",
            },
            source: {
              label: "Lead Source",
            },
            notes: {
              label: "Notes",
              placeholder: "Test lead for email preview",
            },
          },
          mockData: {
            businessName: "Acme Digital Solutions",
            contactName: "Jane Smith",
            phone: "+1-555-123-4567",
            website: "https://acme-digital.com",
            notes:
              "Interested in premium social media management services. High potential client with established business.",
          },
        },
      },
      filters: {
        title: "Filters",
        clear: "Clear Filters",
        search: {
          placeholder: "Search by email, business name, or contact...",
        },
        status: {
          placeholder: "Filter by status",
          all: "All Statuses",
        },
        campaign_stage: {
          all: "All Campaign Stages",
        },
        country: "Country",
        countries: {
          title: "Country",
          all: "All Countries",
          global: "Global",
          us: "United States",
          ca: "Canada",
          gb: "United Kingdom",
          de: "Germany",
          fr: "France",
          au: "Australia",
          pl: "Poland",
        },
        languages: {
          en: "English",
          de: "German",
          fr: "French",
          es: "Spanish",
          pl: "Polish",
        },
        sources: {
          title: "Source",
          website: "Website",
          socialMedia: "Social Media",
          emailCampaign: "Email Campaign",
          referral: "Referral",
          csvImport: "CSV Import",
          all: "All Sources",
          organic: "Organic",
          paid: "Paid Ads",
          social: "Social Media",
          email: "Email",
          direct: "Direct",
        },
        timePeriod: "Time Period",
        timePeriods: {
          hour: "Hourly",
          day: "Daily",
          week: "Weekly",
          month: "Monthly",
          quarter: "Quarterly",
          year: "Yearly",
        },
        dateRange: "Date Range",
        dateRanges: {
          today: "Today",
          yesterday: "Yesterday",
          last7Days: "Last 7 Days",
          last30Days: "Last 30 Days",
          last90Days: "Last 90 Days",
          thisMonth: "This Month",
          lastMonth: "Last Month",
          thisQuarter: "This Quarter",
          lastQuarter: "Last Quarter",
          thisYear: "This Year",
          lastYear: "Last Year",
        },
        chartType: "Chart Type",
        chartTypes: {
          line: "Line Chart",
          bar: "Bar Chart",
          area: "Area Chart",
        },
        statuses: {
          title: "Status",
          all: "All Statuses",
          new: "New",
          pending: "Pending",
          campaign_running: "Campaign Running",
          website_user: "Website User",
          newsletter_subscriber: "Newsletter Subscriber",
          nurturing: "Nurturing",
          converted: "Converted",
          signed_up: "Signed Up",
          subscription_confirmed: "Subscription Confirmed",
          unsubscribed: "Unsubscribed",
          bounced: "Bounced",
          invalid: "Invalid",
        },
      },
      formatting: {
        percentage: {
          zero: "0%",
          format: "{{value}}%",
        },
        fallbacks: {
          dash: "—",
          never: "Never",
          direct: "Direct",
          unknown: "Unknown",
          noSource: "No source",
          notAvailable: "N/A",
        },
      },
      import: {
        label: "Import",
        description: "Import leads from CSV files",
        button: "Import Leads",
        title: "Import Leads from CSV",
        actions: {
          import: "Import",
        },
        template: {
          title: "Download Template",
          description: "Get the CSV template with required columns",
          download: "Download Template",
          examples: {
            example1:
              "john@example.com,Example Corp,John Doe,+1234567890,https://example.com,DE,en,website,Interested in premium features",
            example2:
              "jane@company.com,Company Inc,Jane Smith,+0987654321,https://company.com,PL,en,referral,Looking for social media automation",
          },
        },
        file: {
          label: "CSV File",
          dropzone: {
            title: "Drop your CSV file here",
            description: "or click to browse files",
          },
          validation: {
            required: "Please select a CSV file to upload",
          },
        },
        options: {
          title: "Import Options",
          description: "Configure how the import should handle existing data",
          skipDuplicates: "Skip leads with duplicate email addresses",
          updateExisting: "Update existing leads with new data",
        },
        batch: {
          title: "Batch Processing",
          description: "Configure how large imports should be processed",
          useChunkedProcessing: "Use batch processing",
          useChunkedProcessingDescription:
            "Process large CSV files in smaller batches via background jobs. Recommended for files with more than 1000 rows.",
          batchSize: "Batch size",
          batchSizeDescription: "Number of rows to process per batch (10-1000)",
          batchSizePlaceholder: "100",
        },
        defaults: {
          title: "Default Values",
          description:
            "Set default values for leads that don't specify these fields",
          country: "Default Country",
          countryDescription: "Country to use when not specified in CSV",
          countryPlaceholder: "Select default country",
          language: "Default Language",
          languageDescription: "Language to use when not specified in CSV",
          languagePlaceholder: "Select default language",
          status: "Default Status",
          statusDescription: "Status to use when not specified in CSV",
          statusPlaceholder: "Select default status",
          campaignStage: "Default Campaign Stage",
          campaignStageDescription:
            "Campaign stage to use when not specified in CSV",
          campaignStagePlaceholder: "Select default campaign stage",
          source: "Default Source",
          sourceDescription: "Source to use when not specified in CSV",
          sourcePlaceholder: "Select default source",
        },
        progress: {
          title: "Import Progress",
          processing: "Processing...",
        },
        status: {
          title: "Import Status",
          pending: "Pending",
          processing: "Processing",
          completed: "Completed",
          failed: "Failed",
          unknown: "Unknown",
          rows: "rows",
          summary:
            "{{successful}} successful, {{failed}} failed, {{duplicates}} duplicates",
          andMore: "and {{count}} more",
          importing: "Importing",
          loading: "Loading import status...",
          activeJobs: "Active Import Jobs",
          preparing: "Preparing import...",
        },
        settings: {
          title: "Import Job Settings",
          description: "Adjust settings for this import job",
          batchSize: "Batch Size",
          maxRetries: "Max Retries",
        },
        success:
          "Successfully imported {{successful}} of {{total}} leads. {{failed}} failed, {{duplicates}} duplicates.",
        importing: "Importing...",
        start: "Start Import",
        error: {
          generic:
            "Import failed. Please check your file format and try again.",
          invalid_email_format: "Invalid email format",
          email_required: "Email is required",
        },
        errors: {
          noData: "No data found in the uploaded file",
          missingHeaders: "Missing required headers in CSV file",
        },
      },
      results: {
        showing: "Showing {{start}}-{{end}} of {{total}} leads",
      },
      sort: {
        newest: "Newest First",
        oldest: "Oldest First",
        business_asc: "Business A-Z",
        business_desc: "Business Z-A",
      },
      source: {
        website: "Website",
        social_media: "Social Media",
        email_campaign: "Email Campaign",
        referral: "Referral",
        csv_import: "CSV Import",
        api: "API",
      },
      stage: {
        not_started: "Not Started",
        initial: "Initial Contact",
        followup_1: "Follow-up 1",
        followup_2: "Follow-up 2",
        followup_3: "Follow-up 3",
        nurture: "Nurture",
        reactivation: "Reactivation",
      },
      stats: {
        // Page metadata
        title: "Leads Statistics",
        description: "View and analyze lead statistics and performance metrics",
        filter: "Filter",
        refresh: "Refresh",

        // UI Component translations
        totalLeads: "Total Leads",
        newThisMonth: "New This Month",
        activeLeads: "Active Leads",
        ofTotal: "of total",
        conversionRate: "Conversion Rate",
        convertedLeads: "Converted Leads",
        emailEngagement: "Email Engagement",
        emailsSent: "Emails Sent",
        bookingRate: "Booking Rate",
        dataCompleteness: "Data Completeness",
        profileCompleteness: "Profile Completeness",
        leadVelocity: "Lead Velocity",
        leadsPerDay: "Leads Per Day",
        signedUpLeads: "Signed Up Leads",
        signupRate: "Signup Rate",
        subscriptionConfirmedLeads: "Subscription Confirmed Leads",
        confirmationRate: "Confirmation Rate",
        unsubscribedLeads: "Unsubscribed Leads",
        bouncedLeads: "Bounced Leads",
        invalidLeads: "Invalid Leads",
        leadsWithEmailEngagement: "Leads With Email Engagement",
        leadsWithoutEmailEngagement: "Leads Without Email Engagement",
        averageEmailEngagementScore: "Average Email Engagement Score",
        engagementScore: "Engagement Score",
        totalEmailEngagements: "Total Email Engagements",
        totalEngagements: "Total Engagements",
        todayActivity: "Today's Activity",
        leadsCreatedToday: "Leads Created Today",
        leadsUpdatedToday: "Leads Updated Today",
        weekActivity: "This Week's Activity",
        leadsCreatedThisWeek: "Leads Created This Week",
        leadsUpdatedThisWeek: "Leads Updated This Week",
        monthActivity: "This Month's Activity",
        leadsCreatedThisMonth: "Leads Created This Month",
        leadsUpdatedThisMonth: "Leads Updated This Month",
        campaignStageDistribution: "Campaign Stage Distribution",
        leadsInActiveCampaigns: "Leads in Active Campaigns",
        leadsNotInCampaigns: "Leads Not in Campaigns",
        journeyVariantDistribution: "Journey Variant Distribution",
        countWithPercentage: "{{count}} ({{percentage}}%)",
        overview: "Overview",
        campaigns: "Campaigns",
        performance: "Performance",
        distribution: "Distribution",
        activity: "Activity",
        topPerformers: "Top Performers",
        historicalSubtitle: "Historical Data",
        campaignPerformance: "Campaign Performance",
        emailsOpened: "Emails Opened",
        open_rate: "Open Rate",
        click_rate: "Click Rate",
        topCampaigns: "Top Campaigns",
        leadsGenerated: "Leads Generated",
        performanceMetrics: "Performance Metrics",
        avgTimeToConversion: "Avg Time to Conversion",
        avgTimeToSignup: "Avg Time to Signup",
        topSources: "Top Sources",
        qualityScore: "Quality Score",
        statusDistribution: "Status Distribution",
        sourceDistribution: "Source Distribution",
        geographicDistribution: "Geographic Distribution",
        dataCompletenessBreakdown: "Data Completeness Breakdown",
        withBusinessName: "With Business Name",
        withContactName: "With Contact Name",
        withPhone: "With Phone",
        withWebsite: "With Website",
        recentActivity: "Recent Activity",
        engagementLevelDistribution: "Engagement Level Distribution",
        topPerformingCampaigns: "Top Performing Campaigns",
        openRate: "Open Rate",
        clickRate: "Click Rate",
        topPerformingSources: "Top Performing Sources",

        chart: {
          series: {
            totalLeads: "Total Leads",
            newLeads: "New Leads",
            qualifiedLeads: "Qualified Leads",
            convertedLeads: "Converted Leads",
          },
          title: "Lead Statistics Over Time",
          noData: "No data available for the selected period",
          yAxisLabel: "Number of Leads",
          xAxisLabel: "Date",
        },
        grouped: {
          by_status: "By Status: {{status}}",
          by_source: "By Source: {{source}}",
          by_country: "By Country: {{country}}",
          by_language: "By Language: {{language}}",
          by_campaign_stage: "By Campaign Stage: {{stage}}",
          by_journey_variant: "By Journey Variant: {{variant}}",
          by_engagement_level: "By Engagement Level: {{level}}",
          by_conversion_funnel: "By Conversion Funnel: {{stage}}",
        },
        legend: {
          title: "Chart Legend",
          showAll: "Show All",
          hideAll: "Hide All",
          clickToToggle: "Click to toggle series visibility",
        },
        metrics: {
          campaign_running_leads: "Campaign Running Leads",
          website_user_leads: "Website User Leads",
          newsletter_subscriber_leads: "Newsletter Subscriber Leads",
          total_leads: "Total Leads",
          new_leads: "New Leads",
          active_leads: "Active Leads",
          qualified_leads: "Qualified Leads",
          converted_leads: "Converted Leads",
          signed_up_leads: "Signed Up Leads",
          subscription_confirmed_leads: "Subscription Confirmed Leads",
          unsubscribed_leads: "Unsubscribed Leads",
          bounced_leads: "Bounced Leads",
          invalid_leads: "Invalid Leads",
          emails_sent: "Emails Sent",
          emails_opened: "Emails Opened",
          emails_clicked: "Emails Clicked",
          open_rate: "Open Rate",
          click_rate: "Click Rate",
          conversion_rate: "Conversion Rate",
          signup_rate: "Signup Rate",
          subscription_confirmation_rate: "Subscription Confirmation Rate",
          average_email_engagement_score: "Average Email Engagement Score",
          lead_velocity: "Lead Velocity",
          data_completeness_rate: "Data Completeness Rate",
          status_historical: "Status Historical Data",
          source_historical: "Source Historical Data",
          country_historical: "Country Historical Data",
          language_historical: "Language Historical Data",
          campaign_stage_historical: "Campaign Stage Historical Data",
          journey_variant_historical: "Journey Variant Historical Data",
          engagement_level_historical: "Engagement Level Historical Data",
          conversion_funnel_historical: "Conversion Funnel Historical Data",
          campaign_performance: "Campaign Performance",
          source_performance: "Source Performance",
          website_leads: "Website Leads",
          social_media_leads: "Social Media Leads",
          email_campaign_leads: "Email Campaign Leads",
          referral_leads: "Referral Leads",
          csv_import_leads: "CSV Import Leads",
          api_leads: "API Leads",
          new_status_leads: "New Status Leads",
          pending_leads: "Pending Leads",
          contacted_leads: "Contacted Leads",
          engaged_leads: "Engaged Leads",
          german_leads: "German Leads",
          polish_leads: "Polish Leads",
          global_leads: "Global Leads",
          german_language_leads: "German Language Leads",
          english_language_leads: "English Language Leads",
          polish_language_leads: "Polish Language Leads",
          not_started_leads: "Not Started Leads",
          initial_stage_leads: "Initial Stage Leads",
          followup_1_leads: "Follow-up 1 Leads",
          followup_2_leads: "Follow-up 2 Leads",
          followup_3_leads: "Follow-up 3 Leads",
          nurture_leads: "Nurture Leads",
          reactivation_leads: "Reactivation Leads",
          personal_approach_leads: "Personal Approach Leads",
          results_focused_leads: "Results Focused Leads",
          personal_results_leads: "Personal Results Leads",
          high_engagement_leads: "High Engagement Leads",
          medium_engagement_leads: "Medium Engagement Leads",
          low_engagement_leads: "Low Engagement Leads",
          no_engagement_leads: "No Engagement Leads",
        },
        sources: {
          website: "Website",
          social_media: "Social Media",
          email_campaign: "Email Campaign",
          referral: "Referral",
          csv_import: "CSV Import",
          api: "API",
          unknown: "Unknown",
          legend: {
            title: "Source Legend",
            visible: "visible",
            leads: "{{count}} lead_one ({{percentage}}%)",
            leads_one: "{{count}} lead ({{percentage}}%)",
            leads_other: "{{count}} leads ({{percentage}}%)",
            summary:
              "{{visible}} of {{total}} sources visible ({{percentage}}%)",
          },
        },
      },
      status: {
        new: "New",
        pending: "Pending",
        campaign_running: "Campaign Running",
        website_user: "Website User",
        in_contact: "In Contact",
        newsletter_subscriber: "Newsletter Subscriber",
        signed_up: "Signed Up",
        subscription_confirmed: "Subscription Confirmed",
        unsubscribed: "Unsubscribed",
        bounced: "Bounced",
        invalid: "Invalid",
        unknown: "Unknown",
      },
      table: {
        title: "Leads",
        total: "total leads",
        email: "Email",
        business: "Business",
        status: "Status",
        stage: "Campaign Stage",
        campaign_stage: "Campaign Stage",
        country: "Country",
        language: "Language",
        phone: "Phone",
        website: "Website",
        emails: "Emails",
        emails_sent: "Emails Sent",
        emails_opened: "Emails Opened",
        emails_clicked: "Emails Clicked",
        last_engagement: "Last Engagement",
        last_email_sent: "Last Email Sent",
        created: "Created",
        updated: "Updated",
        source: "Source",
        notes: "Notes",
        actions: "Actions",
        scroll_hint:
          "💡 Scroll horizontally to see all lead details and columns",
        select_all: "Select all leads",
        select_lead: "Select {{business}}",
        description: {
          recent: "Recent leads added to your database",
          complete: "Complete list of leads with management actions",
          overview: "Most recently added leads to your database",
        },
      },
      tabs: {
        overview: "Overview",
        leads: "Leads",
        leads_description: "Manage and view all leads",
        campaigns: "Campaigns",
        campaigns_description: "Manage email campaigns and automation",
        stats: "Statistics",
        stats_description: "View lead statistics and analytics",
        emails: "Email Previews",
        emails_description: "Preview and manage email templates",
        abTesting: "A/B Testing",
        abTesting_description:
          "Configure and monitor A/B testing for email campaigns",
        campaignStarter: "Campaign Starter",
        campaignStarter_description: "Configure campaign starter settings",
        import: "Import",
        import_description: "Import leads from CSV files",
      },
    },
    campaign: {
      title: "Email Campaign System",
      description: "Automated email campaigns powered by cron jobs",
      starter: {
        title: "Campaign Starter",
        description: "Processes NEW leads → CONTACTED",
        schedule: "Business Hours",
      },
      emails: {
        title: "Email Campaigns",
        description: "Sends emails to CONTACTED leads",
        schedule: "Every 2 Hours",
      },
      cleanup: {
        title: "Lead Cleanup",
        description: "Maintains data quality",
        schedule: "Daily 2 AM",
      },
      info: "Campaign management is handled automatically by the cron system. Visit the Cron Admin page for detailed monitoring.",
    },
    constants: {
      unknown: "unknown",
      defaultLanguage: "en",
      validationError: "Validation error",
    },
    csvImport: {
      exampleData: {
        row1: "john@example.com,Example Corp,John Doe,+1234567890,https://example.com,DE,en,website,Interested in premium features",
        row2: "jane@company.com,Company Inc,Jane Smith,+0987654321,https://company.com,PL,en,referral,Looking for social media automation",
      },
    },
    edit: {
      form: {
        actions: {
          back: "Back",
          save: "Save",
          saving: "Saving...",
          cancel: "Cancel",
        },
        additionalInfo: {
          title: "Additional Information",
          description: "Source and notes",
        },
        businessInfo: {
          title: "Business Information",
          description: "Basic business details",
        },
        contactInfo: {
          title: "Contact Information",
          description: "Contact details and communication preferences",
        },
        fields: {
          id: {
            label: "ID",
            description: "Unique identifier for the lead",
          },
          businessName: {
            label: "Business Name",
            placeholder: "Enter business name",
          },
          contactName: {
            label: "Contact Name",
            placeholder: "Enter contact person name",
          },
          email: {
            label: "Email Address",
            placeholder: "Enter email address",
          },
          phone: {
            label: "Phone Number",
            placeholder: "Enter phone number",
          },
          website: {
            label: "Website",
            placeholder: "Enter website URL",
          },
          country: {
            label: "Country",
            placeholder: "Select country",
          },
          language: {
            label: "Language",
            placeholder: "Select language",
          },
          status: {
            label: "Status",
            description: "Current status of the lead",
            placeholder: "Select status",
            options: {
              new: "New",
              pending: "Pending",
              campaign_running: "Campaign Running",
              website_user: "Website User",
              newsletter_subscriber: "Newsletter Subscriber",
              in_contact: "In Contact",
              signed_up: "Signed Up",
              subscription_confirmed: "Subscription Confirmed",
              unsubscribed: "Unsubscribed",
              bounced: "Bounced",
              invalid: "Invalid",
            },
          },
          currentCampaignStage: {
            label: "Campaign Stage",
            description: "Current stage in the email campaign",
            placeholder: "Select campaign stage",
            options: {
              not_started: "Not Started",
              initial: "Initial",
              followup_1: "Follow-up 1",
              followup_2: "Follow-up 2",
              followup_3: "Follow-up 3",
              nurture: "Nurture",
              reactivation: "Reactivation",
            },
          },
          source: {
            label: "Source",
            placeholder: "Enter lead source",
          },
          notes: {
            label: "Notes",
            description: "Additional notes about the lead",
            placeholder: "Enter notes",
          },
          metadata: {
            label: "Metadata",
            description: "Additional metadata as JSON",
            placeholder: "Enter metadata as JSON",
          },
          convertedUserId: {
            label: "Converted User",
            placeholder: "Select a user this lead converted to...",
            searchPlaceholder: "Search users...",
            searchHint: "Type at least 2 characters to search",
            noResults: "No users found",
            selectedUser: "{{firstName}} {{lastName}} ({{email}})",
          },
        },
        locationStatus: {
          title: "Location & Status",
          description: "Geographic location and lead status",
        },
      },
      success: {
        title: "Lead updated successfully",
        description: "The lead has been updated successfully.",
      },
    },
    emails: {
      tagline: "Your Social Media Management Platform",
      initial: {
        subject: "Transform {{businessName}}'s Social Media Presence",
        greeting: "Hi there,",
        intro:
          "I noticed {{businessName}} and thought you might be interested in how we're helping businesses like yours grow their social media presence by 300% or more.",
        value_proposition:
          "Our platform automates your social media management while maintaining authentic engagement with your audience.",
        benefit_1: "Automated content scheduling across all platforms",
        benefit_2: "AI-powered engagement and response management",
        benefit_3: "Detailed analytics and growth insights",
        cta: "See How It Works",
        closing:
          "Would love to show you how this could work for your business. No commitment required.",
      },
      followup1: {
        subject: "{{businessName}}: See How Others Grew 300% With Our Platform",
        greeting: "Hi there,",
        intro:
          "I wanted to follow up on my previous email about helping {{businessName}} grow its social media presence.",
        case_study_title: "Real Results from Similar Businesses",
        case_study_content:
          "Just last month, a company similar to yours increased their social media engagement by 340% and generated 50+ new leads directly from social media using our platform.",
        social_proof:
          "Over 1,000+ businesses trust us to manage their social media growth.",
        cta: "View Case Studies",
        closing:
          "I'd be happy to show you exactly how we achieved these results and how it could work for your business.",
      },
      signature: {
        best_regards: "Best regards,",
        team: "The {{companyName}} Team",
      },
      footer: {
        unsubscribe_text: "Don't want to receive these emails?",
        unsubscribe_link: "Unsubscribe here",
      },
    },
    engagement: {
      types: {
        email_open: "Email Open",
        email_click: "Email Click",
        website_visit: "Website Visit",
        form_submit: "Form Submit",
      },
    },
    errors: {
      create: {
        conflict: {
          title: "Lead Already Exists",
          description:
            "A lead with this email address already exists in the system.",
        },
        validation: {
          title: "Invalid Lead Data",
          description: "Please check the lead information and try again.",
        },
      },
      get: {
        notFound: {
          title: "Lead Not Found",
          description: "The requested lead could not be found.",
        },
      },
      update: {
        notFound: {
          title: "Lead Not Found",
          description: "The lead you're trying to update could not be found.",
        },
        validation: {
          title: "Invalid Update Data",
          description: "Please check the update information and try again.",
        },
      },
      import: {
        badRequest: {
          title: "Invalid CSV File",
          description: "The CSV file format is invalid or empty.",
        },
        validation: {
          title: "CSV Validation Error",
          description: "Some rows in the CSV file contain invalid data.",
        },
      },
    },
    export: {
      headers: {
        email: "Email",
        businessName: "Business Name",
        contactName: "Contact Name",
        phone: "Phone",
        website: "Website",
        country: "Country",
        language: "Language",
        status: "Status",
        source: "Source",
        notes: "Notes",
        createdAt: "Created At",
        updatedAt: "Updated At",
        emailsSent: "Emails Sent",
        emailsOpened: "Emails Opened",
        emailsClicked: "Emails Clicked",
        lastEmailSent: "Last Email Sent",
        lastEngagement: "Last Engagement",
        unsubscribedAt: "Unsubscribed At",
        metadata: "Metadata",
      },
      fileName: {
        prefix: "leads_export_",
        suffix: {
          csv: ".csv",
          excel: ".xlsx",
        },
      },
    },
    filter: {
      status: "Filter by status",
      campaign_stage: "Filter by campaign stage",
      country: "Filter by country",
      language: "Filter by language",
      source: "Filter by source",
      all_statuses: "All Statuses",
      all_countries: "All Countries",
      all_languages: "All Languages",
      all_sources: "All Sources",
      sort: "Sort by",
      page_size: "Page size",
      quick_filters: "Quick Filters",
      quick: {
        new_leads: "New Leads",
        campaign_running: "Campaign Running",
        imported: "Imported",
        not_started: "Not Started",
      },
      countries: {
        global: "Global",
        de: "Germany",
        pl: "Poland",
      },
      languages: {
        en: "English",
        de: "German",
        pl: "Polish",
      },
      sources: {
        website: "Website",
        social_media: "Social Media",
        email_campaign: "Email Campaign",
        referral: "Referral",
        csv_import: "CSV Import",
        api: "API",
      },
    },
    import: {
      validation: {
        missingFields: "Required fields are missing",
        invalidEmail: "Invalid email address",
        invalidData: "Invalid data format",
        failed: "Validation failed",
      },
      defaults: {
        language: "en",
        source: "csv_import",
      },
    },
    list: {
      title: "Leads List",
      titleWithCount: "Leads List ({{count}})",
      description:
        "Browse and manage all leads with advanced filtering and sorting",
      loading: "Loading...",
      no_results: "No leads found matching your criteria",
      noResults: "No leads found matching your criteria",
      results: {
        showing: "Showing {{start}}-{{end}} of {{total}} leads",
      },
      table: {
        title: "All Leads",
        campaign_stage: "Campaign Stage",
        contact: "Contact",
      },
      filters: {
        title: "Filters",
      },
    },
    pagination: {
      page_size: "Page Size",
      page_info: "Page {{current}} of {{total}}",
      page_info_with_count: "Page {{current}} of {{total}} ({{count}} total)",
      first: "First",
      previous: "Previous",
      next: "Next",
      last: "Last",
    },
    search: {
      placeholder: "Search leads...",
      error: {
        validation: {
          title: "Search Validation Error",
          description: "Please provide valid search criteria.",
        },
        unauthorized: {
          title: "Unauthorized Search",
          description: "You don't have permission to search leads.",
        },
        server: {
          title: "Search Server Error",
          description: "A server error occurred while searching leads.",
        },
        unknown: {
          title: "Search Error",
          description: "An unexpected error occurred while searching leads.",
        },
      },
      success: {
        title: "Search Successful",
        description: "Search completed successfully.",
      },
    },
    sort: {
      placeholder: "Sort by",
      field: "Sort Field",
      order: "Sort Order",
      created: "Created",
      updated: "Updated",
      email: "Email",
      business: "Business",
      last_engagement: "Last Engagement",
      asc: "Ascending",
      desc: "Descending",
    },
    sorting: {
      fields: {
        email: "Email",
        businessName: "Business Name",
        updatedAt: "Updated At",
        lastEngagementAt: "Last Engagement",
        createdAt: "Created At",
      },
    },
    success: {
      create: {
        title: "Lead Created",
        description: "The lead has been successfully added to the system.",
      },
      update: {
        title: "Lead Updated",
        description: "The lead information has been successfully updated.",
      },
      import: {
        title: "Import Completed",
        description: "The CSV import has been completed successfully.",
      },
      unsubscribe: {
        title: "Unsubscribed",
        description: "You have been successfully unsubscribed from our emails.",
      },
    },
    tracking: {
      errors: {
        missingId: "Lead ID is required for tracking",
        invalidIdFormat: "Lead ID must be a valid UUID format",
        invalidCampaignIdFormat: "Campaign ID must be a valid UUID format",
        invalidUrl: "Invalid URL format provided",
      },
    },
    unsubscribe: {
      title: "Unsubscribe from Emails",
      description:
        "We're sorry to see you go. You can unsubscribe from our emails below. This will remove you from all lead communications and marketing emails.",
      success: "You have been successfully unsubscribed.",
      error: "There was an error processing your unsubscribe request.",
      button: "Unsubscribe",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        success: {
          title: "Batch update successful",
          description: "Leads have been updated successfully",
        },
        error: {
          server: {
            title: "Batch update failed",
            description: "Unable to update leads due to a server error",
          },
          validation: {
            title: "Validation failed",
            description: "Please check your input and try again",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You don't have permission to perform batch updates",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access to batch updates is forbidden",
          },
          not_found: {
            title: "Not found",
            description: "The requested resource was not found",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred during batch update",
          },
        },
        validation: {
          no_fields: "At least one update field must be provided",
        },
      },
    },
    campaigns: {
      common: {
        error: {
          validation: {
            title: "Campaign validation failed",
            description: "Please check your campaign data and try again",
          },
          unauthorized: {
            title: "Campaign access denied",
            description: "You don't have permission to access campaigns",
          },
          server: {
            title: "Campaign server error",
            description: "Unable to process campaign due to a server error",
          },
          unknown: {
            title: "Campaign operation failed",
            description:
              "An unexpected error occurred during campaign operation",
          },
          forbidden: {
            title: "Campaign access forbidden",
            description:
              "You don't have permission to perform this campaign operation",
          },
          notFound: {
            title: "Campaign not found",
            description: "The requested campaign could not be found",
          },
        },
      },
      delete: {
        success: {
          title: "Campaign deleted",
          description: "Campaign deleted successfully",
        },
      },
      get: {
        success: {
          title: "Campaign statistics loaded",
          description: "Campaign statistics retrieved successfully",
        },
      },
      manage: {
        error: {
          validation: {
            title: "Campaign management validation failed",
            description: "Please check your campaign data and try again",
          },
          unauthorized: {
            title: "Campaign management access denied",
            description: "You don't have permission to manage campaigns",
          },
          server: {
            title: "Campaign management server error",
            description: "Unable to manage campaign due to a server error",
          },
          unknown: {
            title: "Campaign management operation failed",
            description:
              "An unexpected error occurred during campaign management",
          },
          forbidden: {
            title: "Campaign management access forbidden",
            description: "You don't have permission to manage campaigns",
          },
          notFound: {
            title: "Campaign not found",
            description: "The requested campaign could not be found",
          },
          campaignActive:
            "Cannot delete active campaign. Please disable it first.",
        },
        post: {
          success: {
            title: "Campaign created",
            description: "Campaign created successfully",
          },
        },
        put: {
          success: {
            title: "Campaign updated",
            description: "Campaign status updated successfully",
          },
        },
        delete: {
          success: {
            title: "Campaign deleted",
            description: "Campaign deleted successfully",
          },
        },
      },
      post: {
        success: {
          title: "Campaign created",
          description: "Campaign created successfully",
        },
      },
      put: {
        success: {
          title: "Campaign updated",
          description: "Campaign status updated successfully",
        },
      },
      stats: {
        error: {
          validation: {
            title: "Campaign statistics validation failed",
            description:
              "Please check your statistics parameters and try again",
          },
          unauthorized: {
            title: "Campaign statistics access denied",
            description:
              "You don't have permission to view campaign statistics",
          },
          server: {
            title: "Campaign statistics server error",
            description: "Unable to retrieve statistics due to a server error",
          },
          unknown: {
            title: "Campaign statistics operation failed",
            description:
              "An unexpected error occurred while retrieving statistics",
          },
          forbidden: {
            title: "Campaign statistics access forbidden",
            description:
              "You don't have permission to view campaign statistics",
          },
          notFound: {
            title: "Campaign statistics not found",
            description: "The requested campaign statistics could not be found",
          },
        },
        success: {
          title: "Campaign statistics loaded",
          description: "Campaign statistics retrieved successfully",
        },
      },
    },
    constants: {
      defaultSource: "csv_import",
      validationError: "Validation error",
      trackingMethod: "click_implied",
    },
    leads: {
      get: {
        error: {
          validation: {
            title: "Lead data validation failed",
            description: "Unable to validate lead data request",
          },
          unauthorized: {
            title: "Lead data access denied",
            description: "You don't have permission to access lead data",
          },
          server: {
            title: "Lead data server error",
            description: "Unable to load lead data due to a server error",
          },
          unknown: {
            title: "Lead data access failed",
            description: "An unexpected error occurred while loading lead data",
          },
          not_found: {
            title: "Lead not found",
            description: "The requested lead could not be found",
          },
          forbidden: {
            title: "Lead access forbidden",
            description: "You don't have permission to view this lead",
          },
          network: {
            title: "Network error",
            description: "Unable to load lead data due to a network error",
          },
          unsaved_changes: {
            title: "Unsaved changes",
            description: "You have unsaved changes that will be lost",
          },
          conflict: {
            title: "Data conflict",
            description: "The lead data has been modified by another user",
          },
        },
        success: {
          title: "Lead data loaded",
          description: "Lead information retrieved successfully",
        },
      },
      patch: {
        error: {
          validation: {
            title: "Lead update validation failed",
            description: "Please check your lead updates and try again",
          },
          unauthorized: {
            title: "Lead update unauthorized",
            description: "You don't have permission to update leads",
          },
          server: {
            title: "Lead update server error",
            description: "Unable to update lead due to a server error",
          },
          unknown: {
            title: "Lead update failed",
            description: "An unexpected error occurred while updating lead",
          },
          not_found: {
            title: "Lead not found",
            description: "The requested lead could not be found",
          },
          forbidden: {
            title: "Lead update forbidden",
            description: "You don't have permission to update this lead",
          },
          network: {
            title: "Network error",
            description: "Unable to update lead due to a network error",
          },
          unsaved_changes: {
            title: "Unsaved changes",
            description: "You have unsaved changes that will be lost",
          },
          conflict: {
            title: "Data conflict",
            description: "The lead data has been modified by another user",
          },
        },
        success: {
          title: "Lead updated",
          description: "Lead information updated successfully",
        },
      },
      post: {
        error: {
          validation: {
            title: "Lead creation validation failed",
            description: "Please check your lead information and try again",
          },
          unauthorized: {
            title: "Lead creation unauthorized",
            description: "You don't have permission to create leads",
          },
          server: {
            title: "Lead creation server error",
            description: "Unable to create lead due to a server error",
          },
          unknown: {
            title: "Lead creation failed",
            description: "An unexpected error occurred while creating lead",
          },
          forbidden: {
            title: "Lead creation forbidden",
            description: "You don't have permission to create leads",
          },
          duplicate: {
            title: "Lead already exists",
            description:
              "A lead with this email address already exists in the system",
          },
          conflict: {
            title: "Lead already exists",
            description:
              "A lead with this email address already exists in the system",
          },
        },
        success: {
          title: "Lead created",
          description: "Lead created successfully",
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Lead engagement validation failed",
            description: "Please check your engagement data and try again",
          },
          unauthorized: {
            title: "Lead engagement unauthorized",
            description: "You don't have permission to record lead engagement",
          },
          server: {
            title: "Lead engagement server error",
            description:
              "Unable to record lead engagement due to a server error",
          },
          unknown: {
            title: "Lead engagement failed",
            description:
              "An unexpected error occurred while recording lead engagement",
          },
          forbidden: {
            title: "Lead engagement forbidden",
            description: "You don't have permission to record lead engagement",
          },
        },
        success: {
          title: "Lead engagement recorded",
          description: "Lead engagement recorded successfully",
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          validation: {
            title: "Lead export validation failed",
            description: "Please check your export parameters and try again",
          },
          unauthorized: {
            title: "Lead export unauthorized",
            description: "You don't have permission to export leads",
          },
          server: {
            title: "Lead export server error",
            description: "Unable to export leads due to a server error",
          },
          unknown: {
            title: "Lead export failed",
            description: "An unexpected error occurred while exporting leads",
          },
        },
        success: {
          title: "Leads exported",
          description: "Leads exported successfully",
        },
      },
    },
    leadsImport: {
      delete: {
        success: {
          title: "Import job deleted",
          description: "Import job has been successfully deleted",
        },
        error: {
          unauthorized: {
            title: "Import job deletion not authorized",
            description: "You don't have permission to delete import jobs",
          },
          forbidden: {
            title: "Import job deletion forbidden",
            description: "You don't have permission to delete this import job",
          },
          not_found: {
            title: "Import job not found",
            description: "The import job could not be found",
          },
          server: {
            title: "Import job deletion server error",
            description:
              "Import job could not be deleted due to a server error",
          },
        },
      },
      get: {
        success: {
          title: "Import jobs retrieved successfully",
          description: "Import job list loaded",
        },
        error: {
          validation: {
            title: "Invalid import job request",
            description: "Please check your request parameters",
          },
          unauthorized: {
            title: "Import jobs access unauthorized",
            description: "You don't have permission to view import jobs",
          },
          server: {
            title: "Import jobs server error",
            description: "Unable to retrieve import jobs due to a server error",
          },
          unknown: {
            title: "Import jobs retrieval failed",
            description:
              "An unexpected error occurred while retrieving import jobs",
          },
        },
      },
      patch: {
        success: {
          title: "Import job updated successfully",
          description: "Job settings have been updated",
        },
        error: {
          validation: {
            title: "Invalid job update request",
            description: "Please check your update parameters",
          },
          unauthorized: {
            title: "Job update unauthorized",
            description: "You don't have permission to update this job",
          },
          forbidden: {
            title: "Job update forbidden",
            description: "You don't have permission to update this import job",
          },
          not_found: {
            title: "Import job not found",
            description: "The import job could not be found",
          },
          server: {
            title: "Job update server error",
            description: "Unable to update job due to a server error",
          },
          unknown: {
            title: "Job update failed",
            description: "An unexpected error occurred while updating the job",
          },
        },
      },
      post: {
        success: {
          title: "Import job action completed",
          description: "The requested action has been performed",
          job_stopped: "Job stopped successfully",
          job_queued_retry: "Job queued for retry",
          job_deleted: "Job deleted successfully",
        },
        error: {
          validation: {
            title: "Lead import validation failed",
            description: "Please check your CSV file and try again",
            failed: "CSV row validation failed",
            invalidData: "Invalid data in CSV row",
            missingFields: "Required fields are missing",
            invalidEmail: "Invalid email address in CSV row",
            email_required: "Email is required",
            invalid_email_format: "Invalid email format",
          },
          unauthorized: {
            title: "Lead import unauthorized",
            description: "You don't have permission to import leads",
          },
          server: {
            title: "Lead import server error",
            description: "Unable to import leads due to a server error",
          },
          unknown: {
            title: "Lead import failed",
            description: "An unexpected error occurred while importing leads",
          },
          forbidden: {
            title: "Lead import forbidden",
            description: "You don't have permission to import leads",
          },
          not_found: {
            title: "Import job not found",
            description: "The requested import job could not be found",
          },
          stopped_by_user: "Stopped by user",
        },
      },
      retry: {
        success: {
          title: "Import job retried",
          description: "Import job has been queued for retry",
        },
        error: {
          unauthorized: {
            title: "Import job retry not authorized",
            description: "You don't have permission to retry import jobs",
          },
          forbidden: {
            title: "Import job retry forbidden",
            description: "You don't have permission to retry this import job",
          },
          not_found: {
            title: "Import job not found",
            description: "The import job could not be found",
          },
          validation: {
            title: "Cannot retry import job",
            description:
              "This import job cannot be retried in its current state",
          },
          server: {
            title: "Import job retry server error",
            description:
              "Import job could not be retried due to a server error",
          },
        },
      },
      stop: {
        success: {
          title: "Import job stopped",
          description: "Import job has been successfully stopped",
        },
        error: {
          unauthorized: {
            title: "Import job stop not authorized",
            description: "You don't have permission to stop import jobs",
          },
          forbidden: {
            title: "Import job stop forbidden",
            description: "You don't have permission to stop this import job",
          },
          not_found: {
            title: "Import job not found",
            description: "The import job could not be found",
          },
          validation: {
            title: "Cannot stop import job",
            description:
              "This import job cannot be stopped in its current state",
          },
          server: {
            title: "Import job stop server error",
            description:
              "Import job could not be stopped due to a server error",
          },
        },
      },
    },
    leadsStats: {
      get: {
        error: {
          validation: {
            title: "Lead statistics validation failed",
            description: "Unable to validate lead statistics request",
          },
          unauthorized: {
            title: "Lead statistics access denied",
            description: "You don't have permission to access lead statistics",
          },
          server: {
            title: "Lead statistics server error",
            description: "Unable to load lead statistics due to a server error",
          },
          unknown: {
            title: "Lead statistics access failed",
            description:
              "An unexpected error occurred while loading lead statistics",
          },
          forbidden: {
            title: "Lead statistics access forbidden",
            description: "You don't have permission to access lead statistics",
          },
        },
        success: {
          title: "Lead statistics loaded",
          description: "Lead statistics retrieved successfully",
        },
      },
    },
    leadsTracking: {
      get: {
        error: {
          validation: {
            title: "Lead tracking validation failed",
            description: "Please check your tracking parameters and try again",
          },
          unauthorized: {
            title: "Lead tracking unauthorized",
            description: "You don't have permission to access lead tracking",
          },
          server: {
            title: "Lead tracking server error",
            description: "Unable to process tracking due to a server error",
          },
          unknown: {
            title: "Lead tracking failed",
            description: "An unexpected error occurred during lead tracking",
          },
          forbidden: {
            title: "Lead tracking access forbidden",
            description: "You don't have permission to access lead tracking",
          },
          not_found: {
            title: "Lead not found",
            description: "The requested lead could not be found for tracking",
          },
        },
        success: {
          title: "Lead tracking successful",
          description: "Lead tracking recorded successfully",
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        error: {
          validation: {
            title: "Lead unsubscribe validation failed",
            description: "Please check your unsubscribe request and try again",
          },
          unauthorized: {
            title: "Lead unsubscribe unauthorized",
            description: "You don't have permission to unsubscribe leads",
          },
          server: {
            title: "Lead unsubscribe server error",
            description: "Unable to unsubscribe lead due to a server error",
          },
          unknown: {
            title: "Lead unsubscribe failed",
            description:
              "An unexpected error occurred while unsubscribing lead",
          },
          forbidden: {
            title: "Lead unsubscribe forbidden",
            description: "You don't have permission to unsubscribe this lead",
          },
        },
        success: {
          title: "Lead unsubscribed",
          description: "Lead unsubscribed successfully",
        },
      },
    },
    testEmail: {
      error: {
        validation: {
          title: "Test email validation failed",
          description: "Please check your test email data and try again",
        },
        unauthorized: {
          title: "Test email unauthorized",
          description: "You don't have permission to send test emails",
        },
        server: {
          title: "Test email server error",
          description: "Unable to send test email due to a server error",
        },
        unknown: {
          title: "Test email failed",
          description: "An unexpected error occurred while sending test email",
        },
        templateNotFound: {
          title: "Email template not found",
          description: "The requested email template could not be found",
        },
        sendingFailed: {
          title: "Email sending failed",
          description: "Failed to send the test email",
        },
        invalidConfiguration: {
          title: "Invalid email configuration",
          description: "The email configuration is invalid or incomplete",
        },
      },
      fields: {
        journeyVariant: {
          description: "Select the email journey variant to test",
        },
        stage: {
          description: "Select the email campaign stage to test",
        },
        testEmail: {
          description:
            "Enter the email address where the test email will be sent",
        },
        leadData: {
          email: {
            description: "Email address that will appear in the email template",
          },
          businessName: {
            description: "Business name that will appear in the email template",
          },
          contactName: {
            description: "Contact name that will appear in the email template",
          },
          phone: {
            description: "Phone number that will appear in the email template",
          },
          website: {
            description: "Website URL that will appear in the email template",
          },
          country: {
            description:
              "Country that will be used for localization in the email template",
          },
          language: {
            description:
              "Language that will be used for localization in the email template",
          },
          status: {
            description: "Lead status that will be used in the email template",
          },
          source: {
            description: "Lead source that will be used in the email template",
          },
          notes: {
            description: "Notes that will be used in the email template",
          },
        },
      },
      success: {
        title: "Test email sent successfully",
        description: "The test email has been sent to the specified address",
      },
      validation: {
        journeyVariant: {
          invalid: "Invalid email journey variant",
        },
        stage: {
          invalid: "Invalid email campaign stage",
        },
        testEmail: {
          invalid: "Invalid test email address",
        },
        leadData: {
          email: {
            invalid: "Invalid lead email address",
          },
          businessName: {
            required: "Lead business name is required",
            tooLong: "Lead business name is too long",
          },
          contactName: {
            tooLong: "Lead contact name is too long",
          },
          phone: {
            invalid: "Invalid lead phone number",
          },
          website: {
            invalid: "Invalid lead website URL",
          },
          country: {
            invalid: "Invalid lead country",
          },
          language: {
            invalid: "Invalid lead language",
          },
          status: {
            invalid: "Invalid lead status",
          },
          source: {
            invalid: "Invalid lead source",
          },
          notes: {
            tooLong: "Lead notes are too long",
          },
        },
      },
    },
    validation: {
      email: {
        invalid: "Invalid email address",
      },
      businessName: {
        required: "Business name is required",
      },
      website: {
        invalid: "Invalid website URL",
      },
      language: {
        tooShort: "Language code must be at least 2 characters",
        tooLong: "Language code must be at most 5 characters",
      },
      country: {
        invalid: "Invalid country code",
      },
    },
  },
};
