export const translations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "Subscribe & Get Access",
    description:
      "Submit your details to join the creator's list and get access to this skill",
    groups: {
      main: {
        title: "Get Access",
        description: "Enter your details below",
      },
    },
    fields: {
      skillId: {
        label: "Skill",
        description: "The skill you are subscribing from",
      },
      firstName: {
        label: "First name",
        description: "Your first name",
        placeholder: "e.g. Alex",
      },
      email: {
        label: "Email address",
        description: "Your email address",
        placeholder: "you@example.com",
      },
    },
    response: {
      captured: "Subscribed",
      nextStep: "Next step",
      signupUrl: "Sign-up URL",
    },
    success: {
      title: "You're in!",
      description: "Check your inbox - and sign up to start using the skill",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Unauthorized",
      },
      forbidden: {
        title: "Forbidden",
        description: "Forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Skill not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
      internal: {
        title: "Server Error",
        description: "An internal error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
  },
};
