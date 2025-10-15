import { translations as avatarTranslations } from "../../avatar/i18n/en";
import { translations as passwordTranslations } from "../../password/i18n/en";

export const translations = {
  // Main user profile routes
  get: {
    title: "Get User Profile",
    description: "Retrieve current user profile information",
    response: {
      title: "User Profile Response",
      description: "Current user profile data",
      user: {
        title: "User Information",
        description: "User profile details",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "User profile not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Profile retrieved successfully",
    },
  },
  update: {
    title: "Update User Profile",
    description: "Update current user profile information",
    groups: {
      basicInfo: {
        title: "Basic Information",
        description: "Update your basic profile information",
      },
      profileDetails: {
        title: "Profile Details",
        description: "Manage your profile details and settings",
      },
      privacySettings: {
        title: "Privacy Settings",
        description: "Control who can see your profile information",
      },
    },
    fields: {
      email: {
        label: "Email Address",
        description: "Your email address",
        placeholder: "Enter your email address",
        help: "Your email address will be used for account notifications and communication",
        validation: {
          invalid: "Please enter a valid email address",
        },
      },
      privateName: {
        label: "Private Name",
        description: "Your internal/private name",
        placeholder: "Enter your private name",
        help: "Your private name is used internally and for private communications",
        validation: {
          minLength: "Private name must be at least 2 characters long",
          maxLength: "Private name cannot exceed 50 characters",
        },
      },
      publicName: {
        label: "Public Name",
        description: "Your public display name",
        placeholder: "Enter your public name",
        help: "Your public name will be visible to other users",
        validation: {
          minLength: "Public name must be at least 2 characters long",
          maxLength: "Public name cannot exceed 50 characters",
        },
      },
      imageUrl: {
        label: "Profile Image",
        description: "URL to your profile image",
        placeholder: "Enter image URL",
        help: "Provide a URL to an image that will be displayed as your profile picture",
        validation: {
          invalid: "Please provide a valid image URL",
        },
      },
      company: {
        label: "Company",
        description: "Your company name",
        placeholder: "Enter your company",
        help: "Your company name will be displayed on your profile",
        validation: {
          maxLength: "Company name cannot exceed 100 characters",
        },
      },
      visibility: {
        label: "Profile Visibility",
        description: "Who can see your profile",
        placeholder: "Select visibility setting",
        help: "Choose who can view your profile: public (everyone), private (only you), or contacts only",
      },
      marketingConsent: {
        label: "Marketing Consent",
        description: "Receive marketing communications",
        placeholder: "Enable marketing emails",
        help: "Choose whether to receive marketing emails and promotional communications",
      },
      bio: {
        label: "Bio",
        description: "A brief description about yourself",
        placeholder: "Tell us about yourself...",
        help: "Share a brief description about yourself that will be visible on your profile",
        validation: {
          maxLength: "Bio cannot exceed 500 characters",
        },
      },
    },
    response: {
      title: "Updated Profile",
      description: "Your updated profile information",
      success: "Update Successful",
      message: "Your profile has been updated successfully",
      user: "Updated User Information",
      changesSummary: {
        title: "Changes Summary",
        description: "Summary of changes made to your profile",
        totalChanges: "Total Changes",
        changedFields: "Changed Fields",
        verificationRequired: "Verification Required",
        lastUpdated: "Last Updated",
      },
      nextSteps: "Next Steps",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "User profile not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Profile updated successfully",
      nextSteps: "Recommended next steps after updating your profile",
    },
  },
  delete: {
    title: "Delete User Account",
    description: "Permanently delete your user account",
    response: {
      title: "Deletion Status",
      description: "Account deletion confirmation",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "User account not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Account deleted successfully",
    },
  },
  put: {
    response: {
      changedFields: {
        item: "Changed Field",
      },
    },
  },
  category: "User Profile",
  tag: "User Profile",
  tags: {
    profile: "profile",
    user: "user",
    account: "account",
  },

  // Sub-routes
  avatar: avatarTranslations,
  password: passwordTranslations,
};
