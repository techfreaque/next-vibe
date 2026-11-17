import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Exécuteur de release",

  errors: {
    configNotLoaded:
      "Configuration non chargée. Chargez d'abord la configuration.",
    configFileNotFound: "Fichier de configuration introuvable : {{path}}",
    configFileNotFoundInParents:
      "Fichier de configuration '{{filename}}' introuvable dans le répertoire courant et ses répertoires parents",
    invalidConfigFormat:
      "Format de configuration invalide. La configuration doit exporter par défaut un objet avec une propriété 'packages'.",
    errorLoadingConfig: "Erreur de chargement de la configuration :",
  },

  releaseExecutor: {
    processing: "\n🚀 Traitement : {{directory}}",
    executing: "Exécution : {{command}}",
    completed: "✅ Terminé : {{directory}}",
    failed: "❌ Échec du traitement de {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Reprise depuis l'état précédent...",
      noState: "Aucun état existant, démarrage à neuf...",
      allCompleted: "Toutes les cibles ont été traitées !",
    },

    prompts: {
      retryFailed: "Relancer les {{count}} cibles en échec ?",
      targetAction: "Que faire de {{directory}} ?",
      processTarget: "Traiter cette cible",
      skipTarget: "Ignorer cette cible",
      abortOperation: "Annuler toute l'opération",
      continueAfterFailure: "Continuer avec les cibles restantes ?",
    },

    actions: {
      skipped: "⏭️  Ignoré : {{directory}}",
      aborted: "Opération annulée par l'utilisateur",
      stopped: "Opération arrêtée suite à un échec",
      continuing: "Poursuite avec les cibles restantes...",
    },

    summary: {
      title: "\n📊 Bilan final :",
      allSuccess: "🎉 Toutes les cibles ont été traitées !",
      failedTargets:
        "⚠️  {{count}} cibles en échec. Utilisez --continue pour relancer.",
    },

    forceUpdate: {
      starting: "🔄 Mise à jour forcée des dépendances de toutes les cibles...",
      updating: "\n📦 Mise à jour : {{directory}}",
      updated: "✅ Mis à jour : {{directory}}",
      failed: "❌ Échec de la mise à jour de {{directory}}",
      completed: "🎉 Mise à jour forcée terminée pour toutes les cibles !",
    },

    forceRelease: {
      starting:
        "🚀 Release forcée de toutes les cibles avec un bump de version {{versionBump}}...",
    },

    weeklyUpdate: {
      starting: "📅 Démarrage de la mise à jour hebdomadaire...",
      targetBranch: "Branche cible : {{branchName}}",
      creatingBranch: "🌿 Création de la branche de mise à jour...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages:
        "🔄 Mise à jour des dépendances de tous les packages...",
      runningSnyk: "🔍 Lancement de la surveillance de sécurité Snyk...",
      noChanges:
        "📝 Aucun changement détecté, commit et création de PR ignorés",
      committing: "💾 Commit des changements...",
      pushing: "📤 Push de la branche...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: "📝 Création/mise à jour de la pull request...",
      completed: "🎉 Mise à jour hebdomadaire terminée !",
      failed: "❌ Échec de la mise à jour hebdomadaire :",
    },

    snyk: {
      noCredentials:
        "⚠️  Identifiants Snyk introuvables, surveillance de sécurité ignorée",
      monitoring: "🔍 Surveillance de {{packageName}}...",
      failed:
        "⚠️  Échec de la surveillance Snyk pour {{packageFile}}, on continue...",
    },

    github: {
      noToken: "⚠️  GITHUB_TOKEN introuvable, création de PR ignorée",
      prFailed: "⚠️  Échec de la création de la PR, on continue...",
      prError: "Erreur de création de la PR :",
      prSuccess: "✅ PR créée/mise à jour",
    },

    git: {
      findCommand:
        'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },

  cloneMissing: {
    checking: "🔍 Recherche des dépôts manquants...",
    failedToClone: "❌ Échec du clonage de {{repoPath}}",
    noMissing: "✅ Aucun dépôt manquant",
    success: "✅ {{count}} dépôts clonés",
    failed: "❌ Échec du clonage de {{count}} dépôts :",
    failedRepo: "  - {{repo}}",
  },

  updateAll: {
    updating: "🔄 Mise à jour de tous les dépôts...",
    failedClone:
      "⚠️  Échec du clonage de {{repoPath}}, poursuite avec les autres dépôts...",
    failedUpdate:
      "⚠️  Échec de la mise à jour de {{repoPath}}, poursuite avec les autres dépôts...",
    clonedSuccess: "✅ {{count}} dépôts manquants clonés.",
    updatedSuccess: "✅ {{count}} dépôts existants mis à jour.",
    cloneFailed: "❌ Échec du clonage de {{count}} dépôts :",
    updateFailed: "❌ Échec de la mise à jour de {{count}} dépôts :",
    failedRepo: "   - {{repo}}",
  },
};
