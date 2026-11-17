import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Empfehlungen",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Bonus für Empfehlungscode",
    titleShort: "Code-Bonus",
    description:
      "Lege die einmaligen Bonus-Credits fest, die ein Empfehlungscode neuen Nutzern gibt. Ausgezahlt beim ersten bezahlten Plan, nie bei der Gratis-Anmeldung. 0 entfernt den Bonus.",
    fields: {
      code: {
        label: "Empfehlungscode",
        description:
          "Der Code, der geändert wird (Groß- und Kleinschreibung egal)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Bonus-Credits",
        description: "Einmalig mit dem ersten bezahlten Plan. 0 = kein Bonus.",
        placeholder: "100",
      },
    },
    response: {
      code: "Code",
      ownerEmail: "Code-Inhaber",
      previousBonusCredits: "Bisheriger Bonus",
      subscriptionBonusCredits: "Bonus-Credits",
    },
    widget: {
      back: "Zurück",
      hint: 'Erscheint bei der Anmeldung als "+N Bonus-Credits mit deinem ersten Abo". Einmal pro Nutzer.',
      submit: "Bonus speichern",
      set: "{{code}} ({{owner}}): +{{credits}} Credits mit dem ersten Plan (vorher {{previous}}).",
      cleared: "{{code}} ({{owner}}): kein Bonus (vorher {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe Code und Credit-Anzahl",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich als Admin an, um Code-Boni zu setzen",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Nur Admins setzen Code-Boni",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Code existiert nicht",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Der Code wurde zwischenzeitlich geändert, versuch es erneut",
    },
    server: {
      title: "Serverfehler",
      description: "Bonus konnte nicht gespeichert werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf zuerst deine Änderungen",
    },
    codeNotFound: "Empfehlungscode {{code}} existiert nicht",
  },
  success: {
    title: "Gespeichert",
    description: "Code-Bonus aktualisiert",
  },
};
