import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sledovanie kontaktov",
  tags: {
    tracking: "Sledovanie",
    engagement: "Interakcia",
  },
  post: {
    title: "Zaznamenať interakciu kontaktu",
    titleShort: "Zaznamenať interakciu",
    description: "Zaznamená novú interakciu kontaktu",
    form: {
      title: "Formulár interakcie kontaktu",
      description: "Zaznamenať podrobnosti o interakcii kontaktu",
    },
    leadId: {
      label: "ID kontaktu",
      description: "Jedinečný identifikátor kontaktu",
      placeholder: "Zadajte ID kontaktu",
      helpText: "UUID kontaktu, ktorého interakciu chcete zaznamenať",
    },
    engagementType: {
      label: "Typ interakcie",
      description: "Typ zaznamenanej udalosti",
      placeholder: "Vyberte typ interakcie",
      helpText: "Typ interakcie kontaktu",
    },
    campaignId: {
      label: "ID kampane",
      description: "Identifikátor priradenej kampane",
      placeholder: "Zadajte ID kampane",
      helpText: "Voliteľná kampaň, ku ktorej interakcia patrí",
    },
    metadata: {
      label: "Metadáta",
      description: "Doplňujúce metadáta interakcie",
      placeholder: "Zadajte metadáta vo formáte JSON",
      helpText: "Vlastné údaje o interakcii",
    },
    userId: {
      label: "ID používateľa",
      description: "Identifikátor prepojeného používateľa",
      placeholder: "Zadajte ID používateľa",
      helpText: "Voliteľné ID používateľa prepojeného s kontaktom",
    },
    response: {
      id: "ID interakcie",
      leadId: "ID kontaktu",
      engagementType: "Typ interakcie",
      campaignId: "ID kampane",
      metadata: "Metadáta",
      timestamp: "Časová pečiatka",
      ipAddress: "IP adresa",
      userAgent: "Identifikátor klienta",
      createdAt: "Vytvorené",
      leadCreated: "Kontakt vytvorený",
      relationshipEstablished: "Vzťah vytvorený",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
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
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Interakcia zaznamenaná",
      description: "Interakcia kontaktu sa úspešne zaznamenala",
    },
  },
  get: {
    title: "Zaznamenať kliknutie kontaktu",
    titleShort: "Zaznamenať kliknutie",
    description:
      "Zaznamená kliknutie kontaktu a presmeruje ho na cieľovú adresu URL",
    form: {
      title: "Parametre sledovania kliknutí",
      description: "Parametre na sledovanie kliknutí a presmerovanie",
    },
    id: {
      label: "ID kontaktu",
      description: "Jedinečný identifikátor kontaktu",
      placeholder: "Zadajte ID kontaktu",
      helpText: "UUID kontaktu, ktorého kliknutie chcete zaznamenať",
    },
    stage: {
      label: "Fáza kampane",
      description: "Fáza e-mailovej kampane",
      placeholder: "Vyberte fázu kampane",
      helpText: "Voliteľná fáza kampane, ku ktorej kliknutie patrí",
    },
    source: {
      label: "Zdroj kontaktu",
      description: "Zdroj kontaktu",
      placeholder: "Vyberte zdroj kontaktu",
      helpText: "Zdroj, odkiaľ kontakt prišiel",
    },
    url: {
      label: "Cieľová adresa URL",
      description: "Adresa URL, ktorá sa otvorí po zaznamenaní",
      placeholder: "Zadajte cieľovú adresu URL",
      helpText: "Cieľová adresa URL na presmerovanie",
    },
    ref: {
      label: "Referenčné ID",
      description: "Identifikátor referencie na sledovanie",
      placeholder: "Zadajte referenčné ID",
      helpText: "Voliteľné referenčné ID na doplnenie kontextu",
    },
    sig: {
      label: "Podpis odkazu",
      description:
        "Potvrdzuje, že externý cieľ pochádza z odkazu, ktorý sme vygenerovali",
    },
    response: {
      success: "Úspech",
      redirectUrl: "Adresa URL presmerovania",
      leadId: "ID kontaktu",
      campaignId: "ID kampane",
      engagementRecorded: "Interakcia zaznamenaná",
      leadStatusUpdated: "Stav kontaktu aktualizovaný",
      isLoggedIn: "Prihlásený",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
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
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Kliknutie zaznamenané",
      description: "Kliknutie kontaktu sa úspešne zaznamenalo",
    },
  },
  widget: {
    post: {
      headerTitle: "Zaznamenať interakciu",
      viewStatsTitle: "Zobraziť štatistiky kontaktov",
      statsButton: "Štatistiky",
      loading: "Zaznamenáva sa interakcia…",
      successTitle: "Interakcia zaznamenaná",
      successSubtitle: "úspešne zaznamenané",
      event: "Udalosť",
      labels: {
        engagementId: "ID interakcie",
        type: "Typ",
        leadId: "ID kontaktu",
        campaignId: "ID kampane",
        ipAddress: "IP adresa",
        recordedAt: "Čas zaznamenania",
        leadCreated: "Kontakt vytvorený",
        leadCreatedYes: "Áno (nový kontakt)",
        leadCreatedNo: "Nie (existujúci kontakt)",
        relationshipEst: "Vzťah vytvorený",
        relationshipYes: "Áno",
        relationshipNo: "Nie",
        metadata: "Metadáta",
      },
      nextSteps: "Ďalšie kroky:",
      viewLeadButton: "Zobraziť kontakt",
      leadStatsButton: "Štatistiky kontaktov",
      emptyTitle: "Zaznamenať interakciu",
      emptyDescription:
        "Vyplňte a odošlite formulár, aby sa zaznamenala nová interakcia kontaktu",
      viewLeadStatsButton: "Zobraziť štatistiky kontaktov",
    },
    get: {
      headerTitle: "Sledovanie kliknutí",
      viewStatsTitle: "Zobraziť štatistiky kontaktov",
      statsButton: "Štatistiky",
      loading: "Spracúva sa kliknutie…",
      successTitle: "Kliknutie zaznamenané",
      successSubtitle:
        "Interakcia je zaznamenaná a adresa URL presmerovania pripravená",
      failTitle: "Sledovanie zlyhalo",
      failSubtitle: "Kliknutie sa nepodarilo zaznamenať",
      labels: {
        engagementLabel: "Interakcia",
        recorded: "Zaznamenaná",
        notRecorded: "Nezaznamenaná",
        leadStatusLabel: "Stav kontaktu",
        updated: "Aktualizovaný",
        unchanged: "Nezmenený",
        userLabel: "Používateľ",
        loggedIn: "Prihlásený",
        anonymous: "Anonymný",
        leadId: "ID kontaktu",
        campaignId: "ID kampane",
        redirectUrl: "Adresa URL presmerovania",
      },
      nextSteps: "Ďalšie kroky:",
      openUrlButton: "Otvoriť adresu URL",
      viewLeadButton: "Zobraziť kontakt",
      leadStatsButton: "Štatistiky kontaktov",
      emptyTitle: "Zaznamenať kliknutie",
      emptyDescription:
        "Zadajte parametre sledovania, aby sa zaznamenalo kliknutie a získala adresa URL na presmerovanie",
      viewLeadStatsButton: "Zobraziť štatistiky kontaktov",
    },
  },
  enums: {
    engagementLevel: {
      high: "Vysoká",
      medium: "Stredná",
      low: "Nízka",
      none: "Žiadna",
    },
    engagementTypes: {
      emailOpen: "Otvorenie e-mailu",
      emailClick: "Kliknutie v e-maile",
      websiteVisit: "Návšteva webu",
      formSubmit: "Odoslanie formulára",
      leadAttribution: "Priradenie zdroja kontaktu",
      creditWall: "Kredity sa minuli",
      consentDeclined: "Vek 18+ nepotvrdený",
    },
    emailCampaignStage: {
      notStarted: "Nespustené",
      initial: "Prvé oslovenie",
      followup1: "Nadväzujúci e-mail 1",
      followup2: "Nadväzujúci e-mail 2",
      followup3: "Nadväzujúci e-mail 3",
      nurture: "Budovanie vzťahu",
      reactivation: "Obnovenie aktivity",
    },
    leadSource: {
      website: "Web",
      socialMedia: "Sociálne siete",
      emailCampaign: "E-mailová kampaň",
      referral: "Odporúčanie",
      csvImport: "Import CSV",
    },
  },
  error: {
    default: "Pri spracovaní interakcie nastala chyba",
  },
};
