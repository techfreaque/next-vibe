export const translations = {
  passwordStrength: {
    label: "Password Strength",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
    requirement: {
      minLength: {
        icon: "✗",
        text: "At least 8 characters",
      },
      uppercase: {
        icon: "✗",
        text: "At least one uppercase letter",
      },
      lowercase: {
        icon: "✗",
        text: "At least one lowercase letter",
      },
      number: {
        icon: "✗",
        text: "At least one number",
      },
      special: {
        icon: "!",
        text: "Special character (optional, improves strength)",
      },
    },
  },
  post: {
    title: "_components",
    description: "_components endpoint",
    form: {
      title: "_components Configuration",
      description: "Configure _components parameters",
    },
    response: {
      title: "Response",
      description: "_components response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
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
};
