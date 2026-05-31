export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  post: {
    title: "Re-authenticate",
    description: "Refresh credentials for this remote connection",
    instanceId: {
      label: "Instance ID",
      description: "The instance to re-authenticate",
    },
    email: {
      label: "Email",
      description: "Your email on the remote instance",
      placeholder: "you@example.com",
      validation: {
        required: "Email is required",
        invalid: "Invalid email address",
      },
    },
    password: {
      label: "Password",
      description: "Your password on the remote instance",
      placeholder: "••••••••",
      validation: {
        required: "Password is required",
      },
    },
    actions: {
      submit: "Re-authenticate",
      submitting: "Re-authenticating…",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the remote server",
      },
      unauthorized: {
        title: "Invalid Credentials",
        description: "Email or password is incorrect",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission",
      },
      notFound: {
        title: "Not Connected",
        description: "No remote connection found for this instance",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while re-authenticating",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Re-authenticated",
      description: "Your credentials have been refreshed successfully",
    },
  },
};
