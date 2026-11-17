import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produits",
    category: "Catégorie",
    create: "Créer",
  },
  post: {
    title: "Créer une catégorie de produits",
    titleShort: "Créer une catégorie",
    description:
      "Ajoutez une catégorie pour organiser les produits de votre catalogue.",
    name: {
      label: "Nom de la catégorie",
      description: "Nom de la catégorie de produits",
      placeholder: "Services de design",
    },
    companyId: {
      label: "Entreprise",
      description: "Associer cette catégorie à une entreprise",
    },
    parentId: {
      label: "Catégorie parente",
      description:
        "Catégorie parente facultative, pour une organisation hiérarchique",
    },
    sortOrder: {
      label: "Ordre de tri",
      description:
        "Ordre d'affichage : les plus petits nombres apparaissent en premier",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les champs du formulaire et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour créer une catégorie",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de créer cette catégorie",
      },
      conflict: {
        title: "Existe déjà",
        description: "Une catégorie portant ce nom existe déjà",
      },
      server: {
        title: "Erreur serveur",
        description: "Un problème est survenu de notre côté. Réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion et réessayez",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Catégorie créée",
      description: "Votre catégorie de produits est prête.",
    },
    response: {
      id: "ID de la catégorie",
      name: "Nom de la catégorie",
    },
    widget: {
      backToList: "Retour aux catégories",
      back: "Retour",
    },
  },
};
