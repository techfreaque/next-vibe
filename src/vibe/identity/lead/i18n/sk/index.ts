import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kontakty",
  tags: {
    leads: "Kontakty",
    batch: "Hromadné operácie",
    campaigns: "Kampane",
    management: "Správa",
    create: "Vytvoriť",
    search: "Hľadať",
    export: "Export",
    import: "Import",
    csv: "CSV",
    jobs: "Úlohy",
    list: "Zoznam",
  },
  admin: {
    title: "Správa kontaktov",
    tabs: {
      overview: "Navigácia v kontaktoch",
      stats: "Prehľad",
      stats_description: "Zobraziť štatistiky a analýzy kontaktov",
      leads: "Kontakty",
      leads_description: "Zobraziť a spravovať všetky kontakty",
      emails: "E-mailové kampane",
      emails_description: "Spravovať e-mailové kampane a šablóny",
      abTesting: "A/B testovanie",
      abTesting_description: "Nastaviť varianty testovania A/B",
      campaignStarter: "Spúšťanie kampaní",
      campaignStarter_description: "Nastaviť a spustiť kampane pre kontakty",
    },
    import: {
      label: "Importovať",
      description: "Importovať kontakty zo súborov CSV",
    },
    emails: {
      preview: {
        error: "Náhľad e-mailu sa nepodarilo vytvoriť",
        live: "Živý náhľad",
        actions: {
          title: "Náhľad e-mailu",
          description: "Pozrite si, ako sa e-mail zobrazí príjemcom.",
        },
      },
      preview_title: "Náhľad e-mailu",
      testEmail: {
        button: "Odoslať testovací e-mail",
      },
      from: "Od",
      recipient: "Príjemca",
      subject: "Predmet",
      email_preview: "Náhľad e-mailu",
      stage_of: "z",
      stages: "fázy",
      journey: "Séria",
      back: "Späť",
      previous: "Predchádzajúca",
      next: "Ďalej",
    },
  },
  auth: {
    public: {
      validCookie: "Podľa súboru cookie sa našiel platný kontakt",
      invalidCookie: "Súbor cookie odkazuje na neplatný kontakt",
      created: "Anonymný kontakt sa vytvoril",
      error: "Overenie kontaktu bez prihlásenia zlyhalo",
    },
    authenticated: {
      primaryFound: "Hlavný kontakt používateľa sa našiel",
      noPrimary: "Hlavný kontakt používateľa sa nenašiel",
      error: "Overenie kontaktu prihláseného používateľa zlyhalo",
    },
    link: {
      alreadyExists: "Prepojenie kontaktov už existuje",
      created: "Prepojenie kontaktov sa vytvorilo",
      error: "Chyba pri prepájaní kontaktov",
    },
    validate: {
      error: "Chyba pri overovaní kontaktu",
    },
    getOrCreate: {
      invalid: "Neplatné ID kontaktu",
      error: "Kontakt sa nepodarilo načítať alebo vytvoriť",
    },
    create: {
      existingFound: "Našiel sa už evidovaný anonymný kontakt",
      success: "Kontakt sa úspešne vytvoril",
      error: "Chyba pri vytváraní kontaktu",
    },
    createForUser: {
      success: "Kontakt používateľa sa vytvoril",
      error: "Kontakt používateľa sa nepodarilo vytvoriť",
    },
    cookie: {
      set: "Súbor cookie kontaktu sa nastavil",
      error: "Nepodarilo sa nastaviť súbor cookie kontaktu",
    },
    getUserLeads: {
      error: "Nepodarilo sa načítať kontakty používateľa",
    },
    linkLeads: {
      sameId: "Kontakt nemožno prepojiť so sebou samým",
      alreadyExists: "Prepojenie kontaktov už existuje",
      created: "Kontakty sa prepojili",
      error: "Chyba pri prepájaní kontaktov",
    },
    getLinkedLeads: {
      error: "Prepojené kontakty sa nepodarilo načítať",
    },
    getAllLinkedLeads: {
      error: "Nepodarilo sa načítať všetky prepojené kontakty",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Kontakt nemožno prepojiť so sebou samým",
    linkFailed: "Kontakty sa nepodarilo prepojiť",
  },
  filters: {
    search: {
      label: "Hľadať",
      description: "Vyhľadajte kontakty podľa e-mailu alebo názvu firmy",
      placeholder: "Zadajte e-mail alebo názov firmy…",
    },
    status: {
      label: "Stav",
      description: "Filtrovať podľa stavu kontaktu",
      placeholder: "Všetky stavy",
    },
    currentCampaignStage: {
      label: "Fáza kampane",
      description: "Filtrovať podľa fázy e-mailovej kampane",
      placeholder: "Všetky fázy",
    },
    source: {
      label: "Zdroj",
      description: "Filtrovať podľa zdroja kontaktu",
      placeholder: "Všetky zdroje",
    },
    country: {
      label: "Región jazykového nastavenia",
      description:
        "Filtrovať podľa regiónu, ktorý si návštevník zvolil v jazykovom nastavení webu",
      placeholder: "Všetky regióny",
    },
    language: {
      label: "Jazyk",
      description: "Filtrovať podľa jazyka",
      placeholder: "Všetky jazyky",
    },
    sortBy: {
      label: "Zoradiť podľa",
      description: "Vyberte pole, podľa ktorého chcete zoradiť kontakty",
      placeholder: "Pole zoradenia",
    },
    sortOrder: {
      label: "Poradie",
      description: "Zoradiť vzostupne alebo zostupne",
      placeholder: "Poradie zoradenia",
    },
    statusFilters: {
      title: "Filtre stavu a kampane",
      description: "Filtrovať podľa stavu, fázy kampane a zdroja",
    },
    locationFilters: {
      title: "Filtre krajiny a jazyka",
      description: "Filtrovať podľa krajiny a jazyka",
    },
    sortingOptions: {
      title: "Možnosti zoradenia",
      description: "Nastaviť poradie zoradenia",
    },
  },
  batch: {
    category: "Kontakty",
    tags: {
      leads: "Kontakty",
      batch: "Hromadné operácie",
    },

    patch: {
      title: "Hromadná úprava",
      description: "Hromadne upraviť kontakty, ktoré zodpovedajú filtru",
      form: {
        title: "Nastavenie hromadnej úpravy",
        description: "Nastavte parametre hromadnej úpravy",
      },
      search: {
        label: "Vyhľadať",
        description: "Vyhľadajte kontakty podľa e-mailu alebo názvu firmy",
        placeholder: "Zadajte e-mail alebo názov firmy",
      },
      status: {
        label: "Filter stavu",
        description: "Filtrovať kontakty podľa aktuálneho stavu",
      },
      currentCampaignStage: {
        label: "Filter fázy kampane",
        description: "Filtrovať kontakty podľa aktuálnej fázy kampane",
      },
      source: {
        label: "Filter zdroja",
        description: "Filtrovať kontakty podľa zdroja",
      },
      scope: {
        label: "Rozsah operácie",
        description: "Určte, ktoré kontakty má hromadná operácia zahrnúť",
      },
      dryRun: {
        label: "Skúšobný režim",
        description: "Zobrazí náhľad zmien bez ich vykonania",
      },
      maxRecords: {
        label: "Limit záznamov",
        description: "Najvyšší počet záznamov na spracovanie",
      },
      updates: {
        title: "Polia na úpravu",
        description: "Vyberte polia, ktoré chcete upraviť",
        status: {
          label: "Nový stav",
          description: "Nastaví kontaktom tento stav",
        },
        currentCampaignStage: {
          label: "Nová fáza kampane",
          description: "Nastaví kontaktom túto fázu kampane",
        },
        source: {
          label: "Nový zdroj",
          description: "Nastaví kontaktom tento zdroj",
        },
        notes: {
          label: "Poznámky",
          description: "Pridať alebo upraviť poznámky ku kontaktu",
        },
      },
      response: {
        title: "Výsledok úpravy",
        description: "Výsledné údaje hromadnej úpravy",
        success: "Úspech",
        totalMatched: "Počet zodpovedajúcich kontaktov",
        totalProcessed: "Počet spracovaných kontaktov",
        totalUpdated: "Počet upravených kontaktov",
        preview: "Náhľad",
        errors: "Chyby",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vykonanie hromadnej operácie sa prihláste",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre hromadnej úpravy",
        },
        server: {
          title: "Chyba servera",
          description: "Počas hromadnej úpravy nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Počas hromadnej úpravy nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Počas hromadnej úpravy nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie vykonávať hromadné operácie",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj na hromadnú úpravu sa nenašiel",
        },
        conflict: {
          title: "Konflikt",
          description: "Počas hromadnej úpravy nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Nastavenie hromadnej úpravy má neuložené zmeny",
        },
      },
      success: {
        title: "Úprava dokončená",
        description: "Hromadná úprava sa úspešne dokončila",
      },
    },
    delete: {
      title: "Hromadné odstránenie",
      description: "Odstráni naraz kontakty zodpovedajúce filtru",
      form: {
        title: "Nastavenia hromadného odstránenia",
        description: "Nastavte parametre hromadného odstránenia",
      },
      search: {
        label: "Vyhľadať",
        description: "Vyhľadajte kontakty podľa e-mailu alebo názvu firmy",
      },
      status: {
        label: "Filter stavu",
        description: "Filtrovať kontakty podľa aktuálneho stavu",
      },
      confirmDelete: {
        label: "Potvrdiť odstránenie",
        description: "Potvrďte, že chcete odstrániť vybrané kontakty",
      },
      dryRun: {
        label: "Skúšobný režim",
        description: "Zobrazí náhľad bez odstránenia záznamov",
      },
      maxRecords: {
        label: "Limit záznamov",
        description: "Najvyšší počet záznamov na odstránenie",
      },
      response: {
        title: "Výsledok odstránenia",
        description: "Výsledky hromadného odstránenia",
        success: "Úspech",
        totalMatched: "Počet zodpovedajúcich kontaktov",
        totalProcessed: "Počet spracovaných kontaktov",
        totalDeleted: "Počet odstránených kontaktov",
        preview: "Náhľad",
        errors: "Chyby",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na hromadné odstránenie kontaktov sa prihláste",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre hromadného odstránenia",
        },
        server: {
          title: "Chyba servera",
          description:
            "Počas hromadného odstránenia nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Počas hromadného odstránenia nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Počas hromadného odstránenia nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie hromadne odstraňovať kontakty",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj na hromadné odstránenie sa nenašiel",
        },
        conflict: {
          title: "Konflikt",
          description: "Počas hromadného odstránenia nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Nastavenie hromadného odstránenia má neuložené zmeny",
        },
      },
      success: {
        title: "Odstránenie dokončené",
        description: "Hromadné odstránenie sa úspešne dokončilo",
      },
    },
    widget: {
      update: {
        headerTitle: "Hromadne upraviť kontakty",
        emptyStateTitle: "Hromadne upraviť kontakty",
        emptyStateDescription:
          "Upravte naraz údaje kontaktov, ktoré zodpovedajú filtru. Použite funkciu",
        emptyStateDescriptionStrong: "Skúšobný režim",
        emptyStateDescriptionSuffix:
          "a pred uložením zmien si pozrite, ktorých kontaktov sa úprava dotkne.",
        emptyStateTip1:
          "Nastavte filtre a formulár odošlite, aby sa najprv zobrazil skúšobný náhľad",
        emptyStateTip2: "Ak chcete vykonať zmeny, vypnite skúšobný režim",
        highVolumeTitle:
          "Veľká dávka. Počet zodpovedajúcich kontaktov: {{count}}",
        highVolumeDescription:
          "Úprava zasiahne veľa záznamov. Pred vypnutím skúšobného režimu a odoslaním si dôkladne pozrite náhľad.",
        partialBatchTitle: "Dávka bola spracovaná čiastočne",
        partialBatchDescription:
          "Spracované kontakty: {{processed}} z {{matched}} zodpovedajúcich. Ak chcete spracovať viac kontaktov, zvýšte limit záznamov alebo operáciu spustite znova.",
        successTitle: "Hromadná operácia dokončená",
        failureTitle: "Hromadná operácia zlyhala",
        statMatched: "Zodpovedajúce",
        statProcessed: "Spracované",
        statUpdated: "Upravené",
        btnRunAgain: "Spustiť znova",
        btnViewAllAffected: "Zobraziť všetky dotknuté kontakty",
        btnViewInList: "Zobraziť v zozname",
        dryRunPreviewTitle:
          "Skúšobný náhľad (počet dotknutých kontaktov: {{count}})",
        leadFallback: "Kontakt {{number}}",
        errorsTitle: "Počet chýb: {{count}}",
        errorRow: "Kontakt {{leadId}}: {{error}}",
        sectionFilter: "Kritériá filtra",
        sectionUpdates: "Polia na úpravu",
        sectionSettings: "Nastavenie operácie",
        activeFiltersLabel: "Aktívne filtre zo zoznamu (predvyplnené)",
        filterSearch: "Vyhľadať",
        submitButton: "Použiť úpravy",
        submitButtonLoading: "Používajú sa zmeny…",
      },
      delete: {
        headerTitle: "Hromadne odstrániť kontakty",
        warningTitle: "Upozornenie: Kontakt sa natrvalo odstráni ({{count}}).",
        warningTitlePlural:
          "Upozornenie: Počet kontaktov na trvalé odstránenie: {{count}}",
        warningDescription:
          "Túto akciu nemožno vrátiť. Všetky údaje kontaktov, ktoré zodpovedajú filtru, sa natrvalo odstránia. Ak chcete pokračovať, vypnite skúšobný režim a potvrďte odstránenie.",
        successTitle: "Odstránenie dokončené",
        failureTitle: "Odstránenie zlyhalo",
        statMatched: "Zodpovedajúce",
        statDeleted: "Odstránené",
        btnRunAgain: "Spustiť znova",
        btnViewRemainingLeads: "Zobraziť zostávajúce kontakty",
        previewTitle: "Natrvalo sa odstránia kontakty ({{count}})",
        leadFallback: "Kontakt {{number}}",
        errorRow: "Kontakt {{leadId}}: {{error}}",
        sectionFilter: "Kritériá filtra",
        sectionSettings: "Nastavenie odstránenia",
        activeFiltersLabel: "Aktívne filtre zo zoznamu (predvyplnené)",
        filterSearch: "Vyhľadať",
        submitButton: "Odstrániť kontakty",
        submitButtonLoading: "Odstraňuje sa…",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Aktuálna stránka",
        allPages: "Všetky stránky",
      },
      leadStatus: {
        new: "Nový",
        pending: "Čaká",
        campaignRunning: "Kampaň prebieha",
        websiteUser: "Používateľ webu",
        newsletterSubscriber: "Odberateľ newslettera",
        inContact: "Oslovený",
        signedUp: "Zaregistrovaný",
        subscriptionConfirmed: "Predplatné potvrdené",
        unsubscribed: "Odhlásený z odberu",
        bounced: "Vrátené",
        invalid: "Neplatný",
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
        website: "Webová stránka",
        socialMedia: "Sociálne médiá",
        emailCampaign: "E-mailová kampaň",
        referral: "Odporúčanie",
        csvImport: "Import CSV",
      },
    },
    email: {
      admin: {
        batchUpdate: {
          title: "Hromadná úprava dokončená",
          subject: "Výsledky hromadnej úpravy",
          preview: "Počet spracovaných kontaktov: {{totalProcessed}}",
          message:
            "Hromadná úprava je dokončená. Spracované kontakty: {{totalProcessed}}.",
          operationSummary: "Súhrn operácie",
          totalMatched: "Počet zodpovedajúcich kontaktov",
          totalProcessed: "Počet spracovaných kontaktov",
          totalUpdated: "Počet upravených kontaktov",
          errors: "Chyby",
          dryRunNote: "Skúšobný režim. Žiadne údaje sa nezmenili.",
          viewLeads: "Zobraziť upravené kontakty",
          error: {
            noData: "Výsledky hromadnej úpravy nie sú dostupné",
          },
        },
        batchDelete: {
          title: "Hromadné odstránenie dokončené",
          subject: "Výsledky hromadného odstránenia",
          preview:
            "Počet kontaktov spracovaných na odstránenie: {{totalProcessed}}",
          message:
            "Hromadné odstránenie je dokončené. Spracované kontakty: {{totalProcessed}}.",
          operationSummary: "Súhrn operácie",
          totalMatched: "Počet zodpovedajúcich kontaktov",
          totalProcessed: "Počet spracovaných kontaktov",
          totalDeleted: "Počet odstránených kontaktov",
          errors: "Chyby",
          dryRunNote: "Skúšobný režim. Žiadne údaje sa neodstránili.",
          viewLeads: "Zobraziť kontakty",
          error: {
            noData: "Výsledky hromadného odstránenia nie sú dostupné",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "Vyskytla sa interná chyba servera",
        },
      },
    },
  },
  campaigns: {
    category: "Správa kampaní",
    tags: {
      campaigns: "Kampane",
      management: "Správa",
    },
    campaignStarter: {
      category: "Správa kampaní",
      tag: "Spúšťanie kampaní",
      task: {
        description:
          "Spustí kampane pre nové kontakty zmenou ich stavu na PENDING",
      },
      errors: {
        server: {
          title: "Chyba servera",
          description:
            "Pri spracovaní požiadavky na spustenie kampaní nastala chyba",
        },
        invalidTransition: "Kampaň sa nedá spustiť pre neplatný prechod stavu",
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre požiadavky",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj sa nenašiel",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
      },
      post: {
        title: "Spúšťanie kampaní",
        description: "Spustí kampane pre nové kontakty",
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre požiadavky",
          },
          server: {
            title: "Chyba servera",
            description: "Nastala chyba pri spustení kampaní",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
        },
        fields: {
          timezone: {
            label: "Časové pásmo",
            description: "Časové pásmo prehliadača na prepočet hodín",
          },
          dryRun: {
            label: "Skúšobný režim",
            description: "Spustiť bez vykonania zmien",
          },
          force: {
            label: "Spustiť mimo plánu",
            description: "Obíde obmedzenia plánovaných dní a hodín",
          },
        },
        response: {
          leadsProcessed: "Spracované kontakty",
          leadsStarted: "Kontakty so spustenou kampaňou",
          leadsSkipped: "Kontakty preskočené",
          executionTimeMs: "Čas vykonania (ms)",
          errors: "Chyby",
          quotaDetails: "Podrobnosti o kvóte",
        },
        success: {
          title: "Spustenie kampaní dokončené",
          description: "Kampane sa úspešne spustili",
        },
      },
      get: {
        title: "Získať nastavenia spúšťania kampaní",
        description: "Načíta nastavenia spúšťania kampaní",
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
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
          notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
        },
        fields: {
          timezone: {
            label: "Časové pásmo",
            description: "Časové pásmo prehliadača na prepočet hodín",
          },
        },
        response: {
          dryRun: "Skúšobný režim",
          minAgeHours: "Minimálny vek kontaktu (hodiny)",
          enabledDays: "Povolené dni",
          enabledHours: "Povolené hodiny",
          localeConfig: "Nastavenia podľa jazyka a regiónu",
          leadsPerWeek: "Kontakty za týždeň",
          schedule: "Harmonogram",
          enabled: "Zapnuté",
          priority: "Priorita",
          timeout: "Časový limit",
          retries: "Opakované pokusy",
          retryDelay: "Odstup medzi pokusmi",
        },
        success: {
          title: "Nastavenia načítané",
          description: "Nastavenia spúšťania kampaní sa načítali",
        },
      },
      put: {
        title: "Nastavenia spúšťania kampaní",
        description: "Upraviť nastavenia spúšťania kampaní",
        dryRun: {
          label: "Skúšobný režim",
          description: "Zapnúť skúšobný režim",
        },
        minAgeHours: {
          label: "Minimálny vek kontaktu (hodiny)",
          description: "Minimálny vek kontaktu v hodinách pred spracovaním",
        },
        enabledDays: {
          label: "Povolené dni",
          description: "Dni v týždni, v ktorých môžu kampane prebiehať",
          monday: "Pondelok",
          tuesday: "Utorok",
          wednesday: "Streda",
          thursday: "Štvrtok",
          friday: "Piatok",
          saturday: "Sobota",
          sunday: "Nedeľa",
        },
        enabledHours: {
          label: "Povolené hodiny",
          description: "Hodiny, v ktorých môžu kampane prebiehať",
          start: {
            label: "Hodina začiatku",
            description: "Hodina spustenia kampaní (0 až 23)",
          },
          end: {
            label: "Hodina konca",
            description: "Hodina ukončenia kampaní (0 až 23)",
          },
        },
        localeConfig: {
          label: "Nastavenia podľa jazyka a regiónu",
          description:
            "Pre každé jazykové nastavenie: počet kontaktov za týždeň, aktívne dni a hodiny",
        },
        leadsPerWeek: {
          label: "Kontakty za týždeň",
          description: "Najvyšší počet kontaktov na spracovanie za týždeň",
        },
        schedule: {
          label: "Harmonogram",
          description: "Plán spúšťania kampaní",
        },
        enabled: {
          label: "Zapnuté",
          description: "Zapnúť alebo vypnúť automatické spúšťanie kampaní",
        },
        priority: {
          label: "Priorita",
          description: "Priorita spúšťania kampaní",
        },
        timeout: {
          label: "Časový limit",
          description: "Časový limit v milisekundách",
        },
        retries: {
          label: "Opakované pokusy",
          description: "Počet opakovaných pokusov",
        },
        retryDelay: {
          label: "Odstup medzi pokusmi",
          description: "Čas medzi opakovanými pokusmi v milisekundách",
        },
        success: {
          title: "Nastavenia uložené",
          description: "Nastavenia spúšťania kampaní sa uložili",
        },
      },
      priority: {
        critical: "Kritické",
        high: "Vysoká",
        medium: "Stredná",
        low: "Nízka",
        background: "Na pozadí",
        filter: {
          all: "Všetky priority",
          highAndAbove: "Vysoké a vyššie",
          mediumAndAbove: "Stredné a vyššie",
        },
      },
      widget: {
        title: "Spúšťanie kampaní",
        titleSaved: "Uložené nastavenie",
        description:
          "Spustite kampane pre nové kontakty pripravené na oslovenie.",
        saving: "Ukladá sa…",
        save: "Uložiť nastavenia",
        addLocale: "+ Pridať jazykové nastavenie",
        guidanceTitle: "Nastaviť spúšťanie kampaní",
        guidanceDescription:
          "Nastavte plán, aktívne dni a hodiny, cieľový počet kontaktov za týždeň a parametre úlohy cron.",
        runButton: "Spustiť kampane",
        running: "Prebieha…",
        done: "Hotovo",
        perRunBudget:
          "Kontakty na jedno spustenie: približne {{perRunBudget}} · Spustenia za týždeň: {{totalRunsPerWeek}}",
        perRunBudgetFractional:
          "Kontakty na jedno spustenie: {{exactBudget}} · Spustenia za týždeň: {{totalRunsPerWeek}} (desatinná časť sa prenáša medzi spusteniami)",
        perRunBudgetZeroHint:
          "Zvýšte počet kontaktov za týždeň alebo znížte frekvenciu spúšťania",
        sections: {
          general: "Všeobecné",
          generalDescription: "Zapnutie spúšťania kampaní a skúšobného režimu.",
          schedule: "Harmonogram",
          scheduleDescription:
            "Určte, kedy sa majú kampane spúšťať. Nastavte plán cron, aktívne dni a hodiny.",
          hoursTimezoneNote:
            "Hodiny v časovom pásme prehliadača ({{offset}}). Server ich ukladá v UTC.",
          quotas: "Kvóty",
          quotasDescription:
            "Počet kontaktov na spracovanie za týždeň podľa jazyka a regiónu.",
          advanced: "Pokročilé",
          advancedDescription:
            "Nastavte prioritu úlohy, časové limity a opakované pokusy.",
        },
        days: {
          mon: "Po",
          tue: "Ut",
          wed: "Str",
          thu: "Št",
          fri: "Pi",
          sat: "So",
          sun: "Ne",
        },
      },
    },
    emailCampaigns: {
      category: "Správa kampaní",
      tag: "E-mailové kampane",
      task: {
        description:
          "Odosielať automatické e-mailové kampane kontaktom podľa fázy a plánu kampane",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
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
          description: "Nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj sa nenašiel",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      post: {
        title: "E-mailové kampane",
        description: "Spracovať e-mailové kampane pre kontakty",
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
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
            description: "Nastala neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
        },
        fields: {
          batchSize: {
            label: "Veľkosť dávky",
            description: "Počet kontaktov na spracovanie v jednej dávke",
          },
          maxEmailsPerRun: {
            label: "Limit e-mailov na spustenie",
            description:
              "Najvyšší počet e-mailov na odoslanie pri jednom spustení",
          },
          dryRun: {
            label: "Skúšobný režim",
            description: "Spustí sa bez odoslania e-mailov",
          },
        },
        response: {
          emailsScheduled: "Naplánované e-maily",
          emailsSent: "Odoslané e-maily",
          emailsFailed: "E-maily, ktoré sa nepodarilo odoslať",
          leadsProcessed: "Spracované kontakty",
        },
        success: {
          title: "Úspech",
          description: "Operácia sa úspešne dokončila",
        },
      },
      get: {
        title: "Získať nastavenia e-mailových kampaní",
        description: "Načíta nastavenia úlohy e-mailových kampaní na pozadí",
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
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
          notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
        },
        response: {
          enabled: "Zapnuté",
          dryRun: "Skúšobný režim",
          batchSize: "Veľkosť dávky",
          maxEmailsPerRun: "Limit e-mailov na spustenie",
          schedule: "Harmonogram",
          priority: "Priorita",
          timeout: "Časový limit",
          retries: "Opakované pokusy",
          retryDelay: "Odstup medzi pokusmi",
        },
        success: {
          title: "Nastavenia načítané",
          description: "Nastavenia e-mailových kampaní sa načítali",
        },
      },
      put: {
        title: "Nastavenia e-mailových kampaní",
        description: "Upraviť nastavenia úlohy e-mailových kampaní na pozadí",
        enabled: {
          label: "Zapnuté",
          description:
            "Zapnúť alebo vypnúť úlohu e-mailových kampaní na pozadí",
        },
        dryRun: {
          label: "Skúšobný režim",
          description: "Spracuje e-maily bez ich odoslania",
        },
        batchSize: {
          label: "Veľkosť dávky",
          description: "Počet kontaktov v jednej dávke (1 až 100)",
        },
        maxEmailsPerRun: {
          label: "Limit e-mailov na spustenie",
          description:
            "Najvyšší počet e-mailov na odoslanie pri jednom spustení na pozadí (1 až 1000)",
        },
        schedule: {
          label: "Harmonogram",
          description: "Výraz cron určujúci spúšťanie e-mailových kampaní",
        },
        priority: {
          label: "Priorita",
          description: "Priorita vykonávania úlohy",
        },
        timeout: {
          label: "Časový limit (ms)",
          description: "Maximálny čas vykonávania v milisekundách",
        },
        retries: {
          label: "Opakované pokusy",
          description: "Počet opakovaných pokusov pri zlyhaní",
        },
        retryDelay: {
          label: "Odstup medzi pokusmi (ms)",
          description: "Čas medzi opakovanými pokusmi v milisekundách",
        },
        success: {
          title: "Nastavenia uložené",
          description: "Nastavenia e-mailových kampaní sa uložili",
        },
      },
      priority: {
        critical: "Kritické",
        high: "Vysoká",
        medium: "Stredná",
        low: "Nízka",
        background: "Na pozadí",
      },
      widget: {
        title: "Nastavenie e-mailových kampaní",
        titleSaved: "Uložené nastavenie",
        saving: "Ukladá sa…",
        save: "Uložiť nastavenia",
        guidanceTitle: "Nastaviť úlohu e-mailových kampaní na pozadí",
        guidanceDescription:
          "Zapnite alebo vypnite úlohu cron pre e-mailové kampane a nastavte jej plán, veľkosť dávky a parametre spúšťania.",
        runButton: "Spustiť teraz",
        running: "Prebieha…",
        done: "Hotovo",
        sections: {
          general: "Všeobecné",
          generalDescription:
            "Zapnutie úlohy e-mailových kampaní a skúšobného režimu.",
          schedule: "Harmonogram",
          scheduleDescription: "Nastavte plán cron na odosielanie e-mailov.",
          processing: "Spracovanie",
          processingDescription:
            "Nastavte počet kontaktov a e-mailov na spracovanie pri jednom spustení.",
          advanced: "Pokročilé",
          advancedDescription:
            "Nastavte prioritu úlohy, časové limity a opakované pokusy.",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "Ďalej",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Vytvárajte lepšie produkty rýchlejšie",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. Všetky práva vyhradené.",
            helpText:
              "Ak máte otázky, napíšte nám na {{config.emails.support}}",
            unsubscribeText: "Nechcete dostávať tieto e-maily?",
            unsubscribeLink: "Odhlásiť sa z odberu",
          },
          socialProof: {
            quotePrefix: "201C",
            quoteSuffix: "201D",
            attribution: "Meno zákazníka, firma",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "Používateľ unbottled.ai",
              previewLeadId: "preview-lead-id",
              previewEmail: "preview@example.com",
              previewBusinessName: "Acme Corp",
              previewContactName: "Ukážkový používateľ",
              previewPhone: "+1234567890",
              previewCampaignId: "preview-campaign-id",
            },
            footer: {
              unsubscribeText:
                "Tento e-mail dostávaš, pretože si sa prihlásil na odber.",
              unsubscribeLink: "Odhlásiť sa z odberu",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Odporúčanie bez cenzúry",
                description: "Nadšenec sa delí o svoj objav unbottled.ai",
                longDescription:
                  "Nadšenec opisuje svoj objav a otvorene hovorí o provízii",
                characteristics: {
                  tone: "Neformálny tón, akoby sa delil o tajomstvo",
                  story: "Osobný príbeh",
                  transparency: "Otvorené priznanie partnerskej provízie",
                  angle: "Dôraz na AI bez cenzúry",
                  energy: "Nadšený tón",
                },
              },
              sideHustle: {
                name: "Vedľajší príjem",
                description: "Partner otvorene opisuje, na čo produkt používa",
                longDescription:
                  "Partner pravidelne opisuje skutočné prípady z praxe a otvorene hovorí o provízii",
                characteristics: {
                  disclosure: "Priznanie provízie hneď na začiatku",
                  updates: "Týždenné príklady z praxe",
                  income: "Príbeh o pasívnom príjme",
                  proof: "Konkrétne výsledky z praxe",
                  energy: "Otvorený, podnikavý tón",
                },
              },
              quietRecommendation: {
                name: "Nenápadné odporúčanie",
                description:
                  "Profesionál bez veľkých slov odporúča vyskúšaný nástroj",
                longDescription:
                  "Vecné odporúčanie nástroja po niekoľkých týždňoch skúšania",
                characteristics: {
                  signal: "Stručné, iba podstatné informácie",
                  specifics: "Konkrétne príklady bez veľkých sľubov",
                  testing: "Skúsenosť z troch týždňov testovania",
                  comparison: "Úprimné porovnanie s ChatGPT",
                  affiliate: "Stručná zmienka o partnerskej provízii",
                },
              },
              signupNurture: {
                name: "Začíname po registrácii",
                description:
                  "Úvodná e-mailová séria pre nových používateľov po registrácii",
                longDescription:
                  "Uvítacie e-maily a praktické tipy pre prvé kroky na platforme",
              },
              retention: {
                name: "Udržanie predplatiteľov",
                description: "Opätovné zapojenie súčasných predplatiteľov",
                longDescription:
                  "Užitočné e-maily, ktoré aktívnym predplatiteľom pomáhajú objavovať ďalšie funkcie",
              },
              winback: {
                name: "Návrat používateľov",
                description:
                  "Získať späť neaktívnych používateľov alebo tých, ktorí prestali službu využívať",
                longDescription:
                  "Kampaň pre používateľov, ktorí prestali službu využívať alebo zrušili predplatné",
              },
              newsletterMay2026: {
                name: "Newsletter máj 2026",
                description:
                  "Jednorazový newsletter o funkciách Cortex, Dreamer a Autopilot a o tvorbe médií",
                longDescription:
                  "Produktový newsletter z mája 2026 pre všetkých registrovaných používateľov. Otvorene o chybách aj nových funkciách.",
              },
              newsletterNov2026: {
                name: "Newsletter november 2026",
                description:
                  "Jednorazový newsletter na obnovenie aktivity. Spoločník, ktorý stojí pri používateľovi, vlastné filtre a lacnejší predvolený model.",
                longDescription:
                  "Konverzný newsletter z novembra 2026 pre odberateľov s potvrdeným súhlasom. Hlavnou témou je AI spoločník a lacnejší predvolený model.",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Systém zrušil operáciu",
        },
        abTesting: {
          invalidWeights: "Súčet váh všetkých variantov musí byť 100 %",
          negativeWeight: "Váha variantu musí byť väčšia ako nula",
        },
        post: {
          title: "Služby",
          description: "Koncový bod pre služby",
          form: {
            title: "Nastavenie služieb",
            description: "Nastaviť parametre služieb",
          },
          response: {
            title: "Odpoveď",
            description: "Údaje v odpovedi služby",
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
              description: "Nastala neznáma chyba",
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
              title: "Konflikt",
              description: "Nastal konflikt údajov",
            },
          },
          success: {
            title: "Úspech",
            description: "Operácia sa úspešne dokončila",
          },
        },
      },
      testMail: {
        category: "Kontakty",
        tags: {
          campaigns: "Kampane",
          leads: "Kontakty",
        },
        post: {
          title: "Testovací e-mail",
          description: "Odoslať testovací e-mail s vlastnými údajmi kontaktu",
          form: {
            title: "Nastavenie testovacieho e-mailu",
            description:
              "Nastavte parametre testovacieho e-mailu a údaje kontaktu",
          },
          campaignType: {
            label: "Typ kampane",
            description: "Typ e-mailovej kampane",
            placeholder: "Zadajte typ kampane",
          },
          emailJourneyVariant: {
            label: "Variant e-mailovej série",
            description: "Variant e-mailovej série pre A/B test",
            placeholder: "Vyberte variant e-mailovej série",
          },
          emailCampaignStage: {
            label: "Fáza e-mailovej kampane",
            description: "Aktuálna fáza e-mailovej kampane",
            placeholder: "Vyberte fázu kampane",
          },
          testEmail: {
            label: "Testovacia e-mailová adresa",
            description: "Adresa, na ktorú sa odošle testovací e-mail",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Údaje kontaktu",
            description: "Údaje kontaktu na vytvorenie správy zo šablóny",
            businessName: {
              label: "Názov firmy",
              description: "Názov firmy",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Meno kontaktu",
              description: "Meno kontaktnej osoby",
              placeholder: "John Doe",
            },
            website: {
              label: "Web",
              description: "Adresa URL webu firmy",
              placeholder: "https://example.com",
            },
            country: {
              label: "Krajina",
              description: "Kód krajiny",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Jazyk",
              description: "Kód preferovaného jazyka",
              placeholder: "en",
            },
            status: {
              label: "Stav",
              description: "Stav kontaktu",
              placeholder: "NEW",
            },
            source: {
              label: "Zdroj",
              description: "Zdroj kontaktu",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Poznámky",
              description: "Ďalšie poznámky o kontakte",
              placeholder: "Zadajte doplňujúce poznámky",
            },
          },
          response: {
            title: "Výsledok odoslania",
            description: "Výsledok odoslania testovacieho e-mailu",
            success: {
              content: "Úspech",
            },
            messageId: {
              content: "ID správy",
            },
            testEmail: {
              content: "Testovací e-mail",
            },
            subject: {
              content: "Predmet e-mailu",
            },
            sentAt: {
              content: "Čas odoslania",
            },
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
              description: "Nastala neznáma chyba",
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
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Máte neuložené zmeny",
            },
            conflict: {
              title: "Konflikt",
              description: "Nastal konflikt údajov",
            },
            templateNotFound: {
              title: "Šablóna sa nenašla",
              description: "Pre zadané parametre sa nenašla e-mailová šablóna",
            },
            sendingFailed: {
              title: "Odoslanie zlyhalo",
              description: "Testovací e-mail sa nepodarilo odoslať",
            },
          },
          success: {
            title: "Úspech",
            description: "Testovací e-mail bol odoslaný",
          },
          selectionCriteria: "Kritériá výberu SMTP",
          widget: {
            title: "Odoslať testovací e-mail",
            send: "Odoslať testovací e-mail",
            sending: "Odosiela sa…",
            successMessage: "Testovací e-mail bol odoslaný",
            sentTo: "Odoslané na: ",
            subject: "Predmet: ",
            sentAt: "Čas odoslania: ",
            campaignConfig: "Nastavenie kampane",
            sendAnother: "Odoslať ďalší",
          },
        },
      },
    },
  },
  create: {
    category: "Kontakty",
    tags: {
      leads: "Kontakty",
      create: "Vytvoriť",
    },

    enums: {
      leadSource: {
        website: "Webová stránka",
        socialMedia: "Sociálne médiá",
        emailCampaign: "E-mailová kampaň",
        referral: "Odporúčanie",
        csvImport: "Import CSV",
      },
    },
    widget: {
      headerLeadCreated: "Kontakt vytvorený",
      headerCreateLead: "Vytvoriť kontakt",
      subheaderFillDetails: "Vyplňte údaje nižšie",
      fallbackLeadName: "Kontakt",
      buttonCopyId: "Kopírovať ID",
      buttonViewLead: "Zobraziť kontakt",
      buttonEditLead: "Upraviť kontakt",
      buttonBackToList: "Späť na zoznam",
    },
    post: {
      title: "Vytvoriť kontakt",
      description: "Vytvoriť nový kontakt v systéme",
      backButton: {
        label: "Späť na kontakty",
      },
      submitButton: {
        label: "Vytvoriť kontakt",
        loadingText: "Vytvára sa kontakt…",
      },
      form: {
        title: "Formulár nového kontaktu",
        description: "Zadajte údaje nového kontaktu",
      },
      contactInfo: {
        title: "Kontaktné údaje",
        description: "Hlavné údaje na spojenie s kontaktom",
      },
      email: {
        label: "E-mailová adresa",
        description: "Hlavná e-mailová adresa na komunikáciu",
        placeholder: "john@example.com",
      },
      businessName: {
        label: "Názov firmy",
        description: "Názov spoločnosti alebo podniku",
        placeholder: "Example Corp",
      },
      phone: {
        label: "Telefónne číslo",
        description: "Kontaktné telefónne číslo s predvoľbou krajiny",
        placeholder: "+1234567890",
      },
      website: {
        label: "Webová stránka",
        description: "Adresa URL webu firmy",
        placeholder: "https://example.com",
      },
      locationPreferences: {
        title: "Poloha a preferencie",
        description: "Geografické a jazykové preferencie",
      },
      country: {
        label: "Krajina",
        description: "Sídlo firmy alebo cieľový trh",
        placeholder: "Vyberte krajinu",
      },
      language: {
        label: "Jazyk",
        description: "Preferovaný jazyk komunikácie",
        placeholder: "Vyberte jazyk",
      },
      leadDetails: {
        title: "Podrobnosti kontaktu",
        description: "Ďalšie informácie o kontakte",
      },
      source: {
        label: "Zdroj kontaktu",
        description: "Ako sme kontakt získali",
        placeholder: "Vyberte zdroj",
      },
      notes: {
        label: "Poznámky",
        description: "Ďalšie poznámky alebo komentáre",
        placeholder: "Zadajte doplňujúce informácie…",
      },
      response: {
        title: "Vytvorený kontakt",
        description: "Podrobnosti nového kontaktu",
        summary: {
          title: "Súhrn kontaktu",
          id: "ID kontaktu",
          businessName: "Názov firmy",
          email: "E-mailová adresa",
          status: "Stav kontaktu",
        },
        contactDetails: {
          title: "Kontaktné údaje",
          phone: "Telefónne číslo",
          website: "Adresa URL webu",
          country: "Krajina",
          language: "Jazyk",
        },
        trackingInfo: {
          title: "Údaje o sledovaní",
          source: "Zdroj kontaktu",
          emailsSent: "Počet e-mailov",
          currentCampaignStage: "Fáza kampane",
        },
        metadata: {
          title: "Metadáta",
          notes: "Poznámky",
          createdAt: "Dátum vytvorenia",
          updatedAt: "Posledná aktualizácia",
        },
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vytvorenie kontaktu sa prihláste",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Zadané údaje kontaktu sú neplatné",
        },
        server: {
          title: "Chyba servera",
          description: "Pri vytváraní kontaktu nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri vytváraní kontaktu nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Pri vytváraní kontaktu nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie vytvárať kontakty",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj potrebný na vytvorenie kontaktu sa nenašiel",
        },
        conflict: {
          title: "Konflikt",
          description: "Kontakt už existuje alebo nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Vo formulári kontaktu sú neuložené zmeny",
        },
      },
      success: {
        title: "Kontakt vytvorený",
        description: "Kontakt sa úspešne vytvoril",
      },
    },
    email: {
      welcome: {
        subject: "Vitaj na {{companyName}}",
        title: "Vitaj na {{companyName}}, {{businessName}}!",
        preview: "Vitaj. Takto môžeš začať.",
        greeting:
          "Vitaj na {{companyName}}, {{businessName}}! Teší nás, že si tu.",
        defaultName: "návštevník",
        introduction:
          "Ďakujeme za záujem. Tvoje údaje sme dostali a prečíta si ich človek z nášho tímu.",
        nextSteps: {
          title: "Čo bude nasledovať?",
          step1Number: "1.",
          step1: "Začni chatovať hneď. Bez nastavovania a bez platobnej karty.",
          step2Number: "2.",
          step2:
            "Máš otázku? Odpíš na tento e-mail. Prečíta si ho človek z tímu.",
          step3Number: "3.",
          step3: "Odpovieme hneď, ako budeme môcť.",
        },
        cta: {
          getStarted: "Začať chat",
        },
        support:
          "Máš otázku? Odpíš na tento e-mail alebo sa ozvi na {{supportEmail}}",
        error: {
          noEmail: "Uvítací e-mail sa nedá odoslať. Chýba e-mailová adresa.",
        },
      },
      admin: {
        newLead: {
          subject: "Nový kontakt: {{businessName}}",
          title: "Nový kontakt vytvorený",
          preview: "Nový kontakt {{businessName}} treba osloviť",
          message:
            "V systéme pribudol nový kontakt {{businessName}}, ktorému sa treba venovať.",
          leadDetails: "Podrobnosti kontaktu",
          businessName: "Názov firmy",
          email: "E-mail",
          phone: "Telefón",
          website: "Web",
          source: "Zdroj",
          status: "Stav",
          notes: "Poznámky",
          notProvided: "Neuvedené",
          viewLead: "Zobraziť podrobnosti kontaktu",
          viewAllLeads: "Zobraziť všetky kontakty",
          error: {
            noData:
              "Oznámenie správcovi sa nedá odoslať. Chýbajú údaje kontaktu.",
          },
          defaultName: "Nový kontakt",
        },
      },
      error: {
        general: {
          internal_server_error: "Vyskytla sa interná chyba servera",
        },
      },
    },
  },
  export: {
    category: "Kontakty",
    tags: {
      leads: "Kontakty",
      export: "Export",
    },

    get: {
      title: "Exportovať kontakty",
      description: "Exportovať údaje o kontaktoch do súboru",
      form: {
        title: "Nastavenie exportu",
        description: "Nastaviť parametre a filtre exportu kontaktov",
      },
      format: {
        label: "Formát exportu",
        description: "Formát výstupného súboru",
      },
      status: {
        label: "Stav kontaktu",
        description: "Filtrovať podľa stavu kontaktu",
      },
      country: {
        label: "Krajina",
        description: "Filtrovať podľa krajiny",
        placeholder: "Vyberte krajinu",
      },
      language: {
        label: "Jazyk",
        description: "Filtrovať podľa jazyka",
        placeholder: "Vybrať jazyk",
      },
      source: {
        label: "Zdroj kontaktu",
        description: "Filtrovať podľa zdroja kontaktu",
        placeholder: "Vyberte zdroj",
      },
      search: {
        label: "Hľadať",
        description: "Vyhľadať kontakty podľa textu",
        placeholder: "Vyhľadať kontakty…",
      },
      dateFrom: {
        label: "Dátum začiatku",
        description: "Exportovať kontakty vytvorené od tohto dátumu",
      },
      dateTo: {
        label: "Dátum ukončenia",
        description: "Exportovať kontakty vytvorené do tohto dátumu",
      },
      includeMetadata: {
        label: "Zahrnúť metadáta",
        description: "Zahrnúť dátumy a časy vytvorenia a aktualizácie",
      },
      includeEngagementData: {
        label: "Zahrnúť údaje o interakciách",
        description: "Zahrnúť údaje o sledovaní e-mailov a kampaniach",
      },
      response: {
        title: "Súbor exportu",
        description: "Vygenerovaný súbor s údajmi o kontaktoch",
        fileName: "Názov súboru",
        fileContent: "Obsah súboru (Base64)",
        mimeType: "Typ MIME",
        totalRecords: "Celkový počet záznamov",
        exportedAt: "Dátum a čas exportu",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na export kontaktov sa prihláste",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné exportné parametre alebo filtre",
        },
        server: {
          title: "Chyba servera",
          description: "Pri exporte nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri exporte nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Pri exporte nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie exportovať kontakty",
        },
        notFound: {
          title: "Žiadne údaje",
          description: "Žiadne kontakty nezodpovedajú kritériám exportu",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri exporte nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Vo formulári exportu sú neuložené zmeny",
        },
      },
      success: {
        title: "Export dokončený",
        description: "Export kontaktov sa dokončil",
      },
    },
    widget: {
      exportLeads: "Exportovať kontakty",
      import: "Import",
      viewList: "Zobraziť zoznam",
      importLeadsTitle: "Importovať kontakty",
      viewLeadsListTitle: "Zoznam kontaktov",
      copyCsvTitle: "Kopírovať obsah CSV do schránky",
      generatingExport: "Pripravuje sa export…",
      generatingExportHint:
        "Spracovanie väčšieho množstva údajov môže chvíľu trvať",
      exportReady: "Export pripravený",
      fileReadyToDownload: "Váš súbor je pripravený na stiahnutie",
      records: "Záznamy",
      format: "Formát",
      fileSize: "Veľkosť súboru",
      copied: "Kopírované!",
      copy: "Kopírovať",
      download: "Stiahnuť",
      exportedAt: "Dátum a čas exportu:",
      nextSteps: "Ďalšie kroky:",
      viewLeads: "Zobraziť kontakty",
      importLeads: "Importovať kontakty",
      configureExport: "Nastaviť export",
      configureExportHint:
        "Vyberte formát a filtre. Súbor vytvoríte kliknutím na Export.",
      formatLabel: "Formát",
      formatHint: "Vyberte CSV alebo Excel (XLSX)",
      statusFilter: "Filter stavu",
      statusFilterHint: "Exportovať iba kontakty s vybraným stavom",
      dateRange: "Rozsah dátumov",
      dateRangeHint: "Obmedziť export na zvolené obdobie",
      metadataEngagement: "Metadáta a interakcie",
      metadataEngagementHint:
        "Môžete zahrnúť ďalšie stĺpce na podrobnú analýzu",
      viewLeadsList: "Zoznam kontaktov",
      excelSpreadsheet: "Tabuľka Excel",
      csvFile: "Súbor CSV",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
      },
      leadStatus: {
        new: "Nový",
        pending: "Čaká",
        campaignRunning: "Kampaň prebieha",
        websiteUser: "Používateľ webu",
        newsletterSubscriber: "Odberateľ newslettera",
        inContact: "Oslovený",
        signedUp: "Zaregistrovaný",
        subscriptionConfirmed: "Predplatné potvrdené",
        unsubscribed: "Odhlásený z odberu",
        bounced: "Vrátené",
        invalid: "Neplatný",
      },
      leadSource: {
        website: "Webová stránka",
        socialMedia: "Sociálne médiá",
        emailCampaign: "E-mailová kampaň",
        referral: "Odporúčanie",
        csvImport: "Import CSV",
      },
    },
    headers: {
      email: "E-mail",
      businessName: "Názov firmy",
      contactName: "Meno kontaktu",
      phone: "Telefón",
      country: "Krajina",
      language: "Jazyk",
      status: "Stav",
      source: "Zdroj",
      website: "Webová stránka",
      notes: "Poznámky",
      campaignStage: "Fáza kampane",
      emailsSent: "Odoslané e-maily",
      emailsOpened: "Otvorené e-maily",
      emailsClicked: "E-maily s kliknutím na odkaz",
      lastEmailSent: "Posledný odoslaný e-mail",
      lastEngagement: "Posledná interakcia",
      unsubscribedAt: "Čas zrušenia odberu",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
      lastEngagementAt: "Posledná interakcia",
      metadata: "Metadáta",
      ipAddress: "IP adresa",
      userAgent: "Identifikátor klienta",
      deviceType: "Typ zariadenia",
      browser: "Prehliadač",
      os: "OS",
      referralCode: "Kód odporúčania",
    },
  },
  import: {
    tags: {
      import: "Import",
      leads: "Kontakty",
      csv: "CSV",
    },

    category: "Import údajov",
    post: {
      title: "Importovať kontakty",
      description: "Importovať kontakty zo súboru CSV",
      form: {
        title: "Nastavenie importu",
        description: "Nastaviť parametre importu kontaktov",
      },
      file: {
        label: "Súbor CSV",
        description: "Obsah súboru CSV kódovaný vo formáte Base64",
        placeholder: "Vložte obsah súboru CSV kódovaný vo formáte Base64",
        helpText: "Nahrajte súbor CSV s údajmi o kontaktoch",
      },
      fileName: {
        label: "Názov súboru",
        description: "Názov súboru CSV",
        placeholder: "leads.csv",
        helpText: "Zadajte zrozumiteľný názov súboru",
      },
      skipDuplicates: {
        label: "Preskočiť duplikáty",
        description: "Preskočiť kontakty s duplicitnými e-mailovými adresami",
        helpText:
          "Po zapnutí sa existujúce e-mailové adresy automaticky preskočia",
      },
      updateExisting: {
        label: "Aktualizovať existujúce kontakty",
        description: "Aktualizovať existujúce kontakty novými údajmi",
        helpText:
          "Po zapnutí sa existujúce kontakty aktualizujú. Inak sa preskočia.",
      },
      defaultCountry: {
        label: "Predvolená krajina",
        description: "Predvolená krajina pre kontakty bez uvedenej krajiny",
        helpText: "Vyberte predvolený kód krajiny",
      },
      defaultLanguage: {
        label: "Predvolený jazyk",
        description: "Predvolený jazyk pre kontakty bez uvedeného jazyka",
        helpText: "Vyberte predvolený kód jazyka",
      },
      defaultStatus: {
        label: "Predvolený stav",
        description: "Predvolený stav importovaných kontaktov",
        helpText: "Vyberte počiatočný stav nových kontaktov",
      },
      defaultCampaignStage: {
        label: "Predvolená fáza kampane",
        description:
          "Predvolená fáza e-mailovej kampane pre importované kontakty",
        helpText: "Vyberte úvodnú fázu kampane",
      },
      defaultSource: {
        label: "Predvolený zdroj",
        description: "Predvolený zdroj priradený importovaným kontaktom",
        helpText: "Vyberte zdroj na sledovanie kontaktov",
      },
      useChunkedProcessing: {
        label: "Spracovať po dávkach",
        description: "Spracovať veľké importy v dávkach na pozadí",
        helpText: "Zapnite pri súboroch s viac ako 1 000 riadkami",
      },
      batchSize: {
        label: "Veľkosť dávky",
        description: "Počet riadkov na každú dávku",
        helpText: "Odporúčaná veľkosť dávky: 2 000 riadkov",
      },
      response: {
        batchId: "ID dávky",
        totalRows: "Celkový počet riadkov",
        successfulImports: "Úspešne importované",
        failedImports: "Neúspešné importy",
        duplicateEmails: "Duplicitné e-mailové adresy",
        errors: "Chyby importu",
        summary: "Súhrn importu",
        isChunkedProcessing: "Spracovanie po dávkach",
        jobId: "ID úlohy na pozadí",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre importu alebo formát CSV",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na import kontaktov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie importovať kontakty",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Súbor CSV sa nenašiel alebo je neplatný",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri importe nastal konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Pri importe nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri importe nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Pri importe nastala chyba siete",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Vo formulári importu sú neuložené zmeny",
        },
      },
      success: {
        title: "Import spustený",
        description: "Import kontaktov sa spustil",
      },
      widget: {
        headerTitle: "Importovať kontakty z CSV",
        exportTemplateButton: "Exportovať šablónu",
        importGuideTitle: "Návod na import",
        importGuideSubtitle: "Nahrajte súbor CSV s týmito stĺpcami:",
        importGuideNote:
          "Povinný je iba stĺpec {{email}}. Ostatné stĺpce sú voliteľné. Ak ich vynecháte, použijú sa predvolené hodnoty uvedené nižšie.",
        fileRequirementsTitle: "Požiadavky na súbor",
        fileRequirementFormat:
          "Formát CSV: hodnoty oddelené čiarkami, kódovanie UTF-8",
        fileRequirementHeader: "Prvý riadok musí obsahovať názvy stĺpcov",
        fileRequirementSize:
          "Odporúčaná maximálna veľkosť jedného súboru: 50 MB",
        fileRequirementChunked:
          "Pri súboroch s viac než približne 5 000 riadkami zapnite {{chunkedProcessing}}, aby spracovanie neprekročilo časový limit.",
        chunkedProcessingLabel: "Spracovanie po dávkach",
        downloadTemplateLink: "Stiahnuť šablónu CSV",
        loadingText: "Importujú sa kontakty…",
        backgroundProcessingTitle: "Spracovanie na pozadí",
        backgroundProcessingNote:
          "Veľký import čaká vo fronte ako úloha {{jobId}}. Počet riadkov na spracovanie na pozadí: {{totalRows}}.",
        checkJobStatusButton: "Skontrolovať stav úlohy",
        stopJobButton: "Zastaviť úlohu",
        retryFailedButton: "Zopakovať neúspešné",
        statTotalRows: "Celkový počet riadkov",
        statImported: "Importované",
        statDuplicates: "Duplikáty",
        statFailed: "Zlyhalo",
        viewImportedLeadsButton: "Zobraziť importované kontakty",
        retryFailedWithCountButton: "Zopakovať neúspešné ({{count}})",
        summaryTitle: "Zhrnutie",
        summaryNewLeads: "Nové kontakty",
        summaryUpdated: "Aktualizované",
        summarySkipped: "Preskočené",
        successRateLabel: "Miera úspešnosti",
        importErrorsTitle: "Počet chýb importu: {{count}}",
        errorRowLabel: "Riadok {{row}}",
        findLeadButton: "Nájsť kontakt",
      },
    },
    process: {
      tag: "Spracovanie importu",
      post: {
        title: "Spracovať úlohy importu",
        titleShort: "Spracovať import",
        description: "Spracovať čakajúce úlohy importu CSV",
        container: {
          title: "Nastavenie spracovania importu",
          description: "Nastaviť parametre spracovania importu",
        },
        fields: {
          maxJobsPerRun: {
            label: "Najvyšší počet úloh na jedno spustenie",
            description: "Najvyšší počet úloh spracovaných pri jednom spustení",
          },
          maxRetriesPerJob: {
            label: "Najvyšší počet opakovaných pokusov na úlohu",
            description: "Najvyšší počet opakovaných pokusov na jednu úlohu",
          },
          dryRun: {
            label: "Skúšobný režim",
            description: "Spustiť bez vykonania zmien",
          },
          selfTaskId: {
            label: "ID vlastnej úlohy",
            description:
              "Interné ID úlohy na automatické vyčistenie po spracovaní",
          },
        },
        response: {
          jobsProcessed: "Spracované úlohy",
          totalRowsProcessed: "Spracované riadky spolu",
          successfulImports: "Úspešne importované",
          failedImports: "Neúspešné importy",
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Pri spracovaní importov nastala chyba",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre požiadavky",
          },
        },
        success: {
          title: "Spracovanie importu dokončené",
          description: "Úlohy importu sa spracovali",
        },
      },
    },
    widget: {
      header: {
        title: "Úlohy importu",
        newImport: "Nový import",
      },
      filter: {
        all: "Všetky",
        completed: "Dokončené",
        failed: "Zlyhalo",
        pending: "Čaká",
        running: "Prebieha",
      },
      loading: "Načítavajú sa úlohy importu…",
      empty: {
        title: "Nenašli sa žiadne importné úlohy",
        withFilter: "Skúste iný filter alebo spustite nový import.",
        withoutFilter: "Spustite prvý import a zobrazí sa tu.",
        newImport: "Nový import",
      },
    },
    jobs: {
      jobId: {
        category: "Import údajov",
        tags: {
          leads: "Kontakty",
          management: "Správa",
        },

        get: {
          title: "Načítať úlohu importu",
          description: "Načítať podrobnosti konkrétnej úlohy importu",
          actions: {
            retry: "Skúsiť znova",
            stop: "Zastaviť",
            viewLeads: "Zobraziť kontakty",
          },
          jobId: {
            label: "ID úlohy",
            description: "Jedinečné ID úlohy importu",
          },
          form: {
            title: "Stav úlohy importu",
            description: "Aktuálny stav a priebeh úlohy importu",
          },
          response: {
            title: "Informácie o úlohe",
            description: "Aktuálne podrobnosti úlohy importu",
            info: {
              title: "Informácie o úlohe",
              description: "Základné údaje o úlohe",
            },
            id: {
              content: "ID úlohy",
            },
            fileName: {
              content: "Názov súboru",
            },
            status: {
              content: "Stav úlohy",
            },
            progress: {
              title: "Priebeh importu",
              description: "Aktuálny priebeh a štatistiky importu",
            },
            totalRows: {
              content: "Celkový počet riadkov",
            },
            processedRows: {
              content: "Spracované riadky",
            },
            successfulImports: {
              content: "Úspešne importované",
            },
            failedImports: {
              content: "Neúspešné importy",
            },
            duplicateEmails: {
              content: "Duplicitné e-mailové adresy",
            },
            configuration: {
              title: "Nastavenie úlohy",
              description: "Aktuálne nastavenia úlohy",
            },
            currentBatchStart: {
              content: "Začiatočný riadok aktuálnej dávky",
            },
            batchSize: {
              content: "Veľkosť dávky",
            },
            retryCount: {
              content: "Počet opakovaných pokusov",
            },
            maxRetries: {
              content: "Najvyšší počet opakovaných pokusov",
            },
            error: {
              content: "Chybové hlásenie",
            },
            timestamps: {
              title: "Dátumy a časy úlohy",
              description: "Dátumy a časy jednotlivých fáz úlohy",
            },
            createdAt: {
              content: "Vytvorené",
            },
            updatedAt: {
              content: "Aktualizované",
            },
            startedAt: {
              content: "Čas začiatku",
            },
            completedAt: {
              content: "Čas dokončenia",
            },
          },
          errors: {
            validation: {
              title: "Neplatné údaje",
              description: "Zadané ID úlohy je neplatné",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Na zobrazenie úloh sa prihláste",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie zobraziť túto úlohu",
            },
            notFound: {
              title: "Úloha sa nenašla",
              description: "Úloha importu so zadaným ID sa nenašla",
            },
            server: {
              title: "Chyba servera",
              description: "Pri načítavaní úlohy nastala chyba",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neočakávaná chyba",
            },
            network: {
              title: "Chyba siete",
              description: "Nedá sa pripojiť k serveru",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Máte neuložené zmeny",
            },
            conflict: {
              title: "Konflikt údajov",
              description: "Pri načítavaní úlohy nastal konflikt",
            },
          },
          success: {
            title: "Úspech",
            description: "Úloha importu sa načítala",
          },
        },
        patch: {
          title: "Aktualizovať úlohu importu",
          description: "Zmeniť nastavenia úlohy importu",
          jobId: {
            label: "ID úlohy",
            description: "Jedinečné ID úlohy importu",
          },
          form: {
            title: "Upraviť nastavenia úlohy",
            description: "Zmeniť nastavenie úlohy importu",
          },
          settings: {
            title: "Nastavenia úlohy",
            description: "Nastavenia úlohy importu",
          },
          batchSize: {
            label: "Veľkosť dávky",
            description: "Počet riadkov na spracovanie v každej dávke",
            placeholder: "100",
          },
          maxRetries: {
            label: "Najvyšší počet opakovaných pokusov",
            description:
              "Najvyšší počet opakovaných pokusov pri neúspešných riadkoch",
            placeholder: "3",
          },
          response: {
            title: "Aktualizované údaje o úlohe",
            description: "Podrobnosti upravenej úlohy importu",
            info: {
              title: "Informácie o úlohe",
              description: "Základné údaje o úlohe",
            },
            id: {
              content: "ID úlohy",
            },
            fileName: {
              content: "Názov súboru",
            },
            status: {
              content: "Stav úlohy",
            },
            progress: {
              title: "Priebeh importu",
              description: "Aktuálny priebeh a štatistiky importu",
            },
            totalRows: {
              content: "Celkový počet riadkov",
            },
            processedRows: {
              content: "Spracované riadky",
            },
            successfulImports: {
              content: "Úspešne importované",
            },
            failedImports: {
              content: "Neúspešné importy",
            },
            duplicateEmails: {
              content: "Duplicitné e-mailové adresy",
            },
            configuration: {
              title: "Nastavenie úlohy",
              description: "Aktuálne nastavenia úlohy",
            },
            currentBatchStart: {
              content: "Začiatočný riadok aktuálnej dávky",
            },
            batchSize: {
              content: "Veľkosť dávky",
            },
            retryCount: {
              content: "Počet opakovaných pokusov",
            },
            maxRetries: {
              content: "Najvyšší počet opakovaných pokusov",
            },
            error: {
              content: "Chybové hlásenie",
            },
            timestamps: {
              title: "Dátumy a časy úlohy",
              description: "Dátumy a časy jednotlivých fáz úlohy",
            },
            createdAt: {
              content: "Vytvorené",
            },
            updatedAt: {
              content: "Aktualizované",
            },
            startedAt: {
              content: "Čas začiatku",
            },
            completedAt: {
              content: "Čas dokončenia",
            },
          },
          errors: {
            validation: {
              title: "Neplatné údaje",
              description: "Poskytnuté údaje sú neplatné",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Na úpravu úloh sa prihláste",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie upraviť túto úlohu",
            },
            notFound: {
              title: "Úloha sa nenašla",
              description: "Úloha importu so zadaným ID sa nenašla",
            },
            server: {
              title: "Chyba servera",
              description: "Nastala chyba pri aktualizácii úlohy",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neočakávaná chyba",
            },
            network: {
              title: "Chyba siete",
              description: "Nedá sa pripojiť k serveru",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Máte neuložené zmeny",
            },
            conflict: {
              title: "Konflikt pri úprave",
              description: "Úlohu medzičasom upravil iný používateľ",
            },
          },
          success: {
            title: "Úspech",
            description: "Úloha importu sa aktualizovala",
          },
        },
        delete: {
          title: "Odstrániť úlohu importu",
          description: "Odstrániť konkrétnu úlohu importu",
          jobId: {
            label: "ID úlohy",
            description: "Jedinečné ID úlohy importu, ktorú chcete odstrániť",
          },
          form: {
            title: "Odstrániť úlohu importu",
            description: "Potvrďte odstránenie úlohy importu",
          },
          response: {
            title: "Výsledok odstránenia",
            description: "Výsledok odstránenia",
            success: {
              content: "Úspešnosť operácie",
            },
            message: {
              content: "Hlásenie o odstránení",
            },
          },
          errors: {
            validation: {
              title: "Neplatné údaje",
              description: "Zadané ID úlohy je neplatné",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Na odstránenie úloh sa prihláste",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie odstrániť túto úlohu",
            },
            notFound: {
              title: "Úloha sa nenašla",
              description: "Úloha importu so zadaným ID sa nenašla",
            },
            server: {
              title: "Chyba servera",
              description: "Pri odstraňovaní úlohy nastala chyba",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neočakávaná chyba",
            },
            network: {
              title: "Chyba siete",
              description: "Nedá sa pripojiť k serveru",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Máte neuložené zmeny",
            },
            conflict: {
              title: "Konflikt pri odstraňovaní",
              description: "Prebiehajúcu úlohu nemožno odstrániť",
            },
          },
          success: {
            title: "Úspech",
            description: "Úloha importu sa odstránila",
          },
        },
        retry: {
          category: "Import údajov",
          tags: {
            leads: "Kontakty",
            management: "Správa",
          },

          post: {
            title: "Zopakovať úlohu importu",
            description: "Zopakovať neúspešnú úlohu importu",
            jobId: {
              label: "ID úlohy",
              description: "Jedinečné ID úlohy importu, ktorú chcete zopakovať",
            },
            form: {
              title: "Zopakovať úlohu importu",
              description: "Zopakovať neúspešnú úlohu importu",
            },
            response: {
              title: "Výsledok opakovaného pokusu",
              description: "Výsledok opakovaného spustenia",
              success: {
                content: "Úspešnosť operácie",
              },
              message: {
                content: "Hlásenie o opakovanom pokuse",
              },
            },
            errors: {
              validation: {
                title: "Neplatné údaje",
                description: "Zadané ID úlohy je neplatné",
              },
              unauthorized: {
                title: "Vyžaduje sa prihlásenie",
                description: "Ak chcete úlohu zopakovať, prihláste sa",
              },
              forbidden: {
                title: "Prístup zamietnutý",
                description: "Nemáte oprávnenie zopakovať túto úlohu",
              },
              notFound: {
                title: "Úloha sa nenašla",
                description: "Úloha importu so zadaným ID sa nenašla",
              },
              server: {
                title: "Chyba servera",
                description: "Pri opätovnom spustení úlohy nastala chyba",
              },
              unknown: {
                title: "Neznáma chyba",
                description: "Vyskytla sa neočakávaná chyba",
              },
              network: {
                title: "Chyba siete",
                description: "Nedá sa pripojiť k serveru",
              },
              unsavedChanges: {
                title: "Neuložené zmeny",
                description: "Máte neuložené zmeny",
              },
              conflict: {
                title: "Konflikt pri opakovanom spustení",
                description: "Prebiehajúcu úlohu nemožno spustiť znova",
              },
            },
            success: {
              title: "Úspech",
              description: "Úloha importu sa spustila znova",
            },
          },
          widget: {
            title: "Zopakovať úlohu importu",
            successMessage: "Opakované spustenie úlohy sa začalo",
          },
        },
        stop: {
          category: "Import údajov",
          tags: {
            leads: "Kontakty",
            management: "Správa",
          },

          post: {
            title: "Zastaviť úlohu importu",
            description: "Zastaviť prebiehajúcu úlohu importu",
            jobId: {
              label: "ID úlohy",
              description: "Jedinečné ID úlohy importu, ktorú chcete zastaviť",
            },
            form: {
              title: "Zastaviť úlohu importu",
              description: "Zastaviť prebiehajúci import",
            },
            response: {
              title: "Výsledok zastavenia",
              description: "Výsledok zastavenia úlohy",
              success: {
                content: "Úspešnosť operácie",
              },
              message: {
                content: "Hlásenie o zastavení",
              },
            },
            errors: {
              validation: {
                title: "Neplatné údaje",
                description: "Zadané ID úlohy je neplatné",
              },
              unauthorized: {
                title: "Vyžaduje sa prihlásenie",
                description: "Ak chcete zastaviť úlohu, prihláste sa",
              },
              forbidden: {
                title: "Prístup zamietnutý",
                description: "Nemáte oprávnenie zastaviť túto úlohu",
              },
              notFound: {
                title: "Úloha sa nenašla",
                description: "Úloha importu so zadaným ID sa nenašla",
              },
              server: {
                title: "Chyba servera",
                description: "Pri zastavovaní úlohy nastala chyba",
              },
              unknown: {
                title: "Neznáma chyba",
                description: "Vyskytla sa neočakávaná chyba",
              },
              network: {
                title: "Chyba siete",
                description: "Nedá sa pripojiť k serveru",
              },
              unsavedChanges: {
                title: "Neuložené zmeny",
                description: "Máte neuložené zmeny",
              },
              conflict: {
                title: "Konflikt pri zastavovaní",
                description: "Zastaviť možno iba prebiehajúcu úlohu",
              },
            },
            success: {
              title: "Úspech",
              description: "Úloha importu sa zastavila",
            },
          },
          widget: {
            title: "Zastaviť úlohu importu",
            successMessage: "Úloha sa zastavila",
          },
        },
        widget: {
          status: {
            title: "Stav úlohy importu",
            loadingJobStatus: "Načítava sa stav úlohy…",
            totalRows: "Celkový počet riadkov",
            processed: "Spracované",
            imported: "Importované",
            failed: "Zlyhalo",
            duplicates: "Duplikáty",
            progress: "Priebeh",
            configurationTitle: "Nastavenie",
            batchSize: "Veľkosť dávky",
            batchStart: "Začiatok dávky",
            retries: "Opakované pokusy",
            timestampsTitle: "Časové pečiatky",
            created: "Vytvorené",
            started: "Začiatok",
            completed: "Dokončené",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "Čaká",
                  processing: "Spracovanie",
                  completed: "Dokončené",
                  failed: "Zlyhalo",
                },
              },
            },
          },
          retry: {
            title: "Zopakovať úlohu importu",
            loadingRetrying: "Úloha sa spúšťa znova…",
            successMessage: "Úloha sa spustila znova",
            failureMessage: "Zopakovať neúspešné",
            viewJobStatus: "Zobraziť stav úlohy",
            viewLeads: "Zobraziť kontakty",
          },
          stop: {
            title: "Zastaviť úlohu importu",
            loadingStopping: "Úloha sa zastavuje…",
            successMessage: "Úloha sa zastavila",
            failureMessage: "Úlohu sa nepodarilo zastaviť",
            viewLeads: "Zobraziť kontakty",
            startNewImport: "Spustiť nový import",
          },
        },
      },
    },
    status: {
      category: "Import údajov",
      tags: {
        import: "Import",
        jobs: "Úlohy",
        list: "Zoznam",
      },

      get: {
        title: "Stav úloh importu",
        description: "Zobraziť a sledovať úlohy importu CSV",
        form: {
          title: "Filtre úloh",
          description:
            "Filtrovať úlohy importu podľa stavu a nastaviť stránkovanie",
        },
        filters: {
          title: "Filtre",
          description: "Možnosti filtrovania úloh importu",
        },
        status: {
          label: "Stav úlohy",
          description: "Filtrovať podľa stavu úlohy",
          placeholder: "Vybrať stav",
        },
        limit: {
          label: "Výsledky na stránku",
          description: "Počet úloh na načítanie",
          placeholder: "50",
        },
        offset: {
          label: "Posun výsledkov",
          description: "Počet úloh, ktoré sa preskočia",
          placeholder: "0",
        },
        response: {
          title: "Úlohy importu",
          description: "Zoznam úloh importu a ich aktuálny stav",
          items: {
            title: "Zoznam úloh",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre filtra",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na zobrazenie úloh importu sa prihláste",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte prístup k úlohám importu",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Nenašli sa žiadne importné úlohy",
          },
          server: {
            title: "Chyba servera",
            description: "Pri načítavaní úloh nastala interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Pri načítavaní úloh nastala chyba siete",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt údajov",
          },
        },
        success: {
          title: "Úlohy načítané",
          description: "Zoznam úloh importu sa načítal",
        },
      },
      widget: {
        status: {
          pending: "Čaká",
          running: "Prebieha",
          completed: "Dokončené",
          failed: "Zlyhalo",
          stopped: "Zastavené",
        },
        filter: {
          all: "Všetky",
          pending: "Čaká",
          running: "Prebieha",
          completed: "Dokončené",
          failed: "Zlyhalo",
        },
        progress: {
          rows: "riadky",
        },
        job: {
          total: "Spolu:",
          processed: "Spracované:",
          ok: "OK:",
          fail: "Zlyhanie:",
          created: "Vytvorené:",
          done: "Dokončené:",
        },
        header: {
          title: "Úlohy importu",
          newImport: "Nový import",
        },
        loading: "Načítavajú sa úlohy importu…",
        empty: {
          title: "Nenašli sa žiadne importné úlohy",
          withFilter: "Skúste iný filter alebo spustite nový import.",
          withoutFilter: "Spustite prvý import a zobrazí sa tu.",
          newImport: "Nový import",
        },
      },
    },
    csv: {
      post: {
        title: "Importovať údaje z CSV",
        description: "Importovať a overiť údaje zo súborov CSV",
        form: {
          title: "Nastavenie importu CSV",
          description: "Nastavenie importu CSV pre optimálne výsledky",
        },
        fileSection: {
          title: "Nahratie súboru",
          description: "Vyberte súbor CSV a určte typ údajov",
        },
        file: {
          label: "Súbor CSV",
          description: "Vyberte súbor CSV na nahratie (najviac 10 MB)",
          placeholder: "Vyberte súbor CSV…",
          helpText:
            "Podporovaný formát: CSV s hodnotami oddelenými čiarkou. Do prvého riadka uveďte názvy stĺpcov.",
        },
        fileName: {
          label: "Názov súboru",
          description: "Názov na identifikáciu tohto importu",
          placeholder: "napr. Import kontaktov za január 2024",
        },
        domain: {
          label: "Typ importovaných údajov",
          description: "Aký typ údajov importujete?",
          placeholder: "Vyberte typ údajov…",
        },
        processingSection: {
          title: "Možnosti spracovania",
          description: "Nastavte spôsob spracovania údajov",
        },
        skipDuplicates: {
          label: "Preskočiť duplikáty",
          description: "Preskočiť záznamy s duplikátmi e-mailových adries",
          helpText:
            "Odporúčané. Zabráni opakovanému importu rovnakého kontaktu.",
        },
        updateExisting: {
          label: "Aktualizovať existujúce kontakty",
          description: "Aktualizovať existujúce záznamy s novými údajmi z CSV",
          helpText: "Ak možnosť nezačiarknete, existujúce záznamy sa nezmenia",
        },
        useChunkedProcessing: {
          label: "Spracovanie na pozadí",
          description: "Spracovať veľké súbory v pozadí",
          helpText: "Odporúčané pre súbory s viac ako 500 záznamami",
        },
        batchSize: {
          label: "Veľkosť dávky",
          description: "Počet záznamov, ktoré sa majú spracovať naraz",
          placeholder: "100",
          helpText:
            "Menšie dávky sú spoľahlivejšie. Väčšie dávky sa spracujú rýchlejšie.",
        },
        defaultsSection: {
          title: "Predvolené hodnoty (nepovinné)",
          description:
            "Nastavte predvolené hodnoty pre záznamy, v ktorých tieto údaje chýbajú",
        },
        defaultCountry: {
          label: "Predvolená krajina",
          description: "Krajina pre záznamy bez údaja o polohe",
          placeholder: "Vyberte krajinu…",
        },
        defaultLanguage: {
          label: "Predvolený jazyk",
          description: "Jazyk pre záznamy bez uprednostňovaného jazyka",
          placeholder: "Vyberte jazyk…",
        },
        response: {
          title: "Výsledky importu",
          description: "Zhrnutie importu CSV",
          basicResults: {
            title: "Základné výsledky",
            description: "Základné štatistiky importu",
          },
          batchId: {
            label: "ID dávky",
          },
          totalRows: {
            label: "Celkový počet riadkov",
          },
          isChunkedProcessing: {
            label: "Spracovanie na pozadí",
          },
          jobId: {
            label: "ID úlohy",
          },
          statistics: {
            title: "Štatistiky importu",
            description: "Podrobné výsledky importu",
          },
          successfulImports: {
            label: "Úspešne importované",
          },
          failedImports: {
            label: "Neúspešné importy",
          },
          duplicateEmails: {
            label: "Duplicitné e-mailové adresy",
          },
          processingTimeMs: {
            label: "Čas spracovania (ms)",
          },
          summary: {
            title: "Súhrn importu",
            description: "Prehľad výsledkov importu",
          },
          newRecords: {
            label: "Nové záznamy",
          },
          updatedRecords: {
            label: "Aktualizované záznamy",
          },
          skippedDuplicates: {
            label: "Preskočené duplikáty",
          },
          errors: {
            title: "Podrobnosti o chybe",
            row: {
              label: "Riadok",
            },
            email: {
              label: "E-mail",
            },
            error: {
              label: "Chyba",
            },
          },
          nextSteps: {
            title: "Ďalšie kroky",
            item: {
              label: "Nasledujúci krok",
            },
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje importu",
            description: "Skontrolujte súbor CSV a nastavenia",
            emptyFile: "Súbor CSV musí obsahovať údaje",
            emptyFileName: "Zadajte názov importu",
            invalidDomain: "Vyberte platný typ importovaných údajov",
            invalidBatchSize: "Veľkosť dávky musí byť od 10 do 1 000",
            fileTooLarge:
              "Súbor prekračuje limit 10 MB. Zvážte spracovanie na pozadí.",
          },
          unauthorized: {
            title: "Prístup zamietnutý",
            description: "Nemáte oprávnenie importovať údaje",
          },
          fileTooLarge: {
            title: "Príliš veľký súbor",
            description: "Vybraný súbor prekračuje limit 10 MB",
          },
          server: {
            title: "Import zlyhal",
            description:
              "Pri spracovaní importu nastala chyba. Prosím, skúste to znova.",
          },
          network: {
            title: "Chyba siete",
            description: "Sieťové pripojenie zlyhalo počas importu",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Tento import nemáte oprávnenie spustiť",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Zdroj importu sa nenašiel",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Konflikt s existujúcimi údajmi",
          },
        },
        success: {
          title: "Import dokončený",
          description: "Údaje zo súboru CSV sa importovali",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "Čaká",
          description: "Úloha čaká na spracovanie",
        },
        processing: {
          label: "Spracovanie",
          description: "Úloha sa spracúva",
        },
        completed: {
          label: "Dokončené",
          description: "Úloha úspešne dokončená",
        },
        failed: {
          label: "Zlyhalo",
          description: "Pri spracovaní úlohy nastala chyba",
        },
        cancelled: {
          label: "Zrušené",
          description: "Úlohu zrušil používateľ",
        },
        paused: {
          label: "Pozastavené",
          description: "Spracovanie úlohy je dočasne pozastavené",
        },
      },
      domain: {
        leads: {
          label: "Kontakty",
          description: "Potenciálni zákazníci a obchodné kontakty",
        },
        contacts: {
          label: "Kontakty",
          description: "Všeobecné kontaktné informácie a adresár",
        },
        businessData: {
          label: "Obchodné údaje",
          description: "Informácie o firme a obchodné profily",
        },
        emails: {
          label: "Zoznamy e-mailov",
          description: "E-mail marketingové zoznamy a kampane",
        },
        users: {
          label: "Používatelia",
          description: "Používatelia systému a informácie o účte",
        },
        templates: {
          label: "Šablóny",
          description: "E-mailové šablóny a obsah",
        },
      },
      format: {
        csv: {
          label: "Súbor CSV",
          description: "Hodnoty oddelené čiarkami (najbežnejší formát)",
        },
        xlsx: {
          label: "Súbor Excel",
          description: "Tabuľka Microsoft Excel",
        },
        json: {
          label: "Súbor JSON",
          description: "Údaje vo formáte JavaScript Object Notation",
        },
        tsv: {
          label: "Súbor TSV",
          description: "Hodnoty oddelené tabulátormi",
        },
      },
      processing: {
        immediate: {
          label: "Spracovať teraz",
          description: "Spracovať súbor ihneď (najrýchlejšia možnosť)",
        },
        background: {
          label: "Na pozadí",
          description: "Spracovať na pozadí (pri veľkých súboroch)",
        },
        scheduled: {
          label: "Naplánovať na neskôr",
          description: "Naplánovať spracovanie na konkrétny čas",
        },
      },
      errorType: {
        validation: {
          label: "Neplatné údaje",
          description: "Údaje nespĺňajú požadovaný formát alebo pravidlá",
        },
        duplicate: {
          label: "Duplicitné údaje",
          description: "Záznam už existuje v systéme",
        },
        format: {
          label: "Chyba formátu",
          description: "Formát súboru je nesprávny alebo poškodený",
        },
        processing: {
          label: "Chyba spracovania",
          description: "Nastala chyba počas spracovania údajov",
        },
        system: {
          label: "Systémová chyba",
          description: "Interná chyba systému",
        },
      },
      batchSize: {
        small: {
          label: "Malé (50)",
          description: "Vhodné na skúšky alebo malé importy",
        },
        medium: {
          label: "Stredná (100)",
          description: "Odporúčané pre väčšinu importov",
        },
        large: {
          label: "Veľké (250)",
          description: "Dobré pre veľké súbory s jednoduchými dátami",
        },
        xlarge: {
          label: "Extra veľké (500)",
          description: "Pre veľmi veľké súbory (pokročilí používatelia)",
        },
      },
    },
    nextSteps: {
      reviewErrors: "V podrobnostiach chyby nájdete príčinu",
      checkDuplicates: "Zvážte úpravu nastavení spracovania duplikátov",
      reviewLeads: "Skontrolujte importované kontakty v časti správy kontaktov",
      startCampaign: "Zvážte spustenie e-mailovej kampane pre nové kontakty",
      reviewContacts: "Skontrolujte importované kontakty v časti Kontakty",
      organizeContacts:
        "Roztrieďte kontakty do skupín alebo ich označte štítkami",
      reviewImported: "Prezrite si svoje importované údaje v príslušnej časti",
      monitorProgress: "Sledujte priebeh v histórii úloh",
      checkJobsList: "Podrobnosti o stave nájdete v zozname úloh",
    },
    errors: {
      cancel: {
        server: "Nepodarilo sa zrušiť úlohu importu",
      },
      retry: {
        server: "Úlohu importu sa nepodarilo spustiť znova",
      },
      delete: {
        server: "Nepodarilo sa odstrániť úlohu importu",
      },
      status: {
        server: "Stav úlohy sa nepodarilo načítať",
      },
    },
    error: {
      default: "Nastala chyba",
    },
    enums: {
      csvImportJobStatus: {
        pending: "Čaká",
        processing: "Spracovanie",
        completed: "Dokončené",
        failed: "Zlyhalo",
      },
      csvImportJobAction: {
        retry: "Skúsiť znova",
        delete: "Odstrániť",
        stop: "Zastaviť",
      },
      importMode: {
        createOnly: "Iba vytvoriť",
        updateOnly: "Iba aktualizovať",
        createOrUpdate: "Vytvoriť alebo aktualizovať",
        skipDuplicates: "Preskočiť duplikáty",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "Okamžite",
        chunked: "Po dávkach",
        scheduled: "Plánované",
      },
      importErrorType: {
        validationError: "Neplatné údaje",
        duplicateEmail: "Duplicitná e-mailová adresa",
        invalidFormat: "Neplatný formát",
        missingRequiredField: "Chýba povinné pole",
        processingError: "Chyba spracovania",
        systemError: "Systémová chyba",
      },
      batchProcessingStatus: {
        pending: "Čaká",
        processing: "Spracovanie",
        completed: "Dokončené",
        failed: "Zlyhalo",
        retrying: "Opakuje sa pokus",
      },
      importPriority: {
        low: "Nízka",
        normal: "Normálna",
        high: "Vysoká",
        urgent: "Naliehavé",
      },
      importSource: {
        webUpload: "Nahratie cez web",
        apiUpload: "Nahratie cez API",
        scheduledImport: "Naplánovaný import",
        bulkOperation: "Hromadná operácia",
      },
      csvDelimiter: {
        comma: "Čiarka",
        semicolon: "Semikolón",
        tab: "Tabulátor",
        pipe: "Zvislá čiara",
      },
      importValidationLevel: {
        strict: "Prísne",
        moderate: "Stredne prísne",
        lenient: "Mierne",
      },
      importNotificationType: {
        email: "E-mail",
        inApp: "V aplikácii",
        webhook: "Webhook",
        none: "Žiadne",
      },
      leadStatus: {
        new: "Nový",
        pending: "Čaká",
        campaignRunning: "Kampaň prebieha",
        websiteUser: "Používateľ webu",
        newsletterSubscriber: "Odberateľ newslettera",
        inContact: "Oslovený",
        signedUp: "Zaregistrovaný",
        subscriptionConfirmed: "Predplatné potvrdené",
        unsubscribed: "Odhlásený z odberu",
        bounced: "Vrátené",
        invalid: "Neplatný",
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
        website: "Webová stránka",
        socialMedia: "Sociálne médiá",
        emailCampaign: "E-mailová kampaň",
        referral: "Odporúčanie",
        csvImport: "Import CSV",
      },
    },
  },
  lead: {
    id: {
      category: "Kontakty",
      tags: {
        leads: "Kontakty",
        management: "Správa",
      },

      get: {
        title: "Načítať podrobnosti o kontakte",
        description: "Získať podrobné informácie o konkrétnom kontakte",
        backButton: {
          label: "Späť ku kontaktom",
        },
        editButton: {
          label: "Upraviť kontakt",
        },
        deleteButton: {
          label: "Odstrániť kontakt",
        },
        id: {
          label: "ID kontaktu",
          description: "Jedinečný identifikátor kontaktu",
        },
        form: {
          title: "Požiadavka na podrobnosti o kontakte",
          description: "Parametre na načítanie údajov o kontakte",
        },
        response: {
          title: "Informácie o kontakte",
          description: "Všetky údaje o kontakte a jeho história",
          basicInfo: {
            title: "Základné informácie",
            description: "Základné identifikačné údaje a stav kontaktu",
          },
          id: {
            content: "ID kontaktu",
          },
          email: {
            content: "E-mailová adresa",
          },
          businessName: {
            content: "Názov firmy",
          },
          contactName: {
            content: "Meno kontaktnej osoby",
          },
          status: {
            content: "Stav kontaktu",
          },
          contactDetails: {
            title: "Kontaktné údaje",
            description: "Kontaktné informácie a preferencie",
          },
          phone: {
            content: "Telefónne číslo",
          },
          website: {
            content: "Adresa webovej stránky",
          },
          country: {
            content: "Krajina",
          },
          language: {
            content: "Jazyk",
          },
          campaignTracking: {
            title: "Sledovanie kampane",
            description: "Údaje o e-mailovej kampani a jej priebehu",
          },
          source: {
            content: "Zdroj kontaktu",
          },
          currentCampaignStage: {
            content: "Aktuálna fáza kampane",
          },
          emailJourneyVariant: {
            content: "Variant série e-mailov",
          },
          emailsSent: {
            content: "Odoslané e-maily",
          },
          lastEmailSentAt: {
            content: "Posledný odoslaný e-mail",
          },
          engagement: {
            title: "Ukazovatele interakcií",
            description:
              "Údaje o otvoreniach e-mailov, kliknutiach a ďalších reakciách",
          },
          emailsOpened: {
            content: "Otvorené e-maily",
          },
          emailsClicked: {
            content: "E-maily s kliknutím na odkaz",
          },
          lastEngagementAt: {
            content: "Posledná interakcia",
          },
          unsubscribedAt: {
            content: "Čas odhlásenia z odberu",
          },
          conversion: {
            title: "Sledovanie konverzie",
            description: "Dôležité kroky kontaktu na ceste ku konverzii",
          },
          convertedUserId: {
            content: "ID používateľa po konverzii",
          },
          convertedAt: {
            content: "Čas konverzie",
          },
          signedUpAt: {
            content: "Čas registrácie",
          },
          subscriptionConfirmedAt: {
            content: "Čas potvrdenia predplatného",
          },
          metadata: {
            title: "Ďalšie informácie",
            description: "Poznámky a metaúdaje",
            content: "Metadáta",
          },
          notes: {
            content: "Poznámky",
          },
          createdAt: {
            content: "Čas vytvorenia",
          },
          updatedAt: {
            content: "Čas poslednej aktualizácie",
          },
          identity: {
            title: "Zariadenie a identita",
            description:
              "Údaje o zariadení a identifikátory používané pri sledovaní návštev",
          },
          ipAddress: {
            content: "IP adresa",
          },
          userAgent: {
            content: "Identifikátor klienta",
          },
          deviceType: {
            content: "Typ zariadenia",
          },
          browser: {
            content: "Prehliadač",
          },
          os: {
            content: "Operačný systém",
          },
          referralCode: {
            content: "Kód odporúčania",
          },
          lifecycle: {
            title: "Životný cyklus",
            description: "Ďalšie dôležité dátumy v histórii kontaktu",
          },
          bouncedAt: {
            content: "Čas vrátenia nedoručeného e-mailu",
          },
          invalidAt: {
            content: "Označené ako neplatné",
          },
          campaignStartedAt: {
            content: "Začiatok kampane",
          },
          linkedLeads: {
            title: "Prepojené kontakty",
            description: "Kontakty priradené tej istej osobe",
            linkedLeadId: {
              content: "ID prepojeného kontaktu",
            },
            linkReason: {
              content: "Dôvod prepojenia",
            },
            linkedAt: {
              content: "Čas prepojenia",
            },
            email: {
              content: "E-mail",
            },
            businessName: {
              content: "Názov firmy",
            },
            status: {
              content: "Stav",
            },
            ipAddress: {
              content: "IP adresa",
            },
            userAgent: {
              content: "Identifikátor klienta",
            },
            createdAt: {
              content: "Čas vytvorenia",
            },
          },
          linkedUsers: {
            title: "Prepojené používateľské účty",
            description: "Používateľské účty prepojené s týmto kontaktom",
            userId: {
              content: "ID používateľa",
            },
            linkReason: {
              content: "Dôvod prepojenia",
            },
            linkedAt: {
              content: "Čas prepojenia",
            },
            email: {
              content: "E-mail",
            },
            publicName: {
              content: "Zobrazované meno",
            },
          },
          referralHistory: {
            title: "História odporúčaní",
            description:
              "Kódy odporúčaní, na ktoré kontakt klikol pred registráciou",
            code: {
              content: "Kód odporúčania",
            },
            ownerUserId: {
              content: "Vlastník kódu",
            },
            clickedAt: {
              content: "Čas kliknutia",
            },
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Zadané ID kontaktu je neplatné.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description:
              "Ak chcete zobraziť podrobnosti o kontakte, prihláste sa.",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Na zobrazenie tohto kontaktu nemáte oprávnenie.",
          },
          notFound: {
            title: "Kontakt sa nenašiel",
            description: "Kontakt so zadaným ID sa nenašiel.",
          },
          server: {
            title: "Chyba servera",
            description: "Podrobnosti o kontakte sa nepodarilo načítať.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Nedá sa pripojiť k serveru",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny.",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Kontaktné údaje boli zmenené",
          },
        },
        success: {
          title: "Úspech",
          description: "Podrobnosti o kontakte sa načítali.",
        },
      },
      patch: {
        title: "Aktualizovať kontakt",
        description: "Upraviť údaje a stav kontaktu",
        backButton: {
          label: "Späť na kontakt",
        },
        deleteButton: {
          label: "Odstrániť kontakt",
        },
        submitButton: {
          label: "Aktualizovať kontakt",
          loadingText: "Aktualizuje sa kontakt…",
        },
        id: {
          label: "ID kontaktu",
          description: "Jedinečné ID kontaktu, ktorý chcete aktualizovať",
        },
        form: {
          title: "Aktualizovať kontakt",
          description: "Upraviť kontaktné informácie",
        },
        updates: {
          title: "Zmeny kontaktu",
          description: "Polia na aktualizáciu",
        },
        basicInfo: {
          title: "Základné informácie",
          description: "Aktualizovať základné údaje o kontakte",
        },
        email: {
          label: "E-mailová adresa",
          description: "E-mailová adresa kontaktnej osoby",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Názov firmy",
          description: "Názov firmy",
          placeholder: "Acme Corporation",
        },
        contactName: {
          label: "Meno kontaktnej osoby",
          description: "Hlavná kontaktná osoba",
          placeholder: "Ján Novák",
        },
        status: {
          label: "Stav kontaktu",
          description: "Aktuálny stav kontaktu",
          placeholder: "Vybrať stav",
        },
        contactDetails: {
          title: "Kontaktné údaje",
          description: "Aktualizovať kontaktné informácie",
        },
        phone: {
          label: "Telefónne číslo",
          description: "Kontaktné telefónne číslo",
          placeholder: "+421 900 123 456",
        },
        website: {
          label: "Webová stránka",
          description: "Adresa webovej stránky firmy",
          placeholder: "https://example.com",
        },
        country: {
          label: "Krajina",
          description: "Krajina sídla firmy",
          placeholder: "Vyberte krajinu",
        },
        language: {
          label: "Jazyk",
          description: "Preferovaný jazyk",
          placeholder: "Vybrať jazyk",
        },
        campaignManagement: {
          title: "Správa kampane",
          description: "Spravovať nastavenia kampane",
        },
        source: {
          label: "Zdroj kontaktu",
          description: "Pôvod kontaktu",
          placeholder: "Vybrať zdroj",
        },
        currentCampaignStage: {
          label: "Fáza kampane",
          description: "Aktuálna fáza e-mailovej kampane",
          placeholder: "Vybrať fázu",
        },
        additionalDetails: {
          title: "Ďalšie podrobnosti",
          description: "Poznámky a metaúdaje",
        },
        notes: {
          label: "Poznámky",
          description: "Interné poznámky o kontakte",
          placeholder: "Sem zadajte poznámky",
        },
        metadata: {
          label: "Metadáta",
          description: "Ďalšie metaúdaje (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "ID používateľa po konverzii",
          description: "ID používateľského účtu vytvoreného pri konverzii",
          placeholder: "ID používateľa",
        },
        subscriptionConfirmedAt: {
          label: "Čas potvrdenia predplatného",
          description: "Dátum potvrdenia predplatného",
          placeholder: "Vybrať dátum",
        },
        response: {
          title: "Aktualizovaný kontakt",
          description: "Aktualizované údaje o kontakte",
          basicInfo: {
            title: "Základné informácie",
            description: "Aktualizované základné údaje o kontakte",
          },
          id: {
            content: "ID kontaktu",
          },
          email: {
            content: "E-mailová adresa",
          },
          businessName: {
            content: "Názov firmy",
          },
          contactName: {
            content: "Meno kontaktnej osoby",
          },
          status: {
            content: "Stav kontaktu",
          },
          contactDetails: {
            title: "Kontaktné údaje",
            description: "Aktualizované kontaktné informácie",
          },
          phone: {
            content: "Telefónne číslo",
          },
          website: {
            content: "Adresa webovej stránky",
          },
          country: {
            content: "Krajina",
          },
          language: {
            content: "Jazyk",
          },
          campaignTracking: {
            title: "Sledovanie kampane",
            description: "Aktualizované informácie o kampani",
          },
          source: {
            content: "Zdroj kontaktu",
          },
          currentCampaignStage: {
            content: "Aktuálna fáza kampane",
          },
          emailJourneyVariant: {
            content: "Variant série e-mailov",
          },
          emailsSent: {
            content: "Odoslané e-maily",
          },
          lastEmailSentAt: {
            content: "Posledný odoslaný e-mail",
          },
          engagement: {
            title: "Ukazovatele interakcií",
            description: "Údaje o reakciách na e-maily",
          },
          emailsOpened: {
            content: "Otvorené e-maily",
          },
          emailsClicked: {
            content: "E-maily s kliknutím na odkaz",
          },
          lastEngagementAt: {
            content: "Posledná interakcia",
          },
          unsubscribedAt: {
            content: "Čas odhlásenia z odberu",
          },
          conversion: {
            title: "Sledovanie konverzie",
            description: "Prehľad krokov vedúcich ku konverzii",
          },
          convertedUserId: {
            content: "ID používateľa po konverzii",
          },
          convertedAt: {
            content: "Čas konverzie",
          },
          signedUpAt: {
            content: "Čas registrácie",
          },
          subscriptionConfirmedAt: {
            content: "Čas potvrdenia predplatného",
          },
          metadata: {
            title: "Ďalšie informácie",
            description: "Poznámky a metaúdaje",
            content: "Metadáta",
          },
          notes: {
            content: "Poznámky",
          },
          createdAt: {
            content: "Čas vytvorenia",
          },
          updatedAt: {
            content: "Čas poslednej aktualizácie",
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Poskytnuté údaje sú neplatné",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Ak chcete upravovať kontakty, prihláste sa.",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Na úpravu tohto kontaktu nemáte oprávnenie.",
          },
          notFound: {
            title: "Kontakt sa nenašiel",
            description: "Kontakt so zadaným ID sa nenašiel.",
          },
          conflict: {
            title: "Konflikt pri aktualizácii",
            description: "Kontakt medzitým upravil iný používateľ.",
          },
          server: {
            title: "Chyba servera",
            description: "Pri úprave kontaktu nastala chyba",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Nedá sa pripojiť k serveru",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny.",
          },
        },
        success: {
          title: "Úspech",
          description: "Kontakt bol aktualizovaný",
        },
      },
      post: {
        title: "[id]",
        description: "Koncový bod [id]",
        form: {
          title: "Nastavenia [id]",
          description: "Nastaviť parametre [id]",
        },
        response: {
          title: "Odpoveď",
          description: "Údaje v odpovedi [id]",
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
            title: "Nenašlo sa",
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
          bounced: "Nedoručené",
          invalid: "Neplatný",
        },
        leadSource: {
          website: "Webová stránka",
          referral: "Odporúčanie",
          socialMedia: "Sociálne médiá",
          emailCampaign: "E-mailová kampaň",
          csvImport: "Import CSV",
          api: "API",
          manual: "Ručne",
          other: "Iné",
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
        emailJourneyVariant: {
          uncensoredConvert: "Odporúčanie bez cenzúry",
          sideHustle: "Vedľajší príjem",
          quietRecommendation: "Nenápadné odporúčanie",
        },
      },
      widget: {
        loading: "Načítava sa kontakt…",
        notFound: "Kontakt sa nenašiel.",
        back: "Späť",
        leadFallbackTitle: "Kontakt",
        edit: "Upraviť",
        delete: "Odstrániť",
        converted: "Po konverzii",
        quickActions: "Rýchle akcie",
        editLead: "Upraviť kontakt",
        sendTestEmail: "Poslať testovací e-mail",
        viewInSearch: "Otvoriť vo vyhľadávaní",
        userProfile: "Profil používateľa",
        userDetail: "Podrobnosti o používateľovi",
        creditHistory: "História kreditov",
        campaignFunnel: "Konverzný lievik kampane",
        sourceLabel: "Zdroj:",
        lastEmailLabel: "Posledný e-mail:",
        campaignPerformance: "Výkonnosť kampane",
        emailsSent: "Odoslané e-maily",
        opened: "Otvorené",
        clicked: "S kliknutím",
        openRate: "Miera otvorení",
        clickRate: "Miera kliknutí",
        clickToOpenRate: "Podiel otvorených e-mailov s kliknutím",
        contactDetails: "Kontaktné údaje",
        country: "Krajina",
        language: "Jazyk",
        engagement: "Interakcia",
        emailsOpened: "Otvorené e-maily",
        emailsClicked: "E-maily s kliknutím na odkaz",
        lastEngagement: "Posledná interakcia",
        unsubscribed: "Odhlásené z odberu",
        conversion: "Konverzia",
        signedUp: "Zaregistrovaný",
        convertedAt: "Čas konverzie",
        subscriptionConfirmed: "Predplatné potvrdené",
        convertedUserId: "ID používateľa po konverzii",
        activeSubscriberSince: "Aktívne predplatné od",
        viewUserProfile: "Zobraziť používateľský profil",
        viewUserDetail: "Zobraziť podrobnosti o používateľovi",
        notesAndMetadata: "Poznámky a metaúdaje",
        notes: "Poznámky",
        metadata: "Metadáta",
        created: "Vytvorené",
        lastUpdated: "Posledná aktualizácia",
        daysOld: "d od vytvorenia",
        lastEngaged: "Posledná interakcia",
        ago: "dozadu",
        variant: "Variant:",
        copyEmail: "e-mail",
        copyId: "ID",
        copyPhone: "telefón",
        copyUserId: "ID používateľa",
        stageNotStarted: "Nespustené",
        stageInitial: "Počiatočná",
        stageFollowup1: "Nadväzujúci e-mail 1",
        stageFollowup2: "Nadväzujúci e-mail 2",
        stageFollowup3: "Nadväzujúci e-mail 3",
        stageNurture: "Budovanie vzťahu",
        stageReactivation: "Obnovenie aktivity",
        tabOverview: "Prehľad",
        tabDetails: "Detaily",
        tabIdentity: "Identita",
        tabBasic: "Základné údaje",
        tabCampaign: "Kampaň",
        tabAdvanced: "Pokročilé",
        deviceIdentity: "Zariadenie a identita",
        ipAddress: "IP adresa",
        userAgent: "Identifikátor klienta",
        deviceType: "Typ zariadenia",
        browser: "Prehliadač",
        os: "Operačný systém",
        referralCode: "Kód odporúčania",
        lifecycleTimestamps: "Životný cyklus",
        bouncedAt: "Čas vrátenia nedoručeného e-mailu",
        invalidAt: "Označené ako neplatné",
        campaignStartedAt: "Začiatok kampane",
        linkedLeadsSection: "Prepojené kontakty",
        linkedLeadsEmpty: "Žiadne prepojené kontakty",
        linkedUsersSection: "Prepojené používateľské účty",
        linkedUsersEmpty: "Žiadne prepojené používateľské účty",
        linkReason: "Dôvod prepojenia:",
        linkedAt: "Prepojené:",
        copyIp: "IP",
        copyLinkedLeadId: "ID kontaktu",
        copyUserId2: "ID používateľa",
      },
      delete: {
        title: "Odstrániť kontakt",
        description: "Odstrániť kontakt zo systému",
        container: {
          title: "Odstrániť kontakt",
          description: "Naozaj chcete tento kontakt natrvalo odstrániť?",
        },
        backButton: {
          label: "Späť na kontakt",
        },
        submitButton: {
          label: "Odstrániť kontakt",
          loadingText: "Odstraňuje sa kontakt…",
        },
        actions: {
          delete: "Odstrániť kontakt",
          deleting: "Odstraňuje sa kontakt…",
        },
        id: {
          label: "ID kontaktu",
          description:
            "Jedinečný identifikátor kontaktu, ktorý sa má odstrániť",
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Zadané ID kontaktu je neplatné.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Ak chcete odstrániť kontakty, prihláste sa.",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Na odstránenie tohto kontaktu nemáte oprávnenie.",
          },
          notFound: {
            title: "Kontakt sa nenašiel",
            description: "Kontakt so zadaným ID sa nenašiel.",
          },
          conflict: {
            title: "Konflikt pri odstránení",
            description:
              "Kontakt nemožno odstrániť, pretože naň odkazujú iné záznamy",
          },
          server: {
            title: "Chyba servera",
            description: "Pri odstraňovaní kontaktu nastala chyba.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Nedá sa pripojiť k serveru",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny.",
          },
        },
        success: {
          title: "Kontakt odstránený",
          description: "Kontakt bol úspešne odstránený",
        },
      },
    },
  },
  list: {
    category: "Kontakty",
    tags: {
      leads: "Kontakty",
      management: "Správa",
    },

    get: {
      title: "Zoznam kontaktov",
      description: "Načíta zoznam kontaktov s filtrami a stránkovaním",
      createButton: {
        label: "Vytvoriť kontakt",
      },
      form: {
        title: "Filtre zoznamu kontaktov",
        description: "Nastaviť filtre pre zoznam kontaktov",
      },
      actions: {
        refresh: "Obnoviť",
        refreshing: "Obnovuje sa…",
      },
      page: {
        label: "Číslo strany",
        description: "Číslo zobrazenej strany",
        placeholder: "Zadajte číslo strany",
      },
      limit: {
        label: "Výsledky na stránku",
        description: "Počet výsledkov na stránku",
        placeholder: "Zadajte limit",
      },
      status: {
        label: "Stav kontaktu",
        description: "Filtrovať podľa stavu kontaktu",
        placeholder: "Vybrať stav",
      },
      currentCampaignStage: {
        label: "Fáza kampane",
        description: "Filtrovať podľa aktuálnej fázy kampane",
        placeholder: "Vyberte fázu kampane",
      },
      source: {
        label: "Zdroj kontaktu",
        description: "Filtrovať podľa zdroja kontaktu",
        placeholder: "Vyberte zdroj",
      },
      country: {
        label: "Krajina",
        description: "Filtrovať podľa krajiny",
        placeholder: "Vybrať krajiny",
      },
      language: {
        label: "Jazyk",
        description: "Filtrovať podľa jazyka",
        placeholder: "Vyberte jazyky",
      },
      search: {
        label: "Hľadať",
        description:
          "Vyhľadajte kontakty podľa mena, e-mailu alebo názvu firmy",
        placeholder: "Zadajte hľadaný výraz",
      },
      searchPagination: {
        title: "Vyhľadávanie a stránkovanie",
        description: "Ovládanie vyhľadávania a stránkovania",
      },
      statusFilters: {
        title: "Filtre stavu a kampane",
        description: "Filtrovať podľa stavu, fázy kampane a zdroja",
      },
      locationFilters: {
        title: "Filtre krajiny a jazyka",
        description: "Filtrovať podľa krajiny a jazyka",
      },
      sortingOptions: {
        title: "Možnosti zoradenia",
        description: "Nastaviť zoradenie výsledkov",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Pole použité na zoradenie výsledkov",
        placeholder: "Vybrať pole zoradenia",
      },
      sortOrder: {
        label: "Poradie",
        description: "Poradie zoradenia výsledkov",
        placeholder: "Vyberte poradie zoradenia",
      },
      response: {
        title: "Výsledok načítania kontaktov",
        description: "Zoznam kontaktov rozdelený na strany s metadátami",
        leads: {
          title: "Podrobnosti o kontakte",
          description: "Údaje o jednotlivom kontakte",
          id: "ID kontaktu",
          email: "E-mailová adresa",
          businessName: "Názov firmy",
          contactName: "Meno kontaktu",
          phone: "Telefónne číslo",
          website: "Webová stránka",
          country: "Krajina",
          language: "Jazyk",
          status: "Stav",
          source: "Zdroj",
          notes: "Poznámky",
          convertedUserId: "ID používateľa po konverzii",
          convertedAt: "Čas konverzie",
          signedUpAt: "Čas registrácie",
          subscriptionConfirmedAt: "Čas potvrdenia predplatného",
          currentCampaignStage: "Aktuálna fáza kampane",
          emailsSent: "Odoslané e-maily",
          lastEmailSentAt: "Čas odoslania posledného e-mailu",
          unsubscribedAt: "Čas zrušenia odberu",
          emailsOpened: "Otvorené e-maily",
          emailsClicked: "E-maily s kliknutím na odkaz",
          lastEngagementAt: "Čas poslednej interakcie",
          metadata: "Metadáta",
          createdAt: "Vytvorené",
          updatedAt: "Aktualizované",
        },
        total: "Počet kontaktov",
        page: "Aktuálna stránka",
        limit: "Veľkosť stránky",
        totalPages: "Celkový počet stránok",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie zoznamu kontaktov sa prihláste",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre filtra",
        },
        server: {
          title: "Chyba servera",
          description: "Pri načítavaní kontaktov nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri načítavaní kontaktov nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Pri načítavaní kontaktov nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie zobraziť zoznam kontaktov",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Kontakty sa nenašli",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri načítavaní kontaktov nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Zoznam kontaktov obsahuje neuložené zmeny",
        },
      },
      success: {
        title: "Hotovo",
        description: "Zoznam kontaktov sa úspešne načítal",
      },
      emptySearch: "Žiadne kontakty nezodpovedajú filtrom",
      emptyState: "Zatiaľ žiadne kontakty",
    },
    widget: {
      converted: "Konvertovaný",
      emailsSent: "Odoslané e-maily: {{count}}",
      openRate: "Miera otvorenia: {{percent}} %",
      clicks: "Kliknutia: {{count}}",
      stats: "Štatistiky",
      graphs: "Grafy",
      search: "Hľadať",
      export: "Export",
      import: "Import",
      batch: "Hromadné operácie",
      refresh: "Obnoviť",
      view: "Zobraziť",
      edit: "Upraviť",
      delete: "Odstrániť",
      allSources: "Všetky zdroje",
      clearSearch: "Vymazať vyhľadávanie",
      clearStatusFilter: "Zrušiť filter stavu",
      clearSourceFilter: "Zrušiť filter zdroja",
      addLead: "Pridať kontakt",
      importCsv: "Importovať CSV",
      pagination:
        "Stránka {{page}} z {{totalPages}} · Počet kontaktov: {{total}}",
      tabAll: "Všetky",
      tabNew: "Nové",
      tabCampaign: "Kampaň",
      tabConfirmed: "Potvrdené",
      tabUnsubscribed: "Odhlásené z odberu",
      tabBounced: "Vrátené",
      sortNewest: "Od najnovších",
      sortOldest: "Od najstarších",
      sortEmailsSentHigh: "Odoslané e-maily (od najvyššieho počtu)",
      sortEmailsSentLow: "Odoslané e-maily (od najnižšieho počtu)",
      sortBusinessNameAZ: "Obchodné meno (A-Z)",
      sortBusinessNameZA: "Obchodné meno (Z-A)",
      linkedCount: "Prepojené: {{count}}",
      hasLinkedUser: "Používateľ",
      referralCode: "Kód odporúčania",
    },
  },
  search: {
    category: "Správa kontaktov",
    tags: {
      leads: "Kontakty",
      search: "Hľadať",
    },
    get: {
      title: "Vyhľadať kontakty",
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
          description:
            "Pri vyhľadávaní kontaktov nastala interná chyba servera",
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
          title: "Konflikt",
          description: "Pri vyhľadávaní kontaktov nastal konflikt údajov",
        },
      },
      success: {
        title: "Vyhľadávanie dokončené",
        description: "Vyhľadávanie kontaktov sa dokončilo",
      },
    },
    widget: {
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
      converted: "Konvertovaný",
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
  },
  stats: {
    title: "Štatistiky kontaktov",
    description: "Štatistiky a analýzy kontaktov s historickými údajmi",
    category: "Správa kontaktov",
    tags: {
      leads: "Kontakty",
      statistics: "Štatistiky",
      analytics: "Analytika",
    },
    container: {
      title: "Filtre štatistík",
      description: "Nastavte filtre a možnosti zobrazenia štatistík kontaktov",
    },
    refresh: "Obnoviť",
    sections: {
      timeFilters: "Obdobie a rozsah dátumov",
      comparison: "Nastavenie porovnania",
      leadFilters: "Filtre kontaktov",
      engagement: "Filtre interakcií",
      conversion: "Filtre konverzií",
      dataCompleteness: "Úplnosť údajov",
      additional: "Ďalšie filtre",
      searchSort: "Vyhľadávanie a zoradenie",
    },
    timePeriod: {
      label: "Obdobie",
      description: "Vyberte časové obdobie pre agregáciu štatistík",
      hour: "Hodina",
      day: "Deň",
      week: "Týždeň",
      month: "Mesiac",
      quarter: "Štvrťrok",
      year: "Rok",
    },
    dateRangePreset: {
      label: "Predvolený rozsah dátumov",
      description: "Vyberte predvolený rozsah dátumov",
    },
    dateRange: {
      today: "Dnes",
      yesterday: "Včera",
      last7Days: "Posledných 7 dní",
      last30Days: "Posledných 30 dní",
      last90Days: "Posledných 90 dní",
      thisWeek: "Tento týždeň",
      lastWeek: "Minulý týždeň",
      thisMonth: "Tento mesiac",
      lastMonth: "Minulý mesiac",
      thisQuarter: "Tento štvrťrok",
      lastQuarter: "Minulý štvrťrok",
      thisYear: "Tento rok",
      lastYear: "Minulý rok",
      custom: "Vlastný rozsah",
    },
    dateFrom: {
      label: "Dátum začiatku",
      description: "Počiatočný dátum obdobia štatistiky",
    },
    dateTo: {
      label: "Dátum ukončenia",
      description: "Koncový dátum obdobia štatistiky",
    },
    chartType: {
      label: "Typ grafu",
      description: "Vyberte typ grafu na zobrazenie údajov",
      line: "Čiarový graf",
      bar: "Stĺpcový graf",
      area: "Plošný graf",
      pie: "Koláčový graf",
      donut: "Prstencový graf",
    },
    includeComparison: {
      label: "Zahrnúť porovnanie",
      description: "Porovnať s predchádzajúcim obdobím",
    },
    comparisonPeriod: {
      label: "Obdobie porovnania",
      description: "Vyberte porovnávacie obdobie",
    },
    status: {
      label: "Stav kontaktu",
      description: "Filtrovať podľa stavu kontaktu",
    },
    source: {
      label: "Zdroj kontaktu",
      description: "Filtrovať podľa zdroja kontaktu",
    },
    country: {
      ...regionalCountryNames("sk"),
      label: "Krajina",
      description: "Filtrovať podľa krajiny",
      all: "Všetky krajiny",
      de: "Nemecko",
      pl: "Poľsko",
      fr: "Francúzsko",
      global: "Celosvetové",
    },
    language: {
      it: "Taliančina",
      es: "Španielčina",
      sk: "Slovenčina",
      label: "Jazyk",
      description: "Filtrovať podľa uprednostňovaného jazyka",
      all: "Všetky jazyky",
      en: "Angličtina",
      de: "Nemčina",
      pl: "Poľština",
      fr: "Francúzština",
    },
    campaignStage: {
      label: "Fáza kampane",
      description: "Filtrovať podľa fázy e-mailovej kampane",
    },
    hasEngagement: {
      label: "Má zaznamenanú interakciu",
      description: "Filtrovať kontakty s aspoň jednou interakciou s e-mailom",
    },
    minEmailsOpened: {
      label: "Minimálny počet otvorených e-mailov",
      description: "Minimálny počet otvorených e-mailov",
    },
    minEmailsClicked: {
      label: "Minimálny počet e-mailov s kliknutím",
      description:
        "Minimálny počet e-mailov, v ktorých príjemca klikol na odkaz",
    },
    isConverted: {
      label: "Konverzia dokončená",
      description: "Filtrovať kontakty s dokončenou konverziou",
    },
    hasSignedUp: {
      label: "Zaregistrovaný",
      description: "Filtrovať kontakty, ktoré sa zaregistrovali",
    },
    hasConfirmedSubscription: {
      label: "Potvrdené predplatné",
      description: "Filtrovať kontakty s potvrdeným predplatným",
    },
    hasBusinessName: {
      label: "Má názov firmy",
      description: "Filtrovať kontakty s názvom firmy",
    },
    hasContactName: {
      label: "Má meno kontaktu",
      description: "Filtrovať kontakty s uvedeným menom",
    },
    hasPhone: {
      label: "Má telefónne číslo",
      description: "Filtrovať kontakty s telefónnym číslom",
    },
    hasWebsite: {
      label: "Má webovú stránku",
      description: "Filtrovať kontakty s webovou stránkou",
    },
    hasNotes: {
      label: "Má poznámky",
      description: "Filtrovať kontakty s poznámkami",
    },
    sortBy: {
      label: "Zoradiť podľa",
      description: "Pole použité na zoradenie výsledkov",
    },
    sortOrder: {
      label: "Poradie",
      description: "Vzostupné alebo zostupné poradie",
    },
    limit: {
      label: "Limit výsledkov",
      description: "Maximálny počet výsledkov",
    },
    hasUserId: {
      label: "Má ID používateľa",
      description: "Filtrovať kontakty prepojené s ID používateľa",
    },
    emailVerified: {
      label: "Overený e-mail",
      description: "Filtrovať podľa stavu overenia e-mailu",
    },
    journeyVariant: {
      label: "Variant e-mailovej série",
      description: "Filtrovať podľa variantu e-mailovej série",
    },
    minEmailsSent: {
      label: "Minimálny počet odoslaných e-mailov",
      description: "Minimálny počet e-mailov odoslaných kontaktu",
    },
    createdAfter: {
      label: "Vytvorené po",
      description: "Filtrovať kontakty vytvorené po tomto dátume",
    },
    createdBefore: {
      label: "Vytvorené pred",
      description: "Filtrovať kontakty vytvorené pred týmto dátumom",
    },
    updatedAfter: {
      label: "Aktualizované po",
      description: "Filtrovať kontakty aktualizované po tomto dátume",
    },
    updatedBefore: {
      label: "Aktualizované pred",
      description: "Filtrovať kontakty aktualizované pred týmto dátumom",
    },
    search: {
      label: "Hľadať",
      description: "Vyhľadajte kontakty podľa e-mailu, mena alebo názvu firmy",
      placeholder: "Vyhľadať kontakty…",
    },
    engagementLevel: {
      high: "Vysoká miera interakcií",
      medium: "Stredná miera interakcií",
      low: "Nízka miera interakcií",
      none: "Bez interakcií",
    },
    response: {
      overview: "Prehľad",
      emailPerformance: "Výkonnosť e-mailov",
      conversionRates: "Miery konverzie",
      activityTimeline: "Časová os aktivity",
      campaignDistribution: "Rozdelenie podľa kampaní",
      geographicDistribution: "Rozdelenie podľa krajiny a zdroja",
      dataQuality: "Kvalita údajov",
      performanceMetrics: "Ukazovatele výkonnosti",
      engagementLevels: "Miery interakcií",
      conversionFunnel: "Konverzný lievik",
      totalLeads: "Počet kontaktov",
      newLeads: "Nové kontakty",
      activeLeads: "Aktívne kontakty",
      inactiveLeads: "Neaktívne kontakty",
      leadsByStatus: "Kontakty podľa stavu",
      leadsBySource: "Kontakty podľa zdroja",
      leadsByCountry: "Kontakty podľa krajiny",
      leadsByLanguage: "Kontakty podľa jazyka",
      websiteUserLeads: "Používatelia webu",
      newsletterSubscriberLeads: "Odberatelia newslettera",
      convertedLeads: "Kontakty s konverziou",
      consultationBookedLeads: "Rezervovaná konzultácia",
      signedUpLeads: "Zaregistrované kontakty",
      subscriptionConfirmedLeads: "Predplatné potvrdené",
      unsubscribedLeads: "Kontakty odhlásené z odberu",
      bounces: "Vrátené",
      qualifiedLeads: "Kvalifikované kontakty",
      nonQualifiedLeads: "Nekvalifikované kontakty",
      nurturingLeads: "Kontakty vo fáze budovania vzťahu",
      engagedLeads: "Kontakty s interakciami",
      leadsWithEmailEngagement: "S interakciami s e-mailmi",
      leadsWithoutEmailEngagement: "Bez interakcií s e-mailmi",
      averageEmailEngagementScore: "Priemerné skóre interakcií s e-mailmi",
      totalEmailEngagements: "Interakcie s e-mailmi spolu",
      signupRate: "Miera registrácie",
      subscriptionConfirmationRate: "Miera potvrdenia predplatného",
      dataCompletenessRate: "Úplnosť údajov",
      leadsWithBusinessName: "S názvom firmy",
      leadsWithContactName: "S menom kontaktu",
      leadsWithPhone: "S telefónom",
      leadsWithWebsite: "S webovou stránkou",
      leadsWithNotes: "S poznámkami",
      averageBusinessDataCompleteness: "Priemerná úplnosť údajov o firme",
      leadsByCampaignStage: "Kontakty podľa fázy kampane",
      leadsInActiveCampaigns: "V aktívnej kampani",
      leadsNotInCampaigns: "Mimo kampaní",
      recentLeads: "Nedávne kontakty",
      topLeadsByEngagement: "Kontakty s najvyššou aktivitou",
      mostActiveLeads: "Najaktívnejšie kontakty",
      recentConversions: "Nedávne konverzie",
      recentSignups: "Nedávne registrácie",
      timeSeriesData: "Údaje časových radov",
      comparisonData: "Porovnávacie údaje",
      averageTimeToConversion: "Priemerný čas do konverzie",
      averageTimeToConsultation: "Priemerný čas do konzultácie",
      averageTimeToSignup: "Priemerný čas do registrácie",
      topPerformingCampaigns: "Najvýkonnejšie kampane",
      topPerformingSources: "Najvýkonnejšie zdroje",
      topPerformingCountries: "Najvýkonnejšie krajiny",
      conversionRate: "Miera konverzie",
      consultationBookingRate: "Miera rezervácie konzultácie",
      averageOpenRate: "Priemerná miera otvorenia",
      averageClickRate: "Priemerná miera kliknutí",
      campaignRunningLeads: "V prebiehajúcich kampaniach",
      bouncedLeads: "Kontakty s vráteným e-mailom",
      invalidLeads: "Neplatné kontakty",
      totalEmailsSent: "Odoslané e-maily spolu",
      totalEmailsOpened: "Otvorené e-maily spolu",
      totalEmailsClicked: "E-maily s kliknutím na odkaz spolu",
      averageEmailsPerLead: "Priemerný počet e-mailov na kontakt",
      leadVelocity: "Tempo pribúdania kontaktov",
      leadsCreatedToday: "Kontakty vytvorené dnes",
      leadsCreatedThisWeek: "Kontakty vytvorené tento týždeň",
      leadsCreatedThisMonth: "Kontakty vytvorené tento mesiac",
      leadsUpdatedToday: "Kontakty aktualizované dnes",
      leadsUpdatedThisWeek: "Kontakty aktualizované tento týždeň",
      leadsUpdatedThisMonth: "Kontakty aktualizované tento mesiac",
      leadsByJourneyVariant: "Kontakty podľa variantu e-mailovej série",
      historicalData: "Historické údaje",
      groupedStats: "Zoskupená štatistika",
      recentActivity: "Nedávna aktivita",
      metadata: "Informácie o prehľade",
      generatedAt: "Čas vytvorenia",
      dataRange: "Rozsah údajov",
      data: "Štatistické údaje",
      campaignName: "Kampaň",
      leadsGenerated: "Kontakty",
      openRate: "Miera otvorenia",
      clickRate: "Miera kliknutí",
      source: "Zdroj",
      qualityScore: "Skóre kvality",
      activityType: "Činnosť",
      email: "E-mail",
      businessName: "Firma",
      timestamp: "Čas",
      status: "Stav",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie štatistík kontaktov sa prihláste",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky na štatistiku",
      },
      server: {
        title: "Chyba servera",
        description:
          "Pri načítavaní štatistík kontaktov nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri získavaní štatistík nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete pri získavaní štatistík",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť štatistiky kontaktov",
      },
      notFound: {
        title: "Žiadne údaje",
        description: "Pre zadané kritériá sa nenašli žiadne štatistické údaje",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vytváraní štatistík nastal konflikt údajov",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Filtre štatistík obsahujú neuložené zmeny",
      },
    },
    success: {
      title: "Vygenerované štatistiky",
      description: "Štatistiky kontaktov sa úspešne načítali",
    },
    widget: {
      title: "Štatistiky kontaktov",
      refresh: "Obnoviť",
      viewAllLeads: "Zobraziť všetky kontakty",
      searchLeads: "Vyhľadať kontakty",
      export: "Export",
      import: "Import",
      batchUpdate: "Hromadná úprava",
      totalLeads: "Počet kontaktov",
      activeLeads: "Aktívne kontakty",
      converted: "Konvertovaný",
      conversionRate: "Miera konverzie",
      openRate: "Miera otvorenia",
      clickRate: "Miera kliknutí",
      unsubscribeRate: "Miera odhlásenia z odberu",
      newThisMonth: "Nové za 30 dní",
      newLeadsTimeline: "Vývoj počtu nových kontaktov",
      today: "Dnes",
      thisWeek: "Tento týždeň",
      thisMonth: "Tento mesiac",
      conversionFunnel: "Konverzný lievik",
      funnelTotalLeads: "Počet kontaktov",
      funnelCampaignRunning: "Kampaň prebieha",
      funnelSignedUp: "Zaregistrovaný",
      funnelSubscriptionConfirmed: "Predplatné potvrdené",
      byStatus: "Podľa stavu",
      clickToFilter: "(kliknutím použijete filter)",
      bySource: "Podľa zdroja",
      byCountry: "Podľa krajiny",
      byCampaignStage: "Podľa fázy kampane",
      topPerformingCampaigns: "Najvýkonnejšie kampane",
      topSources: "Najlepšie zdroje",
      viewAll: "Zobraziť všetky",
      recentActivity: "Nedávna aktivita",
      filters: "Filtre",
      applyFilters: "Použiť filtre",
      openRateSuffix: "% otvorených",
      conversionRateSuffix: "% konverzií",
      emDash: "-",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Vzostupne",
        desc: "Zostupne",
      },
      leadSortField: {
        email: "E-mail",
        businessName: "Názov firmy",
        createdAt: "Dátum vytvorenia",
        updatedAt: "Dátum aktualizácie",
        lastEngagementAt: "Posledná interakcia",
      },
      leadStatusFilter: {
        all: "Všetky",
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
      emailCampaignStageFilter: {
        all: "Všetky",
        notStarted: "Nespustené",
        initial: "Prvé oslovenie",
        followup1: "Nadväzujúci e-mail 1",
        followup2: "Nadväzujúci e-mail 2",
        followup3: "Nadväzujúci e-mail 3",
        nurture: "Budovanie vzťahu",
        reactivation: "Obnovenie aktivity",
      },
      leadSourceFilter: {
        all: "Všetky",
        website: "Webová stránka",
        socialMedia: "Sociálne médiá",
        emailCampaign: "E-mailová kampaň",
        referral: "Odporúčanie",
        csvImport: "Import CSV",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Sledovanie kontaktov",
      tags: {
        tracking: "Sledovanie",
        engagement: "Interakcia",
      },
      post: {
        title: "Zaznamenať interakciu kontaktu",
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
          createdAt: "Čas vytvorenia",
          leadCreated: "Kontakt vytvorený",
          relationshipEstablished: "Vzťah nadviazaný",
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
            description: "Nastala neznáma chyba",
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
        response: {
          success: "Úspech",
          redirectUrl: "Adresa URL presmerovania",
          leadId: "ID kontaktu",
          campaignId: "ID kampane",
          engagementRecorded: "Interakcia zaznamenaná",
          leadStatusUpdated: "Stav kontaktu aktualizovaný",
          isLoggedIn: "Stav prihlásenia",
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
            relationshipEst: "Vzťah nadviazaný",
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
            "Interakcia sa zaznamenala a adresa URL na presmerovanie je pripravená",
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
      },
      error: {
        default: "Pri spracovaní interakcie nastala chyba",
      },
    },
    pixel: {
      category: "Koncový bod API",
      tags: {
        pixel: "Pixel",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "Našli sa už uložené údaje o sledovaní kontaktu",
    },
    component: {
      initialized: "Komponent na sledovanie kontaktu sa spustil",
    },
    error: "Chyba pri sledovaní kontaktov",
    errors: {
      default: "Nastala chyba",
      missingId: "Chýba ID sledovania",
      invalidUrl: "Neplatná adresa URL",
    },
    data: {
      captured: "Údaje o sledovaní kontaktu sa zaznamenali",
      capture: {
        error: "Nepodarilo sa zaznamenať údaje o sledovaní kontaktu",
      },
      retrieve: {
        error: "Údaje o sledovaní kontaktu sa nepodarilo načítať",
      },
      loaded: {
        signup: "Údaje o sledovaní kontaktu sa načítali pri registrácii",
      },
      load: {
        error: {
          noncritical:
            "Nepodarilo sa načítať údaje o sledovaní kontaktu (nekritická chyba)",
        },
      },
      stored: "Údaje o sledovaní kontaktu sa uložili",
      store: {
        error: "Údaje o sledovaní kontaktu sa nepodarilo uložiť",
      },
      cleared: "Údaje o sledovaní kontaktu sa vymazali",
      clear: {
        error: "Nepodarilo sa vymazať údaje o sledovaní kontaktu",
      },
      format: {
        error: "Údaje o sledovaní sa nepodarilo naformátovať",
      },
    },
    params: {
      validate: {
        error: "Nepodarilo sa overiť parametre sledovania",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "Otvorenie e-mailu",
      emailClick: "Kliknutie na odkaz v e-maile",
      websiteVisit: "Návšteva webu",
      formSubmit: "Odoslanie formulára",
      leadAttribution: "Priradenie zdroja kontaktu",
      creditWall: "Kredity sa minuli",
      consentDeclined: "Vek 18+ nepotvrdený",
    },
    leadStatus: {
      new: "Nový",
      pending: "Čaká",
      campaignRunning: "Kampaň prebieha",
      websiteUser: "Používateľ webu",
      newsletterSubscriber: "Odberateľ newslettera",
      inContact: "Oslovený",
      signedUp: "Zaregistrovaný",
      subscriptionConfirmed: "Predplatné potvrdené",
      unsubscribed: "Odhlásený z odberu",
      bounced: "Vrátený e-mail",
      invalid: "Neplatný",
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
    emailStatus: {
      pending: "Čaká",
      sent: "Odoslané",
      delivered: "Doručené",
      opened: "Otvorené",
      clicked: "S kliknutím na odkaz",
      bounced: "Vrátené",
      failed: "Zlyhalo",
      unsubscribed: "Odhlásený z odberu",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    emailJourneyVariantFilter: {
      all: "Všetky",
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    leadSortField: {
      email: "E-mail",
      businessName: "Názov firmy",
      createdAt: "Dátum vytvorenia",
      updatedAt: "Dátum aktualizácie",
      lastEngagementAt: "Posledná interakcia",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Kontakt vytvorený",
      leadUpdated: "Kontakt aktualizovaný",
      emailSent: "E-mail odoslaný",
      emailOpened: "Otvorenie e-mailu",
      emailClicked: "Kliknutie na odkaz v e-maile",
      leadConverted: "Konverzia kontaktu",
      leadUnsubscribed: "Kontakt zrušil odber",
    },
    userAssociation: {
      withUser: "S priradeným používateľom",
      withLead: "S priradeným kontaktom",
      standalone: "Bez priradeného kontaktu a používateľa",
      withBoth: "S priradeným používateľom aj kontaktom",
    },
    deviceType: {
      desktop: "Počítač",
      mobile: "Mobil",
      tablet: "Tablet",
      bot: "Robot",
      unknown: "Neznáme",
    },
    leadSource: {
      website: "Webová stránka",
      socialMedia: "Sociálne médiá",
      emailCampaign: "E-mailová kampaň",
      referral: "Odporúčanie",
      csvImport: "Import CSV",
    },
    leadStatusFilter: {
      all: "Všetky",
      new: "Nové",
      pending: "Čaká",
      campaignRunning: "Kampaň prebieha",
      websiteUser: "Používateľ webu",
      newsletterSubscriber: "Odberateľ newslettera",
      inContact: "Oslovený",
      signedUp: "Zaregistrovaný",
      subscriptionConfirmed: "Predplatné potvrdené",
      unsubscribed: "Odhlásené z odberu",
      bounced: "Vrátený e-mail",
      invalid: "Neplatný",
    },
    emailCampaignStageFilter: {
      all: "Všetky",
      notStarted: "Nespustené",
      initial: "Prvé oslovenie",
      followup1: "Nadväzujúci e-mail 1",
      followup2: "Nadväzujúci e-mail 2",
      followup3: "Nadväzujúci e-mail 3",
      nurture: "Budovanie vzťahu",
      reactivation: "Obnovenie aktivity",
    },
    leadSourceFilter: {
      all: "Všetky",
      website: "Webová stránka",
      socialMedia: "Sociálne médiá",
      emailCampaign: "E-mailová kampaň",
      referral: "Odporúčanie",
      csvImport: "Import CSV",
    },
    batchOperationScope: {
      currentPage: "Aktuálna stránka",
      allPages: "Všetky stránky",
    },
    country: {
      ...regionalCountryNames("sk"),
      de: "Nemecko",
      pl: "Poľsko",
      fr: "Francúzsko",
      global: "Celosvetové",
    },
    language: {
      it: "Taliančina",
      es: "Španielčina",
      sk: "Slovenčina",
      de: "Nemčina",
      pl: "Poľština",
      fr: "Francúzština",
      en: "Angličtina",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Iné",
    },
  },
  error: {
    general: {
      internal_server_error: "Interná chyba servera",
      not_found: "Nenašlo sa",
      unauthorized: "Vyžaduje sa prihlásenie",
      forbidden: "Prístup zamietnutý",
      bad_request: "Neplatná požiadavka",
      validation_error: "Neplatné údaje",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Neplatná požiadavka na hromadnú aktualizáciu",
          },
          server: {
            title: "Chyba servera pri hromadnej aktualizácii kontaktov",
          },
          default: "Nepodarilo sa hromadne aktualizovať kontakty",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Chyba servera pri načítavaní kontaktov",
            detail: "Chyba servera pri načítavaní kontaktov: {{error}}",
          },
          not_found: {
            title: "Kontakty sa nenašli",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Kontakt s touto e-mailovou adresou už existuje",
          },
          server: {
            title: "Chyba servera pri vytváraní kontaktu",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Kontakt sa nenašiel",
          },
          server: {
            title: "Chyba servera pri aktualizácii kontaktu",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Odber sa zrušil",
        },
        error: {
          validation: {
            title: "Neplatná požiadavka na zrušenie odberu",
          },
          server: {
            title: "Chyba servera pri zrušení odberu",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Neplatné údaje o interakcii",
          },
          server: {
            title: "Chyba servera pri zaznamenávaní interakcie",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Chyba servera pri exporte kontaktov",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Chyba servera pri spracovaní kampane",
          },
        },
      },
    },
  },
  countries: {
    ...regionalCountryNames("sk"),
    global: "Globálne",
    de: "Nemecko",
    pl: "Poľsko",
    fr: "Francúzsko",
    us: "Spojené štáty",
  },
  languages: {
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
    hi: "Hindčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
};
