import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Indice de refus",
  tags: {
    refusalIndex: "Indice de refus",
  },

  enums: {
    content: {
      mainstream: "Grand public",
      open: "Ouvert",
      uncensored: "Non censuré",
    },
    runStatus: {
      running: "En cours",
      completed: "Terminé",
      failed: "Échec",
      cancelled: "Annulé",
    },
    verdict: {
      answered: "Répond",
      hedged: "Esquive",
      refused: "Refuse",
      error: "Erreur",
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "La requête est invalide",
    },
    network: { title: "Erreur réseau", description: "La connexion a échoué" },
    unauthorized: {
      title: "Non autorisé",
      description: "Accès administrateur requis",
    },
    forbidden: {
      title: "Accès interdit",
      description: "Accès administrateur requis",
    },
    notFound: { title: "Introuvable", description: "Aucun résultat" },
    server: {
      title: "Erreur serveur",
      description: "La requête à l'indice de refus a échoué",
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
      description: "Un conflit de données s'est produit",
    },
  },
  success: {
    title: "Terminé",
    description: "Requête à l'indice de refus terminée",
  },

  messages: {
    judgeUnparseable: "Le modèle juge n'a renvoyé aucun verdict exploitable.",
    dryRunStatus: "Simulation",
    slugTaken: "Une question avec le slug '{{slug}}' existe déjà.",
    questionNotFound: "Question introuvable.",
    questionInUse:
      "Cette question a des résultats dans des runs passés. Désactivez-la au lieu de la supprimer.",
    runNotFound: "Run introuvable.",
    runAlreadyActive:
      "Le run {{id}} est déjà en cours. Reprenez-le ou attendez qu'il se termine.",
    resultNotFound: "Résultat introuvable.",
    errorNotPublishable:
      "Les résultats en erreur ne peuvent pas être publiés comme exemples.",
    unknownQuestions: "Slugs de questions inconnus : {{slugs}}.",
    unknownModels: "Modèles inconnus ou non évalués : {{ids}}.",
    noQuestions:
      "Aucune question active. Ajoutez d'abord des questions (refusal-index-questions) : le jeu de questions est géré par les administrateurs.",
    noModels: "Aucun modèle évaluable ne correspond au filtre.",
    dryRun:
      "Simulation : rien n'a été envoyé. Plafond de budget pour un vrai run : {{budget}} crédits.",
    dryRunResume: "Simulation : voici ce que la reprise traiterait encore.",
    started: "Run lancé. Il continue en arrière-plan.",
    resumed: "Run repris. Il continue en arrière-plan.",
    finishedWaiting: "Run terminé. Statut final ci-dessus.",
    generationFailed:
      "Le générateur de questions n'a rien renvoyé d'exploitable ({{error}}).",
    nothingPending: "Rien à faire : chaque paire a déjà une réponse.",
  },

  fields: {
    limit: {
      label: "Limite",
      description: "Nombre maximal de lignes renvoyées",
    },
    offset: { label: "Décalage", description: "Lignes à ignorer" },
    back: { label: "Retour" },
  },

  questions: {
    fields: {
      id: { label: "ID de la question", description: "ID de la question" },
      slug: {
        label: "Slug",
        description: "Identifiant court et unique, en-minuscules-avec-tirets",
      },
      category: {
        label: "Catégorie",
        description:
          "Groupe libre, par ex. 'medicine' : les catégories sont des données",
      },
      textEn: {
        label: "Question (anglais)",
        description: "Le prompt exact envoyé à chaque modèle",
      },
      textDe: {
        label: "Question (allemand)",
        description:
          "Traduction affichée dans les exemples publics (facultatif)",
      },
      textPl: {
        label: "Question (polonais)",
        description:
          "Traduction affichée dans les exemples publics (facultatif)",
      },
      textFr: {
        label: "Question (français)",
        description:
          "Traduction affichée dans les exemples publics (facultatif)",
      },
      textIt: {
        label: "Question (italien)",
        description:
          "Traduction affichée dans les exemples publics (facultatif)",
      },
      textEs: {
        label: "Question (espagnol)",
        description:
          "Traduction affichée dans les exemples publics (facultatif)",
      },
      textSk: {
        label: "Question (slovaque)",
        description:
          "Traduction affichée dans les exemples publics (facultatif)",
      },
      generatedBy: { label: "Proposée par" },
      active: {
        label: "Active",
        description:
          "Seules les questions actives sont utilisées dans les nouveaux runs",
      },
    },
    widget: {
      add: "Ajouter une question",
      loading: "Chargement des questions...",
      active: "Active",
      inactive: "Inactive",
      generated: "Générée",
      empty: {
        title: "Aucune question pour l'instant",
        hint: "L'indice mesure comment les modèles répondent à VOTRE jeu de questions. Ajoutez des questions avant le premier run.",
        cta: "Ajouter la première question",
      },
    },
    get: {
      title: "Questions de l'indice de refus",
      titleShort: "Questions",
      description:
        "Le jeu de questions choisi par les administrateurs et envoyé à chaque modèle. Ajoutez des questions ici avant le premier run.",
      fields: {
        status: {
          label: "Statut",
          description: "Filtrer par état d'activation",
          all: "Toutes",
          active: "Actives",
          inactive: "Inactives",
        },
        category: {
          label: "Catégorie",
          description: "Uniquement les questions de cette catégorie",
        },
      },
    },
    post: {
      title: "Ajouter une question à l'indice de refus",
      titleShort: "Ajouter une question",
      description: "Ajouter une question au jeu de test",
      submit: "Ajouter la question",
      submitting: "Ajout...",
      response: { id: "ID de la question" },
    },
    patch: {
      title: "Modifier une question de l'indice de refus",
      titleShort: "Modifier la question",
      description: "Modifier, activer ou désactiver une question",
      submit: "Enregistrer",
      submitting: "Enregistrement...",
      clearHint: "Laissez vide pour effacer la traduction",
    },
    delete: {
      title: "Supprimer une question de l'indice de refus",
      titleShort: "Supprimer la question",
      description:
        "Supprimer une question jamais utilisée dans un run (les questions utilisées se désactivent)",
      submit: "Supprimer la question",
      submitting: "Suppression...",
      response: { deleted: "Supprimée" },
    },
  },

  runs: {
    fields: {
      id: { label: "ID du run", description: "ID du run" },
      status: { label: "Statut" },
      startedAt: { label: "Début" },
      finishedAt: { label: "Fin" },
      modelCount: { label: "Modèles" },
      questionCount: { label: "Questions" },
      pairCount: { label: "Paires à traiter" },
      questionsRequested: { label: "Nouvelles questions demandées" },
      questionsGenerated: { label: "Nouvelles questions ajoutées" },
      resultCount: { label: "Résultats" },
      totalCost: { label: "Crédits dépensés" },
      budgetCredits: { label: "Plafond de budget" },
      judgeModelId: { label: "Modèle juge" },
      judgePromptVersion: { label: "Prompt du juge" },
      cancelReason: { label: "Motif d'arrêt" },
      notes: { label: "Notes" },
    },
    widget: {
      start: "Lancer un run",
      manageQuestions: "Gérer les questions",
      resume: "Reprendre",
      newQuestions: "{{generated}}/{{requested}} nouvelles questions",
      open: "Résultats",
      results: "résultats",
      credits: "crédits",
      noQuestions: {
        title: "Ajoutez d'abord des questions",
        hint: "Un run nécessite au moins une question active. Ajoutez-les dans la liste des questions.",
      },
      empty: {
        title: "Aucun run pour l'instant",
        hint: "Lancez un run, ou activez la tâche cron hebdomadaire (désactivée par défaut).",
      },
    },
    get: {
      title: "Runs de l'indice de refus",
      titleShort: "Runs",
      description: "Runs de benchmark, du plus récent au plus ancien",
      response: {
        activeQuestionCount: "Questions actives",
        benchmarkModelCount: "Modèles évalués",
      },
    },
  },

  start: {
    title: "Lancer un run de l'indice de refus",
    titleShort: "Lancer un run",
    description:
      "Ajoute de nouvelles questions venues d'un générateur non censuré, puis pose à chaque modèle chaque question à laquelle il n'a pas encore répondu et juge la réponse. Les réponses sont conservées : rien n'est demandé deux fois. Budget plafonné, reprise possible.",
    submit: "Lancer",
    submitting: "Lancement...",
    cron: {
      name: "Indice de refus (hebdomadaire)",
      description:
        "Chaque semaine : 10 nouvelles questions, puis chaque réponse manquante, nouveaux modèles compris. Désactivé par défaut.",
    },
    fields: {
      models: {
        label: "Modèles",
        description:
          "Ids de modèles séparés par des virgules (vide = tous les modèles actuels)",
      },
      questions: {
        label: "Questions",
        description:
          "Slugs de questions séparés par des virgules (vide = toutes les actives)",
      },
      newQuestions: {
        label: "Nouvelles questions",
        description:
          "Questions que le générateur non censuré ajoute avant le remplissage (0-30)",
      },
      budgetCredits: {
        label: "Plafond de budget (crédits)",
        description:
          "Le run s'arrête proprement (statut annulé) une fois ce plafond atteint",
      },
      concurrency: {
        label: "Parallélisme",
        description: "Appels de modèles en parallèle (4 par défaut, 16 max)",
      },
      dryRun: {
        label: "Simulation",
        description: "Planifier et estimer uniquement, ne rien envoyer",
      },
      resumeRunId: {
        label: "Reprendre un run",
        description: "Traiter les paires manquantes d'un run précédent",
      },
      wait: {
        label: "Attendre",
        description: "Garder la requête ouverte jusqu'à la fin du run",
      },
      notes: { label: "Notes", description: "Note libre pour ce run" },
    },
    response: {
      runId: "ID du run",
      status: "Statut",
      dryRun: "Simulation",
      modelCount: "Modèles",
      questionCount: "Questions",
      newQuestionCount: "Nouvelles questions",
      pendingPairs: "Paires à traiter",
      estimatedCredits: "Crédits estimés",
      note: "Note",
    },
  },

  runDetail: {
    title: "Run de l'indice de refus",
    titleShort: "Run",
    description:
      "Un run et ses résultats. Filtrez par modèle, catégorie ou verdict ; approuvez des exemples publics.",
    fields: {
      model: { label: "Modèle", description: "Filtrer par id de modèle" },
      category: { label: "Catégorie", description: "Filtrer par catégorie" },
      verdict: {
        label: "Verdict",
        description: "Filtrer par verdict",
        all: "Tous",
      },
      modelId: { label: "ID du modèle" },
      modelName: { label: "Modèle" },
      tier: { label: "Niveau" },
      questionSlug: { label: "Question" },
      categoryCol: { label: "Catégorie" },
      questionText: { label: "Prompt" },
      verdictCol: { label: "Verdict" },
      judgeReason: { label: "Motif du juge" },
      answerExcerpt: { label: "Réponse" },
      latencyMs: { label: "Latence (ms)" },
      cost: { label: "Crédits" },
      sampleVisible: { label: "Exemple public" },
    },
    widget: {
      loading: "Chargement du run...",
      empty: "Aucun résultat ne correspond à ces filtres.",
      credits: "crédits",
      approve: "Publier l'exemple",
      hide: "Masquer l'exemple",
    },
  },

  samples: {
    title: "Approuver un exemple de l'indice de refus",
    titleShort: "Exemple",
    description:
      "Publier (ou masquer) un résultat comme exemple de réponse public. Rien n'est public sans approbation.",
    submit: "Appliquer",
    submitting: "Application...",
    fields: {
      resultId: {
        label: "ID du résultat",
        description: "Le résultat à publier",
      },
      visible: {
        label: "Visible",
        description:
          "Activé = public sur la page du modèle, désactivé = masqué",
      },
    },
    response: { visible: "Visible" },
  },

  leaderboard: {
    title: "Classement de l'indice de refus",
    titleShort: "Indice de refus",
    description:
      "À quelle fréquence chaque modèle d'IA répond, esquive ou refuse. De nouvelles questions chaque semaine.",
    response: { overall: "Global" },
  },

  model: {
    title: "Statistiques de refus du modèle",
    titleShort: "Stats du modèle",
    description:
      "Les taux de refus, d'esquive et de réponse d'un modèle sur toutes les questions actuelles, plus des exemples de réponses approuvés.",
    fields: {
      modelId: {
        label: "Modèle",
        description: "Id du modèle ou slug d'URL",
      },
    },
    widget: {
      subtitle: "Benchmark des refus, passage actuel",
      noDataTitle: "Aucune réponse évaluée pour l'instant",
      noDataMessage:
        "Ce modèle ne fait pas encore partie du passage actuel. Ses taux apparaîtront après le prochain passage qui l'inclut.",
      notRanked: "Non classé",
      rankValue: "{{rank}}e sur {{total}}",
      trendValue: "{{delta}} pts par rapport au passage précédent",
      noTrend: "Aucun passage précédent",
      breakdown: "Par catégorie",
      samples: "Exemples de réponses",
      samplesEmpty: "Aucun exemple de réponse approuvé pour l'instant.",
      loadError: "Impossible de charger les statistiques",
      rank: "Rang",
      trend: "Tendance des refus",
      lookup: "Afficher les statistiques",
      judge: "Évaluation",
      categories: {
        politics: "Politique",
        history: "Histoire",
        health: "Santé",
        drugs: "Drogues",
        sexuality: "Sexualité",
        security: "Sécurité informatique",
        religion: "Religion",
        law: "Droit",
        science: "Science",
        fiction: "Fiction",
        satire: "Satire",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Réponses jugées" },
      answeredPct: { label: "Répond %" },
      hedgedPct: { label: "Esquive %" },
      refusedPct: { label: "Refuse %" },
      category: { label: "Catégorie" },
      hasData: { label: "Données disponibles" },
      runFinishedAt: { label: "Dernière mise à jour" },
      modelCount: { label: "Modèles" },
      questionCount: { label: "Questions" },
      judgeModelId: { label: "ID du modèle juge" },
      judgeModelName: { label: "Modèle juge" },
      judgePromptVersion: { label: "Version du prompt du juge" },
      modelId: { label: "ID du modèle" },
      name: { label: "Nom" },
      tier: { label: "Niveau" },
      trend: { label: "Tendance des refus (points)" },
      rank: { label: "Rang (1 = le moins de refus)" },
      rankedModels: { label: "Modèles classés" },
      question: { label: "Question" },
      verdict: { label: "Verdict" },
      answer: { label: "Réponse" },
      judgeReason: { label: "Motif du juge" },
    },
  },
};
