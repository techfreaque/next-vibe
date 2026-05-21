export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  delete: {
    title: "Delete Device",
    description: "Permanently removes a device from a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: { label: "Device ID", description: "Numeric Corvina device ID." },
    widget: {
      confirm: "Delete device",
      cancel: "Cancel",
      warning: "This cannot be undone.",
      deleted: "Device deleted.",
      deletedMcp: "Device deleted successfully.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No delete access to this device.",
      },
      notFound: { title: "Not Found", description: "Device not found." },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
    success: { title: "Deleted", description: "Device removed successfully." },
  },
};
