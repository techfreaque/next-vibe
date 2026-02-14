import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: {
    common: {
      passwordStrength: {
        label: "Siła hasła",
        weak: "Słabe",
        fair: "Średnie",
        good: "Dobre",
        strong: "Silne",
        suggestion:
          "Użyj kombinacji liter, cyfr i symboli, aby uzyskać silniejsze hasło",
      },
    },
    passwordStrength: {
      requirement: {
        minLength: {
          icon: "✗",
          text: "Co najmniej 8 znaków",
        },
        lowercase: {
          icon: "✗",
          text: "Zawiera małą literę",
        },
        uppercase: {
          icon: "✗",
          text: "Zawiera wielką literę",
        },
        number: {
          icon: "✗",
          text: "Zawiera cyfrę",
        },
        special: {
          icon: "✗",
          text: "Zawiera znak specjalny",
        },
      },
    },
  },
};
