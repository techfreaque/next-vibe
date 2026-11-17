// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/fr";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    settings: "Paramètres",
  },
  voices: {
    MALE: "Voix masculine",
    FEMALE: "Voix féminine",
  },
  enums: {
    viewMode: {
      linear: "Linéaire",
      threaded: "Arborescente",
      flat: "À plat",
      debug: "Débogage",
    },
    provider: {
      AUTO: "Auto",
      BRAVE: "Brave",
      KAGI: "Kagi",
    },
  },
  get: {
    title: "Paramètres",
    titleShort: "Paramètres du chat",
    description:
      "Récupère les paramètres et préférences de chat de l'utilisateur",
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour accéder aux paramètres",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission d'accéder à cette ressource",
      },
      notFound: {
        title: "Introuvable",
        description: "Paramètres introuvables",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la récupération des paramètres",
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
        description: "Conflit avec l'état actuel",
      },
    },
    success: {
      title: "Succès",
      description: "Paramètres récupérés",
    },
  },
  post: {
    title: "Enregistrer les paramètres",
    titleShort: "Enregistrer les paramètres",
    description:
      "Met à jour les paramètres et préférences de chat de l'utilisateur",
    container: {
      title: "Paramètres du chat",
    },
    selectedModel: {
      label: "Modèle sélectionné",
    },
    selectedSkill: {
      label: "Skill sélectionné",
    },
    activeFavoriteId: {
      label: "Favori actif",
    },
    ttsAutoplay: {
      label: "Lecture vocale automatique",
    },
    viewMode: {
      label: "Mode d'affichage",
    },
    contextMemory: {
      title: "Budget de mémoire du contexte",
      description:
        "Jusqu'où l'IA se souvient de votre conversation avant de commencer à la résumer.",
      costNote: "Plus bas = moins cher",
      costExplain:
        "(jusqu'à un certain point) : vous échangez un peu de mémoire contre un coût par message plus bas.",
      tooltipTitle: "Quelle part de l'historique l'IA conserve",
      tooltipBody:
        "Quand la conversation dépasse cette limite, les anciens messages sont résumés automatiquement. L'IA reste cohérente mais utilise moins de tokens, ce qui réduit le coût.",
      tooltipModelCap: "Le modèle actuel accepte jusqu'à {cap} tokens.",
      default: "par défaut",
      tokens: "tokens",
      modelMax: "max. du modèle",
      resetToDefault: "Rétablir la valeur par défaut ({value})",
      cheaper: "moins cher",
      moreMemory: "plus de mémoire",
      barCheap: "Coût réduit · mémoire courte",
      barBalanced: "Coût et mémoire équilibrés",
      barRich: "Mémoire étendue · coût plus élevé",
      barMax: "Mémoire maximale · coût le plus élevé",
      tools: "Outils",
      toolsInherited: "hérité",
    },
    searchProvider: {
      label: "Moteur de recherche",
      description:
        "Votre moteur de recherche web préféré. Auto utilise Brave s'il est configuré, sinon Kagi.",
    },
    codingAgent: {
      label: "Agent de code",
      description:
        "CLI d'agent de code à utiliser quand l'IA appelle l'outil d'agent de code. Réservé aux admins.",
      options: {
        claudeCode: "Claude Code (par défaut)",
        openCode: "OpenCode",
        nextVibeCoder: "Next Vibe Coder",
      },
    },
    dreaming: {
      title: "Rêve",
      description:
        "L'IA range votre cerveau pendant que vous dormez : elle consolide les mémoires, nettoie les documents et fait remonter l'essentiel.",
      toggle: {
        label: "Activer le rêve",
      },
      schedule: {
        label: "Planification",
        options: {
          nightlyAt2: "Chaque nuit à 2 h",
          weekdaysAt2: "En semaine à 2 h",
          weekdaysAt8: "En semaine à 8 h",
          every6h: "Toutes les 6 heures",
          every12h: "Toutes les 12 heures",
        },
      },
      favoriteId: {
        label: "Emplacement favori",
        defaultOption: "Par défaut (Thea)",
      },
      prompt: {
        label: "Prompt de session",
        placeholder:
          "Sur quoi Thea doit-elle se concentrer cette session ? Laissez vide pour la valeur par défaut.",
        defaultPrompt:
          "Lance ta session de rêve. Réorganise et consolide le cortex : mémoires, documents, fils. Laisse tout plus propre et mieux organisé.",
      },
      lastRun: "Dernière exécution :",
      neverRun: "Jamais exécuté",
      folderLink: "Ouvrir le dossier Rêves",
      sessionCost:
        "Par session : {{steps}} étapes max. S'arrête une fois {{cap}} crédits dépassés.",
      runNow: "Lancer maintenant",
    },
    autopilot: {
      title: "Pilote automatique",
      description:
        "L'IA traite votre file d'attente pendant votre absence : elle reprend les prochaines étapes, fait avancer les projets et gère ce qui attend.",
      toggle: {
        label: "Activer le pilote automatique",
      },
      schedule: {
        label: "Planification",
        options: {
          nightlyAt2: "Chaque nuit à 2 h",
          weekdaysAt2: "En semaine à 2 h",
          weekdaysAt8: "En semaine à 8 h",
          every6h: "Toutes les 6 heures",
          every12h: "Toutes les 12 heures",
        },
      },
      favoriteId: {
        label: "Emplacement favori",
        defaultOption: "Par défaut (Thea)",
      },
      prompt: {
        label: "Prompt de session",
        placeholder:
          "Sur quoi Hermes doit-il se concentrer cette session ? Laissez vide pour la valeur par défaut.",
        defaultPrompt:
          "Lance ta session de pilote automatique. Reprends les projets actifs là où ils en étaient : fais avancer les prochaines étapes, traite le travail en attente, fais avancer les choses.",
      },
      lastRun: "Dernière exécution :",
      neverRun: "Jamais exécuté",
      folderLink: "Ouvrir le dossier Pilote automatique",
      sessionCost:
        "Par session : {{steps}} étapes max. S'arrête une fois {{cap}} crédits dépassés.",
      runNow: "Lancer maintenant",
    },
    mama: {
      title: "Pouls de la plateforme",
      description:
        "Thea surveille votre instance de production : elle vérifie son état, fait avancer les fonctionnalités, gère le marketing et envoie les actualités. Un seul emplacement partagé entre tous les admins.",
      toggle: {
        label: "Activer le mode Mama",
      },
      schedule: {
        label: "Planification",
        options: {
          every4h: "Toutes les 4 heures",
          every6h: "Toutes les 6 heures",
          every12h: "Toutes les 12 heures",
          daily: "Chaque jour à minuit",
        },
      },
      prompt: {
        label: "Prompt de session",
        placeholder:
          "Sur quoi Thea doit-elle se concentrer ? Laissez vide pour la valeur par défaut.",
        defaultPrompt:
          "Lance ta session mama. Vérifie l'état de la plateforme, passe en revue les journaux d'erreurs, fais avancer les fonctionnalités en attente et rédige les annonces nécessaires. Laisse un résumé dans /documents/mama/log/.",
      },
      lastRun: "Dernière exécution :",
      neverRun: "Jamais exécuté",
      runNow: "Lancer maintenant",
    },
    webPinnedTools: {
      label: "Outils épinglés dans la barre latérale web",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres fournis invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible d'enregistrer les paramètres",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour modifier les paramètres",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de modifier les paramètres",
      },
      notFound: {
        title: "Introuvable",
        description: "Paramètres introuvables",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'enregistrer les paramètres",
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
        description: "Conflit de paramètres",
      },
    },
    success: {
      title: "Paramètres enregistrés",
      description: "Vos paramètres ont été enregistrés",
    },
  },
  patch: {
    chatModel: {
      label: "Modèle de chat",
      placeholder: "Valeur par défaut du système",
    },
  },
  models: { names: modelTranslations.names },
};
