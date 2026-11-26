import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",
  tags: {
    create: "Création",
    admin: "Admin",
  },
  post: {
    title: "Créer un utilisateur",
    titleShort: "Créer un utilisateur",
    description: "Créer un nouveau compte utilisateur",
    form: {
      title: "Formulaire de création d'utilisateur",
      description:
        "Renseignez les informations pour créer un nouvel utilisateur",
    },
    email: {
      label: "Adresse e-mail",
      description:
        "Adresse e-mail de l'utilisateur, pour la connexion et les échanges",
    },
    password: {
      label: "Mot de passe",
      description: "Utilisez au moins 8 caractères.",
    },
    privateName: {
      label: "Nom privé",
      description:
        "Nom légal complet de l'utilisateur (visible uniquement par les admins)",
    },
    publicName: {
      label: "Nom public",
      description: "Nom affiché de l'utilisateur (visible par tous)",
    },
    firstName: {
      label: "Prénom",
      description: "Prénom de l'utilisateur",
    },
    lastName: {
      label: "Nom",
      description: "Nom de famille de l'utilisateur",
    },
    company: {
      label: "Entreprise",
      description: "Entreprise ou organisation de l'utilisateur",
    },
    phone: {
      label: "Numéro de téléphone",
      description: "Numéro de téléphone de contact de l'utilisateur",
    },
    preferredContactMethod: {
      label: "Moyen de contact préféré",
      description: "Comment l'utilisateur préfère être contacté",
    },
    roles: {
      label: "Rôles de l'utilisateur",
      placeholder: "Attribuer des rôles",
      description: "Attribuer des rôles à l'utilisateur",
    },
    imageUrl: {
      label: "URL de la photo de profil",
      description: "URL de la photo de profil de l'utilisateur",
    },
    bio: {
      label: "Biographie",
      description: "Courte présentation de l'utilisateur",
    },
    website: {
      label: "Site web",
      description: "Site web personnel ou professionnel de l'utilisateur",
    },
    jobTitle: {
      label: "Poste",
      description: "Intitulé du poste ou fonction de l'utilisateur",
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
    },
    country: {
      label: "Pays",
      placeholder: "Choisir un pays",
      description: "Pays de résidence de l'utilisateur",
    },
    language: {
      label: "Langue",
      placeholder: "Choisir une langue",
      description: "Langue préférée de l'utilisateur",
    },
    response: {
      title: "Utilisateur créé",
      description: "Détails du nouvel utilisateur",
      id: {
        content: "ID utilisateur",
      },
      leadId: {
        content: "ID du lead associé",
      },
      country: {
        label: "Pays",
        description: "Pays de résidence de l'utilisateur",
      },
      language: {
        label: "Langue",
        description: "Langue préférée de l'utilisateur",
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
        id: {
          content: "ID du rôle",
        },
        role: {
          content: "Rôle",
        },
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
        description: "Vous devez être connecté pour créer des utilisateurs",
      },
      validation: {
        title: "Échec de la validation",
        description: "Vérifiez les données du formulaire et réessayez",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Impossible de créer l'utilisateur suite à une erreur serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors de la création de l'utilisateur",
      },
      network: {
        title: "Erreur réseau",
        description:
          "La connexion réseau a échoué pendant la création de l'utilisateur",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de créer des utilisateurs",
      },
      notFound: {
        title: "Ressource introuvable",
        description:
          "Une ressource requise pour la création de l'utilisateur est introuvable",
      },
      conflict: {
        title: "Utilisateur déjà existant",
        description: "Un utilisateur avec cet e-mail existe déjà",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications non enregistrées seront perdues",
      },
      internal: {
        title: "Erreur interne : {{details}}",
        description:
          "Une erreur interne s'est produite lors de la création de l'utilisateur",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "Échec du SMS de bienvenue",
          description:
            "Impossible d'envoyer le SMS de bienvenue à l'utilisateur",
        },
        verification_failed: {
          title: "Échec du SMS de vérification",
          description:
            "Impossible d'envoyer le SMS de vérification à l'utilisateur",
        },
      },
    },
    success: {
      title: "Utilisateur créé",
      description: "Le nouveau compte utilisateur a été créé",
      message: {
        content: "Utilisateur créé avec succès",
      },
      created: {
        content: "Créé",
      },
    },
  },
  widget: {
    headerCreated: "Utilisateur créé",
    headerCreate: "Nouvel utilisateur",
    headerSubtitle:
      "Ajoutez un compte admin ou client. La connexion fonctionne tout de suite.",
    activeBadge: "Actif",
    verifiedBadge: "Vérifié",
    copiedTooltip: "Copié !",
    copyUserIdTooltip: "Copier l'ID utilisateur",
    copyIdButton: "Copier l'ID",
    copiedButton: "Copié !",
    viewUserButton: "Voir l'utilisateur",
    fullProfileButton: "Profil complet",
    creditHistoryButton: "Historique des crédits",
    createAnotherButton: "Créer un autre utilisateur",
    createdPrefix: "Créé",
    createButton: "Créer l'utilisateur",
    sections: {
      signIn: "Connexion",
      profile: "Profil",
      access: "Accès",
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "Bienvenue, {{firstName}} !",
        preview: "Votre compte a bien été créé",
        subject: "Bienvenue sur {{companyName}} : votre compte est prêt",
        introduction:
          "Bonjour {{firstName}}, ravis de vous compter parmi nous ! Votre compte a bien été créé et toutes nos fonctionnalités vous sont ouvertes.",
        accountDetails: "Détails du compte",
        email: "E-mail",
        name: "Nom",
        publicName: "Nom affiché",
        company: "Entreprise",
        phone: "Téléphone",
        nextSteps: "Prochaines étapes",
        loginButton: "Se connecter à votre compte",
        support:
          "Une question ? Notre équipe support est là pour vous aider. Contactez-nous à tout moment.",
      },
      admin: {
        newUser: "Nouvel utilisateur créé",
        preview:
          "Un nouvel utilisateur, {{firstName}} {{lastName}}, a été créé",
        subject: "Nouveau compte utilisateur : {{firstName}} {{lastName}}",
        notification:
          "Un nouveau compte utilisateur a été créé dans le système. Voici les détails :",
        userDetails: "Détails de l'utilisateur",
        viewUser: "Voir le profil",
      },
      errors: {
        missing_data:
          "Des données utilisateur requises manquent pour le modèle d'e-mail",
      },
      error: {
        general: {
          internal_server_error: "Une erreur interne du serveur s'est produite",
        },
      },
      labels: {
        id: "ID :",
        email: "E-mail :",
        name: "Nom :",
        privateName: "Nom complet :",
        publicName: "Nom affiché :",
        company: "Entreprise :",
        created: "Créé le :",
        leadId: "ID du lead :",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "Bienvenue {{firstName}} ! Votre compte a bien été créé. Rendez-vous sur {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, votre code de vérification : {{code}}. Saisissez-le dans les 10 minutes.",
    },
    errors: {
      welcome_failed: {
        title: "Échec du SMS de bienvenue",
        description: "Impossible d'envoyer le SMS de bienvenue à l'utilisateur",
      },
      verification_failed: {
        title: "Échec du SMS de vérification",
        description:
          "Impossible d'envoyer le SMS de vérification à l'utilisateur",
      },
    },
  },
  countries: {
    ...regionalCountryNames("fr"),
    global: "International",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    it: "Italien",
    es: "Espagnol",
    sk: "Slovaque",
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      admin: "Admin",
      cliOff: "CLI désactivée",
      cliAuthBypass: "Contournement d'auth CLI",
      aiToolOff: "Outil IA désactivé",
      webOff: "Web désactivé",
      mcpOff: "MCP désactivé",
      mcpVisible: "MCP visible",
      productionOff: "Production désactivée",
      skillOff: "Skill désactivé",
    },
  },
};
