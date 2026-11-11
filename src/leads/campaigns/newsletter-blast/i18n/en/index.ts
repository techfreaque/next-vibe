export const translations = {
  tag: "Newsletter",
  post: {
    title: "Newsletter Blast",
    titleShort: "Blast",
    description:
      "Enqueue a one-off, consent-filtered newsletter to confirmed opt-ins. The email-campaigns dispatcher sends the enqueued rows.",
    container: {
      title: "Newsletter blast",
      description: "Consent-filtered one-off newsletter enqueue",
    },
    fields: {
      dryRun: {
        label: "Dry run",
        description:
          "Count the consented audience without enqueuing any emails.",
      },
    },
    response: {
      scheduled: "Enqueued",
      skipped: "Skipped",
      errors: "Errors",
    },
    success: {
      title: "Newsletter blast enqueued",
      description:
        "Consent-filtered recipients were enqueued for the next dispatcher run.",
    },
  },
  errors: {
    unauthorized: {
      title: "Not signed in",
      description: "Sign in to run the newsletter blast.",
    },
    forbidden: {
      title: "Not allowed",
      description: "Only admins can run the newsletter blast.",
    },
    server: {
      title: "Something went wrong",
      description: "The newsletter blast could not run. Try again.",
    },
    unknown: {
      title: "Unknown error",
      description: "An unexpected error occurred.",
    },
    validation: {
      title: "Invalid input",
      description: "Check the request and try again.",
    },
    notFound: {
      title: "Not found",
      description: "The requested resource was not found.",
    },
    conflict: {
      title: "Conflict",
      description: "This action conflicts with the current state.",
    },
    network: {
      title: "Network error",
      description: "A network error occurred. Try again.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes.",
    },
  },
};
