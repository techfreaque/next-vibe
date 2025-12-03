import { translations as _componentsTranslations } from "../../_components/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
  title: "Rejestracja Użytkownika",
  description: "Endpoint rejestracji użytkownika",
  tag: "Uwierzytelnianie",
  fields: {
    firstName: {
      label: "Imię",
      description: "Imię użytkownika",
      placeholder: "Wprowadź imię",
      help: "Wprowadź swoje imię, jak ma się pojawić w profilu",
    },
    lastName: {
      label: "Nazwisko",
      description: "Nazwisko użytkownika",
      placeholder: "Wprowadź nazwisko",
      help: "Wprowadź swoje nazwisko, jak ma się pojawić w profilu",
    },
    privateName: {
      label: "Nazwa Prywatna",
      description: "Prywatna nazwa użytkownika",
      placeholder: "Wprowadź nazwę prywatną",
      help: "Wprowadź swoją prywatną nazwę do użytku wewnętrznego",
    },
    publicName: {
      label: "Nazwa Publiczna",
      description: "Publiczna nazwa użytkownika",
      placeholder: "Wprowadź nazwę publiczną",
      help: "Wprowadź swoją publiczną nazwę, jak będzie wyświetlana innym",
    },
    email: {
      label: "E-mail",
      description: "Adres e-mail użytkownika",
      placeholder: "Wprowadź adres e-mail",
      help: "To będzie Twój e-mail logowania i główny sposób kontaktu",
    },
    password: {
      label: "Hasło",
      description: "Hasło użytkownika",
      placeholder: "Wprowadź hasło",
      help: "Hasło musi mieć co najmniej 8 znaków",
    },
    confirmPassword: {
      label: "Potwierdź Hasło",
      description: "Potwierdź swoje hasło",
      placeholder: "Wprowadź hasło ponownie",
      help: "Wprowadź ponownie hasło, aby je potwierdzić",
      validation: {
        mismatch: "Hasła nie są zgodne",
      },
    },
    phone: {
      label: "Numer Telefonu",
      description: "Numer telefonu użytkownika",
      placeholder: "Wprowadź numer telefonu",
      help: "Numer telefonu do odzyskiwania konta i powiadomień (opcjonalny)",
    },
    company: {
      label: "Firma",
      description: "Nazwa firmy użytkownika",
      placeholder: "Wprowadź nazwę firmy",
      help: "Nazwa Twojej firmy lub organizacji (opcjonalna)",
    },
    leadId: {
      label: "ID Leada",
      description: "Identyfikator leada do śledzenia",
      placeholder: "Wprowadź ID leada",
      help: "Wewnętrzny identyfikator leada (opcjonalny)",
    },
    preferredContactMethod: {
      label: "Preferowana Metoda Kontaktu",
      description: "W jaki sposób chcesz być kontaktowany",
      placeholder: "Wybierz metodę kontaktu",
      help: "Wybierz, jak chcesz, żebyśmy się z Tobą skontaktowali",
    },
    signupType: {
      label: "Źródło Rejestracji",
      description: "Skąd się zarejestrowałeś",
      placeholder: "Wybierz źródło rejestracji",
      help: "Jak nas znalazłeś?",
    },
    acceptTerms: {
      label: "Akceptuj Regulamin",
      description: "Zaakceptuj nasz regulamin i warunki",
      placeholder: "Akceptuję regulamin i warunki",
      help: "Proszę przeczytaj i zaakceptuj nasz regulamin, aby kontynuować",
      validation: {
        required: "Musisz zaakceptować regulamin, aby kontynuować",
      },
    },
    subscribeToNewsletter: {
      label: "Subskrybuj Newsletter",
      description: "Otrzymuj aktualizacje i nowości e-mailem",
      placeholder: "Subskrybuj nasz newsletter",
      help: "Otrzymuj najnowsze aktualizacje, wskazówki i ekskluzywne oferty na skrzynkę",
    },
    imageUrl: {
      label: "URL Zdjęcia Profilowego",
      description: "URL dla Twojego zdjęcia profilowego",
      placeholder: "Wprowadź URL zdjęcia",
      help: "Opcjonalnie: Podaj URL dla swojego zdjęcia profilowego",
    },
    referralCode: {
      label: "Kod polecający",
      description: "Opcjonalny kod polecający od znajomego",
      placeholder: "Wprowadź kod polecający (opcjonalnie)",
      help: "Jeśli masz kod polecający, wprowadź go tutaj",
    },
  },
  groups: {
    personalInfo: {
      title: "Informacje Osobiste",
      description: "Wprowadź swoje dane osobowe",
    },
    security: {
      title: "Bezpieczeństwo",
      description: "Skonfiguruj bezpieczeństwo konta",
    },
    businessInfo: {
      title: "Informacje Biznesowe",
      description: "Wprowadź dane biznesowe",
    },
    preferences: {
      title: "Preferencje",
      description: "Ustaw swoje preferencje komunikacyjne",
    },
    consent: {
      title: "Regulamin i Zgoda",
      description: "Przejrzyj i zaakceptuj nasz regulamin i warunki",
    },
    advanced: {
      title: "Opcje Zaawansowane",
      description: "Dodatkowe opcje konfiguracji",
    },
  },
  errors: {
    title: "Błąd rejestracji",
    conflict: {
      title: "Konflikt Konta",
      description: "Konto już istnieje",
    },
    internal: {
      title: "Błąd Wewnętrzny",
      description: "Wystąpił błąd wewnętrzny",
    },
    network: {
      title: "Błąd Sieci",
      description: "Wystąpił błąd sieci",
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
    title: "Rejestracja zakończona pomyślnie",
    description: "Twoje konto zostało pomyślnie utworzone",
  },
  enums: {
    signupType: {
      meeting: "Rejestracja na Spotkanie",
      pricing: "Rejestracja Cenowa",
    },
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
    consultation_first: "Najpierw konsultacja",
    direct_signup: "Bezpośrednia rejestracja",
    newsletter: "Newsletter",
    subscribed: "Subskrybowany",
    not_subscribed: "Niesubskrybowany",
    signup_details: "Szczegóły rejestracji",
    signup_date: "Data rejestracji",
    user_id: "ID użytkownika",
    recommended_next_steps: "Zalecane następne kroki",
    consultation_recommendation: "Zaplanuj rozmowę konsultacyjną",
    direct_recommendation:
      "Przejrzyj profil użytkownika i konfigurację płatności",
    contact_user: "Skontaktuj się z użytkownikiem",
    footer: "To jest automatyczne powiadomienie z {{appName}}",
  },
  email: {
    title: "Witamy w {{appName}}!",
    subject: "Witamy w {{appName}}!",
    previewText:
      "Witamy w {{appName}}! Rozpocznij swoje doświadczenie z czatem AI.",
    welcomeMessage: "Witamy w {{appName}}!",
    description:
      "Jesteś teraz gotowy, aby rozpocząć czat z AI i dołączyć do naszego forum społeczności.",
    ctaTitle: "Rozpocznij",
    ctaButton: "Przejdź do subskrypcji",
    signoff: "Z poważaniem,\nZespół {{appName}}",
  },
};
