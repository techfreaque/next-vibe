import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Surveillance des tâches",
  tags: {
    taskWatchdog: "task-watchdog",
    vibeSense: "vibe-sense",
    budget: "budget",
  },
  enums: {
    incidentType: {
      all: "Tous les incidents",
      timeout: "Délai dépassé",
      loop: "Boucle",
      budget: "Budget",
      transientRetryExhausted: "Tentatives épuisées",
      watchdogCancel: "Annulation par le watchdog",
    },
    budgetScope: {
      task: "Par exécution de tâche",
      day: "Par jour (toutes les tâches)",
      goal: "Par objectif, par jour",
    },
    spendKind: {
      model: "Tour du modèle",
      tool: "Appel d'outil",
    },
    healthMetric: {
      started: "Tâches démarrées",
      completed: "Tâches terminées",
      failed: "Tâches en échec",
      watchdogCancelled: "Tâches annulées par le watchdog",
      avgDuration: "Durée moyenne (secondes)",
      p95Duration: "Durée au 95e centile (secondes)",
      creditSpend: "Crédits dépensés par les tâches",
      incidents: "Incidents",
    },
  },
  sweep: {
    post: {
      title: "Passage du watchdog des tâches",
      titleShort: "Passage du watchdog",
      description:
        "Repère les tâches d'arrière-plan bloquées, en boucle ou orphelines, les arrête avec un motif enregistré et ouvre un incident. S'exécute chaque minute.",
      container: {
        title: "Résultat du passage",
        description: "Ce que le watchdog a trouvé et fait lors de ce passage",
      },
      response: {
        checked: "Tâches en cours vérifiées",
        cancelled: "Annulées (limite dépassée)",
        orphaned: "Exécutions orphelines récupérées",
        loops: "Tâches en boucle désactivées",
        incidents: "Incidents ouverts",
      },
    },
    task: {
      description:
        "Arrête les tâches qui durent trop longtemps, tournent en boucle ou ont perdu leur processus. Chaque arrêt ouvre un incident.",
    },
  },
  health: {
    get: {
      title: "Santé des tâches",
      titleShort: "Santé des tâches",
      description:
        "Tâches en cours avec ancienneté, tours et dépenses, échecs récents et incidents ouverts. Annulez une tâche d'ici.",
      response: {
        running: "Tâches en cours",
        failures: "Échecs récents",
        incidents: "Incidents ouverts",
        daySpent: "Crédits dépensés aujourd'hui",
        dayCap: "Plafond journalier",
      },
      widget: {
        title: "Santé des tâches",
        subtitle:
          "Chaque exécution est surveillée. Celles qui bloquent sont arrêtées.",
        refresh: "Actualiser",
        loading: "Chargement de la santé des tâches…",
        spendToday:
          "{{spent}} crédits sur {{cap}} dépensés par les tâches aujourd'hui",
        running: {
          title: "En cours",
          empty: "Rien en cours.",
        },
        failures: {
          title: "Échecs récents",
          empty: "Aucun échec ces dernières 24 heures.",
        },
        incidents: {
          title: "Incidents ouverts",
          empty: "Aucun incident ouvert.",
        },
        age: "Ancienneté",
        turns: "Tours",
        toolCalls: "Appels d'outils",
        spend: "Dépensé",
        goal: "Objectif {{goal}}",
        limit: "limite {{limit}}",
        lastError: "Dernière erreur",
        noError: "Aucune erreur enregistrée",
        cancel: "Annuler",
        cancelling: "Annulation…",
        resolve: "Résoudre",
        credits: "{{amount}} cr",
      },
    },
  },
  cancel: {
    post: {
      title: "Annuler une tâche",
      titleShort: "Annuler la tâche",
      description:
        "Arrête une tâche en cours (et sa boucle IA) et enregistre l'annulation, ou marque un incident comme résolu.",
      fields: {
        taskId: {
          label: "ID de la tâche",
          description: "La tâche en cours à arrêter",
          placeholder: "id de la tâche",
        },
        incidentId: {
          label: "ID de l'incident",
          description: "L'incident à marquer comme résolu",
        },
      },
      response: {
        cancelled: "Tâche annulée",
        resolved: "Incident résolu",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Plafonds budgétaires des tâches",
      titleShort: "Plafonds budgétaires",
      description:
        "Plafonds de crédits qui arrêtent les tâches d'arrière-plan : par exécution, par jour et par objectif.",
      response: {
        rows: "Plafonds",
        daySpent: "Crédits dépensés aujourd'hui",
      },
      widget: {
        title: "Plafonds budgétaires des tâches",
        subtitle:
          "Une tâche qui atteint un plafond s'arrête proprement. Le plafond journalier est la limite absolue pour toutes les exécutions sans surveillance.",
        refresh: "Actualiser",
        add: "Définir un plafond",
        loading: "Chargement des plafonds…",
        empty: {
          title: "Aucun plafond défini",
          hint: "Valeurs par défaut : 100 crédits par exécution, 1 000 par jour, 500 par objectif.",
          cta: "Définir le premier plafond",
        },
        spentToday: "{{spent}} crédits dépensés aujourd'hui",
        enabled: "Actif",
        disabled: "Désactivé",
        credits: "{{amount}} crédits",
        none: "aucun",
      },
    },
    post: {
      title: "Définir un plafond budgétaire",
      titleShort: "Définir un plafond",
      description:
        "Créer ou mettre à jour un plafond de crédits. Un plafond par portée et par clé. Une clé de tâche * s'applique par défaut à toutes les tâches.",
      fields: {
        scope: {
          label: "Portée",
          description: "Ce que le plafond limite",
        },
        key: {
          label: "Clé",
          description:
            "Tâche : id de la tâche ou *. Jour : global. Objectif : nom de l'objectif ou * (tag goal:<name> sur la tâche)",
          placeholder: "*",
        },
        maxCredits: {
          label: "Crédits max",
          description:
            "Une dépense égale ou supérieure arrête la tâche. 0 la bloque.",
        },
        enabled: {
          label: "Actif",
          description: "Désactivé : la ligne est conservée mais ignorée",
        },
        note: {
          label: "Note",
          description: "Pourquoi ce plafond existe",
          placeholder: "Agents de recherche nocturnes",
        },
      },
      response: {
        id: "ID du plafond",
      },
      widget: {
        back: "Retour",
        hint: "Un plafond arrête la tâche dès que la dépense l'atteint. Le plafond journalier s'applique toujours.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: {
        label: "Résolution",
        description: "Taille des intervalles",
      },
      range: { label: "Plage", description: "Période à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la plage",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
      metric: {
        label: "Métrique",
        description:
          "Tâches démarrées, terminées, en échec, annulées par le watchdog, durée, dépense de crédits ou incidents",
      },
      incidentType: {
        label: "Type d'incident",
        description:
          "Uniquement pour la métrique des incidents. Tous les types par défaut",
      },
    },
    taskHealth: {
      post: {
        title: "Santé des tâches",
        titleShort: "Santé des tâches",
        description:
          "Exécutions des tâches d'arrière-plan, durées, dépense de crédits et incidents du watchdog par intervalle",
        fields: {
          result: {
            label: "Valeur",
            description: "Valeur de la métrique par intervalle",
          },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les champs signalés",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en tant qu'administrateur",
    },
    forbidden: {
      title: "Réservé aux administrateurs",
      description:
        "Les outils de surveillance des tâches nécessitent le rôle administrateur",
    },
    notFound: {
      title: "Introuvable",
      description: "Cette tâche ou cet incident n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description: "L'entrée a changé entre-temps, rechargez et réessayez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de traiter la requête",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Un échec inattendu s'est produit",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    nothingToDo:
      "Indiquez un id de tâche à annuler ou un id d'incident à résoudre",
    taskNotRunning: "La tâche {{taskId}} n'est pas en cours",
    incidentNotFound: "L'incident {{incidentId}} n'existe pas",
    invalidCap: "Un plafond nécessite un montant positif ou nul et une clé",
  },
  success: {
    title: "Terminé",
    description: "Enregistré",
  },
};
