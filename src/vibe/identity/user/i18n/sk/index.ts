import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",
  auth: {
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
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start: "getAuthMinimalUserNext: Najprv sa overí stav prihlásenia",
        result: "getAuthMinimalUserNext: Výsledok getCurrentUserNext",
        authenticated:
          "getAuthMinimalUserNext: Používateľ je prihlásený, načítava sa leadId",
        returningAuth:
          "getAuthMinimalUserNext: Vracia sa prihlásený používateľ",
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
      jwt_payload_missing_id: "V obsahu JWT chýba ID používateľa",
      cookie_set_failed: "Nepodarilo sa nastaviť prihlasovací súbor cookie",
      cookie_clear_failed: "Nepodarilo sa odstrániť prihlasovací súbor cookie",
      publicPayloadNotSupported:
        "Overovanie v CLI nepodporuje JWT pre neprihlásených používateľov",
      jwt_signing_failed: "Nepodarilo sa podpísať JWT",
      authentication_failed: "Overenie totožnosti zlyhalo",
      user_not_authenticated: "Používateľ nie je prihlásený",
      publicUserNotAllowed: "Tento koncový bod vyžaduje prihlásenie",
      validation_failed: "Kontrola údajov zlyhala",
      failed_to_create_lead:
        "Nepodarilo sa vytvoriť záznam potenciálneho zákazníka",
      native: {
        unsupported: "React Native tento spôsob overovania nepodporuje",
        storage_failed: "Nepodarilo sa uložiť prihlasovacie údaje",
        clear_failed: "Prihlasovacie údaje sa nepodarilo vymazať",
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
        description: "Operácia sa úspešne dokončila",
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
  },
  private: {
    logout: {
      title: "Odhlásenie používateľa",
      description: "Odhlási aktuálneho používateľa a zneplatní jeho reláciu",
      category: "Správa používateľov",
      tag: "logout",
      logoutButton: "Odhlásiť sa",
      loggingOut: "Odhlasuje sa…",
      response: {
        title: "Výsledok odhlásenia",
        description: "Odpoveď potvrdzujúca úspešné odhlásenie",
        success: "Úspech",
        message: "Správa",
        sessionsCleaned: "Ukončené relácie",
        nextSteps: "Odporúčané ďalšie kroky po odhlásení",
      },
      errors: {
        validation: {
          title: "Chyba kontroly údajov",
          description: "Žiadosť o odhlásenie obsahuje neplatné údaje",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na odhlásenie musíš byť prihlásený",
        },
        internal: {
          title: "Interná chyba servera",
          description: "Pri odhlásení nastala interná chyba",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri odhlásení nastala neočakávaná chyba",
        },
        session_deletion_failed: {
          title: "Reláciu sa nepodarilo odstrániť",
          description: "Reláciu používateľa sa nepodarilo odstrániť",
        },
        conflict: {
          title: "Konflikt pri odhlásení",
          description: "Pri odhlásení došlo ku konfliktu",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Odhlásenie nie je povolené",
        },
        network_error: {
          title: "Chyba siete",
          description: "Chyba siete pri odhlásení",
        },
        not_found: {
          title: "Nenájdené",
          description: "Relácia sa nenašla",
        },
        server_error: {
          title: "Chyba servera",
          description: "Pri odhlásení nastala interná chyba servera",
        },
        unsaved_changes: {
          title: "Neuložené zmeny",
          description: "Niektoré zmeny nie sú uložené",
        },
        invalid_user: {
          title: "Neplatný používateľ",
          description: "Používateľ je neplatný alebo neexistuje",
        },
      },
      success: {
        title: "Odhlásenie prebehlo úspešne",
        description: "Úspešne si sa odhlásil",
        message: "Používateľ sa úspešne odhlásil",
      },
    },
    me: {
      // Main user profile routes
      get: {
        title: "Načítať profil používateľa",
        description: "Načítať údaje profilu prihláseného používateľa",
        response: {
          title: "Výsledok načítania profilu",
          description: "Aktuálne údaje profilu používateľa",
          id: "ID používateľa",
          leadId: "ID potenciálneho zákazníka",
          isPublic: "Verejný profil",
          email: "E-mailová adresa",
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          locale: "Jazyk a oblasť",
          isActive: "Stav aktivity",
          emailVerified: "E-mail overený",
          requireTwoFactor: "Vyžaduje sa dvojfaktorové overenie",
          marketingConsent: "Súhlas s marketingom",
          userRoles: "Roly používateľa",
          createdAt: "Vytvorené",
          updatedAt: "Aktualizované",
          stripeCustomerId: "ID zákazníka v Stripe",
          bio: "O mne",
          websiteUrl: "Webová stránka",
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
          creatorSlug: "Identifikátor profilu v URL",
          creatorAccentColor: "Farba zvýraznenia",
          creatorHeaderImageUrl: "Obrázok hlavičky",
          avatarUrl: "Avatar",
          user: {
            title: "Údaje o používateľovi",
            description: "Údaje o profile používateľa",
          },
        },
        errors: {
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatné parametre požiadavky",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: {
            title: "Nenájdené",
            description: "Profil používateľa sa nenašiel",
          },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Niektoré zmeny nie sú uložené",
          },
          internal: {
            title: "Interná chyba",
            description: "Vyskytla sa interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
        },
        success: {
          title: "Úspech",
          description: "Profil sa načítal",
        },
      },
      update: {
        title: "Upraviť profil používateľa",
        description: "Upraviť údaje profilu prihláseného používateľa",
        groups: {
          basicInfo: {
            title: "Základné informácie",
            description: "Uprav základné údaje v profile",
          },
          profileDetails: {
            title: "Podrobnosti o profile",
            description: "Spravuj údaje a nastavenia profilu",
          },
          privacySettings: {
            title: "Nastavenia súkromia",
            description: "Urči, kto môže vidieť údaje v tvojom profile",
          },
          profileInfo: {
            title: "Profil autora",
            description:
              "Životopis, odkazy na sociálne siete a vzhľad stránok tvojich zručností",
          },
        },
        fields: {
          email: {
            label: "E-mailová adresa",
            description: "Tvoja e-mailová adresa",
            placeholder: "Zadaj e-mailovú adresu",
            help: "E-mailovú adresu používame na oznámenia o účte a na komunikáciu",
            validation: {
              invalid: "Zadaj platnú e-mailovú adresu",
            },
          },
          privateName: {
            label: "Súkromné meno",
            description: "Tvoje súkromné meno",
            placeholder: "Zadaj súkromné meno",
            help: "Tvoje súkromné meno používame interne a v súkromnej komunikácii",
            validation: {
              minLength: "Súkromné meno musí mať aspoň 2 znaky",
              maxLength: "Súkromné meno môže mať najviac 50 znakov",
            },
          },
          publicName: {
            label: "Verejné meno",
            description: "Tvoje verejné meno",
            placeholder: "Zadaj verejné meno",
            help: "Tvoje verejné meno uvidia aj ostatní používatelia",
            validation: {
              minLength: "Verejné meno musí mať aspoň 2 znaky",
              maxLength: "Verejné meno môže mať najviac 50 znakov",
            },
          },
          imageUrl: {
            label: "Profilový obrázok",
            description: "URL tvojho profilového obrázka",
            placeholder: "Zadaj URL obrázka",
            help: "Zadaj URL obrázka, ktorý sa zobrazí v tvojom profile",
            validation: {
              invalid: "Zadaj platnú URL obrázka",
            },
          },
          company: {
            label: "Spoločnosť",
            description: "Názov tvojej spoločnosti",
            placeholder: "Zadaj názov spoločnosti",
            help: "Názov tvojej spoločnosti sa zobrazí v profile",
            validation: {
              maxLength: "Názov spoločnosti nemôže prekročiť 100 znakov",
            },
          },
          visibility: {
            label: "Viditeľnosť profilu",
            description: "Kto môže vidieť tvoj profil",
            placeholder: "Vyber viditeľnosť",
            help: "Vyber, kto uvidí tvoj profil: všetci, iba ty alebo iba tvoje kontakty",
          },
          marketingConsent: {
            label: "Prihlásiť sa na odber noviniek",
            description:
              "Občasné novinky o modeloch a funkciách. Len to podstatné, bez spamu.",
            placeholder: "Povoliť marketingové e-maily",
            help: "Vyber si, či chceš dostávať marketingové e-maily a ponuky",
          },
          bio: {
            label: "O mne",
            description: "Krátke predstavenie",
            placeholder: "Napíš niečo o sebe…",
            help: "Napíš krátke predstavenie, ktoré sa zobrazí v tvojom profile",
            validation: {
              maxLength: "Predstavenie môže mať najviac 500 znakov",
            },
          },
          websiteUrl: {
            label: "Webová stránka",
            description: "Tvoj osobný alebo firemný web",
            placeholder: "https://yoursite.com",
          },
          twitterUrl: {
            label: "X / Twitter",
            description: "URL tvojho profilu na X (Twitter)",
            placeholder: "https://x.com/yourhandle",
          },
          youtubeUrl: {
            label: "YouTube",
            description: "URL tvojho kanála na YouTube",
            placeholder: "https://youtube.com/@yourchannel",
          },
          instagramUrl: {
            label: "Instagram",
            description: "URL tvojho profilu na Instagrame",
            placeholder: "https://instagram.com/yourhandle",
          },
          tiktokUrl: {
            label: "TikTok",
            description: "URL tvojho profilu na TikToku",
            placeholder: "https://tiktok.com/@yourhandle",
          },
          githubUrl: {
            label: "GitHub",
            description: "URL tvojho profilu na GitHube",
            placeholder: "https://github.com/yourusername",
          },
          facebookUrl: {
            label: "Facebook",
            description: "URL tvojej stránky alebo profilu na Facebooku",
            placeholder: "https://facebook.com/yourpage",
          },
          discordUrl: {
            label: "Discord",
            description: "Odkaz na tvoj server alebo profil v službe Discord",
            placeholder: "https://discord.gg/yourserver",
          },
          tribeUrl: {
            label: "Tribe",
            description: "URL tvojej komunity v službe Tribe",
            placeholder: "https://yourcommunity.tribe.so",
          },
          rumbleUrl: {
            label: "Rumble",
            description: "URL tvojho kanála na Rumble",
            placeholder: "https://rumble.com/c/yourchannel",
          },
          odyseeUrl: {
            label: "Odysee",
            description: "URL tvojho kanála na Odysee",
            placeholder: "https://odysee.com/@yourchannel",
          },
          nostrUrl: {
            label: "Nostr",
            description: "Tvoj profil na Nostr alebo adresa npub",
            placeholder: "https://primal.net/p/npub1...",
          },
          gabUrl: {
            label: "Gab",
            description: "URL tvojho profilu na Gab",
            placeholder: "https://gab.com/yourhandle",
          },
          creatorSlug: {
            label: "URL profilu",
            description:
              "Vlastný identifikátor profilu, ktorý bude súčasťou verejného odkazu",
            placeholder: "jane-doe",
            validation: {
              invalid: "Použi iba malé písmená, číslice a spojovníky",
            },
          },
          creatorAccentColor: {
            label: "Farba zvýraznenia",
            description:
              "Farba stránok tvojich zručností v hexadecimálnom formáte (nepovinné)",
            placeholder: "#7c3aed",
          },
          creatorHeaderImageUrl: {
            label: "Obrázok hlavičky",
            description: "URL úvodného obrázka na stránke tvojej zručnosti",
            placeholder: "https://yoursite.com/banner.jpg",
          },
        },
        response: {
          title: "Aktualizovaný profil",
          description: "Aktualizované informácie o profile",
          success: "Zmeny uložené",
          message: "Tvoj profil sa aktualizoval",
          id: "ID používateľa",
          leadId: "ID potenciálneho zákazníka",
          isPublic: "Verejný profil",
          email: "E-mailová adresa",
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          locale: "Jazyk a oblasť",
          isActive: "Stav aktivity",
          emailVerified: "E-mail overený",
          requireTwoFactor: "Vyžaduje sa dvojfaktorové overenie",
          marketingConsent: "Súhlas s marketingom",
          userRoles: "Roly používateľa",
          createdAt: "Vytvorené",
          updatedAt: "Aktualizované",
          stripeCustomerId: "ID zákazníka v Stripe",
          bio: "O mne",
          websiteUrl: "Webová stránka",
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
          creatorSlug: "Identifikátor profilu v URL",
          creatorAccentColor: "Farba zvýraznenia",
          creatorHeaderImageUrl: "Obrázok hlavičky",
          user: "Aktualizované údaje o používateľovi",
          changesSummary: {
            title: "Prehľad zmien",
            description: "Prehľad zmien v tvojom profile",
            totalChanges: "Počet zmien",
            changedFields: "Zmenené polia",
            verificationRequired: "Vyžaduje sa overenie",
            lastUpdated: "Posledná aktualizácia",
          },
          nextSteps: "Ďalšie kroky",
        },
        errors: {
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatné parametre požiadavky",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: {
            title: "Nenájdené",
            description: "Profil používateľa sa nenašiel",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt údajov",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Niektoré zmeny nie sú uložené",
          },
          internal: {
            title: "Interná chyba",
            description: "Vyskytla sa interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
        },
        success: {
          title: "Úspech",
          description: "Profil sa aktualizoval",
          nextSteps: "Odporúčané kroky po úprave profilu",
        },
      },
      delete: {
        title: "Odstrániť používateľský účet",
        description: "Natrvalo odstráň svoj používateľský účet",
        response: {
          title: "Stav odstránenia",
          description: "Potvrdenie odstránenia účtu",
        },
        errors: {
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatné parametre požiadavky",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: {
            title: "Nenájdené",
            description: "Používateľský účet sa nenašiel",
          },
          conflict: {
            title: "Konflikt",
            description: "Vyskytol sa konflikt údajov",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Niektoré zmeny nie sú uložené",
          },
          internal: {
            title: "Interná chyba",
            description: "Vyskytla sa interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
        },
        success: {
          title: "Úspech",
          description: "Účet sa odstránil",
        },
      },
      put: {
        response: {
          changedFields: {
            item: "Zmenené pole",
          },
        },
      },
      category: "Profil používateľa",
      tag: "Profil používateľa",
      tags: {
        profile: "profil",
        user: "používateľ",
        account: "účet",
      },

      widget: {
        save: "Uložiť profil",
        saving: "Ukladá sa…",
        editProfile: "Upraviť profil",
        cancelEdit: "Zrušiť",
        memberSince: "Účet od",
        profileCard: {
          title: "Profil autora",
          description: "Takto ťa ostatní uvidia na platforme",
        },
        socialCard: {
          title: "Odkazy na sociálne siete",
          description: "Pridaj odkazy na svoje profily",
        },
        emailCard: {
          title: "Tvoj zoznam odberateľov",
          description:
            "Návštevníci sa môžu prihlásiť na odber na stránke tvojej zručnosti aj v profile autora. Zoznam odberateľov patrí tebe a spravuješ ho priamo.",
        },
        previewCard: {
          title: "Tvoj verejný profil",
          description: "Ako ťa vidia ostatní",
        },
        noPreview: "Vyplň profil a zobrazí sa jeho náhľad",
        noSocials: "Zatiaľ bez odkazov na sociálne siete",
        viewPublicProfile: "Zobraziť verejný profil",
        profileUrl: "Tvoj odkaz",
        slugWarning:
          "Po zmene URL prestanú fungovať doterajšie odkazy na tvoj profil.",
        bioPreview: "Náhľad",
        bioEdit: "Upraviť",
        skills: {
          title: "Moje zručnosti",
          chat: "Začať četovať",
          add: "Pridať do zbierky",
          public: "Komunita",
          showLess: "Zobraziť menej",
        },
        deleteAccount: {
          dangerZone: "Nezvratné zmeny",
          button: "Odstrániť účet",
          confirmTitle: "Natrvalo odstrániť účet",
          confirmDescription:
            "Účet aj všetky súvisiace údaje sa natrvalo odstránia. Po potvrdení sa už nedajú obnoviť.",
          confirmLabel: "Potvrď zadaním „DELETE“",
          confirmPlaceholder: "DELETE",
          confirmButton: "Natrvalo odstrániť môj účet",
          cancelButton: "Zrušiť",
          whatGetsDeleted: "Údaje, ktoré sa odstránia",
          items: {
            profile: "Tvoj profil a všetky nastavenia",
            chats: "Všetky čety a ich história",
            skills: "Všetky vlastné zručnosti a nastavenia",
            files: "Všetky súbory a spomienky v Cortexe",
            subscriptions: "Aktívne predplatné",
            credits: "Všetky zostávajúce kredity",
          },
          deleting: "Odstraňuje sa…",
          success: "Účet sa odstránil. Presmerúva sa…",
        },
      },

      // Sub-routes
      avatar: {
        category: "Profil používateľa",

        tag: "avatar",
        errors: {
          user_not_found: "Používateľ sa nenašiel",
          failed_to_upload_avatar: "Profilový obrázok sa nepodarilo nahrať",
          failed_to_delete_avatar: "Profilový obrázok sa nepodarilo odstrániť",
          invalid_file_type: "Neplatný typ súboru",
          file_too_large: "Príliš veľký súbor",
        },
        debug: {
          uploadingUserAvatar: "Nahráva sa profilový obrázok používateľa",
          errorUploadingUserAvatar:
            "Chyba pri nahrávaní profilového obrázka používateľa",
          deletingUserAvatar: "Odstraňuje sa profilový obrázok používateľa",
          errorDeletingUserAvatar:
            "Chyba pri odstraňovaní profilového obrázka používateľa",
        },
        success: {
          uploaded: "Profilový obrázok bol nahraný",
          deleted: "Profilový obrázok sa odstránil",
          nextSteps: {
            visible: "Nový obrázok sa zobrazuje vo vašom profile",
            update: "Obrázok môžete kedykoľvek zmeniť v nastaveniach profilu",
            default: "Vo vašom profile sa zobrazuje predvolený obrázok",
            uploadNew:
              "Nový profilový obrázok môžete kedykoľvek nahrať v nastaveniach profilu",
          },
        },
        upload: {
          title: "Nahrať profilový obrázok",
          description: "Nahrať profilový obrázok",
          groups: {
            fileUpload: {
              title: "Nahratie súboru",
              description: "Vyberte a nahrajte profilový obrázok",
            },
          },
          fields: {
            file: {
              label: "Profilový obrázok",
              description: "Vyberte súbor s profilovým obrázkom",
              placeholder: "Vyberte súbor s obrázkom...",
              help: "Nahrajte obrázok (JPG, PNG alebo GIF) s veľkosťou do 5 MB",
              validation: {
                maxSize: "Súbor musí mať menej ako 5 MB",
                imageOnly: "Povolené sú len obrázky",
                unsupportedFormat:
                  "Nepodporovaný formát obrázka. Použite JPEG, PNG, WebP alebo GIF.",
              },
            },
          },
          response: {
            title: "Odpoveď po nahratí",
            label: "Výsledok nahratia",
            description: "Výsledok nahratia profilového obrázka",
            success: "Nahratie sa podarilo",
            message: "Profilový obrázok bol nahraný",
            avatarUrl: "URL profilového obrázka",
            uploadTime: "Čas nahratia",
            nextSteps: {
              item: "Nasledujúci krok",
            },
          },
          errors: {
            validation: {
              title: "Chyba kontroly údajov",
              description: "Nahraný súbor je neplatný alebo poškodený",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description:
                "Na nahratie profilového obrázka sa musíte prihlásiť",
            },
            server: {
              title: "Chyba servera",
              description: "Profilový obrázok sa nepodarilo nahrať",
            },
            internal: {
              title: "Interná chyba",
              description: "Vyskytla sa interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Pri nahrávaní nastala neočakávaná chyba",
            },
            network: {
              title: "Chyba siete",
              description: "Pri nahrávaní nastala chyba siete",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Nemáte oprávnenie nahrať profilový obrázok",
            },
            notFound: {
              title: "Nenájdené",
              description: "Požadovaný zdroj sa nenašiel",
            },
            unsaved: {
              title: "Neuložené zmeny",
              description: "Niektoré zmeny nie sú uložené",
            },
            conflict: {
              title: "Konflikt údajov",
              description: "Počas nahrávania došlo ku konfliktu",
            },
          },
          success: {
            title: "Profilový obrázok nahraný",
            description: "Profilový obrázok bol nahraný",
          },
        },
        delete: {
          title: "Odstrániť profilový obrázok",
          description: "Odstrániť aktuálny profilový obrázok",
          response: {
            title: "Odpoveď po odstránení",
            label: "Výsledok odstránenia",
            description: "Výsledok odstránenia profilového obrázka",
            success: "Odstránenie sa podarilo",
            message: "Váš profilový obrázok sa odstránil",
            nextSteps: {
              item: "Nasledujúci krok",
            },
          },
          errors: {
            validation: {
              title: "Chyba kontroly údajov",
              description:
                "Požiadavka na odstránenie profilového obrázka je neplatná",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description:
                "Na odstránenie profilového obrázka sa musíte prihlásiť",
            },
            server: {
              title: "Chyba servera",
              description: "Profilový obrázok sa nepodarilo odstrániť",
            },
            internal: {
              title: "Interná chyba",
              description: "Vyskytla sa interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Pri odstraňovaní nastala neočakávaná chyba",
            },
            network: {
              title: "Chyba siete",
              description: "Pri odstraňovaní nastala chyba siete",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description:
                "Nemáte oprávnenie odstrániť tento profilový obrázok",
            },
            notFound: {
              title: "Nenájdené",
              description: "Profilový obrázok na odstránenie sa nenašiel",
            },
            unsaved: {
              title: "Neuložené zmeny",
              description: "Niektoré zmeny nie sú uložené",
            },
            conflict: {
              title: "Konflikt údajov",
              description: "Pri odstraňovaní došlo ku konfliktu",
            },
          },
          success: {
            title: "Profilový obrázok odstránený",
            description: "Profilový obrázok bol odstránený",
          },
        },
      },
      password: {
        category: "Profil používateľa",

        title: "Zmeniť heslo",
        description: "Bezpečne zmeň heslo k účtu",
        tag: "password-change",
        debug: {
          updatingPassword: "Heslo sa mení",
          errorUpdatingPassword: "Heslo sa nepodarilo zmeniť",
          settingPassword: "Nastavuje sa heslo",
          errorSettingPassword: "Heslo sa nepodarilo nastaviť",
        },
        groups: {
          currentCredentials: {
            title: "Aktuálne heslo",
            description: "Pred pokračovaním over aktuálne heslo",
          },
          newCredentials: {
            title: "Nové heslo",
            description: "Vyber si nové silné heslo k účtu",
          },
        },
        currentPassword: {
          label: "Aktuálne heslo",
          description: "Zadaj aktuálne heslo",
          placeholder: "Zadaj aktuálne heslo",
          help: "Ak chceš zmeniť heslo, potvrď svoju totožnosť aktuálnym heslom",
        },
        newPassword: {
          label: "Nové heslo",
          description: "Zadaj nové heslo s aspoň 8 znakmi",
          placeholder: "Zadaj nové heslo",
          help: "Vyber silné heslo s aspoň 8 znakmi vrátane písmen, číslic a symbolov",
        },
        confirmPassword: {
          label: "Potvrdenie hesla",
          description: "Potvrď nové heslo",
          placeholder: "Potvrdiť nové heslo",
          help: "Zadaj nové heslo znova, aby sa overilo, že si ho napísal správne",
        },
        twoFactorCode: {
          label: "Kód dvojfaktorového overenia",
          description: "Ak máš zapnuté dvojfaktorové overenie, zadaj kód",
          placeholder: "Zadaj kód dvojfaktorového overenia",
        },
        response: {
          title: "Výsledok zmeny hesla",
          description: "Údaje po zmene hesla",
          success: "Heslo zmenené",
          message: "Správa o stave",
          securityTip: "Bezpečnostný tip",
          nextSteps: {
            item: "Ďalšie kroky",
          },
        },
        validation: {
          currentPassword: {
            minLength: "Aktuálne heslo musí mať aspoň 8 znakov",
          },
          newPassword: {
            minLength: "Nové heslo musí mať aspoň 8 znakov",
          },
          confirmPassword: {
            minLength: "Potvrdenie hesla musí mať aspoň 8 znakov",
          },
          passwords: {
            mismatch: "Heslá sa nezhodujú",
          },
        },
        errors: {
          passwords_do_not_match: "Heslá sa nezhodujú",
          user_not_found: "Používateľ sa nenašiel",
          incorrect_password: "Nesprávne heslo",
          update_failed: "Heslo sa nepodarilo zmeniť",
          token_creation_failed: "Nepodarilo sa vytvoriť token hesla",
          two_factor_code_required: "Vyžaduje sa kód dvojfaktorového overenia",
          invalid_two_factor_code: "Neplatný kód dvojfaktorového overenia",
          invalid_request: {
            title: "Neplatná požiadavka",
            description: "Požiadavka na zmenu hesla je neplatná",
          },
          validation: {
            title: "Chyba kontroly údajov",
            description: "Skontroluj zadané údaje a skús to znova",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Ak chceš zmeniť heslo, prihlás sa",
          },
          server: {
            title: "Chyba servera",
            description: "Heslo sa nepodarilo zmeniť pre chybu servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Pri zmene hesla nastala neočakávaná chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Sieťové pripojenie zlyhalo",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Na túto akciu nemáš oprávnenie",
          },
          notFound: {
            title: "Používateľ sa nenašiel",
            description: "Používateľský účet sa nenašiel",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Neuložené zmeny sa stratia",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Pri zmene hesla došlo ku konfliktu",
          },
        },
        success: {
          updated: "Heslo sa zmenilo",
          securityTip: "Pre vyššiu bezpečnosť zapni dvojfaktorové overenie",
          nextSteps: {
            logoutOther:
              "Pre tvoju bezpečnosť sme ťa odhlásili zo všetkých ostatných relácií",
            enable2fa:
              "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
          },
          title: "Heslo sa zmenilo",
          description: "Tvoje heslo bolo zmenené",
        },
        update: {
          success: {
            title: "Heslo sa zmenilo",
            description: "Tvoje heslo bolo zmenené",
          },
          errors: {
            unknown: {
              title: "Neznáma chyba",
              description: "Pri zmene hesla nastala neočakávaná chyba",
            },
          },
        },
      },
      addresses: {
        category: "Uložené adresy",
        tag: "addresses",

        list: {
          title: "Moje adresy",
          description: "Zobraziť uložené adresy",
          response: {
            addresses: "Adresy",
          },
          widget: {
            addAddress: "Pridať adresu",
            edit: "Upraviť",
            delete: "Odstrániť",
            billing: "Fakturácia",
            delivery: "Doručenie",
            empty: "Žiadne uložené adresy",
          },
          errors: {
            validation: {
              title: "Chyba kontroly údajov",
              description: "Neplatná požiadavka",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Vyžaduje sa prihlásenie",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Prístup zamietnutý",
            },
            notFound: {
              title: "Nenájdené",
              description: "Nenašli sa žiadne adresy",
            },
            conflict: {
              title: "Konflikt údajov",
              description: "Konflikt údajov",
            },
            network: {
              title: "Chyba siete",
              description: "Vyskytla sa chyba siete",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Niektoré zmeny nie sú uložené",
            },
            internal: {
              title: "Chyba servera",
              description: "Interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neznáma chyba",
            },
          },
          success: { title: "Úspech", description: "Adresy sa načítali" },
        },

        create: {
          title: "Pridať adresu",
          description: "Uložiť do účtu novú adresu",
          fields: {
            label: {
              label: "Označenie",
              description: "Pomenuj adresu, napríklad Domov alebo Kancelária",
              placeholder: "Domov",
            },
            fullName: {
              label: "Celé meno",
              description: "Meno kontaktnej osoby pre túto adresu",
              placeholder: "Jana Nováková",
            },
            company: {
              label: "Spoločnosť",
              description: "Názov spoločnosti (nepovinné)",
              placeholder: "Príklad, s. r. o.",
            },
            phone: {
              label: "Telefón",
              description: "Kontaktné telefónne číslo",
              placeholder: "+421 900 000 000",
            },
            vatNumber: {
              label: "IČ DPH",
              description: "Identifikačné číslo pre DPH v EÚ",
              placeholder: "SK1234567890",
            },
            taxId: {
              label: "DIČ",
              description: "Daňové identifikačné číslo",
              placeholder: "1234567890",
            },
            addressLine1: {
              label: "Adresa, riadok 1",
              description: "Ulica a číslo",
              placeholder: "Hlavná 123",
            },
            addressLine2: {
              label: "Adresa, riadok 2",
              description: "Byt, kancelária alebo jednotka (nepovinné)",
              placeholder: "Byt 4B",
            },
            city: {
              label: "Mesto",
              description: "Mesto",
              placeholder: "Bratislava",
            },
            region: {
              label: "Štát alebo región",
              description: "Štát alebo región (nepovinné)",
              placeholder: "Bratislavský kraj",
            },
            postalCode: {
              label: "PSČ",
              description: "ZIP alebo PSČ",
              placeholder: "811 01",
            },
            country: {
              label: "Krajina",
              description: "Dvojpísmenový kód krajiny podľa ISO 3166-1 alpha-2",
              placeholder: "SK",
            },
            isDefaultBilling: {
              label: "Predvolená fakturačná adresa",
              description: "Použiť ako predvolenú fakturačnú adresu",
            },
            isDefaultDelivery: {
              label: "Predvolená adresa doručenia",
              description: "Použiť ako predvolenú adresu doručenia",
            },
          },
          response: {
            id: "ID adresy",
            label: "Označenie",
          },
          errors: {
            validation: {
              title: "Chyba kontroly údajov",
              description: "Skontroluj povinné polia",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Vyžaduje sa prihlásenie",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Prístup zamietnutý",
            },
            notFound: {
              title: "Nenájdené",
              description: "Používateľ sa nenašiel",
            },
            conflict: {
              title: "Konflikt údajov",
              description: "Konflikt údajov",
            },
            network: {
              title: "Chyba siete",
              description: "Vyskytla sa chyba siete",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Niektoré zmeny nie sú uložené",
            },
            internal: {
              title: "Chyba servera",
              description: "Interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neznáma chyba",
            },
          },
          success: {
            title: "Adresa sa uložila",
            description: "Adresa sa pridala do vášho účtu",
          },
          widget: {
            saved: "Adresa sa uložila.",
            backToAddresses: "Späť na adresy",
          },
        },
      },
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "V súboroch cookie chýba token",
        },
      },
      errors: {
        session_not_found: "Relácia sa nenašla",
        session_lookup_failed: "Nepodarilo sa vyhľadať reláciu",
        expired_sessions_delete_failed:
          "Relácie s uplynutou platnosťou sa nepodarilo odstrániť",
        session_creation_failed: "Nepodarilo sa vytvoriť reláciu",
        session_creation_database_error: "Chyba databázy pri vytváraní relácie",
        user_sessions_delete_failed:
          "Nepodarilo sa odstrániť relácie používateľa",
        expired: "Platnosť relácie vypršala",
      },
      post: {
        title: "Relácia",
        description: "Koncový bod pre relácie",
        form: {
          title: "Nastavenia relácie",
          description: "Nastavte parametre relácie",
        },
        response: {
          title: "Odpoveď",
          description: "Údaje odpovede o relácii",
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
        },
        success: {
          title: "Úspech",
          description: "Operácia sa úspešne dokončila",
        },
      },
    },
    sessions: {
      category: "Používatelia",

      list: {
        title: "Moje relácie",
        description: "Zobraziť všetky aktívne relácie tvojho účtu",
        tag: "Relácie",
        response: {
          sessions: "Relácie",
        },
        success: {
          title: "Relácie sa načítali",
          description: "Aktívne relácie sa načítali",
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatná požiadavka",
          },
          server: {
            title: "Chyba servera",
            description: "Interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: { title: "Nenájdené", description: "Zdroj sa nenašiel" },
          conflict: {
            title: "Konflikt údajov",
            description: "Konflikt údajov",
          },
        },
      },
      create: {
        title: "Vytvoriť token relácie",
        description: "Vytvoriť pomenovaný token relácie na prístup z kódu",
        tag: "Relácie",
        form: {
          name: "Názov tokenu",
          namePlaceholder: "napr. Môj agent",
        },
        response: {
          token: "Token",
          id: "ID relácie",
          name: "Meno",
          message: "Skopíruj token. Znova sa nezobrazí.",
        },
        success: {
          title: "Relácia sa vytvorila",
          description: "Token relácie sa vytvoril",
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatná požiadavka",
          },
          server: {
            title: "Chyba servera",
            description: "Interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: { title: "Nenájdené", description: "Zdroj sa nenašiel" },
          conflict: {
            title: "Konflikt údajov",
            description: "Konflikt údajov",
          },
        },
      },
      revoke: {
        title: "Zrušiť reláciu",
        description: "Zrušiť token relácie podľa ID",
        tag: "Relácie",
        response: {
          message: "Relácia sa zrušila",
        },
        success: {
          title: "Relácia sa zrušila",
          description: "Relácia sa zrušila",
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatná požiadavka",
          },
          server: {
            title: "Chyba servera",
            description: "Interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: { title: "Nenájdené", description: "Relácia sa nenašla" },
          conflict: {
            title: "Konflikt údajov",
            description: "Konflikt údajov",
          },
        },
      },
    },
  },
  public: {
    login: {
      category: "Používatelia",
      title: "Vitaj späť",
      description:
        "Získaj prístup k modelom AI bez cenzúry aj k histórii svojich četov.",
      tag: "Overenie totožnosti",
      options: {
        category: "Používatelia",

        title: "Možnosti prihlásenia",
        description: "Možnosti nastavenia prihlásenia",
        tag: "login-options",
        container: {
          title: "Nastavenie prihlásenia",
          description: "Nastavte možnosti prihlásenia",
        },
        fields: {
          email: {
            label: "E-mailová adresa",
            description: "Zadaj e-mailovú adresu",
            placeholder: "meno@example.com",
          },
          allowPasswordAuth: {
            label: "Povoliť prihlásenie heslom",
            description: "Povoliť overenie pomocou hesla",
          },
          allowSocialAuth: {
            label: "Povoliť prihlásenie cez externý účet",
            description: "Povoliť prihlásenie cez externého poskytovateľa",
          },
          maxAttempts: {
            label: "Maximálny počet pokusov o prihlásenie",
            description: "Najvyšší povolený počet pokusov o prihlásenie",
          },
          requireTwoFactor: {
            label: "Vyžadovať dvojfaktorové overenie",
            description: "Pri prihlásení vyžadovať dvojfaktorové overenie",
          },
          socialProviders: {
            label: "Externí poskytovatelia prihlásenia",
            description: "Dostupní externí poskytovatelia prihlásenia",
          },
          socialProvider: {
            title: "Externý poskytovateľ prihlásenia",
            description: "Nastavenie externého poskytovateľa prihlásenia",
            enabled: {
              label: "Zapnuté",
              description: "Určuje, či je tento poskytovateľ povolený",
            },
            name: {
              label: "Názov poskytovateľa",
              description: "Názov externého poskytovateľa prihlásenia",
            },
            providers: {
              label: "Možnosti poskytovateľa",
              description: "Dostupné možnosti externých poskytovateľov",
            },
          },
        },
        response: {
          title: "Výsledok načítania možností prihlásenia",
          description: "Dostupné možnosti nastavenia prihlásenia",
          success: {
            badge: "Úspech",
          },
          message: {
            content: "Správa o stave",
          },
          forUser: {
            content: "E-mailová adresa",
          },
          loginMethods: {
            title: "Spôsoby prihlásenia",
            description: "Dostupné spôsoby overenia",
            password: {
              title: "Prihlásenie heslom",
              description: "Bežné overenie heslom",
              enabled: {
                badge: "Zapnuté",
              },
            },
            social: {
              title: "Prihlásenie cez externý účet",
              description: "Možnosti prihlásenia cez účty sociálnych sietí",
              enabled: {
                badge: "Zapnuté",
              },
              providers: {
                item: {
                  title: "Externý poskytovateľ prihlásenia",
                  description: "Externý poskytovateľ prihlásenia",
                },
                name: {
                  content: "Názov poskytovateľa",
                },
                id: {
                  content: "ID poskytovateľa",
                },
                enabled: {
                  badge: "Dostupné",
                },
                description: "Opis poskytovateľa",
              },
            },
          },
          security: {
            title: "Bezpečnostné nastavenia",
            description: "Požiadavky na bezpečnosť overovania",
            maxAttempts: {
              content: "Maximálny počet pokusov o prihlásenie",
            },
            requireTwoFactor: {
              badge: "Vyžaduje sa dvojfaktorové overenie",
            },
          },
          recommendations: {
            item: "Odporúčaná možnosť prihlásenia",
          },
        },
        errors: {
          validation: {
            title: "Chyba kontroly údajov",
            description: "Neplatné parametre požiadavky",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          server: {
            title: "Chyba servera",
            description: "Vyskytla sa interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt údajov",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Zmeny sa neuložili",
          },
        },
        success: {
          title: "Úspech",
          description: "Možnosti prihlásenia sa načítali",
        },
        post: {
          title: "Možnosti prihlásenia",
          description: "Načítajte dostupné možnosti prihlásenia",
          response: {
            title: "Výsledok načítania možností prihlásenia",
            description: "Dostupné možnosti nastavenia prihlásenia",
          },
          errors: {
            validation: {
              title: "Chyba kontroly údajov",
              description: "Neplatné parametre požiadavky",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Vyžaduje sa prihlásenie",
            },
            server: {
              title: "Chyba servera",
              description: "Vyskytla sa interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neznáma chyba",
            },
          },
          success: {
            description: "Možnosti prihlásenia sa načítali",
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
          successMessage: "Možnosti prihlásenia sa načítali",
          passwordAuthDescription: "Prihlás sa e-mailom a heslom",
          socialAuthDescription: "Prihlás sa cez účet sociálnej siete",
          continueWithProvider: "Pokračovať cez {{provider}}",
          twoFactorRequired: "Zvýšená bezpečnosť: vyžaduje sa 2FA",
          standardSecurity: "Štandardné bezpečnostné požiadavky",
          tryPasswordFirst: "Najprv skús prihlásenie heslom",
          useSocialLogin: "Použiť prihlásenie cez externý účet",
          socialLoginFaster:
            "Noví používatelia sa cez externý účet prihlásia rýchlejšie",
        },
      },
      actions: {
        submit: "Prihlásiť sa",
        submitting: "Prihlasuje sa…",
      },
      fields: {
        email: {
          label: "Tvoj e-mail",
          description: "E-mailová adresa použitá pri registrácii.",
          placeholder: "Zadaj e-mail",
          validation: {
            required: "Zadaj e-mailovú adresu",
            invalid: "Zadaj platnú e-mailovú adresu",
          },
        },
        password: {
          label: "Tvoje heslo",
          description: "Zadaj heslo, ktoré si nastavil pri registrácii.",
          placeholder: "Zadaj heslo",
          help: "Zadaj heslo k účtu",
          validation: {
            required: "Zadaj heslo",
            minLength: "Heslo musí mať aspoň 8 znakov",
          },
        },
        rememberMe: {
          label: "Zostať prihlásený",
        },
      },
      groups: {
        credentials: {
          title: "Prihlasovacie údaje",
          description: "Zadaj prihlasovacie údaje",
        },
        options: {
          title: "Možnosti prihlásenia",
          description: "Ďalšie možnosti a nastavenia prihlásenia",
        },
        preferences: {
          title: "Nastavenia prihlásenia",
          description: "Ďalšie možnosti prihlásenia",
        },
        advanced: {
          title: "Pokročilé možnosti",
          description: "Pokročilé nastavenia prihlásenia",
        },
      },
      footer: {
        forgotPassword: "Zabudol si heslo?",
        createAccount: "Ešte nemáš účet? Zaregistruj sa",
      },
      response: {
        title: "Výsledok prihlásenia",
        description: "Údaje o výsledku prihlásenia",
        success: "Prihlásenie prebehlo úspešne",
        message: "Správa o stave",
        user: {
          title: "Údaje o používateľovi",
          description: "Údaje o prihlásenom používateľovi",
          id: "ID používateľa",
          email: "E-mailová adresa",
          firstName: "Krstné meno",
          lastName: "Priezvisko",
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          imageUrl: "Profilový obrázok",
        },
        sessionInfo: {
          title: "Údaje o relácii",
          description: "Podrobnosti o relácii používateľa",
          expiresAt: "Platnosť relácie do",
          rememberMeActive: "Stav trvalého prihlásenia",
          loginLocation: "Miesto prihlásenia",
        },
        nextSteps: {
          title: "Ďalšie kroky",
          item: "Ďalšie kroky",
        },
      },
      errors: {
        title: "Chyba prihlásenia",
        account_locked: "Účet je uzamknutý",
        accountLocked: "Účet je uzamknutý",
        accountLockedDescription: "Tvoj účet je uzamknutý. Kontaktuj podporu.",
        invalid_credentials: "Nesprávny e-mail alebo heslo",
        two_factor_required: "Vyžaduje sa dvojfaktorové overenie",
        auth_error: "Pri overovaní prihlásenia nastala chyba",
        user_not_found: "Používateľ sa nenašiel",
        session_creation_failed: "Nepodarilo sa vytvoriť reláciu",
        token_save_failed: "Prihlasovací token sa nepodarilo uložiť",
        validation: {
          title: "Kontrola údajov zlyhala",
          description: "Skontroluj zadané údaje",
        },
        unauthorized: {
          title: "Prihlásenie zlyhalo",
          description: "Neplatné prihlasovacie údaje",
        },
        unknown: {
          title: "Chyba prihlásenia",
          description: "Pri prihlásení nastala chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Spojenie zlyhalo",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prihlásenie nie je povolené",
        },
        notFound: {
          title: "Používateľ sa nenašiel",
          description: "Používateľský účet sa nenašiel",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Zmeny sa neuložili",
        },
        conflict: {
          title: "Konflikt prihlásenia",
          description: "Pri prihlásení nastal konflikt",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
      },
      success: {
        title: "Prihlásenie prebehlo úspešne",
        description: "Prihlásenie je dokončené",
        message: "Vitaj späť. Prihlásenie prebehlo úspešne.",
      },
      token: {
        save: {
          failed: "Prihlasovací token sa nepodarilo uložiť",
          success: "Prihlasovací token sa uložil",
        },
      },
      process: {
        failed: "Prihlásenie zlyhalo",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "Rýchle prihlásenie pre vývojárov",
      },
    },
    resetPassword: {
      confirm: {
        category: "Používatelia",

        title: "Potvrdiť obnovu hesla",
        description: "Potvrď obnovu hesla nastavením nového hesla",
        tag: "Obnovenie hesla",
        email: {
          title: "Heslo bolo obnovené",
          subject: "Heslo k účtu {{appName}} bolo obnovené",
          previewText:
            "Heslo k účtu {{appName}} bolo obnovené. Prihlás sa a četuj s AI. Na výber máš {{modelCount}} modelov.",
          greeting: "Ahoj, {{name}},",
          successMessage:
            "Heslo bolo obnovené. Prihlás sa a pokračuj tam, kde si skončil.",
          loginButton: "Prihlásiť sa do {{appName}}",
          promoText:
            "Modely AI na výber: {{modelCount}}. Bez filtrov a bez poučovania.",
          securityWarning:
            "Ak si heslo nemenil, ihneď kontaktuj podporu. Tvoj účet môže byť ohrozený.",
        },
        groups: {
          verification: {
            title: "Overenie",
            description: "Over žiadosť o obnovu hesla",
          },
          newPassword: {
            title: "Nové heslo",
            description: "Nastav nové heslo",
          },
        },
        fields: {
          token: {
            label: "Token na obnovu hesla",
            description: "Token na obnovu hesla z e-mailu",
            placeholder: "Zadaj token na obnovu hesla",
            help: "Token na obnovu hesla nájdeš v e-maile. Zadaj ho sem.",
            validation: {
              required: "Zadaj token na obnovu hesla",
            },
          },
          email: {
            label: "E-mailová adresa",
            description: "Tvoja e-mailová adresa",
            placeholder: "Zadaj e-mailovú adresu",
            validation: {
              invalid: "Zadaj platnú e-mailovú adresu",
            },
          },
          password: {
            label: "Nové heslo",
            description: "Tvoje nové heslo",
            placeholder: "Zadaj nové heslo",
            help: "Vyber silné heslo s aspoň 8 znakmi vrátane písmen, číslic a symbolov",
            validation: {
              minLength: "Heslo musí mať aspoň 8 znakov",
            },
          },
          confirmPassword: {
            label: "Potvrdenie hesla",
            description: "Potvrď nové heslo",
            placeholder: "Potvrdiť nové heslo",
            validation: {
              minLength: "Heslo musí mať aspoň 8 znakov",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Heslá sa nezhodujú",
          },
        },
        response: {
          title: "Výsledok obnovy hesla",
          description: "Odpoveď na potvrdenie obnovy hesla",
          message: {
            label: "Správa",
            description: "Správa v odpovedi",
          },
          securityTip:
            "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
          nextSteps: [
            "Prihlás sa novým heslom",
            "Aktualizuj uložené heslá v prehliadači",
            "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
          ],
        },
        errors: {
          title: "Chyba pri obnove hesla",
          no_email: "K tejto e-mailovej adrese sa nenašiel žiadny účet",
          validation: {
            title: "Chyba kontroly údajov",
            description: "Skontroluj zadané údaje a skús to znova",
            passwordsDoNotMatch: "Heslá sa nezhodujú",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description:
              "Token na obnovu hesla je neplatný alebo mu vypršala platnosť",
          },
          internal: {
            title: "Chyba servera",
            description: "Vyskytla sa interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Chyba sieťového pripojenia",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáš oprávnenie vykonať túto akciu",
          },
          notFound: {
            title: "Nenájdené",
            description:
              "Token na obnovu hesla sa nenašiel alebo mu vypršala platnosť",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Niektoré zmeny nie sú uložené",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Pri spracovaní tvojej požiadavky došlo ku konfliktu",
          },
        },
        success: {
          title: "Heslo bolo obnovené",
          description: "Tvoje heslo bolo obnovené",
          message: "Heslo bolo obnovené",
          password_reset: "Tvoje heslo bolo obnovené",
        },
        actions: {
          requestNewLink: "Vyžiadať nový odkaz na obnovu hesla",
        },
        emailTemplates: {
          confirm: {
            name: "Potvrdzovací e-mail po obnove hesla",
            description:
              "Potvrdzovací e-mail odoslaný používateľovi po úspešnej obnove hesla",
            category: "Overenie totožnosti",
            preview: {
              publicName: {
                label: "Verejné meno",
                description: "Verejné zobrazovacie meno používateľa",
              },
              userId: {
                label: "ID používateľa",
                description: "Jedinečný identifikátor používateľa",
              },
            },
          },
        },
      },
      request: {
        category: "Používatelia",
        title: "Žiadosť o obnovu hesla",
        description: "Vyžiadať obnovu hesla",
        tag: "Obnovenie hesla",
        ui: {
          title: "Obnoviť heslo",
          subtitle: "Zadaj e-mailovú adresu a pošleme ti odkaz na obnovu hesla",
          sendResetLink: "Poslať odkaz na obnovu hesla",
          alreadyHaveAccount: "Už máš účet? Prihlás sa",
        },
        actions: {
          submitting: "Odosiela sa…",
        },
        email: {
          title: "Obnoviť heslo k účtu {{appName}}",
          subject: "Žiadosť o obnovu hesla k účtu {{appName}}",
          previewText:
            "Obnov si heslo k účtu {{appName}}. Platnosť odkazu v hodinách: {{hours}}.",
          greeting: "Ahoj, {{name}},",
          requestInfo:
            "Niekto požiadal o obnovu hesla k tvojmu účtu {{appName}}. Ak si to bol ty, použi tlačidlo nižšie.",
          buttonText: "Obnoviť moje heslo",
          expirationInfo:
            "Platnosť odkazu v hodinách: {{hours}}. Ak si o obnovu nežiadal, e-mail ignoruj. Heslo sa nezmenilo.",
          signoff: "Tím {{appName}}",
          promoText:
            "Modely AI na výber: {{modelCount}}. Bez filtrov a bez poučovania.",
        },
        groups: {
          emailInput: {
            title: "E-mailová adresa",
            description:
              "Zadaj e-mailovú adresu, na ktorú máme poslať pokyny na obnovu hesla",
          },
        },
        fields: {
          email: {
            label: "E-mailová adresa",
            description: "Zadaj e-mailovú adresu",
            placeholder: "meno@example.com",
            help: "Zadaj e-mailovú adresu priradenú k tvojmu účtu",
            validation: {
              invalid: "Zadaj platnú e-mailovú adresu",
            },
          },
        },
        response: {
          title: "Výsledok žiadosti o obnovu hesla",
          description: "Odpoveď na žiadosť o obnovenie hesla",
          success: {
            message: "Odkaz na obnovu hesla bol odoslaný",
          },
          deliveryInfo: {
            estimatedTime: "do 5 minút",
            expiresAt: "O 4 hodiny",
          },
          nextSteps: {
            checkEmail: "Skontroluj doručenú poštu aj priečinok so spamom",
            clickLink: "Klikni na odkaz na obnovu hesla v e-maile",
            createPassword: "Vytvor si nové silné heslo",
          },
        },
        errors: {
          title: "Chyba",
          validation: {
            title: "Chyba kontroly údajov",
            description: "Zadané údaje sú neplatné",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na túto požiadavku nemáš oprávnenie",
          },
          internal: {
            title: "Interná chyba",
            description: "Interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Chyba sieťového pripojenia",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: {
            title: "Nenájdené",
            description: "Zdroj sa nenašiel",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Zmeny sa neuložili",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt údajov",
          },
          no_email: "K tejto e-mailovej adrese sa nenašiel žiadny účet",
          email_generation_failed: "E-mail sa nepodarilo vytvoriť",
        },
        success: {
          title: "Žiadosť odoslaná",
          description: "Žiadosť o obnovu hesla bola odoslaná",
        },
        post: {
          title: "Žiadosť",
          description: "Koncový bod požiadavky",
          form: {
            title: "Konfigurácia žiadosti",
            description: "Nastavte parametre požiadavky",
          },
          response: {
            title: "Odpoveď",
            description: "Údaje odpovede na požiadavku",
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
            server: {
              title: "Chyba servera",
              description: "Vyskytla sa interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neznáma chyba",
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
              title: "Konflikt údajov",
              description: "Vyskytol sa konflikt údajov",
            },
          },
          success: {
            title: "Úspech",
            description: "Operácia prebehla úspešne",
          },
        },
        emailTemplates: {
          request: {
            name: "E-mail s odkazom na obnovu hesla",
            description: "E-mail s odkazom na obnovu hesla",
            category: "Overenie totožnosti",
            preview: {
              publicName: {
                label: "Verejné meno",
                description: "Verejné zobrazovacie meno používateľa",
              },
              userId: {
                label: "ID používateľa",
                description: "Jedinečný identifikátor používateľa",
              },
              passwordResetUrl: {
                label: "URL na obnovu hesla",
                description: "URL na obnovu hesla",
              },
            },
          },
        },
      },
      validate: {
        category: "Používatelia",

        title: "Overiť token na obnovu hesla",
        description: "Koncový bod na overenie tokenu na obnovu hesla",
        tag: "Overenie žiadosti o obnovu hesla",
        groups: {
          tokenInput: {
            title: "Overenie tokenu",
            description: "Zadaj token na obnovu hesla, ktorý chceš overiť",
          },
        },
        fields: {
          token: {
            label: "Token na obnovu hesla",
            description: "Token na obnovu hesla z e-mailu",
            placeholder: "Zadaj token na obnovu hesla",
            help: "Zadaj token, ktorý ti prišiel e-mailom",
            validation: {
              required: "Zadaj token na obnovu hesla",
            },
          },
        },
        response: {
          title: "Výsledok overenia",
          description: "Výsledok overenia tokenu",
          valid: "Token je platný",
          message: "Správa o overení",
          validationMessage: "Overenie tokenu na obnovu hesla sa dokončilo",
          userId: "ID používateľa",
          expiresAt: "Platnosť tokenu do",
          nextSteps: {
            item: "Ďalšie kroky po overení",
            steps: [
              "Pokračuj nastavením nového hesla",
              "Vyber si silné a jedinečné heslo",
            ],
          },
        },
        errors: {
          title: "Chyba",
          validation: {
            title: "Chyba kontroly údajov",
            description: "Token sa nepodarilo overiť",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Token je neplatný alebo mu vypršala platnosť",
          },
          internal: {
            title: "Interná chyba",
            description: "Vyskytla sa interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
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
            description: "Token sa nenašiel",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Zistili sa neuložené zmeny",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt údajov",
          },
        },
        success: {
          title: "Token je platný",
          description: "Token na obnovu hesla je platný",
        },
        post: {
          title: "Overiť",
          description: "Koncový bod overenia",
          form: {
            title: "Nastavenie overenia",
            description: "Nastavte parametre overenia",
          },
          response: {
            title: "Odpoveď",
            description: "Údaje odpovede po overení",
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
            server: {
              title: "Chyba servera",
              description: "Vyskytla sa interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neznáma chyba",
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
              title: "Konflikt údajov",
              description: "Vyskytol sa konflikt údajov",
            },
          },
          success: {
            title: "Úspech",
            description: "Operácia prebehla úspešne",
          },
        },
      },
      actions: {
        back: "Späť",
        submit: "Odoslať",
        submitting: "Odosiela sa…",
      },
      success: {
        password_reset: "Tvoje heslo bolo obnovené.",
      },
      errors: {
        tokenValidationFailed: "Token sa nepodarilo overiť",
        userLookupFailed: "Používateľa sa nepodarilo vyhľadať",
        tokenDeletionFailed: "Nepodarilo sa odstrániť token",
        userDeletionFailed: "Nepodarilo sa odstrániť používateľa",
        resetFailed: "Obnova hesla zlyhala",
        tokenCreationFailed: "Token na obnovu hesla sa nepodarilo vytvoriť",
        noDataReturned: "Databáza nevrátila žiadne údaje",
        tokenInvalid: "Token na obnovu hesla je neplatný",
        tokenExpired: "Platnosť tokenu na obnovu hesla vypršala",
        tokenVerificationFailed: "Overenie tokenu zlyhalo",
        userNotFound: "Používateľ sa nenašiel",
        passwordUpdateFailed: "Heslo sa nepodarilo zmeniť",
        passwordResetFailed: "Obnova hesla zlyhala",
        requestFailed: "Žiadosť o obnovu hesla zlyhala",
        emailMismatch: "E-mailová adresa sa nezhoduje",
        confirmationFailed: "Obnovu hesla sa nepodarilo potvrdiť",
      },
    },
    signup: {
      category: "Používatelia",

      _components: {
        passwordStrength: {
          label: "Sila hesla",
          weak: "Slabé",
          fair: "Prijateľné",
          good: "Dobré",
          strong: "Silné",
          requirement: {
            minLength: {
              icon: "✗",
              text: "Minimálne 8 znakov",
            },
            uppercase: {
              icon: "✗",
              text: "Najmenej jedno veľké písmeno",
            },
            lowercase: {
              icon: "✗",
              text: "Najmenej jedno malé písmeno",
            },
            number: {
              icon: "✗",
              text: "Aspoň jedna číslica",
            },
            special: {
              icon: "!",
              text: "Špeciálny znak (nepovinný, zvyšuje silu hesla)",
            },
          },
        },
        post: {
          title: "_components",
          description: "Koncový bod _components",
          form: {
            title: "Nastavenie _components",
            description: "Nastavte parametre _components",
          },
          response: {
            title: "Odpoveď",
            description: "Údaje odpovede _components",
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
            server: {
              title: "Chyba servera",
              description: "Vyskytla sa interná chyba servera",
            },
            unknown: {
              title: "Neznáma chyba",
              description: "Vyskytla sa neznáma chyba",
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
              title: "Konflikt údajov",
              description: "Vyskytol sa konflikt údajov",
            },
          },
          success: {
            title: "Úspech",
            description: "Operácia prebehla úspešne",
          },
        },
      },
      title: "Registrácia používateľa",
      description: "Koncový bod na registráciu používateľa",
      tag: "Overenie totožnosti",
      form: {
        title: "Vitaj v AI bez cenzúry",
        description:
          "Pomôž tvoriť nezávislú AI bez cenzúry, ktorá chráni tvoje súkromie. unbottled.ai má otvorený zdrojový kód a rozvíja ho komunita. Registráciou podporíš vývoj AI, ktorá rešpektuje tvoju slobodu.",
      },
      actions: {
        submit: "Vytvoriť účet",
        submitting: "Účet sa vytvára…",
      },
      fields: {
        privateName: {
          label: "Tvoje súkromné meno",
          description:
            "Takto ťa AI osloví v súkromných rozhovoroch. Toto meno zostane medzi tebou a AI.",
          placeholder: "Zadaj svoje meno",
          validation: {
            required: "Zadaj súkromné meno",
            minLength: "Meno musí mať aspoň 2 znaky",
            maxLength: "Meno musí mať menej ako 100 znakov",
          },
        },
        publicName: {
          label: "Tvoje verejné meno",
          description:
            "Pod týmto menom vystupuješ vo verejných četoch a na fórach. Uvidia ho ostatní používatelia aj AI. Vyber si meno, pod ktorým chceš v komunite vystupovať.",
          placeholder: "Zadaj zobrazované meno",
          validation: {
            required: "Zadaj zobrazované meno",
            minLength: "Zobrazované meno musí mať aspoň 2 znaky",
            maxLength: "Zobrazované meno musí mať menej ako 100 znakov",
          },
        },
        email: {
          label: "Tvoj e-mail",
          description:
            "E-mail slúži na prihlásenie a komunikáciu s tebou. Je súkromný a nedostanú ho ostatní používatelia ani AI.",
          placeholder: "Zadajte e-mailovú adresu",
          help: "Tento e-mail bude slúžiť na prihlásenie aj ako hlavný kontakt",
          validation: {
            required: "Zadaj e-mailovú adresu",
            invalid: "Zadaj platnú e-mailovú adresu",
          },
        },
        password: {
          label: "Tvoje heslo",
          description:
            "Silné heslo chráni tvoj účet. Čoskoro zavedieme koncové šifrovanie. Potom sa pri obnovení hesla vymaže história správ, pretože dešifrovací kľúč budeš mať iba ty. Heslo si ulož na bezpečné miesto.",
          placeholder: "Zadaj heslo",
          validation: {
            required: "Zadaj heslo",
            minLength: "Heslo musí mať aspoň 8 znakov",
            complexity: "Heslo musí obsahovať veľké a malé písmeno a číslicu",
          },
        },
        confirmPassword: {
          label: "Potvrď heslo",
          validation: {
            required: "Znova zadaj svoje heslo",
            minLength: "Heslo musí mať aspoň 8 znakov",
            mismatch: "Heslá sa nezhodujú",
          },
        },
        subscribeToNewsletter: {
          label: "Prihlásiť sa na odber noviniek",
          description:
            "Občasné novinky o modeloch a funkciách. Len to podstatné, bez spamu.",
        },
        acceptTerms: {
          label: "Prijať podmienky používania",
          description:
            "Naše podmienky používania rešpektujú tvoju slobodu a súkromie.",
          termsLink: "podmienky",
          conditionsLink: "zásady ochrany osobných údajov",
          descriptionPrefix: "Naše",
          descriptionAnd: "a",
          descriptionSuffix: "rešpektujú tvoju slobodu.",
          validation: {
            required: "Ak chceš pokračovať, prijmi podmienky",
          },
        },
        referralCode: {
          label: "Kód odporúčania (nepovinné)",
          description:
            "Máš na unbottled.ai priateľa? Zadaj jeho kód a podpor ho. Za odporúčanie získa odmenu.",
          placeholder: "Zadaj kód odporúčania (nepovinné)",
          labelPrefilled: "Kód odporúčania",
          descriptionPrefilled:
            "Tvoj priateľ dostane odmenu, keď si vytvoríš účet.",
        },
        supportedSkillId: {
          label: "Podporiť autora",
          description:
            "Registráciou podporíš autora tejto zručnosti. Z tvojich predplatných dostane bonus +5 %.",
          selectorTitle: "Podporiť autora",
          selectorDescription:
            "V obľúbených máš zručnosti od nezávislých autorov. Vyber jedného, ktorého podporíš bonusom vo výške +5 % z tvojich predplatných. Výber môžeš kedykoľvek zmeniť.",
          selectorNone: "Nikoho (preskočiť)",
        },
        localFavorites: {
          label: "Obľúbené v tomto zariadení",
        },
      },

      footer: {
        alreadyHaveAccount: "Už máš účet? Prihlás sa",
      },
      errors: {
        title: "Chyba registrácie",
        validation: {
          title: "Chyba kontroly údajov",
          description: "Skontroluj zadané údaje a skús to znova",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        conflict: {
          title: "Konflikt účtu",
          description: "Účet s týmto e-mailom už existuje",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        notFound: {
          title: "Nenájdené",
          description: "Zdroj sa nenašiel",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Niektoré zmeny nie sú uložené",
        },
        internal: {
          title: "Interná chyba",
          description: "Nastala interná chyba",
        },
      },
      emailCheck: {
        title: "Kontrola dostupnosti e-mailu",
        description: "Overte, či sa e-mailová adresa dá použiť na registráciu",
        tag: "Kontrola e-mailu",
        fields: {
          email: {
            label: "E-mailová adresa",
            description: "E-mail na kontrolu",
            placeholder: "Zadajte e-mailovú adresu",
            validation: {
              invalid: "Neplatný formát e-mailovej adresy",
            },
          },
        },
        response: {
          title: "Výsledok kontroly e-mailu",
          description: "Výsledok kontroly dostupnosti e-mailu",
          available: "Voľná e-mailová adresa",
          message: "Správa o dostupnosti adresy",
        },
        errors: {
          validation: {
            title: "Neplatný e-mail",
            description: "Zadaj platnú e-mailovú adresu",
          },
          internal: {
            title: "Kontrola e-mailu zlyhala",
            description: "Chyba pri kontrole dostupnosti e-mailovej adresy",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          conflict: {
            title: "E-mail už patrí k účtu",
            description: "Táto e-mailová adresa je už zaregistrovaná",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte oprávnenie overiť túto e-mailovú adresu",
          },
          network: {
            title: "Chyba siete",
            description: "Pri kontrole e-mailovej adresy nastala chyba siete",
          },
          notFound: {
            title: "Služba sa nenašla",
            description: "Služba kontroly e-mailu nie je k dispozícii",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na kontrolu e-mailovej adresy sa musíte prihlásiť",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Niektoré zmeny nie sú uložené",
          },
        },
        success: {
          title: "Kontrola e-mailu dokončená",
          description: "Dostupnosť e-mailovej adresy sa overila",
        },
      },
      post: {
        title: "Registrácia",
        description: "Koncový bod registrácie",
        form: {
          title: "Nastavenie registrácie",
          description: "Nastavte parametre registrácie",
        },
        response: {
          title: "Odpoveď",
          description: "Údaje odpovede registrácie",
          success: "Registrácia prebehla úspešne",
          message: "Správa o stave",
          userId: "ID používateľa",
          nextSteps: "Ďalšie kroky",
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
          unsaved: {
            title: "Neuložené zmeny",
            description: "Niektoré zmeny nie sú uložené",
          },
        },
        success: {
          title: "Úspech",
          description: "Operácia sa úspešne dokončila",
          processing: "Registrácia sa úspešne spracúva",
        },
      },
      response: {
        title: "Odpoveď",
        description: "Údaje odpovede registrácie",
        success: "Registrácia prebehla úspešne",
        message: "Správa o stave",
        user: {
          id: "ID používateľa",
          email: "E-mailová adresa",
          firstName: "Krstné meno",
          lastName: "Priezvisko",
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          imageUrl: "URL profilového obrázka",
          verificationRequired: "Vyžaduje sa overenie",
        },
        verificationInfo: {
          title: "Overenie e-mailovej adresy",
          description: "Podrobnosti overenia e-mailovej adresy",
          emailSent: "E-mail odoslaný",
          expiresAt: "Platnosť overenia do",
          checkSpamFolder: "Skontrolovať priečinok so spamom",
        },
        nextSteps: "Ďalšie kroky",
      },
      success: {
        title: "Registrácia prebehla úspešne",
        description: "Tvoj účet je pripravený",
      },
      admin_notification: {
        title: "Registrácia nového používateľa",
        subject: "Registrácia nového používateľa ({{privateName}})",
        preview: "Nový používateľ {{privateName}} sa zaregistroval",
        message: "Na {{appName}} sa zaregistroval nový používateľ",
        privateName: "Súkromné meno",
        publicName: "Verejné meno",
        email: "E-mail",
        locale: "Jazyk",
        creditBalance: "Zostatok kreditov",
        leadCreditBalance: "Zostatok kreditov potenciálneho zákazníka",
        signup_preferences: "Nastavenia registrácie",
        user_details: "Údaje o používateľovi",
        basic_information: "Základné informácie",
        signup_type: "Typ registrácie",
        direct_signup: "Priama registrácia",
        newsletter: "Odber noviniek",
        subscribed: "Odber aktívny",
        not_subscribed: "Bez odberu",
        signup_details: "Podrobnosti registrácie",
        signup_date: "Dátum registrácie",
        user_id: "ID používateľa",
        recommended_next_steps: "Odporúčané ďalšie kroky",
        direct_recommendation:
          "Skontrolujte profil používateľa a nastavenie platieb",
        contact_user: "Kontaktujte používateľa",
        footer: "Automatické oznámenie od {{appName}}",
      },
      email: {
        subject: "Hotovo. Môžeš začať používať {{appName}}",
        previewText:
          "Ahoj, {{privateName}}! Tvoj účet je pripravený. Rozprávaj sa s modelmi Claude, GPT, Gemini, DeepSeek a ďalšími. Počet ďalších modelov: {{modelCount}}. Zadarmo a bez karty.",
        headline: "Tvoja AI už čaká.",
        greeting: "Ahoj, {{privateName}},",
        intro:
          "Vitaj v {{appName}}. Všetko, čo máš rád na ChatGPT, a navyše modely s otvoreným kódom a bez obsahových filtrov. Jeden účet na všetko.",
        models: {
          title: "Počet modelov v troch kategóriách: {{modelCount}}",
          mainstream: "Známe modely",
          open: "Otvorený kód",
          uncensored: "Bez cenzúry",
        },
        free: {
          title: "Čo máš navždy zadarmo",
          credits:
            "Každý mesiac {{freeCreditsSignedIn}} kred. zdarma. S odberom noviniek spolu {{freeCreditsMax}} kred. Platobnú kartu nepotrebuješ.",
          allModels: "Prístup ku všetkým modelom AI ({{modelCount}})",
          uncensored: "Modely bez cenzúry, ktoré na tvoje otázky odpovedajú",
          chatModes: "Súkromný, zdieľaný a verejný čet aj režim inkognito",
          noCard: "Platobnú kartu nepotrebuješ. Ani neskôr.",
        },
        ctaButton: "Začať četovať",
        upgrade: {
          title: "Chceš viac?",
          desc: "Predplatné začína na {{subscriptionPrice}} mesačne za {{subscriptionCredits}} kred. Najvyšší plán zahŕňa {{ultraCredits}} kred. za {{ultraPrice}}. Predplatitelia si môžu dokúpiť balíky kreditov, ktorým nevyprší platnosť.",
          cta: "Pozrieť si plány",
        },
        signoff: "Príjemné rozhovory,\nTím {{appName}}",
        ps: "P. S. V režime inkognito ostanú konverzácie len v tvojom zariadení. Na serveroch ich neukladáme. Vygenerované médiá ukladáme z technických dôvodov dočasne.",
      },
      emailTemplates: {
        welcome: {
          name: "Uvítací e-mail po registrácii",
          description: "Uvítací e-mail odoslaný po úspešnej registrácii",
          category: "Overenie totožnosti",
          preview: {
            privateName: {
              label: "Súkromné meno",
              description: "Súkromné meno používateľa",
            },
            userId: {
              label: "ID používateľa",
              description: "Jedinečný identifikátor používateľa",
            },
            leadId: {
              label: "ID potenciálneho zákazníka",
              description:
                "Identifikátor potenciálneho zákazníka priradený k používateľovi",
            },
          },
        },
        adminSignup: {
          name: "Oznámenie správcovi o novej registrácii",
          description: "E-mail správcom po registrácii nového používateľa",
          category: "Správa",
          preview: {
            privateName: {
              label: "Súkromné meno",
            },
            publicName: {
              label: "Verejné meno",
            },
            email: {
              label: "E-mailová adresa",
            },
            userId: {
              label: "ID používateľa",
            },
            subscribeToNewsletter: {
              label: "Odber noviniek",
            },
          },
        },
      },
    },
  },
  search: {
    category: "Používatelia",

    title: "Vyhľadávanie používateľov",
    description: "Vyhľadajte používateľov",
    tag: "Vyhľadávanie používateľov",
    container: {
      title: "Vyhľadávanie",
      description: "Panel vyhľadávania používateľov",
    },
    groups: {
      searchCriteria: {
        title: "Kritériá vyhľadávania",
        description: "Zadajte parametre vyhľadávania",
      },
      filters: {
        title: "Rozšírené filtre",
        description: "Ďalšie možnosti filtrovania",
      },
      pagination: {
        title: "Stránkovanie",
        description: "Nastavte rozdelenie výsledkov na stránky",
      },
    },
    fields: {
      search: {
        label: "Hľadaný výraz",
        description: "Zadajte hľadaný výraz",
        placeholder: "Hľadať používateľov…",
        help: "Hľadajte podľa mena, e-mailovej adresy alebo spoločnosti",
        validation: {
          minLength: "Hľadaný výraz musí mať aspoň 2 znaky",
        },
      },
      roles: {
        label: "Používateľské roly",
        description: "Filtrovať podľa rolí používateľa",
        placeholder: "Vyberte roly…",
        help: "Vyberte jednu alebo viac rolí, podľa ktorých chcete filtrovať",
      },
      status: {
        label: "Stav používateľa",
        description: "Filtrovať podľa stavu používateľa",
        placeholder: "Vyberte stav…",
        help: "Zobraziť aktívnych, neaktívnych alebo všetkých používateľov",
      },
      limit: {
        label: "Limit",
        description: "Maximálny počet výsledkov",
        help: "Zadajte počet výsledkov (predvolene 10)",
      },
      offset: {
        label: "Posun",
        description: "Počet výsledkov, ktoré sa preskočia",
        help: "Zadajte posun stránkovania (predvolene 0)",
      },
    },
    status: {
      active: "Aktívny",
      inactive: "Neaktívny",
      all: "Všetci",
    },
    response: {
      title: "Výsledky vyhľadávania",
      description: "Výsledky vyhľadávania používateľov",
      success: {
        badge: "Úspech",
      },
      message: {
        content: "Správa o výsledku vyhľadávania",
      },
      searchInfo: {
        title: "Informácie o vyhľadávaní",
        description: "Podrobnosti o vyhľadávaní",
        searchTerm: "Hľadaný výraz",
        appliedFilters: "Použité filtre",
        searchTime: "Čas vyhľadávania",
        totalResults: "Celkový počet výsledkov",
      },
      pagination: {
        title: "Informácie o stránkovaní",
        description: "Údaje o stránkovaní výsledkov",
        currentPage: "Aktuálna stránka",
        totalPages: "Celkový počet stránok",
        itemsPerPage: "Položky na stránku",
        totalItems: "Celkový počet položiek",
        hasMore: "Ďalšia stránka je k dispozícii",
        hasPrevious: "Predchádzajúca stránka je k dispozícii",
      },
      actions: {
        title: "Dostupné akcie",
        description: "Akcie dostupné pre výsledky",
        type: "Typ akcie",
        label: "Akcia",
        href: "Odkaz",
      },
      users: {
        label: "Nájdení používatelia",
        description: "Zoznam používateľov, ktorí vyhovujú kritériám",
        item: {
          title: "Používateľ",
          description: "Informácie o účte používateľa",
        },
        id: "ID používateľa",
        leadId: "ID potenciálneho zákazníka",
        isPublic: "Verejnosť",
        firstName: "Krstné meno",
        lastName: "Priezvisko",
        privateName: "Súkromné meno",
        publicName: "Verejné meno",
        company: "Spoločnosť",
        email: "E-mail",
        imageUrl: "Avatar",
        isActive: "Aktívny",
        emailVerified: "Overený e-mail",
        requireTwoFactor: "Vyžaduje sa dvojfaktorové overenie",
        marketingConsent: "Súhlas s marketingom",
        userRoles: {
          item: {
            title: "Rola",
            description: "Priradenie roly používateľovi",
          },
          id: "ID roly",
          role: "Rola",
        },
        createdAt: "Vytvorené",
        updatedAt: "Aktualizované",
      },
    },
    columns: {
      firstName: "Krstné meno",
      lastName: "Priezvisko",
      privateName: "Súkromné meno",
      publicName: "Verejné meno",
      email: "E-mail",
      company: "Spoločnosť",
      userRoles: "Roly",
    },
    errors: {
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre vyhľadávania",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na vyhľadávanie nemáte oprávnenie",
      },
      internal: {
        title: "Interná chyba",
        description: "Interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadni používatelia",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vyhľadávaní došlo ku konfliktu",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Zmeny sa neuložili",
      },
    },
    success: {
      title: "Vyhľadávanie dokončené",
      description: "Vyhľadávanie sa dokončilo",
    },
    post: {
      title: "Hľadať",
      description: "Koncový bod pre vyhľadávanie",
      form: {
        title: "Nastavenia vyhľadávania",
        description: "Nastavte parametre vyhľadávania",
      },
      response: {
        title: "Odpoveď",
        description: "Údaje vo výsledku vyhľadávania",
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
      },
      success: {
        title: "Úspech",
        description: "Operácia sa úspešne dokončila",
      },
    },
  },
  "session-cleanup": {
    category: "Používatelia",

    post: {
      title: "Čistenie relácií",
      description:
        "Odstráňte používateľské relácie a tokeny s uplynutou platnosťou.",
      tag: "Čistenie relácií",
      container: {
        title: "Čistenie relácií",
        description: "Nastavte a spustite čistenie relácií.",
      },
      fields: {
        sessionRetentionDays: {
          label: "Uchovávanie relácií (dni)",
          description: "Počet dní, počas ktorých sa uchovávajú relácie",
        },
        tokenRetentionDays: {
          label: "Uchovávanie tokenov (dni)",
          description: "Počet dní, počas ktorých sa uchovávajú tokeny",
        },
        batchSize: {
          label: "Veľkosť dávky",
          description: "Počet záznamov spracovaných v jednej dávke",
        },
        dryRun: {
          label: "Skúšobné spustenie",
          description: "Simulujte čistenie bez odstránenia záznamov",
        },
      },
      response: {
        sessionsDeleted: "Odstránené relácie",
        tokensDeleted: "Odstránené tokeny",
        totalProcessed: "Celkový počet spracovaných záznamov",
        executionTimeMs: "Čas vykonávania (ms)",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Čistenie relácií môže spustiť iba správca.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Pri čistení sa vyskytla interná chyba servera.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        validation: {
          title: "Chyba kontroly údajov",
          description: "Nastavenia čistenia sú neplatné.",
        },
      },
      success: {
        title: "Čistenie relácií je dokončené",
        description: "Relácie a tokeny s uplynutou platnosťou sa odstránili.",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Odstraňuje používateľské relácie s uplynutou platnosťou v záujme bezpečnosti systému.",
      purpose:
        "Odstraňuje relácie s uplynutou platnosťou a pomáha tak udržiavať bezpečnosť a výkon systému.",
      impact:
        "Odstraňuje zastarané údaje o reláciách a tým zlepšuje výkon a bezpečnosť systému.",
      rollback: "Čistenie sa nedá vrátiť späť.",
    },
    errors: {
      default: "Pri čistení relácií sa vyskytla chyba.",
      execution_failed: {
        title: "Čistenie relácií zlyhalo",
        description: "Relácie s uplynutou platnosťou sa nepodarilo odstrániť.",
      },
      partial_failure: {
        title: "Čistenie relácií sa dokončilo len čiastočne",
        description: "Niektoré relácie sa nepodarilo odstrániť.",
      },
      unknown_error: {
        title: "Neznáma chyba pri čistení relácií",
        description: "Pri čistení relácií sa vyskytla neznáma chyba.",
      },
      invalid_session_retention: {
        title: "Neplatná lehota uchovávania relácií",
        description: "Zadaná lehota na uchovávanie relácií je neplatná.",
      },
      invalid_token_retention: {
        title: "Neplatná lehota uchovávania tokenov",
        description: "Zadaná lehota na uchovávanie tokenov je neplatná.",
      },
      invalid_batch_size: {
        title: "Neplatná veľkosť dávky",
        description: "Zadaná veľkosť dávky na čistenie je neplatná.",
      },
      validation_failed: {
        title: "Kontrola údajov zlyhala",
        description: "Nastavenia čistenia relácií neprešli overením.",
      },
    },
    success: {
      title: "Čistenie relácií je dokončené",
      description: "Relácie s uplynutou platnosťou sa podarilo odstrániť.",
    },
    monitoring: {
      alertTrigger: "Úloha čistenia relácií zlyhala.",
    },
    documentation: {
      overview:
        "Úloha odstraňuje používateľské relácie s uplynutou platnosťou a pomáha tak udržiavať bezpečnosť a výkon systému.",
    },
  },
  sessionCleanup: {
    category: "Používatelia",

    post: {
      title: "Čistenie relácií",
      description:
        "Odstráňte používateľské relácie a tokeny s uplynutou platnosťou.",
      tag: "Čistenie relácií",
      container: {
        title: "Čistenie relácií",
        description: "Nastavte a spustite čistenie relácií.",
      },
      fields: {
        sessionRetentionDays: {
          label: "Uchovávanie relácií (dni)",
          description: "Počet dní, počas ktorých sa uchovávajú relácie",
        },
        tokenRetentionDays: {
          label: "Uchovávanie tokenov (dni)",
          description: "Počet dní, počas ktorých sa uchovávajú tokeny",
        },
        batchSize: {
          label: "Veľkosť dávky",
          description: "Počet záznamov spracovaných v jednej dávke",
        },
        dryRun: {
          label: "Skúšobné spustenie",
          description: "Simulujte čistenie bez odstránenia záznamov",
        },
      },
      response: {
        sessionsDeleted: "Odstránené relácie",
        tokensDeleted: "Odstránené tokeny",
        totalProcessed: "Celkový počet spracovaných záznamov",
        executionTimeMs: "Čas vykonávania (ms)",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Čistenie relácií môže spustiť iba správca.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Pri čistení sa vyskytla interná chyba servera.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        validation: {
          title: "Chyba kontroly údajov",
          description: "Nastavenia čistenia sú neplatné.",
        },
      },
      success: {
        title: "Čistenie relácií je dokončené",
        description: "Relácie a tokeny s uplynutou platnosťou sa odstránili.",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Odstraňuje používateľské relácie s uplynutou platnosťou v záujme bezpečnosti systému.",
      purpose:
        "Odstraňuje relácie s uplynutou platnosťou a pomáha tak udržiavať bezpečnosť a výkon systému.",
      impact:
        "Odstraňuje zastarané údaje o reláciách a tým zlepšuje výkon a bezpečnosť systému.",
      rollback: "Čistenie sa nedá vrátiť späť.",
    },
    errors: {
      default: "Pri čistení relácií sa vyskytla chyba.",
      execution_failed: {
        title: "Čistenie relácií zlyhalo",
        description: "Relácie s uplynutou platnosťou sa nepodarilo odstrániť.",
      },
      partial_failure: {
        title: "Čistenie relácií sa dokončilo len čiastočne",
        description: "Niektoré relácie sa nepodarilo odstrániť.",
      },
      unknown_error: {
        title: "Neznáma chyba pri čistení relácií",
        description: "Pri čistení relácií sa vyskytla neznáma chyba.",
      },
      invalid_session_retention: {
        title: "Neplatná lehota uchovávania relácií",
        description: "Zadaná lehota na uchovávanie relácií je neplatná.",
      },
      invalid_token_retention: {
        title: "Neplatná lehota uchovávania tokenov",
        description: "Zadaná lehota na uchovávanie tokenov je neplatná.",
      },
      invalid_batch_size: {
        title: "Neplatná veľkosť dávky",
        description: "Zadaná veľkosť dávky na čistenie je neplatná.",
      },
      validation_failed: {
        title: "Kontrola údajov zlyhala",
        description: "Nastavenia čistenia relácií neprešli overením.",
      },
    },
    success: {
      title: "Čistenie relácií je dokončené",
      description: "Relácie s uplynutou platnosťou sa podarilo odstrániť.",
    },
    monitoring: {
      alertTrigger: "Úloha čistenia relácií zlyhala.",
    },
    documentation: {
      overview:
        "Úloha odstraňuje používateľské relácie s uplynutou platnosťou a pomáha tak udržiavať bezpečnosť a výkon systému.",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Nepodarilo sa nájsť roly používateľa",
      batch_find_failed: "Nepodarilo sa hromadne načítať roly používateľov",
      not_found: "Rola používateľa sa nenašla",
      lookup_failed: "Nepodarilo sa vyhľadať rolu používateľa",
      add_failed: "Nepodarilo sa priradiť rolu používateľovi",
      no_data_returned: "Databáza nevrátila žiadne údaje",
      remove_failed: "Nepodarilo sa odobrať rolu používateľovi",
      check_failed: "Nepodarilo sa overiť, či má používateľ rolu",
      delete_failed: "Nepodarilo sa odstrániť roly používateľa",
      endpoint_not_created:
        "Koncový bod pre roly používateľov ešte nebol vytvorený.",
    },
    post: {
      title: "Roly používateľov",
      description: "Koncový bod pre roly používateľov",
      form: {
        title: "Nastavenia používateľských rolí",
        description: "Nastavte parametre používateľských rolí",
      },
      response: {
        title: "Odpoveď",
        description: "Údaje odpovede o rolách používateľov",
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
        database_connection_failed: {
          title: "Pripojenie k databáze zlyhalo",
          description: "Nepodarilo sa pripojiť k databáze",
        },
      },
      success: {
        title: "Úspech",
        description: "Operácia sa úspešne dokončila",
      },
    },
    enums: {
      userRole: {
        public: "Verejnosť",
        customer: "Zákazník",
        partnerAdmin: "Správca partnera",
        partnerEmployee: "Zamestnanec partnera",
        admin: "Správca",
        cliOff: "CLI vypnuté",
        cliAuthBypass: "Obídenie overenia v CLI",
        aiToolOff: "Nástroj AI vypnutý",
        webOff: "Web vypnutý",
        mcpOff: "MCP vypnuté",
        mcpVisible: "Viditeľné v MCP",
        productionOff: "V produkcii vypnuté",
        skillOff: "Zručnosť vypnutá",
      },
    },
  },
  profileVisibility: {
    public: "Verejný",
    private: "Súkromný",
    contactsOnly: "Len kontakty",
  },
  contactMethods: {
    email: "E-mail",
    phone: "Telefón",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Svetlý",
    dark: "Tmavý",
    system: "Podľa zariadenia",
  },
  userDetailLevel: {
    minimal: "Minimálna",
    standard: "Štandardná",
    complete: "Úplná",
  },
  language: {
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "America/New_York",
    america_los_angeles: "America/Los_Angeles",
    europe_london: "Europe/London",
    europe_berlin: "Europe/Berlin",
    europe_warsaw: "Europe/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "E-mailová adresa sa už používa",
    locale_required: "Vyžadujú sa jazykové a regionálne nastavenia",
    auth_required:
      "Na prístup sa musíte prihlásiť a mať jednu z týchto rolí: {{roles}}",
    auth_retrieval_failed:
      "Prihlasovacie údaje sa nepodarilo načítať: {{error}}",
    not_found: "Používateľ sa nenašiel",
    not_found_by_id: "Používateľ s ID {{userId}} sa nenašiel",
    not_found_by_email: "Používateľ s e-mailom {{email}} sa nenašiel",
    roles_lookup_failed: "Nepodarilo sa vyhľadať roly používateľa {{userId}}",
    roles_batch_fetch_failed:
      "Roly sa nepodarilo načítať hromadne. Počet používateľov: {{count}}.",
    id_lookup_failed:
      "Nepodarilo sa vyhľadať používateľa {{userId}}: {{error}}",
    email_lookup_failed:
      "Nepodarilo sa vyhľadať používateľa podľa e-mailu {{email}}: {{error}}",
    email_check_failed:
      "E-mailovú adresu {{email}} sa nepodarilo skontrolovať: {{error}}",
    email_duplicate_check_failed:
      "Nepodarilo sa zistiť, či e-mailovú adresu {{email}} používa iný používateľ (s výnimkou {{excludeUserId}}): {{error}}",
    search_failed:
      "Nepodarilo sa vyhľadať používateľov podľa výrazu {{query}}: {{error}}",
    list_failed: "Nepodarilo sa načítať zoznam používateľov: {{error}}",
    email_already_in_use: "E-mailová adresa sa už používa",
    creation_failed: "Nepodarilo sa vytvoriť používateľa: {{error}}",
    no_data_returned: "Databáza nevrátila žiadne údaje",
    password_hashing_failed:
      "Nepodarilo sa vytvoriť haš hesla pre {{email}}: {{error}}",
    not_implemented_on_native:
      "Táto funkcia v React Native nie je k dispozícii",
    count_failed: "Nepodarilo sa zistiť počet používateľov: {{error}}",
  },
  userNoteType: {
    note: "Poznámka",
    call: "Hovor",
    email: "E-mail",
    meeting: "Stretnutie",
    task: "Úloha",
  },
  notifications: {
    profileUpdated: {
      title: "Profil sa aktualizoval",
      description: "Tvoj profil sa aktualizoval",
    },
    updateFailed: {
      title: "Profil sa nepodarilo aktualizovať",
      description: "Profil sa nepodarilo aktualizovať. Skús to znova.",
    },
  },
};
