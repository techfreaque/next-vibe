import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // === GŁÓWNA KATEGORIA ===
  category: "Import Danych",

  // === CSV IMPORT ENDPOINT ===
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

      // === SEKCJA WGRYWANIA PLIKU ===
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

      // === SEKCJA PRZETWARZANIA ===
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

      // === SEKCJA WARTOŚCI DOMYŚLNYCH ===
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

      // === ODPOWIEDŹ ===
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
          item: {
            label: "Następne Kroki",
          },
        },
      },

      // === BŁĘDY ===
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

  // === ENDPOINT LISTY JOBÓW ===
  jobs: {
    get: {
      title: "Historia Jobów Importu",
      description: "Przeglądaj i zarządzaj swoimi jobami importu",

      form: {
        title: "Filtruj Joby Importu",
        description: "Filtruj joby według statusu, daty lub innych kryteriów",
      },

      status: {
        label: "Status Joba",
        description: "Filtruj według aktualnego statusu joba",
        placeholder: "Wszystkie statusy",
      },

      limit: {
        label: "Wyników Na Stronę",
        description: "Liczba jobów do pokazania na stronę",
        placeholder: "20",
      },

      offset: {
        label: "Przesunięcie Strony",
        description: "Pomiń tyle wyników (dla paginacji)",
        placeholder: "0",
      },

      response: {
        title: "Joby Importu",
        description: "Historia twoich jobów importu i aktualny status",
      },

      errors: {
        unauthorized: {
          title: "Dostęp Zabroniony",
          description: "Nie masz uprawnień do przeglądania jobów importu",
        },
        server: {
          title: "Ładowanie Jobów Nieudane",
          description: "Nie można pobrać historii jobów importu",
        },
      },

      success: {
        title: "Joby Załadowane",
        description: "Pomyślnie pobrano historię jobów importu",
      },
    },
  },

  // === TŁUMACZENIA ENUM ===
  enum: {
    // === STATUS JOBA ===
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

    // === DOMENY IMPORTU ===
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

    // === FORMATY PLIKÓW ===
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

    // === TRYBY PRZETWARZANIA ===
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

    // === TYPY BŁĘDÓW ===
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

    // === PRESETY ROZMIARU PARTII ===
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

  // === NASTĘPNE KROKI ===
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

  // === KOMUNIKATY AKCJI ===
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

  // === TAGI ===
  tags: {
    csv: "CSV",
    upload: "Wgrywanie",
    batch: "Przetwarzanie Partiami",
    jobs: "Joby",
    status: "Status",
    history: "Historia",
    statistics: "Statystyki",
    analytics: "Analityka",
  },
  error: {
    default: "Wystąpił błąd",
  },
};
