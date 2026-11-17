import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Déplacer",
    titleShort: "Déplacer le fichier",
    description: "Déplace ou renomme un fichier ou un dossier.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Déplacement...",
      done: "Déplacé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "De",
        description: "Chemin actuel",
      },
      to: {
        label: "Vers",
        description: "Nouveau chemin",
      },
    },
    submitButton: {
      label: "Déplacer",
      loadingText: "Déplacement...",
    },
    response: {
      from: { content: "De" },
      to: { content: "Vers" },
      nodesAffected: { text: "Déplacés" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez les deux chemins",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible de déplacer ceci",
      },
      notFound: {
        title: "Introuvable",
        description: "Rien au chemin source",
      },
      server: {
        title: "Erreur serveur",
        description: "Quelque chose a planté",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: {
        title: "Bloqué",
        description: "La destination est déjà occupée",
      },
    },
    success: {
      title: "Déplacé",
      description: "Terminé",
    },
  },
};
