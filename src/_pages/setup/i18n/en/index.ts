export const translations = {
  meta: {
    title: "Set up {{appName}}",
    description: "First-run setup for your self-hosted instance.",
  },
  stepOf: "Step {{current}} of {{total}}",
  steps: {
    admin: "Admin login",
    ai: "Connect AI",
    extras: "Extras",
    done: "Done",
  },
  back: "Back",
  continue: "Continue",
  getKey: "Get a key",
  secretSaved: "Saved. Leave empty to keep it.",
  errors: {
    saveFailed:
      "Could not save. Check the terminal running vibe dev and try again.",
  },
  restart: {
    title: "Applying your settings",
    body: "Your instance restarts to load them. This page reloads by itself in a few seconds.",
    slow: "Taking longer than usual?",
    reload: "Reload page",
    manualTitle: "Saved",
    manualBody:
      "Restart the server to apply the new settings. You can keep going in the meantime.",
    continue: "Continue",
  },
  welcome: {
    title: "Your instance is running.",
    body: "Lock it down with your own admin login, connect an AI and you're chatting. Takes two minutes.",
    inProgress:
      "Setup has started on this instance. Sign in as admin to finish it.",
    failed:
      "The built-in admin login did not work. If you already changed it, sign in with your own.",
    start: "Start setup",
    starting: "Starting",
    signIn: "Sign in as admin",
  },
  readOnly: {
    title: "Settings are read-only here",
    body: "This instance takes its settings from the deployment environment, so this page cannot save them. Set them where you deploy, then restart.",
  },
  admin: {
    title: "Create your admin login",
    body: "Replaces the built-in default login. You use it to sign in here and in the vibe CLI.",
    email: "Email",
    emailHelp: "Your sign-in name. Nothing gets sent to it.",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordHelp: "At least 8 characters. Stored encrypted on this machine.",
    confirm: "Repeat password",
    save: "Save and continue",
    errors: {
      email: "Enter a valid email address.",
      passwordShort: "Use at least 8 characters.",
      passwordDefault: "Pick your own password, not the default one.",
      mismatch: "The passwords do not match.",
    },
  },
  ai: {
    title: "Connect AI",
    body: "Choose where the models come from. One option is enough. Add more any time.",
    byo: "Or bring your own keys",
    moreProviders: "More providers",
    skip: "Skip for now",
    unbottled: {
      title: "Your unbottled.ai account",
      recommended: "Recommended",
      body: "One sign-in unlocks every model on unbottled.ai: mainstream, open and uncensored. Usage runs on your unbottled.ai credits. No provider keys to manage.",
      email: "unbottled.ai email",
      password: "unbottled.ai password",
      advanced: "Advanced",
      serverUrl: "Server URL",
      serverUrlHelp: "Change it only to connect another next-vibe instance.",
      failed: "Sign-in failed. Check your email and password.",
      connect: "Connect account",
      connecting: "Connecting",
      connected: "Connected to {{url}}",
      unhealthy: "Connection saved, but the server does not answer right now.",
      disconnect: "Disconnect",
      noAccount: "No account yet?",
      createAccount: "Create one",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Detected",
      missingBadge: "Not installed",
      detected:
        "Found on this machine. Claude models run on your Claude subscription. Nothing to enter.",
      missing:
        "Install the claude CLI and sign in to use your Claude subscription. Restart vibe dev afterwards.",
    },
  },
  fields: {
    openRouter: {
      label: "OpenRouter API key",
      help: "Hundreds of models behind one key.",
    },
    venice: {
      label: "Venice AI API key",
      help: "Private, uncensored models.",
    },
    nanoGpt: {
      label: "NanoGPT API key",
      help: "Uncensored and abliterated models. Pay with crypto.",
    },
    openAi: {
      label: "OpenAI API key",
      help: "Image generation with the gpt-image models.",
    },
    smtpHost: {
      label: "SMTP server",
      help: "Your mail server, like smtp.example.com.",
    },
    smtpPort: { label: "Port", help: "Usually 587, or 465 with TLS." },
    smtpSecure: {
      label: "Use TLS",
      help: "Turn on for port 465.",
    },
    smtpUser: { label: "Username", help: "Usually your full email address." },
    smtpPass: {
      label: "Password",
      help: "Gmail and most big providers want an app password here.",
    },
    smtpFromEmail: {
      label: "Sender address",
      help: "Emails arrive from this address.",
    },
    smtpFromName: {
      label: "Sender name",
      help: "Shown as the sender, like your instance name.",
    },
    stripeSecret: {
      label: "Secret key",
      help: "Starts with sk_. Test keys work too.",
    },
    stripePublishable: {
      label: "Publishable key",
      help: "Starts with pk_.",
    },
    stripeWebhook: {
      label: "Webhook signing secret",
      help: "Starts with whsec_. Confirms payments reached your instance.",
    },
    storageType: {
      label: "Where files live",
      help: "Uploads, images and audio from your chats.",
      optionFilesystem: "This machine",
      optionS3: "S3 compatible storage",
    },
    s3Endpoint: {
      label: "Endpoint URL",
      help: "Your provider's S3 endpoint, like https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Region",
      help: "Like us-east-1. Some providers take auto.",
    },
    s3Bucket: { label: "Bucket", help: "The bucket has to exist already." },
    s3AccessKey: {
      label: "Access key ID",
      help: "From the access keys page of your storage provider.",
    },
    s3SecretKey: {
      label: "Secret access key",
      help: "Shown once when you create the access key.",
    },
    s3PublicUrl: {
      label: "Public URL",
      help: "Optional. A CDN or public bucket address for file links.",
    },
  },
  extras: {
    title: "Optional extras",
    body: "None of this is needed to chat. Skip it and come back when you need it.",
    configured: "Set up",
    finish: "Finish setup",
    skipFinish: "Skip and finish",
    errors: {
      s3Incomplete:
        "S3 storage needs the endpoint, region, bucket and both keys.",
    },
    sections: {
      email: {
        title: "Email",
        body: "Sign-up confirmations and password resets through your SMTP server.",
      },
      payments: {
        title: "Payments",
        body: "Sell credits and subscriptions with Stripe.",
      },
      storage: {
        title: "File storage",
        body: "Chat files stay on this machine unless you pick S3.",
      },
    },
  },
  done: {
    title: "You're set.",
    body: "Your instance is configured and belongs to you.",
    admin: "Admin login: {{email}}",
    aiUnbottled: "AI: your unbottled.ai account",
    aiKeys: "AI: your own provider keys",
    aiClaude: "AI: Claude Code on this machine",
    aiNone:
      "No AI connected yet. Chat needs one provider. Add it any time in the admin settings.",
    start: "Start chatting",
    later: "Everything here can be changed later in the admin settings.",
  },
};
