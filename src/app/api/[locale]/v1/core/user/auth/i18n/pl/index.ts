import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  authClient: {
    errors: {
      status_save_failed: "Nie udało się zapisać statusu uwierzytelniania",
      status_remove_failed: "Nie udało się usunąć statusu uwierzytelniania",
      status_check_failed: "Nie udało się sprawdzić statusu uwierzytelniania",
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
    native: {
      unsupported:
        "Ta metoda uwierzytelniania nie jest obsługiwana w React Native",
      storage_failed: "Nie udało się zapisać danych uwierzytelniania",
      clear_failed: "Nie udało się wyczyścić danych uwierzytelniania",
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
      start: "getAuthMinimalUserNext: - Sprawdzanie autentykacji jako pierwsze",
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
    gettingCurrentUserFromNextjs: "Pobieranie bieżącego użytkownika z Next.js",
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
};
