import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  widget: {
    signInDescription: "Connectez-vous pour relier un compte distant.",
    adminOnlyDescription:
      "Créer des connexions sortantes exige un accès admin. Si une instance distante vous a connecté, vos connexions apparaissent ci-dessus.",
    benefit1:
      "Les mémoires se synchronisent automatiquement : tout ce que vous apprenez à l'IA ici vous suit",
    benefit2:
      "Accédez aux modèles et outils IA du cloud depuis votre instance locale",
    benefit3: "Votre contexte vous suit sur tous vos appareils",
    adminBenefit1:
      "Les mémoires se synchronisent dans les deux sens, automatiquement",
    adminBenefit2:
      "L'IA cloud découvre et exécute vos outils locaux (SSH, fichiers, exécution de code)",
    adminBenefit3:
      "Déléguez des tâches du cloud à cette machine : Claude Code les exécute en local",
    adminBenefit4:
      "Un instantané des capacités part à chaque synchro : Thea sait toujours ce que cette instance peut faire",
  },
  post: {
    title: "Se connecter à un compte distant",
    titleShort: "Connexion distante",
    description:
      "Reliez votre compte à une instance distante pour synchroniser vos mémoires et utiliser les outils IA partout",
    remoteUrl: {
      label: "URL distante",
      description:
        "L'adresse web de votre compte distant (par ex. https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Saisissez l'URL distante",
        invalid: "Saisissez une URL valide (par ex. https://unbottled.ai)",
      },
    },
    email: {
      label: "E-mail",
      description: "Votre adresse e-mail sur l'instance distante",
      placeholder: "vous@exemple.com",
      validation: {
        required: "Saisissez votre e-mail",
        invalid: "Saisissez une adresse e-mail valide",
      },
    },
    password: {
      label: "Mot de passe",
      description: "Votre mot de passe sur l'instance distante",
      placeholder: "••••••••",
      validation: {
        required: "Saisissez votre mot de passe",
      },
    },
    token: {
      label: "Jeton",
      description: "Jeton JWT de l'instance distante (défini automatiquement)",
      validation: {
        required: "Connectez-vous d'abord à l'instance distante",
      },
    },
    leadId: {
      label: "ID du lead",
      description: "ID du lead de l'instance distante (défini automatiquement)",
    },
    isInferenceProvider: {
      label: "Utiliser comme fournisseur d'inférence",
      description:
        "Cette connexion exécute les flux IA : l'instance distante gère la boucle IA via le canal WS inverse.",
    },
    syncScope: {
      label: "Périmètre de synchro",
      description: "Les données synchronisées par cette connexion.",
    },
    credentialWarning:
      "Vos identifiants partent directement de votre navigateur vers le serveur distant. En revanche, le jeton stocké ici donne à l'opérateur de ce serveur un accès complet à votre compte distant : il peut y faire tout ce que vous pouvez faire. Ne vous connectez que sur des serveurs en qui vous avez entièrement confiance.",
    actions: {
      submit: "Se connecter",
      submitting: "Connexion...",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez vos informations et réessayez",
      },
      network: {
        title: "Échec de la connexion",
        description:
          "Impossible de joindre le serveur distant. Vérifiez l'URL et réessayez",
      },
      unauthorized: {
        title: "Échec de l'identification",
        description: "E-mail ou mot de passe incorrect pour le compte distant",
      },
      forbidden: {
        title: "Le serveur distant refuse les connexions",
        description:
          "Le serveur distant n'est pas configuré pour accepter les connexions entrantes. Vérifiez que vous vous connectez à une instance cloud (par ex. unbottled.ai) et non à une autre installation locale.",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun serveur distant trouvé à cette URL",
      },
      server: {
        title: "Erreur du serveur distant",
        description: "Le serveur distant a rencontré une erreur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Déjà connecté",
        description:
          "Vous êtes déjà connecté à une instance distante avec cet ID d'instance",
      },
      instanceIdConflict: {
        title: "ID d'instance déjà enregistré",
        description:
          "Une instance avec cet ID est déjà enregistrée sur le serveur distant. Choisissez un autre ID d'instance.",
      },
      noLeadId: {
        title: "Erreur de connexion",
        description: "Impossible d'ouvrir une session avec le serveur distant",
      },
      invalidUrl: {
        title: "URL distante invalide",
        description:
          "L'URL distante doit pointer vers un serveur public, pas vers une adresse locale ou privée",
      },
    },
    success: {
      title: "Connecté !",
      description: "Votre compte est maintenant relié à l'instance distante",
    },
  },
};
