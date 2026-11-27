export const translations = {
  meta: {
    title: "Install {{appName}}",
    description:
      "Local installation progress and optional GitHub repository setup.",
  },
  enums: {
    stepStatus: {
      done: "Ready",
      inProgress: "Running",
      pending: "Waiting",
      skipped: "Skipped",
      error: "Needs attention",
    },
    action: {
      refresh: "Re-check status",
      githubAuthStart: "Sign in with GitHub",
      githubAuthCheck: "Check GitHub sign-in",
      githubCreatePrivateRepo: "Create private repository",
      githubSkip: "Skip GitHub setup",
      githubReset: "Set up GitHub",
    },
    checkoutMode: {
      cloned: "Fresh clone",
      existing: "Existing checkout kept",
      unknown: "Local checkout",
    },
  },
  get: {
    title: "Installer Status",
    titleShort: "Installer",
    description:
      "Inspect local installation progress, checkout state and optional GitHub repository setup.",
    tags: {
      installer: "Installer",
    },
    success: {
      title: "Status Loaded",
      description: "Local installation status retrieved.",
    },
    response: {
      installDir: { title: "Install directory" },
      os: { title: "Operating system" },
      arch: { title: "Architecture" },
      checkoutMode: { title: "Checkout mode" },
      branch: { title: "Git branch" },
      originUrl: { title: "Origin remote" },
      upstreamUrl: { title: "Upstream remote" },
      port: { title: "Local port" },
      stateFilePath: { title: "State file" },
      updatedAt: { title: "Last updated" },
      lastError: { title: "Last error" },
      steps: { title: "Installation steps" },
      github: { title: "GitHub status" },
      setup: { title: "Setup status" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid installer status request.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required.",
      },
      forbidden: {
        title: "Local Only",
        description:
          "The installer is only available on a local first-run instance.",
      },
      notFound: {
        title: "Not Found",
        description: "Installer state not found.",
      },
      network: {
        title: "Network Error",
        description: "Network request failed.",
      },
      server: {
        title: "Server Error",
        description: "Could not read local installer status.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred.",
      },
      unsavedChanges: {
        title: "Conflict",
        description: "State changed while reading.",
      },
      conflict: {
        title: "Conflict",
        description: "Installer state conflict.",
      },
    },
  },
  post: {
    title: "Run Installer Action",
    titleShort: "Installer Action",
    description:
      "Refresh local checks or manage optional private GitHub repository setup.",
    tags: {
      installer: "Installer",
    },
    request: {
      action: {
        label: "Action",
        description: "Installer action to execute.",
      },
      repoName: {
        label: "Private repository name",
        description: "Repository name under your GitHub account.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Action result" },
    },
    success: {
      title: "Action Completed",
      description: "Installer action completed.",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid action or repository name.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required.",
      },
      forbidden: {
        title: "Local Only",
        description:
          "Installer actions are only available on a local first-run instance.",
      },
      notFound: {
        title: "Not Found",
        description: "Required local tool was not found.",
      },
      network: {
        title: "Network Error",
        description:
          "Could not reach GitHub. Check your connection and try again.",
      },
      server: {
        title: "Server Error",
        description: "Installer action failed.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred.",
      },
      unsavedChanges: {
        title: "Conflict",
        description: "State changed during action.",
      },
      conflict: {
        title: "Repository Exists",
        description: "A GitHub repository conflict occurred.",
      },
    },
  },
  errors: {
    localOnly: "The installer is only available on a local first-run instance.",
    invalidRepoName:
      "Use letters, numbers, dots, dashes or underscores (max 100 characters).",
    ghNotInstalled:
      "GitHub CLI (gh) is not installed on this machine. Use the manual steps below or skip.",
    ghAuthStartFailed:
      "Could not start GitHub device sign-in. Run 'gh auth login --web' in your terminal or use the manual steps.",
    ghNotSignedIn: "Sign in to GitHub first, then try again.",
    ghCreateFailed:
      "Could not create or push to the private GitHub repository. Check your GitHub permissions and try again.",
  },
  actions: {
    refreshed: "Environment checks refreshed.",
    githubAuthPending:
      "Enter the one-time code on GitHub, then click Check sign-in.",
    githubAuthReady: "Signed in to GitHub as {{username}}.",
    githubAuthWaiting: "Waiting for GitHub sign-in to finish in your browser.",
    githubRepoCreated: "Private repository connected and pushed.",
    githubSkipped: "GitHub setup skipped. You can connect a repository later.",
    githubReset: "GitHub setup reopened.",
  },
  widget: {
    progressOf: "{{done}} of {{total}} steps ready",
    title: "Your local install is ready.",
    titleIncomplete: "Finish your local install",
    subtitle:
      "Your machine is set up and running next-vibe locally. Optionally connect a private GitHub repository, then continue to the setup wizard.",
    subtitleIncomplete:
      "Review the steps below, fix any highlighted item, then continue to the setup wizard.",
    checkoutLabel: "Folder",
    stateFileLabel: "State file",
    recheck: "Re-check",
    rechecking: "Checking...",
    copy: "Copy",
    copied: "Copied",
    steps: {
      git: {
        title: "Git",
        missingDetail: "Git was not found on PATH.",
        missingRecovery:
          "Install git, open a new terminal, and re-run the installer.",
      },
      bun: {
        title: "Bun runtime",
        missingDetail: "Bun was not found on PATH.",
        missingRecovery:
          "Install Bun from https://bun.sh and re-run the installer.",
      },
      clone: {
        title: "next-vibe checkout",
        clonedDetail: "Cloned into {{dir}}",
        existingDetail: "Existing checkout preserved at {{dir}}",
        unknownDetail: "Running from {{dir}}",
      },
      dependencies: {
        title: "Dependencies and CLI",
        readyDetail: "Packages installed and vibe CLI ready.",
        missingDetail: "node_modules is incomplete.",
        missingRecovery: "Run 'bun install' inside your checkout folder.",
      },
      github: {
        title: "Private GitHub repository",
        optionalTag: "Optional",
        connectedDetail: "Origin points to {{url}}",
        skippedDetail: "Skipped for now. Updates still pull from next-vibe.",
        pendingDetail: "Optional. Keep your own private copy on GitHub.",
      },
      server: {
        title: "Local server",
        readyDetail: "Listening on http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Private GitHub repository",
      badge: "Optional",
      body: "Create your own private repository so your custom code and changes stay private on GitHub, while keeping upstream next-vibe for updates.",
      connectedTitle: "Private repository connected",
      connectedOpen: "Open on GitHub",
      skippedNotice:
        "GitHub setup skipped. You can connect a private repository any time later.",
      reopenButton: "Set up GitHub",
      skipButton: "Skip for now",
      signedInAs: "Signed in to GitHub as {{username}}",
      repoNameLabel: "Private repository name",
      repoNameHelp:
        "Created as a private repository under your GitHub account. Upstream stays linked to next-vibe.",
      createButton: "Create private repository",
      creatingButton: "Creating and pushing...",
      signInButton: "Sign in with GitHub",
      startingSignIn: "Starting sign-in...",
      deviceTitle: "Approve sign-in on GitHub",
      deviceBody:
        "Copy the one-time code below, open the GitHub device page, and approve access. No tokens are stored by this page.",
      deviceOpenLink: "Open GitHub device page",
      deviceCheckButton: "I signed in, check again",
      manualTitle: "Manual setup (no GitHub CLI needed)",
      manualBody:
        "GitHub CLI (gh) is not installed. Create an empty private repository on GitHub, then run these three commands in your checkout folder.",
      manualNewRepoLink: "Create a private repository on GitHub",
      manualShowCommands: "Show git commands",
      manualHideCommands: "Hide git commands",
    },
    handover: {
      continueToSetup: "Continue to setup wizard",
      openApp: "Open app",
      hint: "Next: set your admin login and connect your unbottled.ai account or API keys.",
      completeHint: "Initial setup is already complete on this instance.",
    },
  },
};
