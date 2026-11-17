import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",
  tag: "Gestion des utilisateurs",

  id: {
    roles: {
      post: {
        title: "Ajouter un rôle",
        description: "Attribuer un rôle à un compte utilisateur",
        container: {
          title: "Ajouter un rôle",
          description: "Choisissez le rôle à attribuer à cet utilisateur",
        },
        id: {
          label: "ID utilisateur",
          description: "Identifiant unique de l'utilisateur qui reçoit le rôle",
          placeholder: "Saisir l'ID utilisateur...",
        },
        role: {
          label: "Rôle",
          description: "Le rôle à attribuer à l'utilisateur",
          placeholder: "Choisir un rôle...",
        },
        submit: {
          label: "Ajouter le rôle",
        },
        response: {
          roleId: {
            content: "ID d'attribution du rôle",
          },
          userId: {
            content: "ID utilisateur",
          },
          assignedRole: {
            content: "Rôle attribué",
          },
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description:
              "Vous devez être connecté pour gérer les rôles des utilisateurs",
          },
          validation: {
            title: "Validation échouée",
            description: "Indiquez un ID utilisateur et un rôle valides",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Seuls les administrateurs peuvent gérer les rôles des utilisateurs",
          },
          notFound: {
            title: "Utilisateur introuvable",
            description: "L'utilisateur indiqué est introuvable",
          },
          conflict: {
            title: "Rôle déjà attribué",
            description: "Cet utilisateur possède déjà ce rôle",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de se connecter au serveur",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Vos modifications non enregistrées seront perdues",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Impossible d'ajouter le rôle suite à une erreur serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description:
              "Une erreur inattendue s'est produite lors de l'ajout du rôle",
          },
        },
        success: {
          title: "Rôle ajouté",
          description: "Le rôle a bien été attribué à l'utilisateur",
        },
      },
      delete: {
        title: "Retirer un rôle",
        description: "Retirer un rôle à un compte utilisateur",
        container: {
          title: "Retirer un rôle",
          description: "Choisissez le rôle à retirer à cet utilisateur",
        },
        id: {
          label: "ID utilisateur",
          description: "Identifiant unique de l'utilisateur qui perd le rôle",
          placeholder: "Saisir l'ID utilisateur...",
        },
        role: {
          label: "Rôle",
          description: "Le rôle à retirer à l'utilisateur",
          placeholder: "Choisir un rôle...",
        },
        submit: {
          label: "Retirer le rôle",
        },
        response: {
          success: {
            content: "Rôle retiré",
          },
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description:
              "Vous devez être connecté pour gérer les rôles des utilisateurs",
          },
          validation: {
            title: "Validation échouée",
            description: "Indiquez un ID utilisateur et un rôle valides",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Seuls les administrateurs peuvent gérer les rôles des utilisateurs",
          },
          notFound: {
            title: "Utilisateur introuvable",
            description: "L'utilisateur indiqué est introuvable",
          },
          conflict: {
            title: "Conflit",
            description:
              "Impossible de retirer le rôle à cause de dépendances existantes",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de se connecter au serveur",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Vos modifications non enregistrées seront perdues",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Impossible de retirer le rôle suite à une erreur serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description:
              "Une erreur inattendue s'est produite lors du retrait du rôle",
          },
        },
        success: {
          title: "Rôle retiré",
          description: "Le rôle a bien été retiré à l'utilisateur",
        },
      },
    },
    get: {
      title: "Afficher l'utilisateur",
      titleShort: "Détails de l'utilisateur",
      description: "Obtenir les informations détaillées d'un utilisateur",
      container: {
        title: "Détails de l'utilisateur",
        description: "Informations détaillées sur l'utilisateur",
      },
      id: {
        label: "ID utilisateur",
        description: "Identifiant unique de l'utilisateur",
        placeholder: "Saisir l'ID utilisateur...",
      },
      response: {
        userProfile: {
          title: "Profil utilisateur",
          description: "Informations détaillées du profil",
          basicInfo: {
            title: "Informations de base",
            description: "Informations principales de l'utilisateur",
            id: {
              content: "ID utilisateur",
            },
            email: {
              content: "Adresse e-mail",
            },
            privateName: {
              content: "Nom privé",
            },
            publicName: {
              content: "Nom public",
            },
            firstName: {
              content: "Prénom",
            },
            lastName: {
              content: "Nom",
            },
            company: {
              content: "Entreprise",
            },
          },
          contactDetails: {
            title: "Coordonnées",
            description: "Coordonnées de l'utilisateur",
            phone: {
              content: "Numéro de téléphone",
            },
            preferredContactMethod: {
              content: "Moyen de contact préféré",
            },
            website: {
              content: "Site web",
            },
          },
        },
        profileDetails: {
          title: "Détails du profil",
          description: "Informations de profil complémentaires",
          imageUrl: {
            content: "Photo de profil",
          },
          bio: {
            content: "Biographie",
          },
          jobTitle: {
            content: "Poste",
          },
          leadId: {
            content: "ID du lead associé",
          },
        },
        accountStatus: {
          title: "Statut du compte",
          description: "Informations sur le statut du compte",
          isActive: {
            content: "Statut actif",
          },
          emailVerified: {
            content: "E-mail vérifié",
          },
          stripeCustomerId: {
            content: "ID client Stripe",
          },
          userRoles: {
            content: "Rôles de l'utilisateur",
          },
        },
        timestamps: {
          title: "Horodatages",
          description: "Dates de création et de mise à jour",
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
        },
        referralInfo: {
          title: "Parrainage",
          description: "Chaîne de parrainage et gains",
          referredByUserId: {
            content: "Parrainé par (ID utilisateur)",
          },
          referredByCode: {
            content: "Code de parrainage utilisé",
          },
          totalReferrals: {
            content: "Utilisateurs parrainés",
          },
          totalEarnedCents: {
            content: "Total gagné (centimes)",
          },
          confirmedEarnedCents: {
            content: "Gains confirmés (centimes)",
          },
          pendingEarnedCents: {
            content: "Gains en attente (centimes)",
          },
        },
        engagement: {
          title: "Crédits et engagement",
          description: "Solde, dépenses, gains et activité",
          creditBalance: {
            content: "Solde de crédits",
          },
          freeAllowance: {
            content: "Quota gratuit",
          },
          lifetimeCreditsSpent: {
            content: "Dépense totale",
          },
          favoritesCount: {
            content: "Favoris",
          },
          customSkillsCount: {
            content: "Skills personnalisés",
          },
          newsletterConsent: {
            content: "Consentement newsletter",
          },
          hasConfirmedNewsletter: {
            content: "Newsletter confirmée",
          },
        },
        leadId: {
          content: "ID du lead associé",
        },
        email: {
          content: "Adresse e-mail",
        },
        privateName: {
          content: "Nom privé",
        },
        publicName: {
          content: "Nom public",
        },
        firstName: {
          content: "Prénom",
        },
        lastName: {
          content: "Nom",
        },
        company: {
          content: "Entreprise",
        },
        phone: {
          content: "Numéro de téléphone",
        },
        preferredContactMethod: {
          content: "Moyen de contact préféré",
        },
        imageUrl: {
          content: "Photo de profil",
        },
        bio: {
          content: "Biographie",
        },
        website: {
          content: "Site web",
        },
        jobTitle: {
          content: "Poste",
        },
        emailVerified: {
          content: "E-mail vérifié",
        },
        isActive: {
          content: "Statut actif",
        },
        stripeCustomerId: {
          content: "ID client Stripe",
        },
        userRoles: {
          content: "Rôles de l'utilisateur",
        },
        createdAt: {
          content: "Créé le",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
      errors: {
        unauthorized: {
          title: "Accès non autorisé",
          description:
            "Vous devez être connecté pour voir les détails d'un utilisateur",
        },
        validation: {
          title: "Validation échouée",
          description: "ID utilisateur invalide",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de voir cet utilisateur",
        },
        notFound: {
          title: "Utilisateur introuvable",
          description: "L'utilisateur demandé est introuvable",
          detail: "Aucun utilisateur avec l'ID {{userId}}.",
        },
        conflict: {
          title: "Conflit",
          description:
            "Impossible de récupérer l'utilisateur à cause de conflits existants",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Impossible de récupérer l'utilisateur suite à une erreur serveur",
          detail: "Impossible de charger cet utilisateur : {{error}}",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de la récupération de l'utilisateur",
        },
      },
      success: {
        title: "Utilisateur récupéré",
        description: "Les détails de l'utilisateur ont bien été récupérés",
      },
    },
    put: {
      title: "Modifier l'utilisateur",
      titleShort: "Modifier l'utilisateur",
      description: "Modifier les informations et le profil d'un utilisateur",
      container: {
        title: "Modifier l'utilisateur",
        description: "Modifier les informations et les paramètres",
      },
      id: {
        label: "ID utilisateur",
        description: "Identifiant unique de l'utilisateur à modifier",
        placeholder: "Saisir l'ID utilisateur...",
      },
      sections: {
        basicInfo: {
          title: "Informations de base",
          description: "Modifier les informations de base",
        },
        contactInfo: {
          title: "Coordonnées",
          description: "Modifier les coordonnées",
        },
        profileDetails: {
          title: "Détails du profil",
          description: "Modifier les informations de profil complémentaires",
        },
        adminSettings: {
          title: "Paramètres d'administration",
          description: "Modifier les paramètres d'administration",
        },
      },
      email: {
        label: "Adresse e-mail",
        description:
          "Adresse e-mail de l'utilisateur pour la connexion et les échanges",
        placeholder: "Saisir l'adresse e-mail...",
      },
      privateName: {
        label: "Nom privé",
        description:
          "Nom légal complet de l'utilisateur (visible uniquement par les admins)",
      },
      publicName: {
        label: "Nom public",
        description:
          "Nom d'affichage de l'utilisateur (visible par tous les utilisateurs)",
      },
      firstName: {
        label: "Prénom",
        description: "Prénom de l'utilisateur",
        placeholder: "Saisir le prénom...",
      },
      lastName: {
        label: "Nom",
        description: "Nom de famille de l'utilisateur",
        placeholder: "Saisir le nom...",
      },
      company: {
        label: "Entreprise",
        description: "Entreprise ou organisation de l'utilisateur",
        placeholder: "Saisir le nom de l'entreprise...",
      },
      phone: {
        label: "Numéro de téléphone",
        description: "Numéro de téléphone de l'utilisateur",
        placeholder: "Saisir le numéro de téléphone...",
      },
      preferredContactMethod: {
        label: "Moyen de contact préféré",
        description: "Comment l'utilisateur préfère être contacté",
      },
      bio: {
        label: "Biographie",
        description: "Courte présentation de l'utilisateur",
        placeholder: "Saisir la biographie...",
      },
      website: {
        label: "Site web",
        description: "Site personnel ou professionnel de l'utilisateur",
        placeholder: "Saisir l'URL du site...",
      },
      jobTitle: {
        label: "Poste",
        description: "Poste ou fonction de l'utilisateur",
        placeholder: "Saisir le poste...",
      },
      emailVerified: {
        label: "E-mail vérifié",
        description: "Indique si l'e-mail de l'utilisateur est vérifié",
      },
      isActive: {
        label: "Statut actif",
        description: "Indique si le compte utilisateur est actif",
      },
      leadId: {
        label: "ID du lead",
        description: "Identifiant du lead associé",
        placeholder: "Saisir l'ID du lead...",
      },
      isBanned: {
        label: "Banni",
        description: "Indique si l'utilisateur est banni de la plateforme",
      },
      bannedReason: {
        label: "Motif du bannissement",
        description: "Raison du bannissement de l'utilisateur",
      },
      response: {
        leadId: {
          content: "ID du lead associé",
        },
        email: {
          content: "Adresse e-mail",
        },
        privateName: {
          content: "Nom privé",
        },
        publicName: {
          content: "Nom public",
        },
        firstName: {
          content: "Prénom",
        },
        lastName: {
          content: "Nom",
        },
        company: {
          content: "Entreprise",
        },
        phone: {
          content: "Numéro de téléphone",
        },
        preferredContactMethod: {
          content: "Moyen de contact préféré",
        },
        imageUrl: {
          content: "Photo de profil",
        },
        bio: {
          content: "Biographie",
        },
        website: {
          content: "Site web",
        },
        jobTitle: {
          content: "Poste",
        },
        emailVerified: {
          content: "E-mail vérifié",
        },
        isActive: {
          content: "Statut actif",
        },
        stripeCustomerId: {
          content: "ID client Stripe",
        },
        userRoles: {
          content: "Rôles de l'utilisateur",
        },
        createdAt: {
          content: "Créé le",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
      errors: {
        unauthorized: {
          title: "Accès non autorisé",
          description:
            "Vous devez être connecté pour modifier des utilisateurs",
        },
        validation: {
          title: "Validation échouée",
          description: "Vérifiez les données du formulaire et réessayez",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de modifier cet utilisateur",
        },
        notFound: {
          title: "Utilisateur introuvable",
          description: "L'utilisateur à modifier est introuvable",
          detail: "Aucun utilisateur avec l'ID {{userId}}.",
        },
        conflict: {
          title: "Conflit de mise à jour",
          description:
            "Les données de l'utilisateur sont en conflit avec des enregistrements existants",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Impossible de modifier l'utilisateur suite à une erreur serveur",
          detail:
            "Impossible d'enregistrer les modifications de cet utilisateur : {{error}}",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de la modification de l'utilisateur",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
      },
      success: {
        title: "Utilisateur modifié",
        description: "Les informations de l'utilisateur ont bien été modifiées",
      },
    },
    delete: {
      title: "Supprimer l'utilisateur",
      titleShort: "Supprimer l'utilisateur",
      description: "Supprimer définitivement un compte utilisateur",
      container: {
        title: "Supprimer l'utilisateur",
        description: "Retirer définitivement l'utilisateur du système",
      },
      id: {
        label: "ID utilisateur",
        description: "Identifiant unique de l'utilisateur à supprimer",
        placeholder: "Saisir l'ID utilisateur...",
        helpText: "ATTENTION : cette action est irréversible",
      },
      submitButton: {
        label: "Supprimer l'utilisateur",
        loadingText: "Suppression...",
      },
      response: {
        deletionResult: {
          title: "Résultat de la suppression",
          description: "Résultat de l'opération de suppression",
          success: {
            content: "Suppression réussie",
          },
          message: {
            content: "Message de suppression",
          },
          deletedAt: {
            content: "Supprimé le",
          },
        },
        success: {
          content: "Suppression réussie",
        },
        message: {
          content: "Message de suppression",
        },
      },
      errors: {
        unauthorized: {
          title: "Accès non autorisé",
          description:
            "Vous devez être connecté pour supprimer des utilisateurs",
        },
        validation: {
          title: "Validation échouée",
          description: "ID utilisateur invalide pour la suppression",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de supprimer des utilisateurs",
        },
        notFound: {
          title: "Utilisateur introuvable",
          description: "L'utilisateur à supprimer est introuvable",
          detail: "Aucun utilisateur avec l'ID {{userId}}.",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Impossible de supprimer l'utilisateur suite à une erreur serveur",
          detail: "Impossible de supprimer cet utilisateur : {{error}}",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de la suppression de l'utilisateur",
        },
        conflict: {
          title: "Conflit",
          description:
            "Impossible de supprimer l'utilisateur à cause de dépendances existantes",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
      },
      success: {
        title: "Utilisateur supprimé",
        description: "L'utilisateur a bien été supprimé",
      },
    },
    widget: {
      userProfile: "Profil utilisateur",
      active: "Actif",
      inactive: "Inactif",
      leadId: "ID du lead :",
      viewLead: "Voir le lead",
      created: "Créé",
      lastUpdated: "Dernière mise à jour",
      fullProfile: "Profil complet",
      referrals: "Parrainages",
      subscription: "Abonnement",
      creditHistory: "Historique des crédits",
      engagementTitle: "Crédits et engagement",
      balance: "Solde",
      freeAllowance: "Offre gratuite",
      lifetimeSpend: "Dépense totale",
      earned: "Gagné",
      earnedPending: "En attente :",
      referred: "Parrainés",
      favorites: "Favoris",
      skills: "Skills",
      newsletter: "Newsletter",
      newsletterConfirmed: "Confirmée",
      newsletterConsent: "Inscrit",
      newsletterNone: "Aucune",
      deleteUser: "Supprimer l'utilisateur",
      userDeletedSuccessfully: "Utilisateur supprimé",
      deletedAt: "Supprimé le",
      confirmDeletion: "Confirmer la suppression",
      confirmDeletionMessage:
        "L'utilisateur et toutes ses données associées seront définitivement supprimés. Cette action est irréversible.",
      titleReferralCodes: "Voir les codes de parrainage et leurs stats",
      titleSubscription: "Voir l'abonnement",
      titleCopyUserId: "Copier l'ID utilisateur",
    },
    getCrm: {
      get: {
        title: "Profil CRM de l'utilisateur",
        titleShort: "Profil CRM",
        description:
          "Obtenir les données de facturation d'un utilisateur et son nombre de notes",
        fields: {
          userId: {
            label: "ID utilisateur",
            description: "L'utilisateur à consulter",
            placeholder: "UUID de l'utilisateur",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "ID utilisateur invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Vous devez être connecté",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Vous n'avez pas accès aux données CRM de cet utilisateur",
          },
          notFound: {
            title: "Introuvable",
            description: "Utilisateur introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "La requête réseau a échoué",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Des modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Erreur serveur. Réessayez",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
        },
        success: {
          title: "Profil CRM chargé",
          description: "Données CRM de l'utilisateur récupérées",
        },
        widget: {
          addNote: "Ajouter une note",
          viewNotes: "Voir les notes",
        },
        response: {
          id: "ID utilisateur",
          email: "E-mail",
          privateName: "Nom",
          companyBillingName: "Entreprise / nom de facturation",
          vatNumber: "Numéro de TVA",
          taxId: "Numéro fiscal",
          phone: "Téléphone",
          addressLine1: "Adresse, ligne 1",
          addressLine2: "Adresse, ligne 2",
          city: "Ville",
          region: "Région",
          postalCode: "Code postal",
          billingCountry: "Pays",
          defaultCurrency: "Devise par défaut",
          paymentTermsDays: "Délai de paiement (jours)",
          notesCount: "Nombre de notes",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Créer une note utilisateur",
        titleShort: "Créer une note",
        description:
          "Ajouter une note CRM, un appel, un e-mail, une réunion ou une tâche pour un utilisateur",
        fields: {
          userId: {
            label: "Utilisateur",
            description: "L'utilisateur concerné par cette note",
            placeholder: "Choisir un utilisateur",
          },
          type: {
            label: "Type d'activité",
            description: "Le type d'interaction enregistrée",
            placeholder: "Choisir un type",
          },
          content: {
            label: "Contenu",
            description: "Détails de l'activité",
            placeholder: "Décrivez ce qui s'est passé...",
          },
          isPrivate: {
            label: "Privée",
            description: "Vous seul voyez les notes privées",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Vérifiez les champs et réessayez",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Vous devez être connecté",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Vous n'avez pas accès à cet utilisateur",
          },
          notFound: {
            title: "Introuvable",
            description: "Utilisateur introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "La requête réseau a échoué",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Des modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Erreur serveur. Réessayez",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
        },
        success: {
          title: "Note créée",
          description: "La note a été enregistrée",
        },
        widget: {
          created: "Note créée",
          noteId: "ID de la note",
          backToNotes: "Retour aux notes",
        },
        response: {
          id: "ID de la note",
          userId: "ID utilisateur",
          authorUserId: "ID de l'auteur",
          type: "Type",
          content: "Contenu",
          isPrivate: "Privée",
          createdAt: "Créée le",
          updatedAt: "Mise à jour le",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "Notes de l'utilisateur",
        titleShort: "Notes utilisateur",
        description:
          "Lister les notes CRM d'un utilisateur, filtrées par type et visibilité",
        fields: {
          userId: {
            label: "ID utilisateur",
            description: "L'utilisateur dont lister les notes",
            placeholder: "UUID de l'utilisateur",
          },
          type: {
            label: "Type",
            description: "Filtrer par type d'activité",
            placeholder: "Tous les types",
          },
          isPrivate: {
            label: "Privées uniquement",
            description: "Afficher uniquement vos notes privées",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Vérifiez les filtres et réessayez",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Vous devez être connecté",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Vous n'avez pas accès à ces notes",
          },
          notFound: {
            title: "Introuvable",
            description: "Utilisateur introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "La requête réseau a échoué",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Des modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Erreur serveur. Réessayez",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
        },
        success: {
          title: "Notes chargées",
          description: "Notes récupérées",
        },
        widget: {
          addNote: "Ajouter une note",
          total: "Total",
          empty: "Aucune note pour l'instant",
          delete: "Supprimer",
          private: "Privée",
          ago: "plus tôt",
        },
        response: {
          notes: "Notes",
          total: "Total",
          note: {
            id: "ID de la note",
            userId: "ID utilisateur",
            authorUserId: "ID de l'auteur",
            type: "Type",
            content: "Contenu",
            isPrivate: "Privée",
            createdAt: "Créée le",
            updatedAt: "Mise à jour le",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Supprimer une note utilisateur",
        titleShort: "Supprimer la note",
        description:
          "Supprimer une note CRM. Seul l'auteur ou un admin peut le faire",
        fields: {
          noteId: {
            label: "ID de la note",
            description: "La note à supprimer",
            placeholder: "UUID de la note",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "ID de note invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Vous devez être connecté",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Seul l'auteur ou un admin peut supprimer cette note",
          },
          notFound: {
            title: "Introuvable",
            description: "Note introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "La requête réseau a échoué",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Des modifications ne sont pas enregistrées",
          },
          internal: {
            title: "Erreur interne",
            description: "Erreur serveur. Réessayez",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
        },
        success: {
          title: "Note supprimée",
          description: "La note a été définitivement supprimée",
        },
        widget: {
          warning: "Cette note sera définitivement supprimée.",
          deleted: "Note supprimée.",
          backToNotes: "Retour aux notes",
        },
        response: {
          deleted: "Supprimée",
        },
      },
      tag: "CRM",
    },
  },
};
