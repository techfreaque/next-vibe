import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Outils IA",
  backToChat: "Retour au chat",
  description:
    "Choisissez les outils que l'IA peut utiliser. Épinglez des outils pour les inclure toujours dans le contexte.",
  openFullPage: "Ouvrir en pleine page",
  modal: {
    title: "Outils IA",
    description:
      "Choisissez les outils que l'IA peut utiliser. Épinglez des outils pour les inclure toujours dans le contexte.",
  },
  widget: {
    tools: "Outils",
    overrideForSlot: "Personnaliser les outils pour cet emplacement",
    inheritedDefaults:
      "Paramètres par défaut hérités. Activez pour personnaliser.",
    customToolsConfigured: "Outils personnalisés pour cet emplacement.",
    deselectAll: "Tout désélectionner",
    selectAll: "Tout sélectionner",
    reset: "Réinitialiser",
    pinnedToContext: "épinglé au contexte",
    requiresConfirmation: "confirmation requise",
    loadingTools: "Chargement des outils...",
  },
  loadError: {
    title: "L’administration n’a pas pu se charger",
    message:
      "Votre session n’a pas pu être vérifiée. Rechargez la page ; si le problème persiste, reconnectez-vous.",
    reload: "Recharger",
    signIn: "Se connecter",
  },
};
