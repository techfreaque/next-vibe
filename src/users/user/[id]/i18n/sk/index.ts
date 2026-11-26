import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
            description: "Ak chcete spravovať používateľské roly, prihláste sa",
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
            description: "Ak chcete spravovať používateľské roly, prihláste sa",
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
      titleShort: "Údaje používateľa",
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
          confirmedEarnedCents: {
            content: "Potvrdené provízie v centoch",
          },
          pendingEarnedCents: {
            content: "Čakajúce provízie v centoch",
          },
        },
        engagement: {
          title: "Kredity a aktivita",
          description: "Zostatok, spotreba, provízie a aktivita",
          creditBalance: {
            content: "Zostatok kreditov",
          },
          freeAllowance: {
            content: "Bezplatný prídel",
          },
          lifetimeCreditsSpent: {
            content: "Spotreba za celé obdobie",
          },
          favoritesCount: {
            content: "Obľúbené",
          },
          customSkillsCount: {
            content: "Vlastné zručnosti",
          },
          newsletterConsent: {
            content: "Súhlas s odberom newslettera",
          },
          hasConfirmedNewsletter: {
            content: "Potvrdený odber newslettera",
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
          detail: "Používateľ s ID {{userId}} sa nenašiel.",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Pre konflikt údajov sa používateľa nepodarilo načítať",
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
          description: "Pre chybu servera sa používateľa nepodarilo načítať",
          detail: "Používateľa sa nepodarilo načítať: {{error}}",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri načítaní používateľa sa vyskytla neočakávaná chyba",
        },
      },
      success: {
        title: "Používateľ sa načítal",
        description: "Údaje používateľa sa načítali",
      },
    },
    put: {
      title: "Upraviť používateľa",
      titleShort: "Upraviť používateľa",
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
        description: "Celé úradné meno používateľa. Vidia ho iba správcovia.",
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
          detail: "Používateľ s ID {{userId}} sa nenašiel.",
        },
        conflict: {
          title: "Konflikt pri úprave",
          description:
            "Údaje používateľa sú v rozpore s existujúcimi záznamami",
        },
        server: {
          title: "Chyba servera",
          description: "Pre chybu servera sa používateľa nepodarilo upraviť",
          detail: "Zmeny údajov používateľa sa nepodarilo uložiť: {{error}}",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri úprave používateľa sa vyskytla neočakávaná chyba",
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
      titleShort: "Odstrániť používateľa",
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
          detail: "Používateľ s ID {{userId}} sa nenašiel.",
        },
        server: {
          title: "Chyba servera",
          description: "Pre chybu servera sa používateľa nepodarilo odstrániť",
          detail: "Používateľa sa nepodarilo odstrániť: {{error}}",
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
      relatedRecords: "Súvisiace údaje",
      relatedPayments: "Platby",
      relatedThreadActivity: "Aktivita v konverzáciách",
      confirmBan: "Chcete zablokovať prístup k účtu používateľa {{name}}?",
      confirmUnban: "Chcete obnoviť prístup k účtu používateľa {{name}}?",
      editAccountNamed: "Úprava účtu používateľa {{name}}",
      saveAccount: "Uložiť zmeny",
      fullProfile: "Celý profil",
      referrals: "Odporúčania",
      subscription: "Predplatné",
      creditHistory: "História kreditov",
      identifiers: "Identifikátory účtu",
      engagementTitle: "Kredity a aktivita",
      balance: "Zostatok kreditov",
      freeAllowance: "Limit bezplatných kreditov",
      lifetimeSpend: "Minuté kredity",
      earned: "Získané",
      earnedPending: "Čaká na potvrdenie:",
      referred: "Získané odporúčaním",
      favorites: "Obľúbené",
      skills: "Zručnosti",
      newsletter: "Odber noviniek",
      newsletterConfirmed: "Potvrdené",
      newsletterConsent: "Súhlas udelený",
      newsletterNone: "Žiadne",
      deleteUser: "Odstrániť používateľa",
      userDeletedSuccessfully: "Používateľ sa odstránil",
      deletedAt: "Dátum odstránenia",
      dangerZone: "Nevratné kroky",
      deleteAccountHint: "Natrvalo odstráňte účet používateľa {{name}}.",
      cancelDeletion: "Zrušiť",
      confirmDeletion: "Potvrdiť odstránenie",
      confirmDeletionMessage:
        "Účet sa natrvalo odstráni. Odstránenie už nebudete môcť vrátiť späť.",
      titleReferralCodes: "Zobraziť kódy odporúčaní a štatistiky",
      titleSubscription: "Zobraziť predplatné",
      copyLeadId: "Skopírovať ID kontaktu",
      noEarnings: "Žiadne odmeny za odporúčania",
      earningUnitsUnavailable: "Rozpis odmien nie je k dispozícii",
      titleCopyUserId: "Skopírovať ID používateľa",
    },
    getCrm: {
      get: {
        title: "Načítať profil používateľa v CRM",
        titleShort: "Profil v CRM",
        description: "Načítať fakturačné údaje používateľa a počet poznámok",
        fields: {
          userId: {
            label: "ID používateľa",
            description: "Používateľ, ktorého chcete vyhľadať",
            placeholder: "UUID používateľa",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné ID používateľa",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte prístup k údajom tohto používateľa v CRM",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Používateľ sa nenašiel",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Údaje sú v konflikte",
          },
          network: {
            title: "Chyba siete",
            description: "Sieťová požiadavka zlyhala",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          internal: {
            title: "Interná chyba",
            description: "Chyba servera. Skúste to znova.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
        },
        success: {
          title: "Profil v CRM sa načítal",
          description: "Údaje používateľa v CRM sa načítali",
        },
        widget: {
          addNote: "Pridať poznámku",
          viewNotes: "Zobraziť poznámky",
        },
        response: {
          id: "ID používateľa",
          email: "E-mail",
          privateName: "Meno",
          companyBillingName: "Názov firmy alebo fakturačné meno",
          vatNumber: "IČ DPH",
          taxId: "DIČ",
          phone: "Telefón",
          addressLine1: "Adresa, prvý riadok",
          addressLine2: "Adresa, druhý riadok",
          city: "Mesto",
          region: "Región",
          postalCode: "PSČ",
          billingCountry: "Krajina",
          defaultCurrency: "Predvolená mena",
          paymentTermsDays: "Lehota splatnosti v dňoch",
          notesCount: "Počet poznámok",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Pridať poznámku k používateľovi",
        titleShort: "Vytvoriť poznámku",
        description:
          "Pridať k používateľovi poznámku CRM, záznam o hovore alebo e-maile, stretnutie či úlohu",
        fields: {
          userId: {
            label: "Používateľ",
            description: "Používateľ, ktorého sa poznámka týka",
            placeholder: "Vyberte používateľa",
          },
          type: {
            label: "Typ aktivity",
            description: "Druh zaznamenávanej aktivity",
            placeholder: "Vyberte typ",
          },
          content: {
            label: "Obsah",
            description: "Podrobnosti aktivity",
            placeholder: "Opíšte, čo sa stalo…",
          },
          isPrivate: {
            label: "Súkromná",
            description: "Súkromné poznámky vidíte iba vy",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Skontrolujte polia a skúste to znova",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte prístup k tomuto používateľovi",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Používateľ sa nenašiel",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Údaje sú v konflikte",
          },
          network: {
            title: "Chyba siete",
            description: "Sieťová požiadavka zlyhala",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          internal: {
            title: "Interná chyba",
            description: "Chyba servera. Skúste to znova.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
        },
        success: {
          title: "Poznámka sa vytvorila",
          description: "Poznámka sa uložila",
        },
        widget: {
          created: "Poznámka sa vytvorila",
          noteId: "ID poznámky",
          backToNotes: "Späť na poznámky",
        },
        response: {
          id: "ID poznámky",
          userId: "ID používateľa",
          authorUserId: "ID autora",
          type: "Typ",
          content: "Obsah",
          isPrivate: "Súkromná",
          createdAt: "Dátum vytvorenia",
          updatedAt: "Dátum poslednej úpravy",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "Zobraziť poznámky k používateľovi",
        titleShort: "Poznámky k používateľovi",
        description:
          "Zobraziť poznámky CRM k používateľovi podľa typu a viditeľnosti",
        fields: {
          userId: {
            label: "ID používateľa",
            description: "Používateľ, ktorého poznámky chcete zobraziť",
            placeholder: "UUID používateľa",
          },
          type: {
            label: "Typ",
            description: "Filtrovať podľa typu aktivity",
            placeholder: "Všetky typy",
          },
          isPrivate: {
            label: "Iba súkromné",
            description: "Zobraziť iba vaše súkromné poznámky",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Skontrolujte filtre a skúste to znova",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte prístup k týmto poznámkam",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Používateľ sa nenašiel",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Údaje sú v konflikte",
          },
          network: {
            title: "Chyba siete",
            description: "Sieťová požiadavka zlyhala",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          internal: {
            title: "Interná chyba",
            description: "Chyba servera. Skúste to znova.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
        },
        success: {
          title: "Poznámky sa načítali",
          description: "Poznámky sa načítali",
        },
        widget: {
          addNote: "Pridať poznámku",
          total: "Spolu",
          empty: "Zatiaľ žiadne poznámky",
          delete: "Odstrániť",
          private: "Súkromná",
          ago: "dozadu",
        },
        response: {
          notes: "Poznámky",
          total: "Spolu",
          note: {
            id: "ID poznámky",
            userId: "ID používateľa",
            authorUserId: "ID autora",
            type: "Typ",
            content: "Obsah",
            isPrivate: "Súkromná",
            createdAt: "Dátum vytvorenia",
            updatedAt: "Dátum poslednej úpravy",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Odstrániť poznámku k používateľovi",
        titleShort: "Odstrániť poznámku",
        description:
          "Poznámku z CRM môže odstrániť iba jej autor alebo správca",
        fields: {
          noteId: {
            label: "ID poznámky",
            description: "Poznámka, ktorú chcete odstrániť",
            placeholder: "UUID poznámky",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné ID poznámky",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description:
              "Túto poznámku môže odstrániť iba jej autor alebo správca",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Poznámka sa nenašla",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Údaje sú v konflikte",
          },
          network: {
            title: "Chyba siete",
            description: "Sieťová požiadavka zlyhala",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          internal: {
            title: "Interná chyba",
            description: "Chyba servera. Skúste to znova.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
        },
        success: {
          title: "Poznámka sa odstránila",
          description: "Poznámka sa natrvalo odstránila",
        },
        widget: {
          warning: "Táto poznámka sa natrvalo odstráni.",
          deleted: "Poznámka sa odstránila.",
          backToNotes: "Späť na poznámky",
        },
        response: {
          deleted: "Odstránené",
        },
      },
      tag: "CRM",
    },
  },
};
