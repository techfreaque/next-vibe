export const translations = {
  category: "Business Data",
  tags: {
    profile: "Profile",
    personal: "Personal",
    update: "Update",
  },

  // Enum translations
  enums: {
    jobTitleCategory: {
      executive: "Executive",
      management: "Management",
      marketing: "Marketing",
      sales: "Sales",
      operations: "Operations",
      technology: "Technology",
      finance: "Finance",
      humanResources: "Human Resources",
      customerService: "Customer Service",
      product: "Product",
      design: "Design",
      consulting: "Consulting",
      freelancer: "Freelancer",
      entrepreneur: "Entrepreneur",
      other: "Other",
    },
    companySize: {
      solo: "Solo (1 person)",
      small: "Small (2-10 employees)",
      medium: "Medium (11-50 employees)",
      large: "Large (51-200 employees)",
      enterprise: "Enterprise (200+ employees)",
    },
    experienceLevel: {
      entry: "Entry Level (0-2 years)",
      junior: "Junior (2-5 years)",
      mid: "Mid-Level (5-10 years)",
      senior: "Senior (10-15 years)",
      expert: "Expert (15+ years)",
    },
  },

  // Completion status field translations
  isComplete: "Profile complete",
  completedFields: "Completed fields",
  totalFields: "Total fields",
  completionPercentage: "Completion percentage",
  missingRequiredFields: "Missing required fields",

  // GET endpoint translations
  get: {
    title: "Get Profile",
    description: "Retrieve user profile information",

    form: {
      title: "Profile Request",
      description: "Request to retrieve profile information",
    },

    response: {
      title: "User Profile",
      description: "Your personal profile information",
      firstName: {
        title: "First name",
      },
      lastName: {
        title: "Last name",
      },
      bio: {
        title: "Biography",
      },
      phone: {
        title: "Phone number",
      },
      jobTitle: {
        title: "Job title",
      },
      completionStatus: {
        title: "Profile completion status",
        description: "Profile completion status information",
      },
    },

    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You are not authorized to access this profile",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters for profile",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving profile",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to retrieve profile",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You do not have permission to view this profile",
      },
      notFound: {
        title: "Profile Not Found",
        description: "No profile found for this user",
      },
      conflict: {
        title: "Data Conflict",
        description: "Profile data conflicts with existing information",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your profile",
      },
    },

    success: {
      title: "Profile Retrieved",
      description: "Successfully retrieved profile information",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Profile",
    description: "Update user profile information",

    form: {
      title: "Update Profile",
      description: "Update your personal profile information",
    },

    response: {
      title: "Updated Profile",
      description: "Your profile has been updated successfully",
      message: "Profile update message",
      firstName: "First name updated",
      lastName: "Last name updated",
      bio: "Biography updated",
      phone: "Phone number updated",
      jobTitle: "Job title updated",
      completionStatus: {
        title: "Completion status updated",
        description: "Profile completion status has been updated",
      },
    },

    // Field labels and descriptions
    fullName: {
      label: "Full Name",
      description: "Your complete full name",
      placeholder: "Enter your full name",
    },

    firstName: {
      label: "First Name",
      description: "Your first name",
      placeholder: "Enter your first name",
    },

    lastName: {
      label: "Last Name",
      description: "Your last name",
      placeholder: "Enter your last name",
    },

    bio: {
      label: "Bio",
      description: "A brief description about yourself",
      placeholder: "Tell us about yourself...",
    },

    phone: {
      label: "Phone Number",
      description: "Your contact phone number",
      placeholder: "+1-555-0123",
    },

    jobTitle: {
      label: "Job Title",
      description: "Your current job title or position",
      placeholder: "e.g., Marketing Manager",
    },

    expertise: {
      label: "Expertise",
      description: "Your professional skills and areas of expertise",
      placeholder: "Describe your key skills and expertise...",
    },

    professionalBackground: {
      label: "Professional Background",
      description: "Your professional experience and background",
      placeholder: "Describe your professional experience...",
    },

    additionalNotes: {
      label: "Additional Notes",
      description: "Any additional information about yourself",
      placeholder: "Add any other relevant information...",
    },

    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to update this profile",
      },
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      server: {
        title: "Server Error",
        description: "Failed to update profile",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while updating",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to update profile",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You do not have permission to update this profile",
      },
      notFound: {
        title: "Not Found",
        description: "Profile record not found",
      },
      conflict: {
        title: "Conflict",
        description: "Profile update conflicts with existing data",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes to your profile",
      },
    },

    success: {
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
      message: "Profile saved",
    },
  },
};
