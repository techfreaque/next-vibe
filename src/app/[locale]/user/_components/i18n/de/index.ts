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
  },
};
