import type { subscriptionTranslations as EnglishSubscriptionTranslations } from "../../../en/sections/newsletter/subscription";

export const subscriptionTranslations: typeof EnglishSubscriptionTranslations =
  {
    success: {
      title: "Abonnement erfolgreich",
      description: "Vielen Dank für das Abonnieren unseres Newsletters!",
    },
    error: {
      title: "Abonnement fehlgeschlagen",
      description:
        "Wir konnten Ihr Abonnement nicht verarbeiten. Bitte versuchen Sie es erneut.",
      alreadySubscribed:
        "Diese E-Mail hat unseren Newsletter bereits abonniert.",
    },
    status: {
      subscribed:
        "Diese E-Mail ist bereits abonniert. Klicken Sie zum Abmelden.",
    },
    confirmation: {
      title: "Ihr Abonnement bestätigen",
      description:
        "Bitte überprüfen Sie Ihre E-Mails, um Ihr Abonnement zu bestätigen.",
      emailSubject: "Bestätigen Sie Ihr Newsletter-Abonnement",
      emailTitle: "Bestätigen Sie Ihr Newsletter-Abonnement",
      emailBody:
        "Vielen Dank für das Abonnieren unseres Newsletters. Bitte klicken Sie auf die Schaltfläche unten, um Ihr Abonnement zu bestätigen.",
      confirmButton: "Abonnement bestätigen",
      alreadyConfirmed: "Ihr Abonnement wurde bereits bestätigt.",
      confirmSuccess: "Ihr Abonnement wurde bestätigt!",
      confirmError:
        "Wir konnten Ihr Abonnement nicht bestätigen. Bitte versuchen Sie es erneut.",
    },
    unsubscribe: {
      title: "Abmelden",
      description:
        "Es tut uns leid, Sie gehen zu sehen. Sie wurden von unserem Newsletter abgemeldet.",
      confirmQuestion: "Sind Sie sicher, dass Sie sich abmelden möchten?",
      confirmButton: "Ja, melden Sie mich ab",
      cancelButton: "Nein, mein Abonnement behalten",
      success: "Sie wurden von unserem Newsletter abgemeldet.",
      error:
        "Wir konnten Ihre Abmeldeanfrage nicht verarbeiten. Bitte versuchen Sie es erneut.",
    },
  };
