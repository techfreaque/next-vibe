import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description:
      "Démarre un tunnel ngrok pour transférer les webhooks NOWPayments",
    category: "Paiement",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "Tunnel NOWPayments",
      description:
        "Démarrez un tunnel ngrok pour recevoir les webhooks NOWPayments en local",
      fields: {
        port: {
          label: "Port",
          description: "Port local à exposer (par défaut : 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        instructions:
          "Pour installer ngrok :\n\n1. Rendez-vous sur https://ngrok.com/download\n2. Téléchargez ngrok pour votre système\n3. Décompressez-le et placez-le dans votre PATH\n4. Lancez : ngrok authtoken YOUR_AUTH_TOKEN (récupérez votre jeton sur https://dashboard.ngrok.com/get-started/your-authtoken)\n\nOu installez-le avec un gestionnaire de paquets :\n- macOS : brew install ngrok/ngrok/ngrok\n- Linux : snap install ngrok\n- Windows : choco install ngrok",
        title: "ngrok n'est pas installé",
        description:
          "ngrok est nécessaire pour démarrer le tunnel. Installez-le et réessayez.",
      },
      validationFailed: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      networkError: {
        title: "Erreur réseau",
        description: "Échec de la connexion réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      serverError: {
        noTunnelUrl: "Impossible de lire l'URL du tunnel ngrok",
        title: "Erreur serveur",
        description: "Impossible de démarrer le tunnel",
      },
      unknownError: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de ressources",
      },
    },
    success: {
      title: "Tunnel démarré",
      description: "Le tunnel ngrok est actif",
    },
  },
};
