import { translations as requestTranslations } from "@/app/api/[locale]/user/public/reset-password/request/i18n/en";
import { translations as tokenTranslations } from "../../[token]/i18n/en";

export const translations = {
  request: requestTranslations,
  token: tokenTranslations,
  meta: {
    passwordReset: {
      title: "Reset Password - {{appName}}",
      description: "Reset your {{appName}} account password",
      category: "Authentication",
      imageAlt: "Password Reset",
      keywords: "reset password, forgot password, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      title: "Reset Your Password",
      subtitle: "Enter your email address and we'll send you a reset link",
      sendResetLink: "Send Reset Link",
      backToLogin: "Back to Login",
      emailSent: "Email Sent!",
      successTitle: "Check Your Email",
      successMessage:
        "We've sent you a password reset link. Please check your inbox.",
      requestNewLink: "Request New Link",
      createNewPasswordTitle: "Create New Password",
      createNewPasswordSubtitle: "Enter your new password below",
      resetPasswordButton: "Reset Password",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Enter your new password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your new password",
      errors: {
        loadingError: "Failed to load reset password form",
      },
    },
  },
};
