import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard Systemu",
  destroy: {
    category: "Guard Systemu",

    title: "Zniszcz Guard",
    description: "Zniszcz środowiska guard i wyczyść zasoby",
    tag: "zarządzanie-guard",
    container: {
      title: "Konfiguracja niszczenia Guard",
      description: "Skonfiguruj parametry niszczenia środowisk guard",
    },
    fields: {
      projectPath: {
        title: "Ścieżka projektu",
        description: "Ścieżka do katalogu projektu",
        placeholder: "/home/user/projects/moj-projekt",
      },
      guardId: {
        title: "ID Guard",
        description: "Unikalny identyfikator guard",
        placeholder: "guard_moj_projekt_abc123",
      },
      force: {
        title: "Wymuś niszczenie",
        description: "Wymuś niszczenie nawet jeśli guard jest uruchomiony",
      },
      cleanupFiles: {
        title: "Wyczyść pliki",
        description: "Usuń wszystkie pliki związane z guard",
      },
      dryRun: {
        title: "Próbny przebieg",
        description:
          "Podgląd co zostałoby zniszczone bez faktycznego niszczenia",
      },
      success: {
        title: "Sukces",
      },
      output: {
        title: "Wynik",
      },
      destroyedGuards: {
        title: "Zniszczone Guards",
      },
      warnings: {
        title: "Ostrzeżenia",
      },
      totalDestroyed: {
        title: "Łącznie zniszczonych",
      },
      username: {
        title: "Nazwa użytkownika",
      },
      wasRunning: {
        title: "Był uruchomiony",
      },
      filesRemoved: {
        title: "Usunięte pliki",
      },
      userRemoved: {
        title: "Użytkownik usunięty",
      },
    },
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
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
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny",
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
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      destruction_failed: {
        title: "Niszczenie Guard nie powiodło się",
        description: "Nie udało się zniszczyć środowiska guard",
      },
      guard_not_found: {
        title: "Guard nie znaleziony",
        description: "Nie znaleziono środowiska guard dla określonego projektu",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  start: {
    title: "Uruchom Guard",
    description: "Uruchom środowiska guard dla projektów VSCode",
    tag: "Uruchom",
    category: "Guard",
    container: {
      title: "Konfiguracja uruchomienia",
      description: "Skonfiguruj parametry uruchomienia guard",
    },
    fields: {
      projectPath: {
        title: "Ścieżka projektu",
        description: "Ścieżka do projektu VSCode",
        placeholder: "/home/user/projects/moj-projekt",
      },
      guardId: {
        title: "ID Guard",
        description: "Unikalny identyfikator środowiska guard",
        placeholder: "guard_moj_projekt_abc123",
      },
      startAll: {
        title: "Uruchom wszystkie Guard",
        description: "Uruchom wszystkie dostępne środowiska guard",
      },
      totalStarted: {
        title: "Całkowita liczba uruchomionych",
      },
      output: {
        title: "Wynik",
      },
      startedGuards: {
        columns: {
          username: "Nazwa użytkownika",
          projectPath: "Ścieżka projektu",
        },
      },
      summary: {
        title: "Podsumowanie",
      },
      status: {
        title: "Status",
      },
      hasIssues: {
        title: "Ma problemy",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Środowisko guard nie zostało znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Środowisko guard jest już uruchomione",
      },
    },
    success: {
      title: "Sukces",
      description: "Guard uruchomiony pomyślnie",
    },
  },
  status: {
    category: "Guard",
    post: {
      title: "Status Strażnika",
      description: "Sprawdź status środowiska strażnika",
      tag: "Status",
      container: {
        title: "Konfiguracja Statusu Strażnika",
        description: "Skonfiguruj parametry sprawdzania statusu",
      },
      fields: {
        projectPath: {
          title: "Ścieżka Projektu",
          description: "Ścieżka do projektu strażnika",
          placeholder: "/ścieżka/do/projektu",
        },
        guardId: {
          title: "ID Strażnika",
          description: "Unikalny identyfikator strażnika",
          placeholder: "guard-123",
        },
        username: {
          title: "Nazwa użytkownika",
        },
        status: {
          title: "Status",
        },
        createdAt: {
          title: "Utworzono",
        },
        securityLevel: {
          title: "Poziom bezpieczeństwa",
        },
        isolationMethod: {
          title: "Metoda izolacji",
        },
        isRunning: {
          title: "Działa",
        },
        userHome: {
          title: "Katalog użytkownika",
        },
        listAll: {
          title: "Wyświetl Wszystkich Strażników",
          description: "Wyświetl wszystkie środowiska strażników",
        },
        success: {
          title: "Sukces",
        },
        output: {
          title: "Wynik",
        },
        guards: {
          title: "Strażnicy",
        },
        totalGuards: {
          title: "Łącznie Strażników",
        },
        activeGuards: {
          title: "Aktywni Strażnicy",
        },
      },
      form: {
        title: "Konfiguracja Statusu",
        description: "Skonfiguruj parametry statusu",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
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
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  stop: {
    category: "Guard Systemu",

    title: "Zatrzymaj Guard",
    description: "Zatrzymaj środowiska guard dla projektów VSCode",
    tag: "guard",

    container: {
      title: "Konfiguracja Zatrzymania Guard",
      description: "Skonfiguruj parametry do zatrzymania środowisk guard",
    },

    fields: {
      projectPath: {
        title: "Ścieżka Projektu",
        description: "Ścieżka do katalogu projektu",
        placeholder: "/ścieżka/do/twojego/projektu",
      },
      guardId: {
        title: "ID Guard",
        description: "Określone ID guard do zatrzymania",
        placeholder: "guard_projekt_abc123",
      },
      username: {
        title: "Nazwa użytkownika",
      },
      wasRunning: {
        title: "Był uruchomiony",
      },
      nowRunning: {
        title: "Teraz uruchomiony",
      },
      pid: {
        title: "ID procesu",
      },
      forceStopped: {
        title: "Wymuszone zatrzymanie",
      },
      stopAll: {
        title: "Zatrzymaj Wszystkie Guards",
        description: "Zatrzymaj wszystkie działające środowiska guard",
      },
      force: {
        title: "Wymuś Zatrzymanie",
        description: "Wymuś zatrzymanie nawet jeśli guard nie odpowiada",
      },
      success: {
        title: "Operacja Udana",
      },
      output: {
        title: "Wyjście Polecenia",
      },
      stoppedGuards: {
        title: "Zatrzymane Guards",
      },
      totalStopped: {
        title: "Łącznie Zatrzymanych",
      },
    },

    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      internal: {
        title: "Błąd Wewnętrzny",
        description: "Wystąpił błąd wewnętrzny serwera",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },

    success: {
      title: "Sukces",
      description: "Operacja zatrzymania guard zakończona pomyślnie",
    },
  },
  operations: {
    create: "Utwórz",
    setup: "Konfiguruj",
    start: "Uruchom",
    stop: "Zatrzymaj",
    destroy: "Zniszcz",
    status: "Status",
    list: "Lista",
  },
  security: {
    minimal: "Minimalne zabezpieczenie",
    standard: "Standardowe zabezpieczenie",
    strict: "Ścisłe zabezpieczenie",
    maximum: "Maksymalne zabezpieczenie",
  },
  userTypes: {
    projectUser: "Użytkownik projektu",
    restrictedUser: "Ograniczony użytkownik",
    chrootUser: "Użytkownik Chroot",
  },
  statusValues: {
    created: "Utworzono",
    running: "Działa",
    stopped: "Zatrzymano",
    error: "Błąd",
    destroyed: "Zniszczono",
  },
  isolation: {
    rbash: "Ograniczona Bash (rbash)",
    chroot: "Chroot",
    bubblewrap: "Bubblewrap",
    firejail: "Firejail",
  },
};
