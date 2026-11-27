import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa kontaktov",
  tags: {
    leads: "Kontakty",
    search: "Hľadať",
  },
  get: {
    title: "Vyhľadať kontakty",
    titleShort: "Hľadať podľa e-mailu alebo mena",
    description: "Vyhľadávať kontakty s filtrami a stránkovaním",
    form: {
      title: "Formulár na vyhľadávanie kontaktov",
      description: "Zadajte kritériá vyhľadávania kontaktov",
    },
    search: {
      label: "Hľadaný výraz",
      description:
        "Hľadaný výraz na filtrovanie podľa e-mailu, názvu firmy alebo poznámok",
      placeholder: "Zadajte hľadaný výraz…",
    },
    status: {
      label: "Filter stavu",
      description: "Filtrovať kontakty podľa stavu",
    },
    limit: {
      label: "Limit výsledkov",
      description: "Najvyšší počet výsledkov (1 až 100)",
    },
    offset: {
      label: "Posun výsledkov",
      description: "Počet výsledkov, ktoré sa pri stránkovaní preskočia",
    },
    response: {
      title: "Výsledky hľadania",
      description:
        "Výsledky vyhľadávania s údajmi o kontaktoch rozdelené na stránky",
      leads: {
        title: "Kontakty",
        item: "Kontakt",
      },
      total: "Celkový počet výsledkov",
      hasMore: "Sú dostupné ďalšie výsledky",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na vyhľadávanie kontaktov sa prihláste",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Zadané parametre vyhľadávania sú neplatné",
      },
      server: {
        title: "Chyba servera",
        description: "Pri vyhľadávaní kontaktov nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vyhľadávaní kontaktov nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vyhľadávaní kontaktov nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vyhľadávať kontakty",
      },
      notFound: {
        title: "Žiadne výsledky",
        description: "Žiadne kontakty nezodpovedajú kritériám vyhľadávania",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Vo vyhľadávacom formulári sú neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Pri vyhľadávaní kontaktov nastal konflikt údajov",
      },
    },
    success: {
      title: "Vyhľadávanie dokončené",
      description: "Vyhľadávanie kontaktov sa dokončilo",
    },
  },
  widget: {
    unnamedLead: "Kontakt bez mena",
    previous: "Predchádzajúca",
    next: "Nasledujúci",
    page: "Strana {{page}} z {{pages}}",
    title: "Vyhľadať kontakty",
    filterLabel: "Filter:",
    clearFilter: "Zrušiť",
    noResultsTitle: "Nenašli sa žiadne výsledky",
    noResultsSubtitle:
      "Vyhľadávať podľa e-mailu, názvu firmy alebo telefónneho čísla",
    createLead: "Vytvoriť kontakt",
    noLeadsMatchFilter: "Žiadne kontakty nezodpovedajú vybraným filtrom.",
    clearFilters: "Zrušiť filtre",
    loadMore: "Načítať viac",
    openRateSuffix: "% otvorených",
    noEmails: "žiadne e-maily",
    converted: "Konvertované",
    emailsSentSuffix: "odoslané",
    copyEmailTitle: "Kopírovať e-mail",
    editLeadTitle: "Upraviť kontakt",
    deleteLeadTitle: "Odstrániť kontakt",
    statusNew: "Nové",
    statusPending: "Čaká",
    statusCampaign: "Kampaň",
    statusWebUser: "Používateľ webu",
    statusNewsletter: "Newsletter",
    statusInContact: "Oslovený",
    statusSignedUp: "Zaregistrovaný",
    statusSubscribed: "Odber aktívny",
    statusUnsub: "Odhlásený odber",
    statusBounced: "Vrátené",
    statusInvalid: "Neplatný",
  },
  enums: {
    leadStatus: {
      new: "Nové",
      pending: "Čaká",
      campaignRunning: "Kampaň prebieha",
      websiteUser: "Používateľ webu",
      newsletterSubscriber: "Odberateľ newslettera",
      inContact: "Oslovený",
      signedUp: "Zaregistrovaný",
      subscriptionConfirmed: "Predplatné potvrdené",
      unsubscribed: "Odhlásené z odberu",
      bounced: "Vrátené",
      invalid: "Neplatný",
    },
  },
};
