import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Écrire un fichier",
    titleShort: "Écrire le fichier",
    description:
      "Enregistre un fichier. Donnez un chemin et un contenu, c'est tout.",
    dynamicTitle: "Enregistré : {{path}}",
    status: {
      loading: "Écriture...",
      done: "Enregistré",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description:
          "Où enregistrer. Racines françaises : /memoires/, /documents/. Exemple : /documents/notes/idees.md",
      },
      content: {
        label: "Contenu",
        description: "Ce qu'il faut écrire (markdown)",
      },
      createParents: {
        label: "Créer les dossiers",
        description: "Créer les dossiers manquants au passage",
      },
    },
    submitButton: {
      label: "Enregistrer",
      loadingText: "Enregistrement...",
    },
    response: {
      path: { content: "Chemin" },
      size: { text: "Taille" },
      created: { text: "Nouveau fichier" },
      updated: { text: "Mis à jour" },
      updatedAt: { content: "Mis à jour" },
      content: { content: "Contenu" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin et le contenu",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Lecture seule",
        description: "Ce chemin est en lecture seule",
      },
      notFound: {
        title: "Dossier manquant",
        description: "Le dossier parent n'existe pas",
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
      conflict: {
        title: "Existe déjà",
        description: "Il y a déjà quelque chose ici",
      },
    },
    success: {
      title: "Enregistré",
      description: "Fichier enregistré",
    },
  },
};
