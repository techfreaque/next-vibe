// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/fr";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Choisir un endpoint...",
    searchEndpoints: "Rechercher des endpoints...",
    value: "{{value}}",
    selectEndpointHint:
      "Choisissez un endpoint pour configurer ses paramètres.",
    resolvingEndpoint: "Résolution de l'endpoint...",
    preCallsDescription:
      "Appels d'outils exécutés avant le prompt. Leurs résultats sont injectés comme contexte.",
    addPreCall: "Ajouter un pré-appel",
    preCalls: "Pré-appels",
    instructions: "Instructions",
    instructionsTooltip: "Remplacer les instructions système",
    preCallsTooltip: "Appels d'outils exécutés en amont",
    more: "Plus",
    moreTooltip: "Options avancées",
    emptyState: {
      title: "Choisissez une compétence ou un favori pour commencer",
      description:
        "Utilisez le sélecteur ci-dessous pour choisir une compétence ou charger un favori enregistré. Le modèle est résolu automatiquement.",
    },
    noResponse: "Aucune réponse",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "skill ",
      promptHint:
        "entrée : envoyer  ·  échap : quitter  ·  tab : changer de champ",
      promptPlaceholder: "Saisissez votre prompt...",
      skillLabel: "skill : {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
