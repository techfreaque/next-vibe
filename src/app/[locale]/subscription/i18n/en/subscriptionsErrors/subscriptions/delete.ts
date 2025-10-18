export const translations = {
  error: {
    validation: {
      title: "Subscription cancellation validation failed",
      description: "Please check your request and try again",
    },
    unauthorized: {
      title: "Subscription cancellation unauthorized",
      description: "You don't have permission to cancel subscriptions",
    },
    forbidden: {
      title: "Subscription cancellation forbidden",
      description: "You don't have permission to cancel this subscription",
    },
    not_found: {
      title: "Subscription not found",
      description:
        "The subscription you're trying to cancel could not be found",
    },
    server: {
      title: "Subscription cancellation server error",
      description: "Unable to cancel subscription due to a server error",
    },
    unknown: {
      title: "Subscription cancellation failed",
      description: "An unexpected error occurred while cancelling subscription",
    },
  },
  success: {
    title: "Subscription cancelled successfully",
    description:
      "The subscription has been cancelled and will end at the current period",
  },
};
