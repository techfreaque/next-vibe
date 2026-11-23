import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",
  auth: {
    category: "Autenticazione",
    search: {
      tag: "Auth",
    },
    authClient: {
      errors: {
        status_save_failed: "Non riuscito a salvare lo stato di autenticazione",
        status_remove_failed:
          "Non riuscito a rimuovere lo stato di autenticazione",
        status_check_failed: "Non controlla lo stato di autenticazione",
        token_save_failed: "Non riuscito a salvare il token di autenticazione",
        token_get_failed:
          "Non riuscito a recuperare il token di autenticazione",
        token_remove_failed:
          "Non riuscito a rimuovere il token di autenticazione",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start: "getAuthMinimalUserNext : - Prima verifica dell'autenticazione",
        result: "getAuthMinimalUserNext: risultato getCurrentUserNext",
        authenticated:
          "getAuthMinimalUserNext: L'utente è autenticato, ottenendo leadId",
        returningAuth: "getAuthMinimalUserNext: Ritorno utente autenticato",
        notAuthenticated:
          "getAuthMinimalUserNext: Utente non autenticato, di ritorno utente pubblico",
      },
      signingJwt: "Firma JWT",
      jwtSignedSuccessfully: "JWT ha firmato con successo",
      errorSigningJwt: "Firma di errore JWT",
      verifyingJwt: "Verifica JWT",
      invalidTokenPayload: "Carico di pagamento del gettone non valido",
      jwtVerifiedSuccessfully: "JWT verificato con successo",
      errorVerifyingJwt: "Verifica errore JWT",
      userIdNotExistsInDb: "L'utente ID non esiste nel database",
      sessionNotFound: "Sessione non trovata",
      sessionExpired: "Sessione scaduta",
      errorValidatingUserSession: "Procedura di convalida degli errori",
      errorGettingUserRoles: "Errore di ottenere ruoli utente",
      errorCheckingUserAuth: "Controllo errore dell'autenticazione utente",
      authenticatingCliUserWithPayload: "Autentico utente CLI con payload",
      errorAuthenticatingCliUserWithPayload:
        "Errore di autenticazione utente CLI con payload",
      creatingCliToken: "Creazione di token CLI",
      errorCreatingCliToken: "Errore di creazione del token CLI",
      validatingCliToken: "Convalida token CLI",
      errorValidatingCliToken: "Errore che convalida il token CLI",
      gettingCurrentUserFromNextjs: "Ottenere utente corrente da Next.js",
      errorGettingAuthUserForNextjs:
        "Errore di ottenere utente auth per Next.js",
      settingNextjsAuthCookies: "Impostazione dei cookie Next.js auth",
      clearingNextjsAuthCookies: "Cancellazione Next.js cookie auth",
      gettingCurrentUserFromToken: "Ottenere l'utente corrente da token",
      errorGettingCurrentUserFromCli:
        "Errore di ottenere l'utente corrente da CLI",
      errorGettingAuthUserForCli: "Errore di ottenere utente auth per CLI",
      errorGettingUserRolesForCli: "Errore di ottenere ruoli utente per CLI",
      tokenFromAuthHeader: "Token da auth header",
      tokenFromCookie: "Token da cookie",
      noTokenFound: "Nessun token trovato",
      errorExtractingToken: "Estrazione di errore token",
      errorParsingCookies: "Cookie di analisi errori",
    },
    errors: {
      token_generation_failed:
        "Non è riuscito a generare token di autenticazione",
      invalid_session: "La sessione è invalida o scaduta",
      missing_request_context: "Il contesto di richiesta manca",
      missing_locale: "Locale non è disponibile su richiesta",
      unsupported_platform: "La piattaforma non è supportata",
      session_retrieval_failed: "Non recuperato sessione",
      missing_token: "Manca il token di autenticazione",
      invalid_token_signature: "La firma del token non è valida",
      jwt_payload_missing_id: "JWT payload manca l'utente ID",
      cookie_set_failed: "Non impostare cookie di autenticazione",
      cookie_clear_failed:
        "Non riuscito a cancellare il cookie di autenticazione",
      publicPayloadNotSupported:
        "Il payload pubblico JWT non è supportato per l'autenticazione CLI",
      jwt_signing_failed: "Non firmare il token JWT",
      authentication_failed: "Autenticazione fallita",
      user_not_authenticated: "L'utente non è autenticato",
      publicUserNotAllowed:
        "L'utente pubblico non è consentito per questo endpoint",
      validation_failed: "Convalida fallita",
      failed_to_create_lead: "Non è riuscito a creare contatto",
      native: {
        unsupported:
          "Questo metodo di autenticazione non è supportato su React Native",
        storage_failed: "Non memorizzare i dati di autenticazione",
        clear_failed: "Non riuscita a cancellare i dati di autenticazione",
      },
      not_implemented_native:
        "Questa funzione non è ancora stata implementata per React Native",
      unknownError:
        "Un errore sconosciuto si è verificato durante l'autenticazione",
    },
    post: {
      title: "Auth",
      description: "Fine della fase",
      form: {
        title: "Auth Configuration",
        description: "Configurare i parametri auth",
      },
      response: {
        title: "Risposta",
        description: "Dati di risposta dell'auth",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        missing_locale: {
          title: "Missing Locale",
          description: "Il parametro Locale è richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
        token_generation_failed: {
          title: "La generazione di Token non è riuscita",
          description: "Non è riuscito a generare token di autenticazione",
        },
        invalid_session: {
          title: "Sessione non valida",
          description: "La sessione è invalida o scaduta",
        },
        missing_request_context: {
          title: "Richiesta mancante Contesto",
          description: "Il contesto di richiesta manca",
        },
        unsupported_platform: {
          title: "Piattaforma non supportata",
          description: "La piattaforma non è supportata",
        },
        session_retrieval_failed: {
          title: "Recuperare la sessione non riuscita",
          description: "Non recuperato sessione",
        },
        missing_token: {
          title: "Token mancante",
          description: "Manca il token di autenticazione",
        },
        invalid_token_signature: {
          title: "Firma di Token non valida",
          description: "La firma del token non è valida",
        },
        jwt_payload_missing_id: {
          title: "JWT Payload mancante ID",
          description: "JWT payload manca l'utente ID",
        },
        cookie_set_failed: {
          title: "Cookie Set non corretto",
          description: "Non impostare cookie di autenticazione",
        },
        cookie_clear_failed: {
          title: "Cookie Cancellazione non riuscita",
          description: "Non riuscito a cancellare il cookie di autenticazione",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
    check: {
      get: {
        title: "Verificare l'autenticità",
        description: "Controlla lo stato di autenticazione corrente",
        response: {
          title: "Stato di autenticazione",
          description: "Stato di autenticazione attuale",
          authenticated: "Autentico",
          tokenValid: "Convalida di token",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "Autenticazione richiesta",
        forbidden: "Accesso negato",
        invalidToken: "Token non valido",
        tokenExpired: "Scadenza di Token",
        serverError: "Errore del server",
      },
    },
  },
  private: {
    logout: {
      title: "Logout utente",
      description:
        "Esegui il login dell'utente corrente e invalida la loro sessione",
      category: "Gestione utente",
      tag: "logout",
      logoutButton: "Esci",
      loggingOut: "- Ti stai chiedendo...",
      response: {
        title: "Risposta di logout",
        description: "Risposta che indica logout di successo",
        success: "Operazione riuscita",
        message: "Messaggio",
        sessionsCleaned: "Sessioni Pulite",
        nextSteps: "Consigliato i prossimi passi dopo la logout",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "La richiesta logout contiene dati non validi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso a logout",
        },
        internal: {
          title: "Errore del server interno",
          description: "Si è verificato un errore interno durante l'esecuzione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore inaspettato si è verificato durante la logout",
        },
        session_deletion_failed: {
          title: "Cancellazione della sessione",
          description: "Non è stato possibile eliminare la sessione utente",
        },
        conflict: {
          title: "Conflitto di logout",
          description: "Un conflitto si è verificato durante la logout",
        },
        forbidden: {
          title: "Accesso negato",
          description: "L'azione di logout è vietata",
        },
        network_error: {
          title: "Errore di rete",
          description: "Errore di rete durante il logout",
        },
        not_found: {
          title: "Non trovato",
          description: "Sessione non trovata",
        },
        server_error: {
          title: "Errore del server",
          description: "Errore del server interno durante il logout",
        },
        unsaved_changes: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        invalid_user: {
          title: "Utente non valido",
          description: "L'utente non è valido o non esiste",
        },
      },
      success: {
        title: "Logout Successivo",
        description: "Sei stato registrato con successo",
        message: "L'utente ha effettuato l'accesso con successo",
      },
    },
    me: {
      // Main user profile routes
      get: {
        title: "Ottieni il profilo utente",
        description: "Recuperare le informazioni attuali del profilo utente",
        response: {
          title: "Risposta del profilo utente",
          description: "Dati attuali del profilo utente",
          id: "Utente ID",
          leadId: "ID del contatto",
          isPublic: "Profilo pubblico",
          email: "Indirizzo email",
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          locale: "Locale",
          isActive: "Stato attivo",
          emailVerified: "E-mail verificato",
          requireTwoFactor: "Autenticazione di due fattori richiesto",
          marketingConsent: "Consenso di marketing",
          userRoles: "Ruoli utente",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
          stripeCustomerId: "Stripe cliente ID",
          bio: "Bio",
          websiteUrl: "Sito web",
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
          creatorSlug: "Profilo Slug",
          creatorAccentColor: "Colore dell'acustica",
          creatorHeaderImageUrl: "Immagine dell'intestazione",
          avatarUrl: "Avatar",
          user: {
            title: "Informazioni sull'utente",
            description: "Dettagli del profilo utente",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Profilo utente non trovato",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Profilo recuperato con successo",
        },
      },
      update: {
        title: "Profilo utente di aggiornamento",
        description: "Aggiornare le informazioni attuali del profilo utente",
        groups: {
          basicInfo: {
            title: "Informazioni di base",
            description: "Aggiorna le informazioni di base del tuo profilo",
          },
          profileDetails: {
            title: "Dettagli del profilo",
            description:
              "Gestione dei dati e delle impostazioni del tuo profilo",
          },
          privacySettings: {
            title: "Impostazioni sulla privacy",
            description:
              "Controlla chi può vedere le informazioni del tuo profilo",
          },
          profileInfo: {
            title: "Profilo del creatore",
            description:
              "Bio, social link e branding per le tue pagine di abilità",
          },
        },
        fields: {
          email: {
            label: "Indirizzo email",
            description: "Il tuo indirizzo email",
            placeholder: "Inserisci il tuo indirizzo email",
            help: "Il tuo indirizzo email sarà utilizzato per le notifiche e la comunicazione dell'account",
            validation: {
              invalid: "Si prega di inserire un indirizzo email valido",
            },
          },
          privateName: {
            label: "Nome privato",
            description: "Il tuo nome interno/privato",
            placeholder: "Inserisci il tuo nome privato",
            help: "Il tuo nome privato viene utilizzato internamente e per le comunicazioni private",
            validation: {
              minLength: "Il nome privato deve essere lungo almeno 2 caratteri",
              maxLength: "Il nome privato non può superare 50 caratteri",
            },
          },
          publicName: {
            label: "Nome pubblico",
            description: "Il tuo nome di visualizzazione pubblico",
            placeholder: "Inserisci il tuo nome pubblico",
            help: "Il tuo nome pubblico sarà visibile ad altri utenti",
            validation: {
              minLength:
                "Il nome pubblico deve essere lungo almeno 2 caratteri",
              maxLength: "Il nome pubblico non può superare 50 caratteri",
            },
          },
          imageUrl: {
            label: "Immagine del profilo",
            description: "URL all'immagine del tuo profilo",
            placeholder: "Inserisci l'immagine URL",
            help: "Fornire un URL a un'immagine che verrà visualizzata come immagine del profilo",
            validation: {
              invalid: "Si prega di fornire un'immagine valida URL",
            },
          },
          company: {
            label: "Società",
            description: "Il tuo nome di azienda",
            placeholder: "Inserisci la tua azienda",
            help: "Il tuo nome aziendale verrà visualizzato sul tuo profilo",
            validation: {
              maxLength: "Nome azienda non può superare 100 caratteri",
            },
          },
          visibility: {
            label: "visibilità del profilo",
            description: "Chi può vedere il tuo profilo",
            placeholder: "Selezionare l'impostazione di visibilità",
            help: "Scegli chi può visualizzare il tuo profilo: pubblico (tutti), privato (solo tu), o solo contatti",
          },
          marketingConsent: {
            label: "Iscriviti alla Newsletter",
            description:
              "Aggiornamenti occasionali su nuovi modelli e caratteristiche. Niente spam, solo quello che conta.",
            placeholder: "Abilitare le email di marketing",
            help: "Scegliere se ricevere email di marketing e comunicazioni promozionali",
          },
          bio: {
            label: "Bio",
            description: "Una breve descrizione su te stesso",
            placeholder: "Parlaci di te stesso...",
            help: "Condividi una breve descrizione su te stesso che sarà visibile sul tuo profilo",
            validation: {
              maxLength: "Bio non può superare 500 caratteri",
            },
          },
          websiteUrl: {
            label: "Sito web",
            description: "Il tuo sito personale o aziendale",
            placeholder: "https://yoursite.com",
          },
          twitterUrl: {
            label: "X / Twitter",
            description: "Il tuo profilo X (Twitter) URL",
            placeholder: "https://x.com/yourhandle",
          },
          youtubeUrl: {
            label: "YouTube",
            description: "Il tuo canale YouTube URL",
            placeholder: "https://youtube.com/@yourchannel",
          },
          instagramUrl: {
            label: "Instagram",
            description: "Il tuo profilo Instagram URL",
            placeholder: "https://instagram.com/yourhandle",
          },
          tiktokUrl: {
            label: "TikTok",
            description: "Il tuo profilo TikTok URL",
            placeholder: "https://tiktok.com/@yourhandle",
          },
          githubUrl: {
            label: "GitHub",
            description: "Il tuo profilo GitHub URL",
            placeholder: "https://github.com/yourusername",
          },
          facebookUrl: {
            label: "Facebook",
            description: "La tua pagina Facebook o il profilo URL",
            placeholder: "https://facebook.com/yourpage",
          },
          discordUrl: {
            label: "Discord",
            description: "Il tuo server Discord o il link del profilo",
            placeholder: "https://discord.gg/yourserver",
          },
          tribeUrl: {
            label: "Tribe",
            description: "La tua comunità di Tribe URL",
            placeholder: "https://yourcommunity.tribe.so",
          },
          rumbleUrl: {
            label: "Rumble",
            description: "Il tuo canale Rumble URL",
            placeholder: "https://rumble.com/c/yourchannel",
          },
          odyseeUrl: {
            label: "Odysee",
            description: "Il tuo canale Odysee URL",
            placeholder: "https://odysee.com/@yourchannel",
          },
          nostrUrl: {
            label: "Nostr",
            description: "Il tuo profilo Nostr o indirizzo npub",
            placeholder: "https://primal.net/p/npub1...",
          },
          gabUrl: {
            label: "Gab",
            description: "Il tuo profilo Gab URL",
            placeholder: "https://gab.com/yourhandle",
          },
          creatorSlug: {
            label: "Profilo URL",
            description:
              "Il tuo profilo personalizzato slug - appare nel tuo link pubblico",
            placeholder: "jane-doe",
            validation: {
              invalid: "Solo lettere minuscole, numeri e trattini consentiti",
            },
          },
          creatorAccentColor: {
            label: "Colore dell'acustica",
            description:
              "Colore esagonale per il tuo branding pagina abilità (opzionale)",
            placeholder: "#7c3aed",
          },
          creatorHeaderImageUrl: {
            label: "Immagine dell'intestazione",
            description:
              "Banner immagine URL per il tuo eroe pagina di abilità",
            placeholder: "https://yoursite.com/banner.jpg",
          },
        },
        response: {
          title: "Profilo aggiornato",
          description: "Le informazioni aggiornate sul profilo",
          success: "Aggiornamento di successo",
          message: "Il tuo profilo è stato aggiornato con successo",
          id: "Utente ID",
          leadId: "ID del contatto",
          isPublic: "Profilo pubblico",
          email: "Indirizzo email",
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          locale: "Locale",
          isActive: "Stato attivo",
          emailVerified: "E-mail verificato",
          requireTwoFactor: "Autenticazione di due fattori richiesto",
          marketingConsent: "Consenso di marketing",
          userRoles: "Ruoli utente",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
          stripeCustomerId: "Stripe cliente ID",
          bio: "Bio",
          websiteUrl: "Sito web",
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
          creatorSlug: "Profilo Slug",
          creatorAccentColor: "Colore dell'acustica",
          creatorHeaderImageUrl: "Immagine dell'intestazione",
          user: "Informazioni utente aggiornate",
          changesSummary: {
            title: "Cambiamenti Riepilogo",
            description: "Riepilogo delle modifiche apportate al tuo profilo",
            totalChanges: "Variazioni totali",
            changedFields: "Campi cambiati",
            verificationRequired: "Verifica richiesta",
            lastUpdated: "Ultimo aggiornamento",
          },
          nextSteps: "Prossimo passo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Profilo utente non trovato",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Profilo aggiornato con successo",
          nextSteps:
            "Raccomandare i prossimi passi dopo l'aggiornamento del tuo profilo",
        },
      },
      delete: {
        title: "Cancella account utente",
        description: "Cancellare permanentemente il tuo account utente",
        response: {
          title: "Stato di cancellazione",
          description: "Conferma della cancellazione del conto",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "account utente non trovato",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Account cancellato con successo",
        },
      },
      put: {
        response: {
          changedFields: {
            item: "Campo modificato",
          },
        },
      },
      category: "Profilo utente",
      tag: "Profilo utente",
      tags: {
        profile: "profilo",
        user: "utente",
        account: "conto",
      },

      widget: {
        save: "Salva il profilo",
        saving: "Salvare...",
        editProfile: "Modifica profilo",
        cancelEdit: "Annulla",
        memberSince: "Membro dal",
        profileCard: {
          title: "Profilo del creatore",
          description: "La tua identità pubblica attraverso la piattaforma",
        },
        socialCard: {
          title: "Link sociali",
          description: "Collegare le piattaforme",
        },
        emailCard: {
          title: "La tua email",
          description:
            "I visitatori nella tua pagina di abilità e profilo creatore possono abbonarsi. Possiedi la lista - nessuna piattaforma al centro.",
        },
        previewCard: {
          title: "Il tuo profilo pubblico",
          description: "Come gli altri ti vedono",
        },
        noPreview: "Compila il tuo profilo per vedere un'anteprima",
        noSocials: "Nessun link sociale aggiunto ancora",
        viewPublicProfile: "Visualizza il profilo pubblico",
        profileUrl: "Il tuo link",
        slugWarning:
          "Modificare questo URL romperà qualsiasi link esistente al tuo profilo.",
        bioPreview: "Anteprima",
        bioEdit: "Modifica",
        skills: {
          title: "Le mie abilità",
          chat: "Chatta ora",
          add: "Aggiungi alla tua collezione",
          public: "Comunità europea",
          showLess: "Mostra meno",
        },
        deleteAccount: {
          dangerZone: "Zona di pericolo",
          button: "Eliminare il conto",
          confirmTitle: "Eliminare il tuo account in modo permanente",
          confirmDescription:
            "Questo elimina definitivamente il tuo account e tutti i dati associati. Niente recupero. Niente discorsi.",
          confirmLabel: 'Digitare " DELETE " per confermare',
          confirmPlaceholder: "DELETE",
          confirmButton: "Cancella il mio account per sempre",
          cancelButton: "Annulla",
          whatGetsDeleted: "Cosa viene cancellato:",
          items: {
            profile: "Il tuo profilo e tutte le impostazioni",
            chats: "Tutti i file e la cronologia delle chat",
            skills: "Tutte le abilità e configurazioni personalizzate",
            files: "Tutti i file e i ricordi in Cortex",
            subscriptions: "Abbonamenti attivi",
            credits: "Eventuali crediti rimanenti",
          },
          deleting: "Deleting...",
          success: "Conto cancellato. Ridirezione...",
        },
      },

      // Sub-routes
      avatar: {
        category: "Profilo utente",

        tag: "avatar",
        errors: {
          user_not_found: "Utente non trovato",
          failed_to_upload_avatar: "Non caricare avatar",
          failed_to_delete_avatar: "Non è riuscito a eliminare avatar",
          invalid_file_type: "Tipo di file non valido",
          file_too_large: "File troppo grande",
        },
        debug: {
          uploadingUserAvatar: "Caricamento dell'avatar dell'utente",
          errorUploadingUserAvatar: "Caricamento di errore utente avatar",
          deletingUserAvatar: "Cancellare l'avatar dell'utente",
          errorDeletingUserAvatar: "Cancellazione errore utente avatar",
        },
        success: {
          uploaded: "Avatar caricato con successo",
          deleted: "Avatar cancellato con successo",
          nextSteps: {
            visible: "Il tuo avatar è ora visibile sul tuo profilo",
            update:
              "Puoi aggiornarlo in qualsiasi momento dalle impostazioni del tuo profilo",
            default: "Il tuo profilo ora mostra l'avatar predefinito",
            uploadNew:
              "È possibile caricare un nuovo avatar in qualsiasi momento dalle impostazioni del profilo",
          },
        },
        upload: {
          title: "Caricamento Avatar",
          description: "Caricare un'immagine avatar profilo",
          groups: {
            fileUpload: {
              title: "Caricamento file",
              description: "Selezionare e caricare l'immagine avatar",
            },
          },
          fields: {
            file: {
              label: "Immagine di Avatar",
              description:
                "Selezionare un file di immagine per il tuo profilo avatar",
              placeholder: "Scegli un file di immagine...",
              help: "Caricare un file immagine (JPG, PNG, GIF) fino a 5MB",
              validation: {
                maxSize: "La dimensione del file deve essere inferiore a 5MB",
                imageOnly: "Solo i file di immagine sono permessi",
                unsupportedFormat:
                  "Formato dell'immagine non supportato. Utilizzare JPEG, PNG, WebP o GIF.",
              },
            },
          },
          response: {
            title: "Rispondere a carico",
            label: "Risultato di carico",
            description: "Risposta di upload Avatar",
            success: "Caricamento di successo",
            message: "Il tuo avatar è stato caricato con successo",
            avatarUrl: "Avatar URL",
            uploadTime: "Tempo di caricamento",
            nextSteps: {
              item: "Prossimo passo",
            },
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Il file caricato non è valido o danneggiato",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Devi essere connesso per caricare un avatar",
            },
            server: {
              title: "Errore del server",
              description: "Non è riuscito a elaborare l'upload di avatar",
            },
            internal: {
              title: "Errore interno",
              description: "Si è verificato un errore del server interno",
            },
            unknown: {
              title: "Errore sconosciuto",
              description:
                "Un errore inaspettato si è verificato durante il caricamento",
            },
            network: {
              title: "Errore di rete",
              description:
                "Un errore di rete si è verificato durante il caricamento",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Non hai il permesso di caricare un avatar",
            },
            notFound: {
              title: "Non trovato",
              description: "La risorsa richiesta non è stata trovata",
            },
            unsaved: {
              title: "Modifiche non salvate",
              description: "Ci sono cambiamenti non rilevati",
            },
            conflict: {
              title: "Conflitto",
              description:
                "Un conflitto si è verificato durante il caricamento",
            },
          },
          success: {
            title: "Avatar Caricato",
            description: "Il tuo profilo avatar è stato caricato con successo",
          },
        },
        delete: {
          title: "Eliminare Avatar",
          description: "Rimuovere l'avatar del profilo corrente",
          response: {
            title: "Eliminare la risposta",
            label: "Eliminare il risultato",
            description: "Risposta di cancellazione Avatar",
            success: "Delezione Successo",
            message: "Il tuo avatar è stato cancellato con successo",
            nextSteps: {
              item: "Prossimo passo",
            },
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description:
                "La richiesta di cancellazione dell'avatar è invalida",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Devi essere connesso per eliminare il tuo avatar",
            },
            server: {
              title: "Errore del server",
              description: "Non è riuscito a eliminare avatar",
            },
            internal: {
              title: "Errore interno",
              description: "Si è verificato un errore del server interno",
            },
            unknown: {
              title: "Errore sconosciuto",
              description:
                "Un errore inaspettato si è verificato durante la cancellazione",
            },
            network: {
              title: "Errore di rete",
              description:
                "Un errore di rete si è verificato durante la cancellazione",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Non hai il permesso di eliminare questo avatar",
            },
            notFound: {
              title: "Non trovato",
              description: "L'avatar da eliminare non è stato trovato",
            },
            unsaved: {
              title: "Modifiche non salvate",
              description: "Ci sono cambiamenti non rilevati",
            },
            conflict: {
              title: "Conflitto",
              description:
                "Un conflitto si è verificato durante la cancellazione",
            },
          },
          success: {
            title: "Avatar Cancellato",
            description: "Il tuo profilo avatar è stato rimosso con successo",
          },
        },
      },
      password: {
        category: "Profilo utente",

        title: "Cambia password",
        description: "Aggiorna la password del tuo account in modo sicuro",
        tag: "password-cambio",
        debug: {
          updatingPassword: "Aggiornamento della password",
          errorUpdatingPassword: "Aggiornamento di errore password",
          settingPassword: "Impostazione della password",
          errorSettingPassword: "Impostazione di errore password",
        },
        groups: {
          currentCredentials: {
            title: "Password corrente",
            description: "Verificare la password corrente per procedere",
          },
          newCredentials: {
            title: "Nuova password",
            description: "Scegli una nuova password forte per il tuo account",
          },
        },
        currentPassword: {
          label: "Password corrente",
          description: "Inserisci la password corrente",
          placeholder: "Inserisci la password corrente",
          help: "Inserisci la password corrente per verificare la tua identità prima di cambiarla",
        },
        newPassword: {
          label: "Nuova password",
          description: "Inserisci la tua nuova password (minimo 8 caratteri)",
          placeholder: "Inserisci nuova password",
          help: "Scegliere una password forte con almeno 8 caratteri tra cui lettere, numeri e simboli",
        },
        confirmPassword: {
          label: "Confermare la password",
          description: "Conferma la tua nuova password",
          placeholder: "Confermare la nuova password",
          help: "Reinserire la nuova password per assicurarsi che sia stata digitata correttamente",
        },
        twoFactorCode: {
          label: "Codice a due fattori",
          description:
            "Inserisci il codice di autenticazione a due fattori se abilitato",
          placeholder: "Inserisci il codice 2FA",
        },
        response: {
          title: "Cambiamento di password",
          description: "Risposta per l'operazione di cambiamento password",
          success: "Password modificata",
          message: "Messaggio di stato",
          securityTip: "Suggerimento di sicurezza",
          nextSteps: {
            item: "Prossimo passo",
          },
        },
        validation: {
          currentPassword: {
            minLength: "La password attuale deve essere almeno 8 caratteri",
          },
          newPassword: {
            minLength: "La nuova password deve essere di almeno 8 caratteri",
          },
          confirmPassword: {
            minLength:
              "La conferma della password deve essere almeno 8 caratteri",
          },
          passwords: {
            mismatch: "Le password non coincidono",
          },
        },
        errors: {
          passwords_do_not_match: "Le password non coincidono",
          user_not_found: "Utente non trovato",
          incorrect_password: "password non corretta",
          update_failed: "Non è stato possibile aggiornare la password",
          token_creation_failed: "Non è riuscito a creare password token",
          two_factor_code_required:
            "Richiesto il codice di autenticazione a due fattori",
          invalid_two_factor_code:
            "Codice di autenticazione a due fattori non valido",
          invalid_request: {
            title: "Richiesta non valida",
            description: "La richiesta di modifica della password è invalida",
          },
          validation: {
            title: "Errore di convalida",
            description: "Si prega di controllare il vostro input e riprovare",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Devi essere connesso per cambiare la tua password",
          },
          server: {
            title: "Errore del server",
            description:
              "Non è stato possibile aggiornare la password a causa dell'errore del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description:
              "Un errore inaspettato si è verificato durante l'aggiornamento della password",
          },
          network: {
            title: "Errore di rete",
            description: "Collegamento di rete fallito",
          },
          forbidden: {
            title: "Accesso Proibito",
            description: "Non hai il permesso di eseguire questa azione",
          },
          notFound: {
            title: "Utente non trovato",
            description: "L'account utente non potrebbe essere trovato",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai dei cambiamenti non salvati che saranno persi",
          },
          conflict: {
            title: "Conflitto dei dati",
            description:
              "Si è verificato un conflitto durante l'aggiornamento della password",
          },
        },
        success: {
          updated: "Password aggiornata con successo",
          securityTip:
            "Per una maggiore sicurezza, abilitare l'autenticazione a due fattori",
          nextSteps: {
            logoutOther:
              "Tutte le altre sessioni sono state registrate per la sicurezza",
            enable2fa:
              "Considerare l'attivazione dell'autenticazione a due fattori per una migliore sicurezza",
          },
          title: "Aggiornamento password",
          description: "La tua password è stata aggiornata con successo",
        },
        update: {
          success: {
            title: "Aggiornamento password",
            description: "La tua password è stata aggiornata con successo",
          },
          errors: {
            unknown: {
              title: "Errore sconosciuto",
              description:
                "Un errore inaspettato si è verificato durante l'aggiornamento della password",
            },
          },
        },
      },
      addresses: {
        category: "Indirizzi utente",
        tag: "indirizzi",

        list: {
          title: "I miei indirizzi",
          description: "Elenca gli indirizzi salvati",
          response: {
            addresses: "Indirizzi",
          },
          widget: {
            addAddress: "Aggiungi l'indirizzo",
            edit: "Modifica",
            delete: "Elimina",
            billing: "Fatturazione",
            delivery: "Consegna",
            empty: "Nessun indirizzo salvato",
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Richiesta non valida",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso non consentito",
            },
            notFound: {
              title: "Non trovato",
              description: "Nessun indirizzo trovato",
            },
            conflict: {
              title: "Conflitto",
              description: "Conflittuale dei dati",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Ci sono cambiamenti non rilevati",
            },
            internal: {
              title: "Errore del server",
              description: "Errore del server interno",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore sconosciuto",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Indirizzi recuperati",
          },
        },

        create: {
          title: "Aggiungi l'indirizzo",
          description: "Salvare un nuovo indirizzo sul tuo account",
          fields: {
            label: {
              label: "Etichetta",
              description: "Nomina questo indirizzo (ad es. Home, Ufficio)",
              placeholder: "Home",
            },
            fullName: {
              label: "Nome completo",
              description: "Nome di contatto per questo indirizzo",
              placeholder: "Jane Doe",
            },
            company: {
              label: "Società",
              description: "Nome della Società (opzionale)",
              placeholder: "Corda d'acme",
            },
            phone: {
              label: "Telefono",
              description: "Numero di telefono di contatto",
              placeholder: "+1 555 000 0000",
            },
            vatNumber: {
              label: "Numero di VAT",
              description: "EU VAT numero di registrazione",
              placeholder: "DE123456789",
            },
            taxId: {
              label: "Tassa fiscale ID",
              description: "Identificazione fiscale nazionale",
              placeholder: "123-45-6789",
            },
            addressLine1: {
              label: "Indirizzo Linea 1",
              description: "Via e numero",
              placeholder: "123 St principale",
            },
            addressLine2: {
              label: "Indirizzo Linea 2",
              description: "Appartamento, suite, unità (opzionale)",
              placeholder: "Suite 4B",
            },
            city: {
              label: "Città",
              description: "Città",
              placeholder: "Berlino",
            },
            region: {
              label: "Stato / Regione",
              description: "Stato o regione (facoltativo)",
              placeholder: "Bayern",
            },
            postalCode: {
              label: "Codice Postale",
              description: "ZIP o codice postale",
              placeholder: "10115",
            },
            country: {
              label: "Paese",
              description: "ISO 3166 -1 alpha-2 codice paese",
              placeholder: "DE",
            },
            isDefaultBilling: {
              label: "Billing predefinito",
              description:
                "Utilizzare come indirizzo di fatturazione predefinito",
            },
            isDefaultDelivery: {
              label: "Consegna predefinita",
              description: "Utilizzare come indirizzo di consegna predefinito",
            },
          },
          response: {
            id: "Indirizzo ID",
            label: "Etichetta",
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Controllare i campi obbligatori",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso non consentito",
            },
            notFound: {
              title: "Non trovato",
              description: "Utente non trovato",
            },
            conflict: {
              title: "Conflitto",
              description: "Conflittuale dei dati",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Ci sono cambiamenti non rilevati",
            },
            internal: {
              title: "Errore del server",
              description: "Errore del server interno",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore sconosciuto",
            },
          },
          success: {
            title: "Indirizzo salvato",
            description: "Indirizzo aggiunto al tuo account",
          },
          widget: {
            saved: "Indirizzo salvato.",
            backToAddresses: "Torna agli indirizzi",
          },
        },
      },
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "Nessun token nei cookie",
        },
      },
      errors: {
        session_not_found: "Sessione non trovata",
        session_lookup_failed: "Non è riuscito a sessione di ricerca",
        expired_sessions_delete_failed:
          "Impossibile eliminare le sessioni scadute",
        session_creation_failed: "Non è riuscito a creare sessione",
        session_creation_database_error:
          "Errore del database durante la creazione della sessione",
        user_sessions_delete_failed:
          "Non riuscita a eliminare le sessioni utente",
        expired: "La sessione è scaduta",
      },
      post: {
        title: "Sessione",
        description: "Endpoint di sessione",
        form: {
          title: "Configurazione della sessione",
          description: "Imposta i parametri della sessione",
        },
        response: {
          title: "Risposta",
          description: "Dati restituiti per la sessione",
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          server: {
            title: "Errore del server",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
        },
      },
    },
    sessions: {
      category: "Utenti",

      list: {
        title: "Le mie sessioni",
        description: "Elenca tutte le sessioni attive per il tuo account",
        tag: "Sessioni",
        response: {
          sessions: "Sessioni",
        },
        success: {
          title: "Sessioni recuperate",
          description: "Le tue sessioni attive sono state recuperate",
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          validation: {
            title: "Errore di convalida",
            description: "Richiesta non valida",
          },
          server: {
            title: "Errore del server",
            description: "Errore del server interno",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "Conflittuale dei dati",
          },
        },
      },
      create: {
        title: "Crea token di sessione",
        description:
          "Creare un token di sessione denominato per l'accesso programmatico",
        tag: "Sessioni",
        form: {
          name: "Nome del token",
          namePlaceholder: "ad esempio. Il mio agente Bo",
        },
        response: {
          token: "Token",
          id: "Sessione ID",
          name: "Nome",
          message: "Copia ora il token. Non verrà più mostrato.",
        },
        success: {
          title: "Sessione creata",
          description: "Il tuo token di sessione è stato creato",
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          validation: {
            title: "Errore di convalida",
            description: "Richiesta non valida",
          },
          server: {
            title: "Errore del server",
            description: "Errore del server interno",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "Conflittuale dei dati",
          },
        },
      },
      revoke: {
        title: "Sessione di voto",
        description: "Rivolgere un token di sessione da ID",
        tag: "Sessioni",
        response: {
          message: "Sessione revocata",
        },
        success: {
          title: "Sessione revocata",
          description: "La sessione è stata revocata",
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          validation: {
            title: "Errore di convalida",
            description: "Richiesta non valida",
          },
          server: {
            title: "Errore del server",
            description: "Errore del server interno",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Sessione non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "Conflittuale dei dati",
          },
        },
      },
    },
  },
  public: {
    login: {
      category: "Utenti",
      title: "Bentornato",
      description:
        "Accedi ai modelli AI non censurati e alla cronologia delle tue conversazioni.",
      tag: "Autenticazione",
      options: {
        category: "Utenti",

        title: "Opzioni di accesso",
        description: "Opzioni di configurazione del login",
        tag: "login-opzioni",
        container: {
          title: "Configurazione del login",
          description: "Configurare le impostazioni e le opzioni di login",
        },
        fields: {
          email: {
            label: "Indirizzo email",
            description: "Inserisci il tuo indirizzo email",
            placeholder: "your@email.com",
          },
          allowPasswordAuth: {
            label: "Consentire l'autenticazione della password",
            description: "Abilitare l'autenticazione basata su password",
          },
          allowSocialAuth: {
            label: "Consentire l'autenticazione sociale",
            description: "Abilitare l'autenticazione dei fornitori sociali",
          },
          maxAttempts: {
            label: "Tentazioni di accesso massimo",
            description: "Numero massimo di tentativi di login consentiti",
          },
          requireTwoFactor: {
            label: "Richiedere l'autenticazione a due fattori",
            description: "Richiedere 2FA per il login dell'utente",
          },
          socialProviders: {
            label: "Fornitori sociali",
            description: "Fornitori di autenticazione sociale disponibili",
          },
          socialProvider: {
            title: "Fornitore sociale",
            description:
              "Configurazione del fornitore di autenticazione sociale",
            enabled: {
              label: "Abilitato",
              description: "Se questo fornitore è abilitato",
            },
            name: {
              label: "Nome del fornitore",
              description: "Nome del fornitore sociale",
            },
            providers: {
              label: "Opzioni del fornitore",
              description: "Opzioni di social provider disponibili",
            },
          },
        },
        response: {
          title: "Opzioni di Login",
          description: "Opzioni di configurazione di login disponibili",
          success: {
            badge: "Operazione riuscita",
          },
          message: {
            content: "Messaggio di stato",
          },
          forUser: {
            content: "Indirizzo email",
          },
          loginMethods: {
            title: "Metodi di Login",
            description: "Metodi di autenticazione disponibili",
            password: {
              title: "Password Login",
              description: "Autenticazione della password standard",
              enabled: {
                badge: "Abilitato",
              },
            },
            social: {
              title: "Social Login",
              description: "Opzioni di autenticazione dei social media",
              enabled: {
                badge: "Abilitato",
              },
              providers: {
                item: {
                  title: "Fornitore sociale",
                  description: "Fornitore di autenticazione sociale",
                },
                name: {
                  content: "Nome del fornitore",
                },
                id: {
                  content: "Provider ID",
                },
                enabled: {
                  badge: "Disponibile",
                },
                description: "Descrizione del fornitore",
              },
            },
          },
          security: {
            title: "Impostazioni di sicurezza",
            description: "Requisiti di sicurezza di autenticazione",
            maxAttempts: {
              content: "Tentazioni di accesso massimo",
            },
            requireTwoFactor: {
              badge: "2FA richiesto",
            },
          },
          recommendations: {
            item: "Opzione di accesso consigliata",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          server: {
            title: "Errore del server",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Le modifiche non sono state salvate",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Opzioni di accesso recuperate con successo",
        },
        post: {
          title: "Opzioni di accesso",
          description: "Ottieni le opzioni di login disponibili",
          response: {
            title: "Opzioni di Login",
            description: "Opzioni di configurazione di login disponibili",
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Parametri della richiesta non validi",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            server: {
              title: "Errore del server",
              description: "Si è verificato un errore interno del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore sconosciuto",
            },
          },
          success: {
            description: "Opzioni di accesso recuperate con successo",
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
          successMessage: "Opzioni di accesso recuperate con successo",
          passwordAuthDescription: "Accedi con email e password",
          socialAuthDescription: "Accedi con i tuoi account sui social media",
          continueWithProvider: "Continua con {{provider}}",
          twoFactorRequired: "Maggiore sicurezza: richiesta 2FA",
          standardSecurity: "Requisiti di sicurezza standard",
          tryPasswordFirst: "Prova prima password login",
          useSocialLogin: "Utilizzare il login sociale",
          socialLoginFaster: "Social login è più veloce per i nuovi utenti",
        },
      },
      actions: {
        submit: "Accedi",
        submitting: "Logging in...",
      },
      fields: {
        email: {
          label: "La tua email",
          description: "L'email con cui ti sei iscritto.",
          placeholder: "Inserisci la tua email",
          validation: {
            required: "E-mail è richiesta",
            invalid: "Si prega di inserire un indirizzo email valido",
          },
        },
        password: {
          label: "La tua password",
          description: "Inserisci la password impostata durante l'iscrizione.",
          placeholder: "Inserisci la password",
          help: "Inserisci la password del tuo account",
          validation: {
            required: "La password è richiesta",
            minLength: "La password deve essere lunga almeno 8 caratteri",
          },
        },
        rememberMe: {
          label: "Continua a leggere",
        },
      },
      groups: {
        credentials: {
          title: "Credenziali di Login",
          description: "Inserisci le informazioni di login",
        },
        options: {
          title: "Opzioni di accesso",
          description: "Ulteriori preferenze di login e impostazioni",
        },
        preferences: {
          title: "Preferenze di accesso",
          description: "Ulteriori opzioni di login",
        },
        advanced: {
          title: "Opzioni avanzate",
          description: "Impostazioni di login avanzate",
        },
      },
      footer: {
        forgotPassword: "Password dimenticata?",
        createAccount: "Non hai un account? Registrati",
      },
      response: {
        title: "Risposta del Login",
        description: "Dati di risposta del login",
        success: "Accesso riuscito",
        message: "Messaggio di stato",
        user: {
          title: "Dettagli utente",
          description: "Registrato nelle informazioni dell'utente",
          id: "Utente ID",
          email: "Indirizzo email",
          firstName: "Nome",
          lastName: "Ultimo nome",
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          imageUrl: "Immagine del profilo",
        },
        sessionInfo: {
          title: "Informazioni di sessione",
          description: "Dettagli della sessione utente",
          expiresAt: "Scadenza della sessione",
          rememberMeActive: "Stato dell’opzione di accesso continuato",
          loginLocation: "Luogo di accesso",
        },
        nextSteps: {
          title: "Prossimo passo",
          item: "Prossimo passo",
        },
      },
      errors: {
        title: "Errore di accesso",
        account_locked: "L'account è bloccato",
        accountLocked: "L'account è bloccato",
        accountLockedDescription:
          "Il tuo account è bloccato. Contatta l’assistenza.",
        invalid_credentials: "E-mail o password non valide",
        two_factor_required: "Richiesta di autenticazione a due fattori",
        auth_error: "Si è verificato un errore di autenticazione",
        user_not_found: "Utente non trovato",
        session_creation_failed: "Non è riuscito a creare sessione",
        token_save_failed: "Non riuscito a salvare il token di autenticazione",
        validation: {
          title: "Convalida non riuscita",
          description: "Si prega di controllare il vostro input",
        },
        unauthorized: {
          title: "Accesso non riuscito",
          description: "credenziali non valide",
        },
        unknown: {
          title: "Errore di accesso",
          description: "Un errore si è verificato durante il login",
        },
        network: {
          title: "Errore di rete",
          description: "La connessione non è riuscita",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Utente non trovato",
          description: "account utente non trovato",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Le modifiche non sono state salvate",
        },
        conflict: {
          title: "Accedi a Conflict",
          description: "Rilevato conflitto di accesso",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
      },
      success: {
        title: "Accesso riuscito",
        description: "Sei stato registrato",
        message: "Bentornato! Hai effettuato l'accesso.",
      },
      token: {
        save: {
          failed: "Non riuscito a salvare il token di autenticazione",
          success: "Token di autenticazione salvato con successo",
        },
      },
      process: {
        failed: "Processo di log-in fallito",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "Dev Quick Login",
      },
    },
    resetPassword: {
      confirm: {
        category: "Utenti",

        title: "Conferma il ripristino della password",
        description:
          "Confermare il ripristino della password con una nuova password",
        tag: "Ripristino della password",
        email: {
          title: "Password ripristinata",
          subject: "Password ripristinata su {{appName}}",
          previewText:
            "Hai ripristinato la password di {{appName}}. Accedi per chattare con {{modelCount}} modelli di IA.",
          greeting: "Ciao {{name}},",
          successMessage:
            "La tua password è stata ripristinata. Accedi e riprendi da dove eri rimasto.",
          loginButton: "Accedi a {{appName}}",
          promoText:
            "{{modelCount}} modelli di IA. Zero filtri. Zero prediche.",
          securityWarning:
            "Non hai chiesto tu il ripristino? Contatta subito l’assistenza. Il tuo account potrebbe essere a rischio.",
        },
        groups: {
          verification: {
            title: "Verifica",
            description: "Verifica la richiesta di ripristino della password",
          },
          newPassword: {
            title: "Nuova password",
            description: "Imposta la nuova password",
          },
        },
        fields: {
          token: {
            label: "Token di ripristino",
            description: "Il token di reset della password dalla tua email",
            placeholder: "Inserisci il token di reset",
            help: "Controlla la tua email per il token di reset della password e inseriscila qui",
            validation: {
              required: "Reset token è necessario",
            },
          },
          email: {
            label: "Indirizzo email",
            description: "Il tuo indirizzo email",
            placeholder: "Inserisci il tuo indirizzo email",
            validation: {
              invalid: "Si prega di inserire un indirizzo email valido",
            },
          },
          password: {
            label: "Nuova password",
            description: "La nuova password",
            placeholder: "Inserisci nuova password",
            help: "Scegliere una password forte con almeno 8 caratteri tra cui lettere, numeri e simboli",
            validation: {
              minLength: "La password deve essere lunga almeno 8 caratteri",
            },
          },
          confirmPassword: {
            label: "Confermare la password",
            description: "Conferma la tua nuova password",
            placeholder: "Confermare la nuova password",
            validation: {
              minLength: "La password deve essere lunga almeno 8 caratteri",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Le password non coincidono",
          },
        },
        response: {
          title: "Riattiva risposta password",
          description: "Rispondere alla conferma della password",
          message: {
            label: "Messaggio",
            description: "Messaggio di risposta",
          },
          securityTip:
            "Considerare l'attivazione dell'autenticazione a due fattori per una migliore sicurezza",
          nextSteps: [
            "Accedi con la nuova password",
            "Aggiorna le password salvate nel tuo browser",
            "Considerare l'abilitazione 2FA per una maggiore sicurezza",
          ],
        },
        errors: {
          title: "Errore di ripristino della password",
          no_email: "Nessun account trovato con quell'indirizzo email",
          validation: {
            title: "Errore di convalida",
            description: "Si prega di controllare il vostro input e riprovare",
            passwordsDoNotMatch: "Le password non coincidono",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Token di reset non valido o scaduto",
          },
          internal: {
            title: "Errore del server",
            description: "Si è verificato un errore del server interno",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di connessione di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di eseguire questa azione",
          },
          notFound: {
            title: "Non trovato",
            description: "Reset token non trovato o scaduto",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          conflict: {
            title: "Conflitto",
            description:
              "Si è verificato un conflitto durante l'elaborazione della vostra richiesta",
          },
        },
        success: {
          title: "Password ripristinata",
          description: "La tua password è stata ripristinata con successo",
          message: "La password è stata ripristinata con successo",
          password_reset: "La tua password è stata ripristinata con successo",
        },
        actions: {
          requestNewLink: "Richiedi un nuovo link di reset",
        },
        emailTemplates: {
          confirm: {
            name: "Email di conferma del ripristino della password",
            description:
              "Email inviata agli utenti dopo che la password è stata ripristinata con successo",
            category: "Autenticazione",
            preview: {
              publicName: {
                label: "Nome pubblico",
                description: "Il nome del display pubblico dell'utente",
              },
              userId: {
                label: "Utente ID",
                description: "L'identificatore unico dell'utente",
              },
            },
          },
        },
      },
      request: {
        category: "Utenti",
        title: "Reimpostare la richiesta di password",
        description: "Richiedi il ripristino della password",
        tag: "Ripristino della password",
        ui: {
          title: "Reimposta la password",
          subtitle:
            "Inserisci il tuo indirizzo e-mail e ti invieremo un link per ripristinare la password",
          sendResetLink: "Inviare Reset Link",
          alreadyHaveAccount: "Hai già un account? Accedi",
        },
        actions: {
          submitting: "Invio in corso…",
        },
        email: {
          title: "Ripristina la tua password di {{appName}}",
          subject: "Richiesta di ripristino della password di {{appName}}",
          previewText:
            "Ripristina la tua password di {{appName}}. Il link è valido per {{hours}} ore.",
          greeting: "Ciao {{name}},",
          requestInfo:
            "Abbiamo ricevuto una richiesta di ripristino della password per il tuo account {{appName}}. Se l’hai inviata tu, usa il pulsante qui sotto.",
          buttonText: "Ripristina la mia password",
          expirationInfo:
            "Il link scade tra {{hours}} ore. Se non hai inviato tu la richiesta, ignora questa email. La tua password resta la stessa.",
          signoff: "Il team di {{appName}}",
          promoText:
            "{{modelCount}} modelli di IA. Zero filtri. Zero prediche.",
        },
        groups: {
          emailInput: {
            title: "Input e-mail",
            description:
              "Inserisci il tuo indirizzo e-mail per ricevere le istruzioni di reset",
          },
        },
        fields: {
          email: {
            label: "Indirizzo email",
            description: "Inserisci il tuo indirizzo email",
            placeholder: "your@email.com",
            help: "Inserisci l'indirizzo email associato al tuo account",
            validation: {
              invalid: "Si prega di inserire un indirizzo email valido",
            },
          },
        },
        response: {
          title: "Reimpostare la risposta richiesta",
          description: "Risposta della richiesta di ripristino della password",
          success: {
            message: "Link di ripristino inviato",
          },
          deliveryInfo: {
            estimatedTime: "entro 5 minuti",
            expiresAt: "4 ore da ora",
          },
          nextSteps: {
            checkEmail: "Controlla la cartella posta e-mail e spam",
            clickLink: "Fare clic sul link di reset nell'e-mail",
            createPassword: "Creare una nuova password sicura",
          },
        },
        errors: {
          title: "Errore",
          validation: {
            title: "Errore di convalida",
            description: "Input non valido fornito",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Richiesta non autorizzata",
          },
          internal: {
            title: "Errore interno",
            description: "Errore del server interno",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di connessione di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Le modifiche non sono state salvate",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          no_email: "Nessun account trovato con quell'indirizzo email",
          email_generation_failed: "Non generare e-mail",
        },
        success: {
          title: "Richiesta inviata",
          description: "Richiesta di ripristino della password inviata",
        },
        post: {
          title: "Richiesta",
          description: "Richiedi il punto finale",
          form: {
            title: "Richiesta di configurazione",
            description: "Configurare i parametri di richiesta",
          },
          response: {
            title: "Risposta",
            description: "Richiedi i dati di risposta",
          },
          errors: {
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            validation: {
              title: "Errore di convalida",
              description: "Parametri della richiesta non validi",
            },
            server: {
              title: "Errore del server",
              description: "Si è verificato un errore interno del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore sconosciuto",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso non consentito",
            },
            notFound: {
              title: "Non trovato",
              description: "Risorsa non trovata",
            },
            conflict: {
              title: "Conflitto",
              description: "I dati sono in conflitto",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Operazione completata",
          },
        },
        emailTemplates: {
          request: {
            name: "Email con il link per ripristinare la password",
            description:
              "Email inviata agli utenti con un link per ripristinare la password",
            category: "Autenticazione",
            preview: {
              publicName: {
                label: "Nome pubblico",
                description: "Il nome del display pubblico dell'utente",
              },
              userId: {
                label: "Utente ID",
                description: "L'identificatore unico dell'utente",
              },
              passwordResetUrl: {
                label: "Password Reset URL",
                description: "URL per il ripristino della password",
              },
            },
          },
        },
      },
      validate: {
        category: "Utenti",

        title: "Convalida Reset Password Token",
        description: "Convalida password reset token endpoint",
        tag: "Convalida di ripristino della password",
        groups: {
          tokenInput: {
            title: "Convalida dei token",
            description:
              "Immettere il token di reset della password per convalidare",
          },
        },
        fields: {
          token: {
            label: "Token di ripristino",
            description: "Password reset token da email",
            placeholder: "Inserisci il token di reset",
            help: "Inserisci il token che hai ricevuto nella tua email",
            validation: {
              required: "Reset token è necessario",
            },
          },
        },
        response: {
          title: "Risultato di convalida",
          description: "Risposta di convalida token",
          valid: "Convalida di token",
          message: "Messaggio di convalida",
          validationMessage: "Reset token validazione completata",
          userId: "Utente ID",
          expiresAt: "Scade Token a",
          nextSteps: {
            item: "Prossimo passo dopo la convalida",
            steps: [
              "Procedere per impostare la nuova password",
              "Scegli una password forte e unica",
            ],
          },
        },
        errors: {
          title: "Errore",
          validation: {
            title: "Errore di convalida",
            description: "La validazione di Token è fallita",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Token non valido o scaduto",
          },
          internal: {
            title: "Errore interno",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Token non trovato",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
        },
        success: {
          title: "Convalida di token",
          description: "Password reset token è valido",
        },
        post: {
          title: "Convalida",
          description: "Valida il punto finale",
          form: {
            title: "Configurazione valida",
            description: "Configurare i parametri di convalida",
          },
          response: {
            title: "Risposta",
            description: "Convalida dei dati di risposta",
          },
          errors: {
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            validation: {
              title: "Errore di convalida",
              description: "Parametri della richiesta non validi",
            },
            server: {
              title: "Errore del server",
              description: "Si è verificato un errore interno del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore sconosciuto",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso non consentito",
            },
            notFound: {
              title: "Non trovato",
              description: "Risorsa non trovata",
            },
            conflict: {
              title: "Conflitto",
              description: "I dati sono in conflitto",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Operazione completata",
          },
        },
      },
      actions: {
        back: "Indietro",
        submit: "Invia",
        submitting: "Invio in corso...",
      },
      success: {
        password_reset: "La password è stata ripristinata con successo.",
      },
      errors: {
        tokenValidationFailed: "La validazione di Token è fallita",
        userLookupFailed: "Non riuscito a cercare l'utente",
        tokenDeletionFailed: "Non è riuscito a eliminare token",
        userDeletionFailed: "Non riuscita a eliminare l'utente",
        resetFailed: "Ripristino della password non riuscito",
        tokenCreationFailed: "Non è riuscito a creare il token di reset",
        noDataReturned: "Il database non ha restituito dati",
        tokenInvalid: "Il token di reset non è valido",
        tokenExpired: "Reset token è scaduto",
        tokenVerificationFailed: "La verifica del token è fallita",
        userNotFound: "Utente non trovato",
        passwordUpdateFailed: "Non è stato possibile aggiornare la password",
        passwordResetFailed: "Ripristino della password non riuscito",
        requestFailed: "Reimpostare la richiesta fallita",
        emailMismatch: "Email non corrisponde",
        confirmationFailed:
          "Conferma del ripristino della password non riuscita",
      },
    },
    signup: {
      category: "Utenti",

      _components: {
        passwordStrength: {
          label: "Robustezza della password",
          weak: "Debole",
          fair: "Discreta",
          good: "Buona",
          strong: "Forte",
          requirement: {
            minLength: {
              icon: "✗",
              text: "Almeno 8 caratteri",
            },
            uppercase: {
              icon: "✗",
              text: "Almeno una lettera maiuscola",
            },
            lowercase: {
              icon: "✗",
              text: "Almeno una lettera minuscola",
            },
            number: {
              icon: "✗",
              text: "Almeno un numero",
            },
            special: {
              icon: "!",
              text: "Carattere speciale (opzionale, migliora la forza)",
            },
          },
        },
        post: {
          title: "_componenti",
          description: "_componenti endpoint",
          form: {
            title: "Configurazione _components",
            description: "Configurare _parametri dei componenti",
          },
          response: {
            title: "Risposta",
            description: "_componenti dati di risposta",
          },
          errors: {
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            validation: {
              title: "Errore di convalida",
              description: "Parametri della richiesta non validi",
            },
            server: {
              title: "Errore del server",
              description: "Si è verificato un errore interno del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore sconosciuto",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso non consentito",
            },
            notFound: {
              title: "Non trovato",
              description: "Risorsa non trovata",
            },
            conflict: {
              title: "Conflitto",
              description: "I dati sono in conflitto",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Operazione completata",
          },
        },
      },
      title: "Registrazione utente",
      description: "Finalpoint di registrazione utente",
      tag: "Autenticazione",
      form: {
        title: "Benvenuti a Uncensored AI",
        description:
          "Aiuta a costruire incensored, privacy-first, e veramente indipendente AI. unbottled.ai è open source e community-driven, la tua iscrizione supporta lo sviluppo di AI tecnologia che rispetta la vostra libertà.",
      },
      actions: {
        submit: "Crea account",
        submitting: "Creazione di Account...",
      },
      fields: {
        privateName: {
          label: "Il tuo nome privato",
          description:
            "Come la AI ti affronterà in conversazioni private. Questo rimane tra voi e lo AI - completamente privato.",
          placeholder: "Inserisci il tuo nome",
          validation: {
            required: "Il nome privato è richiesto",
            minLength: "Il nome deve essere almeno 2 caratteri",
            maxLength: "Il nome deve essere inferiore a 100 caratteri",
          },
        },
        publicName: {
          label: "Il tuo nome pubblico",
          description:
            "La tua identità in chat e forum pubblici. Altri utenti e AI vedranno questo nome. Scegli con saggezza - ti rappresenta nella comunità.",
          placeholder: "Inserisci il nome del display",
          validation: {
            required: "Il nome dell'esposizione è richiesto",
            minLength:
              "Il nome dell'esposizione deve essere almeno 2 caratteri",
            maxLength:
              "Il nome dell'esposizione deve essere inferiore a 100 caratteri",
          },
        },
        email: {
          label: "La tua email",
          description:
            "Le credenziali di accesso e il metodo di contatto. Tenuto privato - mai condiviso con altri utenti o AI.",
          placeholder: "Inserisci l'indirizzo email",
          help: "Questo sarà il vostro email di login e metodo di contatto primario",
          validation: {
            required: "E-mail è richiesta",
            invalid: "Si prega di inserire un indirizzo email valido",
          },
        },
        password: {
          label: "La tua password",
          description:
            "Le password forti proteggono il tuo account. Stiamo implementando la crittografia end-to-end presto - a quel punto, i reimpostazioni password chiariranno la cronologia dei messaggi poiché solo si tiene la chiave di decrittografia. Risparmiatelo in un posto sicuro.",
          placeholder: "Inserisci la password",
          validation: {
            required: "La password è richiesta",
            minLength: "La password deve avere almeno 8 caratteri",
            complexity:
              "La password deve contenere maiuscole, minuscole e un numero",
          },
        },
        confirmPassword: {
          label: "Conferma la tua password",
          validation: {
            required: "Conferma la tua password",
            minLength: "La password deve avere almeno 8 caratteri",
            mismatch: "Le password non coincidono",
          },
        },
        subscribeToNewsletter: {
          label: "Iscriviti alla Newsletter",
          description:
            "Aggiornamenti occasionali su nuovi modelli e caratteristiche. Niente spam, solo quello che conta.",
        },
        acceptTerms: {
          label: "Termini e condizioni",
          description:
            "Le nostre condizioni rispettano la tua libertà e la tua privacy.",
          termsLink: "termini",
          conditionsLink: "informativa sulla privacy",
          descriptionPrefix: "I nostri",
          descriptionAnd: "e la nostra",
          descriptionSuffix: "rispettano la tua libertà.",
          validation: {
            required: "Per continuare, accetta i termini e le condizioni",
          },
        },
        referralCode: {
          label: "Codice di riferimento (opzionale)",
          description:
            "Hai un amico su unbottled.ai? Inserisci il loro codice per supportarli. Sono stati ricompensati per averti fatto entrare.",
          placeholder: "Inserire il codice di riferimento (opzionale)",
          labelPrefilled: "Codice invito",
          descriptionPrefilled:
            "Chi ti ha invitato riceve un premio quando crei il tuo account.",
        },
        supportedSkillId: {
          label: "Sostieni un creator",
          description:
            "Con la tua registrazione, chi ha creato questa skill riceve un bonus del 5% sui tuoi abbonamenti.",
          selectorTitle: "Sostieni un creator",
          selectorDescription:
            "Hai aggiunto ai preferiti alcune skill di creator indipendenti. Scegli chi sostenere: riceverà il 5% in più sui tuoi abbonamenti. Puoi cambiare scelta quando vuoi.",
          selectorNone: "Nessuno (salta)",
        },
        localFavorites: {
          label: "Preferiti locali",
        },
      },

      footer: {
        alreadyHaveAccount: "Hai già un account? Accedi",
      },
      errors: {
        title: "Errore di registrazione",
        validation: {
          title: "Errore di convalida",
          description: "Si prega di controllare il vostro input e riprovare",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        conflict: {
          title: "Conflitto dell'account",
          description: "Esiste già un account con questa email",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        internal: {
          title: "Errore interno",
          description: "Si è verificato un errore interno",
        },
      },
      emailCheck: {
        title: "Email Disponibilità Check",
        description:
          "Controllare se l'email è disponibile per la registrazione",
        tag: "Controllo email",
        fields: {
          email: {
            label: "Indirizzo email",
            description: "E-mail da controllare",
            placeholder: "Inserisci l'indirizzo email",
            validation: {
              invalid: "Formato e-mail non valido",
            },
          },
        },
        response: {
          title: "Email Check Risposta",
          description: "Verificare il risultato della disponibilità",
          available: "E-mail disponibile",
          message: "Messaggio di disponibilità",
        },
        errors: {
          validation: {
            title: "E-mail non valida",
            description: "Si prega di inserire un indirizzo email valido",
          },
          internal: {
            title: "Errore di controllo e-mail",
            description: "Controllare l'errore e la disponibilità",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          conflict: {
            title: "E-mail già presa",
            description: "Questa e-mail è già registrata",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di controllare questa email",
          },
          network: {
            title: "Errore di rete",
            description:
              "Errore di rete si è verificato durante il controllo e-mail",
          },
          notFound: {
            title: "Servizio non trovato",
            description: "Il servizio di email check non è disponibile",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Autenticazione necessaria per controllare e-mail",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
        },
        success: {
          title: "Controllo e-mail completo",
          description: "La disponibilità e-mail verificata con successo",
        },
      },
      post: {
        title: "Firma",
        description: "Punto di arrivo dell'iscrizione",
        form: {
          title: "Configurazione di registrazione",
          description: "Configurare i parametri di registrazione",
        },
        response: {
          title: "Risposta",
          description: "Dati di risposta all'iscrizione",
          success: "Registrazione Successo",
          message: "Messaggio di stato",
          userId: "Utente ID",
          nextSteps: "Prossimo passo",
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
          server: {
            title: "Errore del server",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
          processing: "Registrazione di elaborazione con successo",
        },
      },
      response: {
        title: "Risposta",
        description: "Dati di risposta all'iscrizione",
        success: "Registrazione Successo",
        message: "Messaggio di stato",
        user: {
          id: "Utente ID",
          email: "Indirizzo email",
          firstName: "Nome",
          lastName: "Ultimo nome",
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          imageUrl: "Immagine del profilo URL",
          verificationRequired: "Verifica richiesta",
        },
        verificationInfo: {
          title: "Verifica Email",
          description: "Dettagli sul processo di verifica e-mail",
          emailSent: "Invia un'email",
          expiresAt: "Escursione di verifica",
          checkSpamFolder: "Controllare la cartella Spam",
        },
        nextSteps: "Prossimo passo",
      },
      success: {
        title: "Registrazione Successo",
        description: "Il tuo account è stato creato con successo",
      },
      admin_notification: {
        title: "Nuova acquisizione utente",
        subject: "Nuova registrazione di {{privateName}}",
        preview: "{{privateName}} si è appena registrato",
        message: "C’è un nuovo utente su {{appName}}",
        privateName: "Nome privato",
        publicName: "Nome pubblico",
        email: "Email",
        locale: "Lingua",
        creditBalance: "Saldo crediti",
        leadCreditBalance: "Saldo crediti del contatto",
        signup_preferences: "Preferenze di iscrizione",
        user_details: "Dettagli utente",
        basic_information: "Informazioni di base",
        signup_type: "Tipo di iscrizione",
        direct_signup: "Registrazione diretta",
        newsletter: "Newsletter",
        subscribed: "Iscritto",
        not_subscribed: "Non sottoscritto",
        signup_details: "Dettagli di iscrizione",
        signup_date: "Data di iscrizione",
        user_id: "Utente ID",
        recommended_next_steps: "Prossimo passo consigliato",
        direct_recommendation:
          "Verifica profilo utente e configurazione di pagamento",
        contact_user: "Contatta l'utente",
        footer: "Notifica automatica di {{appName}}",
      },
      email: {
        subject: "Ci sei. {{appName}} è pronto per te",
        previewText:
          "Ciao {{privateName}}, il tuo account è pronto. Chatta con Claude, GPT, Gemini, DeepSeek e altri {{modelCount}} modelli. Gratis, senza carta di credito.",
        headline: "La tua IA ti aspetta.",
        greeting: "Ciao {{privateName}},",
        intro:
          "Benvenuto su {{appName}}. Tutto quello che apprezzi di ChatGPT, più modelli open source e senza filtri sui contenuti. Un solo account, tutto nello stesso posto.",
        models: {
          title: "{{modelCount}} modelli in 3 categorie",
          mainstream: "Convenzionale",
          open: "Open source",
          uncensored: "Senza censura",
        },
        free: {
          title: "Cosa hai gratis, per sempre:",
          credits:
            "Crediti gratuiti {{freeCreditsSignedIn}} ogni mese, {{freeCreditsMax}} con la newsletter. Niente carta.",
          allModels: "Accesso a tutti i {{modelCount}} modelli di IA",
          uncensored: "Modelli senza censura che rispondono alle tue domande",
          chatModes: "Chat private, in incognito, condivise e pubbliche",
          noCard: "Nessuna carta di credito. Mai.",
        },
        ctaButton: "Inizia a chattare",
        upgrade: {
          title: "Vuoi di più?",
          desc: "I piani partono da {{subscriptionPrice}} al mese per {{subscriptionCredits}} crediti e arrivano a {{ultraCredits}} crediti per {{ultraPrice}}. Con un abbonamento puoi acquistare pacchetti di crediti senza scadenza.",
          cta: "Scopri i piani",
        },
        signoff: "Buone chat,\nIl team di {{appName}}",
        ps: "P.S. Con la modalità in incognito, le conversazioni restano solo sul tuo dispositivo. Non le salviamo mai sui nostri server. Per motivi tecnici, i contenuti multimediali generati vengono salvati temporaneamente.",
      },
      emailTemplates: {
        welcome: {
          name: "Email di benvenuto",
          description:
            "Email di benvenuto inviata agli utenti dopo la registrazione di successo",
          category: "Autenticazione",
          preview: {
            privateName: {
              label: "Nome privato",
              description: "Il nome privato dell'utente",
            },
            userId: {
              label: "Utente ID",
              description: "L'identificatore unico dell'utente",
            },
            leadId: {
              label: "ID del contatto",
              description: "L'identificatore di contatto dell'utente",
            },
          },
        },
        adminSignup: {
          name: "Notifica di iscrizione di Admin Email",
          description:
            "Email inviata agli amministratori quando un nuovo utente registra",
          category: "Administration",
          preview: {
            privateName: {
              label: "Nome privato",
            },
            publicName: {
              label: "Nome pubblico",
            },
            email: {
              label: "Indirizzo email",
            },
            userId: {
              label: "Utente ID",
            },
            subscribeToNewsletter: {
              label: "Abbonamento Newsletter",
            },
          },
        },
      },
    },
  },
  search: {
    category: "Utenti",

    title: "Ricerca utente",
    description: "Ricerca per utenti",
    tag: "Ricerca utente",
    container: {
      title: "Contenitore di ricerca",
      description: "Contenitore di ricerca utente",
    },
    groups: {
      searchCriteria: {
        title: "Criteri di ricerca",
        description: "Definire i parametri di ricerca",
      },
      filters: {
        title: "Filtri avanzati",
        description: "Ulteriori opzioni di filtraggio",
      },
      pagination: {
        title: "Pagina",
        description: "Controllare come i risultati sono impaginati",
      },
    },
    fields: {
      search: {
        label: "Ricerca di Query",
        description: "Inserisci i termini di ricerca",
        placeholder: "Cerca utenti...",
        help: "Ricerca per nome, e-mail o società",
        validation: {
          minLength: "La ricerca deve essere almeno 2 caratteri",
        },
      },
      roles: {
        label: "Ruoli utente",
        description: "Filtra per ruoli utente",
        placeholder: "Seleziona i ruoli...",
        help: "Selezionare uno o più ruoli da filtrare",
      },
      status: {
        label: "Stato dell'utente",
        description: "Filtra per lo stato dell'utente",
        placeholder: "Selezionare lo stato...",
        help: "Filtra con attivo, inattivo o tutti gli utenti",
      },
      limit: {
        label: "Limite",
        description: "Numero massimo di risultati",
        help: "Specificare quanti risultati da restituire (default: 10)",
      },
      offset: {
        label: "Offset",
        description: "Numero di risultati per saltare",
        help: "Specificare l'offset della paginazione (default: 0)",
      },
    },
    status: {
      active: "Attivo",
      inactive: "Inattivo",
      all: "Tutti",
    },
    response: {
      title: "Risultati della ricerca",
      description: "Risultati della ricerca utente",
      success: {
        badge: "Operazione riuscita",
      },
      message: {
        content: "Messaggio dei risultati di ricerca",
      },
      searchInfo: {
        title: "Informazioni di ricerca",
        description: "Dettagli sull'operazione di ricerca",
        searchTerm: "Termine di ricerca",
        appliedFilters: "Filtri applicati",
        searchTime: "Tempo di ricerca",
        totalResults: "Risultati totali",
      },
      pagination: {
        title: "Info su Pagina",
        description: "Informazioni sulla navigazione pagina",
        currentPage: "Pagina corrente",
        totalPages: "Pagine totali",
        itemsPerPage: "Articoli per pagina",
        totalItems: "Totale articoli",
        hasMore: "Ha di più",
        hasPrevious: "Ha precedenti",
      },
      actions: {
        title: "Azioni disponibili",
        description: "Azioni che puoi eseguire sui risultati",
        type: "Tipo di azione",
        label: "Azione",
        href: "Link",
      },
      users: {
        label: "Utenti trovati",
        description: "Elenco degli utenti corrispondenti",
        item: {
          title: "Utente",
          description: "Informazioni sull'account utente",
        },
        id: "Utente ID",
        leadId: "ID del contatto",
        isPublic: "Pubblico",
        firstName: "Nome",
        lastName: "Ultimo nome",
        privateName: "Nome privato",
        publicName: "Nome pubblico",
        company: "Società",
        email: "Email",
        imageUrl: "Avatar",
        isActive: "Attivo",
        emailVerified: "E-mail verificato",
        requireTwoFactor: "2FA richiesto",
        marketingConsent: "Consenso di marketing",
        userRoles: {
          item: {
            title: "Role",
            description: "Assegnazione del ruolo dell'utente",
          },
          id: "Role ID",
          role: "Role",
        },
        createdAt: "Creato",
        updatedAt: "Aggiornato",
      },
    },
    columns: {
      firstName: "Nome",
      lastName: "Ultimo nome",
      privateName: "Nome privato",
      publicName: "Nome pubblico",
      email: "Email",
      company: "Società",
      userRoles: "Roles",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di ricerca non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Ricerca non autorizzata",
      },
      internal: {
        title: "Errore interno",
        description: "Errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun utente trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Il conflitto di ricerca si è verificato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Le modifiche non sono state salvate",
      },
    },
    success: {
      title: "Ricerca di successo",
      description: "Ricerca completata con successo",
    },
    post: {
      title: "Cerca",
      description: "Punto di arrivo",
      form: {
        title: "Configurazione di ricerca",
        description: "Configurare i parametri di ricerca",
      },
      response: {
        title: "Risposta",
        description: "Dati di risposta alla ricerca",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
  },
  "session-cleanup": {
    category: "Utenti",

    post: {
      title: "Pulizie di sessione",
      description: "Pulire le sessioni e i gettoni degli utenti scaduti",
      tag: "Pulizie di sessione",
      container: {
        title: "Pulizie di sessione",
        description: "Configurare e eseguire la pulizia della sessione",
      },
      fields: {
        sessionRetentionDays: {
          label: "Giorni di conservazione della sessione",
          description: "Numero di giorni per mantenere le sessioni",
        },
        tokenRetentionDays: {
          label: "Giorni di conservazione dei token",
          description: "Numero di giorni per conservare i token",
        },
        batchSize: {
          label: "Dimensione della batch",
          description: "Numero di record da elaborare per lotto",
        },
        dryRun: {
          label: "Correre a secco",
          description: "Correre senza effettivamente cancellare i record",
        },
      },
      response: {
        sessionsDeleted: "Sessioni cancellate",
        tokensDeleted: "Tokens Cancellati",
        totalProcessed: "Totale processato",
        executionTimeMs: "Tempo di esecuzione (ms)",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Devi essere un amministratore per eseguire la pulizia della sessione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        server: {
          title: "Errore del server",
          description: "Errore del server interno durante la pulizia",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Configurazione di pulizia non valida",
        },
      },
      success: {
        title: "Pulizia sessione completata",
        description: "Sessioni e gettoni puliti con successo",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Pulire le sessioni utente scadute per mantenere la sicurezza del sistema",
      purpose:
        "Rimuove le sessioni scadute per mantenere la sicurezza e le prestazioni",
      impact:
        "Migliora le prestazioni e la sicurezza del sistema rimuovendo i dati di sessione stanti",
      rollback: "Rollback non applicabile per le operazioni di pulizia",
    },
    errors: {
      default: "Si è verificato un errore durante la pulizia della sessione",
      execution_failed: {
        title: "Pulizia sessione non riuscita",
        description: "Non pulire sessioni scadute",
      },
      partial_failure: {
        title: "Fallimento parziale di pulizia della sessione",
        description: "Alcune sessioni non potevano essere ripulite",
      },
      unknown_error: {
        title: "Errore di pulizia sessione sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la pulizia della sessione",
      },
      invalid_session_retention: {
        title: "Ritenzione della sessione non valida",
        description:
          "Periodo di conservazione della sessione non valido specificato",
      },
      invalid_token_retention: {
        title: "Invalid Token Retenzione",
        description:
          "Periodo di conservazione dei token non valido specificato",
      },
      invalid_batch_size: {
        title: "Dimensione della bacca non valida",
        description:
          "Dimensione del lotto non valido specificata per la pulizia",
      },
      validation_failed: {
        title: "Convalida non riuscita",
        description:
          "La convalida della configurazione di pulizia sessione non è riuscita",
      },
    },
    success: {
      title: "Pulizia sessione completata",
      description: "Ripulito con successo le sessioni scadute",
    },
    monitoring: {
      alertTrigger: "Il compito di pulizia della sessione è fallito",
    },
    documentation: {
      overview:
        "Questa attività rimuove le sessioni degli utenti scadute dal sistema per mantenere la sicurezza e le prestazioni",
    },
  },
  sessionCleanup: {
    category: "Utenti",

    post: {
      title: "Pulizie di sessione",
      description: "Pulire le sessioni e i gettoni degli utenti scaduti",
      tag: "Pulizie di sessione",
      container: {
        title: "Pulizie di sessione",
        description: "Configurare e eseguire la pulizia della sessione",
      },
      fields: {
        sessionRetentionDays: {
          label: "Giorni di conservazione della sessione",
          description: "Numero di giorni per mantenere le sessioni",
        },
        tokenRetentionDays: {
          label: "Giorni di conservazione dei token",
          description: "Numero di giorni per conservare i token",
        },
        batchSize: {
          label: "Dimensione della batch",
          description: "Numero di record da elaborare per lotto",
        },
        dryRun: {
          label: "Correre a secco",
          description: "Correre senza effettivamente cancellare i record",
        },
      },
      response: {
        sessionsDeleted: "Sessioni cancellate",
        tokensDeleted: "Tokens Cancellati",
        totalProcessed: "Totale processato",
        executionTimeMs: "Tempo di esecuzione (ms)",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Devi essere un amministratore per eseguire la pulizia della sessione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        server: {
          title: "Errore del server",
          description: "Errore del server interno durante la pulizia",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Configurazione di pulizia non valida",
        },
      },
      success: {
        title: "Pulizia sessione completata",
        description: "Sessioni e gettoni puliti con successo",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Pulire le sessioni utente scadute per mantenere la sicurezza del sistema",
      purpose:
        "Rimuove le sessioni scadute per mantenere la sicurezza e le prestazioni",
      impact:
        "Migliora le prestazioni e la sicurezza del sistema rimuovendo i dati di sessione stanti",
      rollback: "Rollback non applicabile per le operazioni di pulizia",
    },
    errors: {
      default: "Si è verificato un errore durante la pulizia della sessione",
      execution_failed: {
        title: "Pulizia sessione non riuscita",
        description: "Non pulire sessioni scadute",
      },
      partial_failure: {
        title: "Fallimento parziale di pulizia della sessione",
        description: "Alcune sessioni non potevano essere ripulite",
      },
      unknown_error: {
        title: "Errore di pulizia sessione sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la pulizia della sessione",
      },
      invalid_session_retention: {
        title: "Ritenzione della sessione non valida",
        description:
          "Periodo di conservazione della sessione non valido specificato",
      },
      invalid_token_retention: {
        title: "Invalid Token Retenzione",
        description:
          "Periodo di conservazione dei token non valido specificato",
      },
      invalid_batch_size: {
        title: "Dimensione della bacca non valida",
        description:
          "Dimensione del lotto non valido specificata per la pulizia",
      },
      validation_failed: {
        title: "Convalida non riuscita",
        description:
          "La convalida della configurazione di pulizia sessione non è riuscita",
      },
    },
    success: {
      title: "Pulizia sessione completata",
      description: "Ripulito con successo le sessioni scadute",
    },
    monitoring: {
      alertTrigger: "Il compito di pulizia della sessione è fallito",
    },
    documentation: {
      overview:
        "Questa attività rimuove le sessioni degli utenti scadute dal sistema per mantenere la sicurezza e le prestazioni",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Non trovavano ruoli utente",
      batch_find_failed: "Non riuscita a trovare ruoli utente in batch",
      not_found: "Il ruolo dell'utente non trovato",
      lookup_failed: "Non riuscito a cercare il ruolo dell'utente",
      add_failed: "Non è stato possibile aggiungere un ruolo all'utente",
      no_data_returned: "Il database non ha restituito dati",
      remove_failed: "Non riuscito a rimuovere il ruolo dall'utente",
      check_failed: "Non controlla se l'utente ha un ruolo",
      delete_failed: "Non riuscita a eliminare i ruoli dell'utente",
      endpoint_not_created:
        "L’endpoint per i ruoli utente non è ancora disponibile",
    },
    post: {
      title: "Ruoli utente",
      description: "Endpoint dei ruoli utente",
      form: {
        title: "Configurazione dei ruoli utente",
        description: "Imposta i parametri dei ruoli utente",
      },
      response: {
        title: "Risposta",
        description: "Dati restituiti per i ruoli utente",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
        database_connection_failed: {
          title: "Connessione al database fallita",
          description: "Impossibile connettersi al database",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
    enums: {
      userRole: {
        public: "Pubblico",
        customer: "Cliente",
        partnerAdmin: "Amministratore partner",
        partnerEmployee: "Collaboratore partner",
        admin: "Amministratore",
        cliOff: "CLI disattivata",
        cliAuthBypass: "CLI senza autenticazione",
        aiToolOff: "Strumento IA disattivato",
        webOff: "Web disattivato",
        mcpOff: "MCP disattivato",
        mcpVisible: "Visibile in MCP",
        productionOff: "Disattivato in produzione",
        skillOff: "Skill disattivata",
      },
    },
  },
  profileVisibility: {
    public: "Pubblico",
    private: "Privato",
    contactsOnly: "Contatti Solo",
  },
  contactMethods: {
    email: "Email",
    phone: "Telefono",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Luce",
    dark: "Oscuro",
    system: "Sistema",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Completato",
  },
  language: {
    it: "Italiano",
    es: "Spagnolo",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "America/New_York",
    america_los_angeles: "America/Los_Angeles",
    europe_london: "Europa/Londra",
    europe_berlin: "Europa/Berlino",
    europe_warsaw: "Europa/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "L'indirizzo email è già in uso",
    locale_required: "Locale è richiesto",
    auth_required: "È richiesta l'autenticazione. Uno dei ruoli: {{roles}}",
    auth_retrieval_failed: "Non recuperato l'autenticazione: {{error}}",
    not_found: "Utente non trovato",
    not_found_by_id: "Nessun utente trovato con ID {{userId}}",
    not_found_by_email: "Nessun utente trovato con e-mail {{email}}",
    roles_lookup_failed: "Non ha cercato ruoli per l'utente {{userId}}",
    roles_batch_fetch_failed:
      "Non riuscita a batch di lavoro per gli utenti {{count}}",
    id_lookup_failed: "Impossibile cercare l'utente {{userId}}: {{error}}",
    email_lookup_failed:
      "Non è riuscito a cercare l'utente per e-mail {{email}}: {{error}}",
    email_check_failed: "Non controlla l'e-mail {{email}}: {{error}}",
    email_duplicate_check_failed:
      "Non controlla l'email {{email}} contro altri utenti (escluso {{excludeUserId}}): {{error}}",
    search_failed: "Non ricercato per {{query}}: {{error}}",
    list_failed: "Non elencare gli utenti: {{error}}",
    email_already_in_use: "L'indirizzo email è già in uso",
    creation_failed: "Non creato utente: {{error}}",
    no_data_returned: "Il database non ha restituito dati",
    password_hashing_failed:
      "Non è possibile utilizzare la password di hash per {{email}}: {{error}}",
    not_implemented_on_native:
      "Questa funzione non è implementata su React Native",
    count_failed: "Non riuscito a ottenere il numero dell'utente: {{error}}",
  },
  userNoteType: {
    note: "Nota",
    call: "Chiamata",
    email: "Email",
    meeting: "Riunione",
    task: "Compiti",
  },
  notifications: {
    profileUpdated: {
      title: "Profilo aggiornato",
      description: "Il tuo profilo è stato aggiornato con successo",
    },
    updateFailed: {
      title: "Aggiornamento non corretto",
      description: "Non ha aggiornato il tuo profilo. Per favore, riprovate.",
    },
  },
};
