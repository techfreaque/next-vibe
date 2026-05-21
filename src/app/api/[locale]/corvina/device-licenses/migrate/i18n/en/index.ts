export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  post: {
    title: "Migrate Device License",
    description:
      "Migrates a device license to a new realm. Master realm admin only.",
    oldActivationKeyId: {
      label: "Old Activation Key ID",
      description: "The ID of the activation key to migrate.",
      placeholder: "42",
    },
    newRealm: {
      label: "New Realm",
      description: "The realm to migrate the license to.",
      placeholder: "master",
    },
    response: {
      id: "ID",
      logicalId: "Logical ID",
      serialNumber: "Serial Number",
      clientName: "Client Name",
      orgResourceId: "Org Resource ID",
      activationKey: "Activation Key",
      fromDateVpn: "VPN From",
      toDateVpn: "VPN To",
      activationDate: "Activated",
      vpnValidityMonths: "VPN Validity (months)",
      numOfSecondsAutoRenewVpn: "Auto-Renew Seconds",
      used: "Used",
      deleted: "Deleted",
    },
    widget: {
      title: "Migrate License",
      back: "Back",
    },
    submitButton: {
      label: "Migrate License",
      loadingText: "Migrating...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description:
          "The request is invalid. Check oldActivationKeyId and newRealm.",
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
        description: "Master realm admin access required.",
      },
      notFound: {
        title: "Not Found",
        description: "Device license or activation key not found.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
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
      title: "License Migrated",
      description: "Device license migrated to the new realm successfully.",
    },
  },
};
