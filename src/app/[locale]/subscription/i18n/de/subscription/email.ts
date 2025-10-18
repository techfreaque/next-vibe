import type { translations as EnglishEmailTranslations } from "../../en/subscription/email";

export const translations: typeof EnglishEmailTranslations = {
  success: {
    subject:
      "Willkommen bei {{planName}} - Ihr {{appName}} Abonnement ist aktiv!",
    title: "Willkommen bei {{appName}}, {{firstName}}!",
    previewText: "Ihr {{planName}} Abonnement ist jetzt aktiv - {{appName}}",
    welcomeMessage: "🎉 Ihr {{planName}} Abonnement ist jetzt aktiv!",
    description:
      "Vielen Dank für Ihr Abonnement bei {{appName}}. Wir freuen uns darauf, Ihnen beim Wachstum Ihrer Social Media Präsenz mit unseren professionellen Services zu helfen.",
    nextSteps: {
      title: "🚀 Bereit loszulegen?",
      description:
        "Lassen Sie uns Ihre Social Media Strategie einrichten und Ihren Content-Kalender starten.",
      cta: "Setup abschließen",
    },
    features: {
      title: "Was in Ihrem {{planName}} Plan enthalten ist",
    },
    support: {
      title: "Benötigen Sie Hilfe beim Einstieg?",
      description:
        "Unser Team ist hier, um Ihnen zu helfen, das Beste aus Ihrem Abonnement herauszuholen.",
      cta: "Support kontaktieren",
    },
    footer: {
      message:
        "Wir freuen uns, Sie an Bord zu haben und können es kaum erwarten, Ihren Social Media Erfolg zu sehen!",
      signoff: "Mit freundlichen Grüßen,\nDas {{appName}} Team",
    },
  },
  admin_notification: {
    subject: "🎉 Neues Abonnement: {{userName}} hat {{planName}} abonniert",
    title: "💳 Neues Abonnement Alert",
    preview: "Neuer zahlender Kunde - {{appName}}",
    message:
      "Großartige Neuigkeiten! Ein neuer Kunde hat erfolgreich einen bezahlten Plan bei {{appName}} abonniert.",
    details: "👤 Kunden- & Abonnement-Details",
    user_name: "Kundenname",
    user_email: "E-Mail",
    plan: "Plan",
    status: "Status",
    contact_user: "📧 Kunde kontaktieren",
    footer:
      "Diese Benachrichtigung wurde automatisch von {{appName}} gesendet, als ein neues Abonnement erstellt wurde.",
  },
};
