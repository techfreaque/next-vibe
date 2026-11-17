import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des serveurs",
  tags: {
    imagePush: "Push d'image",
  },
  post: {
    title: "Build et push de l'image",
    titleShort: "Push de l'image",
    description:
      "Construire l'image Docker de production et la livrer au registre ou directement à un serveur via SSH, pour que le serveur de déploiement se contente de la récupérer (ou l'ait déjà) au lieu de la construire",
    form: {
      title: "Configuration du push d'image",
      description: "Définir le nom de l'image, le tag et la plateforme cible",
      submit: "Build et push",
      runAgain: "Relancer",
    },
    fields: {
      image: {
        title: "Image",
        description:
          "Registre + nom de l'image à construire et pousser. Par défaut : DOCKER_IMAGE_NAME de votre .env.",
      },
      commit: {
        title: "Commit",
        description:
          "Commit à construire : un sha, un tag ou un nom de branche. Par défaut : HEAD de la branche courante. Seul le code commité est livré. Les changements non commités de l'arbre de travail ne sont jamais inclus.",
      },
      tag: {
        title: "Tag",
        description:
          "Tag de l'image. Par défaut : le sha court du commit construit. Le sha court et 'latest' sont toujours tagués aussi.",
      },
      push: {
        title: "Push",
        description:
          "Pousser vers le registre (ou transférer vers la cible SSH) après le build. Désactivez pour un build local uniquement : pas de push, pas de transfert SSH, pas de déploiement.",
      },
      platform: {
        title: "Plateforme",
        description:
          "Plateforme cible du build (docker buildx --platform). Doit correspondre à l'architecture du serveur de déploiement, en général linux/amd64.",
      },
      sshTarget: {
        title: "Cible SSH",
        description:
          "user@host vers lequel transférer l'image directement par SSH au lieu d'un registre (ex. root@203.0.113.5). Par défaut : SSH_SERVER s'il est défini. Essaie d'abord la clé SSH_SERVER_KEY, puis SSH_SERVER_PWD comme mot de passe de secours ; sans les deux, votre propre clé/config SSH. Laissez vide pour pousser vers le registre.",
      },
      secondary: {
        title: "Déployer le serveur 2",
        description:
          "Une fois le serveur 1 en ligne et sain, déployer aussi le second nœud HA (SSH_SERVER2) : charger l'image sous SSH_SERVER2_IMAGE_TAG (jamais :latest), synchroniser le .env du serveur 1, recréer, vérifier la santé, rollback automatique. Pendant ce temps, le Caddy de chaque machine sert depuis l'autre, donc personne ne voit de coupure. Ignoré si SSH_SERVER2 n'est pas défini ou si --sshTarget est fourni.",
      },
      primary: {
        title: "Déployer le serveur 1",
        description:
          "Activé par défaut. Désactivé = le serveur 1 est hors service ou isolé après un failover : l'image part de cette machine directement vers le serveur 2 (SSH_SERVER2) et seul ce nœud est déployé, en gardant son propre .env et ses overrides de failover. Lent (upload depuis la maison, pas de relais de machine à machine).",
      },
      drain: {
        title: "Drainer avant le redémarrage",
        description:
          "Activé par défaut (les deux nœuds HA). Chaque nœud sort d'abord de la rotation (Caddy envoie les nouvelles requêtes au pair, le DNS le retire), termine ses streams IA et tâches en cours, transfère ses clients WebSocket, et seulement ensuite reçoit la nouvelle image. Le serveur 1 d'abord, puis le serveur 1 reprend le trafic pendant que le serveur 2 se draine. Désactivé = recréer sans attendre (ancien comportement).",
      },
      drainTimeout: {
        title: "Délai de drainage (secondes)",
        description:
          "Durée maximale pendant laquelle un nœud attend la fin de son travail IA en cours avant le redémarrage. Ce qui tourne encore passe alors par le drainage d'arrêt (STREAM_DRAIN_TIMEOUT_MS) et est interrompu, contenu partiel sauvegardé.",
      },
      cleanup: {
        title: "Nettoyer en local",
        description:
          "Activé par défaut. Après un run réussi, garde CETTE machine de build sous contrôle : retire les tags des builds locaux de ghcr.io/techfreaque/next-vibe-app plus anciens que les 3 plus récents (jamais :latest, :rollback, :prod-current-good, le build tout juste déployé ni une image utilisée par un conteneur), purge le cache de build Docker de plus de 48h et déplace les anciens exports .tmp/image-build vers .tmp/todelete/image-build/. Sous 40 Go libres sur la racine Docker, purge aussi avant le build. Les serveurs de prod ont leur propre option (remoteCleanup). Désactivé = avertissement uniquement.",
      },
      remoteCleanup: {
        title: "Nettoyer les serveurs de prod",
        description:
          "Activé par défaut. Une fois un nœud déployé et son health check passé, ne garde sur ce serveur que : l'image utilisée par chaque conteneur, ses tags de rollback (serveur 1 :latest, :rollback, :prod-current-good ; serveur 2 :unbottled, :unbottled-rollback, :unbottled-prev et le :latest du site co-hébergé) et les 3 builds les plus récents de ghcr.io/techfreaque/next-vibe-app. Les tags plus anciens partent avec un simple docker rmi (jamais -f, docker refuse les images utilisées), puis les images orphelines sont purgées. Avant chaque chargement, sous 30 Go libres, la même rétention s'applique. Uniquement les serveurs HA configurés, jamais un --sshTarget explicite. Désactivé = avertissement uniquement.",
      },
      success: {
        title: "Succès",
      },
      output: {
        title: "Sortie",
      },
      resolvedImage: {
        title: "Image",
      },
      tags: {
        title: "Tags poussés",
      },
      duration: {
        title: "Durée (ms)",
      },
    },
    errors: {
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de push d'image invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Échec de la connexion réseau pendant le push de l'image",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour construire et pousser l'image",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Vous n'avez pas la permission de construire et pousser l'image",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources du push d'image introuvables",
      },
      server: {
        title: "Erreur serveur",
        description: "Échec du build ou du push Docker",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant le push de l'image",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit détecté pendant le push de l'image",
      },
      unsavedChanges: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant le push de l'image",
      },
    },
    success: {
      title: "Image poussée",
      description: "Image Docker construite et poussée",
    },
    repository: {
      messages: {
        buildStart: "🐳 Build de {{image}}:{{tag}} ...",
        buildSuccess: "✅ {{refs}} construit (non poussé)",
        pushSuccess: "🚀 {{refs}} poussé",
        buildExitCode: "docker buildx s'est terminé avec le code {{code}}",
        buildKilled: "docker buildx a été tué par le signal {{signal}}",
        dockerBuildFailed: "Échec du build Docker : {{error}}",
        commitResolveFailed: "Impossible de résoudre le commit '{{ref}}'",
        commitResolveFailedDetail:
          "Impossible de résoudre le commit '{{ref}}' : {{error}}",
        commitResolved: "📌 Build du commit {{sha}} ({{ref}}) : {{subject}}",
        dirtyTreeWarning:
          "⚠️ L'arbre de travail contient {{count}} changement(s) non commité(s). Ils sont EXCLUS de l'image. Seul le commit {{sha}} est construit.",
        deployedShaRecorded:
          "📝 Commit déployé {{sha}} enregistré dans {{path}}",
        deployedShaRecordFailed:
          "Déploiement réussi, mais l'écriture de {{path}} a échoué : {{error}}",
        exportStart: "📦 Export du commit {{sha}} vers {{dir}} ...",
        exportReused:
          "📦 Réutilisation de l'arbre exporté pour {{sha}} dans {{dir}}",
        exportFailed: "Échec de l'export du commit {{sha}} : {{error}}",
        sshTransferStart:
          "📡 Transfert de {{refs}} vers {{target}} via ssh ...",
        sshTransferSuccess: "🚀 {{refs}} transféré vers {{target}} via ssh",
        sshTransferFailed: "Échec du transfert ssh vers {{target}} : {{error}}",
        scriptSynced:
          "📜 {{script}} synchronisé sur {{target}} depuis le commit {{sha}}",
        scriptSyncFailed:
          "Échec de la synchronisation de {{script}} vers {{target}}, déploiement annulé : {{error}}",
        scriptMissing: "{{path}} est absent du commit {{sha}}",
        scriptSyntaxInvalid:
          "bash -n a rejeté {{path}} du commit {{sha}}. Script en place inchangé.",
        scriptRemoteExit:
          "la commande distante s'est terminée avec le code {{code}}",
        secondaryStart:
          "🔁 Serveur 1 en ligne. Déploiement du serveur 2 ({{target}}) ...",
        secondarySuccess:
          "🚀 {{refs}} déployé sur {{target}} et sur le serveur 2 ({{secondary}})",
        secondaryOnlyMissing:
          "--primary=false ne déploie que le serveur 2, mais SSH_SERVER2 n'est pas défini",
        secondaryOnlySuccess:
          "🚀 Serveur 1 ignoré. {{refs}} déployé sur le serveur 2 ({{secondary}})",
        secondaryOnlyFailed:
          "Échec du déploiement du serveur 2 seul ({{secondary}}) : {{error}}. Le serveur 2 a gardé ou restauré son image précédente.",
        secondaryFailed:
          "Le serveur 1 ({{target}}) est EN LIGNE sur la nouvelle image, mais le déploiement du serveur 2 ({{secondary}}) a échoué : {{error}}. Le serveur 2 a gardé ou restauré son image précédente.",
        drainStart:
          "🚰 Drainage de {{node}} : le nouveau trafic va au pair, le travail IA en cours dispose de {{timeout}} s maximum",
        drainSwap:
          "🔀 {{from}} est en ligne sur la nouvelle image et reprend le trafic. Drainage de {{to}} ({{timeout}} s maximum)",
        drainUndrained:
          "{{node}} est de retour dans la rotation sur son image précédente",
        drainLeftDrained:
          "{{node}} reste DRAINÉ (hors rotation, le pair sert tout) : {{error}}. Corrigez, puis lancez sur les deux machines : bash scripts/ha-node-drain.sh edge-off {{node}}",
        drainPreflightFailed:
          "La pré-vérification du drainage sur {{target}} a refusé le déploiement, rien n'a été modifié : {{error}}",
        drainScriptMissing:
          "scripts/ha-node-drain.sh est absent du commit {{sha}} : déploiement sans drainage",
        drainStepFailed:
          "Échec de ha-node-drain.sh {{step}} sur {{target}} : {{error}}",
        envSyncFailed:
          "Échec de la copie du .env du serveur 1 vers le serveur 2 : {{error}}",
        cleanupSkippedImage:
          "🧹 Nettoyage local ignoré : {{image}} n'est pas {{allowed}}",
        cleanupListFailed:
          "Nettoyage local ignoré, impossible de lister les images de {{image}} : {{error}}",
        cleanupTagFailed:
          "Impossible de supprimer {{ref}} en local : {{error}}",
        cleanupTagsRemoved:
          "🧹 {{count}} ancienne(s) référence(s) locale(s) de {{image}} supprimée(s), {{keep}} builds les plus récents conservés : {{tags}}",
        cleanupCachePruned:
          "🧹 Cache de build Docker de plus de {{hours}}h purgé ({{reclaimed}} récupérés)",
        cleanupCacheFailed:
          "Échec de la purge du cache de build Docker : {{error}}",
        cleanupExportsParked:
          "🧹 {{count}} ancien(s) export(s) de commit déplacé(s) vers {{dir}}",
        cleanupExportFailed:
          "Échec du déplacement de l'ancien export de commit {{dir}} : {{error}}",
        diskLow:
          "⚠️ Seulement {{free}} Go libres sur {{path}} (minimum {{min}} Go). Purge des anciennes images locales et du cache de build avant le build ...",
        diskLowNoCleanup:
          "⚠️ Seulement {{free}} Go libres sur {{path}} (minimum {{min}} Go). Nettoyage désactivé, rien n'est purgé. Le build risque de remplir le disque.",
        diskAfterPrune: "💽 {{free}} Go libres sur {{path}} après la purge",
        diskCheckFailed:
          "Impossible de lire l'espace libre sur {{path}} : {{error}}",
        remoteDiskOk: "💽 {{target}} : {{free}} Go libres avant le chargement",
        remoteDiskLow:
          "⚠️ {{target}} : seulement {{free}} Go libres (minimum {{min}} Go). Suppression des anciennes images avant le chargement ...",
        remoteDiskLowNoCleanup:
          "⚠️ {{target}} : seulement {{free}} Go libres (minimum {{min}} Go). remoteCleanup est désactivé, rien n'est supprimé. Le chargement risque de remplir le disque.",
        remoteDiskAfter:
          "💽 {{target}} : {{free}} Go libres après la rétention",
        remoteListFailed:
          "Rétention des images sur {{target}} ignorée, rien n'a été supprimé : {{error}}",
        remoteTagFailed:
          "{{target}} : impossible de supprimer {{ref}} : {{error}}",
        remoteRetained:
          "🧹 {{target}} : {{count}} ancienne(s) référence(s) d'image supprimée(s), {{keep}} builds les plus récents conservés ainsi que les tags de rollback et les images utilisées : {{tags}}. Purge des orphelines : {{pruned}}",
      },
    },
  },
};
