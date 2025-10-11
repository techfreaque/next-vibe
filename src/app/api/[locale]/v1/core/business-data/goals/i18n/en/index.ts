export const translations = {
  category: "Business Data",
  tags: {
    goals: "Goals",
    objectives: "Objectives",
    update: "Update",
  },

  // Completion status field translations
  isComplete: "Goals complete",
  completedFields: "Completed fields",
  totalFields: "Total fields",
  completionPercentage: "Completion percentage",
  missingRequiredFields: "Missing required fields",

  // GET endpoint translations
  get: {
    title: "Get Goals",
    description: "Retrieve business goals and objectives",

    form: {
      title: "Goals Request",
      description: "Request to retrieve business goals",
    },

    response: {
      title: "Business Goals",
      description: "Your business goals and objectives",
      primaryGoals: {
        title: "Primary business goals",
      },
      budgetRange: {
        title: "Budget range",
      },
      shortTermGoals: {
        title: "Short-term goals",
      },
      longTermGoals: {
        title: "Long-term goals",
      },
      revenueGoals: {
        title: "Revenue goals",
      },
      growthGoals: {
        title: "Growth goals",
      },
      marketingGoals: {
        title: "Marketing goals",
      },
      successMetrics: {
        title: "Success metrics",
      },
      priorities: {
        title: "Business priorities",
      },
      timeline: {
        title: "Timeline and milestones",
      },
      additionalNotes: {
        title: "Additional notes",
      },
      completionStatus: {
        title: "Section completion status",
        description: "Shows the completion progress of your goals section",
      },
    },

    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You are not authorized to access these goals",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters for goals",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving goals",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to retrieve goals",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You do not have permission to view these goals",
      },
      notFound: {
        title: "Goals Not Found",
        description: "No goals found for this user",
      },
      conflict: {
        title: "Data Conflict",
        description: "Goals data conflicts with existing information",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your goals",
      },
    },

    success: {
      title: "Goals Retrieved",
      description: "Successfully retrieved business goals",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Goals",
    description: "Update business goals and objectives",

    form: {
      title: "Update Goals",
      description: "Update your business goals and objectives",
    },

    response: {
      title: "Updated Goals",
      description: "Your goals have been updated successfully",
      message: {
        title: "Update Message",
        description: "Status message for the update",
      },
      primaryGoals: {
        title: "Primary goals updated",
      },
      budgetRange: {
        title: "Budget range updated",
      },
      shortTermGoals: {
        title: "Short-term goals updated",
      },
      longTermGoals: {
        title: "Long-term goals updated",
      },
      revenueGoals: {
        title: "Revenue goals updated",
      },
      growthGoals: {
        title: "Growth goals updated",
      },
      marketingGoals: {
        title: "Marketing goals updated",
      },
      successMetrics: {
        title: "Success metrics updated",
      },
      priorities: {
        title: "Priorities updated",
      },
      timeline: {
        title: "Timeline updated",
      },
      additionalNotes: {
        title: "Additional notes updated",
      },
      completionStatus: {
        title: "Completion status updated",
        description: "Goals completion status has been updated",
      },
    },

    // Field labels and descriptions
    primaryGoals: {
      label: "Primary Goals",
      description: "Select your main business objectives",
      placeholder: "Choose your primary goals",
    },

    budgetRange: {
      label: "Budget Range",
      description: "Your available budget for achieving these goals",
      placeholder: "e.g., $10,000 - $50,000",
    },

    shortTermGoals: {
      label: "Short-term Goals (6 months)",
      description: "What you want to achieve in the next 6 months",
      placeholder: "Describe your short-term objectives...",
    },

    longTermGoals: {
      label: "Long-term Goals (1-2 years)",
      description: "Your vision for the next 1-2 years",
      placeholder: "Describe your long-term vision...",
    },

    revenueGoals: {
      label: "Revenue Goals",
      description: "Your revenue targets and financial objectives",
      placeholder: "e.g., Increase revenue by 30%",
    },

    growthGoals: {
      label: "Growth Goals",
      description: "Business expansion and growth targets",
      placeholder: "e.g., Expand to 3 new markets",
    },

    marketingGoals: {
      label: "Marketing Goals",
      description: "Marketing and brand awareness objectives",
      placeholder: "e.g., Double social media following",
    },

    successMetrics: {
      label: "Success Metrics",
      description: "How you'll measure success",
      placeholder: "e.g., Monthly active users, conversion rate",
    },

    priorities: {
      label: "Priorities",
      description: "Your top priorities in order of importance",
      placeholder: "List your priorities...",
    },

    timeline: {
      label: "Timeline",
      description: "Key milestones and deadlines",
      placeholder: "e.g., Q1: Launch new product, Q2: Expand team",
    },

    additionalNotes: {
      label: "Additional Notes",
      description: "Any other goals or considerations",
      placeholder: "Add any additional information...",
    },

    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to update these goals",
      },
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      server: {
        title: "Server Error",
        description: "Failed to update goals",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while updating",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to update goals",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You do not have permission to update these goals",
      },
      notFound: {
        title: "Not Found",
        description: "Goals record not found",
      },
      conflict: {
        title: "Conflict",
        description: "Goals update conflicts with existing data",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your goals",
      },
    },

    success: {
      title: "Goals Updated",
      description: "Your goals have been updated successfully",
      message: "Goals saved",
    },
  },

  // Enum translations
  enums: {
    businessGoal: {
      increaseRevenue: "Increase Revenue",
      growCustomerBase: "Grow Customer Base",
      improveBrandAwareness: "Improve Brand Awareness",
      enhanceCustomerEngagement: "Enhance Customer Engagement",
      expandMarketReach: "Expand Market Reach",
      optimizeOperations: "Optimize Operations",
      launchNewProducts: "Launch New Products",
      improveCustomerRetention: "Improve Customer Retention",
      reduceCosts: "Reduce Costs",
      digitalTransformation: "Digital Transformation",
      improveOnlinePresence: "Improve Online Presence",
      generateLeads: "Generate Leads",
    },
    goalCategory: {
      revenue: "Revenue",
      growth: "Growth",
      marketing: "Marketing",
      operations: "Operations",
      customer: "Customer",
      product: "Product",
      team: "Team",
      brand: "Brand",
      efficiency: "Efficiency",
      expansion: "Expansion",
    },
    goalTimeframe: {
      shortTerm: "Short Term (0-6 months)",
      mediumTerm: "Medium Term (6-12 months)",
      longTerm: "Long Term (1+ years)",
      ongoing: "Ongoing",
    },
    goalPriority: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },
    metricType: {
      revenue: "Revenue",
      customers: "Customers",
      traffic: "Traffic",
      conversions: "Conversions",
      engagement: "Engagement",
      retention: "Retention",
      satisfaction: "Satisfaction",
      efficiency: "Efficiency",
      reach: "Reach",
      brandAwareness: "Brand Awareness",
    },
  },
};
