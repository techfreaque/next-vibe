import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    dateRangePreset: {
      today: "Dzisiaj",
      yesterday: "Wczoraj",
      last7Days: "Ostatnie 7 dni",
      last30Days: "Ostatnie 30 dni",
      last90Days: "Ostatnie 90 dni",
      thisWeek: "Ten tydzień",
      lastWeek: "Ostatni tydzień",
      thisMonth: "Ten miesiąc",
      lastMonth: "Ostatni miesiąc",
      thisQuarter: "Ten kwartał",
      lastQuarter: "Ostatni kwartał",
      thisYear: "Ten rok",
      lastYear: "Ostatni rok",
      custom: "Niestandardowy",
    },
    timePeriod: {
      hour: "Godzina",
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      year: "Rok",
    },
    chartDataField: {
      count: "Łączna liczba",
      completed: "Zakończone",
      cancelled: "Anulowane",
      noShow: "Nieobecność",
    },
    chartType: {
      line: "Wykres liniowy",
      bar: "Wykres słupkowy",
      area: "Wykres obszarowy",
      pie: "Wykres kołowy",
      donut: "Wykres pierścieniowy",
    },
  },
  get: {
    title: "Statystyki konsultacji",
    description: "Wyświetl kompleksowe analizy konsultacji i raporty",
    container: {
      title: "Panel statystyk",
      description:
        "Analizuj dane konsultacji z zaawansowanymi opcjami filtrowania i wizualizacji",
    },

    // Request field translations
    dateRangePreset: {
      label: "Wstępnie ustawiony zakres dat",
      description: "Wybierz predefiniowany zakres dat do filtrowania",
      placeholder: "Wybierz wstępnie ustawiony zakres dat",
    },
    status: {
      label: "Status konsultacji",
      description: "Filtruj według statusu konsultacji",
      placeholder: "Wybierz filtr statusu",
    },
    outcome: {
      label: "Wynik konsultacji",
      description: "Filtruj według wyniku konsultacji",
      placeholder: "Wybierz filtr wyniku",
    },
    consultationType: {
      label: "Typ konsultacji",
      description: "Filtruj według typu konsultacji",
      placeholder: "Wybierz typ konsultacji",
    },
    timePeriod: {
      label: "Okres czasu",
      description: "Wybierz okres czasu do grupowania danych",
      placeholder: "Wybierz okres czasu",
    },
    chartType: {
      label: "Typ wykresu",
      description: "Wybierz typ wykresu wizualizacji",
      placeholder: "Wybierz typ wykresu",
    },
    userId: {
      label: "ID użytkownika",
      description: "Filtruj według konkretnego ID użytkownika",
      placeholder: "Wprowadź ID użytkownika",
    },
    leadId: {
      label: "ID leada",
      description: "Filtruj według konkretnego ID leada",
      placeholder: "Wprowadź ID leada",
    },
    hasUserId: {
      label: "Ma ID użytkownika",
      description: "Filtruj konsultacje które mają powiązanego użytkownika",
    },
    hasLeadId: {
      label: "Ma ID leada",
      description: "Filtruj konsultacje które mają powiązanego leada",
    },
    groupBy: {
      label: "Grupuj według",
      description: "Grupuj statystyki według pola",
      placeholder: "Wybierz pole grupowania",
      options: {
        status: "Status",
        outcome: "Wynik",
        type: "Typ",
        consultant: "Konsultant",
        date: "Data",
      },
    },

    // Response field translations
    response: {
      title: "Odpowiedź statystyk",
      description: "Dane odpowiedzi statystyk konsultacji",
      totalConsultations: {
        title: "Całkowita liczba konsultacji",
        description: "Całkowita liczba wszystkich konsultacji",
      },
      scheduledConsultations: {
        title: "Zaplanowane konsultacje",
        description: "Liczba zaplanowanych konsultacji",
      },
      completedConsultations: {
        title: "Ukończone konsultacje",
        description: "Liczba ukończonych konsultacji",
      },
      cancelledConsultations: {
        title: "Anulowane konsultacje",
        description: "Liczba anulowanych konsultacji",
      },
      noShowConsultations: {
        title: "Niestawiennictwa",
        description: "Liczba niestawiennictw",
      },
      rescheduledConsultations: {
        title: "Przełożone konsultacje",
        description: "Liczba przełożonych konsultacji",
      },
      pendingConsultations: {
        title: "Oczekujące konsultacje",
        description: "Liczba oczekujących konsultacji",
      },
      totalRevenue: {
        title: "Całkowity przychód",
        description: "Całkowity przychód z konsultacji",
      },
      averageRevenue: {
        title: "Średni przychód na konsultację",
        description: "Średni przychód na jedną konsultację",
      },
      averageDuration: {
        title: "Średni czas trwania konsultacji",
        description: "Średni czas trwania jednej konsultacji",
      },
      completionRate: {
        title: "Wskaźnik ukończenia w procentach",
        description: "Procent ukończonych konsultacji",
      },
      cancellationRate: {
        title: "Wskaźnik anulowania w procentach",
        description: "Procent anulowanych konsultacji",
      },
      noShowRate: {
        title: "Wskaźnik niestawiennictwa w procentach",
        description: "Procent niestawiennictw",
      },
      rescheduleRate: {
        title: "Wskaźnik przełożeń w procentach",
        description: "Procent przełożonych konsultacji",
      },

      consultationsByStatus: {
        title: "Konsultacje według statusu",
        description: "Podział konsultacji według statusu",
        item: "Element podziału według statusu",
        status: "Wartość statusu",
        count: "Liczba dla tego statusu",
        percentage: "Procent dla tego statusu",
      },
      consultationsByType: {
        title: "Konsultacje według typu",
        description: "Podział konsultacji według typu",
        item: "Element podziału według typu",
        type: "Wartość typu",
        count: "Liczba dla tego typu",
        percentage: "Procent dla tego typu",
      },
      consultationsByDuration: {
        title: "Konsultacje według czasu trwania",
        description: "Podział konsultacji według czasu trwania",
        item: "Element podziału według czasu trwania",
        durationRange: "Zakres czasu trwania",
        count: "Liczba dla tego zakresu czasu trwania",
        percentage: "Procent dla tego zakresu czasu trwania",
      },
      consultationsByTimeSlot: {
        title: "Konsultacje według przedziału czasowego",
        description: "Podział konsultacji według przedziału czasowego",
        item: "Element podziału według przedziału czasowego",
        timeSlot: "Wartość przedziału czasowego",
        count: "Liczba dla tego przedziału czasowego",
        percentage: "Procent dla tego przedziału czasowego",
      },
      consultationsByConsultant: {
        title: "Konsultacje według konsultanta",
        description: "Podział konsultacji według konsultanta",
        item: "Element podziału według konsultanta",
        consultantId: "ID konsultanta",
        consultantName: "Nazwa konsultanta",
        count: "Liczba dla tego konsultanta",
        percentage: "Procent dla tego konsultanta",
      },
      historicalData: {
        title: "Dane historyczne",
        description: "Historyczne dane konsultacji w czasie",
        item: "Historyczny punkt danych",
        date: "Data dla tego punktu danych",
        count: "Całkowita liczba dla tej daty",
        completed: "Liczba ukończonych dla tej daty",
        cancelled: "Liczba anulowanych dla tej daty",
        noShow: "Liczba niestawiennictw dla tej daty",
      },
      groupedStats: {
        title: "Statystyki pogrupowane",
        description: "Pogrupowane statystyki konsultacji",
        item: "Element pogrupowanych statystyk",
        groupKey: "Identyfikator klucza grupy",
        groupValue: "Wartość grupy",
        count: "Liczba dla tej grupy",
        percentage: "Procent dla tej grupy",
      },
    },

    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Wykryto niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Statystyki pobrane pomyślnie",
    },
  },
};
