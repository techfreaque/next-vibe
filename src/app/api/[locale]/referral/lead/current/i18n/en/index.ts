export const translations = {
  title: "Get Current Lead Referral",
  description: "Returns the referral code linked to the current lead, if any",
  tag: "Referral",
  response: {
    referralCode: "Referral Code",
    referralLabel: "Referral Label",
  },
  errors: {
    validation: { title: "Validation Error", description: "Invalid request" },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not Found", description: "Resource not found" },
    conflict: { title: "Conflict", description: "Data conflict" },
    serverError: {
      title: "Server Error",
      description: "Internal server error",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    network: { title: "Network Error", description: "Network error occurred" },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
  },
  success: {
    title: "Referral Code Retrieved",
    description: "Current lead referral code fetched successfully",
  },
};
