export const translations = {
  title: "Newsletter Status",
  description: "Check newsletter subscription status for an email address",
  category: "Newsletter",
  tags: {
    status: "Status",
  },
  form: {
    title: "Check Newsletter Status",
    description:
      "Enter an email address to check its newsletter subscription status",
  },
  email: {
    label: "Email Address",
    description: "The email address to check subscription status for",
    placeholder: "user@example.com",
    helpText: "Enter the email address you want to check",
  },
  response: {
    subscribed: "Subscription Status",
    status: "Current Status",
  },
  errors: {
    validation: {
      title: "Invalid Email",
      description: "Please provide a valid email address",
    },
    internal: {
      title: "Internal Error",
      description: "An error occurred while checking the subscription status",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to check this subscription status",
    },
    notFound: {
      title: "Not Found",
      description: "No subscription information found for this email address",
    },
  },
  success: {
    title: "Status Retrieved",
    description: "Successfully retrieved newsletter subscription status",
  },
};
