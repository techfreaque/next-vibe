import { translations as authTranslations } from "../../auth/i18n/en";
import { translations as privateTranslations } from "../../private/i18n/en";
import { translations as publicTranslations } from "../../public/i18n/en";
import { translations as searchTranslations } from "../../search/i18n/en";
import { translations as userRolesTranslations } from "../../user-roles/i18n/en";

export const translations = {
  "category": "User Management",
  "auth": authTranslations,
  "private": privateTranslations,
  "public": publicTranslations,
  "search": searchTranslations,
  "userRoles": userRolesTranslations,
  "profileVisibility": {
    public: "Public",
    private: "Private",
    contactsOnly: "Contacts Only",
  },
  "contactMethods": {
    email: "Email",
    phone: "Phone",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  "theme": {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  "userDetailLevel": {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Complete",
  },
  "language": {
    en: "English",
    de: "German",
    pl: "Polish",
  },
  "timezone": {
    utc: "UTC",
    america_new_york: "America/New_York",
    america_los_angeles: "America/Los_Angeles",
    europe_london: "Europe/London",
    europe_berlin: "Europe/Berlin",
    europe_warsaw: "Europe/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  "errors": {
    emailAlreadyInUse: "Email address is already in use",
  },
  "notifications": {
    profileUpdated: {
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    },
    updateFailed: {
      title: "Update Failed",
      description: "Failed to update your profile. Please try again.",
    },
  },
  "session-cleanup": {
    errors: {
      execution_failed: {
        title: "Execution Failed",
        description: "Session cleanup execution failed",
      },
      invalid_batch_size: {
        title: "Invalid Batch Size",
        description: "Batch size parameter is invalid",
      },
      invalid_session_retention: {
        title: "Invalid Session Retention",
        description: "Session retention parameter is invalid",
      },
      invalid_token_retention: {
        title: "Invalid Token Retention",
        description: "Token retention parameter is invalid",
      },
      partial_failure: {
        title: "Partial Failure",
        description: "Session cleanup partially failed",
      },
      validation_failed: {
        title: "Validation Failed",
        description: "Session cleanup validation failed",
      },
      unknown_error: {
        title: "Unknown Error",
        description: "An unknown error occurred during session cleanup",
      },
    },
  },
};
