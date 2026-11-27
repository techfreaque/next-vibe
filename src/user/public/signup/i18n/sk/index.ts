import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "Synchronizovať chyby doručenia pri registrácii",
    description:
      "Skontrolovať systémovú schránku a vyhľadať nedoručené potvrdzovacie e-maily k registráciám.",
    marked: "Registrácie boli aktualizované",
    result: "Aktualizované registrácie: {{count}}",
    productionOnly:
      "Synchronizácia nedoručených registračných e-mailov sa spúšťa len v produkcii.",
    mailboxUnavailable:
      "Nepodarilo sa skontrolovať nedoručené registračné e-maily v systémovej schránke.",
  },
  events: {
    started: "Registrácia sa začala",
    emailSent: "Potvrdzovací e-mail odoslaný",
    sendFailed: "Potvrdzovací e-mail sa nepodarilo odoslať",
    bounced: "Potvrdzovací e-mail sa vrátil ako nedoručený",
    expired: "Platnosť potvrdenia vypršala",
    confirmed: "E-mail potvrdený",
    reminderSent: "Pripomienka odoslaná",
  },
  reminder: {
    subject: "Od účtu {{appName}} ťa delí jedno kliknutie",
    hint: "E-mail k registrácii ešte čaká na potvrdenie. Potvrď ho a každý mesiac dostaneš bezplatné kredity ({{credits}} kred.). Tento kód aj odkaz v tlačidle platia 24 hodín a nahrádzajú tie z prvého e-mailu.",
    button: "Potvrdiť a prihlásiť sa",
    ignore:
      "Ak si sa neregistroval, ignoruj tento e-mail. Bez potvrdenia účet nevznikne.",
  },
  confirmation: {
    linkSent:
      "Poslali sme nový potvrdzovací e-mail. Otvor ho a prihlás sa cez odkaz.",
    bouncedTitle: "Potvrdzovací e-mail sa nepodarilo doručiť",
    changeAddress: "Zmeniť e-mailovú adresu",
    description: "Dokonči registráciu kódom alebo odkazom z e-mailu.",
    title: "Skontroluj si schránku",
    sent: "Zadaj kód, ktorý sme poslali na {{email}}. Platí 30 minút.",
    code: "Šesťmiestny kód",
    confirm: "Potvrdiť a prihlásiť sa",
    change: "Nesprávna adresa? Zmeň ju",
    resend: "Poslať kód znova",
    countdown: "Poslať znova o {{seconds}} s",
    save: "Poslať na túto adresu",
    cancel: "Zrušiť",
    email: "E-mailová adresa",
    hint: "Dokonči registráciu týmto kódom alebo použi odkaz nižšie. Oba platia 30 minút.",
    bounce:
      "Potvrdzovací e-mail sa nepodarilo doručiť na {{email}}. Skontroluj adresu alebo použi inú.",
    bouncePolicy:
      "Poskytovateľ zablokoval náš e-mail. Školské a pracovné schránky často odmietajú správy zvonka. Použi inú adresu.",
    bounceMailboxMissing:
      "Podľa poskytovateľa adresa {{email}} neexistuje. Skontroluj, či v nej nie je preklep, alebo použi inú adresu.",
    bounceMailboxFull:
      "Schránka {{email}} je plná. Uvoľni miesto a vyžiadaj si nový kód alebo zadaj inú adresu.",
    invalid:
      "Kód alebo odkaz je neplatný alebo mu vypršala platnosť. Vyžiadaj si nový kód.",
    cooldown: "Príliš veľa požiadaviek. Počkaj, kým si vyžiadaš ďalší kód.",
    domain: "Táto doména neprijíma e-maily. Skontroluj adresu.",
    sendFailed:
      "E-mail sa nepodarilo odoslať na {{email}}. Skontroluj adresu alebo skús odoslanie zopakovať.",
    done: "E-mail je potvrdený. Prihlásenie prebehlo úspešne.",
    newsletter:
      "Potvrdením sa zároveň prihlásiš na odber noviniek, o ktorý si požiadal.",
    link: "Potvrdiť môj e-mail",
    pendingId: "Identifikátor registrácie",
    token: "Token potvrdzovacieho odkazu",
    callback: "Cesta po potvrdení",
    suggestion: "Máš na mysli {{email}}?",
    expired: "Platnosť registrácie vypršala. Začni znova a dostaneš nový kód.",
    retry: "Začať registráciu odznova",
    subject: "{{code}} je tvoj kód pre {{appName}}",
    wrongCode:
      "Nesprávny kód. Použi kód z najnovšieho e-mailu a skús to znova.",
    staleLink:
      "Tento odkaz je zo staršieho e-mailu. Otvor najnovší alebo zadaj jeho kód.",
    alreadyConfirmed: "Tento e-mail je už potvrdený. Prihlás sa a pokračuj.",
    login: "Prihlásiť sa",
  },
  category: "Používatelia",

  _components: {
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
  },
  title: "Registrácia používateľa",
  titleShort: "Zaregistrovať sa",
  description: "Koncový bod na registráciu používateľa",
  tag: "Overenie",
  form: {
    title: "Vytvoriť si účet",
    description: "Všetky modely. Tvoje pravidlá. Začni zadarmo.",
    privacy:
      "E-mail slúži iba na prihlásenie. Telefón ani kartu nepotrebuješ. Sledovacie nástroje tretích strán nepoužívame.",
  },
  actions: {
    submit: "Poslať potvrdzovací kód",
    submitting: "Odosiela sa kód…",
  },
  fields: {
    privateName: {
      label: "Súkromné meno",
      description: "Takto ťa oslovuje AI. Toto meno neuvidí nikto iný.",
      placeholder: "napr. Alex",
      validation: {
        required: "Súkromné meno je povinné",
        minLength: "Meno musí mať aspoň 2 znaky",
        maxLength: "Meno musí mať menej ako 100 znakov",
      },
    },
    publicName: {
      label: "Verejné meno",
      description: "Zobrazuje sa v zdieľaných četoch a na fórach.",
      placeholder: "napr. alex_builds",
      validation: {
        required: "Zadaj zobrazované meno",
        minLength: "Zobrazované meno musí mať aspoň 2 znaky",
        maxLength: "Zobrazované meno musí mať menej ako 100 znakov",
      },
    },
    email: {
      label: "E-mail",
      description: "Slúži iba na prihlásenie. S nikým ho nezdieľame.",
      placeholder: "you@example.com",
      help: "Tento e-mail bude slúžiť na prihlásenie aj ako hlavný kontakt",
      validation: {
        required: "Zadaj e-mailovú adresu",
        invalid: "Zadaj platnú e-mailovú adresu",
      },
    },
    password: {
      label: "Heslo",
      description:
        "Zadaj aspoň 8 znakov vrátane veľkého a malého písmena a číslice. Heslo si bezpečne ulož. Po zavedení koncového šifrovania obnova hesla vymaže históriu.",
      placeholder: "Vytvoriť heslo",
      validation: {
        required: "Zadaj heslo",
        minLength: "Heslo musí mať aspoň 8 znakov",
        complexity: "Heslo musí obsahovať veľké a malé písmeno a číslicu",
      },
    },
    confirmPassword: {
      label: "Potvrdiť heslo",
      validation: {
        required: "Znova zadaj svoje heslo",
        minLength: "Heslo musí mať aspoň 8 znakov",
        mismatch: "Heslá sa nezhodujú",
      },
    },
    subscribeToNewsletter: {
      label:
        "Prihlás sa na odber noviniek a každý mesiac získaš bezplatné kredity navyše",
      description:
        "Potvrď e-mailovú adresu a aktivuj mesačný bonus za odber noviniek.",
      checkboxLabel: "Odber noviniek: každý mesiac +{{credits}} kred. zdarma",
      hint: "Nové modely a novinky z aplikácie každých pár týždňov. Odber môžeš kedykoľvek zrušiť.",
      tooltip:
        "Potvrď e-mail. Kým odoberáš novinky, získaš každý mesiac {{credits}} kred. navyše, spolu {{total}} kred.",
    },
    acceptTerms: {
      label: "Prijímam podmienky",
      description:
        "Naše podmienky a zásady ochrany osobných údajov rešpektujú tvoju slobodu.",
      termsLink: "podmienky",
      conditionsLink: "zásady ochrany osobných údajov",
      descriptionPrefix: "Naše",
      descriptionAnd: "a",
      descriptionSuffix: "rešpektujú tvoju slobodu.",
      validation: {
        required: "Ak chceš pokračovať, prijmi podmienky",
      },
    },
    referralCode: {
      label: "Kód odporúčania (nepovinné)",
      description:
        "Máš kód od priateľa? Keď si aktivuješ predplatné, dostane províziu.",
      placeholder: "Zadaj kód",
      labelPrefilled: "Kód odporúčania",
      subscriptionBonus: "Bonus k prvému predplatnému: +{{credits}} kred.",
      descriptionPrefilled:
        "Tvoj priateľ dostane odmenu, keď si vytvoríš účet.",
      validation: {
        invalid:
          "Kód odporúčania neexistuje alebo už nie je aktívny. Oprav ho alebo vymaž obsah poľa.",
      },
    },
    supportedSkillId: {
      label: "Podporiť autora",
      description:
        "Registráciou podporíš autora tejto zručnosti. Z tvojich predplatných dostane bonus +5 %.",
      selectorTitle: "Podporiť autora",
      selectorDescription:
        "V obľúbených máš zručnosti od nezávislých autorov. Vyber jedného, ktorého podporíš bonusom vo výške +5 % z tvojich predplatných. Výber môžeš kedykoľvek zmeniť.",
      selectorNone: "Nikoho (preskočiť)",
    },
    localFavorites: {
      label: "Obľúbené v tomto zariadení",
    },
  },

  footer: {
    alreadyHaveAccount: "Už máš účet? Prihlás sa",
  },
  errors: {
    title: "Chyba registrácie",
    validation: {
      title: "Chyba overenia",
      description: "Skontrolujte zadané údaje a skúste to znova",
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
      description: "Vyskytla sa neočakávaná chyba",
    },
    conflict: {
      title: "Konflikt účtu",
      description: "Účet s týmto e-mailom už existuje",
      detail: "Účet s týmto e-mailom už existuje. Prihlás sa.",
    },
    disposableEmail: {
      title: "Vyžaduje sa trvalá e-mailová adresa",
      detail:
        "Pri registrácii použi trvalú e-mailovú adresu. Jednorazové schránky nepodporujeme.",
    },
    subnetSignupLimit: {
      title: "Príliš veľa registrácií z tvojej siete",
      detail:
        "Z tvojej siete dnes vzniklo príliš veľa účtov. Skús to zajtra alebo sa prihlás do existujúceho účtu.",
    },
    userNotFound: "K adrese {{email}} sa nenašiel žiadny účet",
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    network: {
      title: "Chyba siete",
      description: "Vyskytla sa chyba siete",
    },
    notFound: {
      title: "Nenájdené",
      description: "Zdroj sa nenašiel",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Máš neuložené zmeny",
    },
    autoLoginFailed:
      "Účet je vytvorený, no prihlásenie sa nepodarilo. Prihlás sa novým heslom.",
    internal: {
      title: "Registrácia s adresou {{email}} zlyhala: {{error}}",
      description: "Nastala vnútorná chyba",
    },
  },
  emailCheck: {
    title: "Kontrola dostupnosti e-mailu",
    description: "Skontrolujte, či je k dispozícii e-mail pre registráciu",
    tag: "Kontrola e-mailu",
    fields: {
      email: {
        label: "E-mailová adresa",
        description: "E-mail na kontrolu",
        placeholder: "Zadajte e-mailovú adresu",
        validation: {
          invalid: "Neplatný formát e-mailovej adresy",
        },
      },
    },
    response: {
      title: "Výsledok kontroly e-mailu",
      description: "Výsledok kontroly dostupnosti e-mailu",
      available: "Voľná e-mailová adresa",
      message: "Správa o dostupnosti adresy",
    },
    errors: {
      validation: {
        title: "Neplatný e-mail",
        description: "Zadaj platnú e-mailovú adresu",
      },
      internal: {
        title: "Adresu {{email}} sa nepodarilo skontrolovať: {{error}}",
        description: "Chyba pri kontrole dostupnosti e-mailovej adresy",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      conflict: {
        title: "E-mail už patrí k účtu",
        description: "Tento e-mail je už registrovaný",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie overiť túto e-mailovú adresu",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete pri kontrole e-mailu",
      },
      notFound: {
        title: "Služba sa nenašla",
        description: "Služba kontroly e-mailu nie je k dispozícii",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na kontrolu e-mailovej adresy sa musíte prihlásiť",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
    },
    success: {
      title: "Kontrola e-mailu dokončená",
      description: "Dostupnosť e-mailovej adresy bola overená",
    },
  },
  post: {
    title: "Registrácia",
    description: "Koncový bod registrácie",
    form: {
      title: "Nastavenie registrácie",
      description: "Nastavte parametre registrácie",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede registrácie",
      success: "Registrácia prebehla úspešne",
      message: "Správa o stave",
      userId: "ID používateľa",
      nextSteps: "Ďalšie kroky",
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
      unsaved: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
      processing: "Signup úspešne spracovanie",
    },
  },
  response: {
    title: "Odpoveď",
    description: "Údaje odpovede registrácie",
    success: "Registrácia prebehla úspešne",
    message: "Správa o stave",
    user: {
      id: "ID používateľa",
      email: "E-mailová adresa",
      firstName: "Krstné meno",
      lastName: "Priezvisko",
      privateName: "Súkromné meno",
      publicName: "Verejné meno",
      imageUrl: "URL profilového obrázka",
      verificationRequired: "Vyžaduje sa overenie",
    },
    verificationInfo: {
      title: "Overenie e-mailom",
      description: "Podrobnosti o procese overovania e-mailu",
      emailSent: "E-mail odoslaný",
      expiresAt: "Platnosť overenia do",
      checkSpamFolder: "Skontrolovať priečinok Spam",
    },
    nextSteps: "Ďalšie kroky",
  },
  success: {
    title: "Skontroluj si schránku",
    description: "Zadaj kód z e-mailu.",
  },
  admin_notification: {
    title: "Registrácia nového používateľa",
    subject: "Nová registrácia: {{privateName}}",
    preview: "Nový používateľ {{privateName}} sa zaregistroval",
    message: "Na {{appName}} sa zaregistroval nový používateľ",
    privateName: "Súkromné meno",
    publicName: "Verejné meno",
    email: "E-mail",
    locale: "Jazyk",
    creditBalance: "Zostatok kreditov",
    leadCreditBalance: "Zostatok kreditov potenciálneho zákazníka",
    signup_preferences: "Preferencie pre registráciu",
    user_details: "Údaje o používateľovi",
    basic_information: "Základné informácie",
    signup_type: "Typ registrácie",
    direct_signup: "Priama registrácia",
    newsletter: "Odber noviniek",
    subscribed: "Odber aktívny",
    not_subscribed: "Bez odberu",
    signup_details: "Detaily registrácie",
    signup_date: "Dátum registrácie",
    user_id: "ID používateľa",
    recommended_next_steps: "Odporúčané ďalšie kroky",
    direct_recommendation:
      "Skontrolovať profil používateľa a nastavenie platby",
    contact_user: "Kontaktujte používateľa",
    footer: "Toto je automatické oznámenie od {{appName}}",
  },
  email: {
    subject: "Hotovo. Môžeš začať používať {{appName}}",
    previewText:
      "Ahoj, {{privateName}}! Tvoj účet je pripravený. Rozprávaj sa s modelmi Claude, GPT, Gemini, DeepSeek a ďalšími. Počet ďalších modelov: {{modelCount}}. Zadarmo a bez karty.",
    headline: "Tvoja AI už čaká.",
    greeting: "Ahoj, {{privateName}},",
    intro:
      "Vitaj v {{appName}}. Všetko, čo máš rád na ChatGPT, a navyše modely s otvoreným kódom a bez obsahových filtrov. Jeden účet na všetko.",
    models: {
      title: "Počet modelov v troch kategóriách: {{modelCount}}",
      mainstream: "Známe modely",
      open: "Otvorený kód",
      uncensored: "Bez cenzúry",
    },
    free: {
      title: "Čo máš navždy zadarmo",
      credits:
        "Každý mesiac dostaneš {{freeCreditsSignedIn}} kred. zdarma a za odber noviniek ďalších {{freeCreditsNewsletterBonus}} kred. Platobnú kartu nepotrebuješ.",
      allModels: "Prístup ku všetkým modelom AI ({{modelCount}})",
      uncensored: "Modely bez cenzúry, ktoré na tvoje otázky odpovedajú",
      chatModes: "Súkromný, zdieľaný a verejný čet aj režim inkognito",
      noCard: "Platobnú kartu nepotrebuješ. Ani neskôr.",
    },
    verify: {
      note: "Bezplatné kredity sa aktivujú po potvrdení tejto adresy.",
      cta: "Potvrď e-mail a získaj {{freeCreditsSignedIn}} kred.",
    },
    ctaButton: "Začať četovať",
    upgrade: {
      title: "Chceš viac?",
      desc: "Predplatné začína na {{subscriptionPrice}} mesačne za {{subscriptionCredits}} kred. Najvyšší plán zahŕňa {{ultraCredits}} kred. za {{ultraPrice}}. Predplatitelia si môžu dokúpiť balíky kreditov, ktorým nevyprší platnosť.",
      cta: "Pozrieť si plány",
    },
    signoff: "Príjemné rozhovory,\nTím {{appName}}",
    ps: "P. S. V režime inkognito ostanú konverzácie len v tvojom zariadení. Na serveroch ich neukladáme. Vygenerované médiá ukladáme z technických dôvodov dočasne.",
  },
  emailTemplates: {
    welcome: {
      name: "Uvítací e-mail po registrácii",
      description: "Uvítací e-mail odoslaný po úspešnej registrácii",
      category: "Overenie",
      preview: {
        privateName: {
          label: "Súkromné meno",
          description: "Súkromné meno používateľa",
        },
        userId: {
          label: "ID používateľa",
          description: "Jedinečný identifikátor používateľa",
        },
        leadId: {
          label: "ID potenciálneho zákazníka",
          description: "ID kontaktu priradeného k používateľovi",
        },
      },
    },
    adminSignup: {
      name: "Oznámenie správcovi o novej registrácii",
      description: "E-mail správcom po registrácii nového používateľa",
      category: "Správa",
      preview: {
        privateName: {
          label: "Súkromné meno",
        },
        publicName: {
          label: "Verejné meno",
        },
        email: {
          label: "E-mailová adresa",
        },
        userId: {
          label: "ID používateľa",
        },
        subscribeToNewsletter: {
          label: "Odber noviniek",
        },
      },
    },
  },
};
