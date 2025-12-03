import { translations as avatarTranslations } from "../../avatar/i18n/pl";
import { translations as passwordTranslations } from "../../password/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes - typed from English
  get: {
    title: "Pobierz profil użytkownika",
    description: "Pobierz aktualne informacje o profilu użytkownika",
    response: {
      title: "Odpowiedź profilu użytkownika",
      description: "Aktualne dane profilu użytkownika",
      user: {
        title: "Informacje o użytkowniku",
        description: "Szczegóły profilu użytkownika",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Profil użytkownika nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
    success: {
      title: "Sukces",
      description: "Profil pobrano pomyślnie",
    },
  },
  update: {
    title: "Aktualizuj profil użytkownika",
    description: "Aktualizuj aktualne informacje o profilu użytkownika",
    groups: {
      basicInfo: {
        title: "Podstawowe informacje",
        description: "Zaktualizuj swoje podstawowe informacje profilowe",
      },
      profileDetails: {
        title: "Szczegóły profilu",
        description: "Zarządzaj szczegółami profilu i ustawieniami",
      },
      privacySettings: {
        title: "Ustawienia prywatności",
        description: "Kontroluj, kto może zobaczyć informacje o Twoim profilu",
      },
    },
    fields: {
      email: {
        label: "Adres e-mail",
        description: "Twój adres e-mail",
        placeholder: "Wprowadź swój adres e-mail",
        help: "Twój adres e-mail będzie używany do powiadomień o koncie i komunikacji",
        validation: {
          invalid: "Wprowadź prawidłowy adres e-mail",
        },
      },
      privateName: {
        label: "Nazwa prywatna",
        description: "Twoja nazwa wewnętrzna/prywatna",
        placeholder: "Wprowadź swoją nazwę prywatną",
        help: "Twoja prywatna nazwa jest używana wewnętrznie i do prywatnej komunikacji",
        validation: {
          minLength: "Nazwa prywatna musi mieć co najmniej 2 znaki",
          maxLength: "Nazwa prywatna nie może przekraczać 50 znaków",
        },
      },
      publicName: {
        label: "Nazwa publiczna",
        description: "Twoja publiczna nazwa wyświetlana",
        placeholder: "Wprowadź swoją nazwę publiczną",
        help: "Twoja publiczna nazwa będzie widoczna dla innych użytkowników",
        validation: {
          minLength: "Nazwa publiczna musi mieć co najmniej 2 znaki",
          maxLength: "Nazwa publiczna nie może przekraczać 50 znaków",
        },
      },
      imageUrl: {
        label: "Zdjęcie profilowe",
        description: "URL do twojego zdjęcia profilowego",
        placeholder: "Wprowadź URL zdjęcia",
        help: "Podaj URL do zdjęcia, które będzie wyświetlane jako twoje zdjęcie profilowe",
        validation: {
          invalid: "Podaj prawidłowy URL zdjęcia",
        },
      },
      company: {
        label: "Firma",
        description: "Nazwa twojej firmy",
        placeholder: "Wprowadź nazwę firmy",
        help: "Nazwa firmy będzie wyświetlana w profilu",
        validation: {
          maxLength: "Nazwa firmy nie może przekraczać 100 znaków",
        },
      },
      visibility: {
        label: "Widoczność profilu",
        description: "Kto może widzieć twój profil",
        placeholder: "Wybierz ustawienie widoczności",
        help: "Wybierz, kto może przeglądać twój profil: publiczny (wszyscy), prywatny (tylko ty) lub tylko kontakty",
      },
      marketingConsent: {
        label: "Zgoda marketingowa",
        description: "Otrzymuj komunikację marketingową",
        placeholder: "Włącz e-maile marketingowe",
        help: "Wybierz, czy chcesz otrzymywać e-maile marketingowe i komunikaty promocyjne",
      },
      bio: {
        label: "Bio",
        description: "Krótki opis o sobie",
        placeholder: "Opowiedz nam o sobie...",
        help: "Udostępnij krótki opis o sobie, który będzie widoczny w profilu",
        validation: {
          maxLength: "Bio nie może przekraczać 500 znaków",
        },
      },
    },
    response: {
      title: "Zaktualizowany profil",
      description: "Twoje zaktualizowane informacje o profilu",
      success: "Aktualizacja pomyślna",
      message: "Twój profil został pomyślnie zaktualizowany",
      user: "Zaktualizowane informacje o użytkowniku",
      changesSummary: {
        title: "Podsumowanie zmian",
        description: "Podsumowanie zmian w profilu",
        totalChanges: "Całkowite zmiany",
        changedFields: "Zmienione pola",
        verificationRequired: "Wymagana weryfikacja",
        lastUpdated: "Ostatnio zaktualizowano",
      },
      nextSteps: "Następne kroki",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Profil użytkownika nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
    success: {
      title: "Sukces",
      description: "Profil zaktualizowano pomyślnie",
      nextSteps: "Zalecane następne kroki po aktualizacji profilu",
    },
  },
  delete: {
    title: "Usuń konto użytkownika",
    description: "Trwale usuń swoje konto użytkownika",
    response: {
      title: "Status usunięcia",
      description: "Potwierdzenie usunięcia konta",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konto użytkownika nie zostało znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
    success: {
      title: "Sukces",
      description: "Konto usunięto pomyślnie",
    },
  },
  put: {
    response: {
      changedFields: {
        item: "Zmienione pole",
      },
    },
  },
  category: "Profil użytkownika",
  tag: "Profil użytkownika",
  tags: {
    profile: "profil",
    user: "użytkownik",
    account: "konto",
  },

  // Sub-routes
  avatar: avatarTranslations,
  password: passwordTranslations,
};
