export const translations = {
  get: {
    title: "Get Campaign Starter Config",
    description: "Retrieve campaign starter configuration",
    form: {
      title: "Campaign Starter Config Request",
      description: "Request campaign starter configuration",
    },
    response: {
      title: "Configuration Response",
      description: "Campaign starter configuration data",
      dryRun: "Dry Run Mode",
      minAgeHours: "Minimum Age Hours",
      enabledDays: "Enabled Days",
      enabledHours: "Enabled Hours",
      leadsPerWeek: "Leads Per Week",
      schedule: "Schedule",
      enabled: "Enabled",
      priority: "Priority",
      timeout: "Timeout",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
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
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Config Retrieved Successfully",
      description: "Campaign starter configuration retrieved successfully",
    },
  },
  post: {
    title: "Campaign Starter Config",
    description: "Campaign Starter Config endpoint",
    form: {
      title: "Campaign Starter Config Configuration",
      description: "Configure campaign starter config parameters",
    },
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
      description: "Timeout value in seconds",
    },
    retries: {
      label: "Retries",
      description: "Number of retry attempts",
    },
    retryDelay: {
      label: "Retry Delay",
      description: "Delay between retry attempts in seconds",
    },
    response: {
      title: "Response",
      description: "Campaign Starter Config response data",
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  widget: {
    title: "Campaign-Starter-Konfiguration",
    titleSaved: "Konfiguration gespeichert",
    saving: "Speichern...",
    guidanceTitle: "Campaign Starter konfigurieren",
    guidanceDescription:
      "Legen Sie den Zeitplan, aktive Tage/Stunden, Leads-pro-Woche-Ziele und Cron-Task-Einstellungen fest. Verwenden Sie nach dem Speichern die Aktionsschaltflächen, um Statistiken anzuzeigen oder die Kampagne sofort zu starten.",
    successTitle: "Konfiguration erfolgreich gespeichert",
    successDescription:
      "Der Campaign Starter wird diese Einstellungen beim nächsten geplanten Lauf anwenden.",
    savedSettings: "Gespeicherte Einstellungen",
    scheduleCron: "Zeitplan (cron)",
    enabled: "Aktiviert",
    dryRun: "Probelauf",
    minLeadAge: "Mindest-Lead-Alter",
    activeDays: "Aktive Tage",
    activeHours: "Aktive Stunden",
    priority: "Priorität",
    timeout: "Timeout",
    retries: "Wiederholungen",
    retryDelay: "Wiederholungsverzögerung",
    leadsPerWeek: "Leads pro Woche",
    viewStats: "Statistiken anzeigen",
    viewCurrentConfig: "Aktuelle Konfiguration anzeigen",
    yes: "Ja",
    no: "Nein",
    yesNoEmailsSent: "Ja (keine E-Mails gesendet)",
    dayMon: "Mo",
    dayTue: "Di",
    dayWed: "Mi",
    dayThu: "Do",
    dayFri: "Fr",
    daySat: "Sa",
    daySun: "So",
  },
};
