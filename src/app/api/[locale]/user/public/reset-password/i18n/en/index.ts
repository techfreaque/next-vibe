import { translations as confirmTranslations } from "../../confirm/i18n/en";
import { translations as requestTranslations } from "../../request/i18n/en";
import { translations as validateTranslations } from "../../validate/i18n/en";

export const translations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
  errors: {
    tokenValidationFailed: "Token validation failed",
    userLookupFailed: "Failed to lookup user",
    tokenDeletionFailed: "Failed to delete token",
    userDeletionFailed: "Failed to delete user",
    resetFailed: "Password reset failed",
    tokenCreationFailed: "Failed to create reset token",
    noDataReturned: "No data returned from database",
    tokenInvalid: "Reset token is invalid",
    tokenExpired: "Reset token has expired",
    tokenVerificationFailed: "Token verification failed",
    userNotFound: "User not found",
    passwordUpdateFailed: "Failed to update password",
    passwordResetFailed: "Password reset failed",
    requestFailed: "Reset request failed",
    emailMismatch: "Email does not match",
    confirmationFailed: "Password reset confirmation failed",
  },
};
