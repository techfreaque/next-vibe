import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Niečo sa pokazilo",
      defaultMessage: "Vyskytla sa neočakávaná chyba",
      errorDetails: "Podrobnosti o chybe",
    },
    error: {
      title: "Chyba",
    },
    chart: {
      noDataAvailable: "Údaje nie sú k dispozícii",
      noDataToDisplay: "Žiadne údaje na zobrazenie",
    },
    codeQualityFiles: {
      affectedFiles: "Dotknuté súbory",
      andMoreFiles: "… počet ďalších súborov: {{count}}",
    },
    codeQualityList: {
      noIssues: "Nenašli sa žiadne problémy",
    },
    codeQualitySummary: {
      errors: "Chyby",
      files: "Súbory",
      issues: "Problémy",
      of: "z",
      summary: "Súhrn",
    },
    container: {
      noContent: "Žiadny obsah",
    },
    endpointRenderer: {
      cancel: "Zrušiť",
      submit: "Odoslať",
      submitting: "Odosiela sa…",
    },
    formField: {
      requiresContext: "Toto pole vyžaduje kontext",
    },
    markdown: {
      noContent: "Žiadny obsah",
    },
    pagination: {
      itemsPerPage: "Položiek na stránku",
      page: "Strana",
      showing: "Zobrazené",
    },
    rangeSlider: {
      max: "Maximum",
      min: "Minimum",
    },
    toolCall: {
      creditsUsed_one: "Spotrebovaný kredit: {{count}}",
      creditsUsed_other: "Spotrebované kredity: {{count}}",
      actions: {
        confirm: "Potvrdiť",
        deny: "Zamietnuť",
        runInBackground: "Spustiť na pozadí",
        resumeWhenDone: "Pokračovať po dokončení",
      },
      status: {
        complete: "Dokončené",
        confirmed: "Potvrdené",
        confirmedWakeUp: "Potvrdené (prebudiť agenta)",
        deferred: "Odložené",
        denied: "Zamietnuté",
        deniedWakeUp: "Zamietnuté (prebudiť agenta)",
        error: "Chyba",
        executing: "Prebieha",
        pendingCancellation: "Čaká na zrušenie",
        pendingConfirmation: "Čaká na potvrdenie",
        sentToBackground: "Odoslané na pozadie",
        waitingForConfirmation: "Čaká sa na potvrdenie",
        waitingForConfirmationWakeUp: "Čaká sa na potvrdenie (prebudiť agenta)",
        waitingForRemote: "Čaká sa na vzdialenú inštanciu",
        wakeUpBackground: "Prebudiť agenta na pozadí",
      },
      messages: {
        confirmationRequired: "Vyžaduje sa potvrdenie",
        confirmationRequiredWakeUp: "Vyžaduje sa potvrdenie (prebudiť agenta)",
        deferredResult: "Odložený výsledok",
        errorLabel: "Chyba",
        executingTool: "Nástroj sa spúšťa…",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Zadajte telefónne číslo",
        required: "Povinné",
        selectDate: "Vyberte dátum",
        openCalendar: "Otvorte kalendár",
        startDate: "Dátum začiatku",
        endDate: "Dátum konca",
        decreaseValue: "Znížte hodnotu",
        increaseValue: "Zvýšte hodnotu",
        unknownFieldType: "Neznámy typ poľa",
      },
      entityPicker: {
        change: "Zmeniť",
        loading: "Načítava sa…",
        noItems: "Nenašli sa žiadne položky",
        required: "Povinné",
        select: "Vybrať…",
        selectLabel: "Vybrať: {{label}}",
        useToFind: "Nájdete cez {{alias}}",
      },
      markdownTextarea: {
        edit: "Upraviť",
        preview: "Ukážka",
        toolbar: {
          blockquote: "Citát",
          bold: "Tučné písmo",
          bulletList: "Zoznam s odrážkami",
          code: "Kód",
          heading1: "Nadpis 1",
          heading2: "Nadpis 2",
          heading3: "Nadpis 3",
          horizontalRule: "Vodorovná čiara",
          italic: "Kurzíva",
          link: "Odkaz",
          linkPrompt: "Zadajte adresu URL",
          orderedList: "Číslovaný zoznam",
          strike: "Prečiarknuté písmo",
        },
      },
    },
  },
  localstorage: {
    noCallback: "Operácii localStorage chýba spätné volanie",
  },
  apiUtils: {
    errors: {
      // Bare labels - kept placeholder-free for generic rendering.
      http_error: "Chyba HTTP",
      validation_error: "Chyba overenia údajov",
      internal_error: "Interná chyba",
      auth_required: "Vyžaduje sa prihlásenie",
      missingUrlParam: "Pre {{path}} chýba parameter URL „{{param}}“",
      httpStatus: "Požiadavka na {{url}} zlyhala so stavom {{status}}",
      responseValidation: "Odpoveď servera neprešla overením: {{error}}",
      malformedResponse: "Odpoveď z {{url}} má nesprávny formát",
      recordTimeout: "Načítanie záznamu trvá príliš dlho. Skúste to znova.",
      requestFailed: "Požiadavka na {{path}} zlyhala: {{error}}",
      /**
       * `reason` is the endpoint's own declared error-type description, already
       * translated in its scope - this frame only adds the where and the cause.
       */
      endpointFailed: "{{reason}} ({{path}}): {{error}}",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Zmenu sa nepodarilo uložiť",
        },
        validation_error: {
          title: "Chyba overenia údajov",
          detail: "Formulár neprešiel overením: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Chyba siete vo formulári {{formId}}: {{error}}",
      validation_failed: "Overenie zlyhalo",
      validationFailedDetail:
        "Overenie údajov vo formulári {{formId}} zlyhalo: {{error}}",
    },
  },
  store: {
    errors: {
      validation_failed: "Overenie zlyhalo",
      request_failed: "Požiadavka zlyhala",
      mutation_failed: "Zmenu sa nepodarilo uložiť",
      unexpected_failure: "Neočakávaná chyba",
      refetch_failed: "Údaje sa nepodarilo znova načítať",
    },
    status: {
      loading_data: "Načítavajú sa údaje…",
      cached_data: "Používajú sa údaje z vyrovnávacej pamäte",
      success: "Hotovo",
      mutation_pending: "Čaká sa na uloženie zmeny…",
      mutation_success: "Zmena sa uložila",
    },
  },
};
