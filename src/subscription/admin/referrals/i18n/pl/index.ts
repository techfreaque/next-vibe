import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Dashboard poleceń",
    titleShort: "Referrals admin",
    description: "Kody poleceń, zarobki i wypłaty",
    form: {
      title: "Zarządzanie poleceniami",
      description: "Zarządzaj programem poleceń",
    },
    searchFilters: {
      title: "Szukaj i filtruj",
      description: "Filtruj dane poleceń",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj po emailu",
      placeholder: "Szukaj poleceń...",
    },
    payoutStatus: {
      label: "Status wypłaty",
      description: "Filtruj po statusie",
      placeholder: "Dowolny",
    },
    dateFrom: { label: "Od", description: "Data początkowa" },
    dateTo: { label: "Do", description: "Data końcowa" },
    sortingOptions: {
      title: "Sortowanie",
      description: "Konfiguracja sortowania",
    },
    sortBy: {
      label: "Sortuj po",
      description: "Pole sortowania",
      placeholder: "Wybierz pole...",
    },
    sortOrder: {
      label: "Kolejność",
      description: "Kierunek sortowania",
      placeholder: "Wybierz...",
    },
    response: {
      title: "Polecenia",
      description: "Dane programu poleceń",
      summary: {
        title: "Podsumowanie",
        description: "Statystyki poleceń",
        totalCodes: { label: "Kody" },
        totalSignups: { label: "Rejestracje" },
        totalEarned: { label: "Zarobione" },
        totalPaidOut: { label: "Wypłacone" },
        pendingPayouts: { label: "Oczekujące" },
      },
      codes: {
        code: "Kod",
        ownerEmail: "Właściciel",
        ownerName: "Nazwa",
        currentUses: "Kliknięcia",
        totalSignups: "Rejestracje",
        totalEarned: "Zarobione",
        isActive: "Aktywny",
        createdAt: "Utworzony",
      },
      payoutRequests: {
        id: "ID",
        userEmail: "Użytkownik",
        amountCents: "Kwota",
        currency: "Waluta",
        status: "Status",
        walletAddress: "Portfel",
        adminNotes: "Notatki",
        rejectionReason: "Powód odrzucenia",
        createdAt: "Zgłoszone",
        processedAt: "Przetworzone",
      },
      totalCount: "Łącznie",
      pageCount: "Stron",
    },
    page: { label: "Strona" },
    limit: { label: "Na stronę" },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać danych poleceń",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak danych poleceń",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: { title: "Sukces", description: "Dane poleceń pobrane" },
  },
  post: {
    title: "Akcja wypłaty",
    titleShort: "Akcja wypłaty",
    description: "Zatwierdź, odrzuć lub zrealizuj wypłatę",
    form: {
      title: "Akcja wypłaty",
      description: "Przetwórz wypłatę",
    },
    requestId: {
      label: "ID zgłoszenia",
      description: "Wypłata do przetworzenia",
      placeholder: "Wprowadź ID...",
    },
    action: {
      label: "Akcja",
      description: "Akcja do wykonania",
      placeholder: "Wybierz akcję...",
    },
    adminNotes: {
      label: "Notatki admina",
      description: "Opcjonalne notatki",
      placeholder: "Notatki...",
    },
    rejectionReason: {
      label: "Powód odrzucenia",
      description: "Wymagany przy odrzuceniu",
      placeholder: "Podaj powód...",
    },
    response: {
      title: "Wynik",
      description: "Wynik akcji",
      success: "Sukces",
      message: "Wiadomość",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się przetworzyć wypłaty",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieoczekiwany błąd",
      },
      conflict: {
        title: "Konflikt",
        description: "Wypłata już przetworzona",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wypłaty",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: { title: "Sukces", description: "Wypłata przetworzona" },
  },
  widget: {
    noReferrals: "Nie znaleziono kodów poleceń.",
    noPayouts: "Brak zgłoszeń wypłat.",
    approve: "Zatwierdź",
    reject: "Odrzuć",
    complete: "Zrealizuj",
    sectionCodes: "Kody poleceń",
    sectionPayouts: "Zgłoszenia wypłat",
    refresh: "Odśwież",
    codeActive: "Aktywny",
    codeInactive: "Nieaktywny",
    clicks: "kliknięć",
    signups: "rejestracji",
    earned: "zarobiono",
    confirm: {
      title: "Potwierdź akcję wypłaty",
      description:
        "Czy na pewno chcesz wykonać tę akcję wypłaty? Operacja jest nieodwracalna.",
      cancel: "Anuluj",
      proceed: "Potwierdź",
    },
  },
  enums: {
    payoutStatusFilter: {
      all: "Wszystkie",
      pending: "Oczekujące",
      approved: "Zatwierdzone",
      rejected: "Odrzucone",
      processing: "W trakcie",
      completed: "Zakończone",
      failed: "Nieudane",
    },
    referralSortField: {
      createdAt: "Data utworzenia",
      earnings: "Łączne zarobki",
      signups: "Rejestracje",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    payoutAction: {
      approve: "Zatwierdź",
      reject: "Odrzuć",
      complete: "Zakończ",
    },
  },
};
