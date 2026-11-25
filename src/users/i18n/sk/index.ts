import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",
  tags: {
    create: "Vytvoriť",
    admin: "Správca",
    user: "Používateľ",
    view: "Zobraziť",
    stats: "Štatistiky",
  },
  create: {
    category: "Používatelia",
    tags: {
      create: "Vytvoriť",
      admin: "Správca",
    },
    post: {
      title: "Vytvoriť používateľa",
      description: "Vytvoriť nový používateľský účet",
      form: {
        title: "Nový používateľ",
        description: "Vyplňte údaje nového používateľa",
      },
      email: {
        label: "E-mailová adresa",
        description: "E-mail na prihlasovanie a komunikáciu s používateľom",
      },
      password: {
        label: "Heslo",
        description: "Bezpečné heslo k používateľskému účtu",
      },
      privateName: {
        label: "Súkromné meno",
        description: "Celé úradné meno používateľa. Vidia ho iba správcovia.",
      },
      publicName: {
        label: "Verejné meno",
        description: "Meno, ktoré sa zobrazuje všetkým používateľom",
      },
      firstName: {
        label: "Krstné meno",
        description: "Krstné meno používateľa",
      },
      lastName: {
        label: "Priezvisko",
        description: "Priezvisko používateľa",
      },
      company: {
        label: "Firma",
        description: "Firma alebo organizácia používateľa",
      },
      phone: {
        label: "Telefónne číslo",
        description: "Kontaktné telefónne číslo používateľa",
      },
      preferredContactMethod: {
        label: "Uprednostňovaný spôsob kontaktu",
        description: "Ako si používateľ želá, aby ste ho kontaktovali",
      },
      roles: {
        label: "Používateľské roly",
        description: "Priraďte používateľovi roly",
      },
      imageUrl: {
        label: "URL profilovej fotografie",
        description: "Adresa profilovej fotografie používateľa",
      },
      bio: {
        label: "O používateľovi",
        description: "Stručné predstavenie používateľa",
      },
      website: {
        label: "Webová stránka",
        description: "Osobná alebo firemná webová stránka používateľa",
      },
      jobTitle: {
        label: "Pracovná pozícia",
        description: "Pracovná pozícia alebo funkcia používateľa",
      },
      emailVerified: {
        label: "Overený e-mail",
        description: "Či používateľ overil svoju e-mailovú adresu",
      },
      isActive: {
        label: "Aktívny účet",
        description: "Či je používateľský účet aktívny",
      },
      leadId: {
        label: "ID kontaktu",
        description: "Identifikátor priradeného kontaktu",
      },
      country: {
        label: "Krajina",
        description: "Krajina pobytu používateľa",
      },
      language: {
        label: "Jazyk",
        description: "Uprednostňovaný jazyk používateľa",
      },
      response: {
        title: "Používateľ sa vytvoril",
        description: "Údaje nového používateľa",
        id: {
          content: "ID používateľa",
        },
        leadId: {
          content: "ID priradeného kontaktu",
        },
        country: {
          label: "Krajina",
          description: "Krajina pobytu používateľa",
        },
        language: {
          label: "Jazyk",
          description: "Uprednostňovaný jazyk používateľa",
        },
        email: {
          content: "E-mailová adresa",
        },
        privateName: {
          content: "Súkromné meno",
        },
        publicName: {
          content: "Verejné meno",
        },
        firstName: {
          content: "Krstné meno",
        },
        lastName: {
          content: "Priezvisko",
        },
        company: {
          content: "Firma",
        },
        phone: {
          content: "Telefónne číslo",
        },
        preferredContactMethod: {
          content: "Uprednostňovaný spôsob kontaktu",
        },
        imageUrl: {
          content: "Profilová fotografia",
        },
        bio: {
          content: "O používateľovi",
        },
        website: {
          content: "Webová stránka",
        },
        jobTitle: {
          content: "Pracovná pozícia",
        },
        emailVerified: {
          content: "Overený e-mail",
        },
        isActive: {
          content: "Aktívny účet",
        },
        stripeCustomerId: {
          content: "ID zákazníka v Stripe",
        },
        userRoles: {
          content: "Používateľské roly",
          id: {
            content: "ID roly",
          },
          role: {
            content: "Rola",
          },
        },
        createdAt: {
          content: "Dátum vytvorenia",
        },
        updatedAt: {
          content: "Dátum poslednej úpravy",
        },
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete vytvárať používateľov, prihláste sa",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte údaje vo formulári a skúste to znova",
        },
        server: {
          title: "Chyba servera",
          description: "Pre chybu servera sa používateľa nepodarilo vytvoriť",
        },
        unknown: {
          title: "Neznáma chyba",
          description:
            "Pri vytváraní používateľa sa vyskytla neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Pri vytváraní používateľa zlyhalo sieťové pripojenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie vytvárať používateľov",
        },
        notFound: {
          title: "Zdroj sa nenašiel",
          description: "Na vytvorenie používateľa chýba potrebný zdroj",
        },
        conflict: {
          title: "Používateľ už existuje",
          description: "Účet s touto e-mailovou adresou už existuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Prídete o neuložené zmeny",
        },
        internal: {
          title: "Interná chyba",
          description: "Pri vytváraní používateľa sa vyskytla interná chyba",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "Uvítaciu SMS sa nepodarilo odoslať",
            description: "Používateľovi sa nepodarilo odoslať uvítaciu SMS",
          },
          verification_failed: {
            title: "Overovaciu SMS sa nepodarilo odoslať",
            description: "Používateľovi sa nepodarilo odoslať overovaciu SMS",
          },
        },
      },
      success: {
        title: "Používateľ sa vytvoril",
        description: "Nový používateľský účet je pripravený",
        message: {
          content: "Používateľ sa vytvoril",
        },
        created: {
          content: "Vytvorené",
        },
      },
    },
    widget: {
      headerCreated: "Používateľ sa vytvoril",
      headerCreate: "Vytvoriť používateľa",
      headerSubtitle: "Vytvoriť nový účet správcu alebo zákazníka",
      activeBadge: "Aktívny",
      verifiedBadge: "Overené",
      copiedTooltip: "Skopírované",
      copyUserIdTooltip: "Skopírovať ID používateľa",
      copyIdButton: "Skopírovať ID",
      copiedButton: "Skopírované",
      viewUserButton: "Zobraziť používateľa",
      fullProfileButton: "Celý profil",
      creditHistoryButton: "História kreditov",
      createAnotherButton: "Vytvoriť ďalšieho používateľa",
      createdPrefix: "Vytvorené",
    },
    email: {
      users: {
        welcome: {
          greeting: "{{firstName}}, vitajte!",
          preview: "Váš účet je pripravený",
          subject: "{{companyName}}: váš účet je pripravený",
          introduction:
            "Dobrý deň, {{firstName}}, váš účet je pripravený. Po prihlásení môžete využívať všetky funkcie.",
          accountDetails: "Údaje účtu",
          email: "E-mail",
          name: "Meno",
          publicName: "Zobrazované meno",
          company: "Firma",
          phone: "Telefón",
          nextSteps: "Ďalšie kroky",
          loginButton: "Prihlásiť sa do účtu",
          support: "Ak máte otázky, kedykoľvek sa obráťte na našu podporu.",
        },
        admin: {
          newUser: "Nový používateľský účet",
          preview: "Nový účet používateľa {{firstName}} {{lastName}}",
          subject: "Nový používateľský účet: {{firstName}} {{lastName}}",
          notification:
            "V systéme pribudol nový používateľský účet. Nižšie nájdete jeho údaje.",
          userDetails: "Údaje používateľa",
          viewUser: "Zobraziť profil používateľa",
        },
        errors: {
          missing_data:
            "Pre e-mailovú šablónu chýbajú povinné údaje používateľa",
        },
        error: {
          general: {
            internal_server_error: "Vyskytla sa interná chyba servera",
          },
        },
        labels: {
          id: "ID:",
          email: "E-mail:",
          name: "Meno:",
          privateName: "Celé meno:",
          publicName: "Zobrazované meno:",
          company: "Firma:",
          created: "Dátum vytvorenia:",
          leadId: "ID kontaktu:",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "{{firstName}}, vitajte! Váš účet je pripravený. Prihlásiť sa môžete na {{appUrl}}.",
      },
      verification: {
        message:
          "{{firstName}}, váš overovací kód je {{code}}. Zadajte ho do 10 minút.",
      },
      errors: {
        welcome_failed: {
          title: "Uvítaciu SMS sa nepodarilo odoslať",
          description: "Používateľovi sa nepodarilo odoslať uvítaciu SMS",
        },
        verification_failed: {
          title: "Overovaciu SMS sa nepodarilo odoslať",
          description: "Používateľovi sa nepodarilo odoslať overovaciu SMS",
        },
      },
    },
  },
  list: {
    get: {
      title: "Zoznam používateľov",
      description: "Vyhľadávať a filtrovať používateľov",
      form: {
        title: "Správa používateľov",
        description: "Spravovať a filtrovať používateľov",
      },
      actions: {
        refresh: "Obnoviť",
        refreshing: "Obnovuje sa…",
      },
      // Search & Filters section
      searchFilters: {
        title: "Vyhľadávanie a filtre",
        description: "Vyhľadajte používateľov podľa zadaných podmienok",
      },
      search: {
        label: "Hľadať",
        description: "Hľadať používateľov podľa mena alebo e-mailu",
        placeholder: "Hľadať používateľov…",
      },
      status: {
        label: "Stav",
        description: "Filtrovať podľa stavu používateľa",
        placeholder: "Vyberte stav…",
      },
      role: {
        label: "Rola",
        description: "Filtrovať podľa roly používateľa",
        placeholder: "Vyberte rolu…",
      },
      subscription: {
        label: "Predplatné",
        description: "Filtrovať podľa stavu predplatného",
        placeholder: "Ľubovoľný stav predplatného",
      },
      creditActivity: {
        label: "Pohyby kreditov",
        description: "Filtrovať podľa nákupu alebo čerpania kreditov",
        placeholder: "Ľubovoľný pohyb kreditov",
      },
      threads: {
        label: "Vlákna",
        description:
          "Filtrovať podľa toho, či má používateľ aspoň jedno vlákno četu",
        placeholder: "S vláknami aj bez nich",
      },
      referralActivity: {
        label: "Aktivita odporúčaní",
        description:
          "Filtrovať podľa odkazu na odporúčanie, kliknutí, registrácií alebo platiacich predplatiteľov",
        placeholder: "Ľubovoľná aktivita odporúčaní",
      },
      // Sorting section
      sortingOptions: {
        title: "Zoradenie",
        description: "Nastaviť zoradenie výsledkov",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Pole na zoradenie výsledkov",
        placeholder: "Vyberte pole…",
      },
      sortOrder: {
        label: "Poradie",
        description: "Smer zoradenia",
        placeholder: "Vyberte poradie…",
      },
      // Response section
      response: {
        title: "Používatelia",
        description: "Používatelia zodpovedajúci zadaným podmienkam",
        users: {
          id: "ID používateľa",
          email: "E-mail",
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          isActive: "Aktívny",
          emailVerified: "Overené",
          createdAt: "Vytvorené",
          updatedAt: "Aktualizované",
          referralCode: "Použitý kód odporúčania",
          referredByUserId: "Odporučil",
          totalReferrals: "Získané odporúčania",
        },
        totalCount: "Používatelia celkovo",
        pageCount: "Počet strán",
      },
      // Pagination section
      page: {
        label: "Strana",
      },
      limit: {
        label: "Na stranu",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť používateľov, prihláste sa",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie zobraziť používateľov",
        },
        server: {
          title: "Chyba servera",
          description: "Používateľov sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        conflict: {
          title: "Konflikt údajov",
          description:
            "Pre konflikt údajov sa zoznam používateľov nepodarilo načítať",
        },
        network: {
          title: "Chyba siete",
          description: "So serverom sa nepodarilo spojiť",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Nenašli sa žiadni používatelia",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Hotovo",
        description: "Používatelia sa načítali",
      },
    },
    // Legacy keys for backward compatibility
    title: "Zobraziť používateľov",
    description: "Vyhľadať používateľov a filtrovať ich zoznam",
    category: "Používatelia",
    tag: "Zoznam",
    container: {
      title: "Zoznam používateľov",
      description: "Vyhľadávať a filtrovať používateľov",
    },
    response: {
      summary: {
        title: "Prehľad používateľov",
        description: "Súhrnné štatistiky zobrazených používateľov",
      },
      users: {
        title: "Používatelia",
      },
      user: {
        title: "Používateľ",
        id: "ID používateľa",
        email: "E-mail",
        privateName: "Súkromné meno",
        publicName: "Verejné meno",
        firstName: "Krstné meno",
        lastName: "Priezvisko",
        company: "Firma",
        phone: "Telefón",
        isActive: "Aktívny",
        emailVerified: "Overený e-mail",
        role: "Rola",
        createdAt: "Dátum vytvorenia",
        updatedAt: "Dátum poslednej úpravy",
      },
      total: {
        content: "Používatelia celkovo",
      },
      page: {
        content: "Aktuálna strana",
      },
      limit: {
        content: "Používatelia na stranu",
      },
      totalPages: {
        content: "Počet strán",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť používateľov, prihláste sa",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre na zobrazenie zoznamu používateľov",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť používateľov",
      },
      server: {
        title: "Chyba servera",
        description: "Pre chybu servera sa používateľov nepodarilo načítať",
      },
      unknown: {
        title: "Neznáma chyba",
        description:
          "Pri načítaní zoznamu používateľov sa vyskytla neočakávaná chyba",
      },
      conflict: {
        title: "Konflikt údajov",
        description:
          "Pre konflikt údajov sa zoznam používateľov nepodarilo načítať",
      },
      network: {
        title: "Chyba siete",
        description: "So serverom sa nepodarilo spojiť",
      },
      notFound: {
        title: "Používatelia sa nenašli",
        description: "Zadaným podmienkam nezodpovedá žiadny používateľ",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Prídete o neuložené zmeny",
      },
      internal: {
        title: "Interná chyba",
        description:
          "Pri načítaní zoznamu používateľov sa vyskytla interná chyba",
      },
    },
    post: {
      title: "Zoznam",
      description: "Koncový bod zoznamu",
      form: {
        title: "Nastavenia zoznamu",
        description: "Nastavenie parametrov zoznamu",
      },
      response: {
        title: "Odpoveď",
        description: "Údaje v odpovedi so zoznamom",
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
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
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
          title: "Konflikt údajov",
          description: "Údaje sú v konflikte",
        },
      },
      success: {
        title: "Hotovo",
        description: "Operácia sa dokončila",
      },
    },
    widget: {
      statusActive: "Aktívny",
      statusInactive: "Neaktívny",
      statusUnverified: "Neoverené",
      joined: "Registrácia",
      creditHistory: "História kreditov",
      view: "Zobraziť",
      edit: "Upraviť",
      delete: "Odstrániť",
      stats: "Štatistiky",
      graphs: "Grafy",
      newUser: "Nový používateľ",
      searchPlaceholder: "Hľadajte podľa mena alebo e-mailu… (Ctrl+F)",
      roleFilterLabel: "Rola",
      sortLabel: "Zoradenie:",
      clearFilters: "Vymazať filtre",
      noUsersMatchFilters: "Zadaným filtrom nezodpovedá žiadny používateľ.",
      noUsersFound: "Nenašli sa žiadni používatelia.",
      userStatistics: "Štatistiky používateľov",
      refresh: "Obnoviť",
      roleAll: "Všetci",
      roleAdmin: "Správca",
      roleCustomer: "Zákazník",
      rolePartnerAdmin: "Správca partnera",
      rolePartnerEmployee: "Zamestnanec partnera",
      statusAll: "Všetci",
      sortNewest: "Najnovší",
      sortOldest: "Najstarší",
      sortNameAZ: "Meno od A po Z",
      sortNameZA: "Meno od Z po A",
      sortEmailAZ: "E-mail od A po Z",
      of: "z",
      usersShown: "zobrazených používateľov",
      paginationPage: "Strana",
      paginationOf: "z",
      paginationSeparator: "·",
      paginationUsers: "používateľov",
    },
    enums: {
      userSortField: {
        createdAt: "Dátum vytvorenia",
        updatedAt: "Dátum poslednej úpravy",
        email: "E-mail",
        privateName: "Súkromné meno",
        publicName: "Verejné meno",
        firstName: "Krstné meno",
        lastName: "Priezvisko",
        company: "Firma",
        lastLogin: "Posledné prihlásenie",
      },
      sortOrder: {
        asc: "Vzostupne",
        desc: "Zostupne",
      },
      userStatusFilter: {
        all: "Všetci",
        active: "Aktívny",
        inactive: "Neaktívny",
        pending: "Čaká sa",
        suspended: "Pozastavený",
        emailVerified: "Overený e-mail",
        emailUnverified: "Neoverený e-mail",
      },
      userStatus: {
        active: "Aktívny",
        inactive: "Neaktívny",
        pending: "Čaká sa",
        suspended: "Pozastavený",
      },
      userRoleFilter: {
        all: "Všetci",
        user: "Používateľ",
        public: "Verejnosť",
        customer: "Zákazník",
        moderator: "Moderátor",
        partnerAdmin: "Správca partnera",
        partnerEmployee: "Zamestnanec partnera",
        admin: "Správca",
        superAdmin: "Hlavný správca",
      },
      subscriptionPresenceFilter: {
        any: "Ľubovoľné",
        hasActive: "Má aktívne predplatné",
        hadAny: "Má alebo mal predplatné",
        never: "Nikdy nemali predplatné",
      },
      creditActivityFilter: {
        any: "Ľubovoľné",
        boughtPack: "Kúpil si balík kreditov",
        spentCredits: "Minuté kredity",
        neverSpent: "Nikdy nečerpal kredity",
      },
      threadsFilter: {
        any: "Ľubovoľné",
        hasThreads: "Má vlákna četu",
        noThreads: "Bez vlákien četu",
      },
      referralActivityFilter: {
        any: "Ľubovoľné",
        hasCode: "Má odkaz na odporúčanie",
        hasClicks: "Na odkaz niekto klikol",
        hasSignups: "Získal registrácie cez odporúčanie",
        hasSubscribers: "Získal platiacich používateľov",
      },
    },
  },
  stats: {
    title: "Štatistiky používateľov",
    description: "Súhrnné štatistiky používateľov a ich aktivity",
    category: "Používatelia",
    tag: "Štatistiky",
    container: {
      title: "Prehľad štatistík používateľov",
      description: "Zobraziť štatistiky používateľov a ich aktivity",
    },
    actions: {
      refresh: "Obnoviť",
      refreshing: "Obnovuje sa…",
    },
    basicFilters: {
      title: "Základné filtre",
      description: "Filtrovať používateľov podľa stavu a roly",
    },
    subscriptionFilters: {
      title: "Filtre predplatného",
      description: "Filtrovať podľa predplatného a platieb",
    },
    locationFilters: {
      title: "Filtre krajiny a jazyka",
      description: "Filtrovať podľa krajiny a jazyka",
    },
    timePeriodOptions: {
      title: "Výber obdobia",
      description: "Nastaviť obdobie a zobrazenie grafov",
    },
    sections: {
      filterOptions: {
        title: "Možnosti filtrovania",
        description: "Nastaviť filtre pre štatistiky používateľov",
      },
    },
    fields: {
      status: {
        label: "Filter podľa stavu",
        description: "Filtrovať štatistiky podľa stavu používateľa",
      },
      role: {
        label: "Filter podľa roly",
        description: "Filtrovať štatistiky podľa roly používateľa",
      },
      country: {
        label: "Filter podľa krajiny",
        description: "Filtrovať štatistiky podľa krajiny",
        placeholder: "Vyberte krajinu…",
      },
      language: {
        label: "Filter podľa jazyka",
        description: "Filtrovať štatistiky podľa jazyka",
        placeholder: "Vyberte jazyk…",
      },
      search: {
        label: "Hľadať",
        description: "Vyhľadať používateľov zahrnutých do štatistiky",
        placeholder: "Zadajte hľadaný výraz…",
      },
      chartType: {
        label: "Typ grafu",
        description: "Vyberte typ grafu, ktorý sa má zobraziť",
      },
      dateRangePreset: {
        label: "Prednastavené obdobie",
        description: "Vyberte jedno z prednastavených období",
      },
      includeComparison: {
        label: "Porovnať obdobia",
        description: "Zahrnúť porovnanie s predchádzajúcim obdobím",
      },
      timePeriod: {
        label: "Obdobie",
        description: "Vyberte obdobie pre štatistiky",
      },
      subscriptionStatus: {
        label: "Stav predplatného",
        description: "Filtrovať podľa stavu predplatného",
      },
      paymentMethod: {
        label: "Spôsob platby",
        description: "Filtrovať podľa spôsobu platby",
      },
    },
    response: {
      overviewStats: {
        title: "Súhrnné štatistiky",
        description: "Celkový prehľad štatistík používateľov",
        totalUsers: {
          label: "Používatelia celkovo",
        },
        activeUsers: {
          label: "Aktívni používatelia",
        },
        inactiveUsers: {
          label: "Neaktívni používatelia",
        },
        newUsers: {
          label: "Noví používatelia",
        },
      },
      emailStats: {
        title: "Štatistiky e-mailových adries",
        description: "Štatistiky overenia e-mailových adries používateľov",
        emailVerifiedUsers: {
          label: "Overené e-mailové adresy",
        },
        emailUnverifiedUsers: {
          label: "Neoverené e-mailové adresy",
        },
        verificationRate: {
          label: "Podiel overených adries",
        },
      },
      profileStats: {
        title: "Štatistiky profilov",
        description: "Štatistiky úplnosti používateľských profilov",
        complete: {
          title: "Úplnosť profilu",
          description:
            "Podrobné ukazovatele vyplnenia používateľských profilov",
          usersWithPhone: {
            content: "S telefónnym číslom",
          },
          usersWithBio: {
            content: "S vyplneným predstavením",
          },
          usersWithWebsite: {
            content: "S webovou stránkou",
          },
          usersWithJobTitle: {
            content: "S pracovnou pozíciou",
          },
          usersWithImage: {
            content: "S profilovou fotografiou",
          },
          completionRate: {
            content: "Miera vyplnenia profilu",
          },
        },
      },
      subscriptionStats: {
        title: "Štatistiky predplatného",
        description: "Rozdelenie používateľov podľa predplatného",
        activeSubscriptions: {
          label: "Aktívny",
        },
        canceledSubscriptions: {
          label: "Zrušené",
        },
        expiredSubscriptions: {
          label: "Platnosť vypršala",
        },
        noSubscription: {
          label: "Bez predplatného",
        },
        subscriptionChart: {
          label: "Rozdelenie predplatného",
          description: "Graf počtu predplatných podľa stavu",
        },
      },
      paymentStats: {
        title: "Štatistiky platieb",
        description: "Prehľad tržieb a transakcií",
        totalRevenue: {
          label: "Tržby celkovo",
        },
        transactionCount: {
          label: "Transakcie",
        },
        averageOrderValue: {
          label: "Priemerná hodnota objednávky",
        },
        refundRate: {
          label: "Podiel vrátených platieb",
        },
      },
      roleStats: {
        title: "Štatistiky rolí",
        description: "Rozdelenie používateľov podľa rolí",
        publicUsers: {
          label: "Verejnosť",
        },
        customerUsers: {
          label: "Zákazníci",
        },
        partnerAdminUsers: {
          label: "Správcovia partnerov",
        },
        partnerEmployeeUsers: {
          label: "Zamestnanci partnerov",
        },
        adminUsers: {
          label: "Správcovia",
        },
        roleChart: {
          label: "Zastúpenie rolí",
          description: "Graf počtu používateľov podľa rolí",
        },
      },
      timeStats: {
        title: "Vývoj v čase",
        description:
          "Vývoj počtu nových používateľov a rast používateľskej základne",
        usersCreatedToday: {
          label: "Dnes",
        },
        usersCreatedThisWeek: {
          label: "Tento týždeň",
        },
        usersCreatedThisMonth: {
          label: "Tento mesiac",
        },
        usersCreatedLastMonth: {
          label: "Minulý mesiac",
        },
        growthRate: {
          label: "Miera rastu",
        },
      },
      companyStats: {
        title: "Štatistiky firiem",
        description: "Štatistiky používateľov podľa firiem",
        uniqueCompanies: {
          content: "Počet rôznych firiem",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Používatelia celkovo",
      },
      activeUsers: {
        content: "Aktívni používatelia",
      },
      inactiveUsers: {
        content: "Neaktívni používatelia",
      },
      newUsers: {
        content: "Noví používatelia",
      },
      emailVerifiedUsers: {
        content: "Používatelia s overeným e-mailom",
      },
      emailUnverifiedUsers: {
        content: "Používatelia bez overeného e-mailu",
      },
      verificationRate: {
        content: "Podiel overených e-mailových adries",
      },
      usersWithPhone: {
        content: "S telefónnym číslom",
      },
      usersWithBio: {
        content: "S vyplneným predstavením",
      },
      usersWithWebsite: {
        content: "S webovou stránkou",
      },
      usersWithJobTitle: {
        content: "S pracovnou pozíciou",
      },
      usersWithImage: {
        content: "S profilovou fotografiou",
      },
      usersWithStripeId: {
        content: "Používatelia s ID v Stripe",
      },
      usersWithoutStripeId: {
        content: "Používatelia bez ID v Stripe",
      },
      stripeIntegrationRate: {
        content: "Podiel účtov prepojených so Stripe",
      },
      usersWithLeadId: {
        content: "Používatelia s ID kontaktu",
      },
      usersWithoutLeadId: {
        content: "Používatelia bez ID kontaktu",
      },
      leadAssociationRate: {
        content: "Podiel účtov prepojených s kontaktom",
      },
      publicUsers: {
        content: "Verejní používatelia",
      },
      customerUsers: {
        content: "Zákaznícke účty",
      },
      partnerAdminUsers: {
        content: "Správcovia partnerských účtov",
      },
      partnerEmployeeUsers: {
        content: "Zamestnanci partnerov",
      },
      adminUsers: {
        content: "Správcovia",
      },
      uniqueCompanies: {
        content: "Počet rôznych firiem",
      },
      usersCreatedToday: {
        content: "Noví používatelia dnes",
      },
      usersCreatedThisWeek: {
        content: "Noví používatelia tento týždeň",
      },
      usersCreatedThisMonth: {
        content: "Noví používatelia tento mesiac",
      },
      usersCreatedLastMonth: {
        content: "Noví používatelia minulý mesiac",
      },
      growthRate: {
        content: "Miera rastu",
      },
      leadToUserConversionRate: {
        content: "Podiel kontaktov, ktoré sa zaregistrovali",
      },
      retentionRate: {
        content: "Miera udržania používateľov",
      },
      generatedAt: {
        content: "Čas vytvorenia štatistík",
      },
      growthMetrics: {
        title: "Ukazovatele rastu",
        description: "Rast počtu používateľov a miera konverzie",
        growthChart: {
          label: "Vývoj počtu používateľov",
          description: "Graf nových registrácií v čase",
        },
      },
      performanceRates: {
        title: "Ukazovatele výkonnosti",
        description: "Ukazovatele aktivity používateľov a konverzií",
        growthRate: {
          label: "Miera rastu",
        },
        leadToUserConversionRate: {
          label: "Konverzia kontaktov",
        },
        retentionRate: {
          label: "Miera udržania",
        },
      },
      businessInsights: {
        title: "Obchodné ukazovatele",
        description: "Analýza obchodných výsledkov",
        uniqueCompanies: {
          label: "Počet rôznych firiem",
        },
        generatedAt: {
          label: "Čas vytvorenia",
        },
      },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre štatistík",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť štatistiky, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť štatistiky",
      },
      notFound: {
        title: "Štatistiky sa nenašli",
        description: "Požadované štatistiky sa nenašli",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Pre konflikt údajov sa štatistiky nepodarilo vypočítať",
      },
      network: {
        title: "Chyba siete",
        description: "So serverom sa nepodarilo spojiť",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Prídete o neuložené zmeny",
      },
      server: {
        title: "Chyba servera",
        description: "Pre chybu servera sa štatistiky nepodarilo vypočítať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri výpočte štatistík sa vyskytla neočakávaná chyba",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "Všetci",
        active: "Aktívny",
        trialing: "V skúšobnej lehote",
        pastDue: "Po splatnosti",
        canceled: "Zrušené",
        unpaid: "Nezaplatené",
        paused: "Pozastavené",
        noSubscription: "Bez predplatného",
      },
      paymentMethodFilter: {
        all: "Všetci",
        card: "Platobná karta",
        bankTransfer: "Bankový prevod",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "SEPA inkaso",
        crypto: "Kryptomena",
        noPaymentMethod: "Bez spôsobu platby",
      },
    },
    success: {
      title: "Štatistiky sú pripravené",
      description: "Štatistiky používateľov sa vypočítali",
    },
    widget: {
      headerTitle: "Štatistiky používateľov",
      refresh: "Obnoviť",
      labelTotalUsers: "Používatelia celkovo",
      labelActiveUsers: "Aktívni používatelia",
      labelNewToday: "Noví dnes",
      labelNewThisWeek: "Noví tento týždeň",
      labelNewThisMonth: "Noví tento mesiac",
      labelTotalRevenue: "Tržby celkovo",
      labelAvgRevenuePerUser: "Priemerné tržby na používateľa",
      labelEmailVerified: "Overený e-mail",
      labelVerificationRate: "Podiel overených adries",
      labelEmailUnverified: "Neoverený e-mail",
      labelGrowthRate: "Miera rastu",
      labelLeadUserCvr: "Konverzia kontaktov na používateľov",
      labelRetentionRate: "Miera udržania",
      chartByRole: "Podľa roly",
      chartBySubscriptionStatus: "Podľa stavu predplatného",
      chartGrowthOverTime: "Vývoj rastu v čase",
      recentSignupsSummary: "Prehľad nedávnych registrácií",
      rowToday: "Dnes",
      rowThisWeek: "Tento týždeň",
      rowThisMonth: "Tento mesiac",
      rowLastMonth: "Minulý mesiac",
      generatedAt: "Čas vytvorenia:",
      filters: "Filtre",
      filtersTitle: "Možnosti filtrovania",
      applyFilters: "Použiť filtre",
      viewUsers: "Zobraziť používateľov",
      createUser: "Vytvoriť používateľa",
    },
  },
  user: {
    category: "Používatelia",
    tag: "Správa používateľov",
    errors: {
      not_found: {
        title: "Používateľ sa nenašiel",
        description: "Požadovaný používateľ sa nenašiel",
      },
      internal: {
        title: "Interná chyba",
        description:
          "Pri spracovaní požiadavky používateľa sa vyskytla interná chyba",
      },
    },
    id: {
      category: "Používatelia",
      tag: "Správa používateľov",

      id: {
        roles: {
          post: {
            title: "Pridať používateľovi rolu",
            description: "Prideliť rolu konkrétnemu používateľskému účtu",
            container: {
              title: "Pridať rolu",
              description: "Vyberte rolu, ktorú chcete používateľovi prideliť",
            },
            id: {
              label: "ID používateľa",
              description:
                "Jedinečný identifikátor používateľa, ktorému chcete prideliť rolu",
              placeholder: "Zadajte ID používateľa…",
            },
            role: {
              label: "Rola",
              description: "Rola, ktorú chcete používateľovi prideliť",
              placeholder: "Vyberte rolu…",
            },
            submit: {
              label: "Pridať rolu",
            },
            response: {
              roleId: {
                content: "ID priradenia roly",
              },
              userId: {
                content: "ID používateľa",
              },
              assignedRole: {
                content: "Priradená rola",
              },
            },
            errors: {
              unauthorized: {
                title: "Vyžaduje sa prihlásenie",
                description:
                  "Ak chcete spravovať používateľské roly, prihláste sa",
              },
              validation: {
                title: "Neplatné údaje",
                description: "Zadajte platné ID používateľa a rolu",
              },
              forbidden: {
                title: "Prístup zamietnutý",
                description: "Používateľské roly môžu spravovať iba správcovia",
              },
              notFound: {
                title: "Používateľ sa nenašiel",
                description: "Zadaný používateľ sa nenašiel",
              },
              conflict: {
                title: "Rola je už pridelená",
                description: "Používateľ už má túto rolu",
              },
              network: {
                title: "Chyba siete",
                description: "So serverom sa nepodarilo spojiť",
              },
              unsavedChanges: {
                title: "Neuložené zmeny",
                description: "Prídete o neuložené zmeny",
              },
              server: {
                title: "Chyba servera",
                description: "Pre chybu servera sa rolu nepodarilo prideliť",
              },
              unknown: {
                title: "Neznáma chyba",
                description: "Pri pridávaní roly sa vyskytla neočakávaná chyba",
              },
            },
            success: {
              title: "Rola sa pridala",
              description: "Používateľovi sa pridelila rola",
            },
          },
          delete: {
            title: "Odobrať používateľovi rolu",
            description: "Odobrať rolu konkrétnemu používateľskému účtu",
            container: {
              title: "Odobrať rolu",
              description: "Vyberte rolu, ktorú chcete používateľovi odobrať",
            },
            id: {
              label: "ID používateľa",
              description:
                "Jedinečný identifikátor používateľa, ktorému chcete odobrať rolu",
              placeholder: "Zadajte ID používateľa…",
            },
            role: {
              label: "Rola",
              description: "Rola, ktorú chcete používateľovi odobrať",
              placeholder: "Vyberte rolu…",
            },
            submit: {
              label: "Odobrať rolu",
            },
            response: {
              success: {
                content: "Rola sa odobrala",
              },
            },
            errors: {
              unauthorized: {
                title: "Vyžaduje sa prihlásenie",
                description:
                  "Ak chcete spravovať používateľské roly, prihláste sa",
              },
              validation: {
                title: "Neplatné údaje",
                description: "Zadajte platné ID používateľa a rolu",
              },
              forbidden: {
                title: "Prístup zamietnutý",
                description: "Používateľské roly môžu spravovať iba správcovia",
              },
              notFound: {
                title: "Používateľ sa nenašiel",
                description: "Zadaný používateľ sa nenašiel",
              },
              conflict: {
                title: "Konflikt údajov",
                description: "Rolu nemožno odobrať pre existujúce závislosti",
              },
              network: {
                title: "Chyba siete",
                description: "So serverom sa nepodarilo spojiť",
              },
              unsavedChanges: {
                title: "Neuložené zmeny",
                description: "Prídete o neuložené zmeny",
              },
              server: {
                title: "Chyba servera",
                description: "Pre chybu servera sa rolu nepodarilo odobrať",
              },
              unknown: {
                title: "Neznáma chyba",
                description: "Pri odoberaní roly sa vyskytla neočakávaná chyba",
              },
            },
            success: {
              title: "Rola sa odobrala",
              description: "Používateľovi sa odobrala rola",
            },
          },
        },
        get: {
          title: "Načítať používateľa",
          description: "Načítať podrobné údaje konkrétneho používateľa",
          container: {
            title: "Údaje používateľa",
            description: "Zobraziť podrobné údaje používateľa",
          },
          id: {
            label: "ID používateľa",
            description: "Jedinečný identifikátor používateľa",
            placeholder: "Zadajte ID používateľa…",
          },
          response: {
            userProfile: {
              title: "Profil používateľa",
              description: "Podrobné údaje používateľského profilu",
              basicInfo: {
                title: "Základné údaje",
                description: "Základné údaje používateľa",
                id: {
                  content: "ID používateľa",
                },
                email: {
                  content: "E-mailová adresa",
                },
                privateName: {
                  content: "Súkromné meno",
                },
                publicName: {
                  content: "Verejné meno",
                },
                firstName: {
                  content: "Krstné meno",
                },
                lastName: {
                  content: "Priezvisko",
                },
                company: {
                  content: "Firma",
                },
              },
              contactDetails: {
                title: "Kontaktné údaje",
                description: "Kontaktné údaje používateľa",
                phone: {
                  content: "Telefónne číslo",
                },
                preferredContactMethod: {
                  content: "Uprednostňovaný spôsob kontaktu",
                },
                website: {
                  content: "Webová stránka",
                },
              },
            },
            profileDetails: {
              title: "Údaje profilu",
              description: "Ďalšie údaje profilu",
              imageUrl: {
                content: "Profilová fotografia",
              },
              bio: {
                content: "O používateľovi",
              },
              jobTitle: {
                content: "Pracovná pozícia",
              },
              leadId: {
                content: "ID priradeného kontaktu",
              },
            },
            accountStatus: {
              title: "Stav účtu",
              description: "Informácie o stave používateľského účtu",
              isActive: {
                content: "Aktívny účet",
              },
              emailVerified: {
                content: "Overený e-mail",
              },
              stripeCustomerId: {
                content: "ID zákazníka v Stripe",
              },
              userRoles: {
                content: "Používateľské roly",
              },
            },
            timestamps: {
              title: "Časové údaje",
              description: "Čas vytvorenia a poslednej úpravy",
              createdAt: {
                content: "Dátum vytvorenia",
              },
              updatedAt: {
                content: "Dátum poslednej úpravy",
              },
            },
            referralInfo: {
              title: "Údaje o odporúčaniach",
              description: "Reťazec odporúčaní a získané provízie",
              referredByUserId: {
                content: "Odporučil (ID používateľa)",
              },
              referredByCode: {
                content: "Použitý kód odporúčania",
              },
              totalReferrals: {
                content: "Používatelia získaní odporúčaním",
              },
              totalEarnedCents: {
                content: "Celková provízia v centoch",
              },
            },
            leadId: {
              content: "ID priradeného kontaktu",
            },
            email: {
              content: "E-mailová adresa",
            },
            privateName: {
              content: "Súkromné meno",
            },
            publicName: {
              content: "Verejné meno",
            },
            firstName: {
              content: "Krstné meno",
            },
            lastName: {
              content: "Priezvisko",
            },
            company: {
              content: "Firma",
            },
            phone: {
              content: "Telefónne číslo",
            },
            preferredContactMethod: {
              content: "Uprednostňovaný spôsob kontaktu",
            },
            imageUrl: {
              content: "Profilová fotografia",
            },
            bio: {
              content: "O používateľovi",
            },
            website: {
              content: "Webová stránka",
            },
            jobTitle: {
              content: "Pracovná pozícia",
            },
            emailVerified: {
              content: "Overený e-mail",
            },
            isActive: {
              content: "Aktívny účet",
            },
            stripeCustomerId: {
              content: "ID zákazníka v Stripe",
            },
            userRoles: {
              content: "Používateľské roly",
            },
            createdAt: {
              content: "Dátum vytvorenia",
            },
            updatedAt: {
              content: "Dátum poslednej úpravy",
            },
          },
          errors: {
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Ak chcete zobraziť údaje používateľa, prihláste sa",
            },
            validation: {
              title: "Neplatné údaje",
              description: "Neplatné ID používateľa",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie zobraziť tohto používateľa",
            },
            notFound: {
              title: "Používateľ sa nenašiel",
              description: "Požadovaný používateľ sa nenašiel",
            },
            conflict: {
              title: "Konflikt údajov",
              description:
                "Pre konflikt údajov sa používateľa nepodarilo načítať",
            },
            network: {
              title: "Chyba siete",
              description: "So serverom sa nepodarilo spojiť",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Prídete o neuložené zmeny",
            },
            server: {
              title: "Chyba servera",
              description:
                "Pre chybu servera sa používateľa nepodarilo načítať",
            },
            unknown: {
              title: "Neznáma chyba",
              description:
                "Pri načítaní používateľa sa vyskytla neočakávaná chyba",
            },
          },
          success: {
            title: "Používateľ sa načítal",
            description: "Údaje používateľa sa načítali",
          },
        },
        put: {
          title: "Upraviť používateľa",
          description: "Upraviť údaje používateľa a jeho profil",
          container: {
            title: "Upraviť používateľa",
            description: "Upraviť údaje a nastavenia používateľa",
          },
          id: {
            label: "ID používateľa",
            description:
              "Jedinečný identifikátor používateľa, ktorého chcete upraviť",
            placeholder: "Zadajte ID používateľa…",
          },
          sections: {
            basicInfo: {
              title: "Základné údaje",
              description: "Upraviť základné údaje používateľa",
            },
            contactInfo: {
              title: "Kontaktné údaje",
              description: "Upraviť kontaktné údaje",
            },
            profileDetails: {
              title: "Údaje profilu",
              description: "Upraviť ďalšie údaje profilu",
            },
            adminSettings: {
              title: "Nastavenia správcu",
              description: "Upraviť nastavenia správcu",
            },
          },
          email: {
            label: "E-mailová adresa",
            description: "E-mail na prihlasovanie a komunikáciu s používateľom",
            placeholder: "Zadajte e-mailovú adresu…",
          },
          privateName: {
            label: "Súkromné meno",
            description:
              "Celé úradné meno používateľa. Vidia ho iba správcovia.",
          },
          publicName: {
            label: "Verejné meno",
            description: "Meno, ktoré sa zobrazuje všetkým používateľom",
          },
          firstName: {
            label: "Krstné meno",
            description: "Krstné meno používateľa",
            placeholder: "Zadajte krstné meno…",
          },
          lastName: {
            label: "Priezvisko",
            description: "Priezvisko používateľa",
            placeholder: "Zadajte priezvisko…",
          },
          company: {
            label: "Firma",
            description: "Firma alebo organizácia používateľa",
            placeholder: "Zadajte názov firmy…",
          },
          phone: {
            label: "Telefónne číslo",
            description: "Kontaktné telefónne číslo používateľa",
            placeholder: "Zadajte telefónne číslo…",
          },
          preferredContactMethod: {
            label: "Uprednostňovaný spôsob kontaktu",
            description: "Ako si používateľ želá, aby ste ho kontaktovali",
          },
          bio: {
            label: "O používateľovi",
            description: "Stručné predstavenie používateľa",
            placeholder: "Napíšte krátke predstavenie…",
          },
          website: {
            label: "Webová stránka",
            description: "Osobná alebo firemná webová stránka používateľa",
            placeholder: "Zadajte adresu webovej stránky…",
          },
          jobTitle: {
            label: "Pracovná pozícia",
            description: "Pracovná pozícia alebo funkcia používateľa",
            placeholder: "Zadajte pracovnú pozíciu…",
          },
          emailVerified: {
            label: "Overený e-mail",
            description: "Či používateľ overil svoju e-mailovú adresu",
          },
          isActive: {
            label: "Aktívny účet",
            description: "Či je používateľský účet aktívny",
          },
          leadId: {
            label: "ID kontaktu",
            description: "Identifikátor priradeného kontaktu",
            placeholder: "Zadajte ID kontaktu…",
          },
          isBanned: {
            label: "Zablokované",
            description: "Či je používateľ na platforme zablokovaný",
          },
          bannedReason: {
            label: "Dôvod zablokovania",
            description: "Dôvod, prečo je používateľ zablokovaný",
          },
          response: {
            leadId: {
              content: "ID priradeného kontaktu",
            },
            email: {
              content: "E-mailová adresa",
            },
            privateName: {
              content: "Súkromné meno",
            },
            publicName: {
              content: "Verejné meno",
            },
            firstName: {
              content: "Krstné meno",
            },
            lastName: {
              content: "Priezvisko",
            },
            company: {
              content: "Firma",
            },
            phone: {
              content: "Telefónne číslo",
            },
            preferredContactMethod: {
              content: "Uprednostňovaný spôsob kontaktu",
            },
            imageUrl: {
              content: "Profilová fotografia",
            },
            bio: {
              content: "O používateľovi",
            },
            website: {
              content: "Webová stránka",
            },
            jobTitle: {
              content: "Pracovná pozícia",
            },
            emailVerified: {
              content: "Overený e-mail",
            },
            isActive: {
              content: "Aktívny účet",
            },
            stripeCustomerId: {
              content: "ID zákazníka v Stripe",
            },
            userRoles: {
              content: "Používateľské roly",
            },
            createdAt: {
              content: "Dátum vytvorenia",
            },
            updatedAt: {
              content: "Dátum poslednej úpravy",
            },
          },
          errors: {
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Ak chcete upraviť používateľa, prihláste sa",
            },
            validation: {
              title: "Neplatné údaje",
              description: "Skontrolujte údaje vo formulári a skúste to znova",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie upraviť tohto používateľa",
            },
            notFound: {
              title: "Používateľ sa nenašiel",
              description: "Používateľ, ktorého chcete upraviť, sa nenašiel",
            },
            conflict: {
              title: "Konflikt pri úprave",
              description:
                "Údaje používateľa sú v rozpore s existujúcimi záznamami",
            },
            server: {
              title: "Chyba servera",
              description:
                "Pre chybu servera sa používateľa nepodarilo upraviť",
            },
            unknown: {
              title: "Neznáma chyba",
              description:
                "Pri úprave používateľa sa vyskytla neočakávaná chyba",
            },
            network: {
              title: "Chyba siete",
              description: "So serverom sa nepodarilo spojiť",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Prídete o neuložené zmeny",
            },
          },
          success: {
            title: "Používateľ sa aktualizoval",
            description: "Zmeny údajov používateľa sa uložili",
          },
        },
        delete: {
          title: "Odstrániť používateľa",
          description: "Natrvalo odstrániť používateľský účet",
          container: {
            title: "Odstrániť používateľa",
            description: "Natrvalo odstrániť používateľa zo systému",
          },
          id: {
            label: "ID používateľa",
            description:
              "Jedinečný identifikátor používateľa, ktorého chcete odstrániť",
            placeholder: "Zadajte ID používateľa…",
            helpText: "Upozornenie: Tento krok sa nedá vrátiť.",
          },
          submitButton: {
            label: "Odstrániť používateľa",
            loadingText: "Odstraňuje sa…",
          },
          response: {
            deletionResult: {
              title: "Výsledok odstránenia",
              description: "Výsledok požiadavky na odstránenie",
              success: {
                content: "Odstránenie sa podarilo",
              },
              message: {
                content: "Správa o odstránení",
              },
              deletedAt: {
                content: "Dátum odstránenia",
              },
            },
            success: {
              content: "Odstránenie sa podarilo",
            },
            message: {
              content: "Správa o odstránení",
            },
          },
          errors: {
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Ak chcete odstrániť používateľa, prihláste sa",
            },
            validation: {
              title: "Neplatné údaje",
              description: "Na odstránenie bolo zadané neplatné ID používateľa",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie odstraňovať používateľov",
            },
            notFound: {
              title: "Používateľ sa nenašiel",
              description: "Používateľ, ktorého chcete odstrániť, sa nenašiel",
            },
            server: {
              title: "Chyba servera",
              description:
                "Pre chybu servera sa používateľa nepodarilo odstrániť",
            },
            unknown: {
              title: "Neznáma chyba",
              description:
                "Pri odstraňovaní používateľa sa vyskytla neočakávaná chyba",
            },
            conflict: {
              title: "Konflikt údajov",
              description:
                "Pre existujúce závislosti nemožno používateľa odstrániť",
            },
            network: {
              title: "Chyba siete",
              description: "So serverom sa nepodarilo spojiť",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Prídete o neuložené zmeny",
            },
          },
          success: {
            title: "Používateľ sa odstránil",
            description: "Používateľ sa odstránil",
          },
        },
        widget: {
          userProfile: "Profil používateľa",
          active: "Aktívny",
          inactive: "Neaktívny",
          leadId: "ID kontaktu:",
          viewLead: "Zobraziť kontakt",
          created: "Vytvorené",
          lastUpdated: "Posledná úprava",
          fullProfile: "Celý profil",
          referrals: "Odporúčania",
          subscription: "Predplatné",
          creditHistory: "História kreditov",
          deleteUser: "Odstrániť používateľa",
          userDeletedSuccessfully: "Používateľ sa odstránil",
          deletedAt: "Dátum odstránenia",
          confirmDeletion: "Potvrdiť odstránenie",
          confirmDeletionMessage:
            "Používateľ aj všetky súvisiace údaje sa natrvalo odstránia. Tento krok sa nedá vrátiť.",
          titleReferralCodes: "Zobraziť kódy odporúčaní a štatistiky",
          titleSubscription: "Zobraziť predplatné",
          titleCopyUserId: "Skopírovať ID používateľa",
        },
      },
    },
  },
  view: {
    category: "Používatelia",
    tags: {
      user: "Používateľ",
      view: "Zobraziť",
    },

    badge: "Údaje používateľa",
    get: {
      title: "Zobraziť používateľa",
      description: "Zobraziť podrobné údaje používateľa",
      userId: {
        label: "ID používateľa",
      },
    },
    errors: {
      validation: {
        title: "Neplatná požiadavka",
        description: "Skontrolujte ID používateľa a skúste to znova",
      },
      network: {
        title: "Chyba pripojenia",
        description:
          "Spojenie sa nepodarilo. Skontrolujte pripojenie na internet.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť údaje používateľa, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tohto používateľa",
      },
      notFound: {
        title: "Používateľ sa nenašiel",
        description: "Tento používateľ sa nenašiel",
      },
      serverError: {
        title: "Vyskytla sa chyba",
        description:
          "Údaje používateľa sa nepodarilo načítať. Skúste to znova.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Vyskytla sa neočakávaná chyba. Skúste to znova.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description:
          "Údaje používateľa sa medzitým zmenili. Obnovte stránku a skúste to znova.",
      },
    },
    success: {
      title: "Používateľ sa načítal",
      description: "Údaje používateľa sa načítali",
    },
    empty: "Údaje používateľa sa nenašli",
    sections: {
      basicInfo: "Základné údaje",
      chatActivity: "Aktivita v čete",
      credits: "Kredity",
      payments: "Platby",
      newsletter: "Newsletter",
      referrals: "Odporúčania",
      recentActivity: "Nedávna aktivita",
    },
    status: {
      active: "Aktívny",
      banned: "Zablokované",
      inactive: "Neaktívny",
      verified: "Overené",
    },
    fields: {
      userId: "ID používateľa",
      locale: "Jazyk a región",
      twoFactor: "Dvojfaktorové overenie",
      enabled: "Zapnuté",
      disabled: "Vypnuté",
      marketing: "Marketing",
      optedIn: "Súhlas udelený",
      optedOut: "Bez súhlasu",
      created: "Vytvorené",
      lastUpdated: "Posledná úprava",
      banReason: "Dôvod zablokovania",
      roles: "Roly",
    },
    credits: {
      currentBalance: "Aktuálny zostatok",
      availableCredits: "Dostupné kredity",
      packBreakdown: "Rozpis balíkov kreditov",
      subscription: "Predplatné",
      permanent: "Bez obmedzenia platnosti",
      bonus: "Bonus",
      earned: "Získané",
      expires: "Platnosť do",
    },
    payment: {
      stripeCustomerId: "ID zákazníka v Stripe",
      activeSubscription: "Aktívne predplatné",
      subscriptionPlan: "Plán",
      subscriptionStatus: "Stav predplatného",
      nextBilling: "Ďalšia fakturácia",
    },
    common: {
      yes: "Áno",
      no: "Nie",
    },
    newsletter: {
      status: "Stav",
      subscribed: "Odber prihlásený",
      notSubscribed: "Bez odberu",
      subscribedAt: "Dátum prihlásenia na odber",
      confirmedAt: "Dátum potvrdenia",
      lastEmailSent: "Posledný odoslaný e-mail",
    },
    referrals: {
      totalReferrals: "Odporúčania celkovo",
      activeCodes: "Aktívne kódy",
      revenue: "Tržby",
      earnings: "Provízie",
    },
    activity: {
      lastLogin: "Posledné prihlásenie",
      lastThread: "Posledné vlákno",
      lastMessage: "Posledná správa",
      lastPayment: "Posledná platba",
    },
    tabs: {
      overview: "Prehľad",
      credits: "Kredity",
      referrals: "Odporúčania",
      earnings: "Provízie",
      connections: "Prepojenia",
      favorites: "Obľúbené",
      skills: "Zručnosti",
    },
    modelUsage: {
      title: "Využitie modelov",
      model: "Model",
      spent: "Minuté kredity",
      messages: "Správy",
      noUsage: "Údaje o využití modelov zatiaľ nie sú k dispozícii",
    },
    connections: {
      title: "Prepojenia",
      leadsTitle: "Prepojené kontakty",
      usersTitle: "Prepojení používatelia",
      noLeads: "Žiadne prepojené kontakty",
      noUsers: "Žiadni prepojení používatelia",
      leadEmail: "E-mail",
      leadBusiness: "Firma",
      leadStatus: "Stav",
      ipAddress: "IP adresa",
      device: "Zariadenie",
      linkReason: "Dôvod prepojenia",
      linkedAt: "Dátum prepojenia",
      userId: "ID používateľa",
      userEmail: "E-mail",
      userPublicName: "Používateľské meno",
      viewLead: "Zobraziť kontakt",
      viewUser: "Zobraziť používateľa",
    },
    ban: {
      banUser: "Zablokovať používateľa",
      unbanUser: "Odblokovať používateľa",
    },
    widget: {
      actions: {
        edit: "Upraviť",
        delete: "Odstrániť",
        viewCreditHistory: "Zobraziť históriu kreditov",
        viewSubscription: "Zobraziť predplatné",
        viewReferralCodes: "Zobraziť kódy odporúčaní",
        viewReferralEarnings: "Zobraziť provízie za odporúčania",
        addCredits: "Pridať kredity",
        viewLead: "Zobraziť kontakt",
        copyUserId: "Skopírovať ID používateľa",
        copied: "Skopírované",
      },
      sections: {
        quickActions: "Rýchle akcie",
      },
      stats: {
        totalThreads: "Vlákna celkovo",
        totalMessages: "Správy celkovo",
        userMessages: "Správy používateľa",
        lastActivity: "Posledná aktivita",
        never: "Nikdy",
        freeCredits: "Bezplatné kredity",
        freePeriod: "Obdobie",
        totalSpent: "Minuté celkovo",
        totalPurchased: "Zakúpené celkovo",
        totalRevenue: "Tržby celkovo",
        payments: "platby",
        successful: "Úspešné",
        failed: "Neúspešné",
        totalRefunds: "Vrátené platby celkovo",
        lastPayment: "Posledná platba",
      },
    },
  },
};
