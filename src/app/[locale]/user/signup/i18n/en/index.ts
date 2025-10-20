import { translations as componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  components: componentsTranslations,
  meta: {
    title: "Sign Up - Next Vibe",
    description:
      "Create your Next Vibe account and start building amazing applications",
    category: "Authentication",
    imageAlt: "Next Vibe Sign Up",
    keywords: "signup, register, create account, next vibe",
    ogTitle: "Sign Up for Next Vibe",
    ogDescription:
      "Join Next Vibe and start building amazing applications today",
    twitterTitle: "Sign Up for Next Vibe",
    twitterDescription: "Create your account and start building with Next Vibe",
  },
  auth: {
    signup: {
      title: "Start Your Journey with Next Vibe",
      subtitle: "Join thousands of developers building amazing applications",
      createAccountButton: "Create Account",
      creatingAccount: "Creating Account...",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign in",
      termsAndConditions: "I agree to the",
      avatarAlt: "User avatar",
      userCount: "10,000+ developers",
      trustText: "Trusted by developers worldwide",
      createAccountAndBook: "Create Account & Book Meeting",
      directDescription: "Get started immediately with your account",
      scheduleDescription: "Schedule a personalized onboarding session",
      meetingPreferenceOptions: {
        direct: "Direct Access",
        schedule: "Schedule Meeting",
      },
      benefits: {
        contentCreation: {
          title: "Powerful Content Creation",
          description: "Create and manage content with our intuitive tools",
        },
        dataStrategy: {
          title: "Smart Data Strategy",
          description: "Leverage data-driven insights for better decisions",
        },
        saveTime: {
          title: "Save Time & Effort",
          description: "Automate workflows and boost productivity",
        },
      },
      privateName: "Private Name",
      privateNamePlaceholder: "Enter your private name",
      publicName: "Public Name",
      publicNamePlaceholder: "Enter your public name",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      newsletterSubscription: "Subscribe to newsletter",
    },
  },
  post: {
    title: "Signup",
    description: "Signup endpoint",
    form: {
      title: "Signup Configuration",
      description: "Configure signup parameters",
    },
    response: {
      title: "Response",
      description: "Signup response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
