export const translations = {
  tags: {
    consent: "Consent",
  },

  get: {
    title: "Uncensored models consent",
    titleShort: "Uncensored consent",
    description:
      "Shows whether this account or guest confirmed being 18+ and accepts unfiltered output from uncensored models. Uncensored models refuse to run until this is confirmed.",
    response: {
      consented: "Confirmed",
      consentedAt: "Confirmed on",
      version: "Consent version",
    },
    success: {
      title: "Consent status loaded",
      description: "Current uncensored-model consent status",
    },
  },

  post: {
    title: "Unlock uncensored models",
    titleShort: "Unlock uncensored",
    description:
      "One-time confirmation for uncensored models: you are 18 or older and accept that they can produce offensive, false, dangerous, illegal or malicious content, with no filter. A human must confirm this, never an AI acting for them.",
    fields: {
      confirm: {
        label: "I am 18+ and I agree",
        description:
          "Set to true to confirm you are 18 or older, accept unfiltered output and take responsibility for how you use it.",
      },
    },
    success: {
      title: "Uncensored models unlocked",
      description: "Your confirmation is saved. You won't be asked again.",
    },
  },

  delete: {
    title: "Withdraw uncensored consent",
    titleShort: "Withdraw consent",
    description:
      "Withdraws the uncensored-model confirmation. Uncensored models stay locked until you confirm again.",
    success: {
      title: "Consent withdrawn",
      description: "Uncensored models are locked again.",
    },
  },

  errors: {
    validation: {
      title: "Confirmation missing",
      description: "Confirm you are 18+ and accept the terms to continue.",
    },
    unauthorized: {
      title: "Not allowed",
      description: "You can't change this consent.",
    },
    forbidden: {
      title: "Forbidden",
      description: "This action is not available here.",
    },
    notFound: {
      title: "Not found",
      description: "No account or guest session found.",
    },
    server: {
      title: "Server error",
      description: "Couldn't save your choice. Try again.",
    },
    network: {
      title: "Network error",
      description: "Server not reachable. Check your connection.",
    },
    unknown: {
      title: "Unknown error",
      description: "Something went wrong. Try again.",
    },
    conflict: {
      title: "Conflict",
      description: "Your consent changed in another tab. Reload.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Confirm or cancel first.",
    },
    noIdentity: "No account or guest session. Reload the page and try again.",
    saveFailed: "Couldn't save your choice. Try again.",
  },

  gate: {
    required:
      "{{model}} is uncensored. One-time confirmation needed: you are 18+ and accept that uncensored models can produce offensive, false, dangerous, illegal or malicious content, unfiltered. A human confirms this in the chat, or runs: vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "{{model}} is uncensored. This account has not confirmed it is 18+ and accepts unfiltered output. Tick the uncensored-models box on the API keys page once, then retry.",
  },

  dialog: {
    eyebrow: "Uncensored models",
    title: "Adults only. No filter.",
    stance:
      "Humans decide what they read. Not a corporation. So we ask you once instead of filtering every answer.",
    modelLine: "You picked {{model}}.",
    pointAge: "I am 18 or older.",
    pointContent:
      "Uncensored models can produce offensive, false, dangerous, illegal or malicious content.",
    pointNoFilter: "Nothing filters it. Not the model, not us.",
    pointResponsible: "I am responsible for how I use what it writes.",
    agree: "I'm 18+ and I agree",
    agreeing: "Saving…",
    pickAnother: "Pick another model",
    close: "Close",
    footnote: "Asked once. Withdraw anytime in settings.",
    saveFailed: "Couldn't save. Try again.",
  },

  widget: {
    title: "Uncensored models",
    statusOn: "Unlocked",
    statusOff: "Locked",
    since: "Confirmed {{date}}",
    onBody:
      "You confirmed you are 18+ and accept unfiltered output. Uncensored models answer without filters.",
    offBody:
      "Uncensored models stay locked until you confirm you are 18+ and accept unfiltered output.",
    outdatedBody:
      "The consent text changed since you confirmed. Confirm again to keep using uncensored models.",
    withdraw: "Withdraw consent",
    withdrawing: "Withdrawing…",
    unlock: "Unlock uncensored models",
    guestNote: "Saved for this browser. Sign up and it moves to your account.",
    loading: "Loading consent…",
    back: "Back",
    menuLabel: "Uncensored models",
    menuOn: "On",
    menuOff: "Off",
  },
};
