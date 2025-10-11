import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  // Main onboarding route translations
  get: {
    title: "Get Onboarding Status",
    description: "Retrieve current user onboarding information",
    form: {
      title: "Onboarding Information",
      description: "View your current onboarding progress",
    },
    response: {
      title: "Onboarding Response",
      description: "Current onboarding status and progress",
      userId: {
        content: "User ID",
      },
      completedSteps: {
        content: "Completed Steps",
      },
      currentStep: {
        content: "Current Step",
      },
      isCompleted: {
        content: "Is Completed",
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
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  post: {
    title: "Update Onboarding",
    description: "Update user onboarding information",
    form: {
      title: "Update Onboarding",
      description: "Update your onboarding progress",
    },
    completedSteps: {
      label: "Completed Steps",
      description: "Steps that have been completed",
      placeholder: "Select completed steps",
    },
    currentStep: {
      label: "Current Step",
      description: "Current step in the onboarding process",
      placeholder: "Select current step",
    },
    isCompleted: {
      label: "Is Completed",
      description: "Whether onboarding is complete",
    },
    response: {
      title: "Update Response",
      description: "Onboarding update response",
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
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Onboarding updated successfully",
    },
  },
  put: {
    title: "Complete Onboarding",
    description: "Complete the user onboarding process",
    form: {
      title: "Complete Onboarding",
      description: "Finalize your onboarding progress",
    },
    completedSteps: {
      label: "Completed Steps",
      description: "All steps that have been completed",
      placeholder: "Select completed steps",
    },
    currentStep: {
      label: "Current Step",
      description: "Final step in the onboarding process",
      placeholder: "Select current step",
    },
    isCompleted: {
      label: "Is Completed",
      description: "Mark onboarding as complete",
    },
    response: {
      title: "Completion Response",
      description: "Onboarding completion response",
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
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Onboarding replaced successfully",
    },
  },
  category: "Onboarding",
  tags: {
    onboarding: "onboarding",
    status: "status",
    update: "update",
  },
  enums: {
    onboardingStatus: {
      notStarted: "Not Started",
      inProgress: "In Progress",
      completed: "Completed",
      skipped: "Skipped",
    },
    onboardingStep: {
      questions: "Questions",
      pricing: "Pricing",
      consultation: "Consultation",
      complete: "Complete",
    },
    businessType: {
      startup: "Startup",
      smallBusiness: "Small Business",
      mediumBusiness: "Medium Business",
      enterprise: "Enterprise",
      agency: "Agency",
      freelancer: "Freelancer",
      nonProfit: "Non-Profit",
      other: "Other",
    },
    goalType: {
      brandAwareness: "Brand Awareness",
      leadGeneration: "Lead Generation",
      customerEngagement: "Customer Engagement",
      salesGrowth: "Sales Growth",
      contentCreation: "Content Creation",
      communityBuilding: "Community Building",
      reputationManagement: "Reputation Management",
      analyticsInsights: "Analytics Insights",
    },
    completedStep: {
      businessData: "Business Data",
      planSelection: "Plan Selection",
      consultation: "Consultation",
    },
  },

  // Global error translations referenced in repository
  errors: {
    authenticationRequired: {
      title: "Authentication Required",
      description: "You must be authenticated to access this resource",
    },
    dataFetchFailed: {
      title: "Data Fetch Failed",
      description: "Failed to retrieve onboarding data from the database",
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You don't have permission to access this resource",
    },
    unexpected: {
      title: "Unexpected Error",
      description: "An unexpected error occurred while processing your request",
    },
    notFound: {
      title: "Onboarding Not Found",
      description: "No onboarding record found for this user",
    },
    paymentProcessingFailed: {
      title: "Payment Processing Failed",
      description: "Failed to process payment during onboarding",
    },
    paymentUrlMissing: {
      title: "Payment URL Missing",
      description: "Payment URL was not provided by the payment processor",
    },
    consultationRequestFailed: {
      title: "Consultation Request Failed",
      description: "Failed to create consultation request during onboarding",
    },
  },

  // Sub-routes
  status: statusTranslations,
};
