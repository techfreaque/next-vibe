import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Vytvoriť platbu za predplatné",
    description: "Vytvorí platobnú reláciu v Stripe na nákup predplatného",
    category: "Predplatné",

    // Tags
    tags: {
      subscription: "predplatné",
      checkout: "platba",
      stripe: "stripe",
    },

    // Form configuration
    form: {
      title: "Nastavenie platby",
      description: "Nastav parametre platobnej relácie",
      fields: {
        planId: {
          label: "Plán predplatného",
          description: "Vyber plán predplatného",
          placeholder: "Vyber plán",
        },
        billingInterval: {
          label: "Fakturačný interval",
          description: "Vyber frekvenciu fakturácie",
          placeholder: "Vyber fakturačný interval",
        },
        provider: {
          label: "Poskytovateľ platby",
          description: "Vyber spôsob platby",
          placeholder: "Vyber poskytovateľa platby",
        },
        metadata: {
          label: "Metadáta",
          description: "Doplňujúce metadáta platobnej relácie",
          placeholder: "Zadaj metadáta ako JSON",
        },
      },
    },

    // Response fields
    response: {
      success: "Platobná relácia sa úspešne vytvorila",
      sessionId: "ID relácie Stripe",
      checkoutUrl: "Adresa URL platby",
      message: "Stavová správa",
    },

    // Error types
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie na prístup",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },

    // Success types
    success: {
      title: "Úspech",
      description: "Platobná relácia sa úspešne vytvorila",
    },

    // POST endpoint specific translations
    post: {
      title: "Vytvoriť platobnú reláciu",
      description: "Vytvorí novú platobnú reláciu pre predplatné",
      form: {
        title: "Nastavenie platobnej relácie",
        description: "Nastav parametre platobnej relácie",
      },
      response: {
        title: "Výsledok platby",
        description: "Výsledné údaje platobnej relácie",
      },
      errors: {
        alreadySubscribed: {
          title: "Predplatné už existuje",
          description: "Už máš aktívne predplatné",
        },
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre platby",
          reason: {
            enterpriseCustomPricing:
              "Plán ENTERPRISE vyžaduje individuálnu cenu",
          },
        },
        network: {
          title: "Chyba siete",
          description: "Chyba sieťového pripojenia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáš oprávnenie na prístup",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Platobná relácia sa nenašla",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neznáma chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
      },
      success: {
        title: "Úspech",
        description: "Platobná relácia sa úspešne vytvorila",
      },
    },

    // General error message
    error: "Pri platbe nastala chyba",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Mesačne",
      yearly: "Ročne",
    },
  },

  // Main subscription domain
  category: "Fakturácia",

  // Tags
  tags: {
    subscription: "predplatné",
    billing: "fakturácia",
    get: "získať",
    create: "vytvoriť",
    update: "upraviť",
    cancel: "zrušiť",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Plán Starter",
    },
    professional: {
      title: "Plán Professional",
    },
    premium: {
      title: "Plán Premium",
    },
    enterprise: {
      title: "Plán Enterprise",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Mesačne",
    yearly: "Ročne",
  },

  // GET endpoint
  get: {
    title: "Načítať predplatné",
    titleShort: "Moje predplatné",
    description: "Načíta podrobnosti aktuálneho predplatného",
    form: {
      title: "Podrobnosti predplatného",
      description: "Pozri si údaje o aktuálnom predplatnom",
    },
  },

  // POST endpoint
  post: {
    title: "Vytvoriť predplatné",
    titleShort: "Vytvoriť reláciu",
    description: "Vytvorí nové predplatné",
    form: {
      title: "Vytvorenie predplatného",
      description: "Vytvorí nové predplatné s vybraným plánom",
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj údaje predplatného a skús znova",
      },
      network: {
        title: "Chyba pripojenia",
        description:
          "Pripojenie sa nepodarilo. Skontroluj internet a skús znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš vytvoriť predplatné, prihlás sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie vytvoriť predplatné",
      },
      notFound: {
        title: "Plán sa nenašiel",
        description: "Vybraný plán predplatného sa nenašiel",
      },
      server: {
        title: "Niečo sa pokazilo",
        description: "Predplatné sa nepodarilo vytvoriť. Skús znova",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Vyskytla sa neočakávaná chyba. Skús znova",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      conflict: {
        title: "Predplatné už existuje",
        description: "Už máš aktívne predplatné",
      },
    },
    success: {
      title: "Predplatné vytvorené",
      description: "Tvoje predplatné je aktívne",
    },
  },

  // PUT endpoint
  put: {
    title: "Upraviť predplatné",
    titleShort: "Upraviť predplatné",
    description: "Upraví existujúce predplatné",
    form: {
      title: "Úprava predplatného",
      description: "Zmeň plán alebo fakturačný interval predplatného",
    },
    errors: {
      validation: {
        title: "Neplatná zmena",
        description: "Skontroluj zmeny a skús znova",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Zmeny sa nepodarilo uložiť. Skús znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš upraviť predplatné, prihlás sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie upraviť toto predplatné",
      },
      notFound: {
        title: "Predplatné sa nenašlo",
        description: "Predplatné na úpravu sa nenašlo",
      },
      server: {
        title: "Úprava zlyhala",
        description: "Zmeny sa nepodarilo uložiť. Skús znova",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Vyskytla sa neočakávaná chyba. Skús znova",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      conflict: {
        title: "Konflikt pri úprave",
        description:
          "Predplatné sa medzičasom zmenilo. Obnov údaje a skús znova",
      },
    },
    submit: {
      label: "Upraviť predplatné",
      loading: "Upravuje sa…",
    },
    success: {
      title: "Predplatné upravené",
      description: "Tvoje predplatné sa úspešne upravilo",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Zrušiť predplatné",
    titleShort: "Zrušiť predplatné",
    description: "Zruš predplatné",
    warning: "Po zrušení sa prístup skončí na konci fakturačného obdobia.",
    form: {
      title: "Zrušenie predplatného",
      description: "Zruš predplatné s voliteľnými nastaveniami",
    },
    errors: {
      validation: {
        title: "Neplatná požiadavka",
        description: "Skontroluj údaje zrušenia a skús znova",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Zrušenie sa nepodarilo spracovať. Skús znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš zrušiť predplatné, prihlás sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie zrušiť toto predplatné",
      },
      notFound: {
        title: "Predplatné sa nenašlo",
        description: "Predplatné na zrušenie sa nenašlo",
      },
      server: {
        title: "Zrušenie zlyhalo",
        description: "Predplatné sa nepodarilo zrušiť. Skús znova",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Vyskytla sa neočakávaná chyba. Skús znova",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      conflict: {
        title: "Konflikt pri zrušení",
        description:
          "Stav predplatného sa medzičasom zmenil. Obnov údaje a skús znova",
      },
    },
    submit: {
      label: "Zrušiť predplatné",
      loading: "Ruší sa…",
    },
    success: {
      title: "Predplatné zrušené",
      description: "Tvoje predplatné sa úspešne zrušilo",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Plán predplatného",
        description: "Vyber svoj plán",
        placeholder: "Vyber plán",
      },
      billingInterval: {
        label: "Fakturačný interval",
        description: "Vyber frekvenciu fakturácie",
        placeholder: "Vyber fakturačný interval",
      },
      provider: {
        label: "Poskytovateľ platby",
        description: "Vyber poskytovateľa platby",
      },
      catalogProductId: {
        label: "Produkt katalógu",
        description: "Prepojenie na produkt v katalógu pre toto predplatné",
      },
      cancelAtPeriodEnd: {
        label: "Zrušiť na konci obdobia",
        description: "Zruší predplatné na konci aktuálneho obdobia",
      },
      reason: {
        label: "Dôvod zrušenia",
        description: "Uveď dôvod zrušenia",
        placeholder: "Zadaj dôvod zrušenia",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "Adresa URL platby",
    sessionId: "ID relácie",
    hasSubscription: "Má predplatné",
    id: "ID predplatného",
    userId: "ID používateľa",
    status: "Stav predplatného",
    planId: "ID plánu",
    billingInterval: "Fakturačný interval",
    currentPeriodStart: "Začiatok aktuálneho obdobia",
    currentPeriodEnd: "Koniec aktuálneho obdobia",
    cancelAtPeriodEnd: "Zrušiť na konci obdobia",
    cancelAt: "Plánované zrušenie",
    canceledAt: "Zrušené",
    endedAt: "Dátum skončenia",
    checkoutProviders: "Dostupné spôsoby platby",
    nowPaymentsAcceptsCards: "Krypto platba prijíma karty",
    trialStart: "Začiatok skúšobného obdobia",
    trialEnd: "Koniec skúšobného obdobia",
    success: "Operácia bola úspešná",
    message: "Stavová správa",
    subscriptionId: "ID predplatného",
    stripeCustomerId: "ID zákazníka v Stripe",
    updatedFields: "Upravené polia",
    endsAt: "Dátum skončenia",
    createdAt: "Vytvorené",
    updatedAt: "Aktualizované",
    provider: "Poskytovateľ platby",
    providerSubscriptionId: "ID predplatného u poskytovateľa",
  },

  // Error types
  errors: {
    tierChange: {
      notActive: "Tvoj plán nie je aktívny. Aktivuj si nový plán.",
      cryptoNotSupported:
        "Plán platený kryptomenou sa dá zmeniť až po skončení aktuálneho obdobia. Potom si vyber nový plán.",
      paymentRequired:
        "Banka vyžaduje potvrdenie platby za prechod na vyšší plán. Otvor faktúru a dokonči ho: {{url}}",
      failed: "Zmena plánu zlyhala: {{error}}",
      upgraded:
        "Prechod na {{plan}} je hotový. Na toto obdobie sme pripísali ďalšie kredity: {{credits}}.",
      changed: "Plán sa zmenil na {{plan}}.",
      downgraded:
        "Na {{plan}} prejdeš pri najbližšom obnovení. Dovtedy ti zostanú súčasné kredity.",
      unchanged: "Tento plán už používaš.",
    },
    validation: {
      title: "Chyba overenia údajov",
      description: "Neplatné parametre predplatného",
    },
    network: {
      title: "Chyba siete",
      description: "Sieťové pripojenie zlyhalo",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš oprávnenie na prístup",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Predplatné sa nenašlo",
    },
    not_found: "Predplatné sa nenašlo",
    not_found_description: "Požadované predplatné sa nenašlo",
    server: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
    serverError: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máš neuložené zmeny",
    },
    use_checkout_flow: "Predplatné si kúp cez platobnú stránku",
    use_checkout_flow_description:
      "Predplatné sa dá vytvoriť iba nákupom cez platobnú stránku.",
    conflict: {
      title: "Konflikt",
      description: "Nastal konflikt údajov",
    },
    sync_failed: "Predplatné sa nepodarilo synchronizovať s databázou",
    database_error: "Chyba databázy: {{error}}",
    create_crashed: "Vytvorenie predplatného zlyhalo",
    cancel_failed: "Predplatné sa nepodarilo zrušiť: {{error}}",
    user_not_found: "Používateľ sa nenašiel",
    stripe_customer_creation_failed:
      "Zákazníka v Stripe sa nepodarilo vytvoriť",
    not_implemented_on_native:
      "Operácia {{method}} nie je dostupná v natívnej aplikácii. Použi webovú verziu.",
    no_provider_id: "ID poskytovateľa platby sa nenašlo",
  },

  sync: {
    failed: "Predplatné sa nepodarilo synchronizovať: {{error}}",
    stripe_error: "Chyba synchronizácie so Stripe: {{error}}",
    success: "Predplatné sa úspešne synchronizovalo",
  },

  // Cancel operation
  cancel: {
    success: "Predplatné sa úspešne zrušilo",
  },

  // Success types
  success: {
    title: "Úspech",
    description: "Operácia sa úspešne dokončila",
  },

  // Status translations
  status: {
    incomplete: "Nedokončené",
    incomplete_expired: "Nedokončené, platnosť uplynula",
    trialing: "V skúšobnom období",
    active: "Aktívne",
    pastDue: "Po splatnosti",
    canceled: "Zrušené",
    unpaid: "Nezaplatené",
    paused: "Pozastavené",
  },

  // Email translations
  email: {
    success: {
      headline: "Predplatné je aktívne. Môžeš chatovať bez filtrov.",
      subject: "Tvoje predplatné {{appName}} je aktívne",
      previewText:
        "{{privateName}}, predplatné je aktívne. Mesačné kredity: {{subscriptionCredits}}. Počet modelov: {{modelCount}}. Prístup bez obmedzení.",
      activeBadge: "Aktívne",
      greeting: "Ahoj, {{privateName}},",
      intro:
        "tvoje predplatné {{appName}} je potvrdené. Kredity na každý mesiac: {{subscriptionCredits}}. Môžeš ich použiť na všetky modely. Bez denných limitov, bez filtrov obsahu a bez vysvetľovania.",
      models: {
        title: "Modely: {{modelCount}} v troch kategóriách",
        mainstream: "Bežné",
        open: "S otvoreným zdrojovým kódom",
        uncensored: "Bez cenzúry",
      },
      included: {
        title: "Čo dostaneš každý mesiac",
        credits:
          "Mesačné kredity: {{subscriptionCredits}} (obnovujú sa automaticky)",
        models: "Prístup ku všetkým modelom AI ({{modelCount}})",
        nolimits: "Žiadne denné limity. Kredity používaj, kedy chceš",
        uncensored: "Modely bez cenzúry a filtrov obsahu",
        packs: "Možnosť dokúpiť balíky kreditov bez obmedzenia platnosti",
        cancel: "Predplatné môžeš zrušiť kedykoľvek",
      },
      cta: "Začať chat",
      packs: {
        title: "Potrebuješ viac kreditov?",
        description:
          "Dochádzajú ti kredity pred obnovením plánu? Kedykoľvek si môžeš dokúpiť balík za {{packPrice}}. Počet kreditov v balíku: {{packCredits}}. Platnosť balíkov sa nekončí a kredity z nich sa pripočítajú k mesačným.",
        cta: "Kúpiť balík kreditov",
      },
      manage: "Predplatné môžeš kedykoľvek spravovať alebo zrušiť v",
      manageLink: "nastaveniach účtu",
      signoff: "Príjemné rozhovory,\nTím {{appName}}",
    },
    admin_notification: {
      title: "Nové predplatné",
      subject: "Nové predplatné: {{planName}}",
      preview: "Nové predplatné: {{userName}} si aktivoval plán {{planName}}",
      message: "Nový používateľ si aktivoval predplatné {{appName}}.",
      details: "Podrobnosti predplatného",
      user_name: "Meno používateľa",
      user_email: "E-mail používateľa",
      plan: "Plán",
      status: "Stav",
      contact_user: "Kontaktovať používateľa",
      footer: "Automatické oznámenie od {{appName}}",
    },
  },

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "Potvrdenie predplatného e-mailom",
      description: "Potvrdzovací e-mail, ktorý príde po aktivácii predplatného",
      category: "predplatné",
      preview: {
        privateName: {
          label: "Meno používateľa",
          description: "Zobrazované meno používateľa",
        },
        userId: {
          label: "ID používateľa",
          description: "Jedinečný identifikátor používateľa",
        },
        leadId: {
          label: "ID kontaktu",
          description: "Identifikátor prepojeného kontaktu",
        },
        planName: {
          label: "Názov plánu",
          description: "Názov plánu predplatného",
        },
      },
    },
    adminNotification: {
      name: "Oznámenie o predplatnom pre správcov",
      description: "Interné oznámenie pre správcov po aktivácii predplatného",
      category: "správca",
      preview: {
        privateName: {
          label: "Meno používateľa",
        },
        publicName: {
          label: "Verejné meno",
        },
        email: {
          label: "E-mail používateľa",
        },
        planName: {
          label: "Názov plánu",
        },
        statusName: {
          label: "Stav predplatného",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Späť",
    confirm: {
      title: "Zrušiť predplatné?",
      description:
        "Prístup sa skončí na konci fakturačného obdobia. Túto zmenu nemožno vrátiť.",
      cancel: "Ponechať predplatné",
      proceed: "Áno, zrušiť",
    },
  },

  // Widget display keys
  title: "Tvoje predplatné",
  description: "Spravuj predplatné a fakturáciu",
  notAvailable: "Nedostupné",
  canceledOn: "Dátum zrušenia",
  endedOn: "Dátum skončenia",
  billingInterval: "Fakturačný interval",
  currentPeriodStart: "Začiatok aktuálneho obdobia",
  endsOn: "Dátum skončenia",
  nextBillingDate: "Dátum ďalšej platby",
  cancellation: {
    title: "Zrušenie predplatného je naplánované",
    description:
      "Predplatné sa zruší {{date}}. Dovtedy budeš mať naďalej prístup.",
  },
  canceled: {
    title: "Predplatné sa skončilo",
    description:
      "Tvoje predplatné sa skončilo. Obnov ho a získaš prístup ku všetkým funkciám.",
  },
  noSubscription: {
    title: "Zatiaľ nemáš predplatné",
    description:
      "Predplatné ti odomkne mesačné kredity a prístup ku všetkým modelom.",
    cta: "Zobraziť plány",
  },
  manage: {
    nowpayments: {
      info: "Ak chceš spravovať predplatné cez NowPayments, kontaktuj podporu.",
      button: "Spravovať predplatné",
    },
    stripe: {
      button: "Spravovať predplatné",
    },
    portal: {
      error: "Zákaznícky portál sa nepodarilo otvoriť. Skús znova.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "Nedokončené",
      incompleteExpired: "Nedokončené, platnosť uplynula",
      trialing: "V skúšobnom období",
      active: "Aktívne",
      pastDue: "Po splatnosti",
      canceled: "Zrušené",
      unpaid: "Nezaplatené",
      paused: "Pozastavené",
      canceling: "Naplánované zrušenie",
    },
    billing: {
      monthly: "Mesačne",
      yearly: "Ročne",
    },
    cancellation: {
      tooExpensive: "Príliš drahé",
      missingFeatures: "Chýbajúce funkcie",
      switchingService: "Prechod na inú službu",
      temporaryPause: "Dočasná prestávka",
      other: "Iné",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "Kredity: {{credits}}",
      note: "Jednorazové dobitie bez obmedzenia platnosti.",
      aria: "Kúpiť kredity ({{credits}}) za {{price}} jednorazovo",
    },
    plan: {
      title: "Mesačné kredity: {{credits}}",
      note: "{{plan}}. Môžeš ho kedykoľvek zrušiť.",
      perMonth: "/ mes.",
      aria: "Aktivovať {{plan}} za {{price}}. Mesačné kredity: {{credits}}.",
    },
    upgrade: {
      title: "Prejsť na vyšší plán {{plan}}",
      note: "Mesačné kredity: {{credits}}",
      aria: "Prejsť na {{plan}} za {{price}}. Mesačné kredity: {{credits}}.",
      confirm:
        "Rozdiel za zvyšok obdobia zaplatíš teraz. Kredity navyše dostaneš ihneď.",
      confirmButton: "Prejsť na vyšší plán",
      cancel: "Zrušiť",
      working: "Prebieha prechod na vyšší plán…",
    },
    opening: "Otvára sa platobná stránka…",
    secure: "Karta, PayPal, Apple Pay a Google Pay cez Stripe.",
    allPlans: "Všetky plány a platba kryptomenami",
    moreOptions: "Kryptomeny a ďalšie možnosti",
    error: "Platobná stránka sa neotvorila. Skús znova.",
  },
  tiers: {
    examples: {
      heading: "Na čo stačia mesačné kredity ({{credits}})",
      subheading: "Počet správ za mesiac pri niekoľkých obľúbených modeloch.",
      perMessage: "Cena správy v kreditoch: približne {{credits}}",
      messages: "Približný počet správ: {{amount}}",
      note: "Odhad vychádza z bežnej správy so vstupom {{input}} tokenov (doterajší chat) a výstupom {{output}} tokenov. Krátke chaty stoja menej, dlhé chaty a súbory viac.",
    },
    faq: {
      heading: "Otázky pred nákupom",
      credit: {
        question: "Koľko stojí jeden kredit?",
        answer:
          "Jeden kredit stojí {{unitPrice}}. Úsporné modely spotrebujú na správu menej než kredit, najvýkonnejšie niekoľko. Príklady vyššie používajú skutočné ceny modelov.",
      },
      unused: {
        question: "Čo sa stane s nevyužitými kreditmi?",
        answer:
          "Kredity z plánu platia počas fakturačného mesiaca a obnovia sa pri ďalšej platbe. Platnosť balíkov kreditov sa nekončí.",
      },
      cancel: {
        question: "Môžem predplatné zrušiť?",
        answer:
          "Áno, kedykoľvek priamo tu. Plán aj kredity ti zostanú do konca zaplateného obdobia.",
      },
      free: {
        question: "Čo zostáva zadarmo?",
        answer:
          "Mesačné kredity bez účtu: {{freeCreditsGuest}}. S bezplatným účtom: {{freeCreditsSignedIn}}. S potvrdeným odberom newslettera: {{freeCreditsMax}}. Platobnú kartu nepotrebuješ.",
      },
      api: {
        question: "Odomkne mi plán prístup k API?",
        answer:
          "Áno. Každý plán alebo balík kreditov odomkne kľúče API pre klientov kompatibilných s OpenAI a Anthropic. Bezplatné kredity prístup neodomykajú.",
      },
      pay: {
        question: "Ako môžem zaplatiť?",
        answer:
          "Kartou alebo cez PayPal prostredníctvom Stripe, prípadne kryptomenou cez NOWPayments.",
      },
      more: "Ďalšie odpovede v centre pomoci",
    },
    heading: "Vyber si plán",
    subheading:
      "Každý mesiac nové kredity na všetky modely ({{modelCount}}). Predplatné môžeš kedykoľvek zrušiť.",
    changeHeading: "Zmeniť plán",
    changeSubheading: "Tvoj plán: {{plan}}. Mesačné kredity: {{credits}}.",
    recommended: "Odporúčané",
    current: "Tvoj plán",
    perMonth: "/ mesiac",
    perYear: "/ rok",
    creditsPerMonth: "kredity / mesiac",
    yearlyEquivalent: "{{monthlyPrice}} za mesiac pri ročnej platbe",
    picked: "{{plan}}. Mesačné kredity: {{credits}}.",
    pickedNote:
      "Všetky modely ({{modelCount}}). Kredity sa obnovujú každý mesiac. Predplatné môžeš kedykoľvek zrušiť.",
    cta: {
      start: "Získať {{plan}}",
      upgrade: "Prejsť na vyšší plán {{plan}}",
      downgrade: "Prejsť na {{plan}} pri obnovení",
      intervalYearly: "Prejsť na ročnú platbu",
      intervalMonthly: "Prejsť na mesačný plán {{plan}}",
      current: "Tvoj aktuálny plán",
    },
    signInHint: "Vytvor si bezplatný účet a aktivuj si plán.",
    cryptoHint:
      "Platíš kryptomenou? Plus, Pro a Ultra môžeš platiť mesačne aj ročne. Starter iba ročne.",
    confirm: {
      upgradeTitle: "Prejsť na vyšší plán {{plan}}?",
      upgradeBody:
        "Rozdiel za zvyšok obdobia zaplatíš teraz a kredity navyše dostaneš ihneď. Od najbližšieho obnovenia zaplatíš {{price}} mesačne. Mesačné kredity: {{credits}}.",
      upgradeButton: "Zaplatiť a prejsť na vyšší plán",
      downgradeTitle: "Prejsť na {{plan}}?",
      downgradeBody:
        "Nový plán začne pri najbližšom obnovení {{date}}. Dovtedy si ponecháš aktuálny plán aj kredity. Potom zaplatíš {{price}} mesačne. Mesačné kredity: {{credits}}.",
      downgradeButton: "Prejsť pri obnovení",
      intervalTitle: "Zmeniť fakturáciu?",
      intervalBody:
        "Dnes začne nové fakturačné obdobie a Stripe vyrovná pomerný rozdiel. Nový plán: {{plan}}, cena {{price}}{{period}}. Mesačné kredity: {{credits}}.",
      intervalButton: "Zmeniť fakturáciu",
      cancel: "Teraz nie",
      working: "Plán sa mení…",
    },
    packsLocked: {
      title: "Balíky kreditov za {{price}}. Počet kreditov: {{credits}}.",
      body: "Balíky dopĺňajú kredity aktívneho plánu. Aktivuj plán a dokupuj balíky, keď ti kredity dochádzajú. Ich platnosť sa nekončí.",
    },
    topUp: {
      heading: "Dobiť kredity",
      subheading:
        "Dochádzajú ti kredity pred obnovením? Balíky doplnia kredity z plánu a ich platnosť sa nekončí.",
    },
  },
  buy: {
    provider: {
      stripe: "Karta, PayPal a digitálne peňaženky",
      stripeDescription: "Karta, PayPal, Apple Pay a Google Pay cez Stripe",
      nowpayments: "Kryptomeny (NowPayments)",
      nowpaymentsDescription:
        "Zaplať bitcoinom, etherom alebo inou kryptomenou",
      cryptoMonthlyDisabled:
        "Starter môžeš platiť kryptomenou raz ročne. Pri Plus, Pro a Ultra môžeš kryptomenou platiť aj mesačne.",
    },
    login: "Prihlásiť sa",
    signup: "Zaregistrovať sa zadarmo",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Predplatné",
      description: "Spravuj predplatné a fakturáciu",
    },
    buyCredits: {
      title: "Kúpiť kredity",
      description: "Dokúp si kredity na účet",
    },
    history: {
      title: "História fakturácie",
      description: "Zobraz históriu fakturácie a transakcií",
    },
    overview: {
      title: "Prehľad predplatného",
      description: "Zobraz stav a podrobnosti predplatného",
    },
  },
};
