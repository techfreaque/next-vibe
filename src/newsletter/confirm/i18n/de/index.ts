import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  token: {
    label: "Bestätigungscode",
    description: "Der Code aus dem Link in deiner Willkommens-E-Mail",
    placeholder: "Code aus der E-Mail einfügen",
  },
  response: {
    confirmed: "Bestätigt",
    email: "E-Mail",
    bonusCredits: "Bonus-Credits pro Monat",
  },
  post: {
    title: "Newsletter-E-Mail bestätigen",
    titleShort: "E-Mail bestätigen",
    description:
      "Newsletter-Adresse mit dem Code aus der Willkommens-E-Mail bestätigen. Schaltet den monatlichen Gratis-Credit-Bonus frei.",
    errors: {
      validation: {
        title: "Ungültiger Code",
        description: "Der Bestätigungscode fehlt oder ist fehlerhaft",
      },
      notFound: {
        title: "Link abgelaufen oder ungültig",
        description:
          "Dieser Bestätigungslink ist nicht gültig. Melde dich erneut an, um einen neuen zu bekommen.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      internal: {
        title: "Bestätigung fehlgeschlagen",
        description: "Bei uns ist etwas schiefgelaufen. Öffne den Link erneut.",
      },
    },
    success: {
      title: "E-Mail bestätigt",
      description: "Der Bonus gilt für dein Gratis-Konto",
    },
  },
  widget: {
    heroTitle: "Ein Klick. +{{bonusCredits}} Credits jeden Monat.",
    heroDescription:
      "Bestätige deine Adresse. Mit Gratis-Konto landet der Bonus sofort auf deinem Kontingent.",
    confirmButton: "E-Mail bestätigen",
    confirming: "Wird bestätigt...",
    confirmedTitle:
      "Bestätigt. +{{bonusCredits}} Credits pro Monat auf deinem Gratis-Konto.",
    confirmedDescription:
      "Angemeldet? Dann steckt der Bonus schon in deinem Gratis-Guthaben und erneuert sich monatlich, solange du dabei bleibst. Noch kein Konto? Registriere dich kostenlos in diesem Browser und schalte ihn frei.",
    startChatting: "Loschatten",
  },
};
