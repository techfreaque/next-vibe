import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outils IA",
  tags: {
    skills: "skills",
  },
  get: {
    title: "Exporter la carte de personnage",
    titleShort: "Exporter la carte",
    description:
      "Exporte un skill en carte de personnage V2 au format JSON. Importe-la dans SillyTavern, RisuAI, Chub ou toute app au format Tavern, ou garde-la en sauvegarde. Fonctionne pour tes propres skills, les skills publics de la communauté et les skills intégrés publics. La carte crédite le créateur et renvoie vers la page du skill.",
    dynamicTitle: "Export : {{name}}",
    id: {
      label: "Skill",
      description: "Le skill à exporter",
    },
    widget: {
      intro:
        "Ton personnage, dans un fichier qui t'appartient. Carte de personnage V2, le format qu'importent SillyTavern, RisuAI et Chub.",
      included:
        "Contenu : nom, prompt complet du personnage, accroche, description, créateur et un lien vers cette page.",
      download: "Télécharger la carte",
      copy: "Copier le JSON",
      copied: "Copié",
    },
    card: {
      skillPage: "Page du skill : {{url}}",
    },
    response: {
      name: { content: "Nom" },
      fileName: { content: "Nom du fichier" },
      card: { content: "JSON de la carte" },
    },
    errors: {
      validation: {
        title: "Requête invalide",
        description: "Vérifie l'ID du skill.",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur.",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connecte-toi pour exporter ce skill.",
      },
      forbidden: {
        title: "Non autorisé",
        description: "Tu ne peux pas exporter ce skill.",
      },
      notFound: {
        title: "Skill introuvable",
        description: "Ce skill n'existe pas ou ne t'est pas visible.",
      },
      server: {
        title: "Échec de l'export",
        description:
          "Un problème est survenu pendant la création de la carte. Réessaie.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Tu as des modifications non enregistrées.",
      },
      conflict: {
        title: "Conflit",
        description: "Le skill a changé pendant l'export. Réessaie.",
      },
    },
    success: {
      title: "Carte prête",
      description: "Télécharge-la ou copie le JSON.",
    },
  },
};
