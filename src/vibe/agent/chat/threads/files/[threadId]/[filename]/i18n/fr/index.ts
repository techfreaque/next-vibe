import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    files: "Fichiers",
  },
  get: {
    title: "Récupérer le fichier",
    titleShort: "Fichier du fil",
    description: "Récupérer un fichier envoyé",
    success: {
      title: "Fichier récupéré",
      description: "Fichier récupéré avec succès",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête de fichier invalides",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Impossible de récupérer le fichier à cause d'une erreur réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise pour accéder à ce fichier",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation d'accéder à ce fichier",
      },
      notFound: {
        title: "Fichier introuvable",
        description:
          "Le fichier demandé est introuvable ou l'accès a été refusé",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Impossible de récupérer le fichier à cause d'une erreur serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
    },
  },
  errors: {
    fileNotFound: "Fichier introuvable ou accès refusé",
  },
};
