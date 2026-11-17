import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  codingAgent: {
    tags: {
      tasks: "Tâches",
    },
    run: {
      post: {
        title: "Lancer l'agent de code",
        titleShort: "Agent de code",
        dynamicTitle: "Agent de code : {{prompt}}",
        description:
          "Lance une tâche d'agent de code. Mode batch (PAR DÉFAUT) : s'exécute sans interface et renvoie la sortie. Mode interactif : ouvre une session de terminal en direct ; le résultat est renvoyé automatiquement à la fin de la session.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "La tâche ou la question à envoyer à l'agent de code. Soyez précis : indiquez les chemins de fichiers, le contexte et le format de sortie attendu.",
          },
          provider: {
            label: "Fournisseur",
            description:
              "CLI d'agent de code à utiliser. claude-code utilise la CLI Claude ; open-code utilise la CLI OpenCode.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
            },
          },
          model: {
            label: "Modèle",
            description:
              "Modèle à utiliser. Pour Claude Code : ID du modèle (ex. claude-sonnet-4-6). Pour OpenCode : fournisseur/modèle (ex. anthropic/claude-sonnet-4-6). Laissez vide pour le défaut.",
          },
          taskTitle: {
            label: "Titre de la tâche",
            description:
              "Titre court pour archiver cette tâche (ex. « Corriger le bug de connexion »). Généré à partir du prompt s'il est omis.",
          },
          interactiveMode: {
            label: "Mode interactif",
            description:
              "false (PAR DÉFAUT) : s'exécute sans interface et renvoie toute la sortie à la fin. true : ouvre une fenêtre de terminal pour une session en direct ; le résultat est renvoyé automatiquement à la fin de la session.",
          },
          output: {
            label: "Sortie",
            description:
              "Stdout combiné du processus de l'agent de code. Vide si la tâche a été basculée en exécution d'arrière-plan (résultat injecté via wakeUp).",
          },
          durationMs: {
            label: "Durée (ms)",
            description: "Durée réelle totale d'exécution du processus.",
          },
          taskId: {
            label: "ID de la tâche",
            description:
              "En mode interactif : l'ID de suivi de la tâche. Le résultat est renvoyé automatiquement. En mode batch : absent (résultat renvoyé directement).",
          },
          hint: {
            label: "Indication",
            description:
              "Indique à l'IA comment le résultat lui sera transmis.",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description:
              "Paramètres de requête invalides : vérifiez le prompt et les champs",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Connexion requise : rôle admin nécessaire",
          },
          internal: {
            title: "Échec de l'exécution",
            description:
              "Le processus de l'agent de code n'a pas démarré ou a planté de façon inattendue",
          },
          binaryMissing: {
            title:
              "{{bin}} n'est pas installé sur cette instance : installez-le ou choisissez un autre agent de code",
            description:
              "Le binaire CLI de l'agent de code est introuvable dans le PATH de ce serveur",
          },
          internalExitCode: {
            title: "Échec de l'exécution (code {{exitCode}})",
            description:
              "Le processus de l'agent de code s'est terminé avec un code non nul",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès refusé : permissions insuffisantes",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource ou répertoire de travail introuvable",
          },
          vibeCoderRedirect: {
            title: "Utilisez plutôt ai-run avec vibe-coder",
            description:
              "L'agent de code est réglé sur vibe-coder. Utilisez l'outil ai-run avec la compétence vibe-coder.",
          },
          network: {
            title: "Erreur réseau",
            description:
              "Erreur réseau lors de la communication avec l'agent de code",
          },
          unknown: {
            title: "Erreur inconnue",
            description:
              "Une erreur inattendue s'est produite pendant l'exécution",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Conflit avec des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description:
              "Conflit d'exécution : une autre session est peut-être en cours",
          },
        },
        backButton: {
          label: "Retour",
        },
        submitButton: {
          label: "Envoyer",
          loadingText: "Envoi...",
        },
        success: {
          title: "Agent de code terminé",
          description:
            "Le processus de l'agent de code s'est terminé avec succès. Si la sortie est vide, le résultat arrivera par injection dans le fil.",
        },
        widget: {
          runningBatch: "Exécution...",
          runningInteractive:
            "Ouverture de la session de terminal interactive...",
          escalated:
            "Exécution en arrière-plan : le résultat sera injecté à la fin.",
          taskIdLabel: "ID de la tâche",
          outputLabel: "Sortie",
          interactiveSessionLaunched:
            "Session interactive lancée dans le terminal.",
          copyOutput: "Copier",
          copied: "Copié !",
          interactive: "Interactif",
          emptyPromptHint:
            "Saisissez un prompt ci-dessous pour lancer l'agent de code",
        },
      },
    },
  },
};
