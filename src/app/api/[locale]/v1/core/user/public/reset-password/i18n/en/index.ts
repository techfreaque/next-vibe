import { translations as confirmTranslations } from "../../confirm/i18n/en";
import { translations as requestTranslations } from "../../request/i18n/en";
import { translations as validateTranslations } from "../../validate/i18n/en";

export const translations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
  errors: {
    token_validation_failed: "Token validation failed",
    user_lookup_failed: "Failed to lookup user",
    token_deletion_failed: "Failed to delete token",
    user_deletion_failed: "Failed to delete user",
    reset_failed: "Password reset failed",
    token_creation_failed: "Failed to create reset token",
    no_data_returned: "No data returned from database",
    token_invalid: "Reset token is invalid",
    token_expired: "Reset token has expired",
    token_verification_failed: "Token verification failed",
    user_not_found: "User not found",
    password_update_failed: "Failed to update password",
    password_reset_failed: "Password reset failed",
    request_failed: "Reset request failed",
    email_mismatch: "Email does not match",
    confirmation_failed: "Password reset confirmation failed",
  },
};
