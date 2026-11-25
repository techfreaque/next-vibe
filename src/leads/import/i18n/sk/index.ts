import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Import",
    leads: "Kontakty",
    csv: "CSV",
  },

  category: "Import údajov",
  post: {
    title: "Importovať kontakty",
    titleShort: "Importovať kontakty",
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
        title: "Konflikt údajov",
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
      fileRequirementSize: "Odporúčaná maximálna veľkosť jedného súboru: 50 MB",
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
            description:
              "Nie je možné odstrániť úlohu, ktorá sa práve spracováva",
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
      titleShort: "Úlohy importu",
      description: "Zobraziť a sledovať úlohy importu CSV",
      actions: {
        refresh: "Obnoviť",
        refreshing: "Obnovuje sa…",
      },
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
        statusCounts: "Počty podľa stavu",
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
        title: "Odoslať súbor",
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
        helpText: "Odporúčané. Zabráni opakovanému importu rovnakého kontaktu.",
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
        placeholder: "Vyberte krajinu...",
      },
      defaultLanguage: {
        label: "Predvolený jazyk",
        description: "Jazyk pre záznamy bez preferencie jazyka",
        placeholder: "Vyberte jazyk...",
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
          emptyFile: "Požaduje sa obsah súboru CSV",
          emptyFileName: "Zadajte názov importu",
          invalidDomain: "Vyberte platný typ importovaných údajov",
          invalidBatchSize: "Veľkosť dávky musí byť od 10 do 1 000",
          fileTooLarge:
            "Súbor prekračuje limit 10 MB. Zvážte spracovanie na pozadí.",
        },
        unauthorized: {
          title: "Prístup zamietnutý",
          description: "Nemáte povolenie na import dát",
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
          description: "Nemáte povolenie vykonať tento import",
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
        description: "Tabuľky Microsoft Excel",
      },
      json: {
        label: "Súbor JSON",
        description: "Údaje vo formáte JavaScript Object Notation",
      },
      tsv: {
        label: "TSV súbor",
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
      missingRequiredField: "Chýbajúce požadované pole",
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
      moderate: "Stredná",
      lenient: "Mierne",
    },
    importNotificationType: {
      email: "E-mail",
      inApp: "V aplikácii",
      webhook: "Webhook",
      none: "Žiadne",
    },
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
  countries: {
    ...regionalCountryNames("sk"),
    global: "Celosvetové",
    de: "Nemecko",
    pl: "Poľsko",
    fr: "Francúzsko",
    us: "Spojené štáty",
  },
  languages: {
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
};
