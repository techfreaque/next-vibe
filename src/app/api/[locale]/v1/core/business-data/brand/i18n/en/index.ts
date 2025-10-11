export const translations = {
  category: "Business Data",
  tags: {
    brand: "Brand",
    businessData: "Business Data",
    identity: "Identity",
    update: "Update",
  },
  errors: {
    failed_to_get_brand_data: "Failed to get brand data",
    failed_to_update_brand_data: "Failed to update brand data",
  },
  // Enum translations
  enums: {
    personality: {
      professional: "Professional",
      friendly: "Friendly",
      innovative: "Innovative",
      trustworthy: "Trustworthy",
      creative: "Creative",
      authoritative: "Authoritative",
      playful: "Playful",
      sophisticated: "Sophisticated",
      approachable: "Approachable",
      bold: "Bold",
      caring: "Caring",
      reliable: "Reliable",
    },
    voice: {
      formal: "Formal",
      casual: "Casual",
      conversational: "Conversational",
      authoritative: "Authoritative",
      friendly: "Friendly",
      professional: "Professional",
      humorous: "Humorous",
      inspiring: "Inspiring",
      educational: "Educational",
      empathetic: "Empathetic",
    },
    visualStyle: {
      modern: "Modern",
      classic: "Classic",
      minimalist: "Minimalist",
      bold: "Bold",
      elegant: "Elegant",
      playful: "Playful",
      corporate: "Corporate",
      creative: "Creative",
      luxury: "Luxury",
      rustic: "Rustic",
      tech: "Tech",
      artistic: "Artistic",
    },
    assetType: {
      logo: "Logo",
      colorPalette: "Color Palette",
      typography: "Typography",
      imagery: "Imagery",
      icons: "Icons",
      patterns: "Patterns",
    },
  },

  // GET endpoint translations
  get: {
    title: "Get Brand Identity",
    description: "Retrieve brand identity and visual style information",
    form: {
      title: "Brand Identity Overview",
      description: "View current brand identity and style configuration",
    },
    response: {
      title: "Brand Identity Data",
      description: "Current brand identity and completion status",
      brandGuidelines: {
        title: "Brand Guidelines",
      },
      brandDescription: {
        title: "Brand Description",
      },
      brandValues: {
        title: "Brand Values",
      },
      brandPersonality: {
        title: "Brand Personality",
      },
      brandVoice: {
        title: "Brand Voice",
      },
      brandTone: {
        title: "Brand Tone",
      },
      brandColors: {
        title: "Brand Colors",
      },
      brandFonts: {
        title: "Brand Fonts",
      },
      logoDescription: {
        title: "Logo Description",
      },
      visualStyle: {
        title: "Visual Style",
      },
      brandPromise: {
        title: "Brand Promise",
      },
      brandDifferentiators: {
        title: "Brand Differentiators",
      },
      brandMission: {
        title: "Brand Mission",
      },
      brandVision: {
        title: "Brand Vision",
      },
      hasStyleGuide: {
        title: "Has Style Guide",
      },
      hasLogoFiles: {
        title: "Has Logo Files",
      },
      hasBrandAssets: {
        title: "Has Brand Assets",
      },
      additionalNotes: {
        title: "Additional Notes",
      },
      completionStatus: {
        title: "Completion Status",
        description: "Brand completion status information",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You don't have permission to access brand data",
      },
      validation: {
        title: "Validation Failed",
        description: "Invalid request for brand data",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving brand data",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the brand service",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You are not allowed to access this brand data",
      },
      notFound: {
        title: "Data Not Found",
        description: "The requested brand data could not be found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes to the brand data",
      },
      conflict: {
        title: "Conflict Error",
        description: "A conflict occurred while accessing brand data",
      },
    },
    success: {
      title: "Brand Data Retrieved",
      description: "Brand data retrieved successfully",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Brand Identity",
    description: "Update brand identity, voice, and visual style",
    form: {
      title: "Brand Identity Configuration",
      description: "Define and update your brand identity and visual style",
    },
    response: {
      title: "Update Results",
      description: "Brand identity update results and completion status",
      message: "Update status message",
      brandName: "Brand name updated",
      brandGuidelines: "Brand guidelines updated",
      brandDescription: "Brand description updated",
      brandValues: "Brand values updated",
      brandPersonality: "Brand personality updated",
      brandVoice: "Brand voice updated",
      brandTone: "Brand tone updated",
      brandColors: "Brand colors updated",
      brandFonts: "Brand fonts updated",
      logoDescription: "Logo description updated",
      visualStyle: "Visual style updated",
      brandPromise: "Brand promise updated",
      brandDifferentiators: "Brand differentiators updated",
      brandMission: "Brand mission updated",
      brandVision: "Brand vision updated",
      hasStyleGuide: "Style guide status updated",
      hasLogoFiles: "Logo files status updated",
      hasBrandAssets: "Brand assets status updated",
      additionalNotes: "Additional notes updated",
      colorPalette: "Color palette updated",
      typography: "Typography preferences updated",
      competitorBrands: "Competitor brands updated",
      completionStatus: {
        title: "Completion status updated",
        description: "Brand completion status has been updated",
        isComplete: "Brand section completed",
        completedFields: "Completed brand fields",
        totalFields: "Total brand fields",
        completionPercentage: "Brand completion percentage",
        missingRequiredFields: "Missing brand required fields",
      },
    },
    brandName: {
      label: "Brand Name",
      description: "The official name of your brand or company",
      placeholder: "e.g., TechCorp Solutions, Green Garden Co...",
    },
    brandMission: {
      label: "Brand Mission",
      description: "Your brand's mission statement and core purpose",
      placeholder:
        "e.g., To empower businesses through innovative technology solutions...",
    },
    brandVision: {
      label: "Brand Vision",
      description: "Your brand's long-term vision and aspirations",
      placeholder:
        "e.g., To be the leading provider of sustainable business solutions...",
    },
    brandValues: {
      label: "Brand Values",
      description: "Core values that define your brand's principles",
      placeholder:
        "e.g., Innovation, Integrity, Customer Focus, Sustainability...",
    },
    brandPersonality: {
      label: "Brand Personality",
      description:
        "Select the personality traits that best represent your brand",
      placeholder: "Select brand personality traits...",
    },
    brandVoice: {
      label: "Brand Voice",
      description: "The tone and style of your brand's communication",
      placeholder: "Select your brand voice style...",
    },
    brandTone: {
      label: "Brand Tone",
      description: "The emotional tone of your brand communication",
      placeholder: "e.g., Warm and friendly, Professional yet approachable...",
    },
    visualStyle: {
      label: "Visual Style",
      description: "The visual aesthetic and design approach for your brand",
      placeholder: "Select your visual style preference...",
    },
    colorPalette: {
      label: "Color Palette",
      description: "Primary colors that represent your brand",
      placeholder:
        "e.g., Deep blue (#003366), Bright green (#00CC66), Warm gray (#F5F5F5)...",
    },
    logoDescription: {
      label: "Logo Description",
      description: "Describe your current logo or ideal logo concept",
      placeholder:
        "e.g., Modern geometric design with company initials, nature-inspired symbol...",
    },
    typography: {
      label: "Typography Preferences",
      description: "Font styles and typography preferences for your brand",
      placeholder:
        "e.g., Clean sans-serif fonts, elegant serif for headings, modern and readable...",
    },
    brandGuidelines: {
      label: "Brand Guidelines",
      description:
        "Specific guidelines or standards for your brand presentation",
      placeholder:
        "e.g., Always use logo on white background, maintain 10px spacing around logo...",
    },
    competitorBrands: {
      label: "Competitor Brands",
      description: "Brands you consider as competitors or inspiration",
      placeholder:
        "e.g., Apple (for simplicity), Nike (for boldness), Patagonia (for values)...",
    },
    brandDifferentiators: {
      label: "Brand Differentiators",
      description: "What makes your brand unique from competitors",
      placeholder:
        "e.g., Personal customer service, sustainable practices, innovative technology...",
    },
    brandDescription: {
      label: "Brand Description",
      description: "A comprehensive description of your brand",
      placeholder: "Describe your brand in detail...",
    },
    brandPromise: {
      label: "Brand Promise",
      description: "The commitment your brand makes to customers",
      placeholder: "e.g., We promise to deliver quality products on time...",
    },
    additionalNotes: {
      label: "Additional Notes",
      description: "Any additional brand-related information or preferences",
      placeholder: "Add any other relevant brand information...",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You don't have permission to update brand data",
      },
      validation: {
        title: "Validation Failed",
        description:
          "Please check the provided brand information and try again",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating brand data",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred with the brand update",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the brand service",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You are not allowed to modify brand data",
      },
      notFound: {
        title: "Data Not Found",
        description: "The brand data could not be found",
      },
      conflict: {
        title: "Data Conflict",
        description: "The brand data conflicts with existing information",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your brand data",
      },
    },
    success: {
      title: "Brand Updated",
      description: "Your brand identity has been updated successfully",
      message: "Brand identity updated successfully",
    },
    brandColors: {
      label: "Brand Colors",
      description: "Primary and secondary colors for your brand",
      placeholder: "e.g., Primary: #007bff, Secondary: #6c757d...",
    },
    brandFonts: {
      label: "Brand Fonts",
      description: "Font families used in your brand materials",
      placeholder: "e.g., Headings: Inter, Body: Roboto...",
    },
    hasStyleGuide: {
      label: "Style Guide Available",
      description: "Whether you have a documented style guide",
    },
    hasLogoFiles: {
      label: "Logo Files Available",
      description: "Whether you have logo files in various formats",
    },
    hasBrandAssets: {
      label: "Brand Assets Available",
      description:
        "Whether you have other brand assets (templates, graphics, etc.)",
    },
  },

  // Individual completion status field translations
  isComplete: "Brand complete",
  completedFields: "Brand completed fields",
  totalFields: "Brand total fields",
  completionPercentage: "Brand completion percentage",
  missingRequiredFields: "Brand missing required fields",
};
