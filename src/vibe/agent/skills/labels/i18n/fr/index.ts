import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    category: {
      companion: "Compagnons",
      assistant: "Assistants",
      coding: "Code",
      creative: "Créatif",
      writing: "Écriture",
      analysis: "Analyse",
      roleplay: "Jeu de rôle",
      education: "Éducation",
      controversial: "Controversé",
      background: "Arrière-plan",
      custom: "Personnalisé",
    },
    source: {
      all: "Toutes",
      builtIn: "Intégrées",
      my: "Les miennes",
      community: "Communauté",
    },
    ownershipType: {
      system: "Compétence intégrée",
      user: "Créée par vous",
      public: "De la communauté",
    },
    voice: {
      male: "Voix masculine",
      female: "Voix féminine",
    },
    mode: {
      auto: "Auto",
      manual: "Manuel",
    },
    selectionType: {
      skillBased: "Selon la compétence",
      manual: "Modèle précis",
      filters: "Critères de filtrage",
    },
    intelligence: {
      quick: "Rapide",
      smart: "Malin et économique",
      brilliant: "Brillant",
    },
    price: {
      cheap: "Économique",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      mainstream: "Grand public",
      open: "Ouvert",
      uncensored: "Non censuré",
    },
    skillType: {
      persona: "Persona",
      specialist: "Spécialiste",
      toolBundle: "Pack d'outils",
    },
    skillStatus: {
      draft: "Brouillon",
      published: "Publiée",
      unlisted: "Non répertoriée",
    },
    trustLevel: {
      community: "Communauté",
      verified: "Vérifiée",
    },
    voteDirection: {
      up: "Vote positif",
      down: "Vote négatif",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligence",
      price: "Prix",
      content: "Contenu",
    },
    sortDirection: {
      asc: "Croissant",
      desc: "Décroissant",
    },
  },
};
