import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Lister un dossier",
    titleShort: "Lister les fichiers",
    description: "Voir le contenu d'un dossier.",
    dynamicTitle: "{{path}} listé",
    status: {
      loading: "Listage...",
      done: "Listé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description:
          "Dossier à lister. /ssh → toutes les machines. /ssh/<name>/ → fichiers ou montages. /ssh/<name>/<mount>/ → contenu du montage.",
      },
    },
    submitButton: {
      label: "Parcourir",
      loadingText: "Chargement...",
    },
    emptyState: "Ce dossier est vide",
    folderNames: {
      memories: "Mémoires",
      documents: "Documents",
      threads: "Fils",
      skills: "Skills",
      tasks: "Tâches",
      uploads: "Fichiers envoyés",
      searches: "Recherches",
      gens: "Médias générés",
      favorites: "Favoris",
      inbox: "Boîte de réception",
      projects: "Projets",
      knowledge: "Connaissances",
      journal: "Journal",
      templates: "Modèles",
      identity: "Identité",
      expertise: "Expertise",
      context: "Contexte",
    },
    response: {
      path: { content: "Chemin" },
      entries: {
        name: { content: "Nom" },
        path: { content: "Chemin" },
        nodeType: { text: "Type" },
        size: { text: "Taille" },
        updatedAt: { content: "Mis à jour" },
      },
      total: { text: "Total" },
      writable: { text: "Modifiable" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez pas voir ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier n'existe pas",
      },
      server: {
        title: "Erreur serveur",
        description: "Quelque chose a planté",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: { title: "Conflit", description: "Réessayez" },
    },
    success: {
      title: "Listé",
      description: "Voici le contenu",
    },
  },
};
