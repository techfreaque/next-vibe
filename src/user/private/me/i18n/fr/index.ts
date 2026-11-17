import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes
  get: {
    title: "Obtenir le profil utilisateur",
    titleShort: "Mon profil",
    description: "Récupérer les informations du profil de l'utilisateur actuel",
    response: {
      title: "Réponse du profil utilisateur",
      description: "Données du profil de l'utilisateur actuel",
      id: "ID utilisateur",
      leadId: "ID du prospect",
      isPublic: "Profil public",
      email: "Adresse e-mail",
      privateName: "Nom privé",
      publicName: "Nom public",
      locale: "Langue et région",
      isActive: "Statut actif",
      emailVerified: "E-mail vérifié",
      requireTwoFactor: "Authentification à deux facteurs requise",
      marketingConsent: "Consentement marketing",
      userRoles: "Rôles de l'utilisateur",
      roles: "Rôles",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
      stripeCustomerId: "ID client Stripe",
      bio: "Bio",
      websiteUrl: "Site web",
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
      creatorSlug: "Identifiant du profil",
      creatorAccentColor: "Couleur d'accent",
      creatorHeaderImageUrl: "Image d'en-tête",
      avatarUrl: "Avatar",
      user: {
        title: "Informations utilisateur",
        description: "Détails du profil utilisateur",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Profil utilisateur introuvable",
        detail: "Impossible de trouver votre profil (utilisateur {{userId}})",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
        detail:
          "Impossible de charger votre profil : {{error}} (utilisateur {{userId}})",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: {
      title: "Succès",
      description: "Profil récupéré",
    },
  },
  update: {
    title: "Modifier le profil utilisateur",
    titleShort: "Modifier le profil",
    description: "Modifier les informations du profil de l'utilisateur actuel",
    groups: {
      basicInfo: {
        title: "Informations de base",
        description: "Modifiez les informations de base de votre profil",
      },
      profileDetails: {
        title: "Détails du profil",
        description: "Gérez les détails et paramètres de votre profil",
      },
      privacySettings: {
        title: "Confidentialité",
        description:
          "Choisissez qui peut voir les informations de votre profil",
      },
      profileInfo: {
        title: "Profil de créateur",
        description:
          "Bio, liens sociaux et identité visuelle de vos pages de compétences",
      },
    },
    fields: {
      email: {
        label: "Adresse e-mail",
        description: "Votre adresse e-mail",
        placeholder: "Saisissez votre adresse e-mail",
        help: "Votre adresse e-mail sert aux notifications et aux échanges liés à votre compte",
        validation: {
          invalid: "Veuillez saisir une adresse e-mail valide",
        },
      },
      privateName: {
        label: "Nom privé",
        description: "Votre nom interne/privé",
        placeholder: "Saisissez votre nom privé",
        help: "Votre nom privé est utilisé en interne et pour les échanges privés",
        validation: {
          minLength: "Le nom privé doit contenir au moins 2 caractères",
          maxLength: "Le nom privé ne peut pas dépasser 50 caractères",
        },
      },
      publicName: {
        label: "Nom public",
        description: "Votre nom d'affichage public",
        placeholder: "Saisissez votre nom public",
        help: "Votre nom public est visible par les autres utilisateurs",
        validation: {
          minLength: "Le nom public doit contenir au moins 2 caractères",
          maxLength: "Le nom public ne peut pas dépasser 50 caractères",
        },
      },
      imageUrl: {
        label: "Photo de profil",
        description: "URL de votre photo de profil",
        placeholder: "Saisissez l'URL de l'image",
        help: "Indiquez l'URL d'une image qui servira de photo de profil",
        validation: {
          invalid: "Veuillez indiquer une URL d'image valide",
        },
      },
      company: {
        label: "Entreprise",
        description: "Le nom de votre entreprise",
        placeholder: "Saisissez votre entreprise",
        help: "Le nom de votre entreprise s'affiche sur votre profil",
        validation: {
          maxLength:
            "Le nom de l'entreprise ne peut pas dépasser 100 caractères",
        },
      },
      visibility: {
        label: "Visibilité du profil",
        description: "Qui peut voir votre profil",
        placeholder: "Choisissez la visibilité",
        help: "Choisissez qui peut voir votre profil : public (tout le monde), privé (vous seul) ou contacts uniquement",
      },
      marketingConsent: {
        label: "S'abonner à la newsletter",
        description:
          "Des nouvelles de temps en temps sur les nouveaux modèles et fonctionnalités. Pas de spam, juste l'essentiel.",
        placeholder: "Activer les e-mails marketing",
        help: "Choisissez si vous souhaitez recevoir des e-mails marketing et promotionnels",
      },
      bio: {
        label: "Bio",
        description: "Une courte présentation de vous",
        placeholder: "Parlez-nous de vous...",
        help: "Rédigez une courte présentation qui sera visible sur votre profil",
        validation: {
          maxLength: "La bio ne peut pas dépasser 500 caractères",
        },
      },
      websiteUrl: {
        label: "Site web",
        description: "Votre site personnel ou professionnel",
        placeholder: "https://yoursite.com",
      },
      twitterUrl: {
        label: "X / Twitter",
        description: "L'URL de votre profil X (Twitter)",
        placeholder: "https://x.com/yourhandle",
      },
      youtubeUrl: {
        label: "YouTube",
        description: "L'URL de votre chaîne YouTube",
        placeholder: "https://youtube.com/@yourchannel",
      },
      instagramUrl: {
        label: "Instagram",
        description: "L'URL de votre profil Instagram",
        placeholder: "https://instagram.com/yourhandle",
      },
      tiktokUrl: {
        label: "TikTok",
        description: "L'URL de votre profil TikTok",
        placeholder: "https://tiktok.com/@yourhandle",
      },
      githubUrl: {
        label: "GitHub",
        description: "L'URL de votre profil GitHub",
        placeholder: "https://github.com/yourusername",
      },
      facebookUrl: {
        label: "Facebook",
        description: "L'URL de votre page ou profil Facebook",
        placeholder: "https://facebook.com/yourpage",
      },
      discordUrl: {
        label: "Discord",
        description: "Le lien de votre serveur ou profil Discord",
        placeholder: "https://discord.gg/yourserver",
      },
      tribeUrl: {
        label: "Tribe",
        description: "L'URL de votre communauté Tribe",
        placeholder: "https://yourcommunity.tribe.so",
      },
      rumbleUrl: {
        label: "Rumble",
        description: "L'URL de votre chaîne Rumble",
        placeholder: "https://rumble.com/c/yourchannel",
      },
      odyseeUrl: {
        label: "Odysee",
        description: "L'URL de votre chaîne Odysee",
        placeholder: "https://odysee.com/@yourchannel",
      },
      nostrUrl: {
        label: "Nostr",
        description: "Votre profil Nostr ou votre adresse npub",
        placeholder: "https://primal.net/p/npub1...",
      },
      gabUrl: {
        label: "Gab",
        description: "L'URL de votre profil Gab",
        placeholder: "https://gab.com/yourhandle",
      },
      creatorSlug: {
        label: "URL du profil",
        description:
          "L'identifiant personnalisé de votre profil, affiché dans votre lien public",
        placeholder: "marie-dupont",
        validation: {
          invalid:
            "Uniquement des lettres minuscules, des chiffres et des tirets",
        },
      },
      creatorAccentColor: {
        label: "Couleur d'accent",
        description:
          "Couleur hexadécimale pour l'identité visuelle de votre page de compétence (facultatif)",
        placeholder: "#7c3aed",
      },
      creatorHeaderImageUrl: {
        label: "Image d'en-tête",
        description: "URL de la bannière en haut de votre page de compétence",
        placeholder: "https://yoursite.com/banner.jpg",
      },
    },
    response: {
      title: "Profil mis à jour",
      description: "Les informations mises à jour de votre profil",
      success: "Mise à jour réussie",
      message: "Votre profil a bien été mis à jour",
      id: "ID utilisateur",
      leadId: "ID du prospect",
      isPublic: "Profil public",
      email: "Adresse e-mail",
      privateName: "Nom privé",
      publicName: "Nom public",
      locale: "Langue et région",
      isActive: "Statut actif",
      emailVerified: "E-mail vérifié",
      requireTwoFactor: "Authentification à deux facteurs requise",
      marketingConsent: "Consentement marketing",
      userRoles: "Rôles de l'utilisateur",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
      stripeCustomerId: "ID client Stripe",
      bio: "Bio",
      websiteUrl: "Site web",
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
      creatorSlug: "Identifiant du profil",
      creatorAccentColor: "Couleur d'accent",
      creatorHeaderImageUrl: "Image d'en-tête",
      user: "Informations utilisateur mises à jour",
      changesSummary: {
        title: "Résumé des modifications",
        description: "Résumé des modifications apportées à votre profil",
        totalChanges: "Nombre de modifications",
        changedFields: "Champs modifiés",
        verificationRequired: "Vérification requise",
        lastUpdated: "Dernière mise à jour",
      },
      nextSteps: "Prochaines étapes",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
        emailTaken: "Cette adresse e-mail appartient déjà à un autre compte",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Profil utilisateur introuvable",
        detail:
          "Impossible de trouver votre profil à modifier (utilisateur {{userId}})",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
        creatorSlugTaken:
          "Cet identifiant de créateur est déjà pris. Choisissez-en un autre",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
        detail:
          "Impossible d'enregistrer votre profil : {{error}} (utilisateur {{userId}})",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: {
      title: "Succès",
      description: "Profil mis à jour",
      nextSteps:
        "Prochaines étapes recommandées après la mise à jour du profil",
    },
  },
  delete: {
    title: "Supprimer le compte utilisateur",
    titleShort: "Supprimer le compte",
    description: "Supprimer définitivement votre compte utilisateur",
    response: {
      title: "Statut de la suppression",
      description: "Confirmation de la suppression du compte",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Compte utilisateur introuvable",
        detail:
          "Impossible de trouver votre compte à supprimer (utilisateur {{userId}})",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      billingCancelFailed:
        "Impossible d'annuler votre abonnement : votre compte n'a donc PAS été supprimé, sinon vous continueriez à être facturé. Réessayez, ou annulez d'abord la facturation dans Abonnement.",
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
        detail:
          "Impossible de supprimer votre compte : {{error}} (utilisateur {{userId}})",
        retry:
          "Impossible de supprimer votre compte. Réessayez. Si le problème persiste, contactez le support.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: {
      title: "Succès",
      description: "Compte supprimé",
    },
  },
  put: {
    response: {
      changedFields: {
        item: "Champ modifié",
      },
    },
  },
  category: "Profil utilisateur",
  tag: "Profil utilisateur",
  tags: {
    profile: "profil",
    user: "utilisateur",
    account: "compte",
  },

  widget: {
    newsletter: {
      title: "Newsletter",
      subtitle:
        "Les nouveautés dans votre boîte mail, plus {{bonusCredits}} crédits gratuits en plus chaque mois",
      subtitleNeutral:
        "Nouveaux modèles et nouveautés produit, dans votre boîte mail",
    },
    loadState: {
      loading: "Chargement...",
      profileFailed: "Votre profil n'a pas pu être chargé.",
      creditsFailed: "Le solde n'a pas pu être chargé. Touchez pour réessayer.",
      retry: "Réessayer",
    },
    save: "Enregistrer le profil",
    saving: "Enregistrement...",
    editProfile: "Modifier le profil",
    changePhoto: "Changer de photo",
    cancelEdit: "Annuler",
    memberSince: "Membre depuis",
    stats: {
      plan: "Formule",
      credits: "Crédits",
      member: "Membre depuis",
    },
    profileCard: {
      title: "Profil de créateur",
      description: "Votre identité publique sur toute la plateforme",
    },
    socialCard: {
      title: "Liens sociaux",
      description: "Reliez vos plateformes",
    },
    emailCard: {
      title: "Votre liste d'e-mails",
      description:
        "Collectez des abonnés depuis vos compétences et votre profil. Votre liste, sans intermédiaire.",
      manage: "Gérer",
    },
    previewCard: {
      title: "Votre profil public",
      description: "Ce que les autres voient",
    },
    noPreview: "Remplissez votre profil pour voir un aperçu",
    noSocials: "Aucun lien social ajouté pour l'instant",
    viewPublicProfile: "Voir le profil public",
    profileUrl: "Votre lien",
    verifyNudge: {
      title: "Confirmez votre e-mail",
      description:
        "Nous avons envoyé un lien à {{email}}. Le chat fonctionne dans tous les cas. La confirmation permet de récupérer votre compte.",
      action: "Renvoyer le lien",
    },
    slugWarning:
      "Modifier cette URL cassera tous les liens existants vers votre profil.",
    bioPreview: "Aperçu",
    bioEdit: "Modifier",
    skills: {
      title: "Mes compétences",
      chat: "Discuter",
      add: "Ajouter à votre collection",
      public: "Communauté",
      showLess: "Voir moins",
      hubSubtitle: "{{count}} publiée(s)",
    },
    appearance: {
      title: "Apparence",
      sectionHint: "L'aspect et la lecture de l'application.",
      theme: "Thème",
      themeHint: "Clair, sombre ou comme votre appareil. S'applique partout.",
      light: "Clair",
      dark: "Sombre",
      system: "Système",
      language: "Langue",
      languageHint: "Langue de l'interface et du contenu.",
    },
    chatPrefs: {
      title: "Chat",
      sectionHint: "Réglez le fonctionnement de l'assistant.",
      searchProvider: "Recherche web",
      searchProviderHint: "Le moteur qui répond à vos recherches.",
      automation: "Automatisation en arrière-plan",
      automationHint: "Laissez l'IA travailler pendant votre absence.",
      on: "Activé",
      off: "Désactivé",
    },
    nav: {
      logoutHint: "Se déconnecter sur cet appareil",
      logout: "Se déconnecter",
      back: "Retour",
    },
    sections: {
      account: "Compte",
      accountHint: "Formule, facturation, sécurité et vos données.",
      billingHint: "Formule, crédits et adresses enregistrées.",
      security: "Sécurité",
      securityHint: "Gardez votre compte verrouillé.",
      data: "Données et confidentialité",
      dataHint: "Vos données, votre choix.",
      creatorHint: "Développez votre audience et vos revenus.",
      basics: "Essentiel",
      basicsHint: "Votre nom, votre e-mail de connexion et les nouveautés.",
      subscription: "Abonnement",
      subscriptionHint: "Abonnez-vous pour recevoir des crédits chaque mois.",
      manageSubscription: "Gérer",
      noSubscription: "Formule gratuite",
      upgrade: "Passer à la formule supérieure",
      addresses: "Adresses de facturation",
      addressCount: "{{count}} enregistrée(s)",
      addAddress: "Ajouter une adresse",
      manageAddresses: "Gérer",
      noAddresses: "Aucune enregistrée",
      billing: "Facturation",
      delivery: "Livraison",
      edit: "Modifier",
      credits: "Crédits",
      creditsAvailable: "disponibles",
      password: "Mot de passe",
      passwordHint: "Changer votre mot de passe",
      sessions: "Sessions actives",
      emailVerification: "Vérification de l'e-mail",
      emailVerifiedHint: "Votre adresse est confirmée",
      emailUnverifiedHint:
        "Confirmez votre adresse. Touchez pour renvoyer le lien",
      verified: "Vérifiée",
      unverified: "Non vérifiée",
      twoFactor: "Authentification à deux facteurs",
      twoFactorHint: "Exiger un code d'application à la connexion",
      on: "Activée",
      off: "Désactivée",
      sessionsHint: "Voir tous les appareils et les déconnecter",
      apiKeys: "Clés API",
      apiKeysHint:
        "{{modelCount}} modèles dans votre code, Codex ou Claude Code",
      exportData: "Exporter mes données",
      exportDataHint:
        "Télécharger une copie de tout ce que nous détenons sur vous",
      creator: "Créateur",
      referral: "Programme de parrainage",
      referralHint:
        "Touchez une commission sur chaque paiement que vous apportez",
    },
    deleteAccount: {
      dangerZone: "Zone de danger",
      dangerDescription:
        "Supprimé pour de bon : profil, discussions, compétences, fichiers, crédits.",
      button: "Supprimer le compte",
      confirmTitle: "Supprimer définitivement votre compte",
      confirmDescription:
        "Cette action supprime définitivement votre compte et toutes les données associées. Aucune récupération. Aucun retour en arrière.",
      confirmLabel: "Tapez « DELETE » pour confirmer",
      confirmPlaceholder: "DELETE",
      confirmButton: "Supprimer mon compte définitivement",
      cancelButton: "Annuler",
      whatGetsDeleted: "Ce qui sera supprimé :",
      items: {
        profile: "Votre profil et tous vos paramètres",
        chats: "Tout l'historique des discussions et des fils",
        skills: "Toutes vos compétences personnalisées et leurs configurations",
        files: "Tous vos fichiers et mémoires du cortex",
        subscriptions: "Les abonnements actifs",
        credits: "Les crédits restants",
      },
      deleting: "Suppression...",
      success: "Compte supprimé. Redirection...",
    },
  },

  // Sub-routes
  avatar: {
    category: "Profil utilisateur",

    tag: "avatar",
    errors: {
      user_not_found: "Utilisateur introuvable",
      failed_to_upload_avatar: "Échec de l'envoi de l'avatar",
      failed_to_delete_avatar: "Échec de la suppression de l'avatar",
      invalid_file_type: "Type de fichier invalide",
      file_too_large: "Fichier trop volumineux",
    },
    debug: {
      uploadingUserAvatar: "Envoi de l'avatar de l'utilisateur",
      errorUploadingUserAvatar: "Erreur lors de l'envoi de l'avatar",
      deletingUserAvatar: "Suppression de l'avatar de l'utilisateur",
      errorDeletingUserAvatar: "Erreur lors de la suppression de l'avatar",
    },
    success: {
      uploaded: "Avatar envoyé",
      deleted: "Avatar supprimé",
      nextSteps: {
        visible: "Votre avatar est désormais visible sur votre profil",
        update:
          "Vous pouvez le modifier à tout moment dans les paramètres de votre profil",
        default: "Votre profil affiche désormais l'avatar par défaut",
        uploadNew:
          "Vous pouvez envoyer un nouvel avatar à tout moment depuis les paramètres de votre profil",
      },
    },
    upload: {
      title: "Envoyer un avatar",
      description: "Envoyer une image d'avatar pour votre profil",
      groups: {
        fileUpload: {
          title: "Envoi du fichier",
          description: "Sélectionnez et envoyez votre image d'avatar",
        },
      },
      fields: {
        file: {
          label: "Image d'avatar",
          description: "Sélectionnez une image pour l'avatar de votre profil",
          placeholder: "Choisir une image...",
          help: "Envoyez une image (JPG, PNG, GIF) de 5 Mo maximum",
          validation: {
            maxSize: "Le fichier doit faire moins de 5 Mo",
            imageOnly: "Seules les images sont autorisées",
            unsupportedFormat:
              "Format d'image non pris en charge. Utilisez JPEG, PNG, WebP ou GIF.",
          },
        },
      },
      response: {
        title: "Réponse de l'envoi",
        label: "Résultat de l'envoi",
        description: "Réponse à l'envoi de l'avatar",
        success: "Envoi réussi",
        message: "Votre avatar a bien été envoyé",
        avatarUrl: "URL de l'avatar",
        uploadTime: "Date de l'envoi",
        nextSteps: {
          item: "Étape suivante",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Le fichier envoyé est invalide ou corrompu",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour envoyer un avatar",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de traiter l'envoi de l'avatar",
        },
        internal: {
          title: "Erreur interne",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite pendant l'envoi",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau s'est produite pendant l'envoi",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Vous n'êtes pas autorisé à envoyer un avatar",
        },
        notFound: {
          title: "Introuvable",
          description: "La ressource demandée est introuvable",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications n'ont pas été enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit s'est produit pendant l'envoi",
        },
      },
      success: {
        title: "Avatar envoyé",
        description: "L'avatar de votre profil a bien été envoyé",
      },
    },
    delete: {
      title: "Supprimer l'avatar",
      description: "Retirer l'avatar actuel de votre profil",
      response: {
        title: "Réponse de suppression",
        label: "Résultat de la suppression",
        description: "Réponse à la suppression de l'avatar",
        success: "Suppression réussie",
        message: "Votre avatar a bien été supprimé",
        nextSteps: {
          item: "Étape suivante",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "La demande de suppression de l'avatar est invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour supprimer votre avatar",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de supprimer l'avatar",
        },
        internal: {
          title: "Erreur interne",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite pendant la suppression",
        },
        network: {
          title: "Erreur réseau",
          description:
            "Une erreur réseau s'est produite pendant la suppression",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Vous n'êtes pas autorisé à supprimer cet avatar",
        },
        notFound: {
          title: "Introuvable",
          description: "L'avatar à supprimer est introuvable",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications n'ont pas été enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit s'est produit pendant la suppression",
        },
      },
      success: {
        title: "Avatar supprimé",
        description: "L'avatar de votre profil a bien été retiré",
      },
    },
  },
  password: {
    category: "Profil utilisateur",

    title: "Changer le mot de passe",
    description: "Modifiez le mot de passe de votre compte en toute sécurité",
    tag: "changement-mot-de-passe",
    debug: {
      updatingPassword: "Mise à jour du mot de passe",
      errorUpdatingPassword: "Erreur lors de la mise à jour du mot de passe",
      settingPassword: "Définition du mot de passe",
      errorSettingPassword: "Erreur lors de la définition du mot de passe",
    },
    groups: {
      currentCredentials: {
        title: "Mot de passe actuel",
        description: "Confirmez votre mot de passe actuel pour continuer",
      },
      newCredentials: {
        title: "Nouveau mot de passe",
        description:
          "Choisissez un nouveau mot de passe robuste pour votre compte",
      },
    },
    currentPassword: {
      label: "Mot de passe actuel",
      description: "Saisissez votre mot de passe actuel",
      placeholder: "Saisissez le mot de passe actuel",
      help: "Saisissez votre mot de passe actuel pour confirmer votre identité avant de le changer",
    },
    newPassword: {
      label: "Nouveau mot de passe",
      description:
        "Saisissez votre nouveau mot de passe (8 caractères minimum)",
      placeholder: "Saisissez le nouveau mot de passe",
      help: "Choisissez un mot de passe robuste d'au moins 8 caractères, avec des lettres, des chiffres et des symboles",
    },
    confirmPassword: {
      label: "Confirmer le mot de passe",
      description: "Confirmez votre nouveau mot de passe",
      placeholder: "Confirmez le nouveau mot de passe",
      help: "Saisissez à nouveau votre nouveau mot de passe pour éviter toute faute de frappe",
    },
    twoFactorCode: {
      label: "Code à deux facteurs",
      description:
        "Saisissez votre code d'authentification à deux facteurs si elle est activée",
      placeholder: "Code 2FA",
    },
    response: {
      title: "Réponse au changement de mot de passe",
      description: "Réponse à l'opération de changement de mot de passe",
      success: "Mot de passe changé",
      message: "Message d'état",
      securityTip: "Conseil de sécurité",
      nextSteps: {
        item: "Prochaines étapes",
      },
    },
    validation: {
      currentPassword: {
        minLength: "Le mot de passe actuel doit contenir au moins 8 caractères",
      },
      newPassword: {
        minLength:
          "Le nouveau mot de passe doit contenir au moins 8 caractères",
      },
      confirmPassword: {
        minLength: "La confirmation doit contenir au moins 8 caractères",
      },
      passwords: {
        mismatch: "Les mots de passe ne correspondent pas",
      },
    },
    errors: {
      passwords_do_not_match: "Les mots de passe ne correspondent pas",
      user_not_found: "Utilisateur introuvable",
      incorrect_password: "Mot de passe incorrect",
      update_failed: "Échec de la mise à jour du mot de passe",
      token_creation_failed: "Impossible de créer le jeton de mot de passe",
      two_factor_code_required:
        "Code d'authentification à deux facteurs requis",
      invalid_two_factor_code:
        "Code d'authentification à deux facteurs invalide",
      invalid_request: {
        title: "Requête invalide",
        description: "La demande de changement de mot de passe est invalide",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour changer votre mot de passe",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Impossible de mettre à jour le mot de passe en raison d'une erreur serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors de la mise à jour du mot de passe",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Vous n'êtes pas autorisé à effectuer cette action",
      },
      notFound: {
        title: "Utilisateur introuvable",
        description: "Le compte utilisateur est introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications non enregistrées seront perdues",
      },
      conflict: {
        title: "Conflit de données",
        description:
          "Un conflit s'est produit lors de la mise à jour du mot de passe",
      },
    },
    success: {
      updated: "Mot de passe mis à jour",
      securityTip:
        "Pour plus de sécurité, activez l'authentification à deux facteurs",
      nextSteps: {
        logoutOther:
          "Par sécurité, toutes les autres sessions ont été déconnectées",
        enable2fa:
          "Pensez à activer l'authentification à deux facteurs pour mieux protéger votre compte",
      },
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a bien été mis à jour",
    },
    update: {
      success: {
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a bien été mis à jour",
      },
      errors: {
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de la mise à jour du mot de passe",
        },
      },
    },
  },
  addresses: {
    category: "Adresses de l'utilisateur",
    tag: "adresses",

    list: {
      title: "Mes adresses",
      description: "Lister vos adresses enregistrées",
      response: {
        addresses: "Adresses",
      },
      widget: {
        addAddress: "Ajouter une adresse",
        edit: "Modifier",
        delete: "Supprimer",
        billing: "Facturation",
        delivery: "Livraison",
        empty: "Aucune adresse enregistrée",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Requête invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès interdit", description: "Accès refusé" },
        notFound: {
          title: "Introuvable",
          description: "Aucune adresse trouvée",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications n'ont pas été enregistrées",
        },
        internal: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
      },
      success: { title: "Succès", description: "Adresses récupérées" },
    },

    create: {
      title: "Ajouter une adresse",
      description: "Enregistrer une nouvelle adresse sur votre compte",
      fields: {
        label: {
          label: "Libellé",
          description: "Nommez cette adresse (par ex. Domicile, Bureau)",
          placeholder: "Domicile",
        },
        fullName: {
          label: "Nom complet",
          description: "Nom du contact pour cette adresse",
          placeholder: "Marie Dupont",
        },
        company: {
          label: "Entreprise",
          description: "Nom de l'entreprise (facultatif)",
          placeholder: "Acme SAS",
        },
        phone: {
          label: "Téléphone",
          description: "Numéro de téléphone du contact",
          placeholder: "+33 6 12 34 56 78",
        },
        vatNumber: {
          label: "Numéro de TVA",
          description: "Numéro de TVA intracommunautaire",
          placeholder: "FR12345678901",
        },
        taxId: {
          label: "Identifiant fiscal",
          description: "Identifiant fiscal national",
          placeholder: "123-45-6789",
        },
        addressLine1: {
          label: "Adresse (ligne 1)",
          description: "Numéro et rue",
          placeholder: "12 rue de la Paix",
        },
        addressLine2: {
          label: "Adresse (ligne 2)",
          description: "Appartement, bâtiment, étage (facultatif)",
          placeholder: "Bâtiment B",
        },
        city: { label: "Ville", description: "Ville", placeholder: "Paris" },
        region: {
          label: "Région / État",
          description: "Région ou État (facultatif)",
          placeholder: "Île-de-France",
        },
        postalCode: {
          label: "Code postal",
          description: "Code postal",
          placeholder: "75002",
        },
        country: {
          label: "Pays",
          description: "Code pays ISO 3166-1 alpha-2",
          placeholder: "FR",
        },
        isDefaultBilling: {
          label: "Facturation par défaut",
          description: "Utiliser comme adresse de facturation par défaut",
        },
        isDefaultDelivery: {
          label: "Livraison par défaut",
          description: "Utiliser comme adresse de livraison par défaut",
        },
      },
      response: {
        id: "ID de l'adresse",
        label: "Libellé",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès interdit", description: "Accès refusé" },
        notFound: {
          title: "Introuvable",
          description: "Utilisateur introuvable",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications n'ont pas été enregistrées",
        },
        internal: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
      },
      success: {
        title: "Adresse enregistrée",
        description: "Adresse ajoutée à votre compte",
      },
      widget: {
        saved: "Adresse enregistrée.",
        backToAddresses: "Retour aux adresses",
      },
    },
  },
};
