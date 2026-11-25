import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  passwordStrength: {
    label: "Sila hesla",
    weak: "Slabé",
    fair: "Prijateľné",
    good: "Dobré",
    strong: "Silné",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Minimálne 8 znakov",
      },
      uppercase: {
        icon: "✗",
        text: "Najmenej jedno veľké písmeno",
      },
      lowercase: {
        icon: "✗",
        text: "Najmenej jedno malé písmeno",
      },
      number: {
        icon: "✗",
        text: "Aspoň jedna číslica",
      },
      special: {
        icon: "!",
        text: "Špeciálny znak (nepovinný, zvyšuje silu hesla)",
      },
    },
  },
  post: {
    title: "_components",
    description: "Koncový bod _components",
    form: {
      title: "Nastavenie _components",
      description: "Nastavte parametre _components",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede _components",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt údajov",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
    },
  },
};
