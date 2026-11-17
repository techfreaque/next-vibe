import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoris",
  },
  post: {
    title: "Réorganiser les favoris",
    titleShort: "Réorganiser",
    description: "Modifier l'ordre de vos configurations favorites",
    positions: {
      label: "Positions",
    },
    errors: {
      validation: {
        title: "Ordre invalide",
        description: "Vérifiez l'ordre choisi et réessayez",
      },
      network: {
        title: "Erreur de connexion",
        description: "Impossible d'enregistrer le nouvel ordre. Réessayez",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour réorganiser vos favoris",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de réorganiser les favoris",
      },
      notFound: {
        title: "Favoris introuvables",
        description: "Vos favoris à réorganiser sont introuvables",
      },
      server: {
        title: "Un problème est survenu",
        description: "Impossible d'enregistrer votre nouvel ordre. Réessayez",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un imprévu s'est produit. Réessayez",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications ne sont pas encore enregistrées",
      },
      conflict: {
        title: "Conflit d'ordre",
        description: "L'ordre a changé. Actualisez et réessayez",
      },
    },
    success: {
      title: "Ordre enregistré",
      description: "Vos favoris ont été réorganisés",
    },
  },
};
