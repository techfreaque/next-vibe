import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Modifier un fichier",
    titleShort: "Modifier le fichier",
    description:
      "Modifie une partie d'un fichier. Cherchez un texte et remplacez-le, ou modifiez des lignes précises.",
    dynamicTitle: "{{path}} modifié",
    status: {
      loading: "Modification...",
      done: "Modifié",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description: "Fichier à modifier",
      },
      find: {
        label: "Rechercher",
        description:
          "Texte à rechercher. Chaque occurrence est remplacée (pas besoin de replace_all)",
      },
      replace: {
        label: "Remplacer",
        description: "Texte de remplacement",
      },
      startLine: {
        label: "De la ligne",
        description: "Commencer à ce numéro de ligne",
      },
      endLine: {
        label: "À la ligne",
        description: "Finir à ce numéro de ligne",
      },
      newContent: {
        label: "Nouveau contenu",
        description: "Contenu qui remplace ces lignes",
      },
    },
    submitButton: {
      label: "Appliquer",
      loadingText: "Application...",
    },
    response: {
      path: { content: "Chemin" },
      size: { text: "Taille" },
      replacements: { text: "Modifications" },
      updatedAt: { content: "Mis à jour" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin et la recherche/remplacement",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible de modifier ceci",
      },
      notFound: {
        title: "Introuvable",
        description: "Le fichier n'existe pas",
      },
      findNotFound:
        'Texte introuvable : "{{snippet}}" dans {{path}}. Lisez le fichier avec cortex-read, puis réessayez avec le texte exact.',
      lineRangeOutOfBounds:
        "La plage de lignes {{startLine}}-{{endLine}} est hors limites. Le fichier compte {{lineCount}} lignes.",
      missingEditStrategy:
        "Fournissez soit find + replace, soit startLine + endLine + newContent. Reçu : {{provided}}.",
      noParamsProvided: "rien",
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
        title: "Conflit",
        description: "Le fichier a changé pendant la modification",
      },
    },
    success: {
      title: "Modifié",
      description: "Modifications enregistrées",
    },
  },
};
