import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes
  get: {
    title: "Ottieni il profilo utente",
    titleShort: "Il mio profilo",
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
      pendingEmail: "E-mail di pagamento",
      requireTwoFactor: "Autenticazione di due fattori richiesto",
      marketingConsent: "Consenso di marketing",
      userRoles: "Ruoli utente",
      roles: "Roles",
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
        detail:
          "Non siamo riusciti a trovare il tuo profilo (utente {{userId}})",
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
        detail:
          "Non è possibile caricare il tuo profilo: {{error}} (user {{userId}})",
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
    titleShort: "Profilo di aggiornamento",
    description: "Aggiornare le informazioni attuali del profilo utente",
    groups: {
      basicInfo: {
        title: "Informazioni di base",
        description: "Aggiorna le informazioni di base del tuo profilo",
      },
      profileDetails: {
        title: "Dettagli del profilo",
        description: "Gestione dei dati e delle impostazioni del tuo profilo",
      },
      privacySettings: {
        title: "Impostazioni sulla privacy",
        description: "Controlla chi può vedere le informazioni del tuo profilo",
      },
      profileInfo: {
        title: "Profilo del creatore",
        description: "Bio, social link e branding per le tue pagine di abilità",
      },
    },
    fields: {
      email: {
        label: "Indirizzo email",
        description:
          "Il tuo indirizzo di login. Un nuovo prende il controllo solo dopo aver cliccato sul link che inviamo ad esso.",
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
          minLength: "Il nome pubblico deve essere lungo almeno 2 caratteri",
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
        placeholder: "Jane-doe",
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
        description: "Banner immagine URL per il tuo eroe pagina di abilità",
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
      pendingEmail: "E-mail di pagamento",
      emailChangePending:
        "Quasi fatto. Fare clic sul link che abbiamo inviato a {{email}} per passare. Fino ad allora continui a registrarti con {{current}}.",
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
        emailTaken: "Quell'indirizzo email appartiene già ad un altro account",
        disposableEmail:
          "Le caselle di posta non sono autorizzate. Utilizzare un indirizzo e-mail permanente.",
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
        detail:
          "Non siamo riusciti a trovare il tuo profilo per aggiornare (utente {{userId}})",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
        creatorSlugTaken:
          "Quella maniglia del creatore è già presa - scegli un altro",
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
        detail:
          "Non è possibile salvare il profilo: {{error}} (utente {{userId}})",
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
    titleShort: "Eliminare il conto",
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
        detail:
          "Non siamo riusciti a trovare il tuo account da cancellare (utente {{userId}})",
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
      billingCancelFailed:
        "Non potevamo cancellare l'abbonamento, quindi il tuo account era NOT cancellato - altrimenti continueresti a essere fatturato. Prova di nuovo, o cancella la fatturazione sotto abbonamento prima.",
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore interno del server",
        detail:
          "Non è possibile eliminare il tuo account: {{error}} (utente {{userId}})",
        retry:
          "Non è possibile cancellare il tuo account. Riprova - se continua a fallire, il supporto di contatto.",
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
    newsletter: {
      title: "Newsletter",
      subtitle:
        "Aggiornamenti nella tua casella di posta, più {{bonusCredits}} crediti extra gratuiti al mese",
      subtitleNeutral:
        "Nuovi modelli e gocce di prodotto, nella tua casella di posta",
    },
    loadState: {
      loading: "Caricamento...",
      profileFailed: "Il tuo profilo non si e' caricato.",
      creditsFailed: "Impossibile caricare il saldo. Tocca per riprovare.",
      retry: "Riprova",
    },
    save: "Salva il profilo",
    saving: "Salvare...",
    editProfile: "Modifica profilo",
    changePhoto: "Cambia foto",
    cancelEdit: "Annulla",
    memberSince: "Membro dal",
    stats: {
      plan: "Piano",
      credits: "Crediti",
      member: "Membro dal",
    },
    profileCard: {
      title: "Profilo del creatore",
      description: "La tua identità pubblica attraverso la piattaforma",
    },
    socialCard: {
      title: "Link sociali",
      description: "Collegare le piattaforme",
    },
    emailCard: {
      title: "I tuoi indirizzi email",
      description:
        "Raccogliere gli abbonati dalle vostre abilità e profilo. La tua lista, nessun intermediario.",
      manage: "Gestisci",
    },
    previewCard: {
      title: "Il tuo profilo pubblico",
      description: "Come gli altri ti vedono",
    },
    noPreview: "Compila il tuo profilo per vedere un'anteprima",
    noSocials: "Nessun link sociale aggiunto ancora",
    viewPublicProfile: "Visualizza il profilo pubblico",
    profileUrl: "Il tuo link",
    verifyNudge: {
      title: "Conferma la tua email",
      description:
        "Abbiamo inviato un link a {{email}}. Chatta funziona in entrambi i casi. Confermare mantiene il tuo account recuperabile.",
      action: "Invia di nuovo il link",
    },
    pendingEmail: {
      title: "Cambio di indirizzo in attesa di conferma",
      description:
        "Apri il link che abbiamo inviato a {{email}}. Fino ad allora accedi con {{current}}. Salva di nuovo per ricevere un altro link oppure salva l’indirizzo attuale per annullare la modifica.",
    },
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
      hubSubtitle: "{{count}} pubblicato",
    },
    appearance: {
      title: "Aspetto",
      sectionHint: "Come l'app sembra e legge.",
      theme: "Tema",
      themeHint:
        "Leggera, scura, o corrisponde al tuo dispositivo. Riguarda ovunque.",
      light: "Luce",
      dark: "Oscuro",
      system: "Sistema",
      language: "Lingua",
      languageHint: "Interfaccia e lingua dei contenuti.",
    },
    chatPrefs: {
      title: "Chat",
      sectionHint: "Sintonizzare come funziona l'assistente.",
      searchProvider: "Ricerca web",
      searchProviderHint: "Quale motore risponde alle tue ricerche.",
      automation: "Automazione dello sfondo",
      automationHint: "Lascia che lo AI funzioni mentre sei via.",
      on: "Attivi",
      off: "Disattivati",
    },
    nav: {
      logoutHint: "Iscriviti a questo dispositivo",
      logout: "Effettua il login",
      back: "Indietro",
    },
    sections: {
      account: "Account",
      accountHint: "Pianifica, fatturazione, sicurezza e dati.",
      billingHint: "Pianifica, crediti e indirizzi salvati.",
      security: "Sicurezza",
      securityHint: "Tieni il tuo account chiuso.",
      data: "Dati e privacy",
      dataHint: "I tuoi dati, la tua chiamata.",
      creatorHint: "Crescete il vostro pubblico e il vostro reddito.",
      basics: "Principi di base",
      basicsHint: "Il tuo nome, email di login e aggiornamenti.",
      subscription: "Abbonamento",
      subscriptionHint: "Iscriviti per crediti mensili.",
      manageSubscription: "Gestisci",
      noSubscription: "Piano libero",
      upgrade: "Aggiornamento",
      addresses: "Indirizzi di fatturazione",
      addressCount: "{{count}} salvato",
      addAddress: "Aggiungi indirizzo",
      manageAddresses: "Gestisci",
      noAddresses: "Nessuno salvato",
      billing: "Fatturazione",
      delivery: "Consegna",
      edit: "Modifica",
      credits: "Crediti",
      creditsAvailable: "disponibile",
      password: "Password",
      passwordHint: "Modifica la password",
      sessions: "Sessioni attive",
      emailVerification: "Verifica e-mail",
      emailVerifiedHint: "Il tuo indirizzo è confermato",
      emailUnverifiedHint:
        "Conferma il tuo indirizzo. Tocca per rivendere il link",
      verified: "Verificato",
      unverified: "Unverified",
      twoFactor: "Autenticazione a due fattori",
      twoFactorHint: "Richiedere un codice app al momento dell'accesso",
      on: "Attivi",
      off: "Disattivati",
      sessionsHint: "Vedere ogni dispositivo e firmarli",
      apiKeys: "chiavi API",
      apiKeysHint: "Modelli {{modelCount}} nel codice, Codex o Claude",
      exportData: "Esporta i miei dati",
      exportDataHint: "Scarica una copia di tutto ciò che teniamo",
      creator: "Creatore",
      referral: "Programma di riferimento",
      referralHint: "Guadagna da ogni pagamento che porti",
    },
    deleteAccount: {
      dangerZone: "Zona di pericolo",
      dangerDescription:
        "Andato per il bene: profilo, chat, competenze, file, crediti.",
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
          description: "Un conflitto si è verificato durante il caricamento",
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
          description: "La richiesta di cancellazione dell'avatar è invalida",
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
          description: "Un conflitto si è verificato durante la cancellazione",
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
        minLength: "La conferma della password deve essere almeno 8 caratteri",
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
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
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
        city: { label: "Città", description: "Città", placeholder: "Berlino" },
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
          description: "Utilizzare come indirizzo di fatturazione predefinito",
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
        notFound: { title: "Non trovato", description: "Utente non trovato" },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
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
  emailChange: {
    subject: "Conferma la tua nuova email per {{appName}}",
    title: "Conferma la tua nuova email",
    previewText: "Con un clic, {{appName}} passa a questo indirizzo.",
    greeting: "Ciao {{name}},",
    body: "Hai chiesto di usare questo indirizzo per accedere a {{appName}}. Premi il pulsante qui sotto per confermare. Fino ad allora, il tuo account continuerà a usare {{current}}.",
    button: "Conferma la nuova email",
    expiry:
      "Il link è valido per {{days}} giorni. Se non hai chiesto tu la modifica, ignora questa email e il tuo indirizzo resterà lo stesso.",
    signoff: "Il team di {{appName}}",
    errors: {
      failed: "Non è possibile costruire l'e-mail di conferma.",
    },
    template: {
      name: "Conferma del cambio di indirizzo email",
      description: "Invio al nuovo indirizzo quando un utente cambia email",
      category: "Account",
    },
  },
};
