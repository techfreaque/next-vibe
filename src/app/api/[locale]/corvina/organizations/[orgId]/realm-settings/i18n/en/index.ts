export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    realmSettings: "Realm Settings",
  },
  get: {
    title: "Get Realm Settings",
    description:
      "Fetches the realm configuration depth settings for an organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    response: {
      configDealerMaxDepth: "Dealer Max Depth",
      configHostnameMaxDepth: "Hostname Max Depth",
      configOwnResourcesMaxDepth: "Own Resources Max Depth",
      configIotMaxDepth: "IoT Max Depth",
      configVpnMaxDepth: "VPN Max Depth",
      configStoreMaxDepth: "Store Max Depth",
      configIpFilteringMaxDepth: "IP Filtering Max Depth",
      configPrivateAccessMaxDepth: "Private Access Max Depth",
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
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No access to realm settings.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID.",
      },
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
    success: {
      title: "Success",
      description: "Realm settings fetched successfully.",
    },
  },
  put: {
    title: "Update Realm Settings",
    description:
      "Updates the realm configuration depth settings for an organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    configDealerMaxDepth: {
      label: "Dealer Max Depth",
      description: "Maximum depth for dealer hierarchy.",
    },
    configHostnameMaxDepth: {
      label: "Hostname Max Depth",
      description: "Maximum depth for hostname hierarchy.",
    },
    configOwnResourcesMaxDepth: {
      label: "Own Resources Max Depth",
      description: "Maximum depth for own resources.",
    },
    configIotMaxDepth: {
      label: "IoT Max Depth",
      description: "Maximum depth for IoT devices.",
    },
    configVpnMaxDepth: {
      label: "VPN Max Depth",
      description: "Maximum depth for VPN configuration.",
    },
    configStoreMaxDepth: {
      label: "Store Max Depth",
      description: "Maximum depth for store hierarchy.",
    },
    configIpFilteringMaxDepth: {
      label: "IP Filtering Max Depth",
      description: "Maximum depth for IP filtering rules.",
    },
    configPrivateAccessMaxDepth: {
      label: "Private Access Max Depth",
      description: "Maximum depth for private access.",
    },
    response: {
      configDealerMaxDepth: "Dealer Max Depth",
      configHostnameMaxDepth: "Hostname Max Depth",
      configOwnResourcesMaxDepth: "Own Resources Max Depth",
      configIotMaxDepth: "IoT Max Depth",
      configVpnMaxDepth: "VPN Max Depth",
      configStoreMaxDepth: "Store Max Depth",
      configIpFilteringMaxDepth: "IP Filtering Max Depth",
      configPrivateAccessMaxDepth: "Private Access Max Depth",
    },
    submitButton: { label: "Save settings", loadingText: "Saving…" },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update.",
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
        description: "No write access to realm settings.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID.",
      },
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
    success: {
      title: "Saved",
      description: "Realm settings updated successfully.",
    },
  },
};
