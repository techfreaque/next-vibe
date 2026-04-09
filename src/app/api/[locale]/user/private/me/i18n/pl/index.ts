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
      id: "ID użytkownika",
      leadId: "ID leadu",
      isPublic: "Profil publiczny",
      email: "Adres e-mail",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      locale: "Lokalizacja",
      isActive: "Status aktywny",
      emailVerified: "E-mail zweryfikowany",
      requireTwoFactor: "Wymagana autoryzacja dwuskładnikowa",
      marketingConsent: "Zgoda marketingowa",
      userRoles: "Role użytkownika",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      stripeCustomerId: "ID klienta Stripe",
      bio: "Bio",
      websiteUrl: "Strona internetowa",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Kolor akcentu",
      creatorHeaderImageUrl: "Obraz nagłówka",
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
      profileInfo: {
        title: "Profil twórcy",
        description:
          "Bio, linki społecznościowe i branding dla stron Twoich skilli",
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
        label: "Subskrybuj newsletter",
        description:
          "Sporadyczne aktualizacje o nowych modelach i funkcjach. Bez spamu, tylko to co ważne.",
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
      websiteUrl: {
        label: "Strona internetowa",
        description: "Twoja strona osobista lub firmowa",
        placeholder: "https://twojastrona.pl",
      },
      twitterUrl: {
        label: "X / Twitter",
        description: "URL Twojego profilu X (Twitter)",
        placeholder: "https://x.com/twojhandle",
      },
      youtubeUrl: {
        label: "YouTube",
        description: "URL Twojego kanału YouTube",
        placeholder: "https://youtube.com/@twójkanał",
      },
      instagramUrl: {
        label: "Instagram",
        description: "URL Twojego profilu Instagram",
        placeholder: "https://instagram.com/twojhandle",
      },
      tiktokUrl: {
        label: "TikTok",
        description: "URL Twojego profilu TikTok",
        placeholder: "https://tiktok.com/@twojhandle",
      },
      githubUrl: {
        label: "GitHub",
        description: "URL Twojego profilu GitHub",
        placeholder: "https://github.com/twójlogin",
      },
      discordUrl: {
        label: "Discord",
        description: "Link do Twojego serwera lub profilu Discord",
        placeholder: "https://discord.gg/twójserwer",
      },
      creatorAccentColor: {
        label: "Kolor akcentu",
        description: "Kolor hex dla brandingu strony skilla (opcjonalnie)",
        placeholder: "#7c3aed",
      },
      creatorHeaderImageUrl: {
        label: "Obraz nagłówka",
        description: "URL obrazu bannera dla hero Twojej strony skilla",
        placeholder: "https://twojastrona.pl/banner.jpg",
      },
    },
    response: {
      title: "Zaktualizowany profil",
      description: "Twoje zaktualizowane informacje o profilu",
      success: "Aktualizacja pomyślna",
      message: "Twój profil został pomyślnie zaktualizowany",
      id: "ID użytkownika",
      leadId: "ID leadu",
      isPublic: "Profil publiczny",
      email: "Adres e-mail",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      locale: "Lokalizacja",
      isActive: "Status aktywny",
      emailVerified: "E-mail zweryfikowany",
      requireTwoFactor: "Wymagana autoryzacja dwuskładnikowa",
      marketingConsent: "Zgoda marketingowa",
      userRoles: "Role użytkownika",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      stripeCustomerId: "ID klienta Stripe",
      bio: "Bio",
      websiteUrl: "Strona internetowa",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Kolor akcentu",
      creatorHeaderImageUrl: "Obraz nagłówka",
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

  widget: {
    save: "Zapisz profil",
    saving: "Zapisywanie...",
    editProfile: "Edytuj profil",
    cancelEdit: "Anuluj",
    memberSince: "Członek od",
    profileCard: {
      title: "Profil twórcy",
      description: "Twoja publiczna tożsamość na platformie",
    },
    socialCard: {
      title: "Social linki",
      description: "Połącz swoje platformy",
    },
    emailCard: {
      title: "Lista mailingowa",
      description: "Rozwijaj publiczność dzięki przechwytywaniu leadów",
    },
    previewCard: {
      title: "Twój publiczny profil",
      description: "Tak widzą cię inni",
    },
    noPreview: "Uzupełnij profil, aby zobaczyć podgląd",
    noSocials: "Nie dodano jeszcze żadnych linków społecznościowych",
    viewPublicProfile: "Zobacz publiczny profil",
  },

  // Sub-routes
  avatar: avatarTranslations,
  password: passwordTranslations,
};
