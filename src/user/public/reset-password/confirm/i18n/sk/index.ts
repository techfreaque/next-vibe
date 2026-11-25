import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  title: "Potvrdiť obnovu hesla",
  description: "Potvrď obnovu hesla nastavením nového hesla",
  tag: "Obnovenie hesla",
  email: {
    title: "Heslo bolo obnovené",
    subject: "Heslo k účtu {{appName}} bolo obnovené",
    previewText:
      "Heslo k účtu {{appName}} bolo obnovené. Prihlás sa a četuj s AI. Počet modelov na výber: {{modelCount}}.",
    greeting: "Ahoj, {{name}},",
    successMessage:
      "Heslo bolo obnovené. Prihlás sa a pokračuj tam, kde si skončil.",
    loginButton: "Prihlásiť sa do {{appName}}",
    promoText:
      "Modely AI na výber: {{modelCount}}. Bez filtrov a bez poučovania.",
    securityWarning:
      "Ak si heslo nemenil, ihneď kontaktuj podporu. Tvoj účet môže byť ohrozený.",
  },
  groups: {
    verification: {
      title: "Overenie",
      description: "Over žiadosť o obnovu hesla",
    },
    newPassword: {
      title: "Nové heslo",
      description: "Nastav nové heslo",
    },
  },
  fields: {
    token: {
      label: "Token na obnovu hesla",
      description: "Token na obnovu hesla z e-mailu",
      placeholder: "Zadaj token na obnovu hesla",
      help: "Token na obnovu hesla nájdeš v e-maile. Zadaj ho sem.",
      validation: {
        required: "Zadaj token na obnovu hesla",
      },
    },
    email: {
      label: "E-mailová adresa",
      description: "Tvoja e-mailová adresa",
      placeholder: "Zadaj e-mailovú adresu",
      validation: {
        invalid: "Zadaj platnú e-mailovú adresu",
      },
    },
    password: {
      label: "Nové heslo",
      description: "Tvoje nové heslo",
      placeholder: "Zadaj nové heslo",
      help: "Vyber silné heslo s aspoň 8 znakmi vrátane písmen, číslic a symbolov",
      validation: {
        minLength: "Heslo musí mať aspoň 8 znakov",
      },
    },
    confirmPassword: {
      label: "Potvrdenie hesla",
      description: "Potvrď nové heslo",
      placeholder: "Potvrdiť nové heslo",
      validation: {
        minLength: "Heslo musí mať aspoň 8 znakov",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "Heslá sa nezhodujú",
    },
  },
  response: {
    title: "Výsledok obnovy hesla",
    description: "Odpoveď na potvrdenie obnovy hesla",
    message: {
      label: "Správa",
      description: "Správa v odpovedi",
    },
    securityTip: "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
    nextSteps: [
      "Prihlás sa novým heslom",
      "Aktualizuj uložené heslá v prehliadači",
      "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
    ],
  },
  errors: {
    title: "Chyba pri obnove hesla",
    no_email: "K tejto e-mailovej adrese sa nenašiel žiadny účet",
    validation: {
      title: "Chyba overenia",
      description: "Skontrolujte zadané údaje a skúste to znova",
      passwordsDoNotMatch: "Heslá sa nezhodujú",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description:
        "Token na obnovu hesla je neplatný alebo mu vypršala platnosť",
    },
    internal: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
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
      description: "Nemáš oprávnenie vykonať túto akciu",
    },
    notFound: {
      title: "Nenájdené",
      description:
        "Token na obnovu hesla sa nenašiel alebo mu vypršala platnosť",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Pri spracovaní tvojej požiadavky došlo ku konfliktu",
    },
  },
  success: {
    title: "Heslo bolo obnovené",
    description: "Tvoje heslo bolo obnovené",
    message: "Heslo bolo obnovené",
    password_reset: "Tvoje heslo bolo obnovené",
  },
  actions: {
    requestNewLink: "Vyžiadať nový odkaz na obnovu hesla",
  },
  emailTemplates: {
    confirm: {
      name: "Potvrdzovací e-mail po obnove hesla",
      description:
        "Potvrdzovací e-mail odoslaný používateľovi po úspešnej obnove hesla",
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
      },
    },
  },
};
