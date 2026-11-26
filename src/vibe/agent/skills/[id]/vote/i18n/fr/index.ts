import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outils IA",
  tags: {
    skills: "skills",
  },
  post: {
    selectSkill: "Ouvrez une compétence de la communauté pour voter.",
    browseSkills: "Parcourir les compétences de la communauté",
    title: "Voter pour la compétence",
    titleShort: "Voter",
    description:
      "Voter pour ou contre une compétence communautaire. Renvoyer le même sens retire le vote, envoyer le sens opposé l'inverse.",
    dynamicTitle: "Vote : {{name}}",
    direction: {
      label: "Sens",
      description: "Sens du vote : up (utile) ou down (pas utile).",
      up: "Vote positif",
      down: "Vote négatif",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voter",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez pas voter pour cette compétence",
      },
      notFound: { title: "Introuvable", description: "Compétence introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Une erreur est survenue lors du traitement de votre vote",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
    },
    success: {
      title: "Vote enregistré",
      description: "Votre vote a été mis à jour",
    },
    response: {
      userVote: { content: "Votre vote" },
      voteCount: { content: "Score" },
      upCount: { content: "Votes positifs" },
      downCount: { content: "Votes négatifs" },
      trustLevel: { content: "Niveau de confiance" },
    },
    backButton: {
      label: "Retour",
    },
    button: {
      vote: "Voter pour",
      unvote: "Retirer le vote",
      loading: "Enregistrement...",
    },
    badge: {
      verified: "Vérifié",
    },
  },
};
