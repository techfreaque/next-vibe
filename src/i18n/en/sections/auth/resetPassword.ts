export const resetPasswordTranslations = {
  title: "Reset Your Password",
  subtitle: "We'll send you an email with a link to reset your password",
  emailLabel: "Email Address",
  emailPlaceholder: "Enter your email",
  sendResetLink: "Send Reset Link",
  backToLogin: "Back to login",
  successTitle: "Check Your Email",
  successMessage:
    "If an account exists with this email, we've sent password reset instructions.",
  createNewPasswordTitle: "Create New Password",
  createNewPasswordSubtitle: "Enter your new password below",
  newPasswordLabel: "New Password",
  newPasswordPlaceholder: "Enter new password",
  confirmNewPasswordLabel: "Confirm New Password",
  confirmNewPasswordPlaceholder: "Confirm new password",
  confirmPasswordPlaceholder: "Confirm your password",
  resetPasswordButton: "Reset Password",
  passwordTips: {
    title: "Create a Secure Password",
    description:
      "Use a strong password that's at least 8 characters long with a mix of letters, numbers, and symbols.",
  },
  passwordResetSuccessTitle: "Password Reset Successfully",
  passwordResetSuccessMessage:
    "Your password has been reset. You can now sign in with your new password.",
  signInNowButton: "Sign In Now",
  requestNewLink: "Request New Reset Link",
  email: {
    subject: "Password Reset for {{appName}}",
    title: "Password Reset for {{appName}}",
    previewText: "Reset your password for {{appName}}",
    greeting: "Hello {{firstName}},",
    requestInfo: "You requested a password reset for your {{appName}} account.",
    instructions: "Click the button below to reset your password:",
    buttonText: "Reset Password",
    expirationInfo: "This link will expire in 24 hours for security reasons.",
  },
  success: {
    title: "Password Reset Successful",
    password_reset:
      "Your password has been reset successfully. You can now sign in with your new password.",
  },
  emailSent: "Password reset email has been sent",
  errors: {
    title: "Password Reset Failed",
    emailRequired: "Email is required",
    invalidEmail: "Please enter a valid email address",
    invalidToken: "The password reset link is invalid or has expired",
    tokenExpired: "The password reset link has expired",
    passwordRequired: "Password is required",
    passwordTooShort: "Password must be at least 8 characters",
    passwordRequirements:
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    passwords_do_not_match: "Passwords do not match",
    confirm_failed: "Failed to reset password: {{error}}",
    loadingError: "Error loading reset password page",
    unexpected: "An unexpected error occurred",
    serverError: "An error occurred. Please try again later.",
  },
  instructions: {
    title: "Password Reset Instructions",
    description:
      "Enter your email address and we'll send you a link to reset your password.",
  },
  confirmEmail: {
    subject: "Password Reset Confirmation for {{appName}}",
    title: "Password Reset Confirmation for {{appName}}",
    previewText: "Your password for {{appName}} has been reset successfully.",
    greeting: "Hello {{firstName}},",
    successMessage:
      "Your password for {{appName}} has been reset successfully.",
    loginInstructions: "You can now log in with your new password.",
    securityWarning:
      "If you did not request this password reset, please contact our support team immediately.",
    securityTip:
      "For security reasons, we recommend changing your password regularly and using a unique password for each service.",
  },
};
