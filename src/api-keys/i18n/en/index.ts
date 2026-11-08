export const translations = {
  category: "Account",

  widget: {
    upgradeTitle: "API access is a paid feature",
    upgradeBody:
      "Subscribe or buy a credit pack to unlock API keys and the OpenAI-compatible /v1 endpoint. Free-tier accounts can still read the docs.",
    upgradeCta: "Upgrade to unlock",
    docsLink: "Read the API docs",
    back: "Back",
    loading: "Loading API keys…",
    intro:
      "Call {{modelCount}} models from your own code. OpenAI-compatible. Billed against your credits at the same price as chat.",
    baseUrlTitle: "Base URL",
    baseUrlHint: "Point any OpenAI SDK here and use a key below.",
    exampleTitle: "Example",
    copy: "Copy",
    copied: "Copied",
    keysTitle: "Your keys",
    empty: "No API keys yet",
    emptyHint: "Create one to start calling the API.",
    nameLabel: "Key name",
    namePlaceholder: "e.g. Production backend",
    create: "Create key",
    creating: "Creating…",
    createFailed: "Couldn't create the key. Try again.",
    newKeyTitle: "Copy your key now",
    newKeyHint:
      "This is the only time the full key is shown. We store a hash, not the key. Lose it and you have to create a new one.",
    dismiss: "I saved it",
    lastUsed: "Last used",
    neverUsed: "Never used",
    created: "Created",
    revoke: "Revoke",
    revoking: "Revoking…",
    revokeFailed: "Couldn't revoke that key. Try again.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Created {{created}} · {{rate}}",
    keyPlaceholder: "sk-unb-YOUR_KEY",
    rateLimit: "{{n}} req/min",
    billingNote:
      "Out of credits returns HTTP 402. Streaming is supported (stream: true).",
  },

  list: {
    title: "API keys",
    titleShort: "API keys",
    description:
      "Create and revoke keys for the OpenAI-compatible API. Shows the base URL and your keys.",
    tag: "API",
    response: {
      baseUrl: "Base URL",
      isPaid: "Paid plan",
      keys: "Keys",
    },
    success: {
      title: "API keys loaded",
      description: "Your API keys have been retrieved",
    },
  },

  create: {
    title: "Create API key",
    titleShort: "New key",
    description:
      "Create a key for the OpenAI-compatible API. The full key is returned once.",
    tag: "API",
    form: {
      name: "Key name",
      namePlaceholder: "What is this key for?",
    },
    response: {
      key: "API key (shown once)",
      id: "Key ID",
      keyPrefix: "Key prefix",
    },
    success: {
      title: "Key created",
      description: "Copy the key now. It won't be shown again.",
    },
    errors: {
      paidRequired:
        "The API is for paid plans. Subscribe or buy credits to create API keys.",
      limit: "You already have {{max}} active keys. Revoke one first.",
    },
  },

  revoke: {
    title: "Revoke API key",
    titleShort: "Revoke",
    description: "Permanently disable an API key. Calls using it fail at once.",
    tag: "API",
    response: {
      message: "Key revoked. Calls using it now fail.",
    },
    success: {
      title: "Key revoked",
      description: "The API key can no longer be used",
    },
    errors: {
      notFound: {
        detail: "No active key with that ID on your account.",
      },
    },
  },

  errors: {
    validation: { title: "Validation error", description: "Invalid request" },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    server: {
      title: "Server error",
      description: "Internal server error",
      detail: "API key request failed: {{error}}",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    network: { title: "Network error", description: "Network error occurred" },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not found", description: "API key not found" },
    conflict: {
      title: "Conflict",
      description: "Request conflicts with state",
    },
  },
};
