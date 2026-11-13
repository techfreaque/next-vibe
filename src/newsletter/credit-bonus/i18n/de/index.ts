import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    credits: "Credits",
  },
  enum: {
    offer: {
      available: "Verfügbar",
      pendingConfirmation: "Wartet auf E-Mail-Bestätigung",
      active: "Bonus aktiv",
      notEligible: "Nicht verfügbar",
    },
  },
  response: {
    offer: "Newsletter-Bonus",
    email: "Konto-E-Mail",
    bonusCredits: "Bonus-Credits pro Monat",
    freeRefillAt: "Gratis-Credits werden aufgefüllt am",
  },
  get: {
    title: "Newsletter-Credit-Bonus",
    titleShort: "Newsletter-Bonus",
    description:
      "Zeigt, ob dein Konto den monatlichen Newsletter-Credit-Bonus noch bekommen kann. Nur für Konten.",
  },
  post: {
    title: "Newsletter-Credit-Bonus sichern",
    titleShort: "Newsletter-Bonus sichern",
    description:
      "Meldet deine Konto-E-Mail für den Newsletter an und bringt dir jeden Monat zusätzliche Gratis-Credits. Nur für Konten, einmal pro Konto.",
  },
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Die Anfrage konnte nicht verarbeitet werden",
    },
    unauthorized: {
      title: "Konto erforderlich",
      description:
        "Den Newsletter-Credit-Bonus gibt es nur mit Konto. Registriere dich kostenlos oder melde dich an.",
    },
    forbidden: {
      title: "Nicht erlaubt",
      description: "Du kannst diesen Bonus nicht beanspruchen",
    },
    notFound: {
      title: "Konto nicht gefunden",
      description: "Wir konnten dein Konto nicht finden",
    },
    internal: {
      title: "Da ging was schief",
      description:
        "Der Newsletter-Bonus konnte nicht geprüft werden. Versuch es nochmal.",
    },
  },
  success: {
    title: "Erledigt",
    description: "Status des Newsletter-Bonus geladen",
  },
  widget: {
    available: "+{{bonusCredits}} Gratis-Credits jeden Monat",
    availableHint:
      "Melde {{email}} für den Newsletter an. Vorher bekommst du einen Bestätigungslink.",
    claim: "+{{bonusCredits}} Credits/Monat sichern",
    pending:
      "Schau in dein Postfach ({{email}}). Ein Klick auf den Bestätigungslink schaltet +{{bonusCredits}} Credits/Monat frei.",
    active: "Newsletter-Bonus aktiv: +{{bonusCredits}} Credits/Monat.",
    notEligible: "Für dieses Konto gibt es keinen Newsletter-Bonus.",
    refill: "Deine Gratis-Credits werden am {{date}} aufgefüllt.",
  },
};
