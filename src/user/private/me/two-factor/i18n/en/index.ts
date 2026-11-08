export const translations = {
  category: "User Profile",
  title: "Two-factor authentication",
  titleShort: "Two-factor",
  description:
    "Protect your account with a one-time code from an authenticator app. Set up, disable, or regenerate recovery codes.",
  tag: "two-factor",
  enums: {
    action: {
      status: "Status",
      setup: "Start setup",
      enable: "Confirm and enable",
      disable: "Disable",
      regenerate: "Regenerate recovery codes",
    },
  },
  fields: {
    action: {
      label: "Action",
      description:
        "status, setup, enable, disable or regenerate. Setup returns a secret, then enable confirms it with a code.",
    },
    code: {
      label: "Authentication code",
      description:
        "6-digit code from your authenticator app, or a recovery code.",
      placeholder: "123456",
    },
    password: {
      label: "Password",
      description:
        "Your account password (alternative to a code for disabling).",
      placeholder: "Your password",
    },
  },
  response: {
    enabled: "Two-factor enabled",
    message: "Status",
    recoveryCodesRemaining: "Recovery codes left",
    otpauthUri: "Authenticator URI",
    secret: "Secret key",
    qrDataUri: "QR code",
    recoveryCodes: "Recovery codes",
  },
  widget: {
    back: "Back",
    statusOn: "On",
    statusOff: "Off",
    offIntro:
      "Add a second step to sign-in. Even with your password, nobody gets in without the code from your phone.",
    startSetup: "Set up two-factor",
    setupStep1:
      "1. Scan this QR code with an authenticator app (Google Authenticator, Aegis, 1Password, Authy).",
    setupStep2: "Can't scan? Enter this key manually:",
    setupStep3: "2. Enter the 6-digit code the app shows to confirm.",
    confirm: "Confirm and turn on",
    confirming: "Confirming...",
    cancelSetup: "Cancel",
    onIntro:
      "Sign-in asks for a code from your authenticator app. Recovery codes left: {{count}}.",
    recoveryTitle: "Save your recovery codes",
    recoveryHint:
      "Each code works once if you lose your phone. They are shown only now. Store them somewhere safe.",
    recoveryCopy: "Copy codes",
    recoveryCopied: "Copied",
    recoveryDone: "I saved them",
    manageTitle: "Manage",
    manageHint:
      "Enter a current authenticator code (or a recovery code) to change settings.",
    regenerate: "Regenerate recovery codes",
    disable: "Turn off two-factor",
    disablePasswordHint: "Or confirm with your password instead:",
    working: "Working...",
  },
  errors: {
    notConfigured:
      "Two-factor needs a server key (JWT_SECRET_KEY) and it is not set.",
    alreadyEnabled:
      "Two-factor is already enabled. Disable it first to re-run setup.",
    notEnabled: "Two-factor is not enabled.",
    noPendingSetup: "No setup in progress. Start setup first.",
    codeRequired: "Enter the 6-digit code.",
    invalidCode:
      "That code is not valid. Check the time on your phone and try again.",
    credentialRequired:
      "Enter a current code, a recovery code, or your password.",
    invalidPassword: "Wrong password.",
    tooManyAttempts:
      "Too many wrong attempts. Wait a few minutes and try again.",
    userNotFound: "Account not found.",
    failed: "Could not update two-factor settings.",
    validation: {
      title: "Validation error",
      description: "Check your input and try again",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in to manage two-factor",
    },
    server: {
      title: "Server error",
      description: "Two-factor could not be updated",
    },
    unknown: {
      title: "Unknown error",
      description: "An unexpected error occurred",
    },
    network: {
      title: "Network error",
      description: "Network connection failed",
    },
    forbidden: {
      title: "Access forbidden",
      description: "You don't have permission to do this",
    },
    notFound: {
      title: "Not found",
      description: "Account could not be found",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred",
    },
  },
  success: {
    title: "Two-factor updated",
    description: "Your two-factor settings were saved",
    status: "Two-factor status loaded.",
    setupStarted: "Scan the QR code, then confirm with a code to turn it on.",
    enabled:
      "Two-factor is on. Save your recovery codes now - they are shown only once.",
    disabled: "Two-factor is off.",
    regenerated: "New recovery codes generated. The old ones no longer work.",
  },
};
