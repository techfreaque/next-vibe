export const translations = {
  errors: {
    validation: {
      title: "Invalid stats request",
      description: "Check the window and dates",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to view stats",
    },
    forbidden: {
      title: "Admins only",
      description: "You need the admin role to view stats",
    },
    notFound: {
      title: "No data",
      description: "Nothing to report for this window",
    },
    server: {
      title: "Could not compute stats",
      description: "The server failed to compute user statistics",
    },
    network: {
      title: "Network error",
      description: "Could not reach the server",
    },
    unknown: {
      title: "Unexpected error",
      description: "Something went wrong computing stats",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "The request conflicts with current data",
    },
  },
  title: "Account overview",
  description:
    "Review customer signups and email verification. Staff and test accounts are excluded.",
  accounts: "Customer accounts",
  signups: "New in 7 days",
  verified: "Verified email",
  unverified: "Unverified email",
  reviewUnverified: "New accounts awaiting verification ({{count}})",
  attention: "Needs review",
  clear: "All new accounts have verified their email.",
  unavailable: "Verification status unavailable.",
  recent: "Recent activity",
  loading: "Loading account overview…",
};
