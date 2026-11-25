import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Import údajov",
  tags: {
    leads: "Kontakty",
    management: "Správa",
  },

  get: {
    title: "Načítať úlohu importu",
    titleShort: "Úloha importu",
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
        description: "Poskytnuté ID úlohy je neplatné",
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
    titleShort: "Upraviť úlohu importu",
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
    titleShort: "Odstrániť úlohu importu",
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
        description: "Poskytnuté ID úlohy je neplatné",
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
        description: "Nie je možné odstrániť úlohu, ktorá sa práve spracováva",
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
          description: "Poskytnuté ID úlohy je neplatné",
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
          description: "Poskytnuté ID úlohy je neplatné",
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
      jobId: "ID úlohy",
      loadingJobStatus: "Načítava sa stav úlohy…",
      totalRows: "Celkový počet riadkov",
      processed: "Spracované",
      imported: "Importované",
      failed: "Zlyhalo",
      duplicates: "Duplikáty",
      progress: "Priebeh",
      configurationTitle: "Nastavenie",
      batchSize: "Veľkosť dávky",
      batchStart: "Začiatok šarže",
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
      successMessage: "Jób úspešne vyskúšal",
      failureMessage: "Zopakovať neúspešné",
      viewJobStatus: "Zobraziť stav úlohy",
      viewLeads: "Zobraziť kontakty",
    },
    stop: {
      title: "Zastaviť úlohu importu",
      loadingStopping: "Zastaviť prácu...",
      successMessage: "Jób sa úspešne zastavil",
      failureMessage: "Úlohu sa nepodarilo zastaviť",
      viewLeads: "Zobraziť kontakty",
      startNewImport: "Spustiť nový import",
    },
  },
};
