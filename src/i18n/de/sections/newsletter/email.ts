import type { emailTranslations as EnglishEmailTranslations } from "../../../en/sections/newsletter/email";

export const emailTranslations: typeof EnglishEmailTranslations = {
  welcome: {
    subject: "Willkommen zu unserem Newsletter",
    title: "Willkommen zu unserem Newsletter",
    preview: "Vielen Dank für das Abonnieren unseres Newsletters",
    greeting: "Hallo,",
    greeting_with_name: "Hallo {{name}},",
    message:
      "Vielen Dank für das Abonnieren des {{appName}} Newsletters! Wir freuen uns, Sie in unserer Community begrüßen zu dürfen.",
    what_to_expect: "Hier ist, was Sie von unserem Newsletter erwarten können:",
    benefit_1: "Exklusive Brancheneinblicke und Trends",
    benefit_2: "Tipps und bewährte Praktiken für Social Media Management",
    benefit_3: "Produktupdates und Ankündigungen neuer Funktionen",
    benefit_4: "Sonderangebote und Aktionen nur für Abonnenten",
    frequency:
      "Wir senden Ihnen etwa einmal im Monat Updates, damit wir Ihr Postfach nicht überlasten.",
    cta_button: "Unsere Website besuchen",
    follow_us: "Folgen Sie uns in den sozialen Medien",
    unsubscribe_text:
      "Wenn Sie unseren Newsletter nicht mehr erhalten möchten, können Sie sich",
    unsubscribe_link: "hier abmelden",
  },
  admin_notification: {
    subject: "Neuer Newsletter-Abonnent",
    title: "Neuer Newsletter-Abonnent",
    preview: "Ein neuer Benutzer hat den Newsletter abonniert",
    message:
      "Ein neuer Benutzer hat den Newsletter abonniert. Hier sind die Details:",
    subscriber_details: "Abonnenten-Details",
    email: "E-Mail",
    name: "Name",
    preferences: "Einstellungen",
    view_in_admin: "Im Admin-Panel anzeigen",
  },
};
