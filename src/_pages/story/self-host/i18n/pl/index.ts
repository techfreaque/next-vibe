import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Uruchom {{appName}} na własnym sprzęcie z next-vibe",
    category: "Własny hosting",
    description:
      "Uruchom next-vibe na swoim komputerze. Połącz konto {{appName}}, by korzystać z modeli i kredytów w chmurze, albo użyj własnych kluczy API.",
    imageAlt: "{{appName}} na własnym sprzęcie z next-vibe",
    keywords: "własny hosting, next-vibe, prywatna AI, Docker, {{appName}}",
  },
  hero: {
    title: "Uruchom next-vibe na własnym sprzęcie",
    subtitle:
      "Przechowuj historię rozmów i pliki u siebie. Korzystaj z modeli i kredytów na koncie unbottled.ai albo połącz się bezpośrednio ze swoimi dostawcami AI.",
  },
  account: {
    title: "Użyj swojego konta unbottled.ai",
    intro:
      "Aplikacja działa u ciebie, a modele uruchamia unbottled.ai. Koszt zapytań pokrywasz z kredytów na koncie w chmurze. Do połączenia potrzebujesz płatnego konta, adresu e-mail i hasła.",
    start: {
      title: "Uruchom lokalną instancję",
      body: "Zainstaluj i uruchom next-vibe, a potem zaloguj się jako lokalny administrator. Do połączenia z chmurą wystarczy subskrypcja lub zakupione kredyty.",
      signup: "Załóż konto unbottled.ai",
    },
    connect: {
      title: "Połącz konto w chmurze",
      body: "Jeśli pojawi się wybór asystenta, na razie zamknij to okno. Rozwiń sekcję konta na pasku bocznym czatu. Otwórz Panel Admina, wybierz Ustawienia systemowe i uruchom Kreator konfiguracji. Klikaj Dalej do kroku Dostawca AI, gdzie znajdziesz Unbottled AI Cloud. Zostaw adres https://unbottled.ai, podaj e-mail i hasło do konta w chmurze, wybierz dane do synchronizacji i kliknij Zaloguj się.",
    },
    privacy:
      "Wyłącz synchronizację pamięci, dokumentów, umiejętności, ulubionych i wątków, jeśli te dane mają zostać u ciebie. Pierwsze cztery opcje są domyślnie włączone. Do przetworzenia zapytania unbottled.ai otrzymuje wiadomość, potrzebny kontekst i dołączone pliki.",
    verify: {
      title: "Wyślij wiadomość próbną",
      body: "Wróć do lokalnego czatu i odśwież stronę. Jeśli aplikacja zapyta o asystenta, wybierz go. Rozpocznij prywatną rozmowę i wybierz model połączonego dostawcy. Zapytanie wykona unbottled.ai na twoim koncie w chmurze.",
    },
    cli: {
      title: "Połącz konto z terminala",
      body: "Zostaw aplikację uruchomioną z kodu źródłowego i otwórz drugi terminal w tym samym katalogu projektu. Podstaw e-mail i hasło do konta w chmurze. Polecenie wyłącza wszystkie pięć kategorii synchronizacji. Użyj kreatora w przeglądarce, jeśli chcesz, by hasło nie pojawiło się w historii poleceń ani w argumentach procesu.",
      diagnostics:
        "Wyświetl listę połączeń i sprawdź, czy dostawca modeli jest aktywny.",
    },
  },
  standalone: {
    title: "Uruchom samodzielnie z własnymi kluczami",
    intro:
      "Korzystaj ze swojego konta u dostawcy AI i rozliczaj się bezpośrednio z nim. Do tego wariantu nie potrzebujesz konta unbottled.ai.",
    start: {
      title: "Przygotuj next-vibe",
      body: "Zainstaluj next-vibe i przygotuj lokalny plik .env. Możesz też skorzystać z instrukcji dla Dockera poniżej.",
    },
    provider: {
      title: "Dodaj klucz API dostawcy",
      body: "Jeśli korzystasz z OpenRouter, dopisz tę linię do .env i wstaw swój klucz. Ustawienia pozostałych dostawców znajdziesz w .env.example.",
      key: "Pobierz klucz OpenRouter",
    },
    verify: {
      title: "Rozpocznij rozmowę",
      body: "Uruchom aplikację ponownie, jeśli już działa. Zaloguj się jako lokalny administrator, wybierz dostępny model OpenRouter i wyślij wiadomość.",
    },
  },
  install: {
    title: "Zainstaluj next-vibe",
    requirements:
      "Potrzebujesz Gita, Node.js w wersji 22 lub nowszej i Buna dostępnych w PATH. Projekt używa Buna 1.4.4. Poniższa konfiguracja uruchamia PostgreSQL w procesie aplikacji przez PGlite. Docker i osobny serwer bazy danych są opcjonalne.",
    checkout: {
      title: "Zainstaluj jednym poleceniem",
      body: "W systemie Linux lub macOS uruchom polecenie w Bashu lub Zsh, a w Windowsie w PowerShellu 7. Polecenie pobiera kod, instaluje zapisane w projekcie wersje zależności i udostępnia polecenie vibe.",
      windows:
        "Oficjalnie wspieramy Linuksa. Instalator uwzględnia też macOS i Windows. W Windowsie wybierz ścieżkę do projektu bez spacji. Jeśli instalacja się nie powiedzie, użyj instrukcji dla Linuksa w WSL.",
    },
    config: {
      title: "Skonfiguruj bazę i logowanie",
      body: "Otwórz plik .env w katalogu projektu. Jeśli go brakuje, utwórz go z .env.example. Ustaw adres bazy według przykładu poniżej oraz własne VIBE_ADMIN_USER_EMAIL i VIBE_ADMIN_USER_PASSWORD. Używaj serwera deweloperskiego na prywatnym komputerze lub w sieci prywatnej.",
      secrets:
        "Wykonaj polecenie dwa razy. Zapisz dwa różne wyniki jako JWT_SECRET_KEY i CRON_SECRET. Zachowaj te wartości przy kolejnych uruchomieniach.",
    },
    run: {
      title: "Uruchom next-vibe",
      body: "Wykonaj polecenie w katalogu projektu i zostaw terminal otwarty. Otwórz adres wyświetlony przy starcie, zwykle http://localhost:3000. Zaloguj się danymi lokalnego administratora z .env.",
    },
  },
  docker: {
    title: "Uruchom z Docker Compose",
    intro:
      "Samodzielna konfiguracja Compose uruchamia aplikację, PostgreSQL, Redis i MinIO na Linuksie x86-64. Potrzebujesz Dockera i wersji Compose obsługującej !override oraz !reset. Budowanie obrazu aplikacji może zużyć około 8 GB RAM.",
    config: {
      title: "Przygotuj kod i plik .env",
      body: "Jeśli już masz kod źródłowy, użyj tego samego katalogu. W przeciwnym razie wykonaj poniższe polecenia.",
      env: "Skopiuj .env.example do .env. Ustaw dane lokalnego administratora i oba sekrety według instrukcji powyżej. Wprowadź ustawienia z przykładu i wygeneruj trzeci ciąg szesnastkowy na hasło do bazy. W wariancie samodzielnym dodaj klucze dostawców przed startem. Połącz konto w chmurze, gdy aplikacja nadal używa adresu localhost. Aby udostępnić ją publicznie, wpisz w NEXT_PUBLIC_APP_URL adres dla użytkowników i skonfiguruj HTTPS.",
    },
    run: {
      title: "Zbuduj obrazy i uruchom kontenery",
      body: "Compose buduje obrazy aplikacji i PostgreSQL z katalogu projektu. Po starcie otwórz skonfigurowany adres aplikacji, zaloguj się jako administrator i wybierz jedną z dwóch instrukcji powyżej.",
    },
  },
  update: {
    title: "Zaktualizuj instancję",
    intro:
      "Przed aktualizacją zrób kopię pliku .env, bazy danych i przesłanych plików.",
    source: {
      title: "Instalacja z kodu źródłowego",
      body: "Zatrzymaj lokalny serwer przez Ctrl+C. W tym samym katalogu pobierz zmiany, zainstaluj zależności i uruchom serwer ponownie. Przy starcie aplikacja wykona zaległe migracje bazy.",
    },
    docker:
      "W tym samym katalogu pobierz zmiany w kodzie i przebuduj obrazy kontenerów. Zachowaj plik .env i katalogi danych.",
  },
  troubleshoot: {
    title: "Rozwiązywanie problemów",
    path: {
      title: "Terminal nie znajduje polecenia vibe",
      body: "Otwórz nowy terminal. Jeśli polecenie nadal nie działa, uruchom skrypt startowy bezpośrednio z katalogu projektu.",
    },
    connect: {
      title: "Nie można połączyć się z chmurą",
      body: "Sprawdź e-mail i hasło oraz uprawnienia konta do połączeń zdalnych. Zostaw lokalną aplikację włączoną. Jeśli logowanie do konta w chmurze wymaga kodu dwuskładnikowego, wybierz wariant samodzielny. Płatne konto pozwala połączyć do trzech instancji. Zanim podłączysz kolejny komputer, nadaj już połączonemu unikalny identyfikator w sekcji Połączenia zdalne. Jeśli kreator pokazuje ogólny błąd, sprawdź log lokalnego serwera lub użyj polecenia łączenia w terminalu.",
    },
    models: {
      title: "Lista modeli jest pusta",
      body: "W przypadku chmury sprawdź, czy połączenie jest aktywne. Jeśli powstało poza kreatorem, sprawdź też, czy ustawiono je jako dostawcę modeli. W wariancie samodzielnym sprawdź klucz zapisany w .env i środki na koncie dostawcy, a potem uruchom aplikację ponownie.",
    },
    credits: {
      title: "Lokalna aplikacja zgłasza brak kredytów",
      body: "Oba warianty sprawdzają lokalne saldo. W lokalnym Panelu Admina otwórz Użytkownicy, wybierz swoje lokalne konto i kliknij Przyznaj kredyty. Zasilisz tylko saldo tej instancji. Dostawca modeli lub unbottled.ai nadal rozlicza zapytania na podłączonym koncie.",
    },
    docker: {
      title: "Kontener nie startuje",
      body: "Znajdź pierwszy błąd w logu aplikacji. Jeśli podczas budowania obrazu brakuje pamięci, przydziel Dockerowi więcej RAM albo uruchom aplikację bezpośrednio z kodu.",
    },
    issue: "Zgłoś problem z konfiguracją",
  },
};
