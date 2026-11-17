import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  get: {
    title: "Exporter mes données",
    titleShort: "Exporter les données",
    description:
      "Téléchargez tout ce que nous détenons sur vous : profil, discussions, mémoires, compétences, crédits, parrainages, newsletter, adresses. Un fichier JSON et un résumé lisible.",
    tags: { export: "Export de données" },
    response: {
      json: { title: "Données complètes (JSON)" },
      jsonFilename: { title: "Nom du fichier JSON" },
      markdown: { title: "Résumé (Markdown)" },
      markdownFilename: { title: "Nom du fichier de résumé" },
    },
    success: {
      title: "Export prêt",
      description: "Votre archive de données a été générée",
    },
    md: {
      heading: "Votre export de données",
      generated: "Généré le",
      account: "Compte",
      email: "E-mail",
      name: "Nom",
      memberSince: "Membre depuis",
      contents: "Contenu",
      records: "enregistrements",
      note: "Tous les détails se trouvent dans le fichier JSON. Cet export ne contient que les données liées à votre compte.",
    },
    widget: {
      intro:
        "Obtenez une copie de vos données. Vous recevez un fichier JSON complet et un résumé Markdown lisible. Seules vos propres données sont incluses.",
      downloadJson: "Télécharger le JSON",
      downloadMarkdown: "Télécharger le résumé",
      generate: "Préparer l'export",
      preparing: "Préparation...",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour exporter vos données",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Vous ne pouvez pas exporter ces données",
      },
      notFound: {
        title: "Introuvable",
        description: "Compte introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Échec de l'export",
        description: "Impossible de générer votre export. Réessayez plus tard.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
    },
  },
};
