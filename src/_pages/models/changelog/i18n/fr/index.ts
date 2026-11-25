import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modèles d'IA",
    title: "Changelog des modèles IA : nouveaux, retirés, prix | {{appName}}",
    description:
      "Chaque changement de modèle sur {{appName}}, daté : nouveaux modèles, modèles retirés et remplaçants, prix et niveaux. Tiré de notre registre. Flux RSS inclus.",
    imageAlt: "Changelog des modèles sur {{appName}}",
    keywords:
      "changelog modèles IA, nouveaux modèles IA, prix LLM, modèles IA retirés, mises à jour modèles non censurés, {{appName}}",
  },
  breadcrumb: {
    models: "Modèles d'IA",
    changelog: "Changelog",
  },
  hero: {
    eyebrow: "Mis à jour le {{date}}",
    title: "Changelog des modèles",
    subtitle:
      "Ce qui arrive, ce qui part en legacy, ce qui baisse. Chaque entrée est datée et sort directement de notre registre de modèles.",
    rss: "Flux RSS",
    allModels: "Tous les modèles",
  },
  stats: {
    added: "Modèles ajoutés",
    legacy: "Passés en legacy",
    repriced: "Changements de prix",
    since: "Suivi depuis",
  },
  badge: {
    replaces: "Relève",
    added: "Nouveau",
    legacy: "Legacy",
    restored: "Retour",
    repriced: "Prix",
    tier: "Niveau",
    removed: "Retiré",
  },
  title: {
    added: "Nouveau modèle",
    legacy: "Passé en legacy",
    restored: "De retour au catalogue",
    repriced: "Changement de prix",
    tier: "Changement de niveau",
    removed: "Retiré",
  },
  summary: {
    added: "Nouveau modèle au niveau {{tier}}.",
    legacy: "Passé en legacy. Retiré du sélecteur de modèles.",
    replacedBy: "Remplacé par",
    replaces: "Prend la relève de",
    restored: "De retour dans le catalogue actif.",
    tier: "Passe du niveau {{from}} au niveau {{to}}.",
    removed: "N'est plus proposé.",
    priceUp: "{{metric}} en hausse de {{percent}}",
    priceDown: "{{metric}} en baisse de {{percent}}",
  },
  metric: {
    input: "Prix d'entrée",
    output: "Prix de sortie",
    image: "Prix par image",
    second: "Prix par seconde",
    clip: "Prix par clip",
    character: "Prix par caractère",
    fixed: "Prix par message",
  },
  list: {
    heading: "Tous les changements",
    empty: "Aucun changement enregistré pour l'instant.",
    count: "{{count}} changements",
  },
  about: {
    heading: "D'où viennent ces données",
    body: "Chaque entrée est générée à partir de l'historique de versions de notre registre de modèles : les mêmes fichiers qui pilotent le sélecteur de modèles, les prix et la facturation. Personne ne tape cette liste à la main. La date indique quand le changement est arrivé dans le registre.",
    prices:
      "Les changements de prix comparent la route fournisseur publique la moins chère avant et après. Une variation peut venir du fournisseur lui-même, ou de l'ajout ou du retrait d'une route moins chère.",
    start:
      "Le suivi commence le {{date}}. Les modèles déjà en ligne à cette date n'ont pas d'entrée Nouveau.",
  },
  model: {
    heading: "Ce qui a changé",
    intro:
      "Les changements datés de {{model}}, tirés de notre registre de modèles.",
    none: "Aucun changement pour {{model}} depuis le début du suivi, le {{date}}.",
    link: "Changelog complet des modèles",
  },
  index: {
    link: "Changelog des modèles",
    hint: "Nouveaux modèles, legacy et prix modifiés, datés",
  },
  feed: {
    title: "Changelog des modèles {{appName}}",
    description:
      "Nouveaux modèles d'IA, passages en legacy et changements de prix sur {{appName}}, datés, depuis notre registre de modèles.",
  },
};
