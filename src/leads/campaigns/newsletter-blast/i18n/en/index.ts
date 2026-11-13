export const translations = {
  tag: "Newsletter",
  post: {
    title: "Newsletter Blast",
    titleShort: "Blast",
    description:
      "Send a one-off newsletter to confirmed opt-ins only. Dry run shows counts per locale. Send mails this newsletter right away, nothing else.",
    container: {
      title: "Newsletter blast",
      description: "Confirmed opt-ins only. Count, queue, send.",
    },
    fields: {
      dryRun: {
        label: "Dry run",
        description:
          "Count the consented audience per locale. Writes nothing, sends nothing.",
      },
      send: {
        label: "Send now",
        description:
          "Mail this newsletter to the consented audience right away. Other pending campaigns are left alone.",
      },
    },
    response: {
      audience: "Consented audience",
      byLocale: "Recipients per locale",
      scheduled: "Newly enqueued",
      alreadyPending: "Already queued",
      cancelled: "Cancelled (no consent)",
      alreadySent: "Skipped (already got it)",
      duplicates: "Duplicate rows cancelled",
      errors: "Errors",
      sent: "Sent",
      sendSkipped: "Skipped at send (already got it)",
      sendFailed: "Send failed",
    },
    success: {
      title: "Newsletter blast enqueued",
      description:
        "Consented recipients are queued. With Send now on, they are mailed in this run.",
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
