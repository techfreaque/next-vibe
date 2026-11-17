import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Client headless",
    titleShort: "headless",
    description: "Démarrer le client de connexion distante headless",
    form: {
      title: "Client headless",
      description:
        "Ouvre les connexions WS inverses et l'exécuteur d'outils. Pas de serveur web.",
    },
    fields: {
      computerName: {
        title: "Nom de l'ordinateur",
        description:
          "Identifiant de cette machine (par défaut : nom d'hôte de l'OS)",
      },
      remoteUrl: {
        title: "URL distante",
        description: "URL de l'instance cloud à laquelle se connecter",
      },
      leadId: {
        title: "Lead ID",
        description: "Votre UUID de lead sur l'instance distante",
      },
      token: {
        title: "Jeton",
        description: "Jeton d'authentification de la connexion",
      },
      output: { title: "Sortie" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Saisie invalide",
      },
      network: { title: "Erreur réseau", description: "Erreur réseau" },
      unauthorized: { title: "Non autorisé", description: "Non autorisé" },
      forbidden: { title: "Accès refusé", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Introuvable" },
      server: { title: "Erreur serveur", description: "Erreur serveur" },
      unknown: { title: "Erreur inconnue", description: "Erreur inconnue" },
      conflict: { title: "Conflit", description: "Conflit" },
      migrationFailed: "Échec de la migration",
      migrationError: "Erreur de migration",
    },
    success: {
      title: "Client headless démarré",
      description:
        "Connexions WS inverses ouvertes, en attente de requêtes d'outils",
    },
  },
};
