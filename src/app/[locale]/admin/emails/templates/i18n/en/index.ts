export const translations = {
  overview: {
    description: "View and preview email templates",
    template: "template",
    templates: "templates",
    version: "Version",
    id: "ID",
    view_preview: "View Preview",
    total: "Total Templates",
  },
  preview: {
    back_to_templates: "Back to Templates",
    previous: "Previous Template",
    next: "Next Template",
    id: "Template ID",
    version: "Version",
    category: "Category",
    path: "Template Path",
    send_test: "Send Test Email",
    loading: "Loading preview...",
    error_loading: "Failed to load email preview",
    locale: {
      title: "Preview Language & Country",
      description: "Select language and country for email preview",
      language: "Language",
      country: "Country",
      languages: {
        en: "English",
        de: "Deutsch",
        pl: "Polski",
      },
      countries: {
        GLOBAL: "Global",
        DE: "Deutschland",
        PL: "Polska",
        US: "United States",
      },
    },
    form: {
      title: "Customize Email Preview",
      description: "Adjust email properties to preview different scenarios",
      reset: "Reset",
      select_option: "Select option...",
    },
  },
  test: {
    title: "Test Email",
    description: "Send a test email to verify the template",
    recipient: "Recipient Email",
    template: "Template",
    success: "Test email sent successfully",
    send: "Send Test Email",
    sending: "Sending...",
  },
  templates: {
    signup: {
      welcome: {
        meta: {
          name: "Signup Welcome Email",
          description: "Welcome email sent to new users after registration",
        },
        preview: {
          privateName: {
            label: "User's Name",
            description: "The user's first name or preferred name",
          },
          userId: {
            label: "User ID",
            description: "Unique identifier for the user account",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier for analytics",
          },
        },
      },
    },
    newsletter: {
      welcome: {
        meta: {
          name: "Newsletter Welcome Email",
          description: "Welcome email sent to new newsletter subscribers",
        },
        preview: {
          email: {
            label: "Email Address",
            description: "Subscriber's email address",
          },
          name: {
            label: "Subscriber Name",
            description: "Subscriber's name (optional)",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier for analytics",
          },
          userId: {
            label: "User ID",
            description: "User account identifier (optional)",
          },
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Subscription Success Email",
          description: "Confirmation email sent after successful subscription",
        },
        preview: {
          privateName: {
            label: "First Name",
            description: "User's first name",
          },
          userId: {
            label: "User ID",
            description: "Unique user identifier",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier",
          },
          planName: {
            label: "Plan Name",
            description: "Name of the subscription plan",
          },
        },
      },
    },
    password: {
      reset: {
        request: {
          meta: {
            name: "Password Reset Request Email",
            description: "Email with password reset link",
          },
          preview: {
            privateName: {
              label: "User's Name",
              description: "The user's public name",
            },
            userId: {
              label: "User ID",
              description: "Unique user identifier",
            },
            resetToken: {
              label: "Password Reset URL",
              description: "Complete URL for password reset",
            },
          },
        },
        confirm: {
          meta: {
            name: "Password Reset Confirmation Email",
            description: "Confirmation email after password reset",
          },
          preview: {
            privateName: {
              label: "User's Name",
              description: "The user's public name",
            },
            userId: {
              label: "User ID",
              description: "Unique user identifier",
            },
          },
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Contact Form Email",
          description: "Email sent when contact form is submitted",
        },
        preview: {
          name: {
            label: "Sender Name",
            description: "Name of person submitting form",
          },
          email: {
            label: "Sender Email",
            description: "Email address of sender",
          },
          subject: {
            label: "Subject",
            description: "Contact form subject",
          },
          message: {
            label: "Message",
            description: "Contact form message content",
          },
          company: {
            label: "Company",
            description: "Company name (optional)",
          },
          isForCompany: {
            label: "For Company Account",
            description: "Whether this is for a company or individual",
          },
          userId: {
            label: "User ID",
            description: "User account identifier (optional)",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier",
          },
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: New User Signup",
          description: "Admin notification when a new user registers",
        },
        preview: {
          privateName: {
            label: "Private Name",
            description: "User's private name",
          },
          publicName: {
            label: "Public Name",
            description: "User's public display name",
          },
          email: {
            label: "Email",
            description: "User's email address",
          },
          userId: {
            label: "User ID",
            description: "Unique identifier for the user",
          },
          subscribeToNewsletter: {
            label: "Newsletter Subscription",
            description: "Whether the user subscribed to the newsletter",
          },
        },
      },
      subscription: {
        meta: {
          name: "Admin: New Subscription",
          description: "Admin notification when a user subscribes",
        },
        preview: {
          privateName: {
            label: "Private Name",
            description: "User's private name",
          },
          publicName: {
            label: "Public Name",
            description: "User's public display name",
          },
          email: {
            label: "Email",
            description: "User's email address",
          },
          planName: {
            label: "Plan Name",
            description: "Name of the subscription plan",
          },
          statusName: {
            label: "Status",
            description: "Current subscription status",
          },
        },
      },
      user_create: {
        meta: {
          name: "Admin: New User Created",
          description: "Admin notification when a user account is created",
        },
        preview: {
          privateName: {
            label: "Private Name",
            description: "User's private name",
          },
          publicName: {
            label: "Public Name",
            description: "User's public display name",
          },
          email: {
            label: "Email",
            description: "User's email address",
          },
          userId: {
            label: "User ID",
            description: "Unique identifier for the user",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier (optional)",
          },
        },
      },
      contact: {
        meta: {
          name: "Admin: Contact Form Submission",
          description: "Admin notification when a contact form is submitted",
        },
        preview: {
          name: {
            label: "Sender Name",
            description: "Name of person who submitted the form",
          },
          email: {
            label: "Sender Email",
            description: "Email address of the sender",
          },
          subject: {
            label: "Subject",
            description: "Contact form subject",
          },
          message: {
            label: "Message",
            description: "Contact form message content",
          },
          company: {
            label: "Company",
            description: "Company name (optional)",
          },
          userId: {
            label: "User ID",
            description: "User account identifier (optional)",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier",
          },
        },
      },
    },
  },
};
