export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarms" },
  get: {
    title: "Alarm Detail",
    description: "Fetches the full detail of a single Corvina alarm by ID.",
    alarmId: {
      label: "Alarm ID",
      description: "Unique identifier of the alarm.",
    },
    response: {
      id: "ID",
      realmId: "Realm",
      name: "Name",
      description: "Description",
      deviceId: "Device ID",
      deviceLabel: "Device",
      tag: "Tag",
      severity: "Severity",
      status: "Status",
      action: "Action",
      alarmEnabled: "Enabled",
      ack: "Ack Required",
      reset: "Reset Required",
      eventTimestamp: "Event Time",
      updatedAt: "Updated",
      acknowledgedDate: "Acknowledged",
      orgResourceId: "Organization",
      user: "User",
      comment: "Comment",
      timestampAction: "Action Time",
      platformAction: "Platform Action",
      value_double: "Value (double)",
      value_integer: "Value (integer)",
      value_boolean: "Value (boolean)",
      value_string: "Value (string)",
    },
    widget: {
      identity: "Identity",
      statusSection: "Status",
      timing: "Timing",
      metadata: "Metadata",
      noData: "—",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The alarm ID is malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina Platform API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No access to this alarm.",
      },
      notFound: {
        title: "Not Found",
        description: "Alarm not found.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "The Corvina Platform API returned a server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Success",
      description: "Alarm fetched.",
    },
  },
};
