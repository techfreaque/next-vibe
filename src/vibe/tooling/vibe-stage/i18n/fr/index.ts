import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Stage automatiquement les fichiers boilerplate (route.ts, i18n/*/index.ts) qui passent les vérifications de patterns. Stage aussi les changements limités aux imports dans n'importe quel fichier, ou seulement les hunks d'imports des fichiers aux changements mixtes.",

  fields: {
    dryRun: {
      label: "Simulation",
      description:
        "Afficher les fichiers qui seraient stagés sans lancer git add",
    },
    paths: {
      label: "Limiter aux chemins",
      description:
        "Ne considérer que les candidats sous ces chemins. Laissez vide pour analyser tous les changements non stagés.",
      placeholder: "ex. src",
    },
  },

  response: {
    staged: "Stagés",
    partiallyStaged: "Partiellement stagés (imports uniquement)",
    skipped: "Ignorés (violations)",
    renamed: "Renommés (déplacements)",
    deleted: "Supprimés (générés/fixtures)",
    noChanges: "Aucun fichier stageable dans l'arbre de travail",
    dryRunNote: "Simulation : aucun fichier n'a été stagé",
  },

  errors: {
    validation: {
      title: "Paramètres invalides",
      description: "Les paramètres de vibe stage sont invalides",
    },
    internal: {
      title: "Erreur interne",
      description: "Une erreur s'est produite pendant vibe stage",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous devez être connecté pour lancer vibe stage",
    },
    forbidden: {
      title: "Interdit",
      description: "L'accès à vibe stage est interdit",
    },
    notFound: {
      title: "Introuvable",
      description: "Aucun dépôt git trouvé",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur serveur s'est produite pendant vibe stage",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite pendant vibe stage",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description: "Modifications non enregistrées détectées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit s'est produit pendant vibe stage",
    },
  },

  success: {
    title: "Stage terminé",
    description: "Fichiers boilerplate stagés",
  },

  widget: {
    title: "Vibe Stage",
    subtitle:
      "Stage automatiquement les fichiers boilerplate qui passent les vérifications de patterns",
    submit: "Lancer le stage",
    dryRun: "Simulation",
    staged: "Stagés",
    partiallyStaged: "Partiellement stagés",
    skipped: "Ignorés",
    renamed: "Renommés",
    deleted: "Supprimés",
    stagedCount: "fichiers stagés",
    partiallyStaged_count: "fichiers partiellement stagés (imports uniquement)",
    skippedCount: "fichiers ignorés (violations)",
    renamedCount: "déplacements stagés",
    deletedCount: "suppressions stagées",
    renameFile: "déplacé",
    deleteFile: "supprimé",
    noChanges: "Aucun fichier stageable",
    noChangesHint:
      "Les fichiers boilerplate, les changements limités aux imports et les fichiers avec des hunks d'imports apparaîtront ici",
    dryRunBadge: "Simulation",
    dryRunNote: "Aperçu uniquement : aucun fichier n'a été stagé",
    cleanFile: "propre",
    partialFile: "imports uniquement",
    violationsFile: "violations",
    loading: "Analyse de l'arbre de travail...",
  },
};
