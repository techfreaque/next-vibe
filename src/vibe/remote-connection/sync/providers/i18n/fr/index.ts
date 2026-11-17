import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  providers: {
    memories: "Mémoires",
    documents: "Documents",
    skills: "Skills",
    favorites: "Favoris",
    threads: "Fils de discussion",
  },
  providerDescriptions: {
    memories: "Synchroniser vos mémoires IA entre instances",
    documents: "Synchroniser votre bibliothèque de documents",
    skills: "Synchroniser vos compétences et prompts personnalisés",
    favorites: "Synchroniser vos configurations favorites",
    threads: "Synchroniser les fils de discussion et leurs messages",
  },
  get: {
    title: "Fournisseurs de synchro",
    titleShort: "Fournisseurs de synchro",
    description:
      "Lister tous les fournisseurs de synchro enregistrés pour les paramètres de connexion",
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: { title: "Erreur réseau", description: "Échec de la connexion" },
      unauthorized: {
        title: "Non connecté",
        description: "Authentification requise",
      },
      forbidden: { title: "Accès refusé", description: "Rôle admin requis" },
      notFound: {
        title: "Introuvable",
        description: "Aucun fournisseur enregistré",
      },
      server: {
        title: "Erreur serveur",
        description: "Échec du chargement des fournisseurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
    },
    success: {
      title: "Fournisseurs chargés",
      description: "Liste des fournisseurs de synchro récupérée",
    },
  },
};
