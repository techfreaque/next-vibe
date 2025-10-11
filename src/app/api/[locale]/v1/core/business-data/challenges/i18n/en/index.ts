/**
 * Business Data Challenges API translations for English
 */

export const translations = {
  category: "Business Data",
  tags: {
    challenges: "Challenges",
    businessData: "Business Data",
    business: "Business",
    update: "Update",
  },

  // GET endpoint translations
  get: {
    title: "Get Business Challenges",
    description: "Retrieve current business challenges and obstacles",
    form: {
      title: "Business Challenges Overview",
      description: "View current business challenges and impact assessment",
    },
    response: {
      title: "Business Challenges Data",
      description: "Current business challenges and completion status",
      currentChallenges: {
        title: "Current challenges",
      },
      marketingChallenges: {
        title: "Marketing challenges",
      },
      operationalChallenges: {
        title: "Operational challenges",
      },
      financialChallenges: {
        title: "Financial challenges",
      },
      technicalChallenges: {
        title: "Technical challenges",
      },
      biggestChallenge: {
        title: "Biggest challenge",
      },
      challengeImpact: {
        title: "Challenge impact",
      },
      previousSolutions: {
        title: "Previous solutions",
      },
      resourceConstraints: {
        title: "Resource constraints",
      },
      budgetConstraints: {
        title: "Budget constraints",
      },
      timeConstraints: {
        title: "Time constraints",
      },
      supportNeeded: {
        title: "Support needed",
      },
      priorityAreas: {
        title: "Priority areas",
      },
      additionalNotes: {
        title: "Additional notes",
      },
      completionStatus: {
        title: "Completion status",
        description: "Business challenges completion status",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description:
          "You don't have permission to access business challenges data",
      },
      validation: {
        title: "Validation Failed",
        description: "Invalid request for business challenges data",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving business challenges",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the business challenges service",
      },
      forbidden: {
        title: "Access Forbidden",
        description:
          "You are not allowed to access this business challenges data",
      },
      notFound: {
        title: "Data Not Found",
        description:
          "The requested business challenges data could not be found",
      },
    },
    success: {
      title: "Challenges Retrieved",
      description: "Business challenges data retrieved successfully",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Business Challenges",
    description: "Update business challenges and constraint information",
    form: {
      title: "Business Challenges Configuration",
      description: "Define and update your business challenges and constraints",
    },
    response: {
      title: "Update Results",
      description: "Business challenges update results and completion status",
      completionStatus: {
        title: "Completion status updated",
        description: "Challenges completion status has been updated",
        isComplete: "Challenges section completed",
        completedFields: "Completed challenges fields",
        totalFields: "Total challenges fields",
        completionPercentage: "Challenges completion percentage",
        missingRequiredFields: "Missing challenges required fields",
      },
    },
    // Form field translations
    currentChallenges: {
      label: "Current Business Challenges",
      description:
        "Describe the main challenges your business is currently facing",
      placeholder:
        "e.g., Low brand awareness, difficulty acquiring customers, competitive market...",
    },
    marketingChallenges: {
      label: "Marketing Challenges",
      description: "Specific challenges related to marketing and promotion",
      placeholder:
        "e.g., Limited reach, high cost per acquisition, low conversion rates...",
    },
    operationalChallenges: {
      label: "Operational Challenges",
      description:
        "Internal operational challenges affecting business performance",
      placeholder:
        "e.g., Process inefficiencies, resource allocation, workflow bottlenecks...",
    },
    financialChallenges: {
      label: "Financial Challenges",
      description: "Financial constraints and monetary challenges",
      placeholder:
        "e.g., Cash flow issues, funding limitations, pricing pressure...",
    },
    technicalChallenges: {
      label: "Technical Challenges",
      description: "Technology-related challenges and technical obstacles",
      placeholder:
        "e.g., Outdated systems, lack of automation, technical debt...",
    },
    biggestChallenge: {
      label: "Biggest Challenge",
      description:
        "The single most significant challenge currently facing your business",
      placeholder:
        "e.g., Customer retention, scaling operations, market penetration...",
    },
    challengeImpact: {
      label: "Challenge Impact",
      description:
        "How these challenges are impacting your business performance",
      placeholder:
        "e.g., Slower growth, reduced profitability, employee burnout...",
    },
    previousSolutions: {
      label: "Previous Solutions Attempted",
      description:
        "Solutions or strategies you've already tried to address these challenges",
      placeholder:
        "e.g., Hired consultants, implemented new software, changed processes...",
    },
    resourceConstraints: {
      label: "Resource Constraints",
      description: "Limitations in human resources or capabilities",
      placeholder: "e.g., Small team, lack of expertise, limited bandwidth...",
    },
    budgetConstraints: {
      label: "Budget Constraints",
      description:
        "Financial limitations affecting your ability to address challenges",
      placeholder: "e.g., Limited marketing budget, cash flow restrictions...",
    },
    timeConstraints: {
      label: "Time Constraints",
      description: "Time limitations and urgency requirements",
      placeholder:
        "e.g., Need quick results, seasonal deadlines, market timing...",
    },
    supportNeeded: {
      label: "Support Needed",
      description:
        "Type of support or assistance you need to overcome these challenges",
      placeholder:
        "e.g., Strategic consulting, technical expertise, additional resources...",
    },
    priorityAreas: {
      label: "Priority Areas",
      description:
        "Areas that need immediate attention or have highest priority",
      placeholder:
        "e.g., Customer acquisition, operational efficiency, cost reduction...",
    },
    painPoints: {
      label: "Pain Points",
      description: "Specific pain points causing difficulties in your business",
      placeholder:
        "e.g., Customer churn, low conversion rates, high operational costs...",
    },
    obstacles: {
      label: "Business Obstacles",
      description:
        "Major obstacles preventing your business from reaching its goals",
      placeholder:
        "e.g., Regulatory hurdles, technology limitations, skill gaps...",
    },
    marketChallenges: {
      label: "Market Challenges",
      description:
        "Challenges related to your market and competitive landscape",
      placeholder:
        "e.g., Market saturation, competitive pressure, changing customer preferences...",
    },
    technologyChallenges: {
      label: "Technology Challenges",
      description:
        "Challenges related to technology and technical infrastructure",
      placeholder:
        "e.g., Legacy systems, integration issues, cybersecurity concerns...",
    },
    additionalNotes: {
      label: "Additional Notes",
      description:
        "Any additional context or details about your business challenges",
      placeholder:
        "Add any other relevant information about your challenges...",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You don't have permission to update business challenges",
      },
      validation: {
        title: "Validation Failed",
        description:
          "Please check the provided business challenges information and try again",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating business challenges",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unexpected error occurred with the business challenges update",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the business challenges service",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You are not allowed to modify business challenges data",
      },
      notFound: {
        title: "Data Not Found",
        description: "The business challenges data could not be found",
      },
      conflict: {
        title: "Data Conflict",
        description:
          "The business challenges data conflicts with existing information",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your business challenges",
      },
    },
    success: {
      title: "Challenges Updated",
      description: "Your business challenges have been updated successfully",
      message: "Business challenges updated successfully",
    },
  },

  // Response field translations
  response: {
    currentChallenges: "Current business challenges",
    marketingChallenges: "Marketing challenges",
    operationalChallenges: "Operational challenges",
    financialChallenges: "Financial challenges",
    technicalChallenges: "Technical challenges",
    biggestChallenge: "Biggest challenge",
    challengeImpact: "Challenge impact",
    previousSolutions: "Previous solutions attempted",
    resourceConstraints: "Resource constraints",
    budgetConstraints: "Budget constraints",
    timeConstraints: "Time constraints",
    supportNeeded: "Support needed",
    priorityAreas: "Priority areas",
    additionalNotes: "Additional notes",
    message: "Response message",
    completionStatus: "Section completion status",
  },

  // Enum translations
  enums: {
    challengeCategory: {
      marketing: "Marketing",
      operations: "Operations",
      financial: "Financial",
      technical: "Technical",
      humanResources: "Human Resources",
      customerService: "Customer Service",
      productDevelopment: "Product Development",
      sales: "Sales",
      strategy: "Strategy",
      compliance: "Compliance",
    },
    challengeSeverity: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },
    resourceConstraint: {
      budget: "Budget",
      time: "Time",
      staff: "Staff",
      skills: "Skills",
      technology: "Technology",
      equipment: "Equipment",
      space: "Space",
      knowledge: "Knowledge",
    },
    supportArea: {
      strategy: "Strategy",
      marketing: "Marketing",
      technology: "Technology",
      operations: "Operations",
      finance: "Finance",
      humanResources: "Human Resources",
      legal: "Legal",
      training: "Training",
      consulting: "Consulting",
      implementation: "Implementation",
    },
  },

  // Individual completion status field translations
  isComplete: "Challenges complete",
  completedFields: "Challenges completed fields",
  totalFields: "Challenges total fields",
  completionPercentage: "Challenges completion percentage",
  missingRequiredFields: "Challenges missing required fields",
};
