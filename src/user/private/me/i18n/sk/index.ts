import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes
  get: {
    title: "Načítať profil používateľa",
    titleShort: "Môj profil",
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
      pendingEmail: "E-mail čakajúci na potvrdenie",
      requireTwoFactor: "Vyžaduje sa dvojfaktorové overenie",
      marketingConsent: "Súhlas s marketingom",
      userRoles: "Roly používateľa",
      roles: "Roly",
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
        title: "Chyba overenia",
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
        detail: "Nepodarilo sa nájsť tvoj profil (používateľ {{userId}})",
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
        description: "Máte neuložené zmeny",
      },
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba servera",
        detail:
          "Tvoj profil sa nepodarilo načítať: {{error}} (používateľ {{userId}})",
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
    titleShort: "Upraviť profil",
    description: "Zmeniť údaje v profile prihláseného používateľa",
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
        description:
          "Adresa na prihlásenie. Nová adresa začne platiť až po kliknutí na odkaz, ktorý na ňu pošleme.",
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
        label: "Firma",
        description: "Názov tvojej firmy",
        placeholder: "Zadaj názov firmy",
        help: "Názov tvojej firmy sa zobrazí v profile",
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
      pendingEmail: "E-mail čakajúci na potvrdenie",
      emailChangePending:
        "Zmenu dokončíš odkazom, ktorý sme poslali na {{email}}. Dovtedy sa prihlasuj s adresou {{current}}.",
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
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
        emailTaken: "Túto e-mailovú adresu už používa iný účet",
        disposableEmail:
          "Použi trvalú e-mailovú adresu. Jednorazové schránky nepodporujeme.",
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
        detail: "Profil na úpravu sa nenašiel (používateľ {{userId}})",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt údajov",
        creatorSlugTaken: "Táto časť adresy profilu sa už používa. Vyber inú.",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba servera",
        detail:
          "Tvoj profil sa nepodarilo uložiť: {{error}} (používateľ {{userId}})",
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
    titleShort: "Odstrániť účet",
    description: "Natrvalo odstráň svoj používateľský účet",
    response: {
      title: "Stav odstránenia",
      description: "Potvrdenie odstránenia účtu",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
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
        detail: "Účet na odstránenie sa nenašiel (používateľ {{userId}})",
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
        description: "Máte neuložené zmeny",
      },
      billingCancelFailed:
        "Predplatné sa nepodarilo zrušiť, preto sme účet neodstránili. Platby by inak bežali ďalej. Skús to znova alebo najprv zruš predplatné v časti Predplatné.",
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba servera",
        detail:
          "Tvoj účet sa nepodarilo odstrániť: {{error}} (používateľ {{userId}})",
        retry:
          "Účet sa nepodarilo odstrániť. Skús to znova. Ak sa to opakuje, obráť sa na podporu.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
    success: {
      title: "Úspech",
      description: "Účet bol odstránený",
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
    newsletter: {
      title: "Odber noviniek",
      subtitle:
        "Novinky e-mailom a každý mesiac ďalších {{bonusCredits}} kred. zdarma",
      subtitleNeutral: "Nové modely a novinky z aplikácie priamo v schránke",
    },
    loadState: {
      loading: "Načítava sa…",
      profileFailed: "Profil sa nepodarilo načítať.",
      creditsFailed: "Zostatok sa nepodarilo načítať. Ťukni a skús znova.",
      retry: "Skúsiť znova",
    },
    save: "Uložiť profil",
    saving: "Ukladá sa…",
    editProfile: "Upraviť profil",
    changePhoto: "Zmeniť fotku",
    cancelEdit: "Zrušiť",
    memberSince: "Účet od",
    stats: {
      plan: "Plán",
      credits: "Kredity",
      member: "Účet od",
    },
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
        "Získavaj odberateľov zo stránok zručností a profilu. Zoznam patrí tebe, bez sprostredkovateľa.",
      manage: "Spravovať",
    },
    previewCard: {
      title: "Tvoj verejný profil",
      description: "Ako ťa vidia ostatní",
    },
    noPreview: "Vyplň profil a zobrazí sa jeho náhľad",
    noSocials: "Zatiaľ bez odkazov na sociálne siete",
    viewPublicProfile: "Zobraziť verejný profil",
    profileUrl: "Tvoj odkaz",
    verifyNudge: {
      title: "Potvrď e-mail",
      description:
        "Odkaz sme poslali na {{email}}. Čet môžeš používať aj bez potvrdenia. Potvrdením adresy si zachováš možnosť obnoviť prístup k účtu.",
      action: "Poslať odkaz znova",
    },
    pendingEmail: {
      title: "Zmena e-mailu čaká na potvrdenie",
      description:
        "Klikni na odkaz, ktorý sme poslali na {{email}}. Dovtedy sa prihlasuj s adresou {{current}}. Opätovným uložením vyžiadaš nový odkaz. Ak chceš zmenu zrušiť, ulož pôvodnú adresu.",
    },
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
      hubSubtitle: "Počet zverejnených: {{count}}",
    },
    appearance: {
      title: "Vzhľad",
      sectionHint: "Vzhľad a jazyk aplikácie.",
      theme: "Téma",
      themeHint:
        "Vyber svetlý alebo tmavý režim, prípadne sa riaď nastavením zariadenia. Voľba platí všade.",
      light: "Svetlý",
      dark: "Tmavý",
      system: "Podľa zariadenia",
      language: "Jazyk",
      languageHint: "Jazyk rozhrania a obsahu.",
    },
    chatPrefs: {
      title: "Čet",
      sectionHint: "Nastav si, ako pracuje asistent.",
      searchProvider: "Hľadanie na webe",
      searchProviderHint: "Vyhľadávač, ktorý spracuje tvoje dopyty.",
      automation: "Automatizácia na pozadí",
      automationHint: "Nechaj AI pracovať, kým si preč.",
      on: "Zapnuté",
      off: "Vypnuté",
    },
    nav: {
      logoutHint: "Odhlásiť sa na tomto zariadení",
      logout: "Odhlásiť sa",
      back: "Späť",
    },
    sections: {
      account: "Účet",
      accountHint: "Predplatné, fakturácia, bezpečnosť a tvoje údaje.",
      billingHint: "Predplatné, kredity a uložené adresy.",
      security: "Bezpečnosť",
      securityHint: "Zabezpeč svoj účet.",
      data: "Údaje a súkromie",
      dataHint: "O svojich údajoch rozhoduješ ty.",
      creatorHint: "Získaj viac odberateľov a zvýš svoje príjmy.",
      basics: "Základy",
      basicsHint: "Tvoje meno, prihlasovací e-mail a odber noviniek.",
      subscription: "Predplatné",
      subscriptionHint: "Predplatné ti každý mesiac pridá kredity.",
      manageSubscription: "Spravovať",
      noSubscription: "Bezplatný plán",
      upgrade: "Prejsť na vyšší plán",
      addresses: "Fakturačné adresy",
      addressCount: "Počet uložených adries: {{count}}",
      addAddress: "Pridať adresu",
      manageAddresses: "Spravovať",
      noAddresses: "Žiadne uložené adresy",
      billing: "Fakturácia",
      delivery: "Doručenie",
      edit: "Upraviť",
      credits: "Kredity",
      creditsAvailable: "k dispozícii",
      password: "Heslo",
      passwordHint: "Zmeniť heslo",
      sessions: "Aktívne relácie",
      emailVerification: "Overenie e-mailovej adresy",
      emailVerifiedHint: "Adresa je potvrdená",
      emailUnverifiedHint:
        "Potvrď svoju adresu. Ťuknutím si vyžiadaš nový odkaz.",
      verified: "Overené",
      unverified: "Neoverené",
      twoFactor: "Dvojfaktorové overenie",
      twoFactorHint: "Vyžadovať kód z overovacej aplikácie pri prihlásení",
      on: "Zapnuté",
      off: "Vypnuté",
      sessionsHint: "Zobraz prihlásené zariadenia a podľa potreby ich odhlás",
      apiKeys: "Kľúče API",
      apiKeysHint:
        "Používaj modely ({{modelCount}} na výber) vo vlastnom kóde, v Codexe alebo v Claude Code",
      exportData: "Exportovať moje údaje",
      exportDataHint:
        "Stiahni si kópiu všetkých údajov, ktoré o tebe uchovávame",
      creator: "Tvorca",
      referral: "Program odporúčaní",
      referralHint:
        "Získaj províziu z každej platby, ktorú prinesie tvoje odporúčanie",
    },
    deleteAccount: {
      dangerZone: "Nezvratné zmeny",
      dangerDescription:
        "Profil, čety, zručnosti, súbory a kredity sa natrvalo odstránia.",
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
      success: "Účet je odstránený. Presmerovanie…",
    },
  },

  // Sub-routes
  avatar: {
    category: "Profil používateľa",

    tag: "avatar",
    errors: {
      user_not_found: "Používateľ sa nenašiel",
      failed_to_upload_avatar: "Nepodarilo sa nahrať avatar",
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
      deleted: "Profilový obrázok bol odstránený",
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
          title: "Chyba overenia",
          description: "Nahraný súbor je neplatný alebo poškodený",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na nahratie profilového obrázka sa musíte prihlásiť",
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
          description: "Máte neuložené zmeny",
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
          title: "Chyba overenia",
          description:
            "Požiadavka na odstránenie profilového obrázka je neplatná",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na odstránenie profilového obrázka sa musíte prihlásiť",
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
          description: "Nemáte oprávnenie odstrániť tento profilový obrázok",
        },
        notFound: {
          title: "Nenájdené",
          description: "Profilový obrázok na odstránenie sa nenašiel",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
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
        title: "Chyba overenia",
        description: "Skontrolujte zadané údaje a skúste to znova",
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
          title: "Chyba overenia",
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
        conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
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
          label: "Firma",
          description: "Názov spoločnosti (nepovinné)",
          placeholder: "Vzor, s. r. o.",
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
          placeholder: "Hlavná 12",
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
          description: "Poštové smerovacie číslo",
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
          title: "Chyba overenia",
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
        conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
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
  emailChange: {
    subject: "Potvrď novú e-mailovú adresu pre {{appName}}",
    title: "Potvrď nový e-mail",
    previewText: "Jediným kliknutím začneš v {{appName}} používať túto adresu.",
    greeting: "Ahoj, {{name}},",
    body: "Požiadal si o zmenu prihlasovacej adresy v {{appName}} na túto adresu. Potvrď zmenu tlačidlom nižšie. Dovtedy sa do účtu prihlasuješ s adresou {{current}}.",
    button: "Potvrdiť nový e-mail",
    expiry:
      "Počet dní platnosti odkazu: {{days}}. Ak si o zmenu nežiadal, tento e-mail ignoruj. Nič sa nezmení.",
    signoff: "Tím {{appName}}",
    errors: {
      failed: "Potvrdzovací e-mail sa nepodarilo vytvoriť.",
    },
    template: {
      name: "Potvrdenie zmeny e-mailu",
      description: "Pri zmene e-mailovej adresy sa odošle na novú adresu",
      category: "Účet",
    },
  },
};
