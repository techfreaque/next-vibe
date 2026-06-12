import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  auth: {
    category: "Uwierzytelnianie",
    search: {
      tag: "Auth",
    },
    authClient: {
      errors: {
        status_save_failed: "Nie udało się zapisać statusu uwierzytelniania",
        status_remove_failed: "Nie udało się usunąć statusu uwierzytelniania",
        status_check_failed: "Nie udało się sprawdzić statusu uwierzytelniania",
        token_save_failed: "Nie udało się zapisać tokenu uwierzytelniania",
        token_get_failed: "Nie udało się pobrać tokenu uwierzytelniania",
        token_remove_failed: "Nie udało się usunąć tokenu uwierzytelniania",
      },
    },
    errors: {
      token_generation_failed:
        "Nie udało się wygenerować tokenu uwierzytelniania",
      invalid_session: "Sesja jest nieprawidłowa lub wygasła",
      missing_request_context: "Kontekst żądania jest brakujący",
      missing_locale: "Brak locale w żądaniu",
      unsupported_platform: "Platforma nie jest obsługiwana",
      session_retrieval_failed: "Nie udało się pobrać sesji",
      missing_token: "Token uwierzytelniania jest brakujący",
      invalid_token_signature: "Podpis tokenu jest nieprawidłowy",
      jwt_payload_missing_id: "JWT payload brakuje ID użytkownika",
      cookie_set_failed: "Nie udało się ustawić cookie uwierzytelniania",
      cookie_clear_failed: "Nie udało się usunąć cookie uwierzytelniania",
      publicPayloadNotSupported:
        "Publiczny payload JWT nie jest obsługiwany dla uwierzytelniania CLI",
      jwt_signing_failed: "Nie udało się podpisać tokenu JWT",
      authentication_failed: "Uwierzytelnianie nie powiodło się",
      user_not_authenticated: "Użytkownik nie jest uwierzytelniony",
      publicUserNotAllowed:
        "Użytkownik publiczny nie jest dozwolony dla tego endpointu",
      validation_failed: "Walidacja nie powiodła się",
      failed_to_create_lead: "Nie udało się utworzyć leada",
      native: {
        unsupported:
          "Ta metoda uwierzytelniania nie jest obsługiwana w React Native",
        storage_failed: "Nie udało się zapisać danych uwierzytelniania",
        clear_failed: "Nie udało się wyczyścić danych uwierzytelniania",
      },
      not_implemented_native:
        "Ta funkcja nie jest jeszcze zaimplementowana dla React Native",
      unknownError: "Wystąpił nieznany błąd podczas uwierzytelniania",
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
        missing_locale: {
          title: "Brak locale",
          description: "Parametr locale jest wymagany",
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
        token_generation_failed: {
          title: "Generowanie tokenu nie powiodło się",
          description: "Nie udało się wygenerować tokenu uwierzytelniania",
        },
        invalid_session: {
          title: "Nieprawidłowa sesja",
          description: "Sesja jest nieprawidłowa lub wygasła",
        },
        missing_request_context: {
          title: "Brak kontekstu żądania",
          description: "Kontekst żądania jest brakujący",
        },
        unsupported_platform: {
          title: "Nieobsługiwana platforma",
          description: "Platforma nie jest obsługiwana",
        },
        session_retrieval_failed: {
          title: "Pobieranie sesji nie powiodło się",
          description: "Nie udało się pobrać sesji",
        },
        missing_token: {
          title: "Brak tokenu",
          description: "Token uwierzytelniania jest brakujący",
        },
        invalid_token_signature: {
          title: "Nieprawidłowy podpis tokenu",
          description: "Podpis tokenu jest nieprawidłowy",
        },
        jwt_payload_missing_id: {
          title: "Brak ID w payload JWT",
          description: "Payload JWT nie zawiera ID użytkownika",
        },
        cookie_set_failed: {
          title: "Ustawienie cookie nie powiodło się",
          description: "Nie udało się ustawić cookie uwierzytelniania",
        },
        cookie_clear_failed: {
          title: "Wyczyszczenie cookie nie powiodło się",
          description: "Nie udało się wyczyścić cookie uwierzytelniania",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
    check: {
      get: {
        title: "Sprawdź uwierzytelnianie",
        description: "Sprawdź aktualny status uwierzytelniania",
        response: {
          title: "Status uwierzytelniania",
          description: "Aktualny stan uwierzytelniania",
          authenticated: "Uwierzytelniony",
          tokenValid: "Token ważny",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "Brak autoryzacji",
        forbidden: "Zabronione",
        invalidToken: "Nieprawidłowy token",
        tokenExpired: "Token wygasł",
        serverError: "Błąd serwera",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start:
          "getAuthMinimalUserNext: - Sprawdzanie autentykacji jako pierwsze",
        result: "getAuthMinimalUserNext: wynik getCurrentUserNext",
        authenticated:
          "getAuthMinimalUserNext: Użytkownik jest uwierzytelniony, pobieranie leadId",
        returningAuth:
          "getAuthMinimalUserNext: Zwracanie uwierzytelnionego użytkownika",
        notAuthenticated:
          "getAuthMinimalUserNext: Użytkownik nie uwierzytelniony, zwracanie użytkownika publicznego",
      },
      signingJwt: "Podpisywanie JWT",
      jwtSignedSuccessfully: "JWT pomyślnie podpisany",
      errorSigningJwt: "Błąd podczas podpisywania JWT",
      verifyingJwt: "Weryfikacja JWT",
      invalidTokenPayload: "Nieprawidłowe dane tokenu",
      jwtVerifiedSuccessfully: "JWT pomyślnie zweryfikowany",
      errorVerifyingJwt: "Błąd podczas weryfikacji JWT",
      userIdNotExistsInDb: "ID użytkownika nie istnieje w bazie danych",
      sessionNotFound: "Sesja nie została znaleziona",
      sessionExpired: "Sesja wygasła",
      errorValidatingUserSession: "Błąd podczas walidacji sesji użytkownika",
      errorGettingUserRoles: "Błąd podczas pobierania ról użytkownika",
      errorCheckingUserAuth:
        "Błąd podczas sprawdzania uwierzytelniania użytkownika",
      gettingCurrentUserFromTrpc: "Pobieranie bieżącego użytkownika z tRPC",
      errorGettingAuthUserForTrpc:
        "Błąd podczas pobierania użytkownika auth dla tRPC",
      errorGettingUserRolesForTrpc:
        "Błąd podczas pobierania ról użytkownika dla tRPC",
      authenticatingCliUserWithPayload:
        "Uwierzytelnianie użytkownika CLI z danymi",
      errorAuthenticatingCliUserWithPayload:
        "Błąd podczas uwierzytelniania użytkownika CLI z danymi",
      creatingCliToken: "Tworzenie tokenu CLI",
      errorCreatingCliToken: "Błąd podczas tworzenia tokenu CLI",
      validatingCliToken: "Walidacja tokenu CLI",
      errorValidatingCliToken: "Błąd podczas walidacji tokenu CLI",
      gettingCurrentUserFromNextjs:
        "Pobieranie bieżącego użytkownika z Next.js",
      errorGettingAuthUserForNextjs:
        "Błąd podczas pobierania użytkownika auth dla Next.js",
      settingNextjsAuthCookies: "Ustawianie cookies auth Next.js",
      clearingNextjsAuthCookies: "Czyszczenie cookies auth Next.js",
      gettingCurrentUserFromToken: "Pobieranie bieżącego użytkownika z tokenu",
      errorGettingCurrentUserFromCli:
        "Błąd podczas pobierania bieżącego użytkownika z CLI",
      errorGettingAuthUserForCli:
        "Błąd podczas pobierania użytkownika auth dla CLI",
      errorGettingUserRolesForCli:
        "Błąd podczas pobierania ról użytkownika dla CLI",
      tokenFromAuthHeader: "Token z nagłówka auth",
      tokenFromCookie: "Token z cookie",
      noTokenFound: "Nie znaleziono tokenu",
      errorExtractingToken: "Błąd podczas wyodrębniania tokenu",
      errorParsingCookies: "Błąd podczas parsowania cookies",
      errorGettingCurrentUserFromTrpc:
        "Błąd podczas pobierania bieżącego użytkownika z tRPC",
    },
  },
  private: {
    logout: {
      title: "Wylogowanie Użytkownika",
      description: "Wylogowuje bieżącego użytkownika i unieważnia jego sesję",
      category: "Zarządzanie Użytkownikami",
      tag: "wylogowanie",
      logoutButton: "Wyloguj",
      loggingOut: "Wylogowywanie...",
      response: {
        title: "Odpowiedź Wylogowania",
        description: "Odpowiedź wskazująca pomyślne wylogowanie",
        success: "Sukces",
        message: "Wiadomość",
        sessionsCleaned: "Sesje wyczyszczone",
        nextSteps: "Zalecane kolejne kroki po wylogowaniu",
      },
      errors: {
        validation: {
          title: "Błąd Walidacji",
          description: "Żądanie wylogowania zawiera nieprawidłowe dane",
        },
        unauthorized: {
          title: "Brak Autoryzacji",
          description: "Musisz być zalogowany, aby się wylogować",
        },
        internal: {
          title: "Wewnętrzny Błąd Serwera",
          description: "Wystąpił błąd wewnętrzny podczas wylogowywania",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieoczekiwany błąd podczas wylogowywania",
        },
        session_deletion_failed: {
          title: "Usuwanie Sesji Nie Powiodło Się",
          description: "Nie udało się usunąć sesji użytkownika",
        },
        conflict: {
          title: "Konflikt Wylogowania",
          description: "Wystąpił konflikt podczas wylogowywania",
        },
        forbidden: {
          title: "Zabronione",
          description: "Akcja wylogowania jest zabroniona",
        },
        network_error: {
          title: "Błąd Sieci",
          description: "Błąd sieci podczas wylogowywania",
        },
        not_found: {
          title: "Nie Znaleziono",
          description: "Sesja nie została znaleziona",
        },
        server_error: {
          title: "Błąd Serwera",
          description: "Wewnętrzny błąd serwera podczas wylogowywania",
        },
        unsaved_changes: {
          title: "Niezapisane Zmiany",
          description: "Istnieją niezapisane zmiany",
        },
        invalid_user: {
          title: "Nieprawidłowy Użytkownik",
          description: "Użytkownik jest nieprawidłowy lub nie istnieje",
        },
      },
      success: {
        title: "Wylogowanie Pomyślne",
        description: "Zostałeś pomyślnie wylogowany",
        message: "Użytkownik został pomyślnie wylogowany",
      },
    },
    me: {
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
          facebookUrl: "Facebook",
          discordUrl: "Discord",
          tribeUrl: "Tribe",
          rumbleUrl: "Rumble",
          odyseeUrl: "Odysee",
          nostrUrl: "Nostr",
          gabUrl: "Gab",
          creatorSlug: "URL profilu",
          creatorAccentColor: "Kolor akcentu",
          creatorHeaderImageUrl: "Obraz nagłówka",
          avatarUrl: "Zdjęcie profilowe",
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
            description:
              "Kontroluj, kto może zobaczyć informacje o Twoim profilu",
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
          facebookUrl: {
            label: "Facebook",
            description: "URL Twojej strony lub profilu na Facebooku",
            placeholder: "https://facebook.com/twojastrona",
          },
          discordUrl: {
            label: "Discord",
            description: "Link do Twojego serwera lub profilu Discord",
            placeholder: "https://discord.gg/twójserwer",
          },
          tribeUrl: {
            label: "Tribe",
            description: "URL Twojej społeczności Tribe",
            placeholder: "https://twojaspolecznosc.tribe.so",
          },
          rumbleUrl: {
            label: "Rumble",
            description: "URL Twojego kanalu Rumble",
            placeholder: "https://rumble.com/c/twojkanal",
          },
          odyseeUrl: {
            label: "Odysee",
            description: "URL Twojego kanalu Odysee",
            placeholder: "https://odysee.com/@twojkanal",
          },
          nostrUrl: {
            label: "Nostr",
            description: "Twoj profil Nostr lub adres npub",
            placeholder: "https://primal.net/p/npub1...",
          },
          gabUrl: {
            label: "Gab",
            description: "URL Twojego profilu Gab",
            placeholder: "https://gab.com/twojhandle",
          },
          creatorSlug: {
            label: "URL profilu",
            description:
              "Twój unikalny adres profilu widoczny w publicznym linku",
            placeholder: "jane-doe",
            validation: {
              invalid: "Tylko małe litery, cyfry i myślniki są dozwolone",
            },
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
          facebookUrl: "Facebook",
          discordUrl: "Discord",
          tribeUrl: "Tribe",
          rumbleUrl: "Rumble",
          odyseeUrl: "Odysee",
          nostrUrl: "Nostr",
          gabUrl: "Gab",
          creatorSlug: "URL profilu",
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
          title: "Twoja lista e-mail",
          description:
            "Odwiedzający Twoją stronę skilla i profil twórcy mogą się zapisać. Lista jest Twoja - bez pośredników.",
        },
        previewCard: {
          title: "Twój publiczny profil",
          description: "Tak widzą cię inni",
        },
        noPreview: "Uzupełnij profil, aby zobaczyć podgląd",
        noSocials: "Nie dodano jeszcze żadnych linków społecznościowych",
        viewPublicProfile: "Zobacz publiczny profil",
        profileUrl: "Twój link",
        slugWarning:
          "Zmiana tego adresu URL spowoduje, że wszystkie istniejące linki do Twojego profilu przestaną działać.",
        bioPreview: "Podgląd",
        bioEdit: "Edytuj",
        skills: {
          title: "Moje Skille",
          chat: "Czatuj teraz",
          add: "Dodaj do kolekcji",
          public: "Społeczność",
          showLess: "Pokaż mniej",
        },
        deleteAccount: {
          dangerZone: "Strefa zagrożenia",
          button: "Usuń konto",
          confirmTitle: "Trwale usuń swoje konto",
          confirmDescription:
            "Twoje konto i wszystkie powiązane dane zostaną nieodwracalnie usunięte. Bez możliwości przywrócenia.",
          confirmLabel: 'Wpisz "DELETE" aby potwierdzić',
          confirmPlaceholder: "DELETE",
          confirmButton: "Usuń moje konto na zawsze",
          cancelButton: "Anuluj",
          whatGetsDeleted: "Co zostanie usunięte:",
          items: {
            profile: "Twój profil i wszystkie ustawienia",
            chats: "Cała historia czatów i wątki",
            skills: "Wszystkie własne skille i konfiguracje",
            files: "Wszystkie pliki cortex i wspomnienia",
            subscriptions: "Aktywne subskrypcje",
            credits: "Pozostałe kredyty",
          },
          deleting: "Usuwanie...",
          success: "Konto usunięte. Przekierowanie...",
        },
      },

      // Sub-routes
      avatar: {
        category: "Profil użytkownika",

        tag: "awatar",
        errors: {
          user_not_found: "Użytkownik nie znaleziony",
          failed_to_upload_avatar: "Nie udało się przesłać awatara",
          failed_to_delete_avatar: "Nie udało się usunąć awatara",
          invalid_file_type: "Nieprawidłowy typ pliku",
          file_too_large: "Plik zbyt duży",
        },
        debug: {
          uploadingUserAvatar: "Przesyłanie awatara użytkownika",
          errorUploadingUserAvatar:
            "Błąd podczas przesyłania awatara użytkownika",
          deletingUserAvatar: "Usuwanie awatara użytkownika",
          errorDeletingUserAvatar: "Błąd podczas usuwania awatara użytkownika",
        },
        success: {
          uploaded: "Awatar przesłany pomyślnie",
          deleted: "Awatar usunięty pomyślnie",
          nextSteps: {
            visible: "Twój awatar jest teraz widoczny w Twoim profilu",
            update:
              "Możesz go zaktualizować w dowolnym momencie w ustawieniach profilu",
            default: "Twój profil teraz pokazuje domyślny awatar",
            uploadNew:
              "Możesz przesłać nowy awatar w dowolnym momencie w ustawieniach profilu",
          },
        },
        upload: {
          title: "Prześlij Awatar",
          description: "Prześlij zdjęcie profilowe",
          groups: {
            fileUpload: {
              title: "Przesyłanie Pliku",
              description: "Wybierz i prześlij zdjęcie awatara",
            },
          },
          fields: {
            file: {
              label: "Zdjęcie Awatara",
              description: "Wybierz plik obrazu dla swojego awatara",
              placeholder: "Wybierz plik obrazu...",
              help: "Prześlij plik obrazu (JPG, PNG, GIF) do 5MB",
              validation: {
                maxSize: "Rozmiar pliku musi być mniejszy niż 5MB",
                imageOnly: "Dozwolone są tylko pliki obrazów",
                unsupportedFormat:
                  "Nieobsługiwany format obrazu. Użyj JPEG, PNG, WebP lub GIF.",
              },
            },
          },
          response: {
            title: "Odpowiedź Przesyłania",
            label: "Wynik Przesyłania",
            description: "Odpowiedź przesyłania awatara",
            success: "Przesyłanie Pomyślne",
            message: "Twój awatar został pomyślnie przesłany",
            avatarUrl: "URL Awatara",
            uploadTime: "Czas Przesyłania",
            nextSteps: {
              item: "Następny Krok",
            },
          },
          errors: {
            validation: {
              title: "Błąd Walidacji",
              description: "Przesłany plik jest nieprawidłowy lub uszkodzony",
            },
            unauthorized: {
              title: "Brak Autoryzacji",
              description: "Musisz być zalogowany, aby przesłać awatar",
            },
            server: {
              title: "Błąd Serwera",
              description: "Nie udało się przetworzyć przesyłania awatara",
            },
            internal: {
              title: "Błąd Wewnętrzny",
              description: "Wystąpił wewnętrzny błąd serwera",
            },
            unknown: {
              title: "Nieznany Błąd",
              description: "Wystąpił nieoczekiwany błąd podczas przesyłania",
            },
            network: {
              title: "Błąd Sieci",
              description: "Wystąpił błąd sieci podczas przesyłania",
            },
            forbidden: {
              title: "Zabronione",
              description: "Nie masz uprawnień do przesyłania awatara",
            },
            notFound: {
              title: "Nie Znaleziono",
              description: "Żądany zasób nie został znaleziony",
            },
            unsaved: {
              title: "Niezapisane Zmiany",
              description: "Istnieją niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt",
              description: "Wystąpił konflikt podczas przesyłania",
            },
          },
          success: {
            title: "Awatar Przesłany",
            description: "Twoje zdjęcie profilowe zostało pomyślnie przesłane",
          },
        },
        delete: {
          title: "Usuń Awatar",
          description: "Usuń obecne zdjęcie profilowe",
          response: {
            title: "Odpowiedź Usuwania",
            label: "Wynik Usuwania",
            description: "Odpowiedź usuwania awatara",
            success: "Usuwanie Pomyślne",
            message: "Twój awatar został pomyślnie usunięty",
            nextSteps: {
              item: "Następny Krok",
            },
          },
          errors: {
            validation: {
              title: "Błąd Walidacji",
              description: "Żądanie usunięcia awatara jest nieprawidłowe",
            },
            unauthorized: {
              title: "Brak Autoryzacji",
              description: "Musisz być zalogowany, aby usunąć swój awatar",
            },
            server: {
              title: "Błąd Serwera",
              description: "Nie udało się usunąć awatara",
            },
            internal: {
              title: "Błąd Wewnętrzny",
              description: "Wystąpił wewnętrzny błąd serwera",
            },
            unknown: {
              title: "Nieznany Błąd",
              description: "Wystąpił nieoczekiwany błąd podczas usuwania",
            },
            network: {
              title: "Błąd Sieci",
              description: "Wystąpił błąd sieci podczas usuwania",
            },
            forbidden: {
              title: "Zabronione",
              description: "Nie masz uprawnień do usuwania tego awatara",
            },
            notFound: {
              title: "Nie Znaleziono",
              description: "Awatar do usunięcia nie został znaleziony",
            },
            unsaved: {
              title: "Niezapisane Zmiany",
              description: "Istnieją niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt",
              description: "Wystąpił konflikt podczas usuwania",
            },
          },
          success: {
            title: "Awatar Usunięty",
            description: "Twoje zdjęcie profilowe zostało pomyślnie usunięte",
          },
        },
      },
      password: {
        category: "Profil użytkownika",

        title: "Zmień Hasło",
        description: "Bezpiecznie zaktualizuj hasło do swojego konta",
        tag: "zmiana-hasła",
        debug: {
          updatingPassword: "Aktualizowanie hasła",
          errorUpdatingPassword: "Błąd podczas aktualizacji hasła",
          settingPassword: "Ustawianie hasła",
          errorSettingPassword: "Błąd podczas ustawiania hasła",
        },
        groups: {
          currentCredentials: {
            title: "Obecne Hasło",
            description: "Zweryfikuj swoje obecne hasło, aby kontynuować",
          },
          newCredentials: {
            title: "Nowe Hasło",
            description: "Wybierz silne nowe hasło dla swojego konta",
          },
        },
        currentPassword: {
          label: "Obecne Hasło",
          description: "Wprowadź swoje obecne hasło",
          placeholder: "Wprowadź obecne hasło",
          help: "Wprowadź swoje obecne hasło, aby zweryfikować swoją tożsamość przed zmianą",
        },
        newPassword: {
          label: "Nowe Hasło",
          description: "Wprowadź nowe hasło (minimum 8 znaków)",
          placeholder: "Wprowadź nowe hasło",
          help: "Wybierz silne hasło z co najmniej 8 znakami, w tym literami, cyframi i symbolami",
        },
        confirmPassword: {
          label: "Potwierdź Hasło",
          description: "Potwierdź swoje nowe hasło",
          placeholder: "Potwierdź nowe hasło",
          help: "Ponownie wprowadź nowe hasło, aby upewnić się, że zostało wpisane poprawnie",
        },
        twoFactorCode: {
          label: "Kod Dwuskładnikowy",
          description:
            "Wprowadź kod uwierzytelniania dwuskładnikowego, jeśli jest włączony",
          placeholder: "Wprowadź kod 2FA",
        },
        response: {
          title: "Odpowiedź Zmiany Hasła",
          description: "Odpowiedź na operację zmiany hasła",
          success: "Hasło zostało pomyślnie zaktualizowane",
          message: "Wiadomość o statusie",
          securityTip: "Wskazówka bezpieczeństwa",
          nextSteps: {
            item: "Następne kroki",
          },
        },
        validation: {
          currentPassword: {
            minLength: "Obecne hasło musi mieć co najmniej 8 znaków",
          },
          newPassword: {
            minLength: "Nowe hasło musi mieć co najmniej 8 znaków",
          },
          confirmPassword: {
            minLength: "Potwierdzenie hasła musi mieć co najmniej 8 znaków",
          },
          passwords: {
            mismatch: "Hasła nie są zgodne",
          },
        },
        errors: {
          passwords_do_not_match: "Hasła nie pasują do siebie",
          user_not_found: "Użytkownik nie znaleziony",
          incorrect_password: "Nieprawidłowe hasło",
          update_failed: "Nie udało się zaktualizować hasła",
          token_creation_failed: "Nie udało się utworzyć tokenu hasła",
          two_factor_code_required:
            "Wymagany kod uwierzytelniania dwuskładnikowego",
          invalid_two_factor_code:
            "Nieprawidłowy kod uwierzytelniania dwuskładnikowego",
          invalid_request: {
            title: "Nieprawidłowe Żądanie",
            description: "Żądanie zmiany hasła jest nieprawidłowe",
          },
          validation: {
            title: "Błąd Walidacji",
            description: "Sprawdź swoje dane i spróbuj ponownie",
          },
          unauthorized: {
            title: "Brak Autoryzacji",
            description: "Musisz być zalogowany, aby zmienić hasło",
          },
          server: {
            title: "Błąd Serwera",
            description:
              "Nie udało się zaktualizować hasła z powodu błędu serwera",
          },
          unknown: {
            title: "Nieznany Błąd",
            description:
              "Wystąpił nieoczekiwany błąd podczas aktualizacji hasła",
          },
          network: {
            title: "Błąd Sieci",
            description: "Połączenie sieciowe nie powiodło się",
          },
          forbidden: {
            title: "Dostęp Zabroniony",
            description: "Nie masz uprawnień do wykonania tej czynności",
          },
          notFound: {
            title: "Użytkownik Nie Znaleziony",
            description: "Nie można znaleźć konta użytkownika",
          },
          unsavedChanges: {
            title: "Niezapisane Zmiany",
            description: "Masz niezapisane zmiany, które zostaną utracone",
          },
          conflict: {
            title: "Konflikt Danych",
            description: "Wystąpił konflikt podczas aktualizacji hasła",
          },
        },
        success: {
          updated: "Hasło zaktualizowane pomyślnie",
          securityTip:
            "Aby zwiększyć bezpieczeństwo, włącz uwierzytelnianie dwuskładnikowe",
          nextSteps: {
            logoutOther:
              "Wszystkie inne sesje zostały wylogowane ze względów bezpieczeństwa",
            enable2fa:
              "Rozważ włączenie uwierzytelniania dwuskładnikowego dla lepszego bezpieczeństwa",
          },
          title: "Hasło Zaktualizowane",
          description: "Twoje hasło zostało pomyślnie zaktualizowane",
        },
        update: {
          success: {
            title: "Hasło Zaktualizowane",
            description: "Twoje hasło zostało pomyślnie zaktualizowane",
          },
          errors: {
            unknown: {
              title: "Nieznany Błąd",
              description:
                "Wystąpił nieoczekiwany błąd podczas aktualizacji hasła",
            },
          },
        },
      },
      addresses: {
        category: "Adresy",
        tag: "addresses",

        list: {
          title: "Moje adresy",
          description: "Lista zapisanych adresów",
          response: {
            addresses: "Adresy",
          },
          widget: {
            addAddress: "Dodaj adres",
            edit: "Edytuj",
            delete: "Usuń",
            billing: "Rozliczeniowy",
            delivery: "Dostawczy",
            empty: "Brak zapisanych adresów",
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Nieprawidłowe żądanie",
            },
            unauthorized: {
              title: "Brak autoryzacji",
              description: "Wymagane logowanie",
            },
            forbidden: { title: "Zabronione", description: "Brak dostępu" },
            notFound: { title: "Nie znaleziono", description: "Brak adresów" },
            conflict: { title: "Konflikt", description: "Konflikt danych" },
            network: {
              title: "Błąd sieci",
              description: "Wystąpił błąd sieci",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Są niezapisane zmiany",
            },
            internal: {
              title: "Błąd serwera",
              description: "Wewnętrzny błąd serwera",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieznany błąd",
            },
          },
          success: { title: "Sukces", description: "Adresy pobrane" },
        },

        create: {
          title: "Dodaj adres",
          description: "Zapisz nowy adres na koncie",
          fields: {
            label: {
              label: "Nazwa",
              description: "Nazwij ten adres (np. Dom, Biuro)",
              placeholder: "Dom",
            },
            fullName: {
              label: "Imię i nazwisko",
              description: "Osoba kontaktowa dla adresu",
              placeholder: "Jan Kowalski",
            },
            company: {
              label: "Firma",
              description: "Nazwa firmy (opcjonalnie)",
              placeholder: "Przykład Sp. z o.o.",
            },
            phone: {
              label: "Telefon",
              description: "Numer kontaktowy",
              placeholder: "+48 22 000 00 00",
            },
            vatNumber: {
              label: "NIP",
              description: "Numer identyfikacji podatkowej VAT",
              placeholder: "PL1234567890",
            },
            taxId: {
              label: "REGON",
              description: "Krajowy identyfikator podatkowy",
              placeholder: "123456789",
            },
            addressLine1: {
              label: "Adres (linia 1)",
              description: "Ulica i numer",
              placeholder: "ul. Przykładowa 1",
            },
            addressLine2: {
              label: "Adres (linia 2)",
              description: "Mieszkanie, piętro (opcjonalnie)",
              placeholder: "m. 5",
            },
            city: {
              label: "Miasto",
              description: "Miasto",
              placeholder: "Warszawa",
            },
            region: {
              label: "Województwo / Region",
              description: "Województwo lub region (opcjonalnie)",
              placeholder: "Mazowieckie",
            },
            postalCode: {
              label: "Kod pocztowy",
              description: "Kod pocztowy",
              placeholder: "00-001",
            },
            country: {
              label: "Kraj",
              description: "Kod kraju ISO 3166-1 alpha-2",
              placeholder: "PL",
            },
            isDefaultBilling: {
              label: "Domyślny adres rozliczeniowy",
              description: "Użyj jako domyślny adres rozliczeniowy",
            },
            isDefaultDelivery: {
              label: "Domyślny adres dostawy",
              description: "Użyj jako domyślny adres dostawy",
            },
          },
          response: {
            id: "ID adresu",
            label: "Nazwa",
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Sprawdź wymagane pola",
            },
            unauthorized: {
              title: "Brak autoryzacji",
              description: "Wymagane logowanie",
            },
            forbidden: { title: "Zabronione", description: "Brak dostępu" },
            notFound: {
              title: "Nie znaleziono",
              description: "Użytkownik nie znaleziony",
            },
            conflict: { title: "Konflikt", description: "Konflikt danych" },
            network: {
              title: "Błąd sieci",
              description: "Wystąpił błąd sieci",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Są niezapisane zmiany",
            },
            internal: {
              title: "Błąd serwera",
              description: "Wewnętrzny błąd serwera",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieznany błąd",
            },
          },
          success: {
            title: "Adres zapisany",
            description: "Adres dodany do konta",
          },
          widget: {
            saved: "Adres zapisany.",
            backToAddresses: "Wróć do adresów",
          },
        },
      },
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "Brak tokenu w ciasteczkach",
        },
      },
      errors: {
        session_not_found: "Sesja nie znaleziona",
        session_lookup_failed: "Wyszukiwanie sesji nie powiodło się",
        expired_sessions_delete_failed:
          "Usuwanie wygasłych sesji nie powiodło się",
        session_creation_failed: "Tworzenie sesji nie powiodło się",
        session_creation_database_error:
          "Błąd bazy danych podczas tworzenia sesji",
        user_sessions_delete_failed:
          "Usuwanie sesji użytkownika nie powiodło się",
        expired: "Sesja wygasła",
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
    sessions: {
      category: "Użytkownicy",

      list: {
        title: "Moje sesje",
        description: "Wyświetl wszystkie aktywne sesje dla Twojego konta",
        tag: "Sesje",
        response: {
          sessions: "Sesje",
        },
        success: {
          title: "Sesje pobrane",
          description: "Twoje aktywne sesje zostały pobrane",
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe żądanie",
          },
          server: {
            title: "Błąd serwera",
            description: "Wewnętrzny błąd serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
          forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie znaleziony",
          },
          conflict: { title: "Konflikt", description: "Konflikt danych" },
        },
      },
      create: {
        title: "Utwórz token sesji",
        description: "Utwórz nazwany token sesji dla programowego dostępu",
        tag: "Sesje",
        form: {
          name: "Nazwa tokena",
          namePlaceholder: "np. Mój bot agenta",
        },
        response: {
          token: "Token",
          id: "ID sesji",
          name: "Nazwa",
          message: "Skopiuj ten token - nie zostanie pokazany ponownie",
        },
        success: {
          title: "Sesja utworzona",
          description: "Twój token sesji został utworzony",
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe żądanie",
          },
          server: {
            title: "Błąd serwera",
            description: "Wewnętrzny błąd serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
          forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie znaleziony",
          },
          conflict: { title: "Konflikt", description: "Konflikt danych" },
        },
      },
      revoke: {
        title: "Unieważnij sesję",
        description: "Unieważnij token sesji według ID",
        tag: "Sesje",
        response: {
          message: "Sesja unieważniona",
        },
        success: {
          title: "Sesja unieważniona",
          description: "Sesja została unieważniona",
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe żądanie",
          },
          server: {
            title: "Błąd serwera",
            description: "Wewnętrzny błąd serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
          forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
          notFound: {
            title: "Nie znaleziono",
            description: "Sesja nie znaleziona",
          },
          conflict: { title: "Konflikt", description: "Konflikt danych" },
        },
      },
    },
  },
  public: {
    login: {
      category: "Użytkownicy",
      title: "Witaj ponownie",
      description:
        "Uzyskaj dostęp do niecenzurowanych modeli AI i historii rozmów.",
      tag: "Uwierzytelnianie",
      options: {
        category: "Użytkownicy",

        title: "Opcje Logowania",
        description: "Opcje konfiguracji logowania",
        tag: "opcje-logowania",
        container: {
          title: "Konfiguracja Logowania",
          description: "Skonfiguruj ustawienia i opcje logowania",
        },
        fields: {
          email: {
            label: "Adres E-mail",
            description: "Wprowadź swój adres e-mail",
            placeholder: "twoj@email.com",
          },
          allowPasswordAuth: {
            label: "Zezwól na Uwierzytelnienie Hasłem",
            description: "Włącz uwierzytelnienie oparte na haśle",
          },
          allowSocialAuth: {
            label: "Zezwól na Uwierzytelnienie Społecznościowe",
            description:
              "Włącz uwierzytelnienie przez dostawców społecznościowych",
          },
          maxAttempts: {
            label: "Maksymalna Liczba Prób Logowania",
            description: "Maksymalna liczba dozwolonych prób logowania",
          },
          requireTwoFactor: {
            label: "Wymagaj Uwierzytelnienie Dwuskładnikowe",
            description: "Wymagaj 2FA do logowania użytkownika",
          },
          socialProviders: {
            label: "Dostawcy Społecznościowi",
            description: "Dostępni dostawcy uwierzytelnienia społecznościowego",
          },
          socialProvider: {
            title: "Dostawca Społecznościowy",
            description:
              "Konfiguracja dostawcy uwierzytelnienia społecznościowego",
            enabled: {
              label: "Włączony",
              description: "Czy ten dostawca jest włączony",
            },
            name: {
              label: "Nazwa Dostawcy",
              description: "Nazwa dostawcy społecznościowego",
            },
            providers: {
              label: "Opcje Dostawcy",
              description: "Dostępne opcje dostawcy społecznościowego",
            },
          },
        },
        response: {
          title: "Odpowiedź Opcji Logowania",
          description: "Dostępne opcje konfiguracji logowania",
          success: {
            badge: "Sukces",
          },
          message: {
            content: "Wiadomość statusu",
          },
          forUser: {
            content: "Adres e-mail",
          },
          loginMethods: {
            title: "Metody Logowania",
            description: "Dostępne metody uwierzytelnienia",
            password: {
              title: "Logowanie hasłem",
              description: "Standardowe uwierzytelnienie hasłem",
              enabled: {
                badge: "Włączone",
              },
            },
            social: {
              title: "Logowanie społecznościowe",
              description: "Opcje uwierzytelnienia społecznościowego",
              enabled: {
                badge: "Włączone",
              },
              providers: {
                item: {
                  title: "Dostawca Społecznościowy",
                  description: "Dostawca uwierzytelnienia społecznościowego",
                },
                name: {
                  content: "Nazwa dostawcy",
                },
                id: {
                  content: "ID dostawcy",
                },
                enabled: {
                  badge: "Dostępny",
                },
                description: "Opis dostawcy",
              },
            },
          },
          security: {
            title: "Ustawienia bezpieczeństwa",
            description: "Podsumowanie wymagań bezpieczeństwa",
            maxAttempts: {
              content: "Maksymalna liczba prób logowania",
            },
            requireTwoFactor: {
              badge: "Wymagane 2FA",
            },
          },
          recommendations: {
            item: "Zalecana opcja logowania",
          },
        },
        errors: {
          validation: {
            title: "Błąd Walidacji",
            description: "Nieprawidłowe parametry żądania",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
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
          unsavedChanges: {
            title: "Niezapisane Zmiany",
            description: "Zmiany nie zostały zapisane",
          },
        },
        success: {
          title: "Sukces",
          description: "Opcje logowania pobrane pomyślnie",
        },
        post: {
          title: "Opcje Logowania",
          description: "Pobierz dostępne opcje logowania",
          response: {
            title: "Odpowiedź Opcji Logowania",
            description: "Dostępne opcje konfiguracji logowania",
          },
          errors: {
            validation: {
              title: "Błąd Walidacji",
              description: "Nieprawidłowe parametry żądania",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie",
            },
            server: {
              title: "Błąd Serwera",
              description: "Wystąpił wewnętrzny błąd serwera",
            },
            unknown: {
              title: "Nieznany Błąd",
              description: "Wystąpił nieznany błąd",
            },
          },
          success: {
            description: "Opcje logowania pobrane pomyślnie",
          },
        },
        enums: {
          socialProviders: {
            google: "Google",
            github: "GitHub",
            facebook: "Facebook",
          },
        },
        messages: {
          successMessage: "Opcje logowania pobrane pomyślnie",
          passwordAuthDescription:
            "Zaloguj się za pomocą adresu e-mail i hasła",
          socialAuthDescription: "Zaloguj się za pomocą kont społecznościowych",
          continueWithProvider: "Kontynuuj z {{provider}}",
          twoFactorRequired: "Zwiększone bezpieczeństwo: wymagane 2FA",
          standardSecurity: "Standardowe wymagania bezpieczeństwa",
          tryPasswordFirst: "Wypróbuj najpierw logowanie hasłem",
          useSocialLogin: "Użyj logowania społecznościowego",
          socialLoginFaster:
            "Logowanie społecznościowe jest szybsze dla nowych użytkowników",
        },
      },
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
      dev: {
        quickLogin: "Szybkie logowanie (Dev)",
      },
    },
    resetPassword: {
      confirm: {
        category: "Użytkownicy",

        title: "Potwierdź resetowanie hasła",
        description: "Potwierdź resetowanie hasła nowym hasłem",
        tag: "Resetowanie hasła",
        email: {
          title: "Hasło zostało zresetowane",
          subject: "Hasło pomyślnie zresetowane - {{appName}}",
          previewText:
            "Hasło {{appName}} zostało zresetowane. Zaloguj się i zacznij rozmawiać z {{modelCount}} modelami AI.",
          greeting: "Hej {{name}},",
          successMessage:
            "Twoje hasło zostało zresetowane. Wszystko gotowe - zaloguj się i kontynuuj od miejsca, w którym skończyłeś.",
          loginButton: "Zaloguj się do {{appName}}",
          promoText: "{{modelCount}} modeli AI. Bez filtrów. Bez cenzury.",
          securityWarning:
            "Nie resetowałeś hasła? Skontaktuj się natychmiast ze wsparciem - Twoje konto może być zagrożone.",
        },
        groups: {
          verification: {
            title: "Weryfikacja",
            description: "Zweryfikuj swoje żądanie resetowania hasła",
          },
          newPassword: {
            title: "Nowe hasło",
            description: "Ustaw swoje nowe hasło",
          },
        },
        fields: {
          token: {
            label: "Token resetowania",
            description: "Token resetowania hasła z Twojego e-maila",
            placeholder: "Wprowadź token resetowania",
            help: "Sprawdź swój e-mail, aby znaleźć token resetowania hasła i wprowadź go tutaj",
            validation: {
              required: "Token resetowania jest wymagany",
            },
          },
          email: {
            label: "Adres e-mail",
            description: "Twój adres e-mail",
            placeholder: "Wprowadź adres e-mail",
            validation: {
              invalid: "Proszę wprowadzić prawidłowy adres e-mail",
            },
          },
          password: {
            label: "Nowe hasło",
            description: "Twoje nowe hasło",
            placeholder: "Wprowadź nowe hasło",
            help: "Wybierz silne hasło z co najmniej 8 znakami, w tym literami, cyframi i symbolami",
            validation: {
              minLength: "Hasło musi mieć co najmniej 8 znaków",
            },
          },
          confirmPassword: {
            label: "Potwierdź hasło",
            description: "Potwierdź swoje nowe hasło",
            placeholder: "Potwierdź nowe hasło",
            validation: {
              minLength: "Hasło musi mieć co najmniej 8 znaków",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Hasła nie pasują do siebie",
          },
        },
        response: {
          title: "Odpowiedź resetowania hasła",
          description: "Odpowiedź potwierdzenia resetowania hasła",
          message: {
            label: "Wiadomość",
            description: "Wiadomość odpowiedzi",
          },
          securityTip:
            "Rozważ włączenie uwierzytelniania dwuskładnikowego dla lepszego bezpieczeństwa",
          nextSteps: [
            "Zaloguj się za pomocą nowego hasła",
            "Zaktualizuj zapisane hasła w swojej przeglądarce",
            "Rozważ włączenie 2FA dla dodatkowego bezpieczeństwa",
          ],
        },
        errors: {
          title: "Błąd resetowania hasła",
          no_email: "Nie znaleziono konta z tym adresem e-mail",
          validation: {
            title: "Błąd walidacji",
            description: "Sprawdź swoje dane i spróbuj ponownie",
            passwordsDoNotMatch: "Hasła nie pasują do siebie",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Nieprawidłowy lub wygasły token resetowania",
          },
          internal: {
            title: "Błąd serwera",
            description: "Wystąpił wewnętrzny błąd serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Błąd połączenia sieciowego",
          },
          forbidden: {
            title: "Dostęp odrzucony",
            description: "Nie masz uprawnień do wykonania tej czynności",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Token resetowania nie został znaleziony lub wygasł",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Wystąpił konflikt podczas przetwarzania Twojego żądania",
          },
        },
        success: {
          title: "Resetowanie hasła pomyślne",
          description: "Twoje hasło zostało pomyślnie zresetowane",
          message: "Hasło zostało pomyślnie zresetowane",
          password_reset: "Twoje hasło zostało pomyślnie zresetowane",
        },
        actions: {
          requestNewLink: "Poproś o nowy link resetowania",
        },
        emailTemplates: {
          confirm: {
            name: "E-mail z potwierdzeniem resetowania hasła",
            description:
              "E-mail wysyłany do użytkowników po pomyślnym zresetowaniu hasła",
            category: "Uwierzytelnianie",
            preview: {
              publicName: {
                label: "Nazwa publiczna",
                description: "Publiczna nazwa wyświetlana użytkownika",
              },
              userId: {
                label: "ID użytkownika",
                description: "Unikalny identyfikator użytkownika",
              },
            },
          },
        },
      },
      request: {
        category: "Użytkownicy",
        title: "Żądanie resetowania hasła",
        description: "Żądanie resetowania hasła",
        tag: "Reset hasła",
        ui: {
          title: "Zresetuj hasło",
          subtitle:
            "Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania hasła",
          sendResetLink: "Wyślij link resetujący",
          alreadyHaveAccount: "Masz już konto? Zaloguj się",
        },
        actions: {
          submitting: "Wysyłanie...",
        },
        email: {
          title: "Zresetuj swoje hasło {{appName}}",
          subject: "Żądanie resetowania hasła - {{appName}}",
          previewText:
            "Zresetuj hasło {{appName}} - link ważny przez {{hours}} godziny.",
          greeting: "Hej {{name}},",
          requestInfo:
            "Ktoś poprosił o zresetowanie hasła do Twojego konta {{appName}}. Jeśli to byłeś Ty, kliknij przycisk poniżej.",
          buttonText: "Zresetuj moje hasło",
          expirationInfo:
            "Link wygasa za {{hours}} godziny. Jeśli nie prosiłeś o reset, zignoruj tę wiadomość - hasło pozostaje bez zmian.",
          signoff: "Zespół {{appName}}",
          promoText: "{{modelCount}} modeli AI. Bez filtrów. Bez cenzury.",
        },
        groups: {
          emailInput: {
            title: "Wprowadzenie E-maila",
            description:
              "Wprowadź swój adres e-mail, aby otrzymać instrukcje resetowania",
          },
        },
        fields: {
          email: {
            label: "Adres e-mail",
            description: "Wprowadź swój adres e-mail",
            placeholder: "twoj@email.pl",
            help: "Wprowadź adres e-mail powiązany z Twoim kontem",
            validation: {
              invalid: "Proszę wprowadzić prawidłowy adres e-mail",
            },
          },
        },
        response: {
          title: "Odpowiedź żądania resetu",
          description: "Odpowiedź żądania resetowania hasła",
          success: {
            message: "Link resetowania hasła wysłany pomyślnie",
          },
          deliveryInfo: {
            estimatedTime: "w ciągu 5 minut",
            expiresAt: "4 godziny od teraz",
          },
          nextSteps: {
            checkEmail: "Sprawdź swoją skrzynkę odbiorczą i folder spam",
            clickLink: "Kliknij link resetowania w e-mailu",
            createPassword: "Utwórz nowe bezpieczne hasło",
          },
        },
        errors: {
          title: "Błąd",
          validation: {
            title: "Błąd walidacji",
            description: "Podano nieprawidłowe dane",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Żądanie nie jest autoryzowane",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Wewnętrzny błąd serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Błąd połączenia sieciowego",
          },
          forbidden: {
            title: "Zabronione",
            description: "Dostęp zabroniony",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie został znaleziony",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Zmiany nie zostały zapisane",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
          no_email: "Nie znaleziono konta z tym adresem e-mail",
          email_generation_failed: "Nie udało się wygenerować e-maila",
        },
        success: {
          title: "Żądanie wysłane",
          description: "Żądanie resetowania hasła zostało pomyślnie wysłane",
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
        emailTemplates: {
          request: {
            name: "E-mail z żądaniem resetowania hasła",
            description:
              "E-mail wysyłany do użytkowników z linkiem do resetowania hasła",
            category: "Uwierzytelnianie",
            preview: {
              publicName: {
                label: "Nazwa publiczna",
                description: "Publiczna nazwa wyświetlana użytkownika",
              },
              userId: {
                label: "ID użytkownika",
                description: "Unikalny identyfikator użytkownika",
              },
              passwordResetUrl: {
                label: "URL resetowania hasła",
                description: "Adres URL do resetowania hasła",
              },
            },
          },
        },
      },
      validate: {
        category: "Użytkownicy",

        title: "Walidacja Tokenu Resetowania Hasła",
        description: "Endpoint walidacji tokenu resetowania hasła",
        tag: "Walidacja Resetowania Hasła",
        groups: {
          tokenInput: {
            title: "Walidacja Tokenu",
            description: "Wprowadź token resetowania hasła do walidacji",
          },
        },
        fields: {
          token: {
            label: "Token Resetowania",
            description: "Token resetowania hasła z emaila",
            placeholder: "Wprowadź token resetowania",
            help: "Wprowadź token, który otrzymałeś w emailu",
            validation: {
              required: "Token resetowania jest wymagany",
            },
          },
        },
        response: {
          title: "Wynik Walidacji",
          description: "Odpowiedź walidacji tokenu",
          valid: "Token Prawidłowy",
          message: "Wiadomość Walidacji",
          validationMessage: "Walidacja tokenu resetowania zakończona",
          userId: "ID Użytkownika",
          expiresAt: "Token Wygasa",
          nextSteps: {
            item: "Kolejne Kroki Po Walidacji",
            steps: [
              "Przejdź do ustawienia nowego hasła",
              "Wybierz silne, unikalne hasło",
            ],
          },
        },
        errors: {
          title: "Błąd",
          validation: {
            title: "Błąd Walidacji",
            description: "Walidacja tokenu nie powiodła się",
          },
          unauthorized: {
            title: "Brak Autoryzacji",
            description: "Nieprawidłowy lub wygasły token",
          },
          internal: {
            title: "Błąd Wewnętrzny",
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
            description: "Token nie został znaleziony",
          },
          unsaved: {
            title: "Niezapisane Zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
        },
        success: {
          title: "Token Prawidłowy",
          description: "Token resetowania hasła jest prawidłowy",
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
      actions: {
        back: "Wstecz",
        submit: "Wyślij",
        submitting: "Wysyłanie...",
      },
      success: {
        password_reset: "Twoje hasło zostało pomyślnie zresetowane.",
      },
      errors: {
        tokenValidationFailed: "Walidacja tokenu nie powiodła się",
        userLookupFailed: "Nie udało się znaleźć użytkownika",
        tokenDeletionFailed: "Nie udało się usunąć tokenu",
        userDeletionFailed: "Nie udało się usunąć użytkownika",
        resetFailed: "Resetowanie hasła nie powiodło się",
        tokenCreationFailed: "Nie udało się utworzyć tokenu resetowania",
        noDataReturned: "Brak danych zwróconych z bazy danych",
        tokenInvalid: "Token resetowania jest nieprawidłowy",
        tokenExpired: "Token resetowania wygasł",
        tokenVerificationFailed: "Weryfikacja tokenu nie powiodła się",
        userNotFound: "Użytkownik nie znaleziony",
        passwordUpdateFailed: "Nie udało się zaktualizować hasła",
        passwordResetFailed: "Resetowanie hasła nie powiodło się",
        requestFailed: "Żądanie resetowania nie powiodło się",
        emailMismatch: "E-mail nie pasuje",
        confirmationFailed: "Potwierdzenie resetowania hasła nie powiodło się",
      },
    },
    signup: {
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
            "Jak AI będzie się do Ciebie zwracać w prywatnych rozmowach. To zostaje między Tobą a AI - całkowicie prywatne.",
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
            "Twoja tożsamość w publicznych czatach i na forach. Inni użytkownicy i AI zobaczą tę nazwę. Wybierz mądrze - ona reprezentuje Cię w społeczności.",
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
            "Twoje dane logowania i metoda kontaktu. Pozostaje prywatny - nigdy nie będzie udostępniony innym użytkownikom ani AI.",
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
            "Silne hasła chronią Twoje konto. Wkrótce wdrożymy szyfrowanie end-to-end - od tego momentu reset hasła usunie Twoją historię wiadomości, ponieważ tylko Ty posiadasz klucz deszyfrujący. Zapisz je w bezpiecznym miejscu.",
          placeholder: "Wpisz hasło",
          validation: {
            required: "Hasło jest wymagane",
            minLength: "Hasło musi mieć co najmniej 8 znaków",
            complexity:
              "Hasło musi zawierać wielką literę, małą literę i cyfrę",
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
          termsLink: "regulamin",
          conditionsLink: "politykę prywatności",
          descriptionPrefix: "Nasz",
          descriptionAnd: "i",
          descriptionSuffix: "szanują Twoją wolność i prywatność.",
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
          labelPrefilled: "Kod polecający",
          descriptionPrefilled:
            "Twoj znajomy dostanie nagrodę, gdy założysz konto.",
        },
        supportedSkillId: {
          label: "Wesprzyj twórcę",
          description:
            "Twoja rejestracja daje twórcy tego skilla +5% z Twoich subskrypcji.",
          selectorTitle: "Wesprzyj twórcę",
          selectorDescription:
            "Masz w ulubionych skille od niezależnych twórców. Wybierz jednego do wsparcia - dostanie +5% z Twoich subskrypcji. Możesz to zmienić w każdej chwili.",
          selectorNone: "Żaden (pomiń)",
        },
        localFavorites: {
          label: "Lokalne ulubione",
        },
      },
      form: {
        title: "Witamy w Uncensored AI",
        description:
          "Pomóż budować niecenzurowaną, prywatną i naprawdę niezależną AI. unbottled.ai to open source i projekt społecznościowy - Twoja rejestracja wspiera rozwój technologii AI, która szanuje Twoją wolność.",
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
          credits:
            "{{freeCredits}} creditów miesięcznie - bez karty, bez daty wygaśnięcia",
          allModels: "Dostęp do wszystkich {{modelCount}} modeli AI",
          uncensored:
            "4 niecenzurowane modele, które naprawdę odpowiadają na pytania",
          chatModes:
            "Tryby czatu: Prywatny, Incognito, Współdzielony i Publiczny",
          noCard: "Karta kredytowa nie jest wymagana - nigdy",
        },
        ctaButton: "Zacznij rozmawiać",
        upgrade: {
          title: "Chcesz więcej?",
          desc: "{{subscriptionPrice}}/miesiąc daje Ci {{subscriptionCredits}} creditów - to 40× więcej. Możesz też kupować dodatkowe pakiety creditów, które nigdy nie wygasają. Idealne do codziennego użytku AI.",
          cta: "Zobacz plan Unlimited",
        },
        signoff: "Miłych rozmów,\nZespół {{appName}}",
        ps: "P.S. Użyj trybu Incognito, aby zachować rozmowy tylko na swoim urządzeniu - nigdy nie przechowujemy ich na naszych serwerach.",
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
    },
  },
  search: {
    category: "Użytkownicy",

    title: "Wyszukiwanie użytkowników",
    description: "Wyszukaj użytkowników",
    tag: "Wyszukiwanie użytkowników",
    container: {
      title: "Kontener wyszukiwania",
      description: "Kontener wyszukiwania użytkowników",
    },
    groups: {
      searchCriteria: {
        title: "Kryteria wyszukiwania",
        description: "Zdefiniuj parametry wyszukiwania",
      },
      filters: {
        title: "Zaawansowane filtry",
        description: "Dodatkowe opcje filtrowania",
      },
      pagination: {
        title: "Paginacja",
        description: "Kontroluj jak wyniki są paginowane",
      },
    },
    fields: {
      search: {
        label: "Zapytanie wyszukiwania",
        description: "Wprowadź terminy wyszukiwania",
        placeholder: "Szukaj użytkowników...",
        help: "Szukaj według nazwy, e-maila lub firmy",
        validation: {
          minLength: "Zapytanie wyszukiwania musi mieć co najmniej 2 znaki",
        },
      },
      roles: {
        label: "Role użytkowników",
        description: "Filtruj według ról użytkowników",
        placeholder: "Wybierz role...",
        help: "Wybierz jedną lub więcej ról do filtrowania",
      },
      status: {
        label: "Status użytkownika",
        description: "Filtruj według statusu użytkownika",
        placeholder: "Wybierz status...",
        help: "Filtruj według aktywnych, nieaktywnych lub wszystkich użytkowników",
      },
      limit: {
        label: "Limit",
        description: "Maksymalna liczba wyników",
        help: "Określ ile wyników zwrócić (domyślnie: 10)",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba wyników do pominięcia",
        help: "Określ przesunięcie paginacji (domyślnie: 0)",
      },
    },
    status: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      all: "Wszystkie",
    },
    response: {
      title: "Wyniki wyszukiwania",
      description: "Wyniki wyszukiwania użytkowników",
      success: {
        badge: "Sukces",
      },
      message: {
        content: "Komunikat wyniku wyszukiwania",
      },
      searchInfo: {
        title: "Informacje o wyszukiwaniu",
        description: "Szczegóły operacji wyszukiwania",
        searchTerm: "Termin wyszukiwania",
        appliedFilters: "Zastosowane filtry",
        searchTime: "Czas wyszukiwania",
        totalResults: "Całkowite wyniki",
      },
      pagination: {
        title: "Informacje o paginacji",
        description: "Informacje o nawigacji stron",
        currentPage: "Bieżąca strona",
        totalPages: "Całkowite strony",
        itemsPerPage: "Elementy na stronę",
        totalItems: "Całkowite elementy",
        hasMore: "Ma więcej",
        hasPrevious: "Ma poprzednie",
      },
      actions: {
        title: "Dostępne akcje",
        description: "Akcje, które możesz wykonać na wynikach",
        type: "Typ akcji",
        label: "Akcja",
        href: "Link",
      },
      users: {
        label: "Znalezieni użytkownicy",
        description: "Lista pasujących użytkowników",
        item: {
          title: "Użytkownik",
          description: "Informacje o koncie użytkownika",
        },
        id: "ID użytkownika",
        leadId: "ID lead",
        isPublic: "Publiczny",
        firstName: "Imię",
        lastName: "Nazwisko",
        privateName: "Nazwa prywatna",
        publicName: "Nazwa publiczna",
        company: "Firma",
        email: "E-mail",
        imageUrl: "Awatar",
        isActive: "Aktywny",
        emailVerified: "E-mail zweryfikowany",
        requireTwoFactor: "Wymagane 2FA",
        marketingConsent: "Zgoda marketingowa",
        userRoles: {
          item: {
            title: "Rola",
            description: "Przypisanie roli użytkownika",
          },
          id: "ID roli",
          role: "Rola",
        },
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
    columns: {
      firstName: "Imię",
      lastName: "Nazwisko",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      email: "E-mail",
      company: "Firma",
      userRoles: "Role",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry wyszukiwania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wyszukiwanie nieautoryzowane",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Błąd nieznany",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono użytkowników",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt wyszukiwania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Zmiany nie zostały zapisane",
      },
    },
    success: {
      title: "Wyszukiwanie pomyślne",
      description: "Wyszukiwanie zakończone pomyślnie",
    },
    post: {
      title: "Wyszukiwanie",
      description: "Endpoint wyszukiwania",
      form: {
        title: "Konfiguracja wyszukiwania",
        description: "Skonfiguruj parametry wyszukiwania",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi wyszukiwania",
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
  "session-cleanup": {
    category: "Użytkownicy",

    post: {
      title: "Czyszczenie sesji",
      description: "Oczyszczanie wygasłych sesji i tokenów użytkowników",
      tag: "Czyszczenie sesji",
      container: {
        title: "Czyszczenie sesji",
        description: "Konfiguracja i uruchamianie czyszczenia sesji",
      },
      fields: {
        sessionRetentionDays: {
          label: "Dni przechowywania sesji",
          description: "Liczba dni do przechowywania sesji",
        },
        tokenRetentionDays: {
          label: "Dni przechowywania tokenów",
          description: "Liczba dni do przechowywania tokenów",
        },
        batchSize: {
          label: "Rozmiar partii",
          description: "Liczba rekordów na partię",
        },
        dryRun: {
          label: "Próbny przebieg",
          description: "Uruchom bez rzeczywistego usuwania",
        },
      },
      response: {
        sessionsDeleted: "Usunięte sesje",
        tokensDeleted: "Usunięte tokeny",
        totalProcessed: "Łącznie przetworzono",
        executionTimeMs: "Czas wykonania (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być administratorem",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp zabroniony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa konfiguracja czyszczenia",
        },
      },
      success: {
        title: "Czyszczenie sesji zakończone",
        description: "Sesje i tokeny wyczyszczone pomyślnie",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Oczyszczanie wygasłych sesji użytkowników w celu utrzymania bezpieczeństwa systemu",
      purpose:
        "Usuwa wygasłe sesje w celu utrzymania bezpieczeństwa i wydajności",
      impact:
        "Poprawia wydajność systemu i bezpieczeństwo poprzez usuwanie przestarzałych danych sesji",
      rollback: "Rollback nie ma zastosowania dla operacji czyszczenia",
    },
    errors: {
      default: "Wystąpił błąd podczas czyszczenia sesji",
      execution_failed: {
        title: "Oczyszczanie sesji nie powiodło się",
        description: "Błąd podczas oczyszczania wygasłych sesji",
      },
      partial_failure: {
        title: "Częściowa awaria oczyszczania sesji",
        description: "Niektóre sesje nie mogły zostać oczyszczone",
      },
      unknown_error: {
        title: "Nieznany błąd oczyszczania sesji",
        description: "Wystąpił nieznany błąd podczas oczyszczania sesji",
      },
      invalid_session_retention: {
        title: "Nieprawidłowe przechowywanie sesji",
        description: "Określono nieprawidłowy okres przechowywania sesji",
      },
      invalid_token_retention: {
        title: "Nieprawidłowe przechowywanie tokenów",
        description: "Określono nieprawidłowy okres przechowywania tokenów",
      },
      invalid_batch_size: {
        title: "Nieprawidłowy rozmiar partii",
        description: "Określono nieprawidłowy rozmiar partii do oczyszczania",
      },
      validation_failed: {
        title: "Walidacja nie powiodła się",
        description:
          "Walidacja konfiguracji oczyszczania sesji nie powiodła się",
      },
    },
    success: {
      title: "Oczyszczanie sesji zakończone",
      description: "Pomyślnie oczyszczono wygasłe sesje",
    },
    monitoring: {
      alertTrigger: "Zadanie oczyszczania sesji nie powiodło się",
    },
    documentation: {
      overview:
        "To zadanie usuwa wygasłe sesje użytkowników z systemu w celu utrzymania bezpieczeństwa i wydajności",
    },
  },
  sessionCleanup: {
    category: "Użytkownicy",

    post: {
      title: "Czyszczenie sesji",
      description: "Oczyszczanie wygasłych sesji i tokenów użytkowników",
      tag: "Czyszczenie sesji",
      container: {
        title: "Czyszczenie sesji",
        description: "Konfiguracja i uruchamianie czyszczenia sesji",
      },
      fields: {
        sessionRetentionDays: {
          label: "Dni przechowywania sesji",
          description: "Liczba dni do przechowywania sesji",
        },
        tokenRetentionDays: {
          label: "Dni przechowywania tokenów",
          description: "Liczba dni do przechowywania tokenów",
        },
        batchSize: {
          label: "Rozmiar partii",
          description: "Liczba rekordów na partię",
        },
        dryRun: {
          label: "Próbny przebieg",
          description: "Uruchom bez rzeczywistego usuwania",
        },
      },
      response: {
        sessionsDeleted: "Usunięte sesje",
        tokensDeleted: "Usunięte tokeny",
        totalProcessed: "Łącznie przetworzono",
        executionTimeMs: "Czas wykonania (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być administratorem",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp zabroniony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa konfiguracja czyszczenia",
        },
      },
      success: {
        title: "Czyszczenie sesji zakończone",
        description: "Sesje i tokeny wyczyszczone pomyślnie",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Oczyszczanie wygasłych sesji użytkowników w celu utrzymania bezpieczeństwa systemu",
      purpose:
        "Usuwa wygasłe sesje w celu utrzymania bezpieczeństwa i wydajności",
      impact:
        "Poprawia wydajność systemu i bezpieczeństwo poprzez usuwanie przestarzałych danych sesji",
      rollback: "Rollback nie ma zastosowania dla operacji czyszczenia",
    },
    errors: {
      default: "Wystąpił błąd podczas czyszczenia sesji",
      execution_failed: {
        title: "Oczyszczanie sesji nie powiodło się",
        description: "Błąd podczas oczyszczania wygasłych sesji",
      },
      partial_failure: {
        title: "Częściowa awaria oczyszczania sesji",
        description: "Niektóre sesje nie mogły zostać oczyszczone",
      },
      unknown_error: {
        title: "Nieznany błąd oczyszczania sesji",
        description: "Wystąpił nieznany błąd podczas oczyszczania sesji",
      },
      invalid_session_retention: {
        title: "Nieprawidłowe przechowywanie sesji",
        description: "Określono nieprawidłowy okres przechowywania sesji",
      },
      invalid_token_retention: {
        title: "Nieprawidłowe przechowywanie tokenów",
        description: "Określono nieprawidłowy okres przechowywania tokenów",
      },
      invalid_batch_size: {
        title: "Nieprawidłowy rozmiar partii",
        description: "Określono nieprawidłowy rozmiar partii do oczyszczania",
      },
      validation_failed: {
        title: "Walidacja nie powiodła się",
        description:
          "Walidacja konfiguracji oczyszczania sesji nie powiodła się",
      },
    },
    success: {
      title: "Oczyszczanie sesji zakończone",
      description: "Pomyślnie oczyszczono wygasłe sesje",
    },
    monitoring: {
      alertTrigger: "Zadanie oczyszczania sesji nie powiodło się",
    },
    documentation: {
      overview:
        "To zadanie usuwa wygasłe sesje użytkowników z systemu w celu utrzymania bezpieczeństwa i wydajności",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Nie udało się znaleźć ról użytkownika",
      batch_find_failed: "Nie udało się znaleźć ról użytkowników wsadowo",
      not_found: "Rola użytkownika nie znaleziona",
      lookup_failed: "Nie udało się pobrać roli użytkownika",
      add_failed: "Nie udało się dodać roli do użytkownika",
      no_data_returned: "Brak danych zwróconych z bazy danych",
      remove_failed: "Nie udało się usunąć roli od użytkownika",
      check_failed: "Sprawdzenie czy użytkownik ma rolę nie powiodło się",
      delete_failed: "Nie udało się usunąć ról użytkownika",
      endpoint_not_created:
        "Endpoint ról użytkownika nie został jeszcze utworzony",
    },
    post: {
      title: "Role użytkowników",
      description: "Endpoint ról użytkowników",
      form: {
        title: "Konfiguracja ról użytkowników",
        description: "Skonfiguruj parametry ról użytkowników",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi ról użytkowników",
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
        database_connection_failed: {
          title: "Błąd połączenia z bazą danych",
          description: "Nie udało się połączyć z bazą danych",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
    enums: {
      userRole: {
        public: "Publiczny",
        customer: "Klient",
        partnerAdmin: "Administrator partnera",
        partnerEmployee: "Pracownik partnera",
        admin: "Administrator",
        cliOff: "CLI Wyłączone",
        cliAuthBypass: "Obejście autoryzacji CLI",
        aiToolOff: "Narzędzie AI Wyłączone",
        webOff: "Web Wyłączone",
        mcpOff: "MCP Wyłączone",
        mcpVisible: "MCP Widoczne",
        productionOff: "Produkcja Wyłączona",
        skillOff: "Skill Wyłączony",
      },
    },
  },
  profileVisibility: {
    public: "Publiczny",
    private: "Prywatny",
    contactsOnly: "Tylko kontakty",
  },
  contactMethods: {
    email: "E-mail",
    phone: "Telefon",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Jasny",
    dark: "Ciemny",
    system: "Systemowy",
  },
  userDetailLevel: {
    minimal: "Minimalny",
    standard: "Standardowy",
    complete: "Pełny",
  },
  language: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "Ameryka/Nowy_Jork",
    america_los_angeles: "Ameryka/Los_Angeles",
    europe_london: "Europa/Londyn",
    europe_berlin: "Europa/Berlin",
    europe_warsaw: "Europa/Warszawa",
    asia_tokyo: "Azja/Tokio",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "Adres e-mail jest już używany",
    locale_required: "Locale jest wymagane",
    auth_required: "Wymagana autoryzacja",
    auth_retrieval_failed: "Nie udało się pobrać autoryzacji",
    not_found: "Użytkownik nie znaleziony",
    roles_lookup_failed: "Nie udało się pobrać ról użytkownika",
    roles_batch_fetch_failed: "Nie udało się pobrać ról użytkowników wsadowo",
    id_lookup_failed: "Nie udało się znaleźć użytkownika po ID",
    email_lookup_failed: "Nie udało się znaleźć użytkownika po e-mailu",
    email_check_failed: "Sprawdzenie e-maila nie powiodło się",
    email_duplicate_check_failed:
      "Sprawdzenie duplikatu e-maila nie powiodło się",
    search_failed: "Wyszukiwanie użytkowników nie powiodło się",
    email_already_in_use: "Adres e-mail jest już używany",
    creation_failed: "Nie udało się utworzyć użytkownika",
    no_data_returned: "Brak danych zwróconych z bazy danych",
    password_hashing_failed: "Hashowanie hasła nie powiodło się",
    not_implemented_on_native:
      "Ta funkcja nie jest zaimplementowana w React Native",
    count_failed: "Nie udało się pobrać liczby użytkowników: {{error}}",
  },
  userNoteType: {
    note: "Notatka",
    call: "Połączenie",
    email: "E-mail",
    meeting: "Spotkanie",
    task: "Zadanie",
  },
  notifications: {
    profileUpdated: {
      title: "Profil zaktualizowany",
      description: "Twój profil został pomyślnie zaktualizowany",
    },
    updateFailed: {
      title: "Aktualizacja nie powiodła się",
      description: "Nie udało się zaktualizować profilu. Spróbuj ponownie.",
    },
  },
};
