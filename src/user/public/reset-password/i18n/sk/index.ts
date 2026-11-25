import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "Používatelia",

    title: "Potvrdiť obnovu hesla",
    titleShort: "Potvrdiť obnovu",
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
      securityTip:
        "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
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
  },
  request: {
    category: "Používatelia",
    title: "Žiadosť o obnovu hesla",
    titleShort: "Obnoviť heslo",
    description: "Vyžiadať obnovu hesla",
    tag: "Obnovenie hesla",
    ui: {
      title: "Obnov si heslo",
      subtitle: "Zadaj e-mailovú adresu. Pošleme ti odkaz na obnovu hesla.",
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
        label: "E-mail",
        description: "Zadaj e-mailovú adresu",
        placeholder: "you@example.com",
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
      no_email: "K tejto e-mailovej adrese sa nenašiel žiadny účet",
      email_generation_failed: "E-mail sa nepodarilo vytvoriť",
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
  },
  validate: {
    category: "Používatelia",

    title: "Overiť token na obnovu hesla",
    titleShort: "Overiť token",
    description: "Koncový bod na overenie tokenu na obnovu hesla",
    tag: "Overenie žiadosti o obnovu hesla",
    groups: {
      tokenInput: {
        title: "Overenie tokenu",
        description: "Zadaj token na obnovu hesla, ktorý chceš overiť",
      },
    },
    fields: {
      token: {
        label: "Token na obnovu hesla",
        description: "Token na obnovu hesla z e-mailu",
        placeholder: "Zadaj token na obnovu hesla",
        help: "Zadaj token, ktorý ti prišiel e-mailom",
        validation: {
          required: "Zadaj token na obnovu hesla",
        },
      },
    },
    response: {
      title: "Výsledok overenia",
      description: "Výsledok overenia tokenu",
      valid: "Token je platný",
      message: "Správa o overení",
      validationMessage: "Overenie tokenu na obnovu hesla sa dokončilo",
      userId: "ID používateľa",
      expiresAt: "Platnosť tokenu do",
      nextSteps: {
        item: "Ďalšie kroky po overení",
        setPassword: "Pokračuj nastavením nového hesla",
        choosePassword: "Vyber si silné a jedinečné heslo",
      },
    },
    errors: {
      title: "Chyba",
      validation: {
        title: "Chyba overenia",
        description: "Token sa nepodarilo overiť",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Token je neplatný alebo mu vypršala platnosť",
      },
      internal: {
        title: "Interná chyba",
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
        description: "Token sa nenašiel",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Zistili sa neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt údajov",
      },
    },
    success: {
      title: "Token je platný",
      description: "Token na obnovu hesla je platný",
    },
    post: {
      title: "Overiť",
      description: "Koncový bod overenia",
      form: {
        title: "Nastavenie overenia",
        description: "Nastavte parametre overenia",
      },
      response: {
        title: "Odpoveď",
        description: "Údaje odpovede po overení",
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
  },
  actions: {
    back: "Späť",
    submit: "Odoslať",
    submitting: "Odosiela sa…",
  },
  success: {
    password_reset: "Tvoje heslo bolo obnovené.",
  },
  errors: {
    tokenValidationFailed: "Token sa nepodarilo overiť",
    userLookupFailed: "Používateľa sa nepodarilo vyhľadať",
    tokenDeletionFailed: "Nepodarilo sa odstrániť token",
    userDeletionFailed: "Nepodarilo sa odstrániť používateľa",
    resetFailed: "Obnova hesla zlyhala",
    tokenCreationFailed: "Token na obnovu hesla sa nepodarilo vytvoriť",
    noDataReturned: "Databáza nevrátila žiadne údaje",
    tokenInvalid: "Token na obnovu hesla je neplatný",
    tokenExpired: "Platnosť tokenu na obnovu hesla vypršala",
    tokenVerificationFailed: "Overenie tokenu zlyhalo",
    userNotFound: "Používateľ sa nenašiel",
    passwordUpdateFailed: "Heslo sa nepodarilo zmeniť",
    passwordResetFailed: "Obnova hesla zlyhala",
    requestFailed: "Žiadosť o obnovu hesla zlyhala",
    emailMismatch: "E-mailová adresa sa nezhoduje",
    confirmationFailed: "Obnovu hesla sa nepodarilo potvrdiť",
  },
};
