import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "Newsletter abonnieren",
  subheadingPublic: "Neue unzensierte Modelle, Produkt-Updates, kein Spam.",
  subheadingLoggedIn: "Neue unzensierte Modelle, Produkt-Updates, kein Spam.",
  bonusGuest:
    "Gratis-Konto: {{freeCreditsSignedIn}} Credits im Monat, mit Newsletter {{freeCreditsMax}}.",
  bonusGuestLink: "Gratis registrieren",
  bonusAccount:
    "E-Mail bestätigen: +{{bonusCredits}} Gratis-Credits, insgesamt {{freeCreditsMax}} im Monat.",
  emailPlaceholder: "du@beispiel.de",
  subscribe: "Abonnieren",
  alreadyIn: "Du stehst auf der Liste. Schau in dein Postfach.",
  success: "Fast geschafft. Bestätige die E-Mail in deinem Postfach.",
  error: "Das hat nicht geklappt. Versuch es noch einmal.",
  privacy: "Jederzeit mit einem Klick abbestellbar.",
  loggedInHint: "Wir senden ihn an die E-Mail deines Kontos.",
  pending: {
    title: "Bestätigung im Postfach",
    bodyWithEmail: "Der Bestätigungslink ging an {{email}}.",
    body: "Der Bestätigungslink liegt in deinem Postfach.",
    bonus: "Ein Klick schaltet +{{bonusCredits}} Gratis-Credits im Monat frei.",
    resend: "E-Mail erneut senden",
    resending: "Wird gesendet...",
    resent: "Gesendet. Nicht da? Spam-Ordner prüfen.",
  },
  subscribedNotice: {
    title: "Du bist dabei",
    bonus:
      "+{{bonusCredits}} Gratis-Credits im Monat sind auf deinem Konto aktiv.",
    body: "Neue Modelle und Produkt-Updates landen in deinem Postfach.",
    manage: "Verwalten oder abbestellen",
  },
};
