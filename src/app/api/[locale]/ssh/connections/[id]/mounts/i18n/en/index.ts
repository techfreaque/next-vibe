export const translations = {
  category: "SSH",

  errors: {
    noRowReturned: "No row returned from insert",
    notYourConnection: "This connection does not belong to you",
    mountNotFound: "Mount not found",
  },

  list: {
    title: "Mounted Directories",
    titleShort: "Mounts",
    description:
      "Named directory shortcuts for this connection. Each mount appears as /ssh/<connection>/<name>/ in cortex. Terminals start in the default mount directory.",
    fields: {
      connectionId: {
        label: "Connection",
        description: "The SSH connection these mounts belong to",
      },
    },
    response: {
      mounts: { title: "Mounts" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the input and try again",
      },
      unauthorized: { title: "Unauthorized", description: "Login required" },
      forbidden: { title: "Forbidden", description: "Access denied" },
      server: { title: "Server Error", description: "Failed to load mounts" },
      notFound: { title: "Not Found", description: "Connection not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Mount name already exists on this connection",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
    },
    success: {
      title: "Mounts Loaded",
      description: "Directory mounts for this connection",
    },
  },

  create: {
    title: "Add Mount",
    titleShort: "Add Mount",
    description:
      "Add a named directory shortcut. The name becomes a path segment: /ssh/<connection>/<name>/",
    fields: {
      connectionId: {
        label: "Connection ID",
        description: "The SSH connection to add the mount to",
      },
      path: {
        label: "Directory Path",
        description:
          "Absolute path on the machine, e.g. /home/max/project. Cortex segment = basename. The terminal's default cwd when this is the default mount.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Default Mount",
        description:
          "New terminal sessions start in this directory. Only one mount can be default per connection.",
      },
    },
    response: {
      id: { title: "Mount ID" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the form fields and try again",
      },
      unauthorized: { title: "Unauthorized", description: "Login required" },
      forbidden: { title: "Forbidden", description: "Access denied" },
      server: {
        title: "Server Error",
        description: "Failed to save the mount",
      },
      notFound: { title: "Not Found", description: "Connection not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Name Taken",
        description: "A mount with this name already exists on this connection",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
    },
    success: {
      title: "Mount Added",
      description: "Directory mount added successfully",
    },
  },

  detail: {
    titleGet: "Mount",
    titleShortGet: "Mount",
    descriptionGet: "View a mounted directory shortcut.",
    titlePatch: "Edit Mount",
    titleShortPatch: "Edit Mount",
    descriptionPatch: "Rename or move a mounted directory shortcut.",
    titleDelete: "Remove Mount",
    titleShortDelete: "Remove Mount",
    descriptionDelete:
      "Remove a directory mount shortcut from this connection.",
    fields: {
      mountId: {
        label: "Mount ID",
        description: "Unique identifier of this mount",
      },
      path: {
        label: "Directory Path",
        description: "Absolute path on the machine. Cortex segment = basename.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Default Mount",
        description: "New terminal sessions start in this directory",
      },
    },
    response: {
      id: { title: "Mount ID" },
      name: { title: "Name" },
      path: { title: "Path" },
      isDefault: { title: "Default" },
      createdAt: { title: "Created" },
      updatedAt: { title: "Updated" },
      deleted: { title: "Deleted" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the input and try again",
      },
      unauthorized: { title: "Unauthorized", description: "Login required" },
      forbidden: { title: "Forbidden", description: "Access denied" },
      server: { title: "Server Error", description: "Failed to update mount" },
      notFound: { title: "Not Found", description: "Mount not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Name Taken",
        description: "A mount with this name already exists on this connection",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
    },
    successGet: { title: "Mount Loaded", description: "Mount details" },
    successPatch: {
      title: "Mount Updated",
      description: "Mount updated successfully",
    },
    successDelete: {
      title: "Mount Removed",
      description: "Mount removed successfully",
    },
    widget: {
      confirmDelete: "Remove this mount?",
    },
  },

  widget: {
    noMounts: "No mounts configured",
    noMountsHint:
      "Add a mount to create a directory shortcut. Terminals will start in the default mount directory.",
    addMount: "Add Mount",
    defaultBadge: "default",
    cortexPath: "Cortex path",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
