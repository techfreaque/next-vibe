import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Infrastructure",
  type: "Infrastructure",

  enums: {
    infraStatus: {
      pending: "En attente",
      provisioning: "Provisionnement",
      ready: "Prêt",
      degraded: "Dégradé",
      error: "Erreur",
    },
    componentStatus: {
      unknown: "Inconnu",
      healthy: "Sain",
      degraded: "Dégradé",
      down: "Hors service",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Exécuteur de tâches",
      storage: "Stockage (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "Aucune connexion SSH taguée control-plane. Taguez d'abord un serveur dans les paramètres SSH.",
    noClusterNodes:
      "Aucune connexion SSH taguée comme nœud du cluster. Taguez au moins un serveur en control-plane.",
    kubeconfigMissing: "Kubeconfig introuvable. Lancez d'abord cluster-init.",
    pulumiNotInstalled:
      "La CLI Pulumi n'est pas installée. Installez-la avec : curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "Échec de la commande SSH sur le nœud",
    k3sInstallFailed: "Échec de l'installation de k3s",
    scaleTargetNotFound: "Déploiement introuvable dans le cluster",
    connectionNotFound: "Connexion SSH introuvable",
    encryptionFailed: "Échec du déchiffrement des identifiants",
    connectTimeout: "Délai de connexion SSH dépassé",
    sshAuthFailed: "Échec de l'authentification SSH",
    sshConnectionFailed: "Échec de la connexion SSH",
    fingerprintMismatch: "L'empreinte de la clé d'hôte SSH ne correspond pas",
  },

  cluster: {
    init: {
      post: {
        title: "Initialiser le cluster",
        titleShort: "Init cluster",
        description:
          "Provisionner k3s sur les serveurs SSH tagués. Installe k3s, les bases de données, Redis, MinIO et l'ingress.",
        container: { title: "Init du cluster" },
        fields: {
          clusterName: {
            label: "Nom du cluster",
            description:
              "Nom de ce cluster (utilisé dans le kubeconfig et les labels)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Domaine",
            description:
              "Domaine de base pour l'ingress (ex. example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "E-mail",
            description:
              "E-mail de contact pour les certificats TLS Let's Encrypt",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "Version de k3s",
            description: "Release de k3s à installer",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Simulation",
            description: "Afficher ce qui serait installé sans rien modifier",
          },
          skipDatabase: {
            label: "Sans base de données",
            description: "Ne pas installer PostgreSQL CloudNativePG",
          },
          skipRedis: {
            label: "Sans Redis",
            description: "Ne pas installer Redis Sentinel",
          },
          skipStorage: {
            label: "Sans stockage",
            description: "Ne pas installer le stockage distribué MinIO",
          },
          skipIngress: {
            label: "Sans ingress",
            description: "Ne pas installer nginx-ingress ni cert-manager",
          },
        },
        response: {
          success: { title: "Succès" },
          message: { title: "Message" },
          nodesProvisioned: { title: "Nœuds provisionnés" },
          componentsInstalled: { title: "Composants installés" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Durée (ms)" },
        },
        success: {
          title: "Cluster prêt",
          description: "Cluster k3s provisionné",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Configuration du cluster invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès administrateur requis",
          },
          server: {
            title: "Échec du provisionnement",
            description: "Échec de l'initialisation du cluster",
          },
          notFound: {
            title: "Aucun nœud trouvé",
            description: "Aucune connexion SSH taguée comme nœud du cluster",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: {
            title: "Conflit",
            description:
              "Le cluster existe déjà ou est en cours de provisionnement",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de joindre les nœuds du cluster",
          },
        },
      },
    },
    status: {
      get: {
        title: "Statut du cluster",
        titleShort: "Statut du cluster",
        description:
          "Afficher la santé des nœuds k8s, le nombre de pods et le statut des composants",
        container: { title: "Statut du cluster" },
        response: {
          nodes: { title: "Nœuds" },
          components: { title: "Composants" },
          overallStatus: { title: "Statut global" },
          podCounts: { title: "Nombre de pods" },
        },
        success: {
          title: "Statut récupéré",
          description: "Statut du cluster récupéré",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès administrateur requis",
          },
          server: {
            title: "Erreur serveur",
            description: "Impossible de récupérer le statut du cluster",
          },
          notFound: {
            title: "Aucun cluster",
            description:
              "Aucun cluster configuré. Lancez d'abord cluster-init.",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de joindre le cluster",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Déployer",
        titleShort: "Déployer",
        description:
          "Appliquer les changements d'infrastructure via Pulumi (pulumi up)",
        container: { title: "Déployer" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nom de la stack Pulumi",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Sans aperçu",
            description: "Appliquer les changements sans afficher d'aperçu",
          },
        },
        response: {
          success: { title: "Succès" },
          message: { title: "Message" },
          changes: { title: "Changements" },
          duration: { title: "Durée (ms)" },
        },
        success: {
          title: "Déployé",
          description: "Infrastructure déployée",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Configuration de déploiement invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès administrateur requis",
          },
          server: {
            title: "Échec du déploiement",
            description: "Échec de pulumi up",
          },
          notFound: {
            title: "Aucun cluster",
            description: "Aucun cluster configuré",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: {
            title: "Conflit",
            description: "Un déploiement est déjà en cours",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de joindre le cluster",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Aperçu du déploiement",
        titleShort: "Aperçu",
        description:
          "Prévisualiser les changements d'infrastructure sans les appliquer (pulumi preview)",
        container: { title: "Aperçu du déploiement" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nom de la stack Pulumi",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Succès" },
          message: { title: "Message" },
          preview: { title: "Aperçu" },
          duration: { title: "Durée (ms)" },
        },
        success: {
          title: "Aperçu prêt",
          description: "Aperçu généré",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Configuration invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès administrateur requis",
          },
          server: {
            title: "Échec de l'aperçu",
            description: "Échec de pulumi preview",
          },
          notFound: {
            title: "Aucun cluster",
            description: "Aucun cluster configuré",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de joindre le cluster",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Mise à l'échelle",
        titleShort: "Scale",
        description: "Mettre à l'échelle un déploiement du cluster",
        container: { title: "Mettre à l'échelle le déploiement" },
        fields: {
          component: {
            label: "Composant",
            description: "Déploiement à mettre à l'échelle",
          },
          replicas: {
            label: "Réplicas",
            description: "Nombre de réplicas cible (0 = pause)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Succès" },
          message: { title: "Message" },
          previousReplicas: { title: "Réplicas précédents" },
          newReplicas: { title: "Nouveaux réplicas" },
        },
        success: {
          title: "Mis à l'échelle",
          description: "Déploiement mis à l'échelle",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de mise à l'échelle invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès administrateur requis",
          },
          server: {
            title: "Échec de la mise à l'échelle",
            description: "Impossible de mettre à l'échelle le déploiement",
          },
          notFound: {
            title: "Déploiement introuvable",
            description: "Déploiement introuvable dans le cluster",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de joindre le cluster",
          },
        },
      },
    },
  },
};
