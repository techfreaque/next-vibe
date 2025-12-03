export const translations = {
  // Generic manifest translations
  category: "Core",
  tags: {
    manifest: "Manifest",
    configuration: "Configuration",
  },

  // Endpoint metadata
  title: "Get Web App Manifest",
  description:
    "Retrieve localized web app manifest data for Progressive Web App (PWA) configuration",

  // Form translations
  form: {
    title: "Manifest Request",
    description:
      "No input parameters required - this endpoint returns manifest data based on your current locale",
  },

  // Response translations
  response: {
    title: "Web App Manifest",
    description:
      "Complete PWA manifest configuration including app metadata, icons, and localization settings",
    display: "Display Mode",
    orientation: "Orientation",
    categories: "Categories",
    iconPurpose: "Icon Purpose",
  },

  // Error translations
  errors: {
    validation: {
      title: "Invalid Request",
      description: "The request parameters are not valid",
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You don't have permission to access the manifest",
    },
    server: {
      title: "Server Error",
      description: "Failed to generate web app manifest",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the server",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You are not allowed to access this resource",
    },
    conflict: {
      title: "Data Conflict",
      description: "There is a conflict with the requested data",
    },
    not_found: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    unsaved_changes: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
  },

  // Success translations
  success: {
    title: "Manifest Retrieved",
    description: "Web app manifest generated successfully",
  },

  // Enum translations
  enums: {
    displayMode: {
      fullscreen: "Fullscreen",
      standalone: "Standalone",
      minimalUi: "Minimal UI",
      browser: "Browser",
    },
    orientation: {
      any: "Any",
      natural: "Natural",
      landscape: "Landscape",
      landscapePrimary: "Landscape Primary",
      landscapeSecondary: "Landscape Secondary",
      portrait: "Portrait",
      portraitPrimary: "Portrait Primary",
      portraitSecondary: "Portrait Secondary",
    },
    category: {
      books: "Books",
      business: "Business",
      education: "Education",
      entertainment: "Entertainment",
      finance: "Finance",
      fitness: "Fitness",
      food: "Food",
      games: "Games",
      government: "Government",
      health: "Health",
      kids: "Kids",
      lifestyle: "Lifestyle",
      magazines: "Magazines",
      medical: "Medical",
      music: "Music",
      navigation: "Navigation",
      news: "News",
      personalization: "Personalization",
      photo: "Photo",
      politics: "Politics",
      productivity: "Productivity",
      security: "Security",
      shopping: "Shopping",
      social: "Social",
      sports: "Sports",
      travel: "Travel",
      utilities: "Utilities",
      weather: "Weather",
    },
    iconPurpose: {
      maskable: "Maskable",
      any: "Any",
      monochrome: "Monochrome",
      maskableAny: "Maskable Any",
    },
  },
};
