import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Overenie totožnosti",
  search: {
    tag: "Overenie totožnosti",
  },
  authClient: {
    errors: {
      status_save_failed: "Nepodarilo sa uložiť stav prihlásenia",
      status_remove_failed: "Nepodarilo sa odstrániť stav prihlásenia",
      status_check_failed: "Nepodarilo sa overiť stav prihlásenia",
      token_save_failed: "Prihlasovací token sa nepodarilo uložiť",
      token_get_failed: "Nepodarilo sa načítať prihlasovací token",
      token_remove_failed: "Nepodarilo sa odstrániť prihlasovací token",
      token_save_failed_detail:
        "Nepodarilo sa uložiť prihlasovací token: {{error}}",
      token_get_failed_detail:
        "Nepodarilo sa načítať prihlasovací token: {{error}}",
      token_remove_failed_detail:
        "Nepodarilo sa odstrániť prihlasovací token: {{error}}",
    },
  },
  debug: {
    getAuthMinimalUserNext: {
      start: "getAuthMinimalUserNext: Najprv sa overí stav prihlásenia",
      result: "getAuthMinimalUserNext: Výsledok getCurrentUserNext",
      authenticated:
        "getAuthMinimalUserNext: Používateľ je prihlásený, načítava sa leadId",
      returningAuth: "getAuthMinimalUserNext: Vracia sa prihlásený používateľ",
      notAuthenticated:
        "getAuthMinimalUserNext: Používateľ nie je prihlásený, vracia sa neprihlásený používateľ",
    },
    signingJwt: "Podpisuje sa JWT",
    jwtSignedSuccessfully: "JWT bol podpísaný",
    errorSigningJwt: "Nepodarilo sa podpísať JWT",
    verifyingJwt: "Overuje sa JWT",
    invalidTokenPayload: "Neplatný obsah tokenu",
    jwtVerifiedSuccessfully: "JWT bol overený",
    errorVerifyingJwt: "Nepodarilo sa overiť JWT",
    userIdNotExistsInDb: "ID používateľa v databáze neexistuje",
    sessionNotFound: "Relácia sa nenašla",
    sessionExpired: "Platnosť relácie vypršala",
    errorValidatingUserSession: "Nepodarilo sa overiť reláciu používateľa",
    errorGettingUserRoles: "Nepodarilo sa načítať roly používateľa",
    errorCheckingUserAuth: "Nepodarilo sa overiť prihlásenie používateľa",
    authenticatingCliUserWithPayload:
      "Overuje sa používateľ CLI podľa obsahu tokenu",
    errorAuthenticatingCliUserWithPayload:
      "Nepodarilo sa overiť používateľa CLI podľa obsahu tokenu",
    creatingCliToken: "Vytvára sa token CLI",
    errorCreatingCliToken: "Nepodarilo sa vytvoriť token CLI",
    validatingCliToken: "Overuje sa token CLI",
    errorValidatingCliToken: "Nepodarilo sa overiť token CLI",
    gettingCurrentUserFromNextjs: "Načítava sa aktuálny používateľ z Next.js",
    errorGettingAuthUserForNextjs:
      "Nepodarilo sa načítať prihláseného používateľa pre Next.js",
    settingNextjsAuthCookies:
      "Nastavujú sa prihlasovacie súbory cookie pre Next.js",
    clearingNextjsAuthCookies:
      "Odstraňujú sa prihlasovacie súbory cookie pre Next.js",
    gettingCurrentUserFromToken: "Načítava sa aktuálny používateľ z tokenu",
    errorGettingCurrentUserFromCli:
      "Nepodarilo sa načítať aktuálneho používateľa z CLI",
    errorGettingAuthUserForCli:
      "Nepodarilo sa načítať prihláseného používateľa pre CLI",
    errorGettingUserRolesForCli:
      "Nepodarilo sa načítať roly používateľa pre CLI",
    tokenFromAuthHeader: "Token z hlavičky Authorization",
    tokenFromCookie: "Token zo súboru cookie",
    noTokenFound: "Token sa nenašiel",
    errorExtractingToken: "Nepodarilo sa získať token",
    errorParsingCookies: "Nepodarilo sa spracovať súbory cookie",
  },
  errors: {
    token_generation_failed: "Nepodarilo sa vytvoriť prihlasovací token",
    invalid_session: "Relácia je neplatná alebo jej vypršala platnosť",
    missing_request_context: "Chýba kontext požiadavky",
    missing_locale: "V požiadavke chýbajú jazykové a regionálne nastavenia",
    unsupported_platform: "Platforma nie je podporovaná",
    session_retrieval_failed: "Nepodarilo sa načítať reláciu",
    missing_token: "Chýba prihlasovací token",
    invalid_token_signature: "Podpis tokenu je neplatný",
    invalid_token_signature_detail:
      "Overenie podpisu tokenu zlyhalo: {{error}}",
    jwt_payload_missing_id: "V obsahu JWT chýba ID používateľa",
    cookie_set_failed:
      "Nepodarilo sa nastaviť prihlasovací súbor cookie: {{error}}",
    cookie_clear_failed:
      "Nepodarilo sa odstrániť prihlasovací súbor cookie: {{error}}",
    publicPayloadNotSupported:
      "Overovanie v CLI nepodporuje JWT pre neprihlásených používateľov",
    jwt_signing_failed: "Nepodarilo sa podpísať JWT: {{error}}",
    authentication_failed: "Overenie totožnosti zlyhalo: {{error}}",
    user_not_authenticated: "Používateľ nie je prihlásený: {{email}}",
    publicUserNotAllowed: "Tento koncový bod vyžaduje prihlásenie",
    validation_failed: "Kontrola údajov zlyhala",
    failed_to_create_lead:
      "Nepodarilo sa vytvoriť záznam potenciálneho zákazníka",
    native: {
      unsupported: "React Native tento spôsob overovania nepodporuje",
      storage_failed: "Nepodarilo sa uložiť prihlasovacie údaje: {{error}}",
      clear_failed: "Nepodarilo sa vymazať prihlasovacie údaje: {{error}}",
    },
    not_implemented_native:
      "Táto funkcia zatiaľ v React Native nie je k dispozícii",
    unknownError: "Pri overovaní prihlásenia nastala neznáma chyba",
  },
  post: {
    title: "Overenie totožnosti",
    description: "Koncový bod pre overovanie prihlásenia",
    form: {
      title: "Nastavenia overovania prihlásenia",
      description: "Nastavte parametre overovania prihlásenia",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje o prihlásení v odpovedi",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre požiadavky",
      },
      missing_locale: {
        title: "Chýbajú jazykové a regionálne nastavenia",
        description:
          "Vyžaduje sa parameter s jazykovými a regionálnymi nastaveniami",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      token_generation_failed: {
        title: "Vytvorenie tokenu zlyhalo",
        description: "Nepodarilo sa vytvoriť prihlasovací token",
      },
      invalid_session: {
        title: "Neplatná relácia",
        description: "Relácia je neplatná alebo jej vypršala platnosť",
      },
      missing_request_context: {
        title: "Chýba kontext požiadavky",
        description: "Chýba kontext požiadavky",
      },
      unsupported_platform: {
        title: "Nepodporovaná platforma",
        description: "Platforma nie je podporovaná",
      },
      session_retrieval_failed: {
        title: "Načítanie relácie zlyhalo",
        description: "Nepodarilo sa načítať reláciu",
      },
      missing_token: {
        title: "Chýba token",
        description: "Chýba prihlasovací token",
      },
      invalid_token_signature: {
        title: "Neplatný podpis tokenu",
        description: "Podpis tokenu je neplatný",
      },
      jwt_payload_missing_id: {
        title: "V obsahu JWT chýba ID",
        description: "V obsahu JWT chýba ID používateľa",
      },
      cookie_set_failed: {
        title: "Nastavenie súboru cookie zlyhalo",
        description: "Nepodarilo sa nastaviť prihlasovací súbor cookie",
      },
      cookie_clear_failed: {
        title: "Odstránenie súboru cookie zlyhalo",
        description: "Nepodarilo sa odstrániť prihlasovací súbor cookie",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
    },
  },
  check: {
    get: {
      title: "Overiť prihlásenie",
      description: "Overiť aktuálny stav prihlásenia",
      response: {
        title: "Stav prihlásenia",
        description: "Aktuálny stav prihlásenia",
        authenticated: "Prihlásený",
        tokenValid: "Token je platný",
      },
    },
  },
  enums: {
    webSocketErrorCode: {
      unauthorized: "Vyžaduje sa prihlásenie",
      forbidden: "Prístup zamietnutý",
      invalidToken: "Neplatný token",
      tokenExpired: "Platnosť tokenu vypršala",
      serverError: "Chyba servera",
    },
  },
};
