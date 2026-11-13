export const translations = {
  category: "Account",

  widget: {
    upgradeTitle: "API access is a paid feature",
    upgradeBody:
      "Subscribe or buy a credit pack to unlock API keys. One key runs your own code, Codex CLI, Claude Code and every OpenAI-compatible tool. Free-tier accounts can still read the docs.",
    upgradeCta: "Upgrade to unlock",
    docsLink: "Read the API docs",
    back: "Back",
    loading: "Loading API keys…",
    intro:
      "Call {{modelCount}} models from your code and your coding agent. OpenAI and Anthropic formats. Billed against your credits at the same price as chat.",
    baseUrlTitle: "Base URL",
    baseUrlHint: "OpenAI SDKs, Codex, OpenCode, Continue, Aider, Cline.",
    anthropicBaseUrlTitle: "Anthropic base URL",
    anthropicBaseUrlHint:
      "Claude Code and Anthropic SDKs. Same URL without /v1: they add /v1/messages themselves.",
    setupTitle: "Connect a tool",
    setupKeyFilled:
      "Your new key is already in every block. Copy, paste, run. After you dismiss it, the blocks go back to the placeholder.",
    setupKeyMissing:
      "Blocks show {{placeholder}}. Create a key and they fill in with it.",
    copy: "Copy",
    copied: "Copied",
    keysTitle: "Your keys",
    empty: "No API keys yet",
    emptyHint: "Create one to start calling the API.",
    nameLabel: "Key name",
    namePlaceholder: "e.g. Claude Code laptop",
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
    rateLimit: "{{n}} req/min",
    uncensoredLabel: "Allow uncensored models on my keys",
    uncensoredHint:
      "I am 18+ and accept that uncensored models can produce offensive, false, dangerous, illegal or malicious content, unfiltered. I am responsible for how I use it. Without this, uncensored model ids return HTTP 403.",
    uncensoredFailed: "Couldn't save. Try again.",
    billingNote:
      "Out of credits returns HTTP 402. Streaming works on every endpoint.",
  },

  codingTools: {
    blocks: {
      oneCommand: "One command",
      config: "Permanent setup",
      run: "Then start it",
      fields: "Settings",
      check: "Check your key",
      request: "First request",
    },
    tested: "Tested with {{name}} {{version}}",
    anyModel:
      "Swap {{model}} for any id from GET /v1/models, like {{examples}}.",
    tools: {
      codex: {
        hint: "Paste the command and Codex runs on unbottled.ai. To keep it, append the block to ~/.codex/config.toml and start Codex with --profile unbottled.",
      },
      claudeCode: {
        hint: "Paste the command and Claude Code runs on unbottled.ai. To keep it, put the same values in the env block of ~/.claude/settings.json, next to what is already there. Drop the model lines and Claude Code runs on our Claude models under the names it already knows.",
      },
      opencode: {
        hint: "Save as opencode.json in your project, or as ~/.config/opencode/opencode.json for every project. Add any model id to the models map.",
      },
      continue: {
        hint: "Runs the Continue CLI. The IDE extension reads ~/.continue/config.yaml: add the same model entry there.",
      },
      aider: {
        hint: "One command. Aider wants openai/ in front of the model id. Name the files to edit after the command, as usual.",
      },
      cline: {
        hint: "Two commands with the Cline CLI: save the provider once, then run cline.",
      },
      openaiCompatible: {
        hint: "Any tool or SDK with a base URL field. OpenAI-style tools take the /v1 URL. Anthropic-style tools take the URL without /v1. Same key, same models.",
      },
      curl: {
        hint: "Prove the key works and list every model id you can call. Then send a first request.",
      },
    },
  },

  list: {
    title: "API keys",
    titleShort: "API keys",
    description:
      "Create and revoke API keys. Shows the base URLs, ready setups for coding tools and your keys.",
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
      "Create a key for the API. Works with OpenAI and Anthropic clients. The full key is returned once.",
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
