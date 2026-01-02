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
        suggestion: "Użyj kombinacji liter, cyfr i symboli, aby uzyskać silniejsze hasło",
      },
    },
  },
};
