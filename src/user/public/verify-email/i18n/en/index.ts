export const translations = {
  category: "Account",
  title: "Verify your email",
  titleShort: "Verify email",
  description:
    "Confirm your email address with the link we sent you. Call without a token to resend the link.",
  tag: "verify-email",
  token: {
    label: "Verification token",
    description:
      "From the link in your verification email. Leave empty to resend the email.",
    placeholder: "Token from the email",
  },
  response: {
    verified: "Verified",
    message: "Status",
    email: "Email",
    emailChanged: "Email changed",
  },
  widget: {
    heroTitle: "Confirm your email",
    heroDescription: "One click and your address is verified.",
    confirmButton: "Verify my email",
    confirming: "Verifying...",
    doneTitle: "Email verified",
    doneDescription: "Your address is confirmed. You're all set.",
    resend: "Send me a new link",
    continue: "Continue",
    changedTitle: "Email changed",
    changedDescription:
      "You now log in with {{email}}. Your old address is no longer used.",
  },
  accountChallenge: {
    settings: "Account settings",
    prompt:
      "Enter the six-digit code sent to {{email}}. It works for 30 minutes. You can also confirm with the link in the email and sign in again.",
    mail: "Confirm this email address using the link below. If you’re signing in, you can also enter this code within 30 minutes.",
    notice:
      "Confirm {{email}} before your next sign-in. You can keep using your account now.",
    undeliverable:
      "We couldn’t deliver the email to {{email}}. Check the address in Settings if you’re signed in, or contact support.",
    invalid:
      "That code is incorrect or expired. Check the latest email or request another code.",
    cooldown: "Wait five minutes between email requests.",
    dismiss: "Dismiss",
  },
  creditsPrompt: {
    title: "Confirm your email to unlock your free credits",
    description:
      "Click the link we emailed you and your account gets {{credits}} free credits every month.",
    resend: "Resend link",
    sending: "Sending...",
    sent: "Link sent to {{email}}. Check your spam folder too.",
  },
  email: {
    subject: "Unlock your {{credits}} free credits on {{appName}}",
    title: "Confirm your email",
    previewText:
      "One click confirms your address and switches on your free credits.",
    greeting: "Hi {{name}},",
    body: "Your account is ready. Confirm this address and it gets {{credits}} free credits every month. No card needed.",
    newsletter:
      "This same click also confirms your newsletter subscription: your account gets {{credits}} extra free credits every month while you stay subscribed.",
    button: "Confirm and unlock credits",
    reminder: {
      subject: "Your {{credits}} free credits are still on hold",
      previewText: "One click on the link switches them on.",
      body: "You created your {{appName}} account yesterday, but this address is not confirmed yet. Until it is, your {{credits}} free credits per month stay on hold. One click fixes that.",
    },
    expiry:
      "This link works for {{days}} days. If you didn't create an account, ignore this email.",
    signoff: "The {{appName}} team",
  },
  emailTemplates: {
    name: "Email verification",
    description: "Sent after signup and on request to verify the account email",
    category: "Account",
  },
  errors: {
    emailTaken:
      "Another account uses this address now. Your email was not changed.",
    invalidToken:
      "This verification link is invalid or has expired. Request a new one from Settings.",
    userNotFound: "Account not found.",
    failed: "Could not verify the email.",
    needLogin: "Log in to resend the verification email.",
    validation: {
      title: "Validation error",
      description: "Check your input and try again",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Log in to resend the verification email",
    },
    server: {
      title: "Server error",
      description: "Verification failed due to a server error",
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
    title: "Done",
    description: "Email verification updated",
    verified: "Your email is verified.",
    alreadyVerified: "Your email is already verified.",
    emailChanged: "Done. Your email is now {{email}}.",
    sent: "Verification email sent. Check your inbox.",
  },
};
