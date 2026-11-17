import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError:
      "Une erreur inattendue est survenue : {{error}}. Veuillez réessayer.",
    modelNotResolved:
      "Impossible de déterminer un modèle pour ce fil : le flux ne peut pas être repris.",
  },
  post: {
    title: "Reprise",
    titleShort: "Reprise",
    description:
      "Poursuit un fil existant après la fin d'une tâche asynchrone (callbackMode=wait ou wakeUp). Planifiée comme tâche cron unique par TaskCompletion.handle ; le pulse cron l'exécute sur la bonne instance.",
    fields: {
      threadId: {
        title: "ID du fil",
        description: "UUID du fil à poursuivre.",
      },
      favoriteId: {
        title: "ID du favori",
        description: "Favori enregistré d'où charger le modèle et la skill.",
      },
      modelId: {
        title: "ID du modèle",
        description: "Modèle IA pour le tour repris.",
      },
      skillId: {
        title: "ID de la skill",
        description: "Skill/persona pour le tour repris.",
      },
      callbackMode: {
        title: "Mode de rappel",
        description: "wait ou wakeUp : détermine le comportement de reprise.",
      },
      wakeUpToolMessageId: {
        title: "ID du message d'outil",
        description:
          "ID du message d'appel d'outil d'origine, avec le résultat complété.",
      },
      wakeUpTaskId: {
        title: "ID de la tâche wakeUp",
        description: "Tâche cron wakeUp d'origine, supprimée après la reprise.",
      },
      resumeTaskId: {
        title: "ID de la tâche de reprise",
        description:
          "Cette tâche cron de reprise elle-même, supprimée après la reprise.",
      },
      resumed: {
        title: "Repris",
        description: "Indique si le fil a bien été poursuivi.",
      },
      lastAiMessageId: {
        title: "ID du dernier message IA",
        description: "UUID du dernier message de l'assistant généré.",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description:
          "Paramètres invalides : threadId doit être un UUID valide.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise.",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé.",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil ou modèle introuvable.",
      },
      internal: {
        title: "Erreur serveur",
        description: "Erreur interne pendant la reprise du flux.",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue.",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Conflit avec des modifications non enregistrées.",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu.",
      },
    },
    success: {
      title: "Fil repris",
      description: "Le fil IA a bien été poursuivi.",
    },
  },
};
