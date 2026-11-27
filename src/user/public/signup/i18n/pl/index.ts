import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "Sprawdź zwroty wiadomości rejestracyjnych",
    description:
      "Sprawdza, czy do skrzynki systemowej dotarły raporty o niedoręczeniu wiadomości rejestracyjnych.",
    marked: "Zaktualizowane rejestracje",
    result: "Zaktualizowane rejestracje: {{count}}",
    productionOnly: "Zwroty są sprawdzane tylko w środowisku produkcyjnym.",
    mailboxUnavailable:
      "Nie udało się sprawdzić zwrotów w skrzynce systemowej.",
  },
  events: {
    started: "Rejestracja rozpoczęta",
    emailSent: "Wysłano e-mail potwierdzający",
    sendFailed: "Wysyłka e-maila nie powiodła się",
    bounced: "E-mail potwierdzający odbity",
    expired: "Potwierdzenie wygasło",
    confirmed: "E-mail potwierdzony",
    reminderSent: "Wysłano przypomnienie",
  },
  reminder: {
    subject: "Twoje konto {{appName}} czeka na jedno kliknięcie",
    hint: "Rejestracja jest prawie gotowa, brakuje tylko potwierdzenia adresu e-mail. Potwierdź teraz i odbieraj {{credits}} darmowych kredytów co miesiąc. Kod i przycisk poniżej działają przez 24 godziny i zastępują te z pierwszej wiadomości.",
    button: "Potwierdź i zaloguj się",
    ignore:
      "To nie Ty? Zignoruj tę wiadomość. Bez kliknięcia konto nie powstanie.",
  },
  confirmation: {
    linkSent:
      "Nowa wiadomość z potwierdzeniem jest już w drodze. Otwórz link w wiadomości, aby się zalogować.",
    bouncedTitle: "Nie udało się dostarczyć wiadomości",
    changeAddress: "Zmień adres e-mail",
    description: "Dokończ rejestrację kodem lub linkiem z wiadomości e-mail.",
    title: "Sprawdź skrzynkę",
    sent: "Wpisz kod wysłany na {{email}}. Masz na to 30 minut.",
    code: "Kod 6-cyfrowy",
    confirm: "Potwierdź i zaloguj się",
    change: "Błędny adres? Zmień go",
    resend: "Wyślij kod ponownie",
    countdown: "Nowy kod za {{seconds}} s",
    save: "Wyślij na ten adres",
    cancel: "Anuluj",
    email: "Adres e-mail",
    hint: "Aby założyć konto, wpisz ten kod lub otwórz poniższy link. Oba są ważne przez 30 minut.",
    bounce:
      "Wiadomość wysłana na {{email}} wróciła do nas. Popraw adres, a wyślemy nowy kod.",
    invalid:
      "Kod lub link jest błędny albo stracił ważność. Poproś o nowy kod.",
    cooldown: "Zbyt wiele prób. Poczekaj chwilę, zanim poprosisz o nowy kod.",
    domain: "Ta domena nie odbiera poczty. Sprawdź adres.",
    bouncePolicy:
      "Twój dostawca poczty zablokował naszą wiadomość. Skrzynki szkolne i służbowe często odrzucają pocztę z zewnątrz. Użyj innego adresu.",
    bounceMailboxMissing:
      "Według dostawcy poczty adres {{email}} nie istnieje. Sprawdź, czy nie ma literówki, lub użyj innego adresu.",
    bounceMailboxFull:
      "Skrzynka {{email}} jest pełna. Zwolnij w niej miejsce i poproś o nowy kod lub użyj innego adresu.",
    sendFailed:
      "Nie udało się wysłać wiadomości na {{email}}. Sprawdź adres lub spróbuj ponownie.",
    done: "Adres potwierdzony. Jesteś już na swoim koncie.",
    newsletter:
      "Potwierdzasz też wybraną przy rejestracji subskrypcję newslettera.",
    link: "Potwierdź adres e-mail",
    pendingId: "Identyfikator rejestracji",
    token: "Token z linku potwierdzającego",
    callback: "Ścieżka powrotu",
    suggestion: "Czy chodziło Ci o {{email}}?",
    expired:
      "Ta rejestracja wygasła. Rozpocznij ją ponownie, aby otrzymać nowy kod.",
    retry: "Rozpocznij rejestrację ponownie",
    subject: "{{code}} to Twój kod do {{appName}}",
    wrongCode: "Zły kod. Weź kod z najnowszego maila i spróbuj jeszcze raz.",
    staleLink:
      "Ten link pochodzi ze starszego maila. Otwórz najnowszy albo wpisz kod z niego.",
    alreadyConfirmed:
      "Ten adres jest już potwierdzony. Zaloguj się, żeby kontynuować.",
    login: "Zaloguj się",
  },
  category: "Użytkownicy",

  _components: {
    passwordStrength: {
      label: "Siła hasła",
      weak: "Słabe",
      fair: "Wystarczające",
      good: "Dobre",
      strong: "Silne",
      requirement: {
        minLength: {
          icon: "✗",
          text: "Co najmniej 8 znaków",
        },
        uppercase: {
          icon: "✗",
          text: "Co najmniej jedna wielka litera",
        },
        lowercase: {
          icon: "✗",
          text: "Co najmniej jedna mała litera",
        },
        number: {
          icon: "✗",
          text: "Co najmniej jedna cyfra",
        },
        special: {
          icon: "!",
          text: "Znak specjalny (opcjonalny, poprawia siłę)",
        },
      },
    },
    post: {
      title: "Tytuł",
      description: "Opis endpointu",
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
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  title: "Rejestracja Użytkownika",
  titleShort: "Zarejestruj",
  description: "Endpoint rejestracji użytkownika",
  tag: "Uwierzytelnianie",
  actions: {
    submit: "Wyślij kod",
    submitting: "Wysyłanie kodu…",
  },
  fields: {
    privateName: {
      label: "Imię prywatne",
      description: "Tak zwraca się do Ciebie AI. Nikt inny tego nie widzi.",
      placeholder: "np. Ola",
      validation: {
        required: "Prywatna nazwa jest wymagana",
        minLength: "Nazwa musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa nie może być dłuższa niż 100 znaków",
      },
    },
    publicName: {
      label: "Nazwa publiczna",
      description: "Widoczna we wspólnych czatach i na forum.",
      placeholder: "np. ola_tworzy",
      validation: {
        required: "Nazwa wyświetlana jest wymagana",
        minLength: "Nazwa wyświetlana musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa wyświetlana nie może być dłuższa niż 100 znaków",
      },
    },
    email: {
      label: "E-mail",
      description: "Tylko do logowania. Nigdy nie udostępniamy.",
      placeholder: "ty@przyklad.pl",
      help: "To będzie Twój e-mail do logowania i główna metoda kontaktu",
      validation: {
        required: "E-mail jest wymagany",
        invalid: "Wpisz prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Hasło",
      description:
        "Min. 8 znaków: wielka i mała litera oraz cyfra. Zapisz je bezpiecznie: nadchodzi szyfrowanie end-to-end, a reset hasła usunie wtedy historię.",
      placeholder: "Ustaw hasło",
      validation: {
        required: "Hasło jest wymagane",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
        complexity: "Hasło musi zawierać wielką literę, małą literę i cyfrę",
      },
    },
    confirmPassword: {
      label: "Powtórz hasło",
      validation: {
        required: "Potwierdź swoje hasło",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
        mismatch: "Hasła nie pasują do siebie",
      },
    },

    acceptTerms: {
      label: "Akceptuję regulamin",
      description: "Nasz regulamin szanuje Twoją wolność i prywatność.",
      termsLink: "regulamin",
      conditionsLink: "polityka prywatności",
      descriptionPrefix: "Nasz",
      descriptionAnd: "i",
      descriptionSuffix: "szanują Twoją wolność i prywatność.",
      validation: {
        required: "Musisz zaakceptować regulamin, aby kontynuować",
      },
    },
    subscribeToNewsletter: {
      label: "Zapisz się do newslettera po bonusowe kredyty co miesiąc",
      description:
        "Potwierdź adres, aby włączyć miesięczny bonus za newsletter.",
      checkboxLabel:
        "Zapisz się do newslettera: +{{credits}} darmowych kredytów co miesiąc",
      hint: "Nowe modele i wiadomości o produkcie co kilka tygodni. Możesz zrezygnować w każdej chwili.",
      tooltip:
        "Kliknij link w powitalnym mailu newslettera, a co miesiąc dostaniesz {{credits}} dodatkowych kredytów, łącznie {{total}}, dopóki subskrybujesz newsletter.",
    },

    referralCode: {
      label: "Kod polecający (opcjonalnie)",
      description: "Masz kod od znajomego? Zarobi, gdy zasubskrybujesz.",
      placeholder: "Wpisz kod",
      labelPrefilled: "Kod polecający",
      subscriptionBonus:
        "+{{credits}} kredytów bonusowych z pierwszą subskrypcją.",
      descriptionPrefilled:
        "Twój znajomy dostanie nagrodę, gdy założysz konto.",
      validation: {
        invalid:
          "Ten kod polecający nie istnieje lub jest już nieaktywny. Popraw go albo wyczyść pole.",
      },
    },
    supportedSkillId: {
      label: "Wesprzyj twórcę",
      description:
        "Twoja rejestracja daje twórcy tego skilla +5% z Twoich subskrypcji.",
      selectorTitle: "Wesprzyj twórcę",
      selectorDescription:
        "Masz w ulubionych skille od niezależnych twórców. Wybierz, kogo chcesz wesprzeć: dostanie +5% z Twoich subskrypcji. Możesz to zmienić w każdej chwili.",
      selectorNone: "Żaden (pomiń)",
    },
    localFavorites: {
      label: "Lokalne ulubione",
    },
  },
  form: {
    title: "Załóż konto",
    description: "Każdy model. Twoje zasady. Start za darmo.",
    privacy:
      "E-mail tylko do logowania. Bez telefonu, bez karty, bez zewnętrznych trackerów.",
  },
  footer: {
    alreadyHaveAccount: "Masz już konto? Zaloguj się",
  },
  errors: {
    title: "Błąd rejestracji",
    validation: {
      title: "Błąd Walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Wymagana autoryzacja",
    },
    server: {
      title: "Błąd Serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    conflict: {
      title: "Konto już istnieje",
      description: "Konto z tym adresem e-mail już istnieje",
      detail: "Konto z tym adresem e-mail już istnieje. Po prostu się zaloguj.",
    },
    disposableEmail: {
      title: "Wymagany stały adres e-mail",
      detail: "Tymczasowe skrzynki odpadają. Podaj stały adres e-mail.",
    },
    subnetSignupLimit: {
      title: "Za dużo rejestracji z Twojej sieci",
      detail:
        "Z Twojej sieci założono dziś już zbyt wiele kont. Spróbuj jutro albo zaloguj się na istniejące konto.",
    },
    userNotFound: "Nie znaleziono konta dla {{email}}",
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Odmowa dostępu",
    },
    network: {
      title: "Błąd Sieci",
      description: "Wystąpił błąd sieci",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zasób nie znaleziony",
    },
    unsaved: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany",
    },
    autoLoginFailed:
      "Konto założone, ale nie udało się cię zalogować. Zaloguj się nowym hasłem.",
    internal: {
      title: "Rejestracja dla {{email}} nie powiodła się: {{error}}",
      description: "Wystąpił błąd wewnętrzny",
    },
  },
  emailCheck: {
    title: "Sprawdzanie Dostępności E-maila",
    description: "Sprawdź, czy e-mail jest dostępny do rejestracji",
    tag: "Sprawdzanie E-maila",
    fields: {
      email: {
        label: "Adres E-mail",
        description: "E-mail do sprawdzenia",
        placeholder: "Wprowadź adres e-mail",
        validation: {
          invalid: "Nieprawidłowy format e-maila",
        },
      },
    },
    response: {
      title: "Odpowiedź Sprawdzania E-maila",
      description: "Wynik sprawdzania dostępności e-maila",
      available: "E-mail Dostępny",
      message: "Wiadomość o Dostępności",
    },
    errors: {
      validation: {
        title: "Nieprawidłowy E-mail",
        description: "Proszę wprowadzić prawidłowy adres e-mail",
      },
      internal: {
        title: "Nie udało się sprawdzić {{email}}: {{error}}",
        description: "Błąd przy sprawdzaniu dostępności e-maila",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "E-mail już zajęty",
        description: "Ten e-mail jest już zarejestrowany",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do sprawdzenia tego e-maila",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas sprawdzania e-maila",
      },
      notFound: {
        title: "Usługa nie znaleziona",
        description: "Usługa sprawdzania e-maila jest niedostępna",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Wymagane uwierzytelnienie do sprawdzenia e-maila",
      },
      unsaved: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sprawdzanie E-maila Zakończone",
      description: "Dostępność e-maila sprawdzona pomyślnie",
    },
  },
  post: {
    title: "Rejestracja",
    description: "Endpoint rejestracji",
    form: {
      title: "Konfiguracja Rejestracji",
      description: "Skonfiguruj parametry rejestracji",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi rejestracji",
      success: "Rejestracja Pomyślna",
      message: "Wiadomość Statusu",
      userId: "ID Użytkownika",
      nextSteps: "Następne Kroki",
    },
    errors: {
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci",
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
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
      processing: "Przetwarzanie rejestracji zakończone pomyślnie",
    },
  },
  response: {
    title: "Odpowiedź",
    description: "Dane odpowiedzi rejestracji",
    success: "Rejestracja Pomyślna",
    message: "Wiadomość Statusu",
    user: {
      id: "ID Użytkownika",
      email: "Adres E-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      privateName: "Nazwa Prywatna",
      publicName: "Nazwa Publiczna",
      imageUrl: "URL Zdjęcia Profilowego",
      verificationRequired: "Wymagana weryfikacja",
    },
    verificationInfo: {
      title: "Weryfikacja E-maila",
      description: "Szczegóły procesu weryfikacji e-mail",
      emailSent: "E-mail wysłany",
      expiresAt: "Weryfikacja wygaśnie",
      checkSpamFolder: "Sprawdź folder spam",
    },
    nextSteps: "Następne Kroki",
  },
  success: {
    title: "Sprawdź skrzynkę",
    description: "Wpisz kod z wiadomości e-mail.",
  },
  admin_notification: {
    title: "Nowa rejestracja użytkownika",
    subject: "Nowa rejestracja użytkownika: {{privateName}}",
    preview: "Nowy użytkownik {{privateName}} się zarejestrował",
    message: "Nowy użytkownik zarejestrował się w {{appName}}",
    privateName: "Nazwa Prywatna",
    publicName: "Nazwa Publiczna",
    email: "E-mail",
    locale: "Język",
    creditBalance: "Saldo kredytów",
    leadCreditBalance: "Saldo kredytów leada",
    signup_preferences: "Preferencje Rejestracji",
    user_details: "Szczegóły użytkownika",
    basic_information: "Podstawowe informacje",
    signup_type: "Typ rejestracji",
    direct_signup: "Bezpośrednia rejestracja",
    newsletter: "Newsletter",
    subscribed: "Subskrybowany",
    not_subscribed: "Niesubskrybowany",
    signup_details: "Szczegóły rejestracji",
    signup_date: "Data rejestracji",
    user_id: "ID użytkownika",
    recommended_next_steps: "Zalecane następne kroki",
    direct_recommendation:
      "Przejrzyj profil użytkownika i konfigurację płatności",
    contact_user: "Skontaktuj się z użytkownikiem",
    footer: "To jest automatyczne powiadomienie z {{appName}}",
  },
  email: {
    subject: "Jesteś z nami. {{appName}} czeka na Ciebie",
    previewText:
      "Hej {{privateName}}, Twoje konto jest gotowe. Rozmawiaj z Claude, GPT, Gemini, DeepSeek i {{modelCount}} innymi. Za darmo, bez karty.",
    headline: "Twoja AI czeka.",
    greeting: "Hej {{privateName}},",
    intro:
      "Witamy w {{appName}}. Wszystko, co lubisz w ChatGPT, do tego modele open-source i modele bez filtrów treści. Jedno konto, jedno miejsce.",
    models: {
      title: "{{modelCount}} modeli w 3 kategoriach",
      mainstream: "Główny nurt",
      open: "Open Source",
      uncensored: "Niecenzurowane",
    },
    free: {
      title: "Co dostajesz za darmo, na zawsze:",
      credits:
        "{{freeCreditsSignedIn}} darmowych kredytów co miesiąc, +{{freeCreditsNewsletterBonus}} z newsletterem. Bez karty.",
      allModels: "Dostęp do wszystkich {{modelCount}} modeli AI",
      uncensored:
        "Niecenzurowane modele, które naprawdę odpowiadają na pytania",
      chatModes: "Czaty prywatne, incognito, współdzielone i publiczne",
      noCard: "Karta kredytowa nie jest wymagana. Nigdy.",
    },
    verify: {
      note: "Darmowe kredyty włączą się, gdy potwierdzisz ten adres.",
      cta: "Potwierdź e-mail, odbierz {{freeCreditsSignedIn}} kredytów",
    },
    ctaButton: "Zacznij rozmawiać",
    upgrade: {
      title: "Chcesz więcej?",
      desc: "Plany od {{subscriptionPrice}}/miesiąc za {{subscriptionCredits}} kredytów, aż do {{ultraCredits}} kredytów za {{ultraPrice}}. Subskrybenci dokupują pakiety, które nigdy nie wygasają.",
      cta: "Zobacz plany",
    },
    signoff: "Miłych rozmów,\nZespół {{appName}}",
    ps: "P.S. Użyj trybu Incognito, aby zachować rozmowy tylko na swoim urządzeniu. Nigdy nie przechowujemy ich na naszych serwerach (wygenerowane media przechowujemy tymczasowo ze względów technicznych).",
  },
  emailTemplates: {
    welcome: {
      name: "E-mail powitalny po rejestracji",
      description:
        "E-mail powitalny wysyłany do użytkowników po pomyślnej rejestracji",
      category: "Uwierzytelnianie",
      preview: {
        privateName: {
          label: "Nazwa prywatna",
          description: "Prywatna nazwa użytkownika",
        },
        userId: {
          label: "ID użytkownika",
          description: "Unikalny identyfikator użytkownika",
        },
        leadId: {
          label: "ID leada",
          description: "Identyfikator leada użytkownika",
        },
      },
    },
    adminSignup: {
      name: "E-mail z powiadomieniem administratora o rejestracji",
      description:
        "E-mail wysyłany do administratorów gdy nowy użytkownik się rejestruje",
      category: "Administracja",
      preview: {
        privateName: {
          label: "Nazwa prywatna",
        },
        publicName: {
          label: "Nazwa publiczna",
        },
        email: {
          label: "Adres e-mail",
        },
        userId: {
          label: "ID użytkownika",
        },
        subscribeToNewsletter: {
          label: "Subskrypcja newslettera",
        },
      },
    },
  },
};
