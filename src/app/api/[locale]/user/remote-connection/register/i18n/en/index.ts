export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  post: {
    title: "Register Local Instance",
    description:
      "Called by a local instance during connect flow to register itself on the cloud",
    instanceId: {
      label: "Instance ID",
      description: "The unique identifier of the local instance",
      placeholder: "hermes",
      validation: {
        invalid: "Use only lowercase letters, numbers, and hyphens",
      },
    },
    localUrl: {
      label: "Local URL",
      description: "The app URL of the local instance",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Please enter the local URL",
        invalid: "Please enter a valid URL",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your details and try again",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to register an instance",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to register an instance",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while registering the instance",
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
        title: "Instance ID Already Registered",
        description:
          "An instance with this ID is already registered for your account. Choose a different instance ID.",
      },
    },
    success: {
      title: "Instance Registered",
      description: "The local instance has been registered successfully",
    },
  },
};
