import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Importuj",
    leads: "Leady",
    csv: "CSV",
  },

  category: "Import danych",
  post: {
    title: "Importuj leady",
    titleShort: "Import leadów",
    description: "Importuj leady z pliku CSV",
    form: {
      title: "Konfiguracja importu",
      description: "Skonfiguruj parametry importu leadów",
    },
    file: {
      label: "Plik CSV",
      description: "Zawartość pliku CSV (zakodowana base64)",
      placeholder: "Wklej zawartość CSV zakodowaną base64",
      helpText: "Prześlij plik CSV z danymi leadów",
    },
    fileName: {
      label: "Nazwa pliku",
      description: "Nazwa pliku CSV",
      placeholder: "leads.csv",
      helpText: "Podaj opisową nazwę pliku",
    },
    skipDuplicates: {
      label: "Pomiń duplikaty",
      description: "Pomiń leady z duplikowanymi adresami e-mail",
      helpText: "Włącz aby automatycznie pomijać istniejące adresy e-mail",
    },
    updateExisting: {
      label: "Aktualizuj istniejące",
      description: "Aktualizuj istniejące leady nowymi danymi",
      helpText: "Włącz aby aktualizować istniejące leady zamiast pomijać",
    },
    defaultCountry: {
      label: "Domyślny kraj",
      description: "Domyślny kraj dla leadów bez określonego kraju",
      helpText: "Wybierz domyślny kod kraju",
    },
    defaultLanguage: {
      label: "Domyślny język",
      description: "Domyślny język dla leadów bez określonego języka",
      helpText: "Wybierz domyślny kod języka",
    },
    defaultStatus: {
      label: "Domyślny status",
      description: "Domyślny status dla importowanych leadów",
      helpText: "Wybierz początkowy status dla nowych leadów",
    },
    defaultCampaignStage: {
      label: "Domyślny etap kampanii",
      description: "Domyślny etap kampanii e-mailowej dla importowanych leadów",
      helpText: "Wybierz początkowy etap kampanii",
    },
    defaultSource: {
      label: "Domyślne źródło",
      description: "Domyślna atrybucja źródła dla importowanych leadów",
      helpText: "Wybierz źródło leada do śledzenia",
    },
    useChunkedProcessing: {
      label: "Użyj przetwarzania fragmentami",
      description: "Przetwarzaj duże importy w tle fragmentami",
      helpText: "Włącz dla plików z więcej niż 1000 wierszami",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Liczba wierszy do przetworzenia na partię",
      helpText: "Zalecane: 2000 wierszy na partię",
    },
    response: {
      batchId: "ID partii",
      totalRows: "Całkowita liczba wierszy",
      successfulImports: "Udane importy",
      failedImports: "Nieudane importy",
      duplicateEmails: "Duplikaty e-mail",
      errors: "Błędy importu",
      summary: "Podsumowanie importu",
      isChunkedProcessing: "Przetwarzanie fragmentami",
      jobId: "ID zadania w tle",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry importu lub format CSV",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do importu leadów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla importu leadów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Plik CSV nie został znaleziony lub jest nieprawidłowy",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt danych podczas importu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas importu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas importu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas importu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w formularzu importu",
      },
    },
    success: {
      title: "Import rozpoczęty",
      description: "Import leadów został pomyślnie zainicjowany",
    },
    widget: {
      headerTitle: "Importuj leady z CSV",
      exportTemplateButton: "Eksportuj szablon",
      importGuideTitle: "Przewodnik importu",
      importGuideSubtitle: "Prześlij plik CSV z następującymi kolumnami:",
      importGuideNote:
        "Tylko {{email}} jest wymagany. Wszystkie inne kolumny są opcjonalne i przyjmą domyślne wartości skonfigurowane poniżej.",
      fileRequirementsTitle: "Wymagania pliku",
      fileRequirementFormat:
        "Format: CSV (wartości rozdzielone przecinkami, kodowanie UTF-8)",
      fileRequirementHeader:
        "Pierwszy wiersz musi być wierszem nagłówkowym z nazwami kolumn",
      fileRequirementSize: "Zalecany maksymalny rozmiar: 50 MB na upload",
      fileRequirementChunked:
        "Dla plików większych niż ~5 000 wierszy włącz {{chunkedProcessing}}, aby uniknąć limitów czasowych",
      chunkedProcessingLabel: "Przetwarzanie fragmentami",
      downloadTemplateLink: "Pobierz szablon CSV",
      loadingText: "Importowanie lead\u00f3w\u2026",
      backgroundProcessingTitle: "Przetwarzanie w tle",
      backgroundProcessingNote:
        "Duży import umieszczony w kolejce jako zadanie: {{jobId}}. Przetwarzanie {{totalRows}} wierszy w tle.",
      checkJobStatusButton: "Sprawdź status zadania",
      stopJobButton: "Zatrzymaj zadanie",
      retryFailedButton: "Ponów nieudane",
      statTotalRows: "Wiersze łącznie",
      statImported: "Zaimportowane",
      statDuplicates: "Duplikaty",
      statFailed: "Nieudane",
      viewImportedLeadsButton: "Zobacz zaimportowane leady",
      retryFailedWithCountButton: "Ponów nieudane ({{count}})",
      summaryTitle: "Podsumowanie",
      summaryNewLeads: "Nowe leady",
      summaryUpdated: "Zaktualizowane",
      summarySkipped: "Pominięte",
      successRateLabel: "Wskaźnik sukcesu",
      importErrorsTitle: "{{count}} błędów importu",
      errorRowLabel: "Wiersz {{row}}",
      findLeadButton: "Znajdź lead",
    },
  },
  process: {
    tag: "Przetwarzanie importu",
    post: {
      title: "Przetwarzaj zadania importu",
      titleShort: "Przetwórz import",
      description: "Przetwarzaj oczekujące zadania importu CSV",
      container: {
        title: "Konfiguracja przetwarzania importu",
        description: "Skonfiguruj parametry przetwarzania importu",
      },
      fields: {
        maxJobsPerRun: {
          label: "Maks. zadań na przebieg",
          description: "Maksymalna liczba zadań do przetworzenia na przebieg",
        },
        maxRetriesPerJob: {
          label: "Maks. ponowień na zadanie",
          description: "Maksymalna liczba ponowień na zadanie",
        },
        dryRun: {
          label: "Próbny przebieg",
          description: "Uruchom bez wprowadzania zmian",
        },
        selfTaskId: {
          label: "Własne ID zadania",
          description:
            "Wewnętrzne ID zadania do samoczyszczenia po przetworzeniu",
        },
      },
      response: {
        jobsProcessed: "Przetworzone zadania",
        totalRowsProcessed: "Łącznie przetworzone wiersze",
        successfulImports: "Udane importy",
        failedImports: "Nieudane importy",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp zabroniony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas przetwarzania importów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
      success: {
        title: "Przetwarzanie importu zakończone",
        description: "Zadania importu zostały pomyślnie przetworzone",
      },
    },
  },
  widget: {
    header: {
      title: "Zadania importu",
      newImport: "Nowy import",
    },
    filter: {
      all: "Wszystkie",
      completed: "Zako\u0144czone",
      failed: "Nieudane",
      pending: "Oczekuj\u0105ce",
      running: "W trakcie",
    },
    loading: "Wczytywanie zada\u0144 importu\u2026",
    empty: {
      title: "Nie znaleziono zada\u0144 importu",
      withFilter: "Spr\u00f3buj innego filtru lub rozpocznij nowy import.",
      withoutFilter:
        "Rozpocznij sw\u00f3j pierwszy import, aby zobaczy\u0107 go tutaj.",
      newImport: "Nowy import",
    },
  },
  jobs: {
    jobId: {
      category: "Import danych",
      tags: {
        leads: "Leady",
        management: "Zarządzanie",
      },

      get: {
        title: "Pobierz zadanie importu",
        description: "Pobierz szczegóły konkretnego zadania importu",
        actions: {
          retry: "Ponów",
          stop: "Zatrzymaj",
          viewLeads: "Zobacz leady",
        },
        jobId: {
          label: "ID zadania",
          description: "Unikalny identyfikator zadania importu",
        },
        form: {
          title: "Status zadania importu",
          description: "Bieżący status i postęp zadania importu",
        },
        response: {
          title: "Informacje o zadaniu",
          description: "Bieżące szczegóły zadania importu",
          info: {
            title: "Informacje o zadaniu",
            description: "Podstawowe szczegóły zadania",
          },
          id: {
            content: "ID zadania",
          },
          fileName: {
            content: "Nazwa pliku",
          },
          status: {
            content: "Status zadania",
          },
          progress: {
            title: "Postęp importu",
            description: "Bieżący postęp importu i statystyki",
          },
          totalRows: {
            content: "Łączna liczba wierszy",
          },
          processedRows: {
            content: "Przetworzone wiersze",
          },
          successfulImports: {
            content: "Udane importy",
          },
          failedImports: {
            content: "Nieudane importy",
          },
          duplicateEmails: {
            content: "Zduplikowane e-maile",
          },
          configuration: {
            title: "Konfiguracja zadania",
            description: "Bieżące ustawienia konfiguracji zadania",
          },
          currentBatchStart: {
            content: "Start bieżącej partii",
          },
          batchSize: {
            content: "Rozmiar partii",
          },
          retryCount: {
            content: "Liczba ponowień",
          },
          maxRetries: {
            content: "Maksymalna liczba ponowień",
          },
          error: {
            content: "Komunikat błędu",
          },
          timestamps: {
            title: "Znaczniki czasu zadania",
            description: "Znaczniki czasu cyklu życia zadania",
          },
          createdAt: {
            content: "Utworzono",
          },
          updatedAt: {
            content: "Zaktualizowano",
          },
          startedAt: {
            content: "Rozpoczęto",
          },
          completedAt: {
            content: "Ukończono",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane ID zadania jest nieprawidłowe",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie do przeglądania zadań",
          },
          forbidden: {
            title: "Dostęp zabroniony",
            description: "Nie masz uprawnień do przeglądania tego zadania",
          },
          notFound: {
            title: "Zadanie nie znalezione",
            description: "Nie znaleziono zadania importu o podanym ID",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas pobierania zadania",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt podczas pobierania zadania",
          },
        },
        success: {
          title: "Sukces",
          description: "Zadanie importu zostało pomyślnie pobrane",
        },
      },
      patch: {
        title: "Zaktualizuj zadanie importu",
        description: "Zaktualizuj ustawienia konfiguracji zadania importu",
        jobId: {
          label: "ID zadania",
          description: "Unikalny identyfikator zadania importu",
        },
        form: {
          title: "Zaktualizuj ustawienia zadania",
          description: "Zmodyfikuj konfigurację zadania importu",
        },
        settings: {
          title: "Ustawienia zadania",
          description: "Ustawienia konfiguracji dla zadania importu",
        },
        batchSize: {
          label: "Rozmiar partii",
          description: "Liczba wierszy do przetworzenia w każdej partii",
          placeholder: "100",
        },
        maxRetries: {
          label: "Maksymalna liczba ponowień",
          description:
            "Maksymalna liczba prób ponowienia dla nieudanych wierszy",
          placeholder: "3",
        },
        response: {
          title: "Zaktualizowane informacje o zadaniu",
          description: "Zaktualizowane szczegóły zadania importu",
          info: {
            title: "Informacje o zadaniu",
            description: "Podstawowe szczegóły zadania",
          },
          id: {
            content: "ID zadania",
          },
          fileName: {
            content: "Nazwa pliku",
          },
          status: {
            content: "Status zadania",
          },
          progress: {
            title: "Postęp importu",
            description: "Bieżący postęp importu i statystyki",
          },
          totalRows: {
            content: "Łączna liczba wierszy",
          },
          processedRows: {
            content: "Przetworzone wiersze",
          },
          successfulImports: {
            content: "Udane importy",
          },
          failedImports: {
            content: "Nieudane importy",
          },
          duplicateEmails: {
            content: "Zduplikowane e-maile",
          },
          configuration: {
            title: "Konfiguracja zadania",
            description: "Bieżące ustawienia konfiguracji zadania",
          },
          currentBatchStart: {
            content: "Start bieżącej partii",
          },
          batchSize: {
            content: "Rozmiar partii",
          },
          retryCount: {
            content: "Liczba ponowień",
          },
          maxRetries: {
            content: "Maksymalna liczba ponowień",
          },
          error: {
            content: "Komunikat błędu",
          },
          timestamps: {
            title: "Znaczniki czasu zadania",
            description: "Znaczniki czasu cyklu życia zadania",
          },
          createdAt: {
            content: "Utworzono",
          },
          updatedAt: {
            content: "Zaktualizowano",
          },
          startedAt: {
            content: "Rozpoczęto",
          },
          completedAt: {
            content: "Ukończono",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane dane są nieprawidłowe",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie do aktualizacji zadań",
          },
          forbidden: {
            title: "Dostęp zabroniony",
            description: "Nie masz uprawnień do aktualizacji tego zadania",
          },
          notFound: {
            title: "Zadanie nie znalezione",
            description: "Nie znaleziono zadania importu o podanym ID",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas aktualizacji zadania",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt aktualizacji",
            description:
              "Zadanie zostało zmodyfikowane przez innego użytkownika",
          },
        },
        success: {
          title: "Sukces",
          description: "Zadanie importu zostało pomyślnie zaktualizowane",
        },
      },
      delete: {
        title: "Usuń zadanie importu",
        description: "Usuń konkretne zadanie importu",
        jobId: {
          label: "ID zadania",
          description: "Unikalny identyfikator zadania importu do usunięcia",
        },
        form: {
          title: "Usuń zadanie importu",
          description: "Potwierdź usunięcie zadania importu",
        },
        response: {
          title: "Wynik usunięcia",
          description: "Wynik operacji usunięcia",
          success: {
            content: "Status sukcesu",
          },
          message: {
            content: "Komunikat usunięcia",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane ID zadania jest nieprawidłowe",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie do usuwania zadań",
          },
          forbidden: {
            title: "Dostęp zabroniony",
            description: "Nie masz uprawnień do usunięcia tego zadania",
          },
          notFound: {
            title: "Zadanie nie znalezione",
            description: "Nie znaleziono zadania importu o podanym ID",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas usuwania zadania",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt usuwania",
            description:
              "Nie można usunąć zadania, które jest obecnie przetwarzane",
          },
        },
        success: {
          title: "Sukces",
          description: "Zadanie importu zostało pomyślnie usunięte",
        },
      },
      retry: {
        category: "Import danych",
        tags: {
          leads: "Leady",
          management: "Zarządzanie",
        },

        post: {
          title: "Ponów zadanie importu",
          description: "Ponów nieudane zadanie importu",
          jobId: {
            label: "ID zadania",
            description: "Unikalny identyfikator zadania importu do ponowienia",
          },
          form: {
            title: "Ponów zadanie importu",
            description: "Ponów nieudane zadanie importu",
          },
          response: {
            title: "Wynik ponowienia",
            description: "Wynik operacji ponowienia",
            success: {
              content: "Status sukcesu",
            },
            message: {
              content: "Wiadomość o ponowieniu",
            },
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Podane ID zadania jest nieprawidłowe",
            },
            unauthorized: {
              title: "Brak autoryzacji",
              description: "Wymagana autoryzacja do ponowienia zadań",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description: "Nie masz uprawnień do ponowienia tego zadania",
            },
            notFound: {
              title: "Zadanie nie znalezione",
              description: "Nie znaleziono zadania importu o podanym ID",
            },
            server: {
              title: "Błąd serwera",
              description: "Wystąpił błąd podczas ponowienia zadania",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt ponowienia",
              description:
                "Nie można ponowić zadania, które jest obecnie przetwarzane",
            },
          },
          success: {
            title: "Sukces",
            description: "Zadanie importu zostało pomyślnie ponowione",
          },
        },
        widget: {
          title: "Ponów zadanie importu",
          successMessage: "Ponowienie zadania zostało pomyślnie zainicjowane",
        },
      },
      stop: {
        category: "Import danych",
        tags: {
          leads: "Leady",
          management: "Zarządzanie",
        },

        post: {
          title: "Zatrzymaj zadanie importu",
          description: "Zatrzymaj uruchomione zadanie importu",
          jobId: {
            label: "ID zadania",
            description:
              "Unikalny identyfikator zadania importu do zatrzymania",
          },
          form: {
            title: "Zatrzymaj zadanie importu",
            description: "Zatrzymaj uruchomione zadanie importu",
          },
          response: {
            title: "Wynik zatrzymania",
            description: "Wynik operacji zatrzymania",
            success: {
              content: "Status sukcesu",
            },
            message: {
              content: "Wiadomość o zatrzymaniu",
            },
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Podane ID zadania jest nieprawidłowe",
            },
            unauthorized: {
              title: "Brak autoryzacji",
              description: "Wymagana autoryzacja do zatrzymania zadań",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description: "Nie masz uprawnień do zatrzymania tego zadania",
            },
            notFound: {
              title: "Zadanie nie znalezione",
              description: "Nie znaleziono zadania importu o podanym ID",
            },
            server: {
              title: "Błąd serwera",
              description: "Wystąpił błąd podczas zatrzymywania zadania",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt zatrzymania",
              description:
                "Nie można zatrzymać zadania, które nie jest obecnie przetwarzane",
            },
          },
          success: {
            title: "Sukces",
            description: "Zadanie importu zostało pomyślnie zatrzymane",
          },
        },
        widget: {
          title: "Zatrzymaj zadanie importu",
          successMessage: "Zadanie zostało pomyślnie zatrzymane",
        },
      },
      widget: {
        status: {
          title: "Status zadania importu",
          loadingJobStatus: "Ładowanie statusu zadania…",
          totalRows: "Łączna liczba wierszy",
          processed: "Przetworzone",
          imported: "Zaimportowane",
          failed: "Nieudane",
          duplicates: "Duplikaty",
          progress: "Postęp",
          configurationTitle: "Konfiguracja",
          batchSize: "Rozmiar partii",
          batchStart: "Start partii",
          retries: "Ponowienia",
          timestampsTitle: "Znaczniki czasu",
          created: "Utworzono",
          started: "Rozpoczęto",
          completed: "Ukończono",
          jobStatus: {
            enums: {
              csvImportJobStatus: {
                pending: "Oczekujące",
                processing: "W trakcie przetwarzania",
                completed: "Ukończone",
                failed: "Nieudane",
              },
            },
          },
        },
        retry: {
          title: "Powtórz zadanie importu",
          loadingRetrying: "Powtarzanie zadania…",
          successMessage: "Zadanie powtórzone pomyślnie",
          failureMessage: "Powtarzanie nieudane",
          viewJobStatus: "Zobacz status zadania",
          viewLeads: "Zobacz leady",
        },
        stop: {
          title: "Zatrzymaj zadanie importu",
          loadingStopping: "Zatrzymywanie zadania…",
          successMessage: "Zadanie zatrzymane pomyślnie",
          failureMessage: "Zatrzymanie nieudane",
          viewLeads: "Zobacz leady",
          startNewImport: "Rozpocznij nowy import",
        },
      },
    },
  },
  status: {
    category: "Import danych",
    tags: {
      import: "Importuj",
      jobs: "Zadania",
      list: "Lista",
    },

    get: {
      title: "Status Zadań Importu",
      titleShort: "Zadania importu",
      description: "Wyświetl i monitoruj zadania importu CSV",
      actions: {
        refresh: "Odśwież",
        refreshing: "Odświeżanie...",
      },
      form: {
        title: "Filtry Zadań",
        description: "Filtruj zadania importu według statusu i paginacji",
      },
      filters: {
        title: "Filtry",
        description: "Opcje filtrowania dla zadań importu",
      },
      status: {
        label: "Status Zadania",
        description: "Filtruj według statusu zadania",
        placeholder: "Wybierz status",
      },
      limit: {
        label: "Wyników na Stronę",
        description: "Liczba zadań do zwrócenia",
        placeholder: "50",
      },
      offset: {
        label: "Przesunięcie Strony",
        description: "Liczba zadań do pominięcia",
        placeholder: "0",
      },
      response: {
        title: "Zadania Importu",
        description: "Lista zadań importu z ich aktualnym statusem",
        statusCounts: "Liczniki statusów",
        items: {
          title: "Lista Zadań",
        },
      },
      errors: {
        validation: {
          title: "Błąd Walidacji",
          description: "Nieprawidłowe parametry filtrowania",
        },
        unauthorized: {
          title: "Brak Autoryzacji",
          description: "Wymagana autoryzacja do wyświetlania zadań importu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla zadań importu",
        },
        notFound: {
          title: "Nie Znaleziono",
          description: "Nie znaleziono zadań importu",
        },
        server: {
          title: "Błąd Serwera",
          description: "Wewnętrzny błąd serwera podczas pobierania zadań",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd Sieci",
          description: "Błąd sieci podczas pobierania zadań",
        },
        unsavedChanges: {
          title: "Niezapisane Zmiany",
          description: "Są niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
      },
      success: {
        title: "Pobrano Zadania",
        description: "Lista zadań importu została pobrana pomyślnie",
      },
    },
    widget: {
      status: {
        pending: "Oczekujące",
        running: "W toku",
        completed: "Zakończone",
        failed: "Nieudane",
        stopped: "Zatrzymane",
      },
      filter: {
        all: "Wszystkie",
        pending: "Oczekujące",
        running: "W toku",
        completed: "Zakończone",
        failed: "Nieudane",
      },
      progress: {
        rows: "wierszy",
      },
      job: {
        total: "Łącznie:",
        processed: "Przetworzono:",
        ok: "OK:",
        fail: "Błąd:",
        created: "Utworzono:",
        done: "Gotowe:",
      },
      header: {
        title: "Zadania Importu",
        newImport: "Nowy Import",
      },
      loading: "Ładowanie zadań importu\u2026",
      empty: {
        title: "Nie znaleziono zadań importu",
        withFilter: "Spróbuj innego filtra lub rozpocznij nowy import.",
        withoutFilter: "Rozpocznij pierwszy import, aby go tutaj zobaczyć.",
        newImport: "Nowy Import",
      },
    },
  },
  csv: {
    post: {
      title: "Importuj Dane CSV",
      description:
        "Importuj dane z plików CSV z inteligentnym przetwarzaniem i walidacją",
      form: {
        title: "Konfiguracja Importu CSV",
        description:
          "Skonfiguruj ustawienia importu CSV dla optymalnych rezultatów",
      },
      fileSection: {
        title: "Wgrywanie Pliku",
        description: "Wybierz plik CSV i określ domenę docelową",
      },
      file: {
        label: "Plik CSV",
        description: "Wybierz plik CSV do wgrania (max 10MB)",
        placeholder: "Wybierz plik CSV...",
        helpText:
          "Obsługiwany format: CSV z wartościami oddzielonymi przecinkami. Pierwszy wiersz powinien zawierać nagłówki kolumn.",
      },
      fileName: {
        label: "Nazwa Pliku",
        description: "Nazwa tego importu (dla referencji)",
        placeholder: "np. Import Leadów Styczeń 2024",
      },
      domain: {
        label: "Domena Importu",
        description: "Jaki typ danych importujesz?",
        placeholder: "Wybierz typ danych...",
      },
      processingSection: {
        title: "Opcje Przetwarzania",
        description: "Skonfiguruj sposób przetwarzania twoich danych",
      },
      skipDuplicates: {
        label: "Pomiń Duplikaty",
        description: "Pomiń rekordy z duplikowanymi adresami email",
        helpText:
          "Zalecane: Zapobiega importowaniu tego samego kontaktu dwukrotnie",
      },
      updateExisting: {
        label: "Aktualizuj Istniejące",
        description: "Aktualizuj istniejące rekordy nowymi danymi z CSV",
        helpText:
          "Jeśli niezaznaczone, istniejące rekordy pozostaną niezmienione",
      },
      useChunkedProcessing: {
        label: "Przetwarzanie w Tle",
        description: "Przetwarzaj duże pliki w tle",
        helpText: "Zalecane dla plików z więcej niż 500 rekordami",
      },
      batchSize: {
        label: "Rozmiar Partii",
        description: "Liczba rekordów przetwarzanych jednocześnie",
        placeholder: "100",
        helpText: "Mniejsze partie są stabilniejsze, większe szybsze",
      },
      defaultsSection: {
        title: "Wartości Domyślne (Opcjonalne)",
        description: "Ustaw domyślne wartości dla rekordów bez tych informacji",
      },
      defaultCountry: {
        label: "Domyślny Kraj",
        description: "Kraj dla rekordów bez lokalizacji",
        placeholder: "Wybierz kraj...",
      },
      defaultLanguage: {
        label: "Domyślny Język",
        description: "Język dla rekordów bez preferencji językowych",
        placeholder: "Wybierz język...",
      },
      response: {
        title: "Wyniki Importu",
        description: "Podsumowanie operacji importu CSV",
        basicResults: {
          title: "Podstawowe Wyniki",
          description: "Podstawowe statystyki importu",
        },
        batchId: {
          label: "ID Partii",
        },
        totalRows: {
          label: "Całkowita liczba wierszy",
        },
        isChunkedProcessing: {
          label: "Przetwarzanie w tle",
        },
        jobId: {
          label: "ID Joba",
        },
        statistics: {
          title: "Statystyki Importu",
          description: "Szczegółowy podział operacji importu",
        },
        successfulImports: {
          label: "Udane Importy",
        },
        failedImports: {
          label: "Nieudane Importy",
        },
        duplicateEmails: {
          label: "Zduplikowane E-maile",
        },
        processingTimeMs: {
          label: "Czas przetwarzania (ms)",
        },
        summary: {
          title: "Podsumowanie Importu",
          description: "Przegląd wyników importu",
        },
        newRecords: {
          label: "Nowe Rekordy",
        },
        updatedRecords: {
          label: "Zaktualizowane Rekordy",
        },
        skippedDuplicates: {
          label: "Pominięte Duplikaty",
        },
        errors: {
          title: "Szczegóły Błędów",
          row: {
            label: "Wiersz",
          },
          email: {
            label: "E-mail",
          },
          error: {
            label: "Błąd",
          },
        },
        nextSteps: {
          title: "Następne Kroki",
          item: {
            label: "Następny Krok",
          },
        },
      },
      errors: {
        validation: {
          title: "Nieprawidłowe Dane Importu",
          description: "Sprawdź plik CSV i ustawienia",
          emptyFile: "Zawartość pliku CSV jest wymagana",
          emptyFileName: "Podaj nazwę tego importu",
          invalidDomain: "Wybierz prawidłową domenę importu",
          invalidBatchSize: "Rozmiar partii musi być między 10 a 1000",
          fileTooLarge:
            "Rozmiar pliku przekracza limit 10MB. Rozważ przetwarzanie w tle.",
        },
        unauthorized: {
          title: "Dostęp Zabroniony",
          description: "Nie masz uprawnień do importowania danych",
        },
        fileTooLarge: {
          title: "Plik Za Duży",
          description: "Wybrany plik przekracza maksymalny limit rozmiaru 10MB",
        },
        server: {
          title: "Import Nieudany",
          description:
            "Wystąpił błąd podczas przetwarzania importu. Spróbuj ponownie.",
        },
        network: {
          title: "Błąd Sieci",
          description: "Połączenie sieciowe nie powiodło się podczas importu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wykonania tego importu",
        },
        notFound: {
          title: "Nie Znaleziono",
          description: "Zasób importu nie został znaleziony",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane Zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt Danych",
          description: "Wystąpił konflikt z istniejącymi danymi",
        },
      },
      success: {
        title: "Import Udany",
        description: "Twoje dane CSV zostały pomyślnie zaimportowane",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "Oczekujący",
        description: "Job czeka na przetworzenie",
      },
      processing: {
        label: "Przetwarzanie",
        description: "Job jest obecnie przetwarzany",
      },
      completed: {
        label: "Zakończony",
        description: "Job zakończony pomyślnie",
      },
      failed: {
        label: "Nieudany",
        description: "Job napotkał błąd",
      },
      cancelled: {
        label: "Anulowany",
        description: "Job został anulowany przez użytkownika",
      },
      paused: {
        label: "Wstrzymany",
        description: "Przetwarzanie joba jest tymczasowo wstrzymane",
      },
    },
    domain: {
      leads: {
        label: "Leady",
        description: "Potencjalni klienci i kontakty biznesowe",
      },
      contacts: {
        label: "Kontakty",
        description: "Ogólne informacje kontaktowe i książka adresowa",
      },
      businessData: {
        label: "Dane Biznesowe",
        description: "Informacje o firmach i profile biznesowe",
      },
      emails: {
        label: "Listy Email",
        description: "Listy marketingu emailowego i kampanie",
      },
      users: {
        label: "Użytkownicy",
        description: "Użytkownicy systemu i informacje o kontach",
      },
      templates: {
        label: "Szablony",
        description: "Szablony email i treści",
      },
    },
    format: {
      csv: {
        label: "Plik CSV",
        description: "Wartości oddzielone przecinkami (najczęstsze)",
      },
      xlsx: {
        label: "Plik Excel",
        description: "Arkusz kalkulacyjny Microsoft Excel",
      },
      json: {
        label: "Plik JSON",
        description: "Dane JavaScript Object Notation",
      },
      tsv: {
        label: "Plik TSV",
        description: "Wartości oddzielone tabulatorami",
      },
    },
    processing: {
      immediate: {
        label: "Przetwórz Teraz",
        description: "Przetwórz plik natychmiast (najszybsze)",
      },
      background: {
        label: "W Tle",
        description: "Przetwarzaj w tle (dla dużych plików)",
      },
      scheduled: {
        label: "Zaplanuj Później",
        description: "Zaplanuj przetwarzanie na określony czas",
      },
    },
    errorType: {
      validation: {
        label: "Błąd Walidacji",
        description: "Dane nie spełniają wymaganego formatu lub zasad",
      },
      duplicate: {
        label: "Duplikat Danych",
        description: "Rekord już istnieje w systemie",
      },
      format: {
        label: "Błąd Formatu",
        description: "Format pliku jest nieprawidłowy lub uszkodzony",
      },
      processing: {
        label: "Błąd Przetwarzania",
        description: "Błąd wystąpił podczas przetwarzania danych",
      },
      system: {
        label: "Błąd Systemu",
        description: "Wewnętrzny błąd systemu",
      },
    },
    batchSize: {
      small: {
        label: "Mały (50)",
        description: "Najlepszy do testów lub małych importów",
      },
      medium: {
        label: "Średni (100)",
        description: "Zalecany dla większości importów",
      },
      large: {
        label: "Duży (250)",
        description: "Dobry dla dużych plików z prostymi danymi",
      },
      xlarge: {
        label: "Bardzo Duży (500)",
        description: "Dla bardzo dużych plików (zaawansowani użytkownicy)",
      },
    },
  },
  nextSteps: {
    reviewErrors: "Przejrzyj szczegóły błędów, aby zrozumieć co poszło nie tak",
    checkDuplicates: "Rozważ dostosowanie ustawień obsługi duplikatów",
    reviewLeads: "Przejrzyj zaimportowane leady w sekcji zarządzania leadami",
    startCampaign: "Rozważ rozpoczęcie kampanii email z nowymi leadami",
    reviewContacts: "Przejrzyj zaimportowane kontakty w sekcji kontaktów",
    organizeContacts: "Uporządkuj kontakty w grupy lub tagi",
    reviewImported: "Przejrzyj zaimportowane dane w odpowiedniej sekcji",
    monitorProgress: "Monitoruj postęp w historii jobów",
    checkJobsList: "Sprawdź listę jobów dla szczegółowych aktualizacji statusu",
  },
  errors: {
    cancel: {
      server: "Nie udało się anulować joba importu",
    },
    retry: {
      server: "Nie udało się ponowić joba importu",
    },
    delete: {
      server: "Nie udało się usunąć joba importu",
    },
    status: {
      server: "Nie udało się pobrać statusu joba",
    },
  },
  error: {
    default: "Wystąpił błąd",
  },
  enums: {
    csvImportJobStatus: {
      pending: "Oczekujący",
      processing: "W trakcie",
      completed: "Zakończony",
      failed: "Nieudany",
    },
    csvImportJobAction: {
      retry: "Ponów",
      delete: "Usuń",
      stop: "Zatrzymaj",
    },
    importMode: {
      createOnly: "Tylko tworzenie",
      updateOnly: "Tylko aktualizacja",
      createOrUpdate: "Tworzenie lub aktualizacja",
      skipDuplicates: "Pomiń duplikaty",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "Natychmiastowe",
      chunked: "Fragmentami",
      scheduled: "Zaplanowane",
    },
    importErrorType: {
      validationError: "Błąd walidacji",
      duplicateEmail: "Duplikat e-maila",
      invalidFormat: "Niepoprawny format",
      missingRequiredField: "Brak wymaganego pola",
      processingError: "Błąd przetwarzania",
      systemError: "Błąd systemu",
    },
    batchProcessingStatus: {
      pending: "Oczekujący",
      processing: "W trakcie",
      completed: "Zakończony",
      failed: "Nieudany",
      retrying: "Ponowienie",
    },
    importPriority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny",
    },
    importSource: {
      webUpload: "Upload web",
      apiUpload: "Upload API",
      scheduledImport: "Import zaplanowany",
      bulkOperation: "Operacja masowa",
    },
    csvDelimiter: {
      comma: "Przecinek",
      semicolon: "Średnik",
      tab: "Tabulator",
      pipe: "Kreska pionowa",
    },
    importValidationLevel: {
      strict: "Ścisły",
      moderate: "Umiarkowany",
      lenient: "Łagodny",
    },
    importNotificationType: {
      email: "E-mail",
      inApp: "W aplikacji",
      webhook: "Webhook",
      none: "Brak",
    },
    leadStatus: {
      new: "Nowy",
      pending: "Oczekujący",
      campaignRunning: "Kampania aktywna",
      websiteUser: "Użytkownik strony",
      newsletterSubscriber: "Subskrybent newslettera",
      inContact: "W kontakcie",
      signedUp: "Zarejestrowany",
      subscriptionConfirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Odrzucony",
      invalid: "Nieprawidłowy",
    },
    emailCampaignStage: {
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Pielęgnowanie",
      reactivation: "Reaktywacja",
    },
    leadSource: {
      website: "Strona WWW",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mail",
      referral: "Polecenie",
      csvImport: "Import CSV",
    },
  },
  countries: {
    global: "Globalny",
    de: "Niemcy",
    pl: "Polska",
    us: "Stany Zjednoczone",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
  },
};
