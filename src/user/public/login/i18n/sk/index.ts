import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",
  title: "Vitaj späť",
  titleShort: "Prihlásiť sa",
  description:
    "Získaj prístup k modelom AI bez cenzúry aj k histórii svojich četov.",
  tag: "Overenie",
  options: {
    category: "Používatelia",

    title: "Možnosti prihlásenia",
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
      socialAuthDescription:
        "Prihlásenie cez externý účet zatiaľ nie je dostupné. Použi e-mail a heslo.",
      continueWithProvider: "Pokračovať s {{provider}}",
      twoFactorRequired: "Zvýšená bezpečnosť: vyžaduje sa 2FA",
      standardSecurity: "Štandardné bezpečnostné požiadavky",
      tryPasswordFirst: "Najprv skús prihlásenie heslom",
      useSocialLogin: "Použiť prihlásenie cez externý účet",
      socialLoginFaster:
        "Noví používatelia sa cez externý účet prihlásia rýchlejšie",
    },
  },
  actions: {
    submit: "Prihlásiť sa",
    submitting: "Prihlasuje sa…",
  },
  fields: {
    email: {
      label: "Tvoj e-mail",
      description: "E-mailová adresa použitá pri registrácii.",
      placeholder: "Zadaj e-mail",
      validation: {
        required: "Zadaj e-mailovú adresu",
        invalid: "Zadaj platnú e-mailovú adresu",
      },
    },
    password: {
      label: "Tvoje heslo",
      description: "Zadaj heslo, ktoré si nastavil pri registrácii.",
      placeholder: "Zadaj heslo",
      help: "Zadaj heslo k účtu",
      validation: {
        required: "Zadaj heslo",
        minLength: "Heslo musí mať aspoň 8 znakov",
      },
    },
    twoFactorCode: {
      label: "Overovací kód",
      description:
        "Použi kód z overovacej aplikácie alebo kód na obnovu prístupu.",
      placeholder: "Šesťmiestny kód",
    },
    rememberMe: {
      label: "Zostať prihlásený",
    },
  },
  emailCode: "Kód na potvrdenie e-mailu",
  twoFactorStep: {
    title: "Dvojstupňové overenie",
    helper: "Zadaj šesťmiestny kód z overovacej aplikácie.",
    recoveryHelper:
      "Zadaj jeden z kódov na obnovu prístupu. Každý platí len raz.",
    codeLabel: "Overovací kód",
    recoveryLabel: "Kód na obnovu prístupu",
    recoveryPlaceholder: "XXXXX-XXXXX",
    useRecovery: "Použiť kód na obnovu prístupu",
    useApp: "Použiť overovaciu aplikáciu",
    verify: "Overiť",
    verifying: "Overuje sa…",
    back: "Späť",
  },
  groups: {
    credentials: {
      title: "Prihlasovacie údaje",
      description: "Zadaj prihlasovacie údaje",
    },
    options: {
      title: "Možnosti prihlásenia",
      description: "Ďalšie možnosti a nastavenia prihlásenia",
    },
    preferences: {
      title: "Nastavenia prihlásenia",
      description: "Ďalšie možnosti prihlásenia",
    },
    advanced: {
      title: "Pokročilé možnosti",
      description: "Pokročilé nastavenia prihlásenia",
    },
  },
  footer: {
    forgotPassword: "Zabudol si heslo?",
    createAccount: "Ešte nemáš účet? Zaregistruj sa",
  },
  response: {
    title: "Výsledok prihlásenia",
    description: "Údaje o výsledku prihlásenia",
    success: "Prihlásenie prebehlo úspešne",
    message: "Správa o stave",
    user: {
      title: "Údaje o používateľovi",
      description: "Údaje o prihlásenom používateľovi",
      id: "ID používateľa",
      email: "E-mailová adresa",
      firstName: "Krstné meno",
      lastName: "Priezvisko",
      privateName: "Súkromné meno",
      publicName: "Verejné meno",
      imageUrl: "Profilový obrázok",
    },
    sessionInfo: {
      title: "Údaje o relácii",
      description: "Podrobnosti o relácii používateľa",
      expiresAt: "Platnosť relácie do",
      rememberMeActive: "Stav trvalého prihlásenia",
      loginLocation: "Miesto prihlásenia",
    },
    nextSteps: {
      title: "Ďalšie kroky",
      item: "Ďalšie kroky",
    },
  },
  errors: {
    title: "Chyba prihlásenia",
    account_suspended:
      "Účet je pozastavený. Ak si myslíš, že ide o chybu, kontaktuj podporu.",
    account_locked:
      "Príliš veľa neúspešných pokusov. Počkaj 15 minút alebo obnov heslo. Ak ešte nemáš účet, zaregistruj sa.",
    accountLocked: "Účet je uzamknutý",
    accountLockedDescription: "Tvoj účet je uzamknutý. Kontaktuj podporu.",
    pendingEmail: "Pred prihlásením potvrď e-mail.",
    resendPending: "Poslať potvrdzovací e-mail znova",
    invalid_credentials:
      "Nesprávny e-mail alebo heslo. Ak ešte nemáš účet, zaregistruj sa.",
    two_factor_required: "Vyžaduje sa dvojfaktorové overenie",
    invalid_two_factor_code: "Neplatný overovací kód",
    auth_error: "Prihlásenie s adresou {{email}} zlyhalo: {{error}}",
    user_not_found: "Používateľ s ID {{userId}} sa nenašiel",
    session_creation_failed:
      "Reláciu pre používateľa {{userId}} sa nepodarilo vytvoriť: {{error}}",
    token_save_failed: "Overovací token sa nepodarilo uložiť",
    validation: {
      title: "Kontrola údajov zlyhala",
      description: "Skontroluj zadané údaje",
    },
    unauthorized: {
      title: "Prihlásenie zlyhalo",
      description: "Neplatné prihlasovacie údaje",
    },
    unknown: {
      title: "Chyba prihlásenia",
      description: "Pri prihlásení nastala chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Spojenie zlyhalo",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prihlásenie nie je povolené",
    },
    notFound: {
      title: "Používateľ sa nenašiel",
      description: "Používateľský účet sa nenašiel",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Zmeny sa neuložili",
    },
    conflict: {
      title: "Konflikt prihlásenia",
      description: "Pri prihlásení nastal konflikt",
    },
    server: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
  },
  success: {
    title: "Prihlásenie prebehlo úspešne",
    description: "Prihlásenie je dokončené",
    message: "Vitaj späť. Prihlásenie prebehlo úspešne.",
  },
  token: {
    save: {
      failed: "Overovací token sa nepodarilo uložiť",
      success: "Overovací token bol uložený",
    },
  },
  process: {
    failed: "Prihlásenie zlyhalo",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "Rýchle prihlásenie pre vývojárov",
  },
};
