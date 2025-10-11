/**
 * Business Data Audience API translations for English
 */

export const translations = {
  category: "Business Data",
  tags: {
    audience: "Audience",
    businessData: "Business Data",
    get: "Get",
    update: "Update",
  },

  // Completion status field translations
  isComplete: "Audience complete",
  completedFields: "Completed fields",
  totalFields: "Total fields",
  completionPercentage: "Completion percentage",
  missingRequiredFields: "Missing required fields",

  // GET endpoint translations
  get: {
    title: "Get Audience Data",
    description: "Retrieve target audience information for the business",
    form: {
      title: "Audience Data Retrieval",
      description: "View current target audience configuration",
    },
    response: {
      title: "Audience Data",
      description: "Target audience information and demographics",
      targetAudience: {
        title: "Target audience description",
      },
      ageRange: {
        title: "Age range demographics",
      },
      gender: {
        title: "Gender demographics",
      },
      location: {
        title: "Geographic location",
      },
      income: {
        title: "Income level",
      },
      interests: {
        title: "Interests and hobbies",
      },
      values: {
        title: "Values and beliefs",
      },
      lifestyle: {
        title: "Lifestyle characteristics",
      },
      onlineBehavior: {
        title: "Online behavior patterns",
      },
      purchaseBehavior: {
        title: "Purchase behavior patterns",
      },
      preferredChannels: {
        title: "Preferred communication channels",
      },
      painPoints: {
        title: "Pain points and challenges",
      },
      motivations: {
        title: "Motivations and drivers",
      },
      additionalNotes: {
        title: "Additional notes",
      },
      completionStatus: {
        title: "Section completion status",
      },
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The audience data request could not be validated",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the audience data service",
      },
      unauthorized: {
        title: "Unauthorized Access",
        description: "You don't have permission to access audience data",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You are not allowed to access this audience data",
      },
      notFound: {
        title: "Data Not Found",
        description: "The requested audience data could not be found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving audience data",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your audience data",
      },
      conflict: {
        title: "Data Conflict",
        description: "The audience data conflicts with existing information",
      },
    },
    success: {
      title: "Audience Data Retrieved",
      description: "Audience data has been retrieved successfully",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Audience Data",
    description: "Update target audience information for the business",
    form: {
      title: "Target Audience Configuration",
      description: "Define and update your target audience characteristics",
    },
    response: {
      title: "Update Results",
      description: "Audience data update results and completion status",
      message: {
        title: "Update Message",
        description: "Status message for the update",
      },
      targetAudience: "Target audience updated",
      ageRange: "Age range updated",
      gender: "Gender demographics updated",
      location: "Geographic location updated",
      income: "Income level updated",
      interests: "Interests updated",
      values: "Values updated",
      lifestyle: "Lifestyle updated",
      onlineBehavior: "Online behavior updated",
      purchaseBehavior: "Purchase behavior updated",
      preferredChannels: "Preferred channels updated",
      painPoints: "Pain points updated",
      motivations: "Motivations updated",
      additionalNotes: "Additional notes updated",
      completionStatus: {
        title: "Completion status updated",
        description: "Audience completion status has been updated",
      },
    },

    // Field labels and descriptions
    targetAudience: {
      label: "Target Audience Description",
      description:
        "Provide a detailed description of your primary target audience",
      placeholder: "e.g., Young professionals aged 25-35 in urban areas...",
    },
    ageRange: {
      label: "Age Range",
      description:
        "Select the age ranges that best represent your target audience",
      placeholder: "Select age ranges...",
    },
    gender: {
      label: "Gender",
      description: "Select the gender demographics of your target audience",
      placeholder: "Select gender demographics...",
    },
    location: {
      label: "Geographic Location",
      description:
        "Describe the geographic location or regions of your target audience",
      placeholder: "e.g., Urban areas in North America, Europe...",
    },
    income: {
      label: "Income Level",
      description:
        "Select the income levels that represent your target audience",
      placeholder: "Select income levels...",
    },
    interests: {
      label: "Interests & Hobbies",
      description: "Describe the interests and hobbies of your target audience",
      placeholder: "e.g., Technology, fitness, travel, cooking...",
    },
    values: {
      label: "Values & Beliefs",
      description:
        "Describe the core values and beliefs of your target audience",
      placeholder: "e.g., Work-life balance, sustainability, family...",
    },
    lifestyle: {
      label: "Lifestyle Characteristics",
      description: "Describe the lifestyle patterns and characteristics",
      placeholder: "e.g., Active, tech-savvy, health-conscious...",
    },
    onlineBehavior: {
      label: "Online Behavior",
      description: "Describe how your audience behaves online",
      placeholder:
        "e.g., Active on social media, mobile-first, researches before buying...",
    },
    purchaseBehavior: {
      label: "Purchase Behavior",
      description:
        "Describe the purchasing patterns and decision-making process",
      placeholder: "e.g., Price-conscious, brand-loyal, impulse buyers...",
    },
    preferredChannels: {
      label: "Preferred Communication Channels",
      description: "Select the communication channels your audience prefers",
      placeholder: "Select preferred channels...",
    },
    painPoints: {
      label: "Pain Points & Challenges",
      description:
        "Describe the main problems and challenges your audience faces",
      placeholder:
        "e.g., Time management, budget constraints, lack of information...",
    },
    motivations: {
      label: "Motivations & Drivers",
      description: "Describe what motivates and drives your audience",
      placeholder:
        "e.g., Career advancement, personal growth, family security...",
    },
    additionalNotes: {
      label: "Additional Notes",
      description:
        "Any additional insights or observations about your target audience",
      placeholder: "Add any other relevant details about your audience...",
    },

    errors: {
      validation: {
        title: "Validation Failed",
        description:
          "Please check the provided audience information and try again",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the audience data service",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You don't have permission to update audience data",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You are not allowed to modify audience data",
      },
      notFound: {
        title: "Not Found",
        description: "Audience data record not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to update audience data",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while updating",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your audience data",
      },
      conflict: {
        title: "Conflict",
        description: "Audience update conflicts with existing data",
      },
    },
    success: {
      title: "Audience Updated",
      description: "Your audience data has been updated successfully",
      message: "Audience data updated successfully",
    },
  },

  // Success translations (for both GET and PUT)
  success: {
    title: "Audience Data Success",
    description: "Your audience data has been processed successfully",
  },

  // Error translations (shared)
  errors: {
    validation: {
      title: "Invalid Audience Data",
      description:
        "Please check the provided audience information and try again",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the audience data service",
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You don't have permission to access audience data",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You are not allowed to access this audience data",
    },
    notFound: {
      title: "Audience Data Not Found",
      description: "The requested audience data could not be found",
    },
    server: {
      title: "Server Error",
      description:
        "An error occurred while processing your audience data request",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred with the audience data",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes to your audience data",
    },
    conflict: {
      title: "Data Conflict",
      description: "The audience data conflicts with existing information",
    },
  },

  // Enum translations
  enums: {
    gender: {
      all: "All Genders",
      male: "Male",
      female: "Female",
      nonBinary: "Non-Binary",
      other: "Other",
    },
    ageRange: {
      teens: "Teens (13-19)",
      youngAdults: "Young Adults (20-24)",
      millennials: "Millennials (25-40)",
      genX: "Generation X (41-56)",
      middleAged: "Middle Aged (57-65)",
      babyBoomers: "Baby Boomers (66-75)",
      seniors: "Seniors (76+)",
      allAges: "All Ages",
    },
    incomeLevel: {
      low: "Low Income",
      lowerMiddle: "Lower Middle Class",
      middle: "Middle Class",
      upperMiddle: "Upper Middle Class",
      high: "High Income",
      luxury: "Luxury Income",
      allLevels: "All Income Levels",
    },
    communicationChannel: {
      email: "Email",
      socialMedia: "Social Media",
      phone: "Phone",
      sms: "SMS/Text",
      inPerson: "In Person",
      website: "Website",
      mobileApp: "Mobile App",
      directMail: "Direct Mail",
      advertising: "Advertising",
      wordOfMouth: "Word of Mouth",
    },
  },
};
