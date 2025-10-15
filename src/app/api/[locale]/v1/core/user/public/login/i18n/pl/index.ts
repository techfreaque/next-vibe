import { translations as optionsTranslations } from "../../options/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Logowanie",
  description: "Endpoint logowania użytkownika",
  tag: "Uwierzytelnianie",
  options: optionsTranslations,
  fields: {
    email: {
      label: "E-mail",
      description: "Adres e-mail użytkownika",
      placeholder: "Wprowadź e-mail",
      help: "Wprowadź adres e-mail powiązany z Twoim kontem",
      validation: {
        invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Hasło",
      description: "Hasło użytkownika",
      placeholder: "Wprowadź hasło",
      help: "Wprowadź hasło do swojego konta",
      validation: {
        minLength: "Hasło musi mieć co najmniej 8 znaków",
      },
    },
    rememberMe: {
      label: "Zapamiętaj mnie",
      description: "Zostaw mnie zalogowanego",
      placeholder: "Zapamiętaj mnie",
      help: "Pozostań zalogowany na tym urządzeniu dla łatwiejszego dostępu",
    },
    leadId: {
      label: "ID Lead",
      description: "Opcjonalny identyfikator lead",
      placeholder: "Wprowadź ID lead",
      help: "Opcjonalny identyfikator lead dla śledzenia",
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
      item: "Następne kroki",
    },
  },
  errors: {
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
    title: "Logowanie pomyślne",
    description: "Zostałeś zalogowany",
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
