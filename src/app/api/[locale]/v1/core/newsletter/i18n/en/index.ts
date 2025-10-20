import { translations as statusTranslations } from "../../status/i18n/en";
import { translations as subscribeTranslations } from "../../subscribe/i18n/en";
import { translations as unsubscribeTranslations } from "../../unsubscribe/i18n/en";

export const translations = {
  status: statusTranslations,
  subscribe: subscribeTranslations,
  unsubscribe: unsubscribeTranslations,
  email: {
    welcome: {
      title: "Welcome to our Newsletter",
      preview: "Welcome to our newsletter! Thanks for subscribing",
      greeting: "Hello",
      greeting_with_name: "Hello {{name}}",
      message: "Welcome to {{appName}} Newsletter! Thank you for subscribing.",
      what_to_expect: "Here's what you can expect from our newsletter:",
      benefit_1: "Latest product updates and features",
      benefit_2: "Industry insights and trends",
      benefit_3: "Exclusive content and tips",
      benefit_4: "Special offers and promotions",
      frequency: "We'll send you newsletters weekly with the latest updates.",
      unsubscribe_text: "You can unsubscribe at any time by clicking",
      unsubscribe_link: "here",
      subject: "Welcome to our Newsletter!",
    },
    admin_notification: {
      title: "New Newsletter Subscription",
      preview: "A new user has subscribed to the newsletter",
      message: "A new user has subscribed to your newsletter.",
      subscriber_details: "Subscriber Details",
      email: "Email",
      name: "Name",
      preferences: "Preferences",
      view_in_admin: "View in Admin Panel",
      subject: "New Newsletter Subscription - Admin Notification",
    },
    unsubscribe: {
      title: "Unsubscribe from Newsletter",
      preview: "You have successfully unsubscribed from our newsletter",
      greeting: "Hello",
      confirmation:
        "We have successfully unsubscribed {{email}} from our newsletter",
      resubscribe_info:
        "If you change your mind, you can always resubscribe by visiting our website",
      resubscribe_button: "Resubscribe",
      support_message:
        "If you have any questions, please contact our support team",
      subject: "Newsletter Unsubscribe Confirmation",
      admin_unsubscribe_notification: {
        title: "Newsletter Unsubscribe Notification",
        preview: "A user has unsubscribed from the newsletter",
        message: "A user has unsubscribed from the newsletter",
        email: "Email",
        date: "Date",
        view_dashboard: "View Dashboard",
        subject: "Newsletter Unsubscribe - Admin Notification",
      },
    },
  },
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Product News",
      companyUpdates: "Company Updates",
      industryInsights: "Industry Insights",
      events: "Events",
    },
    status: {
      subscribed: "Subscribed",
      unsubscribed: "Unsubscribed",
      pending: "Pending",
      bounced: "Bounced",
      complained: "Complained",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Newsletter subscription: Missing leadId",
    },
  },
  errors: {
    email_generation_failed: "Failed to generate email",
  },
  error: {
    general: {
      internal_server_error: "Internal server error",
    },
    default: "An error occurred",
  },
  subscription: {
    error: {
      description: "Failed to subscribe to newsletter",
    },
    unsubscribe: {
      error: "Failed to unsubscribe from newsletter",
    },
  },
};
