import { translations as statusTranslations } from "../../status/i18n/de";
import { translations as subscribeTranslations } from "../../subscribe/i18n/de";
import { translations as unsubscribeTranslations } from "../../unsubscribe/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  status: statusTranslations,
  subscribe: subscribeTranslations,
  unsubscribe: unsubscribeTranslations,
  email: {
    welcome: {
      title: "Willkommen zu unserem Newsletter",
      preview: "Willkommen zu unserem Newsletter! Danke für Ihr Abonnement",
      greeting: "Hallo",
      greeting_with_name: "Hallo {{name}}",
      message:
        "Willkommen zum {{appName}} Newsletter! Vielen Dank für Ihr Abonnement.",
      what_to_expect: "Das können Sie von unserem Newsletter erwarten:",
      benefit_1: "Neueste Produktupdates und Features",
      benefit_2: "Brancheneinblicke und Trends",
      benefit_3: "Exklusive Inhalte und Tipps",
      benefit_4: "Spezielle Angebote und Aktionen",
      frequency:
        "Wir senden Ihnen wöchentlich Newsletter mit den neuesten Updates.",
      unsubscribe_text: "Sie können sich jederzeit abmelden, indem Sie",
      unsubscribe_link: "hier",
      subject: "Willkommen zu unserem Newsletter!",
    },
    admin_notification: {
      title: "Neues Newsletter-Abonnement",
      preview: "Ein neuer Nutzer hat den Newsletter abonniert",
      message: "Ein neuer Nutzer hat Ihren Newsletter abonniert.",
      subscriber_details: "Abonnenten-Details",
      email: "E-Mail",
      name: "Name",
      preferences: "Präferenzen",
      view_in_admin: "Im Admin-Panel anzeigen",
      subject: "Neues Newsletter-Abonnement - Admin Benachrichtigung",
    },
    unsubscribe: {
      title: "Vom Newsletter abmelden",
      preview: "Sie haben sich erfolgreich von unserem Newsletter abgemeldet",
      greeting: "Hallo",
      confirmation:
        "Wir haben {{email}} erfolgreich von unserem Newsletter abgemeldet",
      resubscribe_info:
        "Falls Sie Ihre Meinung ändern, können Sie sich jederzeit auf unserer Website wieder anmelden",
      resubscribe_button: "Wieder anmelden",
      support_message: "Bei Fragen wenden Sie sich bitte an unser Support-Team",
      subject: "Newsletter Abmeldebestätigung",
      admin_unsubscribe_notification: {
        title: "Newsletter Abmelde-Benachrichtigung",
        preview: "Ein Nutzer hat sich vom Newsletter abgemeldet",
        message: "Ein Nutzer hat sich vom Newsletter abgemeldet",
        email: "E-Mail",
        date: "Datum",
        view_dashboard: "Dashboard anzeigen",
        subject: "Newsletter Abmeldung - Admin Benachrichtigung",
      },
    },
  },
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Produktneuigkeiten",
      companyUpdates: "Unternehmens-Updates",
      industryInsights: "Branchen-Einblicke",
      events: "Veranstaltungen",
    },
    status: {
      subscribed: "Abonniert",
      unsubscribed: "Abgemeldet",
      pending: "Ausstehend",
      bounced: "Zurückgewiesen",
      complained: "Beschwerde",
    },
  },
};
