import { translations as optionsTranslations } from "../../options/i18n/pl";
import type { translations as enTranslations } from "../en";
import { translations as _componentsTranslations } from "../../_components/i18n/pl";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
  title: "Witaj ponownie",
  description:
    "Uzyskaj dostęp do niecenzurowanych modeli AI i historii rozmów.",
  tag: "Uwierzytelnianie",
  options: optionsTranslations,
  actions: {
    submit: "Zaloguj",
    submitting: "Logowanie...",
  },
  fields: {
    email: {
      label: "Twój e-mail",
      description: "E-mail, którego użyłeś do rejestracji.",
      placeholder: "Wpisz e-mail",
      validation: {
        required: "E-mail jest wymagany",
        invalid: "Wpisz prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Twoje hasło",
      description: "Wpisz hasło, które ustaliłeś podczas rejestracji.",
      placeholder: "Wpisz hasło",
      help: "Wpisz hasło do swojego konta",
      validation: {
        required: "Hasło jest wymagane",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
      },
    },
    rememberMe: {
      label: "Zapamiętaj mnie",
    },
  },
  groups: {
    credentials: {
      title: "Dane logowania",
      description: "Wprowadź informacje logowania",
    },
    options: {
      title: "Opcje logowania",
      description: "Dodatkowe preferencje logowania i ustawienia",
    },
    preferences: {
      title: "Preferencje logowania",
      description: "Dodatkowe opcje logowania",
    },
    advanced: {
      title: "Opcje zaawansowane",
      description: "Zaawansowane ustawienia logowania",
    },
  },
  footer: {
    forgotPassword: "Zapomniałeś hasła?",
    createAccount: "Nie masz konta? Zarejestruj się",
  },
  response: {
    title: "Odpowiedź logowania",
    description: "Dane odpowiedzi logowania",
    success: "Logowanie pomyślne",
    message: "Komunikat statusu",
    user: {
      title: "Szczegóły użytkownika",
      description: "Informacje o zalogowanym użytkowniku",
      id: "ID użytkownika",
      email: "Adres e-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      imageUrl: "Zdjęcie profilowe",
    },
    sessionInfo: {
      title: "Informacje o sesji",
      description: "Szczegóły sesji użytkownika",
      expiresAt: "Sesja wygasa",
      rememberMeActive: "Status zapamiętaj mnie",
      loginLocation: "Lokalizacja logowania",
    },
    nextSteps: {
      title: "Następne kroki",
      item: "Następne kroki",
    },
  },
  errors: {
    title: "Błąd logowania",
    account_locked: "Konto jest zablokowane",
    accountLocked: "Konto jest zablokowane",
    accountLockedDescription:
      "Twoje konto zostało zablokowane. Skontaktuj się z pomocą techniczną.",
    invalid_credentials: "Nieprawidłowy e-mail lub hasło",
    two_factor_required: "Wymagana dwuskładnikowa autoryzacja",
    auth_error: "Wystąpił błąd uwierzytelniania",
    user_not_found: "Użytkownik nie znaleziony",
    session_creation_failed: "Nie udało się utworzyć sesji",
    token_save_failed: "Nie udało się zapisać tokenu uwierzytelniania",
    validation: {
      title: "Walidacja nie powiodła się",
      description: "Sprawdź swoje dane wejściowe",
    },
    unauthorized: {
      title: "Logowanie nie powiodło się",
      description: "Nieprawidłowe dane logowania",
    },
    unknown: {
      title: "Błąd logowania",
      description: "Wystąpił błąd podczas logowania",
    },
    network: {
      title: "Błąd sieci",
      description: "Połączenie nie powiodło się",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Logowanie nie jest dozwolone",
    },
    notFound: {
      title: "Użytkownik nie znaleziony",
      description: "Konto użytkownika nie zostało znalezione",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Zmiany nie zostały zapisane",
    },
    conflict: {
      title: "Konflikt logowania",
      description: "Wykryto konflikt logowania",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
  },
  success: {
    title: "Zalogowano pomyślnie",
    description: "Jesteś teraz zalogowany",
    message: "Witaj ponownie! Zalogowałeś się pomyślnie.",
  },
  token: {
    save: {
      failed: "Nie udało się zapisać tokenu uwierzytelniania",
      success: "Token uwierzytelniania został pomyślnie zapisany",
    },
  },
  process: {
    failed: "Proces logowania nie powiódł się",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
};
