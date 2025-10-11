export const translations = {
  category: "API Endpoint",
  tags: {
    competitors: "Competitors",
    market: "Market Analysis",
    update: "Update",
  },

  // GET endpoint translations
  get: {
    title: "Get Competitors Data",
    description: "Retrieve competitors information and analysis",
    form: {
      title: "Competitors Information",
      description: "Access your competitors analysis data",
    },
    response: {
      title: "Competitors Data",
      description: "Your competitors information and market analysis",
      competitors: {
        title: "Competitors list",
      },
      mainCompetitors: {
        title: "Main competitors",
      },
      competitiveAdvantages: {
        title: "Competitive advantages",
      },
      competitiveDisadvantages: {
        title: "Competitive disadvantages",
      },
      marketPosition: {
        title: "Market position",
      },
      differentiators: {
        title: "Key differentiators",
      },
      competitorStrengths: {
        title: "Competitor strengths",
      },
      competitorWeaknesses: {
        title: "Competitor weaknesses",
      },
      marketGaps: {
        title: "Market gaps",
      },
      additionalNotes: {
        title: "Additional notes",
      },
      completionStatus: {
        title: "Section completion status",
        description: "Competitors section completion status",
        isComplete: "Section complete",
        completedFields: "Completed fields",
        totalFields: "Total fields",
        completionPercentage: "Completion percentage",
        missingRequiredFields: "Missing required fields",
      },
    },
    errors: {
      unauthorized: {
        title: "Access Denied",
        description: "You are not authorized to access this competitors data",
      },
      validation: {
        title: "Validation Error",
        description: "The request data is invalid",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Competitors data not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Competitors data retrieved successfully",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Competitors Data",
    description: "Update competitors information and analysis",
    form: {
      title: "Update Competitors Information",
      description: "Modify your competitors analysis data",
    },
    response: {
      title: "Updated Competitors Data",
      description: "Your updated competitors information",
      message: {
        title: "Update status message",
      },
      competitors: {
        title: "Competitors updated",
      },
      mainCompetitors: {
        title: "Main competitors updated",
      },
      competitiveAdvantages: {
        title: "Competitive advantages updated",
      },
      competitiveDisadvantages: {
        title: "Competitive disadvantages updated",
      },
      marketPosition: {
        title: "Market position updated",
      },
      differentiators: {
        title: "Differentiators updated",
      },
      competitorStrengths: {
        title: "Competitor strengths updated",
      },
      competitorWeaknesses: {
        title: "Competitor weaknesses updated",
      },
      marketGaps: {
        title: "Market gaps updated",
      },
      additionalNotes: {
        title: "Additional notes updated",
      },
      completionStatus: {
        title: "Completion status updated",
        description: "Updated competitors completion status",
        isComplete: "Section complete",
        completedFields: "Completed fields",
        totalFields: "Total fields",
        completionPercentage: "Completion percentage",
        missingRequiredFields: "Missing required fields",
      },
    },

    // Field labels, descriptions, and placeholders
    competitors: {
      label: "Competitors",
      description: "List your main competitors in the market",
      placeholder: "Enter competitor names separated by commas",
    },
    mainCompetitors: {
      label: "Main Competitors",
      description:
        "Identify your primary competitors and their market position",
      placeholder: "Describe your main competitors and their strengths",
    },
    competitiveAdvantages: {
      label: "Competitive Advantages",
      description: "What advantages do you have over your competitors?",
      placeholder: "List your key competitive advantages",
    },
    competitiveDisadvantages: {
      label: "Competitive Disadvantages",
      description: "What disadvantages do you face compared to competitors?",
      placeholder: "Describe areas where competitors have advantages",
    },
    marketPosition: {
      label: "Market Position",
      description:
        "Describe your position in the market relative to competitors",
      placeholder: "Explain your current market position and strategy",
    },
    differentiators: {
      label: "Key Differentiators",
      description: "What makes your business unique from competitors?",
      placeholder: "Describe what sets you apart from the competition",
    },
    competitorStrengths: {
      label: "Competitor Strengths",
      description: "What are your competitors' main strengths?",
      placeholder: "Analyze your competitors' key strengths",
    },
    competitorWeaknesses: {
      label: "Competitor Weaknesses",
      description: "What weaknesses do you see in your competitors?",
      placeholder: "Identify opportunities where competitors are weak",
    },
    marketGaps: {
      label: "Market Gaps",
      description: "What gaps exist in the market that you could fill?",
      placeholder: "Describe unmet needs or market opportunities",
    },
    additionalNotes: {
      label: "Additional Notes",
      description: "Any additional insights about your competitive landscape",
      placeholder: "Add any other relevant competitive analysis notes",
    },

    errors: {
      unauthorized: {
        title: "Access Denied",
        description: "You are not authorized to update this competitors data",
      },
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while updating",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred during update",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed during update",
      },
      forbidden: {
        title: "Forbidden",
        description: "Update access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Competitors data not found for update",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred during update",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Competitors data updated successfully",
      message: "Your competitors information has been updated",
    },
  },

  // Enum translations
  enums: {
    competitorType: {
      direct: "Direct Competitor",
      indirect: "Indirect Competitor",
      substitute: "Substitute Product",
      potential: "Potential Competitor",
    },
    marketPosition: {
      leader: "Market Leader",
      challenger: "Market Challenger",
      follower: "Market Follower",
      niche: "Niche Player",
      disruptor: "Market Disruptor",
    },
    competitiveAdvantage: {
      price: "Price Advantage",
      quality: "Quality Advantage",
      service: "Service Excellence",
      innovation: "Innovation",
      brand: "Brand Strength",
      distribution: "Distribution Network",
      technology: "Technology",
      expertise: "Expertise",
      speed: "Speed to Market",
      customization: "Customization",
    },
    analysisArea: {
      pricing: "Pricing Strategy",
      productFeatures: "Product Features",
      marketing: "Marketing Approach",
      customerService: "Customer Service",
      distribution: "Distribution Channels",
      technology: "Technology Stack",
      brandPositioning: "Brand Positioning",
      targetAudience: "Target Audience",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
    },
  },

  // Individual completion status field translations
  isComplete: "Competitors analysis completed",
  completedFields: "Completed competitors fields",
  totalFields: "Total competitors fields",
  completionPercentage: "Competitors completion percentage",
  missingRequiredFields: "Missing required competitors fields",
};
