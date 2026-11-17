import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoris",
  },
  post: {
    title: "Retirer des favoris",
    titleShort: "Retirer",
    description: "Retirer plusieurs favoris d'un coup",
    ids: {
      label: "ID des favoris",
    },
    errors: {
      validation: {
        title: "Requête invalide",
        description: "Vérifiez ce que vous retirez et réessayez",
      },
      network: {
        title: "Erreur de connexion",
        description: "Impossible de retirer les favoris. Réessayez",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour retirer vos favoris",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de retirer ces favoris",
      },
      notFound: {
        title: "Favoris introuvables",
        description: "Les favoris à retirer sont introuvables",
      },
      server: {
        title: "Un problème est survenu",
        description: "Impossible de retirer vos favoris. Réessayez",
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
        title: "Conflit de suppression",
        description: "Ces favoris ont changé. Actualisez et réessayez",
      },
    },
    success: {
      title: "Favoris retirés",
      description: "Les favoris sélectionnés ont été retirés",
    },
  },
};
