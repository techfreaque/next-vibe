import { translations as authTranslations } from "../../auth/i18n/en";
import { translations as privateTranslations } from "../../private/i18n/en";
import { translations as publicTranslations } from "../../public/i18n/en";
import { translations as searchTranslations } from "../../search/i18n/en";
import { translations as sessionCleanupTranslations } from "../../session-cleanup/i18n/en";
import { translations as userRolesTranslations } from "../../user-roles/i18n/en";

export const translations = {
  category: "User Management",
  auth: authTranslations,
  private: privateTranslations,
  public: publicTranslations,
  search: searchTranslations,
  "session-cleanup": sessionCleanupTranslations,
  userRoles: userRolesTranslations,
  profileVisibility: {
    public: "Public",
    private: "Private",
    contactsOnly: "Contacts Only",
  },
  contactMethods: {
    email: "Email",
    phone: "Phone",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Complete",
  },
  language: {
    en: "English",
    de: "German",
    pl: "Polish",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "America/New_York",
    america_los_angeles: "America/Los_Angeles",
    europe_london: "Europe/London",
    europe_berlin: "Europe/Berlin",
    europe_warsaw: "Europe/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "Email address is already in use",
    locale_required: "Locale is required",
    auth_required: "Authentication is required",
    auth_retrieval_failed: "Failed to retrieve authentication",
    not_found: "User not found",
    roles_lookup_failed: "Failed to lookup user roles",
    id_lookup_failed: "Failed to lookup user by ID",
    email_lookup_failed: "Failed to lookup user by email",
    email_check_failed: "Failed to check email",
    email_duplicate_check_failed: "Failed to check for duplicate email",
    search_failed: "Failed to search users",
    email_already_in_use: "Email address is already in use",
    creation_failed: "Failed to create user",
    no_data_returned: "No data returned from database",
    password_hashing_failed: "Failed to hash password",
  },
  notifications: {
    profileUpdated: {
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    },
    updateFailed: {
      title: "Update Failed",
      description: "Failed to update your profile. Please try again.",
    },
  },
};
