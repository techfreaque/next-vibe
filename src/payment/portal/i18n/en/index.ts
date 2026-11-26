export const translations = {
  success: {
    created: "Customer portal session created successfully",
  },
  post: {
    title: "Customer portal",
    titleShort: "Customer portal",
    description: "Create customer portal session for billing management",
    form: {
      title: "Portal configuration",
      description: "Configure customer portal parameters",
    },
    returnUrl: {
      label: "Return URL",
      description: "URL to redirect to after portal session",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Portal session created successfully",
      message: "Status message",
      customerPortalUrl: "Customer portal URL",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation error",
        description: "Invalid request parameters",
      },
      server: {
        detail: "Could not open the billing portal: {{error}}",
        portalNotConfigured:
          "The Stripe Customer Portal is not set up yet. Configure it at https://dashboard.stripe.com/test/settings/billing/portal",
        title: "Server error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        noStripeCustomer: "No Stripe customer record exists for your account",
        title: "Not found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
