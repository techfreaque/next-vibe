import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Konfiguracja {{appName}}",
    description: "Pierwsza konfiguracja Twojej własnej instancji.",
  },
  stepOf: "Krok {{current}} z {{total}}",
  steps: {
    admin: "Login admina",
    ai: "Połącz AI",
    extras: "Dodatki",
    done: "Gotowe",
  },
  back: "Wstecz",
  continue: "Dalej",
  getKey: "Zdobądź klucz",
  secretSaved: "Zapisany. Zostaw puste, żeby go zachować.",
  errors: {
    saveFailed:
      "Nie udało się zapisać. Zajrzyj do terminala z vibe dev i spróbuj ponownie.",
  },
  restart: {
    title: "Wczytujemy Twoje ustawienia",
    body: "Instancja uruchamia się ponownie, żeby je załadować. Strona odświeży się sama za kilka sekund.",
    slow: "Trwa dłużej niż zwykle?",
    reload: "Odśwież stronę",
    manualTitle: "Zapisane",
    manualBody:
      "Uruchom serwer ponownie, żeby nowe ustawienia zadziałały. W międzyczasie możesz iść dalej.",
    continue: "Dalej",
  },
  welcome: {
    title: "Twoja instancja działa.",
    body: "Zabezpiecz ją własnym loginem admina, połącz AI i możesz rozmawiać. Zajmie to dwie minuty.",
    inProgress:
      "Konfiguracja tej instancji już trwa. Zaloguj się jako admin, żeby ją dokończyć.",
    failed:
      "Wbudowany login admina nie zadziałał. Jeśli już go zmieniłeś, zaloguj się swoim.",
    start: "Zacznij konfigurację",
    starting: "Uruchamiam",
    signIn: "Zaloguj się jako admin",
  },
  readOnly: {
    title: "Ustawienia są tu tylko do odczytu",
    body: "Ta instancja bierze ustawienia ze środowiska wdrożenia, więc ta strona nie może ich zapisać. Ustaw je tam, gdzie wdrażasz, i uruchom ponownie.",
  },
  admin: {
    title: "Utwórz login admina",
    body: "Zastępuje wbudowany login domyślny. Logujesz się nim tutaj i w vibe CLI.",
    email: "E-mail",
    emailHelp: "Twoja nazwa logowania. Nic na niego nie wysyłamy.",
    emailPlaceholder: "ty@przyklad.pl",
    password: "Hasło",
    passwordHelp:
      "Co najmniej 8 znaków. Zapisane w formie zaszyfrowanej na tym komputerze.",
    confirm: "Powtórz hasło",
    save: "Zapisz i dalej",
    errors: {
      email: "Wpisz poprawny adres e-mail.",
      passwordShort: "Użyj co najmniej 8 znaków.",
      passwordDefault: "Wybierz własne hasło, nie domyślne.",
      mismatch: "Hasła się nie zgadzają.",
    },
  },
  ai: {
    title: "Połącz AI",
    body: "Wybierz, skąd pochodzą modele. Jedna opcja wystarczy. Kolejne dodasz w każdej chwili.",
    byo: "Albo użyj własnych kluczy",
    moreProviders: "Więcej dostawców",
    skip: "Na razie pomiń",
    unbottled: {
      title: "Twoje konto unbottled.ai",
      recommended: "Polecane",
      body: "Jedno logowanie odblokowuje każdy model na unbottled.ai: popularne, otwarte i bez cenzury. Płacisz kredytami unbottled.ai. Żadnych kluczy dostawców do pilnowania.",
      email: "E-mail unbottled.ai",
      password: "Hasło unbottled.ai",
      advanced: "Zaawansowane",
      serverUrl: "Adres serwera",
      serverUrlHelp: "Zmień tylko, żeby połączyć inną instancję next-vibe.",
      failed: "Logowanie nieudane. Sprawdź e-mail i hasło.",
      connect: "Połącz konto",
      connecting: "Łączę",
      connected: "Połączono z {{url}}",
      unhealthy: "Połączenie zapisane, ale serwer teraz nie odpowiada.",
      disconnect: "Rozłącz",
      noAccount: "Nie masz konta?",
      createAccount: "Załóż je",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Wykryto",
      missingBadge: "Brak instalacji",
      detected:
        "Znaleziono na tym komputerze. Modele Claude działają w ramach Twojej subskrypcji Claude. Nic nie trzeba wpisywać.",
      missing:
        "Zainstaluj claude CLI i zaloguj się, żeby korzystać z subskrypcji Claude. Potem uruchom ponownie vibe dev.",
    },
  },
  fields: {
    openRouter: {
      label: "Klucz API OpenRouter",
      help: "Setki modeli pod jednym kluczem.",
    },
    venice: {
      label: "Klucz API Venice AI",
      help: "Prywatne modele bez cenzury.",
    },
    nanoGpt: {
      label: "Klucz API NanoGPT",
      help: "Modele bez cenzury i abliterowane. Płatność kryptowalutami.",
    },
    openAi: {
      label: "Klucz API OpenAI",
      help: "Generowanie obrazów modelami gpt-image.",
    },
    smtpHost: {
      label: "Serwer SMTP",
      help: "Twój serwer poczty, np. smtp.example.com.",
    },
    smtpPort: { label: "Port", help: "Zwykle 587, z TLS 465." },
    smtpSecure: {
      label: "Używaj TLS",
      help: "Włącz dla portu 465.",
    },
    smtpUser: {
      label: "Nazwa użytkownika",
      help: "Zwykle pełny adres e-mail.",
    },
    smtpPass: {
      label: "Hasło",
      help: "Gmail i większość dużych dostawców wymaga tu hasła aplikacji.",
    },
    smtpFromEmail: {
      label: "Adres nadawcy",
      help: "Z tego adresu przychodzą wiadomości.",
    },
    smtpFromName: {
      label: "Nazwa nadawcy",
      help: "Widoczna jako nadawca, np. nazwa Twojej instancji.",
    },
    stripeSecret: {
      label: "Klucz tajny",
      help: "Zaczyna się od sk_. Klucze testowe też działają.",
    },
    stripePublishable: {
      label: "Klucz publiczny",
      help: "Zaczyna się od pk_.",
    },
    stripeWebhook: {
      label: "Sekret podpisu webhooka",
      help: "Zaczyna się od whsec_. Potwierdza, że płatności docierają do Twojej instancji.",
    },
    storageType: {
      label: "Gdzie trzymać pliki",
      help: "Przesłane pliki, obrazy i audio z Twoich czatów.",
      optionFilesystem: "Ten komputer",
      optionS3: "Magazyn zgodny z S3",
    },
    s3Endpoint: {
      label: "Adres endpointu",
      help: "Endpoint S3 Twojego dostawcy, np. https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Region",
      help: "Np. us-east-1. Niektórzy dostawcy przyjmują auto.",
    },
    s3Bucket: { label: "Bucket", help: "Bucket musi już istnieć." },
    s3AccessKey: {
      label: "Access key ID",
      help: "Ze strony kluczy dostępu Twojego dostawcy magazynu.",
    },
    s3SecretKey: {
      label: "Secret access key",
      help: "Pokazywany tylko raz, przy tworzeniu klucza.",
    },
    s3PublicUrl: {
      label: "Publiczny adres URL",
      help: "Opcjonalnie. CDN albo publiczny adres bucketu do linków do plików.",
    },
  },
  extras: {
    title: "Dodatki opcjonalne",
    body: "Do rozmów nic z tego nie potrzebujesz. Pomiń i wróć, kiedy będzie trzeba.",
    configured: "Ustawione",
    finish: "Zakończ konfigurację",
    skipFinish: "Pomiń i zakończ",
    errors: {
      s3Incomplete:
        "Magazyn S3 potrzebuje endpointu, regionu, bucketu i obu kluczy.",
    },
    sections: {
      email: {
        title: "E-mail",
        body: "Potwierdzenia rejestracji i resety haseł przez Twój serwer SMTP.",
      },
      payments: {
        title: "Płatności",
        body: "Sprzedawaj kredyty i subskrypcje przez Stripe.",
      },
      storage: {
        title: "Magazyn plików",
        body: "Pliki z czatów zostają na tym komputerze, chyba że wybierzesz S3.",
      },
    },
  },
  done: {
    title: "Gotowe.",
    body: "Twoja instancja jest skonfigurowana i należy do Ciebie.",
    admin: "Login admina: {{email}}",
    aiUnbottled: "AI: Twoje konto unbottled.ai",
    aiKeys: "AI: Twoje własne klucze dostawców",
    aiClaude: "AI: Claude Code na tym komputerze",
    aiNone:
      "Nie połączono jeszcze AI. Do rozmów potrzebny jest jeden dostawca. Dodasz go w każdej chwili w ustawieniach admina.",
    start: "Zacznij rozmowę",
    later: "Wszystko tutaj zmienisz później w ustawieniach admina.",
  },
};
