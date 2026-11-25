import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kontakty",
  tags: {
    leads: "Kontakty",
    batch: "Hromadné operácie",
  },

  patch: {
    title: "Hromadná úprava",
    titleShort: "Hromadná úprava",
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
      label: "Najviac záznamov",
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
    titleShort: "Hromadné odstránenie",
    description: "Odstráni naraz kontakty zodpovedajúce filtru",
    form: {
      title: "Nastavenie hromadného odstránenia",
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
      description: "Zobrazí náhľad bez skutočného odstránenia záznamov",
    },
    maxRecords: {
      label: "Najviac záznamov",
      description: "Najvyšší počet záznamov na odstránenie",
    },
    response: {
      title: "Výsledok odstránenia",
      description: "Výsledné údaje hromadného odstránenia",
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
        "Upozornenie: Počet natrvalo odstránených kontaktov bude {{count}}",
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
      website: "Web",
      socialMedia: "Sociálne siete",
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
};
