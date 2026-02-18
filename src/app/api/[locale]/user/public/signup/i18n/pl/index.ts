import { translations as _componentsTranslations } from "../../_components/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
  title: "Rejestracja Użytkownika",
  description: "Endpoint rejestracji użytkownika",
  tag: "Uwierzytelnianie",
  actions: {
    submit: "Utwórz konto",
    submitting: "Tworzenie konta...",
  },
  fields: {
    privateName: {
      label: "Twoja prywatna nazwa",
      description:
        "Jak AI będzie się do Ciebie zwracać w prywatnych rozmowach. To zostaje między Tobą a AI – całkowicie prywatne.",
      placeholder: "Wpisz swoje imię",
      validation: {
        required: "Prywatna nazwa jest wymagana",
        minLength: "Nazwa musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa nie może być dłuższa niż 100 znaków",
      },
    },
    publicName: {
      label: "Twoja publiczna nazwa",
      description:
        "Twoja tożsamość w publicznych czatach i na forach. Inni użytkownicy i AI zobaczą tę nazwę. Wybierz mądrze – ona reprezentuje Cię w społeczności.",
      placeholder: "Wpisz nazwę wyświetlaną",
      validation: {
        required: "Nazwa wyświetlana jest wymagana",
        minLength: "Nazwa wyświetlana musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa wyświetlana nie może być dłuższa niż 100 znaków",
      },
    },
    email: {
      label: "Twój e-mail",
      description:
        "Twoje dane logowania i metoda kontaktu. Pozostaje prywatny – nigdy nie będzie udostępniony innym użytkownikom ani AI.",
      placeholder: "Wpisz adres e-mail",
      help: "To będzie Twój e-mail do logowania i główna metoda kontaktu",
      validation: {
        required: "E-mail jest wymagany",
        invalid: "Wpisz prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Twoje hasło",
      description:
        "Silne hasła chronią Twoje konto. Wkrótce wdrożymy szyfrowanie end-to-end – od tego momentu reset hasła usunie Twoją historię wiadomości, ponieważ tylko Ty posiadasz klucz deszyfrujący. Zapisz je w bezpiecznym miejscu.",
      placeholder: "Wpisz hasło",
      validation: {
        required: "Hasło jest wymagane",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
        complexity: "Hasło musi zawierać wielką literę, małą literę i cyfrę",
      },
    },
    confirmPassword: {
      label: "Potwierdź hasło",
      validation: {
        required: "Potwierdź swoje hasło",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
        mismatch: "Hasła nie pasują do siebie",
      },
    },

    acceptTerms: {
      label: "Akceptuj regulamin",
      description: "Nasz regulamin szanuje Twoją wolność i prywatność.",
      validation: {
        required: "Musisz zaakceptować regulamin, aby kontynuować",
      },
    },
    subscribeToNewsletter: {
      label: "Subskrybuj newsletter",
      description:
        "Sporadyczne aktualizacje o nowych modelach i funkcjach. Bez spamu, tylko to co ważne.",
    },

    referralCode: {
      label: "Kod polecający (opcjonalnie)",
      description:
        "Masz znajomego na unbottled.ai? Wpisz jego kod, żeby go wesprzeć. Dostanie nagrodę za to, że Cię tu przyprowadził.",
      placeholder: "Wpisz kod polecający (opcjonalnie)",
    },
  },
  form: {
    title: "Witamy w Uncensored AI",
    description:
      "Pomóż budować niecenzurowaną, prywatną i naprawdę niezależną AI. unbottled.ai to open source i projekt społecznościowy – Twoja rejestracja wspiera rozwój technologii AI, która szanuje Twoją wolność.",
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
      title: "Konflikt konta",
      description: "Konto z tym adresem e-mail już istnieje",
    },
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
    internal: {
      title: "Błąd Wewnętrzny",
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
        title: "Błąd Sprawdzania E-maila",
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
    title: "Rejestracja udana",
    description: "Twoje konto zostało pomyślnie utworzone",
  },
  admin_notification: {
    title: "Nowa rejestracja użytkownika",
    subject: "Nowa rejestracja użytkownika - {{privateName}}",
    preview: "Nowy użytkownik {{privateName}} się zarejestrował",
    message: "Nowy użytkownik zarejestrował się w {{appName}}",
    privateName: "Nazwa Prywatna",
    publicName: "Nazwa Publiczna",
    email: "E-mail",
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
    subject: "Jesteś z nami - {{appName}} jest gotowe na Ciebie",
    previewText:
      "Hej {{privateName}}, Twoje konto jest gotowe. Rozmawiaj z Claude, GPT, Gemini, DeepSeek i {{modelCount}} innymi - za darmo, bez karty.",
    headline: "Twoja AI czeka.",
    greeting: "Hej {{privateName}},",
    intro:
      "Witamy w {{appName}}. Właśnie odblokowałeś dostęp do najbardziej kompletnej platformy do rozmów z AI - wszystko, co lubisz w ChatGPT, plus modele open-source i modele bez filtrów treści.",
    models: {
      title: "{{modelCount}} modeli w 3 kategoriach",
      mainstream: "Główny nurt",
      open: "Open Source",
      uncensored: "Niecenzurowane",
    },
    free: {
      title: "Co dostajesz za darmo, na zawsze:",
      credits: "20 creditów miesięcznie - bez karty, bez daty wygaśnięcia",
      allModels: "Dostęp do wszystkich {{modelCount}} modeli AI",
      uncensored:
        "4 niecenzurowane modele, które naprawdę odpowiadają na pytania",
      chatModes: "Tryby czatu: Prywatny, Incognito, Współdzielony i Publiczny",
      noCard: "Karta kredytowa nie jest wymagana - nigdy",
    },
    ctaButton: "Zacznij rozmawiać",
    upgrade: {
      title: "Chcesz więcej?",
      desc: "8 €/miesiąc daje Ci 800 creditów - to 40× więcej. Możesz też kupować dodatkowe pakiety creditów, które nigdy nie wygasają. Idealne do codziennego użytku AI.",
      cta: "Zobacz plan Unlimited",
    },
    signoff: "Miłych rozmów,\nZespół {{appName}}",
    ps: "P.S. Użyj trybu Incognito, aby zachować rozmowy tylko na swoim urządzeniu – nigdy nie przechowujemy ich na naszych serwerach.",
  },
};
