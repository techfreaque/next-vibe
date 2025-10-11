export const translations = {
  category: "Business Data",

  // GET endpoint translations
  get: {
    title: "Get Business Information",
    description: "Retrieve business information and company details",

    form: {
      title: "Business Information Request",
      description: "Request form to retrieve business information",
    },

    response: {
      title: "Business Information",
      description: "Company details and business information",
      businessType: {
        title: "Business type",
      },
      businessName: {
        title: "Business name",
      },
      industry: {
        title: "Industry",
      },
      businessSize: {
        title: "Business size",
      },
      businessEmail: {
        title: "Business email",
      },
      businessPhone: {
        title: "Business phone",
      },
      website: {
        title: "Website",
      },
      country: {
        title: "Country",
      },
      city: {
        title: "City",
      },
      foundedYear: {
        title: "Founded year",
      },
      completionStatus: {
        title: "Completion status",
        description: "Business information completion status",
      },
    },

    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description:
          "You are not authorized to access this business information",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters for business information",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving business information",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to retrieve business information",
      },
      forbidden: {
        title: "Access Forbidden",
        description:
          "You do not have permission to view this business information",
      },
      notFound: {
        title: "Business Info Not Found",
        description: "No business information found for this user",
      },
    },

    success: {
      title: "Business Information Retrieved",
      description: "Successfully retrieved business information",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Business Information",
    description: "Update company details and business information",

    form: {
      title: "Update Business Information",
      description: "Update your company details and business information",
    },

    response: {
      title: "Updated Business Information",
      description: "Your business information has been updated successfully",
      message: {
        content: "Business information updated successfully",
      },
      businessType: "Business type updated",
      businessName: "Business name updated",
      industry: "Industry updated",
      businessSize: "Business size updated",
      businessEmail: "Business email updated",
      businessPhone: "Business phone updated",
      website: "Website updated",
      country: "Country updated",
      city: "City updated",
      foundedYear: "Founded year updated",
      businessDescription: "Business description updated",
      completionStatus: {
        isComplete: "Section complete",
        completedFields: "Completed fields",
        totalFields: "Total fields",
        completionPercentage: "Completion percentage",
        missingRequiredFields: "Missing required fields",
      },
    },

    // Field labels and descriptions
    businessType: {
      label: "Business Type",
      description: "Select the type of business structure",
      placeholder: "Choose your business type",
    },

    businessName: {
      label: "Business Name",
      description: "Enter your registered business name",
      placeholder: "e.g., Acme Corporation",
    },

    industry: {
      label: "Industry",
      description: "Select your primary industry or sector",
      placeholder: "Choose your industry",
    },

    businessSize: {
      label: "Business Size",
      description: "Select the size of your business",
      placeholder: "Choose business size",
    },

    businessEmail: {
      label: "Business Email",
      description: "Primary email address for business communications",
      placeholder: "contact@yourbusiness.com",
    },

    businessPhone: {
      label: "Business Phone",
      description: "Main business phone number",
      placeholder: "+1-555-0123",
    },

    website: {
      label: "Website",
      description: "Your business website URL",
      placeholder: "https://www.yourbusiness.com",
    },

    country: {
      label: "Country",
      description: "Country where your business is registered",
      placeholder: "Select country",
    },

    city: {
      label: "City",
      description: "City where your business is located",
      placeholder: "e.g., San Francisco",
    },

    foundedYear: {
      label: "Founded Year",
      description: "Year when your business was established",
      placeholder: "e.g., 2020",
    },

    employeeCount: {
      label: "Employee Count",
      description: "Number of employees in your business",
      placeholder: "e.g., 25",
    },

    businessDescription: {
      label: "Business Description",
      description: "Brief description of your business and what you do",
      placeholder: "Describe your business in a few sentences...",
    },

    location: {
      label: "Location",
      description: "Primary business location or address",
      placeholder: "Enter your business location",
    },

    productsServices: {
      label: "Products & Services",
      description: "Describe your main products and services",
      placeholder: "Describe what your business offers...",
    },

    additionalNotes: {
      label: "Additional Notes",
      description: "Any additional information about your business",
      placeholder: "Add any other relevant information...",
    },

    errors: {
      unauthorized: {
        title: "Unauthorized",
        description:
          "You are not authorized to update this business information",
      },
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      server: {
        title: "Server Error",
        description: "Failed to update business information",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while updating",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to update business information",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You do not have permission to update this information",
      },
      notFound: {
        title: "Not Found",
        description: "Business information record not found",
      },
      conflict: {
        title: "Conflict",
        description: "Business information conflicts with existing data",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your business information",
      },
    },

    success: {
      title: "Business Information Updated",
      description: "Your business information has been updated successfully",
      message: "Business information saved",
    },
  },

  // Enum translations
  enums: {
    businessType: {
      SaaS: "Software as a Service",
      E_COMMERCE: "E-Commerce",
      CONSULTING: "Consulting",
      AGENCY: "Agency",
      FREELANCER: "Freelancer",
      STARTUP: "Startup",
      SMALL_BUSINESS: "Small Business",
      CORPORATION: "Corporation",
      NON_PROFIT: "Non-Profit",
      SOLE_PROPRIETORSHIP: "Sole Proprietorship",
      PARTNERSHIP: "Partnership",
      LLC: "Limited Liability Company",
      OTHER: "Other",
    },

    industry: {
      TECHNOLOGY: "Technology",
      HEALTHCARE: "Healthcare",
      FINANCE: "Finance",
      EDUCATION: "Education",
      RETAIL: "Retail",
      MANUFACTURING: "Manufacturing",
      REAL_ESTATE: "Real Estate",
      HOSPITALITY: "Hospitality",
      ENTERTAINMENT: "Entertainment",
      AUTOMOTIVE: "Automotive",
      CONSTRUCTION: "Construction",
      CONSULTING: "Consulting",
      FOOD_BEVERAGE: "Food & Beverage",
      FITNESS_WELLNESS: "Fitness & Wellness",
      BEAUTY_FASHION: "Beauty & Fashion",
      HOME_GARDEN: "Home & Garden",
      SPORTS_RECREATION: "Sports & Recreation",
      TRAVEL_HOSPITALITY: "Travel & Hospitality",
      MARKETING_ADVERTISING: "Marketing & Advertising",
      LEGAL: "Legal",
      GOVERNMENT: "Government",
      NON_PROFIT: "Non-Profit",
      NON_PROFIT_CHARITY: "Non-Profit & Charity",
      TELECOMMUNICATIONS: "Telecommunications",
      OTHER: "Other",
    },

    businessSize: {
      STARTUP: "Startup (1-10 employees)",
      SMALL: "Small (11-50 employees)",
      MEDIUM: "Medium (51-250 employees)",
      LARGE: "Large (251-1000 employees)",
      ENTERPRISE: "Enterprise (1000+ employees)",
    },
  },

  // Tags
  tags: {
    businessInfo: "Business Info",
    company: "Company",
    update: "Update",
  },

  // Individual completion status field translations
  isComplete: "Business info complete",
  completedFields: "Business info completed fields",
  totalFields: "Business info total fields",
  completionPercentage: "Business info completion percentage",
  missingRequiredFields: "Business info missing required fields",
};
