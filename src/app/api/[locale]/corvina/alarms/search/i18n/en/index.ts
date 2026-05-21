export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarms" },
  post: {
    title: "Search Alarms",
    description: "Search and filter active alarms across all Corvina devices.",
    filter: {
      label: "Filter",
      description: "OData-style filter query to narrow alarm results.",
      placeholder: "e.g. severity gt 3",
    },
    page: {
      label: "Page",
      description: "Page number (0-based).",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of alarms per page.",
    },
    orderBy: {
      label: "Sort By",
      description: "Field to sort results by.",
    },
    orderDir: {
      label: "Sort Direction",
      description: "Ascending or descending order.",
    },
    scopedOrganization: {
      label: "Organization",
      description: "Limit results to a specific organization resource ID.",
      placeholder: "e.g. exorde.connex.acme",
    },
    deviceName: {
      label: "Device Name",
      description: "Filter alarms by device name.",
      placeholder: "e.g. my-device",
    },
    deviceGroups: {
      label: "Device Groups",
      description: "Comma-separated list of device groups to filter by.",
      placeholder: "e.g. group1,group2",
    },
    response: {
      alarms: {
        id: "ID",
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
        realmId: "Realm",
      },
      totalElements: "Total",
      totalPages: "Pages",
      last: "Last Page",
    },
    widget: {
      title: "Alarms",
      noAlarmsFound: "No alarms found.",
      filterPlaceholder: "Filter alarms…",
      back: "Back",
    },
    enums: {
      alarmStatus: {
        active: "Active",
        notActive: "Inactive",
      },
      alarmAction: {
        ack: "Acknowledged",
        noAck: "Unacknowledged",
      },
      alarmActionType: {
        ack: "Acknowledge",
        reset: "Reset",
        clear: "Clear",
      },
      bulkAlarmActionType: {
        ackAll: "Acknowledge All",
        resetAll: "Reset All",
        clearAll: "Clear All",
      },
      alarmOrderBy: {
        eventTimestamp: "Event Time",
        updatedAt: "Updated At",
        severity: "Severity",
      },
      alarmOrderDir: {
        asc: "Ascending",
        desc: "Descending",
      },
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The search request was malformed.",
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
        description: "No access to alarm search.",
      },
      notFound: {
        title: "Not Found",
        description: "Alarm search endpoint not found.",
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
      description: "Alarms fetched.",
    },
  },
};
