import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    help: {
      form: {
        title: "Senden Sie uns eine Nachricht",
        name: "Name",
        namePlaceholder: "Ihr Name",
        email: "E-Mail",
        emailPlaceholder: "ihre.email@beispiel.de",
        company: "Unternehmen",
        companyPlaceholder: "Ihr Firmenname (optional)",
        subject: "Betreff",
        subjectPlaceholder: "Wählen Sie einen Betreff",
        message: "Nachricht",
        messagePlaceholder: "Sagen Sie uns, wie wir Ihnen helfen können...",
        submit: "Nachricht senden",
        sending: "Wird gesendet...",
      },
      info: {
        title: "Kontaktinformationen",
        email: "E-Mail",
        supportEmail: "support@unbottled.ai",
        community: "Community",
        discord: "Treten Sie unserem Discord bei",
        discordDescription:
          "Erhalten Sie Hilfe von unserer Community und unserem Team",
        twitter: "Folgen Sie uns auf Twitter",
        twitterHandle: "@unbottled_ai",
        website: "Webseite",
        websiteUrl: "unbottled.ai",
      },
    },
  },
  contact: {
    subjects: {
      HELP_SUPPORT: "Hilfe & Support",
      GENERAL_INQUIRY: "Allgemeine Anfrage",
      TECHNICAL_SUPPORT: "Technischer Support",
      ACCOUNT_QUESTION: "Kontofrage",
      BILLING_QUESTION: "Abrechnung & Guthaben",
      SALES_INQUIRY: "Vertriebsanfrage",
      FEATURE_REQUEST: "Feature-Anfrage",
      BUG_REPORT: "Fehlerbericht",
      FEEDBACK: "Feedback",
      COMPLAINT: "Beschwerde",
      PARTNERSHIP: "Partnerschaft",
      OTHER: "Sonstiges",
    },
  },
};
