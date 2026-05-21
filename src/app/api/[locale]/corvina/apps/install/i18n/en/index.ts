export const translations = {
  tags: {
    corvina: "Corvina",
    apps: "Apps",
  },
  post: {
    title: "Install Corvina App",
    description:
      "Install an application into a Corvina organization via manifest or store app ID.",
    organizationId: {
      label: "Organization ID",
      description: "Numeric ID of the target Corvina organization.",
      placeholder: "45511",
    },
    manifest: {
      label: "App Manifest (JSON)",
      description:
        "Paste the full corvina-manifest.json content. Ignored when App ID is set.",
      placeholder:
        '{"key": "my-app", "name": {"value": "My App"}, "baseUrl": "https://..."}',
    },
    appId: {
      label: "App ID (optional)",
      description: "Use an existing store app instead of a custom manifest.",
      placeholder: "123",
    },
    planId: {
      label: "Plan ID (optional)",
      description: "Payment plan ID for paid apps.",
      placeholder: "planId1",
    },
    submitButton: {
      label: "Install App",
      loadingText: "Installing...",
    },
    response: {
      title: "Installation Result",
      description: "Details of the installed application.",
      id: "Install ID",
      status: "Status",
      appKey: "App Key",
      appName: "App Name",
      serviceAccountUsername: "Service Account",
      createdAt: "Installed At",
      manifestFrom: "Source",
    },
    widget: {
      title: "Install Corvina App",
      manifestLabel: "App Manifest",
      jsonPlaceholder: "Paste your corvina-manifest.json content here",
      success: "App installed successfully",
      errorDetail:
        "Installation failed — check the manifest structure and org ID.",
      resultTitle: "Installation initiated",
      appLabel: "App",
      statusLabel: "Status",
      serviceAccountLabel: "Service account",
      installIdLabel: "Install ID",
      installedAtLabel: "Installed at",
      appStore: "App Store",
      installedApps: "Installed Apps",
    },
    errors: {
      validation: {
        title: "Invalid Manifest",
        description: "The manifest JSON is invalid or missing required fields.",
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
        description: "The API key lacks permission to install apps.",
      },
      notFound: { title: "Not Found", description: "Organization not found." },
      conflict: {
        title: "Already Installed",
        description: "This app is already installed in the organization.",
      },
      server: {
        title: "Server Error",
        description:
          "Corvina returned a server error. Check manifest structure.",
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
      title: "App Installed",
      description: "The application was installed successfully.",
    },
  },
};
