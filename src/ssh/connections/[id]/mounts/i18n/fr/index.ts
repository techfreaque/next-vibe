import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "Aucune ligne renvoyée par l'insertion",
    notYourConnection: "Cette connexion ne vous appartient pas",
    mountNotFound: "Montage introuvable",
  },

  list: {
    title: "Répertoires montés",
    titleShort: "Montages",
    description:
      "Raccourcis de répertoires nommés pour cette connexion. Chaque montage apparaît sous /ssh/<connection>/<name>/ dans cortex. Les terminaux démarrent dans le répertoire du montage par défaut.",
    fields: {
      connectionId: {
        label: "Connexion",
        description: "La connexion SSH à laquelle appartiennent ces montages",
      },
    },
    response: {
      mounts: { title: "Montages" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez la saisie et réessayez",
      },
      unauthorized: { title: "Non autorisé", description: "Connexion requise" },
      forbidden: { title: "Interdit", description: "Accès refusé" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les montages",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Ce nom de montage existe déjà sur cette connexion",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
    },
    success: {
      title: "Montages chargés",
      description: "Montages de répertoires de cette connexion",
    },
  },

  create: {
    title: "Ajouter un montage",
    titleShort: "Ajouter un montage",
    description:
      "Ajouter un raccourci de répertoire nommé. Le nom devient un segment de chemin : /ssh/<connection>/<name>/",
    fields: {
      connectionId: {
        label: "ID de connexion",
        description: "La connexion SSH à laquelle ajouter le montage",
      },
      path: {
        label: "Chemin du répertoire",
        description:
          "Chemin absolu sur la machine, ex. /home/max/project. Segment cortex = nom de base. Répertoire de travail par défaut du terminal quand c'est le montage par défaut.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Montage par défaut",
        description:
          "Les nouvelles sessions de terminal démarrent dans ce répertoire. Un seul montage par défaut par connexion.",
      },
    },
    response: {
      id: { title: "ID du montage" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les champs du formulaire et réessayez",
      },
      unauthorized: { title: "Non autorisé", description: "Connexion requise" },
      forbidden: { title: "Interdit", description: "Accès refusé" },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'enregistrer le montage",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Nom déjà pris",
        description: "Un montage porte déjà ce nom sur cette connexion",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
    },
    success: {
      title: "Montage ajouté",
      description: "Le montage de répertoire a été ajouté",
    },
  },

  detail: {
    titleGet: "Montage",
    titleShortGet: "Montage",
    descriptionGet: "Afficher un raccourci de répertoire monté.",
    titlePatch: "Modifier le montage",
    titleShortPatch: "Modifier le montage",
    descriptionPatch: "Renommer ou déplacer un raccourci de répertoire monté.",
    titleDelete: "Retirer le montage",
    titleShortDelete: "Retirer le montage",
    descriptionDelete:
      "Retirer un raccourci de répertoire monté de cette connexion.",
    fields: {
      mountId: {
        label: "ID du montage",
        description: "Identifiant unique de ce montage",
      },
      path: {
        label: "Chemin du répertoire",
        description:
          "Chemin absolu sur la machine. Segment cortex = nom de base.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Montage par défaut",
        description:
          "Les nouvelles sessions de terminal démarrent dans ce répertoire",
      },
    },
    response: {
      id: { title: "ID du montage" },
      name: { title: "Nom" },
      path: { title: "Chemin" },
      isDefault: { title: "Par défaut" },
      createdAt: { title: "Créé" },
      updatedAt: { title: "Modifié" },
      deleted: { title: "Supprimé" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez la saisie et réessayez",
      },
      unauthorized: { title: "Non autorisé", description: "Connexion requise" },
      forbidden: { title: "Interdit", description: "Accès refusé" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de modifier le montage",
      },
      notFound: { title: "Introuvable", description: "Montage introuvable" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Nom déjà pris",
        description: "Un montage porte déjà ce nom sur cette connexion",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
    },
    successGet: { title: "Montage chargé", description: "Détails du montage" },
    successPatch: {
      title: "Montage modifié",
      description: "Le montage a été modifié",
    },
    successDelete: {
      title: "Montage retiré",
      description: "Le montage a été retiré",
    },
    widget: {
      confirmDelete: "Retirer ce montage ?",
    },
  },

  widget: {
    noMounts: "Aucun montage configuré",
    noMountsHint:
      "Ajoutez un montage pour créer un raccourci de répertoire. Les terminaux démarreront dans le répertoire du montage par défaut.",
    addMount: "Ajouter un montage",
    defaultBadge: "par défaut",
    cortexPath: "Chemin cortex",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
