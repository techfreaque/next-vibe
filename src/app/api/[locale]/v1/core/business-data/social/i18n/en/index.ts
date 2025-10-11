/**
 * Business Data Social subdomain translations for English
 */

export const translations = {
  category: "Business Data",
  tags: {
    social: "Social Media",
    platforms: "Platforms",
    update: "Update",
  },

  // GET endpoint translations
  get: {
    title: "Get Social Media Data",
    description: "Retrieve social media platform information for the business",
    form: {
      title: "Social Media Data Request",
      description: "Request form for social media data retrieval",
    },
    response: {
      title: "Social Media Response",
      description: "Social media platform data with completion status",
      platforms: "Social media platforms",
      contentStrategy: "Content strategy",
      postingFrequency: "Posting frequency",
      goals: "Social media goals",
      completionStatus: {
        title: "Section completion status",
        description: "Social media completion status information",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request data provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access social media data",
      },
      server: {
        title: "Server Error",
        description:
          "Internal server error occurred while retrieving social media data",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description:
          "Network error occurred while retrieving social media data",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this social media data is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Social media data not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Conflict",
        description:
          "Data conflict occurred while retrieving social media data",
      },
    },
    success: {
      title: "Success",
      description: "Social media data retrieved successfully",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Social Media Data",
    description: "Update social media platform information for the business",
    form: {
      title: "Social Media Update Form",
      description: "Update form for social media platform data",
    },
    platforms: {
      label: "Social Media Platforms",
      description: "List of social media platforms with usernames and settings",
      placeholder: "Add your social media platforms",
    },
    contentStrategy: {
      label: "Content Strategy",
      description: "Social media content strategy and approach",
      placeholder: "Describe your content strategy...",
    },
    postingFrequency: {
      label: "Posting Frequency",
      description: "How often content is posted on social media",
      placeholder: "e.g., Daily, 3 times per week, etc.",
    },
    goals: {
      label: "Social Media Goals",
      description: "Business goals for social media presence",
      placeholder: "e.g., Increase brand awareness, generate leads...",
    },
    response: {
      title: "Update Response",
      description: "Result of social media data update",
      message: "Update status message",
      platforms: "Social media platforms updated",
      contentStrategy: "Content strategy updated",
      postingFrequency: "Posting frequency updated",
      goals: "Social media goals updated",
      completionStatus: {
        title: "Completion status updated",
        description: "Social media completion status has been updated",
        isComplete: "Social update complete",
        completedFields: "Social update completed fields",
        totalFields: "Social update total fields",
        completionPercentage: "Social update completion percentage",
        missingRequiredFields: "Social update missing required fields",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid social media data provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to update social media data",
      },
      server: {
        title: "Server Error",
        description:
          "Internal server error occurred while updating social media data",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while updating social media data",
      },
      forbidden: {
        title: "Forbidden",
        description: "You are not allowed to update social media data",
      },
      notFound: {
        title: "Not Found",
        description: "Social media data not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred while updating social media data",
      },
    },
    additionalNotes: {
      label: "Additional Notes",
      description:
        "Any additional information about your social media strategy",
      placeholder: "Add any other relevant information...",
    },

    success: {
      title: "Success",
      description: "Social media data updated successfully",
      message: "Social media data updated successfully",
    },
  },

  // Individual completion status field translations
  isComplete: "Social complete",
  completedFields: "Social completed fields",
  totalFields: "Social total fields",
  completionPercentage: "Social completion percentage",
  missingRequiredFields: "Social missing required fields",

  // Enum translations
  enums: {
    socialPlatform: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
      youtube: "YouTube",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      discord: "Discord",
      reddit: "Reddit",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      other: "Other",
    },
    platformPriority: {
      high: "High",
      medium: "Medium",
      low: "Low",
    },
  },
};
