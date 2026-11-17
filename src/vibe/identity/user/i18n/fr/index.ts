import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",
  auth: {
    category: "Authentification",
    search: {
      tag: "Auth",
    },
    authClient: {
      errors: {
        status_save_failed:
          "Impossible d'enregistrer l'état d'authentification",
        status_remove_failed:
          "Impossible de supprimer l'état d'authentification",
        status_check_failed: "Impossible de vérifier l'état d'authentification",
        token_save_failed:
          "Impossible d'enregistrer le jeton d'authentification",
        token_get_failed: "Impossible de récupérer le jeton d'authentification",
        token_remove_failed:
          "Impossible de supprimer le jeton d'authentification",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start:
          "getAuthMinimalUserNext: vérification de l'authentification en premier",
        result: "getAuthMinimalUserNext: résultat de getCurrentUserNext",
        authenticated:
          "getAuthMinimalUserNext: utilisateur authentifié, récupération du leadId",
        returningAuth:
          "getAuthMinimalUserNext: renvoi de l'utilisateur authentifié",
        notAuthenticated:
          "getAuthMinimalUserNext: utilisateur non authentifié, renvoi de l'utilisateur public",
      },
      signingJwt: "Signature du JWT",
      jwtSignedSuccessfully: "JWT signé avec succès",
      errorSigningJwt: "Erreur lors de la signature du JWT",
      verifyingJwt: "Vérification du JWT",
      invalidTokenPayload: "Contenu du jeton invalide",
      jwtVerifiedSuccessfully: "JWT vérifié avec succès",
      errorVerifyingJwt: "Erreur lors de la vérification du JWT",
      userIdNotExistsInDb:
        "L'ID utilisateur n'existe pas dans la base de données",
      sessionNotFound: "Session introuvable",
      sessionExpired: "Session expirée",
      errorValidatingUserSession:
        "Erreur lors de la validation de la session utilisateur",
      errorGettingUserRoles:
        "Erreur lors de la récupération des rôles utilisateur",
      errorCheckingUserAuth:
        "Erreur lors de la vérification de l'authentification utilisateur",
      authenticatingCliUserWithPayload:
        "Authentification de l'utilisateur CLI avec le payload",
      errorAuthenticatingCliUserWithPayload:
        "Erreur lors de l'authentification de l'utilisateur CLI avec le payload",
      creatingCliToken: "Création du jeton CLI",
      errorCreatingCliToken: "Erreur lors de la création du jeton CLI",
      validatingCliToken: "Validation du jeton CLI",
      errorValidatingCliToken: "Erreur lors de la validation du jeton CLI",
      gettingCurrentUserFromNextjs:
        "Récupération de l'utilisateur actuel depuis Next.js",
      errorGettingAuthUserForNextjs:
        "Erreur lors de la récupération de l'utilisateur authentifié pour Next.js",
      settingNextjsAuthCookies:
        "Définition des cookies d'authentification Next.js",
      clearingNextjsAuthCookies:
        "Suppression des cookies d'authentification Next.js",
      gettingCurrentUserFromToken:
        "Récupération de l'utilisateur actuel depuis le jeton",
      errorGettingCurrentUserFromCli:
        "Erreur lors de la récupération de l'utilisateur actuel depuis la CLI",
      errorGettingAuthUserForCli:
        "Erreur lors de la récupération de l'utilisateur authentifié pour la CLI",
      errorGettingUserRolesForCli:
        "Erreur lors de la récupération des rôles utilisateur pour la CLI",
      tokenFromAuthHeader: "Jeton issu de l'en-tête d'authentification",
      tokenFromCookie: "Jeton issu du cookie",
      noTokenFound: "Aucun jeton trouvé",
      errorExtractingToken: "Erreur lors de l'extraction du jeton",
      errorParsingCookies: "Erreur lors de l'analyse des cookies",
    },
    errors: {
      token_generation_failed:
        "Impossible de générer le jeton d'authentification",
      invalid_session: "La session est invalide ou a expiré",
      missing_request_context: "Le contexte de la requête est manquant",
      missing_locale: "La langue est absente de la requête",
      unsupported_platform: "Cette plateforme n'est pas prise en charge",
      session_retrieval_failed: "Impossible de récupérer la session",
      missing_token: "Le jeton d'authentification est manquant",
      invalid_token_signature: "La signature du jeton est invalide",
      jwt_payload_missing_id: "L'ID utilisateur est absent du payload JWT",
      cookie_set_failed: "Impossible de définir le cookie d'authentification",
      cookie_clear_failed:
        "Impossible de supprimer le cookie d'authentification",
      publicPayloadNotSupported:
        "Le payload JWT public n'est pas pris en charge pour l'authentification CLI",
      jwt_signing_failed: "Impossible de signer le jeton JWT",
      authentication_failed: "Échec de l'authentification",
      user_not_authenticated: "L'utilisateur n'est pas authentifié",
      publicUserNotAllowed:
        "Les utilisateurs publics ne sont pas autorisés sur cet endpoint",
      validation_failed: "Échec de la validation",
      failed_to_create_lead: "Impossible de créer le lead",
      native: {
        unsupported:
          "Cette méthode d'authentification n'est pas prise en charge sur React Native",
        storage_failed:
          "Impossible d'enregistrer les données d'authentification",
        clear_failed: "Impossible de supprimer les données d'authentification",
      },
      not_implemented_native:
        "Cette fonctionnalité n'est pas encore disponible sur React Native",
      unknownError:
        "Une erreur inconnue est survenue lors de l'authentification",
    },
    post: {
      title: "Auth",
      description: "Endpoint d'authentification",
      form: {
        title: "Configuration de l'authentification",
        description: "Configurer les paramètres d'authentification",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse de l'authentification",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        missing_locale: {
          title: "Langue manquante",
          description: "Le paramètre de langue est requis",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de données est survenu",
        },
        token_generation_failed: {
          title: "Échec de la génération du jeton",
          description: "Impossible de générer le jeton d'authentification",
        },
        invalid_session: {
          title: "Session invalide",
          description: "La session est invalide ou a expiré",
        },
        missing_request_context: {
          title: "Contexte de requête manquant",
          description: "Le contexte de la requête est manquant",
        },
        unsupported_platform: {
          title: "Plateforme non prise en charge",
          description: "Cette plateforme n'est pas prise en charge",
        },
        session_retrieval_failed: {
          title: "Échec de récupération de la session",
          description: "Impossible de récupérer la session",
        },
        missing_token: {
          title: "Jeton manquant",
          description: "Le jeton d'authentification est manquant",
        },
        invalid_token_signature: {
          title: "Signature du jeton invalide",
          description: "La signature du jeton est invalide",
        },
        jwt_payload_missing_id: {
          title: "ID manquant dans le payload JWT",
          description: "L'ID utilisateur est absent du payload JWT",
        },
        cookie_set_failed: {
          title: "Échec de définition du cookie",
          description: "Impossible de définir le cookie d'authentification",
        },
        cookie_clear_failed: {
          title: "Échec de suppression du cookie",
          description: "Impossible de supprimer le cookie d'authentification",
        },
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
    check: {
      get: {
        title: "Vérifier l'authentification",
        description: "Vérifier l'état d'authentification actuel",
        response: {
          title: "État d'authentification",
          description: "État d'authentification actuel",
          authenticated: "Authentifié",
          tokenValid: "Jeton valide",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "Non autorisé",
        forbidden: "Accès refusé",
        invalidToken: "Jeton invalide",
        tokenExpired: "Jeton expiré",
        serverError: "Erreur serveur",
      },
    },
  },
  private: {
    logout: {
      title: "Déconnexion",
      description: "Déconnecte l'utilisateur actuel et invalide sa session",
      category: "Gestion des utilisateurs",
      tag: "déconnexion",
      logoutButton: "Se déconnecter",
      loggingOut: "Déconnexion...",
      response: {
        title: "Réponse de déconnexion",
        description: "Réponse confirmant la déconnexion",
        success: "Succès",
        message: "Message",
        sessionsCleaned: "Sessions nettoyées",
        nextSteps: "Prochaines étapes recommandées après la déconnexion",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description:
            "La demande de déconnexion contient des données invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour vous déconnecter",
        },
        internal: {
          title: "Erreur interne du serveur",
          description: "Une erreur interne est survenue lors de la déconnexion",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue est survenue lors de la déconnexion",
        },
        session_deletion_failed: {
          title: "Échec de suppression de la session",
          description: "Impossible de supprimer la session utilisateur",
        },
        conflict: {
          title: "Conflit de déconnexion",
          description: "Un conflit est survenu lors de la déconnexion",
        },
        forbidden: {
          title: "Accès refusé",
          description: "La déconnexion n'est pas autorisée",
        },
        network_error: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de la déconnexion",
        },
        not_found: {
          title: "Introuvable",
          description: "Session introuvable",
        },
        server_error: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur lors de la déconnexion",
        },
        unsaved_changes: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications ne sont pas enregistrées",
        },
        invalid_user: {
          title: "Utilisateur invalide",
          description: "L'utilisateur est invalide ou n'existe pas",
        },
      },
      success: {
        title: "Déconnexion réussie",
        description: "Vous êtes bien déconnecté",
        message: "Utilisateur déconnecté avec succès",
      },
    },
    me: {
      // Main user profile routes
      get: {
        title: "Obtenir le profil utilisateur",
        description:
          "Récupérer les informations du profil de l'utilisateur actuel",
        response: {
          title: "Réponse du profil utilisateur",
          description: "Données du profil de l'utilisateur actuel",
          id: "ID utilisateur",
          leadId: "ID du lead",
          isPublic: "Profil public",
          email: "Adresse e-mail",
          privateName: "Nom privé",
          publicName: "Nom public",
          locale: "Langue",
          isActive: "Statut actif",
          emailVerified: "E-mail vérifié",
          requireTwoFactor: "Authentification à deux facteurs requise",
          marketingConsent: "Consentement marketing",
          userRoles: "Rôles utilisateur",
          createdAt: "Créé le",
          updatedAt: "Mis à jour le",
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
          creatorSlug: "Slug du profil",
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
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Profil utilisateur introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Certaines modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
        },
        success: {
          title: "Succès",
          description: "Profil récupéré avec succès",
        },
      },
      update: {
        title: "Modifier le profil utilisateur",
        description:
          "Modifier les informations du profil de l'utilisateur actuel",
        groups: {
          basicInfo: {
            title: "Informations de base",
            description: "Modifiez les informations de base de votre profil",
          },
          profileDetails: {
            title: "Détails du profil",
            description: "Gérez les détails et réglages de votre profil",
          },
          privacySettings: {
            title: "Confidentialité",
            description:
              "Choisissez qui peut voir les informations de votre profil",
          },
          profileInfo: {
            title: "Profil de créateur",
            description:
              "Bio, liens sociaux et identité visuelle de vos pages de skills",
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
            help: "Votre nom privé sert en interne et pour les échanges privés",
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
            help: "Indiquez l'URL d'une image à afficher comme photo de profil",
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
            description: "Une courte description de vous",
            placeholder: "Parlez-nous de vous...",
            help: "Une courte description de vous, visible sur votre profil",
            validation: {
              maxLength: "La bio ne peut pas dépasser 500 caractères",
            },
          },
          websiteUrl: {
            label: "Site web",
            description: "Votre site personnel ou professionnel",
            placeholder: "https://votresite.com",
          },
          twitterUrl: {
            label: "X / Twitter",
            description: "L'URL de votre profil X (Twitter)",
            placeholder: "https://x.com/votrepseudo",
          },
          youtubeUrl: {
            label: "YouTube",
            description: "L'URL de votre chaîne YouTube",
            placeholder: "https://youtube.com/@votrechaine",
          },
          instagramUrl: {
            label: "Instagram",
            description: "L'URL de votre profil Instagram",
            placeholder: "https://instagram.com/votrepseudo",
          },
          tiktokUrl: {
            label: "TikTok",
            description: "L'URL de votre profil TikTok",
            placeholder: "https://tiktok.com/@votrepseudo",
          },
          githubUrl: {
            label: "GitHub",
            description: "L'URL de votre profil GitHub",
            placeholder: "https://github.com/votrenom",
          },
          facebookUrl: {
            label: "Facebook",
            description: "L'URL de votre page ou profil Facebook",
            placeholder: "https://facebook.com/votrepage",
          },
          discordUrl: {
            label: "Discord",
            description: "Le lien de votre serveur ou profil Discord",
            placeholder: "https://discord.gg/votreserveur",
          },
          tribeUrl: {
            label: "Tribe",
            description: "L'URL de votre communauté Tribe",
            placeholder: "https://votrecommunaute.tribe.so",
          },
          rumbleUrl: {
            label: "Rumble",
            description: "L'URL de votre chaîne Rumble",
            placeholder: "https://rumble.com/c/votrechaine",
          },
          odyseeUrl: {
            label: "Odysee",
            description: "L'URL de votre chaîne Odysee",
            placeholder: "https://odysee.com/@votrechaine",
          },
          nostrUrl: {
            label: "Nostr",
            description: "Votre profil Nostr ou votre adresse npub",
            placeholder: "https://primal.net/p/npub1...",
          },
          gabUrl: {
            label: "Gab",
            description: "L'URL de votre profil Gab",
            placeholder: "https://gab.com/votrepseudo",
          },
          creatorSlug: {
            label: "URL du profil",
            description:
              "Le slug personnalisé de votre profil, visible dans votre lien public",
            placeholder: "jane-doe",
            validation: {
              invalid:
                "Uniquement des lettres minuscules, des chiffres et des tirets",
            },
          },
          creatorAccentColor: {
            label: "Couleur d'accent",
            description:
              "Couleur hexadécimale pour l'identité visuelle de votre page de skill (facultatif)",
            placeholder: "#7c3aed",
          },
          creatorHeaderImageUrl: {
            label: "Image d'en-tête",
            description: "URL de la bannière en haut de votre page de skill",
            placeholder: "https://votresite.com/banniere.jpg",
          },
        },
        response: {
          title: "Profil mis à jour",
          description: "Les informations mises à jour de votre profil",
          success: "Mise à jour réussie",
          message: "Votre profil a bien été mis à jour",
          id: "ID utilisateur",
          leadId: "ID du lead",
          isPublic: "Profil public",
          email: "Adresse e-mail",
          privateName: "Nom privé",
          publicName: "Nom public",
          locale: "Langue",
          isActive: "Statut actif",
          emailVerified: "E-mail vérifié",
          requireTwoFactor: "Authentification à deux facteurs requise",
          marketingConsent: "Consentement marketing",
          userRoles: "Rôles utilisateur",
          createdAt: "Créé le",
          updatedAt: "Mis à jour le",
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
          creatorSlug: "Slug du profil",
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
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Profil utilisateur introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Certaines modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
        },
        success: {
          title: "Succès",
          description: "Profil mis à jour avec succès",
          nextSteps:
            "Prochaines étapes recommandées après la mise à jour du profil",
        },
      },
      delete: {
        title: "Supprimer le compte utilisateur",
        description: "Supprimer définitivement votre compte utilisateur",
        response: {
          title: "État de la suppression",
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
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Compte utilisateur introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Certaines modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
        },
        success: {
          title: "Succès",
          description: "Compte supprimé avec succès",
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
        save: "Enregistrer le profil",
        saving: "Enregistrement...",
        editProfile: "Modifier le profil",
        cancelEdit: "Annuler",
        memberSince: "Membre depuis",
        profileCard: {
          title: "Profil de créateur",
          description: "Votre identité publique sur toute la plateforme",
        },
        socialCard: {
          title: "Liens sociaux",
          description: "Reliez vos plateformes",
        },
        emailCard: {
          title: "Votre liste e-mail",
          description:
            "Les visiteurs de votre page de skill et de votre profil de créateur peuvent s'abonner. La liste vous appartient, sans plateforme entre vous.",
        },
        previewCard: {
          title: "Votre profil public",
          description: "Ce que les autres voient",
        },
        noPreview: "Remplissez votre profil pour voir un aperçu",
        noSocials: "Aucun lien social pour l'instant",
        viewPublicProfile: "Voir le profil public",
        profileUrl: "Votre lien",
        slugWarning:
          "Modifier cette URL cassera tous les liens existants vers votre profil.",
        bioPreview: "Aperçu",
        bioEdit: "Modifier",
        skills: {
          title: "Mes Skills",
          chat: "Discuter",
          add: "Ajouter à votre collection",
          public: "Communauté",
          showLess: "Afficher moins",
        },
        deleteAccount: {
          dangerZone: "Zone dangereuse",
          button: "Supprimer le compte",
          confirmTitle: "Supprimer définitivement votre compte",
          confirmDescription:
            "Votre compte et toutes les données associées seront supprimés définitivement. Aucune récupération. Aucun retour en arrière.",
          confirmLabel: "Tapez « DELETE » pour confirmer",
          confirmPlaceholder: "DELETE",
          confirmButton: "Supprimer mon compte pour toujours",
          cancelButton: "Annuler",
          whatGetsDeleted: "Ce qui sera supprimé :",
          items: {
            profile: "Votre profil et tous vos paramètres",
            chats: "Tout l'historique des discussions et des fils",
            skills: "Toutes les compétences et configurations personnalisées",
            files: "Tous les fichiers et souvenirs du cortex",
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
          failed_to_upload_avatar: "Impossible d'envoyer l'avatar",
          failed_to_delete_avatar: "Impossible de supprimer l'avatar",
          invalid_file_type: "Type de fichier invalide",
          file_too_large: "Fichier trop volumineux",
        },
        debug: {
          uploadingUserAvatar: "Envoi de l'avatar utilisateur",
          errorUploadingUserAvatar:
            "Erreur lors de l'envoi de l'avatar utilisateur",
          deletingUserAvatar: "Suppression de l'avatar utilisateur",
          errorDeletingUserAvatar:
            "Erreur lors de la suppression de l'avatar utilisateur",
        },
        success: {
          uploaded: "Avatar envoyé avec succès",
          deleted: "Avatar supprimé avec succès",
          nextSteps: {
            visible: "Votre avatar est maintenant visible sur votre profil",
            update:
              "Vous pouvez le modifier à tout moment dans les paramètres de votre profil",
            default: "Votre profil affiche désormais l'avatar par défaut",
            uploadNew:
              "Vous pouvez envoyer un nouvel avatar à tout moment dans les paramètres de votre profil",
          },
        },
        upload: {
          title: "Envoyer un avatar",
          description: "Envoyer une image d'avatar pour votre profil",
          groups: {
            fileUpload: {
              title: "Envoi de fichier",
              description: "Choisissez et envoyez votre image d'avatar",
            },
          },
          fields: {
            file: {
              label: "Image d'avatar",
              description:
                "Choisissez un fichier image pour l'avatar de votre profil",
              placeholder: "Choisir un fichier image...",
              help: "Envoyez une image (JPG, PNG, GIF) de 5 Mo maximum",
              validation: {
                maxSize: "Le fichier doit faire moins de 5 Mo",
                imageOnly: "Seuls les fichiers image sont autorisés",
                unsupportedFormat:
                  "Format d'image non pris en charge. Utilisez JPEG, PNG, WebP ou GIF.",
              },
            },
          },
          response: {
            title: "Réponse de l'envoi",
            label: "Résultat de l'envoi",
            description: "Réponse de l'envoi de l'avatar",
            success: "Envoi réussi",
            message: "Votre avatar a bien été envoyé",
            avatarUrl: "URL de l'avatar",
            uploadTime: "Heure de l'envoi",
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
              description: "Une erreur interne du serveur est survenue",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inattendue est survenue lors de l'envoi",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue lors de l'envoi",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Vous n'avez pas l'autorisation d'envoyer un avatar",
            },
            notFound: {
              title: "Introuvable",
              description: "La ressource demandée est introuvable",
            },
            unsaved: {
              title: "Modifications non enregistrées",
              description: "Certaines modifications ne sont pas enregistrées",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit est survenu lors de l'envoi",
            },
          },
          success: {
            title: "Avatar envoyé",
            description: "L'avatar de votre profil a bien été envoyé",
          },
        },
        delete: {
          title: "Supprimer l'avatar",
          description: "Retirer l'avatar actuel du profil",
          response: {
            title: "Réponse de la suppression",
            label: "Résultat de la suppression",
            description: "Réponse de la suppression de l'avatar",
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
              description:
                "Vous devez être connecté pour supprimer votre avatar",
            },
            server: {
              title: "Erreur serveur",
              description: "Impossible de supprimer l'avatar",
            },
            internal: {
              title: "Erreur interne",
              description: "Une erreur interne du serveur est survenue",
            },
            unknown: {
              title: "Erreur inconnue",
              description:
                "Une erreur inattendue est survenue lors de la suppression",
            },
            network: {
              title: "Erreur réseau",
              description:
                "Une erreur réseau est survenue lors de la suppression",
            },
            forbidden: {
              title: "Accès refusé",
              description:
                "Vous n'avez pas l'autorisation de supprimer cet avatar",
            },
            notFound: {
              title: "Introuvable",
              description: "L'avatar à supprimer est introuvable",
            },
            unsaved: {
              title: "Modifications non enregistrées",
              description: "Certaines modifications ne sont pas enregistrées",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit est survenu lors de la suppression",
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

        title: "Changer de mot de passe",
        description:
          "Modifiez le mot de passe de votre compte en toute sécurité",
        tag: "changement-mot-de-passe",
        debug: {
          updatingPassword: "Mise à jour du mot de passe",
          errorUpdatingPassword:
            "Erreur lors de la mise à jour du mot de passe",
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
          placeholder: "Mot de passe actuel",
          help: "Saisissez votre mot de passe actuel pour confirmer votre identité avant de le changer",
        },
        newPassword: {
          label: "Nouveau mot de passe",
          description:
            "Saisissez votre nouveau mot de passe (8 caractères minimum)",
          placeholder: "Nouveau mot de passe",
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
          title: "Réponse du changement de mot de passe",
          description: "Réponse de l'opération de changement de mot de passe",
          success: "Mot de passe changé",
          message: "Message d'état",
          securityTip: "Conseil de sécurité",
          nextSteps: {
            item: "Prochaines étapes",
          },
        },
        validation: {
          currentPassword: {
            minLength:
              "Le mot de passe actuel doit contenir au moins 8 caractères",
          },
          newPassword: {
            minLength:
              "Le nouveau mot de passe doit contenir au moins 8 caractères",
          },
          confirmPassword: {
            minLength:
              "La confirmation du mot de passe doit contenir au moins 8 caractères",
          },
          passwords: {
            mismatch: "Les mots de passe ne correspondent pas",
          },
        },
        errors: {
          passwords_do_not_match: "Les mots de passe ne correspondent pas",
          user_not_found: "Utilisateur introuvable",
          incorrect_password: "Mot de passe incorrect",
          update_failed: "Impossible de mettre à jour le mot de passe",
          token_creation_failed: "Impossible de créer le jeton de mot de passe",
          two_factor_code_required:
            "Code d'authentification à deux facteurs requis",
          invalid_two_factor_code:
            "Code d'authentification à deux facteurs invalide",
          invalid_request: {
            title: "Requête invalide",
            description:
              "La demande de changement de mot de passe est invalide",
          },
          validation: {
            title: "Erreur de validation",
            description: "Vérifiez votre saisie et réessayez",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Vous devez être connecté pour changer de mot de passe",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Impossible de mettre à jour le mot de passe suite à une erreur serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description:
              "Une erreur inattendue est survenue lors de la mise à jour du mot de passe",
          },
          network: {
            title: "Erreur réseau",
            description: "La connexion réseau a échoué",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Vous n'avez pas l'autorisation d'effectuer cette action",
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
              "Un conflit est survenu lors de la mise à jour du mot de passe",
          },
        },
        success: {
          updated: "Mot de passe mis à jour avec succès",
          securityTip:
            "Pour plus de sécurité, activez l'authentification à deux facteurs",
          nextSteps: {
            logoutOther:
              "Par sécurité, toutes vos autres sessions ont été déconnectées",
            enable2fa:
              "Pensez à activer l'authentification à deux facteurs pour mieux vous protéger",
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
                "Une erreur inattendue est survenue lors de la mise à jour du mot de passe",
            },
          },
        },
      },
      addresses: {
        category: "Adresses de l'utilisateur",
        tag: "adresses",

        list: {
          title: "Mes adresses",
          description: "Liste de vos adresses enregistrées",
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
            forbidden: { title: "Accès refusé", description: "Accès interdit" },
            notFound: {
              title: "Introuvable",
              description: "Aucune adresse trouvée",
            },
            conflict: { title: "Conflit", description: "Conflit de données" },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Certaines modifications ne sont pas enregistrées",
            },
            internal: {
              title: "Erreur serveur",
              description: "Erreur interne du serveur",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inconnue est survenue",
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
              description:
                "Donnez un nom à cette adresse (ex. Domicile, Bureau)",
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
              label: "Numéro fiscal",
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
              placeholder: "Bât. B, 4e étage",
            },
            city: {
              label: "Ville",
              description: "Ville",
              placeholder: "Paris",
            },
            region: {
              label: "Département / Région",
              description: "Département ou région (facultatif)",
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
            forbidden: { title: "Accès refusé", description: "Accès interdit" },
            notFound: {
              title: "Introuvable",
              description: "Utilisateur introuvable",
            },
            conflict: { title: "Conflit", description: "Conflit de données" },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Certaines modifications ne sont pas enregistrées",
            },
            internal: {
              title: "Erreur serveur",
              description: "Erreur interne du serveur",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inconnue est survenue",
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
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "Aucun jeton dans les cookies",
        },
      },
      errors: {
        session_not_found: "Session introuvable",
        session_lookup_failed: "Impossible de rechercher la session",
        expired_sessions_delete_failed:
          "Impossible de supprimer les sessions expirées",
        session_creation_failed: "Impossible de créer la session",
        session_creation_database_error:
          "Erreur de base de données lors de la création de la session",
        user_sessions_delete_failed:
          "Impossible de supprimer les sessions de l'utilisateur",
        expired: "La session a expiré",
      },
      post: {
        title: "Session",
        description: "Endpoint de session",
        form: {
          title: "Configuration de la session",
          description: "Configurer les paramètres de session",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse de la session",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
        },
        success: {
          title: "Succès",
          description: "Opération réussie",
        },
      },
    },
    sessions: {
      category: "Utilisateurs",

      list: {
        title: "Mes sessions",
        description: "Toutes les sessions actives de votre compte",
        tag: "Sessions",
        response: {
          sessions: "Sessions",
        },
        success: {
          title: "Sessions récupérées",
          description: "Vos sessions actives ont été récupérées",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Requête invalide",
          },
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: { title: "Accès refusé", description: "Accès interdit" },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: { title: "Conflit", description: "Conflit de données" },
        },
      },
      create: {
        title: "Créer un jeton de session",
        description:
          "Créer un jeton de session nommé pour un accès programmatique",
        tag: "Sessions",
        form: {
          name: "Nom du jeton",
          namePlaceholder: "ex. Mon bot agent",
        },
        response: {
          token: "Jeton",
          id: "ID de session",
          name: "Nom",
          message: "Copiez ce jeton maintenant : il ne sera plus affiché",
        },
        success: {
          title: "Session créée",
          description: "Votre jeton de session a été créé",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Requête invalide",
          },
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: { title: "Accès refusé", description: "Accès interdit" },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: { title: "Conflit", description: "Conflit de données" },
        },
      },
      revoke: {
        title: "Révoquer la session",
        description: "Révoquer un jeton de session par son ID",
        tag: "Sessions",
        response: {
          message: "Session révoquée",
        },
        success: {
          title: "Session révoquée",
          description: "La session a été révoquée",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Requête invalide",
          },
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: { title: "Accès refusé", description: "Accès interdit" },
          notFound: {
            title: "Introuvable",
            description: "Session introuvable",
          },
          conflict: { title: "Conflit", description: "Conflit de données" },
        },
      },
    },
  },
  public: {
    login: {
      category: "Utilisateurs",
      title: "Bon retour parmi nous",
      description:
        "Accédez aux modèles d'IA non censurés et à l'historique de vos conversations.",
      tag: "Authentification",
      options: {
        category: "Utilisateurs",

        title: "Options de connexion",
        description: "Options de configuration de la connexion",
        tag: "options-connexion",
        container: {
          title: "Configuration de la connexion",
          description: "Configurer les paramètres et options de connexion",
        },
        fields: {
          email: {
            label: "Adresse e-mail",
            description: "Saisissez votre adresse e-mail",
            placeholder: "vous@exemple.com",
          },
          allowPasswordAuth: {
            label: "Autoriser l'authentification par mot de passe",
            description: "Activer l'authentification par mot de passe",
          },
          allowSocialAuth: {
            label: "Autoriser la connexion via les réseaux sociaux",
            description:
              "Activer l'authentification via des fournisseurs de réseaux sociaux",
          },
          maxAttempts: {
            label: "Nombre maximal de tentatives de connexion",
            description: "Nombre maximal de tentatives de connexion autorisées",
          },
          requireTwoFactor: {
            label: "Exiger l'authentification à deux facteurs",
            description: "Exiger la 2FA pour la connexion des utilisateurs",
          },
          socialProviders: {
            label: "Fournisseurs sociaux",
            description: "Fournisseurs d'authentification sociale disponibles",
          },
          socialProvider: {
            title: "Fournisseur social",
            description:
              "Configuration du fournisseur d'authentification sociale",
            enabled: {
              label: "Activé",
              description: "Indique si ce fournisseur est activé",
            },
            name: {
              label: "Nom du fournisseur",
              description: "Nom du fournisseur social",
            },
            providers: {
              label: "Options des fournisseurs",
              description: "Options de fournisseurs sociaux disponibles",
            },
          },
        },
        response: {
          title: "Réponse des options de connexion",
          description: "Options de configuration de la connexion disponibles",
          success: {
            badge: "Succès",
          },
          message: {
            content: "Message d'état",
          },
          forUser: {
            content: "Adresse e-mail",
          },
          loginMethods: {
            title: "Méthodes de connexion",
            description: "Méthodes d'authentification disponibles",
            password: {
              title: "Connexion par mot de passe",
              description: "Authentification classique par mot de passe",
              enabled: {
                badge: "Activé",
              },
            },
            social: {
              title: "Connexion via les réseaux sociaux",
              description: "Options d'authentification via les réseaux sociaux",
              enabled: {
                badge: "Activé",
              },
              providers: {
                item: {
                  title: "Fournisseur social",
                  description: "Fournisseur d'authentification sociale",
                },
                name: {
                  content: "Nom du fournisseur",
                },
                id: {
                  content: "ID du fournisseur",
                },
                enabled: {
                  badge: "Disponible",
                },
                description: "Description du fournisseur",
              },
            },
          },
          security: {
            title: "Paramètres de sécurité",
            description: "Exigences de sécurité de l'authentification",
            maxAttempts: {
              content: "Nombre maximal de tentatives de connexion",
            },
            requireTwoFactor: {
              badge: "2FA requise",
            },
          },
          recommendations: {
            item: "Option de connexion recommandée",
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
          server: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Les modifications n'ont pas été enregistrées",
          },
        },
        success: {
          title: "Succès",
          description: "Options de connexion récupérées avec succès",
        },
        post: {
          title: "Options de connexion",
          description: "Obtenir les options de connexion disponibles",
          response: {
            title: "Réponse des options de connexion",
            description: "Options de configuration de la connexion disponibles",
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
            server: {
              title: "Erreur serveur",
              description: "Une erreur interne du serveur est survenue",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inconnue est survenue",
            },
          },
          success: {
            description: "Options de connexion récupérées avec succès",
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
          successMessage: "Options de connexion récupérées avec succès",
          passwordAuthDescription:
            "Connectez-vous avec votre adresse e-mail et votre mot de passe",
          socialAuthDescription:
            "Connectez-vous avec vos comptes de réseaux sociaux",
          continueWithProvider: "Continuer avec {{provider}}",
          twoFactorRequired: "Sécurité renforcée : 2FA requise",
          standardSecurity: "Exigences de sécurité standard",
          tryPasswordFirst: "Essayez d'abord la connexion par mot de passe",
          useSocialLogin: "Utiliser la connexion via les réseaux sociaux",
          socialLoginFaster:
            "La connexion via les réseaux sociaux est plus rapide pour les nouveaux utilisateurs",
        },
      },
      actions: {
        submit: "Se connecter",
        submitting: "Connexion...",
      },
      fields: {
        email: {
          label: "Votre adresse e-mail",
          description: "L'adresse e-mail utilisée lors de votre inscription.",
          placeholder: "Saisissez votre adresse e-mail",
          validation: {
            required: "L'adresse e-mail est obligatoire",
            invalid: "Veuillez saisir une adresse e-mail valide",
          },
        },
        password: {
          label: "Votre mot de passe",
          description: "Le mot de passe choisi lors de votre inscription.",
          placeholder: "Saisissez votre mot de passe",
          help: "Saisissez le mot de passe de votre compte",
          validation: {
            required: "Le mot de passe est obligatoire",
            minLength: "Le mot de passe doit contenir au moins 8 caractères",
          },
        },
        rememberMe: {
          label: "Rester connecté",
        },
      },
      groups: {
        credentials: {
          title: "Identifiants de connexion",
          description: "Saisissez vos informations de connexion",
        },
        options: {
          title: "Options de connexion",
          description: "Préférences et paramètres de connexion supplémentaires",
        },
        preferences: {
          title: "Préférences de connexion",
          description: "Options de connexion supplémentaires",
        },
        advanced: {
          title: "Options avancées",
          description: "Paramètres de connexion avancés",
        },
      },
      footer: {
        forgotPassword: "Mot de passe oublié ?",
        createAccount: "Pas encore de compte ? S'inscrire",
      },
      response: {
        title: "Réponse de connexion",
        description: "Données de réponse de la connexion",
        success: "Connexion réussie",
        message: "Message d'état",
        user: {
          title: "Détails de l'utilisateur",
          description: "Informations sur l'utilisateur connecté",
          id: "ID utilisateur",
          email: "Adresse e-mail",
          firstName: "Prénom",
          lastName: "Nom",
          privateName: "Nom privé",
          publicName: "Nom public",
          imageUrl: "Photo de profil",
        },
        sessionInfo: {
          title: "Informations de session",
          description: "Détails de la session utilisateur",
          expiresAt: "Expiration de la session",
          rememberMeActive: "Option « Rester connecté »",
          loginLocation: "Lieu de connexion",
        },
        nextSteps: {
          title: "Prochaines étapes",
          item: "Prochaines étapes",
        },
      },
      errors: {
        title: "Erreur de connexion",
        account_locked: "Le compte est verrouillé",
        accountLocked: "Le compte est verrouillé",
        accountLockedDescription:
          "Votre compte a été verrouillé. Veuillez contacter le support.",
        invalid_credentials: "Adresse e-mail ou mot de passe incorrect",
        two_factor_required: "Authentification à deux facteurs requise",
        auth_error: "Une erreur d'authentification est survenue",
        user_not_found: "Utilisateur introuvable",
        session_creation_failed: "Impossible de créer la session",
        token_save_failed:
          "Impossible d'enregistrer le jeton d'authentification",
        validation: {
          title: "Échec de la validation",
          description: "Veuillez vérifier votre saisie",
        },
        unauthorized: {
          title: "Échec de la connexion",
          description: "Identifiants invalides",
        },
        unknown: {
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion",
        },
        network: {
          title: "Erreur réseau",
          description: "La connexion a échoué",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Connexion non autorisée",
        },
        notFound: {
          title: "Utilisateur introuvable",
          description: "Compte utilisateur introuvable",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Les modifications n'ont pas été enregistrées",
        },
        conflict: {
          title: "Conflit de connexion",
          description: "Un conflit de connexion a été détecté",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
      },
      success: {
        title: "Connexion réussie",
        description: "Vous êtes connecté",
        message: "Bon retour parmi nous ! Vous êtes bien connecté.",
      },
      token: {
        save: {
          failed: "Impossible d'enregistrer le jeton d'authentification",
          success: "Jeton d'authentification enregistré avec succès",
        },
      },
      process: {
        failed: "Le processus de connexion a échoué",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "Connexion rapide (dev)",
      },
    },
    resetPassword: {
      confirm: {
        category: "Utilisateurs",

        title: "Confirmer la réinitialisation du mot de passe",
        description:
          "Confirmez la réinitialisation avec un nouveau mot de passe",
        tag: "Réinitialisation du mot de passe",
        email: {
          title: "Mot de passe réinitialisé",
          subject: "Mot de passe réinitialisé - {{appName}}",
          previewText:
            "Votre mot de passe {{appName}} a été réinitialisé. Connectez-vous et discutez avec {{modelCount}} modèles d'IA.",
          greeting: "Bonjour {{name}},",
          successMessage:
            "Votre mot de passe a été réinitialisé. Tout est prêt : connectez-vous et reprenez là où vous en étiez.",
          loginButton: "Se connecter à {{appName}}",
          promoText: "{{modelCount}} modèles d'IA. Sans filtres. Sans sermons.",
          securityWarning:
            "Vous n'avez pas réinitialisé votre mot de passe ? Contactez immédiatement le support : votre compte est peut-être en danger.",
        },
        groups: {
          verification: {
            title: "Vérification",
            description: "Vérifiez votre demande de réinitialisation",
          },
          newPassword: {
            title: "Nouveau mot de passe",
            description: "Définissez votre nouveau mot de passe",
          },
        },
        fields: {
          token: {
            label: "Jeton de réinitialisation",
            description: "Le jeton de réinitialisation reçu par e-mail",
            placeholder: "Saisissez le jeton de réinitialisation",
            help: "Retrouvez le jeton de réinitialisation dans vos e-mails et saisissez-le ici",
            validation: {
              required: "Le jeton de réinitialisation est obligatoire",
            },
          },
          email: {
            label: "Adresse e-mail",
            description: "Votre adresse e-mail",
            placeholder: "Saisissez votre adresse e-mail",
            validation: {
              invalid: "Veuillez saisir une adresse e-mail valide",
            },
          },
          password: {
            label: "Nouveau mot de passe",
            description: "Votre nouveau mot de passe",
            placeholder: "Nouveau mot de passe",
            help: "Choisissez un mot de passe robuste d'au moins 8 caractères, avec des lettres, des chiffres et des symboles",
            validation: {
              minLength: "Le mot de passe doit contenir au moins 8 caractères",
            },
          },
          confirmPassword: {
            label: "Confirmer le mot de passe",
            description: "Confirmez votre nouveau mot de passe",
            placeholder: "Confirmez le nouveau mot de passe",
            validation: {
              minLength: "Le mot de passe doit contenir au moins 8 caractères",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Les mots de passe ne correspondent pas",
          },
        },
        response: {
          title: "Réponse de réinitialisation",
          description: "Confirmation de la réinitialisation du mot de passe",
          message: {
            label: "Message",
            description: "Message de réponse",
          },
          securityTip:
            "Pensez à activer l'authentification à deux facteurs pour mieux vous protéger",
          nextSteps: [
            "Connectez-vous avec votre nouveau mot de passe",
            "Mettez à jour les mots de passe enregistrés dans votre navigateur",
            "Pensez à activer la 2FA pour plus de sécurité",
          ],
        },
        errors: {
          title: "Erreur de réinitialisation",
          no_email: "Aucun compte associé à cette adresse e-mail",
          validation: {
            title: "Erreur de validation",
            description: "Vérifiez votre saisie et réessayez",
            passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Jeton de réinitialisation invalide ou expiré",
          },
          internal: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Erreur de connexion réseau",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Vous n'avez pas l'autorisation d'effectuer cette action",
          },
          notFound: {
            title: "Introuvable",
            description: "Jeton de réinitialisation introuvable ou expiré",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Certaines modifications ne sont pas enregistrées",
          },
          conflict: {
            title: "Conflit",
            description:
              "Un conflit est survenu lors du traitement de votre demande",
          },
        },
        success: {
          title: "Mot de passe réinitialisé",
          description: "Votre mot de passe a bien été réinitialisé",
          message: "Le mot de passe a bien été réinitialisé",
          password_reset: "Votre mot de passe a bien été réinitialisé",
        },
        actions: {
          requestNewLink: "Demander un nouveau lien",
        },
        emailTemplates: {
          confirm: {
            name: "E-mail de confirmation de réinitialisation",
            description:
              "E-mail envoyé aux utilisateurs une fois leur mot de passe réinitialisé",
            category: "Authentification",
            preview: {
              publicName: {
                label: "Nom public",
                description: "Le nom d'affichage public de l'utilisateur",
              },
              userId: {
                label: "ID utilisateur",
                description: "L'identifiant unique de l'utilisateur",
              },
            },
          },
        },
      },
      request: {
        category: "Utilisateurs",
        title: "Demande de réinitialisation du mot de passe",
        description: "Demander la réinitialisation du mot de passe",
        tag: "Réinitialisation du mot de passe",
        ui: {
          title: "Réinitialiser votre mot de passe",
          subtitle:
            "Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe",
          sendResetLink: "Envoyer le lien",
          alreadyHaveAccount: "Vous avez déjà un compte ? Se connecter",
        },
        actions: {
          submitting: "Envoi...",
        },
        email: {
          title: "Réinitialisez votre mot de passe {{appName}}",
          subject: "Demande de réinitialisation du mot de passe - {{appName}}",
          previewText:
            "Réinitialisez votre mot de passe {{appName}}. Lien valable {{hours}} heures.",
          greeting: "Bonjour {{name}},",
          requestInfo:
            "Une réinitialisation du mot de passe a été demandée pour votre compte {{appName}}. Si c'est bien vous, cliquez sur le bouton ci-dessous.",
          buttonText: "Réinitialiser mon mot de passe",
          expirationInfo:
            "Le lien expire dans {{hours}} heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe reste inchangé.",
          signoff: "L'équipe {{appName}}",
          promoText: "{{modelCount}} modèles d'IA. Sans filtres. Sans sermons.",
        },
        groups: {
          emailInput: {
            title: "Adresse e-mail",
            description:
              "Saisissez votre adresse e-mail pour recevoir les instructions de réinitialisation",
          },
        },
        fields: {
          email: {
            label: "Adresse e-mail",
            description: "Saisissez votre adresse e-mail",
            placeholder: "vous@exemple.com",
            help: "Saisissez l'adresse e-mail associée à votre compte",
            validation: {
              invalid: "Veuillez saisir une adresse e-mail valide",
            },
          },
        },
        response: {
          title: "Réponse de la demande",
          description:
            "Réponse à la demande de réinitialisation du mot de passe",
          success: {
            message: "Lien de réinitialisation envoyé avec succès",
          },
          deliveryInfo: {
            estimatedTime: "sous 5 minutes",
            expiresAt: "dans 4 heures",
          },
          nextSteps: {
            checkEmail: "Vérifiez votre boîte de réception et vos spams",
            clickLink: "Cliquez sur le lien de réinitialisation dans l'e-mail",
            createPassword: "Créez un nouveau mot de passe sécurisé",
          },
        },
        errors: {
          title: "Erreur",
          validation: {
            title: "Erreur de validation",
            description: "Saisie invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Requête non autorisée",
          },
          internal: {
            title: "Erreur interne",
            description: "Erreur interne du serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Erreur de connexion réseau",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Les modifications n'ont pas été enregistrées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
          no_email: "Aucun compte associé à cette adresse e-mail",
          email_generation_failed: "Impossible de générer l'e-mail",
        },
        success: {
          title: "Demande envoyée",
          description: "Demande de réinitialisation envoyée avec succès",
        },
        post: {
          title: "Demande",
          description: "Endpoint de demande",
          form: {
            title: "Configuration de la demande",
            description: "Configurer les paramètres de la demande",
          },
          response: {
            title: "Réponse",
            description: "Données de réponse de la demande",
          },
          errors: {
            unauthorized: {
              title: "Non autorisé",
              description: "Authentification requise",
            },
            validation: {
              title: "Erreur de validation",
              description: "Paramètres de requête invalides",
            },
            server: {
              title: "Erreur serveur",
              description: "Une erreur interne du serveur est survenue",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inconnue est survenue",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Accès interdit",
            },
            notFound: {
              title: "Introuvable",
              description: "Ressource introuvable",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit de données est survenu",
            },
          },
          success: {
            title: "Succès",
            description: "Opération réussie",
          },
        },
        emailTemplates: {
          request: {
            name: "E-mail de demande de réinitialisation",
            description:
              "E-mail envoyé aux utilisateurs avec un lien pour réinitialiser leur mot de passe",
            category: "Authentification",
            preview: {
              publicName: {
                label: "Nom public",
                description: "Le nom d'affichage public de l'utilisateur",
              },
              userId: {
                label: "ID utilisateur",
                description: "L'identifiant unique de l'utilisateur",
              },
              passwordResetUrl: {
                label: "URL de réinitialisation",
                description:
                  "L'URL permettant de réinitialiser le mot de passe",
              },
            },
          },
        },
      },
      validate: {
        category: "Utilisateurs",

        title: "Valider le jeton de réinitialisation",
        description: "Endpoint de validation du jeton de réinitialisation",
        tag: "Validation de la réinitialisation",
        groups: {
          tokenInput: {
            title: "Validation du jeton",
            description: "Saisissez le jeton de réinitialisation à valider",
          },
        },
        fields: {
          token: {
            label: "Jeton de réinitialisation",
            description: "Jeton de réinitialisation reçu par e-mail",
            placeholder: "Saisissez le jeton de réinitialisation",
            help: "Saisissez le jeton reçu par e-mail",
            validation: {
              required: "Le jeton de réinitialisation est obligatoire",
            },
          },
        },
        response: {
          title: "Résultat de la validation",
          description: "Réponse de la validation du jeton",
          valid: "Jeton valide",
          message: "Message de validation",
          validationMessage: "Validation du jeton de réinitialisation terminée",
          userId: "ID utilisateur",
          expiresAt: "Expiration du jeton",
          nextSteps: {
            item: "Prochaines étapes après la validation",
            steps: [
              "Passez à la définition de votre nouveau mot de passe",
              "Choisissez un mot de passe robuste et unique",
            ],
          },
        },
        errors: {
          title: "Erreur",
          validation: {
            title: "Erreur de validation",
            description: "La validation du jeton a échoué",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Jeton invalide ou expiré",
          },
          internal: {
            title: "Erreur interne",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Jeton introuvable",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Des modifications non enregistrées ont été détectées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
        },
        success: {
          title: "Jeton valide",
          description: "Le jeton de réinitialisation est valide",
        },
        post: {
          title: "Valider",
          description: "Endpoint de validation",
          form: {
            title: "Configuration de la validation",
            description: "Configurer les paramètres de validation",
          },
          response: {
            title: "Réponse",
            description: "Données de réponse de la validation",
          },
          errors: {
            unauthorized: {
              title: "Non autorisé",
              description: "Authentification requise",
            },
            validation: {
              title: "Erreur de validation",
              description: "Paramètres de requête invalides",
            },
            server: {
              title: "Erreur serveur",
              description: "Une erreur interne du serveur est survenue",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inconnue est survenue",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Accès interdit",
            },
            notFound: {
              title: "Introuvable",
              description: "Ressource introuvable",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit de données est survenu",
            },
          },
          success: {
            title: "Succès",
            description: "Opération réussie",
          },
        },
      },
      actions: {
        back: "Retour",
        submit: "Envoyer",
        submitting: "Envoi...",
      },
      success: {
        password_reset: "Votre mot de passe a bien été réinitialisé.",
      },
      errors: {
        tokenValidationFailed: "La validation du jeton a échoué",
        userLookupFailed: "Impossible de rechercher l'utilisateur",
        tokenDeletionFailed: "Impossible de supprimer le jeton",
        userDeletionFailed: "Impossible de supprimer l'utilisateur",
        resetFailed: "La réinitialisation du mot de passe a échoué",
        tokenCreationFailed: "Impossible de créer le jeton de réinitialisation",
        noDataReturned: "Aucune donnée renvoyée par la base de données",
        tokenInvalid: "Le jeton de réinitialisation est invalide",
        tokenExpired: "Le jeton de réinitialisation a expiré",
        tokenVerificationFailed: "La vérification du jeton a échoué",
        userNotFound: "Utilisateur introuvable",
        passwordUpdateFailed: "Impossible de mettre à jour le mot de passe",
        passwordResetFailed: "La réinitialisation du mot de passe a échoué",
        requestFailed: "La demande de réinitialisation a échoué",
        emailMismatch: "L'adresse e-mail ne correspond pas",
        confirmationFailed:
          "La confirmation de la réinitialisation du mot de passe a échoué",
      },
    },
    signup: {
      category: "Utilisateurs",

      _components: {
        passwordStrength: {
          label: "Robustesse du mot de passe",
          weak: "Faible",
          fair: "Moyen",
          good: "Bon",
          strong: "Robuste",
          requirement: {
            minLength: {
              icon: "✗",
              text: "Au moins 8 caractères",
            },
            uppercase: {
              icon: "✗",
              text: "Au moins une majuscule",
            },
            lowercase: {
              icon: "✗",
              text: "Au moins une minuscule",
            },
            number: {
              icon: "✗",
              text: "Au moins un chiffre",
            },
            special: {
              icon: "!",
              text: "Caractère spécial (facultatif, renforce le mot de passe)",
            },
          },
        },
        post: {
          title: "_components",
          description: "Endpoint _components",
          form: {
            title: "Configuration de _components",
            description: "Configurer les paramètres de _components",
          },
          response: {
            title: "Réponse",
            description: "Données de réponse de _components",
          },
          errors: {
            unauthorized: {
              title: "Non autorisé",
              description: "Authentification requise",
            },
            validation: {
              title: "Erreur de validation",
              description: "Paramètres de requête invalides",
            },
            server: {
              title: "Erreur serveur",
              description: "Une erreur interne du serveur est survenue",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inconnue est survenue",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Accès interdit",
            },
            notFound: {
              title: "Introuvable",
              description: "Ressource introuvable",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit de données est survenu",
            },
          },
          success: {
            title: "Succès",
            description: "Opération réussie",
          },
        },
      },
      title: "Inscription",
      description: "Endpoint d'inscription des utilisateurs",
      tag: "Authentification",
      form: {
        title: "Bienvenue dans l'IA non censurée",
        description:
          "Aidez à bâtir une IA non censurée, respectueuse de la vie privée et vraiment indépendante. unbottled.ai est open source et porté par sa communauté : votre inscription soutient une IA qui respecte votre liberté.",
      },
      actions: {
        submit: "Créer un compte",
        submitting: "Création du compte...",
      },
      fields: {
        privateName: {
          label: "Votre nom privé",
          description:
            "Le nom que l'IA utilise pour vous dans les conversations privées. Il reste entre vous et l'IA, en toute confidentialité.",
          placeholder: "Saisissez votre nom",
          validation: {
            required: "Le nom privé est obligatoire",
            minLength: "Le nom doit contenir au moins 2 caractères",
            maxLength: "Le nom doit contenir moins de 100 caractères",
          },
        },
        publicName: {
          label: "Votre nom public",
          description:
            "Votre identité dans les chats publics et les forums. Les autres utilisateurs et les IA verront ce nom. Choisissez-le bien : il vous représente dans la communauté.",
          placeholder: "Saisissez un nom d'affichage",
          validation: {
            required: "Le nom d'affichage est obligatoire",
            minLength: "Le nom d'affichage doit contenir au moins 2 caractères",
            maxLength:
              "Le nom d'affichage doit contenir moins de 100 caractères",
          },
        },
        email: {
          label: "Votre adresse e-mail",
          description:
            "Votre identifiant de connexion et votre moyen de contact. Elle reste privée : jamais partagée avec d'autres utilisateurs ni avec les IA.",
          placeholder: "Saisissez votre adresse e-mail",
          help: "Ce sera votre adresse de connexion et votre principal moyen de contact",
          validation: {
            required: "L'adresse e-mail est obligatoire",
            invalid: "Veuillez saisir une adresse e-mail valide",
          },
        },
        password: {
          label: "Votre mot de passe",
          description:
            "Un mot de passe robuste protège votre compte. Le chiffrement de bout en bout arrive bientôt : à partir de là, une réinitialisation du mot de passe effacera votre historique de messages, car vous seul détenez la clé de déchiffrement. Gardez-le en lieu sûr.",
          placeholder: "Saisissez un mot de passe",
          validation: {
            required: "Le mot de passe est obligatoire",
            minLength: "Le mot de passe doit contenir au moins 8 caractères",
            complexity:
              "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
          },
        },
        confirmPassword: {
          label: "Confirmez votre mot de passe",
          validation: {
            required: "Veuillez confirmer votre mot de passe",
            minLength: "Le mot de passe doit contenir au moins 8 caractères",
            mismatch: "Les mots de passe ne correspondent pas",
          },
        },
        subscribeToNewsletter: {
          label: "S'abonner à la newsletter",
          description:
            "Des nouvelles de temps en temps sur les nouveaux modèles et fonctionnalités. Pas de spam, juste l'essentiel.",
        },
        acceptTerms: {
          label: "Accepter les conditions générales",
          description:
            "Nos conditions générales respectent votre liberté et votre vie privée.",
          termsLink: "conditions d'utilisation",
          conditionsLink: "politique de confidentialité",
          descriptionPrefix: "Nos",
          descriptionAnd: "et notre",
          descriptionSuffix: "respectent votre liberté et votre vie privée.",
          validation: {
            required:
              "Vous devez accepter les conditions générales pour continuer",
          },
        },
        referralCode: {
          label: "Code de parrainage (facultatif)",
          description:
            "Un ami utilise unbottled.ai ? Saisissez son code pour le soutenir. Il est récompensé pour vous avoir fait venir.",
          placeholder: "Saisissez un code de parrainage (facultatif)",
          labelPrefilled: "Code de parrainage",
          descriptionPrefilled:
            "Votre ami est récompensé quand vous créez votre compte.",
        },
        supportedSkillId: {
          label: "Soutenir un créateur",
          description:
            "Votre inscription soutient le créateur de cette compétence avec un bonus de +5 % sur vos abonnements.",
          selectorTitle: "Soutenir un créateur",
          selectorDescription:
            "Vous avez ajouté à vos favoris des compétences de créateurs indépendants. Choisissez-en un à soutenir : il touche +5 % de vos abonnements. Modifiable à tout moment.",
          selectorNone: "Aucun (passer)",
        },
        localFavorites: {
          label: "Favoris locaux",
        },
      },

      footer: {
        alreadyHaveAccount: "Vous avez déjà un compte ? Se connecter",
      },
      errors: {
        title: "Erreur d'inscription",
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez votre saisie et réessayez",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        conflict: {
          title: "Compte déjà existant",
          description: "Un compte existe déjà avec cette adresse e-mail",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        internal: {
          title: "Erreur interne",
          description: "Une erreur interne est survenue",
        },
      },
      emailCheck: {
        title: "Vérification de l'adresse e-mail",
        description:
          "Vérifier si l'adresse e-mail est disponible pour l'inscription",
        tag: "Vérification e-mail",
        fields: {
          email: {
            label: "Adresse e-mail",
            description: "Adresse e-mail à vérifier",
            placeholder: "Saisissez une adresse e-mail",
            validation: {
              invalid: "Format d'adresse e-mail invalide",
            },
          },
        },
        response: {
          title: "Réponse de la vérification",
          description: "Résultat de la vérification de disponibilité",
          available: "Adresse e-mail disponible",
          message: "Message de disponibilité",
        },
        errors: {
          validation: {
            title: "Adresse e-mail invalide",
            description: "Veuillez saisir une adresse e-mail valide",
          },
          internal: {
            title: "Erreur de vérification",
            description:
              "Erreur lors de la vérification de la disponibilité de l'adresse e-mail",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          conflict: {
            title: "Adresse e-mail déjà utilisée",
            description: "Cette adresse e-mail est déjà enregistrée",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Vous n'avez pas l'autorisation de vérifier cette adresse e-mail",
          },
          network: {
            title: "Erreur réseau",
            description:
              "Une erreur réseau est survenue lors de la vérification de l'adresse e-mail",
          },
          notFound: {
            title: "Service introuvable",
            description:
              "Le service de vérification d'e-mail n'est pas disponible",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Authentification requise pour vérifier l'adresse e-mail",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
        },
        success: {
          title: "Vérification terminée",
          description: "Disponibilité de l'adresse e-mail vérifiée",
        },
      },
      post: {
        title: "Inscription",
        description: "Endpoint d'inscription",
        form: {
          title: "Configuration de l'inscription",
          description: "Configurer les paramètres d'inscription",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse de l'inscription",
          success: "Inscription réussie",
          message: "Message d'état",
          userId: "ID utilisateur",
          nextSteps: "Prochaines étapes",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue est survenue",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
        },
        success: {
          title: "Succès",
          description: "Opération réussie",
          processing: "Inscription en cours de traitement",
        },
      },
      response: {
        title: "Réponse",
        description: "Données de réponse de l'inscription",
        success: "Inscription réussie",
        message: "Message d'état",
        user: {
          id: "ID utilisateur",
          email: "Adresse e-mail",
          firstName: "Prénom",
          lastName: "Nom",
          privateName: "Nom privé",
          publicName: "Nom public",
          imageUrl: "URL de la photo de profil",
          verificationRequired: "Vérification requise",
        },
        verificationInfo: {
          title: "Vérification de l'adresse e-mail",
          description:
            "Détails du processus de vérification de l'adresse e-mail",
          emailSent: "E-mail envoyé",
          expiresAt: "Expiration de la vérification",
          checkSpamFolder: "Vérifiez vos spams",
        },
        nextSteps: "Prochaines étapes",
      },
      success: {
        title: "Inscription réussie",
        description: "Votre compte a bien été créé",
      },
      admin_notification: {
        title: "Nouvelle inscription",
        subject: "Nouvelle inscription - {{privateName}}",
        preview: "Le nouvel utilisateur {{privateName}} s'est inscrit",
        message: "Un nouvel utilisateur s'est inscrit sur {{appName}}",
        privateName: "Nom privé",
        publicName: "Nom public",
        email: "E-mail",
        locale: "Langue",
        creditBalance: "Solde de crédits",
        leadCreditBalance: "Solde de crédits du lead",
        signup_preferences: "Préférences d'inscription",
        user_details: "Détails de l'utilisateur",
        basic_information: "Informations de base",
        signup_type: "Type d'inscription",
        direct_signup: "Inscription directe",
        newsletter: "Newsletter",
        subscribed: "Abonné",
        not_subscribed: "Non abonné",
        signup_details: "Détails de l'inscription",
        signup_date: "Date d'inscription",
        user_id: "ID utilisateur",
        recommended_next_steps: "Prochaines étapes recommandées",
        direct_recommendation:
          "Vérifier le profil de l'utilisateur et la configuration du paiement",
        contact_user: "Contacter l'utilisateur",
        footer: "Ceci est une notification automatique de {{appName}}",
      },
      email: {
        subject: "C'est parti. {{appName}} vous attend",
        previewText:
          "Bonjour {{privateName}}, votre compte est prêt. Discutez avec Claude, GPT, Gemini, DeepSeek et {{modelCount}} autres modèles. Gratuit, sans carte bancaire.",
        headline: "Votre IA vous attend.",
        greeting: "Bonjour {{privateName}},",
        intro:
          "Bienvenue sur {{appName}}. Tout ce que vous aimez dans ChatGPT, plus des modèles open source et des modèles sans filtres de contenu. Un seul compte, un seul endroit.",
        models: {
          title: "{{modelCount}} modèles dans 3 catégories",
          mainstream: "Grand public",
          open: "Open source",
          uncensored: "Non censurés",
        },
        free: {
          title: "Ce que vous avez gratuitement, pour toujours :",
          credits:
            "{{freeCreditsSignedIn}} crédits gratuits chaque mois, {{freeCreditsMax}} avec la newsletter. Sans carte bancaire.",
          allModels: "Accès aux {{modelCount}} modèles d'IA",
          uncensored:
            "Des modèles non censurés qui répondent vraiment à vos questions",
          chatModes: "Modes de chat Privé, Incognito, Partagé et Public",
          noCard: "Aucune carte bancaire requise. Jamais.",
        },
        ctaButton: "Commencer à discuter",
        upgrade: {
          title: "Envie de plus ?",
          desc: "Formules dès {{subscriptionPrice}}/mois pour {{subscriptionCredits}} crédits, jusqu'à {{ultraCredits}} crédits pour {{ultraPrice}}. Les abonnés rechargent avec des packs qui n'expirent jamais.",
          cta: "Voir les formules",
        },
        signoff: "Bonnes discussions,\nL'équipe {{appName}}",
        ps: "P.-S. Utilisez le mode Incognito pour garder vos conversations uniquement sur votre appareil. Nous ne les stockons jamais sur nos serveurs (les médias générés sont stockés temporairement pour des raisons techniques).",
      },
      emailTemplates: {
        welcome: {
          name: "E-mail de bienvenue à l'inscription",
          description:
            "E-mail de bienvenue envoyé aux utilisateurs après leur inscription",
          category: "Authentification",
          preview: {
            privateName: {
              label: "Nom privé",
              description: "Le nom privé de l'utilisateur",
            },
            userId: {
              label: "ID utilisateur",
              description: "L'identifiant unique de l'utilisateur",
            },
            leadId: {
              label: "ID du lead",
              description: "L'identifiant de lead de l'utilisateur",
            },
          },
        },
        adminSignup: {
          name: "E-mail de notification d'inscription (admin)",
          description:
            "E-mail envoyé aux administrateurs lors d'une nouvelle inscription",
          category: "Administration",
          preview: {
            privateName: {
              label: "Nom privé",
            },
            publicName: {
              label: "Nom public",
            },
            email: {
              label: "Adresse e-mail",
            },
            userId: {
              label: "ID utilisateur",
            },
            subscribeToNewsletter: {
              label: "Abonnement à la newsletter",
            },
          },
        },
      },
    },
  },
  search: {
    category: "Utilisateurs",

    title: "Recherche d'utilisateurs",
    description: "Rechercher des utilisateurs",
    tag: "Recherche d'utilisateurs",
    container: {
      title: "Conteneur de recherche",
      description: "Conteneur de recherche d'utilisateurs",
    },
    groups: {
      searchCriteria: {
        title: "Critères de recherche",
        description: "Définissez vos paramètres de recherche",
      },
      filters: {
        title: "Filtres avancés",
        description: "Options de filtrage supplémentaires",
      },
      pagination: {
        title: "Pagination",
        description: "Contrôlez la pagination des résultats",
      },
    },
    fields: {
      search: {
        label: "Recherche",
        description: "Saisissez vos termes de recherche",
        placeholder: "Rechercher des utilisateurs...",
        help: "Recherche par nom, e-mail ou entreprise",
        validation: {
          minLength: "La recherche doit contenir au moins 2 caractères",
        },
      },
      roles: {
        label: "Rôles utilisateur",
        description: "Filtrer par rôle",
        placeholder: "Choisir des rôles...",
        help: "Choisissez un ou plusieurs rôles pour filtrer",
      },
      status: {
        label: "Statut de l'utilisateur",
        description: "Filtrer par statut",
        placeholder: "Choisir un statut...",
        help: "Filtrer les utilisateurs actifs, inactifs ou tous",
      },
      limit: {
        label: "Limite",
        description: "Nombre maximal de résultats",
        help: "Nombre de résultats à renvoyer (par défaut : 10)",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de résultats à ignorer",
        help: "Décalage de pagination (par défaut : 0)",
      },
    },
    status: {
      active: "Actif",
      inactive: "Inactif",
      all: "Tous",
    },
    response: {
      title: "Résultats de recherche",
      description: "Résultats de la recherche d'utilisateurs",
      success: {
        badge: "Succès",
      },
      message: {
        content: "Message du résultat de recherche",
      },
      searchInfo: {
        title: "Informations de recherche",
        description: "Détails de l'opération de recherche",
        searchTerm: "Terme recherché",
        appliedFilters: "Filtres appliqués",
        searchTime: "Durée de la recherche",
        totalResults: "Nombre de résultats",
      },
      pagination: {
        title: "Pagination",
        description: "Informations de navigation entre les pages",
        currentPage: "Page actuelle",
        totalPages: "Nombre de pages",
        itemsPerPage: "Éléments par page",
        totalItems: "Nombre d'éléments",
        hasMore: "Pages suivantes",
        hasPrevious: "Pages précédentes",
      },
      actions: {
        title: "Actions disponibles",
        description: "Actions possibles sur les résultats",
        type: "Type d'action",
        label: "Action",
        href: "Lien",
      },
      users: {
        label: "Utilisateurs trouvés",
        description: "Liste des utilisateurs correspondants",
        item: {
          title: "Utilisateur",
          description: "Informations du compte utilisateur",
        },
        id: "ID utilisateur",
        leadId: "ID du lead",
        isPublic: "Public",
        firstName: "Prénom",
        lastName: "Nom",
        privateName: "Nom privé",
        publicName: "Nom public",
        company: "Entreprise",
        email: "E-mail",
        imageUrl: "Avatar",
        isActive: "Actif",
        emailVerified: "E-mail vérifié",
        requireTwoFactor: "2FA requise",
        marketingConsent: "Consentement marketing",
        userRoles: {
          item: {
            title: "Rôle",
            description: "Attribution du rôle utilisateur",
          },
          id: "ID du rôle",
          role: "Rôle",
        },
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
      },
    },
    columns: {
      firstName: "Prénom",
      lastName: "Nom",
      privateName: "Nom privé",
      publicName: "Nom public",
      email: "E-mail",
      company: "Entreprise",
      userRoles: "Rôles",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de recherche invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Recherche non autorisée",
      },
      internal: {
        title: "Erreur interne",
        description: "Erreur interne du serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun utilisateur trouvé",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu lors de la recherche",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Les modifications n'ont pas été enregistrées",
      },
    },
    success: {
      title: "Recherche réussie",
      description: "Recherche terminée avec succès",
    },
    post: {
      title: "Recherche",
      description: "Endpoint de recherche",
      form: {
        title: "Configuration de la recherche",
        description: "Configurer les paramètres de recherche",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse de la recherche",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de données est survenu",
        },
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
  },
  "session-cleanup": {
    category: "Utilisateurs",

    post: {
      title: "Nettoyage des sessions",
      description: "Supprimer les sessions et jetons utilisateur expirés",
      tag: "Nettoyage des sessions",
      container: {
        title: "Nettoyage des sessions",
        description: "Configurer et lancer le nettoyage des sessions",
      },
      fields: {
        sessionRetentionDays: {
          label: "Durée de conservation des sessions (jours)",
          description: "Nombre de jours de conservation des sessions",
        },
        tokenRetentionDays: {
          label: "Durée de conservation des jetons (jours)",
          description: "Nombre de jours de conservation des jetons",
        },
        batchSize: {
          label: "Taille des lots",
          description: "Nombre d'enregistrements traités par lot",
        },
        dryRun: {
          label: "Simulation",
          description: "Exécuter sans réellement supprimer d'enregistrements",
        },
      },
      response: {
        sessionsDeleted: "Sessions supprimées",
        tokensDeleted: "Jetons supprimés",
        totalProcessed: "Total traité",
        executionTimeMs: "Durée d'exécution (ms)",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous devez être administrateur pour lancer le nettoyage des sessions",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès interdit",
        },
        server: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur pendant le nettoyage",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        validation: {
          title: "Erreur de validation",
          description: "Configuration de nettoyage invalide",
        },
      },
      success: {
        title: "Nettoyage des sessions terminé",
        description: "Sessions et jetons nettoyés avec succès",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Supprimer les sessions utilisateur expirées pour préserver la sécurité du système",
      purpose:
        "Supprime les sessions expirées pour préserver la sécurité et les performances",
      impact:
        "Améliore les performances et la sécurité du système en supprimant les données de session obsolètes",
      rollback:
        "Aucun retour arrière possible pour les opérations de nettoyage",
    },
    errors: {
      default: "Une erreur est survenue lors du nettoyage des sessions",
      execution_failed: {
        title: "Échec du nettoyage des sessions",
        description: "Impossible de supprimer les sessions expirées",
      },
      partial_failure: {
        title: "Nettoyage des sessions partiellement échoué",
        description: "Certaines sessions n'ont pas pu être supprimées",
      },
      unknown_error: {
        title: "Erreur inconnue lors du nettoyage des sessions",
        description:
          "Une erreur inconnue est survenue lors du nettoyage des sessions",
      },
      invalid_session_retention: {
        title: "Conservation des sessions invalide",
        description:
          "La durée de conservation des sessions indiquée est invalide",
      },
      invalid_token_retention: {
        title: "Conservation des jetons invalide",
        description:
          "La durée de conservation des jetons indiquée est invalide",
      },
      invalid_batch_size: {
        title: "Taille de lot invalide",
        description: "La taille de lot indiquée pour le nettoyage est invalide",
      },
      validation_failed: {
        title: "Échec de la validation",
        description:
          "La validation de la configuration du nettoyage des sessions a échoué",
      },
    },
    success: {
      title: "Nettoyage des sessions terminé",
      description: "Les sessions expirées ont bien été supprimées",
    },
    monitoring: {
      alertTrigger: "La tâche de nettoyage des sessions a échoué",
    },
    documentation: {
      overview:
        "Cette tâche supprime les sessions utilisateur expirées du système pour préserver la sécurité et les performances",
    },
  },
  sessionCleanup: {
    category: "Utilisateurs",

    post: {
      title: "Nettoyage des sessions",
      description: "Supprimer les sessions et jetons utilisateur expirés",
      tag: "Nettoyage des sessions",
      container: {
        title: "Nettoyage des sessions",
        description: "Configurer et lancer le nettoyage des sessions",
      },
      fields: {
        sessionRetentionDays: {
          label: "Durée de conservation des sessions (jours)",
          description: "Nombre de jours de conservation des sessions",
        },
        tokenRetentionDays: {
          label: "Durée de conservation des jetons (jours)",
          description: "Nombre de jours de conservation des jetons",
        },
        batchSize: {
          label: "Taille des lots",
          description: "Nombre d'enregistrements traités par lot",
        },
        dryRun: {
          label: "Simulation",
          description: "Exécuter sans réellement supprimer d'enregistrements",
        },
      },
      response: {
        sessionsDeleted: "Sessions supprimées",
        tokensDeleted: "Jetons supprimés",
        totalProcessed: "Total traité",
        executionTimeMs: "Durée d'exécution (ms)",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous devez être administrateur pour lancer le nettoyage des sessions",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès interdit",
        },
        server: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur pendant le nettoyage",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        validation: {
          title: "Erreur de validation",
          description: "Configuration de nettoyage invalide",
        },
      },
      success: {
        title: "Nettoyage des sessions terminé",
        description: "Sessions et jetons nettoyés avec succès",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Supprimer les sessions utilisateur expirées pour préserver la sécurité du système",
      purpose:
        "Supprime les sessions expirées pour préserver la sécurité et les performances",
      impact:
        "Améliore les performances et la sécurité du système en supprimant les données de session obsolètes",
      rollback:
        "Aucun retour arrière possible pour les opérations de nettoyage",
    },
    errors: {
      default: "Une erreur est survenue lors du nettoyage des sessions",
      execution_failed: {
        title: "Échec du nettoyage des sessions",
        description: "Impossible de supprimer les sessions expirées",
      },
      partial_failure: {
        title: "Nettoyage des sessions partiellement échoué",
        description: "Certaines sessions n'ont pas pu être supprimées",
      },
      unknown_error: {
        title: "Erreur inconnue lors du nettoyage des sessions",
        description:
          "Une erreur inconnue est survenue lors du nettoyage des sessions",
      },
      invalid_session_retention: {
        title: "Conservation des sessions invalide",
        description:
          "La durée de conservation des sessions indiquée est invalide",
      },
      invalid_token_retention: {
        title: "Conservation des jetons invalide",
        description:
          "La durée de conservation des jetons indiquée est invalide",
      },
      invalid_batch_size: {
        title: "Taille de lot invalide",
        description: "La taille de lot indiquée pour le nettoyage est invalide",
      },
      validation_failed: {
        title: "Échec de la validation",
        description:
          "La validation de la configuration du nettoyage des sessions a échoué",
      },
    },
    success: {
      title: "Nettoyage des sessions terminé",
      description: "Les sessions expirées ont bien été supprimées",
    },
    monitoring: {
      alertTrigger: "La tâche de nettoyage des sessions a échoué",
    },
    documentation: {
      overview:
        "Cette tâche supprime les sessions utilisateur expirées du système pour préserver la sécurité et les performances",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Impossible de trouver les rôles utilisateur",
      batch_find_failed:
        "Impossible de récupérer les rôles utilisateur par lot",
      not_found: "Rôle utilisateur introuvable",
      lookup_failed: "Impossible de rechercher le rôle utilisateur",
      add_failed: "Impossible d'attribuer le rôle à l'utilisateur",
      no_data_returned: "Aucune donnée renvoyée par la base de données",
      remove_failed: "Impossible de retirer le rôle de l'utilisateur",
      check_failed: "Impossible de vérifier si l'utilisateur possède le rôle",
      delete_failed: "Impossible de supprimer les rôles utilisateur",
      endpoint_not_created:
        "L'endpoint des rôles utilisateur n'a pas encore été créé",
    },
    post: {
      title: "Rôles utilisateur",
      description: "Endpoint des rôles utilisateur",
      form: {
        title: "Configuration des rôles utilisateur",
        description: "Configurer les paramètres des rôles utilisateur",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse des rôles utilisateur",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de données est survenu",
        },
        database_connection_failed: {
          title: "Échec de connexion à la base de données",
          description: "Impossible de se connecter à la base de données",
        },
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
    enums: {
      userRole: {
        public: "Public",
        customer: "Client",
        partnerAdmin: "Administrateur partenaire",
        partnerEmployee: "Employé partenaire",
        admin: "Administrateur",
        cliOff: "CLI désactivée",
        cliAuthBypass: "Contournement de l'auth CLI",
        aiToolOff: "Outil IA désactivé",
        webOff: "Web désactivé",
        mcpOff: "MCP désactivé",
        mcpVisible: "Visible dans MCP",
        productionOff: "Production désactivée",
        skillOff: "Skill désactivée",
      },
    },
  },
  profileVisibility: {
    public: "Public",
    private: "Privé",
    contactsOnly: "Contacts uniquement",
  },
  contactMethods: {
    email: "E-mail",
    phone: "Téléphone",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Complet",
  },
  language: {
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
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
    emailAlreadyInUse: "Cette adresse e-mail est déjà utilisée",
    locale_required: "La langue est obligatoire",
    auth_required: "Authentification requise. Un de ces rôles : {{roles}}",
    auth_retrieval_failed:
      "Impossible de récupérer l'authentification : {{error}}",
    not_found: "Utilisateur introuvable",
    not_found_by_id: "Aucun utilisateur trouvé avec l'ID {{userId}}",
    not_found_by_email:
      "Aucun utilisateur trouvé avec l'adresse e-mail {{email}}",
    roles_lookup_failed:
      "Impossible de rechercher les rôles de l'utilisateur {{userId}}",
    roles_batch_fetch_failed:
      "Impossible de récupérer par lot les rôles de {{count}} utilisateurs",
    id_lookup_failed:
      "Impossible de rechercher l'utilisateur {{userId}} : {{error}}",
    email_lookup_failed:
      "Impossible de rechercher l'utilisateur par l'adresse e-mail {{email}} : {{error}}",
    email_check_failed:
      "Impossible de vérifier l'adresse e-mail {{email}} : {{error}}",
    email_duplicate_check_failed:
      "Impossible de comparer l'adresse e-mail {{email}} aux autres utilisateurs (hors {{excludeUserId}}) : {{error}}",
    search_failed:
      "Impossible de rechercher des utilisateurs pour {{query}} : {{error}}",
    list_failed: "Impossible de lister les utilisateurs : {{error}}",
    email_already_in_use: "Cette adresse e-mail est déjà utilisée",
    creation_failed: "Impossible de créer l'utilisateur : {{error}}",
    no_data_returned: "Aucune donnée renvoyée par la base de données",
    password_hashing_failed:
      "Impossible de hacher le mot de passe pour {{email}} : {{error}}",
    not_implemented_on_native:
      "Cette fonctionnalité n'est pas disponible sur React Native",
    count_failed: "Impossible d'obtenir le nombre d'utilisateurs : {{error}}",
  },
  userNoteType: {
    note: "Note",
    call: "Appel",
    email: "E-mail",
    meeting: "Réunion",
    task: "Tâche",
  },
  notifications: {
    profileUpdated: {
      title: "Profil mis à jour",
      description: "Votre profil a bien été mis à jour",
    },
    updateFailed: {
      title: "Échec de la mise à jour",
      description:
        "Impossible de mettre à jour votre profil. Veuillez réessayer.",
    },
  },
};
