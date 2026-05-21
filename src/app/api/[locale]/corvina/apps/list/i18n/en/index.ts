export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    apps: "Apps",
  },
  get: {
    title: "App Marketplace",
    description:
      "Browse all available applications in the Corvina marketplace.",
    response: {
      title: "Applications",
      description: "All apps available in the marketplace.",
      apps: {
        title: "Apps",
        description: "One row per marketplace app.",
        id: "ID",
        key: "Key",
        name: "Name",
        appDescription: "Description",
        status: "Status",
        coverImageUrl: "Cover",
        iconUrl: "Icon",
        version: "Version",
      },
      total: "Total",
      totalPages: "Pages",
      currentPage: "Current Page",
    },
    widget: {
      title: "Corvina App Marketplace",
      noAppsFound: "No apps found in the marketplace",
      back: "Back",
      install: "Install",
      search: "Search apps...",
      installedApps: "Installed Apps",
      installApp: "Install Custom",
    },
    enums: {
      appStoreStatus: {
        active: "Active",
        underEvaluation: "Under Evaluation",
      },
      installStatus: {
        installation: "Installing",
        installed: "Installed",
        installationFailed: "Installation Failed",
        uninstallation: "Uninstalling",
        uninstalled: "Uninstalled",
        uninstallationFailed: "Uninstall Failed",
        manualUpgradable: "Upgrade Available",
        freeTrial: "Free Trial",
        paymentRequired: "Payment Required",
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
        description: "Corvina rejected the API key. Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description: "The API key lacks scope to list apps.",
      },
      notFound: {
        title: "Not Found",
        description: "No apps found at this path.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict while listing apps.",
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
      description: "Apps fetched successfully.",
    },
  },
};
