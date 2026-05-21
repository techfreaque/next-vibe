export const translations = {
  tags: {
    corvina: "Corvina",
    apps: "Apps",
  },
  get: {
    title: "Installed Apps",
    description: "View all apps installed in a Corvina organization.",
    organizationId: {
      label: "Organization ID",
      description: "Numeric ID of the Corvina organization.",
    },
    response: {
      title: "Installed Apps",
      description: "Apps installed in the organization.",
      installs: {
        title: "Installations",
        description: "One row per installed app.",
        id: "Install ID",
        status: "Status",
        appKey: "App Key",
        appName: "App Name",
        manifestFrom: "Source",
        planId: "Plan",
        autoRenewActive: "Auto-Renew",
        freeTrial: "Trial",
        serviceAccountUsername: "Service Account",
        createdAt: "Installed At",
        updatedAt: "Updated At",
      },
      total: "Total",
      totalPages: "Pages",
      currentPage: "Current Page",
    },
    widget: {
      title: "Installed Apps",
      noInstallsFound: "No apps installed in this organization",
      back: "Back",
      uninstall: "Uninstall",
      loadButton: "Load",
      trialBadge: "Free Trial",
      autoRenewBadge: "Auto-renew",
      orgLabel: "org",
      orgIdPlaceholder: "Organization ID",
      appStore: "App Store",
      installApp: "Install Custom",
      source: {
        store: "Store",
        custom: "Custom",
      },
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "The API key lacks scope to list installed apps.",
      },
      notFound: { title: "Not Found", description: "Organization not found." },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "The Corvina API returned an internal server error.",
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
      description: "Installed apps fetched successfully.",
    },
  },
};
