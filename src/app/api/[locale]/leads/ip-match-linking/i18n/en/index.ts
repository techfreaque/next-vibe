export const translations = {
  category: "Leads",
  tag: "IP Match Linking",
  task: {
    description:
      "Scan anonymous leads sharing the same IP address and link them as the same person",
  },
  post: {
    title: "IP Match Linking",
    description: "Link anonymous leads that share the same IP address",
    container: {
      title: "IP Match Linking",
      description:
        "Finds anonymous leads with matching IPs created within the time window and links them",
    },
    fields: {
      dryRun: {
        label: "Dry Run",
        description: "Run without making changes",
      },
      windowDays: {
        label: "Window (days)",
        description:
          "Only match leads created within this many days of each other",
      },
    },
    response: {
      pairsFound: "Pairs Found",
      pairsLinked: "Pairs Linked",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while running IP match linking",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
    },
    success: {
      title: "IP Match Linking Completed",
      description: "IP-matched leads linked successfully",
    },
  },
};
