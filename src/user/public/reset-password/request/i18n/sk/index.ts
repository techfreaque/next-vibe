import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",
  title: "Žiadosť o obnovu hesla",
  description: "Vyžiadať obnovu hesla",
  tag: "Obnovenie hesla",
  ui: {
    title: "Obnoviť heslo",
    subtitle: "Zadaj e-mailovú adresu a pošleme ti odkaz na obnovu hesla",
    sendResetLink: "Poslať odkaz na obnovu hesla",
    alreadyHaveAccount: "Už máš účet? Prihlás sa",
  },
  actions: {
    submitting: "Odosiela sa…",
  },
  email: {
    title: "Obnoviť heslo k účtu {{appName}}",
    subject: "Žiadosť o obnovu hesla k účtu {{appName}}",
    previewText:
      "Obnov si heslo k účtu {{appName}}. Platnosť odkazu v hodinách: {{hours}}.",
    greeting: "Ahoj, {{name}},",
    requestInfo:
      "Niekto požiadal o obnovu hesla k tvojmu účtu {{appName}}. Ak si to bol ty, použi tlačidlo nižšie.",
    buttonText: "Obnoviť moje heslo",
    expirationInfo:
      "Platnosť odkazu v hodinách: {{hours}}. Ak si o obnovu nežiadal, e-mail ignoruj. Heslo sa nezmenilo.",
    signoff: "Tím {{appName}}",
    promoText:
      "Modely AI na výber: {{modelCount}}. Bez filtrov a bez poučovania.",
  },
  groups: {
    emailInput: {
      title: "E-mailová adresa",
      description:
        "Zadaj e-mailovú adresu, na ktorú máme poslať pokyny na obnovu hesla",
    },
  },
  fields: {
    email: {
      label: "E-mailová adresa",
      description: "Zadaj e-mailovú adresu",
      placeholder: "meno@example.com",
      help: "Zadaj e-mailovú adresu priradenú k tvojmu účtu",
      validation: {
        invalid: "Zadaj platnú e-mailovú adresu",
      },
    },
  },
  response: {
    title: "Výsledok žiadosti o obnovu hesla",
    description: "Odpoveď na žiadosť o obnovenie hesla",
    success: {
      message: "Odkaz na obnovu hesla bol odoslaný",
    },
    deliveryInfo: {
      estimatedTime: "do 5 minút",
      expiresAt: "O 4 hodiny",
    },
    nextSteps: {
      checkEmail: "Skontroluj doručenú poštu aj priečinok so spamom",
      clickLink: "Klikni na odkaz na obnovu hesla v e-maile",
      createPassword: "Vytvor si nové silné heslo",
    },
  },
  errors: {
    title: "Chyba",
    validation: {
      title: "Chyba overenia",
      description: "Zadané údaje sú neplatné",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na túto požiadavku nemáš oprávnenie",
    },
    internal: {
      title: "Interná chyba",
      description: "Interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Chyba sieťového pripojenia",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    notFound: {
      title: "Nenájdené",
      description: "Zdroj sa nenašiel",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Zmeny sa neuložili",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Vyskytol sa konflikt údajov",
    },
    no_email: "K adrese {{email}} sa nenašiel žiadny účet",
    email_generation_failed:
      "Nepodarilo sa pripraviť e-mail na obnovu hesla pre {{email}}: {{errorMessage}}",
  },
  success: {
    title: "Žiadosť odoslaná",
    description: "Žiadosť o obnovu hesla bola odoslaná",
  },
  post: {
    title: "Žiadosť",
    description: "Koncový bod požiadavky",
    form: {
      title: "Konfigurácia žiadosti",
      description: "Nastavte parametre požiadavky",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede na požiadavku",
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
  emailTemplates: {
    request: {
      name: "E-mail s odkazom na obnovu hesla",
      description: "E-mail s odkazom na obnovu hesla",
      category: "Overenie",
      preview: {
        publicName: {
          label: "Verejné meno",
          description: "Verejné zobrazovacie meno používateľa",
        },
        userId: {
          label: "ID používateľa",
          description: "Jedinečný identifikátor používateľa",
        },
        passwordResetUrl: {
          label: "URL na obnovu hesla",
          description: "URL na obnovu hesla",
        },
      },
    },
  },
};
