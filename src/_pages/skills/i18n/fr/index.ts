import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Skills IA",
  breadcrumb: "Skills",
  backToChat: "Retour au chat",
  description:
    "Des spécialistes et des personnages prêts à l'emploi. Chaque skill a ses propres instructions, son modèle et ses outils. Choisissez-en un et lancez la conversation, ou créez le vôtre.",
  meta: {
    title:
      "Skills IA : spécialistes et personnages prêts à l'emploi | {{appName}}",
    description:
      "Développeurs, auteurs, chercheurs, compagnons et personnages non censurés. Chaque skill apporte son prompt, son modèle et ses outils. Choisissez-en un et discutez, ou créez le vôtre et gagnez de l'argent quand d'autres l'utilisent.",
    category: "Skills IA",
    imageAlt: "Skills IA sur {{appName}}",
    keywords:
      "skills IA, personnages IA, assistant IA personnalisé, jeu de rôle IA, personnages IA non censurés, {{appName}}",
  },
  openFullPage: "Ouvrir en pleine page",
  jumpTo: "Aller à une catégorie",
  community: {
    title: "Communauté",
    intro: "Créés et publiés par les utilisateurs de {{appName}}.",
  },
  manage: {
    title: "Rechercher et gérer",
    intro:
      "Cherchez parmi tous les skills, ouvrez les vôtres et créez-en de nouveaux. Connectez-vous pour garder vos favoris.",
  },
  more: {
    title: "Aller plus loin",
    build: {
      title: "Créer votre propre skill",
      body: "Écrivez les instructions une fois, choisissez un modèle et des outils, publiez. Partagez votre lien et touchez 10 % de chaque paiement des personnes qui s'inscrivent par ce lien.",
    },
    models: {
      title: "Comparer les modèles",
      body: "Chaque skill tourne sur un modèle. Comparez prix, fenêtres de contexte et options non censurées avant de choisir.",
    },
    uncensored: {
      title: "Chat IA non censuré",
      body: "Les skills fonctionnent aussi avec les modèles non censurés et abliterés. Commencez ici si les filtres des grands fournisseurs vous bloquent.",
    },
  },
  guides: {
    title: "Guides personnages et écriture",
  },
  faq: {
    title: "Questions sur les skills",
    what: {
      q: "Qu'est-ce qu'un skill IA ?",
      a: "Une configuration IA enregistrée : instructions, modèle par défaut, outils et parfois une voix. Ouvrez un skill et la conversation démarre directement avec cette configuration.",
    },
    model: {
      q: "Puis-je utiliser un autre modèle avec un skill ?",
      a: "Oui. Chaque skill démarre sur son modèle par défaut. Passez à n'importe quel autre modèle depuis le sélecteur du chat.",
    },
    cost: {
      q: "Les skills coûtent-ils plus cher ?",
      a: "Non. Les skills sont gratuits. Vous ne payez que l'usage du modèle en crédits, au même tarif que dans n'importe quel autre chat.",
    },
    build: {
      q: "Puis-je créer et partager mon propre skill ?",
      a: "Oui. Créez-le depuis cette page ou demandez à Thea dans n'importe quel chat. Publiez-le, partagez le lien et touchez 10 % de chaque paiement des personnes qui s'inscrivent par ce lien.",
    },
  },
};
