import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: {
    common: {
      passwordStrength: {
        label: "Passwortstärke",
        weak: "Schwach",
        fair: "Ausreichend",
        good: "Gut",
        strong: "Stark",
        suggestion:
          "Verwenden Sie eine Mischung aus Buchstaben, Zahlen und Symbolen für ein stärkeres Passwort",
      },
    },
    passwordStrength: {
      requirement: {
        minLength: {
          icon: "✗",
          text: "Mindestens 8 Zeichen",
        },
        lowercase: {
          icon: "✗",
          text: "Enthält einen Kleinbuchstaben",
        },
        uppercase: {
          icon: "✗",
          text: "Enthält einen Großbuchstaben",
        },
        number: {
          icon: "✗",
          text: "Enthält eine Zahl",
        },
        special: {
          icon: "✗",
          text: "Enthält ein Sonderzeichen",
        },
      },
    },
  },
};
