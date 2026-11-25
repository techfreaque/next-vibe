import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  title: "Možnosti prihlásenia",
  titleShort: "Možnosti prihlásenia",
  description: "Možnosti konfigurácie prihlásenia",
  tag: "login-options",
  container: {
    title: "Nastavenie prihlásenia",
    description: "Nastavte možnosti prihlásenia",
  },
  fields: {
    email: {
      label: "E-mailová adresa",
      description: "Zadaj e-mailovú adresu",
      placeholder: "meno@example.com",
    },
    allowPasswordAuth: {
      label: "Povoliť prihlásenie heslom",
      description: "Povoliť overenie pomocou hesla",
    },
    allowSocialAuth: {
      label: "Povoliť prihlásenie cez externý účet",
      description: "Povoliť prihlásenie cez externého poskytovateľa",
    },
    maxAttempts: {
      label: "Maximálny počet pokusov o prihlásenie",
      description: "Najvyšší povolený počet pokusov o prihlásenie",
    },
    requireTwoFactor: {
      label: "Vyžadovať dvojfaktorové overenie",
      description: "Pri prihlásení vyžadovať dvojfaktorové overenie",
    },
    socialProviders: {
      label: "Externí poskytovatelia prihlásenia",
      description: "Dostupní externí poskytovatelia prihlásenia",
    },
    socialProvider: {
      title: "Externý poskytovateľ prihlásenia",
      description: "Nastavenie externého poskytovateľa prihlásenia",
      enabled: {
        label: "Zapnuté",
        description: "Určuje, či je tento poskytovateľ povolený",
      },
      name: {
        label: "Názov poskytovateľa",
        description: "Názov externého poskytovateľa prihlásenia",
      },
      providers: {
        label: "Možnosti poskytovateľa",
        description: "Dostupné možnosti externých poskytovateľov",
      },
    },
  },
  response: {
    title: "Výsledok načítania možností prihlásenia",
    description: "Dostupné možnosti nastavenia prihlásenia",
    success: {
      badge: "Úspech",
    },
    message: {
      content: "Správa o stave",
    },
    forUser: {
      content: "E-mailová adresa",
    },
    loginMethods: {
      title: "Spôsoby prihlásenia",
      description: "Dostupné spôsoby overenia",
      password: {
        title: "Prihlásenie heslom",
        description: "Bežné overenie heslom",
        enabled: {
          badge: "Zapnuté",
        },
      },
      social: {
        title: "Prihlásenie cez externý účet",
        description: "Možnosti prihlásenia cez účty sociálnych sietí",
        enabled: {
          badge: "Zapnuté",
        },
        providers: {
          item: {
            title: "Externý poskytovateľ prihlásenia",
            description: "Externý poskytovateľ prihlásenia",
          },
          name: {
            content: "Názov poskytovateľa",
          },
          id: {
            content: "ID poskytovateľa",
          },
          enabled: {
            badge: "Dostupné",
          },
          description: "Opis poskytovateľa",
        },
      },
    },
    security: {
      title: "Bezpečnostné nastavenia",
      description: "Požiadavky na bezpečnosť overovania",
      maxAttempts: {
        content: "Maximálny počet pokusov o prihlásenie",
      },
      requireTwoFactor: {
        badge: "Vyžaduje sa dvojfaktorové overenie",
      },
    },
    recommendations: {
      item: "Odporúčaná možnosť prihlásenia",
    },
  },
  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre požiadavky",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
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
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Zmeny sa neuložili",
    },
  },
  success: {
    title: "Úspech",
    description: "Možnosti prihlásenia boli načítané",
  },
  post: {
    title: "Možnosti prihlásenia",
    description: "Načítajte dostupné možnosti prihlásenia",
    response: {
      title: "Výsledok načítania možností prihlásenia",
      description: "Dostupné možnosti nastavenia prihlásenia",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
    success: {
      description: "Možnosti prihlásenia boli načítané",
    },
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  messages: {
    successMessage: "Možnosti prihlásenia boli načítané",
    passwordAuthDescription: "Prihlás sa e-mailom a heslom",
    socialAuthDescription: "Prihlás sa cez účet sociálnej siete",
    continueWithProvider: "Pokračovať s {{provider}}",
    twoFactorRequired: "Zvýšená bezpečnosť: vyžaduje sa 2FA",
    standardSecurity: "Štandardné bezpečnostné požiadavky",
    tryPasswordFirst: "Najprv skús prihlásenie heslom",
    useSocialLogin: "Použiť prihlásenie cez externý účet",
    socialLoginFaster:
      "Noví používatelia sa cez externý účet prihlásia rýchlejšie",
  },
};
