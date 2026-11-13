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
  },
  email: {
    subject: "Confirm your email for {{appName}}",
    title: "Confirm your email",
    previewText: "One click to verify your {{appName}} address",
    greeting: "Hi {{name}},",
    body: "Confirm this address so we can reach you about your account, credits and security.",
    newsletter:
      "This same click also confirms your newsletter subscription: your account gets {{credits}} extra free credits every month while you stay subscribed.",
    button: "Verify my email",
    expiry:
      "This link works for {{days}} days. If you didn't create an account, ignore this email.",
    signoff: "- {{appName}}",
  },
  emailTemplates: {
    name: "Email verification",
    description: "Sent after signup and on request to verify the account email",
    category: "Account",
  },
  errors: {
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
    sent: "Verification email sent. Check your inbox.",
  },
};
