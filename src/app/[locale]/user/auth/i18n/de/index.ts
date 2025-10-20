// Import signup translations from subdirectory
import { translations as signupTranslations } from "../../signup/i18n/en";

// Inline translations from common.ts
const commonTranslations = {
  passwordStrength: {
    label: "Password strength",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
    suggestion:
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
  },
  userRoles: {
    public: "Public",
    customer: "Customer",
    courier: "Courier",
    partnerAdmin: "Partner Admin",
    partnerEmployee: "Partner Employee",
    admin: "Admin",
  },
};

// Inline translations from errors.ts
const errorsTranslations = {
  jwt_signing_failed: "Failed to create authentication token",
  token_expired: "Authentication token has expired",
  invalid_token_signature: "Invalid authentication token signature",
  token_verification_failed: "Failed to verify authentication token: {{error}}",
  missing_token: "Authentication token is missing",
  session_retrieval_failed: "Failed to retrieve session information",
  cookie_set_failed: "Failed to set authentication cookies",
  cookie_clear_failed: "Failed to clear authentication cookies",
  jwt_payload_missing_id: "JWT payload is missing user ID",
  invalid_session: "The session is invalid or expired",
  missing_request_context: "Request context is missing",
  unsupported_platform: "Platform is not supported",
  email_send_failed: "Failed to send email",
  validation_failed: "Validation failed",
};

// Inline translations from login.ts
const loginTranslations = {
  title: "Welcome Back",
  subtitle: "Sign in to your account",
  emailLabel: "Email Address",
  emailPlaceholder: "Enter your email",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  forgotPassword: "Forgot password?",
  rememberMe: "Remember me",
  signInButton: "Sign In",
  orContinueWith: "Or continue with",
  doNotHaveAccount: "Don't have an account?",
  createAccount: "Create an account",
  providers: {
    google: "Google",
    github: "Github",
    facebook: "Facebook",
  },
  errors: {
    title: "Login Failed",
    unknown: "An unknown error occurred",
    invalid_credentials: "Invalid email or password. Please try again.",
    accountLocked: "Your account has been temporarily locked!",
    accountLockedDescription:
      "Too many failed login attempts. Please try again later.",
    two_factor_required:
      "Two-factor authentication is required. Please check your email or authentication app.",
    serverError: "An error occurred. Please try again later.",
    token_save_failed: "Failed to save authentication token. Please try again.",
  },
  success: {
    title: "Login Successful",
    description: "Welcome back to your account",
  },
};

// Inline translations from logout.ts
const logoutTranslations = {
  confirmationTitle: "Sign Out",
  confirmationMessage: "Are you sure you want to sign out?",
  confirmButton: "Yes, sign out",
  cancelButton: "Cancel",
  successMessage: "You have been signed out successfully",
  logoutFailed: "Logout failed, error: {{error}}",
  success: {
    title: "Logged Out",
    description: "You have been successfully logged out",
  },
};

// Inline translations from profile.ts
const profileTranslations = {
  profileUpdated: "Profile updated successfully",
  errorUpdatingProfile: "Error updating profile",
  failedToLoadProfile: "Failed to load profile information",
};

// Inline translations from reset.ts
const resetTranslations = {
  errors: {
    user_not_found: "User not found",
    confirmation_failed: "Password reset confirmation failed",
    token_lookup_failed: "Failed to lookup reset token",
    token_validation_failed: "Failed to validate reset token",
    user_lookup_failed: "Failed to lookup user for reset",
    token_deletion_failed: "Failed to delete reset token",
    user_deletion_failed: "Failed to delete user reset tokens",
    token_invalid: "Invalid reset token",
    token_verification_failed: "Failed to verify reset token",
    token_creation_failed: "Failed to create reset token",
    password_update_failed: "Failed to update password",
    password_reset_failed: "Failed to reset password",
    request_failed: "Failed to process reset request",
    token_expired: "Reset token has expired",
    email_mismatch: "Email does not match reset token",
  },
};

// Inline translations from resetPassword.ts
const resetPasswordTranslations = {
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

// Inline translations from resetPasswordConfirm.ts
const resetPasswordConfirmTranslations = {
  validatingToken: "Validating your password reset link...",
  invalidToken: "Invalid Reset Link",
  tokenExpiredOrInvalid: "The password reset link is invalid or has expired.",
  requestNewLink: "Request a new password reset link",
  resetPasswordFor: "Reset Password For",
  email: "Email Address",
  newPassword: "New Password",
  confirmPassword: "Confirm Password",
  resetting: "Resetting password...",
  resetPassword: "Reset Password",
  rememberedPassword: "Remembered your password?",
  backToLogin: "Back to login",
};

// Inline translations from session.ts
const sessionTranslations = {
  sessionExpired: "Your session has expired",
  loginAgain: "Please sign in again to continue",
  sessionExpiring: "Your session is about to expire",
  stayLoggedIn: "Stay logged in",
  loggingOut: "You will be logged out in {seconds} seconds",
  errors: {
    session_not_found: "Session not found or expired",
    invalid_token: "Invalid session token",
    expired: "Session has expired",
    already_expired: "Session already expired",
    user_mismatch: "Session belongs to another user",
    unauthorized: "Unauthorized session access",
  },
};

// Inline translations from twoFactor.ts
const twoFactorTranslations = {
  title: "Two-Factor Authentication",
  subtitle: "Enter the verification code sent to your device",
  codeLabel: "Verification Code",
  codePlaceholder: "Enter 6-digit code",
  verifyButton: "Verify",
  resendCode: "Resend code",
  backToLogin: "Back to login",
  setupTitle: "Set Up Two-Factor Authentication",
  setupInstructions: "Scan the QR code with your authenticator app",
  enterCodeInstructions: "Enter the code shown in your authenticator app",
  enableTwoFactorButton: "Enable Two-Factor Authentication",
  disableTwoFactorButton: "Disable Two-Factor Authentication",
  twoFactorEnabled: "Two-factor authentication is enabled",
  twoFactorDisabled: "Two-factor authentication is disabled",
};

// Inline translations from verification.ts
const verificationTranslations = {
  emailVerificationNeeded: "Please verify your email address",
  verificationSent: "A verification email has been sent to your email address",
  verificationInstructions:
    "Please check your inbox and follow the instructions to verify your account",
  resendVerification: "Resend verification email",
  verificationSuccess: "Your email has been successfully verified",
  verificationFailed: "Email verification failed",
  verificationExpired: "The verification link has expired",
  verifyingEmail: "Verifying your email address...",
};

// Auth client translations
const authClientTranslations = {
  errors: {
    status_save_failed:
      "Authentifizierungsstatus konnte nicht gespeichert werden",
    status_remove_failed:
      "Authentifizierungsstatus konnte nicht entfernt werden",
    status_check_failed:
      "Authentifizierungsstatus konnte nicht überprüft werden",
    token_save_failed:
      "Authentifizierungs-Token konnte nicht gespeichert werden",
  },
};

export const translations = {
  common: commonTranslations,
  errors: errorsTranslations,
  authClient: authClientTranslations,
  login: loginTranslations,
  logout: logoutTranslations,
  profile: profileTranslations,
  reset: resetTranslations,
  resetPassword: resetPasswordTranslations,
  resetPasswordConfirm: resetPasswordConfirmTranslations,
  session: sessionTranslations,
  signup: signupTranslations,
  twoFactor: twoFactorTranslations,
  verification: verificationTranslations,
};
